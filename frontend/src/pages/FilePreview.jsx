import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import styled from "styled-components";
import { apiFetch } from "../utils/request";

function FilePreview() {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const path = searchParams.get("path");
  const fileid = searchParams.get("fileid");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [editValue, setEditValue] = useState("");
  const [saving, setSaving] = useState(false);
  const [debugMsg, setDebugMsg] = useState(""); // 新增调试信息

  useEffect(() => {
    if (!path) return;
    setLoading(true);
    apiFetch(`/file?path=${path}`, {
      method: "GET",
      headers: {
        Authorization: localStorage.getItem("token"),
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setContent(data.data || "");
      })
      .finally(() => setLoading(false));
  }, [path]);

  const handleEdit = () => {
    setEditValue(content);
    setEditing(true);
    setDebugMsg(""); // 清空调试信息
  };

  const handleSave = async () => {
    setSaving(true);
    setDebugMsg("正在提交到后端...");
    try {
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      const res = await apiFetch("/file/update", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: localStorage.getItem("token"),
        },
        body: JSON.stringify({
          fileid: fileid,
          newcode: editValue,
          editor: user.userid || user.id,
          message: "更新文件内容",
        }),
      });
      const resp = await res.json();
      if (resp && resp.code === 0) {
        setDebugMsg("修改成功！");
        setContent(editValue);
      } else {
        setDebugMsg(resp.message || "修改失败");
      }
      console.log("提交结果:", resp);
      console.log("提交的内容:", editValue);
    } catch (err) {
      setDebugMsg("提交失败：" + (err?.message || "未知错误"));
      alert("保存失败");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Container>
      <BackButton
        onClick={() => {
          window.history.length > 1 ? window.history.back() : window.location.replace(document.referrer || "/repos");
        }}>
        返回
      </BackButton>
      <Title>文件预览</Title>
      {loading ? (
        <LoadingText>加载中...</LoadingText>
      ) : editing ? (
        <>
          <Textarea value={editValue} onChange={(e) => setEditValue(e.target.value)} spellCheck={false} />
          <Button onClick={handleSave} disabled={saving}>
            {saving ? "保存中..." : "保存"}
          </Button>
          <ButtonGray onClick={() => setEditing(false)}>取消</ButtonGray>
          <DebugInfo>{debugMsg}</DebugInfo>
        </>
      ) : (
        <>
          <RawContent>{content}</RawContent>
          <Button onClick={handleEdit}>修改文件</Button>
          <DebugInfo>{debugMsg}</DebugInfo>
        </>
      )}
    </Container>
  );
}

const BackButton = styled.button`
  margin-bottom: 16px;
  padding: 6px 16px;
  background: #e5e7eb;
  color: #4f46e5;
  border: none;
  border-radius: 6px;
  font-weight: 500;
  cursor: pointer;
  font-size: 14px;
  transition: background 0.2s;
  &:hover {
    background: #d1d5db;
  }
`;

const Container = styled.div`
  max-width: 800px;
  margin: 40px auto;
  padding: 24px;
  background: #fff;
  border-radius: 8px;
`;

const Title = styled.h2`
  font-size: 1.3rem;
  font-weight: 600;
  margin-bottom: 24px;
  color: #24292f;
`;

const LoadingText = styled.div`
  text-align: center;
  color: #6b7280;
  padding: 40px 0;
`;

const RawContent = styled.pre`
  background: #f3f4f6;
  padding: 16px;
  border-radius: 6px;
  font-size: 14px;
  white-space: pre-wrap;
  word-break: break-all;
  font-family: "Menlo", "Monaco", "Consolas", monospace;
`;

const Textarea = styled.textarea`
  width: 100%;
  min-height: 300px;
  font-family: "Menlo", "Monaco", "Consolas", monospace;
  font-size: 14px;
  margin-bottom: 16px;
  border: 1px solid #e1e5e9;
  border-radius: 6px;
  padding: 12px;
  resize: vertical;
`;

const Button = styled.button`
  margin-right: 12px;
  padding: 8px 20px;
  background: #4f46e5;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
`;

const ButtonGray = styled.button`
  padding: 8px 20px;
  background: #e5e7eb;
  color: #24292f;
  border: none;
  border-radius: 4px;
  cursor: pointer;
`;

const DebugInfo = styled.div`
  margin-top: 18px;
  color: #6366f1;
  font-size: 13px;
`;

export default FilePreview;
