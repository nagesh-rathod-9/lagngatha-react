import { Routes, Route, Navigate } from 'react-router-dom'
import { Layout } from '@/components/layout/Layout'
import { DashboardPage } from '@/pages/dashboard/DashboardPage'
import { BillingPage } from '@/pages/billing/BillingPage'
import { ContactsPage } from '@/pages/crm/ContactsPage'
import { ChatPage } from '@/pages/ai/ChatPage'
import { SettingsPage } from '@/pages/settings/SettingsPage'
import { HelpPage } from '@/pages/help/HelpPage'
import { SignInPage } from '@/pages/auth/SignInPage'
import { SignUpPage } from '@/pages/auth/SignUpPage'
import { ForgotPasswordPage } from '@/pages/auth/ForgotPasswordPage'
import { ComponentsPage } from '@/pages/components/ComponentsPage'
import { AdminInquiries } from '@/pages/admin-inquiry/AdminInquiries'
import DayPlanCalendar from './pages/calender/DayPlanCalendar'
import AdminHeroSection from './pages/Crud/AdminHeroSection'
import AdminFeaturedStories from './pages/Crud/AdminFeaturedStories'
import AdminGallerySection from './pages/Crud/AdminGallerySection'
import AdminWhyUsSection from './pages/Crud/AdminWhyUsSection'
import AdminPricingSection from './pages/Crud/AdminPricingSection'
import AdminAboutSection from './pages/Crud/AdminAboutSection'
import AdminTeamSection from './pages/Crud/AdminTeamSection'
import PublicSite from './pages/PublicSite'
import Insights from './components/site/Insights'

export default function App() {
  return (
    <Routes>

      {/* Public Site */}
      <Route path="/insights" element={<Insights />} />

      <Route path="/*" element={<PublicSite />} />

      {/* Auth Routes */}
      <Route path="/sign-in" element={<SignInPage />} />
      <Route path="/sign-up" element={<SignUpPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />

      {/* Admin Routes */}
      <Route path="/admin" element={<Layout />}>

        <Route
          index
          element={<Navigate to="/admin/dashboard" replace />}
        />

        <Route path="dashboard" element={<DashboardPage />} />
        <Route path="billing" element={<BillingPage />} />
        <Route path="crm/contacts" element={<ContactsPage />} />
        <Route path="ai/chat" element={<ChatPage />} />
        <Route path="contact-form" element={<AdminInquiries />} />
        <Route path="calender" element={<DayPlanCalendar />} />

        <Route path="hero-section" element={<AdminHeroSection />} />
        <Route path="feature-stories" element={<AdminFeaturedStories />} />
        <Route path="gallery" element={<AdminGallerySection />} />
        <Route path="why-us" element={<AdminWhyUsSection />} />
        <Route path="pricing" element={<AdminPricingSection />} />
        <Route path="about" element={<AdminAboutSection />} />
        <Route path="team" element={<AdminTeamSection />} />

        <Route path="settings" element={<SettingsPage />} />
        <Route path="help" element={<HelpPage />} />
        <Route path="components" element={<ComponentsPage />} />

      </Route>

    </Routes>
  )
}