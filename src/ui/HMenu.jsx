import React from "react";
import styled from "styled-components";
import { HiOutlineUser } from "react-icons/hi2";
import { useNavigate } from "react-router-dom";
import Logout from "../features/authentication/Logout";

const StyledHeader = styled.ul`
  display: flex;
  align-items: center;
  gap: 1.2rem;
  list-style: none;
`;

const Button = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.6rem 1.2rem;
  border: none;
  border-radius: 0.6rem;
  background-color: var(--color-grey-100);
  color: var(--color-grey-700);
  font-size: 1.4rem;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background-color: var(--color-grey-200);
    color: var(--color-brand-600);
    transform: translateY(-2px);
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
  }

  &:active {
    transform: translateY(0);
    box-shadow: none;
  }

  svg {
    width: 1.6rem;
    height: 1.6rem;
  }
`;

function HMenu() {
  const navigate = useNavigate();

  return (
    <StyledHeader>
      <li>
        <Button onClick={() => navigate("/account")}>
          <HiOutlineUser />
        </Button>
      </li>
      <li>
        <Logout />
      </li>
    </StyledHeader>
  );
}

export default HMenu;
