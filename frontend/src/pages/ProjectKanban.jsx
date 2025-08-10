import React, { useState } from "react";
import styled from "styled-components";
import { FiPlus, FiMoreHorizontal, FiCalendar, FiUser, FiTag, FiColumns, FiMove } from "react-icons/fi";
import { FaColumns, FaArrowsAlt } from "react-icons/fa";
import Navbar from "../components/Navbar";

const ProjectKanban = () => {
  const [columns, setColumns] = useState([
    {
      id: "todo",
      title: "待办事项",
      color: "#64748b",
      tasks: [
        {
          id: "1",
          title: "实现用户认证功能",
          description: "添加登录、注册和密码重置功能",
          assignee: "Alice Chen",
          priority: "high",
          labels: ["backend", "security"],
          dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
          createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        },
        {
          id: "2",
          title: "设计API文档",
          description: "为所有端点编写详细的API文档",
          assignee: "Bob Wang",
          priority: "medium",
          labels: ["documentation"],
          dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
          createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
        },
      ],
    },
    {
      id: "progress",
      title: "进行中",
      color: "#3b82f6",
      tasks: [
        {
          id: "3",
          title: "优化数据库查询",
          description: "改进慢查询和添加索引",
          assignee: "Carol Li",
          priority: "high",
          labels: ["database", "performance"],
          dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
          createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
        },
      ],
    },
    {
      id: "review",
      title: "代码审查",
      color: "#f59e0b",
      tasks: [
        {
          id: "4",
          title: "前端组件重构",
          description: "将类组件迁移到函数组件",
          assignee: "David Zhang",
          priority: "medium",
          labels: ["frontend", "refactor"],
          createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
        },
      ],
    },
    {
      id: "done",
      title: "已完成",
      color: "#10b981",
      tasks: [
        {
          id: "5",
          title: "搭建CI/CD流水线",
          description: "配置自动化测试和部署",
          assignee: "Eve Liu",
          priority: "high",
          labels: ["devops", "automation"],
          createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
        },
        {
          id: "6",
          title: "编写单元测试",
          description: "为核心模块添加测试覆盖",
          assignee: "Frank Wu",
          priority: "medium",
          labels: ["testing"],
          createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
        },
      ],
    },
  ]);

  const [showNewTaskForm, setShowNewTaskForm] = useState(null);
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    assignee: "",
    priority: "medium",
    labels: [],
  });

  const priorityColors = {
    low: "#10b981",
    medium: "#f59e0b",
    high: "#ef4444",
  };

  const teamMembers = ["Alice Chen", "Bob Wang", "Carol Li", "David Zhang", "Eve Liu", "Frank Wu"];

  const handleAddTask = (columnId) => {
    if (!newTask.title.trim()) return;

    const task = {
      id: Date.now().toString(),
      title: newTask.title,
      description: newTask.description,
      assignee: newTask.assignee || undefined,
      priority: newTask.priority,
      labels: newTask.labels,
      createdAt: new Date(),
    };

    setColumns((prev) => prev.map((col) => (col.id === columnId ? { ...col, tasks: [...col.tasks, task] } : col)));

    setNewTask({
      title: "",
      description: "",
      assignee: "",
      priority: "medium",
      labels: [],
    });
    setShowNewTaskForm(null);
  };

  const formatDate = (date) => {
    return date.toLocaleDateString("zh-CN", {
      month: "short",
      day: "numeric",
    });
  };

  const isOverdue = (date) => {
    return date < new Date();
  };

  return (
    <Container>
      <Navbar />
      <Content>
        <Header>
          <HeaderTitle>
            <FiColumns />
            项目看板
          </HeaderTitle>
          <HeaderSubtitle>GitNest 前端开发项目 - 可视化任务管理</HeaderSubtitle>
          <ProjectStats>
            <StatItem>
              <StatValue>{columns.reduce((sum, col) => sum + col.tasks.length, 0)}</StatValue>
              <StatLabel>总任务</StatLabel>
            </StatItem>
            <StatItem>
              <StatValue>{columns.find((col) => col.id === "progress")?.tasks.length || 0}</StatValue>
              <StatLabel>进行中</StatLabel>
            </StatItem>
            <StatItem>
              <StatValue>{columns.find((col) => col.id === "done")?.tasks.length || 0}</StatValue>
              <StatLabel>已完成</StatLabel>
            </StatItem>
          </ProjectStats>
        </Header>

        <KanbanBoard>
          {columns.map((column) => (
            <KanbanColumn key={column.id}>
              <ColumnHeader color={column.color}>
                <ColumnTitle>
                  <ColumnDot color={column.color} />
                  {column.title}
                  <TaskCount>{column.tasks.length}</TaskCount>
                </ColumnTitle>
                <ColumnActions>
                  <ActionButton onClick={() => setShowNewTaskForm(column.id)}>
                    <FiPlus size={14} />
                  </ActionButton>
                  <ActionButton>
                    <FiMoreHorizontal size={14} />
                  </ActionButton>
                </ColumnActions>
              </ColumnHeader>

              <TasksList>
                {column.tasks.map((task) => (
                  <TaskCard key={task.id}>
                    <TaskHeader>
                      <TaskTitle>{task.title}</TaskTitle>
                      <TaskPriority priority={task.priority}>
                        {task.priority === "high" ? "高" : task.priority === "medium" ? "中" : "低"}
                      </TaskPriority>
                    </TaskHeader>

                    {task.description && <TaskDescription>{task.description}</TaskDescription>}

                    {task.labels.length > 0 && (
                      <TaskLabels>
                        {task.labels.map((label, index) => (
                          <TaskLabel key={index}>
                            <FiTag size={10} />
                            {label}
                          </TaskLabel>
                        ))}
                      </TaskLabels>
                    )}

                    <TaskMeta>
                      {task.assignee && (
                        <TaskAssignee>
                          <FiUser size={12} />
                          {task.assignee}
                        </TaskAssignee>
                      )}
                      {task.dueDate && (
                        <TaskDueDate isOverdue={isOverdue(task.dueDate)}>
                          <FiCalendar size={12} />
                          {formatDate(task.dueDate)}
                        </TaskDueDate>
                      )}
                    </TaskMeta>

                    <TaskActions>
                      <TaskActionButton>
                        <FiMove size={12} />
                      </TaskActionButton>
                    </TaskActions>
                  </TaskCard>
                ))}

                {showNewTaskForm === column.id && (
                  <NewTaskForm>
                    <FormField>
                      <input
                        type="text"
                        placeholder="任务标题"
                        value={newTask.title}
                        onChange={(e) => setNewTask((prev) => ({ ...prev, title: e.target.value }))}
                      />
                    </FormField>
                    <FormField>
                      <textarea
                        placeholder="任务描述"
                        value={newTask.description}
                        onChange={(e) => setNewTask((prev) => ({ ...prev, description: e.target.value }))}
                        rows={2}
                      />
                    </FormField>
                    <FormRow>
                      <FormField>
                        <select
                          value={newTask.assignee}
                          onChange={(e) => setNewTask((prev) => ({ ...prev, assignee: e.target.value }))}
                        >
                          <option value="">选择负责人</option>
                          {teamMembers.map((member) => (
                            <option key={member} value={member}>
                              {member}
                            </option>
                          ))}
                        </select>
                      </FormField>
                      <FormField>
                        <select
                          value={newTask.priority}
                          onChange={(e) => setNewTask((prev) => ({ ...prev, priority: e.target.value }))}
                        >
                          <option value="low">低优先级</option>
                          <option value="medium">中优先级</option>
                          <option value="high">高优先级</option>
                        </select>
                      </FormField>
                    </FormRow>
                    <FormActions>
                      <FormButton onClick={() => handleAddTask(column.id)}>添加任务</FormButton>
                      <FormButton variant="secondary" onClick={() => setShowNewTaskForm(null)}>
                        取消
                      </FormButton>
                    </FormActions>
                  </NewTaskForm>
                )}

                {!showNewTaskForm && (
                  <AddTaskButton onClick={() => setShowNewTaskForm(column.id)}>
                    <FiPlus size={16} />
                    添加任务
                  </AddTaskButton>
                )}
              </TasksList>
            </KanbanColumn>
          ))}
        </KanbanBoard>
      </Content>
    </Container>
  );
};

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
  margin-bottom: 1.5rem;
