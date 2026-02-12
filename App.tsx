
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
import { SALES_INFO as DEFAULT_SALES, PROMOS as DEFAULT_PROMOS, INITIAL_PRODUCTS, DEFAULT_LOGO_URL, DEFAULT_HERO_BG_URL } from './constants.ts';
import { initFirebase, subscribeToDealerData, saveDealerDataToCloud, getDealerDataOnce } from './services/firebaseService.ts';

type ViewState = 'home' | 'about' | 'contact';

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
  
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isSalesOpen, setIsSalesOpen] = useState(false);
  const [isPromoOpen, setIsPromoOpen] = useState(false);
  const [isCatalogOpen, setIsCatalogOpen] = useState(false);

  const [isInitialized, setIsInitialized] = useState(false);
  const [isStaff, setIsStaff] = useState(false);
  const [cloudStatus, setCloudStatus] = useState<'connected' | 'offline' | 'syncing' | 'error'>('offline');
  
  const firebaseUnsubscribe = useRef<any>(null);

  const applyData = useCallback((data: any, saveLocally = true) => {
    if (!data) return;
    if (data.products) setProducts(data.products);
    if (data.promos) setPromos(data.promos);
    if (data.salesInfo) setSalesInfo((prev) => ({ ...prev, ...data.salesInfo }));
    if (data.logo !== undefined) setLogo(data.logo);
    if (data.heroBackground) setHeroBackground(data.heroBackground);
    if (data.dealerName) setDealerName(data.dealerName);
    if (data.dealerAddress) setDealerAddress(data.dealerAddress);

    if (saveLocally) {
      if (data.products) localStorage.setItem('honda_catalog', JSON.stringify(data.products));
      if (data.promos) localStorage.setItem('honda_promos', JSON.stringify(data.promos));
      if (data.salesInfo) localStorage.setItem('honda_sales_info', JSON.stringify(data.salesInfo));
      if (data.logo) localStorage.setItem('honda_dealer_logo', data.logo);
      if (data.heroBackground) localStorage.setItem('honda_hero_bg', data.heroBackground);
      if (data.dealerName) localStorage.setItem('honda_dealer_name', data.dealerName);
      if (data.dealerAddress) localStorage.setItem('honda_dealer_address', data.dealerAddress);
      localStorage.setItem('honda_setup_completed', 'true');
    }
  }, []);

  useEffect(() => {
    const initialize = async () => {
      const urlParams = new URLSearchParams(window.location.search);
      setIsStaff(urlParams.get('staff') === 'true');

      // 1. Load Local Storage First (agar UX cepat)
      const isSetupCompleted = localStorage.getItem('honda_setup_completed') === 'true';
      const localProducts = JSON.parse(localStorage.getItem('honda_catalog') || (isSetupCompleted ? '[]' : JSON.stringify(INITIAL_PRODUCTS)));
      const localPromos = JSON.parse(localStorage.getItem('honda_promos') || (isSetupCompleted ? '[]' : JSON.stringify(DEFAULT_PROMOS)));
      const localSales = JSON.parse(localStorage.getItem('honda_sales_info') || JSON.stringify(DEFAULT_SALES));

      setProducts(localProducts);
      setPromos(localPromos);
      setSalesInfo(localSales);
      setLogo(localStorage.getItem('honda_dealer_logo') || (isSetupCompleted ? null : DEFAULT_LOGO_URL));
      setHeroBackground(localStorage.getItem('honda_hero_bg') || DEFAULT_HERO_BG_URL);
      setDealerName(localStorage.getItem('honda_dealer_name') || 'HONDA DAYA MOTOR SUNGAILIAT');
      setDealerAddress(localStorage.getItem('honda_dealer_address') || 'Jl. Batin Tikal No.423, Karya Makmur, Kec. Pemali, Kabupaten Bangka, Kepulauan Bangka Belitung 33215');

      // 2. Initialize Firebase if Config exists
      const fbConfigStr = localStorage.getItem('honda_firebase_config');
      if (fbConfigStr) {
        try {
          const fbConfig = JSON.parse(fbConfigStr);
          initFirebase(fbConfig);
          setCloudStatus('syncing');

          // Check if Cloud is empty
          const cloudData = await getDealerDataOnce();
          if (!cloudData) {
            // MIGRATION: Push current local data to cloud for the first time
            console.log("Cloud is empty. Migrating local data to Firebase...");
            const initialData = {
              products: localProducts,
              promos: localPromos,
              salesInfo: localSales,
              logo: localStorage.getItem('honda_dealer_logo') || DEFAULT_LOGO_URL,
              heroBackground: localStorage.getItem('honda_hero_bg') || DEFAULT_HERO_BG_URL,
              dealerName: localStorage.getItem('honda_dealer_name') || 'HONDA DAYA MOTOR SUNGAILIAT',
              dealerAddress: localStorage.getItem('honda_dealer_address') || 'Jl. Batin Tikal No.423...'
            };
            await saveDealerDataToCloud(initialData);
          } else {
            // Sync current cloud data to local state
            applyData(cloudData, true);
          }

          setCloudStatus('connected');
          
          // 3. Listen for changes (Real-time)
          firebaseUnsubscribe.current = subscribeToDealerData((updatedData) => {
            console.log("Real-time cloud update received!");
            applyData(updatedData, true);
          });
        } catch (e) {
          console.error("Firebase startup error:", e);
          setCloudStatus('error');
        }
      }

      setIsInitialized(true);
    };

    initialize();
    return () => {
      if (firebaseUnsubscribe.current) firebaseUnsubscribe.current();
    };
  }, [applyData]);

  const handleSaveAdminSettings = async (newSales: SalesPerson, newLogo: string | null, newName: string, newAddress: string, newHeroBg: string) => {
    const newData = {
      salesInfo: newSales,
      logo: newLogo,
      dealerName: newName,
      dealerAddress: newAddress,
      heroBackground: newHeroBg,
      products,
      promos
    };

    // Update Local States
    setSalesInfo(newSales);
    setLogo(newLogo);
    setDealerName(newName);
    setDealerAddress(newAddress);
    setHeroBackground(newHeroBg);

    // Save Local Storage
    localStorage.setItem('honda_sales_info', JSON.stringify(newSales));
    if (newLogo) localStorage.setItem('honda_dealer_logo', newLogo);
    localStorage.setItem('honda_dealer_name', newName);
    localStorage.setItem('honda_dealer_address', newAddress);
    localStorage.setItem('honda_hero_bg', newHeroBg);
    localStorage.setItem('honda_setup_completed', 'true');

    // Save Cloud if connected
    if (cloudStatus === 'connected') {
      await saveDealerDataToCloud(newData);
    }
  };

  const handleUpdatePromos = async (newPromos: Promo[]) => {
    setPromos(newPromos);
    localStorage.setItem('honda_promos', JSON.stringify(newPromos));
    if (cloudStatus === 'connected') {
      await saveDealerDataToCloud({ promos: newPromos });
    }
  };

  const handleUpdateCatalog = async (newProducts: Product[]) => {
    setProducts(newProducts);
    localStorage.setItem('honda_catalog', JSON.stringify(newProducts));
    if (cloudStatus === 'connected') {
      await saveDealerDataToCloud({ products: newProducts });
    }
  };

  const handleNavigate = (view: ViewState) => {
    setSelectedProduct(null);
    setCurrentView(view);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (!isInitialized) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-white">
        <div className="text-6xl font-black italic text-honda-red animate-pulse">H</div>
        <p className="mt-4 text-[10px] font-black uppercase tracking-widest text-gray-300">Menghubungkan Cloud...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar 
        onNavigate={handleNavigate} currentView={selectedProduct ? 'home' : currentView} 
        logo={logo} dealerName={dealerName} 
        isStaff={isStaff}
        onOpenSettings={() => setIsAdminOpen(true)}
        onOpenSalesProfile={() => setIsSalesOpen(true)}
        onOpenPromos={() => setIsPromoOpen(true)}
        onOpenCatalog={() => setIsCatalogOpen(true)}
      />
      
      <main className="flex-grow">
        {isStaff && (
          <div className={`text-white text-[8px] font-black text-center py-1 uppercase tracking-widest sticky top-20 z-[45] transition-colors duration-500 ${cloudStatus === 'connected' ? 'bg-green-600' : cloudStatus === 'syncing' ? 'bg-orange-500' : 'bg-gray-400'}`}>
            {cloudStatus === 'connected' ? '● Database Cloud Terhubung (Live)' : cloudStatus === 'syncing' ? '↻ Menyinkronkan Data...' : '○ Mode Offline (Lokal)'}
          </div>
        )}
        
        {selectedProduct ? (
          <ProductDetail product={selectedProduct} salesInfo={salesInfo} onBack={() => setSelectedProduct(null)} />
        ) : currentView === 'about' ? (
          <About salesInfo={salesInfo} />
        ) : currentView === 'contact' ? (
          <Contact salesInfo={salesInfo} />
        ) : (
          <Home products={products} promos={promos} salesInfo={{...salesInfo, heroBackground}} onSelectProduct={setSelectedProduct} />
        )}
      </main>

      <MapSection dealerName={dealerName} address={dealerAddress} />
      <Footer dealerName={dealerName} salesInfo={salesInfo} />
      <FloatingContact salesInfo={salesInfo} />
      
      <AdminSettingsModal 
        isOpen={isAdminOpen} onClose={() => setIsAdminOpen(false)}
        salesInfo={salesInfo} products={products} promos={promos}
        logo={logo} heroBackground={heroBackground}
        dealerName={dealerName} dealerAddress={dealerAddress} 
        onSave={handleSaveAdminSettings}
        onReset={() => { if(confirm("Hapus semua data?")) { localStorage.clear(); window.location.reload(); } }}
        onSyncRemote={async (url) => {}} 
        remoteUrl={null}
      />
      
      <SalesProfileModal 
        isOpen={isSalesOpen} onClose={() => setIsSalesOpen(false)}
        salesInfo={salesInfo} remoteUrl={null}
        onSave={(s) => handleSaveAdminSettings(s, logo, dealerName, dealerAddress, heroBackground)}
      />
      
      <AdminPromoModal 
        isOpen={isPromoOpen} onClose={() => setIsPromoOpen(false)}
        promos={promos} onSave={handleUpdatePromos}
      />
      
      <AdminProductModal 
        isOpen={isCatalogOpen} onClose={() => setIsCatalogOpen(false)}
        products={products} onSave={handleUpdateCatalog}
      />
    </div>
  );
};

export default App;
