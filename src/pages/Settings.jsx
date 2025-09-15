import React from "react";
import styled from "styled-components";
import { FaCog } from "react-icons/fa";
import UpdateSettingsForm from "../features/settings/UpdateSettingsForm";
import { useSettings } from "../features/settings/useSetting";
import Spinner from "../ui/Spinner";

// Row wrapper like a flex container
const Row = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
  max-width: 800px;
  margin: 2rem auto;
`;

const Heading = styled.h1`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 2rem;
  color: #1f2937;
`;

export default function Settings() {
  const { isLoading } = useSettings();

  if (isLoading) return <Spinner />;

  return (
    <Row>
      <Heading>
        <FaCog /> Update Hotel Settings
      </Heading>
      <UpdateSettingsForm />
    </Row>
  );
}
