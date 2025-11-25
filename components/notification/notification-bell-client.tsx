"use client";

import { useState, useTransition } from "react";
import { NotificationBell, Notification } from "./notification-bell";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { markAllAsRead, markAsRead } from "@/lib/actions/notification";

interface NotificationBellClientProps {
  initialNotifications: Notification[];
}

export function NotificationBellClient({
  initialNotifications,
}: NotificationBellClientProps) {
  const [notifications, setNotifications] = useState(initialNotifications);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleMarkAsRead = (id: string) => {
    startTransition(async () => {
      const result = await markAsRead(id);
      if (result.success) {
        setNotifications((prev) =>
          prev.map((n) => (n.id === id ? { ...n, read: true } : n))
        );
        router.refresh();
      }
    });
  };

  const handleMarkAllAsRead = () => {
    startTransition(async () => {
      const result = await markAllAsRead();
      if (result.success) {
        setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
        toast.success("Semua notifikasi ditandai sudah dibaca");
        router.refresh();
      }
    });
  };

  return (
    <NotificationBell
      notifications={notifications}
      onMarkAsRead={handleMarkAsRead}
      onMarkAllAsRead={handleMarkAllAsRead}
    />
  );
}
