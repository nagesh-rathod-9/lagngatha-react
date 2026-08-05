import { useRef, useState } from 'react'
import { ChevronLeft, ChevronRight, Plus, Trash2, Upload, Sparkles, Save, X } from 'lucide-react'
import { Card, CardHeader, CardBody, Input } from '@/components/ui'
import { cn } from '@/utils/cn'

interface StoryCard {
  id: string
  image: string
  category: string
  title: string
}

interface FeaturedStoriesData {
  eyebrow: string
  heading: string
  stories: StoryCard[]
}

const STORAGE_KEY = 'featured_stories_data'

const defaults: FeaturedStoriesData = {
  eyebrow: 'Recently Told',
  heading: 'Featured Wedding Stories',
  stories: [
    { id: 'story_1', image: '', category: 'Wedding Film', title: 'Sanket & Shraddha, Sambhajinagar' },
    { id: 'story_2', image: '', category: 'Outdoors', title: 'Bhavesh & Nikita, Gangapur' },
    { id: 'story_3', image: '', category: 'Reception', title: 'Riya & Ankit, Pune' },
  ],
}

function StoryImageSlot({ id, value, onChange }: { id: string; value: string; onChange: (v: string) => void }) {
  const handleFile = (file: File | undefined) => {
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => onChange(reader.result as string)
    reader.readAsDataURL(file)
  }

  return (
    <label
      htmlFor={id}
      className="relative block w-full aspect-video rounded-lg overflow-hidden border border-dashed border-orbit-border bg-white/[0.02] cursor-pointer group"
    >
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

export function AdminFeaturedStories() {
  const [data, setData] = useState<FeaturedStoriesData>(() => {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      try {
        return { ...defaults, ...JSON.parse(stored) }
      } catch (e) {
        console.error('Error parsing stored featured stories data', e)
      }
    }
    return defaults
  })
  const [saved, setSaved] = useState(false)
  const [activeSlide, setActiveSlide] = useState(0)
  const trackRef = useRef<HTMLDivElement>(null)

  const handleSave = () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
    window.dispatchEvent(new Event('featured-stories-updated'))
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const updateStory = (id: string, patch: Partial<StoryCard>) => {
    setData(prev => ({ ...prev, stories: prev.stories.map(s => (s.id === id ? { ...s, ...patch } : s)) }))
    setSaved(false)
  }

  const addStory = () => {
    setData(prev => ({
      ...prev,
      stories: [...prev.stories, { id: `story_${Date.now()}`, image: '', category: 'Category', title: 'Couple names, Location' }],
    }))
    setSaved(false)
  }

  const removeStory = (id: string) => {
    setData(prev => ({ ...prev, stories: prev.stories.filter(s => s.id !== id) }))
    setSaved(false)
  }

  const scrollByCard = (dir: 1 | -1) => {
    const track = trackRef.current
    if (!track) return
    const cardWidth = track.firstElementChild?.clientWidth ?? 400
    track.scrollBy({ left: dir * (cardWidth + 24), behavior: 'smooth' })
    setActiveSlide(prev => Math.min(Math.max(prev + dir, 0), data.stories.length - 1))
  }

  const goToSlide = (index: number) => {
    const track = trackRef.current
    if (!track) return
    const cardWidth = track.firstElementChild?.clientWidth ?? 400
    track.scrollTo({ left: index * (cardWidth + 24), behavior: 'smooth' })
    setActiveSlide(index)
  }

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="p-4 sm:p-6">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h1 className="text-lg font-semibold text-slate-200">Featured Wedding Stories</h1>
            <p className="text-xs text-slate-500 mt-0.5">The story carousel shown on your homepage</p>
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

        <Card className="mb-4">
          <CardHeader title="Section Heading" subtitle="Eyebrow label and title above the carousel" />
          <CardBody className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            <div>
              <label className="text-[11px] text-slate-500 block mb-1">Eyebrow label</label>
              <Input value={data.eyebrow} onChange={(e: any) => setData(prev => ({ ...prev, eyebrow: e.target.value }))} className="text-sm" />
            </div>
            <div>
              <label className="text-[11px] text-slate-500 block mb-1">Heading</label>
              <Input value={data.heading} onChange={(e: any) => setData(prev => ({ ...prev, heading: e.target.value }))} className="text-sm" />
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardHeader
            title="Story Cards"
            subtitle={`${data.stories.length} stories in the carousel`}
            actions={
              <button
                onClick={addStory}
                className="flex items-center gap-1.5 px-3 h-7 rounded-md bg-orbit-primary text-white text-xs font-medium hover:opacity-90 transition-opacity"
              >
                <Plus className="w-3.5 h-3.5" /> Add Story
              </button>
            }
          />
          <CardBody className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 pt-2">
            {data.stories.map(story => (
              <div key={story.id} className="border border-orbit-border rounded-lg p-3 space-y-2.5 relative">
                <button
                  onClick={() => removeStory(story.id)}
                  className="absolute top-2 right-2 z-10 w-6 h-6 rounded-full bg-black/50 text-white flex items-center justify-center hover:bg-red-500/80 transition-colors"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
                <StoryImageSlot id={`story-img-${story.id}`} value={story.image} onChange={(v) => updateStory(story.id, { image: v })} />
                <div>
                  <label className="text-[11px] text-slate-500 block mb-1">Category tag</label>
                  <Input value={story.category} onChange={(e: any) => updateStory(story.id, { category: e.target.value })} className="text-sm" />
                </div>
                <div>
                  <label className="text-[11px] text-slate-500 block mb-1">Couple names & location</label>
                  <Input value={story.title} onChange={(e: any) => updateStory(story.id, { title: e.target.value })} className="text-sm" />
                </div>
              </div>
            ))}
            {data.stories.length === 0 && (
              <p className="text-xs text-slate-600 col-span-full text-center py-6">No stories yet — click "Add Story" to create one.</p>
            )}
          </CardBody>
        </Card>
      </div>

      {/* LIVE PREVIEW — full width, matches reference carousel design */}
      <div className="mt-2">
        <div className="flex items-center justify-between px-4 sm:px-6 py-3 border-y border-orbit-border bg-orbit-surface">
          <h2 className="text-sm font-semibold text-slate-200">Live Preview</h2>
          <span className="flex items-center gap-1.5 text-[11px] text-slate-500">
            <Sparkles className="w-3 h-3 text-orbit-primary" /> Auto-updating
          </span>
        </div>

        <div className="w-full bg-[#f4ecdf] py-16 sm:py-24">
          <div className="max-w-[1700px] mx-auto px-6 sm:px-12 lg:px-16">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-6 h-px" style={{ backgroundColor: '#5c1a26' }} />
              <span className="text-xs font-semibold tracking-[0.15em] uppercase" style={{ color: '#5c1a26' }}>
                {data.eyebrow}
              </span>
            </div>
            <h2 className="font-serif text-[#2b2117] text-4xl sm:text-5xl mb-10">{data.heading}</h2>

            <div ref={trackRef} className="flex gap-6 overflow-x-auto scroll-smooth snap-x snap-mandatory pb-2 no-scrollbar">
              {data.stories.map(story => (
                <div
                  key={story.id}
                  className="relative flex-shrink-0 snap-start rounded-2xl overflow-hidden bg-[#e5dccb]"
                  style={{ width: 'min(640px, 78vw)', height: 'min(400px, 52vw)' }}
                >
                  {story.image ? (
                    <img src={story.image} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-[#a89b87] text-sm">No photo yet</div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                  <div className="absolute left-7 bottom-6 right-7">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.15em] mb-1.5" style={{ color: '#d9b56a' }}>
                      {story.category}
                    </p>
                    <p className="font-serif text-white text-2xl sm:text-[1.7rem]">{story.title}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex items-center justify-between mt-6">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => scrollByCard(-1)}
                  className="w-11 h-11 rounded-full bg-white shadow-md flex items-center justify-center text-[#2b2117] hover:bg-[#eee5d4] transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={() => scrollByCard(1)}
                  className="w-11 h-11 rounded-full bg-white shadow-md flex items-center justify-center text-[#2b2117] hover:bg-[#eee5d4] transition-colors"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>

              <div className="flex items-center gap-2">
                {data.stories.map((story, i) => (
                  <button
                    key={story.id}
                    onClick={() => goToSlide(i)}
                    className={cn(
                      'h-1.5 rounded-full transition-all',
                      activeSlide === i ? 'w-6' : 'w-1.5 bg-[#c9b89a]'
                    )}
                    style={activeSlide === i ? { backgroundColor: '#c9a24a' } : undefined}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminFeaturedStories