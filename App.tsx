
import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import About from './pages/About';
import Contact from './pages/Contact';
import ProductDetail from './pages/ProductDetail';
import FloatingContact from './components/FloatingContact';
import AdminSettingsModal from './components/AdminSettingsModal';
import { Product, SalesPerson, Promo } from './types';
import { SALES_INFO as DEFAULT_SALES, PROMOS as DEFAULT_PROMOS, INITIAL_PRODUCTS } from './constants';

type ViewState = 'home' | 'about' | 'contact';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<ViewState>('home');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  
  // CORE DATA STATES (Managed by Admin Utama & Sales)
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [promos, setPromos] = useState<Promo[]>(DEFAULT_PROMOS);
  const [salesInfo, setSalesInfo] = useState<SalesPerson>(DEFAULT_SALES);
  
  // BRANDING STATES
  const [logo, setLogo] = useState<string | null>(null);
  const [dealerName, setDealerName] = useState<string>('HONDA DEALER');
  
  // MODAL STATES
  const [isAdminOpen, setIsAdminOpen] = useState(false);

  // ---------------------------------------------------------
  // LOAD DATA LOGIC
  // ---------------------------------------------------------
  useEffect(() => {
    // 1. Priority: URL Parameters (Master/Sales Link)
    const urlParams = new URLSearchParams(window.location.search);
    const encodedData = urlParams.get('p');

    if (encodedData) {
      try {
        const decoded = JSON.parse(atob(encodedData));
        if (decoded.products) setProducts(decoded.products);
        if (decoded.promos) setPromos(decoded.promos);
        if (decoded.salesInfo) setSalesInfo(decoded.salesInfo);
        if (decoded.logo) setLogo(decoded.logo);
        if (decoded.dealerName) setDealerName(decoded.dealerName);
        console.log("Configuration loaded from shared link");
        return; 
      } catch (e) {
        console.error("Invalid link format");
      }
    }

    // 2. Secondary: LocalStorage (Owner's local session)
    const savedProducts = localStorage.getItem('honda_catalog');
    const savedPromos = localStorage.getItem('honda_promos');
    const savedSales = localStorage.getItem('honda_sales_info');
    const savedLogo = localStorage.getItem('honda_dealer_logo');
    const savedName = localStorage.getItem('honda_dealer_name');

    if (savedProducts) setProducts(JSON.parse(savedProducts));
    if (savedPromos) setPromos(JSON.parse(savedPromos));
    if (savedSales) setSalesInfo(JSON.parse(savedSales));
    if (savedLogo) setLogo(savedLogo);
    if (savedName) setDealerName(savedName);
  }, []);

  // ---------------------------------------------------------
  // PERSISTENCE ACTIONS
  // ---------------------------------------------------------
  
  // Corporate Admin Action: Manage Catalog
  const handleUpdateCatalog = (newProducts: Product[]) => {
    setProducts(newProducts);
    localStorage.setItem('honda_catalog', JSON.stringify(newProducts));
  };

  // Corporate Admin Action: Manage Promos
  const handleUpdatePromos = (newPromos: Promo[]) => {
    setPromos(newPromos);
    localStorage.setItem('honda_promos', JSON.stringify(newPromos));
  };

  // Sales Action: Update Profile
  const handleSaveSalesSettings = (newSales: SalesPerson, newLogo: string | null, newName: string) => {
    setSalesInfo(newSales);
    setLogo(newLogo);
    setDealerName(newName);
    
    localStorage.setItem('honda_sales_info', JSON.stringify(newSales));
    if (newLogo) localStorage.setItem('honda_dealer_logo', newLogo);
    localStorage.setItem('honda_dealer_name', newName);
  };

  // ---------------------------------------------------------
  // NAVIGATION
  // ---------------------------------------------------------
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
      return (
        <ProductDetail 
          product={selectedProduct} 
          salesInfo={salesInfo}
          onBack={() => setSelectedProduct(null)} 
        />
      );
    }

    switch (currentView) {
      case 'about':
        return <About salesInfo={salesInfo} />;
      case 'contact':
        return <Contact salesInfo={salesInfo} />;
      case 'home':
      default:
        return (
          <Home 
            products={products}
            promos={promos}
            salesInfo={salesInfo}
            onUpdateProducts={handleUpdateCatalog}
            onUpdatePromos={handleUpdatePromos}
            onSelectProduct={handleSelectProduct}
          />
        );
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar 
        onNavigate={handleNavigate} 
        currentView={selectedProduct ? 'home' : currentView} 
        logo={logo}
        dealerName={dealerName}
        onOpenSettings={() => setIsAdminOpen(true)}
      />
      
      <main className="flex-grow">
        {renderContent()}
      </main>

      <Footer dealerName={dealerName} salesInfo={salesInfo} />
      
      <FloatingContact salesInfo={salesInfo} />
      
      <AdminSettingsModal 
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
        salesInfo={salesInfo}
        products={products}
        promos={promos}
        logo={logo}
        dealerName={dealerName}
        onSave={handleSaveSalesSettings}
      />
    </div>
  );
};

export default App;
