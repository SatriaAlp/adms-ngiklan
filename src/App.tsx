import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';

// Home Page Sections
import { HeroSection } from './components/home/HeroSection';
import { CategorySection } from './components/home/CategorySection';
import { FeaturedProducts } from './components/home/FeaturedProducts';
import { PopularProducts } from './components/home/PopularProducts';
import { AdvertisingSection } from './components/home/AdvertisingSection';
import { FeaturedMerchants } from './components/home/FeaturedMerchants';
import { HowItWorksSection } from './components/home/HowItWorksSection';
import { BenefitsSection } from './components/home/BenefitsSection';
import { TestimonialsSection } from './components/home/TestimonialsSection';
import { FaqSection } from './components/home/FaqSection';
import { CtaBanner } from './components/home/CtaBanner';

// Views
import { ProductDetailModal } from './components/marketplace/ProductDetailModal';
import { PaymentPopupModal } from './components/marketplace/PaymentPopupModal';
import { CreateAdModal } from './components/ads/CreateAdModal';
import { HelpView } from './components/help/HelpView';
import { DashboardView } from './components/dashboard/DashboardView';
import { AdminLayout } from './components/admin/AdminLayout';
import { LatestClassifiedAds } from './components/home/LatestClassifiedAds';
import { ClassifiedsCatalogView } from './components/ads/ClassifiedsCatalogView';
import { PostFreeAdView } from './components/ads/PostFreeAdView';
import { UploadProductView } from './components/marketplace/UploadProductView';
import { MerchantRegistrationView } from './components/merchants/MerchantRegistrationView';

// Common Components
import { ScrollReveal } from './components/common/ScrollReveal';
import { LoginModal } from './components/common/LoginModal';

// Overlay Widgets
import { CartDrawer } from './components/cart/CartDrawer';
import { ChatBotWidget } from './components/chat/ChatBotWidget';
import { ToastContainer } from './components/ui/ToastContainer';
import { ErrorBoundary } from './components/common/ErrorBoundary';

const MainContent: React.FC = () => {
  const { activeTab, activeRole } = useApp();

  // Route specifically for the Admin Back-Office
  if (activeRole === 'ADMIN' && activeTab === 'dashboard') {
    return (
      <>
        <AdminLayout />
        {/* We still need global modals that admin might trigger */}
        <ToastContainer />
        <LoginModal />
      </>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC] text-slate-900 selection:bg-emerald-500 selection:text-white font-sans">
      <Navbar />

      <main className="flex-1">
        {activeTab === 'home' && (
          <div className="space-y-4">
            <HeroSection />
            <ScrollReveal><CategorySection /></ScrollReveal>
            <ScrollReveal><FeaturedProducts /></ScrollReveal>
            <ScrollReveal><AdvertisingSection /></ScrollReveal>
            <ScrollReveal><PopularProducts /></ScrollReveal>
            <ScrollReveal><FeaturedMerchants /></ScrollReveal>
            <ScrollReveal><HowItWorksSection /></ScrollReveal>
            <ScrollReveal><BenefitsSection /></ScrollReveal>
            <ScrollReveal><TestimonialsSection /></ScrollReveal>
            <ScrollReveal><FaqSection /></ScrollReveal>
            <ScrollReveal variant="zoom-in"><CtaBanner /></ScrollReveal>
          </div>
        )}

        {activeTab === 'iklan-gratis' && <ClassifiedsCatalogView />}
        {activeTab === 'pasang-iklan-gratis' && <PostFreeAdView />}
        {activeTab === 'upload-produk' && <UploadProductView />}
        {activeTab === 'daftar-merchant' && <MerchantRegistrationView />}
        {activeTab === 'bantuan' && <HelpView />}
        {activeTab === 'dashboard' && <DashboardView />}
      </main>

      <Footer />

      {/* Global Modals & Overlay Drawers */}
      <ProductDetailModal />
      <PaymentPopupModal />
      <CreateAdModal />
      <CartDrawer />
      <ChatBotWidget />
      <ToastContainer />
      <LoginModal />
    </div>
  );
};

export default function App() {
  return (
    <ErrorBoundary>
      <AppProvider>
        <MainContent />
      </AppProvider>
    </ErrorBoundary>
  );
}
