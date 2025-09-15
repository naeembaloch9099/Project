import React, { useEffect, useState } from "react";
import styled from "styled-components";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Line,
  ResponsiveContainer,
} from "recharts";
import { FaRegClock } from "react-icons/fa"; // ⏰ Import an icon
import supabase from "../../services/supabaseClient";

// Styled container
const Container = styled.div`
  background: #ffffff;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.08);
  height: 420px;
  display: flex;
  flex-direction: column;
  transition: transform 0.2s ease, box-shadow 0.2s ease;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.12);
  }

  @media (max-width: 768px) {
    height: 360px;
    padding: 1rem;
  }
`;

const Title = styled.h3`
  margin: 0 0 1.5rem;
  font-weight: 600;
  font-size: 1.25rem;
  color: #1f2937;
  letter-spacing: 0.02em;
  display: flex;
  align-items: center;
  gap: 0.5rem;

  @media (max-width: 768px) {
    font-size: 1.1rem;
  }

  svg {
    color: #34d399; /* Green to match bar color */
    font-size: 1.4rem;
  }
`;

export default function DurationChart({ filter }) {
  const [data, setData] = useState([]);

  useEffect(() => {
    let mounted = true;

    async function fetchData() {
      try {
        let query = supabase
          .from("bookings")
          .select("startDate, endDate, numNights");

        // Apply filter
        const now = new Date();
        if (filter === "today") {
          const startOfDay = new Date(now.setHours(0, 0, 0, 0)).toISOString();
          query = query.gte("startDate", startOfDay);
        } else if (filter === "week") {
          const startOfWeek = new Date(
            now.setDate(now.getDate() - now.getDay())
          ).toISOString();
          query = query.gte("startDate", startOfWeek);
        } else if (filter === "month") {
          const startOfMonth = new Date(
            now.getFullYear(),
            now.getMonth(),
            1
          ).toISOString();
          query = query.gte("startDate", startOfMonth);
        } else if (filter === "year") {
          const startOfYear = new Date(now.getFullYear(), 0, 1).toISOString();
          query = query.gte("startDate", startOfYear);
        }

        const { data: bookings, error } = await query;
        if (error) {
          console.error("Error fetching bookings:", error);
          return;
        }

        // Group by weekday
        const grouped = {};
        (bookings || []).forEach((booking) => {
          const startDate = new Date(booking.startDate);
          if (isNaN(startDate)) return;

          const day = startDate.toLocaleString("default", {
            weekday: "short",
          });

          const nights =
            Number(booking.numNights) ||
            (new Date(booking.endDate) - startDate) / (1000 * 60 * 60 * 24);

          if (!isNaN(nights)) {
            grouped[day] = grouped[day] || [];
            grouped[day].push(nights);
          }
        });

        const order = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
        const chartData = order.map((day) => {
          const arr = grouped[day] || [];
          const avg = arr.length
            ? arr.reduce((sum, n) => sum + n, 0) / arr.length
            : 0;
          return { day, avgNights: Number(avg.toFixed(2)) };
        });

        if (mounted) setData(chartData);
      } catch (err) {
        console.error("Unexpected error:", err);
      }
    }

    fetchData();
    const interval = setInterval(fetchData, 5000);

    return () => {
      mounted = false;
      clearInterval(interval);
    };
  }, [filter]);

  return (
    <Container role="region" aria-label="Average Stay Duration Chart">
      <Title>
        <FaRegClock /> Average Stay Duration by Weekday
      </Title>
      <ResponsiveContainer width="100%" height="85%">
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis dataKey="day" stroke="#374151" fontSize={12} />
          <YAxis stroke="#374151" fontSize={12} />
          <Tooltip
            contentStyle={{
              background: "#ffffff",
              borderRadius: "8px",
              boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
              border: "none",
              fontSize: "0.9rem",
            }}
            formatter={(value) => [`${value} nights`, "Avg Stay"]}
            labelStyle={{ color: "#1f2937" }}
          />
          <Bar
            dataKey="avgNights"
            fill="#34D399"
            radius={[4, 4, 0, 0]}
            barSize={30}
          />
          <Line
            type="monotone"
            dataKey="avgNights"
            stroke="#EF4444"
            strokeWidth={2}
            strokeDasharray="5 5"
            dot={false}
          />
        </BarChart>
      </ResponsiveContainer>
    </Container>
  );
}
