
import React, { useState } from 'react';
import { Promo } from '../types.ts';

interface AdminPromoModalProps {
  isOpen: boolean;
  onClose: () => void;
  promos: Promo[];
  onSave: (newPromos: Promo[]) => void;
}

const AdminPromoModal: React.FC<AdminPromoModalProps> = ({ isOpen, onClose, promos, onSave }) => {
  const [tempPromos, setTempPromos] = useState<Promo[]>(promos);
  const [isAdding, setIsAdding] = useState(false);
  const [newPromo, setNewPromo] = useState<Partial<Promo>>({
    title: '', subtitle: '', image: '', tag: 'Promo Spesial', whatsappSuffix: 'saya tertarik dengan promo ini.'
  });

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewPromo({ ...newPromo, image: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAdd = () => {
    if (newPromo.title && newPromo.image) {
      const promoToAdd = {
        ...newPromo,
        id: Date.now().toString(),
      } as Promo;
      const updated = [...tempPromos, promoToAdd];
      setTempPromos(updated);
      onSave(updated);
      setNewPromo({ title: '', subtitle: '', image: '', tag: 'Promo Spesial', whatsappSuffix: 'saya tertarik dengan promo ini.' });
      setIsAdding(false);
    }
  };

  const handleDelete = (id: string) => {
    const updated = tempPromos.filter(p => p.id !== id);
    setTempPromos(updated);
    onSave(updated);
  };

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm">
      <div className="bg-white rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl flex flex-col max-h-[85vh]">
        <div className="bg-honda-red px-8 py-5 flex justify-between items-center text-white">
          <div>
            <h2 className="text-xl font-black italic uppercase tracking-tighter">Corporate Promo Manager</h2>
            <p className="text-[10px] text-red-100 font-bold uppercase tracking-widest">Main Admin Authority</p>
          </div>
          <button onClick={onClose} className="hover:rotate-90 transition-transform text-2xl">✕</button>
        </div>

        <div className="p-8 overflow-y-auto space-y-8">
          <div className="flex justify-between items-center border-b pb-4">
            <h3 className="text-sm font-black uppercase italic text-gray-900">Daftar Promo Aktif</h3>
            <button 
              onClick={() => setIsAdding(!isAdding)}
              className="bg-gray-900 text-white px-4 py-2 rounded-lg text-[10px] font-bold uppercase tracking-widest hover:bg-honda-red transition-all"
            >
              {isAdding ? 'Batal' : '+ Tambah Promo Baru'}
            </button>
          </div>

          {isAdding && (
            <div className="bg-gray-50 p-6 rounded-2xl border-2 border-dashed border-gray-200 space-y-4 animate-in fade-in slide-in-from-top-4 duration-300">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <input 
                    type="text" 
                    placeholder="Judul Promo (Contoh: Cashback 5 Juta)"
                    value={newPromo.title}
                    onChange={(e) => setNewPromo({...newPromo, title: e.target.value})}
                    className="w-full px-4 py-3 border rounded-xl text-xs font-bold"
                  />
                  <input 
                    type="text" 
                    placeholder="Sub-judul (Keterangan singkat)"
                    value={newPromo.subtitle}
                    onChange={(e) => setNewPromo({...newPromo, subtitle: e.target.value})}
                    className="w-full px-4 py-3 border rounded-xl text-xs"
                  />
                </div>
                <div className="space-y-3">
                  <div className="relative h-24 bg-white border border-gray-200 rounded-xl overflow-hidden flex items-center justify-center">
                    {newPromo.image ? (
                      <img src={newPromo.image} className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-[10px] text-gray-400 font-bold uppercase">Upload Banner Promo</span>
                    )}
                    <input type="file" accept="image/*" onChange={handleFileChange} className="absolute inset-0 opacity-0 cursor-pointer" />
                  </div>
                  <input 
                    type="text" 
                    placeholder="Tag (Contoh: Hot Deal)"
                    value={newPromo.tag}
                    onChange={(e) => setNewPromo({...newPromo, tag: e.target.value})}
                    className="w-full px-4 py-2 border rounded-xl text-xs"
                  />
                </div>
              </div>
              <button 
                onClick={handleAdd}
                className="w-full bg-honda-red text-white py-4 rounded-xl font-black uppercase text-xs tracking-widest shadow-lg shadow-red-100"
              >
                Publish Promo Perusahaan
              </button>
            </div>
          )}

          <div className="grid grid-cols-1 gap-4">
            {tempPromos.length === 0 && !isAdding && (
              <p className="text-center py-10 text-gray-400 italic text-sm">Belum ada promo aktif.</p>
            )}
            {tempPromos.map((promo) => (
              <div key={promo.id} className="flex items-center gap-4 p-4 bg-white border rounded-2xl group hover:border-honda-red transition-all">
                <img src={promo.image} className="w-20 h-20 object-cover rounded-xl border" />
                <div className="flex-grow">
                  <span className="text-[8px] font-black uppercase text-honda-red bg-red-50 px-2 py-0.5 rounded-full mb-1 inline-block">{promo.tag}</span>
                  <h4 className="text-sm font-black uppercase italic text-gray-900 leading-tight">{promo.title}</h4>
                  <p className="text-[10px] text-gray-500 line-clamp-1">{promo.subtitle}</p>
                </div>
                <button 
                  onClick={() => handleDelete(promo.id)}
                  className="p-2 text-gray-300 hover:text-honda-red transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="p-8 bg-gray-50 flex justify-center">
          <button 
            onClick={onClose}
            className="px-12 py-4 bg-gray-900 text-white rounded-xl font-black uppercase text-xs tracking-widest hover:bg-black transition-all"
          >
            Selesai Kelola
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminPromoModal;
