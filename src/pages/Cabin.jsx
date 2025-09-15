import React, { useState } from "react";
import styled from "styled-components";
import CabinTable from "../features/cabins/CabinTable";
import CreateCabin from "../features/cabins/CreateCabin";
import { useQuery } from "@tanstack/react-query";
import { getCabins } from "../services/apiCabin";
import { FaPlus } from "react-icons/fa";
import Spinner from "../ui/Spinner";
import Modal from "../ui/Model";
import CabinOperations from "../features/cabins/CabinOperations";

const HeaderRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between; /* 👈 heading left, filters right */
  margin-bottom: 0.75rem; /* 👈 smaller gap before table */
`;

const Headings = styled.h1`
  font-size: 1.5rem;
  font-weight: 600;
  color: #333;
`;

const CenterRow = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Button = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: #2563eb;
  color: #fff;
  border: none;
  border-radius: 6px;
  padding: 0.6rem 1.2rem;
  font-size: 0.95rem;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.2s ease;

  &:hover {
    background: #1e40af;
  }
`;

export default function Cabins() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCabin, setSelectedCabin] = useState(null);

  const { isLoading } = useQuery({
    queryKey: ["cabins"],
    queryFn: getCabins,
  });

  const handleAdd = () => {
    setSelectedCabin(null);
    setIsModalOpen(true);
  };

  const handleEdit = (cabin) => {
    setSelectedCabin(cabin);
    setIsModalOpen(true);
  };

  return (
    <>
      {/* ✅ Heading left, Filter right */}
      <HeaderRow>
        <Headings>All Cabins</Headings>
        <CabinOperations />
      </HeaderRow>

      <CenterRow>
        {isLoading ? <Spinner /> : <CabinTable onEdit={handleEdit} />}
      </CenterRow>

      {!isLoading && (
        <CenterRow>
          <Button onClick={handleAdd}>
            <FaPlus />
            Add New Cabin
          </Button>
        </CenterRow>
      )}

      {isModalOpen && (
        <Modal onClose={() => setIsModalOpen(false)}>
          <CreateCabin
            cabin={selectedCabin}
            onClose={() => setIsModalOpen(false)}
          />
        </Modal>
      )}
    </>
  );
}
