import React, { useState } from 'react';
import {
  Cpu,
  Terminal,
  TrendingUp,
  Briefcase,
  ArrowRight,
  CheckCircle2,
  Lock,
  Clock,
} from 'lucide-react';
import { Course, StudyMedium } from '../types/education';

interface SkillsHubViewProps {
  courses: Course[];
  unlockedModuleIds: string[];
  medium: StudyMedium;
  onSelectCourse: (course: Course) => void;
  onStartMcqSprint: (trackId?: string) => void;
  onWatchLmsVideo: (course: Course) => void;
}

const ACCENT_STYLES: Record<
  'emerald' | 'indigo' | 'amber' | 'cyan',
  {
    topBar: string;
    iconBg: string;
    salaryText: string;
    buttonBg: string;
    borderHover: string;
  }
> = {
  indigo: {
    topBar: 'bg-indigo-600',
    iconBg: 'bg-indigo-50 text-indigo-700',
    salaryText: 'text-indigo-700',
    buttonBg: 'bg-indigo-600 hover:bg-indigo-700',
    borderHover: 'hover:border-indigo-300',
  },
  amber: {
    topBar: 'bg-amber-500',
    iconBg: 'bg-amber-50 text-amber-800',
    salaryText: 'text-amber-700',
    buttonBg: 'bg-amber-600 hover:bg-amber-700',
    borderHover: 'hover:border-amber-300',
  },
  emerald: {
    topBar: 'bg-emerald-600',
    iconBg: 'bg-emerald-50 text-emerald-700',
    salaryText: 'text-emerald-700',
    buttonBg: 'bg-emerald-600 hover:bg-emerald-700',
    borderHover: 'hover:border-emerald-300',
  },
  cyan: {
    topBar: 'bg-cyan-600',
    iconBg: 'bg-cyan-50 text-cyan-800',
    salaryText: 'text-cyan-700',
    buttonBg: 'bg-cyan-600 hover:bg-cyan-700',
    borderHover: 'hover:border-cyan-300',
  },
};

