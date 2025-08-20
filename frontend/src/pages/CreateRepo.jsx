import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { FaLock, FaBook, FaCheck } from "react-icons/fa";
import { apiFetch } from "../utils/request";
function CreateRepo() {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    isPrivate: false,
    initializeWithReadme: true,
    gitignoreTemplate: "",
    license: "",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    const checked = e.target.checked;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) {
      newErrors.name = "仓库名称不能为空";
    } else if (!/^[a-zA-Z0-9._-]+$/.test(formData.name)) {
      newErrors.name = "仓库名称只能包含字母、数字、点、下划线和连字符";
    } else if (formData.name.length < 3) {
      newErrors.name = "仓库名称至少需要3个字符";
    }
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setLoading(true);
    setErrors({});
    try {
      const userStr = localStorage.getItem("user");
      let user = null;
      if (userStr) {
        user = JSON.parse(userStr);
      } else {
        console.error("用户未登录");
      }

      // 构造请求体
      const payload = {
        reponame: formData.name,
        description: formData.description,
        ownerid: user.userid,
        isprivate: formData.isPrivate,
        language: formData.gitignoreTemplate || "Other",
        stars: 0,
      };
      const res = await apiFetch("/repo", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: localStorage.getItem("token"),
        },
        body: JSON.stringify(payload),
      });
      const text = await res.text();
      console.log("创建仓库响应:", text);
      let resp = {};
      try {
        resp = text ? JSON.parse(text) : {};
      } catch {
        resp = { raw: text };
      }
      if (res.status === 401) {
        throw new Error("未授权，请重新登录");
      }
      if (resp.code !== 0) {
        throw new Error(resp.message || "创建仓库失败");
      }
      navigate("/repos");
    } catch (err) {
      let errorMsg = "创建仓库失败，请重试";
      if (err instanceof Response) {
        try {
          const text = await err.text();
          errorMsg = text || errorMsg;
        } catch {}
      } else if (err.message) {
        errorMsg = err.message;
      }
      setErrors({ general: errorMsg });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container>
      <Header>
        <Title>创建新仓库</Title>
        <Subtitle>仓库是存储代码、文档和其他文件的地方</Subtitle>
      </Header>
      <FormContainer>
        <CreateForm onSubmit={handleSubmit}>
          <FormSection>
            <SectionTitle>基本信息</SectionTitle>
            <FormGroup>
              <Label htmlFor="name">
                仓库名称 <Required>*</Required>
              </Label>
              <Input id="name" name="name" type="text" value={formData.name} onChange={handleChange} placeholder="my-awesome-project" required />
              {errors.name && <ErrorText>{errors.name}</ErrorText>}
              <HelpText>仓库名称必须是唯一的</HelpText>
            </FormGroup>
            <FormGroup>
              <Label htmlFor="description">描述（可选）</Label>
              <Textarea id="description" name="description" value={formData.description} onChange={handleChange} placeholder="简短描述您的项目..." rows={3} />
            </FormGroup>
          </FormSection>
          <FormSection>
            <SectionTitle>可见性</SectionTitle>
            <VisibilityOptions>
              <VisibilityOption>
                <VisibilityRadio type="radio" name="isPrivate" value="false" checked={!formData.isPrivate} onChange={() => setFormData((prev) => ({ ...prev, isPrivate: false }))} />
                <VisibilityContent>
                  <VisibilityIcon>
                    <FaBook size={16} />
                  </VisibilityIcon>
                  <VisibilityInfo>
                    <VisibilityTitle>公开</VisibilityTitle>
                    <VisibilityDescription>任何人都可以查看此仓库。您可以选择谁可以提交。</VisibilityDescription>
                  </VisibilityInfo>
                </VisibilityContent>
              </VisibilityOption>
              <VisibilityOption>
                <VisibilityRadio type="radio" name="isPrivate" value="true" checked={formData.isPrivate} onChange={() => setFormData((prev) => ({ ...prev, isPrivate: true }))} />
                <VisibilityContent>
                  <VisibilityIcon>
                    <FaLock size={16} />
                  </VisibilityIcon>
                  <VisibilityInfo>
                    <VisibilityTitle>私有</VisibilityTitle>
                    <VisibilityDescription>只有您和您明确分享的人可以查看此仓库。</VisibilityDescription>
                  </VisibilityInfo>
                </VisibilityContent>
              </VisibilityOption>
            </VisibilityOptions>
          </FormSection>
          <FormSection>
            <SectionTitle>初始化仓库</SectionTitle>
            <CheckboxGroup>
              <CheckboxOption>
                <Checkbox type="checkbox" name="initializeWithReadme" checked={formData.initializeWithReadme} onChange={handleChange} />
                <CheckboxLabel>
                  <FaCheck size={12} />
                  添加 README 文件
                </CheckboxLabel>
              </CheckboxOption>
              <CheckboxDescription>这是告诉其他人您的仓库用途的好地方</CheckboxDescription>
            </CheckboxGroup>
            <FormGroup>
              <Label htmlFor="gitignoreTemplate">添加 .gitignore</Label>
              <Select id="gitignoreTemplate" name="gitignoreTemplate" value={formData.gitignoreTemplate} onChange={handleChange}>
                <option value="">选择模板</option>
                <option value="Node">Node</option>
                <option value="Python">Python</option>
                <option value="Java">Java</option>
                <option value="Go">Go</option>
                <option value="React">React</option>
                <option value="Vue">Vue</option>
              </Select>
              <HelpText>选择要忽略的文件类型</HelpText>
            </FormGroup>
            <FormGroup>
              <Label htmlFor="license">选择许可证</Label>
              <Select id="license" name="license" value={formData.license} onChange={handleChange}>
                <option value="">无许可证</option>
                <option value="MIT">MIT License</option>
                <option value="Apache-2.0">Apache License 2.0</option>
                <option value="GPL-3.0">GNU GPL v3</option>
                <option value="BSD-3-Clause">BSD 3-Clause</option>
              </Select>
              <HelpText>许可证告诉其他人他们可以对您的代码做什么</HelpText>
            </FormGroup>
          </FormSection>
          {errors.general && <ErrorMessage>{errors.general}</ErrorMessage>}
          <FormActions>
            <CancelButton type="button" onClick={() => navigate("/repos")}>
              取消
            </CancelButton>
            <SubmitButton type="submit" disabled={loading}>
              {loading ? "创建中..." : "创建仓库"}
            </SubmitButton>
          </FormActions>
        </CreateForm>
      </FormContainer>
    </Container>
  );
}

