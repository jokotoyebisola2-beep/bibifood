/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ChevronRight,
  ChevronDown,
  ChevronUp,
  Sparkles,
  Heart,
  ArrowRight,
  Search,
  ShoppingBag,
  Star,
  Clock,
  Smartphone,
  Send,
  CheckCircle2,
  MapPin,
  AlertCircle,
  Phone,
  Mail,
  Facebook,
  Twitter,
  Instagram,
  ShieldCheck,
  Shield,
  Check,
  Truck,
  FlameKindling,
  Soup,
  ChefHat,
  Utensils,
  Pizza,
  Beef,
  Egg,
  Cookie,
  Cake,
  Wine,
  CupSoda,
  Salad,
  Info,
  Badge,
  FileSpreadsheet,
  Upload,
  Copy,
  Award,
  ThumbsUp
} from 'lucide-react';

import { CATEGORIES, MEALS, REVIEWS, TRUST_STATS } from './data';
import { Meal, Category, Review, CartItem, Order, OrderStatus, MealAddon } from './types';

// Importing Custom Sub-components
import Header from './components/Header';
import Footer from './components/Footer';
import MealCard from './components/MealCard';
import ReviewCard from './components/ReviewCard';
import CartDrawer from './components/CartDrawer';
import FloatingCartBar from './components/FloatingCartBar';
import QuickViewModal from './components/QuickViewModal';
import AuthModal from './components/AuthModal';
import HomeView from './components/HomeView';
import BibiLogo from './components/BibiLogo';
import CartView from './components/CartView';
import CheckoutView from './components/CheckoutView';
import OrderSuccessView from './components/OrderSuccessView';
import OrderTrackingView from './components/OrderTrackingView';
import PlaceholderView from './components/PlaceholderView';
import AccountSettingsView from './components/AccountSettingsView';
import CustomerDashboardView from './components/CustomerDashboardView';
import AdminDashboardView from './components/AdminDashboardView';
import AdminLoginView from './components/AdminLoginView';
import RiderPlatformView from './components/RiderPlatformView';
import RiderAuth from './components/rider/RiderAuth';
import AccessDeniedView from './components/AccessDeniedView';
import { DeliveryAddress, RiderProfile, RiderDeliveryStage } from './types';

