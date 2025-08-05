import React, { useState } from "react";
import styled from "styled-components";
import { FiCode, FiShield, FiTrendingUp, FiAlertTriangle, FiCheckCircle, FiClock } from "react-icons/fi";
import { FaChartLine, FaBug } from "react-icons/fa";
import Navbar from "../components/Navbar";

function CodeQuality() {
  const [selectedTab, setSelectedTab] = useState("overview");

  const qualityMetrics = [
    {
      name: "代码覆盖率",
      score: 85,
      status: "good",
      description: "单元测试覆盖了 85% 的代码行",
    },
    {
      name: "可维护性",
      score: 92,
      status: "excellent",
      description: "代码结构良好，技术债务较低",
    },
    {
      name: "可靠性",
      score: 78,
      status: "warning",
      description: "存在一些潜在的 bug 和问题",
    },
    {
      name: "安全性",
      score: 95,
      status: "excellent",
      description: "没有发现安全漏洞",
    },
    {
      name: "性能",
      score: 88,
      status: "good",
      description: "代码性能良好，有少量优化空间",
    },
    {
      name: "复用性",
      score: 72,
      status: "warning",
      description: "存在一些重复代码，需要重构",
    },
  ];

  const codeIssues = [
    {
      id: "1",
      type: "bug",
      severity: "critical",
      file: "src/utils/validation.ts",
      line: 45,
      message: "潜在的空指针异常",
      rule: "typescript:no-null-check",
    },
    {
      id: "2",
      type: "vulnerability",
      severity: "major",
      file: "src/api/auth.ts",
      line: 23,
      message: "使用了不安全的随机数生成器",
      rule: "security:weak-random",
    },
    {
      id: "3",
      type: "code_smell",
      severity: "major",
      file: "src/components/UserList.tsx",
      line: 78,
      message: "函数过于复杂，认知复杂度为 15",
      rule: "complexity:cognitive",
    },
    {
      id: "4",
      type: "duplication",
      severity: "minor",
      file: "src/pages/Profile.tsx",
      line: 156,
      message: "重复代码块 (12 行)",
      rule: "duplication:block",
    },
    {
      id: "5",
      type: "code_smell",
      severity: "minor",
      file: "src/hooks/useAuth.ts",
      line: 34,
      message: "变量名不符合驼峰命名规范",
      rule: "naming:camelcase",
    },
  ];

  const getScoreColor = (score) => {
    if (score >= 90) return "#10b981";
    if (score >= 75) return "#f59e0b";
    if (score >= 60) return "#ef4444";
    return "#dc2626";
  };

  const getIssueIcon = (type) => {
    switch (type) {
      case "bug":
        return <FaBug />;
      case "vulnerability":
        return <FiShield />;
      case "code_smell":
        return <FiCode />;
      case "duplication":
        return <FiAlertTriangle />;
      default:
        return <FiCode />;
    }
  };

  const getSeverityColor = (severity) => {
    switch (severity) {
      case "critical":
        return "#dc2626";
      case "major":
        return "#f59e0b";
      case "minor":
        return "#6b7280";
      default:
        return "#6b7280";
    }
  };

  const overallScore = Math.round(
    qualityMetrics.reduce((sum, metric) => sum + metric.score, 0) / qualityMetrics.length
  );

  return (
    <Container>
      <Navbar />
      <Content>
        <Header>
          <HeaderTitle>
            <FaChartLine />
            代码质量分析
          </HeaderTitle>
          <HeaderSubtitle>GitNest 前端项目 - 代码质量报告与分析</HeaderSubtitle>
        </Header>

        <ScoreCard>
          <OverallScore>
            <ScoreCircle score={overallScore}>
              <ScoreValue>{overallScore}</ScoreValue>
              <ScoreLabel>综合评分</ScoreLabel>
            </ScoreCircle>
            <ScoreDetails>
              <ScoreItem>
                <ScoreItemIcon color="#10b981">
                  <FiCheckCircle />
                </ScoreItemIcon>
                <ScoreItemText>
                  <ScoreItemTitle>代码质量良好</ScoreItemTitle>
                  <ScoreItemDesc>总体代码质量处于良好水平</ScoreItemDesc>
                </ScoreItemText>
              </ScoreItem>
              <ScoreItem>
                <ScoreItemIcon color="#f59e0b">
                  <FiAlertTriangle />
                </ScoreItemIcon>
                <ScoreItemText>
                  <ScoreItemTitle>发现 {codeIssues.length} 个问题</ScoreItemTitle>
                  <ScoreItemDesc>需要关注安全性和可维护性</ScoreItemDesc>
                </ScoreItemText>
              </ScoreItem>
              <ScoreItem>
                <ScoreItemIcon color="#3b82f6">
                  <FiTrendingUp />
                </ScoreItemIcon>
                <ScoreItemText>
                  <ScoreItemTitle>持续改进</ScoreItemTitle>
                  <ScoreItemDesc>代码质量呈上升趋势</ScoreItemDesc>
                </ScoreItemText>
              </ScoreItem>
            </ScoreDetails>
          </OverallScore>
        </ScoreCard>

        <TabNavigation>
          <TabButton active={selectedTab === "overview"} onClick={() => setSelectedTab("overview")}>
            概览
          </TabButton>
          <TabButton active={selectedTab === "issues"} onClick={() => setSelectedTab("issues")}>
            问题列表 ({codeIssues.length})
          </TabButton>
          <TabButton active={selectedTab === "trends"} onClick={() => setSelectedTab("trends")}>
            趋势分析
          </TabButton>
        </TabNavigation>

        <TabContent>
          {selectedTab === "overview" && (
            <MetricsGrid>
              {qualityMetrics.map((metric, index) => (
                <MetricCard key={index}>
                  <MetricHeader>
                    <MetricName>{metric.name}</MetricName>
                    <MetricScore color={getScoreColor(metric.score)}>{metric.score}%</MetricScore>
                  </MetricHeader>
                  <MetricBar>
                    <MetricProgress width={metric.score} color={getScoreColor(metric.score)} />
                  </MetricBar>
                  <MetricDescription>{metric.description}</MetricDescription>
                  <MetricStatus status={metric.status}>
                    {metric.status === "excellent" && "优秀"}
                    {metric.status === "good" && "良好"}
                    {metric.status === "warning" && "警告"}
                    {metric.status === "critical" && "严重"}
                  </MetricStatus>
                </MetricCard>
              ))}
            </MetricsGrid>
          )}

          {selectedTab === "issues" && (
            <IssuesList>
              <IssuesFilter>
                <FilterGroup>
                  <FilterLabel>类型筛选：</FilterLabel>
                  <FilterButton active>全部</FilterButton>
                  <FilterButton>Bug</FilterButton>
                  <FilterButton>安全</FilterButton>
                  <FilterButton>代码异味</FilterButton>
                  <FilterButton>重复代码</FilterButton>
                </FilterGroup>
                <FilterGroup>
                  <FilterLabel>严重程度：</FilterLabel>
                  <FilterButton active>全部</FilterButton>
                  <FilterButton>严重</FilterButton>
                  <FilterButton>重要</FilterButton>
                  <FilterButton>次要</FilterButton>
                </FilterGroup>
              </IssuesFilter>

              {codeIssues.map((issue) => (
                <IssueCard key={issue.id}>
                  <IssueHeader>
                    <IssueType color={getSeverityColor(issue.severity)}>
                      {getIssueIcon(issue.type)}
                      {issue.type === "bug" && "Bug"}
                      {issue.type === "vulnerability" && "安全漏洞"}
                      {issue.type === "code_smell" && "代码异味"}
                      {issue.type === "duplication" && "重复代码"}
                    </IssueType>
                    <IssueSeverity severity={issue.severity}>
                      {issue.severity === "critical" && "严重"}
                      {issue.severity === "major" && "重要"}
                      {issue.severity === "minor" && "次要"}
                    </IssueSeverity>
                  </IssueHeader>
                  <IssueMessage>{issue.message}</IssueMessage>
                  <IssueLocation>
                    <FiCode size={14} />
                    {issue.file}:{issue.line}
                    <IssueRule>{issue.rule}</IssueRule>
                  </IssueLocation>
                </IssueCard>
              ))}
            </IssuesList>
          )}

          {selectedTab === "trends" && (
            <TrendsView>
              <TrendChart>
                <ChartTitle>代码质量趋势 (最近 30 天)</ChartTitle>
                <ChartPlaceholder>
                  <FiTrendingUp size={48} />
                  <p>质量分数从 78 提升至 {overallScore}</p>
                  <p>修复了 15 个问题，新增 3 个问题</p>
                </ChartPlaceholder>
              </TrendChart>

              <TrendStats>
                <TrendStat>
                  <TrendStatIcon color="#10b981">
                    <FiCheckCircle />
                  </TrendStatIcon>
                  <TrendStatContent>
                    <TrendStatValue>+12%</TrendStatValue>
                    <TrendStatLabel>代码覆盖率提升</TrendStatLabel>
                  </TrendStatContent>
                </TrendStat>

                <TrendStat>
                  <TrendStatIcon color="#ef4444">
                    <FaBug />
                  </TrendStatIcon>
                  <TrendStatContent>
                    <TrendStatValue>-8</TrendStatValue>
                    <TrendStatLabel>Bug 数量减少</TrendStatLabel>
                  </TrendStatContent>
                </TrendStat>

                <TrendStat>
                  <TrendStatIcon color="#3b82f6">
                    <FiClock />
                  </TrendStatIcon>
                  <TrendStatContent>
                    <TrendStatValue>2.3h</TrendStatValue>
                    <TrendStatLabel>平均修复时间</TrendStatLabel>
                  </TrendStatContent>
                </TrendStat>
              </TrendStats>
            </TrendsView>
          )}
        </TabContent>
      </Content>
    </Container>
  );
}

// 样式组件
const Container = styled.div`
  min-height: 100vh;
  background: #f8fafc;
`;

const Content = styled.div`
  width: 100%;
  margin: 0 auto;
  padding: 2rem;

  @media (min-width: 1600px) {
    max-width: 1600px;
  }
`;

const Header = styled.header`
  text-align: center;
  margin-bottom: 2rem;
`;

const HeaderTitle = styled.h1`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  font-size: 2.5rem;
  font-weight: 700;
  color: #1a202c;
  margin-bottom: 0.5rem;
`;

const HeaderSubtitle = styled.p`
  font-size: 1.1rem;
  color: #64748b;
`;

const ScoreCard = styled.div`
  background: white;
  border-radius: 12px;
  padding: 2rem;
  margin-bottom: 2rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
`;

const OverallScore = styled.div`
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 2rem;
  align-items: center;
`;

const ScoreCircle = styled.div`
  width: 120px;
  height: 120px;
  border-radius: 50%;
  background: conic-gradient(
    ${(props) => (props.score >= 90 ? "#10b981" : props.score >= 75 ? "#f59e0b" : "#ef4444")}
      ${(props) => props.score * 3.6}deg,
    #e5e7eb 0deg
  );
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: relative;

  &::before {
    content: "";
    position: absolute;
    width: 90px;
    height: 90px;
    background: white;
    border-radius: 50%;
  }
`;

