"use client"

import { motion } from "framer-motion"
import { format } from "date-fns"
import { Search, Calendar, Tag } from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"


export default function SearchResults({ results, onEventClick, }) {
  return (
    <motion.div
      className="absolute left-1/2 transform -translate-x-1/2 top-16 w-[600px] max-w-[calc(100vw-2rem)] bg-white dark:bg-slate-900 rounded-lg shadow-lg border border-slate-200 dark:border-slate-700 z-50 overflow-hidden"
      initial={{ opacity: 0, y: -10, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -10, scale: 0.95 }}
      transition={{ duration: 0.2 }}
    >
      <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-700">
        <div className="flex items-center gap-2">
          <Search className="h-5 w-5 text-violet-500" />
          <h3 className="font-semibold">Search Results</h3>
          <span className="bg-violet-100 text-violet-700 dark:bg-violet-900/50 dark:text-violet-300 text-xs rounded-full px-2 py-0.5">
            {results.length} found
          </span>
        </div>
      </div>

      <ScrollArea className="max-h-[400px]">
        {results.length > 0 ? (
          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {results.map((event) => (
              <motion.div
                key={event.id}
                className="p-4 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                onClick={() => onEventClick(event)}
                whileHover={{ x: 2 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-violet-100 dark:bg-violet-900/30 rounded-full flex items-center justify-center text-violet-600 dark:text-violet-300">
                    <Calendar className="h-5 w-5" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-slate-700 dark:text-slate-300">{event.title}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        {format(new Date(event.start), "MMM d, h:mm a")} - {format(new Date(event.end), "h:mm a")}
                      </p>
                      {event.category && (
                        <div className="flex items-center gap-1">
                          <Tag className="h-3 w-3 text-slate-400" />
                          <Badge variant="outline" className="text-xs capitalize py-0 h-5">
                            {event.category}
                          </Badge>
                        </div>
                      )}
                    </div>
                    {event.description && (
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-1">
                        {event.description}
                      </p>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="p-8 text-center text-slate-500 dark:text-slate-400">
            <Search className="h-8 w-8 mx-auto mb-2 opacity-30" />
            <p>No results found</p>
          </div>
        )}
      </ScrollArea>
    </motion.div>
  )
}
