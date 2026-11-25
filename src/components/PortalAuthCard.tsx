import React, { useState } from 'react';
import {
  ShieldCheck,
  GraduationCap,
  Smartphone,
  KeyRound,
  UserPlus,
  CheckCircle2,
  AlertCircle,
  Eye,
  EyeOff,
  ArrowLeft,
} from 'lucide-react';
import { LearnerState, TeacherPartnerProfile } from '../types/education';

export type AuthTabMode = 'login' | 'signup' | 'forgot';
export type LoginSubMode = 'mobile_otp' | 'password';

export interface PortalAuthSuccessPayload {
  portal: 'admin' | 'partner';
  adminToken?: string;
  adminOtpDisabled?: boolean;
  state?: LearnerState;
  teacher?: TeacherPartnerProfile;
  account?: {
    id: string;
    role: 'admin' | 'partner';
    name: string;
    email: string;
    phone: string;
    teacherId?: string;
  };
}

interface PortalAuthCardProps {
  portal: 'admin' | 'partner';
  brandName: string;
  onAuthSuccess: (payload: PortalAuthSuccessPayload) => Promise<void> | void;
  onBackToStudentApp: () => void;
}

export const PortalAuthCard: React.FC<PortalAuthCardProps> = ({
  portal,
  brandName,
  onAuthSuccess,
  onBackToStudentApp,
}) => {
  const isAdminPortal = portal === 'admin';
  const [tab, setTab] = useState<AuthTabMode>('login');
  const [loginSubMode, setLoginSubMode] = useState<LoginSubMode>('mobile_otp');

  // Mobile OTP Login state (never prefill Owner Admin credentials)
  const [otpMobile, setOtpMobile] = useState(
    isAdminPortal ? '' : '9822345678'
  );
  const [otpOwnerEmail, setOtpOwnerEmail] = useState('');
  const [loginOtpSent, setLoginOtpSent] = useState(false);
  const [loginOtpHint, setLoginOtpHint] = useState('');
  const [loginMaskedTarget, setLoginMaskedTarget] = useState('');
  const [loginOtpInput, setLoginOtpInput] = useState('');

  // Password Login state (never prefill Owner Admin credentials)
  const [pwIdentifier, setPwIdentifier] = useState(
    isAdminPortal ? '' : 'priya.nair@vidyasetu.in'
  );
  const [pwInput, setPwInput] = useState('');
  const [showPw, setShowPw] = useState(false);

  // Signup state
  const [signupName, setSignupName] = useState('');
  const [signupMobile, setSignupMobile] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [signupSubject, setSignupSubject] = useState('');
  const [signupQualification, setSignupQualification] = useState('');
  const [signupOtpSent, setSignupOtpSent] = useState(false);
  const [signupOtpHint, setSignupOtpHint] = useState('');
  const [signupMaskedTarget, setSignupMaskedTarget] = useState('');
  const [signupOtpInput, setSignupOtpInput] = useState('');

  // Forgot Password state
  const [forgotIdentifier, setForgotIdentifier] = useState('');
  const [forgotOwnerEmail, setForgotOwnerEmail] = useState('');
  const [forgotOtpSent, setForgotOtpSent] = useState(false);
  const [forgotOtpHint, setForgotOtpHint] = useState('');
  const [forgotMaskedTarget, setForgotMaskedTarget] = useState('');
  const [forgotOtpInput, setForgotOtpInput] = useState('');
  const [forgotNewPassword, setForgotNewPassword] = useState('');
  const [forgotConfirmPassword, setForgotConfirmPassword] = useState('');
  const [forgotSuccessMsg, setForgotSuccessMsg] = useState('');

  const [errorMsg, setErrorMsg] = useState('');
  const [isBusy, setIsBusy] = useState(false);

  const clearFeedback = () => {
    setErrorMsg('');
    setForgotSuccessMsg('');
  };

  const requestOtp = async (
    purpose: 'login' | 'signup' | 'forgot_password',
    identifier: string,
    ownerEmail?: string
  ) => {
    clearFeedback();
    setIsBusy(true);
    try {
      const res = await fetch('/api/portal-auth/send-otp', {
        method: 'POST',
        credentials: 'same-origin',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ portal, purpose, identifier, ownerEmail }),
      });
      const rawText = await res.text();
      let data: { error?: string; otpHint?: string; maskedTarget?: string } = {};
      try {
        data = rawText ? JSON.parse(rawText) : {};
      } catch {
        data = {};
      }
      if (!res.ok) {
        const plainSnippet = rawText
          ? rawText.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim().slice(0, 120)
          : '';
        throw new Error(
          data.error ||
            `OTP bhejne me samasya aayi (HTTP ${res.status})${
              plainSnippet ? `: ${plainSnippet}` : '. Kripya inputs aur server connection check karein.'
            }`
        );
      }
      return {
        otpHint: String(data.otpHint || ''),
        maskedTarget: String(data.maskedTarget || identifier),
      };
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : 'Network error.');
      return null;
    } finally {
      setIsBusy(false);
    }
  };

  const handleSendLoginOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    const digits = otpMobile.replace(/\D/g, '');
    if (digits.length < 10) {
      setErrorMsg('Kripya valid 10-digit Mobile Number darj karein.');
      return;
    }
    if (isAdminPortal && !otpOwnerEmail.trim().includes('@')) {
      setErrorMsg('Owner verification ke liye Registered Owner Email darj karein.');
      return;
    }
    const result = await requestOtp(
      'login',
      digits.slice(-10),
      isAdminPortal ? otpOwnerEmail.trim() : undefined
    );
    if (result) {
      setLoginOtpHint(result.otpHint);
      setLoginMaskedTarget(result.maskedTarget);
      setLoginOtpInput('');
      setLoginOtpSent(true);
    }
  };

  const handleVerifyLoginOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    clearFeedback();
    const cleanOtp = loginOtpInput.trim();
    if (cleanOtp.length !== 6) {
      setErrorMsg('Kripya 6-digit OTP darj karein.');
      return;
    }
    setIsBusy(true);
    try {
      const res = await fetch('/api/portal-auth/login-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          portal,
          identifier: otpMobile.replace(/\D/g, '').slice(-10),
          otp: cleanOtp,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(data.error || 'Invalid OTP.');
      }
      await onAuthSuccess({
        portal,
        adminToken: data.adminToken,
        adminOtpDisabled: data.adminOtpDisabled,
        state: data.state,
        teacher: data.teacher,
        account: data.account,
      });
    } catch (err) {
      setErrorMsg(
        err instanceof Error ? err.message : 'OTP verification failed.'
      );
    } finally {
      setIsBusy(false);
    }
  };

  const handlePasswordLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    clearFeedback();
    if (!pwIdentifier.trim() || !pwInput.trim()) {
      setErrorMsg('Mobile Number / Email aur Password dono darj karein.');
      return;
    }
    setIsBusy(true);
    try {
      const res = await fetch('/api/portal-auth/login-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          portal,
          identifier: pwIdentifier.trim(),
          password: pwInput.trim(),
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(data.error || 'Login failed.');
      }
      await onAuthSuccess({
        portal,
        adminToken: data.adminToken,
        adminOtpDisabled: data.adminOtpDisabled,
        state: data.state,
        teacher: data.teacher,
        account: data.account,
      });
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : 'Login failed.');
    } finally {
      setIsBusy(false);
    }
  };

  const handleSendSignupOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    clearFeedback();
    const digits = signupMobile.replace(/\D/g, '');
    if (signupName.trim().length < 2) {
      setErrorMsg('Kripya apna poora naam darj karein.');
      return;
    }
    if (digits.length < 10) {
      setErrorMsg('Valid 10-digit mobile number zaroori hai.');
      return;
    }
    if (!signupEmail.trim().includes('@')) {
      setErrorMsg('Valid Email ID zaroori hai.');
      return;
    }
    if (signupPassword.trim().length < 4) {
      setErrorMsg('Password / PIN kam se kam 4 characters ka rakhein.');
      return;
    }
    const result = await requestOtp('signup', digits.slice(-10));
    if (result) {
      setSignupOtpHint(result.otpHint);
      setSignupMaskedTarget(result.maskedTarget);
      setSignupOtpInput('');
      setSignupOtpSent(true);
    }
  };

  const handleCompleteSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    clearFeedback();
    if (signupOtpInput.trim().length !== 6) {
      setErrorMsg('Kripya 6-digit verification OTP darj karein.');
      return;
    }
    setIsBusy(true);
    try {
      const res = await fetch('/api/portal-auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          portal,
          name: signupName.trim(),
          mobile: signupMobile.replace(/\D/g, '').slice(-10),
          email: signupEmail.trim(),
          password: signupPassword.trim(),
          otp: signupOtpInput.trim(),
          subjectExpertise: signupSubject.trim(),
          qualification: signupQualification.trim(),
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(data.error || 'Signup failed.');
      }
      await onAuthSuccess({
        portal,
        state: data.state,
        teacher: data.teacher,
        account: data.account,
      });
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : 'Signup failed.');
    } finally {
      setIsBusy(false);
    }
  };

  const handleSendForgotOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    clearFeedback();
    if (!forgotIdentifier.trim()) {
      setErrorMsg('Kripya apna registered Mobile Number darj karein.');
      return;
    }
    if (isAdminPortal && !forgotOwnerEmail.trim().includes('@')) {
      setErrorMsg('Owner verification ke liye Registered Owner Email darj karein.');
      return;
    }
    const result = await requestOtp(
      'forgot_password',
      forgotIdentifier.trim(),
      isAdminPortal ? forgotOwnerEmail.trim() : undefined
    );
    if (result) {
      setForgotOtpHint(result.otpHint);
      setForgotMaskedTarget(result.maskedTarget);
      setForgotOtpInput('');
      setForgotOtpSent(true);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    clearFeedback();
    if (forgotOtpInput.trim().length !== 6) {
      setErrorMsg('Kripya 6-digit OTP darj karein.');
      return;
    }
    if (forgotNewPassword.length < 4) {
      setErrorMsg('Naya password kam se kam 4 characters ka hona chahiye.');
      return;
    }
    if (forgotNewPassword !== forgotConfirmPassword) {
      setErrorMsg('Dono passwords match nahi kar rahe hain.');
      return;
    }
    setIsBusy(true);
    try {
      const res = await fetch('/api/portal-auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          portal,
          identifier: forgotIdentifier.trim(),
          ownerEmail: isAdminPortal ? forgotOwnerEmail.trim() : undefined,
          otp: forgotOtpInput.trim(),
          newPassword: forgotNewPassword,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(data.error || 'Password reset failed.');
      }
      setForgotSuccessMsg(
        data.message || 'Password successfully reset! Ab Login karein.'
      );
      setForgotOtpSent(false);
      setForgotOtpInput('');
      setForgotNewPassword('');
      setForgotConfirmPassword('');
    } catch (err) {
      setErrorMsg(
        err instanceof Error ? err.message : 'Password reset failed.'
      );
    } finally {
      setIsBusy(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-5 shadow-2xl">
        {/* Portal Brand Header */}
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-emerald-600 flex items-center justify-center shrink-0">
            {isAdminPortal ? (
              <ShieldCheck className="w-6 h-6 text-white" />
            ) : (
              <GraduationCap className="w-6 h-6 text-white" />
            )}
          </div>
          <div>
            <span className="inline-block px-2 py-0.5 rounded-md bg-emerald-600 text-white text-[11px] font-extrabold tracking-tight">
              BroSis
            </span>
            <h1 className="text-lg font-bold mt-0.5 leading-tight">
              {brandName} — {isAdminPortal ? 'Admin' : 'Partner'}
            </h1>
            <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
              {isAdminPortal
                ? 'Standalone Admin Web App'
                : 'Standalone Partner Web App'}
            </p>
          </div>
        </div>

        {/* Tabs: Admin has Owner-Only Login + Forgot PIN (NO Sign Up). Partner has Login | Sign Up | Forgot */}
        <div
          className={`grid gap-1 p-1 bg-slate-950 border border-slate-800 rounded-xl ${
            isAdminPortal ? 'grid-cols-2' : 'grid-cols-3'
          }`}
        >
          {(isAdminPortal
            ? [
                { id: 'login' as const, label: 'Owner Login', icon: KeyRound },
                { id: 'forgot' as const, label: 'Forgot PIN', icon: Smartphone },
              ]
            : [
                { id: 'login' as const, label: 'Login', icon: KeyRound },
                { id: 'signup' as const, label: 'Sign Up', icon: UserPlus },
                { id: 'forgot' as const, label: 'Forgot', icon: Smartphone },
              ]
          ).map((item) => {
            const Icon = item.icon;
            const active = tab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  setTab(item.id);
                  clearFeedback();
                }}
                className={`py-2 px-2 rounded-lg text-xs font-bold inline-flex items-center justify-center gap-1.5 transition-colors cursor-pointer whitespace-nowrap ${
                  active
                    ? 'bg-emerald-600 text-white'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>

        {/* TAB 1: LOGIN (Mobile OTP + Password/PIN) */}
        {tab === 'login' && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-1.5 p-1 bg-slate-950 border border-slate-800 rounded-xl">
              <button
                type="button"
                onClick={() => {
                  setLoginSubMode('mobile_otp');
                  clearFeedback();
                }}
                className={`py-2 px-2.5 rounded-lg text-xs font-semibold inline-flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
                  loginSubMode === 'mobile_otp'
                    ? 'bg-slate-800 text-emerald-400'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Smartphone className="w-3.5 h-3.5" />
                <span>Mobile OTP</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setLoginSubMode('password');
                  clearFeedback();
                }}
                className={`py-2 px-2.5 rounded-lg text-xs font-semibold inline-flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
                  loginSubMode === 'password'
                    ? 'bg-slate-800 text-emerald-400'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <KeyRound className="w-3.5 h-3.5" />
                <span>Password / PIN</span>
              </button>
            </div>

            {loginSubMode === 'mobile_otp' ? (
              !loginOtpSent ? (
                <form onSubmit={handleSendLoginOtp} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      {isAdminPortal ? 'Owner Mobile Number (+91)' : 'Registered Mobile Number (+91)'}
                    </label>
                    <div className="flex items-center gap-2">
                      <span className="px-3 py-2.5 text-sm font-mono-tabular bg-slate-950 border border-slate-700 rounded-xl text-slate-300">
                        +91
                      </span>
                      <input
                        type="tel"
                        required
                        maxLength={14}
                        value={otpMobile}
                        onChange={(e) => setOtpMobile(e.target.value)}
                        placeholder={
                          isAdminPortal ? 'Owner 10-digit mobile' : '10-digit mobile number'
                        }
                        className="flex-1 px-3.5 py-2.5 text-sm bg-slate-950 border border-slate-700 rounded-xl text-white font-mono-tabular focus:outline-none focus:border-emerald-500"
                      />
                    </div>
                  </div>

                  {isAdminPortal && (
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">
                        Owner Registered Email ID *
                      </label>
                      <input
                        type="email"
                        required
                        value={otpOwnerEmail}
                        onChange={(e) => setOtpOwnerEmail(e.target.value)}
                        placeholder="Enter owner verified email"
                        className="w-full px-3.5 py-2.5 text-sm bg-slate-950 border border-slate-700 rounded-xl text-white font-mono-tabular focus:outline-none focus:border-emerald-500"
                      />
                    </div>
                  )}

                  <p className="text-[11px] text-slate-400">
                    {isAdminPortal
                      ? 'Owner mobile aur email dono verify hone par hi 6-digit Admin OTP bheja jayega.'
                      : 'Mobile number dalein aur 6-digit OTP verify karke Partner App open karein.'}
                  </p>

                  {errorMsg && (
                    <div className="p-3 rounded-xl bg-rose-950/60 border border-rose-800 text-xs text-rose-300 flex items-start gap-2">
                      <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                      <span>{errorMsg}</span>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={isBusy}
                    className="w-full py-3 text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-800 rounded-xl transition-colors cursor-pointer"
                  >
                    {isBusy ? 'Sending OTP...' : 'Send 6-Digit Mobile OTP'}
                  </button>
                </form>
              ) : (
                <form onSubmit={handleVerifyLoginOtp} className="space-y-4">
                  <div className="p-3.5 bg-emerald-950/60 border border-emerald-700/70 rounded-xl text-xs text-emerald-200 space-y-1.5">
                    <p className="font-semibold">
                      SMS OTP sent to {loginMaskedTarget}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="font-mono-tabular">
                        Verification OTP:{' '}
                        <strong className="text-white">{loginOtpHint}</strong>
                      </span>
                      <button
                        type="button"
                        onClick={() => setLoginOtpInput(loginOtpHint)}
                        className="text-emerald-400 underline font-bold cursor-pointer"
                      >
                        Auto-Fill OTP
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Enter 6-Digit OTP
                    </label>
                    <input
                      type="text"
                      maxLength={6}
                      required
                      value={loginOtpInput}
                      onChange={(e) => setLoginOtpInput(e.target.value)}
                      placeholder="••••••"
                      className="w-full px-3.5 py-2.5 text-center text-lg tracking-widest bg-slate-950 border border-slate-700 rounded-xl text-white font-mono-tabular focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  {errorMsg && (
                    <div className="p-3 rounded-xl bg-rose-950/60 border border-rose-800 text-xs text-rose-300 flex items-start gap-2">
                      <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                      <span>{errorMsg}</span>
                    </div>
                  )}

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setLoginOtpSent(false);
                        clearFeedback();
                      }}
                      className="px-3.5 py-3 text-xs font-semibold text-slate-300 bg-slate-800 hover:bg-slate-700 rounded-xl cursor-pointer inline-flex items-center gap-1"
                    >
                      <ArrowLeft className="w-3.5 h-3.5" />
                      Back
                    </button>
                    <button
                      type="submit"
                      disabled={isBusy}
                      className="flex-1 py-3 text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-800 rounded-xl transition-colors cursor-pointer"
                    >
                      {isBusy
                        ? 'Verifying OTP...'
                        : `Verify OTP & Open ${isAdminPortal ? 'Admin' : 'Partner'}`}
                    </button>
                  </div>
                </form>
              )
            ) : (
              <form onSubmit={handlePasswordLogin} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    {isAdminPortal ? 'Owner Mobile Number or Email' : 'Mobile Number (+91) or Email ID'}
                  </label>
                  <input
                    type="text"
                    required
                    value={pwIdentifier}
                    onChange={(e) => setPwIdentifier(e.target.value)}
                    placeholder={
                      isAdminPortal
                        ? 'Registered Owner Mobile or Email'
                        : '9822345678 or teacher@vidyasetu.in'
                    }
                    className="w-full px-3.5 py-2.5 text-sm bg-slate-950 border border-slate-700 rounded-xl text-white font-mono-tabular focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-xs font-semibold text-slate-300">
                      Password / Security PIN
                    </label>
                    <button
                      type="button"
                      onClick={() => {
                        setTab('forgot');
                        setForgotIdentifier(pwIdentifier);
                        clearFeedback();
                      }}
                      className="text-[11px] font-semibold text-emerald-400 hover:underline cursor-pointer"
                    >
                      Forgot Password?
                    </button>
                  </div>
                  <div className="relative">
                    <input
                      type={showPw ? 'text' : 'password'}
                      required
                      value={pwInput}
                      onChange={(e) => setPwInput(e.target.value)}
                      placeholder="••••"
                      className="w-full px-3.5 py-2.5 pr-10 text-sm bg-slate-950 border border-slate-700 rounded-xl text-white font-mono-tabular focus:outline-none focus:border-emerald-500"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPw((p) => !p)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white cursor-pointer"
                      aria-label="Toggle password visibility"
                    >
                      {showPw ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>

                {errorMsg && (
                  <div className="p-3 rounded-xl bg-rose-950/60 border border-rose-800 text-xs text-rose-300 flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                    <span>{errorMsg}</span>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isBusy}
                  className="w-full py-3 text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-800 rounded-xl transition-colors cursor-pointer"
                >
                  {isBusy
                    ? 'Verifying...'
                    : `Open ${isAdminPortal ? 'Admin' : 'Partner'} Web App`}
                </button>
              </form>
            )}

            {/* Owner-Only Lock Notice on Admin, Quick Fill Demo Faculty on Partner */}
            {isAdminPortal ? (
              <div className="pt-3 border-t border-slate-800">
                <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl flex items-start gap-2.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    <strong className="text-slate-200">Owner-Only Lock Active:</strong>{' '}
                    Admin Sign Up disabled hai. Koi bhi doosra vyakti Admin Panel me login nahi kar sakta.
                  </p>
                </div>
              </div>
            ) : (
              <div className="pt-3 border-t border-slate-800 space-y-2">
                <p className="text-[11px] font-semibold text-slate-400">
                  Quick Fill Registered Faculty
                </p>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setOtpMobile('9822345678');
                      setPwIdentifier('9822345678');
                      setPwInput('9876');
                      clearFeedback();
                    }}
                    className="p-2.5 text-left bg-slate-950 hover:bg-slate-800/80 border border-slate-800 rounded-xl transition-colors cursor-pointer"
                  >
                    <p className="text-xs font-bold text-white truncate">
                      Dr. Priya Nair
                    </p>
                    <p className="text-[10px] text-slate-400 font-mono-tabular truncate">
                      +91 9822345678 · 9876
                    </p>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setOtpMobile('9811234567');
                      setPwIdentifier('9811234567');
                      setPwInput('9876');
                      clearFeedback();
                    }}
                    className="p-2.5 text-left bg-slate-950 hover:bg-slate-800/80 border border-slate-800 rounded-xl transition-colors cursor-pointer"
                  >
                    <p className="text-xs font-bold text-white truncate">
                      Prof. Arvind Mehta
                    </p>
                    <p className="text-[10px] text-slate-400 font-mono-tabular truncate">
                      +91 9811234567 · 9876
                    </p>
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 2: SIGN UP WITH MOBILE OTP (Partner Portal Only — Permanently hidden on Admin) */}
        {!isAdminPortal && tab === 'signup' && (
          <div className="space-y-4">
            {!signupOtpSent ? (
              <form onSubmit={handleSendSignupOtp} className="space-y-3.5">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={signupName}
                    onChange={(e) => setSignupName(e.target.value)}
                    placeholder={
                      isAdminPortal ? 'e.g. Akash Prasad' : 'e.g. Prof. R. K. Verma'
                    }
                    className="w-full px-3.5 py-2.5 text-sm bg-slate-950 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Mobile Number (+91) *
                  </label>
                  <div className="flex items-center gap-2">
                    <span className="px-3 py-2.5 text-sm font-mono-tabular bg-slate-950 border border-slate-700 rounded-xl text-slate-300">
                      +91
                    </span>
                    <input
                      type="tel"
                      required
                      maxLength={14}
                      value={signupMobile}
                      onChange={(e) => setSignupMobile(e.target.value)}
                      placeholder="10-digit mobile number"
                      className="flex-1 px-3.5 py-2.5 text-sm bg-slate-950 border border-slate-700 rounded-xl text-white font-mono-tabular focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Email ID *
                  </label>
                  <input
                    type="email"
                    required
                    value={signupEmail}
                    onChange={(e) => setSignupEmail(e.target.value)}
                    placeholder={
                      isAdminPortal ? 'admin@vidyasetu.in' : 'faculty@vidyasetu.in'
                    }
                    className="w-full px-3.5 py-2.5 text-sm bg-slate-950 border border-slate-700 rounded-xl text-white font-mono-tabular focus:outline-none focus:border-emerald-500"
                  />
                </div>

                {!isAdminPortal && (
                  <div className="grid grid-cols-2 gap-2.5">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">
                        Subject Expertise
                      </label>
                      <input
                        type="text"
                        value={signupSubject}
                        onChange={(e) => setSignupSubject(e.target.value)}
                        placeholder="e.g. Maths / UPSC"
                        className="w-full px-3 py-2 text-xs bg-slate-950 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-emerald-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">
                        Qualification
                      </label>
                      <input
                        type="text"
                        value={signupQualification}
                        onChange={(e) => setSignupQualification(e.target.value)}
                        placeholder="e.g. M.Sc., B.Ed"
                        className="w-full px-3 py-2 text-xs bg-slate-950 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-emerald-500"
                      />
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Create Password / PIN (min 4 chars) *
                  </label>
                  <input
                    type="password"
                    required
                    value={signupPassword}
                    onChange={(e) => setSignupPassword(e.target.value)}
                    placeholder="••••••"
                    className="w-full px-3.5 py-2.5 text-sm bg-slate-950 border border-slate-700 rounded-xl text-white font-mono-tabular focus:outline-none focus:border-emerald-500"
                  />
                </div>

                {errorMsg && (
                  <div className="p-3 rounded-xl bg-rose-950/60 border border-rose-800 text-xs text-rose-300 flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                    <span>{errorMsg}</span>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isBusy}
                  className="w-full py-3 text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-800 rounded-xl transition-colors cursor-pointer"
                >
                  {isBusy
                    ? 'Sending OTP...'
                    : 'Send Mobile Verification OTP & Sign Up'}
                </button>
              </form>
            ) : (
              <form onSubmit={handleCompleteSignup} className="space-y-4">
                <div className="p-3.5 bg-emerald-950/60 border border-emerald-700/70 rounded-xl text-xs text-emerald-200 space-y-1.5">
                  <p className="font-semibold">
                    Signup OTP sent to {signupMaskedTarget}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="font-mono-tabular">
                      Verification OTP:{' '}
                      <strong className="text-white">{signupOtpHint}</strong>
                    </span>
                    <button
                      type="button"
                      onClick={() => setSignupOtpInput(signupOtpHint)}
                      className="text-emerald-400 underline font-bold cursor-pointer"
                    >
                      Auto-Fill OTP
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Enter 6-Digit Mobile OTP
                  </label>
                  <input
                    type="text"
                    maxLength={6}
                    required
                    value={signupOtpInput}
                    onChange={(e) => setSignupOtpInput(e.target.value)}
                    placeholder="••••••"
                    className="w-full px-3.5 py-2.5 text-center text-lg tracking-widest bg-slate-950 border border-slate-700 rounded-xl text-white font-mono-tabular focus:outline-none focus:border-emerald-500"
                  />
                </div>

                {errorMsg && (
                  <div className="p-3 rounded-xl bg-rose-950/60 border border-rose-800 text-xs text-rose-300 flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                    <span>{errorMsg}</span>
                  </div>
                )}

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setSignupOtpSent(false);
                      clearFeedback();
                    }}
                    className="px-3.5 py-3 text-xs font-semibold text-slate-300 bg-slate-800 hover:bg-slate-700 rounded-xl cursor-pointer inline-flex items-center gap-1"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    Back
                  </button>
                  <button
                    type="submit"
                    disabled={isBusy}
                    className="flex-1 py-3 text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-800 rounded-xl transition-colors cursor-pointer"
                  >
                    {isBusy
                      ? 'Creating Account...'
                      : `Verify OTP & Create ${isAdminPortal ? 'Admin' : 'Partner'} Account`}
                  </button>
                </div>
              </form>
            )}
          </div>
        )}

        {/* TAB 3: FORGOT PASSWORD VIA MOBILE OTP */}
        {tab === 'forgot' && (
          <div className="space-y-4">
            {forgotSuccessMsg ? (
              <div className="p-5 bg-emerald-950/60 border border-emerald-700/70 rounded-xl text-center space-y-3">
                <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto" />
                <p className="text-xs text-emerald-100 leading-relaxed">
                  {forgotSuccessMsg}
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setTab('login');
                    setLoginSubMode('password');
                    setPwIdentifier(forgotIdentifier);
                    clearFeedback();
                  }}
                  className="w-full py-2.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl cursor-pointer"
                >
                  Login with New Password / Mobile OTP
                </button>
              </div>
            ) : !forgotOtpSent ? (
              <form onSubmit={handleSendForgotOtp} className="space-y-4">
                <p className="text-xs text-slate-300 leading-relaxed">
                  Apna registered <strong>Mobile Number</strong> ya{' '}
                  <strong>Email ID</strong> dalein. Hum 6-digit OTP bhejenge
                  jisse aap naya password set kar sakein.
                </p>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    {isAdminPortal ? 'Owner Registered Mobile (+91) *' : 'Registered Mobile Number (+91) or Email'}
                  </label>
                  <input
                    type="text"
                    required
                    value={forgotIdentifier}
                    onChange={(e) => setForgotIdentifier(e.target.value)}
                    placeholder={
                      isAdminPortal
                        ? 'Owner 10-digit mobile number'
                        : '9822345678 or teacher@vidyasetu.in'
                    }
                    className="w-full px-3.5 py-2.5 text-sm bg-slate-950 border border-slate-700 rounded-xl text-white font-mono-tabular focus:outline-none focus:border-emerald-500"
                  />
                </div>

                {isAdminPortal && (
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Owner Registered Email ID *
                    </label>
                    <input
                      type="email"
                      required
                      value={forgotOwnerEmail}
                      onChange={(e) => setForgotOwnerEmail(e.target.value)}
                      placeholder="Enter owner verified email"
                      className="w-full px-3.5 py-2.5 text-sm bg-slate-950 border border-slate-700 rounded-xl text-white font-mono-tabular focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                )}

                {errorMsg && (
                  <div className="p-3 rounded-xl bg-rose-950/60 border border-rose-800 text-xs text-rose-300 flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                    <span>{errorMsg}</span>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isBusy}
                  className="w-full py-3 text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-800 rounded-xl transition-colors cursor-pointer"
                >
                  {isBusy ? 'Sending Reset OTP...' : 'Send Password Reset OTP'}
                </button>
              </form>
            ) : (
              <form onSubmit={handleResetPassword} className="space-y-3.5">
                <div className="p-3.5 bg-emerald-950/60 border border-emerald-700/70 rounded-xl text-xs text-emerald-200 space-y-1.5">
                  <p className="font-semibold">
                    Reset OTP sent to {forgotMaskedTarget}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="font-mono-tabular">
                      Reset OTP:{' '}
                      <strong className="text-white">{forgotOtpHint}</strong>
                    </span>
                    <button
                      type="button"
                      onClick={() => setForgotOtpInput(forgotOtpHint)}
                      className="text-emerald-400 underline font-bold cursor-pointer"
                    >
                      Auto-Fill OTP
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Enter 6-Digit Reset OTP
                  </label>
                  <input
                    type="text"
                    maxLength={6}
                    required
                    value={forgotOtpInput}
                    onChange={(e) => setForgotOtpInput(e.target.value)}
                    placeholder="••••••"
                    className="w-full px-3.5 py-2.5 text-center text-lg tracking-widest bg-slate-950 border border-slate-700 rounded-xl text-white font-mono-tabular focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    New Password / PIN (min 4 chars)
                  </label>
                  <input
                    type="password"
                    required
                    value={forgotNewPassword}
                    onChange={(e) => setForgotNewPassword(e.target.value)}
                    placeholder="••••••"
                    className="w-full px-3.5 py-2.5 text-sm bg-slate-950 border border-slate-700 rounded-xl text-white font-mono-tabular focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Confirm New Password / PIN
                  </label>
                  <input
                    type="password"
                    required
                    value={forgotConfirmPassword}
                    onChange={(e) => setForgotConfirmPassword(e.target.value)}
                    placeholder="••••••"
                    className="w-full px-3.5 py-2.5 text-sm bg-slate-950 border border-slate-700 rounded-xl text-white font-mono-tabular focus:outline-none focus:border-emerald-500"
                  />
                </div>

                {errorMsg && (
                  <div className="p-3 rounded-xl bg-rose-950/60 border border-rose-800 text-xs text-rose-300 flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                    <span>{errorMsg}</span>
                  </div>
                )}

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setForgotOtpSent(false);
                      clearFeedback();
                    }}
                    className="px-3.5 py-3 text-xs font-semibold text-slate-300 bg-slate-800 hover:bg-slate-700 rounded-xl cursor-pointer inline-flex items-center gap-1"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    Back
                  </button>
                  <button
                    type="submit"
                    disabled={isBusy}
                    className="flex-1 py-3 text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-800 rounded-xl transition-colors cursor-pointer"
                  >
                    {isBusy ? 'Saving Password...' : 'Verify OTP & Save Password'}
                  </button>
                </div>
              </form>
            )}
          </div>
        )}

        <button
          type="button"
          onClick={onBackToStudentApp}
          className="w-full py-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors cursor-pointer"
        >
          ← Back to Student App
        </button>
      </div>
    </div>
  );
};
