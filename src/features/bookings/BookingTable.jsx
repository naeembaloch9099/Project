import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getBookings } from "../../services/apiBooking";
import Spinner from "../../ui/Spinner";
import BookingRow from "./BookingRow";
import styled from "styled-components";
import Pagination from "../../ui/Pagination";

const Container = styled.div`
  max-width: 1200px;
  margin: 2rem auto;
`;

const Table = styled.div`
  display: grid;
  grid-template-rows: auto;
  width: 100%;
  background: #fff;
  border-radius: 12px;
  overflow: hidden;
  border: 1px solid #e5e7eb;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
`;

const TableHeader = styled.div`
  display: grid;
  grid-template-columns: 100px 1.8fr 1.9fr 1fr 0.7fr 60px;

  & > div {
    padding: 1rem 0.75rem;
    font-weight: 600;
    text-transform: uppercase;
    font-size: 1rem;
    background: #f9fafb;
    color: #4b5563;
    border-bottom: 2px solid #e5e7eb;
    letter-spacing: 0.5px;
    text-align: left;
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  & > div:last-child {
    text-align: right;
    justify-content: flex-end;
  }
`;

const TableFooter = styled.div`
  padding: 1rem;
  background: #f9fafb;
  border-top: 2px solid #e5e7eb;
  display: flex;
  justify-content: center;
`;

const PAGE_SIZE = 10;

export default function BookingsTable({ filter, sort, search }) {
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = PAGE_SIZE;

  const { isLoading, data, error } = useQuery({
    queryKey: ["bookings", filter, sort, search, currentPage, pageSize],
    queryFn: () =>
      getBookings({
        filter,
        sortBy: sort,
        search,

        page: currentPage,
        pageSize,
      }),
    keepPreviousData: true,
  });

  // Expect getBookings to return { data: bookings, count: totalCount }
  const bookings = data?.data || [];
  const totalCount = data?.count || 0;

  if (isLoading) {
    return (
      <div
        style={{ display: "flex", justifyContent: "center", marginTop: "2rem" }}
      >
        <Spinner />
      </div>
    );
  }

  if (error) return <p>Something went wrong loading bookings...</p>;

  return (
    <Container>
      <Table>
        <TableHeader>
          <div>Cabin</div>
          <div>Guest</div>
          <div>Dates</div>
          <div>Status</div>
          <div>Amount</div>
          <div></div>
        </TableHeader>

        {bookings.map((booking) => (
          <BookingRow key={booking.id} booking={booking} />
        ))}

        <TableFooter>
          <Pagination
            count={totalCount}
            page={currentPage}
            pageSize={pageSize}
            onPageChange={setCurrentPage}
          />
        </TableFooter>
      </Table>
    </Container>
  );
}
