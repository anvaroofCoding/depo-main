import { useGetharakatGetQuery } from "@/services/api";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function SecondDashboard() {
  const { data: harakatTarkibi, isLoading: harakatLoad } =
    useGetharakatGetQuery();

  if (harakatLoad) {
    return <p>Yuklanmoqda...</p>;
  }

  // Depo bo‘yicha guruhlash
  const depoGrouped = harakatTarkibi?.results?.reduce((acc, item) => {
    const depo = item.depo;
    const holati = item.holati;

    if (!acc[depo]) {
      acc[depo] = {
        total: 0,
        Soz_holatda: 0,
        Nosozlikda: 0,
        Texnik_korikda: 0,
      };
    }

    acc[depo].total++;
    acc[depo][holati]++;

    return acc;
  }, {});

  const chartDataByDepo = Object.entries(depoGrouped).map(([depo, stats]) => {
    return {
      depo,
      data: [
        {
          name: "Soz holatda",
          value: stats.Soz_holatda,
          percent: ((stats.Soz_holatda / stats.total) * 100).toFixed(1) + "%",
          fill: "#22c55e",
        },
        {
          name: "Nosozlikda",
          value: stats.Nosozlikda,
          percent: ((stats.Nosozlikda / stats.total) * 100).toFixed(1) + "%",
          fill: "#ef4444",
        },
        {
          name: "Texnik ko‘rikda",
          value: stats.Texnik_korikda,
          percent:
            ((stats.Texnik_korikda / stats.total) * 100).toFixed(1) + "%",
          fill: "#f59e0b",
        },
      ],
    };
  });

  // umumiy statistika
  const nosozliklar =
    harakatTarkibi?.results?.filter((item) => item.holati === "Nosozlikda") ||
    [];
  const sozliklar =
    harakatTarkibi?.results?.filter((item) => item.holati === "Soz_holatda") ||
    [];
  const texniklar =
    harakatTarkibi?.results?.filter(
      (item) => item.holati === "Texnik_korikda"
    ) || [];

  const total =
    nosozliklar?.length + sozliklar?.length + texniklar?.length || 1;

  const data = [
    {
      name: "Nosozlikda",
      value: nosozliklar?.length,
      fill: "#ef4444",
    },
    {
      name: "Soz holatda",
      value: sozliklar?.length,
      fill: "#22c55e",
    },
    {
      name: "Texnik ko‘rikda",
      value: texniklar?.length,
      fill: "#3b82f6",
    },
  ].map((item) => ({
    ...item,
    percent: ((item.value / total) * 100).toFixed(2),
  }));

  const renderLabel = (entry) => `${entry?.percent}%`;

  return (
    <div className="w-full flex justify-between items-center gap-6 p-6 overflow-x-auto ">
      {/* 1. Umumiy Pie */}
      <div className="flex flex-col items-center w-[350px]">
        <h3 className="font-bold mb-2">Umumiy holatlar</h3>
        <ResponsiveContainer width="100%" height={220}>
          <PieChart>
            <Pie data={data} dataKey="value" label={renderLabel}>
              {data.map((entry, idx) => (
                <Cell key={idx} fill={entry.fill} />
              ))}
            </Pie>
            <Tooltip formatter={(_, __, obj) => obj.payload.name} />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* 2. Umumiy Donut */}
      <div className="flex flex-col items-center w-[350px]">
        <h3 className="font-bold mb-2">Umumiy taqsimot</h3>
        <ResponsiveContainer width="100%" height={220}>
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              innerRadius={60}
              outerRadius={100}
              paddingAngle={3}
              label={(entry) => `${entry.value} ta`}
            >
              {data.map((entry, idx) => (
                <Cell key={idx} fill={entry.fill} />
              ))}
            </Pie>
            <Tooltip formatter={(_, __, obj) => obj.payload.name} />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* 3. Har bir depo uchun bar chartlar */}
      {chartDataByDepo.map((depoChart, idx) => (
        <div
          key={idx}
          className="flex flex-col items-center w-[350px] border rounded-lg p-3 shadow"
        >
          <h3 className="font-bold mb-2">{depoChart.depo} depo</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={depoChart.data} layout="vertical">
              <XAxis type="number" hide />
              <YAxis dataKey="percent" type="category" />
              <Tooltip
                formatter={(value, _, obj) => [`${value} ta`, obj.payload.name]}
              />
              <Bar dataKey="value">
                {depoChart.data.map((entry, i) => (
                  <Cell key={i} fill={entry.fill} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      ))}
    </div>
  );
}
