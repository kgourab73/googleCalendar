import { format } from "date-fns"
import { motion } from "framer-motion"
import { Briefcase, Users, Calendar, Coffee, Heart, Zap, BookOpen, MapPin, Clock } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"



export default function EventItem({ event, onClick }) {
  // Generate a color based on the event category
  const getEventColor = () => {
    const colorMap = {
      work: "bg-gradient-to-r from-violet-500 to-indigo-500 hover:from-violet-600 hover:to-indigo-600 border-violet-600",
      personal:
        "bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 border-emerald-600",
      meeting: "bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 border-blue-600",
      social: "bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 border-amber-600",
      health: "bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 border-rose-600",
      education:
        "bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 border-indigo-600",
    }

    return (
      colorMap[event.category || "work"] ||
      "bg-gradient-to-r from-slate-500 to-gray-500 hover:from-slate-600 hover:to-gray-600 border-slate-600"
    )
  }

  // Get icon based on category
  const getEventIcon = () => {
    const iconMap = {
      work: <Briefcase className="h-3 w-3" />,
      personal: <Heart className="h-3 w-3" />,
      meeting: <Users className="h-3 w-3" />,
      social: <Coffee className="h-3 w-3" />,
      health: <Zap className="h-3 w-3" />,
      education: <BookOpen className="h-3 w-3" />,
    }

    return iconMap[event.category || "work"] || <Calendar className="h-3 w-3" />
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <motion.div
            className={`
              text-xs p-1.5 rounded-md truncate cursor-pointer text-white
              border-l-2 shadow-sm
              ${getEventColor()}
              ${event.overlapping ? "opacity-90" : ""}
            `}
            style={{
              gridColumn: event.column ? `span ${event.colspan}` : undefined,
            }}
            whileHover={{
              y: -2,
              scale: 1.02,
              boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
            }}
            whileTap={{ scale: 0.98 }}
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClick}
          >
            <div className="font-medium truncate flex items-center gap-1">
              {getEventIcon()}
              <span>{event.title}</span>
            </div>
            <div className="text-xs opacity-90 flex items-center gap-1 mt-0.5">
              <Clock className="h-2.5 w-2.5" />
              {format(event.start, "h:mm a")}
            </div>
            {event.location && (
              <div className="text-xs opacity-90 flex items-center gap-1 mt-0.5">
                <MapPin className="h-2.5 w-2.5" />
                <span className="truncate">{event.location}</span>
              </div>
            )}
          </motion.div>
        </TooltipTrigger>
        <TooltipContent
          side="bottom"
          className="max-w-xs bg-white dark:bg-slate-800 shadow-xl border border-slate-200 dark:border-slate-700 p-3"
        >
          <div className="space-y-2">
            <div className="font-semibold text-sm">{event.title}</div>
            <div className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {format(event.start, "EEEE, MMMM d • h:mm a")} - {format(event.end, "h:mm a")}
            </div>
            {event.location && (
              <div className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1">
                <MapPin className="h-3 w-3" />
                {event.location}
              </div>
            )}
            {event.description && (
              <div className="text-xs mt-1 text-slate-700 dark:text-slate-300 border-t pt-1 border-slate-200 dark:border-slate-700">
                {event.description}
              </div>
            )}
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
