import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Truck, 
  UserCheck, 
  Lock, 
  Mail, 
  Phone, 
  ShieldCheck, 
  ArrowRight, 
  FileText, 
  CheckCircle2, 
  AlertCircle, 
  Sparkles, 
  KeyRound,
  X,
  CreditCard,
  MapPin,
  ChevronRight
} from 'lucide-react';
import BibiLogo from '../BibiLogo';
import { RiderProfile } from '../../types';

interface RiderAuthProps {
  onLoginSuccess: (rider: RiderProfile) => void;
  onNavigateCustomerHome?: () => void;
}

export default function RiderAuth({ onLoginSuccess, onNavigateCustomerHome }: RiderAuthProps) {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [forgotModalOpen, setForgotModalOpen] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotSent, setForgotSent] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Login Form state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Registration Form state
  const [regFullName, setRegFullName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regCity, setRegCity] = useState('Lagos');
  const [regVehicleType, setRegVehicleType] = useState<'Motorcycle' | 'Bicycle' | 'E-Bike' | 'Scooter' | 'Car'>('Motorcycle');
  const [regLicensePlate, setRegLicensePlate] = useState('');
  const [regEmergencyName, setRegEmergencyName] = useState('');
  const [regEmergencyPhone, setRegEmergencyPhone] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regAgreeTerms, setRegAgreeTerms] = useState(true);

  // Demo seed rider profile
  const demoRider: RiderProfile = {
    id: 'RIDER-9042',
    fullName: 'Babajide Olawale',
    email: 'rider@bibifood.com',
    phone: '+234 802 345 6789',
    vehicleType: 'Motorcycle',
    licensePlate: 'LSD-942-XY',
    rating: 4.9,
    totalDeliveries: 1420,
    isOnline: true,
    verificationStatus: 'Verified Gold Partner',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
    joinedDate: 'March 2025',
    city: 'Lagos',
    emergencyContact: {
      name: 'Adewale Olawale',
      phone: '+234 803 111 2222',
      relationship: 'Brother'
    },
    payoutBank: {
      bankName: 'Guaranty Trust Bank (GTBank)',
      accountNumber: '0123456789',
      accountName: 'Babajide Olawale'
    }
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    if (!loginEmail.trim() || !loginPassword.trim()) {
      setErrorMessage('Please provide both email/Rider ID and password.');
      return;
    }

    // Pass rider profile
    onLoginSuccess({
      ...demoRider,
      email: loginEmail,
      fullName: loginEmail.includes('babajide') ? 'Babajide Olawale' : 'Registered Partner'
    });
  };

  const handleDemoQuickLogin = () => {
    onLoginSuccess(demoRider);
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!regFullName.trim() || !regEmail.trim() || !regPhone.trim() || !regPassword.trim()) {
      setErrorMessage('Please fill in all required registration fields.');
      return;
    }

    const newRider: RiderProfile = {
      id: `RIDER-${Math.floor(1000 + Math.random() * 9000)}`,
      fullName: regFullName,
      email: regEmail,
      phone: regPhone,
      vehicleType: regVehicleType,
      licensePlate: regLicensePlate || 'TBD-999-NG',
      rating: 5.0,
      totalDeliveries: 0,
      isOnline: true,
      verificationStatus: 'Verified Gold Partner',
      city: regCity,
      joinedDate: 'Today',
      emergencyContact: {
        name: regEmergencyName || 'Next of Kin',
        phone: regEmergencyPhone || regPhone,
        relationship: 'Family'
      },
      payoutBank: {
        bankName: 'First Bank of Nigeria',
        accountNumber: '3098765432',
        accountName: regFullName
      }
    };

    onLoginSuccess(newRider);
  };

  const handleForgotSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (forgotEmail) {
      setForgotSent(true);
    }
  };

  return (
    <div className="min-h-screen bg-[#0A120E] text-white flex flex-col justify-between p-4 sm:p-6 lg:p-8 font-sans relative overflow-hidden">
      
      {/* Background Subtle Gradient Blobs */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Top Header Navigation */}
      <div className="w-full max-w-6xl mx-auto flex items-center justify-between z-10 py-2">
        <div className="flex items-center gap-3">
          <BibiLogo mode="horizontal" className="h-8" />
          <span className="hidden sm:inline font-mono text-[10px] bg-emerald-500/15 text-emerald-300 font-extrabold uppercase px-2.5 py-1 rounded-md border border-emerald-500/30">
            Rider Logistics Hub
          </span>
        </div>

        {onNavigateCustomerHome && (
          <button
            onClick={onNavigateCustomerHome}
            className="text-xs font-sans font-semibold text-slate-400 hover:text-white transition-colors cursor-pointer flex items-center gap-1"
          >
            <span>Customer Portal</span>
            <ChevronRight size={14} />
          </button>
        )}
      </div>

      {/* Main Form Center Box */}
      <div className="w-full max-w-xl mx-auto my-auto z-10 py-6">
        
        {/* Toggle Mode Pills */}
        <div className="bg-[#121E18] p-1.5 rounded-2xl border border-emerald-900/50 flex mb-6 shadow-xl">
          <button
            type="button"
            onClick={() => { setMode('login'); setErrorMessage(''); }}
            className={`flex-1 py-2.5 rounded-xl font-display font-bold text-xs transition-all cursor-pointer flex items-center justify-center gap-2 ${
              mode === 'login'
                ? 'bg-emerald-500 text-slate-950 shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <UserCheck size={15} />
            <span>Rider Sign In</span>
          </button>

          <button
            type="button"
            onClick={() => { setMode('register'); setErrorMessage(''); }}
            className={`flex-1 py-2.5 rounded-xl font-display font-bold text-xs transition-all cursor-pointer flex items-center justify-center gap-2 ${
              mode === 'register'
                ? 'bg-amber-400 text-slate-950 shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Truck size={15} />
            <span>Apply as Partner Rider</span>
          </button>
        </div>

        {/* Form Card Shell */}
        <div className="bg-[#121E18] border border-emerald-900/60 rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-md">
          
          {/* Header Title */}
          <div className="mb-6">
            <h1 className="font-display font-black text-2xl text-white tracking-tight">
              {mode === 'login' ? 'Partner Dispatcher Login' : 'Join Bibi Delivery Fleet'}
            </h1>
            <p className="font-sans text-xs text-slate-400 mt-1 leading-relaxed">
              {mode === 'login' 
                ? 'Access your active delivery dispatch console, view today earnings, and track live order requests.' 
                : 'Earn competitive daily payouts, flexible shift scheduling, and full health coverage as a certified rider.'}
            </p>
          </div>

          {/* Error Message */}
          {errorMessage && (
            <div className="mb-6 p-3.5 bg-rose-950/80 border border-rose-500/40 text-rose-200 rounded-2xl text-xs flex items-center gap-2">
              <AlertCircle size={16} className="shrink-0 text-rose-400" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* LOGIN FORM */}
          {mode === 'login' ? (
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div>
                <label className="block text-[11px] font-mono uppercase tracking-wider text-slate-400 mb-1.5 font-bold">
                  Email or Rider ID
                </label>
                <div className="relative">
                  <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                  <input
                    type="text"
                    required
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    placeholder="rider@bibifood.com or RIDER-9042"
                    className="w-full bg-[#0E1712] border border-emerald-900/80 rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label className="block text-[11px] font-mono uppercase tracking-wider text-slate-400 font-bold">
                    Security Password
                  </label>
                  <button
                    type="button"
                    onClick={() => { setForgotModalOpen(true); setForgotSent(false); }}
                    className="text-[11px] font-sans font-semibold text-emerald-400 hover:underline cursor-pointer"
                  >
                    Forgot Password?
                  </button>
                </div>
                <div className="relative">
                  <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                  <input
                    type="password"
                    required
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-[#0E1712] border border-emerald-900/80 rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-display font-bold text-sm rounded-xl shadow-lg transition-all cursor-pointer flex items-center justify-center gap-2 mt-2"
              >
                <span>Launch Rider Console</span>
                <ArrowRight size={16} />
              </button>
            </form>
          ) : (
            /* REGISTER FORM */
            <form onSubmit={handleRegisterSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-mono uppercase tracking-wider text-slate-400 mb-1 font-bold">
                    Full Legal Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={regFullName}
                    onChange={(e) => setRegFullName(e.target.value)}
                    placeholder="e.g. Emmanuel Chukwu"
                    className="w-full bg-[#0E1712] border border-emerald-900/80 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-mono uppercase tracking-wider text-slate-400 mb-1 font-bold">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                    placeholder="emmanuel@example.com"
                    className="w-full bg-[#0E1712] border border-emerald-900/80 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-mono uppercase tracking-wider text-slate-400 mb-1 font-bold">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    required
                    value={regPhone}
                    onChange={(e) => setRegPhone(e.target.value)}
                    placeholder="+234 800 000 0000"
                    className="w-full bg-[#0E1712] border border-emerald-900/80 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-mono uppercase tracking-wider text-slate-400 mb-1 font-bold">
                    Operating City
                  </label>
                  <select
                    value={regCity}
                    onChange={(e) => setRegCity(e.target.value)}
                    className="w-full bg-[#0E1712] border border-emerald-900/80 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-amber-400"
                  >
                    <option value="Lagos">Lagos State</option>
                    <option value="Abuja">Abuja (FCT)</option>
                    <option value="Port Harcourt">Port Harcourt</option>
                    <option value="Ibadan">Ibadan</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-mono uppercase tracking-wider text-slate-400 mb-1 font-bold">
                    Vehicle Type
                  </label>
                  <select
                    value={regVehicleType}
                    onChange={(e) => setRegVehicleType(e.target.value as any)}
                    className="w-full bg-[#0E1712] border border-emerald-900/80 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-amber-400"
                  >
                    <option value="Motorcycle">Motorcycle / Bike</option>
                    <option value="E-Bike">Electric Bike</option>
                    <option value="Bicycle">Bicycle</option>
                    <option value="Scooter">Scooter</option>
                    <option value="Car">Car / Van</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-mono uppercase tracking-wider text-slate-400 mb-1 font-bold">
                    License Plate Number
                  </label>
                  <input
                    type="text"
                    value={regLicensePlate}
                    onChange={(e) => setRegLicensePlate(e.target.value)}
                    placeholder="e.g. KJA-883-AZ"
                    className="w-full bg-[#0E1712] border border-emerald-900/80 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-mono uppercase tracking-wider text-slate-400 mb-1 font-bold">
                    Emergency Contact Name
                  </label>
                  <input
                    type="text"
                    value={regEmergencyName}
                    onChange={(e) => setRegEmergencyName(e.target.value)}
                    placeholder="Next of Kin Name"
                    className="w-full bg-[#0E1712] border border-emerald-900/80 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-mono uppercase tracking-wider text-slate-400 mb-1 font-bold">
                    Emergency Contact Phone
                  </label>
                  <input
                    type="tel"
                    value={regEmergencyPhone}
                    onChange={(e) => setRegEmergencyPhone(e.target.value)}
                    placeholder="+234 800 000 0000"
                    className="w-full bg-[#0E1712] border border-emerald-900/80 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-mono uppercase tracking-wider text-slate-400 mb-1 font-bold">
                  Create Password *
                </label>
                <input
                  type="password"
                  required
                  value={regPassword}
                  onChange={(e) => setRegPassword(e.target.value)}
                  placeholder="At least 6 characters"
                  className="w-full bg-[#0E1712] border border-emerald-900/80 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-amber-400"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="agree-terms"
                  checked={regAgreeTerms}
                  onChange={(e) => setRegAgreeTerms(e.target.checked)}
                  className="rounded accent-amber-400 cursor-pointer"
                />
                <label htmlFor="agree-terms" className="text-xs text-slate-400 cursor-pointer">
                  I agree to Bibi Logistics <span className="text-white underline">Partner Terms</span> & <span className="text-white underline">Safety Rules</span>
                </label>
              </div>

              <button
                type="submit"
                disabled={!regAgreeTerms}
                className="w-full py-3.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-display font-bold text-sm rounded-xl shadow-lg transition-all cursor-pointer flex items-center justify-center gap-2 mt-2 disabled:opacity-50"
              >
                <span>Submit Rider Application</span>
                <CheckCircle2 size={16} />
              </button>
            </form>
          )}

        </div>

      </div>

      {/* Footer Credentials */}
      <div className="w-full max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-500 z-10 pt-4 border-t border-emerald-950/80 font-mono">
        <div>© {new Date().getFullYear()} Bibi Logistics Rider Network</div>
        <div className="flex items-center gap-2 text-[10px]">
          <ShieldCheck size={12} className="text-emerald-400" />
          <span>SSL 256-bit Encrypted Session</span>
        </div>
      </div>

      {/* Forgot Password Modal */}
      <AnimatePresence>
        {forgotModalOpen && (
          <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-[#121E18] border border-emerald-900/80 rounded-3xl p-6 w-full max-w-md shadow-2xl relative"
            >
              <button
                onClick={() => setForgotModalOpen(false)}
                className="absolute top-4 right-4 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/5 cursor-pointer"
              >
                <X size={18} />
              </button>

              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-2xl bg-amber-400/10 border border-amber-400/20 text-amber-400 flex items-center justify-center">
                  <KeyRound size={20} />
                </div>
                <div>
                  <h3 className="font-display font-bold text-lg text-white">Reset Rider Password</h3>
                  <p className="text-xs text-slate-400">Security verification link will be issued.</p>
                </div>
              </div>

              {forgotSent ? (
                <div className="p-4 bg-emerald-950/80 border border-emerald-500/30 rounded-2xl text-center space-y-2">
                  <CheckCircle2 size={32} className="text-emerald-400 mx-auto" />
                  <p className="font-display font-bold text-sm text-white">Password Reset Link Dispatched!</p>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Instructions were sent to <span className="font-mono text-emerald-300">{forgotEmail}</span>. Please check your inbox.
                  </p>
                  <button
                    onClick={() => setForgotModalOpen(false)}
                    className="mt-2 w-full py-2 bg-emerald-500 text-slate-950 font-bold text-xs rounded-xl cursor-pointer"
                  >
                    Back to Login
                  </button>
                </div>
              ) : (
                <form onSubmit={handleForgotSubmit} className="space-y-4">
                  <div>
                    <label className="block text-[11px] font-mono uppercase tracking-wider text-slate-400 mb-1 font-bold">
                      Registered Email Address
                    </label>
                    <input
                      type="email"
                      required
                      value={forgotEmail}
                      onChange={(e) => setForgotEmail(e.target.value)}
                      placeholder="rider@bibifood.com"
                      className="w-full bg-[#0E1712] border border-emerald-900/80 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-amber-400"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 bg-amber-400 hover:bg-amber-300 text-slate-950 font-display font-bold text-xs rounded-xl transition-all cursor-pointer"
                  >
                    Send Verification Email
                  </button>
                </form>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
