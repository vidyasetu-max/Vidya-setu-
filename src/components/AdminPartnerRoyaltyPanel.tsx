import React, { useState, useEffect } from 'react';
import {
  IndianRupee,
  Sliders,
  CheckCircle2,
  Building2,
  Copy,
  QrCode,
  FileSpreadsheet,
  Send,
  Smartphone,
  Percent,
  Minus,
  Plus,
} from 'lucide-react';
import {
  LearnerState,
  PartnerPayoutRecord,
  TeacherPartnerProfile,
} from '../types/education';

function getAdminTokenHeader(): Record<string, string> {
  try {
    const token = sessionStorage.getItem('vidyasetu_admin_token') || '';
    return token ? { 'x-admin-token': token } : {};
  } catch {
    return {};
  }
}

interface AdminPartnerRoyaltyPanelProps {
  learnerState: LearnerState;
  selectedTeacherId: string;
  onSelectTeacherId: (teacherId: string) => void;
  onRefreshState?: () => Promise<void>;
  onToast: (msg: string) => void;
  onJumpToAlertTeacher?: (teacherId: string) => void;
}

export const AdminPartnerRoyaltyPanel: React.FC<AdminPartnerRoyaltyPanelProps> = ({
  learnerState,
  selectedTeacherId,
  onSelectTeacherId,
  onRefreshState,
  onToast,
  onJumpToAlertTeacher,
}) => {
  const partners = learnerState.teacherPartners || [];
  const defaultGlobalRoyalty =
    typeof learnerState.siteConfig?.defaultPartnerRoyaltyPct === 'number'
      ? learnerState.siteConfig.defaultPartnerRoyaltyPct
      : 80;

  const [globalRoyaltyInput, setGlobalRoyaltyInput] =
    useState<number>(defaultGlobalRoyalty);
  const [applyToAllExisting, setApplyToAllExisting] = useState<boolean>(true);
  const [isSavingGlobal, setIsSavingGlobal] = useState<boolean>(false);

  // Local editable drafts per partner id
  const [partnerDrafts, setPartnerDrafts] = useState<Record<string, number>>({});
  const [savingPartnerId, setSavingPartnerId] = useState<string | null>(null);

  // Pay Partner Console State
  const [payMode, setPayMode] = useState<'gross' | 'direct'>('gross');
  const [payoutGrossInr, setPayoutGrossInr] = useState<number>(5000);
  const [directPayAmountInr, setDirectPayAmountInr] = useState<number>(4000);
  const [paymentRoyaltyPct, setPaymentRoyaltyPct] = useState<number>(
    defaultGlobalRoyalty
  );
  const [payoutCourseTitle, setPayoutCourseTitle] = useState<string>(
    'Modular Course Enrollment Settlement'
  );
  const [payoutMethod, setPayoutMethod] =
    useState<PartnerPayoutRecord['payoutMethod']>('Direct UPI');
  const [payoutRefId, setPayoutRefId] = useState<string>('');
  const [payoutStatus, setPayoutStatus] =
    useState<PartnerPayoutRecord['status']>('Paid');
  const [payoutRemarks, setPayoutRemarks] = useState<string>('');
  const [isSettlingPayout, setIsSettlingPayout] = useState<boolean>(false);

  // Ledger Filter & Quick Mark-Paid UTR
  const [ledgerFilter, setLedgerFilter] = useState<
    'all' | 'Paid' | 'Processing' | 'Pending Settlement'
  >('all');
  const [markPaidUtrs, setMarkPaidUtrs] = useState<Record<string, string>>({});
  const [updatingPayoutId, setUpdatingPayoutId] = useState<string | null>(null);

  useEffect(() => {
    setGlobalRoyaltyInput(defaultGlobalRoyalty);
  }, [defaultGlobalRoyalty]);

  useEffect(() => {
    const nextDrafts: Record<string, number> = {};
    partners.forEach((p) => {
      nextDrafts[p.id] =
        typeof p.royaltyPercent === 'number'
          ? p.royaltyPercent
          : defaultGlobalRoyalty;
    });
    setPartnerDrafts(nextDrafts);
  }, [learnerState.teacherPartners, defaultGlobalRoyalty]);

  const activeTeacher: TeacherPartnerProfile | undefined =
    partners.find((t) => t.id === selectedTeacherId) || partners[0];

  useEffect(() => {
    if (activeTeacher && activeTeacher.id !== selectedTeacherId) {
      onSelectTeacherId(activeTeacher.id);
    }
    const pct =
      typeof activeTeacher?.royaltyPercent === 'number'
        ? activeTeacher.royaltyPercent
        : defaultGlobalRoyalty;
    setPaymentRoyaltyPct(pct);
  }, [activeTeacher?.id, activeTeacher?.royaltyPercent, defaultGlobalRoyalty]);

  const clampedPaymentPct = Math.min(
    100,
    Math.max(0, Number(paymentRoyaltyPct) || 0)
  );
  const platformFeePct = Math.max(
    0,
    Math.round((100 - clampedPaymentPct) * 10) / 10
  );

  const computedGrossInr =
    payMode === 'gross'
      ? Math.max(0, Math.round(Number(payoutGrossInr) || 0))
      : clampedPaymentPct > 0
        ? Math.round(
            ((Number(directPayAmountInr) || 0) * 100) / clampedPaymentPct
          )
        : Math.max(0, Math.round(Number(directPayAmountInr) || 0));

  const computedPartnerPayInr =
    payMode === 'direct'
      ? Math.max(0, Math.round(Number(directPayAmountInr) || 0))
      : Math.round((computedGrossInr * clampedPaymentPct) / 100);

  const computedPlatformShareInr = Math.max(
    0,
    computedGrossInr - computedPartnerPayInr
  );

  const handleSaveGlobalRoyalty = async (e: React.FormEvent) => {
    e.preventDefault();
    const clean = Math.min(100, Math.max(0, Number(globalRoyaltyInput) || 0));
    setIsSavingGlobal(true);
    try {
      const res = await fetch('/api/admin/partner/royalty', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...getAdminTokenHeader(),
        },
        body: JSON.stringify({
          mode: 'global',
          royaltyPercent: clean,
          applyToAllPartners: applyToAllExisting,
        }),
      });
      if (res.ok) {
        onToast(
          applyToAllExisting
            ? `Global & All Partners Royalty set to ${clean}%`
            : `Default New-Partner Royalty set to ${clean}%`
        );
        if (onRefreshState) await onRefreshState();
      } else {
        const err = await res.json().catch(() => ({}));
        onToast(err?.error || 'Failed to update global royalty');
      }
    } catch {
      onToast('Network error saving royalty percentage');
    } finally {
      setIsSavingGlobal(false);
    }
  };

  const handleSavePartnerRoyalty = async (teacherId: string) => {
    const draft = partnerDrafts[teacherId] ?? defaultGlobalRoyalty;
    const clean = Math.min(100, Math.max(0, Number(draft) || 0));
    setSavingPartnerId(teacherId);
    try {
      const res = await fetch('/api/admin/partner/royalty', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...getAdminTokenHeader(),
        },
        body: JSON.stringify({
          mode: 'partner',
          teacherId,
          royaltyPercent: clean,
        }),
      });
      if (res.ok) {
        onToast(`Partner royalty updated to ${clean}% & Partner notified!`);
        if (onRefreshState) await onRefreshState();
      } else {
        const err = await res.json().catch(() => ({}));
        onToast(err?.error || 'Failed to update partner royalty');
      }
    } catch {
      onToast('Network error saving partner royalty');
    } finally {
      setSavingPartnerId(null);
    }
  };

  const handleSettlePayout = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeTeacher) {
      onToast('No partner selected');
      return;
    }
    if (computedPartnerPayInr <= 0 && computedGrossInr <= 0) {
      onToast('Please enter a valid positive amount to pay');
      return;
    }
    setIsSettlingPayout(true);
    try {
      const res = await fetch('/api/admin/partner/payout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...getAdminTokenHeader(),
        },
        body: JSON.stringify({
          teacherId: activeTeacher.id,
          courseTitle: payoutCourseTitle,
          grossAmountInr: payMode === 'gross' ? computedGrossInr : undefined,
          directPayAmountInr:
            payMode === 'direct' ? computedPartnerPayInr : undefined,
          royaltyPct: clampedPaymentPct,
          payoutMethod,
          referenceId: payoutRefId,
          status: payoutStatus,
          remarks: payoutRemarks || undefined,
        }),
      });
      if (res.ok) {
        setPayoutRefId('');
        setPayoutRemarks('');
        onToast(
          `₹${computedPartnerPayInr.toLocaleString('en-IN')} (${clampedPaymentPct}%) ${payoutStatus === 'Paid' ? 'paid' : 'queued'} for ${activeTeacher.name}!`
        );
        if (onRefreshState) await onRefreshState();
      } else {
        const err = await res.json().catch(() => ({}));
        onToast(err?.error || 'Failed to record partner payment');
      }
    } catch {
      onToast('Network error recording partner payment');
    } finally {
      setIsSettlingPayout(false);
    }
  };

  const handleMarkPayoutPaid = async (payoutId: string) => {
    setUpdatingPayoutId(payoutId);
    try {
      const res = await fetch(`/api/admin/partner/payout/${payoutId}/status`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...getAdminTokenHeader(),
        },
        body: JSON.stringify({
          status: 'Paid',
          referenceId: markPaidUtrs[payoutId] || undefined,
        }),
      });
      if (res.ok) {
        onToast('Partner payout marked as Paid & Partner notified!');
        if (onRefreshState) await onRefreshState();
      } else {
        onToast('Failed to update payout status');
      }
    } catch {
      onToast('Network error marking payout paid');
    } finally {
      setUpdatingPayoutId(null);
    }
  };

  const copyField = (label: string, value: string) => {
    if (!value) return;
    navigator.clipboard.writeText(value);
    onToast(`Copied ${label}: ${value}`);
  };

  const allPayouts = learnerState.partnerPayouts || [];
  const filteredPayouts = allPayouts.filter(
    (p) => ledgerFilter === 'all' || p.status === ledgerFilter
  );

  const totalPaidToPartners = allPayouts
    .filter((p) => p.status === 'Paid')
    .reduce((sum, p) => sum + (Number(p.partnerShareInr) || 0), 0);
  const totalPendingToPartners = allPayouts
    .filter((p) => p.status !== 'Paid')
    .reduce((sum, p) => sum + (Number(p.partnerShareInr) || 0), 0);

  const activeBank = activeTeacher?.bankAccount;
  const activeUpi = activeBank?.upiId || activeTeacher?.upiId || '';
  const upiDeepLink = activeUpi
    ? `upi://pay?pa=${encodeURIComponent(activeUpi)}&pn=${encodeURIComponent(activeBank?.accountHolderName || activeTeacher?.name || 'Vidya Setu Partner')}&am=${Math.max(1, computedPartnerPayInr)}&cu=INR&tn=${encodeURIComponent(`VidyaSetu Partner Payout (${clampedPaymentPct}%)`)}`
    : '';

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 flex items-center justify-center shrink-0">
            <Percent className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900">
              Partner Royalty Controls &amp; Direct Payouts
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Edit royalty % globally or per partner (increase/decrease anytime)
              and transfer payouts directly via UPI, QR Scan, or Bank IMPS/NEFT.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3 text-xs font-mono tabular-nums shrink-0">
          <div className="px-3 py-1.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 font-bold">
            Paid: ₹{totalPaidToPartners.toLocaleString('en-IN')}
          </div>
          <div className="px-3 py-1.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 font-bold">
            Pending: ₹{totalPendingToPartners.toLocaleString('en-IN')}
          </div>
        </div>
      </div>

      {/* 1. Global Royalty % Editor */}
      <form
        onSubmit={handleSaveGlobalRoyalty}
        className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <Sliders className="w-4 h-4 text-emerald-600" />
            <h3 className="text-sm font-bold text-slate-900">
              Platform Royalty Rate Control (Kam / Jada Karein)
            </h3>
          </div>
          <div className="flex items-center gap-3 text-xs font-mono tabular-nums">
            <span className="font-bold text-emerald-700">
              Partner: {globalRoyaltyInput}%
            </span>
            <span className="text-slate-300">/</span>
            <span className="font-semibold text-slate-600">
              Platform: {Math.max(0, Math.round((100 - globalRoyaltyInput) * 10) / 10)}%
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-center">
          <div className="lg:col-span-6 space-y-2.5">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() =>
                  setGlobalRoyaltyInput((v) => Math.max(0, v - 5))
                }
                className="px-2.5 py-1.5 text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg cursor-pointer whitespace-nowrap"
              >
                -5%
              </button>
              <input
                type="range"
                min={0}
                max={100}
                step={1}
                value={globalRoyaltyInput}
                onChange={(e) => setGlobalRoyaltyInput(Number(e.target.value))}
                className="flex-1 accent-emerald-600 cursor-pointer"
              />
              <button
                type="button"
                onClick={() =>
                  setGlobalRoyaltyInput((v) => Math.min(100, v + 5))
                }
                className="px-2.5 py-1.5 text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg cursor-pointer whitespace-nowrap"
              >
                +5%
              </button>
              <div className="relative w-20 shrink-0">
                <input
                  type="number"
                  min={0}
                  max={100}
                  step={0.5}
                  value={globalRoyaltyInput}
                  onChange={(e) =>
                    setGlobalRoyaltyInput(
                      Math.min(100, Math.max(0, Number(e.target.value) || 0))
                    )
                  }
                  className="w-full px-2.5 py-1.5 pr-6 text-xs font-mono tabular-nums font-bold border border-slate-200 rounded-lg bg-slate-50 text-slate-900 text-right"
                />
                <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[11px] font-bold text-slate-500">
                  %
                </span>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-1.5">
              <span className="text-[11px] text-slate-500 mr-1">Quick Set:</span>
              {[50, 60, 70, 75, 80, 85, 90].map((preset) => (
                <button
                  key={preset}
                  type="button"
                  onClick={() => setGlobalRoyaltyInput(preset)}
                  className={`px-2.5 py-1 text-[11px] font-mono font-bold rounded-lg border transition-colors cursor-pointer ${
                    globalRoyaltyInput === preset
                      ? 'bg-slate-900 text-white border-slate-900'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {preset}%
                </button>
              ))}
            </div>
          </div>

          <div className="lg:col-span-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50 border border-slate-200 rounded-xl p-3.5">
            <label className="flex items-center gap-2 text-xs font-medium text-slate-700 cursor-pointer">
              <input
                type="checkbox"
                checked={applyToAllExisting}
                onChange={(e) => setApplyToAllExisting(e.target.checked)}
                className="w-4 h-4 rounded accent-emerald-600 cursor-pointer"
              />
              <span>Update all {partners.length} existing partners too</span>
            </label>

            <button
              type="submit"
              disabled={isSavingGlobal}
              className="inline-flex items-center justify-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition-colors cursor-pointer disabled:opacity-50 whitespace-nowrap shrink-0"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>{isSavingGlobal ? 'Saving...' : 'Save Global Royalty'}</span>
            </button>
          </div>
        </div>
      </form>

      {/* 2. Per-Partner Royalty % Editor & Quick Pay Cards */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <h3 className="text-sm font-bold text-slate-900">
            Individual Partner Royalty &amp; Payment Directory ({partners.length})
          </h3>
          <span className="text-[11px] text-slate-500">
            Customize per-partner royalty % or click Pay Partner
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {partners.map((teacher) => {
            const currentPct =
              typeof teacher.royaltyPercent === 'number'
                ? teacher.royaltyPercent
                : defaultGlobalRoyalty;
            const draftPct = partnerDrafts[teacher.id] ?? currentPct;
            const isDirty = draftPct !== currentPct;
            const isSelected = activeTeacher?.id === teacher.id;

            return (
              <div
                key={teacher.id}
                className={`p-4 border rounded-xl space-y-3 transition-colors ${
                  isSelected
                    ? 'border-emerald-500 bg-emerald-50/20'
                    : 'border-slate-200 bg-white'
                }`}
              >
                <div className="flex items-center gap-3">
                  <img
                    src={
                      teacher.avatarUrl ||
                      teacher.photoUrl ||
                      '/src/assets/images/hero_learning_studio_1793856674745.jpg'
                    }
                    alt={teacher.name}
                    referrerPolicy="no-referrer"
                    className="w-11 h-11 rounded-xl object-cover border border-slate-200 shrink-0"
                  />
                  <div className="min-w-0 flex-1">
                    <h4 className="text-sm font-bold text-slate-900 truncate">
                      {teacher.name}
                    </h4>
                    <p className="text-[11px] text-slate-500 truncate">
                      {teacher.subjectExpertise}
                    </p>
                    <p className="text-[11px] font-mono tabular-nums text-emerald-700 font-semibold">
                      Paid: ₹{(teacher.totalEarningsInr || 0).toLocaleString('en-IN')} · Active: {currentPct}%
                    </p>
                  </div>
                </div>

                {/* Per-Partner Royalty Stepper & Save */}
                <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="font-semibold text-slate-700">
                      Partner Royalty %
                    </span>
                    <span className="font-mono tabular-nums text-slate-500">
                      Platform: {Math.max(0, 100 - draftPct)}%
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() =>
                        setPartnerDrafts((prev) => ({
                          ...prev,
                          [teacher.id]: Math.max(0, draftPct - 1),
                        }))
                      }
                      className="p-1.5 bg-white border border-slate-200 hover:bg-slate-100 rounded-lg text-slate-700 cursor-pointer"
                      title="Decrease 1%"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <input
                      type="number"
                      min={0}
                      max={100}
                      step={0.5}
                      value={draftPct}
                      onChange={(e) =>
                        setPartnerDrafts((prev) => ({
                          ...prev,
                          [teacher.id]: Math.min(
                            100,
                            Math.max(0, Number(e.target.value) || 0)
                          ),
                        }))
                      }
                      className="w-16 px-2 py-1 text-xs font-mono tabular-nums font-bold text-center bg-white border border-slate-200 rounded-lg text-slate-900"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setPartnerDrafts((prev) => ({
                          ...prev,
                          [teacher.id]: Math.min(100, draftPct + 1),
                        }))
                      }
                      className="p-1.5 bg-white border border-slate-200 hover:bg-slate-100 rounded-lg text-slate-700 cursor-pointer"
                      title="Increase 1%"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      disabled={savingPartnerId === teacher.id}
                      onClick={() => handleSavePartnerRoyalty(teacher.id)}
                      className={`flex-1 py-1.5 px-2.5 text-[11px] font-bold rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
                        isDirty
                          ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                          : 'bg-slate-900 hover:bg-slate-800 text-white'
                      } disabled:opacity-50`}
                    >
                      {savingPartnerId === teacher.id ? 'Saving...' : 'Save %'}
                    </button>
                  </div>
                </div>

                {/* Partner Bank & UPI Info Line */}
                <div className="text-[11px] font-mono text-slate-600 bg-slate-50 px-2.5 py-1.5 rounded-lg border border-slate-200/80 flex items-center justify-between gap-2">
                  <span className="truncate">
                    UPI: {teacher.bankAccount?.upiId || teacher.upiId || 'Not set'}
                  </span>
                  {(teacher.bankAccount?.upiId || teacher.upiId) && (
                    <button
                      type="button"
                      onClick={() =>
                        copyField(
                          'UPI ID',
                          teacher.bankAccount?.upiId || teacher.upiId
                        )
                      }
                      className="text-slate-500 hover:text-slate-900 cursor-pointer shrink-0"
                    >
                      <Copy className="w-3 h-3" />
                    </button>
                  )}
                </div>

                <div className="flex items-center gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => {
                      onSelectTeacherId(teacher.id);
                      const el = document.getElementById('pay-partner-console');
                      el?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }}
                    className="flex-1 inline-flex items-center justify-center gap-1.5 py-2 px-3 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition-colors cursor-pointer whitespace-nowrap"
                  >
                    <IndianRupee className="w-3.5 h-3.5" />
                    <span>Pay Partner</span>
                  </button>
                  {onJumpToAlertTeacher && (
                    <button
                      type="button"
                      onClick={() => onJumpToAlertTeacher(teacher.id)}
                      className="py-2 px-3 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold rounded-xl transition-colors cursor-pointer whitespace-nowrap"
                    >
                      Alert
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 3. Pay Partner Settlement Console */}
      <div
        id="pay-partner-console"
        className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start"
      >
        {/* Left 7 Cols: Payment Form */}
        <form
          onSubmit={handleSettlePayout}
          className="lg:col-span-7 bg-white border border-slate-200 rounded-2xl p-6 space-y-4"
        >
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <IndianRupee className="w-4 h-4 text-emerald-600" />
              <h3 className="text-sm font-bold text-slate-900">
                Pay Partner Now ({clampedPaymentPct}% Share)
              </h3>
            </div>

            <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg border border-slate-200">
              <button
                type="button"
                onClick={() => setPayMode('gross')}
                className={`px-2.5 py-1 text-[11px] font-bold rounded-md transition-colors cursor-pointer whitespace-nowrap ${
                  payMode === 'gross'
                    ? 'bg-slate-900 text-white'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                By Gross Fees
              </button>
              <button
                type="button"
                onClick={() => setPayMode('direct')}
                className={`px-2.5 py-1 text-[11px] font-bold rounded-md transition-colors cursor-pointer whitespace-nowrap ${
                  payMode === 'direct'
                    ? 'bg-slate-900 text-white'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Direct Pay Amount
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Select Partner to Pay *
              </label>
              <select
                value={activeTeacher?.id || ''}
                onChange={(e) => onSelectTeacherId(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-slate-50 text-slate-900 font-semibold"
              >
                {partners.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.name} (
                    {typeof t.royaltyPercent === 'number'
                      ? t.royaltyPercent
                      : defaultGlobalRoyalty}
                    %)
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Royalty % for This Payment
              </label>
              <div className="relative">
                <input
                  type="number"
                  min={0}
                  max={100}
                  step={0.5}
                  value={paymentRoyaltyPct}
                  onChange={(e) =>
                    setPaymentRoyaltyPct(
                      Math.min(100, Math.max(0, Number(e.target.value) || 0))
                    )
                  }
                  className="w-full px-3 py-2 pr-8 border border-slate-200 rounded-xl bg-slate-50 text-slate-900 font-mono tabular-nums font-bold"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-500">
                  %
                </span>
              </div>
            </div>

            {payMode === 'gross' ? (
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Gross Student Fees Collected (₹)
                </label>
                <input
                  type="number"
                  min={1}
                  value={payoutGrossInr}
                  onChange={(e) =>
                    setPayoutGrossInr(Number(e.target.value) || 0)
                  }
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-slate-50 text-slate-900 font-mono tabular-nums font-bold"
                />
              </div>
            ) : (
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Direct Payout Amount to Partner (₹)
                </label>
                <input
                  type="number"
                  min={1}
                  value={directPayAmountInr}
                  onChange={(e) =>
                    setDirectPayAmountInr(Number(e.target.value) || 0)
                  }
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-slate-50 text-emerald-700 font-mono tabular-nums font-bold"
                />
              </div>
            )}

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Payment Method
              </label>
              <select
                value={payoutMethod}
                onChange={(e) =>
                  setPayoutMethod(
                    e.target.value as PartnerPayoutRecord['payoutMethod']
                  )
                }
                className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-slate-50 text-slate-900"
              >
                <option value="Direct UPI">Direct UPI</option>
                <option value="Bank Transfer (NEFT/IMPS)">
                  Bank Transfer (NEFT/IMPS)
                </option>
                <option value="UPI QR Scan">UPI QR Scan</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Course / Batch Label
              </label>
              <input
                type="text"
                value={payoutCourseTitle}
                onChange={(e) => setPayoutCourseTitle(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-slate-50 text-slate-900"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Settlement Status
              </label>
              <select
                value={payoutStatus}
                onChange={(e) =>
                  setPayoutStatus(
                    e.target.value as PartnerPayoutRecord['status']
                  )
                }
                className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-slate-50 text-slate-900"
              >
                <option value="Paid">Paid (Transferred Now)</option>
                <option value="Processing">Processing</option>
                <option value="Pending Settlement">Pending Settlement</option>
              </select>
            </div>
          </div>

          {/* Live Revenue Split Summary Bar */}
          <div className="grid grid-cols-3 gap-2 p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono tabular-nums">
            <div>
              <span className="text-[10px] text-slate-500 block font-sans">
                Gross Collection
              </span>
              <span className="font-bold text-slate-900">
                ₹{computedGrossInr.toLocaleString('en-IN')}
              </span>
            </div>
            <div>
              <span className="text-[10px] text-slate-500 block font-sans">
                Platform ({platformFeePct}%)
              </span>
              <span className="font-bold text-slate-700">
                ₹{computedPlatformShareInr.toLocaleString('en-IN')}
              </span>
            </div>
            <div className="text-right">
              <span className="text-[10px] text-emerald-700 block font-sans font-semibold">
                Partner Pay ({clampedPaymentPct}%)
              </span>
              <span className="font-bold text-emerald-700 text-sm">
                ₹{computedPartnerPayInr.toLocaleString('en-IN')}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <input
              type="text"
              value={payoutRefId}
              onChange={(e) => setPayoutRefId(e.target.value)}
              placeholder="UTR / UPI Reference ID (auto if empty)"
              className="px-3 py-2 border border-slate-200 rounded-xl bg-slate-50 text-slate-900 font-mono"
            />
            <input
              type="text"
              value={payoutRemarks}
              onChange={(e) => setPayoutRemarks(e.target.value)}
              placeholder="Optional note / remarks for partner"
              className="px-3 py-2 border border-slate-200 rounded-xl bg-slate-50 text-slate-900"
            />
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isSettlingPayout}
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition-colors cursor-pointer disabled:opacity-50 whitespace-nowrap"
            >
              <Send className="w-3.5 h-3.5" />
              <span>
                {isSettlingPayout
                  ? 'Processing Payment...'
                  : `Confirm & Pay ₹${computedPartnerPayInr.toLocaleString('en-IN')}`}
              </span>
            </button>
          </div>
        </form>

        {/* Right 5 Cols: Partner Bank Account, UPI Copy & Scan QR Card */}
        <div className="lg:col-span-5 bg-white border border-slate-200 rounded-2xl p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <Building2 className="w-4 h-4 text-indigo-600" />
              <h3 className="text-sm font-bold text-slate-900">
                Partner Bank &amp; UPI Pay Destination
              </h3>
            </div>
            {activeBank?.isVerified && (
              <span className="text-[11px] font-bold text-emerald-700">
                Verified
              </span>
            )}
          </div>

          {activeTeacher ? (
            <div className="space-y-3 text-xs">
              <div className="flex items-center gap-3 p-3 bg-slate-50 border border-slate-200 rounded-xl">
                <img
                  src={
                    activeTeacher.avatarUrl ||
                    activeTeacher.photoUrl ||
                    '/src/assets/images/hero_learning_studio_1793856674745.jpg'
                  }
                  alt={activeTeacher.name}
                  referrerPolicy="no-referrer"
                  className="w-10 h-10 rounded-xl object-cover border border-slate-200 shrink-0"
                />
                <div className="min-w-0">
                  <p className="font-bold text-slate-900 truncate">
                    {activeTeacher.name}
                  </p>
                  <p className="text-[11px] text-slate-500 truncate">
                    {activeTeacher.phone || activeTeacher.email}
                  </p>
                </div>
              </div>

              {activeBank ? (
                <div className="space-y-2 p-3.5 bg-slate-50 border border-slate-200 rounded-xl">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Account Holder</span>
                    <span className="font-bold text-slate-900">
                      {activeBank.accountHolderName}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Bank Name</span>
                    <span className="font-semibold text-slate-900">
                      {activeBank.bankName}
                    </span>
                  </div>
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-slate-500">Account No.</span>
                    <span className="font-mono font-bold text-slate-900 flex items-center gap-1.5">
                      {activeBank.accountNumber}
                      <button
                        type="button"
                        onClick={() =>
                          copyField('Account No', activeBank.accountNumber)
                        }
                        className="text-slate-500 hover:text-slate-900 cursor-pointer"
                      >
                        <Copy className="w-3.5 h-3.5" />
                      </button>
                    </span>
                  </div>
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-slate-500">IFSC Code</span>
                    <span className="font-mono font-bold text-slate-900 flex items-center gap-1.5">
                      {activeBank.ifscCode}
                      <button
                        type="button"
                        onClick={() => copyField('IFSC', activeBank.ifscCode)}
                        className="text-slate-500 hover:text-slate-900 cursor-pointer"
                      >
                        <Copy className="w-3.5 h-3.5" />
                      </button>
                    </span>
                  </div>
                  <div className="flex items-center justify-between gap-2 pt-1.5 border-t border-slate-200">
                    <span className="text-slate-500">UPI ID</span>
                    <span className="font-mono font-bold text-emerald-700 flex items-center gap-1.5">
                      {activeUpi || 'Not set'}
                      {activeUpi && (
                        <button
                          type="button"
                          onClick={() => copyField('UPI ID', activeUpi)}
                          className="text-slate-500 hover:text-slate-900 cursor-pointer"
                        >
                          <Copy className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </span>
                  </div>
                </div>
              ) : (
                <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between">
                  <span className="text-slate-600">
                    UPI ID:{' '}
                    <strong className="font-mono text-slate-900">
                      {activeUpi || 'Not Added Yet'}
                    </strong>
                  </span>
                  {activeUpi && (
                    <button
                      type="button"
                      onClick={() => copyField('UPI ID', activeUpi)}
                      className="text-xs text-indigo-600 font-semibold flex items-center gap-1 cursor-pointer"
                    >
                      <Copy className="w-3.5 h-3.5" /> Copy
                    </button>
                  )}
                </div>
              )}

              {activeBank?.qrCodeUrl && (
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-center space-y-2">
                  <span className="text-[11px] font-bold text-slate-700 flex items-center justify-center gap-1.5">
                    <QrCode className="w-3.5 h-3.5 text-emerald-600" />
                    Scan Partner UPI QR
                  </span>
                  <img
                    src={activeBank.qrCodeUrl}
                    alt={`${activeTeacher.name} UPI QR`}
                    className="w-36 h-36 mx-auto object-contain rounded-lg border border-slate-200 bg-white p-1"
                  />
                </div>
              )}

              {upiDeepLink && (
                <a
                  href={upiDeepLink}
                  className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl transition-colors"
                >
                  <Smartphone className="w-4 h-4 text-emerald-400" />
                  <span>
                    Pay ₹{computedPartnerPayInr.toLocaleString('en-IN')} via UPI
                    App ({activeUpi})
                  </span>
                </a>
              )}
            </div>
          ) : (
            <p className="text-xs text-slate-500 py-6 text-center">
              No partner profiles registered yet.
            </p>
          )}
        </div>
      </div>

      {/* 4. Partner Payout Settlement Ledger */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
            <h3 className="text-sm font-bold text-slate-900">
              Partner Payout Settlement Ledger ({filteredPayouts.length})
            </h3>
          </div>

          <div className="flex flex-wrap items-center gap-1 p-1 bg-slate-100 border border-slate-200 rounded-xl w-fit">
            {(
              ['all', 'Paid', 'Processing', 'Pending Settlement'] as const
            ).map((st) => (
              <button
                key={st}
                type="button"
                onClick={() => setLedgerFilter(st)}
                className={`px-2.5 py-1 text-[11px] font-semibold rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
                  ledgerFilter === st
                    ? 'bg-slate-900 text-white'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {st === 'all' ? 'All' : st}
              </button>
            ))}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-200 text-[11px] text-slate-500">
                <th className="py-2.5 px-3 font-semibold">Faculty Partner</th>
                <th className="py-2.5 px-3 font-semibold">Course / Batch</th>
                <th className="py-2.5 px-3 font-semibold text-right">Gross</th>
                <th className="py-2.5 px-3 font-semibold text-center">
                  Royalty %
                </th>
                <th className="py-2.5 px-3 font-semibold text-right">
                  Partner Pay
                </th>
                <th className="py-2.5 px-3 font-semibold">
                  Reference / Method
                </th>
                <th className="py-2.5 px-3 font-semibold">Status</th>
                <th className="py-2.5 px-3 font-semibold text-right">
                  Pay / Action
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredPayouts.map((p) => {
                const rowPct =
                  typeof p.royaltyPct === 'number'
                    ? p.royaltyPct
                    : p.grossAmountInr > 0
                      ? Math.round(
                          (p.partnerShareInr / p.grossAmountInr) * 100
                        )
                      : 80;
                return (
                  <tr key={p.id} className="hover:bg-slate-50">
                    <td className="py-2.5 px-3 font-semibold text-slate-900 whitespace-nowrap">
                      {p.teacherName}
                    </td>
                    <td className="py-2.5 px-3 text-slate-700 max-w-xs truncate">
                      {p.courseTitle}
                    </td>
                    <td className="py-2.5 px-3 text-right font-mono tabular-nums text-slate-600 whitespace-nowrap">
                      ₹{p.grossAmountInr.toLocaleString('en-IN')}
                    </td>
                    <td className="py-2.5 px-3 text-center font-mono tabular-nums font-bold text-indigo-700 whitespace-nowrap">
                      {rowPct}%
                    </td>
                    <td className="py-2.5 px-3 text-right font-mono tabular-nums font-bold text-emerald-700 whitespace-nowrap">
                      ₹{p.partnerShareInr.toLocaleString('en-IN')}
                    </td>
                    <td className="py-2.5 px-3 text-slate-600 whitespace-nowrap">
                      <span className="block text-[11px]">{p.payoutMethod}</span>
                      <span className="font-mono text-[11px] text-slate-500">
                        {p.referenceId}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 whitespace-nowrap">
                      <span
                        className={`text-[11px] font-semibold ${
                          p.status === 'Paid'
                            ? 'text-emerald-700'
                            : p.status === 'Processing'
                              ? 'text-indigo-700'
                              : 'text-amber-700'
                        }`}
                      >
                        {p.status}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-right whitespace-nowrap">
                      {p.status !== 'Paid' ? (
                        <div className="inline-flex items-center gap-1.5">
                          <input
                            type="text"
                            value={markPaidUtrs[p.id] || ''}
                            onChange={(e) =>
                              setMarkPaidUtrs((prev) => ({
                                ...prev,
                                [p.id]: e.target.value,
                              }))
                            }
                            placeholder="UTR (opt)"
                            className="w-24 px-2 py-1 text-[11px] font-mono border border-slate-200 rounded-lg bg-slate-50"
                          />
                          <button
                            type="button"
                            disabled={updatingPayoutId === p.id}
                            onClick={() => handleMarkPayoutPaid(p.id)}
                            className="px-2.5 py-1 text-[11px] font-bold bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg cursor-pointer disabled:opacity-50"
                          >
                            {updatingPayoutId === p.id
                              ? 'Paying...'
                              : 'Pay Now'}
                          </button>
                        </div>
                      ) : (
                        <span className="text-[11px] text-slate-400 font-mono tabular-nums">
                          {p.paidAt}
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
