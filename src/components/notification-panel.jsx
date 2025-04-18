import { motion } from "framer-motion"
import { format } from "date-fns"
import { X, Bell, CheckCheck } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"


export default function NotificationPanel({
  notifications,
  onNotificationClick,
  onMarkAllAsRead,
  onClose,
}) {
  const unreadCount = notifications.filter((n) => !n.read).length

  return (
    <motion.div
      className="absolute right-4 top-16 w-80 bg-white dark:bg-slate-900 rounded-lg shadow-lg border border-slate-200 dark:border-slate-700 z-50 overflow-hidden"
      initial={{ opacity: 0, y: -10, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -10, scale: 0.95 }}
      transition={{ duration: 0.2 }}
    >
      <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-700">
        <div className="flex items-center gap-2">
          <Bell className="h-5 w-5 text-violet-500" />
          <h3 className="font-semibold">Notifications</h3>
          {unreadCount > 0 && (
            <span className="bg-violet-100 text-violet-700 dark:bg-violet-900/50 dark:text-violet-300 text-xs rounded-full px-2 py-0.5">
              {unreadCount} new
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          {unreadCount > 0 && (
            <Button variant="ghost" size="sm" onClick={onMarkAllAsRead} className="h-8 text-xs">
              <CheckCheck className="h-3.5 w-3.5 mr-1" />
              Mark all read
            </Button>
          )}
          <Button variant="ghost" size="icon" onClick={onClose} className="h-8 w-8">
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <ScrollArea className="max-h-[400px]">
        {notifications.length > 0 ? (
          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {notifications.map((notification) => (
              <motion.div
                key={notification.id}
                className={`p-4 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors ${
                  !notification.read ? "bg-violet-50 dark:bg-violet-900/10" : ""
                }`}
                onClick={() => onNotificationClick(notification)}
                whileHover={{ x: 2 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="flex items-start gap-3">
                  <div
                    className={`w-2 h-2 rounded-full mt-1.5 ${!notification.read ? "bg-violet-500" : "bg-transparent"}`}
                  />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-slate-700 dark:text-slate-300">{notification.title}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{notification.message}</p>
                    <p className="text-xs text-slate-400 dark:text-slate-500 mt-2">
                      {format(new Date(notification.timestamp), "MMM d, h:mm a")}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="p-8 text-center text-slate-500 dark:text-slate-400">
            <Bell className="h-8 w-8 mx-auto mb-2 opacity-30" />
            <p>No notifications</p>
          </div>
        )}
      </ScrollArea>
    </motion.div>
  )
}
