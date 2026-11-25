import React, { useState } from 'react';
import {
  BookOpen,
  CheckCircle2,
  Play,
  Lock,
  Sparkles,
  GraduationCap,
  Atom,
  Dna,
  Landmark,
  Calculator,
  Calendar,
  Layers,
} from 'lucide-react';
import {
  K12ClassLevel,
  K12StreamId,
  K12SubjectCourse,
} from '../data/k12SubjectsData';
import { Course, CourseModule } from '../types/education';

interface K12SubjectExplorerProps {
  courses: Course[];
  unlockedModuleIds: string[];
  medium: 'hi' | 'en';
  initialClass?: K12ClassLevel;
  onWatchDemoVideo: (course: Course, moduleId?: string) => void;
  onUnlockSubjectLifetime: (params: {
    course: Course;
    purchaseType: 'Full Course' | 'Partial Modules';
    selectedModules: CourseModule[];
    finalAmountInr: number;
  }) => void;
  onViewChapters: (course: Course) => void;
}

const CLASS_OPTIONS: {
  id: K12ClassLevel;
  label: string;
  hiLabel: string;
  tag: string;
}[] = [
  { id: '9', label: 'Class 9', hiLabel: 'कक्षा 9', tag: 'Foundation' },
  { id: '10', label: 'Class 10', hiLabel: 'कक्षा 10', tag: 'Board Exam' },
  { id: '11', label: 'Class 11', hiLabel: 'कक्षा 11', tag: 'Stream Choice' },
  { id: '12', label: 'Class 12', hiLabel: 'कक्षा 12', tag: 'Board + Entrance' },
];

const STREAM_OPTIONS: {
  id: K12StreamId;
  label: string;
  hiLabel: string;
  subjectsPreview: string;
  icon: React.FC<{ className?: string }>;
  accent: string;
}[] = [
  {
    id: 'pcm',
    label: 'PCM (Science + Maths)',
    hiLabel: 'PCM (गणित, भौतिक, रसायन)',
    subjectsPreview: 'Maths • Physics • Chemistry • English',
    icon: Atom,
    accent: 'border-indigo-200 bg-indigo-50/60 text-indigo-700',
  },
  {
    id: 'pcb',
    label: 'PCB (Science + Biology)',
    hiLabel: 'PCB (जीव, भौतिक, रसायन)',
    subjectsPreview: 'Physics • Chemistry • Biology • English',
    icon: Dna,
    accent: 'border-emerald-200 bg-emerald-50/60 text-emerald-700',
  },
  {
    id: 'arts',
    label: 'Arts (Humanities)',
    hiLabel: 'Arts (इतिहास, राजनीति, भूगोल)',
    subjectsPreview: 'History • Pol. Science • Geography • Economics',
    icon: Landmark,
    accent: 'border-amber-200 bg-amber-50/60 text-amber-700',
  },
  {
    id: 'commerce',
    label: 'Commerce',
    hiLabel: 'Commerce (लेखाशास्त्र, व्यवसाय)',
    subjectsPreview: 'Accountancy • Business • Economics • Maths',
    icon: Calculator,
    accent: 'border-cyan-200 bg-cyan-50/60 text-cyan-700',
  },
];

