
import React, { useState, useEffect } from 'react';
import { SalesPerson } from '../types';

interface SalesProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  salesInfo: SalesPerson;
  remoteUrl: string | null;
  onSave: (newSales: SalesPerson) => void;
}

const safeBtoa = (str: string) => {
  try {
    return btoa(encodeURIComponent(str).replace(/%([0-9A-F]{2})/g, (match, p1) => {
      return String.fromCharCode(parseInt(p1, 16));
    }));
  } catch (e) { return ""; }
};

const SalesProfileModal: React.FC<SalesProfileModalProps> = ({ isOpen, onClose, salesInfo, remoteUrl, onSave }) => {
  const [activeTab, setActiveTab] = useState<'edit' | 'share'>('edit');
  const [tempSales, setTempSales] = useState<SalesPerson>(salesInfo);
  const [copied, setCopied] = useState(false);
  const [personalUrl, setPersonalUrl] = useState('');

  useEffect(() => {
    if (!isOpen) return;
    const baseUrl = `${window.location.origin}${window.location.pathname}`;
    const fbConfigRaw = localStorage.getItem('honda_firebase_config');
    
    // LINK UNIK: Sekarang membawa ID WhatsApp Sales agar data Cloud tidak tertukar
    const personalData = { 
      salesId: tempSales.whatsapp, // Gunakan nomor WA sebagai kunci profil di Cloud
      fbConfig: fbConfigRaw ? JSON.parse(fbConfigRaw) : null,
      t: Date.now() 
    }; 
    
    const encoded = safeBtoa(JSON.stringify(personalData));
    setPersonalUrl(`${baseUrl}?p=${encoded}`);
  }, [tempSales, isOpen]);

  useEffect(() => {
    if (isOpen) setTempSales(salesInfo);
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
            <button onClick={() => setActiveTab('edit')} className={`text-[10px] font-black uppercase tracking-widest pb-2 border-b-2 transition-all ${activeTab === 'edit' ? 'border-white text-white' : 'border-transparent text-red-200'}`}>Edit Profil</button>
            <button onClick={() => setActiveTab('share')} className={`text-[10px] font-black uppercase tracking-widest pb-2 border-b-2 transition-all ${activeTab === 'share' ? 'border-white text-white' : 'border-transparent text-red-200'}`}>Link Share (Unik)</button>
          </div>
        </div>
        
        <div className="p-8 overflow-y-auto no-scrollbar flex-grow bg-white">
          {activeTab === 'edit' ? (
            <div className="space-y-8">
              <div className="grid grid-cols-12 gap-8">
                <div className="col-span-full md:col-span-4">
                  <label className="block text-[9px] font-black text-gray-400 uppercase tracking-widest mb-3">Foto Profil</label>
                  <div className="relative aspect-[3/4] bg-gray-100 rounded-3xl overflow-hidden border-2 border-dashed border-gray-200 group">
                    {tempSales.photo ? (
                      <img src={tempSales.photo} className="w-full h-full object-cover group-hover:scale-105 transition-all" />
                    ) : (
                      <div className="h-full flex items-center justify-center text-gray-300 font-bold text-[10px]">NO PHOTO</div>
                    )}
                    <input type="file" onChange={handleFileChange} className="absolute inset-0 opacity-0 cursor-pointer" />
                  </div>
                </div>

                <div className="col-span-full md:col-span-8 space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[8px] font-black text-gray-400 uppercase tracking-widest">Nama</label>
                      <input type="text" value={tempSales.name} onChange={e => setTempSales({...tempSales, name: e.target.value})} className="w-full p-3 border rounded-xl text-xs font-bold bg-gray-50 outline-none focus:border-honda-red" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[8px] font-black text-gray-400 uppercase tracking-widest">WhatsApp (ID Unik)</label>
                      <input type="text" value={tempSales.whatsapp} onChange={e => setTempSales({...tempSales, whatsapp: e.target.value})} className="w-full p-3 border rounded-xl text-xs font-bold bg-gray-50" />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[8px] font-black text-gray-400 uppercase tracking-widest">Bio / Quotes</label>
                    <textarea value={tempSales.bio} onChange={e => setTempSales({...tempSales, bio: e.target.value})} className="w-full p-3 border rounded-xl text-xs h-20 bg-gray-50 resize-none outline-none focus:border-honda-red" />
                  </div>
                </div>
              </div>

              <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100 flex gap-4">
                <button onClick={onClose} className="flex-1 py-3 text-xs font-bold uppercase text-gray-400">Batal</button>
                <button onClick={() => { onSave(tempSales); onClose(); }} className="flex-[2] bg-gray-900 text-white py-4 rounded-xl font-black uppercase text-xs tracking-widest shadow-xl">Simpan & Sync Cloud</button>
              </div>
            </div>
          ) : (
            <div className="space-y-6 text-center">
              <div className="inline-block bg-white p-6 rounded-3xl shadow-xl border border-gray-100 mx-auto">
                <img src={qrCodeUrl} alt="QR Code" className="w-48 h-48" />
              </div>
              
              <div className="space-y-3">
                <label className="text-[9px] font-black text-honda-red uppercase tracking-widest">Link Personal {tempSales.name}</label>
                <div className="flex gap-2">
                  <div className="flex-grow p-4 bg-gray-50 border border-red-50 rounded-xl overflow-hidden">
                    <p className="text-[8px] text-gray-400 truncate font-mono">{personalUrl}</p>
                  </div>
                  <button onClick={copy} className={`px-6 rounded-xl font-bold uppercase text-[10px] transition-all ${copied ? 'bg-green-500 text-white' : 'bg-honda-red text-white'}`}>{copied ? 'Tersalin' : 'Copy'}</button>
                </div>
              </div>

              <div className="p-6 bg-blue-50 rounded-3xl border border-blue-100 text-left">
                <h4 className="text-[10px] font-black text-blue-900 uppercase italic mb-2">SISTEM MULTI-PROFILE AKTIF:</h4>
                <p className="text-[9px] text-blue-700 leading-relaxed">
                  Link ini membawa ID WhatsApp Anda. Data foto dan profil Anda disimpan di "kotak" Cloud terpisah. Link ini tidak akan pernah tertukar dengan sales lain meskipun Admin mengganti foto di laptop utama.
                </p>
              </div>

              <button onClick={onClose} className="w-full bg-gray-900 text-white py-3 rounded-xl font-black uppercase text-xs shadow-lg">Selesai</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SalesProfileModal;
