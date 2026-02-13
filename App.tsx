
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

const safeAtob = (str: string) => {
  try {
    return decodeURIComponent(atob(str).split('').map((c) => {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
  } catch (e) {
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
  
  const isPersonalizedRef = useRef(false);
  const urlSalesDataRef = useRef<any>(null);
  const isEditingRef = useRef(false); // Flag untuk mencegah overwrite saat admin sedang mengetik
  const [cloudStatus, setCloudStatus] = useState<'connected' | 'offline' | 'syncing' | 'error'>('offline');
  
  const firebaseUnsubscribe = useRef<any>(null);

  const applyData = useCallback((data: any, saveLocally = true) => {
    if (!data || isEditingRef.current) return;
    
    if (data.products) setProducts(data.products);
    if (data.promos) setPromos(data.promos);
    
    if (data.salesInfo) {
      if (isPersonalizedRef.current && urlSalesDataRef.current) {
        setSalesInfo((prev) => ({ 
          ...prev, 
          ...data.salesInfo, 
          ...urlSalesDataRef.current 
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
      if (data.products) localStorage.setItem('honda_catalog', JSON.stringify(data.products));
      if (data.promos) localStorage.setItem('honda_promos', JSON.stringify(data.promos));
      if (data.salesInfo && !isPersonalizedRef.current) localStorage.setItem('honda_sales_info', JSON.stringify(data.salesInfo));
      if (data.logo) localStorage.setItem('honda_dealer_logo', data.logo);
      if (data.heroBackground) localStorage.setItem('honda_hero_bg', data.heroBackground);
      if (data.dealerName) localStorage.setItem('honda_dealer_name', data.dealerName);
      if (data.dealerAddress) localStorage.setItem('honda_dealer_address', data.dealerAddress);
      
      if (data.storyTitle) localStorage.setItem('honda_story_title', data.storyTitle);
      if (data.storyCity) localStorage.setItem('honda_story_city', data.storyCity);
      if (data.storyText1) localStorage.setItem('honda_story_text1', data.storyText1);
      if (data.storyText2) localStorage.setItem('honda_story_text2', data.storyText2);
      if (data.visi) localStorage.setItem('honda_visi', data.visi);
      if (data.misi) localStorage.setItem('honda_misi', data.misi);
      if (data.salesAboutMessage) localStorage.setItem('honda_sales_about_msg', data.salesAboutMessage);
      
      localStorage.setItem('honda_setup_completed', 'true');
    }
  }, []);

  useEffect(() => {
    const initialize = async () => {
      const urlParams = new URLSearchParams(window.location.search);
      setIsStaff(urlParams.get('staff') === 'true');

      let initialFbConfig = localStorage.getItem('honda_firebase_config');

      // 1. Cek Parameter P (Personal Link)
      const pParam = urlParams.get('p');
      if (pParam) {
        const decoded = safeAtob(pParam);
        if (decoded) {
          try {
            const parsed = JSON.parse(decoded);
            if (parsed.salesInfo) {
              urlSalesDataRef.current = parsed.salesInfo;
              isPersonalizedRef.current = true;
              setSalesInfo((prev) => ({ ...prev, ...parsed.salesInfo }));
            }
            if (parsed.fbConfig) {
              initialFbConfig = JSON.stringify(parsed.fbConfig);
              localStorage.setItem('honda_firebase_config', initialFbConfig);
            }
          } catch(e) { console.error("Error parsing link"); }
        }
      }

      // 2. Cek Parameter FB (Setup Link)
      const fbParam = urlParams.get('fb');
      if (fbParam) {
        const decodedFb = safeAtob(fbParam);
        if (decodedFb) {
          initialFbConfig = decodedFb;
          localStorage.setItem('honda_firebase_config', decodedFb);
        }
      }

      // 3. Load Local Data
      const isSetupCompleted = localStorage.getItem('honda_setup_completed') === 'true';
      setProducts(JSON.parse(localStorage.getItem('honda_catalog') || (isSetupCompleted ? '[]' : JSON.stringify(INITIAL_PRODUCTS))));
      setPromos(JSON.parse(localStorage.getItem('honda_promos') || (isSetupCompleted ? '[]' : JSON.stringify(DEFAULT_PROMOS))));
      
      if (!isPersonalizedRef.current) {
        setSalesInfo(JSON.parse(localStorage.getItem('honda_sales_info') || JSON.stringify(DEFAULT_SALES)));
      }

      setLogo(localStorage.getItem('honda_dealer_logo') || (isSetupCompleted ? null : DEFAULT_LOGO_URL));
      setHeroBackground(localStorage.getItem('honda_hero_bg') || DEFAULT_HERO_BG_URL);
      setDealerName(localStorage.getItem('honda_dealer_name') || 'HONDA DAYA MOTOR SUNGAILIAT');
      setDealerAddress(localStorage.getItem('honda_dealer_address') || 'Jl. Batin Tikal No.423...');
      
      setStoryTitle(localStorage.getItem('honda_story_title') || DEFAULT_STORY.title);
      setStoryCity(localStorage.getItem('honda_story_city') || DEFAULT_STORY.city);
      setStoryText1(localStorage.getItem('honda_story_text1') || DEFAULT_STORY.text1);
      setStoryText2(localStorage.getItem('honda_story_text2') || DEFAULT_STORY.text2);
      setVisi(localStorage.getItem('honda_visi') || DEFAULT_STORY.visi);
      setMisi(localStorage.getItem('honda_misi') || DEFAULT_STORY.misi);
      setSalesAboutMessage(localStorage.getItem('honda_sales_about_msg') || "Sebagai konsultan penjualan Anda, misi saya adalah memberikan kemudahan dalam setiap langkah kepemilikan motor Honda Anda...");

      // 4. Cloud Sync
      if (initialFbConfig) {
        try {
          initFirebase(JSON.parse(initialFbConfig));
          setCloudStatus('connected');
          const cloudData = await getDealerDataOnce();
          if (cloudData) applyData(cloudData, true);
          firebaseUnsubscribe.current = subscribeToDealerData((updatedData) => applyData(updatedData, true));
        } catch (e) { 
          setCloudStatus('error');
          console.error("Firebase Sync Fail:", e);
        }
      }
      
      setIsInitialized(true);
    };
    initialize();
    return () => firebaseUnsubscribe.current?.();
  }, [applyData]);

  const handlePushToCloud = async () => {
    const currentData = {
      salesInfo, logo, dealerName, dealerAddress, heroBackground, products, promos,
      storyTitle, storyCity, storyText1, storyText2, visi, misi, salesAboutMessage
    };
    await saveDealerDataToCloud(currentData);
  };

  const handlePullFromCloud = async () => {
    const cloudData = await getDealerDataOnce();
    if (cloudData) applyData(cloudData, true);
  };

  const handleSaveAdminSettings = async (newSales: SalesPerson, newLogo: string | null, newName: string, newAddress: string, newHeroBg: string, storyData?: any) => {
    isEditingRef.current = true; // Kunci sinkronisasi cloud sementara
    const newData = {
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
    
    if (storyData) {
      if (storyData.storyTitle) setStoryTitle(storyData.storyTitle);
      if (storyData.storyCity) setStoryCity(storyData.storyCity);
      if (storyData.storyText1) setStoryText1(storyData.storyText1);
      if (storyData.storyText2) setStoryText2(storyData.storyText2);
      if (storyData.visi) setVisi(storyData.visi);
      if (storyData.misi) setMisi(storyData.misi);
      if (storyData.salesAboutMessage) setSalesAboutMessage(storyData.salesAboutMessage);
    }

    applyData(newData, true);
    if (cloudStatus === 'connected') await saveDealerDataToCloud(newData);
    isEditingRef.current = false; // Lepas kunci
  };

  const handleNavigate = (view: ViewState) => {
    setCurrentView(view);
    setSelectedProduct(null);
  };

  if (!isInitialized) return null;

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar onNavigate={handleNavigate} currentView={selectedProduct ? 'home' : currentView} logo={logo} dealerName={dealerName} isStaff={isStaff} onOpenSettings={() => setIsAdminOpen(true)} onOpenSalesProfile={() => setIsSalesOpen(true)} onOpenPromos={() => setIsPromoOpen(true)} onOpenCatalog={() => setIsCatalogOpen(true)} />
      <main className="flex-grow">
        {selectedProduct ? (
          <ProductDetail product={selectedProduct} salesInfo={salesInfo} onBack={() => setSelectedProduct(null)} />
        ) : currentView === 'about' ? (
          <About 
            salesInfo={salesInfo} 
            storyTitle={storyTitle} 
            storyCity={storyCity} 
            storyText1={storyText1} 
            storyText2={storyText2} 
            visi={visi}
            misi={misi}
            salesAboutMessage={salesAboutMessage} 
          />
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
          Cloud: {cloudStatus}
        </div>
      )}

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
        onSave={handleSaveAdminSettings} 
        onReset={() => { if(confirm("Hapus semua data lokal dan database cloud?")) { localStorage.clear(); window.location.reload(); } }} 
        onSyncRemote={async () => {}} 
        remoteUrl={null}
        onPushToCloud={handlePushToCloud}
        onPullFromCloud={handlePullFromCloud}
        cloudStatus={cloudStatus}
      />
      <SalesProfileModal isOpen={isSalesOpen} onClose={() => setIsSalesOpen(false)} salesInfo={salesInfo} remoteUrl={null} onSave={(s) => handleSaveAdminSettings(s, logo, dealerName, dealerAddress, heroBackground)} />
      <AdminPromoModal isOpen={isPromoOpen} onClose={() => setIsPromoOpen(false)} promos={promos} onSave={(p) => handleSaveAdminSettings(salesInfo, logo, dealerName, dealerAddress, heroBackground, {promos: p})} />
      <AdminProductModal isOpen={isCatalogOpen} onClose={() => setIsCatalogOpen(false)} products={products} onSave={(p) => handleSaveAdminSettings(salesInfo, logo, dealerName, dealerAddress, heroBackground, {products: p})} />
    </div>
  );
};

export default App;
