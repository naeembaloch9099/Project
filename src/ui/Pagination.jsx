import styled from "styled-components";
import { HiChevronLeft, HiChevronRight } from "react-icons/hi";

const Container = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  margin-top: 1rem;
  padding: 0.75rem 1rem;
  background: #f9fafb;
  border-top: 2px solid #e5e7eb;
  font-family: "Inter", sans-serif;
`;

const Text = styled.p`
  font-size: 0.98rem;
  color: #374151;
  font-weight: 500;
  margin: 0;
`;

const Span = styled.span`
  font-weight: 700;
  color: #111827;
  margin: 0 0.25rem;
`;

const Buttons = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const Button = styled.button`
  display: flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.45rem 1.1rem;
  background: #fff;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 1rem;
  font-weight: 500;
  color: #374151;
  cursor: pointer;
  transition: background 0.2s, border-color 0.2s, color 0.2s;

  &:hover:not(:disabled),
  &:focus-visible:not(:disabled) {
    background: #2a59bf;
    color: #fff;
    border-color: #2a59bf;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    background: #f3f4f6;
    color: #9ca3af;
    border-color: #e5e7eb;
  }
`;

function Pagination({ count, page, pageSize, onPageChange }) {
  const totalPages = Math.ceil(count / pageSize);
  const from = count === 0 ? 0 : (page - 1) * pageSize + 1;
  const to = Math.min(page * pageSize, count);

  return (
    <Container>
      <Text>
        Showing <Span>{from}</Span> to <Span>{to}</Span> of <Span>{count}</Span>{" "}
        results
      </Text>
      <Buttons>
        <Button disabled={page === 1} onClick={() => onPageChange(page - 1)}>
          <HiChevronLeft />
          Previous
        </Button>
        <Button
          disabled={page === totalPages || count === 0}
          onClick={() => onPageChange(page + 1)}
        >
          Next
          <HiChevronRight />
        </Button>
      </Buttons>
    </Container>
  );
}

export default Pagination;
