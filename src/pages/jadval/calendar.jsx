import { useEffect, useState } from "react";
import {
  Alert,
  Calendar,
  Badge,
  Modal,
  Table,
  Button,
  Form,
  Select,
  Tooltip,
  Space,
} from "antd";
import dayjs from "dayjs";
import {
  useGetharakatQuery,
  useGetJadvalQuery,
  useLazyExporPDFJadvalQuery,
} from "@/services/api";
import Loading from "@/components/loading/loading";
import { toast } from "sonner";
import { ClearOutlined, CloudDownloadOutlined } from "@ant-design/icons";

const Calendars = () => {
  const [refreshKey, setRefreshKey] = useState(0);
  const [yil, setYil] = useState(null);
  const [oy, setOy] = useState(null);
  const [tarkib_id, SetTarkib_id] = useState("");
  const [mod, setMod] = useState(false);
  const [value, setValue] = useState(() => dayjs());
  const [selectedValue, setSelectedValue] = useState(() => dayjs());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedData, setSelectedData] = useState([]);
  const { data: harakat, isLoading: lodasss } = useGetharakatQuery();
  const { data, isLoading, refetch } = useGetJadvalQuery({ tarkib_id });
  const [exportPDF, { isFetching: pdfLoading }] = useLazyExporPDFJadvalQuery();
  const yillar = Array.from({ length: 6 }, (_, i) => 2025 + i);
  const oylar = [
    { nom: "Yanvar", value: 1 },
    { nom: "Fevral", value: 2 },
    { nom: "Mart", value: 3 },
    { nom: "Aprel", value: 4 },
    { nom: "May", value: 5 },
    { nom: "Iyun", value: 6 },
    { nom: "Iyul", value: 7 },
    { nom: "Avgust", value: 8 },
    { nom: "Sentabr", value: 9 },
    { nom: "Oktabr", value: 10 },
    { nom: "Noyabr", value: 11 },
    { nom: "Dekabr", value: 12 },
  ];
  const results = data?.results?.filter((item) => item?.tamir_nomi);
  const getListData = (date) => {
    const formattedDate = date.format("YYYY-MM-DD");
    return results?.filter((item) => item.sana === formattedDate);
  };
  const dateCellRender = (value) => {
    const listData = getListData(value);
    if (listData.length === 0) return null;
    return (
      <div>
        <ul
          style={{
            position: "absolute",
            bottom: "4px",
            left: "6px",
            display: "flex",
            gap: "3px",
            margin: 0,
            padding: 0,
            listStyle: "none",
          }}
        >
          {listData.map((_, index) => (
            <li key={index}>
              <Badge status="processing" />
            </li>
          ))}
        </ul>
      </div>
    );
  };
  const onSelect = (newValue) => {
    setValue(newValue);
    setSelectedValue(newValue);
    const items = getListData(newValue);
    if (items.length > 0) {
      setSelectedData(items);
      setIsModalOpen(true);
    } else {
      // Show toast instead of opening modal for empty dates
      toast.info(`${newValue.format("YYYY-MM-DD")} sanasida ma'lumot yo'q`);
    }
    setRefreshKey((prev) => prev + 1);
  };
  useEffect(() => {
    if (selectedValue) {
      const items = getListData(selectedValue);
      setSelectedData(items);
    }
  }, [data, selectedValue]);
  if (isLoading || lodasss) {
    return (
      <div className="w-full h-screen flex justify-center items-center">
        <Loading />
      </div>
    );
  }
  const onPanelChange = (newValue) => {
    setValue(newValue);
  };
  const columns = [
    {
      title: "Depo nomi",
      dataIndex: "depo_nomi",
      key: "depo_nomi",
    },
    {
      title: "Tarkib raqami",
      dataIndex: "tarkib_raqami",
      key: "tarkib_raqami",
    },
    {
      title: "Ta'mir turi",
      dataIndex: "tamir_nomi",
      key: "tamir_nomi",
    },
    {
      title: "Sana",
      dataIndex: "sana",
      key: "sana",
    },
  ];
  const clear = () => {
    SetTarkib_id("");
  };
  const ochpdf = async () => {
    setMod(true);
  };
  const handlepdf = async () => {
    const blob = await exportPDF({ oy, yil }).unwrap();
    toast.success("Pdf fayli muvaffaqiyatli yuklandi");
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${oy + "." + yil}-jadvali.pdf`;
    document.body.appendChild(a);
    a.click();
    a.remove();
  };
  return (
    <div className="w-full h-screen flex justify-start items-center p-5 flex-col">
      <div className=" w-full pb-4 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <Select
            showSearch
            type="primary"
            placeholder="Harakat tarkibini tanlang"
            value={tarkib_id || undefined}
            optionFilterProp="children"
            filterOption={(input, option) =>
              option?.children
                ?.toString()
                ?.toLowerCase()
                ?.includes(input.toLowerCase())
            }
            filterSort={(optionA, optionB) =>
              optionA.children
                .toString()
                .toLowerCase()
                .localeCompare(optionB.children.toString().toLowerCase())
            }
            onChange={(value) => {
              SetTarkib_id(value);
            }}
          >
            {harakat?.results?.map((item) => (
              <Select.Option key={item?.id} value={item?.id}>
                {item?.tarkib_raqami}
              </Select.Option>
            ))}
          </Select>
          <Button variant="solid" color="primary" onClick={clear}>
            Tozalash <ClearOutlined />
          </Button>
        </div>
        <div>
          <Space size="middle">
            <Tooltip title="Harakat tarkibining texnik ko'riklar ko'rsatkichi pdf shaklda">
              <Button
                variant="solid"
                color="volcano"
                size="middle"
                loading={pdfLoading}
                onClick={() => ochpdf()}
                icon={<CloudDownloadOutlined />}
              >
                PDF fayl yuklash
              </Button>
            </Tooltip>
          </Space>
        </div>
      </div>
      <div>
        <Alert
          message={`Tanlangan sana: ${selectedValue?.format("YYYY-MM-DD")}`}
          className="mb-4"
        />

        <Calendar
          value={value}
          onSelect={onSelect}
          onPanelChange={onPanelChange}
          dateCellRender={dateCellRender}
        />

        {/* Modal - Only shows when there is data */}
        <Modal
          title={`${selectedValue.format(
            "YYYY-MM-DD"
          )} sanasidagi jadval ma'lumotlari`}
          open={isModalOpen}
          onCancel={() => setIsModalOpen(false)}
          footer={null}
          width={700}
        >
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Jadval ro'yxati</h3>
          </div>
          <Table
            key={refreshKey}
            columns={columns}
            dataSource={
              selectedData?.map((item) => ({
                ...item,
                key: item.id,
              })) || []
            }
            pagination={false}
          />
        </Modal>

        {/* PDF Export Modal */}
        <Modal
          title="PDF yuklash sanasini yozing!"
          open={mod}
          onCancel={() => setMod(false)}
          footer={null}
          width={700}
        >
          <div style={{ display: "flex", gap: "16px" }}>
            <Select
              placeholder="Yilni tanlang"
              style={{ flex: 1 }}
              value={yil}
              onChange={(value) => setYil(value)}
            >
              {yillar.map((y) => (
                <Select.Option key={y} value={y}>
                  {y}
                </Select.Option>
              ))}
            </Select>

            <Select
              placeholder="Oyni tanlang"
              style={{ flex: 1 }}
              value={oy}
              onChange={(value) => setOy(value)}
            >
              {oylar.map((o) => (
                <Select.Option key={o.value} value={o.value}>
                  {o.nom}
                </Select.Option>
              ))}
            </Select>
          </div>

          <div style={{ marginTop: "20px" }}>
            <Button type="primary" onClick={handlepdf} disabled={!yil || !oy}>
              Tasdiqlash
            </Button>
          </div>
        </Modal>
      </div>
    </div>
  );
};

export default Calendars;
