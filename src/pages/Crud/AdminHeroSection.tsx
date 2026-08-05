import { useState } from 'react'
import { Save, RotateCcw, Sparkles, Check, Upload } from 'lucide-react'
import { Card, CardHeader, CardBody, Input } from '@/components/ui'
import { cn } from '@/utils/cn'

interface HeroSectionData {
  marathiTagline: string
  headingLine1: string
  headingLine2: string
  quoteText: string
  primaryButtonText: string
  secondaryButtonText: string
  stat1Value: string
  stat1Label: string
  stat2Value: string
  stat2Label: string
  badgeSinceYear: string
  badgeStoriesText: string
  badgeStudioText: string
  mainImage: string
  topRightImage: string
  bottomRightImage: string
}

const STORAGE_KEY = 'hero_section_data'

const defaults: HeroSectionData = {
  marathiTagline: 'तुमचं लग्न, तुमची कथा',
  headingLine1: 'Every Wedding',
  headingLine2: 'Has a Story',
  quoteText: "From the haldi morning to the last dance — we shoot Maharashtra's weddings the way they deserve to be remembered.",
  primaryButtonText: 'Book Your Story',
  secondaryButtonText: 'See Our Work',
  stat1Value: '200+',
  stat1Label: 'Weddings',
  stat2Value: '100%',
  stat2Label: 'Happy Clients',
  badgeSinceYear: '2023',
  badgeStoriesText: 'Wedding Stories',
  badgeStudioText: 'Premium Studio',
  mainImage: '',
  topRightImage: '',
  bottomRightImage: '',
}

