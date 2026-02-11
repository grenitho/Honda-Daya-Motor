
import React from 'react';

interface NavbarProps {
  onNavigate: (view: 'home' | 'about' | 'contact') => void;
  currentView: string;
  logo: string | null;
  dealerName: string;
  onOpenSettings: () => void;
  onOpenSalesProfile: () => void;
  onOpenPromos: () => void;
  onOpenCatalog: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ 
  onNavigate, 
  currentView, 
  logo, 
  dealerName, 
  onOpenSettings,
  onOpenSalesProfile,
  onOpenPromos,
  onOpenCatalog
}) => {
  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <div 
            className="flex items-center gap-4 cursor-pointer" 
            onClick={() => onNavigate('home')}
          >
            {logo ? (
              <img src={logo} alt="Logo" className="h-14 w-auto object-contain transition-all hover:scale-105" />
            ) : (
              <div className="w-12 h-12 bg-honda-red rounded-sm flex items-center justify-center flex-shrink-0">
                <span className="text-white font-black text-2xl italic">H</span>
              </div>
            )}
            
            <div className="flex flex-col justify-center">
              <span className="text-sm md:text-xl font-black text-blue-950 uppercase tracking-tighter hidden sm:inline leading-none border-l-2 border-gray-100 pl-4 ml-1 py-1">
                {dealerName}
              </span>
            </div>
          </div>
          
          <div className="flex items-center space-x-2 md:space-x-4">
            <div className="hidden lg:flex space-x-6 text-[10px] font-black uppercase tracking-widest mr-4">
              <button 
                onClick={() => onNavigate('home')}
                className={`${currentView === 'home' ? 'text-honda-red' : 'text-gray-400'} hover:text-honda-red transition-colors`}
              >
                Katalog
              </button>
              <button 
                onClick={() => onNavigate('about')}
                className={`${currentView === 'about' ? 'text-honda-red' : 'text-gray-400'} hover:text-honda-red transition-colors`}
              >
                Tentang
              </button>
              <button 
                onClick={() => onNavigate('contact')}
                className={`${currentView === 'contact' ? 'text-honda-red' : 'text-gray-400'} hover:text-honda-red transition-colors`}
              >
                Kontak
              </button>
            </div>

            {/* STAFF TOOLS GROUP */}
            <div className="flex items-center bg-gray-50 rounded-full px-2 py-1 gap-1 md:gap-2 border border-gray-100">
              <button 
                onClick={onOpenPromos}
                className="p-2 text-gray-400 hover:text-honda-red transition-colors"
                title="Kelola Promo"
              >
                <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                </svg>
              </button>

              <button 
                onClick={onOpenCatalog}
                className="p-2 text-gray-400 hover:text-honda-red transition-colors"
                title="Kelola Katalog"
              >
                <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" />
                </svg>
              </button>

              <div className="w-[1px] h-4 bg-gray-200 mx-1"></div>

              <button 
                onClick={onOpenSalesProfile}
                className="p-2 text-gray-400 hover:text-honda-red transition-colors"
                title="Profil Sales Saya"
              >
                <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </button>

              <button 
                onClick={onOpenSettings}
                className="p-2 text-gray-400 hover:text-honda-red transition-colors"
                title="Admin Settings"
              >
                <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37a1.724 1.724 0 002.572-1.065z" />
                </svg>
              </button>
            </div>

            <button 
              onClick={() => onNavigate('contact')}
              className="bg-honda-red text-white px-3 md:px-5 py-2 rounded font-black uppercase text-[10px] hover:bg-red-700 transition-all shadow-sm hidden sm:block"
            >
              Hubungi Sales
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
