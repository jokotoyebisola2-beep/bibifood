/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ChevronRight,
  ChevronDown,
  ChevronUp,
  Sparkles,
  Heart,
  ArrowRight,
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
  ShieldCheck,
  Shield,
  Truck,
  ChefHat,
  Utensils,
  Award,
  ThumbsUp,
  Pizza,
  Beef,
  Egg,
  Cookie,
  Cake,
  Wine,
  CupSoda,
  Salad,
  Soup,
  FlameKindling,
  Search
} from 'lucide-react';

import { CATEGORIES, MEALS, REVIEWS } from '../data';
import { Meal } from '../types';
import MealCard from './MealCard';
import BibiLogo from './BibiLogo';

interface HomeViewProps {
  addressInput: string;
  setAddressInput: (val: string) => void;
  coverageChecked: 'unchecked' | 'success' | 'failed';
  handleCoverageCheck: (e: React.FormEvent) => void;
  newsletterEmail: string;
  setNewsletterEmail: (val: string) => void;
  newsletterSubscribed: boolean;
  handleNewsletterSubmit: (e: React.FormEvent) => void;
  handleAddToCart: (meal: Meal) => void;
  handleQuickView: (meal: Meal) => void;
  setActiveCategory: (slug: string) => void;
  setCurrentView: (view: string) => void;
  menuSearch: string;
  setMenuSearch: (val: string) => void;
}

