/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Star, Clock, Check, Plus, Minus, Info, Utensils, Truck, Flame, CheckCircle2 } from 'lucide-react';
import { Meal, MealAddon } from '../types';

interface QuickViewModalProps {
  meal: Meal | null;
  onClose: () => void;
  onAddToCart: (
    meal: Meal,
    quantity?: number,
    specialInstructions?: string,
    selectedAddons?: MealAddon[]
  ) => void;
}

export default function QuickViewModal({ meal, onClose, onAddToCart }: QuickViewModalProps) {
  const [quantity, setQuantity] = useState(1);
  const [specialInstructions, setSpecialInstructions] = useState('');
  const [selectedAddons, setSelectedAddons] = useState<MealAddon[]>([]);
  const [addedSuccessfully, setAddedSuccessfully] = useState(false);

  // Reset state when meal changes
  useEffect(() => {
    if (meal) {
      setQuantity(1);
      setSpecialInstructions('');
      setSelectedAddons([]);
      setAddedSuccessfully(false);
    }
  }, [meal]);

  if (!meal) return null;

  // Default addons fallback if none specified on meal
  const availableAddons: MealAddon[] = meal.addons || [
    { id: 'addon-extra-chicken', name: 'Extra Grilled Chicken', price: 1500 },
    { id: 'addon-extra-cheese', name: 'Extra Cheese Melt', price: 800 },
    { id: 'addon-extra-sauce', name: 'Extra Bibi Secret Sauce', price: 500 },
    { id: 'addon-extra-dodo', name: 'Extra Fried Plantains (Dodo)', price: 700 },
    { id: 'addon-chilled-drink', name: 'Chilled House Beverage', price: 1000 },
  ];

  const toggleAddon = (addon: MealAddon) => {
    if (selectedAddons.some((a) => a.id === addon.id)) {
      setSelectedAddons(selectedAddons.filter((a) => a.id !== addon.id));
    } else {
      setSelectedAddons([...selectedAddons, addon]);
    }
  };

  // Price calculations
  const addonsTotal = selectedAddons.reduce((sum, a) => sum + a.price, 0);
  const singleUnitPrice = meal.price + addonsTotal;
  const grandTotal = singleUnitPrice * quantity;

  const handleAddToCart = () => {
    onAddToCart(meal, quantity, specialInstructions, selectedAddons);
    setAddedSuccessfully(true);
    setTimeout(() => {
      setAddedSuccessfully(false);
      onClose();
    }, 900);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
        {/* Backdrop overlay */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-brand-charcoal/70 backdrop-blur-md"
          onClick={onClose}
        />

        {/* Modal Window Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="bg-white w-full max-w-3xl rounded-3xl overflow-hidden shadow-2xl relative z-10 my-auto flex flex-col md:flex-row max-h-[90vh]"
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-30 w-9 h-9 rounded-full bg-white/90 hover:bg-white text-slate-600 hover:text-brand-chili shadow-md flex items-center justify-center cursor-pointer transition-all hover:scale-105 active:scale-95"
            aria-label="Close food details"
          >
            <X size={18} />
          </button>

          {/* Left Side: Large Food Image & Metadata Banner */}
          <div className="w-full md:w-5/12 bg-slate-900 relative min-h-[220px] md:min-h-full flex flex-col justify-between overflow-hidden">
            <img
              src={meal.image}
              alt={meal.name}
              className="absolute inset-0 w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
            {/* Dark gradient overlay for text readability */}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/30 to-slate-950/20" />

            {/* Top tags */}
            <div className="relative z-10 p-4 flex flex-wrap gap-2">
              <span className="font-mono text-[9px] font-extrabold text-white bg-brand-chili py-1 px-3 rounded-full uppercase tracking-wider shadow-sm">
                {meal.category.replace('-', ' ')}
              </span>
              <span className={`font-mono text-[9px] font-extrabold py-1 px-3 rounded-full uppercase tracking-wider shadow-sm ${
                meal.inStock ? 'bg-emerald-600 text-white' : 'bg-rose-600 text-white'
              }`}>
                {meal.inStock ? 'In Stock' : 'Out of Stock'}
              </span>
            </div>

            {/* Bottom metadata panel on image */}
            <div className="relative z-10 p-5 text-white">
              <span className="block font-mono text-[10px] text-amber-400 font-bold uppercase tracking-widest mb-1 flex items-center gap-1">
                <Utensils size={12} />
                {meal.restaurant || 'Bibi Executive Kitchen'}
              </span>
              <h3 className="font-display font-black text-lg md:text-xl leading-tight text-white drop-shadow-sm">
                {meal.name}
              </h3>

              <div className="flex items-center gap-4 mt-3 pt-3 border-t border-white/15 text-xs text-slate-200">
                <div className="flex items-center gap-1 font-mono font-bold text-amber-400">
                  <Star size={13} className="fill-amber-400 text-amber-400" />
                  <span>{meal.rating}</span>
                </div>
                <div className="flex items-center gap-1 font-sans">
                  <Clock size={12} className="text-slate-300" />
                  <span>{meal.prepTime}</span>
                </div>
                <div className="flex items-center gap-1 font-sans">
                  <Truck size={12} className="text-slate-300" />
                  <span>{meal.deliveryEstimate || '25-35 mins'}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side: Details, Customization Addons, Special Instructions & Add to Cart */}
          <div className="w-full md:w-7/12 p-6 md:p-8 flex flex-col justify-between overflow-y-auto">
            <div className="space-y-5">
              
              {/* Header Title & Restaurant */}
              <div>
                <span className="font-mono text-[10px] font-extrabold text-brand-chili uppercase tracking-widest block">
                  {meal.restaurant || 'Bibi Executive Kitchen'}
                </span>
                <h2 className="font-display font-bold text-xl md:text-2xl text-brand-charcoal mt-0.5">
                  {meal.name}
                </h2>
                <div className="flex items-center gap-3 mt-2">
                  <span className="font-sans text-2xl font-black text-brand-chili">
                    ₦{meal.price.toLocaleString()}
                  </span>
                  {meal.calories && (
                    <span className="font-mono text-[11px] font-bold text-slate-500 bg-slate-100 py-1 px-2.5 rounded-full flex items-center gap-1">
                      <Flame size={12} className="text-amber-500" />
                      {meal.calories}
                    </span>
                  )}
                </div>
              </div>

              {/* Description */}
              <p className="font-sans text-xs md:text-sm text-slate-600 leading-relaxed">
                {meal.description}
              </p>

              {/* Ingredients List */}
              {meal.ingredients && meal.ingredients.length > 0 && (
                <div>
                  <h4 className="font-sans text-xs font-bold text-brand-charcoal uppercase tracking-wider mb-2">
                    Key Ingredients
                  </h4>
                  <div className="flex flex-wrap gap-1.5">
                    {meal.ingredients.map((ing, idx) => (
                      <span
                        key={idx}
                        className="font-sans text-[11px] font-medium bg-slate-100 text-slate-700 py-1 px-2.5 rounded-lg border border-slate-200/60"
                      >
                        {ing}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Optional Add-ons Section */}
              <div className="pt-3 border-t border-slate-100">
                <div className="flex justify-between items-center mb-2.5">
                  <h4 className="font-sans text-xs font-bold text-brand-charcoal uppercase tracking-wider">
                    Customize Meal (Optional Add-ons)
                  </h4>
                  <span className="font-mono text-[10px] text-slate-400">Select any extras</span>
                </div>

                <div className="space-y-2">
                  {availableAddons.map((addon) => {
                    const isSelected = selectedAddons.some((a) => a.id === addon.id);
                    return (
                      <label
                        key={addon.id}
                        onClick={() => toggleAddon(addon)}
                        className={`flex items-center justify-between p-2.5 rounded-xl border text-xs cursor-pointer transition-all select-none ${
                          isSelected
                            ? 'bg-brand-chili/5 border-brand-chili/40 text-brand-charcoal font-semibold shadow-xs'
                            : 'bg-slate-50/70 border-slate-200/70 text-slate-600 hover:bg-slate-100'
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <div className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${
                            isSelected ? 'bg-brand-chili border-brand-chili text-white' : 'border-slate-300 bg-white'
                          }`}>
                            {isSelected && <Check size={12} strokeWidth={3} />}
                          </div>
                          <span>{addon.name}</span>
                        </div>
                        <span className="font-mono font-bold text-brand-chili">
                          +₦{addon.price.toLocaleString()}
                        </span>
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* Special Instructions Field */}
              <div className="pt-3 border-t border-slate-100">
                <label className="block font-sans text-xs font-bold text-brand-charcoal uppercase tracking-wider mb-1.5">
                  Special Cooking Instructions
                </label>
                <textarea
                  placeholder="e.g. No onions, Extra spicy, Less pepper, Sauce on the side..."
                  value={specialInstructions}
                  onChange={(e) => setSpecialInstructions(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs font-sans text-slate-800 placeholder-slate-400 focus:outline-none focus:border-brand-chili focus:bg-white resize-none h-16 transition-colors"
                  maxLength={160}
                />
              </div>

            </div>

            {/* Bottom Sticky Action Bar */}
            <div className="pt-5 mt-6 border-t border-slate-200/80 flex flex-col sm:flex-row items-center justify-between gap-4">
              
              {/* Total Price Display */}
              <div>
                <span className="block text-[10px] font-sans font-bold text-slate-400 uppercase tracking-wider">
                  Total Meal Price
                </span>
                <span className="font-sans text-xl font-black text-brand-charcoal">
                  ₦{grandTotal.toLocaleString()}
                </span>
              </div>

              <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
                {/* Quantity Modifier */}
                <div className="flex items-center border-2 border-slate-200 rounded-2xl p-1 bg-slate-50">
                  <button
                    type="button"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={quantity <= 1}
                    className="w-8 h-8 rounded-xl bg-white text-slate-600 hover:text-brand-chili shadow-xs flex items-center justify-center cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                  >
                    <Minus size={14} />
                  </button>
                  <span className="font-mono text-sm font-bold text-brand-charcoal w-8 text-center">
                    {quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-8 h-8 rounded-xl bg-white text-slate-600 hover:text-brand-chili shadow-xs flex items-center justify-center cursor-pointer transition-colors"
                  >
                    <Plus size={14} />
                  </button>
                </div>

                {/* Add to Cart Button */}
                <button
                  type="button"
                  onClick={handleAddToCart}
                  disabled={!meal.inStock || addedSuccessfully}
                  className={`flex-1 sm:flex-none py-3.5 px-6 rounded-2xl font-display font-extrabold text-xs uppercase tracking-wider transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer ${
                    addedSuccessfully
                      ? 'bg-emerald-600 text-white shadow-none'
                      : !meal.inStock
                      ? 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none'
                      : 'bg-brand-chili text-white hover:bg-brand-chili/90 hover:shadow-lg active:scale-95'
                  }`}
                >
                  {addedSuccessfully ? (
                    <>
                      <CheckCircle2 size={16} />
                      <span>Added To Cart!</span>
                    </>
                  ) : (
                    <>
                      <span>Add To Cart • ₦{grandTotal.toLocaleString()}</span>
                    </>
                  )}
                </button>
              </div>

            </div>

          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
