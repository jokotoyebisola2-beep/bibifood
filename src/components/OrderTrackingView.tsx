import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Truck, 
  ChefHat, 
  CheckCircle, 
  MapPin, 
  Phone, 
  MessageSquare, 
  HelpCircle, 
  Clock, 
  ShieldCheck, 
  Info, 
  Flame, 
  Sparkles,
  Search,
  Check,
  Send,
  X
} from 'lucide-react';
import { Order, OrderStatus } from '../types';

interface OrderTrackingViewProps {
  order: Order;
  onUpdateStatus?: (status: OrderStatus) => void;
  onNavigate: (view: string) => void;
  onCancelOrder?: () => void;
}

export default function OrderTrackingView({
  order,
  onUpdateStatus,
  onNavigate,
  onCancelOrder
}: OrderTrackingViewProps) {
  const [isSupportOpen, setIsSupportOpen] = useState(false);
  const [supportMessage, setSupportMessage] = useState('');
  const [chatHistory, setChatHistory] = useState<Array<{ sender: 'user' | 'agent'; text: string }>>([
    { sender: 'agent', text: 'Hi! I am Bibi Assistant. How can I help with your culinary transit today?' }
  ]);
  const [simulatedTimeLeft, setSimulatedTimeLeft] = useState(38);

  // Auto-decrement simulated arrival timer for realism
  useEffect(() => {
    const timer = setInterval(() => {
      setSimulatedTimeLeft((prev) => (prev > 5 ? prev - 1 : 5));
    }, 15000);
    return () => clearInterval(timer);
  }, []);

  // Set active stage index
  const stages: { status: OrderStatus; label: string; desc: string; icon: any }[] = [
    { status: 'pending_payment', label: 'Order Received', desc: 'Secure payment received & validated by ledger audit.', icon: CheckCircle },
    { status: 'preparing', label: 'Preparing Food', desc: 'Executive chefs selecting prime farm-fresh ingredients.', icon: ChefHat },
    { status: 'preparing', label: 'Cooking', desc: 'Woodfire flame-cooking matching high hygiene criteria.', icon: Flame },
    { status: 'preparing', label: 'Packaging', desc: 'Sealed inside heat-locked thermal wrap directly from grill.', icon: ShieldCheck },
    { status: 'in_transit', label: 'Out for Delivery', desc: 'Courier rider dispatched in thermal backbag.', icon: Truck },
    { status: 'delivered', label: 'Delivered', desc: 'Arrived at your door at optimal temperature.', icon: MapPin }
  ];

  // Helper to determine active index
  const getActiveIndex = (status: OrderStatus) => {
    if (status === 'pending_payment') return 0;
    if (status === 'preparing') return 2; // general preparing spans kitchen/cooking/packaging
    if (status === 'in_transit') return 4;
    if (status === 'delivered') return 5;
    if (status === 'canceled') return -1;
    return 0;
  };

  const activeIndex = getActiveIndex(order.status);

  // Send message to support bot
  const handleSendSupport = (e: React.FormEvent) => {
    e.preventDefault();
    if (!supportMessage.trim()) return;

    const userMsg = supportMessage;
    setChatHistory((prev) => [...prev, { sender: 'user', text: userMsg }]);
    setSupportMessage('');

    // Simulated reply
    setTimeout(() => {
      let reply = "Our team is on standby! We have notified Rider Babajide O. to maintain fast speed. Let us know if you need anything else.";
      if (userMsg.toLowerCase().includes('phone') || userMsg.toLowerCase().includes('number')) {
        reply = "You can call Rider Babajide O. directly at +234 800-BIBI-COURIER (0800-2424-3663).";
      } else if (userMsg.toLowerCase().includes('late') || userMsg.toLowerCase().includes('delay')) {
        reply = "Our thermal foils maintain perfect meal temperatures for up to 2 hours, so rest assured your food will arrive steaming hot.";
      }
      setChatHistory((prev) => [...prev, { sender: 'agent', text: reply }]);
    }, 1000);
  };

  // Status transitions
  const triggerStatusForward = () => {
    if (!onUpdateStatus) return;
    if (order.status === 'pending_payment') {
      onUpdateStatus('preparing');
    } else if (order.status === 'preparing') {
      onUpdateStatus('in_transit');
    } else if (order.status === 'in_transit') {
      onUpdateStatus('delivered');
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-8">
      {/* Simulation Helper Panel */}
      {onUpdateStatus && order.status !== 'delivered' && order.status !== 'canceled' && (
        <div className="mb-6 p-4 bg-amber-50/50 border border-amber-200/50 rounded-2xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <span className="font-mono text-[9px] bg-brand-chili text-white font-bold px-2 py-0.5 rounded uppercase">TRANSIT SIMULATOR</span>
            <p className="text-xs text-slate-500 mt-1 leading-normal">
              Click the step controller to cycle the order through its cooking, thermal packaging, and transit timeline phases!
            </p>
          </div>
          <button
            onClick={triggerStatusForward}
            className="px-4 py-2 bg-brand-charcoal text-white hover:bg-black font-display font-bold text-xs rounded-xl shadow-sm transition-all cursor-pointer flex items-center gap-1.5"
          >
            <Sparkles size={13} className="animate-pulse" />
            <span>Simulate Next Progress Stage</span>
          </button>
        </div>
      )}

      {/* Canceled/Completed states alerts */}
      {order.status === 'canceled' && (
        <div className="mb-8 p-6 bg-rose-50 border border-rose-100 rounded-3xl text-center max-w-xl mx-auto">
          <h3 className="font-display font-extrabold text-brand-charcoal text-lg">Order Cancelled</h3>
          <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
            This order has been cancelled. If payment was sent, a full automated reverse transfer is triggered instantly back to your originating bank.
          </p>
          <button
            onClick={() => onNavigate('menu')}
            className="mt-4 bg-brand-charcoal text-white px-5 py-2.5 rounded-xl font-display font-bold text-xs cursor-pointer"
          >
            Return to Menu
          </button>
        </div>
      )}

      {order.status === 'delivered' && (
        <div className="mb-8 p-6 bg-emerald-50 border border-emerald-100 rounded-3xl text-center max-w-xl mx-auto">
          <h3 className="font-display font-extrabold text-brand-charcoal text-lg">Order Delivered & Feast Commenced</h3>
          <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
            We hope you enjoyed our gourmet creations! Your thermal lock was successfully verified at perfect heat integrity.
          </p>
          <div className="flex gap-2 justify-center mt-4">
            <button
              onClick={() => onNavigate('menu')}
              className="bg-brand-chili text-white px-5 py-2.5 rounded-xl font-display font-bold text-xs cursor-pointer"
            >
              Order Another Feast
            </button>
            <button
              onClick={() => onNavigate('home')}
              className="bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 px-5 py-2.5 rounded-xl font-display font-bold text-xs cursor-pointer"
            >
              Go to Homepage
            </button>
          </div>
        </div>
      )}

      <div className="flex items-center gap-2 mb-2 font-mono text-[10px] text-slate-400 font-bold uppercase tracking-widest">
        <span>Order status tracking</span>
        <Check size={10} className="text-emerald-500" />
        <span className="text-brand-chili">Live Transit Console</span>
      </div>

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-slate-100 mb-8">
        <div>
          <h1 className="font-display font-black text-2xl sm:text-3xl text-brand-charcoal">
            Track Culinary Ticket
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">Order Ref: <span className="font-mono font-bold text-brand-charcoal">{order.id}</span></p>
        </div>

        {order.status !== 'delivered' && order.status !== 'canceled' && onCancelOrder && (
          <button
            onClick={onCancelOrder}
            className="text-[11px] font-sans font-bold text-rose-500 hover:text-rose-700 bg-rose-50/50 hover:bg-rose-50 px-3 py-1.5 rounded-xl border border-rose-100/30 transition-all cursor-pointer"
          >
            Cancel Active Ticket
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Interactive Styled Map and Courier details */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          
          {/* Simulated Vector Map (Exquisite representation of Lagos coordinates) */}
          <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex flex-col gap-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-50">
              <span className="font-display font-bold text-xs text-brand-charcoal uppercase tracking-wider block">
                Visual Transit Route Map
              </span>
              
              {order.status === 'in_transit' && (
                <div className="flex items-center gap-1.5 font-mono text-[10px] text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-100 animate-pulse">
                  <Truck size={12} className="text-emerald-600" />
                  <span> Babajide O. is En Route</span>
                </div>
              )}
            </div>

            {/* Gorgeous Simulated Lagos Street Grid Vector Canvas */}
            <div className="aspect-video bg-amber-50/20 rounded-2xl border border-slate-200 relative overflow-hidden flex items-center justify-center select-none">
              {/* Lagos Water Lagoon SVG style block */}
              <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#1c2a22_1px,transparent_1px)] [background-size:20px_20px]" />
              
              {/* Simulated streets / paths lines */}
              <svg className="absolute inset-0 w-full h-full text-slate-200 stroke-current" fill="none" strokeWidth="4" strokeLinecap="round">
                {/* Marina - Lekki Highway */}
                <path d="M50,150 Q120,180 200,100 T350,120 T500,80" className="stroke-slate-300" />
                <path d="M50,150 Q120,180 200,100 T350,120 T500,80" className="stroke-brand-chili/10" strokeDasharray="8 6" />
                
                {/* Ikoyi Connective branch */}
                <path d="M200,100 C150,50 100,80 50,50" className="stroke-slate-200" strokeWidth="2" />
                <path d="M350,120 C320,180 400,220 450,220" className="stroke-slate-200" strokeWidth="2" />
              </svg>

              {/* Pulsing Kitchen Node (Marina Central) */}
              <div className="absolute left-[10%] top-[60%] -translate-y-1/2 flex flex-col items-center gap-1 z-10">
                <div className="w-9 h-9 rounded-full bg-brand-charcoal text-brand-saffron flex items-center justify-center shadow-lg ring-4 ring-white">
                  <ChefHat size={16} />
                </div>
                <span className="font-mono text-[8px] bg-brand-charcoal text-white font-extrabold uppercase px-1.5 py-0.5 rounded-md shadow-sm">Marina Kitchen</span>
              </div>

              {/* Dynamic Moving Rider Bicycle/Truck */}
              {order.status !== 'delivered' && order.status !== 'canceled' && (
                <motion.div
                  animate={{
                    // compute coordinates based on active index
                    x: order.status === 'pending_payment' 
                      ? -150 
                      : order.status === 'preparing' 
                        ? -110 
                        : [ -110, 110, -110 ], // in_transit patrols or animates across the path
                    y: order.status === 'in_transit' ? [0, -20, 0] : 0
                  }}
                  transition={{ 
                    repeat: order.status === 'in_transit' ? Infinity : 0, 
                    duration: 12, 
                    ease: 'easeInOut' 
                  }}
                  className="absolute z-20 flex flex-col items-center gap-1"
                >
                  <div className="w-8 h-8 rounded-full bg-brand-chili text-white flex items-center justify-center shadow-2xl ring-4 ring-white animate-bounce">
                    <Truck size={14} />
                  </div>
                  <span className="font-mono text-[8px] bg-brand-chili text-white font-extrabold uppercase px-1.5 py-0.5 rounded-md shadow-sm">Bibi Courier</span>
                </motion.div>
              )}

              {/* Pulsing Destination Node (Your Door) */}
              <div className="absolute right-[15%] top-[30%] -translate-y-1/2 flex flex-col items-center gap-1 z-10">
                <div className={`w-9 h-9 rounded-full flex items-center justify-center shadow-lg ring-4 ring-white transition-colors duration-500 ${
                  order.status === 'delivered' ? 'bg-emerald-600 text-white' : 'bg-[#C62828] text-white animate-pulse'
                }`}>
                  <MapPin size={16} />
                </div>
                <span className="font-mono text-[8px] bg-[#C62828] text-white font-extrabold uppercase px-1.5 py-0.5 rounded-md shadow-sm">Your Door</span>
              </div>
            </div>
          </div>

          {/* Rider details cards */}
          <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-3 w-full sm:w-auto">
              {/* Mock rider Avatar */}
              <div className="w-12 h-12 rounded-2xl overflow-hidden bg-orange-100 text-brand-chili flex items-center justify-center font-display font-extrabold text-lg shrink-0 border border-orange-200">
                BO
              </div>
              <div>
                <span className="block font-mono text-[9px] font-bold text-slate-400 uppercase tracking-wider">Couriers Dispatcher</span>
                <span className="block font-display font-black text-sm text-brand-charcoal mt-0.5">Babajide O. (Rider)</span>
                <span className="block font-sans text-[10px] text-slate-500 mt-0.5">Rating: ⭐ 4.9 (2,400+ orders completed)</span>
              </div>
            </div>

            {/* Direct communications icons */}
            <div className="flex gap-2.5 w-full sm:w-auto shrink-0 justify-end">
              <a
                href="tel:0800BIBIFOOD"
                className="flex-1 sm:flex-none p-3 rounded-2xl bg-slate-50 hover:bg-slate-100 border border-slate-200/50 transition-colors flex items-center justify-center gap-2 text-xs font-bold text-brand-charcoal cursor-pointer"
              >
                <Phone size={14} className="text-brand-chili" />
                <span>Call Rider</span>
              </a>
              <button
                onClick={() => setIsSupportOpen(true)}
                className="flex-1 sm:flex-none p-3 rounded-2xl bg-brand-charcoal hover:bg-black text-white transition-colors flex items-center justify-center gap-2 text-xs font-bold cursor-pointer"
              >
                <MessageSquare size={14} className="text-brand-saffron" />
                <span>Message Courier</span>
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Dynamic Vertical Timeline */}
        <div className="lg:col-span-5 bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex flex-col gap-6">
          <div>
            <h3 className="font-display font-black text-base text-brand-charcoal">
              Kitchen & Transit Timeline
            </h3>
            <p className="text-[11px] text-slate-400 mt-0.5">Operational checkpoints updating in live real-time.</p>
          </div>

          <div className="flex flex-col gap-6 pl-4 relative font-sans text-xs text-slate-500">
            {/* Timeline backbone line */}
            <div className="absolute top-2 left-1.5 bottom-8 w-0.5 bg-slate-100" />

            {stages.map((stage, sIdx) => {
              const isPast = activeIndex >= sIdx;
              const isCurrent = activeIndex === sIdx;
              const StageIcon = stage.icon;

              return (
                <div key={sIdx} className="flex gap-4 relative">
                  {/* Circle checkpoint */}
                  <div className={`w-3.5 h-3.5 rounded-full z-10 -ml-[19px] mt-1 transition-all duration-500 border-2 ${
                    isPast 
                      ? 'bg-brand-chili border-brand-chili shadow-[0_0_8px_rgba(198,40,40,0.4)]' 
                      : 'bg-white border-slate-200'
                  }`} />
                  
                  {/* Text details */}
                  <div className="flex-1">
                    <span className={`font-display font-black text-xs ${
                      isCurrent 
                        ? 'text-brand-chili font-extrabold' 
                        : isPast 
                          ? 'text-brand-charcoal font-semibold' 
                          : 'text-slate-400'
                    } flex items-center gap-1.5`}>
                      <StageIcon size={12} className={isCurrent ? 'animate-pulse' : ''} />
                      <span>{stage.label}</span>
                      {isCurrent && (
                        <span className="bg-brand-chili/5 text-brand-chili font-mono text-[8px] uppercase tracking-wide px-1.5 py-0.5 rounded animate-pulse">ACTIVE NOW</span>
                      )}
                    </span>
                    <p className={`text-[11px] mt-1 leading-normal ${
                      isPast ? 'text-slate-500' : 'text-slate-400'
                    }`}>
                      {stage.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Verification Code box */}
          <div className="p-4 bg-brand-olive/5 border border-brand-olive/5 rounded-2xl flex flex-col gap-1.5 text-xs text-slate-600">
            <span className="font-mono text-[9px] text-slate-400 uppercase tracking-wider font-bold">Patron Verification Check</span>
            <div className="flex justify-between items-center mt-1">
              <p className="text-slate-500">Rider delivery handover code:</p>
              <span className="font-mono text-base font-extrabold tracking-widest text-brand-chili bg-white px-3 py-1 rounded-lg border border-brand-chili/10 shadow-xs">
                {order.verificationPin || '5294'}
              </span>
            </div>
            <p className="text-[10px] text-slate-400 mt-1 italic">* Supply this code to Babajide upon arrival to securely unlock your thermal box.</p>
          </div>

          <button
            onClick={() => setIsSupportOpen(true)}
            className="w-full py-3.5 bg-slate-50 hover:bg-slate-100 border border-slate-200/50 rounded-2xl text-xs font-bold text-brand-charcoal flex items-center justify-center gap-2 transition-colors cursor-pointer"
          >
            <HelpCircle size={14} className="text-brand-chili" />
            <span>Need Customer Assistance?</span>
          </button>
        </div>
      </div>

      {/* Slide-over/Popup chat support assistant drawer */}
      <AnimatePresence>
        {isSupportOpen && (
          <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-50 flex justify-end">
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 220 }}
              className="bg-[#FAF8F5] w-full sm:w-[400px] h-full shadow-2xl flex flex-col justify-between"
            >
              {/* Support Header */}
              <div className="p-5 bg-brand-charcoal text-white flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                  <h3 className="font-display font-black text-sm tracking-wide">Bibi Support Dispatcher</h3>
                </div>
                <button
                  onClick={() => setIsSupportOpen(false)}
                  className="p-1 rounded hover:bg-white/10 text-slate-300 hover:text-white cursor-pointer"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Chat screen lines */}
              <div className="flex-1 overflow-y-auto p-5 flex flex-col gap-3.5">
                {chatHistory.map((chat, cIdx) => {
                  const isAgent = chat.sender === 'agent';
                  return (
                    <div
                      key={cIdx}
                      className={`flex ${isAgent ? 'justify-start' : 'justify-end'}`}
                    >
                      <div className={`p-3.5 rounded-2xl max-w-[80%] text-xs leading-normal ${
                        isAgent 
                          ? 'bg-white text-slate-700 rounded-tl-none border border-slate-200/50' 
                          : 'bg-brand-chili text-white rounded-tr-none'
                      }`}>
                        {chat.text}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Form input sender */}
              <form onSubmit={handleSendSupport} className="p-4 bg-white border-t border-slate-100 flex gap-2">
                <input
                  type="text"
                  placeholder="Type message..."
                  value={supportMessage}
                  onChange={(e) => setSupportMessage(e.target.value)}
                  className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-brand-chili"
                />
                <button
                  type="submit"
                  className="bg-brand-chili text-white p-2.5 rounded-xl hover:bg-[#A31F1F] transition-colors cursor-pointer"
                >
                  <Send size={14} />
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
