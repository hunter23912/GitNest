import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { FaGitAlt, FaSearch } from "react-icons/fa";
import SearchOverlay from "../components/SearchOverlay";
import homelogo from "../assets/homelogo.svg";

function Home() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showSearch, setShowSearch] = useState(false);

  useEffect(() => {
    const checkAuth = () => {
      const userStr = localStorage.getItem("user");
      if (userStr) {
        setIsAuthenticated(true);
      }
    };
    checkAuth();
  }, []);

  return (
    <>
      {showSearch && <SearchOverlay onClose={() => setShowSearch(false)} />}
      <HomeContainer>
        <HeroSection>
          <HeroContent>
            <LogoContainer>
              <FaGitAlt size={50} />
              <LogoText>GitNest</LogoText>
            </LogoContainer>
            <Tagline>代码协作与版本控制的新选择</Tagline>
            <Description>GitNest 轻量化的代码托管和协作平台，让团队协作更高效、代码管理更简单。</Description>
            <HeroActions>
              {isAuthenticated ? (
                <>
                  <PrimaryButton onClick={() => setShowSearch(true)}>
                    <FaSearch size={14} style={{ marginRight: "6px" }} />
                    发现项目
                  </PrimaryButton>
                  <SecondaryButtonLink to="/repos">我的仓库</SecondaryButtonLink>
                </>
              ) : (
                <>
                  <PrimaryButtonLink to="/register">免费注册</PrimaryButtonLink>
                  <SecondaryButton onClick={() => setShowSearch(true)}>
                    <FaSearch size={14} style={{ marginRight: "6px" }} />
                    探索项目
                  </SecondaryButton>
                </>
              )}
            </HeroActions>
          </HeroContent>
          <HeroImage src={homelogo} alt="HOMELOGO" />
        </HeroSection>

        <ModulesGrid>
          <FeatureModule>
            <ModuleHeader>
              <ModuleTitle>代码托管</ModuleTitle>
              <ModuleIcon>📁</ModuleIcon>
            </ModuleHeader>
            <ModuleDescription>安全可靠地托管您的代码，支持多种编程语言和版本控制系统。</ModuleDescription>
          </FeatureModule>

          <FeatureModule>
            <ModuleHeader>
              <ModuleTitle>团队协作</ModuleTitle>
              <ModuleIcon>👥</ModuleIcon>
            </ModuleHeader>
            <ModuleDescription>便捷的协作工具，支持代码审查、问题追踪和团队管理。</ModuleDescription>
          </FeatureModule>

          <FeatureModule>
            <ModuleHeader>
              <ModuleTitle>持续集成</ModuleTitle>
              <ModuleIcon>⚙️</ModuleIcon>
            </ModuleHeader>
            <ModuleDescription>自动化构建、测试和部署，提高开发效率和代码质量。</ModuleDescription>
          </FeatureModule>

          <FeatureModule>
            <ModuleHeader>
              <ModuleTitle>项目管理</ModuleTitle>
              <ModuleIcon>📊</ModuleIcon>
            </ModuleHeader>
            <ModuleDescription>跟踪项目进度，分配任务，确保团队同步工作。</ModuleDescription>
          </FeatureModule>
        </ModulesGrid>

        <Footer>
          <FooterContent>
            <FooterSection>
              <FooterTitle>GitNest</FooterTitle>
              <FooterLinks>
                <FooterLink to="/about">关于我们</FooterLink>
                <FooterLink to="/search">探索项目</FooterLink>
                <FooterExternalLink href="#" onClick={(e) => e.preventDefault()}>
                  API文档
                </FooterExternalLink>
              </FooterLinks>
            </FooterSection>
            <FooterSection>
              <FooterTitle>社区</FooterTitle>
              <FooterLinks>
                <FooterExternalLink href="#" onClick={(e) => e.preventDefault()}>
                  帮助中心
                </FooterExternalLink>
                <FooterExternalLink href="#" onClick={(e) => e.preventDefault()}>
                  开发者论坛
                </FooterExternalLink>
                <FooterExternalLink href="#" onClick={(e) => e.preventDefault()}>
                  状态页面
                </FooterExternalLink>
              </FooterLinks>
            </FooterSection>
            <FooterSection>
              <FooterTitle>法律</FooterTitle>
              <FooterLinks>
                <FooterExternalLink href="#" onClick={(e) => e.preventDefault()}>
                  隐私政策
                </FooterExternalLink>
                <FooterExternalLink href="#" onClick={(e) => e.preventDefault()}>
                  服务条款
                </FooterExternalLink>
                <FooterExternalLink href="#" onClick={(e) => e.preventDefault()}>
                  安全
                </FooterExternalLink>
              </FooterLinks>
            </FooterSection>
          </FooterContent>
          <FooterBottom>
            <FooterCopyright>© 2024 GitNest. 由开发者社区驱动的代码托管平台.</FooterCopyright>
          </FooterBottom>
        </Footer>
      </HomeContainer>
    </>
  );
}

