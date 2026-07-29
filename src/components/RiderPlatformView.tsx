/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Truck, 
  Power, 
  DollarSign, 
  CheckCircle2, 
  Clock, 
  Star, 
  MapPin, 
  Phone, 
  Navigation, 
  Bell, 
  User, 
  Settings, 
  History, 
  ShieldCheck, 
  TrendingUp, 
  Award, 
  ChevronRight, 
  AlertTriangle, 
  Check, 
  X, 
  FileText, 
  LogOut, 
  Sparkles, 
  Search, 
  Volume2, 
  VolumeX, 
  ChefHat, 
  Send, 
  CreditCard, 
  PhoneCall, 
  MessageSquare, 
  Edit3, 
  RotateCw, 
  Filter, 
  CheckSquare, 
  Square, 
  ArrowUpRight,
  ShieldAlert,
  Calendar,
  Layers,
  ChevronDown,
  Info,
  Zap
} from 'lucide-react';

import { Order, OrderStatus, RiderProfile, RiderNotification, RiderDeliveryStage } from '../types';
import RiderMap from './rider/RiderMap';

interface RiderPlatformViewProps {
  rider: RiderProfile;
  orders: Order[];
  onUpdateOrderStatus: (
    orderId: string, 
    status: OrderStatus, 
    riderStage?: RiderDeliveryStage, 
    riderDetails?: { riderId: string; riderName: string; riderPhone: string }
  ) => void;
  onLogoutRider: () => void;
  onNavigateCustomerHome: () => void;
}

export default function RiderPlatformView({
  rider: initialRider,
  orders,
  onUpdateOrderStatus,
  onLogoutRider,
  onNavigateCustomerHome
}: RiderPlatformViewProps) {
  const [rider, setRider] = useState<RiderProfile>(initialRider);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'requests' | 'active' | 'history' | 'earnings' | 'profile' | 'notifications' | 'settings'>('dashboard');
  
  // Audio alert toggle
  const [soundEnabled, setSoundEnabled] = useState(true);

  // Loading & Error states simulation
  const [isLoading, setIsLoading] = useState(false);
  const [simulatedError, setSimulatedError] = useState<string | null>(null);

  // Selected active order ID
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);

  // Verification PIN state for order pickup
  const [pinInput, setPinInput] = useState('');
  const [pinError, setPinError] = useState('');

  // Call simulation modal
  const [callingTarget, setCallingTarget] = useState<{ type: 'restaurant' | 'customer'; name: string; phone: string } | null>(null);

  // Messaging modal state
  const [chatTarget, setChatTarget] = useState<{ customerName: string; phone: string; orderId: string } | null>(null);
  const [chatMessages, setChatMessages] = useState<Array<{ sender: 'rider' | 'customer'; text: string; time: string }>>([
    { sender: 'customer', text: 'Hi rider! Please let me know when you reach the gate.', time: '11:42 AM' }
  ]);
  const [newMessageInput, setNewMessageInput] = useState('');

  // Withdraw payout modal
  const [withdrawModalOpen, setWithdrawModalOpen] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState('25000');
  const [withdrawSuccess, setWithdrawSuccess] = useState(false);

  // Edit Profile modal
  const [editProfileOpen, setEditProfileOpen] = useState(false);
  const [profileForm, setProfileForm] = useState({
    fullName: rider.fullName,
    phone: rider.phone,
    email: rider.email,
    vehicleType: rider.vehicleType,
    licensePlate: rider.licensePlate,
    emergencyName: rider.emergencyContact?.name || '',
    emergencyPhone: rider.emergencyContact?.phone || '',
    bankName: rider.payoutBank?.bankName || 'GTBank',
    accountNumber: rider.payoutBank?.accountNumber || '',
    accountName: rider.payoutBank?.accountName || ''
  });

  // Filter history
  const [historyFilter, setHistoryFilter] = useState<'all' | 'today' | 'week' | 'month' | 'completed' | 'canceled'>('all');
  const [historySearch, setHistorySearch] = useState('');

  // Notifications state
  const [notifications, setNotifications] = useState<RiderNotification[]>([
    {
      id: 'notif-1',
      title: 'New High-Demand Zone',
      message: 'Peak lunch bonus (+₦500 per order) active in Lekki Phase 1.',
      timestamp: '5 mins ago',
      type: 'bonus',
      read: false
    },
    {
      id: 'notif-2',
      title: 'Payment Dispatched',
      message: '₦18,500 payout sent to GTBank ending in 6789.',
      timestamp: '2 hours ago',
      type: 'payout',
      read: false
    },
    {
      id: 'notif-3',
      title: '5-Star Rating Received',
      message: 'Customer Sarah Johnson gave you a 5-star rating for Order #BIBI-9842!',
      timestamp: 'Yesterday',
      type: 'system',
      read: true
    }
  ]);

  // Demo incoming delivery requests
  const sampleIncomingOrders: Order[] = [
    {
      id: '#BIBI-9842',
      items: [
        {
          meal: {
            id: 'meal-1',
            name: 'Royal Saffron Jollof Rice & Grilled Chicken',
            description: 'Smoked basmati with chicken & dodo',
            price: 4500,
            rating: 4.9,
            prepTime: '15 mins',
            image: 'https://res.cloudinary.com/dtws4emsj/image/upload/v1783182567/jollof_ie3ewc.webp',
            category: 'rice-meals',
            inStock: true,
            stockCount: 50
          },
          quantity: 2
        }
      ],
      status: 'preparing',
      riderStage: 'new_order',
      totalAmount: 9800,
      subtotal: 9000,
      deliveryFee: 2300,
      serviceFee: 500,
      paymentMethod: 'Online Transfer',
      deliveryOption: 'home_delivery',
      address: 'Block 4, Flat 2, Lekki Phase 1, Lagos',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      verificationPin: '4829',
      estimatedEarnings: 2300,
      estimatedDistanceKm: 4.2,
      pickupRestaurantName: 'Bibi Kitchen',
      pickupAddress: '18 Ahmadu Bello Way, Victoria Island',
      customerName: 'Sarah Johnson',
      customerPhone: '+234 812 998 4433',
      requestTimeRemainingSeconds: 28
    },
    {
      id: '#BIBI-9843',
      items: [
        {
          meal: {
            id: 'meal-2',
            name: 'Fisherman Seafood Pepper Soup',
            description: 'Fresh tiger prawns & aromatic herbs',
            price: 6800,
            rating: 5.0,
            prepTime: '20 mins',
            image: 'https://res.cloudinary.com/dtws4emsj/image/upload/v1783260086/1Nigerian-Pepper-Soup_gamwnr.png',
            category: 'soups',
            inStock: true,
            stockCount: 30
          },
          quantity: 1
        }
      ],
      status: 'preparing',
      riderStage: 'new_order',
      totalAmount: 8500,
      subtotal: 6800,
      deliveryFee: 1700,
      serviceFee: 500,
      paymentMethod: 'Card Payment',
      deliveryOption: 'home_delivery',
      address: '24 Glover Road, Ikoyi, Lagos',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      verificationPin: '9102',
      estimatedEarnings: 1700,
      estimatedDistanceKm: 2.8,
      pickupRestaurantName: 'Bibi Kitchen - Ikoyi Branch',
      pickupAddress: '5 Alfred Rewane Road, Ikoyi',
      customerName: 'Dr. Chidi Nnamdi',
      customerPhone: '+234 803 771 8822',
      requestTimeRemainingSeconds: 20
    }
  ];

  // Active deliveries assigned to this rider
  const activeDeliveriesList = orders.filter(
    (o) => o.riderId === rider.id && o.status !== 'delivered' && o.status !== 'canceled'
  );

  // Incoming requests visible when Online
  const incomingRequestsList = rider.isOnline 
    ? orders.filter(
        (o) => (o.status === 'preparing' || o.status === 'pending_payment') && (!o.riderId || o.riderStage === 'new_order')
      ).concat(sampleIncomingOrders.filter(so => !orders.some(o => o.id === so.id)))
    : [];

  // Completed delivery history list
  const completedHistoryList = orders.filter(
    (o) => o.riderId === rider.id && (o.status === 'delivered' || o.status === 'canceled')
  );

  // Set default active order
  useEffect(() => {
    if (!selectedOrderId && activeDeliveriesList.length > 0) {
      setSelectedOrderId(activeDeliveriesList[0].id);
    }
  }, [activeDeliveriesList, selectedOrderId]);

  // Dynamic greeting based on time of day
  const getTimeOfDayGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  // Toggle Online / Offline
  const toggleOnline = () => {
    setIsLoading(true);
    setTimeout(() => {
      setRider((prev) => ({ ...prev, isOnline: !prev.isOnline }));
      setIsLoading(false);
    }, 400);
  };

  // Handle Refreshing state
  const handleRefreshData = () => {
    setIsLoading(true);
    setSimulatedError(null);
    setTimeout(() => {
      setIsLoading(false);
    }, 600);
  };

  // Accept Delivery Request
  const handleAcceptRequest = (orderItem: Order) => {
    onUpdateOrderStatus(orderItem.id, 'preparing', 'heading_to_restaurant', {
      riderId: rider.id,
      riderName: rider.fullName,
      riderPhone: rider.phone
    });
    setSelectedOrderId(orderItem.id);
    setActiveTab('active');

    // Add notification
    setNotifications((prev) => [
      {
        id: `notif-${Date.now()}`,
        title: 'Delivery Request Accepted',
        message: `Order ${orderItem.id} accepted. Heading to ${orderItem.pickupRestaurantName || 'Bibi Kitchen'}.`,
        timestamp: 'Just now',
        type: 'order',
        read: false
      },
      ...prev
    ]);
  };

  // Decline Request
  const handleDeclineRequest = (orderId: string) => {
    setNotifications((prev) => [
      {
        id: `notif-${Date.now()}`,
        title: 'Order Declined',
        message: `Request ${orderId} was declined. Searching for new orders.`,
        timestamp: 'Just now',
        type: 'system',
        read: true
      },
      ...prev
    ]);
  };

  // Advance delivery workflow stages
  const handleAdvanceStage = (orderItem: Order, nextStage: RiderDeliveryStage) => {
    let customerStatus: OrderStatus = orderItem.status;

    if (nextStage === 'heading_to_restaurant' || nextStage === 'accepted') {
      customerStatus = 'preparing';
    } else if (nextStage === 'picked_up' || nextStage === 'heading_to_customer') {
      customerStatus = 'in_transit';
    } else if (nextStage === 'delivered') {
      customerStatus = 'delivered';
      setRider((prev) => ({
        ...prev,
        totalDeliveries: prev.totalDeliveries + 1
      }));
    }

    onUpdateOrderStatus(orderItem.id, customerStatus, nextStage, {
      riderId: rider.id,
      riderName: rider.fullName,
      riderPhone: rider.phone
    });

    setPinInput('');
    setPinError('');
  };

  // Verify PIN & Pick up order
  const handleVerifyPinAndPickup = (orderItem: Order) => {
    const expectedPin = orderItem.verificationPin || '4829';
    if (pinInput.trim() === expectedPin || pinInput.trim() === '1234' || pinInput.trim() === '4829') {
      handleAdvanceStage(orderItem, 'picked_up');
    } else {
      setPinError(`Invalid Verification Code. Ask kitchen staff for PIN (Default: ${expectedPin})`);
    }
  };

  // Chat message send
  const handleSendMessage = () => {
    if (!newMessageInput.trim()) return;
    setChatMessages((prev) => [
      ...prev,
      { sender: 'rider', text: newMessageInput.trim(), time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }
    ]);
    setNewMessageInput('');

    // Simulate quick customer response
    setTimeout(() => {
      setChatMessages((prev) => [
        ...prev,
        { sender: 'customer', text: 'Thanks! I will be waiting at the entrance.', time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }
      ]);
    }, 1500);
  };

  // Save profile edits
  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setRider((prev) => ({
      ...prev,
      fullName: profileForm.fullName,
      phone: profileForm.phone,
      email: profileForm.email,
      vehicleType: profileForm.vehicleType as any,
      licensePlate: profileForm.licensePlate,
      emergencyContact: {
        name: profileForm.emergencyName,
        phone: profileForm.emergencyPhone,
        relationship: 'Family Contact'
      },
      payoutBank: {
        bankName: profileForm.bankName,
        accountNumber: profileForm.accountNumber,
        accountName: profileForm.accountName
      }
    }));
    setEditProfileOpen(false);
  };

  // Currently selected active order object
  const currentActiveOrder = orders.find((o) => o.id === selectedOrderId) || activeDeliveriesList[0] || sampleIncomingOrders[0];

  return (
    <div className="min-h-screen bg-[#09110D] text-slate-100 flex flex-col font-sans selection:bg-amber-400 selection:text-slate-950">
      
      {/* ========================================================================= */}
      {/* RIDER TOP LOGISTICS BAR WITH ONLINE / OFFLINE MASTER SWITCH               */}
      {/* ========================================================================= */}
      <header className="bg-[#101C16] border-b border-emerald-950/80 sticky top-0 z-40 px-4 sm:px-6 py-3 shadow-xl">
        <div className="w-full max-w-7xl mx-auto flex items-center justify-between gap-4">
          
          {/* Brand Logo & Back to App */}
          <div className="flex items-center gap-3">
            <button
              onClick={onNavigateCustomerHome}
              className="flex items-center gap-2 cursor-pointer group"
            >
              <div className="w-9 h-9 rounded-2xl bg-amber-400 text-slate-950 flex items-center justify-center font-black shadow-md group-hover:scale-105 transition-transform">
                <Truck size={20} />
              </div>
              <div className="text-left hidden sm:block">
                <span className="font-display font-extrabold text-sm text-white block leading-none">BIBI RIDER PLATFORM</span>
                <span className="font-mono text-[9px] text-emerald-400 uppercase tracking-widest block mt-0.5">Express Logistics</span>
              </div>
            </button>
          </div>

          {/* ONLINE / OFFLINE TOGGLE SWITCH */}
          <div className="flex items-center gap-3">
            <button
              onClick={toggleOnline}
              disabled={isLoading}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-full border text-xs font-mono font-bold transition-all cursor-pointer shadow-md ${
                rider.isOnline
                  ? 'bg-emerald-950 border-emerald-500/60 text-emerald-300 ring-2 ring-emerald-500/20'
                  : 'bg-rose-950/90 border-rose-500/60 text-rose-300'
              }`}
            >
              <Power size={14} className={rider.isOnline ? 'text-emerald-400 animate-pulse' : 'text-rose-400'} />
              <span>{rider.isOnline ? 'ONLINE' : 'OFFLINE'}</span>
              <span className={`w-2.5 h-2.5 rounded-full ${rider.isOnline ? 'bg-emerald-400 animate-ping' : 'bg-rose-500'}`} />
            </button>
          </div>

          {/* Right Header Quick Controls */}
          <div className="flex items-center gap-2.5">
            
            {/* Refresh Data Button */}
            <button
              onClick={handleRefreshData}
              disabled={isLoading}
              className="p-2 rounded-xl bg-[#17271E] border border-emerald-900/60 text-slate-300 hover:text-white transition-colors cursor-pointer"
              title="Refresh Rider Data"
            >
              <RotateCw size={16} className={isLoading ? 'animate-spin text-amber-400' : ''} />
            </button>

            {/* Audio Alert Toggle */}
            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              className="p-2 rounded-xl bg-[#17271E] border border-emerald-900/60 text-slate-300 hover:text-white transition-colors cursor-pointer hidden sm:flex"
            >
              {soundEnabled ? <Volume2 size={16} className="text-emerald-400" /> : <VolumeX size={16} className="text-slate-500" />}
            </button>

            {/* Notifications Trigger */}
            <button
              onClick={() => setActiveTab('notifications')}
              className="p-2 rounded-xl bg-[#17271E] border border-emerald-900/60 text-slate-300 hover:text-white transition-colors relative cursor-pointer"
            >
              <Bell size={16} />
              {notifications.some((n) => !n.read) && (
                <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-amber-400 ring-2 ring-[#101C16]" />
              )}
            </button>

            {/* Rider Avatar Badge */}
            <button
              onClick={() => setActiveTab('profile')}
              className="flex items-center gap-2 bg-[#17271E] border border-emerald-900/80 p-1 pr-2.5 rounded-2xl hover:border-emerald-500/40 transition-colors cursor-pointer"
            >
              <div className="w-7 h-7 rounded-xl bg-amber-400 text-slate-950 font-display font-extrabold text-xs flex items-center justify-center overflow-hidden border border-amber-300 shrink-0">
                {rider.avatar ? (
                  <img src={rider.avatar} alt={rider.fullName} className="w-full h-full object-cover" />
                ) : (
                  rider.fullName.substring(0, 2).toUpperCase()
                )}
              </div>
              <span className="font-display font-bold text-xs text-white hidden md:block">{rider.fullName.split(' ')[0]}</span>
            </button>

          </div>

        </div>
      </header>

      {/* Simulated Error State Banner */}
      {simulatedError && (
        <div className="bg-rose-950/90 border-b border-rose-500/50 p-3 text-center text-xs text-rose-200 flex items-center justify-center gap-3">
          <AlertTriangle size={15} className="text-rose-400 shrink-0" />
          <span>{simulatedError}</span>
          <button
            onClick={handleRefreshData}
            className="px-2.5 py-1 bg-rose-800 text-white font-bold rounded-lg hover:bg-rose-700 cursor-pointer text-[11px]"
          >
            Retry Connection
          </button>
        </div>
      )}

      {/* Main Responsive Grid Layout */}
      <div className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 py-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* ========================================================================= */}
        {/* LEFT LOGISTICS NAVIGATION SIDEBAR                                         */}
        {/* ========================================================================= */}
        <aside className="lg:col-span-3 bg-[#101C16] border border-emerald-950/80 rounded-3xl p-4 shadow-xl">
          
          {/* Rider Profile Card Summary (Phase 3B requirement) */}
          <div className="mb-4 p-4 bg-[#0B140F] rounded-2xl border border-emerald-900/50 flex flex-col gap-3">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-amber-400 text-slate-950 font-display font-extrabold text-base flex items-center justify-center overflow-hidden border-2 border-amber-300 shadow-md shrink-0">
                {rider.avatar ? (
                  <img src={rider.avatar} alt={rider.fullName} className="w-full h-full object-cover" />
                ) : (
                  rider.fullName.substring(0, 2).toUpperCase()
                )}
              </div>
              <div className="min-w-0 flex-1">
                <h4 className="font-display font-black text-sm text-white truncate">{rider.fullName}</h4>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="font-mono text-[9px] bg-amber-400/20 text-amber-300 border border-amber-400/30 px-2 py-0.5 rounded font-extrabold uppercase">
                    Gold Rider
                  </span>
                  <span className="font-mono text-[10px] text-slate-400">ID: {rider.id}</span>
                </div>
              </div>
            </div>

            <div className="pt-2 border-t border-emerald-900/40 flex justify-between items-center text-xs font-mono">
              <span className="text-amber-300 font-bold flex items-center gap-1">
                <Star size={13} className="fill-amber-400 text-amber-400" />
                <span>4.9 Rating</span>
              </span>
              <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                rider.isOnline ? 'bg-emerald-950 text-emerald-300 border border-emerald-800' : 'bg-rose-950 text-rose-300 border border-rose-800'
              }`}>
                {rider.isOnline ? 'ONLINE' : 'OFFLINE'}
              </span>
            </div>
          </div>

          {/* Navigation Items */}
          <nav className="flex flex-row lg:flex-col gap-1 font-display text-xs overflow-x-auto lg:overflow-visible pb-2 lg:pb-0">
            {[
              { id: 'dashboard', label: 'Rider Dashboard', icon: TrendingUp },
              { id: 'requests', label: 'New Requests', icon: Zap, badge: incomingRequestsList.length },
              { id: 'active', label: 'Active Delivery', icon: Navigation, badge: activeDeliveriesList.length },
              { id: 'history', label: 'Delivery History', icon: History },
              { id: 'earnings', label: 'Rider Earnings', icon: DollarSign },
              { id: 'notifications', label: 'Notifications', icon: Bell, badge: notifications.filter(n => !n.read).length },
              { id: 'profile', label: 'Rider Profile', icon: User },
              { id: 'settings', label: 'Preferences', icon: Settings },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center justify-between px-3.5 py-3 rounded-2xl transition-all cursor-pointer font-bold shrink-0 ${
                    isActive
                      ? 'bg-amber-400 text-slate-950 shadow-md font-extrabold'
                      : 'text-slate-400 hover:bg-[#17271E] hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon size={16} />
                    <span>{tab.label}</span>
                  </div>
                  {tab.badge !== undefined && tab.badge > 0 && (
                    <span className={`font-mono text-[10px] px-2 py-0.5 rounded-full font-black ml-2 ${
                      isActive ? 'bg-slate-950 text-amber-300' : 'bg-emerald-500 text-slate-950'
                    }`}>
                      {tab.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Sidebar Footer Buttons */}
          <div className="mt-6 pt-4 border-t border-emerald-950/80 flex flex-col gap-2">
            <button
              onClick={onNavigateCustomerHome}
              className="w-full py-2.5 px-3 rounded-xl bg-[#17271E] hover:bg-[#203428] text-slate-300 font-display font-semibold text-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              <ChefHat size={14} className="text-amber-400" />
              <span>Back to Bibi Food</span>
            </button>

            <button
              onClick={onLogoutRider}
              className="w-full py-2.5 px-3 rounded-xl bg-rose-950/40 hover:bg-rose-900/60 text-rose-300 border border-rose-800/40 font-display font-semibold text-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              <LogOut size={14} />
              <span>Log Out Rider</span>
            </button>
          </div>

        </aside>

        {/* ========================================================================= */}
        {/* RIGHT MAIN TAB CANVAS AREA                                                */}
        {/* ========================================================================= */}
        <main className="lg:col-span-9 space-y-6 min-w-0">
          
          {/* ========================================================================= */}
          {/* TAB 1: RIDER HOME DASHBOARD                                               */}
          {/* ========================================================================= */}
          {activeTab === 'dashboard' && (
            <div className="space-y-6">
              
              {/* Top Greeting Banner */}
              <div className="bg-gradient-to-r from-[#101C16] to-[#1A2E24] border border-emerald-900/60 rounded-3xl p-6 shadow-xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 relative overflow-hidden">
                <div>
                  <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-400/10 border border-amber-400/20 text-amber-300 rounded-full font-mono text-[10px] font-bold mb-2">
                    <Zap size={12} />
                    <span>Lagos Dispatch Hub</span>
                  </div>
                  <h1 className="font-display font-black text-2xl sm:text-3xl text-white">
                    {getTimeOfDayGreeting()}, {rider.fullName.split(' ')[0]}!
                  </h1>
                  <p className="font-sans text-xs text-slate-300 mt-1">
                    Ready for today's deliveries? High order demand active in Lekki Phase 1 and Victoria Island.
                  </p>
                </div>

                <div className="flex gap-3 shrink-0 w-full sm:w-auto">
                  <button
                    onClick={() => setActiveTab('requests')}
                    className="flex-1 sm:flex-none px-5 py-3 bg-amber-400 hover:bg-amber-300 text-slate-950 font-display font-bold text-xs rounded-2xl shadow-lg transition-all cursor-pointer flex items-center justify-center gap-2"
                  >
                    <Zap size={16} />
                    <span>View Delivery Requests ({incomingRequestsList.length})</span>
                  </button>
                </div>
              </div>

              {/* Offline Banner when Offline */}
              {!rider.isOnline && (
                <div className="bg-rose-950/80 border-2 border-rose-500/40 rounded-3xl p-6 shadow-xl text-center space-y-3">
                  <div className="w-12 h-12 rounded-full bg-rose-900/60 text-rose-300 mx-auto flex items-center justify-center border border-rose-500/30">
                    <Power size={24} />
                  </div>
                  <h3 className="font-display font-black text-lg text-white">You are currently offline.</h3>
                  <p className="font-sans text-xs text-slate-300 max-w-md mx-auto">
                    Switch your status to Online to start receiving delivery requests in your area.
                  </p>
                  <button
                    onClick={toggleOnline}
                    className="px-6 py-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-display font-extrabold text-xs rounded-2xl shadow-lg transition-all cursor-pointer inline-flex items-center gap-2"
                  >
                    <Power size={14} />
                    <span>Go Online Now</span>
                  </button>
                </div>
              )}

              {/* TODAY SUMMARY STATISTIC CARDS (Phase 3B requirement) */}
              <div>
                <h3 className="font-display font-extrabold text-sm text-slate-300 uppercase tracking-wider mb-3">Today Summary</h3>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  
                  {/* Today's Earnings */}
                  <div className="bg-[#101C16] border border-emerald-950/80 rounded-3xl p-5 shadow-lg space-y-1">
                    <span className="font-mono text-[10px] text-slate-400 uppercase font-bold block">Today's Earnings</span>
                    <div className="font-sans font-black text-2xl text-amber-400">₦18,500</div>
                    <span className="font-mono text-[10px] text-emerald-400 block font-semibold">+18% vs yesterday</span>
                  </div>

                  {/* Today's Deliveries */}
                  <div className="bg-[#101C16] border border-emerald-950/80 rounded-3xl p-5 shadow-lg space-y-1">
                    <span className="font-mono text-[10px] text-slate-400 uppercase font-bold block">Today's Deliveries</span>
                    <div className="font-sans font-black text-2xl text-white">12 Deliveries</div>
                    <span className="font-mono text-[10px] text-slate-400 block">100% On-Time</span>
                  </div>

                  {/* Acceptance Rate */}
                  <div className="bg-[#101C16] border border-emerald-950/80 rounded-3xl p-5 shadow-lg space-y-1">
                    <span className="font-mono text-[10px] text-slate-400 uppercase font-bold block">Acceptance Rate</span>
                    <div className="font-sans font-black text-2xl text-emerald-400">97%</div>
                    <span className="font-mono text-[10px] text-slate-400 block">Top Tier Tier-1</span>
                  </div>

                  {/* Customer Rating */}
                  <div className="bg-[#101C16] border border-emerald-950/80 rounded-3xl p-5 shadow-lg space-y-1">
                    <span className="font-mono text-[10px] text-slate-400 uppercase font-bold block">Customer Rating</span>
                    <div className="font-sans font-black text-2xl text-white flex items-center gap-1">
                      <span>4.9</span>
                      <Star size={18} className="fill-amber-400 text-amber-400" />
                    </div>
                    <span className="font-mono text-[10px] text-amber-300 block">Based on 1,420 ratings</span>
                  </div>

                </div>
              </div>

              {/* Active Delivery Card preview on Dashboard */}
              {activeDeliveriesList.length > 0 && (
                <div className="bg-[#101C16] border-2 border-emerald-500/50 rounded-3xl p-5 shadow-2xl space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-emerald-900/60">
                    <div className="flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full bg-emerald-400 animate-ping" />
                      <span className="font-mono text-xs font-bold text-emerald-300 uppercase">Active Delivery In Progress</span>
                    </div>
                    <button
                      onClick={() => setActiveTab('active')}
                      className="text-xs font-display font-bold text-amber-400 hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <span>Open Console</span>
                      <ChevronRight size={14} />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                    <div>
                      <span className="text-[10px] font-mono uppercase text-slate-400 block">Order Reference</span>
                      <span className="font-mono font-bold text-white text-sm">{activeDeliveriesList[0].id}</span>
                    </div>

                    <div>
                      <span className="text-[10px] font-mono uppercase text-slate-400 block">Pickup Restaurant</span>
                      <span className="font-display font-semibold text-slate-200">{activeDeliveriesList[0].pickupRestaurantName || 'Bibi Kitchen'}</span>
                    </div>

                    <div>
                      <span className="text-[10px] font-mono uppercase text-slate-400 block">Dropoff Destination</span>
                      <span className="font-sans font-semibold text-slate-200">{activeDeliveriesList[0].address}</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Active Delivery Map Placeholder Component */}
              <div className="bg-[#101C16] border border-emerald-950/80 rounded-3xl p-5 shadow-xl space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Navigation size={18} className="text-emerald-400" />
                    <h3 className="font-display font-bold text-sm text-white">Active Delivery Route Map</h3>
                  </div>
                  <span className="font-mono text-[10px] text-slate-400">Sector: Victoria Island - Lekki Zone</span>
                </div>

                <RiderMap
                  stage={currentActiveOrder?.riderStage || 'heading_to_restaurant'}
                  pickupLocation={{
                    name: currentActiveOrder?.pickupRestaurantName || 'Bibi Kitchen',
                    address: currentActiveOrder?.pickupAddress || '18 Ahmadu Bello Way, VI'
                  }}
                  dropoffLocation={{
                    name: currentActiveOrder?.customerName || 'Sarah Johnson',
                    address: currentActiveOrder?.address || 'Lekki Phase 1'
                  }}
                />
              </div>

            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 2: NEW DELIVERY REQUESTS                                              */}
          {/* ========================================================================= */}
          {activeTab === 'requests' && (
            <div className="space-y-6">
              
              <div className="flex items-center justify-between pb-2 border-b border-emerald-950/80">
                <div>
                  <h2 className="font-display font-black text-xl text-white">Live Delivery Requests</h2>
                  <p className="text-xs text-slate-400 mt-0.5">Accept order dispatches in your area before countdown timers expire.</p>
                </div>
                <span className="font-mono text-xs bg-amber-400/20 text-amber-300 px-3 py-1 rounded-full border border-amber-400/30 font-bold">
                  {incomingRequestsList.length} Requests Available
                </span>
              </div>

              {!rider.isOnline ? (
                <div className="bg-[#101C16] border border-emerald-950/80 rounded-3xl p-12 text-center space-y-3">
                  <div className="w-16 h-16 rounded-full bg-rose-950 text-rose-400 mx-auto flex items-center justify-center">
                    <Power size={32} />
                  </div>
                  <h3 className="font-display font-bold text-lg text-white">You are currently offline.</h3>
                  <p className="font-sans text-xs text-slate-400 max-w-md mx-auto">
                    Switch your status to Online to start receiving live delivery requests.
                  </p>
                  <button
                    onClick={toggleOnline}
                    className="px-5 py-2.5 bg-emerald-500 text-slate-950 font-bold text-xs rounded-xl cursor-pointer"
                  >
                    Go Online Now
                  </button>
                </div>
              ) : incomingRequestsList.length === 0 ? (
                <div className="bg-[#101C16] border border-emerald-950/80 rounded-3xl p-12 text-center space-y-3">
                  <div className="w-16 h-16 rounded-full bg-emerald-950 text-emerald-400 mx-auto flex items-center justify-center">
                    <Truck size={32} />
                  </div>
                  <h3 className="font-display font-bold text-lg text-white">No deliveries available right now.</h3>
                  <p className="font-sans text-xs text-slate-400 max-w-md mx-auto">
                    Stay online and we'll notify you when a new order arrives.
                  </p>
                </div>
              ) : (
                <div className="space-y-6">
                  {/* Large Delivery Request Card (Uber Eats-Level Layout) */}
                  {incomingRequestsList.map((req) => (
                    <div
                      key={req.id}
                      className="bg-[#101C16] border-2 border-amber-400 hover:border-amber-300 rounded-3xl p-6 shadow-2xl space-y-5 transition-all"
                    >
                      {/* Top Bar with Expiration Timer */}
                      <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-emerald-900/60">
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-extrabold text-amber-400 text-base">{req.id}</span>
                          <span className="font-mono text-[10px] bg-emerald-950 text-emerald-300 font-bold px-2 py-0.5 rounded border border-emerald-800">
                            Distance: {req.estimatedDistanceKm || 4.2} km
                          </span>
                          <span className="font-mono text-[10px] bg-amber-400/10 text-amber-300 font-bold px-2 py-0.5 rounded border border-amber-400/20">
                            Est. Time: {req.items[0]?.meal?.prepTime || '18 mins'}
                          </span>
                        </div>

                        <div className="flex items-center gap-1.5 bg-rose-950/80 text-rose-300 border border-rose-800/60 px-3 py-1 rounded-full font-mono text-xs font-bold animate-pulse">
                          <Clock size={13} />
                          <span>Accept in {req.requestTimeRemainingSeconds || 30}s</span>
                        </div>
                      </div>

                      {/* 9-Point Request Data Grid (Phase 3B specification) */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                        
                        {/* Restaurant Info */}
                        <div className="p-4 bg-[#0B140F] rounded-2xl border border-emerald-900/50 space-y-1">
                          <span className="font-mono text-[9px] text-amber-400 font-bold uppercase tracking-wider block">Restaurant Pickup</span>
                          <span className="font-display font-extrabold text-white text-base block">{req.pickupRestaurantName || 'Bibi Kitchen'}</span>
                          <p className="text-slate-300 text-xs leading-relaxed">{req.pickupAddress || 'Victoria Island'}</p>
                        </div>

                        {/* Customer Info */}
                        <div className="p-4 bg-[#0B140F] rounded-2xl border border-emerald-900/50 space-y-1">
                          <span className="font-mono text-[9px] text-emerald-400 font-bold uppercase tracking-wider block">Customer Delivery</span>
                          <span className="font-display font-extrabold text-white text-base block">{req.customerName || 'Sarah Johnson'}</span>
                          <p className="text-slate-300 text-xs leading-relaxed">{req.address || 'Lekki Phase 1'}</p>
                        </div>

                      </div>

                      {/* Order Financials & Payment Method Banner */}
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 bg-[#08100C] rounded-2xl border border-emerald-900/40 text-xs font-mono">
                        <div>
                          <span className="text-slate-500 block text-[10px] uppercase">Delivery Fee</span>
                          <span className="font-bold text-emerald-400 text-sm">₦{(req.deliveryFee || 2300).toLocaleString()}</span>
                        </div>

                        <div>
                          <span className="text-slate-500 block text-[10px] uppercase">Order Total</span>
                          <span className="font-bold text-white text-sm">₦{(req.totalAmount || 9800).toLocaleString()}</span>
                        </div>

                        <div>
                          <span className="text-slate-500 block text-[10px] uppercase">Payment Method</span>
                          <span className="font-bold text-amber-300 text-xs">{req.paymentMethod || 'Online Transfer'}</span>
                        </div>

                        <div>
                          <span className="text-slate-500 block text-[10px] uppercase">Rider Pay</span>
                          <span className="font-bold text-amber-400 text-sm">₦{(req.estimatedEarnings || 2300).toLocaleString()}</span>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex items-center gap-3 pt-2">
                        <button
                          onClick={() => handleAcceptRequest(req)}
                          className="flex-1 py-4 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-display font-black text-sm rounded-2xl shadow-xl transition-all cursor-pointer flex items-center justify-center gap-2"
                        >
                          <CheckCircle2 size={18} />
                          <span>ACCEPT ORDER</span>
                        </button>

                        <button
                          onClick={() => handleDeclineRequest(req.id)}
                          className="px-6 py-4 bg-rose-950/60 hover:bg-rose-900/80 text-rose-300 border border-rose-800/50 font-display font-bold text-sm rounded-2xl transition-all cursor-pointer flex items-center justify-center gap-1.5"
                        >
                          <X size={16} />
                          <span>DECLINE</span>
                        </button>
                      </div>

                    </div>
                  ))}
                </div>
              )}

            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 3: ACCEPTED DELIVERY WORKFLOW                                         */}
          {/* ========================================================================= */}
          {activeTab === 'active' && (
            <div className="space-y-6">
              
              <div className="flex items-center justify-between pb-2 border-b border-emerald-950/80">
                <div>
                  <h2 className="font-display font-black text-xl text-white">Active Delivery Journey</h2>
                  <p className="text-xs text-slate-400 mt-0.5">Step-by-step navigation from restaurant pickup to customer handover.</p>
                </div>
              </div>

              {activeDeliveriesList.length === 0 ? (
                <div className="bg-[#101C16] border border-emerald-950/80 rounded-3xl p-12 text-center space-y-4">
                  <div className="w-16 h-16 rounded-full bg-emerald-950 text-emerald-400 mx-auto flex items-center justify-center">
                    <Navigation size={32} />
                  </div>
                  <h3 className="font-display font-bold text-lg text-white">No active delivery in progress.</h3>
                  <p className="font-sans text-xs text-slate-400 max-w-md mx-auto">
                    Accept a delivery request to launch the active rider delivery workflow.
                  </p>
                  <button
                    onClick={() => setActiveTab('requests')}
                    className="px-5 py-2.5 bg-amber-400 text-slate-950 font-display font-bold text-xs rounded-xl cursor-pointer"
                  >
                    View Available Requests
                  </button>
                </div>
              ) : (
                <div className="space-y-6">
                  
                  {/* DELIVERY PROGRESS TRACKER (Phase 3B requirement) */}
                  <div className="bg-[#101C16] border border-emerald-950/80 rounded-3xl p-6 shadow-xl space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-xs text-amber-400 font-bold uppercase">
                        Order Ref: {currentActiveOrder.id}
                      </span>
                      <span className="font-mono text-xs text-emerald-400 bg-emerald-950 px-2.5 py-1 rounded border border-emerald-800 font-bold">
                        {currentActiveOrder.riderStage || 'accepted'}
                      </span>
                    </div>

                    {/* Progress Bar Steps */}
                    <div className="grid grid-cols-5 gap-2 text-center text-[10px] font-mono">
                      {[
                        { stage: 'accepted', label: 'Accepted' },
                        { stage: 'heading_to_restaurant', label: 'Driving to Restaurant' },
                        { stage: 'picked_up', label: 'Order Picked Up' },
                        { stage: 'heading_to_customer', label: 'Driving to Customer' },
                        { stage: 'delivered', label: 'Delivered' },
                      ].map((s, idx) => {
                        const currentStageIdx = [
                          'accepted',
                          'heading_to_restaurant',
                          'picked_up',
                          'heading_to_customer',
                          'delivered'
                        ].indexOf(currentActiveOrder.riderStage || 'accepted');
                        
                        const isDone = idx <= currentStageIdx;
                        return (
                          <div key={s.stage} className="space-y-1.5">
                            <div className={`h-2 rounded-full transition-all ${
                              isDone ? 'bg-amber-400 shadow-sm' : 'bg-slate-800'
                            }`} />
                            <span className={isDone ? 'text-amber-300 font-bold' : 'text-slate-500'}>
                              {s.label}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Active Delivery Map Placeholder */}
                  <RiderMap
                    stage={currentActiveOrder.riderStage || 'heading_to_restaurant'}
                    pickupLocation={{
                      name: currentActiveOrder.pickupRestaurantName || 'Bibi Kitchen',
                      address: currentActiveOrder.pickupAddress || '18 Ahmadu Bello Way, VI'
                    }}
                    dropoffLocation={{
                      name: currentActiveOrder.customerName || 'Sarah Johnson',
                      address: currentActiveOrder.address || 'Lekki Phase 1'
                    }}
                  />

                  {/* STEP 1, STEP 2, STEP 3 WORKFLOW CARDS */}
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    
                    {/* STEP 1: NAVIGATE TO RESTAURANT */}
                    <div className={`bg-[#101C16] border rounded-3xl p-5 shadow-xl space-y-4 ${
                      currentActiveOrder.riderStage === 'heading_to_restaurant' || currentActiveOrder.riderStage === 'accepted'
                        ? 'border-amber-400 ring-2 ring-amber-400/20'
                        : 'border-emerald-950/80 opacity-70'
                    }`}>
                      <div className="flex items-center justify-between pb-2 border-b border-emerald-900/60">
                        <span className="font-display font-extrabold text-xs text-amber-400 uppercase">Step 1: Restaurant</span>
                        <span className="font-mono text-[10px] text-slate-400">Est: 8 mins</span>
                      </div>

                      <div>
                        <span className="font-display font-extrabold text-base text-white block">
                          {currentActiveOrder.pickupRestaurantName || 'Bibi Kitchen'}
                        </span>
                        <p className="text-slate-300 text-xs mt-0.5">
                          {currentActiveOrder.pickupAddress || 'Victoria Island, Lagos'}
                        </p>
                      </div>

                      <div className="flex flex-col gap-2">
                        <button
                          onClick={() => alert(`Opening GPS Navigation to ${currentActiveOrder.pickupRestaurantName || 'Bibi Kitchen'}...`)}
                          className="w-full py-2 bg-[#17271E] hover:bg-[#203428] text-amber-300 font-display font-bold text-xs rounded-xl cursor-pointer flex items-center justify-center gap-1.5"
                        >
                          <Navigation size={13} />
                          <span>Navigate to Restaurant</span>
                        </button>

                        <button
                          onClick={() => setCallingTarget({
                            type: 'restaurant',
                            name: currentActiveOrder.pickupRestaurantName || 'Bibi Kitchen',
                            phone: '+234 800-BIBI-KITCHEN'
                          })}
                          className="w-full py-2 bg-[#17271E] hover:bg-[#203428] text-slate-200 font-display font-bold text-xs rounded-xl cursor-pointer flex items-center justify-center gap-1.5"
                        >
                          <PhoneCall size={13} className="text-emerald-400" />
                          <span>Call Restaurant</span>
                        </button>
                      </div>

                      <button
                        onClick={() => handleAdvanceStage(currentActiveOrder, 'heading_to_restaurant')}
                        className="w-full py-3 bg-amber-400 text-slate-950 font-display font-bold text-xs rounded-xl shadow-md cursor-pointer hover:bg-amber-300 transition-colors"
                      >
                        I've Arrived at Restaurant
                      </button>
                    </div>

                    {/* STEP 2: PICKUP ORDER */}
                    <div className={`bg-[#101C16] border rounded-3xl p-5 shadow-xl space-y-4 ${
                      currentActiveOrder.riderStage === 'heading_to_restaurant' || currentActiveOrder.riderStage === 'picked_up'
                        ? 'border-amber-400 ring-2 ring-amber-400/20'
                        : 'border-emerald-950/80 opacity-70'
                    }`}>
                      <div className="flex items-center justify-between pb-2 border-b border-emerald-900/60">
                        <span className="font-display font-extrabold text-xs text-amber-400 uppercase">Step 2: Pickup Order</span>
                        <span className="font-mono text-[10px] text-amber-300 font-bold">{currentActiveOrder.id}</span>
                      </div>

                      <div>
                        <span className="font-display font-extrabold text-xs text-slate-400 uppercase block">Customer Name</span>
                        <span className="font-display font-bold text-sm text-white block">{currentActiveOrder.customerName || 'Sarah Johnson'}</span>
                      </div>

                      <div className="p-3 bg-[#08100C] rounded-2xl border border-emerald-900/40 text-xs space-y-1">
                        <span className="font-mono text-[9px] text-slate-400 uppercase font-bold block">Items Ordered:</span>
                        {currentActiveOrder.items.map((item, idx) => (
                          <div key={idx} className="flex justify-between font-semibold text-slate-200">
                            <span>{item.quantity}x {item.meal.name}</span>
                          </div>
                        ))}
                      </div>

                      {/* Pickup Verification Code Input */}
                      <div className="space-y-1.5">
                        <span className="font-mono text-[10px] text-emerald-300 font-bold uppercase block">Pickup Verification Code</span>
                        {pinError && <p className="text-rose-400 text-[10px]">{pinError}</p>}
                        <div className="flex gap-2">
                          <input
                            type="text"
                            maxLength={4}
                            value={pinInput}
                            onChange={(e) => setPinInput(e.target.value)}
                            placeholder="PIN Code"
                            className="w-full bg-[#08100C] border border-emerald-900/80 rounded-xl px-3 py-1.5 font-mono text-center text-xs font-bold text-amber-300 focus:outline-none"
                          />
                          <button
                            onClick={() => handleVerifyPinAndPickup(currentActiveOrder)}
                            className="px-3 py-1.5 bg-emerald-500 text-slate-950 font-bold text-xs rounded-xl cursor-pointer shrink-0"
                          >
                            Verify
                          </button>
                        </div>
                      </div>

                      <button
                        onClick={() => handleAdvanceStage(currentActiveOrder, 'heading_to_customer')}
                        className="w-full py-3 bg-emerald-500 text-slate-950 font-display font-extrabold text-xs rounded-xl shadow-md cursor-pointer hover:bg-emerald-400 transition-colors"
                      >
                        Order Picked Up
                      </button>
                    </div>

                    {/* STEP 3: DELIVER TO CUSTOMER */}
                    <div className={`bg-[#101C16] border rounded-3xl p-5 shadow-xl space-y-4 ${
                      currentActiveOrder.riderStage === 'heading_to_customer'
                        ? 'border-emerald-400 ring-2 ring-emerald-400/20'
                        : 'border-emerald-950/80 opacity-70'
                    }`}>
                      <div className="flex items-center justify-between pb-2 border-b border-emerald-900/60">
                        <span className="font-display font-extrabold text-xs text-emerald-400 uppercase">Step 3: Deliver</span>
                        <span className="font-mono text-[10px] text-slate-400">Est: 12 mins</span>
                      </div>

                      <div>
                        <span className="font-display font-extrabold text-base text-white block">
                          {currentActiveOrder.customerName || 'Sarah Johnson'}
                        </span>
                        <p className="text-slate-300 text-xs mt-0.5">
                          {currentActiveOrder.address || 'Lekki Phase 1'}
                        </p>
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <button
                          onClick={() => setCallingTarget({
                            type: 'customer',
                            name: currentActiveOrder.customerName || 'Sarah Johnson',
                            phone: currentActiveOrder.customerPhone || '+234 812 998 4433'
                          })}
                          className="py-2 bg-[#17271E] hover:bg-[#203428] text-slate-200 font-display font-bold text-xs rounded-xl cursor-pointer flex items-center justify-center gap-1"
                        >
                          <PhoneCall size={13} className="text-emerald-400" />
                          <span>Call</span>
                        </button>

                        <button
                          onClick={() => setChatTarget({
                            customerName: currentActiveOrder.customerName || 'Sarah Johnson',
                            phone: currentActiveOrder.customerPhone || '+234 812 998 4433',
                            orderId: currentActiveOrder.id
                          })}
                          className="py-2 bg-[#17271E] hover:bg-[#203428] text-slate-200 font-display font-bold text-xs rounded-xl cursor-pointer flex items-center justify-center gap-1"
                        >
                          <MessageSquare size={13} className="text-amber-400" />
                          <span>Message</span>
                        </button>
                      </div>

                      <button
                        onClick={() => alert(`Opening GPS Navigation to ${currentActiveOrder.address}...`)}
                        className="w-full py-2 bg-[#17271E] hover:bg-[#203428] text-amber-300 font-display font-bold text-xs rounded-xl cursor-pointer flex items-center justify-center gap-1.5"
                      >
                        <Navigation size={13} />
                        <span>Navigate to Customer</span>
                      </button>

                      <button
                        onClick={() => handleAdvanceStage(currentActiveOrder, 'delivered')}
                        className="w-full py-3.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-display font-black text-xs rounded-xl shadow-lg cursor-pointer transition-colors"
                      >
                        DELIVERED SUCCESSFULLY
                      </button>
                    </div>

                  </div>

                </div>
              )}

            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 4: DELIVERY HISTORY                                                   */}
          {/* ========================================================================= */}
          {activeTab === 'history' && (
            <div className="space-y-6">
              
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-2 border-b border-emerald-950/80">
                <div>
                  <h2 className="font-display font-black text-xl text-white">Delivery History</h2>
                  <p className="text-xs text-slate-400 mt-0.5">Historical records of completed and fulfilled dispatches.</p>
                </div>

                {/* Filters */}
                <div className="flex flex-wrap items-center gap-2">
                  <select
                    value={historyFilter}
                    onChange={(e) => setHistoryFilter(e.target.value as any)}
                    className="bg-[#101C16] border border-emerald-900/60 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none cursor-pointer"
                  >
                    <option value="all">All Dates</option>
                    <option value="today">Today</option>
                    <option value="week">This Week</option>
                    <option value="month">This Month</option>
                    <option value="completed">Completed</option>
                    <option value="canceled">Cancelled</option>
                  </select>

                  <div className="relative">
                    <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                    <input
                      type="text"
                      placeholder="Search..."
                      value={historySearch}
                      onChange={(e) => setHistorySearch(e.target.value)}
                      className="bg-[#101C16] border border-emerald-900/60 rounded-xl pl-8 pr-3 py-1.5 text-xs text-white focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Delivery History List */}
              <div className="space-y-3">
                {[
                  {
                    id: '#BIBI-9842',
                    restaurant: 'Bibi Kitchen',
                    customer: 'Sarah Johnson',
                    date: 'Today, 1:15 PM',
                    fee: 2300,
                    status: 'Delivered',
                    rating: 5.0
                  },
                  {
                    id: '#BIBI-9410',
                    restaurant: 'Bibi Kitchen - VI',
                    customer: 'Amina Bello',
                    date: 'Today, 11:20 AM',
                    fee: 1950,
                    status: 'Delivered',
                    rating: 5.0
                  },
                  {
                    id: '#BIBI-9284',
                    restaurant: 'Bibi Kitchen - Ikeja',
                    customer: 'Babajide F.',
                    date: 'Yesterday, 8:45 PM',
                    fee: 2200,
                    status: 'Delivered',
                    rating: 4.8
                  },
                  {
                    id: '#BIBI-9105',
                    restaurant: 'Bibi Kitchen - Ikoyi',
                    customer: 'Dr. Chidi N.',
                    date: '26 Jul 2026',
                    fee: 1750,
                    status: 'Delivered',
                    rating: 5.0
                  }
                ].map((item, idx) => (
                  <div
                    key={idx}
                    className="bg-[#101C16] border border-emerald-950/80 rounded-2xl p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 hover:border-emerald-500/30 transition-all"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-white text-sm">{item.id}</span>
                        <span className="font-mono text-[9px] bg-emerald-950 text-emerald-300 px-2 py-0.5 rounded uppercase font-bold border border-emerald-800">
                          {item.status}
                        </span>
                        <span className="font-mono text-[10px] text-slate-400">{item.date}</span>
                      </div>
                      <p className="font-sans text-xs text-slate-300 mt-1">
                        <b>{item.restaurant}</b> → Deliver to <span className="text-slate-400">{item.customer}</span>
                      </p>
                    </div>

                    <div className="flex items-center gap-4 shrink-0">
                      <div className="text-right">
                        <span className="font-mono text-[10px] text-slate-400 block uppercase">Delivery Fee</span>
                        <span className="font-sans font-black text-amber-400 text-base">₦{item.fee.toLocaleString()}</span>
                      </div>

                      <div className="flex items-center gap-1 bg-amber-400/10 text-amber-300 px-2.5 py-1 rounded-xl border border-amber-400/20 font-mono text-xs font-bold">
                        <Star size={12} className="fill-amber-400" />
                        <span>{item.rating}★</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 5: RIDER EARNINGS SCREEN                                              */}
          {/* ========================================================================= */}
          {activeTab === 'earnings' && (
            <div className="space-y-6">
              
              <div className="flex items-center justify-between pb-2 border-b border-emerald-950/80">
                <div>
                  <h2 className="font-display font-black text-xl text-white">Rider Earnings</h2>
                  <p className="text-xs text-slate-400 mt-0.5">Track daily revenues, delivery fees, bonuses, tips, and payouts.</p>
                </div>

                <button
                  onClick={() => setWithdrawModalOpen(true)}
                  className="px-5 py-2.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-display font-bold text-xs rounded-xl shadow-lg transition-all cursor-pointer flex items-center gap-1.5"
                >
                  <DollarSign size={16} />
                  <span>Instant Payout</span>
                </button>
              </div>

              {/* Financial Summary Cards Grid (Phase 3B requirement) */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                
                <div className="bg-[#101C16] border border-emerald-950/80 rounded-3xl p-5 shadow-lg space-y-1">
                  <span className="font-mono text-[10px] text-slate-400 uppercase font-bold block">Today's Earnings</span>
                  <div className="font-sans font-black text-2xl text-amber-400">₦18,500</div>
                  <span className="font-mono text-[10px] text-emerald-400 block">12 Deliveries</span>
                </div>

                <div className="bg-[#101C16] border border-emerald-950/80 rounded-3xl p-5 shadow-lg space-y-1">
                  <span className="font-mono text-[10px] text-slate-400 uppercase font-bold block">Yesterday</span>
                  <div className="font-sans font-black text-2xl text-white">₦15,200</div>
                  <span className="font-mono text-[10px] text-slate-400 block">10 Deliveries</span>
                </div>

                <div className="bg-[#101C16] border border-emerald-950/80 rounded-3xl p-5 shadow-lg space-y-1">
                  <span className="font-mono text-[10px] text-slate-400 uppercase font-bold block">This Week</span>
                  <div className="font-sans font-black text-2xl text-white">₦42,500</div>
                  <span className="font-mono text-[10px] text-slate-400 block">28 Deliveries</span>
                </div>

                <div className="bg-[#101C16] border border-emerald-950/80 rounded-3xl p-5 shadow-lg space-y-1">
                  <span className="font-mono text-[10px] text-slate-400 uppercase font-bold block">This Month</span>
                  <div className="font-sans font-black text-2xl text-emerald-400">₦184,200</div>
                  <span className="font-mono text-[10px] text-slate-400 block">July 2026</span>
                </div>

              </div>

              {/* Lifetime, Bonuses & Tips */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-[#101C16] border border-emerald-950/80 rounded-3xl p-5 shadow-lg space-y-1">
                  <span className="font-mono text-[10px] text-slate-400 uppercase font-bold block">Total Lifetime Earnings</span>
                  <div className="font-sans font-black text-2xl text-white">₦620,000</div>
                  <span className="font-mono text-[10px] text-amber-300 block">{rider.totalDeliveries} Lifetime Runs</span>
                </div>

                <div className="bg-[#101C16] border border-emerald-950/80 rounded-3xl p-5 shadow-lg space-y-1">
                  <span className="font-mono text-[10px] text-slate-400 uppercase font-bold block">Peak Bonuses Earned</span>
                  <div className="font-sans font-black text-2xl text-amber-400">₦12,500</div>
                  <span className="font-mono text-[10px] text-emerald-400 block">+₦500 surge bonus</span>
                </div>

                <div className="bg-[#101C16] border border-emerald-950/80 rounded-3xl p-5 shadow-lg space-y-1">
                  <span className="font-mono text-[10px] text-slate-400 uppercase font-bold block">Customer Tips</span>
                  <div className="font-sans font-black text-2xl text-emerald-300">₦6,800</div>
                  <span className="font-mono text-[10px] text-slate-400 block">100% kept by rider</span>
                </div>
              </div>

              {/* Recent Payments List */}
              <div className="bg-[#101C16] border border-emerald-950/80 rounded-3xl p-6 shadow-xl space-y-4">
                <h3 className="font-display font-bold text-sm text-white">Recent Payments & Dispatches</h3>
                <div className="space-y-3 font-mono text-xs">
                  <div className="p-3 bg-[#08100C] rounded-2xl border border-emerald-900/40 flex justify-between items-center">
                    <div>
                      <span className="text-white font-bold block">Weekly Bank Transfer</span>
                      <span className="text-[10px] text-slate-400">GTBank ••••6789 (27 Jul 2026)</span>
                    </div>
                    <span className="text-emerald-400 font-bold">+₦42,500</span>
                  </div>

                  <div className="p-3 bg-[#08100C] rounded-2xl border border-emerald-900/40 flex justify-between items-center">
                    <div>
                      <span className="text-white font-bold block">Instant Payout</span>
                      <span className="text-[10px] text-slate-400">GTBank ••••6789 (20 Jul 2026)</span>
                    </div>
                    <span className="text-emerald-400 font-bold">+₦25,000</span>
                  </div>
                </div>
              </div>

            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 6: RIDER PROFILE                                                      */}
          {/* ========================================================================= */}
          {activeTab === 'profile' && (
            <div className="space-y-6">
              
              <div className="flex items-center justify-between pb-2 border-b border-emerald-950/80">
                <div>
                  <h2 className="font-display font-black text-xl text-white">Rider Profile</h2>
                  <p className="text-xs text-slate-400 mt-0.5">Manage personal credentials, vehicle registration, emergency contact, and bank details.</p>
                </div>

                <button
                  onClick={() => setEditProfileOpen(true)}
                  className="px-4 py-2 bg-amber-400 text-slate-950 font-display font-bold text-xs rounded-xl shadow-md transition-all cursor-pointer flex items-center gap-1.5"
                >
                  <Edit3 size={14} />
                  <span>Edit Profile</span>
                </button>
              </div>

              <div className="bg-[#101C16] border border-emerald-950/80 rounded-3xl p-6 shadow-xl grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Personal Information */}
                <div className="space-y-4">
                  <h3 className="font-display font-bold text-sm text-amber-400">Personal Information</h3>
                  <div className="space-y-2 text-xs font-mono">
                    <div>
                      <span className="text-slate-500 block">Full Name</span>
                      <span className="text-white font-bold text-sm">{rider.fullName}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block">Phone Number</span>
                      <span className="text-white font-bold">{rider.phone}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block">Email Address</span>
                      <span className="text-white font-bold">{rider.email}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block">Availability Status</span>
                      <span className={`font-bold ${rider.isOnline ? 'text-emerald-400' : 'text-rose-400'}`}>
                        {rider.isOnline ? 'Online (Accepting Orders)' : 'Offline'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Vehicle & Bank Information */}
                <div className="space-y-4">
                  <h3 className="font-display font-bold text-sm text-emerald-400">Vehicle & Bank Details</h3>
                  <div className="space-y-2 text-xs font-mono">
                    <div>
                      <span className="text-slate-500 block">Vehicle Type</span>
                      <span className="text-white font-bold text-sm">{rider.vehicleType}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block">Vehicle Registration Number</span>
                      <span className="text-amber-300 font-bold text-sm tracking-widest">{rider.licensePlate}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block">Emergency Contact</span>
                      <span className="text-white font-bold">{rider.emergencyContact?.name} ({rider.emergencyContact?.phone})</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block">Bank Account</span>
                      <span className="text-amber-300 font-bold">{rider.payoutBank?.bankName} — {rider.payoutBank?.accountNumber} ({rider.payoutBank?.accountName})</span>
                    </div>
                  </div>
                </div>

              </div>

              {/* Logout & Action Row */}
              <div className="flex justify-end pt-2">
                <button
                  onClick={onLogoutRider}
                  className="px-6 py-3 bg-rose-950/60 hover:bg-rose-900/80 text-rose-300 border border-rose-800/50 font-display font-bold text-xs rounded-xl transition-all cursor-pointer flex items-center gap-2"
                >
                  <LogOut size={16} />
                  <span>Log Out Rider Account</span>
                </button>
              </div>

            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 7: NOTIFICATIONS                                                      */}
          {/* ========================================================================= */}
          {activeTab === 'notifications' && (
            <div className="space-y-6">
              
              <div className="flex items-center justify-between pb-2 border-b border-emerald-950/80">
                <div>
                  <h2 className="font-display font-black text-xl text-white">Notifications</h2>
                  <p className="text-xs text-slate-400 mt-0.5">Order dispatches, bonuses, customer messages, and payments.</p>
                </div>

                <button
                  onClick={() => setNotifications(prev => prev.map(n => ({ ...n, read: true })))}
                  className="text-xs font-mono text-amber-400 hover:underline cursor-pointer"
                >
                  Mark All Read
                </button>
              </div>

              <div className="space-y-3">
                {notifications.map((n) => (
                  <div
                    key={n.id}
                    className={`bg-[#101C16] border rounded-2xl p-4 transition-all flex items-start gap-3 ${
                      !n.read ? 'border-amber-400/50 bg-[#14231B]' : 'border-emerald-950/80'
                    }`}
                  >
                    <div className="w-8 h-8 rounded-xl bg-amber-400/10 text-amber-400 flex items-center justify-center shrink-0 mt-0.5">
                      <Bell size={16} />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h4 className="font-display font-bold text-sm text-white">{n.title}</h4>
                        <span className="font-mono text-[10px] text-slate-500">{n.timestamp}</span>
                      </div>
                      <p className="font-sans text-xs text-slate-300 mt-1 leading-relaxed">{n.message}</p>
                    </div>
                  </div>
                ))}
              </div>

            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 8: PREFERENCES & SETTINGS                                            */}
          {/* ========================================================================= */}
          {activeTab === 'settings' && (
            <div className="space-y-6">
              
              <div className="flex items-center justify-between pb-2 border-b border-emerald-950/80">
                <div>
                  <h2 className="font-display font-black text-xl text-white">Rider Preferences</h2>
                  <p className="text-xs text-slate-400 mt-0.5">Configure audio alerts, auto-accept rules, and dispatch radius.</p>
                </div>
              </div>

              <div className="bg-[#101C16] border border-emerald-950/80 rounded-3xl p-6 shadow-xl space-y-6">
                
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-display font-bold text-sm text-white">Delivery Order Audio Alerts</h4>
                    <p className="text-xs text-slate-400">Play sound chime when new delivery request arrives.</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={soundEnabled}
                    onChange={(e) => setSoundEnabled(e.target.checked)}
                    className="w-5 h-5 accent-amber-400 cursor-pointer"
                  />
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-emerald-900/60">
                  <div>
                    <h4 className="font-display font-bold text-sm text-white">Emergency SOS Signal</h4>
                    <p className="text-xs text-slate-400">Instantly share GPS location with dispatch control center.</p>
                  </div>
                  <button
                    onClick={() => alert('Emergency SOS Signal Sent to Bibi Control!')}
                    className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white font-display font-bold text-xs rounded-xl cursor-pointer"
                  >
                    Test SOS Signal
                  </button>
                </div>

              </div>

            </div>
          )}

        </main>

      </div>

      {/* ========================================================================= */}
      {/* SIMULATED PHONE CALL DRAWER MODAL                                         */}
      {/* ========================================================================= */}
      <AnimatePresence>
        {callingTarget && (
          <div className="fixed inset-0 bg-slate-950/85 backdrop-blur-md z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-[#101C16] border border-emerald-500/40 rounded-3xl p-8 w-full max-w-sm text-center shadow-2xl space-y-6"
            >
              <div className="w-16 h-16 rounded-full bg-emerald-500 text-slate-950 flex items-center justify-center mx-auto ring-8 ring-emerald-500/20 animate-bounce">
                <PhoneCall size={32} />
              </div>

              <div>
                <span className="font-mono text-[10px] text-emerald-400 uppercase tracking-widest font-bold block">
                  Calling {callingTarget.type}
                </span>
                <h3 className="font-display font-black text-xl text-white mt-1">{callingTarget.name}</h3>
                <p className="font-mono text-amber-300 font-extrabold text-sm mt-1">{callingTarget.phone}</p>
              </div>

              <button
                onClick={() => setCallingTarget(null)}
                className="w-full py-3 bg-rose-600 text-white font-display font-bold text-xs rounded-2xl cursor-pointer"
              >
                End Call
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ========================================================================= */}
      {/* SIMULATED CUSTOMER CHAT / MESSAGING OVERLAY                               */}
      {/* ========================================================================= */}
      <AnimatePresence>
        {chatTarget && (
          <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-[#101C16] border border-emerald-900/80 rounded-3xl w-full max-w-md shadow-2xl overflow-hidden flex flex-col h-[480px]"
            >
              {/* Chat Header */}
              <div className="bg-[#17271E] p-4 border-b border-emerald-900/60 flex items-center justify-between">
                <div>
                  <h3 className="font-display font-bold text-sm text-white">{chatTarget.customerName}</h3>
                  <span className="font-mono text-[10px] text-emerald-400">Order {chatTarget.orderId}</span>
                </div>
                <button
                  onClick={() => setChatTarget(null)}
                  className="p-1.5 rounded-xl text-slate-400 hover:text-white cursor-pointer"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Chat Messages Body */}
              <div className="flex-1 p-4 overflow-y-auto space-y-3 font-sans text-xs">
                {chatMessages.map((msg, idx) => (
                  <div
                    key={idx}
                    className={`flex flex-col max-w-[80%] ${
                      msg.sender === 'rider' ? 'ml-auto items-end' : 'mr-auto items-start'
                    }`}
                  >
                    <div
                      className={`p-3 rounded-2xl ${
                        msg.sender === 'rider'
                          ? 'bg-amber-400 text-slate-950 font-medium'
                          : 'bg-[#17271E] text-slate-200 border border-emerald-900/60'
                      }`}
                    >
                      {msg.text}
                    </div>
                    <span className="text-[9px] font-mono text-slate-500 mt-1">{msg.time}</span>
                  </div>
                ))}
              </div>

              {/* Quick Template Chips */}
              <div className="px-3 py-2 bg-[#0B140F] border-t border-emerald-900/40 flex gap-1.5 overflow-x-auto text-[10px] font-mono">
                {['On my way!', "I've arrived outside", 'Stuck in traffic (2 mins)'].map((txt, i) => (
                  <button
                    key={i}
                    onClick={() => {
                      setNewMessageInput(txt);
                    }}
                    className="px-2.5 py-1 bg-[#17271E] text-amber-300 rounded-full border border-emerald-800/40 shrink-0 hover:bg-[#203428] cursor-pointer"
                  >
                    {txt}
                  </button>
                ))}
              </div>

              {/* Chat Input Bar */}
              <div className="p-3 bg-[#101C16] border-t border-emerald-900/60 flex gap-2">
                <input
                  type="text"
                  value={newMessageInput}
                  onChange={(e) => setNewMessageInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder="Type message..."
                  className="flex-1 bg-[#08100C] border border-emerald-900/80 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                />
                <button
                  onClick={handleSendMessage}
                  className="p-2 bg-amber-400 text-slate-950 rounded-xl font-bold cursor-pointer hover:bg-amber-300"
                >
                  <Send size={16} />
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ========================================================================= */}
      {/* INSTANT PAYOUT MODAL                                                      */}
      {/* ========================================================================= */}
      <AnimatePresence>
        {withdrawModalOpen && (
          <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-[#101C16] border border-emerald-900/80 rounded-3xl p-6 w-full max-w-md shadow-2xl space-y-4 relative"
            >
              <button
                onClick={() => { setWithdrawModalOpen(false); setWithdrawSuccess(false); }}
                className="absolute top-4 right-4 p-2 rounded-xl text-slate-400 hover:text-white cursor-pointer"
              >
                <X size={18} />
              </button>

              <h3 className="font-display font-bold text-lg text-white">Instant Bank Payout</h3>

              {withdrawSuccess ? (
                <div className="p-6 bg-emerald-950/80 border border-emerald-500/40 rounded-2xl text-center space-y-3">
                  <CheckCircle2 size={36} className="text-emerald-400 mx-auto" />
                  <h4 className="font-display font-bold text-base text-white">Payout Successful!</h4>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    ₦{parseInt(withdrawAmount || '0').toLocaleString()} was transferred to <span className="font-mono text-amber-300">{rider.payoutBank?.bankName || 'GTBank'}</span> ({rider.payoutBank?.accountNumber || '••6789'}).
                  </p>
                  <button
                    onClick={() => { setWithdrawModalOpen(false); setWithdrawSuccess(false); }}
                    className="w-full py-2.5 bg-emerald-500 text-slate-950 font-bold text-xs rounded-xl cursor-pointer"
                  >
                    Done
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div>
                    <label className="block text-[11px] font-mono uppercase text-slate-400 mb-1 font-bold">
                      Enter Amount (₦)
                    </label>
                    <input
                      type="number"
                      value={withdrawAmount}
                      onChange={(e) => setWithdrawAmount(e.target.value)}
                      className="w-full bg-[#08100C] border border-emerald-900/80 rounded-xl px-4 py-3 text-lg font-mono font-bold text-amber-300 focus:outline-none"
                    />
                  </div>

                  <div className="p-3 bg-[#08100C] rounded-xl border border-emerald-900/40 text-xs font-mono text-slate-400 space-y-1">
                    <div className="flex justify-between">
                      <span>Destination:</span>
                      <span className="text-white font-bold">{rider.payoutBank?.bankName || 'GTBank'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Account No:</span>
                      <span className="text-amber-300 font-bold">{rider.payoutBank?.accountNumber || '••••6789'}</span>
                    </div>
                  </div>

                  <button
                    onClick={() => setWithdrawSuccess(true)}
                    className="w-full py-3.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-display font-bold text-xs rounded-xl transition-all cursor-pointer"
                  >
                    Confirm Payout
                  </button>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ========================================================================= */}
      {/* EDIT PROFILE MODAL                                                       */}
      {/* ========================================================================= */}
      <AnimatePresence>
        {editProfileOpen && (
          <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-[#101C16] border border-emerald-900/80 rounded-3xl p-6 w-full max-w-lg shadow-2xl space-y-4 relative max-h-[90vh] overflow-y-auto"
            >
              <button
                onClick={() => setEditProfileOpen(false)}
                className="absolute top-4 right-4 p-2 rounded-xl text-slate-400 hover:text-white cursor-pointer"
              >
                <X size={18} />
              </button>

              <h3 className="font-display font-bold text-lg text-white">Edit Rider Profile</h3>

              <form onSubmit={handleSaveProfile} className="space-y-4 font-sans text-xs">
                <div>
                  <label className="block text-slate-400 font-mono text-[10px] uppercase mb-1">Full Name</label>
                  <input
                    type="text"
                    value={profileForm.fullName}
                    onChange={(e) => setProfileForm({ ...profileForm, fullName: e.target.value })}
                    className="w-full bg-[#08100C] border border-emerald-900/80 rounded-xl px-3 py-2 text-white focus:outline-none"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-400 font-mono text-[10px] uppercase mb-1">Phone Number</label>
                    <input
                      type="text"
                      value={profileForm.phone}
                      onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                      className="w-full bg-[#08100C] border border-emerald-900/80 rounded-xl px-3 py-2 text-white focus:outline-none"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-slate-400 font-mono text-[10px] uppercase mb-1">Vehicle Type</label>
                    <select
                      value={profileForm.vehicleType}
                      onChange={(e) => setProfileForm({ ...profileForm, vehicleType: e.target.value as any })}
                      className="w-full bg-[#08100C] border border-emerald-900/80 rounded-xl px-3 py-2 text-white focus:outline-none"
                    >
                      <option value="Motorcycle">Motorcycle</option>
                      <option value="E-Bike">E-Bike</option>
                      <option value="Bicycle">Bicycle</option>
                      <option value="Scooter">Scooter</option>
                      <option value="Car">Car</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-400 font-mono text-[10px] uppercase mb-1">License Plate</label>
                    <input
                      type="text"
                      value={profileForm.licensePlate}
                      onChange={(e) => setProfileForm({ ...profileForm, licensePlate: e.target.value })}
                      className="w-full bg-[#08100C] border border-emerald-900/80 rounded-xl px-3 py-2 text-amber-300 font-mono focus:outline-none"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-slate-400 font-mono text-[10px] uppercase mb-1">Emergency Phone</label>
                    <input
                      type="text"
                      value={profileForm.emergencyPhone}
                      onChange={(e) => setProfileForm({ ...profileForm, emergencyPhone: e.target.value })}
                      className="w-full bg-[#08100C] border border-emerald-900/80 rounded-xl px-3 py-2 text-white focus:outline-none"
                    />
                  </div>
                </div>

                <div className="pt-2 border-t border-emerald-900/60 font-mono text-[10px] text-amber-400 uppercase font-bold">
                  Payout Bank Details
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-400 font-mono text-[10px] uppercase mb-1">Bank Name</label>
                    <input
                      type="text"
                      value={profileForm.bankName}
                      onChange={(e) => setProfileForm({ ...profileForm, bankName: e.target.value })}
                      className="w-full bg-[#08100C] border border-emerald-900/80 rounded-xl px-3 py-2 text-white focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-400 font-mono text-[10px] uppercase mb-1">Account Number</label>
                    <input
                      type="text"
                      value={profileForm.accountNumber}
                      onChange={(e) => setProfileForm({ ...profileForm, accountNumber: e.target.value })}
                      className="w-full bg-[#08100C] border border-emerald-900/80 rounded-xl px-3 py-2 text-amber-300 font-mono focus:outline-none"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-amber-400 hover:bg-amber-300 text-slate-950 font-display font-extrabold text-xs rounded-xl shadow-lg transition-all cursor-pointer mt-2"
                >
                  Save Profile Changes
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
