
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

// Decoder Base64 yang sangat kompatibel (Universal)
const robustAtob = (str: string) => {
  try {
    return decodeURIComponent(atob(str).split('').map((c) => {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
  } catch (e) {
    try {
      // Fallback untuk browser tertentu
      return decodeURIComponent(escape(atob(str)));
    } catch (e2) {
      console.error("Decoding error:", e2);
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
  const [dealerName, setDealerName] = useState<string>('HONDA DAYA MOTOR SUNGAILIAT');
  const [dealerAddress, setDealerAddress] = useState<string>('Jl. Batin Tikal No.423, Karya Makmur, Kec. Pemali, Kabupaten Bangka, Kepulauan Bangka Belitung 33215');
  
  const [storyTitle, setStoryTitle] = useState<string>(DEFAULT_STORY.title);
  const [storyCity, setStoryCity] = useState<string>(DEFAULT_STORY.city);
  const [storyText1, setStoryText1] = useState<string>(DEFAULT_STORY.text1);
  const [storyText2, setStoryText2] = useState<string>(DEFAULT_STORY.text2);
  const [visi, setVisi] = useState<string>(DEFAULT_STORY.visi);
  const [misi, setMisi] = useState<string>(DEFAULT_STORY.misi);
  const [salesAboutMessage, setSalesAboutMessage] = useState<string>("Sebagai konsultan penjualan Anda, misi saya adalah memberikan kemudahan dalam setiap langkah kepemilikan motor Honda Anda...");

  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isSalesOpen, setIsSalesOpen] = useState(false);
  const [isPromoOpen, setIsPromoOpen] = useState(false);
  const [isCatalogOpen, setIsCatalogOpen] = useState(false);

  const [isInitialized, setIsInitialized] = useState(false);
  const [isStaff, setIsStaff] = useState(false);
  const [loadingMsg, setLoadingMsg] = useState('Menginisialisasi Sistem...');
  
  const isPersonalizedRef = useRef(false);
  const urlSalesDataRef = useRef<any>(null);
  const isEditingRef = useRef(false); 
  const [cloudStatus, setCloudStatus] = useState<'connected' | 'offline' | 'syncing' | 'error'>('offline');
  
  const firebaseUnsubscribe = useRef<any>(null);

  const applyData = useCallback((data: any, saveLocally = true) => {
    if (!data || isEditingRef.current) return;
    
    // Prioritaskan data cloud jika tersedia, jika tidak biarkan state saat ini
    if (data.products && Array.isArray(data.products) && data.products.length > 0) setProducts(data.products);
    if (data.promos && Array.isArray(data.promos) && data.promos.length > 0) setPromos(data.promos);
    
    if (data.salesInfo) {
      if (isPersonalizedRef.current && urlSalesDataRef.current) {
        setSalesInfo((prev) => ({ 
          ...prev, 
          ...data.salesInfo, // Foto & Bio lengkap dari Cloud
          ...urlSalesDataRef.current // Nama & WA unik dari Link
        }));
      } else {
        setSalesInfo((prev) => ({ ...prev, ...data.salesInfo }));
      }
    }

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
      if (!isPersonalizedRef.current && data.salesInfo) localStorage.setItem('honda_sales_info', JSON.stringify(data.salesInfo));
      if (data.logo) localStorage.setItem('honda_dealer_logo', data.logo);
      if (data.heroBackground) localStorage.setItem('honda_hero_bg', data.heroBackground);
      if (data.dealerName) localStorage.setItem('honda_dealer_name', data.dealerName);
      if (data.dealerAddress) localStorage.setItem('honda_dealer_address', data.dealerAddress);
      
      localStorage.setItem('honda_setup_completed', 'true');
    }
  }, [products, promos]);

  useEffect(() => {
    const initialize = async () => {
      setLoadingMsg('Menyiapkan Dealer...');
      const urlParams = new URLSearchParams(window.location.search);
      const staffMode = urlParams.get('staff') === 'true';
      setIsStaff(staffMode);

      let initialFbConfig = localStorage.getItem('honda_firebase_config');

      // 1. Dekode Link Personal (?p=...)
      const pParam = urlParams.get('p');
      if (pParam) {
        const decoded = robustAtob(pParam);
        if (decoded) {
          try {
            const parsed = JSON.parse(decoded);
            if (parsed.salesInfo) {
              urlSalesDataRef.current = parsed.salesInfo;
              isPersonalizedRef.current = true;
            }
            if (parsed.fbConfig) {
              initialFbConfig = JSON.stringify(parsed.fbConfig);
              localStorage.setItem('honda_firebase_config', initialFbConfig);
            }
          } catch(e) { console.error("URL Parameter Parse Error"); }
        }
      }

      // 2. Dekode Setup Link (?fb=...)
      const fbParam = urlParams.get('fb');
      if (fbParam) {
        const decodedFb = robustAtob(fbParam);
        if (decodedFb) {
          initialFbConfig = decodedFb;
          localStorage.setItem('honda_firebase_config', decodedFb);
        }
      }

      // 3. Load Data Lokal (Fallback Cepat)
      const isSetupCompleted = localStorage.getItem('honda_setup_completed') === 'true';
      if (isSetupCompleted) {
        setProducts(JSON.parse(localStorage.getItem('honda_catalog') || '[]'));
        setPromos(JSON.parse(localStorage.getItem('honda_promos') || '[]'));
        setLogo(localStorage.getItem('honda_dealer_logo'));
        setDealerName(localStorage.getItem('honda_dealer_name') || 'HONDA DEALER');
        setDealerAddress(localStorage.getItem('honda_dealer_address') || '');
        setSalesInfo(JSON.parse(localStorage.getItem('honda_sales_info') || JSON.stringify(DEFAULT_SALES)));
      }

      // 4. Sinkronisasi CLOUD (WAJIB sebelum Finish)
      if (initialFbConfig) {
        setLoadingMsg('Menyambungkan Database Cloud...');
        try {
          const config = JSON.parse(initialFbConfig);
          initFirebase(config);
          setCloudStatus('connected');
          
          setLoadingMsg('Mengunduh Data Terbaru...');
          // Gunakan Promise.race untuk mencegah hang jika internet lambat
          const cloudDataPromise = getDealerDataOnce();
          const timeoutPromise = new Promise((_, reject) => setTimeout(() => reject(new Error('Timeout')), 5000));
          
          try {
            const cloudData = await Promise.race([cloudDataPromise, timeoutPromise]) as any;
            if (cloudData) {
              applyData(cloudData, true);
            }
          } catch (error) {
            console.warn("Cloud sync timed out, using local/default data.");
          }

          // Tetap subscribe untuk update di masa depan
          firebaseUnsubscribe.current = subscribeToDealerData((updatedData) => {
            applyData(updatedData, true);
          });
        } catch (e) { 
          setCloudStatus('error');
        }
      } else if (!isSetupCompleted) {
        // Jika tidak ada config dan belum pernah setup, tampilkan default
        setProducts(INITIAL_PRODUCTS);
        setPromos(DEFAULT_PROMOS);
      }
      
      setLoadingMsg('Selamat Datang!');
      setTimeout(() => setIsInitialized(true), 600);
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
             <div className="w-1/2 h-full bg-honda-red animate-[shimmer_1.5s_infinite_linear]"></div>
           </div>
           <p className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-300 animate-pulse">{loadingMsg}</p>
        </div>
        <style dangerouslySetInnerHTML={{ __html: `
          @keyframes shimmer {
            0% { transform: translateX(-100%); }
            100% { transform: translateX(200%); }
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
          cloudStatus === 'connected' ? 'bg-green-500 text-white border-green-400' :
          cloudStatus === 'syncing' ? 'bg-orange-500 text-white border-orange-400' :
          'bg-gray-800 text-gray-400 border-gray-700'
        }`}>
          <div className={`w-1.5 h-1.5 rounded-full ${cloudStatus === 'connected' ? 'bg-white animate-pulse' : 'bg-current'}`}></div>
          DB: {cloudStatus}
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
