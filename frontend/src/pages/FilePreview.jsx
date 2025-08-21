import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import styled from "styled-components";
import { apiFetch } from "../utils/request";

function FilePreview() {
  const [language, setLanguage] = useState("java"); // 新增语言选择状态

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

  // 新增运行相关状态
  const [runLoading, setRunLoading] = useState(false);
  const [runResult, setRunResult] = useState("");

  // 新增版本相关状态
  const [showHistory, setShowHistory] = useState(false);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [historyList, setHistoryList] = useState([]);
  const [historyError, setHistoryError] = useState("");
  const [selectedVersion, setSelectedVersion] = useState(null);

  // 新增运行方法
  const handleRun = async () => {
    setRunLoading(true);
    setRunResult("");
    setDebugMsg("正在提交文件内容到后端进行编译...");
    try {
      const res = await apiFetch(`/compiler/${language}`, {
        method: "POST",
        headers: {
          "Content-Type": "text/plain",
          Authorization: localStorage.getItem("token"),
        },
        body: content,
      });
      const resultText = await res.text();
      setRunResult(resultText);
      setDebugMsg("编译完成，已显示运行结果");
    } catch (err) {
      setRunResult("编译失败：" + (err?.message || "未知错误"));
      setDebugMsg("编译失败：" + (err?.message || "未知错误"));
    } finally {
      setRunLoading(false);
    }
  };

  // 切换显示历史列表（只在打开时调用 fetchHistory）
  const handleShowHistory = () => {
    setShowHistory((v) => {
      const next = !v;
      if (next) {
        // 打开时再请求最新的历史列表
        fetchHistory();
      }
      return next;
    });
  };

  // 抽离：仅获取历史列表（可被多次调用）
  const fetchHistory = async () => {
    setHistoryLoading(true);
    setHistoryError("");
    try {
      const res = await apiFetch(`/file/history?fileid=${fileid}`, {
        method: "GET",
        headers: {
          Authorization: localStorage.getItem("token"),
        },
      });
      const data = await res.json();
      if (data && data.code === 0) {
        setHistoryList(data.data || []);
      } else {
        setHistoryError(data.message || "获取历史版本失败");
      }
    } catch (err) {
      setHistoryError("获取历史版本失败：" + (err?.message || "未知错误"));
    } finally {
      setHistoryLoading(false);
    }
  };

  // 查看某个版本内容（确保带 version）
  const handleSelectVersion = async (item) => {
    setSelectedVersion(item.version);
    setLoading(true);
    const url = `/file?fileid=${fileid}`;
    apiFetch(url, {
      method: "GET",
      headers: {
        Authorization: localStorage.getItem("token"),
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setContent(data.data || "");
        setDebugMsg(`已切换到版本 ${item.version}`);
      })
      .catch((err) => {
        setDebugMsg("获取版本内容失败：" + (err?.message || "未知错误"));
      })
      .finally(() => setLoading(false));
  };

  // 切换到指定版本（切换后强制刷新历史和当前文件内容，并清除选中状态）
  const handleRollback = async () => {
    if (!selectedVersion) {
      setDebugMsg("请先选择要切换的版本");
      return;
    }
    if (!window.confirm(`确定要切换到版本 ${selectedVersion} 吗？此操作不可撤销！`)) return;
    setDebugMsg("正在切换版本...");
    try {
      await apiFetch(`/file/back?fileid=${fileid}&version=${selectedVersion}`, {
        method: "GET",
        headers: {
          Authorization: localStorage.getItem("token"),
        },
      });
      setDebugMsg(`已切换到版本 ${selectedVersion}`);
      // 切换成功后：清除选中版本，刷新历史列表和当前内容
      setSelectedVersion(null);
      await fetchHistory();
      setLoading(true);
      const fileRes = await apiFetch(`/file?fileid=${fileid}`, {
        method: "GET",
        headers: {
          Authorization: localStorage.getItem("token"),
        },
      });
      const fileData = await fileRes.json();
      setContent(fileData.data || "");
      setLoading(false);
    } catch (err) {
      setDebugMsg("切换失败：" + (err?.message || "未知错误"));
    }
  };

  useEffect(() => {
    if (!fileid) return;
    setLoading(true);
    apiFetch(`/file?fileid=${fileid}`, {
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
  }, [fileid]);

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
          path: editValue,
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
        }}
      >
        返回
      </BackButton>
      <Title>文件预览</Title>
      <div style={{ marginBottom: 16 }}>
        <label htmlFor="lang-select" style={{ marginRight: 8 }}>
          选择语言：
        </label>
        <select id="lang-select" value={language} onChange={(e) => setLanguage(e.target.value)} style={{ padding: "6px 12px", borderRadius: 4, border: "1px solid #e5e7eb" }}>
          <option value="java">Java</option>
          <option value="c">c++</option>
        </select>
      </div>
      <Button onClick={handleShowHistory} style={{ marginBottom: 12 }}>
        {showHistory ? "隐藏版本列表" : "显示版本列表"}
      </Button>
      {showHistory && (
        <HistoryBox>
          {historyLoading ? (
            <LoadingText>加载版本列表中...</LoadingText>
          ) : historyError ? (
            <DebugInfo>{historyError}</DebugInfo>
          ) : historyList.length === 0 ? (
            <DebugInfo>暂无历史版本</DebugInfo>
          ) : (
            <ul>
              {historyList.map((item) => (
                <li key={item.version} style={{ marginBottom: 8 }}>
                  <VersionBtn onClick={() => handleSelectVersion(item)} disabled={selectedVersion === item.version}>
                    {item.version} - {item.path}
                  </VersionBtn>
                  {selectedVersion === item.version && (
                    <>
                      <ButtonGray style={{ marginLeft: 8 }} onClick={handleRollback}>
                        切换到此版本
                      </ButtonGray>
                    </>
                  )}
                </li>
              ))}
            </ul>
          )}
        </HistoryBox>
      )}
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
          <Button onClick={handleRun} disabled={runLoading} style={{ marginLeft: 8 }}>
            {runLoading ? "运行中..." : "运行"}
          </Button>
          <DebugInfo>{debugMsg}</DebugInfo>
          {runResult && (
            <div style={{ display: "flex", alignItems: "flex-start", marginTop: 18 }}>
              <span style={{ minWidth: 80, color: "#6366f1", fontWeight: 500, fontSize: 13 }}>运行结果：</span>
              <DebugInfo style={{ marginTop: 0 }}>{runResult}</DebugInfo>
            </div>
          )}
        </>
      )}
    </Container>
  );
}

const HistoryBox = styled.div`
  background: #f9fafb;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  padding: 16px;
  margin-bottom: 18px;
`;

const VersionBtn = styled.button`
  padding: 4px 12px;
  background: #e0e7ff;
  color: #3730a3;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 13px;
  margin-right: 8px;
  &:disabled {
    background: #c7d2fe;
    color: #6366f1;
    cursor: default;
  }
`;

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
