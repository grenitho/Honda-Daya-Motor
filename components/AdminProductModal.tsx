
import React, { useState } from 'react';
import { Product } from '../types.ts';
import UploadModal from './UploadModal.tsx';

interface AdminProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  products: Product[];
  onSave: (newProducts: Product[]) => void;
}

const AdminProductModal: React.FC<AdminProductModalProps> = ({ isOpen, onClose, products, onSave }) => {
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | undefined>(undefined);

  if (!isOpen) return null;

  const handleDelete = (id: string) => {
    if (confirm('Apakah Anda yakin ingin menghapus unit ini dari katalog resmi?')) {
      onSave(products.filter(p => p.id !== id));
    }
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setIsUploadModalOpen(true);
  };

  const handleSaveProduct = (product: Product) => {
    if (editingProduct) {
      onSave(products.map(p => p.id === product.id ? product : p));
    } else {
      onSave([product, ...products]);
    }
    setEditingProduct(undefined);
  };

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm">
      <div className="bg-white rounded-[2.5rem] w-full max-w-3xl overflow-hidden shadow-2xl flex flex-col max-h-[85vh]">
        <div className="bg-gray-900 px-8 py-6 flex justify-between items-center text-white">
          <div>
            <h2 className="text-xl font-black italic uppercase tracking-tighter">Corporate Catalog Manager</h2>
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Manajemen Unit & Spesifikasi</p>
          </div>
          <button onClick={onClose} className="hover:text-honda-red transition-colors text-2xl">✕</button>
        </div>

        <div className="p-8 overflow-y-auto space-y-8">
          <div className="flex justify-between items-center border-b pb-4">
            <h3 className="text-sm font-black uppercase italic text-gray-900">Total Unit: {products.length}</h3>
            <button 
              onClick={() => {
                setEditingProduct(undefined);
                setIsUploadModalOpen(true);
              }}
              className="bg-honda-red text-white px-5 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-red-700 transition-all shadow-lg shadow-red-100"
            >
              + Registrasi Unit Baru
            </button>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {products.map((product) => (
              <div key={product.id} className="flex items-center gap-6 p-4 bg-gray-50 border border-gray-100 rounded-2xl group hover:border-honda-red transition-all">
                <div className="w-24 h-16 rounded-xl overflow-hidden border bg-white shrink-0">
                  <img src={product.image} className="w-full h-full object-cover" />
                </div>
                <div className="flex-grow">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[8px] font-black uppercase text-honda-red bg-red-100 px-2 py-0.5 rounded-full">{product.category}</span>
                  </div>
                  <h4 className="text-sm font-black uppercase italic text-gray-900">{product.name}</h4>
                  <p className="text-[10px] text-gray-500 font-bold">{product.price}</p>
                </div>
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => handleEdit(product)}
                    className="p-3 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all"
                    title="Edit Unit"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>
                  <button 
                    onClick={() => handleDelete(product.id)}
                    className="p-3 text-gray-300 hover:text-honda-red hover:bg-red-50 rounded-xl transition-all"
                    title="Hapus Unit"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="p-8 bg-gray-50 flex justify-center border-t">
          <button 
            onClick={onClose}
            className="px-12 py-4 bg-gray-900 text-white rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-black transition-all"
          >
            Selesai & Simpan Katalog
          </button>
        </div>
      </div>

      <UploadModal 
        isOpen={isUploadModalOpen} 
        onClose={() => {
          setIsUploadModalOpen(false);
          setEditingProduct(undefined);
        }} 
        onAdd={handleSaveProduct}
        productToEdit={editingProduct}
      />
    </div>
  );
};

export default AdminProductModal;
