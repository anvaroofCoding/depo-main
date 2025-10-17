import { useGetharakatGetQuery } from "@/services/api";
import { Card } from "react-bootstrap";
import ProgressBar from "react-bootstrap/ProgressBar";
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";

export default function SecondDashboard() {
  const { data: harakatTarkibi, isLoading: harakatLoad } =
    useGetharakatGetQuery();

  if (harakatLoad) {
    return <></>;
  }

  // Depo bo‘yicha guruhlash
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

  const chartDataByDepo = Object.entries(depoGrouped).map(([depo, stats]) => {
    return {
      depo,
      data: [
        {
          name: "Soz holatda: ",
          value: stats?.Soz_holatda,
          percent: ((stats?.Soz_holatda / stats?.total) * 100).toFixed(1) + "%",
          fill: "#22c55e",
        },
        {
          name: "Nosozlikda: ",
          value: stats?.Nosozlikda,
          percent: ((stats?.Nosozlikda / stats?.total) * 100).toFixed(1) + "%",
          fill: "#ef4444",
        },
        {
          name: "Texnik ko‘rikda: ",
          value: stats?.Texnik_korikda,
          percent:
            ((stats?.Texnik_korikda / stats?.total) * 100).toFixed(1) + "%",
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
    <div className="w-full grid grid-cols-1 md:grid-cols-4 gap-6 p-6">
      {/* 1. Umumiy Pie */}
      <div className="flex flex-col items-center w-full">
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
      <div className="flex flex-col items-center w-full">
        <h3 className="font-bold mb-2">Umumiy taqsimot</h3>
        <ResponsiveContainer width="100%" height={220}>
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              innerRadius={60}
              outerRadius={100}
              paddingAngle={3}
              label={(entry) => `${entry?.value} ta`}
            >
              {data.map((entry, idx) => (
                <Cell key={idx} fill={entry?.fill} />
              ))}
            </Pie>
            <Tooltip formatter={(_, __, obj) => obj?.payload?.name} />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* 3. Har bir depo uchun bar chartlar */}
      {chartDataByDepo?.map((depoChart, idx) => {
        const totalDepo = depoChart?.data?.reduce(
          (s, it) => s + (Number(it?.value) || 0),
          0
        );

        return (
          <Card key={idx} className="shadow-sm fade-in-up FADE-IN p-3 w-full">
            <Card.Body>
              <Card.Title className="text-center mb-3 fw-bold">
                {depoChart?.depo} depo
              </Card.Title>

              {depoChart?.data.map((item, i) => {
                const percent =
                  totalDepo > 0
                    ? ((Number(item?.value) / totalDepo) * 100).toFixed(1)
                    : 0;
                const barColor = item?.fill || "#0d6efd";

                return (
                  <div key={i} className="mb-3">
                    <div className="d-flex justify-content-between mb-1">
                      <span className="fw-semibold">{item?.name}</span>
                      <span>{item?.value} ta</span>
                    </div>

                    <ProgressBar
                      now={Number(percent)}
                      label={`${percent}%`}
                      animated
                      style={{
                        height: "20px",
                        backgroundColor: "#e9ecef",
                      }}
                      variant=""
                    >
                      <div
                        style={{
                          backgroundColor: barColor,
                          width: `${percent}%`,
                          height: "100%",
                          transition: "width 0.8s ease-in-out",
                        }}
                      />
                    </ProgressBar>
                  </div>
                );
              })}

              <div className="text-muted small mt-2 text-end">
                Jami: {totalDepo} ta
              </div>
            </Card.Body>
          </Card>
        );
      })}
    </div>
  );
}
