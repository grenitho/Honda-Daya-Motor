
import React, { useState, useEffect } from 'react';
import { generateBikeDetails } from '../services/geminiService.ts';
import { Product, ProductSpecs } from '../types.ts';

interface UploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (product: Product) => void;
  productToEdit?: Product;
}

const UploadModal: React.FC<UploadModalProps> = ({ isOpen, onClose, onAdd, productToEdit }) => {
  const [name, setName] = useState('');
  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  
  const [showEditor, setShowEditor] = useState(false);
  const [editedProduct, setEditedProduct] = useState<Partial<Product>>({});

  // Sync state if editing
  useEffect(() => {
    if (productToEdit) {
      setName(productToEdit.name);
      setImage(productToEdit.image);
      setEditedProduct(productToEdit);
      setShowEditor(true);
    } else {
      reset();
    }
  }, [productToEdit, isOpen]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setImage(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleFetchAI = async () => {
    if (!name || !image) return;
    setLoading(true);
    try {
      const aiDetails = await generateBikeDetails(name);
      setEditedProduct({
        ...aiDetails,
        image: image as string,
      });
      setShowEditor(true);
    } catch (error) {
      console.error(error);
      alert("Gagal mengambil data AI. Silakan isi manual.");
      setShowEditor(true);
      setEditedProduct({
        name,
        image: image as string,
        price: 'Rp ',
        category: 'Matic',
        specs: { engine: '', power: '', torque: '', transmission: '', fuelCapacity: '' },
        features: [],
        colors: []
      });
    } finally {
      setLoading(false);
    }
  };

  const handlePublish = () => {
    if (editedProduct.name) {
      onAdd({
        ...editedProduct as Product,
        id: productToEdit?.id || Date.now().toString(),
        image: image || editedProduct.image || '',
      });
      reset();
      onClose();
    }
  };

  const reset = () => {
    setName('');
    setImage(null);
    setShowEditor(false);
    setEditedProduct({});
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[130] flex items-center justify-center p-4 bg-black/95 backdrop-blur-md">
      <div className="bg-white rounded-[2rem] w-full max-w-2xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        <div className="bg-honda-red px-8 py-5 flex justify-between items-center text-white">
          <h2 className="text-xl font-black italic uppercase tracking-tighter">
            {productToEdit ? 'Update Unit' : 'Registrasi Unit Baru'}
          </h2>
          <button onClick={() => { reset(); onClose(); }} className="hover:rotate-90 transition-transform">✕</button>
        </div>
        
        <div className="p-8 overflow-y-auto space-y-6">
          {!showEditor ? (
            <div className="space-y-6">
              <div>
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Nama Unit (AI akan mencari spesifikasinya)</label>
                <input 
                  type="text" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g., Honda Vario 160 ABS"
                  className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-honda-red outline-none font-bold text-sm"
                />
              </div>

              <div>
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Foto Produk Utama</label>
                <div className="relative border-2 border-dashed border-gray-200 rounded-3xl h-48 flex flex-col items-center justify-center bg-gray-50 hover:bg-gray-100 transition-all overflow-hidden">
                  {image ? (
                    <img src={image} className="w-full h-full object-cover" alt="Preview" />
                  ) : (
                    <span className="text-gray-400 text-xs font-bold uppercase">Klik/Drop Gambar Unit</span>
                  )}
                  <input type="file" onChange={handleFileChange} className="absolute inset-0 opacity-0 cursor-pointer" accept="image/*" />
                </div>
              </div>

              <button 
                onClick={handleFetchAI}
                disabled={loading || !name || !image}
                className="w-full bg-gray-900 text-white font-black py-5 rounded-2xl uppercase tracking-widest hover:bg-black transition-all disabled:opacity-50 flex items-center justify-center gap-3"
              >
                {loading ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div> : 'Ambil Spek via Gemini AI'}
              </button>
            </div>
          ) : (
            <div className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <h3 className="text-xs font-black uppercase text-honda-red italic underline">Data Dasar</h3>
                  <div className="space-y-3">
                    <input 
                      type="text" value={editedProduct.name} 
                      onChange={e => setEditedProduct({...editedProduct, name: e.target.value})}
                      placeholder="Nama Unit" className="w-full p-3 border rounded-xl text-xs font-bold"
                    />
                    <select 
                      value={editedProduct.category} 
                      onChange={e => setEditedProduct({...editedProduct, category: e.target.value as any})}
                      className="w-full p-3 border rounded-xl text-xs font-bold bg-white"
                    >
                      <option value="Matic">Matic</option>
                      <option value="Sport">Sport</option>
                      <option value="Cub">Cub</option>
                      <option value="Big Bike">Big Bike</option>
                      <option value="EV">EV</option>
                    </select>
                    <input 
                      type="text" value={editedProduct.price} 
                      onChange={e => setEditedProduct({...editedProduct, price: e.target.value})}
                      placeholder="Harga (Rp ...)" className="w-full p-3 border rounded-xl text-xs"
                    />
                    <textarea 
                      value={editedProduct.description} 
                      onChange={e => setEditedProduct({...editedProduct, description: e.target.value})}
                      placeholder="Deskripsi Singkat" className="w-full p-3 border rounded-xl text-xs h-32"
                    />
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h3 className="text-xs font-black uppercase text-honda-red italic underline">Spesifikasi Teknik</h3>
                  <div className="space-y-2">
                    {['engine', 'power', 'torque', 'transmission', 'fuelCapacity'].map((key) => (
                      <div key={key}>
                        <label className="text-[8px] uppercase font-bold text-gray-400 ml-1">{key}</label>
                        <input 
                          type="text" 
                          value={(editedProduct.specs as any)?.[key] || ''} 
                          onChange={e => setEditedProduct({
                            ...editedProduct, 
                            specs: { ...editedProduct.specs, [key]: e.target.value } as ProductSpecs
                          })}
                          className="w-full p-2 border rounded-lg text-[10px]"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-xs font-black uppercase text-honda-red italic underline mb-3">Ketersediaan Warna (Gunakan koma)</h3>
                <input 
                  type="text" 
                  value={editedProduct.colors?.join(', ') || ''} 
                  onChange={e => setEditedProduct({...editedProduct, colors: e.target.value.split(',').map(s => s.trim())})}
                  placeholder="Contoh: Matte Black, Candy Red, Pearl White" 
                  className="w-full p-4 border rounded-2xl text-xs font-medium bg-gray-50 focus:bg-white transition-all"
                />
              </div>

              <div className="pt-4 border-t flex gap-4">
                <button 
                  onClick={() => {
                    if (productToEdit) onClose();
                    else setShowEditor(false);
                  }}
                  className="flex-1 py-4 text-xs font-bold uppercase text-gray-400"
                >
                  Kembali
                </button>
                <button 
                  onClick={handlePublish}
                  className="flex-[2] bg-honda-red text-white font-black py-4 rounded-2xl uppercase tracking-widest shadow-xl shadow-red-200"
                >
                  {productToEdit ? 'Simpan Perubahan' : 'Publish ke Katalog'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UploadModal;
