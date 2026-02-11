
import React from 'react';

interface NavbarProps {
  onNavigate: (view: 'home' | 'about' | 'contact') => void;
  currentView: string;
  logo: string | null;
  dealerName: string;
  onOpenSettings: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ onNavigate, currentView, logo, dealerName, onOpenSettings }) => {
  // Logic to split name for two-tone color effect if it contains spaces
  const nameParts = dealerName.split(' ');
  const firstName = nameParts[0];
  const restName = nameParts.slice(1).join(' ');

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div 
            className="flex items-center gap-2 cursor-pointer" 
            onClick={() => onNavigate('home')}
          >
            {/* Logo Section */}
            {logo ? (
              <img src={logo} alt="Logo" className="h-10 w-auto object-contain" />
            ) : (
              <div className="w-10 h-10 bg-honda-red rounded-sm flex items-center justify-center flex-shrink-0">
                <span className="text-white font-black text-xl italic">H</span>
              </div>
            )}
            
            <span className="text-xl font-extrabold tracking-tighter text-gray-900 hidden sm:inline uppercase">
              {firstName} <span className="text-gray-400 font-light">{restName}</span>
            </span>
          </div>
          
          <div className="flex items-center space-x-4 md:space-x-8">
            <div className="hidden md:flex space-x-8 text-sm font-semibold uppercase tracking-wider">
              <button 
                onClick={() => onNavigate('home')}
                className={`${currentView === 'home' ? 'text-honda-red' : 'text-gray-600'} hover:text-honda-red transition-colors`}
              >
                Katalog
              </button>
              <button 
                onClick={() => onNavigate('about')}
                className={`${currentView === 'about' ? 'text-honda-red' : 'text-gray-600'} hover:text-honda-red transition-colors`}
              >
                Tentang Kami
              </button>
              <button 
                onClick={() => onNavigate('contact')}
                className={`${currentView === 'contact' ? 'text-honda-red' : 'text-gray-600'} hover:text-honda-red transition-colors`}
              >
                Kontak
              </button>
            </div>

            <div className="h-6 w-px bg-gray-200 hidden md:block"></div>

            <button 
              onClick={onOpenSettings}
              className="p-2 text-gray-400 hover:text-honda-red transition-colors"
              title="Admin Settings"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37a1.724 1.724 0 002.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </button>

            <button 
              onClick={() => onNavigate('contact')}
              className="bg-honda-red text-white px-4 md:px-6 py-2 rounded font-bold uppercase text-[10px] md:text-xs hover:bg-red-700 transition-all shadow-sm"
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
