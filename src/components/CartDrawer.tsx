/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Trash2, ShoppingBag, Plus, Minus, ArrowRight, ShieldCheck, Tag, MessageSquare } from 'lucide-react';
import { CartItem } from '../types';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onUpdateQuantity: (cartKey: string, quantity: number) => void;
  onRemoveItem: (cartKey: string) => void;
  onProceedToCheckout: () => void;
}

export default function CartDrawer({
  isOpen,
  onClose,
  cartItems,
  onUpdateQuantity,
  onRemoveItem,
  onProceedToCheckout
}: CartDrawerProps) {
  const getItemKey = (item: CartItem) => item.cartItemId || item.meal.id;

  const subtotal = cartItems.reduce((acc, item) => {
    const unitPrice = item.unitPrice || item.meal.price;
    return acc + unitPrice * item.quantity;
  }, 0);

  const deliveryFee = subtotal > 0 ? 1200 : 0;
  const total = subtotal + deliveryFee;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-brand-charcoal/60 backdrop-blur-xs z-50"
            onClick={onClose}
          />

          {/* Drawer Panel */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 240 }}
            className="fixed top-0 right-0 bottom-0 w-full sm:w-[420px] bg-slate-50 shadow-2xl z-50 flex flex-col justify-between"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="p-5 border-b border-slate-200 bg-white flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-rose-50 text-brand-chili flex items-center justify-center">
                  <ShoppingBag size={18} />
                </div>
                <h3 className="font-display font-bold text-base text-brand-charcoal">Your Food Cart</h3>
                <span className="font-mono text-xs text-slate-400">({cartItems.length})</span>
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-xl hover:bg-slate-100 transition-colors text-slate-500 cursor-pointer"
                aria-label="Close cart drawer"
              >
                <X size={18} />
              </button>
            </div>

            {/* Cart Items List */}
            <div className="flex-1 overflow-y-auto p-5 flex flex-col gap-3.5">
              <AnimatePresence initial={false}>
                {cartItems.length === 0 ? (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex flex-col items-center justify-center py-20 text-center gap-4"
                  >
                    <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-400">
                      <ShoppingBag size={28} />
                    </div>
                    <div>
                      <h4 className="font-display font-bold text-base text-brand-charcoal">Cart is empty</h4>
                      <p className="font-sans text-xs text-slate-400 mt-1 max-w-[200px]">
                        Select gourmet meals from our executive kitchen!
                      </p>
                    </div>
                    <button
                      onClick={onClose}
                      className="mt-2 bg-brand-chili text-white hover:bg-brand-chili/90 py-2.5 px-6 rounded-xl font-display font-bold text-xs uppercase tracking-wider transition-colors cursor-pointer"
                    >
                      Browse Menu
                    </button>
                  </motion.div>
                ) : (
                  cartItems.map((item) => {
                    const itemKey = getItemKey(item);
                    const unitPrice = item.unitPrice || item.meal.price;

                    return (
                      <motion.div
                        key={itemKey}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="bg-white p-3.5 rounded-2xl border border-slate-200/80 flex gap-3 shadow-2xs relative group"
                      >
                        {/* Thumbnail */}
                        <img
                          src={item.meal.image}
                          alt={item.meal.name}
                          className="w-16 h-16 rounded-xl object-cover shrink-0 bg-slate-100"
                          referrerPolicy="no-referrer"
                        />

                        {/* Details */}
                        <div className="flex-1 min-w-0">
                          <h4 className="font-display font-bold text-sm text-brand-charcoal truncate">
                            {item.meal.name}
                          </h4>
                          <p className="font-sans text-xs font-black text-brand-chili mt-0.5">
                            ₦{(unitPrice * item.quantity).toLocaleString()}
                          </p>

                          {/* Addons Summary */}
                          {item.selectedAddons && item.selectedAddons.length > 0 && (
                            <div className="mt-1.5 flex flex-wrap gap-1">
                              {item.selectedAddons.map((addon) => (
                                <span
                                  key={addon.id}
                                  className="font-sans text-[9px] font-semibold bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded"
                                >
                                  +{addon.name}
                                </span>
                              ))}
                            </div>
                          )}

                          {/* Instructions */}
                          {item.specialInstructions && (
                            <p className="font-sans text-[10px] text-amber-700 italic mt-1 line-clamp-1">
                              "{item.specialInstructions}"
                            </p>
                          )}

                          {/* Quantity adjusters */}
                          <div className="flex items-center justify-between mt-2.5 pt-2 border-t border-slate-100">
                            <div className="flex items-center gap-1.5 border border-slate-200 rounded-lg px-2 py-0.5 bg-slate-50">
                              <button
                                onClick={() => onUpdateQuantity(itemKey, item.quantity - 1)}
                                className="text-slate-500 hover:text-brand-chili p-0.5 cursor-pointer disabled:opacity-30"
                                disabled={item.quantity <= 1}
                              >
                                <Minus size={11} />
                              </button>
                              <span className="font-mono text-[11px] font-bold text-brand-charcoal w-4 text-center">
                                {item.quantity}
                              </span>
                              <button
                                onClick={() => onUpdateQuantity(itemKey, item.quantity + 1)}
                                className="text-slate-500 hover:text-brand-chili p-0.5 cursor-pointer"
                              >
                                <Plus size={11} />
                              </button>
                            </div>

                            <button
                              onClick={() => onRemoveItem(itemKey)}
                              className="p-1 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                              title="Remove item"
                            >
                              <Trash2 size={13} />
                            </button>
                          </div>
                        </div>

                      </motion.div>
                    );
                  })
                )}
              </AnimatePresence>
            </div>

            {/* Footer Checkout */}
            {cartItems.length > 0 && (
              <div className="p-5 bg-white border-t border-slate-200 flex flex-col gap-3.5 shadow-lg">
                <div className="flex flex-col gap-2 font-sans text-xs text-slate-500">
                  <div className="flex justify-between items-center">
                    <span>Subtotal</span>
                    <span className="font-mono text-slate-800 font-bold">
                      ₦{subtotal.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Thermal Delivery</span>
                    <span className="font-mono text-slate-800 font-bold">
                      ₦{deliveryFee.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-sm font-extrabold text-brand-charcoal pt-2 border-t border-dashed border-slate-200">
                    <span>Total</span>
                    <span className="font-sans text-base font-black text-brand-chili">
                      ₦{total.toLocaleString()}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 bg-slate-50 p-2.5 rounded-xl border border-slate-200/60 text-[10px] text-slate-500">
                  <ShieldCheck size={14} className="text-emerald-600 shrink-0" />
                  <span>Sealed fresh and delivered at optimum temperature.</span>
                </div>

                <button
                  onClick={() => {
                    onClose();
                    onProceedToCheckout();
                  }}
                  className="w-full bg-brand-chili hover:bg-brand-chili/90 text-white py-3.5 px-5 rounded-2xl font-display font-extrabold text-xs uppercase tracking-wider transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer group"
                >
                  <span>Checkout • ₦{total.toLocaleString()}</span>
                  <ArrowRight size={15} className="group-hover:translate-x-0.5 transition-transform" />
                </button>
              </div>
            )}

          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
