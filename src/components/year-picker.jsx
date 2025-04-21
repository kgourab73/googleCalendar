import { useState } from "react"
import { motion } from "framer-motion"
import { X, ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent } from "@/components/ui/dialog"



export default function YearPicker({ currentYear, onYearSelect, onClose }) {
  const [decade, setDecade] = useState(Math.floor(currentYear / 10) * 10)

  const years = Array.from({ length: 12 }, (_, i) => decade + i - 1)

  const prevDecade = () => setDecade(decade - 10)
  const nextDecade = () => setDecade(decade + 10)

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[400px] p-0 overflow-hidden bg-white dark:bg-slate-900 border-none shadow-2xl">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.2 }}
          className="p-4"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <Button variant="ghost" size="icon" onClick={prevDecade} className="h-8 w-8">
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <h2 className="text-lg font-bold">
                {decade} - {decade + 9}
              </h2>
              <Button variant="ghost" size="icon" onClick={nextDecade} className="h-8 w-8">
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-4 gap-2">
            {years.map((year) => (
              <motion.button
                key={year}
                className={`
                  p-2 rounded-md text-center transition-colors
                  ${
                    year === currentYear
                      ? "bg-violet-100 text-violet-700 font-medium dark:bg-violet-900/30 dark:text-violet-300"
                      : "hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300"
                  }
                `}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => onYearSelect(year)}
              >
                {year}
              </motion.button>
            ))}
          </div>
        </motion.div>
      </DialogContent>
    </Dialog>
  )
}
