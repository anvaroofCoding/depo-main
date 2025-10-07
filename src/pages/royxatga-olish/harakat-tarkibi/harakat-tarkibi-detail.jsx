import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  Button,
  Modal,
  Form,
  Input,
  Empty,
  Pagination,
  Card,
  DatePicker,
  InputNumber,
} from "antd";
import { PlusOutlined } from "@ant-design/icons";
import {
  useAddKunlikYurishMutation,
  useKunlikYurishDetailQuery,
} from "@/services/api";
import Loading from "@/components/loading/loading";
import { toast, Toaster } from "sonner";

export default function KunlikYurish() {
  const [isAddModal, SetIsAddModal] = useState(false);
  const [formAdd] = Form.useForm();
  const { id } = useParams();

  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 40,
    total: 0,
  });

  const { data, isLoading } = useKunlikYurishDetailQuery({ id });

  const [addKilometr, { isLoading: load, error: errr }] =
    useAddKunlikYurishMutation();

  useEffect(() => {
    if (data?.length) {
      setPagination((prev) => ({ ...prev, total: data.length }));
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

  const handleSubmit = async (values) => {
    try {
      const payload = {
        tarkib: id, // paramsdan olgan id
        kilometr: values.kilometr,
        sana: values.sana.format("YYYY-MM-DD"), // date string format
      };

      await addKilometr(payload).unwrap();

      toast.success("Kilometr muvaffaqiyatli qo‘shildi!");
      SetIsAddModal(false);
      formAdd.resetFields();
    } catch (err) {
      toast.error(err?.data?.message || "Xatolik yuz berdi!");
      console.log(err, "err");
    }
  };

  // 🔹 Frontend pagination uchun data-ni bo‘lish
  const startIndex = (pagination.current - 1) * pagination.pageSize;
  const endIndex = startIndex + pagination.pageSize;
  const paginatedData = data?.slice(startIndex, endIndex);

  return (
    <div className=" bg-gray-50 min-h-screen">
      <Toaster position="top-center" />
      <div className="bg-white rounded-lg shadow-sm">
        <div className="p-4 border-b border-gray-200 w-full flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">
            {data?.[0]?.tarkib_nomi || ""} tarkibning kunlik yurishi
          </h1>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => SetIsAddModal(true)}
          >
            Qo'shish
          </Button>
        </div>

        <div className="p-6">
          {paginatedData?.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
              {paginatedData.map((item) => (
                <Card key={item.id} className="shadow-md">
                  <h3 className="text-lg font-bold">ID: {item.id}</h3>
                  <p>
                    <span className="font-medium">Kilometr: </span>
                    {item.kilometr} km
                  </p>
                  <p>
                    <span className="font-medium">Yaratuvchi: </span>
                    {item.created_by}
                  </p>
                  <p>
                    <span className="font-medium">Sana: </span>
                    {item.sana}
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

          {/* Pagination */}
          {pagination.total > 0 && (
            <div className="flex justify-end mt-6">
              <Pagination
                current={pagination.current}
                pageSize={pagination.pageSize}
                total={pagination.total}
                onChange={(page, pageSize) =>
                  setPagination((prev) => ({
                    ...prev,
                    current: page,
                    pageSize,
                  }))
                }
                pageSizeOptions={["6", "12", "20", "50"]}
                showTotal={(total, range) =>
                  `${range[0]}-${range[1]} dan jami ${total} ta`
                }
              />
            </div>
          )}
        </div>
      </div>

      {/* Modal */}
      <Modal
        title="Harakat tarkibi yurgan kilometrni qo'shish"
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
            name="kilometr"
            label="Yurgan kilometr"
            rules={[
              { required: true, message: "Kilometrni kiritish majburiy!" },
            ]}
          >
            <InputNumber
              min={1}
              className="w-full"
              placeholder="Masalan: 12345"
            />
          </Form.Item>

          <Form.Item
            name="sana"
            label="Sana"
            rules={[{ required: true, message: "Sanani tanlash majburiy!" }]}
          >
            <DatePicker className="w-full" format="DD.MM.YYYY" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
