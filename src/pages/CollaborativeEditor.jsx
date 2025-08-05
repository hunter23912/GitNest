import React, { useState } from "react";
import styled from "styled-components";
import { FiUsers, FiEdit3, FiSave, FiShare2, FiEye, FiMessageCircle } from "react-icons/fi";
import { FaUser, FaCircle } from "react-icons/fa";
import Navbar from "../components/Navbar";

// 类型全部移除，改为JSX

function CollaborativeEditor() {
  const [code, setCode] = useState(`function fibonacci(n) {
  if (n <= 1) {
    return n;
  }
  return fibonacci(n - 1) + fibonacci(n - 2);
}

// 优化版本使用动态规划
function fibonacciDP(n) {
  const dp = [0, 1];
  for (let i = 2; i <= n; i++) {
    dp[i] = dp[i - 1] + dp[i - 2];
  }
  return dp[n];
}

console.log(fibonacci(10));
console.log(fibonacciDP(10));`);

  const [activeUsers] = useState([
    { id: "1", name: "Alice Chen", color: "#3b82f6", cursor: { line: 5, column: 10 } },
    { id: "2", name: "Bob Wang", color: "#10b981", cursor: { line: 12, column: 5 } },
    { id: "3", name: "Carol Li", color: "#f59e0b", cursor: { line: 8, column: 15 } },
  ]);

  const [comments] = useState([
    {
      id: "1",
      user: activeUsers[0],
      content: "这里可以使用记忆化来优化递归版本",
      line: 4,
      timestamp: new Date(Date.now() - 300000),
    },
    {
      id: "2",
      user: activeUsers[1],
      content: "动态规划版本的时间复杂度更好",
      line: 9,
      timestamp: new Date(Date.now() - 180000),
    },
  ]);

  const [selectedLine, setSelectedLine] = useState(null);
  const [newComment, setNewComment] = useState("");
  const [showChat, setShowChat] = useState(false);
  const [chatMessages] = useState([
    { user: "Alice", message: "大家好，我们开始协作吧！", time: "10:30" },
    { user: "Bob", message: "这个算法实现得不错", time: "10:32" },
    { user: "Carol", message: "我建议我们添加一些测试用例", time: "10:35" },
  ]);

  const [isLiveMode, setIsLiveMode] = useState(true);
  const [viewers] = useState(23);

  const handleLineClick = (lineNumber) => {
    setSelectedLine(lineNumber);
  };

  const handleAddComment = () => {
    if (newComment.trim() && selectedLine !== null) {
      // 在实际应用中，这里会发送到服务器
      console.log("添加评论:", { line: selectedLine, comment: newComment });
      setNewComment("");
      setSelectedLine(null);
    }
  };

  return (
    <Container>
      <Navbar />
      <Content>
        <Header>
          <HeaderLeft>
            <FileInfo>
              <FileName>fibonacci.js</FileName>
              <FilePath>/src/algorithms/fibonacci.js</FilePath>
            </FileInfo>
            <LiveIndicator isLive={isLiveMode}>
              <FaCircle size={8} />
              实时协作中
              <ViewersCount>
                <FiEye size={14} />
                {viewers} 人在线
              </ViewersCount>
            </LiveIndicator>
          </HeaderLeft>
          <HeaderRight>
            <ActionButton>
              <FiSave size={16} />
              保存
            </ActionButton>
            <ActionButton>
              <FiShare2 size={16} />
              分享
            </ActionButton>
            <ActionButton onClick={() => setShowChat(!showChat)}>
              <FiMessageCircle size={16} />
              聊天
            </ActionButton>
          </HeaderRight>
        </Header>

        <MainContent>
          <EditorSection>
            <EditorHeader>
              <EditorTitle>
                <FiEdit3 />
                代码编辑器
              </EditorTitle>
              <CollaboratorsList>
                <CollaboratorsTitle>
                  <FiUsers size={14} />
                  协作者 ({activeUsers.length})
                </CollaboratorsTitle>
                <UserAvatars>
                  {activeUsers.map((user) => (
                    <UserAvatar key={user.id} color={user.color}>
                      {user.avatar ? <img src={user.avatar} alt={user.name} /> : <FaUser size={12} />}
                      <UserTooltip>{user.name}</UserTooltip>
                    </UserAvatar>
                  ))}
                </UserAvatars>
              </CollaboratorsList>
            </EditorHeader>

            <EditorContainer>
              <LineNumbers>
                {code.split("\n").map((_, index) => (
                  <LineNumber
                    key={index}
                    onClick={() => handleLineClick(index + 1)}
                    hasComment={comments.some((c) => c.line === index + 1)}
                    isSelected={selectedLine === index + 1}
                  >
                    {index + 1}
                  </LineNumber>
                ))}
              </LineNumbers>
              <CodeArea value={code} onChange={(e) => setCode(e.target.value)} spellCheck={false} />
              <CommentsOverlay>
                {comments.map((comment) => (
                  <CommentIndicator key={comment.id} line={comment.line} color={comment.user.color}>
                    <CommentTooltip>
                      <CommentAuthor>{comment.user.name}</CommentAuthor>
                      <CommentContent>{comment.content}</CommentContent>
                      <CommentTime>{comment.timestamp.toLocaleTimeString()}</CommentTime>
                    </CommentTooltip>
                  </CommentIndicator>
                ))}
              </CommentsOverlay>
            </EditorContainer>

            {selectedLine && (
              <CommentInput>
                <CommentInputField>
                  <input
                    type="text"
                    placeholder={`在第 ${selectedLine} 行添加评论...`}
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && handleAddComment()}
                  />
                  <CommentButton onClick={handleAddComment}>添加评论</CommentButton>
                </CommentInputField>
              </CommentInput>
            )}
          </EditorSection>

          {showChat && (
            <ChatSection>
              <ChatHeader>
                <FiMessageCircle />
                团队聊天
              </ChatHeader>
              <ChatMessages>
                {chatMessages.map((msg, index) => (
                  <ChatMessage key={index}>
                    <MessageUser>{msg.user}</MessageUser>
                    <MessageContent>{msg.message}</MessageContent>
                    <MessageTime>{msg.time}</MessageTime>
                  </ChatMessage>
                ))}
              </ChatMessages>
              <ChatInput>
                <input type="text" placeholder="输入消息..." />
                <button>发送</button>
              </ChatInput>
            </ChatSection>
          )}
        </MainContent>
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
  padding: 1rem;

  @media (min-width: 1600px) {
    max-width: 1600px;
  }
`;

const Header = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: white;
  padding: 1rem 1.5rem;
  border-radius: 12px 12px 0 0;
  border-bottom: 1px solid #e2e8f0;
`;

const HeaderLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 1.5rem;
`;

const FileInfo = styled.div``;

const FileName = styled.h2`
  font-size: 1.25rem;
  font-weight: 600;
  color: #1a202c;
  margin: 0;
`;

const FilePath = styled.p`
  font-size: 0.875rem;
  color: #64748b;
  margin: 0;
`;

const LiveIndicator = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 0.75rem;
  background: ${(props) => (props.isLive ? "#dcfce7" : "#f1f5f9")};
  color: ${(props) => (props.isLive ? "#166534" : "#475569")};
  border-radius: 6px;
  font-size: 0.875rem;
  font-weight: 500;
`;

const ViewersCount = styled.span`
  display: flex;
  align-items: center;
  gap: 0.25rem;
  margin-left: 0.5rem;
  font-size: 0.75rem;
  opacity: 0.8;
`;

const HeaderRight = styled.div`
  display: flex;
  gap: 0.75rem;
`;

const ActionButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: #667eea;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background: #5a67d8;
  }
