
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

// Fungsi Migrasi: Mencari data di alamat lama jika alamat baru kosong
export const getGlobalDealerData = async () => {
  if (!db) return null;
  try {
    const newDoc = doc(db, 'configs', 'dealer_info');
    const newSnap = await getDoc(newDoc);
    
    if (newSnap.exists()) return newSnap.data();

    // JIKA KOSONG, CEK ALAMAT LAMA (Support untuk pemulihan data)
    const oldDoc = doc(db, 'dealer_data', 'main_config');
    const oldSnap = await getDoc(oldDoc);
    if (oldSnap.exists()) {
      const data = oldSnap.data();
      // Migrasi otomatis ke alamat baru
      await setDoc(newDoc, { ...data, migrated: true });
      return data;
    }
    return null;
  } catch (e) {
    return null;
  }
};

export const getSalesProfile = async (whatsappId: string) => {
  if (!db || !whatsappId) return null;
  try {
    const salesDoc = doc(db, 'sales_profiles', whatsappId);
    const snap = await getDoc(salesDoc);
    
    if (snap.exists()) return snap.data();

    // Jika ini master_profile dan kosong, coba cek dari alamat lama
    if (whatsappId === 'master_profile') {
       const oldDoc = doc(db, 'dealer_data', 'main_config');
       const oldSnap = await getDoc(oldDoc);
       if (oldSnap.exists() && oldSnap.data().salesInfo) {
         return oldSnap.data().salesInfo;
       }
    }
    return null;
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
