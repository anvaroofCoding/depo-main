import { useState } from "react";
import { Button, Modal, Form, Input, Empty, Card } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import {
  useAddMarshrutMutation,
  useEditMarshrutMutation,
  useGetMashrutQuery,
} from "@/services/api";
import Loading from "@/components/loading/loading";
import { toast, Toaster } from "sonner";
import { Edit } from "lucide-react";
import GoBack from "@/components/GoBack";

export default function Mashrut() {
  const [isAddModal, SetIsAddModal] = useState(false);
  const [isEditModal, SetIsEditModal] = useState(false);
  const [valuess, SetValues] = useState(null);
  const [id, SetId] = useState(null);
  const [formAdd] = Form.useForm();
  const [formEdit] = Form.useForm();
  const { data, isLoading } = useGetMashrutQuery();
  const [addMarshrut, { isLoading: load }] = useAddMarshrutMutation();
  const [NosozlikTypeEdit, { isLoading: loads }] = useEditMarshrutMutation();
  const handleSubmit = async (values) => {
    try {
      const payload = {
        marshrut_raqam: values.marshrut_raqam,
      };
      await addMarshrut(payload).unwrap();
      toast.success("Marshrut muvaffaqiyatli qo‘shildi!");
      SetIsAddModal(false);
      formAdd.resetFields();
    } catch (err) {
      if (err.data.marshrut_raqam) {
        toast.warning(err.data.marshrut_raqam[0]);
      }
      console.log(err);
    }
  };
  const handleEdit = async (values) => {
    try {
      const payload = {
        marshrut_raqam: values.marshrut_raqam,
      };
      await NosozlikTypeEdit({ data: payload, id }).unwrap();
      toast.success("Marshrut muvaffaqiyatli tahrirlandi!");
      SetIsEditModal(false);
      formEdit.resetFields();
      SetValues(null);
      SetId(null);
    } catch (err) {
      if (err.data.marshrut_raqam) {
        toast.warning(err.data.marshrut_raqam[0]);
      }
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

  return (
    <div className=" bg-gray-50 min-h-screen ">
      <Toaster position="bottom-center" richColors />
      <div className="bg-white rounded-lg shadow-sm">
        <div className="p-4 border-b border-gray-200 w-full flex justify-between items-center">
          <div className="flex items-center gap-4 justify-center">
            <h1 className="text-3xl font-bold text-gray-900">
              Marshrutlarni ro'yxatga olish
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
                <Card key={index} className="shadow-md">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-bold">№ {index + 1}</h3>
                    <Button
                      variant="text"
                      size="icon"
                      color="volcano"
                      onClick={() => hanEdit(item)}
                    >
                      <Edit />
                    </Button>
                  </div>
                  <p className="text-lg">
                    <span className="font-medium">Marshrut raqami: </span>
                    <span className="font-bold">{item.marshrut_raqam}</span>
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
        title="Marshrut raqamini qo'shish"
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
            name="marshrut_raqam"
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
        title="Marshrut raqamini tahrirlash"
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
            name="marshrut_raqam"
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
