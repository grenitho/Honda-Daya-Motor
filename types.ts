
export interface ProductSpecs {
  engine: string;
  power: string;
  torque: string;
  transmission: string;
  fuelCapacity: string;
}

export type MotorcycleCategory = 'Matic' | 'Sport' | 'Cub' | 'EV' | 'Big Bike';

export interface Product {
  id: string;
  name: string;
  image: string;
  price: string;
  category: MotorcycleCategory;
  description: string;
  specs: ProductSpecs;
  features: string[];
  colors: string[]; // New field for color availability
}

export interface GeminiBikeResponse {
  name: string;
  price: string;
  category: MotorcycleCategory;
  description: string;
  specs: ProductSpecs;
  features: string[];
  colors: string[]; // AI will also suggest colors
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
  experience: string;
  facebook?: string;
  instagram?: string;
  personalizedPromo?: string;
}
