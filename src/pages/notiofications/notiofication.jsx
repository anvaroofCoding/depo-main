import React, { useState, useEffect } from "react";
import {
  useEditNotificationsMutation,
  useGetNotificationNosozlikQuery,
} from "@/services/api";
import Loading from "@/components/loading/loading";
import { Card, Button, Flex, Text } from "@radix-ui/themes";
import { Wrench, Package2, AlertTriangle, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";

export default function Notiofication() {
  const { data, isLoading } = useGetNotificationNosozlikQuery();
  const [notifications, setNotifications] = useState([]);
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
    }
  }, [data]);

  if (isLoading) {
    return (
      <div className="w-full h-screen flex justify-center items-center">
        <Loading />
      </div>
    );
  }

  const getColor = (type) => {
    switch (type) {
      case "texnik_korik":
        return "bg-yellow-100 border-yellow-400";
      case "ehtiyot_qism":
        return "bg-purple-100 border-purple-400";
      case "nosozlik":
        return "bg-red-100 border-red-400";
      default:
        return "bg-gray-100 border-gray-300";
    }
  };

  const getIcon = (type) => {
    switch (type) {
      case "texnik_korik":
        return <Wrench className="text-yellow-600" size={22} />;
      case "ehtiyot_qism":
        return <Package2 className="text-purple-600" size={22} />;
      case "nosozlik":
        return <AlertTriangle className="text-red-600" size={22} />;
      default:
        return <AlertTriangle className="text-gray-500" size={22} />;
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
    } catch (err) {
      console.log(err, "err");
    }
  };

  return (
    <div className="w-full min-h-screen p-6 flex flex-col gap-4 bg-gray-50 overflow-y-auto">
      {notifications.map((item) => (
        <Card
          key={item.id}
          className={`w-full p-4 border rounded-2xl shadow-sm flex justify-between items-center transition-all duration-300 ${getColor(
            item.type
          )} ${item.is_read ? "opacity-60" : "opacity-100"}`}
        >
          <Flex align="center" gap="3">
            {getIcon(item.type)}
            <div>
              <Text as="h3" className="font-semibold text-gray-800">
                {item.title}
              </Text>
              <Text as="p" className="text-gray-700 text-sm">
                {item.message}
              </Text>
              {!item.is_read && (
                <Text as="span" className="text-xs text-red-600 font-medium">
                  Yangi xabar
                </Text>
              )}
            </div>
          </Flex>

          {!item.is_read ? (
            <Button
              onClick={() => handleRead(item.id)}
              variant="ghost"
              color="gray"
              size="2"
              loading={loads}
            >
              O‘qish
            </Button>
          ) : (
            <div className="flex items-center gap-2 text-green-600">
              <CheckCircle2 size={20} />{" "}
              <span className="text-sm">O‘qildi</span>
            </div>
          )}
        </Card>
      ))}
    </div>
  );
}
