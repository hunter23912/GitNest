import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { FaGitAlt, FaEye, FaEyeSlash } from "react-icons/fa";
import { apiFetch } from "../utils/request";
const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [remember, setRemember] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const body = new URLSearchParams({
        username,
        password,
      }).toString();

      const res = await apiFetch("/user/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body, // 传入字符串表单体
      });

      const resp = await res.json();

      if (resp && resp.code === 0) {
        const userObj = {
          username: username,
          userid: resp.data.userid
        }
        if (remember) {
          localStorage.setItem("token", resp.data.token);
          console.log("token", resp.data.token);
        } else {
          sessionStorage.setItem("token", resp.data.token);
        }
        localStorage.setItem("user", JSON.stringify(userObj));
        // 通知当前tab中的监听器，更新用户状态
        window.dispatchEvent(new Event("user-change"));
        navigate("/");
        const user = localStorage.getItem("user");
        console.log("登录成功", user);
      } else {
        setError((resp && resp.message) || (resp && resp.data) || "无异常登录失败，请重试");
      }
    } catch (err) {
      setError(err.message || "登录失败，请稍后重试");
    } finally {
      setLoading(false);
    }
  };

  return (
    <LoginContainer>
      <LoginCard>
        <LogoContainer>
          <FaGitAlt size={32} />
          <LogoText>GitNest</LogoText>
        </LogoContainer>

        <Title>登录到您的账户</Title>
        <Subtitle>欢迎回来！请输入您的账户信息</Subtitle>

        <LoginForm onSubmit={handleSubmit}>
          <FormGroup>
            <Label htmlFor="username">用户名</Label>
            <Input id="username" type="text" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="输入您的用户名" required />
          </FormGroup>

          <FormGroup>
            <LabelRow>
              <Label htmlFor="password">密码</Label>
              <ForgotLink to="/forgot-password">忘记密码？</ForgotLink>
            </LabelRow>
            <PasswordContainer>
              <Input id="password" type={showPassword ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="输入您的密码" required />
              <PasswordToggle type="button" onClick={() => setShowPassword(!showPassword)}>
                {showPassword ? <FaEyeSlash size={16} /> : <FaEye size={16} />}
              </PasswordToggle>
            </PasswordContainer>
          </FormGroup>

          <FormOptions>
            <CheckboxLabel>
              <Checkbox type="checkbox" checked={remember} onChange={(e) => setRemember(e.target.checked)} />
              <Checkmark></Checkmark>
              记住我
            </CheckboxLabel>
          </FormOptions>

          {error && <ErrorMessage>{error}</ErrorMessage>}

          <SubmitButton type="submit" disabled={loading}>
            {loading && <LoadingSpinner />}
            {loading ? "登录中..." : "登录"}
          </SubmitButton>
        </LoginForm>

        <Divider>
          <DividerText>或者</DividerText>
        </Divider>

        <SocialLogin>
          <SocialButton className="github-btn">
            <FaGitAlt size={16} />
            使用 GitHub 登录
          </SocialButton>
        </SocialLogin>

        <SignupPrompt>
          还没有账户？ <SignupLink to="/register">立即注册</SignupLink>
        </SignupPrompt>

        <DemoHint>演示账户：test@example.com / password</DemoHint>
      </LoginCard>
    </LoginContainer>
  );
};

const LoginContainer = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 20px;
`;

const LoginCard = styled.div`
  background: white;
  border-radius: 12px;
  box-shadow: 0 20px 25px rgba(0, 0, 0, 0.1);
  padding: 40px;
  width: 100%;
  max-width: 400px;
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

const LoginForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

const LabelRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Label = styled.label`
  font-weight: 500;
  color: #374151;
  font-size: 14px;
`;

const ForgotLink = styled(Link)`
  color: #4f46e5;
  text-decoration: none;
  font-size: 14px;

  &:hover {
    text-decoration: underline;
  }
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

const ErrorMessage = styled.div`
  color: #ef4444;
  font-size: 14px;
  text-align: center;
  padding: 8px 12px;
  background-color: #fef2f2;
  border: 1px solid #fecaca;
  border-radius: 6px;
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

const FormOptions = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const CheckboxLabel = styled.label`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  color: #374151;
  cursor: pointer;
`;

const Checkbox = styled.input`
  width: 16px;
  height: 16px;
  outline: none !important;
  box-shadow: none !important;

  &:focus,
  &:focus-visible {
    outline: none !important;
    box-shadow: none !important;
  }
`;

const Checkmark = styled.span``;

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

const SignupPrompt = styled.p`
  text-align: center;
  color: #7d8590;
  margin: 0 0 16px 0;
`;

const SignupLink = styled(Link)`
  color: #4f46e5;
  text-decoration: none;
  font-weight: 600;

  &:hover {
    text-decoration: underline;
  }
`;

const DemoHint = styled.p`
  text-align: center;
  color: #7d8590;
  font-size: 12px;
  margin: 0;
  padding: 12px;
  background-color: #f6f8fa;
  border-radius: 6px;
`;

export default Login;
