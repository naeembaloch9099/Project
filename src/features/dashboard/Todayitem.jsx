import React, { useEffect, useState } from "react";
import styled from "styled-components";
import supabase from "../../services/supabaseClient";
import { FaCalendarCheck, FaUsers, FaDollarSign } from "react-icons/fa";

// Styled Components
const StatsContainer = styled.div`
  background: linear-gradient(135deg, #f87171 0%, #ef4444 100%);
  color: #ffffff;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
  text-align: center;
  max-width: 400px;
  margin: 16px auto;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 6px 16px rgba(0, 0, 0, 0.15);
  }
`;

const StatsTitle = styled.h4`
  font-size: 1.25rem;
  font-weight: 600;
  color: #ffffff;
  margin: 0 0 16px 0;
  letter-spacing: -0.025em;
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
  align-items: center;

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
    gap: 12px;
  }
`;

const StatItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
`;

const StatIcon = styled.div`
  font-size: 2rem;
  color: #ffffff;
`;

const StatLabel = styled.span`
  font-size: 0.875rem;
  font-weight: 500;
  color: #f3f4f6;
  text-transform: uppercase;
  letter-spacing: 0.05em;
`;

const StatValue = styled.span`
  font-size: 1.5rem;
  font-weight: 700;
  color: #ffffff;
`;

// Constants
const STATS_CONFIG = [
  { key: "bookings", label: "Bookings", icon: <FaCalendarCheck /> },
  { key: "guests", label: "Guests", icon: <FaUsers /> },
  {
    key: "revenue",
    label: "Revenue",
    icon: <FaDollarSign />,
    format: (value) => `$${value.toFixed(2)}`,
  },
];

export default function TodayItem({ filter }) {
  const [todayStats, setTodayStats] = useState({
    bookings: 0,
    guests: 0,
    revenue: 0,
  });

  // Data fetching logic
  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data: bookings, error } = await supabase
          .from("bookings")
          .select("*");
        if (error) throw error;

        const start = new Date();
        start.setHours(0, 0, 0, 0);
        const todayBookings = (bookings || []).filter(
          (b) => new Date(b.created_at) >= start
        );

        const guestsCount = todayBookings.reduce(
          (a, b) => a + (Number(b.numGuests) || 0),
          0
        );
        const revenue = todayBookings.reduce(
          (a, b) => a + (Number(b.totalPrice) || 0),
          0
        );

        setTodayStats({
          bookings: todayBookings.length,
          guests: guestsCount,
          revenue,
        });
      } catch (error) {
        console.error("Error fetching today's stats:", error);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 5000);
    return () => clearInterval(interval);
  }, [filter]);

  // Helper to format values
  const formatValue = (key, value) => {
    const config = STATS_CONFIG.find((item) => item.key === key);
    if (!value && value !== 0) return "-";
    return config.format ? config.format(value) : value;
  };

  return (
    <StatsContainer>
      <StatsTitle>Today's Stats</StatsTitle>
      <StatsGrid>
        {STATS_CONFIG.map(({ key, label, icon }) => (
          <StatItem key={key}>
            <StatIcon>{icon}</StatIcon>
            <StatLabel>{label}</StatLabel>
            <StatValue>{formatValue(key, todayStats[key])}</StatValue>
          </StatItem>
        ))}
      </StatsGrid>
    </StatsContainer>
  );
}
