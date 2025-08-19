import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { FaGitAlt, FaPlus, FaChevronDown, FaUser, FaFolder, FaCog, FaSignOutAlt } from "react-icons/fa";

function Navbar() {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = () => {
      const userStr = localStorage.getItem("user");
      if (!userStr) {
        setIsAuthenticated(false);
        setUser(null);
        return;
      }

      // 直接当作用户名字符串处理
      setIsAuthenticated(true);
      setUser({ username: userStr });
      console.log("[Navbar] user found ->", userStr);
    };

    checkAuth();
    window.addEventListener("user-change", checkAuth); // 监听同tab
    window.addEventListener("storage", checkAuth); // 监听跨tab
    return () => {
      window.removeEventListener("user-change", checkAuth);
      window.removeEventListener("storage", checkAuth);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    setIsAuthenticated(false);
    setUser(null);
    setShowUserMenu(false);
    navigate("/");
  };

  // 搜索栏组件，图标在输入框内部左侧，动画与输入框同步
  function SearchBar({ onSearch }) {
    const [focused, setFocused] = useState(false);
    const navigate = useNavigate();
    return (
      <SearchBarContainer $focused={focused}>
        <ColorSearchIcon $focused={focused} />
        <SearchInputInner
          name="q"
          type="text"
          placeholder="搜索仓库/用户/项目..."
          autoComplete="off"
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              const q = e.target.value.trim();
              if (q) {
                if (onSearch) onSearch(q);
                else navigate(`/search?q=${encodeURIComponent(q)}`);
              }
            }
          }}
        />
      </SearchBarContainer>
    );
  }

  return (
    <NavContainer>
      <NavContent>
        <NavLeft>
          <LogoLink to="/">
            <FaGitAlt size={24} />
            <LogoText>GitNest</LogoText>
          </LogoLink>
          <NavLinks>
            {/* 移除“探索”链接，仅保留“AI 助手”“关于我们” */}
            <NavLink to="/ai-assistant">AI 助手</NavLink>
            <NavLink to="/about">关于我们</NavLink>
          </NavLinks>
        </NavLeft>

        {/* 搜索框居中 */}
        <NavCenter>
          <SearchBar />
        </NavCenter>

        <NavRight>
          {isAuthenticated && user ? (
            <>
              <CreateButton onClick={() => navigate("/repo/new")} title="创建新仓库">
                <FaPlus size={14} />
                创建
              </CreateButton>

              <UserMenuContainer>
                <UserMenuButton onClick={() => setShowUserMenu(!showUserMenu)}>
                  {user.avatarUrl ? <UserAvatar src={user.avatarUrl} alt={user.username} /> : <UserAvatarPlaceholder>{(user.name || user.username).charAt(0).toUpperCase()}</UserAvatarPlaceholder>}
                  <FaChevronDown size={12} />
                </UserMenuButton>

                {showUserMenu && (
                  <UserDropdown>
                    <UserInfo>
                      <UserName>{user.name || user.username}</UserName>
                      <UserUsername>@{user.username}</UserUsername>
                    </UserInfo>
                    <DropdownDivider />
                    <DropdownItem
                      onClick={() => {
                        navigate(`/user/${user.username}`);
                        setShowUserMenu(false);
                      }}
                    >
                      <FaUser size={16} />
                      个人资料
                    </DropdownItem>
                    <DropdownItem
                      onClick={() => {
                        navigate("/repos");
                        setShowUserMenu(false);
                      }}
                    >
                      <FaFolder size={16} />
                      我的仓库
                    </DropdownItem>
                    <DropdownItem
                      onClick={() => {
                        navigate("/settings");
                        setShowUserMenu(false);
                      }}
                    >
                      <FaCog size={16} />
                      设置
                    </DropdownItem>
                    <DropdownDivider />
                    <DropdownItem onClick={handleLogout}>
                      <FaSignOutAlt size={16} />
                      退出登录
                    </DropdownItem>
                  </UserDropdown>
                )}
              </UserMenuContainer>
            </>
          ) : (
            <AuthButtons>
              <LoginButton to="/login">登录</LoginButton>
              <SignupButton to="/register">注册</SignupButton>
            </AuthButtons>
          )}
        </NavRight>
      </NavContent>
    </NavContainer>
  );
}

