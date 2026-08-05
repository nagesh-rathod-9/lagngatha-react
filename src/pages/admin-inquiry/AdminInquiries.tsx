import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Search, Trash2, Phone, ChevronLeft, ChevronRight } from 'lucide-react'
import { Card, CardHeader, CardBody, Badge, Avatar, Input } from '@/components/ui'
import { cn } from '@/utils/cn'

interface Inquiry {
  id: string
  name: string
  phone: string
  service: string
  eventInfo: string
  message: string
  submittedAt: string
  status: 'new' | 'contacted' | 'booked'
}

function statusConfig(status: Inquiry['status']) {
  if (status === 'new') return { variant: 'warning' as const, label: 'New' }
  if (status === 'contacted') return { variant: 'info' as const, label: 'Contacted' }
  return { variant: 'success' as const, label: 'Booked' }
}

// Generate dummy inquiries
const generateDummyInquiries = (): Inquiry[] => {
  const firstNames = ['Aarav', 'Vivaan', 'Aditya', 'Vihaan', 'Arjun', 'Sai', 'Pranav', 'Dhruv', 'Krishna', 'Shaurya',
    'Aadhya', 'Ananya', 'Diya', 'Ishita', 'Myra', 'Sara', 'Aisha', 'Anaya', 'Navya', 'Pari']

  const lastNames = ['Sharma', 'Verma', 'Patel', 'Singh', 'Kumar', 'Reddy', 'Gupta', 'Joshi', 'Nair', 'Menon',
    'Desai', 'Shah', 'Malhotra', 'Khanna', 'Mehta', 'Choudhary', 'Rajput', 'Yadav', 'Sinha', 'Das']

  const services = ['Wedding Photography', 'Videography', 'Pre-Wedding Shoot', 'Candid Photography',
    'Traditional Photography', 'Drone Coverage', 'Wedding Film', 'Same Day Edit', 'Photo Booth', 'Bridal Shoot']

  const venues = ['Taj Palace, Mumbai', 'ITC Grand, Delhi', 'The Oberoi, Bangalore', 'Taj Lake Palace, Udaipur',
    'Rambagh Palace, Jaipur', 'The Leela, Chennai', 'The Lalit, Pune', 'JW Marriott, Kolkata',
    'The Ritz-Carlton, Bangalore', 'Sheraton Grand, Hyderabad', 'Fort Heritage, Jodhpur', 'Seaside Villa, Goa']

  const messages = [
    'Looking for wedding photography package for a 3-day event.',
    'Need videography coverage for our destination wedding.',
    'Interested in pre-wedding shoot at iconic locations.',
    'Please share your wedding film portfolio.',
    'We need a photographer for an intimate wedding ceremony.',
    'Looking for candid photography for 500 guests.',
    'Please provide drone coverage options for our venue.',
    'Need a traditional wedding photographer with experience.',
    'Interested in your photo booth services.',
    'We want a wedding film with cinematic editing.',
    'Looking for a photographer who can do traditional and candid both.',
    'Need coverage for a week-long wedding celebration.',
    'Please share details about your bridal shoot package.',
    'We need a team for our multi-city wedding.',
    'Looking for creative pre-wedding shoot ideas.',
    'Interested in your same-day edit service.',
    'Need a photographer with experience in beach weddings.',
    'Please provide pricing for your wedding package.',
    'We want a documentary-style wedding film.',
    'Looking for a photographer who understands our culture.',
    'Need coverage for haldi, mehendi, and wedding day.',
    'Please share your wedding photography packages.',
    'We need a videographer for our engagement ceremony.',
    'Looking for a creative team for our wedding.',
    'Interested in your luxury wedding package.',
    'We want a photographer who can work with natural light.',
    'Need coverage for a small intimate wedding with family.',
    'Please provide options for wedding photography albums.',
    'We need a team that can handle 1000+ guests.',
    'Looking for a photographer with 10+ years of experience.',
    'Interested in your destination wedding package.',
    'We want a mix of traditional and modern photography.',
    'Need a photographer for a fusion wedding ceremony.'
  ]

  const dummyData: Inquiry[] = []

  for (let i = 1; i <= 35; i++) {
    const firstName = firstNames[Math.floor(Math.random() * firstNames.length)]
    const lastName = lastNames[Math.floor(Math.random() * lastNames.length)]
    const name = `${firstName} ${lastName}`
    const service = services[Math.floor(Math.random() * services.length)]
    const venue = venues[Math.floor(Math.random() * venues.length)]
    const message = messages[Math.floor(Math.random() * messages.length)]

    const statuses: Inquiry['status'][] = ['new', 'contacted', 'booked']
    const status = statuses[Math.floor(Math.random() * statuses.length)]

    const date = new Date()
    date.setDate(date.getDate() - Math.floor(Math.random() * 30))
    const submittedAt = date.toISOString()

    dummyData.push({
      id: `inq_${String(i).padStart(3, '0')}`,
      name,
      phone: `98765${String(Math.floor(10000 + Math.random() * 90000))}`,
      service,
      eventInfo: venue,
      message,
      submittedAt,
      status
    })
  }

  return dummyData.sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime())
}

