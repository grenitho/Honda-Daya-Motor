
import React, { useState, useEffect } from 'react';
import { SalesPerson, Promo, Product } from '../types.ts';

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

  // 1. Generate URLs
  useEffect(() => {
    // Master Link: Only Catalog & Branding (Default Sales)
    const masterData = { logo: tempLogo, dealerName: tempName, products, promos };
    setMasterUrl(`${window.location.origin}${window.location.pathname}?p=${btoa(JSON.stringify(masterData))}`);

    // Personal Link: Full Data including Sales Profile
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
        if (target === 'sales') setTempSales({ ...tempSales, photo: result });
        else setTempLogo(result);
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
            Tab 1: Dashboard Admin Utama (Pusat)
          </button>
          <button 
            onClick={() => setActiveTab('sales')}
            className={`flex-1 py-6 font-black uppercase italic tracking-widest text-xs transition-all ${activeTab === 'sales' ? 'bg-honda-red text-white' : 'text-gray-400 hover:text-honda-red'}`}
          >
            Tab 2: Profil Sales (Pribadi)
          </button>
        </div>
        
        <div className="p-8 overflow-y-auto space-y-8">
          {activeTab === 'admin' ? (
            <div className="space-y-8 animate-in fade-in duration-500">
              <div className="p-8 bg-gray-50 rounded-[2rem] border border-gray-100">
                <h3 className="text-sm font-black uppercase italic text-gray-900 mb-4">Link Master Perusahaan</h3>
                <p className="text-[11px] text-gray-500 mb-6 leading-relaxed">
                  Bagikan link di bawah ini kepada <strong>seluruh Sales/Tim Marketing</strong>. Link ini berisi Katalog Produk dan Promo resmi yang sudah Anda atur. Sales nantinya akan mengisi profil mereka sendiri melalui link ini.
                </p>
                <div className="flex gap-2">
                  <input readOnly value={masterUrl} className="flex-grow p-4 bg-white border rounded-xl text-[10px] text-gray-400" />
                  <button 
                    onClick={() => copy(masterUrl, 'master')}
                    className={`px-6 rounded-xl font-bold uppercase text-[10px] transition-all ${copied === 'master' ? 'bg-green-500 text-white' : 'bg-gray-900 text-white'}`}
                  >
                    {copied === 'master' ? 'Tersalin!' : 'Salin Master Link'}
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-[9px] font-black text-gray-400 uppercase mb-2">Nama Dealer Utama</label>
                  <input type="text" value={tempName} onChange={e => setTempName(e.target.value)} className="w-full p-4 border rounded-xl text-xs font-bold" />
                </div>
                <div>
                  <label className="block text-[9px] font-black text-gray-400 uppercase mb-2">Logo Dealer</label>
                  <input type="file" onChange={e => handleFileChange(e, 'logo')} className="text-[10px]" />
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-8 animate-in fade-in duration-500">
              <div className="p-8 bg-red-50 border border-red-100 rounded-[2rem] space-y-6">
                <h3 className="text-sm font-black uppercase italic text-honda-red">Link Jualan Pribadi</h3>
                <p className="text-[11px] text-gray-600">Link ini khusus untuk disebarkan <strong>langsung ke konsumen</strong>. Sudah berisi profil dan kontak WA Anda.</p>
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

              <div className="grid grid-cols-3 gap-6">
                <div className="relative aspect-[3/4] bg-gray-100 rounded-2xl overflow-hidden border group">
                  <img src={tempSales.photo} className="w-full h-full object-cover" />
                  <input type="file" onChange={e => handleFileChange(e, 'sales')} className="absolute inset-0 opacity-0 cursor-pointer" />
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="text-white text-[8px] font-black uppercase">Ganti Foto</span>
                  </div>
                </div>
                <div className="col-span-2 space-y-4">
                  <input type="text" placeholder="Nama Anda" value={tempSales.name} onChange={e => setTempSales({...tempSales, name: e.target.value})} className="w-full p-4 border rounded-xl text-xs font-bold" />
                  <input type="text" placeholder="WhatsApp (628...)" value={tempSales.whatsapp} onChange={e => setTempSales({...tempSales, whatsapp: e.target.value})} className="w-full p-4 border rounded-xl text-xs" />
                  <textarea placeholder="Bio Singkat" value={tempSales.bio} onChange={e => setTempSales({...tempSales, bio: e.target.value})} className="w-full p-4 border rounded-xl text-xs h-20" />
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="p-8 bg-gray-50 flex gap-4 border-t">
          <button onClick={onClose} className="flex-grow py-4 text-xs font-bold uppercase text-gray-400">Tutup</button>
          <button 
            onClick={() => { onSave(tempSales, tempLogo, tempName); onClose(); }}
            className="flex-grow-[2] bg-gray-900 text-white py-4 rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-black transition-all"
          >
            Simpan Perubahan
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminSettingsModal;
