import { useGetharakatGetQuery } from "@/services/api";
import { Card } from "react-bootstrap";
import ProgressBar from "react-bootstrap/ProgressBar";
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";

export default function SecondDashboard() {
  const { data: harakatTarkibi, isLoading: harakatLoad } =
    useGetharakatGetQuery();

  if (harakatLoad) return <></>;

  // 🔹 Depo bo‘yicha guruhlash
  const depoGrouped = harakatTarkibi?.results?.reduce((acc, item) => {
    const depo = item?.depo;
    const holati = item?.holati;
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

  const chartDataByDepo = Object.entries(depoGrouped).map(([depo, stats]) => ({
    depo,
    data: [
      {
        name: "Soz holatda",
        value: stats?.Soz_holatda,
        fill: "#22c55e",
      },
      {
        name: "Nosozlikda",
        value: stats?.Nosozlikda,
        fill: "#ef4444",
      },
      {
        name: "Texnik ko‘rikda",
        value: stats?.Texnik_korikda,
        fill: "#f59e0b",
      },
    ],
  }));

  // 🔹 Umumiy statistika
  const nosozliklar =
    harakatTarkibi?.results?.filter((i) => i.holati === "Nosozlikda") || [];
  const sozliklar =
    harakatTarkibi?.results?.filter((i) => i.holati === "Soz_holatda") || [];
  const texniklar =
    harakatTarkibi?.results?.filter((i) => i.holati === "Texnik_korikda") || [];

  const total = nosozliklar.length + sozliklar.length + texniklar.length || 1;

  const data = [
    { name: "Nosozlikda", value: nosozliklar.length, fill: "#ef4444" },
    { name: "Soz holatda", value: sozliklar.length, fill: "#22c55e" },
    { name: "Texnik ko‘rikda", value: texniklar.length, fill: "#3b82f6" },
  ].map((i) => ({
    ...i,
    percent: ((i.value / total) * 100).toFixed(1),
  }));

  const renderLabel = (entry) => `${entry.percent}%`;

  return (
    <div className="w-full grid grid-cols-1 lg:grid-cols-4 gap-4 p-4">
      {/* 1️⃣ Umumiy Pie */}
      <Card className=" p-3 flex flex-col items-center justify-center h-[340px]">
        <h3 className="font-semibold mb-3">Umumiy holatlar</h3>
        <ResponsiveContainer width="100%" height={260} minHeight={260}>
          <PieChart>
            <Pie data={data} dataKey="value" label={renderLabel}>
              {data.map((entry, idx) => (
                <Cell key={idx} fill={entry.fill} />
              ))}
            </Pie>
            <Tooltip formatter={(_, __, obj) => obj.payload.name} />
          </PieChart>
        </ResponsiveContainer>
      </Card>

      {/* 2️⃣ Donut Chart */}
      <Card className=" p-3 flex flex-col items-center justify-center h-[340px]">
        <h3 className="font-semibold mb-3">Umumiy taqsimot</h3>
        <ResponsiveContainer width="100%" height={260} minHeight={260}>
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
      </Card>

      {/* 3️⃣ & 4️⃣ Depo Bar Statistikalar */}
      {chartDataByDepo?.slice(0, 2).map((depoChart, idx) => {
        const totalDepo = depoChart.data.reduce(
          (s, it) => s + (Number(it.value) || 0),
          0
        );

        return (
          <Card
            key={idx}
            className=" p-3 flex flex-col justify-between h-[340px]"
          >
            <div>
              <h3 className="text-center font-semibold mb-4">
                {depoChart.depo} depo
              </h3>
              {depoChart.data.map((item, i) => {
                const percent =
                  totalDepo > 0
                    ? ((item.value / totalDepo) * 100).toFixed(1)
                    : 0;
                return (
                  <div key={i} className="mb-3">
                    <div className="flex justify-between text-sm mb-1">
                      <span>{item.name}</span>
                      <span>{item.value} ta</span>
                    </div>
                    <ProgressBar
                      now={Number(percent)}
                      label={`${percent}%`}
                      animated
                      style={{
                        height: "40px",
                        backgroundColor: "#e9ecef",
                      }}
                    >
                      <div
                        style={{
                          backgroundColor: item.fill,
                          width: `${percent}%`,
                          height: "100%",
                          transition: "width 0.8s ease-in-out",
                        }}
                      />
                    </ProgressBar>
                  </div>
                );
              })}
            </div>
            <div className="text-end text-xs text-muted mt-2">
              Jami: {totalDepo} ta
            </div>
          </Card>
        );
      })}
    </div>
  );
}
