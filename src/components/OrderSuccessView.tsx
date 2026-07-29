import React, { useEffect } from 'react';
import { motion } from 'motion/react';
import { CheckCircle2, Download, MapPin, Calendar, Clock, ShoppingBag, CreditCard, ChevronRight } from 'lucide-react';
import { Order } from '../types';

interface OrderSuccessViewProps {
  order: Order;
  onNavigate: (view: string) => void;
}

export default function OrderSuccessView({
  order,
  onNavigate
}: OrderSuccessViewProps) {
  // Auto-scroll to top on load
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  // Compute receipt text blob & trigger immediate browser download
  const handleDownloadReceipt = () => {
    const divider = '='.repeat(45);
    const dateStr = new Date().toLocaleString();
    
    let receiptContent = `
${divider}
             BIBI FOOD RECEIPTS               
    Freshly Prepared. Delivered Fast.         
${divider}
Date: ${dateStr}
Order Reference: ${order.id}
Client: ${order.address.includes('Lagos') ? 'Gourmet Patron' : 'Valued Customer'}
Payment Protocol: Verified Bank Transfer

DELIVERY CONFIGURATION:
Method: ${order.deliveryOption === 'pickup' ? 'Kitchen collection locker' : 'Home Delivery'}
Destination Address:
  ${order.address}

ORDER TICKET ITEMS:
`;

    order.items.forEach((item) => {
      receiptContent += `* ${item.meal.name} (x${item.quantity})
  Price: N${item.meal.price.toLocaleString()} each -> N${(item.meal.price * item.quantity).toLocaleString()}
`;
    });

    receiptContent += `
${divider}
FINANCIAL BREAKDOWN:
Meals Subtotal:      N${order.subtotal?.toLocaleString() || order.totalAmount.toLocaleString()}
Quality Fee:         N${order.serviceFee?.toLocaleString() || '250'}
Delivery Charges:    N${order.deliveryFee?.toLocaleString() || '1,500'}
Discount:           -N${order.discount?.toLocaleString() || '0'}
---------------------------------------------
TOTAL SETTLED:       N${order.totalAmount.toLocaleString()}
${divider}
      Thank you for dining with Bibi Food!
     Verification code for rider: ${order.verificationPin || 'N/A'}
${divider}
`;

    const blob = new Blob([receiptContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `BibiFood_Receipt_${order.id}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0 }}
      className="w-full max-w-3xl mx-auto px-4 py-12"
    >
      <div className="bg-white p-8 sm:p-12 rounded-3xl border border-slate-100 shadow-lg flex flex-col items-center text-center relative overflow-hidden">
        {/* Confetti decoration */}
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#C62828_1.5px,transparent_1.5px)] [background-size:20px_20px] pointer-events-none" />

        {/* Success checkmark micro-animation */}
        <motion.div
          initial={{ scale: 0, rotate: -45 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: 'spring', damping: 15, stiffness: 200, delay: 0.1 }}
          className="w-20 h-20 rounded-full bg-emerald-50 border-2 border-emerald-500/10 text-emerald-600 flex items-center justify-center mb-6 shadow-sm"
        >
          <CheckCircle2 size={44} className="stroke-[1.5]" />
        </motion.div>

        <span className="font-mono text-[10px] bg-emerald-50 text-emerald-600 font-bold uppercase tracking-widest px-3 py-1 rounded-full border border-emerald-100">
          Payment Verified Successfully
        </span>

        <h1 className="font-display font-black text-3xl sm:text-4xl text-brand-charcoal mt-4 mb-2">
          Your Culinary Ticket is Live!
        </h1>
        
        <p className="font-sans text-sm text-slate-500 max-w-md mb-8 leading-relaxed">
          Chefs are assembling fresh ingredients. All elements are heat-sealed immediately after flame grilling to maintain maximum thermal integrity.
        </p>

        {/* Primary Order Stats cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 w-full max-w-lg mb-8 text-left">
          <div className="p-4 bg-[#FAF8F5] border border-slate-100 rounded-2xl flex flex-col gap-1">
            <span className="font-sans text-[10px] text-slate-400 font-semibold uppercase tracking-wider">Order Reference</span>
            <span className="font-mono font-black text-sm text-brand-charcoal">{order.id}</span>
          </div>

          <div className="p-4 bg-[#FAF8F5] border border-slate-100 rounded-2xl flex flex-col gap-1">
            <span className="font-sans text-[10px] text-slate-400 font-semibold uppercase tracking-wider">Estimated Delivery</span>
            <span className="font-sans font-bold text-xs text-brand-charcoal flex items-center gap-1 mt-0.5">
              <Clock size={12} className="text-brand-chili shrink-0" />
              <span>35-45 mins</span>
            </span>
          </div>

          <div className="p-4 bg-[#FAF8F5] border border-slate-100 rounded-2xl flex flex-col gap-1 col-span-2 sm:col-span-1">
            <span className="font-sans text-[10px] text-slate-400 font-semibold uppercase tracking-wider">Verification Pin</span>
            <span className="font-mono font-extrabold text-sm text-brand-saffron tracking-widest">{order.verificationPin || '5831'}</span>
          </div>
        </div>

        {/* Order Items Summary Breakdown */}
        <div className="w-full max-w-lg bg-slate-50/50 border border-slate-100 rounded-2xl p-5 mb-8 text-left">
          <h3 className="font-display font-bold text-xs text-brand-charcoal uppercase tracking-wider mb-3 pb-2 border-b border-slate-100">
            Order summary details
          </h3>
          <div className="flex flex-col gap-2 max-h-40 overflow-y-auto pr-1">
            {order.items.map((item) => (
              <div key={item.meal.id} className="flex justify-between items-center text-xs text-slate-600 font-sans">
                <span className="truncate max-w-[200px]">
                  {item.meal.name} <span className="font-mono text-[10px] text-slate-400 font-bold ml-1">x{item.quantity}</span>
                </span>
                <span className="font-mono">₦{(item.meal.price * item.quantity).toLocaleString()}</span>
              </div>
            ))}
          </div>

          <div className="pt-3 mt-3 border-t border-dashed border-slate-200 flex justify-between items-center text-xs font-bold text-brand-charcoal">
            <span>Total Settlement</span>
            <span className="font-mono text-sm text-brand-chili">₦{order.totalAmount.toLocaleString()}</span>
          </div>
        </div>

        {/* Action button Grid */}
        <div className="flex flex-col sm:flex-row gap-3 w-full max-w-lg">
          <button
            onClick={() => onNavigate('track')}
            className="flex-1 bg-brand-chili text-white hover:bg-[#A31F1F] py-3.5 px-6 rounded-2xl font-display font-bold text-sm tracking-wide transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer hover:scale-[1.01]"
          >
            <Clock size={16} />
            <span>Track Live Order</span>
          </button>

          <button
            onClick={handleDownloadReceipt}
            className="flex-1 bg-brand-charcoal text-white hover:bg-black py-3.5 px-6 rounded-2xl font-display font-bold text-sm tracking-wide transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer hover:scale-[1.01]"
          >
            <Download size={16} />
            <span>Download Receipt</span>
          </button>
        </div>

        <button
          onClick={() => onNavigate('menu')}
          className="mt-6 text-slate-500 hover:text-brand-charcoal font-sans font-bold text-xs hover:underline cursor-pointer"
        >
          Continue Shopping
        </button>
      </div>
    </motion.div>
  );
}
