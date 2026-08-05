import { useState } from 'react'
import { Save, Sparkles, Upload, Plus, X } from 'lucide-react'
import { Card, CardHeader, CardBody, Input } from '@/components/ui'
import { cn } from '@/utils/cn'

interface StatItem {
  id: string
  value: string
  label: string
}

interface AboutData {
  eyebrow: string
  headingLine1: string
  headingLine2: string
  descBeforeName: string
  highlightName: string
  descAfterName: string
  quoteText: string
  stats: StatItem[]
  buttonText: string
  posterImage: string
  storefrontImage: string
}

const STORAGE_KEY = 'about_section_data'

const defaults: AboutData = {
  eyebrow: 'About Us',
  headingLine1: 'The Studio Behind',
  headingLine2: 'the Stories',
  descBeforeName: 'Lagngatha Photo & Films is led by',
  highlightName: 'Kiran Hiwale',
  descAfterName: "of Mk Photography — built on the belief that a wedding isn't a checklist of poses, it's a story already unfolding, and our job is to tell it honestly.",
  quoteText: "From the first haldi morning to the last dance of the reception, we shoot candid, we shoot cinematic, and we shoot with the same care whether it's 50 guests or 500.",
  stats: [
    { id: 's1', value: '200+', label: 'Weddings Shot' },
    { id: 's2', value: '8+', label: 'Years in Business' },
    { id: 's3', value: '3,698+', label: 'Instagram Family' },
  ],
  buttonText: 'Meet the Team',
  posterImage: '',
  storefrontImage: '',
}

