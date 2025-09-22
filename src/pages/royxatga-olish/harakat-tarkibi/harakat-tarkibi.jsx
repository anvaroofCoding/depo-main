import Loading from "@/components/loading/loading";
import {
  useAddtarkibMutation,
  useDeleteTarkibMutation,
  useGetDepQuery,
  useGetharakatQuery,
  useLazyExportExcelhQuery,
  useLazyExportPdfhQuery,
  useUpdateHarakatMutation,
} from "@/services/api";
import {
  CalendarOutlined,
  DeleteOutlined,
  DownloadOutlined,
  EditOutlined,
  PlusOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import {
  Button,
  DatePicker,
  Empty,
  Form,
  Image,
  Input,
  message,
  Modal,
  Select,
  Space,
  Table,
  Tooltip,
  Upload,
} from "antd";
import dayjs from "dayjs";
import { useEffect, useState } from "react";

export default function Harakattarkibi() {
  const [form] = Form.useForm();
  const [search, setSearch] = useState("");

  const [messageApi, contextHolder] = message.useMessage();
  const [isEditModal, setIsEditModal] = useState(false);
  const [editingDepo, setEditingDepo] = useState(null); // tahrir qilinayotgan depo
  const [formEdit] = Form.useForm();
  const [isAddModal, SetIsAddModal] = useState(false);
  const [formAdd] = Form.useForm();
  const { Option } = Select;

  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 8,
    total: 0,
  });

  //get
  const { data, isLoading, isError, error } = useGetharakatQuery({
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
      // agar pageSize o'zgargan bo'lsa currentni 1 ga qaytarishni xohlasang:
      current: newPagination.current,
      pageSize: newPagination.pageSize,
    }));
  };

  //post
  const [addtarkib, { isLoading: load, error: errr }] = useAddtarkibMutation();
  //edit
  const [updateDepo, { isLoading: loadders }] = useUpdateHarakatMutation();
  // delete
  const [deleteDep, { isLoading: loadder }] = useDeleteTarkibMutation();
  // get depo
  const { data: dataDepo } = useGetDepQuery();

  const [triggerExport, { isFetching }] = useLazyExportExcelhQuery();
  // pdf
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

  const handleSubmit = async (values) => {
    const formData = new FormData();
    formData.append("depo_id", values.depo_id);
    if (values.ishga_tushgan_vaqti) {
      formData.append(
        "ishga_tushgan_vaqti",
        values.ishga_tushgan_vaqti.format("YYYY-MM-DD") // yoki "DD-MM-YYYY"
      );
    }
    formData.append("guruhi", values.guruhi);
    formData.append("turi", values.turi);
    formData.append("tarkib_raqami", values.tarkib_raqami);
    formData.append("eksplutatsiya_vaqti", values.eksplutatsiya_vaqti);

    if (values.image && values.image[0]) {
      const file = values.image[0].originFileObj;
      formData.append("image", file, file.name);
    }

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

  if (errr) {
    message.error(errr);
  }

  if (isError) {
    console.log("Xato obyekt:", error);
  }

  const handleAdd = () => {
    SetIsAddModal(true);
  };

  const handleEdit = (depo) => {
    setEditingDepo(depo);
    formEdit.setFieldsValue({
      depo_id: depo.depo_id,
      ishga_tushgan_vaqti: depo.ishga_tushgan_vaqti
        ? dayjs(depo.ishga_tushgan_vaqti, "DD-MM-YYYY")
        : null,
      guruhi: depo.guruhi,
      turi: depo.turi,
      tarkib_raqami: depo.tarkib_raqami,
      eksplutatsiya_vaqti: depo.eksplutatsiya_vaqti,
      image: depo.image ? [{ url: depo.image }] : [],
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
      title: "Depo nomi",
      key: "depo",
      width: 150,
      render: (_, record) => (
        <div className="flex items-center gap-3">
          <Image
            src={record.image}
            width={50}
            height={50}
            className="rounded-[50%]"
          />
          <div>
            <div className="font-medium">{record.depo}</div>
          </div>
        </div>
      ),
      sorter: (a, b) =>
        `${a.depo} ${a.depo}`.localeCompare(`${b.depo} ${b.depo}`),
    },
    {
      title: "Guruhi",
      dataIndex: "guruhi",
      key: "guruhi",
      width: 150,
      filters: [...new Set(data?.results?.map((item) => item.guruhi))].map(
        (g) => ({
          text: g,
          value: g,
        })
      ),
      onFilter: (value, record) => record.guruhi === value,
    },
    {
      title: "Turi",
      dataIndex: "turi",
      key: "turi",
      width: 150,
      filters: [...new Set(data?.results?.map((item) => item.guruhi))].map(
        (g) => ({
          text: g,
          value: g,
        })
      ),
      onFilter: (value, record) => record.guruhi === value,
    },
    {
      title: "Tarkib raqami ",
      dataIndex: "tarkib_raqami",
      key: "tarkib_raqami",
      width: 200,
    },
    {
      title: "Ishga tushgan vaqti ",
      dataIndex: "ishga_tushgan_vaqti",
      key: "ishga_tushgan_vaqti",
      width: 150,
    },
    {
      title: "Hozirgi yurgan masofasi (km)",
      dataIndex: "total_kilometr",
      key: "total_kilometr",
      width: 150,
    },
    {
      title: "Eksplutatsiya mosofasi (km)",
      dataIndex: "eksplutatsiya_vaqti",
      key: "eksplutatsiya_vaqti",
      width: 150,
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
            Harakat tarkibini ro'yxatga olish
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
            dataSource={data?.results?.map((item, index) => ({
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
        title="Harakat tarkibini tahrirlash"
        open={isEditModal}
        onCancel={() => {
          setIsEditModal(false);
          formEdit.resetFields(); // ❌ Modal yopilganda ham forma tozalanadi
        }}
        okText="Saqlash"
        cancelText="Bekor qilish"
        onOk={() => formEdit.submit()} // OK bosilganda form submit bo‘ladi
      >
        <Form
          form={formEdit}
          layout="vertical"
          onFinish={async (values) => {
            const formData = new FormData();
            formData.append("depo_id", values.depo_id);
            if (values.ishga_tushgan_vaqti) {
              formData.append(
                "ishga_tushgan_vaqti",
                values.ishga_tushgan_vaqti.format("DD-MM-YYYY")
              );
            }
            formData.append("guruhi", values.guruhi);
            formData.append("turi", values.turi);
            formData.append("tarkib_raqami", values.tarkib_raqami);
            formData.append("eksplutatsiya_vaqti", values.eksplutatsiya_vaqti);

            if (values.rasm && values.rasm[0]) {
              const file = values.rasm[0].originFileObj;
              formData.append("image", file, file.name);
            }
            formData.append("holati", values.holati);

            try {
              await updateDepo({ id: editingDepo.id, data: formData }).unwrap();
              messageApi.success("Harakat tarkibi muvaffaqiyatli tahrirlandi!");
              setIsEditModal(false);
              form.resetFields();
            } catch (err) {
              console.error(err);
              messageApi.error("Xatolik yuz berdi!");
            }
          }}
        >
          <Form.Item
            name="depo_id"
            label="Depo nomi"
            rules={[{ required: true, message: "Deponi tanlang!" }]}
          >
            <Select placeholder="Depo tanlash">
              {dataDepo?.results?.map((item) => (
                <Select.Option key={item.id} value={item.id}>
                  {item.depo_nomi}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="ishga_tushgan_vaqti"
            label="Ishga tushirilgan vaqt"
            rules={[{ required: true, message: "Sana kiriting!" }]}
          >
            <DatePicker format="DD-MM-YYYY" style={{ width: "100%" }} />
          </Form.Item>

          <Form.Item
            name="guruhi"
            label="Guruhi"
            rules={[{ required: true, message: "Guruhi kiriting!" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="turi"
            label="Turi"
            rules={[{ required: true, message: "Turi kiriting!" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="tarkib_raqami"
            label="Tarkib raqami"
            rules={[{ required: true, message: "Tarkib raqamini kiriting!" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="eksplutatsiya_vaqti"
            label="Eksplutatsiya masofasi (kmda)"
            rules={[{ required: true, message: "Masofani kiriting!" }]}
          >
            <Input type="number" />
          </Form.Item>

          <Form.Item
            name="rasm"
            label="Rasm"
            valuePropName="fileList"
            getValueFromEvent={(e) => (Array.isArray(e) ? e : e?.fileList)}
          >
            <Upload
              name="rasm"
              listType="picture"
              maxCount={1}
              beforeUpload={() => false}
            >
              <Button icon={<UploadOutlined />}>Rasm yuklash</Button>
            </Upload>
          </Form.Item>
        </Form>
      </Modal>

      {/* View Modal */}
      <Modal
        title="Harakat tarkibini qo'shish"
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
            name="depo_id"
            label="Depo nomi"
            rules={[{ required: true, message: "Deponing nomini tanlang!" }]}
          >
            <Select placeholder="Depo nomini tanlash">
              {dataDepo?.results?.map((item) => {
                return (
                  <Option key={item.id} value={item.id}>
                    {item.depo_nomi}
                  </Option>
                );
              })}
            </Select>
          </Form.Item>

          <Form.Item
            name="ishga_tushgan_vaqti"
            label="Ishga tushgan vaqti"
            rules={[
              { required: true, message: "Ishga tushgan vaqtini kiriting!" },
            ]}
          >
            <DatePicker style={{ width: "100%" }} format="YYYY-MM-DD" />
          </Form.Item>

          <Form.Item
            name="guruhi"
            label="Guruhi"
            rules={[{ required: true, message: "Guruhi kiritish majburiy!" }]}
          >
            <Input placeholder="Guruhi yozing..." />
          </Form.Item>

          <Form.Item
            name="turi"
            label="Turi"
            rules={[{ required: true, message: "Turi kiritish majburiy!" }]}
          >
            <Input placeholder="Turi yozing..." />
          </Form.Item>

          <Form.Item
            name="tarkib_raqami"
            label="Tarkib raqami"
            rules={[{ required: true, message: "Tarkib raqamini kiriting!" }]}
          >
            <Input placeholder="Tarkib raqami..." />
          </Form.Item>

          <Form.Item
            name="eksplutatsiya_vaqti"
            label="Eksplutatsiya masofasi (kmda)"
            rules={[
              { required: true, message: "Eksplutatsiya masofasini kiriting!" },
            ]}
          >
            <Input type="number" placeholder="Eksplutatsiya masofasi..." />
          </Form.Item>

          <Form.Item
            name="image"
            label="Rasm"
            valuePropName="fileList"
            getValueFromEvent={(e) => (Array.isArray(e) ? e : e && e.fileList)}
          >
            <Upload
              name="image"
              listType="picture"
              maxCount={1}
              beforeUpload={() => false}
            >
              <Button icon={<UploadOutlined />}>Rasm yuklash</Button>
            </Upload>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
