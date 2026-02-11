
import React from 'react';
import { SalesPerson } from '../types';

interface SalesProfileProps {
  salesInfo: SalesPerson;
}

const SalesProfile: React.FC<SalesProfileProps> = ({ salesInfo }) => {
  return (
    <section className="bg-white py-24 border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
          <div className="lg:col-span-5 relative">
            <div className="absolute -top-10 -left-10 w-40 h-40 bg-honda-red rounded-full opacity-5"></div>
            <img 
              src={salesInfo.photo} 
              alt={salesInfo.name} 
              className="relative rounded-3xl shadow-2xl w-full aspect-[4/5] object-cover"
            />
            <div className="absolute -bottom-6 -right-6 bg-honda-red p-8 text-white rounded-2xl shadow-xl">
              <p className="text-4xl font-black italic mb-1">{salesInfo.experience}</p>
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] opacity-80">Experience in Honda</p>
            </div>
          </div>

          <div className="lg:col-span-7">
            <span className="text-honda-red font-bold uppercase tracking-[0.3em] text-xs mb-4 block">Personal Consultant</span>
            <h2 className="text-4xl md:text-5xl font-black italic tracking-tighter uppercase mb-8 leading-tight">
              Kenapa Memilih Beli Lewat <span className="text-honda-red">Saya?</span>
            </h2>
            <p className="text-gray-600 text-lg leading-relaxed mb-10 italic border-l-4 border-honda-red pl-6">
              "{salesInfo.bio}"
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
              <div className="p-6 bg-gray-50 rounded-2xl border border-gray-100 hover:border-honda-red transition-colors group">
                <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center mb-4 group-hover:bg-honda-red transition-colors">
                  <svg className="w-6 h-6 text-honda-red group-hover:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h4 className="font-black italic uppercase tracking-tighter mb-2">Proses Cepat</h4>
                <p className="text-sm text-gray-500">STNK & BPKB diurus kilat dengan administrasi transparan.</p>
              </div>
              <div className="p-6 bg-gray-50 rounded-2xl border border-gray-100 hover:border-honda-red transition-colors group">
                <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center mb-4 group-hover:bg-honda-red transition-colors">
                  <svg className="w-6 h-6 text-honda-red group-hover:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h4 className="font-black italic uppercase tracking-tighter mb-2">DP & Cicilan Ringan</h4>
                <p className="text-sm text-gray-500">Negosiasi fleksibel sesuai budget Anda. Banyak promo cashback!</p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <a 
                href={`tel:${salesInfo.phone}`}
                className="flex items-center justify-center gap-3 px-8 py-4 bg-gray-900 text-white rounded font-bold uppercase text-xs tracking-widest hover:bg-black transition-all"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                </svg>
                {salesInfo.phone}
              </a>
              <a 
                href={`mailto:${salesInfo.email}`}
                className="flex items-center justify-center gap-3 px-8 py-4 border border-gray-200 rounded font-bold uppercase text-xs tracking-widest hover:bg-gray-50 transition-all"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                  <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                </svg>
                {salesInfo.email}
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SalesProfile;
