import { useGetharakatGetQuery } from "@/services/api";
import {
  PieChart,
  Pie,
  Cell,
  RadialBarChart,
  RadialBar,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import Loading from "./loading/loading";

export default function SecondDashboard() {
  const { data: harakatTarkibi, isLoading: harakatLoad } =
    useGetharakatGetQuery();

  if (harakatLoad) {
    return (
      <div className="w-full h-screen flex justify-center items-center">
        <Loading />
      </div>
    );
  }

  // Filterlar
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

  // umumiy son
  const total =
    nosozliklar?.length + sozliklar?.length + texniklar?.length || 1;

  // Diagramma uchun data
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

  // Label faqat % ko‘rsatadi
  const renderLabel = (entry) => `${entry?.percent}%`;

  return (
    <div className="w-full flex justify-between gap-6 p-8">
      {/* 1. Pie Chart */}
      <div className="flex flex-col items-center w-1/4">
        <h3 className="font-bold mb-2">Pirog diagrammasi</h3>
        <ResponsiveContainer width="100%" height={250}>
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

      {/* 2. Donut Chart */}
      <div className="flex flex-col items-center w-1/4">
        <h3 className="font-bold mb-2">Donut diagrammasi</h3>
        <ResponsiveContainer width="100%" height={250}>
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              innerRadius={60}
              outerRadius={100}
              paddingAngle={3}
              label={renderLabel}
            >
              {data.map((entry, idx) => (
                <Cell key={idx} fill={entry.fill} />
              ))}
            </Pie>
            <Tooltip formatter={(_, __, obj) => obj.payload.name} />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* 3. Radial Chart */}
      <div className="flex flex-col items-center w-1/4">
        <h3 className="font-bold mb-2">Radial diagramma</h3>
        <ResponsiveContainer width="100%" height={250}>
          <RadialBarChart
            cx="50%"
            cy="50%"
            innerRadius="20%"
            outerRadius="90%"
            barSize={20}
            data={data}
          >
            <RadialBar
              minAngle={15}
              label={{
                position: "insideStart",
                formatter: (val, entry) => `${entry?.percent}%`,
              }}
              background
              clockWise
              dataKey="value"
            />
            <Tooltip formatter={(_, __, obj) => obj.payload.name} />
          </RadialBarChart>
        </ResponsiveContainer>
      </div>

      {/* 4. Horizontal Bar Chart */}
      <div className="flex flex-col items-center w-1/4">
        <h3 className="font-bold mb-2">Gorizontal Bar</h3>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={data} layout="vertical">
            <XAxis type="number" hide />
            <YAxis dataKey="percent" type="category" />
            <Tooltip formatter={(_, __, obj) => obj.payload.name} />
            <Bar dataKey="value">
              {data.map((entry, idx) => (
                <Cell key={idx} fill={entry.fill} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
