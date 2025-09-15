// src/pages/CheckOut.jsx
import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import styled from "styled-components";
import toast from "react-hot-toast";
import Spinner from "../ui/Spinner";
import { getBookingById, checkOutBooking } from "../services/apiBooking";

// ---------- Styled ----------
const Container = styled.div`
  max-width: 800px;
  margin: 2rem auto;
  padding: 2rem;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
`;

const Title = styled.h2`
  font-size: 1.8rem;
  font-weight: 700;
  margin-bottom: 1.5rem;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 2rem;

  th,
  td {
    border: 1px solid #e5e7eb;
    padding: 0.75rem;
    text-align: left;
  }

  th {
    background: #f3f4f6;
    font-weight: 600;
  }
`;

const Button = styled.button`
  padding: 0.7rem 1.4rem;
  border: none;
  border-radius: 8px;
  background: ${(props) => (props.disabled ? "#9ca3af" : "#dc2626")};
  color: #fff;
  font-size: 1rem;
  font-weight: 600;
  cursor: ${(props) => (props.disabled ? "not-allowed" : "pointer")};

  &:hover {
    background: ${(props) => (props.disabled ? "#9ca3af" : "#b91c1c")};
  }
`;

// ---------- Component ----------
export default function CheckOut() {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // Fetch booking
  const {
    data: booking,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["booking", id],
    queryFn: () => getBookingById(id),
  });

  // Mutation for check-out
  const mutation = useMutation({
    mutationFn: () => checkOutBooking(id),
    onSuccess: () => {
      toast.success("Guest checked out successfully!");
      queryClient.invalidateQueries(["booking", id]);
      navigate("/bookings");
    },
    onError: () => {
      toast.error("Check-out failed");
    },
  });

  if (isLoading) return <Spinner />;
  if (error) return <p style={{ color: "red" }}>Something went wrong...</p>;
  if (!booking) return <p>No booking found.</p>;

  // Disable button if already checked out or cancelled
  const isCheckOutDisabled = ["checkedout", "cancelled"].includes(
    booking.status.toLowerCase()
  );

  return (
    <Container>
      <Title>Check-Out Booking #{booking.id}</Title>

      <Table>
        <tbody>
          <tr>
            <th>Status</th>
            <td>{booking.status}</td>
          </tr>
          <tr>
            <th>Guest</th>
            <td>
              {booking.guests?.fullName} ({booking.guests?.email})<br />
              National ID: {booking.guests?.nationalID} |{" "}
              {booking.guests?.nationality} {booking.guests?.countryFlag}
            </td>
          </tr>
          <tr>
            <th>Cabin</th>
            <td>
              {booking.cabins?.name} (Capacity: {booking.cabins?.maxCapacity})
            </td>
          </tr>
          <tr>
            <th>Dates</th>
            <td>
              {new Date(booking.startDate).toDateString()} –{" "}
              {new Date(booking.endDate).toDateString()} ({booking.numNights}{" "}
              nights)
            </td>
          </tr>
          <tr>
            <th>Total Price</th>
            <td>${booking.totalPrice}</td>
          </tr>
          <tr>
            <th>Payment Status</th>
            <td>{booking.isPaid ? "Paid" : "Not Paid"}</td>
          </tr>
        </tbody>
      </Table>

      <Button
        disabled={isCheckOutDisabled || mutation.isLoading}
        onClick={() => mutation.mutate()}
      >
        {isCheckOutDisabled
          ? "Cannot Check-Out"
          : mutation.isLoading
          ? "Checking Out..."
          : "Check-Out Guest"}
      </Button>
    </Container>
  );
}
