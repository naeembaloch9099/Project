import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import {
  FaHotel,
  FaCheckCircle,
  FaSignOutAlt,
  FaCalendarCheck,
  FaCalendarTimes,
  FaHourglassHalf,
} from "react-icons/fa";
import supabase from "../../services/supabaseClient";

// Container
const Container = styled.div`
  background: #ffffff;
  border-radius: 1.25rem;
  padding: 1.5rem;
  height: 420px;
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.08);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  display: flex;
  flex-direction: column;
  justify-content: space-between;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.12);
  }

  @media (max-width: 768px) {
    height: 360px;
    padding: 1rem;
  }
`;

// Title
const Title = styled.h3`
  font-size: 1.5rem;
  font-weight: 600;
  color: #1f2937;
  margin: 0 0 1.25rem 0;
  text-align: left;
  display: flex;
  align-items: center;
  gap: 10px;
  letter-spacing: -0.025em;

  svg {
    color: #3b82f6;
    font-size: 1.6rem;
  }

  @media (max-width: 768px) {
    font-size: 1.25rem;
    margin-bottom: 1rem;
  }
`;

// Legend wrapper
const LegendWrapper = styled.div`
  margin-top: 0.5rem;
  font-size: 0.9rem;
  color: #4b5563;

  display: flex;
  flex-wrap: wrap;
  gap: 12px;

  .legend-item {
    display: flex;
    align-items: center;
    gap: 6px;
    font-weight: 500;
  }

  svg {
    font-size: 14px;
  }

  @media (max-width: 768px) {
    font-size: 0.8rem;
  }
`;

// Status config (name, color, icon)
const STATUS_CONFIG = {
  checkedin: { color: "#10B981", icon: <FaCheckCircle /> }, // green
  checkedout: { color: "#3B82F6", icon: <FaSignOutAlt /> }, // blue
  confirmed: { color: "#F59E0B", icon: <FaCalendarCheck /> }, // amber
  unconfirmed: { color: "#8B5CF6", icon: <FaHotel /> }, // purple
  cancelled: { color: "#EF4444", icon: <FaCalendarTimes /> }, // red
  pending: { color: "#6B7280", icon: <FaHourglassHalf /> }, // gray
};

const STATUSES = Object.keys(STATUS_CONFIG);

export default function BookingStatusChart() {
  const [data, setData] = useState([]);

  useEffect(() => {
    const interval = setInterval(fetchData, 5000);
    fetchData();
    return () => clearInterval(interval);

    async function fetchData() {
      const { data: bookings } = await supabase
        .from("bookings")
        .select("status");

      const grouped = {};
      STATUSES.forEach((s) => {
        grouped[s] = 0;
      });

      (bookings || []).forEach((b) => {
        const s = b.status || "unconfirmed";
        if (grouped[s] !== undefined) {
          grouped[s] += 1;
        }
      });

      setData(
        STATUSES.map((s) => ({
          name: s,
          value: grouped[s],
          color: STATUS_CONFIG[s].color,
          icon: STATUS_CONFIG[s].icon,
        }))
      );
    }
  }, []);

  // Custom Tooltip with icon + color
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const { name, value } = payload[0].payload;
      const config = STATUS_CONFIG[name];
      return (
        <div
          style={{
            background: "#ffffff",
            borderRadius: "8px",
            padding: "0.75rem",
            boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
            fontSize: "0.9rem",
            display: "flex",
            alignItems: "center",
            gap: "8px",
          }}
        >
          <span style={{ color: config.color }}>{config.icon}</span>
          <span style={{ fontWeight: "500", color: "#1f2937" }}>
            {name} — {value}
          </span>
        </div>
      );
    }
    return null;
  };

  return (
    <Container>
      <Title>
        <FaHotel /> Booking Status
      </Title>

      <ResponsiveContainer width="100%" height="75%">
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            innerRadius={70}
            outerRadius={110}
            label={({ name, percent }) =>
              `${name} (${(percent * 100).toFixed(0)}%)`
            }
            labelLine={{ stroke: "#6b7280", strokeWidth: 1 }}
            animationDuration={800}
          >
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={entry.color}
                stroke="#ffffff"
                strokeWidth={2}
              />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
        </PieChart>
      </ResponsiveContainer>

      {/* Custom Legend with Icons */}
      <LegendWrapper>
        {STATUSES.map((s) => (
          <div key={s} className="legend-item">
            <span style={{ color: STATUS_CONFIG[s].color }}>
              {STATUS_CONFIG[s].icon}
            </span>
            <span>{s}</span>
          </div>
        ))}
      </LegendWrapper>
    </Container>
  );
}
