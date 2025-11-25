import { getNotifications } from "@/lib/actions/notification";
import { NotificationBellClient } from "./notification-bell-client";


export async function NotificationBellWrapper() {
  const notifications = await getNotifications(20);

  return <NotificationBellClient initialNotifications={notifications} />;
}
