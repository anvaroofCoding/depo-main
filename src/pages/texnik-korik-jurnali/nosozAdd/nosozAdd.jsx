import Loading from "@/components/loading/loading";
import {
  useAddNosozlikMutation,
  useAddTexnikMutation,
  useGetehtiyotQuery,
  useGetharakatQuery,
  useGetNosozlikQuery,
  useLazyExportExcelTexnikQuery,
  useLazyExportPdftTexnikQuery,
} from "@/services/api";
import {
  CalendarOutlined,
  DownloadOutlined,
  EyeFilled,
  PlusOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import {
  Button,
  Empty,
  Form,
  Input,
  InputNumber,
  message,
  Modal,
  Select,
  Space,
  Switch,
  Table,
  Tooltip,
  Upload,
} from "antd";
import dayjs from "dayjs";
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function NosozAdd() {
  const [formAdd] = Form.useForm();
  const [yakunlashChecked, setYakunlashChecked] = useState(false);
  const selectedEhtiyot = Form.useWatch("ehtiyot_qismlar", formAdd) || [];

  // const [isEditModal, setIsEditModal] = useState(false)
  // const [editingDepo, setEditingDepo] = useState(null) // tahrir qilinayotgan depo
  // const [formEdit] = Form.useForm()
  const [isAddModal, SetIsAddModal] = useState(false);

  const { Option } = Select;
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });

  //get
  const { data, isLoading, isError, error } = useGetNosozlikQuery(search);

  useEffect(() => {
    if (data?.count !== undefined) {
      setPagination((prev) => ({ ...prev, total: data.count }));
    }
  }, [data]);

  // get ehtiyot qismlar for select
  const { data: dataEhtiyot, isLoading: isLoadingEhtiyot } =
    useGetehtiyotQuery();
  // get harakat tarkibi for select
  const { data: dataHarakat, isLoading: isLoadingHarakat } =
    useGetharakatQuery();
  //post
  const [addNosozlik, { isLoading: load, error: errr }] =
    useAddNosozlikMutation();
  //edit
  // const [updateDepo, { isLoading: loadders }] = useUpdateHarakatMutation()
  // delete
  // const [deleteDep, { isLoading: loadder }] = useDeletetexnikKorikMutation()
  // get depo
  // const { data: dataDepo } = useGetDepQuery()

  const [triggerExport, { isFetching }] = useLazyExportExcelTexnikQuery();
  // pdf
  const [exportPDF, { isFetching: ehtihoyFetching }] =
    useLazyExportPdftTexnikQuery();

  const handleExport = async () => {
    const blob = await triggerExport().unwrap();

    // Faylni yuklash
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "texnik-korik.xlsx"; // fayl nomi
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
    a.download = "texnik-korik.pdf"; // fayl nomi
    document.body.appendChild(a);
    a.click();
    a.remove();
  };

  const handleEnd = async (values) => {
    try {
      const formData = new FormData();

      if (values.tarkib) {
        if (Array.isArray(values.tarkib)) {
          values.tarkib.forEach((val) => {
            formData.append("tarkib", Number(val));
          });
        } else {
          formData.append("tarkib", Number(values.tarkib));
        }
      }

      if (values.tamir_turi) {
        formData.append("tamir_turi", Number(values.tamir_turi));
      }

      formData.append("kamchiliklar_haqida", values.kamchiliklar_haqida);

      const ehtiyotQismlar = (values.ehtiyot_qismlar || []).map((name) => ({
        id: name,
        miqdor: values.ehtiyot_qismlar_miqdor?.[name] || 1,
      }));

      console.log("Yuborilayotgan ehtiyot_qismlar:", ehtiyotQismlar);

      // Aslida backend JSON array kutyapti
      formData.append("ehtiyot_qismlar", JSON.stringify(ehtiyotQismlar));

      formData.append(
        "bartaraf_etilgan_kamchiliklar",
        values.bartaraf_etilgan_kamchiliklar
      );

      formData.append("yakunlash", yakunlashChecked);

      if (yakunlashChecked) {
        if (values.akt_file && values.akt_file.length > 0) {
          const file = values.akt_file[0].originFileObj;
          formData.append("akt_file", file, file.name);
        }
      }

      formData.append("password", values.password);

      await addNosozlik(formData).unwrap();

      message.success("Texnik muvaffaqiyatli qo‘shildi!");
      SetIsAddModal(false);
      formAdd.resetFields();
      setYakunlashChecked(false);
    } catch (err) {
      console.error("Xato:", err);
      message.error("Xatolik yuz berdi!");
    }
  };

  const handleSubmit = async (values) => {
    try {
      const ehtiyotQismlar = (values.ehtiyot_qismlar || []).map((name) => ({
        id: name,
        miqdor: values.ehtiyot_qismlar_miqdor?.[name] || 1,
      }));
      console.log(values.ehtiyot_qismlar);

      const payload = {
        tarkib: values.tarkib,
        nosozliklar_haqida: values.nosozliklar_haqida,
        ehtiyot_qismlar: ehtiyotQismlar, // array of objects
        bartaraf_etilgan_nosozliklar: values.bartaraf_etilgan_nosozliklar,
        password: values.password,
        yakunlash: !!yakunlashChecked,
      };

      const res = await addNosozlik(payload).unwrap();
      console.log("Server javobi:", res);
      message.success("Texnik muvaffaqiyatli qo‘shildi!");
      SetIsAddModal(false);
    } catch (err) {
      console.error("Mutation error:", err);
      // RTK Query xatolari odatda { status, data } ko'rinishida bo'ladi
      if (err?.data) {
        // agar server JSON xato obyekti bergan bo'lsa
        console.error("Serverdan:", err.data);
        message.error(err.data.detail || "Server xatosi.");
      } else if (err?.status) {
        message.error("Status: " + err.status);
      } else {
        message.error("Xatolik yuz berdi!");
      }
    }
  };

  // const handleDelete = async tarkib => {
  // 	try {
  // 		await deleteDep(tarkib.id).unwrap()
  // 		messageApi.success(
  // 			`Harakat tarkibi "${tarkib.tarkib_raqami}" muvaffaqiyatli o'chirildi!`
  // 		)
  // 	} catch (err) {
  // 		console.error(err)
  // 		messageApi.error('Xatolik yuz berdi!')
  // 	}
  // }

  const paginatedDatas = useMemo(() => {
    const safeData = data?.results ?? []; // agar data yo‘q bo‘lsa bo‘sh array
    const start = (pagination.current - 1) * pagination.pageSize;
    const end = start + pagination.pageSize;
    return safeData.slice(start, end);
  }, [data, pagination]);

  if (isLoading || load || isLoadingHarakat || isLoadingEhtiyot) {
    return (
      <div className="w-full h-screen flex justify-center items-center">
        <Loading />
      </div>
    );
  }

  console.log(data);

  if (errr) {
    console.log(errr);
  }

  if (isError) {
    console.log("Xato obyekt:", error);
  }

  const handleAdd = () => {
    SetIsAddModal(true);
  };

  // const handleEdit = depo => {
  // 	setEditingDepo(depo)
  // 	formEdit.setFieldsValue({
  // 		depo_id: depo.depo_id,
  // 		ishla_tushgan_vaqti: depo.ishga_tushgan_vaqti
  // 			? dayjs(depo.ishga_tushgan_vaqti)
  // 			: null,
  // 		guruhi: depo.guruhi,
  // 		turi: depo.turi,
  // 		tarkib_raqami: depo.tarkib_raqami,
  // 		eksplutatsiya_vaqti: depo.eksplutatsiya_vaqti,
  // 		image: depo.image ? [{ url: depo.image }] : [],
  // 	})
  // 	setIsEditModal(true)
  // }

  const handleDetails = (ide) => {
    navigate(`texnik-korik-details/${ide}/`);
  };

  // clear bilan tozalashni bilasizmilarmi ozin nimalar qilyapsizkar

  const handleYakunlashChange = (checked) => {
    setYakunlashChecked(checked);
  };

  // datani filterlash
  const filteredData = dataHarakat?.results?.filter(
    (item) => item.holati == "Soz_holatda"
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
      title: "Tarkib nomi",
      key: "depo",
      width: 250,
      render: (_, record) => (
        <div className="flex items-center gap-3">
          <div>
            <div className="font-medium">{record.tarkib_nomi}</div>
          </div>
        </div>
      ),
      sorter: (a, b) =>
        `${a.depo} ${a.depo}`.localeCompare(`${b.depo} ${b.depo}`),
    },

    {
      title: "Holati",
      dataIndex: "status",
      key: "status",
      width: 150,
      filters: [...new Set(data?.results?.map((item) => item.status))].map(
        (g) => ({
          text: g,
          value: g,
        })
      ),
      onFilter: (value, record) => record.status === value,
      render: (_, record) => (
        <span
          style={{
            backgroundColor:
              record.status === "Soz_holatda"
                ? "#D1FAE5"
                : record.status === "Nosozlikda"
                ? "#d81f1fd7"
                : "#E5E7EB", // default
            color:
              record.status === "Soz_holatda"
                ? "#065F46"
                : record.status === "Nosozlikda"
                ? "white"
                : "#374151", // default
            padding: "2px 6px",
            borderRadius: "4px",
          }}
        >
          {record.status === "Nosozlikda"
            ? "Nosozlikda"
            : record.status === "Soz_holatda"
            ? "Soz holatda"
            : "-"}{" "}
          {/* default */}
        </span>
      ),
    },
    {
      title: "Nosozlik haqida",
      dataIndex: "nosozliklar_haqida",
      key: "nosozliklar_haqida",
      width: 250,
      render: (_, record) => (
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-sm">
            <span>{record.nosozliklar_haqida.slice(0, 40)}...</span>
          </div>
        </div>
      ),
    },
    {
      title: "Kirgan vaqti",
      key: "kirgan_vaqti",
      width: 150,
      render: (_, record) => (
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-sm">
            <span>{dayjs(record.kirgan_vaqti).format("DD.MM.YYYY HH:mm")}</span>
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
      width: 100,
      render: (date) => (
        <div className="flex items-center gap-2">
          <CalendarOutlined />
          <span>{dayjs(date).format("DD.MM.YYYY")}</span>
        </div>
      ),
      sorter: (a, b) => dayjs(a.created_at).unix() - dayjs(b.created_at).unix(),
    },
    {
      title: "Ko'rish",
      key: "actions",
      width: 50,
      fixed: "right",
      render: (_, record) => (
        <Space size="small">
          <Tooltip title="Batafsil ko'rish">
            <Button
              type="text"
              icon={<EyeFilled />}
              onClick={() => handleDetails(record.id)}
              color="blue"
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  return (
    <div className=" bg-gray-50 min-h-screen">
      <div className="bg-white rounded-lg shadow-sm">
        <div className="p-4 border-b border-gray-200 w-full flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">
            <span className="bg-red-500/20 text-red-400 px-3 py-1 rounded-lg">
              Nosozlikni ro'yxatga olish
            </span>
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
            dataSource={paginatedDatas.map((item, index) => ({
              ...item,
              key: item.id || index,
            }))}
            loading={isLoading}
            pagination={{
              current: pagination.current,
              pageSize: pagination.pageSize,
              total: data?.results?.length, // backend emas, frontend bo‘yicha umumiy
              showSizeChanger: true,
              pageSizeOptions: ["5", "10", "20", "50"],
              showTotal: (total, range) =>
                `${range[0]}-${range[1]} dan jami ${total} ta`,
              onChange: (page, pageSize) => {
                setPagination({ current: page, pageSize });
              },
            }}
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

      {/* add Modal */}
      <Modal
        title="Texnik qo'shish"
        open={isAddModal}
        onCancel={() => {
          SetIsAddModal(false);
          formAdd.resetFields();
          setYakunlashChecked(false);
        }}
        width={700}
        footer={[
          !yakunlashChecked ? (
            <Button key="save" type="primary" onClick={() => formAdd.submit()}>
              Saqlash
            </Button>
          ) : (
            <Button
              key="finish"
              type="primary"
              danger
              onClick={() => formAdd.submit()}
            >
              Yakunlash
            </Button>
          ),
          <Button key="cancel" onClick={() => SetIsAddModal(false)}>
            Bekor qilish
          </Button>,
        ]}
      >
        <Form
          form={formAdd}
          layout="vertical"
          onFinish={yakunlashChecked ? handleEnd : handleSubmit}
        >
          {/* Tarkib */}
          <Form.Item
            name="tarkib"
            label="Tarkib raqami kiriting"
            rules={[{ required: true, message: "Tarkib raqamini kiriting!" }]}
          >
            <Select
              placeholder="Tarkib raqamini tanlang"
              showSearch
              optionFilterProp="children"
              filterOption={(input, option) =>
                option?.children?.toLowerCase().includes(input.toLowerCase())
              }
            >
              {filteredData?.map((item) => (
                <Option key={item.id} value={item.id}>
                  {item.tarkib_raqami} {item.guruhi} {item.holati}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="nosozliklar_haqida"
            label="Nosozliklar haqida"
            rules={[{ required: true, message: "Nosozliklarni kiriting!" }]}
          >
            <Input.TextArea rows={3} placeholder="Nosozliklarni yozing..." />
          </Form.Item>

          {/* Ehtiyot qismlar */}
          <Form.Item
            name="ehtiyot_qismlar"
            label="Ehtiyot qismlarni tanlang"
            rules={[{ required: true, message: "Ehtiyot qismlarni tanlang!" }]}
          >
            <Select mode="multiple" placeholder="Ehtiyot qismlarni tanlang">
              {dataEhtiyot?.results?.map((item) => (
                <Option key={item.id} value={item.id}>
                  {item.ehtiyotqism_nomi} ({item.birligi})
                </Option>
              ))}
            </Select>
          </Form.Item>

          {/* ✅ Tanlangan ehtiyot qismlarga qarab avtomatik miqdor inputlarini qo‘shish */}
          {selectedEhtiyot.map((id) => {
            const selectedItem = dataEhtiyot?.results?.find((q) => q.id === id);
            return (
              <Form.Item
                key={id}
                name={["ehtiyot_qismlar_miqdor", id]}
                label={`${selectedItem?.ehtiyotqism_nomi} ${selectedItem?.birligi}`}
                rules={[{ required: true, message: "Miqdor kiriting!" }]}
              >
                <InputNumber min={1} style={{ width: "100%" }} />
              </Form.Item>
            );
          })}

          {/* Bartaraf etilgan kamchiliklar */}
          <Form.Item
            name="bartaraf_etilgan_nosozliklar"
            label="Nosozlikni bartaraf qilganlik xulosasi"
            rules={[{ required: true, message: "Ma'lumot kiriting!" }]}
          >
            <Input.TextArea
              rows={3}
              placeholder="Nosozlikni bartaraf qilgan xulosangizni yozing"
            />
          </Form.Item>

          {/* Yakunlash */}
          <Form.Item
            name="yakunlash"
            label="Yakunlashni xoxlasangiz akt faylni yuklang?"
            valuePropName="checked"
          >
            <Switch
              checked={yakunlashChecked}
              onChange={handleYakunlashChange}
            />
          </Form.Item>

          {/* Chiqqan vaqti va Akt file */}
          {yakunlashChecked && (
            <Form.Item
              name="akt_file"
              label="Akt fayl"
              valuePropName="fileList"
              getValueFromEvent={(e) =>
                Array.isArray(e) ? e : e && e.fileList
              }
              rules={[
                { required: true, message: "Akt fayl yuklash majburiy!" },
              ]}
            >
              <Upload
                name="akt_file"
                listType="picture"
                maxCount={1}
                beforeUpload={() => false}
              >
                <Button icon={<UploadOutlined />}>Akt fayl yuklash</Button>
              </Upload>
            </Form.Item>
          )}

          {/* Password */}
          <Form.Item
            name="password"
            label="Parol"
            rules={[{ required: true, message: "Parolni kiriting!" }]}
          >
            <Input.Password placeholder="Parol" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
