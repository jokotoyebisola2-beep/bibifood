/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  User, MapPin, Lock, Bell, Globe, Shield, Trash2, Edit2, Plus, 
  Check, Save, Eye, EyeOff, AlertTriangle, CheckCircle2, ChevronRight,
  Smartphone, Mail, MessageSquare, Info, ShieldAlert, Sparkles, X,
  LogOut, Heart, Search, Filter, Calendar, ArrowRight, Clock, Star, 
  Download, HelpCircle, Send, Phone, Award, Gift, Share2, Copy, 
  PlusCircle, CheckCircle, MessageCircle, ShoppingBag, ThumbsUp, 
  CheckSquare, List, Percent, ChevronDown, RefreshCw, SendHorizontal
} from 'lucide-react';
import { Meal, Order, OrderStatus, DeliveryAddress, CartItem, Review } from '../types';
import { MEALS } from '../data';
import BibiLogo from './BibiLogo';

interface CustomerDashboardViewProps {
  userProfile: {
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
  };
  onSaveProfile: (updatedProfile: any) => void;
  onLogout: () => void;
  onNavigate: (view: string) => void;
  activeOrder: Order | null;
  onAddToCart: (meal: Meal) => void;
  cart: CartItem[];
}

export default function CustomerDashboardView({
  userProfile,
  onSaveProfile,
  onLogout,
  onNavigate,
  activeOrder,
  onAddToCart,
  cart
}: CustomerDashboardViewProps) {
  // Navigation tabs: 'home' | 'orders' | 'favorites' | 'addresses' | 'profile' | 'notifications' | 'reviews' | 'help' | 'loyalty' | 'settings'
  const [activeTab, setActiveTab] = useState<string>('home');
  const [successMsg, setSuccessMsg] = useState<string>('');
  const [errorMsg, setErrorMsg] = useState<string>('');

  // Skeletons / Loading states
  const [isLoading, setIsLoading] = useState<boolean>(true);
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 600);
    return () => clearTimeout(timer);
  }, [activeTab]);

  // Toast / Banner helper
  const triggerSuccess = (msg: string) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(''), 3500);
  };

  // State initialization with defaults for better user experience
  const [firstName, setFirstName] = useState(userProfile.firstName || 'Bibi');
  const [lastName, setLastName] = useState(userProfile.lastName || 'User');
  const [email, setEmail] = useState(userProfile.email || 'user@bibifood.com');
  const [phone, setPhone] = useState(userProfile.phone || '+234 803 123 4567');
  const [gender, setGender] = useState(userProfile.gender || 'Female');
  const [dob, setDob] = useState(userProfile.dob || '1995-10-15');
  const [avatar, setAvatar] = useState<string | null>(userProfile.avatarUrl || null);
  const [preferredAddress, setPreferredAddress] = useState<string>('Home Address');

  // Sync profile fields on props changes
  useEffect(() => {
    setFirstName(userProfile.firstName);
    setLastName(userProfile.lastName);
    setEmail(userProfile.email);
    setPhone(userProfile.phone);
    setGender(userProfile.gender || 'Female');
    setDob(userProfile.dob || '1995-10-15');
    setAvatar(userProfile.avatarUrl || null);
  }, [userProfile]);

  // ADDRESSES STATE
  const [addresses, setAddresses] = useState<DeliveryAddress[]>(() => {
    const saved = localStorage.getItem('bibi_addresses');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return userProfile.addresses.length > 0 ? userProfile.addresses : [
      { id: 'addr-default-1', label: 'Home', street: '14 Broad Street, Marina', city: 'Lagos', phone: '+234 803 123 4567', isDefault: true },
      { id: 'addr-default-2', label: 'Office', street: '82 Lekki Phase 1', city: 'Lagos', phone: '+234 812 987 6543', isDefault: false }
    ];
  });

  const [addressFormOpen, setAddressFormOpen] = useState(false);
  const [editingAddressId, setEditingAddressId] = useState<string | null>(null);
  const [addressStreet, setAddressStreet] = useState('');
  const [addressCity, setAddressCity] = useState('Lagos');
  const [addressLabel, setAddressLabel] = useState<'Home' | 'Office' | 'Other'>('Home');
  const [addressPhone, setAddressPhone] = useState(userProfile.phone || '');

  // FAVORITES STATE
  const [favorites, setFavorites] = useState<Meal[]>(() => {
    const saved = localStorage.getItem('bibi_favorites_list');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    // Default favorites
    return [MEALS[0], MEALS[3], MEALS[4]];
  });

  const [favSearchQuery, setFavSearchQuery] = useState('');

  // ORDERS STATE
  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem('bibi_orders_history');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    // Premium starting history
    const baseOrders: Order[] = [
      {
        id: 'BIBI-74921',
        items: [
          { meal: MEALS[0], quantity: 2 },
          { meal: MEALS[4], quantity: 1 }
        ],
        status: 'delivered',
        totalAmount: 12200,
        subtotal: 12200,
        deliveryFee: 1000,
        serviceFee: 500,
        discount: 1500,
        deliveryOption: 'home_delivery',
        address: '14 Broad Street, Marina, Lagos',
        timestamp: '2026-06-28 13:45',
        paymentMethod: 'Debit Card (Visa)',
        cookingInstructions: 'Please make the Jollof spicy.',
        verificationPin: '8821'
      },
      {
        id: 'BIBI-63910',
        items: [
          { meal: MEALS[1], quantity: 1 }
        ],
        status: 'delivered',
        totalAmount: 8000,
        subtotal: 6500,
        deliveryFee: 1000,
        serviceFee: 500,
        deliveryOption: 'home_delivery',
        address: '82 Lekki Phase 1, Lagos',
        timestamp: '2026-06-14 19:20',
        paymentMethod: 'Bank Transfer',
        verificationPin: '4192'
      },
      {
        id: 'BIBI-52119',
        items: [
          { meal: MEALS[3], quantity: 3 }
        ],
        status: 'canceled',
        totalAmount: 17100,
        subtotal: 15600,
        deliveryFee: 1000,
        serviceFee: 500,
        deliveryOption: 'home_delivery',
        address: '14 Broad Street, Marina, Lagos',
        timestamp: '2026-05-30 11:15',
        paymentMethod: 'USSD Code'
      },
      {
        id: 'BIBI-99214',
        items: [
          { meal: MEALS[2], quantity: 1 },
          { meal: MEALS[7], quantity: 2 }
        ],
        status: 'delivered', // scheduled placeholder in layout
        totalAmount: 17300,
        subtotal: 15800,
        deliveryFee: 1000,
        serviceFee: 500,
        deliveryOption: 'home_delivery',
        address: '14 Broad Street, Marina, Lagos',
        timestamp: '2026-07-05 18:00 (Scheduled)',
        cookingInstructions: 'Keep soup hot please.',
        verificationPin: '5249'
      }
    ];
    return baseOrders;
  });

  const [orderSearchQuery, setOrderSearchQuery] = useState('');
  const [orderStatusFilter, setOrderStatusFilter] = useState<'all' | 'active' | 'completed' | 'canceled' | 'scheduled'>('all');
  const [orderDateFilter, setOrderDateFilter] = useState<string>('all');
  const [selectedOrderDetail, setSelectedOrderDetail] = useState<string | null>(null);
  const [isDownloading, setIsDownloading] = useState<string | null>(null);

  // NOTIFICATIONS STATE
  const [notifications, setNotifications] = useState<Array<{ id: string; title: string; body: string; type: 'order' | 'promo' | 'delivery' | 'system'; timestamp: string; unread: boolean }>>([
    { id: 'notif-1', title: '🎁 Sunday Feast Special', body: 'Sunday cooking sorted! Use promo code FESTIVE20 for ₦2,000 off any Soup or Swallow platter!', type: 'promo', timestamp: 'Today, 08:30 AM', unread: true },
    { id: 'notif-2', title: '🚀 Smoked Jollof Dispatched', body: 'Chef Babajide has packed your order. Rider Babatunde O. is heading your way with heat-sealed carriers.', type: 'delivery', timestamp: 'Yesterday, 02:15 PM', unread: true },
    { id: 'notif-3', title: '⭐ Order Delivered Successfully', body: 'Order #BIBI-74921 has been marked as complete. Tell us how the wood-fire flavor tasted!', type: 'order', timestamp: '3 days ago', unread: false },
    { id: 'notif-4', title: '📢 Lekki Cloud Kitchen Expansion', body: 'We have doubled our chef capacities in our Lekki Phase II clouds to ensure 15-minute dispatch averages!', type: 'system', timestamp: '1 week ago', unread: false }
  ]);

  // REVIEWS STATE
  const [reviews, setReviews] = useState<Review[]>([
    { id: 'rev-dash-1', userName: 'Bibi User', rating: 5, comment: 'The Royal Saffron Jollof arrived steaming hot! The smoky aroma is perfectly authentic.', date: '2026-06-29', mealName: 'Royal Saffron Jollof Rice' },
    { id: 'rev-dash-2', userName: 'Bibi User', rating: 4, comment: 'Double smash burger was delicious, cheddar is real and premium.', date: '2026-06-15', mealName: 'Double Smash Burger' }
  ]);

  const [writeReviewOpen, setWriteReviewOpen] = useState(false);
  const [reviewMealId, setReviewMealId] = useState(MEALS[0].id);
  const [reviewComment, setReviewComment] = useState('');
  const [ratingMeal, setRatingMeal] = useState(5);
  const [ratingDelivery, setRatingDelivery] = useState(5);
  const [ratingSupport, setRatingSupport] = useState(5);

  // HELP & SUPPORT STATE
  const [supportCategory, setSupportCategory] = useState<'general' | 'order' | 'payment' | 'refund' | 'issue'>('general');
  const [supportDescription, setSupportDescription] = useState('');
  const [faqExpanded, setFaqExpanded] = useState<number | null>(null);
  const [liveChatOpen, setLiveChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState<Array<{ sender: 'user' | 'agent'; text: string; time: string }>>([
    { sender: 'agent', text: 'Hello! I am Bibi, your personal Chef Concierge. How can I assist you with your Jollof, Suya or delivery coordinates today?', time: 'Just now' }
  ]);
  const [chatInput, setChatInput] = useState('');

  // SETTINGS STATE
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPwd1, setShowPwd1] = useState(false);
  const [showPwd2, setShowPwd2] = useState(false);
  const [showPwd3, setShowPwd3] = useState(false);

  const [notifOrderPref, setNotifOrderPref] = useState(true);
  const [notifPromoPref, setNotifPromoPref] = useState(true);
  const [notifEmailPref, setNotifEmailPref] = useState(true);
  const [notifSmsPref, setNotifSmsPref] = useState(true);
  const [notifPushPref, setNotifPushPref] = useState(false);

  const [lang, setLang] = useState('en');
  const [deleteAccountModalOpen, setDeleteAccountModalOpen] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState('');

  // LOCAL STORAGE SYNC
  useEffect(() => {
    localStorage.setItem('bibi_addresses', JSON.stringify(addresses));
  }, [addresses]);

  useEffect(() => {
    localStorage.setItem('bibi_favorites_list', JSON.stringify(favorites));
  }, [favorites]);

  useEffect(() => {
    localStorage.setItem('bibi_orders_history', JSON.stringify(orders));
  }, [orders]);

  // PROFILE SAVE HANDLER
  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!firstName.trim() || !lastName.trim()) {
      setErrorMsg('First and last names cannot be blank.');
      return;
    }
    setErrorMsg('');
    const updated = {
      ...userProfile,
      firstName,
      lastName,
      email,
      phone,
      gender,
      dob,
      avatarUrl: avatar,
      addresses
    };
    onSaveProfile(updated);
    triggerSuccess('Your Chef Profile has been safely updated!');
  };

  // ADD ADDRESS HANDLER
  const handleOpenAddAddress = () => {
    setEditingAddressId(null);
    setAddressStreet('');
    setAddressCity('Lagos');
    setAddressLabel('Home');
    setAddressPhone(phone);
    setAddressFormOpen(true);
  };

  const handleOpenEditAddress = (addr: DeliveryAddress) => {
    setEditingAddressId(addr.id);
    setAddressStreet(addr.street);
    setAddressCity(addr.city);
    setAddressLabel(addr.label);
    setAddressPhone(addr.phone);
    setAddressFormOpen(true);
  };

  const handleSaveAddress = (e: React.FormEvent) => {
    e.preventDefault();
    if (!addressStreet.trim()) {
      triggerSuccess('Please specify a valid street address.');
      return;
    }
    if (editingAddressId) {
      setAddresses(addresses.map(a => a.id === editingAddressId ? {
        ...a, street: addressStreet, city: addressCity, label: addressLabel, phone: addressPhone
      } : a));
      triggerSuccess('Saved address modified!');
    } else {
      const newAddr: DeliveryAddress = {
        id: `addr-${Date.now()}`,
        street: addressStreet,
        city: addressCity,
        label: addressLabel,
        phone: addressPhone,
        isDefault: addresses.length === 0
      };
      setAddresses([...addresses, newAddr]);
      triggerSuccess('Fresh delivery address added successfully!');
    }
    setAddressFormOpen(false);
  };

  const handleDeleteAddress = (id: string) => {
    const filtered = addresses.filter(a => a.id !== id);
    if (filtered.length > 0 && !filtered.some(a => a.isDefault)) {
      filtered[0].isDefault = true;
    }
    setAddresses(filtered);
    triggerSuccess('Delivery coordinates removed.');
  };

  const handleSetDefaultAddress = (id: string) => {
    setAddresses(addresses.map(a => ({
      ...a, isDefault: a.id === id
    })));
    triggerSuccess('Primary dispatch target set!');
  };

  // REORDER PROCESS
  const handleReorder = (order: Order) => {
    order.items.forEach(item => {
      onAddToCart(item.meal);
    });
    triggerSuccess(`Added all items from order to your live shopping cart!`);
  };

  // ADD/REMOVE FAVORITES
  const toggleFavorite = (meal: Meal) => {
    if (favorites.some(f => f.id === meal.id)) {
      setFavorites(favorites.filter(f => f.id !== meal.id));
      triggerSuccess('Removed from favorites.');
    } else {
      setFavorites([...favorites, meal]);
      triggerSuccess('Added to your favorite recipes!');
    }
  };

  // NOTIFICATION MANAGEMENT
  const markAllNotificationsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, unread: false })));
    triggerSuccess('Marked all unread notices as read!');
  };

  const deleteNotification = (id: string) => {
    setNotifications(notifications.filter(n => n.id !== id));
    triggerSuccess('Notification deleted.');
  };

  // REVIEWS FORM HANDLER
  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    const targetedMeal = MEALS.find(m => m.id === reviewMealId) || MEALS[0];
    const newReview: Review = {
      id: `rev-added-${Date.now()}`,
      userName: `${firstName} ${lastName.charAt(0)}.`,
      rating: ratingMeal,
      comment: reviewComment || 'Excellent smoky Jollof! Perfectly packaged.',
      date: new Date().toISOString().split('T')[0],
      mealName: targetedMeal.name
    };
    setReviews([newReview, ...reviews]);
    setWriteReviewOpen(false);
    setReviewComment('');
    triggerSuccess('Thank you! Your verified rating has been compiled.');
  };

  // HELP SUPPORT FORM HANDLER
  const handleSubmitEnquiry = (e: React.FormEvent) => {
    e.preventDefault();
    if (!supportDescription.trim()) return;
    triggerSuccess(`Your Ticket regarding "${supportCategory.toUpperCase()}" has been generated. Concierge will contact you within 5 minutes.`);
    setSupportDescription('');
  };

  // PASSWORD SUBMIT
  const handlePasswordUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPassword) {
      triggerSuccess('Please specify current password.');
      return;
    }
    if (newPassword !== confirmPassword) {
      triggerSuccess('Confirmation passwords do not match.');
      return;
    }
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    triggerSuccess('High-security password cycled!');
  };

  // DELETE ACCOUNT
  const handleDeleteAccountSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (deleteConfirmText !== 'DELETE') {
      triggerSuccess('Type DELETE to verify decommissioning.');
      return;
    }
    setDeleteAccountModalOpen(false);
    onLogout();
    onNavigate('home');
  };

  // SIMULATE CHATBOT
  const handleSendChatMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    const userMsg = chatInput;
    setChatMessages(prev => [...prev, { sender: 'user', text: userMsg, time: 'Just now' }]);
    setChatInput('');

    setTimeout(() => {
      let reply = 'I have logged your request. Our hot kitchen team is verifying the exact status of current runs!';
      if (userMsg.toLowerCase().includes('order') || userMsg.toLowerCase().includes('track')) {
        reply = 'Your active delivery run is tracked live on the transit board! Rider Babatunde is executing the route.';
      } else if (userMsg.toLowerCase().includes('jollof') || userMsg.toLowerCase().includes('suya')) {
        reply = 'Excellent choice! Our Jollof is slow-smoked in custom firewood cloud kilns to preserve the deep country aroma.';
      } else if (userMsg.toLowerCase().includes('refund') || userMsg.toLowerCase().includes('money')) {
        reply = 'Any failed transactions are processed automatically within 24 bank hours. Please call +234 803 BIBI for hotlines.';
      }
      setChatMessages(prev => [...prev, { sender: 'agent', text: reply, time: 'Just now' }]);
    }, 1200);
  };

  // EXPORT RECEIPT PLACEHOLDER
  const triggerDownloadReceipt = (orderId: string) => {
    setIsDownloading(orderId);
    setTimeout(() => {
      setIsDownloading(null);
      triggerSuccess(`Receipt PDF for ${orderId} downloaded successfully!`);
    }, 1500);
  };

  // Profile completion calculation
  const getProfileCompletion = () => {
    let score = 30; // base with auth
    if (firstName && firstName !== 'Bibi') score += 10;
    if (lastName && lastName !== 'User') score += 10;
    if (phone && phone !== '+234 803 123 4567') score += 15;
    if (avatar) score += 15;
    if (gender) score += 10;
    if (dob) score += 10;
    return score;
  };

  // Count unread notifications
  const unreadCount = notifications.filter(n => n.unread).length;

  return (
    <div className="w-full bg-[#FAF8F5] min-h-screen pb-16 flex flex-col relative text-slate-800">
      
      {/* Alert Banner / Toast Popup */}
      <AnimatePresence>
        {successMsg && (
          <motion.div
            initial={{ opacity: 0, y: -40, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -40, scale: 0.95 }}
            className="fixed top-24 left-1/2 -translate-x-1/2 z-50 bg-brand-basil text-brand-cream px-6 py-3.5 rounded-2xl flex items-center gap-3 shadow-xl font-sans text-xs font-bold border border-brand-basil"
          >
            <CheckCircle2 size={16} className="text-brand-saffron" />
            <span>{successMsg}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* DASHBOARD HERO / WELCOME HEADER BLOCK */}
      <div className="bg-[#131E18] text-white pt-6 pb-24 px-4 md:px-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-brand-chili/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-10 left-10 w-80 h-80 bg-brand-gold/5 rounded-full blur-3xl pointer-events-none" />
        
        <div className="max-w-7xl mx-auto w-full flex flex-col md:flex-row justify-between items-start md:items-center gap-6 relative z-10">
          <div>
            <div className="flex items-center gap-2.5">
              <span className="font-mono text-[9px] bg-brand-saffron text-brand-charcoal font-black uppercase px-2.5 py-0.5 rounded-full tracking-wider">
                Elite Dining Club
              </span>
              <span className="text-xs text-brand-gold font-bold flex items-center gap-1">
                <Sparkles size={12} />
                <span>Silver Tier Account</span>
              </span>
            </div>
            <h2 className="font-display font-black text-2.5xl md:text-3.5xl text-white mt-1 leading-tight tracking-tight">
              A Kúùsọ̀, {firstName || 'Bibi'}!
            </h2>
            <p className="font-sans text-xs text-slate-300 mt-1 max-w-xl">
              Manage your premium cloud order runs, customized food preferences, and verified thermal-insulated dispatch targets from a single central center.
            </p>
          </div>

          {/* Quick Stats Grid */}
          <div className="grid grid-cols-3 gap-3 md:gap-4 w-full md:w-auto">
            <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-3 text-center">
              <span className="block font-mono text-base font-extrabold text-brand-saffron">350</span>
              <span className="block font-sans text-[9px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">Bibi Points</span>
            </div>
            <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-3 text-center">
              <span className="block font-mono text-base font-extrabold text-white">
                {orders.filter(o => o.status === 'delivered').length}
              </span>
              <span className="block font-sans text-[9px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">Completed</span>
            </div>
            <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-3 text-center cursor-pointer hover:bg-white/10 transition-colors" onClick={() => setActiveTab('loyalty')}>
              <span className="block font-mono text-base font-extrabold text-brand-gold">₦3.5k</span>
              <span className="block font-sans text-[9px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">Saved Perks</span>
            </div>
          </div>
        </div>
      </div>

      {/* COMPREHENSIVE CONTAINER: SIDEBAR + CONTENT PANEL */}
      <div className="max-w-7xl mx-auto w-full px-4 md:px-8 -mt-16 relative z-20 flex flex-col lg:flex-row gap-8 items-start">
        
        {/* RESPONSIVE DESKTOP SIDEBAR */}
        <aside className="hidden lg:flex w-72 flex-col gap-3 shrink-0">
          
          {/* User Profile Overview */}
          <div className="bg-white rounded-3xl border border-brand-olive/5 shadow-sm p-5 flex flex-col items-center text-center relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-brand-chili" />
            
            <div className="relative w-16 h-16 rounded-full bg-[#FAF8F5] border-2 border-white shadow-md flex items-center justify-center overflow-hidden">
              {avatar ? (
                <img src={avatar} alt="User Avatar" className="w-full h-full object-cover" />
              ) : (
                <User size={28} className="text-slate-300" />
              )}
              {/* Floating check status */}
              <div className="absolute bottom-0 right-0 bg-brand-basil text-white p-0.5 rounded-full border-2 border-white">
                <CheckCircle size={10} className="text-white" />
              </div>
            </div>

            <div className="mt-3">
              <h4 className="font-display font-bold text-sm text-brand-charcoal">{firstName} {lastName}</h4>
              <span className="block font-sans text-[10px] text-slate-400 mt-0.5 leading-none">{email}</span>
            </div>

            {/* Profile Completion gauge */}
            <div className="w-full mt-4 bg-slate-100 rounded-full h-1.5 overflow-hidden">
              <div 
                className="bg-brand-basil h-1.5 rounded-full transition-all duration-500" 
                style={{ width: `${getProfileCompletion()}%` }} 
              />
            </div>
            <div className="flex justify-between items-center w-full mt-1.5 text-[9px] font-mono text-slate-400 uppercase">
              <span>Chef Profile Completion</span>
              <span className="font-bold text-brand-basil">{getProfileCompletion()}%</span>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="bg-white rounded-3xl border border-brand-olive/5 shadow-sm p-4 flex flex-col gap-1">
            <span className="px-4 pt-1 pb-2 block text-[9px] font-mono font-extrabold text-slate-400 uppercase tracking-wider">Account Command</span>
            
            {[
              { id: 'home', label: 'Dashboard Home', icon: Shield },
              { id: 'orders', label: 'My Orders', icon: List, badge: activeOrder ? '1 Run' : undefined },
              { id: 'favorites', label: 'Favorite Meals', icon: Heart, badge: favorites.length > 0 ? `${favorites.length}` : undefined },
              { id: 'addresses', label: 'Saved Addresses', icon: MapPin },
              { id: 'profile', label: 'Chef Profile', icon: User },
              { id: 'notifications', label: 'Notifications', icon: Bell, badge: unreadCount > 0 ? `${unreadCount}` : undefined },
              { id: 'reviews', label: 'Reviews & Feedback', icon: Star },
              { id: 'help', label: 'Help & Support', icon: HelpCircle },
              { id: 'loyalty', label: 'Loyalty & Rewards', icon: Gift, isPromo: true },
              { id: 'settings', label: 'Settings & Privacy', icon: Lock }
            ].map((item) => {
              const IconComp = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => { setActiveTab(item.id); setErrorMsg(''); }}
                  className={`w-full flex items-center justify-between px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    isActive
                      ? 'bg-brand-olive text-brand-saffron shadow-sm shadow-brand-olive/15'
                      : 'text-slate-500 hover:text-brand-charcoal hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <IconComp size={14} className={item.isPromo ? 'text-brand-gold' : ''} />
                    <span>{item.label}</span>
                  </div>
                  {item.badge ? (
                    <span className={`font-mono text-[8px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider ${
                      isActive ? 'bg-brand-saffron text-brand-charcoal' : 'bg-brand-chili/10 text-brand-chili'
                    }`}>
                      {item.badge}
                    </span>
                  ) : (
                    <ChevronRight size={12} className={isActive ? 'text-brand-saffron' : 'text-slate-300'} />
                  )}
                </button>
              );
            })}
          </div>

          {/* Quick Exit widget */}
          <div className="bg-white rounded-3xl border border-brand-olive/5 shadow-sm p-4 flex flex-col gap-2">
            <button
              onClick={() => {
                onLogout();
                onNavigate('home');
              }}
              className="w-full flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-xs font-bold text-rose-500 hover:bg-rose-50 transition-colors cursor-pointer text-left"
            >
              <LogOut size={14} />
              <span>Log Out Account</span>
            </button>
          </div>
        </aside>

        {/* MAIN DISPLAY CONTENT PANEL */}
        <main className="flex-1 w-full bg-white rounded-3xl border border-brand-olive/5 shadow-md p-5 md:p-8 min-h-[580px] overflow-hidden">
          
          <AnimatePresence mode="wait">
            {isLoading ? (
              <motion.div 
                key="skeleton-loader"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="w-full flex flex-col gap-6"
              >
                <div className="flex justify-between items-center pb-4 border-b border-slate-100">
                  <div className="h-6 w-44 bg-slate-100 rounded-lg animate-pulse" />
                  <div className="h-8 w-24 bg-slate-100 rounded-lg animate-pulse" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="md:col-span-2 flex flex-col gap-4">
                    <div className="h-32 bg-slate-100 rounded-2xl animate-pulse" />
                    <div className="h-44 bg-slate-100 rounded-2xl animate-pulse" />
                  </div>
                  <div className="bg-slate-50/50 p-4 rounded-2xl h-80 animate-pulse" />
                </div>
              </motion.div>
            ) : (
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.25 }}
                className="w-full"
              >
                {/* 1. DASHBOARD HOME SUBVIEW */}
                {activeTab === 'home' && (
                  <div className="flex flex-col gap-6">
                    
                    {/* Welcome interactive quick complete banner */}
                    {getProfileCompletion() < 100 && (
                      <div className="bg-brand-saffron/10 border border-brand-saffron/20 p-4.5 rounded-2xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                        <div className="flex gap-3">
                          <div className="p-2.5 rounded-full bg-brand-saffron/20 text-brand-charcoal shrink-0 self-start">
                            <Sparkles size={16} />
                          </div>
                          <div>
                            <h5 className="font-display font-bold text-xs text-brand-charcoal uppercase tracking-wider">Complete your Foodie Profile!</h5>
                            <p className="font-sans text-[11px] text-slate-600 mt-1">Add your Preferred Contact, DOB and Avatar details to unlock verified executive coupons!</p>
                          </div>
                        </div>
                        <button
                          onClick={() => setActiveTab('profile')}
                          className="bg-brand-olive text-brand-saffron hover:bg-brand-charcoal font-display font-bold text-[10px] tracking-wider uppercase py-2 px-4 rounded-xl cursor-pointer shadow-sm shrink-0"
                        >
                          Fill Coordinates
                        </button>
                      </div>
                    )}

                    {/* Active Order Section */}
                    {activeOrder ? (
                      <div className="bg-[#FAF8F5] border border-brand-basil/20 p-5 rounded-3xl relative overflow-hidden">
                        <div className="absolute top-0 right-0 bg-brand-basil text-white font-mono text-[8px] font-bold uppercase tracking-widest px-3 py-1 rounded-bl-xl">
                          Active Dispatch Route
                        </div>
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-5 mt-2">
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-2xl bg-brand-basil/15 text-brand-basil flex items-center justify-center font-black">
                              🍱
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="font-display font-extrabold text-xs text-brand-charcoal">Order {activeOrder.id}</span>
                                <span className="w-1.5 h-1.5 rounded-full bg-brand-basil animate-ping" />
                              </div>
                              <span className="block font-sans text-[10px] text-slate-400 mt-0.5">Cooking instructions: {activeOrder.cookingInstructions || 'None'}</span>
                              <span className="block font-sans text-xs font-semibold text-brand-basil mt-1">Status: {activeOrder.status.replace('_', ' ').toUpperCase()}</span>
                            </div>
                          </div>
                          <div className="flex flex-col sm:flex-row gap-2.5 items-stretch w-full md:w-auto">
                            <button
                              onClick={() => onNavigate('track')}
                              className="bg-brand-chili hover:bg-brand-chili/95 text-white font-display font-bold text-[10px] tracking-wider uppercase py-2.5 px-5 rounded-xl text-center cursor-pointer shadow-sm"
                            >
                              Track Live GPS
                            </button>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="bg-brand-olive text-brand-cream p-5 rounded-3xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-5 relative overflow-hidden">
                        <div className="absolute right-0 bottom-0 opacity-10 pointer-events-none translate-x-10 translate-y-10 scale-150">
                          <BibiLogo mode="icon" className="w-64 h-64" />
                        </div>
                        <div className="relative z-10">
                          <h4 className="font-display font-black text-sm text-brand-saffron uppercase tracking-wide">Cooking hot, delivered fresh</h4>
                          <p className="font-sans text-[11px] text-slate-300 mt-1 max-w-md">
                            Browse the traditional soup expansions, charcoal grilled Suya skewers, and premium smoked Jollof rice pots available today.
                          </p>
                        </div>
                        <button
                          onClick={() => onNavigate('menu')}
                          className="bg-brand-chili text-white hover:bg-white hover:text-brand-charcoal font-display font-bold text-[10px] tracking-widest uppercase py-2.5 px-5 rounded-xl transition-all shadow-sm shrink-0 relative z-10"
                        >
                          Explore Menu
                        </button>
                      </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      
                      {/* Left: Quick Reorder Platter Slider */}
                      <div className="flex flex-col gap-3">
                        <h4 className="font-display font-bold text-xs text-brand-charcoal uppercase tracking-wider flex items-center gap-1.5 pb-2 border-b border-slate-100">
                          <RefreshCw size={13} className="text-brand-chili" />
                          <span>Quick Reorder</span>
                        </h4>
                        
                        <div className="flex flex-col gap-3">
                          {orders.slice(0, 2).map((order) => (
                            <div key={order.id} className="p-4 rounded-2xl border border-slate-100 hover:border-slate-200 bg-white shadow-sm flex items-center justify-between gap-3 text-xs">
                              <div>
                                <span className="block font-mono text-[9px] text-slate-400 font-bold uppercase">{order.timestamp}</span>
                                <span className="block font-sans font-bold text-slate-800 truncate max-w-[180px]">
                                  {order.items.map(i => `${i.meal.name} x${i.quantity}`).join(', ')}
                                </span>
                                <span className="block font-mono font-black text-brand-basil text-[11px] mt-0.5">₦{order.totalAmount.toLocaleString()}</span>
                              </div>
                              <button
                                onClick={() => handleReorder(order)}
                                className="bg-[#FAF8F5] hover:bg-brand-saffron text-brand-charcoal hover:border-brand-saffron border border-slate-200 px-3 py-1.5 rounded-xl text-[10px] font-sans font-bold transition-all cursor-pointer"
                              >
                                Reorder
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Right: Promotions and Dispatches slider */}
                      <div className="flex flex-col gap-3">
                        <h4 className="font-display font-bold text-xs text-brand-charcoal uppercase tracking-wider flex items-center gap-1.5 pb-2 border-b border-slate-100">
                          <Percent size={13} className="text-brand-gold" />
                          <span>Active Gastronomy Perks</span>
                        </h4>

                        <div className="bg-brand-gold/5 border border-brand-gold/20 p-4.5 rounded-2xl flex flex-col gap-2">
                          <div className="flex items-center gap-1.5 text-brand-charcoal font-display font-black text-[11px]">
                            <Percent size={14} className="text-brand-chili" />
                            <span>CODE: BIBIFLASH15</span>
                          </div>
                          <p className="font-sans text-[10px] text-slate-600 leading-normal">
                            Get 15% off any Charcoal Suya platter. Valid inside Lagos delivery areas this weekend only.
                          </p>
                          <button
                            onClick={() => {
                              navigator.clipboard.writeText('BIBIFLASH15');
                              triggerSuccess('Coupon copied!');
                            }}
                            className="text-[10px] text-brand-chili font-sans font-bold hover:underline text-left mt-1 cursor-pointer"
                          >
                            Copy Coupon Code
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Favorite Meals Segment */}
                    <div className="flex flex-col gap-3 mt-2">
                      <h4 className="font-display font-bold text-xs text-brand-charcoal uppercase tracking-wider flex items-center gap-1.5 pb-2 border-b border-slate-100">
                        <Heart size={13} className="text-brand-chili fill-brand-chili" />
                        <span>Saved Meal Planners</span>
                      </h4>
                      
                      {favorites.length === 0 ? (
                        <p className="font-sans text-xs italic text-slate-400 py-3 text-center">Your favorite meals will show here. Click hearts on the menu to add!</p>
                      ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                          {favorites.slice(0, 3).map((meal) => (
                            <div key={meal.id} className="bg-[#FAF8F5]/40 border border-slate-100 p-3.5 rounded-2xl flex flex-col justify-between hover:border-slate-200 transition-colors">
                              <div>
                                <img src={meal.image} alt={meal.name} className="w-full h-24 object-cover rounded-xl mb-2.5" />
                                <h5 className="font-display font-bold text-[11px] text-brand-charcoal leading-tight truncate">{meal.name}</h5>
                                <span className="block font-mono text-[10px] text-brand-basil font-bold mt-1">₦{meal.price.toLocaleString()}</span>
                              </div>
                              <button
                                onClick={() => {
                                  onAddToCart(meal);
                                  triggerSuccess(`${meal.name} added to cart!`);
                                }}
                                className="bg-white hover:bg-brand-olive hover:text-brand-saffron text-slate-700 border border-slate-200/60 font-sans text-[10px] font-bold py-2 rounded-xl mt-3 text-center cursor-pointer transition-colors"
                              >
                                Add to Cart
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Recommended Chef Recommendations */}
                    <div className="flex flex-col gap-3 mt-2">
                      <h4 className="font-display font-bold text-xs text-brand-charcoal uppercase tracking-wider flex items-center gap-1.5 pb-2 border-b border-slate-100">
                        <Sparkles size={13} className="text-brand-saffron" />
                        <span>Chef Recommendations</span>
                      </h4>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {MEALS.filter(m => m.isPopular && !favorites.some(f => f.id === m.id)).slice(0, 2).map((meal) => (
                          <div key={meal.id} className="p-4 bg-white border border-slate-150 rounded-2xl flex gap-3.5 items-center hover:shadow-sm transition-all">
                            <img src={meal.image} alt={meal.name} className="w-16 h-16 rounded-xl object-cover shrink-0" />
                            <div className="flex-1 min-w-0">
                              <span className="font-mono text-[8px] bg-brand-gold/15 text-brand-charcoal font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">Chef Pick</span>
                              <h5 className="font-display font-bold text-xs text-brand-charcoal truncate mt-1">{meal.name}</h5>
                              <p className="font-mono text-[11px] text-brand-basil font-extrabold mt-0.5">₦{meal.price.toLocaleString()}</p>
                            </div>
                            <button
                              onClick={() => {
                                onAddToCart(meal);
                                triggerSuccess(`${meal.name} added to cart!`);
                              }}
                              className="bg-brand-chili hover:bg-brand-chili/95 text-white p-2 rounded-xl cursor-pointer"
                              title="Quick add to cart"
                            >
                              <Plus size={14} />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>

                  </div>
                )}

                {/* 2. MY ORDERS SUBVIEW */}
                {activeTab === 'orders' && (
                  <div className="flex flex-col gap-6">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-slate-100">
                      <div>
                        <h3 className="font-display font-semibold text-sm text-brand-charcoal">
                          Complete Order Management
                        </h3>
                        <p className="font-sans text-[11px] text-slate-400 mt-0.5">View active, scheduled, completed and canceled culinary dispatches.</p>
                      </div>

                      {/* Date Filter */}
                      <select
                        value={orderDateFilter}
                        onChange={(e) => setOrderDateFilter(e.target.value)}
                        className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 font-sans text-xs text-slate-600 focus:outline-none cursor-pointer"
                      >
                        <option value="all">All Dates</option>
                        <option value="30">Last 30 Days</option>
                        <option value="6">Last 6 Months</option>
                        <option value="2026">Year 2026</option>
                      </select>
                    </div>

                    {/* Sub tabs + Search */}
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      
                      {/* Tabs */}
                      <div className="flex flex-wrap gap-1.5 bg-slate-50 p-1 rounded-2xl">
                        {[
                          { id: 'all', label: 'All Orders' },
                          { id: 'active', label: 'Active' },
                          { id: 'scheduled', label: 'Scheduled' },
                          { id: 'completed', label: 'Completed' },
                          { id: 'canceled', label: 'Canceled' }
                        ].map((sub) => (
                          <button
                            key={sub.id}
                            onClick={() => setOrderStatusFilter(sub.id as any)}
                            className={`px-3.5 py-1.5 rounded-xl text-[10px] font-sans font-bold uppercase tracking-wider transition-all cursor-pointer ${
                              orderStatusFilter === sub.id
                                ? 'bg-white text-brand-charcoal shadow-sm'
                                : 'text-slate-500 hover:text-slate-700'
                            }`}
                          >
                            {sub.label}
                          </button>
                        ))}
                      </div>

                      {/* Search */}
                      <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 focus-within:border-brand-olive transition-colors md:w-64">
                        <Search size={13} className="text-slate-400" />
                        <input
                          type="text"
                          placeholder="Search orders..."
                          value={orderSearchQuery}
                          onChange={(e) => setOrderSearchQuery(e.target.value)}
                          className="bg-transparent border-none text-xs focus:outline-none w-full"
                        />
                        {orderSearchQuery && (
                          <button onClick={() => setOrderSearchQuery('')} className="text-slate-400 hover:text-slate-600">
                            <X size={12} />
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Orders Render list */}
                    {(() => {
                      let filtered = orders;

                      // Filter by status tab
                      if (orderStatusFilter === 'active') {
                        filtered = activeOrder ? [activeOrder] : [];
                      } else if (orderStatusFilter === 'completed') {
                        filtered = orders.filter(o => o.status === 'delivered' && !o.timestamp.includes('Scheduled'));
                      } else if (orderStatusFilter === 'canceled') {
                        filtered = orders.filter(o => o.status === 'canceled');
                      } else if (orderStatusFilter === 'scheduled') {
                        filtered = orders.filter(o => o.timestamp.includes('Scheduled'));
                      }

                      // Filter by Date
                      if (orderDateFilter === '30') {
                        filtered = filtered.filter(o => o.timestamp.includes('06-') || o.timestamp.includes('07-'));
                      } else if (orderDateFilter === '6') {
                        filtered = filtered.filter(o => o.timestamp.includes('2026'));
                      }

                      // Filter by Search Query
                      if (orderSearchQuery) {
                        filtered = filtered.filter(o => 
                          o.id.toLowerCase().includes(orderSearchQuery.toLowerCase()) ||
                          o.items.some(item => item.meal.name.toLowerCase().includes(orderSearchQuery.toLowerCase()))
                        );
                      }

                      if (filtered.length === 0) {
                        return (
                          <div className="text-center py-16 flex flex-col items-center gap-3 bg-[#FAF8F5] rounded-3xl border border-slate-100/40">
                            <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
                              <ShoppingBag size={24} />
                            </div>
                            <div>
                              <h4 className="font-display font-bold text-xs text-brand-charcoal uppercase tracking-wider">No Orders Found</h4>
                              <p className="font-sans text-xs text-slate-400 mt-1 max-w-xs mx-auto">
                                You have no orders matching these filters. Try browsing our hot wood-fired selections.
                              </p>
                            </div>
                            <button
                              onClick={() => onNavigate('menu')}
                              className="bg-brand-chili text-white font-display font-bold text-[10px] uppercase tracking-wider py-2.5 px-6 rounded-xl mt-2 cursor-pointer transition-colors"
                            >
                              Order Platter Now
                            </button>
                          </div>
                        );
                      }

                      return (
                        <div className="flex flex-col gap-4">
                          {filtered.map((order) => {
                            const isScheduled = order.timestamp.includes('Scheduled');
                            const isCurrentlyActive = order.id === activeOrder?.id;
                            
                            return (
                              <div 
                                key={order.id} 
                                className={`border rounded-2xl overflow-hidden transition-all bg-white ${
                                  isCurrentlyActive 
                                    ? 'border-brand-basil bg-brand-basil/[0.01]' 
                                    : 'border-slate-150 hover:border-slate-250 hover:shadow-sm'
                                }`}
                              >
                                <div className="p-4 bg-slate-50 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                                  <div className="flex flex-wrap items-center gap-2">
                                    <span className="font-mono font-black text-xs text-brand-charcoal">ID: {order.id}</span>
                                    <span className="text-[10px] text-slate-400 font-sans">{order.timestamp}</span>
                                    {isCurrentlyActive && (
                                      <span className="font-mono text-[8px] bg-brand-basil text-white font-black px-2 py-0.5 rounded-full uppercase tracking-wider">Active Run</span>
                                    )}
                                    {isScheduled && (
                                      <span className="font-mono text-[8px] bg-[#1E3A8A] text-white font-black px-2 py-0.5 rounded-full uppercase tracking-wider">Scheduled</span>
                                    )}
                                  </div>
                                  <span className={`font-mono text-[9px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full ${
                                    order.status === 'delivered' 
                                      ? 'bg-slate-200 text-slate-600' 
                                      : order.status === 'canceled' 
                                        ? 'bg-rose-100 text-rose-600' 
                                        : 'bg-brand-saffron/20 text-brand-charcoal'
                                  }`}>
                                    {order.status.replace('_', ' ')}
                                  </span>
                                </div>

                                <div className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                  <div className="flex-1">
                                    {order.items.map((item, idx) => (
                                      <div key={idx} className="flex justify-between items-center text-xs py-1">
                                        <span className="font-sans font-medium text-slate-700">{item.meal.name}</span>
                                        <span className="font-mono text-slate-400">x{item.quantity}</span>
                                      </div>
                                    ))}
                                    <div className="mt-2.5 pt-2.5 border-t border-slate-100 flex justify-between items-baseline">
                                      <span className="font-sans text-xs text-slate-400">Total Charged:</span>
                                      <span className="font-mono text-xs font-black text-brand-charcoal">₦{order.totalAmount.toLocaleString()}</span>
                                    </div>
                                  </div>

                                  <div className="flex flex-col sm:items-end gap-2 shrink-0">
                                    {isCurrentlyActive ? (
                                      <button
                                        onClick={() => onNavigate('track')}
                                        className="w-full sm:w-auto bg-brand-basil text-white font-display font-bold text-[10px] tracking-wider uppercase py-2.5 px-4 rounded-xl flex items-center justify-center gap-1 cursor-pointer"
                                      >
                                        <span>Track Live GPS</span>
                                      </button>
                                    ) : (
                                      <button
                                        onClick={() => handleReorder(order)}
                                        className="w-full sm:w-auto bg-[#131E18] hover:bg-brand-charcoal text-white font-display font-bold text-[10px] tracking-wider uppercase py-2.5 px-4 rounded-xl cursor-pointer transition-colors"
                                      >
                                        Reorder Platter
                                      </button>
                                    )}

                                    <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                                      <button
                                        onClick={() => setSelectedOrderDetail(selectedOrderDetail === order.id ? null : order.id)}
                                        className="font-sans text-[10px] text-slate-400 hover:text-slate-600 font-bold underline"
                                      >
                                        {selectedOrderDetail === order.id ? 'Close Details' : 'Order Details'}
                                      </button>
                                      <button
                                        onClick={() => triggerDownloadReceipt(order.id)}
                                        className="text-slate-400 hover:text-[#C62828] p-1 rounded-lg"
                                        disabled={isDownloading === order.id}
                                        title="Download PDF Receipt"
                                      >
                                        {isDownloading === order.id ? <RefreshCw size={12} className="animate-spin text-brand-chili" /> : <Download size={13} />}
                                      </button>
                                    </div>
                                  </div>
                                </div>

                                {/* Accordion details */}
                                <AnimatePresence>
                                  {selectedOrderDetail === order.id && (
                                    <motion.div
                                      initial={{ height: 0, opacity: 0 }}
                                      animate={{ height: 'auto', opacity: 1 }}
                                      exit={{ height: 0, opacity: 0 }}
                                      className="border-t border-slate-100 bg-[#FAF8F5]/60 px-4 py-3.5 text-xs font-sans text-slate-500"
                                    >
                                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div>
                                          <p className="font-bold text-slate-700">Dispatch Target Info</p>
                                          <p className="mt-1">Method: {order.deliveryOption === 'home_delivery' ? 'Heat-Sealed Cabin Dispatch' : 'Kitchen Pickup'}</p>
                                          <p>Address: {order.address}</p>
                                          {order.cookingInstructions && <p className="italic text-brand-chili">Notes: "{order.cookingInstructions}"</p>}
                                        </div>
                                        <div>
                                          <p className="font-bold text-slate-700">Bill Summary</p>
                                          <div className="flex justify-between mt-1">
                                            <span>Subtotal</span>
                                            <span className="font-mono text-slate-600">₦{order.subtotal?.toLocaleString() || (order.totalAmount - 1500).toLocaleString()}</span>
                                          </div>
                                          <div className="flex justify-between">
                                            <span>Thermal Delivery</span>
                                            <span className="font-mono text-slate-600">₦{order.deliveryFee?.toLocaleString() || '1,000'}</span>
                                          </div>
                                          <div className="flex justify-between">
                                            <span>Service Fee</span>
                                            <span className="font-mono text-slate-600">₦{order.serviceFee?.toLocaleString() || '500'}</span>
                                          </div>
                                          {order.discount ? (
                                            <div className="flex justify-between text-rose-500">
                                              <span>Promo Discount</span>
                                              <span className="font-mono">-₦{order.discount.toLocaleString()}</span>
                                            </div>
                                          ) : null}
                                          <div className="flex justify-between border-t border-slate-200 mt-1.5 pt-1.5 font-bold text-brand-charcoal">
                                            <span>Total Paid</span>
                                            <span className="font-mono">₦{order.totalAmount.toLocaleString()}</span>
                                          </div>
                                        </div>
                                      </div>
                                    </motion.div>
                                  )}
                                </AnimatePresence>
                              </div>
                            );
                          })}
                        </div>
                      );
                    })()}
                  </div>
                )}

                {/* 3. FAVORITES SUBVIEW */}
                {activeTab === 'favorites' && (
                  <div className="flex flex-col gap-6">
                    <div className="pb-4 border-b border-slate-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                      <div>
                        <h3 className="font-display font-semibold text-sm text-brand-charcoal">
                          Your Favorite Recipes
                        </h3>
                        <p className="font-sans text-[11px] text-slate-400 mt-0.5">Toggle heart icons on menu screens to save preferred platters.</p>
                      </div>

                      {/* Search */}
                      <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 focus-within:border-brand-olive transition-colors w-full sm:w-64">
                        <Search size={13} className="text-slate-400" />
                        <input
                          type="text"
                          placeholder="Search saved..."
                          value={favSearchQuery}
                          onChange={(e) => setFavSearchQuery(e.target.value)}
                          className="bg-transparent border-none text-xs focus:outline-none w-full"
                        />
                      </div>
                    </div>

                    {(() => {
                      let filtered = favorites;
                      if (favSearchQuery) {
                        filtered = favorites.filter(m => m.name.toLowerCase().includes(favSearchQuery.toLowerCase()));
                      }

                      if (filtered.length === 0) {
                        return (
                          <div className="text-center py-16 flex flex-col items-center gap-3 bg-[#FAF8F5] rounded-3xl border border-slate-100/40">
                            <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
                              <Heart size={24} />
                            </div>
                            <div>
                              <h4 className="font-display font-bold text-xs text-brand-charcoal uppercase tracking-wider">No Saved Favorites</h4>
                              <p className="font-sans text-xs text-slate-400 mt-1 max-w-xs mx-auto">
                                You have not saved any recipe coordinates yet. Explore the menu and tap the hearts!
                              </p>
                            </div>
                            <button
                              onClick={() => onNavigate('menu')}
                              className="bg-brand-chili text-white font-display font-bold text-[10px] uppercase tracking-wider py-2.5 px-6 rounded-xl mt-2 cursor-pointer transition-colors"
                            >
                              Browse Menu List
                            </button>
                          </div>
                        );
                      }

                      return (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {filtered.map((meal) => (
                            <div key={meal.id} className="p-4 bg-white border border-slate-150 rounded-2xl flex gap-4 hover:border-slate-250 transition-all justify-between relative group">
                              <img src={meal.image} alt={meal.name} className="w-20 h-20 rounded-xl object-cover shrink-0" />
                              <div className="flex-1 min-w-0 flex flex-col justify-between">
                                <div>
                                  <div className="flex items-center gap-1.5">
                                    <span className="font-mono text-[7.5px] bg-brand-olive text-brand-saffron font-extrabold px-2 py-0.5 rounded-full uppercase">{meal.category.replace('-', ' ')}</span>
                                    <span className="text-[10px] text-brand-gold font-bold flex items-center gap-0.5">
                                      <Star size={10} className="fill-brand-gold" />
                                      <span>{meal.rating}</span>
                                    </span>
                                  </div>
                                  <h4 className="font-display font-bold text-xs text-brand-charcoal truncate mt-1">{meal.name}</h4>
                                  <p className="font-sans text-[10px] text-slate-400 line-clamp-1 mt-0.5">{meal.description}</p>
                                </div>
                                <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-50">
                                  <span className="font-mono text-xs font-black text-brand-charcoal">₦{meal.price.toLocaleString()}</span>
                                  <button
                                    onClick={() => {
                                      onAddToCart(meal);
                                      triggerSuccess(`${meal.name} added!`);
                                    }}
                                    className="bg-brand-chili hover:bg-brand-chili/95 text-white font-display font-bold text-[9px] tracking-wider uppercase py-1.5 px-3 rounded-lg"
                                  >
                                    Add to Cart
                                  </button>
                                </div>
                              </div>

                              <button
                                onClick={() => toggleFavorite(meal)}
                                className="absolute top-2 right-2 p-1.5 bg-rose-50 text-brand-chili rounded-xl cursor-pointer hover:scale-105 transition-all"
                                title="Remove recipe"
                              >
                                <X size={12} />
                              </button>
                            </div>
                          ))}
                        </div>
                      );
                    })()}
                  </div>
                )}

                {/* 4. SAVED ADDRESSES SUBVIEW */}
                {activeTab === 'addresses' && (
                  <div className="flex flex-col gap-6">
                    <div className="flex justify-between items-center pb-4 border-b border-slate-100">
                      <div>
                        <h3 className="font-display font-semibold text-sm text-brand-charcoal">
                          Saved Delivery Coordinates
                        </h3>
                        <p className="font-sans text-[11px] text-slate-400 mt-0.5">Manage multiple corporate, household and custom dispatch addresses.</p>
                      </div>
                      
                      {!addressFormOpen && (
                        <button
                          onClick={handleOpenAddAddress}
                          className="bg-brand-chili hover:bg-brand-chili/95 text-white font-display font-bold py-2.5 px-4 rounded-xl text-xs flex items-center gap-1.5 cursor-pointer shadow-sm shadow-brand-chili/10"
                        >
                          <Plus size={14} />
                          <span>Add Address</span>
                        </button>
                      )}
                    </div>

                    {/* ADDRESS FORM DROPDOWN/INLINE */}
                    {addressFormOpen && (
                      <form onSubmit={handleSaveAddress} className="p-5 rounded-2xl border border-brand-olive/10 bg-[#FAF8F5]/60 flex flex-col gap-4">
                        <div className="flex justify-between items-center pb-2 border-b border-slate-200">
                          <h4 className="font-display font-bold text-xs text-brand-charcoal uppercase tracking-wider">
                            {editingAddressId ? 'Edit Coordinates' : 'Setup New Address Coordinates'}
                          </h4>
                          <button type="button" onClick={() => setAddressFormOpen(false)} className="text-slate-400 hover:text-slate-600">
                            <X size={15} />
                          </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block font-sans text-xs font-semibold text-brand-charcoal mb-1.5">Address Nickname / Label</label>
                            <div className="flex gap-2">
                              {['Home', 'Office', 'Other'].map((l) => (
                                <button
                                  key={l}
                                  type="button"
                                  onClick={() => setAddressLabel(l as any)}
                                  className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${
                                    addressLabel === l 
                                      ? 'bg-brand-olive text-brand-saffron' 
                                      : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
                                  }`}
                                >
                                  {l}
                                </button>
                              ))}
                            </div>
                          </div>

                          <div>
                            <label className="block font-sans text-xs font-semibold text-brand-charcoal mb-1.5">Recipient Mobile Number</label>
                            <input
                              type="text"
                              value={addressPhone}
                              onChange={(e) => setAddressPhone(e.target.value)}
                              placeholder="+234 803 123 4567"
                              className="w-full bg-white text-slate-800 font-sans text-xs px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-brand-olive"
                              required
                            />
                          </div>

                          <div className="md:col-span-2">
                            <label className="block font-sans text-xs font-semibold text-brand-charcoal mb-1.5">Street Details & Landmark</label>
                            <input
                              type="text"
                              value={addressStreet}
                              onChange={(e) => setAddressStreet(e.target.value)}
                              placeholder="House 15, Close B, Off Adeniran Avenue"
                              className="w-full bg-white text-slate-800 font-sans text-xs px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-brand-olive"
                              required
                            />
                          </div>

                          <div>
                            <label className="block font-sans text-xs font-semibold text-brand-charcoal mb-1.5">City Zone</label>
                            <select
                              value={addressCity}
                              onChange={(e) => setAddressCity(e.target.value)}
                              className="w-full bg-white text-slate-800 font-sans text-xs px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-brand-olive"
                            >
                              <option value="Lagos">Lagos State (Active Cloud Center)</option>
                              <option value="Abuja">Abuja (Beta Zone)</option>
                              <option value="Ibadan">Ibadan (Coming Soon)</option>
                            </select>
                          </div>
                        </div>

                        <div className="flex justify-end gap-2.5 mt-2">
                          <button
                            type="button"
                            onClick={() => setAddressFormOpen(false)}
                            className="bg-white border border-slate-200 hover:bg-slate-50 text-slate-600 px-4 py-2 rounded-xl text-xs font-sans font-semibold cursor-pointer"
                          >
                            Cancel
                          </button>
                          <button
                            type="submit"
                            className="bg-brand-olive text-brand-saffron hover:bg-brand-charcoal px-5 py-2 rounded-xl text-xs font-display font-bold cursor-pointer"
                          >
                            Save Coordinates
                          </button>
                        </div>
                      </form>
                    )}

                    {/* ADDRESS LIST */}
                    {addresses.length === 0 ? (
                      <div className="text-center py-16 flex flex-col items-center gap-3 bg-[#FAF8F5] rounded-3xl border border-slate-100/40">
                        <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
                          <MapPin size={24} />
                        </div>
                        <div>
                          <h4 className="font-display font-bold text-xs text-brand-charcoal uppercase tracking-wider">No Saved Addresses</h4>
                          <p className="font-sans text-xs text-slate-400 mt-1 max-w-xs mx-auto">
                            Please save your delivery coordinates to facilitate instant one-click dispatches.
                          </p>
                        </div>
                        <button
                          onClick={handleOpenAddAddress}
                          className="bg-brand-olive text-brand-saffron font-display font-bold text-[10px] uppercase tracking-wider py-2.5 px-6 rounded-xl mt-2 cursor-pointer transition-colors"
                        >
                          Setup Delivery Coordinates
                        </button>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {addresses.map((addr) => (
                          <div 
                            key={addr.id} 
                            className={`p-5 rounded-2xl border transition-all flex flex-col justify-between gap-4 ${
                              addr.isDefault 
                                ? 'bg-brand-gold/[0.03] border-brand-gold/45 shadow-sm' 
                                : 'bg-white border-slate-150 hover:border-slate-250'
                            }`}
                          >
                            <div>
                              <div className="flex justify-between items-start">
                                <span className={`font-mono text-[8px] font-black uppercase tracking-widest px-2.5 py-0.5 rounded-full ${
                                  addr.label === 'Home' ? 'bg-brand-olive text-brand-saffron' : addr.label === 'Office' ? 'bg-[#1E3A8A] text-white' : 'bg-slate-200 text-slate-700'
                                }`}>
                                  {addr.label}
                                </span>

                                <div className="flex items-center gap-1">
                                  <button onClick={() => handleOpenEditAddress(addr)} className="p-1 text-slate-400 hover:text-slate-600 rounded-lg">
                                    <Edit2 size={12} />
                                  </button>
                                  <button onClick={() => handleDeleteAddress(addr.id)} className="p-1 text-slate-400 hover:text-rose-500 rounded-lg">
                                    <Trash2 size={12} />
                                  </button>
                                </div>
                              </div>

                              <p className="font-sans text-xs font-bold text-slate-800 leading-normal mt-3">{addr.street}</p>
                              <p className="font-sans text-[10px] text-slate-400 mt-1">{addr.city}</p>
                              <p className="font-sans text-[10px] text-slate-500 font-semibold mt-1 flex items-center gap-1.5">
                                <Smartphone size={10} className="text-slate-400" />
                                <span>{addr.phone}</span>
                              </p>
                            </div>

                            {addr.isDefault ? (
                              <span className="text-[9px] font-sans font-black text-brand-basil flex items-center gap-0.5 bg-brand-basil/10 px-2 py-1 rounded-md self-start">
                                <Check size={11} />
                                <span>Primary Dispatch Target</span>
                              </span>
                            ) : (
                              <button
                                onClick={() => handleSetDefaultAddress(addr.id)}
                                className="text-[10px] font-sans font-bold text-brand-olive hover:underline text-left cursor-pointer"
                              >
                                Set as Default Address
                              </button>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* 5. PROFILE SUBVIEW */}
                {activeTab === 'profile' && (
                  <form onSubmit={handleSaveProfile} className="flex flex-col gap-6">
                    <div className="flex justify-between items-center pb-4 border-b border-slate-100">
                      <div>
                        <h3 className="font-display font-semibold text-sm text-brand-charcoal">
                          Your Chef profile settings
                        </h3>
                        <p className="font-sans text-[11px] text-slate-400 mt-0.5">Customize verified dispatch names and telemetry communication coordinates.</p>
                      </div>
                      <button
                        type="submit"
                        className="bg-brand-olive hover:bg-brand-charcoal text-brand-saffron font-display font-bold py-2.5 px-5 rounded-xl text-xs flex items-center gap-1.5 cursor-pointer shadow-sm transition-colors"
                      >
                        <Save size={12} />
                        <span>Save Profile</span>
                      </button>
                    </div>

                    {/* Photo Upload segment */}
                    <div className="flex flex-col sm:flex-row items-center gap-5 bg-[#FAF8F5] p-5 rounded-3xl border border-slate-100">
                      <div className="relative w-16 h-16 rounded-full bg-slate-200 border-2 border-white shadow-md flex items-center justify-center overflow-hidden shrink-0">
                        {avatar ? (
                          <img src={avatar} alt="Avatar profile" className="w-full h-full object-cover" />
                        ) : (
                          <User size={24} className="text-slate-400" />
                        )}
                      </div>
                      <div className="text-center sm:text-left">
                        <h4 className="font-display font-bold text-xs text-brand-charcoal">Chef Avatar photo</h4>
                        <p className="font-sans text-[10px] text-slate-400 mt-1">Saves coordinate recognition with dispatch riders on arrivals.</p>
                        
                        <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mt-2.5">
                          <label className="bg-white hover:bg-slate-50 text-slate-600 border border-slate-200 px-3 py-1.5 rounded-lg text-[10px] font-bold font-sans cursor-pointer transition-colors shadow-sm">
                            <span>Change Avatar</span>
                            <input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={(e) => {
                                if (e.target.files && e.target.files[0]) {
                                  const reader = new FileReader();
                                  reader.onload = (ev) => {
                                    if (ev.target?.result) setAvatar(ev.target.result as string);
                                  };
                                  reader.readAsDataURL(e.target.files[0]);
                                }
                              }}
                            />
                          </label>
                          {avatar && (
                            <button
                              type="button"
                              onClick={() => setAvatar(null)}
                              className="text-rose-500 hover:bg-rose-50 border border-rose-100 px-3 py-1.5 rounded-lg text-[10px] font-bold font-sans cursor-pointer"
                            >
                              Remove
                            </button>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Info form block */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block font-sans text-xs font-semibold text-slate-700 mb-1.5">First Name</label>
                        <input
                          type="text"
                          value={firstName}
                          onChange={(e) => setFirstName(e.target.value)}
                          className="w-full bg-slate-50 text-slate-800 font-sans text-xs px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:bg-white focus:border-brand-olive"
                          required
                        />
                      </div>

                      <div>
                        <label className="block font-sans text-xs font-semibold text-slate-700 mb-1.5">Last Name</label>
                        <input
                          type="text"
                          value={lastName}
                          onChange={(e) => setLastName(e.target.value)}
                          className="w-full bg-slate-50 text-slate-800 font-sans text-xs px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:bg-white focus:border-brand-olive"
                          required
                        />
                      </div>

                      <div>
                        <label className="block font-sans text-xs font-semibold text-slate-700 mb-1.5">Email Address</label>
                        <input
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="w-full bg-slate-50 text-slate-800 font-sans text-xs px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:bg-white focus:border-brand-olive"
                          required
                        />
                      </div>

                      <div>
                        <label className="block font-sans text-xs font-semibold text-slate-700 mb-1.5">Phone Number</label>
                        <input
                          type="text"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          className="w-full bg-slate-50 text-slate-800 font-sans text-xs px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:bg-white focus:border-brand-olive"
                          required
                        />
                      </div>

                      <div>
                        <label className="block font-sans text-xs font-semibold text-slate-700 mb-1.5">Date of Birth</label>
                        <input
                          type="date"
                          value={dob}
                          onChange={(e) => setDob(e.target.value)}
                          className="w-full bg-slate-50 text-slate-800 font-sans text-xs px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:bg-white focus:border-brand-olive"
                        />
                      </div>

                      <div>
                        <label className="block font-sans text-xs font-semibold text-slate-700 mb-1.5">Gender Selection</label>
                        <select
                          value={gender}
                          onChange={(e) => setGender(e.target.value)}
                          className="w-full bg-slate-50 text-slate-800 font-sans text-xs px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:bg-white focus:border-brand-olive cursor-pointer"
                        >
                          <option value="Male">Male</option>
                          <option value="Female">Female</option>
                          <option value="Other">Other</option>
                        </select>
                      </div>

                      <div className="md:col-span-2">
                        <label className="block font-sans text-xs font-semibold text-slate-700 mb-1.5">Preferred Food Delivery Destination Profile</label>
                        <input
                          type="text"
                          value={preferredAddress}
                          onChange={(e) => setPreferredAddress(e.target.value)}
                          placeholder="Home coordinates"
                          className="w-full bg-slate-150 text-slate-500 font-sans text-xs px-4 py-3 rounded-xl border border-slate-200 cursor-not-allowed"
                          disabled
                        />
                      </div>
                    </div>
                  </form>
                )}

                {/* 6. NOTIFICATIONS SUBVIEW */}
                {activeTab === 'notifications' && (
                  <div className="flex flex-col gap-6">
                    <div className="pb-4 border-b border-slate-100 flex justify-between items-center">
                      <div>
                        <h3 className="font-display font-semibold text-sm text-brand-charcoal">
                          Chef Communication Inbox
                        </h3>
                        <p className="font-sans text-[11px] text-slate-400 mt-0.5">Your center for weekly flash perks, order dispatch progress, and general telemetry logs.</p>
                      </div>
                      
                      {notifications.length > 0 && (
                        <button
                          onClick={markAllNotificationsRead}
                          className="text-xs font-sans font-bold text-brand-chili hover:underline cursor-pointer"
                        >
                          Mark All as Read
                        </button>
                      )}
                    </div>

                    {notifications.length === 0 ? (
                      <div className="text-center py-16 flex flex-col items-center gap-3 bg-[#FAF8F5] rounded-3xl border border-slate-100/40">
                        <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
                          <Bell size={24} />
                        </div>
                        <div>
                          <h4 className="font-display font-bold text-xs text-brand-charcoal uppercase tracking-wider">Inbox is Empty</h4>
                          <p className="font-sans text-xs text-slate-400 mt-1 max-w-xs mx-auto">
                            No unread notifications active at this time. Go cook or browse dishes!
                          </p>
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-col gap-3">
                        {notifications.map((notif) => (
                          <div 
                            key={notif.id} 
                            className={`p-4 rounded-2xl border transition-all flex items-start gap-4 justify-between relative ${
                              notif.unread 
                                ? 'bg-brand-chili/[0.02] border-brand-chili/20 shadow-sm' 
                                : 'bg-white border-slate-150 hover:border-slate-200'
                            }`}
                          >
                            <div className="flex gap-3">
                              {/* Unread indicator dot */}
                              {notif.unread && (
                                <span className="absolute top-4 left-3 w-1.5 h-1.5 rounded-full bg-brand-chili" />
                              )}
                              
                              <div className={`p-2.5 rounded-xl shrink-0 ${
                                notif.type === 'promo' 
                                  ? 'bg-brand-gold/15 text-brand-charcoal' 
                                  : notif.type === 'delivery' 
                                    ? 'bg-brand-basil/15 text-brand-basil' 
                                    : 'bg-slate-100 text-slate-600'
                              }`}>
                                {notif.type === 'promo' ? <Percent size={14} /> : notif.type === 'delivery' ? <Clock size={14} /> : <Info size={14} />}
                              </div>

                              <div>
                                <h4 className="font-display font-bold text-xs text-brand-charcoal leading-tight pl-1">{notif.title}</h4>
                                <p className="font-sans text-[11px] text-slate-500 mt-1 pl-1 leading-normal">{notif.body}</p>
                                <span className="block font-mono text-[9px] text-slate-400 mt-1.5 pl-1">{notif.timestamp}</span>
                              </div>
                            </div>

                            <button
                              onClick={() => deleteNotification(notif.id)}
                              className="text-slate-300 hover:text-rose-500 p-1 rounded-lg shrink-0"
                              title="Delete notification"
                            >
                              <Trash2 size={13} />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* 7. REVIEWS SUBVIEW */}
                {activeTab === 'reviews' && (
                  <div className="flex flex-col gap-6">
                    <div className="pb-4 border-b border-slate-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                      <div>
                        <h3 className="font-display font-semibold text-sm text-brand-charcoal">
                          Reviews & Cooking Feedback
                        </h3>
                        <p className="font-sans text-[11px] text-slate-400 mt-0.5">Verified historical logs of your dining sessions ratings.</p>
                      </div>

                      {!writeReviewOpen && (
                        <button
                          onClick={() => setWriteReviewOpen(true)}
                          className="bg-[#131E18] text-brand-saffron hover:bg-brand-charcoal font-display font-bold text-xs py-2.5 px-4.5 rounded-xl flex items-center gap-1.5 cursor-pointer shadow-sm shadow-brand-olive/10"
                        >
                          <PlusCircle size={14} />
                          <span>Write a Review</span>
                        </button>
                      )}
                    </div>

                    {/* WRITE A REVIEW FORM */}
                    {writeReviewOpen && (
                      <form onSubmit={handleSubmitReview} className="p-5 rounded-2xl border border-brand-olive/10 bg-[#FAF8F5]/60 flex flex-col gap-4">
                        <div className="flex justify-between items-center pb-2 border-b border-slate-200">
                          <h4 className="font-display font-bold text-xs text-brand-charcoal uppercase tracking-wider">Rate Your Bibi Dining Experience</h4>
                          <button type="button" onClick={() => setWriteReviewOpen(false)} className="text-slate-400 hover:text-slate-600">
                            <X size={15} />
                          </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div>
                            <label className="block font-sans text-xs font-semibold text-brand-charcoal mb-1.5">Select Meal Platter</label>
                            <select
                              value={reviewMealId}
                              onChange={(e) => setReviewMealId(e.target.value)}
                              className="w-full bg-white text-slate-800 font-sans text-xs px-3 py-2 rounded-xl border border-slate-200 focus:outline-none"
                            >
                              {MEALS.map(m => (
                                <option key={m.id} value={m.id}>{m.name}</option>
                              ))}
                            </select>
                          </div>

                          {/* Star Ratings sliders */}
                          <div>
                            <label className="block font-sans text-xs font-semibold text-brand-charcoal mb-1">Meal Quality</label>
                            <div className="flex gap-1">
                              {[1,2,3,4,5].map((s) => (
                                <button
                                  key={s}
                                  type="button"
                                  onClick={() => setRatingMeal(s)}
                                  className="text-slate-300 hover:text-brand-gold"
                                >
                                  <Star size={18} className={s <= ratingMeal ? 'text-brand-gold fill-brand-gold' : 'text-slate-300'} />
                                </button>
                              ))}
                            </div>
                          </div>

                          <div>
                            <label className="block font-sans text-xs font-semibold text-brand-charcoal mb-1">Delivery Speed / Heat</label>
                            <div className="flex gap-1">
                              {[1,2,3,4,5].map((s) => (
                                <button
                                  key={s}
                                  type="button"
                                  onClick={() => setRatingDelivery(s)}
                                  className="text-slate-300 hover:text-brand-gold"
                                >
                                  <Star size={18} className={s <= ratingDelivery ? 'text-brand-gold fill-brand-gold' : 'text-slate-300'} />
                                </button>
                              ))}
                            </div>
                          </div>
                        </div>

                        <div className="w-full">
                          <label className="block font-sans text-xs font-semibold text-brand-charcoal mb-1.5">Customer Support Rating (Optional)</label>
                          <div className="flex gap-1">
                            {[1,2,3,4,5].map((s) => (
                              <button
                                key={s}
                                type="button"
                                onClick={() => setRatingSupport(s)}
                                className="text-slate-300 hover:text-brand-gold"
                              >
                                <Star size={18} className={s <= ratingSupport ? 'text-brand-gold fill-brand-gold' : 'text-slate-300'} />
                              </button>
                            ))}
                          </div>
                        </div>

                        <div>
                          <label className="block font-sans text-xs font-semibold text-brand-charcoal mb-1.5">Feedback Comments</label>
                          <textarea
                            rows={3}
                            placeholder="Describe how the smoky aroma, seasoning spices and dispatch carriers verified themselves..."
                            value={reviewComment}
                            onChange={(e) => setReviewComment(e.target.value)}
                            className="w-full bg-white text-slate-800 font-sans text-xs px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none resize-none"
                            required
                          />
                        </div>

                        <div className="flex justify-end gap-2.5">
                          <button
                            type="button"
                            onClick={() => setWriteReviewOpen(false)}
                            className="bg-white border border-slate-200 hover:bg-slate-50 text-slate-600 px-4 py-2 rounded-xl text-xs font-sans font-semibold cursor-pointer"
                          >
                            Cancel
                          </button>
                          <button
                            type="submit"
                            className="bg-brand-olive text-brand-saffron hover:bg-brand-charcoal px-5 py-2 rounded-xl text-xs font-display font-bold cursor-pointer"
                          >
                            Compile Feedback
                          </button>
                        </div>
                      </form>
                    )}

                    {/* PAST REVIEWS LIST */}
                    {reviews.length === 0 ? (
                      <div className="text-center py-16 flex flex-col items-center gap-3 bg-[#FAF8F5] rounded-3xl border border-slate-100/40">
                        <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
                          <Star size={24} />
                        </div>
                        <div>
                          <h4 className="font-display font-bold text-xs text-brand-charcoal uppercase tracking-wider">No Reviews Submitted</h4>
                          <p className="font-sans text-xs text-slate-400 mt-1 max-w-xs mx-auto">
                            Rate previous completed order runs to earn loyalty points towards Silver dining levels!
                          </p>
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-col gap-4">
                        {reviews.map((rev) => (
                          <div key={rev.id} className="p-4 rounded-2xl border border-slate-150 bg-white">
                            <div className="flex justify-between items-start gap-2">
                              <div>
                                <span className="font-mono text-[8.5px] text-slate-400 font-bold">{rev.date}</span>
                                <h4 className="font-display font-bold text-xs text-brand-charcoal">{rev.mealName || 'Bibi Assorted Platter'}</h4>
                              </div>

                              {/* Stars */}
                              <div className="flex gap-0.5">
                                {[1,2,3,4,5].map((s) => (
                                  <Star key={s} size={11} className={s <= rev.rating ? 'text-brand-gold fill-brand-gold' : 'text-slate-200'} />
                                ))}
                              </div>
                            </div>
                            <p className="font-sans text-[11px] text-slate-500 mt-2 italic leading-normal">
                              "{rev.comment}"
                            </p>
                            <span className="block font-sans text-[9px] text-brand-basil font-bold mt-2">✓ Verified Customer Dining Run</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* 8. HELP & SUPPORT SUBVIEW */}
                {activeTab === 'help' && (
                  <div className="flex flex-col gap-6">
                    <div className="pb-4 border-b border-slate-100">
                      <h3 className="font-display font-semibold text-sm text-brand-charcoal">
                        Chef Concierge Support Center
                      </h3>
                      <p className="font-sans text-[11px] text-slate-400 mt-0.5">Submit enquiries, resolve payments or chat live with kitchen managers instantly.</p>
                    </div>

                    {/* LIVE CHAT TRIGGERS & NUMBERS */}
                    <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                      <button 
                        type="button"
                        onClick={() => setLiveChatOpen(true)}
                        className="p-4 rounded-2xl border border-brand-basil/20 bg-brand-basil/[0.02] hover:bg-brand-basil/10 transition-all text-left flex flex-col justify-between gap-3 cursor-pointer"
                      >
                        <MessageCircle size={18} className="text-brand-basil" />
                        <div>
                          <span className="block font-sans text-xs font-bold text-brand-charcoal">Live Web Chat</span>
                          <span className="block font-sans text-[9px] text-slate-400 mt-0.5">Chef Concierge online</span>
                        </div>
                      </button>

                      <a 
                        href="https://wa.me/234803BIBI" 
                        target="_blank" 
                        rel="noreferrer" 
                        className="p-4 rounded-2xl border border-emerald-500/10 bg-emerald-50/[0.03] hover:bg-emerald-50 transition-all text-left flex flex-col justify-between gap-3"
                      >
                        <MessageSquare size={18} className="text-emerald-500" />
                        <div>
                          <span className="block font-sans text-xs font-bold text-brand-charcoal">WhatsApp Support</span>
                          <span className="block font-sans text-[9px] text-slate-400 mt-0.5">+234 803 123 4567</span>
                        </div>
                      </a>

                      <a 
                        href="tel:+2348031234567" 
                        className="p-4 rounded-2xl border border-slate-200 bg-white hover:bg-slate-50 transition-all text-left flex flex-col justify-between gap-3"
                      >
                        <Phone size={18} className="text-brand-chili" />
                        <div>
                          <span className="block font-sans text-xs font-bold text-brand-charcoal">Hotline Call</span>
                          <span className="block font-sans text-[9px] text-slate-400 mt-0.5">24/7 Chef dispatch line</span>
                        </div>
                      </a>

                      <a 
                        href="mailto:support@bibifood.com" 
                        className="p-4 rounded-2xl border border-slate-200 bg-white hover:bg-slate-50 transition-all text-left flex flex-col justify-between gap-3"
                      >
                        <Mail size={18} className="text-[#1E3A8A]" />
                        <div>
                          <span className="block font-sans text-xs font-bold text-brand-charcoal">Email Support</span>
                          <span className="block font-sans text-[9px] text-slate-400 mt-0.5">support@bibifood.com</span>
                        </div>
                      </a>
                    </div>

                    {/* LIVE CHAT MODAL INTERACTIVE */}
                    {liveChatOpen && (
                      <div className="fixed inset-0 z-50 bg-brand-charcoal/40 backdrop-blur-sm flex items-center justify-center p-4">
                        <motion.div 
                          initial={{ scale: 0.95, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          className="bg-white rounded-3xl border border-brand-olive/10 shadow-2xl w-full max-w-md overflow-hidden flex flex-col h-[460px]"
                        >
                          {/* Chat Header */}
                          <div className="bg-[#131E18] text-white p-4 flex justify-between items-center">
                            <div className="flex items-center gap-2.5">
                              <BibiLogo mode="icon" className="h-6 w-6" />
                              <div>
                                <h4 className="font-display font-bold text-xs text-white">Chef Concierge Live</h4>
                                <span className="block text-[8px] font-mono text-brand-saffron uppercase">Online & Ready</span>
                              </div>
                            </div>
                            <button onClick={() => setLiveChatOpen(false)} className="text-white hover:text-slate-300">
                              <X size={16} />
                            </button>
                          </div>

                          {/* Chat Messages */}
                          <div className="flex-1 p-4 overflow-y-auto flex flex-col gap-3.5 bg-slate-50">
                            {chatMessages.map((msg, index) => (
                              <div 
                                key={index} 
                                className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                              >
                                <div className={`p-3 rounded-2xl max-w-[80%] text-xs font-sans ${
                                  msg.sender === 'user' 
                                    ? 'bg-brand-olive text-brand-saffron rounded-tr-none' 
                                    : 'bg-white text-slate-700 border border-slate-150 rounded-tl-none'
                                }`}>
                                  <p className="leading-relaxed">{msg.text}</p>
                                  <span className="block text-[8px] opacity-60 text-right mt-1">{msg.time}</span>
                                </div>
                              </div>
                            ))}
                          </div>

                          {/* Chat Form Input */}
                          <form onSubmit={handleSendChatMessage} className="p-3 border-t border-slate-100 flex gap-2 bg-white">
                            <input
                              type="text"
                              value={chatInput}
                              onChange={(e) => setChatInput(e.target.value)}
                              placeholder="Type support query (e.g. status of Jollof)..."
                              className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs focus:outline-none"
                            />
                            <button
                              type="submit"
                              className="bg-brand-olive text-brand-saffron p-2.5 rounded-xl hover:bg-brand-charcoal transition-colors cursor-pointer"
                            >
                              <SendHorizontal size={14} />
                            </button>
                          </form>
                        </motion.div>
                      </div>
                    )}

                    {/* TICKET SUBMIT FORM */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-2">
                      
                      {/* Left: Accordion FAQs */}
                      <div className="flex flex-col gap-3">
                        <h4 className="font-display font-bold text-xs text-brand-charcoal uppercase tracking-wider pb-2 border-b border-slate-100 flex items-center gap-1.5">
                          <HelpCircle size={14} className="text-brand-gold" />
                          <span>Frequently Asked Questions</span>
                        </h4>

                        <div className="flex flex-col gap-2">
                          {[
                            { q: 'How long does dispatch take?', a: 'All items are custom cooked inside local cloud spaces. Typical delivery is completed within 20-30 minutes of receipt.' },
                            { q: 'What is deep-smoked firewood Jollof?', a: 'We smoke our broth under premium country-side firewood kilns to preserve the historic smoked pepper taste.' },
                            { q: 'Can I cancel an active courier run?', a: 'Once the chef verifies and dispatches the thermal seals, cancellations are frozen. You can contact support for rerouting.' },
                            { q: 'Is my credit card processing safe?', a: 'Yes! We use highly secure bank vaults to process transfer payments and card tokens.' }
                          ].map((item, index) => (
                            <div key={index} className="border border-slate-150 rounded-xl overflow-hidden bg-white">
                              <button
                                type="button"
                                onClick={() => setFaqExpanded(faqExpanded === index ? null : index)}
                                className="w-full text-left p-3.5 flex justify-between items-center text-xs font-sans font-bold text-slate-700 bg-slate-50/50 hover:bg-slate-50 transition-colors"
                              >
                                <span>{item.q}</span>
                                <ChevronDown size={14} className={`text-slate-400 transition-transform duration-200 ${faqExpanded === index ? 'rotate-180' : ''}`} />
                              </button>
                              
                              <AnimatePresence>
                                {faqExpanded === index && (
                                  <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: 'auto', opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    className="px-4 py-3 border-t border-slate-100 text-slate-500 text-xs font-sans bg-white leading-relaxed"
                                  >
                                    {item.a}
                                  </motion.div>
                                )}
                              </AnimatePresence>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Right: Submission Box */}
                      <form onSubmit={handleSubmitEnquiry} className="p-5 border border-slate-150 rounded-2xl bg-slate-50/30 flex flex-col gap-4">
                        <h4 className="font-display font-bold text-xs text-brand-charcoal uppercase tracking-wider pb-2 border-b border-slate-200">
                          Submit Support Enquiry / Ticket
                        </h4>

                        <div>
                          <label className="block font-sans text-xs font-semibold text-brand-charcoal mb-1.5">Issue Category</label>
                          <select
                            value={supportCategory}
                            onChange={(e) => setSupportCategory(e.target.value as any)}
                            className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none"
                          >
                            <option value="general">General Enquiry</option>
                            <option value="order">Active Order Dispatch Issue</option>
                            <option value="payment">Failed Bank Transfer / Payment Error</option>
                            <option value="refund">Refund Request Process</option>
                            <option value="issue">App Bugs / Login Problems</option>
                          </select>
                        </div>

                        <div>
                          <label className="block font-sans text-xs font-semibold text-brand-charcoal mb-1.5">Explain Issue Details</label>
                          <textarea
                            rows={4}
                            placeholder="Please specify your order ID or payment timestamp. Our executive dispatch concierges will resolve instantly..."
                            value={supportDescription}
                            onChange={(e) => setSupportDescription(e.target.value)}
                            className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-xs focus:outline-none resize-none"
                            required
                          />
                        </div>

                        <button
                          type="submit"
                          className="bg-brand-olive text-brand-saffron hover:bg-brand-charcoal font-display font-bold text-xs py-2.5 rounded-xl cursor-pointer shadow-sm text-center"
                        >
                          Submit Ticket Log
                        </button>
                      </form>
                    </div>
                  </div>
                )}

                {/* 9. LOYALTY & REWARDS (FUTURE READY) */}
                {activeTab === 'loyalty' && (
                  <div className="flex flex-col gap-6">
                    <div className="pb-4 border-b border-slate-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                      <div>
                        <h3 className="font-display font-semibold text-sm text-brand-charcoal">
                          Loyalty Tiers & Rewards
                        </h3>
                        <p className="font-sans text-[11px] text-slate-400 mt-0.5">Collect points on wood-fire cooked dispatches to earn elite status coupons.</p>
                      </div>
                      
                      <span className="font-mono text-[8px] bg-brand-gold text-brand-charcoal font-black uppercase px-2.5 py-1 rounded-full tracking-wider">
                        Beta Level Open
                      </span>
                    </div>

                    {/* Progress details */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="p-4 rounded-2xl bg-brand-olive text-brand-cream border border-brand-olive shadow-sm flex flex-col justify-between h-36">
                        <Award size={20} className="text-brand-saffron" />
                        <div>
                          <span className="block text-[9px] font-mono text-slate-300 uppercase">Tier Level Status</span>
                          <h4 className="font-display font-extrabold text-sm text-brand-saffron uppercase mt-1">Silver Foodie Club</h4>
                          <p className="text-[10px] text-slate-300">Earn 150 more points for Gold</p>
                        </div>
                      </div>

                      <div className="p-4 rounded-2xl bg-slate-50 border border-slate-150 flex flex-col justify-between h-36">
                        <Gift size={20} className="text-brand-chili" />
                        <div>
                          <span className="block text-[9px] font-mono text-slate-400 uppercase">Reward Points Balance</span>
                          <h4 className="font-display font-extrabold text-sm text-brand-charcoal mt-1">350 Verified Points</h4>
                          <span className="block text-[10px] text-brand-basil font-semibold">✓ ₦3,500 Redeemable Cash equivalent</span>
                        </div>
                      </div>

                      <div className="p-4 rounded-2xl bg-slate-50 border border-slate-150 flex flex-col justify-between h-36">
                        <Percent size={20} className="text-[#1E3A8A]" />
                        <div>
                          <span className="block text-[9px] font-mono text-slate-400 uppercase">Discount Coupons Active</span>
                          <h4 className="font-display font-extrabold text-sm text-brand-charcoal mt-1">3 Coupons Available</h4>
                          <span className="block text-[10px] text-slate-400">Save up to ₦5,000 this month</span>
                        </div>
                      </div>
                    </div>

                    {/* Achievements checklists and copyable referral link */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-2">
                      
                      {/* Left: Achievements */}
                      <div className="flex flex-col gap-3">
                        <h4 className="font-display font-bold text-xs text-brand-charcoal uppercase tracking-wider pb-2 border-b border-slate-100 flex items-center gap-1.5">
                          <CheckSquare size={14} className="text-brand-basil" />
                          <span>Gourmand Achievements Checklist</span>
                        </h4>

                        <div className="flex flex-col gap-2.5">
                          {[
                            { name: '🔥 Jollof Devotee', desc: 'Placed over 5 wood-fire rice orders.', status: 'Completed', pts: '+100 pts' },
                            { name: '🍳 Early Bird Platter', desc: 'Ordered breakfast runs before 08:00 AM.', status: 'Locked', pts: '+50 pts' },
                            { name: '🌶️ Spicy Suya Lover', desc: 'Added spicy cooking instructions to 3 skewers.', status: 'Completed', pts: '+80 pts' },
                            { name: '💳 Cashless Gourmet', desc: 'Completed 3 consecutive bank transfer runs.', status: 'Completed', pts: '+150 pts' }
                          ].map((ach, idx) => (
                            <div key={idx} className="p-3.5 rounded-xl border border-slate-150 bg-white flex items-center justify-between text-xs font-sans">
                              <div>
                                <span className="block font-bold text-slate-800">{ach.name}</span>
                                <span className="block text-[10px] text-slate-400 mt-0.5">{ach.desc}</span>
                              </div>
                              <div className="text-right shrink-0 ml-2">
                                <span className={`block text-[9px] font-mono font-black uppercase px-2 py-0.5 rounded-full ${
                                  ach.status === 'Completed' ? 'bg-brand-basil/10 text-brand-basil' : 'bg-slate-100 text-slate-400'
                                }`}>
                                  {ach.status}
                                </span>
                                <span className="block text-[10px] text-brand-olive font-bold mt-1">{ach.pts}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Right: Referral link copy box */}
                      <div className="flex flex-col gap-3">
                        <h4 className="font-display font-bold text-xs text-brand-charcoal uppercase tracking-wider pb-2 border-b border-slate-100 flex items-center gap-1.5">
                          <Share2 size={14} className="text-[#1E3A8A]" />
                          <span>Referral Perks Program</span>
                        </h4>

                        <div className="p-5 border border-slate-150 rounded-2xl bg-slate-50/20 flex flex-col gap-4">
                          <p className="font-sans text-xs text-slate-500 leading-relaxed">
                            Share your verified culinary invite link. When friends order their first smoky Jollof or Suya skewers, both accounts receive <b>₦1,500 direct credits</b>!
                          </p>

                          <div className="flex gap-2">
                            <input
                              type="text"
                              disabled
                              value={`https://bibifood.com/invite?code=CHEF-${firstName.toUpperCase()}-882`}
                              className="flex-1 bg-white border border-slate-200 rounded-xl px-3 py-2 text-[10px] font-mono text-slate-500 cursor-not-allowed select-all"
                            />
                            <button
                              type="button"
                              onClick={() => {
                                navigator.clipboard.writeText(`https://bibifood.com/invite?code=CHEF-${firstName.toUpperCase()}-882`);
                                triggerSuccess('Referral invite link copied!');
                              }}
                              className="bg-[#131E18] text-brand-saffron hover:bg-brand-charcoal p-2.5 rounded-xl cursor-pointer flex items-center justify-center"
                              title="Copy Invite Link"
                            >
                              <Copy size={13} />
                            </button>
                          </div>

                          <div className="border-t border-slate-200 pt-3.5 mt-1">
                            <span className="block text-[9px] font-mono text-slate-400 uppercase tracking-widest">LOYALTY PLATFORM ROADMAP</span>
                            <span className="block font-sans text-xs font-bold text-brand-chili mt-1 flex items-center gap-1">
                              <Sparkles size={13} className="animate-spin text-brand-gold" />
                              <span>More Membership benefits coming soon inside Phase 4!</span>
                            </span>
                          </div>
                        </div>
                      </div>

                    </div>
                  </div>
                )}

                {/* 10. SETTINGS SUBVIEW */}
                {activeTab === 'settings' && (
                  <div className="flex flex-col gap-6">
                    
                    {/* Password form */}
                    <form onSubmit={handlePasswordUpdate} className="flex flex-col gap-4 pb-6 border-b border-slate-100">
                      <div className="flex justify-between items-center pb-2 border-b border-slate-100">
                        <h4 className="font-display font-semibold text-xs text-brand-charcoal uppercase tracking-wider">Cycle Credentials Auth Password</h4>
                        <button type="submit" className="bg-[#131E18] text-brand-saffron hover:bg-brand-charcoal px-4 py-2 rounded-xl text-xs font-display font-bold cursor-pointer">
                          Apply Password
                        </button>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <label className="block font-sans text-xs font-semibold text-slate-700 mb-1.5">Current Password</label>
                          <div className="relative">
                            <input
                              type={showPwd1 ? 'text' : 'password'}
                              value={currentPassword}
                              onChange={(e) => setCurrentPassword(e.target.value)}
                              placeholder="••••••••"
                              className="w-full bg-slate-50 text-slate-800 font-sans text-xs px-4 py-2.5 pr-11 rounded-xl border border-slate-200 focus:outline-none"
                              required
                            />
                            <button type="button" onClick={() => setShowPwd1(!showPwd1)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400">
                              {showPwd1 ? <EyeOff size={13} /> : <Eye size={13} />}
                            </button>
                          </div>
                        </div>

                        <div>
                          <label className="block font-sans text-xs font-semibold text-slate-700 mb-1.5">New Password</label>
                          <div className="relative">
                            <input
                              type={showPwd2 ? 'text' : 'password'}
                              value={newPassword}
                              onChange={(e) => setNewPassword(e.target.value)}
                              placeholder="Min 6 characters"
                              className="w-full bg-slate-50 text-slate-800 font-sans text-xs px-4 py-2.5 pr-11 rounded-xl border border-slate-200 focus:outline-none"
                              required
                            />
                            <button type="button" onClick={() => setShowPwd2(!showPwd2)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400">
                              {showPwd2 ? <EyeOff size={13} /> : <Eye size={13} />}
                            </button>
                          </div>
                        </div>

                        <div>
                          <label className="block font-sans text-xs font-semibold text-slate-700 mb-1.5">Confirm New Password</label>
                          <div className="relative">
                            <input
                              type={showPwd3 ? 'text' : 'password'}
                              value={confirmPassword}
                              onChange={(e) => setConfirmPassword(e.target.value)}
                              placeholder="Min 6 characters"
                              className="w-full bg-slate-50 text-slate-800 font-sans text-xs px-4 py-2.5 pr-11 rounded-xl border border-slate-200 focus:outline-none"
                              required
                            />
                            <button type="button" onClick={() => setShowPwd3(!showPwd3)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400">
                              {showPwd3 ? <EyeOff size={13} /> : <Eye size={13} />}
                            </button>
                          </div>
                        </div>
                      </div>
                    </form>

                    {/* Notifications preferences triggers */}
                    <div className="flex flex-col gap-4 pb-6 border-b border-slate-100">
                      <h4 className="font-display font-semibold text-xs text-brand-charcoal uppercase tracking-wider">Channel Preferences</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-sans">
                        <label className="flex items-start gap-3 p-3 bg-slate-50 rounded-xl cursor-pointer">
                          <input type="checkbox" checked={notifOrderPref} onChange={(e) => { setNotifOrderPref(e.target.checked); triggerSuccess('Preferences saved!'); }} className="mt-0.5 rounded text-brand-olive focus:ring-brand-olive" />
                          <div>
                            <span className="block font-bold">Courier & Dispatch Alerts</span>
                            <span className="block text-slate-400 text-[10px] mt-0.5">Real-time GPS dispatch and PIN updates.</span>
                          </div>
                        </label>

                        <label className="flex items-start gap-3 p-3 bg-slate-50 rounded-xl cursor-pointer">
                          <input type="checkbox" checked={notifPromoPref} onChange={(e) => { setNotifPromoPref(e.target.checked); triggerSuccess('Preferences saved!'); }} className="mt-0.5 rounded text-brand-olive focus:ring-brand-olive" />
                          <div>
                            <span className="block font-bold">Marketing Weekly Perks</span>
                            <span className="block text-slate-400 text-[10px] mt-0.5">Flash discount codes and expansion announcements.</span>
                          </div>
                        </label>

                        <label className="flex items-start gap-3 p-3 bg-slate-50 rounded-xl cursor-pointer">
                          <input type="checkbox" checked={notifEmailPref} onChange={(e) => { setNotifEmailPref(e.target.checked); triggerSuccess('Preferences saved!'); }} className="mt-0.5 rounded text-brand-olive focus:ring-brand-olive" />
                          <div>
                            <span className="block font-bold">Transmissions via Email</span>
                            <span className="block text-slate-400 text-[10px] mt-0.5">PDF invoice receipts and statements.</span>
                          </div>
                        </label>

                        <label className="flex items-start gap-3 p-3 bg-slate-50 rounded-xl cursor-pointer">
                          <input type="checkbox" checked={notifSmsPref} onChange={(e) => { setNotifSmsPref(e.target.checked); triggerSuccess('Preferences saved!'); }} className="mt-0.5 rounded text-brand-olive focus:ring-brand-olive" />
                          <div>
                            <span className="block font-bold">Yaba / Lekki telecom SMS</span>
                            <span className="block text-slate-400 text-[10px] mt-0.5">Direct SMS texts on orders dispatches.</span>
                          </div>
                        </label>
                      </div>
                    </div>

                    {/* Language and regional dropdown */}
                    <div className="flex flex-col gap-4 pb-6 border-b border-slate-100">
                      <h4 className="font-display font-semibold text-xs text-brand-charcoal uppercase tracking-wider">Language & Regional Defaults</h4>
                      <div className="max-w-md">
                        <select
                          value={lang}
                          onChange={(e) => { setLang(e.target.value); triggerSuccess('Display interface localized!'); }}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none cursor-pointer"
                        >
                          <option value="en">English (United Kingdom / Nigeria)</option>
                          <option value="yo">Yorùbá</option>
                          <option value="ha">Hausa</option>
                          <option value="ig">Igbo</option>
                        </select>
                      </div>
                    </div>

                    {/* Privacy policy summary */}
                    <div className="p-4 bg-[#FAF8F5] border border-slate-150 rounded-xl text-xs font-sans text-slate-500 leading-normal">
                      <h5 className="font-bold text-slate-700 flex items-center gap-1.5 mb-1">
                        <Shield size={13} className="text-brand-basil" />
                        <span>GDPR & NDPA Privacy Assurance</span>
                      </h5>
                      We utilize top-tier encryption algorithms to store your phone credentials and physical landmark coordinates. No logs are traded with external middlemen.
                    </div>

                    {/* Delete Account triggers */}
                    <div className="pt-4 flex justify-between items-center">
                      <span className="text-slate-400 text-xs font-sans">Danger Zone:</span>
                      <button
                        type="button"
                        onClick={() => setDeleteAccountModalOpen(true)}
                        className="bg-rose-50 border border-rose-100 text-rose-600 hover:bg-rose-100 px-4 py-2 rounded-xl text-xs font-sans font-bold cursor-pointer transition-colors"
                      >
                        Delete Account
                      </button>
                    </div>

                    {/* DELETE ACCOUNT CONFIRMATION MODAL */}
                    {deleteAccountModalOpen && (
                      <div className="fixed inset-0 z-50 bg-brand-charcoal/40 backdrop-blur-sm flex items-center justify-center p-4">
                        <motion.div 
                          initial={{ scale: 0.95, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          className="bg-white rounded-3xl border border-rose-150 shadow-2xl p-6 w-full max-w-md flex flex-col gap-4"
                        >
                          <div className="flex items-center gap-2 text-[#C62828]">
                            <AlertTriangle size={20} />
                            <h4 className="font-display font-black text-sm uppercase tracking-wider">Decommission Bibi Account?</h4>
                          </div>
                          
                          <p className="font-sans text-xs text-slate-500 leading-relaxed">
                            Warning! Decommissioning your Chef profile will permanently purge active reward points, historical completed runs and saved delivery coordinate logs. This is irreversible.
                          </p>

                          <form onSubmit={handleDeleteAccountSubmit} className="flex flex-col gap-3">
                            <label className="block font-sans text-[11px] text-slate-400 font-bold">Type <b>DELETE</b> in uppercase to verify:</label>
                            <input
                              type="text"
                              value={deleteConfirmText}
                              onChange={(e) => setDeleteConfirmText(e.target.value)}
                              placeholder="DELETE"
                              className="w-full bg-slate-50 text-slate-800 font-sans text-xs px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none"
                              required
                            />

                            <div className="flex justify-end gap-2 mt-2">
                              <button
                                type="button"
                                onClick={() => { setDeleteAccountModalOpen(false); setDeleteConfirmText(''); }}
                                className="bg-[#FAF8F5] border border-slate-250 text-slate-600 px-4 py-2 rounded-xl text-xs font-sans font-bold cursor-pointer"
                              >
                                Cancel
                              </button>
                              <button
                                type="submit"
                                className="bg-rose-600 text-white hover:bg-rose-700 px-5 py-2 rounded-xl text-xs font-display font-bold cursor-pointer"
                              >
                                Purge Account
                              </button>
                            </div>
                          </form>
                        </motion.div>
                      </div>
                    )}

                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </main>
      </div>

      {/* RESPONSIVE BOTTOM NAVIGATION BAR FOR MOBILE SCREENS */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-slate-200 lg:hidden px-4 py-2 shadow-[0_-4px_12px_rgba(0,0,0,0.05)]">
        <div className="flex justify-around items-center">
          {[
            { id: 'home', label: 'Home', icon: Shield },
            { id: 'orders', label: 'Orders', icon: List, count: activeOrder ? 1 : 0 },
            { id: 'favorites', label: 'Favorites', icon: Heart, count: favorites.length },
            { id: 'profile', label: 'Profile', icon: User },
            { id: 'more', label: 'Settings', icon: Lock }
          ].map((b) => {
            const IconComp = b.icon;
            const isSelected = activeTab === b.id || (b.id === 'more' && ['notifications', 'reviews', 'help', 'loyalty', 'settings'].includes(activeTab));
            return (
              <button
                key={b.id}
                onClick={() => {
                  if (b.id === 'more') {
                    setActiveTab('settings');
                  } else {
                    setActiveTab(b.id);
                  }
                  setErrorMsg('');
                }}
                className="flex flex-col items-center gap-0.5 p-1 relative cursor-pointer"
              >
                <div className="relative">
                  <IconComp size={16} className={isSelected ? 'text-brand-chili' : 'text-slate-400'} />
                  {b.count ? (
                    <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-brand-chili text-white font-mono text-[8px] rounded-full flex items-center justify-center">
                      {b.count}
                    </span>
                  ) : null}
                </div>
                <span className={`text-[9px] font-sans font-semibold tracking-wide ${isSelected ? 'text-brand-chili font-bold' : 'text-slate-400'}`}>
                  {b.label}
                </span>
              </button>
            );
          })}
        </div>
      </nav>

    </div>
  );
}
