import { useEffect, useState } from "react";
import {
  Table,
  Button,
  Space,
  Modal,
  Form,
  Input,
  Tooltip,
  Empty,
  message,
  Select,
} from "antd";
import {
  EditOutlined,
  DeleteOutlined,
  CalendarOutlined,
  PlusOutlined,
  DownloadOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
import {
  useAddehtiyotMutation,
  useDeleteehtiyotMutation,
  useGetehtiyotQuery,
  useLazyExportExcelQuery,
  useLazyExportPdfQuery,
  useUpdateehtiyotMutation,
} from "@/services/api";
import Loading from "@/components/loading/loading";

export default function Ehtiyotqismlar() {
  const [messageApi, contextHolder] = message.useMessage();
  const [isEditModal, setIsEditModal] = useState(false);
  const [editingDepo, setEditingDepo] = useState(null); // tahrir qilinayotgan depo
  const [formEdit] = Form.useForm();
  const [isAddModal, SetIsAddModal] = useState(false);
  const [formAdd] = Form.useForm();
  const { Option } = Select;
  const [search, setSearch] = useState("");

  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });

  //get
  const { data, isLoading, isError, error } = useGetehtiyotQuery({
    limit: pagination.pageSize,
    page: pagination.current,
    search,
  });

  useEffect(() => {
    if (data?.count !== undefined) {
      setPagination((prev) => ({ ...prev, total: data.count }));
    }
  }, [data]);

  const handleTableChange = (newPagination) => {
    setPagination((prev) => ({
      ...prev,
      current: newPagination.current,
      pageSize: newPagination.pageSize,
    }));
  };

  //post
  const [addtarkib, { isLoading: load, error: errr }] = useAddehtiyotMutation();
  //edit
  const [updateDepo, { isLoading: loadders }] = useUpdateehtiyotMutation();
  // delete
  const [deleteDep, { isLoading: loadder }] = useDeleteehtiyotMutation();
  //excel
  const [triggerExport, { isFetching }] = useLazyExportExcelQuery();
  // pdf
  const [exportPDF, { isFetching: ehtihoyFetching }] = useLazyExportPdfQuery();

  const handleExport = async () => {
    const blob = await triggerExport().unwrap();

    // Faylni yuklash
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "ehtiyot_qismlari.xlsx"; // fayl nomi
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
    a.download = "ehtiyot_qismlari.pdf"; // fayl nomi
    document.body.appendChild(a);
    a.click();
    a.remove();
  };

  const handleSubmit = async (values) => {
    const formData = new FormData();
    formData.append("ehtiyotqism_nomi", values.ehtiyotqism_nomi);
    formData.append("nomenklatura_raqami", values.nomenklatura_raqami);
    formData.append("birligi", values.birligi);

    try {
      await addtarkib(formData).unwrap();
      messageApi.success("Depo muvaffaqiyatli qo‘shildi!");
      SetIsAddModal(false);
      formAdd.resetFields();
    } catch (err) {
      console.error("Xato:", err);
      messageApi.error("Xatolik yuz berdi!");
    }
  };

  const handleDelete = async (tarkib) => {
    try {
      await deleteDep(tarkib.id).unwrap();
      messageApi.success(
        `Harakat tarkibi "${tarkib.tarkib_raqami}" muvaffaqiyatli o'chirildi!`
      );
    } catch (err) {
      console.error(err);
      messageApi.error("Xatolik yuz berdi!");
    }
  };

  if (isLoading || load || loadders || loadder) {
    return (
      <div className="w-full h-screen flex justify-center items-center">
        <Loading />
      </div>
    );
  }
  console.log(data.results);
  if (errr) {
    messageApi.error(errr);
  }

  if (isError) {
    // RTK Query dagi `error` obyekt
    console.log("Xato obyekt:", error);

    return (
      <div>
        <h3>Xato yuz berdi</h3>
        <pre>{JSON.stringify(error, null, 2)}</pre>
      </div>
    );
  }

  const handleAdd = () => {
    SetIsAddModal(true);
  };

  const handleEdit = (depo) => {
    setEditingDepo(depo);
    formEdit.setFieldsValue({
      ehtiyotqism_nomi: depo.ehtiyotqism_nomi,
      nomenklatura_raqami: depo.nomenklatura_raqami,
      birligi: depo.birligi,
    });
    setIsEditModal(true);
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
      title: "Ehtiyot qism nomi",
      key: "ehtiyotqism_nomi",
      dataIndex: "ehtiyotqism_nomi",
      width: 150,
    },
    {
      title: "Nomenklatura raqami",
      dataIndex: "nomenklatura_raqami",
      key: "nomenklatura_raqami",
      width: 150,
    },
    {
      title: "Birligi",
      dataIndex: "birligi",
      key: "birligi",
      width: 150,
      filters: [...new Set(data.results.map((item) => item.birligi))].map(
        (g) => ({
          text: g,
          value: g,
        })
      ),
      onFilter: (value, record) => record.birligi === value,
      render: (_, record) => (
        <span
          style={{
            backgroundColor:
              record.birligi === "dona"
                ? "#FEE2E2" // red-100
                : record.birligi === "para"
                ? "#DBEAFE" // blue-100
                : record.birligi === "litr"
                ? "#CCFBF1" // teal-100
                : record.birligi === "metr"
                ? "#FFEDD5" // orange-100
                : "#F3F4F6", // gray-100 (default)

            color:
              record.birligi === "dona"
                ? "#B91C1C" // red-700
                : record.birligi === "para"
                ? "#1D4ED8" // blue-700
                : record.birligi === "litr"
                ? "#0F766E" // teal-700
                : record.birligi === "metr"
                ? "#9A3412" // orange-800
                : "#374151", // gray-700 (default)

            padding: "2px 6px",
            borderRadius: "6px",
            fontWeight: 500,
          }}
        >
          {record.birligi === "dona"
            ? "Dona"
            : record.birligi === "para"
            ? "Para"
            : record.birligi === "litr"
            ? "Litr"
            : record.birligi === "metr"
            ? "Metr"
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
      title: "Amallar",
      key: "actions",
      width: 150,
      fixed: "right",
      render: (_, record) => (
        <Space size="small">
          <Tooltip title="Tahrirlash">
            <Button
              type="text"
              icon={<EditOutlined />}
              // onClick={() => handleEdit(record)}
              onClick={() => handleEdit(record)}
            />
          </Tooltip>
          <Tooltip title="O'chirish">
            <Button
              type="text"
              icon={<DeleteOutlined />}
              onClick={() => handleDelete(record)}
              danger
              disabled
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  return (
    <div className=" bg-gray-50 min-h-screen">
      {contextHolder}
      <div className="bg-white rounded-lg shadow-sm">
        <div className="p-4 border-b border-gray-200 w-full flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">
            Ehtiyot qismlarini ro'yxatga olish
          </h1>
          <Input.Search
            placeholder="Tarkib raqami bo‘yicha qidirish..."
            allowClear
            onSearch={(value) => {
              setPagination((prev) => ({ ...prev, current: 1 })); // 1-sahifaga qaytamiz
              setSearch(value);
            }}
            style={{ width: 500 }}
          />
          <div className="flex justify-center items-center gap-5">
            <Button
              variant="solid"
              color="volcano"
              icon={<DownloadOutlined />}
              loading={ehtihoyFetching}
              onClick={handlepdf}
            >
              Export PDF
            </Button>
            <Button
              variant="solid"
              color="green"
              icon={<DownloadOutlined />}
              loading={isFetching}
              onClick={handleExport}
            >
              Export Excel
            </Button>
            <Button
              variant="solid"
              color="primary"
              icon={<PlusOutlined />}
              onClick={handleAdd}
            >
              Qo'shish
            </Button>
          </div>
        </div>

        <div className="p-6">
          <Table
            columns={columns}
            dataSource={data.results.map((item, index) => ({
              ...item,
              key: item.id || index, // id bo‘lsa id, bo‘lmasa indexdan foydalanamiz
            }))}
            loading={isLoading}
            pagination={{
              current: pagination.current,
              pageSize: pagination.pageSize,
              total: pagination.total,
              showSizeChanger: true,
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

      {/* Edit Modal */}
      <Modal
        title="Ehtiyot qismni tahrirlash"
        open={isEditModal}
        onCancel={() => setIsEditModal(false)}
        okText="Saqlash"
        cancelText="Bekor qilish"
        onOk={() => formEdit.submit()} // OK bosilganda form submit bo‘ladi
      >
        <Form
          form={formEdit}
          layout="vertical"
          onFinish={async (values) => {
            const formData = new FormData();
            formData.append("ehtiyotqism_nomi", values.ehtiyotqism_nomi);
            formData.append("nomenklatura_raqami", values.nomenklatura_raqami);
            formData.append("birligi", values.birligi);
            try {
              await updateDepo({ id: editingDepo.id, data: formData }).unwrap();
              messageApi.success("Harakat tarkibi muvaffaqiyatli tahrirlandi!");
              setIsEditModal(false);
            } catch (err) {
              console.error(err);
              messageApi.error("Xatolik yuz berdi!");
            }
          }}
        >
          <Form.Item
            name="ehtiyotqism_nomi"
            label="Ehtiyot qism nomi"
            rules={[
              { required: true, message: "Ehtiyot qism nomi yozish majburiy!" },
            ]}
          >
            <Input placeholder="Ehtiyot qism nomini yozing..." />
          </Form.Item>

          <Form.Item
            name="nomenklatura_raqami"
            label="Nomenklatura raqami"
            rules={[
              {
                required: true,
                message: "Nomenklatura raqamini kiritish majburiy!",
              },
            ]}
          >
            <Input placeholder="Nomenklatura raqamini yozing..." />
          </Form.Item>

          <Form.Item
            name="birligi"
            label="Birligi"
            rules={[{ required: true, message: "Birlikni kiritish majburiy!" }]}
          >
            <Select placeholder="Birlikni tanlang">
              <Option value="dona">Dona</Option>
              <Option value="para">Para</Option>
              <Option value="metr">Metr</Option>
              <Option value="litr">Litr</Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>

      {/* View Modal */}
      <Modal
        title="Ehtiyot qismini qo'shish"
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
            name="ehtiyotqism_nomi"
            label="Ehtiyot qism nomi"
            rules={[
              { required: true, message: "Ehtiyot qism nomi yozish majburiy!" },
            ]}
          >
            <Input placeholder="Ehtiyot qism nomini yozing..." />
          </Form.Item>

          <Form.Item
            name="nomenklatura_raqami"
            label="Nomenklatura raqami"
            rules={[
              {
                required: true,
                message: "Nomenklatura raqamini kiritish majburiy!",
              },
            ]}
          >
            <Input placeholder="Nomenklatura raqamini yozing..." />
          </Form.Item>

          <Form.Item
            name="birligi"
            label="Birligi"
            rules={[{ required: true, message: "Birlikni kiritish majburiy!" }]}
          >
            <Select placeholder="Birlikni tanlang">
              <Option value="dona">Dona</Option>
              <Option value="para">Para</Option>
              <Option value="metr">Metr</Option>
              <Option value="litr">Litr</Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
