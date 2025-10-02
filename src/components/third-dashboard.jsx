"use client";
import { useGetehtiyotStatisQuery } from "@/services/api";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Cell,
} from "recharts";

export default function ThirdDashboard() {
  const { data, isLoading } = useGetehtiyotStatisQuery();

  if (isLoading) {
    return <></>;
  }

  const results = data?.results ?? [];

  // jami_miqdor ≤ 100 bo'lganlarni olish va tartiblash
  const filtered = results
    .filter((item) => item.jami_miqdor <= 100)
    .sort((a, b) => a.jami_miqdor - b.jami_miqdor)
    .slice(0, 10); // faqat top 10 tasi

  const chartData = filtered.map((item) => ({
    name: item.ehtiyotqism_nomi,
    miqdor: item.jami_miqdor,
  }));

  // ranglar massiv
  const colors = [
    "#8884d8",
    "#82ca9d",
    "#ffc658",
    "#ff8042",
    "#8dd1e1",
    "#a4de6c",
    "#d0ed57",
    "#ffbb28",
    "#ff7f50",
    "#b0e57c",
  ];

  return (
    <div className="w-full">
      <h2 className="mb-2 text-xl font-bold text-green-800">
        Eng kam qolgan ehtiyot qismlar
      </h2>
      <div className="w-full h-[500px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            layout="vertical"
            margin={{ top: 20, right: 30, left: 120, bottom: 20 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis type="number" />
            <YAxis dataKey="name" type="category" width={120} />
            <Tooltip />
            <Bar dataKey="miqdor" barSize={25}>
              {chartData.map((entry, idx) => (
                <Cell key={idx} fill={colors[idx % colors?.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
