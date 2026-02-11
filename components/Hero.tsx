
import React from 'react';
import { SalesPerson } from '../types';

interface HeroProps {
  salesInfo: SalesPerson;
}

const Hero: React.FC<HeroProps> = ({ salesInfo }) => {
  return (
    <section className="relative h-[700px] flex items-center bg-black overflow-hidden">
      <div className="absolute inset-0 opacity-50">
        <img 
          src="https://images.unsplash.com/photo-1558981806-ec527fa84c39?q=80&w=2070&auto=format&fit=crop" 
          alt="Honda Hero" 
          className="w-full h-full object-cover"
        />
      </div>
      <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-black via-black/60 to-transparent"></div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-white grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        <div>
          <div className="flex items-center gap-4 mb-8">
            <div className="w-12 h-0.5 bg-honda-red"></div>
            <span className="uppercase tracking-[0.4em] text-xs font-bold text-honda-red">Authorized Honda Consultant</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-black italic tracking-tighter leading-none mb-6">
            DREAM IT. <br />
            <span className="text-honda-red">RIDE IT.</span>
          </h1>
          <p className="text-lg md:text-xl max-w-md text-gray-300 mb-10 font-light leading-relaxed">
            Hi, I'm <span className="font-bold text-white underline decoration-honda-red underline-offset-4">{salesInfo.name}</span>. 
            I'm here to help you navigate the best choices for your next Honda with special deals just for you.
          </p>
          <div className="flex flex-wrap gap-4">
            <button className="bg-honda-red px-8 py-4 font-bold uppercase tracking-widest hover:bg-red-700 transition-all shadow-lg shadow-red-900/40">
              Lihat Katalog
            </button>
            <button className="border border-white/30 backdrop-blur-sm px-8 py-4 font-bold uppercase tracking-widest hover:bg-white hover:text-black transition-all">
              Hubungi Saya
            </button>
          </div>
        </div>

        <div className="hidden md:flex justify-end">
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-honda-red to-red-800 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
            <div className="relative bg-black/40 backdrop-blur-md p-4 rounded-2xl border border-white/10">
              <img 
                src={salesInfo.photo} 
                alt={salesInfo.name}
                className="w-72 h-96 object-cover rounded-xl grayscale hover:grayscale-0 transition-all duration-500"
              />
              <div className="mt-4 text-center">
                <p className="text-xl font-black italic tracking-tighter uppercase">{salesInfo.name}</p>
                <p className="text-xs text-honda-red font-bold uppercase tracking-widest mt-1">{salesInfo.role}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
