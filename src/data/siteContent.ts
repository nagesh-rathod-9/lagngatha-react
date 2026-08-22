export interface HeroData {
  kicker: string;
  headingLine1: string;
  headingLine2: string;
  lead: string;
  ctaPrimary: string;
  ctaSecondary: string;
  stats: { number: string; label: string }[];
  images: { src: string; alt: string }[];
  badges: { top?: string; bottom: string }[];
}

export const heroDefaults: HeroData = {
  kicker: "तुमचं लग्न , तुमची कथा",
  headingLine1: "Every Wedding",
  headingLine2: "Has a Story",
  lead: "From the haldi morning to the last dance — we shoot Maharashtra\u2019s weddings the way they deserve to be remembered.",
  ctaPrimary: "Book Your Story",
  ctaSecondary: "See Our Work",
  stats: [
    { number: "300+", label: "Weddings" },
    { number: "100%", label: "Happy Clients" },
  ],
  images: [
    { src: "img1.jpg", alt: "Bride" },
    { src: "img4.jpg", alt: "Groom" },
    { src: "img2.jpg", alt: "Couple" },
  ],
  badges: [
    { top: "2015", bottom: "Since" },
    { bottom: "Wedding Stories" },
    { bottom: "Premium Studio" },
  ],
};

export interface FeaturedStory {
  image?: string;
  tag: string;
  title: string;
  video?: string;
}

export const featuredDefaults: FeaturedStory[] = [
  { tag: "Wedding Film", title: "", video: "video/story1.mp4" },
  { tag: "Outdoors", title: "", video: "video/story2.mp4" },
  { tag: "Wedding Film", title: "", video: "video/story3.mp4" },
  { tag: "Wedding Film", title: "", video: "video/story4.mp4" },
  { tag: "Wedding Film", title: "", video: "video/vid8.mp4" },
];

export type Orientation = "landscape" | "portrait" | "square" | "wide";

export interface GalleryCategory {
  key: string;
  label: string;
  items: [Orientation, string][];
}

export const galleryCategoryDefaults: GalleryCategory[] = [
  {
    key: "wedding",
    label: "Wedding",
    items: [
      ["portrait", "wed6.jpg"],
      ["square", "wed2.jpg"],
      ["portrait", "wed3.jpg"],
      ["portrait", "wed4.jpg"],
      ["square", "wed1.jpg"],
      ["landscape", "wed5.jpg"],
      ["portrait", "wed7.jpg"],
      ["landscape", "wed8.jpg"],
      ["square", "wed9.jpg"],
      ["square", "wed10.jpg"],
      ["square", "wed11.jpg"],
      ["portrait", "wed12.jpg"],
      ["portrait", "wed13.jpg"],
      ["square", "wed14.jpg"],
      ["landscape", "wed15.jpg"],
      ["portrait", "wed16.jpg"],
      ["landscape", "wed17.jpg"],
      ["square", "wed18.jpg"],
      ["portrait", "wed19.jpg"],
      ["square", "wed20.jpg"],
    ],
  },
  {
    key: "prewedding",
    label: "Pre Wedding",
    items: [
      ["portrait", "pre1.jpg"],
      ["portrait", "prev2.jpg"],
      ["portrait", "prev3.jpg"],
      ["square", "prev4.jpg"],
      ["portrait", "prev5.jpg"],
      ["portrait", "prev6.jpg"],
      ["portrait", "prev7.jpg"],
      ["portrait", "prev8.jpg"],
      ["portrait", "prev9.jpg"],
      ["portrait", "prev10.jpg"],
      ["portrait", "prev11.jpg"],
      ["portrait", "prev12.jpg"],
      ["wide", "prev13.jpg"],
      ["square", "prev14.jpg"],
    ],
  },
  {
    key: "engagement",
    label: "Engagement",
    items: [
      ["portrait", "eng1.jpg"],
      ["portrait", "eng2.jpg"],
      ["square", "eng3.jpg"],
      ["portrait", "eng4.jpg"],
      ["landscape", "eng5.jpg"],
      ["portrait", "eng6.jpg"],
      ["portrait", "eng8.jpg"],
      ["landscape", "eng9.jpg"],
      ["portrait", "eng10.jpg"],
    ],
  },
  {
    key: "baby",
    label: "Baby",
    items: [
      ["square", "baby2.jpg"],
      ["portrait", "baby3.jpg"],
      ["landscape", "baby4.jpg"],
    ],
  },
  {
    key: "couple",
    label: "Couple",
    items: [
      ["portrait", "cou1.jpg"],
      ["portrait", "cou2.jpg"],
      ["square", "cop3.jpg"],
      ["portrait", "cou4.jpg"],
      ["portrait", "cou5.jpg"],
      ["portrait", "cou6.jpg"],
      ["square", "cou7.jpg"],
      ["portrait", "cou8.jpg"],
      ["portrait", "cou9.jpg"],
      ["portrait", "cou10.jpg"],
      ["portrait", "cou11.jpg"],
      ["portrait", "cou12.jpg"],
    ],
  },
];

