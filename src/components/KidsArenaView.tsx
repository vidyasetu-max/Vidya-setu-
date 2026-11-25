import React, { useState } from 'react';
import {
  Star,
  Trophy,
  Flame,
  Lightbulb,
  CheckCircle2,
  XCircle,
  Scale,
  RotateCcw,
} from 'lucide-react';
import { KidsChallenge } from '../types/education';

interface KidsArenaViewProps {
  challenges: KidsChallenge[];
  kidsXp: number;
  kidsStars: number;
  kidsStreak: number;
  unlockedBadges: string[];
  onEarnXp: (params: { xpEarned: number; starsEarned: number; isCorrect: boolean }) => void;
}

const ALL_BADGES = [
  { name: 'Number Ninja', req: 'Starter Explorer Badge' },
  { name: 'Logic Astronaut', req: 'Reach 200 XP' },
  { name: 'Fraction Architect', req: 'Reach 300 XP' },
  { name: '3x Speed Streak', req: '3 Correct Answers in a Row' },
];

const SCALE_TARGETS = [9, 13, 17, 24];

export const KidsArenaView: React.FC<KidsArenaViewProps> = ({
  challenges,
  kidsXp,
  kidsStars,
  kidsStreak,
  unlockedBadges,
  onEarnXp,
}) => {
  const [activeTab, setActiveTab] = useState<'quest' | 'balance'>('quest');

  // Speed Quest State
  const [challengeIdx, setChallengeIdx] = useState(0);
  const [showHint, setShowHint] = useState(false);
  const [pickedOption, setPickedOption] = useState<number | null>(null);

  const currentChallenge = challenges[challengeIdx];

  const handleAnswerChallenge = (idx: number) => {
    if (pickedOption !== null) return;
    setPickedOption(idx);
    const isCorrect = idx === currentChallenge.correctIndex;
    onEarnXp({
      xpEarned: isCorrect ? currentChallenge.xpReward : 10,
      starsEarned: isCorrect ? 3 : 0,
      isCorrect,
    });
  };

  const handleNextChallenge = () => {
    setChallengeIdx((prev) => (prev + 1) % challenges.length);
    setShowHint(false);
    setPickedOption(null);
  };

  // Interactive Balance Scale Lab State
  const [targetIdx, setTargetIdx] = useState(0);
  const [rightWeights, setRightWeights] = useState<number[]>([5]);
  const [scaleSolved, setScaleSolved] = useState(false);

  const leftTarget = SCALE_TARGETS[targetIdx];
  const rightTotal = rightWeights.reduce((sum, w) => sum + w, 0);
  const diff = rightTotal - leftTarget;
  const tiltDeg = Math.max(-14, Math.min(14, diff * 1.6));
  const isBalanced = diff === 0;

  const addWeight = (w: number) => {
    if (scaleSolved) return;
    const next = [...rightWeights, w];
    setRightWeights(next);
    const nextSum = next.reduce((a, b) => a + b, 0);
    if (nextSum === leftTarget) {
      setScaleSolved(true);
      onEarnXp({ xpEarned: 45, starsEarned: 2, isCorrect: true });
    }
  };

  const removeLastWeight = () => {
    if (scaleSolved || rightWeights.length === 0) return;
    const next = rightWeights.slice(0, -1);
    setRightWeights(next);
    const nextSum = next.reduce((a, b) => a + b, 0);
    if (nextSum === leftTarget) {
      setScaleSolved(true);
      onEarnXp({ xpEarned: 45, starsEarned: 2, isCorrect: true });
    }
  };

  const nextScalePuzzle = () => {
    setTargetIdx((prev) => (prev + 1) % SCALE_TARGETS.length);
    setRightWeights([]);
    setScaleSolved(false);
  };

  const explorerLevel = Math.floor(kidsXp / 100) + 1;

  return (
    <div className="space-y-8">
      {/* Header & Kid Explorer Stats */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
            Future Kids Interactive Arena (Ages 6–14)
          </h1>
          <p className="text-sm text-slate-600 mt-1">
            Solve Vedic math quests, pattern riddles, and balance-scale puzzles to earn XP and
            Explorer Badges.
          </p>
        </div>

        {/* Mode Switcher */}
        <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg self-start">
          <button
            type="button"
            onClick={() => setActiveTab('quest')}
            className={`px-4 py-2 text-xs font-semibold rounded-md transition-colors whitespace-nowrap ${
              activeTab === 'quest'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Math &amp; Logic Quest
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('balance')}
            className={`px-4 py-2 text-xs font-semibold rounded-md transition-colors whitespace-nowrap ${
              activeTab === 'balance'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Balance Scale Lab
          </button>
        </div>
      </div>

      {/* 4-Column Gamification KPI Strip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200 rounded-xl p-5">
          <p className="text-xs font-medium text-slate-500">Explorer Rank</p>
          <p className="text-2xl font-bold text-indigo-700 mt-1 font-mono-tabular">
            Level {explorerLevel}
          </p>
          <p className="text-xs text-slate-600 mt-1">
            {100 - (kidsXp % 100)} XP to Level {explorerLevel + 1}
          </p>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-5">
          <p className="text-xs font-medium text-slate-500">Total Experience</p>
          <p className="text-2xl font-bold text-slate-900 mt-1 font-mono-tabular">
            {kidsXp} XP
          </p>
          <p className="text-xs text-slate-600 mt-1">Earned from quests &amp; labs</p>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-5">
          <p className="text-xs font-medium text-slate-500">Gold Stars</p>
          <p className="text-2xl font-bold text-amber-600 mt-1 font-mono-tabular flex items-center gap-1.5">
            <Star className="w-5 h-5 fill-amber-500 text-amber-500" />
            {kidsStars}
          </p>
          <p className="text-xs text-slate-600 mt-1">3 stars per solved quest</p>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-5">
          <p className="text-xs font-medium text-slate-500">Answer Streak</p>
          <p className="text-2xl font-bold text-slate-900 mt-1 font-mono-tabular flex items-center gap-1.5">
            <Flame className="w-5 h-5 text-amber-600" />
            {kidsStreak}x
          </p>
          <p className="text-xs text-slate-600 mt-1">Keep going for streak badge</p>
        </div>
      </div>

      {/* Main Interactive Stage + Badges */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <div className="lg:col-span-8 bg-white border border-slate-200 rounded-xl p-6 sm:p-8">
          {activeTab === 'quest' ? (
            <div className="space-y-6">
              <div className="flex items-center justify-between gap-4">
                <span className="text-xs font-semibold text-indigo-700 font-mono-tabular">
                  Quest {challengeIdx + 1} of {challenges.length} · +{currentChallenge.xpReward} XP
                </span>
                <button
                  type="button"
                  onClick={() => setShowHint((h) => !h)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-amber-800 bg-amber-50 hover:bg-amber-100 rounded-lg transition-colors"
                >
                  <Lightbulb className="w-3.5 h-3.5" />
                  <span>{showHint ? 'Hide Hint' : 'Show Visual Hint'}</span>
                </button>
              </div>

              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 leading-snug">
                {currentChallenge.prompt}
              </h2>

              {showHint && (
                <div className="p-4 bg-amber-50/70 border border-amber-200 rounded-xl text-sm text-amber-950">
                  <span className="font-bold">Trick: </span>
                  {currentChallenge.visualHint}
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {currentChallenge.options.map((opt, idx) => {
                  const isPicked = pickedOption === idx;
                  const isCorrect = idx === currentChallenge.correctIndex;
                  const showResult = pickedOption !== null;

                  let style =
                    'bg-white border-slate-200 hover:border-indigo-500 text-slate-900';
                  if (showResult) {
                    if (isCorrect) {
                      style = 'bg-emerald-50 border-emerald-500 text-slate-900';
                    } else if (isPicked && !isCorrect) {
                      style = 'bg-red-50 border-red-400 text-slate-900';
                    } else {
                      style = 'bg-slate-50 border-slate-200 text-slate-400';
                    }
                  }

                  return (
                    <button
                      key={idx}
                      type="button"
                      disabled={showResult}
                      onClick={() => handleAnswerChallenge(idx)}
                      className={`p-4 rounded-xl border text-left flex items-center justify-between gap-3 transition-colors ${style}`}
                    >
                      <span className="text-base font-bold font-mono-tabular">{opt}</span>
                      {showResult && isCorrect && (
                        <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                      )}
                      {showResult && isPicked && !isCorrect && (
                        <XCircle className="w-5 h-5 text-red-600 shrink-0" />
                      )}
                    </button>
                  );
                })}
              </div>

              {pickedOption !== null && (
                <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <p className="text-xs font-bold text-slate-900">
                      {pickedOption === currentChallenge.correctIndex
                        ? `Awesome! +${currentChallenge.xpReward} XP & +3 Stars earned`
                        : 'Good try! +10 XP for effort'}
                    </p>
                    <p className="text-xs text-slate-600 mt-1">
                      {currentChallenge.explanation}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={handleNextChallenge}
                    className="px-4 py-2 text-xs font-semibold text-white bg-indigo-700 hover:bg-indigo-800 rounded-lg transition-colors whitespace-nowrap shrink-0"
                  >
                    Next Quest
                  </button>
                </div>
              )}
            </div>
          ) : (
            /* Interactive Balance Scale Lab */
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-slate-900">
                    Equilibrium Balance Scale Lab
                  </h2>
                  <p className="text-xs text-slate-600 mt-1">
                    Add 1 kg, 2 kg, or 5 kg blocks to the Right Pan until both sides balance!
                  </p>
                </div>
                <span className="text-xs font-bold font-mono-tabular text-indigo-700">
                  Target: {leftTarget} kg
                </span>
              </div>

              {/* Visual Seesaw / Balance Beam */}
              <div className="p-6 bg-slate-50 border border-slate-200 rounded-xl flex flex-col items-center">
                <div className="w-full max-w-md py-6">
                  <div
                    className="w-full h-2.5 bg-slate-800 rounded-full relative transition-transform duration-300"
                    style={{ transform: `rotate(${tiltDeg}deg)` }}
                  >
                    {/* Left Pan */}
                    <div className="absolute -left-2 -top-14 w-28 p-2.5 bg-indigo-700 text-white rounded-lg text-center">
                      <p className="text-[11px] opacity-80">Left Pan</p>
                      <p className="text-base font-bold font-mono-tabular">{leftTarget} kg</p>
                    </div>

                    {/* Right Pan */}
                    <div
                      className={`absolute -right-2 -top-14 w-28 p-2.5 rounded-lg text-center border ${
                        isBalanced
                          ? 'bg-emerald-600 text-white border-emerald-700'
                          : 'bg-white text-slate-900 border-slate-300'
                      }`}
                    >
                      <p className="text-[11px] opacity-80">Right Pan</p>
                      <p className="text-base font-bold font-mono-tabular">{rightTotal} kg</p>
                    </div>
                  </div>
                  {/* Fulcrum Triangle */}
                  <div className="w-0 h-0 border-l-[14px] border-l-transparent border-r-[14px] border-r-transparent border-b-[22px] border-b-slate-700 mx-auto mt-1" />
                </div>

                {/* Status Readout */}
                <div className="mt-2 text-xs font-bold font-mono-tabular">
                  {isBalanced ? (
                    <span className="text-emerald-700 inline-flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4" />
                      BALANCED! ({leftTarget} kg = {rightTotal} kg) · +45 XP
                    </span>
                  ) : diff < 0 ? (
                    <span className="text-amber-700">
                      Right pan is {Math.abs(diff)} kg too light — add more blocks
                    </span>
                  ) : (
                    <span className="text-red-700">
                      Right pan is {diff} kg too heavy — remove a block
                    </span>
                  )}
                </div>
              </div>

              {/* Weight Controls */}
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex flex-wrap items-center gap-2">
                  {[1, 2, 5].map((w) => (
                    <button
                      key={w}
                      type="button"
                      disabled={scaleSolved}
                      onClick={() => addWeight(w)}
                      className="px-4 py-2 text-xs font-bold text-slate-900 bg-white border border-slate-200 hover:border-indigo-600 disabled:opacity-50 rounded-lg transition-colors font-mono-tabular"
                    >
                      + {w} kg Block
                    </button>
                  ))}
                  <button
                    type="button"
                    disabled={scaleSolved || rightWeights.length === 0}
                    onClick={removeLastWeight}
                    className="inline-flex items-center gap-1 px-3 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 disabled:opacity-40"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    Undo
                  </button>
                </div>

                {scaleSolved && (
                  <button
                    type="button"
                    onClick={nextScalePuzzle}
                    className="px-4 py-2 text-xs font-semibold text-white bg-indigo-700 hover:bg-indigo-800 rounded-lg transition-colors"
                  >
                    Next Balance Challenge
                  </button>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Explorer Badges */}
        <div className="lg:col-span-4 bg-white border border-slate-200 rounded-xl p-6 space-y-4">
          <div className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-amber-600" />
            <h3 className="text-base font-bold text-slate-900">Explorer Badges</h3>
          </div>

          <div className="space-y-3">
            {ALL_BADGES.map((badge) => {
              const unlocked = unlockedBadges.includes(badge.name);
              return (
                <div
                  key={badge.name}
                  className={`p-3.5 rounded-xl border flex items-center justify-between gap-3 ${
                    unlocked
                      ? 'bg-amber-50/50 border-amber-200'
                      : 'bg-slate-50 border-slate-200 opacity-70'
                  }`}
                >
                  <div>
                    <p className="text-sm font-bold text-slate-900">{badge.name}</p>
                    <p className="text-xs text-slate-500">{badge.req}</p>
                  </div>
                  <span
                    className={`text-xs font-semibold shrink-0 ${
                      unlocked ? 'text-emerald-700' : 'text-slate-400'
                    }`}
                  >
                    {unlocked ? 'Unlocked' : 'Locked'}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
