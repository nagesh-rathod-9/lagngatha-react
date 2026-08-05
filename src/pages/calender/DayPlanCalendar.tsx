import { useEffect, useMemo, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ChevronLeft, ChevronRight, Plus, X, Trash2, Clock, Calendar as CalendarIcon
} from 'lucide-react'
import { Card, CardHeader, CardBody, Badge, Input } from '@/components/ui'
import { cn } from '@/utils/cn'

interface CalendarEvent {
  id: string
  title: string
  notes: string
  date: string       // 'YYYY-MM-DD'
  startTime: string  // 'HH:mm'
  endTime: string    // 'HH:mm'
  allDay: boolean
  color: 'blue' | 'green' | 'red' | 'yellow' | 'purple'
}

type ViewMode = 'month' | 'week' | 'day'

const STORAGE_KEY = 'day_plan_events'
const HOURS = Array.from({ length: 17 }, (_, i) => i + 6) // 6am - 10pm

const COLOR_MAP: Record<CalendarEvent['color'], { bg: string; dot: string; border: string }> = {
  blue: { bg: 'bg-blue-500/15', dot: 'bg-blue-400', border: 'border-blue-500/40' },
  green: { bg: 'bg-emerald-500/15', dot: 'bg-emerald-400', border: 'border-emerald-500/40' },
  red: { bg: 'bg-red-500/15', dot: 'bg-red-400', border: 'border-red-500/40' },
  yellow: { bg: 'bg-amber-500/15', dot: 'bg-amber-400', border: 'border-amber-500/40' },
  purple: { bg: 'bg-purple-500/15', dot: 'bg-purple-400', border: 'border-purple-500/40' },
}

function toDateKey(d: Date) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

function startOfWeek(d: Date) {
  const copy = new Date(d)
  const day = copy.getDay()
  copy.setDate(copy.getDate() - day)
  copy.setHours(0, 0, 0, 0)
  return copy
}

function addDays(d: Date, n: number) {
  const copy = new Date(d)
  copy.setDate(copy.getDate() + n)
  return copy
}

function timeToMinutes(t: string) {
  const [h, m] = t.split(':').map(Number)
  return h * 60 + m
}

const emptyDraft = (dateKey: string): CalendarEvent => ({
  id: '',
  title: '',
  notes: '',
  date: dateKey,
  startTime: '09:00',
  endTime: '10:00',
  allDay: false,
  color: 'blue',
})