export const K12SubjectExplorer: React.FC<K12SubjectExplorerProps> = ({
  courses,
  unlockedModuleIds,
  medium,
  initialClass = '11',
  onWatchDemoVideo,
  onUnlockSubjectLifetime,
  onViewChapters,
}) => {
  const [selectedClass, setSelectedClass] = useState<K12ClassLevel>(initialClass);
  const [selectedStream, setSelectedStream] = useState<K12StreamId>('pcm');

  const k12Courses = courses.filter(
    (c): c is K12SubjectCourse =>
      'k12Class' in c && c.category === 'k12'
  );

  const matchingSubjects = k12Courses.filter((c) => {
    if (selectedClass === '9') {
      return c.k12Class === '9';
    }
    return (
      c.k12Class === selectedClass &&
      (c.k12Stream === selectedStream ||
        !c.k12Stream ||
        (c.k12Stream as string) === 'general')
    );
  });

  return (
    <div className="bg-gradient-to-b from-emerald-50/50 via-white to-white border border-emerald-200 rounded-2xl p-5 sm:p-7 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-emerald-100 pb-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-100 text-emerald-800 text-xs font-bold mb-1.5">
            <GraduationCap className="w-3.5 h-3.5" />
            <span>
              {medium === 'hi'
                ? 'कक्षा 9–12 • Subject-by-Subject कोर्स'
                : 'Class 9–12 • Subject-by-Subject Learning'}
            </span>
          </div>
          <h3 className="text-lg sm:text-xl font-bold text-slate-900">
            {medium === 'hi'
              ? '1. कक्षा चुनें → 2. स्ट्रीम चुनें → 3. विषय का फ्री डेमो देखें और 12 Months Access पाएं'
              : '1. Select Class → 2. Select Stream → 3. Watch Free Demo & Unlock Subject for 12 Months'}
          </h3>
        </div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 text-white rounded-xl text-xs font-bold shrink-0">
          <Calendar className="w-4 h-4 text-emerald-400" />
          <span>
            {medium === 'hi'
              ? '1 बार पेमेंट = 12 महीने का एक्सेस'
              : 'Pay Once = 12 Months Access'}
          </span>
        </div>
      </div>

      {/* STEP 1: Select Class (9, 10, 11, 12) */}
      <div className="space-y-2.5">
        <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
          {medium === 'hi' ? 'Step 1: अपनी कक्षा चुनें (Class 9–12)' : 'Step 1: Select Your Class'}
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {CLASS_OPTIONS.map((cls) => {
            const active = selectedClass === cls.id;
            return (
              <button
                key={cls.id}
                type="button"
                onClick={() => setSelectedClass(cls.id)}
                className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                  active
                    ? 'border-emerald-600 bg-emerald-600 text-white shadow-sm'
                    : 'border-slate-200 bg-white text-slate-900 hover:border-emerald-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-base font-bold">
                    {medium === 'hi' ? cls.hiLabel : cls.label}
                  </span>
                  {active && <CheckCircle2 className="w-4 h-4 text-white" />}
                </div>
                <p
                  className={`text-xs mt-0.5 ${
                    active ? 'text-emerald-100' : 'text-slate-500'
                  }`}
                >
                  {cls.tag}
                </p>
              </button>
            );
          })}
        </div>
      </div>

      {/* STEP 2: Select Stream (PCM, PCB, Arts, Commerce) for Class 10, 11, 12 */}
      {selectedClass !== '9' ? (
        <div className="space-y-2.5">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
            {medium === 'hi'
              ? `Step 2: कक्षा ${selectedClass} के लिए अपनी स्ट्रीम चुनें (PCM / PCB / Arts / Commerce)`
              : `Step 2: Select Stream for Class ${selectedClass}`}
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {STREAM_OPTIONS.map((st) => {
              const Icon = st.icon;
              const active = selectedStream === st.id;
              return (
                <button
                  key={st.id}
                  type="button"
                  onClick={() => setSelectedStream(st.id)}
                  className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer flex items-start gap-3 ${
                    active
                      ? 'border-slate-900 bg-slate-900 text-white shadow-sm'
                      : 'border-slate-200 bg-white text-slate-900 hover:border-slate-300'
                  }`}
                >
                  <div
                    className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${
                      active ? 'bg-emerald-500 text-white' : st.accent
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-bold leading-snug">
                      {medium === 'hi' ? st.hiLabel : st.label}
                    </p>
                    <p
                      className={`text-[11px] mt-0.5 line-clamp-1 ${
                        active ? 'text-slate-300' : 'text-slate-500'
                      }`}
                    >
                      {st.subjectsPreview}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl text-xs font-semibold text-emerald-900 flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>
            {medium === 'hi'
              ? 'कक्षा 9 के सभी मुख्य विषय (गणित, विज्ञान, इतिहास, भूगोल, अंग्रेज़ी) नीचे दिए गए हैं — किसी भी विषय का फ्री डेमो देखें!'
              : 'Showing all Class 9 Foundation subjects below — watch a Free Demo Video or unlock any subject for 12 Months!'}
          </span>
        </div>
      )}

      {/* STEP 3: Subject-by-Subject Cards with Free Demo Video + 12 Months Subject Payment */}
      <div className="space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
            {medium === 'hi'
              ? `Step 3: अपना विषय चुनें (${matchingSubjects.length} Subjects Available)`
              : `Step 3: Choose Your Subject (${matchingSubjects.length} Subjects)`}
          </p>
          <span className="text-xs text-emerald-700 font-semibold">
            {medium === 'hi'
              ? 'जिस विषय का पेमेंट करेंगे, उसके सभी चैप्टर 12 महीने के लिए खुल जाएंगे'
              : 'Unlocking a subject gives 12 Months Access to ALL its chapters'}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {matchingSubjects.map((subject) => {
            const totalChapters = subject.modules.length;
            const unlockedCount = subject.modules.filter((m) =>
              unlockedModuleIds.includes(m.id)
            ).length;
            const isFullSubjectUnlocked = unlockedCount === totalChapters;
            const demoModule =
              subject.modules.find((m) => m.isFreePreview) || subject.modules[0];

            return (
              <div
                key={subject.id}
                className={`rounded-2xl border p-5 flex flex-col justify-between gap-4 transition-colors ${
                  isFullSubjectUnlocked
                    ? 'bg-emerald-50/50 border-emerald-300'
                    : 'bg-white border-slate-200 hover:border-emerald-300'
                }`}
              >
                <div className="space-y-3">
                  {/* Top Badges */}
                  <div className="flex items-center justify-between gap-2">
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-100 text-slate-800 text-[11px] font-bold">
                      <BookOpen className="w-3.5 h-3.5 text-emerald-600" />
                      {subject.categoryLabel}
                    </span>

                    {isFullSubjectUnlocked ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-600 text-white text-[11px] font-bold">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        12 Months Unlocked
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-amber-50 border border-amber-200 text-amber-800 text-[11px] font-bold">
                        <Calendar className="w-3.5 h-3.5" />
                        12 Months Access
                      </span>
                    )}
                  </div>

                  {/* Subject Title & Instructor */}
                  <div>
                    <h4 className="text-lg font-bold text-slate-900">
                      {medium === 'hi' ? subject.subjectHindi : subject.subjectName}
                    </h4>
                    <p className="text-xs text-slate-500 mt-0.5">
                      {subject.instructor} • {totalChapters} Chapters • {subject.totalHours}h •{' '}
                      {subject.totalMcqs} MCQs
                    </p>
                  </div>

                  {/* Chapters Preview List */}
                  <div className="bg-slate-50 border border-slate-100 rounded-xl p-3 space-y-1.5">
                    {subject.modules.map((mod, idx) => {
                      const modUnlocked = unlockedModuleIds.includes(mod.id);
                      return (
                        <div
                          key={mod.id}
                          className="flex items-center justify-between text-xs gap-2"
                        >
                          <span className="text-slate-700 truncate font-medium">
                            {mod.title}
                          </span>
                          {mod.isFreePreview ? (
                            <span className="shrink-0 px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                              FREE DEMO
                            </span>
                          ) : modUnlocked ? (
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                          ) : (
                            <Lock className="w-3 h-3 text-slate-400 shrink-0" />
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Action Buttons: 1. Watch Free Demo Video | 2. Unlock Subject 12 Months | 3. Chapters */}
                <div className="space-y-2.5 pt-2 border-t border-slate-100">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-xs text-slate-500 block">
                        {medium === 'hi'
                          ? `${subject.subjectName} के सभी ${totalChapters} चैप्टर (12 Months)`
                          : `All ${totalChapters} Chapters • 12 Months Access`}
                      </span>
                      <div className="flex items-baseline gap-2">
                        <span className="text-xl font-bold text-slate-900 font-mono-tabular">
                          ₹{subject.fullPriceInr}
                        </span>
                        <span className="text-xs text-slate-400 line-through font-mono-tabular">
                          ₹{subject.originalPriceInr}
                        </span>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => onViewChapters(subject)}
                      className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
                    >
                      <Layers className="w-3.5 h-3.5" />
                      <span>{medium === 'hi' ? 'चैप्टर देखें' : 'Chapters'}</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => onWatchDemoVideo(subject, demoModule?.id)}
                      className="py-2.5 px-3 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-900 text-xs font-bold inline-flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <Play className="w-3.5 h-3.5 fill-emerald-600 text-emerald-600" />
                      <span>
                        {medium === 'hi' ? 'फ्री डेमो वीडियो देखें' : 'Watch Free Demo'}
                      </span>
                    </button>

                    {isFullSubjectUnlocked ? (
                      <button
                        type="button"
                        onClick={() => onWatchDemoVideo(subject, subject.modules[0]?.id)}
                        className="py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold inline-flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>
                          {medium === 'hi' ? 'पढ़ना शुरू करें (Unlocked)' : 'Start Learning'}
                        </span>
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() =>
                          onUnlockSubjectLifetime({
                            course: subject,
                            purchaseType: 'Full Course',
                            selectedModules: subject.modules,
                            finalAmountInr: subject.fullPriceInr,
                          })
                        }
                        className="py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold inline-flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                      >
                        <span>
                          {medium === 'hi'
                            ? `${subject.subjectName} अनलॉक करें (₹${subject.fullPriceInr})`
                            : `Unlock ${subject.subjectName} (₹${subject.fullPriceInr})`}
                        </span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
