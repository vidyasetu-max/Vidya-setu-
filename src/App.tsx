import React, { useState, useEffect, useCallback } from 'react';
import {
  Home,
  Briefcase,
  CheckSquare,
  MessageSquare,
  Sparkles,
  LayoutDashboard,
  Languages,
  Bell,
  UserCheck,
  ClipboardCheck,
  User,
  Lightbulb,
  Search,
  ArrowLeft,
} from 'lucide-react';
import {
  COURSES,
  MCQ_SEGMENTS,
  INITIAL_ONLINE_TESTS,
  DOUBT_SESSIONS,
  INITIAL_DOUBTS,
  KIDS_CHALLENGES,
} from './data/educationData';
import { getSubjectKeyFromCourseId } from './data/k12SubjectMcqsAndTests';
import { K12SubjectCourse } from './data/k12SubjectsData';
import {
  Course,
  CourseModule,
  LearnerState,
  McqSegment,
  OnlineTest,
  OnlineTestSubmission,
  PurchaseReceipt,
  PendingAccessRequest,
  SiteConfig,
  StudyMedium,
  BankAccountConfig,
  ApiConnectionsConfig,
} from './types/education';
import { CourseCatalogView } from './components/CourseCatalogView';
import { SkillsHubView } from './components/SkillsHubView';
import { OnlineTestsView } from './components/OnlineTestsView';
import { StudentProfileModal } from './components/StudentProfileModal';
import { CourseSyllabusModal } from './components/CourseSyllabusModal';
import { PaymentGatewayModal } from './components/PaymentGatewayModal';
import { LmsVideoPlayerModal } from './components/LmsVideoPlayerModal';
import { AuthLoginModal } from './components/AuthLoginModal';
import { NotificationModal } from './components/NotificationModal';
import { McqSprintView } from './components/McqSprintView';
import { KidsArenaView } from './components/KidsArenaView';
import { LiveDoubtsView } from './components/LiveDoubtsView';
import { ProgressDashboardView } from './components/ProgressDashboardView';
import { StudentHubView } from './components/StudentHubView';
import { StudentAiChatbot } from './components/StudentAiChatbot';
import { LegalPolicyModal } from './components/LegalPolicyModal';
import {
  PWAInstallButton,
  OfflineIndicator,
} from './components/MobileAppInstallBanner';

const PartnerRootApp = React.lazy(() =>
  import('./PartnerRootApp').then((m) => ({
    default: m.PartnerRootApp,
  }))
);

const AdminRootApp = React.lazy(() =>
  import('./AdminRootApp').then((m) => ({
    default: m.AdminRootApp,
  }))
);

type ActiveView =
  | 'catalog'
  | 'skills'
  | 'mcq'
  | 'tests'
  | 'hub'
  | 'doubts'
  | 'kids'
  | 'dashboard';

const FALLBACK_STATE: LearnerState = {
  user: null,
  siteConfig: {
    appName: 'Vidya Setu',
    brandInitials: 'VS',
    primaryColor: '#059669',
    heroImageUrl: '/src/assets/images/hero_learning_studio_1793856674745.jpg',
    featureImages: [
      {
        id: 'feat-img-1',
        title: 'Smart Concept Studio & Live Boards',
        hindiTitle: 'स्मार्ट कॉन्सेप्ट स्टूडियो और लाइव बोर्ड क्लासेस',
        caption: 'Class 9–12 NCERT, Physics, Chemistry & Maths with HD video chapters and downloadable notes.',
        hindiCaption: 'कक्षा 9–12 NCERT, फिजिक्स, केमिस्ट्री और मैथ्स के HD वीडियो चैप्टर व नोट्स।',
        imageUrl: '/src/assets/images/hero_learning_studio_1793856674745.jpg',
        ctaLabel: 'Explore Boards',
        targetView: 'catalog',
      },
      {
        id: 'feat-img-2',
        title: 'UPSC, SSC & Banking MCQ Sprints',
        hindiTitle: 'UPSC, SSC और बैंकिंग हिंदी MCQ प्रैक्टिस',
        caption: 'Timed bilingual MCQ sprints, Polity & Economy capsules, and All-India mock test series.',
        hindiCaption: 'टाइमर्ड हिंदी/इंग्लिश MCQ प्रैक्टिस, पॉलिटी और ऑल-इंडिया मॉक टेस्ट।',
        imageUrl: '/src/assets/images/track_competitive_exams_1793856674843.jpg',
        ctaLabel: 'Start MCQ Sprint',
        targetView: 'mcq',
      },
      {
        id: 'feat-img-3',
        title: 'High-Salary AI, Python & Digital Skills',
        hindiTitle: 'हाई-सैलरी AI, Python और डिजिटल स्किल्स',
        caption: 'Job-ready Python automation, Generative AI workflows, and real project labs.',
        hindiCaption: 'जॉब-रेडी Python, AI टूल्स और प्रैक्टिकल प्रोजेक्ट लैब्स।',
        imageUrl: '/src/assets/images/track_digital_skills_1793856675081.jpg',
        ctaLabel: 'Open Skills Hub',
        targetView: 'skills',
      },
      {
        id: 'feat-img-4',
        title: 'Future Kids Gamified Foundation',
        hindiTitle: 'फ्यूचर किड्स गेमीफाइड लर्निंग एरिना',
        caption: 'Visual math puzzles, logic streaks, and interactive challenges for young learners.',
        hindiCaption: 'बच्चों के लिए विज़ुअल मैथ पज़ल्स, लॉजिक स्ट्रीक्स और इंटरैक्टिव गेम्स।',
        imageUrl: '/src/assets/images/track_kids_gamification_1793856675358.jpg',
        ctaLabel: 'Visit Kids Arena',
        targetView: 'kids',
      },
    ],
    heroHeadline: 'Smart Learning & Modular Courses',
    heroSubtitleEn:
      'Class 9–12 Boards, UPSC, SSC & Banking, High-Salary AI & Python Skills, and Future Kids—buy full courses or single chapters with 12 Months LMS Video Access.',
    heroSubtitleHi:
      'Class 9–12, UPSC, SSC & Banking, AI & Python High-Salary Skills, aur Future Kids — 12 Months LMS Video Access ke saath full course ya single chapter lein.',
    statMentors: '500+',
    statStudents: '10K+',
    statRating: '4.8',
    contactEmail: 'support@brosisvidyasetu.in',
    contactPhone: '+91 98765 43210',
    contactAddress: 'Sector 62, Noida & Mukherjee Nagar, New Delhi',
    announcementText:
      'New Batch Live: UPSC Prelims Hindi MCQ Sprint & High-Salary AI/Python Modules — 12 Months LMS Access!',
  },
  bankAccount: {
    accountHolderName: 'Akash Prasad',
    bankName: 'Fino Payments Bank',
    accountNumber: '20305602063',
    ifscCode: 'FINO0001044',
    upiId: 'avirayahoo39-1@okicici',
    upiQrCodeUrl: '/assets/aistudio/GooglePay_QR__4__0205045a.png',
    razorpayKeyId: '',
    razorpayMerchantName: 'Vidya Setu',
  },
  apiConfig: {
    razorpayKeyId: '',
    razorpayKeySecret: '',
    razorpayMode: 'live',
    smsOtpProvider: 'MSG91 / Fast2SMS India (+91)',
    emailSmtpHost: 'smtp.gmail.com (TLS 587)',
    otpDeliveryMode: 'built_in_gateway',
    smsOtpApiKey: '',
    smsSenderId: 'VDYSET',
    webhookUrl: 'https://api.brosisvidyasetu.in/webhooks/razorpay',
    autoUnlockOnPayment: false,
    enableOnlineTests: true,
    enableLiveDoubts: true,
    enableKidsArena: true,
    maintenanceMode: false,
  },
  courses: COURSES,
  mcqSegments: MCQ_SEGMENTS,
  onlineTests: INITIAL_ONLINE_TESTS,
  testSubmissions: [],
  studentAccessGrants: [],
  pendingAccessRequests: [],
  contactMessages: [],
  startupIdeas: [],
  goalConversations: [],
  studentGallery: [],
  notifications: [
    {
      id: 'notif-1',
      title: 'New Hindi MCQ Segments Live!',
      hindiTitle: 'Naye Hindi MCQ Segments Live Ho Gaye Hain!',
      message: 'Practice UPSC Polity, Class 12 Physics, and Speed Quant with auto-timer.',
      hindiMessage: 'UPSC Polity, Class 12 Physics aur Speed Quant ke automatic Hindi MCQs abhi practice karein.',
      timestamp: 'Just now',
      category: 'mcq',
      read: false,
    },
    {
      id: 'notif-2',
      title: 'Live Doubt Clinic Active Now',
      hindiTitle: 'Live Doubt Solving Session Abhi Chal Raha Hai',
      message: 'Prof. Arvind Mehta & Dr. Priya Nair are answering student doubts live.',
      hindiMessage: 'Prof. Arvind Mehta aur Dr. Priya Nair abhi live doubts solve kar rahe hain.',
      timestamp: '10 mins ago',
      category: 'doubt',
      read: false,
    },
  ],
  unlockedModuleIds: [
    'mod-upsc-1',
    'mod-phy-1',
    'mod-ssc-1',
    'mod-ai-1',
    'mod-py-1',
    'mod-dm-1',
    'mod-math-1',
    'mod-kids-1',
  ],
  receipts: [
    {
      id: 'rcpt-seed-1',
      transactionId: 'TXN-VS-849201',
      date: '2026-11-02',
      courseId: 'course-class12-physics',
      courseTitle: 'Class 12 Physics: Electrostatics, Current & Optics',
      purchaseType: 'Partial Modules',
      moduleIds: ['mod-phy-1'],
      moduleTitles: ['01. Gauss’s Law & Electric Potential'],
      amountPaidInr: 249,
      paymentMethod: 'UPI (GPay)',
    },
  ],
  mcqAttempts: [
    {
      id: 'att-seed-1',
      trackTitle: 'UPSC राजव्यवस्था: मौलिक अधिकार',
      date: '2026-11-03',
      score: 4,
      total: 5,
      accuracyPct: 80,
      avgTimeSec: 18,
    },
  ],
  kidsXp: 180,
  kidsStars: 12,
  kidsStreak: 3,
  unlockedBadges: ['Number Ninja'],
  doubts: INITIAL_DOUBTS,
  streakDays: 7,
};

