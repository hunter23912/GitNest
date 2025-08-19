import React, { useState, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { FaGitAlt, FaEye, FaEyeSlash } from "react-icons/fa";
import { apiFetch } from "../utils/request";

const Register = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    agreeToTerms: false,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  // 密码强度计算
  const passwordStrength = useMemo(() => {
    const password = formData.password;
    let score = 0;

    if (password.length >= 8) score++;
    if (/[a-z]/.test(password)) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;

    const strengthLevels = [
      { class: "weak", width: "20%", text: "弱" },
      { class: "fair", width: "40%", text: "一般" },
      { class: "good", width: "60%", text: "良好" },
      { class: "strong", width: "80%", text: "强" },
      { class: "very-strong", width: "100%", text: "很强" },
    ];

    return strengthLevels[score] || { class: "", width: "0%", text: "" };
  }, [formData.password]);

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    const checked = e.target.checked;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    // 清除对应字段的错误
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.username.trim()) {
      newErrors.username = "用户名不能为空";
    } else if (formData.username.length < 3) {
      newErrors.username = "用户名至少需要3个字符";
    }

    if (!formData.email.trim()) {
      newErrors.email = "邮箱不能为空";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "请输入有效的邮箱地址";
    }

    if (!formData.password) {
      newErrors.password = "密码不能为空";
    } else if (formData.password.length < 6) {
      newErrors.password = "密码至少需要6个字符";
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "两次输入的密码不一致";
    }

    if (!formData.agreeToTerms) {
      newErrors.agreeToTerms = "请同意服务条款和隐私政策";
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
      const body = new URLSearchParams({
        username: formData.username,
        password: formData.password,
        email: formData.email,
      }).toString();

      const res = await apiFetch("/user/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: body,
      });

      const resp = await res.json();

      if (resp.code === 1) {
        setErrors({ general: "用户名重复，注册失败。" });
      } else if (resp.code === 0) {
        navigate("/");
      } else {
        setErrors({ general: "注册失败，请稍后重试。" });
      }
    } catch (err) {
      setErrors({ general: "注册失败，请重试。" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <RegisterContainer>
      <RegisterCard>
        <LogoContainer>
          <FaGitAlt size={32} />
          <LogoText>GitNest</LogoText>
        </LogoContainer>

        <Title>创建您的账户</Title>
        <Subtitle>加入我们的开发者社区</Subtitle>

        <RegisterForm onSubmit={handleSubmit}>
          <FormGroup>
            <Label htmlFor="username">用户名</Label>
            <Input id="username" name="username" type="text" value={formData.username} onChange={handleChange} placeholder="选择一个用户名" required />
            {errors.username && <ErrorText>{errors.username}</ErrorText>}
          </FormGroup>

          <FormGroup>
            <Label htmlFor="email">邮箱地址</Label>
            <Input id="email" name="email" type="email" value={formData.email} onChange={handleChange} placeholder="输入您的邮箱" required />
            {errors.email && <ErrorText>{errors.email}</ErrorText>}
          </FormGroup>

          <FormGroup>
            <Label htmlFor="password">密码</Label>
            <PasswordContainer>
              <Input id="password" name="password" type={showPassword ? "text" : "password"} value={formData.password} onChange={handleChange} placeholder="创建一个密码" required />
              <PasswordToggle type="button" onClick={() => setShowPassword(!showPassword)}>
                {showPassword ? <FaEyeSlash size={16} /> : <FaEye size={16} />}
              </PasswordToggle>
            </PasswordContainer>
            {formData.password && (
              <PasswordStrength>
                <StrengthBar>
                  <StrengthFill className={passwordStrength.class} style={{ width: passwordStrength.width }} />
                </StrengthBar>
                <StrengthText>{passwordStrength.text}</StrengthText>
              </PasswordStrength>
            )}
            {errors.password && <ErrorText>{errors.password}</ErrorText>}
          </FormGroup>

          <FormGroup>
            <Label htmlFor="confirmPassword">确认密码</Label>
            <PasswordContainer>
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="再次输入密码"
                required
              />
              <PasswordToggle type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                {showConfirmPassword ? <FaEyeSlash size={16} /> : <FaEye size={16} />}
              </PasswordToggle>
            </PasswordContainer>
            {errors.confirmPassword && <ErrorText>{errors.confirmPassword}</ErrorText>}
          </FormGroup>

          {errors.general && <ErrorMessage>{errors.general}</ErrorMessage>}

          <FormGroup>
            <CheckboxLabel>
              <Checkbox type="checkbox" name="agreeToTerms" checked={formData.agreeToTerms} onChange={handleChange} />
              <CheckboxText>
                我同意 <TermsLink to="/terms">服务条款</TermsLink> 和 <TermsLink to="/privacy">隐私政策</TermsLink>
              </CheckboxText>
            </CheckboxLabel>
            {errors.agreeToTerms && <ErrorText>{errors.agreeToTerms}</ErrorText>}
          </FormGroup>

          <SubmitButton type="submit" disabled={loading || !formData.agreeToTerms}>
            {loading && <LoadingSpinner />}
            {loading ? "注册中..." : "创建账户"}
          </SubmitButton>
        </RegisterForm>

        <Terms>
          点击"创建账户"即表示您同意我们的
          <TermsLink to="/terms">服务条款</TermsLink> 和<TermsLink to="/privacy">隐私政策</TermsLink>
        </Terms>

        <Divider>
          <DividerText>或者</DividerText>
        </Divider>

        <SocialLogin>
          <SocialButton className="github-btn">
            <FaGitAlt size={16} />
            使用 GitHub 注册
          </SocialButton>
        </SocialLogin>

        <LoginPrompt>
          已经有账户了？ <LoginLink to="/login">立即登录</LoginLink>
        </LoginPrompt>
      </RegisterCard>
    </RegisterContainer>
  );
};

const RegisterContainer = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 20px;
`;

const RegisterCard = styled.div`
  background: white;
  border-radius: 12px;
  box-shadow: 0 20px 25px rgba(0, 0, 0, 0.1);
  padding: 40px;
  width: 100%;
  max-width: 500px;
  max-height: 90vh;
  overflow-y: auto;
`;

const LogoContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  color: #4f46e5;
  margin-bottom: 16px;
`;

const LogoText = styled.h1`
  font-size: 1.5rem;
  font-weight: 700;
  margin: 0;
`;

const Title = styled.h2`
  text-align: center;
  color: #1f2937;
  margin-bottom: 8px;
  font-size: 24px;
  font-weight: 600;
`;

const Subtitle = styled.p`
  text-align: center;
  color: #6b7280;
  font-size: 14px;
  margin-bottom: 32px;
`;

const RegisterForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

const Label = styled.label`
  font-weight: 500;
  color: #374151;
  font-size: 14px;
`;

const Input = styled.input`
  padding: 12px 16px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 14px;
  width: 100%;
  box-sizing: border-box;
  transition: border-color 0.2s, box-shadow 0.2s;
  outline: none !important;
  box-shadow: none !important;

  &:focus,
  &:focus-visible {
    outline: none !important;
    border-color: #4f46e5;
    box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.1) !important;
  }

  &.error {
    border-color: #ef4444;
  }
`;

const PasswordContainer = styled.div`
  position: relative;
`;

const PasswordToggle = styled.button`
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: #6b7280;
  cursor: pointer;
  padding: 4px;
  outline: none !important;
  box-shadow: none !important;
  border-radius: 4px;
  transition: all 0.2s;

  &:hover {
    color: #374151;
  }

  &:focus,
  &:focus-visible {
    outline: none !important;
    box-shadow: none !important;
    color: #374151;
  }

  &:active {
    outline: none !important;
    box-shadow: none !important;
  }
`;

const PasswordStrength = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 6px;
`;

const StrengthBar = styled.div`
  flex: 1;
  height: 4px;
  background: #e5e7eb;
  border-radius: 2px;
  overflow: hidden;
`;

const StrengthFill = styled.div`
  height: 100%;
  transition: width 0.3s, background-color 0.3s;

  &.weak {
    background-color: #ef4444;
  }
  &.fair {
    background-color: #f59e0b;
  }
  &.good {
    background-color: #10b981;
  }
  &.strong {
    background-color: #059669;
  }
  &.very-strong {
    background-color: #047857;
  }
`;

const StrengthText = styled.span`
  font-size: 12px;
  color: #6b7280;
  min-width: 30px;
`;

const CheckboxLabel = styled.label`
  display: flex;
  align-items: flex-start;
  gap: 8px;
  font-size: 14px;
  color: #374151;
  cursor: pointer;
  line-height: 1.5;
`;

const Checkbox = styled.input`
  width: 16px;
  height: 16px;
  margin-top: 2px;
  outline: none !important;
  box-shadow: none !important;

  &:focus,
  &:focus-visible {
    outline: none !important;
    box-shadow: none !important;
  }
`;

const CheckboxText = styled.span`
  flex: 1;
`;

const ErrorText = styled.span`
  color: #ef4444;
  font-size: 12px;
`;

const ErrorMessage = styled.div`
  color: #dc2626;
  font-size: 14px;
  text-align: center;
  padding: 12px;
  background-color: #fef2f2;
  border: 1px solid #fecaca;
  border-radius: 6px;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const SubmitButton = styled.button`
  background-color: #4f46e5;
  color: white;
  border: none;
  border-radius: 6px;
  padding: 12px 24px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s;
  outline: none !important;
  box-shadow: none !important;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;

  &:hover:not(:disabled) {
    background-color: #4338ca;
  }

  &:focus:not(:disabled),
  &:focus-visible:not(:disabled) {
    outline: none !important;
    background-color: #4338ca;
    box-shadow: none !important;
  }

  &:active:not(:disabled) {
    outline: none !important;
    box-shadow: none !important;
  }

  &:disabled {
    background-color: #9ca3af;
    cursor: not-allowed;
  }
`;

const LoadingSpinner = styled.span`
  width: 16px;
  height: 16px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top: 2px solid white;
  border-radius: 50%;
  animation: spin 1s linear infinite;

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
`;

const Terms = styled.p`
  text-align: center;
  color: #6b7280;
  font-size: 12px;
  margin: 20px 0;
  line-height: 1.4;
`;

const TermsLink = styled(Link)`
  color: #4f46e5;
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }
`;

const Divider = styled.div`
  text-align: center;
  margin: 24px 0;
  position: relative;

  &::before {
    content: "";
    position: absolute;
    top: 50%;
    left: 0;
    right: 0;
    height: 1px;
    background: #e5e7eb;
  }
`;

const DividerText = styled.span`
  background: white;
  padding: 0 16px;
  color: #6b7280;
  font-size: 14px;
`;

const SocialLogin = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const SocialButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 12px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  background: white;
  color: #374151;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s, border-color 0.2s;
  outline: none !important;
  box-shadow: none !important;

  &:hover {
    background-color: #f9fafb;
    border-color: #9ca3af;
  }

  &:focus,
  &:focus-visible {
    outline: none !important;
    box-shadow: none !important;
    background-color: #f9fafb;
    border-color: #9ca3af;
  }

  &:active {
    outline: none !important;
    box-shadow: none !important;
  }

  &.github-btn:hover {
    background-color: #24292f;
    color: white;
    border-color: #24292f;
  }
`;

const LoginPrompt = styled.p`
  text-align: center;
  color: #6b7280;
  margin: 0;
  font-size: 14px;
`;

const LoginLink = styled(Link)`
  color: #4f46e5;
  text-decoration: none;
  font-weight: 500;

  &:hover {
    text-decoration: underline;
  }
`;

export default Register;
