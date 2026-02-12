
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
  const [loading, setLoading] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);
  
  // State untuk form data
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
      alert("Masukkan nama unit terlebih dahulu untuk dibantu AI.");
      return;
    }
    setLoading(true);
    setAiError(null);
    try {
      const aiDetails = await generateBikeDetails(formData.name);
      // Fix: Removed reference to aiDetails.image as it's not present in the GeminiBikeResponse type
      setFormData({
        ...formData,
        ...aiDetails,
        // Tetap gunakan gambar yang sudah diupload user jika ada
        image: formData.image || '',
      });
      alert("✨ Berhasil! Data telah diisi otomatis oleh Gemini AI.");
    } catch (error: any) {
      console.error("AI Fetch Error:", error);
      setAiError(error.message || "Gagal terhubung ke AI.");
      alert("⚠️ AI tidak bisa menarik data. Silakan isi secara manual.");
    } finally {
      setLoading(false);
    }
  };

  const handlePublish = () => {
    if (!formData.name || !formData.image) {
      alert("Nama unit dan Foto harus diisi!");
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
    setAiError(null);
    setLoading(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[130] flex items-center justify-center p-4 bg-black/95 backdrop-blur-md">
      <div className="bg-white rounded-[2.5rem] w-full max-w-4xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        <div className="bg-honda-red px-8 py-5 flex justify-between items-center text-white shrink-0">
          <div>
            <h2 className="text-xl font-black italic uppercase tracking-tighter">
              {productToEdit ? 'Edit Unit' : 'Registrasi Unit Baru'}
            </h2>
            <p className="text-[9px] font-bold uppercase opacity-70 tracking-widest">Daya Motor Management System</p>
          </div>
          <button onClick={() => { reset(); onClose(); }} className="hover:rotate-90 transition-transform text-2xl">✕</button>
        </div>
        
        <div className="p-8 overflow-y-auto space-y-8 no-scrollbar">
          {/* AI Helper Bar */}
          <div className="p-4 bg-gray-900 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center animate-pulse">
                <span className="text-white text-xs font-black italic">G</span>
              </div>
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">
                Capek mengetik? <span className="text-white">Gunakan Gemini AI</span> untuk auto-fill spesifikasi.
              </p>
            </div>
            <button 
              onClick={handleFetchAI}
              disabled={loading || !formData.name}
              className="bg-white text-black px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-600 hover:text-white transition-all disabled:opacity-30 flex items-center gap-2"
            >
              {loading ? 'Sedang Berpikir...' : '✨ Auto-Fill dengan AI'}
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
            {/* Left Column: Media & Info */}
            <div className="md:col-span-5 space-y-6">
              <div>
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">Foto Unit</label>
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
                      <p className="text-gray-400 text-[10px] font-black uppercase">Upload Foto Unit</p>
                      <p className="text-[8px] text-gray-300 uppercase mt-1">Sangat disarankan background putih</p>
                    </div>
                  )}
                  <input type="file" onChange={handleFileChange} className="absolute inset-0 opacity-0 cursor-pointer" accept="image/*" />
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Nama Unit</label>
                  <input 
                    type="text" 
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    placeholder="Contoh: Honda Vario 160 ABS"
                    className="w-full px-5 py-4 bg-gray-50 border rounded-2xl focus:ring-2 focus:ring-honda-red outline-none font-bold text-sm"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Kategori</label>
                    <select 
                      value={formData.category}
                      onChange={(e) => setFormData({...formData, category: e.target.value as any})}
                      className="w-full px-4 py-4 bg-gray-50 border rounded-2xl font-bold text-xs outline-none"
                    >
                      <option value="Matic">Matic</option>
                      <option value="Sport">Sport</option>
                      <option value="Cub">Cub</option>
                      <option value="Big Bike">Big Bike</option>
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
                      className="w-full px-4 py-4 bg-gray-50 border rounded-2xl font-bold text-xs outline-none"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Specs */}
            <div className="md:col-span-7 space-y-6">
              <h3 className="text-xs font-black uppercase text-honda-red italic underline decoration-2 underline-offset-4">Spesifikasi & Fitur</h3>
              
              <div className="grid grid-cols-2 gap-4">
                {['engine', 'power', 'torque', 'transmission', 'fuelCapacity'].map((key) => (
                  <div key={key}>
                    <label className="block text-[8px] font-black text-gray-400 uppercase tracking-widest mb-1">{key}</label>
                    <input 
                      type="text" 
                      value={(formData.specs as any)?.[key] || ''} 
                      onChange={e => setFormData({
                        ...formData, 
                        specs: { ...formData.specs, [key]: e.target.value } as ProductSpecs
                      })}
                      className="w-full p-3 bg-gray-50 border rounded-xl text-[10px] font-medium"
                      placeholder={`Detail ${key}...`}
                    />
                  </div>
                ))}
              </div>

              <div>
                <label className="block text-[8px] font-black text-gray-400 uppercase tracking-widest mb-1">Pilihan Warna (Pisahkan koma)</label>
                <input 
                  type="text" 
                  value={formData.colors?.join(', ') || ''} 
                  onChange={e => setFormData({...formData, colors: e.target.value.split(',').map(s => s.trim())})}
                  placeholder="Matte Black, Candy Red..." 
                  className="w-full p-3 bg-gray-50 border rounded-xl text-[10px]"
                />
              </div>

              <div>
                <label className="block text-[8px] font-black text-gray-400 uppercase tracking-widest mb-1">Deskripsi Singkat</label>
                <textarea 
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  className="w-full p-4 bg-gray-50 border rounded-2xl text-[10px] leading-relaxed h-32 resize-none"
                  placeholder="Tulis keunggulan unit di sini..."
                />
              </div>
            </div>
          </div>
        </div>

        <div className="p-8 bg-gray-50 border-t flex gap-4 shrink-0">
          <button onClick={() => { reset(); onClose(); }} className="flex-1 py-4 text-xs font-bold uppercase text-gray-400">Batal</button>
          <button 
            onClick={handlePublish}
            className="flex-[2] bg-honda-red text-white py-4 rounded-2xl font-black uppercase text-xs tracking-widest shadow-xl shadow-red-100 hover:bg-red-700 transition-all active:scale-95"
          >
            {productToEdit ? 'Simpan Perubahan' : 'Publish Ke Katalog'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default UploadModal;
