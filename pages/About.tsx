
import React from 'react';
import { SalesPerson } from '../types';

interface AboutProps {
  salesInfo: SalesPerson;
  storyTitle: string;
  storyCity: string;
  storyText1: string;
  storyText2: string;
  salesAboutMessage: string;
}

const About: React.FC<AboutProps> = ({ salesInfo, storyTitle, storyCity, storyText1, storyText2, salesAboutMessage }) => {
  return (
    <div className="min-h-screen bg-white">
      {/* Page Header */}
      <div className="bg-gray-950 py-24 relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <img src="https://images.unsplash.com/photo-1558981403-c5f9899a28bc?q=80&w=2070" className="w-full h-full object-cover" alt="bg" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl md:text-6xl font-black italic tracking-tighter text-white uppercase mb-4">
            About <span className="text-honda-red">Us</span>
          </h1>
          <p className="text-gray-400 max-w-2xl mx-auto font-light">
            Menghadirkan kebahagiaan dan kebebasan berkendara melalui produk Honda berkualitas tinggi.
          </p>
        </div>
      </div>

      {/* Vision & Mission */}
      <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <div>
            <span className="text-honda-red font-bold uppercase tracking-[0.3em] text-xs mb-4 block">Our Story</span>
            <h2 className="text-3xl font-black italic tracking-tighter uppercase mb-6">
              {storyTitle} <span className="text-honda-red">{storyCity}</span>
            </h2>
            <p className="text-gray-600 leading-relaxed mb-6">
              {storyText1}
            </p>
            <p className="text-gray-600 leading-relaxed">
              {storyText2}
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-50 p-8 rounded-2xl border border-gray-100">
              <h3 className="text-honda-red font-black text-4xl mb-2">10k+</h3>
              <p className="text-xs font-bold uppercase text-gray-400 tracking-widest">Unit Terjual</p>
            </div>
            <div className="bg-gray-50 p-8 rounded-2xl border border-gray-100">
              <h3 className="text-honda-red font-black text-4xl mb-2">50+</h3>
              <p className="text-xs font-bold uppercase text-gray-400 tracking-widest">Tenaga Ahli</p>
            </div>
            <div className="bg-gray-50 p-8 rounded-2xl border border-gray-100">
              <h3 className="text-honda-red font-black text-4xl mb-2">100%</h3>
              <p className="text-xs font-bold uppercase text-gray-400 tracking-widest">Suku Cadang Asli</p>
            </div>
            <div className="bg-gray-50 p-8 rounded-2xl border border-gray-100">
              <h3 className="text-honda-red font-black text-4xl mb-2">4.9</h3>
              <p className="text-xs font-bold uppercase text-gray-400 tracking-widest">Rating Kepuasan</p>
            </div>
          </div>
        </div>
      </section>

      {/* Personal Message from Sales */}
      <section className="bg-gray-50 py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-[2rem] overflow-hidden shadow-xl flex flex-col md:flex-row items-stretch">
            <div className="md:w-1/3">
              <img src={salesInfo.photo} className="w-full h-full object-cover grayscale" alt={salesInfo.name} />
            </div>
            <div className="md:w-2/3 p-12 flex flex-col justify-center">
              <h3 className="text-2xl font-black italic uppercase tracking-tighter mb-4">Pesan Dari <span className="text-honda-red">Konsultan Anda</span></h3>
              <p className="text-gray-600 italic text-lg leading-relaxed mb-8">
                "{salesAboutMessage}"
              </p>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-honda-red rounded-full flex items-center justify-center text-white font-black italic">H</div>
                <div>
                  <p className="font-bold text-gray-900">{salesInfo.name}</p>
                  <p className="text-xs text-gray-400 uppercase font-bold tracking-widest">{salesInfo.role}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
