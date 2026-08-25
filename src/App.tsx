import React, { useEffect } from 'react';
import { StoreProvider, useStore } from './context/StoreContext';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { MobileBottomNav } from './components/MobileBottomNav';
import { CartDrawer } from './components/CartDrawer';
import { QuickSearchModal } from './components/QuickSearchModal';
import { AuthModal } from './components/AuthModal';
import { ToastContainer } from './components/ToastContainer';

// Views
import { HomeView } from './views/HomeView';
import { AllProductsView } from './views/AllProductsView';
import { ProductDetailView } from './views/ProductDetailView';
import { CartView } from './views/CartView';
import { CheckoutView } from './views/CheckoutView';
import { PaymentGatewayView } from './views/PaymentGatewayView';
import { OrderSuccessView } from './views/OrderSuccessView';
import { OrderTrackingView } from './views/OrderTrackingView';
import { UserProfileView } from './views/UserProfileView';
import { AdminPanelView } from './views/AdminPanelView';
import { BlogView } from './views/BlogView';
import { ArticleDetailView } from './views/ArticleDetailView';
import { AboutUsView } from './views/AboutUsView';
import { ContactUsView } from './views/ContactUsView';
import { FAQView } from './views/FAQView';
import { TermsView } from './views/TermsView';
import { PrivacyPolicyView } from './views/PrivacyPolicyView';

const MainContent: React.FC = () => {
  const { currentView, lastTrackingCode } = useStore();

  // Scroll to top on view change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' as any });
  }, [currentView]);

  const renderView = () => {
    switch (currentView) {
      case 'home':
        return <HomeView />;
      case 'games':
        return (
          <AllProductsView
            initialCategory="games"
            pageTitle="خرید مستقیم سی پی، یوسی و جم بازی‌ها"
            pageSubtitle="شارژ انواع بازی‌های پرطرفدار آنلاین شامل کالاف دیوتی، پابجی موبایل، فری فایر، کلش، موبایل لجندز و..."
          />
        );
      case 'premium':
        return (
          <AllProductsView
            initialCategory="premium"
            pageTitle="خرید اکانت‌ها و اشتراک‌های پریمیوم"
            pageSubtitle="فعال‌سازی قانونی تلگرام پریمیوم، هوش مصنوعی ChatGPT Plus، اسپاتیفای، یوتیوب و دیسکورد با تحویل سریع"
          />
        );
      case 'giftcards':
        return (
          <AllProductsView
            initialCategory="giftcards"
            pageTitle="خرید انواع گیفت کارت اورجینال"
            pageSubtitle="کدهای اورجینال گوگل پلی، پلی استیشن، اپل، استیم والت، ایکس باکس و ریزر گلد با تحویل اتوماتیک"
          />
        );
      case 'products':
        return <AllProductsView />;
      case 'product-detail':
        return <ProductDetailView />;
      case 'cart':
        return <CartView />;
      case 'checkout':
        return <CheckoutView />;
      case 'payment-gateway':
        return <PaymentGatewayView />;
      case 'order-success':
        return <OrderSuccessView />;
      case 'order-tracking':
        return <OrderTrackingView initialTrackingCode={lastTrackingCode} />;
      case 'profile':
        return <UserProfileView />;
      case 'admin':
        return <AdminPanelView />;
      case 'blog':
        return <BlogView />;
      case 'blog-article':
        return <ArticleDetailView />;
      case 'about':
        return <AboutUsView />;
      case 'contact':
        return <ContactUsView />;
      case 'faq':
        return <FAQView />;
      case 'terms':
        return <TermsView />;
      case 'privacy':
        return <PrivacyPolicyView />;
      default:
        return <HomeView />;
    }
  };

  return (
    <div className="min-h-screen bg-[#020617] text-slate-100 flex flex-col font-sans selection:bg-indigo-500 selection:text-white" dir="rtl">
      <Header />
      <main className="flex-1 pb-16 lg:pb-0">{renderView()}</main>
      <Footer />
      <MobileBottomNav />

      {/* Global Modals & Drawers */}
      <CartDrawer />
      <QuickSearchModal />
      <AuthModal />
      <ToastContainer />
    </div>
  );
};

export default function App() {
  return (
    <StoreProvider>
      <MainContent />
    </StoreProvider>
  );
}
