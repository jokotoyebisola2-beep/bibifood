/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Star, Quote } from 'lucide-react';
import { Review } from '../types';

interface ReviewCardProps {
  key?: string;
  review: Review;
}

export default function ReviewCard({ review }: ReviewCardProps) {
  return (
    <div className="bg-white rounded-3xl p-6 border border-brand-chili/10 shadow-sm hover:shadow-md transition-shadow duration-300 relative flex flex-col justify-between h-full">
      
      {/* Absolute top decorative Quote element */}
      <div className="absolute top-6 right-6 text-brand-gold/15">
        <Quote size={40} className="stroke-[1.5px] rotate-180" />
      </div>

      <div>
        {/* Star rating Row */}
        <div className="flex items-center gap-0.5 mb-4">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              size={13}
              className={`shrink-0 ${
                i < review.rating ? 'text-brand-gold fill-brand-gold' : 'text-slate-200'
              }`}
            />
          ))}
        </div>

        {/* Testimonial Quote body */}
        <p className="font-sans text-xs md:text-sm text-slate-600 leading-relaxed italic mb-6">
          "{review.comment}"
        </p>
      </div>

      {/* Reviewer Profile Card */}
      <div className="flex items-center gap-3 pt-4 border-t border-brand-chili/10">
        {review.userAvatar ? (
          <img
            src={review.userAvatar}
            alt={review.userName}
            className="w-10 h-10 rounded-full object-cover border-2 border-brand-gold"
            referrerPolicy="no-referrer"
            loading="lazy"
          />
        ) : (
          <div className="w-10 h-10 rounded-full bg-brand-chili text-white font-mono font-bold text-xs flex items-center justify-center border-2 border-brand-gold">
            {review.userName.substring(0, 2).toUpperCase()}
          </div>
        )}
        <div>
          <span className="block font-display font-semibold text-xs md:text-sm text-brand-charcoal">
            {review.userName}
          </span>
          {review.mealName && (
            <span className="block font-sans text-[10px] text-slate-400 mt-0.5">
              Ordered: {review.mealName}
            </span>
          )}
        </div>
      </div>

    </div>
  );
}