function CollageImageSlot({ id, value, onChange, className }: { id: string; value: string; onChange: (v: string) => void; className: string }) {
  const handleFile = (file: File | undefined) => {
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => onChange(reader.result as string)
    reader.readAsDataURL(file)
  }

  return (
    <label
      htmlFor={id}
      className={cn('group absolute overflow-hidden rounded-xl shadow-xl bg-[#e5dccb] border-4 border-white cursor-pointer', className)}
    >
      {value ? (
        <img src={value} className="w-full h-full object-cover" />
      ) : (
        <div className="w-full h-full flex items-center justify-center text-[#a89b87] text-xs text-center px-2">Click to upload</div>
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

export function AdminAboutSection() {
  const [data, setData] = useState<AboutData>(() => {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      try { return { ...defaults, ...JSON.parse(stored) } } catch (e) { console.error('Error parsing stored about data', e) }
    }
    return defaults
  })
  const [saved, setSaved] = useState(false)

  const handleSave = () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
    window.dispatchEvent(new Event('about-section-updated'))
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const updateStat = (id: string, patch: Partial<StatItem>) => {
    setData(prev => ({ ...prev, stats: prev.stats.map(s => (s.id === id ? { ...s, ...patch } : s)) }))
    setSaved(false)
  }

  const addStat = () => {
    setData(prev => ({ ...prev, stats: [...prev.stats, { id: `s_${Date.now()}`, value: '0+', label: 'New Stat' }] }))
    setSaved(false)
  }

  const removeStat = (id: string) => {
    setData(prev => ({ ...prev, stats: prev.stats.filter(s => s.id !== id) }))
    setSaved(false)
  }

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="p-4 sm:p-6">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h1 className="text-lg font-semibold text-slate-200">About Us Section</h1>
            <p className="text-xs text-slate-500 mt-0.5">Studio story shown on your homepage — photos edited directly in the preview</p>
          </div>
          <button
            onClick={handleSave}
            className={cn('flex items-center gap-1.5 px-4 h-8 rounded-md text-xs font-medium transition-colors', saved ? 'bg-emerald-600 text-white' : 'bg-orbit-primary text-white hover:opacity-90')}
          >
            <Save className="w-3.5 h-3.5" /> {saved ? 'Saved' : 'Save Changes'}
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <Card>
            <CardHeader title="Heading" subtitle="Eyebrow and two-line title" />
            <CardBody className="space-y-3 pt-2">
              <div>
                <label className="text-[11px] text-slate-500 block mb-1">Eyebrow label</label>
                <Input value={data.eyebrow} onChange={(e: any) => setData(prev => ({ ...prev, eyebrow: e.target.value }))} className="text-sm" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] text-slate-500 block mb-1">Heading line 1</label>
                  <Input value={data.headingLine1} onChange={(e: any) => setData(prev => ({ ...prev, headingLine1: e.target.value }))} className="text-sm" />
                </div>
                <div>
                  <label className="text-[11px] text-slate-500 block mb-1">Heading line 2</label>
                  <Input value={data.headingLine2} onChange={(e: any) => setData(prev => ({ ...prev, headingLine2: e.target.value }))} className="text-sm" />
                </div>
              </div>
            </CardBody>
          </Card>

          <Card>
            <CardHeader title="Button" subtitle="Call-to-action below stats" />
            <CardBody className="pt-2">
              <label className="text-[11px] text-slate-500 block mb-1">Button text</label>
              <Input value={data.buttonText} onChange={(e: any) => setData(prev => ({ ...prev, buttonText: e.target.value }))} className="text-sm" />
            </CardBody>
          </Card>
        </div>

        <Card className="mb-4">
          <CardHeader title="Description" subtitle="One name in the paragraph can be bolded" />
          <CardBody className="space-y-3 pt-2">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="sm:col-span-1">
                <label className="text-[11px] text-slate-500 block mb-1">Text before name</label>
                <Input value={data.descBeforeName} onChange={(e: any) => setData(prev => ({ ...prev, descBeforeName: e.target.value }))} className="text-sm" />
              </div>
              <div>
                <label className="text-[11px] text-slate-500 block mb-1">Bolded name</label>
                <Input value={data.highlightName} onChange={(e: any) => setData(prev => ({ ...prev, highlightName: e.target.value }))} className="text-sm" />
              </div>
              <div>
                <label className="text-[11px] text-slate-500 block mb-1">Text after name</label>
                <Input value={data.descAfterName} onChange={(e: any) => setData(prev => ({ ...prev, descAfterName: e.target.value }))} className="text-sm" />
              </div>
            </div>
            <div>
              <label className="text-[11px] text-slate-500 block mb-1">Pull-quote</label>
              <textarea
                value={data.quoteText}
                onChange={(e) => setData(prev => ({ ...prev, quoteText: e.target.value }))}
                rows={2}
                className="w-full bg-transparent border border-orbit-border rounded-md px-3 py-2 text-sm text-slate-200 resize-none"
              />
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardHeader
            title="Stats"
            subtitle={`${data.stats.length} stats`}
            actions={
              <button onClick={addStat} className="flex items-center gap-1.5 px-3 h-7 rounded-md bg-orbit-primary text-white text-xs font-medium hover:opacity-90 transition-opacity">
                <Plus className="w-3.5 h-3.5" /> Add Stat
              </button>
            }
          />
          <CardBody className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
            {data.stats.map(stat => (
              <div key={stat.id} className="border border-orbit-border rounded-lg p-3 space-y-2 relative">
                <button onClick={() => removeStat(stat.id)} className="absolute top-2 right-2 text-slate-500 hover:text-red-400">
                  <X className="w-3.5 h-3.5" />
                </button>
                <div>
                  <label className="text-[11px] text-slate-500 block mb-1">Value</label>
                  <Input value={stat.value} onChange={(e: any) => updateStat(stat.id, { value: e.target.value })} className="text-sm" />
                </div>
                <div>
                  <label className="text-[11px] text-slate-500 block mb-1">Label</label>
                  <Input value={stat.label} onChange={(e: any) => updateStat(stat.id, { label: e.target.value })} className="text-sm" />
                </div>
              </div>
            ))}
          </CardBody>
        </Card>
      </div>

      {/* LIVE PREVIEW */}
      <div className="mt-2">
        <div className="flex items-center justify-between px-4 sm:px-6 py-3 border-y border-orbit-border bg-orbit-surface">
          <h2 className="text-sm font-semibold text-slate-200">Live Preview</h2>
          <span className="flex items-center gap-1.5 text-[11px] text-slate-500">
            <Sparkles className="w-3 h-3 text-orbit-primary" /> Click a photo below to upload
          </span>
        </div>

        <div className="w-full bg-[#f5eee2] py-16 sm:py-20">
          <div className="max-w-[1500px] mx-auto px-6 sm:px-12 lg:px-16 grid grid-cols-1 lg:grid-cols-[1fr_1.15fr] gap-16 items-center">
            {/* left photo collage */}
            <div className="relative h-[420px] sm:h-[480px]">
              <CollageImageSlot id="about-poster-img" value={data.posterImage} onChange={(v) => setData(prev => ({ ...prev, posterImage: v }))} className="left-0 top-0 w-[78%] h-[88%]" />
              <CollageImageSlot id="about-storefront-img" value={data.storefrontImage} onChange={(v) => setData(prev => ({ ...prev, storefrontImage: v }))} className="right-0 bottom-0 w-[62%] h-[46%] z-10" />
            </div>

            {/* right copy */}
            <div>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-6 h-px" style={{ backgroundColor: '#5c1a26' }} />
                <span className="text-xs font-semibold tracking-[0.15em] uppercase" style={{ color: '#5c1a26' }}>{data.eyebrow}</span>
              </div>
              <h2 className="font-serif text-[#2b2117] text-4xl sm:text-5xl leading-[1.1] mb-5">
                {data.headingLine1}<br />{data.headingLine2}
              </h2>
              <p className="text-base text-[#5a4f43] leading-relaxed mb-6 max-w-xl">
                {data.descBeforeName} <span className="font-semibold text-[#2b2117]">{data.highlightName}</span> {data.descAfterName}
              </p>
              <blockquote className="border-l-2 pl-5 italic text-[#5a4f43] text-base leading-relaxed mb-9 max-w-xl" style={{ borderColor: '#c9781f' }}>
                "{data.quoteText}"
              </blockquote>
              <div className="flex flex-wrap items-center gap-10 mb-8">
                {data.stats.map(stat => (
                  <div key={stat.id}>
                    <p className="font-serif text-3xl" style={{ color: '#7a1f2b' }}>{stat.value}</p>
                    <p className="text-[11px] uppercase tracking-wider text-[#6b5f52] mt-1">{stat.label}</p>
                  </div>
                ))}
              </div>
              <button className="px-6 py-3 rounded-full text-white text-sm font-semibold hover:opacity-90 transition-opacity" style={{ backgroundColor: '#5c1224' }}>
                {data.buttonText}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminAboutSection