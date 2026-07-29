/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Clock, 
  ArrowRight, 
  Sparkles, 
  AlertCircle, 
  Mail, 
  ArrowLeft, 
  Send, 
  CheckCircle2, 
  Compass, 
  ShieldAlert, 
  Briefcase, 
  Scale, 
  FileText, 
  Smartphone,
  Share2
} from 'lucide-react';

interface PlaceholderViewProps {
  viewId: string;
  onNavigate: (view: string) => void;
}

export default function PlaceholderView({ viewId, onNavigate }: PlaceholderViewProps) {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  // Map view ID to custom headers and metadata for deep polish
  const getMetadata = () => {
    switch (viewId) {
      case 'careers':
        return {
          title: 'Careers Hub',
          icon: <Briefcase size={36} className="text-brand-chili" />,
          subtitle: 'Join the Bibi Food Culinary Tech Revolution',
          description: 'We are building the future of vertical-chain food logtech in Africa. Soon, we will be hiring premier cloud-kitchen executive chefs, meticulous dispatch riders, and hardware-software systems engineers for our expanding central hubs.',
          tag: 'Hiring Portal'
        };
      case 'privacy':
        return {
          title: 'Privacy Policy',
          icon: <ShieldAlert size={36} className="text-brand-chili" />,
          subtitle: 'Encryption-First Gastronomy Security Standards',
          description: 'Your personal telemetry data, delivery coordinates, and bank transfer settlement details are secured under strict compliance guidelines. Our official privacy documentation is being compiled under international security frameworks.',
          tag: 'Compliance Docs'
        };
      case 'terms':
        return {
          title: 'Terms & Conditions',
          icon: <Scale size={36} className="text-brand-chili" />,
          subtitle: 'The Bibi Service Level Agreements',
          description: 'The operational, dispatch, and bank reconciliation contracts that govern our single-brand meal delivery system are undergoing legal and audit reviews to ensure maximum transparency.',
          tag: 'Legal Charter'
        };
      case 'refund':
        return {
          title: 'Refund & Quality Policies',
          icon: <FileText size={36} className="text-brand-chili" />,
          subtitle: 'No-Friction Reconciliation Framework',
          description: 'We strive for perfect thermal consistency. If an order falls below our mathematical gastronomy standards, we support zero-hassle reimbursement. Our fully automated instant bank-refund API guidelines are being compiled.',
          tag: 'Service Guarantees'
        };
      case 'media-kit':
        return {
          title: 'Media & Press Kit',
          icon: <Share2 size={36} className="text-brand-chili" />,
          subtitle: 'Digital Assets and Kitchen Brandmarks',
          description: 'We are organizing a comprehensive pack of high-resolution cloud kitchen photography, logo vector brandmarks, typography guidelines, and executive biographies for publishers, creators, and journalists.',
          tag: 'Press Center'
        };
      case 'app-download':
        return {
          title: 'Bibi Mobile App',
          icon: <Smartphone size={36} className="text-brand-chili" />,
          subtitle: 'Logistics in Your Palm (iOS & Android Beta)',
          description: 'The upcoming Bibi Food mobile application is undergoing closed beta testing. It introduces live thermal-sensor tracking of your insulated box, instant bank-transfer validation, and automated meal schedule calendars.',
          tag: 'Mobile Portal'
        };
      default:
        return {
          title: 'Custom Feature Portal',
          icon: <Compass size={36} className="text-brand-chili" />,
          subtitle: 'Bibi Culinary Innovation Lab',
          description: 'We are continuously engineering bespoke features for our cloud dining engine. This dedicated sector is undergoing architecture construction, preparing to launch soon.',
          tag: 'Engineering Lab'
        };
    }
  };

  const meta = getMetadata();

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubmitted(true);
      setEmail('');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.3 }}
      className="w-full max-w-3xl mx-auto px-4 py-12 md:py-16 text-center"
    >
      {/* Back button link */}
      <div className="flex justify-start mb-8">
        <button
          onClick={() => onNavigate('home')}
          className="inline-flex items-center gap-2 font-sans text-xs font-bold text-slate-500 hover:text-brand-chili transition-colors cursor-pointer group"
        >
          <ArrowLeft size={14} className="group-hover:-translate-x-0.5 transition-transform" />
          <span>Back to Homepage</span>
        </button>
      </div>

      {/* Decorative under-construction orb */}
      <div className="relative w-24 h-24 rounded-3xl bg-white border border-brand-chili/[0.05] shadow-[0_8px_24px_rgba(198,40,40,0.03)] flex items-center justify-center mx-auto mb-8">
        <div className="absolute inset-0 rounded-3xl bg-brand-chili/[0.01] animate-pulse" />
        {meta.icon}
        <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-brand-gold text-brand-charcoal rounded-full flex items-center justify-center text-[10px] font-mono font-bold border-2 border-white shadow-sm">
          !
        </span>
      </div>

      {/* Breadcrumb Tag */}
      <span className="inline-block bg-brand-chili/5 text-brand-chili border border-brand-chili/10 font-mono text-[9px] font-black px-3 py-1 rounded-full uppercase tracking-widest mb-4">
        {meta.tag}
      </span>

      {/* Primary Headers */}
      <h1 className="font-display font-black text-3xl md:text-4xl text-brand-charcoal tracking-tight mb-2">
        {meta.title}
      </h1>
      <p className="font-sans text-xs md:text-sm font-semibold text-brand-chili uppercase tracking-wider mb-6">
        {meta.subtitle}
      </p>

      {/* REQUIRED LITERAL MESSAGE */}
      <div className="bg-brand-gold/10 border border-brand-gold/20 rounded-2xl p-4 max-w-md mx-auto mb-8 flex items-center gap-3 text-left">
        <AlertCircle size={20} className="text-brand-gold shrink-0" />
        <div>
          <h4 className="font-display font-bold text-xs text-brand-charcoal uppercase tracking-wider">Coming Soon</h4>
          <p className="font-sans text-xs font-semibold text-brand-charcoal/80 mt-0.5">
            "This feature is currently under development."
          </p>
        </div>
      </div>

      {/* Detailed feature description */}
      <p className="font-sans text-xs md:text-sm text-slate-500 max-w-xl mx-auto leading-relaxed mb-10">
        {meta.description}
      </p>

      {/* Newsletter / Notifications opt-in box */}
      <div className="bg-white border border-brand-chili/[0.05] rounded-3xl p-6 md:p-8 shadow-[0_8px_30px_rgba(34,34,34,0.02)] max-w-lg mx-auto mb-10">
        <div className="flex items-center gap-3 mb-4 text-left">
          <div className="w-8 h-8 rounded-xl bg-brand-gold/10 flex items-center justify-center text-brand-gold shrink-0">
            <Clock size={16} />
          </div>
          <div>
            <h4 className="font-display font-bold text-xs text-brand-charcoal uppercase tracking-wide">Instant Notification</h4>
            <p className="font-sans text-[10px] text-slate-400">Be the first to receive access when this feature transitions live.</p>
          </div>
        </div>

        {submitted ? (
          <AnimatePresence mode="wait">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="p-4 bg-brand-success/10 border border-brand-success/20 rounded-xl text-brand-success font-sans text-xs font-bold flex items-center justify-center gap-2"
            >
              <CheckCircle2 size={16} className="shrink-0" />
              <span>Perfect! We've saved your address for launch alerts.</span>
            </motion.div>
          </AnimatePresence>
        ) : (
          <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-2.5">
            <input
              type="email"
              required
              placeholder="Enter your email (e.g. tunde@gmail.com)..."
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs font-sans focus:outline-none focus:border-brand-chili focus:bg-white transition-all text-slate-800 placeholder-slate-400"
            />
            <button
              type="submit"
              className="bg-brand-olive text-brand-saffron hover:bg-brand-chili hover:text-white font-display font-bold py-2.5 px-5 rounded-xl text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-sm active:scale-95 whitespace-nowrap shrink-0"
            >
              <span>Notify Me</span>
              <Send size={11} />
            </button>
          </form>
        )}
      </div>

      {/* Bottom CTA Actions */}
      <div className="flex flex-wrap items-center justify-center gap-4">
        <button
          onClick={() => onNavigate('home')}
          className="bg-brand-olive hover:bg-brand-olive/95 text-brand-saffron font-display font-bold py-3.5 px-8 rounded-2xl text-xs tracking-wider uppercase transition-all shadow-md active:scale-95 cursor-pointer"
        >
          Return Home
        </button>
        <button
          onClick={() => onNavigate('menu')}
          className="bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 font-display font-bold py-3.5 px-8 rounded-2xl text-xs tracking-wider uppercase transition-all shadow-sm active:scale-95 cursor-pointer"
        >
          Browse Menu
        </button>
      </div>

    </motion.div>
  );
}
