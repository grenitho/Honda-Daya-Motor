
import { Product, SalesPerson, Promo } from './types';

export const DEFAULT_LOGO_URL = 'https://i.ibb.co.com/PG2HkxGr/LOGO-DM-PURE.png'; 
export const DEFAULT_HERO_BG_URL = 'https://i.ibb.co.com/d4hY2f7y/Whats-App-Image-2026-02-11-at-20-07-39.jpg';

export const DEFAULT_STORY = {
  title: 'Dealer Terpercaya di',
  city: 'SUNGAILIAT',
  text1: 'Dealer Honda kami berdiri dengan komitmen untuk menjadi mitra berkendara terbaik bagi masyarakat Bangka Belitung. Kami tidak hanya sekadar menjual sepeda motor, tetapi kami memberikan solusi transportasi yang aman, nyaman, dan prestisius.',
  text2: 'Dengan layanan purna jual yang profesional dan ketersediaan suku cadang asli, kami memastikan setiap pelanggan merasakan "One Heart" bersama Honda di setiap perjalanan mereka.',
  visi: 'Menjadi Dealer Honda nomor satu dalam pelayanan dan kepercayaan pelanggan dengan mengutamakan kualitas serta kepuasan konsumen secara berkelanjutan.',
  misi: 'Memberikan solusi transportasi terbaik, menjamin ketersediaan suku cadang asli, dan menyediakan layanan servis profesional untuk mendukung mobilitas masyarakat.'
};

export const SALES_INFO: SalesPerson = {
  name: 'SYAMILA MUTHIA DHELVINA', 
  role: 'SALES DIGITAL', 
  photo: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=400&h=400&auto=format&fit=crop', 
  whatsapp: '6285758442561', 
  phone: '+62 85758442561', 
  email: 'syamilavina33@gmail.com',
  heroBadge: 'SALES DIGITAL HONDA',
  heroHeadline: 'SALAM SATU | HATI.....', 
  heroIntro: "Selamat datang di dealer resmi Honda Daya Motor Sungailiat. Saya siap membantu Anda memilih Motor Honda terbaik dengan penawaran spesial.",
  bio: 'Saya siap membantu Anda mendapatkan Motor Honda impian dengan proses yang transparan, DP rendah, dan cicilan yang bisa dinegosiasikan. Spesialis Matic & Sport Premium.',
  experience: '5+ Tahun',
  facebook: 'https://facebook.com',
  instagram: 'https://instagram.com',
  tiktok: 'https://tiktok.com',
  personalizedPromo: 'Dapatkan tambahan Kaos HONDA Eksklusif khusus pemesanan lewat link ini!'
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

export const CATEGORIES = ['All', 'Matic', 'Sport', 'Cub', 'EV'];
