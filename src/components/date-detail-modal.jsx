import { format } from "date-fns"
import { motion } from "framer-motion"
import { X, Plus, Calendar, Sparkles, Heart, Users, Coffee, Zap, BookOpen } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"



export default function DateDetailModal({
  date,
  events,
  isOpen,
  onClose,
  onEventClick,
  onAddEvent,
}) {
  // Sort events by start time
  const sortedEvents = [...events].sort((a, b) => a.start.getTime() - b.start.getTime())

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] p-0 overflow-hidden bg-white dark:bg-slate-900 border-none shadow-2xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.2 }}
        >
          <DialogHeader className="px-6 pt-6 pb-2">
            <div className="flex items-center justify-between">
              <DialogTitle className="text-xl font-bold flex items-center gap-2">
                <Calendar className="h-5 w-5 text-violet-500" />
                <span>{format(date, "EEEE, MMMM d, yyyy")}</span>
              </DialogTitle>
              {/* <Button variant="ghost" size="icon" onClick={onClose} className="rounded-full">
                <X className="h-4 w-4" />
              </Button> */}
            </div>
          </DialogHeader>


          <div className="px-6 py-2">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium text-slate-500 dark:text-slate-400">Events</h3>
              <Button variant="ghost" size="sm" onClick={onAddEvent} className="h-8 text-xs">
                <Plus className="h-3.5 w-3.5 mr-1" />
                Add Event
              </Button>
            </div>
          </div>

          <ScrollArea className="max-h-[400px] px-6 pb-6">
            {sortedEvents.length > 0 ? (
              <div className="space-y-3">
                {sortedEvents.map((event) => (
                  <motion.div
                    key={event.id}
                    className={`
                      p-3 rounded-lg cursor-pointer shadow-sm border
                      ${
                        event.category === "work"
                          ? "bg-violet-50 border-violet-200 dark:bg-violet-900/20 dark:border-violet-800"
                          : event.category === "personal"
                            ? "bg-emerald-50 border-emerald-200 dark:bg-emerald-900/20 dark:border-emerald-800"
                            : event.category === "meeting"
                              ? "bg-blue-50 border-blue-200 dark:bg-blue-900/20 dark:border-blue-800"
                              : event.category === "social"
                                ? "bg-amber-50 border-amber-200 dark:bg-amber-900/20 dark:border-amber-800"
                                : event.category === "health"
                                  ? "bg-rose-50 border-rose-200 dark:bg-rose-900/20 dark:border-rose-800"
                                  : event.category === "education"
                                    ? "bg-indigo-50 border-indigo-200 dark:bg-indigo-900/20 dark:border-indigo-800"
                                    : "bg-slate-50 border-slate-200 dark:bg-slate-800 dark:border-slate-700"
                      }
                    `}
                    whileHover={{ scale: 1.02, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => onEventClick(event)}
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className={`
                          w-10 h-10 rounded-full flex items-center justify-center shrink-0
                          ${
                            event.category === "work"
                              ? "bg-violet-500 text-white"
                              : event.category === "personal"
                                ? "bg-emerald-500 text-white"
                                : event.category === "meeting"
                                  ? "bg-blue-500 text-white"
                                  : event.category === "social"
                                    ? "bg-amber-500 text-white"
                                    : event.category === "health"
                                      ? "bg-rose-500 text-white"
                                      : event.category === "education"
                                        ? "bg-indigo-500 text-white"
                                        : "bg-slate-500 text-white"
                          }
                        `}
                      >
                        {event.category === "work" ? (
                          <Calendar className="h-5 w-5" />
                        ) : event.category === "personal" ? (
                          <Heart className="h-5 w-5" />
                        ) : event.category === "meeting" ? (
                          <Users className="h-5 w-5" />
                        ) : event.category === "social" ? (
                          <Coffee className="h-5 w-5" />
                        ) : event.category === "health" ? (
                          <Zap className="h-5 w-5" />
                        ) : event.category === "education" ? (
                          <BookOpen className="h-5 w-5" />
                        ) : (
                          <Calendar className="h-5 w-5" />
                        )}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium text-slate-800 dark:text-slate-200">{event.title}</h4>
                        <div className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                          {format(event.start, "h:mm a")} - {format(event.end, "h:mm a")}
                        </div>
                        {event.location && (
                          <div className="text-sm text-slate-500 dark:text-slate-400 mt-1">📍 {event.location}</div>
                        )}
                        {event.description && (
                          <div className="text-sm text-slate-600 dark:text-slate-300 mt-2 line-clamp-2">
                            {event.description}
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-slate-500 dark:text-slate-400">
                <Calendar className="h-12 w-12 mx-auto mb-3 opacity-20" />
                <p>No events scheduled for this day</p>
                <Button variant="outline" size="sm" onClick={onAddEvent} className="mt-4">
                  <Plus className="h-4 w-4 mr-1" />
                  Add Event
                </Button>
              </div>
            )}
          </ScrollArea>
        </motion.div>
      </DialogContent>
    </Dialog>
  )
}
