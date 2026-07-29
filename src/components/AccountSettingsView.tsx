/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  User, MapPin, Lock, Bell, Globe, Shield, Trash2, Edit2, Plus, 
  Check, Save, Eye, EyeOff, AlertTriangle, CheckCircle2, ChevronRight,
  Smartphone, Mail, MessageSquare, Info, ShieldAlert, Sparkles, X,
  LogOut, Trash
} from 'lucide-react';
import { DeliveryAddress } from '../types';

interface AccountSettingsViewProps {
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
}

export default function AccountSettingsView({ 
  userProfile, 
  onSaveProfile, 
  onLogout,
  onNavigate
}: AccountSettingsViewProps) {
  // Navigation categories: 'personal' | 'addresses' | 'password' | 'notifications' | 'language' | 'security' | 'privacy'
  const [activeTab, setActiveTab] = useState<string>('personal');

  // Personal info state
  const [firstName, setFirstName] = useState(userProfile.firstName || 'Bibi');
  const [lastName, setLastName] = useState(userProfile.lastName || 'User');
  const [email, setEmail] = useState(userProfile.email || 'user@bibifood.com');
  const [phone, setPhone] = useState(userProfile.phone || '');
  const [gender, setGender] = useState(userProfile.gender || '');
  const [dob, setDob] = useState(userProfile.dob || '');
  const [avatar, setAvatar] = useState<string | null>(userProfile.avatarUrl || null);

  // Password setting state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPwd1, setShowPwd1] = useState(false);
  const [showPwd2, setShowPwd2] = useState(false);
  const [showPwd3, setShowPwd3] = useState(false);
  
  // Addresses list state
  const [addresses, setAddresses] = useState<DeliveryAddress[]>(userProfile.addresses || []);
  
  // Address form states (Add/Edit modal)
  const [isAddressFormOpen, setIsAddressFormOpen] = useState(false);
  const [editingAddressId, setEditingAddressId] = useState<string | null>(null);
  const [addressStreet, setAddressStreet] = useState('');
  const [addressCity, setAddressCity] = useState('Lagos');
  const [addressLabel, setAddressLabel] = useState<'Home' | 'Office' | 'Other'>('Home');
  const [addressPhone, setAddressPhone] = useState(userProfile.phone || '');

  // Notifications states
  const [notifOrder, setNotifOrder] = useState(userProfile.notifications?.orderUpdates ?? true);
  const [notifPromo, setNotifPromo] = useState(userProfile.notifications?.promotions ?? true);
  const [notifEmail, setNotifEmail] = useState(userProfile.notifications?.email ?? true);
  const [notifSms, setNotifSms] = useState(userProfile.notifications?.sms ?? true);
  const [notifPush, setNotifPush] = useState(userProfile.notifications?.push ?? false);

  // General settings state
  const [lang, setLang] = useState('en');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState('');

  // Alerts and validations state
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  // Save personal info triggers
  const handleSavePersonalInfo = (e: React.FormEvent) => {
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
      addresses,
      notifications: {
        orderUpdates: notifOrder,
        promotions: notifPromo,
        email: notifEmail,
        sms: notifSms,
        push: notifPush
      }
    };
    onSaveProfile(updated);
    triggerSuccessBanner('Personal information updated successfully!');
  };

  // Password Update
  const handlePasswordUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPassword) {
      setErrorMsg('Please specify your current password credentials.');
      return;
    }
    if (newPassword.length < 6) {
      setErrorMsg('New password must match high-security standards (at least 6 characters).');
      return;
    }
    if (newPassword !== confirmPassword) {
      setErrorMsg('Mismatched confirmation passwords.');
      return;
    }
    setErrorMsg('');
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    triggerSuccessBanner('Your high-security credentials have been safely cycled!');
  };

  // Saved notification updates
  const handleSaveNotificationPrefs = () => {
    const updated = {
      ...userProfile,
      notifications: {
        orderUpdates: notifOrder,
        promotions: notifPromo,
        email: notifEmail,
        sms: notifSms,
        push: notifPush
      }
    };
    onSaveProfile(updated);
    triggerSuccessBanner('Notification preferences updated!');
  };

  // Address Actions
  const handleOpenAddAddress = () => {
    setEditingAddressId(null);
    setAddressStreet('');
    setAddressCity('Lagos');
    setAddressLabel('Home');
    setAddressPhone(phone);
    setErrorMsg('');
    setIsAddressFormOpen(true);
  };

  const handleOpenEditAddress = (addr: DeliveryAddress) => {
    setEditingAddressId(addr.id);
    setAddressStreet(addr.street);
    setAddressCity(addr.city);
    setAddressLabel(addr.label);
    setAddressPhone(addr.phone);
    setErrorMsg('');
    setIsAddressFormOpen(true);
  };

  const handleSaveAddress = (e: React.FormEvent) => {
    e.preventDefault();
    if (!addressStreet.trim()) {
      setErrorMsg('Street address coordinates cannot be blank.');
      return;
    }

    let updatedList: DeliveryAddress[];

    if (editingAddressId) {
      // Edit
      updatedList = addresses.map((addr) => 
        addr.id === editingAddressId 
          ? { ...addr, street: addressStreet, city: addressCity, label: addressLabel, phone: addressPhone }
          : addr
      );
    } else {
      // Create new
      const newAddress: DeliveryAddress = {
        id: `addr-${Date.now()}`,
        street: addressStreet,
        city: addressCity,
        label: addressLabel,
        phone: addressPhone,
        isDefault: addresses.length === 0 // Default if list is empty
      };
      updatedList = [...addresses, newAddress];
    }

    setAddresses(updatedList);
    onSaveProfile({ ...userProfile, addresses: updatedList });
    setIsAddressFormOpen(false);
    triggerSuccessBanner(editingAddressId ? 'Saved address coordinates updated!' : 'Fresh saved delivery address created!');
  };

  const handleDeleteAddress = (id: string) => {
    const updatedList = addresses.filter((addr) => addr.id !== id);
    // If we deleted the default, set first available as default
    if (updatedList.length > 0 && !updatedList.some(a => a.isDefault)) {
      updatedList[0].isDefault = true;
    }
    setAddresses(updatedList);
    onSaveProfile({ ...userProfile, addresses: updatedList });
    triggerSuccessBanner('Address record successfully expunged.');
  };

  const handleMarkDefaultAddress = (id: string) => {
    const updatedList = addresses.map((addr) => ({
      ...addr,
      isDefault: addr.id === id
    }));
    setAddresses(updatedList);
    onSaveProfile({ ...userProfile, addresses: updatedList });
    triggerSuccessBanner('Primary delivery target set.');
  };

  const triggerSuccessBanner = (msg: string) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(''), 4000);
  };

  const handleDeleteAccountSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (deleteConfirmText !== 'DELETE') {
      setErrorMsg('Type DELETE in uppercase letters to verify account deletion.');
      return;
    }
    setErrorMsg('');
    setShowDeleteConfirm(false);
    onLogout();
    onNavigate('home');
    alert('Your Bibi Dining account has been safely decommissioned.');
  };

  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-6 md:py-10">
      
      {/* Alert Notifications Popups */}
      <AnimatePresence>
        {successMsg && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className="fixed top-24 left-1/2 -translate-x-1/2 z-50 bg-brand-basil text-white px-6 py-3 rounded-2xl flex items-center gap-2.5 shadow-xl font-sans text-xs font-bold border border-brand-basil"
          >
            <CheckCircle2 size={16} />
            <span>{successMsg}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex flex-col gap-1.5 mb-8">
        <h1 className="font-display font-black text-2xl md:text-3xl text-brand-charcoal tracking-tight">
          Manage Account Settings
        </h1>
        <p className="font-sans text-xs text-slate-400">
          Personalize delivery coordinates, notification logs, and credentials authentication.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Left Side: Navigation Links Column */}
        <div className="lg:col-span-1 flex flex-col gap-2">
          <div className="bg-white rounded-3xl border border-brand-olive/5 shadow-sm p-4 flex flex-col gap-1">
            <button
              onClick={() => { setActiveTab('personal'); setErrorMsg(''); }}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'personal'
                  ? 'bg-brand-olive text-brand-saffron'
                  : 'text-slate-500 hover:text-brand-charcoal hover:bg-slate-50'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <User size={15} />
                <span>Personal Info</span>
              </div>
              <ChevronRight size={13} className={activeTab === 'personal' ? 'text-brand-saffron' : 'text-slate-300'} />
            </button>

            <button
              onClick={() => { setActiveTab('addresses'); setErrorMsg(''); }}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'addresses'
                  ? 'bg-brand-olive text-brand-saffron'
                  : 'text-slate-500 hover:text-brand-charcoal hover:bg-slate-50'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <MapPin size={15} />
                <span>Saved Addresses</span>
              </div>
              <ChevronRight size={13} className={activeTab === 'addresses' ? 'text-brand-saffron' : 'text-slate-300'} />
            </button>

            <button
              onClick={() => { setActiveTab('password'); setErrorMsg(''); }}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'password'
                  ? 'bg-brand-olive text-brand-saffron'
                  : 'text-slate-500 hover:text-brand-charcoal hover:bg-slate-50'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Lock size={15} />
                <span>Change Password</span>
              </div>
              <ChevronRight size={13} className={activeTab === 'password' ? 'text-brand-saffron' : 'text-slate-300'} />
            </button>

            <button
              onClick={() => { setActiveTab('notifications'); setErrorMsg(''); }}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'notifications'
                  ? 'bg-brand-olive text-brand-saffron'
                  : 'text-slate-500 hover:text-brand-charcoal hover:bg-slate-50'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Bell size={15} />
                <span>Notifications</span>
              </div>
              <ChevronRight size={13} className={activeTab === 'notifications' ? 'text-brand-saffron' : 'text-slate-300'} />
            </button>

            <button
              onClick={() => { setActiveTab('language'); setErrorMsg(''); }}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'language'
                  ? 'bg-brand-olive text-brand-saffron'
                  : 'text-slate-500 hover:text-brand-charcoal hover:bg-slate-50'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Globe size={15} />
                <span>Language & Local</span>
              </div>
              <ChevronRight size={13} className={activeTab === 'language' ? 'text-brand-saffron' : 'text-slate-300'} />
            </button>

            <button
              onClick={() => { setActiveTab('security'); setErrorMsg(''); }}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'security'
                  ? 'bg-brand-olive text-brand-saffron'
                  : 'text-slate-500 hover:text-brand-charcoal hover:bg-slate-50'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Shield size={15} />
                <span>Security Suite</span>
              </div>
              <ChevronRight size={13} className={activeTab === 'security' ? 'text-brand-saffron' : 'text-slate-300'} />
            </button>
          </div>

          <div className="bg-white rounded-3xl border border-brand-olive/5 shadow-sm p-4 flex flex-col gap-1.5">
            <button
              onClick={onLogout}
              className="w-full flex items-center gap-2.5 px-4 py-3 rounded-xl text-xs font-bold text-rose-500 hover:bg-rose-50 transition-colors text-left cursor-pointer"
            >
              <LogOut size={14} />
              <span>Log Out Account</span>
            </button>
            <button
              onClick={() => { setShowDeleteConfirm(true); setErrorMsg(''); }}
              className="w-full flex items-center gap-2.5 px-4 py-3 rounded-xl text-xs font-bold text-slate-400 hover:text-slate-600 hover:bg-slate-50 transition-colors text-left cursor-pointer"
            >
              <Trash2 size={14} />
              <span>Delete Account</span>
            </button>
          </div>
        </div>

        {/* Right Side: Tab Panel Content Container */}
        <div className="lg:col-span-3">
          
          {errorMsg && (
            <div className="mb-6 p-4 bg-rose-50 border border-rose-100 text-[#C62828] font-sans text-xs rounded-2xl flex items-start gap-2.5">
              <AlertTriangle size={16} className="shrink-0 mt-0.5 text-brand-chili" />
              <span>{errorMsg}</span>
            </div>
          )}

          <div className="bg-white rounded-3xl border border-brand-olive/5 shadow-sm p-6 md:p-8 min-h-[450px]">
            
            {/* PERSONAL INFORMATION TAB */}
            {activeTab === 'personal' && (
              <form onSubmit={handleSavePersonalInfo} className="flex flex-col gap-6">
                <div className="flex justify-between items-center pb-3 border-b border-slate-100">
                  <h3 className="font-display font-semibold text-sm text-brand-charcoal">
                    Personal Information Details
                  </h3>
                  <button
                    type="submit"
                    className="bg-brand-olive hover:bg-[#131E18] text-brand-saffron font-display font-bold py-2 px-5 rounded-xl text-xs flex items-center gap-1.5 cursor-pointer shadow-sm active:scale-95 transition-all"
                  >
                    <Save size={12} />
                    <span>Save Changes</span>
                  </button>
                </div>

                {/* Avatar Placeholder section */}
                <div className="flex flex-col sm:flex-row items-center gap-5 bg-[#FAF8F5] p-5 rounded-3xl border border-slate-100/50">
                  <div className="relative w-20 h-20 rounded-full bg-slate-200 border-2 border-white shadow-md flex items-center justify-center overflow-hidden shrink-0">
                    {avatar ? (
                      <img src={avatar} alt="User Profile avatar" className="w-full h-full object-cover" />
                    ) : (
                      <div className="text-center">
                        <User size={30} className="text-slate-400 mx-auto" />
                        <span className="block text-[8px] font-mono text-slate-400 uppercase mt-1">No Pic</span>
                      </div>
                    )}
                  </div>
                  <div className="text-center sm:text-left">
                    <h4 className="font-display font-bold text-xs text-brand-charcoal">Customer Profile Avatar</h4>
                    <p className="font-sans text-[10px] text-slate-400 mt-1 max-w-xs">
                      We support high-fidelity custom photo uploads to identify orders for dispatch couriers.
                    </p>
                    <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2.5 mt-3">
                      <label className="bg-white hover:bg-slate-50 text-slate-600 border border-slate-200 px-3 py-1.5 rounded-lg text-[10px] font-bold font-sans cursor-pointer transition-colors shadow-sm">
                        <span>Change Photo</span>
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
                          className="text-rose-500 hover:bg-rose-50 border border-rose-100 px-3 py-1.5 rounded-lg text-[10px] font-bold font-sans cursor-pointer transition-colors"
                        >
                          Remove Pic
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-sans text-xs font-semibold text-brand-olive mb-1.5">First Name</label>
                    <input
                      type="text"
                      required
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      className="w-full bg-slate-50 text-slate-800 font-sans text-xs px-4 py-3.5 rounded-xl border border-slate-200 focus:outline-none focus:border-brand-olive focus:bg-white"
                    />
                  </div>
                  <div>
                    <label className="block font-sans text-xs font-semibold text-brand-olive mb-1.5">Last Name</label>
                    <input
                      type="text"
                      required
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      className="w-full bg-slate-50 text-slate-800 font-sans text-xs px-4 py-3.5 rounded-xl border border-slate-200 focus:outline-none focus:border-brand-olive focus:bg-white"
                    />
                  </div>
                  <div>
                    <label className="block font-sans text-xs font-semibold text-brand-olive mb-1.5">Email Address</label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-slate-50 text-slate-800 font-sans text-xs px-4 py-3.5 rounded-xl border border-slate-200 focus:outline-none focus:border-brand-olive focus:bg-white"
                    />
                  </div>
                  <div>
                    <label className="block font-sans text-xs font-semibold text-brand-olive mb-1.5">Phone Number</label>
                    <input
                      type="text"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full bg-slate-50 text-slate-800 font-sans text-xs px-4 py-3.5 rounded-xl border border-slate-200 focus:outline-none focus:border-brand-olive focus:bg-white"
                    />
                  </div>
                  <div>
                    <label className="block font-sans text-xs font-semibold text-brand-olive mb-1.5">Gender</label>
                    <select
                      value={gender}
                      onChange={(e) => setGender(e.target.value)}
                      className="w-full bg-slate-50 text-slate-800 font-sans text-xs px-4 py-3.5 rounded-xl border border-slate-200 focus:outline-none focus:border-brand-olive focus:bg-white"
                    >
                      <option value="">Choose Gender</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="block font-sans text-xs font-semibold text-brand-olive mb-1.5">Date of Birth</label>
                    <input
                      type="date"
                      value={dob}
                      onChange={(e) => setDob(e.target.value)}
                      className="w-full bg-slate-50 text-slate-800 font-sans text-xs px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:border-brand-olive focus:bg-white"
                    />
                  </div>
                </div>
              </form>
            )}

            {/* SAVED ADDRESSES TAB */}
            {activeTab === 'addresses' && (
              <div className="flex flex-col gap-6">
                <div className="flex justify-between items-center pb-3 border-b border-slate-100">
                  <h3 className="font-display font-semibold text-sm text-brand-charcoal">
                    Saved Delivery Addresses
                  </h3>
                  <button
                    onClick={handleOpenAddAddress}
                    className="bg-brand-chili hover:bg-[#A31F1F] text-white font-display font-bold py-2 px-4 rounded-xl text-xs flex items-center gap-1.5 cursor-pointer shadow-sm active:scale-95 transition-all"
                  >
                    <Plus size={14} />
                    <span>Add Address</span>
                  </button>
                </div>

                {addresses.length === 0 ? (
                  /* BEAUTIFUL EMPTY STATE FOR ADDRESSES */
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
                      className="bg-brand-olive hover:bg-[#131E18] text-brand-saffron font-display font-bold text-[10px] uppercase tracking-wider py-2.5 px-6 rounded-xl mt-2 cursor-pointer transition-colors"
                    >
                      Setup Delivery Coordinates
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {addresses.map((addr) => (
                      <div 
                        key={addr.id} 
                        className={`p-5 rounded-2xl border transition-all flex flex-col gap-3.5 justify-between relative ${
                          addr.isDefault 
                            ? 'bg-brand-gold/[0.04] border-brand-gold/40' 
                            : 'bg-white border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        <div className="flex justify-between items-start">
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-[9px] bg-brand-olive text-brand-saffron font-extrabold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                              {addr.label}
                            </span>
                            {addr.isDefault && (
                              <span className="font-sans text-[10px] text-brand-basil font-bold flex items-center gap-0.5 bg-brand-basil/10 px-2 py-0.5 rounded-md">
                                <Check size={11} />
                                <span>Default</span>
                              </span>
                            )}
                          </div>

                          <div className="flex items-center gap-1.5">
                            <button
                              onClick={() => handleOpenEditAddress(addr)}
                              className="p-1.5 text-slate-400 hover:text-brand-olive hover:bg-slate-50 rounded-lg transition-colors cursor-pointer"
                              title="Edit coordinates"
                            >
                              <Edit2 size={13} />
                            </button>
                            <button
                              onClick={() => handleDeleteAddress(addr.id)}
                              className="p-1.5 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                              title="Delete coordinate log"
                            >
                              <Trash2 size={13} />
                            </button>
                          </div>
                        </div>

                        <div>
                          <p className="font-sans text-xs font-bold text-slate-800 leading-normal">{addr.street}</p>
                          <p className="font-sans text-[11px] text-slate-400 mt-1">{addr.city}</p>
                          <p className="font-sans text-[10px] text-slate-400 font-semibold mt-1 flex items-center gap-1">
                            <Smartphone size={10} />
                            <span>{addr.phone}</span>
                          </p>
                        </div>

                        {!addr.isDefault && (
                          <button
                            onClick={() => handleMarkDefaultAddress(addr.id)}
                            className="text-[10px] font-sans font-bold text-brand-olive hover:text-[#131E18] text-left underline cursor-pointer"
                          >
                            Mark Default Coordinates
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* PASSWORD TAB */}
            {activeTab === 'password' && (
              <form onSubmit={handlePasswordUpdate} className="flex flex-col gap-6">
                <div className="flex justify-between items-center pb-3 border-b border-slate-100">
                  <h3 className="font-display font-semibold text-sm text-brand-charcoal">
                    Cycle Account Password Credentials
                  </h3>
                  <button
                    type="submit"
                    className="bg-brand-olive hover:bg-[#131E18] text-brand-saffron font-display font-bold py-2 px-5 rounded-xl text-xs flex items-center gap-1.5 cursor-pointer shadow-sm active:scale-95 transition-all"
                  >
                    <Save size={12} />
                    <span>Save Password</span>
                  </button>
                </div>

                <div className="flex items-start gap-3 bg-brand-olive/5 p-4 rounded-2xl border border-brand-olive/10 max-w-xl">
                  <ShieldAlert size={18} className="text-brand-olive shrink-0 mt-0.5" />
                  <p className="font-sans text-xs text-slate-500 leading-normal">
                    Cycling security keys ensures that unauthorized API dispatches cannot hijack your account database settings. Select a password that utilizes mixed symbols.
                  </p>
                </div>

                <div className="flex flex-col gap-4 max-w-md">
                  <div>
                    <label className="block font-sans text-xs font-semibold text-brand-olive mb-1.5">Current Password</label>
                    <div className="relative">
                      <input
                        type={showPwd1 ? 'text' : 'password'}
                        required
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full bg-slate-50 text-slate-800 font-sans text-xs px-4.5 py-3.5 pr-11 rounded-xl border border-slate-200 focus:outline-none focus:bg-white"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPwd1(!showPwd1)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                      >
                        {showPwd1 ? <EyeOff size={14} /> : <Eye size={14} />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block font-sans text-xs font-semibold text-brand-olive mb-1.5">New Password</label>
                    <div className="relative">
                      <input
                        type={showPwd2 ? 'text' : 'password'}
                        required
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="Choose new safe password"
                        className="w-full bg-slate-50 text-slate-800 font-sans text-xs px-4.5 py-3.5 pr-11 rounded-xl border border-slate-200 focus:outline-none focus:bg-white"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPwd2(!showPwd2)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                      >
                        {showPwd2 ? <EyeOff size={14} /> : <Eye size={14} />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block font-sans text-xs font-semibold text-brand-olive mb-1.5">Confirm New Password</label>
                    <div className="relative">
                      <input
                        type={showPwd3 ? 'text' : 'password'}
                        required
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Confirm new safe password"
                        className="w-full bg-slate-50 text-slate-800 font-sans text-xs px-4.5 py-3.5 pr-11 rounded-xl border border-slate-200 focus:outline-none focus:bg-white"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPwd3(!showPwd3)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                      >
                        {showPwd3 ? <EyeOff size={14} /> : <Eye size={14} />}
                      </button>
                    </div>
                  </div>
                </div>
              </form>
            )}

            {/* NOTIFICATIONS TAB */}
            {activeTab === 'notifications' && (
              <div className="flex flex-col gap-6">
                <div className="flex justify-between items-center pb-3 border-b border-slate-100">
                  <h3 className="font-display font-semibold text-sm text-brand-charcoal">
                    Notification Channel Preferences
                  </h3>
                  <button
                    onClick={handleSaveNotificationPrefs}
                    className="bg-brand-olive hover:bg-[#131E18] text-brand-saffron font-display font-bold py-2 px-5 rounded-xl text-xs flex items-center gap-1.5 cursor-pointer shadow-sm active:scale-95 transition-all"
                  >
                    <Check size={12} />
                    <span>Apply Preferences</span>
                  </button>
                </div>

                <div className="flex flex-col gap-6 max-w-2xl">
                  <div>
                    <h4 className="font-display font-bold text-xs text-slate-800 uppercase tracking-wider mb-3">Activities Triggering Notifications</h4>
                    <div className="flex flex-col gap-4">
                      <label className="flex items-start gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100/50 cursor-pointer select-none">
                        <input
                          type="checkbox"
                          checked={notifOrder}
                          onChange={(e) => setNotifOrder(e.target.checked)}
                          className="w-4.5 h-4.5 rounded border-slate-300 text-brand-olive focus:ring-brand-olive mt-0.5 shrink-0"
                        />
                        <div>
                          <span className="block font-sans text-xs font-bold text-brand-charcoal">Order Dispatch Updates</span>
                          <span className="block font-sans text-[11px] text-slate-400 mt-1">Get instant feedback during meal preps, rider dispatches, and box arrival.</span>
                        </div>
                      </label>

                      <label className="flex items-start gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100/50 cursor-pointer select-none">
                        <input
                          type="checkbox"
                          checked={notifPromo}
                          onChange={(e) => setNotifPromo(e.target.checked)}
                          className="w-4.5 h-4.5 rounded border-slate-300 text-brand-olive focus:ring-brand-olive mt-0.5 shrink-0"
                        />
                        <div>
                          <span className="block font-sans text-xs font-bold text-brand-charcoal">Weekly Promotions & Gastronomy Perks</span>
                          <span className="block font-sans text-[11px] text-slate-400 mt-1">Receive premium discount vouchers, weekend flash sales, and menu expansion alerts.</span>
                        </div>
                      </label>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-display font-bold text-xs text-slate-800 uppercase tracking-wider mb-3">Transmission Media</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <button
                        onClick={() => setNotifEmail(!notifEmail)}
                        className={`p-4 rounded-2xl border text-left flex flex-col gap-3 transition-all cursor-pointer ${
                          notifEmail 
                            ? 'bg-brand-olive/[0.03] border-brand-olive text-brand-olive' 
                            : 'bg-white border-slate-200 text-slate-400 hover:text-slate-600'
                        }`}
                      >
                        <Mail size={16} />
                        <div>
                          <span className="block font-sans text-xs font-bold">Email Transmits</span>
                          <span className="block font-sans text-[9px] text-slate-400 mt-0.5">Summary receipt & statements</span>
                        </div>
                      </button>

                      <button
                        onClick={() => setNotifSms(!notifSms)}
                        className={`p-4 rounded-2xl border text-left flex flex-col gap-3 transition-all cursor-pointer ${
                          notifSms 
                            ? 'bg-brand-olive/[0.03] border-brand-olive text-brand-olive' 
                            : 'bg-white border-slate-200 text-slate-400 hover:text-slate-600'
                        }`}
                      >
                        <MessageSquare size={16} />
                        <div>
                          <span className="block font-sans text-xs font-bold">SMS Dispatch</span>
                          <span className="block font-sans text-[9px] text-slate-400 mt-0.5">Nigeria telecom messages</span>
                        </div>
                      </button>

                      <button
                        onClick={() => setNotifPush(!notifPush)}
                        className={`p-4 rounded-2xl border text-left flex flex-col gap-3 transition-all cursor-pointer ${
                          notifPush 
                            ? 'bg-brand-olive/[0.03] border-brand-olive text-brand-olive' 
                            : 'bg-white border-slate-200 text-slate-400 hover:text-slate-600'
                        }`}
                      >
                        <Sparkles size={16} />
                        <div>
                          <span className="block font-sans text-xs font-bold">App Push Alerts</span>
                          <span className="block font-sans text-[9px] text-slate-400 mt-0.5">Real-time mobile triggers</span>
                        </div>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* LANGUAGE TAB */}
            {activeTab === 'language' && (
              <div className="flex flex-col gap-6">
                <div className="flex justify-between items-center pb-3 border-b border-slate-100">
                  <h3 className="font-display font-semibold text-sm text-brand-charcoal">
                    Language & Regionalization Settings
                  </h3>
                </div>

                <div className="flex flex-col gap-5 max-w-md">
                  <div>
                    <label className="block font-sans text-xs font-semibold text-brand-olive mb-1.5">Application Interface Language</label>
                    <select
                      value={lang}
                      onChange={(e) => {
                        setLang(e.target.value);
                        triggerSuccessBanner('Display language switched!');
                      }}
                      className="w-full bg-slate-50 text-slate-800 font-sans text-xs px-4 py-3.5 rounded-xl border border-slate-200 focus:outline-none focus:bg-white"
                    >
                      <option value="en">English (United Kingdom / Nigeria)</option>
                      <option value="yo">Yorùbá</option>
                      <option value="ha">Hausa</option>
                      <option value="ig">Igbo</option>
                      <option value="fr">French (West Africa)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-sans text-xs font-semibold text-brand-olive mb-1.5">Default Currency Unit</label>
                    <input
                      type="text"
                      disabled
                      value="₦ - Nigerian Naira (NGN)"
                      className="w-full bg-slate-100 text-slate-500 font-sans text-xs px-4 py-3.5 rounded-xl border border-slate-200 cursor-not-allowed"
                    />
                    <p className="font-sans text-[10px] text-slate-400 mt-1 ml-1">
                      Our automated culinary dispatch channels operate primarily inside Nigerian financial zones.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* SECURITY TAB */}
            {activeTab === 'security' && (
              <div className="flex flex-col gap-6">
                <div className="flex justify-between items-center pb-3 border-b border-slate-100">
                  <h3 className="font-display font-semibold text-sm text-brand-charcoal">
                    Bibi Gastronomy Security Suite
                  </h3>
                </div>

                <div className="flex flex-col gap-6 max-w-xl">
                  {/* Two-factor authentication coming soon */}
                  <div className="bg-[#FAF8F5] p-5 rounded-3xl border border-slate-100/50 flex flex-col gap-3">
                    <div className="flex items-center gap-2.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-brand-gold" />
                      <h4 className="font-display font-bold text-xs text-brand-charcoal uppercase tracking-wider">Two-Factor Authenticator (2FA)</h4>
                    </div>
                    <p className="font-sans text-[11px] text-slate-500 leading-relaxed">
                      Transmit an additional confirmation SMS token on every login block. It increases shield ratings.
                    </p>
                    <span className="inline-block self-start text-[9px] font-mono font-bold bg-brand-gold/15 text-brand-charcoal px-3 py-1 rounded-full uppercase tracking-wider mt-1">
                      Coming Soon to Beta
                    </span>
                  </div>

                  {/* Trusted Devices placeholder */}
                  <div>
                    <h4 className="font-display font-bold text-xs text-brand-charcoal uppercase tracking-wider mb-3">Recently Active Session Logs</h4>
                    <div className="flex flex-col gap-3">
                      <div className="p-4 bg-white border border-slate-200 rounded-2xl flex items-center justify-between text-xs font-sans">
                        <div className="flex items-center gap-3">
                          <Smartphone size={16} className="text-brand-basil" />
                          <div>
                            <p className="font-bold text-slate-800">Apple iPhone 15 Pro</p>
                            <p className="text-[10px] text-slate-400">Lagos, Nigeria • Current active session</p>
                          </div>
                        </div>
                        <span className="font-mono text-[9px] font-bold text-brand-basil bg-brand-basil/10 px-2 py-0.5 rounded-md uppercase tracking-wider">Online</span>
                      </div>

                      <div className="p-4 bg-white border border-slate-200 rounded-2xl flex items-center justify-between text-xs font-sans">
                        <div className="flex items-center gap-3">
                          <Globe size={16} className="text-slate-400" />
                          <div>
                            <p className="font-bold text-slate-800">Chrome on macOS Monterey</p>
                            <p className="text-[10px] text-slate-400">Lekki, Nigeria • Active 2 hours ago</p>
                          </div>
                        </div>
                        <button
                          onClick={() => triggerSuccessBanner('Remote browser session ended.')}
                          className="font-sans text-[10px] font-bold text-brand-chili hover:underline cursor-pointer"
                        >
                          Revoke
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

          </div>

        </div>

      </div>

      {/* SAVED ADDRESS FORM DIALOG / MODAL POPUP */}
      <AnimatePresence>
        {isAddressFormOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-brand-charcoal/60 backdrop-blur-sm"
              onClick={() => setIsAddressFormOpen(false)}
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="bg-white rounded-3xl overflow-hidden shadow-2xl relative z-10 w-full max-w-md p-6"
            >
              <button
                onClick={() => setIsAddressFormOpen(false)}
                className="absolute top-5 right-5 w-8 h-8 rounded-full bg-slate-50 hover:bg-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-700 border border-slate-100 transition-colors cursor-pointer"
              >
                <X size={14} />
              </button>

              <h3 className="font-display font-black text-lg text-brand-charcoal mb-1">
                {editingAddressId ? 'Edit Address Log' : 'Add New Address'}
              </h3>
              <p className="font-sans text-xs text-slate-400 mb-5">
                Saved locations automatically populates delivery targets during checkout.
              </p>

              <form onSubmit={handleSaveAddress} className="flex flex-col gap-4">
                <div>
                  <label className="block font-sans text-xs font-semibold text-brand-olive mb-1.5 ml-1">Street Address Coordinates</label>
                  <input
                    type="text"
                    required
                    value={addressStreet}
                    onChange={(e) => setAddressStreet(e.target.value)}
                    placeholder="e.g. Plot 14 Broad Street, Marina"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs font-sans focus:outline-none focus:border-brand-olive focus:bg-white text-slate-800 placeholder-slate-400"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-sans text-xs font-semibold text-brand-olive mb-1.5 ml-1">State Zone</label>
                    <input
                      type="text"
                      disabled
                      value="Lagos State"
                      className="w-full bg-slate-100 border border-slate-200 rounded-xl px-4 py-3 text-xs font-sans text-slate-500 cursor-not-allowed"
                    />
                  </div>
                  <div>
                    <label className="block font-sans text-xs font-semibold text-brand-olive mb-1.5 ml-1">City Hub</label>
                    <select
                      value={addressCity}
                      onChange={(e) => setAddressCity(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-3 text-xs font-sans focus:outline-none focus:border-brand-olive focus:bg-white text-slate-800"
                    >
                      <option value="Lagos">Lagos Island / Marina</option>
                      <option value="Lekki">Lekki Phase 1</option>
                      <option value="Victoria Island">Victoria Island</option>
                      <option value="Ikeja">Ikeja Gra</option>
                      <option value="Surulere">Surulere</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block font-sans text-xs font-semibold text-brand-olive mb-1.5 ml-1">Location Label</label>
                  <div className="flex gap-2">
                    {(['Home', 'Office', 'Other'] as const).map((lbl) => (
                      <button
                        key={lbl}
                        type="button"
                        onClick={() => setAddressLabel(lbl)}
                        className={`flex-1 py-2.5 rounded-xl text-xs font-sans font-bold border transition-all cursor-pointer ${
                          addressLabel === lbl 
                            ? 'bg-brand-olive text-brand-saffron border-brand-olive shadow-sm' 
                            : 'bg-slate-50 border-slate-200 text-slate-400 hover:text-slate-600'
                        }`}
                      >
                        {lbl}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block font-sans text-xs font-semibold text-brand-olive mb-1.5 ml-1">Contact Phone Number</label>
                  <input
                    type="text"
                    required
                    value={addressPhone}
                    onChange={(e) => setAddressPhone(e.target.value)}
                    placeholder="e.g. 08012345678"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs font-sans focus:outline-none focus:border-brand-olive focus:bg-white text-slate-800 placeholder-slate-400"
                  />
                </div>

                <div className="flex gap-3 mt-3">
                  <button
                    type="submit"
                    className="flex-1 bg-brand-olive hover:bg-[#131E18] text-brand-saffron font-display font-bold py-3.5 rounded-xl transition-all shadow-md cursor-pointer text-xs"
                  >
                    Save Address Log
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsAddressFormOpen(false)}
                    className="bg-slate-100 hover:bg-slate-200 text-slate-500 font-display font-bold px-5 py-3.5 rounded-xl transition-all cursor-pointer text-xs"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ACCOUNT DELETION CONFIRMATION DIALOG / OVERLAY */}
      <AnimatePresence>
        {showDeleteConfirm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-brand-charcoal/60 backdrop-blur-sm"
              onClick={() => setShowDeleteConfirm(false)}
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl shadow-2xl z-10 w-full max-w-md p-6 relative border border-rose-100"
            >
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="absolute top-5 right-5 w-8 h-8 rounded-full bg-slate-50 hover:bg-slate-100 flex items-center justify-center text-slate-400 border border-slate-100 cursor-pointer"
              >
                <X size={14} />
              </button>

              <div className="w-12 h-12 bg-rose-50 text-rose-600 rounded-2xl flex items-center justify-center mb-4">
                <AlertTriangle size={24} />
              </div>

              <h3 className="font-display font-black text-lg text-slate-800 mb-1">
                Decommission Bibi Account?
              </h3>
              <p className="font-sans text-xs text-slate-400 leading-relaxed mb-4">
                This is permanent and irreversible. Your history log, saved address coordinates, and Elite Dining Bibi points will be expunged from the central server.
              </p>

              <form onSubmit={handleDeleteAccountSubmit} className="flex flex-col gap-4">
                <div className="bg-rose-50/50 p-3 rounded-xl border border-rose-100/50 text-[11px] text-rose-700 leading-normal mb-1">
                  Type <strong className="font-mono bg-rose-100 px-1 py-0.5 rounded text-rose-900">DELETE</strong> below to confirm.
                </div>

                <input
                  type="text"
                  required
                  value={deleteConfirmText}
                  onChange={(e) => setDeleteConfirmText(e.target.value)}
                  placeholder="Type DELETE..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs font-sans focus:outline-none focus:border-rose-400 focus:bg-white text-slate-800"
                />

                <div className="flex gap-3">
                  <button
                    type="submit"
                    className="flex-1 bg-rose-600 hover:bg-rose-700 text-white font-display font-bold py-3.5 rounded-xl shadow-md transition-all cursor-pointer text-xs flex items-center justify-center gap-1.5"
                  >
                    <Trash size={13} />
                    <span>Confirm Delete</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowDeleteConfirm(false)}
                    className="bg-slate-100 hover:bg-slate-200 text-slate-500 font-display font-bold px-5 py-3.5 rounded-xl transition-all cursor-pointer text-xs"
                  >
                    Keep Account
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
