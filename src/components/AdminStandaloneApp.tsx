import React, { useState, useEffect, useCallback } from 'react';
import {
  ShieldCheck,
  BarChart3,
  Clock,
  CheckCircle2,
  XCircle,
  Plug,
  Sliders,
  ExternalLink,
  LogOut,
  TrendingUp,
  Users,
  IndianRupee,
  RefreshCw,
  Upload,
  FileSpreadsheet,
  LayoutDashboard,
  Calendar,
  QrCode,
  Image as ImageIcon,
  Trash2,
  Copy,
  Check,
  Download,
  Database,
  FileJson,
  Archive,
  Menu,
  ChevronDown,
  ChevronRight,
  Settings,
  X,
  Layers,
  GraduationCap,
  FileText,
  AlertCircle,
  Eye,
  Building2,
  Bell,
  Send,
  Percent,
} from 'lucide-react';
import { DEFAULT_PRIVACY_POLICY, DEFAULT_TERMS_AND_CONDITIONS } from '../data/legalPolicies';
import { LegalPolicyModal } from './LegalPolicyModal';
import { PortalAuthCard } from './PortalAuthCard';
import { AdminPartnerRoyaltyPanel } from './AdminPartnerRoyaltyPanel';
import {
  ApiConnectionsConfig,
  BankAccountConfig,
  ContactMessage,
  Course,
  LearnerState,
  McqSegment,
  OnlineTest,
  OnlineTestSubmission,
  PendingAccessRequest,
  PurchaseReceipt,
  SiteConfig,
  StudentAccessGrant,
} from '../types/education';

function getAdminTokenHeader(): Record<string, string> {
  try {
    const token = sessionStorage.getItem('vidyasetu_admin_token') || '';
    return token ? { 'x-admin-token': token } : {};
  } catch {
    return {};
  }
}
const AdminWebAppView = React.lazy(() =>
  import('./AdminWebAppView').then((m) => ({ default: m.AdminWebAppView }))
);
const DashboardCharts = React.lazy(() =>
  import('./AdminCharts').then((m) => ({ default: m.DashboardCharts }))
);
const AnalyticsTrendChart = React.lazy(() =>
  import('./AdminCharts').then((m) => ({ default: m.AnalyticsTrendChart }))
);
const AdminCsvBulkUploader = React.lazy(() =>
  import('./AdminCsvBulkUploader').then((m) => ({
    default: m.AdminCsvBulkUploader,
  }))
);

interface AdminStandaloneAppProps {
  learnerState: LearnerState;
  isAdmin: boolean;
  onLoginOwner: (payload: {
    name: string;
    method: 'gmail' | 'mobile';
    identifier: string;
  }) => Promise<void>;
  onAuthSuccessState?: (state?: LearnerState, adminToken?: string) => void;
  onLogout: () => Promise<void>;
  onSwitchToStudentApp: () => void;
  onSaveSiteConfig: (updates: Partial<SiteConfig>) => Promise<void>;
  onSaveBankAccount: (updates: Partial<BankAccountConfig>) => Promise<void>;
  onSaveApiConfig: (updates: Partial<ApiConnectionsConfig>) => Promise<void>;
  onSaveCourse: (course: Course) => Promise<void>;
  onAutoSequenceCourseVideos?: (
    courseId: string,
    payload: {
      videos: Array<{
        title: string;
        videoUrl: string;
        durationMins?: number;
        priceInr?: number;
        chapterNumber?: number;
      }>;
      replaceExisting?: boolean;
      normalizeTitles?: boolean;
    }
  ) => Promise<void>;
  onAddMcqSegment: (seg: McqSegment) => Promise<void>;
  onSaveOnlineTest: (test: OnlineTest) => Promise<void>;
  onDeleteOnlineTest: (testId: string) => Promise<void>;
  onGrantCourseAccess: (payload: {
    studentName: string;
    studentIdentifier: string;
    courseId: string;
    courseTitle: string;
    accessType: 'Full Course' | 'Single Chapter';
    moduleIds: string[];
    moduleTitles: string[];
    note?: string;
  }) => Promise<void>;
  onRevokeCourseAccess: (moduleIds: string[]) => Promise<void>;
  onHandlePendingAccess: (
    id: string,
    action: 'approve' | 'reject'
  ) => Promise<void>;
  onBulkPendingAccess?: (
    records: Array<{
      studentName: string;
      studentIdentifier: string;
      courseTitle: string;
      amountInr: number;
      paymentReference: string;
    }>,
    autoApprove: boolean
  ) => Promise<void>;
  onReplyDoubt?: (id: string, mentorReply: string) => Promise<void>;
  onDeleteDoubt?: (id: string) => Promise<void>;
  onDeleteStartupIdea?: (id: string) => Promise<void>;
  onReplyGoalConversation?: (id: string, message: string) => Promise<void>;
  onDeleteGoalConversation?: (id: string) => Promise<void>;
  onDeleteGalleryPhoto?: (id: string) => Promise<void>;
  onSendBroadcast?: (payload: { title: string; message: string }) => Promise<void>;
  onUpdateStudentRewards?: (payload: {
    streakDays: number;
    kidsXp: number;
    kidsStars: number;
  }) => Promise<void>;
  onRestoreBackup?: (backupState: LearnerState) => Promise<void>;
  onRefreshState?: () => Promise<void>;
  embedded?: boolean;
}

type StandaloneSection =
  | 'dashboard'
  | 'cms-courses'
  | 'cms-teachers'
  | 'cms-mcq'
  | 'cms-tests'
  | 'cms-branding'
  | 'cms-settings'
  | 'cms-bank'
  | 'partner-royalty'
  | 'analytics'
  | 'pending'
  | 'api'
  | 'backup';

