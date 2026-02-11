
import React from 'react';
import { SalesPerson } from '../types';

interface FloatingContactProps {
  salesInfo: SalesPerson;
}

const FloatingContact: React.FC<FloatingContactProps> = ({ salesInfo }) => {
  const message = encodeURIComponent(`Halo ${salesInfo.name}, saya tertarik dengan unit Honda. Bisa dibantu?`);
  const waUrl = `https://wa.me/${salesInfo.whatsapp}?text=${message}`;

  const firstName = salesInfo.name.split(' ')[0];

  return (
    <div className="fixed bottom-6 right-6 z-[100] flex flex-col items-end gap-3">
      <div className="bg-white px-4 py-2 rounded-lg shadow-xl border border-gray-100 text-xs font-bold uppercase tracking-widest text-gray-900 hidden md:block">
        Tanya {firstName} Sekarang
      </div>
      <a 
        href={waUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="w-16 h-16 bg-[#25D366] rounded-full shadow-2xl flex items-center justify-center hover:scale-110 transition-transform active:scale-95 group"
      >
        <svg viewBox="0 0 24 24" className="w-8 h-8 fill-white" xmlns="http://www.w3.org/2000/svg">
          <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.038 3.284l-.569 2.1c-.149.546.455 1.033.947.817l2.122-.933c.636.247 1.446.433 2.228.433 3.181 0 5.767-2.586 5.768-5.766 0-3.18-2.586-5.766-5.766-5.766zm3.37 8.202c-.121.343-.703.623-1.023.66-.297.036-.685.057-1.116-.081-.274-.087-.615-.222-1.047-.413-1.832-.811-3.033-2.67-3.124-2.793-.093-.124-.753-.997-.753-1.901 0-.905.474-1.349.643-1.541.169-.193.369-.241.493-.241H9.7c.106 0 .248-.004.354.218.106.223.365.889.397.954.032.065.053.14.01.226-.042.086-.063.14-.127.215-.064.075-.134.167-.191.225-.064.065-.131.135-.056.262.075.127.334.55.717.892.492.439.907.575 1.034.638.127.063.201.053.277-.033.075-.086.323-.376.409-.505.086-.129.172-.108.29-.065.118.043.753.355.882.419s.215.107.247.161c.033.053.033.311-.088.654z"/>
        </svg>
      </a>
    </div>
  );
};

export default FloatingContact;
