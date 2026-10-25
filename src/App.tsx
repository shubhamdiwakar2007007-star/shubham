import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/common/Header';
import { Footer } from './components/common/Footer';
import { HomePage } from './components/home/HomePage';
import { MenuPage } from './components/menu/MenuPage';
import { CheckoutPage } from './components/checkout/CheckoutPage';
import { OrderTrackingPage } from './components/orders/OrderTrackingPage';
import { AccountPage } from './components/account/AccountPage';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { AboutPage } from './components/about/AboutPage';
import { BlogPage } from './components/blog/BlogPage';
import { ContactPage } from './components/contact/ContactPage';
import { LegalPages } from './components/legal/LegalPages';
import { CartDrawer } from './components/cart/CartDrawer';
import { FoodDetailModal } from './components/menu/FoodDetailModal';
import { LocationModal } from './components/common/LocationModal';
import { AuthModal } from './components/auth/AuthModal';
import { ToastContainer } from './components/common/ToastContainer';

const AppContent: React.FC = () => {
  const { activePage, openAuthModal, setActivePage } = useApp();

  React.useEffect(() => {
    if (activePage === 'login') {
      openAuthModal('signin');
      setActivePage('home');
    } else if (activePage === 'signup') {
      openAuthModal('signup');
      setActivePage('home');
    }
  }, [activePage, openAuthModal, setActivePage]);

  const renderCurrentPage = () => {
    switch (activePage) {
      case 'home':
        return <HomePage />;
      case 'login':
      case 'signup':
        return <HomePage />;
      case 'menu':
      case 'offers':
        return <MenuPage />;
      case 'checkout':
      case 'cart':
        return <CheckoutPage />;
      case 'orders':
      case 'order-detail':
        return <OrderTrackingPage />;
      case 'account':
        return <AccountPage />;
      case 'admin':
        return <AdminDashboard />;
      case 'about':
        return <AboutPage />;
      case 'blog':
        return <BlogPage />;
      case 'contact':
      case 'faq':
        return <ContactPage />;
      case 'privacy':
        return <LegalPages type="privacy" />;
      case 'terms':
        return <LegalPages type="terms" />;
      case 'refund-policy':
        return <LegalPages type="refund" />;
      case 'delivery-policy':
        return <LegalPages type="delivery" />;
      default:
        return <HomePage />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF8F5] text-[#191919] font-sans antialiased selection:bg-[#FF7518] selection:text-white">
      {/* Sticky Header with Navigation and Cart Counter */}
      <Header />

      {/* Main Page View Container */}
      <div className="flex-1">
        {renderCurrentPage()}
      </div>

      {/* Global Dark Footer matching reference image */}
      <Footer />

      {/* Modals, Drawers and Overlays */}
      <CartDrawer />
      <FoodDetailModal />
      <LocationModal />
      <AuthModal />
      <ToastContainer />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
