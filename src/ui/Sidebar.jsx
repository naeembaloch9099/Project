import styled from "styled-components";
import Logo from "./Logo";
import MainNav from "./MainNev";

const Aside = styled.aside`
  background-color: var(--color-grey-0);
  padding: 2.4rem 1.8rem;
  border-right: 1px solid var(--color-grey-100);

  /* Full height */
  grid-row: 1 / -1;
  min-height: 100vh;

  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 3.2rem;

  /* Subtle shadow */
  box-shadow: 2px 0 6px rgba(0, 0, 0, 0.04);
`;

const LogoWrapper = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  margin-bottom: 1rem;
`;

const NavWrapper = styled.nav`
  flex: 1;
  width: 100%;
`;

const Footer = styled.div`
  margin-top: auto;
  font-size: 1.2rem;
  color: var(--color-grey-500);
  text-align: center;
  padding-top: 1.2rem;
  border-top: 1px solid var(--color-grey-100);
`;

function Sidebar() {
  return (
    <Aside>
      {/* Logo */}
      <LogoWrapper>
        <Logo />
      </LogoWrapper>

      {/* Navigation */}
      <NavWrapper>
        <MainNav />
      </NavWrapper>
    </Aside>
  );
}

export default Sidebar;
