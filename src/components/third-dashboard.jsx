"use client";
import { useState } from "react";
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
import { ConfigProvider, Select } from "antd";

export default function ThirdDashboard() {
  const { data, isLoading } = useGetehtiyotStatisQuery();
  const [selectedDepo, setSelectedDepo] = useState("all");

  if (isLoading) {
    return <></>;
  }

  const results = data?.results ?? [];

  // faqat jami_miqdor 1–100 oralig‘ida bo‘lganlarni olish
  const filtered = results.filter(
    (item) => item.jami_miqdor >= 1 && item.jami_miqdor <= 100
  );

  // depolar ro‘yxati
  const depolar = Array.from(new Set(results.map((r) => r.depo_nomi)));

  // agar "all" bo‘lsa barcha, bo‘lmasa faqat o‘sha depo
  const chartData =
    selectedDepo === "all"
      ? filtered
      : filtered.filter((item) => item.depo_nomi === selectedDepo);

  // chart format
  const formattedData = chartData.map((item) => ({
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
        Eng kam qolgan ehtiyot qismlar (Depo bo‘yicha)
      </h2>

      {/* Ant Design Select */}
      <div className="mb-4">
        <ConfigProvider
          theme={{
            token: {
              colorPrimary: "#16a34a", // Tailwind green-600
            },
          }}
        >
          <Select
            style={{ width: 250 }}
            value={selectedDepo}
            onChange={(value) => setSelectedDepo(value)}
            options={[
              { value: "all", label: "Barcha depolar" },
              ...depolar.map((depo) => ({
                value: depo,
                label: depo,
              })),
            ]}
          />
        </ConfigProvider>
      </div>

      <div className="w-full h-[500px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={formattedData}
            layout="vertical"
            margin={{ top: 20, right: 30, left: 120, bottom: 20 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis type="number" />
            <YAxis dataKey="name" type="category" width={120} />
            <Tooltip />
            <Bar dataKey="miqdor" barSize={25}>
              {formattedData.map((entry, idx) => (
                <Cell key={idx} fill={colors[idx % colors.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
