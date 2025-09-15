import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Header from "./Header";
import styled from "styled-components";

// Layout grid: 2 columns, 2 rows
const Layout = styled.div`
  display: grid;
  grid-template-columns: 240px 1fr; /* sidebar + main */
  grid-template-rows: auto 1fr; /* header + content */
  height: 100vh;
`;

// Header only above main content
const HeaderWrap = styled.header`
  grid-column: 2 / -1; /* ✅ now header stays above main only */
  grid-row: 1 / 2;
`;

// Sidebar full height
const SidebarWrap = styled.aside`
  grid-column: 1 / 2;
  grid-row: 1 / -1; /* ✅ spans full height */
`;

// Main content
const Main = styled.main`
  grid-row: 2 / -1;
  grid-column: 2 / -1;
  background-color: #f9f9f9;
  padding: 2rem 3rem;
  overflow-y: auto;
`;

export default function AppLayout() {
  return (
    <Layout>
      <SidebarWrap>
        <Sidebar />
      </SidebarWrap>
      <HeaderWrap>
        <Header />
      </HeaderWrap>
      <Main>
        <Outlet />
      </Main>
    </Layout>
  );
}
