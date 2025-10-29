import React, { useMemo, useState } from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
  Cell,
} from "recharts";
import { motion } from "framer-motion";
import dayjs from "dayjs";
import { useGetStatisQuery } from "@/services/api";

const COLORS = [
  "#6366F1",
  "#06B6D4",
  "#F59E0B",
  "#EF4444",
  "#10B981",
  "#8B5CF6",
];

// ✅ Aggregatsiya funksiyasi – agar `created_at` bo‘lsa, sanani formatlab oladi
function aggregate(data = [], key = "nosozliklar_haqida__nosozlik_turi") {
  const map = new Map();

  for (const item of data) {
    let k = item[key] ?? "Unknown";

    // Sana bo‘yicha guruhlash
    if (key === "created_at" && item[key]) {
      k = dayjs(item[key]).format("YYYY-MM-DD"); // faqat sana qismi
    }

    map.set(k, (map.get(k) || 0) + 1);
  }

  // Chart uchun kerakli formatga o‘tkazish
  return Array.from(map.entries()).map(([name, count]) => ({ name, count }));
}

export default function FourthDashboard() {
  const { data, isLoading } = useGetStatisQuery();
  const [groupBy, setGroupBy] = useState("nosozliklar_haqida__nosozlik_turi");

  const sourceData = data?.last_10_nosozlik || [];

  const chartData = useMemo(
    () => aggregate(sourceData, groupBy),
    [sourceData, groupBy]
  );

  chartData.sort((a, b) => b.count - a.count);

  if (isLoading) {
    return (
      <div className="w-full h-64 flex items-center justify-center text-slate-500">
        Yuklanmoqda...
      </div>
    );
  }

  return (
    <div className="w-full mt-5">
      <div className="max-w-full bg-white dark:bg-slate-900 rounded-2xl shadow-lg p-4 md:p-6">
        <div className="flex items-start justify-between gap-4 mb-4">
          <div>
            <h3 className="text-lg md:text-xl font-semibold text-slate-900 dark:text-slate-100">
              So‘nggi 10 ta nosozlik tahlili
            </h3>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              API dan kelgan ma’lumot asosida avtomatik tahlil qilinadi.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <label className="text-xs text-slate-500 dark:text-slate-400">
              Guruhlar
            </label>
            <select
              value={groupBy}
              onChange={(e) => setGroupBy(e.target.value)}
              className="ml-2 px-3 py-1 text-sm rounded-md border bg-transparent border-slate-200 dark:border-slate-700"
            >
              <option value="nosozliklar_haqida__nosozlik_turi">
                Nosozlik turi
              </option>
              <option value="tarkib__tarkib_raqami">Tarkib raqami</option>
              <option value="tarkib__turi">Tarkib turi</option>
              <option value="created_at">Yaratilgan sana</option>
            </select>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
        >
          <div className="w-full h-72 md:h-96">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={chartData}
                margin={{ top: 12, right: 24, left: 8, bottom: 24 }}
              >
                <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                <XAxis
                  dataKey="name"
                  tick={{ fontSize: 12 }}
                  interval={0}
                  angle={-25}
                  textAnchor="end"
                  height={60}
                />
                <YAxis allowDecimals={false} />
                <Tooltip wrapperStyle={{ borderRadius: 8 }} />
                <Legend verticalAlign="top" height={36} />
                <Bar
                  dataKey="count"
                  name="Soni"
                  barSize={28}
                  radius={[6, 6, 0, 0]}
                >
                  {chartData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Jadval ko‘rinishida ham ko‘rsatish */}
          <div className="mt-4 overflow-x-auto">
            <table className="w-full text-left table-auto">
              <thead>
                <tr className="text-sm text-slate-500 dark:text-slate-400">
                  <th className="pb-2">#</th>
                  <th className="pb-2">Guruhlar</th>
                  <th className="pb-2">Soni</th>
                </tr>
              </thead>
              <tbody>
                {chartData.map((r, i) => (
                  <tr
                    key={r.name}
                    className="border-t border-slate-100 dark:border-slate-800"
                  >
                    <td className="py-2 text-sm text-slate-600 dark:text-slate-300">
                      {i + 1}
                    </td>
                    <td className="py-2 text-sm font-medium text-slate-800 dark:text-slate-100">
                      {r.name}
                    </td>
                    <td className="py-2 text-sm text-slate-700 dark:text-slate-200">
                      {r.count}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
