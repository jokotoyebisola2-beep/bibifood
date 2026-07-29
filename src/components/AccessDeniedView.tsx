/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion } from 'motion/react';
import { Lock, ArrowLeft, ShieldAlert } from 'lucide-react';

interface AccessDeniedViewProps {
  roleName: string;
  description?: string;
  onLoginClick?: () => void;
  onHomeClick: () => void;
}

export default function AccessDeniedView({
  roleName,
  description,
  onLoginClick,
  onHomeClick,
}: AccessDeniedViewProps) {
  return (
    <div className="w-full min-h-[75vh] flex items-center justify-center p-4 bg-brand-cream/30 font-sans">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="max-w-md w-full bg-white p-8 sm:p-10 rounded-3xl border border-slate-200/80 shadow-xl text-center relative overflow-hidden"
      >
        <div className="w-16 h-16 rounded-full bg-rose-50 border border-rose-100 text-rose-600 flex items-center justify-center mx-auto mb-5 shadow-sm">
          <Lock size={28} />
        </div>

        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-rose-100/60 border border-rose-200 text-rose-700 rounded-full text-xs font-bold mb-3">
          <ShieldAlert size={13} />
          <span>Restricted Area</span>
        </div>

        <h2 className="font-display font-black text-2xl text-slate-800 tracking-tight">
          Access Denied
        </h2>

        <p className="font-sans text-xs text-slate-600 mt-2 font-medium leading-relaxed">
          You don't have permission to access this page.
        </p>

        {description && (
          <p className="font-sans text-xs text-slate-400 mt-1 leading-relaxed">
            {description}
          </p>
        )}

        <div className="flex flex-col gap-2.5 mt-8">
          {onLoginClick && (
            <button
              onClick={onLoginClick}
              className="w-full bg-brand-olive hover:bg-[#131E18] text-brand-saffron font-display font-bold py-3.5 rounded-2xl shadow-md transition-all text-xs cursor-pointer"
            >
              Sign In as {roleName}
            </button>
          )}

          <button
            onClick={onHomeClick}
            className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-display font-semibold py-3 rounded-2xl transition-colors text-xs cursor-pointer flex items-center justify-center gap-2"
          >
            <ArrowLeft size={14} />
            <span>Return to Home</span>
          </button>
        </div>
      </motion.div>
    </div>
  );
}
