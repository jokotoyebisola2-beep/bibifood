/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Lock, Mail, Eye, EyeOff, ShieldAlert, ArrowRight, CheckCircle2 } from 'lucide-react';
import BibiLogo from './BibiLogo';

interface AdminLoginViewProps {
  onLoginSuccess: (email: string) => void;
  onNavigate: (view: string) => void;
}

export default function AdminLoginView({ onLoginSuccess, onNavigate }: AdminLoginViewProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [loginSuccess, setLoginSuccess] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    setTimeout(() => {
      if (email.trim() && password.length >= 4) {
        setLoginSuccess(true);
        setTimeout(() => {
          onLoginSuccess(email.trim());
          setIsLoading(false);
        }, 800);
      } else {
        setError('Invalid admin credentials. Please enter a valid admin email and password.');
        setIsLoading(false);
      }
    }, 800);
  };

  return (
    <div id="admin-login-stage" className="w-full min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-brand-cream/30">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full space-y-8 bg-white p-8 sm:p-10 rounded-3xl border border-brand-olive/5 shadow-xl relative"
      >
        {/* Glow effect */}
        <div className="absolute -top-10 -left-10 w-40 h-40 bg-brand-gold/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-brand-chili/5 rounded-full blur-3xl pointer-events-none" />

        <div className="text-center relative z-10">
          <button 
            onClick={() => onNavigate('home')}
            className="inline-flex items-center justify-center cursor-pointer mb-4"
          >
            <BibiLogo mode="horizontal" className="h-8 sm:h-9" />
          </button>
          
          <div className="flex items-center justify-center gap-1.5 mt-2">
            <span className="font-mono text-[9px] bg-brand-olive text-brand-saffron font-black uppercase px-2.5 py-0.5 rounded-full tracking-wider">
              Admin Area
            </span>
            <span className="text-slate-400 text-xs font-mono">•</span>
            <span className="text-slate-400 font-sans text-xs">Admin Portal</span>
          </div>

          <h2 className="mt-4 font-display font-black text-2xl text-brand-charcoal tracking-tight">
            Admin Portal Sign-In
          </h2>
          <p className="mt-2 font-sans text-xs text-slate-400">
            Authorized admin personnel only.
          </p>
        </div>

        {loginSuccess ? (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="py-12 flex flex-col items-center justify-center text-center gap-4"
          >
            <div className="w-16 h-16 rounded-full bg-brand-basil/10 text-brand-basil flex items-center justify-center shadow-inner">
              <CheckCircle2 size={32} className="text-brand-basil" />
            </div>
            <div>
              <h3 className="font-display font-black text-lg text-brand-charcoal">Gateway Authenticated</h3>
              <p className="font-sans text-xs text-slate-500 max-w-sm mt-1 leading-relaxed">
                Welcome back, Administrator. Launching central operations system dashboard...
              </p>
            </div>
          </motion.div>
        ) : (
          <form className="mt-8 space-y-6 relative z-10" onSubmit={handleLogin}>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-3.5 bg-rose-50 border border-rose-100 rounded-2xl flex items-start gap-2.5 text-rose-600 text-xs font-sans font-medium"
              >
                <ShieldAlert size={16} className="shrink-0 mt-0.5" />
                <span>{error}</span>
              </motion.div>
            )}

            <div className="space-y-4">
              <div>
                <label className="block font-sans text-xs font-bold text-slate-600 mb-1.5">
                  Administrative Email Address
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400 pointer-events-none">
                    <Mail size={15} />
                  </span>
                  <input
                    id="admin-email-field"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@bibifood.ng"
                    className="w-full bg-slate-50/50 border border-slate-200 rounded-2xl pl-10 pr-4 py-3 text-xs font-sans text-slate-800 placeholder-slate-400 focus:outline-none focus:border-brand-olive focus:bg-white transition-all shadow-inner"
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label className="block font-sans text-xs font-bold text-slate-600">
                    Administrative Access Key
                  </label>
                </div>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400 pointer-events-none">
                    <Lock size={15} />
                  </span>
                  <input
                    id="admin-password-field"
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full bg-slate-50/50 border border-slate-200 rounded-2xl pl-10 pr-10 py-3 text-xs font-sans text-slate-800 placeholder-slate-400 focus:outline-none focus:border-brand-olive focus:bg-white transition-all shadow-inner"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 cursor-pointer"
                  >
                    {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
              </div>
            </div>

            <div>
              <button
                id="admin-login-submit"
                type="submit"
                disabled={isLoading}
                className="group relative w-full flex justify-center items-center gap-2 py-3.5 px-4 border border-transparent font-display font-bold text-xs rounded-2xl text-brand-saffron bg-brand-olive hover:bg-[#131E18] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-olive transition-all cursor-pointer shadow-md disabled:bg-slate-300 disabled:text-slate-500"
              >
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <span className="w-3 h-3 border-2 border-brand-saffron border-t-transparent rounded-full animate-spin" />
                    <span>Signing In...</span>
                  </span>
                ) : (
                  <>
                    <span>Sign In</span>
                    <ArrowRight size={13} className="group-hover:translate-x-1 transition-transform text-brand-gold" />
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </motion.div>
    </div>
  );
}
