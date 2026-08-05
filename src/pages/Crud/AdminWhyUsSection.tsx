import { useState } from 'react'
import {
  Camera, Video, Palette, Mail, Heart, Star, Sparkles as SparklesIcon,
  Award, Gem, Save, Plus, X, Sparkles
} from 'lucide-react'
import { Card, CardHeader, CardBody, Input } from '@/components/ui'
import { cn } from '@/utils/cn'

type IconName = 'Camera' | 'Video' | 'Palette' | 'Mail' | 'Heart' | 'Star' | 'Award' | 'Gem'

interface FeatureCard {
  id: string
  icon: IconName
  title: string
  description: string
}

interface WhyUsData {
  eyebrow: string
  headingLine1: string
  headingLine2: string
  features: FeatureCard[]
}

const STORAGE_KEY = 'why_us_section_data'

const ICONS: Record<IconName, React.ComponentType<{ className?: string }>> = {
  Camera, Video, Palette, Mail, Heart, Star, Award, Gem,
}

const defaults: WhyUsData = {
  eyebrow: 'Why Lagngatha',
  headingLine1: 'Crafted With Care,',
  headingLine2: 'Every Single Time',
  features: [
    { id: 'f1', icon: 'Camera', title: 'Candid Photography', description: 'Natural moments, beautifully captured.' },
    { id: 'f2', icon: 'Video', title: 'Cinematic Films', description: 'Stories that move you, frames that last.' },
    { id: 'f3', icon: 'Palette', title: 'Creative Portraits', description: 'Timeless portraits that speak elegance.' },
    { id: 'f4', icon: 'Mail', title: 'Premium Albums', description: 'Handcrafted albums for your legacy.' },
  ],
}

