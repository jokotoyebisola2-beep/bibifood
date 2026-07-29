/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Trash2, Heart, Clock, ArrowRight, ShieldCheck, ChevronRight, AlertCircle, Sparkles, Minus, Plus, ShoppingBag, Utensils, MessageSquare, Tag } from 'lucide-react';
import { CartItem } from '../types';

interface CartViewProps {
  cartItems: CartItem[];
  onUpdateQuantity: (cartKey: string, quantity: number) => void;
  onRemoveItem: (cartKey: string) => void;
  onProceedToCheckout: () => void;
  onNavigate: (view: string) => void;
}

export default function CartView({
  cartItems,
  onUpdateQuantity,
  onRemoveItem,
  onProceedToCheckout,
  onNavigate,
}: CartViewProps) {
  const [promoCode, setPromoCode] = useState('');
  const [discountAmount, setDiscountAmount] = useState(0);
  const [promoError, setPromoError] = useState('');
  const [promoSuccess, setPromoSuccess] = useState('');
  const [savedForLater, setSavedForLater] = useState<string[]>([]);

  // Helper to get item's unique identifier key
  const getItemKey = (item: CartItem) => item.cartItemId || item.meal.id;

  // Calculate totals considering addons/unitPrice
  const subtotal = cartItems.reduce((acc, item) => {
    const unitPrice = item.unitPrice || item.meal.price;
    return acc + unitPrice * item.quantity;
  }, 0);

  const deliveryFee = subtotal > 0 ? 1200 : 0;
  const serviceFee = subtotal > 0 ? 500 : 0;
  const total = Math.max(0, subtotal + deliveryFee + serviceFee - discountAmount);

  // Handle promo code redemption
  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    setPromoError('');
    setPromoSuccess('');

    const cleanCode = promoCode.trim().toUpperCase();
    if (cleanCode === 'BIBI20' || cleanCode === 'BIBI2026') {
      const discount = Math.round(subtotal * 0.2);
      setDiscountAmount(discount);
      setPromoSuccess(`Promo applied! 20% off (₦${discount.toLocaleString()})`);
    } else if (cleanCode === 'WELCOME1000') {
      const discount = Math.min(subtotal, 1000);
      setDiscountAmount(discount);
      setPromoSuccess(`Promo applied! Flat ₦${discount.toLocaleString()} discount`);
    } else if (cleanCode === '') {
      setPromoError('Please enter a promo code.');
    } else {
      setPromoError('Invalid code. Try BIBI2026 or WELCOME1000');
    }
  };

  const toggleSaveForLater = (key: string) => {
    if (savedForLater.includes(key)) {
      setSavedForLater(savedForLater.filter((id) => id !== key));
    } else {
      setSavedForLater([...savedForLater, key]);
    }
  };

  // Max preparation time
  const maxPrepTime = cartItems.length > 0 
    ? cartItems.reduce((max, item) => {
        const timeVal = parseInt(item.meal.prepTime) || 20;
        return timeVal > max ? timeVal : max;
      }, 0)
    : 0;

  if (cartItems.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0 }}
        className="w-full max-w-4xl mx-auto px-4 py-16 text-center"
      >
        <div className="w-24 h-24 rounded-3xl bg-rose-50 text-brand-chili flex items-center justify-center mx-auto mb-6 shadow-sm border border-rose-100">
          <ShoppingBag size={42} className="stroke-[1.5]" />
        </div>
        <h1 className="font-display font-black text-2xl sm:text-3xl text-brand-charcoal mb-3">Your Cart is Empty</h1>
        <p className="font-sans text-sm text-slate-500 max-w-md mx-auto mb-8 leading-relaxed">
          You haven't added any delicious meals yet. Browse our menu to customize and order gourmet dishes delivered fast.
        </p>
        <button
          onClick={() => onNavigate('menu')}
          className="bg-brand-chili text-white hover:bg-brand-chili/90 py-3.5 px-8 rounded-2xl font-display font-bold text-sm uppercase tracking-wider transition-all shadow-md inline-flex items-center gap-2 cursor-pointer hover:scale-[1.02] active:scale-95"
        >
          <span>Explore Chef's Menu</span>
          <ArrowRight size={16} />
        </button>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="w-full max-w-6xl mx-auto px-4 py-8"
    >
      <div className="flex items-center gap-2 mb-2 font-mono text-[10px] text-slate-400 font-bold uppercase tracking-widest">
        <span>Shopping Experience</span>
        <ChevronRight size={10} />
        <span className="text-brand-chili">My Food Cart</span>
      </div>
      
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-4 border-b border-slate-200/60">
        <div>
          <h1 className="font-display font-black text-2xl sm:text-3xl text-brand-charcoal">
            Review Your Order
          </h1>
          <p className="font-sans text-xs text-slate-500 mt-1">
            {cartItems.reduce((sum, item) => sum + item.quantity, 0)} items ready for instant preparation
          </p>
        </div>

        <button
          onClick={() => onNavigate('menu')}
          className="font-display font-bold text-xs text-brand-chili hover:text-brand-charcoal underline underline-offset-4 cursor-pointer self-start sm:self-auto"
        >
          + Continue Shopping
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Cart Items List */}
        <div className="lg:col-span-8 flex flex-col gap-5">
          <AnimatePresence initial={false}>
            {cartItems.map((item) => {
              const itemKey = getItemKey(item);
              const itemIsSaved = savedForLater.includes(itemKey);
              const unitPrice = item.unitPrice || item.meal.price;
              const itemTotal = unitPrice * item.quantity;

              return (
                <motion.div
                  key={itemKey}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -100 }}
                  className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-sm flex flex-col sm:flex-row gap-5 relative transition-all hover:shadow-md"
                >
                  {/* Image */}
                  <div className="w-full sm:w-28 h-28 rounded-2xl overflow-hidden relative shrink-0 bg-slate-100">
                    <img
                      src={item.meal.image}
                      alt={item.meal.name}
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute top-2 left-2 bg-brand-charcoal/80 text-white font-mono text-[8px] font-bold tracking-wider uppercase px-2 py-0.5 rounded">
                      {item.meal.prepTime}
                    </div>
                  </div>

                  {/* Info Column */}
                  <div className="flex-1 flex flex-col justify-between min-w-0">
                    <div>
                      <div className="flex justify-between items-start gap-2">
                        <div>
                          <span className="font-mono text-[9px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1">
                            <Utensils size={10} className="text-brand-chili" />
                            {item.meal.restaurant || 'Bibi Executive Kitchen'}
                          </span>
                          <h3 className="font-display font-bold text-base text-brand-charcoal leading-tight mt-0.5">
                            {item.meal.name}
                          </h3>
                        </div>
                        <span className="font-sans font-black text-base text-brand-charcoal whitespace-nowrap">
                          ₦{itemTotal.toLocaleString()}
                        </span>
                      </div>
                      
                      {/* Price breakdown if add-ons exist */}
                      <p className="font-mono text-[11px] text-slate-400 mt-1">
                        ₦{unitPrice.toLocaleString()} each {item.selectedAddons && item.selectedAddons.length > 0 ? `(Base ₦${item.meal.price.toLocaleString()} + extras)` : ''}
                      </p>

                      {/* Addons Summary */}
                      {item.selectedAddons && item.selectedAddons.length > 0 && (
                        <div className="mt-2.5 flex flex-wrap gap-1.5 items-center">
                          <span className="font-mono text-[10px] text-slate-500 font-bold uppercase tracking-wider flex items-center gap-1">
                            <Tag size={10} className="text-brand-chili" />
                            Add-ons:
                          </span>
                          {item.selectedAddons.map((addon) => (
                            <span
                              key={addon.id}
                              className="font-sans text-[10px] font-semibold bg-brand-chili/10 text-brand-chili py-0.5 px-2 rounded-md"
                            >
                              +{addon.name} (+₦{addon.price.toLocaleString()})
                            </span>
                          ))}
                        </div>
                      )}

                      {/* Special Cooking Instructions Summary */}
                      {item.specialInstructions && (
                        <div className="mt-2 p-2 bg-amber-50/70 border border-amber-200/60 rounded-xl text-[11px] text-amber-900 flex items-start gap-1.5">
                          <MessageSquare size={12} className="text-amber-600 shrink-0 mt-0.5" />
                          <span><b>Note:</b> "{item.specialInstructions}"</span>
                        </div>
                      )}
                    </div>

                    {/* Bottom controls bar */}
                    <div className="flex justify-between items-center mt-5 pt-3 border-t border-slate-100">
                      {/* Quantity Selector */}
                      <div className="flex items-center gap-2 border border-slate-200 rounded-xl px-2.5 py-1 bg-slate-50">
                        <button
                          onClick={() => onUpdateQuantity(itemKey, item.quantity - 1)}
                          disabled={item.quantity <= 1}
                          className="text-slate-500 hover:text-brand-chili p-1 cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                          aria-label="Decrease quantity"
                        >
                          <Minus size={12} />
                        </button>
                        <span className="font-mono text-xs font-bold text-brand-charcoal w-6 text-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => onUpdateQuantity(itemKey, item.quantity + 1)}
                          className="text-slate-500 hover:text-brand-chili p-1 cursor-pointer transition-colors"
                          aria-label="Increase quantity"
                        >
                          <Plus size={12} />
                        </button>
                      </div>

                      {/* Action buttons (Save for later, Remove) */}
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => toggleSaveForLater(itemKey)}
                          className={`flex items-center gap-1 text-[11px] font-sans font-medium px-2.5 py-1.5 rounded-xl border transition-all cursor-pointer ${
                            itemIsSaved
                              ? 'bg-rose-50 border-rose-200 text-rose-600 font-bold'
                              : 'bg-white border-slate-200 text-slate-500 hover:text-slate-700 hover:bg-slate-50'
                          }`}
                        >
                          <Heart size={12} className={itemIsSaved ? 'fill-rose-600 text-rose-600' : ''} />
                          <span>{itemIsSaved ? 'Saved' : 'Save for later'}</span>
                        </button>

                        <button
                          onClick={() => onRemoveItem(itemKey)}
                          className="p-1.5 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 border border-transparent hover:border-rose-100 transition-colors cursor-pointer"
                          title="Remove from cart"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>

          {/* Prep time info notice */}
          <div className="bg-amber-50/50 border border-amber-200/60 rounded-2xl p-4 flex gap-3 text-xs text-amber-900 leading-normal">
            <Clock size={16} className="text-amber-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold">Fast Executive Prep</span>
              <p className="text-slate-600 mt-0.5">
                Estimated kitchen preparation window is <b className="font-mono text-brand-charcoal">{maxPrepTime} mins</b>. Delivered in thermal insulated bags to ensure piping-hot quality.
              </p>
            </div>
          </div>
        </div>

        {/* Right: Order Summary sticky sidebar */}
        <div className="lg:col-span-4 lg:sticky lg:top-28">
          <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm flex flex-col gap-5">
            <h3 className="font-display font-bold text-base text-brand-charcoal pb-3 border-b border-slate-100">
              Payment Summary
            </h3>

            {/* Cost Rows */}
            <div className="flex flex-col gap-3 font-sans text-xs text-slate-600">
              <div className="flex justify-between items-center">
                <span>Subtotal</span>
                <span className="font-mono text-brand-charcoal font-bold text-sm">
                  ₦{subtotal.toLocaleString()}
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span>Delivery Fee</span>
                <span className="font-mono text-brand-charcoal font-semibold">
                  ₦{deliveryFee.toLocaleString()}
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span>Service Fee</span>
                <span className="font-mono text-brand-charcoal font-semibold">
                  ₦{serviceFee.toLocaleString()}
                </span>
              </div>

              {discountAmount > 0 && (
                <div className="flex justify-between items-center text-emerald-700 font-semibold bg-emerald-50 p-2.5 rounded-xl border border-emerald-200/60">
                  <span className="flex items-center gap-1">
                    <Sparkles size={12} className="animate-pulse" />
                    Promo Discount
                  </span>
                  <span className="font-mono">
                    -₦{discountAmount.toLocaleString()}
                  </span>
                </div>
              )}

              <div className="flex justify-between items-center text-sm font-extrabold text-brand-charcoal pt-4 border-t border-dashed border-slate-200">
                <span>Total Amount</span>
                <span className="font-sans text-xl font-black text-brand-chili">
                  ₦{total.toLocaleString()}
                </span>
              </div>
            </div>

            {/* Promo Code Input */}
            <form onSubmit={handleApplyPromo} className="pt-4 border-t border-slate-100 flex flex-col gap-2">
              <label className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400">
                Discount / Promo Code
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Try BIBI2026"
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value)}
                  className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-sans focus:outline-none focus:border-brand-chili uppercase"
                />
                <button
                  type="submit"
                  className="bg-brand-charcoal text-white hover:bg-black px-4 rounded-xl text-xs font-bold transition-colors cursor-pointer"
                >
                  Apply
                </button>
              </div>

              <AnimatePresence mode="wait">
                {promoError && (
                  <motion.p
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="text-[10px] text-rose-600 flex items-center gap-1"
                  >
                    <AlertCircle size={10} />
                    <span>{promoError}</span>
                  </motion.p>
                )}
                {promoSuccess && (
                  <motion.p
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="text-[10px] text-emerald-600 flex items-center gap-1 font-semibold"
                  >
                    <ShieldCheck size={10} />
                    <span>{promoSuccess}</span>
                  </motion.p>
                )}
              </AnimatePresence>
            </form>

            <div className="pt-1">
              <div className="p-3 bg-slate-50 rounded-2xl flex items-start gap-2 text-[10px] text-slate-500 leading-relaxed border border-slate-200/60">
                <ShieldCheck size={14} className="text-emerald-600 shrink-0 mt-0.5" />
                <span>100% Satisfaction Guaranteed. Food is sealed hot directly from executive kitchen.</span>
              </div>
            </div>

            <button
              onClick={onProceedToCheckout}
              className="w-full bg-brand-chili text-white hover:bg-brand-chili/90 py-4 rounded-2xl font-display font-extrabold text-xs uppercase tracking-wider transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer group hover:shadow-lg active:scale-98"
            >
              <span>Checkout • ₦{total.toLocaleString()}</span>
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </button>
            
            <button
              onClick={() => onNavigate('menu')}
              className="w-full text-slate-500 hover:text-brand-charcoal py-2 text-xs font-semibold text-center hover:underline cursor-pointer"
            >
              Continue Browsing Menu
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
