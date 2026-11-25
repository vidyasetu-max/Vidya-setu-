import React, { useState, useEffect, useCallback } from 'react';
import {
  ClipboardCheck,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Play,
  Award,
  ChevronRight,
  ChevronLeft,
  Flag,
  RotateCcw,
  Languages,
  Search,
  PenLine,
} from 'lucide-react';
import {
  OnlineTest,
  OnlineTestSubmission,
  StudyMedium,
  UserAccount,
} from '../types/education';

interface PurchasedK12SubjectInfo {
  courseId: string;
  k12Class: string;
  subjectName: string;
  subjectHindi: string;
  mcqTrackId: string;
}

interface OnlineTestsViewProps {
  onlineTests: OnlineTest[];
  testSubmissions: OnlineTestSubmission[];
  purchasedK12Subjects?: PurchasedK12SubjectInfo[];
  user: UserAccount | null;
  medium: StudyMedium;
  onToggleMedium: () => void;
  onSubmitTest: (
    submission: Omit<OnlineTestSubmission, 'id' | 'submittedAt'>
  ) => Promise<void>;
}

export const OnlineTestsView: React.FC<OnlineTestsViewProps> = ({
  onlineTests,
  testSubmissions,
  purchasedK12Subjects = [],
  user,
  medium,
  onToggleMedium,
  onSubmitTest,
}) => {
  const publishedTests = onlineTests.filter((t) => t.isPublished);
  const defaultCat =
    purchasedK12Subjects.length > 0 &&
    publishedTests.some((t) => t.category === purchasedK12Subjects[0].subjectName)
      ? purchasedK12Subjects[0].subjectName
      : 'ALL';
  const [selectedCategory, setSelectedCategory] = useState<string>(defaultCat);

  useEffect(() => {
    if (
      purchasedK12Subjects.length > 0 &&
      selectedCategory === 'ALL' &&
      publishedTests.some((t) => t.category === purchasedK12Subjects[0].subjectName)
    ) {
      setSelectedCategory(purchasedK12Subjects[0].subjectName);
    }
  }, [purchasedK12Subjects, selectedCategory, publishedTests]);

  const activePurchasedSubject = purchasedK12Subjects.find(
    (s) => s.subjectName === selectedCategory
  );
  const [activeTest, setActiveTest] = useState<OnlineTest | null>(null);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [longAnswers, setLongAnswers] = useState<Record<string, string>>({});
  const [markedForReview, setMarkedForReview] = useState<Record<number, boolean>>({});
  const [secondsLeft, setSecondsLeft] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [resultSummary, setResultSummary] = useState<{
    test: OnlineTest;
    answers: Record<number, number>;
    longAnswers: Record<string, string>;
    score: number;
    maxScore: number;
    correctCount: number;
    wrongCount: number;
    unansweredCount: number;
    accuracyPct: number;
    timeTakenSec: number;
  } | null>(null);

  const categories = ['ALL', ...Array.from(new Set(publishedTests.map((t) => t.category)))];
  const filteredTests = publishedTests.filter((t) => {
    const matchesCat = selectedCategory === 'ALL' || t.category === selectedCategory;
    const q = searchQuery.trim().toLowerCase();
    const matchesSearch =
      !q ||
      t.titleEn.toLowerCase().includes(q) ||
      t.titleHi.toLowerCase().includes(q) ||
      t.category.toLowerCase().includes(q);
    return matchesCat && matchesSearch;
  });

  const startTest = (test: OnlineTest) => {
    setActiveTest(test);
    setCurrentIdx(0);
    setAnswers({});
    setLongAnswers({});
    setMarkedForReview({});
    setSecondsLeft(test.durationMins * 60);
    setResultSummary(null);
  };

  const finishTest = useCallback(async () => {
    if (!activeTest) return;
    const totalQuestions = activeTest.questions.length;
    let correctCount = 0;
    let wrongCount = 0;
    let unansweredCount = 0;

    activeTest.questions.forEach((q, idx) => {
      const chosen = answers[idx];
      if (chosen === undefined) {
        unansweredCount += 1;
      } else if (chosen === q.correctIndex) {
        correctCount += 1;
      } else {
        wrongCount += 1;
      }
    });

    const rawScore =
      correctCount * activeTest.marksPerQuestion -
      wrongCount * activeTest.negativeMarking;
    const score = Math.round(rawScore * 100) / 100;
    const maxScore = totalQuestions * activeTest.marksPerQuestion;
    const attempted = correctCount + wrongCount;
    const accuracyPct = attempted > 0 ? Math.round((correctCount / attempted) * 100) : 0;
    const totalAllowedSec = activeTest.durationMins * 60;
    const timeTakenSec = Math.max(1, totalAllowedSec - secondsLeft);

    const summary = {
      test: activeTest,
      answers: { ...answers },
      longAnswers: { ...longAnswers },
      score,
      maxScore,
      correctCount,
      wrongCount,
      unansweredCount,
      accuracyPct,
      timeTakenSec,
    };

    setResultSummary(summary);
    setActiveTest(null);

    await onSubmitTest({
      testId: activeTest.id,
      testTitle: medium === 'hi' ? activeTest.titleHi : activeTest.titleEn,
      studentName: user?.name || 'Guest Student',
      studentIdentifier: user?.identifier || 'Guest',
      score,
      maxScore,
      correctCount,
      wrongCount,
      unansweredCount,
      accuracyPct,
      timeTakenSec,
      longAnswers: { ...longAnswers },
    });
  }, [activeTest, answers, longAnswers, secondsLeft, medium, user, onSubmitTest]);

  useEffect(() => {
    if (!activeTest) return;
    if (secondsLeft <= 0) {
      finishTest();
      return;
    }
    const timer = setInterval(() => {
      setSecondsLeft((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [activeTest, secondsLeft, finishTest]);

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  // 1. LIVE EXAM RUNNER VIEW
  if (activeTest) {
    const q = activeTest.questions[currentIdx];
    const totalQ = activeTest.questions.length;
    const questionText = medium === 'hi' ? q.questionHi || q.questionEn : q.questionEn;
    const optionsList = medium === 'hi' && q.optionsHi?.length ? q.optionsHi : q.optionsEn;

    return (
      <div className="space-y-5 pb-16">
        {/* Top Exam Bar */}
        <div className="bg-slate-900 text-white rounded-2xl p-4 sm:p-5 flex flex-wrap items-center justify-between gap-3">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-400">
              {activeTest.category} • LIVE ONLINE TEST
            </span>
            <h2 className="text-base sm:text-lg font-bold">
              {medium === 'hi' ? activeTest.titleHi : activeTest.titleEn}
            </h2>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={onToggleMedium}
              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-xs font-semibold rounded-xl inline-flex items-center gap-1.5 cursor-pointer"
            >
              <Languages className="w-3.5 h-3.5 text-emerald-400" />
              <span>{medium === 'hi' ? 'Hindi' : 'English'}</span>
            </button>

            <div
              className={`px-3.5 py-1.5 rounded-xl font-mono-tabular text-sm font-bold inline-flex items-center gap-1.5 ${
                secondsLeft <= 60 ? 'bg-red-600 text-white' : 'bg-emerald-600 text-white'
              }`}
            >
              <Clock className="w-4 h-4" />
              <span>{formatTime(secondsLeft)}</span>
            </div>

            <button
              type="button"
              onClick={finishTest}
              className="px-4 py-1.5 bg-white text-slate-900 hover:bg-slate-100 text-xs font-bold rounded-xl cursor-pointer"
            >
              Submit Test
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {/* Question Card */}
          <div className="lg:col-span-2 bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <span className="text-xs font-bold text-slate-500">
                Question {currentIdx + 1} of {totalQ}
              </span>
              <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg">
                +{activeTest.marksPerQuestion} Marks | -{activeTest.negativeMarking} Negative
              </span>
            </div>

            <p className="text-base sm:text-lg font-bold text-slate-900 leading-relaxed">
              {questionText}
            </p>

            <div className="space-y-2.5">
              {optionsList.map((opt, idx) => {
                const isSelected = answers[currentIdx] === idx;
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setAnswers((prev) => ({ ...prev, [currentIdx]: idx }))}
                    className={`w-full text-left p-3.5 rounded-xl border text-sm font-medium flex items-center gap-3 transition-colors cursor-pointer ${
                      isSelected
                        ? 'border-emerald-600 bg-emerald-50 text-emerald-950 font-semibold'
                        : 'border-slate-200 hover:border-slate-300 bg-white text-slate-800'
                    }`}
                  >
                    <span
                      className={`w-7 h-7 rounded-lg text-xs font-bold flex items-center justify-center shrink-0 ${
                        isSelected
                          ? 'bg-emerald-600 text-white'
                          : 'bg-slate-100 text-slate-700'
                      }`}
                    >
                      {String.fromCharCode(65 + idx)}
                    </span>
                    <span>{opt}</span>
                  </button>
                );
              })}
            </div>

            {/* Action Controls */}
            <div className="flex flex-wrap items-center justify-between gap-2 pt-3 border-t border-slate-100">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() =>
                    setAnswers((prev) => {
                      const next = { ...prev };
                      delete next[currentIdx];
                      return next;
                    })
                  }
                  className="px-3 py-2 text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl cursor-pointer"
                >
                  Clear
                </button>
                <button
                  type="button"
                  onClick={() =>
                    setMarkedForReview((prev) => ({
                      ...prev,
                      [currentIdx]: !prev[currentIdx],
                    }))
                  }
                  className={`px-3 py-2 text-xs font-semibold rounded-xl inline-flex items-center gap-1.5 cursor-pointer ${
                    markedForReview[currentIdx]
                      ? 'bg-amber-100 text-amber-800 border border-amber-300'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  <Flag className="w-3.5 h-3.5" />
                  <span>{markedForReview[currentIdx] ? 'Marked' : 'Mark Review'}</span>
                </button>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  disabled={currentIdx === 0}
                  onClick={() => setCurrentIdx((i) => Math.max(0, i - 1))}
                  className="px-3.5 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 disabled:opacity-40 rounded-xl inline-flex items-center gap-1 cursor-pointer"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Prev</span>
                </button>
                {currentIdx < totalQ - 1 ? (
                  <button
                    type="button"
                    onClick={() => setCurrentIdx((i) => Math.min(totalQ - 1, i + 1))}
                    className="px-4 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl inline-flex items-center gap-1 cursor-pointer"
                  >
                    <span>Save & Next</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={finishTest}
                    className="px-4 py-2 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-xl cursor-pointer"
                  >
                    Finish & Submit
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Question Palette */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-4 h-fit">
            <h3 className="text-sm font-bold text-slate-900">Question Palette</h3>
            <div className="grid grid-cols-5 gap-2">
              {activeTest.questions.map((_, idx) => {
                const isCurrent = idx === currentIdx;
                const isAnswered = answers[idx] !== undefined;
                const isMarked = markedForReview[idx];

                let btnClass = 'bg-slate-100 text-slate-700 border-slate-200';
                if (isMarked) btnClass = 'bg-amber-100 text-amber-900 border-amber-300';
                else if (isAnswered)
                  btnClass = 'bg-emerald-600 text-white border-emerald-600';

                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setCurrentIdx(idx)}
                    className={`h-9 rounded-xl text-xs font-bold border transition-all cursor-pointer ${btnClass} ${
                      isCurrent ? 'ring-2 ring-slate-900 ring-offset-1' : ''
                    }`}
                  >
                    {idx + 1}
                  </button>
                );
              })}
            </div>
            <div className="pt-3 border-t border-slate-100 space-y-1.5 text-[11px] text-slate-600">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded bg-emerald-600 inline-block" />
                <span>Answered ({Object.keys(answers).length})</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded bg-amber-200 border border-amber-400 inline-block" />
                <span>
                  Marked for Review ({Object.values(markedForReview).filter(Boolean).length})
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded bg-slate-200 inline-block" />
                <span>Unanswered ({totalQ - Object.keys(answers).length})</span>
              </div>
            </div>
          </div>
        </div>

        {/* Long Question Writing Space (Subjective / Descriptive Answers) */}
        {activeTest.longQuestions && activeTest.longQuestions.length > 0 && (
          <div className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 space-y-5">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <PenLine className="w-4 h-4 text-emerald-600" />
                <h3 className="text-base font-bold text-slate-900">
                  {medium === 'hi'
                    ? 'दीर्घ उत्तरीय प्रश्न लेखन स्थान (Long Question Writing Space)'
                    : 'Long Question Writing Space (Descriptive Answers)'}
                </h3>
              </div>
              <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg">
                {activeTest.longQuestions.length}{' '}
                {medium === 'hi' ? 'लिखित प्रश्न' : 'Long Questions'}
              </span>
            </div>

            <div className="space-y-5">
              {activeTest.longQuestions.map((lq, idx) => {
                const written = longAnswers[lq.id] || '';
                const wordCount = written.trim()
                  ? written.trim().split(/\s+/).length
                  : 0;
                return (
                  <div
                    key={lq.id}
                    className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3"
                  >
                    <div className="flex flex-wrap items-start justify-between gap-2">
                      <p className="text-sm font-bold text-slate-900 leading-relaxed">
                        Q{idx + 1}. {medium === 'hi' ? lq.questionHi : lq.questionEn}
                      </p>
                      <span className="text-[11px] font-bold text-slate-700 bg-white px-2.5 py-1 rounded-lg border border-slate-200 shrink-0">
                        {lq.maxMarks} Marks • {lq.wordLimit || 150} Words
                      </span>
                    </div>

                    <textarea
                      rows={5}
                      value={written}
                      onChange={(e) =>
                        setLongAnswers((prev) => ({
                          ...prev,
                          [lq.id]: e.target.value,
                        }))
                      }
                      placeholder={
                        medium === 'hi'
                          ? 'यहाँ अपना विस्तृत उत्तर लिखें...'
                          : 'Write your detailed long answer here...'
                      }
                      className="w-full p-3.5 text-sm bg-white border border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-emerald-600 leading-relaxed"
                    />

                    <div className="flex items-center justify-between text-[11px] text-slate-500">
                      <span className="font-mono-tabular">
                        Words: <strong>{wordCount}</strong> / {lq.wordLimit || 150}
                      </span>
                      {wordCount > 0 && (
                        <span className="text-emerald-700 font-semibold inline-flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          {medium === 'hi' ? 'उत्तर सेव हो रहा है' : 'Answer Draft Saved'}
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={finishTest}
                className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl inline-flex items-center gap-2 transition-colors cursor-pointer"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>
                  {medium === 'hi'
                    ? 'पूरा टेस्ट सबमिट करें (Submit Test)'
                    : 'Submit Complete Test'}
                </span>
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }

  // 2. RESULT & ANSWER KEY REVIEW VIEW
  if (resultSummary) {
    const {
      test,
      answers: submittedAns,
      score,
      maxScore,
      correctCount,
      wrongCount,
      unansweredCount,
      accuracyPct,
      timeTakenSec,
    } = resultSummary;

    return (
      <div className="space-y-6 pb-16">
        <div className="bg-slate-900 text-white rounded-2xl p-6 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-600 text-white text-xs font-bold">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>
                  {medium === 'hi'
                    ? 'TEST SUBMITTED SUCCESSFULLY • टेस्ट सबमिट हो गया'
                    : 'TEST SUBMITTED SUCCESSFULLY'}
                </span>
              </span>
              <h2 className="text-xl font-bold mt-2">
                {medium === 'hi' ? test.titleHi : test.titleEn}
              </h2>
            </div>
            <button
              type="button"
              onClick={() => setResultSummary(null)}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl inline-flex items-center gap-1.5 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>All Online Tests</span>
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 pt-2">
            <div className="bg-slate-800/90 rounded-xl p-3.5">
              <p className="text-[11px] text-slate-400">Total Score</p>
              <p className="text-xl font-bold text-emerald-400 font-mono-tabular">
                {score} / {maxScore}
              </p>
            </div>
            <div className="bg-slate-800/90 rounded-xl p-3.5">
              <p className="text-[11px] text-slate-400">Correct</p>
              <p className="text-xl font-bold text-white font-mono-tabular">{correctCount}</p>
            </div>
            <div className="bg-slate-800/90 rounded-xl p-3.5">
              <p className="text-[11px] text-slate-400">Wrong</p>
              <p className="text-xl font-bold text-rose-400 font-mono-tabular">{wrongCount}</p>
            </div>
            <div className="bg-slate-800/90 rounded-xl p-3.5">
              <p className="text-[11px] text-slate-400">Accuracy</p>
              <p className="text-xl font-bold text-amber-300 font-mono-tabular">{accuracyPct}%</p>
            </div>
            <div className="bg-slate-800/90 rounded-xl p-3.5">
              <p className="text-[11px] text-slate-400">Time Taken</p>
              <p className="text-xl font-bold text-white font-mono-tabular">
                {formatTime(timeTakenSec)}
              </p>
            </div>
          </div>
          {unansweredCount > 0 && (
            <p className="text-xs text-slate-300">
              Unanswered questions: {unansweredCount}
            </p>
          )}
        </div>

        {/* Detailed Answer Key */}
        <div className="space-y-4">
          <h3 className="text-base font-bold text-slate-900">
            Detailed Solutions & Answer Key
          </h3>
          {test.questions.map((q, idx) => {
            const chosen = submittedAns[idx];
            const isCorrect = chosen === q.correctIndex;
            const qText = medium === 'hi' ? q.questionHi || q.questionEn : q.questionEn;
            const opts = medium === 'hi' && q.optionsHi?.length ? q.optionsHi : q.optionsEn;
            const exp =
              medium === 'hi' ? q.explanationHi || q.explanationEn : q.explanationEn;

            return (
              <div
                key={q.id}
                className="bg-white border border-slate-200 rounded-2xl p-5 space-y-3"
              >
                <div className="flex items-start justify-between gap-2">
                  <p className="text-sm font-bold text-slate-900">
                    Q{idx + 1}. {qText}
                  </p>
                  {chosen === undefined ? (
                    <span className="px-2.5 py-0.5 text-[11px] font-bold bg-slate-100 text-slate-600 rounded-lg shrink-0">
                      Skipped
                    </span>
                  ) : isCorrect ? (
                    <span className="px-2.5 py-0.5 text-[11px] font-bold bg-emerald-100 text-emerald-800 rounded-lg inline-flex items-center gap-1 shrink-0">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Correct
                    </span>
                  ) : (
                    <span className="px-2.5 py-0.5 text-[11px] font-bold bg-rose-100 text-rose-800 rounded-lg inline-flex items-center gap-1 shrink-0">
                      <XCircle className="w-3.5 h-3.5" /> Wrong
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  {opts.map((opt, oIdx) => {
                    const isRightOpt = oIdx === q.correctIndex;
                    const isChosenWrong = chosen === oIdx && !isRightOpt;
                    return (
                      <div
                        key={oIdx}
                        className={`p-2.5 rounded-xl border ${
                          isRightOpt
                            ? 'bg-emerald-50 border-emerald-400 text-emerald-950 font-semibold'
                            : isChosenWrong
                            ? 'bg-rose-50 border-rose-300 text-rose-900'
                            : 'bg-slate-50 border-slate-200 text-slate-700'
                        }`}
                      >
                        {String.fromCharCode(65 + oIdx)}. {opt}
                      </div>
                    );
                  })}
                </div>

                {exp && (
                  <p className="text-xs text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-100">
                    <strong>Solution:</strong> {exp}
                  </p>
                )}
              </div>
            );
          })}
        </div>

        {/* Submitted Long Answers Review */}
        {test.longQuestions && test.longQuestions.length > 0 && (
          <div className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <PenLine className="w-4 h-4 text-emerald-600" />
                <span>
                  {medium === 'hi'
                    ? 'आपके सबमिट किए गए लिखित उत्तर (Submitted Long Answers)'
                    : 'Your Submitted Long Answers'}
                </span>
              </h3>
              <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg">
                Submitted ✓
              </span>
            </div>
            <div className="space-y-3">
              {test.longQuestions.map((lq, idx) => {
                const ansText = resultSummary.longAnswers[lq.id] || '';
                return (
                  <div
                    key={lq.id}
                    className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2"
                  >
                    <p className="text-xs font-bold text-slate-900">
                      Q{idx + 1}. {medium === 'hi' ? lq.questionHi : lq.questionEn} (
                      {lq.maxMarks} Marks)
                    </p>
                    <div className="p-3 bg-white border border-slate-200 rounded-lg text-xs text-slate-700 whitespace-pre-line">
                      {ansText.trim()
                        ? ansText
                        : medium === 'hi'
                        ? 'कोई लिखित उत्तर सबमिट नहीं किया गया।'
                        : 'No written answer submitted.'}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    );
  }

  // 3. ONLINE TEST LOBBY
  return (
    <div className="space-y-6 pb-12">
      <div className="bg-white border border-slate-200 rounded-2xl p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-emerald-700">
            <ClipboardCheck className="w-4 h-4" />
            <span>Online Exam & Mock Test Portal</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 mt-1">
            {activePurchasedSubject
              ? medium === 'hi'
                ? `कक्षा ${activePurchasedSubject.k12Class} • ${activePurchasedSubject.subjectHindi} — ऑनलाइन टेस्ट`
                : `Class ${activePurchasedSubject.k12Class} • ${activePurchasedSubject.subjectName} — Online Tests`
              : medium === 'hi'
              ? 'Live Online Tests & Mock Exams'
              : 'Live Online Tests & Mock Exams'}
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            {activePurchasedSubject
              ? medium === 'hi'
                ? `आपके चुने हुए विषय (${activePurchasedSubject.subjectName}) के टाइमर वाले टेस्ट नीचे दिए गए हैं।`
                : `Timed practice tests tailored for your purchased Class ${activePurchasedSubject.k12Class} ${activePurchasedSubject.subjectName} subject.`
              : medium === 'hi'
              ? 'Timer ke saath real exam practice karein — turant scorecard aur Hindi/English solutions paayein.'
              : 'Attempt timed online tests with instant scorecard, accuracy analysis, and bilingual solutions.'}
          </p>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center gap-3">
          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={
                medium === 'hi' ? 'टेस्ट या विषय खोजें...' : 'Search test or subject...'
              }
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-emerald-600"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-slate-900 text-white'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Available Tests Grid */}
      {filteredTests.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-2xl p-8 text-center space-y-2">
          <AlertCircle className="w-8 h-8 text-slate-400 mx-auto" />
          <p className="text-sm font-semibold text-slate-700">
            No online tests available in this category yet.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredTests.map((test) => {
            const isSubmitted = testSubmissions.some((s) => s.testId === test.id);
            return (
              <div
                key={test.id}
                className="bg-white border border-slate-200 rounded-2xl p-5 flex flex-col justify-between gap-4"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-1.5">
                      <span className="px-2.5 py-0.5 text-[11px] font-bold bg-emerald-50 text-emerald-700 rounded-lg">
                        {test.category}
                      </span>
                      {isSubmitted && (
                        <span className="px-2 py-0.5 text-[11px] font-bold bg-slate-900 text-emerald-400 rounded-lg inline-flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" />
                          Submitted ✓
                        </span>
                      )}
                    </div>
                    <span className="text-xs font-mono-tabular text-slate-500">
                      {test.questions.length} MCQs
                      {test.longQuestions && test.longQuestions.length > 0
                        ? ` + ${test.longQuestions.length} Long`
                        : ''}
                    </span>
                  </div>
                  <h2 className="text-base font-bold text-slate-900">
                    {medium === 'hi' ? test.titleHi : test.titleEn}
                  </h2>
                  <div className="flex flex-wrap items-center gap-3 text-xs text-slate-600 pt-1">
                    <span className="inline-flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-emerald-600" />
                      {test.durationMins} Mins
                    </span>
                    <span>• +{test.marksPerQuestion} Marks</span>
                    <span>• -{test.negativeMarking} Negative</span>
                  </div>
                </div>

                <button
                  type="button"
                  disabled={test.questions.length === 0}
                  onClick={() => startTest(test)}
                  className="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-300 text-white text-xs font-bold rounded-xl inline-flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <Play className="w-4 h-4" />
                <span>
                  {medium === 'hi' ? 'Online Test Shuru Karein' : 'Start Online Test'}
                </span>
              </button>
            </div>
            );
          })}
        </div>
      )}

      {/* Recent Test Submissions */}
      {testSubmissions.length > 0 && (
        <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-3">
          <div className="flex items-center gap-2">
            <Award className="w-4 h-4 text-emerald-600" />
            <h3 className="text-sm font-bold text-slate-900">Recent Test Results</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 text-slate-500">
                  <th className="py-2 pr-3 font-semibold">Test Name</th>
                  <th className="py-2 px-3 font-semibold">Score</th>
                  <th className="py-2 px-3 font-semibold">Accuracy</th>
                  <th className="py-2 pl-3 font-semibold">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {testSubmissions.slice(0, 8).map((sub) => (
                  <tr key={sub.id}>
                    <td className="py-2.5 pr-3 font-semibold text-slate-900">
                      {sub.testTitle}
                    </td>
                    <td className="py-2.5 px-3 font-mono-tabular font-bold text-emerald-700">
                      {sub.score} / {sub.maxScore}
                    </td>
                    <td className="py-2.5 px-3 font-mono-tabular text-slate-700">
                      {sub.accuracyPct}%
                    </td>
                    <td className="py-2.5 pl-3 text-slate-500">{sub.submittedAt}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
