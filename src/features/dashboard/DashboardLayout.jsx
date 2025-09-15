import React, { useState } from "react";
import styled from "styled-components";
import DashboardFilter from "./DashboardFilter";
import SalesChart from "./SalesChart";
import DurationChart from "./DurationChart";
import DashboardBox from "./DashboardBox";
import BookingStatusChart from "./BookingStatusChart";
import GuestStatsChart from "./GuestStatusChart";
import SettingsCards from "./SettingCard";
import Stat from "./stat";
import TodayItem from "./Todayitem";

// 🎨 Colors
const COLORS = {
  background: "#f1f5f9",
  text: "#1f2937",
};

const LayoutContainer = styled.div`
  padding: 3rem 2rem;
  display: flex;
  flex-direction: column;
  gap: 3rem;
  background: linear-gradient(135deg, #f9fbff, #eef1f7);
  min-height: 100vh;
  max-width: 1440px;
  margin: 0 auto;
  border-radius: 18px;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.06);

  @media (max-width: 768px) {
    padding: 1.5rem;
    gap: 2rem;
  }
`;

/* 📊 Stats Grid now includes TodayItem */
/* 📊 Stats Grid (make stat cards wider, filling page width) */
const StatGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(
    auto-fit,
    minmax(380px, 1fr)
  ); /* ⬅️ was 320px */
  gap: 2rem;

  @media (max-width: 1024px) {
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  }

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

/* 📊 Chart Grid */
const ChartsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(380px, 1fr));
  gap: 2.5rem;
  align-items: stretch;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }
`;

/* 📌 Section Title */
const SectionTitle = styled.h2`
  font-size: 1.6rem;
  font-weight: 600;
  color: ${COLORS.text};
  margin-bottom: 1rem;
  letter-spacing: 0.02em;

  @media (max-width: 768px) {
    font-size: 1.3rem;
  }
`;

/* 🪄 Card Wrapper with 3D effect */
const CardWrapper = styled.div`
  background: linear-gradient(145deg, #ffffff, #e6e9f0);
  border-radius: 20px;
  padding: 1.8rem;
  min-height: 220px;
  box-shadow: 8px 8px 16px rgba(0, 0, 0, 0.12),
    -6px -6px 12px rgba(255, 255, 255, 0.7);
  display: flex;
  flex-direction: column;
  justify-content: center;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-8px) scale(1.02);
    box-shadow: 12px 12px 24px rgba(0, 0, 0, 0.15),
      -8px -8px 16px rgba(255, 255, 255, 0.8);
  }
`;

/* 📌 Today Item wrapper (fits in grid like others) */
const TodayWrapper = styled(CardWrapper)`
  overflow-x: auto;
  white-space: nowrap;
`;

export default function DashboardLayout() {
  const [filter, setFilter] = useState("month");

  return (
    <LayoutContainer role="main" aria-label="Dashboard Layout">
      {/* Settings Overview */}
      <section aria-labelledby="settings-title">
        <SectionTitle id="settings-title">Settings Overview</SectionTitle>
        <SettingsCards />
      </section>

      {/* Filter */}
      <section aria-labelledby="filter-title">
        <SectionTitle id="filter-title">Filter Options</SectionTitle>
        <DashboardFilter filter={filter} setFilter={setFilter} />
      </section>

      {/* Stats + Today summary */}
      <section aria-labelledby="stats-title">
        <SectionTitle id="stats-title">Statistics & Summary</SectionTitle>
        <StatGrid>
          <CardWrapper>
            <Stat filter={filter} />
          </CardWrapper>
          <TodayWrapper>
            <TodayItem filter={filter} />
          </TodayWrapper>
        </StatGrid>
      </section>

      {/* Charts */}
      <section aria-labelledby="charts-title">
        <SectionTitle id="charts-title">Data Visualizations</SectionTitle>
        <ChartsGrid>
          <CardWrapper>
            <DashboardBox filter={filter} />
          </CardWrapper>
          <CardWrapper>
            <SalesChart filter={filter} />
          </CardWrapper>
          <CardWrapper>
            <DurationChart filter={filter} />
          </CardWrapper>
          <CardWrapper>
            <BookingStatusChart filter={filter} />
          </CardWrapper>
          <CardWrapper>
            <GuestStatsChart filter={filter} />
          </CardWrapper>
        </ChartsGrid>
      </section>
    </LayoutContainer>
  );
}