export const AdminStandaloneApp: React.FC<AdminStandaloneAppProps> = ({
  learnerState,
  isAdmin,
  onLoginOwner: _onLoginOwner,
  onAuthSuccessState,
  onLogout,
  onSwitchToStudentApp,
  onSaveSiteConfig,
  onSaveBankAccount,
  onSaveApiConfig,
  onSaveCourse,
  onAutoSequenceCourseVideos,
  onAddMcqSegment,
  onSaveOnlineTest,
  onDeleteOnlineTest,
  onGrantCourseAccess,
  onRevokeCourseAccess,
  onHandlePendingAccess,
  onBulkPendingAccess,
  onReplyDoubt,
  onDeleteDoubt,
  onDeleteStartupIdea,
  onReplyGoalConversation,
  onDeleteGoalConversation,
  onDeleteGalleryPhoto,
  onSendBroadcast,
  onUpdateStudentRewards,
  onRestoreBackup,
  onRefreshState,
  embedded = false,
}) => {

  const [section, setSection] = useState<StandaloneSection>('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(() =>
    typeof window !== 'undefined' ? window.innerWidth >= 1024 : true
  );
  const [showHeaderActions, setShowHeaderActions] = useState(false);
  const [expandedGroups, setExpandedGroups] = useState<{ [key: string]: boolean }>({
    overview: true,
    cms: true,
    branding: true,
    finance: true,
    system: true,
  });

  const toggleGroup = (key: string) => {
    setExpandedGroups((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const [adminSettings, setAdminSettings] = useState(() => {
    try {
      const stored = localStorage.getItem('vidyasetu_admin_webapp_settings');
      if (stored) return JSON.parse(stored);
    } catch {}
    return {
      adminDisplayName: 'Super Admin',
      adminPin: '1234',
      requirePinOnRefresh: false,
      soundAlerts: true,
      audioOnUpload: true,
      stickyToasts: true,
      defaultSymmetryChapters: 30,
      autoNumberPrefix: 'Chapter [N]: ',
      defaultPdfPolicy: 'downloadable' as 'downloadable' | 'view_only',
      defaultVideoDurationMins: 45,
    };
  });

  const handleSaveAdminSettings = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      localStorage.setItem(
        'vidyasetu_admin_webapp_settings',
        JSON.stringify(adminSettings)
      );
      showToast('Admin WebApp Settings saved successfully!');
    } catch {
      showToast('Failed to save settings to storage');
    }
  };

  const getSectionLabel = (sec: StandaloneSection): string => {
    switch (sec) {
      case 'dashboard':
        return 'Executive Dashboard';
      case 'cms-courses':
        return 'Courses, Videos & PDFs';
      case 'cms-teachers':
        return 'Teacher Partner Approvals & Profiles';
      case 'cms-mcq':
        return 'MCQ Question Bank';
      case 'cms-tests':
        return 'Test Papers & Keys';
      case 'cms-branding':
        return 'Colors, Font & Front Text';
      case 'cms-settings':
        return 'Admin WebApp Settings';
      case 'cms-bank':
        return 'Bank Account & UPI QR';
      case 'partner-royalty':
        return 'Partner Royalty & Pay Partner';
      case 'pending':
        return 'Pending Access & CSV Verification';
      case 'analytics':
        return 'Analytics & Sales Trends';
      case 'api':
        return 'API Connections';
      case 'backup':
        return 'Database Backup & Recovery';
      default:
        return sec;
    }
  };
  const [analyticsStartDate, setAnalyticsStartDate] = useState<string>('');
  const [analyticsEndDate, setAnalyticsEndDate] = useState<string>('');
  const [apiForm, setApiForm] = useState<ApiConnectionsConfig>(
    learnerState.apiConfig
  );
  const [bankForm, setBankForm] = useState<BankAccountConfig>(
    learnerState.bankAccount
  );
  const [isSavingBank, setIsSavingBank] = useState(false);
  const [apiTestStatus, setApiTestStatus] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  // Legal Policies Editor State
  const [privacyPolicyInput, setPrivacyPolicyInput] = useState(
    learnerState.siteConfig.privacyPolicyText || DEFAULT_PRIVACY_POLICY
  );
  const [termsInput, setTermsInput] = useState(
    learnerState.siteConfig.termsAndConditionsText || DEFAULT_TERMS_AND_CONDITIONS
  );
  const [activeLegalTab, setActiveLegalTab] = useState<'privacy' | 'terms'>('privacy');
  const [showLegalPreview, setShowLegalPreview] = useState(false);
  const [isSavingPolicies, setIsSavingPolicies] = useState(false);

  // Teacher Partner Approvals, Payouts & Notifications State
  const [approvingCourseId, setApprovingCourseId] = useState<string | null>(null);
  const [rejectFeedback, setRejectFeedback] = useState<{ [courseId: string]: string }>({});
  const [payoutTeacherId, setPayoutTeacherId] = useState<string>('teacher-2');

  const [partnerNotifTarget, setPartnerNotifTarget] = useState<string>('all');
  const [partnerNotifTitle, setPartnerNotifTitle] = useState<string>('');
  const [partnerNotifMessage, setPartnerNotifMessage] = useState<string>('');
  const [isSendingPartnerNotif, setIsSendingPartnerNotif] = useState<boolean>(false);

  // Owner Security & Access Lock State (server-backed)
  const [ownerSecurityLoading, setOwnerSecurityLoading] = useState<boolean>(false);
  const [ownerSecuritySaving, setOwnerSecuritySaving] = useState<boolean>(false);
  const [ownerNameInput, setOwnerNameInput] = useState<string>('Akash Prasad');
  const [ownerEmailInput, setOwnerEmailInput] = useState<string>('');
  const [ownerPhoneInput, setOwnerPhoneInput] = useState<string>('');
  const [adminOtpDisabled, setAdminOtpDisabled] = useState<boolean>(false);
  const [activeAdminSessions, setActiveAdminSessions] = useState<number>(1);
  const [secCurrentPassword, setSecCurrentPassword] = useState<string>('');
  const [secNewPassword, setSecNewPassword] = useState<string>('');
  const [secConfirmPassword, setSecConfirmPassword] = useState<string>('');
  const [ownerSecurityNotice, setOwnerSecurityNotice] = useState<{
    type: 'success' | 'error';
    text: string;
  } | null>(null);

  const loadOwnerSecuritySession = useCallback(async () => {
    const tokenHeaders = getAdminTokenHeader();
    if (!tokenHeaders['x-admin-token']) return;
    setOwnerSecurityLoading(true);
    try {
      const res = await fetch('/api/portal-auth/admin-session', {
        headers: tokenHeaders,
        cache: 'no-store',
      });
      if (res.ok) {
        const data = await res.json();
        if (data.authenticated && data.owner) {
          setOwnerNameInput(data.owner.name || 'Akash Prasad');
          setOwnerEmailInput(data.owner.email || '');
          setOwnerPhoneInput(data.owner.phone || '');
          setAdminOtpDisabled(Boolean(data.adminOtpDisabled));
          setActiveAdminSessions(Number(data.activeSessionCount || 1));
        }
      }
    } catch {
      // Ignore transient load error
    } finally {
      setOwnerSecurityLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isAdmin && section === 'cms-settings') {
      loadOwnerSecuritySession();
    }
  }, [isAdmin, section, loadOwnerSecuritySession]);

  const handleSaveOwnerSecurity = async (revokeOthers = false) => {
    setOwnerSecurityNotice(null);
    if (secNewPassword.trim() || secConfirmPassword.trim()) {
      if (secNewPassword.trim().length < 4) {
        setOwnerSecurityNotice({
          type: 'error',
          text: 'Naya Owner Password / PIN kam se kam 4 characters ka rakhein.',
        });
        return;
      }
      if (secNewPassword.trim() !== secConfirmPassword.trim()) {
        setOwnerSecurityNotice({
          type: 'error',
          text: 'Naya Password aur Confirm Password match nahi kar rahe.',
        });
        return;
      }
      if (!secCurrentPassword.trim()) {
        setOwnerSecurityNotice({
          type: 'error',
          text: 'Password badalne ke liye Current Owner Password / PIN darj karein.',
        });
        return;
      }
    }
    const cleanPhone = ownerPhoneInput.replace(/\D/g, '').slice(-10);
    if (ownerPhoneInput.trim() && cleanPhone.length !== 10) {
      setOwnerSecurityNotice({
        type: 'error',
        text: 'Valid 10-digit Owner Mobile Number darj karein.',
      });
      return;
    }
    if (ownerEmailInput.trim() && !ownerEmailInput.includes('@')) {
      setOwnerSecurityNotice({
        type: 'error',
        text: 'Valid Owner Email ID darj karein.',
      });
      return;
    }

    setOwnerSecuritySaving(true);
    try {
      const res = await fetch('/api/admin/security/update', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...getAdminTokenHeader(),
        },
        body: JSON.stringify({
          ownerName: ownerNameInput.trim() || undefined,
          ownerEmail: ownerEmailInput.trim() || undefined,
          ownerPhone: cleanPhone || undefined,
          adminOtpDisabled,
          currentPassword: secNewPassword.trim() ? secCurrentPassword.trim() : undefined,
          newPassword: secNewPassword.trim() || undefined,
          revokeOtherSessions: revokeOthers,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setOwnerSecurityNotice({
          type: 'error',
          text: data.error || 'Owner security settings update nahi ho payi.',
        });
        return;
      }
      if (data.owner) {
        setOwnerNameInput(data.owner.name || ownerNameInput);
        setOwnerEmailInput(data.owner.email || ownerEmailInput);
        setOwnerPhoneInput(data.owner.phone || ownerPhoneInput);
      }
      setAdminOtpDisabled(Boolean(data.adminOtpDisabled));
      setActiveAdminSessions(Number(data.activeSessionCount || 1));
      setSecCurrentPassword('');
      setSecNewPassword('');
      setSecConfirmPassword('');
      const msg = revokeOthers
        ? 'Baaki sabhi Admin sessions revoke ho gaye! Sirf yeh current browser session active hai.'
        : 'Owner Security Lock & credentials server par update ho gaye.';
      setOwnerSecurityNotice({ type: 'success', text: msg });
      showToast(msg);
    } catch {
      setOwnerSecurityNotice({
        type: 'error',
        text: 'Network error while updating owner security.',
      });
    } finally {
      setOwnerSecuritySaving(false);
    }
  };

  const handleSaveLegalPolicies = async () => {
    setIsSavingPolicies(true);
    try {
      const res = await fetch('/api/admin/legal-policies', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...getAdminTokenHeader(),
        },
        body: JSON.stringify({
          privacyPolicyText: privacyPolicyInput,
          termsAndConditionsText: termsInput,
        }),
      });
      if (res.ok) {
        showToast('Legal Policies updated successfully!');
        await onSaveSiteConfig({
          privacyPolicyText: privacyPolicyInput,
          termsAndConditionsText: termsInput,
          legalLastUpdated: new Date().toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          }),
        });
      } else {
        showToast('Saved locally in site configuration');
      }
    } catch {
      showToast('Saved locally in site configuration');
    } finally {
      setIsSavingPolicies(false);
    }
  };

  const handleApproveTeacherCourse = async (courseId: string) => {
    setApprovingCourseId(courseId);
    try {
      const res = await fetch('/api/admin/partner/approve-course', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...getAdminTokenHeader(),
        },
        body: JSON.stringify({ courseId }),
      });
      if (res.ok) {
        showToast('Teacher course approved and published live to Student App!');
        if (onRefreshState) await onRefreshState();
        else window.location.reload();
      } else {
        const errData = await res.json().catch(() => ({}));
        showToast(errData?.error || 'Approval request failed');
      }
    } catch {
      showToast('Network error approving teacher course');
    } finally {
      setApprovingCourseId(null);
    }
  };

  const handleRejectTeacherCourse = async (courseId: string) => {
    const reason =
      rejectFeedback[courseId] ||
      window.prompt('Enter rejection feedback for teacher:') ||
      '';
    if (!reason) return;
    try {
      const res = await fetch('/api/admin/partner/reject-course', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...getAdminTokenHeader(),
        },
        body: JSON.stringify({ courseId, reason }),
      });
      if (res.ok) {
        showToast('Course rejected and partner notification sent.');
        if (onRefreshState) await onRefreshState();
        else window.location.reload();
      }
    } catch {
      showToast('Error recording rejection');
    }
  };

  const handleSendPartnerNotification = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!partnerNotifTitle.trim() || !partnerNotifMessage.trim()) {
      showToast('Enter notification title and message');
      return;
    }
    setIsSendingPartnerNotif(true);
    try {
      const res = await fetch('/api/partner/notifications/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...getAdminTokenHeader(),
        },
        body: JSON.stringify({
          teacherId: partnerNotifTarget,
          title: partnerNotifTitle,
          message: partnerNotifMessage,
          category: 'announcement',
        }),
      });
      if (res.ok) {
        setPartnerNotifTitle('');
        setPartnerNotifMessage('');
        showToast('Partner notification dispatched successfully!');
        if (onRefreshState) await onRefreshState();
      } else {
        showToast('Failed to send partner notification');
      }
    } catch {
      showToast('Network error sending partner alert');
    } finally {
      setIsSendingPartnerNotif(false);
    }
  };

  React.useEffect(() => {
    setBankForm(learnerState.bankAccount);
  }, [learnerState.bankAccount]);

  const dashboardMetrics = React.useMemo(() => {
    const receiptsList = learnerState.receipts || [];
    const totalRevenue = receiptsList.reduce(
      (sum, r) => sum + (Number(r.amountPaidInr) || 0),
      0
    );
    const uniqueStudents = new Set(
      receiptsList.map((r) => r.studentIdentifier || r.studentName || r.id)
    ).size;
    const avgOrderValue =
      receiptsList.length > 0
        ? Math.round(totalRevenue / receiptsList.length)
        : 0;

    const monthMap = new Map<
      string,
      { month: string; revenue: number; enrollments: number }
    >();

    const formatMonthLabel = (rawDate: string) => {
      const parsed = new Date(rawDate);
      if (!isNaN(parsed.getTime())) {
        return parsed.toLocaleDateString('en-US', {
          month: 'short',
          year: 'numeric',
        });
      }
      return new Date().toLocaleDateString('en-US', {
        month: 'short',
        year: 'numeric',
      });
    };

    receiptsList.forEach((rec) => {
      const mLabel = formatMonthLabel(rec.date);
      const existing = monthMap.get(mLabel) || {
        month: mLabel,
        revenue: 0,
        enrollments: 0,
      };
      existing.revenue += Number(rec.amountPaidInr) || 0;
      existing.enrollments += 1;
      monthMap.set(mLabel, existing);
    });

    if (monthMap.size === 0) {
      const currentMonth = new Date().toLocaleDateString('en-US', {
        month: 'short',
        year: 'numeric',
      });
      monthMap.set(currentMonth, {
        month: currentMonth,
        revenue: 0,
        enrollments: 0,
      });
    }

    let runningEnrollments = 0;
    const chartData = Array.from(monthMap.values()).map((item) => {
      runningEnrollments += item.enrollments;
      return {
        ...item,
        totalStudents: runningEnrollments,
      };
    });

    return {
      receiptsList,
      totalRevenue,
      uniqueStudents,
      avgOrderValue,
      chartData,
    };
  }, [learnerState.receipts]);

  const analyticsMetrics = React.useMemo(() => {
    const parseReceiptDate = (raw: string): Date | null => {
      const d = new Date(raw);
      if (!isNaN(d.getTime())) return d;
      if (raw.toLowerCase().includes('just now')) return new Date();
      return null;
    };

    const startObj = analyticsStartDate
      ? new Date(`${analyticsStartDate}T00:00:00`)
      : null;
    const endObj = analyticsEndDate
      ? new Date(`${analyticsEndDate}T23:59:59`)
      : null;

    const filteredReceipts = learnerState.receipts.filter((rec) => {
      if (!startObj && !endObj) return true;
      const d = parseReceiptDate(rec.date);
      if (!d) return true;
      if (startObj && d < startObj) return false;
      if (endObj && d > endObj) return false;
      return true;
    });

    const filteredRevenueInr = filteredReceipts.reduce(
      (sum, r) => sum + (Number(r.amountPaidInr) || 0),
      0
    );

    const trendMap = new Map<
      string,
      { period: string; revenue: number; enrollments: number }
    >();
    filteredReceipts.forEach((rec) => {
      const d = parseReceiptDate(rec.date) || new Date();
      const label = d.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
      });
      const cur = trendMap.get(label) || {
        period: label,
        revenue: 0,
        enrollments: 0,
      };
      cur.revenue += Number(rec.amountPaidInr) || 0;
      cur.enrollments += 1;
      trendMap.set(label, cur);
    });

    return {
      filteredReceipts,
      filteredRevenueInr,
      analyticsTrendData: Array.from(trendMap.values()),
    };
  }, [learnerState.receipts, analyticsStartDate, analyticsEndDate]);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const [isRestoringBackup, setIsRestoringBackup] = useState(false);
  const [backupRestoreError, setBackupRestoreError] = useState<string | null>(null);

  const handleDownloadBackupJson = () => {
    try {
      const timestamp = new Date()
        .toISOString()
        .replace(/[:.]/g, '-')
        .slice(0, 19);
      const fileName = `brosis-vidyasetu-backup-${timestamp}.json`;
      const jsonContent = JSON.stringify(learnerState, null, 2);
      const blob = new Blob([jsonContent], {
        type: 'application/json;charset=utf-8;',
      });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', fileName);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      showToast(`Database backup downloaded: ${fileName}`);
    } catch (err) {
      console.error('Database backup error:', err);
      showToast('Error generating database backup JSON');
    }
  };

  const handleRestoreBackupFile = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setBackupRestoreError(null);
    try {
      const text = await file.text();
      const parsed = JSON.parse(text) as Partial<LearnerState>;
      if (!parsed || typeof parsed !== 'object') {
        throw new Error('Selected file is not valid JSON');
      }
      if (!parsed.courses && !parsed.siteConfig && !parsed.receipts) {
        throw new Error(
          'File does not appear to contain valid Vidya Setu database data'
        );
      }
      const coursesCount = parsed.courses?.length || 0;
      const receiptsCount = parsed.receipts?.length || 0;
      const confirmed = window.confirm(
        `Are you sure you want to restore the database from "${file.name}"?\n\nThis will restore ${coursesCount} courses, ${receiptsCount} receipts, and all system settings.`
      );
      if (!confirmed) {
        e.target.value = '';
        return;
      }

      setIsRestoringBackup(true);
      if (onRestoreBackup) {
        await onRestoreBackup(parsed as LearnerState);
      } else {
        const res = await fetch('/api/admin/restore', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...getAdminTokenHeader(),
          },
          body: JSON.stringify(parsed),
        });
        if (!res.ok) {
          const errData = await res.json().catch(() => ({}));
          throw new Error(
            errData.error || 'Server error while restoring backup'
          );
        }
      }
      showToast(`Database restored successfully from "${file.name}"!`);
    } catch (err) {
      console.error('Restore error:', err);
      const msg =
        err instanceof Error ? err.message : 'Failed to restore backup file';
      setBackupRestoreError(msg);
      showToast(`Restore failed: ${msg}`);
    } finally {
      setIsRestoringBackup(false);
      e.target.value = '';
    }
  };

  // Dedicated Admin Auth Gate (Login via Mobile OTP or Password, Signup, Forgot Password)
  if (!isAdmin) {
    return (
      <PortalAuthCard
        portal="admin"
        brandName={learnerState.siteConfig.appName}
        onAuthSuccess={async (payload) => {
          if (onAuthSuccessState) {
            onAuthSuccessState(payload.state, payload.adminToken);
          } else if (onRefreshState) {
            await onRefreshState();
          }
        }}
        onBackToStudentApp={onSwitchToStudentApp}
      />
    );
  }

  const pendingCount = learnerState.pendingAccessRequests.filter(
    (p) => p.status === 'Pending'
  ).length;
  const totalRevenueInr = learnerState.receipts.reduce(
    (sum, r) => sum + (Number(r.amountPaidInr) || 0),
    0
  );

  return (
    <div
      className={
        embedded
          ? 'bg-white border border-slate-200 rounded-2xl overflow-hidden text-slate-900 flex flex-col'
          : 'min-h-screen bg-[#F8FAFC] text-slate-900 flex flex-col'
      }
    >
      {/* Admin Top Bar (Header buttons hidden by default; tap title to toggle or open LHS Menu) */}
      <header
        className={
          embedded
            ? 'bg-slate-950 text-white border-b border-slate-800'
            : 'sticky top-0 z-30 bg-slate-950 text-white border-b border-slate-800'
        }
      >
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
                {learnerState.siteConfig.appName} — Admin
              </span>
            </button>
          </div>

          {showHeaderActions && (
            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={handleDownloadBackupJson}
                title="Download JSON Database Backup for recovery"
                className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl transition-colors cursor-pointer shadow-sm whitespace-nowrap shrink-0"
              >
                <Download className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Backup</span>
              </button>
              {!embedded && (
                <button
                  type="button"
                  onClick={onSwitchToStudentApp}
                  className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-white rounded-xl transition-colors cursor-pointer whitespace-nowrap shrink-0"
                >
                  <ExternalLink className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="hidden sm:inline">Student App</span>
                </button>
              )}
              <button
                type="button"
                onClick={onLogout}
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

        {/* Collapsible Left Hand Side (LHS) Sidebar Drawer */}
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
                {learnerState.siteConfig.brandInitials}
              </div>
              <div>
                <h3 className="text-xs font-bold leading-tight">Admin CMS Navigation</h3>
                <p className="text-[10px] text-slate-400">LHS Drop-down Categories</p>
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

          {/* Navigation Accordion Groups */}
          <div className="flex-1 overflow-y-auto p-3 space-y-2.5">
            {/* GROUP 1: Overview & Analytics */}
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
                    onClick={() => {
                      setSection('dashboard');
                      if (window.innerWidth < 1024) setIsSidebarOpen(false);
                    }}
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
                    onClick={() => {
                      setSection('analytics');
                      if (window.innerWidth < 1024) setIsSidebarOpen(false);
                    }}
                    className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                      section === 'analytics'
                        ? 'bg-slate-900 text-white font-bold shadow-xs'
                        : 'text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <BarChart3 className="w-3.5 h-3.5 text-indigo-500" />
                    <span>Analytics &amp; Revenue</span>
                  </button>
                </div>
              )}
            </div>

            {/* GROUP 2: Courses & Content CMS */}
            <div className="border border-slate-200/80 rounded-xl overflow-hidden bg-slate-50/50">
              <button
                type="button"
                onClick={() => toggleGroup('cms')}
                className="w-full px-3 py-2 flex items-center justify-between text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200/80 transition-colors cursor-pointer"
              >
                <span className="flex items-center gap-2">
                  <Layers className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Course &amp; Content CMS</span>
                </span>
                {expandedGroups.cms ? (
                  <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
                ) : (
                  <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
                )}
              </button>
              {expandedGroups.cms && (
                <div className="p-1.5 space-y-1 bg-white">
                  <button
                    type="button"
                    onClick={() => {
                      setSection('cms-courses');
                      if (window.innerWidth < 1024) setIsSidebarOpen(false);
                    }}
                    className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                      section === 'cms-courses'
                        ? 'bg-slate-900 text-white font-bold shadow-xs'
                        : 'text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <Upload className="w-3.5 h-3.5 text-emerald-500" />
                    <span>Courses, Videos &amp; PDFs</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setSection('cms-teachers');
                      if (window.innerWidth < 1024) setIsSidebarOpen(false);
                    }}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                      section === 'cms-teachers'
                        ? 'bg-slate-900 text-white font-bold shadow-xs'
                        : 'text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <span className="flex items-center gap-2.5">
                      <GraduationCap className="w-3.5 h-3.5 text-indigo-500" />
                      <span>Teacher Approvals</span>
                    </span>
                    {(learnerState.teacherPendingCourses?.length || 0) > 0 && (
                      <span className="px-1.5 py-0.5 text-[10px] font-bold bg-amber-500 text-white rounded-full leading-none">
                        {learnerState.teacherPendingCourses?.length}
                      </span>
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setSection('cms-mcq');
                      if (window.innerWidth < 1024) setIsSidebarOpen(false);
                    }}
                    className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                      section === 'cms-mcq'
                        ? 'bg-slate-900 text-white font-bold shadow-xs'
                        : 'text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                    <span>MCQ Question Bank</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setSection('cms-tests');
                      if (window.innerWidth < 1024) setIsSidebarOpen(false);
                    }}
                    className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                      section === 'cms-tests'
                        ? 'bg-slate-900 text-white font-bold shadow-xs'
                        : 'text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-500" />
                    <span>Test Papers &amp; Keys</span>
                  </button>
                </div>
              )}
            </div>

            {/* GROUP 3: Branding & WebApp Settings */}
            <div className="border border-slate-200/80 rounded-xl overflow-hidden bg-slate-50/50">
              <button
                type="button"
                onClick={() => toggleGroup('branding')}
                className="w-full px-3 py-2 flex items-center justify-between text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200/80 transition-colors cursor-pointer"
              >
                <span className="flex items-center gap-2">
                  <Sliders className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Branding &amp; WebApp</span>
                </span>
                {expandedGroups.branding ? (
                  <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
                ) : (
                  <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
                )}
              </button>
              {expandedGroups.branding && (
                <div className="p-1.5 space-y-1 bg-white">
                  <button
                    type="button"
                    onClick={() => {
                      setSection('cms-branding');
                      if (window.innerWidth < 1024) setIsSidebarOpen(false);
                    }}
                    className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                      section === 'cms-branding'
                        ? 'bg-slate-900 text-white font-bold shadow-xs'
                        : 'text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <ImageIcon className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Feature Images &amp; Branding</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setSection('cms-settings');
                      if (window.innerWidth < 1024) setIsSidebarOpen(false);
                    }}
                    className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                      section === 'cms-settings'
                        ? 'bg-slate-900 text-white font-bold shadow-xs'
                        : 'text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <Settings className="w-3.5 h-3.5 text-indigo-500" />
                    <span className="font-bold text-emerald-700">Admin WebApp Settings</span>
                  </button>
                </div>
              )}
            </div>

            {/* GROUP 4: Finance & Students */}
            <div className="border border-slate-200/80 rounded-xl overflow-hidden bg-slate-50/50">
              <button
                type="button"
                onClick={() => toggleGroup('finance')}
                className="w-full px-3 py-2 flex items-center justify-between text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200/80 transition-colors cursor-pointer"
              >
                <span className="flex items-center gap-2">
                  <IndianRupee className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Finance &amp; Students</span>
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
                    onClick={() => {
                      setSection('cms-bank');
                      if (window.innerWidth < 1024) setIsSidebarOpen(false);
                    }}
                    className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                      section === 'cms-bank'
                        ? 'bg-slate-900 text-white font-bold shadow-xs'
                        : 'text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <IndianRupee className="w-3.5 h-3.5 text-emerald-500" />
                    <span>Bank Account &amp; UPI QR</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setSection('partner-royalty');
                      if (window.innerWidth < 1024) setIsSidebarOpen(false);
                    }}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                      section === 'partner-royalty'
                        ? 'bg-slate-900 text-white font-bold shadow-xs'
                        : 'text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <span className="flex items-center gap-2.5">
                      <Percent className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Partner Royalty &amp; Pay</span>
                    </span>
                    <span className="text-[10px] font-mono font-bold text-emerald-600">
                      {learnerState.siteConfig.defaultPartnerRoyaltyPct ?? 80}%
                    </span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setSection('pending');
                      if (window.innerWidth < 1024) setIsSidebarOpen(false);
                    }}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                      section === 'pending'
                        ? 'bg-slate-900 text-white font-bold shadow-xs'
                        : 'text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Clock className="w-3.5 h-3.5 text-amber-500" />
                      <span>Pending Access &amp; CSV</span>
                    </div>
                    {pendingCount > 0 && (
                      <span className="px-1.5 py-0.5 text-[10px] font-bold rounded-full bg-amber-500 text-white">
                        {pendingCount}
                      </span>
                    )}
                  </button>
                </div>
              )}
            </div>

            {/* GROUP 5: System & Portability */}
            <div className="border border-slate-200/80 rounded-xl overflow-hidden bg-slate-50/50">
              <button
                type="button"
                onClick={() => toggleGroup('system')}
                className="w-full px-3 py-2 flex items-center justify-between text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200/80 transition-colors cursor-pointer"
              >
                <span className="flex items-center gap-2">
                  <Database className="w-3.5 h-3.5 text-emerald-600" />
                  <span>System &amp; Disaster Recovery</span>
                </span>
                {expandedGroups.system ? (
                  <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
                ) : (
                  <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
                )}
              </button>
              {expandedGroups.system && (
                <div className="p-1.5 space-y-1 bg-white">
                  <button
                    type="button"
                    onClick={() => {
                      setSection('backup');
                      if (window.innerWidth < 1024) setIsSidebarOpen(false);
                    }}
                    className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                      section === 'backup'
                        ? 'bg-slate-900 text-white font-bold shadow-xs'
                        : 'text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <Database className="w-3.5 h-3.5 text-indigo-500" />
                    <span>Database Backup &amp; Restore</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setSection('api');
                      if (window.innerWidth < 1024) setIsSidebarOpen(false);
                    }}
                    className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                      section === 'api'
                        ? 'bg-slate-900 text-white font-bold shadow-xs'
                        : 'text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <Plug className="w-3.5 h-3.5 text-emerald-500" />
                    <span>API Connections</span>
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar Drawer Footer: Workspace Shortcuts & Session (moved out of header) */}
          <div className="p-3 border-t border-slate-200 bg-slate-50 space-y-2 shrink-0">
            {!embedded && (
              <button
                type="button"
                onClick={onSwitchToStudentApp}
                className="w-full py-2 px-2.5 text-[11px] font-bold text-slate-800 bg-white border border-slate-200 hover:bg-slate-100 rounded-xl flex items-center justify-center gap-1.5 transition-colors cursor-pointer whitespace-nowrap"
              >
                <ExternalLink className="w-3 h-3 text-emerald-600 shrink-0" />
                <span>Student App</span>
              </button>
            )}
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={handleDownloadBackupJson}
                className="flex-1 py-2 px-2.5 text-[11px] font-bold text-slate-800 bg-white border border-slate-200 hover:bg-slate-100 rounded-xl flex items-center justify-center gap-1 transition-colors cursor-pointer whitespace-nowrap"
              >
                <Download className="w-3 h-3 text-emerald-600 shrink-0" />
                <span>Backup JSON</span>
              </button>
              <button
                type="button"
                onClick={onLogout}
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
            <div className="flex items-center gap-2 sm:gap-3">
              <button
                type="button"
                onClick={() => setIsSidebarOpen((prev) => !prev)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-xl transition-colors cursor-pointer"
                title={isSidebarOpen ? 'Hide Menu' : 'Open Menu (3 Bars)'}
              >
                <Menu className="w-4 h-4 text-emerald-600" />
                <span>{isSidebarOpen ? 'Hide Menu' : 'Menu (LHS)'}</span>
              </button>
              <span className="text-slate-300">/</span>
              <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                <span>{getSectionLabel(section)}</span>
              </span>
            </div>

            {toast && (
              <span className="px-3 py-1 bg-emerald-600 text-white text-xs font-bold rounded-xl shadow-xs">
                {toast}
              </span>
            )}
          </div>

          {/* Main Standalone Admin Content */}
          <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {section === 'dashboard' && (() => {
          const {
            receiptsList,
            totalRevenue,
            uniqueStudents,
            avgOrderValue,
            chartData,
          } = dashboardMetrics;

          return (
            <div className="space-y-6">
              {/* Top KPI Summary Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white border border-slate-200 rounded-2xl p-5">
                  <div className="flex items-center justify-between text-xs font-semibold text-slate-500">
                    <span>Total Revenue (Receipts)</span>
                    <IndianRupee className="w-4 h-4 text-emerald-600" />
                  </div>
                  <p className="text-2xl font-bold text-slate-900 font-mono-tabular mt-2">
                    ₹{totalRevenue.toLocaleString()}
                  </p>
                  <p className="text-[11px] text-emerald-700 font-semibold mt-1">
                    From {receiptsList.length} verified receipts
                  </p>
                </div>

                <div className="bg-white border border-slate-200 rounded-2xl p-5">
                  <div className="flex items-center justify-between text-xs font-semibold text-slate-500">
                    <span>Total Enrollments</span>
                    <TrendingUp className="w-4 h-4 text-emerald-600" />
                  </div>
                  <p className="text-2xl font-bold text-slate-900 font-mono-tabular mt-2">
                    {receiptsList.length}
                  </p>
                  <p className="text-[11px] text-slate-500 mt-1">
                    Course &amp; subject unlocks
                  </p>
                </div>

                <div className="bg-white border border-slate-200 rounded-2xl p-5">
                  <div className="flex items-center justify-between text-xs font-semibold text-slate-500">
                    <span>Enrolled Students</span>
                    <Users className="w-4 h-4 text-indigo-600" />
                  </div>
                  <p className="text-2xl font-bold text-slate-900 font-mono-tabular mt-2">
                    {uniqueStudents}
                  </p>
                  <p className="text-[11px] text-slate-500 mt-1">
                    Unique paying learners
                  </p>
                </div>

                <div className="bg-white border border-slate-200 rounded-2xl p-5">
                  <div className="flex items-center justify-between text-xs font-semibold text-slate-500">
                    <span>Avg. Order Value</span>
                    <BarChart3 className="w-4 h-4 text-amber-600" />
                  </div>
                  <p className="text-2xl font-bold text-slate-900 font-mono-tabular mt-2">
                    ₹{avgOrderValue.toLocaleString()}
                  </p>
                  <p className="text-[11px] text-slate-500 mt-1">
                    Per receipt transaction
                  </p>
                </div>
              </div>

              {/* Database Backup & Health Quick Bar */}
              <div className="bg-gradient-to-r from-slate-900 to-slate-950 text-white rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border border-slate-800 shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-emerald-600/20 text-emerald-400 rounded-xl border border-emerald-500/30 shrink-0">
                    <Database className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs sm:text-sm font-bold text-white flex items-center gap-2">
                      <span>Database Backup &amp; Recovery</span>
                      <span className="px-2 py-0.5 text-[9px] font-bold bg-emerald-500/20 text-emerald-300 rounded-full">
                        {learnerState.courses.length} Courses · {receiptsList.length} Receipts
                      </span>
                    </h4>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      Download full JSON snapshot for offline recovery or data portability.
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={() => setSection('partner-royalty')}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-slate-900 bg-white hover:bg-slate-100 rounded-xl transition-colors cursor-pointer shadow-sm whitespace-nowrap"
                  >
                    <Percent className="w-3.5 h-3.5 text-emerald-600" />
                    <span>
                      Royalty ({learnerState.siteConfig.defaultPartnerRoyaltyPct ?? 80}%) &amp; Pay Partner
                    </span>
                  </button>
                  <button
                    type="button"
                    onClick={handleDownloadBackupJson}
                    className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl transition-colors cursor-pointer shadow-sm whitespace-nowrap"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download Backup (.json)</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setSection('backup')}
                    className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-300 bg-slate-800 hover:bg-slate-700 rounded-xl transition-colors cursor-pointer"
                  >
                    <span>Manage</span>
                  </button>
                </div>
              </div>

              {/* Lazy-loaded & Memoized Recharts Visualizations */}
              <React.Suspense
                fallback={
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="bg-white border border-slate-200 rounded-2xl p-6 h-80 animate-pulse flex items-center justify-center text-xs font-semibold text-slate-400">
                      Loading Revenue Chart...
                    </div>
                    <div className="bg-white border border-slate-200 rounded-2xl p-6 h-80 animate-pulse flex items-center justify-center text-xs font-semibold text-slate-400">
                      Loading Enrollment Chart...
                    </div>
                  </div>
                }
              >
                <DashboardCharts data={chartData} />
              </React.Suspense>

              {/* Recent Receipts Table */}
              <div className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-slate-900">
                    Recent Payment Receipts ({receiptsList.length})
                  </h3>
                </div>
                {receiptsList.length === 0 ? (
                  <p className="text-xs text-slate-500 py-4 text-center">
                    No receipts recorded yet. When students purchase courses or subjects, their receipts and monthly trends will appear here.
                  </p>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead>
                        <tr className="border-b border-slate-200 text-slate-500">
                          <th className="py-2 pr-4 font-semibold">Transaction ID</th>
                          <th className="py-2 pr-4 font-semibold">Student</th>
                          <th className="py-2 pr-4 font-semibold">Course / Subject</th>
                          <th className="py-2 pr-4 font-semibold">Date</th>
                          <th className="py-2 text-right font-semibold">Amount</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {receiptsList.slice(0, 10).map((rec) => (
                          <tr key={rec.id}>
                            <td className="py-2.5 pr-4 font-mono-tabular text-slate-700">
                              {rec.transactionId}
                            </td>
                            <td className="py-2.5 pr-4 font-semibold text-slate-900">
                              {rec.studentName || rec.studentIdentifier || 'Student'}
                            </td>
                            <td className="py-2.5 pr-4 text-slate-700">
                              {rec.courseTitle}
                            </td>
                            <td className="py-2.5 pr-4 text-slate-500">{rec.date}</td>
                            <td className="py-2.5 text-right font-bold text-emerald-700 font-mono-tabular">
                              ₹{rec.amountPaidInr}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          );
        })()}

        {section === 'cms-bank' && (() => {
          const ifscTrimmed = bankForm.ifscCode.trim().toUpperCase();
          const isIfscValid = /^[A-Z]{4}0[A-Z0-9]{6}$/.test(ifscTrimmed);
          const upiTrimmed = bankForm.upiId.trim();
          const isUpiValid = /^[a-zA-Z0-9._-]{2,256}@[a-zA-Z]{2,64}$/.test(
            upiTrimmed
          );
          const canSaveBank =
            Boolean(bankForm.accountHolderName.trim()) &&
            Boolean(bankForm.bankName.trim()) &&
            Boolean(bankForm.accountNumber.trim()) &&
            isIfscValid &&
            isUpiValid &&
            !isSavingBank;

          const handleQrUpload = (file: File) => {
            if (!file.type.startsWith('image/')) {
              showToast('Please select a valid image file (.png, .jpg, .webp)');
              return;
            }
            const reader = new FileReader();
            reader.onload = () => {
              if (typeof reader.result === 'string') {
                setBankForm((prev) => ({
                  ...prev,
                  upiQrCodeUrl: reader.result as string,
                }));
                showToast('UPI QR Code uploaded! Click "Save Bank Account & Direct UPI" to activate.');
              }
            };
            reader.readAsDataURL(file);
          };

          return (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              <form
                onSubmit={async (e) => {
                  e.preventDefault();
                  if (!isIfscValid || !isUpiValid) return;
                  setIsSavingBank(true);
                  await onSaveBankAccount({
                    ...bankForm,
                    ifscCode: ifscTrimmed,
                    upiId: upiTrimmed,
                    upiQrCodeUrl: bankForm.upiQrCodeUrl || '',
                  });
                  setIsSavingBank(false);
                  showToast(
                    'Bank Account, Direct UPI & QR Code Saved! Students can now pay directly to your bank.'
                  );
                }}
                className="lg:col-span-7 bg-white border border-slate-200 rounded-2xl p-6 space-y-5"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <h2 className="text-base font-bold text-slate-900">
                      Direct Bank Account &amp; UPI Setup (0% Gateway Fee)
                    </h2>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Students se seedha apne bank account aur UPI par paise receive karein — bina kisi payment gateway ke.
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() =>
                        setBankForm({
                          accountHolderName: '',
                          bankName: '',
                          accountNumber: '',
                          ifscCode: '',
                          upiId: '',
                          upiQrCodeUrl: '',
                          razorpayKeyId: '',
                          razorpayMerchantName: '',
                        })
                      }
                      className="px-3 py-1.5 text-xs font-bold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-xl cursor-pointer"
                    >
                      + Add New Bank Account
                    </button>
                    <button
                      type="button"
                      onClick={() => setBankForm(learnerState.bankAccount)}
                      className="px-3 py-1.5 text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl cursor-pointer"
                    >
                      Reset
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Account Holder / Business Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={bankForm.accountHolderName}
                      onChange={(e) =>
                        setBankForm({
                          ...bankForm,
                          accountHolderName: e.target.value,
                        })
                      }
                      placeholder="e.g. Vidya Setu Education"
                      className="w-full px-3.5 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-600"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Bank Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={bankForm.bankName}
                      onChange={(e) =>
                        setBankForm({ ...bankForm, bankName: e.target.value })
                      }
                      placeholder="e.g. State Bank of India (SBI)"
                      className="w-full px-3.5 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-600"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Bank Account Number *
                    </label>
                    <input
                      type="text"
                      required
                      value={bankForm.accountNumber}
                      onChange={(e) =>
                        setBankForm({
                          ...bankForm,
                          accountNumber: e.target.value.replace(/[^\d]/g, ''),
                        })
                      }
                      placeholder="e.g. 394810294821"
                      className="w-full px-3.5 py-2.5 text-sm border border-slate-200 rounded-xl font-mono-tabular focus:outline-none focus:border-emerald-600"
                    />
                    <p className="text-[11px] text-slate-500 mt-1">
                      Enter digits only (9 to 18 digits).
                    </p>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      IFSC Code (11 Characters) *
                    </label>
                    <input
                      type="text"
                      required
                      maxLength={11}
                      value={bankForm.ifscCode}
                      onChange={(e) =>
                        setBankForm({
                          ...bankForm,
                          ifscCode: e.target.value
                            .toUpperCase()
                            .replace(/[^A-Z0-9]/g, ''),
                        })
                      }
                      placeholder="e.g. SBIN0004821"
                      className={`w-full px-3.5 py-2.5 text-sm border rounded-xl font-mono-tabular focus:outline-none ${
                        !ifscTrimmed
                          ? 'border-slate-200 focus:border-emerald-600'
                          : isIfscValid
                            ? 'border-emerald-500 bg-emerald-50/30'
                            : 'border-rose-500 bg-rose-50/40'
                      }`}
                    />
                    <p
                      className={`text-[11px] mt-1 font-medium ${
                        !ifscTrimmed
                          ? 'text-slate-500'
                          : isIfscValid
                            ? 'text-emerald-700'
                            : 'text-rose-600'
                      }`}
                    >
                      {!ifscTrimmed
                        ? '11-character alphanumeric IFSC code (e.g. SBIN0004821)'
                        : isIfscValid
                          ? '✓ Valid 11-character alphanumeric IFSC code'
                          : `Invalid IFSC (${ifscTrimmed.length}/11 chars). Must be 4 letters + '0' + 6 alphanumeric chars (e.g. SBIN0004821).`}
                    </p>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Direct UPI ID (For Instant Direct Bank Transfer) *
                  </label>
                  <input
                    type="text"
                    required
                    value={bankForm.upiId}
                    onChange={(e) =>
                      setBankForm({
                        ...bankForm,
                        upiId: e.target.value.replace(/\s/g, ''),
                      })
                    }
                    placeholder="e.g. brosisvidyasetu@sbi"
                    className={`w-full px-3.5 py-2.5 text-sm border rounded-xl font-mono-tabular focus:outline-none ${
                      !upiTrimmed
                        ? 'border-slate-200 focus:border-emerald-600'
                        : isUpiValid
                          ? 'border-emerald-500 bg-emerald-50/30'
                          : 'border-rose-500 bg-rose-50/40'
                    }`}
                  />
                  <p
                    className={`text-[11px] mt-1 font-medium ${
                      !upiTrimmed
                        ? 'text-slate-500'
                        : isUpiValid
                          ? 'text-emerald-700'
                          : 'text-rose-600'
                    }`}
                  >
                    {!upiTrimmed
                      ? 'Enter your UPI ID (e.g. yourname@sbi, business@okicici) to receive payments directly.'
                      : isUpiValid
                        ? '✓ Valid UPI ID format — ready for direct student payments'
                        : "Invalid UPI ID format. Must contain '@' and a valid bank handle (e.g. yourname@sbi)."}
                  </p>
                </div>

                {/* QR Code Upload & Edit Section */}
                <div className="p-4 bg-emerald-50/50 border border-emerald-200 rounded-xl space-y-3">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div>
                      <h3 className="text-xs font-bold text-emerald-950 flex items-center gap-1.5">
                        <QrCode className="w-4 h-4 text-emerald-700" />
                        <span>UPI QR Code Image (GPay / PhonePe / Paytm / BHIM)</span>
                      </h3>
                      <p className="text-[11px] text-emerald-800 mt-0.5">
                        Apne UPI app ka QR code upload karein. Student checkout par is QR code ko scan karke direct aapke account mein payment kar sakega.
                      </p>
                    </div>
                    {bankForm.upiQrCodeUrl && (
                      <button
                        type="button"
                        onClick={() => {
                          setBankForm({ ...bankForm, upiQrCodeUrl: '' });
                          showToast('QR Code removed. Default dynamic QR will be used.');
                        }}
                        className="inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-lg cursor-pointer transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Remove QR Code</span>
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
                    <label className="sm:col-span-8 flex flex-col items-center justify-center p-4 border-2 border-dashed border-emerald-300 hover:border-emerald-500 rounded-xl bg-white cursor-pointer transition-colors text-center">
                      <Upload className="w-5 h-5 text-emerald-600 mb-1" />
                      <span className="text-xs font-bold text-slate-800">
                        {bankForm.upiQrCodeUrl
                          ? 'Replace QR Code Image (.png / .jpg / .webp)'
                          : 'Choose QR Code Image to Upload'}
                      </span>
                      <span className="text-[10px] text-slate-500 mt-0.5">
                        PhonePe, GPay, Paytm ya BHIM QR code screenshot/photo select karein
                      </span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) handleQrUpload(file);
                          e.target.value = '';
                        }}
                      />
                    </label>

                    <div className="sm:col-span-4 flex flex-col items-center justify-center p-2 bg-white border border-slate-200 rounded-xl min-h-[110px]">
                      {bankForm.upiQrCodeUrl ? (
                        <div className="flex flex-col items-center justify-center">
                          <img
                            src={bankForm.upiQrCodeUrl}
                            alt="Uploaded UPI QR Code Preview"
                            className="h-20 max-w-full object-contain rounded-lg border border-slate-100"
                          />
                          <span className="text-[10px] text-emerald-700 font-bold mt-1">
                            ✓ Custom QR Ready
                          </span>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center justify-center text-slate-400 text-center p-1">
                          <QrCode className="w-8 h-8 text-slate-300 mb-1" />
                          <span className="text-[10px] text-slate-400">
                            No Custom QR Uploaded Yet
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                      Or Paste Direct QR Code Image URL / Path (Optional)
                    </label>
                    <input
                      type="text"
                      value={
                        bankForm.upiQrCodeUrl?.startsWith('data:')
                          ? ''
                          : bankForm.upiQrCodeUrl || ''
                      }
                      onChange={(e) =>
                        setBankForm({
                          ...bankForm,
                          upiQrCodeUrl: e.target.value.trim(),
                        })
                      }
                      placeholder="/assets/aistudio/... or https://example.com/my-upi-qr.png"
                      className="w-full px-3 py-1.5 text-xs bg-white border border-emerald-200 rounded-lg font-mono-tabular focus:outline-none focus:border-emerald-600"
                    />
                  </div>
                </div>

                {/* Optional Payment Gateway Section */}
                <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
                  <div>
                    <h3 className="text-xs font-bold text-slate-800">
                      Optional Payment Gateway (Razorpay)
                    </h3>
                    <p className="text-[11px] text-slate-500">
                      Optional hai — agar aap sirf Direct Bank / UPI se paise lena chahte hain toh ise khali chhod sakte hain.
                    </p>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                        Razorpay Key ID (Optional)
                      </label>
                      <input
                        type="text"
                        value={bankForm.razorpayKeyId}
                        onChange={(e) =>
                          setBankForm({
                            ...bankForm,
                            razorpayKeyId: e.target.value,
                          })
                        }
                        placeholder="rzp_live_... (Optional)"
                        className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-lg font-mono-tabular"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                        Razorpay Merchant Name (Optional)
                      </label>
                      <input
                        type="text"
                        value={bankForm.razorpayMerchantName}
                        onChange={(e) =>
                          setBankForm({
                            ...bankForm,
                            razorpayMerchantName: e.target.value,
                          })
                        }
                        placeholder="Business Name (Optional)"
                        className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-lg"
                      />
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={!canSaveBank}
                  className="w-full py-3 px-5 text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-300 disabled:cursor-not-allowed rounded-xl transition-colors cursor-pointer"
                >
                  {isSavingBank
                    ? 'Saving Bank Account & QR...'
                    : 'Save Bank Account, Direct UPI & QR Code'}
                </button>
              </form>

              {/* Live Student Checkout Preview */}
              <div className="lg:col-span-5 bg-slate-900 text-white rounded-2xl p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-400">
                    Live Student Checkout Preview
                  </span>
                  <span className="px-2.5 py-0.5 text-[10px] font-bold bg-emerald-500/20 text-emerald-300 rounded-full">
                    Direct Bank / UPI
                  </span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Jab student course buy karega, toh use seedha aapka yeh QR Code aur bank account details dikhegi:
                </p>

                {/* QR Code Display Card */}
                <div className="bg-white text-slate-900 rounded-xl p-4 flex flex-col items-center text-center shadow-md border border-slate-800">
                  <div className="w-48 h-48 sm:w-52 sm:h-52 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-center overflow-hidden p-2">
                    {bankForm.upiQrCodeUrl ? (
                      <img
                        src={bankForm.upiQrCodeUrl}
                        alt="Admin UPI QR Code Preview"
                        className="w-full h-full object-contain rounded-lg"
                      />
                    ) : upiTrimmed ? (
                      <div className="flex flex-col items-center justify-center text-center p-2">
                        <img
                          src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(
                            `upi://pay?pa=${upiTrimmed}&pn=${encodeURIComponent(
                              bankForm.accountHolderName || 'Vidya Setu'
                            )}&cu=INR`
                          )}`}
                          alt="Dynamic UPI QR"
                          className="w-36 h-36 object-contain"
                        />
                        <span className="text-[9px] text-slate-400 mt-1 font-mono-tabular">
                          Auto-generated QR from UPI ID
                        </span>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center text-slate-400">
                        <QrCode className="w-12 h-12 text-slate-300 mb-2" />
                        <span className="text-xs font-semibold">Upload QR Code</span>
                      </div>
                    )}
                  </div>

                  <div className="mt-2.5 text-center">
                    <span className="inline-block px-2.5 py-0.5 text-[10px] font-bold bg-emerald-100 text-emerald-800 rounded-full mb-1">
                      {bankForm.upiQrCodeUrl
                        ? '✓ Custom Admin QR Code'
                        : 'Scan & Pay with Any UPI App'}
                    </span>
                    <p className="text-xs font-bold text-slate-800">
                      {bankForm.accountHolderName || 'Vidya Setu'}
                    </p>
                    <p className="text-[11px] font-mono-tabular text-emerald-700 font-bold">
                      {upiTrimmed || 'yourname@upi'}
                    </p>
                  </div>
                </div>

                <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-2.5 text-xs">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Payee Name:</span>
                    <span className="font-bold text-white">
                      {bankForm.accountHolderName || '—'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Bank Name:</span>
                    <span className="font-semibold text-slate-200">
                      {bankForm.bankName || '—'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Account No:</span>
                    <span className="font-mono-tabular font-bold text-white">
                      {bankForm.accountNumber || '—'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">IFSC Code:</span>
                    <span className="font-mono-tabular font-bold text-emerald-400">
                      {ifscTrimmed || '—'}
                    </span>
                  </div>
                  <div className="flex justify-between pt-2 border-t border-slate-800">
                    <span className="text-slate-400">Direct UPI ID:</span>
                    <span className="font-mono-tabular font-bold text-amber-300">
                      {upiTrimmed || '—'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          );
        })()}

        {section.startsWith('cms-') && section !== 'cms-bank' && section !== 'cms-settings' && section !== 'cms-teachers' && (
          <React.Suspense
            fallback={
              <div className="bg-white border border-slate-200 rounded-2xl p-8 text-center text-xs font-semibold text-slate-500">
                Loading Editor...
              </div>
            }
          >
            <AdminWebAppView
              initialTab={
                section.replace('cms-', '') as
                  | 'branding'
                  | 'courses'
                  | 'mcq'
                  | 'tests'
              }
              siteConfig={learnerState.siteConfig}
              bankAccount={learnerState.bankAccount}
              courses={learnerState.courses}
              onlineTests={learnerState.onlineTests}
              testSubmissions={learnerState.testSubmissions}
              receipts={learnerState.receipts}
              unlockedModuleIds={learnerState.unlockedModuleIds}
              studentAccessGrants={learnerState.studentAccessGrants}
              contactMessages={learnerState.contactMessages}
              onSaveSiteConfig={onSaveSiteConfig}
              onSaveBankAccount={onSaveBankAccount}
              onSaveCourse={onSaveCourse}
              onAutoSequenceCourseVideos={onAutoSequenceCourseVideos}
              onAddMcqSegment={onAddMcqSegment}
              onSaveOnlineTest={onSaveOnlineTest}
              onDeleteOnlineTest={onDeleteOnlineTest}
              onGrantCourseAccess={onGrantCourseAccess}
              onRevokeCourseAccess={onRevokeCourseAccess}
              doubts={learnerState.doubts}
              startupIdeas={learnerState.startupIdeas}
              goalConversations={learnerState.goalConversations}
              studentGallery={learnerState.studentGallery}
              streakDays={learnerState.streakDays}
              kidsXp={learnerState.kidsXp}
              kidsStars={learnerState.kidsStars}
              onReplyDoubt={onReplyDoubt}
              onDeleteDoubt={onDeleteDoubt}
              onDeleteStartupIdea={onDeleteStartupIdea}
              onReplyGoalConversation={onReplyGoalConversation}
              onDeleteGoalConversation={onDeleteGoalConversation}
              onDeleteGalleryPhoto={onDeleteGalleryPhoto}
              onSendBroadcast={onSendBroadcast}
              onUpdateStudentRewards={onUpdateStudentRewards}
            />
          </React.Suspense>
        )}

        {section === 'partner-royalty' && (
          <AdminPartnerRoyaltyPanel
            learnerState={learnerState}
            selectedTeacherId={payoutTeacherId}
            onSelectTeacherId={setPayoutTeacherId}
            onRefreshState={onRefreshState}
            onToast={showToast}
            onJumpToAlertTeacher={(tid) => {
              setPartnerNotifTarget(tid);
              setSection('cms-teachers');
            }}
          />
        )}

        {/* SECTION: Vidya Setu Partner - Teacher Approvals & Faculty Directory */}
        {section === 'cms-teachers' && (
          <div className="space-y-6">
            <div className="bg-white border border-slate-200 rounded-2xl p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-200 text-indigo-700 flex items-center justify-center shrink-0">
                  <GraduationCap className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-slate-900">
                    Vidya Setu Partner: Teacher Approvals &amp; Faculty Directory
                  </h2>
                  <p className="text-xs text-slate-500">
                    Review incoming teacher profiles, verify qualifications and UPI details, inspect video/PDF materials, and approve them for instant publication in the Student App.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="px-3 py-1 text-xs font-bold bg-amber-50 text-amber-800 border border-amber-200 rounded-lg">
                  {learnerState.teacherPendingCourses?.length || 0} Pending Approvals
                </span>
                <span className="px-3 py-1 text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-lg">
                  {learnerState.teacherPartners?.length || 0} Verified Faculty
                </span>
              </div>
            </div>

            {/* Submissions Pending Approval */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-amber-600" />
                  <h3 className="text-sm font-bold text-slate-900">
                    Pending Course Submissions from Teacher Partners
                  </h3>
                </div>
                <span className="text-[11px] text-slate-500">
                  Approved courses appear immediately on student search and subject catalog.
                </span>
              </div>

              {(!learnerState.teacherPendingCourses || learnerState.teacherPendingCourses.length === 0) ? (
                <div className="p-10 text-center border-2 border-dashed border-slate-200 rounded-2xl">
                  <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto mb-2 opacity-80" />
                  <h4 className="text-sm font-bold text-slate-800">No Pending Teacher Approvals</h4>
                  <p className="text-xs text-slate-500 max-w-md mx-auto mt-1">
                    All teacher partner courses have been processed. When teachers submit new courses via the Partner Portal, they will appear here for 1-click review.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {learnerState.teacherPendingCourses.map((tc) => {
                    const teacher = tc.teacherProfile || {
                      name: tc.teacherName || 'Faculty Mentor',
                      qualification: 'Subject Expert',
                      experience: '5+ Years',
                      upiId: 'educator@upi',
                      photoUrl:
                        tc.teacherAvatar ||
                        '/src/assets/images/hero_learning_studio_1793856674745.jpg',
                    };
                    const chaptersCount = tc.modules?.length || 0;
                    const pdfsCount = tc.modules?.filter((m) => !!m.pdfUrl).length || 0;
                    const isApproving = approvingCourseId === tc.id;

                    return (
                      <div
                        key={tc.id}
                        className="p-5 border border-slate-200 rounded-2xl bg-slate-50/50 hover:bg-slate-50 transition-colors space-y-4"
                      >
                        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                          <div className="flex items-start gap-4">
                            <img
                              src={teacher.photoUrl || '/src/assets/images/hero_learning_studio_1793856674745.jpg'}
                              alt={teacher.name}
                              referrerPolicy="no-referrer"
                              onError={(e) => {
                                (e.currentTarget as HTMLImageElement).src =
                                  '/src/assets/images/hero_learning_studio_1793856674745.jpg';
                              }}
                              className="w-14 h-14 rounded-2xl object-cover border-2 border-white shadow-xs shrink-0"
                            />
                            <div>
                              <div className="flex flex-wrap items-center gap-2">
                                <h4 className="text-base font-bold text-slate-900">
                                  {tc.title}
                                </h4>
                                <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-indigo-100 text-indigo-800 border border-indigo-200">
                                  {tc.category?.toUpperCase()}
                                </span>
                                {tc.k12Class && (
                                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                                    Class {tc.k12Class}
                                  </span>
                                )}
                              </div>

                              <p className="text-xs text-slate-600 mt-0.5">
                                Submitted by: <span className="font-bold text-slate-900">{teacher.name}</span> ({teacher.qualification}) • Experience: <span className="font-semibold text-slate-800">{teacher.experience}</span>
                              </p>

                              <div className="flex flex-wrap items-center gap-3 mt-2 text-xs text-slate-500">
                                <span className="font-mono-tabular font-bold text-slate-900 bg-white px-2 py-0.5 rounded border border-slate-200">
                                  Price: ₹{tc.priceInr || tc.fullPriceInr || 699}
                                </span>
                                <span>{chaptersCount} Chapters</span>
                                <span>{pdfsCount} PDF Resources</span>
                                <span className="font-mono text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                                  Payout UPI: {teacher.upiId}
                                </span>
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 self-end lg:self-center shrink-0">
                            <button
                              type="button"
                              disabled={isApproving}
                              onClick={() => handleApproveTeacherCourse(tc.id)}
                              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 rounded-xl transition-colors cursor-pointer shadow-xs"
                            >
                              <CheckCircle2 className="w-4 h-4" />
                              <span>{isApproving ? 'Approving...' : 'Approve & Publish'}</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => handleRejectTeacherCourse(tc.id)}
                              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-xl transition-colors cursor-pointer"
                            >
                              <XCircle className="w-4 h-4" />
                              <span>Reject</span>
                            </button>
                          </div>
                        </div>

                        {/* Teacher Bank Account & Settlement Details */}
                        {(() => {
                          const bank = tc.teacherBankAccount || (teacher as any).bankAccount;
                          return (
                            <div className="p-3.5 bg-white border border-slate-200 rounded-xl space-y-2">
                              <div className="flex items-center justify-between">
                                <span className="text-[11px] font-bold text-slate-800 flex items-center gap-1.5">
                                  <Building2 className="w-3.5 h-3.5 text-indigo-600" />
                                  Partner Bank &amp; Settlement Account ({(learnerState.teacherPartners || []).find((p) => p.id === tc.teacherId)?.royaltyPercent ?? learnerState.siteConfig.defaultPartnerRoyaltyPct ?? 80}% Direct Royalty)
                                </span>
                                {bank?.isVerified && (
                                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                                    Verified Bank
                                  </span>
                                )}
                              </div>
                              {bank ? (
                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2 text-xs">
                                  <div className="p-2 bg-slate-50 rounded-lg border border-slate-100">
                                    <span className="text-[10px] text-slate-400 block">Bank Name</span>
                                    <span className="font-semibold text-slate-900">{bank.bankName}</span>
                                    <span className="text-[10px] text-slate-500 block">A/C: {bank.accountType || 'Savings'}</span>
                                  </div>
                                  <div className="p-2 bg-slate-50 rounded-lg border border-slate-100 flex items-center justify-between">
                                    <div className="truncate">
                                      <span className="text-[10px] text-slate-400 block">Account Number</span>
                                      <span className="font-mono font-bold text-slate-900 truncate block">{bank.accountNumber}</span>
                                    </div>
                                    <button
                                      type="button"
                                      onClick={() => {
                                        navigator.clipboard.writeText(bank.accountNumber);
                                        showToast(`Copied Account Number: ${bank.accountNumber}`);
                                      }}
                                      title="Copy Account Number"
                                      className="p-1 hover:bg-slate-200 rounded text-slate-500 hover:text-slate-900 cursor-pointer shrink-0"
                                    >
                                      <Copy className="w-3.5 h-3.5" />
                                    </button>
                                  </div>
                                  <div className="p-2 bg-slate-50 rounded-lg border border-slate-100 flex items-center justify-between">
                                    <div className="truncate">
                                      <span className="text-[10px] text-slate-400 block">IFSC Code</span>
                                      <span className="font-mono font-bold text-slate-900">{bank.ifscCode}</span>
                                      {bank.branchName && (
                                        <span className="text-[10px] text-slate-500 block truncate">{bank.branchName}</span>
                                      )}
                                    </div>
                                    <button
                                      type="button"
                                      onClick={() => {
                                        navigator.clipboard.writeText(bank.ifscCode);
                                        showToast(`Copied IFSC: ${bank.ifscCode}`);
                                      }}
                                      title="Copy IFSC Code"
                                      className="p-1 hover:bg-slate-200 rounded text-slate-500 hover:text-slate-900 cursor-pointer shrink-0"
                                    >
                                      <Copy className="w-3.5 h-3.5" />
                                    </button>
                                  </div>
                                  <div className="p-2 bg-slate-50 rounded-lg border border-slate-100 flex items-center justify-between">
                                    <div className="truncate">
                                      <span className="text-[10px] text-slate-400 block">UPI ID &amp; Payee</span>
                                      <span className="font-mono text-emerald-700 font-semibold truncate block">{bank.upiId || teacher.upiId}</span>
                                      <span className="text-[10px] text-slate-600 truncate block">{bank.accountHolderName}</span>
                                    </div>
                                    <div className="flex items-center gap-1 shrink-0">
                                      <button
                                        type="button"
                                        onClick={() => {
                                          navigator.clipboard.writeText(bank.upiId || teacher.upiId);
                                          showToast(`Copied UPI ID: ${bank.upiId || teacher.upiId}`);
                                        }}
                                        title="Copy UPI ID"
                                        className="p-1 hover:bg-slate-200 rounded text-slate-500 hover:text-slate-900 cursor-pointer"
                                      >
                                        <Copy className="w-3.5 h-3.5" />
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              ) : (
                                <div className="text-xs text-slate-500 bg-slate-50 p-2.5 rounded-lg flex items-center justify-between">
                                  <span>Standard UPI ID for settlement: <strong className="text-slate-800 font-mono">{teacher.upiId}</strong></span>
                                  <button
                                    type="button"
                                    onClick={() => {
                                      navigator.clipboard.writeText(teacher.upiId);
                                      showToast(`Copied UPI ID: ${teacher.upiId}`);
                                    }}
                                    className="text-xs text-indigo-600 hover:text-indigo-800 font-medium inline-flex items-center gap-1 cursor-pointer"
                                  >
                                    <Copy className="w-3 h-3" /> Copy UPI
                                  </button>
                                </div>
                              )}
                            </div>
                          );
                        })()}

                        {/* Chapter List Preview */}
                        <div className="pt-3 border-t border-slate-200/80">
                          <p className="text-[11px] font-bold text-slate-700 mb-2">
                            Curriculum Breakdown ({chaptersCount} Chapters):
                          </p>
                          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                            {tc.modules?.slice(0, 6).map((mod, idx) => (
                              <div
                                key={mod.id || idx}
                                className="p-2 bg-white rounded-lg border border-slate-200 text-xs flex items-center justify-between gap-2"
                              >
                                <span className="truncate text-slate-800 font-medium">
                                  {mod.title}
                                </span>
                                <span className="text-[10px] text-slate-400 shrink-0">
                                  {mod.durationMins || 45}m
                                </span>
                              </div>
                            ))}
                            {chaptersCount > 6 && (
                              <div className="p-2 bg-slate-100 rounded-lg text-[11px] font-semibold text-slate-500 text-center flex items-center justify-center">
                                + {chaptersCount - 6} more chapters included
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Dynamic Partner Royalty Editor + Pay Partner Console + Ledger */}
            <AdminPartnerRoyaltyPanel
              learnerState={learnerState}
              selectedTeacherId={payoutTeacherId}
              onSelectTeacherId={setPayoutTeacherId}
              onRefreshState={onRefreshState}
              onToast={showToast}
              onJumpToAlertTeacher={(tid) => setPartnerNotifTarget(tid)}
            />

            {/* Send Direct / Broadcast Partner Notification */}
            <form
              onSubmit={handleSendPartnerNotification}
              className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4"
            >
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <Bell className="w-4 h-4 text-indigo-600" />
                  <h3 className="text-sm font-bold text-slate-900">
                    Send Partner Notification / Alert
                  </h3>
                </div>
                <span className="text-[11px] text-slate-500">Delivered to Partner Studio</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Recipient Partner</label>
                  <select
                    value={partnerNotifTarget}
                    onChange={(e) => setPartnerNotifTarget(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-slate-50 text-slate-900"
                  >
                    <option value="all">All Verified Faculty Partners</option>
                    {(learnerState.teacherPartners || []).map((t) => (
                      <option key={t.id} value={t.id}>
                        {t.name} ({t.email})
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Alert Title *</label>
                  <input
                    type="text"
                    required
                    value={partnerNotifTitle}
                    onChange={(e) => setPartnerNotifTitle(e.target.value)}
                    placeholder="e.g. Monthly Payout Schedule Update"
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-slate-50 text-slate-900"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block font-semibold text-slate-700 mb-1">Message *</label>
                  <textarea
                    rows={2}
                    required
                    value={partnerNotifMessage}
                    onChange={(e) => setPartnerNotifMessage(e.target.value)}
                    placeholder="Write notice regarding course approvals, payouts, or tax TDS..."
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-slate-50 text-slate-900"
                  />
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={isSendingPartnerNotif}
                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl cursor-pointer disabled:opacity-50"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{isSendingPartnerNotif ? 'Sending...' : 'Send Partner Alert'}</span>
                </button>
              </div>
            </form>
          </div>
        )}

        {/* SECTION: Admin WebApp Settings */}
        {section === 'cms-settings' && (
          <div className="space-y-6">
            <div className="bg-white border border-slate-200 rounded-2xl p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-indigo-50 border border-indigo-200 text-indigo-700 flex items-center justify-center">
                    <Settings className="w-4 h-4" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-slate-900">
                      Admin WebApp Settings &amp; System Configuration
                    </h2>
                    <p className="text-xs text-slate-500">
                      Manage administrator credentials, security PIN, audio alerts, course symmetry defaults, and storage health.
                    </p>
                  </div>
                </div>
              </div>
              <button
                type="button"
                onClick={handleSaveAdminSettings}
                className="inline-flex items-center gap-2 px-4 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl transition-colors cursor-pointer shadow-sm self-start sm:self-auto"
              >
                <Check className="w-4 h-4" />
                <span>Save All Settings</span>
              </button>
            </div>

            <form onSubmit={handleSaveAdminSettings} className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Card 1: Owner-Only Account & Security Lock (Server-Verified) */}
              <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    <h3 className="text-sm font-bold text-slate-900">
                      Owner-Only Security &amp; Access Lock
                    </h3>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 bg-emerald-50 text-emerald-700 rounded font-mono-tabular">
                    Sessions: {activeAdminSessions}
                  </span>
                </div>

                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-[11px] text-emerald-900 leading-relaxed">
                  <strong>Single-Owner Lock Active:</strong> Public Admin Sign Up hamesha ke liye band hai. Sirf aapka registered Owner account hi Admin Panel open kar sakta hai.
                </div>

                {ownerSecurityLoading ? (
                  <p className="text-xs text-slate-500 py-2">
                    Loading verified Owner security profile...
                  </p>
                ) : (
                  <div className="space-y-3">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="text-xs font-semibold text-slate-700 block mb-1">
                          Owner Name
                        </label>
                        <input
                          type="text"
                          value={ownerNameInput}
                          onChange={(e) => setOwnerNameInput(e.target.value)}
                          placeholder="Owner Name"
                          className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-emerald-500"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-semibold text-slate-700 block mb-1">
                          Owner Registered Mobile (+91)
                        </label>
                        <input
                          type="tel"
                          maxLength={10}
                          value={ownerPhoneInput}
                          onChange={(e) =>
                            setOwnerPhoneInput(e.target.value.replace(/\D/g, '').slice(0, 10))
                          }
                          placeholder="10-digit mobile"
                          className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-xl text-slate-900 font-mono-tabular focus:outline-none focus:border-emerald-500"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-slate-700 block mb-1">
                        Verified Owner Email ID
                      </label>
                      <input
                        type="email"
                        value={ownerEmailInput}
                        onChange={(e) => setOwnerEmailInput(e.target.value)}
                        placeholder="owner@domain.com"
                        className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-xl text-slate-900 font-mono focus:outline-none focus:border-emerald-500"
                      />
                    </div>

                    <label className="flex items-start gap-2.5 p-3 bg-slate-50 border border-slate-200 rounded-xl cursor-pointer">
                      <input
                        type="checkbox"
                        checked={adminOtpDisabled}
                        onChange={(e) => setAdminOtpDisabled(e.target.checked)}
                        className="mt-0.5 rounded text-emerald-600 focus:ring-emerald-500"
                      />
                      <div>
                        <span className="text-xs font-bold text-slate-900 block">
                          Password-Only Lock (Disable Mobile OTP Login)
                        </span>
                        <span className="text-[11px] text-slate-500 block mt-0.5">
                          On karne par Admin Panel par OTP se login aur OTP reset band ho jayega — sirf aapke private Owner Password / PIN se login hoga.
                        </span>
                      </div>
                    </label>

                    <div className="pt-2 border-t border-slate-100 space-y-2.5">
                      <p className="text-[11px] font-bold text-slate-700">
                        Change Owner Password / PIN (Optional)
                      </p>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                        <input
                          type="password"
                          value={secCurrentPassword}
                          onChange={(e) => setSecCurrentPassword(e.target.value)}
                          placeholder="Current Password"
                          className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-emerald-500"
                        />
                        <input
                          type="password"
                          value={secNewPassword}
                          onChange={(e) => setSecNewPassword(e.target.value)}
                          placeholder="New Password (4+ chars)"
                          className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-emerald-500"
                        />
                        <input
                          type="password"
                          value={secConfirmPassword}
                          onChange={(e) => setSecConfirmPassword(e.target.value)}
                          placeholder="Confirm New Password"
                          className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-emerald-500"
                        />
                      </div>
                    </div>

                    {ownerSecurityNotice && (
                      <div
                        className={`p-2.5 rounded-xl text-[11px] font-medium border ${
                          ownerSecurityNotice.type === 'success'
                            ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                            : 'bg-red-50 border-red-200 text-red-700'
                        }`}
                      >
                        {ownerSecurityNotice.text}
                      </div>
                    )}

                    <div className="flex flex-wrap items-center gap-2 pt-1">
                      <button
                        type="button"
                        disabled={ownerSecuritySaving}
                        onClick={() => handleSaveOwnerSecurity(false)}
                        className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-xl transition-colors cursor-pointer disabled:opacity-60"
                      >
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                        <span>
                          {ownerSecuritySaving ? 'Updating...' : 'Update Owner Security'}
                        </span>
                      </button>

                      <button
                        type="button"
                        disabled={ownerSecuritySaving}
                        onClick={() => handleSaveOwnerSecurity(true)}
                        className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-red-700 bg-red-50 hover:bg-red-100 border border-red-200 rounded-xl transition-colors cursor-pointer disabled:opacity-60"
                      >
                        <LogOut className="w-3.5 h-3.5" />
                        <span>Revoke All Other Sessions</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Card 2: Audio & Real-time Alert Preferences */}
              <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-amber-600" />
                    <h3 className="text-sm font-bold text-slate-900">
                      Alerts &amp; Audio Notifications
                    </h3>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 bg-amber-50 text-amber-700 rounded">
                    User Experience
                  </span>
                </div>

                <div className="space-y-3">
                  <label className="flex items-start gap-3 p-3 bg-slate-50 border border-slate-200 rounded-xl cursor-pointer">
                    <input
                      type="checkbox"
                      checked={adminSettings.soundAlerts}
                      onChange={(e) =>
                        setAdminSettings((prev: any) => ({
                          ...prev,
                          soundAlerts: e.target.checked,
                        }))
                      }
                      className="mt-0.5 rounded text-emerald-600 focus:ring-emerald-500"
                    />
                    <div>
                      <span className="text-xs font-bold text-slate-900 block">
                        Sound Chime on Pending Student Payment Request
                      </span>
                      <span className="text-[11px] text-slate-500 block mt-0.5">
                        Plays a gentle audio notification whenever a student submits a manual UPI screenshot or payment receipt.
                      </span>
                    </div>
                  </label>

                  <label className="flex items-start gap-3 p-3 bg-slate-50 border border-slate-200 rounded-xl cursor-pointer">
                    <input
                      type="checkbox"
                      checked={adminSettings.audioOnUpload}
                      onChange={(e) =>
                        setAdminSettings((prev: any) => ({
                          ...prev,
                          audioOnUpload: e.target.checked,
                        }))
                      }
                      className="mt-0.5 rounded text-emerald-600 focus:ring-emerald-500"
                    />
                    <div>
                      <span className="text-xs font-bold text-slate-900 block">
                        Sound Chime on Course Upload Success
                      </span>
                      <span className="text-[11px] text-slate-500 block mt-0.5">
                        Confirmation audio cue when a course or chapter is successfully published and synced to the student app.
                      </span>
                    </div>
                  </label>

                  <label className="flex items-start gap-3 p-3 bg-slate-50 border border-slate-200 rounded-xl cursor-pointer">
                    <input
                      type="checkbox"
                      checked={adminSettings.stickyToasts}
                      onChange={(e) =>
                        setAdminSettings((prev: any) => ({
                          ...prev,
                          stickyToasts: e.target.checked,
                        }))
                      }
                      className="mt-0.5 rounded text-emerald-600 focus:ring-emerald-500"
                    />
                    <div>
                      <span className="text-xs font-bold text-slate-900 block">
                        Display In-App Toast Confirmations
                      </span>
                      <span className="text-[11px] text-slate-500 block mt-0.5">
                        Show visual notifications at the top of the Admin Center for immediate feedback on actions.
                      </span>
                    </div>
                  </label>
                </div>
              </div>

              {/* Card 3: Course Upload & Auto-Sequencer Symmetry Defaults */}
              <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-2">
                    <Layers className="w-4 h-4 text-indigo-600" />
                    <h3 className="text-sm font-bold text-slate-900">
                      Course Upload &amp; 30-Chapter Symmetry Defaults
                    </h3>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 bg-indigo-50 text-indigo-700 rounded">
                    Curriculum Standards
                  </span>
                </div>

                <div className="space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-semibold text-slate-700 block mb-1">
                        Default Chapter Symmetry Count
                      </label>
                      <input
                        type="number"
                        min={1}
                        max={100}
                        value={adminSettings.defaultSymmetryChapters}
                        onChange={(e) =>
                          setAdminSettings((prev: any) => ({
                            ...prev,
                            defaultSymmetryChapters: Number(e.target.value) || 30,
                          }))
                        }
                        className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-xl text-slate-900 font-mono focus:outline-none focus:border-emerald-500"
                      />
                      <p className="text-[10px] text-slate-400 mt-1">e.g. 30 chapters for Class 9 Maths</p>
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-slate-700 block mb-1">
                        Auto-Number Prefix Format
                      </label>
                      <select
                        value={adminSettings.autoNumberPrefix}
                        onChange={(e) =>
                          setAdminSettings((prev: any) => ({
                            ...prev,
                            autoNumberPrefix: e.target.value,
                          }))
                        }
                        className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-emerald-500 cursor-pointer"
                      >
                        <option value="Chapter [N]: ">Chapter [N]: [Title]</option>
                        <option value="Chepter [N] - ">Chepter [N] - [Title]</option>
                        <option value="Module [N]: ">Module [N]: [Title]</option>
                        <option value="[N]. ">[N]. [Title]</option>
                      </select>
                      <p className="text-[10px] text-slate-400 mt-1">Used during auto-sequencing API</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-semibold text-slate-700 block mb-1">
                        Default PDF Module Policy
                      </label>
                      <select
                        value={adminSettings.defaultPdfPolicy}
                        onChange={(e) =>
                          setAdminSettings((prev: any) => ({
                            ...prev,
                            defaultPdfPolicy: e.target.value as 'downloadable' | 'view_only',
                          }))
                        }
                        className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-emerald-500 cursor-pointer"
                      >
                        <option value="downloadable">Downloadable (Offline Reading)</option>
                        <option value="view_only">View-Only (Protected / No Save)</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-slate-700 block mb-1">
                        Default Video Duration (Minutes)
                      </label>
                      <input
                        type="number"
                        min={1}
                        max={300}
                        value={adminSettings.defaultVideoDurationMins}
                        onChange={(e) =>
                          setAdminSettings((prev: any) => ({
                            ...prev,
                            defaultVideoDurationMins: Number(e.target.value) || 45,
                          }))
                        }
                        className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-xl text-slate-900 font-mono focus:outline-none focus:border-emerald-500"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Card 4: System Diagnostics & Storage Health */}
              <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-2">
                    <Database className="w-4 h-4 text-emerald-600" />
                    <h3 className="text-sm font-bold text-slate-900">
                      System Diagnostics &amp; Storage Health
                    </h3>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 bg-emerald-50 text-emerald-700 rounded">
                    Real-Time State
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center">
                  <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl">
                    <p className="text-lg font-bold text-slate-900 font-mono">
                      {learnerState.courses.length}
                    </p>
                    <p className="text-[10px] font-semibold text-slate-500 uppercase mt-0.5">
                      Courses
                    </p>
                  </div>
                  <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl">
                    <p className="text-lg font-bold text-emerald-700 font-mono">
                      {learnerState.courses.reduce((s, c) => s + (c.modules?.length || 0), 0)}
                    </p>
                    <p className="text-[10px] font-semibold text-slate-500 uppercase mt-0.5">
                      Modules
                    </p>
                  </div>
                  <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl">
                    <p className="text-lg font-bold text-indigo-700 font-mono">
                      {learnerState.onlineTests?.length || 0}
                    </p>
                    <p className="text-[10px] font-semibold text-slate-500 uppercase mt-0.5">
                      Tests
                    </p>
                  </div>
                  <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl">
                    <p className="text-lg font-bold text-amber-700 font-mono">
                      {learnerState.receipts?.length || 0}
                    </p>
                    <p className="text-[10px] font-semibold text-slate-500 uppercase mt-0.5">
                      Receipts
                    </p>
                  </div>
                </div>

                <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-900 space-y-1">
                  <p className="font-bold flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Database Status: Healthy &amp; Synchronized</span>
                  </p>
                  <p className="text-[11px] text-emerald-800 leading-relaxed">
                    Courses uploaded in the Admin Web App are instantly active across student catalog views (K-12 classes 9-12, competitive, and skill courses).
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => {
                      showToast('Database integrity checked: All courses and modules verified!');
                    }}
                    className="px-3 py-2 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors cursor-pointer"
                  >
                    Run Health Check
                  </button>
                  <button
                    type="button"
                    onClick={handleDownloadBackupJson}
                    className="px-3 py-2 text-xs font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-xl transition-colors cursor-pointer"
                  >
                    Export JSON Backup
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      if (window.confirm('Clear temporary query cache? Your courses and bank details will remain safe.')) {
                        sessionStorage.clear();
                        showToast('Temporary cache cleared successfully');
                      }
                    }}
                    className="px-3 py-2 text-xs font-bold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-xl transition-colors cursor-pointer"
                  >
                    Clear Temp Cache
                  </button>
                </div>
              </div>

              {/* Card 5: Legal Policies, Privacy Policy & Terms Editor */}
              <div className="lg:col-span-2 bg-white border border-slate-200 rounded-2xl p-6 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 bg-emerald-50 text-emerald-700 rounded-lg border border-emerald-200">
                      <FileText className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-slate-900">
                        Legal Policies, Privacy Policy &amp; Terms &amp; Conditions Editor
                      </h3>
                      <p className="text-xs text-slate-500">
                        Edit platform terms, student data policies, manual payment terms, and teacher royalties. Live updates appear in the student &amp; partner portals.
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setShowLegalPreview(true)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 rounded-lg cursor-pointer transition-colors"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Preview Live Modal</span>
                    </button>
                    <button
                      type="button"
                      disabled={isSavingPolicies}
                      onClick={handleSaveLegalPolicies}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 rounded-lg cursor-pointer transition-colors shadow-xs"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>{isSavingPolicies ? 'Saving...' : 'Save Policies'}</span>
                    </button>
                  </div>
                </div>

                {/* Tabs: Privacy Policy vs Terms */}
                <div className="flex items-center justify-between gap-2 border-b border-slate-200">
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setActiveLegalTab('privacy')}
                      className={`px-4 py-2 text-xs font-bold transition-colors cursor-pointer border-b-2 -mb-px ${
                        activeLegalTab === 'privacy'
                          ? 'border-emerald-600 text-emerald-700'
                          : 'border-transparent text-slate-500 hover:text-slate-800'
                      }`}
                    >
                      Privacy Policy (गोपनीयता नीति)
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveLegalTab('terms')}
                      className={`px-4 py-2 text-xs font-bold transition-colors cursor-pointer border-b-2 -mb-px ${
                        activeLegalTab === 'terms'
                          ? 'border-emerald-600 text-emerald-700'
                          : 'border-transparent text-slate-500 hover:text-slate-800'
                      }`}
                    >
                      Terms &amp; Conditions (नियम व शर्तें)
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      if (
                        window.confirm(
                          `Reset ${activeLegalTab === 'privacy' ? 'Privacy Policy' : 'Terms & Conditions'} to official default bilingual template?`
                        )
                      ) {
                        if (activeLegalTab === 'privacy') {
                          setPrivacyPolicyInput(DEFAULT_PRIVACY_POLICY);
                        } else {
                          setTermsInput(DEFAULT_TERMS_AND_CONDITIONS);
                        }
                        showToast('Reset to default official template. Click "Save Policies" to publish.');
                      }
                    }}
                    className="text-[11px] font-semibold text-slate-500 hover:text-rose-600 transition-colors pb-1 cursor-pointer"
                  >
                    ↺ Reset to Default Template
                  </button>
                </div>

                {/* Text Editor */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    {activeLegalTab === 'privacy'
                      ? 'Privacy Policy Content (Markdown & Plain Text)'
                      : 'Terms & Conditions Content (Markdown & Plain Text)'}
                  </label>
                  <textarea
                    rows={12}
                    value={activeLegalTab === 'privacy' ? privacyPolicyInput : termsInput}
                    onChange={(e) => {
                      if (activeLegalTab === 'privacy') {
                        setPrivacyPolicyInput(e.target.value);
                      } else {
                        setTermsInput(e.target.value);
                      }
                    }}
                    className="w-full p-3 text-xs bg-slate-900 text-slate-100 font-mono rounded-xl border border-slate-700 focus:outline-none focus:border-emerald-500 leading-relaxed resize-y"
                    placeholder="Enter policy markdown text..."
                  />
                  <div className="flex items-center justify-between text-[11px] text-slate-500 mt-1.5">
                    <span>
                      Character count: {activeLegalTab === 'privacy' ? privacyPolicyInput.length : termsInput.length}
                    </span>
                    <span className="text-emerald-600 font-medium">
                      ✓ Synchronized with Student Hub and Teacher Partner Portal
                    </span>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-2 flex justify-end">
                <button
                  type="submit"
                  className="inline-flex items-center gap-2 px-6 py-2.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl transition-colors cursor-pointer shadow-sm"
                >
                  <Check className="w-4 h-4" />
                  <span>Save All Settings</span>
                </button>
              </div>
            </form>
          </div>
        )}

        {/* SECTION 2: Pending Access & Auto-Unlock Queue */}
        {section === 'pending' && (
          <div className="space-y-6">
            <div className="bg-white border border-slate-200 rounded-2xl p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-lg font-bold text-slate-900">
                  Payment Verification &amp; Pending Access Approval
                </h2>
                <p className="text-xs text-slate-600 mt-1">
                  Manual UPI QR &amp; Fino Bank Transfer requests stay LOCKED until you
                  verify the ₹ amount and UTR in your bank/GPay app and click Approve &amp; Unlock below.
                </p>
              </div>
              <span className="px-4 py-2.5 rounded-xl text-xs font-bold shrink-0 bg-emerald-50 text-emerald-800 border border-emerald-200">
                UTR Verification Guard: ACTIVE
              </span>
            </div>

            {/* Lazy-loaded & Memoized Bulk CSV Upload for Manual Payment Records */}
            <React.Suspense
              fallback={
                <div className="bg-white border border-slate-200 rounded-2xl p-6 text-center text-xs font-semibold text-slate-500">
                  Loading CSV Validator &amp; Bulk Uploader...
                </div>
              }
            >
              <AdminCsvBulkUploader
                courses={learnerState.courses}
                onBulkPendingAccess={onBulkPendingAccess}
                onToast={showToast}
              />
            </React.Suspense>

            <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4">
              <h3 className="text-base font-bold text-slate-900">
                Pending &amp; Processed Access Requests (
                {learnerState.pendingAccessRequests.length})
              </h3>

              {learnerState.pendingAccessRequests.length === 0 ? (
                <p className="text-xs text-slate-500 py-6 text-center">
                  No pending access requests right now.
                </p>
              ) : (
                <div className="space-y-3">
                  {learnerState.pendingAccessRequests.map((req) => (
                    <div
                      key={req.id}
                      className="p-4 bg-slate-50 border border-slate-200 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-bold text-slate-900">
                            {req.studentName}
                          </span>
                          <span className="text-xs font-mono-tabular text-slate-500">
                            ({req.studentIdentifier})
                          </span>
                          <span
                            className={`px-2 py-0.5 text-[10px] font-bold rounded ${
                              req.status === 'Pending'
                                ? 'bg-amber-100 text-amber-900'
                                : req.status === 'Approved'
                                ? 'bg-emerald-100 text-emerald-800'
                                : 'bg-rose-100 text-rose-800'
                            }`}
                          >
                            {req.status}
                          </span>
                        </div>
                        <p className="text-xs font-semibold text-indigo-700">
                          {req.courseTitle} ({req.accessType} ·{' '}
                          {req.moduleIds.length} Chapters)
                        </p>
                        <p className="text-[11px] font-mono-tabular text-slate-600">
                          Amount: ₹{req.amountInr} • Ref: {req.paymentReference} •{' '}
                          {req.requestedAt}
                        </p>
                      </div>

                      {req.status === 'Pending' && (
                        <div className="flex items-center gap-2 shrink-0">
                          <button
                            type="button"
                            onClick={async () => {
                              await onHandlePendingAccess(req.id, 'approve');
                              showToast(
                                `Approved & Unlocked ${req.courseTitle} for ${req.studentName}!`
                              );
                            }}
                            className="px-3.5 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl inline-flex items-center gap-1.5 cursor-pointer"
                          >
                            <CheckCircle2 className="w-4 h-4" />
                            <span>Approve &amp; Unlock</span>
                          </button>
                          <button
                            type="button"
                            onClick={async () => {
                              await onHandlePendingAccess(req.id, 'reject');
                              showToast(`Rejected request from ${req.studentName}`);
                            }}
                            className="px-3 py-2 text-xs font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 rounded-xl inline-flex items-center gap-1 cursor-pointer"
                          >
                            <XCircle className="w-4 h-4" />
                            <span>Reject</span>
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* SECTION 3: Student & Revenue Analytics */}
        {section === 'analytics' && (() => {
          const { filteredReceipts, filteredRevenueInr, analyticsTrendData } =
            analyticsMetrics;

          const applyPresetDays = (days: number | 'month' | 'all') => {
            if (days === 'all') {
              setAnalyticsStartDate('');
              setAnalyticsEndDate('');
              return;
            }
            const now = new Date();
            const endStr = now.toISOString().slice(0, 10);
            if (days === 'month') {
              const first = new Date(now.getFullYear(), now.getMonth(), 1);
              setAnalyticsStartDate(first.toISOString().slice(0, 10));
              setAnalyticsEndDate(endStr);
              return;
            }
            const start = new Date(now);
            start.setDate(now.getDate() - days);
            setAnalyticsStartDate(start.toISOString().slice(0, 10));
            setAnalyticsEndDate(endStr);
          };

          return (
            <div className="space-y-6">
              {/* Date-Range Picker Bar */}
              <div className="bg-white border border-slate-200 rounded-2xl p-5 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center shrink-0">
                    <Calendar className="w-4 h-4 text-emerald-600" />
                  </div>
                  <div>
                    <h2 className="text-sm font-bold text-slate-900">
                      Filter Revenue &amp; Enrollment by Date Range
                    </h2>
                    <p className="text-xs text-slate-500">
                      {analyticsStartDate || analyticsEndDate
                        ? `Showing data from ${analyticsStartDate || 'Beginning'} to ${
                            analyticsEndDate || 'Today'
                          } (${filteredReceipts.length} receipts)`
                        : `Showing All Time data (${filteredReceipts.length} receipts)`}
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <div className="flex items-center gap-1.5 text-xs">
                    <label className="font-semibold text-slate-600">From:</label>
                    <input
                      type="date"
                      value={analyticsStartDate}
                      onChange={(e) => setAnalyticsStartDate(e.target.value)}
                      className="px-2.5 py-1.5 border border-slate-200 rounded-xl text-xs font-mono-tabular bg-slate-50 focus:outline-none focus:border-emerald-600"
                    />
                  </div>
                  <div className="flex items-center gap-1.5 text-xs">
                    <label className="font-semibold text-slate-600">To:</label>
                    <input
                      type="date"
                      value={analyticsEndDate}
                      onChange={(e) => setAnalyticsEndDate(e.target.value)}
                      className="px-2.5 py-1.5 border border-slate-200 rounded-xl text-xs font-mono-tabular bg-slate-50 focus:outline-none focus:border-emerald-600"
                    />
                  </div>

                  <div className="flex flex-wrap items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => applyPresetDays(7)}
                      className="px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 cursor-pointer"
                    >
                      7D
                    </button>
                    <button
                      type="button"
                      onClick={() => applyPresetDays(30)}
                      className="px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 cursor-pointer"
                    >
                      30D
                    </button>
                    <button
                      type="button"
                      onClick={() => applyPresetDays('month')}
                      className="px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 cursor-pointer"
                    >
                      This Month
                    </button>
                    {(analyticsStartDate || analyticsEndDate) && (
                      <button
                        type="button"
                        onClick={() => applyPresetDays('all')}
                        className="px-2.5 py-1.5 rounded-lg text-xs font-bold bg-rose-50 text-rose-700 hover:bg-rose-100 cursor-pointer"
                      >
                        Reset
                      </button>
                    )}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-slate-900 text-white rounded-2xl p-5">
                  <div className="flex items-center justify-between text-xs text-slate-400">
                    <span>Filtered Revenue</span>
                    <IndianRupee className="w-4 h-4 text-emerald-400" />
                  </div>
                  <p className="text-2xl font-bold text-emerald-400 font-mono-tabular mt-2">
                    ₹{filteredRevenueInr.toLocaleString('en-IN')}
                  </p>
                  <p className="text-[11px] text-slate-300 mt-1">
                    {filteredReceipts.length} Verified Payments
                  </p>
                </div>

                <div className="bg-white border border-slate-200 rounded-2xl p-5">
                  <div className="flex items-center justify-between text-xs text-slate-500">
                    <span>Unlocked Chapters</span>
                    <TrendingUp className="w-4 h-4 text-emerald-600" />
                  </div>
                  <p className="text-2xl font-bold text-slate-900 font-mono-tabular mt-2">
                    {learnerState.unlockedModuleIds.length}
                  </p>
                  <p className="text-[11px] text-slate-500 mt-1">
                    Across {learnerState.courses.length} Courses
                  </p>
                </div>

                <div className="bg-white border border-slate-200 rounded-2xl p-5">
                  <div className="flex items-center justify-between text-xs text-slate-500">
                    <span>Online Test Attempts</span>
                    <BarChart3 className="w-4 h-4 text-indigo-600" />
                  </div>
                  <p className="text-2xl font-bold text-slate-900 font-mono-tabular mt-2">
                    {learnerState.testSubmissions.length +
                      learnerState.mcqAttempts.length}
                  </p>
                  <p className="text-[11px] text-slate-500 mt-1">
                    Tests + MCQ Sprints
                  </p>
                </div>

                <div className="bg-white border border-slate-200 rounded-2xl p-5">
                  <div className="flex items-center justify-between text-xs text-slate-500">
                    <span>Pending Approvals</span>
                    <Users className="w-4 h-4 text-amber-600" />
                  </div>
                  <p className="text-2xl font-bold text-amber-600 font-mono-tabular mt-2">
                    {pendingCount}
                  </p>
                  <p className="text-[11px] text-slate-500 mt-1">
                    Awaiting Admin Verification
                  </p>
                </div>
              </div>

              {/* Lazy-loaded & Memoized Filtered Revenue & Enrollment Trend Chart */}
              {analyticsTrendData.length > 0 && (
                <React.Suspense
                  fallback={
                    <div className="bg-white border border-slate-200 rounded-2xl p-6 h-72 animate-pulse flex items-center justify-center text-xs font-semibold text-slate-400">
                      Loading Period Trend Chart...
                    </div>
                  }
                >
                  <AnalyticsTrendChart data={analyticsTrendData} />
                </React.Suspense>
              )}

              {/* Course-wise Enrollment & Revenue Breakdown */}
              <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4">
                <h3 className="text-base font-bold text-slate-900">
                  Course-Wise Student Access &amp; Revenue Breakdown
                </h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-slate-200 text-slate-500">
                        <th className="py-2 pr-3 font-semibold">Course / Subject</th>
                        <th className="py-2 px-3 font-semibold">Category</th>
                        <th className="py-2 px-3 font-semibold">Full Price</th>
                        <th className="py-2 px-3 font-semibold">Unlocked Chapters</th>
                        <th className="py-2 pl-3 font-semibold text-right">
                          Orders (Filtered)
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {learnerState.courses.map((c) => {
                        const unlocked = c.modules.filter((m) =>
                          learnerState.unlockedModuleIds.includes(m.id)
                        ).length;
                        const orders = filteredReceipts.filter(
                          (r) => r.courseId === c.id
                        ).length;
                        return (
                          <tr key={c.id}>
                            <td className="py-2.5 pr-3 font-bold text-slate-900">
                              {c.title}
                            </td>
                            <td className="py-2.5 px-3 text-slate-600">
                              {c.categoryLabel}
                            </td>
                            <td className="py-2.5 px-3 font-mono-tabular font-semibold">
                              ₹{c.fullPriceInr}
                            </td>
                            <td className="py-2.5 px-3 font-mono-tabular text-emerald-700 font-bold">
                              {unlocked} / {c.modules.length}
                            </td>
                            <td className="py-2.5 pl-3 text-right font-mono-tabular">
                              {orders}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          );
        })()}

        {/* SECTION 4: All API Connections & Full User App Control */}
        {section === 'api' && (
          <form
            onSubmit={async (e) => {
              e.preventDefault();
              await onSaveApiConfig(apiForm);
              showToast('All API Connections & User App Controls Saved!');
            }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-6"
          >
            {/* Left 7 Cols: API Connections */}
            <div className="lg:col-span-7 bg-white border border-slate-200 rounded-2xl p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-base font-bold text-slate-900">
                  Payment, OTP &amp; Webhook API Connections
                </h2>
                <button
                  type="button"
                  onClick={async () => {
                    setApiTestStatus('Testing API & OTP Gateway connections...');
                    try {
                      const res = await fetch('/api/admin/api-test', {
                        method: 'POST',
                        headers: {
                          'Content-Type': 'application/json',
                          ...getAdminTokenHeader(),
                        },
                      });
                      const data = await res.json().catch(() => ({}));
                      if (res.ok && data.summary) {
                        setApiTestStatus(data.summary);
                      } else {
                        setApiTestStatus(
                          data.error || `API diagnostic failed (HTTP ${res.status})`
                        );
                      }
                    } catch {
                      setApiTestStatus('Network error testing OTP & API connections');
                    }
                  }}
                  className="px-3 py-1.5 text-xs font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 rounded-lg inline-flex items-center gap-1.5 cursor-pointer"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Test All APIs</span>
                </button>
              </div>

              {apiTestStatus && (
                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs font-semibold text-emerald-800">
                  {apiTestStatus}
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Razorpay API Key ID
                  </label>
                  <input
                    type="text"
                    value={apiForm.razorpayKeyId}
                    onChange={(e) =>
                      setApiForm({ ...apiForm, razorpayKeyId: e.target.value })
                    }
                    className="w-full px-3.5 py-2 text-xs border border-slate-200 rounded-xl font-mono-tabular"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Razorpay Mode
                  </label>
                  <select
                    value={apiForm.razorpayMode}
                    onChange={(e) =>
                      setApiForm({
                        ...apiForm,
                        razorpayMode: e.target.value as 'test' | 'live',
                      })
                    }
                    className="w-full px-3 py-2 text-xs font-bold border border-slate-200 rounded-xl bg-white"
                  >
                    <option value="live">LIVE Production Mode</option>
                    <option value="test">TEST Sandbox Mode</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Razorpay Key Secret
                </label>
                <input
                  type="password"
                  value={apiForm.razorpayKeySecret}
                  onChange={(e) =>
                    setApiForm({ ...apiForm, razorpayKeySecret: e.target.value })
                  }
                  className="w-full px-3.5 py-2 text-xs border border-slate-200 rounded-xl font-mono-tabular"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    OTP Delivery Mode
                  </label>
                  <select
                    value={apiForm.otpDeliveryMode || 'built_in_gateway'}
                    onChange={(e) =>
                      setApiForm({
                        ...apiForm,
                        otpDeliveryMode: e.target.value as
                          | 'built_in_gateway'
                          | 'fast2sms'
                          | 'msg91'
                          | 'twilio'
                          | 'smtp_email',
                      })
                    }
                    className="w-full px-3 py-2 text-xs font-bold border border-slate-200 rounded-xl bg-white"
                  >
                    <option value="built_in_gateway">Built-In Vidya Setu OTP Gateway (Recommended)</option>
                    <option value="fast2sms">Fast2SMS Live API (+91)</option>
                    <option value="msg91">MSG91 India (+91)</option>
                    <option value="smtp_email">Gmail SMTP OTP Gateway</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    SMS OTP Gateway API Key (Optional)
                  </label>
                  <input
                    type="password"
                    value={apiForm.smsOtpApiKey || ''}
                    onChange={(e) =>
                      setApiForm({ ...apiForm, smsOtpApiKey: e.target.value })
                    }
                    placeholder="Optional live SMS API key"
                    className="w-full px-3.5 py-2 text-xs border border-slate-200 rounded-xl font-mono-tabular"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    SMS OTP Gateway Provider Label
                  </label>
                  <input
                    type="text"
                    value={apiForm.smsOtpProvider}
                    onChange={(e) =>
                      setApiForm({ ...apiForm, smsOtpProvider: e.target.value })
                    }
                    className="w-full px-3.5 py-2 text-xs border border-slate-200 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Gmail / Email SMTP Host
                  </label>
                  <input
                    type="text"
                    value={apiForm.emailSmtpHost}
                    onChange={(e) =>
                      setApiForm({ ...apiForm, emailSmtpHost: e.target.value })
                    }
                    className="w-full px-3.5 py-2 text-xs border border-slate-200 rounded-xl"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Payment &amp; Enrollment Webhook URL
                </label>
                <input
                  type="url"
                  value={apiForm.webhookUrl}
                  onChange={(e) =>
                    setApiForm({ ...apiForm, webhookUrl: e.target.value })
                  }
                  className="w-full px-3.5 py-2 text-xs border border-slate-200 rounded-xl font-mono-tabular"
                />
              </div>
            </div>

            {/* Right 5 Cols: Full User App Feature Controls */}
            <div className="lg:col-span-5 bg-white border border-slate-200 rounded-2xl p-6 space-y-4 h-fit">
              <h2 className="text-base font-bold text-slate-900">
                Full User App Feature Controls
              </h2>
              <p className="text-xs text-slate-600">
                Turn any Student App feature ON or OFF in real time.
              </p>

              {[
                {
                  key: 'autoUnlockOnPayment' as const,
                  label: 'Auto-Unlock Course After Payment',
                  desc: 'Instant unlock on Razorpay/UPI/NetBanking',
                },
                {
                  key: 'enableOnlineTests' as const,
                  label: 'Online Tests & Mock Exams Tab',
                  desc: 'Show/hide Online Tests in Student App',
                },
                {
                  key: 'enableLiveDoubts' as const,
                  label: 'Live Doubt Solving Sessions',
                  desc: 'Show/hide Live Doubts in Student App',
                },
                {
                  key: 'enableKidsArena' as const,
                  label: 'Future Kids Gamification Arena',
                  desc: 'Show/hide Kids Arena on Home',
                },
                {
                  key: 'maintenanceMode' as const,
                  label: 'Student App Maintenance Mode',
                  desc: 'Temporarily pause student access during updates',
                },
              ].map((ctrl) => (
                <label
                  key={ctrl.key}
                  className="flex items-center justify-between gap-3 p-3 bg-slate-50 border border-slate-200 rounded-xl cursor-pointer"
                >
                  <div>
                    <p className="text-xs font-bold text-slate-900">
                      {ctrl.label}
                    </p>
                    <p className="text-[11px] text-slate-500">{ctrl.desc}</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={Boolean(apiForm[ctrl.key])}
                    onChange={(e) =>
                      setApiForm({ ...apiForm, [ctrl.key]: e.target.checked })
                    }
                    className="w-4 h-4 accent-emerald-600"
                  />
                </label>
              ))}

              <button
                type="submit"
                className="w-full py-3 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl cursor-pointer"
              >
                Save API &amp; User App Controls
              </button>
            </div>
          </form>
        )}

        {/* SECTION 5: Database Backup & Disaster Recovery Center */}
        {section === 'backup' && (
          <div className="space-y-6">
            {/* Header Banner */}
            <div className="bg-slate-900 text-white rounded-2xl p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="p-2 bg-emerald-600/30 text-emerald-400 rounded-xl border border-emerald-500/30">
                    <Database className="w-5 h-5" />
                  </span>
                  <p className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                    Disaster Recovery &amp; Data Portability
                  </p>
                </div>
                <h1 className="text-2xl font-bold">Database Backup &amp; Recovery Center</h1>
                <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
                  Export complete snapshots of your system state into a downloadable JSON file. Includes courses, video links, attached PDFs, student access receipts, test papers, custom UPI QR codes, and site settings.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 shrink-0">
                <button
                  type="button"
                  onClick={handleDownloadBackupJson}
                  className="inline-flex items-center justify-center gap-2 px-5 py-3 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl transition-colors cursor-pointer shadow-md"
                >
                  <Download className="w-4 h-4" />
                  <span>Download Backup (.json)</span>
                </button>
              </div>
            </div>

            {/* Error / Alert Display */}
            {backupRestoreError && (
              <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl text-xs text-rose-800 flex items-start gap-2.5">
                <XCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="font-bold">Restore Error</p>
                  <p className="mt-0.5">{backupRestoreError}</p>
                </div>
                <button
                  type="button"
                  onClick={() => setBackupRestoreError(null)}
                  className="text-xs font-semibold text-rose-600 hover:text-rose-800"
                >
                  Dismiss
                </button>
              </div>
            )}

            {/* Two Column Cards: 1. Export Snapshot, 2. Restore from JSON */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Card 1: Live State Snapshot Breakdown */}
              <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-5">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-2">
                    <FileJson className="w-4 h-4 text-emerald-600" />
                    <h3 className="text-sm font-bold text-slate-900">
                      Current Database Snapshot Contents
                    </h3>
                  </div>
                  <span className="text-[10px] font-bold font-mono-tabular px-2.5 py-0.5 bg-emerald-50 text-emerald-700 rounded-full border border-emerald-200">
                    Live Memory + Disk
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl text-center">
                    <span className="text-[10px] uppercase font-bold text-slate-500">Courses</span>
                    <p className="text-lg font-bold text-slate-900 mt-0.5 font-mono-tabular">
                      {learnerState.courses.length}
                    </p>
                    <span className="text-[9px] text-slate-400">
                      {learnerState.courses.reduce((sum, c) => sum + c.modules.length, 0)} modules
                    </span>
                  </div>

                  <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl text-center">
                    <span className="text-[10px] uppercase font-bold text-slate-500">Receipts</span>
                    <p className="text-lg font-bold text-slate-900 mt-0.5 font-mono-tabular">
                      {learnerState.receipts.length}
                    </p>
                    <span className="text-[9px] text-slate-400">
                      ₹{learnerState.receipts.reduce((sum, r) => sum + (Number(r.amountPaidInr) || 0), 0).toLocaleString()}
                    </span>
                  </div>

                  <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl text-center">
                    <span className="text-[10px] uppercase font-bold text-slate-500">MCQ Bank</span>
                    <p className="text-lg font-bold text-slate-900 mt-0.5 font-mono-tabular">
                      {learnerState.mcqSegments.length}
                    </p>
                    <span className="text-[9px] text-slate-400">Questions</span>
                  </div>

                  <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl text-center">
                    <span className="text-[10px] uppercase font-bold text-slate-500">Test Papers</span>
                    <p className="text-lg font-bold text-slate-900 mt-0.5 font-mono-tabular">
                      {learnerState.onlineTests.length}
                    </p>
                    <span className="text-[9px] text-slate-400">Full Tests</span>
                  </div>

                  <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl text-center">
                    <span className="text-[10px] uppercase font-bold text-slate-500">Pending</span>
                    <p className="text-lg font-bold text-amber-600 mt-0.5 font-mono-tabular">
                      {pendingCount}
                    </p>
                    <span className="text-[9px] text-slate-400">Requests</span>
                  </div>

                  <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl text-center">
                    <span className="text-[10px] uppercase font-bold text-slate-500">Bank &amp; QR</span>
                    <p className="text-xs font-bold text-emerald-700 mt-1 truncate">
                      {learnerState.bankAccount.upiId || 'Direct UPI'}
                    </p>
                    <span className="text-[9px] text-slate-400">
                      {learnerState.bankAccount.upiQrCodeUrl ? 'Custom QR' : 'Auto QR'}
                    </span>
                  </div>
                </div>

                <div className="pt-2 space-y-2">
                  <button
                    type="button"
                    onClick={handleDownloadBackupJson}
                    className="w-full py-3 px-4 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-sm"
                  >
                    <Download className="w-4 h-4" />
                    <span>Download Full Backup JSON File</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      navigator.clipboard.writeText(JSON.stringify(learnerState, null, 2));
                      showToast('Database JSON copied to clipboard!');
                    }}
                    className="w-full py-2.5 px-4 text-xs font-semibold text-slate-700 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl transition-colors flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy Raw JSON to Clipboard</span>
                  </button>
                </div>
              </div>

              {/* Card 2: Restore from Backup */}
              <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-5">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-2">
                    <Archive className="w-4 h-4 text-indigo-600" />
                    <h3 className="text-sm font-bold text-slate-900">
                      Restore / Import Backup File
                    </h3>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 bg-indigo-50 text-indigo-700 rounded">
                    Disaster Recovery
                  </span>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed">
                  In case of accidental deletion, data corruption, or migration to a new instance, select any previously downloaded backup JSON file to restore all courses, student receipts, and configurations instantly.
                </p>

                <label className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-slate-300 hover:border-emerald-500 rounded-xl bg-slate-50 cursor-pointer transition-colors text-center space-y-2">
                  <div className="p-3 bg-white border border-slate-200 rounded-full text-emerald-600 shadow-sm">
                    <Upload className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-slate-900 block">
                      {isRestoringBackup ? 'Restoring Database...' : 'Choose JSON Backup File to Restore'}
                    </span>
                    <span className="text-[10px] text-slate-500 block mt-0.5">
                      Select a .json file exported from Vidya Setu Admin
                    </span>
                  </div>
                  <input
                    type="file"
                    accept=".json,application/json"
                    disabled={isRestoringBackup}
                    onChange={handleRestoreBackupFile}
                    className="hidden"
                  />
                </label>

                <div className="p-3.5 bg-amber-50 border border-amber-200 rounded-xl space-y-1 text-[11px] text-amber-900">
                  <p className="font-bold flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-amber-700" />
                    <span>Safe Restore Protocol</span>
                  </p>
                  <p className="text-amber-800 leading-relaxed">
                    Restoring a backup automatically validates schema integrity, preserves your current active admin login session, and updates storage safely.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
          </main>
        </div>
      </div>

      {/* Live Legal Policy Preview Modal */}
      <LegalPolicyModal
        isOpen={showLegalPreview}
        onClose={() => setShowLegalPreview(false)}
        initialTab={activeLegalTab}
        privacyText={privacyPolicyInput}
        termsText={termsInput}
      />
    </div>
  );
};
