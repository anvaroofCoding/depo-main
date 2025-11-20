import React from "react";
import ReactApexChart from "react-apexcharts";
import { Card } from "react-bootstrap";
import { useGetharakatGetQuery } from "@/services/api";

export default function SecondDashboard() {
  const { data: harakatTarkibi, isLoading } = useGetharakatGetQuery();

  if (isLoading) return <div>Yuklanmoqda...</div>;

  // Depo bo'yicha guruhlash
  const depoGrouped =
    harakatTarkibi?.results?.reduce((acc, item) => {
      const depo = item?.depo || "Noma'lum Depo";
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
      if (holati && acc[depo][holati] !== undefined) {
        acc[depo][holati]++;
      }

      return acc;
    }, {}) || {};

  // Donut chart uchun statistikalar
  const data = [
    {
      name: "Soz holatda",
      value:
        harakatTarkibi?.results?.filter((i) => i.holati === "Soz_holatda")
          ?.length || 0,
      color: "#22c55e",
    },
    {
      name: "Nosozlikda",
      value:
        harakatTarkibi?.results?.filter((i) => i.holati === "Nosozlikda")
          ?.length || 0,
      color: "#ef4444",
    },
    {
      name: "Texnik ko‘rikda",
      value:
        harakatTarkibi?.results?.filter((i) => i.holati === "Texnik_korikda")
          ?.length || 0,
      color: "#f59e0b",
    },
  ];

  const total = data.reduce((sum, d) => sum + d.value, 0);

  // Donut chart options
  const pieOptions = {
    chart: { type: "donut", toolbar: { show: false } },
    labels: data.map((d) => d.name),
    colors: data.map((d) => d.color),
    legend: {
      position: "bottom",
      labels: { colors: "#374151" },
    },
    plotOptions: {
      pie: {
        donut: {
          labels: {
            show: true,
            total: {
              show: true,
              label: "Umumiy",
              formatter: () => `${total}`,
              fontSize: "18px",
              color: "#1f2937",
            },
          },
        },
      },
    },
    tooltip: {
      y: {
        formatter: (val) => `${val} ta (${((val / total) * 100).toFixed(1)}%)`,
      },
    },
  };

  const pieSeries = data.map((d) => d.value);

  // Depo nomlari
  const depoNames = Object.keys(depoGrouped || {});

  // Bar chart uchun ma'lumotlar
  const barSeries = [
    {
      name: "Soz holatda",
      data: depoNames.map((d) => depoGrouped[d]?.Soz_holatda || 0),
      color: "#22c55e",
    },
    {
      name: "Nosozlikda",
      data: depoNames.map((d) => depoGrouped[d]?.Nosozlikda || 0),
      color: "#ef4444",
    },
    {
      name: "Texnik ko‘rikda",
      data: depoNames.map((d) => depoGrouped[d]?.Texnik_korikda || 0),
      color: "#f59e0b",
    },
  ];

  const barOptions = {
    chart: {
      type: "bar",
      stacked: true,
      toolbar: { show: false },
    },
    xaxis: {
      categories: depoNames,
      labels: { style: { colors: "#374151" } },
    },
    yaxis: {
      title: { text: "Soni", style: { color: "#4b5563" } },
    },
    plotOptions: {
      bar: { borderRadius: 5, horizontal: false, columnWidth: "50%" },
    },
    legend: { position: "bottom" },
    dataLabels: { enabled: false },
    grid: { borderColor: "#e5e7eb" },
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* Donut Chart */}
      <Card className="col-span-1 p-6 flex flex-col items-center justify-center shadow-lg rounded-2xl border-0 bg-white hover:shadow-xl transition-shadow duration-300">
        <h3 className="font-semibold mb-4 text-lg text-gray-700">
          Umumiy holatlar
        </h3>
        <ReactApexChart
          options={pieOptions}
          series={pieSeries}
          type="donut"
          height={300}
        />
      </Card>

      {/* Bar Chart */}
      <Card className="col-span-2 p-6 shadow-lg rounded-2xl border-0 bg-white hover:shadow-xl transition-shadow duration-300">
        <h3 className="font-semibold mb-4 text-lg text-gray-700">
          Depo bo‘yicha holatlar
        </h3>
        <ReactApexChart
          options={barOptions}
          series={barSeries}
          type="bar"
          height={320}
        />
      </Card>
    </div>
  );
}