export function DayPlanCalendar() {
  const [events, setEvents] = useState<CalendarEvent[]>([])
  const [view, setView] = useState<ViewMode>('month')
  const [currentDate, setCurrentDate] = useState(new Date())
  const [showModal, setShowModal] = useState(false)
  const [draft, setDraft] = useState<CalendarEvent | null>(null)

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      try {
        const parsed = JSON.parse(stored)
        if (Array.isArray(parsed)) setEvents(parsed)
      } catch (e) {
        console.error('Error parsing stored events', e)
      }
    }

    const load = () => {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) {
        try {
          const parsed = JSON.parse(stored)
          if (Array.isArray(parsed)) setEvents(parsed)
        } catch (e) {
          console.error('Error parsing stored events', e)
        }
      }
    }

    window.addEventListener('calendar-events-updated', load)
    window.addEventListener('storage', load)
    return () => {
      window.removeEventListener('calendar-events-updated', load)
      window.removeEventListener('storage', load)
    }
  }, [])

  const persist = (updated: CalendarEvent[]) => {
    setEvents(updated)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
    window.dispatchEvent(new Event('calendar-events-updated'))
  }

  const openNewEvent = (dateKey: string) => {
    setDraft(emptyDraft(dateKey))
    setShowModal(true)
  }

  const openEditEvent = (ev: CalendarEvent) => {
    setDraft({ ...ev })
    setShowModal(true)
  }

  const closeModal = () => {
    setShowModal(false)
    setDraft(null)
  }

  const handleSave = () => {
    if (!draft || !draft.title.trim()) return
    if (draft.id) {
      persist(events.map(e => (e.id === draft.id ? draft : e)))
    } else {
      persist([...events, { ...draft, id: `evt_${Date.now()}` }])
    }
    closeModal()
  }

  const handleDelete = () => {
    if (!draft?.id) return
    persist(events.filter(e => e.id !== draft.id))
    closeModal()
  }

  const goToday = () => setCurrentDate(new Date())
  const goPrev = () => {
    if (view === 'month') setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1))
    else if (view === 'week') setCurrentDate(addDays(currentDate, -7))
    else setCurrentDate(addDays(currentDate, -1))
  }
  const goNext = () => {
    if (view === 'month') setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1))
    else if (view === 'week') setCurrentDate(addDays(currentDate, 7))
    else setCurrentDate(addDays(currentDate, 1))
  }

  const headerLabel = useMemo(() => {
    if (view === 'month') {
      return currentDate.toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })
    }
    if (view === 'week') {
      const start = startOfWeek(currentDate)
      const end = addDays(start, 6)
      const sameMonth = start.getMonth() === end.getMonth()
      return sameMonth
        ? `${start.toLocaleDateString('en-IN', { month: 'long' })} ${start.getDate()} – ${end.getDate()}, ${end.getFullYear()}`
        : `${start.toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })} – ${end.toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' })}`
    }
    return currentDate.toLocaleDateString('en-IN', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })
  }, [view, currentDate])

  const monthGrid = useMemo(() => {
    const first = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1)
    const gridStart = startOfWeek(first)
    return Array.from({ length: 42 }, (_, i) => addDays(gridStart, i))
  }, [currentDate])

  const weekDays = useMemo(() => {
    const start = startOfWeek(currentDate)
    return Array.from({ length: 7 }, (_, i) => addDays(start, i))
  }, [currentDate])

  const eventsForDate = (dateKey: string) =>
    events.filter(e => e.date === dateKey).sort((a, b) => timeToMinutes(a.startTime) - timeToMinutes(b.startTime))

  const todayKey = toDateKey(new Date())

  return (
    <div className="h-screen flex flex-col p-4 sm:p-6">
      <Card className="flex-1 flex flex-col min-h-0">
        <CardHeader
          title="Day Plan"
          subtitle={headerLabel}
          actions={
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1">
                <button onClick={goPrev} className="p-1.5 rounded-md border border-orbit-border text-slate-400 hover:text-slate-200 hover:bg-white/5 transition-colors">
                  <ChevronLeft className="w-3.5 h-3.5" />
                </button>
                <button onClick={goToday} className="px-2.5 h-7 rounded-md border border-orbit-border text-xs text-slate-300 hover:bg-white/5 transition-colors">
                  Today
                </button>
                <button onClick={goNext} className="p-1.5 rounded-md border border-orbit-border text-slate-400 hover:text-slate-200 hover:bg-white/5 transition-colors">
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="flex items-center rounded-md border border-orbit-border overflow-hidden">
                {(['month', 'week', 'day'] as ViewMode[]).map(v => (
                  <button
                    key={v}
                    onClick={() => setView(v)}
                    className={cn(
                      'px-3 h-7 text-xs font-medium capitalize transition-colors',
                      view === v ? 'bg-orbit-primary text-white' : 'text-slate-400 hover:bg-white/5 hover:text-slate-200'
                    )}
                  >
                    {v}
                  </button>
                ))}
              </div>

              <button
                onClick={() => openNewEvent(view === 'month' ? toDateKey(currentDate) : toDateKey(currentDate))}
                className="flex items-center gap-1.5 px-3 h-7 rounded-md bg-orbit-primary text-white text-xs font-medium hover:opacity-90 transition-opacity"
              >
                <Plus className="w-3.5 h-3.5" /> Add
              </button>
            </div>
          }
        />

        <CardBody className="p-0 pt-2 flex-1 flex flex-col min-h-0 overflow-hidden">
          {view === 'month' && (
            <div className="flex-1 flex flex-col min-h-0">
              <div className="grid grid-cols-7 border-b border-orbit-border">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
                  <div key={d} className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider px-3 py-2 text-center">
                    {d}
                  </div>
                ))}
              </div>
              <div className="flex-1 grid grid-cols-7 grid-rows-6 overflow-y-auto min-h-0">
                {monthGrid.map((d, i) => {
                  const dateKey = toDateKey(d)
                  const isCurrentMonth = d.getMonth() === currentDate.getMonth()
                  const isToday = dateKey === todayKey
                  const dayEvents = eventsForDate(dateKey)
                  const visible = dayEvents.slice(0, 3)
                  const extra = dayEvents.length - visible.length

                  return (
                    <div
                      key={i}
                      onClick={() => openNewEvent(dateKey)}
                      className={cn(
                        'border-b border-r border-orbit-border p-1.5 min-h-[90px] cursor-pointer hover:bg-white/[0.03] transition-colors',
                        !isCurrentMonth && 'opacity-40'
                      )}
                    >
                      <div className="flex justify-end">
                        <span className={cn(
                          'text-xs w-5 h-5 flex items-center justify-center rounded-full',
                          isToday ? 'bg-orbit-primary text-white font-semibold' : 'text-slate-400'
                        )}>
                          {d.getDate()}
                        </span>
                      </div>
                      <div className="mt-1 space-y-1">
                        {visible.map(ev => (
                          <div
                            key={ev.id}
                            onClick={(e) => { e.stopPropagation(); openEditEvent(ev) }}
                            className={cn('text-[10px] px-1.5 py-0.5 rounded border truncate', COLOR_MAP[ev.color].bg, COLOR_MAP[ev.color].border)}
                          >
                            {!ev.allDay && <span className="text-slate-400">{ev.startTime} </span>}
                            <span className="text-slate-200">{ev.title}</span>
                          </div>
                        ))}
                        {extra > 0 && (
                          <p className="text-[10px] text-slate-500 px-1.5">+{extra} more</p>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {view === 'week' && (
            <div className="flex-1 overflow-y-auto min-h-0">
              <div className="grid grid-cols-[56px_repeat(7,1fr)] sticky top-0 bg-orbit-surface z-10 border-b border-orbit-border">
                <div />
                {weekDays.map(d => {
                  const isToday = toDateKey(d) === todayKey
                  return (
                    <div key={d.toISOString()} className="text-center py-2 border-l border-orbit-border">
                      <p className="text-[11px] text-slate-500 uppercase">{d.toLocaleDateString('en-IN', { weekday: 'short' })}</p>
                      <p className={cn('text-sm font-medium mt-0.5', isToday ? 'text-orbit-primary' : 'text-slate-300')}>{d.getDate()}</p>
                    </div>
                  )
                })}
              </div>
              <div className="grid grid-cols-[56px_repeat(7,1fr)]">
                <div>
                  {HOURS.map(h => (
                    <div key={h} className="h-14 text-[10px] text-slate-500 text-right pr-2 -translate-y-2">
                      {h % 12 === 0 ? 12 : h % 12}{h < 12 ? 'am' : 'pm'}
                    </div>
                  ))}
                </div>
                {weekDays.map(d => {
                  const dateKey = toDateKey(d)
                  const dayEvents = eventsForDate(dateKey).filter(e => !e.allDay)
                  return (
                    <div key={dateKey} className="relative border-l border-orbit-border">
                      {HOURS.map(h => (
                        <div
                          key={h}
                          onClick={() => openNewEvent(dateKey)}
                          className="h-14 border-b border-orbit-border/50 cursor-pointer hover:bg-white/[0.02]"
                        />
                      ))}
                      {dayEvents.map(ev => {
                        const top = ((timeToMinutes(ev.startTime) - HOURS[0] * 60) / 60) * 56
                        const height = Math.max(((timeToMinutes(ev.endTime) - timeToMinutes(ev.startTime)) / 60) * 56, 20)
                        return (
                          <div
                            key={ev.id}
                            onClick={(e) => { e.stopPropagation(); openEditEvent(ev) }}
                            style={{ top, height }}
                            className={cn('absolute left-0.5 right-0.5 rounded px-1.5 py-0.5 border overflow-hidden cursor-pointer', COLOR_MAP[ev.color].bg, COLOR_MAP[ev.color].border)}
                          >
                            <p className="text-[10px] font-medium text-slate-200 truncate">{ev.title}</p>
                            <p className="text-[9px] text-slate-400">{ev.startTime}–{ev.endTime}</p>
                          </div>
                        )
                      })}
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {view === 'day' && (
            <div className="flex-1 overflow-y-auto min-h-0">
              <div className="grid grid-cols-[56px_1fr]">
                <div>
                  {HOURS.map(h => (
                    <div key={h} className="h-14 text-[10px] text-slate-500 text-right pr-2 -translate-y-2">
                      {h % 12 === 0 ? 12 : h % 12}{h < 12 ? 'am' : 'pm'}
                    </div>
                  ))}
                </div>
                <div className="relative border-l border-orbit-border">
                  {HOURS.map(h => (
                    <div
                      key={h}
                      onClick={() => openNewEvent(toDateKey(currentDate))}
                      className="h-14 border-b border-orbit-border/50 cursor-pointer hover:bg-white/[0.02]"
                    />
                  ))}
                  {eventsForDate(toDateKey(currentDate)).filter(e => !e.allDay).map(ev => {
                    const top = ((timeToMinutes(ev.startTime) - HOURS[0] * 60) / 60) * 56
                    const height = Math.max(((timeToMinutes(ev.endTime) - timeToMinutes(ev.startTime)) / 60) * 56, 24)
                    return (
                      <div
                        key={ev.id}
                        onClick={(e) => { e.stopPropagation(); openEditEvent(ev) }}
                        style={{ top, height }}
                        className={cn('absolute left-2 right-2 rounded-md px-2 py-1 border overflow-hidden cursor-pointer', COLOR_MAP[ev.color].bg, COLOR_MAP[ev.color].border)}
                      >
                        <p className="text-xs font-medium text-slate-200 truncate">{ev.title}</p>
                        <p className="text-[10px] text-slate-400 flex items-center gap-1"><Clock className="w-2.5 h-2.5" />{ev.startTime}–{ev.endTime}</p>
                        {ev.notes && <p className="text-[10px] text-slate-500 truncate mt-0.5">{ev.notes}</p>}
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          )}
        </CardBody>
      </Card>

      <AnimatePresence>
        {showModal && draft && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4"
            onClick={closeModal}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 8 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-orbit-surface border border-orbit-border rounded-lg w-full max-w-md p-5"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold text-slate-200 flex items-center gap-2">
                  <CalendarIcon className="w-4 h-4 text-orbit-primary" />
                  {draft.id ? 'Edit Event' : 'New Event'}
                </h3>
                <button onClick={closeModal} className="text-slate-500 hover:text-slate-300">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-3">
                <Input
                  value={draft.title}
                  onChange={(e: any) => setDraft({ ...draft, title: e.target.value })}
                  placeholder="Event title"
                  className="text-sm"
                />

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] text-slate-500 block mb-1">Date</label>
                    <input
                      type="date"
                      value={draft.date}
                      onChange={(e) => setDraft({ ...draft, date: e.target.value })}
                      className="w-full bg-transparent border border-orbit-border rounded-md px-2 py-1.5 text-sm text-slate-200"
                    />
                  </div>
                  <div className="flex items-end gap-2 pb-1.5">
                    <input
                      type="checkbox"
                      checked={draft.allDay}
                      onChange={(e) => setDraft({ ...draft, allDay: e.target.checked })}
                      className="accent-orbit-primary"
                    />
                    <span className="text-xs text-slate-400">All day</span>
                  </div>
                </div>

                {!draft.allDay && (
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-[11px] text-slate-500 block mb-1">Start</label>
                      <input
                        type="time"
                        value={draft.startTime}
                        onChange={(e) => setDraft({ ...draft, startTime: e.target.value })}
                        className="w-full bg-transparent border border-orbit-border rounded-md px-2 py-1.5 text-sm text-slate-200"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] text-slate-500 block mb-1">End</label>
                      <input
                        type="time"
                        value={draft.endTime}
                        onChange={(e) => setDraft({ ...draft, endTime: e.target.value })}
                        className="w-full bg-transparent border border-orbit-border rounded-md px-2 py-1.5 text-sm text-slate-200"
                      />
                    </div>
                  </div>
                )}

                <div>
                  <label className="text-[11px] text-slate-500 block mb-1">Notes</label>
                  <textarea
                    value={draft.notes}
                    onChange={(e) => setDraft({ ...draft, notes: e.target.value })}
                    rows={2}
                    className="w-full bg-transparent border border-orbit-border rounded-md px-2 py-1.5 text-sm text-slate-200 resize-none"
                  />
                </div>

                <div>
                  <label className="text-[11px] text-slate-500 block mb-1.5">Color</label>
                  <div className="flex gap-2">
                    {(Object.keys(COLOR_MAP) as CalendarEvent['color'][]).map(c => (
                      <button
                        key={c}
                        onClick={() => setDraft({ ...draft, color: c })}
                        className={cn(
                          'w-6 h-6 rounded-full flex items-center justify-center border-2 transition-colors',
                          COLOR_MAP[c].dot,
                          draft.color === c ? 'border-white' : 'border-transparent'
                        )}
                      />
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between mt-5">
                {draft.id ? (
                  <button
                    onClick={handleDelete}
                    className="flex items-center gap-1.5 px-3 h-8 rounded-md text-red-400 hover:bg-red-500/10 text-xs transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" /> Delete
                  </button>
                ) : <div />}
                <div className="flex gap-2">
                  <button onClick={closeModal} className="px-3 h-8 rounded-md border border-orbit-border text-slate-400 text-xs hover:bg-white/5 transition-colors">
                    Cancel
                  </button>
                  <button
                    onClick={handleSave}
                    disabled={!draft.title.trim()}
                    className="px-3 h-8 rounded-md bg-orbit-primary text-white text-xs font-medium hover:opacity-90 disabled:opacity-40 transition-opacity"
                  >
                    Save
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default DayPlanCalendar