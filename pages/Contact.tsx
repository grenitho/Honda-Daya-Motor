
import React from 'react';
import { SalesPerson } from '../types';

interface ContactProps {
  salesInfo: SalesPerson;
}

const Contact: React.FC<ContactProps> = ({ salesInfo }) => {
  const waUrl = `https://wa.me/${salesInfo.whatsapp}?text=${encodeURIComponent(`Halo ${salesInfo.name}, saya ingin bertanya tentang promo unit Honda.`)}`;

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="text-center mb-16">
          <span className="text-honda-red font-bold uppercase tracking-[0.3em] text-xs mb-4 block">Get In Touch</span>
          <h1 className="text-5xl font-black italic tracking-tighter uppercase mb-4">Hubungi <span className="text-honda-red">Kami</span></h1>
          <p className="text-gray-500 max-w-xl mx-auto italic">
            Punya pertanyaan mengenai unit, simulasi kredit, atau test ride? Saya siap membantu Anda kapan saja.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Contact Info Cards */}
          <div className="space-y-6">
            <div className="p-8 bg-gray-50 rounded-2xl border border-gray-100 hover:border-honda-red transition-all group">
              <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center mb-6 group-hover:bg-honda-red transition-colors">
                <svg className="w-6 h-6 text-honda-red group-hover:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
              </div>
              <h4 className="font-black italic uppercase tracking-tighter mb-2">Telepon / WA</h4>
              <p className="text-gray-500 text-sm mb-4">Fast response via WhatsApp konsultasi gratis.</p>
              <a href={`tel:${salesInfo.phone}`} className="text-gray-900 font-bold hover:text-honda-red transition-colors">{salesInfo.phone}</a>
            </div>

            <div className="p-8 bg-gray-50 rounded-2xl border border-gray-100 hover:border-honda-red transition-all group">
              <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center mb-6 group-hover:bg-honda-red transition-colors">
                <svg className="w-6 h-6 text-honda-red group-hover:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <h4 className="font-black italic uppercase tracking-tighter mb-2">Lokasi Dealer</h4>
              <p className="text-gray-500 text-sm mb-4">Kunjungi showroom kami untuk melihat unit langsung.</p>
              <p className="text-gray-900 font-bold">Jl. Astra Honda No. 1, Jakarta</p>
            </div>

            <a 
              href={waUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="block p-8 bg-honda-red text-white rounded-2xl shadow-xl shadow-red-200 text-center group overflow-hidden relative"
            >
              <div className="relative z-10">
                <h4 className="font-black italic uppercase tracking-tighter mb-2">Chat WhatsApp</h4>
                <p className="text-sm opacity-80">Klik untuk langsung terhubung.</p>
              </div>
              <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-white/10 rounded-full group-hover:scale-150 transition-transform duration-700"></div>
            </a>
          </div>

          {/* Dummy Contact Form */}
          <div className="lg:col-span-2 bg-white border border-gray-100 p-10 rounded-3xl shadow-sm">
            <h3 className="text-2xl font-black italic uppercase tracking-tighter mb-8">Kirim <span className="text-honda-red">Pesan</span></h3>
            <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Nama Lengkap</label>
                  <input type="text" placeholder="Masukkan nama Anda" className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded focus:ring-2 focus:ring-honda-red focus:border-transparent outline-none transition-all" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Nomor Telepon</label>
                  <input type="tel" placeholder="Contoh: 0812..." className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded focus:ring-2 focus:ring-honda-red focus:border-transparent outline-none transition-all" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Tipe Motor Diminati</label>
                <select className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded focus:ring-2 focus:ring-honda-red focus:border-transparent outline-none transition-all appearance-none">
                  <option>Pilih Tipe Motor</option>
                  <option>Matic</option>
                  <option>Sport</option>
                  <option>Cub</option>
                  <option>Big Bike</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Pesan</label>
                <textarea rows={4} placeholder="Ceritakan kebutuhan Anda..." className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded focus:ring-2 focus:ring-honda-red focus:border-transparent outline-none transition-all resize-none"></textarea>
              </div>
              <button className="w-full md:w-auto bg-gray-900 text-white px-12 py-4 rounded font-bold uppercase tracking-widest hover:bg-honda-red transition-all">
                Kirim Pesan Sekarang
              </button>
            </form>
          </div>
        </div>

        {/* Dummy Map Placeholder */}
        <div className="mt-16 h-96 bg-gray-100 rounded-[2rem] overflow-hidden relative border border-gray-200">
           <img src="https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?q=80&w=2066" className="w-full h-full object-cover opacity-50 grayscale" alt="map" />
           <div className="absolute inset-0 flex items-center justify-center">
             <div className="bg-white p-6 rounded-2xl shadow-2xl border border-honda-red text-center">
               <div className="w-10 h-10 bg-honda-red rounded-full flex items-center justify-center text-white mx-auto mb-3">
                 <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20"><path d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" /></svg>
               </div>
               <p className="font-bold uppercase tracking-widest text-xs mb-1">Our Showroom</p>
               <p className="text-gray-500 text-sm">Main Branch, Jakarta City</p>
             </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
