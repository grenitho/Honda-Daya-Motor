
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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'logo' | 'heroBg') => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        if (type === 'logo') setTempLogo(base64String);
        else setTempHeroBg(base64String);
      };
      reader.readAsDataURL(file);
    }
  };

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
        <div className="flex border-b shrink-0">
          <button onClick={() => setActiveTab('admin')} className={`flex-1 py-5 font-black uppercase italic tracking-widest text-[10px] transition-all ${activeTab === 'admin' ? 'bg-gray-900 text-white' : 'text-gray-400 hover:text-gray-900'}`}>Konten Website</button>
          <button onClick={() => setActiveTab('firebase')} className={`flex-1 py-5 font-black uppercase italic tracking-widest text-[10px] transition-all ${activeTab === 'firebase' ? 'bg-orange-500 text-white' : 'text-gray-400 hover:text-orange-500'}`}>Sinkronisasi Cloud</button>
        </div>
        
        <div className="p-8 overflow-y-auto space-y-10 no-scrollbar">
          {activeTab === 'admin' && (
            <div className="space-y-10">
              
              {/* BAGIAN 1: IDENTITAS DEALER */}
              <div className="space-y-6">
                <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 border-b pb-2">1. Identitas Dealer</h4>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
                   {/* Logo Upload */}
                   <div className="space-y-2">
                      <label className="text-[8px] font-black uppercase text-gray-400">Logo Dealer (PNG/JPG)</label>
                      <div className="relative aspect-video rounded-2xl border-2 border-dashed border-gray-100 bg-gray-50 flex flex-col items-center justify-center overflow-hidden group hover:border-honda-red transition-all">
                        {tempLogo ? (
                          <>
                            <img src={tempLogo} alt="Logo Preview" className="h-full w-full object-contain p-4" />
                            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                              <span className="text-white text-[9px] font-bold uppercase">Ganti Logo</span>
                            </div>
                          </>
                        ) : (
                          <div className="text-center p-4">
                            <svg className="w-8 h-8 text-gray-300 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                            <p className="text-[7px] text-gray-400 font-bold uppercase">Upload Logo</p>
                          </div>
                        )}
                        <input type="file" onChange={(e) => handleFileChange(e, 'logo')} className="absolute inset-0 opacity-0 cursor-pointer" accept="image/*" />
                      </div>
                      <input type="text" value={tempLogo || ''} onChange={e => setTempLogo(e.target.value)} placeholder="Atau tempel URL di sini..." className="w-full p-2 border rounded-lg text-[8px] bg-white outline-none focus:border-honda-red" />
                   </div>

                   <div className="space-y-4">
                      <div className="space-y-1">
                        <label className="text-[8px] font-black uppercase text-gray-400">Nama Dealer</label>
                        <input type="text" value={tempName} onChange={e => setTempName(e.target.value)} className="w-full p-3 border rounded-xl text-xs font-bold bg-gray-50 outline-none focus:border-honda-red" />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[8px] font-black uppercase text-gray-400">Alamat Lengkap</label>
                        <textarea value={tempAddress} onChange={e => setTempAddress(e.target.value)} className="w-full p-3 border rounded-xl text-[10px] bg-gray-50 h-20 resize-none outline-none focus:border-honda-red" />
                      </div>
                   </div>
                </div>
              </div>

              {/* BAGIAN 2: HEADLINE DEPAN (HERO) */}
              <div className="bg-blue-50/40 p-6 rounded-[2rem] border border-blue-100 space-y-6">
                <h4 className="text-[10px] font-black uppercase italic text-blue-900 flex items-center gap-2">
                   <span className="w-6 h-6 bg-blue-600 text-white rounded-lg flex items-center justify-center not-italic text-[10px]">2</span>
                   Konten Headline & Banner Utama
                </h4>

                <div className="space-y-2">
                   <label className="text-[8px] font-black text-blue-400 uppercase tracking-widest">Background Banner Utama (Full Image)</label>
                   <div className="relative aspect-video rounded-3xl border-2 border-dashed border-blue-200 bg-white flex flex-col items-center justify-center overflow-hidden group hover:border-blue-500 transition-all">
                      {tempHeroBg ? (
                        <>
                          <img src={tempHeroBg} alt="Hero Preview" className="h-full w-full object-cover" />
                          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                             <span className="text-white text-[9px] font-bold uppercase">Ganti Gambar Banner</span>
                          </div>
                        </>
                      ) : (
                        <div className="text-center">
                           <p className="text-[8px] text-blue-300 font-bold uppercase">Upload Banner</p>
                        </div>
                      )}
                      <input type="file" onChange={(e) => handleFileChange(e, 'heroBg')} className="absolute inset-0 opacity-0 cursor-pointer" accept="image/*" />
                   </div>
                   <input type="text" value={tempHeroBg} onChange={e => setTempHeroBg(e.target.value)} placeholder="Atau tempel URL background..." className="w-full p-2 border rounded-lg text-[8px] bg-white outline-none focus:border-blue-500" />
                </div>
                
                <div className="space-y-4 pt-2">
                  <div className="space-y-1">
                     <label className="text-[8px] font-black text-blue-400 uppercase tracking-widest">Label Kecil (Badge Atas)</label>
                     <input 
                      type="text" 
                      value={tempSales.heroBadge} 
                      onChange={e => setTempSales({...tempSales, heroBadge: e.target.value})} 
                      className="w-full p-3 border border-blue-100 rounded-xl text-xs bg-white font-bold" 
                      placeholder="Contoh: SALES DIGITAL HONDA" 
                     />
                  </div>

                  <div className="space-y-1">
                     <label className="text-[8px] font-black text-blue-400 uppercase tracking-widest">Headline Utama (Besar)</label>
                     <input 
                      type="text" 
                      value={tempSales.heroHeadline} 
                      onChange={e => setTempSales({...tempSales, heroHeadline: e.target.value})} 
                      className="w-full p-3 border border-blue-100 rounded-xl text-xs bg-white font-black italic" 
                     />
                     <p className="text-[7px] text-blue-500 italic">Gunakan tanda "|" untuk baris baru (teks setelahnya jadi merah).</p>
                  </div>

                  <div className="space-y-1">
                     <label className="text-[8px] font-black text-blue-400 uppercase tracking-widest">Teks Intro / Sambutan</label>
                     <textarea 
                      value={tempSales.heroIntro} 
                      onChange={e => setTempSales({...tempSales, heroIntro: e.target.value})} 
                      className="w-full p-3 border border-blue-100 rounded-xl text-xs bg-white h-20 resize-none leading-relaxed" 
                     />
                  </div>
                </div>
              </div>

              {/* BAGIAN 3: HALAMAN TENTANG (STORY) */}
              <div className="bg-gray-50 p-6 rounded-[2rem] border border-gray-200 space-y-5">
                <h4 className="text-[10px] font-black uppercase italic text-gray-900 flex items-center gap-2">
                   <span className="w-6 h-6 bg-honda-red text-white rounded-lg flex items-center justify-center not-italic text-[10px]">3</span>
                   Konten Halaman Tentang Kami
                </h4>
                
                <div className="grid grid-cols-2 gap-4">
                   <div className="space-y-1">
                     <label className="text-[8px] font-black text-gray-400 uppercase tracking-widest">Judul Cerita</label>
                     <input type="text" value={tempStoryTitle} onChange={e => setTempStoryTitle(e.target.value)} className="w-full p-3 border rounded-xl text-xs bg-white font-bold" />
                   </div>
                   <div className="space-y-1">
                     <label className="text-[8px] font-black text-gray-400 uppercase tracking-widest">Nama Kota (Teks Merah)</label>
                     <input type="text" value={tempStoryCity} onChange={e => setTempStoryCity(e.target.value)} className="w-full p-3 border rounded-xl text-xs bg-white text-honda-red font-black" />
                   </div>
                </div>

                <div className="space-y-1">
                   <label className="text-[8px] font-black text-gray-400 uppercase tracking-widest">Isi Cerita (Paragraf 1)</label>
                   <textarea value={tempStoryText1} onChange={e => setTempStoryText1(e.target.value)} className="w-full p-3 border rounded-xl text-xs bg-white h-24 resize-none leading-relaxed" />
                </div>

                <div className="space-y-1 pt-2">
                   <label className="text-[8px] font-black text-gray-900 uppercase tracking-widest">Kutipan Pribadi Sales</label>
                   <textarea value={tempSalesAboutMsg} onChange={e => setTempSalesAboutMsg(e.target.value)} className="w-full p-3 border-2 border-honda-red/10 rounded-xl text-xs bg-white h-24 italic" />
                </div>
              </div>

              <button onClick={onReset} className="text-[8px] font-bold text-gray-300 uppercase block mx-auto hover:text-red-500 transition-colors">Hapus Semua & Reset ke Awal</button>
            </div>
          )}

          {activeTab === 'firebase' && (
            <div className="space-y-6">
               <div className="bg-orange-50 p-6 rounded-3xl border border-orange-100">
                  <h4 className="text-[10px] font-black uppercase italic text-orange-600 mb-2">Cloud Master Sync</h4>
                  <p className="text-[9px] text-orange-800 leading-relaxed mb-4">
                    Gunakan link ini untuk sinkronisasi otomatis ke HP atau Laptop baru tanpa perlu input kode manual.
                  </p>
                  <button 
                    disabled={!fbConfig}
                    onClick={handleCopySetupLink}
                    className={`w-full py-3 rounded-xl font-black uppercase text-[10px] tracking-widest transition-all shadow-md ${copiedLink ? 'bg-green-500 text-white' : 'bg-white text-orange-600 border border-orange-200 hover:bg-orange-100'}`}
                  >
                    {copiedLink ? '✓ Link Berhasil Disalin' : '🔗 Salin Link Setup Otomatis'}
                  </button>
               </div>

               <div className="space-y-2">
                 <label className="text-[9px] font-black uppercase text-gray-400 tracking-widest">Konfigurasi Firebase (JSON)</label>
                 <textarea value={fbConfig} onChange={e => setFbConfig(e.target.value)} className="w-full p-4 border rounded-2xl text-[10px] font-mono h-48 bg-gray-50" placeholder='Tempel kode JSON Firebase di sini...' />
               </div>
               
               <button onClick={() => { localStorage.setItem('honda_firebase_config', fbConfig); window.location.reload(); }} className="w-full bg-orange-500 text-white py-4 rounded-2xl font-black uppercase text-xs tracking-widest shadow-xl shadow-orange-100 hover:bg-orange-600 transition-all">Aktifkan Cloud Sekarang</button>
            </div>
          )}
        </div>

        <div className="p-8 bg-gray-50 flex gap-4 border-t shrink-0">
          <button onClick={onClose} className="flex-1 py-4 text-xs font-bold uppercase text-gray-400">Batal</button>
          <button onClick={handleSave} className="flex-[2] bg-gray-900 text-white py-4 rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-black transition-all shadow-xl active:scale-95">Simpan Semua Perubahan</button>
        </div>
      </div>
    </div>
  );
};

export default AdminSettingsModal;
