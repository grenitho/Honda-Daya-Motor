
export interface ProductSpecs {
  engine: string;
  power: string;
  torque: string;
  transmission: string;
  fuelCapacity: string;
}

export type MotorcycleCategory = 'Matic' | 'Sport' | 'Cub' | 'EV';

export interface Product {
  id: string;
  name: string;
  image: string;
  price: string;
  category: MotorcycleCategory;
  description: string;
  specs: ProductSpecs;
  features: string[];
  colors: string[];
}

export interface GeminiBikeResponse {
  name: string;
  price: string;
  category: MotorcycleCategory;
  description: string;
  specs: ProductSpecs;
  features: string[];
  colors: string[];
}

export interface Promo {
  id: string;
  title: string;
  subtitle: string;
  image: string;
  tag: string;
  whatsappSuffix: string;
}

export interface SalesPerson {
  name: string;
  role: string;
  photo: string;
  whatsapp: string;
  phone: string;
  email: string;
  bio: string;
  heroBadge: string;    // Teks kecil di atas headline (e.g. Authorized Honda Consultant)
  heroHeadline: string; // Teks besar headline (e.g. DREAM IT. RIDE IT.)
  heroIntro: string;    // Teks perkenalan paragraf
  experience: string;
  facebook?: string;
  instagram?: string;
  tiktok?: string;
  personalizedPromo?: string;
  // Fix: Added heroBackground to SalesPerson interface to allow passing it within the salesInfo object in App.tsx
  heroBackground?: string;
}
