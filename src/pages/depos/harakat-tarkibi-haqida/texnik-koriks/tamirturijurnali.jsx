import { useState } from "react";
import {
  Table,
  Button,
  Space,
  Tooltip,
  Empty,
  Image,
  Pagination,
  Skeleton,
} from "antd";
import { EditOutlined, CalendarOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import { useGetTexnikKorikForTablesQuery } from "@/services/api";
import GoBack from "@/components/GoBack";
import { toast, Toaster } from "sonner";

export default function TamirturiJurnali({ datas, tarkib }) {
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 20;
  const { data, isLoading } = useGetTexnikKorikForTablesQuery();
  const filteredData = data?.results?.filter(
    (item) => item?.tamir_turi_nomi === datas && item?.tarkib_nomi == tarkib
  );

  const paginatedData = filteredData?.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      width: 80,
      sorter: (a, b) => a.id - b.id,
    },
    {
      title: "Kirgan vaqti",
      dataIndex: "kirgan_vaqti",
      key: "kirgan_vaqti",
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
      title: "Chiqgan vaqti",
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
      title: "Kim (kimlar) tomonidan texnik ko'rik o'tkazilgan",
      dataIndex: "created_by",
      key: "created_by",
      width: 250,
      render: (_, record) => {
        const users = record?.steps?.results;
        if (!users || users.length === 0) {
          return <span className="text-gray-400">Ma'lumot yo‘q</span>;
        }

        return (
          <div className="flex flex-wrap gap-2">
            {users.map((u, i) => (
              <span
                key={i}
                className="bg-green-100 text-green-700 px-2 py-1 rounded-lg text-sm font-medium"
              >
                {u.created_by || "Noma’lum"}
              </span>
            ))}
          </div>
        );
      },
    },
    {
      title: "Amallar",
      key: "actions",
      width: 200,
      fixed: "right",
      render: (_, record) => (
        <Space size="small">
          <Tooltip title="Tahrirlash">
            <Button type="text" icon={<EditOutlined />} />
          </Tooltip>
        </Space>
      ),
    },
  ];

  // 🔹 Loading paytida Skeleton Table chiqaramiz
  if (isLoading) {
    return (
      <div className="p-6 bg-white rounded-lg shadow-sm mt-10">
        <Skeleton active paragraph={{ rows: 6 }} />
        <Skeleton active paragraph={{ rows: 6 }} />
        <Skeleton active paragraph={{ rows: 6 }} />
      </div>
    );
  }

  console.log(filteredData);

  return (
    <div className="bg-gray-50 min-h-screen mt-10">
      <Toaster position="bottom-center" richColors />
      <div className="bg-white rounded-lg shadow-sm">
        <div className="p-4 border-b border-gray-200 w-full flex justify-between items-center">
          <div className="flex items-center gap-4 justify-center">
            <h1 className="text-3xl font-bold text-gray-900">
              {datas} texnik ko‘rigi tarixi
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
              total={filteredData?.length}
              onChange={(page) => setCurrentPage(page)}
              showSizeChanger={false}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