const HomeContainer = styled.div`
  width: 100%;
  margin: 0 auto;
  padding: 0 2rem;

  @media (min-width: 1400px) {
    max-width: 1400px;
  }
`;

const HeroSection = styled.section`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 60px 0;
  gap: 40px;

  @media (max-width: 768px) {
    flex-direction: column;
    text-align: center;
  }
`;

const HeroContent = styled.div`
  flex: 1;
`;

const LogoContainer = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 20px;
  color: #4f46e5;
`;

const LogoText = styled.h1`
  font-size: 2.5rem;
  margin-left: 10px;
  font-weight: 700;
`;

const Tagline = styled.h2`
  font-size: 2rem;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 16px;
`;

const Description = styled.p`
  font-size: 1.1rem;
  color: #4b5563;
  margin-bottom: 32px;
  line-height: 1.5;
`;

const HeroActions = styled.div`
  display: flex;
  gap: 16px;

  @media (max-width: 768px) {
    justify-content: center;
  }
`;

const ButtonBase = styled.button`
  padding: 12px 24px;
  font-size: 1rem;
  border-radius: 6px;
  text-decoration: none;
  font-weight: 600;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  transition: all 0.2s;
  border: none;
  cursor: pointer;
  outline: none;

  &:focus {
    box-shadow: 0 0 0 2px rgba(79, 70, 229, 0.3);
  }
`;

const PrimaryButton = styled(ButtonBase)`
  background-color: #4f46e5;
  color: white;

  &:hover {
    background-color: #4338ca;
  }
`;

const PrimaryButtonLink = styled(Link)`
  background-color: #4f46e5;
  color: white;
  padding: 12px 24px;
  font-size: 1rem;
  border-radius: 6px;
  text-decoration: none;
  font-weight: 600;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  transition: all 0.2s;
  outline: none;

  &:hover {
    background-color: #4338ca;
  }

  &:focus {
    background-color: #4338ca;
    box-shadow: 0 0 0 2px rgba(79, 70, 229, 0.3);
  }
`;

const SecondaryButton = styled(ButtonBase)`
  background-color: white;
  color: #4f46e5;
  border: 1px solid #4f46e5;

  &:hover {
    background-color: #f5f3ff;
  }

  &:focus {
    background-color: #f5f3ff;
    box-shadow: 0 0 0 2px rgba(79, 70, 229, 0.3);
  }
`;

const SecondaryButtonLink = styled(Link)`
  background-color: white;
  color: #4f46e5;
  padding: 12px 24px;
  border-radius: 6px;
  text-decoration: none;
  font-weight: 600;
  border: 1px solid #4f46e5;
  transition: all 0.2s;
  display: inline-flex;
  align-items: center;
  outline: none;

  &:hover {
    background-color: #f5f3ff;
  }

  &:focus {
    background-color: #f5f3ff;
    box-shadow: 0 0 0 2px rgba(79, 70, 229, 0.3);
  }
`;

const HeroImage = styled.img`
  flex: 1;
  max-width: 500px;
  height: auto;
`;

const ModulesGrid = styled.section`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 24px;
  margin: 60px 0;
`;

const FeatureModule = styled.div`
  background-color: #f9fafb;
  border-radius: 8px;
  padding: 24px;
  transition: transform 0.2s, box-shadow 0.2s;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 15px rgba(0, 0, 0, 0.1);
  }
`;

const ModuleHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
`;

const ModuleTitle = styled.h3`
  font-size: 1.2rem;
  font-weight: 600;
  color: #111827;
`;

const ModuleIcon = styled.div`
  font-size: 1.8rem;
`;

const ModuleDescription = styled.p`
  color: #4b5563;
  line-height: 1.5;
`;

const Footer = styled.footer`
  background-color: #f9fafb;
  border-top: 1px solid #e5e7eb;
  margin-top: 60px;
  padding: 40px 0 20px 0;
  border-radius: 8px 8px 0 0;
`;

const FooterContent = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 30px;
  margin-bottom: 30px;
`;

const FooterSection = styled.div`
  display: flex;
  flex-direction: column;
`;

const FooterTitle = styled.h4`
  font-size: 1rem;
  font-weight: 600;
  color: #111827;
  margin-bottom: 12px;
`;

const FooterLinks = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const FooterLink = styled(Link)`
  color: #6b7280;
  text-decoration: none;
  font-size: 0.9rem;
  transition: color 0.2s;

  &:hover {
    color: #4f46e5;
  }
`;

const FooterExternalLink = styled.a`
  color: #6b7280;
  text-decoration: none;
  font-size: 0.9rem;
  transition: color 0.2s;
  cursor: pointer;

  &:hover {
    color: #4f46e5;
  }
`;

const FooterBottom = styled.div`
  border-top: 1px solid #e5e7eb;
  padding-top: 20px;
  text-align: center;
`;

const FooterCopyright = styled.p`
  color: #6b7280;
  font-size: 0.9rem;
  margin: 0;
`;

export default Home;
