import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  Lock,
  ShieldAlert,
  CheckCircle2,
  FileText,
  Calendar,
  Users,
  Unlock,
  Activity,
  ArrowLeft,
  Download,
  RotateCw,
  Maximize2,
  Minimize2,
  Smartphone,
} from 'lucide-react';
import { Course, CourseModule, StudyMedium } from '../types/education';
import { sortAndNumberModulesSymmetrically } from '../utils/moduleSequence';

interface LmsVideoPlayerModalProps {
  course: Course;
  unlockedModuleIds: string[];
  initialModuleId?: string;
  medium: StudyMedium;
  onClose: () => void;
  onUnlockMoreModules: () => void;
}

interface ScaleBenchmarkResult {
  simulatedConcurrentStudents: number;
  cacheLookupTimeMs: number;
  eventLoopLagMs: number;
  heapUsedMb: number;
  cdnEdgeCacheHitPct: number;
  streamingProtocol: string;
  status: string;
}

export const LmsVideoPlayerModal: React.FC<LmsVideoPlayerModalProps> = ({
  course,
  unlockedModuleIds,
  initialModuleId,
  medium,
  onClose,
  onUnlockMoreModules,
}) => {
  const unlockedModules = course.modules.filter(
    (m) => unlockedModuleIds.includes(m.id) || Boolean(m.isFreePreview)
  );
  const [activeModule, setActiveModule] = useState<CourseModule>(
    unlockedModules.find((m) => m.id === initialModuleId) ||
      unlockedModules[0] ||
      course.modules[0]
  );

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const playerStageRef = useRef<HTMLDivElement | null>(null);
  const [videoSrc, setVideoSrc] = useState<string>('/api/demo-video');
  const [videoEnded, setVideoEnded] = useState<boolean>(false);
  const [playbackSpeed, setPlaybackSpeed] = useState<1 | 1.25 | 1.5 | 2>(1);
  const [activeTab, setActiveTab] = useState<'video' | 'notes'>('video');

  // 16:8 / 16:9 Aspect Ratio, Fit/Fill & Video Rotate System
  const [aspectRatio, setAspectRatio] = useState<'16:8' | '16:9'>('16:8');
  const [videoFit, setVideoFit] = useState<'contain' | 'cover'>('contain');
  const [videoAngle, setVideoAngle] = useState<0 | 90 | 180 | 270>(0);
  const [isLandscapeRotated, setIsLandscapeRotated] = useState<boolean>(false);
  const [isPortraitViewport, setIsPortraitViewport] = useState<boolean>(() =>
    typeof window !== 'undefined' ? window.innerHeight > window.innerWidth : false
  );

  // Concurrent Viewer Limit (> 2 people -> 2 minute [120s] countdown -> Screen Lock)
  const [activeViewers, setActiveViewers] = useState<number>(1);
  const [lockCountdownSec, setLockCountdownSec] = useState<number>(120);
  const [isScreenLocked, setIsScreenLocked] = useState<boolean>(false);

  // 1 Lakh (100,000) Concurrent Students Load Test State
  const [isBenchmarking, setIsBenchmarking] = useState(false);
  const [benchmarkResult, setBenchmarkResult] = useState<ScaleBenchmarkResult | null>(null);

  useEffect(() => {
    setVideoEnded(false);
    if (activeModule.videoUrl) {
      setVideoSrc(activeModule.videoUrl);
    } else {
      setVideoSrc('/api/demo-video');
    }
  }, [activeModule]);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.playbackRate = playbackSpeed;
    }
  }, [playbackSpeed, videoSrc]);

  useEffect(() => {
    const updateOrientation = () => {
      setIsPortraitViewport(window.innerHeight > window.innerWidth);
    };
    updateOrientation();
    window.addEventListener('resize', updateOrientation);
    window.addEventListener('orientationchange', updateOrientation);
    return () => {
      window.removeEventListener('resize', updateOrientation);
      window.removeEventListener('orientationchange', updateOrientation);
    };
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isLandscapeRotated) {
        setIsLandscapeRotated(false);
        if (document.fullscreenElement) {
          document.exitFullscreen().catch(() => {});
        }
        try {
          (screen.orientation as { unlock?: () => void })?.unlock?.();
        } catch {}
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isLandscapeRotated]);

  const toggleLandscapeRotate = async () => {
    const next = !isLandscapeRotated;
    setIsLandscapeRotated(next);
    if (next) {
      try {
        if (playerStageRef.current?.requestFullscreen && !document.fullscreenElement) {
          await playerStageRef.current.requestFullscreen();
        }
      } catch {
        // CSS rotated theater fallback works cleanly inside iframes
      }
      try {
        const orientation = screen.orientation as {
          lock?: (mode: string) => Promise<void>;
        };
        await orientation?.lock?.('landscape');
      } catch {
        // Portrait fallback CSS rotate-90 handles mobile orientation automatically
      }
      if (videoRef.current && videoRef.current.paused) {
        videoRef.current.play().catch(() => {});
      }
    } else {
      try {
        if (document.fullscreenElement) {
          await document.exitFullscreen();
        }
      } catch {}
      try {
        (screen.orientation as { unlock?: () => void })?.unlock?.();
      } catch {}
    }
  };

  const cycleVideoAngle = () => {
    setVideoAngle((prev) => ((prev + 90) % 360) as 0 | 90 | 180 | 270);
  };

  const skipSeconds = (delta: number) => {
    if (!videoRef.current) return;
    const nextTime = Math.max(
      0,
      Math.min(
        videoRef.current.duration || Infinity,
        videoRef.current.currentTime + delta
      )
    );
    videoRef.current.currentTime = nextTime;
  };

  // 2-Minute (120s) Screen Lock Countdown when > 2 people watch simultaneously
  useEffect(() => {
    if (activeViewers <= 2) {
      setLockCountdownSec(120);
      return;
    }
    if (isScreenLocked) return;

    const timer = setInterval(() => {
      setLockCountdownSec((prev) => {
        if (prev <= 1) {
          setIsScreenLocked(true);
          if (videoRef.current) {
            videoRef.current.pause();
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [activeViewers, isScreenLocked]);

  const handleDisconnectOthersAndUnlock = () => {
    setActiveViewers(1);
    setLockCountdownSec(120);
    setIsScreenLocked(false);
    if (videoRef.current) {
      videoRef.current.play().catch(() => {});
    }
  };

  const handleRun100kBenchmark = async () => {
    setIsBenchmarking(true);
    try {
      const res = await fetch('/api/scale-benchmark', { method: 'POST' });
      if (res.ok) {
        const data = await res.json();
        setBenchmarkResult(data);
      }
    } catch {
      // Fallback
    }
    setIsBenchmarking(false);
  };

  const formatTimer = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  const isModuleUnlocked =
    unlockedModuleIds.includes(activeModule.id) ||
    Boolean(activeModule.isFreePreview);

  return (
    <div
      onContextMenu={(e) => e.preventDefault()}
      className="fixed inset-0 z-50 bg-slate-950/80 flex items-center justify-center p-2 sm:p-4 overflow-y-auto select-none"
      role="dialog"
      aria-modal="true"
      aria-labelledby="lms-player-title"
    >
      <div className="bg-white border border-slate-200 rounded-2xl max-w-5xl w-full overflow-hidden my-4">
        {/* Top LMS Header with Back Button */}
        <div className="px-5 py-4 bg-slate-900 text-white flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <button
              type="button"
              onClick={onClose}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-white shrink-0 transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4 text-emerald-400" />
              <span>{medium === 'hi' ? 'वापस जाएं' : 'Back'}</span>
            </button>
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2 text-xs text-emerald-400 font-semibold">
                <span className="inline-flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  <span>12 Months Access · Full Course LMS</span>
                </span>
                <span aria-hidden="true">·</span>
                <span className="text-slate-300 hidden sm:inline">
                  HTTP 206 Range Streaming (No Download / No Share)
                </span>
              </div>
              <h2
                id="lms-player-title"
                className="text-base sm:text-lg font-bold text-white truncate mt-0.5"
              >
                {course.title}
              </h2>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close LMS Video Player"
            className="p-2 text-slate-300 hover:text-white rounded-lg hover:bg-slate-800 transition-colors shrink-0 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Concurrent Viewer Security Bar (>2 Viewers = 2-Min Auto Screen Lock) */}
        <div
          className={`px-5 py-2.5 border-b flex flex-wrap items-center justify-between gap-3 text-xs ${
            activeViewers > 2
              ? 'bg-red-50 border-red-200 text-red-900'
              : 'bg-slate-50 border-slate-200 text-slate-700'
          }`}
        >
          <div className="flex items-center gap-2 font-semibold">
            <Users className="w-4 h-4 shrink-0 text-emerald-700" />
            <span className="font-mono-tabular">
              Active Viewers: {activeViewers} / 2 Allowed
            </span>
            {activeViewers > 2 && !isScreenLocked && (
              <span className="text-red-700 font-bold font-mono-tabular">
                — 2 se jada log dekh rahe hain! Screen {formatTimer(lockCountdownSec)} me lock
                ho jayegi
              </span>
            )}
          </div>

          {/* Viewer Count Test Controls */}
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-[11px] text-slate-500 mr-1">Test Viewers:</span>
            {[1, 2, 3].map((count) => (
              <button
                key={count}
                type="button"
                onClick={() => {
                  setActiveViewers(count);
                  if (count <= 2) {
                    setIsScreenLocked(false);
                    setLockCountdownSec(120);
                  }
                }}
                className={`px-2.5 py-1 rounded-md font-mono-tabular font-semibold transition-colors cursor-pointer ${
                  activeViewers === count
                    ? count > 2
                      ? 'bg-red-600 text-white'
                      : 'bg-emerald-600 text-white'
                    : 'bg-white border border-slate-200 text-slate-700 hover:border-slate-300'
                }`}
              >
                {count === 3 ? '3+ Viewers' : `${count} Viewer`}
              </button>
            ))}
            {activeViewers > 2 && !isScreenLocked && (
              <button
                type="button"
                onClick={() => {
                  setLockCountdownSec(0);
                  setIsScreenLocked(true);
                  if (videoRef.current) videoRef.current.pause();
                }}
                className="px-2.5 py-1 rounded-md bg-red-700 text-white font-semibold cursor-pointer"
              >
                Lock Now (Demo)
              </button>
            )}
          </div>
        </div>

        {/* Main LMS Body: Left Video/Notes Stage + Right Chapter Playlist */}
        <div className="grid grid-cols-1 lg:grid-cols-12">
          {/* Left 8 Columns: Real Playable Protected Video + Upload Demo + 1 Lakh Scale Test */}
          <div className="lg:col-span-8 p-5 sm:p-6 space-y-4 border-b lg:border-b-0 lg:border-r border-slate-200">
            {/* Mode Switch + 16:8 Ratio + Rotate + Speed */}
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-xl">
                <button
                  type="button"
                  onClick={() => setActiveTab('video')}
                  className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                    activeTab === 'video'
                      ? 'bg-white text-slate-900 shadow-sm'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  LMS Video Class
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('notes')}
                  className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                    activeTab === 'notes'
                      ? 'bg-white text-slate-900 shadow-sm'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Protected Notes (View Only)
                </button>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                {/* 16:8 vs 16:9 Aspect Ratio Toggle */}
                {activeTab === 'video' && (
                  <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg">
                    {(['16:8', '16:9'] as const).map((ratio) => (
                      <button
                        key={ratio}
                        type="button"
                        onClick={() => setAspectRatio(ratio)}
                        title={`Switch video screen to ${ratio}`}
                        className={`px-2 py-0.5 text-[11px] font-mono-tabular rounded cursor-pointer whitespace-nowrap ${
                          aspectRatio === ratio
                            ? 'bg-slate-900 text-white font-bold'
                            : 'text-slate-600 hover:text-slate-900'
                        }`}
                      >
                        {ratio}
                      </button>
                    ))}
                  </div>
                )}

                {/* Playback Speed */}
                <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg">
                  {([1, 1.25, 1.5, 2] as const).map((spd) => (
                    <button
                      key={spd}
                      type="button"
                      onClick={() => setPlaybackSpeed(spd)}
                      className={`px-2 py-0.5 text-[11px] font-mono-tabular rounded cursor-pointer ${
                        playbackSpeed === spd
                          ? 'bg-emerald-600 text-white font-bold'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      {spd}x
                    </button>
                  ))}
                </div>

                {/* Video Fit / Fill + Angle + Landscape Rotate */}
                {activeTab === 'video' && (
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() =>
                        setVideoFit((prev) =>
                          prev === 'contain' ? 'cover' : 'contain'
                        )
                      }
                      title="Toggle Video Fit or Wide Fill"
                      className="px-2.5 py-1 text-[11px] font-semibold bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg cursor-pointer whitespace-nowrap"
                    >
                      {videoFit === 'contain' ? 'Fit' : 'Fill'}
                    </button>
                    <button
                      type="button"
                      onClick={cycleVideoAngle}
                      title="Rotate video canvas 90°"
                      className={`inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-semibold rounded-lg cursor-pointer whitespace-nowrap transition-colors ${
                        videoAngle !== 0
                          ? 'bg-indigo-600 text-white'
                          : 'bg-slate-100 hover:bg-slate-200 text-slate-800'
                      }`}
                    >
                      <RotateCw className="w-3 h-3" />
                      <span className="font-mono-tabular">{videoAngle}°</span>
                    </button>
                    <button
                      type="button"
                      onClick={toggleLandscapeRotate}
                      title="Rotate & Play in Landscape Widescreen"
                      className="inline-flex items-center gap-1.5 px-3 py-1 text-[11px] font-bold bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors cursor-pointer whitespace-nowrap"
                    >
                      <Smartphone className="w-3.5 h-3.5 rotate-90" />
                      <span>
                        {medium === 'hi' ? 'Rotate & Play' : 'Rotate Play'}
                      </span>
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Screen Lock Overlay OR Active Protected Video Player */}
            {isScreenLocked ? (
              <div className="aspect-video w-full bg-slate-950 text-white rounded-2xl p-6 sm:p-8 flex flex-col items-center justify-center text-center space-y-4">
                <div className="w-14 h-14 rounded-2xl bg-red-500/20 text-red-400 flex items-center justify-center">
                  <ShieldAlert className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold">
                  {medium === 'hi'
                    ? 'Screen Locked — 2 se jada log video dekh rahe hain!'
                    : 'Screen Locked — Maximum 2 Concurrent Viewers Exceeded'}
                </h3>
                <p className="text-xs sm:text-sm text-slate-300 max-w-md leading-relaxed">
                  {medium === 'hi'
                    ? 'Ek account par ek saath sirf 2 log hi video dekh sakte hain. 2 minute ke baad security ke liye screen lock ho gayi hai.'
                    : 'Only 2 simultaneous viewers are permitted per account. Your screen was automatically locked after 2 minutes.'}
                </p>
                <button
                  type="button"
                  onClick={handleDisconnectOthersAndUnlock}
                  className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl transition-colors cursor-pointer"
                >
                  <Unlock className="w-4 h-4" />
                  <span>
                    {medium === 'hi'
                      ? 'Other Devices Hatayein & Unlock Karein'
                      : 'Disconnect Other Devices & Unlock'}
                  </span>
                </button>
              </div>
            ) : !isModuleUnlocked ? (
              <div className="aspect-video w-full bg-slate-100 border border-slate-200 rounded-2xl p-6 flex flex-col items-center justify-center text-center space-y-3">
                <Lock className="w-10 h-10 text-slate-400" />
                <h3 className="text-base font-bold text-slate-900">
                  This Chapter is Currently Locked
                </h3>
                <p className="text-xs text-slate-600 max-w-sm">
                  Unlock this individual chapter or the full course for 12 months LMS video access.
                </p>
                <button
                  type="button"
                  onClick={onUnlockMoreModules}
                  className="px-4 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl transition-colors cursor-pointer"
                >
                  Unlock Chapter Now
                </button>
              </div>
            ) : activeTab === 'video' ? (
              /* Real HTML5 <video> Player with HTTP 206 Streaming, 16:8 Aspect & Rotate Mode */
              <div className="space-y-3">
                <div
                  ref={playerStageRef}
                  className={
                    isLandscapeRotated
                      ? 'fixed inset-0 z-[70] bg-black flex items-center justify-center overflow-hidden'
                      : 'w-full'
                  }
                >
                  <div
                    className={
                      isLandscapeRotated
                        ? isPortraitViewport
                          ? 'w-[100vh] h-[100vw] rotate-90 origin-center shrink-0 bg-black relative flex flex-col items-center justify-center p-2 gap-1.5'
                          : 'w-full h-full bg-black relative flex flex-col items-center justify-center p-3 sm:p-6 gap-2.5'
                        : 'w-full'
                    }
                  >
                    {/* Rotated Landscape Control HUD */}
                    {isLandscapeRotated && (
                      <div className="w-full max-w-6xl bg-slate-900/95 border border-slate-800 text-white rounded-xl px-3 py-1.5 flex flex-wrap items-center justify-between gap-2 text-[11px] shrink-0">
                        <div className="flex items-center gap-2 min-w-0">
                          <span className="px-2 py-0.5 rounded bg-emerald-600 text-white font-bold font-mono-tabular shrink-0">
                            {aspectRatio}
                          </span>
                          <span className="font-semibold truncate max-w-[180px] sm:max-w-xs">
                            {activeModule.title}
                          </span>
                        </div>

                        <div className="flex flex-wrap items-center gap-1.5">
                          <div className="flex items-center gap-0.5 bg-slate-800 p-0.5 rounded-lg">
                            {(['16:8', '16:9'] as const).map((ratio) => (
                              <button
                                key={ratio}
                                type="button"
                                onClick={() => setAspectRatio(ratio)}
                                className={`px-2 py-0.5 rounded font-mono-tabular cursor-pointer ${
                                  aspectRatio === ratio
                                    ? 'bg-emerald-600 text-white font-bold'
                                    : 'text-slate-300 hover:text-white'
                                }`}
                              >
                                {ratio}
                              </button>
                            ))}
                          </div>

                          <button
                            type="button"
                            onClick={() => skipSeconds(-10)}
                            className="px-2 py-1 bg-slate-800 hover:bg-slate-700 rounded-lg font-mono-tabular cursor-pointer"
                          >
                            -10s
                          </button>
                          <button
                            type="button"
                            onClick={() => skipSeconds(10)}
                            className="px-2 py-1 bg-slate-800 hover:bg-slate-700 rounded-lg font-mono-tabular cursor-pointer"
                          >
                            +10s
                          </button>

                          <button
                            type="button"
                            onClick={() =>
                              setVideoFit((prev) =>
                                prev === 'contain' ? 'cover' : 'contain'
                              )
                            }
                            className="px-2 py-1 bg-slate-800 hover:bg-slate-700 rounded-lg font-semibold cursor-pointer"
                          >
                            {videoFit === 'contain' ? 'Fit' : 'Fill'}
                          </button>

                          <button
                            type="button"
                            onClick={cycleVideoAngle}
                            className="inline-flex items-center gap-1 px-2 py-1 bg-slate-800 hover:bg-slate-700 rounded-lg font-mono-tabular cursor-pointer"
                          >
                            <RotateCw className="w-3 h-3 text-emerald-400" />
                            <span>{videoAngle}°</span>
                          </button>

                          <div className="flex items-center gap-0.5 bg-slate-800 p-0.5 rounded-lg">
                            {([1, 1.25, 1.5, 2] as const).map((spd) => (
                              <button
                                key={spd}
                                type="button"
                                onClick={() => setPlaybackSpeed(spd)}
                                className={`px-1.5 py-0.5 rounded font-mono-tabular cursor-pointer ${
                                  playbackSpeed === spd
                                    ? 'bg-emerald-600 text-white font-bold'
                                    : 'text-slate-300 hover:text-white'
                                }`}
                              >
                                {spd}x
                              </button>
                            ))}
                          </div>

                          <button
                            type="button"
                            onClick={toggleLandscapeRotate}
                            className="inline-flex items-center gap-1 px-2.5 py-1 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-lg cursor-pointer whitespace-nowrap"
                          >
                            <Minimize2 className="w-3.5 h-3.5" />
                            <span>{medium === 'hi' ? 'बाहर आएं' : 'Exit Rotate'}</span>
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Video Viewport Container (supports 16:8 and 16:9 + angle rotation) */}
                    <div
                      className={`bg-slate-950 relative overflow-hidden flex items-center justify-center ${
                        isLandscapeRotated
                          ? `${
                              isPortraitViewport
                                ? 'h-[calc(100%-3.25rem)] max-w-full'
                                : 'w-full max-w-6xl max-h-[calc(100%-3.5rem)]'
                            } rounded-xl mx-auto ${
                              aspectRatio === '16:8'
                                ? 'aspect-[16/8]'
                                : 'aspect-video'
                            }`
                          : `w-full rounded-2xl ${
                              aspectRatio === '16:8'
                                ? 'aspect-[16/8]'
                                : 'aspect-video'
                            }`
                      }`}
                    >
                      <video
                        ref={videoRef}
                        src={videoSrc}
                        controls
                        autoPlay
                        playsInline
                        onEnded={() => setVideoEnded(true)}
                        controlsList="nodownload noplaybackrate"
                        disablePictureInPicture
                        onContextMenu={(e) => e.preventDefault()}
                        className={`w-full h-full transition-transform duration-200 ${
                          videoFit === 'cover' ? 'object-cover' : 'object-contain'
                        } ${
                          videoAngle === 90
                            ? 'rotate-90 scale-[0.56]'
                            : videoAngle === 180
                            ? 'rotate-180'
                            : videoAngle === 270
                            ? '-rotate-90 scale-[0.56]'
                            : 'rotate-0'
                        }`}
                      />

                      {/* Top Protected Watermark + Quick Inline Rotate Button */}
                      <div className="pointer-events-none absolute top-3 left-3 right-3 flex items-center justify-between gap-2 text-[11px] text-white/90 bg-slate-900/65 px-3 py-1 rounded-lg">
                        <span className="truncate font-semibold">
                          {`Vidya Setu · ${activeModule.title}`}
                        </span>
                        <div className="flex items-center gap-2 shrink-0">
                          <span className="font-mono-tabular hidden sm:inline text-emerald-300">
                            {aspectRatio} · Protected
                          </span>
                          {!isLandscapeRotated && (
                            <button
                              type="button"
                              onClick={toggleLandscapeRotate}
                              title="Rotate to Landscape Play"
                              className="pointer-events-auto inline-flex items-center gap-1 px-2 py-0.5 rounded bg-emerald-600 hover:bg-emerald-500 text-white text-[10px] font-bold cursor-pointer"
                            >
                              <Maximize2 className="w-3 h-3" />
                              <span>{aspectRatio} Rotate</span>
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Video Completed / Quick Back to Home & Other Subjects Bar */}
                <div
                  className={`p-3.5 rounded-xl border flex flex-wrap items-center justify-between gap-3 ${
                    videoEnded
                      ? 'bg-emerald-50 border-emerald-300'
                      : 'bg-slate-50 border-slate-200'
                  }`}
                >
                  <p className="text-xs font-semibold text-slate-800">
                    {videoEnded
                      ? medium === 'hi'
                        ? 'डेमो वीडियो पूरा हो गया! दूसरे विषय का डेमो देखने के लिए वापस जाएं।'
                        : 'Demo video completed! Go back to explore other subjects.'
                      : medium === 'hi'
                      ? 'दूसरा विषय या होम पेज देखना है?'
                      : 'Want to switch subject or go back to Home?'}
                  </p>
                  <button
                    type="button"
                    onClick={onClose}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-colors cursor-pointer"
                  >
                    <ArrowLeft className="w-3.5 h-3.5 text-emerald-400" />
                    <span>
                      {medium === 'hi'
                        ? 'वापस होम / विषयों पर जाएं'
                        : 'Back to Home / Subjects'}
                    </span>
                  </button>
                </div>

                {/* 1 Lakh (100,000) Concurrent Students Backend Scale & Playback Test */}
                <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <Activity className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span className="text-xs font-bold text-slate-900">
                        1 Lakh (1,00,000) Concurrent Students Backend &amp; Playback Test
                      </span>
                    </div>
                    <button
                      type="button"
                      disabled={isBenchmarking}
                      onClick={handleRun100kBenchmark}
                      className="px-3.5 py-1.5 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-400 rounded-lg transition-colors cursor-pointer"
                    >
                      {isBenchmarking ? 'Testing 100K Load...' : 'Run 1 Lakh Students Test'}
                    </button>
                  </div>

                  {benchmarkResult && (
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 text-xs">
                      <div className="p-2.5 bg-white border border-slate-200 rounded-lg">
                        <p className="text-[11px] text-slate-500">Concurrent Users</p>
                        <p className="font-bold text-emerald-700 font-mono-tabular">
                          {benchmarkResult.simulatedConcurrentStudents.toLocaleString()}
                        </p>
                      </div>
                      <div className="p-2.5 bg-white border border-slate-200 rounded-lg">
                        <p className="text-[11px] text-slate-500">100K Cache Lookup</p>
                        <p className="font-bold text-slate-900 font-mono-tabular">
                          {benchmarkResult.cacheLookupTimeMs} ms
                        </p>
                      </div>
                      <div className="p-2.5 bg-white border border-slate-200 rounded-lg">
                        <p className="text-[11px] text-slate-500">Event Loop Lag</p>
                        <p className="font-bold text-slate-900 font-mono-tabular">
                          {benchmarkResult.eventLoopLagMs} ms
                        </p>
                      </div>
                      <div className="p-2.5 bg-white border border-slate-200 rounded-lg">
                        <p className="text-[11px] text-slate-500">CDN Edge Hit</p>
                        <p className="font-bold text-emerald-700 font-mono-tabular">
                          {benchmarkResult.cdnEdgeCacheHitPct}%
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              /* PDF Resource & Notes (Downloadable or Protected View-Only Mode) */
              <div className="p-6 bg-slate-50 border border-slate-200 rounded-2xl space-y-4">
                <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                  <div className="flex items-center gap-2 text-sm font-bold text-slate-900">
                    <FileText className="w-4 h-4 text-emerald-600" />
                    <span>{activeModule.title} — Study Notes &amp; PDF</span>
                  </div>
                  {activeModule.pdfPolicy === 'downloadable' ? (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                      <Download className="w-3.5 h-3.5" />
                      <span>Downloadable PDF</span>
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-amber-100 text-amber-900 border border-amber-300">
                      <Lock className="w-3.5 h-3.5" />
                      <span>Protected View-Only (Anti-Piracy)</span>
                    </span>
                  )}
                </div>

                {activeModule.pdfUrl && (
                  <div className="space-y-3">
                    <div className="w-full h-80 rounded-xl overflow-hidden border border-slate-200 bg-white">
                      <iframe
                        src={
                          activeModule.pdfPolicy === 'downloadable'
                            ? activeModule.pdfUrl
                            : `${activeModule.pdfUrl}#toolbar=0&navpanes=0`
                        }
                        title="Course Study PDF"
                        className="w-full h-full"
                      />
                    </div>

                    {activeModule.pdfPolicy === 'downloadable' && (
                      <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-white border border-emerald-200 rounded-xl">
                        <div className="flex items-center gap-2 min-w-0">
                          <FileText className="w-4 h-4 text-emerald-600 shrink-0" />
                          <div>
                            <p className="text-xs font-bold text-slate-900 truncate">
                              {activeModule.pdfFileName || `${activeModule.title}.pdf`}
                            </p>
                            <p className="text-[10px] text-slate-500">
                              Verified PDF · Ready for Offline Study &amp; Print
                            </p>
                          </div>
                        </div>
                        <a
                          href={activeModule.pdfUrl}
                          download={activeModule.pdfFileName || `${activeModule.title}.pdf`}
                          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition-colors cursor-pointer shrink-0 shadow-sm"
                        >
                          <Download className="w-3.5 h-3.5" />
                          <span>Download PDF</span>
                        </a>
                      </div>
                    )}
                  </div>
                )}

                {activeModule.notesText ? (
                  <div className="p-4 bg-white border border-slate-200 rounded-xl text-sm text-slate-700 whitespace-pre-line leading-relaxed">
                    {activeModule.notesText}
                  </div>
                ) : (
                  <ul className="space-y-2.5 text-sm text-slate-700">
                    {activeModule.keyTopics.map((topic, i) => (
                      <li key={i} className="p-3 bg-white border border-slate-200 rounded-xl">
                        <span className="font-bold text-emerald-700 mr-2">0{i + 1}.</span>
                        {topic}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}
          </div>

          {/* Right 4 Columns: Full Course LMS Chapter Playlist */}
          <div className="lg:col-span-4 p-5 bg-slate-50 space-y-3 max-h-[560px] overflow-y-auto">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Course Chapters (LMS)
              </h3>
              <span className="text-xs font-mono-tabular text-emerald-700 font-semibold">
                {unlockedModules.length}/{course.modules.length} Unlocked
              </span>
            </div>

            <div className="space-y-2">
              {sortAndNumberModulesSymmetrically(course.modules, {
                normalizeTitles: false,
              }).map((mod, idx) => {
                const unlocked =
                  unlockedModuleIds.includes(mod.id) ||
                  Boolean(mod.isFreePreview);
                const isCurrent = activeModule.id === mod.id;
                const seqNum = mod.chapterNumber || idx + 1;
                return (
                  <button
                    key={mod.id}
                    type="button"
                    onClick={() => setActiveModule(mod)}
                    className={`w-full p-3.5 rounded-xl border text-left transition-colors flex items-start justify-between gap-2.5 cursor-pointer ${
                      isCurrent
                        ? 'bg-white border-emerald-600 ring-1 ring-emerald-600'
                        : 'bg-white border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <span
                      className={`w-6 h-6 rounded-lg text-[11px] font-bold font-mono-tabular flex items-center justify-center shrink-0 mt-0.5 ${
                        isCurrent
                          ? 'bg-emerald-600 text-white'
                          : 'bg-slate-100 text-slate-700'
                      }`}
                    >
                      {seqNum}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-bold text-slate-900 leading-snug">
                        {mod.title}
                      </p>
                      <p className="text-[11px] text-slate-500 mt-1 font-mono-tabular">
                        {mod.durationMins} mins · {mod.mcqCount} MCQs
                      </p>
                    </div>
                    {unlocked ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    ) : (
                      <Lock className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
