import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { FaPlus, FaSearch, FaStar, FaCodeBranch, FaBook, FaLock } from "react-icons/fa";
import { apiFetch } from "../utils/request"; // 新增

// 纯 JS/JSX 版本
const Repos = () => {
  const [user, setUser] = useState(null);
  const [repositories, setRepositories] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [sortBy, setSortBy] = useState("updated");
  const [isLoading, setIsLoading] = useState(true); // 新增
  const navigate = useNavigate();

  useEffect(() => {
    const userStr = localStorage.getItem("user");
    if (!userStr) {
      navigate("/login");
      return;
    }
    let userData;
    try {
      userData = JSON.parse(userStr);
    } catch {
      userData = { username: userStr };
    }
    setUser(userData);

    const loadRepos = async () => {
      setIsLoading(true);
      try {
        const userid = userData.userid || userData.id || "";
        const token = localStorage.getItem("token") || sessionStorage.getItem("token") || "";
        const query = userid ? `?userid=${userid}` : "";
        const res = await apiFetch(`/repo${query}`, {
          method: "GET",
          headers: {
            Authorization: localStorage.getItem("token"),
          },
        });
        const data = await res.json();
        if (data && data.code === 0) {
          const repoList = (data.data || []).map((r) => ({
            id: r.repoid,
            name: r.reponame,
            description: r.description,
            language: r.language,
            stars: r.stars || 0,
            forks: r.forks || 0,
            isPrivate: !!r.isprivate,
            updatedAt: r.updateTime ? new Date(r.updateTime) : r.createTime ? new Date(r.createTime) : new Date(),
            owner: r.ownername || (r.ownerid === userData.userid ? userData.username : String(r.ownerid)),
          }));
          setRepositories(repoList);
        } else {
          setRepositories([]);
        }
      } catch (err) {
        console.error("加载仓库失败", err);
        setRepositories([]);
      } finally {
        setIsLoading(false);
      }
    };

    loadRepos();
  }, [navigate]);

  const filteredRepositories = repositories
    .filter((repo) => {
      const matchesSearch = !searchQuery || repo.name.toLowerCase().includes(searchQuery.toLowerCase()) || (repo.description && repo.description.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesType = filterType === "all" || (filterType === "public" && !repo.isPrivate) || (filterType === "private" && repo.isPrivate);

      return matchesSearch && matchesType;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "name":
          return a.name.localeCompare(b.name);
        case "stars":
          return b.stars - a.stars;
        case "updated":
        default:
          return b.updatedAt.getTime() - a.updatedAt.getTime();
      }
    });

  const getLanguageColor = (language) => {
    const colors = {
      TypeScript: "#3178c6",
      JavaScript: "#f1e05a",
      Python: "#3572a5",
      Java: "#b07219",
      Go: "#00add8",
      HTML: "#e34c26",
      CSS: "#1572b6",
    };
    return colors[language] || "#6b7280";
  };

  const formatDate = (date) => {
    if (!date) return "";
    const now = new Date();
    const d = date instanceof Date ? date : new Date(date);
    const diff = now.getTime() - d.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (days === 0) return "今天";
    if (days === 1) return "昨天";
    if (days < 7) return `${days} 天前`;
    if (days < 30) return `${Math.floor(days / 7)} 周前`;
    return `${Math.floor(days / 30)} 个月前`;
  };

  if (!user) {
    return null; // 重定向到登录页面
  }

  return (
    <Container>
      <Header>
        <HeaderLeft>
          <Title>我的仓库</Title>
          <RepoCount>{filteredRepositories.length} 个仓库</RepoCount>
        </HeaderLeft>
        <HeaderRight>
          <NewRepoButton onClick={() => navigate("/repo/new")}>
            <FaPlus size={14} />
            新建仓库
          </NewRepoButton>
        </HeaderRight>
      </Header>

      <Controls>
        <SearchContainer>
          <FaSearch size={14} />
          <SearchInput type="text" placeholder="搜索仓库..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
        </SearchContainer>

        <FiltersContainer>
          <FilterSelect value={filterType} onChange={(e) => setFilterType(e.target.value)}>
            <option value="all">所有仓库</option>
            <option value="public">公开仓库</option>
            <option value="private">私有仓库</option>
          </FilterSelect>

          <SortSelect value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
            <option value="updated">最近更新</option>
            <option value="name">名称</option>
            <option value="stars">星标数</option>
          </SortSelect>
        </FiltersContainer>
      </Controls>

      <ReposList>
        {isLoading ? (
          <EmptyState>
            <EmptyTitle>加载中...</EmptyTitle>
          </EmptyState>
        ) : filteredRepositories.length > 0 ? (
          filteredRepositories.map((repo) => (
            <RepoItem key={repo.id}>
              <RepoHeader>
                <RepoNameContainer>
                  <RepoName onClick={() => navigate(`/${user.username}/${repo.name}?repoid=${repo.id}`)}>
                    <FaBook size={16} />
                    {repo.name}
                  </RepoName>
                  {repo.isPrivate && (
                    <PrivateBadge>
                      <FaLock size={12} />
                      Private
                    </PrivateBadge>
                  )}
                </RepoNameContainer>
              </RepoHeader>

              <RepoDescription>{repo.description}</RepoDescription>

              {repo.topics && repo.topics.length > 0 && (
                <TopicsContainer>
                  {repo.topics.map((topic) => (
                    <Topic key={topic}>{topic}</Topic>
                  ))}
                </TopicsContainer>
              )}

              <RepoMeta>
                <MetaItem>
                  <LanguageColor color={getLanguageColor(repo.language)} />
                  {repo.language}
                </MetaItem>
                <MetaItem>
                  <FaStar size={12} />
                  {repo.stars}
                </MetaItem>
                <MetaItem>
                  <FaCodeBranch size={12} />
                  {repo.forks}
                </MetaItem>
                <MetaItem>更新于 {formatDate(repo.updatedAt)}</MetaItem>
              </RepoMeta>
            </RepoItem>
          ))
        ) : (
          <EmptyState>
            {searchQuery ? (
              <>
                <EmptyIcon>🔍</EmptyIcon>
                <EmptyTitle>没有找到匹配的仓库</EmptyTitle>
                <EmptyDescription>尝试调整搜索关键词或过滤条件</EmptyDescription>
              </>
            ) : (
              <>
                <EmptyIcon>📦</EmptyIcon>
                <EmptyTitle>还没有仓库</EmptyTitle>
                <EmptyDescription>创建您的第一个仓库来开始使用 GitNest</EmptyDescription>
                <CreateFirstRepoButton onClick={() => navigate("/repo/new")}>
                  <FaPlus size={14} />
                  创建仓库
                </CreateFirstRepoButton>
              </>
            )}
          </EmptyState>
        )}
      </ReposList>
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

// ...existing styled components remain unchanged...
const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 16px;
    align-items: flex-start;
  }
`;

const HeaderLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
`;

const Title = styled.h1`
  font-size: 1.5rem;
  font-weight: 600;
  color: #24292f;
  margin: 0;
`;

const RepoCount = styled.span`
  color: #7d8590;
  font-size: 14px;
`;

const HeaderRight = styled.div``;

const NewRepoButton = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  background-color: #238636;
  color: white;
  border: none;
  border-radius: 6px;
  padding: 8px 16px;
  font-weight: 500;
  cursor: pointer;

  &:hover {
    background-color: #2ea043;
  }
`;

const Controls = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  gap: 16px;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: stretch;
  }
`;

const SearchContainer = styled.div`
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
  padding: 8px 12px 8px 36px;
  border: 1px solid #d1d9e0;
  border-radius: 6px;
  font-size: 14px;

  &:focus {
    outline: none;
    border-color: #4f46e5;
  }
`;

const FiltersContainer = styled.div`
  display: flex;
  gap: 8px;
`;

const FilterSelect = styled.select`
  padding: 8px 12px;
  border: 1px solid #d1d9e0;
  border-radius: 6px;
  background: white;
  font-size: 14px;
  cursor: pointer;
`;

const SortSelect = styled.select`
  padding: 8px 12px;
  border: 1px solid #d1d9e0;
  border-radius: 6px;
  background: white;
  font-size: 14px;
  cursor: pointer;
`;

const ReposList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const RepoItem = styled.div`
  border: 1px solid #e1e5e9;
  border-radius: 8px;
  padding: 20px;
  background: white;

  &:hover {
    border-color: #d1d9e0;
  }
`;

const RepoHeader = styled.div`
  margin-bottom: 8px;
`;

const RepoNameContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const RepoName = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  background: none;
  border: none;
  color: #0969da;
  font-size: 18px;
  font-weight: 600;
  cursor: pointer;
  padding: 0;

  &:hover {
    text-decoration: underline;
  }
`;

const PrivateBadge = styled.span`
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 2px 8px;
  border: 1px solid #d1d9e0;
  border-radius: 12px;
  font-size: 12px;
  color: #7d8590;
`;

const RepoDescription = styled.p`
  color: #7d8590;
  margin: 0 0 12px 0;
  line-height: 1.5;
`;

const TopicsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-bottom: 12px;
`;

const Topic = styled.span`
  background-color: #dbeafe;
  color: #1e40af;
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
`;

const RepoMeta = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  font-size: 12px;
  color: #7d8590;

  @media (max-width: 768px) {
    flex-wrap: wrap;
    gap: 12px;
  }
`;

const MetaItem = styled.span`
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

const EmptyState = styled.div`
  text-align: center;
  padding: 80px 20px;
`;

const EmptyIcon = styled.div`
  font-size: 4rem;
  margin-bottom: 16px;
`;

const EmptyTitle = styled.h3`
  color: #24292f;
  margin-bottom: 8px;
  font-size: 1.25rem;
`;

const EmptyDescription = styled.p`
  color: #7d8590;
  margin-bottom: 24px;
`;

const CreateFirstRepoButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background-color: #238636;
  color: white;
  border: none;
  border-radius: 6px;
  padding: 12px 20px;
  font-weight: 500;
  cursor: pointer;

  &:hover {
    background-color: #2ea043;
  }
`;

export default Repos;
