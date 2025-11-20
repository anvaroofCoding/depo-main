import Loading from "@/components/loading/loading";
import {
  useGetHarakatForDepoQuery,
  useGetOneDeposQuery,
  useLazyExportExcelhQuery,
  useLazyExportPdfhQuery,
} from "@/services/api";
import {
  CalendarOutlined,
  CheckCircleOutlined,
  DownloadOutlined,
} from "@ant-design/icons";
import {
  Badge,
  Button,
  Empty,
  Image,
  Input,
  Skeleton,
  Space,
  Table,
  Tooltip,
} from "antd";
import dayjs from "dayjs";
import { Eye } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

export default function Depos() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const { id } = useParams();
  const { data: dataDepo, isLoading: depoLoading } = useGetOneDeposQuery(id);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 20,
  });
  const { data, isLoading } = useGetHarakatForDepoQuery({
    search,
  });
  const filteredData = useMemo(() => {
    if (!data?.results) return [];
    return data?.results?.filter((item) => item.depo_id == id);
  }, [data, id]);
  useMemo(() => {
    if (!filteredData) return [];
    const start = (pagination.current - 1) * pagination.pageSize;
    const end = start + pagination.pageSize;
    return filteredData.slice(start, end);
  }, [data, pagination, filteredData]);
  const handleTableChange = (newPagination) => {
    setPagination({
      ...pagination,
      current: newPagination.current,
      pageSize: newPagination.pageSize,
    });
  };
  useEffect(() => {
    if (data?.count !== undefined) {
      setPagination((prev) => ({ ...prev, total: data.count }));
    }
  }, [data]);
  const [triggerExport, { isFetching }] = useLazyExportExcelhQuery();
  const [exportPDF, { isFetching: ehtihoyFetching }] = useLazyExportPdfhQuery();
  const handleExport = async () => {
    const blob = await triggerExport().unwrap();

    // Faylni yuklash
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "harakat_tarkibi.xlsx"; // fayl nomi
    document.body.appendChild(a);
    a.click();
    a.remove();
  };
  const handlepdf = async () => {
    const blob = await exportPDF().unwrap();

    // Faylni yuklash
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "harakat_tarkibi.pdf"; // fayl nomi
    document.body.appendChild(a);
    a.click();
    a.remove();
  };
  const getDepoSinc = (id) => {
    navigate(`/harakat-tarkibi-haqida/${id}/`);
  };
  if (depoLoading) {
    return (
      <div className="w-full h-screen flex justify-center items-center">
        <Loading />
      </div>
    );
  }
  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      width: 80,
      sorter: (a, b) => a.id - b.id,
    },
    {
      title: "Harakat tarkibi",
      key: "tarkib_raqami",
      width: 250,
      render: (_, record) => (
        <div className="flex items-center gap-3">
          <Image
            src={record.image}
            width={50}
            height={50}
            className="rounded-[50%]"
          />
          <div>
            <div className="font-medium">{record.tarkib_raqami}</div>
          </div>
        </div>
      ),
      sorter: (a, b) =>
        `${a.tarkib_raqami} ${a.tarkib_raqami}`.localeCompare(
          `${b.tarkib_raqami} ${b.tarkib_raqami}`
        ),
    },
    {
      title: "Turi",
      dataIndex: "turi",
      key: "turi",
      width: 150,
      filters: [...new Set(filteredData?.map((item) => item.turi))].map(
        (g) => ({
          text: g,
          value: g,
        })
      ),
      onFilter: (value, record) => record.turi === value,
    },
    {
      title: "Ishga tushgan yili",
      dataIndex: "ishga_tushgan_vaqti",
      key: "ishga_tushgan_vaqti",
      width: 150,
      render: (text) => {
        const date = new Date(text);
        return date.getFullYear(); // faqat yil
      },
    },
    {
      title: "Eksplutatsiya yili",
      dataIndex: "eksplutatsiya_vaqti",
      key: "eksplutatsiya_vaqti",
      width: 150,
      render: (text) => {
        const date = new Date(text);
        return date.getFullYear(); // faqat yil
      },
    },
    {
      title: "Holati",
      dataIndex: "holati",
      key: "holati",
      width: 150,
      render: (_, record) => (
        <span
          style={{
            backgroundColor:
              record.holati === "Nosozlikda"
                ? "#FEE2E2"
                : record.holati === "Soz_holatda"
                ? "#D1FAE5"
                : record.holati === "Texnik_korikda"
                ? "#FEF3C7"
                : "#E5E7EB", // default
            color:
              record.holati === "Nosozlikda"
                ? "#B91C1C"
                : record.holati === "Soz_holatda"
                ? "#065F46"
                : record.holati === "Texnik_korikda"
                ? "#78350F"
                : "#374151", // default
            padding: "2px 6px",
            borderRadius: "4px",
          }}
        >
          {record.holati === "Nosozlikda"
            ? "Nosozlikda"
            : record.holati === "Soz_holatda"
            ? "Soz holatda"
            : record.holati === "Texnik_korikda"
            ? "Texnik ko'rikda"
            : "-"}{" "}
          {/* default */}
        </span>
      ),
    },
    {
      title: "Yaratuvchi",
      key: "created_by",
      width: 100,
      render: (_, record) => (
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-sm">
            <span>{record.created_by}</span>
          </div>
        </div>
      ),
    },
    {
      title: "Yaratilgan sana",
      dataIndex: "created_at",
      key: "created_at",
      width: 150,
      render: (date) => (
        <div className="flex items-center gap-2">
          <CalendarOutlined />
          <span>{dayjs(date).format("DD.MM.YYYY")}</span>
        </div>
      ),
      sorter: (a, b) => dayjs(a.created_at).unix() - dayjs(b.created_at).unix(),
    },
    {
      title: "Ko'rish",
      key: "actions",
      width: 150,
      fixed: "right",
      render: (_, record) => (
        <Space size="small">
          <Tooltip title="Ko'rish">
            <Button
              type="text"
              icon={<Eye style={{ color: "#5E78D9" }} />}
              onClick={() => getDepoSinc(record.id)}
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  return (
    <div className=" bg-gray-50 min-h-screen">
      <div className="bg-white rounded-lg shadow-sm">
        <div className="p-4 border-b border-gray-200 w-full flex justify-between items-center">
          <div className="flex items-center gap-3 bg-blue-600 p-2 rounded-xl">
            <Image
              src={dataDepo?.image}
              alt={dataDepo?.depo_nomi}
              width={100}
              className="rounded-md"
            />

            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-bold text-white">
                  {dataDepo?.depo_nomi} ({dataDepo?.qisqacha_nomi})
                </h1>

                {/* 🔹 Ant Design Badge */}
                <Badge
                  count={
                    <span className="flex items-center text-sm font-medium text-blue-600">
                      <CheckCircleOutlined className="text-white text-xs pr-1" />
                      faol
                    </span>
                  }
                  style={{
                    backgroundColor: "white",
                    boxShadow: "0 0 4px rgba(46, 80, 233, 0.6)",
                    padding: "4px 8px",
                    borderRadius: "12px",
                  }}
                />
              </div>

              <p className="text-white font-bold text-xl">
                deposidagi barcha harakat tarkiblari
              </p>
            </div>
          </div>
          <Input.Search
            placeholder="Tarkib raqami bo‘yicha qidirish..."
            allowClear
            onSearch={(value) => {
              setPagination((prev) => ({ ...prev, current: 1 }));
              setSearch(value);
            }}
            style={{ maxWidth: 700 }}
            size="large"
          />
          <div className="flex justify-center items-center gap-5">
            <Button
              variant="solid"
              color="volcano"
              icon={<DownloadOutlined />}
              loading={ehtihoyFetching}
              onClick={handlepdf}
              size="large"
            >
              Export PDF
            </Button>
            <Button
              variant="solid"
              color="green"
              size="large"
              icon={<DownloadOutlined />}
              loading={isFetching}
              onClick={handleExport}
            >
              Export Excel
            </Button>
          </div>
        </div>

        <div className="p-6">
          {isLoading || isFetching ? (
            <Skeleton active paragraph={{ rows: 10 }} />
          ) : (
            <Table
              columns={columns}
              dataSource={filteredData}
              loading={isLoading}
              rowKey="id"
              pagination={{
                current: pagination.current,
                pageSize: pagination.pageSize,
                total: filteredData?.length || 0,
                showTotal: (total, range) =>
                  `${range[0]}-${range[1]} dan jami ${total} ta`,
              }}
              onChange={handleTableChange} // 🔹 MUHIM QO‘SHILISH
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
                          Hozircha ma'lumotlar mavjud emas
                        </p>
                      </div>
                    }
                  />
                ),
              }}
              className="border border-gray-200 rounded-lg"
            />
          )}
        </div>
      </div>
    </div>
  );
}
