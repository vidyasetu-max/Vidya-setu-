import React, { useState } from 'react';
import { X, Mail, Smartphone, CheckCircle2, LogOut, ShieldCheck } from 'lucide-react';
import { StudyMedium, UserAccount } from '../types/education';

interface AuthLoginModalProps {
  user: UserAccount | null;
  medium: StudyMedium;
  onClose: () => void;
  onLogin: (payload: {
    name: string;
    method: 'gmail' | 'mobile';
    identifier: string;
    otp?: string;
  }) => Promise<void>;
  onLogout: () => Promise<void>;
}

export const AuthLoginModal: React.FC<AuthLoginModalProps> = ({
  user,
  medium,
  onClose,
  onLogin,
  onLogout,
}) => {
  const [method, setMethod] = useState<'gmail' | 'mobile'>('gmail');
  const [name, setName] = useState('');
  const [gmailInput, setGmailInput] = useState('');
  const [mobileInput, setMobileInput] = useState('');

  const [otpSent, setOtpSent] = useState(false);
  const [generatedOtp, setGeneratedOtp] = useState('');
  const [otpMaskedTarget, setOtpMaskedTarget] = useState('');
  const [otpProviderLabel, setOtpProviderLabel] = useState('');
  const [otpInput, setOtpInput] = useState('');
  const [error, setError] = useState('');
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Forgot / Reset Password State
  const [authMode, setAuthMode] = useState<'login' | 'forgot_password'>('login');
  const [resetIdentifier, setResetIdentifier] = useState('');
  const [resetOtpSent, setResetOtpSent] = useState(false);
  const [resetGeneratedOtp, setResetGeneratedOtp] = useState('');
  const [resetOtpInput, setResetOtpInput] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [resetSuccess, setResetSuccess] = useState(false);

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    let targetIdentifier = '';
    if (method === 'gmail') {
      const email = gmailInput.trim();
      if (!email || !email.includes('@')) {
        setError(
          medium === 'hi'
            ? 'Kripya valid Gmail ID darj karein.'
            : 'Please enter a valid Gmail ID.'
        );
        return;
      }
      targetIdentifier = email;
    } else {
      const digits = mobileInput.replace(/\D/g, '');
      if (digits.length < 10) {
        setError(
          medium === 'hi'
            ? 'Kripya 10-digit mobile number darj karein.'
            : 'Please enter a valid 10-digit mobile number.'
        );
        return;
      }
      targetIdentifier = digits.slice(-10);
    }

    setIsSendingOtp(true);
    try {
      const res = await fetch('/api/student/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          method,
          identifier: targetIdentifier,
          purpose: 'login',
        }),
      });
      const rawText = await res.text();
      let data: {
        error?: string;
        otpHint?: string;
        maskedTarget?: string;
        provider?: string;
      } = {};
      try {
        data = rawText ? JSON.parse(rawText) : {};
      } catch {
        data = {};
      }
      if (!res.ok) {
        throw new Error(
          data.error ||
            (medium === 'hi'
              ? `OTP bhejne me samasya aayi (HTTP ${res.status}).`
              : `Failed to send OTP (HTTP ${res.status}).`)
        );
      }
      setGeneratedOtp(String(data.otpHint || ''));
      setOtpMaskedTarget(String(data.maskedTarget || targetIdentifier));
      setOtpProviderLabel(String(data.provider || 'Vidya Setu OTP Gateway'));
      setOtpInput('');
      setOtpSent(true);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : medium === 'hi'
          ? 'OTP bhejne me network error aayi.'
          : 'Network error while sending OTP.'
      );
    } finally {
      setIsSendingOtp(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const cleanOtp = otpInput.trim();
    if (cleanOtp.length !== 6) {
      setError(
        medium === 'hi'
          ? 'Kripya 6-digit OTP darj karein.'
          : 'Please enter the 6-digit OTP.'
      );
      return;
    }
    setIsSubmitting(true);
    try {
      const identifier =
        method === 'gmail'
          ? gmailInput.trim()
          : `+91 ${mobileInput.replace(/\D/g, '').slice(-10)}`;

      await onLogin({
        name: name.trim(),
        method: method === 'mobile' ? 'mobile' : 'gmail',
        identifier,
        otp: cleanOtp,
      });
      onClose();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : medium === 'hi'
          ? 'OTP verify karne me samasya aayi.'
          : 'OTP verification failed.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-slate-900/60 flex items-center justify-center p-4 overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-labelledby="auth-modal-title"
    >
      <div className="bg-white border border-slate-200 rounded-2xl max-w-md w-full overflow-hidden my-8">
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
            <h2 id="auth-modal-title" className="text-base font-bold">
              {user
                ? medium === 'hi'
                  ? 'Student Account Verified'
                  : 'Student Account Verified'
                : medium === 'hi'
                ? 'Gmail ID ya Mobile OTP se Login Karein'
                : 'Sign In with Gmail ID or Mobile OTP'}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close login modal"
            className="p-1.5 text-slate-300 hover:text-white rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-5">
          {user ? (
            <div className="space-y-4">
              <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-bold text-slate-900">{user.name}</p>
                  <p className="text-xs text-slate-700 font-mono-tabular mt-0.5">
                    {user.identifier}
                  </p>
                  <p className="text-[11px] text-emerald-800 mt-1">
                    12 Months LMS Access &amp; Notifications Active
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={async () => {
                  await onLogout();
                  onClose();
                }}
                className="w-full py-2.5 px-4 text-xs font-semibold text-red-700 bg-red-50 hover:bg-red-100 border border-red-200 rounded-xl inline-flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
                <span>{medium === 'hi' ? 'Logout Karein' : 'Sign Out'}</span>
              </button>
            </div>
          ) : authMode === 'login' ? (
            <div>
              {/* Method Tabs: Gmail ID vs Mobile OTP */}
              <div className="grid grid-cols-2 gap-1.5 p-1 bg-slate-100 rounded-xl">
                <button
                  type="button"
                  onClick={() => {
                    setMethod('gmail');
                    setOtpSent(false);
                    setError('');
                  }}
                  className={`py-2 px-3 rounded-lg text-xs font-semibold inline-flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
                    method === 'gmail'
                      ? 'bg-white text-slate-900 shadow-sm'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Mail className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Gmail OTP</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setMethod('mobile');
                    setOtpSent(false);
                    setError('');
                  }}
                  className={`py-2 px-3 rounded-lg text-xs font-semibold inline-flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
                    method === 'mobile'
                      ? 'bg-white text-slate-900 shadow-sm'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Smartphone className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Mobile OTP</span>
                </button>
              </div>

              {!otpSent ? (
                <form onSubmit={handleSendOtp} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      {medium === 'hi' ? 'Student Name (Optional)' : 'Student Name (Optional)'}
                    </label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Aarav Sharma"
                      className="w-full px-3.5 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-600"
                    />
                  </div>

                  {method === 'gmail' ? (
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Gmail ID
                      </label>
                      <input
                        type="email"
                        value={gmailInput}
                        onChange={(e) => setGmailInput(e.target.value)}
                        placeholder="student@gmail.com"
                        required
                        className="w-full px-3.5 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-600 font-mono-tabular"
                      />
                    </div>
                  ) : (
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Mobile Number (+91)
                      </label>
                      <div className="flex items-center gap-2">
                        <span className="px-3 py-2.5 text-sm font-mono-tabular bg-slate-100 border border-slate-200 rounded-xl text-slate-700">
                          +91
                        </span>
                        <input
                          type="tel"
                          value={mobileInput}
                          onChange={(e) => setMobileInput(e.target.value)}
                          placeholder="9876543210"
                          required
                          className="flex-1 px-3.5 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-600 font-mono-tabular"
                        />
                      </div>
                    </div>
                  )}

                  <div className="flex items-center justify-between pt-1">
                    <button
                      type="button"
                      onClick={() => {
                        setAuthMode('forgot_password');
                        setError('');
                        setResetSuccess(false);
                      }}
                      className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 hover:underline cursor-pointer"
                    >
                      {medium === 'hi'
                        ? 'पासवर्ड भूल गए? (Forgot Password)'
                        : 'Forgot / Reset Password?'}
                    </button>
                    <span className="text-[10px] text-slate-400">100% Secure OTP</span>
                  </div>

                  {error && <p className="text-xs text-red-600 font-medium">{error}</p>}

                  <button
                    type="submit"
                    disabled={isSendingOtp}
                    className="w-full py-3 text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-400 rounded-xl transition-colors cursor-pointer"
                  >
                    {isSendingOtp
                      ? medium === 'hi'
                        ? 'OTP Bhej Rahe Hain...'
                        : 'Sending OTP...'
                      : medium === 'hi'
                      ? 'OTP Bhejein (Send OTP)'
                      : 'Send 6-Digit OTP'}
                  </button>
                </form>
              ) : (
                <form onSubmit={handleVerifyOtp} className="space-y-4">
                  <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-900 space-y-1">
                    <p className="font-semibold">
                      {method === 'gmail'
                        ? `OTP sent to ${otpMaskedTarget || gmailInput}`
                        : `SMS OTP sent to ${otpMaskedTarget || `+91 ${mobileInput}`}`}
                    </p>
                    {otpProviderLabel && (
                      <p className="text-[10px] text-emerald-700">
                        Gateway: {otpProviderLabel}
                      </p>
                    )}
                    <div className="flex items-center justify-between pt-1">
                      <span className="font-mono-tabular">
                        Verification OTP: <strong>{generatedOtp}</strong>
                      </span>
                      <button
                        type="button"
                        onClick={() => setOtpInput(generatedOtp)}
                        className="text-emerald-700 underline font-semibold cursor-pointer"
                      >
                        Auto-Fill OTP
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      {medium === 'hi' ? '6-Digit OTP Darj Karein' : 'Enter 6-Digit OTP'}
                    </label>
                    <input
                      type="text"
                      maxLength={6}
                      value={otpInput}
                      onChange={(e) => setOtpInput(e.target.value)}
                      placeholder="••••••"
                      required
                      className="w-full px-3.5 py-2.5 text-center text-lg tracking-widest border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-600 font-mono-tabular"
                    />
                  </div>

                  {error && <p className="text-xs text-red-600 font-medium">{error}</p>}

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setOtpSent(false)}
                      className="px-4 py-3 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors cursor-pointer"
                    >
                      Back
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="flex-1 py-3 text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-400 rounded-xl transition-colors cursor-pointer"
                    >
                      {isSubmitting
                        ? 'Verifying...'
                        : medium === 'hi'
                        ? 'Verify & Login Karein'
                        : 'Verify & Sign In'}
                    </button>
                  </div>
                </form>
              )}
            </div>
          ) : (
            /* FORGOT / RESET PASSWORD FORM */
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <span className="text-xs font-bold text-slate-800">
                  {medium === 'hi'
                    ? 'विद्या सेतु छात्र पासवर्ड रीसेट (Password Reset)'
                    : 'Student Password Reset'}
                </span>
                <button
                  type="button"
                  onClick={() => {
                    setAuthMode('login');
                    setError('');
                    setResetSuccess(false);
                  }}
                  className="text-xs font-semibold text-emerald-700 hover:underline cursor-pointer"
                >
                  ← Back to Login
                </button>
              </div>

              {resetSuccess ? (
                <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl space-y-3 text-center">
                  <div className="w-10 h-10 rounded-full bg-emerald-600 text-white flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-emerald-900">
                      {medium === 'hi' ? 'पासवर्ड सफलतापूर्वक बदल दिया गया!' : 'Password Reset Successful!'}
                    </h4>
                    <p className="text-xs text-emerald-700 mt-1">
                      {medium === 'hi'
                        ? 'Aapka naya password secure save ho gaya hai. Ab aap naye password se login kar sakte hain.'
                        : 'Your new password has been securely saved. You can now login with your updated credentials.'}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setAuthMode('login');
                      setResetSuccess(false);
                    }}
                    className="w-full py-2.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl cursor-pointer"
                  >
                    Go to Login (लॉगिन करें)
                  </button>
                </div>
              ) : !resetOtpSent ? (
                <form
                  onSubmit={async (e) => {
                    e.preventDefault();
                    setError('');
                    if (!resetIdentifier.trim()) {
                      setError(
                        medium === 'hi'
                          ? 'Kripya Gmail ID ya Mobile Number darj karein.'
                          : 'Please enter your Gmail or Mobile.'
                      );
                      return;
                    }
                    setIsSendingOtp(true);
                    try {
                      const res = await fetch('/api/student/send-otp', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                          identifier: resetIdentifier.trim(),
                          purpose: 'forgot_password',
                        }),
                      });
                      const data = await res.json().catch(() => ({}));
                      if (!res.ok) {
                        throw new Error(
                          data.error || `Failed to send reset code (HTTP ${res.status}).`
                        );
                      }
                      setResetGeneratedOtp(String(data.otpHint || ''));
                      setResetOtpInput('');
                      setResetOtpSent(true);
                    } catch (err) {
                      setError(
                        err instanceof Error
                          ? err.message
                          : 'Reset code bhejne me samasya aayi.'
                      );
                    } finally {
                      setIsSendingOtp(false);
                    }
                  }}
                  className="space-y-4"
                >
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {medium === 'hi'
                      ? 'Apna registered Gmail ID ya Mobile number darj karein. Hum 6-digit verification code bhejenge.'
                      : 'Enter your registered Gmail ID or Mobile number to receive a 6-digit password reset code.'}
                  </p>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Registered Gmail ID or Mobile (+91)
                    </label>
                    <input
                      type="text"
                      required
                      value={resetIdentifier}
                      onChange={(e) => setResetIdentifier(e.target.value)}
                      placeholder="student@gmail.com or 9876543210"
                      className="w-full px-3.5 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-600 font-mono-tabular"
                    />
                  </div>

                  {error && <p className="text-xs text-red-600 font-medium">{error}</p>}

                  <button
                    type="submit"
                    disabled={isSendingOtp}
                    className="w-full py-3 text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-400 rounded-xl transition-colors cursor-pointer"
                  >
                    {isSendingOtp
                      ? 'Sending Code...'
                      : medium === 'hi'
                      ? 'Reset Code Bhejein (Send Code)'
                      : 'Send Reset Code'}
                  </button>
                </form>
              ) : (
                <form
                  onSubmit={async (e) => {
                    e.preventDefault();
                    setError('');
                    if (resetOtpInput.trim().length !== 6) {
                      setError('Please enter the 6-digit reset code.');
                      return;
                    }
                    if (newPassword.length < 4) {
                      setError('New password must be at least 4 characters.');
                      return;
                    }
                    if (newPassword !== confirmPassword) {
                      setError('Passwords do not match.');
                      return;
                    }
                    setIsSubmitting(true);
                    try {
                      const res = await fetch('/api/student/reset-password', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                          identifier: resetIdentifier.trim(),
                          newPassword,
                          otp: resetOtpInput.trim(),
                        }),
                      });
                      const data = await res.json().catch(() => ({}));
                      if (!res.ok) {
                        throw new Error(
                          data.error || `Failed to reset password (HTTP ${res.status}).`
                        );
                      }
                      setResetSuccess(true);
                    } catch (err) {
                      setError(
                        err instanceof Error
                          ? err.message
                          : 'Password reset failed.'
                      );
                    } finally {
                      setIsSubmitting(false);
                    }
                  }}
                  className="space-y-3.5"
                >
                  <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-900 space-y-1">
                    <p className="font-semibold">Reset Code sent for {resetIdentifier}</p>
                    <div className="flex items-center justify-between pt-0.5">
                      <span className="font-mono-tabular">
                        Code: <strong>{resetGeneratedOtp}</strong>
                      </span>
                      <button
                        type="button"
                        onClick={() => setResetOtpInput(resetGeneratedOtp)}
                        className="text-emerald-700 underline font-semibold cursor-pointer"
                      >
                        Auto-Fill Code
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Enter 6-Digit Verification Code
                    </label>
                    <input
                      type="text"
                      maxLength={6}
                      required
                      value={resetOtpInput}
                      onChange={(e) => setResetOtpInput(e.target.value)}
                      placeholder="••••••"
                      className="w-full px-3 py-2 text-center text-lg tracking-widest border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-600 font-mono-tabular"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      New Password (नया पासवर्ड)
                    </label>
                    <input
                      type="password"
                      required
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-600"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Confirm New Password (पासवर्ड दोबारा लिखें)
                    </label>
                    <input
                      type="password"
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-600"
                    />
                  </div>

                  {error && <p className="text-xs text-red-600 font-medium">{error}</p>}

                  <div className="flex items-center gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => setResetOtpSent(false)}
                      className="px-4 py-2.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors cursor-pointer"
                    >
                      Back
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="flex-1 py-2.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-400 rounded-xl transition-colors cursor-pointer"
                    >
                      {isSubmitting ? 'Updating Password...' : 'Save New Password (पासवर्ड सेव करें)'}
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
