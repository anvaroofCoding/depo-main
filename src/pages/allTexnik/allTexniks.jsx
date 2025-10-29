"use client";

import Loading from "@/components/loading/loading";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  useLazyExporExcelAllTexnikKorikQuery,
  useLazyExporPDFAllTexnikKorikQuery,
  useLazyExporPDFAllTexnikKorikTexnikQuery,
  useTexnikHOlatStatistikQuery,
} from "@/services/api";
import {
  CalendarOutlined,
  DownloadOutlined,
  EyeFilled,
  FilterOutlined,
} from "@ant-design/icons";
import { Button, Empty, Table, Tooltip } from "antd";
import dayjs from "dayjs";
import { useEffect, useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import { toast, Toaster } from "sonner";

export default function AllTexnikKoriklar() {
  const location = useLocation();

  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 20,
    total: 0,
  });

  const { data, isLoading } = useTexnikHOlatStatistikQuery();

  useEffect(() => {
    if (data?.count !== undefined) {
      setPagination((prev) => ({ ...prev, total: data.count }));
    }
  }, [data]);

  const [triggerExport, { isFetching }] =
    useLazyExporExcelAllTexnikKorikQuery();

  const [exportPDF2, { isFetching: ehtihoyFetching }] =
    useLazyExporPDFAllTexnikKorikQuery();

  const [exportPDF1, { isFetching: ehtihoyFetchings }] =
    useLazyExporPDFAllTexnikKorikTexnikQuery();

  const handleExport = async () => {
    try {
      const blob = await triggerExport().unwrap();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `Barcha-texnik-koriklar.xlsx`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
      toast.success("Excel fayl muvaffaqiyatli yuklab olindi");
    } catch (error) {
      toast.error("Excel yuklab olishda xatolik yuz berdi");
      console.log(error);
    }
  };

  const handlePDFTexnik = async () => {
    try {
      const blob = await exportPDF1().unwrap();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `Barcha-texnik-koriklar-koriklar.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
      toast.success("PDF fayl muvaffaqiyatli yuklab olindi");
    } catch (error) {
      toast.error("PDF yuklab olishda xatolik yuz berdi");
      console.log(error);
    }
  };

  const handlePDFNosoz = async () => {
    try {
      const blob = await exportPDF2().unwrap();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `Barcha-nosozlik-koriklar.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
      toast.success("PDF fayl muvaffaqiyatli yuklab olindi");
    } catch (error) {
      toast.error("PDF yuklab olishda xatolik yuz berdi");
      console.log(error);
    }
  };

  const paginatedDatas = useMemo(() => {
    const safeData = data?.texnik_korikda_tarkiblar ?? [];
    const start = (pagination.current - 1) * pagination.pageSize;
    const end = start + pagination.pageSize;
    return safeData.slice(start, end);
  }, [data, pagination]);

  const paginatedDatass = useMemo(() => {
    const safeData = data?.nosozlikda_tarkiblar ?? [];
    const start = (pagination.current - 1) * pagination.pageSize;
    const end = start + pagination.pageSize;
    return safeData.slice(start, end);
  }, [data, pagination]);

  if (isLoading) {
    return (
      <div className="w-full h-screen flex justify-center items-center">
        <Loading />
      </div>
    );
  }
  const handleDetails = (nosozlik_id) => {
    window.location.href = `texnik-ko'rik-qoshish/texnik-korik-details/${nosozlik_id}`;
  };
  const NosozhandleDetails = (korik_id) => {
    window.location.href = `defective-details/${korik_id}`;
  };
  const columns = [
    {
      title: "№",
      dataIndex: "index",
      key: "index",
      align: "center",
      width: 70,
      render: (_, __, index) => <strong>{index + 1}</strong>,
    },
    {
      title: "Tarkib nomi",
      key: "tarkib_raqami",
      width: 150,
      render: (_, record) => (
        <div className="font-medium text-gray-900 truncate flex items-center gap-2">
          {record?.tarkib_raqami}
        </div>
      ),
    },

    {
      title: "Kirgan vaqti",
      dataIndex: "created_at",
      key: "created_at",
      width: 140,
      render: (date) => (
        <div className="text-sm text-gray-600">
          {dayjs(date).format("DD.MM.YYYY HH:mm")}
        </div>
      ),
      sorter: (a, b) => dayjs(a.created_at).unix() - dayjs(b.created_at).unix(),
    },
    {
      title: "Yaratuvchi",
      dataIndex: "created_by",
      key: "created_by",
      width: 120,
      render: (text) => <div className="text-sm text-gray-700">{text}</div>,
    },
    {
      title: "Amallar",
      key: "actions",
      width: 80,
      fixed: "right",
      align: "center",
      render: (_, record) => (
        <Tooltip title="Batafsil ko'rish">
          <Button
            type="text"
            icon={<EyeFilled />}
            onClick={() => NosozhandleDetails(record.nosozlik_id)}
            className="text-blue-600 hover:text-blue-800"
          />
        </Tooltip>
      ),
    },
  ];
  const columnsTwo = [
    {
      title: "№",
      dataIndex: "index",
      key: "index",
      align: "center",
      width: 70,
      render: (_, __, index) => <strong>{index + 1}</strong>,
    },
    {
      title: "Tarkib raqami",
      dataIndex: "tarkib_raqami",
      key: "tarkib_raqami",
      width: 180,
      render: (_, record) => (
        <div className="font-medium text-gray-900 truncate flex items-center gap-2">
          {record?.tarkib_raqami}
        </div>
      ),
    },
    {
      title: "Tamir turi",
      dataIndex: "tamir_turi",
      key: "tamir_turi",
      width: 120,
      filters: [...new Set(data?.results?.map((item) => item.tamir_turi))].map(
        (g) => ({
          text: g,
          value: g,
        })
      ),
      onFilter: (value, record) => record.tamir_turi === value,
    },

    {
      title: "Kirgan vaqti",
      dataIndex: "created_at",
      key: "created_at",
      width: 140,
      render: (date) => (
        <div className="text-sm text-gray-600">
          {dayjs(date).format("DD.MM.YYYY HH:mm")}
        </div>
      ),
      sorter: (a, b) => dayjs(a.created_at).unix() - dayjs(b.created_at).unix(),
    },
    {
      title: "Yaratuvchi",
      dataIndex: "created_by",
      key: "created_by",
      width: 120,
      render: (text) => <div className="text-sm text-gray-700">{text}</div>,
    },
    {
      title: "Amallar",
      key: "actions",
      width: 80,
      fixed: "right",
      align: "center",
      render: (_, record) => (
        <Tooltip title="Batafsil ko'rish">
          <Button
            type="text"
            icon={<EyeFilled />}
            onClick={() => handleDetails(record.korik_id)}
            className="text-blue-600 hover:text-blue-800"
          />
        </Tooltip>
      ),
    },
  ];

  // URLga qarab aktiv tabni aniqlaymiz
  let activeTab = "birinchi"; // default
  if (location.pathname.includes("texnik")) activeTab = "ikkinchi";
  if (location.pathname.includes("nosozlik")) activeTab = "birinchi";
  return (
    <div className="min-h-screen  p-6">
      <Toaster position="bottom-center" richColors />
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Hozirgi barcha texnik ko'riklar va nosozliklar ro'yxati
        </h1>
      </div>

      <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
        <div className="p-6">
          <Tabs defaultValue={activeTab} className="w-full">
            <div className="mb-6 border-b border-gray-200">
              <TabsList className="grid grid-cols-2 w-full max-w-md bg-gray-100 p-1 rounded-lg">
                <TabsTrigger
                  value="birinchi"
                  className="data-[state=active]:bg-white data-[state=active]:text-blue-600 data-[state=active]:shadow-sm rounded-md transition-all"
                >
                  <span className="flex items-center gap-2">
                    <FilterOutlined className="text-lg" />
                    Nosozliklar
                  </span>
                </TabsTrigger>
                <TabsTrigger
                  value="ikkinchi"
                  className="data-[state=active]:bg-white data-[state=active]:text-blue-600 data-[state=active]:shadow-sm rounded-md transition-all"
                >
                  <span className="flex items-center gap-2">
                    <CalendarOutlined className="text-lg" />
                    Texnik Ko'riklar
                  </span>
                </TabsTrigger>
              </TabsList>
            </div>

            {/* === Nosozliklar Tab === */}
            <TabsContent value="birinchi" className="mt-0">
              <div className="space-y-4">
                <Table
                  columns={columns}
                  dataSource={paginatedDatass.map((item, index) => ({
                    ...item,
                    key: item.id || index,
                  }))}
                  loading={isLoading}
                  pagination={{
                    current: pagination.current,
                    pageSize: pagination.pageSize,
                    total: data?.nosozlikda_tarkiblar?.length || 0,
                    pageSizeOptions: ["5", "10", "20", "50"],
                    showTotal: (total, range) =>
                      `${range[0]}-${range[1]} dan jami ${total} ta`,
                    onChange: (page, pageSize) => {
                      setPagination({ current: page, pageSize });
                    },
                    className: "mt-4",
                  }}
                  scroll={{ x: 1000 }}
                  locale={{
                    emptyText: (
                      <Empty
                        image={Empty.PRESENTED_IMAGE_SIMPLE}
                        description={
                          <div className="text-center py-12">
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">
                              Hech narsa topilmadi
                            </h3>
                            <p className="text-gray-500">
                              Hozircha nosozliklar mavjud emas
                            </p>
                          </div>
                        }
                      />
                    ),
                  }}
                  className="border-0 shadow-sm rounded-lg overflow-hidden"
                  rowClassName="hover:bg-blue-50 transition-colors"
                />

                <div className="flex justify-end items-center gap-3 pt-4 border-t border-gray-200">
                  <Button
                    type="primary"
                    danger
                    size="large"
                    icon={<DownloadOutlined />}
                    loading={ehtihoyFetching}
                    onClick={handlePDFNosoz}
                    className="rounded-lg"
                  >
                    PDF Yuklab Olish (Nosozliklar)
                  </Button>
                  <Button
                    type="primary"
                    size="large"
                    icon={<DownloadOutlined />}
                    loading={isFetching}
                    onClick={handleExport}
                    className="bg-green-600 hover:bg-green-700 rounded-lg"
                  >
                    Excel Yuklab Olish
                  </Button>
                </div>
              </div>
            </TabsContent>

            {/* === Texnik Ko'riklar Tab === */}
            <TabsContent value="ikkinchi" className="mt-0">
              <div className="space-y-4">
                <Table
                  columns={columnsTwo}
                  dataSource={paginatedDatas.map((item, index) => ({
                    ...item,
                    key: item.id || index,
                  }))}
                  loading={isLoading}
                  pagination={{
                    current: pagination.current,
                    pageSize: pagination.pageSize,
                    total: data?.texnik_korikda_tarkiblar?.length || 0,
                    pageSizeOptions: ["5", "10", "20", "50"],
                    showTotal: (total, range) =>
                      `${range[0]}-${range[1]} dan jami ${total} ta`,
                    onChange: (page, pageSize) => {
                      setPagination({ current: page, pageSize });
                    },
                    className: "mt-4",
                  }}
                  scroll={{ x: 1000 }}
                  locale={{
                    emptyText: (
                      <Empty
                        image={Empty.PRESENTED_IMAGE_SIMPLE}
                        description={
                          <div className="text-center py-12">
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">
                              Hech narsa topilmadi
                            </h3>
                            <p className="text-gray-500">
                              Hozircha texnik ko'riklar mavjud emas
                            </p>
                          </div>
                        }
                      />
                    ),
                  }}
                  className="border-0 shadow-sm rounded-lg overflow-hidden"
                  rowClassName="hover:bg-blue-50 transition-colors"
                />

                <div className="flex justify-end items-center gap-3 pt-4 border-t border-gray-200">
                  <Button
                    type="primary"
                    danger
                    size="large"
                    icon={<DownloadOutlined />}
                    loading={ehtihoyFetchings}
                    onClick={handlePDFTexnik}
                    className="rounded-lg"
                  >
                    PDF Yuklab Olish (Texnik ko'rik)
                  </Button>
                  <Button
                    type="primary"
                    size="large"
                    icon={<DownloadOutlined />}
                    loading={isFetching}
                    onClick={handleExport}
                    className="bg-green-600 hover:bg-green-700 rounded-lg"
                  >
                    Excel Yuklab Olish
                  </Button>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
