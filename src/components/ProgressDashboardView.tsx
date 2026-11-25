import React from 'react';
import { CheckCircle2, Receipt, PlayCircle, BookOpen } from 'lucide-react';
import {
  Course,
  McqAttemptRecord,
  PurchaseReceipt,
} from '../types/education';

interface ProgressDashboardViewProps {
  courses: Course[];
  unlockedModuleIds: string[];
  mcqAttempts: McqAttemptRecord[];
  receipts: PurchaseReceipt[];
  streakDays: number;
  kidsXp: number;
  medium?: 'hi' | 'en';
  onSelectCourse: (course: Course) => void;
  onStartMcqSprint: () => void;
  onWatchLmsVideo?: (course: Course) => void;
}

export const ProgressDashboardView: React.FC<ProgressDashboardViewProps> = ({
  courses,
  unlockedModuleIds,
  mcqAttempts,
  receipts,
  streakDays,
  kidsXp,
  medium = 'hi',
  onSelectCourse,
  onStartMcqSprint,
  onWatchLmsVideo,
}) => {
  const totalModules = courses.reduce((acc, c) => acc + c.modules.length, 0);
  const unlockedCount = unlockedModuleIds.length;
  const overallMasteryPct = Math.round((unlockedCount / Math.max(1, totalModules)) * 100);

  const totalMcqsSolved = mcqAttempts.reduce((acc, a) => acc + a.total, 0);
  const avgAccuracy =
    mcqAttempts.length > 0
      ? Math.round(
          mcqAttempts.reduce((acc, a) => acc + a.accuracyPct, 0) / mcqAttempts.length
        )
      : 0;

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
            {medium === 'hi'
              ? 'Progress Tracking & 12-Month LMS Dashboard'
              : 'Progress Tracking Dashboard'}
          </h1>
          <p className="text-sm text-slate-600 mt-1">
            {medium === 'hi'
              ? 'Apne unlocked courses, LMS videos, MCQ accuracy aur payment receipts yahan dekhein.'
              : 'Track unlocked course modules, MCQ sprint accuracy, and payment receipts in one place.'}
          </p>
        </div>

        <button
          type="button"
          onClick={onStartMcqSprint}
          className="inline-flex items-center gap-2 px-4 py-2.5 text-xs font-semibold text-white bg-indigo-700 hover:bg-indigo-800 rounded-lg transition-colors self-start whitespace-nowrap"
        >
          <PlayCircle className="w-4 h-4" />
          <span>Launch MCQ Sprint</span>
        </button>
      </div>

      {/* 4-Column KPI Strip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200 rounded-xl p-5">
          <p className="text-xs font-medium text-slate-500">Curriculum Unlocked</p>
          <p className="text-2xl font-bold text-slate-900 mt-1 font-mono-tabular">
            {overallMasteryPct}%
          </p>
          <p className="text-xs text-slate-600 mt-1 font-mono-tabular">
            {unlockedCount} of {totalModules} modules active
          </p>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-5">
          <p className="text-xs font-medium text-slate-500">MCQ Sprint Accuracy</p>
          <p className="text-2xl font-bold text-indigo-700 mt-1 font-mono-tabular">
            {avgAccuracy}%
          </p>
          <p className="text-xs text-slate-600 mt-1 font-mono-tabular">
            {totalMcqsSolved} questions completed
          </p>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-5">
          <p className="text-xs font-medium text-slate-500">Active Study Streak</p>
          <p className="text-2xl font-bold text-slate-900 mt-1 font-mono-tabular">
            {streakDays} Days
          </p>
          <p className="text-xs text-slate-600 mt-1">Consistent daily practice</p>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-5">
          <p className="text-xs font-medium text-slate-500">Kids Arena XP</p>
          <p className="text-2xl font-bold text-amber-600 mt-1 font-mono-tabular">
            {kidsXp} XP
          </p>
          <p className="text-xs text-slate-600 mt-1">
            Level {Math.floor(kidsXp / 100) + 1} Explorer
          </p>
        </div>
      </div>

      {/* Course & Partial Module Progress */}
      <section className="bg-white border border-slate-200 rounded-xl p-6 space-y-5">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-900">
            Course &amp; Partial Module Access
          </h2>
          <span className="text-xs text-slate-500">
            Click any track to unlock additional chapters
          </span>
        </div>

        <div className="divide-y divide-slate-100">
          {courses.map((course) => {
            const unlockedInCourse = course.modules.filter((m) =>
              unlockedModuleIds.includes(m.id)
            ).length;
            const pct = Math.round((unlockedInCourse / course.modules.length) * 100);
            const statusText =
              pct === 100 ? 'Full Access' : pct > 0 ? 'Partial Access' : 'Locked';

            return (
              <div
                key={course.id}
                className="py-4 first:pt-0 last:pb-0 flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="space-y-1 max-w-xl">
                  <div className="flex items-center gap-2 text-xs text-slate-500">
                    <span className="font-semibold text-indigo-700">{course.categoryLabel}</span>
                    <span aria-hidden="true">·</span>
                    <span
                      className={`font-semibold ${
                        pct === 100
                          ? 'text-emerald-700'
                          : pct > 0
                          ? 'text-amber-700'
                          : 'text-slate-500'
                      }`}
                    >
                      {statusText}
                    </span>
                  </div>
                  <p className="text-sm font-bold text-slate-900">{course.title}</p>
                </div>

                <div className="flex items-center gap-4">
                  <div className="w-36 sm:w-48">
                    <div className="flex justify-between text-xs font-mono-tabular text-slate-600 mb-1">
                      <span>
                        {unlockedInCourse}/{course.modules.length} ch
                      </span>
                      <span>{pct}%</span>
                    </div>
                    <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${
                          pct === 100 ? 'bg-emerald-600' : 'bg-indigo-700'
                        }`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    {unlockedInCourse > 0 && onWatchLmsVideo && (
                      <button
                        type="button"
                        onClick={() => onWatchLmsVideo(course)}
                        className="px-3.5 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition-colors whitespace-nowrap cursor-pointer"
                      >
                        LMS Video
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => onSelectCourse(course)}
                      className="px-3.5 py-2 text-xs font-semibold text-slate-800 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors whitespace-nowrap cursor-pointer"
                    >
                      {pct === 100 ? 'View Syllabus' : 'Unlock More'}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Two-Column Bottom: MCQ History & Payment Receipts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent MCQ Sprint Attempts */}
        <section className="bg-white border border-slate-200 rounded-xl p-6 space-y-4">
          <div className="flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-indigo-700" />
            <h2 className="text-base font-bold text-slate-900">Recent MCQ Segment Sprints</h2>
          </div>

          {mcqAttempts.length === 0 ? (
            <p className="text-sm text-slate-500 py-4">
              No MCQ sprints completed yet. Try an automatic segment sprint!
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 text-[11px] font-semibold text-slate-500">
                    <th className="py-2 pr-3">Track</th>
                    <th className="py-2 px-3">Score</th>
                    <th className="py-2 px-3">Accuracy</th>
                    <th className="py-2 pl-3 text-right">Pace</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs">
                  {mcqAttempts.map((att) => (
                    <tr key={att.id}>
                      <td className="py-3 pr-3 font-semibold text-slate-900">
                        {att.trackTitle}
                        <div className="text-[11px] font-normal text-slate-500 font-mono-tabular">
                          {att.date}
                        </div>
                      </td>
                      <td className="py-3 px-3 font-mono-tabular text-slate-700">
                        {att.score}/{att.total}
                      </td>
                      <td className="py-3 px-3 font-mono-tabular font-semibold text-emerald-700">
                        {att.accuracyPct}%
                      </td>
                      <td className="py-3 pl-3 text-right font-mono-tabular text-slate-600">
                        {att.avgTimeSec}s/q
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        {/* Payment Receipts */}
        <section className="bg-white border border-slate-200 rounded-xl p-6 space-y-4">
          <div className="flex items-center gap-2">
            <Receipt className="w-4 h-4 text-indigo-700" />
            <h2 className="text-base font-bold text-slate-900">
              Payment Receipts &amp; Partial Purchases
            </h2>
          </div>

          {receipts.length === 0 ? (
            <p className="text-sm text-slate-500 py-4">No transactions recorded yet.</p>
          ) : (
            <div className="space-y-3">
              {receipts.map((rcpt) => (
                <div
                  key={rcpt.id}
                  className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-1.5"
                >
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-mono-tabular font-semibold text-slate-500">
                      {rcpt.transactionId} · {rcpt.date}
                    </span>
                    <span className="inline-flex items-center gap-1 font-semibold text-emerald-700">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Paid ₹{rcpt.amountPaidInr}
                    </span>
                  </div>
                  <p className="text-sm font-bold text-slate-900">{rcpt.courseTitle}</p>
                  <p className="text-xs text-slate-600">
                    {rcpt.purchaseType} ({rcpt.moduleTitles.length} module(s)) · {rcpt.paymentMethod}
                  </p>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
};
