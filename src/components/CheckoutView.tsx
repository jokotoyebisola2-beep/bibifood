import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  MapPin, 
  Plus, 
  Edit2, 
  Trash2, 
  Check, 
  Clock, 
  Info, 
  ShieldCheck, 
  Copy, 
  Upload, 
  AlertTriangle, 
  WifiOff, 
  CreditCard, 
  Calendar, 
  ChefHat, 
  Sparkles, 
  ChevronRight, 
  Smartphone,
  CheckCircle,
  HelpCircle
} from 'lucide-react';
import { CartItem, Order, OrderStatus, DeliveryAddress } from '../types';

interface CheckoutViewProps {
  cartItems: CartItem[];
  userEmail: string;
  onSubmitOrder: (orderData: Partial<Order>) => void;
  onNavigate: (view: string) => void;
}

const INITIAL_ADDRESSES: DeliveryAddress[] = [
  {
    id: 'addr-1',
    label: 'Home',
    street: '14 Broad Street, Marina',
    city: 'Lagos',
    phone: '+234 803 123 4567',
    isDefault: true
  },
  {
    id: 'addr-2',
    label: 'Office',
    street: '82 Lekki Phase 1',
    city: 'Lagos',
    phone: '+234 809 987 6543',
    isDefault: false
  }
];

