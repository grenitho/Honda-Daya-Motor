
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
import { initFirebase, subscribeToGlobalData, subscribeToSalesProfile, saveGlobalData, saveSalesProfile, getGlobalDealerData, getSalesProfile } from './services/firebaseService.ts';

type ViewState = 'home' | 'about' | 'contact';

const robustAtob = (str: string) => {
  try {
    const padding = str.length % 4;
    if (padding > 0) str += "=".repeat(4 - padding);
    return decodeURIComponent(atob(str).split('').map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)).join(''));
  } catch (e) {
    try { return decodeURIComponent(escape(atob(str))); } catch (e2) { return null; }
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
  const activeSalesIdRef = useRef<string | null>(null);
  const [cloudStatus, setCloudStatus] = useState<'connected' | 'offline' | 'syncing' | 'error'>('offline');
  
  const unsubs = useRef<any[]>([]);

  const applyGlobalData = useCallback((data: any) => {
    if (!data) return;
    if (data.products) setProducts(data.products);
    if (data.promos) setPromos(data.promos);
    if (data.logo !== undefined) setLogo(data.logo);
    if (data.dealerName) setDealerName(data.dealerName);
    if (data.dealerAddress) setDealerAddress(data.dealerAddress);
    if (data.storyTitle) setStoryTitle(data.storyTitle);
    if (data.storyCity) setStoryCity(data.storyCity);
    if (data.storyText1) setStoryText1(data.storyText1);
    if (data.storyText2) setStoryText2(data.storyText2);
    if (data.visi) setVisi(data.visi);
    if (data.misi) setMisi(data.misi);
    if (data.heroBackground) setHeroBackground(data.heroBackground);
    
    // Simpan ke local cache
    localStorage.setItem('honda_catalog', JSON.stringify(data.products || []));
    localStorage.setItem('honda_dealer_name', data.dealerName || '');
    localStorage.setItem('honda_setup_completed', 'true');
  }, []);

  const applySalesData = useCallback((data: any) => {
    if (!data) return;
    setSalesInfo(prev => ({ ...prev, ...data }));
    if (!isPersonalizedRef.current) {
      localStorage.setItem('honda_sales_info', JSON.stringify(data));
    }
  }, []);

  useEffect(() => {
    const initialize = async () => {
      const urlParams = new URLSearchParams(window.location.search);
      setIsStaff(urlParams.get('staff') === 'true');

      let fbConfigToUse = localStorage.getItem('honda_firebase_config');
      let targetSalesId = null;

      // 1. Parse Link Personal (?p=...)
      const pParam = urlParams.get('p');
      if (pParam) {
        const decoded = robustAtob(pParam);
        if (decoded) {
          try {
            const parsed = JSON.parse(decoded);
            if (parsed.salesId) {
              targetSalesId = parsed.salesId;
              activeSalesIdRef.current = parsed.salesId;
              isPersonalizedRef.current = true;
            }
            if (parsed.fbConfig) {
              fbConfigToUse = typeof parsed.fbConfig === 'string' ? parsed.fbConfig : JSON.stringify(parsed.fbConfig);
              localStorage.setItem('honda_firebase_config', fbConfigToUse);
            }
          } catch(e) {}
        }
      }

      // 2. Hubungkan ke Cloud
      if (fbConfigToUse) {
        setLoadingMsg('Sinkronisasi Cloud...');
        try {
          const config = JSON.parse(fbConfigToUse);
          initFirebase(config);
          setCloudStatus('connected');
          
          // Ambil Data Global (Catalog, Logo, etc)
          const globalData = await getGlobalDealerData();
          if (globalData) applyGlobalData(globalData);

          // Ambil Data Sales (Specific atau Master)
          const salesIdToFetch = targetSalesId || 'master_profile';
          const profileData = await getSalesProfile(salesIdToFetch);
          if (profileData) applySalesData(profileData);

          // Subscribe Real-time
          unsubs.current.push(subscribeToGlobalData(applyGlobalData));
          unsubs.current.push(subscribeToSalesProfile(salesIdToFetch, applySalesData));
        } catch (e) {
          setCloudStatus('error');
        }
      } else {
        // Fallback ke Local / Default
        setProducts(INITIAL_PRODUCTS);
        setPromos(DEFAULT_PROMOS);
      }
      
      setLoadingMsg('Dealer Siap!');
      setTimeout(() => setIsInitialized(true), 1200);
    };

    initialize();
    return () => unsubs.current.forEach(u => u?.());
  }, [applyGlobalData, applySalesData]);

  const handleSaveAll = async (newSales: SalesPerson, newLogo: string | null, newName: string, newAddress: string, newHeroBg: string, storyData?: any) => {
    // 1. Update UI
    setSalesInfo(newSales);
    setLogo(newLogo);
    setDealerName(newName);
    setDealerAddress(newAddress);
    setHeroBackground(newHeroBg);

    // 2. Simpan ke Cloud (Jika Terhubung)
    if (cloudStatus === 'connected') {
      // Simpan Global Dealer Info
      await saveGlobalData({
        logo: newLogo,
        dealerName: newName,
        dealerAddress: newAddress,
        heroBackground: newHeroBg,
        products: storyData?.products || products,
        promos: storyData?.promos || promos,
        ...storyData
      });

      // Simpan Profil Sales berdasarkan nomor WhatsApp (sebagai ID)
      const salesId = newSales.whatsapp || 'master_profile';
      await saveSalesProfile(salesId, newSales);
      
      // Juga update master_profile jika ini admin utama
      if (!isPersonalizedRef.current) {
        await saveSalesProfile('master_profile', newSales);
      }
    }
  };

  if (!isInitialized) {
    return (
      <div className="h-screen w-full flex flex-col items-center justify-center bg-white">
        <div className="text-7xl font-black italic text-honda-red animate-pulse">H</div>
        <p className="mt-8 text-[10px] font-black uppercase tracking-[0.4em] text-gray-300">{loadingMsg}</p>
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
      <AdminSettingsModal isOpen={isAdminOpen} onClose={() => setIsAdminOpen(false)} salesInfo={salesInfo} products={products} promos={promos} logo={logo} heroBackground={heroBackground} dealerName={dealerName} dealerAddress={dealerAddress} storyTitle={storyTitle} storyCity={storyCity} storyText1={storyText1} storyText2={storyText2} visi={visi} misi={misi} salesAboutMessage={salesAboutMessage} onSave={handleSaveAll} onReset={() => { localStorage.clear(); window.location.reload(); }} cloudStatus={cloudStatus} onPushToCloud={async () => { await handleSaveAll(salesInfo, logo, dealerName, dealerAddress, heroBackground, { products, promos, storyTitle, storyCity, storyText1, storyText2, visi, misi, salesAboutMessage }); }} onPullFromCloud={async () => { const d = await getGlobalDealerData(); if(d) applyGlobalData(d); const s = await getSalesProfile(activeSalesIdRef.current || 'master_profile'); if(s) applySalesData(s); }} />
      <SalesProfileModal isOpen={isSalesOpen} onClose={() => setIsSalesOpen(false)} salesInfo={salesInfo} remoteUrl={null} onSave={(s) => handleSaveAll(s, logo, dealerName, dealerAddress, heroBackground)} />
      <AdminPromoModal isOpen={isPromoOpen} onClose={() => setIsPromoOpen(false)} promos={promos} onSave={(p) => handleSaveAll(salesInfo, logo, dealerName, dealerAddress, heroBackground, {promos: p})} />
      <AdminProductModal isOpen={isCatalogOpen} onClose={() => setIsCatalogOpen(false)} products={products} onSave={(p) => handleSaveAll(salesInfo, logo, dealerName, dealerAddress, heroBackground, {products: p})} />
    </div>
  );
};

export default App;
