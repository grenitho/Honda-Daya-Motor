
import React from 'react';
import { Product } from '../types';

interface ProductCardProps {
  product: Product;
  onClick: (id: string) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onClick }) => {
  return (
    <div 
      onClick={() => onClick(product.id)}
      className="group bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-xl transition-all cursor-pointer border border-transparent hover:border-honda-red"
    >
      <div className="relative h-64 overflow-hidden bg-gray-100">
        <img 
          src={product.image} 
          alt={product.name} 
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute top-4 left-4 bg-honda-red text-white text-[10px] font-bold px-2 py-1 uppercase tracking-tighter">
          {product.category}
        </div>
      </div>
      <div className="p-6">
        <h3 className="text-lg font-bold text-gray-900 group-hover:text-honda-red transition-colors mb-2">
          {product.name}
        </h3>
        <p className="text-gray-500 text-sm line-clamp-2 mb-4">
          {product.description}
        </p>
        <div className="flex justify-between items-center border-t border-gray-100 pt-4">
          <span className="text-honda-red font-black text-lg">{product.price}</span>
          <span className="text-xs font-bold uppercase text-gray-400 group-hover:text-gray-900 transition-colors">
            View Details →
          </span>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