export interface Reel {
  title: string;
  file: string;
  sub: string;
  poster?: string;
  embedUrl?: string;
  category: "prewedding" | "WeddingCinematic" | "Reel";
}

export const reelDefaults: Reel[] = [
  {
    title: "Cinematic Cut",
    file: "video/vid9.mp4",
    sub: "Cinematic Cut",
    poster: "video/vid9.png",
    category: "prewedding",
  },
  {
    title: "Cinematic Cut",
    file: "video/vid12.mp4",
    sub: "Cinematic Cut",
    poster: "video/vid12.png",
    category: "prewedding",
  },
  {
    title: "Cinematic Cut",
    file: "video/vid13.mp4",
    sub: "Cinematic Cut",
    poster: "video/vid13.png",
    category: "prewedding",
  },
  {
    title: "Cinematic Cut",
    file: "video/vid11.mp4",
    sub: "Cinematic Cut",
    poster: "video/vid11.png",
    category: "prewedding",
  },

  // ======== WEDDING CINEMATIC ========
  {
    title: "Cinematic Cut",
    file: "video/vid19.mp4",
    sub: "Cinematic Cut",
    poster: "video/vid19.png",
    category: "WeddingCinematic",
  },
  {
    title: "Cinematic Cut",
    file: "video/vid14.mp4",
    sub: "Cinematic Cut",
    poster: "video/vid14.png",
    category: "WeddingCinematic",
  },
  {
    title: "Cinematic Cut",
    file: "video/vid22.mp4",
    sub: "Cinematic Cut",
    poster: "video/vid22.png",
    category: "WeddingCinematic",
  },
  {
    title: "Cinematic Cut",
    file: "video/vid27.mp4",
    sub: "Cinematic Cut",
    poster: "video/vid27.png",
    category: "WeddingCinematic",
  },
  {
    title: "Cinematic Cut",
    file: "video/vid18.mp4",
    sub: "Cinematic Cut",
    poster: "video/vid18.png",
    category: "WeddingCinematic",
  },
  {
    title: "Cinematic Cut",
    file: "video/vid7.mp4",
    sub: "Cinematic Cut",
    poster: "video/vid7.png",
    category: "WeddingCinematic",
  },
  {
    title: "Cinematic Cut",
    file: "video/vid8.mp4",
    sub: "Cinematic Cut",
    poster: "video/vid8.png",
    category: "WeddingCinematic",
  },
  {
    title: "Cinematic Cut",
    file: "video/vid10.mp4",
    sub: "Cinematic Cut",
    poster: "video/vid10.png",
    category: "WeddingCinematic",
  },

  {
    title: "Cinematic Cut",
    file: "video/vid15.mp4",
    sub: "Cinematic Cut",
    // poster missing -> auto thumbnail
    category: "WeddingCinematic",
  },
  {
    title: "Cinematic Cut",
    file: "video/vid16.mp4",
    sub: "Cinematic Cut",
    // poster missing
    category: "WeddingCinematic",
  },
  {
    title: "Cinematic Cut",
    file: "video/vid17.mp4",
    sub: "Cinematic Cut",
    // poster missing
    category: "WeddingCinematic",
  },

  {
    title: "Cinematic Cut",
    file: "video/vid20.mp4",
    sub: "Cinematic Cut",
    poster: "video/vid20.png",
    category: "WeddingCinematic",
  },
  {
    title: "Cinematic Cut",
    file: "video/vid21.mp4",
    sub: "Cinematic Cut",
    poster: "video/vid21.png",
    category: "WeddingCinematic",
  },

  // ======== REEL ========
  {
    title: "Wedding Highlight",
    file: "video/vid1.mp4",
    sub: "Wedding Highlight",
    poster: "video/vid1.png",
    category: "Reel",
  },
  {
    title: "Pre Wedding",
    file: "video/vid2.mp4",
    sub: "Pre Wedding",
    poster: "video/vid2.png",
    category: "Reel",
  },
  {
    title: "Cinematic Cut",
    file: "video/vid3.mp4",
    sub: "Cinematic Cut",
    poster: "video/vid3.png",
    category: "Reel",
  },
  {
    title: "Wedding Highlight",
    file: "video/vid4.mp4",
    sub: "Wedding Highlight",
    poster: "video/vid4.jpg",
    category: "Reel",
  },
  {
    title: "Pre Wedding",
    file: "video/vid5.mp4",
    sub: "Pre Wedding",
    poster: "video/vid5.png",
    category: "Reel",
  },
  {
    title: "Couple",
    file: "video/vid6.mp4",
    sub: "Couple",
    poster: "video/vid6.png",
    category: "Reel",
  },
  {
    title: "Cinematic Cut",
    file: "video/vid23.mp4",
    sub: "Cinematic Cut",
    poster: "video/vid23.png",
    category: "Reel",
  },
];
export interface FeatureItem {
  title: string;
  desc: string;
  icon: "candid" | "film" | "portrait" | "album";
}

