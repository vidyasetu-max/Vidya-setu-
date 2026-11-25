import React, { useState } from 'react';
import { X, ShieldCheck, FileText, CheckCircle2, Download, Printer } from 'lucide-react';
import { StudyMedium } from '../types/education';
import { DEFAULT_PRIVACY_POLICY, DEFAULT_TERMS_AND_CONDITIONS } from '../data/legalPolicies';

interface LegalPolicyModalProps {
  isOpen: boolean;
  onClose: () => void;
  medium?: StudyMedium;
  initialTab?: 'privacy' | 'terms';
  privacyText?: string;
  termsText?: string;
  lastUpdated?: string;
}

export const LegalPolicyModal: React.FC<LegalPolicyModalProps> = ({
  isOpen,
  onClose,
  medium = 'hi',
  initialTab = 'privacy',
  privacyText,
  termsText,
  lastUpdated = 'November 10, 2026',
}) => {
  const [activeTab, setActiveTab] = useState<'privacy' | 'terms'>(initialTab);

  if (!isOpen) return null;

  const content = activeTab === 'privacy' 
    ? (privacyText || DEFAULT_PRIVACY_POLICY) 
    : (termsText || DEFAULT_TERMS_AND_CONDITIONS);

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    const blob = new Blob([content], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = activeTab === 'privacy' ? 'BroSis_VidyaSetu_Privacy_Policy.md' : 'BroSis_VidyaSetu_Terms_and_Conditions.md';
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto"
      role="dialog"
      aria-modal="true"
    >
      <div className="bg-white border border-slate-200 rounded-2xl max-w-3xl w-full max-h-[90vh] flex flex-col overflow-hidden shadow-2xl">
        {/* Modal Header */}
        <div className="p-4 sm:p-5 bg-slate-900 text-white flex items-center justify-between gap-4 border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-600 flex items-center justify-center text-white font-bold">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm sm:text-base font-bold">
                {medium === 'hi'
                  ? 'कानूनी नीतियां एवं नियम — Vidya Setu'
                  : 'Legal Policies & Terms — Vidya Setu'}
              </h2>
              <p className="text-[11px] text-slate-400">
                Official Compliance Document • Last Updated: {lastUpdated}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleDownload}
              title="Download Policy Document"
              className="p-1.5 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
            >
              <Download className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={handlePrint}
              title="Print Document"
              className="p-1.5 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-colors cursor-pointer hidden sm:block"
            >
              <Printer className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="bg-slate-100 p-2 border-b border-slate-200 flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={() => setActiveTab('privacy')}
            className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 text-xs font-bold rounded-xl transition-colors cursor-pointer ${
              activeTab === 'privacy'
                ? 'bg-white text-emerald-800 shadow-sm border border-slate-200/80'
                : 'text-slate-600 hover:bg-white/60'
            }`}
          >
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Privacy Policy (गोपनीयता नीति)</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('terms')}
            className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 text-xs font-bold rounded-xl transition-colors cursor-pointer ${
              activeTab === 'terms'
                ? 'bg-white text-indigo-800 shadow-sm border border-slate-200/80'
                : 'text-slate-600 hover:bg-white/60'
            }`}
          >
            <FileText className="w-4 h-4 text-indigo-600" />
            <span>Terms &amp; Conditions (नियम व शर्तें)</span>
          </button>
        </div>

        {/* Content Viewer */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-4 text-slate-800 text-xs sm:text-sm leading-relaxed font-sans">
          {content.split('\n\n').map((paragraph, idx) => {
            if (paragraph.startsWith('# ')) {
              return (
                <h1 key={idx} className="text-lg sm:text-xl font-bold text-slate-900 border-b border-slate-200 pb-2">
                  {paragraph.replace('# ', '')}
                </h1>
              );
            }
            if (paragraph.startsWith('### ')) {
              return (
                <h3 key={idx} className="text-sm sm:text-base font-bold text-slate-900 text-emerald-800 pt-2 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{paragraph.replace('### ', '')}</span>
                </h3>
              );
            }
            if (paragraph.startsWith('---')) {
              return <hr key={idx} className="border-slate-200 my-2" />;
            }
            return (
              <p key={idx} className="text-slate-700 whitespace-pre-line">
                {paragraph}
              </p>
            );
          })}
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0 text-xs">
          <span className="text-slate-500 font-semibold">
            Grievance Officer: <strong className="text-slate-800">fabindiabaaz@gmail.com</strong>
          </span>
          <button
            type="button"
            onClick={onClose}
            className="w-full sm:w-auto px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl transition-colors cursor-pointer"
          >
            I Acknowledge &amp; Understand (समझ लिया)
          </button>
        </div>
      </div>
    </div>
  );
};
