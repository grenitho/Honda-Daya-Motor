
import React, { useState, useEffect } from 'react';
import { SalesPerson, Promo, Product } from '../types';

interface AdminSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  salesInfo: SalesPerson;
  products: Product[];
  promos: Promo[];
  logo: string | null;
  heroBackground: string;
  dealerName: string;
  dealerAddress: string;
  storyTitle: string;
  storyCity: string;
  storyText1: string;
  storyText2: string;
  salesAboutMessage: string;
  remoteUrl: string | null;
  onSyncRemote: (url: string) => Promise<any>;
  onSave: (newSalesInfo: SalesPerson, newLogo: string | null, newName: string, newAddress: string, newHeroBg: string, storyData: any) => void;
  onReset: () => void;
}

const safeBtoa = (str: string) => {
  try {
    return btoa(encodeURIComponent(str).replace(/%([0-9A-F]{2})/g, (match, p1) => {
      return String.fromCharCode(parseInt(p1, 16));
    }));
  } catch (e) { return ""; }
};

const AdminSettingsModal: React.FC<AdminSettingsModalProps> = ({ 
  isOpen, onClose, salesInfo, products, promos, logo, heroBackground, dealerName, dealerAddress, storyTitle, storyCity, storyText1, storyText2, salesAboutMessage, onSave, onReset 
}) => {
  const [activeTab, setActiveTab] = useState<'admin' | 'firebase'>('admin');
  const [tempSales, setTempSales] = useState<SalesPerson>(salesInfo);
  const [tempLogo, setTempLogo] = useState<string | null>(logo);
  const [tempHeroBg, setTempHeroBg] = useState<string>(heroBackground);
  const [tempName, setTempName] = useState<string>(dealerName);
  const [tempAddress, setTempAddress] = useState<string>(dealerAddress);
  
  const [tempStoryTitle, setTempStoryTitle] = useState(storyTitle);
  const [tempStoryCity, setTempStoryCity] = useState(storyCity);
  const [tempStoryText1, setTempStoryText1] = useState(storyText1);
  const [tempStoryText2, setTempStoryText2] = useState(storyText2);
  const [tempSalesAboutMsg, setTempSalesAboutMsg] = useState(salesAboutMessage);

  const [fbConfig, setFbConfig] = useState<string>(localStorage.getItem('honda_firebase_config') || '');
  const [copiedLink, setCopiedLink] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setTempSales(salesInfo);
      setTempLogo(logo);
      setTempHeroBg(heroBackground);
      setTempName(dealerName);
      setTempAddress(dealerAddress);
      setTempStoryTitle(storyTitle);
      setTempStoryCity(storyCity);
      setTempStoryText1(storyText1);
      setTempStoryText2(storyText2);
      setTempSalesAboutMsg(salesAboutMessage);
    }
  }, [isOpen, salesInfo, logo, heroBackground, dealerName, dealerAddress, storyTitle, storyCity, storyText1, storyText2, salesAboutMessage]);

  const handleSave = () => {
    onSave(tempSales, tempLogo, tempName, tempAddress, tempHeroBg, {
      storyTitle: tempStoryTitle,
      storyCity: tempStoryCity,
      storyText1: tempStoryText1,
      storyText2: tempStoryText2,
      salesAboutMessage: tempSalesAboutMsg
    });
    onClose();
  };

  const handleCopySetupLink = () => {
    if (!fbConfig) return;
    const baseUrl = window.location.origin + window.location.pathname;
    const encoded = safeBtoa(fbConfig);
    const setupLink = `${baseUrl}?staff=true&fb=${encoded}`;
    
    navigator.clipboard.writeText(setupLink).then(() => {
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 3000);
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md">
      <div className="bg-white rounded-[2.5rem] w-full max-w-2xl overflow-hidden shadow-2xl flex flex-col max-h-[85vh]">
        <div className="flex border-b">
          <button onClick={() => setActiveTab('admin')} className={`flex-1 py-5 font-black uppercase italic tracking-widest text-[10px] transition-all ${activeTab === 'admin' ? 'bg-gray-900 text-white' : 'text-gray-400 hover:text-gray-900'}`}>Data Dealer</button>
          <button onClick={() => setActiveTab('firebase')} className={`flex-1 py-5 font-black uppercase italic tracking-widest text-[10px] transition-all ${activeTab === 'firebase' ? 'bg-orange-500 text-white' : 'text-gray-400 hover:text-orange-500'}`}>Firebase Cloud</button>
        </div>
        
        <div className="p-8 overflow-y-auto space-y-8 no-scrollbar">
          {activeTab === 'admin' && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[9px] font-black uppercase text-gray-400 tracking-widest">Nama Dealer</label>
                  <input type="text" value={tempName} onChange={e => setTempName(e.target.value)} className="w-full p-3 border rounded-xl text-xs font-bold bg-gray-50 outline-none" />
                </div>
                <div className="space-y-2">
                  <label className="text-[9px] font-black uppercase text-gray-400 tracking-widest">Logo (URL)</label>
                  <input type="text" value={tempLogo || ''} onChange={e => setTempLogo(e.target.value)} className="w-full p-3 border rounded-xl text-[10px] bg-gray-50 outline-none" />
                </div>
              </div>

              <div className="bg-gray-50 p-6 rounded-3xl border-2 border-dashed border-gray-200 space-y-4">
                <h4 className="text-[10px] font-black uppercase italic text-honda-red border-b border-red-100 pb-2 flex items-center gap-2">
                   ⚙️ Manajemen Konten Tentang Kami
                </h4>
                
                <div className="grid grid-cols-2 gap-4">
                   <div className="space-y-1">
                     <label className="text-[8px] font-bold text-gray-400 uppercase">Judul Awal</label>
                     <input type="text" value={tempStoryTitle} onChange={e => setTempStoryTitle(e.target.value)} className="w-full p-3 border rounded-xl text-xs bg-white" placeholder="Dealer Terpercaya di" />
                   </div>
                   <div className="space-y-1">
                     <label className="text-[8px] font-bold text-gray-400 uppercase">Kota (Teks Merah)</label>
                     <input type="text" value={tempStoryCity} onChange={e => setTempStoryCity(e.target.value)} className="w-full p-3 border rounded-xl text-xs bg-white text-honda-red font-black" placeholder="JAKARTA" />
                   </div>
                </div>

                <div className="space-y-1">
                   <label className="text-[8px] font-bold text-gray-400 uppercase">Paragraf Cerita 1</label>
                   <textarea value={tempStoryText1} onChange={e => setTempStoryText1(e.target.value)} className="w-full p-3 border rounded-xl text-xs bg-white h-20 resize-none leading-relaxed" />
                </div>
                
                <div className="space-y-1">
                   <label className="text-[8px] font-bold text-gray-400 uppercase">Paragraf Cerita 2</label>
                   <textarea value={tempStoryText2} onChange={e => setTempStoryText2(e.target.value)} className="w-full p-3 border rounded-xl text-xs bg-white h-20 resize-none leading-relaxed" />
                </div>

                <div className="space-y-1 pt-2">
                   <label className="text-[8px] font-black text-gray-900 uppercase">Kutipan Sales (About Page)</label>
                   <textarea value={tempSalesAboutMsg} onChange={e => setTempSalesAboutMsg(e.target.value)} className="w-full p-3 border-2 border-honda-red/10 rounded-xl text-xs bg-white h-20 italic" />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[9px] font-black uppercase text-gray-400 tracking-widest">Background Hero (URL)</label>
                <input type="text" value={tempHeroBg} onChange={e => setTempHeroBg(e.target.value)} className="w-full p-3 border rounded-xl text-xs bg-gray-50 font-mono" />
              </div>

              <button onClick={onReset} className="text-[8px] font-bold text-gray-300 uppercase block mx-auto hover:text-red-500">Reset Semua Data</button>
            </div>
          )}

          {activeTab === 'firebase' && (
            <div className="space-y-6">
               <div className="bg-orange-50 p-6 rounded-3xl border border-orange-100">
                  <h4 className="text-[10px] font-black uppercase italic text-orange-600 mb-2">Cloud Master Sync</h4>
                  <p className="text-[9px] text-orange-800 leading-relaxed mb-4">
                    Gunakan fitur ini untuk menghubungkan browser baru atau HP baru Admin ke database cloud yang sama secara otomatis.
                  </p>
                  <button 
                    disabled={!fbConfig}
                    onClick={handleCopySetupLink}
                    className={`w-full py-3 rounded-xl font-black uppercase text-[10px] tracking-widest transition-all shadow-md ${copiedLink ? 'bg-green-500 text-white' : 'bg-white text-orange-600 border border-orange-200 hover:bg-orange-100'}`}
                  >
                    {copiedLink ? '✓ Link Setup Berhasil Disalin' : '🔗 Salin Link Setup Otomatis'}
                  </button>
                  {copiedLink && <p className="text-[8px] text-green-600 font-bold mt-2 text-center animate-pulse italic">Kirim link tersebut ke WA/Email Anda, lalu buka di perangkat baru!</p>}
               </div>

               <div className="space-y-2">
                 <label className="text-[9px] font-black uppercase text-gray-400 tracking-widest">Konfigurasi Firebase (JSON)</label>
                 <textarea value={fbConfig} onChange={e => setFbConfig(e.target.value)} className="w-full p-4 border rounded-2xl text-[10px] font-mono h-48 bg-gray-50" placeholder='{ "apiKey": "...", ... }' />
               </div>
               
               <button onClick={() => { localStorage.setItem('honda_firebase_config', fbConfig); window.location.reload(); }} className="w-full bg-orange-500 text-white py-4 rounded-2xl font-black uppercase text-xs tracking-widest shadow-xl shadow-orange-100 hover:bg-orange-600 transition-all active:scale-95">Aktifkan Cloud di Browser Ini</button>
            </div>
          )}
        </div>

        <div className="p-8 bg-gray-50 flex gap-4 border-t shrink-0">
          <button onClick={onClose} className="flex-1 py-4 text-xs font-bold uppercase text-gray-400">Tutup</button>
          <button onClick={handleSave} className="flex-[2] bg-gray-900 text-white py-4 rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-black transition-all shadow-xl active:scale-95">Simpan Semua Perubahan</button>
        </div>
      </div>
    </div>
  );
};

export default AdminSettingsModal;
