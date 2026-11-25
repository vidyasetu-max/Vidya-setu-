import React, { useState, useEffect } from 'react';
import {
  GraduationCap,
  Upload,
  CheckCircle2,
  Clock,
  IndianRupee,
  BookOpen,
  Image as ImageIcon,
  Video,
  FileText,
  Plus,
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  Sparkles,
  Layers,
  XCircle,
  Eye,
  Menu,
  ChevronDown,
  Building,
  CreditCard,
  QrCode,
  Check,
  Copy,
  LogOut,
  Users,
  TrendingUp,
  AlertCircle,
  Bell,
  Download,
  FileSpreadsheet,
  Printer,
  Edit3,
  Camera,
  Search,
  LayoutDashboard,
  X,
  UserCheck,
} from 'lucide-react';
import {
  CourseCategory,
  CourseModule,
  LearnerState,
  TeacherPartnerCourse,
  TeacherPartnerProfile,
  TeacherBankAccountDetails,
  PartnerPayoutRecord,
  PartnerNotification,
} from '../types/education';
import { PortalAuthCard } from './PortalAuthCard';
import { PartnerRoyaltyChart } from './PartnerRoyaltyChart';

const DEFAULT_FALLBACK_IMAGE =
  '/src/assets/images/hero_learning_studio_1793856674745.jpg';

const PRESET_FACULTY_AVATARS = [
  {
    label: 'Studio Mentor',
    url: '/src/assets/images/hero_learning_studio_1793856674745.jpg',
  },
  {
    label: 'Exam Specialist',
    url: '/src/assets/images/track_competitive_exams_1793856674843.jpg',
  },
  {
    label: 'Tech Faculty',
    url: '/src/assets/images/track_digital_skills_1793856675081.jpg',
  },
  {
    label: 'Foundation Track',
    url: '/src/assets/images/track_kids_gamification_1793856675358.jpg',
  },
];

interface PartnerStandaloneAppProps {
  learnerState: LearnerState;
  onBackToStudentApp: () => void;
  onSyncState?: () => Promise<void>;
}

type PartnerSection =
  | 'dashboard'
  | 'payout-report'
  | 'notifications'
  | 'bank-account'
  | 'create-course'
  | 'my-courses'
  | 'profile';

const POPULAR_BANKS = [
  'State Bank of India (SBI)',
  'HDFC Bank',
  'ICICI Bank',
  'Punjab National Bank (PNB)',
  'Axis Bank',
  'Bank of Baroda (BOB)',
  'Kotak Mahindra Bank',
  'Canara Bank',
  'Union Bank of India',
  'Bank of India',
  'IndusInd Bank',
  'Federal Bank',
  'Other Scheduled Bank',
];

