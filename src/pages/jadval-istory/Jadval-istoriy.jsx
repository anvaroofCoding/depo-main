import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "antd";
import { Calendar, DownloadCloud, CheckCircle2 } from "lucide-react";
import Loading from "@/components/loading/loading";
import { useGetDateQuery, useLazyExporPDFJadvalQuery } from "@/services/api";
import { toast, Toaster } from "sonner";

export default function JadvalIstory() {
  const { data, isLoading, isError } = useGetDateQuery();
  const [exportPDF] = useLazyExporPDFJadvalQuery();

  const [downloadingId, setDownloadingId] = useState(null);
  const [downloadedIds, setDownloadedIds] = useState([]); // yuklab olinganlar uchun

  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 36;

  if (isLoading) {
    return (
      <div className="w-full h-screen flex items-center justify-center">
        <Loading />
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="text-center text-red-600 mt-10 text-lg">
        Maʼlumotlarni yuklashda xatolik yuz berdi
      </div>
    );
  }

  const handlepdf = async ({ oy, yil, id }) => {
    try {
      setDownloadingId(id);
      const blob = await exportPDF({ oy, yil }).unwrap();
      toast.success("PDF fayli muvaffaqiyatli yuklandi");

      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${oy}.${yil}-jadvali.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();

      // yuklab bo‘lgach belgini ko‘rsatamiz
      setDownloadedIds((prev) => [...prev, id]);
      setTimeout(() => {
        setDownloadedIds((prev) => prev.filter((x) => x !== id));
      }, 3000);
    } catch {
      toast.error("Yuklashda xatolik yuz berdi ❌");
    } finally {
      setDownloadingId(null);
    }
  };

  const months = [
    "Yanvar",
    "Fevral",
    "Mart",
    "Aprel",
    "May",
    "Iyun",
    "Iyul",
    "Avgust",
    "Sentyabr",
    "Oktabr",
    "Noyabr",
    "Dekabr",
  ];

  const formattedData = data.map((item, index) => ({
    key: index + 1,
    sana: `${months[item.oy - 1]} ${item.yil}-yil`,
    oyMomo: item.oy,
    yil: item.yil,
  }));

  const totalPages = Math.ceil(formattedData.length / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const paginatedData = formattedData.slice(startIndex, startIndex + pageSize);

  return (
    <div className="min-h-screen py-10 px-6">
      <Toaster position="bottom-center" richColors />
      <div className="max-w-7xl mx-auto text-center mb-10">
        <h1 className="text-3xl md:text-4xl font-bold text-slate-800 dark:text-white">
          Jadval Tarixlari
        </h1>
        <p className="text-slate-500 dark:text-slate-400 mt-2">
          O‘tgan oylardagi ma’lumotlarni yuklab olish
        </p>
      </div>

      {/* Cards Grid */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-5"
      >
        {paginatedData.map((item) => {
          const isLoadingCard = downloadingId === item.key;
          const isDownloaded = downloadedIds.includes(item.key);

          return (
            <motion.div
              key={item.key}
              whileHover={{ scale: 1.05 }}
              className="relative bg-white dark:bg-slate-800 shadow-md hover:shadow-xl transition-all duration-300 rounded-2xl p-4 flex flex-col items-center justify-between text-center border border-slate-200 dark:border-slate-700"
            >
              <div className="flex flex-col items-center gap-3">
                <div className="bg-gradient-to-r from-indigo-100 to-cyan-100 dark:from-indigo-900 dark:to-cyan-900 p-3 rounded-full shadow-inner">
                  <Calendar className="w-6 h-6 text-indigo-600 dark:text-indigo-300" />
                </div>
                <p className="text-slate-800 dark:text-white font-semibold text-base">
                  {item.sana}
                </p>
              </div>

              {/* Download Button */}
              <Button
                type="primary"
                loading={isLoadingCard}
                icon={<DownloadCloud size={16} />}
                onClick={() =>
                  handlepdf({ oy: item.oyMomo, yil: item.yil, id: item.key })
                }
                disabled={isDownloaded}
                className={`mt-4 w-full rounded-xl shadow-md border-none transition-all duration-300 
                ${
                  isDownloaded
                    ? "bg-green-500 cursor-default"
                    : "bg-gradient-to-r from-indigo-500 to-cyan-500 hover:from-indigo-600 hover:to-cyan-600 text-white"
                }`}
              >
                {isDownloaded
                  ? "Yuklandi"
                  : isLoadingCard
                  ? "Yuklanmoqda..."
                  : "Yuklash"}
              </Button>

              {/* ✅ Check belgi animatsiyasi */}
              <AnimatePresence>
                {isDownloaded && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ duration: 0.4 }}
                    className="absolute -top-3 -right-3 bg-green-500 text-white p-1.5 rounded-full shadow-lg"
                  >
                    <CheckCircle2 className="w-5 h-5" />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Pagination */}
      <div className="flex items-center justify-center gap-4 mt-10">
        <Button
          disabled={currentPage === 1}
          onClick={() => setCurrentPage((prev) => prev - 1)}
          className="rounded-xl px-4 py-2 text-slate-600 dark:text-slate-300 border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700 transition"
        >
          ← Oldingi
        </Button>

        <span className="text-slate-700 dark:text-slate-300 font-medium">
          {currentPage} / {totalPages}
        </span>

        <Button
          disabled={currentPage === totalPages}
          onClick={() => setCurrentPage((prev) => prev + 1)}
          className="rounded-xl px-4 py-2 text-slate-600 dark:text-slate-300 border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700 transition"
        >
          Keyingi →
        </Button>
      </div>
    </div>
  );
}
