
import React, { useState, useEffect, useCallback } from 'react';
import { Promo, SalesPerson } from '../types';

interface PromoSectionProps {
  salesInfo: SalesPerson;
  promos: Promo[];
}

const PromoSection: React.FC<PromoSectionProps> = ({ salesInfo, promos }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [itemsToShow, setItemsToShow] = useState(2);

  // Update jumlah item yang ditampilkan berdasarkan lebar layar
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setItemsToShow(1);
      } else {
        setItemsToShow(2);
      }
    };
    
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const maxIndex = Math.max(0, promos.length - itemsToShow);

  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
  }, [maxIndex]);

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev <= 0 ? maxIndex : prev - 1));
  };

  // Auto-play feature
  useEffect(() => {
    if (promos.length <= itemsToShow) return;
    const interval = setInterval(nextSlide, 5000);
    return () => clearInterval(interval);
  }, [nextSlide, promos.length, itemsToShow]);

  if (!promos || promos.length === 0) return null;

  return (
    <section className="py-20 bg-gray-50 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-4">
          <div>
            <span className="text-honda-red font-black uppercase tracking-widest text-[10px] bg-red-50 px-3 py-1 rounded-full mb-4 inline-block">Exclusive Deals</span>
            <h2 className="text-4xl font-black italic tracking-tighter uppercase leading-none">
              Program <span className="text-honda-red">Promo</span> Bulan Ini
            </h2>
          </div>
          
          {/* Slider Controls */}
          {promos.length > itemsToShow && (
            <div className="flex gap-2">
              <button 
                onClick={prevSlide}
                className="w-12 h-12 rounded-xl bg-white border border-gray-200 flex items-center justify-center text-gray-400 hover:text-honda-red hover:border-honda-red transition-all shadow-sm"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button 
                onClick={nextSlide}
                className="w-12 h-12 rounded-xl bg-white border border-gray-200 flex items-center justify-center text-gray-400 hover:text-honda-red hover:border-honda-red transition-all shadow-sm"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          )}
        </div>

        {/* Carousel Container */}
        <div className="relative">
          <div 
            className="flex transition-transform duration-500 ease-in-out"
            style={{ 
              transform: `translateX(-${currentIndex * (100 / itemsToShow)}%)`,
            }}
          >
            {promos.map((promo) => {
              const waMessage = encodeURIComponent(`Halo ${salesInfo.name}, ${promo.whatsappSuffix}`);
              const waUrl = `https://wa.me/${salesInfo.whatsapp}?text=${waMessage}`;

              return (
                <div 
                  key={promo.id}
                  className={`flex-shrink-0 px-3`}
                  style={{ width: `${100 / itemsToShow}%` }}
                >
                  <div className="group relative h-[350px] md:h-[300px] rounded-3xl overflow-hidden shadow-2xl shadow-gray-200 border border-white">
                    <img 
                      src={promo.image} 
                      alt={promo.title} 
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent"></div>
                    
                    <div className="absolute inset-0 p-8 flex flex-col justify-end">
                      <span className="bg-honda-red text-white text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full w-fit mb-4">
                        {promo.tag}
                      </span>
                      <h3 className="text-2xl font-black text-white italic uppercase tracking-tighter mb-2">
                        {promo.title}
                      </h3>
                      <p className="text-gray-300 text-sm mb-6 max-w-xs line-clamp-2">
                        {promo.subtitle}
                      </p>
                      
                      <div className="flex items-center justify-between">
                        <a 
                          href={waUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="bg-white text-black hover:bg-honda-red hover:text-white px-6 py-3 rounded-xl font-black uppercase text-[10px] tracking-widest transition-all shadow-lg"
                        >
                          Ambil Promo
                        </a>
                        
                        <div className="hidden sm:flex flex-col items-end">
                          <p className="text-[8px] text-gray-400 font-bold uppercase tracking-widest">Valid Until</p>
                          <p className="text-white font-black italic text-xs uppercase">Akhir Bulan</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Indicators (Dots) */}
        {promos.length > itemsToShow && (
          <div className="flex justify-center gap-2 mt-8">
            {Array.from({ length: maxIndex + 1 }).map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                className={`h-1.5 transition-all duration-300 rounded-full ${currentIndex === idx ? 'w-8 bg-honda-red' : 'w-2 bg-gray-300'}`}
              />
            ))}
          </div>
        )}

        {salesInfo.personalizedPromo && (
          <div className="mt-16 p-8 bg-honda-red rounded-[2rem] text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl shadow-red-100">
            <div className="flex items-center gap-6">
              <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-md">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
                </svg>
              </div>
              <div>
                <h4 className="text-xl font-black italic uppercase tracking-tighter">Pesan Khusus Dari {salesInfo.name.split(' ')[0]}</h4>
                <p className="text-red-100 text-sm font-medium">"{salesInfo.personalizedPromo}"</p>
              </div>
            </div>
            <button 
              onClick={() => {
                const msg = encodeURIComponent(`Halo ${salesInfo.name}, saya ingin konsultasi mengenai Bonus: ${salesInfo.personalizedPromo}`);
                window.open(`https://wa.me/${salesInfo.whatsapp}?text=${msg}`, '_blank');
              }}
              className="bg-white text-gray-900 px-8 py-4 rounded-xl font-black uppercase text-xs tracking-widest hover:bg-gray-100 transition-all shrink-0 shadow-lg active:scale-95"
            >
              Konsultasi Bonus
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

export default PromoSection;
