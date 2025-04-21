import { format } from "date-fns"
import {
  ChevronLeft,
  ChevronRight,
  Menu,
  Plus,
  Search,
  Bell,
  User,
  Calendar,
  LogOut,
  Settings,
  ChevronsLeft,
  ChevronsRight,
  Moon,
  Sun,
  CalendarDays,
  CalendarRange,
  CalendarClock,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { motion, AnimatePresence } from "framer-motion"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useEffect, useState } from "react"



export default function CalendarHeader({
  currentDate,
  onPrevMonth,
  onNextMonth,
  onPrevYear,
  onNextYear,
  onToday,
  onToggleSidebar,
  onCreateEvent,
  onSearch,
  searchQuery,
  onToggleTheme,
  isDarkMode,
  notificationCount,
  onToggleNotifications,
  onYearPickerOpen,
  calendarView,
  onViewChange,
}) {
  const [query, setQuery] = useState(searchQuery)
  const [isScrolled, setIsScrolled] = useState(false)
  

  // Handle search input change
  const handleSearchChange = (e) => {
    setQuery(e.target.value)
    onSearch(e.target.value)
  }


  // Detect scroll for header shadow
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Get title based on view
  const getViewTitle = () => {
    switch (calendarView) {
      case "year":
        return format(currentDate, "yyyy")
      case "month":
        return format(currentDate, "MMMM yyyy")
      case "week":
        return `Week ${format(currentDate, "MMMM d, yyyy")}`
      case "day":
        return format(currentDate, "EEEE, MMMM d, yyyy")
      default:
        return format(currentDate, "MMMM yyyy")
    }
  }

  return (
    <motion.header
      className={`sticky top-0 z-10 flex items-center justify-between p-4 border-b bg-white dark:bg-slate-900 transition-all duration-200 ${
        isScrolled ? "shadow-md" : ""
      }`}
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-center space-x-4">
        <motion.button
          whileHover={{ scale: 1.05, rotate: 5 }}
          whileTap={{ scale: 0.95 }}
          className="text-slate-600 dark:text-slate-300 p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800"
          onClick={onToggleSidebar}
        >
          <Menu className="h-5 w-5" />
        </motion.button>

        <motion.div
          className="flex items-center"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1, duration: 0.3 }}
        >
          <Calendar className="h-6 w-6 mr-2 text-violet-500" />
          <motion.button
            className="text-xl font-bold bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent hover:from-violet-500 hover:to-indigo-500 transition-all duration-300"
            onClick={onYearPickerOpen}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {getViewTitle()}
          </motion.button>
        </motion.div>

        <div className="flex items-center space-x-1 ml-2">
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              variant="ghost"
              size="icon"
              onClick={onPrevYear}
              aria-label="Previous year"
              className="text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full"
            >
              <ChevronsLeft className="h-4 w-4" />
            </Button>
          </motion.div>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              variant="ghost"
              size="icon"
              onClick={onPrevMonth}
              aria-label="Previous month"
              className="text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full"
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>
          </motion.div>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              variant="outline"
              size="sm"
              onClick={onToday}
              className="bg-white dark:bg-slate-800 border-violet-200 dark:border-violet-800 text-violet-700 dark:text-violet-300 hover:bg-violet-50 dark:hover:bg-violet-900/30"
            >
              Today
            </Button>
          </motion.div>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              variant="ghost"
              size="icon"
              onClick={onNextMonth}
              aria-label="Next month"
              className="text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full"
            >
              <ChevronRight className="h-5 w-5" />
            </Button>
          </motion.div>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              variant="ghost"
              size="icon"
              onClick={onNextYear}
              aria-label="Next year"
              className="text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full"
            >
              <ChevronsRight className="h-4 w-4" />
            </Button>
          </motion.div>
        </div>

        <div className="hidden md:flex space-x-1 ml-2">
          <Button
            variant={calendarView === "month" ? "secondary" : "ghost"}
            size="sm"
            onClick={() => onViewChange("month")}
            className="text-sm"
          >
            <CalendarDays className="h-4 w-4 mr-1" />
            Month
          </Button>
          <Button
            variant={calendarView === "week" ? "secondary" : "ghost"}
            size="sm"
            onClick={() => onViewChange("week")}
            className="text-sm"
          >
            <CalendarRange className="h-4 w-4 mr-1" />
            Week
          </Button>
          <Button
            variant={calendarView === "day" ? "secondary" : "ghost"}
            size="sm"
            onClick={() => onViewChange("day")}
            className="text-sm"
          >
            <CalendarClock className="h-4 w-4 mr-1" />
            Day
          </Button>
        </div>
      </div>

      <div className="hidden md:flex items-center relative max-w-md w-full mx-4">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
        <Input
          placeholder="Search events..."
          className="pl-10 bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 transition-all duration-200 focus:ring-2 focus:ring-violet-500 focus:border-transparent"
          value={query}
          onChange={handleSearchChange}
        />
      </div>

    <div className="flex items-center space-x-2">

      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Button
            onClick={onCreateEvent}
            className="bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white shadow-md hover:shadow-lg transition-all duration-200"
          >
            New Event
          </Button>
        </motion.div>

      <div className="flex items-center space-x-1 md:space-x-2 mt-2 md:mt-0 w-full md:w-auto justify-between md:justify-end">
        {onToggleTheme && (
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              variant="ghost"
              size="icon"
              onClick={onToggleTheme}
              className="text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full h-8 w-8"
            >
              {isDarkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </Button>
          </motion.div>
        )}
      </div>
        

        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Button
            variant="ghost"
            size="icon"
            className="text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full relative"
            onClick={onToggleNotifications}
          >
            <Bell className="h-5 w-5" />
            <AnimatePresence>
              {notificationCount > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                  className="absolute top-0 right-0 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center"
                >
                  {notificationCount}
                </motion.span>
              )}
            </AnimatePresence>
          </Button>
        </motion.div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button variant="ghost" size="icon" className="rounded-full">
                <Avatar className="h-8 w-8 ring-2 ring-violet-200 dark:ring-violet-800">
                  <AvatarImage src="/placeholder.svg?height=32&width=32" alt="User" />
                  <AvatarFallback className="bg-gradient-to-br from-violet-500 to-indigo-600 text-white">
                    KG
                  </AvatarFallback>
                </Avatar>
              </Button>
            </motion.div>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium">Kirtigourab Gouda</p>
                <p className="text-xs text-muted-foreground">kggouda732003@gmail.com</p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem >
              <User className="mr-2 h-4 w-4" />
              <span>Profile</span>
            </DropdownMenuItem>
            <DropdownMenuItem >
              <Settings className="mr-2 h-4 w-4" />
              <span>Settings</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem >
              <LogOut className="mr-2 h-4 w-4" />
              <span>Logout</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </motion.header>
  )
}
