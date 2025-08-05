import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { FaUser, FaStar, FaFolder, FaMapMarkerAlt, FaLink, FaEnvelope, FaEdit, FaPlus, FaSearch } from "react-icons/fa";
// 类型全部移除，改为JSX

function Profile() {
  const { username } = useParams();
  const [user, setUser] = useState(null);
  const [isOwnProfile, setIsOwnProfile] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [avatarError, setAvatarError] = useState(false);
  const [activeTab, setActiveTab] = useState("repositories");
  const [repoSearch, setRepoSearch] = useState("");
  const [repositories] = useState([
    {
      id: 1,
      name: "my-awesome-project",
      description: "一个很棒的React项目",
      language: "TypeScript",
      stars: 42,
      forks: 7,
      isPrivate: false,
      updatedAt: new Date("2024-01-15"),
      owner: "currentUser",
    },
    {
      id: 2,
      name: "backend-api",
      description: "Node.js后端API服务",
      language: "JavaScript",
      stars: 15,
      forks: 3,
      isPrivate: true,
      updatedAt: new Date("2024-01-10"),
      owner: "currentUser",
    },
    {
      id: 3,
      name: "data-analysis",
      description: "数据分析工具",
      language: "Python",
      stars: 23,
      forks: 5,
      isPrivate: false,
      updatedAt: new Date("2024-01-08"),
      owner: "currentUser",
    },
  ]);

  const navigate = useNavigate();

  useEffect(() => {
    // 定义异步函数来加载用户资料
    const loadProfile = async () => {
      try {
        // 获取当前登录用户
        const userItem = localStorage.getItem("user");
        console.log("当前用户item:", userItem);
        const userParse = userItem ? JSON.parse(userItem) : null;
        const myname = userParse ? userParse.username : null;
        console.log("当前用户str:", myname);
        // 检查是否是自己的个人中心
        const isOwn = myname === username;
        setIsOwnProfile(isOwn);

        // 如果是自己的个人中心，直接使用本地存储的数据
        if (isOwn && myname) {
          console.log("是自己的页面");
          setUser(userParse);
        } else {
          console.log("没有缓存，要从服务器拿数据");
          // 否则从服务器获取用户信息
          const response = await fetch(`/api/user/${username}`);
          const resdata = await response.json();
          if (resdata.code === 0) {
            setUser(resdata.username);
          } else {
            console.error("用户不存在");
          }
        }
      } catch (error) {
        console.error("加载用户信息失败:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (username) {
      loadProfile();
    }
  }, [username]);

  const filteredRepos = repositories.filter(
    (repo) =>
      !repoSearch ||
      repo.name.toLowerCase().includes(repoSearch.toLowerCase()) ||
      repo.description.toLowerCase().includes(repoSearch.toLowerCase())
  );

  const getLanguageColor = (language) => {
    const colors = {
      Vue: "#4fc08d",
      TypeScript: "#3178c6",
      JavaScript: "#f1e05a",
      Python: "#3572a5",
      Java: "#b07219",
      Go: "#00add8",
    };
    return colors[language] || "#6b7280";
  };

  const formatDate = (date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (days === 0) return "今天";
    if (days === 1) return "昨天";
    if (days < 7) return `${days} 天前`;
    if (days < 30) return `${Math.floor(days / 7)} 周前`;
    return `${Math.floor(days / 30)} 个月前`;
  };

  if (isLoading) {
    return (
      <Container>
        <LoadingText>加载中...</LoadingText>
      </Container>
    );
  }

  if (!user) {
    return (
      <Container>
        <ErrorText>用户不存在</ErrorText>
      </Container>
    );
  }

  return (
    <Container>
      <ProfileLayout>
        {/* 侧边栏 */}
        <ProfileSidebar>
          <ProfileCard>
            {user.avatarUrl && !avatarError ? (
              <ProfileAvatar src={user.avatarUrl} alt={user.username} onError={() => setAvatarError(true)} />
            ) : (
              <ProfileAvatarPlaceholder>
                {(user.name || user.username).charAt(0).toUpperCase()}
              </ProfileAvatarPlaceholder>
            )}

            <ProfileName>{user.name || user.username}</ProfileName>
            <ProfileUsername>@{user.username}</ProfileUsername>

            {user.bio && <ProfileBio>{user.bio}</ProfileBio>}

            {isOwnProfile && (
              <EditProfileButton>
                <FaEdit size={14} />
                编辑个人资料
              </EditProfileButton>
            )}

            <ProfileStats>
              <StatItem onClick={() => navigate(`/user/${username}/followers`)}>
                <FaUser size={16} />
                <span>
                  <strong>{user.followers || 0}</strong> 关注者
                </span>
              </StatItem>
              <StatItem onClick={() => navigate(`/user/${username}/following`)}>
                <span>
                  <strong>{user.following || 0}</strong> 正在关注
                </span>
              </StatItem>
            </ProfileStats>

            <ProfileDetails>
              {user.company && (
                <DetailItem>
                  <FaFolder size={16} />
                  <span>{user.company}</span>
                </DetailItem>
              )}
              {user.location && (
                <DetailItem>
                  <FaMapMarkerAlt size={16} />
                  <span>{user.location}</span>
                </DetailItem>
              )}
              {user.website && (
                <DetailItem>
                  <FaLink size={16} />
                  <DetailLink href={user.website} target="_blank" rel="noopener noreferrer">
                    {user.website}
                  </DetailLink>
                </DetailItem>
              )}
              {user.email && (
                <DetailItem>
                  <FaEnvelope size={16} />
                  <span>{user.email}</span>
                </DetailItem>
              )}
            </ProfileDetails>
          </ProfileCard>
        </ProfileSidebar>

        {/* 主内容区 */}
        <ProfileContent>
          <ProfileTabs>
            <Tab active={activeTab === "repositories"} onClick={() => setActiveTab("repositories")}>
              <FaFolder size={16} />
              仓库 ({user.publicRepos || repositories.length})
            </Tab>
            <Tab active={activeTab === "stars"} onClick={() => setActiveTab("stars")}>
              <FaStar size={16} />
              星标
            </Tab>
            <Tab active={activeTab === "following"} onClick={() => setActiveTab("following")}>
              <FaUser size={16} />
              关注中
            </Tab>
          </ProfileTabs>

          <TabContent>
            {activeTab === "repositories" && (
              <RepositoriesContent>
                <ReposHeader>
                  <ReposSearch>
                    <FaSearch size={16} />
                    <SearchInput
                      type="text"
                      placeholder="查找仓库..."
                      value={repoSearch}
                      onChange={(e) => setRepoSearch(e.target.value)}
                    />
                  </ReposSearch>
                  {isOwnProfile && (
                    <NewRepoButton onClick={() => navigate("/repo/new")}>
                      <FaPlus size={16} />
                      新建
                    </NewRepoButton>
                  )}
                </ReposHeader>

                <RepoList>
                  {filteredRepos.map((repo) => (
                    <RepoItem key={repo.id}>
                      <RepoHeader>
                        <RepoName onClick={() => navigate(`/${username}/${repo.name}`)}>{repo.name}</RepoName>
                        {repo.isPrivate && <PrivateBadge>Private</PrivateBadge>}
                      </RepoHeader>
                      <RepoDescription>{repo.description}</RepoDescription>
                      <RepoMeta>
                        <RepoLanguage>
                          <LanguageColor color={getLanguageColor(repo.language)} />
                          {repo.language}
                        </RepoLanguage>
                        <RepoStars>
                          <FaStar size={12} />
                          {repo.stars}
                        </RepoStars>
                        <RepoForks>
                          <FaFolder size={12} />
                          {repo.forks}
                        </RepoForks>
                        <RepoUpdated>更新于 {formatDate(repo.updatedAt)}</RepoUpdated>
                      </RepoMeta>
                    </RepoItem>
                  ))}
                </RepoList>
              </RepositoriesContent>
            )}

            {activeTab === "stars" && (
              <EmptyContent>
                <EmptyState>暂无星标仓库</EmptyState>
              </EmptyContent>
            )}

            {activeTab === "following" && (
              <EmptyContent>
                <EmptyState>暂无关注的用户</EmptyState>
              </EmptyContent>
            )}
          </TabContent>
        </ProfileContent>
      </ProfileLayout>
    </Container>
  );
}

// 样式组件
const Container = styled.div`
  width: 100%;
  margin: 0 auto;
  padding: 20px;
  box-sizing: border-box;

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

const ProfileLayout = styled.div`
  display: grid;
  grid-template-columns: 300px 1fr;
  gap: 32px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 20px;
  }
`;

const ProfileSidebar = styled.div``;

const ProfileCard = styled.div`
  background: white;
  border: 1px solid #e1e5e9;
  border-radius: 6px;
  padding: 16px;
`;

const ProfileAvatar = styled.img`
  width: 100%;
  height: auto;
  aspect-ratio: 1;
  border-radius: 50%;
  margin-bottom: 16px;
  object-fit: cover;
`;

const ProfileAvatarPlaceholder = styled.div`
  width: 100%;
  aspect-ratio: 1;
  border-radius: 50%;
  background-color: #4f46e5;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 3rem;
  margin-bottom: 16px;
`;

const ProfileName = styled.h1`
  font-size: 24px;
  font-weight: 600;
  color: #24292f;
  margin-bottom: 4px;
`;

const ProfileUsername = styled.p`
  font-size: 20px;
  color: #7d8590;
  margin-bottom: 16px;
`;

const ProfileBio = styled.p`
  color: #24292f;
  margin-bottom: 16px;
  line-height: 1.5;
`;

const EditProfileButton = styled.button`
  width: 100%;
  padding: 6px 16px;
  border: 1px solid #d1d9e0;
  border-radius: 6px;
  background: white;
  color: #24292f;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  margin-bottom: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;

  &:hover {
    background-color: #f6f8fa;
  }
`;

const ProfileStats = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  margin-bottom: 16px;
`;

const StatItem = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  color: #24292f;
  font-size: 14px;
  cursor: pointer;

  &:hover {
    color: #0969da;
  }
`;

const ProfileDetails = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const DetailItem = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  color: #7d8590;
  font-size: 14px;
`;

const DetailLink = styled.a`
  color: #0969da;
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }
`;

const ProfileContent = styled.div``;

const ProfileTabs = styled.div`
  display: flex;
  border-bottom: 1px solid #d1d9e0;
  margin-bottom: 24px;
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

  &:hover {
    color: #24292f;
  }
`;

const TabContent = styled.div``;

const RepositoriesContent = styled.div``;

const ReposHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  gap: 16px;
`;

const ReposSearch = styled.div`
  position: relative;
  flex: 1;
  max-width: 400px;

  svg {
    position: absolute;
    left: 12px;
    top: 50%;
    transform: translateY(-50%);
    color: #7d8590;
  }
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 6px 12px 6px 36px;
  border: 1px solid #d1d9e0;
  border-radius: 6px;
  font-size: 14px;

  &:focus {
    outline: none;
    border-color: #4f46e5;
  }
`;

const NewRepoButton = styled.button`
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 6px 12px;
  background-color: #238636;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;

  &:hover {
    background-color: #2ea043;
  }
`;

const RepoList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

const RepoItem = styled.div`
  padding-bottom: 24px;
  border-bottom: 1px solid #d1d9e0;

  &:last-child {
    border-bottom: none;
  }
`;

const RepoHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
`;

const RepoName = styled.button`
  font-size: 20px;
  font-weight: 600;
  color: #0969da;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;

  &:hover {
    text-decoration: underline;
  }
`;

const PrivateBadge = styled.span`
  padding: 2px 6px;
  border: 1px solid #d1d9e0;
  border-radius: 12px;
  font-size: 12px;
  color: #7d8590;
`;

const RepoDescription = styled.p`
  color: #7d8590;
  margin-bottom: 8px;
  line-height: 1.5;
`;

const RepoMeta = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  font-size: 12px;
  color: #7d8590;
`;

const RepoLanguage = styled.span`
  display: flex;
  align-items: center;
  gap: 4px;
`;

const LanguageColor = styled.span`
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background-color: ${(props) => props.color};
`;

const RepoStars = styled.span`
  display: flex;
  align-items: center;
  gap: 4px;
`;

const RepoForks = styled.span`
  display: flex;
  align-items: center;
  gap: 4px;
`;

const RepoUpdated = styled.span``;

const EmptyContent = styled.div``;

const EmptyState = styled.p`
  text-align: center;
  color: #7d8590;
  font-size: 16px;
  padding: 40px;
`;

export default Profile;
