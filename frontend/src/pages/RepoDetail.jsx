import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import styled from "styled-components";
import {
  FaStar,
  FaCodeBranch,
  FaEye,
  FaCode,
  FaDownload,
  FaClone,
  FaFolder,
  FaFile,
  FaCalendarAlt,
  FaUser,
} from "react-icons/fa";

// 纯 JS/JSX 版本
const RepoDetail = () => {
  const { username, reponame } = useParams();
  const [repository, setRepository] = useState(null);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [files, setFiles] = useState([]);
  const [readmeContent, setReadmeContent] = useState("");
  const [activeTab, setActiveTab] = useState("code");
  const navigate = useNavigate();

  // 模拟文件列表数据
  const mockFiles = [
    {
      name: "src",
      type: "folder",
      lastModified: new Date("2024-01-15"),
      message: "Add new components",
    },
    {
      name: "public",
      type: "folder",
      lastModified: new Date("2024-01-10"),
      message: "Update assets",
    },
    {
      name: "package.json",
      type: "file",
      size: "2.1 KB",
      lastModified: new Date("2024-01-15"),
      message: "Update dependencies",
    },
    {
      name: "README.md",
      type: "file",
      size: "3.5 KB",
      lastModified: new Date("2024-01-12"),
      message: "Update documentation",
    },
    {
      name: ".gitignore",
      type: "file",
      size: "451 B",
      lastModified: new Date("2024-01-08"),
      message: "Add build artifacts to gitignore",
    },
  ];

  const mockReadme = `# ${reponame}

这是一个示例项目，展示了如何使用现代前端技术栈构建应用程序。

## 特性

- ⚡ 快速开发体验
- 🎨 现代化的UI设计
- 📱 响应式布局
- 🔧 完整的工具链

## 技术栈

- React 18
- TypeScript
- Styled Components
- Vite

## 开始使用

### 安装依赖

\`\`\`bash
npm install
\`\`\`

### 启动开发服务器

\`\`\`bash
npm run dev
\`\`\`

### 构建生产版本

\`\`\`bash
npm run build
\`\`\`

## 贡献

欢迎提交 Pull Request 或者创建 Issue。

## 许可证

MIT License
`;

  useEffect(() => {
    const loadRepository = async () => {
      try {
        setIsLoading(true);

        // 模拟 API 延迟
        await new Promise((resolve) => setTimeout(resolve, 500));

        // 模拟仓库数据
        const mockRepo = {
          id: 1,
          name: reponame || "unknown",
          description: "一个很棒的React项目，包含现代化的UI组件和状态管理",
          language: "TypeScript",
          stars: 42,
          forks: 7,
          isPrivate: false,
          updatedAt: new Date("2024-01-15"),
          owner: username || "unknown",
          topics: ["react", "typescript", "ui"],
          defaultBranch: "main",
          size: 1250,
          createdAt: new Date("2023-12-01"),
        };

        const mockUser = {
          id: 1,
          username: username || "unknown",
          email: "user@example.com",
          name: "Test User",
          avatarUrl: "",
        };

        setRepository(mockRepo);
        setUser(mockUser);
        setFiles(mockFiles);
        setReadmeContent(mockReadme);
      } catch (error) {
        console.error("加载仓库信息失败:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (username && reponame) {
      loadRepository();
    }
  }, [username, reponame]);

  const handleStarRepo = () => {
    if (repository) {
      setRepository((prev) =>
        prev
          ? {
              ...prev,
              stars: prev.stars + 1,
            }
          : null
      );
    }
  };

  const handleForkRepo = () => {
    if (repository) {
      setRepository((prev) =>
        prev
          ? {
              ...prev,
              forks: prev.forks + 1,
            }
          : null
      );
    }
  };

  const formatDate = (date) => {
    return date.toLocaleDateString("zh-CN", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
  };

  if (isLoading) {
    return (
      <Container>
        <LoadingText>加载中...</LoadingText>
      </Container>
    );
  }

  if (!repository || !user) {
    return (
      <Container>
        <ErrorText>仓库不存在</ErrorText>
      </Container>
    );
  }

  return (
    <Container>
      <RepoHeader>
        <RepoInfo>
          <RepoPath>
            <PathLink onClick={() => navigate(`/user/${user.username}`)}>{user.username}</PathLink>
            <PathSeparator>/</PathSeparator>
            <RepoName>{repository.name}</RepoName>
            {repository.isPrivate && <PrivateBadge>Private</PrivateBadge>}
          </RepoPath>
          <RepoDescription>{repository.description}</RepoDescription>
          {repository.topics && repository.topics.length > 0 && (
            <TopicsContainer>
              {repository.topics.map((topic) => (
                <Topic key={topic}>{topic}</Topic>
              ))}
            </TopicsContainer>
          )}
        </RepoInfo>

        <RepoActions>
          <WatchButton>
            <FaEye size={14} />
            Watch
          </WatchButton>
          <StarButton onClick={handleStarRepo}>
            <FaStar size={14} />
            Star {repository.stars}
          </StarButton>
          <ForkButton onClick={handleForkRepo}>
            <FaCodeBranch size={14} />
            Fork {repository.forks}
          </ForkButton>
        </RepoActions>
      </RepoHeader>

      <RepoStats>
        <StatItem>
          <FaCode size={14} />
          {repository.language}
        </StatItem>
        <StatItem>
          <FaStar size={14} />
          {repository.stars} stars
        </StatItem>
        <StatItem>
          <FaCodeBranch size={14} />
          {repository.forks} forks
        </StatItem>
        <StatItem>
          <FaCalendarAlt size={14} />
          更新于 {formatDate(repository.updatedAt)}
        </StatItem>
      </RepoStats>

      <RepoTabs>
        <Tab active={activeTab === "code"} onClick={() => setActiveTab("code")}>
          <FaCode size={14} />
          代码
        </Tab>
        <Tab active={activeTab === "issues"} onClick={() => setActiveTab("issues")}>
          Issues (0)
        </Tab>
        <Tab active={activeTab === "pulls"} onClick={() => setActiveTab("pulls")}>
          Pull requests (0)
        </Tab>
      </RepoTabs>

      <RepoContent>
        {activeTab === "code" && (
          <>
            <CodeHeader>
              <BranchInfo>
                <BranchButton>
                  <FaCodeBranch size={14} />
                  {repository.defaultBranch}
                </BranchButton>
                <CommitInfo>
                  <FaUser size={12} />
                  最后提交于 {formatDate(repository.updatedAt)}
                </CommitInfo>
              </BranchInfo>

              <CodeActions>
                <CloneButton>
                  <FaClone size={14} />
                  Clone
                </CloneButton>
                <DownloadButton>
                  <FaDownload size={14} />
                  Download ZIP
                </DownloadButton>
              </CodeActions>
            </CodeHeader>

            <FilesContainer>
              <FilesHeader>
                <FilesTitle>文件列表</FilesTitle>
              </FilesHeader>

              <FilesList>
                {files.map((file, index) => (
                  <FileItem key={index}>
                    <FileIcon>
                      {file.type === "folder" ? (
                        <FaFolder size={16} color="#79b8ff" />
                      ) : (
                        <FaFile size={16} color="#586069" />
                      )}
                    </FileIcon>
                    <FileName>{file.name}</FileName>
                    <FileMessage>{file.message}</FileMessage>
                    <FileMetadata>
                      {file.size && <FileSize>{file.size}</FileSize>}
                      <FileDate>{formatDate(file.lastModified)}</FileDate>
                    </FileMetadata>
                  </FileItem>
                ))}
              </FilesList>
            </FilesContainer>

            <ReadmeContainer>
              <ReadmeHeader>
                <ReadmeTitle>README.md</ReadmeTitle>
              </ReadmeHeader>
              <ReadmeContent>
                <pre>{readmeContent}</pre>
              </ReadmeContent>
            </ReadmeContainer>
          </>
        )}

        {activeTab === "issues" && (
          <EmptyState>
            <EmptyIcon>📋</EmptyIcon>
            <EmptyTitle>暂无 Issues</EmptyTitle>
            <EmptyDescription>还没有人创建 Issue。</EmptyDescription>
          </EmptyState>
        )}

        {activeTab === "pulls" && (
          <EmptyState>
            <EmptyIcon>🔄</EmptyIcon>
            <EmptyTitle>暂无 Pull Requests</EmptyTitle>
            <EmptyDescription>还没有人创建 Pull Request。</EmptyDescription>
          </EmptyState>
        )}
      </RepoContent>
    </Container>
  );
};

const Container = styled.div`
  width: 100%;
  margin: 0 auto;
  padding: 20px;

  @media (min-width: 1400px) {
    max-width: 1400px;
  }
`;

const LoadingText = styled.div`
  text-align: center;
  padding: 60px 0;
  color: #6b7280;
  font-size: 1.1rem;
`;

const ErrorText = styled.div`
  text-align: center;
  padding: 60px 0;
  color: #ef4444;
  font-size: 1.1rem;
`;

const RepoHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 16px;
  gap: 20px;

  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const RepoInfo = styled.div`
  flex: 1;
`;

const RepoPath = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
`;

const PathLink = styled.button`
  background: none;
  border: none;
  color: #0969da;
  font-size: 1.25rem;
  font-weight: 600;
  cursor: pointer;
  outline: none !important;
  box-shadow: none !important;

  &:hover {
    text-decoration: underline;
  }

  &:focus,
  &:focus-visible {
    outline: none !important;
    box-shadow: none !important;
    text-decoration: underline;
  }

  &:active {
    outline: none !important;
    box-shadow: none !important;
  }
`;

const PathSeparator = styled.span`
  color: #7d8590;
  font-size: 1.25rem;
`;

const RepoName = styled.h1`
  color: #0969da;
  font-size: 1.25rem;
  font-weight: 600;
  margin: 0;
`;

const PrivateBadge = styled.span`
  padding: 2px 8px;
  border: 1px solid #d1d9e0;
  border-radius: 12px;
  font-size: 12px;
  color: #7d8590;
`;

const RepoDescription = styled.p`
  color: #7d8590;
  margin: 8px 0;
  line-height: 1.5;
`;

const TopicsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-top: 8px;
`;

const Topic = styled.span`
  background-color: #dbeafe;
  color: #1e40af;
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
`;

const RepoActions = styled.div`
  display: flex;
  gap: 8px;
`;

const ActionButton = styled.button`
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  border: 1px solid #d1d9e0;
  border-radius: 6px;
  background: white;
  color: #24292f;
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  outline: none !important;
  box-shadow: none !important;
  transition: background-color 0.2s;

  &:hover {
    background-color: #f6f8fa;
  }

  &:focus,
  &:focus-visible {
    outline: none !important;
    box-shadow: none !important;
    background-color: #f6f8fa;
  }

  &:active {
    outline: none !important;
    box-shadow: none !important;
  }
`;

const WatchButton = styled(ActionButton)``;
const StarButton = styled(ActionButton)``;
const ForkButton = styled(ActionButton)``;

const RepoStats = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 20px;
  font-size: 14px;
  color: #7d8590;

  @media (max-width: 768px) {
    flex-wrap: wrap;
    gap: 12px;
  }
`;

const StatItem = styled.span`
  display: flex;
  align-items: center;
  gap: 4px;
`;

const RepoTabs = styled.div`
  display: flex;
  border-bottom: 1px solid #d1d9e0;
  margin-bottom: 20px;
`;

const Tab = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  border: none;
  background: none;
  color: ${(props) => (props.active ? "#24292f" : "#7d8590")};
  cursor: pointer;
  border-bottom: 2px solid ${(props) => (props.active ? "#fd8c73" : "transparent")};
  font-size: 14px;
  font-weight: ${(props) => (props.active ? "600" : "400")};
  outline: none !important;
  box-shadow: none !important;

  &:hover {
    color: #24292f;
  }

  &:focus,
  &:focus-visible {
    outline: none !important;
    box-shadow: none !important;
    color: #24292f;
  }

  &:active {
    outline: none !important;
    box-shadow: none !important;
  }
`;

const RepoContent = styled.div``;

const CodeHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 12px;
    align-items: flex-start;
  }
`;

const BranchInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const BranchButton = styled.button`
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  border: 1px solid #d1d9e0;
  border-radius: 6px;
  background: white;
  color: #24292f;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  outline: none !important;
  box-shadow: none !important;
  transition: background-color 0.2s;

  &:hover {
    background-color: #f6f8fa;
  }

  &:focus,
  &:focus-visible {
    outline: none !important;
    box-shadow: none !important;
    background-color: #f6f8fa;
  }

  &:active {
    outline: none !important;
    box-shadow: none !important;
  }
`;

const CommitInfo = styled.span`
  display: flex;
  align-items: center;
  gap: 4px;
  color: #7d8590;
  font-size: 12px;
`;

const CodeActions = styled.div`
  display: flex;
  gap: 8px;
`;

const CloneButton = styled(ActionButton)`
  background-color: #238636;
  color: white;
  border-color: #238636;

  &:hover {
    background-color: #2ea043;
  }
`;

const DownloadButton = styled(ActionButton)``;

const FilesContainer = styled.div`
  border: 1px solid #d1d9e0;
  border-radius: 8px;
  margin-bottom: 24px;
  overflow: hidden;
`;

const FilesHeader = styled.div`
  background-color: #f6f8fa;
  padding: 12px 16px;
  border-bottom: 1px solid #d1d9e0;
`;

const FilesTitle = styled.h3`
  font-size: 14px;
  font-weight: 600;
  color: #24292f;
  margin: 0;
`;

const FilesList = styled.div``;

const FileItem = styled.div`
  display: grid;
  grid-template-columns: auto 1fr auto auto;
  align-items: center;
  gap: 12px;
  padding: 8px 16px;
  border-bottom: 1px solid #e1e5e9;

  &:last-child {
    border-bottom: none;
  }

  &:hover {
    background-color: #f6f8fa;
  }

  @media (max-width: 768px) {
    grid-template-columns: auto 1fr;
    gap: 8px;
  }
`;

const FileIcon = styled.div`
  display: flex;
  align-items: center;
`;

const FileName = styled.div`
  color: #0969da;
  font-weight: 500;
  cursor: pointer;

  &:hover {
    text-decoration: underline;
  }
`;

const FileMessage = styled.div`
  color: #7d8590;
  font-size: 12px;

  @media (max-width: 768px) {
    grid-column: 1 / -1;
    margin-left: 28px;
  }
`;

const FileMetadata = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 12px;
  color: #7d8590;

  @media (max-width: 768px) {
    grid-column: 1 / -1;
    margin-left: 28px;
  }
`;

const FileSize = styled.span``;
const FileDate = styled.span``;

const ReadmeContainer = styled.div`
  border: 1px solid #d1d9e0;
  border-radius: 8px;
  overflow: hidden;
`;

const ReadmeHeader = styled.div`
  background-color: #f6f8fa;
  padding: 12px 16px;
  border-bottom: 1px solid #d1d9e0;
`;

const ReadmeTitle = styled.h3`
  font-size: 14px;
  font-weight: 600;
  color: #24292f;
  margin: 0;
`;

const ReadmeContent = styled.div`
  padding: 16px;

  pre {
    white-space: pre-wrap;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
    line-height: 1.6;
    color: #24292f;
    margin: 0;
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 60px 20px;
`;

const EmptyIcon = styled.div`
  font-size: 3rem;
  margin-bottom: 16px;
`;

const EmptyTitle = styled.h3`
  color: #24292f;
  margin-bottom: 8px;
`;

const EmptyDescription = styled.p`
  color: #7d8590;
  margin: 0;
`;

export default RepoDetail;
