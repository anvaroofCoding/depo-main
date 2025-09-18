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
  Upload,
  Tooltip,
  Empty,
  Image,
  message,
} from "antd";
import {
  EditOutlined,
  DeleteOutlined,
  CalendarOutlined,
  PlusOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
import {
  useAddDepMutation,
  useDeleteDepoMutation,
  useGetDepQuery,
  useUpdateDepoMutation,
} from "@/services/api";
import Loading from "@/components/loading/loading";

export default function DepTable() {
  const [messageApi, contextHolder] = message.useMessage();
  const [isEditModal, setIsEditModal] = useState(false);
  const [editingDepo, setEditingDepo] = useState(null); // tahrir qilinayotgan depo
  const [formEdit] = Form.useForm();
  const [isAddModal, SetIsAddModal] = useState(false);
  const [formAdd] = Form.useForm();

  //get
  const { data, isLoading, isError, error } = useGetDepQuery();
  //post
  const [addDep, { isLoading: load, error: errr }] = useAddDepMutation();
  //edit
  const [updateDepo, { isLoading: loadders }] = useUpdateDepoMutation();
  // delete
  const [deleteDep, { isLoading: loadder }] = useDeleteDepoMutation();

  const handleSubmit = async (values) => {
    const formData = new FormData();
    formData.append("depo_nomi", values.depo_nomi);
    formData.append("qisqacha_nomi", values.qisqacha_nomi);
    formData.append("joylashuvi", values.joylashuvi);

    if (values.rasm && values.rasm[0]) {
      formData.append("image", values.rasm[0].originFileObj);
    }

    try {
      await addDep(formData).unwrap();
      messageApi.success("Depo muvaffaqiyatli qo‘shildi!");
      SetIsAddModal(false);
      formAdd.resetFields();
    } catch (err) {
      console.error("Xato:", err);
      messageApi.error("Xatolik yuz berdi!");
    }
  };
  const handleDelete = async (depo) => {
    try {
      await deleteDep(depo.id).unwrap();
      messageApi.success(`Depo "${depo.depo_nomi}" muvaffaqiyatli o'chirildi!`);
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
      depo_nomi: depo.depo_nomi,
      qisqacha_nomi: depo.qisqacha_nomi,
      joylashuvi: depo.joylashuvi,
      image: depo.image ? [{ url: depo.image }] : [], // preview uchun
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
      key: "depo_nomi",
      width: 200,
      render: (_, record) => (
        <div className="flex items-center gap-3">
          <Image
            src={record.image}
            width={50}
            height={50}
            className="rounded-[50%]"
          />
          <div>
            <div className="font-medium">{record.depo_nomi}</div>
            <div className="text-sm text-gray-500">{record.qisqacha_nomi}</div>
          </div>
        </div>
      ),
      sorter: (a, b) =>
        `${a.depo_nomi} ${a.qisqacha_nomi}`.localeCompare(
          `${b.depo_nomi} ${b.qisqacha_nomi}`
        ),
    },
    {
      title: "Qisqacha nomi",
      dataIndex: "qisqacha_nomi",
      key: "qisqacha_nomi",
      width: 150,
      filters: [
        { text: "TCh-1", value: "TCh-1" },
        { text: "TCH-2", value: "TCh-2" },
      ],
      onFilter: (value, record) => record.qisqacha_nomi === value,
    },
    {
      title: "Joylashuvi",
      dataIndex: "joylashuvi",
      key: "joylashuvi",
      width: 150,
      render: (_, record) => (
        <span className="font-medium text-green-600">{record.joylashuvi}</span>
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
            Depolarni ro'yxatga olish
          </h1>
          <Button
            variant="solid"
            color="primary"
            icon={<PlusOutlined />}
            onClick={handleAdd}
          >
            Qo'shish
          </Button>
        </div>

        <div className="p-6">
          <Table
            columns={columns}
            dataSource={data.results.map((item, index) => ({
              ...item,
              key: item.id || index, // id bo‘lsa id, bo‘lmasa indexdan foydalanamiz
            }))}
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
        title="Deponi tahrirlash"
        open={isEditModal}
        onCancel={() => setIsEditModal(false)}
        okText="Saqlash"
        cancelText="Bekor qilish"
        onOk={() => formEdit.submit()} // shu ok submit qiladi
      >
        <Form
          form={formEdit}
          layout="vertical"
          onFinish={async (values) => {
            const formData = new FormData();
            formData.append("depo_nomi", values.depo_nomi);
            formData.append("qisqacha_nomi", values.qisqacha_nomi);
            formData.append("joylashuvi", values.joylashuvi);
            if (values.rasm && values.rasm[0]) {
              formData.append("image", values.rasm[0].originFileObj);
            }

            try {
              await updateDepo({ id: editingDepo.id, data: formData }).unwrap();
              messageApi.success("Depo muvaffaqiyatli tahrirlandi!");
              setIsEditModal(false);
            } catch (err) {
              console.error(err);
              messageApi.error("Xatolik yuz berdi!");
            }
          }}
        >
          <Form.Item
            name="depo_nomi"
            label="Depo nomi"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="qisqacha_nomi"
            label="Qisqacha nomi"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="joylashuvi"
            label="Manzil"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="rasm"
            label="Depo rasmi"
            valuePropName="fileList"
            getValueFromEvent={(e) => (Array.isArray(e) ? e : e?.fileList)}
          >
            <Upload
              name="rasm"
              listType="picture"
              maxCount={1}
              beforeUpload={() => false} // faylni avtomatik yubormaymiz
            >
              <Button icon={<UploadOutlined />}>Rasm yuklash</Button>
            </Upload>
          </Form.Item>
        </Form>
      </Modal>

      {/* View Modal */}
      <Modal
        title="Depo qo'shish"
        open={isAddModal}
        onCancel={() => {
          SetIsAddModal(false);
          formAdd.resetFields();
        }}
        okText="Saqlash"
        cancelText="Bekor qilish"
        width={600}
        onOk={() => formAdd.submit()} // shu submit qiladi
      >
        <Form form={formAdd} layout="vertical" onFinish={handleSubmit}>
          <Form.Item
            name="depo_nomi"
            label="Depo nomi"
            rules={[
              { required: true, message: "Depo nomini kiritish majburiy!" },
            ]}
          >
            <Input placeholder="Depo nomini yozing..." />
          </Form.Item>

          <Form.Item
            name="qisqacha_nomi"
            label="Qisqacha nomi"
            rules={[
              { required: true, message: "Qisqacha nomini kiritish majburiy!" },
            ]}
          >
            <Input placeholder="Qisqacha nomini yozing..." />
          </Form.Item>

          <Form.Item
            name="joylashuvi"
            label="Manzili"
            rules={[{ required: true, message: "Manzilni kiritish majburiy!" }]}
          >
            <Input placeholder="Manzilni yozing..." />
          </Form.Item>

          <Form.Item
            name="rasm"
            label="Depo rasmi"
            valuePropName="fileList"
            getValueFromEvent={(e) => (Array.isArray(e) ? e : e && e.fileList)}
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
    </div>
  );
}
