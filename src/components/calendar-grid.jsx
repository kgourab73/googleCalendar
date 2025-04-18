import { format, isToday, isSameMonth, isWeekend, startOfWeek, addDays } from "date-fns"
import EventItem from "./event-item"
import { motion } from "framer-motion"
import { Plus, Sparkles } from "lucide-react"

export default function CalendarGrid({
  currentDate,
  daysInMonth,
  getEventsForDay,
  checkEventOverlap,
  onEventClick,
  onDateClick,
  onAddEvent,
  view,
}) {
  const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]

  // Render month view
  if (view === "month") {
    return (
      <div className="grid grid-cols-7 h-full bg-white dark:bg-slate-900 shadow-lg rounded-lg m-4 overflow-hidden">
        {/* Weekday headers */}
        {weekdays.map((day, index) => (
          <motion.div
            key={day}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
            className={`
              p-2 text-center text-sm font-medium border-b sticky top-0 z-10 bg-white dark:bg-slate-900
              ${
                isWeekend(new Date(2023, 0, index))
                  ? "text-violet-500 dark:text-violet-400"
                  : "text-slate-600 dark:text-slate-300"
              }
            `}
          >
            {day}
          </motion.div>
        ))}

        {/* Calendar days */}
        {daysInMonth.map((day, index) => {
          const dayEvents = getEventsForDay(day)
          const processedEvents = checkEventOverlap(dayEvents)
          const isCurrentMonth = isSameMonth(day, currentDate)
          const isCurrentDay = isToday(day)
          const isWeekendDay = isWeekend(day)

          return (
            <motion.div
              key={day.toString()}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.2, delay: index * 0.01 }}
              className={`
                min-h-[120px] border border-slate-100 dark:border-slate-800 p-1 overflow-hidden relative group
                ${!isCurrentMonth ? "bg-slate-50 dark:bg-slate-800/50" : ""}
                ${isCurrentDay ? "bg-violet-50 dark:bg-violet-900/20 ring-2 ring-violet-300 dark:ring-violet-700" : ""}
                ${isWeekendDay && isCurrentMonth ? "bg-slate-50/50 dark:bg-slate-800/30" : ""}
                hover:bg-slate-50 dark:hover:bg-slate-800/70 transition-colors cursor-pointer
              `}
              onClick={() => onDateClick(day)}
            >
              <div
                className={`
                  text-right text-sm p-1 font-medium flex items-center justify-end
                  ${
                    isCurrentDay
                      ? "text-white"
                      : isCurrentMonth
                        ? isWeekendDay
                          ? "text-violet-500 dark:text-violet-400"
                          : "text-slate-700 dark:text-slate-300"
                        : "text-slate-400 dark:text-slate-600"
                  }
                `}
              >
                {isCurrentDay ? (
                  <motion.div
                    className="bg-gradient-to-br from-violet-500 to-indigo-600 rounded-full w-8 h-8 flex items-center justify-center shadow-lg"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{
                      type: "spring",
                      stiffness: 500,
                      damping: 15,
                      delay: 0.2,
                    }}
                  >
                    {format(day, "d")}
                  </motion.div>
                ) : (
                  <span>{format(day, "d")}</span>
                )}
              </div>

              

              <div className="mt-1 space-y-1 max-h-[calc(100%-28px)] overflow-y-auto">
                {processedEvents.map((event, index) => (
                  <EventItem
                    key={`${event.id}-${index}`}
                    event={event}
                    onClick={(e) => {
                      e.stopPropagation()
                      onEventClick(event)
                    }}
                  />
                ))}
              </div>

              {/* Add event quick button (only visible on hover) */}
              <motion.button
                className="absolute bottom-1 right-1 w-6 h-6 bg-violet-100 dark:bg-violet-900/50 text-violet-600 dark:text-violet-300 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                whileHover={{ scale: 1.1, backgroundColor: "#8b5cf6", color: "#ffffff" }}
                whileTap={{ scale: 0.9 }}
                onClick={(e) => {
                  e.stopPropagation()
                  onAddEvent(day)
                }}
              >
                <Plus className="h-4 w-4" />
              </motion.button>
            </motion.div>
          )
        })}
      </div>
    )
  }

  // Render week view
  if (view === "week") {
    const weekStart = startOfWeek(currentDate)
    const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i))

    return (
      <div className="flex flex-col h-full bg-white dark:bg-slate-900 shadow-lg rounded-lg m-4 overflow-hidden">
        {/* Week header */}
        <div className="grid grid-cols-8 border-b">
          <div className="p-3 text-center text-sm font-medium text-slate-500 dark:text-slate-400 border-r">Time</div>
          {weekDays.map((day) => (
            <div
              key={day.toString()}
              className={`
                p-3 text-center border-r last:border-r-0
                ${isToday(day) ? "bg-violet-50 dark:bg-violet-900/20" : ""}
              `}
            >
              <div className="text-sm font-medium text-slate-600 dark:text-slate-300">{format(day, "EEE")}</div>
              <div
                className={`
                  text-lg font-bold mt-1 
                  ${isToday(day) ? "text-violet-600 dark:text-violet-400" : "text-slate-700 dark:text-slate-200"}
                `}
              >
                {format(day, "d")}
              </div>
            </div>
          ))}
        </div>

        {/* Week body - time slots */}
        <div className="flex-1 overflow-y-auto">
          <div className="grid grid-cols-8 h-full divide-x">
            {/* Time column */}
            <div className="space-y-4 pt-4 text-right pr-2">
              {Array.from({ length: 24 }, (_, i) => (
                <div key={i} className="h-16 text-xs text-slate-500 dark:text-slate-400">
                  {i === 0 ? "12 AM" : i < 12 ? `${i} AM` : i === 12 ? "12 PM" : `${i - 12} PM`}
                </div>
              ))}
            </div>

            {/* Day columns */}
            {weekDays.map((day) => (
              <div
                key={day.toString()}
                className={`relative ${isToday(day) ? "bg-violet-50/50 dark:bg-violet-900/10" : ""}`}
                onClick={() => onDateClick(day)}
              >
                {/* Hour grid lines */}
                {Array.from({ length: 24 }, (_, i) => (
                  <div key={i} className="h-16 border-b border-slate-100 dark:border-slate-800 relative">
                    {/* Half-hour line */}
                    <div className="absolute top-1/2 w-full border-b border-slate-100/50 dark:border-slate-800/50"></div>
                  </div>
                ))}

                {/* Events */}
                <div className="absolute inset-0 p-1">
                  {getEventsForDay(day).map((event) => {
                    const startHour = event.start.getHours() + event.start.getMinutes() / 60
                    const endHour = event.end.getHours() + event.end.getMinutes() / 60
                    const duration = endHour - startHour

                    return (
                      <motion.div
                        key={event.id}
                        className="absolute left-1 right-1 rounded-md p-1 text-xs text-white overflow-hidden cursor-pointer"
                        style={{
                          top: `${startHour * 4}rem`,
                          height: `${duration * 4}rem`,
                          backgroundColor:
                            event.category === "work"
                              ? "#8b5cf6"
                              : event.category === "personal"
                                ? "#10b981"
                                : event.category === "meeting"
                                  ? "#3b82f6"
                                  : event.category === "social"
                                    ? "#f59e0b"
                                    : event.category === "health"
                                      ? "#ef4444"
                                      : event.category === "education"
                                        ? "#6366f1"
                                        : "#6b7280",
                        }}
                        whileHover={{ scale: 1.02, zIndex: 10 }}
                        onClick={(e) => {
                          e.stopPropagation()
                          onEventClick(event)
                        }}
                      >
                        <div className="font-medium truncate">{event.title}</div>
                        <div className="text-xs opacity-90">
                          {format(event.start, "h:mm a")} - {format(event.end, "h:mm a")}
                        </div>
                      </motion.div>
                    )
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  // Render day view
  if (view === "day") {
    return (
      <div className="flex flex-col h-full bg-white dark:bg-slate-900 shadow-lg rounded-lg m-4 overflow-hidden">
        {/* Day header */}
        <div className="p-4 border-b text-center">
          <h2 className="text-xl font-bold text-slate-700 dark:text-slate-200">
            {format(currentDate, "EEEE, MMMM d, yyyy")}
          </h2>
        </div>

        {/* Day body - time slots */}
        <div className="flex-1 overflow-y-auto">
          <div className="grid grid-cols-[100px_1fr] h-full divide-x">
            {/* Time column */}
            <div className="space-y-4 pt-4 text-right pr-2">
              {Array.from({ length: 24 }, (_, i) => (
                <div key={i} className="h-20 text-sm text-slate-500 dark:text-slate-400">
                  {i === 0 ? "12 AM" : i < 12 ? `${i} AM` : i === 12 ? "12 PM" : `${i - 12} PM`}
                </div>
              ))}
            </div>

            {/* Event column */}
            <div className="relative">
              {/* Hour grid lines */}
              {Array.from({ length: 24 }, (_, i) => (
                <div
                  key={i}
                  className="h-20 border-b border-slate-100 dark:border-slate-800 relative"
                  onClick={() => {
                    const date = new Date(currentDate)
                    date.setHours(i, 0, 0, 0)
                    onAddEvent(date)
                  }}
                >
                  {/* Half-hour line */}
                  <div className="absolute top-1/2 w-full border-b border-slate-100/50 dark:border-slate-800/50"></div>
                </div>
              ))}

              {/* Current time indicator */}
              {isToday(currentDate) && (
                <div
                  className="absolute left-0 right-0 border-t-2 border-red-500 z-10"
                  style={{
                    top: `${(new Date().getHours() + new Date().getMinutes() / 60) * 5}rem`,
                  }}
                >
                  <div className="w-3 h-3 rounded-full bg-red-500 -mt-1.5 -ml-1.5"></div>
                </div>
              )}

              {/* Events */}
              <div className="absolute inset-0 p-1">
                {getEventsForDay(currentDate).map((event) => {
                  const startHour = event.start.getHours() + event.start.getMinutes() / 60
                  const endHour = event.end.getHours() + event.end.getMinutes() / 60
                  const duration = endHour - startHour

                  return (
                    <motion.div
                      key={event.id}
                      className="absolute left-2 right-2 rounded-md p-2 text-white overflow-hidden cursor-pointer shadow-md"
                      style={{
                        top: `${startHour * 5}rem`,
                        height: `${duration * 5}rem`,
                        backgroundColor:
                          event.category === "work"
                            ? "#8b5cf6"
                            : event.category === "personal"
                              ? "#10b981"
                              : event.category === "meeting"
                                ? "#3b82f6"
                                : event.category === "social"
                                  ? "#f59e0b"
                                  : event.category === "health"
                                    ? "#ef4444"
                                    : event.category === "education"
                                      ? "#6366f1"
                                      : "#6b7280",
                      }}
                      whileHover={{ scale: 1.02, zIndex: 10 }}
                      onClick={(e) => {
                        e.stopPropagation()
                        onEventClick(event)
                      }}
                    >
                      <div className="font-medium">{event.title}</div>
                      <div className="text-xs opacity-90 mt-1">
                        {format(event.start, "h:mm a")} - {format(event.end, "h:mm a")}
                      </div>
                      {event.location && <div className="text-xs opacity-90 mt-1">📍 {event.location}</div>}
                    </motion.div>
                  )
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Default to month view if no view is specified
  return null
}
