// pages/BookingDetails.jsx
import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getBookingById } from "../services/apiBooking";
import Spinner from "../ui/Spinner";
import styled from "styled-components";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  PDFDownloadLink,
} from "@react-pdf/renderer";
import * as XLSX from "xlsx";

// ---------- Styled ----------
const Container = styled.div`
  max-width: 1000px;
  margin: 2rem auto;
  padding: 2rem;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 2rem;

  th,
  td {
    border: 1px solid #ddd;
    padding: 0.75rem;
    text-align: left;
  }

  th {
    background: #f3f4f6;
    font-weight: 600;
  }
`;

const Button = styled.button`
  margin-top: 1rem;
  padding: 0.7rem 1.4rem;
  border: none;
  border-radius: 8px;
  background: #2563eb;
  color: #fff;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;

  &:hover {
    background: #1d4ed8;
  }
`;

// ---------- PDF Styles ----------
const pdfStyles = StyleSheet.create({
  page: { padding: 30, fontSize: 12, fontFamily: "Helvetica" },
  title: {
    fontSize: 18,
    marginBottom: 15,
    textAlign: "center",
    fontWeight: "bold",
  },
  table: {
    display: "table",
    width: "auto",
    borderStyle: "solid",
    borderWidth: 1,
    marginBottom: 10,
  },
  tableRow: { flexDirection: "row" },
  tableColHeader: {
    width: "33%",
    borderStyle: "solid",
    borderWidth: 1,
    backgroundColor: "#f0f0f0",
    padding: 5,
    fontWeight: "bold",
  },
  tableCol: { width: "33%", borderStyle: "solid", borderWidth: 1, padding: 5 },
  tableCell: { fontSize: 10 },
});

// ---------- PDF Component ----------
function BookingInvoice({ booking }) {
  const paymentStatus =
    booking.status.toLowerCase() === "checkedin" && booking.isPaid
      ? "Paid"
      : "Not Paid";

  return (
    <Document>
      <Page size="A4" style={pdfStyles.page}>
        <Text style={pdfStyles.title}>Booking Invoice</Text>

        {/* Booking Info */}
        <View style={pdfStyles.table}>
          <View style={pdfStyles.tableRow}>
            <Text style={pdfStyles.tableColHeader}>Booking ID</Text>
            <Text style={pdfStyles.tableCol}>{booking.id}</Text>
          </View>
          <View style={pdfStyles.tableRow}>
            <Text style={pdfStyles.tableColHeader}>Status</Text>
            <Text style={pdfStyles.tableCol}>{booking.status}</Text>
          </View>
          <View style={pdfStyles.tableRow}>
            <Text style={pdfStyles.tableColHeader}>Payment</Text>
            <Text style={pdfStyles.tableCol}>{paymentStatus}</Text>
          </View>
          <View style={pdfStyles.tableRow}>
            <Text style={pdfStyles.tableColHeader}>Dates</Text>
            <Text style={pdfStyles.tableCol}>
              {new Date(booking.startDate).toDateString()} –{" "}
              {new Date(booking.endDate).toDateString()} ({booking.numNights}{" "}
              nights)
            </Text>
          </View>
        </View>

        {/* Guest Info */}
        <Text style={{ marginBottom: 6, fontWeight: "bold" }}>
          Guest Details
        </Text>
        <View style={pdfStyles.table}>
          <View style={pdfStyles.tableRow}>
            <Text style={pdfStyles.tableColHeader}>Name</Text>
            <Text style={pdfStyles.tableCol}>{booking.guests?.fullName}</Text>
          </View>
          <View style={pdfStyles.tableRow}>
            <Text style={pdfStyles.tableColHeader}>Email</Text>
            <Text style={pdfStyles.tableCol}>{booking.guests?.email}</Text>
          </View>
          <View style={pdfStyles.tableRow}>
            <Text style={pdfStyles.tableColHeader}>National ID</Text>
            <Text style={pdfStyles.tableCol}>{booking.guests?.nationalID}</Text>
          </View>
          <View style={pdfStyles.tableRow}>
            <Text style={pdfStyles.tableColHeader}>Nationality</Text>
            <Text style={pdfStyles.tableCol}>
              {booking.guests?.nationality} {booking.guests?.countryFlag}
            </Text>
          </View>
        </View>

        {/* Cabin Info */}
        <Text style={{ marginBottom: 6, fontWeight: "bold" }}>
          Cabin Details
        </Text>
        <View style={pdfStyles.table}>
          <View style={pdfStyles.tableRow}>
            <Text style={pdfStyles.tableColHeader}>Cabin Name</Text>
            <Text style={pdfStyles.tableCol}>{booking.cabins?.name}</Text>
          </View>
          <View style={pdfStyles.tableRow}>
            <Text style={pdfStyles.tableColHeader}>Capacity</Text>
            <Text style={pdfStyles.tableCol}>
              {booking.cabins?.maxCapacity}
            </Text>
          </View>
          <View style={pdfStyles.tableRow}>
            <Text style={pdfStyles.tableColHeader}>Price</Text>
            <Text style={pdfStyles.tableCol}>
              ${booking.cabins?.regularPrice} (Discount:{" "}
              {booking.cabins?.discount}%)
            </Text>
          </View>
        </View>

        {/* Price Info */}
        <Text style={{ marginBottom: 6, fontWeight: "bold" }}>
          Price Details
        </Text>
        <View style={pdfStyles.table}>
          <View style={pdfStyles.tableRow}>
            <Text style={pdfStyles.tableColHeader}>Cabin Price</Text>
            <Text style={pdfStyles.tableCol}>${booking.cabinPrice}</Text>
          </View>
          <View style={pdfStyles.tableRow}>
            <Text style={pdfStyles.tableColHeader}>Extras</Text>
            <Text style={pdfStyles.tableCol}>${booking.extraPrice}</Text>
          </View>
          <View style={pdfStyles.tableRow}>
            <Text style={pdfStyles.tableColHeader}>Total</Text>
            <Text style={pdfStyles.tableCol}>${booking.totalPrice}</Text>
          </View>
        </View>
      </Page>
    </Document>
  );
}

