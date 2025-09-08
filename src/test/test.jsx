import { useState } from "react";
import {
  Table,
  Button,
  Space,
  Modal,
  Form,
  Input,
  Select,
  DatePicker,
  message,
  Tag,
  Avatar,
  Tooltip,
  Empty,
} from "antd";
import {
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
  UserOutlined,
  PhoneOutlined,
  MailOutlined,
  CalendarOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";

const initialData = [
  {
    key: "1",
    id: 1001,
    ism: "Akmal",
    familiya: "Karimov",
    lavozim: "Dasturchi",
    bolim: "IT Bo'limi",
    maosh: 15000000,
    telefon: "+998901234567",
    email: "akmal.karimov@company.uz",
    ish_boshlagan_sana: "2023-01-15",
    holat: "faol",
    avatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
  },
  {
    key: "2",
    id: 1002,
    ism: "Dilnoza",
    familiya: "Abdullayeva",
    lavozim: "Dizayner",
    bolim: "Kreativ Bo'limi",
    maosh: 12000000,
    telefon: "+998907654321",
    email: "dilnoza.abdullayeva@company.uz",
    ish_boshlagan_sana: "2023-03-20",
    holat: "faol",
    avatar:
      "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face",
  },
  {
    key: "3",
    id: 1003,
    ism: "Bobur",
    familiya: "Toshmatov",
    lavozim: "Menejer",
    bolim: "Sotuvlar Bo'limi",
    maosh: 18000000,
    telefon: "+998901111111",
    email: "bobur.toshmatov@company.uz",
    ish_boshlagan_sana: "2022-11-10",
    holat: "dam_olish",
    avatar:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",
  },
  {
    key: "4",
    id: 1004,
    ism: "Sevara",
    familiya: "Nazarova",
    lavozim: "Buxgalter",
    bolim: "Moliya Bo'limi",
    maosh: 14000000,
    telefon: "+998902222222",
    email: "sevara.nazarova@company.uz",
    ish_boshlagan_sana: "2023-05-01",
    holat: "faol",
  },
  {
    key: "5",
    id: 1005,
    ism: "Jasur",
    familiya: "Rahimov",
    lavozim: "Xavfsizlik mutaxassisi",
    bolim: "Xavfsizlik Bo'limi",
    maosh: 16000000,
    telefon: "+998903333333",
    email: "jasur.rahimov@company.uz",
    ish_boshlagan_sana: "2022-08-15",
    holat: "bekor_qilingan",
    avatar:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face",
  },
];

export default function EmployeeTable() {
  const [data, setData] = useState(initialData);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isViewModalVisible, setIsViewModalVisible] = useState(false);
  const [editingRecord, setEditingRecord] = useState(null);
  const [viewingRecord, setViewingRecord] = useState(null);
  const [form] = Form.useForm();

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("uz-UZ", {
      style: "currency",
      currency: "UZS",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "faol":
        return "green";
      case "dam_olish":
        return "orange";
      case "bekor_qilingan":
        return "red";
      default:
        return "default";
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case "faol":
        return "Faol";
      case "dam_olish":
        return "Dam olishda";
      case "bekor_qilingan":
        return "Bekor qilingan";
      default:
        return status;
    }
  };

  const handleEdit = (record) => {
    setEditingRecord(record);
    form.setFieldsValue({
      ...record,
      ish_boshlagan_sana: dayjs(record.ish_boshlagan_sana),
    });
    setIsModalVisible(true);
  };

  const handleDelete = (record) => {
    Modal.confirm({
      title: "Xodimni o'chirish",
      content: `Haqiqatan ham ${record.ism} ${record.familiya}ni o'chirmoqchimisiz?`,
      okText: "Ha, o'chirish",
      cancelText: "Bekor qilish",
      okType: "danger",
      onOk() {
        setData(data.filter((item) => item.key !== record.key));
        message.success(
          `${record.ism} ${record.familiya} muvaffaqiyatli o'chirildi`
        );
      },
    });
  };

  const handleView = (record) => {
    setViewingRecord(record);
    setIsViewModalVisible(true);
  };

  const handleSave = () => {
    form.validateFields().then((values) => {
      const formattedValues = {
        ...values,
        ish_boshlagan_sana: values.ish_boshlagan_sana.format("YYYY-MM-DD"),
      };

      if (editingRecord) {
        setData(
          data.map((item) =>
            item.key === editingRecord.key
              ? { ...item, ...formattedValues }
              : item
          )
        );
        message.success("Xodim ma'lumotlari muvaffaqiyatli yangilandi");
      }

      setIsModalVisible(false);
      setEditingRecord(null);
      form.resetFields();
    });
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
      title: "Xodim",
      key: "employee",
      width: 200,
      render: (_, record) => (
        <div className="flex items-center gap-3">
          <Avatar src={record.avatar} icon={<UserOutlined />} size={40} />
          <div>
            <div className="font-medium">
              {record.ism} {record.familiya}
            </div>
            <div className="text-sm text-gray-500">{record.lavozim}</div>
          </div>
        </div>
      ),
      sorter: (a, b) =>
        `${a.ism} ${a.familiya}`.localeCompare(`${b.ism} ${b.familiya}`),
    },
    {
      title: "Bo'lim",
      dataIndex: "bolim",
      key: "bolim",
      width: 150,
      filters: [
        { text: "IT Bo'limi", value: "IT Bo'limi" },
        { text: "Kreativ Bo'limi", value: "Kreativ Bo'limi" },
        { text: "Sotuvlar Bo'limi", value: "Sotuvlar Bo'limi" },
        { text: "Moliya Bo'limi", value: "Moliya Bo'limi" },
        { text: "Xavfsizlik Bo'limi", value: "Xavfsizlik Bo'limi" },
      ],
      onFilter: (value, record) => record.bolim === value,
    },
    {
      title: "Maosh",
      dataIndex: "maosh",
      key: "maosh",
      width: 150,
      render: (maosh) => (
        <span className="font-medium text-green-600">
          {formatCurrency(maosh)}
        </span>
      ),
      sorter: (a, b) => a.maosh - b.maosh,
    },
    {
      title: "Aloqa",
      key: "contact",
      width: 200,
      render: (_, record) => (
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-sm">
            <PhoneOutlined />
            <span>{record.telefon}</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <MailOutlined />
            <span className="truncate">{record.email}</span>
          </div>
        </div>
      ),
    },
    {
      title: "Ish boshlagan sana",
      dataIndex: "ish_boshlagan_sana",
      key: "ish_boshlagan_sana",
      width: 150,
      render: (date) => (
        <div className="flex items-center gap-2">
          <CalendarOutlined />
          <span>{dayjs(date).format("DD.MM.YYYY")}</span>
        </div>
      ),
      sorter: (a, b) =>
        dayjs(a.ish_boshlagan_sana).unix() - dayjs(b.ish_boshlagan_sana).unix(),
    },
    {
      title: "Holat",
      dataIndex: "holat",
      key: "holat",
      width: 120,
      render: (holat) => (
        <Tag color={getStatusColor(holat)}>{getStatusText(holat)}</Tag>
      ),
      filters: [
        { text: "Faol", value: "faol" },
        { text: "Dam olishda", value: "dam_olish" },
        { text: "Bekor qilingan", value: "bekor_qilingan" },
      ],
      onFilter: (value, record) => record.holat === value,
    },
    {
      title: "Amallar",
      key: "actions",
      width: 150,
      fixed: "right",
      render: (_, record) => (
        <Space size="small">
          <Tooltip title="Ko'rish">
            <Button
              type="text"
              icon={<EyeOutlined />}
              onClick={() => handleView(record)}
            />
          </Tooltip>
          <Tooltip title="Tahrirlash">
            <Button
              type="text"
              icon={<EditOutlined />}
              onClick={() => handleEdit(record)}
            />
          </Tooltip>
          <Tooltip title="O'chirish">
            <Button
              type="text"
              icon={<DeleteOutlined />}
              onClick={() => handleDelete(record)}
              danger
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="bg-white rounded-lg shadow-sm">
        <div className="p-6 border-b border-gray-200">
          <h1 className="text-2xl font-bold text-gray-900">
            Xodimlar ro'yxati
          </h1>
          <p className="text-gray-600 mt-1">
            Kompaniya xodimlarining to'liq ma'lumotlari
          </p>
        </div>

        <div className="p-6">
          <Table
            columns={columns}
            dataSource={data}
            pagination={{
              pageSize: 10,
              showSizeChanger: true,
              showQuickJumper: true,
              showTotal: (total, range) =>
                `${range[0]}-${range[1]} dan ${total} ta yozuv`,
              pageSizeOptions: ["5", "10", "20", "50"],
            }}
            scroll={{ x: 1200 }}
            locale={{
              emptyText: (
                <Empty
                  image={Empty.PRESENTED_IMAGE_SIMPLE}
                  description={
                    <div className="text-center py-8">
                      <h3 className="text-lg font-medium text-gray-900 mb-2">
                        Hech qanday xodim topilmadi
                      </h3>
                      <p className="text-gray-500">
                        Hozircha ro'yxatda xodimlar mavjud emas
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
        title="Xodim ma'lumotlarini tahrirlash"
        open={isModalVisible}
        onOk={handleSave}
        onCancel={() => {
          setIsModalVisible(false);
          setEditingRecord(null);
          form.resetFields();
        }}
        okText="Saqlash"
        cancelText="Bekor qilish"
        width={600}
      >
        <Form form={form} layout="vertical" className="mt-4">
          <div className="grid grid-cols-2 gap-4">
            <Form.Item
              name="ism"
              label="Ism"
              rules={[{ required: true, message: "Ism kiritish majburiy!" }]}
            >
              <Input placeholder="Ismni kiriting" />
            </Form.Item>

            <Form.Item
              name="familiya"
              label="Familiya"
              rules={[
                { required: true, message: "Familiya kiritish majburiy!" },
              ]}
            >
              <Input placeholder="Familiyani kiriting" />
            </Form.Item>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Form.Item
              name="lavozim"
              label="Lavozim"
              rules={[
                { required: true, message: "Lavozim kiritish majburiy!" },
              ]}
            >
              <Input placeholder="Lavozimni kiriting" />
            </Form.Item>

            <Form.Item
              name="bolim"
              label="Bo'lim"
              rules={[{ required: true, message: "Bo'lim tanlash majburiy!" }]}
            >
              <Select placeholder="Bo'limni tanlang">
                <Select.Option value="IT Bo'limi">IT Bo'limi</Select.Option>
                <Select.Option value="Kreativ Bo'limi">
                  Kreativ Bo'limi
                </Select.Option>
                <Select.Option value="Sotuvlar Bo'limi">
                  Sotuvlar Bo\'limi
                </Select.Option>
                <Select.Option value="Moliya Bo'limi">
                  Moliya Bo\'limi
                </Select.Option>
                <Select.Option value="Xavfsizlik Bo'limi">
                  Xavfsizlik Bo\'limi
                </Select.Option>
              </Select>
            </Form.Item>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Form.Item
              name="maosh"
              label="Maosh (UZS)"
              rules={[{ required: true, message: "Maosh kiritish majburiy!" }]}
            >
              <Input type="number" placeholder="Maoshni kiriting" />
            </Form.Item>

            <Form.Item
              name="telefon"
              label="Telefon raqami"
              rules={[
                {
                  required: true,
                  message: "Telefon raqami kiritish majburiy!",
                },
              ]}
            >
              <Input placeholder="+998901234567" />
            </Form.Item>
          </div>

          <Form.Item
            name="email"
            label="Email manzil"
            rules={[
              { required: true, message: "Email manzil kiritish majburiy!" },
              { type: "email", message: "Noto'g'ri email format!" },
            ]}
          >
            <Input placeholder="email@company.uz" />
          </Form.Item>

          <div className="grid grid-cols-2 gap-4">
            <Form.Item
              name="ish_boshlagan_sana"
              label="Ish boshlagan sana"
              rules={[{ required: true, message: "Sana tanlash majburiy!" }]}
            >
              <DatePicker
                className="w-full"
                format="DD.MM.YYYY"
                placeholder="Sanani tanlang"
              />
            </Form.Item>

            <Form.Item
              name="holat"
              label="Holat"
              rules={[{ required: true, message: "Holat tanlash majburiy!" }]}
            >
              <Select placeholder="Holatni tanlang">
                <Select.Option value="faol">Faol</Select.Option>
                <Select.Option value="dam_olish">Dam olishda</Select.Option>
                <Select.Option value="bekor_qilingan">
                  Bekor qilingan
                </Select.Option>
              </Select>
            </Form.Item>
          </div>
        </Form>
      </Modal>

      {/* View Modal */}
      <Modal
        title="Xodim ma'lumotlari"
        open={isViewModalVisible}
        onCancel={() => {
          setIsViewModalVisible(false);
          setViewingRecord(null);
        }}
        footer={[
          <Button key="close" onClick={() => setIsViewModalVisible(false)}>
            Yopish
          </Button>,
        ]}
        width={500}
      >
        {viewingRecord && (
          <div className="space-y-4">
            <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
              <Avatar
                src={viewingRecord.avatar}
                icon={<UserOutlined />}
                size={64}
              />
              <div>
                <h3 className="text-xl font-semibold">
                  {viewingRecord.ism} {viewingRecord.familiya}
                </h3>
                <p className="text-gray-600">{viewingRecord.lavozim}</p>
                <Tag color={getStatusColor(viewingRecord.holat)}>
                  {getStatusText(viewingRecord.holat)}
                </Tag>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  ID
                </label>
                <p className="text-gray-900">{viewingRecord.id}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Bo\'lim
                </label>
                <p className="text-gray-900">{viewingRecord.bolim}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Maosh
                </label>
                <p className="text-green-600 font-medium">
                  {formatCurrency(viewingRecord.maosh)}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Telefon
                </label>
                <p className="text-gray-900">{viewingRecord.telefon}</p>
              </div>

              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <p className="text-gray-900">{viewingRecord.email}</p>
              </div>

              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Ish boshlagan sana
                </label>
                <p className="text-gray-900">
                  {dayjs(viewingRecord.ish_boshlagan_sana).format("DD.MM.YYYY")}
                </p>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
