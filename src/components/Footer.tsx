/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Phone, Mail, MapPin, Clock, Twitter, Instagram, Facebook, Award, Smartphone, Send, CheckCircle2 } from 'lucide-react';
import BibiLogo from './BibiLogo';

interface FooterProps {
  onNavigate: (view: string) => void;
}

export default function Footer({ onNavigate }: FooterProps) {
  const currentYear = new Date().getFullYear();
  const [emailInput, setEmailInput] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (emailInput.trim()) {
      setSubscribed(true);
      setEmailInput('');
    }
  };

  const companyLinks = [
    { label: 'About Us', id: 'about' },
    { label: 'Our Culinary Mission', id: 'about' },
    { label: 'Careers', id: 'careers' },
    { label: 'Join as Partner Rider', id: 'rider-portal' },
  ];

  const customerLinks = [
    { label: 'Interactive Menu', id: 'menu' },
    { label: 'Track Active Order', id: 'track' },
    { label: 'Frequently Asked Questions', id: 'faq' },
    { label: 'Contact Support', id: 'contact' },
    { label: 'Central Admin Command', id: 'admin-login' },
  ];

  const legalLinks = [
    { label: 'Privacy Policy', id: 'privacy' },
    { label: 'Terms & Conditions', id: 'terms' },
    { label: 'Refund Policy', id: 'refund' },
  ];

  return (
    <footer id="app-footer" className="bg-brand-olive text-slate-300 border-t border-white/5 pt-16 pb-8">
      <div className="w-full max-w-7xl mx-auto px-4 md:px-8">
        
        {/* Main Grid Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-10 pb-12 border-b border-white/10">
          
          {/* Column 1: Brand & Bio */}
          <div className="flex flex-col gap-5 lg:col-span-1">
            <BibiLogo mode="horizontal" className="h-10 self-start" />
            
            <p className="font-sans text-xs text-slate-400 leading-relaxed max-w-sm">
              An elite, single-brand online food engine delivering gourmet meals prepared with mathematical culinary precision and delivered at pristine eating temperature.
            </p>
 
            <div className="flex items-center gap-3 mt-2">
              <a href="#twitter" className="w-8 h-8 rounded-lg bg-white/5 hover:bg-brand-chili hover:text-white transition-all flex items-center justify-center text-slate-400">
                <Twitter size={14} />
              </a>
              <a href="#instagram" className="w-8 h-8 rounded-lg bg-white/5 hover:bg-brand-chili hover:text-white transition-all flex items-center justify-center text-slate-400">
                <Instagram size={14} />
              </a>
              <a href="#facebook" className="w-8 h-8 rounded-lg bg-white/5 hover:bg-brand-chili hover:text-white transition-all flex items-center justify-center text-slate-400">
                <Facebook size={14} />
              </a>
            </div>
          </div>
 
          {/* Column 2: Quick Links */}
          <div className="flex flex-col gap-4">
            <h4 className="font-display font-semibold text-xs text-[#FAF8F5] tracking-wider uppercase">
              Bibi Food
            </h4>
            <ul className="flex flex-col gap-2.5 text-xs font-sans">
              {companyLinks.map((link, idx) => (
                <li key={idx}>
                  <button
                    onClick={() => onNavigate(link.id)}
                    className="hover:text-brand-chili transition-colors cursor-pointer text-left text-slate-400 hover:text-white"
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>
 
          {/* Column 3: Customer Care */}
          <div className="flex flex-col gap-4">
            <h4 className="font-display font-semibold text-xs text-[#FAF8F5] tracking-wider uppercase">
              Assistance
            </h4>
            <ul className="flex flex-col gap-2.5 text-xs font-sans">
              {customerLinks.map((link, idx) => (
                <li key={idx}>
                  <button
                    onClick={() => onNavigate(link.id)}
                    className="hover:text-brand-chili transition-colors cursor-pointer text-left text-slate-400 hover:text-white"
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>
 
          {/* Column 4: Contact & Operations */}
          <div className="flex flex-col gap-4">
            <h4 className="font-display font-semibold text-xs text-[#FAF8F5] tracking-wider uppercase">
              Operations Hub
            </h4>
            <ul className="flex flex-col gap-3 text-xs font-sans text-slate-400">
              <li className="flex items-start gap-2.5">
                <Clock size={15} className="text-brand-gold shrink-0 mt-0.5" />
                <div>
                  <span className="block font-medium text-slate-300">Daily Service Hours:</span>
                  <span className="block text-slate-400 mt-0.5 font-mono">7:00 AM – 10:00 PM</span>
                </div>
              </li>
              <li className="flex items-start gap-2.5">
                <Phone size={15} className="text-brand-gold shrink-0 mt-0.5" />
                <div>
                  <span className="block font-medium text-slate-300">Support Hotline:</span>
                  <span className="block text-slate-400 mt-0.5 font-mono">+234 (0) 800-BIBI-FOOD</span>
                </div>
              </li>
              <li className="flex items-start gap-2.5">
                <MapPin size={15} className="text-brand-gold shrink-0 mt-0.5" />
                <div>
                  <span className="block font-medium text-slate-300">Central Kitchen Hubs:</span>
                  <span className="block text-slate-400 mt-0.5">Lagos, Abuja, Port Harcourt</span>
                </div>
              </li>
            </ul>
          </div>
 
          {/* Column 5: App Downloads & Newsletter */}
          <div className="flex flex-col gap-5 lg:col-span-1">
            <div className="flex flex-col gap-3">
              <h4 className="font-display font-semibold text-xs text-[#FAF8F5] tracking-wider uppercase">
                Download App
              </h4>
              <div className="flex flex-col gap-2">
                <button
                  onClick={() => onNavigate('app-download')}
                  className="w-full bg-[#1A1A1A] hover:bg-[#2A2A2A] text-[#FAF8F5] border border-white/10 rounded-xl p-2.5 flex items-center gap-2 transition-all text-left cursor-pointer group"
                >
                  <Smartphone size={16} className="text-brand-gold shrink-0" />
                  <div>
                    <span className="block text-[8px] font-sans text-slate-400 uppercase leading-none">Download on the</span>
                    <span className="block text-[11px] font-display font-bold leading-tight text-white">App Store</span>
                  </div>
                </button>
                <button
                  onClick={() => onNavigate('app-download')}
                  className="w-full bg-[#1A1A1A] hover:bg-[#2A2A2A] text-[#FAF8F5] border border-white/10 rounded-xl p-2.5 flex items-center gap-2 transition-all text-left cursor-pointer group"
                >
                  <Smartphone size={16} className="text-brand-gold shrink-0" />
                  <div>
                    <span className="block text-[8px] font-sans text-slate-400 uppercase leading-none">Get it on</span>
                    <span className="block text-[11px] font-display font-bold leading-tight text-white">Google Play</span>
                  </div>
                </button>
              </div>
            </div>
 
            <div className="flex flex-col gap-2 pt-2">
              <span className="block text-[11px] font-sans font-semibold text-slate-300">Newsletter Subscription</span>
              {subscribed ? (
                <div className="flex items-center gap-1.5 text-[10px] text-brand-gold bg-white/5 border border-brand-gold/20 p-2 rounded-lg font-sans">
                  <CheckCircle2 size={13} className="shrink-0" />
                  <span>Subscribed! Welcome aboard.</span>
                </div>
              ) : (
                <form onSubmit={handleSubscribe} className="flex gap-1.5 bg-[#1A1A1A] p-1.5 rounded-xl border border-white/10 focus-within:border-brand-chili transition-colors">
                  <input
                    type="email"
                    required
                    placeholder="your@email.com"
                    value={emailInput}
                    onChange={(e) => setEmailInput(e.target.value)}
                    className="w-full bg-transparent text-[11px] text-slate-200 px-2 focus:outline-none placeholder-slate-500 font-sans"
                  />
                  <button
                    type="submit"
                    className="bg-brand-chili text-white hover:bg-brand-chili/90 p-1.5 rounded-lg transition-colors cursor-pointer"
                  >
                    <Send size={11} />
                  </button>
                </form>
              )}
            </div>
          </div>

        </div>

        {/* Lower Legal Section */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pt-8 text-xs font-sans text-slate-500">
          <div>
            <span>© {currentYear} Bibi Food Technologies Ltd. All rights reserved.</span>
          </div>
          
          <div className="flex items-center gap-6">
            {legalLinks.map((link, idx) => (
              <button
                key={idx}
                onClick={() => onNavigate(link.id)}
                className="hover:text-slate-300 transition-colors cursor-pointer"
              >
                {link.label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-1.5 text-[10px] font-mono text-slate-400 bg-white/5 px-2.5 py-1 rounded-md border border-white/5">
            <Award size={11} className="text-brand-saffron" />
            <span>Premium Gastronomy Standard</span>
          </div>
        </div>

      </div>
    </footer>
  );
}
