import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import { FiCode, FiMessageSquare, FiSend } from "react-icons/fi";
import { FaRobot, FaLightbulb, FaBug, FaCog } from "react-icons/fa";

function AIAssistant() {
  const chatEndRef = useRef(null);
  const chatMessagesRef = useRef(null);

  const [messages, setMessages] = useState([
    {
      id: "1",
      type: "ai",
      content:
        "你好！我是 GitNest AI 代码助手。我可以帮助您：\n• 代码审查和优化建议\n• Bug 诊断和修复\n• 代码片段生成\n• 最佳实践建议\n\n有什么我可以帮助您的吗？",
      timestamp: new Date(),
    },
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    // 直接操作 ChatMessages 容器的滚动，而不是整个页面
    if (chatMessagesRef.current) {
      chatMessagesRef.current.scrollTop = chatMessagesRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage = {
      id: Date.now().toString(),
      type: "user",
      content: inputMessage,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputMessage("");
    setIsTyping(true);

    // 模拟 AI 响应
    setTimeout(() => {
      const aiResponse = {
        id: (Date.now() + 1).toString(),
        type: "ai",
        content: generateAIResponse(inputMessage),
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, aiResponse]);
      setIsTyping(false);
    }, 1500);
  };

  const generateAIResponse = (userInput) => {
    const responses = [
      "这是一个很好的问题！让我为您提供一些建议...",
      "根据最佳实践，我建议您可以这样做...",
      "我发现了一些可以优化的地方...",
      "这段代码看起来不错，但可以通过以下方式改进...",
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  };

  const quickActions = [
    { icon: FaBug, title: "代码调试", description: "帮助查找和修复代码中的问题" },
    { icon: FaCog, title: "性能优化", description: "分析代码性能并提供优化建议" },
    { icon: FaLightbulb, title: "最佳实践", description: "提供行业标准的编程最佳实践" },
    { icon: FiCode, title: "代码生成", description: "根据需求生成代码模板" },
  ];

  return (
    <Container>
      <Content>
        <Header>
          <HeaderTitle>
            <FaRobot />
            GitNest AI 代码助手
          </HeaderTitle>
          <HeaderSubtitle>智能代码分析、优化建议和开发辅助</HeaderSubtitle>
        </Header>

        <MainSection>
          <ChatSection>
            <ChatHeader>
              <FiMessageSquare />
              对话窗口
            </ChatHeader>
            <ChatMessages ref={chatMessagesRef}>
              {messages.map((message) => (
                <MessageBubble key={message.id} type={message.type}>
                  <MessageContent>
                    {message.content}
                    {message.codeSnippet && (
                      <CodeSnippet>
                        <CodeHeader>{message.language}</CodeHeader>
                        <pre>{message.codeSnippet}</pre>
                      </CodeSnippet>
                    )}
                  </MessageContent>
                  <MessageTime>{message.timestamp.toLocaleTimeString()}</MessageTime>
                </MessageBubble>
              ))}
              {isTyping && (
                <MessageBubble type="ai">
                  <TypingIndicator>
                    <span></span>
                    <span></span>
                    <span></span>
                  </TypingIndicator>
                </MessageBubble>
              )}
            </ChatMessages>
            <ChatInput>
              <InputContainer>
                <MessageInput
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  placeholder="输入您的问题或粘贴代码..."
                  onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                />
                <SendButton onClick={handleSendMessage}>
                  <FiSend />
                </SendButton>
              </InputContainer>
            </ChatInput>
          </ChatSection>

          <SidebarSection>
            <QuickActions>
              <SectionTitle>快速功能</SectionTitle>
              {quickActions.map((action, index) => (
                <ActionCard key={index}>
                  <ActionIcon>
                    <action.icon />
                  </ActionIcon>
                  <ActionContent>
                    <ActionTitle>{action.title}</ActionTitle>
                    <ActionDescription>{action.description}</ActionDescription>
                  </ActionContent>
                </ActionCard>
              ))}
            </QuickActions>

            <AIStats>
              <SectionTitle>AI 统计</SectionTitle>
              <StatItem>
                <StatLabel>今日分析代码</StatLabel>
                <StatValue>1,234 行</StatValue>
              </StatItem>
              <StatItem>
                <StatLabel>发现问题</StatLabel>
                <StatValue>23 个</StatValue>
              </StatItem>
              <StatItem>
                <StatLabel>优化建议</StatLabel>
                <StatValue>45 条</StatValue>
              </StatItem>
            </AIStats>
          </SidebarSection>
        </MainSection>
      </Content>
    </Container>
  );
}

// 样式组件

const Container = styled.div`
  min-height: 100vh;
  background: #f8fafc;
`;

const Content = styled.div`
  width: 100%;
  margin: 0 auto;
  padding: 2rem;

  @media (min-width: 1600px) {
    max-width: 1600px;
  }
`;

const Header = styled.header`
  text-align: center;
  margin-bottom: 2rem;
`;

const HeaderTitle = styled.h1`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  font-size: 2.5rem;
  font-weight: 700;
  color: #1a202c;
  margin-bottom: 0.5rem;
`;

const HeaderSubtitle = styled.p`
  font-size: 1.1rem;
  color: #64748b;
`;

const MainSection = styled.div`
  display: grid;
  grid-template-columns: 1fr 350px;
  gap: 2rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const ChatSection = styled.div`
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  overflow: hidden;
  display: flex;
  flex-direction: column;
  height: 600px;
`;

const ChatHeader = styled.div`
  padding: 1rem 1.5rem;
  background: #667eea;
  color: white;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const ChatMessages = styled.div`
  flex: 1;
  height: 400px;
  overflow-y: auto;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const MessageBubble = styled.div`
  align-self: ${(props) => (props.type === "user" ? "flex-end" : "flex-start")};
  max-width: 80%;
  background: ${(props) => (props.type === "user" ? "#667eea" : "#f1f5f9")};
  color: ${(props) => (props.type === "user" ? "white" : "#334155")};
  padding: 0.75rem 1rem;
  border-radius: 18px;
  border-top-${(props) => (props.type === "user" ? "right" : "left")}-radius: 4px;
`;

const MessageContent = styled.div`
  white-space: pre-wrap;
  line-height: 1.5;
`;

const MessageTime = styled.div`
  font-size: 0.75rem;
  opacity: 0.7;
  margin-top: 0.25rem;
`;

const CodeSnippet = styled.div`
  background: #1e293b;
  color: #f1f5f9;
  border-radius: 6px;
  margin-top: 0.5rem;
  overflow: hidden;
`;

const CodeHeader = styled.div`
  background: #334155;
  padding: 0.5rem;
  font-size: 0.75rem;
  font-weight: 600;
`;

const TypingIndicator = styled.div`
  display: flex;
  gap: 4px;

  span {
    width: 8px;
    height: 8px;
    background: #94a3b8;
    border-radius: 50%;
    animation: typing 1.4s infinite ease-in-out;

    &:nth-child(1) {
      animation-delay: -0.32s;
    }
    &:nth-child(2) {
      animation-delay: -0.16s;
    }
  }

  @keyframes typing {
    0%,
    80%,
    100% {
      transform: scale(0);
    }
    40% {
      transform: scale(1);
    }
  }
`;

const ChatInput = styled.div`
  padding: 1rem;
  border-top: 1px solid #e2e8f0;
`;

const InputContainer = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const MessageInput = styled.input`
  flex: 1;
  padding: 0.75rem;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  outline: none;

  &:focus {
    border-color: #667eea;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
  }
`;

const SendButton = styled.button`
  background: #667eea;
  color: white;
  border: none;
  border-radius: 8px;
  padding: 0.75rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    background: #5a67d8;
  }
`;

const SidebarSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const QuickActions = styled.div`
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
`;

const SectionTitle = styled.h3`
  font-size: 1.1rem;
  font-weight: 600;
  color: #1a202c;
  margin-bottom: 1rem;
`;

const ActionCard = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  padding: 0.75rem;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background: #f8fafc;
  }
`;

const ActionIcon = styled.div`
  background: #eef2ff;
  color: #667eea;
  padding: 0.5rem;
  border-radius: 8px;
  font-size: 1.25rem;
`;

const ActionContent = styled.div`
  flex: 1;
`;

const ActionTitle = styled.div`
  font-weight: 600;
  color: #1a202c;
  margin-bottom: 0.25rem;
`;

const ActionDescription = styled.div`
  font-size: 0.875rem;
  color: #64748b;
  line-height: 1.4;
`;

const AIStats = styled.div`
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
`;

const StatItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem 0;
  border-bottom: 1px solid #f1f5f9;

  &:last-child {
    border-bottom: none;
  }
`;

const StatLabel = styled.span`
  color: #64748b;
  font-size: 0.875rem;
`;

const StatValue = styled.span`
  font-weight: 600;
  color: #667eea;
`;

export default AIAssistant;
