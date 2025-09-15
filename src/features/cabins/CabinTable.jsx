import React from "react";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";
import styled from "styled-components";
import { getCabins } from "../../services/apiCabin";
import CabinRow from "./CabinRow";
import Spinner from "../../ui/Spinner";
import {
  FaImage,
  FaUser,
  FaBed,
  FaDollarSign,
  FaPercentage,
  FaEdit,
} from "react-icons/fa";

const Container = styled.div`
  max-width: 1200px;
  margin: 2rem auto;
`;

const Table = styled.div`
  display: grid;
  grid-template-columns: 100px 1.5fr 1fr 1fr 1fr 1.5fr;
  width: 100%;
  background: #ffffff;
  border-radius: 12px;
  overflow: visible;
  border: 1px solid #e5e7eb;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
`;

const TableHeader = styled.div`
  display: contents;
  & > div {
    padding: 1rem 0.5rem;
    font-weight: 600;
    text-transform: uppercase;
    font-size: 0.85rem;
    background: #f9fafb;
    color: #4b5563;
    border-bottom: 2px solid #e5e7eb;
    letter-spacing: 0.5px;
    text-align: center;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.3rem;
  }
  & > div:nth-child(3),
  & > div:nth-child(4),
  & > div:nth-child(5) {
    justify-content: flex-end;
  }
`;

export default function CabinTable({ onEdit }) {
  const [searchParams] = useSearchParams();
  const filterValue = searchParams.get("discount") || "all";
  const sortBy = searchParams.get("sortBy") || "name-asc";

  const {
    isLoading,
    isFetching,
    data: cabins,
    error,
  } = useQuery({
    queryKey: ["cabins"],
    queryFn: getCabins,
  });

  if (error) return <p>Something went wrong loading cabins...</p>;

  // 🔹 Filter cabins
  let filteredCabins = cabins || [];
  if (filterValue === "discount")
    filteredCabins = filteredCabins.filter((c) => c.discount > 0);
  if (filterValue === "no-discount")
    filteredCabins = filteredCabins.filter((c) => c.discount === 0);

  // 🔹 Sort cabins
  let sortedCabins = [...filteredCabins];
  switch (sortBy) {
    case "name-asc":
      sortedCabins.sort((a, b) => a.name.localeCompare(b.name));
      break;
    case "name-desc":
      sortedCabins.sort((a, b) => b.name.localeCompare(a.name));
      break;
    case "regularPrice-asc":
      sortedCabins.sort((a, b) => a.regularPrice - b.regularPrice);
      break;
    case "regularPrice-desc":
      sortedCabins.sort((a, b) => b.regularPrice - a.regularPrice);
      break;
    case "capacity-asc":
      sortedCabins.sort((a, b) => a.maxCapacity - b.maxCapacity);
      break;
    case "capacity-desc":
      sortedCabins.sort((a, b) => b.maxCapacity - a.maxCapacity);
      break;
    default:
      break;
  }

  return (
    <Container>
      {isLoading || isFetching ? (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            minHeight: "200px",
          }}
        >
          <Spinner />
        </div>
      ) : (
        <Table role="table">
          <TableHeader role="row">
            <div>
              <FaImage /> Image
            </div>
            <div>
              <FaUser /> Name
            </div>
            <div>
              <FaBed /> Capacity
            </div>
            <div>
              <FaDollarSign /> Price
            </div>
            <div>
              <FaPercentage /> Discount
            </div>
            <div>
              <FaEdit /> Actions
            </div>
          </TableHeader>

          {sortedCabins.map((cabin) => (
            <CabinRow key={cabin.id} cabin={cabin} onEdit={onEdit} />
          ))}
        </Table>
      )}
    </Container>
  );
}
