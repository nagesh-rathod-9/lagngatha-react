import {
  LayoutDashboard,
  MessageSquare,
  Users,
  CreditCard,
  Puzzle,
  Settings,
  HelpCircle,
  BarChart3,
  Calendar,
  ListIcon,
  HeartOff,
  FileSpreadsheetIcon,
  Image,
  Timer,
  ThumbsUp,
  IndianRupee,
  GroupIcon,
  User2,
} from 'lucide-react'
import type { NavSection } from '@/types'

export const navigation: NavSection[] = [
  {
    title: 'Overview',
    items: [
      { label: 'Dashboard', icon: LayoutDashboard, href: '/admin/dashboard' },
    ],
  },
  {
    title: 'Apps',
    items: [
      { label: 'Inquiries', icon: ListIcon, href: '/admin/contact-form', badge: 'New' },
      { label: 'Calender', icon: Calendar, href: '/admin/calender', badge: 'New' },
    ],
  },
  {
    title: 'Crud',
    items: [
      { label: 'Hero Section', icon: FileSpreadsheetIcon, href: '/admin/hero-section', badge: 'CRUD' },
      { label: 'Feature Stories', icon: Timer, href: '/admin/feature-stories', badge: 'CRUD' },
      { label: 'Gallery', icon: Image, href: '/admin/gallery', badge: 'Image' },
      { label: 'Why Us', icon: ThumbsUp, href: '/admin/why-us', badge: 'Image' },
      { label: 'Pricing', icon: IndianRupee, href: '/admin/pricing', badge: 'Money' },
      { label: 'About', icon: User2, href: '/admin/about', badge: 'About' },
      { label: 'Team', icon: Users, href: '/admin/team', badge: 'Teams' },
    ],
  },
  {
    title: 'Design System',
    items: [
      { label: 'Components', icon: Puzzle, href: '/admin/components' },
      { label: 'Settings', icon: Settings, href: '/admin/settings' },
      { label: 'Help', icon: HelpCircle, href: '/admin/help' },
    ],
  },
]