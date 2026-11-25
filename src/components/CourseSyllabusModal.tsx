import React, { useState } from 'react';
import { X, CheckCircle2, Lock, Clock, HelpCircle, Play } from 'lucide-react';
import { Course, CourseModule } from '../types/education';

interface CourseSyllabusModalProps {
  course: Course;
  unlockedModuleIds: string[];
  onClose: () => void;
  onProceedToCheckout: (params: {
    course: Course;
    purchaseType: 'Full Course' | 'Partial Modules';
    selectedModules: CourseModule[];
    finalAmountInr: number;
  }) => void;
  onLaunchMcqForCourse: (courseId: string) => void;
  onWatchLmsVideo: (course: Course, moduleId?: string) => void;
}

export const CourseSyllabusModal: React.FC<CourseSyllabusModalProps> = ({
  course,
  unlockedModuleIds,
  onClose,
  onProceedToCheckout,
  onLaunchMcqForCourse,
  onWatchLmsVideo,
}) => {
  const isModuleAccessible = (m: CourseModule) =>
    unlockedModuleIds.includes(m.id) || Boolean(m.isFreePreview);
  const lockedModules = course.modules.filter((m) => !isModuleAccessible(m));
  const [purchaseMode, setPurchaseMode] = useState<'partial' | 'full'>(
    lockedModules.length > 1 ? 'partial' : 'full'
  );
  const [selectedIds, setSelectedIds] = useState<string[]>(
    lockedModules.length > 0 ? [lockedModules[0].id] : []
  );

  const toggleModule = (modId: string) => {
    const targetMod = course.modules.find((m) => m.id === modId);
    if (!targetMod || isModuleAccessible(targetMod)) return;
    setPurchaseMode('partial');
    setSelectedIds((prev) =>
      prev.includes(modId) ? prev.filter((id) => id !== modId) : [...prev, modId]
    );
  };

  const selectedPartialModules = course.modules.filter((m) => selectedIds.includes(m.id));
  const rawPartialSum = selectedPartialModules.reduce((acc, m) => acc + m.priceInr, 0);
  // 15% bundle discount when buying 2 or more partial modules
  const partialBundleDiscount =
    selectedPartialModules.length >= 2 ? Math.round(rawPartialSum * 0.15) : 0;
  const finalPartialPrice = rawPartialSum - partialBundleDiscount;

  // If user already owns some modules, prorate full course price fairly
  const unlockedValue = course.modules
    .filter((m) => unlockedModuleIds.includes(m.id))
    .reduce((acc, m) => acc + m.priceInr, 0);
  const remainingFullPrice = Math.max(199, course.fullPriceInr - Math.round(unlockedValue * 0.5));

  const allUnlocked = lockedModules.length === 0;

  return (
    <div
      className="fixed inset-0 z-50 bg-slate-900/50 flex items-center justify-center p-4 overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-labelledby="syllabus-modal-title"
    >
      <div className="bg-white border border-slate-200 rounded-xl max-w-2xl w-full overflow-hidden my-8">
        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-200 flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold text-indigo-700">
              {course.categoryLabel} · {course.instructor}
            </p>
            <h2 id="syllabus-modal-title" className="text-xl font-bold text-slate-900 mt-1">
              {course.title}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close syllabus modal"
            className="p-2 text-slate-500 hover:text-slate-900 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
          {/* Purchase Mode Selector */}
          {!allUnlocked && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setPurchaseMode('partial')}
                className={`p-4 rounded-xl border text-left transition-colors ${
                  purchaseMode === 'partial'
                    ? 'border-indigo-700 bg-indigo-50/50'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-slate-900">Partial Module Purchase</span>
                  <span className="text-xs font-semibold text-indigo-700 font-mono-tabular">
                    15% off 2+
                  </span>
                </div>
                <p className="text-xs text-slate-600 mt-1">
                  Pick only the specific chapters you want to study right now.
                </p>
              </button>

              <button
                type="button"
                onClick={() => setPurchaseMode('full')}
                className={`p-4 rounded-xl border text-left transition-colors ${
                  purchaseMode === 'full'
                    ? 'border-indigo-700 bg-indigo-50/50'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-slate-900">
                    Full Subject / Course (12 Months Access)
                  </span>
                  <span className="text-sm font-bold text-indigo-700 font-mono-tabular">
                    ₹{remainingFullPrice}
                  </span>
                </div>
                <p className="text-xs text-slate-600 mt-1">
                  Unlock all {course.modules.length} chapters for 12 Months + {course.totalMcqs} MCQs + live doubts.
                </p>
              </button>
            </div>
          )}

          {/* Modules List */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900">
                Curriculum Modules ({course.modules.length} Chapters)
              </h3>
              <span className="text-xs text-slate-500">
                Click any locked chapter to include in partial purchase
              </span>
            </div>

            {course.modules.map((mod) => {
              const isUnlocked = isModuleAccessible(mod);
              const isSelected =
                purchaseMode === 'full' ? !isUnlocked : selectedIds.includes(mod.id);

              return (
                <div
                  key={mod.id}
                  onClick={() => !isUnlocked && toggleModule(mod.id)}
                  className={`p-4 rounded-xl border transition-colors ${
                    isUnlocked
                      ? 'bg-emerald-50/40 border-emerald-200'
                      : isSelected
                      ? 'bg-indigo-50/40 border-indigo-600 cursor-pointer'
                      : 'bg-white border-slate-200 hover:border-slate-300 cursor-pointer'
                  }`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-3">
                      {!isUnlocked && (
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => toggleModule(mod.id)}
                          onClick={(e) => e.stopPropagation()}
                          aria-label={`Select ${mod.title}`}
                          className="mt-1 h-4 w-4 accent-indigo-700 rounded cursor-pointer"
                        />
                      )}
                      <div>
                        <p className="text-sm font-bold text-slate-900">{mod.title}</p>
                        <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 mt-1 font-mono-tabular">
                          <span className="inline-flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5" />
                            {mod.durationMins} mins
                          </span>
                          <span aria-hidden="true">·</span>
                          <span className="inline-flex items-center gap-1">
                            <HelpCircle className="w-3.5 h-3.5" />
                            {mod.mcqCount} MCQs
                          </span>
                        </div>
                        <ul className="mt-2 space-y-1">
                          {mod.keyTopics.map((topic) => (
                            <li key={topic} className="text-xs text-slate-600">
                              • {topic}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      {isUnlocked ? (
                        <div className="space-y-2">
                          <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700">
                            <CheckCircle2 className="w-4 h-4" />
                            12 Months Access
                          </span>
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                onWatchLmsVideo(course, mod.id);
                              }}
                              className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-md transition-colors cursor-pointer"
                            >
                              <Play className="w-3 h-3" />
                              LMS Video
                            </button>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                onLaunchMcqForCourse(course.id);
                              }}
                              className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-md transition-colors cursor-pointer"
                            >
                              MCQ
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1.5 text-sm font-bold text-slate-900 font-mono-tabular">
                          <Lock className="w-3.5 h-3.5 text-slate-400" />
                          <span>₹{mod.priceInr}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer Checkout Bar */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          {allUnlocked ? (
            <>
              <div className="flex items-center gap-2 text-sm font-semibold text-emerald-700">
                <CheckCircle2 className="w-5 h-5" />
                <span>Full Course &amp; 12 Months LMS Video Access Active!</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => onWatchLmsVideo(course)}
                  className="px-4 py-2.5 text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition-colors whitespace-nowrap cursor-pointer"
                >
                  Open LMS Video
                </button>
                <button
                  type="button"
                  onClick={() => onLaunchMcqForCourse(course.id)}
                  className="px-4 py-2.5 text-sm font-semibold text-slate-800 bg-white border border-slate-200 hover:border-slate-300 rounded-lg transition-colors whitespace-nowrap cursor-pointer"
                >
                  MCQ Sprint
                </button>
              </div>
            </>
          ) : (
            <>
              <div>
                {purchaseMode === 'full' ? (
                  <div>
                    <div className="flex items-baseline gap-2">
                      <span className="text-lg font-bold text-slate-900 font-mono-tabular">
                        Total: ₹{remainingFullPrice}
                      </span>
                      <span className="text-xs text-slate-500">
                        ({lockedModules.length} remaining modules)
                      </span>
                    </div>
                  </div>
                ) : (
                  <div>
                    <div className="flex items-baseline gap-2">
                      <span className="text-lg font-bold text-slate-900 font-mono-tabular">
                        Total: ₹{finalPartialPrice}
                      </span>
                      {partialBundleDiscount > 0 && (
                        <span className="text-xs font-semibold text-emerald-700 font-mono-tabular">
                          Saved ₹{partialBundleDiscount} (15% bundle)
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-500">
                      {selectedPartialModules.length} module(s) selected
                    </p>
                  </div>
                )}
              </div>

              <button
                type="button"
                disabled={purchaseMode === 'partial' && selectedPartialModules.length === 0}
                onClick={() => {
                  const mods =
                    purchaseMode === 'full' ? lockedModules : selectedPartialModules;
                  const amt =
                    purchaseMode === 'full' ? remainingFullPrice : finalPartialPrice;
                  onProceedToCheckout({
                    course,
                    purchaseType: purchaseMode === 'full' ? 'Full Course' : 'Partial Modules',
                    selectedModules: mods,
                    finalAmountInr: amt,
                  });
                }}
                className="px-5 py-2.5 text-sm font-semibold text-white bg-indigo-700 hover:bg-indigo-800 disabled:bg-slate-300 disabled:cursor-not-allowed rounded-lg transition-colors whitespace-nowrap shrink-0"
              >
                Proceed to Payment
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
