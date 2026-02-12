
import React, { useState, useEffect } from 'react';
import { SalesPerson, Promo, Product } from '../types';

const safeBtoa = (str: string) => {
  try {
    return btoa(encodeURIComponent(str).replace(/%([0-9A-F]{2})/g, (match, p1) => {
      return String.fromCharCode(parseInt(p1, 16));
    }));
  } catch (e) {
    console.error("Encoding error:", e);
    return "";
  }
};

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
  remoteUrl: string | null;
  onSyncRemote: (url: string) => Promise<any>;
  onSave: (newSalesInfo: SalesPerson, newLogo: string | null, newName: string, newAddress: string, newHeroBg: string) => void;
  onReset: () => void;
}

const AdminSettingsModal: React.FC<AdminSettingsModalProps> = ({ 
  isOpen, onClose, salesInfo, products, promos, logo, heroBackground, dealerName, dealerAddress, remoteUrl, onSyncRemote, onSave, onReset 
}) => {
  const [activeTab, setActiveTab] = useState<'admin' | 'cloud'>('admin');
  const [tempSales, setTempSales] = useState<SalesPerson>(salesInfo);
  const [tempLogo, setTempLogo] = useState<string | null>(logo);
  const [tempHeroBg, setTempHeroBg] = useState<string>(heroBackground);
  const [tempName, setTempName] = useState<string>(dealerName);
  const [tempAddress, setTempAddress] = useState<string>(dealerAddress);
  const [tempRemoteUrl, setTempRemoteUrl] = useState<string>(remoteUrl || '');
  const [copied, setCopied] = useState<string | false>(false);
  const [isSyncingLocal, setIsSyncingLocal] = useState(false);
  const [masterUrl, setMasterUrl] = useState('');

  useEffect(() => {
    if (isOpen) {
      setTempSales(salesInfo);
      setTempLogo(logo);
      setTempHeroBg(heroBackground);
      setTempName(dealerName);
      setTempAddress(dealerAddress);
      setTempRemoteUrl(remoteUrl || '');
    }
  }, [isOpen, salesInfo, logo, heroBackground, dealerName, dealerAddress, remoteUrl]);

  useEffect(() => {
    if (!isOpen) return;
    const baseUrl = `${window.location.origin}${window.location.pathname}`;
    const remoteParam = tempRemoteUrl ? `&remote=${encodeURIComponent(tempRemoteUrl)}` : '';
    
    const lightProducts = products.map(({ image, ...rest }) => rest);
    const lightPromos = promos.map(({ image, ...rest }) => rest);

    const masterData = { 
      dealerName: tempName, 
      dealerAddress: tempAddress, 
      products: lightProducts, 
      promos: lightPromos,
      salesInfo: { name: tempSales.name, role: tempSales.role, whatsapp: tempSales.whatsapp, phone: tempSales.phone, email: tempSales.email } 
    };
    
    setMasterUrl(`${baseUrl}?p=${safeBtoa(JSON.stringify(masterData))}${remoteParam}&staff=true`);
  }, [tempLogo, tempName, tempAddress, products, promos, tempRemoteUrl, isOpen, tempSales]);

  const copy = (text: string, id: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(id);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const getFullConfigString = () => {
    const fullConfig = {
      dealerName: tempName,
      dealerAddress: tempAddress,
      logo: tempLogo,
      heroBackground: tempHeroBg,
      salesInfo: tempSales,
      products: products,
      promos: promos,
      exportedAt: new Date().toISOString()
    };
    return JSON.stringify(fullConfig, null, 2);
  };

  const handleCopyConfig = () => {
    copy(getFullConfigString(), 'config-json');
  };

  const handleDownloadConfig = () => {
    const blob = new Blob([getFullConfigString()], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `honda-dealer-config-${tempName.toLowerCase().replace(/\s+/g, '-')}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleSyncClick = async () => {
    let targetUrl = tempRemoteUrl.trim();
    if (!targetUrl) {
      alert("Masukkan URL Remote terlebih dahulu.");
      return;
    }

    if (targetUrl.includes('gist.github.com') && !targetUrl.includes('/raw')) {
      if (!targetUrl.endsWith('/raw')) {
        targetUrl = targetUrl.replace(/\/$/, '') + '/raw';
      }
    }
    
    setIsSyncingLocal(true);
    try {
      const data = await onSyncRemote(targetUrl);
      if (data) {
        if (data.dealerName) setTempName(data.dealerName);
        if (data.dealerAddress) setTempAddress(data.dealerAddress);
        if (data.salesInfo) setTempSales((prev) => ({ ...prev, ...data.salesInfo }));
        if (data.logo) setTempLogo(data.logo);
        if (data.heroBackground) setTempHeroBg(data.heroBackground);
        setTempRemoteUrl(targetUrl);
        
        alert("Sinkronisasi Cloud Berhasil!\nData telah diperbarui di formulir. Klik 'Simpan Perubahan' di bawah untuk menerapkan ke seluruh website.");
      }
    } catch (err) {
      alert("Gagal sinkronisasi: Pastikan link Gist benar dan bersifat Public.");
    } finally {
      setIsSyncingLocal(false);
    }
  };

  const handleLogoFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setTempLogo(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleHeroBgFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setTempHeroBg(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md">
      <div className="bg-white rounded-[2.5rem] w-full max-w-2xl overflow-hidden shadow-2xl flex flex-col max-h-[85vh]">
        <div className="flex border-b">
          <button 
            onClick={() => setActiveTab('admin')}
            className={`flex-1 py-5 font-black uppercase italic tracking-widest text-[10px] transition-all ${activeTab === 'admin' ? 'bg-gray-900 text-white' : 'text-gray-400 hover:text-gray-900'}`}
          >
            Admin Dealer
          </button>
          <button 
            onClick={() => setActiveTab('cloud')}
            className={`flex-1 py-5 font-black uppercase italic tracking-widest text-[10px] transition-all ${activeTab === 'cloud' ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-blue-600'}`}
          >
            Sinkronisasi Cloud
          </button>
        </div>
        
        <div className="p-8 overflow-y-auto space-y-8 no-scrollbar">
          {activeTab === 'admin' && (
            <div className="space-y-8 animate-in fade-in duration-500">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-4">
                  <label className="block text-[9px] font-black text-gray-400 uppercase tracking-widest">Nama Dealer</label>
                  <input type="text" value={tempName} onChange={e => setTempName(e.target.value)} className="w-full p-4 border rounded-xl text-xs font-bold bg-gray-50" />
                </div>
                <div className="space-y-4">
                  <label className="block text-[9px] font-black text-gray-400 uppercase tracking-widest">Logo Dealer</label>
                  <div className="relative h-12 border rounded-xl flex items-center justify-center bg-gray-50 overflow-hidden">
                    {tempLogo ? <img src={tempLogo} className="h-8 w-auto object-contain" /> : <span className="text-[10px] text-gray-400">Pilih Logo</span>}
                    <input type="file" onChange={handleLogoFileChange} className="absolute inset-0 opacity-0 cursor-pointer" />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <label className="block text-[9px] font-black text-gray-400 uppercase tracking-widest">Hero Background Image</label>
                <div className="relative h-32 border-2 border-dashed border-gray-200 rounded-2xl flex items-center justify-center bg-gray-50 overflow-hidden group">
                  <img src={tempHeroBg} className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity" />
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <span className="bg-black/50 text-white px-4 py-2 rounded-lg text-[10px] font-bold uppercase tracking-widest">Klik untuk ganti background</span>
                  </div>
                  <input type="file" onChange={handleHeroBgFileChange} className="absolute inset-0 opacity-0 cursor-pointer" />
                </div>
              </div>

              <div className="space-y-4">
                <label className="block text-[9px] font-black text-gray-400 uppercase tracking-widest">Alamat Dealer (Untuk Lokasi Map)</label>
                <input 
                  type="text" 
                  value={tempAddress} 
                  onChange={e => setTempAddress(e.target.value)} 
                  placeholder="Contoh: Jl. Ahmad Yani, Sungailiat, Bangka"
                  className="w-full p-4 border rounded-xl text-xs font-medium bg-gray-50 outline-none focus:ring-2 focus:ring-honda-red" 
                />
              </div>

              <div className="p-6 bg-red-50/50 rounded-3xl border border-red-100 space-y-6">
                <h4 className="text-[10px] font-black text-gray-900 uppercase tracking-widest italic">Global Hero Content</h4>
                <div className="grid grid-cols-2 gap-4">
                  <input type="text" value={tempSales.heroBadge} onChange={e => setTempSales({...tempSales, heroBadge: e.target.value})} className="p-4 border rounded-xl text-xs font-bold bg-white" placeholder="Label" />
                  <input type="text" value={tempSales.heroHeadline} onChange={e => setTempSales({...tempSales, heroHeadline: e.target.value})} className="p-4 border rounded-xl text-xs font-black uppercase italic bg-white" placeholder="Headline" />
                </div>
                <textarea value={tempSales.heroIntro} onChange={e => setTempSales({...tempSales, heroIntro: e.target.value})} className="w-full p-4 border rounded-xl text-xs h-24 bg-white resize-none" placeholder="Intro Text" />
              </div>

              <div className="p-6 bg-gray-900 rounded-3xl space-y-4">
                <h4 className="text-[10px] font-black text-white uppercase tracking-widest italic">Master Link (Include Staff Access)</h4>
                <div className="flex gap-2">
                  <input readOnly value={masterUrl} className="flex-grow p-3 bg-white/10 rounded-xl text-[8px] text-gray-400 outline-none" />
                  <button onClick={() => copy(masterUrl, 'master')} className="px-6 bg-honda-red text-white rounded-xl text-[10px] font-bold uppercase">
                    {copied === 'master' ? 'Tersalin' : 'Copy'}
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'cloud' && (
            <div className="space-y-8 animate-in fade-in duration-500">
              <div className="p-8 bg-blue-50 border border-blue-100 rounded-[2.5rem] space-y-6">
                <div className="flex justify-between items-center">
                  <h3 className="text-sm font-black uppercase italic text-blue-900">Cloud Data Management</h3>
                  <div className="flex gap-4">
                    <button 
                      onClick={handleCopyConfig}
                      className="flex items-center gap-1.5 text-[9px] font-black text-blue-600 uppercase tracking-widest hover:text-blue-800 transition-colors"
                    >
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3" /></svg>
                      {copied === 'config-json' ? 'Copied!' : 'Copy JSON'}
                    </button>
                    <button 
                      onClick={handleDownloadConfig}
                      className="flex items-center gap-1.5 text-[9px] font-black text-gray-500 uppercase tracking-widest hover:text-honda-red transition-colors"
                    >
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M4 16v1a2 2 0 002 2h12a2 2 0 002 2h12a2 2 0 002-2v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                      Download
                    </button>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="p-4 bg-white/50 rounded-xl border border-blue-200">
                    <p className="text-[10px] text-blue-800 font-medium leading-relaxed">
                      <strong>Cara Pindah ke Cloud:</strong><br/>
                      1. Klik <strong>Copy JSON</strong> di atas.<br/>
                      2. Tempel (Paste) datanya ke file baru di <strong>GitHub Gist</strong>.<br/>
                      3. Masukkan link Gist tersebut di bawah ini untuk menghubungkan.
                    </p>
                  </div>
                  
                  <input 
                    type="text" 
                    value={tempRemoteUrl} 
                    onChange={e => setTempRemoteUrl(e.target.value)} 
                    placeholder="Contoh: https://gist.github.com/user/id" 
                    className="w-full p-4 border rounded-xl text-[10px] bg-white outline-none focus:ring-2 focus:ring-blue-600 font-mono"
                  />
                </div>

                <div className="flex gap-4">
                  <button 
                    onClick={handleSyncClick} 
                    disabled={isSyncingLocal}
                    className={`flex-1 ${isSyncingLocal ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700'} text-white py-4 rounded-xl font-bold uppercase text-[10px] shadow-lg shadow-blue-100 transition-all flex items-center justify-center gap-2`}
                  >
                    {isSyncingLocal ? (
                      <>
                        <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Menghubungkan...
                      </>
                    ) : (
                      'Connect & Sync Sekarang'
                    )}
                  </button>
                </div>
              </div>
              
              <div className="p-6 bg-gray-50 rounded-2xl border border-gray-100">
                <h4 className="text-[10px] font-black text-gray-900 uppercase tracking-widest mb-2">Status Saat Ini</h4>
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${remoteUrl ? 'bg-green-500 animate-pulse' : 'bg-gray-300'}`}></div>
                  <span className="text-[10px] font-bold text-gray-500 uppercase tracking-tighter">
                    {remoteUrl ? `Tersambung ke Cloud` : 'Berjalan di Penyimpanan Lokal (Offline)'}
                  </span>
                </div>
                {remoteUrl && (
                  <p className="mt-2 text-[8px] text-gray-400 break-all font-mono opacity-60 italic">{remoteUrl}</p>
                )}
              </div>

              {/* Reset Section - Dangerous Zone */}
              <div className="mt-12 pt-8 border-t border-red-50 flex flex-col items-center">
                <p className="text-[8px] font-black text-gray-300 uppercase tracking-widest mb-4 italic">Emergency Zone</p>
                <button 
                  onClick={onReset}
                  className="text-[9px] font-bold text-gray-300 hover:text-honda-red uppercase tracking-widest transition-colors"
                >
                  Reset to Factory Defaults
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="p-8 bg-gray-50 flex gap-4 border-t shrink-0">
          <button onClick={onClose} className="flex-grow py-4 text-xs font-bold uppercase text-gray-400 hover:text-gray-600 transition-colors">Tutup</button>
          <button 
            onClick={() => { onSave(tempSales, tempLogo, tempName, tempAddress, tempHeroBg); onClose(); }}
            className="flex-grow-[2] bg-gray-900 text-white py-4 rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-black transition-all shadow-xl active:scale-[0.98]"
          >
            Simpan Perubahan
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminSettingsModal;
