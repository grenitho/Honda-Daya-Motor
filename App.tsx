
import React, { useState, useEffect, useCallback, useRef } from 'react';
import Navbar from './components/Navbar.tsx';
import Footer from './components/Footer.tsx';
import MapSection from './components/MapSection.tsx';
import Home from './pages/Home.tsx';
import About from './pages/About.tsx';
import Contact from './pages/Contact.tsx';
import ProductDetail from './pages/ProductDetail.tsx';
import FloatingContact from './components/FloatingContact.tsx';
import AdminSettingsModal from './components/AdminSettingsModal.tsx';
import SalesProfileModal from './components/SalesProfileModal.tsx';
import AdminPromoModal from './components/AdminPromoModal.tsx';
import AdminProductModal from './components/AdminProductModal.tsx';
import { Product, SalesPerson, Promo } from './types.ts';
import { SALES_INFO as DEFAULT_SALES, PROMOS as DEFAULT_PROMOS, INITIAL_PRODUCTS, DEFAULT_LOGO_URL, DEFAULT_HERO_BG_URL, DEFAULT_STORY } from './constants.ts';
import { initFirebase, subscribeToDealerData, saveDealerDataToCloud, getDealerDataOnce } from './services/firebaseService.ts';

type ViewState = 'home' | 'about' | 'contact';