const Container = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: 40px;
`;

const Title = styled.h1`
  font-size: 2rem;
  font-weight: 600;
  color: #24292f;
  margin-bottom: 8px;
`;

const Subtitle = styled.p`
  color: #7d8590;
  font-size: 1rem;
`;

const FormContainer = styled.div`
  background: white;
  border: 1px solid #e1e5e9;
  border-radius: 8px;
  padding: 24px;
`;

const CreateForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 32px;
`;

const FormSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const SectionTitle = styled.h3`
  font-size: 1.125rem;
  font-weight: 600;
  color: #24292f;
  margin: 0;
  padding-bottom: 8px;
  border-bottom: 1px solid #e1e5e9;
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

const Required = styled.span`
  color: #ef4444;
`;

const Input = styled.input`
  padding: 8px 12px;
  border: 1px solid #d1d9e0;
  border-radius: 6px;
  font-size: 14px;

  &:focus {
    outline: none;
    border-color: #4f46e5;
    box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.1);
  }
`;

const Textarea = styled.textarea`
  padding: 8px 12px;
  border: 1px solid #d1d9e0;
  border-radius: 6px;
  font-size: 14px;
  resize: vertical;
  font-family: inherit;

  &:focus {
    outline: none;
    border-color: #4f46e5;
    box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.1);
  }
`;

const Select = styled.select`
  padding: 8px 12px;
  border: 1px solid #d1d9e0;
  border-radius: 6px;
  font-size: 14px;
  background: white;

  &:focus {
    outline: none;
    border-color: #4f46e5;
    box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.1);
  }
`;

const ErrorText = styled.span`
  color: #ef4444;
  font-size: 12px;
`;

const HelpText = styled.span`
  color: #7d8590;
  font-size: 12px;
`;

const VisibilityOptions = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const VisibilityOption = styled.label`
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 16px;
  border: 1px solid #d1d9e0;
  border-radius: 8px;
  cursor: pointer;

  &:hover {
    border-color: #4f46e5;
  }
`;

const VisibilityRadio = styled.input`
  margin-top: 2px;
`;

const VisibilityContent = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 12px;
  flex: 1;
`;

const VisibilityIcon = styled.div`
  color: #7d8590;
  margin-top: 2px;
`;

const VisibilityInfo = styled.div``;

const VisibilityTitle = styled.div`
  font-weight: 600;
  color: #24292f;
  margin-bottom: 4px;
`;

const VisibilityDescription = styled.div`
  color: #7d8590;
  font-size: 14px;
  line-height: 1.4;
`;

const CheckboxGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const CheckboxOption = styled.label`
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
`;

const Checkbox = styled.input``;

const CheckboxLabel = styled.span`
  display: flex;
  align-items: center;
  gap: 6px;
  font-weight: 500;
  color: #24292f;
`;

const CheckboxDescription = styled.p`
  color: #7d8590;
  font-size: 14px;
  margin: 0;
  margin-left: 24px;
`;

const ErrorMessage = styled.div`
  color: #ef4444;
  font-size: 14px;
  text-align: center;
  padding: 12px;
  background-color: #fef2f2;
  border: 1px solid #fecaca;
  border-radius: 6px;
`;

const FormActions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 12px;

  @media (max-width: 480px) {
    flex-direction: column;
  }
`;

const CancelButton = styled.button`
  padding: 8px 16px;
  border: 1px solid #d1d9e0;
  border-radius: 6px;
  background: white;
  color: #24292f;
  font-weight: 500;
  cursor: pointer;

  &:hover {
    background-color: #f6f8fa;
  }
`;

const SubmitButton = styled.button`
  padding: 8px 16px;
  border: none;
  border-radius: 6px;
  background-color: #238636;
  color: white;
  font-weight: 500;
  cursor: pointer;
  outline: none !important;
  box-shadow: none !important;
  transition: background-color 0.2s;

  &:hover:not(:disabled) {
    background-color: #2ea043;
  }

  &:focus:not(:disabled),
  &:focus-visible:not(:disabled) {
    outline: none !important;
    box-shadow: none !important;
    background-color: #2ea043;
  }

  &:active:not(:disabled) {
    outline: none !important;
    box-shadow: none !important;
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

export default CreateRepo;
