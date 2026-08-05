import { useState } from 'react'
import { Save, Sparkles, Upload, Plus, X, Instagram, Phone, Camera, Video, PenLine, Share2 } from 'lucide-react'
import { Card, CardHeader, CardBody, Input } from '@/components/ui'
import { cn } from '@/utils/cn'

interface TeamMember {
  id: string
  photo: string
  name: string
  role: string
  instagramHandle: string
  phone: string
}

interface TeamData {
  eyebrow: string
  headingLine1: string
  headingLine2: string
  description: string
  quote: string
  tagline: string
  members: TeamMember[]
}

const STORAGE_KEY = 'team_section_data'

const defaults: TeamData = {
  eyebrow: 'Meet The Team',
  headingLine1: 'The Hands Behind',
  headingLine2: 'Every Frame',
  description: 'A small, dedicated crew of photographers, filmmakers and editors — each one obsessed with getting your story right.',
  quote: 'We don\u2019t just take photos, we create memories.',
  tagline: 'Different minds. One vision. Your story.',
  members: [
    { id: 'm1', photo: '', name: 'Kiran Hiwale', role: 'Lead Photographer & Founder', instagramHandle: '@kiranhiwale', phone: '9673111013' },
    { id: 'm2', photo: '', name: 'Mangesh Kurne', role: 'Cinematographer', instagramHandle: '@mangeshkurne', phone: '9604626431' },
    { id: 'm3', photo: '', name: 'Riya Deshmukh', role: 'Lead Editor', instagramHandle: '@riyaedits', phone: '' },
    { id: 'm4', photo: '', name: 'Ankit Sharma', role: 'Drone & Second Shooter', instagramHandle: '', phone: '' },
  ],
}

// Pick a badge icon that reflects what the person actually does.
function roleIcon(role: string) {
  const r = role.toLowerCase()
  if (r.includes('cinema') || r.includes('film') || r.includes('video')) return Video
  if (r.includes('edit')) return PenLine
  if (r.includes('drone') || r.includes('second')) return Share2
  return Camera
}

function TeamPhotoSlot({ id, value, onChange }: { id: string; value: string; onChange: (v: string) => void }) {
  const handleFile = (file: File | undefined) => {
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => onChange(reader.result as string)
    reader.readAsDataURL(file)
  }

  return (
    <label htmlFor={id} className="relative block w-full aspect-[4/5] rounded-lg overflow-hidden border border-dashed border-orbit-border bg-white/[0.02] cursor-pointer group">
      {value ? (
        <img src={value} className="w-full h-full object-cover" />
      ) : (
        <div className="w-full h-full flex flex-col items-center justify-center gap-1.5 text-slate-600">
          <Upload className="w-4 h-4" />
          <span className="text-[10px]">Click to upload</span>
        </div>
      )}
      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/45 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
        <span className="text-[11px] text-white flex items-center gap-1.5 font-medium">
          <Upload className="w-3.5 h-3.5" /> {value ? 'Replace' : 'Upload'}
        </span>
      </div>
      <input id={id} type="file" accept="image/*" className="sr-only" onChange={(e) => { handleFile(e.target.files?.[0]); e.target.value = '' }} />
    </label>
  )
}