// Decoder Base64 Universal yang lebih aman untuk mobile
const robustAtob = (str: string) => {
  try {
    return decodeURIComponent(atob(str).split('').map((c) => {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
  } catch (e) {
    try {
      return decodeURIComponent(escape(atob(str)));
    } catch (e2) {
      console.error("Critical Decoding Error:", e2);
      return null;
    }
  }
};

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<ViewState>('home');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [promos, setPromos] = useState<Promo[]>([]);
  const [salesInfo, setSalesInfo] = useState<SalesPerson>(DEFAULT_SALES);
  
  const [logo, setLogo] = useState<string | null>(DEFAULT_LOGO_URL);
  const [heroBackground, setHeroBackground] = useState<string>(DEFAULT_HERO_BG_URL);
  const [dealerName, setDealerName] = useState<string>('HONDA DAYA MOTOR');
  const [dealerAddress, setDealerAddress] = useState<string>('');
  
  const [storyTitle, setStoryTitle] = useState<string>(DEFAULT_STORY.title);
  const [storyCity, setStoryCity] = useState<string>(DEFAULT_STORY.city);
  const [storyText1, setStoryText1] = useState<string>(DEFAULT_STORY.text1);
  const [storyText2, setStoryText2] = useState<string>(DEFAULT_STORY.text2);
  const [visi, setVisi] = useState<string>(DEFAULT_STORY.visi);
  const [misi, setMisi] = useState<string>(DEFAULT_STORY.misi);
  const [salesAboutMessage, setSalesAboutMessage] = useState<string>("");

  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isSalesOpen, setIsSalesOpen] = useState(false);
  const [isPromoOpen, setIsPromoOpen] = useState(false);
  const [isCatalogOpen, setIsCatalogOpen] = useState(false);

  const [isInitialized, setIsInitialized] = useState(false);
  const [isStaff, setIsStaff] = useState(false);
  const [loadingMsg, setLoadingMsg] = useState('Menginisialisasi...');
  
  const isPersonalizedRef = useRef(false);
  const urlSalesDataRef = useRef<any>(null);
  const isEditingRef = useRef(false); 
  const [cloudStatus, setCloudStatus] = useState<'connected' | 'offline' | 'syncing' | 'error'>('offline');
  
  const firebaseUnsubscribe = useRef<any>(null);

  // Fungsi sakti untuk menggabungkan data Default + Cloud + Link Spesifik
  const applyData = useCallback((data: any, saveLocally = true) => {
    if (!data || isEditingRef.current) return;
    
    // 1. Update Katalog & Promo
    if (data.products && Array.isArray(data.products) && data.products.length > 0) setProducts(data.products);
    if (data.promos && Array.isArray(data.promos) && data.promos.length > 0) setPromos(data.promos);
    
    // 2. Update Sales dengan Logika Merging yang Benar
    if (data.salesInfo) {
      setSalesInfo((prev) => {
        const merged = { 
          ...prev, 
          ...data.salesInfo, // Ambil foto, bio, dll dari cloud
        };
        // Jika ini link personal, pastikan Nama & WA dari link yang menang
        if (isPersonalizedRef.current && urlSalesDataRef.current) {
          return { ...merged, ...urlSalesDataRef.current };
        }
        return merged;
      });
    }

    // 3. Update Branding & Story
    if (data.logo !== undefined) setLogo(data.logo);
    if (data.heroBackground) setHeroBackground(data.heroBackground);
    if (data.dealerName) setDealerName(data.dealerName);
    if (data.dealerAddress) setDealerAddress(data.dealerAddress);
    if (data.storyTitle) setStoryTitle(data.storyTitle);
    if (data.storyCity) setStoryCity(data.storyCity);
    if (data.storyText1) setStoryText1(data.storyText1);
    if (data.storyText2) setStoryText2(data.storyText2);
    if (data.visi) setVisi(data.visi);
    if (data.misi) setMisi(data.misi);
    if (data.salesAboutMessage) setSalesAboutMessage(data.salesAboutMessage);

    if (saveLocally) {
      localStorage.setItem('honda_catalog', JSON.stringify(data.products || products));
      localStorage.setItem('honda_promos', JSON.stringify(data.promos || promos));
      if (!isPersonalizedRef.current && data.salesInfo) {
        localStorage.setItem('honda_sales_info', JSON.stringify(data.salesInfo));
      }
      if (data.logo) localStorage.setItem('honda_dealer_logo', data.logo);
      if (data.heroBackground) localStorage.setItem('honda_hero_bg', data.heroBackground);
      if (data.dealerName) localStorage.setItem('honda_dealer_name', data.dealerName);
      if (data.dealerAddress) localStorage.setItem('honda_dealer_address', data.dealerAddress);
      localStorage.setItem('honda_setup_completed', 'true');
    }
  }, [products, promos]);

  useEffect(() => {
    const initialize = async () => {
      setLoadingMsg('Membaca Konfigurasi...');
      const urlParams = new URLSearchParams(window.location.search);
      const staffMode = urlParams.get('staff') === 'true';
      setIsStaff(staffMode);

      let fbConfigToUse = localStorage.getItem('honda_firebase_config');

      // STEP 1: Parse Link Personal (?p=...)
      const pParam = urlParams.get('p');
      if (pParam) {
        const decoded = robustAtob(pParam);
        if (decoded) {
          try {
            const parsed = JSON.parse(decoded);
            if (parsed.salesInfo) {
              urlSalesDataRef.current = parsed.salesInfo;
              isPersonalizedRef.current = true;
              // Set salesInfo sementara (tanpa foto) agar Nama/WA muncul cepat
              setSalesInfo(prev => ({ ...prev, ...parsed.salesInfo }));
            }
            if (parsed.fbConfig) {
              fbConfigToUse = typeof parsed.fbConfig === 'string' ? parsed.fbConfig : JSON.stringify(parsed.fbConfig);
              localStorage.setItem('honda_firebase_config', fbConfigToUse);
            }
          } catch(e) { console.error("URL Parameter Parse Error"); }
        }
      }

      // STEP 2: Parse Setup Link (?fb=...)
      const fbParam = urlParams.get('fb');
      if (fbParam) {
        const decodedFb = robustAtob(fbParam);
        if (decodedFb) {
          fbConfigToUse = decodedFb;
          localStorage.setItem('honda_firebase_config', decodedFb);
        }
      }

      // STEP 3: Load Data Lokal (Sambil Nunggu Cloud)
      const isSetupCompleted = localStorage.getItem('honda_setup_completed') === 'true';
      if (isSetupCompleted) {
        setProducts(JSON.parse(localStorage.getItem('honda_catalog') || '[]'));
        setPromos(JSON.parse(localStorage.getItem('honda_promos') || '[]'));
        setLogo(localStorage.getItem('honda_dealer_logo'));
        setDealerName(localStorage.getItem('honda_dealer_name') || 'HONDA DEALER');
        if (!isPersonalizedRef.current) {
          setSalesInfo(JSON.parse(localStorage.getItem('honda_sales_info') || JSON.stringify(DEFAULT_SALES)));
        }
      }

      // STEP 4: SINKRONISASI CLOUD (WAJIB SEBELUM RENDER)
      if (fbConfigToUse) {
        setLoadingMsg('Menyambungkan Database...');
        try {
          const config = JSON.parse(fbConfigToUse);
          initFirebase(config);
          setCloudStatus('connected');
          
          setLoadingMsg('Sinkronisasi Data Dealer...');
          const cloudData = await getDealerDataOnce();
          if (cloudData) {
            applyData(cloudData, true);
          }
          
          // Tetap subscribe untuk update real-time
          firebaseUnsubscribe.current = subscribeToDealerData((updatedData) => {
            applyData(updatedData, true);
          });
        } catch (e) { 
          setCloudStatus('error');
          console.error("Firebase Sync Error:", e);
        }
      } else if (!isSetupCompleted) {
        // Jika tidak ada cloud dan belum setup, gunakan data awal
        setProducts(INITIAL_PRODUCTS);
        setPromos(DEFAULT_PROMOS);
      }
      
      setLoadingMsg('Siap!');
      setTimeout(() => setIsInitialized(true), 800);
    };

    initialize();
    return () => firebaseUnsubscribe.current?.();
  }, [applyData]);

  const handleSaveAdminSettings = async (newSales: SalesPerson, newLogo: string | null, newName: string, newAddress: string, newHeroBg: string, storyData?: any) => {
    isEditingRef.current = true;
    const combinedData = {
      salesInfo: newSales,
      logo: newLogo,
      dealerName: newName,
      dealerAddress: newAddress,
      heroBackground: newHeroBg,
      products: storyData?.products || products,
      promos: storyData?.promos || promos,
      ...storyData
    };

    setSalesInfo(newSales);
    setLogo(newLogo);
    setDealerName(newName);
    setDealerAddress(newAddress);
    setHeroBackground(newHeroBg);
    if (storyData?.products) setProducts(storyData.products);
    if (storyData?.promos) setPromos(storyData.promos);

    applyData(combinedData, true);
    if (cloudStatus === 'connected') {
      await saveDealerDataToCloud(combinedData);
    }
    isEditingRef.current = false;
  };

  if (!isInitialized) {
    return (
      <div className="h-screen w-full flex flex-col items-center justify-center bg-white">
        <div className="relative">
          <div className="text-7xl font-black italic text-honda-red animate-pulse">H</div>
          <div className="absolute -bottom-2 -right-2 w-4 h-4 bg-honda-red rounded-full animate-ping"></div>
        </div>
        <div className="mt-8 flex flex-col items-center gap-2">
           <div className="w-48 h-1 bg-gray-100 rounded-full overflow-hidden">
             <div className="w-full h-full bg-honda-red origin-left animate-[loading_2s_infinite_ease-in-out]"></div>
           </div>
           <p className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-300 animate-pulse">{loadingMsg}</p>
        </div>
        <style dangerouslySetInnerHTML={{ __html: `
          @keyframes loading {
            0% { transform: scaleX(0); }
            50% { transform: scaleX(1); }
            100% { transform: scaleX(0); transform-origin: right; }
          }
        `}} />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar onNavigate={(v) => { setCurrentView(v); setSelectedProduct(null); }} currentView={selectedProduct ? 'home' : currentView} logo={logo} dealerName={dealerName} isStaff={isStaff} onOpenSettings={() => setIsAdminOpen(true)} onOpenSalesProfile={() => setIsSalesOpen(true)} onOpenPromos={() => setIsPromoOpen(true)} onOpenCatalog={() => setIsCatalogOpen(true)} />
      <main className="flex-grow">
        {selectedProduct ? (
          <ProductDetail product={selectedProduct} salesInfo={salesInfo} onBack={() => setSelectedProduct(null)} />
        ) : currentView === 'about' ? (
          <About salesInfo={salesInfo} storyTitle={storyTitle} storyCity={storyCity} storyText1={storyText1} storyText2={storyText2} visi={visi} misi={misi} salesAboutMessage={salesAboutMessage} />
        ) : currentView === 'contact' ? (
          <Contact salesInfo={salesInfo} />
        ) : (
          <Home products={products} promos={promos} salesInfo={{...salesInfo, heroBackground}} onSelectProduct={setSelectedProduct} />
        )}
      </main>
      <MapSection dealerName={dealerName} address={dealerAddress} />
      <Footer dealerName={dealerName} salesInfo={salesInfo} logo={logo} />
      <FloatingContact salesInfo={salesInfo} />
      
      {isStaff && (
        <div className={`fixed bottom-6 left-6 z-[100] px-4 py-2 rounded-full text-[8px] font-black uppercase tracking-widest border shadow-xl flex items-center gap-2 ${
          cloudStatus === 'connected' ? 'bg-green-500 text-white border-green-400' : 'bg-gray-800 text-gray-400 border-gray-700'
        }`}>
          <div className={`w-1.5 h-1.5 rounded-full ${cloudStatus === 'connected' ? 'bg-white animate-pulse' : 'bg-current'}`}></div>
          Cloud {cloudStatus}
        </div>
      )}

      <AdminSettingsModal isOpen={isAdminOpen} onClose={() => setIsAdminOpen(false)} salesInfo={salesInfo} products={products} promos={promos} logo={logo} heroBackground={heroBackground} dealerName={dealerName} dealerAddress={dealerAddress} storyTitle={storyTitle} storyCity={storyCity} storyText1={storyText1} storyText2={storyText2} visi={visi} misi={misi} salesAboutMessage={salesAboutMessage} onSave={handleSaveAdminSettings} onReset={() => { if(confirm("Hapus semua data?")) { localStorage.clear(); window.location.reload(); } }} onSyncRemote={async () => {}} remoteUrl={null} cloudStatus={cloudStatus} onPushToCloud={async () => { await saveDealerDataToCloud({ salesInfo, logo, dealerName, dealerAddress, heroBackground, products, promos, storyTitle, storyCity, storyText1, storyText2, visi, misi, salesAboutMessage }); }} onPullFromCloud={async () => { const d = await getDealerDataOnce(); if(d) applyData(d, true); }} />
      <SalesProfileModal isOpen={isSalesOpen} onClose={() => setIsSalesOpen(false)} salesInfo={salesInfo} remoteUrl={null} onSave={(s) => handleSaveAdminSettings(s, logo, dealerName, dealerAddress, heroBackground)} />
      <AdminPromoModal isOpen={isPromoOpen} onClose={() => setIsPromoOpen(false)} promos={promos} onSave={(p) => handleSaveAdminSettings(salesInfo, logo, dealerName, dealerAddress, heroBackground, {promos: p})} />
      <AdminProductModal isOpen={isCatalogOpen} onClose={() => setIsCatalogOpen(false)} products={products} onSave={(p) => handleSaveAdminSettings(salesInfo, logo, dealerName, dealerAddress, heroBackground, {products: p})} />
    </div>
  );
};

export default App;
