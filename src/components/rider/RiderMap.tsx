import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { MapPin, Navigation, Compass, Truck, ChefHat, User, ShieldCheck, Zap, Maximize2, AlertCircle } from 'lucide-react';

interface RiderMapProps {
  riderLocation?: { lat: number; lng: number; address?: string };
  pickupLocation?: { name: string; address: string; lat?: number; lng?: number };
  dropoffLocation?: { name: string; address: string; lat?: number; lng?: number };
  stage?: 'heading_to_restaurant' | 'picked_up' | 'heading_to_customer' | 'delivered' | string;
  onSimulateMove?: () => void;
  className?: string;
}

export default function RiderMap({
  riderLocation = { lat: 6.4541, lng: 3.4246, address: 'Victoria Island, Lagos' },
  pickupLocation = { name: 'Bibi Central Kitchen', address: '18 Ahmadu Bello Way, Victoria Island' },
  dropoffLocation = { name: 'Customer Address', address: '14 Admiralty Way, Lekki Phase 1' },
  stage = 'heading_to_restaurant',
  className = ''
}: RiderMapProps) {
  const [isSimulating, setIsSimulating] = useState(false);
  const [progress, setProgress] = useState(35); // percentage along path
  const [currentSpeed, setCurrentSpeed] = useState(28); // km/h
  const [etaMinutes, setEtaMinutes] = useState(12);

  useEffect(() => {
    let interval: any = null;
    if (isSimulating) {
      interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 95) {
            setIsSimulating(false);
            return 95;
          }
          return prev + 3;
        });
        setCurrentSpeed(Math.floor(24 + Math.random() * 12));
        setEtaMinutes((prev) => (prev > 1 ? prev - 0.2 : 1));
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isSimulating]);

  // Determine stage visual highlights
  const isHeadingToPick = stage === 'accepted' || stage === 'heading_to_restaurant';
  const isHeadingToDrop = stage === 'picked_up' || stage === 'heading_to_customer';

  return (
    <div className={`relative bg-[#0F1713] rounded-3xl overflow-hidden border border-emerald-950/60 shadow-xl font-sans text-white select-none ${className}`}>
      
      {/* Map Control Overlay Banner */}
      <div className="absolute top-4 left-4 right-4 z-20 flex flex-wrap items-center justify-between gap-2 pointer-events-none">
        
        {/* GPS Live Signal Badge */}
        <div className="flex items-center gap-2 bg-[#131F19]/90 backdrop-blur-md px-3 py-1.5 rounded-full border border-emerald-500/20 shadow-lg pointer-events-auto">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
          <span className="font-mono text-[10px] font-bold tracking-wider text-emerald-300 uppercase">GPS Live High Precision</span>
          <span className="text-slate-500 text-[10px]">|</span>
          <span className="font-mono text-[10px] text-amber-300 font-semibold">{Math.round(currentSpeed)} km/h</span>
        </div>

        {/* ETA badge */}
        <div className="flex items-center gap-1.5 bg-amber-500 text-brand-charcoal px-3 py-1.5 rounded-full font-mono text-[11px] font-black shadow-lg pointer-events-auto">
          <Navigation size={13} className="text-brand-charcoal animate-pulse" />
          <span>ETA: {Math.ceil(etaMinutes)} MINS</span>
        </div>

      </div>

      {/* Interactive Vector Canvas */}
      <div className="w-full aspect-[16/9] sm:aspect-[21/9] min-h-[260px] bg-[#0E1612] relative overflow-hidden flex items-center justify-center">
        
        {/* Dark Grid Lines Background */}
        <div className="absolute inset-0 opacity-15 bg-[linear-gradient(to_right,#1b2e23_1px,transparent_1px),linear-gradient(to_bottom,#1b2e23_1px,transparent_1px)] bg-[size:32px_32px]" />
        
        {/* Lagos Lagoon & Coastline SVG Shape */}
        <svg className="absolute inset-0 w-full h-full text-slate-800/40" fill="none">
          <path d="M0 120 C100 140, 200 80, 350 110 C500 140, 650 90, 800 120 L800 300 L0 300 Z" fill="#09100D" />
          
          {/* Arterial Road Highway Lines */}
          <path d="M40 180 Q160 220 320 120 T600 140 T780 90" stroke="#1C3026" strokeWidth="12" strokeLinecap="round" />
          <path d="M40 180 Q160 220 320 120 T600 140 T780 90" stroke="#F4B400" strokeWidth="2" strokeDasharray="6 6" className="opacity-60" />

          {/* Connective Street Grid */}
          <path d="M180 180 L220 70 M320 120 L380 230 M520 150 L500 60" stroke="#182A21" strokeWidth="5" />

          {/* Active Navigation Path Line */}
          <path
            d="M 120 190 Q 240 210 360 130 T 640 130"
            stroke={isHeadingToPick ? '#F4B400' : '#10B981'}
            strokeWidth="4"
            strokeDasharray="8 6"
            strokeLinecap="round"
          />
        </svg>

        {/* Pickup Restaurant Node */}
        <div className="absolute left-[15%] top-[65%] -translate-y-1/2 flex flex-col items-center gap-1 z-10">
          <div className={`w-10 h-10 rounded-2xl flex items-center justify-center shadow-xl border transition-all ${
            isHeadingToPick
              ? 'bg-amber-400 text-brand-charcoal border-amber-300 ring-4 ring-amber-400/20 animate-pulse'
              : 'bg-[#182A21] text-emerald-400 border-emerald-800/50'
          }`}>
            <ChefHat size={18} />
          </div>
          <div className="bg-[#121E18]/90 backdrop-blur-md px-2 py-0.5 rounded border border-slate-700/60 font-mono text-[9px] font-bold uppercase tracking-wider text-amber-200">
            {pickupLocation.name}
          </div>
        </div>

        {/* Dynamic Rider Marker along path */}
        <motion.div
          animate={{
            x: `${(progress - 50) * 4}px`,
            y: `${Math.sin(progress / 10) * 15}px`
          }}
          transition={{ type: 'spring', stiffness: 100 }}
          className="absolute z-30 flex flex-col items-center gap-1.5"
        >
          <div className="relative">
            <div className="absolute -inset-2 bg-emerald-500/30 rounded-full blur-sm animate-ping" />
            <div className="w-11 h-11 rounded-2xl bg-emerald-500 text-slate-950 flex items-center justify-center shadow-2xl border-2 border-emerald-300 ring-4 ring-emerald-500/20 font-black">
              <Truck size={20} className="text-slate-950" />
            </div>
          </div>
          <div className="bg-emerald-950/90 text-emerald-300 border border-emerald-500/40 px-2 py-0.5 rounded font-mono text-[9px] font-extrabold uppercase tracking-widest shadow-lg flex items-center gap-1">
            <Zap size={10} className="text-amber-400 fill-amber-400" />
            <span>Rider Active</span>
          </div>
        </motion.div>

        {/* Customer Drop-off Node */}
        <div className="absolute right-[15%] top-[35%] -translate-y-1/2 flex flex-col items-center gap-1 z-10">
          <div className={`w-10 h-10 rounded-2xl flex items-center justify-center shadow-xl border transition-all ${
            isHeadingToDrop
              ? 'bg-emerald-500 text-slate-950 border-emerald-300 ring-4 ring-emerald-500/20 animate-bounce'
              : 'bg-[#182A21] text-slate-400 border-slate-800'
          }`}>
            <MapPin size={18} />
          </div>
          <div className="bg-[#121E18]/90 backdrop-blur-md px-2 py-0.5 rounded border border-slate-700/60 font-mono text-[9px] font-bold uppercase tracking-wider text-emerald-300">
            Customer Dropoff
          </div>
        </div>

      </div>

      {/* Navigation Footer Toolbar */}
      <div className="p-3 bg-[#121E18] border-t border-emerald-900/40 flex flex-wrap items-center justify-between gap-3 text-xs">
        
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsSimulating(!isSimulating)}
            className={`px-3.5 py-1.5 rounded-xl font-display font-bold text-[11px] flex items-center gap-1.5 transition-all cursor-pointer ${
              isSimulating
                ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40 hover:bg-rose-500/30'
                : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 hover:bg-emerald-500/30'
            }`}
          >
            <Compass size={14} className={isSimulating ? 'animate-spin' : ''} />
            <span>{isSimulating ? 'Pause Route Simulation' : 'Start Turn-by-Turn Demo'}</span>
          </button>

          <span className="font-mono text-[11px] text-slate-400 hidden sm:inline">
            Target: <span className="text-white font-semibold">{isHeadingToPick ? pickupLocation.address : dropoffLocation.address}</span>
          </span>
        </div>

        <div className="flex items-center gap-2 font-mono text-[10px] text-emerald-400/80">
          <ShieldCheck size={13} className="text-emerald-400" />
          <span>Real Maps API Adapter Ready</span>
        </div>

      </div>

    </div>
  );
}
