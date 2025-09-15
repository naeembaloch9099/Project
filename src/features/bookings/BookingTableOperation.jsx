import React, { useState } from "react";
import styled from "styled-components";
import { FiSearch, FiFilter } from "react-icons/fi";
import { FaSort } from "react-icons/fa";

const Wrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem 1rem;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.08);
  gap: 1.2rem;
  font-family: "Inter", "Segoe UI", sans-serif;
`;

const Group = styled.div`
  display: flex;
  gap: 0.5rem;
  align-items: center;
`;

const Label = styled.label`
  display: flex;
  align-items: center;
  gap: 0.35rem;
  font-size: 0.95rem;
  font-weight: 600;
  color: #1f2937;
`;

const Select = styled.select`
  padding: 0.45rem 0.65rem;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  background: #f9fafb;
  font-size: 0.9rem;
  font-family: "Inter", "Segoe UI", sans-serif;
  font-weight: 500;
  color: #374151;
  cursor: pointer;

  &:hover {
    border-color: #3b82f6;
  }
`;

const InputWrapper = styled.div`
  display: flex;
  align-items: center;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  padding: 0.3rem 0.5rem;
  background: #f9fafb;
`;

const Input = styled.input`
  border: none;
  outline: none;
  font-size: 0.9rem;
  font-family: "Inter", "Segoe UI", sans-serif;
  font-weight: 500;
  color: #374151;
  margin-left: 0.4rem;
  width: 160px;

  &::placeholder {
    color: #9ca3af;
  }
`;

// 🎨 Status color mapping
const statusColors = {
  confirmed: "#16a34a", // green
  unconfirmed: "#f59e0b", // amber
  checkedin: "#3b82f6", // blue
  checkedout: "#6366f1", // indigo
  pending: "#eab308", // yellow
  cancelled: "#dc2626", // red
};

const StatusOption = styled.option`
  color: ${(props) => statusColors[props.value] || "#3e88ff"};
`;

export default function TableOperations({ onFilter, onSort, onSearch }) {
  const [filter, setFilter] = useState("all");
  const [sort, setSort] = useState("date-asc");
  const [search, setSearch] = useState("");

  return (
    <Wrapper>
      {/* 🔎 Search */}
      <Group>
        <Label>
          <FiSearch /> Search:
        </Label>
        <InputWrapper>
          <FiSearch size={16} color="#6b7280" />
          <Input
            type="text"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              onSearch?.(e.target.value);
            }}
            placeholder="Guest name..."
          />
        </InputWrapper>
      </Group>

      {/* 🎛 Filter */}
      <Group>
        <Label>
          <FiFilter /> Filter:
        </Label>
        <Select
          value={filter}
          onChange={(e) => {
            setFilter(e.target.value);
            onFilter?.(e.target.value);
          }}
        >
          <option value="all">All</option>
          <StatusOption value="confirmed">Confirmed</StatusOption>
          <StatusOption value="unconfirmed">Unconfirmed</StatusOption>
          <StatusOption value="checkedin">Checked In</StatusOption>
          <StatusOption value="checkedout">Checked Out</StatusOption>
          <StatusOption value="pending">Pending</StatusOption>
          <StatusOption value="cancelled">Cancelled</StatusOption>
        </Select>
      </Group>

      {/* ↕️ Sort */}
      <Group>
        <Label>
          <FaSort /> Sort by:
        </Label>
        <Select
          value={sort}
          onChange={(e) => {
            setSort(e.target.value);
            onSort?.(e.target.value);
          }}
        >
          <option value="all">All</option>
          <option value="date-asc">Date (Earliest → Latest)</option>
          <option value="date-desc">Date (Latest → Earliest)</option>
          <option value="amount-asc">Amount (Low → High)</option>
          <option value="amount-desc">Amount (High → Low)</option>
        </Select>
      </Group>
    </Wrapper>
  );
}
