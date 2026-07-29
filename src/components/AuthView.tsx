/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, Mail, Phone, Lock, Eye, EyeOff, Check, 
  ArrowRight, ArrowLeft, RefreshCw, Smartphone, CheckCircle2, 
  User, Shield, Calendar, MapPin, Upload, Camera, AlertCircle,
  HelpCircle, ChevronRight, Sparkles, Building2
} from 'lucide-react';
import BibiLogo from './BibiLogo';

interface AuthViewProps {
  onClose?: () => void;
  onLoginSuccess: (email: string, profileData?: any) => void;
  initialMode?: 'login' | 'signup' | 'welcome';
}

export default function AuthView({ onClose, onLoginSuccess, initialMode = 'welcome' }: AuthViewProps) {
  // Navigation stack state
  // Modes: 'welcome' | 'login' | 'signup' | 'forgot_password' | 'otp' | 'reset_password' | 'account_created' | 'profile_setup'
  const [mode, setMode] = useState<string>(initialMode);
  
  // Previous mode tracking for custom OTP destination
  const [prevMode, setPrevMode] = useState<string>('login');

  // Input states
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [agreeTerms, setAgreeTerms] = useState(false);

  // OTP Verification Code State
  const [otpVal, setOtpVal] = useState(['', '', '', '', '', '']);
  const [otpTimer, setOtpTimer] = useState(59);
  const [canResendOtp, setCanResendOtp] = useState(false);

  // Profile Setup states
  const [avatar, setAvatar] = useState<string | null>(null);
  const [gender, setGender] = useState('');
  const [dob, setDob] = useState('');
  const [primaryStreet, setPrimaryStreet] = useState('');
  const [primaryCity, setPrimaryCity] = useState('Lagos');
  const [addressLabel, setAddressLabel] = useState<'Home' | 'Office' | 'Other'>('Home');
  const [preferredContact, setPreferredContact] = useState<'Email' | 'SMS' | 'Push'>('Email');

  // Validation & Loading states
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [resendMessage, setResendMessage] = useState(false);

  // Refs for OTP input navigation
  const otpRefs = useRef<HTMLInputElement[]>([]);

  // Password Strength Indicator
  const [passwordStrength, setPasswordStrength] = useState({ score: 0, text: 'Weak', color: 'bg-red-400' });

  // Reset OTP countdown timer
  useEffect(() => {
    let interval: any;
    if (mode === 'otp') {
      setOtpTimer(59);
      setCanResendOtp(false);
      interval = setInterval(() => {
        setOtpTimer((prev) => {
          if (prev <= 1) {
            setCanResendOtp(true);
            clearInterval(interval);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [mode]);

  // Monitor password strength
  useEffect(() => {
    if (!password) {
      setPasswordStrength({ score: 0, text: 'Empty', color: 'bg-slate-200' });
      return;
    }
    let score = 0;
    if (password.length >= 6) score += 1;
    if (password.length >= 10) score += 1;
    if (/[A-Z]/.test(password)) score += 1;
    if (/[0-9]/.test(password)) score += 1;
    if (/[^A-Za-z0-9]/.test(password)) score += 1;

    let text = 'Weak';
    let color = 'bg-rose-400';
    if (score >= 4) {
      text = 'Excellent';
      color = 'bg-brand-basil';
    } else if (score >= 3) {
      text = 'Good';
      color = 'bg-brand-gold';
    } else if (score >= 2) {
      text = 'Moderate';
      color = 'bg-amber-400';
    }
    setPasswordStrength({ score, text, color });
  }, [password]);

  // Validation functions
  const validateEmail = (val: string) => {
    if (!val) return 'Email address is required.';
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(val)) return 'Please enter a valid email address.';
    return '';
  };

  const validatePhone = (val: string) => {
    if (!val) return 'Phone number is required.';
    // Standard Nigeria Phone matching: e.g. +234, 080, 090, 070 followed by 8 digits
    const cleanPhone = val.replace(/[\s\-()]/g, '');
    const phoneRegex = /^(?:\+234|0)(?:[789][01]\d{8})$/;
    if (!phoneRegex.test(cleanPhone)) return 'Please enter a valid Nigeria phone number (e.g. 08012345678).';
    return '';
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};
    
    const emailError = validateEmail(email);
    if (emailError) newErrors.email = emailError;

    if (!password) {
      newErrors.password = 'Password is required.';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters.';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      // Automatically go to home if verified, or trigger success
      onLoginSuccess(email, {
        firstName: 'Guest',
        lastName: 'Bibi User',
        phone: '+234 803 123 4567',
        avatarUrl: null,
        addresses: [],
        notifications: { orderUpdates: true, promotions: true, email: true, sms: true, push: false }
      });
      if (onClose) onClose();
    }, 1500);
  };

  const handleSignUpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};

    if (!firstName.trim()) newErrors.firstName = 'First name is required.';
    if (!lastName.trim()) newErrors.lastName = 'Last name is required.';
    
    const emailError = validateEmail(email);
    if (emailError) newErrors.email = emailError;

    const phoneError = validatePhone(phone);
    if (phoneError) newErrors.phone = phoneError;

    if (!password) {
      newErrors.password = 'Password is required.';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters.';
    }

    if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match.';
    }

    if (!agreeTerms) {
      newErrors.agreeTerms = 'You must agree to the Terms of Service & Hygiene Code.';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      setPrevMode('signup');
      setMode('otp');
    }, 1200);
  };

  const handleForgotPasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};

    // Recover via email or phone
    const isEmail = email.includes('@');
    if (isEmail) {
      const emailError = validateEmail(email);
      if (emailError) newErrors.email = emailError;
    } else {
      const phoneError = validatePhone(email);
      if (phoneError) newErrors.email = 'Please provide a valid email or Nigeria phone number.';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      setPrevMode('forgot_password');
      setMode('otp');
    }, 1200);
  };

  const handleOtpChange = (val: string, idx: number) => {
    if (isNaN(Number(val))) return;
    const newOtp = [...otpVal];
    newOtp[idx] = val;
    setOtpVal(newOtp);

    // Focus next input box
    if (val !== '' && idx < 5) {
      otpRefs.current[idx + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, idx: number) => {
    if (e.key === 'Backspace' && !otpVal[idx] && idx > 0) {
      otpRefs.current[idx - 1]?.focus();
    }
  };

  const handleOtpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const code = otpVal.join('');
    if (code.length < 6) {
      setErrors({ otp: 'Please enter all 6 digits of your verification code.' });
      return;
    }

    setErrors({});
    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      if (prevMode === 'forgot_password') {
        setMode('reset_password');
      } else {
        setMode('account_created');
      }
    }, 1200);
  };

  const handleResetPasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};

    if (!password || password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters.';
    }
    if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match.';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      setMode('login');
    }, 1500);
  };

  const handleProfileSetupSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      
      const mockProfile = {
        firstName: firstName || 'Bibi',
        lastName: lastName || 'User',
        email: email || 'user@bibifood.com',
        phone: phone || '+234 803 123 4567',
        avatarUrl: avatar,
        gender: gender || 'Not Specified',
        dob: dob || '',
        preferredContact,
        addresses: primaryStreet ? [
          {
            id: 'addr-custom-1',
            label: addressLabel,
            street: primaryStreet,
            city: primaryCity,
            phone: phone || '+234 803 123 4567',
            isDefault: true
          }
        ] : []
      };

      onLoginSuccess(email || 'user@bibifood.com', mockProfile);
      if (onClose) onClose();
    }, 1500);
  };

  const handleResendCode = () => {
    setCanResendOtp(false);
    setOtpTimer(59);
    setResendMessage(true);
    setTimeout(() => setResendMessage(false), 3000);
  };

  // Profile image upload placeholder simulation
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (uploadEvent) => {
        if (uploadEvent.target?.result) {
          setAvatar(uploadEvent.target.result as string);
        }
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  // Social Login handler placeholders
  const handleSocialLogin = (platform: string) => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      const mockSocialEmail = `${platform.toLowerCase()}.user@gmail.com`;
      onLoginSuccess(mockSocialEmail, {
        firstName: platform === 'Google' ? 'G.' : 'A.',
        lastName: 'User',
        email: mockSocialEmail,
        phone: '+234 803 123 4567',
        avatarUrl: null,
        addresses: [],
        notifications: { orderUpdates: true, promotions: true, email: true, sms: true, push: false }
      });
      if (onClose) onClose();
    }, 1200);
  };

  return (
    <div className="w-full flex items-center justify-center min-h-[70vh] p-4 font-sans">
      <div className="bg-white rounded-3xl border border-brand-olive/5 shadow-[0_12px_40px_rgba(18,32,24,0.03)] w-full max-w-xl overflow-hidden p-6 md:p-8 relative">
        {onClose && (
          <button 
            onClick={onClose}
            className="absolute top-5 right-5 w-8 h-8 rounded-full bg-slate-50 hover:bg-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-700 transition-colors border border-slate-100 z-10 cursor-pointer"
          >
            <X size={15} />
          </button>
        )}

        <AnimatePresence mode="wait">
          {/* WELCOME SCREEN */}
          {mode === 'welcome' && (
            <motion.div
              key="welcome"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              className="text-center py-6"
            >
              <BibiLogo mode="icon" className="h-14 w-14 mx-auto mb-5" />
              <h2 className="font-display font-black text-2xl md:text-3xl text-brand-charcoal tracking-tight">
                Authentic Cloud Kitchen Gastronomy
              </h2>
              <p className="font-sans text-xs text-slate-400 mt-2 max-w-xs mx-auto leading-relaxed">
                Unlock rapid 20-minute thermal container meal dispatches, custom curated recipes, and bank-reconciliation payment tracking.
              </p>

              <div className="flex flex-col gap-3 mt-8 max-w-sm mx-auto">
                <button
                  onClick={() => setMode('login')}
                  className="w-full bg-brand-olive hover:bg-[#131E18] text-brand-saffron font-display font-bold py-4 rounded-2xl transition-all shadow-md active:scale-[0.98] cursor-pointer flex items-center justify-center gap-2"
                >
                  <span>Sign In to Account</span>
                  <ArrowRight size={14} className="text-brand-saffron" />
                </button>

                <button
                  onClick={() => setMode('signup')}
                  className="w-full bg-white hover:bg-slate-50 text-brand-olive border-2 border-brand-olive/10 font-display font-bold py-3.5 rounded-2xl transition-all active:scale-[0.98] cursor-pointer"
                >
                  Create New Account
                </button>

                <button
                  onClick={() => {
                    onLoginSuccess('guest@bibifood.com', {
                      firstName: 'Guest',
                      lastName: 'Bibi Explorer',
                      email: 'guest@bibifood.com',
                      phone: '',
                      addresses: []
                    });
                    if (onClose) onClose();
                  }}
                  className="w-full text-slate-400 hover:text-brand-olive font-sans text-xs font-semibold mt-2.5 transition-colors cursor-pointer"
                >
                  Continue as Guest Explorer
                </button>
              </div>

              <div className="mt-10 border-t border-slate-100 pt-6">
                <p className="text-[10px] text-slate-400 font-sans tracking-wide">
                  SECURED BY BIBI TRIPLE-CHAIN ENCRYPTION
                </p>
              </div>
            </motion.div>
          )}

          {/* LOGIN PAGE */}
          {mode === 'login' && (
            <motion.div
              key="login"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
            >
              <div className="mb-6">
                <button 
                  onClick={() => setMode('welcome')}
                  className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-brand-chili font-semibold mb-4 transition-colors cursor-pointer"
                >
                  <ArrowLeft size={13} />
                  <span>Back</span>
                </button>
                <h3 className="font-display font-black text-2xl text-brand-charcoal tracking-tight">
                  Welcome Back!
                </h3>
                <p className="font-sans text-xs text-slate-400 mt-1">
                  Access your premier culinary orders and delivery records.
                </p>
              </div>

              <form onSubmit={handleLoginSubmit} className="flex flex-col gap-4">
                <div>
                  <label className="block font-sans text-xs font-semibold text-brand-olive mb-1.5 ml-1">
                    Email Address
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="e.g. adewale@gmail.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      disabled={isLoading}
                      className={`w-full bg-slate-50 text-slate-800 font-sans text-xs px-4.5 py-3.5 pl-11 rounded-xl border transition-all placeholder:text-slate-400 focus:outline-none focus:bg-white ${
                        errors.email ? 'border-rose-400 focus:border-rose-500' : 'border-slate-200 focus:border-brand-olive'
                      }`}
                    />
                    <Mail size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                  </div>
                  {errors.email && (
                    <span className="block text-[11px] text-rose-500 font-sans mt-1 ml-1">{errors.email}</span>
                  )}
                </div>

                <div>
                  <div className="flex justify-between items-center mb-1.5 ml-1">
                    <label className="block font-sans text-xs font-semibold text-brand-olive">
                      Password
                    </label>
                    <button
                      type="button"
                      onClick={() => setMode('forgot_password')}
                      className="text-brand-chili hover:underline text-[11px] font-sans font-semibold cursor-pointer"
                    >
                      Forgot Password?
                    </button>
                  </div>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Enter security password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      disabled={isLoading}
                      className={`w-full bg-slate-50 text-slate-800 font-sans text-xs px-4.5 py-3.5 pl-11 pr-11 rounded-xl border transition-all placeholder:text-slate-400 focus:outline-none focus:bg-white ${
                        errors.password ? 'border-rose-400 focus:border-rose-500' : 'border-slate-200 focus:border-brand-olive'
                      }`}
                    />
                    <Lock size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                    >
                      {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                    </button>
                  </div>
                  {errors.password && (
                    <span className="block text-[11px] text-rose-500 font-sans mt-1 ml-1">{errors.password}</span>
                  )}
                </div>

                <div className="flex items-center justify-between mt-1 mb-2">
                  <label className="flex items-center gap-2 cursor-pointer select-none text-xs text-slate-500">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="w-4 h-4 rounded border-slate-300 text-brand-olive focus:ring-brand-olive"
                    />
                    <span>Remember Me</span>
                  </label>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-brand-olive hover:bg-[#131E18] text-[#FAF8F5] font-display font-bold py-4 rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {isLoading ? (
                    <RefreshCw className="animate-spin text-brand-saffron" size={16} />
                  ) : (
                    <>
                      <span>Secure Login</span>
                      <ArrowRight size={14} className="text-brand-saffron" />
                    </>
                  )}
                </button>

                <div className="flex items-center gap-3 my-3">
                  <div className="h-px bg-slate-100 flex-1" />
                  <span className="text-[10px] text-slate-400 font-sans uppercase tracking-wider">Or Continue With</span>
                  <div className="h-px bg-slate-100 flex-1" />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => handleSocialLogin('Google')}
                    className="flex items-center justify-center gap-2 py-3 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl font-sans text-xs font-semibold text-slate-600 transition-colors cursor-pointer"
                  >
                    <svg className="w-4 h-4" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v3.92h6.61a5.66 5.66 0 0 1-2.45 3.71v3.08h3.95c2.31-2.13 3.63-5.27 3.63-8.64z"/>
                      <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.95-3.08c-1.1.74-2.5 1.18-3.98 1.18-3.07 0-5.67-2.08-6.6-4.88H1.36v3.19A11.99 11.99 0 0 0 12 24z"/>
                      <path fill="#FBBC05" d="M5.4 14.31A7.16 7.16 0 0 1 5 12c0-.8.14-1.58.4-2.31V6.5H1.36A11.93 11.93 0 0 0 0 12c0 2.22.61 4.3 1.66 6.09L5.4 14.31z"/>
                      <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.34 0 3.34 2.67 1.36 6.5l4.04 3.19c.93-2.8 3.53-4.94 6.6-4.94z"/>
                    </svg>
                    <span>Google</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSocialLogin('Apple')}
                    className="flex items-center justify-center gap-2 py-3 bg-slate-900 hover:bg-black text-white rounded-xl font-sans text-xs font-semibold transition-all cursor-pointer"
                  >
                    <svg className="w-3.5 h-3.5 fill-white" viewBox="0 0 24 24">
                      <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 4.17c.66-.81 1.11-1.93.99-3.06-.96.04-2.13.64-2.82 1.45-.6.69-1.12 1.84-.98 2.94 1.07.08 2.16-.52 2.81-1.33z"/>
                    </svg>
                    <span>Apple</span>
                  </button>
                </div>

                <div className="text-center mt-4">
                  <span className="text-xs text-slate-400 font-sans">
                    Don't have an account?{' '}
                  </span>
                  <button
                    type="button"
                    onClick={() => setMode('signup')}
                    className="text-brand-chili hover:underline text-xs font-sans font-bold cursor-pointer"
                  >
                    Sign Up Free
                  </button>
                </div>
              </form>
            </motion.div>
          )}

          {/* SIGN-UP PAGE */}
          {mode === 'signup' && (
            <motion.div
              key="signup"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
            >
              <div className="mb-5">
                <button 
                  onClick={() => setMode('welcome')}
                  className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-brand-chili font-semibold mb-3 transition-colors cursor-pointer"
                >
                  <ArrowLeft size={13} />
                  <span>Back</span>
                </button>
                <h3 className="font-display font-black text-2xl text-brand-charcoal tracking-tight">
                  Create Account
                </h3>
                <p className="font-sans text-xs text-slate-400 mt-1">
                  Enjoy custom meal recommendations and real-time dispatches.
                </p>
              </div>

              <form onSubmit={handleSignUpSubmit} className="flex flex-col gap-3.5">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-sans text-xs font-semibold text-brand-olive mb-1 ml-1">
                      First Name
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Alaba"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      disabled={isLoading}
                      className={`w-full bg-slate-50 text-slate-800 font-sans text-xs px-4 py-3 rounded-xl border transition-all focus:outline-none focus:bg-white ${
                        errors.firstName ? 'border-rose-400' : 'border-slate-200 focus:border-brand-olive'
                      }`}
                    />
                    {errors.firstName && (
                      <span className="block text-[10px] text-rose-500 font-sans mt-0.5 ml-1">{errors.firstName}</span>
                    )}
                  </div>
                  <div>
                    <label className="block font-sans text-xs font-semibold text-brand-olive mb-1 ml-1">
                      Last Name
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Kola"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      disabled={isLoading}
                      className={`w-full bg-slate-50 text-slate-800 font-sans text-xs px-4 py-3 rounded-xl border transition-all focus:outline-none focus:bg-white ${
                        errors.lastName ? 'border-rose-400' : 'border-slate-200 focus:border-brand-olive'
                      }`}
                    />
                    {errors.lastName && (
                      <span className="block text-[10px] text-rose-500 font-sans mt-0.5 ml-1">{errors.lastName}</span>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block font-sans text-xs font-semibold text-brand-olive mb-1 ml-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    placeholder="e.g. name@company.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={isLoading}
                    className={`w-full bg-slate-50 text-slate-800 font-sans text-xs px-4 py-3 rounded-xl border transition-all focus:outline-none focus:bg-white ${
                      errors.email ? 'border-rose-400' : 'border-slate-200 focus:border-brand-olive'
                    }`}
                  />
                  {errors.email && (
                    <span className="block text-[10px] text-rose-500 font-sans mt-0.5 ml-1">{errors.email}</span>
                  )}
                </div>

                <div>
                  <label className="block font-sans text-xs font-semibold text-brand-olive mb-1 ml-1">
                    Phone Number (Nigeria format)
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="e.g. 08012345678"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      disabled={isLoading}
                      className={`w-full bg-slate-50 text-slate-800 font-sans text-xs px-4 py-3 pl-10 rounded-xl border transition-all focus:outline-none focus:bg-white ${
                        errors.phone ? 'border-rose-400' : 'border-slate-200 focus:border-brand-olive'
                      }`}
                    />
                    <Smartphone size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  </div>
                  {errors.phone && (
                    <span className="block text-[10px] text-rose-500 font-sans mt-0.5 ml-1">{errors.phone}</span>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-sans text-xs font-semibold text-brand-olive mb-1 ml-1">
                      Password
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Choose password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        disabled={isLoading}
                        className={`w-full bg-slate-50 text-slate-800 font-sans text-xs px-4 py-3 pr-10 rounded-xl border transition-all focus:outline-none focus:bg-white ${
                          errors.password ? 'border-rose-400' : 'border-slate-200 focus:border-brand-olive'
                        }`}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 cursor-pointer"
                      >
                        {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                      </button>
                    </div>
                    {errors.password && (
                      <span className="block text-[10px] text-rose-500 font-sans mt-0.5 ml-1">{errors.password}</span>
                    )}
                  </div>

                  <div>
                    <label className="block font-sans text-xs font-semibold text-brand-olive mb-1 ml-1">
                      Confirm Password
                    </label>
                    <div className="relative">
                      <input
                        type={showConfirmPassword ? 'text' : 'password'}
                        placeholder="Repeat password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        disabled={isLoading}
                        className={`w-full bg-slate-50 text-slate-800 font-sans text-xs px-4 py-3 pr-10 rounded-xl border transition-all focus:outline-none focus:bg-white ${
                          errors.confirmPassword ? 'border-rose-400' : 'border-slate-200 focus:border-brand-olive'
                        }`}
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 cursor-pointer"
                      >
                        {showConfirmPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                      </button>
                    </div>
                    {errors.confirmPassword && (
                      <span className="block text-[10px] text-rose-500 font-sans mt-0.5 ml-1">{errors.confirmPassword}</span>
                    )}
                  </div>
                </div>

                {/* Password Strength Meter */}
                {password && (
                  <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-[10px] text-slate-500 font-sans">Strength level:</span>
                      <span className="text-[10px] font-bold font-sans uppercase tracking-wider" style={{ color: passwordStrength.text === 'Excellent' ? '#4CAF50' : '#E0982C' }}>
                        {passwordStrength.text}
                      </span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden flex gap-0.5">
                      {[...Array(5)].map((_, i) => (
                        <div 
                          key={i} 
                          className={`flex-1 h-full rounded-full transition-all duration-300 ${
                            i < passwordStrength.score ? passwordStrength.color : 'bg-slate-200'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                )}

                <div className="mt-1">
                  <label className="flex items-start gap-2.5 cursor-pointer select-none text-xs text-slate-500">
                    <input
                      type="checkbox"
                      checked={agreeTerms}
                      onChange={(e) => setAgreeTerms(e.target.checked)}
                      className="w-4 h-4 rounded border-slate-300 text-brand-olive focus:ring-brand-olive mt-0.5 shrink-0"
                    />
                    <span className="leading-tight">
                      I agree to the Bibi <span className="text-brand-chili font-semibold">Terms of Service</span>, <span className="text-brand-chili font-semibold">Privacy Policy</span> & Culinary Hygiene Code.
                    </span>
                  </label>
                  {errors.agreeTerms && (
                    <span className="block text-[10px] text-rose-500 font-sans mt-1 ml-1">{errors.agreeTerms}</span>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-brand-olive hover:bg-[#131E18] text-[#FAF8F5] font-display font-bold py-4 rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 mt-2"
                >
                  {isLoading ? (
                    <RefreshCw className="animate-spin text-brand-saffron" size={16} />
                  ) : (
                    <>
                      <span>Generate Verification OTP</span>
                      <ArrowRight size={14} className="text-brand-saffron" />
                    </>
                  )}
                </button>

                <div className="text-center mt-2.5">
                  <span className="text-xs text-slate-400 font-sans">
                    Already have an account?{' '}
                  </span>
                  <button
                    type="button"
                    onClick={() => setMode('login')}
                    className="text-brand-chili hover:underline text-xs font-sans font-bold cursor-pointer"
                  >
                    Login here
                  </button>
                </div>
              </form>
            </motion.div>
          )}

          {/* FORGOT PASSWORD */}
          {mode === 'forgot_password' && (
            <motion.div
              key="forgot_password"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
            >
              <div className="mb-6">
                <button 
                  onClick={() => setMode('login')}
                  className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-brand-chili font-semibold mb-4 transition-colors cursor-pointer"
                >
                  <ArrowLeft size={13} />
                  <span>Back to Login</span>
                </button>
                <h3 className="font-display font-black text-2xl text-brand-charcoal tracking-tight">
                  Recover Password
                </h3>
                <p className="font-sans text-xs text-slate-400 mt-1">
                  Enter your email or phone number associated with your account to authorize recovery.
                </p>
              </div>

              <form onSubmit={handleForgotPasswordSubmit} className="flex flex-col gap-4">
                <div>
                  <label className="block font-sans text-xs font-semibold text-brand-olive mb-1.5 ml-1">
                    Email Address or Phone Number
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      required
                      placeholder="e.g. adewale@gmail.com or 080..."
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      disabled={isLoading}
                      className={`w-full bg-slate-50 text-slate-800 font-sans text-xs px-4.5 py-4 pl-11 rounded-xl border transition-all focus:outline-none focus:bg-white ${
                        errors.email ? 'border-rose-400' : 'border-slate-200 focus:border-brand-olive'
                      }`}
                    />
                    <Mail size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                  </div>
                  {errors.email && (
                    <span className="block text-[10px] text-rose-500 font-sans mt-1 ml-1">{errors.email}</span>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-brand-olive hover:bg-[#131E18] text-[#FAF8F5] font-display font-bold py-4 rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 mt-2"
                >
                  {isLoading ? (
                    <RefreshCw className="animate-spin text-brand-saffron" size={16} />
                  ) : (
                    <>
                      <span>Send Recovery OTP</span>
                      <ArrowRight size={14} className="text-brand-saffron" />
                    </>
                  )}
                </button>
              </form>
            </motion.div>
          )}

          {/* OTP VERIFICATION */}
          {mode === 'otp' && (
            <motion.div
              key="otp"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              className="text-center"
            >
              <div className="mb-5 text-left">
                <button 
                  onClick={() => setMode(prevMode === 'signup' ? 'signup' : 'forgot_password')}
                  className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-brand-chili font-semibold mb-3 transition-colors cursor-pointer"
                >
                  <ArrowLeft size={13} />
                  <span>Go back</span>
                </button>
                <h3 className="font-display font-black text-2xl text-brand-charcoal tracking-tight text-center">
                  Verify Credentials
                </h3>
                <p className="font-sans text-xs text-slate-400 mt-1.5 text-center">
                  A unique 6-digit verification pin has been triggered for verification.
                </p>
                <p className="font-sans text-xs font-bold text-brand-olive mt-1 text-center truncate">
                  Sent to: {email || phone || 'your contact details'}
                </p>
              </div>

              {/* Six digits container boxes */}
              <form onSubmit={handleOtpSubmit} className="flex flex-col gap-6">
                <div className="flex justify-between gap-2.5 my-3 max-w-sm mx-auto">
                  {otpVal.map((data, idx) => (
                    <input
                      key={idx}
                      ref={(el) => (otpRefs.current[idx] = el as HTMLInputElement)}
                      type="text"
                      maxLength={1}
                      className="w-12 h-14 bg-slate-50 border-2 border-slate-200 text-brand-olive font-mono text-center text-xl font-bold rounded-xl focus:outline-none focus:border-brand-olive focus:bg-white transition-all shadow-sm"
                      value={data}
                      onChange={(e) => handleOtpChange(e.target.value, idx)}
                      onKeyDown={(e) => handleOtpKeyDown(e, idx)}
                      onFocus={(e) => e.target.select()}
                      disabled={isLoading}
                    />
                  ))}
                </div>

                {errors.otp && (
                  <span className="block text-[11px] text-rose-500 font-sans mt-0.5">{errors.otp}</span>
                )}

                {/* Simulated pin shortcut */}
                <div className="text-center">
                  <button
                    type="button"
                    onClick={() => {
                      setOtpVal(['1', '2', '3', '4', '5', '6']);
                      setErrors({});
                    }}
                    className="font-mono text-[10px] text-slate-400 hover:text-brand-gold transition-all hover:scale-105 active:scale-95 underline cursor-pointer"
                  >
                    Shortcut simulation: (123456)
                  </button>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-brand-olive hover:bg-[#131E18] text-[#FAF8F5] font-display font-bold py-4 rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {isLoading ? (
                    <RefreshCw className="animate-spin text-brand-saffron" size={16} />
                  ) : (
                    <>
                      <Shield size={14} className="text-brand-saffron" />
                      <span>Confirm & Authorize Account</span>
                    </>
                  )}
                </button>

                <div className="flex flex-col sm:flex-row justify-between items-center text-xs font-sans mt-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setMode(prevMode === 'signup' ? 'signup' : 'forgot_password')}
                    className="text-slate-400 hover:text-brand-olive font-semibold transition-colors cursor-pointer"
                  >
                    Change phone number/email
                  </button>
                  
                  {canResendOtp ? (
                    <button
                      type="button"
                      onClick={handleResendCode}
                      className="text-brand-chili hover:underline font-bold transition-colors cursor-pointer"
                    >
                      Resend Verification Code
                    </button>
                  ) : (
                    <span className="text-slate-400">
                      Resend Code in <span className="font-mono font-bold text-brand-olive">{otpTimer}s</span>
                    </span>
                  )}
                </div>

                <AnimatePresence>
                  {resendMessage && (
                    <motion.div
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="text-[11px] font-sans font-semibold text-brand-success bg-brand-success/5 border border-brand-success/15 py-2 px-3 rounded-xl mt-2"
                    >
                      A fresh 6-digit verification code has been re-transmitted!
                    </motion.div>
                  )}
                </AnimatePresence>
              </form>
            </motion.div>
          )}

          {/* RESET PASSWORD */}
          {mode === 'reset_password' && (
            <motion.div
              key="reset_password"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
            >
              <div className="mb-6">
                <h3 className="font-display font-black text-2xl text-brand-charcoal tracking-tight">
                  Choose New Password
                </h3>
                <p className="font-sans text-xs text-slate-400 mt-1">
                  Re-secure your account using a fresh, strong passphrase credentials.
                </p>
              </div>

              <form onSubmit={handleResetPasswordSubmit} className="flex flex-col gap-4">
                <div>
                  <label className="block font-sans text-xs font-semibold text-brand-olive mb-1.5 ml-1">
                    New Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Enter new strong password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      disabled={isLoading}
                      className={`w-full bg-slate-50 text-slate-800 font-sans text-xs px-4.5 py-3.5 pr-11 rounded-xl border transition-all focus:outline-none focus:bg-white ${
                        errors.password ? 'border-rose-400' : 'border-slate-200 focus:border-brand-olive'
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                    >
                      {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                    </button>
                  </div>
                  {errors.password && (
                    <span className="block text-[11px] text-rose-500 font-sans mt-1 ml-1">{errors.password}</span>
                  )}
                </div>

                <div>
                  <label className="block font-sans text-xs font-semibold text-brand-olive mb-1.5 ml-1">
                    Confirm New Password
                  </label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      placeholder="Repeat new password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      disabled={isLoading}
                      className={`w-full bg-slate-50 text-slate-800 font-sans text-xs px-4.5 py-3.5 pr-11 rounded-xl border transition-all focus:outline-none focus:bg-white ${
                        errors.confirmPassword ? 'border-rose-400' : 'border-slate-200 focus:border-brand-olive'
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                    >
                      {showConfirmPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                    </button>
                  </div>
                  {errors.confirmPassword && (
                    <span className="block text-[11px] text-rose-500 font-sans mt-1 ml-1">{errors.confirmPassword}</span>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-brand-olive hover:bg-[#131E18] text-[#FAF8F5] font-display font-bold py-4 rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 mt-2"
                >
                  {isLoading ? (
                    <RefreshCw className="animate-spin text-brand-saffron" size={16} />
                  ) : (
                    <>
                      <span>Update Password</span>
                      <ArrowRight size={14} className="text-brand-saffron" />
                    </>
                  )}
                </button>
              </form>
            </motion.div>
          )}

          {/* ACCOUNT CREATED */}
          {mode === 'account_created' && (
            <motion.div
              key="account_created"
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center py-6"
            >
              <div className="w-20 h-20 bg-brand-basil/15 text-brand-basil rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner animate-bounce">
                <CheckCircle2 size={44} />
              </div>

              <h2 className="font-display font-black text-2xl md:text-3xl text-brand-charcoal">
                Welcome to Bibi Food!
              </h2>
              <p className="font-sans text-xs text-brand-chili font-bold uppercase tracking-wider mt-1.5">
                Account Created Successfully
              </p>
              
              <p className="font-sans text-xs text-slate-500 mt-4 max-w-sm mx-auto leading-relaxed">
                Your credentials have been securely registered. Let's configure your gastronomy profile to deliver the ultimate cloud kitchen dining experience.
              </p>

              <div className="flex flex-col sm:flex-row gap-3 mt-8 max-w-md mx-auto">
                <button
                  onClick={() => setMode('profile_setup')}
                  className="flex-1 bg-brand-olive hover:bg-[#131E18] text-brand-saffron font-display font-bold py-4 rounded-xl transition-all shadow-md cursor-pointer flex items-center justify-center gap-2"
                >
                  <span>Complete Profile</span>
                  <ArrowRight size={14} className="text-brand-saffron" />
                </button>
                <button
                  onClick={() => {
                    onLoginSuccess(email || 'demo.user@bibifood.com', {
                      firstName: firstName || 'Bibi',
                      lastName: lastName || 'User',
                      email: email || 'demo.user@bibifood.com',
                      phone: phone || '',
                      addresses: []
                    });
                    if (onClose) onClose();
                  }}
                  className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-display font-bold py-4 rounded-xl transition-all cursor-pointer"
                >
                  Skip for Now
                </button>
              </div>
            </motion.div>
          )}

          {/* PROFILE SETUP */}
          {mode === 'profile_setup' && (
            <motion.div
              key="profile_setup"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <div className="mb-5 text-center">
                <h3 className="font-display font-black text-2xl text-brand-charcoal">
                  Configure Gastronomy Profile
                </h3>
                <p className="font-sans text-xs text-slate-400 mt-1">
                  Personalize your Bibi Dining account settings.
                </p>
              </div>

              <form onSubmit={handleProfileSetupSubmit} className="flex flex-col gap-4">
                
                {/* Profile Photo Upload Placeholder */}
                <div className="flex items-center gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-100">
                  <div className="relative w-16 h-16 rounded-full bg-slate-200 border-2 border-white shadow-md flex items-center justify-center overflow-hidden shrink-0">
                    {avatar ? (
                      <img src={avatar} alt="Profile Avatar" className="w-full h-full object-cover" />
                    ) : (
                      <User size={24} className="text-slate-400" />
                    )}
                    <label className="absolute inset-0 bg-black/40 hover:bg-black/60 transition-all flex items-center justify-center text-white cursor-pointer opacity-0 hover:opacity-100">
                      <Camera size={14} />
                      <input type="file" accept="image/*" onChange={handlePhotoUpload} className="hidden" />
                    </label>
                  </div>
                  <div>
                    <h4 className="font-display font-bold text-xs text-brand-charcoal">Profile Photo</h4>
                    <p className="font-sans text-[10px] text-slate-400 mt-0.5">Upload a clean picture for dispatch verification.</p>
                    <label className="inline-block mt-2 font-sans text-[10px] font-bold text-brand-chili hover:underline cursor-pointer">
                      <span>Upload Avatar Image</span>
                      <input type="file" accept="image/*" onChange={handlePhotoUpload} className="hidden" />
                    </label>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-sans text-xs font-semibold text-brand-olive mb-1.5 ml-1">
                      Gender <span className="text-slate-400 font-normal">(Optional)</span>
                    </label>
                    <select
                      value={gender}
                      onChange={(e) => setGender(e.target.value)}
                      className="w-full bg-slate-50 text-slate-800 font-sans text-xs px-4 py-3.5 rounded-xl border border-slate-200 focus:outline-none focus:bg-white"
                    >
                      <option value="">Select Gender</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other / Non-binary</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-sans text-xs font-semibold text-brand-olive mb-1.5 ml-1">
                      Date of Birth <span className="text-slate-400 font-normal">(Optional)</span>
                    </label>
                    <div className="relative">
                      <input
                        type="date"
                        value={dob}
                        onChange={(e) => setDob(e.target.value)}
                        className="w-full bg-slate-50 text-slate-800 font-sans text-xs px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:bg-white"
                      />
                    </div>
                  </div>
                </div>

                {/* Primary Delivery Address Input */}
                <div>
                  <label className="block font-sans text-xs font-semibold text-brand-olive mb-1.5 ml-1">
                    Primary Delivery Address
                  </label>
                  <div className="relative mb-2">
                    <input
                      type="text"
                      placeholder="e.g. 14 Broad Street, Marina"
                      value={primaryStreet}
                      onChange={(e) => setPrimaryStreet(e.target.value)}
                      className="w-full bg-slate-50 text-slate-800 font-sans text-xs px-4 py-3.5 pl-10 rounded-xl border border-slate-200 focus:outline-none focus:bg-white placeholder:text-slate-400"
                    />
                    <MapPin size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  </div>
                  
                  {primaryStreet && (
                    <div className="flex gap-2 mt-2 ml-1">
                      {(['Home', 'Office', 'Other'] as const).map((lbl) => (
                        <button
                          key={lbl}
                          type="button"
                          onClick={() => setAddressLabel(lbl)}
                          className={`px-3 py-1.5 rounded-lg text-[10px] font-sans font-bold border transition-colors cursor-pointer ${
                            addressLabel === lbl 
                              ? 'bg-brand-gold/15 border-brand-gold text-brand-charcoal' 
                              : 'bg-white border-slate-200 text-slate-400 hover:text-brand-olive'
                          }`}
                        >
                          {lbl}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Preferred Correspondence channel */}
                <div>
                  <label className="block font-sans text-xs font-semibold text-brand-olive mb-1.5 ml-1">
                    Preferred Correspondence Channel
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {(['Email', 'SMS', 'Push'] as const).map((chan) => (
                      <button
                        key={chan}
                        type="button"
                        onClick={() => setPreferredContact(chan)}
                        className={`py-3.5 rounded-xl text-xs font-sans font-bold border transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                          preferredContact === chan 
                            ? 'bg-brand-olive/5 border-brand-olive text-brand-olive font-extrabold shadow-sm' 
                            : 'bg-slate-50 border-slate-200 text-slate-400 hover:text-slate-700'
                        }`}
                      >
                        {chan === 'Email' && <Mail size={12} />}
                        {chan === 'SMS' && <Smartphone size={12} />}
                        {chan === 'Push' && <Sparkles size={12} />}
                        <span>{chan}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex gap-3 mt-4">
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="flex-1 bg-brand-olive hover:bg-[#131E18] text-brand-saffron font-display font-bold py-4 rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    {isLoading ? (
                      <RefreshCw className="animate-spin text-brand-saffron" size={16} />
                    ) : (
                      <>
                        <span>Save Gastronomy Profile</span>
                        <Check size={14} className="text-brand-saffron" />
                      </>
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      onLoginSuccess(email || 'demo.user@bibifood.com', {
                        firstName: firstName || 'Bibi',
                        lastName: lastName || 'User',
                        email: email || 'demo.user@bibifood.com',
                        phone: phone || '',
                        addresses: []
                      });
                      if (onClose) onClose();
                    }}
                    className="bg-slate-100 hover:bg-slate-200 text-slate-500 font-display font-bold px-6 py-4 rounded-xl transition-all cursor-pointer"
                  >
                    Skip
                  </button>
                </div>
              </form>
            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </div>
  );
}
