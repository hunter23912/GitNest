import React, { useState, useEffect } from "react";
import { useLocation, useParams, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { FaFolder, FaFile } from "react-icons/fa";
import { apiFetch } from "../utils/request";

function RepoDetail() {
  const location = useLocation();
  const { username, reponame } = useParams(); // 新增：获取路由参数
  const [files, setFiles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const [renamingId, setRenamingId] = useState(null);
  const [renameValue, setRenameValue] = useState("");
  const [renameLoading, setRenameLoading] = useState(false);

  const navigate = useNavigate();

  // 新增：重命名文件方法
  const handleRename = async (fileid, oldName) => {
    if (!renameValue.trim() || renameValue === oldName) {
      alert("请输入新的文件名");
      return;
    }
    setRenameLoading(true);
    try {
      const token = localStorage.getItem("token");
      const fileObj = files.find((f) => (f.fileid || f.id) === fileid);
      const oldPath = fileObj?.path || "";
      const newFilePath = oldPath.replace(/[^/]+$/, renameValue.trim());
      const editor = JSON.parse(localStorage.getItem("user") || "{}").userid;
      const res = await apiFetch("/file", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
        body: JSON.stringify({
          fileid,
          newFilePath,
          editor,
          filename: renameValue.trim(),
          message: `重命名文件为 ${renameValue.trim()}`,
        }),
      });
      const resp = await res.json();
      if (resp && resp.code === 0) {
        alert("文件重命名成功");
        refreshFiles(); // 刷新文件列表
        // 前端直接更新文件名和路径
        setFiles((prev) => prev.map((f) => ((f.fileid || f.id) === fileid ? { ...f, filename: renameValue.trim(), path: newFilePath } : f)));
        setRenamingId(null);
        setRenameValue("");
      } else {
        alert(resp.message || "重命名失败");
      }
    } catch (err) {
      alert("重命名失败，请重试");
    } finally {
      setRenameLoading(false);
    }
  };
  // 新增刷新方法，保证 setIsLoading(false) 一定执行
  const refreshFiles = async () => {
    setIsLoading(true);
    try {
      const searchParams = new URLSearchParams(location.search);
      const repoid = searchParams.get("repoid");
      const token = localStorage.getItem("token") || sessionStorage.getItem("token") || "";
      const res = await apiFetch(`/file/repo?repoid=${repoid}`, {
        method: "GET",
        headers: { Authorization: token },
      });
      const data = await res.json();
      if (data && data.code === 0) {
        setFiles(data.data);
      } else {
        setFiles([]);
      }
    } catch {
      setFiles([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    refreshFiles();
  }, [location.search]);

  // 新增：删除文件方法
  const handleDelete = async (fileid) => {
    if (!window.confirm("确定要删除该文件吗？")) return;
    try {
      const token = localStorage.getItem("token");
      const res = await apiFetch(`/file?fileid=${fileid}`, {
        method: "DELETE",
        headers: {
          Authorization: token,
        },
      });
      // 删除后刷新列表
      const searchParams = new URLSearchParams(location.search);
      const repoid = searchParams.get("repoid");
      // 重新获取文件列表
      setIsLoading(true);
      const refreshRes = await apiFetch(`/file/repo?repoid=${repoid}`, {
        method: "GET",
        headers: { Authorization: token },
      });
      const data = await refreshRes.json();
      if (data && data.code === 0) {
        setFiles(data.data);
      } else {
        setFiles([]);
      }
    } catch (err) {
      alert("删除失败，请重试");
    } finally {
      setIsLoading(false);
    }
  };

  const formatFileSize = (bytes) => {
    if (!bytes) return "";
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    return date.toLocaleString("zh-CN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <Container>
      <BackButton onClick={() => navigate("/repos")}>返回</BackButton>
      <Title>
        仓库文件列表
        <NewFileButton
          onClick={() => {
            const searchParams = new URLSearchParams(location.search);
            const repoid = searchParams.get("repoid");
            navigate(`/repo/create-file?repoid=${repoid}`);
          }}>
          新建文件
        </NewFileButton>
      </Title>
      {isLoading ? (
        <LoadingText>加载中...</LoadingText>
      ) : files.length === 0 ? (
        <EmptyText>
          暂无文件
          <br />
          <NewFileButton
            onClick={() => {
              const searchParams = new URLSearchParams(location.search);
              const repoid = searchParams.get("repoid");
              navigate(`/repo/create-file?repoid=${repoid}`);
            }}>
            新建文件
          </NewFileButton>
        </EmptyText>
      ) : (
        <FilesList>
          {files.map((file) => (
            <FileItem key={file.fileid || file.id}>
              <FileIcon>{file.path && file.path.endsWith("/") ? <FaFolder size={18} color='#79b8ff' /> : <FaFile size={18} color='#586069' />}</FileIcon>
              {renamingId === (file.fileid || file.id) ? (
                <RenameControls>
                  <input
                    type='text'
                    value={renameValue}
                    onChange={(e) => setRenameValue(e.target.value)}
                    disabled={renameLoading}
                    style={{
                      fontSize: 14,
                      padding: "6px 8px",
                      borderRadius: 4,
                      border: "1px solid #e5e7eb",
                      minWidth: 140,
                      maxWidth: 320,
                      width: "100%",
                      boxSizing: "border-box",
                    }}
                  />
                  <RenameButton onClick={() => handleRename(file.fileid || file.id, file.filename)} disabled={renameLoading}>
                    保存
                  </RenameButton>
                  <DeleteButton
                    onClick={() => {
                      setRenamingId(null);
                      setRenameValue("");
                    }}
                    disabled={renameLoading}>
                    取消
                  </DeleteButton>
                </RenameControls>
              ) : (
                <FileName
                  style={{ cursor: "pointer", color: "#0969da" }}
                  onClick={() => {
                    navigate(`/${username}/${reponame}/file-preview?path=${encodeURIComponent(file.path)}`);
                  }}>
                  {file.filename}
                </FileName>
              )}
              <FileSize>{formatFileSize(file.size)}</FileSize>
              <FileDate>{formatDate(file.updateTime || file.createTime)}</FileDate>
              <FileEditor>{file.editor}</FileEditor>
              {/* 先放重命名按钮，再放删除按钮 */}
              <RenameButton
                onClick={() => {
                  setRenamingId(file.fileid || file.id);
                  setRenameValue(file.filename);
                }}
                disabled={renamingId === (file.fileid || file.id)}>
                重命名
              </RenameButton>
              <DeleteButton onClick={() => handleDelete(file.fileid || file.id)}>删除</DeleteButton>
            </FileItem>
          ))}
        </FilesList>
      )}
    </Container>
  );
}

const RenameControls = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
  /* 保证重命名控件占用第二列（文件名列）显示空间 */
  grid-column: 2 / 3;
`;

const RenameButton = styled.button`
  margin-left: 8px;
  padding: 4px 12px;
  background: #6366f1;
  color: #fff;
  border: none;
  border-radius: 4px;
  font-size: 13px;
  cursor: pointer;
  transition: background 0.2s;
  &:hover {
    background: #4338ca;
  }
`;

const DeleteButton = styled.button`
  margin-left: 12px;
  padding: 4px 12px;
  background: #ef4444;
  color: #fff;
  border: none;
  border-radius: 4px;
  font-size: 13px;
  cursor: pointer;
  transition: background 0.2s;
  &:hover {
    background: #dc2626;
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

const NewFileButton = styled.button`
  margin-left: 24px;
  padding: 6px 16px;
  background: #4f46e5;
  color: #fff;
  border: none;
  border-radius: 6px;
  font-weight: 500;
  cursor: pointer;
  font-size: 14px;
  transition: background 0.2s;
  &:hover {
    background: #4338ca;
  }
`;

const Container = styled.div`
  max-width: 900px; /* 增大一点以避免列过窄导致换行 */
  width: 100%;
  margin: 40px auto;
  padding: 24px;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  box-sizing: border-box; /* 确保内边距计入宽度 */
  overflow: hidden; /* 防止内部元素溢出显示到外面 */
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

const EmptyText = styled.div`
  text-align: center;
  color: #ef4444;
  padding: 40px 0;
`;

const FilesList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  width: 100%;
  box-sizing: border-box;
`;

const FileItem = styled.div`
  display: grid;
  grid-template-columns: 32px minmax(180px, 1fr) 90px 140px 100px 80px 80px; /* 7 列，第二列可伸缩 */
  column-gap: 12px;
  align-items: center;
  padding: 10px 0;
  border-bottom: 1px solid #f3f4f6;
  box-sizing: border-box;
  width: 100%;
`;

const FileIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;

const FileName = styled.div`
  color: #0969da;
  font-weight: 500;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const FileSize = styled.div`
  color: #7d8590;
  font-size: 13px;
`;

const FileDate = styled.div`
  color: #7d8590;
  font-size: 13px;
`;

const FileEditor = styled.div`
  color: #4f46e5;
  font-size: 13px;
`;

export default RepoDetail;
