import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { FiUser, FiMail, FiPhone, FiCalendar, FiShield, FiEdit3 } from "react-icons/fi";
import { apiFetch } from "../utils/request";

function Profile() {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const [editMode, setEditMode] = useState(false);
  const [editData, setEditData] = useState({});
  const [editLoading, setEditLoading] = useState(false);
  const [editError, setEditError] = useState("");
  const [editSuccess, setEditSuccess] = useState("");

  // 编辑按钮点击
  const handleEditClick = () => {
    setEditMode(true);
    setEditData({ ...user });
    setEditError("");
    setEditSuccess("");
  };

  // 取消编辑
  const handleCancelEdit = () => {
    setEditMode(false);
    setEditError("");
    setEditSuccess("");
  };

  // 编辑表单提交
  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setEditLoading(true);
    setEditError("");
    setEditSuccess("");
    try {
      const res = await apiFetch("/user", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: localStorage.getItem("token"),
        },
        body: JSON.stringify(editData),
      });
      const resp = await res.json();
      if (resp && resp.code === 0) {
        setEditSuccess("修改成功！");
        setEditMode(false);
        // 更新本地 user 信息
        setUser(editData);
        localStorage.setItem("user", JSON.stringify(editData));
        window.dispatchEvent(new Event("user-change"));
      } else {
        setEditError("修改失败，请重试");
      }
    } catch (err) {
      setEditError("修改失败：" + (err?.message || "未知错误"));
    } finally {
      setEditLoading(false);
    }
  };

  // 编辑表单输入变化
  const handleEditChange = (field, value) => {
    setEditData((prev) => ({ ...prev, [field]: value }));
  };

  useEffect(() => {
    console.log(user);
    const loadProfile = async () => {
      setIsLoading(true);
      try {
        const res = await apiFetch("/user", {
          method: "GET",
          headers: {
            Authorization: localStorage.getItem("token"),
          },
        });
        const resp = await res.json();
        if (resp && resp.code === 0) {
          setUser(resp.data);
          localStorage.setItem("user", JSON.stringify(resp.data));
          window.dispatchEvent(new Event("user-change"));
        } else {
          setUser(null);
        }
      } catch (error) {
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };
    loadProfile();
  }, []);

  if (isLoading) {
    return (
      <Container>
        <LoadingCard>
          <LoadingSpinner />
          <LoadingText>加载中...</LoadingText>
        </LoadingCard>
      </Container>
    );
  }

  if (!user) {
    return (
      <Container>
        <ErrorCard>
          <ErrorIcon>😔</ErrorIcon>
          <ErrorText>用户不存在</ErrorText>
        </ErrorCard>
      </Container>
    );
  }

  const profileData = [
    { icon: FiUser, label: "用户ID", value: user.userid },
    { icon: FiUser, label: "用户名", value: user.username },
    { icon: FiMail, label: "邮箱", value: user.email },
    { icon: FiShield, label: "角色", value: user.role },
    { icon: FiCalendar, label: "创建时间", value: user.create_time },
    { icon: FiUser, label: "性别", value: user.sex },
    { icon: FiUser, label: "年龄", value: user.age },
    { icon: FiPhone, label: "电话", value: user.telephone },
  ];

  return (
    <Container>
      <ProfileCard>
        <Header>
          <Avatar>
            <AvatarText>{user.username?.[0]?.toUpperCase() || "U"}</AvatarText>
          </Avatar>
          <UserInfo>
            <UserName>{user.username}</UserName>
            <UserEmail>{user.email}</UserEmail>
          </UserInfo>
          {!editMode && (
            <EditButton onClick={handleEditClick}>
              <FiEdit3 size={16} />
              编辑资料
            </EditButton>
          )}
        </Header>

        <Divider />

        <InfoSection>
          <SectionTitle>个人信息</SectionTitle>
          {editMode ? (
            <form onSubmit={handleEditSubmit}>
              {/* 可编辑字段，按需调整 */}
              <EditRow>
                <EditLabel>用户名</EditLabel>
                <EditInput type="text" value={editData.username || ""} onChange={(e) => handleEditChange("username", e.target.value)} required />
              </EditRow>
              <EditRow>
                <EditLabel>邮箱</EditLabel>
                <EditInput type="email" value={editData.email || ""} onChange={(e) => handleEditChange("email", e.target.value)} required />
              </EditRow>
              <EditRow>
                <EditLabel>性别</EditLabel>
                <EditSelect value={editData.sex || ""} onChange={(e) => handleEditChange("sex", e.target.value)}>
                  <option value="">未设置</option>
                  <option value="男">男</option>
                  <option value="女">女</option>
                  <option value="其他">其他</option>
                </EditSelect>
              </EditRow>
              <EditRow>
                <EditLabel>年龄</EditLabel>
                <EditInput type="number" value={editData.age || ""} onChange={(e) => handleEditChange("age", e.target.value)} min={0} />
              </EditRow>
              <EditRow>
                <EditLabel>电话</EditLabel>
                <EditInput type="text" value={editData.telephone || ""} onChange={(e) => handleEditChange("telephone", e.target.value)} />
              </EditRow>
              {/* 其他字段可继续添加 */}
              <EditActions>
                <EditSubmit type="submit" disabled={editLoading}>
                  {editLoading ? "保存中..." : "保存"}
                </EditSubmit>
                <EditCancel type="button" onClick={handleCancelEdit} disabled={editLoading}>
                  取消
                </EditCancel>
              </EditActions>
              {editError && <EditError>{editError}</EditError>}
              {editSuccess && <EditSuccess>{editSuccess}</EditSuccess>}
            </form>
          ) : (
            profileData.map((item, index) => (
              <InfoItem key={index}>
                <IconContainer>
                  <item.icon size={18} />
                </IconContainer>
                <InfoContent>
                  <Label>{item.label}</Label>
                  <Value>{item.value || "未设置"}</Value>
                </InfoContent>
              </InfoItem>
            ))
          )}
        </InfoSection>
      </ProfileCard>
    </Container>
  );
}

