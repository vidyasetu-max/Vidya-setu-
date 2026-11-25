import React, { useMemo, useState } from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts';
import { TrendingUp, ArrowUpRight, Upload } from 'lucide-react';
import { PartnerPayoutRecord } from '../types/education';

interface PartnerRoyaltyChartProps {
  payouts: PartnerPayoutRecord[];
  partnerRoyaltyPct: number;
  onNavigateToCreateCourse?: () => void;
}

interface MonthlyRoyaltyPoint {
  monthKey: string;
  label: string;
  shortLabel: string;
  royaltyEarned: number;
  settledRoyalty: number;
  pendingRoyalty: number;
  grossRevenue: number;
  payoutCount: number;
}

const MONTH_NAMES_SHORT = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
];

const MONTH_LOOKUP: Record<string, number> = {
  jan: 0,
  january: 0,
  feb: 1,
  february: 1,
  mar: 2,
  march: 2,
  apr: 3,
  april: 3,
  may: 4,
  jun: 5,
  june: 5,
  jul: 6,
  july: 6,
  aug: 7,
  august: 7,
  sep: 8,
  sept: 8,
  september: 8,
  oct: 9,
  october: 9,
  nov: 10,
  november: 10,
  dec: 11,
  december: 11,
};

function toMonthKey(year: number, monthIndex: number): string {
  return `${year}-${String(monthIndex + 1).padStart(2, '0')}`;
}

function parseMonthYearString(raw?: string): string | null {
  if (!raw) return null;
  const trimmed = raw.trim();
  if (!trimmed) return null;

  // Match ISO YYYY-MM or YYYY-MM-DD
  const isoMatch = trimmed.match(/^(\d{4})[-/](\d{1,2})(?:[-/]\d{1,2})?/);
  if (isoMatch) {
    const year = Number(isoMatch[1]);
    const month = Number(isoMatch[2]) - 1;
    if (year >= 2000 && month >= 0 && month <= 11) {
      return toMonthKey(year, month);
    }
  }

  // Match "Oct 2026", "Nov-2026", "Scheduled Nov 15, 2026"
  const textMatch = trimmed.match(
    /\b(jan(?:uary)?|feb(?:ruary)?|mar(?:ch)?|apr(?:il)?|may|june?|july?|aug(?:ust)?|sep(?:t(?:ember)?)?|oct(?:ober)?|nov(?:ember)?|dec(?:ember)?)\b[\s,\-]*(?:\d{1,2}[\s,\-]+)?(\d{4})/i
  );
  if (textMatch) {
    const monthIdx = MONTH_LOOKUP[textMatch[1].toLowerCase()];
    const year = Number(textMatch[2]);
    if (typeof monthIdx === 'number' && year >= 2000) {
      return toMonthKey(year, monthIdx);
    }
  }

  const parsedDate = new Date(trimmed);
  if (!Number.isNaN(parsedDate.getTime())) {
    return toMonthKey(parsedDate.getFullYear(), parsedDate.getMonth());
  }

  return null;
}

function resolvePayoutMonthKey(
  record: PartnerPayoutRecord,
  fallbackNow: Date
): string {
  const fromPeriod = parseMonthYearString(record.periodLabel);
  if (fromPeriod) return fromPeriod;
  const fromPaidAt = parseMonthYearString(record.paidAt);
  if (fromPaidAt) return fromPaidAt;
  return toMonthKey(fallbackNow.getFullYear(), fallbackNow.getMonth());
}

function formatInrAxis(value: number): string {
  if (value === 0) return '₹0';
  if (Math.abs(value) >= 100000) {
    const lakhs = value / 100000;
    return `₹${Number.isInteger(lakhs) ? lakhs : lakhs.toFixed(1)}L`;
  }
  if (Math.abs(value) >= 1000) {
    const k = value / 1000;
    return `₹${Number.isInteger(k) ? k : k.toFixed(1)}k`;
  }
  return `₹${Math.round(value)}`;
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{ payload: MonthlyRoyaltyPoint }>;
  chartMode: 'royalty-settled' | 'royalty-gross';
}

