
import React from 'react';
import { SalesPerson } from '../types';

interface FooterProps {
  dealerName: string;
  salesInfo: SalesPerson;
  logo: string | null;
}

const Footer: React.FC<FooterProps> = ({ dealerName, salesInfo, logo }) => {
  const nameParts = dealerName.split(' ');
  const firstName = nameParts[0];
  const restName = nameParts.slice(1).join(' ');

  return (
    <footer className="bg-gray-950 text-white py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-4 mb-6">
              {/* Cek jika ada logo gambar, tampilkan gambar. Jika tidak, tampilkan icon H default */}
              {logo ? (
                <img src={logo} alt="Logo Footer" className="h-12 w-auto object-contain brightness-0 invert" />
              ) : (
                <div className="w-8 h-8 bg-honda-red rounded-sm flex items-center justify-center">
                  <span className="text-white font-black text-lg italic">H</span>
                </div>
              )}
              
              <div className="flex flex-col">
                <span className="text-xl font-extrabold tracking-tighter uppercase leading-none">
                  {firstName} <span className="text-gray-600 font-light">{restName}</span>
                </span>
                <span className="text-[8px] font-bold text-gray-500 tracking-[0.3em] uppercase mt-1">Authorized Dealer</span>
              </div>
            </div>
            <p className="text-gray-400 max-w-sm mb-8 font-light leading-relaxed">
              Kami adalah dealer resmi {dealerName} yang berkomitmen memberikan pengalaman berkendara terbaik melalui produk berkualitas dan layanan profesional.
            </p>
            <div className="flex gap-4">
              {salesInfo.facebook && (
                <a 
                  href={salesInfo.facebook} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="w-10 h-10 border border-gray-800 rounded flex items-center justify-center hover:bg-honda-red hover:border-honda-red transition-all cursor-pointer font-bold text-xs"
                >
                  FB
                </a>
              )}
              {salesInfo.instagram && (
                <a 
                  href={salesInfo.instagram} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="w-10 h-10 border border-gray-800 rounded flex items-center justify-center hover:bg-honda-red hover:border-honda-red transition-all cursor-pointer font-bold text-xs"
                >
                  IG
                </a>
              )}
              {salesInfo.tiktok && (
                <a 
                  href={salesInfo.tiktok} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="w-10 h-10 border border-gray-800 rounded flex items-center justify-center hover:bg-honda-red hover:border-honda-red transition-all cursor-pointer font-bold text-xs"
                >
                  TK
                </a>
              )}
            </div>
          </div>

          <div>
            <h4 className="font-bold uppercase tracking-widest text-xs mb-6 text-honda-red">Eksplorasi</h4>
            <ul className="space-y-4 text-gray-400 text-sm">
              <li className="hover:text-white transition-colors cursor-pointer">Sepeda Motor</li>
              <li className="hover:text-white transition-colors cursor-pointer">Servis & Suku Cadang</li>
              <li className="hover:text-white transition-colors cursor-pointer">Promo</li>
              <li className="hover:text-white transition-colors cursor-pointer">Berita & Acara</li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold uppercase tracking-widest text-xs mb-6 text-honda-red">Kontak Kami</h4>
            <ul className="space-y-4 text-gray-400 text-sm">
              <li className="flex flex-col">
                <span className="text-xs font-bold text-gray-600 uppercase mb-1">Konsultan</span>
                {salesInfo.name}
              </li>
              <li className="flex flex-col">
                <span className="text-xs font-bold text-gray-600 uppercase mb-1">WhatsApp</span>
                {salesInfo.phone}
              </li>
              <li className="flex flex-col">
                <span className="text-xs font-bold text-gray-600 uppercase mb-1">Email Sales</span>
                {salesInfo.email}
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-900 mt-20 pt-8 flex flex-col md:flex-row justify-between items-center text-xs text-gray-600 gap-4">
          <p>© 2024 Authorized {dealerName}. All Rights Reserved.</p>
          <div className="flex gap-8">
            <span>Privacy Policy</span>
            <span>Terms of Service</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