// 新增样式
const EditRow = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 18px;
`;
const EditLabel = styled.label`
  width: 80px;
  font-size: 14px;
  color: #6b7280;
  margin-right: 16px;
`;
const EditInput = styled.input`
  flex: 1;
  padding: 8px 12px;
  border: 1px solid #e1e5e9;
  border-radius: 6px;
  font-size: 15px;
`;
const EditSelect = styled.select`
  flex: 1;
  padding: 8px 12px;
  border: 1px solid #e1e5e9;
  border-radius: 6px;
  font-size: 15px;
`;
const EditActions = styled.div`
  display: flex;
  gap: 16px;
  margin-top: 12px;
`;
const EditSubmit = styled.button`
  padding: 8px 20px;
  background: #4f46e5;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
`;
const EditCancel = styled.button`
  padding: 8px 20px;
  background: #e5e7eb;
  color: #24292f;
  border: none;
  border-radius: 4px;
  cursor: pointer;
`;
const EditError = styled.div`
  color: #ef4444;
  margin-top: 10px;
  font-size: 14px;
`;
const EditSuccess = styled.div`
  color: #22c55e;
  margin-top: 10px;
  font-size: 14px;
`;

const Container = styled.div`
  width: 100%;
  max-width: 600px;
  margin: 40px auto;
  padding: 20px;
`;

const ProfileCard = styled.div`
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  overflow: hidden;
  border: 1px solid #f0f0f0;
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  padding: 32px 24px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  position: relative;
`;

const Avatar = styled.div`
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  border: 3px solid rgba(255, 255, 255, 0.3);
  backdrop-filter: blur(10px);
`;

const AvatarText = styled.span`
  font-size: 32px;
  font-weight: bold;
  color: white;
`;

const UserInfo = styled.div`
  margin-left: 20px;
  flex: 1;
`;

const UserName = styled.h2`
  margin: 0 0 8px 0;
  font-size: 24px;
  font-weight: 600;
`;

const UserEmail = styled.p`
  margin: 0;
  opacity: 0.9;
  font-size: 14px;
`;

const EditButton = styled.button`
  background: rgba(255, 255, 255, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.3);
  color: white;
  padding: 8px 16px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  font-size: 14px;
  backdrop-filter: blur(10px);
  transition: all 0.2s;

  &:hover {
    background: rgba(255, 255, 255, 0.3);
    transform: translateY(-1px);
  }
`;

const Divider = styled.div`
  height: 1px;
  background: #f0f0f0;
`;

const InfoSection = styled.div`
  padding: 24px;
`;

const SectionTitle = styled.h3`
  margin: 0 0 20px 0;
  font-size: 18px;
  font-weight: 600;
  color: #1f2937;
`;

const InfoItem = styled.div`
  display: flex;
  align-items: center;
  padding: 16px 0;
  border-bottom: 1px solid #f9fafb;

  &:last-child {
    border-bottom: none;
  }
`;

const IconContainer = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 10px;
  background: #f8fafc;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #6b7280;
  margin-right: 16px;
`;

const InfoContent = styled.div`
  flex: 1;
`;

const Label = styled.div`
  font-size: 14px;
  color: #6b7280;
  margin-bottom: 4px;
`;

const Value = styled.div`
  font-size: 16px;
  color: #1f2937;
  font-weight: 500;
`;

const LoadingCard = styled.div`
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  padding: 60px 24px;
  text-align: center;
`;

const LoadingSpinner = styled.div`
  width: 40px;
  height: 40px;
  border: 4px solid #f3f4f6;
  border-top: 4px solid #667eea;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 20px;

  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
`;

const LoadingText = styled.div`
  color: #6b7280;
  font-size: 16px;
`;

const ErrorCard = styled.div`
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  padding: 60px 24px;
  text-align: center;
`;

const ErrorIcon = styled.div`
  font-size: 48px;
  margin-bottom: 16px;
`;

const ErrorText = styled.div`
  color: #ef4444;
  font-size: 18px;
  font-weight: 500;
`;

export default Profile;
