"use server";

import { Notification } from "@/components/notification/notification-bell";
import { createClient } from "@/lib/supabase/server";

// Fetch user notifications (unread first, limit to recent)
export async function getNotifications(
  limit: number = 10
): Promise<Notification[]> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return [];

  const { data, error } = await supabase
    .from("notifications")
    .select(
      `
      id,
      type,
      read,
      created_at,
      actor:actor_id (
        username,
        avatar_url,
        full_name
      ),
      document:document_id (
        id,
        title,
        slug
      )
    `
    )
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) {
    console.error("Error fetching notifications:", error);
    return [];
  }

  // Transform data to match Notification type
  return (data || []).map((notif: any) => ({
    id: notif.id,
    type: notif.type,
    read: notif.read,
    created_at: notif.created_at,
    actor: {
      username: notif.actor.username,
      avatar_url: notif.actor.avatar_url,
      full_name: notif.actor.full_name,
    },
    document: {
      id: notif.document.id,
      title: notif.document.title,
      slug: notif.document.slug,
    },
  }));
}

// Get unread notification count
export async function getUnreadCount(): Promise<number> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return 0;

  const { count, error } = await supabase
    .from("notifications")
    .select("*", { count: "exact", head: true })
    .eq("user_id", user.id)
    .eq("read", false);

  if (error) {
    console.error("Error fetching unread count:", error);
    return 0;
  }

  return count || 0;
}

// Mark single notification as read
export async function markAsRead(
  notificationId: string
): Promise<{ success: boolean }> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { success: false };

  const { error } = await supabase
    .from("notifications")
    .update({ read: true })
    .eq("id", notificationId)
    .eq("user_id", user.id);

  if (error) {
    console.error("Error marking as read:", error);
    return { success: false };
  }

  return { success: true };
}

// Mark all notifications as read
export async function markAllAsRead(): Promise<{ success: boolean }> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { success: false };

  const { error } = await supabase
    .from("notifications")
    .update({ read: true })
    .eq("user_id", user.id)
    .eq("read", false);

  if (error) {
    console.error("Error marking all as read:", error);
    return { success: false };
  }

  return { success: true };
}

// Delete notification
export async function deleteNotification(
  notificationId: string
): Promise<{ success: boolean }> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { success: false };

  const { error } = await supabase
    .from("notifications")
    .delete()
    .eq("id", notificationId)
    .eq("user_id", user.id);

  if (error) {
    console.error("Error deleting notification:", error);
    return { success: false };
  }

  return { success: true };
}
