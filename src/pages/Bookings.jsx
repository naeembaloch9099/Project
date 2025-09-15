import React, { useState } from "react";
import { useSearchParams } from "react-router-dom";
import BookingTable from "../features/bookings/BookingTable";
import BookingTableOperation from "../features/bookings/BookingTableOperation";
import Filter from "../ui/Filter";

export default function Bookings() {
  const [filter, setFilter] = useState("all"); // status filter
  const [sort, setSort] = useState("all");
  const [search, setSearch] = useState("");
  const [searchParams] = useSearchParams();
  const discount = searchParams.get("discount") || "all";

  return (
    <>
      <BookingTableOperation
        onFilter={setFilter}
        onSort={setSort}
        onSearch={setSearch}
      />

      <BookingTable
        filter={filter}
        sort={sort}
        search={search}
        discount={discount} // pass discount filter
      />
    </>
  );
}
