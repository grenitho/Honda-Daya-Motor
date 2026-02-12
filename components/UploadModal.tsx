
import React, { useState, useEffect } from 'react';
import { generateBikeDetails } from '../services/geminiService';
import { Product, ProductSpecs } from '../types';

interface UploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (product: Product) => void;
  productToEdit?: Product;
}

const UploadModal: React.FC<UploadModalProps> = ({ isOpen, onClose, onAdd, productToEdit }) => {
  const [loadingAI, setLoadingAI] = useState(false);
  
  const [formData, setFormData] = useState<Partial<Product>>({
    name: '',
    price: '',
    category: 'Matic',
    description: '',
    image: '',
    specs: { engine: '', power: '', torque: '', transmission: '', fuelCapacity: '' },
    features: [],
    colors: []
  });

  useEffect(() => {
    if (productToEdit) {
      setFormData(productToEdit);
    } else {
      reset();
    }
  }, [productToEdit, isOpen]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setFormData({ ...formData, image: reader.result as string });
      reader.readAsDataURL(file);
    }
  };

  const handleFetchAI = async () => {
    if (!formData.name) {
      alert("Masukkan nama unit dulu (Contoh: Vario 160)");
      return;
    }
    setLoadingAI(true);
    try {
      // Sekarang mengirim Nama DAN Kategori ke AI
      const aiDetails = await generateBikeDetails(formData.name, formData.category || 'Matic');
      setFormData({
        ...formData,
        ...aiDetails,
        image: formData.image || '', // Tetap simpan foto yang sudah diupload
        category: formData.category // Pertahankan kategori yang dipilih user jika AI salah
      });
    } catch (error: any) {
      console.warn("AI Assistant not available:", error.message);
      alert("Catatan: Gagal mendapatkan data otomatis. Silakan isi spesifikasi secara manual.");
    } finally {
      setLoadingAI(false);
    }
  };

  const handlePublish = () => {
    if (!formData.name || !formData.image || !formData.price) {
      alert("Nama, Harga, dan Foto wajib diisi!");
      return;
    }
    onAdd({
      ...formData as Product,
      id: productToEdit?.id || Date.now().toString(),
    });
    reset();
    onClose();
  };

  const reset = () => {
    setFormData({
      name: '',
      price: '',
      category: 'Matic',
      description: '',
      image: '',
      specs: { engine: '', power: '', torque: '', transmission: '', fuelCapacity: '' },
      features: [],
      colors: []
    });
    setLoadingAI(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[130] flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm">
      <div className="bg-white rounded-[2rem] w-full max-w-4xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="bg-honda-red px-8 py-5 flex justify-between items-center text-white shrink-0">
          <div>
            <h2 className="text-xl font-black italic uppercase tracking-tighter">
              {productToEdit ? 'Edit Data Unit' : 'Input Unit Baru'}
            </h2>
            <p className="text-[9px] font-bold uppercase opacity-70 tracking-widest">Honda Management System</p>
          </div>
          <button onClick={onClose} className="hover:rotate-90 transition-transform text-2xl">✕</button>
        </div>
        
        <div className="p-8 overflow-y-auto space-y-8 no-scrollbar">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
            {/* Kiri: Foto & Identitas Utama */}
            <div className="md:col-span-5 space-y-6">
              <div>
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">Foto Motor</label>
                <div className="relative aspect-video border-2 border-dashed border-gray-200 rounded-3xl flex flex-col items-center justify-center bg-gray-50 hover:bg-gray-100 transition-all overflow-hidden group">
                  {formData.image ? (
                    <>
                      <img src={formData.image} className="w-full h-full object-cover" alt="Preview" />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                        <span className="text-white font-bold text-xs uppercase">Ganti Foto</span>
                      </div>
                    </>
                  ) : (
                    <div className="text-center p-4">
                      <svg className="w-10 h-10 text-gray-300 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest">Klik Untuk Upload</p>
                    </div>
                  )}
                  <input type="file" onChange={handleFileChange} className="absolute inset-0 opacity-0 cursor-pointer" accept="image/*" />
                </div>
              </div>

              <div className="space-y-4">
                <div className="relative">
                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Nama Unit</label>
                  <div className="flex gap-2">
                    <input 
                      type="text" 
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      placeholder="Contoh: Honda Vario 160 ABS"
                      className="flex-grow px-5 py-3 bg-gray-50 border rounded-xl focus:ring-2 focus:ring-honda-red outline-none font-bold text-sm"
                    />
                    <button 
                      onClick={handleFetchAI}
                      disabled={loadingAI}
                      title="Bantu isi dengan AI (Berdasarkan Nama & Kategori)"
                      className={`px-4 bg-gray-900 text-white rounded-xl hover:bg-blue-600 transition-all ${loadingAI ? 'animate-pulse' : ''}`}
                    >
                      {loadingAI ? '...' : '✨'}
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Kategori</label>
                    <select 
                      value={formData.category}
                      onChange={(e) => setFormData({...formData, category: e.target.value as any})}
                      className="w-full px-4 py-3 bg-gray-50 border rounded-xl font-bold text-xs outline-none"
                    >
                      <option value="Matic">Matic</option>
                      <option value="Sport">Sport</option>
                      <option value="Cub">Cub</option>
                      <option value="EV">EV</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Harga OTR</label>
                    <input 
                      type="text" 
                      value={formData.price}
                      onChange={(e) => setFormData({...formData, price: e.target.value})}
                      placeholder="Rp 30.000.000"
                      className="w-full px-4 py-3 bg-gray-50 border rounded-xl font-bold text-xs outline-none"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Kanan: Spesifikasi Detail */}
            <div className="md:col-span-7 space-y-6">
              <h3 className="text-xs font-black uppercase text-honda-red italic underline decoration-2 underline-offset-4">Spesifikasi Teknik</h3>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[8px] font-black text-gray-400 uppercase tracking-widest mb-1">Mesin</label>
                  <input type="text" value={formData.specs?.engine} onChange={e => setFormData({...formData, specs: {...formData.specs, engine: e.target.value} as ProductSpecs})} className="w-full p-3 bg-gray-50 border rounded-xl text-[10px]" placeholder="160cc, eSP+..." />
                </div>
                <div>
                  <label className="block text-[8px] font-black text-gray-400 uppercase tracking-widest mb-1">Tenaga Maksimum</label>
                  <input type="text" value={formData.specs?.power} onChange={e => setFormData({...formData, specs: {...formData.specs, power: e.target.value} as ProductSpecs})} className="w-full p-3 bg-gray-50 border rounded-xl text-[10px]" placeholder="11.3 kW..." />
                </div>
                <div>
                  <label className="block text-[8px] font-black text-gray-400 uppercase tracking-widest mb-1">Torsi Maksimum</label>
                  <input type="text" value={formData.specs?.torque} onChange={e => setFormData({...formData, specs: {...formData.specs, torque: e.target.value} as ProductSpecs})} className="w-full p-3 bg-gray-50 border rounded-xl text-[10px]" placeholder="13.8 Nm..." />
                </div>
                <div>
                  <label className="block text-[8px] font-black text-gray-400 uppercase tracking-widest mb-1">Kapasitas Tangki</label>
                  <input type="text" value={formData.specs?.fuelCapacity} onChange={e => setFormData({...formData, specs: {...formData.specs, fuelCapacity: e.target.value} as ProductSpecs})} className="w-full p-3 bg-gray-50 border rounded-xl text-[10px]" placeholder="5.5 Liter..." />
                </div>
              </div>

              <div>
                <label className="block text-[8px] font-black text-gray-400 uppercase tracking-widest mb-1">Deskripsi Singkat</label>
                <textarea 
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  className="w-full p-4 bg-gray-50 border rounded-2xl text-[10px] leading-relaxed h-24 resize-none"
                  placeholder="Ceritakan kelebihan motor ini..."
                />
              </div>

              <div>
                <label className="block text-[8px] font-black text-gray-400 uppercase tracking-widest mb-1">Fitur Utama (Pisahkan koma)</label>
                <input 
                  type="text" 
                  value={formData.features?.join(', ')} 
                  onChange={e => setFormData({...formData, features: e.target.value.split(',').map(s => s.trim())})}
                  className="w-full p-3 bg-gray-50 border rounded-xl text-[10px]"
                  placeholder="ABS, Smart Key, LED..."
                />
              </div>
            </div>
          </div>
        </div>

        <div className="p-8 bg-gray-50 border-t flex gap-4 shrink-0">
          <button onClick={onClose} className="flex-1 py-4 text-xs font-bold uppercase text-gray-400">Batal</button>
          <button 
            onClick={handlePublish}
            className="flex-[2] bg-honda-red text-white py-4 rounded-2xl font-black uppercase text-xs tracking-widest shadow-xl shadow-red-100 hover:bg-red-700 transition-all"
          >
            Publish ke Katalog
          </button>
        </div>
      </div>
    </div>
  );
};

export default UploadModal;