export function AdminWhyUsSection() {
  const [data, setData] = useState<WhyUsData>(() => {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      try {
        return { ...defaults, ...JSON.parse(stored) }
      } catch (e) {
        console.error('Error parsing stored why-us data', e)
      }
    }
    return defaults
  })
  const [saved, setSaved] = useState(false)

  const handleSave = () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
    window.dispatchEvent(new Event('why-us-section-updated'))
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const updateFeature = (id: string, patch: Partial<FeatureCard>) => {
    setData(prev => ({ ...prev, features: prev.features.map(f => (f.id === id ? { ...f, ...patch } : f)) }))
    setSaved(false)
  }

  const addFeature = () => {
    setData(prev => ({
      ...prev,
      features: [...prev.features, { id: `f_${Date.now()}`, icon: 'Star', title: 'New Feature', description: 'Short description here.' }],
    }))
    setSaved(false)
  }

  const removeFeature = (id: string) => {
    setData(prev => ({ ...prev, features: prev.features.filter(f => f.id !== id) }))
    setSaved(false)
  }

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="p-4 sm:p-6">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h1 className="text-lg font-semibold text-slate-200">Why Us Section</h1>
            <p className="text-xs text-slate-500 mt-0.5">The 4-feature highlight row shown on your homepage</p>
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
          <CardHeader title="Section Heading" subtitle="Eyebrow label and two-line title" />
          <CardBody className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
            <div>
              <label className="text-[11px] text-slate-500 block mb-1">Eyebrow label</label>
              <Input value={data.eyebrow} onChange={(e: any) => setData(prev => ({ ...prev, eyebrow: e.target.value }))} className="text-sm" />
            </div>
            <div>
              <label className="text-[11px] text-slate-500 block mb-1">Heading line 1</label>
              <Input value={data.headingLine1} onChange={(e: any) => setData(prev => ({ ...prev, headingLine1: e.target.value }))} className="text-sm" />
            </div>
            <div>
              <label className="text-[11px] text-slate-500 block mb-1">Heading line 2</label>
              <Input value={data.headingLine2} onChange={(e: any) => setData(prev => ({ ...prev, headingLine2: e.target.value }))} className="text-sm" />
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardHeader
            title="Feature Cards"
            subtitle={`${data.features.length} cards`}
            actions={
              <button
                onClick={addFeature}
                className="flex items-center gap-1.5 px-3 h-7 rounded-md bg-orbit-primary text-white text-xs font-medium hover:opacity-90 transition-opacity"
              >
                <Plus className="w-3.5 h-3.5" /> Add Card
              </button>
            }
          />
          <CardBody className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 pt-2">
            {data.features.map(feature => (
              <div key={feature.id} className="border border-orbit-border rounded-lg p-3 space-y-2.5 relative">
                <button
                  onClick={() => removeFeature(feature.id)}
                  className="absolute top-2 right-2 z-10 w-6 h-6 rounded-full bg-black/50 text-white flex items-center justify-center hover:bg-red-500/80 transition-colors"
                >
                  <X className="w-3.5 h-3.5" />
                </button>

                <div>
                  <label className="text-[11px] text-slate-500 block mb-1.5">Icon</label>
                  <div className="grid grid-cols-4 gap-1.5">
                    {(Object.keys(ICONS) as IconName[]).map(name => {
                      const IconComp = ICONS[name]
                      return (
                        <button
                          key={name}
                          onClick={() => updateFeature(feature.id, { icon: name })}
                          className={cn(
                            'aspect-square rounded-md border flex items-center justify-center transition-colors',
                            feature.icon === name
                              ? 'bg-orbit-primary border-orbit-primary text-white'
                              : 'border-orbit-border text-slate-400 hover:bg-white/5'
                          )}
                        >
                          <IconComp className="w-4 h-4" />
                        </button>
                      )
                    })}
                  </div>
                </div>

                <div>
                  <label className="text-[11px] text-slate-500 block mb-1">Title</label>
                  <Input value={feature.title} onChange={(e: any) => updateFeature(feature.id, { title: e.target.value })} className="text-sm" />
                </div>

                <div>
                  <label className="text-[11px] text-slate-500 block mb-1">Description</label>
                  <textarea
                    value={feature.description}
                    onChange={(e) => updateFeature(feature.id, { description: e.target.value })}
                    rows={2}
                    className="w-full bg-transparent border border-orbit-border rounded-md px-2 py-1.5 text-xs text-slate-200 resize-none"
                  />
                </div>
              </div>
            ))}
            {data.features.length === 0 && (
              <p className="text-xs text-slate-600 col-span-full text-center py-6">No feature cards yet — click "Add Card" to create one.</p>
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

        <div className="w-full bg-[#f5eee2] py-16 sm:py-20">
          <div className="max-w-[1700px] mx-auto px-6 sm:px-12 lg:px-16">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-6 h-px" style={{ backgroundColor: '#5c1a26' }} />
              <span className="text-xs font-semibold tracking-[0.15em] uppercase" style={{ color: '#5c1a26' }}>
                {data.eyebrow}
              </span>
            </div>
            <h2 className="font-serif text-[#2b2117] text-4xl sm:text-5xl leading-[1.1] mb-10">
              {data.headingLine1}<br />{data.headingLine2}
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
              {data.features.map(feature => {
                const IconComp = ICONS[feature.icon]
                return (
                  <div key={feature.id} className="bg-white rounded-2xl p-8 text-center shadow-sm">
                    <div className="w-16 h-16 rounded-full mx-auto mb-5 flex items-center justify-center" style={{ backgroundColor: '#f3dede' }}>
                      <IconComp className="w-6 h-6"/>
                    </div>
                    <h3 className="font-serif text-lg text-[#2b2117] mb-2">{feature.title}</h3>
                    <p className="text-sm text-[#6b5f52]">{feature.description}</p>
                  </div>
                )
              })}
            </div>

            {data.features.length === 0 && (
              <p className="text-sm text-[#8a7a68] text-center py-10">No features to show yet.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminWhyUsSection