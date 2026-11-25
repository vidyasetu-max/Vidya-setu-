import React, { useState, useEffect, useCallback } from 'react';
import { LearnerState } from './types/education';
import { PartnerStandaloneApp } from './components/PartnerStandaloneApp';

const PARTNER_CACHE_KEY = 'vidyasetu_partner_state_v1';

function readCachedPartnerState(): LearnerState | null {
  try {
    const raw = sessionStorage.getItem(PARTNER_CACHE_KEY);
    return raw ? (JSON.parse(raw) as LearnerState) : null;
  } catch {
    return null;
  }
}

function writeCachedPartnerState(state: LearnerState) {
  try {
    sessionStorage.setItem(PARTNER_CACHE_KEY, JSON.stringify(state));
  } catch {
    // Ignore quota errors
  }
}

export const PartnerRootApp: React.FC<{ onBackToStudentApp?: () => void }> = ({
  onBackToStudentApp,
}) => {
  const [learnerState, setLearnerState] = useState<LearnerState | null>(() =>
    readCachedPartnerState()
  );
  const [loading, setLoading] = useState(() => !readCachedPartnerState());

  const fetchState = useCallback(async () => {
    try {
      const res = await fetch('/api/state', { cache: 'no-store' });
      if (res.ok) {
        const data = await res.json();
        const nextState: LearnerState | null =
          data?.state || (Array.isArray(data?.unlockedModuleIds) ? data : null);
        if (nextState) {
          setLearnerState(nextState);
          writeCachedPartnerState(nextState);
        }
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchState();
  }, [fetchState]);

  const handleBackToStudentApp = () => {
    if (onBackToStudentApp) {
      onBackToStudentApp();
    } else {
      window.location.href = '/';
    }
  };

  if (loading && !learnerState) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white font-bold text-sm flex items-center justify-center">
          VS
        </div>
        <p className="text-xs font-semibold text-slate-400">
          Loading Vidya Setu Partner Portal...
        </p>
      </div>
    );
  }

  // Fallback initial state if offline
  const safeState: LearnerState = learnerState || {
    user: null,
    siteConfig: {
      appName: 'Vidya Setu',
      brandInitials: 'VS',
      primaryColor: '#059669',
      fontFamily: 'Plus Jakarta Sans',
      heroImageUrl: '',
      heroHeadline: 'Smart Learning & Modular Courses',
      heroSubtitleEn: 'Modular education platform.',
      heroSubtitleHi: 'मॉड्यूलर शिक्षा मंच',
      statMentors: '500+',
      statStudents: '10K+',
      statRating: '4.8',
      contactEmail: 'contact@vidyasetu.in',
      contactPhone: '+91 98765 43210',
      contactAddress: 'Vidya Setu Tower, Knowledge Park, New Delhi',
      announcementText: 'Teacher Partner Registration is Active',
    },
    bankAccount: {
      accountHolderName: 'Vidya Setu',
      bankName: 'State Bank of India',
      accountNumber: '1234567890',
      ifscCode: 'SBIN0001234',
      upiId: 'vidyasetu@upi',
      razorpayKeyId: '',
      razorpayMerchantName: 'Vidya Setu',
    },
    apiConfig: {
      razorpayKeyId: '',
      razorpayKeySecret: '',
      razorpayMode: 'test',
      smsOtpProvider: 'Twilio',
      emailSmtpHost: 'smtp.sendgrid.net',
      webhookUrl: '',
      autoUnlockOnPayment: true,
      enableOnlineTests: true,
      enableLiveDoubts: true,
      enableKidsArena: true,
      maintenanceMode: false,
    },
    courses: [],
    mcqSegments: [],
    onlineTests: [],
    testSubmissions: [],
    studentAccessGrants: [],
    pendingAccessRequests: [],
    startupIdeas: [],
    goalConversations: [],
    studentGallery: [],
    contactMessages: [],
    notifications: [],
    unlockedModuleIds: [],
    receipts: [],
    mcqAttempts: [],
    kidsXp: 100,
    kidsStars: 5,
    kidsStreak: 3,
    unlockedBadges: [],
    doubts: [],
    streakDays: 7,
  };

  return (
    <PartnerStandaloneApp
      learnerState={safeState}
      onBackToStudentApp={handleBackToStudentApp}
      onSyncState={fetchState}
    />
  );
};