export const featureDefaults: FeatureItem[] = [
  {
    title: "Candid Photography",
    desc: "Natural moments, beautifully captured.",
    icon: "candid",
  },
  {
    title: "Cinematic Films",
    desc: "Stories that move you, frames that last.",
    icon: "film",
  },
  {
    title: "Creative Portraits",
    desc: "Timeless portraits that speak elegance.",
    icon: "portrait",
  },
  {
    title: "Premium Albums",
    desc: "Handcrafted albums for your legacy.",
    icon: "album",
  },
];

export interface PackageTier {
  name: string;
  tag: string;
  price: string;
  featured?: boolean;
  ribbon?: string;
  items: string[];
}

export const packageDefaults: PackageTier[] = [
  {
    name: "Package 1",
    tag: "Essential coverage for a 2-day wedding",
    price: "\u20b935,000",
    items: [
      "2 Days coverage",
      "Traditional photography",
      "Traditional videography",
      "30-page photo album",
      "Wedding video on 1 pendrive",
    ],
  },
  {
    name: "Package 2",
    tag: "Traditional + candid coverage with reels",
    price: "\u20b960,000",
    items: [
      "Traditional videography",
      "Traditional photography",
      "Candid photography",
      "2 Instagram reels",
      "40-page photo album",
      "All soft copies (private)",
      "2 Pendrives",
    ],
  },
  {
    name: "Package 3",
    tag: "Cinematic storytelling with aerial shots",
    price: "\u20b91,10,000",
    featured: true,
    ribbon: "Most Loved",
    items: [
      "Traditional photography",
      "Traditional videography",
      "Candid photography",
      "Cinematic video",
      "Drone aerial coverage",
      "50-page photo album",
      "2 Pendrives",
    ],
  },
  {
    name: "Package 4",
    tag: "Full-scale grand wedding production",
    price: "\u20b92,11,000",
    items: [
      "2 Photographers",
      "2 Cinematographers",
      "2 Candid photographers",
      "Traditional videography",
      "2 LED walls with live setup",
      "Drone aerial coverage",
      "Teaser, trailer & main cinematic video",
      "80-page photo album",
      "4 Pendrives",
      "All soft data included",
    ],
  },
];

export interface AboutData {
  studioName: string;
  founder: string;
  intro: string;
  quote: string;
  stats: { number: string; label: string }[];
  images: { src: string; alt: string }[];
  cta: string;
}

export const aboutDefaults: AboutData = {
  studioName: "Lagngatha Photo & Films",
  founder: "Kiran Hiwale",
  intro:
    "Lagngatha Photo & Films is led by Kiran Hiwale of Mk Photography — built on the belief that a wedding isn\u2019t a checklist of poses, it\u2019s a story already unfolding, and our job is to tell it honestly.",
  quote:
    "From the first haldi morning to the last dance of the reception, we shoot candid, we shoot cinematic, and we shoot with the same care whether it\u2019s 50 guests or 500.",
  stats: [
    { number: "300+", label: "Weddings Shot" },
    { number: "8+", label: "Years in Business" },
    { number: "3,698+", label: "Instagram Family" },
  ],
  images: [
    { src: "img28.jpg", alt: "Kiran Hiwale, lead photographer" },
    { src: "img30.jpg", alt: "Behind the scenes of a wedding shoot" },
  ],
  cta: "Meet the Team",
};

export interface ContactData {
  phone: string;
  email: string;
  city: string;
  instagramUrl: string;
  facebookUrl: string;
  youtubeUrl: string;
  whatsappUrl: string;
  mapEmbedUrl: string;
}

export const contactDefaults: ContactData = {
  phone: "96731 11013",
  email: "khiwalepatil@gmail.com",
  city: "Gangapur, Maharashtra",
  instagramUrl: "https://www.instagram.com/kiran_hiwale_photography/",
  facebookUrl: "https://www.facebook.com/kiran.hiwale.9081/",
  youtubeUrl: "https://www.youtube.com/@KiranHiwalePhotography-jl4ti/videos",
  whatsappUrl: "https://wa.me/919673111013",
  mapEmbedUrl:
    "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d4440.910414792399!2d74.99756117522132!3d19.704595381633766!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bdb81b4e11f9097%3A0x512bed789c14b4ba!2sKiran%20Hiwale%20photography!5e1!3m2!1sen!2sin!4v1785744114432!5m2!1sen!2sin",
};

export const footerGalleryDefaults = [
  "img1.jpg",
  "img2.jpg",
  "img3.jpg",
  "img4.jpg",
  "img5.jpg",
  "img6.jpg",
];

export const ASSET_BASE_URL = "";

export function assetUrl(path: string) {
  if (!path) return "";
  if (
    path.startsWith("http://") ||
    path.startsWith("https://") ||
    path.startsWith("data:")
  )
    return path;
  return `${ASSET_BASE_URL}${path}`;
}
