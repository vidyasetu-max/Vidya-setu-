import React, { useState } from 'react';
import {
  X,
  ShieldCheck,
  Smartphone,
  Landmark,
  CheckCircle2,
  Receipt,
  QrCode,
  Copy,
  Check,
  Clock,
  AlertCircle,
  Lock,
} from 'lucide-react';
import {
  BankAccountConfig,
  Course,
  CourseModule,
  PendingAccessRequest,
  PurchaseReceipt,
  UserAccount,
} from '../types/education';

export interface PurchaseSubmissionResult {
  autoUnlocked: boolean;
  receipt?: PurchaseReceipt;
  pendingRequest?: PendingAccessRequest;
}

interface PaymentGatewayModalProps {
  course: Course;
  purchaseType: 'Full Course' | 'Partial Modules';
  selectedModules: CourseModule[];
  baseAmountInr: number;
  bankAccount: BankAccountConfig;
  user: UserAccount | null;
  onClose: () => void;
  onCompletePurchase: (payload: {
    courseId: string;
    courseTitle: string;
    purchaseType: 'Full Course' | 'Partial Modules';
    moduleIds: string[];
    moduleTitles: string[];
    amountPaidInr: number;
    paymentMethod: string;
    transactionRef: string;
    promoApplied?: string;
    studentName?: string;
    studentIdentifier?: string;
    settledToBank?: string;
  }) => Promise<PurchaseSubmissionResult>;
}

type PaymentMethodId = 'upi' | 'bank';

