
import { initializeApp } from 'firebase/app';
import { getFirestore, doc, onSnapshot, setDoc, getDoc } from 'firebase/firestore';

export interface FirebaseConfig {
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
}

let db: any = null;

export const initFirebase = (config: FirebaseConfig) => {
  try {
    const app = initializeApp(config);
    db = getFirestore(app);
    return db;
  } catch (error) {
    console.error("Firebase Init Error:", error);
    return null;
  }
};

// Mengambil Data Global Dealer (Katalog, Promo, Logo)
export const getGlobalDealerData = async () => {
  if (!db) return null;
  try {
    const globalDoc = doc(db, 'configs', 'dealer_info');
    const snap = await getDoc(globalDoc);
    return snap.exists() ? snap.data() : null;
  } catch (e) {
    return null;
  }
};

// Mengambil Profil Sales Spesifik berdasarkan WhatsApp ID
export const getSalesProfile = async (whatsappId: string) => {
  if (!db || !whatsappId) return null;
  try {
    const salesDoc = doc(db, 'sales_profiles', whatsappId);
    const snap = await getDoc(salesDoc);
    return snap.exists() ? snap.data() : null;
  } catch (e) {
    return null;
  }
};

export const subscribeToGlobalData = (callback: (data: any) => void) => {
  if (!db) return null;
  const globalDoc = doc(db, 'configs', 'dealer_info');
  return onSnapshot(globalDoc, (docSnap) => {
    if (docSnap.exists()) callback(docSnap.data());
  });
};

export const subscribeToSalesProfile = (whatsappId: string, callback: (data: any) => void) => {
  if (!db || !whatsappId) return null;
  const salesDoc = doc(db, 'sales_profiles', whatsappId);
  return onSnapshot(salesDoc, (docSnap) => {
    if (docSnap.exists()) callback(docSnap.data());
  });
};

// Simpan Data Global (Katalog & Dealer Info)
export const saveGlobalData = async (data: any) => {
  if (!db) return false;
  try {
    const globalDoc = doc(db, 'configs', 'dealer_info');
    await setDoc(globalDoc, { ...data, updatedAt: new Date().toISOString() }, { merge: true });
    return true;
  } catch (error) {
    return false;
  }
};

// Simpan Profil Sales secara Mandiri (ID = WhatsApp)
export const saveSalesProfile = async (whatsappId: string, salesData: any) => {
  if (!db || !whatsappId) return false;
  try {
    const salesDoc = doc(db, 'sales_profiles', whatsappId);
    await setDoc(salesDoc, { ...salesData, updatedAt: new Date().toISOString() }, { merge: true });
    return true;
  } catch (error) {
    return false;
  }
};
