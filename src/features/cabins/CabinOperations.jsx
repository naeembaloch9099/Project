import React from "react";
import Filter from "../../ui/Filter";
import SortBy from "../../ui/SortBy"; // make sure this file exists
import styled from "styled-components";

const TableOperations = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
`;

export default function CabinOperations() {
  return (
    <TableOperations>
      <Filter />
      <SortBy
        // ...existing code...

        options={[
          { value: "name-asc", label: "Sort By Name (A-Z)" },
          { value: "name-desc", label: "Sort By Name (Z-A)" },
          { value: "regularPrice-asc", label: "Sort By Price (Low → High)" },
          { value: "regularPrice-desc", label: "Sort By Price (High → Low)" },
          { value: "capacity-asc", label: "Sort By Capacity (Low → High)" },
          { value: "capacity-desc", label: "Sort By Capacity (High → Low)" },
        ]}
      />
    </TableOperations>
  );
}
