// Default/fallback content for the public site.
// Each section can later be overridden by its matching Admin*Section
// (see src/hooks/useSectionStorage.ts for the wiring convention).
export interface HeroData {
  kicker: string
  headingLine1: string
  headingLine2: string
  lead: string
  ctaPrimary: string
  ctaSecondary: string
  stats: { number: string; label: string }[]
  images: { src: string; alt: string }[]
  badges: { top?: string; bottom: string }[]
}

export const heroDefaults: HeroData = {
  kicker: 'तुमचं लग्न , तुमची कथा',
  headingLine1: 'Every Wedding',
  headingLine2: 'Has a Story',
  lead: 'From the haldi morning to the last dance — we shoot Maharashtra\u2019s weddings the way they deserve to be remembered.',
  ctaPrimary: 'Book Your Story',
  ctaSecondary: 'See Our Work',
  stats: [
    { number: '200+', label: 'Weddings' },
    { number: '100%', label: 'Happy Clients' },
  ],
  images: [
  { src: 'img1.jpg', alt: 'Bride' },
  { src: 'img4.jpg', alt: 'Groom' },
  { src: 'img2.jpg', alt: 'Couple' },
  ],
  badges: [
    { top: '2023', bottom: 'Since' },
    { bottom: 'Wedding Stories' },
    { bottom: 'Premium Studio' },
  ],
}

export interface FeaturedStory {
  image: string
  tag: string
  title: string
}

export const featuredDefaults: FeaturedStory[] = [
  { image: 'img1.jpg', tag: 'Wedding Film', title: 'Sanket & Shraddha, Sambhajinagar' },
  { image: 'img10.jpg', tag: 'Outdoors', title: 'Bhavesh & Nikita, Gangapur' },
  { image: 'img4.jpg', tag: 'Reception', title: 'Riya & Aniket, Nagar' },
  { image: 'img7.jpg', tag: 'Wedding Film', title: 'Vibhav & Akshada' },
  { image: 'img11.jpg', tag: 'Bride Shoot', title: 'Vaishanvi' },
]

export type Orientation = 'landscape' | 'portrait' | 'square' | 'wide'

export interface GalleryCategory {
  key: string
  label: string
  items: [Orientation, string][]
}

export const galleryCategoryDefaults: GalleryCategory[] = [
  { key: 'wedding', label: 'Wedding', items: [['portrait', 'img1.jpg'], ['landscape', 'img2.jpg'], ['square', 'img3.jpg'], ['portrait', 'img4.jpg'], ['wide', 'img5.jpg'], ['landscape', 'img6.jpg']] },
  { key: 'prewedding', label: 'Pre Wedding', items: [['landscape', 'img7.jpg'], ['portrait', 'img8.jpg'], ['wide', 'img9.jpg'], ['square', 'img10.jpg'], ['portrait', 'img11.jpg']] },
  { key: 'portrait', label: 'Portrait', items: [['portrait', 'img12.jpg'], ['portrait', 'img13.jpg'], ['square', 'img14.jpg'], ['portrait', 'img18.jpg']] },
  { key: 'fashion', label: 'Fashion', items: [['portrait', 'img16.jpg'], ['landscape', 'img17.jpg'], ['portrait', 'img18.jpg'], ['square', 'img19.jpg']] },
  { key: 'kids', label: 'Kids', items: [['square', 'img20.jpg'], ['portrait', 'img21.jpg'], ['landscape', 'img22.jpg'], ['portrait', 'img23.jpg'], ['landscape', 'img24.jpg']] },
]

export interface Reel {
  file: string
  title: string
  sub: string
  poster: string
}

export const reelDefaults: Reel[] = [
  { file: 'video/v11.mp4', title: 'Aditi & Rohan', sub: 'Reception Night', poster: 'img17.jpg' },
  { file: 'video/v12.mp4', title: 'Sneha & Omkar', sub: 'Sangeet', poster: 'img18.jpg' },
  { file: 'video/v13.mp4', title: 'Prajakta & Yash', sub: 'Haldi Ceremony', poster: 'img19.jpg' },
  { file: 'video/v14.mp4', title: 'Studio Reel', sub: 'Behind The Scenes', poster: 'img20.jpg' },
  { file: 'video/v15.mp4', title: 'Riya & Aniket', sub: 'Pre-Wedding Diaries', poster: 'img21.jpg' },
  { file: 'video/v16.mp4', title: 'Family Portrait', sub: 'Kids & Candid', poster: 'img22.jpg' },
]

