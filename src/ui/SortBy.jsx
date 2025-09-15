import React from "react";
import Select from "./Select";
import { useSearchParams } from "react-router-dom";

function SortBy({ options }) {
  const [searchParams, setSearchParams] = useSearchParams();
  const currentSortBy = searchParams.get("sortBy") || options[0]?.value;

  // Initialize URL if invalid
  React.useEffect(() => {
    if (!options.some((option) => option.value === currentSortBy)) {
      searchParams.set("sortBy", options[0]?.value);
      setSearchParams(searchParams);
    }
  }, [currentSortBy, options, searchParams, setSearchParams]);

  function handleChange(e) {
    searchParams.set("sortBy", e.target.value);
    setSearchParams(searchParams);
  }

  return (
    <Select
      options={options}
      value={currentSortBy}
      onChange={handleChange}
      type="white"
    />
  );
}

export default SortBy;