export function AdminTeamSection() {
  const [data, setData] = useState<TeamData>(() => {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      try { return { ...defaults, ...JSON.parse(stored) } } catch (e) { console.error('Error parsing stored team data', e) }
    }
    return defaults
  })
  const [saved, setSaved] = useState(false)

  const handleSave = () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
    window.dispatchEvent(new Event('team-section-updated'))
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const updateMember = (id: string, patch: Partial<TeamMember>) => {
    setData(prev => ({ ...prev, members: prev.members.map(m => (m.id === id ? { ...m, ...patch } : m)) }))
    setSaved(false)
  }

  const addMember = () => {
    setData(prev => ({ ...prev, members: [...prev.members, { id: `m_${Date.now()}`, photo: '', name: 'New Member', role: 'Role', instagramHandle: '', phone: '' }] }))
    setSaved(false)
  }

  const removeMember = (id: string) => {
    setData(prev => ({ ...prev, members: prev.members.filter(m => m.id !== id) }))
    setSaved(false)
  }

  return (
    <div className="flex-1 overflow-y-auto">
      {/* Script font used only in the live preview, to mirror the studio's brand typography */}
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Caveat:wght@600;700&display=swap');`}</style>

      <div className="p-4 sm:p-6">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h1 className="text-lg font-semibold text-slate-200">Our Team Section</h1>
            <p className="text-xs text-slate-500 mt-0.5">Team grid shown on your homepage / about page</p>
          </div>
          <button
            onClick={handleSave}
            className={cn('flex items-center gap-1.5 px-4 h-8 rounded-md text-xs font-medium transition-colors', saved ? 'bg-emerald-600 text-white' : 'bg-orbit-primary text-white hover:opacity-90')}
          >
            <Save className="w-3.5 h-3.5" /> {saved ? 'Saved' : 'Save Changes'}
          </button>
        </div>

        <Card className="mb-4">
          <CardHeader title="Section Heading" subtitle="Eyebrow, title and intro line" />
          <CardBody className="space-y-3 pt-2">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="text-[11px] text-slate-500 block mb-1">Eyebrow label</label>
                <Input value={data.eyebrow} onChange={(e: any) => setData(prev => ({ ...prev, eyebrow: e.target.value }))} className="text-sm" />
              </div>
              <div>
                <label className="text-[11px] text-slate-500 block mb-1">Heading line 1</label>
                <Input value={data.headingLine1} onChange={(e: any) => setData(prev => ({ ...prev, headingLine1: e.target.value }))} className="text-sm" />
              </div>
              <div>
                <label className="text-[11px] text-slate-500 block mb-1">Heading line 2 (script accent)</label>
                <Input value={data.headingLine2} onChange={(e: any) => setData(prev => ({ ...prev, headingLine2: e.target.value }))} className="text-sm" />
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] text-slate-500 block mb-1">Description</label>
                <textarea
                  value={data.description}
                  onChange={(e) => setData(prev => ({ ...prev, description: e.target.value }))}
                  rows={2}
                  className="w-full bg-transparent border border-orbit-border rounded-md px-3 py-2 text-sm text-slate-200 resize-none"
                />
              </div>
              <div>
                <label className="text-[11px] text-slate-500 block mb-1">Pull quote (shown top right)</label>
                <textarea
                  value={data.quote}
                  onChange={(e) => setData(prev => ({ ...prev, quote: e.target.value }))}
                  rows={2}
                  className="w-full bg-transparent border border-orbit-border rounded-md px-3 py-2 text-sm text-slate-200 resize-none"
                />
              </div>
            </div>
            <div>
              <label className="text-[11px] text-slate-500 block mb-1">Closing tagline (script, bottom of section)</label>
              <Input value={data.tagline} onChange={(e: any) => setData(prev => ({ ...prev, tagline: e.target.value }))} className="text-sm" />
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardHeader
            title="Team Members"
            subtitle={`${data.members.length} members`}
            actions={
              <button onClick={addMember} className="flex items-center gap-1.5 px-3 h-7 rounded-md bg-orbit-primary text-white text-xs font-medium hover:opacity-90 transition-opacity">
                <Plus className="w-3.5 h-3.5" /> Add Member
              </button>
            }
          />
          <CardBody className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 pt-2">
            {data.members.map(member => (
              <div key={member.id} className="border border-orbit-border rounded-lg p-3 space-y-2.5 relative">
                <button onClick={() => removeMember(member.id)} className="absolute top-2 right-2 z-10 w-6 h-6 rounded-full bg-black/50 text-white flex items-center justify-center hover:bg-red-500/80 transition-colors">
                  <X className="w-3.5 h-3.5" />
                </button>
                <TeamPhotoSlot id={`team-photo-${member.id}`} value={member.photo} onChange={(v) => updateMember(member.id, { photo: v })} />
                <div>
                  <label className="text-[11px] text-slate-500 block mb-1">Name</label>
                  <Input value={member.name} onChange={(e: any) => updateMember(member.id, { name: e.target.value })} className="text-sm" />
                </div>
                <div>
                  <label className="text-[11px] text-slate-500 block mb-1">Role</label>
                  <Input value={member.role} onChange={(e: any) => updateMember(member.id, { role: e.target.value })} className="text-sm" />
                  <p className="text-[10px] text-slate-600 mt-1">Badge icon is picked automatically from the role (photographer / cinematographer / editor / drone).</p>
                </div>
                <div>
                  <label className="text-[11px] text-slate-500 block mb-1">Instagram handle (optional)</label>
                  <Input value={member.instagramHandle} onChange={(e: any) => updateMember(member.id, { instagramHandle: e.target.value })} className="text-xs" placeholder="@handle" />
                </div>
                <div>
                  <label className="text-[11px] text-slate-500 block mb-1">Phone (optional)</label>
                  <Input value={member.phone} onChange={(e: any) => updateMember(member.id, { phone: e.target.value })} className="text-xs" />
                </div>
              </div>
            ))}
            {data.members.length === 0 && (
              <p className="text-xs text-slate-600 col-span-full text-center py-6">No team members yet — click "Add Member" to create one.</p>
            )}
          </CardBody>
        </Card>
      </div>

      {/* LIVE PREVIEW */}
      <div className="mt-2">
        <div className="flex items-center justify-between px-4 sm:px-6 py-3 border-y border-orbit-border bg-orbit-surface">
          <h2 className="text-sm font-semibold text-slate-200">Live Preview</h2>
          <span className="flex items-center gap-1.5 text-[11px] text-slate-500">
            <Sparkles className="w-3 h-3 text-orbit-primary" /> Auto-updating
          </span>
        </div>

        <div className="relative w-full overflow-hidden py-16 sm:py-24" style={{ backgroundColor: '#f4ead9' }}>
          {/* watermark camera sketch, top left */}
          <svg
            viewBox="0 0 200 140"
            className="absolute -top-6 -left-10 w-56 sm:w-72 opacity-[0.08] pointer-events-none select-none"
            style={{ transform: 'rotate(-8deg)', color: '#2b2117' }}
            fill="none" stroke="currentColor" strokeWidth="2.2"
          >
            <rect x="20" y="40" width="140" height="80" rx="10" />
            <path d="M55 40 L70 22 H110 L125 40" />
            <circle cx="90" cy="82" r="30" />
            <circle cx="90" cy="82" r="18" />
            <rect x="138" y="52" width="16" height="10" rx="2" />
          </svg>

          <div className="relative max-w-[1500px] mx-auto px-6 sm:px-12 lg:px-16">
            {/* header row */}
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-10 mb-14">
              <div className="max-w-2xl">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-xs" style={{ color: '#8a7256' }}>•</span>
                  <span className="text-xs font-semibold tracking-[0.25em] uppercase" style={{ color: '#8a7256' }}>{data.eyebrow}</span>
                  <span className="text-xs" style={{ color: '#8a7256' }}>•</span>
                </div>
                <h2 className="font-serif text-[#2b2117] text-4xl sm:text-5xl leading-[1.1] mb-4">
                  {data.headingLine1}
                  <br />
                  <span style={{ fontFamily: "'Caveat', cursive", color: '#c9781f' }} className="text-5xl sm:text-6xl font-bold">
                    {data.headingLine2}
                  </span>
                </h2>
                <p className="text-base leading-relaxed" style={{ color: '#6b5f52' }}>{data.description}</p>
              </div>

              {/* quote block */}
              <div className="relative pl-5 border-l" style={{ borderColor: '#d9cbb0' }}>
                <span className="block text-4xl leading-none mb-1" style={{ color: '#c9781f', fontFamily: 'Georgia, serif' }}>&ldquo;</span>
                <p className="text-sm leading-relaxed" style={{ color: '#5c4f40' }}>
                  {data.quote.split(/(memories\.?)$/i).map((chunk, i) =>
                    /memories\.?$/i.test(chunk) ? (
                      <span key={i} style={{ fontFamily: "'Caveat', cursive", color: '#c9781f' }} className="text-lg font-semibold">
                        {chunk}
                      </span>
                    ) : (
                      <span key={i}>{chunk}</span>
                    )
                  )}
                </p>

                {/* dot grid flourish */}
                <div className="hidden sm:grid grid-cols-4 gap-1.5 absolute -top-2 right-0">
                  {Array.from({ length: 12 }).map((_, i) => (
                    <span key={i} className="w-1 h-1 rounded-full" style={{ backgroundColor: '#c9a877' }} />
                  ))}
                </div>
              </div>
            </div>

            {/* divider with camera icon */}
            <div className="flex items-center gap-4 mb-12">
              <div className="flex-1 h-px" style={{ backgroundColor: '#d9cbb0' }} />
              <span className="w-8 h-8 rounded-full flex items-center justify-center border" style={{ borderColor: '#d9cbb0', color: '#8a7256' }}>
                <Camera className="w-3.5 h-3.5" />
              </span>
              <div className="flex-1 h-px" style={{ backgroundColor: '#d9cbb0' }} />
            </div>

            {/* team grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-8 sm:gap-6">
              {data.members.map((member, i) => {
                const Icon = roleIcon(member.role)
                const featured = i === 1
                return (
                  <div key={member.id} className={cn('relative pt-2', featured && 'sm:-mt-4')}>
                    {/* offset blob behind the photo for depth */}
                    <div
                      className="absolute -bottom-3 -left-3 w-full h-full"
                      style={{
                        borderRadius: '120px 20px 24px 20px',
                        backgroundColor: featured ? '#e7c9a3' : '#ddd2ba',
                      }}
                    />

                    <div className="relative">
                      {/* badge icon */}
                      <span
                        className="absolute -top-3 -left-3 z-20 w-10 h-10 rounded-full flex items-center justify-center shadow-md"
                        style={{ backgroundColor: '#3f2b1d' }}
                      >
                        <Icon className="w-4 h-4 text-white" />
                      </span>

                      {/* photo */}
                      <div
                        className="relative z-10 aspect-[4/5] overflow-hidden border"
                        style={{
                          borderRadius: '120px 20px 24px 20px',
                          borderColor: featured ? '#c9781f' : 'transparent',
                          backgroundColor: '#e5dccb',
                        }}
                      >
                        {member.photo ? (
                          <img src={member.photo} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-[#a89b87] text-xs">No photo yet</div>
                        )}

                        {featured && (
                          <svg viewBox="0 0 100 60" className="absolute bottom-2 right-2 w-16 opacity-70 pointer-events-none" fill="#ffffff">
                            <path d="M2 40 C 20 10, 45 55, 65 20 S 95 5, 98 25 L 98 55 L 2 55 Z" />
                          </svg>
                        )}
                      </div>

                      {/* info panel */}
                      <div className="relative z-10 bg-white rounded-b-2xl px-4 pt-4 pb-4 text-center -mt-1 shadow-sm">
                        <h3 className="font-serif text-lg text-[#2b2117] mb-1">{member.name}</h3>
                        <p className="text-[11px] font-semibold uppercase tracking-wider mb-3" style={{ color: '#c9781f' }}>{member.role}</p>

                        {(member.instagramHandle || member.phone) && (
                          <>
                            <div className="w-8 h-px mx-auto mb-3" style={{ backgroundColor: '#e5d9c3' }} />
                            <div className="flex items-center justify-center gap-2">
                              {member.instagramHandle && (
                                <span
                                  className="w-8 h-8 rounded-full flex items-center justify-center border"
                                  style={{ borderColor: '#e3c9a8', color: '#7a5230' }}
                                >
                                  <Instagram className="w-3.5 h-3.5" />
                                </span>
                              )}
                              {member.phone && (
                                <span
                                  className="w-8 h-8 rounded-full flex items-center justify-center border"
                                  style={{ borderColor: '#e3c9a8', color: '#7a5230' }}
                                >
                                  <Phone className="w-3.5 h-3.5" />
                                </span>
                              )}
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>

            {data.members.length === 0 && (
              <p className="text-sm text-[#8a7a68] text-center py-16">No team members to show yet.</p>
            )}

            {/* closing tagline */}
            {data.tagline && (
              <div className="flex items-center justify-center gap-4 mt-16">
                <span className="w-10 h-px" style={{ backgroundColor: '#d9cbb0' }} />
                <span className="text-[10px]" style={{ color: '#c9a877' }}>●</span>
                <p style={{ fontFamily: "'Caveat', cursive", color: '#c9781f' }} className="text-2xl font-semibold">
                  {data.tagline}
                </p>
                <span className="text-[10px]" style={{ color: '#c9a877' }}>●</span>
                <span className="w-10 h-px" style={{ backgroundColor: '#d9cbb0' }} />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminTeamSection