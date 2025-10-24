import { useState } from "react";
import {
  Table,
  Button,
  Space,
  Tooltip,
  Empty,
  Pagination,
  Skeleton,
} from "antd";
import {
  CalendarOutlined,
  CloudDownloadOutlined,
  EyeFilled,
} from "@ant-design/icons";
import dayjs from "dayjs";
import {
  useGetTamirForTexnikKorikQuery,
  useLazyExportPDFnosozQuery,
} from "@/services/api";
import { toast, Toaster } from "sonner";
export default function NosozlikJurnali({ tarkib, id }) {
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 20;
  const { data, isLoading } = useGetTamirForTexnikKorikQuery(id);
  const [exportPDF, { isFetching: pdfLoading }] = useLazyExportPDFnosozQuery();
  const paginatedData = data?.nosozliklar?.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );
  const handlepdf = async (ids) => {
    const blob = await exportPDF(ids).unwrap();
    toast.success("Pdf fayli muvaffaqiyatli yuklandi");
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${tarkib}-harakat-tarkibi-bo'yicha.pdf`; // fayl nomi
    document.body.appendChild(a);
    a.click();
    a.remove();
  };
  const handleWindows = (ud) => {
    window.location.href = `/defective-details/${ud}`;
  };
  const columns = [
    {
      title: "№",
      dataIndex: "index",
      key: "index",
      width: 80,
      render: (_, __, index) => index + 1,
      sorter: (a, b) => a.id - b.id,
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
      width: 150,
      render: (date) => (
        <div className="flex items-center gap-2">
          <CalendarOutlined />
          <span>{dayjs(date).format("DD.MM.YYYY HH:mm")}</span>
        </div>
      ),
      sorter: (a, b) => dayjs(a.created_at).unix() - dayjs(b.created_at).unix(),
    },
    {
      title: "Nosozlikdan chiqgan vaqti",
      dataIndex: "chiqqan_vaqti",
      key: "chiqqan_vaqti",
      width: 150,
      render: (date) => (
        <div className="flex items-center gap-2">
          <CalendarOutlined />
          <span>{dayjs(date).format("DD.MM.YYYY HH:mm")}</span>
        </div>
      ),
      sorter: (a, b) => dayjs(a.created_at).unix() - dayjs(b.created_at).unix(),
    },

    {
      title: "Yuklash",
      key: "actions",
      width: 200,
      fixed: "right",
      render: (_, record) => (
        <Space size="small">
          <Tooltip title="Akt faylini yuklab olish">
            <Button
              variant="solid"
              color="geekblue"
              icon={<CloudDownloadOutlined />}
              onClick={() => {
                const link = document.createElement("a");
                link.href = record.akt_file;
                link.download = "";
                toast.success("Akt fayli muvaffaqiyatli yuklandi");
                document.body.appendChild(link);
                link.click();
                link.remove();
              }}
            >
              Akt fayl
            </Button>
          </Tooltip>
          <Tooltip title="Dastur ishlab chiqgan PDF formatini yuklab olish">
            <Button
              variant="solid"
              color="volcano"
              loading={pdfLoading}
              disabled={record?.steps?.results?.length == 1 ? true : false}
              onClick={() => handlepdf(record.id)}
              icon={<CloudDownloadOutlined />}
            >
              PDF
            </Button>
          </Tooltip>
        </Space>
      ),
    },
    {
      title: "Batafsil ko'rish",
      key: "actions",
      width: 100,
      fixed: "right",
      render: (_, record) => (
        <Space size="small">
          <Tooltip title="Dastur ishlab chiqgan PDF formatini yuklab olish">
            <Button
              variant="solid"
              color="primary"
              onClick={() => handleWindows(record.id)}
              icon={<EyeFilled />}
            >
              Yana ko'rish
            </Button>
          </Tooltip>
        </Space>
      ),
    },
  ];
  if (isLoading) {
    return (
      <div className="p-6 bg-white rounded-lg shadow-sm mt-10">
        <Skeleton active paragraph={{ rows: 6 }} />
        <Skeleton active paragraph={{ rows: 6 }} />
        <Skeleton active paragraph={{ rows: 6 }} />
      </div>
    );
  }
  return (
    <div className="bg-gray-50 mb-5 mt-10">
      <Toaster position="bottom-center" richColors />
      <div className="bg-white rounded-lg shadow-sm">
        <div className="p-4 border-b border-gray-200 w-full flex justify-between items-center">
          <div className="flex items-center gap-4 justify-center">
            <h1 className="text-3xl font-bold text-red-500">
              {tarkib} Nosozliklari tarixi
            </h1>
          </div>
        </div>

        <div className="p-6">
          <Table
            columns={columns}
            dataSource={paginatedData?.map((item, index) => ({
              ...item,
              key: item.id || index,
            }))}
            pagination={false}
            scroll={{ x: 1200 }}
            locale={{
              emptyText: (
                <Empty
                  image={Empty.PRESENTED_IMAGE_SIMPLE}
                  description={
                    <div className="text-center py-8">
                      <h3 className="text-lg font-medium text-gray-900 mb-2">
                        Hech narsa topilmadi
                      </h3>
                      <p className="text-gray-500">
                        Hozircha ma’lumotlar mavjud emas
                      </p>
                    </div>
                  }
                />
              ),
            }}
            className="border border-gray-200 rounded-lg"
          />
          <div className="flex w-full justify-start mt-10">
            <Pagination
              current={currentPage}
              pageSize={pageSize}
              total={data?.nosozliklar?.length || 0} // ✅ umumiy sonini beramiz
              onChange={(page) => setCurrentPage(page)}
              showSizeChanger={false}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
