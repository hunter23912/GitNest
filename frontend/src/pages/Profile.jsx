import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { apiFetch } from "../utils/request";

function Profile() {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
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
        <LoadingText>加载中...</LoadingText>
      </Container>
    );
  }

  if (!user) {
    return (
      <Container>
        <ErrorText>用户不存在</ErrorText>
      </Container>
    );
  }

  return (
    <Container>
      <ProfileCard>
        <InfoItem>
          <Label>用户ID：</Label>
          <Value>{user.userid}</Value>
        </InfoItem>
        <InfoItem>
          <Label>用户名：</Label>
          <Value>{user.username}</Value>
        </InfoItem>
        <InfoItem>
          <Label>邮箱：</Label>
          <Value>{user.email}</Value>
        </InfoItem>
        <InfoItem>
          <Label>角色：</Label>
          <Value>{user.role}</Value>
        </InfoItem>
        <InfoItem>
          <Label>创建时间：</Label>
          <Value>{user.create_time}</Value>
        </InfoItem>
        <InfoItem>
          <Label>性别：</Label>
          <Value>{user.sex}</Value>
        </InfoItem>
        <InfoItem>
          <Label>年龄：</Label>
          <Value>{user.age}</Value>
        </InfoItem>
        <InfoItem>
          <Label>电话：</Label>
          <Value>{user.telephone}</Value>
        </InfoItem>
      </ProfileCard>
    </Container>
  );
}

const Container = styled.div`
  width: 100%;
  max-width: 400px;
  margin: 40px auto;
  padding: 20px;
`;

const ProfileCard = styled.div`
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  padding: 32px 24px;
`;

const InfoItem = styled.div`
  display: flex;
  margin-bottom: 18px;
`;

const Label = styled.span`
  font-weight: 600;
  color: #4f46e5;
  width: 90px;
`;

const Value = styled.span`
  color: #24292f;
`;

const LoadingText = styled.div`
  text-align: center;
  padding: 60px 0;
  color: #6b7280;
  font-size: 1.1rem;
`;

const ErrorText = styled.div`
  text-align: center;
  padding: 60px 0;
  color: #ef4444;
  font-size: 1.1rem;
`;

export default Profile;
