import { useState } from "react";
import { Button, Modal, Form, Input, Empty, Card } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import {
  useNosozlikAddTypePostMutation,
  useNosozlikTypeAddQuery,
  useNosozlikTypeEditMutation,
} from "@/services/api";
import Loading from "@/components/loading/loading";
import { toast, Toaster } from "sonner";
import dayjs from "dayjs";
import { Edit } from "lucide-react";
import GoBack from "@/components/GoBack";

export default function ServiceTypeAdd() {
  const [isAddModal, SetIsAddModal] = useState(false);
  const [isEditModal, SetIsEditModal] = useState(false);
  const [valuess, SetValues] = useState(null);
  const [id, SetId] = useState(null);
  const [formAdd] = Form.useForm();
  const [formEdit] = Form.useForm();

  const { data, isLoading } = useNosozlikTypeAddQuery();

  const [addKilometr, { isLoading: load, error: errr }] =
    useNosozlikAddTypePostMutation();
  const [NosozlikTypeEdit, { isLoading: loads, error: errrs }] =
    useNosozlikTypeEditMutation();

  const handleSubmit = async (values) => {
    try {
      const payload = {
        nosozlik_turi: values.nosozlik_turi,
      };

      await addKilometr(payload).unwrap();

      toast.success("Nosozlik turi muvaffaqiyatli qo‘shildi!");
      SetIsAddModal(false);
      formAdd.resetFields();
    } catch (err) {
      toast.error(err?.data?.message || "Xatolik yuz berdi!");
      console.log(err, "err");
    }
  };

  const handleEdit = async (values) => {
    try {
      const payload = {
        id,
        nosozlik_turi: values.nosozlik_turi,
      };

      console.log(payload, "payload");
      await NosozlikTypeEdit(payload).unwrap();
      toast.success("Nosozlik turi muvaffaqiyatli tahrirlandi!");
      SetIsEditModal(false);
      formEdit.resetFields();
      SetValues(null);
      SetId(null);
    } catch (err) {
      toast.error(err?.data?.message || "Xatolik yuz berdi!");
      console.log(err, "err");
    }
  };

  const hanEdit = (item) => {
    SetValues(item.nosozlik_turi);
    SetId(item.id);
    SetIsEditModal(true);
  };

  if (isLoading || load || loads) {
    return (
      <div className="w-full h-screen flex justify-center items-center">
        <Loading />
      </div>
    );
  }

  if (errr || errrs) {
    toast.error(errr?.data?.message || errrs?.data?.message);
  }

  return (
    <div className=" bg-gray-50 min-h-screen">
      <Toaster position="top-center" />
      <div className="bg-white rounded-lg shadow-sm">
        <div className="p-4 border-b border-gray-200 w-full flex justify-between items-center">
          <div className="flex items-center gap-4 justify-center">
            <GoBack />
            <h1 className="text-3xl font-bold text-gray-900">
              Nosozlik turlarini ro'yxatga olish
            </h1>
          </div>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => {
              SetIsAddModal(true);
            }}
          >
            Qo'shish
          </Button>
        </div>

        <div className="p-6">
          {data?.results?.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
              {data?.results?.map((item, index) => (
                <Card key={item.id} className="shadow-md">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-bold">ID: {index + 1}</h3>
                    <Button
                      variant="text"
                      size="icon"
                      color="volcano"
                      onClick={() => hanEdit(item)}
                    >
                      <Edit />
                    </Button>
                  </div>
                  <p>
                    <span className="font-medium">Nomi: </span>
                    {item.nosozlik_turi}
                  </p>
                  <p>
                    <span className="font-medium">Yaratuvchi: </span>
                    <span>
                      {dayjs(item.created_at).format("DD.MM.YYYY HH:mm")}
                    </span>
                  </p>
                  <p>
                    <span className="font-medium">Yaratuvchi: </span>
                    {item.created_by ? item.created_by : "Noma'lum"}
                  </p>
                </Card>
              ))}
            </div>
          ) : (
            <Empty
              image={Empty.PRESENTED_IMAGE_SIMPLE}
              description="Hozircha ma'lumotlar mavjud emas"
              className="my-8"
            />
          )}
        </div>
      </div>

      {/* Modal */}
      <Modal
        title="Nosozlik turini qo'shish"
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
            name="nosozlik_turi"
            label="Nosozlik turi nomi"
            rules={[
              {
                required: true,
                message: "Nosozlik turini kiritish majburiy!",
              },
            ]}
          >
            <Input
              className="w-full"
              placeholder="Nosozlik turi nomini yozing"
            />
          </Form.Item>
        </Form>
      </Modal>

      {/* Modal edit */}
      <Modal
        title="Nosozlik turini tahrirlash"
        open={isEditModal}
        onCancel={() => {
          SetIsEditModal(false);
          formEdit.resetFields();
        }}
        okText="Saqlash"
        cancelText="Bekor qilish"
        width={600}
        onOk={() => formEdit.submit()}
      >
        <Form form={formEdit} layout="vertical" onFinish={handleEdit}>
          <Form.Item
            name="nosozlik_turi"
            label="Nosozlik turi nomi"
            rules={[
              {
                required: true,
                message: "Nosozlik turini kiritish majburiy!",
              },
            ]}
            initialValue={valuess}
          >
            <Input
              className="w-full"
              placeholder="Nosozlik turi nomini yozing"
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
