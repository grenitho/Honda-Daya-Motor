
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
    // Menghindari re-inisialisasi jika sudah ada
    const app = initializeApp(config);
    db = getFirestore(app);
    return db;
  } catch (error) {
    console.error("Firebase Init Error:", error);
    return null;
  }
};

export const getDealerDataOnce = async () => {
  if (!db) return null;
  try {
    const dealerDoc = doc(db, 'configs', 'main_dealer');
    const snap = await getDoc(dealerDoc);
    return snap.exists() ? snap.data() : null;
  } catch (e) {
    console.error("Error fetching cloud data:", e);
    return null;
  }
};

export const subscribeToDealerData = (callback: (data: any) => void) => {
  if (!db) return null;
  const dealerDoc = doc(db, 'configs', 'main_dealer');
  return onSnapshot(dealerDoc, (docSnap) => {
    if (docSnap.exists()) {
      callback(docSnap.data());
    }
  });
};

export const saveDealerDataToCloud = async (data: any) => {
  if (!db) return false;
  try {
    const dealerDoc = doc(db, 'configs', 'main_dealer');
    // Gunakan merge: true agar tidak menimpa field lain yang mungkin ada (seperti updatedAt)
    await setDoc(dealerDoc, { ...data, updatedAt: new Date().toISOString() }, { merge: true });
    return true;
  } catch (error) {
    console.error("Cloud Save Error:", error);
    return false;
  }
};
