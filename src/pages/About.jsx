import React from "react";
import styled from "styled-components";
import { FiGithub, FiHeart, FiUsers, FiShield, FiTarget } from "react-icons/fi";

const Container = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
`;

const Content = styled.div`
  width: 100%;
  margin: 0 auto;
  padding: 2rem;

  @media (min-width: 1400px) {
    max-width: 1400px;
  }
`;

const Hero = styled.section`
  text-align: center;
  padding: 4rem 0;
  color: white;
`;

const Title = styled.h1`
  font-size: 3rem;
  font-weight: 700;
  margin-bottom: 1rem;
  background: linear-gradient(45deg, #fff, #e0e6ff);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
`;

const Subtitle = styled.p`
  font-size: 1.25rem;
  opacity: 0.9;
  max-width: 600px;
  margin: 0 auto;
  line-height: 1.6;
`;

const Section = styled.section`
  background: white;
  border-radius: 12px;
  padding: 3rem;
  margin: 2rem 0;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

const SectionTitle = styled.h2`
  font-size: 2rem;
  font-weight: 600;
  margin-bottom: 2rem;
  color: #2d3748;
  display: flex;
  align-items: center;
  gap: 0.75rem;
`;

const FeatureGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  margin-top: 2rem;
`;

const FeatureCard = styled.div`
  background: #f7fafc;
  padding: 2rem;
  border-radius: 8px;
  border-left: 4px solid #667eea;
`;

const FeatureIcon = styled.div`
  font-size: 2rem;
  color: #667eea;
  margin-bottom: 1rem;
`;

const FeatureTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 0.75rem;
  color: #2d3748;
`;

const FeatureDescription = styled.p`
  color: #4a5568;
  line-height: 1.6;
`;

const TeamSection = styled.div`
  text-align: center;
  color: #4a5568;
`;

const TeamMember = styled.div`
  display: inline-block;
  margin: 0 1rem;
  padding: 1rem;
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 2rem;
  margin: 2rem 0;
`;

const StatCard = styled.div`
  text-align: center;
  padding: 1.5rem;
  background: #f7fafc;
  border-radius: 8px;
`;

const StatNumber = styled.div`
  font-size: 2.5rem;
  font-weight: 700;
  color: #667eea;
  margin-bottom: 0.5rem;
`;

const StatLabel = styled.div`
  color: #4a5568;
  font-weight: 500;
`;

const About = () => {
  return (
    <Container>
      <Content>
        <Hero>
          <Title>关于 GitNest</Title>
          <Subtitle>一个现代化的代码托管和协作平台，让开发者能够轻松管理、分享和协作开发项目</Subtitle>
        </Hero>

        <Section>
          <SectionTitle>
            <FiTarget />
            我们的使命
          </SectionTitle>
          <p style={{ fontSize: "1.1rem", lineHeight: "1.8", color: "#4a5568" }}>
            GitNest 致力于为开发者提供一个简洁、高效、功能丰富的代码托管平台。我们相信优秀的工具能够激发创造力，
            让开发者专注于构建出色的软件产品。无论您是个人开发者还是团队，GitNest 都能为您提供所需的工具和环境。
          </p>
        </Section>

        <Section>
          <SectionTitle>
            <FiHeart />
            核心特性
          </SectionTitle>
          <FeatureGrid>
            <FeatureCard>
              <FeatureIcon>
                <FiGithub />
              </FeatureIcon>
              <FeatureTitle>Git 版本控制</FeatureTitle>
              <FeatureDescription>
                完整的 Git 支持，包括分支管理、合并请求、版本标签等功能，让代码管理更加高效。
              </FeatureDescription>
            </FeatureCard>

            <FeatureCard>
              <FeatureIcon>
                <FiUsers />
              </FeatureIcon>
              <FeatureTitle>团队协作</FeatureTitle>
              <FeatureDescription>
                强大的团队协作功能，包括代码审查、议题跟踪、项目管理等，提升团队开发效率。
              </FeatureDescription>
            </FeatureCard>

            <FeatureCard>
              <FeatureIcon>
                <FiShield />
              </FeatureIcon>
              <FeatureTitle>安全可靠</FeatureTitle>
              <FeatureDescription>
                企业级的安全保障，包括访问控制、数据加密、安全审计等，确保您的代码安全。
              </FeatureDescription>
            </FeatureCard>
          </FeatureGrid>
        </Section>

        <Section>
          <SectionTitle>
            <FiUsers />
            平台数据
          </SectionTitle>
          <StatsGrid>
            <StatCard>
              <StatNumber>10,000+</StatNumber>
              <StatLabel>注册用户</StatLabel>
            </StatCard>
            <StatCard>
              <StatNumber>50,000+</StatNumber>
              <StatLabel>代码仓库</StatLabel>
            </StatCard>
            <StatCard>
              <StatNumber>1,000+</StatNumber>
              <StatLabel>活跃团队</StatLabel>
            </StatCard>
            <StatCard>
              <StatNumber>99.9%</StatNumber>
              <StatLabel>服务可用性</StatLabel>
            </StatCard>
          </StatsGrid>
        </Section>

        <Section>
          <TeamSection>
            <SectionTitle style={{ justifyContent: "center" }}>
              <FiHeart />
              开发团队
            </SectionTitle>
            <p style={{ fontSize: "1.1rem", lineHeight: "1.8", color: "#4a5568", marginBottom: "2rem" }}>
              GitNest 由一群热爱开源和技术的开发者组成，我们致力于为全球开发者社区提供更好的工具和服务。
            </p>
            <div style={{ display: "flex", justifyContent: "center", gap: "2rem", flexWrap: "wrap" }}>
              <TeamMember>
                <div style={{ fontSize: "3rem", marginBottom: "0.5rem" }}>👩‍💻</div>
                <div style={{ fontWeight: "600" }}>产品团队</div>
                <div style={{ color: "#718096" }}>用户体验设计</div>
              </TeamMember>
              <TeamMember>
                <div style={{ fontSize: "3rem", marginBottom: "0.5rem" }}>👨‍💻</div>
                <div style={{ fontWeight: "600" }}>工程团队</div>
                <div style={{ color: "#718096" }}>技术开发</div>
              </TeamMember>
              <TeamMember>
                <div style={{ fontSize: "3rem", marginBottom: "0.5rem" }}>🛡️</div>
                <div style={{ fontWeight: "600" }}>安全团队</div>
                <div style={{ color: "#718096" }}>安全保障</div>
              </TeamMember>
              <TeamMember>
                <div style={{ fontSize: "3rem", marginBottom: "0.5rem" }}>🎯</div>
                <div style={{ fontWeight: "600" }}>运营团队</div>
                <div style={{ color: "#718096" }}>社区运营</div>
              </TeamMember>
            </div>
          </TeamSection>
        </Section>
      </Content>
    </Container>
  );
};

export default About;
