import React, { useEffect, useState } from "react";
import styled from "styled-components";
import supabase from "../../services/supabaseClient";
import { getCabins } from "../../services/apiCabin";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { FaHome } from "react-icons/fa"; // 👈 Cabin Icon

const Box = styled.div`
  background: linear-gradient(145deg, #ffffff, #f3f4f6);
  border-radius: 20px;
  padding: 2rem;
  box-shadow: 6px 6px 20px rgba(0, 0, 0, 0.08),
    -6px -6px 20px rgba(255, 255, 255, 0.8);
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
  align-items: center;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 10px 10px 25px rgba(0, 0, 0, 0.12),
      -8px -8px 25px rgba(255, 255, 255, 0.9);
  }
`;

const Title = styled.h3`
  font-size: 1.4rem;
  font-weight: 700;
  margin-bottom: 1.5rem;
  color: #111827;
  text-align: center;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const ChartWrapper = styled.div`
  width: 100%;
  height: 360px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const COLORS = [
  "#2563eb",
  "#10b981",
  "#f59e0b",
  "#ef4444",
  "#8b5cf6",
  "#14b8a6",
  "#ec4899",
  "#22c55e",
  "#0ea5e9",
  "#a855f7",
];

// ✅ Label for percentage
const renderPercentageLabel = ({
  cx,
  cy,
  midAngle,
  innerRadius,
  outerRadius,
  value,
}) => {
  if (value < 5) return null;

  const RADIAN = Math.PI / 180;
  const radius = innerRadius + (outerRadius - innerRadius) * 0.7;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text
      x={x}
      y={y}
      fill="#fff"
      textAnchor="middle"
      dominantBaseline="central"
      fontSize="12"
      fontWeight="700"
      style={{ filter: "drop-shadow(0px 1px 2px rgba(0,0,0,0.5))" }}
    >
      {`${value}%`}
    </text>
  );
};

export default function DashboardBox() {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchOccupancy = async () => {
      try {
        const cabins = await getCabins();
        const { data: bookings, error } = await supabase
          .from("bookings")
          .select("cabinId");
        if (error) throw error;

        const occupancy = cabins.map((cabin) => {
          const totalBookings = bookings.filter(
            (b) => b.cabinId === cabin.id
          ).length;

          const occupancyRate = Math.round(
            (totalBookings / (bookings.length || 1)) * 100
          );

          return { cabin_name: cabin.name, occupancy_rate: occupancyRate };
        });

        setData(occupancy);
      } catch (err) {
        console.error("Error loading occupancy:", err);
        setData([
          { cabin_name: "Cabin A", occupancy_rate: 40 },
          { cabin_name: "Cabin B", occupancy_rate: 35 },
          { cabin_name: "Cabin C", occupancy_rate: 25 },
        ]);
      }
    };

    fetchOccupancy();
  }, []);

  return (
    <Box>
      <Title>
        <FaHome style={{ color: "#4F46E5" }} /> Cabin Occupancy
      </Title>
      <ChartWrapper>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              dataKey="occupancy_rate"
              nameKey="cabin_name"
              cx="40%"
              cy="50%"
              outerRadius={120}
              innerRadius={70}
              paddingAngle={4}
              cornerRadius={6}
              label={renderPercentageLabel}
              isAnimationActive={true}
            >
              {data.map((_, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                  stroke="#fff"
                  strokeWidth={2}
                />
              ))}
            </Pie>
            <Tooltip
              formatter={(value, name) => [`${value}%`, name]}
              contentStyle={{
                borderRadius: "10px",
                boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                background: "#fff",
              }}
            />
            <Legend
              layout="vertical"
              align="right"
              verticalAlign="middle"
              wrapperStyle={{
                paddingLeft: "10px",
                fontSize: "0.85rem",
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </ChartWrapper>
    </Box>
  );
}
