import GoBack from "@/components/GoBack";
import Loading from "@/components/loading/loading";
import {
  useAddTexnikDetailMutation,
  useGetehtiyotQuery,
  useGetharakatQuery,
  useGettamirQuery,
  useGetTexnikAddQuery,
  useGetTexnikDetailsQuery,
  useLazyEcxelStepsQuery,
  useLazyExportExcelTexnikQuery,
  useLazyExportPdftTexnikQuery,
  useLazyPDFStepsQuery,
} from "@/services/api";
import {
  CaretRightOutlined,
  CopyOutlined,
  DownloadOutlined,
  EyeInvisibleOutlined,
  EyeOutlined,
  FileExclamationOutlined,
  PlusOutlined,
  SmileOutlined,
  SolutionOutlined,
  SyncOutlined,
  UploadOutlined,
  UserOutlined,
} from "@ant-design/icons";
import {
  Badge,
  Button,
  Card,
  Collapse,
  Form,
  Input,
  InputNumber,
  Modal,
  Select,
  Space,
  Steps,
  Tooltip,
  Upload,
} from "antd";
import dayjs from "dayjs";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast, Toaster } from "sonner";

export default function TexnikAdd() {
  const [formAdd] = Form.useForm();
  const [search, setSearch] = useState("");
  const [selectedEhtiyot, setSelectedEhtiyot] = useState([]);
  const [amounts, setAmounts] = useState({}); // { id: miqdor }
  const [currentSelecting, setCurrentSelecting] = useState(null); // hozir modalda qaysi id tanlanmoqda
  const [amountModalOpen, setAmountModalOpen] = useState(false);
  const navigate = useNavigate();
  const [isAddModal, SetIsAddModal] = useState(false);
  const [isEndModal, SetIsEndModal] = useState(false);
  const { Option } = Select;
  const params = useParams();
  const { ide } = params;
  const { data, isLoading, isError, error } = useGetTexnikAddQuery();
  const { data: texnikdatas, isLoading: loadings } = useGetTexnikDetailsQuery({
    ide,
    search,
  });
  const { data: tamir, isLoading: loadser } = useGettamirQuery();
  const mainFiltered = data?.results?.find((item) => {
    const recConnect = item?.id == ide;
    return recConnect;
  });
  const secondMainFiltered = data?.results.find((itemsOne) => {
    return itemsOne?.pervious_version == mainFiltered?.tarkib_detail?.id;
  });
  const { data: dataEhtiyot, isLoading: isLoadingEhtiyot } =
    useGetehtiyotQuery();
  const [addTexnikDetail, { isLoading: load, error: errr }] =
    useAddTexnikDetailMutation();
  const { data: dataHarakat, isLoading: isLoadingHarakat } =
    useGetharakatQuery();
  const [triggerExport, { isFetching }] = useLazyEcxelStepsQuery();
  const [exportPDF, { isFetching: ehtihoyFetching }] = useLazyPDFStepsQuery();
  const handleExport = async () => {
    const blob = await triggerExport({ ide }).unwrap();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "texnik-korik.xlsx"; // fayl nomi
    document.body.appendChild(a);
    a.click();
    a.remove();
  };
  const handlepdf = async () => {
    const blob = await exportPDF({ ide }).unwrap();
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
      formData.append("korik", ide);
      formData.append("kamchiliklar_haqida", values.kamchiliklar_haqida);
      const ehtiyotQismlar = (values.ehtiyot_qismlar || []).map((id) => ({
        ehtiyot_qism: id,
        miqdor: amounts[id] || 1, // miqdorni state'dan olayapmiz
      }));
      formData.append("ehtiyot_qismlar", JSON.stringify(ehtiyotQismlar));
      formData.append(
        "bartaraf_etilgan_kamchiliklar",
        values.bartaraf_etilgan_kamchiliklar
      );
      formData.append("yakunlash", true);
      if (values.akt_file && values.akt_file.length > 0) {
        const file = values.akt_file[0].originFileObj;
        formData.append("akt_file", file, file.name);
      }
      formData.append("password", values.password);
      await addTexnikDetail(formData).unwrap();
      toast.success("Texnik muvaffaqiyatli qo‘shildi!");
      formAdd.resetFields();
      SetIsEndModal(false);
    } catch (err) {
      console.error("Xato:", err);
      if (err.data.akt_file) toast.warning(err.data.akt_file[0]);
    }
  };
  const handleSubmit = async (values) => {
    try {
      const ehtiyotQismlar = (values.ehtiyot_qismlar || []).map((id) => ({
        ehtiyot_qism: id,
        miqdor: amounts[id] || 1, // miqdorni state’dan olayapmiz
      }));

      const payload = {
        korik: ide,
        kamchiliklar_haqida: values.kamchiliklar_haqida,
        ehtiyot_qismlar: ehtiyotQismlar,
        bartaraf_etilgan_kamchiliklar: values.bartaraf_etilgan_kamchiliklar,
        password: values.password,
        yakunlash: false,
      };
      console.log(ehtiyotQismlar);

      const res = await addTexnikDetail(payload).unwrap();
      toast.success("Texnik muvaffaqiyatli qo‘shildi!");
      formAdd.resetFields();
      SetIsAddModal(false);
    } catch (err) {
      console.error("Mutation error:", err);
      if (err?.data) {
        console.error("Serverdan:", err.data);
        toast.error(err.data.detail || "Server xatosi.");
      } else if (err?.status) {
        toast.error("Status: " + err.status);
      } else {
        toast.error("Xatolik yuz berdi!");
      }
    }
  };
  if (
    isLoading ||
    load ||
    loadings ||
    isLoadingEhtiyot ||
    isLoadingHarakat ||
    loadser
  ) {
    return (
      <div className="w-full h-screen flex justify-center items-center">
        <Loading />
      </div>
    );
  }
  const finded = texnikdatas.steps.results.find((item) => {
    const returns = item.status == "Yakunlandi" || item.status == "Soz_holatda";
    return returns;
  });
  if (errr) {
    if (errr.data.ehtiyot_qismlar) {
      toast.warning("Afsuski bu ehtiyot qismdan omborda mavjud emas 😔");
    }
    if (errr.data.password) {
      toast.error("Iltimos parolingizni tog'ri yozing 🙏");
    }
    console.log(errr);
  }
  if (isError) {
    console.log("Xato obyekt:", error);
  }
  const handleAdd = () => {
    SetIsAddModal(true);
  };
  const handleEnds = () => {
    SetIsEndModal(true);
  };
  const filterData = data.results.find((item) => item.id == ide);
  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    toast.success("Nusxa olindi!");
  };
  const getStatusStyle = (status) => {
    switch (status) {
      case "Yakunlandi":
        return "bg-emerald-50 text-emerald-700 border-emerald-200";
      case "Jarayonda":
        return "bg-blue-50 text-blue-700 border-blue-200";
      case "Soz_holatda":
      case "Texnik_korikda":
        return "bg-amber-50 text-amber-700 border-amber-200";
      default:
        return "bg-gray-50 text-gray-600 border-gray-200";
    }
  };
  const getStatusText = (status) => {
    switch (status) {
      case "Yakunlandi":
        return "Yakunlandi";
      case "Soz_holatda":
      case "Texnik_korikda":
        return "Texnik ko'rikda";
      case "Jarayonda":
        return "Jarayonda";
      default:
        return "-";
    }
  };
  const items = texnikdatas?.steps?.results?.map((item) => ({
    key: item.id,
    label: (
      <div className="w-full">
        {/* Mobile-first responsive grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 lg:gap-6 w-full">
          {/* ID */}
          <div className="flex flex-col space-y-1">
            <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">
              ID
            </span>
            <span className="text-sm font-semibold text-gray-900">
              #{item.id}
            </span>
          </div>

          {/* Ta'mir turi */}
          <div className="flex flex-col space-y-1">
            <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">
              Ta'mir turi
            </span>
            <span className="text-sm font-medium text-gray-900 line-clamp-2">
              {item.tamir_turi_nomi}
            </span>
          </div>

          {/* Holati */}
          <div className="flex flex-col space-y-1">
            <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">
              Holati
            </span>
            <span
              className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border transition-all duration-200 ${getStatusStyle(
                item.status
              )}`}
            >
              <div
                className={`w-1.5 h-1.5 rounded-full mr-1.5 ${
                  item.status === "Yakunlandi"
                    ? "bg-emerald-500"
                    : item.status === "Jarayonda"
                    ? "bg-blue-500"
                    : "bg-amber-500"
                }`}
              />
              {getStatusText(item.status)}
            </span>
          </div>

          {/* Sana */}
          <div className="flex flex-col space-y-1">
            <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">
              Yaratilgan sana
            </span>
            <span className="text-sm font-medium text-gray-900">
              {dayjs(item.created_at).format("DD.MM.YYYY HH:mm")}
            </span>
          </div>

          {/* Tasdiqladi */}
          <div className="flex flex-col space-y-1">
            <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">
              Tasdiqladi
            </span>
            <span className="text-sm font-medium text-gray-900 truncate">
              {item.created_by}
            </span>
          </div>
        </div>
      </div>
    ),
    children: (
      <div className="space-y-6 pt-2">
        {/* Bartaraf etilgan kamchiliklar */}
        <div className="bg-gray-50/50 rounded-xl p-4 border border-gray-100">
          <div className="flex items-start justify-between mb-2">
            <h4 className="text-sm font-semibold text-gray-900">
              Bartaraf etilgan kamchiliklar
            </h4>
            {item.bartaraf_etilgan_kamchiliklar && (
              <button
                onClick={() => handleCopy(item.bartaraf_etilgan_kamchiliklar)}
                className="p-1.5 rounded-lg hover:bg-gray-200/60 transition-colors duration-200 group"
              >
                <CopyOutlined className="text-gray-400 group-hover:text-gray-600 text-sm" />
              </button>
            )}
          </div>
          <p className="text-sm text-gray-700 leading-relaxed break-words whitespace-pre-line">
            {item.bartaraf_etilgan_kamchiliklar || (
              <span className="text-gray-400 italic">
                Ma'lumot kiritilmagan
              </span>
            )}
          </p>
        </div>

        {/* Kamchilik haqida batafsil xulosa */}
        <div className="bg-blue-50/30 rounded-xl p-4 border border-blue-100/50 ">
          <div className="flex items-start justify-between mb-2 ">
            <h4 className="text-sm font-semibold text-gray-900">
              Kamchilik haqida batafsil xulosa
            </h4>
            {item.kamchiliklar_haqida && (
              <button
                onClick={() => handleCopy(item.kamchiliklar_haqida)}
                className="p-1.5 rounded-lg hover:bg-blue-200/40 transition-colors duration-200 group"
              >
                <CopyOutlined className="text-gray-400 group-hover:text-blue-600 text-sm" />
              </button>
            )}
          </div>
          <p className="text-sm text-gray-700 leading-relaxed break-words whitespace-pre-line">
            {item.kamchiliklar_haqida || (
              <span className="text-gray-400 italic">
                Ma'lumot kiritilmagan
              </span>
            )}
          </p>
        </div>

        {/* ehtiyot qism  */}
        <div className="bg-blue-50/30 rounded-xl p-4 border border-blue-100/50">
          <div className="flex items-start justify-between mb-2">
            <h4 className="text-sm font-semibold text-gray-900">
              Ishlatilgan ehtiyot qismlar
            </h4>
          </div>
          <div className="text-sm text-gray-700 leading-relaxed flex gap-5 flex-wrap">
            {item.ehtiyot_qismlar_detail?.length ? (
              item.ehtiyot_qismlar_detail.map((eht, index) => (
                <Space
                  key={eht?.id} // 🔑 muhim
                  direction="vertical"
                  size="middle"
                  style={{ minWidth: "150px" }} // 🔄 10% o‘rniga mosroq variant
                >
                  <Badge.Ribbon
                    text={`${eht.ishlatilgan_miqdor} ${eht.birligi}`}
                  >
                    <Card title={`#${index + 1}`} size="small">
                      {eht.ehtiyot_qism_nomi}
                    </Card>
                  </Badge.Ribbon>
                </Space>
              ))
            ) : (
              <span className="text-gray-400 italic">
                Ma'lumot kiritilmagan
              </span>
            )}
          </div>
        </div>
      </div>
    ),
  }));
  const handleVagon = () => {
    navigate(
      `/texnik-ko'rik-qoshish/texnik-korik-details/${secondMainFiltered.id}/`,
      { replace: true } // optional – tarixni almashtirish uchun
    );
  };
  const findedTamir = tamir?.results?.find((item) => {
    return item.id == texnikdatas?.tamir_turi;
  });
  return (
    <div className=" bg-gray-50 min-h-screen">
      <Toaster position="bottom-center" richColors />
      <div className="bg-white rounded-lg shadow-sm">
        <div className="p-4 border-b border-gray-200 w-full flex justify-between items-center">
          <div className="flex items-center gap-4 justify-center">
            <GoBack />
            <h1 className="text-3xl font-bold text-gray-900 bg-gray-200/60 px-3 py-1 rounded-lg inline-block">
              {filterData.tarkib_nomi} | {filterData.tamir_turi_nomi}
            </h1>
          </div>
          <Input.Search
            placeholder="Tarkib raqami bo‘yicha qidirish..."
            allowClear
            onSearch={(value) => {
              setSearch(value);
            }}
            style={{ width: 300 }}
          />
          <div className="flex justify-center items-center gap-5">
            <Tooltip title="Vagonlar o'zgargan ko'rishni xohlasangiz bosing!">
              {texnikdatas?.is_active ? (
                <Badge dot color="red" offset={[0, 5]}>
                  <Button
                    variant="solid"
                    color="geekblue"
                    icon={<EyeOutlined />}
                    onClick={handleVagon}
                  />
                </Badge>
              ) : (
                <Button
                  variant="solid"
                  color="geekblue"
                  icon={<EyeInvisibleOutlined />}
                  onClick={handleVagon}
                  disabled
                />
              )}
            </Tooltip>
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

            {finded ? (
              <span className="bg-green-500/20 text-green-800 rounded-lg px-3 py-1">
                Yakunlangan:{" "}
                {dayjs(finded.created_at).format("DD.MM.YYYY HH:mm")}
              </span>
            ) : (
              <div className="flex gap-5">
                <Button
                  variant="solid"
                  color="cyan"
                  icon={<FileExclamationOutlined />}
                  onClick={handleEnds}
                >
                  Yakunlash
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
            )}
          </div>
        </div>

        <div className="p-6">
          <Steps
            current={Math.max(
              0,
              texnikdatas?.steps?.results?.findIndex(
                (s) => s.status === data?.status
              )
            )}
            items={texnikdatas?.steps?.results
              ?.reduce((acc, step) => {
                // Agar oldin qo‘shilmagan bo‘lsa yoki Jarayonda bo‘lsa faqat 1 marta kiradi
                if (
                  step.status === "Jarayonda" &&
                  acc.some((item) => item.status === "Jarayonda")
                ) {
                  return acc;
                }
                acc.push(step);
                return acc;
              }, [])
              ?.map((step) => {
                // Ranglar statusga qarab
                const statusColor =
                  step.status === "Texnik_korikda" ||
                  step.status === "Soz_holatda"
                    ? "#1677ff" // ko‘k
                    : step.status === "Jarayonda"
                    ? "#faad14" // sariq
                    : step.status === "Yakunlandi"
                    ? "#52c41a" // yashil
                    : "#8c8c8c"; // kulrang (default)

                return {
                  title:
                    step.status === "Soz_holatda" ||
                    step.status === "Texnik_korikda"
                      ? "Texnik korikda"
                      : step.status === "Jarayonda"
                      ? "Jarayonda"
                      : step.status === "Yakunlandi"
                      ? "Yakunlandi"
                      : step.status,
                  description:
                    step.kamchiliklar_haqida?.length > 30
                      ? step.kamchiliklar_haqida.slice(0, 30) + "..."
                      : step.kamchiliklar_haqida || "Izoh kiritilmagan",
                  icon:
                    step.status === "Texnik_korikda" ||
                    step.status === "Soz_holatda" ? (
                      <SolutionOutlined style={{ color: statusColor }} />
                    ) : step.status === "Jarayonda" ? (
                      <SyncOutlined style={{ color: statusColor }} /> // endi oddiy icon
                    ) : step.status === "Yakunlandi" ? (
                      <SmileOutlined style={{ color: statusColor }} />
                    ) : (
                      <UserOutlined style={{ color: statusColor }} />
                    ),
                };
              })}
          />
        </div>
        <div className="p-6">
          <Collapse
            bordered={false}
            accordion
            expandIcon={({ isActive }) => (
              <CaretRightOutlined rotate={isActive ? 90 : 0} />
            )}
            items={items}
          />
        </div>
      </div>
      <Modal
        title="Texnik qo'shish"
        open={isAddModal}
        onCancel={() => {
          SetIsAddModal(false);
          formAdd.resetFields();
        }}
        width={700}
        footer={[
          <Button key="save" type="primary" onClick={() => formAdd.submit()}>
            Saqlash
          </Button>,
        ]}
      >
        <Form form={formAdd} layout="vertical" onFinish={handleSubmit}>
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
        title="Texnik ko'rikni yakunlash"
        open={isEndModal}
        onCancel={() => {
          SetIsEndModal(false);
          formAdd.resetFields();
        }}
        width={700}
        footer={[
          <Button key="save" type="primary" onClick={() => formAdd.submit()}>
            Saqlash
          </Button>,
        ]}
      >
        <Form form={formAdd} layout="vertical" onFinish={handleEnd}>
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
            label="Nosozlikni bartaraf qilgan xulosasi"
            rules={[{ required: true, message: "Ma'lumot kiriting!" }]}
          >
            <Input.TextArea
              rows={3}
              placeholder="Nosozlikni tartaraf qilgan xulosasini yozing"
            />
          </Form.Item>

          {findedTamir.akt_check && (
            <Form.Item
              name="akt_file"
              label="Akt fayl"
              valuePropName="fileList"
              getValueFromEvent={(e) =>
                Array.isArray(e) ? e : e && e.fileList
              }
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
<style jsx global>{`
  .apple-collapse .ant-collapse-item {
    background: white;
    border: 1px solid #f1f5f9;
    border-radius: 16px;
    margin-bottom: 12px;
    overflow: hidden;
    box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.05);
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  }

  .apple-collapse .ant-collapse-item:hover {
    box-shadow: 0 4px 12px 0 rgba(0, 0, 0, 0.08);
    border-color: #e2e8f0;
  }

  .apple-collapse .ant-collapse-header {
    padding: 20px 24px !important;
    border: none !important;
    background: transparent;
  }

  .apple-collapse .ant-collapse-header:hover {
    background: rgba(248, 250, 252, 0.5) !important;
  }

  .apple-collapse .ant-collapse-content {
    border: none !important;
    background: transparent;
  }

  .apple-collapse .ant-collapse-content-box {
    padding: 0 24px 24px 24px !important;
  }

  .apple-collapse .ant-collapse-expand-icon {
    color: #64748b !important;
    font-size: 14px !important;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
  }

  .apple-collapse .ant-collapse-item-active .ant-collapse-expand-icon {
    color: #3b82f6 !important;
  }

  .apple-collapse .ant-collapse-expand-icon:hover {
    color: #3b82f6 !important;
  }

  .line-clamp-2 {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
`}</style>;
