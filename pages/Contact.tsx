
import React, { useState } from 'react';
import { SalesPerson } from '../types';

interface ContactProps {
  salesInfo: SalesPerson;
}

const Contact: React.FC<ContactProps> = ({ salesInfo }) => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    message: ''
  });

  const waUrlBase = `https://wa.me/${salesInfo.whatsapp}`;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.phone || !formData.message) {
      alert('Mohon lengkapi semua data formulir.');
      return;
    }

    const text = `Halo ${salesInfo.name}, saya ingin bertanya:\n\nNama: ${formData.name}\nNo HP: ${formData.phone}\nPesan: ${formData.message}`;
    const fullWaUrl = `${waUrlBase}?text=${encodeURIComponent(text)}`;
    window.open(fullWaUrl, '_blank');
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

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
              <p className="text-gray-900 font-bold uppercase text-[10px] tracking-widest leading-relaxed">
                Silakan lihat peta lokasi di bagian bawah halaman ini untuk panduan rute.
              </p>
            </div>

            <a 
              href={`${waUrlBase}?text=${encodeURIComponent(`Halo ${salesInfo.name}, saya ingin bertanya tentang promo unit Honda.`)}`}
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

          {/* Active Contact Form */}
          <div className="lg:col-span-2 bg-white border border-gray-100 p-10 rounded-3xl shadow-sm">
            <h3 className="text-2xl font-black italic uppercase tracking-tighter mb-8">Kirim <span className="text-honda-red">Pesan</span></h3>
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Nama Lengkap</label>
                  <input 
                    type="text" 
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Masukkan nama Anda" 
                    required
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded focus:ring-2 focus:ring-honda-red focus:border-transparent outline-none transition-all" 
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Nomor Telepon</label>
                  <input 
                    type="tel" 
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="Contoh: 0812..." 
                    required
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded focus:ring-2 focus:ring-honda-red focus:border-transparent outline-none transition-all" 
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Pesan</label>
                <textarea 
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  rows={4} 
                  placeholder="Ceritakan kebutuhan Anda..." 
                  required
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded focus:ring-2 focus:ring-honda-red focus:border-transparent outline-none transition-all resize-none"
                ></textarea>
              </div>
              <button 
                type="submit"
                className="w-full md:w-auto bg-gray-900 text-white px-12 py-4 rounded font-bold uppercase tracking-widest hover:bg-honda-red transition-all shadow-lg active:scale-95 transition-transform"
              >
                Kirim Pesan Sekarang
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
