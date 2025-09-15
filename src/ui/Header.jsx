import styled from "styled-components";
import HMenu from "./HMenu";
import UserAvatar from "./UserAvator";

const SHeader = styled.header`
  background: #ffffff;
  padding: 1rem 2rem;
  border-bottom: 1px solid #e5e7eb;

  display: flex;
  align-items: center;
  justify-content: space-between;

  position: sticky;
  top: 0;
  z-index: 1000;

  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
`;

const LeftSection = styled.div`
  font-weight: 700;
  font-size: 1.5rem;
  color: #111827;
  letter-spacing: -0.02em;

  display: flex;
  align-items: center;
  gap: 0.5rem;

  &::before {
    content: "⬢";
    font-size: 1.4rem;
    color: #2563eb; /* primary accent color */
  }
`;

const RightSection = styled.div`
  display: flex;
  align-items: center;
  gap: 1.5rem;
`;

function Header() {
  return (
    <SHeader>
      <LeftSection>MyApp</LeftSection>

      <RightSection>
        <UserAvatar />
        <HMenu />
      </RightSection>
    </SHeader>
  );
}

export default Header;
