import { useState, useEffect } from "react";
import {
  useEditNotificationsMutation,
  useGetNotificationNosozlikQuery,
} from "@/services/api";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Wrench, Package2, AlertTriangle, Bell } from "lucide-react";
import { toast } from "sonner";

export default function NotificationWidget() {
  const { data, isLoading } = useGetNotificationNosozlikQuery();
  const [notifications, setNotifications] = useState([]);
  const [unreadNotifications, setUnreadNotifications] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [editnotif, { isLoading: loads }] = useEditNotificationsMutation();

  useEffect(() => {
    if (data) {
      const all = [
        ...(data?.texnik_korik || []).map((n) => ({
          ...n,
          type: "texnik_korik",
        })),
        ...(data?.ehtiyot_qism || []).map((n) => ({
          ...n,
          type: "ehtiyot_qism",
        })),
        ...(data?.nosozlik || []).map((n) => ({ ...n, type: "nosozlik" })),
      ];
      setNotifications(all);
      setUnreadNotifications(all.filter((n) => !n.is_read));
    }
  }, [data]);

  const getColor = (type) => {
    switch (type) {
      case "texnik_korik":
        return "bg-yellow-50 border-yellow-200 hover:bg-yellow-100/50";
      case "ehtiyot_qism":
        return "bg-purple-50 border-purple-200 hover:bg-purple-100/50";
      case "nosozlik":
        return "bg-red-50 border-red-200 hover:bg-red-100/50";
      default:
        return "bg-gray-50 border-gray-200 hover:bg-gray-100/50";
    }
  };

  const getIcon = (type) => {
    switch (type) {
      case "texnik_korik":
        return <Wrench className="text-yellow-600" size={18} />;
      case "ehtiyot_qism":
        return <Package2 className="text-purple-600" size={18} />;
      case "nosozlik":
        return <AlertTriangle className="text-red-600" size={18} />;
      default:
        return <AlertTriangle className="text-gray-500" size={18} />;
    }
  };

  const handleRead = async (id) => {
    try {
      const payloads = {
        type: "nosozlik",
        title: "string",
        message: "string",
        nosozlik_turi: "string",
        count: 2147483647,
        user: 0,
        tarkib: 0,
        ehtiyot_qism: 0,
      };
      await editnotif({ id, payloads }).unwrap();
      toast.success("Xabar o'qildi");
      setUnreadNotifications(unreadNotifications.filter((n) => n.id !== id));
    } catch (err) {
      console.log(err, "err");
      toast.error("Xabar o'qishda xato");
    }
  };

  if (isLoading || unreadNotifications.length === 0) {
    return null;
  }

  return (
    <>
      <div className="fixed bottom-6 right-6 z-40">
        <button
          onClick={() => setIsOpen(true)}
          className="relative group"
          aria-label="Notifications"
        >
          {/* Bell icon with smooth animation */}
          <div className="relative w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 active:scale-95">
            <Bell className="text-white" size={24} />

            <Badge
              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center p-0 text-xs font-bold animate-pulse"
              variant="default"
            >
              {unreadNotifications.length}
            </Badge>
          </div>

          {/* Tooltip on hover */}
          <div className="absolute bottom-full right-0 mb-2 px-3 py-1 bg-gray-900 text-white text-xs rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap pointer-events-none">
            {unreadNotifications.length} yangi xabar
          </div>
        </button>
      </div>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-md w-full max-h-[700px] rounded-2xl shadow-2xl animate-in fade-in zoom-in-95 duration-300">
          <DialogHeader className="border-b pb-4">
            <div className="flex items-center justify-between">
              <DialogTitle className="text-xl font-semibold flex items-center gap-2">
                <Bell className="text-blue-600" size={20} />
                Bildirishnomalar
              </DialogTitle>
            </div>
          </DialogHeader>

          <ScrollArea className="h-[450px] pr-4">
            <div className="space-y-3">
              {unreadNotifications.map((item, index) => (
                <Card
                  key={item.id}
                  className={`p-4 border rounded-xl transition-all duration-300 cursor-pointer hover:shadow-md ${getColor(
                    item.type
                  )} animate-in fade-in slide-in-from-bottom-2`}
                  style={{
                    animationDelay: `${index * 50}ms`,
                  }}
                >
                  <div className="flex gap-3">
                    {/* Icon */}
                    <div className="flex-shrink-0 mt-1">
                      {getIcon(item.type)}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-900 text-sm truncate">
                        {item.title}
                      </h3>
                      <p className="text-gray-700 text-xs mt-1 line-clamp-2">
                        {item.message}
                      </p>
                      <span className="text-xs text-red-600 font-medium mt-2 inline-block">
                        Yangi xabar
                      </span>
                    </div>

                    {/* Read button */}
                    <Button
                      onClick={() => handleRead(item.id)}
                      variant="ghost"
                      size="sm"
                      className="flex-shrink-0 h-8 px-2 text-xs hover:bg-white/50 transition-colors"
                      disabled={loads}
                    >
                      {loads ? "..." : "O'qish"}
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </ScrollArea>

          <div className="border-t pt-4 flex gap-2 py-5">
            <Button
              variant="outline"
              size="sm"
              className="flex-1 bg-transparent"
              onClick={() => setIsOpen(false)}
            >
              Yopish
            </Button>
            <Button
              variant="default"
              size="sm"
              className="flex-1 bg-blue-600 hover:bg-blue-700"
              onClick={() => {
                unreadNotifications.forEach((n) => handleRead(n.id));
              }}
            >
              Hammasini o'qish
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
