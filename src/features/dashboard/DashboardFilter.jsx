import React from "react";
import styled from "styled-components";
import { FaCalendarWeek, FaCalendarAlt, FaCalendar } from "react-icons/fa"; // react-icons

// Styled components with improved CSS
const FilterContainer = styled.div`
  display: flex;
  gap: 0.75rem; /* Reduced gap for tighter layout */
  flex-wrap: wrap;
  padding: 0.75rem;
  background: #f8fafc; /* Subtle background for contrast */
  border-radius: 10px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  justify-content: center; /* Center buttons for better alignment */

  @media (max-width: 768px) {
    gap: 0.5rem;
    padding: 0.5rem;
  }
`;

const Button = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem; /* space between icon & text */
  padding: 0.6rem 1.2rem;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  background: ${(props) => (props.active ? "#4F46E5" : "#ffffff")};
  color: ${(props) => (props.active ? "#ffffff" : "#374151")};
  font-weight: 500;
  font-size: 0.95rem;
  transition: all 0.2s ease;
  box-shadow: ${(props) =>
    props.active
      ? "0 2px 6px rgba(0, 0, 0, 0.1)"
      : "0 1px 4px rgba(0, 0, 0, 0.06)"};

  &:hover {
    background: ${(props) => (props.active ? "#4338ca" : "#f1f5f9")};
    transform: translateY(-1px);
  }

  &:focus {
    outline: none;
    box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.3);
  }

  @media (max-width: 768px) {
    padding: 0.5rem 1rem;
    font-size: 0.9rem;
  }
`;

const options = [
  { key: "week", label: "Week", icon: <FaCalendarWeek /> },
  { key: "month", label: "Month", icon: <FaCalendarAlt /> },
  { key: "year", label: "Year", icon: <FaCalendar /> },
];

export default function DashboardFilter({ filter, setFilter }) {
  const handleFilterChange = (option) => {
    setFilter(option);
  };

  return (
    <FilterContainer>
      {options.map(({ key, label, icon }) => (
        <Button
          key={key}
          active={filter === key}
          onClick={() => handleFilterChange(key)}
          aria-pressed={filter === key}
          aria-label={`Filter by ${label}`}
        >
          {icon}
          {label}
        </Button>
      ))}
    </FilterContainer>
  );
}
