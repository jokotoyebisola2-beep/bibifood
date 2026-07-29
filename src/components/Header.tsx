/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ShoppingBag, Search, Menu as MenuIcon, X, User, Navigation, Bell, BookOpen, Clock } from 'lucide-react';
import BibiLogo from './BibiLogo';

interface HeaderProps {
  currentView: string;
  onNavigate: (view: string) => void;
  cartCount: number;
  onCartToggle: () => void;
  onAuthToggle: () => void;
  isLoggedIn: boolean;
  userEmail?: string;
}

export default function Header({
  currentView,
  onNavigate,
  cartCount,
  onCartToggle,
  onAuthToggle,
  isLoggedIn,
  userEmail
}: HeaderProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Track window scroll to toggle sticky styling
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { label: 'Home', id: 'home' },
    { label: 'Menu', id: 'menu' },
    { label: 'Categories', id: 'categories' },
    { label: 'About', id: 'about' },
    { label: 'Rider Hub', id: 'rider-portal' },
    { label: 'Admin', id: 'admin-login' },
  ];

  return (
    <>
      <header
        id="app-header"
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
          isScrolled
            ? 'bg-brand-cream/95 backdrop-blur-md border-b border-brand-chili/5 py-3 shadow-md'
            : 'bg-transparent py-5'
        }`}
      >
        <div className="w-full max-w-7xl mx-auto px-4 md:px-8 flex items-center justify-between">
          
          {/* Logo Brandmark */}
          <button
            id="brand-logo"
            onClick={() => onNavigate('home')}
            className="flex items-center cursor-pointer group text-left h-8 shrink-0"
          >
            {/* Full logo (icon + wordmark) scaling beautifully on desktop, tablet and mobile */}
            <BibiLogo mode="horizontal" className="flex h-7 sm:h-8 md:h-9" />
          </button>
 
          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-8">
            {navItems.map((item) => {
              const isActive = currentView === item.id;
              return (
                <button
                  key={item.id}
                  id={`nav-link-${item.id}`}
                  onClick={() => {
                    if (item.id === 'categories') {
                      onNavigate('home');
                      setTimeout(() => {
                        const el = document.getElementById('categories-section');
                        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                      }, 120);
                    } else {
                      onNavigate(item.id);
                    }
                  }}
                  className={`relative font-sans text-sm font-medium tracking-wide py-1.5 cursor-pointer transition-colors ${
                    isActive ? 'text-brand-chili font-semibold' : 'text-slate-600 hover:text-brand-chili'
                  }`}
                >
                  {item.label}
                  {isActive && (
                    <motion.div
                      layoutId="activeNavLine"
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-chili rounded-full"
                      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                    />
                  )}
                </button>
              );
            })}
          </nav>
 
          {/* Header Action Buttons */}
          <div className="flex items-center gap-3">
            
            {/* Inline search box toggle */}
            <div className="relative hidden md:flex items-center">
              <AnimatePresence>
                {searchOpen && (
                  <motion.input
                    initial={{ width: 0, opacity: 0 }}
                    animate={{ width: 180, opacity: 1 }}
                    exit={{ width: 0, opacity: 0 }}
                    type="text"
                    placeholder="Search menu..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="bg-white border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-sans focus:outline-none focus:border-brand-chili mr-2"
                  />
                )}
              </AnimatePresence>
              <button
                id="search-toggle-btn"
                onClick={() => setSearchOpen(!searchOpen)}
                className="p-2.5 rounded-xl hover:bg-brand-chili/5 transition-colors text-slate-600 cursor-pointer hover:text-brand-chili"
                aria-label="Search meals"
              >
                <Search size={19} />
              </button>
            </div>
 
            {/* Shopping Cart Trigger */}
            <button
              id="cart-header-btn"
              onClick={onCartToggle}
              className="p-2.5 rounded-xl bg-brand-chili text-white hover:bg-brand-chili/95 hover:scale-105 transition-all duration-300 relative flex items-center justify-center cursor-pointer shadow-[0_4px_12px_rgba(198,40,40,0.15)]"
              aria-label="Open Cart"
            >
              <ShoppingBag size={18} className="text-white" />
              <AnimatePresence>
                {cartCount > 0 && (
                  <motion.span
                    key="cart-badge"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-brand-gold text-brand-charcoal font-mono text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-brand-cream"
                  >
                    {cartCount}
                  </motion.span>
                )}
              </AnimatePresence>
            </button>
 
            {/* User Session trigger (Log In / User Account Monogram) */}
            <button
              id="auth-profile-btn"
              onClick={onAuthToggle}
              className={`flex items-center gap-2 px-3 py-2 rounded-xl transition-all border cursor-pointer font-sans text-xs font-semibold shadow-sm ${
                isLoggedIn
                  ? 'bg-brand-success/10 border-brand-success/20 text-brand-success'
                  : 'bg-white border-brand-chili/10 hover:border-brand-chili/30 text-brand-charcoal hover:bg-brand-cream/50'
              }`}
            >
              {isLoggedIn ? (
                <>
                  <div className="w-5 h-5 rounded-full bg-brand-chili text-white text-[10px] flex items-center justify-center font-bold font-mono">
                    {userEmail ? userEmail.substring(0, 2).toUpperCase() : 'US'}
                  </div>
                  <span className="hidden sm:inline max-w-[80px] truncate text-slate-700">
                    Dashboard
                  </span>
                </>
              ) : (
                <>
                  <User size={15} className="text-slate-500" />
                  <span>Log In</span>
                </>
              )}
            </button>

            {/* Mobile Menu Icon */}
            <button
              id="mobile-nav-toggle"
              onClick={() => setIsMobileMenuOpen(true)}
              className="p-2.5 rounded-xl hover:bg-slate-100 transition-colors text-slate-700 cursor-pointer lg:hidden"
              aria-label="Open navigation menu"
            >
              <MenuIcon size={20} />
            </button>

          </div>
        </div>
      </header>

      {/* Mobile Slide-out Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-brand-charcoal/40 backdrop-blur-sm lg:hidden"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="absolute top-0 right-0 bottom-0 w-4/5 max-w-xs bg-brand-cream p-6 shadow-2xl flex flex-col justify-between"
              onClick={(e) => e.stopPropagation()}
            >
              <div>
                <div className="flex items-center justify-between pb-6 border-b border-brand-chili/10">
                  <div className="flex items-center">
                    <BibiLogo mode="icon" className="h-8 w-8" />
                  </div>
                  <button
                    id="close-mobile-nav"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="p-2 rounded-lg hover:bg-brand-chili/5 transition-colors text-slate-500 cursor-pointer"
                  >
                    <X size={18} />
                  </button>
                </div>
 
                <div className="py-8 flex flex-col gap-4">
                  {navItems.map((item) => {
                    const isActive = currentView === item.id;
                    return (
                      <button
                        key={item.id}
                        id={`mobile-nav-link-${item.id}`}
                        onClick={() => {
                          if (item.id === 'categories') {
                            onNavigate('home');
                            setIsMobileMenuOpen(false);
                            setTimeout(() => {
                              const el = document.getElementById('categories-section');
                              if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                            }, 150);
                          } else {
                            onNavigate(item.id);
                            setIsMobileMenuOpen(false);
                          }
                        }}
                        className={`text-left font-sans text-base font-semibold py-2.5 px-4 rounded-xl transition-all cursor-pointer ${
                          isActive
                            ? 'bg-brand-chili text-white shadow-md'
                            : 'text-slate-600 hover:bg-brand-chili/5 hover:text-brand-chili'
                        }`}
                      >
                        {item.label}
                      </button>
                    );
                  })}
                </div>
              </div>
 
              <div className="pt-6 border-t border-brand-chili/10">
                <div className="flex items-center gap-3 text-slate-500 text-xs font-mono mb-4">
                  <Clock size={13} />
                  <span>Serving Daily: 7:00 AM – 10:00 PM</span>
                </div>
                {!isLoggedIn ? (
                  <button
                    onClick={() => {
                      onAuthToggle();
                      setIsMobileMenuOpen(false);
                    }}
                    className="w-full bg-brand-chili text-white font-display font-semibold py-3 px-4 rounded-xl hover:bg-brand-chili/95 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md text-sm"
                  >
                    <User size={16} className="text-brand-gold" />
                    <span>Access Account</span>
                  </button>
                ) : (
                  <div className="p-3 bg-white rounded-xl border border-brand-chili/10 text-center">
                    <p className="text-xs font-sans text-slate-500 mb-1">Active User</p>
                    <p className="text-sm font-sans font-semibold text-brand-charcoal truncate">{userEmail}</p>
                    <button
                      onClick={() => {
                        onNavigate('dashboard');
                        setIsMobileMenuOpen(false);
                      }}
                      className="mt-3 w-full border border-brand-chili text-brand-chili hover:bg-brand-chili hover:text-white rounded-xl py-2 text-xs font-sans font-semibold transition-all"
                    >
                      View Dashboard
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
