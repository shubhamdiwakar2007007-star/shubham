import React, { useState, useEffect } from 'react';
import { X, Lock, Mail, User, ShieldCheck, Sparkles, ArrowRight, Eye, EyeOff, AlertCircle, CheckCircle2, Phone, KeyRound } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { TasteHubLogo } from '../common/TasteHubLogo';

export const AuthModal: React.FC = () => {
  const {
    isAuthOpen,
    setIsAuthOpen,
    authModalTab,
    setAuthModalTab,
    loginUser,
    registerUser,
    loginAsCustomer,
    loginAsAdmin,
    requestPasswordReset,
    resetPassword
  } = useApp();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState<'customer' | 'admin'>('customer');

  // Password reset specific
  const [resetCode, setResetCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [resetStep, setResetStep] = useState<'request' | 'verify'>('request');
  const [sentCodeHint, setSentCodeHint] = useState<string | null>(null);

  // UI helpers
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Reset errors when tab changes
  useEffect(() => {
    setErrorMessage(null);
    setSuccessMessage(null);
    setShowPassword(false);
    setResetStep('request');
    setSentCodeHint(null);
  }, [authModalTab, isAuthOpen]);

  if (!isAuthOpen) return null;

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    const cleanEmail = email.trim();
    if (!cleanEmail) {
      setErrorMessage('Please enter your email address.');
      return;
    }
    if (!password) {
      setErrorMessage('Please enter your password.');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await loginUser(cleanEmail, password);
      if (!res.success) {
        setErrorMessage(res.message || 'Login failed. Please check your credentials.');
      }
    } catch {
      setErrorMessage('A network or server error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    const cleanName = name.trim();
    const cleanEmail = email.trim();

    if (!cleanName || cleanName.length < 2) {
      setErrorMessage('Please enter your full name (at least 2 characters).');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(cleanEmail)) {
      setErrorMessage('Please enter a valid email address (e.g. name@example.com).');
      return;
    }

    if (password.length < 8) {
      setErrorMessage('Password must be at least 8 characters long.');
      return;
    }

    if (!/[A-Za-z]/.test(password) || !/[0-9]/.test(password)) {
      setErrorMessage('Password must contain at least one letter and one number.');
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match. Please re-enter carefully.');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await registerUser({
        name: cleanName,
        email: cleanEmail,
        password,
        phone: phone.trim() || undefined,
        role
      });
      if (!res.success) {
        setErrorMessage(res.message || 'Registration failed.');
      }
    } catch {
      setErrorMessage('A network or server error occurred during registration.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRequestResetCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    const cleanEmail = email.trim();
    if (!cleanEmail) {
      setErrorMessage('Please enter your registered email address.');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await requestPasswordReset(cleanEmail);
      if (res.success) {
        setResetStep('verify');
        setSentCodeHint(res.code || '123456');
        setSuccessMessage(`Reset code generated for ${cleanEmail}!`);
      } else {
        setErrorMessage(res.message);
      }
    } catch {
      setErrorMessage('Could not send reset code. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleVerifyAndResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    if (!resetCode.trim()) {
      setErrorMessage('Please enter the 6-digit verification code.');
      return;
    }

    if (newPassword.length < 8 || !/[A-Za-z]/.test(newPassword) || !/[0-9]/.test(newPassword)) {
      setErrorMessage('New password must be at least 8 characters with letters and numbers.');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await resetPassword(email.trim(), resetCode.trim(), newPassword);
      if (res.success) {
        setSuccessMessage('Password updated successfully! Please sign in with your new password.');
        setPassword('');
        setTimeout(() => {
          setAuthModalTab('signin');
        }, 1800);
      } else {
        setErrorMessage(res.message);
      }
    } catch {
      setErrorMessage('Error resetting password. Please check your code.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div
        onClick={() => setIsAuthOpen(false)}
        className="fixed inset-0 bg-black/75 backdrop-blur-sm transition-opacity"
      />

      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden z-10 animate-scaleUp">
          {/* Header Banner */}
          <div className="bg-[#111111] p-6 text-white text-center relative border-b border-neutral-800">
            <button
              onClick={() => setIsAuthOpen(false)}
              aria-label="Close dialog"
              className="absolute top-4 right-4 text-neutral-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="flex justify-center mb-2">
              <TasteHubLogo theme="dark" size="md" />
            </div>
            <p className="text-xs text-neutral-400">
              Fresh food. Seamless delivery. Verified accounts.
            </p>
          </div>

          {/* Quick Demo Access Bar */}
          <div className="bg-amber-50/80 border-b border-amber-200/80 p-3.5">
            <div className="text-[11px] font-bold text-amber-900 flex items-center justify-between mb-2">
              <div className="flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#FF7518]" />
                <span>Instant Pre-configured Accounts</span>
              </div>
              <span className="text-[10px] text-amber-700">One-click test</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                disabled={isSubmitting}
                onClick={async () => {
                  setIsSubmitting(true);
                  await loginAsCustomer();
                  setIsSubmitting(false);
                }}
                className="py-1.5 px-2 bg-white hover:bg-neutral-50 text-neutral-800 border border-neutral-300 rounded-xl text-xs font-semibold shadow-sm transition-all text-center active:scale-95 disabled:opacity-50"
              >
                👤 Customer Demo
              </button>
              <button
                type="button"
                disabled={isSubmitting}
                onClick={async () => {
                  setIsSubmitting(true);
                  await loginAsAdmin();
                  setIsSubmitting(false);
                }}
                className="py-1.5 px-2 bg-[#FF7518] hover:bg-[#e0630d] text-white rounded-xl text-xs font-bold shadow-sm transition-all text-center flex items-center justify-center gap-1 active:scale-95 disabled:opacity-50"
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Admin Demo</span>
              </button>
            </div>
          </div>

          {/* Form Tabs */}
          <div className="p-6">
            <div className="flex border-b border-neutral-200 mb-5">
              <button
                type="button"
                onClick={() => setAuthModalTab('signin')}
                className={`flex-1 pb-2.5 text-xs font-bold transition-all ${
                  authModalTab === 'signin'
                    ? 'border-b-2 border-[#FF7518] text-[#FF7518]'
                    : 'text-neutral-400 hover:text-neutral-700'
                }`}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => setAuthModalTab('signup')}
                className={`flex-1 pb-2.5 text-xs font-bold transition-all ${
                  authModalTab === 'signup'
                    ? 'border-b-2 border-[#FF7518] text-[#FF7518]'
                    : 'text-neutral-400 hover:text-neutral-700'
                }`}
              >
                Create Account
              </button>
              {authModalTab === 'forgot' && (
                <button
                  type="button"
                  className="flex-1 pb-2.5 text-xs font-bold border-b-2 border-[#FF7518] text-[#FF7518]"
                >
                  Reset Password
                </button>
              )}
            </div>

            {/* Error Message Box */}
            {errorMessage && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl flex items-start gap-2.5 text-xs text-red-700 animate-shake">
                <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Success Message Box */}
            {successMessage && (
              <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-start gap-2.5 text-xs text-emerald-800">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>{successMessage}</span>
              </div>
            )}

            {/* TAB 1: SIGN IN */}
            {authModalTab === 'signin' && (
              <form onSubmit={handleSignIn} className="space-y-3.5">
                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-1">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="name@example.com"
                      className="w-full pl-9 pr-3 py-2.5 text-xs bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:border-[#FF7518]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-1">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full pl-9 pr-10 py-2.5 text-xs bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:border-[#FF7518]"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-700"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div className="flex justify-between items-center pt-1">
                  <span className="text-[11px] text-neutral-500">
                    Seed test: rahul.sharma@example.com / Password123!
                  </span>
                  <button
                    type="button"
                    onClick={() => setAuthModalTab('forgot')}
                    className="text-[11px] text-[#FF7518] hover:underline font-bold"
                  >
                    Forgot Password?
                  </button>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3 bg-[#FF7518] hover:bg-[#e0630d] text-white font-bold text-xs rounded-xl shadow-md shadow-orange-500/20 transition-all flex items-center justify-center gap-2 active:scale-95 disabled:opacity-60"
                >
                  {isSubmitting ? (
                    <div className="flex items-center gap-2">
                      <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Verifying Credentials...</span>
                    </div>
                  ) : (
                    <>
                      <span>Sign In to TasteHub</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </>
                  )}
                </button>
              </form>
            )}

            {/* TAB 2: SIGN UP (CREATE ACCOUNT) */}
            {authModalTab === 'signup' && (
              <form onSubmit={handleSignUp} className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-1">
                    Full Name *
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Anjali Gupta"
                      className="w-full pl-9 pr-3 py-2 text-xs bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:border-[#FF7518]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-1">
                    Email Address *
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="name@example.com"
                      className="w-full pl-9 pr-3 py-2 text-xs bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:border-[#FF7518]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-1">
                    Phone Number (Optional)
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+91 98765 00000"
                      className="w-full pl-9 pr-3 py-2 text-xs bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:border-[#FF7518]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs font-semibold text-neutral-700 mb-1">
                      Password *
                    </label>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Min 8 chars"
                        className="w-full pl-8 pr-2 py-2 text-xs bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:border-[#FF7518]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-neutral-700 mb-1">
                      Confirm Password *
                    </label>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        required
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Re-enter password"
                        className="w-full pl-8 pr-2 py-2 text-xs bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:border-[#FF7518]"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between text-[11px] text-neutral-500 pt-0.5">
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={showPassword}
                      onChange={(e) => setShowPassword(e.target.checked)}
                      className="rounded text-[#FF7518] focus:ring-[#FF7518] w-3 h-3"
                    />
                    <span>Show password</span>
                  </label>

                  <span className="text-[10px] text-neutral-400">Must include letters & numbers</span>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full mt-2 py-3 bg-[#FF7518] hover:bg-[#e0630d] text-white font-bold text-xs rounded-xl shadow-md shadow-orange-500/20 transition-all flex items-center justify-center gap-2 active:scale-95 disabled:opacity-60"
                >
                  {isSubmitting ? (
                    <div className="flex items-center gap-2">
                      <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Creating Account...</span>
                    </div>
                  ) : (
                    <>
                      <span>Create TasteHub Account</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </>
                  )}
                </button>
              </form>
            )}

            {/* TAB 3: FORGOT / RESET PASSWORD */}
            {authModalTab === 'forgot' && (
              <div className="space-y-4">
                {resetStep === 'request' ? (
                  <form onSubmit={handleRequestResetCode} className="space-y-3.5">
                    <p className="text-xs text-neutral-600 leading-relaxed">
                      Enter the email address associated with your TasteHub account. We will send you a 6-digit verification code to reset your password.
                    </p>

                    <div>
                      <label className="block text-xs font-semibold text-neutral-700 mb-1">
                        Registered Email Address
                      </label>
                      <div className="relative">
                        <Mail className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                        <input
                          type="email"
                          required
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="name@example.com"
                          className="w-full pl-9 pr-3 py-2.5 text-xs bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:border-[#FF7518]"
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full py-3 bg-[#FF7518] hover:bg-[#e0630d] text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-60"
                    >
                      {isSubmitting ? 'Sending Code...' : 'Send Verification Code'}
                    </button>

                    <div className="text-center pt-2">
                      <button
                        type="button"
                        onClick={() => setAuthModalTab('signin')}
                        className="text-xs text-neutral-500 hover:text-neutral-900"
                      >
                        ← Return to Sign In
                      </button>
                    </div>
                  </form>
                ) : (
                  <form onSubmit={handleVerifyAndResetPassword} className="space-y-3.5">
                    {sentCodeHint && (
                      <div className="p-2.5 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900 flex items-center justify-between">
                        <span>Verification code sent:</span>
                        <strong className="tracking-widest font-mono text-sm bg-white px-2 py-0.5 rounded border border-amber-300">
                          {sentCodeHint}
                        </strong>
                      </div>
                    )}

                    <div>
                      <label className="block text-xs font-semibold text-neutral-700 mb-1">
                        6-Digit Verification Code
                      </label>
                      <div className="relative">
                        <KeyRound className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                        <input
                          type="text"
                          required
                          maxLength={6}
                          value={resetCode}
                          onChange={(e) => setResetCode(e.target.value)}
                          placeholder="e.g. 123456"
                          className="w-full pl-9 pr-3 py-2.5 text-xs bg-neutral-50 border border-neutral-200 rounded-xl font-mono tracking-wider focus:outline-none focus:border-[#FF7518]"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-neutral-700 mb-1">
                        New Password (Min 8 characters)
                      </label>
                      <div className="relative">
                        <Lock className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                        <input
                          type="password"
                          required
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          placeholder="Letters and numbers"
                          className="w-full pl-9 pr-3 py-2.5 text-xs bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:border-[#FF7518]"
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full py-3 bg-[#FF7518] hover:bg-[#e0630d] text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-60"
                    >
                      {isSubmitting ? 'Updating Password...' : 'Save New Password & Sign In'}
                    </button>
                  </form>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
