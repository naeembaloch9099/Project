import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteCabin } from "../../services/apiCabin";
import toast from "react-hot-toast";
import { FaEllipsisV, FaEdit, FaTrash } from "react-icons/fa";

const TableRow = styled.div`
  display: contents;
  & > div {
    padding: 0.5rem;
    border-bottom: 1px solid #e5e7eb;
    font-size: 0.85rem;
    color: #374151;
    text-align: center;
    background: #ffffff;
    transition: all 0.2s ease;
    white-space: nowrap;
    overflow: visible;
    text-overflow: ellipsis;
  }
  &:hover > div {
    background: #f9fafb;
  }
`;

const Cell = styled.div`
  display: flex;
  align-items: center;
  justify-content: ${(props) => props.align || "center"};
  min-width: ${(props) => props.width || "80px"};
  position: relative;
`;

const CabinImage = styled.img`
  width: 60px;
  height: 45px;
  object-fit: cover;
  border-radius: 4px;
  border: 1px solid #e5e7eb;
`;

const MenuButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  padding: 4px;
  color: #6b7280;

  &:hover {
    color: #111827;
  }
`;
const Dropdown = styled.div`
  position: absolute;
  top: 110%;
  right: 0;
  margin-top: 4px;
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  min-width: 140px;
  z-index: 9999; /* 🚀 Force on top */
  display: flex;
  flex-direction: column;
`;

const DropdownItem = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 0.6rem 0.9rem;
  font-size: 0.85rem;
  border: none;
  background: none;
  text-align: left;
  cursor: pointer;
  color: ${(props) => (props.$danger ? "#dc2626" : "#374151")};
  transition: background 0.2s;

  &:hover {
    background: ${(props) => (props.$danger ? "#fee2e2" : "#f3f4f6")};
  }
`;

export default function CabinRow({ cabin, onEdit }) {
  const {
    id: cabinId,
    image,
    name,
    maxCapacity,
    regularPrice,
    discount,
  } = cabin;

  const queryClient = useQueryClient();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef(null);

  const { isLoading: isDeleting, mutate } = useMutation({
    mutationFn: deleteCabin,
    onSuccess: () => {
      queryClient.invalidateQueries(["cabins"]);
      toast.success(`Cabin "${name}" deleted successfully`);
    },
    onError: (error) => {
      toast.error(`Failed to delete cabin: ${error.message}`);
    },
  });

  const handleDelete = () => {
    if (window.confirm(`Are you sure you want to delete cabin "${name}"?`)) {
      mutate(cabinId);
    }
  };

  // ✅ close menu when clicking outside
  useEffect(() => {
    function handleClickOutside(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setIsMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <TableRow role="row">
      <Cell width="70px">
        <CabinImage src={image} alt={name} />
      </Cell>
      <Cell width="100px">{name}</Cell>
      <Cell width="60px">{maxCapacity}</Cell>
      <Cell width="80px">${regularPrice}</Cell>
      <Cell width="60px">
        {discount ? (
          <span style={{ color: "#16a34a", fontWeight: "600" }}>
            {discount}%
          </span>
        ) : (
          <span style={{ color: "#9ca3af" }}>---</span>
        )}
      </Cell>
      <Cell width="60px" align="center">
        <div style={{ position: "relative" }} ref={menuRef}>
          <MenuButton onClick={() => setIsMenuOpen((prev) => !prev)}>
            <FaEllipsisV />
          </MenuButton>

          {isMenuOpen && (
            <Dropdown style={{ zIndex: 50 }}>
              <DropdownItem onClick={() => onEdit(cabin)}>
                <FaEdit size={12} /> Edit
              </DropdownItem>
              <DropdownItem
                onClick={handleDelete}
                disabled={isDeleting}
                $danger
              >
                <FaTrash size={12} /> {isDeleting ? "Deleting..." : "Delete"}
              </DropdownItem>
            </Dropdown>
          )}
        </div>
      </Cell>
    </TableRow>
  );
}
