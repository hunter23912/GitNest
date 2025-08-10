import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import styled from "styled-components";
import { FaSearch, FaStar, FaCodeBranch, FaFilter } from "react-icons/fa";
// 纯 JS/JSX 版本
const Search = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [query, setQuery] = useState(searchParams.get("q") || "");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    language: "",
    sort: "updated",
    order: "desc",
    type: "all",
  });
  const [showFilters, setShowFilters] = useState(false);

  // 模拟搜索结果数据
  const mockResults = [
    {
      id: 1,
      name: "react",
      description: "A declarative, efficient, and flexible JavaScript library for building user interfaces.",
      language: "JavaScript",
      stars: 201000,
      forks: 41000,
      isPrivate: false,
      updatedAt: new Date("2024-01-20"),
      owner: "facebook",
    },
    {
      id: 2,
      name: "vue",
      description: "Vue.js is a progressive, incrementally-adoptable JavaScript framework.",
      language: "TypeScript",
      stars: 204000,
      forks: 33000,
      isPrivate: false,
      updatedAt: new Date("2024-01-18"),
      owner: "vuejs",
    },
    {
      id: 3,
      name: "awesome-python",
      description: "A curated list of awesome Python frameworks, libraries, software and resources.",
      language: "Python",
      stars: 158000,
      forks: 22000,
      isPrivate: false,
      updatedAt: new Date("2024-01-15"),
      owner: "vinta",
    },
    {
      id: 4,
      name: "tensorflow",
      description: "An open source machine learning library for JavaScript.",
      language: "TypeScript",
      stars: 175000,
      forks: 88000,
      isPrivate: false,
      updatedAt: new Date("2024-01-12"),
      owner: "tensorflow",
    },
    {
      id: 5,
      name: "express",
      description: "Fast, unopinionated, minimalist web framework for Node.js.",
      language: "JavaScript",
      stars: 63000,
      forks: 13000,
      isPrivate: false,
      updatedAt: new Date("2024-01-10"),
      owner: "expressjs",
    },
  ];

  useEffect(() => {
    const searchQuery = searchParams.get("q");
    if (searchQuery) {
      setQuery(searchQuery);
      performSearch(searchQuery);
    }
  }, [searchParams]);

  const performSearch = async (searchQuery) => {
    if (!searchQuery.trim()) return;

    setLoading(true);

    // 模拟 API 延迟
    await new Promise((resolve) => setTimeout(resolve, 500));

    // 过滤结果
    let filtered = mockResults.filter(
      (repo) =>
        repo.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        repo.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        repo.owner.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // 应用过滤器
    if (filters.language) {
      filtered = filtered.filter((repo) => repo.language === filters.language);
    }

    // 排序
    filtered.sort((a, b) => {
      let comparison = 0;
      switch (filters.sort) {
        case "stars":
          comparison = b.stars - a.stars;
          break;
        case "forks":
          comparison = b.forks - a.forks;
          break;
        case "updated":
          comparison = b.updatedAt.getTime() - a.updatedAt.getTime();
          break;
        case "created":
          comparison = b.id - a.id; // 简化：用 id 代替创建时间
          break;
        default:
          break;
      }
      return filters.order === "asc" ? -comparison : comparison;
    });

    setResults(filtered);
    setLoading(false);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) {
      setSearchParams({ q: query.trim() });
    }
  };

  const handleFilterChange = (newFilters) => {
    const updatedFilters = { ...filters, ...newFilters };
    setFilters(updatedFilters);

    if (query.trim()) {
      performSearch(query);
    }
  };

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

  const formatNumber = (num) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + "M";
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + "k";
    }
    return num.toString();
  };

  return (
    <Container>
      <SearchHeader>
        <SearchForm onSubmit={handleSearch}>
          <SearchInputContainer>
            <FaSearch size={18} />
            <SearchInput
              type="text"
              placeholder="搜索仓库..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </SearchInputContainer>
          <SearchButton type="submit">搜索</SearchButton>
        </SearchForm>

        <FilterSection>
          <FilterToggle onClick={() => setShowFilters(!showFilters)}>
            <FaFilter size={14} />
            过滤器
          </FilterToggle>

          {showFilters && (
            <FiltersContainer>
              <FilterGroup>
                <FilterLabel>编程语言</FilterLabel>
                <FilterSelect
                  value={filters.language}
                  onChange={(e) => handleFilterChange({ language: e.target.value })}
                >
                  <option value="">所有语言</option>
                  <option value="JavaScript">JavaScript</option>
                  <option value="TypeScript">TypeScript</option>
                  <option value="Python">Python</option>
                  <option value="Java">Java</option>
                  <option value="Go">Go</option>
                </FilterSelect>
              </FilterGroup>

              <FilterGroup>
                <FilterLabel>排序方式</FilterLabel>
                <FilterSelect value={filters.sort} onChange={(e) => handleFilterChange({ sort: e.target.value })}>
                  <option value="updated">最近更新</option>
                  <option value="stars">星标数</option>
                  <option value="forks">分支数</option>
                  <option value="created">创建时间</option>
                </FilterSelect>
              </FilterGroup>

              <FilterGroup>
                <FilterLabel>排序顺序</FilterLabel>
                <FilterSelect value={filters.order} onChange={(e) => handleFilterChange({ order: e.target.value })}>
                  <option value="desc">降序</option>
                  <option value="asc">升序</option>
                </FilterSelect>
              </FilterGroup>
            </FiltersContainer>
          )}
        </FilterSection>
      </SearchHeader>

      <SearchContent>
        {loading ? (
          <LoadingMessage>搜索中...</LoadingMessage>
        ) : query ? (
          <>
            <ResultsInfo>
              找到 <strong>{results.length}</strong> 个仓库
              {query && ` 包含 "${query}"`}
            </ResultsInfo>

            {results.length > 0 ? (
              <ResultsList>
                {results.map((repo) => (
                  <ResultItem key={repo.id}>
                    <RepoHeader>
                      <RepoName>
                        {repo.owner}/{repo.name}
                      </RepoName>
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
                        {formatNumber(repo.stars)}
                      </RepoStars>
                      <RepoForks>
                        <FaCodeBranch size={12} />
                        {formatNumber(repo.forks)}
                      </RepoForks>
                      <RepoUpdated>更新于 {repo.updatedAt.toLocaleDateString()}</RepoUpdated>
                    </RepoMeta>
                  </ResultItem>
                ))}
              </ResultsList>
            ) : (
              <EmptyState>
                <EmptyIcon>🔍</EmptyIcon>
                <EmptyTitle>没有找到匹配的仓库</EmptyTitle>
                <EmptyDescription>试试调整搜索关键词或过滤条件</EmptyDescription>
              </EmptyState>
            )}
          </>
        ) : (
          <EmptyState>
            <EmptyIcon>🚀</EmptyIcon>
            <EmptyTitle>搜索代码仓库</EmptyTitle>
            <EmptyDescription>输入关键词来搜索您感兴趣的项目</EmptyDescription>
          </EmptyState>
        )}
      </SearchContent>
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

const SearchHeader = styled.div`
  margin-bottom: 32px;
`;

const SearchForm = styled.form`
  display: flex;
  gap: 12px;
  margin-bottom: 16px;
`;

const SearchInputContainer = styled.div`
  flex: 1;
  position: relative;
  display: flex;
  align-items: center;

  svg {
    position: absolute;
    left: 16px;
    color: #7d8590;
  }
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 12px 16px 12px 48px;
  border: 1px solid #d1d9e0;
  border-radius: 8px;
  font-size: 16px;

  &:focus {
    outline: none;
    border-color: #4f46e5;
    box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.1);
  }
`;

const SearchButton = styled.button`
  background-color: #4f46e5;
  color: white;
  border: none;
  border-radius: 8px;
  padding: 12px 24px;
  font-weight: 600;
  cursor: pointer;
  outline: none !important;
  box-shadow: none !important;
  transition: background-color 0.2s;

  &:hover {
    background-color: #4338ca;
  }

  &:focus,
  &:focus-visible {
    outline: none !important;
    box-shadow: none !important;
    background-color: #4338ca;
  }

  &:active {
    outline: none !important;
    box-shadow: none !important;
  }
`;

const FilterSection = styled.div``;

const FilterToggle = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  background: white;
  border: 1px solid #d1d9e0;
  border-radius: 6px;
  padding: 8px 12px;
  color: #24292f;
  cursor: pointer;
  font-size: 14px;
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

const FiltersContainer = styled.div`
  display: flex;
  gap: 16px;
  margin-top: 12px;
  padding: 16px;
  background-color: #f6f8fa;
  border-radius: 8px;

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 12px;
  }
`;

const FilterGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const FilterLabel = styled.label`
  font-size: 12px;
  font-weight: 600;
  color: #24292f;
`;

const FilterSelect = styled.select`
  padding: 6px 8px;
  border: 1px solid #d1d9e0;
  border-radius: 4px;
  background: white;
  font-size: 14px;
  min-width: 120px;
  outline: none !important;
  box-shadow: none !important;

  &:focus,
  &:focus-visible {
    outline: none !important;
    border-color: #4f46e5;
    box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.1) !important;
  }
`;

const SearchContent = styled.div``;

const LoadingMessage = styled.div`
  text-align: center;
  padding: 60px 0;
  color: #7d8590;
  font-size: 1.1rem;
`;

const ResultsInfo = styled.div`
  margin-bottom: 24px;
  color: #24292f;
  font-size: 14px;
`;

const ResultsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

const ResultItem = styled.div`
  padding: 20px;
  border: 1px solid #e1e5e9;
  border-radius: 8px;
  background: white;

  &:hover {
    border-color: #d1d9e0;
  }
`;

const RepoHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
`;

const RepoName = styled.h3`
  color: #0969da;
  margin: 0;
  font-size: 20px;
  font-weight: 600;
  cursor: pointer;

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
  margin: 0 0 12px 0;
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
  font-size: 1.5rem;
`;

const EmptyDescription = styled.p`
  color: #7d8590;
  margin: 0;
`;

export default Search;
