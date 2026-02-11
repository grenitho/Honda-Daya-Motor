
import React, { useState } from 'react';
import Hero from '../components/Hero';
import ProductCard from '../components/ProductCard';
import SalesProfile from '../components/SalesProfile';
import PromoSection from '../components/PromoSection';
import AdminPromoModal from '../components/AdminPromoModal';
import AdminProductModal from '../components/AdminProductModal';
import { CATEGORIES } from '../constants';
import { Product, SalesPerson, Promo } from '../types';

interface HomeProps {
  products: Product[];
  promos: Promo[];
  salesInfo: SalesPerson;
  onUpdateProducts: (products: Product[]) => void;
  onUpdatePromos: (promos: Promo[]) => void;
  onSelectProduct: (product: Product) => void;
}

const Home: React.FC<HomeProps> = ({ products, promos, salesInfo, onUpdateProducts, onUpdatePromos, onSelectProduct }) => {
  const [activeCategory, setActiveCategory] = useState('All');
  const [isPromoModalOpen, setIsPromoModalOpen] = useState(false);
  const [isCatalogModalOpen, setIsCatalogModalOpen] = useState(false);

  const filteredProducts = activeCategory === 'All' 
    ? products 
    : products.filter(p => p.category === activeCategory);

  return (
    <div className="min-h-screen">
      <Hero salesInfo={salesInfo} />
      
      <PromoSection salesInfo={salesInfo} promos={promos} />
      
      <SalesProfile salesInfo={salesInfo} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* CORPORATE ADMIN ACTION BAR */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6 p-6 bg-gray-50 rounded-3xl border border-gray-100">
          <div>
            <h2 className="text-3xl font-black italic tracking-tighter uppercase mb-2">Pilihan <span className="text-honda-red">Unit</span></h2>
            <p className="text-gray-500 font-light italic text-sm">Katalog resmi dealer Honda terbaru.</p>
          </div>
          
          <div className="flex flex-wrap gap-3">
            <button 
              onClick={() => setIsPromoModalOpen(true)}
              className="bg-honda-red text-white px-6 py-3 rounded-xl font-bold uppercase text-[10px] tracking-widest hover:bg-red-700 transition-all shadow-lg shadow-red-100"
            >
              Admin: Kelola Promo
            </button>
            <button 
              onClick={() => setIsCatalogModalOpen(true)}
              className="bg-gray-900 text-white px-6 py-3 rounded-xl font-bold uppercase text-[10px] tracking-widest hover:bg-black transition-all"
            >
              Admin: Kelola Katalog
            </button>
          </div>
        </div>

        {/* Categories */}
        <div className="flex flex-wrap gap-2 mb-12">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-6 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all ${
                activeCategory === cat 
                  ? 'bg-honda-red text-white shadow-lg shadow-red-200' 
                  : 'bg-white text-gray-400 border border-gray-100 hover:border-gray-300'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProducts.map(product => (
            <ProductCard 
              key={product.id} 
              product={product} 
              onClick={() => onSelectProduct(product)}
            />
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <div className="text-center py-20 bg-gray-50 rounded-3xl border border-dashed border-gray-200">
            <p className="text-gray-400 font-light italic">Maaf, unit di kategori ini sedang kosong.</p>
          </div>
        )}
      </main>

      {/* CORPORATE ADMIN MODALS */}
      <AdminPromoModal 
        isOpen={isPromoModalOpen}
        onClose={() => setIsPromoModalOpen(false)}
        promos={promos}
        onSave={onUpdatePromos}
      />

      <AdminProductModal 
        isOpen={isCatalogModalOpen}
        onClose={() => setIsCatalogModalOpen(false)}
        products={products}
        onSave={onUpdateProducts}
      />
    </div>
  );
};

export default Home;
