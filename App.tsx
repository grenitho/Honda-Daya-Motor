
import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar.js';
import Footer from './components/Footer.js';
import Home from './pages/Home.js';
import About from './pages/About.js';
import Contact from './pages/Contact.js';
import ProductDetail from './pages/ProductDetail.js';
import FloatingContact from './components/FloatingContact.js';
import AdminSettingsModal from './components/AdminSettingsModal.js';
import { Product, SalesPerson, Promo } from './types.js';
import { SALES_INFO as DEFAULT_SALES, PROMOS as DEFAULT_PROMOS, INITIAL_PRODUCTS } from './constants.js';

type ViewState = 'home' | 'about' | 'contact';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<ViewState>('home');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [promos, setPromos] = useState<Promo[]>(DEFAULT_PROMOS);
  const [salesInfo, setSalesInfo] = useState<SalesPerson>(DEFAULT_SALES);
  const [logo, setLogo] = useState<string | null>(null);
  const [dealerName, setDealerName] = useState<string>('HONDA DEALER');
  const [isAdminOpen, setIsAdminOpen] = useState(false);

  useEffect(() => {
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
        return; 
      } catch (e) { console.error("Invalid link", e); }
    }

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

  const handleUpdateCatalog = (newProducts: Product[]) => {
    setProducts(newProducts);
    localStorage.setItem('honda_catalog', JSON.stringify(newProducts));
  };

  const handleUpdatePromos = (newPromos: Promo[]) => {
    setPromos(newPromos);
    localStorage.setItem('honda_promos', JSON.stringify(newPromos));
  };

  const handleSaveSalesSettings = (newSales: SalesPerson, newLogo: string | null, newName: string) => {
    setSalesInfo(newSales);
    setLogo(newLogo);
    setDealerName(newName);
    localStorage.setItem('honda_sales_info', JSON.stringify(newSales));
    if (newLogo) localStorage.setItem('honda_dealer_logo', newLogo);
    localStorage.setItem('honda_dealer_name', newName);
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
          products={products} promos={promos} salesInfo={salesInfo} 
          onUpdateProducts={handleUpdateCatalog} onUpdatePromos={handleUpdatePromos} 
          onSelectProduct={handleSelectProduct} 
        />
      );
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar 
        onNavigate={handleNavigate} currentView={selectedProduct ? 'home' : currentView} 
        logo={logo} dealerName={dealerName} onOpenSettings={() => setIsAdminOpen(true)}
      />
      <main className="flex-grow">{renderContent()}</main>
      <Footer dealerName={dealerName} salesInfo={salesInfo} />
      <FloatingContact salesInfo={salesInfo} />
      <AdminSettingsModal 
        isOpen={isAdminOpen} onClose={() => setIsAdminOpen(false)}
        salesInfo={salesInfo} products={products} promos={promos}
        logo={logo} dealerName={dealerName} onSave={handleSaveSalesSettings}
      />
    </div>
  );
};

export default App;