`;

const MainContent = styled.div`
  display: grid;
  grid-template-columns: 1fr auto;
  background: white;
  border-radius: 0 0 12px 12px;
  overflow: hidden;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
`;

const EditorSection = styled.div`
  display: flex;
  flex-direction: column;
`;

const EditorHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 1.5rem;
  background: #f8fafc;
  border-bottom: 1px solid #e2e8f0;
`;

const EditorTitle = styled.h3`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1rem;
  font-weight: 600;
  color: #1a202c;
  margin: 0;
`;

const CollaboratorsList = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
`;

const CollaboratorsTitle = styled.span`
  display: flex;
  align-items: center;
  gap: 0.25rem;
  font-size: 0.875rem;
  color: #64748b;
`;

const UserAvatars = styled.div`
  display: flex;
  gap: 0.25rem;
`;

const UserAvatar = styled.div`
  position: relative;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: ${(props) => props.color};
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.75rem;
  cursor: pointer;

  img {
    width: 100%;
    height: 100%;
    border-radius: 50%;
  }

  &:hover > div {
    opacity: 1;
    transform: translateY(-100%);
  }
`;

const UserTooltip = styled.div`
  position: absolute;
  bottom: 100%;
  left: 50%;
  transform: translateX(-50%) translateY(-10px);
  background: #1a202c;
  color: white;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.75rem;
  white-space: nowrap;
  opacity: 0;
  transition: all 0.2s;
  pointer-events: none;
  z-index: 10;

  &::after {
    content: "";
    position: absolute;
    top: 100%;
    left: 50%;
    transform: translateX(-50%);
    border: 4px solid transparent;
    border-top-color: #1a202c;
  }
`;

const EditorContainer = styled.div`
  position: relative;
  display: flex;
  height: 500px;
`;

const LineNumbers = styled.div`
  background: #f8fafc;
  padding: 1rem 0.5rem;
  border-right: 1px solid #e2e8f0;
  user-select: none;
  width: 60px;
  overflow: hidden;
