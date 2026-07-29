/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Star, Clock, Heart, Plus, Eye, Flame, Utensils, Sparkles } from 'lucide-react';
import { Meal } from '../types';

interface MealCardProps {
  key?: string;
  meal: Meal;
  onAddToCart: (meal: Meal) => void;
  onQuickView: (meal: Meal) => void;
  isFavoriteInitially?: boolean;
}

export default function MealCard({
  meal,
  onAddToCart,
  onQuickView,
  isFavoriteInitially = false
}: MealCardProps) {
  const [isFavorite, setIsFavorite] = useState(isFavoriteInitially);
  const [isAdding, setIsAdding] = useState(false);

  const handleAddClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsAdding(true);
    onAddToCart(meal);
    setTimeout(() => {
      setIsAdding(false);
    }, 800);
  };

  const toggleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsFavorite(!isFavorite);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.4 }}
      className="group bg-white rounded-3xl overflow-hidden border border-brand-chili/[0.05] shadow-[0_4px_20px_rgba(34,34,34,0.03)] hover:shadow-[0_16px_40px_rgba(198,40,40,0.08)] hover:border-brand-chili/20 transition-all duration-500 flex flex-col h-full relative"
    >
      
      {/* Upper Image Window */}
      <div className="relative w-full aspect-[4/3] sm:aspect-square overflow-hidden bg-brand-cream cursor-pointer" onClick={() => onQuickView(meal)}>
        <img
          src={meal.image}
          alt={meal.name}
          className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-108"
          referrerPolicy="no-referrer"
          loading="lazy"
        />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 right-3 flex justify-between items-center z-10 pointer-events-none">
          
          {/* Rating Badge */}
          <div className="flex items-center gap-1.5 bg-white/95 backdrop-blur-md py-1 px-2.5 rounded-full border border-slate-200/80 shadow-sm pointer-events-auto">
            <Star size={11} className="text-amber-500 fill-amber-500 shrink-0" />
            <span className="font-mono text-[10px] font-extrabold text-brand-charcoal">{meal.rating}</span>
          </div>

          {/* Favorite Toggle Button */}
          <button
            onClick={toggleFavorite}
            className={`w-8 h-8 rounded-full flex items-center justify-center backdrop-blur-md shadow-sm border transition-all duration-300 cursor-pointer pointer-events-auto ${
              isFavorite
                ? 'bg-rose-50 border-rose-200 text-rose-600 shadow-rose-100'
                : 'bg-white/95 border-slate-200/80 text-slate-400 hover:text-rose-500 hover:scale-110'
            }`}
            aria-label="Add to Favorites"
          >
            <Heart size={14} className={isFavorite ? 'fill-rose-600 text-rose-600' : ''} />
          </button>

        </div>

        {/* Bottom Image Metadata Badges */}
        <div className="absolute bottom-3 left-3 right-3 flex justify-between items-end z-10 pointer-events-none">
          {/* Calorie or Stock pill */}
          {meal.calories && (
            <div className="flex items-center gap-1 bg-brand-charcoal/85 backdrop-blur-md text-amber-300 py-0.5 px-2 rounded-md font-mono text-[9px] font-bold tracking-wider uppercase shadow-sm">
              <Flame size={10} className="text-amber-400" />
              <span>{meal.calories}</span>
            </div>
          )}

          {/* Delivery estimate */}
          {meal.deliveryEstimate && (
            <div className="flex items-center gap-1 bg-white/95 backdrop-blur-md text-slate-700 py-0.5 px-2 rounded-md font-mono text-[9px] font-bold shadow-sm border border-slate-200/60 ml-auto">
              <Clock size={10} className="text-slate-400" />
              <span>{meal.deliveryEstimate}</span>
            </div>
          )}
        </div>

        {/* Out Of Stock Overlay */}
        {!meal.inStock && (
          <div className="absolute inset-0 bg-brand-charcoal/50 backdrop-blur-xs flex items-center justify-center z-10">
            <div className="bg-white/95 py-2 px-5 rounded-full border border-brand-chili/10 font-display font-bold text-xs text-brand-chili tracking-wider uppercase shadow-md">
              Sold Out
            </div>
          </div>
        )}

        {/* Quick View Hover Trigger Overlay */}
        <div className="absolute inset-0 bg-brand-charcoal/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onQuickView(meal);
            }}
            className="py-2 px-4 rounded-full bg-white text-brand-charcoal hover:bg-brand-chili hover:text-white transition-all duration-300 font-display font-bold text-xs flex items-center gap-1.5 shadow-lg hover:scale-105 cursor-pointer"
          >
            <Eye size={14} />
            <span>Customize Meal</span>
          </button>
        </div>

      </div>

      {/* Details Area */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Category & Restaurant Sub-header */}
          <div className="flex items-center justify-between gap-2 mb-1.5">
            <span className="font-mono text-[9px] font-extrabold text-brand-chili uppercase tracking-widest">
              {meal.category.replace('-', ' ')}
            </span>
            {meal.restaurant && (
              <span className="font-sans text-[10px] font-medium text-slate-400 truncate max-w-[120px]">
                {meal.restaurant}
              </span>
            )}
          </div>

          {/* Meal Title */}
          <h3
            onClick={() => onQuickView(meal)}
            className="font-display font-bold text-base text-brand-charcoal line-clamp-1 group-hover:text-brand-chili transition-colors duration-300 cursor-pointer"
            title={meal.name}
          >
            {meal.name}
          </h3>

          {/* Description Snippet */}
          <p className="font-sans text-xs text-slate-500 mt-1.5 line-clamp-2 leading-relaxed">
            {meal.description}
          </p>

          {/* Addons hint badge */}
          {meal.addons && meal.addons.length > 0 && (
            <div className="mt-2.5 flex items-center gap-1 text-[10px] font-sans font-semibold text-amber-700 bg-amber-50/80 border border-amber-200/60 py-0.5 px-2 rounded-md w-fit">
              <Sparkles size={11} className="text-amber-500 shrink-0" />
              <span>{meal.addons.length} Custom Add-ons Available</span>
            </div>
          )}
        </div>

        {/* Pricing & Cart Action Tray */}
        <div className="flex items-center justify-between pt-4 mt-4 border-t border-slate-100">
          <div>
            <span className="block text-[9px] font-sans font-semibold text-slate-400 tracking-wider uppercase">
              Starting From
            </span>
            <span className="font-sans text-lg font-extrabold text-brand-chili tracking-tight">
              ₦{(meal.price).toLocaleString()}
            </span>
          </div>

          {/* Add to Cart button */}
          <motion.button
            onClick={handleAddClick}
            disabled={!meal.inStock || isAdding}
            whileTap={{ scale: 0.92 }}
            className={`py-2 px-3.5 rounded-2xl flex items-center gap-1.5 transition-all duration-300 shadow-md hover:shadow-lg relative overflow-hidden cursor-pointer ${
              !meal.inStock
                ? 'bg-slate-100 text-slate-400 cursor-not-allowed shadow-none border border-slate-200'
                : isAdding
                ? 'bg-emerald-600 text-white shadow-emerald-200'
                : 'bg-brand-chili text-white hover:bg-brand-chili/90 hover:scale-105 active:scale-95 shadow-brand-chili/15'
            }`}
          >
            <AnimatePresence mode="wait">
              {isAdding ? (
                <motion.span
                  key="checkmark"
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.5 }}
                  className="font-sans font-bold text-xs flex items-center gap-1"
                >
                  ✓ Added
                </motion.span>
              ) : (
                <motion.span
                  key="plus-icon"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="font-display font-bold text-xs flex items-center gap-1"
                >
                  <Plus size={15} />
                  <span>Add</span>
                </motion.span>
              )}
            </AnimatePresence>
          </motion.button>
        </div>

      </div>

    </motion.div>
  );
}
