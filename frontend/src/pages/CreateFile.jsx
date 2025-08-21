import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { FaArrowLeft, FaFile, FaUpload, FaCloudUploadAlt } from "react-icons/fa";
import { apiFetch } from "../utils/request";

function CreateFile() {
  const location = useLocation();
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(location.search);
  const repoid = searchParams.get("repoid");

  const [filename, setFilename] = useState("");
  const [path, setPath] = useState("");
  const [message, setMessage] = useState("");
  const [content, setContent] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedPath, setUploadedPath] = useState("");

  // 文件上传处理
  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setIsUploading(true);
    setError("");

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await apiFetch("/file/upload", {
        method: "POST",
        headers: {
          Authorization: localStorage.getItem("token"),
        },
        body: formData,
      });

      const data = await response.json();
      //   console.log("文件上传响应:", data);

      if (data && data.code === 0) {
        const filePath = typeof data.data === "string" ? data.data : data.data.path || data.path;
        setUploadedPath(filePath);
        setPath(filePath); // 自动填充到文件路径输入框
        setFilename(file.name);
        // 读取文本文件内容并填充到内容输入框
        const reader = new FileReader();
        reader.onload = (e) => {
          setContent(e.target.result);
        };
        reader.readAsText(file);

        console.log("文件上传成功:", data);
      } else {
        setError(data.message || "文件上传失败");
      }
    } catch (err) {
      setError("文件上传失败，请重试");
      console.error("上传错误:", err);
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!filename.trim()) {
      setError("文件名不能为空");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const userStr = localStorage.getItem("user");
      const user = userStr ? JSON.parse(userStr) : {};
      console.log("提交文件时 repoid:", repoid);

      const res = await apiFetch("/file", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: localStorage.getItem("token"),
        },
        body: JSON.stringify({
          repoid: repoid,
          path: uploadedPath || path.trim() || "/", // 用第一步上传返回的路径
          filename: filename.trim(),
          message: message.trim() || `Add ${filename}`,
          editor: user.userid || user.id,
        }),
      });

      const data = await res.json();
      if (data && data.code === 0) {
        navigate(-1);
      } else {
        setError(data.message || "创建文件失败");
      }
    } catch (err) {
      setError("创建文件失败，请重试");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    navigate(-1);
  };

  return (
    <Container>
      <Header>
        <BackButton onClick={handleCancel}>
          <FaArrowLeft size={14} />
          返回
        </BackButton>
        <Title>
          <FaFile size={20} />
          新建文件
        </Title>
      </Header>

      <Form onSubmit={handleSubmit}>
        {/* 文件上传区域 */}
        <FormGroup>
          <Label>上传文件（可选）</Label>
          <FileUploadContainer>
            <FileInput type='file' id='fileUpload' onChange={handleFileUpload} disabled={isUploading} />
            <FileUploadLabel htmlFor='fileUpload' disabled={isUploading}>
              <FaCloudUploadAlt size={24} />
              <span>{isUploading ? "上传中..." : "点击选择文件"}</span>
            </FileUploadLabel>
          </FileUploadContainer>
          {uploadedPath && <SuccessMessage>✓ 文件上传成功: {uploadedPath}</SuccessMessage>}
        </FormGroup>

        <FormGroup>
          <Label>文件名 *</Label>
          <Input type='text' value={path} onChange={(e) => setPath(e.target.value)} placeholder='/ (根目录)' disabled={!!uploadedPath} />
        </FormGroup>

        <FormGroup>
          <Label>文件路径</Label>
          <Input type='text' value={uploadedPath || path} onChange={(e) => setPath(e.target.value)} placeholder='/ (根目录)' disabled={!!uploadedPath} />
          <Hint>{uploadedPath ? "已使用上传文件的路径" : "留空默认为根目录"}</Hint>
        </FormGroup>

        <FormGroup>
          <Label>提交说明</Label>
          <Input type='text' value={message} onChange={(e) => setMessage(e.target.value)} placeholder='添加新文件' />
        </FormGroup>

        {!uploadedPath && (
          <FormGroup>
            <Label>文件内容</Label>
            <TextArea value={content} onChange={(e) => setContent(e.target.value)} placeholder='在此输入文件内容...' rows={12} />
          </FormGroup>
        )}

        {error && <ErrorMessage>{error}</ErrorMessage>}

        <ButtonGroup>
          <CancelButton type='button' onClick={handleCancel}>
            取消
          </CancelButton>
          <SubmitButton type='submit' disabled={isLoading || !filename.trim()}>
            <FaUpload size={14} />
            {isLoading ? "创建中..." : "创建文件"}
          </SubmitButton>
        </ButtonGroup>
      </Form>
    </Container>
  );
}