export default function CheckoutView({
  cartItems,
  userEmail,
  onSubmitOrder,
  onNavigate
}: CheckoutViewProps) {
  // Navigation & Cart protection
  useEffect(() => {
    if (cartItems.length === 0) {
      onNavigate('cart');
    }
  }, [cartItems, onNavigate]);

  // Core state
  const [addresses, setAddresses] = useState<DeliveryAddress[]>(() => {
    const saved = localStorage.getItem('bibi_addresses');
    return saved ? JSON.parse(saved) : INITIAL_ADDRESSES;
  });
  
  const [selectedAddressId, setSelectedAddressId] = useState<string>(() => {
    const defaultAddr = addresses.find(a => a.isDefault);
    return defaultAddr ? defaultAddr.id : (addresses[0]?.id || '');
  });

  // Delivery configuration
  const [deliveryMethod, setDeliveryMethod] = useState<'home_delivery' | 'pickup'>('home_delivery');
  const [deliveryTimeOption, setDeliveryTimeOption] = useState<'immediate' | 'scheduled'>('immediate');
  const [scheduledTime, setScheduledTime] = useState('Today, 12:30 PM - 1:00 PM');

  // Address Modal / Adding state
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [editingAddressId, setEditingAddressId] = useState<string | null>(null);
  const [addrLabel, setAddrLabel] = useState<'Home' | 'Office' | 'Other'>('Home');
  const [addrStreet, setAddrStreet] = useState('');
  const [addrCity, setAddrCity] = useState('Lagos');
  const [addrPhone, setAddrPhone] = useState('');

  // Order notes
  const [cookingInstructions, setCookingInstructions] = useState('');
  const [allergyNotes, setAllergyNotes] = useState('');
  const [deliveryInstructions, setDeliveryInstructions] = useState('');

  // Payment states
  const [paymentMethod, setPaymentMethod] = useState<'bank_transfer' | 'card' | 'ussd'>('bank_transfer');
  const [copiedAccount, setCopiedAccount] = useState(false);
  const [uploadedReceipt, setUploadedReceipt] = useState<File | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [validationError, setValidationError] = useState('');

  // Simulation Controls & Error Toggles
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [simulationState, setSimulationState] = useState<'normal' | 'failed_reconciliation' | 'connection_lost'>('normal');
  const [simulationMsg, setSimulationMsg] = useState('');

  // Pricing calculations
  const subtotal = cartItems.reduce((acc, item) => acc + item.meal.price * item.quantity, 0);
  const deliveryFee = deliveryMethod === 'home_delivery' ? 1500 : 0;
  const serviceFee = 250;
  const discount = 0; // standard (promo handled in cart, but we can display discount: 0)
  const total = subtotal + deliveryFee + serviceFee - discount;

  // Persist addresses
  const saveAddresses = (newAddresses: DeliveryAddress[]) => {
    setAddresses(newAddresses);
    localStorage.setItem('bibi_addresses', JSON.stringify(newAddresses));
  };

  // Add or Edit address submit
  const handleAddressSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!addrStreet.trim() || !addrPhone.trim()) return;

    if (editingAddressId) {
      const updated = addresses.map(addr => 
        addr.id === editingAddressId 
          ? { ...addr, label: addrLabel, street: addrStreet, city: addrCity, phone: addrPhone }
          : addr
      );
      saveAddresses(updated);
    } else {
      const newAddr: DeliveryAddress = {
        id: 'addr-' + Date.now(),
        label: addrLabel,
        street: addrStreet,
        city: addrCity,
        phone: addrPhone,
        isDefault: addresses.length === 0
      };
      saveAddresses([...addresses, newAddr]);
      setSelectedAddressId(newAddr.id);
    }

    // Reset Form
    setEditingAddressId(null);
    setAddrStreet('');
    setAddrPhone('');
    setIsAddressModalOpen(false);
  };

  // Open edit modal
  const handleEditAddress = (addr: DeliveryAddress) => {
    setEditingAddressId(addr.id);
    setAddrLabel(addr.label);
    setAddrStreet(addr.street);
    setAddrCity(addr.city);
    setAddrPhone(addr.phone);
    setIsAddressModalOpen(true);
  };

  // Delete address
  const handleDeleteAddress = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const filtered = addresses.filter(addr => addr.id !== id);
    saveAddresses(filtered);
    if (selectedAddressId === id && filtered.length > 0) {
      setSelectedAddressId(filtered[0].id);
    }
  };

  // Set default address
  const handleSetDefault = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = addresses.map(addr => ({
      ...addr,
      isDefault: addr.id === id
    }));
    saveAddresses(updated);
  };

  // Drag and drop events for file uploading
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setUploadedReceipt(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setUploadedReceipt(e.target.files[0]);
    }
  };

  // Submit checkout order
  const handlePlaceOrderSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError('');
    
    if (!termsAccepted) {
      setValidationError('Please verify the bank transfer checkmark and accept the Bibi Cooking Agreement & Hygiene Code.');
      return;
    }
    if (deliveryMethod === 'home_delivery' && !selectedAddressId) {
      setValidationError('Please add or select a delivery address.');
      return;
    }
    if (paymentMethod === 'bank_transfer' && !uploadedReceipt) {
      setValidationError('Please upload a screenshot of your bank transfer proof to complete order.');
      return;
    }

    setIsSubmitting(true);
    setSimulationMsg('Analyzing bank transfer transaction ledger...');

    // Simulation logic to exhibit rich error states
    setTimeout(() => {
      if (simulationState === 'connection_lost') {
        setIsSubmitting(false);
        setSimulationMsg('');
        return;
      }

      if (simulationState === 'failed_reconciliation') {
        setIsSubmitting(false);
        setSimulationMsg('Reconciliation error: Bank ledger reference not found. Please upload a valid bank transfer screenshot.');
        return;
      }

      // Success branch
      const activeAddressObj = addresses.find(a => a.id === selectedAddressId);
      const deliveryAddressString = deliveryMethod === 'pickup' 
        ? 'Central Kitchen: 14 Broad Street, Marina, Lagos'
        : activeAddressObj 
          ? `${activeAddressObj.street}, ${activeAddressObj.city} (Phone: ${activeAddressObj.phone})`
          : '14 Broad Street, Marina, Lagos';

      const orderData: Partial<Order> = {
        items: cartItems,
        deliveryOption: deliveryMethod,
        address: deliveryAddressString,
        cookingInstructions,
        allergyNotes,
        deliveryInstructions,
        scheduledTime: deliveryTimeOption === 'scheduled' ? scheduledTime : 'Immediate Delivery',
        paymentMethod: 'Bank Transfer (Verified)',
        subtotal,
        deliveryFee,
        serviceFee,
        totalAmount: total,
      };

      onSubmitOrder(orderData);
    }, 2500);
  };

  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-8">
      {/* Simulation Banner Selector */}
      <div className="mb-6 p-4 bg-slate-100/80 border border-slate-200/50 rounded-2xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <span className="font-mono text-[9px] bg-brand-charcoal text-white font-bold px-2 py-0.5 rounded uppercase">SIMULATOR CONTROLS</span>
          <p className="text-xs text-slate-500 mt-1 leading-normal">
            Bibi Food handles connections and validations with grace. Toggle simulation presets to audit error states:
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => { setSimulationState('normal'); setSimulationMsg(''); }}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              simulationState === 'normal' ? 'bg-emerald-600 text-white shadow-sm' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            ✓ Success Flow
          </button>
          <button
            onClick={() => { setSimulationState('failed_reconciliation'); setSimulationMsg(''); }}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              simulationState === 'failed_reconciliation' ? 'bg-amber-600 text-white shadow-sm' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            ⚠ Reconciliation Fail
          </button>
          <button
            onClick={() => { setSimulationState('connection_lost'); setSimulationMsg(''); }}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              simulationState === 'connection_lost' ? 'bg-rose-600 text-white shadow-sm' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            ⚡ Connection Lost
          </button>
        </div>
      </div>

      {/* Connection Lost Screen Simulation Overlay */}
      <AnimatePresence>
        {simulationState === 'connection_lost' && isSubmitting && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-900/90 backdrop-blur-md z-50 flex items-center justify-center p-4 text-center select-none"
          >
            <motion.div
              initial={{ scale: 0.9, y: 10 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 10 }}
              className="bg-white max-w-md w-full p-8 rounded-3xl shadow-2xl border border-slate-100 flex flex-col items-center gap-5"
            >
              <div className="w-16 h-16 rounded-full bg-rose-50 border border-rose-100 text-rose-600 flex items-center justify-center animate-bounce">
                <WifiOff size={32} />
              </div>
              <h2 className="font-display font-black text-2xl text-brand-charcoal">Gateway Connection Lost</h2>
              <p className="text-sm text-slate-500 leading-relaxed">
                We are detecting high latency or standard packet dropout on the active bank verification nodes. Your upload is secured locally.
              </p>
              <div className="flex gap-3 w-full mt-2">
                <button
                  onClick={() => {
                    setIsSubmitting(false);
                    setSimulationState('normal');
                  }}
                  className="flex-1 bg-brand-charcoal text-white hover:bg-black font-display font-bold py-3 px-5 rounded-2xl text-xs transition-colors cursor-pointer"
                >
                  Retry Connection
                </button>
                <button
                  onClick={() => setIsSubmitting(false)}
                  className="flex-1 bg-slate-50 border border-slate-200 text-slate-600 hover:bg-slate-100 font-display font-bold py-3 px-5 rounded-2xl text-xs transition-colors cursor-pointer"
                >
                  Go Back
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex items-center gap-2 mb-2 font-mono text-[10px] text-slate-400 font-bold uppercase tracking-widest">
        <span>Gourmet Ordering Flow</span>
        <ChevronRight size={10} />
        <span className="text-slate-500 cursor-pointer hover:text-brand-charcoal" onClick={() => onNavigate('cart')}>1. Review Basket</span>
        <ChevronRight size={10} />
        <span className="text-brand-chili">2. Complete Checkout</span>
      </div>

      <h1 className="font-display font-black text-2xl sm:text-3xl text-brand-charcoal mb-8 pb-4 border-b border-slate-200/60">
        Secure Checkout Details
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Form side */}
        <form onSubmit={handlePlaceOrderSubmit} className="lg:col-span-7 flex flex-col gap-6">
          
          {/* Section 1: Delivery Options (Switch Home vs Pickup) */}
          <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex flex-col gap-4">
            <h3 className="font-display font-bold text-sm text-brand-charcoal flex items-center gap-2">
              <span className="w-5 h-5 bg-brand-chili/10 text-brand-chili rounded-full flex items-center justify-center font-mono text-xs font-bold">1</span>
              <span>Delivery Method</span>
            </h3>

            <div className="bg-slate-100 p-1.5 rounded-2xl flex gap-1">
              <button
                type="button"
                onClick={() => setDeliveryMethod('home_delivery')}
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  deliveryMethod === 'home_delivery'
                    ? 'bg-white text-brand-charcoal shadow-sm'
                    : 'text-slate-500 hover:text-brand-charcoal'
                }`}
              >
                <MapPin size={14} className={deliveryMethod === 'home_delivery' ? 'text-brand-chili' : ''} />
                <span>Home Delivery</span>
              </button>
              <button
                type="button"
                onClick={() => setDeliveryMethod('pickup')}
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  deliveryMethod === 'pickup'
                    ? 'bg-white text-brand-charcoal shadow-sm'
                    : 'text-slate-500 hover:text-brand-charcoal'
                }`}
              >
                <ChefHat size={14} className={deliveryMethod === 'pickup' ? 'text-brand-chili' : ''} />
                <span>Pick Up from Kitchen</span>
              </button>
            </div>

            {deliveryMethod === 'pickup' && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="p-4 bg-amber-50/50 border border-amber-100 rounded-2xl text-xs text-slate-600 mt-2 flex gap-3"
              >
                <Info size={16} className="text-brand-saffron shrink-0" />
                <div>
                  <span className="font-bold text-brand-charcoal">Pickup Coordinates:</span>
                  <p className="mt-0.5">Bibi Food Central Kitchen Hub, 14 Broad Street, Marina, Lagos.</p>
                  <p className="text-[11px] text-slate-400 mt-1 italic">* Bypasses delivery fees! Your hot thermal box will be ready inside locker 04.</p>
                </div>
              </motion.div>
            )}
          </div>

          {/* Section 2: Address Management (Show only if home delivery) */}
          {deliveryMethod === 'home_delivery' && (
            <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex flex-col gap-4">
              <div className="flex justify-between items-center pb-2 border-b border-slate-50">
                <h3 className="font-display font-bold text-sm text-brand-charcoal flex items-center gap-2">
                  <span className="w-5 h-5 bg-brand-chili/10 text-brand-chili rounded-full flex items-center justify-center font-mono text-xs font-bold">2</span>
                  <span>Primary Address Directory</span>
                </h3>
                <button
                  type="button"
                  onClick={() => { setEditingAddressId(null); setIsAddressModalOpen(true); }}
                  className="text-brand-chili hover:text-[#A31F1F] font-sans font-bold text-xs flex items-center gap-1 cursor-pointer"
                >
                  <Plus size={13} className="stroke-[3]" />
                  <span>Add New</span>
                </button>
              </div>

              {addresses.length === 0 ? (
                <div className="text-center py-6 text-xs text-slate-400 italic">
                  No saved addresses found. Add an address to continue.
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {addresses.map((addr) => {
                    const isSelected = selectedAddressId === addr.id;
                    return (
                      <div
                        key={addr.id}
                        onClick={() => setSelectedAddressId(addr.id)}
                        className={`p-4 rounded-2xl border-2 cursor-pointer transition-all flex flex-col justify-between h-32 relative ${
                          isSelected
                            ? 'border-brand-saffron bg-brand-saffron/5'
                            : 'border-slate-100 hover:border-slate-200'
                        }`}
                      >
                        <div>
                          <div className="flex items-center justify-between">
                            <span className="font-display font-extrabold text-xs text-brand-charcoal flex items-center gap-1.5">
                              {addr.label === 'Home' && '🏠 Home'}
                              {addr.label === 'Office' && '🏢 Office'}
                              {addr.label === 'Other' && '📍 Other'}
                              {addr.isDefault && (
                                <span className="bg-brand-basil/15 text-brand-basil text-[9px] font-mono px-2 py-0.5 rounded-full font-bold">DEFAULT</span>
                              )}
                            </span>
                            
                            {/* Actions overlay */}
                            <div className="flex items-center gap-1.5">
                              <button
                                type="button"
                                onClick={(e) => { e.stopPropagation(); handleEditAddress(addr); }}
                                className="p-1 rounded text-slate-400 hover:text-brand-charcoal cursor-pointer"
                                title="Edit"
                              >
                                <Edit2 size={11} />
                              </button>
                              <button
                                type="button"
                                onClick={(e) => handleDeleteAddress(addr.id, e)}
                                className="p-1 rounded text-slate-400 hover:text-rose-600 cursor-pointer"
                                title="Delete"
                              >
                                <Trash2 size={11} />
                              </button>
                            </div>
                          </div>
                          
                          <p className="font-sans text-[11px] text-slate-500 mt-2 leading-relaxed line-clamp-2">
                            {addr.street}, {addr.city}
                          </p>
                        </div>

                        <div className="flex justify-between items-center pt-2 mt-2 border-t border-slate-50">
                          <span className="text-[10px] font-mono text-slate-400">{addr.phone}</span>
                          {!addr.isDefault && (
                            <button
                              type="button"
                              onClick={(e) => handleSetDefault(addr.id, e)}
                              className="text-[9px] font-sans font-bold text-slate-400 hover:text-brand-chili cursor-pointer"
                            >
                              Set Default
                            </button>
                          )}
                        </div>

                        {isSelected && (
                          <div className="absolute top-1 right-1 translate-x-1/3 -translate-y-1/3 bg-brand-saffron text-brand-olive w-5 h-5 rounded-full flex items-center justify-center border-2 border-white shadow-sm z-10">
                            <Check size={11} className="stroke-[3]" />
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* Section 3: Delivery Timing */}
          <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex flex-col gap-4">
            <h3 className="font-display font-bold text-sm text-brand-charcoal flex items-center gap-2">
              <span className="w-5 h-5 bg-brand-chili/10 text-brand-chili rounded-full flex items-center justify-center font-mono text-xs font-bold">
                {deliveryMethod === 'home_delivery' ? '3' : '2'}
              </span>
              <span>Delivery Timeframe</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div
                onClick={() => setDeliveryTimeOption('immediate')}
                className={`p-4 rounded-2xl border-2 cursor-pointer transition-all flex items-start gap-3 ${
                  deliveryTimeOption === 'immediate'
                    ? 'border-brand-saffron bg-brand-saffron/5'
                    : 'border-slate-100 hover:bg-slate-50'
                }`}
              >
                <div className="w-8 h-8 rounded-full bg-[#FAF8F5] flex items-center justify-center text-slate-400 border border-slate-100 shrink-0 mt-0.5">
                  <Clock size={16} />
                </div>
                <div>
                  <span className="block font-display font-bold text-xs text-brand-charcoal">Deliver Immediately</span>
                  <span className="block text-[10px] text-slate-400 mt-0.5 leading-normal">
                    Ready for courier dispatch in approx. 25-35 mins.
                  </span>
                </div>
              </div>

              <div
                onClick={() => setDeliveryTimeOption('scheduled')}
                className={`p-4 rounded-2xl border-2 cursor-pointer transition-all flex items-start gap-3 ${
                  deliveryTimeOption === 'scheduled'
                    ? 'border-brand-saffron bg-brand-saffron/5'
                    : 'border-slate-100 hover:bg-slate-50'
                }`}
              >
                <div className="w-8 h-8 rounded-full bg-[#FAF8F5] flex items-center justify-center text-slate-400 border border-slate-100 shrink-0 mt-0.5">
                  <Calendar size={16} />
                </div>
                <div>
                  <span className="block font-display font-bold text-xs text-brand-charcoal">Schedule Delivery</span>
                  <span className="block text-[10px] text-slate-400 mt-0.5 leading-normal">
                    Pre-arrange delicious timing for guest arrivals.
                  </span>
                </div>
              </div>
            </div>

            {deliveryTimeOption === 'scheduled' && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="flex flex-col gap-2 mt-2"
              >
                <label className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400">
                  Select Ideal Scheduled Window:
                </label>
                <select
                  value={scheduledTime}
                  onChange={(e) => setScheduledTime(e.target.value)}
                  className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs font-sans text-brand-charcoal focus:outline-none focus:border-brand-chili"
                >
                  <option value="Today, 12:30 PM - 1:00 PM">Today, 12:30 PM - 1:00 PM</option>
                  <option value="Today, 1:30 PM - 2:00 PM">Today, 1:30 PM - 2:00 PM</option>
                  <option value="Today, 3:00 PM - 3:30 PM">Today, 3:00 PM - 3:30 PM</option>
                  <option value="Today, 6:00 PM - 6:30 PM">Today, 6:00 PM - 6:30 PM</option>
                  <option value="Tomorrow, 12:00 PM - 12:30 PM">Tomorrow, 12:00 PM - 12:30 PM</option>
                </select>
              </motion.div>
            )}
          </div>

          {/* Section 4: Special Cooking & Delivery Notes */}
          <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex flex-col gap-4">
            <h3 className="font-display font-bold text-sm text-brand-charcoal flex items-center gap-2">
              <span className="w-5 h-5 bg-brand-chili/10 text-brand-chili rounded-full flex items-center justify-center font-mono text-xs font-bold">
                {deliveryMethod === 'home_delivery' ? '4' : '3'}
              </span>
              <span>Gourmet & Courier Instructions</span>
            </h3>

            <div className="flex flex-col gap-3.5">
              <div>
                <label className="block text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wide mb-1">
                  Special Cooking Instructions
                </label>
                <textarea
                  placeholder="e.g. Please wrap the grilled plantains extra tight, make the rice smoking hot."
                  value={cookingInstructions}
                  onChange={(e) => setCookingInstructions(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs font-sans focus:outline-none focus:border-brand-chili h-16 resize-none"
                />
              </div>

              <div>
                <label className="block text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wide mb-1">
                  Allergy Notes
                </label>
                <textarea
                  placeholder="e.g. Tree nut allergy, absolute zero peanut oils, shellfish sensitivies."
                  value={allergyNotes}
                  onChange={(e) => setAllergyNotes(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs font-sans focus:outline-none focus:border-brand-chili h-16 resize-none"
                />
              </div>

              {deliveryMethod === 'home_delivery' && (
                <div>
                  <label className="block text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wide mb-1">
                    Delivery Instructions
                  </label>
                  <textarea
                    placeholder="e.g. Ring phone upon arrival, pass through security gate, drop with receptionist."
                    value={deliveryInstructions}
                    onChange={(e) => setDeliveryInstructions(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs font-sans focus:outline-none focus:border-brand-chili h-16 resize-none"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Section 5: Secure Settlement details */}
          <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex flex-col gap-4">
            <h3 className="font-display font-bold text-sm text-brand-charcoal flex items-center gap-2">
              <span className="w-5 h-5 bg-brand-chili/10 text-brand-chili rounded-full flex items-center justify-center font-mono text-xs font-bold">
                {deliveryMethod === 'home_delivery' ? '5' : '4'}
              </span>
              <span>Secure Settlement Gateway</span>
            </h3>

            {/* Premium Method Switcher Tabs (Fulfills multi payment options readiness display) */}
            <div className="grid grid-cols-3 gap-2.5">
              <button
                type="button"
                onClick={() => setPaymentMethod('bank_transfer')}
                className={`p-3 rounded-2xl border flex flex-col items-center gap-1.5 transition-all text-center cursor-pointer ${
                  paymentMethod === 'bank_transfer'
                    ? 'border-brand-chili bg-brand-chili/5 text-brand-chili font-bold'
                    : 'border-slate-100 text-slate-400 hover:bg-slate-50'
                }`}
              >
                <Smartphone size={16} />
                <span className="text-[10px] font-sans font-bold leading-none">Bank Transfer</span>
              </button>

              <button
                type="button"
                disabled
                className="p-3 rounded-2xl border border-dashed border-slate-200 text-slate-300 flex flex-col items-center gap-1.5 text-center relative cursor-not-allowed group"
              >
                <CreditCard size={16} />
                <span className="text-[10px] font-sans font-bold leading-none">Debit Card</span>
                <span className="absolute bottom-1 text-[7px] font-mono font-bold text-brand-chili uppercase bg-brand-chili/5 px-1 py-0.5 rounded scale-75">FUTURE READY</span>
              </button>

              <button
                type="button"
                disabled
                className="p-3 rounded-2xl border border-dashed border-slate-200 text-slate-300 flex flex-col items-center gap-1.5 text-center relative cursor-not-allowed group"
              >
                <Sparkles size={16} />
                <span className="text-[10px] font-sans font-bold leading-none">USSD Codes</span>
                <span className="absolute bottom-1 text-[7px] font-mono font-bold text-brand-chili uppercase bg-brand-chili/5 px-1 py-0.5 rounded scale-75">FUTURE READY</span>
              </button>
            </div>

            {/* Bank Transfer Coordinates box */}
            <div className="p-5 bg-slate-900 text-white rounded-3xl relative overflow-hidden flex flex-col gap-3">
              <div className="absolute -right-6 -bottom-6 text-white/5 pointer-events-none">
                <ShieldCheck size={140} />
              </div>

              <div className="flex justify-between items-center pb-2 border-b border-white/10 text-xs">
                <span className="text-slate-400 font-sans">Receiving Bank</span>
                <span className="font-display font-bold text-brand-saffron">Bibi Food Trust Bank</span>
              </div>

              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-400 font-sans">Account Beneficiary</span>
                <span className="font-sans font-semibold">Bibi Food Technologies Ltd.</span>
              </div>

              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-400 font-sans">Account Number</span>
                <div className="flex items-center gap-2 font-mono font-black text-sm text-brand-saffron">
                  <span>0042938104</span>
                  <button
                    type="button"
                    onClick={() => {
                      navigator.clipboard.writeText('0042938104');
                      setCopiedAccount(true);
                      setTimeout(() => setCopiedAccount(false), 2000);
                    }}
                    className="text-white hover:text-brand-saffron transition-colors cursor-pointer"
                  >
                    {copiedAccount ? <span className="text-[9px] font-sans bg-white/20 px-1.5 py-0.5 rounded text-white">Copied!</span> : <Copy size={12} />}
                  </button>
                </div>
              </div>
            </div>

            {/* Screenshot proof of payment Uploader */}
            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400">
                Capture & Upload Transfer receipt screenshot:
              </label>
              
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={`border-2 border-dashed rounded-2xl p-6 text-center transition-all relative ${
                  isDragOver 
                    ? 'border-brand-chili bg-brand-chili/5' 
                    : uploadedReceipt 
                      ? 'border-emerald-500 bg-emerald-50/10' 
                      : 'border-slate-200 hover:border-brand-chili bg-slate-50/50'
                }`}
              >
                <input
                  type="file"
                  accept="image/*,application/pdf"
                  onChange={handleFileChange}
                  className="absolute inset-0 opacity-0 cursor-pointer z-10"
                />
                <div className="flex flex-col items-center gap-2">
                  <Upload size={24} className={uploadedReceipt ? 'text-emerald-500' : 'text-slate-400'} />
                  {uploadedReceipt ? (
                    <div className="flex flex-col gap-0.5">
                      <span className="font-sans text-xs font-bold text-emerald-600 truncate max-w-xs">{uploadedReceipt.name}</span>
                      <span className="font-mono text-[9px] text-slate-400">{(uploadedReceipt.size / 1024 / 1024).toFixed(2)} MB • Verification ready</span>
                    </div>
                  ) : (
                    <div className="flex flex-col gap-0.5">
                      <span className="font-sans text-xs font-semibold text-slate-600">Drag receipt screenshot here or Click to browse</span>
                      <span className="font-sans text-[10px] text-slate-400">PNG, JPG or PDF under 5MB</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </form>

        {/* Right side order summary breakdown */}
        <div className="lg:col-span-5 lg:sticky lg:top-28 flex flex-col gap-6">
          <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex flex-col gap-5">
            <h3 className="font-display font-bold text-base text-brand-charcoal pb-3 border-b border-slate-100">
              Basket Checkout Review
            </h3>

            {/* List preview */}
            <div className="flex flex-col gap-3 max-h-40 overflow-y-auto">
              {cartItems.map((item) => (
                <div key={item.meal.id} className="flex justify-between items-start text-xs font-sans">
                  <div>
                    <span className="font-semibold text-brand-charcoal">{item.meal.name}</span>
                    <span className="font-mono text-[10px] text-slate-400 ml-1.5">x{item.quantity}</span>
                  </div>
                  <span className="font-mono text-slate-600">₦{(item.meal.price * item.quantity).toLocaleString()}</span>
                </div>
              ))}
            </div>

            {/* Price lines */}
            <div className="pt-4 border-t border-slate-100 flex flex-col gap-2.5 text-xs text-slate-500 font-sans">
              <div className="flex justify-between">
                <span>Cooking Subtotal</span>
                <span className="font-mono text-brand-charcoal">₦{subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>Thermal Delivery</span>
                <span className="font-mono text-brand-charcoal">{deliveryFee > 0 ? `₦${deliveryFee.toLocaleString()}` : 'FREE (Pickup)'}</span>
              </div>
              <div className="flex justify-between">
                <span>Quality Assurance Fee</span>
                <span className="font-mono text-brand-charcoal">₦{serviceFee.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm font-bold text-brand-charcoal pt-3 border-t border-slate-100">
                <span>Total Settlement Amount</span>
                <span className="font-mono text-base font-black text-brand-chili">₦{total.toLocaleString()}</span>
              </div>
            </div>

            {/* Customer Details info block */}
            <div className="p-3.5 bg-slate-50 rounded-2xl flex flex-col gap-1 text-[11px] text-slate-500">
              <span className="font-mono font-bold text-[9px] uppercase text-slate-400">Recipient Information</span>
              <span className="text-brand-charcoal font-semibold mt-0.5">Account Email: {userEmail}</span>
              {deliveryMethod === 'home_delivery' && selectedAddressId && (
                <span className="truncate mt-0.5 text-slate-400">
                  Address: {addresses.find(a => a.id === selectedAddressId)?.street}
                </span>
              )}
              <span className="text-[10px] text-slate-400">Timing: {deliveryTimeOption === 'scheduled' ? `Scheduled (${scheduledTime})` : 'Immediate Delivery'}</span>
            </div>

            {/* Verification Status (Fulfills reference/verification placeholders) */}
            <div className="p-3 bg-brand-olive/5 border border-brand-olive/5 rounded-2xl flex flex-col gap-1 text-[10px] text-slate-500 leading-normal">
              <div className="flex items-center gap-1 text-brand-basil font-bold">
                <CheckCircle size={12} />
                <span>Verification Reference Status</span>
              </div>
              <span className="font-mono text-slate-400 text-[9px] block">Reference ID: <b className="text-brand-charcoal uppercase">BB-{Math.floor(100000 + Math.random() * 900000)}</b></span>
              <span className="text-[10px] text-amber-600 font-bold">
                {uploadedReceipt ? 'Receipt Captured - Ready for verification' : 'Awaiting Proof of Bank Transfer'}
              </span>
            </div>

            {/* Terms confirmation */}
            <div className="flex items-start gap-2.5 text-slate-500 text-[11px] leading-relaxed select-none">
              <input
                type="checkbox"
                id="terms"
                checked={termsAccepted}
                onChange={(e) => setTermsAccepted(e.target.checked)}
                className="mt-0.5 h-3.5 w-3.5 accent-brand-chili cursor-pointer shrink-0"
              />
              <label htmlFor="terms" className="cursor-pointer">
                I verify that I have made the bank transfer matching the Settlement Total above, and accept the <span className="text-brand-chili font-semibold hover:underline">Bibi Food Cooking Agreement & Hygiene Code</span>.
              </label>
            </div>

            {/* Submitting Status Banner */}
            {isSubmitting && (
              <div className="p-3 bg-brand-chili/5 text-brand-chili border border-brand-chili/10 rounded-xl text-xs font-mono text-center animate-pulse">
                {simulationMsg}
              </div>
            )}

            {/* Validation Error Banner */}
            {validationError && (
              <div className="p-3 bg-brand-error/5 text-brand-error border border-brand-error/15 rounded-xl text-xs font-semibold flex items-center gap-2 text-left">
                <AlertTriangle size={14} className="shrink-0 text-brand-error" />
                <span>{validationError}</span>
              </div>
            )}

            {/* Place Order Primary Trigger */}
            <button
              type="button"
              onClick={handlePlaceOrderSubmit}
              disabled={isSubmitting}
              className="w-full bg-brand-chili text-white hover:bg-[#A31F1F] disabled:bg-slate-200 disabled:text-slate-400 py-4 rounded-2xl font-display font-bold text-sm tracking-wide transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <span className="font-mono text-xs animate-pulse uppercase">TRANSACTING CODES...</span>
              ) : (
                <>
                  <ShieldCheck size={16} />
                  <span>Settle Proof & Place Order</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Address management Modal */}
      <AnimatePresence>
        {isAddressModalOpen && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white max-w-md w-full p-6 rounded-3xl shadow-xl border border-slate-100 flex flex-col gap-4"
            >
              <div className="flex justify-between items-center pb-2 border-b border-slate-100">
                <h3 className="font-display font-bold text-sm text-brand-charcoal">
                  {editingAddressId ? 'Edit saved address' : 'Add new saved address'}
                </h3>
                <button
                  onClick={() => setIsAddressModalOpen(false)}
                  className="p-1 rounded-md text-slate-400 hover:bg-slate-50 hover:text-brand-charcoal cursor-pointer text-xs font-bold"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleAddressSubmit} className="flex flex-col gap-4">
                {/* Labels Choice */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400">Address Category Tag</label>
                  <div className="flex gap-2">
                    {(['Home', 'Office', 'Other'] as const).map((label) => (
                      <button
                        key={label}
                        type="button"
                        onClick={() => setAddrLabel(label)}
                        className={`flex-1 py-2 rounded-xl text-xs font-bold border transition-colors cursor-pointer ${
                          addrLabel === label
                            ? 'bg-brand-chili text-white border-brand-chili'
                            : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                        }`}
                      >
                        {label === 'Home' && '🏠 Home'}
                        {label === 'Office' && '🏢 Office'}
                        {label === 'Other' && '📍 Other'}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Street */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400">Street Address</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 14 Broad Street, Marina"
                    value={addrStreet}
                    onChange={(e) => setAddrStreet(e.target.value)}
                    className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs font-sans text-brand-charcoal focus:outline-none focus:border-brand-chili"
                  />
                </div>

                {/* City */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400">City</label>
                  <input
                    type="text"
                    required
                    disabled
                    value={addrCity}
                    className="bg-slate-100 border border-slate-200 rounded-xl px-3 py-2.5 text-xs font-sans text-slate-400 cursor-not-allowed"
                  />
                </div>

                {/* Phone */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400">Contact Phone Number</label>
                  <input
                    type="tel"
                    required
                    placeholder="e.g. +234 803 123 4567"
                    value={addrPhone}
                    onChange={(e) => setAddrPhone(e.target.value)}
                    className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs font-sans text-brand-charcoal focus:outline-none focus:border-brand-chili"
                  />
                </div>

                <div className="flex gap-2 pt-2 mt-2">
                  <button
                    type="button"
                    onClick={() => setIsAddressModalOpen(false)}
                    className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-600 font-display font-bold py-3 px-4 rounded-xl text-xs transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 bg-brand-chili text-white hover:bg-[#A31F1F] font-display font-bold py-3 px-4 rounded-xl text-xs transition-colors cursor-pointer shadow-sm"
                  >
                    Save Address
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
