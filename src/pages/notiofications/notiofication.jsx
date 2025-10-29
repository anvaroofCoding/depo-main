import React, { useState } from "react";
import * as AlertDialog from "@radix-ui/react-alert-dialog";
import { TbBell, TbCheck, TbMailOpened, TbMail } from "react-icons/tb";
import { Button } from "@/components/ui/button";
import Loading from "@/components/loading/loading";
import { useGetNotificationNosozlikQuery } from "@/services/api";
import { format } from "date-fns";

export default function Notifications() {
  const { data, isLoading } = useGetNotificationNosozlikQuery();
  const [notifications, setNotifications] = useState([]);
  const [dialogOpen, setDialogOpen] = useState(false);

  React.useEffect(() => {
    if (data?.results) setNotifications(data.results);
  }, [data]);

  if (isLoading) {
    return (
      <div className="w-full h-screen flex justify-center items-center">
        <Loading />
      </div>
    );
  }

  // 🔹 Bitta notifikatsiyani "o'qilgan" qilish
  const handleMarkRead = (id) => {
    setNotifications((prev) =>
      prev.map((item) => (item.id === id ? { ...item, seen: true } : item))
    );
  };

  // 🔹 Barchasini "o'qilgan" qilish
  const handleMarkAllRead = () => {
    setNotifications((prev) => prev.map((item) => ({ ...item, seen: true })));
    setDialogOpen(false);
  };

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center border-b pb-3">
        <h1 className="text-2xl font-semibold flex items-center gap-2">
          <TbBell className="text-blue-500" size={26} />
          Bildirishnomalar
        </h1>

        {/* Barchasini o‘qilgan qilish tugmasi */}
        <AlertDialog.Root open={dialogOpen} onOpenChange={setDialogOpen}>
          <AlertDialog.Trigger asChild>
            <Button
              variant="outline"
              className="flex items-center gap-2 border-blue-500 text-blue-500"
            >
              <TbCheck size={18} /> Hammasini o‘qilgan deb belgilash
            </Button>
          </AlertDialog.Trigger>

          <AlertDialog.Content className="bg-white rounded-lg p-6 shadow-xl max-w-md">
            <AlertDialog.Title className="text-lg font-semibold">
              Tasdiqlaysizmi?
            </AlertDialog.Title>
            <AlertDialog.Description className="mt-2 text-gray-600 text-sm">
              Barcha bildirishnomalar o‘qilgan deb belgilanadi.
            </AlertDialog.Description>

            <div className="flex justify-end gap-3 mt-5">
              <AlertDialog.Cancel asChild>
                <Button variant="outline">Bekor qilish</Button>
              </AlertDialog.Cancel>
              <AlertDialog.Action asChild>
                <Button
                  onClick={handleMarkAllRead}
                  className="bg-blue-500 text-white"
                >
                  Tasdiqlash
                </Button>
              </AlertDialog.Action>
            </div>
          </AlertDialog.Content>
        </AlertDialog.Root>
      </div>

      {/* Notifikatsiyalar ro‘yxati */}
      <div className="space-y-4">
        {notifications.map((item) => (
          <div
            key={item.id}
            className={`p-4 rounded-lg border flex items-start gap-4 transition ${
              item.seen
                ? "bg-gray-50 border-gray-200"
                : "bg-blue-50 border-blue-200"
            }`}
          >
            <div className="mt-1">
              {item.seen ? (
                <TbMailOpened className="text-gray-400" size={22} />
              ) : (
                <TbMail className="text-blue-500" size={22} />
              )}
            </div>

            <div className="flex-1">
              <p className="font-medium text-gray-800">{item.nosozlik_turi}</p>
              <p className="text-gray-600 text-sm mt-1">{item.message}</p>
              <p className="text-xs text-gray-400 mt-2">
                {format(new Date(item.first_occurrence), "dd MMM yyyy, HH:mm")}
              </p>
            </div>

            {!item.seen && (
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleMarkRead(item.id)}
                className="text-blue-500 border-blue-300"
              >
                O‘qilgan deb belgilash
              </Button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
