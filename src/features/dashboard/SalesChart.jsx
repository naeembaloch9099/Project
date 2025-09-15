import React, { useEffect, useState } from "react";
import styled from "styled-components";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  Legend,
} from "recharts";
import supabase from "../../services/supabaseClient";
import { format, parseISO, startOfMonth } from "date-fns";
import { FaChartLine, FaShoppingCart } from "react-icons/fa"; // ✅ added icons

// Styled Components
const ChartContainer = styled.div`
  background: #ffffff;
  border-radius: 16px;
  padding: 24px;
  height: 420px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  transition: transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 6px 24px rgba(0, 0, 0, 0.12);
  }
`;

const ChartTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: 600;
  color: #1f2937;
  margin: 0 0 24px 0;
  letter-spacing: -0.025em;
  display: flex;
  align-items: center;
  gap: 10px;
`;

const StyledLineChart = styled(LineChart)`
  .recharts-cartesian-grid {
    stroke: rgba(0, 0, 0, 0.05);
  }
  .recharts-legend-item-text {
    color: #374151;
    font-size: 0.875rem;
    font-weight: 500;
  }
`;

const COLORS = {
  sales: "#4F46E5", // Indigo
  bookings: "#10B981", // Emerald
  text: "#374151",
  grid: "rgba(0, 0, 0, 0.05)",
  tooltipBg: "#1f2937",
  tooltipText: "#e5e7eb",
};

// Full 12 months for 2025
const MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

export default function SalesChart() {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data: bookings, error } = await supabase
          .from("bookings")
          .select("startDate,totalPrice");

        if (error) throw error;

        // Initialize with all months = 0
        const grouped = MONTHS.reduce((acc, m) => {
          acc[m] = { sales: 0, bookings: 0 };
          return acc;
        }, {});

        (bookings || []).forEach((b) => {
          if (!b.startDate) return;
          const date = parseISO(b.startDate);
          if (date.getFullYear() !== 2025) return;

          const month = format(startOfMonth(date), "MMM");
          grouped[month].sales += Number(b.totalPrice || 0);
          grouped[month].bookings += 1;
        });

        const chartData = MONTHS.map((m) => ({
          date: m,
          sales: grouped[m].sales,
          bookings: grouped[m].bookings,
        }));

        setData(chartData);
      } catch (error) {
        console.error("Error fetching sales data:", error);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 5000);
    return () => clearInterval(interval);
  }, []);

  const CustomTooltipContent = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div
          style={{
            background: COLORS.tooltipBg,
            padding: "12px",
            borderRadius: "8px",
          }}
        >
          <p style={{ color: "#ffffff", fontWeight: 600, marginBottom: "8px" }}>
            {label}
          </p>
          {payload.map((entry, index) => (
            <p
              key={index}
              style={{ color: COLORS.tooltipText, margin: "4px 0" }}
            >
              {entry.name}: {entry.value}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <ChartContainer>
      <ChartTitle>
        <FaChartLine /> Sales Per Month (2025)
      </ChartTitle>
      <ResponsiveContainer width="100%" height="85%">
        <StyledLineChart
          data={data}
          margin={{ top: 10, right: 20, left: 10, bottom: 20 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke={COLORS.grid} />
          <XAxis
            dataKey="date"
            stroke={COLORS.text}
            fontSize={12}
            tickLine={false}
            axisLine={{ stroke: COLORS.text, strokeWidth: 1 }}
            interval={0}
          />
          <YAxis
            yAxisId="left"
            stroke={COLORS.text}
            fontSize={12}
            tickLine={false}
            axisLine={{ stroke: COLORS.text, strokeWidth: 1 }}
            label={{
              value: "Sales ($)",
              angle: -90,
              position: "insideLeft",
              style: { fill: COLORS.text, fontSize: 12 },
            }}
          />
          <YAxis
            yAxisId="right"
            orientation="right"
            stroke={COLORS.text}
            fontSize={12}
            tickLine={false}
            axisLine={{ stroke: COLORS.text, strokeWidth: 1 }}
            label={{
              value: "Bookings",
              angle: 90,
              position: "insideRight",
              style: { fill: COLORS.text, fontSize: 12 },
            }}
          />
          <Tooltip content={<CustomTooltipContent />} />
          <Legend
            verticalAlign="top"
            height={36}
            iconType="circle"
            iconSize={12}
            formatter={(value) => (
              <span style={{ color: COLORS.text, fontWeight: 500 }}>
                {value === "sales" ? (
                  <FaChartLine style={{ marginRight: 4 }} />
                ) : (
                  <FaShoppingCart style={{ marginRight: 4 }} />
                )}
                {value}
              </span>
            )}
          />
          <Line
            yAxisId="left"
            type="monotone"
            dataKey="sales"
            name="Sales ($)"
            stroke={COLORS.sales}
            strokeWidth={3}
            dot={false}
            activeDot={{
              r: 6,
              fill: COLORS.sales,
              stroke: "#ffffff",
              strokeWidth: 2,
            }}
          />
          <Line
            yAxisId="right"
            type="monotone"
            dataKey="bookings"
            name="Bookings"
            stroke={COLORS.bookings}
            strokeWidth={3}
            dot={false}
            activeDot={{
              r: 6,
              fill: COLORS.bookings,
              stroke: "#ffffff",
              strokeWidth: 2,
            }}
          />
        </StyledLineChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
}
