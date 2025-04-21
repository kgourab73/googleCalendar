import { useState } from "react"
import { format, addDays, isSameDay, isSameMonth } from "date-fns"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronLeft, CalendarIcon, Tag, Plus, CheckCircle2, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Card, CardContent } from "@/components/ui/card"

export default function Sidebar({
  isOpen,
  onToggle,
  currentDate,
  categories,
  events,
  selectedCategories,
  onCategoryToggle,
  onCreateEvent,
  onDateSelect,
}) {
  const [currentMiniMonth, setCurrentMiniMonth] = useState(new Date())

  // Get upcoming events (next 7 days)
  const upcomingEvents = events
    .filter((event) => {
      const eventDate = new Date(event.start)
      const sevenDaysFromNow = addDays(new Date(), 7)
      return eventDate >= new Date() && eventDate <= sevenDaysFromNow
    })
    .sort((a, b) => a.start.getTime() - b.start.getTime())
    .slice(0, 8)

  // Get color for category
  const getCategoryColor = (category) => {
    const colorMap = {
      work: "bg-violet-100 text-violet-700 hover:bg-violet-200 dark:bg-violet-900/30 dark:text-violet-300 dark:hover:bg-violet-900/50",
      personal:
        "bg-emerald-100 text-emerald-700 hover:bg-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-300 dark:hover:bg-emerald-900/50",
      meeting:
        "bg-blue-100 text-blue-700 hover:bg-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:hover:bg-blue-900/50",
      social:
        "bg-amber-100 text-amber-700 hover:bg-amber-200 dark:bg-amber-900/30 dark:text-amber-300 dark:hover:bg-amber-900/50",
      health:
        "bg-rose-100 text-rose-700 hover:bg-rose-200 dark:bg-rose-900/30 dark:text-rose-300 dark:hover:bg-rose-900/50",
      education:
        "bg-indigo-100 text-indigo-700 hover:bg-indigo-200 dark:bg-indigo-900/30 dark:text-indigo-300 dark:hover:bg-indigo-900/50",
    }

    return (
      colorMap[category] ||
      "bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
    )
  }

  // Handle next/prev month in mini calendar
  const nextMonth = () => {
    const nextMonth = new Date(currentMiniMonth)
    nextMonth.setMonth(nextMonth.getMonth() + 1)
    setCurrentMiniMonth(nextMonth)
  }

  const prevMonth = () => {
    const prevMonth = new Date(currentMiniMonth)
    prevMonth.setMonth(prevMonth.getMonth() - 1)
    setCurrentMiniMonth(prevMonth)
  }

  // Generate days for mini calendar
  const generateCalendarDays = () => {
    const year = currentMiniMonth.getFullYear()
    const month = currentMiniMonth.getMonth()

    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)

    const daysInMonth = lastDay.getDate()
    const startingDayOfWeek = firstDay.getDay()

    const days = []

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null)
    }

    // Add days of the month
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(new Date(year, month, i))
    }

    return days
  }

  const calendarDays = generateCalendarDays()

  // Handle date selection in mini calendar
  const handleDateSelect = (date) => {
    if (date) {
      onDateSelect(date)
    }
  }

  return (
    <AnimatePresence initial={false}>
      {isOpen && (
        <motion.div
          initial={{ width: 0, opacity: 0 }}
          animate={{ width: 300, opacity: 1 }}
          exit={{ width: 0, opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="h-full border-r bg-white dark:bg-slate-900 shadow-md overflow-hidden"
        >
          <div className="flex flex-col h-full">
            <div className="p-4 flex items-center justify-between border-b bg-gradient-to-r from-violet-500 to-indigo-600 text-white">
              <h2 className="text-lg font-semibold flex items-center gap-2">
                <CalendarIcon className="h-5 w-5" />
                Calendar
              </h2>
              <Button variant="ghost" size="icon" onClick={onToggle} className="text-white hover:bg-white/20">
                <ChevronLeft className="h-5 w-5" />
              </Button>
            </div>

            <ScrollArea className="flex-1 p-4 overflow-y-auto" type="always">
              <div className="space-y-6">
                {/* Mini Calendar */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-sm font-medium text-slate-500 dark:text-slate-400 flex items-center gap-2">
                      <CalendarIcon className="h-4 w-4" />
                      Mini Calendar
                    </h3>
                    <div className="flex items-center">
                      <Button variant="ghost" size="icon" className="h-6 w-6" onClick={prevMonth}>
                        <ChevronLeft className="h-3 w-3" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-6 w-6" onClick={nextMonth}>
                        <ChevronRight className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                  <Card className="bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700">
                    <CardContent className="p-3">
                      <div className="text-center mb-2 font-medium text-slate-700 dark:text-slate-300">
                        {format(currentMiniMonth, "MMMM yyyy")}
                      </div>
                      <div className="grid grid-cols-7 gap-1 text-center text-xs">
                        {["S", "M", "T", "W", "T", "F", "S"].map((day, i) => (
                          <div key={i} className="text-slate-500 dark:text-slate-400">
                            {day}
                          </div>
                        ))}
                        {calendarDays.map((day, index) => {
                          if (!day) return <div key={`empty-${index}`} />

                          const isToday = isSameDay(day, new Date())
                          const isCurrentMonthDay = isSameMonth(day, currentMiniMonth)
                          const isSelected = isSameDay(day, currentDate)

                          return (
                            <motion.div
                              key={index}
                              className={`
                                rounded-full w-6 h-6 flex items-center justify-center cursor-pointer
                                ${
                                  isToday
                                    ? "bg-violet-500 text-white"
                                    : isSelected
                                      ? "bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300 ring-1 ring-indigo-400 dark:ring-indigo-600"
                                      : isCurrentMonthDay
                                        ? "hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300"
                                        : "text-slate-400 dark:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800/50"
                                }
                              `}
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => handleDateSelect(day)}
                            >
                              {format(day, "d")}
                            </motion.div>
                          )
                        })}
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Categories */}
                <div>
                  <h3 className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-3 flex items-center gap-2">
                    <Tag className="h-4 w-4" />
                    Categories
                  </h3>
                  <div className="space-y-1">
                    {categories.map((category) => (
                      <motion.div
                        key={category}
                        className={`
                          flex items-center justify-between rounded-md px-3 py-1.5 text-sm cursor-pointer
                          ${getCategoryColor(category)}
                          ${selectedCategories.includes(category) ? "ring-1 ring-offset-1 ring-slate-200 dark:ring-slate-700" : ""}
                        `}
                        onClick={() => onCategoryToggle(category)}
                        whileHover={{ x: 2 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <span className="capitalize">{category}</span>
                        {selectedCategories.includes(category) && <CheckCircle2 className="h-4 w-4" />}
                      </motion.div>
                    ))}
                  </div>
                </div>

                <Separator />

                {/* Upcoming Events */}
                <div>
                  <h3 className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-3 flex items-center justify-between">
                    <span className="flex items-center gap-2">
                      <CalendarIcon className="h-4 w-4" />
                      Upcoming Events
                    </span>
                    <Button variant="ghost" size="icon" className="h-6 w-6" onClick={onCreateEvent}>
                      <Plus className="h-4 w-4" />
                    </Button>
                  </h3>
                  <div className="space-y-2">
                    {upcomingEvents.length > 0 ? (
                      upcomingEvents.map((event) => (
                        <motion.div
                          key={event.id}
                          className="p-2 rounded-md bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                          whileHover={{ y: -2, scale: 1.01 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => handleDateSelect(event.start)}
                        >
                          <div className="font-medium text-sm text-slate-700 dark:text-slate-300">{event.title}</div>
                          <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                            {format(event.start, "EEE, MMM d • h:mm a")}
                          </div>
                          <Badge
                            variant="outline"
                            className={`mt-2 text-xs capitalize ${getCategoryColor(event.category || "")}`}
                          >
                            {event.category}
                          </Badge>
                        </motion.div>
                      ))
                    ) : (
                      <div className="text-center p-4 text-sm text-slate-500 dark:text-slate-400">
                        No upcoming events
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </ScrollArea>

          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