export default function App() {
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [currentView, setCurrentView] = useState<string>('home');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  
  // Customer Session State
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userEmail, setUserEmail] = useState('');

  // Admin Session State
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [adminEmail, setAdminEmail] = useState('');

  const [selectedMeal, setSelectedMeal] = useState<Meal | null>(null);
  const [activeDashboardTab, setActiveDashboardTab] = useState<'customer' | 'admin' | 'rider'>('customer');

  const [userProfile, setUserProfile] = useState<{
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    avatarUrl?: string | null;
    gender?: string;
    dob?: string;
    preferredContact?: 'Email' | 'SMS' | 'Push';
    addresses: DeliveryAddress[];
    notifications?: {
      orderUpdates: boolean;
      promotions: boolean;
      email: boolean;
      sms: boolean;
      push: boolean;
    };
  }>({
    firstName: 'Bibi',
    lastName: 'User',
    email: 'demo.user@bibifood.com',
    phone: '+234 803 123 4567',
    avatarUrl: null,
    gender: 'Male',
    dob: '1995-10-15',
    preferredContact: 'Email',
    addresses: [
      { id: 'addr-1', label: 'Home', street: '14 Broad Street, Marina', city: 'Lagos', phone: '+234 803 123 4567', isDefault: true },
      { id: 'addr-2', label: 'Office', street: '82 Lekki Phase 1', city: 'Lagos', phone: '+234 803 123 4567' }
    ],
    notifications: {
      orderUpdates: true,
      promotions: true,
      email: true,
      sms: true,
      push: false
    }
  });

  // Initial mount loading timer
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsInitialLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  // Home Specific States
  const [searchQuery, setSearchQuery] = useState('');
  const [addressInput, setAddressInput] = useState('');
  const [coverageChecked, setCoverageChecked] = useState<'unchecked' | 'success' | 'failed'>('unchecked');
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterSubscribed, setNewsletterSubscribed] = useState(false);
  const [activeTestimonialIdx, setActiveTestimonialIdx] = useState(0);
  const [activeFaqIdx, setActiveFaqIdx] = useState<number | null>(null);
  const [contactSubmitted, setContactSubmitted] = useState(false);

  // Menu Specific States
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [menuSearch, setMenuSearch] = useState<string>('');
  const [menuSort, setMenuSort] = useState<string>('default');

  // Checkout Specific States
  const [selectedAddressId, setSelectedAddressId] = useState<string>('addr-1');
  const [deliveryOption, setDeliveryOption] = useState<'home' | 'office' | 'pickup'>('home');
  const [specialInstructions, setSpecialInstructions] = useState('');
  const [uploadedReceipt, setUploadedReceipt] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [copiedAccount, setCopiedAccount] = useState(false);

  // Tracking Active Order & Rider States
  const [activeOrder, setActiveOrder] = useState<Order | null>(null);
  const [allOrders, setAllOrders] = useState<Order[]>([]);
  const [riderProfile, setRiderProfile] = useState<RiderProfile | null>(null);

  // Load saved cart, order, rider profile and all orders from local storage
  useEffect(() => {
    const savedCart = localStorage.getItem('bibi_cart');
    if (savedCart) setCart(JSON.parse(savedCart));

    const savedOrder = localStorage.getItem('bibi_active_order');
    if (savedOrder) setActiveOrder(JSON.parse(savedOrder));

    const savedAllOrders = localStorage.getItem('bibi_all_orders');
    if (savedAllOrders) {
      try {
        setAllOrders(JSON.parse(savedAllOrders));
      } catch (e) {
        console.error('Error parsing all orders', e);
      }
    }

    const savedRider = localStorage.getItem('bibi_rider_profile');
    if (savedRider) {
      try {
        setRiderProfile(JSON.parse(savedRider));
      } catch (e) {
        console.error('Error parsing rider profile', e);
      }
    }

    const savedProfile = localStorage.getItem('bibi_user_profile');
    if (savedProfile) {
      try {
        const parsed = JSON.parse(savedProfile);
        setUserProfile(parsed);
        setUserEmail(parsed.email);
        setIsLoggedIn(true);
      } catch (err) {
        console.error('Error parsing saved profile', err);
      }
    }

    const savedAdminSession = localStorage.getItem('bibi_admin_session');
    if (savedAdminSession) {
      try {
        const parsedAdmin = JSON.parse(savedAdminSession);
        if (parsedAdmin?.isAdminLoggedIn) {
          setIsAdminLoggedIn(true);
          setAdminEmail(parsedAdmin.adminEmail || 'admin@bibifood.ng');
        }
      } catch (err) {
        console.error('Error parsing admin session', err);
      }
    }
  }, []);

  // Handle hash change for direct router paths (e.g. #admin, #admin/login, #dashboard, #rider)
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash;
      if (hash === '#admin/login') {
        setCurrentView('admin-login');
      } else if (hash === '#admin' || hash === '#admin-dashboard') {
        setCurrentView('admin-dashboard');
      } else if (hash === '#dashboard' || hash === '#customer') {
        setCurrentView('dashboard');
      } else if (hash === '#rider' || hash === '#rider-portal') {
        setCurrentView('rider-portal');
      }
    };

    // Run on initial mount & bind to hash changes
    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Save cart changes
  const saveCart = (newCart: CartItem[]) => {
    setCart(newCart);
    localStorage.setItem('bibi_cart', JSON.stringify(newCart));
  };

  // Cart Operations
  const handleAddToCart = (
    meal: Meal,
    quantity = 1,
    specialInstructions = '',
    selectedAddons: MealAddon[] = []
  ) => {
    const addonsPrice = selectedAddons.reduce((sum, a) => sum + a.price, 0);
    const unitPrice = meal.price + addonsPrice;
    const sortedAddonIds = selectedAddons.map((a) => a.id).sort().join(',');
    const cartItemId = `${meal.id}-${sortedAddonIds}-${specialInstructions.trim()}`;

    const existingIndex = cart.findIndex((item) => (item.cartItemId || item.meal.id) === cartItemId);
    if (existingIndex > -1) {
      const updated = [...cart];
      updated[existingIndex].quantity += quantity;
      saveCart(updated);
    } else {
      saveCart([
        ...cart,
        {
          cartItemId,
          meal,
          quantity,
          specialInstructions,
          selectedAddons,
          unitPrice
        }
      ]);
    }
  };

  const handleUpdateQuantity = (cartKey: string, quantity: number) => {
    if (quantity <= 0) {
      handleRemoveItem(cartKey);
      return;
    }
    const updated = cart.map((item) =>
      (item.cartItemId || item.meal.id) === cartKey ? { ...item, quantity } : item
    );
    saveCart(updated);
  };

  const handleRemoveItem = (cartKey: string) => {
    const updated = cart.filter((item) => (item.cartItemId || item.meal.id) !== cartKey);
    saveCart(updated);
  };

  // Login action callback
  const handleLoginSuccess = (email: string, profileData?: any) => {
    setIsLoggedIn(true);
    setUserEmail(email);
    const updated = {
      ...userProfile,
      ...profileData,
      email: email
    };
    setUserProfile(updated);
    localStorage.setItem('bibi_user_profile', JSON.stringify(updated));
    localStorage.setItem('bibi_addresses', JSON.stringify(updated.addresses));
  };

  // Coverage checking action
  const handleCoverageCheck = (e: React.FormEvent) => {
    e.preventDefault();
    if (!addressInput.trim()) return;

    // Simulate coverage check based on keyword presence for fun realism
    const cleanAddress = addressInput.toLowerCase();
    if (cleanAddress.includes('lagos') || cleanAddress.includes('abuja') || cleanAddress.includes('port') || cleanAddress.length > 5) {
      setCoverageChecked('success');
      setTimeout(() => {
        setCurrentView('menu');
      }, 1000);
    } else {
      setCoverageChecked('failed');
    }
  };

  // Newsletter action
  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail.trim() || !newsletterEmail.includes('@')) return;
    setNewsletterSubscribed(true);
    setTimeout(() => {
      setNewsletterEmail('');
    }, 3000);
  };

  // Map Category Icons to Lucide Components dynamically
  const renderCategoryIcon = (iconName: string) => {
    switch (iconName) {
      case 'Soup': return <Soup size={18} />;
      case 'FlameKindling': return <FlameKindling size={18} />;
      case 'ChefHat': return <ChefHat size={18} />;
      case 'Utensils': return <Utensils size={18} />;
      case 'Pizza': return <Pizza size={18} />;
      case 'Beef': return <Beef size={18} />;
      case 'Egg': return <Egg size={18} />;
      case 'Cookie': return <Cookie size={18} />;
      case 'Cake': return <Cake size={18} />;
      case 'Wine': return <Wine size={18} />;
      case 'CupSoda': return <CupSoda size={18} />;
      case 'Salad': return <Salad size={18} />;
      default: return <Utensils size={18} />;
    }
  };

  // Quick View helper
  const handleQuickView = (meal: Meal) => {
    setSelectedMeal(meal);
  };

  // Proceed from Drawer to the premium Cart Page
  const handleProceedToCartPage = () => {
    setIsCartOpen(false);
    setCurrentView('cart');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Proceed from Cart to Checkout
  const handleProceedToCheckout = () => {
    setIsCartOpen(false);
    if (!isLoggedIn) {
      setIsAuthOpen(true);
    } else {
      setCurrentView('checkout');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Order submission handler
  const handleOrderSubmitted = (orderData: Partial<Order>) => {
    const orderId = 'BIBI-' + Math.floor(100000 + Math.random() * 900000);
    const newOrder: Order = {
      id: orderId,
      items: orderData.items || cart,
      status: 'pending_payment',
      riderStage: 'new_order',
      totalAmount: orderData.totalAmount || 0,
      deliveryOption: orderData.deliveryOption || 'home_delivery',
      address: orderData.address || 'Central Kitchen: 14 Broad Street, Marina, Lagos',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      verificationPin: Math.floor(1000 + Math.random() * 9000).toString(),
      cookingInstructions: orderData.cookingInstructions,
      allergyNotes: orderData.allergyNotes,
      deliveryInstructions: orderData.deliveryInstructions,
      scheduledTime: orderData.scheduledTime,
      paymentMethod: orderData.paymentMethod,
      subtotal: orderData.subtotal,
      deliveryFee: orderData.deliveryFee,
      serviceFee: orderData.serviceFee,
      discount: orderData.discount,
      estimatedEarnings: Math.round((orderData.deliveryFee || 1500) * 0.85),
      estimatedDistanceKm: 3.4,
      pickupRestaurantName: 'Bibi Central Kitchen - Victoria Island',
      pickupAddress: '18 Ahmadu Bello Way, Victoria Island',
      customerName: `${userProfile.firstName} ${userProfile.lastName}`,
      customerPhone: userProfile.phone || '+234 803 123 4567'
    };

    setActiveOrder(newOrder);
    setAllOrders((prev) => {
      const updated = [newOrder, ...prev];
      localStorage.setItem('bibi_all_orders', JSON.stringify(updated));
      return updated;
    });
    localStorage.setItem('bibi_active_order', JSON.stringify(newOrder));
    saveCart([]); // Clear the cart
    setCurrentView('success'); // Land on order success confirmation screen first
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Update order status from rider platform or tracking screen
  const handleUpdateOrderStatus = (status: OrderStatus) => {
    if (!activeOrder) return;
    const updated = { ...activeOrder, status };
    setActiveOrder(updated);
    localStorage.setItem('bibi_active_order', JSON.stringify(updated));
    setAllOrders((prev) => {
      const newList = prev.map((o) => (o.id === updated.id ? updated : o));
      localStorage.setItem('bibi_all_orders', JSON.stringify(newList));
      return newList;
    });
  };

  // Rider specific order update handler
  const handleRiderOrderUpdate = (
    orderId: string,
    status: OrderStatus,
    riderStage?: RiderDeliveryStage,
    riderDetails?: { riderId: string; riderName: string; riderPhone: string }
  ) => {
    setAllOrders((prev) => {
      const updated = prev.map((o) => {
        if (o.id === orderId) {
          return {
            ...o,
            status,
            riderStage: riderStage || o.riderStage,
            ...(riderDetails ? {
              riderId: riderDetails.riderId,
              riderName: riderDetails.riderName,
              riderPhone: riderDetails.riderPhone
            } : {})
          };
        }
        return o;
      });
      localStorage.setItem('bibi_all_orders', JSON.stringify(updated));
      return updated;
    });

    if (activeOrder && activeOrder.id === orderId) {
      const updatedActive = {
        ...activeOrder,
        status,
        riderStage: riderStage || activeOrder.riderStage,
        ...(riderDetails ? {
          riderId: riderDetails.riderId,
          riderName: riderDetails.riderName,
          riderPhone: riderDetails.riderPhone
        } : {})
      };
      setActiveOrder(updatedActive);
      localStorage.setItem('bibi_active_order', JSON.stringify(updatedActive));
    }
  };

  // Cancel order handler
  const handleCancelOrder = () => {
    if (!activeOrder) return;
    const updated = { ...activeOrder, status: 'canceled' as OrderStatus };
    setActiveOrder(updated);
    localStorage.setItem('bibi_active_order', JSON.stringify(updated));
  };

  // Active Simulated Tracking steps state controller (Automatic progression fallback)
  useEffect(() => {
    if (!activeOrder || activeOrder.status === 'canceled' || activeOrder.status === 'delivered') return;

    const statuses: OrderStatus[] = ['pending_payment', 'preparing', 'in_transit', 'delivered'];
    let currentIndex = statuses.indexOf(activeOrder.status);

    if (currentIndex === -1 || currentIndex === statuses.length - 1) return;

    const interval = setInterval(() => {
      currentIndex += 1;
      const nextStatus = statuses[currentIndex];
      const updatedOrder = { ...activeOrder, status: nextStatus };
      setActiveOrder(updatedOrder);
      localStorage.setItem('bibi_active_order', JSON.stringify(updatedOrder));
    }, 45000);

    return () => clearInterval(interval);
  }, [activeOrder]);

  return (
    <AnimatePresence mode="wait">
      {isInitialLoading ? (
        <motion.div
          key="loading-screen"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5, ease: 'easeInOut' }}
          className="fixed inset-0 bg-[#FAF8F5] z-[9999] flex flex-col items-center justify-center gap-6"
        >
          <div className="relative flex flex-col items-center">
            {/* Soft pulse glow behind the logo */}
            <div className="absolute w-40 h-40 bg-[#C62828]/10 rounded-full blur-xl animate-pulse" />
            
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: [0.8, 1.05, 1], opacity: 1 }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
              className="z-10"
            >
              <BibiLogo mode="icon" className="h-16 w-16" />
            </motion.div>
          </div>

          {/* Elegant geometric line loading bar */}
          <div className="w-48 h-1 bg-slate-200 rounded-full overflow-hidden relative">
            <motion.div
              initial={{ left: '-100%' }}
              animate={{ left: '100%' }}
              transition={{ repeat: Infinity, duration: 1.5, ease: 'easeInOut' }}
              className="absolute top-0 bottom-0 w-1/2 bg-gradient-to-r from-brand-chili via-brand-saffron to-brand-chili"
            />
          </div>
          
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 1, 0.8] }}
            transition={{ delay: 0.3, duration: 1 }}
            className="font-mono text-[9px] text-slate-400 uppercase tracking-widest font-bold"
          >
            Mathematical Gastronomy Engine
          </motion.p>
        </motion.div>
      ) : (
        <div className="min-h-screen bg-[#FAF8F5] flex flex-col justify-between">
      
      {/* Global Navbar Header */}
      <Header
        currentView={currentView}
        onNavigate={(view) => {
          if (view === 'admin-direct') {
            setIsLoggedIn(true);
            setUserEmail('admin@bibifood.ng');
            setCurrentView('dashboard');
            setActiveDashboardTab('admin');
            window.location.hash = '#admin';
          } else if (view === 'admin-login') {
            setCurrentView('admin-login');
            window.location.hash = '#admin/login';
          } else {
            setCurrentView(view);
            if (window.location.hash.startsWith('#admin')) {
              window.location.hash = '';
            }
          }
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        cartCount={cart.reduce((acc, item) => acc + item.quantity, 0)}
        onCartToggle={() => setIsCartOpen(!isCartOpen)}
        onAuthToggle={() => {
          if (isLoggedIn) {
            setCurrentView('dashboard');
          } else {
            setIsAuthOpen(true);
          }
        }}
        isLoggedIn={isLoggedIn}
        userEmail={userEmail}
      />

      {/* Main Page Layout Content Router */}
      <main className="pt-24 flex-1">
        <AnimatePresence mode="wait">
          
          {/* ========================================================== */}
          {/* VIEW: HOME PAGE                                            */}
          {/* ========================================================== */}
          {currentView === 'home' && (
            <HomeView
              addressInput={addressInput}
              setAddressInput={setAddressInput}
              coverageChecked={coverageChecked}
              handleCoverageCheck={handleCoverageCheck}
              newsletterEmail={newsletterEmail}
              setNewsletterEmail={setNewsletterEmail}
              newsletterSubscribed={newsletterSubscribed}
              handleNewsletterSubmit={handleNewsletterSubmit}
              handleAddToCart={handleAddToCart}
              handleQuickView={handleQuickView}
              setActiveCategory={setActiveCategory}
              setCurrentView={setCurrentView}
              menuSearch={menuSearch}
              setMenuSearch={setMenuSearch}
            />
          )}

          {/* ========================================================== */}
          {/* VIEW: INTERACTIVE MENU                                     */}
          {/* ========================================================== */}
          {currentView === 'menu' && (
            <motion.div
              key="menu-view"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="w-full max-w-7xl mx-auto px-4 md:px-8 py-12"
            >
              
              {/* Menu Title Block */}
              <div className="text-center md:text-left mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-brand-olive/5">
                <div>
                  <h1 className="font-display font-bold text-3xl text-brand-olive">
                    Our Curated Gastronomy Menu
                  </h1>
                  <p className="font-sans text-xs text-slate-400 mt-1">
                    Prepared daily with pristine local organic ingredients under certified chef-grade standards.
                  </p>
                </div>

                {/* Inline menu filters search */}
                <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto max-w-md">
                  <div className="relative flex-1">
                    <input
                      type="text"
                      placeholder="Search culinary items..."
                      value={menuSearch}
                      onChange={(e) => setMenuSearch(e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded-xl py-2 px-3 pl-9 text-xs font-sans focus:outline-none focus:border-brand-olive"
                    />
                    <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  </div>

                  <select
                    value={menuSort}
                    onChange={(e) => setMenuSort(e.target.value)}
                    className="bg-white border border-slate-200 rounded-xl py-2 px-3 text-xs font-sans text-slate-600 focus:outline-none focus:border-brand-olive"
                  >
                    <option value="default">Default Sorting</option>
                    <option value="price-low">Price: Low to High</option>
                    <option value="price-high">Price: High to Low</option>
                    <option value="rating">Top Rated</option>
                  </select>
                </div>
              </div>

              {/* Category Pills horizontal scroller bar */}
              <div className="flex gap-2.5 overflow-x-auto pb-4 mb-8 scrollbar-none">
                <button
                  onClick={() => setActiveCategory('all')}
                  className={`py-2 px-5 rounded-full font-sans text-xs font-semibold cursor-pointer shrink-0 transition-all border ${
                    activeCategory === 'all'
                      ? 'bg-brand-olive border-brand-olive text-brand-saffron shadow-sm'
                      : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  All Items
                </button>
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setActiveCategory(cat.slug)}
                    className={`py-2 px-5 rounded-full font-sans text-xs font-semibold cursor-pointer shrink-0 transition-all border ${
                      activeCategory === cat.slug
                        ? 'bg-brand-olive border-brand-olive text-brand-saffron shadow-sm'
                        : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    {cat.name}
                  </button>
                ))}
              </div>

              {/* Dynamic menu items layout builder */}
              {(() => {
                // Smart search filtering with multi-token partial matching across name, description, ingredients, restaurant, category
                const searchTerms = menuSearch.trim().toLowerCase().split(/\s+/).filter(Boolean);

                let filtered = MEALS.filter((meal) => {
                  const categoryObj = CATEGORIES.find(c => c.slug === meal.category);
                  const categoryName = categoryObj ? categoryObj.name.toLowerCase() : '';
                  
                  const searchableText = [
                    meal.name,
                    meal.description,
                    meal.category,
                    categoryName,
                    meal.restaurant || '',
                    meal.calories || '',
                    ...(meal.ingredients || []),
                  ].join(' ').toLowerCase();

                  const matchSearch = searchTerms.length === 0 || searchTerms.every(term => searchableText.includes(term));
                  const matchCategory = activeCategory === 'all' || meal.category === activeCategory;
                  return matchSearch && matchCategory;
                });

                // Sort meals
                if (menuSort === 'price-low') {
                  filtered = [...filtered].sort((a, b) => a.price - b.price);
                } else if (menuSort === 'price-high') {
                  filtered = [...filtered].sort((a, b) => b.price - a.price);
                } else if (menuSort === 'rating') {
                  filtered = [...filtered].sort((a, b) => b.rating - a.rating);
                }

                if (filtered.length === 0) {
                  return (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-center py-20 px-4 flex flex-col items-center gap-4 bg-white/70 backdrop-blur-sm border border-slate-200/80 rounded-3xl max-w-xl mx-auto shadow-sm"
                    >
                      <div className="w-16 h-16 rounded-2xl bg-amber-50 text-amber-600 border border-amber-100 flex items-center justify-center shadow-inner">
                        <Utensils size={30} />
                      </div>
                      <div>
                        <h3 className="font-display font-bold text-lg text-brand-olive">
                          {menuSearch ? `No results for "${menuSearch}"` : 'No items match your selected filters'}
                        </h3>
                        <p className="font-sans text-xs text-slate-500 mt-1.5 leading-relaxed max-w-md mx-auto">
                          We couldn't find any dishes matching your criteria. Try searching for popular items like <span className="font-semibold text-brand-olive">"Jollof"</span>, <span className="font-semibold text-brand-olive">"Pepper Soup"</span>, <span className="font-semibold text-brand-olive">"Shawarma"</span>, <span className="font-semibold text-brand-olive">"Burger"</span>, or <span className="font-semibold text-brand-olive">"Suya"</span>.
                        </p>
                      </div>

                      <div className="flex flex-wrap items-center justify-center gap-2 mt-2">
                        {['All Items', 'Soup', 'Swallow', 'Rice', 'Breakfast', 'Drinks'].map((pillCat) => (
                          <button
                            key={pillCat}
                            onClick={() => {
                              setMenuSearch('');
                              setActiveCategory(pillCat === 'All Items' ? 'all' : pillCat.toLowerCase().replace(/\s+/g, '-'));
                            }}
                            className="bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-sans font-semibold py-1.5 px-3.5 rounded-full transition-colors cursor-pointer"
                          >
                            Explore {pillCat}
                          </button>
                        ))}
                      </div>

                      <button
                        onClick={() => {
                          setMenuSearch('');
                          setActiveCategory('all');
                        }}
                        className="mt-3 bg-brand-olive text-brand-saffron hover:bg-[#131E18] py-2.5 px-6 rounded-xl font-display font-bold text-xs transition-colors cursor-pointer shadow-sm"
                      >
                        Reset All Filters
                      </button>
                    </motion.div>
                  );
                }

                return (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {filtered.map((meal) => (
                      <MealCard
                        key={meal.id}
                        meal={meal}
                        onAddToCart={handleAddToCart}
                        onQuickView={handleQuickView}
                      />
                    ))}
                  </div>
                );
              })()}

            </motion.div>
          )}

          {/* ========================================================== */}
          {/* VIEW: ABOUT US                                             */}
          {/* ========================================================== */}
          {currentView === 'about' && (
            <motion.div
              key="about-view"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="w-full max-w-3xl mx-auto px-4 py-12"
            >
              <span className="font-mono text-[9px] font-bold text-slate-400 uppercase tracking-widest block mb-1">
                Our Philosophy
              </span>
              <h1 className="font-display font-bold text-3xl text-brand-olive mb-6">
                Redefining Food Tech Mechanics
              </h1>
              
              <div className="prose prose-slate font-sans text-sm text-slate-600 leading-relaxed flex flex-col gap-6">
                <p>
                  Bibi Food was founded on a simple, uncompromising premise: that controlling the entire food delivery ecosystem—from farm procurement to custom thermal doorstep delivery—yields a vastly superior customer experience compared to open market aggregation.
                </p>
                <p>
                  By bypassing the traditional marketplace, we avoid the chaos of unverified kitchens, erratic pricing matrices, and uncoordinated dispatch couriers. Every single item listed on our app is conceptualized, tested, and prepped inside our private state-of-the-art dark kitchens under certified sanitary parameters.
                </p>
                <div className="my-6 p-6 bg-white border border-brand-olive/5 rounded-3xl flex flex-col gap-3">
                  <h4 className="font-display font-semibold text-sm text-brand-olive uppercase tracking-wider">
                    Our Culinary Pledges:
                  </h4>
                  <ul className="list-disc list-inside flex flex-col gap-2 text-xs">
                    <li>Smoked thermal delivery guarantee (blazing hot or perfectly chilled)</li>
                    <li>Sourced 100% locally from organic partner farms</li>
                    <li>Strict zero-additive hygiene policies across prep cycles</li>
                    <li>Fixed delivery windows computed dynamically by dispatch algorithms</li>
                  </ul>
                </div>
              </div>
            </motion.div>
          )}

          {/* ========================================================== */}
          {/* VIEW: FAQs                                                 */}
          {/* ========================================================== */}
          {currentView === 'faq' && (
            <motion.div
              key="faq-view"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="w-full max-w-3xl mx-auto px-4 py-12"
            >
              <span className="font-mono text-[9px] font-bold text-slate-400 uppercase tracking-widest block mb-1">
                Help Desk
              </span>
              <h1 className="font-display font-bold text-3xl text-brand-olive mb-8">
                Frequently Answered Queries
              </h1>

              {/* Interactive accordion wrapper */}
              <div className="flex flex-col gap-4">
                {[
                  {
                    q: "Is Bibi Food a multi-restaurant platform?",
                    a: "No. Bibi Food is a dedicated, single-brand premium food company. Every meal on our app is prepared in-house inside our own digital cloud kitchens by our executive culinary staff, ensuring perfect consistency and elite food safety."
                  },
                  {
                    q: "How does the bank transfer verification operate?",
                    a: "At checkout, you are provided with our primary bank settlement details. Simply make the bank transfer from your mobile app, capture the confirmation screenshot, and upload it in the file checkout box. Our admin team reconciles receipts instantly to release cooking tickets."
                  },
                  {
                    q: "What is the average delivery timing?",
                    a: "Our historical average door-to-door delivery transit timing sits at 35 minutes across all active city operations sectors."
                  },
                  {
                    q: "Do you support custom office catering?",
                    a: "Yes. For corporate bulk event allocations or custom group meals lists, please utilize the contact assistance form to speak directly with our kitchen administration teams."
                  }
                ].map((faq, idx) => (
                  <div key={idx} className="bg-white rounded-2xl border border-brand-olive/5 p-5 shadow-sm">
                    <h4 className="font-display font-semibold text-sm text-brand-olive">
                      {faq.q}
                    </h4>
                    <p className="font-sans text-xs text-slate-500 mt-2 leading-relaxed">
                      {faq.a}
                    </p>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* ========================================================== */}
          {/* VIEW: CONTACT                                              */}
          {/* ========================================================== */}
          {currentView === 'contact' && (
            <motion.div
              key="contact-view"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="w-full max-w-3xl mx-auto px-4 py-12"
            >
              <span className="font-mono text-[9px] font-bold text-slate-400 uppercase tracking-widest block mb-1">
                Get In Touch
              </span>
              <h1 className="font-display font-bold text-3xl text-brand-olive mb-6">
                Culinary Support & Assistance
              </h1>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-4">
                
                {/* Contact form block */}
                {contactSubmitted ? (
                  <motion.div
                    initial={{ scale: 0.95, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="bg-white p-8 rounded-3xl border border-brand-olive/5 shadow-md flex flex-col items-center justify-center text-center gap-4 min-h-[350px]"
                  >
                    <div className="w-16 h-16 rounded-full bg-brand-basil/10 text-brand-basil flex items-center justify-center shadow-inner">
                      <CheckCircle2 size={32} className="text-brand-basil" />
                    </div>
                    <div>
                      <h3 className="font-display font-black text-lg text-brand-charcoal mb-1">Inquiry Dispatched</h3>
                      <p className="font-sans text-xs text-slate-500 max-w-sm leading-relaxed">
                        Your message has been sent successfully! Our customer operations team will correspond via email under five minutes.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setContactSubmitted(false)}
                      className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-display font-bold py-2.5 px-6 rounded-xl text-[10px] uppercase tracking-wider cursor-pointer transition-colors"
                    >
                      Send Another Message
                    </button>
                  </motion.div>
                ) : (
                  <form onSubmit={(e) => { e.preventDefault(); setContactSubmitted(true); }} className="bg-white p-6 rounded-3xl border border-brand-olive/5 shadow-sm flex flex-col gap-4">
                    <div>
                      <label className="block font-sans text-xs font-semibold text-brand-olive mb-1">Full Name</label>
                      <input type="text" required className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-sans focus:outline-none focus:border-brand-olive focus:bg-white" />
                    </div>
                    <div>
                      <label className="block font-sans text-xs font-semibold text-brand-olive mb-1">Email Address</label>
                      <input type="email" required className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-sans focus:outline-none focus:border-brand-olive focus:bg-white" />
                    </div>
                    <div>
                      <label className="block font-sans text-xs font-semibold text-brand-olive mb-1">Assistance Domain</label>
                      <select className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs font-sans focus:outline-none focus:border-brand-olive">
                        <option>General Inquiries</option>
                        <option>Corporate Group Orders</option>
                        <option>Rider Partnership Onboarding</option>
                        <option>Feedback & Suggestions</option>
                      </select>
                    </div>
                    <div>
                      <label className="block font-sans text-xs font-semibold text-brand-olive mb-1">Message Detail</label>
                      <textarea required className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-sans focus:outline-none focus:border-brand-olive focus:bg-white h-24 resize-none" />
                    </div>

                    <button type="submit" className="w-full bg-brand-olive text-brand-saffron hover:bg-[#131E18] py-3.5 rounded-xl font-display font-semibold text-xs transition-colors shadow-sm cursor-pointer">
                      Submit Inquiry
                    </button>
                  </form>
                )}

                {/* Contact detail details */}
                <div className="flex flex-col gap-6 font-sans text-xs text-slate-500">
                  <div>
                    <h4 className="font-display font-semibold text-sm text-brand-olive mb-2">Corporate Office</h4>
                    <p className="leading-relaxed">Bibi Food HQ Complex, Plot 14 Broad Street, Victoria Island, Lagos, Nigeria.</p>
                  </div>
                  <div>
                    <h4 className="font-display font-semibold text-sm text-brand-olive mb-2">Support Coordinates</h4>
                    <p className="font-mono text-slate-700 font-medium">Email: care@bibifood.com</p>
                    <p className="font-mono text-slate-700 font-medium mt-1">Phone: +234 (0) 800-BIBI-FOOD</p>
                  </div>
                  <div className="p-4 bg-brand-olive/5 border border-brand-olive/5 rounded-2xl">
                    <h5 className="font-display font-semibold text-brand-olive text-xs mb-1">Feedback Loop</h5>
                    <p className="leading-normal">We read every single feedback. Standard processing times for refund analysis and receipts validation sits at under 12 hours.</p>
                  </div>
                </div>

              </div>
            </motion.div>
          )}

          {/* ========================================================== */}
          {/* VIEW: PREMIUM CART PAGE                                    */}
          {/* ========================================================== */}
          {currentView === 'cart' && (
            <CartView
              cartItems={cart}
              onUpdateQuantity={handleUpdateQuantity}
              onRemoveItem={handleRemoveItem}
              onProceedToCheckout={handleProceedToCheckout}
              onNavigate={(view) => {
                setCurrentView(view);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            />
          )}

          {/* ========================================================== */}
          {/* VIEW: SECURE BANK CHECKOUT                                 */}
          {/* ========================================================== */}
          {currentView === 'checkout' && (
            <CheckoutView
              cartItems={cart}
              userEmail={userEmail}
              onSubmitOrder={handleOrderSubmitted}
              onNavigate={(view) => {
                setCurrentView(view);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            />
          )}

          {/* ========================================================== */}
          {/* VIEW: ORDER SUCCESS CONFIRMATION                           */}
          {/* ========================================================== */}
          {currentView === 'success' && activeOrder && (
            <OrderSuccessView
              order={activeOrder}
              onNavigate={(view) => {
                setCurrentView(view);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            />
          )}

          {/* ========================================================== */}
          {/* VIEW: ORDER TRACKING CONSOLE                               */}
          {/* ========================================================== */}
          {currentView === 'track' && (
            <div className="w-full">
              {activeOrder ? (
                <OrderTrackingView
                  order={activeOrder}
                  onUpdateStatus={handleUpdateOrderStatus}
                  onCancelOrder={handleCancelOrder}
                  onNavigate={(view) => {
                    setCurrentView(view);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                />
              ) : (
                <div className="text-center py-24 flex flex-col items-center gap-4">
                  <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
                    <Truck size={28} />
                  </div>
                  <div>
                    <h3 className="font-display font-semibold text-base text-brand-olive">No active orders</h3>
                    <p className="font-sans text-xs text-slate-400 mt-1 max-w-xs mx-auto">
                      Place an order through the menu and checkout to initialize the real-time tracking dashboard.
                    </p>
                  </div>
                  <button
                    onClick={() => setCurrentView('menu')}
                    className="bg-brand-olive text-brand-saffron hover:bg-brand-saffron hover:text-brand-olive py-2.5 px-6 rounded-xl font-display font-semibold text-xs transition-colors cursor-pointer"
                  >
                    Go Order Now
                  </button>
                </div>
              )}
            </div>
          )}

          {/* ========================================================== */}
          {/* VIEW: ADMIN LOGIN PAGE                                     */}
          {/* ========================================================== */}
          {currentView === 'admin-login' && (
            isAdminLoggedIn ? (
              <AdminDashboardView
                activeOrder={activeOrder}
                setActiveOrder={setActiveOrder}
                onNavigate={(view) => {
                  setCurrentView(view);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                onLogout={() => {
                  setIsAdminLoggedIn(false);
                  setAdminEmail('');
                  localStorage.removeItem('bibi_admin_session');
                  setCurrentView('home');
                  window.location.hash = '';
                }}
              />
            ) : (
              <AdminLoginView
                onLoginSuccess={(email) => {
                  setIsAdminLoggedIn(true);
                  setAdminEmail(email);
                  localStorage.setItem('bibi_admin_session', JSON.stringify({ isAdminLoggedIn: true, adminEmail: email }));
                  setCurrentView('admin-dashboard');
                  window.location.hash = '#admin';
                }}
                onNavigate={(view) => {
                  if (view === 'home') {
                    window.location.hash = '';
                  }
                  setCurrentView(view);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
              />
            )
          )}

          {/* ========================================================== */}
          {/* VIEW: ADMIN DASHBOARD (RESTRICTED TO ADMIN ONLY)           */}
          {/* ========================================================== */}
          {currentView === 'admin-dashboard' && (
            isAdminLoggedIn ? (
              <AdminDashboardView
                activeOrder={activeOrder}
                setActiveOrder={setActiveOrder}
                onNavigate={(view) => {
                  setCurrentView(view);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                onLogout={() => {
                  setIsAdminLoggedIn(false);
                  setAdminEmail('');
                  localStorage.removeItem('bibi_admin_session');
                  setCurrentView('home');
                  window.location.hash = '';
                }}
              />
            ) : (
              <AccessDeniedView
                roleName="Administrator"
                description="This page is restricted to authorized Bibi Food Administrators only. Please log in with your admin account to continue."
                onLoginClick={() => {
                  setCurrentView('admin-login');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                onHomeClick={() => {
                  setCurrentView('home');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
              />
            )
          )}

          {/* ========================================================== */}
          {/* VIEW: CUSTOMER DASHBOARD (RESTRICTED TO CUSTOMER ONLY)     */}
          {/* ========================================================== */}
          {currentView === 'dashboard' && (
            isLoggedIn ? (
              <div className="w-full max-w-7xl mx-auto px-4 py-8">
                <CustomerDashboardView
                  userProfile={userProfile}
                  onSaveProfile={setUserProfile}
                  onLogout={() => {
                    setIsLoggedIn(false);
                    setUserEmail('');
                    localStorage.removeItem('bibi_user_profile');
                    setCurrentView('home');
                  }}
                  onNavigate={(view) => {
                    setCurrentView(view);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  activeOrder={activeOrder}
                  onAddToCart={handleAddToCart}
                  cart={cart}
                />
              </div>
            ) : (
              <AccessDeniedView
                roleName="Customer"
                description="Please sign in to your customer account to view your dashboard, account details, and active orders."
                onLoginClick={() => {
                  setIsAuthOpen(true);
                }}
                onHomeClick={() => {
                  setCurrentView('home');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
              />
            )
          )}

          {/* ========================================================== */}
          {/* VIEW: ACCOUNT SETTINGS VIEW                                */}
          {/* ========================================================== */}
          {currentView === 'settings' && (
            <motion.div
              key="settings-view"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
            >
              <AccountSettingsView
                userProfile={userProfile}
                onSaveProfile={(updated) => {
                  setUserProfile(updated);
                  localStorage.setItem('bibi_user_profile', JSON.stringify(updated));
                  localStorage.setItem('bibi_addresses', JSON.stringify(updated.addresses));
                }}
                onLogout={() => {
                  setIsLoggedIn(false);
                  setUserEmail('');
                  localStorage.removeItem('bibi_user_profile');
                  setCurrentView('home');
                }}
                onNavigate={(view) => {
                  setCurrentView(view);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
              />
            </motion.div>
          )}

          {/* ========================================================== */}
          {/* VIEW: RIDER LOGISTICS PLATFORM                             */}
          {/* ========================================================== */}
          {(currentView === 'rider-portal' || currentView === 'rider') && (
            <motion.div
              key="rider-view"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="w-full"
            >
              {!riderProfile ? (
                <RiderAuth
                  onLoginSuccess={(r) => {
                    setRiderProfile(r);
                    localStorage.setItem('bibi_rider_profile', JSON.stringify(r));
                  }}
                  onNavigateCustomerHome={() => {
                    setCurrentView('home');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                />
              ) : (
                <RiderPlatformView
                  rider={riderProfile}
                  orders={allOrders}
                  onUpdateOrderStatus={handleRiderOrderUpdate}
                  onLogoutRider={() => {
                    setRiderProfile(null);
                    localStorage.removeItem('bibi_rider_profile');
                  }}
                  onNavigateCustomerHome={() => {
                    setCurrentView('home');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                />
              )}
            </motion.div>
          )}

          {/* ========================================================== */}
          {/* VIEW: PLACEHOLDER FOR DEVELOPMENT PAGES                    */}
          {/* ========================================================== */}
          {!['home', 'menu', 'about', 'faq', 'contact', 'cart', 'checkout', 'success', 'track', 'dashboard', 'settings', 'admin-login', 'rider-portal', 'rider'].includes(currentView) && (
            <PlaceholderView
              viewId={currentView}
              onNavigate={(view) => {
                setCurrentView(view);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            />
          )}

        </AnimatePresence>
      </main>

      {/* Global Footer component */}
      <Footer
        onNavigate={(view) => {
          if (view === 'admin-direct') {
            setIsLoggedIn(true);
            setUserEmail('admin@bibifood.ng');
            setCurrentView('dashboard');
            setActiveDashboardTab('admin');
            window.location.hash = '#admin';
          } else if (view === 'admin-login') {
            setCurrentView('admin-login');
            window.location.hash = '#admin/login';
          } else {
            setCurrentView(view);
            if (window.location.hash.startsWith('#admin')) {
              window.location.hash = '';
            }
          }
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />

      {/* Persistent Floating Cart Bar across non-checkout pages */}
      {!['cart', 'checkout', 'success', 'track', 'admin-login', 'dashboard', 'rider-portal', 'rider'].includes(currentView) && (
        <FloatingCartBar
          cart={cart}
          onOpenCartPage={() => {
            setCurrentView('cart');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          onOpenCartDrawer={() => setIsCartOpen(true)}
        />
      )}

      {/* Sliding shopping cart list drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cart}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onProceedToCheckout={handleProceedToCartPage}
      />

      {/* Meal Quick View inspection modal overlay */}
      <QuickViewModal
        meal={selectedMeal}
        onClose={() => setSelectedMeal(null)}
        onAddToCart={handleAddToCart}
      />

      {/* Unified account login credentials modal panel */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onLoginSuccess={handleLoginSuccess}
      />

        </div>
      )}
    </AnimatePresence>
  );
}
