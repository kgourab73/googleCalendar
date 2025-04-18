import { motion } from "framer-motion"
import { CalendarDays, CalendarRange, CalendarClock } from "lucide-react"


export default function ViewSelector({ currentView, onViewChange }) {
  return (
    <motion.div
      className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-10 bg-white dark:bg-slate-800 rounded-full shadow-lg border border-slate-200 dark:border-slate-700 p-1 md:hidden"
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: "spring", stiffness: 500, damping: 30 }}
    >
      <div className="flex items-center">
        <motion.button
          className={`p-2 rounded-full flex items-center justify-center ${
            currentView === "month"
              ? "bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-300"
              : "text-slate-600 dark:text-slate-400"
          }`}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => onViewChange("month")}
        >
          <CalendarDays className="h-5 w-5" />
        </motion.button>

        <motion.button
          className={`p-2 rounded-full flex items-center justify-center ${
            currentView === "week"
              ? "bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-300"
              : "text-slate-600 dark:text-slate-400"
          }`}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => onViewChange("week")}
        >
          <CalendarRange className="h-5 w-5" />
        </motion.button>

        <motion.button
          className={`p-2 rounded-full flex items-center justify-center ${
            currentView === "day"
              ? "bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-300"
              : "text-slate-600 dark:text-slate-400"
          }`}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => onViewChange("day")}
        >
          <CalendarClock className="h-5 w-5" />
        </motion.button>
      </div>
    </motion.div>
  )
}