export const PartnerStandaloneApp: React.FC<PartnerStandaloneAppProps> = ({
  learnerState,
  onBackToStudentApp,
  onSyncState,
}) => {
  // 1. Authentication State
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    try {
      return sessionStorage.getItem('vidyasetu_partner_logged_in') === 'true';
    } catch {
      return false;
    }
  });

  const [activeTeacher, setActiveTeacher] = useState<TeacherPartnerProfile>(() => {
    try {
      const stored = sessionStorage.getItem('vidyasetu_active_partner');
      if (stored) return JSON.parse(stored);
    } catch {}
    return (
      learnerState.teacherPartners?.[0] || {
        id: 'teacher-2',
        name: 'Dr. Priya Nair',
        email: 'priya.nair@vidyasetu.in',
        phone: '+91 98223 45678',
        avatarUrl: '/src/assets/images/track_competitive_exams_1793856674843.jpg',
        qualification: 'M.Sc., Ph.D. Physics (Gold Medalist), B.Ed',
        subjectExpertise: 'Class 11 & 12 Physics, IIT-JEE Foundation',
        subject: 'Physics (Class 11–12 & Boards)',
        experienceYears: 11,
        experience: '11+ Years',
        bio: 'Specialist in 3D concept visualizations, Gauss law derivations, electrodynamics, and board exam numerical techniques.',
        upiId: 'priyanair@axisbank',
        bankAccount: {
          accountHolderName: 'Dr. Priya Nair',
          bankName: 'Axis Bank',
          accountNumber: '918020049281924',
          ifscCode: 'UTIB0000492',
          branchName: 'Indiranagar, Bengaluru',
          accountType: 'Savings',
          upiId: 'priyanair@axisbank',
          isVerified: true,
          updatedAt: '2026-10-20',
        },
        isApproved: true,
        registeredAt: '2026-10-20',
        coursesCount: 2,
        totalStudents: 620,
        totalEarningsInr: 124000,
      }
    );
  });

  // 2. Navigation & Admin-Matched Drawer State
  const [section, setSection] = useState<PartnerSection>('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(() =>
    typeof window !== 'undefined' ? window.innerWidth >= 1024 : true
  );
  const [showHeaderActions, setShowHeaderActions] = useState(false);
  const [expandedGroups, setExpandedGroups] = useState<{ [key: string]: boolean }>({
    overview: true,
    studio: true,
    finance: true,
    profileGroup: true,
  });
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const toggleGroup = (key: string) => {
    setExpandedGroups((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const navigateToSection = (next: PartnerSection) => {
    setSection(next);
    if (typeof window !== 'undefined' && window.innerWidth < 1024) {
      setIsSidebarOpen(false);
    }
  };

  const partnerRoyaltyPct =
    typeof activeTeacher.royaltyPercent === 'number'
      ? activeTeacher.royaltyPercent
      : typeof learnerState.siteConfig?.defaultPartnerRoyaltyPct === 'number'
        ? learnerState.siteConfig.defaultPartnerRoyaltyPct
        : 80;
  const platformFeePct = Math.max(0, Math.round((100 - partnerRoyaltyPct) * 10) / 10);

  const getSectionLabel = (sec: PartnerSection): string => {
    switch (sec) {
      case 'dashboard':
        return 'Executive Dashboard';
      case 'payout-report':
        return `Payout Report (${partnerRoyaltyPct}% Royalty)`;
      case 'notifications':
        return 'Partner Notifications';
      case 'bank-account':
        return 'Bank Account & UPI Settlement';
      case 'create-course':
        return 'Course Creation Studio';
      case 'my-courses':
        return 'Course Submissions & Approval Tracker';
      case 'profile':
        return 'Edit Faculty Profile & Bio';
      default:
        return 'Partner Portal';
    }
  };

  // 3. Bank Account Form State
  const [bankForm, setBankForm] = useState<TeacherBankAccountDetails>(() => {
    if (activeTeacher.bankAccount) {
      return activeTeacher.bankAccount;
    }
    return {
      accountHolderName: activeTeacher.name || '',
      bankName: 'State Bank of India (SBI)',
      accountNumber: '',
      ifscCode: '',
      branchName: '',
      accountType: 'Savings',
      upiId: activeTeacher.upiId || '',
      qrCodeUrl: '',
      isVerified: true,
    };
  });
  const [confirmAccNo, setConfirmAccNo] = useState(
    activeTeacher.bankAccount?.accountNumber || ''
  );
  const [isSavingBank, setIsSavingBank] = useState(false);
  const [copiedBankField, setCopiedBankField] = useState<string | null>(null);

  useEffect(() => {
    if (activeTeacher.bankAccount) {
      setBankForm(activeTeacher.bankAccount);
      setConfirmAccNo(activeTeacher.bankAccount.accountNumber || '');
    }
  }, [activeTeacher]);

  // 4. Course Creation Studio State
  const [courseTitle, setCourseTitle] = useState('');
  const [courseHindiTitle, setCourseHindiTitle] = useState('');
  const [courseSubtitle, setCourseSubtitle] = useState('');
  const [courseCategory, setCourseCategory] = useState<CourseCategory>('k12');
  const [k12Class, setK12Class] = useState<string>('12');
  const [k12Stream, setK12Stream] = useState<string>('pcm');
  const [coursePrice, setCoursePrice] = useState<number>(699);
  const [courseOriginalPrice] = useState<number>(1999);
  const [courseThumbnail, setCourseThumbnail] = useState<string>(
    DEFAULT_FALLBACK_IMAGE
  );
  const [selectedModIdx, setSelectedModIdx] = useState<number>(0);
  const [isSubmittingCourse, setIsSubmittingCourse] = useState(false);
  const [courseSubmitError, setCourseSubmitError] = useState<string | null>(null);

  const [modules, setModules] = useState<CourseModule[]>(() => {
    const list: CourseModule[] = [];
    for (let i = 1; i <= 30; i++) {
      list.push({
        id: `pmod-${Date.now()}-${i}`,
        chapterNumber: i,
        title: `${String(i).padStart(2, '0')}. Chapter ${i}: Theory & Conceptual Foundation`,
        durationMins: 45,
        mcqCount: 20,
        priceInr: 49,
        isFreePreview: i === 1,
        keyTopics: [
          'Core Theory Derivation',
          'Important Rules',
          'Board Solved Examples',
        ],
        pdfPolicy: 'downloadable',
        videoUrl:
          'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
      });
    }
    return list;
  });

  // 5. Partner Submissions State
  const [partnerSubmissions, setPartnerSubmissions] = useState<
    TeacherPartnerCourse[]
  >(() => learnerState.teacherPendingCourses || []);

  useEffect(() => {
    setPartnerSubmissions(learnerState.teacherPendingCourses || []);
    const matched = (learnerState.teacherPartners || []).find(
      (t) => t.id === activeTeacher.id
    );
    if (matched) {
      setActiveTeacher((prev) => ({ ...prev, ...matched }));
    }
  }, [learnerState.teacherPendingCourses, learnerState.teacherPartners]);

  // 6. Payout Report State
  const [payoutStatusFilter, setPayoutStatusFilter] = useState<
    'all' | 'Paid' | 'Processing' | 'Pending Settlement'
  >('all');
  const [payoutSearch, setPayoutSearch] = useState('');
  const [selectedPayoutSlip, setSelectedPayoutSlip] =
    useState<PartnerPayoutRecord | null>(null);

  // 7. Partner Notifications State
  const [notifCategoryFilter, setNotifCategoryFilter] = useState<
    'all' | PartnerNotification['category']
  >('all');
  const [localReadIds, setLocalReadIds] = useState<string[]>([]);

  // 8. Partner Profile Editor State
  const [profileForm, setProfileForm] = useState({
    name: activeTeacher.name || '',
    email: activeTeacher.email || '',
    phone: activeTeacher.phone || '',
    avatarUrl:
      activeTeacher.avatarUrl ||
      activeTeacher.photoUrl ||
      DEFAULT_FALLBACK_IMAGE,
    qualification: activeTeacher.qualification || '',
    subjectExpertise:
      activeTeacher.subjectExpertise || activeTeacher.subject || '',
    experienceYears: Number(activeTeacher.experienceYears) || 5,
    bio: activeTeacher.bio || '',
    upiId: activeTeacher.upiId || '',
  });
  const [isSavingProfile, setIsSavingProfile] = useState(false);

  useEffect(() => {
    setProfileForm({
      name: activeTeacher.name || '',
      email: activeTeacher.email || '',
      phone: activeTeacher.phone || '',
      avatarUrl:
        activeTeacher.avatarUrl ||
        activeTeacher.photoUrl ||
        DEFAULT_FALLBACK_IMAGE,
      qualification: activeTeacher.qualification || '',
      subjectExpertise:
        activeTeacher.subjectExpertise || activeTeacher.subject || '',
      experienceYears: Number(activeTeacher.experienceYears) || 5,
      bio: activeTeacher.bio || '',
      upiId: activeTeacher.upiId || '',
    });
  }, [activeTeacher.id]);

  const handlePartnerAuthSuccess = async (
    teacher?: TeacherPartnerProfile
  ) => {
    const resolvedTeacher = teacher || activeTeacher;
    setActiveTeacher(resolvedTeacher);
    setIsLoggedIn(true);
    try {
      sessionStorage.setItem('vidyasetu_partner_logged_in', 'true');
      sessionStorage.setItem(
        'vidyasetu_active_partner',
        JSON.stringify(resolvedTeacher)
      );
    } catch {}
    if (onSyncState) {
      await onSyncState();
    }
    showToast(`Welcome, ${resolvedTeacher.name}!`);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    try {
      sessionStorage.removeItem('vidyasetu_partner_logged_in');
      sessionStorage.removeItem('vidyasetu_active_partner');
    } catch {}
    showToast('Logged out of Partner Portal');
  };

  // Bank Form Submission
  const handleSaveBankAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!bankForm.accountHolderName.trim()) {
      showToast('Please enter the Account Holder Name');
      return;
    }
    if (!bankForm.accountNumber.trim()) {
      showToast('Please enter the Account Number');
      return;
    }
    if (bankForm.accountNumber.trim() !== confirmAccNo.trim()) {
      showToast('Account Numbers do not match! Please verify.');
      return;
    }
    const cleanIfsc = bankForm.ifscCode.trim().toUpperCase();
    if (cleanIfsc.length !== 11) {
      showToast('IFSC Code must be exactly 11 characters (e.g. SBIN0001234)');
      return;
    }

    setIsSavingBank(true);
    const updatedBank: TeacherBankAccountDetails = {
      ...bankForm,
      accountHolderName: bankForm.accountHolderName.trim(),
      bankName: bankForm.bankName.trim(),
      accountNumber: bankForm.accountNumber.trim(),
      ifscCode: cleanIfsc,
      branchName: bankForm.branchName?.trim() || '',
      accountType: bankForm.accountType || 'Savings',
      upiId: bankForm.upiId?.trim() || activeTeacher.upiId,
      qrCodeUrl: bankForm.qrCodeUrl || '',
      isVerified: true,
      updatedAt: new Date().toISOString().slice(0, 10),
    };

    try {
      const res = await fetch('/api/partner/bank-account', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          teacherId: activeTeacher.id,
          bankAccount: updatedBank,
        }),
      });
      if (res.ok) {
        const updatedTeacherProfile: TeacherPartnerProfile = {
          ...activeTeacher,
          upiId: updatedBank.upiId || activeTeacher.upiId,
          bankAccount: updatedBank,
        };
        setActiveTeacher(updatedTeacherProfile);
        try {
          sessionStorage.setItem(
            'vidyasetu_active_partner',
            JSON.stringify(updatedTeacherProfile)
          );
        } catch {}
        if (onSyncState) await onSyncState();
        showToast('Bank Account & UPI details saved!');
      } else {
        showToast('Saved locally in session');
      }
    } catch {
      showToast('Saved locally in session');
    } finally {
      setIsSavingBank(false);
    }
  };

  // QR Code Image Upload Handler
  const handleQrUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setBankForm((prev) => ({
          ...prev,
          qrCodeUrl: reader.result as string,
        }));
        showToast('UPI QR Code uploaded and attached!');
      }
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  // Video and PDF uploaders
  const handleModuleVideoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    const tempVideo = document.createElement('video');
    tempVideo.preload = 'metadata';
    tempVideo.onloadedmetadata = () => {
      const durationMins = Math.max(1, Math.round(tempVideo.duration / 60));
      setModules((prev) =>
        prev.map((m, idx) =>
          idx === selectedModIdx
            ? { ...m, videoUrl: url, videoFileName: file.name, durationMins }
            : m
        )
      );
    };
    tempVideo.src = url;
    setModules((prev) =>
      prev.map((m, idx) =>
        idx === selectedModIdx
          ? { ...m, videoUrl: url, videoFileName: file.name }
          : m
      )
    );
    showToast(`Video "${file.name}" attached to Chapter ${selectedModIdx + 1}!`);
  };

  const handleModulePdfUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl =
        typeof reader.result === 'string'
          ? reader.result
          : URL.createObjectURL(file);
      setModules((prev) =>
        prev.map((m, idx) =>
          idx === selectedModIdx
            ? {
                ...m,
                pdfUrl: dataUrl,
                pdfFileName: file.name,
                pdfPolicy: m.pdfPolicy || 'downloadable',
              }
            : m
        )
      );
      showToast(`PDF "${file.name}" attached to Chapter ${selectedModIdx + 1}!`);
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  // Course Submission Handler
  const handleCourseSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setCourseSubmitError(null);
    if (!courseTitle.trim()) {
      const msg = 'Please provide a Course Heading (English)';
      setCourseSubmitError(msg);
      showToast(msg);
      return;
    }

    setIsSubmittingCourse(true);
    const cleanModules = modules.map((m, idx) => ({
      ...m,
      chapterNumber: m.chapterNumber || idx + 1,
      videoUrl:
        m.videoUrl && m.videoUrl.trim() !== ''
          ? m.videoUrl
          : 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    }));

    const newSubmission: TeacherPartnerCourse = {
      id: `tpc-${Date.now()}`,
      teacherId: activeTeacher.id,
      teacherName: activeTeacher.name,
      teacherAvatar: activeTeacher.avatarUrl || activeTeacher.photoUrl,
      teacherProfile: activeTeacher,
      teacherBankAccount: activeTeacher.bankAccount || bankForm,
      title: courseTitle.trim(),
      hindiTitle: courseHindiTitle.trim() || courseTitle.trim(),
      subtitle:
        courseSubtitle.trim() ||
        'Comprehensive modular course syllabus by verified faculty.',
      category: courseCategory,
      categoryLabel:
        courseCategory === 'k12'
          ? `Class ${k12Class} • ${k12Stream?.toUpperCase() || 'General'}`
          : courseCategory === 'competitive'
            ? 'UPSC / SSC / Govt Exam'
            : 'High-Salary Skill',
      k12Class: courseCategory === 'k12' ? k12Class : undefined,
      k12Stream: courseCategory === 'k12' ? k12Stream : undefined,
      fullPriceInr: Number(coursePrice) || 699,
      originalPriceInr: Number(courseOriginalPrice) || 1999,
      priceInr: Number(coursePrice) || 699,
      imageUrl: courseThumbnail || DEFAULT_FALLBACK_IMAGE,
      modules: cleanModules,
      status: 'pending_approval',
      submittedAt: new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      }),
    };

    try {
      const res = await fetch('/api/partner/courses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newSubmission),
      });
      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData?.error || `Server error (${res.status})`);
      }
      const data = await res.json();
      const savedCourse: TeacherPartnerCourse = data?.course || newSubmission;
      setPartnerSubmissions((prev) => [
        savedCourse,
        ...prev.filter((item) => item.id !== savedCourse.id),
      ]);
      setCourseTitle('');
      setCourseHindiTitle('');
      setCourseSubtitle('');
      setSection('my-courses');
      showToast('Course submitted for Admin review!');
      if (onSyncState) await onSyncState();
    } catch (err) {
      const msg =
        err instanceof Error
          ? err.message
          : 'Network error submitting course. Please retry.';
      setCourseSubmitError(msg);
      showToast(msg);
    } finally {
      setIsSubmittingCourse(false);
    }
  };

  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard?.writeText(text);
    setCopiedBankField(field);
    setTimeout(() => setCopiedBankField(null), 2000);
  };

  // Profile Photo Upload Handler
  const handleProfileAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setProfileForm((prev) => ({
          ...prev,
          avatarUrl: reader.result as string,
        }));
        showToast('Photo ready — save profile changes to publish.');
      }
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  // Save Partner Profile Handler
  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profileForm.name.trim() || !profileForm.qualification.trim()) {
      showToast('Name and Qualification are required');
      return;
    }
    setIsSavingProfile(true);
    try {
      const res = await fetch('/api/partner/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: activeTeacher.id,
          ...profileForm,
          subject: profileForm.subjectExpertise,
          photoUrl: profileForm.avatarUrl,
          experience: `${profileForm.experienceYears}+ Years`,
        }),
      });
      const updatedTeacher: TeacherPartnerProfile = {
        ...activeTeacher,
        ...profileForm,
        photoUrl: profileForm.avatarUrl,
        subject: profileForm.subjectExpertise,
        experience: `${profileForm.experienceYears}+ Years`,
      };
      setActiveTeacher(updatedTeacher);
      try {
        sessionStorage.setItem(
          'vidyasetu_active_partner',
          JSON.stringify(updatedTeacher)
        );
      } catch {}
      if (res.ok && onSyncState) {
        await onSyncState();
      }
      showToast('Partner profile updated and synced!');
    } catch {
      showToast('Saved profile updates locally');
    } finally {
      setIsSavingProfile(false);
    }
  };

  // Computed Partner Payouts & Notifications for Active Teacher
  const teacherPayouts: PartnerPayoutRecord[] = (
    learnerState.partnerPayouts || []
  ).filter((p) => p.teacherId === activeTeacher.id);

  const filteredPayouts = teacherPayouts.filter((p) => {
    const matchStatus =
      payoutStatusFilter === 'all' || p.status === payoutStatusFilter;
    const q = payoutSearch.trim().toLowerCase();
    const matchSearch =
      !q ||
      p.courseTitle.toLowerCase().includes(q) ||
      p.referenceId.toLowerCase().includes(q) ||
      (p.studentName || '').toLowerCase().includes(q) ||
      p.periodLabel.toLowerCase().includes(q);
    return matchStatus && matchSearch;
  });

  const payoutTotals = teacherPayouts.reduce(
    (acc, p) => {
      acc.gross += p.grossAmountInr;
      acc.platform += p.platformFeeInr;
      acc.partner += p.partnerShareInr;
      if (p.status === 'Paid') acc.paid += p.partnerShareInr;
      else acc.pending += p.partnerShareInr;
      return acc;
    },
    { gross: 0, platform: 0, partner: 0, paid: 0, pending: 0 }
  );

  const teacherNotifications: PartnerNotification[] = (
    learnerState.partnerNotifications || []
  ).filter((n) => n.teacherId === 'all' || n.teacherId === activeTeacher.id);

  const isNotifRead = (n: PartnerNotification) =>
    n.readByTeacherIds.includes(activeTeacher.id) ||
    localReadIds.includes(n.id);

  const unreadPartnerNotifCount = teacherNotifications.filter(
    (n) => !isNotifRead(n)
  ).length;

  const filteredNotifications = teacherNotifications.filter(
    (n) => notifCategoryFilter === 'all' || n.category === notifCategoryFilter
  );

  const handleMarkNotificationsRead = async (notificationId?: string) => {
    if (notificationId) {
      setLocalReadIds((prev) => Array.from(new Set([...prev, notificationId])));
    } else {
      setLocalReadIds(teacherNotifications.map((n) => n.id));
    }
    try {
      await fetch('/api/partner/notifications/read', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ teacherId: activeTeacher.id, notificationId }),
      });
      if (onSyncState) await onSyncState();
    } catch {}
  };

  const handleExportPayoutCsv = () => {
    const headers = [
      'Payout ID',
      'Period',
      'Course Title',
      'Student / Batch',
      'Gross Revenue (INR)',
      `Platform Share ${platformFeePct}% (INR)`,
      `Partner Payout ${partnerRoyaltyPct}% (INR)`,
      'Royalty %',
      'Method',
      'Reference / UTR',
      'Status',
      'Date',
      'Destination',
    ];
    const rows = filteredPayouts.map((p) => [
      p.id,
      p.periodLabel,
      `"${p.courseTitle.replace(/"/g, '""')}"`,
      `"${(p.studentName || '').replace(/"/g, '""')}"`,
      p.grossAmountInr,
      p.platformFeeInr,
      p.partnerShareInr,
      `${p.royaltyPct ?? partnerRoyaltyPct}%`,
      p.payoutMethod,
      p.referenceId,
      p.status,
      p.paidAt,
      `"${(p.settledTo || '').replace(/"/g, '""')}"`,
    ]);
    const csv =
      '\uFEFF' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute(
      'download',
      `vidyasetu-partner-payout-${activeTeacher.id}-${new Date().toISOString().slice(0, 10)}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    showToast('Partner Payout CSV downloaded!');
  };

  const brandName = learnerState.siteConfig?.appName || 'Vidya Setu';
  const brandInitials = learnerState.siteConfig?.brandInitials || 'VS';

  // Combine pending/rejected submissions with Admin-approved live courses for this partner
  const approvedLiveSubmissions: TeacherPartnerCourse[] = (learnerState.courses || [])
    .filter(
      (c: any) =>
        c.isTeacherPartner &&
        (c.teacherId === activeTeacher.id ||
          c.instructor?.toLowerCase() === activeTeacher.name?.toLowerCase())
    )
    .map((c: any) => ({
      id: c.id,
      teacherId: c.teacherId || activeTeacher.id,
      teacherName: c.instructor || activeTeacher.name,
      teacherAvatar: c.teacherAvatar || activeTeacher.avatarUrl,
      title: c.title,
      hindiTitle: c.hindiTitle,
      subtitle: c.subtitle,
      category: c.category,
      categoryLabel: c.categoryLabel,
      k12Class: c.k12Class,
      k12Stream: c.k12Stream,
      fullPriceInr: c.fullPriceInr,
      originalPriceInr: c.originalPriceInr,
      priceInr: c.fullPriceInr,
      imageUrl: c.imageUrl,
      modules: c.modules || [],
      status: 'approved' as const,
      submittedAt: c.enrolledCount || 'Live',
    }));

  const approvedNormalizedIds = new Set(
    approvedLiveSubmissions.map((c) => String(c.id).replace(/^course-/, ''))
  );

  const pendingOrRejectedForTeacher = partnerSubmissions.filter((sub) => {
    const belongsToTeacher =
      !sub.teacherId ||
      sub.teacherId === activeTeacher.id ||
      sub.teacherName?.toLowerCase() === activeTeacher.name?.toLowerCase();
    const normId = String(sub.id).replace(/^course-/, '');
    return belongsToTeacher && !approvedNormalizedIds.has(normId);
  });

  const allTrackedCourses: TeacherPartnerCourse[] = [
    ...pendingOrRejectedForTeacher,
    ...approvedLiveSubmissions,
  ];
  const pendingReviewCount = pendingOrRejectedForTeacher.filter(
    (c) => c.status !== 'rejected'
  ).length;

  // Dedicated Standalone Partner Auth Gate (Mobile OTP Login, Password Login, Signup, Forgot Password)
  if (!isLoggedIn) {
    return (
      <PortalAuthCard
        portal="partner"
        brandName={brandName}
        onAuthSuccess={async (payload) => {
          await handlePartnerAuthSuccess(payload.teacher);
        }}
        onBackToStudentApp={onBackToStudentApp}
      />
    );
  }

  const activeModule = modules[selectedModIdx] || modules[0];

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 flex flex-col">
      {/* Partner Top Bar (Exact Admin Standard: Header buttons hidden by default; tap title to toggle) */}
      <header className="sticky top-0 z-30 bg-slate-950 text-white border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            {/* 3-Bar Hamburger Menu Toggle Button */}
            <button
              type="button"
              onClick={() => setIsSidebarOpen((prev) => !prev)}
              className="p-2 -ml-2 rounded-xl text-slate-200 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer flex items-center gap-1.5 focus:outline-none focus:ring-2 focus:ring-emerald-500 shrink-0"
              title={isSidebarOpen ? 'Close LHS Menu' : 'Open LHS Menu (3 Bars)'}
              aria-label="Toggle Navigation Drawer"
            >
              <Menu className="w-5 h-5 text-emerald-400" />
              <span className="text-xs font-bold hidden sm:inline text-slate-300">
                {isSidebarOpen ? 'Hide Menu' : 'Menu'}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setShowHeaderActions((prev) => !prev)}
              title="Tap to show or hide header quick buttons"
              className="inline-flex flex-col items-start justify-center text-left min-w-0 cursor-pointer leading-none py-0.5"
            >
              <span className="px-2 py-0.5 rounded-md bg-emerald-600 text-white text-xs font-extrabold tracking-tight">
                BroSis
              </span>
              <span className="mt-0.5 text-[11px] sm:text-xs font-bold text-slate-200 truncate">
                {brandName} — Partner
              </span>
            </button>
          </div>

          {showHeaderActions && (
            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={() => navigateToSection('notifications')}
                title="Partner Notifications"
                className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-bold bg-slate-800 hover:bg-slate-700 text-amber-300 rounded-xl transition-colors cursor-pointer whitespace-nowrap shrink-0"
              >
                <Bell className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Alerts</span>
                {unreadPartnerNotifCount > 0 && (
                  <span className="font-mono tabular-nums text-emerald-400">
                    ({unreadPartnerNotifCount})
                  </span>
                )}
              </button>
              <button
                type="button"
                onClick={handleExportPayoutCsv}
                title={`Export ${partnerRoyaltyPct}% Payout CSV Report`}
                className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl transition-colors cursor-pointer shadow-sm whitespace-nowrap shrink-0"
              >
                <Download className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Payout CSV</span>
              </button>
              <button
                type="button"
                onClick={onBackToStudentApp}
                className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-white rounded-xl transition-colors cursor-pointer whitespace-nowrap shrink-0"
              >
                <ExternalLink className="w-3.5 h-3.5 text-emerald-400" />
                <span className="hidden sm:inline">Student App</span>
              </button>
              <button
                type="button"
                onClick={handleLogout}
                className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold bg-rose-600/20 hover:bg-rose-600/30 text-rose-300 rounded-xl transition-colors cursor-pointer whitespace-nowrap shrink-0"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          )}
        </div>
      </header>

      {/* App Body with LHS Sidebar Drawer and Main Workspace */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Mobile Backdrop when LHS Drawer is open */}
        {isSidebarOpen && (
          <div
            className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs z-30 lg:hidden"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}

        {/* Collapsible Left Hand Side (LHS) Sidebar Drawer (Matches Admin CMS Drawer) */}
        <aside
          className={`
            fixed inset-y-0 left-0 z-40 lg:static lg:z-auto
            w-72 bg-white border-r border-slate-200 flex flex-col shrink-0
            transition-all duration-200 ease-in-out shadow-2xl lg:shadow-none
            ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:-ml-72'}
          `}
        >
          {/* Sidebar Drawer Header */}
          <div className="p-3.5 border-b border-slate-200 flex items-center justify-between bg-slate-900 text-white">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-emerald-600 flex items-center justify-center font-bold text-white text-xs">
                {brandInitials}
              </div>
              <div>
                <h3 className="text-xs font-bold leading-tight">
                  Partner CMS Navigation
                </h3>
                <p className="text-[10px] text-slate-400">
                  LHS Drop-down Categories
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setIsSidebarOpen(false)}
              className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
              title="Close Drawer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Active Faculty Identity Strip */}
          <div className="px-3.5 py-2.5 bg-slate-50 border-b border-slate-200 flex items-center gap-2.5 shrink-0">
            <img
              src={
                activeTeacher.avatarUrl ||
                activeTeacher.photoUrl ||
                DEFAULT_FALLBACK_IMAGE
              }
              alt={activeTeacher.name}
              referrerPolicy="no-referrer"
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).src =
                  DEFAULT_FALLBACK_IMAGE;
              }}
              className="w-9 h-9 rounded-xl object-cover border border-slate-200 shrink-0"
            />
            <div className="min-w-0 flex-1">
              <p className="text-xs font-bold text-slate-900 truncate">
                {activeTeacher.name}
              </p>
              <p className="text-[11px] text-emerald-700 font-semibold truncate">
                {partnerRoyaltyPct}% Royalty · Verified Faculty
              </p>
            </div>
          </div>

          {/* Navigation Accordion Groups */}
          <div className="flex-1 overflow-y-auto p-3 space-y-2.5">
            {/* GROUP 1: Overview & Metrics */}
            <div className="border border-slate-200/80 rounded-xl overflow-hidden bg-slate-50/50">
              <button
                type="button"
                onClick={() => toggleGroup('overview')}
                className="w-full px-3 py-2 flex items-center justify-between text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200/80 transition-colors cursor-pointer"
              >
                <span className="flex items-center gap-2">
                  <LayoutDashboard className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Overview &amp; Metrics</span>
                </span>
                {expandedGroups.overview ? (
                  <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
                ) : (
                  <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
                )}
              </button>
              {expandedGroups.overview && (
                <div className="p-1.5 space-y-1 bg-white">
                  <button
                    type="button"
                    onClick={() => navigateToSection('dashboard')}
                    className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                      section === 'dashboard'
                        ? 'bg-slate-900 text-white font-bold shadow-xs'
                        : 'text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <LayoutDashboard className="w-3.5 h-3.5 text-emerald-500" />
                    <span>Executive Dashboard</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => navigateToSection('notifications')}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                      section === 'notifications'
                        ? 'bg-slate-900 text-white font-bold shadow-xs'
                        : 'text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <span className="flex items-center gap-2.5">
                      <Bell className="w-3.5 h-3.5 text-amber-500" />
                      <span>Partner Notifications</span>
                    </span>
                    {unreadPartnerNotifCount > 0 && (
                      <span className="px-1.5 py-0.5 text-[10px] font-bold bg-amber-500 text-white rounded-full leading-none font-mono tabular-nums">
                        {unreadPartnerNotifCount}
                      </span>
                    )}
                  </button>
                </div>
              )}
            </div>

            {/* GROUP 2: Course & Content Studio */}
            <div className="border border-slate-200/80 rounded-xl overflow-hidden bg-slate-50/50">
              <button
                type="button"
                onClick={() => toggleGroup('studio')}
                className="w-full px-3 py-2 flex items-center justify-between text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200/80 transition-colors cursor-pointer"
              >
                <span className="flex items-center gap-2">
                  <Layers className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Course &amp; Content Studio</span>
                </span>
                {expandedGroups.studio ? (
                  <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
                ) : (
                  <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
                )}
              </button>
              {expandedGroups.studio && (
                <div className="p-1.5 space-y-1 bg-white">
                  <button
                    type="button"
                    onClick={() => navigateToSection('create-course')}
                    className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                      section === 'create-course'
                        ? 'bg-slate-900 text-white font-bold shadow-xs'
                        : 'text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <Upload className="w-3.5 h-3.5 text-emerald-500" />
                    <span>Course Creation Studio</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => navigateToSection('my-courses')}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                      section === 'my-courses'
                        ? 'bg-slate-900 text-white font-bold shadow-xs'
                        : 'text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <span className="flex items-center gap-2.5">
                      <BookOpen className="w-3.5 h-3.5 text-indigo-500" />
                      <span>Approval Tracker</span>
                    </span>
                    {allTrackedCourses.length > 0 && (
                      <span className="px-1.5 py-0.5 text-[10px] font-bold bg-indigo-600 text-white rounded-full leading-none font-mono tabular-nums">
                        {allTrackedCourses.length}
                      </span>
                    )}
                  </button>
                </div>
              )}
            </div>

            {/* GROUP 3: Finance & Royalty */}
            <div className="border border-slate-200/80 rounded-xl overflow-hidden bg-slate-50/50">
              <button
                type="button"
                onClick={() => toggleGroup('finance')}
                className="w-full px-3 py-2 flex items-center justify-between text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200/80 transition-colors cursor-pointer"
              >
                <span className="flex items-center gap-2">
                  <IndianRupee className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Finance &amp; Royalty ({partnerRoyaltyPct}%)</span>
                </span>
                {expandedGroups.finance ? (
                  <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
                ) : (
                  <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
                )}
              </button>
              {expandedGroups.finance && (
                <div className="p-1.5 space-y-1 bg-white">
                  <button
                    type="button"
                    onClick={() => navigateToSection('payout-report')}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                      section === 'payout-report'
                        ? 'bg-slate-900 text-white font-bold shadow-xs'
                        : 'text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <span className="flex items-center gap-2.5">
                      <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-500" />
                      <span>Payout Report ({partnerRoyaltyPct}%)</span>
                    </span>
                    <span className="px-1.5 py-0.5 text-[10px] font-bold bg-slate-200 text-slate-700 rounded-full leading-none font-mono tabular-nums">
                      {teacherPayouts.length}
                    </span>
                  </button>
                  <button
                    type="button"
                    onClick={() => navigateToSection('bank-account')}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                      section === 'bank-account'
                        ? 'bg-slate-900 text-white font-bold shadow-xs'
                        : 'text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <span className="flex items-center gap-2.5">
                      <Building className="w-3.5 h-3.5 text-emerald-600" />
                      <span
                        className={
                          section === 'bank-account'
                            ? 'font-bold text-white'
                            : 'font-bold text-emerald-700'
                        }
                      >
                        Bank Account &amp; UPI
                      </span>
                    </span>
                    <span className="text-[10px] font-bold text-emerald-600">
                      {partnerRoyaltyPct}%
                    </span>
                  </button>
                </div>
              )}
            </div>

            {/* GROUP 4: Faculty Profile */}
            <div className="border border-slate-200/80 rounded-xl overflow-hidden bg-slate-50/50">
              <button
                type="button"
                onClick={() => toggleGroup('profileGroup')}
                className="w-full px-3 py-2 flex items-center justify-between text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200/80 transition-colors cursor-pointer"
              >
                <span className="flex items-center gap-2">
                  <UserCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Faculty Profile</span>
                </span>
                {expandedGroups.profileGroup ? (
                  <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
                ) : (
                  <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
                )}
              </button>
              {expandedGroups.profileGroup && (
                <div className="p-1.5 space-y-1 bg-white">
                  <button
                    type="button"
                    onClick={() => navigateToSection('profile')}
                    className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                      section === 'profile'
                        ? 'bg-slate-900 text-white font-bold shadow-xs'
                        : 'text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <Edit3 className="w-3.5 h-3.5 text-indigo-500" />
                    <span>Edit Profile &amp; Bio</span>
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar Drawer Footer: Workspace Shortcuts & Session */}
          <div className="p-3 border-t border-slate-200 bg-slate-50 space-y-2 shrink-0">
            <button
              type="button"
              onClick={onBackToStudentApp}
              className="w-full py-2 px-2.5 text-[11px] font-bold text-slate-800 bg-white border border-slate-200 hover:bg-slate-100 rounded-xl flex items-center justify-center gap-1.5 transition-colors cursor-pointer whitespace-nowrap"
            >
              <ExternalLink className="w-3 h-3 text-emerald-600 shrink-0" />
              <span>Student App</span>
            </button>
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={handleExportPayoutCsv}
                className="flex-1 py-2 px-2.5 text-[11px] font-bold text-slate-800 bg-white border border-slate-200 hover:bg-slate-100 rounded-xl flex items-center justify-center gap-1 transition-colors cursor-pointer whitespace-nowrap"
              >
                <Download className="w-3 h-3 text-emerald-600 shrink-0" />
                <span>Payout CSV</span>
              </button>
              <button
                type="button"
                onClick={handleLogout}
                className="py-2 px-3 text-[11px] font-bold text-rose-700 bg-rose-50 border border-rose-200 hover:bg-rose-100 rounded-xl flex items-center justify-center gap-1 transition-colors cursor-pointer whitespace-nowrap"
              >
                <LogOut className="w-3 h-3 shrink-0" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </aside>

        {/* Main Content Workspace Container */}
        <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
          {/* Sub-Header bar with 3-bar toggle button and active section breadcrumb */}
          <div className="bg-white border-b border-slate-200 px-4 sm:px-6 py-2.5 flex items-center justify-between gap-3 sticky top-0 z-20">
            <div className="flex items-center gap-2 sm:gap-3 min-w-0">
              <button
                type="button"
                onClick={() => setIsSidebarOpen((prev) => !prev)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-xl transition-colors cursor-pointer shrink-0 whitespace-nowrap"
                title={isSidebarOpen ? 'Hide Menu' : 'Open Menu (3 Bars)'}
              >
                <Menu className="w-4 h-4 text-emerald-600" />
                <span>{isSidebarOpen ? 'Hide Menu' : 'Menu (LHS)'}</span>
              </button>
              <span className="text-slate-300">/</span>
              <span className="text-xs font-bold text-slate-900 truncate">
                {getSectionLabel(section)}
              </span>
            </div>

            {toastMessage && (
              <span className="px-3 py-1 bg-emerald-600 text-white text-xs font-bold rounded-xl shadow-xs shrink-0">
                {toastMessage}
              </span>
            )}
          </div>

          {/* Right Workspace Content (Admin Executive Card Standard) */}
          <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
            {/* SECTION 1: EXECUTIVE DASHBOARD */}
            {section === 'dashboard' && (
              <div className="space-y-6">
                {/* Top KPI Row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="bg-white border border-slate-200 rounded-2xl p-5">
                    <div className="flex items-center justify-between text-xs font-semibold text-slate-500">
                      <span>Total {partnerRoyaltyPct}% Earnings</span>
                      <IndianRupee className="w-4 h-4 text-emerald-600" />
                    </div>
                    <p className="text-2xl font-bold text-slate-900 font-mono tabular-nums mt-2">
                      ₹
                      {(
                        activeTeacher.totalEarningsInr || 124000
                      ).toLocaleString('en-IN')}
                    </p>
                    <p className="text-[11px] text-emerald-700 font-semibold mt-1">
                      Direct Bank / UPI royalty
                    </p>
                  </div>

                  <div className="bg-white border border-slate-200 rounded-2xl p-5">
                    <div className="flex items-center justify-between text-xs font-semibold text-slate-500">
                      <span>Enrolled Students</span>
                      <Users className="w-4 h-4 text-indigo-600" />
                    </div>
                    <p className="text-2xl font-bold text-slate-900 font-mono tabular-nums mt-2">
                      {(activeTeacher.totalStudents || 620).toLocaleString(
                        'en-IN'
                      )}
                    </p>
                    <p className="text-[11px] text-slate-500 mt-1">
                      Across Hindi &amp; English batches
                    </p>
                  </div>

                  <div className="bg-white border border-slate-200 rounded-2xl p-5">
                    <div className="flex items-center justify-between text-xs font-semibold text-slate-500">
                      <span>Published Courses</span>
                      <BookOpen className="w-4 h-4 text-purple-600" />
                    </div>
                    <p className="text-2xl font-bold text-slate-900 font-mono tabular-nums mt-2">
                      {approvedLiveSubmissions.length || activeTeacher.coursesCount || 0} Live
                    </p>
                    <p className="text-[11px] text-indigo-600 font-semibold mt-1">
                      {pendingReviewCount} Pending Admin Review
                    </p>
                  </div>

                  <div className="bg-white border border-slate-200 rounded-2xl p-5">
                    <div className="flex items-center justify-between text-xs font-semibold text-slate-500">
                      <span>Faculty Rating</span>
                      <Sparkles className="w-4 h-4 text-amber-600" />
                    </div>
                    <p className="text-2xl font-bold text-slate-900 font-mono tabular-nums mt-2">
                      4.95 / 5.0
                    </p>
                    <p className="text-[11px] text-amber-700 font-semibold mt-1">
                      Top-rated verified educator
                    </p>
                  </div>
                </div>

                {/* Settlement Bank Quick Bar (Matching Admin's Database Backup Dark Banner) */}
                <div className="bg-gradient-to-r from-slate-900 to-slate-950 text-white rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border border-slate-800 shadow-sm">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-emerald-600/20 text-emerald-400 rounded-xl border border-emerald-500/30 shrink-0">
                      <Building className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-xs sm:text-sm font-bold text-white flex flex-wrap items-center gap-2">
                        <span>
                          Payout Destination: {bankForm.bankName || 'Not Added'}
                        </span>
                        <span className="text-[11px] font-mono text-emerald-300 font-semibold">
                          {partnerRoyaltyPct}% Faculty / {platformFeePct}% Infra
                        </span>
                      </h4>
                      <p className="text-[11px] text-slate-400 mt-0.5 font-mono">
                        A/C:{' '}
                        {bankForm.accountNumber
                          ? `•••• ${bankForm.accountNumber.slice(-4)}`
                          : 'Not Set'}{' '}
                        · IFSC: {bankForm.ifscCode || '—'} · UPI:{' '}
                        {bankForm.upiId || '—'}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={() => navigateToSection('create-course')}
                      className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl transition-colors cursor-pointer shadow-sm whitespace-nowrap"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Upload New Course</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => navigateToSection('bank-account')}
                      className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-200 bg-slate-800 hover:bg-slate-700 rounded-xl transition-colors cursor-pointer whitespace-nowrap"
                    >
                      <CreditCard className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Bank &amp; UPI</span>
                    </button>
                  </div>
                </div>

                {/* Quick Studio Shortcuts */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <button
                    type="button"
                    onClick={() => navigateToSection('payout-report')}
                    className="text-left bg-white hover:bg-slate-50 border border-slate-200 rounded-2xl p-5 transition-colors cursor-pointer space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <span className="p-2 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-200">
                        <FileSpreadsheet className="w-4 h-4" />
                      </span>
                      <span className="text-xs font-mono tabular-nums text-emerald-700 font-bold">
                        ₹{payoutTotals.pending.toLocaleString('en-IN')} Pending
                      </span>
                    </div>
                    <p className="text-sm font-bold text-slate-900">
                      {partnerRoyaltyPct}% Payout Report &amp; Slips
                    </p>
                    <p className="text-xs text-slate-500">
                      Export CSV statements, check UTR references, and print
                      official payout vouchers.
                    </p>
                  </button>

                  <button
                    type="button"
                    onClick={() => navigateToSection('notifications')}
                    className="text-left bg-white hover:bg-slate-50 border border-slate-200 rounded-2xl p-5 transition-colors cursor-pointer space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <span className="p-2 rounded-xl bg-amber-50 text-amber-600 border border-amber-200">
                        <Bell className="w-4 h-4" />
                      </span>
                      <span className="text-xs font-mono tabular-nums text-amber-700 font-bold">
                        {unreadPartnerNotifCount} Unread
                      </span>
                    </div>
                    <p className="text-sm font-bold text-slate-900">
                      Partner Notifications
                    </p>
                    <p className="text-xs text-slate-500">
                      Track Admin payout transfers, course approval notices, and
                      broadcasts.
                    </p>
                  </button>

                  <button
                    type="button"
                    onClick={() => navigateToSection('profile')}
                    className="text-left bg-white hover:bg-slate-50 border border-slate-200 rounded-2xl p-5 transition-colors cursor-pointer space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <span className="p-2 rounded-xl bg-indigo-50 text-indigo-600 border border-indigo-200">
                        <Edit3 className="w-4 h-4" />
                      </span>
                      <span className="text-xs font-semibold text-indigo-700">
                        Live Student Sync
                      </span>
                    </div>
                    <p className="text-sm font-bold text-slate-900">
                      Edit Faculty Profile &amp; Bio
                    </p>
                    <p className="text-xs text-slate-500">
                      Update educator photo, qualification, subject expertise,
                      and biography.
                    </p>
                  </button>
                </div>
              </div>
            )}

            {/* SECTION 2: BANK ACCOUNT & UPI SETTLEMENT */}
            {section === 'bank-account' && (
              <div className="space-y-6">
                <div className="bg-white border border-slate-200 rounded-2xl p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-xl shrink-0">
                      <Building className="w-5 h-5" />
                    </div>
                    <div>
                      <h2 className="text-lg font-bold text-slate-900">
                        Bank Account &amp; UPI Settlement Setup (बैंक खाता विवरण)
                      </h2>
                      <p className="text-xs text-slate-500 mt-0.5">
                        Add your bank account and UPI details. Admin directly
                        transfers your {partnerRoyaltyPct}% course royalty here.
                      </p>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-emerald-700 whitespace-nowrap">
                    Direct NEFT / IMPS / UPI
                  </span>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                  {/* Left 7 Cols: Bank Form */}
                  <form
                    onSubmit={handleSaveBankAccount}
                    className="lg:col-span-7 bg-white border border-slate-200 rounded-2xl p-6 space-y-5"
                  >
                    <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                      <div className="flex items-center gap-2">
                        <CreditCard className="w-4 h-4 text-emerald-600" />
                        <h3 className="text-sm font-bold text-slate-900">
                          Bank Passbook &amp; Account Information
                        </h3>
                      </div>
                      <span className="text-[11px] text-slate-500">
                        {partnerRoyaltyPct}% Partner Settlement
                      </span>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                          Bank Account Holder Name (खाताधारक का नाम) *
                        </label>
                        <input
                          type="text"
                          required
                          value={bankForm.accountHolderName}
                          onChange={(e) =>
                            setBankForm((prev) => ({
                              ...prev,
                              accountHolderName: e.target.value,
                            }))
                          }
                          placeholder="e.g. Dr. Priya Nair"
                          className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-emerald-600 focus:bg-white"
                        />
                        <p className="text-[11px] text-slate-500 mt-1">
                          Must match the name printed on your bank passbook or
                          cancelled cheque.
                        </p>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-semibold text-slate-700 mb-1">
                            Bank Name (बैंक का नाम) *
                          </label>
                          <select
                            value={bankForm.bankName}
                            onChange={(e) =>
                              setBankForm((prev) => ({
                                ...prev,
                                bankName: e.target.value,
                              }))
                            }
                            className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-emerald-600 focus:bg-white cursor-pointer"
                          >
                            {POPULAR_BANKS.map((bank) => (
                              <option key={bank} value={bank}>
                                {bank}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <label className="block text-xs font-semibold text-slate-700 mb-1">
                            Account Type (खाता प्रकार)
                          </label>
                          <select
                            value={bankForm.accountType || 'Savings'}
                            onChange={(e) =>
                              setBankForm((prev) => ({
                                ...prev,
                                accountType: e.target.value as
                                  | 'Savings'
                                  | 'Current',
                              }))
                            }
                            className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-emerald-600 focus:bg-white cursor-pointer"
                          >
                            <option value="Savings">
                              Savings Account (बचत खाता)
                            </option>
                            <option value="Current">
                              Current Account (चालू खाता)
                            </option>
                          </select>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-semibold text-slate-700 mb-1">
                            Bank Account Number (खाता संख्या) *
                          </label>
                          <input
                            type="text"
                            required
                            value={bankForm.accountNumber}
                            onChange={(e) =>
                              setBankForm((prev) => ({
                                ...prev,
                                accountNumber: e.target.value.replace(
                                  /\s+/g,
                                  ''
                                ),
                              }))
                            }
                            placeholder="e.g. 918020049281924"
                            className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-mono placeholder:text-slate-400 focus:outline-none focus:border-emerald-600 focus:bg-white"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-semibold text-slate-700 mb-1">
                            Confirm Account Number *
                          </label>
                          <input
                            type="text"
                            required
                            value={confirmAccNo}
                            onChange={(e) =>
                              setConfirmAccNo(
                                e.target.value.replace(/\s+/g, '')
                              )
                            }
                            placeholder="Re-enter Account Number"
                            className={`w-full px-3.5 py-2.5 text-xs bg-slate-50 border rounded-xl text-slate-900 font-mono placeholder:text-slate-400 focus:outline-none focus:bg-white ${
                              confirmAccNo &&
                              bankForm.accountNumber !== confirmAccNo
                                ? 'border-rose-500 focus:border-rose-600'
                                : 'border-slate-200 focus:border-emerald-600'
                            }`}
                          />
                          {confirmAccNo &&
                            bankForm.accountNumber === confirmAccNo && (
                              <span className="text-[11px] text-emerald-700 font-semibold block mt-1">
                                ✓ Account numbers match
                              </span>
                            )}
                          {confirmAccNo &&
                            bankForm.accountNumber !== confirmAccNo && (
                              <span className="text-[11px] text-rose-600 font-semibold block mt-1">
                                ✕ Account numbers do not match
                              </span>
                            )}
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-semibold text-slate-700 mb-1">
                            IFSC Code (11 Characters) *
                          </label>
                          <input
                            type="text"
                            maxLength={11}
                            required
                            value={bankForm.ifscCode}
                            onChange={(e) =>
                              setBankForm((prev) => ({
                                ...prev,
                                ifscCode: e.target.value
                                  .toUpperCase()
                                  .replace(/\s+/g, ''),
                              }))
                            }
                            placeholder="e.g. UTIB0000492"
                            className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-mono uppercase tracking-wider placeholder:text-slate-400 focus:outline-none focus:border-emerald-600 focus:bg-white"
                          />
                          <p className="text-[11px] text-slate-500 mt-1">
                            {bankForm.ifscCode.length}/11 Characters
                          </p>
                        </div>

                        <div>
                          <label className="block text-xs font-semibold text-slate-700 mb-1">
                            Branch Name (शाखा का नाम)
                          </label>
                          <input
                            type="text"
                            value={bankForm.branchName || ''}
                            onChange={(e) =>
                              setBankForm((prev) => ({
                                ...prev,
                                branchName: e.target.value,
                              }))
                            }
                            placeholder="e.g. Indiranagar, Main Branch"
                            className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-emerald-600 focus:bg-white"
                          />
                        </div>
                      </div>

                      <div className="pt-3 border-t border-slate-200 space-y-4">
                        <div>
                          <label className="block text-xs font-semibold text-slate-700 mb-1">
                            Teacher UPI ID (UPI आईडी)
                          </label>
                          <input
                            type="text"
                            value={bankForm.upiId || ''}
                            onChange={(e) =>
                              setBankForm((prev) => ({
                                ...prev,
                                upiId: e.target.value.replace(/\s+/g, ''),
                              }))
                            }
                            placeholder="e.g. priyanair@axisbank"
                            className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-mono placeholder:text-slate-400 focus:outline-none focus:border-emerald-600 focus:bg-white"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                            Upload UPI QR Code (PhonePe / GPay / Paytm)
                          </label>
                          <div className="flex flex-col sm:flex-row items-center gap-3">
                            <label className="flex-1 w-full flex items-center justify-center gap-2 p-3 bg-slate-50 hover:bg-slate-100 border-2 border-dashed border-slate-300 hover:border-emerald-600 rounded-xl cursor-pointer transition-colors text-xs text-slate-700 font-semibold">
                              <QrCode className="w-4 h-4 text-emerald-600" />
                              <span>
                                {bankForm.qrCodeUrl
                                  ? 'Replace QR Code Image'
                                  : 'Choose QR Code Photo (.png, .jpg)'}
                              </span>
                              <input
                                type="file"
                                accept="image/*"
                                onChange={handleQrUpload}
                                className="hidden"
                              />
                            </label>

                            {bankForm.qrCodeUrl && (
                              <button
                                type="button"
                                onClick={() =>
                                  setBankForm((prev) => ({
                                    ...prev,
                                    qrCodeUrl: '',
                                  }))
                                }
                                className="px-3 py-2 text-xs font-semibold text-rose-700 bg-rose-50 border border-rose-200 hover:bg-rose-100 rounded-xl transition-colors cursor-pointer shrink-0"
                              >
                                Remove QR
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-slate-200 flex justify-end">
                      <button
                        type="submit"
                        disabled={isSavingBank}
                        className="inline-flex items-center gap-2 px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition-colors cursor-pointer disabled:opacity-50 whitespace-nowrap"
                      >
                        <Check className="w-4 h-4" />
                        <span>
                          {isSavingBank
                            ? 'Saving Details...'
                            : 'Save Bank & UPI Details'}
                        </span>
                      </button>
                    </div>
                  </form>

                  {/* Right 5 Cols: Digital Passbook Card & QR Preview */}
                  <div className="lg:col-span-5 space-y-4">
                    <div className="bg-slate-900 text-white border border-slate-800 rounded-2xl p-6 space-y-4 shadow-sm">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
                          <ShieldCheck className="w-4 h-4" />
                          <span>Faculty Passbook</span>
                        </span>
                        <span className="text-[11px] font-bold text-slate-300">
                          {bankForm.accountType || 'Savings'} A/C
                        </span>
                      </div>

                      <div>
                        <p className="text-[10px] text-slate-400 uppercase">
                          Bank Name
                        </p>
                        <p className="text-base font-bold text-white tracking-wide">
                          {bankForm.bankName || 'Your Bank Name'}
                        </p>
                      </div>

                      <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-3 font-mono text-xs">
                        <div>
                          <span className="text-slate-500 text-[10px] block">
                            PAYEE / HOLDER
                          </span>
                          <span className="text-white font-bold">
                            {bankForm.accountHolderName || activeTeacher.name}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <div>
                            <span className="text-slate-500 text-[10px] block">
                              ACCOUNT NUMBER
                            </span>
                            <span className="text-emerald-400 font-bold tracking-wider">
                              {bankForm.accountNumber
                                ? `•••• •••• ${bankForm.accountNumber.slice(-4)}`
                                : '•••• •••• •••• ••••'}
                            </span>
                          </div>
                          {bankForm.accountNumber && (
                            <button
                              type="button"
                              onClick={() =>
                                copyToClipboard(bankForm.accountNumber, 'acc')
                              }
                              className="p-1.5 text-slate-400 hover:text-white bg-slate-800 rounded-lg transition-colors cursor-pointer"
                              title="Copy Account Number"
                            >
                              {copiedBankField === 'acc' ? (
                                <Check className="w-3.5 h-3.5 text-emerald-400" />
                              ) : (
                                <Copy className="w-3.5 h-3.5" />
                              )}
                            </button>
                          )}
                        </div>
                        <div className="flex items-center justify-between">
                          <div>
                            <span className="text-slate-500 text-[10px] block">
                              IFSC CODE
                            </span>
                            <span className="text-white font-bold">
                              {bankForm.ifscCode || 'IFSC0000000'}
                            </span>
                          </div>
                          {bankForm.ifscCode && (
                            <button
                              type="button"
                              onClick={() =>
                                copyToClipboard(bankForm.ifscCode, 'ifsc')
                              }
                              className="p-1.5 text-slate-400 hover:text-white bg-slate-800 rounded-lg transition-colors cursor-pointer"
                              title="Copy IFSC"
                            >
                              {copiedBankField === 'ifsc' ? (
                                <Check className="w-3.5 h-3.5 text-emerald-400" />
                              ) : (
                                <Copy className="w-3.5 h-3.5" />
                              )}
                            </button>
                          )}
                        </div>
                        <div>
                          <span className="text-slate-500 text-[10px] block">
                            UPI ID
                          </span>
                          <span className="text-indigo-300 font-bold">
                            {bankForm.upiId || 'not-set@upi'}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
                        <span>Settlement Status:</span>
                        <span className="text-emerald-400 font-bold flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Ready for Admin Payouts</span>
                        </span>
                      </div>
                    </div>

                    {bankForm.qrCodeUrl && (
                      <div className="bg-white border border-slate-200 rounded-2xl p-5 text-center space-y-3">
                        <div className="flex items-center justify-between text-xs pb-2 border-b border-slate-200">
                          <span className="font-bold text-slate-900 flex items-center gap-1.5">
                            <QrCode className="w-4 h-4 text-emerald-600" />
                            <span>Uploaded UPI QR Code</span>
                          </span>
                          <span className="text-[11px] text-emerald-700 font-semibold">
                            Active
                          </span>
                        </div>
                        <div className="w-44 h-44 mx-auto p-2 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-center overflow-hidden">
                          <img
                            src={bankForm.qrCodeUrl}
                            alt="Teacher UPI QR Code"
                            className="w-full h-full object-contain"
                          />
                        </div>
                        <p className="text-[11px] text-slate-500">
                          Admin can scan this QR to settle your {partnerRoyaltyPct}% course
                          royalty.
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* SECTION 3: COURSE CREATION STUDIO */}
            {section === 'create-course' && (
              <div className="space-y-6">
                <div className="bg-white border border-slate-200 rounded-2xl p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h2 className="text-lg font-bold text-slate-900">
                      Course Creation Studio (30-Chapter Symmetrical
                      Architecture)
                    </h2>
                    <p className="text-xs text-slate-500 mt-1">
                      Upload video lectures and study PDFs directly. Submitted
                      courses go to Admin for review before going live.
                    </p>
                  </div>
                  <span className="text-xs font-bold text-indigo-700 whitespace-nowrap">
                    30 Chapters Symmetrical
                  </span>
                </div>

                <form onSubmit={handleCourseSubmit} className="space-y-6">
                  <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4">
                    <h3 className="text-sm font-bold text-slate-900 border-b border-slate-200 pb-2.5">
                      Course Overview &amp; Pricing
                    </h3>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="sm:col-span-2">
                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                          Course Heading (English) *
                        </label>
                        <input
                          type="text"
                          required
                          value={courseTitle}
                          onChange={(e) => setCourseTitle(e.target.value)}
                          placeholder="e.g. Class 12 Physics Complete Board Masterclass 2026"
                          className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-emerald-600 focus:bg-white"
                        />
                      </div>

                      <div className="sm:col-span-2">
                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                          Course Heading (Hindi)
                        </label>
                        <input
                          type="text"
                          value={courseHindiTitle}
                          onChange={(e) => setCourseHindiTitle(e.target.value)}
                          placeholder="e.g. कक्षा 12 भौतिकी: सम्पूर्ण बोर्ड मास्टरक्लास"
                          className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-emerald-600 focus:bg-white"
                        />
                      </div>

                      <div className="sm:col-span-2">
                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                          Course Description &amp; Learning Goals
                        </label>
                        <textarea
                          rows={2}
                          value={courseSubtitle}
                          onChange={(e) => setCourseSubtitle(e.target.value)}
                          placeholder="Comprehensive 30 chapters with derivation sheets, formula notes, and numerical techniques."
                          className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-emerald-600 focus:bg-white"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                          Course Track
                        </label>
                        <select
                          value={courseCategory}
                          onChange={(e) =>
                            setCourseCategory(e.target.value as CourseCategory)
                          }
                          className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-emerald-600 focus:bg-white cursor-pointer"
                        >
                          <option value="k12">
                            Class 9–12 School Boards (K-12)
                          </option>
                          <option value="competitive">
                            UPSC, SSC &amp; Banking (Competitive)
                          </option>
                          <option value="skills">
                            Coding, AI &amp; Software (Skills)
                          </option>
                          <option value="kids">Future Kids Arena</option>
                        </select>
                      </div>

                      {courseCategory === 'k12' && (
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <label className="block text-xs font-semibold text-slate-700 mb-1">
                              Class
                            </label>
                            <select
                              value={k12Class}
                              onChange={(e) => setK12Class(e.target.value)}
                              className="w-full px-3 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-emerald-600"
                            >
                              <option value="9">Class 9</option>
                              <option value="10">Class 10</option>
                              <option value="11">Class 11</option>
                              <option value="12">Class 12</option>
                            </select>
                          </div>
                          <div>
                            <label className="block text-xs font-semibold text-slate-700 mb-1">
                              Stream
                            </label>
                            <select
                              value={k12Stream}
                              onChange={(e) => setK12Stream(e.target.value)}
                              className="w-full px-3 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-emerald-600"
                            >
                              <option value="pcm">PCM (Science)</option>
                              <option value="pcb">PCB (Bio)</option>
                              <option value="commerce">Commerce</option>
                              <option value="arts">Arts</option>
                            </select>
                          </div>
                        </div>
                      )}

                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                          Course Price (₹) — You keep {partnerRoyaltyPct}%
                        </label>
                        <input
                          type="number"
                          value={coursePrice}
                          onChange={(e) =>
                            setCoursePrice(Number(e.target.value))
                          }
                          className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-mono focus:outline-none focus:border-emerald-600 focus:bg-white"
                        />
                        <p className="text-[11px] text-emerald-700 font-semibold mt-1">
                          Your Royalty per Student: ₹
                          {Math.round((coursePrice * partnerRoyaltyPct) / 100)} ({partnerRoyaltyPct}%)
                        </p>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                          Course Thumbnail
                        </label>
                        <label className="w-full flex items-center justify-center gap-2 px-3.5 py-2.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 hover:border-emerald-600 rounded-xl cursor-pointer text-xs text-slate-700 font-semibold transition-colors">
                          <ImageIcon className="w-4 h-4 text-emerald-600" />
                          <span>Upload Custom Banner (.jpg, .png)</span>
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                const r = new FileReader();
                                r.onload = () => {
                                  if (typeof r.result === 'string')
                                    setCourseThumbnail(r.result);
                                };
                                r.readAsDataURL(file);
                              }
                            }}
                          />
                        </label>
                      </div>
                    </div>
                  </div>

                  {/* Chapter & Media Uploader */}
                  <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4">
                    <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 pb-3">
                      <div>
                        <h3 className="text-sm font-bold text-slate-900">
                          Curriculum Builder ({modules.length} Symmetrical
                          Chapters)
                        </h3>
                        <p className="text-xs text-slate-500">
                          Select a chapter to attach local lecture videos and
                          study PDFs.
                        </p>
                      </div>

                      <select
                        value={selectedModIdx}
                        onChange={(e) =>
                          setSelectedModIdx(Number(e.target.value))
                        }
                        className="px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-semibold max-w-xs truncate cursor-pointer"
                      >
                        {modules.map((m, idx) => (
                          <option key={m.id} value={idx}>
                            {m.title} {m.videoUrl ? '· [Video]' : ''}{' '}
                            {m.pdfUrl ? '· [PDF]' : ''}
                          </option>
                        ))}
                      </select>
                    </div>

                    {activeModule && (
                      <div className="space-y-4">
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                          <div className="sm:col-span-2">
                            <label className="block text-xs font-semibold text-slate-700 mb-1">
                              Chapter {selectedModIdx + 1} Title
                            </label>
                            <input
                              type="text"
                              value={activeModule.title}
                              onChange={(e) =>
                                setModules((prev) =>
                                  prev.map((m, i) =>
                                    i === selectedModIdx
                                      ? { ...m, title: e.target.value }
                                      : m
                                  )
                                )
                              }
                              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-emerald-600 focus:bg-white"
                            />
                          </div>

                          <div>
                            <label className="block text-xs font-semibold text-slate-700 mb-1">
                              Estimated Duration (Mins)
                            </label>
                            <input
                              type="number"
                              value={activeModule.durationMins || 45}
                              onChange={(e) =>
                                setModules((prev) =>
                                  prev.map((m, i) =>
                                    i === selectedModIdx
                                      ? {
                                          ...m,
                                          durationMins: Number(e.target.value),
                                        }
                                      : m
                                  )
                                )
                              }
                              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-mono focus:outline-none focus:border-emerald-600 focus:bg-white"
                            />
                          </div>
                        </div>

                        {/* Video Uploader Card */}
                        <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-3">
                          <div className="flex items-center justify-between">
                            <label className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                              <Video className="w-4 h-4 text-emerald-600" />
                              <span>
                                Chapter Video Lecture (.mp4, .mov, .webm)
                              </span>
                            </label>
                            {activeModule.videoUrl ? (
                              <span className="text-[11px] font-bold text-emerald-700">
                                ✓ Video Ready ({activeModule.durationMins || 45}{' '}
                                mins)
                              </span>
                            ) : (
                              <span className="text-[11px] font-semibold text-amber-700">
                                No video attached
                              </span>
                            )}
                          </div>

                          {activeModule.videoUrl ? (
                            <div className="space-y-2">
                              <div className="rounded-xl overflow-hidden bg-slate-950 border border-slate-200 aspect-video max-h-48 flex items-center justify-center">
                                <video
                                  src={activeModule.videoUrl}
                                  controls
                                  className="w-full h-full object-contain"
                                />
                              </div>
                              <div className="flex items-center justify-between">
                                <label className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 hover:bg-emerald-100 rounded-lg cursor-pointer">
                                  <Upload className="w-3.5 h-3.5" />
                                  <span>Replace Video File</span>
                                  <input
                                    type="file"
                                    accept="video/*"
                                    onChange={handleModuleVideoUpload}
                                    className="hidden"
                                  />
                                </label>
                                <button
                                  type="button"
                                  onClick={() =>
                                    setModules((prev) =>
                                      prev.map((m, i) =>
                                        i === selectedModIdx
                                          ? { ...m, videoUrl: '' }
                                          : m
                                      )
                                    )
                                  }
                                  className="text-xs font-semibold text-rose-600 hover:text-rose-700 cursor-pointer"
                                >
                                  Detach Video
                                </button>
                              </div>
                            </div>
                          ) : (
                            <label className="flex flex-col items-center justify-center p-5 border-2 border-dashed border-slate-300 hover:border-emerald-600 bg-white rounded-xl cursor-pointer text-center">
                              <Upload className="w-6 h-6 text-emerald-600 mb-1" />
                              <span className="text-xs font-bold text-slate-900">
                                Upload Video File (.mp4, .webm)
                              </span>
                              <span className="text-[11px] text-slate-500 mt-0.5">
                                Reads duration automatically on selection
                              </span>
                              <input
                                type="file"
                                accept="video/*"
                                onChange={handleModuleVideoUpload}
                                className="hidden"
                              />
                            </label>
                          )}
                        </div>

                        {/* PDF Uploader Card */}
                        <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-3">
                          <div className="flex items-center justify-between">
                            <label className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                              <FileText className="w-4 h-4 text-indigo-600" />
                              <span>
                                Study PDF Notes / DPP Resource (.pdf)
                              </span>
                            </label>
                            {activeModule.pdfUrl && (
                              <span className="text-[11px] font-bold text-emerald-700">
                                ✓ PDF Attached (
                                {activeModule.pdfFileName || 'notes.pdf'})
                              </span>
                            )}
                          </div>

                          <label className="flex flex-col items-center justify-center p-4 border-2 border-dashed border-slate-300 hover:border-indigo-600 bg-white rounded-xl cursor-pointer text-center">
                            <Upload className="w-5 h-5 text-indigo-600 mb-1" />
                            <span className="text-xs font-bold text-slate-900">
                              {activeModule.pdfUrl
                                ? 'Replace PDF File (.pdf)'
                                : 'Upload PDF Document (.pdf)'}
                            </span>
                            <span className="text-[11px] text-slate-500 mt-0.5">
                              1-Click upload from device
                            </span>
                            <input
                              type="file"
                              accept="application/pdf"
                              onChange={handleModulePdfUpload}
                              className="hidden"
                            />
                          </label>

                          <div className="flex items-center justify-between pt-2 border-t border-slate-200 text-xs">
                            <span className="text-slate-600 font-medium">
                              Student PDF Download Mode:
                            </span>
                            <div className="flex items-center gap-2">
                              <button
                                type="button"
                                onClick={() =>
                                  setModules((prev) =>
                                    prev.map((m, i) =>
                                      i === selectedModIdx
                                        ? { ...m, pdfPolicy: 'downloadable' }
                                        : m
                                    )
                                  )
                                }
                                className={`px-3 py-1.5 rounded-lg text-[11px] font-bold cursor-pointer transition-colors ${
                                  (activeModule.pdfPolicy || 'downloadable') ===
                                  'downloadable'
                                    ? 'bg-emerald-600 text-white'
                                    : 'bg-white border border-slate-200 text-slate-600 hover:text-slate-900'
                                }`}
                              >
                                Downloadable
                              </button>
                              <button
                                type="button"
                                onClick={() =>
                                  setModules((prev) =>
                                    prev.map((m, i) =>
                                      i === selectedModIdx
                                        ? { ...m, pdfPolicy: 'view_only' }
                                        : m
                                    )
                                  )
                                }
                                className={`px-3 py-1.5 rounded-lg text-[11px] font-bold cursor-pointer transition-colors ${
                                  activeModule.pdfPolicy === 'view_only'
                                    ? 'bg-amber-600 text-white'
                                    : 'bg-white border border-slate-200 text-slate-600 hover:text-slate-900'
                                }`}
                              >
                                View Only
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {courseSubmitError && (
                    <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-xl text-xs font-semibold text-rose-700 flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      <span>{courseSubmitError}</span>
                    </div>
                  )}

                  <div className="flex justify-end pt-2">
                    <button
                      type="submit"
                      disabled={isSubmittingCourse}
                      className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-bold rounded-xl transition-colors shadow-sm cursor-pointer disabled:opacity-50 whitespace-nowrap"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>
                        {isSubmittingCourse
                          ? 'Submitting...'
                          : 'Submit Course for Admin Approval'}
                      </span>
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* SECTION 4: MY COURSES & APPROVAL STATUS TRACKER */}
            {section === 'my-courses' && (
              <div className="space-y-6">
                <div className="bg-white border border-slate-200 rounded-2xl p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h2 className="text-lg font-bold text-slate-900">
                      Course Submissions &amp; Approval Status
                    </h2>
                    <p className="text-xs text-slate-500 mt-1">
                      Track courses submitted to Admin. Approved courses publish
                      directly to the Student App.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => navigateToSection('create-course')}
                    className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition-colors cursor-pointer self-start sm:self-auto whitespace-nowrap"
                  >
                    <Plus className="w-4 h-4" />
                    <span>New Course</span>
                  </button>
                </div>

                {allTrackedCourses.length === 0 ? (
                  <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center space-y-3">
                    <Clock className="w-10 h-10 text-slate-400 mx-auto" />
                    <h3 className="text-base font-bold text-slate-900">
                      No Courses Submitted Yet
                    </h3>
                    <p className="text-xs text-slate-500 max-w-sm mx-auto">
                      Use the Course Creation Studio to build and submit your
                      30-chapter masterclass with videos and PDFs.
                    </p>
                    <button
                      type="button"
                      onClick={() => navigateToSection('create-course')}
                      className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl cursor-pointer"
                    >
                      Create First Course
                    </button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {allTrackedCourses.map((sub) => (
                      <div
                        key={sub.id}
                        className="bg-white border border-slate-200 rounded-2xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-4"
                      >
                        <div className="flex items-start gap-4">
                          <img
                            src={sub.imageUrl || DEFAULT_FALLBACK_IMAGE}
                            alt={sub.title}
                            referrerPolicy="no-referrer"
                            onError={(e) => {
                              (e.currentTarget as HTMLImageElement).src =
                                DEFAULT_FALLBACK_IMAGE;
                            }}
                            className="w-16 h-16 rounded-xl object-cover border border-slate-200 shrink-0"
                          />
                          <div>
                            <div className="flex flex-wrap items-center gap-2">
                              <h4 className="text-sm font-bold text-slate-900">
                                {sub.title}
                              </h4>
                              <span className="text-[11px] font-semibold text-indigo-700">
                                ·{' '}
                                {sub.categoryLabel ||
                                  sub.category?.toUpperCase()}
                              </span>
                            </div>
                            <p className="text-xs text-slate-500 mt-0.5 line-clamp-1">
                              {sub.subtitle}
                            </p>
                            <div className="flex flex-wrap items-center gap-3 mt-2 text-xs text-slate-600 font-mono">
                              <span>
                                Price: ₹{sub.fullPriceInr || sub.priceInr || 699}
                              </span>
                              <span>·</span>
                              <span>Chapters: {sub.modules?.length || 30}</span>
                              <span>·</span>
                              <span className="text-emerald-700 font-bold">
                                {partnerRoyaltyPct}% Share: ₹
                                {Math.round(((sub.fullPriceInr || 699) * partnerRoyaltyPct) / 100)}
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-3 self-end md:self-center shrink-0">
                          {sub.status === 'approved' ? (
                            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold rounded-xl">
                              <CheckCircle2 className="w-4 h-4" />
                              <span>Live on Student App</span>
                            </span>
                          ) : sub.status === 'rejected' ? (
                            <div className="text-right">
                              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold rounded-xl">
                                <XCircle className="w-4 h-4" />
                                <span>Revision Requested</span>
                              </span>
                              {sub.rejectionReason && (
                                <p className="text-[11px] text-rose-600 mt-1 max-w-xs">
                                  Note: {sub.rejectionReason}
                                </p>
                              )}
                            </div>
                          ) : (
                            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 border border-amber-200 text-amber-700 text-xs font-bold rounded-xl">
                              <Clock className="w-4 h-4" />
                              <span>Pending Admin Review</span>
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* SECTION 5: EDITABLE PARTNER PROFILE & BIO */}
            {section === 'profile' && (
              <div className="space-y-6">
                <div className="bg-white border border-slate-200 rounded-2xl p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h2 className="text-lg font-bold text-slate-900">
                      Edit Partner Profile &amp; Credentials
                    </h2>
                    <p className="text-xs text-slate-500 mt-1">
                      Update your photo, academic qualifications, subject
                      expertise, contact details, and bio. Changes sync
                      immediately to Admin &amp; Student Catalog.
                    </p>
                  </div>
                  <span className="text-xs font-semibold text-emerald-700 font-mono whitespace-nowrap">
                    Educator ID: {activeTeacher.id}
                  </span>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                  <form
                    onSubmit={handleSaveProfile}
                    className="lg:col-span-8 bg-white border border-slate-200 rounded-2xl p-6 space-y-5"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center gap-4 pb-5 border-b border-slate-200">
                      <div className="w-20 h-20 rounded-2xl overflow-hidden border border-slate-200 bg-slate-100 shrink-0">
                        <img
                          src={profileForm.avatarUrl || DEFAULT_FALLBACK_IMAGE}
                          alt={profileForm.name}
                          referrerPolicy="no-referrer"
                          onError={(e) => {
                            (e.currentTarget as HTMLImageElement).src =
                              DEFAULT_FALLBACK_IMAGE;
                          }}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 space-y-2.5">
                        <div className="flex flex-wrap items-center gap-2">
                          <label className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl cursor-pointer transition-colors whitespace-nowrap">
                            <Camera className="w-3.5 h-3.5" />
                            <span>Upload New Photo</span>
                            <input
                              type="file"
                              accept="image/*"
                              onChange={handleProfileAvatarUpload}
                              className="hidden"
                            />
                          </label>
                          {PRESET_FACULTY_AVATARS.map((preset) => (
                            <button
                              key={preset.url}
                              type="button"
                              onClick={() =>
                                setProfileForm((prev) => ({
                                  ...prev,
                                  avatarUrl: preset.url,
                                }))
                              }
                              className={`px-2.5 py-1.5 text-[11px] font-semibold rounded-lg border transition-colors cursor-pointer whitespace-nowrap ${
                                profileForm.avatarUrl === preset.url
                                  ? 'bg-emerald-50 border-emerald-600 text-emerald-700'
                                  : 'bg-slate-50 border-slate-200 text-slate-600 hover:text-slate-900'
                              }`}
                            >
                              {preset.label}
                            </button>
                          ))}
                        </div>
                        <p className="text-[11px] text-slate-500">
                          Displayed alongside your courses in the Student App
                          catalog.
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                          Full Name *
                        </label>
                        <input
                          type="text"
                          required
                          value={profileForm.name}
                          onChange={(e) =>
                            setProfileForm((prev) => ({
                              ...prev,
                              name: e.target.value,
                            }))
                          }
                          className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-emerald-600 focus:bg-white"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                          Academic Qualification *
                        </label>
                        <input
                          type="text"
                          required
                          value={profileForm.qualification}
                          onChange={(e) =>
                            setProfileForm((prev) => ({
                              ...prev,
                              qualification: e.target.value,
                            }))
                          }
                          placeholder="e.g. M.Sc., Ph.D. Physics, B.Ed"
                          className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-emerald-600 focus:bg-white"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                          Registered Email *
                        </label>
                        <input
                          type="email"
                          required
                          value={profileForm.email}
                          onChange={(e) =>
                            setProfileForm((prev) => ({
                              ...prev,
                              email: e.target.value,
                            }))
                          }
                          className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-emerald-600 focus:bg-white"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                          Contact Phone
                        </label>
                        <input
                          type="text"
                          value={profileForm.phone}
                          onChange={(e) =>
                            setProfileForm((prev) => ({
                              ...prev,
                              phone: e.target.value,
                            }))
                          }
                          placeholder="+91 98XXXXXXXX"
                          className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-mono focus:outline-none focus:border-emerald-600 focus:bg-white"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                          Primary Subject Expertise
                        </label>
                        <input
                          type="text"
                          value={profileForm.subjectExpertise}
                          onChange={(e) =>
                            setProfileForm((prev) => ({
                              ...prev,
                              subjectExpertise: e.target.value,
                            }))
                          }
                          placeholder="e.g. Class 11–12 Physics & JEE"
                          className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-emerald-600 focus:bg-white"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                          Teaching Experience (Years)
                        </label>
                        <input
                          type="number"
                          min={1}
                          max={60}
                          value={profileForm.experienceYears}
                          onChange={(e) =>
                            setProfileForm((prev) => ({
                              ...prev,
                              experienceYears: Number(e.target.value) || 1,
                            }))
                          }
                          className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-mono tabular-nums focus:outline-none focus:border-emerald-600 focus:bg-white"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                        Educator Biography &amp; Teaching Philosophy
                      </label>
                      <textarea
                        rows={4}
                        value={profileForm.bio}
                        onChange={(e) =>
                          setProfileForm((prev) => ({
                            ...prev,
                            bio: e.target.value,
                          }))
                        }
                        placeholder="Describe your teaching methodology, results mentored, and student focus..."
                        className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-900 leading-relaxed focus:outline-none focus:border-emerald-600 focus:bg-white"
                      />
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-4 border-t border-slate-200">
                      <span className="text-[11px] text-slate-500">
                        Payout Destination:{' '}
                        <span className="font-mono text-emerald-700 font-semibold">
                          {bankForm.bankName} (
                          {bankForm.upiId || profileForm.upiId})
                        </span>
                      </span>
                      <button
                        type="submit"
                        disabled={isSavingProfile}
                        className="inline-flex items-center gap-2 px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition-colors cursor-pointer disabled:opacity-50 whitespace-nowrap"
                      >
                        <Check className="w-4 h-4" />
                        <span>
                          {isSavingProfile
                            ? 'Saving Profile...'
                            : 'Save Profile Changes'}
                        </span>
                      </button>
                    </div>
                  </form>

                  {/* Live Student Card Preview */}
                  <div className="lg:col-span-4 space-y-4">
                    <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4">
                      <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                        <span className="text-xs font-bold text-slate-900">
                          Live Student Catalog Card
                        </span>
                        <span className="text-[11px] text-emerald-700 font-semibold">
                          Verified Faculty
                        </span>
                      </div>
                      <div className="flex items-center gap-3.5">
                        <img
                          src={profileForm.avatarUrl || DEFAULT_FALLBACK_IMAGE}
                          alt={profileForm.name}
                          referrerPolicy="no-referrer"
                          onError={(e) => {
                            (e.currentTarget as HTMLImageElement).src =
                              DEFAULT_FALLBACK_IMAGE;
                          }}
                          className="w-14 h-14 rounded-xl object-cover border border-slate-200 shrink-0"
                        />
                        <div className="min-w-0">
                          <h3 className="text-sm font-bold text-slate-900 truncate">
                            {profileForm.name || 'Faculty Name'}
                          </h3>
                          <p className="text-xs text-indigo-700 font-semibold truncate">
                            {profileForm.subjectExpertise}
                          </p>
                          <p className="text-[11px] text-slate-500 truncate">
                            {profileForm.qualification} ·{' '}
                            {profileForm.experienceYears}+ Years
                          </p>
                        </div>
                      </div>
                      <p className="text-xs text-slate-600 leading-relaxed">
                        {profileForm.bio ||
                          'Add your educator bio to inspire student enrollments.'}
                      </p>
                      <div className="pt-3 border-t border-slate-200 flex items-center justify-between text-[11px] text-slate-500 font-mono tabular-nums">
                        <span>{activeTeacher.coursesCount || 2} Courses</span>
                        <span>·</span>
                        <span>{activeTeacher.totalStudents || 0} Learners</span>
                        <span>·</span>
                        <span className="text-emerald-700 font-bold">
                          {partnerRoyaltyPct}% Share
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* SECTION 6: PARTNER PAYOUT REPORT (DYNAMIC ROYALTY LEDGER) */}
            {section === 'payout-report' && (
              <div className="space-y-6">
                <div className="bg-white border border-slate-200 rounded-2xl p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h2 className="text-lg font-bold text-slate-900">
                      Partner Payout Report &amp; {partnerRoyaltyPct}% Royalty Ledger
                    </h2>
                    <p className="text-xs text-slate-500 mt-1">
                      Track gross student collections, {platformFeePct}% platform tech split,
                      and your {partnerRoyaltyPct}% direct Bank / UPI settlements.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={handleExportPayoutCsv}
                    className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition-colors cursor-pointer shrink-0 self-start sm:self-auto whitespace-nowrap"
                  >
                    <Download className="w-4 h-4" />
                    <span>Export CSV Report</span>
                  </button>
                </div>

                {/* 6-Month Royalty Earnings Summary Line Chart */}
                <PartnerRoyaltyChart
                  payouts={teacherPayouts}
                  partnerRoyaltyPct={partnerRoyaltyPct}
                  onNavigateToCreateCourse={() => navigateToSection('create-course')}
                />

                {/* Tabular KPI Strip */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-1.5">
                    <span className="text-xs font-semibold text-slate-500 block">
                      Gross Course Collections
                    </span>
                    <p className="text-2xl font-bold text-slate-900 font-mono tabular-nums">
                      ₹{payoutTotals.gross.toLocaleString('en-IN')}
                    </p>
                    <span className="text-[11px] text-slate-500">
                      100% student fee receipts
                    </span>
                  </div>
                  <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-1.5">
                    <span className="text-xs font-semibold text-slate-500 block">
                      Platform Tech Fee ({platformFeePct}%)
                    </span>
                    <p className="text-2xl font-bold text-slate-700 font-mono tabular-nums">
                      ₹{payoutTotals.platform.toLocaleString('en-IN')}
                    </p>
                    <span className="text-[11px] text-slate-500">
                      LMS hosting &amp; support
                    </span>
                  </div>
                  <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-1.5">
                    <span className="text-xs font-semibold text-slate-500 block">
                      Settled to Bank / UPI ({partnerRoyaltyPct}%)
                    </span>
                    <p className="text-2xl font-bold text-emerald-700 font-mono tabular-nums">
                      ₹{payoutTotals.paid.toLocaleString('en-IN')}
                    </p>
                    <span className="text-[11px] text-emerald-700 font-semibold">
                      Cleared UTR transactions
                    </span>
                  </div>
                  <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-1.5">
                    <span className="text-xs font-semibold text-slate-500 block">
                      Upcoming Settlement
                    </span>
                    <p className="text-2xl font-bold text-amber-600 font-mono tabular-nums">
                      ₹{payoutTotals.pending.toLocaleString('en-IN')}
                    </p>
                    <span className="text-[11px] text-slate-500">
                      Queued for admin release
                    </span>
                  </div>
                </div>

                {/* Filter & Search Toolbar + Table */}
                <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-4">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                    <div className="flex flex-wrap items-center gap-1 p-1 bg-slate-100 border border-slate-200 rounded-xl">
                      {(
                        [
                          'all',
                          'Paid',
                          'Processing',
                          'Pending Settlement',
                        ] as const
                      ).map((st) => (
                        <button
                          key={st}
                          type="button"
                          onClick={() => setPayoutStatusFilter(st)}
                          className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
                            payoutStatusFilter === st
                              ? 'bg-slate-900 text-white'
                              : 'text-slate-600 hover:text-slate-900'
                          }`}
                        >
                          {st === 'all' ? 'All Settlements' : st}
                        </button>
                      ))}
                    </div>

                    <div className="relative w-full md:w-72">
                      <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                      <input
                        type="text"
                        value={payoutSearch}
                        onChange={(e) => setPayoutSearch(e.target.value)}
                        placeholder="Search course, UTR, or period..."
                        className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-emerald-600 focus:bg-white"
                      />
                    </div>
                  </div>

                  {filteredPayouts.length === 0 ? (
                    <div className="p-10 text-center border border-dashed border-slate-200 rounded-2xl space-y-2">
                      <FileSpreadsheet className="w-8 h-8 text-slate-400 mx-auto" />
                      <p className="text-sm font-semibold text-slate-700">
                        No matching payout records found
                      </p>
                      <p className="text-xs text-slate-500">
                        Clear your filter or publish courses to receive {partnerRoyaltyPct}%
                        royalty settlements.
                      </p>
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full text-left border-collapse text-xs">
                        <thead>
                          <tr className="border-b border-slate-200 text-[11px] text-slate-500">
                            <th className="py-3 px-3 font-semibold">
                              Period / Date
                            </th>
                            <th className="py-3 px-3 font-semibold">
                              Course &amp; Batch
                            </th>
                            <th className="py-3 px-3 font-semibold text-right">
                              Gross Fee
                            </th>
                            <th className="py-3 px-3 font-semibold text-right">
                              Royalty Share
                            </th>
                            <th className="py-3 px-3 font-semibold">
                              Method &amp; UTR
                            </th>
                            <th className="py-3 px-3 font-semibold">Status</th>
                            <th className="py-3 px-3 font-semibold text-right">
                              Slip
                            </th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200">
                          {filteredPayouts.map((row) => (
                            <tr
                              key={row.id}
                              className="hover:bg-slate-50 transition-colors"
                            >
                              <td className="py-3 px-3 whitespace-nowrap">
                                <span className="font-semibold text-slate-900 block">
                                  {row.periodLabel}
                                </span>
                                <span className="text-[11px] text-slate-500 font-mono tabular-nums">
                                  {row.paidAt}
                                </span>
                              </td>
                              <td className="py-3 px-3 max-w-xs">
                                <span className="font-semibold text-slate-900 block truncate">
                                  {row.courseTitle}
                                </span>
                                <span className="text-[11px] text-slate-500 block truncate">
                                  {row.studentName || 'Enrolled Students'}
                                </span>
                              </td>
                              <td className="py-3 px-3 text-right font-mono tabular-nums text-slate-700 whitespace-nowrap">
                                ₹{row.grossAmountInr.toLocaleString('en-IN')}
                              </td>
                              <td className="py-3 px-3 text-right font-mono tabular-nums font-bold text-emerald-700 whitespace-nowrap">
                                ₹{row.partnerShareInr.toLocaleString('en-IN')}
                              </td>
                              <td className="py-3 px-3 whitespace-nowrap">
                                <span className="text-slate-800 block">
                                  {row.payoutMethod}
                                </span>
                                <span className="text-[11px] font-mono text-indigo-700">
                                  {row.referenceId}
                                </span>
                              </td>
                              <td className="py-3 px-3 whitespace-nowrap">
                                <span
                                  className={`text-[11px] font-bold ${
                                    row.status === 'Paid'
                                      ? 'text-emerald-700'
                                      : row.status === 'Processing'
                                        ? 'text-indigo-700'
                                        : 'text-amber-700'
                                  }`}
                                >
                                  {row.status}
                                </span>
                              </td>
                              <td className="py-3 px-3 text-right whitespace-nowrap">
                                <button
                                  type="button"
                                  onClick={() => setSelectedPayoutSlip(row)}
                                  className="inline-flex items-center gap-1 px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg text-[11px] font-semibold cursor-pointer"
                                >
                                  <Eye className="w-3 h-3" />
                                  <span>Slip</span>
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>

                {/* Printable Payout Slip Modal */}
                {selectedPayoutSlip && (
                  <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
                    <div className="bg-white border border-slate-200 rounded-2xl max-w-lg w-full p-6 space-y-5 shadow-2xl">
                      <div className="flex items-start justify-between border-b border-slate-200 pb-4">
                        <div>
                          <p className="text-xs font-bold text-emerald-700">
                            {brandName} · Royalty Statement
                          </p>
                          <h3 className="text-lg font-bold text-slate-900 mt-0.5">
                            Partner Payout Voucher
                          </h3>
                        </div>
                        <button
                          type="button"
                          onClick={() => setSelectedPayoutSlip(null)}
                          className="p-1.5 text-slate-500 hover:text-slate-900 bg-slate-100 rounded-lg cursor-pointer"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="space-y-3 text-xs">
                        <div className="flex justify-between py-1.5 border-b border-slate-100">
                          <span className="text-slate-500">Faculty Partner</span>
                          <span className="font-bold text-slate-900">
                            {selectedPayoutSlip.teacherName}
                          </span>
                        </div>
                        <div className="flex justify-between py-1.5 border-b border-slate-100">
                          <span className="text-slate-500">Course / Batch</span>
                          <span className="font-semibold text-slate-800 text-right max-w-[60%]">
                            {selectedPayoutSlip.courseTitle}
                          </span>
                        </div>
                        <div className="flex justify-between py-1.5 border-b border-slate-100">
                          <span className="text-slate-500">
                            Gross Revenue (100%)
                          </span>
                          <span className="font-mono tabular-nums text-slate-900">
                            ₹
                            {selectedPayoutSlip.grossAmountInr.toLocaleString(
                              'en-IN'
                            )}
                          </span>
                        </div>
                        <div className="flex justify-between py-1.5 border-b border-slate-100">
                          <span className="text-slate-500">
                            Platform Fee ({Math.max(0, 100 - (selectedPayoutSlip.royaltyPct ?? partnerRoyaltyPct))}%)
                          </span>
                          <span className="font-mono tabular-nums text-slate-600">
                            - ₹
                            {selectedPayoutSlip.platformFeeInr.toLocaleString(
                              'en-IN'
                            )}
                          </span>
                        </div>
                        <div className="flex justify-between py-2 border-b border-slate-200">
                          <span className="font-bold text-emerald-700">
                            Net Teacher Payout ({selectedPayoutSlip.royaltyPct ?? partnerRoyaltyPct}%)
                          </span>
                          <span className="font-mono tabular-nums text-base font-bold text-emerald-700">
                            ₹
                            {selectedPayoutSlip.partnerShareInr.toLocaleString(
                              'en-IN'
                            )}
                          </span>
                        </div>
                        <div className="flex justify-between py-1.5 border-b border-slate-100">
                          <span className="text-slate-500">
                            Method &amp; UTR Reference
                          </span>
                          <span className="font-mono text-indigo-700 font-semibold">
                            {selectedPayoutSlip.payoutMethod} ·{' '}
                            {selectedPayoutSlip.referenceId}
                          </span>
                        </div>
                        <div className="flex justify-between py-1.5">
                          <span className="text-slate-500">
                            Settled Destination
                          </span>
                          <span className="font-mono text-slate-700 text-right max-w-[60%]">
                            {selectedPayoutSlip.settledTo || bankForm.bankName}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center justify-end gap-2 pt-2">
                        <button
                          type="button"
                          onClick={() => window.print()}
                          className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl cursor-pointer whitespace-nowrap"
                        >
                          <Printer className="w-3.5 h-3.5" />
                          <span>Print Slip</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => setSelectedPayoutSlip(null)}
                          className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold rounded-xl cursor-pointer"
                        >
                          Close
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* SECTION 7: PARTNER NOTIFICATIONS */}
            {section === 'notifications' && (
              <div className="space-y-6">
                <div className="bg-white border border-slate-200 rounded-2xl p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h2 className="text-lg font-bold text-slate-900">
                      Partner Alerts &amp; Settlement Notifications
                    </h2>
                    <p className="text-xs text-slate-500 mt-1">
                      Real-time updates on {partnerRoyaltyPct}% royalty payouts, course review
                      approvals, revision requests, and admin broadcasts.
                    </p>
                  </div>
                  {unreadPartnerNotifCount > 0 && (
                    <button
                      type="button"
                      onClick={() => handleMarkNotificationsRead()}
                      className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition-colors cursor-pointer shrink-0 self-start sm:self-auto whitespace-nowrap"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Mark All Read ({unreadPartnerNotifCount})</span>
                    </button>
                  )}
                </div>

                <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-4">
                  <div className="flex flex-wrap items-center gap-1 p-1 bg-slate-100 border border-slate-200 rounded-xl w-fit">
                    {(
                      [
                        { id: 'all', label: 'All Alerts' },
                        { id: 'payout', label: 'Payouts' },
                        { id: 'course_approval', label: 'Course Approvals' },
                        { id: 'course_rejection', label: 'Revisions' },
                        { id: 'announcement', label: 'Announcements' },
                      ] as const
                    ).map((cat) => (
                      <button
                        key={cat.id}
                        type="button"
                        onClick={() => setNotifCategoryFilter(cat.id)}
                        className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
                          notifCategoryFilter === cat.id
                            ? 'bg-slate-900 text-white'
                            : 'text-slate-600 hover:text-slate-900'
                        }`}
                      >
                        {cat.label}
                      </button>
                    ))}
                  </div>

                  {filteredNotifications.length === 0 ? (
                    <div className="p-10 text-center border border-dashed border-slate-200 rounded-2xl space-y-2">
                      <Bell className="w-8 h-8 text-slate-400 mx-auto" />
                      <p className="text-sm font-semibold text-slate-700">
                        No partner notifications in this category
                      </p>
                      <p className="text-xs text-slate-500">
                        Alerts appear here whenever Admin approves a course or
                        clears a {partnerRoyaltyPct}% payout.
                      </p>
                    </div>
                  ) : (
                    <div className="divide-y divide-slate-200">
                      {filteredNotifications.map((notif) => {
                        const read = isNotifRead(notif);
                        return (
                          <div
                            key={notif.id}
                            className={`py-4 px-3 flex flex-col sm:flex-row sm:items-start justify-between gap-3 rounded-xl transition-colors ${
                              !read ? 'bg-emerald-50/50' : ''
                            }`}
                          >
                            <div className="space-y-1">
                              <div className="flex flex-wrap items-center gap-2 text-[11px] text-slate-500">
                                <span
                                  className={`font-bold ${
                                    notif.category === 'payout'
                                      ? 'text-emerald-700'
                                      : notif.category === 'course_approval'
                                        ? 'text-indigo-700'
                                        : notif.category === 'course_rejection'
                                          ? 'text-rose-700'
                                          : 'text-amber-700'
                                  }`}
                                >
                                  {notif.category === 'payout'
                                    ? 'Payout Settlement'
                                    : notif.category === 'course_approval'
                                      ? 'Course Approved'
                                      : notif.category === 'course_rejection'
                                        ? 'Revision Feedback'
                                        : notif.category === 'profile'
                                          ? 'Account & Bank'
                                          : 'Admin Broadcast'}
                                </span>
                                <span aria-hidden="true">·</span>
                                <span className="font-mono tabular-nums">
                                  {notif.timestamp}
                                </span>
                                {!read && (
                                  <>
                                    <span aria-hidden="true">·</span>
                                    <span className="text-emerald-700 font-bold">
                                      Unread
                                    </span>
                                  </>
                                )}
                              </div>
                              <h4 className="text-sm font-bold text-slate-900">
                                {notif.title}
                              </h4>
                              <p className="text-xs text-slate-600 leading-relaxed max-w-3xl">
                                {notif.message}
                              </p>
                            </div>

                            {!read && (
                              <button
                                type="button"
                                onClick={() =>
                                  handleMarkNotificationsRead(notif.id)
                                }
                                className="px-3 py-1.5 text-[11px] font-semibold text-emerald-700 bg-white hover:bg-slate-50 border border-slate-200 rounded-lg cursor-pointer shrink-0 self-start whitespace-nowrap"
                              >
                                Mark Read
                              </button>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};