`;

const LineNumber = styled.div`
  height: 20px;
  line-height: 20px;
  text-align: right;
  color: #94a3b8;
  font-size: 0.875rem;
  font-family: "Monaco", "Menlo", monospace;
  cursor: pointer;
  padding-right: 0.5rem;
  position: relative;
  background: ${(props) => (props.isSelected ? "#eef2ff" : "transparent")};

  &:hover {
    background: #f1f5f9;
  }

  ${(props) =>
    props.hasComment &&
    `
    &::after {
      content: '';
      position: absolute;
      right: 2px;
      top: 50%;
      transform: translateY(-50%);
      width: 6px;
      height: 6px;
      background: #f59e0b;
      border-radius: 50%;
    }
  `}
`;

const CodeArea = styled.textarea`
  flex: 1;
  padding: 1rem;
  border: none;
  outline: none;
  font-family: "Monaco", "Menlo", monospace;
  font-size: 14px;
  line-height: 20px;
  resize: none;
  background: white;
  color: #1a202c;
`;

const CommentsOverlay = styled.div`
  position: absolute;
  right: 0;
  top: 0;
  bottom: 0;
  width: 20px;
  pointer-events: none;
`;

const CommentIndicator = styled.div`
  position: absolute;
  right: 5px;
  top: ${(props) => (props.line - 1) * 20 + 16 + 10}px;
  width: 10px;
  height: 10px;
  background: ${(props) => props.color};
  border-radius: 50%;
  cursor: pointer;
  pointer-events: all;

  &:hover > div {
    opacity: 1;
    transform: translateX(-100%) translateY(-50%);
  }
`;

const CommentTooltip = styled.div`
  position: absolute;
  right: 100%;
  top: 50%;
  transform: translateX(-90%) translateY(-50%);
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  padding: 0.75rem;
  min-width: 200px;
  opacity: 0;
  transition: all 0.2s;
  pointer-events: none;
  z-index: 10;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);

  &::after {
    content: "";
    position: absolute;
    left: 100%;
    top: 50%;
    transform: translateY(-50%);
    border: 6px solid transparent;
    border-left-color: white;
  }
`;

const CommentAuthor = styled.div`
  font-size: 0.75rem;
  font-weight: 600;
  color: #4a5568;
  margin-bottom: 0.25rem;
`;

const CommentContent = styled.div`
  font-size: 0.875rem;
  color: #1a202c;
  margin-bottom: 0.5rem;
`;

const CommentTime = styled.div`
  font-size: 0.75rem;
  color: #94a3b8;
`;

const CommentInput = styled.div`
  padding: 1rem 1.5rem;
  background: #f8fafc;
  border-top: 1px solid #e2e8f0;
`;

const CommentInputField = styled.div`
  display: flex;
  gap: 0.75rem;

  input {
    flex: 1;
    padding: 0.5rem 0.75rem;
    border: 1px solid #e2e8f0;
    border-radius: 6px;
    outline: none;

    &:focus {
      border-color: #667eea;
      box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
    }
  }
`;

const CommentButton = styled.button`
  padding: 0.5rem 1rem;
  background: #667eea;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 0.875rem;
  cursor: pointer;

  &:hover {
    background: #5a67d8;
  }
`;

const ChatSection = styled.div`
  width: 300px;
  border-left: 1px solid #e2e8f0;
  display: flex;
  flex-direction: column;
`;

const ChatHeader = styled.div`
  padding: 1rem;
  background: #f8fafc;
  border-bottom: 1px solid #e2e8f0;
  font-weight: 600;
  color: #1a202c;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const ChatMessages = styled.div`
  flex: 1;
  padding: 1rem;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

const ChatMessage = styled.div`
  padding: 0.5rem;
  background: #f8fafc;
  border-radius: 6px;
`;

const MessageUser = styled.div`
  font-size: 0.75rem;
  font-weight: 600;
  color: #4a5568;
  margin-bottom: 0.25rem;
`;

const MessageContent = styled.div`
  font-size: 0.875rem;
  color: #1a202c;
  margin-bottom: 0.25rem;
`;

const MessageTime = styled.div`
  font-size: 0.75rem;
  color: #94a3b8;
`;

const ChatInput = styled.div`
  padding: 1rem;
  border-top: 1px solid #e2e8f0;
  display: flex;
  gap: 0.5rem;

  input {
    flex: 1;
    padding: 0.5rem;
    border: 1px solid #e2e8f0;
    border-radius: 4px;
    outline: none;
    font-size: 0.875rem;

    &:focus {
      border-color: #667eea;
    }
  }

  button {
    padding: 0.5rem 0.75rem;
    background: #667eea;
    color: white;
    border: none;
    border-radius: 4px;
    font-size: 0.875rem;
    cursor: pointer;

    &:hover {
      background: #5a67d8;
    }
  }
`;

export default CollaborativeEditor;
