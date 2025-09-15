import React from "react";
import styled from "styled-components";
import Logo from "../ui/Logo";
import Header from "../ui/Header";
import SignUpForm from "../features/authentication/SignUpForm";

// 🌌 Animated Background (same as login)
const PageWrapper = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: linear-gradient(135deg, #1e3a8a, #3b82f6, #9333ea);
  background-size: 300% 300%;
  animation: gradientShift 10s ease infinite;

  @keyframes gradientShift {
    0% {
      background-position: 0% 50%;
    }
    50% {
      background-position: 100% 50%;
    }
    100% {
      background-position: 0% 50%;
    }
  }
`;

const HeaderWrapper = styled.div`
  width: 100%;
  padding: 1rem 2rem;
`;

const ContentWrapper = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 2rem;
  gap: 2rem;
`;

export default function SignUp() {
  return (
    <PageWrapper>
      <HeaderWrapper>
        <Header />
      </HeaderWrapper>
      <ContentWrapper>
        <Logo
          style={{
            marginBottom: "1rem",
            filter: "drop-shadow(0 5px 15px rgba(0,0,0,0.3))",
          }}
        />
        <SignUpForm />
      </ContentWrapper>
    </PageWrapper>
  );
}
