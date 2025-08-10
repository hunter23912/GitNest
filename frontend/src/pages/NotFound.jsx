import React from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { FiHome, FiArrowLeft } from "react-icons/fi";
import Navbar from "../components/Navbar";

const Container = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
`;

const Content = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: calc(100vh - 64px);
  padding: 2rem;
  text-align: center;
`;

const ErrorCode = styled.h1`
  font-size: 8rem;
  font-weight: 700;
  color: white;
  margin: 0;
  text-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
`;

const ErrorMessage = styled.h2`
  font-size: 2rem;
  font-weight: 600;
  color: white;
  margin: 1rem 0;
  opacity: 0.9;
`;

const ErrorDescription = styled.p`
  font-size: 1.1rem;
  color: white;
  opacity: 0.8;
  max-width: 600px;
  line-height: 1.6;
  margin: 1rem 0 3rem 0;
`;

const ButtonContainer = styled.div`
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
  justify-content: center;
`;

const Button = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  text-decoration: none;
  font-weight: 500;
  transition: all 0.2s ease;

  &:first-child {
    background: white;
    color: #667eea;

    &:hover {
      background: #f7fafc;
      transform: translateY(-1px);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    }
  }

  &:last-child {
    background: rgba(255, 255, 255, 0.1);
    color: white;
    border: 1px solid rgba(255, 255, 255, 0.3);

    &:hover {
      background: rgba(255, 255, 255, 0.2);
      transform: translateY(-1px);
    }
  }
`;

const Illustration = styled.div`
  font-size: 4rem;
  margin-bottom: 2rem;
  opacity: 0.7;
`;

function NotFound() {
  return (
    <Container>
      <Content>
        <Illustration>🔍</Illustration>
        <ErrorCode>404</ErrorCode>
        <ErrorMessage>页面未找到</ErrorMessage>
        <ErrorDescription>
          抱歉，您访问的页面不存在。可能是页面已被删除、移动或者您输入了错误的地址。 请检查 URL
          是否正确，或者返回首页重新开始。
        </ErrorDescription>
        <ButtonContainer>
          <Button to="/">
            <FiHome size={18} />
            返回首页
          </Button>
          <Button to="#" onClick={() => window.history.back()}>
            <FiArrowLeft size={18} />
            返回上页
          </Button>
        </ButtonContainer>
      </Content>
    </Container>
  );
}

export default NotFound;
