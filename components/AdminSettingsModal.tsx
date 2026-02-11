
import React, { useState, useEffect } from 'react';
import { SalesPerson, Promo, Product } from '../types';

interface AdminSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  salesInfo: SalesPerson;
  products: Product[];
  promos: Promo[];
  logo: string | null;
  dealerName: string;
  onSave: (newSalesInfo: SalesPerson, newLogo: string | null, newName: string) => void;
}

const AdminSettingsModal: React.FC<AdminSettingsModalProps> = ({ isOpen, onClose, salesInfo, products, promos, logo, dealerName, onSave }) => {
  const [activeTab, setActiveTab] = useState<'admin' | 'sales'>('admin');
  const [tempSales, setTempSales] = useState<SalesPerson>(salesInfo);
  const [tempLogo, setTempLogo] = useState<string | null>(logo);
  const [tempName, setTempName] = useState<string>(dealerName);
  const [copied, setCopied] = useState<string | false>(false);
  
  const [masterUrl, setMasterUrl] = useState('');
  const [personalUrl, setPersonalUrl] = useState('');

  useEffect(() => {
    const masterData = { logo: tempLogo, dealerName: tempName, products, promos };
    setMasterUrl(`${window.location.origin}${window.location.pathname}?p=${btoa(JSON.stringify(masterData))}`);

    const personalData = { salesInfo: tempSales, logo: tempLogo, dealerName: tempName, products, promos };
    setPersonalUrl(`${window.location.origin}${window.location.pathname}?p=${btoa(JSON.stringify(personalData))}`);
  }, [tempSales, tempLogo, tempName, products, promos]);

  const copy = (text: string, id: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(id);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, target: 'sales' | 'logo') => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        if (target === 'sales') {
          setTempSales(prev => ({ ...prev, photo: result }));
        } else {
          setTempLogo(result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md">
      <div className="bg-white rounded-[2.5rem] w-full max-w-3xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        {/* Tab Header */}
        <div className="flex border-b">
          <button 
            onClick={() => setActiveTab('admin')}
            className={`flex-1 py-6 font-black uppercase italic tracking-widest text-xs transition-all ${activeTab === 'admin' ? 'bg-gray-900 text-white' : 'text-gray-400 hover:text-gray-900'}`}
          >
            Tab 1: Dashboard Admin Utama
          </button>
          <button 
            onClick={() => setActiveTab('sales')}
            className={`flex-1 py-6 font-black uppercase italic tracking-widest text-xs transition-all ${activeTab === 'sales' ? 'bg-honda-red text-white' : 'text-gray-400 hover:text-honda-red'}`}
          >
            Tab 2: Profil Sales Pribadi
          </button>
        </div>
        
        <div className="p-8 overflow-y-auto space-y-8 no-scrollbar">
          {activeTab === 'admin' ? (
            <div className="space-y-8 animate-in fade-in duration-500">
              <div className="p-8 bg-gray-50 rounded-[2rem] border border-gray-100">
                <h3 className="text-sm font-black uppercase italic text-gray-900 mb-4">Link Master Perusahaan</h3>
                <p className="text-[11px] text-gray-500 mb-6 leading-relaxed">
                  Bagikan link di bawah ini kepada tim sales. Link ini berisi katalog produk resmi.
                </p>
                <div className="flex gap-2">
                  <input readOnly value={masterUrl} className="flex-grow p-4 bg-white border rounded-xl text-[10px] text-gray-400" />
                  <button 
                    onClick={() => copy(masterUrl, 'master')}
                    className={`px-6 rounded-xl font-bold uppercase text-[10px] transition-all ${copied === 'master' ? 'bg-green-500 text-white' : 'bg-gray-900 text-white'}`}
                  >
                    {copied === 'master' ? 'Tersalin!' : 'Salin Master'}
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-4">
                  <label className="block text-[9px] font-black text-gray-400 uppercase tracking-widest">Nama Dealer Utama</label>
                  <input type="text" value={tempName} onChange={e => setTempName(e.target.value)} className="w-full p-4 border rounded-xl text-xs font-bold bg-gray-50" />
                </div>
                <div className="space-y-4">
                  <label className="block text-[9px] font-black text-gray-400 uppercase tracking-widest">Logo Dealer (PNG/JPG)</label>
                  <div className="relative group h-12 border rounded-xl flex items-center justify-center bg-gray-50 overflow-hidden">
                    {tempLogo ? <img src={tempLogo} className="h-8 w-auto object-contain" /> : <span className="text-[10px] text-gray-400">Pilih Logo</span>}
                    <input type="file" onChange={e => handleFileChange(e, 'logo')} className="absolute inset-0 opacity-0 cursor-pointer" />
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-8 animate-in fade-in duration-500">
              <div className="p-8 bg-red-50 border border-red-100 rounded-[2rem] space-y-6">
                <h3 className="text-sm font-black uppercase italic text-honda-red">Link Jualan Konsumen</h3>
                <p className="text-[11px] text-gray-600">Gunakan link ini untuk promosi langsung ke pelanggan Anda di media sosial.</p>
                <div className="flex gap-2">
                  <input readOnly value={personalUrl} className="flex-grow p-4 bg-white border rounded-xl text-[10px] text-gray-400" />
                  <button 
                    onClick={() => copy(personalUrl, 'personal')}
                    className={`px-6 rounded-xl font-bold uppercase text-[10px] transition-all ${copied === 'personal' ? 'bg-green-500 text-white' : 'bg-honda-red text-white'}`}
                  >
                    {copied === 'personal' ? 'Tersalin!' : 'Salin Link Sales'}
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
                <div className="md:col-span-4">
                  <label className="block text-[9px] font-black text-gray-400 uppercase tracking-widest mb-3">Foto Profil Sales</label>
                  <div className="relative aspect-[3/4] bg-gray-100 rounded-3xl overflow-hidden border-2 border-dashed border-gray-200 group hover:border-honda-red transition-all">
                    <img src={tempSales.photo} className="w-full h-full object-cover transition-transform group-hover:scale-105" />
                    <input 
                      type="file" 
                      accept="image/*"
                      onChange={e => handleFileChange(e, 'sales')} 
                      className="absolute inset-0 opacity-0 cursor-pointer z-10" 
                    />
                    <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                      <svg className="w-8 h-8 text-white mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <span className="text-white text-[10px] font-black uppercase tracking-widest">Ganti Foto</span>
                    </div>
                  </div>
                </div>

                <div className="md:col-span-8 space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Nama Lengkap</label>
                      <input type="text" placeholder="Nama Anda" value={tempSales.name} onChange={e => setTempSales({...tempSales, name: e.target.value})} className="w-full p-4 border rounded-xl text-xs font-bold bg-gray-50 focus:bg-white transition-all outline-none focus:ring-1 focus:ring-honda-red" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Jabatan</label>
                      <input type="text" placeholder="e.g. Sales Consultant" value={tempSales.role} onChange={e => setTempSales({...tempSales, role: e.target.value})} className="w-full p-4 border rounded-xl text-xs font-bold bg-gray-50" />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest">WhatsApp (e.g. 62812...)</label>
                      <input type="text" placeholder="WhatsApp" value={tempSales.whatsapp} onChange={e => setTempSales({...tempSales, whatsapp: e.target.value})} className="w-full p-4 border rounded-xl text-xs bg-gray-50" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Email Kerja</label>
                      <input type="email" placeholder="Email" value={tempSales.email} onChange={e => setTempSales({...tempSales, email: e.target.value})} className="w-full p-4 border rounded-xl text-xs bg-gray-50" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Bio Singkat / Slogan</label>
                    <textarea placeholder="Ceritakan kelebihan Anda..." value={tempSales.bio} onChange={e => setTempSales({...tempSales, bio: e.target.value})} className="w-full p-4 border rounded-xl text-xs h-24 bg-gray-50 resize-none" />
                  </div>

                  {/* MEDIA SOSIAL SECTION */}
                  <div className="pt-4 border-t space-y-4">
                    <h4 className="text-[10px] font-black text-honda-red uppercase tracking-widest italic">Link Media Sosial</h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <label className="text-[8px] font-black text-gray-400 uppercase">Facebook URL</label>
                        <input type="text" value={tempSales.facebook || ''} onChange={e => setTempSales({...tempSales, facebook: e.target.value})} placeholder="https://facebook.com/..." className="w-full p-3 border rounded-lg text-[10px] bg-gray-50" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[8px] font-black text-gray-400 uppercase">Instagram URL</label>
                        <input type="text" value={tempSales.instagram || ''} onChange={e => setTempSales({...tempSales, instagram: e.target.value})} placeholder="https://instagram.com/..." className="w-full p-3 border rounded-lg text-[10px] bg-gray-50" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[8px] font-black text-gray-400 uppercase">TikTok URL</label>
                        <input type="text" value={tempSales.tiktok || ''} onChange={e => setTempSales({...tempSales, tiktok: e.target.value})} placeholder="https://tiktok.com/@..." className="w-full p-3 border rounded-lg text-[10px] bg-gray-50" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="p-8 bg-gray-50 flex gap-4 border-t">
          <button onClick={onClose} className="flex-grow py-4 text-xs font-bold uppercase text-gray-400">Batalkan</button>
          <button 
            onClick={() => { onSave(tempSales, tempLogo, tempName); onClose(); }}
            className="flex-grow-[2] bg-gray-900 text-white py-4 rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-black transition-all shadow-xl shadow-gray-200"
          >
            Simpan Konfigurasi
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminSettingsModal;
