import React from "react";
import styled, { keyframes } from "styled-components";
import DashboardLayout from "../features/dashboard/DashboardLayout";

// 🎨 Theme Colors
const COLORS = {
  background: "#f9fbff",
  text: "#1f2937",
  accent: "#2563eb",
  accentGradient: "linear-gradient(90deg, #2563eb, #3b82f6, #60a5fa)",
};

// ✨ Fade-in Animation
const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

// 📌 Page Wrapper
const DashboardPage = styled.div`
  max-width: 1440px;
  margin: 2.5rem auto;
  padding: 2.5rem;
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(16px) saturate(180%);
  border-radius: 24px;
  box-shadow: 0 10px 30px rgba(37, 99, 235, 0.08);
  transition: box-shadow 0.3s ease, transform 0.2s ease;
  animation: ${fadeIn} 0.8s ease-out;

  &:hover {
    box-shadow: 0 16px 40px rgba(37, 99, 235, 0.12);
    transform: translateY(-6px);
  }

  @media (max-width: 768px) {
    margin: 1.5rem 16px;
    padding: 1.5rem;
  }
`;

// 📌 Title Styling
const DashboardTitle = styled.h1`
  font-size: 2.7rem;
  font-weight: 800;
  color: ${COLORS.text};
  text-align: center;
  margin-bottom: 2.5rem;
  letter-spacing: -0.03em;
  line-height: 1.25;
  transition: text-shadow 0.3s ease;

  span {
    background: ${COLORS.accentGradient};
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    font-weight: 900;
  }

  &:hover {
    text-shadow: 0px 4px 16px rgba(37, 99, 235, 0.25);
  }

  @media (max-width: 768px) {
    font-size: 2rem;
    margin-bottom: 1.8rem;
  }
`;

// 📌 Small Subtitle
const Subtitle = styled.p`
  font-size: 1.15rem;
  text-align: center;
  color: #4b5563;
  margin-bottom: 2.5rem;
  max-width: 720px;
  margin-left: auto;
  margin-right: auto;
  line-height: 1.7;
  animation: ${fadeIn} 1.1s ease-out;
`;

// ✅ Main Component
export default function Dashboard() {
  return (
    <DashboardPage>
      <DashboardTitle>
        Welcome to <span>Dashboard</span>
      </DashboardTitle>
      <Subtitle>
        Track your <strong>bookings</strong>, <strong>guests</strong>,{" "}
        <strong>revenue</strong>, and more — all in one place.
      </Subtitle>
      <DashboardLayout />
    </DashboardPage>
  );
}
