
import React from 'react';

interface MapSectionProps {
  dealerName: string;
  address: string;
}

const MapSection: React.FC<MapSectionProps> = ({ dealerName, address }) => {
  // Menggabungkan Nama Dealer dan Alamat untuk akurasi titik marker bisnis resmi di Google Maps
  const searchQuery = `${dealerName} ${address}`;
  const encodedQuery = encodeURIComponent(searchQuery);
  
  // Menggunakan parameter iwloc=A untuk menampilkan info window bisnis secara otomatis
  const mapUrl = `https://maps.google.com/maps?q=${encodedQuery}&t=&z=16&ie=UTF8&iwloc=A&output=embed`;

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-10 text-center md:text-left">
          <div className="flex items-center justify-center md:justify-start gap-3 mb-3">
            <div className="w-8 h-8 bg-honda-red rounded-full flex items-center justify-center text-white">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <h2 className="text-2xl font-black italic tracking-tighter uppercase">
              Lokasi <span className="text-honda-red">Showroom</span> Resmi
            </h2>
          </div>
          <p className="text-gray-500 italic text-sm max-w-2xl">{address}</p>
        </div>

        <div className="relative h-[500px] w-full rounded-[2.5rem] overflow-hidden shadow-2xl border border-gray-100 group">
          <iframe
            title="Dealer Location"
            width="100%"
            height="100%"
            frameBorder="0"
            scrolling="no"
            marginHeight={0}
            marginWidth={0}
            src={mapUrl}
            className="contrast-[1.05] group-hover:contrast-100 transition-all duration-700"
          ></iframe>
          
          <div className="absolute bottom-6 left-6 right-6 md:right-auto md:w-80 bg-white/95 backdrop-blur-md p-6 rounded-2xl shadow-xl border border-white/50 animate-in fade-in slide-in-from-bottom-4 duration-1000">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-ping"></div>
              <span className="text-[10px] font-black text-green-600 uppercase tracking-widest">Showroom Buka Sekarang</span>
            </div>
            <h4 className="font-black text-blue-950 uppercase italic text-sm mb-1 leading-tight">{dealerName}</h4>
            <p className="text-[10px] text-gray-500 font-medium leading-relaxed uppercase tracking-tight mb-4">
              Jl. Batin Tikal No.423, Sungailiat. Klik navigasi di bawah untuk rute tercepat.
            </p>
            <div className="flex gap-2">
              <a 
                href={`https://www.google.com/maps/search/?api=1&query=${encodedQuery}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 bg-gray-900 text-white text-[10px] font-bold py-3 rounded-xl text-center uppercase tracking-widest hover:bg-honda-red transition-all shadow-lg active:scale-95"
              >
                Petunjuk Arah
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MapSection;
