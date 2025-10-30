import GoBack from "@/components/GoBack";
import Loading from "@/components/loading/loading";
import {
  useAddtamirMutation,
  useDeletetamirMutation,
  useGettamirQuery,
  useLazyExportExceltQuery,
  useLazyExportPdftQuery,
  useUpdatetamirMutation,
} from "@/services/api";
import {
  CalendarOutlined,
  DeleteOutlined,
  DownloadOutlined,
  EditOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import {
  Button,
  Empty,
  Form,
  Input,
  InputNumber,
  Modal,
  Radio,
  Select,
  Space,
  Table,
  Tooltip,
} from "antd";
import dayjs from "dayjs";
import { Check, X } from "lucide-react";
import { useEffect, useState } from "react";
import { toast, Toaster } from "sonner";
export default function TamirlashTuri() {
  const [isEditModal, setIsEditModal] = useState(false);
  const [editingDepo, setEditingDepo] = useState(null); // tahrir qilinayotgan depo
  const [formEdit] = Form.useForm();
  const [isAddModal, SetIsAddModal] = useState(false);
  const [formAdd] = Form.useForm();
  const { Option } = Select;
  const [search, setSearch] = useState("");
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 20,
    total: 0,
  });
  const { data, isLoading, isError, error } = useGettamirQuery({
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
  const [addtarkib, { isLoading: load, error: errr }] = useAddtamirMutation();
  const [updateDepo, { isLoading: loadders }] = useUpdatetamirMutation();
  const [deleteDep, { isLoading: loadder }] = useDeletetamirMutation();
  const [triggerExport, { isFetching }] = useLazyExportExceltQuery();
  const [exportPDF, { isFetching: ehtihoyFetching }] = useLazyExportPdftQuery();
  const handleExport = async () => {
    const blob = await triggerExport().unwrap();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "Tamir_turi.xlsx";
    document.body.appendChild(a);
    a.click();
    a.remove();
  };
  const handlepdf = async () => {
    const blob = await exportPDF().unwrap();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "Tamir_turi.pdf"; // fayl nomi
    document.body.appendChild(a);
    a.click();
    a.remove();
  };
  const handleSubmit = async (values) => {
    const formData = new FormData();
    formData.append("tamir_nomi", values.tamir_nomi);
    formData.append("tamirlash_davri", values.tamirlash_davri);
    formData.append("tamirlanish_miqdori", values.tamirlanish_miqdori);
    formData.append("tamirlanish_vaqti", values.tamirlanish_vaqti);
    formData.append("tarkib_turi", values.tarkib_turi);
    formData.append("akt_check", values.akt_check);
    try {
      await addtarkib(formData).unwrap();
      toast.success("Ta'mit turi muvaffaqiyatli qo‘shildi!");
      SetIsAddModal(false);
      formAdd.resetFields();
    } catch (err) {
      console.error("Xato:", err);
      toast.error("Xatolik yuz berdi!");
    }
  };
  const handleDelete = async (tarkib) => {
    try {
      await deleteDep(tarkib.id).unwrap();
    } catch (err) {
      console.error(err);
      toast.error("Xatolik yuz berdi!");
    }
  };
  if (isLoading || load || loadders || loadder) {
    return (
      <div className="w-full h-screen flex justify-center items-center">
        <Loading />
      </div>
    );
  }
  const Vaqt_Choices = [
    { value: "soat", label: "Soat" },
    { value: "kun", label: "Kun" },
    { value: "oy", label: "Oy" },
  ];
  if (errr) {
    toast.error(errr);
  }
  if (isError) {
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
      tamir_nomi: depo.tamir_nomi,
      tamirlash_davri: depo.tamirlash_davri,
      tamirlanish_miqdori: depo.tamirlanish_miqdori,
      tamirlanish_vaqti: depo.tamirlanish_vaqti,
      tarkib_turi: depo.tarkib_turi,
      akt_check: depo.akt_check,
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
      title: "Ta'mir nomi",
      key: "tamir_nomi",
      dataIndex: "tamir_nomi",
      width: 100,
    },
    {
      title: "Tarkib turi",
      key: "tarkib_turi",
      width: 250,
      render: (_, record) => (
        <>{record.tarkib_turi ? record.tarkib_turi : "-"}</>
      ),
    },
    {
      title: "Ta'mirlash davomiyligi",
      dataIndex: "tamirlanish_miqdori",
      key: "tamirlanish_miqdori",
      width: 180,
      render: (_, record) => (
        <>
          {record.tamirlanish_miqdori} {record.tamirlanish_vaqti}
        </>
      ),
    },
    {
      title: "Ta'mirlash davri (km)",
      dataIndex: "tamirlash_davri",
      key: "tamirlash_davri",
      width: 150,
    },
    {
      title: "Akt qo'shish holati",
      dataIndex: "akt_check",
      key: "akt_check",
      width: 180,
      render: (_, record) => (
        <>
          {record.akt_check ? (
            <span className="flex font-bold text-blue-500 items-center gap-2">
              {/* Qo'shiladi */}
              <Check className="text-blue-500" />
            </span>
          ) : (
            <span className="flex font-bold text-red-500 items-center gap-2">
              {/* Qo'shiladi */}
              <X className="text-red-500" />
            </span>
          )}
        </>
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
      <Toaster position="bottom-center" richColors />
      <div className="bg-white rounded-lg shadow-sm">
        <div className="p-4 border-b border-gray-200 w-full flex justify-between items-center">
          <div className="flex items-center gap-4 justify-center">
            <h1 className="text-3xl font-bold text-gray-900">
              Ta'mirlash turini ro'yxatga olish
            </h1>
          </div>
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
        title="Ta'mirlash turini tahrirlash"
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
            formData.append("tamir_nomi", values.tamir_nomi);
            formData.append("tamirlash_davri", values.tamirlash_davri);
            formData.append("tamirlanish_miqdori", values.tamirlanish_miqdori);
            formData.append("tamirlanish_vaqti", values.tamirlanish_vaqti);
            formData.append("akt_check", values.akt_check);
            try {
              await updateDepo({ id: editingDepo.id, data: formData }).unwrap();
              toast.success("Tamirlash turi muvaffaqiyatli tahrirlandi!");
              setIsEditModal(false);
            } catch (err) {
              console.error(err);
              toast.error("Xatolik yuz berdi!");
            }
          }}
        >
          <Form.Item
            name="tamir_nomi"
            label="Ta'mir nomi"
            rules={[
              { required: true, message: "Ehtiyot qism nomi yozish majburiy!" },
            ]}
          >
            <Input placeholder="Ehtiyot qism nomini yozing..." />
          </Form.Item>

          <Form.Item
            name="tamirlash_davri"
            label="Ta'mirlash davri (km)"
            rules={[
              {
                required: true,
                message: "Ta'mirlash davrini kiritish majburiy!",
              },
            ]}
          >
            <Input placeholder="Ta'mirlash davrini yozing..." />
          </Form.Item>

          <Form.Item
            name="tamirlanish_miqdori"
            label="Ta'mirlash davomiyligi vaqti"
            rules={[
              {
                required: true,
                message: "Ta'mirlash davomiylig vaqtini kiritish majburiy!",
              },
            ]}
          >
            <InputNumber
              min={1}
              style={{ width: "100%" }}
              placeholder="Ta'mirlash davomiyligi vaqtini yozing..."
            />
          </Form.Item>

          <Form.Item
            name="tamirlanish_vaqti"
            label="Ta'mirlash davomiyligi vaqti"
            rules={[
              {
                required: true,
                message: "Ta'mir davomiyligini kiritish majburiy!",
              },
            ]}
          >
            <Select placeholder="Vaqtni tanlang">
              {Vaqt_Choices.map((item) => (
                <Option key={item.value} value={item.value}>
                  {item.label}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="tarkib_turi"
            label="Tarkib turi"
            rules={[
              {
                required: true,
                message: "Tarkib turini kiritish majburiy!",
              },
            ]}
          >
            <Select placeholder="Tarkib turini tanlang">
              <Option value="Moskva(81-765,766,767)">
                Moskva(81 - 765, 766, 767)
              </Option>
              <Option value={"81-714,714.5,717,717.5,718,719 (Tisu)"}>
                81-714,714.5,717,717.5,718,719 (Tisu)
              </Option>
            </Select>
          </Form.Item>
          <Form.Item
            name="akt_check"
            label="Siz bu ta'mir turiga akt yuklaysizmi?"
            rules={[
              {
                required: true,
                message: "Iltimos, javobni tanlang!",
              },
            ]}
          >
            <Radio.Group>
              <Radio value={true}>Ha</Radio>
              <Radio value={false}>Yo‘q</Radio>
            </Radio.Group>
          </Form.Item>
        </Form>
      </Modal>
      {/* View Modal */}
      <Modal
        title="Ta'mirlash turini qo'shish"
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
            name="tamir_nomi"
            label="Ta'mirlash nomi"
            rules={[
              { required: true, message: "Ta'mirlash nomi yozish majburiy!" },
            ]}
          >
            <Input placeholder="Ta'mirlash nomini yozing..." />
          </Form.Item>

          <Form.Item
            name="tamirlash_davri"
            label="Ta'mirlash davriyligi (km)"
            rules={[
              {
                required: true,
                message: "Ta'mirlash davriyligini kiritish majburiy!",
              },
            ]}
          >
            <Input placeholder="Ta'mirlash davriyligini yozing..." />
          </Form.Item>

          <Form.Item
            name="tamirlanish_miqdori"
            label="Ta'mirlash davomiyligi"
            rules={[
              {
                required: true,
                message: "Ta'mirlash davomiyligini kiritish majburiy!",
              },
            ]}
          >
            <InputNumber
              min={1}
              style={{ width: "100%" }}
              placeholder="Ta'mirlash davomiyligini yozing..."
            />
          </Form.Item>

          <Form.Item
            name="tamirlanish_vaqti"
            label="Ta'mirlash davomiyligi vaqti"
            rules={[
              {
                required: true,
                message: "Ta'mir davomiyligini kiritish majburiy!",
              },
            ]}
          >
            <Select placeholder="Vaqtni tanlang">
              {Vaqt_Choices.map((item) => (
                <Option key={item.value} value={item.value}>
                  {item.label}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            name="tarkib_turi"
            label="Tarkib turi"
            rules={[
              {
                required: true,
                message: "Tarkib turini kiritish majburiy!",
              },
            ]}
          >
            <Select placeholder="Tarkib turini tanlang">
              <Option value="Moskva(81-765,766,767)">
                Moskva(81 - 765, 766, 767)
              </Option>
              <Option value={"81-714,714.5,717,717.5,718,719 (Tisu)"}>
                81-714,714.5,717,717.5,718,719 (Tisu)
              </Option>
            </Select>
          </Form.Item>
          <Form.Item
            name="akt_check"
            label="Siz bu ta'mir turiga akt yuklaysizmi?"
            rules={[
              {
                required: true,
                message: "Iltimos, javobni tanlang!",
              },
            ]}
          >
            <Radio.Group>
              <Radio value={true}>Ha</Radio>
              <Radio value={false}>Yo‘q</Radio>
            </Radio.Group>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
