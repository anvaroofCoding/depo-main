import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  Table,
  Button,
  Space,
  Modal,
  Form,
  Input,
  Empty,
  DatePicker,
} from "antd";
import { CalendarOutlined, PlusOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import {
  useAddEhtiyotFetailMutation,
  useGetDetailehtiyotqismQuery,
} from "@/services/api";
import Loading from "@/components/loading/loading";
import { toast, Toaster } from "sonner";

export default function EhtiyotDetail() {
  const [isAddModal, SetIsAddModal] = useState(false);
  const [formAdd] = Form.useForm();
  const { id } = useParams();
  const { RangePicker } = DatePicker;

  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 20,
    total: 0,
  });

  //   get ehtiyot qism details
  const { data, isLoading } = useGetDetailehtiyotqismQuery({
    limit: pagination.pageSize,
    page: pagination.current,
    id,
  });

  const [addEhtiyotFetail, { isLoading: load, error: errr }] =
    useAddEhtiyotFetailMutation();

  useEffect(() => {
    if (data?.count !== undefined) {
      setPagination((prev) => ({ ...prev, total: data?.count }));
    }
  }, [data]);

  if (isLoading || load) {
    return (
      <div className="w-full h-screen flex justify-center items-center">
        <Loading />
      </div>
    );
  }

  if (errr) {
    toast.error(errr?.data?.message);
  }
  const handleTableChange = (newPagination) => {
    setPagination((prev) => ({
      ...prev,
      current: newPagination.current,
      pageSize: newPagination.pageSize,
    }));
  };

  const handleSubmit = async (values) => {
    const formData = new FormData();
    formData.append("miqdor", values.miqdor);
    try {
      if (values.miqdor > 0) {
        await addEhtiyotFetail({ id, formData }).unwrap();
        toast.success("Ehtiyot qism miqdori muvaffaqiyatli qo‘shildi!");
      } else {
        toast.warning("Miqdor 0 dan katta bo'lishi kerak!");
      }
      SetIsAddModal(false);
      formAdd.resetFields();
    } catch (err) {
      toast.error(err?.data?.message || "Xatolik yuz berdi!");
    }
  };

  const handeModal = () => {
    SetIsAddModal(true);
  };

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      width: 80,
      sorter: (a, b) => a.id - b.id,
    },
    {
      title: "Miqdori",
      // dataIndex: "miqdor",
      key: "nomenklatura_raqami",
      width: 150,
      render: (_, record) => (
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-sm">
            <span>
              {record.miqdor} {data.birligi}
            </span>
          </div>
        </div>
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
      width: 200,
      render: (date) => (
        <div className="flex items-center gap-2">
          <CalendarOutlined />
          <span>{dayjs(date).format("DD.MM.YYYY HH:mm")}</span>
        </div>
      ),
      sorter: (a, b) => dayjs(a.created_at).unix() - dayjs(b.created_at).unix(),

      // Sana filter
      filterDropdown: ({
        setSelectedKeys,
        selectedKeys,
        confirm,
        clearFilters,
      }) => (
        <div style={{ padding: 8 }}>
          <RangePicker
            value={selectedKeys[0] || []}
            onChange={(dates) => {
              setSelectedKeys(dates ? [dates] : []);
            }}
            format="DD.MM.YYYY"
          />
          <div className="flex justify-end gap-2 mt-2">
            <a
              onClick={() => {
                confirm(); // filterni qo‘llash
              }}
            >
              Qidirish
            </a>
            <a
              onClick={() => {
                clearFilters();
                confirm();
              }}
            >
              Tozalash
            </a>
          </div>
        </div>
      ),
      onFilter: (value, record) => {
        const [start, end] = value;
        const recordDate = dayjs(record.created_at);
        return (
          recordDate.isAfter(start, "day") && recordDate.isBefore(end, "day")
        );
      },
    },
  ];

  return (
    <div className=" bg-gray-50 min-h-screen">
      <Toaster position="top-center" />
      <div className="bg-white rounded-lg shadow-sm">
        <div className="p-4 border-b border-gray-200 w-full flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">
            Ehtiyot qism nomi: {data.ehtiyotqism_nomi}
          </h1>
          <Button
            variant="solid"
            color="primary"
            icon={<PlusOutlined />}
            onClick={handeModal}
          >
            Qo'shish
          </Button>
        </div>

        <div className="p-6">
          <Table
            columns={columns}
            dataSource={data.history.map((item, index) => ({
              ...item,
              key: item.id || index, // id bo‘lsa id, bo‘lmasa indexdan foydalanamiz
            }))}
            loading={isLoading}
            pagination={{
              current: pagination.current,
              pageSize: pagination.pageSize,
              total: pagination.total,
              pageSizeOptions: ["5", "10", "20", "50"],
              showTotal: (total, range) =>
                `${range[0]}-${range[1]} dan jami ${total} ta`,
            }}
            onChange={handleTableChange}
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
        </div>
      </div>

      {/* View Modal */}
      <Modal
        title="Ehtiyot qism miqdorini qo'shish"
        open={isAddModal}
        onCancel={() => {
          SetIsAddModal(false);
          formAdd.resetFields();
        }}
        okText="Saqlash"
        cancelText="Bekor qilish"
        width={600}
        onOk={() => formAdd.submit()}
      >
        <Form form={formAdd} layout="vertical" onFinish={handleSubmit}>
          <Form.Item
            name="miqdor"
            label="Ehtiyot qism miqdori"
            rules={[
              {
                required: true,
                message: "Ehtiyot qism miqdorini kiritish majburiy!",
              },
            ]}
          >
            <Input placeholder="Ehtiyor qism miqdorini yozing..." />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
