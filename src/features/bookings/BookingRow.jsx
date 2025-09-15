import React, { useState, useRef, useEffect } from "react";
import styled from "styled-components";
import { FaEye, FaTrash } from "react-icons/fa";
import { BsThreeDotsVertical } from "react-icons/bs";
import { useNavigate } from "react-router-dom";
import { HiArrowDownOnSquare, HiArrowUpOnSquare } from "react-icons/hi2";

const TableRow = styled.div`
  display: grid;
  grid-template-columns: 100px 1.8fr 1.9fr 1fr 0.7fr 60px;
  border-bottom: 1px solid #e5e7eb;
  min-height: 64px;
  align-items: center;
  background: #fff;
  transition: background 0.2s ease;

  &:hover {
    background: #f9fafb;
  }
`;

const Cell = styled.div`
  padding: 0.85rem 0.75rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  font-size: 0.95rem;
  font-weight: ${(props) => (props.bold ? "600" : "400")};
  color: #374151;
  text-align: ${(props) => props.align || "left"};
  white-space: nowrap;
  overflow: visible;
  text-overflow: ellipsis;

  small {
    color: #6b7280;
    font-size: 0.8rem;
  }
`;

const StatusBadge = styled.span`
  padding: 0.3rem 0.7rem;
  border-radius: 12px;
  font-size: 0.85rem;
  font-weight: 600;
  text-transform: uppercase;
  color: #fff;
  background-color: ${(props) =>
    props.status === "confirmed"
      ? "#16a34a"
      : props.status === "unconfirmed"
      ? "#3b82f6"
      : props.status === "pending"
      ? "#f59e0b"
      : props.status === "cancelled"
      ? "#ef4444"
      : props.status === "checkedin"
      ? "#2d2727"
      : props.status === "checkedout"
      ? "#52a547b6"
      : "#6b7280"};
`;

const MenuWrapper = styled.div`
  position: relative;
  display: inline-block;
`;

const MenuButton = styled.button`
  background: transparent;
  border: none;
  cursor: pointer;
  color: #4b5563;
  font-size: 1.3rem;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;

  &:hover {
    color: #2563eb;
  }
`;

const Dropdown = styled.div`
  position: absolute;
  top: 110%;
  right: 0;
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  min-width: 160px;
  z-index: 999;
  padding: 0.4rem 0;
`;

const DropdownItem = styled.button`
  width: 100%;
  background: none;
  border: none;
  padding: 0.6rem 1rem;
  display: flex;
  align-items: center;
  gap: 0.6rem;
  font-size: 0.9rem;
  color: ${(props) => (props.disabled ? "#9ca3af" : "#374151")};
  cursor: ${(props) => (props.disabled ? "not-allowed" : "pointer")};

  &:hover {
    background: ${(props) => (props.disabled ? "none" : "#f3f4f6")};
    color: ${(props) => (props.disabled ? "#9ca3af" : "#2563eb")};
  }
`;

export default function BookingRow({ booking }) {
  const { cabinId, guests, startDate, endDate, numNights, totalPrice, status } =
    booking;
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Determine if Check-In should be disabled
  const isCheckInDisabled = ["checkedin", "checkedout", "cancelled"].includes(
    status.toLowerCase()
  );

  return (
    <TableRow>
      <Cell bold>{cabinId}</Cell>

      <Cell>
        {guests?.fullName}
        <small>{guests?.email}</small>
      </Cell>

      <Cell>
        {new Date(startDate).toDateString()} –{" "}
        {new Date(endDate).toDateString()}
        <small>{numNights} night stay</small>
      </Cell>

      <Cell align="center">
        <StatusBadge status={status}>{status}</StatusBadge>
      </Cell>

      <Cell bold align="right">
        ${totalPrice.toFixed(2)}
      </Cell>

      <Cell align="center">
        <MenuWrapper ref={menuRef}>
          <MenuButton onClick={() => setMenuOpen((prev) => !prev)}>
            <BsThreeDotsVertical />
          </MenuButton>

          {menuOpen && (
            <Dropdown>
              <DropdownItem onClick={() => navigate(`/bookings/${booking.id}`)}>
                <FaEye /> See Details
              </DropdownItem>
              {status === "checkedin" && (
                <DropdownItem
                  onClick={() => navigate(`/checkout/${booking.id}`)}
                >
                  <HiArrowUpOnSquare /> Checked Out
                </DropdownItem>
              )}
              <DropdownItem
                onClick={() => navigate(`/ConfirmDelete/${booking.id}`)}
              >
                <FaTrash /> Delete Booking
              </DropdownItem>
              <DropdownItem
                disabled={isCheckInDisabled}
                onClick={() => {
                  if (!isCheckInDisabled) {
                    navigate(`/checkin/${booking.id}`);
                  }
                }}
              >
                {isCheckInDisabled ? (
                  "Cannot Check-In"
                ) : (
                  <>
                    <HiArrowDownOnSquare /> Check-In
                  </>
                )}
              </DropdownItem>
            </Dropdown>
          )}
        </MenuWrapper>
      </Cell>
    </TableRow>
  );
}
