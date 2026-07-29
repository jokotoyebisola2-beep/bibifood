/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ShoppingBag, ArrowRight } from 'lucide-react';
import { CartItem } from '../types';

interface FloatingCartBarProps {
  cart: CartItem[];
  onOpenCartPage: () => void;
  onOpenCartDrawer: () => void;
  isVisible?: boolean;
}

export default function FloatingCartBar({
  cart,
  onOpenCartPage,
  onOpenCartDrawer,
  isVisible = true
}: FloatingCartBarProps) {
  if (!isVisible || cart.length === 0) return null;

  const totalItemsCount = cart.reduce((acc, item) => acc + item.quantity, 0);
  const totalPrice = cart.reduce((acc, item) => {
    const unitPrice = item.unitPrice || item.meal.price;
    return acc + unitPrice * item.quantity;
  }, 0);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        transition={{ type: 'spring', damping: 20, stiffness: 260 }}
        className="fixed bottom-6 left-4 right-4 sm:left-auto sm:right-6 sm:w-auto z-40"
      >
        <div className="bg-brand-charcoal/95 backdrop-blur-md text-white border border-white/10 shadow-2xl rounded-2xl p-3 sm:px-6 sm:py-3.5 flex items-center justify-between gap-4 sm:gap-8 max-w-lg mx-auto">
          
          {/* Left info: Icon & Total Items */}
          <div
            onClick={onOpenCartDrawer}
            className="flex items-center gap-3 cursor-pointer hover:opacity-90 transition-opacity"
          >
            <div className="relative w-10 h-10 rounded-xl bg-brand-chili text-white flex items-center justify-center shadow-sm shrink-0">
              <ShoppingBag size={18} />
              <span className="absolute -top-1.5 -right-1.5 bg-amber-400 text-brand-charcoal font-mono text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center shadow-xs">
                {totalItemsCount}
              </span>
            </div>

            <div>
              <span className="block font-sans text-[10px] text-slate-300 font-bold uppercase tracking-wider">
                {totalItemsCount} {totalItemsCount === 1 ? 'Meal' : 'Meals'} in Cart
              </span>
              <span className="font-sans text-base font-black text-white">
                ₦{totalPrice.toLocaleString()}
              </span>
            </div>
          </div>

          {/* Right Action Button: View Cart */}
          <button
            onClick={onOpenCartPage}
            className="bg-brand-chili hover:bg-brand-chili/90 text-white font-display font-extrabold py-2.5 px-5 rounded-xl text-xs uppercase tracking-wider transition-all duration-300 flex items-center gap-2 shadow-md hover:shadow-lg active:scale-95 cursor-pointer shrink-0"
          >
            <span>View Cart</span>
            <ArrowRight size={14} />
          </button>

        </div>
      </motion.div>
    </AnimatePresence>
  );
}
