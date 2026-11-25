import React, { useState } from 'react';
import { Smartphone, Download, Share, PlusSquare, X, CheckCircle2 } from 'lucide-react';
import { usePWAInstall, useOnlineStatus } from '../hooks/usePWAInstall';

export const PWAInstallButton: React.FC = () => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showMobileGuide, setShowMobileGuide] = useState(false);

  if (isInstalled) {
    return null;
  }

  return (
    <>
      <button
        type="button"
        onClick={async () => {
          if (isInstallable) {
            await install();
          } else {
            setShowMobileGuide(true);
          }
        }}
        className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-emerald-950 bg-emerald-100 hover:bg-emerald-200 border border-emerald-300 rounded-xl transition-colors whitespace-nowrap shrink-0 cursor-pointer"
      >
        <Smartphone className="w-3.5 h-3.5 text-emerald-700" />
        <span className="hidden sm:inline">
          {isInstallable ? 'Install App' : 'Android / iOS App'}
        </span>
        <span className="sm:hidden">App</span>
      </button>

      {showMobileGuide && (
        <div
          className="fixed inset-0 z-50 bg-slate-900/60 flex items-center justify-center p-4 overflow-y-auto"
          role="dialog"
          aria-modal="true"
          aria-labelledby="mobile-install-title"
        >
          <div className="bg-white border border-slate-200 rounded-2xl max-w-md w-full overflow-hidden my-8">
            <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Smartphone className="w-5 h-5 text-emerald-400" />
                <h2 id="mobile-install-title" className="text-base font-bold">
                  Install Vidya Setu (Android &amp; iOS)
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setShowMobileGuide(false)}
                aria-label="Close install guide"
                className="p-1.5 text-slate-300 hover:text-white rounded-lg hover:bg-slate-800 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              {isInstallable && (
                <button
                  type="button"
                  onClick={async () => {
                    const ok = await install();
                    if (ok) setShowMobileGuide(false);
                  }}
                  className="w-full py-3 px-4 text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl inline-flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Download className="w-4 h-4" />
                  <span>1-Tap Install on This Device</span>
                </button>
              )}

              {/* Android Instructions */}
              <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl space-y-1.5">
                <p className="text-xs font-bold text-emerald-950 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                  <span>Android Phone (Chrome / Edge)</span>
                </p>
                <p className="text-xs text-emerald-900 leading-relaxed">
                  1. Chrome browser mein top-right <strong>⋮ (3 dots)</strong> par tap karein.
                  <br />
                  2. <strong>&ldquo;Install app&rdquo;</strong> ya{' '}
                  <strong>&ldquo;Add to Home screen&rdquo;</strong> par tap karein — app icon aapke Android phone mein install ho jayega.
                </p>
              </div>

              {/* iOS Safari Instructions */}
              <div
                className={`p-4 border rounded-xl space-y-1.5 ${
                  isIOS
                    ? 'bg-indigo-50 border-indigo-300'
                    : 'bg-slate-50 border-slate-200'
                }`}
              >
                <p className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                  <Share className="w-4 h-4 text-indigo-600" />
                  <span>iPhone / iPad (iOS Safari)</span>
                </p>
                <p className="text-xs text-slate-700 leading-relaxed">
                  1. Safari browser mein neeche <strong>Share</strong> icon (square with arrow) par tap karein.
                  <br />
                  2. Neeche scroll karke{' '}
                  <strong className="inline-flex items-center gap-1">
                    <PlusSquare className="w-3.5 h-3.5 inline" /> Add to Home Screen
                  </strong>{' '}
                  par tap karein — iOS app ready ho jayega!
                </p>
              </div>

              <button
                type="button"
                onClick={() => setShowMobileGuide(false)}
                className="w-full py-2.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export const OfflineIndicator: React.FC = () => {
  const isOnline = useOnlineStatus();

  if (isOnline) return null;

  return (
    <div className="fixed bottom-20 left-4 z-50 flex items-center gap-2 rounded-xl bg-amber-500 px-3.5 py-2 text-xs font-bold text-white shadow-lg">
      <span className="h-2 w-2 rounded-full bg-white animate-pulse" />
      <span>Offline Mode — Cached courses &amp; notes active</span>
    </div>
  );
};
