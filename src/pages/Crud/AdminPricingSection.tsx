import { useState } from 'react'
import { Check, Plus, X, Save, Sparkles } from 'lucide-react'
import { Card, CardHeader, CardBody, Input } from '@/components/ui'
import { cn } from '@/utils/cn'

interface PricingPlan {
  id: string
  name: string
  subtitle: string
  price: string
  priceSuffix: string
  features: string[]
  featured: boolean
  badgeText: string
  buttonText: string
}

interface PricingData {
  eyebrow: string
  headingLine1: string
  headingLine2: string
  description: string
  plans: PricingPlan[]
}

const STORAGE_KEY = 'pricing_section_data'

const defaults: PricingData = {
  eyebrow: 'Packages & Plans',
  headingLine1: "Choose Your Story's",
  headingLine2: 'Canvas',
  description: 'Every wedding is different, so is every quote. These plans are starting points — we tailor the final package to your events, guest count and city.',
  plans: [
    {
      id: 'p1', name: 'Essentials', subtitle: 'Perfect for intimate, single-day weddings',
      price: '35,000', priceSuffix: 'onwards', featured: false, badgeText: '', buttonText: 'Enquire Now',
      features: ['1 Day candid coverage (2 photographers)', '300+ edited high-res photos', 'Online gallery for family & friends', '1-minute highlight reel'],
    },
    {
      id: 'p2', name: 'Signature', subtitle: 'Our most-booked, full celebration package',
      price: '75,000', priceSuffix: 'onwards', featured: true, badgeText: 'Most Loved', buttonText: 'Enquire Now',
      features: ['2 Days coverage (candid + traditional)', 'Cinematic wedding film + reels', '600+ edited photos + premium album', 'Drone aerial coverage', 'Pre-wedding shoot (half-day)'],
    },
    {
      id: 'p3', name: 'Heritage', subtitle: 'For multi-event, grand celebrations',
      price: '1,25,000', priceSuffix: 'onwards', featured: false, badgeText: '', buttonText: 'Enquire Now',
      features: ['3+ Day full-event coverage', 'Full cinematic film + teaser + reels', '1000+ edited photos + luxury album', 'Drone + full pre-wedding shoot', 'Dedicated lead photographer + team'],
    },
  ],
}