export default function App() {
  const [activeView, setActiveView] = useState<ActiveView>('catalog');
  const [globalSearchQuery, setGlobalSearchQuery] = useState('');
  const [medium, setMedium] = useState<StudyMedium>('hi');
  const [learnerState, setLearnerState] = useState<LearnerState>(FALLBACK_STATE);

  const [selectedCourseForSyllabus, setSelectedCourseForSyllabus] = useState<Course | null>(null);
  const [lmsPlayerState, setLmsPlayerState] = useState<{
    course: Course;
    moduleId?: string;
  } | null>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showNotifModal, setShowNotifModal] = useState(false);
  const [showLegalModal, setShowLegalModal] = useState(false);
  const [legalModalTab, setLegalModalTab] = useState<'privacy' | 'terms'>('privacy');
  const [checkoutPayload, setCheckoutPayload] = useState<{
    course: Course;
    purchaseType: 'Full Course' | 'Partial Modules';
    selectedModules: CourseModule[];
    finalAmountInr: number;
  } | null>(null);
  const [mcqInitialTrackId, setMcqInitialTrackId] = useState<string | undefined>(undefined);
  const [showAdminPortal, setShowAdminPortal] = useState(false);
  const [showPartnerPortal, setShowPartnerPortal] = useState(false);
  const [showPortalLauncher, setShowPortalLauncher] = useState(false);
  const logoTapCountRef = React.useRef(0);
  const logoTapTimerRef = React.useRef<number | null>(null);
  const partnerTapCountRef = React.useRef(0);
  const partnerTapTimerRef = React.useRef<number | null>(null);

  const openAdminPortal = useCallback(() => {
    try {
      window.history.pushState({ admin: true }, '', '/admin');
    } catch {}
    setShowPortalLauncher(false);
    setShowPartnerPortal(false);
    setShowAdminPortal(true);
  }, []);

  const openPartnerPortal = useCallback(() => {
    try {
      window.history.pushState({ partner: true }, '', '/partner');
    } catch {}
    setShowPortalLauncher(false);
    setShowAdminPortal(false);
    setShowPartnerPortal(true);
  }, []);

  useEffect(() => {
    const onPopState = () => {
      if (window.location.pathname === '/admin') {
        setShowPartnerPortal(false);
        setShowAdminPortal(true);
      } else if (window.location.pathname === '/partner') {
        setShowAdminPortal(false);
        setShowPartnerPortal(true);
      } else {
        setShowAdminPortal(false);
        setShowPartnerPortal(false);
      }
    };
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Do not allow jumping into Admin from inside the isolated Partner Portal
      if (showPartnerPortal) return;
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key.toLowerCase() === 'a') {
        e.preventDefault();
        openAdminPortal();
      }
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key.toLowerCase() === 'p') {
        e.preventDefault();
        openPartnerPortal();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [openAdminPortal, openPartnerPortal, showPartnerPortal]);

  const refreshFromServer = useCallback(async () => {
    try {
      const res = await fetch('/api/state', { cache: 'no-store' });
      if (res.ok) {
        const data = await res.json();
        if (data && Array.isArray(data.unlockedModuleIds)) {
          setLearnerState(data);
        }
      }
    } catch {
      // Keep fallback state if offline
    }
  }, []);

  useEffect(() => {
    refreshFromServer();
  }, [refreshFromServer]);

  const handleCompletePurchase = useCallback(
    async (payload: {
      courseId: string;
      courseTitle: string;
      purchaseType: 'Full Course' | 'Partial Modules';
      moduleIds: string[];
      moduleTitles: string[];
      amountPaidInr: number;
      paymentMethod: string;
      transactionRef: string;
      promoApplied?: string;
      studentName?: string;
      studentIdentifier?: string;
      settledToBank?: string;
    }): Promise<{
      autoUnlocked: boolean;
      receipt?: PurchaseReceipt;
      pendingRequest?: PendingAccessRequest;
    }> => {
      const res = await fetch('/api/purchase', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(
          data.error ||
            'Payment submission failed. Please enter a valid UTR / Transaction ID.'
        );
      }
      if (data.state) {
        setLearnerState(data.state);
      }
      return {
        autoUnlocked: Boolean(data.autoUnlocked),
        receipt: data.receipt,
        pendingRequest: data.pendingRequest,
      };
    },
    []
  );

  const handleRecordMcqAttempt = useCallback(
    async (attempt: {
      trackTitle: string;
      score: number;
      total: number;
      accuracyPct: number;
      avgTimeSec: number;
    }) => {
      try {
        const res = await fetch('/api/mcq-attempt', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(attempt),
        });
        if (res.ok) {
          const data = await res.json();
          setLearnerState(data.state);
          return;
        }
      } catch {
        // Fallback local update
      }
      setLearnerState((prev) => ({
        ...prev,
        mcqAttempts: [
          {
            id: `att-${Date.now()}`,
            date: new Date().toISOString().slice(0, 10),
            ...attempt,
          },
          ...prev.mcqAttempts,
        ],
      }));
    },
    []
  );

  const handleSubmitDoubt = useCallback(
    async (payload: {
      sessionId: string;
      studentName: string;
      topicTag: string;
      questionText: string;
    }) => {
      try {
        const res = await fetch('/api/doubts', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        if (res.ok) {
          const data = await res.json();
          setLearnerState(data.state);
          return;
        }
      } catch {
        // Fallback local update
      }
      setLearnerState((prev) => ({
        ...prev,
        doubts: [
          {
            id: `dq-${Date.now()}`,
            sessionId: payload.sessionId,
            studentName: payload.studentName,
            topicTag: payload.topicTag,
            questionText: payload.questionText,
            timestamp: 'Just now',
            upvotes: 1,
            upvoted: true,
            mentorReply:
              'Your doubt has been pinned to the live mentor board for immediate review.',
            status: 'Answered',
          },
          ...prev.doubts,
        ],
      }));
    },
    []
  );

  const handleUpvoteDoubt = useCallback(async (doubtId: string) => {
    setLearnerState((prev) => ({
      ...prev,
      doubts: prev.doubts.map((d) =>
        d.id === doubtId
          ? {
              ...d,
              upvotes: d.upvoted ? d.upvotes - 1 : d.upvotes + 1,
              upvoted: !d.upvoted,
            }
          : d
      ),
    }));
    try {
      await fetch(`/api/doubts/${doubtId}/upvote`, { method: 'POST' });
    } catch {
      // Ignore network error
    }
  }, []);

  const handleEarnKidsXp = useCallback(
    async (params: { xpEarned: number; starsEarned: number; isCorrect: boolean }) => {
      try {
        const res = await fetch('/api/kids-xp', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(params),
        });
        if (res.ok) {
          const data = await res.json();
          setLearnerState(data.state);
          return;
        }
      } catch {
        // Fallback local update
      }
      setLearnerState((prev) => ({
        ...prev,
        kidsXp: prev.kidsXp + params.xpEarned,
        kidsStars: prev.kidsStars + params.starsEarned,
        kidsStreak: params.isCorrect ? prev.kidsStreak + 1 : 0,
      }));
    },
    []
  );

  const handleLogin = useCallback(
    async (payload: {
      name: string;
      method: 'gmail' | 'mobile';
      identifier: string;
      adminPassword?: string;
      otp?: string;
    }) => {
      let res: Response | null = null;
      try {
        res = await fetch('/api/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
      } catch {
        res = null;
      }

      if (res) {
        const rawText = await res.text();
        let data: { state?: LearnerState; error?: string } = {};
        try {
          data = rawText ? JSON.parse(rawText) : {};
        } catch {
          data = {};
        }
        if (!res.ok) {
          throw new Error(
            data.error || `Login request failed (HTTP ${res.status}).`
          );
        }
        if (data.state) {
          setLearnerState(data.state);
        }
        return;
      }

      // Network-offline fallback only when server is unreachable
      const userObj = {
        name: payload.name || payload.identifier.split('@')[0] || 'Student',
        method: payload.method,
        identifier: payload.identifier,
        loggedInAt: new Date().toISOString(),
        isAdmin: false,
      };
      setLearnerState((prev) => ({
        ...prev,
        user: userObj,
        notifications: [
          {
            id: `notif-${Date.now()}`,
            title: `Signed in as ${userObj.identifier}`,
            hindiTitle: `Login Successful: ${userObj.identifier}`,
            message: 'Your Vidya Setu account & 12 Months LMS access are synced.',
            hindiMessage: 'Aapka Vidya Setu account aur 12 Months LMS access verify ho gaya hai.',
            timestamp: 'Just now',
            category: 'security',
            read: false,
          },
          ...prev.notifications,
        ],
      }));
    },
    []
  );

  const handleLogout = useCallback(async () => {
    try {
      const res = await fetch('/api/logout', { method: 'POST' });
      if (res.ok) {
        const data = await res.json();
        setLearnerState(data.state);
        return;
      }
    } catch {
      // Fallback
    }
    setLearnerState((prev) => ({ ...prev, user: null }));
  }, []);

  const handleMarkAllNotificationsRead = useCallback(async () => {
    setLearnerState((prev) => ({
      ...prev,
      notifications: prev.notifications.map((n) => ({ ...n, read: true })),
    }));
    try {
      await fetch('/api/notifications/read-all', { method: 'POST' });
    } catch {
      // Ignore
    }
  }, []);

  const handleSendBroadcast = useCallback(
    async (payload: { title: string; message: string }) => {
      try {
        const res = await fetch('/api/notifications', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...payload, category: 'broadcast' }),
        });
        if (res.ok) {
          const data = await res.json();
          setLearnerState(data.state);
          return;
        }
      } catch {
        // Fallback
      }
      setLearnerState((prev) => ({
        ...prev,
        notifications: [
          {
            id: `notif-${Date.now()}`,
            title: payload.title,
            hindiTitle: payload.title,
            message: payload.message,
            hindiMessage: payload.message,
            timestamp: 'Just now',
            category: 'broadcast',
            read: false,
          },
          ...prev.notifications,
        ],
      }));
    },
    []
  );

  const handleSaveSiteConfig = useCallback(async (updates: Partial<SiteConfig>) => {
    setLearnerState((prev) => ({
      ...prev,
      siteConfig: { ...prev.siteConfig, ...updates },
    }));
    try {
      const res = await fetch('/api/admin/site-config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });
      if (res.ok) {
        const data = await res.json();
        setLearnerState(data.state);
      }
    } catch {
      // Fallback
    }
  }, []);

  const handleSaveCourse = useCallback(async (coursePayload: Course) => {
    setLearnerState((prev) => {
      const exists = prev.courses.some((c) => c.id === coursePayload.id);
      return {
        ...prev,
        courses: exists
          ? prev.courses.map((c) => (c.id === coursePayload.id ? coursePayload : c))
          : [coursePayload, ...prev.courses],
      };
    });
    try {
      const stored = localStorage.getItem('vidyasetu_live_courses');
      const list = stored ? JSON.parse(stored) : [];
      const updatedList = [
        coursePayload,
        ...list.filter((c: Course) => c.id !== coursePayload.id),
      ];
      localStorage.setItem('vidyasetu_live_courses', JSON.stringify(updatedList));
    } catch {}
    try {
      const adminToken = sessionStorage.getItem('vidyasetu_admin_token') || '';
      const res = await fetch('/api/admin/courses', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(adminToken ? { 'x-admin-token': adminToken } : {}),
        },
        body: JSON.stringify(coursePayload),
      });
      if (res.ok) {
        const data = await res.json();
        setLearnerState(data.state);
      }
    } catch {
      // Fallback
    }
  }, []);

  const handleAddMcqSegment = useCallback(async (seg: McqSegment) => {
    setLearnerState((prev) => ({
      ...prev,
      mcqSegments: [seg, ...prev.mcqSegments],
    }));
    try {
      const res = await fetch('/api/admin/mcq', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(seg),
      });
      if (res.ok) {
        const data = await res.json();
        setLearnerState(data.state);
      }
    } catch {
      // Fallback
    }
  }, []);

  const handleSendContactMessage = useCallback(
    async (payload: {
      senderName: string;
      senderContact: string;
      subject: string;
      message: string;
    }) => {
      try {
        const res = await fetch('/api/contact', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        if (res.ok) {
          const data = await res.json();
          setLearnerState(data.state);
          return;
        }
      } catch {
        // Fallback
      }
      setLearnerState((prev) => ({
        ...prev,
        contactMessages: [
          {
            id: `msg-${Date.now()}`,
            ...payload,
            timestamp: 'Just now',
          },
          ...prev.contactMessages,
        ],
      }));
    },
    []
  );

  const handleSubmitOnlineTest = useCallback(
    async (submission: Omit<OnlineTestSubmission, 'id' | 'submittedAt'>) => {
      try {
        const res = await fetch('/api/tests/submit', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(submission),
        });
        if (res.ok) {
          const data = await res.json();
          setLearnerState(data.state);
          return;
        }
      } catch {
        // Fallback
      }
      setLearnerState((prev) => ({
        ...prev,
        testSubmissions: [
          {
            ...submission,
            id: `sub-${Date.now()}`,
            submittedAt: new Date().toISOString().slice(0, 10),
          },
          ...prev.testSubmissions,
        ],
      }));
    },
    []
  );

  const handleSaveOnlineTest = useCallback(async (test: OnlineTest) => {
    setLearnerState((prev) => {
      const exists = prev.onlineTests.some((t) => t.id === test.id);
      return {
        ...prev,
        onlineTests: exists
          ? prev.onlineTests.map((t) => (t.id === test.id ? test : t))
          : [test, ...prev.onlineTests],
      };
    });
    try {
      const res = await fetch('/api/admin/tests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(test),
      });
      if (res.ok) {
        const data = await res.json();
        setLearnerState(data.state);
      }
    } catch {
      // Fallback
    }
  }, []);

  const handleDeleteOnlineTest = useCallback(async (testId: string) => {
    setLearnerState((prev) => ({
      ...prev,
      onlineTests: prev.onlineTests.filter((t) => t.id !== testId),
    }));
    try {
      const res = await fetch(`/api/admin/tests/${testId}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        const data = await res.json();
        setLearnerState(data.state);
      }
    } catch {
      // Fallback
    }
  }, []);

  const handleSaveProfile = useCallback(
    async (profile: {
      name: string;
      method: 'gmail' | 'mobile';
      identifier: string;
      targetExam: string;
      preferredMedium: StudyMedium;
      city: string;
      bio: string;
      avatarUrl?: string;
    }) => {
      setMedium(profile.preferredMedium);
      try {
        const res = await fetch('/api/profile', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(profile),
        });
        if (res.ok) {
          const data = await res.json();
          setLearnerState(data.state);
          return;
        }
      } catch {
        // Fallback
      }
      setLearnerState((prev) => ({
        ...prev,
        user: {
          ...prev.user,
          ...profile,
          loggedInAt: prev.user?.loggedInAt || new Date().toISOString(),
        },
      }));
    },
    []
  );

  const handleSaveBankAccount = useCallback(
    async (updates: Partial<BankAccountConfig>) => {
      setLearnerState((prev) => ({
        ...prev,
        bankAccount: { ...prev.bankAccount, ...updates },
      }));
      try {
        const res = await fetch('/api/admin/bank-account', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updates),
        });
        if (res.ok) {
          const data = await res.json();
          setLearnerState(data.state);
        }
      } catch {
        // Fallback
      }
    },
    []
  );

  const handleGrantCourseAccess = useCallback(
    async (payload: {
      studentName: string;
      studentIdentifier: string;
      courseId: string;
      courseTitle: string;
      accessType: 'Full Course' | 'Single Chapter';
      moduleIds: string[];
      moduleTitles: string[];
      note?: string;
    }) => {
      try {
        const res = await fetch('/api/admin/grant-access', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        if (res.ok) {
          const data = await res.json();
          setLearnerState(data.state);
          return;
        }
      } catch {
        // Fallback
      }
      setLearnerState((prev) => ({
        ...prev,
        unlockedModuleIds: Array.from(
          new Set([...prev.unlockedModuleIds, ...payload.moduleIds])
        ),
        studentAccessGrants: [
          {
            ...payload,
            id: `grant-${Date.now()}`,
            grantedAt: new Date().toISOString().slice(0, 10),
          },
          ...prev.studentAccessGrants,
        ],
      }));
    },
    []
  );

  const handleRevokeCourseAccess = useCallback(async (moduleIds: string[]) => {
    const revokeSet = new Set(moduleIds);
    setLearnerState((prev) => ({
      ...prev,
      unlockedModuleIds: prev.unlockedModuleIds.filter((id) => !revokeSet.has(id)),
    }));
    try {
      const res = await fetch('/api/admin/revoke-access', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ moduleIds }),
      });
      if (res.ok) {
        const data = await res.json();
        setLearnerState(data.state);
      }
    } catch {
      // Fallback
    }
  }, []);

  const handleSaveApiConfig = useCallback(
    async (updates: Partial<ApiConnectionsConfig>) => {
      setLearnerState((prev) => ({
        ...prev,
        apiConfig: { ...prev.apiConfig, ...updates },
      }));
      try {
        const res = await fetch('/api/admin/api-config', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updates),
        });
        if (res.ok) {
          const data = await res.json();
          setLearnerState(data.state);
        }
      } catch {
        // Fallback
      }
    },
    []
  );

  const handlePendingAccess = useCallback(
    async (id: string, action: 'approve' | 'reject') => {
      try {
        const res = await fetch(`/api/admin/pending-access/${id}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action }),
        });
        if (res.ok) {
          const data = await res.json();
          setLearnerState(data.state);
          return;
        }
      } catch {
        // Fallback
      }
    },
    []
  );

  const handleBulkPendingAccess = useCallback(
    async (
      records: Array<{
        studentName: string;
        studentIdentifier: string;
        courseTitle: string;
        amountInr: number;
        paymentReference: string;
      }>,
      autoApprove: boolean
    ) => {
      try {
        const res = await fetch('/api/admin/bulk-pending-access', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ records, autoApprove }),
        });
        if (res.ok) {
          const data = await res.json();
          setLearnerState(data.state);
          return;
        }
      } catch {
        // Fallback
      }
    },
    []
  );

  const handleReplyDoubt = useCallback(
    async (id: string, mentorReply: string) => {
      try {
        const res = await fetch(`/api/admin/doubts/${id}/reply`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ mentorReply }),
        });
        if (res.ok) {
          const data = await res.json();
          setLearnerState(data.state);
          return;
        }
      } catch {
        // Fallback
      }
    },
    []
  );

  const handleDeleteDoubt = useCallback(async (id: string) => {
    try {
      const res = await fetch(`/api/admin/doubts/${id}`, { method: 'DELETE' });
      if (res.ok) {
        const data = await res.json();
        setLearnerState(data.state);
      }
    } catch {
      // Fallback
    }
  }, []);

  const handleDeleteStartupIdea = useCallback(async (id: string) => {
    try {
      const res = await fetch(`/api/admin/startup-ideas/${id}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        const data = await res.json();
        setLearnerState(data.state);
      }
    } catch {
      // Fallback
    }
  }, []);

  const handleDeleteGoalConversation = useCallback(async (id: string) => {
    try {
      const res = await fetch(`/api/admin/goal-conversations/${id}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        const data = await res.json();
        setLearnerState(data.state);
      }
    } catch {
      // Fallback
    }
  }, []);

  const handleDeleteGalleryPhoto = useCallback(async (id: string) => {
    try {
      const res = await fetch(`/api/admin/student-gallery/${id}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        const data = await res.json();
        setLearnerState(data.state);
      }
    } catch {
      // Fallback
    }
  }, []);

  const handleUpdateStudentRewards = useCallback(
    async (payload: { streakDays: number; kidsXp: number; kidsStars: number }) => {
      try {
        const res = await fetch('/api/admin/student-rewards', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        if (res.ok) {
          const data = await res.json();
          setLearnerState(data.state);
        }
      } catch {
        // Fallback
      }
    },
    []
  );

  const handleAddStartupIdea = useCallback(
    async (idea: {
      title: string;
      domain: string;
      pitch: string;
      imageUrl?: string;
    }) => {
      try {
        const res = await fetch('/api/startup-ideas', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(idea),
        });
        if (res.ok) {
          const data = await res.json();
          setLearnerState(data.state);
          return;
        }
      } catch {
        // Fallback
      }
      setLearnerState((prev) => ({
        ...prev,
        startupIdeas: [
          {
            id: `idea-${Date.now()}`,
            studentName: prev.user?.name || 'Student Innovator',
            studentAvatar: prev.user?.avatarUrl,
            ...idea,
            upvotes: 1,
            createdAt: new Date().toISOString().slice(0, 10),
          },
          ...prev.startupIdeas,
        ],
      }));
    },
    []
  );

  const handleUpvoteIdea = useCallback(async (id: string) => {
    setLearnerState((prev) => ({
      ...prev,
      startupIdeas: prev.startupIdeas.map((item) =>
        item.id === id ? { ...item, upvotes: item.upvotes + 1 } : item
      ),
    }));
    try {
      const res = await fetch(`/api/startup-ideas/${id}/upvote`, {
        method: 'POST',
      });
      if (res.ok) {
        const data = await res.json();
        setLearnerState(data.state);
      }
    } catch {
      // Fallback
    }
  }, []);

  const handleAddGoalConversation = useCallback(
    async (post: { goalTag: string; message: string; imageUrl?: string }) => {
      try {
        const res = await fetch('/api/goal-conversations', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(post),
        });
        if (res.ok) {
          const data = await res.json();
          setLearnerState(data.state);
          return;
        }
      } catch {
        // Fallback
      }
      setLearnerState((prev) => ({
        ...prev,
        goalConversations: [
          {
            id: `goal-${Date.now()}`,
            studentName: prev.user?.name || 'Student Achiever',
            studentAvatar: prev.user?.avatarUrl,
            goalTag: post.goalTag,
            message: post.message,
            imageUrl: post.imageUrl,
            timestamp: 'Just now',
            replies: [],
          },
          ...prev.goalConversations,
        ],
      }));
    },
    []
  );

  const handleReplyGoalConversation = useCallback(
    async (id: string, message: string) => {
      try {
        const res = await fetch(`/api/goal-conversations/${id}/reply`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ message }),
        });
        if (res.ok) {
          const data = await res.json();
          setLearnerState(data.state);
          return;
        }
      } catch {
        // Fallback
      }
      setLearnerState((prev) => ({
        ...prev,
        goalConversations: prev.goalConversations.map((g) =>
          g.id === id
            ? {
                ...g,
                replies: [
                  ...g.replies,
                  {
                    id: `rep-${Date.now()}`,
                    authorName: prev.user?.name || 'Peer Mentor',
                    authorRole: prev.user?.isAdmin ? 'Admin Mentor' : 'Student Peer',
                    message,
                    timestamp: 'Just now',
                  },
                ],
              }
            : g
        ),
      }));
    },
    []
  );

  const handleAddGalleryPhoto = useCallback(
    async (item: { caption: string; imageUrl: string }) => {
      try {
        const res = await fetch('/api/student-gallery', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(item),
        });
        if (res.ok) {
          const data = await res.json();
          setLearnerState(data.state);
          return;
        }
      } catch {
        // Fallback
      }
      setLearnerState((prev) => ({
        ...prev,
        studentGallery: [
          {
            id: `gal-${Date.now()}`,
            studentName: prev.user?.name || 'Student',
            caption: item.caption,
            imageUrl: item.imageUrl,
            uploadedAt: new Date().toISOString().slice(0, 10),
          },
          ...prev.studentGallery,
        ],
      }));
    },
    []
  );

  const unreadNotifCount = learnerState.notifications.filter((n) => !n.read).length;

  const navItems: {
    id: ActiveView;
    label: string;
    hiLabel: string;
    icon: React.ComponentType<{ className?: string }>;
  }[] = [
    { id: 'catalog', label: 'Home', hiLabel: 'Home', icon: Home },
    { id: 'skills', label: 'Skills', hiLabel: 'Skills', icon: Briefcase },
    { id: 'mcq', label: 'MCQ', hiLabel: 'MCQ', icon: CheckSquare },
    ...(learnerState.apiConfig?.enableOnlineTests !== false
      ? [{ id: 'tests' as ActiveView, label: 'Tests', hiLabel: 'Tests', icon: ClipboardCheck }]
      : []),
    { id: 'hub', label: 'Ideas & Goals', hiLabel: 'Ideas & Goals', icon: Lightbulb },
  ];

  const purchasedK12Subjects = learnerState.courses
    .filter((course): course is K12SubjectCourse => {
      if (course.category !== 'k12') return false;
      const hasPaidUnlock = course.modules.some(
        (m) => !m.isFreePreview && learnerState.unlockedModuleIds.includes(m.id)
      );
      return hasPaidUnlock;
    })
    .map((course) => {
      const subjKey = getSubjectKeyFromCourseId(course.id) || 'chemistry';
      return {
        courseId: course.id,
        k12Class: course.k12Class || '12',
        subjectName: course.subjectName || course.title,
        subjectHindi: course.subjectHindi || course.hindiTitle || course.title,
        mcqTrackId: `k12-subj-${subjKey}`,
      };
    });

  useEffect(() => {
    const syncLatestState = async () => {
      try {
        const res = await fetch('/api/learner-state');
        if (res.ok) {
          const data = await res.json();
          if (data.state) {
            setLearnerState(data.state);
          }
        }
      } catch {
        // Ignore background sync errors
      }
    };
    window.addEventListener('focus', syncLatestState);
    const interval = setInterval(syncLatestState, 8000);
    return () => {
      window.removeEventListener('focus', syncLatestState);
      clearInterval(interval);
    };
  }, []);

  if (showAdminPortal) {
    return (
      <React.Suspense
        fallback={
          <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white font-bold text-sm flex items-center justify-center">
              VS
            </div>
            <p className="text-xs font-semibold text-slate-300">
              Opening Admin Dashboard...
            </p>
          </div>
        }
      >
        <AdminRootApp
          onBackToStudentApp={() => {
            try {
              window.history.pushState({}, '', '/');
            } catch {}
            setShowAdminPortal(false);
            refreshFromServer();
          }}
        />
      </React.Suspense>
    );
  }

  if (showPartnerPortal) {
    return (
      <React.Suspense
        fallback={
          <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white font-bold text-sm flex items-center justify-center">
              VS
            </div>
            <p className="text-xs font-semibold text-slate-300">
              Opening Partner Studio...
            </p>
          </div>
        }
      >
        <PartnerRootApp
          onBackToStudentApp={() => {
            try {
              window.history.pushState({}, '', '/');
            } catch {}
            setShowPartnerPortal(false);
            refreshFromServer();
          }}
        />
      </React.Suspense>
    );
  }

  return (
    <div
      style={{
        fontFamily: learnerState.siteConfig.fontFamily
          ? `${learnerState.siteConfig.fontFamily}, sans-serif`
          : undefined,
      }}
      className="min-h-screen flex flex-col bg-[#F8FAFC] text-slate-900"
    >
      {/* Top Bar Contract: 1-row, 3-zone */}
      <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-sm border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-2 sm:gap-6">
          {/* Zone 1: Brand Wordmark (Silent 15-tap Admin trigger) */}
          <button
            type="button"
            onClick={() => {
              logoTapCountRef.current += 1;
              if (logoTapTimerRef.current) {
                window.clearTimeout(logoTapTimerRef.current);
              }
              if (logoTapCountRef.current >= 15) {
                logoTapCountRef.current = 0;
                openAdminPortal();
                return;
              }
              logoTapTimerRef.current = window.setTimeout(() => {
                logoTapCountRef.current = 0;
              }, 7000);
              setActiveView('catalog');
            }}
            className="inline-flex flex-col items-start justify-center min-w-0 py-1 pr-2 touch-manipulation cursor-pointer select-none leading-none"
          >
            <span
              style={{ backgroundColor: learnerState.siteConfig.primaryColor }}
              className="px-2 py-0.5 rounded-md text-white text-xs sm:text-sm font-extrabold tracking-tight shadow-xs"
            >
              BroSis
            </span>
            <span className="mt-0.5 text-[11px] sm:text-xs font-extrabold tracking-tight text-slate-900 truncate">
              {learnerState.siteConfig.appName}
            </span>
          </button>

          {/* Zone 2: Concise single-line text nav links */}
          <nav
            aria-label="Primary Navigation"
            className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600"
          >
            {navItems.map((item) => {
              const active = activeView === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setActiveView(item.id)}
                  className={`py-1 border-b-2 transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                    active
                      ? 'border-emerald-600 text-slate-900 font-semibold'
                      : 'border-transparent hover:text-slate-900'
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </nav>

          {/* Zone 3: Android/iOS Install + Student Profile + Gmail / Mobile OTP Login */}
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            <PWAInstallButton />
            <button
              type="button"
              onClick={() => setShowProfileModal(true)}
              className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              <User className="w-3.5 h-3.5 text-emerald-600" />
              <span>
                {learnerState.user ? (
                  'Profile'
                ) : (
                  <>
                    <span className="hidden sm:inline">Create </span>Profile
                  </>
                )}
              </span>
            </button>
            <button
              type="button"
              onClick={() => setShowAuthModal(true)}
              className="inline-flex items-center gap-1.5 px-3 sm:px-3.5 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              <UserCheck className="w-3.5 h-3.5" />
              <span className="max-w-[90px] sm:max-w-none truncate">
                {learnerState.user
                  ? learnerState.user.name
                  : 'Login (OTP)'}
              </span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-5 sm:py-8 pb-24 space-y-6">
        {/* Hindi Medium / English Medium Switch + Every-User Notification Bell */}
        <div className="bg-white border border-slate-200 rounded-xl px-4 py-2.5 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-700">
            <Languages className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>
              {medium === 'hi'
                ? 'Medium: Hindi / Hinglish Active'
                : 'Study Medium: English Medium Active'}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <div
              role="group"
              aria-label="Switch Hindi or English Medium"
              className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg"
            >
              <button
                type="button"
                onClick={() => setMedium('hi')}
                className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors whitespace-nowrap cursor-pointer ${
                  medium === 'hi'
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                हिंदी / Hinglish
              </button>
              <button
                type="button"
                onClick={() => setMedium('en')}
                className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors whitespace-nowrap cursor-pointer ${
                  medium === 'en'
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                English Medium
              </button>
            </div>

            <button
              type="button"
              onClick={() => setShowNotifModal(true)}
              aria-label="Open Student Notifications"
              className="relative inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-800 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
            >
              <Bell className="w-4 h-4 text-emerald-600" />
              <span className="hidden sm:inline">Alerts</span>
              {unreadNotifCount > 0 && (
                <span className="px-1.5 py-0.5 text-[10px] font-bold font-mono-tabular bg-emerald-600 text-white rounded-md">
                  {unreadNotifCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Global Search Bar + Back to Home Navigation */}
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          {activeView !== 'catalog' && (
            <button
              type="button"
              onClick={() => setActiveView('catalog')}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold self-start transition-colors cursor-pointer shrink-0"
            >
              <ArrowLeft className="w-4 h-4 text-emerald-400" />
              <span>{medium === 'hi' ? 'वापस होम पर जाएं' : 'Back to Home'}</span>
            </button>
          )}

          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={globalSearchQuery}
              onChange={(e) => setGlobalSearchQuery(e.target.value)}
              placeholder={
                medium === 'hi'
                  ? 'खोजें: Class 10, 11, 12, Chemistry, Physics, Maths, Biology, Test...'
                  : 'Search anything: Class 10, 11, 12, Chemistry, Physics, Maths, Tests...'
              }
              className="w-full pl-10 pr-20 py-2.5 text-xs sm:text-sm bg-white border border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-emerald-600 shadow-xs"
            />
            {globalSearchQuery.trim() && (
              <button
                type="button"
                onClick={() => setGlobalSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-slate-500 hover:text-slate-900 cursor-pointer"
              >
                Clear
              </button>
            )}

            {/* Instant Search Results Dropdown */}
            {globalSearchQuery.trim().length >= 2 && (() => {
              const q = globalSearchQuery.trim().toLowerCase();
              const matchedCourses = learnerState.courses
                .filter(
                  (c) =>
                    c.title.toLowerCase().includes(q) ||
                    (c.hindiTitle && c.hindiTitle.toLowerCase().includes(q)) ||
                    c.categoryLabel.toLowerCase().includes(q) ||
                    c.subtitle.toLowerCase().includes(q)
                )
                .slice(0, 6);
              const matchedTests = learnerState.onlineTests
                .filter(
                  (t) =>
                    t.isPublished &&
                    (t.titleEn.toLowerCase().includes(q) ||
                      t.titleHi.toLowerCase().includes(q) ||
                      t.category.toLowerCase().includes(q))
                )
                .slice(0, 4);

              return (
                <div className="absolute left-0 right-0 mt-1.5 bg-white border border-slate-200 rounded-2xl shadow-lg z-40 max-h-80 overflow-y-auto p-3 space-y-3">
                  {matchedCourses.length === 0 && matchedTests.length === 0 ? (
                    <p className="text-xs text-slate-500 text-center py-3">
                      {medium === 'hi'
                        ? `"${globalSearchQuery}" से जुड़ा कोई विषय या टेस्ट नहीं मिला।`
                        : `No matching subjects, courses, or tests found for "${globalSearchQuery}".`}
                    </p>
                  ) : (
                    <>
                      {matchedCourses.length > 0 && (
                        <div className="space-y-1.5">
                          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-2">
                            Subjects &amp; Courses
                          </p>
                          {matchedCourses.map((c) => (
                            <button
                              key={c.id}
                              type="button"
                              onClick={() => {
                                setGlobalSearchQuery('');
                                setLmsPlayerState({
                                  course: c,
                                  moduleId: c.modules[0]?.id,
                                });
                              }}
                              className="w-full text-left px-3 py-2 rounded-xl hover:bg-emerald-50 flex items-center justify-between gap-2 transition-colors cursor-pointer"
                            >
                              <div className="min-w-0">
                                <p className="text-xs font-bold text-slate-900 truncate">
                                  {medium === 'hi' && c.hindiTitle ? c.hindiTitle : c.title}
                                </p>
                                <p className="text-[11px] text-slate-500">
                                  {c.categoryLabel} • ₹{c.fullPriceInr} · 12 Months
                                </p>
                              </div>
                              <span className="text-[11px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-md shrink-0">
                                Demo / Open
                              </span>
                            </button>
                          ))}
                        </div>
                      )}

                      {matchedTests.length > 0 && (
                        <div className="space-y-1.5 pt-1 border-t border-slate-100">
                          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-2">
                            Online Tests
                          </p>
                          {matchedTests.map((t) => (
                            <button
                              key={t.id}
                              type="button"
                              onClick={() => {
                                setGlobalSearchQuery('');
                                setActiveView('tests');
                              }}
                              className="w-full text-left px-3 py-2 rounded-xl hover:bg-amber-50 flex items-center justify-between gap-2 transition-colors cursor-pointer"
                            >
                              <div className="min-w-0">
                                <p className="text-xs font-bold text-slate-900 truncate">
                                  {medium === 'hi' ? t.titleHi : t.titleEn}
                                </p>
                                <p className="text-[11px] text-slate-500">
                                  {t.category} • {t.durationMins} Mins
                                </p>
                              </div>
                              <span className="text-[11px] font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded-md shrink-0">
                                Open Test
                              </span>
                            </button>
                          ))}
                        </div>
                      )}
                    </>
                  )}
                </div>
              );
            })()}
          </div>
        </div>

        {activeView === 'catalog' && (
          <CourseCatalogView
            courses={learnerState.courses}
            mcqSegments={learnerState.mcqSegments}
            unlockedModuleIds={learnerState.unlockedModuleIds}
            siteConfig={learnerState.siteConfig}
            medium={medium}
            onSelectCourse={(course) => setSelectedCourseForSyllabus(course)}
            onStartMcqSprint={(trackId) => {
              setMcqInitialTrackId(trackId);
              setActiveView('mcq');
            }}
            onWatchLmsVideo={(course, moduleId) =>
              setLmsPlayerState({ course, moduleId })
            }
            onProceedToCheckout={(payload) => setCheckoutPayload(payload)}
            onNavigateView={(view) => setActiveView(view)}
            onSendContactMessage={handleSendContactMessage}
          />
        )}

        {activeView === 'skills' && (
          <SkillsHubView
            courses={learnerState.courses}
            unlockedModuleIds={learnerState.unlockedModuleIds}
            medium={medium}
            onSelectCourse={(course) => setSelectedCourseForSyllabus(course)}
            onStartMcqSprint={(trackId) => {
              setMcqInitialTrackId(trackId);
              setActiveView('mcq');
            }}
            onWatchLmsVideo={(course) => setLmsPlayerState({ course })}
          />
        )}

        {activeView === 'mcq' && (
          <McqSprintView
            segments={learnerState.mcqSegments}
            initialTrackId={mcqInitialTrackId}
            purchasedK12Subjects={purchasedK12Subjects}
            medium={medium}
            onMediumChange={(m) => setMedium(m)}
            onRecordAttempt={handleRecordMcqAttempt}
          />
        )}

        {activeView === 'doubts' && (
          <LiveDoubtsView
            sessions={DOUBT_SESSIONS}
            doubts={learnerState.doubts}
            onSubmitDoubt={handleSubmitDoubt}
            onUpvoteDoubt={handleUpvoteDoubt}
          />
        )}

        {activeView === 'kids' && (
          <KidsArenaView
            challenges={KIDS_CHALLENGES}
            kidsXp={learnerState.kidsXp}
            kidsStars={learnerState.kidsStars}
            kidsStreak={learnerState.kidsStreak}
            unlockedBadges={learnerState.unlockedBadges}
            onEarnXp={handleEarnKidsXp}
          />
        )}

        {activeView === 'dashboard' && (
          <ProgressDashboardView
            courses={learnerState.courses}
            unlockedModuleIds={learnerState.unlockedModuleIds}
            mcqAttempts={learnerState.mcqAttempts}
            receipts={learnerState.receipts}
            streakDays={learnerState.streakDays}
            kidsXp={learnerState.kidsXp}
            medium={medium}
            onSelectCourse={(course) => setSelectedCourseForSyllabus(course)}
            onStartMcqSprint={() => setActiveView('mcq')}
            onWatchLmsVideo={(course) => setLmsPlayerState({ course })}
          />
        )}

        {activeView === 'tests' && (
          <OnlineTestsView
            onlineTests={learnerState.onlineTests}
            testSubmissions={learnerState.testSubmissions}
            purchasedK12Subjects={purchasedK12Subjects}
            user={learnerState.user}
            medium={medium}
            onToggleMedium={() => setMedium((m) => (m === 'hi' ? 'en' : 'hi'))}
            onSubmitTest={handleSubmitOnlineTest}
          />
        )}

        {activeView === 'hub' && (
          <StudentHubView
            user={learnerState.user}
            medium={medium}
            startupIdeas={learnerState.startupIdeas}
            goalConversations={learnerState.goalConversations}
            studentGallery={learnerState.studentGallery}
            onOpenProfileModal={() => setShowProfileModal(true)}
            onAddStartupIdea={handleAddStartupIdea}
            onUpvoteIdea={handleUpvoteIdea}
            onAddGoalConversation={handleAddGoalConversation}
            onReplyGoalConversation={handleReplyGoalConversation}
            onAddGalleryPhoto={handleAddGalleryPhoto}
          />
        )}



        {/* Platform Legal Footer (Silent 15-tap staff portal launcher) */}
        <footer className="mt-12 pt-8 pb-20 border-t border-slate-200 text-xs text-slate-500 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <button
                type="button"
                onClick={() => {
                  partnerTapCountRef.current += 1;
                  if (partnerTapTimerRef.current) {
                    window.clearTimeout(partnerTapTimerRef.current);
                  }
                  if (partnerTapCountRef.current >= 15) {
                    partnerTapCountRef.current = 0;
                    setShowPortalLauncher(true);
                    return;
                  }
                  partnerTapTimerRef.current = window.setTimeout(() => {
                    partnerTapCountRef.current = 0;
                  }, 7000);
                }}
                className="font-bold text-slate-900 text-sm text-left cursor-pointer touch-manipulation select-none py-1"
              >
                Vidya Setu (विद्या सेतु)
              </button>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Class 9–12 School Boards, Competitive Govt Exams, High-Salary AI Skills &amp; Future Kids Foundation.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3 text-xs">
              <button
                type="button"
                onClick={() => {
                  setLegalModalTab('privacy');
                  setShowLegalModal(true);
                }}
                className="font-semibold text-slate-700 hover:text-emerald-700 transition-colors cursor-pointer underline underline-offset-2"
              >
                {medium === 'hi' ? 'गोपनीयता नीति (Privacy Policy)' : 'Privacy Policy'}
              </button>
              <span>•</span>
              <button
                type="button"
                onClick={() => {
                  setLegalModalTab('terms');
                  setShowLegalModal(true);
                }}
                className="font-semibold text-slate-700 hover:text-emerald-700 transition-colors cursor-pointer underline underline-offset-2"
              >
                {medium === 'hi' ? 'नियम व शर्तें (Terms & Conditions)' : 'Terms & Conditions'}
              </button>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-[11px] text-slate-400 pt-3 border-t border-slate-100">
            <p>
              © {new Date().getFullYear()} Vidya Setu Education Pvt. Ltd. All rights reserved. 12 Months LMS Access guarantee.
            </p>
            <p>
              Verified Mentors &amp; 12 Months LMS Video Access
            </p>
          </div>
        </footer>
      </main>

      {/* Fixed Bottom Mini Bar with English Titles */}
      <nav
        aria-label="Bottom Mini Bar"
        className="fixed bottom-0 inset-x-0 z-30 bg-white border-t border-slate-200 h-16"
      >
        <div
          className={`max-w-4xl mx-auto h-full px-1 sm:px-4 grid items-center ${
            navItems.length === 4 ? 'grid-cols-4' : 'grid-cols-5'
          }`}
        >
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = activeView === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setActiveView(item.id)}
                className={`flex flex-col items-center justify-center gap-1 py-1.5 rounded-xl transition-colors cursor-pointer ${
                  active
                    ? 'text-emerald-600 font-bold'
                    : 'text-slate-500 hover:text-slate-900 font-medium'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="text-[10px] sm:text-[11px] leading-none whitespace-nowrap">
                  {item.label}
                </span>
              </button>
            );
          })}
        </div>
      </nav>

      {/* Partial / Full Course Syllabus Modal */}
      {selectedCourseForSyllabus && (
        <CourseSyllabusModal
          course={selectedCourseForSyllabus}
          unlockedModuleIds={learnerState.unlockedModuleIds}
          onClose={() => setSelectedCourseForSyllabus(null)}
          onProceedToCheckout={(params) => {
            setSelectedCourseForSyllabus(null);
            setCheckoutPayload(params);
          }}
          onLaunchMcqForCourse={(courseId) => {
            setSelectedCourseForSyllabus(null);
            setMcqInitialTrackId(courseId);
            setActiveView('mcq');
          }}
          onWatchLmsVideo={(course, moduleId) => {
            setSelectedCourseForSyllabus(null);
            setLmsPlayerState({ course, moduleId });
          }}
        />
      )}

      {/* Protected LMS Video Player Modal (12 Months Access, No Download/Share, >2 Viewers = 2-Min Lock) */}
      {lmsPlayerState && (
        <LmsVideoPlayerModal
          course={lmsPlayerState.course}
          unlockedModuleIds={learnerState.unlockedModuleIds}
          initialModuleId={lmsPlayerState.moduleId}
          medium={medium}
          onClose={() => setLmsPlayerState(null)}
          onUnlockMoreModules={() => {
            const c = lmsPlayerState.course;
            setLmsPlayerState(null);
            setSelectedCourseForSyllabus(c);
          }}
        />
      )}

      {/* Integrated Payment Gateway Modal */}
      {checkoutPayload && (
        <PaymentGatewayModal
          course={checkoutPayload.course}
          purchaseType={checkoutPayload.purchaseType}
          selectedModules={checkoutPayload.selectedModules}
          baseAmountInr={checkoutPayload.finalAmountInr}
          bankAccount={learnerState.bankAccount}
          user={learnerState.user}
          onClose={() => setCheckoutPayload(null)}
          onCompletePurchase={handleCompletePurchase}
        />
      )}

      {/* Student Profile Create & Edit Modal */}
      {showProfileModal && (
        <StudentProfileModal
          user={learnerState.user}
          medium={medium}
          unlockedCount={learnerState.unlockedModuleIds.length}
          testsTakenCount={learnerState.testSubmissions.length}
          receipts={learnerState.receipts}
          courses={learnerState.courses}
          unlockedModuleIds={learnerState.unlockedModuleIds}
          onClose={() => setShowProfileModal(false)}
          onSaveProfile={handleSaveProfile}
          onLogout={handleLogout}
        />
      )}

      {/* Gmail ID & Mobile Number OTP Login Modal */}
      {showAuthModal && (
        <AuthLoginModal
          user={learnerState.user}
          medium={medium}
          onClose={() => setShowAuthModal(false)}
          onLogin={handleLogin}
          onLogout={handleLogout}
        />
      )}

      {/* Every-User Notification Center & Broadcast Modal */}
      {showNotifModal && (
        <NotificationModal
          notifications={learnerState.notifications}
          medium={medium}
          onClose={() => setShowNotifModal(false)}
          onMarkAllRead={handleMarkAllNotificationsRead}
          onSendBroadcast={handleSendBroadcast}
        />
      )}

      {/* Legal Policies Modal (Privacy Policy & Terms and Conditions) */}
      <LegalPolicyModal
        isOpen={showLegalModal}
        onClose={() => setShowLegalModal(false)}
        medium={medium}
        initialTab={legalModalTab}
        privacyText={learnerState.siteConfig.privacyPolicyText}
        termsText={learnerState.siteConfig.termsAndConditionsText}
        lastUpdated={learnerState.siteConfig.legalLastUpdated}
      />

      <StudentAiChatbot
        user={learnerState.user}
        medium={medium}
        purchasedSubjects={purchasedK12Subjects.map(
          (s) => `Class ${s.k12Class} ${s.subjectName}`
        )}
      />

      <OfflineIndicator />

      {/* Hidden Staff Portal Switcher Modal */}
      {showPortalLauncher && (
        <div
          className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-xs flex items-center justify-center p-4"
          onClick={() => setShowPortalLauncher(false)}
        >
          <div
            className="bg-slate-900 text-white border border-slate-800 rounded-2xl max-w-sm w-full p-6 space-y-4 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div>
              <p className="text-[11px] font-bold uppercase tracking-wider text-emerald-400">
                Staff &amp; Owner Access
              </p>
              <h3 className="text-lg font-bold mt-0.5">Select Portal</h3>
              <p className="text-xs text-slate-300 mt-1">
                Open the Master Admin Dashboard or Teacher Partner Studio.
              </p>
            </div>
            <div className="space-y-2.5">
              <button
                type="button"
                onClick={openAdminPortal}
                className="w-full py-3 px-4 text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl transition-colors cursor-pointer"
              >
                Open Admin Dashboard
              </button>
              <button
                type="button"
                onClick={openPartnerPortal}
                className="w-full py-3 px-4 text-sm font-bold text-indigo-200 bg-indigo-950/80 hover:bg-indigo-900 border border-indigo-700/60 rounded-xl transition-colors cursor-pointer"
              >
                Open Teacher Partner Studio
              </button>
              <button
                type="button"
                onClick={() => setShowPortalLauncher(false)}
                className="w-full py-2 text-xs font-semibold text-slate-400 hover:text-white cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
