import React from "react";
import SignUpForm from "../features/authentication/SignUpForm";
import styled from "styled-components";

const PageWrapper = styled.div`
  min-height: 100vh;
  background: var(--color-grey-50); /* soft neutral background */
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  padding: 4rem 1rem;
`;

const Title = styled.h1`
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 1px;
  color: var(--color-grey-800);
  text-align: center;
`;

export default function Users() {
  return (
    <PageWrapper>
      <Title>Create a New User</Title>
      <SignUpForm />
    </PageWrapper>
  );
}
