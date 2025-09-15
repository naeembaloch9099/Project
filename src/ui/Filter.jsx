import React from "react";
import { useSearchParams } from "react-router-dom";

const filterContainerStyle = {
  display: "flex",
  gap: "0.75rem",
  alignItems: "center",
};

const buttonStyle = {
  padding: "0.5rem 1rem",
  borderRadius: "6px",
  border: "1px solid #d1d5db",
  backgroundColor: "#f9fafb",
  color: "#374151",
  fontSize: "0.85rem",
  fontWeight: "500",
  cursor: "pointer",
  transition: "all 0.2s ease",
};

const hoverBackground = "#0000ff";

export default function Filter() {
  const [searchParams, setSearchParams] = useSearchParams();
  const currentFilter = searchParams.get("discount") || "all";

  const handleClick = (value) => {
    setSearchParams({ discount: value });
  };

  const handleMouseOver = (e) => {
    if (e.currentTarget.disabled) return;
    e.currentTarget.style.backgroundColor = hoverBackground;
    e.currentTarget.style.color = "#fff";
  };

  const handleMouseOut = (e, active) => {
    if (e.currentTarget.disabled) return;
    e.currentTarget.style.backgroundColor = active
      ? hoverBackground
      : buttonStyle.backgroundColor;
    e.currentTarget.style.color = active ? "#fff" : buttonStyle.color;
  };

  return (
    <div style={filterContainerStyle}>
      {["all", "discount", "no-discount"].map((val) => {
        const isActive = currentFilter === val;
        return (
          <button
            key={val}
            style={{
              ...buttonStyle,
              backgroundColor: isActive
                ? hoverBackground
                : buttonStyle.backgroundColor,
              color: isActive ? "#fff" : buttonStyle.color,
              cursor: isActive ? "not-allowed" : "pointer",
              opacity: isActive && val === "all" ? 0.6 : 1,
            }}
            disabled={val === "all" && isActive}
            onClick={() => handleClick(val)}
            onMouseOver={handleMouseOver}
            onMouseOut={(e) => handleMouseOut(e, isActive)}
          >
            {val === "all"
              ? "All"
              : val === "discount"
              ? "Discount"
              : "No Discount"}
          </button>
        );
      })}
    </div>
  );
}