// ---------- Excel Export ----------
function exportToExcel(booking) {
  const data = [
    ["Booking ID", booking.id],
    ["Status", booking.status],
    [
      "Payment Status",
      booking.status.toLowerCase() === "checkedin" && booking.isPaid
        ? "Paid"
        : "Not Paid",
    ],
    ["Start Date", new Date(booking.startDate).toDateString()],
    ["End Date", new Date(booking.endDate).toDateString()],
    ["Nights", booking.numNights],
    ["Guests", booking.numGuests],
    ["Guest Name", booking.guests?.fullName],
    ["Email", booking.guests?.email],
    ["National ID", booking.guests?.nationalID],
    ["Nationality", booking.guests?.nationality],
    ["Cabin", booking.cabins?.name],
    ["Capacity", booking.cabins?.maxCapacity],
    ["Cabin Price", booking.cabinPrice],
    ["Extra Price", booking.extraPrice],
    ["Total Price", booking.totalPrice],
  ];

  const wb = XLSX.utils.book_new();
  const ws = XLSX.utils.aoa_to_sheet(data);
  XLSX.utils.book_append_sheet(wb, ws, "Booking");
  XLSX.writeFile(wb, `booking-${booking.id}.xlsx`);
}

// ---------- Print Invoice ----------
function printInvoice(booking) {
  const paymentStatus =
    booking.status.toLowerCase() === "checkedin" && booking.isPaid
      ? "Paid"
      : "Not Paid";
  const printWindow = window.open("", "Print Invoice", "width=800,height=600");
  printWindow.document.write(`<html><head><title>Invoice</title></head><body>`);
  printWindow.document.write(`<h2>Booking #${booking.id} Invoice</h2>`);
  printWindow.document.write(
    `<table border="1" cellpadding="8" cellspacing="0" style="border-collapse: collapse;">`
  );
  printWindow.document.write(`
    <tr><th>Status</th><td>${booking.status}</td></tr>
    <tr><th>Payment</th><td>${paymentStatus}</td></tr>
    <tr><th>Guest</th><td>${booking.guests?.fullName} (${
    booking.guests?.email
  })</td></tr>
    <tr><th>Cabin</th><td>${booking.cabins?.name} (Capacity: ${
    booking.cabins?.maxCapacity
  })</td></tr>
    <tr><th>Dates</th><td>${new Date(
      booking.startDate
    ).toDateString()} – ${new Date(booking.endDate).toDateString()} (${
    booking.numNights
  } nights)</td></tr>
    <tr><th>Total Price</th><td>$${booking.totalPrice}</td></tr>
  `);
  printWindow.document.write(`</table>`);
  printWindow.document.write(`<script>window.print();</script>`);
  printWindow.document.write(`</body></html>`);
  printWindow.document.close();
}

// ---------- Component ----------
export default function BookingDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const {
    data: booking,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["booking", id],
    queryFn: () => getBookingById(id),
  });

  if (isLoading) return <Spinner />;
  if (error) return <p style={{ color: "red" }}>Something went wrong...</p>;
  if (!booking) return <p>No booking found.</p>;

  const paymentStatus =
    booking.status.toLowerCase() === "checkedin" && booking.isPaid
      ? "Paid"
      : "Not Paid";

  return (
    <Container>
      <h2>Booking #{booking.id} Details</h2>

      <Table>
        <tbody>
          <tr>
            <th>Status</th>
            <td>{booking.status}</td>
          </tr>
          <tr>
            <th>Payment Status</th>
            <td
              style={{
                color: paymentStatus === "Paid" ? "#16a34a" : "#ef4444",
                fontWeight: "600",
              }}
            >
              {paymentStatus}
            </td>
          </tr>
          <tr>
            <th>Dates</th>
            <td>
              {new Date(booking.startDate).toDateString()} –{" "}
              {new Date(booking.endDate).toDateString()}
            </td>
          </tr>
          <tr>
            <th>Nights</th>
            <td>{booking.numNights}</td>
          </tr>
          <tr>
            <th>Guests</th>
            <td>{booking.numGuests}</td>
          </tr>
          <tr>
            <th>Guest Info</th>
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
            <th>Total Price</th>
            <td>${booking.totalPrice}</td>
          </tr>
        </tbody>
      </Table>

      {/* Action Buttons */}
      <div style={{ display: "flex", gap: "1rem" }}>
        <Button onClick={() => navigate("/bookings")}>← Back</Button>

        <PDFDownloadLink
          document={<BookingInvoice booking={booking} />}
          fileName={`booking-${booking.id}.pdf`}
        >
          {({ loading }) =>
            loading ? (
              <Button disabled>Preparing PDF...</Button>
            ) : (
              <Button>⬇ Download PDF</Button>
            )
          }
        </PDFDownloadLink>

        <Button onClick={() => exportToExcel(booking)}>⬇ Download Excel</Button>
        <Button onClick={() => printInvoice(booking)}>🖨 Print Invoice</Button>
      </div>
    </Container>
  );
}
