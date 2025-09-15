import React, { useEffect, useState } from "react";
import styled from "styled-components";
import supabase from "../../services/supabaseClient";
import {
  startOfDay,
  endOfDay,
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
  startOfYear,
  endOfYear,
} from "date-fns";
import { FaBed, FaUsers, FaDollarSign, FaCalendarCheck } from "react-icons/fa"; // 👈 Icons

// Styled Components
const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 16px;
  max-width: 1200px;
  margin: 0 auto;
  padding: 16px;

  @media (min-width: 640px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (min-width: 1024px) {
    grid-template-columns: repeat(4, 1fr);
  }
`;

const StatCard = styled.div`
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  color: #ffffff;
  padding: 24px;
  border-radius: 12px;
  text-align: center;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
  display: flex;
  flex-direction: column;
  justify-content: center;
  min-height: 140px;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 6px 16px rgba(0, 0, 0, 0.15);
  }
`;

const IconWrapper = styled.div`
  font-size: 2rem;
  margin-bottom: 12px;
  display: flex;
  justify-content: center;
`;

const CardTitle = styled.h4`
  font-size: 0.875rem;
  font-weight: 500;
  color: #e6f4f1;
  margin-bottom: 8px;
  text-transform: uppercase;
  letter-spacing: 0.05em;
`;

const CardValue = styled.p`
  font-size: 1.5rem;
  font-weight: 700;
  color: #ffffff;
  margin: 0;
`;

// Constants
const STATS_CONFIG = [
  { key: "totalBookings", label: "Total Bookings", icon: <FaBed /> },
  { key: "totalGuests", label: "Total Guests", icon: <FaUsers /> },
  {
    key: "totalRevenue",
    label: "Total Revenue",
    icon: <FaDollarSign />,
    format: (value) => `$${value.toFixed(2)}`,
  },
  {
    key: "activeBookings",
    label: "Active Bookings",
    icon: <FaCalendarCheck />,
  },
];

export default function Stat({ filter }) {
  const [stats, setStats] = useState({
    totalBookings: 0,
    totalGuests: 0,
    totalRevenue: 0,
    activeBookings: 0,
  });

  const fetchStats = async () => {
    try {
      const { data: bookings, error } = await supabase
        .from("bookings")
        .select("*");
      if (error) throw error;

      let filtered = bookings || [];
      const now = new Date();

      if (filter === "today") {
        const start = startOfDay(now);
        const end = endOfDay(now);
        filtered = filtered.filter(
          (b) => new Date(b.startDate) >= start && new Date(b.startDate) <= end
        );
      } else if (filter === "week") {
        const start = startOfWeek(now, { weekStartsOn: 0 });
        const end = endOfWeek(now, { weekStartsOn: 0 });
        filtered = filtered.filter(
          (b) => new Date(b.startDate) >= start && new Date(b.startDate) <= end
        );
      } else if (filter === "month") {
        const start = startOfMonth(now);
        const end = endOfMonth(now);
        filtered = filtered.filter(
          (b) => new Date(b.startDate) >= start && new Date(b.startDate) <= end
        );
      } else if (filter === "year") {
        const start = startOfYear(now);
        const end = endOfYear(now);
        filtered = filtered.filter(
          (b) => new Date(b.startDate) >= start && new Date(b.startDate) <= end
        );
      }

      const totalRevenue = filtered.reduce(
        (a, b) => a + (Number(b.totalPrice) || 0),
        0
      );

      const activeBookings = filtered.filter(
        (b) => b.status === "checkedin"
      ).length;

      setStats({
        totalBookings: filtered.length,
        totalGuests: filtered.reduce(
          (a, b) => a + (Number(b.numGuests) || 0),
          0
        ),
        totalRevenue,
        activeBookings,
      });
    } catch (error) {
      console.error("Error fetching stats:", error);
    }
  };

  useEffect(() => {
    fetchStats();
    const interval = setInterval(fetchStats, 10000);
    return () => clearInterval(interval);
  }, [filter]);

  const formatValue = (key, value) => {
    const config = STATS_CONFIG.find((item) => item.key === key);
    if (!value && value !== 0) return "-";
    return config.format ? config.format(value) : value;
  };

  return (
    <StatsGrid>
      {STATS_CONFIG.map(({ key, label, icon }) => (
        <StatCard key={key}>
          <IconWrapper>{icon}</IconWrapper>
          <CardTitle>{label}</CardTitle>
          <CardValue>{formatValue(key, stats[key])}</CardValue>
        </StatCard>
      ))}
    </StatsGrid>
  );
}