// 新增的样式组件
const FileUploadContainer = styled.div`
  border: 2px dashed #d1d5db;
  border-radius: 8px;
  padding: 32px;
  text-align: center;
  transition: border-color 0.2s;

  &:hover {
    border-color: #4f46e5;
  }
`;

const FileInput = styled.input`
  display: none;
`;

const FileUploadLabel = styled.label`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  cursor: ${(props) => (props.disabled ? "not-allowed" : "pointer")};
  color: ${(props) => (props.disabled ? "#9ca3af" : "#4f46e5")};
  font-weight: 500;

  &:hover {
    color: ${(props) => (props.disabled ? "#9ca3af" : "#4338ca")};
  }

  span {
    font-size: 16px;
  }
`;

const SuccessMessage = styled.div`
  padding: 8px 12px;
  background: #ecfdf5;
  border: 1px solid #bbf7d0;
  border-radius: 6px;
  color: #166534;
  font-size: 14px;
`;

// ...existing styled components...
const Container = styled.div`
  max-width: 800px;
  margin: 40px auto;
  padding: 24px;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 32px;
  padding-bottom: 16px;
  border-bottom: 1px solid #e5e7eb;
`;

const BackButton = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  background: none;
  border: 1px solid #d1d5db;
  color: #6b7280;
  padding: 8px 12px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;

  &:hover {
    background: #f9fafb;
    border-color: #9ca3af;
  }
`;

const Title = styled.h1`
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 1.5rem;
  font-weight: 600;
  color: #24292f;
  margin: 0;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const Label = styled.label`
  font-weight: 600;
  color: #24292f;
  font-size: 14px;
`;

const Input = styled.input`
  padding: 12px 16px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 14px;
  transition: border-color 0.2s;

  &:focus {
    outline: none;
    border-color: #4f46e5;
    box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.1);
  }

  &::placeholder {
    color: #9ca3af;
  }

  &:disabled {
    background: #f9fafb;
    cursor: not-allowed;
  }
`;

const TextArea = styled.textarea`
  padding: 12px 16px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 14px;
  font-family: "Monaco", "Menlo", "Ubuntu Mono", monospace;
  line-height: 1.5;
  resize: vertical;
  transition: border-color 0.2s;

  &:focus {
    outline: none;
    border-color: #4f46e5;
    box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.1);
  }

  &::placeholder {
    color: #9ca3af;
  }
`;

const Hint = styled.span`
  font-size: 12px;
  color: #6b7280;
`;

const ErrorMessage = styled.div`
  padding: 12px 16px;
  background: #fef2f2;
  border: 1px solid #fecaca;
  border-radius: 6px;
  color: #dc2626;
  font-size: 14px;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 12px;
  justify-content: flex-end;
  padding-top: 16px;
  border-top: 1px solid #e5e7eb;
`;

const CancelButton = styled.button`
  padding: 10px 20px;
  border: 1px solid #d1d5db;
  background: white;
  color: #6b7280;
  border-radius: 6px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: #f9fafb;
    border-color: #9ca3af;
  }
`;

const SubmitButton = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 20px;
  background: #4f46e5;
  color: white;
  border: none;
  border-radius: 6px;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.2s;

  &:hover:not(:disabled) {
    background: #4338ca;
  }

  &:disabled {
    background: #9ca3af;
    cursor: not-allowed;
  }
`;

export default CreateFile;
