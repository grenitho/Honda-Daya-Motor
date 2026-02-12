
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
  remoteUrl: string | null;
  onSyncRemote: (url: string) => Promise<any>;
  onSave: (newSalesInfo: SalesPerson, newLogo: string | null, newName: string, newAddress: string, newHeroBg: string) => void;
  onReset: () => void;
}

const AdminSettingsModal: React.FC<AdminSettingsModalProps> = ({ 
  isOpen, onClose, salesInfo, products, promos, logo, heroBackground, dealerName, dealerAddress, onSave, onReset 
}) => {
  const [activeTab, setActiveTab] = useState<'admin' | 'firebase'>('admin');
  const [tempSales, setTempSales] = useState<SalesPerson>(salesInfo);
  const [tempLogo, setTempLogo] = useState<string | null>(logo);
  const [tempHeroBg, setTempHeroBg] = useState<string>(heroBackground);
  const [tempName, setTempName] = useState<string>(dealerName);
  const [tempAddress, setTempAddress] = useState<string>(dealerAddress);
  
  // Firebase Setup States
  const [fbConfig, setFbConfig] = useState<string>(localStorage.getItem('honda_firebase_config') || '');

  useEffect(() => {
    if (isOpen) {
      setTempSales(salesInfo);
      setTempLogo(logo);
      setTempHeroBg(heroBackground);
      setTempName(dealerName);
      setTempAddress(dealerAddress);
    }
  }, [isOpen, salesInfo, logo, heroBackground, dealerName, dealerAddress]);

  const handleSaveFirebase = () => {
    try {
      JSON.parse(fbConfig); // Validasi JSON
      localStorage.setItem('honda_firebase_config', fbConfig);
      alert("Konfigurasi Firebase Tersimpan! Silakan muat ulang halaman (F5) untuk mengaktifkan Cloud Sync.");
      window.location.reload();
    } catch (e) {
      alert("Format Konfigurasi Salah. Pastikan berupa kode JSON yang valid dari Firebase Console.");
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
            Data Dealer
          </button>
          <button 
            onClick={() => setActiveTab('firebase')}
            className={`flex-1 py-5 font-black uppercase italic tracking-widest text-[10px] transition-all ${activeTab === 'firebase' ? 'bg-orange-500 text-white' : 'text-gray-400 hover:text-orange-500'}`}
          >
            Firebase Setup (Cloud Sync)
          </button>
        </div>
        
        <div className="p-8 overflow-y-auto space-y-8 no-scrollbar">
          {activeTab === 'admin' && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[9px] font-black uppercase text-gray-400 tracking-widest">Nama Dealer</label>
                  <input type="text" value={tempName} onChange={e => setTempName(e.target.value)} className="w-full p-3 border rounded-xl text-xs font-bold bg-gray-50" />
                </div>
                <div className="space-y-2">
                  <label className="text-[9px] font-black uppercase text-gray-400 tracking-widest">Logo (URL/File)</label>
                  <input type="text" value={tempLogo || ''} onChange={e => setTempLogo(e.target.value)} className="w-full p-3 border rounded-xl text-[10px] bg-gray-50" placeholder="https://..." />
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="text-[9px] font-black uppercase text-gray-400 tracking-widest">Alamat Lengkap</label>
                <input type="text" value={tempAddress} onChange={e => setTempAddress(e.target.value)} className="w-full p-3 border rounded-xl text-xs bg-gray-50" />
              </div>

              <div className="space-y-2">
                <label className="text-[9px] font-black uppercase text-gray-400 tracking-widest">Hero Image Background (URL)</label>
                <input type="text" value={tempHeroBg} onChange={e => setTempHeroBg(e.target.value)} className="w-full p-3 border rounded-xl text-xs bg-gray-50 font-mono" />
              </div>

              <div className="bg-red-50 p-6 rounded-2xl space-y-4">
                <h4 className="text-[10px] font-black uppercase italic text-honda-red">Hero Content</h4>
                <div className="grid grid-cols-2 gap-4">
                   <input type="text" value={tempSales.heroBadge} onChange={e => setTempSales({...tempSales, heroBadge: e.target.value})} className="p-3 border rounded-xl text-xs bg-white" placeholder="Badge" />
                   <input type="text" value={tempSales.heroHeadline} onChange={e => setTempSales({...tempSales, heroHeadline: e.target.value})} className="p-3 border rounded-xl text-xs bg-white" placeholder="Headline" />
                </div>
                <textarea value={tempSales.heroIntro} onChange={e => setTempSales({...tempSales, heroIntro: e.target.value})} className="w-full p-3 border rounded-xl text-xs bg-white h-20" placeholder="Intro Text" />
              </div>

              <button onClick={onReset} className="text-[8px] font-bold text-gray-300 uppercase block mx-auto hover:text-red-500">Reset to Default Data</button>
            </div>
          )}

          {activeTab === 'firebase' && (
            <div className="space-y-6 animate-in fade-in duration-500">
              <div className="bg-orange-50 border border-orange-100 p-6 rounded-3xl">
                <h3 className="text-orange-900 font-black uppercase italic text-sm mb-4">Integrasi Database Cloud</h3>
                <ol className="text-[10px] text-orange-800 space-y-2 list-decimal list-inside leading-relaxed font-medium">
                  <li>Buat project di <strong>Firebase Console</strong>.</li>
                  <li>Daftarkan Web App dan salin <strong>Firebase Config</strong> (Format JSON).</li>
                  <li>Tempel kode config di bawah ini.</li>
                  <li>Aktifkan <strong>Cloud Firestore</strong> dalam Mode Tes di Firebase Console.</li>
                </ol>
              </div>

              <div className="space-y-2">
                <label className="text-[9px] font-black uppercase text-orange-600 tracking-widest">Firebase Config JSON</label>
                <textarea 
                  value={fbConfig}
                  onChange={e => setFbConfig(e.target.value)}
                  placeholder='{"apiKey": "...", "projectId": "...", ...}'
                  className="w-full p-4 border-2 border-orange-100 rounded-2xl text-[10px] font-mono h-48 bg-orange-50/30 outline-none focus:border-orange-500 transition-colors"
                />
              </div>

              <button 
                onClick={handleSaveFirebase}
                className="w-full bg-orange-500 text-white py-4 rounded-2xl font-black uppercase text-xs tracking-widest shadow-xl shadow-orange-100 hover:bg-orange-600 active:scale-95 transition-all"
              >
                Simpan & Aktifkan Real-time Sync
              </button>
            </div>
          )}
        </div>

        <div className="p-8 bg-gray-50 flex gap-4 border-t">
          <button onClick={onClose} className="flex-1 py-4 text-xs font-bold uppercase text-gray-400">Batal</button>
          <button 
            onClick={() => { onSave(tempSales, tempLogo, tempName, tempAddress, tempHeroBg); onClose(); }}
            className="flex-[2] bg-gray-900 text-white py-4 rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-black transition-all"
          >
            Simpan Perubahan Dealer
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminSettingsModal;