`;

const ProjectStats = styled.div`
  display: flex;
  justify-content: center;
  gap: 2rem;
`;

const StatItem = styled.div`
  text-align: center;
`;

const StatValue = styled.div`
  font-size: 2rem;
  font-weight: 700;
  color: #667eea;
`;

const StatLabel = styled.div`
  font-size: 0.875rem;
  color: #64748b;
  margin-top: 0.25rem;
`;

const KanbanBoard = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
  align-items: start;
`;

const KanbanColumn = styled.div`
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  overflow: hidden;
`;

const ColumnHeader = styled.div`
  padding: 1rem 1.5rem;
  background: ${(props) => props.color};
  color: white;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const ColumnTitle = styled.h3`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1rem;
  font-weight: 600;
  margin: 0;
`;

const ColumnDot = styled.div`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.8);
`;

const TaskCount = styled.span`
  background: rgba(255, 255, 255, 0.2);
  padding: 0.125rem 0.5rem;
  border-radius: 12px;
  font-size: 0.75rem;
  margin-left: 0.5rem;
`;

const ColumnActions = styled.div`
  display: flex;
  gap: 0.25rem;
`;

const ActionButton = styled.button`
  background: rgba(255, 255, 255, 0.2);
  border: none;
  color: white;
  padding: 0.25rem;
  border-radius: 4px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    background: rgba(255, 255, 255, 0.3);
  }