const ScoreValue = styled.div`
  font-size: 2rem;
  font-weight: 700;
  color: #1a202c;
  z-index: 1;
`;

const ScoreLabel = styled.div`
  font-size: 0.75rem;
  color: #64748b;
  z-index: 1;
`;

const ScoreDetails = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const ScoreItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
`;

const ScoreItemIcon = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 8px;
  background: ${(props) => props.color}20;
  color: ${(props) => props.color};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.25rem;
`;

const ScoreItemText = styled.div``;

const ScoreItemTitle = styled.div`
  font-weight: 600;
  color: #1a202c;
  margin-bottom: 0.25rem;
`;

const ScoreItemDesc = styled.div`
  font-size: 0.875rem;
  color: #64748b;
`;

const TabNavigation = styled.div`
  display: flex;
  background: white;
  border-radius: 8px 8px 0 0;
  border-bottom: 1px solid #e2e8f0;
  overflow: hidden;
`;

const TabButton = styled.button`
  padding: 1rem 1.5rem;
  background: ${(props) => (props.active ? "#667eea" : "white")};
  color: ${(props) => (props.active ? "white" : "#64748b")};
  border: none;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: ${(props) => (props.active ? "#5a67d8" : "#f8fafc")};
  }
`;

const TabContent = styled.div`
  background: white;
  border-radius: 0 0 8px 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
`;

const MetricsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
  padding: 2rem;
`;

const MetricCard = styled.div`
  padding: 1.5rem;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  background: #f8fafc;
`;

const MetricHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
`;

const MetricName = styled.h3`
  font-size: 1rem;
  font-weight: 600;
  color: #1a202c;
  margin: 0;
`;

const MetricScore = styled.span`
  font-size: 1.25rem;
  font-weight: 700;
  color: ${(props) => props.color};
`;

const MetricBar = styled.div`
  width: 100%;
  height: 8px;
  background: #e5e7eb;
  border-radius: 4px;
  overflow: hidden;
  margin-bottom: 1rem;
`;

const MetricProgress = styled.div`
  width: ${(props) => props.width}%;
  height: 100%;
  background: ${(props) => props.color};
  transition: width 0.3s ease;
`;

const MetricDescription = styled.p`
  font-size: 0.875rem;
  color: #64748b;
  margin: 0 0 0.75rem 0;
  line-height: 1.4;
`;

const MetricStatus = styled.span`
  display: inline-block;
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 500;
  background: ${(props) => {
    switch (props.status) {
      case "excellent":
        return "#10b98120";
      case "good":
        return "#3b82f620";
      case "warning":
        return "#f59e0b20";
      case "critical":
        return "#ef444420";
      default:
        return "#6b728020";
    }
  }};
  color: ${(props) => {
    switch (props.status) {
      case "excellent":
        return "#10b981";
      case "good":
        return "#3b82f6";
      case "warning":
        return "#f59e0b";
      case "critical":
        return "#ef4444";
      default:
        return "#6b7280";
    }
  }};
`;

const IssuesList = styled.div`
  padding: 2rem;
`;

const IssuesFilter = styled.div`
  display: flex;
  gap: 2rem;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
`;

const FilterGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const FilterLabel = styled.span`
  font-size: 0.875rem;
  color: #64748b;
  font-weight: 500;
`;

const FilterButton = styled.button`
  padding: 0.25rem 0.75rem;
  border: 1px solid ${(props) => (props.active ? "#667eea" : "#e2e8f0")};
  background: ${(props) => (props.active ? "#667eea" : "white")};
  color: ${(props) => (props.active ? "white" : "#64748b")};
  border-radius: 4px;
  font-size: 0.75rem;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    border-color: #667eea;
    background: ${(props) => (props.active ? "#5a67d8" : "#f8fafc")};
  }
`;

const IssueCard = styled.div`
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 1rem;
  margin-bottom: 0.75rem;
  background: #fafbfc;

  &:hover {
    border-color: #cbd5e1;
  }
`;

const IssueHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.75rem;
`;

const IssueType = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: ${(props) => props.color};
  font-weight: 500;
  font-size: 0.875rem;
`;

const IssueSeverity = styled.span`
  padding: 0.125rem 0.5rem;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 500;
  background: ${(props) => {
    switch (props.severity) {
      case "critical":
        return "#dc262620";
      case "major":
        return "#f59e0b20";
      case "minor":
        return "#6b728020";
      default:
        return "#6b728020";
    }
  }};
  color: ${(props) => {
    switch (props.severity) {
      case "critical":
        return "#dc2626";
      case "major":
        return "#f59e0b";
      case "minor":
        return "#6b7280";
      default:
        return "#6b7280";
    }
  }};
`;

const IssueMessage = styled.div`
  font-size: 0.875rem;
  color: #1a202c;
  margin-bottom: 0.75rem;
  line-height: 1.4;
`;

const IssueLocation = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.75rem;
  color: #64748b;
`;

const IssueRule = styled.span`
  background: #e2e8f0;
  padding: 0.125rem 0.375rem;
  border-radius: 4px;
  margin-left: auto;
`;

const TrendsView = styled.div`
  padding: 2rem;
`;

const TrendChart = styled.div`
  background: #f8fafc;
  border-radius: 8px;
  padding: 2rem;
  margin-bottom: 2rem;
  text-align: center;
`;

const ChartTitle = styled.h3`
  font-size: 1.1rem;
  font-weight: 600;
  color: #1a202c;
  margin-bottom: 2rem;
`;

const ChartPlaceholder = styled.div`
  color: #64748b;

  p {
    margin: 0.5rem 0;
    font-size: 0.875rem;
  }
`;

const TrendStats = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
`;

const TrendStat = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1.5rem;
  background: #f8fafc;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
`;

const TrendStatIcon = styled.div`
  width: 48px;
  height: 48px;
  border-radius: 8px;
  background: ${(props) => props.color}20;
  color: ${(props) => props.color};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
`;

const TrendStatContent = styled.div``;

const TrendStatValue = styled.div`
  font-size: 1.5rem;
  font-weight: 700;
  color: #1a202c;
  margin-bottom: 0.25rem;
`;

const TrendStatLabel = styled.div`
  font-size: 0.875rem;
  color: #64748b;
`;

export default CodeQuality;
