
import React, { useState } from 'react';
import Hero from '../components/Hero';
import ProductCard from '../components/ProductCard';
import SalesProfile from '../components/SalesProfile';
import PromoSection from '../components/PromoSection';
import { CATEGORIES } from '../constants';
import { Product, SalesPerson, Promo } from '../types';

interface HomeProps {
  products: Product[];
  promos: Promo[];
  salesInfo: SalesPerson;
  onSelectProduct: (product: Product) => void;
}

const Home: React.FC<HomeProps> = ({ products, promos, salesInfo, onSelectProduct }) => {
  const [activeCategory, setActiveCategory] = useState('All');

  const filteredProducts = activeCategory === 'All' 
    ? products 
    : products.filter(p => p.category === activeCategory);

  return (
    <div className="min-h-screen">
      <Hero salesInfo={salesInfo} />
      
      <PromoSection salesInfo={salesInfo} promos={promos} />
      
      <SalesProfile salesInfo={salesInfo} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16" id="katalog">
        <div className="mb-12">
          <h2 className="text-4xl font-black italic tracking-tighter uppercase mb-2">Pilihan <span className="text-honda-red">Unit</span></h2>
          <p className="text-gray-500 font-light italic text-sm">Temukan motor Honda impian Anda dengan teknologi masa depan.</p>
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
    </div>
  );
};

export default Home;