function PreviewPhotoSlot({
  id, value, onChange, className, roundedClass = 'rounded-2xl',
}: {
  id: string
  value: string
  onChange: (dataUrl: string) => void
  className: string
  roundedClass?: string
}) {
  const handleFile = (file: File | undefined) => {
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => onChange(reader.result as string)
    reader.readAsDataURL(file)
  }

  return (
    <label
      htmlFor={id}
      className={cn(
        'group absolute overflow-hidden shadow-xl bg-[#e5dccb] border-4 border-white cursor-pointer',
        roundedClass,
        className
      )}
    >
      {value ? (
        <img src={value} className="w-full h-full object-cover" />
      ) : (
        <div className="w-full h-full flex items-center justify-center text-[#a89b87] text-xs text-center px-2">
          Click to upload
        </div>
      )}
      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/45 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
        <span className="text-[11px] text-white flex items-center gap-1.5 font-medium">
          <Upload className="w-3.5 h-3.5" /> {value ? 'Replace photo' : 'Upload photo'}
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

export function AdminHeroSection() {
  const [data, setData] = useState<HeroSectionData>(() => {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      try {
        return { ...defaults, ...JSON.parse(stored) }
      } catch (e) {
        console.error('Error parsing stored hero section data', e)
      }
    }
    return defaults
  })
  const [saved, setSaved] = useState(false)

  const update = (patch: Partial<HeroSectionData>) => {
    setData(prev => ({ ...prev, ...patch }))
    setSaved(false)
  }

  const handleSave = () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
    window.dispatchEvent(new Event('hero-section-updated'))
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const handleReset = () => {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      try {
        setData({ ...defaults, ...JSON.parse(stored) })
        return
      } catch {
        // fall through to defaults
      }
    }
    setData(defaults)
  }

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="p-4 sm:p-6">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h1 className="text-lg font-semibold text-slate-200">Hero Section</h1>
            <p className="text-xs text-slate-500 mt-0.5">Content shown on your homepage hero banner — photos are edited directly in the preview below</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleReset}
              className="flex items-center gap-1.5 px-3 h-8 rounded-md border border-orbit-border text-slate-400 text-xs hover:bg-white/5 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" /> Reset
            </button>
            <button
              onClick={handleSave}
              className={cn(
                'flex items-center gap-1.5 px-4 h-8 rounded-md text-xs font-medium transition-colors',
                saved ? 'bg-emerald-600 text-white' : 'bg-orbit-primary text-white hover:opacity-90'
              )}
            >
              {saved ? <Check className="w-3.5 h-3.5" /> : <Save className="w-3.5 h-3.5" />}
              {saved ? 'Saved' : 'Save Changes'}
            </button>
          </div>
        </div>

        {/* FORM — text content only, no image boxes here anymore */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader title="Copy" subtitle="Headline, tagline and quote" />
            <CardBody className="space-y-3 pt-2">
              <div>
                <label className="text-[11px] text-slate-500 block mb-1">Marathi tagline</label>
                <Input value={data.marathiTagline} onChange={(e: any) => update({ marathiTagline: e.target.value })} className="text-sm" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] text-slate-500 block mb-1">Heading line 1</label>
                  <Input value={data.headingLine1} onChange={(e: any) => update({ headingLine1: e.target.value })} className="text-sm" />
                </div>
                <div>
                  <label className="text-[11px] text-slate-500 block mb-1">Heading line 2</label>
                  <Input value={data.headingLine2} onChange={(e: any) => update({ headingLine2: e.target.value })} className="text-sm" />
                </div>
              </div>
              <div>
                <label className="text-[11px] text-slate-500 block mb-1">Quote / description</label>
                <textarea
                  value={data.quoteText}
                  onChange={(e) => update({ quoteText: e.target.value })}
                  rows={3}
                  className="w-full bg-transparent border border-orbit-border rounded-md px-3 py-2 text-sm text-slate-200 resize-none"
                />
              </div>
            </CardBody>
          </Card>

          <Card>
            <CardHeader title="Buttons & Stats" subtitle="CTAs and trust numbers" />
            <CardBody className="grid grid-cols-2 gap-3 pt-2">
              <div>
                <label className="text-[11px] text-slate-500 block mb-1">Primary button</label>
                <Input value={data.primaryButtonText} onChange={(e: any) => update({ primaryButtonText: e.target.value })} className="text-sm" />
              </div>
              <div>
                <label className="text-[11px] text-slate-500 block mb-1">Secondary button</label>
                <Input value={data.secondaryButtonText} onChange={(e: any) => update({ secondaryButtonText: e.target.value })} className="text-sm" />
              </div>
              <div>
                <label className="text-[11px] text-slate-500 block mb-1">Stat 1 value</label>
                <Input value={data.stat1Value} onChange={(e: any) => update({ stat1Value: e.target.value })} className="text-sm" />
              </div>
              <div>
                <label className="text-[11px] text-slate-500 block mb-1">Stat 1 label</label>
                <Input value={data.stat1Label} onChange={(e: any) => update({ stat1Label: e.target.value })} className="text-sm" />
              </div>
              <div>
                <label className="text-[11px] text-slate-500 block mb-1">Stat 2 value</label>
                <Input value={data.stat2Value} onChange={(e: any) => update({ stat2Value: e.target.value })} className="text-sm" />
              </div>
              <div>
                <label className="text-[11px] text-slate-500 block mb-1">Stat 2 label</label>
                <Input value={data.stat2Label} onChange={(e: any) => update({ stat2Label: e.target.value })} className="text-sm" />
              </div>
            </CardBody>
          </Card>

          <Card>
            <CardHeader title="Floating Badges" subtitle="Small circular badges over the photos" />
            <CardBody className="space-y-3 pt-2">
              <div>
                <label className="text-[11px] text-slate-500 block mb-1">"Since" year badge</label>
                <Input value={data.badgeSinceYear} onChange={(e: any) => update({ badgeSinceYear: e.target.value })} className="text-sm" />
              </div>
              <div>
                <label className="text-[11px] text-slate-500 block mb-1">Left circle badge text</label>
                <Input value={data.badgeStoriesText} onChange={(e: any) => update({ badgeStoriesText: e.target.value })} className="text-sm" />
              </div>
              <div>
                <label className="text-[11px] text-slate-500 block mb-1">Bottom circle badge text</label>
                <Input value={data.badgeStudioText} onChange={(e: any) => update({ badgeStudioText: e.target.value })} className="text-sm" />
              </div>
            </CardBody>
          </Card>
        </div>
      </div>

      {/* LIVE PREVIEW — full width, matches reference design, photos clickable in place */}
      <div className="mt-2">
        <div className="flex items-center justify-between px-4 sm:px-6 py-3 border-y border-orbit-border bg-orbit-surface">
          <h2 className="text-sm font-semibold text-slate-200">Live Preview</h2>
          <span className="flex items-center gap-1.5 text-[11px] text-slate-500">
            <Sparkles className="w-3 h-3 text-orbit-primary" /> Click any photo below to upload
          </span>
        </div>

        <div className="w-full bg-[#f4ecdf] px-6 sm:px-12 lg:px-24 py-16 sm:py-24 relative overflow-hidden">
          {/* decorative dotted circle, top-left of collage — purely visual, matches reference */}
          <div
            className="hidden lg:block absolute rounded-full border border-dashed pointer-events-none"
            style={{ borderColor: '#c9a86a', width: 190, height: 190, top: 40, right: '30%' }}
          />

          <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-[1fr_1.15fr] gap-14 items-center relative">
            {/* left copy */}
            <div>
              <p className="text-base tracking-wide mb-4" style={{ color: '#b8860b' }}>{data.marathiTagline}</p>
              <h2 className="font-serif text-[#2b2117] leading-[1.05] mb-6 text-4xl sm:text-5xl lg:text-[3.4rem]">
                {data.headingLine1}<br />{data.headingLine2}
              </h2>
              <div className="w-12 h-0.5 mb-6" style={{ backgroundColor: '#b8860b' }} />
              <p className="text-base text-[#6b5f52] italic leading-relaxed mb-8 max-w-md">"{data.quoteText}"</p>
              <div className="flex items-center gap-4 mb-10">
                <button className="px-6 py-3 rounded-full text-white text-sm font-medium" style={{ backgroundColor: '#5c1a26' }}>
                  {data.primaryButtonText}
                </button>
                <button className="px-6 py-3 rounded-full text-sm font-medium border border-[#2b2117]/30 text-[#2b2117]">
                  {data.secondaryButtonText}
                </button>
              </div>
              <div className="flex items-center gap-10">
                <div>
                  <p className="font-serif text-3xl text-[#2b2117]">{data.stat1Value}</p>
                  <p className="text-[11px] uppercase tracking-wider text-[#6b5f52] mt-1">{data.stat1Label}</p>
                </div>
                <div>
                  <p className="font-serif text-3xl text-[#2b2117]">{data.stat2Value}</p>
                  <p className="text-[11px] uppercase tracking-wider text-[#6b5f52] mt-1">{data.stat2Label}</p>
                </div>
              </div>
            </div>

            {/* right photo collage — mirrors reference layout proportions/positions */}
            <div className="relative h-[440px] sm:h-[560px]">
              <PreviewPhotoSlot
                id="hero-main-img"
                value={data.mainImage}
                onChange={(v) => update({ mainImage: v })}
                className="left-0 top-0 w-[58%] h-[92%]"
              />
              <PreviewPhotoSlot
                id="hero-top-img"
                value={data.topRightImage}
                onChange={(v) => update({ topRightImage: v })}
                className="right-0 top-0 w-[44%] h-[48%]"
                roundedClass="rounded-xl"
              />
              <PreviewPhotoSlot
                id="hero-bottom-img"
                value={data.bottomRightImage}
                onChange={(v) => update({ bottomRightImage: v })}
                className="right-6 bottom-0 w-[48%] h-[44%]"
                roundedClass="rounded-xl"
              />

              {/* "Since" badge — sits between main and top-right photo */}
              <div className="absolute z-10 top-[6%] left-[54%] w-20 h-20 rounded-full bg-white shadow-md flex flex-col items-center justify-center text-center border border-black/5">
                <span className="text-sm font-serif text-[#5c1a26] leading-none">{data.badgeSinceYear}</span>
                <span className="text-[9px] text-[#6b5f52] mt-1 tracking-wide">SINCE</span>
              </div>

              {/* "Wedding Stories" badge — overlaps left edge of main photo */}
              <div className="absolute z-10 left-[-8%] top-[48%] w-24 h-24 rounded-full bg-white shadow-md flex items-center justify-center text-center px-2 border border-black/5">
                <span className="text-[10px] font-medium text-[#2b2117] leading-tight uppercase tracking-wide">{data.badgeStoriesText}</span>
              </div>

              {/* "Premium Studio" badge — overlaps bottom-right photo */}
              <div className="absolute z-10 right-[26%] bottom-[2%] w-24 h-24 rounded-full bg-white shadow-md flex items-center justify-center text-center px-2 border border-black/5">
                <span className="text-[10px] font-medium text-[#2b2117] leading-tight uppercase tracking-wide">{data.badgeStudioText}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminHeroSection