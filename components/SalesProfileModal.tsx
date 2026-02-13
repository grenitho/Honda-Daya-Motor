
import React, { useState, useEffect } from 'react';
import { SalesPerson } from '../types';

interface SalesProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  salesInfo: SalesPerson;
  remoteUrl: string | null;
  onSave: (newSales: SalesPerson) => void;
}

// Encoder yang lebih stabil untuk URL
const safeBtoa = (str: string) => {
  try {
    return btoa(encodeURIComponent(str).replace(/%([0-9A-F]{2})/g, (match, p1) => {
      return String.fromCharCode(parseInt(p1, 16));
    }));
  } catch (e) {
    try {
      return btoa(unescape(encodeURIComponent(str)));
    } catch (e2) {
      return "";
    }
  }
};

const SalesProfileModal: React.FC<SalesProfileModalProps> = ({ isOpen, onClose, salesInfo, remoteUrl, onSave }) => {
  const [activeTab, setActiveTab] = useState<'edit' | 'share'>('edit');
  const [tempSales, setTempSales] = useState<SalesPerson>(salesInfo);
  const [copied, setCopied] = useState(false);
  const [personalUrl, setPersonalUrl] = useState('');

  useEffect(() => {
    if (!isOpen) return;
    const baseUrl = `${window.location.origin}${window.location.pathname}`;
    
    // Ambil config firebase
    const fbConfigRaw = localStorage.getItem('honda_firebase_config');
    
    // PENTING: Kita hapus foto profil dari link personal agar link tidak TERLALU PANJANG.
    // Foto profil akan ditarik otomatis dari Cloud Database saat link dibuka di HP baru.
    const { photo, ...lightSalesInfo } = tempSales;
    
    const personalData = { 
      salesInfo: lightSalesInfo,
      fbConfig: fbConfigRaw ? JSON.parse(fbConfigRaw) : null 
    }; 
    
    const encoded = safeBtoa(JSON.stringify(personalData));
    setPersonalUrl(`${baseUrl}?p=${encoded}`);
  }, [tempSales, isOpen]);

  useEffect(() => {
    if (isOpen) {
      setTempSales(salesInfo);
    }
  }, [isOpen, salesInfo]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setTempSales({ ...tempSales, photo: reader.result as string });
      reader.readAsDataURL(file);
    }
  };

  const copy = () => {
    navigator.clipboard.writeText(personalUrl).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const openShortener = (service: 'sid' | 'bitly') => {
    navigator.clipboard.writeText(personalUrl);
    alert('Link panjang sudah disalin ke clipboard. Gunakan ' + service + ' untuk membuat link pendek agar lebih mudah dibagikan di WhatsApp/Instagram.');
    const url = service === 'sid' ? 'https://s.id/' : 'https://bitly.com/';
    window.open(url, '_blank');
  };

  if (!isOpen) return null;

  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(personalUrl)}&color=E4002B`;

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-black/95 backdrop-blur-md">
      <div className="bg-white rounded-[2.5rem] w-full max-w-2xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        <div className="bg-honda-red px-8 py-6 text-white shrink-0">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h2 className="text-xl font-black italic uppercase tracking-tighter">Sales Center</h2>
              <p className="text-[10px] text-red-100 font-bold uppercase tracking-[0.2em]">Pusat Kendali Profil & Marketing</p>
            </div>
            <button onClick={onClose} className="hover:rotate-90 transition-transform text-2xl p-2">✕</button>
          </div>
          
          <div className="flex gap-4 mt-2">
            <button 
              onClick={() => setActiveTab('edit')}
              className={`text-[10px] font-black uppercase tracking-widest pb-2 border-b-2 transition-all ${activeTab === 'edit' ? 'border-white text-white' : 'border-transparent text-red-200'}`}
            >
              Edit Profil & Sosial
            </button>
            <button 
              onClick={() => setActiveTab('share')}
              className={`text-[10px] font-black uppercase tracking-widest pb-2 border-b-2 transition-all ${activeTab === 'share' ? 'border-white text-white' : 'border-transparent text-red-200'}`}
            >
              Kartu Nama Digital (QR)
            </button>
          </div>
        </div>
        
        <div className="p-8 overflow-y-auto no-scrollbar flex-grow bg-white">
          {activeTab === 'edit' ? (
            <div className="animate-in fade-in slide-in-from-left-4 duration-300 space-y-8">
              
              <div className="grid grid-cols-12 gap-8">
                <div className="col-span-full md:col-span-4">
                  <label className="block text-[9px] font-black text-gray-400 uppercase tracking-widest mb-3">Foto Profil</label>
                  <div className="relative aspect-[3/4] bg-gray-100 rounded-3xl overflow-hidden border-2 border-dashed border-gray-200 group">
                    {tempSales.photo ? (
                      <img src={tempSales.photo} className="w-full h-full object-cover group-hover:scale-105 transition-all" />
                    ) : (
                      <div className="h-full flex items-center justify-center text-gray-300">No Photo</div>
                    )}
                    <input type="file" onChange={handleFileChange} className="absolute inset-0 opacity-0 cursor-pointer" />
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                       <span className="text-white text-[10px] font-bold uppercase">Ganti Foto</span>
                    </div>
                  </div>
                </div>

                <div className="col-span-full md:col-span-8 space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[8px] font-black text-gray-400 uppercase tracking-widest">Nama Lengkap</label>
                      <input type="text" value={tempSales.name} onChange={e => setTempSales({...tempSales, name: e.target.value})} className="w-full p-3 border rounded-xl text-xs font-bold bg-gray-50 outline-none focus:border-honda-red" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[8px] font-black text-gray-400 uppercase tracking-widest">Jabatan</label>
                      <input type="text" value={tempSales.role} onChange={e => setTempSales({...tempSales, role: e.target.value})} className="w-full p-3 border rounded-xl text-xs font-bold bg-gray-50" />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[8px] font-black text-gray-400 uppercase tracking-widest">Nomor WhatsApp</label>
                      <input type="text" value={tempSales.whatsapp} onChange={e => setTempSales({...tempSales, whatsapp: e.target.value})} placeholder="628..." className="w-full p-3 border rounded-xl text-xs bg-gray-50" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[8px] font-black text-gray-400 uppercase tracking-widest">Email Kerja</label>
                      <input type="email" value={tempSales.email} onChange={e => setTempSales({...tempSales, email: e.target.value})} placeholder="email@gmail.com" className="w-full p-3 border rounded-xl text-xs bg-gray-50" />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[8px] font-black text-gray-400 uppercase tracking-widest">Quotes / Bio Singkat</label>
                    <textarea value={tempSales.bio} onChange={e => setTempSales({...tempSales, bio: e.target.value})} className="w-full p-3 border rounded-xl text-xs h-20 bg-gray-50 resize-none leading-relaxed" />
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 p-6 rounded-[2rem] border border-gray-100 space-y-4">
                <h4 className="text-[10px] font-black uppercase italic text-gray-900 border-b pb-2 flex items-center gap-2">
                  <svg className="w-4 h-4 text-honda-red" fill="currentColor" viewBox="0 0 20 20"><path d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z" /><path d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5V7h3a1 1 0 000-2H5z" /></svg>
                  Link Media Sosial (Otomatis ke Footer)
                </h4>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                   <div className="space-y-1">
                      <label className="text-[8px] font-black text-blue-600 uppercase tracking-widest">Link Facebook</label>
                      <input 
                        type="text" 
                        value={tempSales.facebook || ''} 
                        onChange={e => setTempSales({...tempSales, facebook: e.target.value})} 
                        placeholder="https://facebook.com/namaanda"
                        className="w-full p-3 border rounded-xl text-[10px] bg-white outline-none focus:border-blue-600" 
                      />
                   </div>
                   <div className="space-y-1">
                      <label className="text-[8px] font-black text-pink-600 uppercase tracking-widest">Link Instagram</label>
                      <input 
                        type="text" 
                        value={tempSales.instagram || ''} 
                        onChange={e => setTempSales({...tempSales, instagram: e.target.value})} 
                        placeholder="https://instagram.com/username"
                        className="w-full p-3 border rounded-xl text-[10px] bg-white outline-none focus:border-pink-600" 
                      />
                   </div>
                   <div className="space-y-1">
                      <label className="text-[8px] font-black text-gray-900 uppercase tracking-widest">Link TikTok</label>
                      <input 
                        type="text" 
                        value={tempSales.tiktok || ''} 
                        onChange={e => setTempSales({...tempSales, tiktok: e.target.value})} 
                        placeholder="https://tiktok.com/@username"
                        className="w-full p-3 border rounded-xl text-[10px] bg-white outline-none focus:border-black" 
                      />
                   </div>
                </div>
              </div>

              <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100 flex gap-4">
                <button onClick={onClose} className="flex-1 py-3 text-xs font-bold uppercase text-gray-400 hover:text-gray-600 transition-colors">Batal</button>
                <button 
                  onClick={() => { onSave(tempSales); onClose(); }} 
                  className="flex-[2] bg-gray-900 text-white py-4 rounded-xl font-black uppercase text-xs tracking-widest hover:bg-black transition-all shadow-xl active:scale-95"
                >
                  Simpan Semua Perubahan
                </button>
              </div>
            </div>
          ) : (
            <div className="animate-in fade-in slide-in-from-right-4 duration-300 space-y-6">
              <div className="flex flex-col md:flex-row items-center gap-8 p-6 bg-gray-50 rounded-[2.5rem] border border-gray-100">
                <div className="bg-white p-4 rounded-3xl shadow-xl border border-gray-100 shrink-0">
                  <img src={qrCodeUrl} alt="QR Code" className="w-40 h-40" />
                  <div className="mt-2 text-center">
                    <span className="text-[8px] font-black text-honda-red uppercase italic">Scan Me to Connect</span>
                  </div>
                </div>
                <div className="space-y-4 text-center md:text-left">
                  <h3 className="text-sm font-black text-gray-900 uppercase italic">Kartu Nama Digital</h3>
                  <p className="text-[10px] text-gray-500 leading-relaxed max-w-xs">
                    Tampilkan QR ini kepada konsumen Anda untuk membagikan katalog digital dan kontak Anda secara instan.
                  </p>
                  <a 
                    href={qrCodeUrl} 
                    download={`QR-Honda-${tempSales.name}.png`}
                    target="_blank"
                    className="inline-block bg-white border border-gray-200 text-gray-900 px-6 py-2 rounded-lg font-bold text-[10px] uppercase tracking-widest hover:bg-gray-50 transition-all active:scale-95 shadow-sm"
                  >
                    Simpan Gambar QR
                  </a>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-6 bg-blue-50/50 rounded-3xl border border-blue-100 space-y-4">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 bg-blue-600 rounded-md flex items-center justify-center text-white text-[10px] font-black">S</div>
                    <h4 className="text-[11px] font-black text-blue-900 uppercase italic">S.id Integration</h4>
                  </div>
                  <p className="text-[9px] text-blue-700 font-medium">Buat link pendek seperti <strong>s.id/honda-vins</strong></p>
                  <button 
                    onClick={() => openShortener('sid')}
                    className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold uppercase text-[10px] tracking-widest hover:bg-blue-700 transition-all active:scale-95"
                  >
                    Shorten via S.id
                  </button>
                </div>

                <div className="p-6 bg-gray-900 rounded-3xl space-y-4">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 bg-white rounded-md flex items-center justify-center text-gray-900 text-[10px] font-black">B</div>
                    <h4 className="text-[11px] font-black text-white uppercase italic">Bit.ly Integration</h4>
                  </div>
                  <p className="text-[9px] text-gray-400 font-medium">Lacak berapa banyak konsumen yang mengklik link Anda.</p>
                  <button 
                    onClick={() => openShortener('bitly')}
                    className="w-full bg-white text-gray-900 py-3 rounded-xl font-bold uppercase text-[10px] tracking-widest hover:bg-gray-100 transition-all active:scale-95"
                  >
                    Shorten via Bitly
                  </button>
                </div>
              </div>

              <div className="p-6 bg-red-50 rounded-3xl border border-red-100 space-y-3">
                <label className="text-[8px] font-black text-honda-red uppercase tracking-widest">Link Website Personal Anda</label>
                <div className="flex gap-2">
                  <div className="flex-grow p-4 bg-white border border-red-100 rounded-xl overflow-hidden">
                    <p className="text-[8px] text-gray-400 truncate font-mono">{personalUrl}</p>
                  </div>
                  <button 
                    onClick={copy}
                    className={`px-6 rounded-xl font-bold uppercase text-[10px] transition-all active:scale-95 ${copied ? 'bg-green-500 text-white' : 'bg-honda-red text-white'}`}
                  >
                    {copied ? 'Tersalin' : 'Copy'}
                  </button>
                </div>
              </div>

              <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100 flex gap-4">
                <button 
                  onClick={() => setActiveTab('edit')} 
                  className="flex-1 py-3 text-xs font-bold uppercase text-gray-400 hover:text-gray-600 transition-colors flex items-center justify-center gap-2"
                >
                  <span>←</span> Kembali ke Edit
                </button>
                <button 
                  onClick={onClose} 
                  className="flex-1 bg-gray-900 text-white py-3 rounded-xl font-black uppercase text-xs tracking-widest hover:bg-black transition-all active:scale-95 shadow-lg"
                >
                  Selesai
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="p-6 bg-gray-50 border-t shrink-0 flex justify-center">
           <p className="text-[8px] font-bold text-gray-400 uppercase tracking-widest">Pusat Pemasaran Digital - Honda Authorized Dealer</p>
        </div>
      </div>
    </div>
  );
};

export default SalesProfileModal;
