import { useState } from 'react'
import {
  Search, Play, Plus, Trash2, Upload, X, Save, Sparkles, Video, ImageIcon
} from 'lucide-react'
import { Card, CardHeader, CardBody, Input } from '@/components/ui'
import { cn } from '@/utils/cn'

type Orientation = 'Vertical' | 'Horizontal' | 'Square'

interface GalleryItem {
  id: string
  image: string
  orientation: Orientation
  category: string
  title: string
  credit: string
  isReel: boolean
}

interface GalleryData {
  eyebrow: string
  headingLine1: string
  headingLine2: string
  description: string
  categories: string[]
  items: GalleryItem[]
}

const STORAGE_KEY = 'gallery_section_data'

const defaults: GalleryData = {
  eyebrow: 'Our Work',
  headingLine1: 'Frames Worth',
  headingLine2: 'Remembering',
  description: 'Portraits, wide candid frames and cinematic reels — all in one story wall.',
  categories: ['Wedding', 'Pre Wedding', 'Portrait', 'Fashion', 'Kids'],
  items: [
    { id: 'g1', image: '', orientation: 'Vertical', category: 'Pre Wedding', title: '', credit: '', isReel: false },
    { id: 'g2', image: '', orientation: 'Vertical', category: 'Wedding', title: '', credit: 'Kiran Hiwale Photography', isReel: false },
    { id: 'g3', image: '', orientation: 'Vertical', category: 'Kids', title: 'Kids Story 4', credit: 'Kiran Hiwale Photography', isReel: false },
    { id: 'g4', image: '', orientation: 'Vertical', category: 'Kids', title: '', credit: 'Kiran Hiwale Photography', isReel: true },
  ],
}

const orientationAspect: Record<Orientation, string> = {
  Vertical: 'aspect-[4/5]',
  Horizontal: 'aspect-[16/10]',
  Square: 'aspect-square',
}

function GalleryImageSlot({ id, value, onChange, isReel }: { id: string; value: string; onChange: (v: string) => void; isReel: boolean }) {
  const handleFile = (file: File | undefined) => {
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => onChange(reader.result as string)
    reader.readAsDataURL(file)
  }

  return (
    <label
      htmlFor={id}
      className="relative block w-full aspect-[4/5] rounded-lg overflow-hidden border border-dashed border-orbit-border bg-white/[0.02] cursor-pointer group"
    >
      {value ? (
        <img src={value} className="w-full h-full object-cover" />
      ) : (
        <div className="w-full h-full flex flex-col items-center justify-center gap-1.5 text-slate-600">
          {isReel ? <Video className="w-4 h-4" /> : <ImageIcon className="w-4 h-4" />}
          <span className="text-[10px]">Click to upload {isReel ? 'thumbnail' : 'photo'}</span>
        </div>
      )}
      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/45 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
        <span className="text-[11px] text-white flex items-center gap-1.5 font-medium">
          <Upload className="w-3.5 h-3.5" /> {value ? 'Replace' : 'Upload'}
        </span>
      </div>
      <input
        id={id}
        type="file"
        accept="image/*"
        className="sr-only"
        onChange={(e) => { handleFile(e.target.files?.[0]); e.target.value = '' }}
      />
    </label>
  )
}

