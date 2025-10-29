import { useGetehtiyotStatisQuery } from "@/services/api";
import { ConfigProvider, Select } from "antd";
import { useMemo, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

export default function ThirdDashboard() {
  const { data, isLoading } = useGetehtiyotStatisQuery();
  const [selectedDepo, setSelectedDepo] = useState("all");

  // 🔹 Ma’lumotlar xavfsiz holatda olinadi
  const results = data?.results ?? [];

  // 🔹 Depolar ro‘yxati
  const depolar = useMemo(() => {
    return Array.from(
      new Set(results.map((r) => r?.depo_nomi).filter(Boolean))
    );
  }, [results]);

  // 🔹 Grafik uchun formatlangan ma’lumot
  const formattedData = useMemo(() => {
    const filtered = results
      .filter(
        (item) =>
          item?.jami_miqdor >= 1 &&
          item?.jami_miqdor <= 100 &&
          (selectedDepo === "all" || item.depo_nomi === selectedDepo)
      )
      .map((item) => ({
        name: item?.ehtiyotqism_nomi,
        miqdor: item?.jami_miqdor,
      }));

    // Eng ko‘p ishlatilgan 5ta ehtiyot qismlar
    return filtered.sort((a, b) => b.miqdor - a.miqdor).slice(0, 5);
  }, [results, selectedDepo]);

  // 🍏 Apple rang palitrasi
  const colors = [
    "#007aff", // iOS Blue
    "#34c759", // iOS Green
    "#ff9500", // iOS Orange
    "#ff2d55", // iOS Pink
    "#5856d6", // iOS Purple
  ];

  if (isLoading) return <div className="text-gray-500">Yuklanmoqda...</div>;

  return (
    <div className="w-full p-6  rounded-2xl shadow-md">
      <div className="mb-6 flex w-full justify-between">
        <h2 className="mb-4 text-2xl font-semibold text-gray-800 tracking-tight">
          Eng ko‘p ishlatilgan ehtiyot qismlar — Top 5
        </h2>
        <ConfigProvider
          theme={{
            token: {
              colorPrimary: "#007aff",
              borderRadius: 8,
              colorBgContainer: "#ffffff",
              colorText: "#1c1c1e",
              controlHeight: 42,
              fontSize: 15,
            },
          }}
        >
          <Select
            style={{ width: 280 }}
            value={selectedDepo}
            onChange={(v) => setSelectedDepo(v)}
            options={[
              { value: "all", label: "Barcha depolar" },
              ...depolar.map((depo) => ({ value: depo, label: depo })),
            ]}
            showSearch
            placeholder="Depo tanlang"
            optionFilterProp="label"
          />
        </ConfigProvider>
      </div>

      {/* 🔹 Bar Chart */}
      <div className="w-full h-[450px] bg-white rounded-xl shadow-sm border border-gray-200 p-4">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={formattedData}
            layout="vertical"
            margin={{ top: 10, right: 20, left: 100, bottom: 10 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#d1d5db" />
            <XAxis
              type="number"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#6b7280", fontSize: 12 }}
            />
            <YAxis
              dataKey="name"
              type="category"
              width={130}
              tickLine={false}
              axisLine={false}
              tick={{ fill: "#374151", fontSize: 13 }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "#ffffff",
                borderRadius: "10px",
                border: "1px solid #e5e7eb",
                boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
              }}
              labelStyle={{ color: "#111827", fontWeight: 500 }}
              cursor={{ fill: "rgba(0,122,255,0.05)" }}
            />
            <Bar
              dataKey="miqdor"
              radius={[8, 8, 8, 8]}
              barSize={22}
              animationDuration={900}
            >
              {formattedData.map((_, idx) => (
                <Cell key={idx} fill={colors[idx % colors.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* 🔹 Izoh */}
      <div className="text-sm text-gray-500 mt-3 italic">
        Ma’lumotlar: jami miqdori 1–100 oralig‘idagi ehtiyot qismlar asosida.
      </div>
    </div>
  );
}
