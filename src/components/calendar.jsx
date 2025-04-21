import { useState, useEffect, useRef } from "react"
import {
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameDay,
  addMonths,
  subMonths,
  parseISO,
  isWithinInterval,
  startOfWeek,
  endOfWeek,
  format,
  getYear,
  setYear,
  addYears,
  subYears,
} from "date-fns"
import { motion, AnimatePresence } from "framer-motion"
import CalendarHeader from "./calendar-header"
import CalendarGrid from "./calendar-grid"
import Sidebar from "./sidebar"
import EventModal from "./event-modal"
import NotificationPanel from "./notification-panel"
import SearchResults from "./search-results"
import DateDetailModal from "./date-detail-modal"
import YearPicker from "./year-picker"
import ViewSelector from "./view-selector"
import { sampleEvents } from "@/data/events"
import { sampleNotifications } from "@/data/notifications"


export default function Calendar() {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [events, setEvents] = useState([])
  const [notifications, setNotifications] = useState([])
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [direction, setDirection] = useState(0)
  const [eventModalOpen, setEventModalOpen] = useState(false)
  const [selectedEvent, setSelectedEvent] = useState(null)
  const [notificationPanelOpen, setNotificationPanelOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState([])
  const [searchOpen, setSearchOpen] = useState(false)
  const [selectedCategories, setSelectedCategories] = useState([])
  const [yearPickerOpen, setYearPickerOpen] = useState(false)
  const [selectedDate, setSelectedDate] = useState(null)
  const [dateDetailOpen, setDateDetailOpen] = useState(false)
  const [calendarView, setCalendarView] = useState("month")
  const [isDarkMode, setIsDarkMode] = useState(false)
  const calendarRef = useRef(null)
  

  useEffect(() => {
    // In a real app, this would fetch from an API
    setEvents(
      sampleEvents.map((event) => ({
        ...event,
        start: parseISO(event.start),
        end: parseISO(event.end),
      })),
    )
    setNotifications(sampleNotifications)

    // Check system preference for dark mode
    if (typeof window !== "undefined") {
      const prefersDark = window.matchMedia("(prefers-color-scheme: light)").matches
      setIsDarkMode(prefersDark)
      if (prefersDark) {
        document.documentElement.classList.add("light")
      }
    }
  }, [])

  // Toggle dark mode
  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode)
    document.documentElement.classList.toggle("dark")
  }

  // Filter events by selected categories
  const filteredEvents =
    selectedCategories.length > 0
      ? events.filter((event) => selectedCategories.includes(event.category || "uncategorized"))
      : events

  const monthStart = startOfMonth(currentDate)
  const monthEnd = endOfMonth(currentDate)
  const calendarStart = startOfWeek(monthStart)
  const calendarEnd = endOfWeek(monthEnd)
  const daysInMonth = eachDayOfInterval({ start: calendarStart, end: calendarEnd })

  const nextMonth = () => {
    setDirection(1)
    setCurrentDate(addMonths(currentDate, 1))
  }

  const prevMonth = () => {
    setDirection(-1)
    setCurrentDate(subMonths(currentDate, 1))
  }

  const nextYear = () => {
    setDirection(1)
    setCurrentDate(addYears(currentDate, 1))
  }

  const prevYear = () => {
    setDirection(-1)
    setCurrentDate(subYears(currentDate, 1))
  }

  const goToToday = () => {
    setDirection(0)
    setCurrentDate(new Date())
  }

  const goToYear = (year) => {
    const newDate = setYear(currentDate, year)
    setDirection(year > getYear(currentDate) ? 1 : -1)
    setCurrentDate(newDate)
    setYearPickerOpen(false)
  }

  const changeView = (view) => {
    setCalendarView(view)
  }

  // Get events for a specific day
  const getEventsForDay = (day) => {
    return filteredEvents.filter(
      (event) =>
        isSameDay(day, event.start) ||
        (isWithinInterval(day, {
          start: event.start,
          end: event.end,
        }) &&
          !isSameDay(day, event.end)),
    )
  }


  // Check if events overlap
  const checkEventOverlap = (events) => {
    const sortedEvents = [...events].sort((a, b) => a.start.getTime() - b.start.getTime())

    for (let i = 0; i < sortedEvents.length; i++) {
      sortedEvents[i].column = 0
      sortedEvents[i].colspan = 1
      sortedEvents[i].overlapping = false

      for (let j = 0; j < i; j++) {
        const eventA = sortedEvents[i]
        const eventB = sortedEvents[j]

        const overlap = eventA.start < eventB.end && eventB.start < eventA.end

        if (overlap) {
          eventA.overlapping = true
          eventB.overlapping = true

          if (eventA.column === eventB.column) {
            eventA.column = eventB.column + 1
          }
        }
      }
    }

    return sortedEvents
  }

  // Get all unique categories
  const categories = [...new Set(events.map((event) => event.category || "uncategorized"))]

  // Handle event click
  const handleEventClick = (event) => {
    setSelectedEvent(event)
    setEventModalOpen(true)
  }

  // Handle date click
  const handleDateClick = (date) => {
    setSelectedDate(date)
    setDateDetailOpen(true)
  }

  // Handle create new event
  const handleCreateEvent = (date) => {
    setSelectedEvent(null)
    if (date) {
      const newEvent = {
        start: date,
        end: new Date(date.getTime() + 60 * 60 * 1000), // 1 hour later
      }
      setSelectedEvent(newEvent )
    }
    setEventModalOpen(true)
  }

  // Handle save event
  const handleSaveEvent = (event) => {
    if (selectedEvent && selectedEvent.id) {
      // Update existing event
      setEvents(events.map((e) => (e.id === event.id ? event : e)))
      
    } else {
      // Create new event
      const newEvent = {
        ...event,
        id: `event-${Date.now()}`,
      }
      setEvents([...events, newEvent])
      
    }
    setEventModalOpen(false)
  }

  // Handle delete event
  const handleDeleteEvent = (eventId) => {
    setEvents(events.filter((e) => e.id !== eventId))
    setEventModalOpen(false)
    
  }

  // Handle search
  const handleSearch = (query) => {
    setSearchQuery(query)
    if (query.trim() === "") {
      setSearchResults([])
      setSearchOpen(false)
      return
    }

    const results = events.filter(
      (event) =>
        event.title.toLowerCase().includes(query.toLowerCase()) ||
        (event.description && event.description.toLowerCase().includes(query.toLowerCase())),
    )
    setSearchResults(results)
    setSearchOpen(true)
  }

  // Handle notification click
  const handleNotificationClick = (notification) => {
    // Mark as read
    setNotifications(notifications.map((n) => (n.id === notification.id ? { ...n, read: true } : n)))

    // If it's an event notification, open the event
    if (notification.eventId) {
      const event = events.find((e) => e.id === notification.eventId)
      if (event) {
        setSelectedEvent(event)
        setEventModalOpen(true)
      }
    }

    setNotificationPanelOpen(false)
  }

  // Handle mark all notifications as read
  const handleMarkAllAsRead = () => {
    setNotifications(notifications.map((n) => ({ ...n, read: true })))
    
  }

  // Handle category toggle
  const handleCategoryToggle = (category) => {
    setSelectedCategories(
      selectedCategories.includes(category)
        ? selectedCategories.filter((c) => c !== category)
        : [...selectedCategories, category],
    )
  }

  // Count unread notifications
  const unreadCount = notifications.filter((n) => !n.read).length

  return (
    <div className="flex h-screen overflow-hidden" ref={calendarRef}>
      {/* Sidebar */}
      <Sidebar
        isOpen={sidebarOpen}
        onToggle={() => setSidebarOpen(!sidebarOpen)}
        currentDate={currentDate}
        categories={categories}
        events={events}
        selectedCategories={selectedCategories}
        onCategoryToggle={handleCategoryToggle}
        onCreateEvent={handleCreateEvent}
        onDateSelect={setCurrentDate}
      />

      {/* Main Content */}
      <motion.div
        className="flex-1 flex flex-col h-full overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <CalendarHeader
          currentDate={currentDate}
          onPrevMonth={prevMonth}
          onNextMonth={nextMonth}
          onPrevYear={prevYear}
          onNextYear={nextYear}
          onToday={goToToday}
          onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
          onCreateEvent={() => handleCreateEvent()}
          onSearch={handleSearch}
          searchQuery={searchQuery}
          notificationCount={unreadCount}
          onToggleNotifications={() => setNotificationPanelOpen(!notificationPanelOpen)}
          onYearPickerOpen={() => setYearPickerOpen(true)}
          calendarView={calendarView}
          onViewChange={changeView}
          onToggleTheme={toggleDarkMode}
          isDarkMode={isDarkMode}
        />

        {/* Search Results Dropdown */}
        <AnimatePresence>
          {searchOpen && searchQuery.trim() !== "" && (
            <SearchResults
              results={searchResults}
              onEventClick={handleEventClick}
              onClose={() => setSearchOpen(false)}
            />
          )}
        </AnimatePresence>

        {/* Notification Panel */}
        <AnimatePresence>
          {notificationPanelOpen && (
            <NotificationPanel
              notifications={notifications}
              onNotificationClick={handleNotificationClick}
              onMarkAllAsRead={handleMarkAllAsRead}
              onClose={() => setNotificationPanelOpen(false)}
            />
          )}
        </AnimatePresence>

        {/* Year Picker */}
        <AnimatePresence>
          {yearPickerOpen && (
            <YearPicker
              currentYear={getYear(currentDate)}
              onYearSelect={goToYear}
              onClose={() => setYearPickerOpen(false)}
            />
          )}
        </AnimatePresence>


        <div className="flex-1 overflow-auto">
          <AnimatePresence initial={false} mode="wait">
            <motion.div
              key={`${calendarView}-${format(currentDate, "yyyy-MM")}`}
              initial={{
                x: direction * 50,
                opacity: 0,
              }}
              animate={{
                x: 0,
                opacity: 1,
              }}
              exit={{
                x: direction * -50,
                opacity: 0,
              }}
              transition={{ duration: 0.3 }}
              className="h-full"
            >
              <CalendarGrid
                currentDate={currentDate}
                daysInMonth={daysInMonth}
                events={filteredEvents}
                
                getEventsForDay={getEventsForDay}
                
                checkEventOverlap={checkEventOverlap}
                onEventClick={handleEventClick}
                onDateClick={handleDateClick}
                onAddEvent={handleCreateEvent}
                view={calendarView}
              />
            </motion.div>
          </AnimatePresence>
        </div>
      </motion.div>

      {/* Event Modal */}
      <AnimatePresence>
        {eventModalOpen && (
          <EventModal
            event={selectedEvent}
            isOpen={eventModalOpen}
            onClose={() => setEventModalOpen(false)}
            onSave={handleSaveEvent}
            onDelete={handleDeleteEvent}
            categories={categories}
          />
        )}
      </AnimatePresence>

      {/* Date Detail Modal */}
      <AnimatePresence>
        {dateDetailOpen && selectedDate && (
          <DateDetailModal
            date={selectedDate}
            events={getEventsForDay(selectedDate)}
            isOpen={dateDetailOpen}
            onClose={() => setDateDetailOpen(false)}
            onEventClick={handleEventClick}
            onAddEvent={() => handleCreateEvent(selectedDate)}
          />
        )}
      </AnimatePresence>
    </div>
  )
}
