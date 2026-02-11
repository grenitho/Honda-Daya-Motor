
import { Product, SalesPerson, Promo } from './types.ts';

export const SALES_INFO: SalesPerson = {
  name: 'Budi Hartono', 
  role: 'Senior Sales Consultant', 
  photo: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=400&h=400&auto=format&fit=crop', 
  whatsapp: '628123456789', 
  phone: '+62 812 3456 789', 
  email: 'budi.honda@example.com',
  bio: 'Saya siap membantu Anda mendapatkan unit Honda impian dengan proses yang transparan, DP rendah, dan cicilan yang bisa dinegosiasikan. Spesialis Big Bike & Matic Premium.',
  experience: '8+ Tahun',
  facebook: 'https://facebook.com',
  instagram: 'https://instagram.com',
  personalizedPromo: 'Dapatkan tambahan Jaket Eksklusif khusus pemesanan lewat link ini!'
};

export const PROMOS: Promo[] = [
  {
    id: 'p1',
    title: 'Bunga 0% Tenor 1 Tahun',
    subtitle: 'Khusus untuk pembelian PCX 160 & ADV 160 di bulan ini.',
    image: 'https://images.unsplash.com/photo-1615172282427-9a57ef2d142e?q=80&w=800&auto=format&fit=crop',
    tag: 'Hot Deal',
    whatsappSuffix: 'saya tertarik dengan Promo Bunga 0%.'
  },
  {
    id: 'p2',
    title: 'Voucher Modifikasi Rp 2 Juta',
    subtitle: 'Setiap pembelian Honda CRF250L, langsung bawa pulang aksesoris.',
    image: 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?q=80&w=800&auto=format&fit=crop',
    tag: 'Aksesoris Gratis',
    whatsappSuffix: 'saya ingin klaim Voucher Modifikasi CRF.'
  }
];

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'Honda CBR1000RR-R Fireblade SP',
    image: 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?q=80&w=800&auto=format&fit=crop',
    price: 'Rp 1.077.000.000',
    category: 'Big Bike',
    description: 'Ekspresi tertinggi dari performa balap. Dibangun untuk lintasan, lahir untuk jalan raya.',
    specs: {
      engine: '999cc Liquid-cooled 4-stroke 16-valve DOHC Inline-4',
      power: '160 kW / 14,500 rpm',
      torque: '113 Nm / 12,500 rpm',
      transmission: '6-speed Manual',
      fuelCapacity: '16.1 Liters'
    },
    features: ['Aerodynamic Winglets', 'Ohlins Electronic Control', 'Brembo Stylema Calipers', 'Quick Shifter'],
    colors: ['Grand Prix Red', 'Matte Pearl Morion Black']
  },
  {
    id: '2',
    name: 'Honda PCX 160',
    image: 'https://images.unsplash.com/photo-1620054700010-8549646c0716?q=80&w=800&auto=format&fit=crop',
    price: 'Rp 32.670.000',
    category: 'Matic',
    description: 'Kenyamanan tertinggi bertemu dengan gaya premium. Raja dari segala skutik.',
    specs: {
      engine: '156.9cc Liquid-cooled 4-stroke 4-valve eSP+',
      power: '11.8 kW / 8,500 rpm',
      torque: '14.7 Nm / 6,500 rpm',
      transmission: 'Automatic, V-Matic',
      fuelCapacity: '8.1 Liters'
    },
    features: ['Honda Selectable Torque Control (HSTC)', 'Full LED Lighting', 'Smart Key System', 'USB Charger'],
    colors: ['Wonderful White', 'Majestic Matte Blue', 'Glorious Matte Black']
  },
  {
    id: '3',
    name: 'Honda CRF250L',
    image: 'https://images.unsplash.com/photo-1591637333184-19aa84b3e01f?q=80&w=800&auto=format&fit=crop',
    price: 'Rp 79.900.000',
    category: 'Sport',
    description: 'Pergi ke mana saja. Taklukkan jalur off-road dan navigasi jalan kota dengan mudah.',
    specs: {
      engine: '249cc Liquid-cooled Single Cylinder DOHC',
      power: '18.9 kW / 8,500 rpm',
      torque: '23.1 Nm / 6,500 rpm',
      transmission: '6-speed Manual',
      fuelCapacity: '7.8 Liters'
    },
    features: ['Long-travel Suspension', 'Lightweight Frame', 'Digital Instrument Cluster', 'Assist/Slipper Clutch'],
    colors: ['Extreme Red']
  }
];

export const CATEGORIES = ['All', 'Matic', 'Sport', 'Cub', 'EV', 'Big Bike'];