const NavContainer = styled.nav`
  background-color: #ffffff;
  border-bottom: 1px solid #e5e7eb;
  position: sticky;
  top: 0;
  z-index: 100;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
`;

const NavContent = styled.div`
  width: 100%;
  padding: 0 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 64px;
`;

const NavLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 32px;
`;

const LogoLink = styled(Link)`
  display: flex;
  align-items: center;
  gap: 8px;
  color: #4f46e5;
  text-decoration: none;
  font-weight: 700;
  font-size: 18px;
  outline: none;

  &:hover {
    color: #4338ca;
  }

  &:focus {
    color: #4338ca;
    box-shadow: 0 0 0 2px rgba(79, 70, 229, 0.2);
    border-radius: 4px;
  }
`;

const LogoText = styled.span`
  font-size: 20px;
`;

const NavLinks = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
`;

const NavLink = styled(Link)`
  color: #374151;
  text-decoration: none;
  font-weight: 500;
  font-size: 14px;
  padding: 8px 12px;
  border-radius: 6px;
  transition: all 0.2s;
  outline: none;

  &:hover {
    background-color: #f9fafb;
    color: #4f46e5;
  }

  &:focus {
    background-color: #f9fafb;
    color: #4f46e5;
    box-shadow: 0 0 0 2px rgba(79, 70, 229, 0.2);
  }
`;

const NavCenter = styled.div`
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  min-width: 180px;
  max-width: 520px;
  margin: 0 24px;
`;

const SearchBarContainer = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  max-width: 420px;
  min-width: 160px;
  background: ${({ $focused }) => ($focused ? "#fff" : "#f3f4f6")};
  border-radius: ${({ $focused }) => ($focused ? "12px" : "999px")};
  padding: 0 18px 0 12px;
  box-sizing: border-box;
  border: 2px solid transparent;
  transition: background 0.3s ease-out, border-radius 0.4s cubic-bezier(0.34, 1.56, 0.64, 1), transform 0.35s cubic-bezier(0.68, -0.6, 0.32, 1.6), box-shadow 0.4s cubic-bezier(0.34, 1.56, 0.64, 1),
    border 0.2s ease-out;
  border-color: ${({ $focused }) => ($focused ? "#6366f1" : "transparent")};
  transform: ${({ $focused }) => ($focused ? "scale(1.02)" : "scale(1)")};
  box-shadow: ${({ $focused }) => ($focused ? "0 6px 20px rgba(99, 102, 241, 0.18)" : "0 2px 6px rgba(0, 0, 0, 0.05)")};

  &:hover {
    background: ${({ $focused }) => ($focused ? "#fff" : "#e0e7ff")};
    box-shadow: ${({ $focused }) => ($focused ? "0 6px 20px rgba(99, 102, 241, 0.18)" : "0 4px 10px rgba(0, 0, 0, 0.1)")};
    transition: background 0.25s ease-out, box-shadow 0.3s ease-out;
  }

  @media (hover: hover) {
    &:not(:focus-within):hover {
      transform: scale(1.01);
      transition: transform 0.2s ease-out;
    }
  }
`;

const SearchInputInner = styled.input`
  flex: 1;
  border: none;
  background: transparent;
  font-size: 15px;
  color: #22223b;
  font-weight: 500;
  letter-spacing: 0.01em;
  padding: 10px 0 10px 8px;
  outline: none;
  box-shadow: none;
  min-width: 0;

  &::placeholder {
    color: #a1a1aa;
    opacity: 1;
    font-weight: 400;
  }
`;

// 彩色渐变搜索图标，尺寸与输入框同步
const ColorSearchIcon = styled(({ className, $focused }) => (
  <svg className={className} width="20" height="20" viewBox="0 0 22 22" fill="none">
    <defs>
      <linearGradient id="search-gradient-vivid" x1="0" y1="0" x2="22" y2="22" gradientUnits="userSpaceOnUse">
        <stop stopColor={$focused ? "#a21caf" : "#7c3aed"} />
        <stop offset="0.33" stopColor={$focused ? "#2563eb" : "#06b6d4"} />
        <stop offset="0.66" stopColor={$focused ? "#10b981" : "#22d3ee"} />
        <stop offset="1" stopColor={$focused ? "#f59e42" : "#fbbf24"} />
      </linearGradient>
    </defs>
    <circle cx="10" cy="10" r="8" stroke="url(#search-gradient-vivid)" strokeWidth="2.2" fill="none" />
    <line x1="16.5" y1="16.5" x2="21" y2="21" stroke="url(#search-gradient-vivid)" strokeWidth="2.2" strokeLinecap="round" />
  </svg>
))`
  flex-shrink: 0;
  margin-left: 2px;
  margin-right: 2px;
  transition: all 0.3s ease;
  filter: ${({ $focused }) => ($focused ? "drop-shadow(0 0 8px rgba(162, 28, 175, 0.6))" : "none")};
  transform: ${({ $focused }) => ($focused ? "scale(1.1)" : "scale(1)")};
