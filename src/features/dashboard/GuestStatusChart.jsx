import React, { useEffect, useState } from "react";
import styled from "styled-components";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import supabase from "../../services/supabaseClient";
import Flag from "react-world-flags";

// Styled Components
const ChartContainer = styled.div`
  background: #ffffff;
  border-radius: 16px;
  padding: 24px;
  height: 400px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  transition: transform 0.2s ease-in-out;
  &:hover {
    transform: translateY(-4px);
  }
`;

const ChartTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: 600;
  color: #1f2937;
  margin: 0 0 24px 0;
  letter-spacing: -0.025em;
`;

const StyledBarChart = styled(BarChart)`
  .recharts-tooltip-wrapper {
    .recharts-default-tooltip {
      border-radius: 8px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
      border: none;
    }
  }
`;

const CustomTooltip = styled.div`
  background: #1f2937;
  color: #ffffff;
  padding: 12px;
  border-radius: 8px;
  font-size: 0.875rem;
  line-height: 1.5;
`;

const FlagWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 24px;
`;

const COLORS = {
  primary: "#3b82f6",
  text: "#1f2937",
};

// ✅ Manual mapping (extend as needed)
const COUNTRY_CODES = {
  Pakistan: "PK",
  India: "IN",
  "United States": "US",
  UK: "GB",
  France: "FR",
  Germany: "DE",
  Canada: "CA",
  China: "CN",
  Japan: "JP",
  Senegal: "SN",
};

// Chart Component
export default function GuestStatsChart() {
  const [data, setData] = useState([]);

  const fetchData = async () => {
    try {
      const { data: guests, error } = await supabase
        .from("guests")
        .select("nationality");

      if (error) throw error;

      const grouped = {};
      (guests || []).forEach(({ nationality }) => {
        const key = nationality || "Unknown";
        grouped[key] = (grouped[key] || 0) + 1;
      });

      const sortedData = Object.entries(grouped)
        .sort(([, a], [, b]) => b - a)
        .map(([name, count]) => ({ name, count }));

      setData(sortedData);
    } catch (error) {
      console.error("Error fetching guest data:", error);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 5000);
    return () => clearInterval(interval);
  }, []);

  const CustomTooltipContent = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <CustomTooltip>
          <strong>{label}</strong>
          <div>Guests: {payload[0].value}</div>
        </CustomTooltip>
      );
    }
    return null;
  };

  // ✅ Render only flag (or fallback letters)
  const renderFlag = (countryName) => {
    const code = COUNTRY_CODES[countryName];
    if (code) {
      return (
        <Flag
          code={code}
          height="18"
          fallback={<>{countryName.slice(0, 3).toUpperCase()}</>}
        />
      );
    }
    return <span>{countryName.slice(0, 3).toUpperCase()}</span>;
  };

  return (
    <ChartContainer>
      <ChartTitle>Guests by Nationality</ChartTitle>
      <ResponsiveContainer width="100%" height="85%">
        <StyledBarChart
          data={data}
          margin={{ top: 10, right: 10, left: 0, bottom: 10 }}
        >
          <XAxis
            dataKey="name"
            tickLine={false}
            axisLine={false}
            height={50}
            tick={({ x, y, payload }) => (
              <foreignObject x={x - 12} y={y + 10} width={30} height={30}>
                <FlagWrapper>{renderFlag(payload.value)}</FlagWrapper>
              </foreignObject>
            )}
          />
          <YAxis
            stroke={COLORS.text}
            fontSize={12}
            tickLine={false}
            axisLine={{ stroke: COLORS.text, strokeWidth: 1 }}
          />
          <Tooltip content={<CustomTooltipContent />} />
          <Bar
            dataKey="count"
            fill={COLORS.primary}
            radius={[4, 4, 0, 0]}
            maxBarSize={50}
            animationDuration={800}
          />
        </StyledBarChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
}
