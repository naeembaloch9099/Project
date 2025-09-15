import React, { useEffect, useState } from "react";
import styled from "styled-components";
import supabase from "../../services/supabaseClient";
import { FaCalendarAlt, FaUsers, FaUtensils } from "react-icons/fa";
import { HiOutlineCalendar } from "react-icons/hi";

// Styled Components
const SettingsGrid = styled.div`
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

const SettingsCard = styled.div`
  background: linear-gradient(135deg, #facc15 0%, #fbbf24 100%);
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
  color: #1f2937;
  margin-bottom: 12px;
`;

const CardTitle = styled.h4`
  font-size: 0.875rem;
  font-weight: 500;
  color: #1f2937;
  margin-bottom: 6px;
  text-transform: uppercase;
  letter-spacing: 0.05em;
`;

const CardValue = styled.p`
  font-size: 1.5rem;
  font-weight: 700;
  color: #111827;
  margin: 0;
`;

// Constants
const SETTINGS_CONFIG = [
  {
    key: "minBookingLength",
    label: "Min Booking Length",
    icon: <FaCalendarAlt />,
  },
  {
    key: "maxBookingLength",
    label: "Max Booking Length",
    icon: <HiOutlineCalendar />,
  },
  {
    key: "maxGuestsPerBooking",
    label: "Max Guests",
    icon: <FaUsers />,
  },
  {
    key: "breakfastPrice",
    label: "Breakfast Price",
    icon: <FaUtensils />,
  },
];

// Component
export default function SettingsCards() {
  const [settings, setSettings] = useState({});

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const { data, error } = await supabase
          .from("settings")
          .select("*")
          .limit(1)
          .single();
        if (error) throw error;
        setSettings(data || {});
      } catch (error) {
        console.error("Error fetching settings:", error);
      }
    };
    fetchSettings();
  }, []);

  const formatValue = (key, value) => {
    if (!value) return "-";
    return key === "breakfastPrice" ? `$${value}` : value;
  };

  return (
    <SettingsGrid>
      {SETTINGS_CONFIG.map(({ key, label, icon }) => (
        <SettingsCard key={key}>
          <IconWrapper>{icon}</IconWrapper>
          <CardTitle>{label}</CardTitle>
          <CardValue>{formatValue(key, settings[key])}</CardValue>
        </SettingsCard>
      ))}
    </SettingsGrid>
  );
}
