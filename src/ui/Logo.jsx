import React from "react";
import styled from "styled-components";

// Wrapper
const Wrap = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  text-align: left;
  gap: 1rem;
`;

// Circular image frame
const Badge = styled.div`
  width: ${(p) => p.$size}px;
  height: ${(p) => p.$size}px;
  border-radius: 50%;
  overflow: hidden;
  display: grid;
  place-items: center;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
`;

// Actual image
const Img = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

// Brand text
const Wordmark = styled.span`
  font-weight: 800;
  font-size: 1.6rem;
  color: #111;
`;

export default function Logo({ alt = "Logo", size = 100 }) {
  return (
    <Wrap>
      <Badge $size={size}>
        <Img
          src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRGF8FwEQcN76kLjRHfGta7dnHHM0BgeFQ7Wg&s"
          alt={alt}
          loading="eager"
        />
      </Badge>
      <Wordmark>The Wild Osis</Wordmark>
    </Wrap>
  );
}
