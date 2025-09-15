// src/ui/Spinner.jsx
import React from "react";
import styled, { keyframes } from "styled-components";
import { FaReact } from "react-icons/fa";
import { FiLoader } from "react-icons/fi";
import { AiOutlineCloud } from "react-icons/ai";

// Animations
const rotate = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

const pulse = keyframes`
  0%, 100% { transform: scale(1); opacity: 0.7; }
  50% { transform: scale(1.2); opacity: 1; }
`;

const shimmer = keyframes`
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
`;

// Wrapper
const SpinnerWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 220px;
  gap: 1.5rem;
`;

// Orbit container
const Orbit = styled.div`
  position: relative;
  width: 110px;
  height: 110px;
  border-radius: 50%;
  animation: ${rotate} 7s linear infinite;
`;

// Orbiting icons
const OrbitIcon = styled.div`
  position: absolute;
  font-size: 1.7rem;
  color: ${(props) => props.color};
  animation: ${pulse} 2.5s infinite ease-in-out;
  animation-delay: ${(props) => props.delay || "0s"};

  &:nth-child(1) {
    top: -10px;
    left: 50%;
    transform: translateX(-50%);
  }
  &:nth-child(2) {
    right: -10px;
    top: 50%;
    transform: translateY(-50%);
  }
  &:nth-child(3) {
    bottom: -10px;
    left: 50%;
    transform: translateX(-50%);
  }
`;

// Center glowing icon
const CenterIcon = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 2.7rem;
  color: #61dafb;
  animation: ${pulse} 3s infinite ease-in-out;
  filter: drop-shadow(0 0 12px rgba(97, 218, 251, 0.9));
`;

// Loading text
const LoadingText = styled.div`
  font-size: 1.15rem;
  font-weight: 600;
  text-transform: uppercase;
  background: linear-gradient(
    90deg,
    #6366f1,
    #22d3ee,
    #10b981,
    #f59e0b,
    #f472b6,
    #6366f1
  );
  background-size: 200% auto;
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  animation: ${shimmer} 3s linear infinite;
  letter-spacing: 1.5px;
`;

export default function Spinner() {
  return (
    <SpinnerWrapper>
      <Orbit>
        <CenterIcon>
          <FaReact />
        </CenterIcon>
        <OrbitIcon color="#22d3ee" delay="0s">
          <FiLoader />
        </OrbitIcon>
        <OrbitIcon color="#10b981" delay="0.4s">
          <AiOutlineCloud />
        </OrbitIcon>
        <OrbitIcon color="#f59e0b" delay="0.8s">
          <FiLoader />
        </OrbitIcon>
      </Orbit>
      <LoadingText>Loading...</LoadingText>
    </SpinnerWrapper>
  );
}
