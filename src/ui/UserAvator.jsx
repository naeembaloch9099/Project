import React from "react";
import styled from "styled-components";
import { useUser } from "../features/authentication/useUser";
import DefaultUser from "../ui/default-user.png";

const AvatarWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 0.8rem;
`;

const StyledUserAvatar = styled.div`
  width: 3.2rem;
  height: 3.2rem;
  border-radius: 50%;
  overflow: hidden;
  border: 2px solid var(--color-brand-600);
  background-color: var(--color-grey-200);
  flex-shrink: 0;
  transition: transform 0.2s ease;

  &:hover {
    transform: scale(1.05);
  }
`;

const AvatarImg = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const UserName = styled.span`
  font-size: 1rem;
  font-weight: 600;
  color: var(--color-grey-800);
`;

export default function UserAvatar() {
  const { user } = useUser();
  if (!user) return null;

  const { fullName, avatar } = user.user_metadata || {};

  return (
    <AvatarWrapper>
      <StyledUserAvatar>
        <AvatarImg
          src={avatar || DefaultUser}
          alt={`Avatar of ${fullName || "User"}`}
        />
      </StyledUserAvatar>
      {fullName && <UserName>{fullName}</UserName>}
    </AvatarWrapper>
  );
}