export const SkillsHubView: React.FC<SkillsHubViewProps> = ({
  courses,
  unlockedModuleIds,
  medium,
  onSelectCourse,
  onStartMcqSprint,
  onWatchLmsVideo,
}) => {
  const skillCourses = courses.filter((c) => c.category === 'skills');
  const [selectedSkillId, setSelectedSkillId] = useState<string>('all');

  const visibleCourses =
    selectedSkillId === 'all'
      ? skillCourses
      : skillCourses.filter((c) => c.id === selectedSkillId);

  const getSkillIcon = (id: string) => {
    if (id.includes('ai')) return Cpu;
    if (id.includes('python')) return Terminal;
    return TrendingUp;
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700">
            <Briefcase className="w-4 h-4" />
            <span>
              {medium === 'hi'
                ? 'हाई-सैलरी करियर स्किल्स · AI, Python और डिजिटल मार्केटिंग'
                : 'High-Salary Career Skills · AI, Python & Digital Marketing'}
            </span>
          </span>
          <span className="text-xs font-mono-tabular font-semibold text-slate-500">
            {medium === 'hi' ? 'औसत पैकेज: ₹6–35 LPA' : 'Avg Package: ₹6–35 LPA'}
          </span>
        </div>

        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
          {medium === 'hi'
            ? 'High-Salary Career Skills Seekhein (12 Months LMS Access)'
            : 'Master High-Salary Tech & Digital Skills'}
        </h1>

        <p className="text-sm sm:text-base text-slate-600 max-w-2xl leading-relaxed">
          {medium === 'hi'
            ? 'AI Engineering, Python Programming aur Digital Marketing ke practical modules — sirf ₹249 per chapter se start karein.'
            : 'Build real-world projects in AI & GenAI, Python Automation, and Performance Digital Marketing—unlock single chapters from ₹249 or the full track.'}
        </p>

        {/* Color-Coded Skill Filter Tabs */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl overflow-x-auto pt-1">
          <button
            type="button"
            onClick={() => setSelectedSkillId('all')}
            className={`px-3.5 py-2 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap shrink-0 ${
              selectedSkillId === 'all'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            {medium === 'hi' ? 'सभी हाई-सैलरी स्किल्स' : 'All High-Salary Skills'}
          </button>
          {skillCourses.map((sc) => (
            <button
              key={sc.id}
              type="button"
              onClick={() => setSelectedSkillId(sc.id)}
              className={`px-3.5 py-2 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap shrink-0 ${
                selectedSkillId === sc.id
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {sc.id.includes('ai')
                ? 'AI & GenAI'
                : sc.id.includes('python')
                ? 'Python'
                : 'Digital Marketing'}
            </button>
          ))}
        </div>
      </div>

      {/* High-Salary Skill Cards with Distinct Color Accents */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {visibleCourses.map((course) => {
          const accent = ACCENT_STYLES[course.accentColor || 'emerald'];
          const Icon = getSkillIcon(course.id);
          const unlockedCount = course.modules.filter((m) =>
            unlockedModuleIds.includes(m.id)
          ).length;
          const minPrice = Math.min(...course.modules.map((m) => m.priceInr));

          return (
            <article
              key={course.id}
              className={`bg-white border border-slate-200 ${accent.borderHover} rounded-2xl overflow-hidden flex flex-col justify-between transition-colors`}
            >
              <div>
                {/* Distinct Color Top Bar */}
                <div className={`h-2 w-full ${accent.topBar}`} />

                <div className="p-6 space-y-4">
                  <div className="flex items-center justify-between gap-3">
                    <div
                      className={`w-11 h-11 rounded-xl ${accent.iconBg} flex items-center justify-center shrink-0`}
                    >
                      <Icon className="w-5 h-5" />
                    </div>

                    {course.salaryRange && (
                      <div className="text-right">
                        <p className="text-[11px] font-medium text-slate-500">
                          {medium === 'hi' ? 'सैलरी पैकेज' : 'Salary Range'}
                        </p>
                        <p
                          className={`text-sm font-bold font-mono-tabular ${accent.salaryText}`}
                        >
                          {course.salaryRange}
                        </p>
                      </div>
                    )}
                  </div>

                  <div>
                    <p className="text-xs font-semibold text-slate-500">
                      {course.categoryLabel} · {course.instructor}
                    </p>
                    <h2 className="text-lg font-bold text-slate-900 mt-1 leading-snug">
                      {course.title}
                    </h2>
                  </div>

                  <p className="text-sm text-slate-600 leading-relaxed">
                    {medium === 'hi' && course.hindiSubtitle
                      ? course.hindiSubtitle
                      : course.subtitle}
                  </p>

                  {/* Module List Preview */}
                  <div className="pt-2 border-t border-slate-100 space-y-1.5">
                    {course.modules.map((m) => {
                      const isOpen = unlockedModuleIds.includes(m.id);
                      return (
                        <div
                          key={m.id}
                          className="flex items-center justify-between text-xs text-slate-700"
                        >
                          <span className="truncate pr-2">{m.title}</span>
                          {isOpen ? (
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                          ) : (
                            <span className="font-mono-tabular text-slate-400 shrink-0">
                              ₹{m.priceInr}
                            </span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between gap-3">
                <div>
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-lg font-bold text-slate-900 font-mono-tabular">
                      ₹{minPrice}
                    </span>
                    <span className="text-xs text-slate-500">
                      {medium === 'hi' ? '/चैप्टर' : '/chapter'}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 flex items-center gap-1 font-mono-tabular">
                    <Clock className="w-3 h-3" />
                    <span>
                      Full ₹{course.fullPriceInr} · {unlockedCount}/{course.modules.length}
                    </span>
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  {unlockedCount > 0 && (
                    <button
                      type="button"
                      onClick={() => onWatchLmsVideo(course)}
                      className="px-3 py-2 text-xs font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 rounded-xl transition-colors whitespace-nowrap cursor-pointer"
                    >
                      LMS Video
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => onStartMcqSprint(course.id)}
                    className="px-3 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-200 hover:border-slate-300 rounded-xl transition-colors whitespace-nowrap"
                  >
                    MCQ
                  </button>
                  <button
                    type="button"
                    onClick={() => onSelectCourse(course)}
                    className={`inline-flex items-center gap-1 px-4 py-2 text-xs font-semibold text-white ${accent.buttonBg} rounded-xl transition-colors whitespace-nowrap cursor-pointer`}
                  >
                    <span>
                      {unlockedCount === course.modules.length
                        ? medium === 'hi'
                          ? 'Open'
                          : 'Open'
                        : medium === 'hi'
                        ? 'Select'
                        : 'Enroll'}
                    </span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
};