const RoyaltyChartTooltip: React.FC<CustomTooltipProps> = ({
  active,
  payload,
  chartMode,
}) => {
  if (!active || !payload || payload.length === 0) return null;
  const point = payload[0]?.payload;
  if (!point) return null;

  return (
    <div className="bg-slate-950 text-white rounded-xl border border-slate-800 px-3.5 py-2.5 shadow-xl text-xs min-w-[210px]">
      <div className="flex items-center justify-between gap-4 pb-1.5 mb-1.5 border-b border-slate-800">
        <span className="font-bold text-white">{point.label}</span>
        <span className="text-[11px] text-slate-400 font-mono tabular-nums">
          {point.payoutCount} {point.payoutCount === 1 ? 'payout' : 'payouts'}
        </span>
      </div>
      <div className="space-y-1">
        <div className="flex items-center justify-between gap-4">
          <span className="text-emerald-300 font-medium">Royalty Earned</span>
          <span className="font-mono tabular-nums font-bold text-emerald-400">
            ₹{point.royaltyEarned.toLocaleString('en-IN')}
          </span>
        </div>
        {chartMode === 'royalty-settled' ? (
          <>
            <div className="flex items-center justify-between gap-4">
              <span className="text-slate-300">Settled (Paid)</span>
              <span className="font-mono tabular-nums font-semibold text-white">
                ₹{point.settledRoyalty.toLocaleString('en-IN')}
              </span>
            </div>
            {point.pendingRoyalty > 0 && (
              <div className="flex items-center justify-between gap-4">
                <span className="text-amber-300">Pending / Queued</span>
                <span className="font-mono tabular-nums font-semibold text-amber-300">
                  ₹{point.pendingRoyalty.toLocaleString('en-IN')}
                </span>
              </div>
            )}
          </>
        ) : (
          <div className="flex items-center justify-between gap-4">
            <span className="text-indigo-300">Gross Student Fees</span>
            <span className="font-mono tabular-nums font-semibold text-white">
              ₹{point.grossRevenue.toLocaleString('en-IN')}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export const PartnerRoyaltyChart: React.FC<PartnerRoyaltyChartProps> = ({
  payouts,
  partnerRoyaltyPct,
  onNavigateToCreateCourse,
}) => {
  const [chartMode, setChartMode] = useState<'royalty-settled' | 'royalty-gross'>(
    'royalty-settled'
  );

  const { series, sixMonthTotal, monthlyAvg, peakMonth, latestMonth, momDeltaPct } =
    useMemo(() => {
      const now = new Date();
      const buckets = new Map<string, MonthlyRoyaltyPoint>();
      const orderedKeys: string[] = [];

      // Trailing 6 calendar months ending in the current month
      for (let offset = 5; offset >= 0; offset--) {
        const d = new Date(now.getFullYear(), now.getMonth() - offset, 1);
        const key = toMonthKey(d.getFullYear(), d.getMonth());
        const mShort = MONTH_NAMES_SHORT[d.getMonth()];
        const yShort = String(d.getFullYear()).slice(-2);
        orderedKeys.push(key);
        buckets.set(key, {
          monthKey: key,
          label: `${mShort} ${d.getFullYear()}`,
          shortLabel: `${mShort} '${yShort}`,
          royaltyEarned: 0,
          settledRoyalty: 0,
          pendingRoyalty: 0,
          grossRevenue: 0,
          payoutCount: 0,
        });
      }

      payouts.forEach((p) => {
        const key = resolvePayoutMonthKey(p, now);
        const bucket = buckets.get(key);
        if (!bucket) return;
        const share = Number(p.partnerShareInr) || 0;
        const gross = Number(p.grossAmountInr) || 0;
        bucket.royaltyEarned += share;
        bucket.grossRevenue += gross;
        bucket.payoutCount += 1;
        if (p.status === 'Paid') {
          bucket.settledRoyalty += share;
        } else {
          bucket.pendingRoyalty += share;
        }
      });

      const list = orderedKeys.map((k) => buckets.get(k)!);
      const total = list.reduce((sum, item) => sum + item.royaltyEarned, 0);
      const avg = Math.round(total / list.length);
      const peak = list.reduce(
        (best, item) => (item.royaltyEarned > best.royaltyEarned ? item : best),
        list[0]
      );
      const curr = list[list.length - 1];
      const prev = list[list.length - 2];
      let deltaPct: number | null = null;
      if (prev && prev.royaltyEarned > 0) {
        deltaPct = Math.round(
          ((curr.royaltyEarned - prev.royaltyEarned) / prev.royaltyEarned) * 100
        );
      }

      return {
        series: list,
        sixMonthTotal: total,
        monthlyAvg: avg,
        peakMonth: peak,
        latestMonth: curr,
        momDeltaPct: deltaPct,
      };
    }, [payouts]);

  const rangeLabel =
    series.length >= 2
      ? `${series[0].label} – ${series[series.length - 1].label}`
      : 'Last 6 Months';

  const hasAnyEarnings = sixMonthTotal > 0;

  return (
    <section
      aria-label="Royalty earnings over the last 6 months"
      className="bg-white border border-slate-200 rounded-2xl p-6 space-y-5"
    >
      {/* Chart Header Row */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="p-2.5 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-xl shrink-0">
            <TrendingUp className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900">
              Royalty Earnings Summary (Last 6 Months)
            </h3>
            <p className="text-xs text-slate-500 mt-0.5 flex flex-wrap items-center gap-1.5">
              <span>{rangeLabel}</span>
              <span aria-hidden="true">·</span>
              <span className="font-mono tabular-nums">
                Active Royalty: {partnerRoyaltyPct}%
              </span>
              <span aria-hidden="true">·</span>
              <span className="font-mono tabular-nums">
                {payouts.length} {payouts.length === 1 ? 'record' : 'records'}
              </span>
            </p>
          </div>
        </div>

        {/* Interactive Series Switcher */}
        <div
          role="group"
          aria-label="Chart comparison series"
          className="inline-flex items-center gap-1 p-1 bg-slate-100 border border-slate-200 rounded-xl self-start lg:self-auto"
        >
          <button
            type="button"
            onClick={() => setChartMode('royalty-settled')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
              chartMode === 'royalty-settled'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Earned vs Settled
          </button>
          <button
            type="button"
            onClick={() => setChartMode('royalty-gross')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
              chartMode === 'royalty-gross'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Royalty vs Gross
          </button>
        </div>
      </div>

      {/* Inline Metric Strip (Whitespace & Hairline Dividers, Tabular Figures) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 py-3.5 border-y border-slate-100">
        <div>
          <span className="text-[11px] font-semibold text-slate-500 block">
            6-Month Royalty Total
          </span>
          <span className="text-lg font-bold text-slate-900 font-mono tabular-nums mt-0.5 block">
            ₹{sixMonthTotal.toLocaleString('en-IN')}
          </span>
        </div>
        <div>
          <span className="text-[11px] font-semibold text-slate-500 block">
            Monthly Average
          </span>
          <span className="text-lg font-bold text-slate-900 font-mono tabular-nums mt-0.5 block">
            ₹{monthlyAvg.toLocaleString('en-IN')}
          </span>
        </div>
        <div>
          <span className="text-[11px] font-semibold text-slate-500 block">
            Peak Month
          </span>
          <span className="text-sm font-bold text-emerald-700 font-mono tabular-nums mt-1 block">
            {peakMonth && peakMonth.royaltyEarned > 0
              ? `${peakMonth.label} · ₹${peakMonth.royaltyEarned.toLocaleString('en-IN')}`
              : '—'}
          </span>
        </div>
        <div>
          <span className="text-[11px] font-semibold text-slate-500 block">
            {latestMonth?.label || 'Current Month'}
          </span>
          <div className="flex items-baseline gap-2 mt-0.5">
            <span className="text-lg font-bold text-slate-900 font-mono tabular-nums">
              ₹{(latestMonth?.royaltyEarned || 0).toLocaleString('en-IN')}
            </span>
            {momDeltaPct !== null && (
              <span
                className={`text-[11px] font-bold font-mono tabular-nums ${
                  momDeltaPct >= 0 ? 'text-emerald-700' : 'text-rose-600'
                }`}
              >
                {momDeltaPct >= 0 ? `+${momDeltaPct}%` : `${momDeltaPct}%`} MoM
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Responsive Line Chart */}
      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={series}
            margin={{ top: 10, right: 16, left: 4, bottom: 4 }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              stroke="#E2E8F0"
            />
            <XAxis
              dataKey="shortLabel"
              axisLine={{ stroke: '#CBD5E1' }}
              tickLine={false}
              tick={{ fill: '#64748B', fontSize: 11, fontFamily: 'IBM Plex Mono' }}
              dy={6}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              width={60}
              tickFormatter={formatInrAxis}
              tick={{ fill: '#64748B', fontSize: 11, fontFamily: 'IBM Plex Mono' }}
              domain={[0, (dataMax: number) => (dataMax > 0 ? Math.ceil(dataMax * 1.15) : 1000)]}
            />
            <Tooltip
              content={<RoyaltyChartTooltip chartMode={chartMode} />}
              cursor={{ stroke: '#CBD5E1', strokeDasharray: '4 4' }}
            />
            {chartMode === 'royalty-settled' ? (
              <Line
                type="monotone"
                dataKey="settledRoyalty"
                name="Settled (Paid)"
                stroke="#334155"
                strokeWidth={2}
                strokeDasharray="5 4"
                dot={{ r: 3.5, fill: '#FFFFFF', stroke: '#334155', strokeWidth: 2 }}
                activeDot={{ r: 5.5, fill: '#334155', stroke: '#FFFFFF', strokeWidth: 2 }}
              />
            ) : (
              <Line
                type="monotone"
                dataKey="grossRevenue"
                name="Gross Student Fees"
                stroke="#4F46E5"
                strokeWidth={2}
                strokeDasharray="5 4"
                dot={{ r: 3.5, fill: '#FFFFFF', stroke: '#4F46E5', strokeWidth: 2 }}
                activeDot={{ r: 5.5, fill: '#4F46E5', stroke: '#FFFFFF', strokeWidth: 2 }}
              />
            )}
            <Line
              type="monotone"
              dataKey="royaltyEarned"
              name="Royalty Earned"
              stroke="#059669"
              strokeWidth={2.75}
              dot={{ r: 4.5, fill: '#FFFFFF', stroke: '#059669', strokeWidth: 2.25 }}
              activeDot={{ r: 6.5, fill: '#059669', stroke: '#FFFFFF', strokeWidth: 2 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Chart Key + Helpful Empty Note */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1 text-xs">
        <div className="flex flex-wrap items-center gap-5 text-slate-600">
          <span className="inline-flex items-center gap-2 font-semibold text-slate-800">
            <span className="w-5 h-0.5 bg-emerald-600 inline-block" aria-hidden="true" />
            <span>Royalty Earned ({partnerRoyaltyPct}%)</span>
          </span>
          {chartMode === 'royalty-settled' ? (
            <span className="inline-flex items-center gap-2">
              <span
                className="w-5 border-t-2 border-dashed border-slate-700 inline-block"
                aria-hidden="true"
              />
              <span>Settled to Bank / UPI</span>
            </span>
          ) : (
            <span className="inline-flex items-center gap-2">
              <span
                className="w-5 border-t-2 border-dashed border-indigo-600 inline-block"
                aria-hidden="true"
              />
              <span>Gross Course Collections</span>
            </span>
          )}
        </div>

        {!hasAnyEarnings && (
          <div className="flex flex-wrap items-center gap-3 text-slate-500">
            <span>
              No payouts recorded in this 6-month window yet.
            </span>
            {onNavigateToCreateCourse && (
              <button
                type="button"
                onClick={onNavigateToCreateCourse}
                className="inline-flex items-center gap-1 text-emerald-700 hover:text-emerald-800 font-bold cursor-pointer whitespace-nowrap"
              >
                <Upload className="w-3.5 h-3.5" />
                <span>Publish a Course</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        )}
      </div>
    </section>
  );
};
