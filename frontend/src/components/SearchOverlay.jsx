import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { FaSearch, FaStar, FaCodeBranch } from "react-icons/fa";

function SearchOverlay({ onClose }) {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  // 模拟搜索建议数据
  const mockRepositories = [
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
  ];

  useEffect(() => {
    if (query.trim()) {
      setIsLoading(true);
      // 模拟搜索延迟
      const timer = setTimeout(() => {
        const filtered = mockRepositories.filter(
          (repo) =>
            repo.name.toLowerCase().includes(query.toLowerCase()) ||
            repo.description.toLowerCase().includes(query.toLowerCase())
        );
        setSuggestions(filtered.slice(0, 5));
        setIsLoading(false);
      }, 300);

      return () => clearTimeout(timer);
    } else {
      setSuggestions([]);
    }
  }, [query]);

  const handleSearch = (searchQuery) => {
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      onClose();
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSearch(query);
    } else if (e.key === "Escape") {
      onClose();
    }
  };

  return (
    <Overlay onClick={onClose}>
      <SearchContainer onClick={(e) => e.stopPropagation()}>
        <SearchHeader>
          <SearchInputContainer>
            <FaSearch size={20} />
            <SearchInput
              type="text"
              placeholder="搜索仓库..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyPress}
              autoFocus
            />
            <CloseButton onClick={onClose}>×</CloseButton>
          </SearchInputContainer>
        </SearchHeader>

        {query.trim() && (
          <SearchResults>
            {isLoading ? (
              <LoadingMessage>搜索中...</LoadingMessage>
            ) : suggestions.length > 0 ? (
              <>
                <ResultsHeader>仓库</ResultsHeader>
                {suggestions.map((repo) => (
                  <SearchResult
                    key={repo.id}
                    onClick={() => {
                      navigate(`/${repo.owner}/${repo.name}`);
                      onClose();
                    }}
                  >
                    <RepoInfo>
                      <RepoName>
                        {repo.owner}/{repo.name}
                      </RepoName>
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
                      </RepoMeta>
                    </RepoInfo>
                  </SearchResult>
                ))}
                <ViewAllResults onClick={() => handleSearch(query)}>查看所有结果 →</ViewAllResults>
              </>
            ) : (
              <NoResults>没有找到相关仓库</NoResults>
            )}
          </SearchResults>
        )}

        {!query.trim() && (
          <SearchHints>
            <HintTitle>搜索建议</HintTitle>
            <HintList>
              <HintItem onClick={() => setQuery("react")}>
                <FaSearch size={14} />
                react
              </HintItem>
              <HintItem onClick={() => setQuery("vue")}>
                <FaSearch size={14} />
                vue
              </HintItem>
              <HintItem onClick={() => setQuery("python")}>
                <FaSearch size={14} />
                python
              </HintItem>
            </HintList>
          </SearchHints>
        )}
      </SearchContainer>
    </Overlay>
  );
}

// 辅助函数
function getLanguageColor(language) {
  const colors = {
    Vue: "#4fc08d",
    TypeScript: "#3178c6",
    JavaScript: "#f1e05a",
    Python: "#3572a5",
    Java: "#b07219",
    Go: "#00add8",
  };
  return colors[language] || "#6b7280";
}

function formatNumber(num) {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + "M";
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + "k";
  }
  return num.toString();
}

// 样式组件
const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 1000;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  padding-top: 100px;
`;

const SearchContainer = styled.div`
  background: white;
  border-radius: 12px;
  width: 100%;
  max-width: 600px;
  max-height: 500px;
  overflow: hidden;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
`;

const SearchHeader = styled.div`
  padding: 16px;
  border-bottom: 1px solid #e1e5e9;
`;

const SearchInputContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  border: 2px solid #4f46e5;
  border-radius: 8px;
  background: white;
`;

const SearchInput = styled.input`
  flex: 1;
  border: none;
  outline: none;
  font-size: 16px;
  color: #24292f;

  &::placeholder {
    color: #7d8590;
  }
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 24px;
  color: #7d8590;
  cursor: pointer;
  padding: 0;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    color: #24292f;
  }
`;

const SearchResults = styled.div`
  max-height: 400px;
  overflow-y: auto;
`;

const LoadingMessage = styled.div`
  padding: 20px;
  text-align: center;
  color: #7d8590;
`;

const NoResults = styled.div`
  padding: 20px;
  text-align: center;
  color: #7d8590;
`;

const ResultsHeader = styled.div`
  padding: 12px 16px;
  font-weight: 600;
  color: #24292f;
  border-bottom: 1px solid #e1e5e9;
  background-color: #f6f8fa;
`;

const SearchResult = styled.div`
  padding: 16px;
  cursor: pointer;
  border-bottom: 1px solid #e1e5e9;

  &:hover {
    background-color: #f6f8fa;
  }

  &:last-child {
    border-bottom: none;
  }
`;

const RepoInfo = styled.div``;

const RepoName = styled.div`
  font-weight: 600;
  color: #0969da;
  margin-bottom: 4px;
`;

const RepoDescription = styled.div`
  color: #7d8590;
  font-size: 14px;
  margin-bottom: 8px;
  line-height: 1.4;
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

const ViewAllResults = styled.button`
  width: 100%;
  padding: 12px 16px;
  background: #f6f8fa;
  border: none;
  color: #0969da;
  font-weight: 500;
  cursor: pointer;
  text-align: center;

  &:hover {
    background-color: #e1e5e9;
  }
`;

const SearchHints = styled.div`
  padding: 16px;
`;

const HintTitle = styled.div`
  font-weight: 600;
  color: #24292f;
  margin-bottom: 12px;
`;

const HintList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const HintItem = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  background: none;
  border: none;
  border-radius: 6px;
  color: #7d8590;
  cursor: pointer;
  text-align: left;

  &:hover {
    background-color: #f6f8fa;
    color: #24292f;
  }
`;

export default SearchOverlay;
