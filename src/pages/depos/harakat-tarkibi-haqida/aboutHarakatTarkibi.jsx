import React from "react";
import { useParams } from "react-router-dom";
import { Card, Descriptions, Image, Empty } from "antd";
import Loading from "@/components/loading/loading";
import { useGetOneDepoQuery } from "@/services/api";

const HarakatTarkibiHaqida = () => {
  const { id } = useParams();
  const { data, isLoading, isError, error } = useGetOneDepoQuery(id);

  if (isLoading) {
    return (
      <div className="w-full h-screen flex justify-center items-center">
        <Loading />
      </div>
    );
  }

  if (isError) {
    console.error("Depo ma'lumotini olishda xatolik:", error);
    return (
      <div className="w-full h-screen flex flex-col justify-center items-center text-center">
        <Empty description="Depo ma'lumoti topilmadi" />
        <p className="text-gray-500 mt-2">
          Status: {error?.status || "no-status"}
        </p>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="w-full h-screen flex justify-center items-center">
        <Empty description="Ma'lumot mavjud emas" />
      </div>
    );
  }

  return (
    <div className="w-full h-screen overflow-y-auto p-6 bg-gray-50">
      <Card
        className="shadow-lg rounded-2xl"
        title={
          <h2 className="text-xl font-semibold">
            {data?.tarkib_raqami +
              " " +
              "harakat tarkibi haqida barcha ma'lumotlar" || "Ma'lum emas"}{" "}
            ma'lumotlari
          </h2>
        }
      >
        <div className="flex flex-col md:flex-row gap-8">
          {/* Depo rasmi */}
          <div className="flex justify-center">
            <Image
              src={
                data?.image ||
                "https://via.placeholder.com/600x400?text=Rasm yo‘q"
              }
              alt="Depo rasmi"
              height={465}
              width={600}
              className="rounded-lg shadow-md object-cover"
            />
          </div>

          {/* Ma'lumotlar */}
          <div className="flex-1">
            <Descriptions
              title="Depo tafsilotlari"
              bordered
              column={1}
              size="middle"
            >
              <Descriptions.Item label="Harakat tarkibi raqami">
                {data?.tarkib_raqami || "-"}
              </Descriptions.Item>
              <Descriptions.Item label="Turi">
                {data?.turi || "-"}
              </Descriptions.Item>
              <Descriptions.Item label="Guruhi">
                {data?.guruhi || "-"}
              </Descriptions.Item>
              <Descriptions.Item label="Holati">
                {data?.holati || "-"}
              </Descriptions.Item>
              <Descriptions.Item label="Eksplutatsiya vaqti">
                {data?.eksplutatsiya_vaqti
                  ? `${data.eksplutatsiya_vaqti} soat`
                  : "-"}
              </Descriptions.Item>
              <Descriptions.Item label="Ishga tushgan vaqti">
                {data?.ishga_tushgan_vaqti || "-"}
              </Descriptions.Item>
              <Descriptions.Item label="Depo nomi">
                {data?.depo || "-"}
              </Descriptions.Item>
              <Descriptions.Item label="Yaratilgan sana">
                {data?.created_at
                  ? (() => {
                      const date = new Date(data.created_at);
                      const day = String(date.getDate()).padStart(2, "0");
                      const month = String(date.getMonth() + 1).padStart(
                        2,
                        "0"
                      );
                      const year = date.getFullYear();
                      return `${day}-${month}-${year}`;
                    })()
                  : "-"}
              </Descriptions.Item>
              <Descriptions.Item label="Yaratgan shaxs">
                {data?.created_by || "-"}
              </Descriptions.Item>
            </Descriptions>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default HarakatTarkibiHaqida;