export default function HomeView({
  addressInput,
  setAddressInput,
  coverageChecked,
  handleCoverageCheck,
  newsletterEmail,
  setNewsletterEmail,
  newsletterSubscribed,
  handleNewsletterSubmit,
  handleAddToCart,
  handleQuickView,
  setActiveCategory,
  setCurrentView,
  menuSearch,
  setMenuSearch
}: HomeViewProps) {
  const [activeTestimonialIdx, setActiveTestimonialIdx] = useState(0);
  const [activeFaqIdx, setActiveFaqIdx] = useState<number | null>(null);

  // Map Category Icons dynamically
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

  return (
    <motion.div
      key="home-view"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="relative"
    >
      
      {/* HERO SECTION - REDESIGNED */}
      <section className="relative overflow-hidden pt-6 pb-16 lg:pt-10 lg:pb-24 bg-[#FAF8F5]">
        {/* Animated decorative background elements */}
        <div className="absolute top-0 left-0 right-0 h-full pointer-events-none overflow-hidden">
          <motion.div 
            animate={{ rotate: 360 }}
            transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
            className="absolute -top-40 -left-40 w-[600px] h-[600px] rounded-full bg-[#C62828]/5 blur-3xl"
          />
          <motion.div 
            animate={{ rotate: -360 }}
            transition={{ duration: 50, repeat: Infinity, ease: "linear" }}
            className="absolute -bottom-20 -right-20 w-[450px] h-[450px] rounded-full bg-[#F4B400]/5 blur-3xl"
          />
          <div className="absolute top-1/3 left-1/4 w-2 h-2 rounded-full bg-[#F4B400]/40 animate-ping" />
          <div className="absolute top-1/2 right-1/4 w-3 h-3 rounded-full bg-emerald-500/20 animate-pulse" />
        </div>

        <div className="w-full max-w-7xl mx-auto px-4 md:px-8 relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          
          {/* Left Column: Headline and Actions */}
          <div className="flex flex-col lg:col-span-6 text-left">
            
            {/* Customer Satisfaction Badge */}
            <div className="inline-flex items-center gap-2 bg-[#C62828]/5 border border-[#C62828]/10 py-1.5 px-3.5 rounded-full w-fit hover:bg-[#C62828]/10 transition-all duration-300 shadow-sm mb-4">
              <div className="flex items-center gap-0.5">
                {[1,2,3,4,5].map((s) => (
                  <Star key={s} size={11} className="text-[#F4B400] fill-[#F4B400]" />
                ))}
              </div>
              <span className="font-mono text-[9px] font-extrabold text-brand-charcoal uppercase tracking-wider">
                ⭐ 12,000+ Happy Customers
              </span>
            </div>

            {/* Large Headline */}
            <h1 className="font-display font-black text-3xl xs:text-4xl sm:text-[44px] md:text-5.5xl lg:text-6xl xl:text-[66px] text-brand-charcoal tracking-tight leading-[1.08] mb-4">
              <span className="block">Smoked Jollof.</span>
              <span className="block">Sizzling Suya.</span>
              <span className="text-[#C62828] relative inline-block mt-1 sm:mt-0">
                <span className="whitespace-nowrap">Delivered Burning Hot.</span>
                <span className="absolute bottom-1 left-0 w-full h-[4px] sm:h-[6px] bg-[#F4B400]/20 -z-10 rounded-full" />
              </span>
            </h1>

            {/* Supporting Headline */}
            <p className="font-sans text-xs sm:text-sm text-slate-500 leading-relaxed max-w-xl mb-6">
              Bibi Food controls the entire value chain—sourcing organic farm-fresh ingredients, cooking under executive chefs in elite cloud facilities, and dispatching via customized thermal-insulated carriers. Absolute culinary perfection. Zero middleman chaos.
            </p>

            {/* Premium Unified Search Experience */}
            <div className="flex flex-col gap-3 max-w-xl mb-5">
              <div className="bg-white p-2 rounded-2xl md:rounded-3xl border border-slate-200 shadow-md relative z-20 focus-within:border-[#C62828] focus-within:ring-2 focus-within:ring-[#C62828]/5 transition-all">
                <div className="flex items-center justify-between">
                  <div className="flex-1 flex items-center gap-2.5 px-3">
                    <Search size={16} className="text-slate-400 shrink-0" />
                    <input
                      type="text"
                      placeholder="Search Jollof Rice, Shawarma, Smoothies..."
                      value={menuSearch}
                      onChange={(e) => setMenuSearch(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          setCurrentView('menu');
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                        }
                      }}
                      className="w-full bg-transparent text-slate-800 font-sans text-xs sm:text-sm focus:outline-none placeholder-slate-400"
                    />
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    {/* Voice Search Placeholder */}
                    <div className="hidden sm:flex items-center gap-1 text-slate-400 text-[9px] px-2 py-1.5 bg-slate-50 border border-slate-100 rounded-lg select-none">
                      <span className="w-1.5 h-1.5 bg-[#C62828] rounded-full animate-pulse" />
                      <span className="font-mono font-bold tracking-wider uppercase">Voice</span>
                    </div>
                    <button
                      onClick={() => {
                        setCurrentView('menu');
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                      className="bg-[#C62828] text-white hover:bg-[#C62828]/95 font-display font-semibold py-2.5 px-5 rounded-xl md:rounded-2xl text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-md hover:shadow-lg"
                    >
                      <span>Search</span>
                      <ArrowRight size={12} />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Double Visually Striking Actions (CTAs) */}
            <div className="flex flex-wrap gap-4 mb-6">
              <button
                onClick={() => {
                  setCurrentView('menu');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="bg-[#C62828] hover:bg-[#C62828]/95 text-white font-display font-extrabold py-4 px-8 rounded-full text-xs tracking-wider uppercase transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer shadow-[0_4px_14px_rgba(198,40,40,0.25)] hover:shadow-[0_6px_20px_rgba(198,40,40,0.4)] hover:-translate-y-0.5 active:translate-y-0 active:scale-95 group"
              >
                <span>Order Now</span>
                <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform duration-300" />
              </button>
              <button
                onClick={() => {
                  setCurrentView('menu');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="bg-[#FAF8F5] hover:bg-[#C62828]/5 text-[#C62828] border-2 border-[#C62828]/30 hover:border-[#C62828]/60 font-display font-extrabold py-4 px-8 rounded-full text-xs tracking-wider uppercase transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer shadow-sm hover:-translate-y-0.5 active:translate-y-0 active:scale-95"
              >
                <span>Browse Menu</span>
                <ChevronRight size={14} />
              </button>
            </div>

            {/* Geolocation Coverage Check Bar (Unified and beautifully styled) */}
            <div className="p-4 bg-white/50 backdrop-blur-sm border border-slate-200/50 rounded-2xl max-w-xl mb-6">
              <span className="block font-sans text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Check Local Delivery Coverage</span>
              <form onSubmit={handleCoverageCheck} className="flex gap-2">
                <div className="flex-1 flex items-center gap-2.5 bg-white border border-slate-200 rounded-xl px-3 py-2 focus-within:border-[#C62828] transition-all">
                  <MapPin size={14} className="text-[#C62828] shrink-0" />
                  <input
                    type="text"
                    placeholder="Neighborhood (e.g. Lekki Phase 1, Wuse II)..."
                    value={addressInput}
                    onChange={(e) => setAddressInput(e.target.value)}
                    className="w-full bg-transparent text-slate-800 font-sans text-xs focus:outline-none"
                  />
                </div>
                <button
                  type="submit"
                  className="bg-slate-800 hover:bg-slate-900 text-white font-display font-bold py-2 px-4 rounded-xl text-[10px] transition-all cursor-pointer shadow-sm active:scale-95 shrink-0"
                >
                  Verify
                </button>
              </form>

              {/* Feedback states */}
              <AnimatePresence>
                {coverageChecked === 'success' && (
                  <motion.div 
                    initial={{ opacity: 0, y: -5 }} 
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="flex items-center gap-1.5 text-emerald-600 text-[11px] font-sans font-semibold mt-2 px-1"
                  >
                    <CheckCircle2 size={13} className="shrink-0" />
                    <span>We cover your zone! Add meals to checkout instantly.</span>
                  </motion.div>
                )}
                {coverageChecked === 'failed' && (
                  <motion.div 
                    initial={{ opacity: 0, y: -5 }} 
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="flex items-center gap-1.5 text-rose-600 text-[11px] font-sans font-semibold mt-2 px-1"
                  >
                    <AlertCircle size={13} className="shrink-0" />
                    <span>We don't cover this sector yet. Try 'Lekki', 'VI' or 'Wuse II'.</span>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Quick trust metrics */}
            {/* Display premium trust metrics below */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-y-4 gap-x-6 pt-6 mt-3 border-t border-slate-200/60 max-w-xl">
              <div className="flex items-center gap-2">
                <span className="text-base shrink-0">⭐</span>
                <div>
                  <span className="block font-mono text-xs font-black text-brand-charcoal">4.9/5 Rating</span>
                  <span className="block text-[9px] text-slate-400 font-sans tracking-wide uppercase font-bold mt-0.5">Customer Rating</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-base shrink-0">👥</span>
                <div>
                  <span className="block font-mono text-xs font-black text-brand-charcoal">12,000+</span>
                  <span className="block text-[9px] text-slate-400 font-sans tracking-wide uppercase font-bold mt-0.5">Happy Customers</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-base shrink-0">🚚</span>
                <div>
                  <span className="block font-mono text-xs font-black text-brand-charcoal">30–45 Mins</span>
                  <span className="block text-[9px] text-slate-400 font-sans tracking-wide uppercase font-bold mt-0.5">Average Delivery</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-base shrink-0">🍽</span>
                <div>
                  <span className="block font-mono text-xs font-black text-[#C62828]">Freshly Prepared</span>
                  <span className="block text-[9px] text-slate-400 font-sans tracking-wide uppercase font-bold mt-0.5">Prepared Daily</span>
                </div>
              </div>
              <div className="flex items-center gap-2 col-span-2">
                <span className="text-base shrink-0">📍</span>
                <div>
                  <span className="block font-mono text-xs font-black text-brand-charcoal">Multiple States</span>
                  <span className="block text-[9px] text-slate-400 font-sans tracking-wide uppercase font-bold mt-0.5">Delivering Across Nigeria</span>
                </div>
              </div>
            </div>

          </div>

          {/* Right Column: Beautiful Layered Food Composition */}
          <div className="lg:col-span-6 relative flex justify-center items-center mt-12 lg:mt-0 min-h-[460px] lg:min-h-[500px]">
            {/* Glowing background shapes */}
            <div className="absolute w-80 h-80 rounded-full bg-[#F4B400]/10 -z-10 blur-3xl animate-pulse" />
            <div className="absolute w-60 h-60 rounded-full bg-[#C62828]/5 -z-10 blur-2xl translate-x-12 translate-y-12" />

            {/* Interactive Overlapping Food Cards Composition */}
            <div className="relative w-full max-w-[450px] aspect-square flex items-center justify-center">
              
              {/* Card 1: Main Steaming Jollof Rice */}
              <motion.div 
                initial={{ scale: 0.85, opacity: 0, rotate: -3 }}
                animate={{ scale: 1, opacity: 1, rotate: -2 }}
                transition={{ duration: 0.7 }}
                className="absolute w-[68%] aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl border-4 border-white z-20 group cursor-pointer"
                style={{ top: '15%', left: '10%' }}
                whileHover={{ scale: 1.03, rotate: 0, zIndex: 30 }}
              >
                <img
                  src="https://res.cloudinary.com/dtws4emsj/image/upload/v1783257706/smoked_jollof_xeovyq.webp"
                  alt="Smoked Jollof Rice Platter"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  referrerPolicy="no-referrer"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent opacity-80" />
                <div className="absolute bottom-4 left-4 text-white">
                  <span className="block font-mono text-[8px] font-bold tracking-widest text-[#F4B400] uppercase">Chef Recommended</span>
                  <span className="font-display font-extrabold text-sm sm:text-base leading-tight block">Smoked Jollof Rice</span>
                </div>
              </motion.div>

              {/* Card 2: Sizzling Grilled Suya */}
              <motion.div 
                initial={{ x: 60, opacity: 0, rotate: 6 }}
                animate={{ x: 0, opacity: 1, rotate: 4 }}
                transition={{ duration: 0.7, delay: 0.15 }}
                className="absolute w-[50%] aspect-square rounded-3xl overflow-hidden shadow-xl border-4 border-white z-10 group cursor-pointer"
                style={{ bottom: '15%', right: '5%' }}
                whileHover={{ scale: 1.04, rotate: 0, zIndex: 30 }}
              >
                <img
                  src="https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&q=80&w=600"
                  alt="Sizzling Beef Suya"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  referrerPolicy="no-referrer"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent opacity-80" />
                <div className="absolute bottom-4 left-4 text-white">
                  <span className="block font-mono text-[8px] font-bold tracking-widest text-[#F4B400] uppercase">Best Seller</span>
                  <span className="font-display font-extrabold text-xs sm:text-sm leading-tight block">Sizzling Beef Suya</span>
                </div>
              </motion.div>

              {/* Card 3: Sweet Golden Dodo (Plantains) */}
              <motion.div 
                initial={{ y: -40, opacity: 0, rotate: -8 }}
                animate={{ y: 0, opacity: 1, rotate: -10 }}
                transition={{ duration: 0.7, delay: 0.3 }}
                className="absolute w-[36%] aspect-[3/4] rounded-2xl overflow-hidden shadow-lg border-2 border-white z-10 group cursor-pointer"
                style={{ top: '5%', right: '12%' }}
                whileHover={{ scale: 1.05, rotate: 0, zIndex: 30 }}
              >
                <img
                  src="https://images.unsplash.com/photo-1632778149955-e80f8ceca3e8?auto=format&fit=crop&q=80&w=500"
                  alt="Sweet Golden Dodo"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  referrerPolicy="no-referrer"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-black/10" />
              </motion.div>

              {/* Card 4: Traditional Egusi Soup */}
              <motion.div 
                initial={{ x: -40, opacity: 0, rotate: 12 }}
                animate={{ x: 0, opacity: 1, rotate: 8 }}
                transition={{ duration: 0.7, delay: 0.4 }}
                className="absolute w-[32%] aspect-[3/4] rounded-2xl overflow-hidden shadow-lg border-2 border-white z-10 group cursor-pointer"
                style={{ bottom: '12%', left: '8%' }}
                whileHover={{ scale: 1.05, rotate: 0, zIndex: 30 }}
              >
                <img
                  src="https://images.unsplash.com/photo-1541832676-9b763b0239ab?auto=format&fit=crop&q=80&w=500"
                  alt="Rich Egusi Soup"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  referrerPolicy="no-referrer"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-black/10" />
              </motion.div>

              {/* FLOATING CARD 1: Star Rating */}
              <motion.div 
                animate={{ y: [0, -6, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                className="absolute top-[8%] left-[2%] bg-white/95 backdrop-blur-md p-2.5 rounded-2xl border border-slate-100 shadow-xl flex items-center gap-2 z-30 select-none pointer-events-none"
              >
                <div className="w-6 h-6 rounded-lg bg-[#F4B400] flex items-center justify-center text-white shrink-0">
                  <Star size={12} className="fill-white" />
                </div>
                <div>
                  <span className="block font-mono text-[9px] font-black text-brand-charcoal leading-none">4.9 ★ Rating</span>
                  <span className="block font-sans text-[7px] text-slate-400 uppercase tracking-widest mt-0.5 font-bold">12k+ clients</span>
                </div>
              </motion.div>

              {/* FLOATING CARD 2: Best Seller */}
              <motion.div 
                animate={{ y: [0, 6, 0] }}
                transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
                className="absolute bottom-[8%] right-[10%] bg-brand-charcoal text-white p-2.5 rounded-2xl border border-white/5 shadow-2xl flex items-center gap-2.5 z-30 select-none pointer-events-none"
              >
                <div className="w-6 h-6 rounded-lg bg-[#C62828] flex items-center justify-center text-white shrink-0">
                  <FlameKindling size={11} className="fill-white" />
                </div>
                <div className="pr-1">
                  <span className="block font-mono text-[9px] font-black text-[#F4B400] leading-none">Best Seller</span>
                  <span className="block font-sans text-[7px] text-slate-300 uppercase tracking-widest mt-0.5 font-bold">Gourmet Suya</span>
                </div>
              </motion.div>

              {/* FLOATING CARD 3: Fast Delivery */}
              <motion.div 
                animate={{ y: [-3, 3, -3] }}
                transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut" }}
                className="absolute top-[48%] right-[-4%] bg-white/90 backdrop-blur-sm px-3 py-2 rounded-full border border-slate-100 shadow-lg flex items-center gap-2 z-30 select-none pointer-events-none"
              >
                <span className="w-2 h-2 bg-emerald-500 rounded-full animate-ping shrink-0" />
                <span className="font-mono text-[8px] font-extrabold text-[#C62828] uppercase tracking-wider whitespace-nowrap">
                  🚀 30 Mins Fast Delivery
                </span>
              </motion.div>

              {/* FLOATING CARD 4: Premium price tag */}
              <motion.div 
                animate={{ scale: [1, 1.02, 1] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="absolute top-[40%] left-[-4%] bg-[#FAF8F5]/95 p-2 rounded-2xl border border-slate-200 shadow-md z-30 select-none pointer-events-none text-left"
              >
                <span className="block font-sans text-[7px] text-slate-400 font-bold uppercase tracking-wider leading-none">Starting At</span>
                <span className="block font-mono text-xs font-black text-brand-charcoal mt-0.5">₦4,500</span>
              </motion.div>

            </div>
          </div>

        </div>

        {/* Bouncing Scroll Indicator */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 cursor-pointer pointer-events-none opacity-60">
          <span className="font-mono text-[8px] uppercase tracking-widest text-slate-400">Scroll to explore</span>
          <motion.div 
            animate={{ y: [0, 6, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            className="w-5 h-8 rounded-full border-2 border-slate-300 flex justify-center p-1"
          >
            <div className="w-1 h-2 bg-brand-charcoal rounded-full" />
          </motion.div>
        </div>
      </section>

      {/* TRUST BAR SECTION */}
      <section className="py-8 bg-white border-y border-brand-olive/[0.06] relative overflow-hidden">
        <div className="w-full max-w-7xl mx-auto px-4 md:px-8">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-6 md:gap-4 items-center justify-items-center">
            
            {/* Badge 1 */}
            <div className="flex items-center gap-2.5 group hover:scale-105 transition-transform">
              <div className="w-10 h-10 rounded-xl bg-brand-basil/10 flex items-center justify-center text-brand-basil shrink-0">
                <ShieldCheck size={18} />
              </div>
              <div>
                <h4 className="font-display font-semibold text-xs text-brand-olive">Freshly Prepared</h4>
                <p className="font-sans text-[10px] text-slate-400">cooked same-day only</p>
              </div>
            </div>

            {/* Badge 2 */}
            <div className="flex items-center gap-2.5 group hover:scale-105 transition-transform">
              <div className="w-10 h-10 rounded-xl bg-brand-saffron/10 flex items-center justify-center text-brand-saffron shrink-0">
                <Truck size={18} />
              </div>
              <div>
                <h4 className="font-display font-semibold text-xs text-brand-olive">Fast Delivery</h4>
                <p className="font-sans text-[10px] text-slate-400">thermal locked</p>
              </div>
            </div>

            {/* Badge 3 */}
            <div className="flex items-center gap-2.5 group hover:scale-105 transition-transform">
              <div className="w-10 h-10 rounded-xl bg-brand-olive/10 flex items-center justify-center text-brand-olive shrink-0">
                <Shield size={18} />
              </div>
              <div>
                <h4 className="font-display font-semibold text-xs text-brand-olive">Secure Ordering</h4>
                <p className="font-sans text-[10px] text-slate-400">instant transfers</p>
              </div>
            </div>

            {/* Badge 4 */}
            <div className="flex items-center gap-2.5 group hover:scale-105 transition-transform">
              <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-600 shrink-0">
                <MapPin size={18} />
              </div>
              <div>
                <h4 className="font-display font-semibold text-xs text-brand-olive">Multiple Hubs</h4>
                <p className="font-sans text-[10px] text-slate-400">Lagos, Abuja, PH</p>
              </div>
            </div>

            {/* Badge 5 */}
            <div className="flex items-center gap-2.5 col-span-2 md:col-span-1 group hover:scale-105 transition-transform">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-600 shrink-0">
                <ChefHat size={18} />
              </div>
              <div>
                <h4 className="font-display font-semibold text-xs text-brand-olive">Pickup Available</h4>
                <p className="font-sans text-[10px] text-slate-400">quick central collect</p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* POPULAR CATEGORIES */}
      <section id="categories-section" className="py-16 md:py-24 bg-[#FCFAF7]">
        <div className="w-full max-w-7xl mx-auto px-4 md:px-8">
          
          {/* Category Header */}
          <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-4 mb-12">
            <div>
              <span className="font-mono text-[9px] font-bold text-slate-400 uppercase tracking-widest block mb-1">
                Culinary Varieties
              </span>
              <h2 className="font-display font-bold text-3xl text-brand-olive">
                Explore Our Rich Categories
              </h2>
              <p className="font-sans text-xs text-slate-500 mt-1">
                Select from 15 premium menus prepared daily under absolute executive cloud standards.
              </p>
            </div>
            <button
              onClick={() => {
                setActiveCategory('all');
                setCurrentView('menu');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="inline-flex items-center gap-1.5 font-sans text-xs font-semibold text-brand-olive hover:text-brand-saffron transition-colors cursor-pointer group"
            >
              <span>View Full Menu</span>
              <ChevronRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>

          {/* Category Grid - 15 Items */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {CATEGORIES.map((category) => (
              <button
                key={category.id}
                id={`category-card-${category.slug}`}
                onClick={() => {
                  setActiveCategory(category.slug);
                  setCurrentView('menu');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="group relative h-48 rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 text-left border border-brand-olive/5 flex flex-col justify-end cursor-pointer w-full"
              >
                {/* Background Image with Zoom */}
                <img 
                  src={category.image} 
                  alt={category.name}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  referrerPolicy="no-referrer"
                  loading="lazy"
                />
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-brand-olive/95 via-brand-olive/45 to-transparent transition-opacity group-hover:opacity-90 duration-300" />
                
                {/* Floating Icon Chip */}
                <div className="absolute top-4 right-4 w-9 h-9 rounded-xl bg-[#FAF8F5]/90 backdrop-blur-md text-brand-olive flex items-center justify-center shadow-md group-hover:bg-brand-saffron group-hover:text-brand-olive transition-colors duration-300">
                  {renderCategoryIcon(category.icon)}
                </div>

                {/* Text and Count */}
                <div className="p-5 relative z-10">
                  <span className="inline-block bg-brand-saffron/90 text-brand-olive font-mono text-[8px] font-bold px-2 py-0.5 rounded-md tracking-wider uppercase mb-1.5">
                    {category.count || "10+ Options"}
                  </span>
                  <h4 className="font-display font-bold text-sm text-[#FAF8F5] leading-tight tracking-tight group-hover:text-brand-saffron transition-colors">
                    {category.name}
                  </h4>
                </div>
              </button>
            ))}
          </div>

        </div>
      </section>

      {/* FEATURED MEALS (BEST SELLERS) */}
      <section id="best-sellers-section" className="py-16 md:py-24 bg-white border-y border-brand-olive/[0.06]">
        <div className="w-full max-w-7xl mx-auto px-4 md:px-8">
          
          {/* Featured Header */}
          <div className="text-center max-w-md mx-auto mb-16">
            <span className="font-mono text-[9px] font-bold text-slate-400 uppercase tracking-widest block mb-1">
              Highly Ordered Favorites
            </span>
            <h2 className="font-display font-bold text-3xl text-brand-olive">
              Bibi's Best Sellers
            </h2>
            <p className="font-sans text-xs text-slate-500 mt-2 leading-relaxed">
              Our most sought-after chef-crafted culinary masterpieces, prepared same-day using premium local organic ingredients.
            </p>
          </div>

          {/* Responsive Grid rendering at least 8 featured meals */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {MEALS.map((meal) => (
              <MealCard
                key={meal.id}
                meal={meal}
                onAddToCart={handleAddToCart}
                onQuickView={handleQuickView}
              />
            ))}
          </div>

          {/* See more CTA */}
          <div className="text-center mt-12">
            <button
              onClick={() => {
                setActiveCategory('all');
                setCurrentView('menu');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="inline-flex items-center gap-2 bg-brand-olive text-brand-saffron hover:bg-brand-olive/95 font-display font-bold py-4 px-8 rounded-2xl text-xs transition-all cursor-pointer shadow-md shadow-brand-olive/10"
            >
              <span>Explore Our Complete Culinary Library</span>
              <ArrowRight size={14} />
            </button>
          </div>

        </div>
      </section>

      {/* WHY CHOOSE BIBI FOOD */}
      <section className="py-16 md:py-24 bg-[#FCFAF7]">
        <div className="w-full max-w-7xl mx-auto px-4 md:px-8">
          
          {/* Why Choose Us Header */}
          <div className="text-center max-w-md mx-auto mb-16">
            <span className="font-mono text-[9px] font-bold text-slate-400 uppercase tracking-widest block mb-1">
              Our Pillars
            </span>
            <h2 className="font-display font-bold text-3xl text-brand-olive">
              Why Choose Bibi Food?
            </h2>
            <p className="font-sans text-xs text-slate-500 mt-2 leading-relaxed">
              We set out to eradicate the inconsistencies of aggregate food marketplaces through full vertical-chain integration.
            </p>
          </div>

          {/* why choose cards grid - 8 Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            
            {/* Card 1 */}
            <div className="bg-white p-6 rounded-3xl border border-brand-olive/5 shadow-sm hover:shadow-md hover:border-brand-saffron/40 transition-all duration-300 flex flex-col gap-4">
              <div className="w-12 h-12 rounded-2xl bg-brand-basil/10 flex items-center justify-center text-brand-basil shrink-0">
                <Truck size={22} />
              </div>
              <div>
                <h4 className="font-display font-semibold text-sm text-brand-olive">Fast Delivery</h4>
                <p className="font-sans text-xs text-slate-400 mt-1.5 leading-relaxed">
                  Our active thermal-insulated fleets guarantee meals arrive piping hot, exactly as the chef intended.
                </p>
              </div>
            </div>

            {/* Card 2 */}
            <div className="bg-white p-6 rounded-3xl border border-brand-olive/5 shadow-sm hover:shadow-md hover:border-brand-saffron/40 transition-all duration-300 flex flex-col gap-4">
              <div className="w-12 h-12 rounded-2xl bg-orange-500/10 flex items-center justify-center text-orange-600 shrink-0">
                <Sparkles size={22} />
              </div>
              <div>
                <h4 className="font-display font-semibold text-sm text-brand-olive">Fresh Ingredients</h4>
                <p className="font-sans text-xs text-slate-400 mt-1.5 leading-relaxed">
                  Sourced same-day from handpicked certified organic family farming cooperatives.
                </p>
              </div>
            </div>

            {/* Card 3 */}
            <div className="bg-white p-6 rounded-3xl border border-brand-olive/5 shadow-sm hover:shadow-md hover:border-brand-saffron/40 transition-all duration-300 flex flex-col gap-4">
              <div className="w-12 h-12 rounded-2xl bg-brand-saffron/20 flex items-center justify-center text-brand-olive shrink-0">
                <ChefHat size={22} />
              </div>
              <div>
                <h4 className="font-display font-semibold text-sm text-brand-olive">Professional Chefs</h4>
                <p className="font-sans text-xs text-slate-400 mt-1.5 leading-relaxed">
                  Every recipe is formulated and prepared by premium executive culinary masters.
                </p>
              </div>
            </div>

            {/* Card 4 */}
            <div className="bg-white p-6 rounded-3xl border border-brand-olive/5 shadow-sm hover:shadow-md hover:border-brand-saffron/40 transition-all duration-300 flex flex-col gap-4">
              <div className="w-12 h-12 rounded-2xl bg-brand-olive/10 flex items-center justify-center text-brand-olive shrink-0">
                <Award size={22} />
              </div>
              <div>
                <h4 className="font-display font-semibold text-sm text-brand-olive">Affordable Prices</h4>
                <p className="font-sans text-xs text-slate-400 mt-1.5 leading-relaxed">
                  By avoiding external app markups, we deliver top-tier luxury gastronomy at honest rates.
                </p>
              </div>
            </div>

            {/* Card 5 */}
            <div className="bg-white p-6 rounded-3xl border border-brand-olive/5 shadow-sm hover:shadow-md hover:border-brand-saffron/40 transition-all duration-300 flex flex-col gap-4">
              <div className="w-12 h-12 rounded-2xl bg-purple-500/10 flex items-center justify-center text-purple-600 shrink-0">
                <MapPin size={22} />
              </div>
              <div>
                <h4 className="font-display font-semibold text-sm text-brand-olive">Live Order Tracking</h4>
                <p className="font-sans text-xs text-slate-400 mt-1.5 leading-relaxed">
                  Watch the dispatch courier routing paths down to your gate with real-time GPS updates.
                </p>
              </div>
            </div>

            {/* Card 6 */}
            <div className="bg-white p-6 rounded-3xl border border-brand-olive/5 shadow-sm hover:shadow-md hover:border-brand-saffron/40 transition-all duration-300 flex flex-col gap-4">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/10 flex items-center justify-center text-amber-600 shrink-0">
                <Utensils size={22} />
              </div>
              <div>
                <h4 className="font-display font-semibold text-sm text-brand-olive">Pickup Option</h4>
                <p className="font-sans text-xs text-slate-400 mt-1.5 leading-relaxed">
                  Schedule and collect from any central Bibi Food kitchen hub with zero wait time.
                </p>
              </div>
            </div>

            {/* Card 7 */}
            <div className="bg-white p-6 rounded-3xl border border-brand-olive/5 shadow-sm hover:shadow-md hover:border-brand-saffron/40 transition-all duration-300 flex flex-col gap-4">
              <div className="w-12 h-12 rounded-2xl bg-rose-500/10 flex items-center justify-center text-rose-600 shrink-0">
                <ShieldCheck size={22} />
              </div>
              <div>
                <h4 className="font-display font-semibold text-sm text-brand-olive">Quality Assurance</h4>
                <p className="font-sans text-xs text-slate-400 mt-1.5 leading-relaxed">
                  Uncompromising strict health, sanitation, and safety checks on every dispatch box.
                </p>
              </div>
            </div>

            {/* Card 8 */}
            <div className="bg-white p-6 rounded-3xl border border-brand-olive/5 shadow-sm hover:shadow-md hover:border-brand-saffron/40 transition-all duration-300 flex flex-col gap-4">
              <div className="w-12 h-12 rounded-2xl bg-blue-500/10 flex items-center justify-center text-blue-600 shrink-0">
                <ThumbsUp size={22} />
              </div>
              <div>
                <h4 className="font-display font-semibold text-sm text-brand-olive">Exceptional Support</h4>
                <p className="font-sans text-xs text-slate-400 mt-1.5 leading-relaxed">
                  Our active support desk resolves any meal or transfer inquiries in under five minutes.
                </p>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="py-16 md:py-24 bg-white border-y border-brand-olive/[0.06] relative">
        <div className="w-full max-w-7xl mx-auto px-4 md:px-8">
          
          {/* How It Works Header */}
          <div className="text-center max-w-md mx-auto mb-20">
            <span className="font-mono text-[9px] font-bold text-slate-400 uppercase tracking-widest block mb-1">
              Seamless Journey
            </span>
            <h2 className="font-display font-bold text-3xl text-brand-olive">
              How Bibi Food Works
            </h2>
            <p className="font-sans text-xs text-slate-500 mt-2 leading-relaxed">
              Four simple steps between your culinary desires and a freshly prepared masterpiece at your doorstep.
            </p>
          </div>

          {/* Steps container */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 relative z-10">
            
            {/* Connecting line on desktop */}
            <div className="hidden md:block absolute top-7 left-[12%] right-[12%] h-[2px] bg-dashed border-t border-dashed border-slate-200 -z-10" />

            {/* Step 1 */}
            <div className="flex flex-col items-center text-center gap-4 group">
              <div className="w-14 h-14 rounded-2xl bg-brand-olive text-brand-saffron font-mono font-bold text-lg flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:bg-brand-saffron group-hover:text-brand-olive transition-all duration-300 relative">
                01
                <span className="absolute -bottom-1 -right-1 w-4 h-4 bg-brand-basil rounded-full text-[9px] text-white flex items-center justify-center font-sans font-bold">✓</span>
              </div>
              <div>
                <h4 className="font-display font-bold text-sm text-brand-olive mt-2">Browse Meals</h4>
                <p className="font-sans text-xs text-slate-400 leading-relaxed mt-1.5 max-w-[220px]">
                  Explore our daily menu of macro-balanced, premium African and continental dishes.
                </p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="flex flex-col items-center text-center gap-4 group">
              <div className="w-14 h-14 rounded-2xl bg-brand-olive text-brand-saffron font-mono font-bold text-lg flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:bg-brand-saffron group-hover:text-brand-olive transition-all duration-300 relative">
                02
                <span className="absolute -bottom-1 -right-1 w-4 h-4 bg-brand-basil rounded-full text-[9px] text-white flex items-center justify-center font-sans font-bold">✓</span>
              </div>
              <div>
                <h4 className="font-display font-bold text-sm text-brand-olive mt-2">Place Your Order</h4>
                <p className="font-sans text-xs text-slate-400 leading-relaxed mt-1.5 max-w-[220px]">
                  Reconcile bank transfers securely. Our automated system approves payments instantly.
                </p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="flex flex-col items-center text-center gap-4 group">
              <div className="w-14 h-14 rounded-2xl bg-brand-olive text-brand-saffron font-mono font-bold text-lg flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:bg-brand-saffron group-hover:text-brand-olive transition-all duration-300 relative">
                03
                <span className="absolute -bottom-1 -right-1 w-4 h-4 bg-brand-basil rounded-full text-[9px] text-white flex items-center justify-center font-sans font-bold">✓</span>
              </div>
              <div>
                <h4 className="font-display font-bold text-sm text-brand-olive mt-2">Track Your Delivery</h4>
                <p className="font-sans text-xs text-slate-400 leading-relaxed mt-1.5 max-w-[220px]">
                  Watch our active dispatch map as our thermal-lock courier drives towards your address.
                </p>
              </div>
            </div>

            {/* Step 4 */}
            <div className="flex flex-col items-center text-center gap-4 group">
              <div className="w-14 h-14 rounded-2xl bg-brand-olive text-brand-saffron font-mono font-bold text-lg flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:bg-brand-saffron group-hover:text-brand-olive transition-all duration-300 relative">
                04
                <span className="absolute -bottom-1 -right-1 w-4 h-4 bg-brand-basil rounded-full text-[9px] text-white flex items-center justify-center font-sans font-bold">✓</span>
              </div>
              <div>
                <h4 className="font-display font-bold text-sm text-brand-olive mt-2">Enjoy Your Food</h4>
                <p className="font-sans text-xs text-slate-400 leading-relaxed mt-1.5 max-w-[220px]">
                  Provide your secure delivery verification pin, unpack a piping hot meal, and enjoy!
                </p>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* CUSTOMER TESTIMONIALS (CAROUSEL & SCORECARD) */}
      <section className="py-16 md:py-24 bg-[#122018] text-[#FAF8F5] relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-brand-saffron/5 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-96 h-96 rounded-full bg-brand-basil/5 blur-3xl pointer-events-none" />

        <div className="w-full max-w-7xl mx-auto px-4 md:px-8 relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Testimonial Scorecard */}
          <div className="lg:col-span-4 flex flex-col gap-6">
            <div>
              <span className="font-mono text-[9px] font-bold text-brand-saffron uppercase tracking-widest block mb-1">
                Client Testimonials
              </span>
              <h2 className="font-display font-bold text-3xl text-white">
                Trusted by Thousands of Eaters
              </h2>
            </div>

            <div className="bg-white/5 border border-white/10 p-6 rounded-3xl flex flex-col gap-4">
              <div className="flex items-baseline gap-2">
                <span className="font-mono text-4xl font-bold text-brand-saffron">4.9</span>
                <span className="text-slate-400 font-sans text-sm">out of 5.0 stars</span>
              </div>
              
              <div className="flex items-center gap-1 text-brand-saffron">
                {[1,2,3,4,5].map((s) => (
                  <Star key={s} size={16} className="fill-brand-saffron" />
                ))}
              </div>

              <p className="font-sans text-xs text-slate-300 leading-relaxed">
                Based on over <span className="font-semibold text-white">12,450 verified order ratings</span> across Lagos, Abuja, and Port Harcourt.
              </p>

              {/* Stacked avatars of happy customers */}
              <div className="flex items-center gap-2 mt-2">
                <div className="flex -space-x-2">
                  <img className="w-8 h-8 rounded-full border-2 border-brand-olive object-cover" src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=100" alt="Sarah" referrerPolicy="no-referrer" />
                  <img className="w-8 h-8 rounded-full border-2 border-brand-olive object-cover" src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=100" alt="Tobi" referrerPolicy="no-referrer" />
                  <img className="w-8 h-8 rounded-full border-2 border-brand-olive object-cover" src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=100" alt="Nkem" referrerPolicy="no-referrer" />
                </div>
                <span className="font-sans text-[11px] text-slate-400 font-medium">Join 25k+ happy diners</span>
              </div>
            </div>
          </div>

          {/* Right Column: Interactive Testimonial Carousel */}
          <div className="lg:col-span-8">
            <div className="relative">
              
              {/* Active Testimonial Card */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTestimonialIdx}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className="bg-white/5 border border-white/10 p-8 rounded-3xl md:p-10 flex flex-col gap-6"
                >
                  <div className="flex items-center gap-1.5 text-brand-saffron">
                    {[1,2,3,4,5].map((s) => (
                      <Star key={s} size={14} className="fill-brand-saffron" />
                    ))}
                  </div>

                  <blockquote className="font-sans text-sm md:text-base leading-relaxed text-slate-200">
                    "{REVIEWS[activeTestimonialIdx]?.comment || "Bibi Food delivers outstanding consistency every single time. Smoked Jollof is an absolute masterpiece."}"
                  </blockquote>

                  <div className="flex items-center justify-between gap-4 pt-6 border-t border-white/10">
                    <div className="flex items-center gap-3">
                      <img 
                        src={REVIEWS[activeTestimonialIdx]?.userAvatar || "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=100"} 
                        alt={REVIEWS[activeTestimonialIdx]?.userName}
                        className="w-12 h-12 rounded-full object-cover border border-white/10"
                        referrerPolicy="no-referrer"
                      />
                      <div>
                        <span className="block font-display font-semibold text-sm text-white">{REVIEWS[activeTestimonialIdx]?.userName}</span>
                        <span className="block font-sans text-[10px] text-slate-400">{activeTestimonialIdx === 0 ? "Lekki Phase 1, Lagos" : activeTestimonialIdx === 1 ? "Wuse II, Abuja" : "Victoria Island, Lagos"}</span>
                      </div>
                    </div>

                    {/* Tag showing the meal they loved */}
                    <div className="hidden sm:block bg-brand-saffron/10 border border-brand-saffron/20 py-1.5 px-3 rounded-full text-brand-saffron font-mono text-[9px] font-bold uppercase tracking-wider">
                      Loved: {REVIEWS[activeTestimonialIdx]?.mealName || "Jollof Rice"}
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>

              {/* Manual Carousel Controls */}
              <div className="flex items-center justify-end gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => setActiveTestimonialIdx((prev) => (prev - 1 + REVIEWS.length) % REVIEWS.length)}
                  className="w-10 h-10 rounded-full bg-white/5 hover:bg-brand-saffron hover:text-brand-olive border border-white/10 transition-colors flex items-center justify-center cursor-pointer text-white active:scale-95"
                  title="Previous review"
                >
                  <ChevronRight size={16} className="rotate-180" />
                </button>
                <span className="font-mono text-xs text-slate-400">
                  {activeTestimonialIdx + 1} / {REVIEWS.length}
                </span>
                <button
                  type="button"
                  onClick={() => setActiveTestimonialIdx((prev) => (prev + 1) % REVIEWS.length)}
                  className="w-10 h-10 rounded-full bg-white/5 hover:bg-brand-saffron hover:text-brand-olive border border-white/10 transition-colors flex items-center justify-center cursor-pointer text-white active:scale-95"
                  title="Next review"
                >
                  <ChevronRight size={16} />
                </button>
              </div>

            </div>
          </div>

        </div>
      </section>

      {/* APP DOWNLOAD SECTION WITH LIVE SIMULATOR */}
      <section className="py-16 md:py-24 bg-[#FAF8F5]">
        <div className="w-full max-w-7xl mx-auto px-4 md:px-8 bg-brand-olive rounded-[40px] p-8 md:p-16 overflow-hidden relative text-[#FAF8F5] grid grid-cols-1 lg:grid-cols-12 gap-12 items-center shadow-xl border border-white/5">
          
          {/* Decorative background vectors */}
          <div className="absolute w-[500px] h-[500px] rounded-full bg-brand-saffron/5 -top-40 -right-40 blur-3xl pointer-events-none" />
          <div className="absolute w-72 h-72 rounded-full bg-brand-basil/10 -bottom-20 -left-20 blur-2xl pointer-events-none" />

          {/* Left Column: App Copy */}
          <div className="flex flex-col gap-6 lg:col-span-6">
            <div className="inline-flex items-center gap-1.5 bg-white/10 py-1 px-3.5 rounded-full border border-white/10 w-fit">
              <Smartphone size={13} className="text-brand-saffron animate-pulse" />
              <span className="font-mono text-[9px] font-bold tracking-wider uppercase">Bibi Mobile Engine</span>
            </div>

            <h2 className="font-display font-bold text-3xl md:text-4xl text-white tracking-tight leading-tight">
              Gourmet Delivery at Your Fingertips
            </h2>

            <p className="font-sans text-xs md:text-sm text-slate-300 leading-relaxed max-w-lg">
              Configure automated lunch cycles, pin precise map coordinates for corporate deliveries, and receive live temperature alerts. The upcoming Bibi App brings executive gastronomy logistics directly onto your home screen.
            </p>

            {/* Features highlights */}
            <div className="flex flex-col gap-3 font-sans text-xs text-slate-300 mt-2">
              <div className="flex items-center gap-2">
                <CheckCircle2 size={14} className="text-brand-saffron" />
                <span>Real-time heat retention monitoring of your delivery box</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 size={14} className="text-brand-saffron" />
                <span>Interactive dispatch path maps & push progress notifications</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 size={14} className="text-brand-saffron" />
                <span>One-click bank transfer reconcile verification</span>
              </div>
            </div>

            {/* Download Buttons and QR Code */}
            <div className="flex flex-wrap items-center gap-6 mt-4">
              <div className="flex flex-col sm:flex-row gap-3">
                <button type="button" onClick={() => { setCurrentView('app-download'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="bg-white hover:bg-[#FCFAF7] text-brand-olive font-display font-bold py-3.5 px-6 rounded-2xl text-xs flex items-center gap-2 transition-all cursor-pointer shadow-sm active:scale-95 shrink-0">
                  <Smartphone size={15} />
                  <span>Apple iOS App Store</span>
                </button>
                <button type="button" onClick={() => { setCurrentView('app-download'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="bg-[#122018] hover:bg-black text-brand-saffron border border-brand-saffron/30 font-display font-bold py-3.5 px-6 rounded-2xl text-xs flex items-center gap-2 transition-all cursor-pointer shadow-sm active:scale-95 shrink-0">
                  <Smartphone size={15} />
                  <span>Google Play Android</span>
                </button>
              </div>

              {/* QR Code Placeholder */}
              <div className="flex items-center gap-2.5 bg-white/5 border border-white/10 p-2.5 rounded-2xl shrink-0">
                <div className="w-12 h-12 bg-white rounded-lg p-1 flex flex-col justify-between items-center shadow-inner">
                  <div className="w-full flex justify-between gap-0.5">
                    <span className="w-3.5 h-3.5 border-2 border-brand-olive block shrink-0" />
                    <span className="w-3.5 h-3.5 border-2 border-brand-olive block shrink-0" />
                  </div>
                  <div className="w-full flex justify-between gap-0.5 mt-0.5">
                    <span className="w-3.5 h-3.5 border-2 border-brand-olive block shrink-0" />
                    <span className="w-3.5 h-1.5 bg-brand-olive block shrink-0 mt-2" />
                  </div>
                </div>
                <div>
                  <span className="block font-mono text-[9px] font-bold text-white uppercase tracking-wider">Scan to Beta</span>
                  <span className="block font-sans text-[8px] text-slate-400">Join iOS/Android Beta</span>
                </div>
              </div>
            </div>

          </div>

          {/* Right Column: Phone Mockup Live Simulator */}
          <div className="lg:col-span-6 flex justify-center relative">
            <div className="w-64 aspect-[9/18] bg-[#0E1511] rounded-[40px] p-2.5 shadow-2xl border-4 border-slate-700/60 relative overflow-hidden flex flex-col justify-between">
              
              {/* Speaker and Camera notch */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-28 h-5 bg-black rounded-b-2xl z-40 flex items-center justify-center">
                <span className="w-8 h-1 bg-slate-800 rounded-full block mb-1" />
                <span className="w-1.5 h-1.5 bg-slate-900 rounded-full block mb-1 ml-2" />
              </div>

              {/* Inner screen content */}
              <div className="bg-[#FAF8F5] rounded-[30px] w-full h-full flex flex-col justify-between overflow-hidden relative pt-6 text-slate-800 font-sans">
                
                {/* Status bar */}
                <div className="px-4 py-1.5 flex justify-between items-center bg-white border-b border-slate-100">
                  <span className="font-mono text-[9px] font-bold text-brand-olive">10:45 AM</span>
                  <div className="flex items-center gap-1">
                    <span className="w-2.5 h-2.5 bg-brand-basil rounded-full block animate-pulse" />
                    <span className="font-mono text-[8px] text-slate-500">GPS Live</span>
                  </div>
                </div>

                {/* Interactive route tracking map visual simulator */}
                <div className="flex-1 bg-slate-100 relative p-2 overflow-hidden flex flex-col justify-between">
                  
                  {/* Simulated Street Grid Line SVG */}
                  <div className="absolute inset-0 pointer-events-none opacity-30">
                    <div className="w-full h-full" style={{ backgroundImage: 'radial-gradient(#122018 1px, transparent 1px)', backgroundSize: '16px 16px' }} />
                    <div className="absolute top-1/2 left-0 w-full h-0.5 bg-brand-olive/10" />
                    <div className="absolute left-1/3 top-0 w-0.5 h-full bg-brand-olive/10" />
                    <div className="absolute left-2/3 top-0 w-0.5 h-full bg-brand-olive/10" />
                  </div>

                  {/* Pulsing delivery route map pins */}
                  <div className="absolute top-1/4 left-1/3">
                    <div className="relative">
                      <div className="w-3.5 h-3.5 bg-brand-olive rounded-full flex items-center justify-center border-2 border-white shadow-md">
                        <span className="w-1.5 h-1.5 bg-brand-saffron rounded-full" />
                      </div>
                      <span className="absolute -bottom-4 -left-6 bg-brand-olive text-[#FAF8F5] text-[7px] font-mono font-bold px-1 rounded-md tracking-widest whitespace-nowrap">KITCHEN CENTRAL</span>
                    </div>
                  </div>

                  {/* Pulsing Destination Pin */}
                  <div className="absolute bottom-1/4 right-1/4">
                    <div className="relative">
                      <MapPin size={16} className="text-brand-saffron fill-brand-saffron animate-bounce" />
                      <span className="absolute -bottom-4 -left-2 bg-brand-saffron text-brand-olive text-[7px] font-mono font-bold px-1 rounded-md tracking-widest whitespace-nowrap">YOU</span>
                    </div>
                  </div>

                  {/* Animated route courier dot */}
                  <motion.div 
                    animate={{ 
                      x: [24, 75, 120, 150, 150], 
                      y: [30, 42, 85, 120, 140] 
                    }}
                    transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute top-4 left-6"
                  >
                    <div className="relative flex items-center justify-center">
                      <span className="absolute w-6 h-6 bg-brand-basil/20 rounded-full animate-ping" />
                      <div className="w-4 h-4 bg-brand-basil text-white rounded-full border border-white flex items-center justify-center shadow-md">
                        <Truck size={8} />
                      </div>
                    </div>
                  </motion.div>

                  {/* Simulated mini HUD details */}
                  <div className="mt-auto bg-white/95 backdrop-blur-md p-2 rounded-xl shadow-md border border-brand-olive/5 relative z-10">
                    <div className="flex items-center gap-2">
                      <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=100" alt="Rider Jide" className="w-6 h-6 rounded-full object-cover" />
                      <div className="flex-1">
                        <div className="flex justify-between items-center">
                          <span className="font-display font-bold text-[8px] text-brand-olive">Babajide O. (Rider)</span>
                          <span className="font-mono text-[7px] text-brand-basil font-semibold">Active Transit</span>
                        </div>
                        <span className="block font-sans text-[7px] text-slate-400">Insulated Box Temp: 74°C</span>
                      </div>
                    </div>
                  </div>

                </div>

                {/* Order status card overlay */}
                <div className="p-3 bg-white border-t border-slate-100 flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <span className="font-display font-bold text-[10px] text-brand-olive">Smoked Jollof Platter</span>
                    <span className="font-mono text-[9px] text-brand-saffron font-bold">₦4,500</span>
                  </div>
                  
                  {/* Steps progress indicator */}
                  <div className="flex items-center justify-between gap-1 text-[7px] font-sans text-slate-400 font-medium">
                    <span className="text-brand-basil font-bold">✓ Approved</span>
                    <span className="text-brand-basil font-bold">✓ Cooked</span>
                    <span className="text-brand-basil font-bold animate-pulse">🚚 In Transit</span>
                    <span>🍽️ Feast</span>
                  </div>
                  
                  {/* Bar indicator */}
                  <div className="w-full h-1 bg-slate-100 rounded-full overflow-hidden">
                    <div className="w-3/4 h-full bg-brand-basil rounded-full" />
                  </div>
                </div>

              </div>

            </div>
          </div>

        </div>
      </section>

      {/* NEWSLETTER SUBSCRIPTION (REFINED) */}
      <section className="py-16 md:py-24 bg-white relative overflow-hidden">
        <div className="w-full max-w-7xl mx-auto px-4 md:px-8 text-center max-w-2xl flex flex-col gap-6 relative z-10 mx-auto">
          
          <div className="flex justify-center">
            <div className="w-12 h-12 bg-brand-olive text-brand-saffron rounded-full flex items-center justify-center shadow-md">
              <Send size={20} className="translate-x-0.5 -translate-y-0.5" />
            </div>
          </div>

          <div>
            <span className="font-mono text-[9px] font-bold text-slate-400 uppercase tracking-widest block mb-1">
              Bibi Culinary Club
            </span>
            <h2 className="font-display font-bold text-3xl text-brand-olive">
              Subscribe to VIP Secret Menus
            </h2>
            <p className="font-sans text-xs text-slate-500 mt-2 leading-relaxed max-w-lg mx-auto">
              Join 15,000+ Nigerian food lovers. Receive secret weekend coupon discount matrices, central kitchen announcements, and priority notifications of gourmet chef seasonal masterworks.
            </p>
          </div>

          {newsletterSubscribed ? (
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="p-5 bg-brand-basil/10 border border-brand-basil/20 rounded-2xl text-brand-olive font-sans text-sm font-semibold flex items-center justify-center gap-2 max-w-md mx-auto w-full shadow-inner"
            >
              <CheckCircle2 className="text-brand-basil shrink-0" size={18} />
              <span>Welcome! Verification coupon code sent to email inbox.</span>
            </motion.div>
          ) : (
            <form onSubmit={handleNewsletterSubmit} className="flex flex-col sm:flex-row gap-3 bg-white p-2.5 rounded-2xl border border-brand-olive/10 shadow-lg max-w-lg mx-auto w-full hover:border-brand-saffron transition-all">
              <input
                type="email"
                required
                placeholder="Enter your email (e.g. tunde@gmail.com)..."
                value={newsletterEmail}
                onChange={(e) => setNewsletterEmail(e.target.value)}
                className="w-full bg-transparent text-slate-800 font-sans text-xs md:text-sm px-4 focus:outline-none"
              />
              <button
                type="submit"
                className="bg-brand-olive text-brand-saffron hover:bg-[#131E18] font-display font-semibold py-3.5 px-6 rounded-xl text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-sm shrink-0 active:scale-95"
              >
                <Send size={12} />
                <span>Join Bibi Club</span>
              </button>
            </form>
          )}

          <span className="block font-sans text-[10px] text-slate-400">
            We secure and respect your email privacy. Unsubscribe completely in one click anytime.
          </span>

        </div>
      </section>

      {/* INTERACTIVE FAQ ACCORDION */}
      <section className="py-16 md:py-24 bg-[#FCFAF7] border-t border-brand-olive/[0.06]">
        <div className="w-full max-w-3xl mx-auto px-4">
          
          {/* FAQ Header */}
          <div className="text-center max-w-md mx-auto mb-16">
            <span className="font-mono text-[9px] font-bold text-slate-400 uppercase tracking-widest block mb-1">
              Got Questions?
            </span>
            <h2 className="font-display font-bold text-3xl text-brand-olive">
              Frequently Asked Questions
            </h2>
            <p className="font-sans text-xs text-slate-500 mt-2 leading-relaxed">
              Everything you need to know about our executive cloud kitchen operation and delivery ecosystem.
            </p>
          </div>

          {/* Stateful FAQ Accordion Items */}
          <div className="flex flex-col gap-4">
            {[
              {
                q: "How long does delivery take?",
                a: "Our average delivery time is 25 minutes. Since we cook everything in our central cloud kitchens and utilize custom direct-path dispatch routers, your order never waits for third-party marketplace driver allocation."
              },
              {
                q: "Can I schedule an order?",
                a: "Absolutely. You can schedule breakfast, lunch, or family dinner platters up to 7 days in advance. Simply select your desired date and time slot inside our scheduled delivery checkout selector."
              },
              {
                q: "Can I pick up my order?",
                a: "Yes. You can bypass delivery fees by selecting central kitchen pickup during checkout. Your meals will be prepared and packed hot in our dedicated lockers ready for your precise collection slot."
              },
              {
                q: "Which payment methods are accepted?",
                a: "We support secure automated bank transfers. Upon selecting checkout, you are supplied our secure centralized bank account. Simply make the transfer and upload a quick payment screenshot. Reconciles instantly!"
              },
              {
                q: "Where do you deliver?",
                a: "We currently deliver to Lekki Phase 1 & 2, Victoria Island, Ikoyi, Marina/Broad Street in Lagos, and Wuse II, Maitama, Gwarinpa, and Asokoro in Abuja. We are expanding rapidly to more sectors shortly!"
              }
            ].map((item, idx) => {
              const isOpen = activeFaqIdx === idx;
              return (
                <div 
                  key={idx}
                  className="bg-white border border-brand-olive/5 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-200"
                >
                  <button
                    type="button"
                    onClick={() => setActiveFaqIdx(isOpen ? null : idx)}
                    className="w-full py-5 px-6 flex items-center justify-between text-left cursor-pointer text-brand-olive font-display font-bold text-sm md:text-base select-none group"
                  >
                    <span>{item.q}</span>
                    <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center shrink-0 text-brand-olive group-hover:bg-brand-saffron transition-colors">
                      {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                    </div>
                  </button>

                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25 }}
                        className="overflow-hidden border-t border-slate-50"
                      >
                        <p className="p-6 font-sans text-xs md:text-sm text-slate-500 leading-relaxed bg-[#FCFAF7]/40">
                          {item.a}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* CONTACT STRIP */}
      <section className="py-12 bg-white border-y border-brand-olive/[0.06]">
        <div className="w-full max-w-7xl mx-auto px-4 md:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            
            {/* Hotline */}
            <div className="flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-brand-olive text-brand-saffron flex items-center justify-center shrink-0">
                <Phone size={18} />
              </div>
              <div>
                <span className="block font-mono text-[9px] font-bold text-slate-400 uppercase tracking-widest">Hotline Support</span>
                <a href="tel:+234800BIBIFOOD" className="font-display font-bold text-sm text-brand-olive hover:text-brand-saffron transition-colors block mt-1">+234 (0) 800-BIBI-FOOD</a>
              </div>
            </div>

            {/* Email */}
            <div className="flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-brand-olive text-brand-saffron flex items-center justify-center shrink-0">
                <Mail size={18} />
              </div>
              <div>
                <span className="block font-mono text-[9px] font-bold text-slate-400 uppercase tracking-widest">Direct Email</span>
                <a href="mailto:concierge@bibifood.com" className="font-display font-bold text-sm text-brand-olive hover:text-brand-saffron transition-colors block mt-1">concierge@bibifood.com</a>
              </div>
            </div>

            {/* Central Address */}
            <div className="flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-brand-olive text-brand-saffron flex items-center justify-center shrink-0">
                <MapPin size={18} />
              </div>
              <div>
                <span className="block font-mono text-[9px] font-bold text-slate-400 uppercase tracking-widest">Central Kitchen</span>
                <span className="font-display font-bold text-sm text-brand-olive block mt-1">14 Broad Street, Marina, Lagos</span>
              </div>
            </div>

            {/* Service hours */}
            <div className="flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-brand-olive text-brand-saffron flex items-center justify-center shrink-0">
                <Clock size={18} />
              </div>
              <div>
                <span className="block font-mono text-[9px] font-bold text-slate-400 uppercase tracking-widest">Active Kitchens</span>
                <span className="font-display font-bold text-sm text-brand-olive block mt-1">Daily 7:00 AM – 10:00 PM</span>
              </div>
            </div>

          </div>
        </div>
      </section>

    </motion.div>
  );
}
