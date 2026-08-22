import '../styles/site.css'

import { Header } from '../components/site/Header'
import { Hero } from '../components/site/Hero'
import { FeaturedCarousel } from '../components/site/FeaturedCarousel'
import { Gallery } from '../components/site/Gallery'
import { Reels } from '../components/site/Reels'
import { Features } from '../components/site/Features'
import { Packages } from '../components/site/Packages'
import { About } from '../components/site/About'
import { Contact } from '../components/site/Contact'
import { Footer } from '../components/site/Footer'
import { WhatsAppFloat } from '../components/site/WhatsAppFloat'
import TeamSection from '../components/site/TeamSection'
import { useSectionStorage } from '../hooks/useSectionStorage'
import {
  heroDefaults, featuredDefaults, galleryCategoryDefaults, reelDefaults,
  featureDefaults, packageDefaults, aboutDefaults, contactDefaults, footerGalleryDefaults,
} from '../data/siteContent'
import type {
  HeroData, FeaturedStory, GalleryCategory, Reel, FeatureItem, PackageTier, AboutData, ContactData,
} from '../data/siteContent'
import { Testimonials } from '@/components/site/Testimonials'

export function PublicSite() {
  const hero = useSectionStorage<HeroData>('hero_section_data', 'hero-section-updated', heroDefaults)
  const featured = useSectionStorage<{ items: FeaturedStory[] }>('featured_section_data', 'featured-section-updated', { items: featuredDefaults }).items
  const gallery = useSectionStorage<{ categories: GalleryCategory[]; reels: Reel[] }>(
    'gallery_section_data', 'gallery-section-updated', { categories: galleryCategoryDefaults, reels: reelDefaults }
  )
  const features = useSectionStorage<{ items: FeatureItem[] }>('whyus_section_data', 'whyus-section-updated', { items: featureDefaults }).items
  const packages = useSectionStorage<{ tiers: PackageTier[] }>('pricing_section_data', 'pricing-section-updated', { tiers: packageDefaults }).tiers
  const about = useSectionStorage<AboutData>('about_section_data', 'about-section-updated', aboutDefaults)
  const contact = useSectionStorage<ContactData>('contact_section_data', 'contact-section-updated', contactDefaults)

  return (
    <div className="lagngatha-site">
      <Header />
      <main>
        <Hero data={hero} />
        <FeaturedCarousel items={featured} />
        <Gallery categories={gallery.categories} />
        <Reels reels={gallery.reels} />
        <Features items={features} />
        <Packages tiers={packages} phone={contact.phone} />
        <About data={about} />
        <TeamSection />
        <Testimonials />
        <Contact
          data={contact}
          onSubmit={(payload) => {
            console.log('New inquiry:', payload)
          }}
        />
      </main>
      <Footer contact={contact} galleryImages={footerGalleryDefaults} />
      <WhatsAppFloat whatsappUrl={contact.whatsappUrl} />
    </div>
  )
}

export default PublicSite