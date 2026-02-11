
import React from 'react';
import { Product, SalesPerson } from '../types';

interface ProductDetailProps {
  product: Product;
  salesInfo: SalesPerson;
  onBack: () => void;
}

const ProductDetail: React.FC<ProductDetailProps> = ({ product, salesInfo, onBack }) => {
  const waMessage = encodeURIComponent(`Halo ${salesInfo.name}, saya tertarik menanyakan harga & promo untuk Honda ${product.name}. Mohon info lanjutannya.`);
  const waUrl = `https://wa.me/${salesInfo.whatsapp}?text=${waMessage}`;

  return (
    <div className="min-h-screen bg-white pb-24">
      <div className="bg-gray-50 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <button 
            onClick={onBack}
            className="group flex items-center gap-2 text-gray-500 font-bold uppercase text-xs hover:text-honda-red transition-colors mb-8"
          >
            <span className="group-hover:-translate-x-1 transition-transform">←</span> Kembali ke Katalog
          </button>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="relative">
              <div className="absolute -top-4 -left-4 w-24 h-24 bg-honda-red opacity-10 rounded-full animate-pulse"></div>
              <img 
                src={product.image} 
                alt={product.name} 
                className="relative rounded-3xl shadow-2xl w-full object-cover aspect-video"
              />
            </div>
            
            <div>
              <span className="text-honda-red font-bold uppercase tracking-[0.2em] text-xs mb-4 block">{product.category}</span>
              <h1 className="text-4xl md:text-5xl font-black italic tracking-tighter leading-tight mb-4 uppercase">
                {product.name}
              </h1>
              <p className="text-gray-600 text-lg leading-relaxed mb-8">
                {product.description}
              </p>

              {/* COLORS SECTION */}
              {product.colors && product.colors.length > 0 && (
                <div className="mb-8">
                  <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-3">Pilihan Warna Tersedia:</span>
                  <div className="flex flex-wrap gap-2">
                    {product.colors.map((color, i) => (
                      <span key={i} className="px-3 py-1 bg-white border border-gray-200 rounded-full text-[10px] font-bold text-gray-700 uppercase italic">
                        {color}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex items-baseline gap-4 mb-8">
                <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Harga OTR Mulai</span>
                <span className="text-4xl font-black text-honda-red tracking-tighter">{product.price}</span>
              </div>
              <div className="flex flex-wrap gap-4">
                <a 
                  href={waUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-honda-red text-white px-8 py-4 font-bold uppercase tracking-widest hover:bg-red-700 transition-all shadow-xl shadow-red-100 inline-flex items-center gap-3"
                >
                  Tanya {salesInfo.name.split(' ')[0]} via WA
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
          <div className="lg:col-span-2">
            <h2 className="text-2xl font-black italic tracking-tighter uppercase mb-8 border-b-2 border-honda-red inline-block">
              Spesifikasi Teknik
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-12">
              {Object.entries(product.specs).map(([key, value]) => (
                <div key={key} className="flex flex-col border-b border-gray-50 pb-4">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">{key}</span>
                  <span className="text-gray-900 font-semibold">{value}</span>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-black italic tracking-tighter uppercase mb-8 border-b-2 border-honda-red inline-block">
              Fitur Unggulan
            </h2>
            <ul className="space-y-4">
              {product.features.map((feature, idx) => (
                <li key={idx} className="flex items-center gap-3">
                  <div className="w-1.5 h-1.5 bg-honda-red rounded-full"></div>
                  <span className="text-gray-700 font-medium">{feature}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
