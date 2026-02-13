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

const robustAtob = (str: string | null) => {
  if (!str) return null;
  try {
    const normalized = str.replace(/-/g, '+').replace(/_/g, '/');
    const pad = normalized.length % 4;
    const padded = pad ? normalized + '='.repeat(4 - pad) : normalized;
    const binary = atob(padded);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
      bytes[i] = binary.charCodeAt(i);
    }
    return new TextDecoder().decode(bytes);
  } catch (e) {
    console.error("Decoding Error:", e);
    return null;
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
  const unsubsRef = useRef<any[]>([]);

  const safeSetLocal = (key: string, value: string) => {
    try { localStorage.setItem(key, value); } catch (e) { }
  };

  const applyGlobalData = useCallback((data: any) => {
    if (!data) return;
    if (data.products && data.products.length > 0) setProducts(data.products);
    if (data.promos && data.promos.length > 0) setPromos(data.promos);
    if (data.logo) setLogo(data.logo);
    if (data.dealerName) setDealerName(data.dealerName);
    if (data.dealerAddress) setDealerAddress(data.dealerAddress);
    if (data.heroBackground) setHeroBackground(data.heroBackground);
    if (data.storyTitle) setStoryTitle(data.storyTitle);
    if (data.storyCity) setStoryCity(data.storyCity);
    if (data.storyText1) setStoryText1(data.storyText1);
    if (data.storyText2) setStoryText2(data.storyText2);
    if (data.visi) setVisi(data.visi);
    if (data.misi) setMisi(data.misi);
    if (data.salesAboutMessage) setSalesAboutMessage(data.salesAboutMessage);
  }, []);

  const applySalesData = useCallback((data: any) => {
    if (!data || !data.name) return;
    setSalesInfo(prev => ({ ...prev, ...data }));
  }, []);

  useEffect(() => {
    let mounted = true;
    const initialize = async () => {
      const urlParams = new URLSearchParams(window.location.search);
      const pParam = urlParams.get('p');
      let fbConfigToUse = localStorage.getItem('honda_firebase_config');
      let targetSalesId = null;

      if (pParam) {
        const decoded = robustAtob(pParam);
        if (decoded) {
          try {
            const parsed = JSON.parse(decoded);
            if (parsed.salesId) {
              targetSalesId = String(parsed.salesId).trim();
              activeSalesIdRef.current = targetSalesId;
              isPersonalizedRef.current = true;
            }
            if (parsed.fbConfig) {
              fbConfigToUse = typeof parsed.fbConfig === 'string' ? parsed.fbConfig : JSON.stringify(parsed.fbConfig);
            }
          } catch(e) { console.error("Link Param Error", e); }
        }
      }

      if (localStorage.getItem('honda_setup_completed') === 'true') {
        try {
          const localProducts = localStorage.getItem('honda_catalog');
          if (localProducts) setProducts(JSON.parse(localProducts));
          const localPromos = localStorage.getItem('honda_promos');
          if (localPromos) setPromos(JSON.parse(localPromos));
          setLogo(localStorage.getItem('honda_dealer_logo'));
          setDealerName(localStorage.getItem('honda_dealer_name') || 'HONDA DAYA MOTOR');
          setDealerAddress(localStorage.getItem('honda_dealer_address') || '');
          setHeroBackground(localStorage.getItem('honda_hero_bg') || DEFAULT_HERO_BG_URL);
          if (!isPersonalizedRef.current) {
            const localSales = localStorage.getItem('honda_sales_info');
            if (localSales) setSalesInfo(JSON.parse(localSales));
          }
        } catch (e) { }
      } else {
        setProducts(INITIAL_PRODUCTS);
        setPromos(DEFAULT_PROMOS);
      }

      if (mounted) setIsStaff(urlParams.get('staff') === 'true');

      if (fbConfigToUse && mounted) {
        try {
          const config = JSON.parse(fbConfigToUse);
          initFirebase(config);
          setCloudStatus('connected');
          const globalData = await getGlobalDealerData();
          if (globalData && mounted) applyGlobalData(globalData);
          
          const salesIdToFetch = targetSalesId || 'master_profile';
          const profileData = await getSalesProfile(salesIdToFetch);
          if (profileData && mounted) applySalesData(profileData);

          unsubsRef.current.forEach(u => u?.());
          unsubsRef.current = [
            subscribeToGlobalData(applyGlobalData),
            subscribeToSalesProfile(salesIdToFetch, applySalesData)
          ];
        } catch (e) { 
          if (mounted) setCloudStatus('error'); 
        }
      }

      if (mounted) {
        setLoadingMsg('Siap');
        setTimeout(() => setIsInitialized(true), 500);
      }
    };

    initialize();
    return () => { 
      mounted = false; 
      unsubsRef.current.forEach(u => u?.()); 
    };
  }, [applyGlobalData, applySalesData]);

  const handleSaveAll = async (newSales: SalesPerson, newLogo: string | null, newName: string, newAddress: string, newHeroBg: string, storyData?: any) => {
    setSalesInfo(newSales);
    setLogo(newLogo);
    setDealerName(newName);
    setDealerAddress(newAddress);
    setHeroBackground(newHeroBg);
    
    if (storyData) {
      if (storyData.storyTitle) setStoryTitle(storyData.storyTitle);
      if (storyData.storyCity) setStoryCity(storyData.storyCity);
      if (storyData.storyText1) setStoryText1(storyData.storyText1);
      if (storyData.storyText2) setStoryText2(storyData.storyText2);
      if (storyData.visi) setVisi(storyData.visi);
      if (storyData.misi) setMisi(storyData.misi);
      if (storyData.salesAboutMessage) setSalesAboutMessage(storyData.salesAboutMessage);
      if (storyData.products) setProducts(storyData.products);
      if (storyData.promos) setPromos(storyData.promos);
    }

    safeSetLocal('honda_dealer_logo', newLogo || "");
    safeSetLocal('honda_dealer_name', newName);
    safeSetLocal('honda_dealer_address', newAddress);
    safeSetLocal('honda_hero_bg', newHeroBg);
    safeSetLocal('honda_setup_completed', 'true');
    if (!isPersonalizedRef.current) safeSetLocal('honda_sales_info', JSON.stringify(newSales));

    if (cloudStatus === 'connected') {
      const globalPayload = {
        logo: newLogo, dealerName: newName, dealerAddress: newAddress, heroBackground: newHeroBg,
        products: storyData?.products || products, promos: storyData?.promos || promos,
        storyTitle: storyData?.storyTitle || storyTitle, storyCity: storyData?.storyCity || storyCity,
        storyText1: storyData?.storyText1 || storyText1, storyText2: storyData?.storyText2 || storyText2,
        visi: storyData?.visi || visi, misi: storyData?.misi || misi,
        salesAboutMessage: storyData?.salesAboutMessage || salesAboutMessage
      };
      await saveGlobalData(globalPayload);
      const salesId = String(newSales.whatsapp).trim() || 'master_profile';
      await saveSalesProfile(salesId, newSales);
      if (!isPersonalizedRef.current) await saveSalesProfile('master_profile', newSales);
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
      <Navbar 
        onNavigate={(v) => { setCurrentView(v); setSelectedProduct(null); }} 
        currentView={selectedProduct ? 'home' : currentView} 
        logo={logo} 
        dealerName={dealerName} 
        isStaff={isStaff} 
        onOpenSettings={() => setIsAdminOpen(true)} 
        onOpenSalesProfile={() => setIsSalesOpen(true)} 
        onOpenPromos={() => setIsPromoOpen(true)} 
        onOpenCatalog={() => setIsCatalogOpen(true)} 
      />
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
      
      <AdminSettingsModal 
        isOpen={isAdminOpen} 
        onClose={() => setIsAdminOpen(false)} 
        salesInfo={salesInfo} 
        products={products} 
        promos={promos} 
        logo={logo} 
        heroBackground={heroBackground} 
        dealerName={dealerName} 
        dealerAddress={dealerAddress} 
        storyTitle={storyTitle} 
        storyCity={storyCity} 
        storyText1={storyText1} 
        storyText2={storyText2} 
        visi={visi} 
        misi={misi} 
        salesAboutMessage={salesAboutMessage}
        remoteUrl={null}
        onSyncRemote={async () => {}}
        onSave={handleSaveAll}
        onReset={() => { if(confirm("Reset semua data?")) { localStorage.clear(); window.location.reload(); } }}
        cloudStatus={cloudStatus}
        onPushToCloud={async () => { await handleSaveAll(salesInfo, logo, dealerName, dealerAddress, heroBackground, { products, promos }); }}
        onPullFromCloud={async () => { const d = await getGlobalDealerData(); if(d) applyGlobalData(d); }}
      />

      <SalesProfileModal 
        isOpen={isSalesOpen} 
        onClose={() => setIsSalesOpen(false)} 
        salesInfo={salesInfo} 
        remoteUrl={null}
        onSave={(s) => handleSaveAll(s, logo, dealerName, dealerAddress, heroBackground)} 
      />

      <AdminPromoModal 
        isOpen={isPromoOpen} 
        onClose={() => setIsPromoOpen(false)} 
        promos={promos} 
        onSave={(p) => handleSaveAll(salesInfo, logo, dealerName, dealerAddress, heroBackground, {promos: p})} 
      />

      <AdminProductModal 
        isOpen={isCatalogOpen} 
        onClose={() => setIsCatalogOpen(false)} 
        products={products} 
        onSave={(p) => handleSaveAll(salesInfo, logo, dealerName, dealerAddress, heroBackground, {products: p})} 
      />
    </div>
  );
};

export default App;
