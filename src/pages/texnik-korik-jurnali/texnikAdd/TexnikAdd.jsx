import Loading from "@/components/loading/loading";
import {
  useAddTexnikMutation,
  useGetehtiyotQuery,
  useGetharakatQuery,
  useGettamirQuery,
  useGetTexnikAddQuery,
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

export default function TexnikAdd() {
  const [formAdd] = Form.useForm();
  const [yakunlashChecked, setYakunlashChecked] = useState(false);
  const [selectedEhtiyot, setSelectedEhtiyot] = useState([]);
  const [amounts, setAmounts] = useState({}); // { id: miqdor }
  const [currentSelecting, setCurrentSelecting] = useState(null); // hozir modalda qaysi id tanlanmoqda
  const [amountModalOpen, setAmountModalOpen] = useState(false);

  // const [isEditModal, setIsEditModal] = useState(false)
  // const [editingDepo, setEditingDepo] = useState(null) // tahrir qilinayotgan depo
  // const [formEdit] = Form.useForm()
  const [isAddModal, SetIsAddModal] = useState(false);

  const { Option } = Select;
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 20,
    total: 0,
  });

  //get
  const { data, isLoading, isError, error } = useGetTexnikAddQuery(search);

  useEffect(() => {
    if (data?.count !== undefined) {
      setPagination((prev) => ({ ...prev, total: data.count }));
    }
  }, [data]);

  //   const handleTableChange = (newPagination) => {
  //     setPagination((prev) => ({
  //       ...prev,
  //       // agar pageSize o'zgargan bo'lsa currentni 1 ga qaytarishni xohlasang:
  //       current: newPagination.current,
  //       pageSize: newPagination.pageSize,
  //     }));
  //   };

  // get ehtiyot qismlar for select
  const { data: dataEhtiyot, isLoading: isLoadingEhtiyot } =
    useGetehtiyotQuery();
  // get tamir turi for select
  const { data: dataTamir, isLoading: isLoadingTamir } = useGettamirQuery();
  // get harakat tarkibi for select
  const { data: dataHarakat, isLoading: isLoadingHarakat } =
    useGetharakatQuery();
  //post
  const [addTexnik, { isLoading: load, error: errr }] = useAddTexnikMutation();

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

      // tarkib
      if (values.tarkib) {
        if (Array.isArray(values.tarkib)) {
          values.tarkib.forEach((val) => {
            formData.append("tarkib", Number(val));
          });
        } else {
          formData.append("tarkib", Number(values.tarkib));
        }
      } else {
        formData.append("tarkib", 0);
      }

      // tamir_turi
      formData.append(
        "tamir_turi",
        values.tamir_turi ? Number(values.tamir_turi) : 0
      );

      // oddiy text maydonlar
      formData.append("kamchiliklar_haqida", values.kamchiliklar_haqida || "");
      formData.append(
        "bartaraf_etilgan_kamchiliklar",
        values.bartaraf_etilgan_kamchiliklar || ""
      );
      formData.append("yakunlash", yakunlashChecked);
      formData.append("password", values.password || "");

      // ehtiyot qismlar JSON qilib yuboramiz
      const ehtiyotQismlar = (values.ehtiyot_qismlar || []).map((id) => ({
        ehtiyot_qism: id,
        miqdor: amounts[id],
      }));
      formData.append("ehtiyot_qismlar", JSON.stringify(ehtiyotQismlar));

      // Faylni qo‘shish (haqiqiy fayl sifatida)
      if (yakunlashChecked && values.akt_file && values.akt_file.length > 0) {
        const file = values.akt_file[0].originFileObj;
        formData.append("akt_file", file, file.name);
      }

      // Debug uchun
      for (let pair of formData.entries()) {
        console.log(pair[0], pair[1]);
      }

      await addTexnik(formData).unwrap();

      console.log(ehtiyotQismlar);

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
      const ehtiyotQismlar = (values.ehtiyot_qismlar || []).map((id) => ({
        id,
        miqdor: amounts[id] || 1, // miqdorni state’dan olayapmiz
      }));

      const payload = {
        tarkib: values.tarkib,
        tamir_turi: values.tamir_turi,
        kamchiliklar_haqida: values.kamchiliklar_haqida,
        ehtiyot_qismlar: ehtiyotQismlar,
        bartaraf_etilgan_kamchiliklar: values.bartaraf_etilgan_kamchiliklar,
        password: values.password,
        yakunlash: !!yakunlashChecked,
      };

      await addTexnik(payload).unwrap();
      message.success("Texnik muvaffaqiyatli qo‘shildi!");
      SetIsAddModal(false);
    } catch (err) {
      console.error("Mutation error:", err);
      if (err?.data) {
        message.error(err.data.detail || "Server xatosi.");
      } else if (err?.status) {
        message.error("Status: " + err.status);
      } else {
        message.error("Xatolik yuz berdi!");
      }
    }
  };

  const paginatedDatas = useMemo(() => {
    const safeData = data?.results ?? []; // agar data yo‘q bo‘lsa bo‘sh array
    const start = (pagination.current - 1) * pagination.pageSize;
    const end = start + pagination.pageSize;
    return safeData.slice(start, end);
  }, [data, pagination]);

  if (
    isLoading ||
    load ||
    // loadders ||
    // loadder ||
    isLoadingHarakat ||
    isLoadingTamir ||
    isLoadingEhtiyot
  ) {
    return (
      <div className="w-full h-screen flex justify-center items-center">
        <Loading />
      </div>
    );
  }

  if (errr) {
    console.log(errr);
  }

  if (isError) {
    console.log("Xato obyekt:", error);
  }

  const handleAdd = () => {
    SetIsAddModal(true);
  };

  const handleDetails = (ide) => {
    navigate(`texnik-korik-details/${ide}/`);
  };

  const handleYakunlashChange = (checked) => {
    setYakunlashChecked(checked);
  };

  // datani filterlash
  const filteredData = dataHarakat?.results?.filter(
    (item) => item.holati == "Soz_holatda" && item.is_active == true
  );

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      width: 50,
      sorter: (a, b) => a.id - b.id,
    },
    {
      title: "Tarkib nomi",
      key: "depo",
      width: 150,
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
      title: "Tamir turi",
      dataIndex: "tamir_turi_nomi",
      key: "tamir_turi_nomi",
      width: 100,
      filters: [
        ...new Set(data?.results?.map((item) => item.tamir_turi_nomi)),
      ].map((g) => ({
        text: g,
        value: g,
      })),
      onFilter: (value, record) => record.tamir_turi_nomi === value,
    },
    {
      title: "Tarkib holati",
      dataIndex: "status",
      key: "status",
      width: 100,
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
                : record.status === "Texnik_korikda"
                ? "#FEF3C7"
                : "#E5E7EB", // default
            color:
              record.status === "Soz_holatda"
                ? "#065F46"
                : record.status === "Texnik_korikda"
                ? "#78350F"
                : "#374151", // default
            padding: "2px 6px",
            borderRadius: "4px",
          }}
        >
          {record.status === "Nosozlikda"
            ? "Nosozlikda"
            : record.status === "Soz_holatda"
            ? "Soz holatda"
            : record.status === "Texnik_korikda"
            ? "Texnik ko'rikda"
            : "-"}{" "}
          {/* default */}
        </span>
      ),
    },
    {
      title: "Vagonlar holati",
      dataIndex: "is_active",
      key: "is_active",
      width: 100,
      filters: [
        { text: "O'zgarmagan", value: true },
        { text: "O'zgargan", value: false },
      ],
      onFilter: (value, record) => {
        // tarkib_detail.is_active ni aniq boolean qilib tekshiramiz
        const active =
          record.tarkib_detail?.is_active === true ||
          record.tarkib_detail?.is_active === 1 ||
          record.tarkib_detail?.is_active === "true";
        return active === value;
      },
      render: (_, record) => {
        const active =
          record.tarkib_detail?.is_active === true ||
          record.tarkib_detail?.is_active === 1 ||
          record.tarkib_detail?.is_active === "true";

        return (
          <span
            style={{
              backgroundColor: active ? "#E0F2FE" : "#dcf7d8ff",
              color: active ? "#075985" : "#0b611eff",
              padding: "2px 8px",
              borderRadius: "8px",
              fontWeight: 500,
              display: "inline-block",
              minWidth: "90px",
              textAlign: "center",
            }}
          >
            {active ? "O'zgarmagan" : "O'zgargan"}
          </span>
        );
      },
    },
    {
      title: "Kirgan vaqti",
      key: "kirgan_vaqti",
      width: 100,
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
          {/* <Tooltip title='Tahrirlash'>
							<Button
								type='text'
								icon={<EditOutlined />}
								// onClick={() => handleEdit(record)}
								onClick={() => handleEdit(record)}
							/>
						</Tooltip>
						<Tooltip title="O'chirish">
							<Button
								type='text'
								icon={<DeleteOutlined />}
								onClick={() => handleDelete(record)}
								danger
							/>
						</Tooltip> */}
        </Space>
      ),
    },
  ];

  return (
    <div className=" bg-gray-50 min-h-screen">
      <div className="bg-white rounded-lg shadow-sm">
        <div className="p-4 border-b border-gray-200 w-full flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">
            Texnik ko'rikni ro'yxatga olish
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

          {/* Ta'mir turi */}
          <Form.Item
            name="tamir_turi"
            label="Ta'mir turini tanlang"
            rules={[{ required: true, message: "Ta'mir turini kiriting!" }]}
          >
            <Select placeholder="Ta'mir turini tanlang" showSearch>
              {dataTamir?.results?.map((item) => (
                <Option key={item.id} value={item.id}>
                  {item.tamir_nomi}
                </Option>
              ))}
            </Select>
          </Form.Item>

          {/* Kamchiliklar */}
          <Form.Item
            name="kamchiliklar_haqida"
            label="Kamchiliklar haqida"
            rules={[{ required: true, message: "Kamchiliklarni kiriting!" }]}
          >
            <Input.TextArea rows={3} placeholder="Kamchiliklarni yozing..." />
          </Form.Item>

          {/* Ehtiyot qismlar */}
          <Form.Item name="ehtiyot_qismlar" label="Ehtiyot qismlarni tanlang">
            <Select
              mode="multiple"
              placeholder="Ehtiyot qismlarni tanlang"
              value={selectedEhtiyot}
              onChange={(values) => {
                // yangi qo‘shilgan itemni aniqlaymiz
                const newlyAdded = values.find(
                  (v) => !selectedEhtiyot.includes(v)
                );
                setSelectedEhtiyot(values);
                if (newlyAdded) {
                  setCurrentSelecting(newlyAdded);
                  setAmountModalOpen(true);
                }
              }}
              tagRender={(props) => {
                const { label, value, onClose } = props;

                // 🔹 value orqali dataEhtiyotdan birligini topamiz:
                const birligi =
                  dataEhtiyot?.results?.find((item) => item.id === value)
                    ?.birligi || "";

                return (
                  <div
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      background: "#f0f0f0",
                      padding: "2px 6px",
                      borderRadius: 4,
                      marginRight: 4,
                    }}
                  >
                    <span>{label}</span>
                    {amounts[value] && (
                      <span
                        style={{
                          background: "#1890ff",
                          color: "#fff",
                          borderRadius: 8,
                          padding: "0 6px",
                          marginLeft: 4,
                        }}
                      >
                        {/* 🔹 Miqdor + birligi badge ichida */}
                        {amounts[value]} {birligi}
                      </span>
                    )}
                    <span
                      onClick={onClose}
                      style={{
                        marginLeft: 4,
                        cursor: "pointer",
                        color: "#999",
                      }}
                    >
                      ×
                    </span>
                  </div>
                );
              }}
            >
              {dataEhtiyot?.results?.map((item) => (
                <Option key={item.id} value={item.id}>
                  {item.ehtiyotqism_nomi}
                </Option>
              ))}
            </Select>
          </Form.Item>

          {/* Bartaraf etilgan kamchiliklar */}
          <Form.Item
            name="bartaraf_etilgan_kamchiliklar"
            label="Texnik ko'rik xulosasi"
            rules={[{ required: true, message: "Ma'lumot kiriting!" }]}
          >
            <Input.TextArea
              rows={3}
              placeholder="Texnik ko'rik xulosasini yozing"
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

      <Modal
        title="Miqdor kiriting"
        open={amountModalOpen}
        onCancel={() => setAmountModalOpen(false)}
        footer={null}
        closable={false} // 🔹 X ni o‘chiradi
        maskClosable={false} // 🔹 fonni bosib yopishni bloklaydi
      >
        {currentSelecting && (
          <div style={{ display: "flex", gap: "8px" }}>
            <InputNumber
              min={1}
              value={amounts[currentSelecting]}
              onChange={(val) =>
                setAmounts((prev) => ({ ...prev, [currentSelecting]: val }))
              }
            />
            <Button
              type="primary"
              disabled={!amounts[currentSelecting]} // input bo‘sh bo‘lsa disable
              onClick={() => setAmountModalOpen(false)}
            >
              Saqlash
            </Button>
          </div>
        )}
      </Modal>
    </div>
  );
}
