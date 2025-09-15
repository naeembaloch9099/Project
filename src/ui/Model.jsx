// src/ui/Modal.jsx
import React, { useEffect } from "react";
import styled, { keyframes } from "styled-components";
import { FaTimes } from "react-icons/fa";

const fadeInScale = keyframes`
  from { opacity: 0; transform: translateY(-20px) scale(0.95); }
  to { opacity: 1; transform: translateY(0) scale(1); }
`;

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.55);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  backdrop-filter: blur(6px);
`;

const StyledModal = styled.div`
  background: #fff;
  border-radius: 20px;
  padding: 2rem 2.5rem;
  width: 640px;
  max-width: 95%;
  box-shadow: 0 16px 40px rgba(0, 0, 0, 0.25);
  position: relative;
  animation: ${fadeInScale} 0.4s ease-out;
  overflow-y: auto;
  max-height: 90vh;
`;

/* 🔘 Floating rounded close button */
const CloseButton = styled.button`
  position: absolute;
  top: 14px;
  right: 14px;
  background: #fef2f2;
  border: none;
  border-radius: 50%;
  width: 42px;
  height: 42px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.1rem;
  color: #b91c1c;
  cursor: pointer;
  transition: all 0.25s ease;

  &:hover {
    background: #fee2e2;
    color: #7f1d1d;
    transform: scale(1.1) rotate(90deg);
    box-shadow: 0 4px 12px rgba(239, 68, 68, 0.4);
  }
`;

/* 🎨 Reusable Button */
export const ModalButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.6rem;
  padding: 0.9rem 1.6rem;
  font-size: 1rem;
  font-weight: 600;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
  min-width: 140px;

  ${(props) =>
    props.$variation === "secondary"
      ? `
    background: #f3f4f6;
    color: #374151;
    border: 2px solid #d1d5db;

    &:hover {
      background: #e5e7eb;
      transform: translateY(-2px);
      box-shadow: 0 4px 10px rgba(0,0,0,0.08);
    }
  `
      : `
    background: linear-gradient(135deg, #2563eb, #1e40af);
    color: #fff;
    border: none;

    &:hover {
      background: linear-gradient(135deg, #1d4ed8, #1e3a8a);
      transform: translateY(-2px);
      box-shadow: 0 4px 14px rgba(37,99,235,0.4);
    }
  `}
`;

/* Group for form buttons */
export const ModalButtonGroup = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 1.5rem;
`;

export default function Modal({ children, onClose }) {
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [onClose]);

  return (
    <Overlay onClick={onClose}>
      <StyledModal onClick={(e) => e.stopPropagation()}>
        <CloseButton onClick={onClose}>
          <FaTimes />
        </CloseButton>
        {children}
      </StyledModal>
    </Overlay>
  );
}