export const PaymentGatewayModal: React.FC<PaymentGatewayModalProps> = ({
  course,
  purchaseType,
  selectedModules,
  baseAmountInr,
  bankAccount,
  user,
  onClose,
  onCompletePurchase,
}) => {
  const [method, setMethod] = useState<PaymentMethodId>('upi');
  const [utrNumber, setUtrNumber] = useState('');
  const [payerUpiHandle, setPayerUpiHandle] = useState('');
  const [submitError, setSubmitError] = useState('');

  const [promoInput, setPromoInput] = useState('');
  const [appliedPromo, setAppliedPromo] = useState<string | null>(null);
  const [promoError, setPromoError] = useState('');

  const [isProcessing, setIsProcessing] = useState(false);
  const [receipt, setReceipt] = useState<PurchaseReceipt | null>(null);
  const [pendingRequest, setPendingRequest] =
    useState<PendingAccessRequest | null>(null);
  const [copiedUpi, setCopiedUpi] = useState(false);
  const [copiedBank, setCopiedBank] = useState(false);

  const discountInr =
    appliedPromo === 'VIDYA20'
      ? Math.round(baseAmountInr * 0.2)
      : appliedPromo === 'FIRST100'
      ? Math.min(100, Math.round(baseAmountInr * 0.4))
      : 0;

  const finalPayableInr =
    baseAmountInr > 0 ? Math.max(1, baseAmountInr - discountInr) : 0;

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    const code = promoInput.trim().toUpperCase();
    if (code === 'VIDYA20' || code === 'FIRST100') {
      setAppliedPromo(code);
      setPromoError('');
    } else {
      setPromoError('Invalid code. Try VIDYA20 (20% off) or FIRST100.');
    }
  };

  const handleSubmitPayment = async () => {
    setSubmitError('');
    const cleanUtr = utrNumber.trim();
    if (!/^[A-Za-z0-9_-]{10,35}$/.test(cleanUtr) || cleanUtr.includes('@')) {
      setSubmitError(
        'Pehle ₹' +
          finalPayableInr +
          ' pay karein aur uska valid 10–12+ digit UTR / Transaction ID yahan dalein. Bina payment UTR ke course unlock nahi hoga.'
      );
      return;
    }

    setIsProcessing(true);
    try {
      const cleanPayerHandle = payerUpiHandle.trim();
      const methodLabel =
        method === 'upi'
          ? cleanPayerHandle
            ? `Direct UPI / QR (${cleanPayerHandle})`
            : 'Direct UPI / QR'
          : `Bank Transfer (${bankAccount.bankName} IMPS/NEFT)`;

      const last4 = bankAccount.accountNumber.slice(-4) || '0000';
      const settledToBank = `${bankAccount.bankName} (A/C ••••${last4}) | UPI: ${bankAccount.upiId}`;

      const result = await onCompletePurchase({
        courseId: course.id,
        courseTitle: course.title,
        purchaseType,
        moduleIds: selectedModules.map((m) => m.id),
        moduleTitles: selectedModules.map((m) => m.title),
        amountPaidInr: finalPayableInr,
        paymentMethod: methodLabel,
        transactionRef: cleanUtr,
        promoApplied: appliedPromo || undefined,
        studentName: user?.name || 'Student Learner',
        studentIdentifier: user?.identifier || 'Guest',
        settledToBank,
      });

      if (result.autoUnlocked && result.receipt) {
        setReceipt(result.receipt);
      } else if (result.pendingRequest) {
        setPendingRequest(result.pendingRequest);
      } else {
        setSubmitError(
          'Payment request submit nahi ho saka. Kripya dobara try karein.'
        );
      }
    } catch (err) {
      setSubmitError(
        err instanceof Error
          ? err.message
          : 'Payment verification request submit nahi ho saka.'
      );
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-slate-900/60 flex items-center justify-center p-4 overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-labelledby="payment-gateway-title"
    >
      <div className="bg-white border border-slate-200 rounded-xl max-w-xl w-full overflow-hidden my-8">
        {/* Header */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
            <div>
              <h2 id="payment-gateway-title" className="text-base font-bold">
                VidyaSetu Verified Checkout
              </h2>
              <p className="text-xs text-slate-300">
                Direct Bank &amp; UPI Payment · Admin UTR Verification
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close payment gateway"
            className="p-1.5 text-slate-300 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {pendingRequest ? (
          /* Pending Admin Verification Receipt (Chapters remain LOCKED until verified) */
          <div className="p-6 space-y-5">
            <div className="p-5 bg-amber-50 border border-amber-200 rounded-xl flex items-start gap-3.5">
              <Clock className="w-6 h-6 text-amber-700 shrink-0 mt-0.5" />
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Payment Submitted — Verification Pending
                </h3>
                <p className="text-xs text-slate-700 mt-1 leading-relaxed">
                  Aapka UTR number Admin verification ke liye bhej diya gaya hai.
                  Fino Payments Bank / Google Pay me ₹{pendingRequest.amountInr}{' '}
                  confirm hone ke baad hi chapters unlock honge.
                </p>
              </div>
            </div>

            <div className="border border-slate-200 rounded-xl p-5 space-y-3 text-sm">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500">
                  <Receipt className="w-4 h-4" />
                  Verification Request ID
                </span>
                <span className="text-xs font-mono-tabular font-semibold text-slate-900">
                  {pendingRequest.id}
                </span>
              </div>

              <div className="flex justify-between text-xs gap-3">
                <span className="text-slate-500">Course</span>
                <span className="font-semibold text-slate-900 text-right max-w-[260px]">
                  {pendingRequest.courseTitle}
                </span>
              </div>

              <div className="flex justify-between text-xs">
                <span className="text-slate-500">Access Status</span>
                <span className="inline-flex items-center gap-1 font-bold text-amber-700">
                  <Lock className="w-3.5 h-3.5" />
                  Locked Until Admin Approval
                </span>
              </div>

              <div className="flex justify-between text-xs gap-3">
                <span className="text-slate-500">Payment Ref / UTR</span>
                <span className="font-mono-tabular font-semibold text-slate-800 text-right break-all">
                  {pendingRequest.paymentReference}
                </span>
              </div>

              <div className="flex justify-between text-xs gap-3">
                <span className="text-slate-500">Payee Bank</span>
                <span className="font-mono-tabular text-[11px] text-emerald-700 font-semibold text-right">
                  {bankAccount.accountHolderName} · {bankAccount.bankName}
                </span>
              </div>

              <div className="pt-2 border-t border-slate-100">
                <p className="text-xs font-medium text-slate-500 mb-1.5">
                  Requested Chapters (Approval ke baad unlock honge):
                </p>
                <ul className="space-y-1">
                  {pendingRequest.moduleTitles.map((title) => (
                    <li
                      key={title}
                      className="text-xs text-slate-700 flex items-center gap-1.5"
                    >
                      <Lock className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                      <span>{title}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="pt-3 border-t border-slate-200 flex items-center justify-between">
                <span className="text-sm font-bold text-slate-900">
                  Amount Submitted
                </span>
                <span className="text-lg font-bold text-slate-900 font-mono-tabular">
                  ₹{pendingRequest.amountInr}
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="w-full py-3 text-sm font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
            >
              Done · Back to Course
            </button>
          </div>
        ) : receipt ? (
          /* Verified Payment Receipt (only if explicitly server-confirmed) */
          <div className="p-6 space-y-6">
            <div className="p-5 bg-emerald-50 border border-emerald-200 rounded-xl flex items-start gap-3.5">
              <CheckCircle2 className="w-6 h-6 text-emerald-700 shrink-0 mt-0.5" />
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Payment Verified — Modules Unlocked!
                </h3>
                <p className="text-xs text-slate-600 mt-1">
                  Your {receipt.purchaseType.toLowerCase()} access is now active
                  in your Dashboard and MCQ Sprint.
                </p>
              </div>
            </div>

            <div className="border border-slate-200 rounded-xl p-5 space-y-3 text-sm">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500">
                  <Receipt className="w-4 h-4" />
                  Official Payment Receipt
                </span>
                <span className="text-xs font-mono-tabular font-semibold text-slate-900">
                  {receipt.transactionId}
                </span>
              </div>

              <div className="flex justify-between text-xs">
                <span className="text-slate-500">Course</span>
                <span className="font-semibold text-slate-900 text-right max-w-[260px]">
                  {receipt.courseTitle}
                </span>
              </div>

              <div className="flex justify-between text-xs">
                <span className="text-slate-500">Access Type</span>
                <span className="font-semibold text-indigo-700">
                  {receipt.purchaseType}
                </span>
              </div>

              <div className="flex justify-between text-xs">
                <span className="text-slate-500">Payment Method</span>
                <span className="font-medium text-slate-800">
                  {receipt.paymentMethod}
                </span>
              </div>

              {receipt.settledToBank && (
                <div className="flex justify-between text-xs">
                  <span className="text-slate-500">Settled To</span>
                  <span className="font-mono-tabular text-[11px] text-emerald-700 font-semibold text-right">
                    {receipt.settledToBank}
                  </span>
                </div>
              )}

              <div className="pt-2 border-t border-slate-100">
                <p className="text-xs font-medium text-slate-500 mb-1.5">
                  Unlocked Chapters:
                </p>
                <ul className="space-y-1">
                  {receipt.moduleTitles.map((title) => (
                    <li
                      key={title}
                      className="text-xs text-slate-700 flex items-center gap-1.5"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span>{title}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="pt-3 border-t border-slate-200 flex items-center justify-between">
                <span className="text-sm font-bold text-slate-900">
                  Amount Paid
                </span>
                <span className="text-lg font-bold text-slate-900 font-mono-tabular">
                  ₹{receipt.amountPaidInr}
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="w-full py-3 text-sm font-semibold text-white bg-indigo-700 hover:bg-indigo-800 rounded-lg transition-colors cursor-pointer"
            >
              Start Learning Now
            </button>
          </div>
        ) : (
          /* Checkout Form */
          <div className="p-6 space-y-5 max-h-[82vh] overflow-y-auto">
            {/* Order Summary */}
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-semibold text-indigo-700">
                    {purchaseType}
                  </p>
                  <p className="text-sm font-bold text-slate-900">
                    {course.title}
                  </p>
                </div>
                <span className="text-sm font-bold text-slate-900 font-mono-tabular shrink-0">
                  ₹{baseAmountInr}
                </span>
              </div>
              <p className="text-xs text-slate-600">
                Includes {selectedModules.length} paid module(s):{' '}
                {selectedModules.map((m) => m.title.split('.')[0]).join(', ')}
              </p>

              {/* Promo Code */}
              <form
                onSubmit={handleApplyPromo}
                className="pt-2 flex items-center gap-2"
              >
                <input
                  type="text"
                  value={promoInput}
                  onChange={(e) => setPromoInput(e.target.value)}
                  placeholder="Promo code (e.g. VIDYA20)"
                  aria-label="Promo code"
                  className="flex-1 px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:border-indigo-600"
                />
                <button
                  type="submit"
                  className="px-3 py-1.5 text-xs font-semibold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-colors cursor-pointer"
                >
                  Apply
                </button>
              </form>
              {promoError && <p className="text-xs text-red-600">{promoError}</p>}
              {appliedPromo && (
                <div className="flex items-center justify-between text-xs text-emerald-700 font-semibold pt-1">
                  <span>Promo {appliedPromo} applied</span>
                  <span className="font-mono-tabular">-₹{discountInr}</span>
                </div>
              )}
            </div>

            {/* Security Banner */}
            <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 flex items-start gap-2.5 text-xs text-amber-900">
              <Lock className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
              <p className="leading-relaxed">
                <strong>2-Step Verified Unlock:</strong> Pehle QR scan ya Bank
                Transfer se <strong>₹{finalPayableInr}</strong> pay karein, phir
                apna <strong>12-digit UTR / Ref ID</strong> niche dalein. Admin
                verify karne ke baad course unlock hoga.
              </p>
            </div>

            {/* Payment Method Tabs (Only Direct Verified Channels) */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <p className="text-xs font-bold text-slate-700">
                  Step 1: Pay ₹{finalPayableInr} via UPI QR or Bank Account
                </p>
                <span className="text-[11px] text-slate-500 font-mono-tabular">
                  Payee: {bankAccount.accountHolderName}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-2.5">
                {[
                  {
                    id: 'upi',
                    label: 'UPI / QR (GPay / PhonePe)',
                    icon: Smartphone,
                  },
                  {
                    id: 'bank',
                    label: 'Bank Transfer (IMPS/NEFT)',
                    icon: Landmark,
                  },
                ].map((item) => {
                  const Icon = item.icon;
                  const active = method === item.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setMethod(item.id as PaymentMethodId)}
                      className={`p-3 rounded-xl border flex items-center justify-center gap-2 text-xs font-bold transition-colors cursor-pointer ${
                        active
                          ? 'border-indigo-700 bg-indigo-50 text-indigo-800'
                          : 'border-slate-200 text-slate-600 hover:border-slate-300'
                      }`}
                    >
                      <Icon className="w-4 h-4 shrink-0" />
                      <span>{item.label}</span>
                    </button>
                  );
                })}
              </div>

              {/* Payment Channel Details + UTR Form */}
              <div className="p-4 border border-slate-200 rounded-xl bg-white space-y-4">
                {method === 'upi' && (
                  <div className="p-4 rounded-xl bg-gradient-to-b from-emerald-50/80 to-white border border-emerald-200 flex flex-col items-center text-center space-y-3">
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800">
                      <QrCode className="w-3.5 h-3.5" />
                      <span>
                        Scan &amp; Pay ₹{finalPayableInr} via any UPI App
                      </span>
                    </div>

                    <div className="p-2.5 bg-white border border-slate-200 rounded-xl shadow-sm flex items-center justify-center">
                      <img
                        src={
                          bankAccount.upiQrCodeUrl?.trim()
                            ? bankAccount.upiQrCodeUrl
                            : `https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(
                                `upi://pay?pa=${bankAccount.upiId}&pn=${encodeURIComponent(
                                  bankAccount.accountHolderName
                                )}&am=${finalPayableInr}&cu=INR`
                              )}`
                        }
                        alt={`${bankAccount.accountHolderName} UPI Payment QR Code`}
                        referrerPolicy="no-referrer"
                        className="w-48 h-48 sm:w-52 sm:h-52 object-contain rounded-lg"
                      />
                    </div>

                    <div className="space-y-0.5">
                      <p className="text-xs font-bold text-slate-900">
                        {bankAccount.accountHolderName}
                      </p>
                      <p className="text-[11px] text-slate-600 font-medium max-w-xs">
                        Google Pay, PhonePe, Paytm ya BHIM se ₹{finalPayableInr}{' '}
                        pay karein.
                      </p>
                    </div>

                    <a
                      href={`upi://pay?pa=${encodeURIComponent(
                        bankAccount.upiId
                      )}&pn=${encodeURIComponent(
                        bankAccount.accountHolderName
                      )}&am=${finalPayableInr}&cu=INR&tn=${encodeURIComponent(
                        course.title
                      )}`}
                      className="w-full max-w-sm inline-flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl transition-colors shadow-xs"
                    >
                      <Smartphone className="w-4 h-4" />
                      <span>Open UPI App &amp; Pay ₹{finalPayableInr}</span>
                    </a>

                    {/* 1-Click Copy UPI ID Bar */}
                    <div className="w-full max-w-sm flex items-center justify-between p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs">
                      <div className="text-left min-w-0 pr-2">
                        <span className="block text-[10px] text-slate-500 uppercase tracking-wider font-semibold">
                          UPI ID
                        </span>
                        <span className="font-mono-tabular font-bold text-slate-900 truncate block">
                          {bankAccount.upiId}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          navigator.clipboard.writeText(bankAccount.upiId);
                          setCopiedUpi(true);
                          setTimeout(() => setCopiedUpi(false), 2000);
                        }}
                        className={`inline-flex items-center gap-1 px-3 py-1.5 text-xs font-bold rounded-lg transition-colors cursor-pointer shrink-0 ${
                          copiedUpi
                            ? 'bg-emerald-600 text-white'
                            : 'bg-white hover:bg-slate-100 border border-slate-300 text-slate-700'
                        }`}
                      >
                        {copiedUpi ? (
                          <>
                            <Check className="w-3.5 h-3.5" />
                            <span>Copied!</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5" />
                            <span>Copy UPI</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                )}

                {/* Direct Bank Account Details Box (Visible on Bank tab, and secondary helper on UPI tab) */}
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900">
                      Direct Bank Account Settlement
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        const details = `Account: ${bankAccount.accountNumber}\nIFSC: ${bankAccount.ifscCode}\nName: ${bankAccount.accountHolderName}\nBank: ${bankAccount.bankName}\nUPI: ${bankAccount.upiId}`;
                        navigator.clipboard.writeText(details);
                        setCopiedBank(true);
                        setTimeout(() => setCopiedBank(false), 2000);
                      }}
                      className="text-[11px] font-bold text-indigo-700 hover:text-indigo-800 cursor-pointer inline-flex items-center gap-1"
                    >
                      {copiedBank ? (
                        <>
                          <Check className="w-3 h-3 text-emerald-600" />
                          <span className="text-emerald-700">
                            Bank Details Copied!
                          </span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3" />
                          <span>Copy Bank Details</span>
                        </>
                      )}
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-600">
                    <div>
                      <span className="text-slate-400 block">Payee / Name:</span>
                      <span className="font-semibold text-slate-800">
                        {bankAccount.accountHolderName}
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-400 block">Bank Name:</span>
                      <span className="font-semibold text-slate-800">
                        {bankAccount.bankName}
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-400 block">
                        Account Number:
                      </span>
                      <span className="font-mono-tabular font-bold text-slate-900">
                        {bankAccount.accountNumber}
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-400 block">IFSC Code:</span>
                      <span className="font-mono-tabular font-bold text-slate-900">
                        {bankAccount.ifscCode}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Mandatory Step 2: UTR / Transaction Ref input */}
                <div className="space-y-3 pt-1">
                  <div>
                    <label
                      htmlFor="payment-utr-input"
                      className="block text-xs font-bold text-slate-900 mb-1"
                    >
                      Step 2: Enter 12-Digit Payment UTR / Bank Ref ID *
                    </label>
                    <input
                      id="payment-utr-input"
                      type="text"
                      required
                      value={utrNumber}
                      onChange={(e) => {
                        setUtrNumber(e.target.value);
                        if (submitError) setSubmitError('');
                      }}
                      placeholder="e.g. 431829104921 (12-digit UTR number)"
                      className="w-full px-3.5 py-2.5 text-sm border border-slate-300 rounded-xl focus:outline-none focus:border-indigo-600 font-mono-tabular bg-white"
                    />
                    <p className="text-[11px] text-slate-500 mt-1">
                      Payment karne ke baad apni GPay / PhonePe / Paytm / Bank
                      receipt se 10–12 digit UTR / Transaction ID yahan dalein.
                    </p>
                  </div>

                  <div>
                    <label
                      htmlFor="payer-upi-input"
                      className="block text-[11px] font-semibold text-slate-700 mb-1"
                    >
                      Your UPI ID / Sender Name (Optional)
                    </label>
                    <input
                      id="payer-upi-input"
                      type="text"
                      value={payerUpiHandle}
                      onChange={(e) => setPayerUpiHandle(e.target.value)}
                      placeholder="e.g. rahul@okicici"
                      className="w-full px-3.5 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-600 bg-white"
                    />
                  </div>
                </div>
              </div>
            </div>

            {submitError && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 flex items-start gap-2 text-xs text-rose-800 font-medium">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                <span>{submitError}</span>
              </div>
            )}

            {/* Submit for Verification Button */}
            <button
              type="button"
              disabled={isProcessing || finalPayableInr <= 0}
              onClick={handleSubmitPayment}
              className="w-full py-3.5 text-sm font-bold text-white bg-indigo-700 hover:bg-indigo-800 disabled:bg-indigo-400 rounded-lg transition-colors font-mono-tabular cursor-pointer"
            >
              {isProcessing
                ? 'Submitting UTR for Verification...'
                : `Submit ₹${finalPayableInr} Payment UTR for Admin Verification`}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