export function AdminInquiries() {
  const [inquiries, setInquiries] = useState<Inquiry[]>([])
  const [query, setQuery] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

  useEffect(() => {
    const stored = localStorage.getItem('wedding_inquiries')
    let initialData: Inquiry[] = []

    if (stored) {
      try {
        const parsed = JSON.parse(stored)
        if (Array.isArray(parsed) && parsed.length > 0) {
          initialData = parsed
        }
      } catch (e) {
        console.error('Error parsing stored inquiries', e)
      }
    }

    if (initialData.length === 0) {
      initialData = generateDummyInquiries()
      localStorage.setItem('wedding_inquiries', JSON.stringify(initialData))
    }

    setInquiries(initialData)

    const load = () => {
      const stored = localStorage.getItem('wedding_inquiries')
      if (stored) {
        try {
          const parsed = JSON.parse(stored)
          if (Array.isArray(parsed)) {
            setInquiries(parsed)
          }
        } catch (e) {
          console.error('Error parsing stored inquiries', e)
        }
      }
    }

    window.addEventListener('inquiries-updated', load)
    window.addEventListener('storage', load)

    return () => {
      window.removeEventListener('inquiries-updated', load)
      window.removeEventListener('storage', load)
    }
  }, [])

  // Reset to first page when search query changes
  useEffect(() => {
    setCurrentPage(1)
  }, [query])

  const cycleStatus = (id: string) => {
    const next = { new: 'contacted', contacted: 'booked', booked: 'new' } as const
    const updated = inquiries.map(inq => inq.id === id ? { ...inq, status: next[inq.status] } : inq)
    setInquiries(updated)
    localStorage.setItem('wedding_inquiries', JSON.stringify(updated))
  }

  const handleDelete = (id: string) => {
    const updated = inquiries.filter(inq => inq.id !== id)
    setInquiries(updated)
    localStorage.setItem('wedding_inquiries', JSON.stringify(updated))
    // Reset to last page if current page becomes empty
    const totalPages = Math.max(1, Math.ceil(updated.length / itemsPerPage))
    if (currentPage > totalPages) {
      setCurrentPage(totalPages)
    }
  }

  const filtered = inquiries.filter(inq =>
    inq.name.toLowerCase().includes(query.toLowerCase()) ||
    inq.phone.includes(query) ||
    inq.service.toLowerCase().includes(query.toLowerCase())
  )

  // Pagination calculations
  const totalPages = Math.max(1, Math.ceil(filtered.length / itemsPerPage))
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentItems = filtered.slice(startIndex, endIndex)

  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page)
    }
  }

  const goToPrevious = () => goToPage(currentPage - 1)
  const goToNext = () => goToPage(currentPage + 1)

  // Get page numbers to display
  const getPageNumbers = () => {
    const pages = []
    const maxVisible = 5
    let start = Math.max(1, currentPage - Math.floor(maxVisible / 2))
    let end = Math.min(totalPages, start + maxVisible - 1)

    if (end - start < maxVisible - 1) {
      start = Math.max(1, end - maxVisible + 1)
    }

    for (let i = start; i <= end; i++) {
      pages.push(i)
    }
    return pages
  }

  // Stats for display
  const totalNew = inquiries.filter(i => i.status === 'new').length
  const totalContacted = inquiries.filter(i => i.status === 'contacted').length
  const totalBooked = inquiries.filter(i => i.status === 'booked').length

  return (
    <div className="h-screen flex flex-col p-4 sm:p-6">
      <Card className="flex-1 flex flex-col min-h-0">
        <CardHeader
          title="Wedding Inquiries"
          subtitle={`${inquiries.length} inquiries received`}
          actions={
            <div className="flex items-center gap-4">
              <div className="flex gap-2 text-xs">
                <Badge variant="warning" dot>New: {totalNew}</Badge>
                <Badge variant="info" dot>Contacted: {totalContacted}</Badge>
                <Badge variant="success" dot>Booked: {totalBooked}</Badge>
              </div>
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-slate-500 absolute left-2.5 top-1/2 -translate-y-1/2" />
                <Input
                  value={query}
                  onChange={(e: any) => setQuery(e.target.value)}
                  placeholder="Search inquiries"
                  className="pl-8 text-sm w-56"
                />
              </div>
            </div>
          }
        />
        <CardBody className="p-0 pt-2 flex-1 flex flex-col min-h-0">
          <div className="flex-1 overflow-y-auto min-h-0">
            <table className="w-full">
              <thead className="sticky top-0 bg-orbit-surface z-10 shadow-sm">
                <tr className="border-b border-orbit-border">
                  {['Client', 'Event', 'Message', 'Status', 'Received', ''].map(col => (
                    <th key={col} className="text-left text-[11px] font-semibold text-slate-600 uppercase tracking-wider px-5 pb-3 pt-3">
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-orbit-border">
                {currentItems.map((inq, i) => (
                  <motion.tr
                    key={inq.id}
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.03 }}
                    className="hover:bg-white/2 transition-colors"
                  >
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-3">
                        <Avatar initials={inq.name.slice(0, 2).toUpperCase()} size="sm" />
                        <div>
                          <p className="text-sm text-slate-200 font-medium">{inq.name}</p>
                          <p className="text-xs text-slate-500 flex items-center gap-1">
                            <Phone className="w-3 h-3" /> +91 {inq.phone}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3">
                      <p className="text-sm text-slate-300">{inq.service}</p>
                      <p className="text-xs text-slate-500">{inq.eventInfo || '—'}</p>
                    </td>
                    <td className="px-5 py-3 max-w-xs">
                      <p className="text-sm text-slate-400 truncate" title={inq.message}>
                        {inq.message || '—'}
                      </p>
                    </td>
                    <td className="px-5 py-3">
                      <button onClick={() => cycleStatus(inq.id)}>
                        <Badge variant={statusConfig(inq.status).variant} dot>
                          {statusConfig(inq.status).label}
                        </Badge>
                      </button>
                    </td>
                    <td className="px-5 py-3 text-sm text-slate-400 whitespace-nowrap">
                      {new Date(inq.submittedAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                    </td>
                    <td className="px-5 py-3">
                      <button
                        onClick={() => handleDelete(inq.id)}
                        className="p-1.5 rounded-md text-slate-500 hover:text-red-400 hover:bg-white/5 transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>

            {filtered.length === 0 && (
              <p className="text-xs text-slate-600 text-center py-10">
                {inquiries.length === 0 ? 'No inquiries yet.' : 'No inquiries found.'}
              </p>
            )}
          </div>

          {/* Pagination — pinned to the bottom of the card, always visible */}
          {filtered.length > 0 && (
            <div className="flex-shrink-0 flex items-center justify-between px-5 py-3 border-t border-orbit-border bg-orbit-surface">
              <div className="text-xs text-slate-500">
                Showing {startIndex + 1}–{Math.min(endIndex, filtered.length)} of {filtered.length}
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={goToPrevious}
                  disabled={currentPage === 1}
                  className="p-1.5 rounded-md border border-orbit-border text-slate-400 hover:text-slate-200 hover:bg-white/5 transition-colors disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-transparent"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                </button>

                {getPageNumbers()[0] > 1 && (
                  <>
                    <button
                      onClick={() => goToPage(1)}
                      className="w-7 h-7 flex items-center justify-center rounded-md text-xs text-slate-400 hover:bg-white/5 hover:text-slate-200 transition-colors"
                    >
                      1
                    </button>
                    <span className="text-slate-600 text-xs px-0.5">…</span>
                  </>
                )}

                {getPageNumbers().map(page => (
                  <button
                    key={page}
                    onClick={() => goToPage(page)}
                    className={cn(
                      'w-7 h-7 flex items-center justify-center rounded-md text-xs font-medium transition-colors',
                      currentPage === page
                        ? 'bg-orbit-primary text-white'
                        : 'text-slate-400 hover:bg-white/5 hover:text-slate-200'
                    )}
                  >
                    {page}
                  </button>
                ))}

                {getPageNumbers()[getPageNumbers().length - 1] < totalPages && (
                  <>
                    <span className="text-slate-600 text-xs px-0.5">…</span>
                    <button
                      onClick={() => goToPage(totalPages)}
                      className="w-7 h-7 flex items-center justify-center rounded-md text-xs text-slate-400 hover:bg-white/5 hover:text-slate-200 transition-colors"
                    >
                      {totalPages}
                    </button>
                  </>
                )}

                <button
                  onClick={goToNext}
                  disabled={currentPage === totalPages}
                  className="p-1.5 rounded-md border border-orbit-border text-slate-400 hover:text-slate-200 hover:bg-white/5 transition-colors disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-transparent"
                >
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}
        </CardBody>
      </Card>
    </div>
  )
}

export default AdminInquiries