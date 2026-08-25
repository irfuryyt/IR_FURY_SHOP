import React from 'react';
import { useStore } from '../context/StoreContext';
import { Home, Gamepad2, ShoppingCart, SearchCode, User } from 'lucide-react';
import { toPersianDigits } from '../utils/helpers';

export const MobileBottomNav: React.FC = () => {
  const { currentView, setCurrentView, cart, currentUser, setIsCartDrawerOpen, setIsAuthModalOpen } = useStore();
  const cartTotal = cart.reduce((sum, i) => sum + i.quantity, 0);

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-slate-950/95 backdrop-blur-xl border-t border-slate-800/80 px-2 py-2 safe-area-bottom">
      <div className="grid grid-cols-5 gap-1 text-center">
        <button
          onClick={() => setCurrentView('home')}
          className={`flex flex-col items-center justify-center py-1 rounded-xl transition-colors ${
            currentView === 'home' ? 'text-amber-400 font-bold' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Home className="w-5 h-5 mb-1" />
          <span className="text-[10px]">خانه</span>
        </button>

        <button
          onClick={() => setCurrentView('games')}
          className={`flex flex-col items-center justify-center py-1 rounded-xl transition-colors ${
            currentView === 'games' ? 'text-amber-400 font-bold' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Gamepad2 className="w-5 h-5 mb-1" />
          <span className="text-[10px]">بازی‌ها</span>
        </button>

        <button
          onClick={() => setIsCartDrawerOpen(true)}
          className="relative flex flex-col items-center justify-center py-1 rounded-xl text-slate-400 hover:text-slate-200 transition-colors"
        >
          <div className="relative">
            <ShoppingCart className="w-5 h-5 mb-1" />
            {cartTotal > 0 && (
              <span className="absolute -top-1.5 -right-2 w-4 h-4 bg-amber-500 text-slate-950 text-[10px] font-extrabold rounded-full flex items-center justify-center">
                {toPersianDigits(cartTotal)}
              </span>
            )}
          </div>
          <span className="text-[10px]">سبد خرید</span>
        </button>

        <button
          onClick={() => setCurrentView('order-tracking')}
          className={`flex flex-col items-center justify-center py-1 rounded-xl transition-colors ${
            currentView === 'order-tracking' ? 'text-amber-400 font-bold' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <SearchCode className="w-5 h-5 mb-1" />
          <span className="text-[10px]">پیگیری</span>
        </button>

        <button
          onClick={() => {
            if (currentUser) {
              setCurrentView('profile');
            } else {
              setIsAuthModalOpen(true);
            }
          }}
          className={`flex flex-col items-center justify-center py-1 rounded-xl transition-colors ${
            currentView === 'profile' ? 'text-amber-400 font-bold' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <User className="w-5 h-5 mb-1" />
          <span className="text-[10px]">{currentUser ? 'پروفایل' : 'ورود'}</span>
        </button>
      </div>
    </div>
  );
};
