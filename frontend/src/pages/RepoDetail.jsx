import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import styled from "styled-components";
import { FaFolder, FaFile } from "react-icons/fa";
import { apiFetch } from "../utils/request";

function RepoDetail() {
  const location = useLocation();
  const [files, setFiles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchFiles = async () => {
      setIsLoading(true);
      try {
        const searchParams = new URLSearchParams(location.search);
        const repoid = searchParams.get("repoid");
        if (!repoid) {
          setFiles([]);
          setIsLoading(false);
          return;
        }
        const token = localStorage.getItem("token") || sessionStorage.getItem("token") || "";
        const res = await apiFetch(`/file/repo?repoid=${repoid}`, {
          method: "GET",
          headers: {
            Authorization: localStorage.getItem("token"),
          },
        });
        const data = await res.json();
        console.log("Fetched files:", data);
        if (data && data.code === 0) {
          setFiles(data.data); // 这里赋值文件列表
        } else {
          setFiles([]);
        }
      } catch (err) {
        setFiles([]);
      } finally {
        setIsLoading(false);
      }
    };
    fetchFiles();
  }, [location.search]);

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
      <Title>仓库文件列表</Title>
      {isLoading ? (
        <LoadingText>加载中...</LoadingText>
      ) : files.length === 0 ? (
        <EmptyText>
          暂无文件
          <br />
          <button
            style={{ marginTop: 16, padding: "8px 20px", background: "#4f46e5", color: "#fff", border: "none", borderRadius: 4, cursor: "pointer" }}
            onClick={() => {
              const searchParams = new URLSearchParams(location.search);
              const repoid = searchParams.get("repoid");
              window.location.href = `/repo/create-file?repoid=${repoid}`;
            }}
          >
            新建文件
          </button>
        </EmptyText>
      ) : (
        <FilesList>
          {files.map((file) => (
            <FileItem key={file.fileid || file.id}>
              <FileIcon>{file.path && file.path.endsWith("/") ? <FaFolder size={18} color="#79b8ff" /> : <FaFile size={18} color="#586069" />}</FileIcon>
              <FileName>{file.filename}</FileName>
              <FileSize>{formatFileSize(file.size)}</FileSize>
              <FileDate>{formatDate(file.updateTime || file.createTime)}</FileDate>
              <FileEditor>{file.editor}</FileEditor>
            </FileItem>
          ))}
        </FilesList>
      )}
    </Container>
  );
}

const Container = styled.div`
  max-width: 700px;
  margin: 40px auto;
  padding: 24px;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
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
`;

const FileItem = styled.div`
  display: grid;
  grid-template-columns: 32px 1fr 100px 160px 100px;
  align-items: center;
  padding: 10px 0;
  border-bottom: 1px solid #f3f4f6;
`;

const FileIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;

const FileName = styled.div`
  color: #0969da;
  font-weight: 500;
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
