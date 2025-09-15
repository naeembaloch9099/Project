import styled from "styled-components";
import { HiArrowRightOnRectangle } from "react-icons/hi2";
import { useLogout } from "./useLogout";
import Spinner from "../../ui/Spinner";

const Button = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;

  padding: 0.6rem 1rem;
  border: none;
  border-radius: 0.5rem;

  background-color: var(--color-grey-100);
  color: var(--color-grey-700);
  font-size: 1.4rem;
  cursor: pointer;

  transition: all 0.2s ease-in-out;

  &:hover {
    background-color: var(--color-grey-200);
    color: var(--color-brand-600);
    transform: translateY(-1px);
  }

  &:active {
    transform: translateY(0);
  }

  svg {
    width: 1.6rem;
    height: 1.6rem;
  }
`;

function Logout() {
  const { logout, isLoading } = useLogout();
  return (
    <Button disabled={isLoading} onClick={logout}>
      {!isLoading ? <HiArrowRightOnRectangle /> : <Spinner />}
      Logout
    </Button>
  );
}

export default Logout;
