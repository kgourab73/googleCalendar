import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { format } from "date-fns"
import { X, Calendar, Clock, MapPin, Users, Tag, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"



export default function EventModal({ event, isOpen, onClose, onSave, onDelete, categories }) {
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [startDate, setStartDate] = useState("")
  const [startTime, setStartTime] = useState("")
  const [endDate, setEndDate] = useState("")
  const [endTime, setEndTime] = useState("")
  const [category, setCategory] = useState("")
  const [location, setLocation] = useState("")
  const [attendees, setAttendees] = useState("")

  // Initialize form with event data if editing
  useEffect(() => {
    if (event) {
      setTitle(event.title)
      setDescription(event.description || "")
      setStartDate(format(event.start, "yyyy-MM-dd"))
      setStartTime(format(event.start, "HH:mm"))
      setEndDate(format(event.end, "yyyy-MM-dd"))
      setEndTime(format(event.end, "HH:mm"))
      setCategory(event.category || "")
      setLocation(event.location || "")
      setAttendees(event.attendees?.join(", ") || "")
    } else {
      // Default values for new event
      const now = new Date()
      const oneHourLater = new Date(now.getTime() + 60 * 60 * 1000)

      setTitle("")
      setDescription("")
      setStartDate(format(now, "yyyy-MM-dd"))
      setStartTime(format(now, "HH:mm"))
      setEndDate(format(now, "yyyy-MM-dd"))
      setEndTime(format(oneHourLater, "HH:mm"))
      setCategory("")
      setLocation("")
      setAttendees("")
    }
  }, [event])

  const handleSubmit = (e) => {
    e.preventDefault()

    const startDateTime = new Date(`${startDate}T${startTime}`)
    const endDateTime = new Date(`${endDate}T${endTime}`)

    const updatedEvent = {
      id: event?.id || "",
      title,
      description,
      start: startDateTime,
      end: endDateTime,
      category,
      location,
      attendees: attendees ? attendees.split(",").map((a) => a.trim()) : [],
    }

    onSave(updatedEvent)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[550px] p-0 overflow-hidden bg-white dark:bg-slate-900 border-none shadow-2xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.2 }}
        >
          <div
            className={`h-2 ${event ? (event.category ? `bg-${event.category}-500` : "bg-violet-500") : "bg-violet-500"}`}
          />

          <DialogHeader className="px-6 pt-6 pb-0">
            <div className="flex items-center justify-between">
              <DialogTitle className="text-xl font-semibold">{event ? "Edit Event" : "Create New Event"}</DialogTitle>
            </div>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4 px-6 py-4">
            <div className="space-y-2">
              <Input
                placeholder="Add title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="text-lg font-medium border-none bg-transparent px-0 focus-visible:ring-0 focus-visible:ring-offset-0 h-auto py-0"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
                  <Calendar className="h-4 w-4" />
                  Start
                </Label>
                <div className="flex gap-2">
                  <Input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="flex-1"
                    required
                  />
                  <Input
                    type="time"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    className="w-24"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
                  <Clock className="h-4 w-4" />
                  End
                </Label>
                <div className="flex gap-2">
                  <Input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="flex-1"
                    required
                  />
                  <Input
                    type="time"
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    className="w-24"
                    required
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
                <MapPin className="h-4 w-4" />
                Location
              </Label>
              <Input placeholder="Add location" value={location} onChange={(e) => setLocation(e.target.value)} />
            </div>

            <div className="space-y-2">
              <Label className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
                <Tag className="h-4 w-4" />
                Category
              </Label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat} value={cat} className="capitalize">
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
                <Users className="h-4 w-4" />
                Attendees
              </Label>
              <Input
                placeholder="Add attendees (comma separated)"
                value={attendees}
                onChange={(e) => setAttendees(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label className="text-sm text-slate-500 dark:text-slate-400">Description</Label>
              <Textarea
                placeholder="Add description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="min-h-[100px]"
              />
            </div>

            <DialogFooter className="flex items-center justify-between pt-4 gap-2">
              {event && (
                <Button
                  type="button"
                  variant="destructive"
                  onClick={() => onDelete(event.id)}
                  className="flex items-center gap-1"
                >
                  <Trash2 className="h-4 w-4" />
                  Delete
                </Button>
              )}
              <div className="flex gap-2 ml-auto">
                <Button type="button" variant="outline" onClick={onClose}>
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700"
                >
                  {event ? "Update" : "Create"}
                </Button>
              </div>
            </DialogFooter>
          </form>
        </motion.div>
      </DialogContent>
    </Dialog>
  )
}
