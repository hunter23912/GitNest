import React, { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { FaSearch, FaStar, FaCodeBranch, FaFilter } from "react-icons/fa";
import { apiFetch } from "../utils/request";

async function searchRepos(keyword) {
  const res = await apiFetch(`/repo/search?keyword=${keyword}`, {
    method: "GET",
    headers: {
      Authorization: localStorage.getItem("token"),
    },
  });
  const data = await res.json();
  return data;
}

const Search = () => {
  const [searchParams] = useSearchParams();
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
  const navigate = useNavigate();

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

    // 调用后端接口
    const data = await searchRepos(searchQuery);
    console.log("搜索结果:", data);
    if (data && data.code === 0 && Array.isArray(data.data)) {
      setResults(data.data);
    } else {
      setResults([]);
    }
    setLoading(false);
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
    if (num == null || isNaN(num)) return "0";
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
        {/* 删除页面内搜索框，只保留过滤器 */}
        <FilterSection>
          <FilterToggle onClick={() => setShowFilters(!showFilters)}>
            <FaFilter size={14} />
            过滤器
          </FilterToggle>

          {showFilters && (
            <FiltersContainer>
              <FilterGroup>
                <FilterLabel>编程语言</FilterLabel>
                <FilterSelect value={filters.language} onChange={(e) => handleFilterChange({ language: e.target.value })}>
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
                        {repo.owner}
                        {repo.reponame}
                      </RepoName>
                      {/* 点击仓库名跳转到仓库详情页 */}
                      <RepoName as="span" onClick={() => navigate(`/${repo.owner}/${repo.reponame}?repoid=${repo.id}`)} role="button" aria-label={`打开 ${repo.owner}/${repo.reponame}`}>
                        {repo.owner}/{repo.reponame}
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
                      <RepoUpdated>更新于 {repo.updatedAt ? new Date(repo.updatedAt).toLocaleDateString() : "未知"}</RepoUpdated>
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