export function AdminPricingSection() {
  const [data, setData] = useState<PricingData>(() => {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      try {
        return { ...defaults, ...JSON.parse(stored) }
      } catch (e) {
        console.error('Error parsing stored pricing data', e)
      }
    }
    return defaults
  })
  const [saved, setSaved] = useState(false)

  const handleSave = () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
    window.dispatchEvent(new Event('pricing-section-updated'))
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const updatePlan = (id: string, patch: Partial<PricingPlan>) => {
    setData(prev => ({ ...prev, plans: prev.plans.map(p => (p.id === id ? { ...p, ...patch } : p)) }))
    setSaved(false)
  }

  const setFeatured = (id: string) => {
    setData(prev => ({ ...prev, plans: prev.plans.map(p => ({ ...p, featured: p.id === id })) }))
    setSaved(false)
  }

  const addPlan = () => {
    setData(prev => ({
      ...prev,
      plans: [...prev.plans, {
        id: `p_${Date.now()}`, name: 'New Plan', subtitle: 'Short plan description',
        price: '0', priceSuffix: 'onwards', featured: false, badgeText: '', buttonText: 'Enquire Now',
        features: ['Feature one'],
      }],
    }))
    setSaved(false)
  }

  const removePlan = (id: string) => {
    setData(prev => ({ ...prev, plans: prev.plans.filter(p => p.id !== id) }))
    setSaved(false)
  }

  const updateFeature = (planId: string, index: number, value: string) => {
    setData(prev => ({
      ...prev,
      plans: prev.plans.map(p => p.id === planId ? { ...p, features: p.features.map((f, i) => (i === index ? value : f)) } : p),
    }))
    setSaved(false)
  }

  const addFeature = (planId: string) => {
    setData(prev => ({
      ...prev,
      plans: prev.plans.map(p => p.id === planId ? { ...p, features: [...p.features, 'New feature'] } : p),
    }))
    setSaved(false)
  }

  const removeFeature = (planId: string, index: number) => {
    setData(prev => ({
      ...prev,
      plans: prev.plans.map(p => p.id === planId ? { ...p, features: p.features.filter((_, i) => i !== index) } : p),
    }))
    setSaved(false)
  }

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="p-4 sm:p-6">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h1 className="text-lg font-semibold text-slate-200">Pricing Plans</h1>
            <p className="text-xs text-slate-500 mt-0.5">The packages section shown on your homepage</p>
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
          <CardHeader title="Section Heading" subtitle="Eyebrow, title and intro paragraph" />
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
          <CardHeader
            title="Plans"
            subtitle={`${data.plans.length} plans`}
            actions={
              <button
                onClick={addPlan}
                className="flex items-center gap-1.5 px-3 h-7 rounded-md bg-orbit-primary text-white text-xs font-medium hover:opacity-90 transition-opacity"
              >
                <Plus className="w-3.5 h-3.5" /> Add Plan
              </button>
            }
          />
          <CardBody className="grid grid-cols-1 xl:grid-cols-3 gap-4 pt-2">
            {data.plans.map(plan => (
              <div key={plan.id} className="border border-orbit-border rounded-lg p-3 space-y-2.5 relative">
                <button
                  onClick={() => removePlan(plan.id)}
                  className="absolute top-2 right-2 z-10 w-6 h-6 rounded-full bg-black/50 text-white flex items-center justify-center hover:bg-red-500/80 transition-colors"
                >
                  <X className="w-3.5 h-3.5" />
                </button>

                <label className="flex items-center gap-2">
                  <input type="radio" name="featured-plan" checked={plan.featured} onChange={() => setFeatured(plan.id)} className="accent-orbit-primary" />
                  <span className="text-xs text-slate-400">Featured plan ("Most Loved")</span>
                </label>

                {plan.featured && (
                  <div>
                    <label className="text-[11px] text-slate-500 block mb-1">Badge text</label>
                    <Input value={plan.badgeText} onChange={(e: any) => updatePlan(plan.id, { badgeText: e.target.value })} className="text-sm" />
                  </div>
                )}

                <div>
                  <label className="text-[11px] text-slate-500 block mb-1">Plan name</label>
                  <Input value={plan.name} onChange={(e: any) => updatePlan(plan.id, { name: e.target.value })} className="text-sm" />
                </div>

                <div>
                  <label className="text-[11px] text-slate-500 block mb-1">Subtitle</label>
                  <Input value={plan.subtitle} onChange={(e: any) => updatePlan(plan.id, { subtitle: e.target.value })} className="text-sm" />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] text-slate-500 block mb-1">Price (₹)</label>
                    <Input value={plan.price} onChange={(e: any) => updatePlan(plan.id, { price: e.target.value })} className="text-sm" />
                  </div>
                  <div>
                    <label className="text-[11px] text-slate-500 block mb-1">Price suffix</label>
                    <Input value={plan.priceSuffix} onChange={(e: any) => updatePlan(plan.id, { priceSuffix: e.target.value })} className="text-sm" />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-[11px] text-slate-500">Features</label>
                    <button onClick={() => addFeature(plan.id)} className="flex items-center gap-1 text-[11px] text-orbit-primary hover:opacity-80">
                      <Plus className="w-3 h-3" /> Add
                    </button>
                  </div>
                  <div className="space-y-1.5">
                    {plan.features.map((feature, i) => (
                      <div key={i} className="flex items-center gap-1.5">
                        <Input value={feature} onChange={(e: any) => updateFeature(plan.id, i, e.target.value)} className="text-xs flex-1" />
                        <button onClick={() => removeFeature(plan.id, i)} className="text-slate-500 hover:text-red-400 flex-shrink-0">
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-[11px] text-slate-500 block mb-1">Button text</label>
                  <Input value={plan.buttonText} onChange={(e: any) => updatePlan(plan.id, { buttonText: e.target.value })} className="text-sm" />
                </div>
              </div>
            ))}
            {data.plans.length === 0 && (
              <p className="text-xs text-slate-600 col-span-full text-center py-6">No plans yet — click "Add Plan" to create one.</p>
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

        <div className="w-full bg-[#f2e9dc] py-20 sm:py-24">
          <div className="max-w-5xl mx-auto px-6 text-center mb-14">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="w-6 h-px" style={{ backgroundColor: '#5c1a26' }} />
              <span className="text-xs font-semibold tracking-[0.15em] uppercase" style={{ color: '#5c1a26' }}>
                {data.eyebrow}
              </span>
            </div>
            <h2 className="font-serif text-[#2b2117] text-4xl sm:text-5xl leading-[1.1] mb-6">
              {data.headingLine1}<br />{data.headingLine2}
            </h2>
            <p className="text-base text-[#6b5f52] max-w-2xl mx-auto leading-relaxed">{data.description}</p>
          </div>

          <div className="max-w-6xl mx-auto px-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
              {data.plans.map(plan => (
                <div
                  key={plan.id}
                  className={cn(
                    'relative rounded-2xl p-8',
                    plan.featured ? 'lg:-translate-y-3 shadow-2xl' : 'bg-white shadow-sm'
                  )}
                  style={plan.featured ? { backgroundColor: '#5c1224' } : undefined}
                >
                  {plan.featured && plan.badgeText && (
                    <span
                      className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-3.5 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wide"
                      style={{ backgroundColor: '#c9a24a', color: '#3a2410' }}
                    >
                      {plan.badgeText}
                    </span>
                  )}

                  <h3 className={cn('font-serif text-2xl mb-1.5', plan.featured ? 'text-white' : 'text-[#2b2117]')}>
                    {plan.name}
                  </h3>
                  <p className={cn('text-sm mb-6', plan.featured ? 'text-white/70' : 'text-[#8a7a68]')}>
                    {plan.subtitle}
                  </p>

                  <div className="flex items-end gap-2 mb-6">
                    <span className={cn('font-serif text-3xl sm:text-4xl', plan.featured ? 'text-white' : 'text-[#2b2117]')}>
                      ₹{plan.price}
                    </span>
                    <span className={cn('text-sm pb-1', plan.featured ? 'text-white/60' : 'text-[#a89b87]')}>
                      {plan.priceSuffix}
                    </span>
                  </div>

                  <div className={cn('h-px mb-6', plan.featured ? 'bg-white/15' : 'bg-black/10')} />

                  <ul className="space-y-3.5 mb-8">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-start gap-2.5">
                        <Check className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: plan.featured ? '#e0b45c' : '#c9781f' }} />
                        <span className={cn('text-sm leading-snug', plan.featured ? 'text-white/90' : 'text-[#4a4038]')}>
                          {feature}
                        </span>
                      </li>
                    ))}
                  </ul>

                  <button
                    className={cn(
                      'w-full py-3 rounded-full text-sm font-semibold transition-opacity hover:opacity-90',
                      plan.featured ? 'bg-white text-[#5c1224]' : 'bg-white text-[#2b2117] border border-black/15'
                    )}
                  >
                    {plan.buttonText}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminPricingSection