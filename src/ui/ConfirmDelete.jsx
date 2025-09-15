// src/components/ConfirmDelete.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import styled from "styled-components";
import toast from "react-hot-toast";
import { getBookingById, deleteBooking } from "../services/apiBooking";

const Container = styled.div`
  max-width: 600px;
  margin: 3rem auto;
  padding: 2rem;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
`;

const Title = styled.h2`
  font-size: 1.5rem;
  margin-bottom: 1rem;
`;

const Details = styled.div`
  margin-bottom: 2rem;

  p {
    margin: 0.5rem 0;
  }

  strong {
    color: #374151;
  }
`;

const Button = styled.button`
  padding: 0.7rem 1.4rem;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  color: #fff;
  background: #ef4444;

  &:hover {
    background: #dc2626;
  }

  &:disabled {
    background: #d1d5db;
    cursor: not-allowed;
  }
`;

export default function ConfirmDelete() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function fetchBooking() {
      try {
        const data = await getBookingById(id);
        setBooking(data);
      } catch {
        toast.error("Failed to load booking");
        navigate("/bookings");
      }
    }
    fetchBooking();
  }, [id, navigate]);

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this booking?"))
      return;

    try {
      setLoading(true);
      await deleteBooking(id);
      toast.success(
        `Successfully deleted booking ${booking.guests?.fullName} (ID: ${booking.id}, Cabin ID: ${booking.cabinId})`
      );
      navigate("/bookings");
    } catch (err) {
      toast.error("Failed to delete booking");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (!booking) return <p>Loading booking details...</p>;

  return (
    <Container>
      <Title>Confirm Delete Booking #{booking.id}</Title>

      <Details>
        <p>
          <strong>Status:</strong> {booking.status}
        </p>
        <p>
          <strong>Guest:</strong> {booking.guests?.fullName} (
          {booking.guests?.email})
        </p>
        <p>
          <strong>Cabin:</strong> {booking.cabins?.name} (ID: {booking.cabinId})
        </p>
        <p>
          <strong>Dates:</strong> {new Date(booking.startDate).toDateString()} –{" "}
          {new Date(booking.endDate).toDateString()}
        </p>
        <p>
          <strong>Nights:</strong> {booking.numNights}
        </p>
        <p>
          <strong>Total Price:</strong> ${booking.totalPrice}
        </p>
      </Details>

      <Button onClick={handleDelete} disabled={loading}>
        {loading ? "Deleting..." : "Delete Booking"}
      </Button>
    </Container>
  );
}
