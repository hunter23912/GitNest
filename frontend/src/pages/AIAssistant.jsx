import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import { FiSend } from "react-icons/fi";
import { MdCancel } from "react-icons/md";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";

function AIAssistant() {
  const chatMessagesRef = useRef(null);
  const DEEPSEEK_API_KEY = "sk-d728c443f64a4a369bac7a9603408d80";

  const [messages, setMessages] = useState([
    {
      id: "1",
      type: "ai",
      content: "你好！我是 GitNest AI 代码助手。有什么我可以帮助您的吗？",
      timestamp: new Date(),
    },
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [streamContent, setStreamContent] = useState("");
  const [abortController, setAbortController] = useState(null);
  const [isAborted, setIsAborted] = useState(false);

  useEffect(() => {
    if (chatMessagesRef.current) {
      chatMessagesRef.current.scrollTop = chatMessagesRef.current.scrollHeight;
    }
  }, [messages, isTyping, streamContent]);

  // 流式响应
  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    setIsAborted(false);
    const userMessage = {
      id: Date.now().toString(),
      type: "user",
      content: inputMessage,
      timestamp: new Date(),
    };
    const controller = new AbortController();
    setAbortController(controller);
    setMessages((prev) => [...prev, userMessage]);
    setInputMessage("");
    setIsTyping(true);
    setStreamContent("");

    const history = [
      ...messages.map((m) => ({
        role: m.type === "user" ? "user" : "assistant",
        content: m.content,
      })),
      { role: "user", content: inputMessage },
    ];

    try {
      const res = await fetch("https://api.deepseek.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${DEEPSEEK_API_KEY}`,
        },
        body: JSON.stringify({
          model: "deepseek-chat",
          messages: history,
          stream: true,
        }),
        signal: controller.signal,
      });

      if (!res.body) throw new Error("无响应流");

      const reader = res.body.getReader();
      let aiContent = "";
      const decoder = new TextDecoder("utf-8");

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value);
        chunk.split("\n").forEach((line) => {
          if (line.startsWith("data:")) {
            try {
              const json = JSON.parse(line.slice(5));
              const delta = json.choices?.[0]?.delta?.content || "";
              aiContent += delta;
              setStreamContent(aiContent);
            } catch {}
          }
        });
      }

      const aiResponse = {
        id: (Date.now() + 1).toString(),
        type: "ai",
        content: aiContent || "AI助手暂时无法回答，请稍后再试。",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, aiResponse]);
    } catch (err) {
      if (err.name === "AbortError") {
        setIsAborted(true);
        setMessages((prev) => [
          ...prev,
          {
            id: (Date.now() + 2).toString(),
            type: "ai",
            content: "回复已中断。",
            timestamp: new Date(),
          },
        ]);
      } else {
        setMessages((prev) => [
          ...prev,
          {
            id: (Date.now() + 2).toString(),
            type: "ai",
            content: "AI助手请求失败，请检查网络或API Key。",
            timestamp: new Date(),
          },
        ]);
      }
    } finally {
      setIsTyping(false);
      setStreamContent("");
      setAbortController(null);
    }
  };

  const handleAbort = () => {
    if (abortController) {
      abortController.abort();
      setIsTyping(false);
      setAbortController(null);
    }
  };

  return (
    <FullScreenContainer>
      <ChatBox>
        <ChatMessages ref={chatMessagesRef}>
          {messages.map((message, idx) => (
            <MessageBubble key={message.id} type={message.type}>
              <MessageContent>
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  components={{
                    code({ node, inline, className, children, ...props }) {
                      const match = /language-(\w+)/.exec(className || "");
                      return !inline ? (
                        <SyntaxHighlighter style={oneDark} language={match?.[1] || "plaintext"} PreTag="div" {...props}>
                          {String(children).replace(/\n$/, "")}
                        </SyntaxHighlighter>
                      ) : (
                        <code className={className} {...props}>
                          {children}
                        </code>
                      );
                    },
                    table({ children }) {
                      return <table style={{ borderCollapse: "collapse", width: "100%" }}>{children}</table>;
                    },
                    th({ children }) {
                      return <th style={{ border: "1px solid #e2e8f0", padding: "6px", background: "#f8fafc" }}>{children}</th>;
                    },
                    td({ children }) {
                      return <td style={{ border: "1px solid #e2e8f0", padding: "6px" }}>{children}</td>;
                    },
                  }}
                >
                  {message.content}
                </ReactMarkdown>
              </MessageContent>
            </MessageBubble>
          ))}
          {isTyping && (
            <MessageBubble type="ai">
              <MessageContent>
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  components={{
                    code({ node, inline, className, children, ...props }) {
                      const match = /language-(\w+)/.exec(className || "");
                      return !inline ? (
                        <SyntaxHighlighter style={oneDark} language={match?.[1] || "plaintext"} PreTag="div" {...props}>
                          {String(children).replace(/\n$/, "")}
                        </SyntaxHighlighter>
                      ) : (
                        <code className={className} {...props}>
                          {children}
                        </code>
                      );
                    },
                    table({ children }) {
                      return <table style={{ borderCollapse: "collapse", width: "100%" }}>{children}</table>;
                    },
                    th({ children }) {
                      return <th style={{ border: "1px solid #e2e8f0", padding: "6px", background: "#f8fafc" }}>{children}</th>;
                    },
                    td({ children }) {
                      return <td style={{ border: "1px solid #e2e8f0", padding: "6px" }}>{children}</td>;
                    },
                  }}
                >
                  {streamContent}
                </ReactMarkdown>
              </MessageContent>
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
            <MessageInput value={inputMessage} onChange={(e) => setInputMessage(e.target.value)} placeholder="输入您的问题或粘贴代码..." onKeyPress={(e) => e.key === "Enter" && handleSendMessage()} />
            <SendButton onClick={isTyping ? handleAbort : handleSendMessage}>{isTyping ? <MdCancel size={22} /> : <FiSend />}</SendButton>
          </InputContainer>
        </ChatInput>
      </ChatBox>
    </FullScreenContainer>
  );
}

// 样式组件
const FullScreenContainer = styled.div`
  min-height: 100vh;
  width: 100vw;
  background: #f8fafc;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden; /* 去除外部滚动条 */
`;

const ChatBox = styled.div`
  width: 100vw;
  height: 100vh;
  background: white;
  border-radius: 0;
  box-shadow: none;
  display: flex;
  flex-direction: column;
  overflow: hidden; /* 去除内部滚动条 */
`;

const ChatMessages = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 2rem 1.5rem 1rem 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1.2rem;
`;

const MessageBubble = styled.div`
  align-self: ${(props) => (props.type === "user" ? "flex-end" : "flex-start")};
  max-width: 80%;
  background: ${(props) => (props.type === "user" ? "#667eea" : "#f1f5f9")};
  color: ${(props) => (props.type === "user" ? "white" : "#334155")};
  padding: 0.18rem 0.7rem; // 更小的上下间距
  border-radius: 14px;
  border-top-${(props) => (props.type === "user" ? "right" : "left")}-radius: 4px;
  word-break: break-word;
`;

const MessageContent = styled.div`
  white-space: pre-wrap;
  line-height: 1.15; // 更紧凑
  font-size: 1rem;
  code {
    background: #e2e8f0;
    padding: 2px 4px;
    border-radius: 4px;
    font-family: "Monaco", "Menlo", "Ubuntu Mono", monospace;
  }
`;

const TypingIndicator = styled.div`
  display: flex;
  gap: 4px;
  margin-top: 8px;

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
  padding: 1rem 1.5rem;
  border-top: 1px solid #e2e8f0;
  background: #f8fafc;
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
  font-size: 1rem;

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

export default AIAssistant;
