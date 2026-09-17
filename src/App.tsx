import React, { lazy, Suspense, useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { CartDrawer } from './components/CartDrawer';
import { AuthModal } from './components/AuthModal';
import { QuickPriceModal } from './components/QuickPriceModal';
import { Product, Category, Order } from './types';

const HomePage = lazy(() => import('./pages/HomePage').then(({ HomePage }) => ({ default: HomePage })));
const ShopPage = lazy(() => import('./pages/ShopPage').then(({ ShopPage }) => ({ default: ShopPage })));
const ProductDetailPage = lazy(() => import('./pages/ProductDetailPage').then(({ ProductDetailPage }) => ({ default: ProductDetailPage })));
const CustomCakePage = lazy(() => import('./pages/CustomCakePage').then(({ CustomCakePage }) => ({ default: CustomCakePage })));
const CheckoutPage = lazy(() => import('./pages/CheckoutPage').then(({ CheckoutPage }) => ({ default: CheckoutPage })));
const OrderTrackingPage = lazy(() => import('./pages/OrderTrackingPage').then(({ OrderTrackingPage }) => ({ default: OrderTrackingPage })));
const AboutPage = lazy(() => import('./pages/AboutPage').then(({ AboutPage }) => ({ default: AboutPage })));
const ContactPage = lazy(() => import('./pages/ContactPage').then(({ ContactPage }) => ({ default: ContactPage })));
const CateringPage = lazy(() => import('./pages/CateringPage').then(({ CateringPage }) => ({ default: CateringPage })));
const AccountPage = lazy(() => import('./pages/AccountPage').then(({ AccountPage }) => ({ default: AccountPage })));
const AdminDashboard = lazy(() => import('./pages/AdminDashboard').then(({ AdminDashboard }) => ({ default: AdminDashboard })));

function BakeryApp() {
  const { user, openAuthModal, isAdmin } = useAuth();
  const [activeView, setActiveView] = useState<string>('home');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [activeTrackingOrder, setActiveTrackingOrder] = useState<Order | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  useEffect(() => {
    fetchStoreData();
  }, []);

  const fetchStoreData = async () => {
    setIsLoading(true);
    try {
      const [prodRes, catRes] = await Promise.all([
        fetch('/api/products').then(r => r.json()),
        fetch('/api/categories').then(r => r.json())
      ]);

      if (Array.isArray(prodRes)) {
        setProducts(prodRes);
      }
      if (Array.isArray(catRes)) {
        setCategories(catRes);
      }
    } catch (err) {
      console.error('Failed to fetch initial products', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectProduct = (product: Product) => {
    setSelectedProduct(product);
    setActiveView('product-detail');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNavigate = (view: string, param?: any) => {
    if (view === 'checkout' && !user) {
      openAuthModal('order_required');
      return;
    }
    if (view === 'admin' && (!user || (user.role !== 'admin' && user.role !== 'staff'))) {
      openAuthModal('admin_required');
      return;
    }
    if (param?.category) {
      setActiveCategory(param.category);
    }
    setActiveView(view);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOrderCompleted = (order: Order) => {
    setActiveTrackingOrder(order);
    setActiveView('tracking');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF7F2] text-[#1E1814] font-sans antialiased selection:bg-[#DEB346] selection:text-[#181310]">
      {/* Top Main Navigation Header */}
      <Header
        activeView={activeView}
        onNavigate={(view) => handleNavigate(view)}
        onOpenCart={() => {}}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        <Suspense fallback={
          <div className="min-h-[50vh] flex items-center justify-center">
            <div className="w-12 h-12 rounded-full border-4 border-[#E2D8C9] border-t-[#DEB346] animate-spin" />
          </div>
        }>
          {isLoading && products.length === 0 ? (
          <div className="min-h-[50vh] flex flex-col items-center justify-center space-y-3">
            <div className="w-12 h-12 rounded-full border-4 border-[#E2D8C9] border-t-[#DEB346] animate-spin" />
            <p className="font-serif text-sm font-semibold text-[#8C7A68]">
              Warming up the ovens at YFP...
            </p>
          </div>
        ) : (
          <>
            {activeView === 'home' && (
              <HomePage
                products={products}
                categories={categories}
                onSelectProduct={handleSelectProduct}
                onNavigate={handleNavigate}
                onEditProduct={isAdmin ? (p) => setEditingProduct(p) : undefined}
              />
            )}

            {activeView === 'shop' && (
              <ShopPage
                products={products}
                categories={categories}
                initialCategory={activeCategory}
                onSelectProduct={handleSelectProduct}
                onEditProduct={isAdmin ? (p) => setEditingProduct(p) : undefined}
              />
            )}

            {activeView === 'product-detail' && selectedProduct && (
              <ProductDetailPage
                product={selectedProduct}
                allProducts={products}
                onBack={() => handleNavigate('shop')}
                onSelectProduct={handleSelectProduct}
                onEditProduct={isAdmin ? (p) => setEditingProduct(p) : undefined}
              />
            )}

            {activeView === 'custom-cake' && (
              <CustomCakePage onNavigate={handleNavigate} />
            )}

            {activeView === 'checkout' && (
              <CheckoutPage
                onBackToShop={() => handleNavigate('shop')}
                onOrderCompleted={handleOrderCompleted}
              />
            )}

            {activeView === 'tracking' && (
              <OrderTrackingPage
                initialOrder={activeTrackingOrder}
                onNavigateToShop={() => handleNavigate('shop')}
              />
            )}

            {activeView === 'about' && (
              <AboutPage
                onNavigateToShop={() => handleNavigate('shop')}
                onNavigateToCustomCake={() => handleNavigate('custom-cake')}
              />
            )}

            {activeView === 'contact' && <ContactPage />}

            {activeView === 'catering' && <CateringPage />}

            {activeView === 'account' && (
              <AccountPage
                onNavigateToShop={() => handleNavigate('shop')}
                onNavigateToTracking={(order) => {
                  setActiveTrackingOrder(order);
                  setActiveView('tracking');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                allProducts={products}
                onSelectProduct={handleSelectProduct}
                onNavigateToAdmin={() => handleNavigate('admin')}
              />
            )}

            {activeView === 'admin' && (user?.role === 'admin' || user?.role === 'staff') && (
              <AdminDashboard
                products={products}
                onRefreshProducts={fetchStoreData}
                onSelectProduct={handleSelectProduct}
              />
            )}
          </>
          )}
        </Suspense>
      </main>

      {/* Slide-out Cart Drawer with Instant Coupon & Delivery Controls */}
      <CartDrawer
        onNavigateToCheckout={() => handleNavigate('checkout')}
        onNavigateToShop={() => handleNavigate('shop')}
      />

      {/* Global Bakery Footer */}
      <Footer onNavigate={(view) => handleNavigate(view)} />

      {/* Customer First-Visit / Order-Required Popout Modal */}
      <AuthModal />

      {/* Quick Price & Picture Editor Modal (Admins Only) */}
      <QuickPriceModal
        product={editingProduct}
        isOpen={Boolean(editingProduct && isAdmin)}
        onClose={() => setEditingProduct(null)}
        onSaveSuccess={(updated) => {
          setProducts((prev) =>
            prev.map((p) => (p.id === updated.id ? updated : p))
          );
          if (selectedProduct?.id === updated.id) {
            setSelectedProduct(updated);
          }
        }}
      />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <BakeryApp />
      </CartProvider>
    </AuthProvider>
  );
}
