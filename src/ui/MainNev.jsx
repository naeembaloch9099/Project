import React from "react";
import styled from "styled-components";
import { MdDashboard } from "react-icons/md";
import { FaBook, FaUsers, FaCog, FaBed } from "react-icons/fa";
import { NavLink } from "react-router-dom";

// Sidebar nav wrapper
const NavSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.2rem;
`;

// Optional section title (can style like small uppercase text)
const Title = styled.h4`
  font-size: 0.9rem;
  font-weight: 600;
  color: #666;
  margin: 0;
  padding: 0 0.5rem;
  text-transform: uppercase;
`;

// Navigation list
const NavList = styled.ul`
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
`;

// Styled nav link
const NavButton = styled(NavLink)`
  display: flex;
  align-items: center;
  gap: 0.8rem;
  padding: 0.9rem 1rem;
  border-radius: 10px;
  color: #222;
  font-size: 1rem;
  text-decoration: none;
  font-weight: 500;
  transition: background 0.2s, transform 0.2s;

  &.active {
    background: #e5e5e5;
    font-weight: 600;
  }

  &:hover {
    background: #f0f0f0;
    transform: translateX(4px);
  }

  svg {
    font-size: 1.2rem;
  }
`;

export default function MainNav() {
  return (
    <NavSection>
      <NavList>
        <li>
          <NavButton to="/dashboard">
            <MdDashboard /> Dashboard
          </NavButton>
        </li>
        <li>
          <NavButton to="/bookings">
            <FaBook /> Bookings
          </NavButton>
        </li>
        <li>
          <NavButton to="/users">
            <FaUsers /> Users
          </NavButton>
        </li>
        <li>
          <NavButton to="/cabins">
            <FaBed /> Cabins
          </NavButton>
        </li>
        <li>
          <NavButton to="/settings">
            <FaCog /> Settings
          </NavButton>
        </li>
      </NavList>
    </NavSection>
  );
}
