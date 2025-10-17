import GoBack from "@/components/GoBack";
import Loading from "@/components/loading/loading";
import { useGetOneDepoQuery } from "@/services/api";
import { Button, Card, Descriptions, Empty, Image, Space, Tooltip } from "antd";
import { motion } from "framer-motion";
import { Info, TrainFront } from "lucide-react";
import { useParams } from "react-router-dom";
import TamirturiJurnali from "./tamirturijurnali";
import { CloudDownloadOutlined } from "@ant-design/icons";

const TexnikKoriks = () => {
  const { id, sub_id } = useParams();
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
    <div className="w-full h-screen overflow-y-auto p-2 bg-gray-50">
      <Card
        className="shadow-lg rounded-2xl"
        title={
          <motion.div
            className="bg-gradient-to-r my-2 from-gray-500 via-gray-700 to-gray-800 rounded-2xl text-white p-4 shadow-lg flex items-center justify-between"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            {/* Metro icon (chap tomonda) */}

            <div className="flex space-x-3">
              <motion.div
                className="bg-white/20 p-3 rounded-full"
                whileHover={{ scale: 1.1, rotate: 10 }}
                transition={{ type: "spring", stiffness: 200 }}
              >
                <TrainFront className="w-8 h-8 text-white" />
              </motion.div>

              {/* Ma’lumotlar (o‘ng tomonda) */}
              <div>
                <motion.h2
                  className="text-3xl font-bold tracking-wide"
                  initial={{ scale: 0.9 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.4 }}
                >
                  {data?.tarkib_raqami || "Noma’lum"}
                </motion.h2>
                <div className="flex items-center gap-2 text-sm text-white/80">
                  <Info className="w-4 h-4" />
                  <p>
                    Harakat tarkibining {sub_id} texnik ko'rigi bo'yicha to'liq
                    ma'lumot
                  </p>
                </div>
              </div>
            </div>
            <div>
              <Space size="middle">
                <Tooltip title="Harakat tarkibining texnik ko'rikga kirganligi haqidagi excel shaklida">
                  <Button
                    variant="solid"
                    color="green"
                    icon={<CloudDownloadOutlined />}
                    size="large"
                    // onClick={() => {
                    //   const link = document.createElement("a");
                    //   link.href = record.akt_file;
                    //   link.download = "";
                    //   toast.success("Akt fayli muvaffaqiyatli yuklandi");
                    //   document.body.appendChild(link);
                    //   link.click();
                    //   link.remove();
                    // }}
                  >
                    Excel fayl yuklash
                  </Button>
                </Tooltip>
                <Tooltip title="Harakat tarkibining texnik ko'rikga kirganligi haqidagi pdf shaklida">
                  <Button
                    variant="solid"
                    color="volcano"
                    size="large"
                    // loading={pdfLoading}
                    // onClick={() => handlepdf(record.id)}
                    icon={<CloudDownloadOutlined />}
                  >
                    PDF fayl yuklash
                  </Button>
                </Tooltip>
              </Space>
            </div>
          </motion.div>
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
                {(() => {
                  let colorClass = "";
                  let text = "";

                  switch (data?.holati) {
                    case "Soz_holatda":
                      colorClass = "text-green-600 p-2 bg-green-200";
                      text = "Soz holatda";
                      break;
                    case "Nosozlikda":
                      colorClass = "text-red-600 p-2 bg-red-200";
                      text = "Nosozlikda";
                      break;
                    case "Texnik_korikda":
                      colorClass = "text-yellow-700 p-2 bg-yellow-200";
                      text = "Texnik ko'rikda";
                      break;
                    default:
                      colorClass = "text-gray-600 p-2 bg-gray-300";
                      text = "No'malum";
                  }
                  return (
                    <span className={`${colorClass} rounded-2xl`}>{text}</span>
                  );
                })()}
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
      <TamirturiJurnali datas={sub_id} tarkib={data?.tarkib_raqami} />
    </div>
  );
};

export default TexnikKoriks;
