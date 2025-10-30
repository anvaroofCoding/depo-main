import { useMemo, useState } from "react";
import { Table, DatePicker, Modal, Form, Input, Select, Button } from "antd";
import dayjs from "dayjs";
import isBetween from "dayjs/plugin/isBetween";
import {
  useGetJadvalQuery,
  useAddJadvalMutation,
  useGetharakatQuery,
  useGettamirQuery,
  useDeleteJadvalMutation,
  useGetMashrutQuery,
} from "@/services/api";
import Loading from "@/components/loading/loading";
import { toast, Toaster } from "sonner";
import { ArrowBigDownDash, Eye, History } from "lucide-react";
import { useNavigate } from "react-router-dom";

dayjs.extend(isBetween);

const TexnikJadval = () => {
  const [marshrutDisabled, setMarshrutDisabled] = useState(false);
  const [tamirDisabled, setTamirDisabled] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState(dayjs());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedCell, setSelectedCell] = useState(null);
  const [viewRecord, setViewRecord] = useState(null);
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const { data: mashrut, isLoading: oneLoad } = useGetMashrutQuery();
  const {
    data: jadvalRes,
    isLoading,
    refetch,
  } = useGetJadvalQuery({
    tarkib_id: "",
  });
  const { data: harakatRes, isLoading: harakatLoading } = useGetharakatQuery();
  console.log(harakatRes);
  const [addJadval, { isLoading: addLoading }] = useAddJadvalMutation();
  const { data: tamirTuri, isLoading: tamirLoading } = useGettamirQuery();
  const [deleteJadval, { isLoading: deleteLoading }] =
    useDeleteJadvalMutation();

  const handleCellClick = ({ tarkibId, tarkibRaqami, day }) => {
    const cellItem = jadvalIndex?.[tarkibId]?.[day] || null;
    if (cellItem) {
      setViewRecord(cellItem.entry);
      setIsViewModalOpen(true);
    } else {
      const selectedDate = selectedMonth.date(Number(day)).format("YYYY-MM-DD");
      setSelectedCell({ tarkibId, tarkibRaqami, sana: selectedDate });
      form.resetFields();
      setMarshrutDisabled(false);
      setTamirDisabled(false);
      setIsModalOpen(true);
    }
  };

  const handleSubmit = async (values) => {
    if (!values.marshrut && !values.tamir_turi) {
      toast.error(
        "Iltimos marshrut yoki texnik ko'rik (tamir turi)dan birini kiriting."
      );
      return;
    }

    try {
      await addJadval({
        tarkib: selectedCell.tarkibId,
        sana: selectedCell.sana,
        marshrut: values.marshrut || "",
        tamir_turi: values.tamir_turi,
      }).unwrap();

      toast.success("Ma'lumot muvaffaqiyatli qo'shildi!");
      setIsModalOpen(false);
      refetch();
    } catch (err) {
      console.error(err);
      if (err.data.non_field_errors) {
        toast.error(err.data.non_field_errors[0]);
      } else if (err.data.marshrut) {
        toast.warning(err.data.marshrut[0], {
          duration: 8000,
        });
      } else if (err?.data?.detail[0]) {
        toast.warning(err?.data?.detail[0], {
          duration: 10000,
        });
      } else {
        toast.error("Ma'lumot qo'shishda xatolik yuz berdi.");
      }
    }
  };

  const handleDelete = async () => {
    if (!viewRecord?.id) {
      toast.error("O'chirish uchun yozuv ID topilmadi.");
      return;
    }

    Modal.confirm({
      title: "Haqiqatdan ham yozuvni o'chirmoqchimisiz?",
      content: "Bu amalni qaytarib bo'lmaydi.",
      okText: "Ha, o'chirish",
      okType: "danger",
      cancelText: "Bekor",
      onOk: async () => {
        try {
          await deleteJadval(viewRecord.id).unwrap();
          toast.success("Yozuv muvaffaqiyatli o'chirildi.");
          setIsViewModalOpen(false);
          setViewRecord(null);
          refetch();
        } catch (err) {
          console.error(err);
          toast.error("Oʻchirishda xatolik yuz berdi.");
        }
      },
    });
  };

  const jadvalIndex = useMemo(() => {
    const idx = {};
    if (!jadvalRes?.results) return idx;

    const selectedMonthStart = selectedMonth.startOf("month");
    const selectedMonthEnd = selectedMonth.endOf("month");

    // Build index that supports multi-day repairs (tamir_miqdori)
    // and correctly shows continuation when span crosses month boundaries.
    jadvalRes.results.forEach((it) => {
      const startDate = dayjs(it.sana);
      const duration = Math.max(1, Number(it.tamir_miqdor_kunda) || 1);
      const tarkibId = it.tarkib;
      if (!idx[tarkibId]) idx[tarkibId] = {};

      // collect offsets that fall inside the selected month
      const offsetsInMonth = [];
      for (let offset = 0; offset < duration; offset++) {
        const d = startDate.add(offset, "day");
        if (d.isBetween(selectedMonthStart, selectedMonthEnd, null, "[]")) {
          offsetsInMonth.push(offset);
        }
      }

      if (offsetsInMonth.length === 0) {
        return; // nothing of this entry is visible in the month
      }

      // first visible day within the month for this entry
      const firstOffset = offsetsInMonth[0];
      const firstDay = startDate.add(firstOffset, "day").format("DD");

      // determine how many consecutive visible days we can span starting from firstOffset
      let span = 0;
      for (let k = firstOffset; k < duration; k++) {
        const d2 = startDate.add(k, "day");
        // stop when leaving the month
        if (!d2.isBetween(selectedMonthStart, selectedMonthEnd, null, "[]"))
          break;
        const day2 = d2.format("DD");
        // if already occupied, stop the span
        if (idx[tarkibId][day2]) break;
        span++;
      }

      // mark the first visible cell as the "start" (even if real start was earlier)
      idx[tarkibId][firstDay] = { entry: it, start: true, span };

      // mark following visible days within the span as placeholders
      for (let k = 1; k < span; k++) {
        const d2 = startDate.add(firstOffset + k, "day");
        const day2 = d2.format("DD");
        idx[tarkibId][day2] = { placeholder: true };
      }

      // any other visible offsets that weren't covered because of collisions should be placeholders
      offsetsInMonth.forEach((off) => {
        const d = startDate.add(off, "day");
        const day = d.format("DD");
        if (!idx[tarkibId][day]) {
          idx[tarkibId][day] = { placeholder: true };
        }
      });
    });

    return idx;
  }, [jadvalRes, selectedMonth]);
  // ...existing code...

  const jadvalData = useMemo(() => {
    if (!harakatRes?.results) return [];
    const daysInMonth = selectedMonth.daysInMonth();
    const days = Array.from({ length: daysInMonth }, (_, i) =>
      selectedMonth.date(i + 1).format("DD")
    );

    return harakatRes.results.map((h) => {
      const row = {
        tarkib_id: h.id,
        tarkib: h.tarkib_raqami || h.id,
      };
      days.forEach((day) => {
        const cell = jadvalIndex[h.id] && jadvalIndex[h.id][day];
        if (!cell) {
          row[day] = "-";
          return;
        }
        if (cell.placeholder) {
          // placeholder -> hide this cell (colSpan = 0)
          row[day] = { placeholder: true };
        } else if (cell.start) {
          const label =
            cell.entry.tamir_nomi ||
            cell.entry.marshrut ||
            cell.entry.tamir_turi ||
            "-";
          row[day] = {
            label,
            colSpan: cell.span,
            record: cell.entry,
          };
        } else {
          row[day] = "-";
        }
      });
      return row;
    });
  }, [harakatRes, jadvalIndex, selectedMonth]);
  // ...existing code...
  const columns = useMemo(() => {
    const base = [
      {
        title: "Harakat tarkibi raqami",
        dataIndex: "tarkib",
        fixed: "left",
        width: 220,
        align: "center",
        render: (text) => (
          <div
            style={{
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
              maxWidth: 200,
              fontWeight: 500,
              color: "#1f1f1f",
            }}
            title={text}
          >
            {text}
          </div>
        ),
      },
    ];

    const today = dayjs().startOf("day");
    const daysInMonth = selectedMonth.daysInMonth();
    const dayColumns = Array.from({ length: daysInMonth }, (_, i) => {
      const colDate = selectedMonth.date(i + 1).startOf("day");
      const isToday = colDate.isSame(today);
      const day = colDate.format("DD");
      const weekDay = colDate.format("dd");
      const isWeekend = ["Sh", "Ya"].includes(weekDay);

      return {
        title: (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              lineHeight: "1.1",
              background: isToday
                ? "#0717eeff"
                : isWeekend
                ? "#f0f0f0"
                : "transparent",
              padding: "4px 0",
              borderRadius: 4,
            }}
          >
            <span
              style={{
                fontWeight: 600,
                color: isToday
                  ? "#ffffffff"
                  : isWeekend
                  ? "#d9534f"
                  : "#1f1f1f",
              }}
            >
              {day} <sup>{isToday ? "!" : ""}</sup>
            </span>
            <span
              style={{
                fontSize: 11,
                color: isToday
                  ? "#ffffffff"
                  : isWeekend
                  ? "#d9534f"
                  : "#8c8c8c",
              }}
            >
              {weekDay}
            </span>
          </div>
        ),
        dataIndex: day,
        align: "center",
        width: 85,
        render: (value, record) => {
          // placeholder -> hide this cell (colSpan = 0)
          if (value && value.placeholder) {
            return { children: null, props: { colSpan: 0 } };
          }

          // spanned cell
          if (value && typeof value === "object" && value.colSpan) {
            const label = value.label || "-";
            return {
              children: (
                <div
                  style={{
                    cursor: "pointer",
                    padding: "8px 4px",
                    borderRadius: 6,
                    transition: "all 0.2s ease",
                    minHeight: 32,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    border: "1px solid #91d5ff",
                    background: (() => {
                      switch (label) {
                        case "TO-1":
                        case "TO-2":
                        case "TO-3":
                          return "yellow"; // texnik xizmatlar
                        case "TR-1":
                        case "TR-2":
                          return "lightblue"; // transport rang
                        case "KR-1":
                        case "KR-2":
                          return "#ffcccc"; // kran ishlari
                        default:
                          return "#e6f7ff"; // default fon
                      }
                    })(),
                  }}
                  title={label}
                  onClick={() =>
                    handleCellClick({
                      tarkibId: record.tarkib_id,
                      tarkibRaqami: record.tarkib,
                      day,
                    })
                  }
                >
                  <b
                    style={{
                      color: "#0050b3",
                      fontSize: 12,
                    }}
                  >
                    {label}
                  </b>
                </div>
              ),
              props: { colSpan: value.colSpan },
            };
          }

          // normal single-day value or dash
          const display = value !== "-" ? String(value) : "-";
          const hasValue = display !== "-";
          return (
            <div
              style={{
                cursor: "pointer",
                padding: "8px 4px",
                borderRadius: 6,
                background: hasValue
                  ? "#e6f7ff"
                  : isWeekend
                  ? "#fafafa"
                  : "transparent",
                transition: "all 0.2s ease",
                minHeight: 32,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                border: hasValue
                  ? "1px solid #91d5ff"
                  : "1px solid transparent",
              }}
              onClick={() =>
                handleCellClick({
                  tarkibId: record.tarkib_id,
                  tarkibRaqami: record.tarkib,
                  day,
                })
              }
              onMouseEnter={(e) => {
                e.currentTarget.style.background = hasValue
                  ? "#bae7ff"
                  : "#f5f5f5";
                e.currentTarget.style.transform = "scale(1.02)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = isToday
                  ? hasValue
                    ? "#f6ffed"
                    : "white"
                  : hasValue
                  ? "#e6f7ff"
                  : isWeekend
                  ? "#fafafa"
                  : "transparent";
                e.currentTarget.style.transform = "scale(1)";
              }}
              title={hasValue ? display : undefined}
            >
              {display === "-" ? (
                <span style={{ color: "#bfbfbf", fontSize: 12 }}>-</span>
              ) : (
                <b
                  style={{
                    color: isToday ? "#237804" : "#0050b3",
                    fontSize: 12,
                  }}
                >
                  {display}
                </b>
              )}
            </div>
          );
        },
      };
    });

    return [...base, ...dayColumns];
  }, [selectedMonth, jadvalIndex]);
  // ...existing code...
  const loadingAny = isLoading || harakatLoading || tamirLoading || oneLoad;

  if (loadingAny) {
    return (
      <div
        style={{
          width: "100%",
          height: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Loading />
      </div>
    );
  }

  return (
    <div
      style={{ display: "flex", flexDirection: "column", gap: 16 }}
      className="p-4"
    >
      <Toaster position="bottom-center" richColors />

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "16px 20px",
          background: "linear-gradient(135deg, #3e8fecff 0%, #2e63dfff 100%)",
          borderRadius: 12,
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
        }}
      >
        <div style={{ color: "white" }}>
          <h2 style={{ margin: 0, fontSize: 18, fontWeight: 600 }}>
            Texnik Jadval
          </h2>
          <p style={{ margin: "4px 0 0 0", fontSize: 12, opacity: 0.9 }}>
            Harakat jadvalini boshqarish
          </p>
        </div>
        <div className="flex justify-center items-center gap-5">
          <Button
            onClick={() => navigate("/jadvallar-tarixi")}
            size="lg"
            className="
        bg-gradient-to-r from-blue-500 via-indigo-500 to-orange-500
        hover:from-orange-500 hover:via-pink-500 hover:to-yellow-500
        text-white font-semibold tracking-wide
        shadow-lg hover:shadow-orange-500/30
        transition-all duration-300
        flex items-center gap-2 rounded-full
      "
          >
            <History className="w-5 h-5" />
            Jadvalning tarixini ko‘rish
          </Button>

          <DatePicker
            picker="month"
            value={selectedMonth}
            onChange={(val) => setSelectedMonth(val || dayjs())}
            format="MMMM YYYY"
            allowClear={false}
          />
        </div>
      </div>

      <div
        style={{
          borderRadius: 12,
          overflow: "hidden",
          boxShadow: "0 2px 8px rgba(0, 0, 0, 0.08)",
        }}
      >
        <Table
          columns={columns}
          dataSource={jadvalData}
          pagination={false}
          bordered
          scroll={{ x: "max-content" }}
          rowKey="tarkib_id"
          size="small"
          style={{ borderRadius: 8 }}
          rowClassName={(record, index) =>
            index % 2 === 0 ? "bg-white" : "bg-gray-50"
          }
        />
      </div>

      {/* Add Modal (existing) */}
      <Modal
        title="Yangi yozuv qo'shish"
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={null}
        destroyOnClose
      >
        {selectedCell && (
          <div
            style={{
              marginBottom: 12,
              color: "#595959",
              background: "#fafafa",
              padding: "8px 12px",
              borderRadius: 6,
            }}
          >
            <div>
              <b>Tarkib raqami:</b> {selectedCell.tarkibRaqami}
            </div>
            <div>
              <b>Sana:</b> {dayjs(selectedCell.sana).format("DD MMMM, YYYY")}
            </div>
          </div>
        )}

        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Form.Item label="Marshrut" name="marshrut">
            {/* <Input
              placeholder="Mashrut raqami"
              disabled={marshrutDisabled}
              onChange={(e) => {
                const val = e.target.value || "";
                setTamirDisabled(val.trim().length > 0);
                if (!val) setTamirDisabled(false);
              }}
            /> */}
            <Select
              placeholder="Marshrutni tanlang"
              disabled={marshrutDisabled}
              onChange={(val) => setTamirDisabled(!!val)}
              allowClear
            >
              {mashrut?.results?.map((item) => (
                <Select.Option key={item?.id} value={item?.marshrut_raqam}>
                  {item?.marshrut_raqam}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item label="Texnik ko'rik (tamir turi)" name="tamir_turi">
            <Select
              placeholder="Ta'mir turini tanlang"
              disabled={tamirDisabled}
              onChange={(val) => setMarshrutDisabled(!!val)}
              allowClear
            >
              {tamirTuri?.results?.map((item) => (
                <Select.Option key={item?.id} value={item?.id}>
                  {item?.tamir_nomi}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item style={{ marginBottom: 0, textAlign: "right" }}>
            <Button type="primary" htmlType="submit" loading={addLoading}>
              Saqlash
            </Button>
          </Form.Item>
        </Form>
      </Modal>

      {/* View Modal for existing record */}
      <Modal
        title="Yozuv tafsilotlari"
        open={isViewModalOpen}
        onCancel={() => {
          setIsViewModalOpen(false);
          setViewRecord(null);
        }}
        footer={[
          <Button
            key="close"
            onClick={() => {
              setIsViewModalOpen(false);
              setViewRecord(null);
            }}
          >
            Yopish
          </Button>,
          <Button
            key="delete"
            danger
            loading={deleteLoading}
            onClick={handleDelete}
          >
            O'chirish
          </Button>,
        ]}
        destroyOnClose
      >
        {viewRecord ? (
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <div></div>
            <div>
              <b>Tarkib:</b> {viewRecord.tarkib_raqami ?? "Nomalum"}
            </div>
            <div>
              <b>Marshrut:</b> {viewRecord.marshrut ?? "Nomalum"}
            </div>

            <div>
              <b>Tamir nomi:</b> {viewRecord.tamir_nomi ?? "Nomalum"}
            </div>
            <div>
              <b>Sana:</b>{" "}
              {viewRecord.sana
                ? dayjs(viewRecord.sana).format("DD MMMM, YYYY")
                : "-"}
            </div>
            <div>
              <b>Yaratildi:</b>{" "}
              {viewRecord.created_at
                ? dayjs(viewRecord.created_at).format("DD-MMM-YYYY HH:mm")
                : "-"}
            </div>
            <div>
              <b>Yaratgan:</b> {viewRecord.created_by ?? "-"}
            </div>
          </div>
        ) : (
          <div>Ma'lumot topilmadi.</div>
        )}
      </Modal>
    </div>
  );
};

export default TexnikJadval;
