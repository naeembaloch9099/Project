import React from "react";
import styled from "styled-components";
import UpdateUserDetails from "../features/authentication/UpdateUserDetails";
import UpdatePassword from "../features/authentication/UpdatePassword";

// ---------- styled-components ----------
const Container = styled.div`
  max-width: 700px;
  margin: 3rem auto;
  padding: 2rem;
  background: #f9fafb;
  border-radius: 16px;
  border: 1px solid var(--color-grey-200);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.06);
`;

const Title = styled.h1`
  text-align: center;
  margin-bottom: 2.5rem;
  font-size: 2rem;
  font-weight: 700;
  color: var(--color-grey-900);
`;

const Stack = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;

const Card = styled.div`
  background: white;
  padding: 2rem;
  border-radius: 16px;
  border: 1px solid #e5e7eb;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
`;

export default function Account() {
  return (
    <Container>
      <Title>My Account</Title>
      <Stack>
        <Card>
          <UpdateUserDetails />
        </Card>
        <Card>
          <UpdatePassword />
        </Card>
      </Stack>
    </Container>
  );
}
