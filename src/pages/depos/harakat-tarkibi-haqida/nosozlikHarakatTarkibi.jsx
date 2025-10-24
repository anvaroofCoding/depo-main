import { useParams } from "react-router-dom";
import { Table, Skeleton, Empty, Button, Space, Tooltip } from "antd";
import { Wrench, Calendar } from "lucide-react";
import dayjs from "dayjs";
import {
  ArrowRightOutlined,
  CloudDownloadOutlined,
  EyeFilled,
} from "@ant-design/icons";
import { toast } from "sonner";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  useGetTamirForTexnikKorikQuery,
  useLazyExportPDFnosozQuery,
} from "@/services/api";

export default function NosozlikHarakatTarkibi() {
  const { id } = useParams();

  const { data, isLoading } = useGetTamirForTexnikKorikQuery(id);
  const [exportPDF, { isFetching: pdfLoading }] = useLazyExportPDFnosozQuery();

  // 🔹 Bitta funksiya — tafsilotlar sahifasiga o'tish uchun
  const handleWindows = (recordId) => {
    window.location.href = `/defective-details/${recordId}`;
  };

  // 🔹 PDF faylni yuklab olish
  const handlepdf = async (recordId) => {
    try {
      const blob = await exportPDF(recordId).unwrap();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `nosozlik-${recordId}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      toast.success("PDF fayli muvaffaqiyatli yuklandi");
    } catch (error) {
      toast.error("PDF yuklashda xatolik yuz berdi");
    }
  };

  // 🔹 Jadval ustunlari
  const columns = [
    {
      title: "№",
      dataIndex: "index",
      key: "index",
      width: 80,
      render: (_, __, index) => index + 1,
    },
    {
      title: "Nosozlik sababi",
      dataIndex: "nosozlik_turi",
      key: "nosozlik_turi",
      width: 250,
    },
    {
      title: "Nosozlikka kirgan vaqti",
      dataIndex: "created_at",
      key: "created_at",
      width: 180,
      render: (date) => (
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-gray-500" />
          <span>{dayjs(date).format("DD.MM.YYYY HH:mm")}</span>
        </div>
      ),
    },
    {
      title: "Nosozlikdan chiqgan vaqti",
      dataIndex: "chiqqan_vaqti",
      key: "chiqqan_vaqti",
      width: 180,
      render: (date) => (
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-gray-500" />
          <span>{dayjs(date).format("DD.MM.YYYY HH:mm")}</span>
        </div>
      ),
    },
    {
      title: "Yuklash",
      key: "download",
      width: 200,
      fixed: "right",
      render: (_, record) => (
        <Space size="small">
          {/* Akt fayl yuklash */}
          <Tooltip title="Akt faylini yuklab olish">
            <Button
              type="default"
              icon={<CloudDownloadOutlined />}
              onClick={() => {
                const link = document.createElement("a");
                link.href = record.akt_file;
                link.download = "";
                document.body.appendChild(link);
                link.click();
                link.remove();
                toast.success("Akt fayli muvaffaqiyatli yuklandi");
              }}
            >
              Akt fayl
            </Button>
          </Tooltip>

          {/* PDF fayl yuklash */}
          <Tooltip title="Dastur ishlab chiqargan PDF faylni yuklab olish">
            <Button
              type="primary"
              icon={<CloudDownloadOutlined />}
              loading={pdfLoading}
              disabled={record?.steps?.results?.length === 1}
              onClick={() => handlepdf(record.id)}
            >
              PDF
            </Button>
          </Tooltip>
        </Space>
      ),
    },
    {
      title: "Batafsil ko‘rish",
      key: "actions",
      width: 150,
      fixed: "right",
      render: (_, record) => (
        <Tooltip title="Batafsil ma'lumotni ko‘rish">
          <Button
            type="dashed"
            icon={<EyeFilled />}
            onClick={() => handleWindows(record.id)}
          >
            Ko‘rish
          </Button>
        </Tooltip>
      ),
    },
  ];

  // 🔹 Yuklanayotgan holat
  if (isLoading) {
    return (
      <div className="w-full mt-10">
        <Skeleton active paragraph={{ rows: 10 }} />
      </div>
    );
  }

  // 🔹 Jadvalni render qilish
  return (
    <div className="mt-10 bg-gradient-to-br from-background to-background">
      <Card className="border-border/50 shadow-lg w-full">
        <CardHeader className="text-center space-y-1">
          <div className="flex items-center justify-center gap-2">
            <div className="rounded-lg bg-red-500/10 p-2">
              <Wrench className="h-5 w-5 text-red-500" />
            </div>
            <CardTitle className="text-2xl font-bold">
              Nosozliklar tarixi
            </CardTitle>
          </div>
          <CardDescription className="text-base">
            Nosozliklarning oxirgi 5 ta ro‘yxati
          </CardDescription>
        </CardHeader>

        <div className="p-4">
          {data?.nosozliklar?.length ? (
            <Table
              columns={columns}
              dataSource={data.nosozliklar.slice(0, 5)}
              rowKey={(record) => record.id}
              pagination={false}
              className="cursor-pointer hover:shadow-md"
            />
          ) : (
            <Empty
              description={
                <span className="text-gray-500">
                  Hozircha ma’lumot mavjud emas
                </span>
              }
              image={Empty.PRESENTED_IMAGE_SIMPLE}
            />
          )}
        </div>

        <div className="w-full text-end px-5 pb-4">
          <Button
            type="primary"
            onClick={() => (window.location.href = `/nosozliklar-data/${id}`)}
          >
            Batafsil ko‘rish <ArrowRightOutlined />
          </Button>
        </div>
      </Card>
    </div>
  );
}
