
import React, { useState, useEffect } from 'react';
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

type ViewState = 'home' | 'about' | 'contact';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<ViewState>('home');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [promos, setPromos] = useState<Promo[]>(DEFAULT_PROMOS);
  const [salesInfo, setSalesInfo] = useState<SalesPerson>(DEFAULT_SALES);
  
  const [logo, setLogo] = useState<string | null>(DEFAULT_LOGO_URL);
  const [heroBackground, setHeroBackground] = useState<string>(DEFAULT_HERO_BG_URL);
  const [dealerName, setDealerName] = useState<string>('HONDA DAYA MOTOR SUNGAILIAT');
  const [dealerAddress, setDealerAddress] = useState<string>('Jl. Batin Tikal No.423, Karya Makmur, Kec. Pemali, Kabupaten Bangka, Kepulauan Bangka Belitung 33215');
  
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isSalesOpen, setIsSalesOpen] = useState(false);
  const [isPromoOpen, setIsPromoOpen] = useState(false);
  const [isCatalogOpen, setIsCatalogOpen] = useState(false);

  const [remoteUrl, setRemoteUrl] = useState<string | null>(localStorage.getItem('honda_remote_url'));
  const [isSyncing, setIsSyncing] = useState(false);

  useEffect(() => {
    const initializeData = async () => {
      const urlParams = new URLSearchParams(window.location.search);
      const urlRemote = urlParams.get('remote');
      const activeRemote = urlRemote || remoteUrl;

      if (activeRemote) {
        await handleSyncRemote(activeRemote);
      } else {
        const savedProducts = localStorage.getItem('honda_catalog');
        const savedPromos = localStorage.getItem('honda_promos');
        const savedSales = localStorage.getItem('honda_sales_info');
        const savedLogo = localStorage.getItem('honda_dealer_logo');
        const savedHeroBg = localStorage.getItem('honda_hero_bg');
        const savedName = localStorage.getItem('honda_dealer_name');
        const savedAddress = localStorage.getItem('honda_dealer_address');

        if (savedProducts) setProducts(JSON.parse(savedProducts));
        if (savedPromos) setPromos(JSON.parse(savedPromos));
        if (savedSales) setSalesInfo(JSON.parse(savedSales));
        if (savedLogo) setLogo(savedLogo);
        if (savedHeroBg) setHeroBackground(savedHeroBg);
        if (savedName) setDealerName(savedName);
        if (savedAddress) setDealerAddress(savedAddress);
      }
    };

    initializeData();
  }, []);

  const handleSyncRemote = async (url: string) => {
    setIsSyncing(true);
    try {
      const response = await fetch(url + '?nocache=' + Date.now());
      if (!response.ok) throw new Error("Gagal mengambil data cloud");
      const remoteData = await response.json();
      
      applyData(remoteData);
      setRemoteUrl(url);
      localStorage.setItem('honda_remote_url', url);
    } catch (err) {
      console.error("Cloud Sync Error:", err);
    } finally {
      setIsSyncing(false);
    }
  };

  const applyData = (data: any) => {
    if (data.products) setProducts(data.products);
    if (data.promos) setPromos(data.promos);
    if (data.salesInfo) setSalesInfo(data.salesInfo);
    if (data.logo) setLogo(data.logo);
    if (data.heroBackground) setHeroBackground(data.heroBackground);
    if (data.dealerName) setDealerName(data.dealerName);
    if (data.dealerAddress) setDealerAddress(data.dealerAddress);
  };

  const handleSaveAdminSettings = (newSales: SalesPerson, newLogo: string | null, newName: string, newAddress: string, newHeroBg: string) => {
    setSalesInfo(newSales);
    setLogo(newLogo);
    setHeroBackground(newHeroBg);
    setDealerName(newName);
    setDealerAddress(newAddress);
    
    localStorage.setItem('honda_sales_info', JSON.stringify(newSales));
    if (newLogo) localStorage.setItem('honda_dealer_logo', newLogo);
    localStorage.setItem('honda_hero_bg', newHeroBg);
    localStorage.setItem('honda_dealer_name', newName);
    localStorage.setItem('honda_dealer_address', newAddress);
  };

  const handleNavigate = (view: ViewState) => {
    setSelectedProduct(null);
    setCurrentView(view);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectProduct = (product: Product) => {
    setSelectedProduct(product);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const renderContent = () => {
    if (selectedProduct) {
      return <ProductDetail product={selectedProduct} salesInfo={salesInfo} onBack={() => setSelectedProduct(null)} />;
    }
    switch (currentView) {
      case 'about': return <About salesInfo={salesInfo} />;
      case 'contact': return <Contact salesInfo={salesInfo} />;
      default: return (
        <Home 
          products={products} 
          promos={promos} 
          salesInfo={{...salesInfo, heroBackground}} // Pass background through salesInfo for simpler props
          onSelectProduct={handleSelectProduct} 
        />
      );
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar 
        onNavigate={handleNavigate} currentView={selectedProduct ? 'home' : currentView} 
        logo={logo} dealerName={dealerName} 
        onOpenSettings={() => setIsAdminOpen(true)}
        onOpenSalesProfile={() => setIsSalesOpen(true)}
        onOpenPromos={() => setIsPromoOpen(true)}
        onOpenCatalog={() => setIsCatalogOpen(true)}
      />
      
      <main className="flex-grow">
        {isSyncing && (
          <div className="bg-blue-600 text-white text-[10px] font-bold text-center py-1 uppercase tracking-widest animate-pulse">
            Sinkronisasi Data Pusat...
          </div>
        )}
        {renderContent()}
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
        remoteUrl={remoteUrl} onSyncRemote={handleSyncRemote}
      />

      <SalesProfileModal 
        isOpen={isSalesOpen} onClose={() => setIsSalesOpen(false)}
        salesInfo={salesInfo} onSave={(newSales) => {
          setSalesInfo(newSales);
          localStorage.setItem('honda_sales_info', JSON.stringify(newSales));
        }}
        remoteUrl={remoteUrl}
      />

      <AdminPromoModal 
        isOpen={isPromoOpen}
        onClose={() => setIsPromoOpen(false)}
        promos={promos}
        onSave={(newPromos) => {
          setPromos(newPromos);
          localStorage.setItem('honda_promos', JSON.stringify(newPromos));
        }}
      />

      <AdminProductModal 
        isOpen={isCatalogOpen}
        onClose={() => setIsCatalogOpen(false)}
        products={products}
        onSave={(newProducts) => {
          setProducts(newProducts);
          localStorage.setItem('honda_catalog', JSON.stringify(newProducts));
        }}
      />
    </div>
  );
};

export default App;
