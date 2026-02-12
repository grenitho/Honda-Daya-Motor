
import React, { useState, useEffect, useCallback } from 'react';
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

const safeAtob = (str: string) => {
  try {
    return decodeURIComponent(Array.prototype.map.call(atob(str), (c: string) => {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
  } catch (e) {
    console.error("Decoding error:", e);
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
  
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isSalesOpen, setIsSalesOpen] = useState(false);
  const [isPromoOpen, setIsPromoOpen] = useState(false);
  const [isCatalogOpen, setIsCatalogOpen] = useState(false);

  const [remoteUrl, setRemoteUrl] = useState<string | null>(localStorage.getItem('honda_remote_url'));
  const [isSyncing, setIsSyncing] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const [isStaff, setIsStaff] = useState(false);

  const clearUrlParams = () => {
    const url = new URL(window.location.href);
    if (url.searchParams.has('p') || url.searchParams.has('remote')) {
      url.searchParams.delete('p');
      url.searchParams.delete('remote');
      window.history.replaceState({}, '', url.toString());
    }
  };

  const applyData = useCallback((data: any, markAsSetup = true) => {
    if (!data) return;

    if (data.products) {
      setProducts(data.products);
      localStorage.setItem('honda_catalog', JSON.stringify(data.products));
    }
    if (data.promos) {
      setPromos(data.promos);
      localStorage.setItem('honda_promos', JSON.stringify(data.promos));
    }
    if (data.salesInfo) {
      setSalesInfo((prev) => {
        const updated = { ...prev, ...data.salesInfo };
        localStorage.setItem('honda_sales_info', JSON.stringify(updated));
        return updated;
      });
    }
    if (data.logo) {
      setLogo(data.logo);
      localStorage.setItem('honda_dealer_logo', data.logo);
    }
    if (data.heroBackground) {
      setHeroBackground(data.heroBackground);
      localStorage.setItem('honda_hero_bg', data.heroBackground);
    }
    if (data.dealerName) {
      setDealerName(data.dealerName);
      localStorage.setItem('honda_dealer_name', data.dealerName);
    }
    if (data.dealerAddress) {
      setDealerAddress(data.dealerAddress);
      localStorage.setItem('honda_dealer_address', data.dealerAddress);
    }

    if (markAsSetup) {
      localStorage.setItem('honda_setup_completed', 'true');
    }
  }, []);

  const handleSyncRemote = async (url: string) => {
    if (!url) return null;
    setIsSyncing(true);
    try {
      const response = await fetch(url + (url.includes('?') ? '&' : '?') + 'nocache=' + Date.now());
      if (!response.ok) throw new Error("Gagal mengambil data cloud");
      const remoteData = await response.json();
      applyData(remoteData);
      setRemoteUrl(url);
      localStorage.setItem('honda_remote_url', url);
      return remoteData;
    } catch (err) {
      console.error("Cloud Sync Error:", err);
      throw err;
    } finally {
      setIsSyncing(false);
    }
  };

  useEffect(() => {
    const initializeData = async () => {
      try {
        const urlParams = new URLSearchParams(window.location.search);
        const urlRemote = urlParams.get('remote');
        const encodedData = urlParams.get('p');
        const isSetupCompleted = localStorage.getItem('honda_setup_completed') === 'true';
        
        setIsStaff(urlParams.get('staff') === 'true');

        // 1. LOAD LOCAL STORAGE TERLEBIH DAHULU
        const safeParse = (key: string, fallback: any) => {
          try {
            const item = localStorage.getItem(key);
            if (!item) return fallback;
            return JSON.parse(item);
          } catch (e) {
            return fallback;
          }
        };

        // Jika setup belum pernah dilakukan, baru gunakan INITIAL_PRODUCTS dari kodingan
        const localProducts = safeParse('honda_catalog', isSetupCompleted ? [] : INITIAL_PRODUCTS);
        const localPromos = safeParse('honda_promos', isSetupCompleted ? [] : DEFAULT_PROMOS);
        const localSales = safeParse('honda_sales_info', DEFAULT_SALES);

        setProducts(localProducts);
        setPromos(localPromos);
        setSalesInfo(localSales);
        setLogo(localStorage.getItem('honda_dealer_logo') || (isSetupCompleted ? null : DEFAULT_LOGO_URL));
        setHeroBackground(localStorage.getItem('honda_hero_bg') || DEFAULT_HERO_BG_URL);
        setDealerName(localStorage.getItem('honda_dealer_name') || 'HONDA DAYA MOTOR SUNGAILIAT');
        setDealerAddress(localStorage.getItem('honda_dealer_address') || 'Jl. Batin Tikal No.423, Karya Makmur, Kec. Pemali, Kabupaten Bangka, Kepulauan Bangka Belitung 33215');

        // 2. SINKRONISASI CLOUD (Jika ada parameter remote baru di URL)
        if (urlRemote) {
          await handleSyncRemote(urlRemote);
          clearUrlParams();
        }

        // 3. OVERRIDE DENGAN DATA LINK
        if (encodedData) {
          const decoded = safeAtob(encodedData);
          if (decoded) {
            try {
              const data = JSON.parse(decoded);
              applyData(data);
              clearUrlParams();
            } catch (e) {
              console.error("Gagal parse data link:", e);
            }
          }
        } 
      } catch (err) {
        console.error("Initialization error:", err);
      } finally {
        setIsInitialized(true);
      }
    };

    initializeData();
  }, [applyData]);

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
    localStorage.setItem('honda_setup_completed', 'true'); // Tandai bahwa admin sudah mulai mengelola
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

  const handleResetData = () => {
    if (confirm("⚠️ PERINGATAN: Semua data produk, promo, dan profil yang sudah Anda masukkan akan DIHAPUS dan kembali ke contoh awal dealer. Lanjutkan?")) {
      localStorage.clear();
      window.location.reload();
    }
  };

  if (!isInitialized) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-white">
        <div className="text-6xl font-black italic text-honda-red animate-pulse">H</div>
        <p className="mt-4 text-[10px] font-black uppercase tracking-widest text-gray-300">Menyiapkan Dealer...</p>
      </div>
    );
  }

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
          salesInfo={{...salesInfo, heroBackground}} 
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
        isStaff={isStaff}
        onOpenSettings={() => setIsAdminOpen(true)}
        onOpenSalesProfile={() => setIsSalesOpen(true)}
        onOpenPromos={() => setIsPromoOpen(true)}
        onOpenCatalog={() => setIsCatalogOpen(true)}
      />
      
      <main className="flex-grow">
        {isSyncing && (
          <div className="bg-blue-600 text-white text-[10px] font-bold text-center py-1 uppercase tracking-widest animate-pulse sticky top-20 z-40">
            Sinkronisasi Data Cloud...
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
        onReset={handleResetData}
        remoteUrl={remoteUrl} onSyncRemote={handleSyncRemote}
      />
      <SalesProfileModal 
        isOpen={isSalesOpen} onClose={() => setIsSalesOpen(false)}
        salesInfo={salesInfo} onSave={(newSales) => {
          setSalesInfo(newSales);
          localStorage.setItem('honda_sales_info', JSON.stringify(newSales));
          localStorage.setItem('honda_setup_completed', 'true');
        }}
        remoteUrl={remoteUrl}
      />
      <AdminPromoModal 
        isOpen={isPromoOpen} onClose={() => setIsPromoOpen(false)}
        promos={promos} onSave={(newPromos) => {
          setPromos(newPromos);
          localStorage.setItem('honda_promos', JSON.stringify(newPromos));
          localStorage.setItem('honda_setup_completed', 'true');
        }}
      />
      <AdminProductModal 
        isOpen={isCatalogOpen} onClose={() => setIsCatalogOpen(false)}
        products={products} onSave={(newProducts) => {
          setProducts(newProducts);
          localStorage.setItem('honda_catalog', JSON.stringify(newProducts));
          localStorage.setItem('honda_setup_completed', 'true');
        }}
      />
    </div>
  );
};

export default App;
