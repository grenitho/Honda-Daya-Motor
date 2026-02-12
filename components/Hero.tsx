
import React from 'react';
import { SalesPerson } from '../types';

interface HeroProps {
  salesInfo: SalesPerson;
}

const Hero: React.FC<HeroProps> = ({ salesInfo }) => {
  // Defensive check: pastikan salesInfo ada
  if (!salesInfo) return <div className="h-[700px] bg-black"></div>;

  // Membagi headline berdasarkan simbol '|' untuk kontrol baris yang sempurna
  const headline = salesInfo.heroHeadline || 'SALAM SATU | HATI';
  const parts = headline.split('|');
  const line1 = parts[0]?.trim() || '';
  const line2 = parts[1]?.trim() || '';

  return (
    <section className="relative min-h-[800px] md:h-[700px] flex items-center bg-black overflow-hidden py-16 md:py-0">
      {/* Background Image */}
      <div className="absolute inset-0 opacity-60 md:opacity-70">
        <img 
          src={salesInfo.heroBackground || "https://images.unsplash.com/photo-1558981806-ec527fa84c39?q=80&w=2070&auto=format&fit=crop"} 
          alt="Honda Hero" 
          className="w-full h-full object-cover"
        />
      </div>
      
      {/* Overlay Gradients */}
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 md:via-black/60 to-transparent"></div>
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-transparent md:hidden"></div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-white grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        
        {/* PHOTO PROFILE (Urutan Pertama di Mobile, Kedua di Desktop) */}
        <div className="flex justify-center md:justify-end order-1 md:order-2 mb-4 md:mb-0">
          <div className="relative group">
            {/* Glow Effect */}
            <div className="absolute -inset-1 bg-gradient-to-r from-honda-red to-red-800 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-1000"></div>
            
            {/* Card Container */}
            <div className="relative bg-black/40 backdrop-blur-md p-3 md:p-4 rounded-2xl border border-white/10 shadow-2xl">
              <img 
                src={salesInfo.photo || "https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=400&h=400&auto=format&fit=crop"} 
                alt={salesInfo.name}
                className="w-56 h-72 md:w-72 md:h-96 object-cover rounded-xl transition-all duration-700 shadow-inner"
              />
              <div className="mt-4 text-center">
                <p className="text-lg md:text-xl font-black italic tracking-tighter uppercase leading-none">{salesInfo.name}</p>
                <p className="text-[10px] text-honda-red font-bold uppercase tracking-widest mt-1.5">{salesInfo.role}</p>
              </div>
            </div>
          </div>
        </div>

        {/* TEXT CONTENT (Urutan Kedua di Mobile, Pertama di Desktop) */}
        <div className="order-2 md:order-1 flex flex-col items-center md:items-start text-center md:text-left">
          <div className="flex items-center gap-4 mb-6 md:mb-8">
            <div className="w-8 md:w-12 h-0.5 bg-honda-red hidden sm:block"></div>
            <span className="uppercase tracking-[0.3em] md:tracking-[0.4em] text-[10px] md:text-xs font-black text-honda-red">
              {salesInfo.heroBadge || 'Authorized Honda Consultant'}
            </span>
          </div>
          
          <h1 className="text-4xl md:text-7xl font-black italic tracking-tighter leading-none mb-6 uppercase">
            {line1} <br />
            <span className="text-honda-red">
              {line2}
            </span>
          </h1>
          
          <p className="text-base md:text-xl max-w-md text-gray-300 mb-10 font-light leading-relaxed">
            Hai, Saya <span className="font-bold text-white underline decoration-honda-red underline-offset-4">{salesInfo.name.split(' ')[0]}</span>. 
            <span className="opacity-90 ml-1">{salesInfo.heroIntro || ''}</span>
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
            <a href="#katalog" className="bg-honda-red px-10 py-4 font-black uppercase text-xs tracking-widest hover:bg-red-700 transition-all shadow-lg shadow-red-900/40 text-center rounded-sm">
              Lihat Katalog
            </a>
            <button 
              onClick={() => {
                const message = encodeURIComponent(`Halo ${salesInfo.name}, saya ingin konsultasi mengenai unit Honda.`);
                window.open(`https://wa.me/${salesInfo.whatsapp}?text=${message}`, '_blank');
              }}
              className="border border-white/30 bg-white/5 backdrop-blur-sm px-10 py-4 font-black uppercase text-xs tracking-widest hover:bg-white hover:text-black transition-all rounded-sm"
            >
              Hubungi Sales
            </button>
          </div>
        </div>

      </div>
    </section>
  );
};

export default Hero;
