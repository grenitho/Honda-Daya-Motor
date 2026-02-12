
import React from 'react';
import { SalesPerson } from '../types';

interface SalesProfileProps {
  salesInfo: SalesPerson;
}

const SalesProfile: React.FC<SalesProfileProps> = ({ salesInfo }) => {
  return (
    <section className="bg-white py-24 border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <span className="text-honda-red font-bold uppercase tracking-[0.3em] text-xs mb-4 block">Sales Digital HONDA</span>
          <h2 className="text-4xl md:text-5xl font-black italic tracking-tighter uppercase mb-8 leading-tight">
            Kenapa Memilih Beli Lewat <span className="text-honda-red">Saya?</span>
          </h2>
          
          <div className="relative mb-12">
            <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-gray-100 text-8xl font-serif leading-none select-none">“</div>
            <p className="relative z-10 text-gray-600 text-xl md:text-2xl leading-relaxed italic px-4 md:px-12">
              {salesInfo.bio}
            </p>
            <div className="absolute -bottom-12 left-1/2 -translate-x-1/2 text-gray-100 text-8xl font-serif leading-none select-none rotate-180">“</div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16 text-left">
            <div className="p-8 bg-gray-50 rounded-3xl border border-gray-100 hover:border-honda-red transition-all group">
              <div className="w-14 h-14 bg-white rounded-2xl shadow-sm flex items-center justify-center mb-6 group-hover:bg-honda-red transition-colors">
                <svg className="w-7 h-7 text-honda-red group-hover:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h4 className="font-black italic uppercase tracking-tighter text-lg mb-2">Proses Cepat & Transparan</h4>
              <p className="text-sm text-gray-500 leading-relaxed">STNK & BPKB diurus kilat. Saya pastikan setiap tahapan administrasi berjalan transparan tanpa biaya tersembunyi.</p>
            </div>
            
            <div className="p-8 bg-gray-50 rounded-3xl border border-gray-100 hover:border-honda-red transition-all group">
              <div className="w-14 h-14 bg-white rounded-2xl shadow-sm flex items-center justify-center mb-6 group-hover:bg-honda-red transition-colors">
                <svg className="w-7 h-7 text-honda-red group-hover:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h4 className="font-black italic uppercase tracking-tighter text-lg mb-2">Solusi DP & Cicilan Ringan</h4>
              <p className="text-sm text-gray-500 leading-relaxed">Negosiasi fleksibel sesuai budget Anda. Tersedia berbagai pilihan leasing terpercaya dengan promo cashback menarik.</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <a 
              href={`tel:${salesInfo.phone}`}
              className="flex items-center justify-center gap-3 px-10 py-5 bg-gray-900 text-white rounded-xl font-bold uppercase text-xs tracking-widest hover:bg-black transition-all shadow-xl active:scale-95"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
              </svg>
              Hubungi via Telepon
            </a>
            <a 
              href={`mailto:${salesInfo.email}`}
              className="flex items-center justify-center gap-3 px-10 py-5 border border-gray-200 rounded-xl font-bold uppercase text-xs tracking-widest hover:bg-gray-50 transition-all shadow-sm active:scale-95"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
              </svg>
              Kirim Email
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SalesProfile;
