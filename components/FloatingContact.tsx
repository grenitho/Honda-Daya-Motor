
import React from 'react';
import { SalesPerson } from '../types';

interface FloatingContactProps {
  salesInfo: SalesPerson;
}

const FloatingContact: React.FC<FloatingContactProps> = ({ salesInfo }) => {
  const message = encodeURIComponent(`Halo ${salesInfo.name}, saya tertarik dengan unit Honda. Bisa dibantu?`);
  const waUrl = `https://wa.me/${salesInfo.whatsapp}?text=${message}`;

  const firstName = salesInfo.name ? salesInfo.name.split(' ')[0] : 'Sales';

  return (
    <div className="fixed bottom-10 right-8 z-[100] flex flex-col items-end pointer-events-none">
      {/* Sales Avatar & Message Bubble as a Single Clickable Link */}
      <a 
        href={waUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-3 animate-bounce-subtle pointer-events-auto group relative transition-all duration-300 active:scale-95"
      >
        {/* Message Bubble */}
        <div className="absolute right-full mr-4 top-1/2 -translate-y-1/2 whitespace-nowrap bg-white px-5 py-3 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.15)] border border-gray-100 hidden md:block group-hover:scale-105 transition-transform origin-right">
           <div className="flex flex-col">
             <span className="text-[10px] font-black text-honda-red uppercase tracking-widest leading-none mb-1">Online</span>
             <p className="text-sm font-bold text-gray-900 leading-tight">Tanya {firstName} Sekarang</p>
           </div>
           {/* Bubble Tail */}
           <div className="absolute top-1/2 -translate-y-1/2 -right-1.5 w-3 h-3 bg-white border-r border-t border-gray-100 rotate-45"></div>
        </div>

        {/* Avatar Container with WhatsApp Icon Badge */}
        <div className="relative">
          <div className="w-16 h-16 md:w-20 md:h-20 rounded-full border-[5px] border-white shadow-2xl overflow-hidden bg-gray-100 group-hover:scale-110 transition-all duration-500">
            <img 
              src={salesInfo.photo || "https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=400&h=400&auto=format&fit=crop"} 
              alt={salesInfo.name}
              className="w-full h-full object-cover"
            />
          </div>
          
          {/* WhatsApp Badge Overlay */}
          <div className="absolute -bottom-1 -right-1 w-6 h-6 md:w-8 md:h-8 bg-[#25D366] rounded-full border-2 border-white flex items-center justify-center shadow-lg group-hover:rotate-[360deg] transition-transform duration-700">
            <svg viewBox="0 0 24 24" className="w-4 h-4 md:w-5 md:h-5 fill-white" xmlns="http://www.w3.org/2000/svg">
              <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.038 3.284l-.569 2.1c-.149.546.455 1.033.947.817l2.122-.933c.636.247 1.446.433 2.228.433 3.181 0 5.767-2.586 5.768-5.766 0-3.18-2.586-5.766-5.766-5.766zm3.37 8.202c-.121.343-.703.623-1.023.66-.297.036-.685.057-1.116-.081-.274-.087-.615-.222-1.047-.413-1.832-.811-3.033-2.67-3.124-2.793-.093-.124-.753-.997-.753-1.901 0-.905.474-1.349.643-1.541.169-.193.369-.241.493-.241H9.7c.106 0 .248-.004.354.218.106.223.365.889.397.954.032.065.053.14.01.226-.042.086-.063.14-.127.215-.064.075-.134.167-.191.225-.064.065-.131.135-.056.262.075.127.334.55.717.892.492.439.907.575 1.034.638.127.063.201.053.277-.033.075-.086.323-.376.409-.505.086-.129.172-.108.29-.065.118.043.753.355.882.419s.215.107.247.161c.033.053.033.311-.088.654z"/>
            </svg>
          </div>
          
          {/* Pulsing Aura */}
          <div className="absolute inset-0 bg-green-500/20 rounded-full animate-ping -z-10 group-hover:opacity-0 transition-opacity"></div>
        </div>
      </a>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes bounce-subtle {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-8px); }
        }
        .animate-bounce-subtle {
          animation: bounce-subtle 4s infinite ease-in-out;
        }
      `}} />
    </div>
  );
};

export default FloatingContact;