`;

const TasksList = styled.div`
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  min-height: 200px;
`;

const TaskCard = styled.div`
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 1rem;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    border-color: #cbd5e1;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  }
`;

const TaskHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 0.5rem;
`;

const TaskTitle = styled.h4`
  font-size: 0.875rem;
  font-weight: 600;
  color: #1a202c;
  margin: 0;
  line-height: 1.4;
  flex: 1;
`;

const TaskPriority = styled.span`
  background: ${(props) =>
    props.priority === "high" ? "#fee2e2" : props.priority === "medium" ? "#fef3c7" : "#dcfce7"};
  color: ${(props) => (props.priority === "high" ? "#dc2626" : props.priority === "medium" ? "#d97706" : "#16a34a")};
  padding: 0.125rem 0.5rem;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 500;
  margin-left: 0.5rem;
`;

const TaskDescription = styled.p`
  font-size: 0.75rem;
  color: #64748b;
  margin: 0 0 0.75rem 0;
  line-height: 1.4;
`;

const TaskLabels = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.25rem;
  margin-bottom: 0.75rem;
`;

const TaskLabel = styled.span`
  display: flex;
  align-items: center;
  gap: 0.25rem;
  background: #e2e8f0;
  color: #475569;
  padding: 0.125rem 0.375rem;
  border-radius: 4px;
  font-size: 0.65rem;
  font-weight: 500;
`;

const TaskMeta = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
`;

const TaskAssignee = styled.div`
  display: flex;
  align-items: center;
  gap: 0.25rem;
  font-size: 0.75rem;
  color: #64748b;
`;

const TaskDueDate = styled.div`
  display: flex;
  align-items: center;
  gap: 0.25rem;
  font-size: 0.75rem;
  color: ${(props) => (props.isOverdue ? "#dc2626" : "#64748b")};
  font-weight: ${(props) => (props.isOverdue ? "600" : "normal")};
`;

const TaskActions = styled.div`
  display: flex;
  justify-content: flex-end;
`;

const TaskActionButton = styled.button`
  background: none;
  border: none;
  color: #94a3b8;
  cursor: grab;
  padding: 0.25rem;

  &:active {
    cursor: grabbing;
  }

  &:hover {
    color: #64748b;
  }
`;

const AddTaskButton = styled.button`
  width: 100%;
  padding: 0.75rem;
  background: none;
  border: 2px dashed #cbd5e1;
  border-radius: 8px;
  color: #64748b;
  font-size: 0.875rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  transition: all 0.2s;

  &:hover {
    border-color: #94a3b8;
    color: #475569;
  }
`;

const NewTaskForm = styled.div`
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 1rem;
`;

const FormField = styled.div`
  margin-bottom: 0.75rem;

  input,
  textarea,
  select {
    width: 100%;
    padding: 0.5rem;
    border: 1px solid #e2e8f0;
    border-radius: 4px;
    font-size: 0.875rem;
    outline: none;

    &:focus {
      border-color: #667eea;
      box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
    }
  }

  textarea {
    resize: vertical;
    min-height: 60px;
  }
`;

const FormRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.5rem;
`;

const FormActions = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const FormButton = styled.button`
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  font-size: 0.875rem;
  cursor: pointer;
  background: ${(props) => (props.variant === "secondary" ? "#f1f5f9" : "#667eea")};
  color: ${(props) => (props.variant === "secondary" ? "#64748b" : "white")};

  &:hover {
    background: ${(props) => (props.variant === "secondary" ? "#e2e8f0" : "#5a67d8")};
  }
`;

export default ProjectKanban;