`;

const NavRight = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
`;

const UserMenuContainer = styled.div`
  position: relative;
`;

const UserMenuButton = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  background: none;
  border: none;
  cursor: pointer;
  padding: 4px 8px;
  border-radius: 6px;
  transition: all 0.2s;
  outline: none !important;
  box-shadow: none !important;

  &:hover {
    background-color: #f5f3ff;
  }

  &:focus,
  &:focus-visible {
    outline: none !important;
    box-shadow: none !important;
    background-color: #f5f3ff;
  }

  &:active {
    outline: none !important;
    box-shadow: none !important;
  }
`;

const UserAvatar = styled.img`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  object-fit: cover;
`;

const UserAvatarPlaceholder = styled.div`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background-color: #4f46e5;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 14px;
`;

const UserDropdown = styled.div`
  position: absolute;
  top: 100%;
  right: 0;
  margin-top: 8px;
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  box-shadow: 0 10px 15px rgba(0, 0, 0, 0.1);
  min-width: 200px;
  z-index: 1000;
  padding: 8px 0;
`;

const UserInfo = styled.div`
  padding: 12px 16px;
  border-bottom: 1px solid #e5e7eb;
`;

const UserName = styled.div`
  font-weight: 600;
  color: #111827;
  font-size: 14px;
  margin-bottom: 4px;
`;

const UserUsername = styled.div`
  color: #6b7280;
  font-size: 12px;
`;

const DropdownDivider = styled.div`
  height: 1px;
  background-color: #e5e7eb;
  margin: 4px 0;
`;

const DropdownItem = styled.button`
  width: 100%;
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px 16px;
  background: none;
  border: none;
  text-align: left;
  cursor: pointer;
  font-size: 14px;
  color: #374151;
  transition: background-color 0.2s;
  outline: none !important;
  box-shadow: none !important;

  &:hover {
    background-color: #f9fafb;
  }

  &:focus,
  &:focus-visible {
    outline: none !important;
    box-shadow: none !important;
    background-color: #f9fafb;
  }

  &:active {
    outline: none !important;
    box-shadow: none !important;
  }
`;

const AuthButtons = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const LoginButton = styled(Link)`
  color: #4f46e5;
  text-decoration: none;
  font-weight: 500;
  font-size: 14px;
  padding: 8px 16px;
  border-radius: 6px;
  transition: background-color 0.2s;
  outline: none !important;
  box-shadow: none !important;

  &:hover {
    background-color: #f5f3ff;
  }

  &:focus,
  &:focus-visible {
    outline: none !important;
    box-shadow: none !important;
    background-color: #f5f3ff;
  }

  &:active {
    outline: none !important;
    box-shadow: none !important;
  }
`;

const SignupButton = styled(Link)`
  background-color: #4f46e5;
  color: white;
  text-decoration: none;
  font-weight: 500;
  font-size: 14px;
  padding: 8px 16px;
  border-radius: 6px;
  transition: background-color 0.2s;
  outline: none !important;
  box-shadow: none !important;

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

const CreateButton = styled.button`
  display: flex;
  align-items: center;
  gap: 6px;
  background-color: #10b981;
  color: white;
  border: none;
  border-radius: 6px;
  padding: 8px 16px;
  font-weight: 500;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s ease;
  outline: none !important;
  box-shadow: none !important;

  &:hover {
    background-color: #059669;
  }

  &:focus,
  &:focus-visible {
    outline: none !important;
    box-shadow: none !important;
    background-color: #059669;
  }

  &:active {
    outline: none !important;
    box-shadow: none !important;
    transform: translateY(1px);
  }
`;

export default Navbar;