export function AdminGallerySection() {
  const [data, setData] = useState<GalleryData>(() => {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      try {
        return { ...defaults, ...JSON.parse(stored) }
      } catch (e) {
        console.error('Error parsing stored gallery data', e)
      }
    }
    return defaults
  })
  const [saved, setSaved] = useState(false)
  const [activeFilter, setActiveFilter] = useState('All')
  const [newCategory, setNewCategory] = useState('')

  const handleSave = () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
    window.dispatchEvent(new Event('gallery-section-updated'))
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const updateItem = (id: string, patch: Partial<GalleryItem>) => {
    setData(prev => ({ ...prev, items: prev.items.map(it => (it.id === id ? { ...it, ...patch } : it)) }))
    setSaved(false)
  }

  const addItem = () => {
    setData(prev => ({
      ...prev,
      items: [...prev.items, { id: `g_${Date.now()}`, image: '', orientation: 'Vertical', category: prev.categories[0] ?? 'Wedding', title: '', credit: '', isReel: false }],
    }))
    setSaved(false)
  }

  const removeItem = (id: string) => {
    setData(prev => ({ ...prev, items: prev.items.filter(it => it.id !== id) }))
    setSaved(false)
  }

  const addCategory = () => {
    const trimmed = newCategory.trim()
    if (!trimmed || data.categories.includes(trimmed)) return
    setData(prev => ({ ...prev, categories: [...prev.categories, trimmed] }))
    setNewCategory('')
    setSaved(false)
  }

  const removeCategory = (cat: string) => {
    setData(prev => ({ ...prev, categories: prev.categories.filter(c => c !== cat) }))
    setSaved(false)
  }

  const filteredItems = data.items.filter(it => {
    if (activeFilter === 'All') return true
    if (activeFilter === 'Reels') return it.isReel
    return it.category === activeFilter
  })

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="p-4 sm:p-6">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h1 className="text-lg font-semibold text-slate-200">Gallery Section</h1>
            <p className="text-xs text-slate-500 mt-0.5">Category-filterable frame wall shown on your homepage</p>
          </div>
          <button
            onClick={handleSave}
            className={cn(
              'flex items-center gap-1.5 px-4 h-8 rounded-md text-xs font-medium transition-colors',
              saved ? 'bg-emerald-600 text-white' : 'bg-orbit-primary text-white hover:opacity-90'
            )}
          >
            <Save className="w-3.5 h-3.5" /> {saved ? 'Saved' : 'Save Changes'}
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <Card>
            <CardHeader title="Section Heading" subtitle="Eyebrow, title and description" />
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
              <div>
                <label className="text-[11px] text-slate-500 block mb-1">Description</label>
                <textarea
                  value={data.description}
                  onChange={(e) => setData(prev => ({ ...prev, description: e.target.value }))}
                  rows={2}
                  className="w-full bg-transparent border border-orbit-border rounded-md px-3 py-2 text-sm text-slate-200 resize-none"
                />
              </div>
            </CardBody>
          </Card>

          <Card>
            <CardHeader title="Filter Categories" subtitle="Pills shown next to the heading" />
            <CardBody className="pt-2">
              <div className="flex flex-wrap gap-2 mb-3">
                {data.categories.map(cat => (
                  <span key={cat} className="flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-orbit-border text-xs text-slate-300">
                    {cat}
                    <button onClick={() => removeCategory(cat)} className="text-slate-500 hover:text-red-400">
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
                {data.categories.length === 0 && <span className="text-xs text-slate-600">No categories yet.</span>}
              </div>
              <div className="flex gap-2">
                <Input
                  value={newCategory}
                  onChange={(e: any) => setNewCategory(e.target.value)}
                  onKeyDown={(e: any) => e.key === 'Enter' && addCategory()}
                  placeholder="New category name"
                  className="text-sm flex-1"
                />
                <button onClick={addCategory} className="flex items-center gap-1.5 px-3 h-8 rounded-md border border-orbit-border text-slate-300 text-xs hover:bg-white/5 transition-colors">
                  <Plus className="w-3.5 h-3.5" /> Add
                </button>
              </div>
              <p className="text-[10px] text-slate-600 mt-2">"All" and "Reels" pills are automatic — Reels shows any item flagged as a reel below.</p>
            </CardBody>
          </Card>
        </div>

        <Card>
          <CardHeader
            title="Gallery Items"
            subtitle={`${data.items.length} items`}
            actions={
              <button
                onClick={addItem}
                className="flex items-center gap-1.5 px-3 h-7 rounded-md bg-orbit-primary text-white text-xs font-medium hover:opacity-90 transition-opacity"
              >
                <Plus className="w-3.5 h-3.5" /> Add Item
              </button>
            }
          />
          <CardBody className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 pt-2">
            {data.items.map(item => (
              <div key={item.id} className="border border-orbit-border rounded-lg p-3 space-y-2.5 relative">
                <button
                  onClick={() => removeItem(item.id)}
                  className="absolute top-2 right-2 z-10 w-6 h-6 rounded-full bg-black/50 text-white flex items-center justify-center hover:bg-red-500/80 transition-colors"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
                <GalleryImageSlot id={`gal-img-${item.id}`} value={item.image} onChange={(v) => updateItem(item.id, { image: v })} isReel={item.isReel} />

                <div>
                  <label className="text-[11px] text-slate-500 block mb-1">Orientation</label>
                  <div className="flex gap-1">
                    {(['Vertical', 'Horizontal', 'Square'] as Orientation[]).map(o => (
                      <button
                        key={o}
                        onClick={() => updateItem(item.id, { orientation: o })}
                        className={cn(
                          'flex-1 px-2 py-1 rounded-md text-[10px] font-medium border transition-colors',
                          item.orientation === o
                            ? 'bg-orbit-primary text-white border-orbit-primary'
                            : 'border-orbit-border text-slate-400 hover:bg-white/5'
                        )}
                      >
                        {o}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-[11px] text-slate-500 block mb-1">Category</label>
                  <select
                    value={item.category}
                    onChange={(e) => updateItem(item.id, { category: e.target.value })}
                    className="w-full bg-transparent border border-orbit-border rounded-md px-2 py-1.5 text-xs text-slate-200"
                  >
                    {data.categories.map(cat => (
                      <option key={cat} value={cat} className="bg-orbit-surface">{cat}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-[11px] text-slate-500 block mb-1">Overlay title (optional)</label>
                  <Input value={item.title} onChange={(e: any) => updateItem(item.id, { title: e.target.value })} className="text-xs" placeholder="e.g. Kids Story 4" />
                </div>

                <div>
                  <label className="text-[11px] text-slate-500 block mb-1">Credit text (optional)</label>
                  <Input value={item.credit} onChange={(e: any) => updateItem(item.id, { credit: e.target.value })} className="text-xs" placeholder="e.g. Kiran Hiwale Photography" />
                </div>

                <label className="flex items-center gap-2 pt-1">
                  <input type="checkbox" checked={item.isReel} onChange={(e) => updateItem(item.id, { isReel: e.target.checked })} className="accent-orbit-primary" />
                  <span className="text-xs text-slate-400">This is a reel / video</span>
                </label>
              </div>
            ))}
            {data.items.length === 0 && (
              <p className="text-xs text-slate-600 col-span-full text-center py-6">No gallery items yet — click "Add Item" to create one.</p>
            )}
          </CardBody>
        </Card>
      </div>

      {/* LIVE PREVIEW */}
      <div className="mt-2">
        <div className="flex items-center justify-between px-4 sm:px-6 py-3 border-y border-orbit-border bg-orbit-surface">
          <h2 className="text-sm font-semibold text-slate-200">Live Preview</h2>
          <span className="flex items-center gap-1.5 text-[11px] text-slate-500">
            <Sparkles className="w-3 h-3 text-orbit-primary" /> Click a pill to filter
          </span>
        </div>

        <div className="w-full bg-[#f2e9dc] py-16 sm:py-20">
          <div className="max-w-[1700px] mx-auto px-6 sm:px-12 lg:px-16">
            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-10">
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-6 h-px" style={{ backgroundColor: '#5c1a26' }} />
                  <span className="text-xs font-semibold tracking-[0.15em] uppercase" style={{ color: '#c9781f' }}>
                    {data.eyebrow}
                  </span>
                </div>
                <h2 className="font-serif text-[#2b2117] text-4xl sm:text-5xl leading-[1.05] mb-3">
                  {data.headingLine1}<br />{data.headingLine2}
                </h2>
                <p className="text-sm text-[#6b5f52] max-w-md">{data.description}</p>
              </div>

              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setActiveFilter('All')}
                  className={cn(
                    'px-4 py-2 rounded-full text-xs font-semibold uppercase tracking-wide transition-colors',
                    activeFilter === 'All' ? 'text-white' : 'bg-white text-[#2b2117] hover:bg-[#eee5d4]'
                  )}
                  style={activeFilter === 'All' ? { backgroundColor: '#5c1a26' } : undefined}
                >
                  All
                </button>
                {data.categories.map(cat => (
                  <button
                    key={cat}
                    onClick={() => setActiveFilter(cat)}
                    className={cn(
                      'px-4 py-2 rounded-full text-xs font-semibold uppercase tracking-wide transition-colors',
                      activeFilter === cat ? 'text-white' : 'bg-white text-[#2b2117] hover:bg-[#eee5d4]'
                    )}
                    style={activeFilter === cat ? { backgroundColor: '#5c1a26' } : undefined}
                  >
                    {cat}
                  </button>
                ))}
                <button
                  onClick={() => setActiveFilter('Reels')}
                  className={cn(
                    'flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-semibold uppercase tracking-wide border transition-colors',
                    activeFilter === 'Reels' ? 'text-white' : 'bg-white text-[#2b2117] hover:bg-[#eee5d4]'
                  )}
                  style={activeFilter === 'Reels' ? { backgroundColor: '#5c1a26', borderColor: '#5c1a26' } : { borderColor: '#c9a24a' }}
                >
                  <Play className="w-2.5 h-2.5 fill-current" /> Reels
                </button>
              </div>
            </div>

            <div className="columns-1 sm:columns-2 xl:columns-4 gap-6 [column-fill:_balance]">
              {filteredItems.map(item => (
                <div
                  key={item.id}
                  className={cn(
                    'relative rounded-2xl overflow-hidden bg-[#e5dccb] mb-6 break-inside-avoid group cursor-pointer',
                    orientationAspect[item.orientation]
                  )}
                >
                  {item.image ? (
                    <img src={item.image} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-[#a89b87] text-xs">No photo yet</div>
                  )}

                  {/* orientation tag */}
                  <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-white/85 text-[10px] font-semibold uppercase tracking-wide text-[#2b2117]">
                    {item.orientation}
                  </span>

                  {/* credit line */}
                  {item.credit && !item.isReel && (
                    <span className="absolute top-9 left-3 text-[9px] text-white/80 font-medium drop-shadow">
                      {item.credit}
                    </span>
                  )}

                  {item.isReel ? (
                    <>
                      <div className="absolute inset-0 bg-black/25" />
                      <div className="absolute top-3 left-3 right-3 flex gap-1">
                        <div className="h-0.5 flex-1 bg-white/90 rounded-full" />
                        <div className="h-0.5 flex-1 bg-white/40 rounded-full" />
                        <div className="h-0.5 flex-1 bg-white/40 rounded-full" />
                      </div>
                      <span className="absolute top-3 right-3 px-2 py-0.5 rounded-full text-[9px] font-semibold uppercase" style={{ backgroundColor: '#c9781f', color: 'white' }}>
                        Reel
                      </span>
                      {item.credit && (
                        <span className="absolute top-9 left-3 text-[9px] text-white/80 font-medium">{item.credit}</span>
                      )}
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-11 h-11 rounded-full flex items-center justify-center" style={{ backgroundColor: '#e0a83c' }}>
                          <Play className="w-4 h-4 text-white fill-white ml-0.5" />
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                      <div className="w-9 h-9 rounded-full bg-white/90 flex items-center justify-center">
                        <Search className="w-3.5 h-3.5 text-[#2b2117]" />
                      </div>
                    </div>
                  )}

                  {item.title && (
                    <div className="absolute left-3 bottom-3 right-3">
                      <span className="inline-block px-2 py-0.5 rounded-full text-[9px] font-semibold uppercase tracking-wide mb-1.5" style={{ backgroundColor: '#5c1a26', color: 'white' }}>
                        {item.category}
                      </span>
                      <p className="font-serif text-white text-lg">{item.title}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {filteredItems.length === 0 && (
              <p className="text-sm text-[#8a7a68] text-center py-16">No items in this category yet.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminGallerySection