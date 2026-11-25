import React, { useState, useEffect, useCallback } from 'react';
import {
  Play,
  Pause,
  SkipForward,
  RotateCcw,
  CheckCircle2,
  XCircle,
  Clock,
  BookOpen,
  Languages,
} from 'lucide-react';
import { McqSegment } from '../types/education';

export interface PurchasedK12SubjectInfo {
  courseId: string;
  k12Class: string;
  subjectName: string;
  subjectHindi: string;
  mcqTrackId: string;
}

interface McqSprintViewProps {
  segments: McqSegment[];
  initialTrackId?: string;
  purchasedK12Subjects?: PurchasedK12SubjectInfo[];
  medium: 'hi' | 'en';
  onMediumChange: (m: 'hi' | 'en') => void;
  onRecordAttempt: (attempt: {
    trackTitle: string;
    score: number;
    total: number;
    accuracyPct: number;
    avgTimeSec: number;
  }) => void;
}

type SegmentPhase = 'concept' | 'question' | 'summary';

export const McqSprintView: React.FC<McqSprintViewProps> = ({
  segments,
  initialTrackId,
  purchasedK12Subjects = [],
  medium: lang,
  onMediumChange: setLang,
  onRecordAttempt,
}) => {
  const uniqueTracks = Array.from(
    new Map(
      segments.map((s) => [
        s.trackId,
        lang === 'hi' ? s.hindi.trackTitle : s.trackTitle,
      ])
    ).entries()
  );

  const defaultTrack =
    initialTrackId && segments.some((s) => s.trackId === initialTrackId)
      ? initialTrackId
      : purchasedK12Subjects.length > 0 &&
        segments.some((s) => s.trackId === purchasedK12Subjects[0].mcqTrackId)
      ? purchasedK12Subjects[0].mcqTrackId
      : 'all';

  const [selectedTrackId, setSelectedTrackId] = useState<string>(defaultTrack);

  useEffect(() => {
    if (
      !initialTrackId &&
      purchasedK12Subjects.length > 0 &&
      selectedTrackId === 'all' &&
      segments.some((s) => s.trackId === purchasedK12Subjects[0].mcqTrackId)
    ) {
      setSelectedTrackId(purchasedK12Subjects[0].mcqTrackId);
    }
  }, [purchasedK12Subjects, initialTrackId, selectedTrackId, segments]);

  const activePurchasedSubject = purchasedK12Subjects.find(
    (s) => s.mcqTrackId === selectedTrackId
  );

  const activeSegments =
    selectedTrackId === 'all'
      ? segments
      : segments.filter((s) => s.trackId === selectedTrackId);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [phase, setPhase] = useState<SegmentPhase>('concept');
  const [autoAdvance, setAutoAdvance] = useState(true);
  const [isPaused, setIsPaused] = useState(false);

  const currentSegment = activeSegments[currentIndex] || activeSegments[0];
  const content = lang === 'hi' ? currentSegment.hindi : currentSegment;

  const [timeLeft, setTimeLeft] = useState(currentSegment.conceptDurationSec);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [totalTimeSpent, setTotalTimeSpent] = useState(0);
  const [hasRecordedSummary, setHasRecordedSummary] = useState(false);

  const resetSprint = useCallback(
    (trackId: string) => {
      const list =
        trackId === 'all' ? segments : segments.filter((s) => s.trackId === trackId);
      setSelectedTrackId(trackId);
      setCurrentIndex(0);
      setPhase('concept');
      setIsPaused(false);
      setSelectedOption(null);
      setScore(0);
      setTotalTimeSpent(0);
      setHasRecordedSummary(false);
      if (list[0]) {
        setTimeLeft(list[0].conceptDurationSec);
      }
    },
    [segments]
  );

  const advanceToNext = useCallback(() => {
    if (phase === 'concept') {
      setPhase('question');
      setTimeLeft(currentSegment.questionDurationSec);
      setSelectedOption(null);
      return;
    }

    if (phase === 'question') {
      if (currentIndex + 1 < activeSegments.length) {
        const nextIdx = currentIndex + 1;
        setCurrentIndex(nextIdx);
        setPhase('concept');
        setTimeLeft(activeSegments[nextIdx].conceptDurationSec);
        setSelectedOption(null);
      } else {
        setPhase('summary');
      }
    }
  }, [phase, currentIndex, activeSegments, currentSegment]);

  useEffect(() => {
    if (phase === 'summary' || isPaused) return;
    if (phase === 'question' && selectedOption !== null) {
      if (!autoAdvance) return;
      const t = setTimeout(() => {
        advanceToNext();
      }, 2200);
      return () => clearTimeout(t);
    }

    const interval = setInterval(() => {
      setTotalTimeSpent((prev) => prev + 1);
      setTimeLeft((prev) => {
        if (prev <= 1) {
          if (autoAdvance) {
            advanceToNext();
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [phase, isPaused, autoAdvance, selectedOption, advanceToNext]);

  useEffect(() => {
    if (phase === 'summary' && !hasRecordedSummary && activeSegments.length > 0) {
      setHasRecordedSummary(true);
      const trackLabel =
        selectedTrackId === 'all'
          ? lang === 'hi'
            ? 'हिंदी ऑटोमैटिक MCQ स्प्रिंट'
            : 'Mixed Multi-Exam Sprint'
          : lang === 'hi'
          ? activeSegments[0].hindi.trackTitle
          : activeSegments[0].trackTitle;
      const accuracyPct = Math.round((score / activeSegments.length) * 100);
      const avgTimeSec = Math.max(
        5,
        Math.round(totalTimeSpent / activeSegments.length)
      );
      onRecordAttempt({
        trackTitle: trackLabel,
        score,
        total: activeSegments.length,
        accuracyPct,
        avgTimeSec,
      });
    }
  }, [
    phase,
    hasRecordedSummary,
    activeSegments,
    selectedTrackId,
    score,
    totalTimeSpent,
    lang,
    onRecordAttempt,
  ]);

  const handleSelectOption = (idx: number) => {
    if (selectedOption !== null) return;
    setSelectedOption(idx);
    if (idx === currentSegment.correctIndex) {
      setScore((prev) => prev + 1);
    }
  };

  const maxDuration =
    phase === 'concept'
      ? currentSegment.conceptDurationSec
      : currentSegment.questionDurationSec;
  const progressPct = Math.max(0, Math.min(100, (timeLeft / maxDuration) * 100));

  return (
    <div className="space-y-6">
      {/* Personalized Purchased Subject Banner */}
      {purchasedK12Subjects.length > 0 && (
        <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-700">
              {lang === 'hi'
                ? 'आपके चुने हुए विषय के प्रश्न (Auto-Unlocked)'
                : 'Personalized for Your Purchased Subject'}
            </span>
            <p className="text-sm font-bold text-slate-900 mt-0.5">
              {activePurchasedSubject
                ? lang === 'hi'
                  ? `कक्षा ${activePurchasedSubject.k12Class} • ${activePurchasedSubject.subjectHindi} के प्रश्न दिखाए जा रहे हैं`
                  : `Showing Class ${activePurchasedSubject.k12Class} • ${activePurchasedSubject.subjectName} MCQs`
                : lang === 'hi'
                ? 'अपने अनलॉक किए गए विषय पर क्लिक करें:'
                : 'Tap your unlocked subject below:'}
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {purchasedK12Subjects.map((subj) => (
              <button
                key={subj.courseId}
                type="button"
                onClick={() => resetSprint(subj.mcqTrackId)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                  selectedTrackId === subj.mcqTrackId
                    ? 'bg-emerald-600 text-white'
                    : 'bg-white text-slate-800 border border-emerald-200 hover:border-emerald-500'
                }`}
              >
                Class {subj.k12Class} • {subj.subjectName}
              </button>
            ))}
            {selectedTrackId !== 'all' && (
              <button
                type="button"
                onClick={() => resetSprint('all')}
                className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-white text-slate-600 border border-slate-200 hover:text-slate-900 cursor-pointer"
              >
                {lang === 'hi' ? 'सभी विषय देखें' : 'All Tracks'}
              </button>
            )}
          </div>
        </div>
      )}

      {/* Header & Language / Auto Controls */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
            {activePurchasedSubject
              ? lang === 'hi'
                ? `कक्षा ${activePurchasedSubject.k12Class} ${activePurchasedSubject.subjectHindi} — ऑटोमैटिक MCQ`
                : `Class ${activePurchasedSubject.k12Class} ${activePurchasedSubject.subjectName} — Automatic MCQs`
              : lang === 'hi'
              ? 'ऑटोमैटिक हिंदी MCQ क्लास सेगमेंट'
              : 'Short MCQ Class-Type Automatic Segments'}
          </h1>
          <p className="text-sm text-slate-600 mt-1">
            {activePurchasedSubject
              ? lang === 'hi'
                ? `आपने कक्षा ${activePurchasedSubject.k12Class} (${activePurchasedSubject.subjectName}) चुना है — उसी के कॉन्सेप्ट और प्रश्न नीचे दिए गए हैं।`
                : `Tailored to your selected Class ${activePurchasedSubject.k12Class} ${activePurchasedSubject.subjectName} syllabus.`
              : lang === 'hi'
              ? 'प्रत्येक सेगमेंट में पहले संक्षिप्त कॉन्सेप्ट और फिर अपने-आप टाइमर वाला MCQ प्रश्न आता है।'
              : 'Each micro-class pairs a short Concept Byte with an automatic timed MCQ checkpoint.'}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => setLang(lang === 'hi' ? 'en' : 'hi')}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl transition-colors whitespace-nowrap cursor-pointer"
          >
            <Languages className="w-3.5 h-3.5" />
            <span>{lang === 'hi' ? 'भाषा: हिंदी (English)' : 'Language: English (हिंदी)'}</span>
          </button>

          <button
            type="button"
            onClick={() => setAutoAdvance((v) => !v)}
            className={`px-3.5 py-2 text-xs font-semibold rounded-xl border transition-colors whitespace-nowrap ${
              autoAdvance
                ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                : 'bg-white border-slate-200 text-slate-600'
            }`}
          >
            Auto-Segment: {autoAdvance ? 'ON' : 'OFF'}
          </button>

          {phase !== 'summary' && (
            <button
              type="button"
              onClick={() => setIsPaused((p) => !p)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold bg-white border border-slate-200 hover:border-slate-300 text-slate-800 rounded-xl transition-colors whitespace-nowrap"
            >
              {isPaused ? <Play className="w-3.5 h-3.5" /> : <Pause className="w-3.5 h-3.5" />}
              <span>{isPaused ? 'Resume' : 'Pause'}</span>
            </button>
          )}

          <button
            type="button"
            onClick={() => resetSprint(selectedTrackId)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold bg-white border border-slate-200 hover:border-slate-300 text-slate-700 rounded-xl transition-colors whitespace-nowrap"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Restart</span>
          </button>
        </div>
      </div>

      {/* Track Selector Segmented Bar */}
      <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-xl overflow-x-auto">
        <button
          type="button"
          onClick={() => resetSprint('all')}
          className={`px-3.5 py-2 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap shrink-0 ${
            selectedTrackId === 'all'
              ? 'bg-white text-slate-900 shadow-sm'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          {lang === 'hi' ? `सभी विषय (${segments.length})` : `All Tracks (${segments.length})`}
        </button>
        {uniqueTracks.map(([id, title]) => (
          <button
            key={id}
            type="button"
            onClick={() => resetSprint(id)}
            className={`px-3.5 py-2 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap shrink-0 ${
              selectedTrackId === id
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            {title}
          </button>
        ))}
      </div>

      {/* Main Stage */}
      {phase === 'summary' ? (
        <div className="bg-white border border-slate-200 rounded-2xl p-8 max-w-2xl mx-auto text-center space-y-6">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-slate-900">
              {lang === 'hi' ? 'MCQ स्प्रिंट सफलतापूर्वक पूर्ण!' : 'Segment Sprint Completed'}
            </h2>
            <p className="text-sm text-slate-600 mt-1">
              {lang === 'hi'
                ? 'आपका स्कोर और सटीकता (Accuracy) डैशबोर्ड में सेव हो गई है।'
                : 'Your performance has been saved to your Progress Tracking Dashboard.'}
            </p>
          </div>

          <div className="grid grid-cols-3 gap-4 pt-2">
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl">
              <p className="text-xs text-slate-500">{lang === 'hi' ? 'स्कोर' : 'Score'}</p>
              <p className="text-2xl font-bold text-slate-900 mt-1 font-mono-tabular">
                {score}/{activeSegments.length}
              </p>
            </div>
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl">
              <p className="text-xs text-slate-500">{lang === 'hi' ? 'सटीकता' : 'Accuracy'}</p>
              <p className="text-2xl font-bold text-emerald-600 mt-1 font-mono-tabular">
                {Math.round((score / activeSegments.length) * 100)}%
              </p>
            </div>
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl">
              <p className="text-xs text-slate-500">{lang === 'hi' ? 'औसत समय' : 'Avg Pace'}</p>
              <p className="text-2xl font-bold text-slate-900 mt-1 font-mono-tabular">
                {Math.max(5, Math.round(totalTimeSpent / activeSegments.length))}s
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => resetSprint(selectedTrackId)}
            className="px-6 py-3 text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl transition-colors"
          >
            {lang === 'hi' ? 'फिर से अभ्यास करें' : 'Practice Again'}
          </button>
        </div>
      ) : (
        <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
          {/* Top Segment Progress & Timer Bar */}
          <div className="px-6 py-4 bg-slate-50 border-b border-slate-200 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-700">
              <span className="text-emerald-700">{content.trackTitle}</span>
              <span aria-hidden="true">·</span>
              <span className="font-mono-tabular">
                {lang === 'hi'
                  ? `सेगमेंट ${currentIndex + 1} / ${activeSegments.length}`
                  : `Segment ${currentIndex + 1} of ${activeSegments.length}`}
              </span>
              <span aria-hidden="true">·</span>
              <span>
                {phase === 'concept'
                  ? lang === 'hi'
                    ? 'भाग A: कॉन्सेप्ट सारांश'
                    : 'Part A: Concept Byte'
                  : lang === 'hi'
                  ? 'भाग B: ऑटोमैटिक MCQ'
                  : 'Part B: Timed MCQ'}
              </span>
            </div>

            <div className="flex items-center gap-3">
              <span className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-900 font-mono-tabular">
                <Clock className="w-3.5 h-3.5 text-emerald-600" />
                {timeLeft}s
              </span>
              <button
                type="button"
                onClick={advanceToNext}
                className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 rounded-lg transition-colors"
              >
                <span>
                  {phase === 'concept'
                    ? lang === 'hi'
                      ? 'प्रश्न शुरू करें'
                      : 'Start Question'
                    : lang === 'hi'
                    ? 'अगला सेगमेंट'
                    : 'Next Segment'}
                </span>
                <SkipForward className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Smooth Timer Bar */}
          <div className="w-full h-1.5 bg-slate-100">
            <div
              className="h-full bg-emerald-600 transition-all duration-300"
              style={{ width: `${progressPct}%` }}
            />
          </div>

          {/* Segment Content */}
          <div className="p-6 sm:p-8">
            {phase === 'concept' ? (
              <div className="max-w-3xl space-y-6">
                <div className="inline-flex items-center gap-2 text-xs font-semibold text-emerald-700">
                  <BookOpen className="w-4 h-4" />
                  <span>
                    {lang === 'hi'
                      ? `कॉन्सेप्ट ब्रीफिंग (${timeLeft} सेकंड में अपने-आप MCQ शुरू होगा)`
                      : `Micro-Concept Briefing (Auto-advances to MCQ in ${timeLeft}s)`}
                  </span>
                </div>

                <h2 className="text-2xl font-bold text-slate-900">{content.conceptTitle}</h2>

                <p className="text-base text-slate-700 leading-relaxed">
                  {content.conceptSummary}
                </p>

                <div className="p-4 bg-emerald-50/50 border border-emerald-200 rounded-xl">
                  <p className="text-xs font-semibold text-emerald-800 mb-1">
                    {lang === 'hi' ? 'मुख्य सूत्र / परीक्षा नियम' : 'Key Formula / Exam Rule'}
                  </p>
                  <p className="text-sm sm:text-base font-semibold text-slate-900 font-mono-tabular">
                    {content.keyFormulaOrRule}
                  </p>
                </div>

                <div className="pt-2">
                  <button
                    type="button"
                    onClick={advanceToNext}
                    className="px-5 py-2.5 text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl transition-colors"
                  >
                    {lang === 'hi' ? 'तैयार हैं — MCQ प्रश्न शुरू करें' : 'Ready — Launch MCQ Checkpoint'}
                  </button>
                </div>
              </div>
            ) : (
              <div className="max-w-3xl space-y-6">
                <h2 className="text-lg sm:text-xl font-bold text-slate-900 leading-snug">
                  {content.question}
                </h2>

                <div className="space-y-3">
                  {content.options.map((opt, idx) => {
                    const isPicked = selectedOption === idx;
                    const isCorrect = idx === currentSegment.correctIndex;
                    const showResult = selectedOption !== null;

                    let btnStyle =
                      'bg-white border-slate-200 hover:border-emerald-500 text-slate-800';
                    if (showResult) {
                      if (isCorrect) {
                        btnStyle = 'bg-emerald-50 border-emerald-500 text-slate-900';
                      } else if (isPicked && !isCorrect) {
                        btnStyle = 'bg-red-50 border-red-400 text-slate-900';
                      } else {
                        btnStyle = 'bg-slate-50 border-slate-200 text-slate-500';
                      }
                    }

                    return (
                      <button
                        key={idx}
                        type="button"
                        disabled={showResult}
                        onClick={() => handleSelectOption(idx)}
                        className={`w-full p-4 rounded-xl border text-left flex items-start justify-between gap-4 transition-colors ${btnStyle}`}
                      >
                        <div className="flex items-start gap-3">
                          <span className="text-xs font-bold font-mono-tabular mt-0.5 text-slate-500">
                            {String.fromCharCode(65 + idx)}.
                          </span>
                          <span className="text-sm font-medium leading-relaxed">{opt}</span>
                        </div>

                        {showResult && isCorrect && (
                          <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 shrink-0">
                            <CheckCircle2 className="w-4 h-4" />
                            {lang === 'hi' ? 'सही' : 'Correct'}
                          </span>
                        )}
                        {showResult && isPicked && !isCorrect && (
                          <span className="inline-flex items-center gap-1 text-xs font-bold text-red-700 shrink-0">
                            <XCircle className="w-4 h-4" />
                            {lang === 'hi' ? 'गलत' : 'Incorrect'}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>

                {selectedOption !== null && (
                  <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                    <p className="text-xs font-bold text-slate-900">
                      {lang === 'hi' ? 'विस्तृत व्याख्या' : 'Concept Explanation'}
                    </p>
                    <p className="text-sm text-slate-700 leading-relaxed">
                      {content.explanation}
                    </p>
                    {autoAdvance && (
                      <p className="text-xs font-medium text-emerald-700">
                        {lang === 'hi'
                          ? 'अगले सेगमेंट पर अपने-आप जा रहे हैं...'
                          : 'Advancing to next segment automatically...'}
                      </p>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