export interface FeatureItem {
  title: string
  desc: string
  icon: 'candid' | 'film' | 'portrait' | 'album'
}

export const featureDefaults: FeatureItem[] = [
  { title: 'Candid Photography', desc: 'Natural moments, beautifully captured.', icon: 'candid' },
  { title: 'Cinematic Films', desc: 'Stories that move you, frames that last.', icon: 'film' },
  { title: 'Creative Portraits', desc: 'Timeless portraits that speak elegance.', icon: 'portrait' },
  { title: 'Premium Albums', desc: 'Handcrafted albums for your legacy.', icon: 'album' },
]

export interface PackageTier {
  name: string
  tag: string
  price: string
  featured?: boolean
  ribbon?: string
  items: string[]
}

export const packageDefaults: PackageTier[] = [
  {
    name: 'Essentials', tag: 'Perfect for intimate, single-day weddings', price: '\u20b935,000 onwards',
    items: ['1 Day candid coverage (2 photographers)', '300+ edited high-res photos', 'Online gallery for family & friends', '1-minute highlight reel'],
  },
  {
    name: 'Signature', tag: 'Our most-booked, full celebration package', price: '\u20b975,000 onwards', featured: true, ribbon: 'Most Loved',
    items: ['2 Days coverage (candid + traditional)', 'Cinematic wedding film + reels', '600+ edited photos + premium album', 'Drone aerial coverage', 'Pre-wedding shoot (half-day)'],
  },
  {
    name: 'Heritage', tag: 'For multi-event, grand celebrations', price: '\u20b91,25,000 onwards',
    items: ['3+ Day full-event coverage', 'Full cinematic film + teaser + reels', '1000+ edited photos + luxury album', 'Drone + full pre-wedding shoot', 'Dedicated lead photographer + team'],
  },
]

export interface AboutData {
  studioName: string
  founder: string
  intro: string
  quote: string
  stats: { number: string; label: string }[]
  images: { src: string; alt: string }[]
  cta: string
}

export const aboutDefaults: AboutData = {
  studioName: 'Lagngatha Photo & Films',
  founder: 'Kiran Hiwale',
  intro: 'Lagngatha Photo & Films is led by Kiran Hiwale of Mk Photography — built on the belief that a wedding isn\u2019t a checklist of poses, it\u2019s a story already unfolding, and our job is to tell it honestly.',
  quote: 'From the first haldi morning to the last dance of the reception, we shoot candid, we shoot cinematic, and we shoot with the same care whether it\u2019s 50 guests or 500.',
  stats: [
    { number: '200+', label: 'Weddings Shot' },
    { number: '8+', label: 'Years in Business' },
    { number: '3,698+', label: 'Instagram Family' },
  ],
  images: [
    { src: 'img28.jpg', alt: 'Kiran Hiwale, lead photographer' },
    { src: 'img30.jpg', alt: 'Behind the scenes of a wedding shoot' },
  ],
  cta: 'Meet the Team',
}

export interface ContactData {
  phone: string
  email: string
  city: string
  instagramUrl: string
  facebookUrl: string
  youtubeUrl: string
  whatsappUrl: string
  mapEmbedUrl: string
}

export const contactDefaults: ContactData = {
  phone: '96731 11013',
  email: 'lagngatha.studio@gmail.com',
  city: 'Gangapur, Maharashtra',
  instagramUrl: 'https://instagram.com/lagngatha_',
  facebookUrl: '#',
  youtubeUrl: '#',
  whatsappUrl: 'https://wa.me/919673111013',
  mapEmbedUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d4440.910414792399!2d74.99756117522132!3d19.704595381633766!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bdb81b4e11f9097%3A0x512bed789c14b4ba!2sKiran%20Hiwale%20photography!5e1!3m2!1sen!2sin!4v1785744114432!5m2!1sen!2sin',
}

export const footerGalleryDefaults = ['img1.jpg', 'img2.jpg', 'img3.jpg', 'img4.jpg', 'img5.jpg', 'img6.jpg']

// Where your actual photo/video assets live. Point this at your CDN,
// Cloudinary folder, or wherever the admin gallery uploader saves files.
export const ASSET_BASE_URL = ''

export function assetUrl(path: string) {
  if (!path) return ''
  if (path.startsWith('http://') || path.startsWith('https://') || path.startsWith('data:')) return path
  return `${ASSET_BASE_URL}${path}`
}
