import React from "react";
import styled from "styled-components";
import Navbar from "./Navbar";

function Layout({ children }) {
  return (
    <LayoutContainer>
      <Navbar />
      <MainContent>{children}</MainContent>
    </LayoutContainer>
  );
}

const LayoutContainer = styled.div`
  width: 100%;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
`;

const MainContent = styled.main`
  flex: 1;
  width: 100%;
`;

export default Layout;
