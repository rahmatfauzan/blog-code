"use client";

import { Bell, Heart, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { formatDistanceToNow } from "date-fns";
import { id as localeId } from "date-fns/locale";
import Link from "next/link";

// Type untuk notification (sesuaikan dengan database nanti)
export type Notification = {
  id: string;
  type: "like";
  read: boolean;
  created_at: string;
  actor: {
    username: string;
    avatar_url: string;
    full_name: string;
  };
  document: {
    id: string;
    title: string;
    slug: string;
  };
};

interface NotificationBellProps {
  notifications?: Notification[];
  onMarkAsRead?: (id: string) => void;
  onMarkAllAsRead?: () => void;
}

export function NotificationBell({
  notifications = [],
  onMarkAsRead,
  onMarkAllAsRead,
}: NotificationBellProps) {
  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="relative w-9 h-9 text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50/50 dark:hover:bg-indigo-900/20"
        >
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-600 text-[10px] font-bold text-white">
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="w-80" align="end" forceMount>
        <DropdownMenuLabel className="flex items-center justify-between">
          <span className="font-semibold">Notifikasi</span>
          {unreadCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              className="h-auto p-1 text-xs text-indigo-600 hover:text-indigo-700"
              onClick={onMarkAllAsRead}
            >
              Tandai semua dibaca
            </Button>
          )}
        </DropdownMenuLabel>

        <DropdownMenuSeparator />

        {notifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <Bell className="h-12 w-12 text-slate-300 dark:text-slate-700 mb-2" />
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Belum ada notifikasi
            </p>
          </div>
        ) : (
          <div className="max-h-[400px] overflow-y-auto">
            {notifications.map((notification) => (
              <NotificationItem
                key={notification.id}
                notification={notification}
                onMarkAsRead={onMarkAsRead}
              />
            ))}
          </div>
        )}

        {notifications.length > 0 && (
          <>
            <DropdownMenuSeparator />
            <Link href="/notifications">
              <DropdownMenuItem className="cursor-pointer justify-center text-indigo-600 font-medium">
                Lihat Semua Notifikasi
              </DropdownMenuItem>
            </Link>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

// Notification Item Component
function NotificationItem({
  notification,
  onMarkAsRead,
}: {
  notification: Notification;
  onMarkAsRead?: (id: string) => void;
}) {
  const { actor, document, created_at, read, id } = notification;

  return (
    <div
      className={`relative px-4 py-3 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors ${
        !read ? "bg-indigo-50/50 dark:bg-indigo-900/10" : ""
      }`}
    >
      <Link href={`/snippet/${document.slug}`} className="block">
        <div className="flex gap-3">
          {/* Avatar */}
          <Avatar className="h-10 w-10 border-2 border-white dark:border-slate-800">
            <AvatarImage src={actor.avatar_url} alt={actor.username} />
            <AvatarFallback className="bg-gradient-to-br from-pink-500 to-rose-500 text-white text-xs">
              {actor.full_name[0]}
            </AvatarFallback>
          </Avatar>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start gap-2">
              <Heart className="h-4 w-4 text-pink-600 mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <p className="text-sm leading-tight">
                  <span className="font-semibold text-slate-900 dark:text-white">
                    {actor.full_name}
                  </span>{" "}
                  <span className="text-slate-600 dark:text-slate-400">
                    menyukai snippet Anda
                  </span>{" "}
                  <span className="font-medium text-indigo-600 dark:text-indigo-400">
                    "{document.title}"
                  </span>
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-500 mt-1">
                  {formatDistanceToNow(new Date(created_at), {
                    addSuffix: true,
                    locale: localeId,
                  })}
                </p>
              </div>
            </div>
          </div>

          {/* Mark as read button */}
          {!read && onMarkAsRead && (
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 text-slate-400 hover:text-slate-600"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onMarkAsRead(id);
              }}
            >
              <X className="h-3 w-3" />
            </Button>
          )}
        </div>

        {/* Unread indicator dot */}
        {!read && (
          <div className="absolute left-2 top-1/2 -translate-y-1/2 w-2 h-2 bg-indigo-600 rounded-full" />
        )}
      </Link>
    </div>
  );
}
