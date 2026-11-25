import React, { useState } from 'react';
import {
  Palette,
  BookOpen,
  Upload,
  CheckCircle2,
  Plus,
  Mail,
  FileText,
  Video,
  Image as ImageIcon,
  HelpCircle,
  ClipboardCheck,
  Trash2,
  Eye,
  EyeOff,
  Landmark,
  KeyRound,
  Unlock,
  Lock,
  Users,
  MessageCircle,
  Lightbulb,
  Target,
  Camera,
  Bell,
  Award,
  Send,
  Download,
  ExternalLink,
  ArrowUp,
  ArrowDown,
} from 'lucide-react';
import {
  BankAccountConfig,
  Course,
  CourseCategory,
  CourseModule,
  DoubtQuestion,
  FeatureImageItem,
  GoalConversation,
  McqSegment,
  SiteConfig,
  ContactMessage,
  OnlineTest,
  OnlineTestQuestion,
  OnlineTestSubmission,
  PurchaseReceipt,
  StartupIdea,
  StudentAccessGrant,
  StudentGalleryItem,
} from '../types/education';
import { sortAndNumberModulesSymmetrically } from '../utils/moduleSequence';

interface AdminWebAppViewProps {
  initialTab?:
    | 'branding'
    | 'courses'
    | 'mcq'
    | 'tests'
    | 'access'
    | 'bank'
    | 'users'
    | 'contact';
  siteConfig: SiteConfig;
  bankAccount: BankAccountConfig;
  courses: Course[];
  onlineTests: OnlineTest[];
  testSubmissions: OnlineTestSubmission[];
  receipts: PurchaseReceipt[];
  unlockedModuleIds: string[];
  studentAccessGrants: StudentAccessGrant[];
  contactMessages: ContactMessage[];
  onSaveSiteConfig: (updates: Partial<SiteConfig>) => Promise<void>;
  onSaveBankAccount: (updates: Partial<BankAccountConfig>) => Promise<void>;
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
  doubts?: DoubtQuestion[];
  startupIdeas?: StartupIdea[];
  goalConversations?: GoalConversation[];
  studentGallery?: StudentGalleryItem[];
  streakDays?: number;
  kidsXp?: number;
  kidsStars?: number;
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
}

type AdminTab =
  | 'access'
  | 'users'
  | 'branding'
  | 'courses'
  | 'mcq'
  | 'tests'
  | 'bank'
  | 'contact';

const COLOR_PRESETS = [
  { name: 'Emerald', hex: '#059669' },
  { name: 'Royal Indigo', hex: '#4338CA' },
  { name: 'Ocean Blue', hex: '#0284C7' },
  { name: 'Warm Amber', hex: '#D97706' },
  { name: 'Crimson', hex: '#E11D48' },
];

const STUDIO_IMAGE_PRESETS = [
  {
    label: 'Concept Studio',
    url: '/src/assets/images/hero_learning_studio_1793856674745.jpg',
  },
  {
    label: 'Competitive MCQ',
    url: '/src/assets/images/track_competitive_exams_1793856674843.jpg',
  },
  {
    label: 'AI & Python Skills',
    url: '/src/assets/images/track_digital_skills_1793856675081.jpg',
  },
  {
    label: 'Kids Arena',
    url: '/src/assets/images/track_kids_gamification_1793856675358.jpg',
  },
];

const DEFAULT_ADMIN_FEATURE_IMAGES: FeatureImageItem[] = [
  {
    id: 'feat-img-1',
    title: 'Smart Concept Studio & Live Boards',
    hindiTitle: 'स्मार्ट कॉन्सेप्ट स्टूडियो और लाइव बोर्ड क्लासेस',
    caption:
      'Class 9–12 NCERT, Physics, Chemistry & Maths with HD video chapters and downloadable notes.',
    hindiCaption: 'कक्षा 9–12 NCERT, फिजिक्स, केमिस्ट्री और मैथ्स के HD वीडियो चैप्टर व नोट्स।',
    imageUrl: '/src/assets/images/hero_learning_studio_1793856674745.jpg',
    ctaLabel: 'Explore Boards',
    targetView: 'catalog',
  },
  {
    id: 'feat-img-2',
    title: 'UPSC, SSC & Banking MCQ Sprints',
    hindiTitle: 'UPSC, SSC और बैंकिंग हिंदी MCQ प्रैक्टिस',
    caption:
      'Timed bilingual MCQ sprints, Polity & Economy capsules, and All-India mock test series.',
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
];

export const AdminWebAppView: React.FC<AdminWebAppViewProps> = ({
  siteConfig,
  bankAccount,
  courses,
  onlineTests,
  testSubmissions,
  receipts,
  unlockedModuleIds,
  studentAccessGrants,
  contactMessages,
  onSaveSiteConfig,
  onSaveBankAccount,
  onSaveCourse,
  onAddMcqSegment,
  onSaveOnlineTest,
  onDeleteOnlineTest,
  onGrantCourseAccess,
  onRevokeCourseAccess,
  doubts = [],
  startupIdeas = [],
  goalConversations = [],
  studentGallery = [],
  streakDays = 7,
  kidsXp = 180,
  kidsStars = 12,
  onReplyDoubt,
  onDeleteDoubt,
  onDeleteStartupIdea,
  onReplyGoalConversation,
  onDeleteGoalConversation,
  onDeleteGalleryPhoto,
  onSendBroadcast,
  onUpdateStudentRewards,
  onAutoSequenceCourseVideos,
  initialTab,
}) => {
  const [activeTab, setActiveTab] = useState<AdminTab>(initialTab || 'courses');
  const [saveToast, setSaveToast] = useState<string | null>(null);
  const [bulkVideoLines, setBulkVideoLines] = useState('');
  const [isAutoSequencing, setIsAutoSequencing] = useState(false);
  const [isSavingCourse, setIsSavingCourse] = useState(false);
  const [courseSaveStatus, setCourseSaveStatus] = useState<{
    type: 'success' | 'error';
    text: string;
  } | null>(null);

  React.useEffect(() => {
    if (initialTab) {
      setActiveTab(initialTab);
    }
  }, [initialTab]);

  const triggerToast = (msg: string) => {
    setSaveToast(msg);
    setTimeout(() => setSaveToast(null), 4000);
  };

  // Users, Doubts & Community state
  const [doubtReplies, setDoubtReplies] = useState<Record<string, string>>({});
  const [goalAdminReplies, setGoalAdminReplies] = useState<Record<string, string>>({});
  const [broadcastTitle, setBroadcastTitle] = useState('');
  const [broadcastMsg, setBroadcastMsg] = useState('');
  const [rewardStreak, setRewardStreak] = useState(streakDays);
  const [rewardXp, setRewardXp] = useState(kidsXp);
  const [rewardStars, setRewardStars] = useState(kidsStars);

  // 1. Branding & Color State
  const [configForm, setConfigForm] = useState<SiteConfig>(siteConfig);
  React.useEffect(() => {
    setConfigForm(siteConfig);
  }, [siteConfig]);

  const handleSaveBranding = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSaveSiteConfig(configForm);
    triggerToast('Site Content, Colors & Contact Info Saved!');
  };

  // 2. Course & Media Upload State
  const [selectedCourseId, setSelectedCourseId] = useState<string>(courses[0]?.id || '');
  const editingCourse =
    courses.find((c) => c.id === selectedCourseId) || courses[0];

  const [courseTitle, setCourseTitle] = useState(editingCourse?.title || '');
  const [courseSubtitle, setCourseSubtitle] = useState(editingCourse?.subtitle || '');
  const [courseInstructor, setCourseInstructor] = useState(editingCourse?.instructor || '');
  const [coursePrice, setCoursePrice] = useState(editingCourse?.fullPriceInr || 899);
  const [courseSalary, setCourseSalary] = useState(editingCourse?.salaryRange || '');
  const [courseImage, setCourseImage] = useState(editingCourse?.imageUrl || '');
  const [courseCategory, setCourseCategory] = useState<CourseCategory>(
    editingCourse?.category || 'k12'
  );
  const [courseCategoryLabel, setCourseCategoryLabel] = useState<string>(
    editingCourse?.categoryLabel || 'Class 9–12 School'
  );
  const [courseK12Class, setCourseK12Class] = useState<string>(
    (editingCourse as any)?.k12Class || '9'
  );
  const [courseK12Stream, setCourseK12Stream] = useState<string>(
    (editingCourse as any)?.k12Stream || 'general'
  );
  const [modulesList, setModulesList] = useState<CourseModule[]>(
    editingCourse?.modules || []
  );
  const [selectedModIdx, setSelectedModIdx] = useState(0);

  const loadCourseIntoEditor = (c: Course) => {
    setSelectedCourseId(c.id);
    setCourseTitle(c.title);
    setCourseSubtitle(c.subtitle);
    setCourseInstructor(c.instructor);
    setCoursePrice(c.fullPriceInr);
    setCourseSalary(c.salaryRange || '');
    setCourseImage(c.imageUrl);
    setCourseCategory(c.category || 'k12');
    setCourseCategoryLabel(c.categoryLabel || 'Course Track');
    setCourseK12Class((c as any).k12Class || '9');
    setCourseK12Stream((c as any).k12Stream || 'general');
    setModulesList(c.modules || []);
    setSelectedModIdx(0);
    setCourseSaveStatus(null);
  };

  React.useEffect(() => {
    if (!selectedCourseId && courses.length > 0) {
      loadCourseIntoEditor(courses[0]);
    }
  }, [courses, selectedCourseId]);

  const handleCreateNewCourse = () => {
    const newId = `course-${Date.now()}`;
    const newCourse: Course = {
      id: newId,
      title: 'Class 9: Mathematics Complete Course',
      subtitle: 'Complete 30-chapter modular syllabus with video lectures, formula sheets & downloadable PDF study notes.',
      category: 'k12',
      categoryLabel: 'Class 9 • Mathematics',
      instructor: 'Vidya Setu Senior Faculty',
      instructorRole: 'Senior Subject Mentor',
      fullPriceInr: 499,
      originalPriceInr: 1299,
      totalHours: 35,
      totalMcqs: 120,
      rating: '4.9',
      enrolledCount: 'Active Batch 2026',
      imageUrl: '/src/assets/images/hero_learning_studio_1793856674745.jpg',
      salaryRange: 'Exam Booster',
      accentColor: 'emerald',
      modules: [
        {
          id: `mod-${Date.now()}-1`,
          chapterNumber: 1,
          title: '01. Chapter 1: Number Systems & Real Numbers',
          durationMins: 60,
          mcqCount: 25,
          priceInr: 99,
          isFreePreview: true,
          keyTopics: ['Real Numbers', 'Number Line Representation', 'Laws of Exponents'],
          pdfPolicy: 'downloadable',
        },
      ],
      k12Class: '9' as any,
      k12Stream: 'general' as any,
    };
    loadCourseIntoEditor(newCourse);
    triggerToast('New Course draft ready! Set title, category, and click Save to publish live to user app.');
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setCourseImage(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleModuleVideoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setModulesList((prev) =>
      prev.map((m, idx) => (idx === selectedModIdx ? { ...m, videoUrl: url } : m))
    );
    triggerToast(`Video "${file.name}" attached to Module ${selectedModIdx + 1}!`);
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
      setModulesList((prev) =>
        prev.map((m, idx) =>
          idx === selectedModIdx
            ? {
                ...m,
                pdfUrl: dataUrl,
                pdfFileName: file.name,
                pdfPolicy: m.pdfPolicy || 'view_only',
              }
            : m
        )
      );
      const policyLabel =
        modulesList[selectedModIdx]?.pdfPolicy === 'downloadable'
          ? 'Downloadable'
          : 'View Only';
      triggerToast(
        `PDF "${file.name}" attached to Module ${selectedModIdx + 1} (${policyLabel})!`
      );
    };
    reader.onerror = () => {
      const fallbackUrl = URL.createObjectURL(file);
      setModulesList((prev) =>
        prev.map((m, idx) =>
          idx === selectedModIdx
            ? {
                ...m,
                pdfUrl: fallbackUrl,
                pdfFileName: file.name,
                pdfPolicy: m.pdfPolicy || 'view_only',
              }
            : m
        )
      );
      triggerToast(`PDF attached to Module ${selectedModIdx + 1}!`);
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const handleSaveCourseChanges = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!courseTitle.trim()) {
      const msg = 'Please enter a Course Heading (English) before saving.';
      setCourseSaveStatus({ type: 'error', text: msg });
      triggerToast(msg);
      return;
    }

    setIsSavingCourse(true);
    setCourseSaveStatus(null);

    try {
      const existing = courses.find((c) => c.id === selectedCourseId);
      const base = existing || {
        id: selectedCourseId || `course-${Date.now()}`,
        accentColor: 'emerald' as const,
        rating: '4.9',
        enrolledCount: 'Active Batch',
      };

      const rawModules =
        modulesList.length > 0
          ? modulesList
          : [
              {
                id: `mod-${Date.now()}-1`,
                chapterNumber: 1,
                title: '01. Chapter 1: Introduction & Foundation',
                durationMins: 60,
                mcqCount: 20,
                priceInr: 99,
                isFreePreview: true,
                keyTopics: ['Core Theory', 'Important Rules', 'Solved Examples'],
                pdfPolicy: 'downloadable' as const,
                videoUrl:
                  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
              },
            ];

      const finalModules = rawModules.map((m, idx) => ({
        ...m,
        chapterNumber: m.chapterNumber || idx + 1,
        videoUrl:
          m.videoUrl && m.videoUrl.trim() !== ''
            ? m.videoUrl
            : 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
      }));

      const updated: Course = {
        ...base,
        id: selectedCourseId || base.id,
        title: courseTitle.trim(),
        hindiTitle: existing?.hindiTitle || courseTitle.trim(),
        subtitle:
          courseSubtitle.trim() ||
          'Complete modular syllabus with video lectures and study material.',
        instructor: courseInstructor.trim() || 'Vidya Setu Senior Faculty',
        instructorRole: existing?.instructorRole || 'Senior Subject Mentor',
        category: courseCategory,
        categoryLabel:
          courseCategoryLabel.trim() ||
          (courseCategory === 'k12'
            ? `Class ${courseK12Class} School`
            : 'Custom Track'),
        fullPriceInr: Number(coursePrice) || 499,
        originalPriceInr: Math.round((Number(coursePrice) || 499) * 1.5) || 999,
        salaryRange: courseSalary || undefined,
        imageUrl:
          courseImage ||
          '/src/assets/images/hero_learning_studio_1793856674745.jpg',
        modules: finalModules,
        rating: existing?.rating || '4.9',
        enrolledCount: existing?.enrolledCount || 'Active Batch',
        totalHours: Math.max(
          1,
          Math.round(
            finalModules.reduce(
              (acc, m) => acc + (m.durationMins || 60),
              0
            ) / 60
          )
        ),
        totalMcqs: Math.max(
          10,
          finalModules.reduce((acc, m) => acc + (m.mcqCount || 10), 0)
        ),
        ...(courseCategory === 'k12'
          ? {
              k12Class: courseK12Class as any,
              k12Stream: courseK12Stream as any,
            }
          : {}),
      };

      await onSaveCourse(updated);
      setSelectedCourseId(updated.id);
      setModulesList(finalModules);
      const successMsg = `Course "${updated.title}" saved & published live to Student App!`;
      setCourseSaveStatus({ type: 'success', text: successMsg });
      triggerToast(successMsg);
    } catch (err) {
      const errMsg =
        err instanceof Error
          ? err.message
          : 'Failed to save course changes. Please try again.';
      setCourseSaveStatus({ type: 'error', text: errMsg });
      triggerToast(errMsg);
    } finally {
      setIsSavingCourse(false);
    }
  };

  // 3. Add New Hindi + English MCQ Segment State
  const [mcqTrackTitle, setMcqTrackTitle] = useState('General Studies & Current Affairs');
  const [mcqConceptTitle, setMcqConceptTitle] = useState('');
  const [mcqConceptSummary, setMcqConceptSummary] = useState('');
  const [mcqFormula, setMcqFormula] = useState('');
  const [mcqQuestionHi, setMcqQuestionHi] = useState('');
  const [mcqOptHi0, setMcqOptHi0] = useState('');
  const [mcqOptHi1, setMcqOptHi1] = useState('');
  const [mcqOptHi2, setMcqOptHi2] = useState('');
  const [mcqOptHi3, setMcqOptHi3] = useState('');
  const [mcqCorrectIdx, setMcqCorrectIdx] = useState(0);
  const [mcqExplanationHi, setMcqExplanationHi] = useState('');

  const handleCreateMcq = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!mcqQuestionHi.trim()) return;
    const newSeg: McqSegment = {
      id: `seg-admin-${Date.now()}`,
      trackId: 'course-upsc-gs',
      trackTitle: mcqTrackTitle,
      segmentNumber: 1,
      conceptTitle: mcqConceptTitle || 'Key Concept',
      conceptSummary: mcqConceptSummary || mcqExplanationHi,
      keyFormulaOrRule: mcqFormula || 'Important Exam Rule',
      conceptDurationSec: 18,
      question: mcqQuestionHi,
      options: [mcqOptHi0, mcqOptHi1, mcqOptHi2, mcqOptHi3],
      correctIndex: mcqCorrectIdx,
      explanation: mcqExplanationHi,
      questionDurationSec: 25,
      hindi: {
        trackTitle: mcqTrackTitle,
        conceptTitle: mcqConceptTitle || 'मुख्य कॉन्सेप्ट',
        conceptSummary: mcqConceptSummary || mcqExplanationHi,
        keyFormulaOrRule: mcqFormula || 'महत्वपूर्ण नियम',
        question: mcqQuestionHi,
        options: [mcqOptHi0, mcqOptHi1, mcqOptHi2, mcqOptHi3],
        explanation: mcqExplanationHi,
      },
    };
    await onAddMcqSegment(newSeg);
    setMcqConceptTitle('');
    setMcqConceptSummary('');
    setMcqFormula('');
    setMcqQuestionHi('');
    setMcqOptHi0('');
    setMcqOptHi1('');
    setMcqOptHi2('');
    setMcqOptHi3('');
    setMcqExplanationHi('');
    triggerToast('New Automatic Hindi/English MCQ Added!');
  };

  const activeMod = modulesList[selectedModIdx];

  return (
    <div className="space-y-6">
      {saveToast && (
        <div className="fixed bottom-5 right-5 z-50 inline-flex items-center gap-2 px-4 py-3 bg-emerald-600 text-white text-xs font-bold rounded-xl shadow-xl border border-emerald-400/40 max-w-sm">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{saveToast}</span>
        </div>
      )}

      {/* Admin Header */}
      <div className="bg-slate-900 text-white rounded-2xl p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-emerald-400">
            Master Admin Web App · Full Control Center
          </p>
          <h1 className="text-2xl sm:text-3xl font-bold mt-1">
            {siteConfig.appName} — Admin CMS &amp; Media Studio
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-1">
            Edit site content, theme colors, courses, prices, upload Videos/Images/PDFs, and
            manage Contact &amp; Writing.
          </p>
        </div>

        {saveToast && (
          <div className="inline-flex items-center gap-2 px-4 py-2.5 bg-emerald-600 text-white text-xs font-bold rounded-xl shrink-0">
            <CheckCircle2 className="w-4 h-4" />
            <span>{saveToast}</span>
          </div>
        )}
      </div>

      {/* Admin Dashboard Overview KPIs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
        <div className="bg-white border border-slate-200 rounded-2xl p-4">
          <p className="text-[11px] font-semibold text-slate-500">Total Revenue</p>
          <p className="text-xl font-bold text-emerald-700 font-mono-tabular mt-0.5">
            ₹
            {receipts
              .reduce((sum, r) => sum + (Number(r.amountPaidInr) || 0), 0)
              .toLocaleString('en-IN')}
          </p>
        </div>
        <div className="bg-white border border-slate-200 rounded-2xl p-4">
          <p className="text-[11px] font-semibold text-slate-500">Total Courses</p>
          <p className="text-xl font-bold text-slate-900 font-mono-tabular mt-0.5">
            {courses.length} Courses
          </p>
        </div>
        <div className="bg-white border border-slate-200 rounded-2xl p-4">
          <p className="text-[11px] font-semibold text-slate-500">Unlocked Chapters</p>
          <p className="text-xl font-bold text-indigo-700 font-mono-tabular mt-0.5">
            {unlockedModuleIds.length} Active
          </p>
        </div>
        <div className="bg-white border border-slate-200 rounded-2xl p-4">
          <p className="text-[11px] font-semibold text-slate-500">Online Tests</p>
          <p className="text-xl font-bold text-slate-900 font-mono-tabular mt-0.5">
            {onlineTests.length} Tests ({testSubmissions.length} Submissions)
          </p>
        </div>
      </div>

      {/* Admin Navigation Tabs */}
      <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl overflow-x-auto">
        {[
          { id: 'access', label: 'Student Course Access', icon: KeyRound },
          { id: 'users', label: 'Users, Doubts & Community', icon: Users },
          { id: 'branding', label: 'Feature Images & Branding', icon: ImageIcon },
          { id: 'courses', label: 'Courses, Video, Image & PDF', icon: BookOpen },
          { id: 'mcq', label: 'Add Hindi/English MCQ', icon: HelpCircle },
          { id: 'tests', label: 'Online Tests & Results', icon: ClipboardCheck },
          { id: 'bank', label: 'Bank & Payments', icon: Landmark },
          { id: 'contact', label: 'Contact & Writing', icon: Mail },
        ].map((tab) => {
          const Icon = tab.icon;
          const active = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id as AdminTab)}
              className={`inline-flex items-center gap-2 px-4 py-2.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                active
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Icon className="w-4 h-4 text-emerald-600" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: Content & Theme Color Editor */}
      {activeTab === 'branding' && (
        <form
          onSubmit={handleSaveBranding}
          className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 space-y-6"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                App / Brand Name
              </label>
              <input
                type="text"
                value={configForm.appName}
                onChange={(e) =>
                  setConfigForm({ ...configForm, appName: e.target.value })
                }
                className="w-full px-3.5 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-600"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Brand Logo Initials (2 Letters)
              </label>
              <input
                type="text"
                maxLength={3}
                value={configForm.brandInitials}
                onChange={(e) =>
                  setConfigForm({ ...configForm, brandInitials: e.target.value })
                }
                className="w-full px-3.5 py-2.5 text-sm border border-slate-200 rounded-xl font-mono-tabular focus:outline-none focus:border-emerald-600"
              />
            </div>
          </div>

          {/* Theme Color Picker */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-slate-700">
              Primary Theme Color (Buttons, Active Tabs, Highlights)
            </label>
            <div className="flex flex-wrap items-center gap-3">
              {COLOR_PRESETS.map((c) => (
                <button
                  key={c.hex}
                  type="button"
                  onClick={() => setConfigForm({ ...configForm, primaryColor: c.hex })}
                  className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-xl border text-xs font-semibold cursor-pointer ${
                    configForm.primaryColor.toLowerCase() === c.hex.toLowerCase()
                      ? 'border-slate-900 bg-slate-100 text-slate-900'
                      : 'border-slate-200 bg-white text-slate-700'
                  }`}
                >
                  <span
                    className="w-4 h-4 rounded-full shrink-0"
                    style={{ backgroundColor: c.hex }}
                  />
                  <span>{c.name}</span>
                </button>
              ))}

              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={configForm.primaryColor}
                  onChange={(e) =>
                    setConfigForm({ ...configForm, primaryColor: e.target.value })
                  }
                  aria-label="Custom color picker"
                  className="w-9 h-9 rounded-lg border border-slate-200 cursor-pointer"
                />
                <span className="text-xs font-mono-tabular text-slate-600">
                  {configForm.primaryColor}
                </span>
              </div>
            </div>
          </div>

          {/* Font Family & Hero Banner Image */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-2 border-t border-slate-100">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                App Font Style (Typography)
              </label>
              <select
                value={configForm.fontFamily || 'Plus Jakarta Sans'}
                onChange={(e) =>
                  setConfigForm({ ...configForm, fontFamily: e.target.value })
                }
                className="w-full px-3.5 py-2.5 text-sm border border-slate-200 rounded-xl bg-white focus:outline-none focus:border-emerald-600"
              >
                <option value="Plus Jakarta Sans">Plus Jakarta Sans (Modern Clean)</option>
                <option value="Noto Sans Devanagari">Noto Sans Devanagari (Hindi Friendly)</option>
                <option value="system-ui">System Default (Fast Native)</option>
                <option value="Georgia, serif">Classic Serif (Editorial)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Hero Banner Image URL (Optional)
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={configForm.heroImageUrl || ''}
                  onChange={(e) =>
                    setConfigForm({ ...configForm, heroImageUrl: e.target.value })
                  }
                  placeholder="https://... or upload image"
                  className="flex-1 px-3.5 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-600"
                />
                <label className="px-3 py-2.5 text-xs font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 rounded-xl cursor-pointer shrink-0">
                  Upload
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (!file) return;
                      const reader = new FileReader();
                      reader.onload = () => {
                        if (typeof reader.result === 'string') {
                          setConfigForm({
                            ...configForm,
                            heroImageUrl: reader.result,
                          });
                        }
                      };
                      reader.readAsDataURL(file);
                    }}
                  />
                </label>
              </div>
            </div>
          </div>

          {/* Hero Headline & Subtitles */}
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Hero Main Headline
              </label>
              <input
                type="text"
                value={configForm.heroHeadline}
                onChange={(e) =>
                  setConfigForm({ ...configForm, heroHeadline: e.target.value })
                }
                className="w-full px-3.5 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-600"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Hero Subtitle (Hinglish / Hindi Medium)
              </label>
              <textarea
                rows={2}
                value={configForm.heroSubtitleHi}
                onChange={(e) =>
                  setConfigForm({ ...configForm, heroSubtitleHi: e.target.value })
                }
                className="w-full px-3.5 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-600"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Hero Subtitle (English Medium)
              </label>
              <textarea
                rows={2}
                value={configForm.heroSubtitleEn}
                onChange={(e) =>
                  setConfigForm({ ...configForm, heroSubtitleEn: e.target.value })
                }
                className="w-full px-3.5 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-600"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Top Announcement / Notice Writing
              </label>
              <input
                type="text"
                value={configForm.announcementText}
                onChange={(e) =>
                  setConfigForm({ ...configForm, announcementText: e.target.value })
                }
                className="w-full px-3.5 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-600"
              />
            </div>
          </div>

          {/* 3-Column Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Mentors Stat
              </label>
              <input
                type="text"
                value={configForm.statMentors}
                onChange={(e) =>
                  setConfigForm({ ...configForm, statMentors: e.target.value })
                }
                className="w-full px-3.5 py-2 text-sm border border-slate-200 rounded-xl font-mono-tabular"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Students Stat
              </label>
              <input
                type="text"
                value={configForm.statStudents}
                onChange={(e) =>
                  setConfigForm({ ...configForm, statStudents: e.target.value })
                }
                className="w-full px-3.5 py-2 text-sm border border-slate-200 rounded-xl font-mono-tabular"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Rating Stat
              </label>
              <input
                type="text"
                value={configForm.statRating}
                onChange={(e) =>
                  setConfigForm({ ...configForm, statRating: e.target.value })
                }
                className="w-full px-3.5 py-2 text-sm border border-slate-200 rounded-xl font-mono-tabular"
              />
            </div>
          </div>

          {/* Feature Images Area Manager */}
          <div className="pt-4 border-t border-slate-200 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <ImageIcon className="w-4 h-4 text-emerald-600" />
                  <span>Feature Images Showcase Area ({(configForm.featureImages || []).length} Cards)</span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Upload or customize the visual showcase cards rendered below the Hero in the Student App.
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() =>
                    setConfigForm({
                      ...configForm,
                      featureImages: DEFAULT_ADMIN_FEATURE_IMAGES,
                    })
                  }
                  className="px-3 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl whitespace-nowrap cursor-pointer"
                >
                  Load 4 Studio Defaults
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const nextIdx = (configForm.featureImages || []).length + 1;
                    const newItem: FeatureImageItem = {
                      id: `feat-img-${Date.now()}`,
                      title: `Featured Highlight ${nextIdx}`,
                      hindiTitle: `प्रमुख आकर्षण ${nextIdx}`,
                      caption: 'Visual learning highlight for students across Bharat.',
                      hindiCaption: 'छात्रों के लिए विज़ुअल लर्निंग हाइलाइट।',
                      imageUrl: '/src/assets/images/hero_learning_studio_1793856674745.jpg',
                      ctaLabel: 'Explore Track',
                      targetView: 'catalog',
                    };
                    setConfigForm({
                      ...configForm,
                      featureImages: [...(configForm.featureImages || []), newItem],
                    });
                  }}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl whitespace-nowrap cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Feature Image</span>
                </button>
              </div>
            </div>

            {(configForm.featureImages || []).length === 0 ? (
              <div className="p-6 bg-slate-50 border border-dashed border-slate-300 rounded-2xl text-center space-y-2">
                <p className="text-sm font-semibold text-slate-700">
                  No custom feature cards configured yet (Student app falls back to 4 Studio Presets).
                </p>
                <button
                  type="button"
                  onClick={() =>
                    setConfigForm({
                      ...configForm,
                      featureImages: DEFAULT_ADMIN_FEATURE_IMAGES,
                    })
                  }
                  className="px-4 py-2 text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-xl hover:bg-emerald-100 cursor-pointer"
                >
                  Initialize 4 Studio Feature Cards
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {(configForm.featureImages || []).map((item, idx) => {
                  const updateItem = (patch: Partial<FeatureImageItem>) => {
                    setConfigForm((prev) => ({
                      ...prev,
                      featureImages: (prev.featureImages || []).map((fi, i) =>
                        i === idx ? { ...fi, ...patch } : fi
                      ),
                    }));
                  };

                  const moveItem = (dir: -1 | 1) => {
                    const list = [...(configForm.featureImages || [])];
                    const targetIdx = idx + dir;
                    if (targetIdx < 0 || targetIdx >= list.length) return;
                    const [moved] = list.splice(idx, 1);
                    list.splice(targetIdx, 0, moved);
                    setConfigForm({ ...configForm, featureImages: list });
                  };

                  return (
                    <div
                      key={item.id}
                      className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-3"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-xs font-bold text-slate-900 font-mono-tabular">
                          Feature Card #{idx + 1}
                        </span>
                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            onClick={() => moveItem(-1)}
                            disabled={idx === 0}
                            aria-label="Move card up"
                            className="p-1.5 rounded-lg border border-slate-200 bg-white text-slate-600 hover:text-slate-900 disabled:opacity-40 cursor-pointer"
                          >
                            <ArrowUp className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => moveItem(1)}
                            disabled={idx === (configForm.featureImages || []).length - 1}
                            aria-label="Move card down"
                            className="p-1.5 rounded-lg border border-slate-200 bg-white text-slate-600 hover:text-slate-900 disabled:opacity-40 cursor-pointer"
                          >
                            <ArrowDown className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() =>
                              setConfigForm({
                                ...configForm,
                                featureImages: (configForm.featureImages || []).filter(
                                  (_, i) => i !== idx
                                ),
                              })
                            }
                            aria-label="Delete feature image"
                            className="p-1.5 rounded-lg border border-red-200 bg-red-50 text-red-600 hover:bg-red-100 cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      {/* Thumbnail + Device Upload + Presets */}
                      <div className="flex items-start gap-3">
                        <div className="w-28 h-20 rounded-xl overflow-hidden border border-slate-200 bg-slate-900 shrink-0">
                          <img
                            src={item.imageUrl}
                            alt={item.title}
                            referrerPolicy="no-referrer"
                            onError={(e) => {
                              (e.currentTarget as HTMLImageElement).src =
                                '/src/assets/images/hero_learning_studio_1793856674745.jpg';
                            }}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1 min-w-0 space-y-2">
                          <div className="flex flex-wrap items-center gap-1.5">
                            <label className="inline-flex items-center gap-1 px-2.5 py-1.5 text-[11px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 hover:bg-emerald-100 rounded-lg cursor-pointer">
                              <Upload className="w-3 h-3" />
                              <span>Upload Image</span>
                              <input
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={(e) => {
                                  const file = e.target.files?.[0];
                                  if (!file) return;
                                  const reader = new FileReader();
                                  reader.onload = () => {
                                    if (typeof reader.result === 'string') {
                                      updateItem({ imageUrl: reader.result });
                                    }
                                  };
                                  reader.readAsDataURL(file);
                                  e.target.value = '';
                                }}
                              />
                            </label>
                            {STUDIO_IMAGE_PRESETS.map((preset) => (
                              <button
                                key={preset.url}
                                type="button"
                                onClick={() => updateItem({ imageUrl: preset.url })}
                                className={`px-2 py-1 text-[10px] font-semibold rounded-lg border cursor-pointer ${
                                  item.imageUrl === preset.url
                                    ? 'bg-slate-900 text-white border-slate-900'
                                    : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'
                                }`}
                              >
                                {preset.label}
                              </button>
                            ))}
                          </div>
                          <input
                            type="text"
                            value={item.imageUrl}
                            onChange={(e) => updateItem({ imageUrl: e.target.value })}
                            placeholder="Image path or data URL"
                            className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-200 rounded-lg font-mono-tabular"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                        <div>
                          <label className="block text-[11px] font-bold text-slate-600 mb-1">
                            Title (English)
                          </label>
                          <input
                            type="text"
                            value={item.title}
                            onChange={(e) => updateItem({ title: e.target.value })}
                            className="w-full px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] font-bold text-slate-600 mb-1">
                            Title (Hindi)
                          </label>
                          <input
                            type="text"
                            value={item.hindiTitle || ''}
                            onChange={(e) => updateItem({ hindiTitle: e.target.value })}
                            className="w-full px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] font-bold text-slate-600 mb-1">
                            Caption (English)
                          </label>
                          <input
                            type="text"
                            value={item.caption}
                            onChange={(e) => updateItem({ caption: e.target.value })}
                            className="w-full px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] font-bold text-slate-600 mb-1">
                            Caption (Hindi)
                          </label>
                          <input
                            type="text"
                            value={item.hindiCaption || ''}
                            onChange={(e) => updateItem({ hindiCaption: e.target.value })}
                            className="w-full px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] font-bold text-slate-600 mb-1">
                            Button Label
                          </label>
                          <input
                            type="text"
                            value={item.ctaLabel || ''}
                            onChange={(e) => updateItem({ ctaLabel: e.target.value })}
                            placeholder="Explore Track"
                            className="w-full px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] font-bold text-slate-600 mb-1">
                            Target Student View
                          </label>
                          <select
                            value={item.targetView || 'catalog'}
                            onChange={(e) =>
                              updateItem({
                                targetView: e.target.value as FeatureImageItem['targetView'],
                              })
                            }
                            className="w-full px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg font-semibold"
                          >
                            <option value="catalog">Course Catalog</option>
                            <option value="mcq">Hindi MCQ Sprint</option>
                            <option value="skills">High-Salary Skills</option>
                            <option value="kids">Kids Arena</option>
                            <option value="tests">Online Tests</option>
                            <option value="doubts">Live Doubts</option>
                            <option value="hub">Idea &amp; Goal Hub</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <button
            type="submit"
            className="px-6 py-3 text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl transition-colors cursor-pointer"
          >
            Save Feature Images, Content &amp; Colors
          </button>
        </form>
      )}

      {/* TAB 2: Courses, Modules & Video / Image / PDF Uploader */}
      {activeTab === 'courses' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left 4 Cols: Course Selector + Add New */}
          <div className="lg:col-span-4 bg-white border border-slate-200 rounded-2xl p-5 space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold text-slate-900">Select Course to Edit</h2>
              <button
                type="button"
                onClick={handleCreateNewCourse}
                className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>New Course</span>
              </button>
            </div>

            <div className="space-y-2 max-h-[460px] overflow-y-auto">
              {courses.map((c) => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => loadCourseIntoEditor(c)}
                  className={`w-full p-3.5 rounded-xl border text-left transition-colors cursor-pointer ${
                    selectedCourseId === c.id
                      ? 'bg-emerald-50/60 border-emerald-600'
                      : 'bg-white border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <p className="text-xs font-bold text-slate-900 leading-snug">{c.title}</p>
                  <p className="text-[11px] text-slate-500 mt-1 font-mono-tabular">
                    ₹{c.fullPriceInr} · {c.modules.length} Modules
                  </p>
                </button>
              ))}
            </div>
          </div>

          {/* Right 8 Cols: Edit Course + Upload Image / Video / PDF */}
          <form
            onSubmit={handleSaveCourseChanges}
            className="lg:col-span-8 bg-white border border-slate-200 rounded-2xl p-6 space-y-6"
          >
            <h3 className="text-base font-bold text-slate-900">
              Edit Course Details &amp; Upload Media (Video, Image, PDF)
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Course Heading (English)
                </label>
                <input
                  type="text"
                  value={courseTitle}
                  onChange={(e) => setCourseTitle(e.target.value)}
                  required
                  className="w-full px-3.5 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-600"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Course Description
                </label>
                <textarea
                  rows={2}
                  value={courseSubtitle}
                  onChange={(e) => setCourseSubtitle(e.target.value)}
                  className="w-full px-3.5 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-600"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Course Category / Track
                </label>
                <select
                  value={courseCategory}
                  onChange={(e) => {
                    const cat = e.target.value as CourseCategory;
                    setCourseCategory(cat);
                    if (cat === 'k12') setCourseCategoryLabel(`Class ${courseK12Class} School`);
                    else if (cat === 'competitive') setCourseCategoryLabel('UPSC, SSC & Govt Exams');
                    else if (cat === 'skills') setCourseCategoryLabel('High-Salary Skills');
                    else if (cat === 'kids') setCourseCategoryLabel('Future Kids');
                  }}
                  className="w-full px-3.5 py-2 text-sm border border-slate-200 rounded-xl bg-white font-semibold"
                >
                  <option value="k12">Class 9–12 School &amp; Boards (K-12)</option>
                  <option value="competitive">UPSC, SSC &amp; Banking (Competitive)</option>
                  <option value="skills">Coding, AI &amp; Software (High-Salary Skills)</option>
                  <option value="kids">Future Kids Arena (Kids)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Category Tag / Badge
                </label>
                <input
                  type="text"
                  value={courseCategoryLabel}
                  onChange={(e) => setCourseCategoryLabel(e.target.value)}
                  placeholder="e.g. Class 9 • Mathematics"
                  className="w-full px-3.5 py-2 text-sm border border-slate-200 rounded-xl"
                />
              </div>

              {courseCategory === 'k12' && (
                <>
                  <div>
                    <label className="block text-xs font-bold text-emerald-800 mb-1">
                      K-12 Class Level
                    </label>
                    <select
                      value={courseK12Class}
                      onChange={(e) => {
                        setCourseK12Class(e.target.value);
                        setCourseCategoryLabel(`Class ${e.target.value} • School & Boards`);
                      }}
                      className="w-full px-3.5 py-2 text-sm border border-emerald-300 bg-emerald-50/50 rounded-xl font-bold"
                    >
                      <option value="9">Class 9 (Navi Kaksha)</option>
                      <option value="10">Class 10 (Board Exam)</option>
                      <option value="11">Class 11 (Intermediate 1st Year)</option>
                      <option value="12">Class 12 (Board &amp; Foundation)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-emerald-800 mb-1">
                      K-12 Stream
                    </label>
                    <select
                      value={courseK12Stream}
                      onChange={(e) => setCourseK12Stream(e.target.value)}
                      className="w-full px-3.5 py-2 text-sm border border-emerald-300 bg-emerald-50/50 rounded-xl font-bold"
                    >
                      <option value="general">General / All Subjects (Class 9 &amp; 10)</option>
                      <option value="pcm">PCM (Physics, Chemistry, Maths)</option>
                      <option value="pcb">PCB (Physics, Chemistry, Biology)</option>
                      <option value="commerce">Commerce (Accounts, Economics, BST)</option>
                      <option value="arts">Arts / Humanities (History, Pol Sci, Geo)</option>
                    </select>
                  </div>
                </>
              )}

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Instructor Name
                </label>
                <input
                  type="text"
                  value={courseInstructor}
                  onChange={(e) => setCourseInstructor(e.target.value)}
                  className="w-full px-3.5 py-2 text-sm border border-slate-200 rounded-xl"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Full Course Price (₹)
                </label>
                <input
                  type="number"
                  value={coursePrice}
                  onChange={(e) => setCoursePrice(Number(e.target.value))}
                  className="w-full px-3.5 py-2 text-sm border border-slate-200 rounded-xl font-mono-tabular"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Salary / Goal Package Tag (Optional)
                </label>
                <input
                  type="text"
                  value={courseSalary}
                  onChange={(e) => setCourseSalary(e.target.value)}
                  placeholder="e.g. ₹12–35 LPA or Board Topper"
                  className="w-full px-3.5 py-2 text-sm border border-slate-200 rounded-xl font-mono-tabular"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Upload Course / Subject Thumbnail
                </label>
                <label className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 rounded-xl cursor-pointer w-full justify-center">
                  <ImageIcon className="w-4 h-4" />
                  <span>Choose Thumbnail (.jpg / .png)</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </label>
                {courseImage && (
                  <div className="mt-2 relative h-24 w-full rounded-xl overflow-hidden border border-slate-200 bg-slate-100">
                    <img
                      src={courseImage}
                      alt="Course Thumbnail Preview"
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Module Media Uploader: Video + PDF + Notes */}
            {activeMod && (
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-800">
                      Module Media Uploader (Video, PDF &amp; Notes)
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded-full font-mono-tabular">
                      {modulesList.length} Chapters
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <select
                      value={selectedModIdx}
                      onChange={(e) => setSelectedModIdx(Number(e.target.value))}
                      className="px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg font-semibold max-w-xs truncate"
                    >
                      {modulesList.map((m, idx) => (
                        <option key={m.id} value={idx}>
                          {m.title} {m.pdfUrl ? (m.pdfPolicy === 'downloadable' ? '• [PDF: Downloadable]' : '• [PDF: View-Only]') : ''}
                        </option>
                      ))}
                    </select>

                    <button
                      type="button"
                      onClick={() => {
                        const newChNum = modulesList.length + 1;
                        const newMod: CourseModule = {
                          id: `mod-${Date.now()}-${newChNum}`,
                          chapterNumber: newChNum,
                          title: `${String(newChNum).padStart(2, '0')}. Chapter ${newChNum}: New Chapter Topic`,
                          durationMins: 45,
                          mcqCount: 20,
                          priceInr: 99,
                          isFreePreview: false,
                          keyTopics: ['Core Foundation', 'Important Rules', 'Examples'],
                          pdfPolicy: 'downloadable',
                        };
                        setModulesList([...modulesList, newMod]);
                        setSelectedModIdx(modulesList.length);
                        triggerToast(`Added Chapter ${newChNum}!`);
                      }}
                      className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-bold text-emerald-800 bg-emerald-100 hover:bg-emerald-200 rounded-lg cursor-pointer transition-colors shrink-0"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>+ Add Chapter</span>
                    </button>

                    {modulesList.length > 1 && (
                      <button
                        type="button"
                        onClick={() => {
                          const toRemove = modulesList[selectedModIdx];
                          if (window.confirm(`Delete Chapter "${toRemove.title}"?`)) {
                            const remaining = modulesList.filter((_, idx) => idx !== selectedModIdx);
                            setModulesList(remaining);
                            setSelectedModIdx(Math.max(0, selectedModIdx - 1));
                            triggerToast('Chapter removed');
                          }
                        }}
                        className="inline-flex items-center gap-1 p-1.5 text-xs font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 rounded-lg cursor-pointer transition-colors"
                        title="Delete current chapter"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Module Title
                    </label>
                    <input
                      type="text"
                      value={activeMod.title}
                      onChange={(e) =>
                        setModulesList((prev) =>
                          prev.map((m, i) =>
                            i === selectedModIdx ? { ...m, title: e.target.value } : m
                          )
                        )
                      }
                      className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-lg"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Module Price (₹)
                    </label>
                    <input
                      type="number"
                      value={activeMod.priceInr}
                      onChange={(e) =>
                        setModulesList((prev) =>
                          prev.map((m, i) =>
                            i === selectedModIdx
                              ? { ...m, priceInr: Number(e.target.value) }
                              : m
                          )
                        )
                      }
                      className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-lg font-mono-tabular"
                    />
                  </div>
                </div>

                {/* Chapter Video Lesson - Creator Studio Dark Slate Card */}
                <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl space-y-3.5 text-slate-100 shadow-sm">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                      <Video className="w-4 h-4 text-emerald-400" />
                      <span>Chapter Video Lesson (.mp4 / .webm)</span>
                    </label>
                    {activeMod.videoUrl ? (
                      <span className="text-[10px] font-bold text-emerald-300 bg-emerald-950/90 px-2.5 py-0.5 rounded-full border border-emerald-700">
                        ✓ Video Attached ({activeMod.durationMins || 45} mins)
                      </span>
                    ) : (
                      <span className="text-[10px] font-medium text-amber-300 bg-amber-950/70 px-2 py-0.5 rounded-full border border-amber-800">
                        No Video Attached
                      </span>
                    )}
                  </div>

                  {activeMod.videoUrl ? (
                    <div className="space-y-2.5">
                      <div className="rounded-xl overflow-hidden bg-black border border-slate-800 aspect-video max-h-52 flex items-center justify-center">
                        <video
                          src={activeMod.videoUrl}
                          controls
                          className="w-full h-full object-contain"
                        />
                      </div>
                      <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                        <label className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-emerald-300 bg-emerald-900/60 hover:bg-emerald-900 rounded-lg cursor-pointer transition-colors border border-emerald-700">
                          <Upload className="w-3.5 h-3.5" />
                          <span>Replace Video File (.mp4)</span>
                          <input
                            type="file"
                            accept="video/*"
                            onChange={handleModuleVideoUpload}
                            className="hidden"
                          />
                        </label>
                        <button
                          type="button"
                          onClick={() => {
                            setModulesList((prev) =>
                              prev.map((m, idx) =>
                                idx === selectedModIdx ? { ...m, videoUrl: '' } : m
                              )
                            );
                            triggerToast(`Video detached from Chapter ${selectedModIdx + 1}`);
                          }}
                          className="text-[11px] font-semibold text-rose-400 hover:text-rose-300 cursor-pointer"
                        >
                          ✕ Detach Video
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col sm:flex-row items-center gap-3">
                      <label className="flex-1 w-full flex flex-col items-center justify-center p-5 bg-slate-800/80 hover:bg-slate-800 border-2 border-dashed border-slate-700 hover:border-emerald-500 rounded-xl cursor-pointer transition-colors text-center group">
                        <Upload className="w-6 h-6 text-emerald-400 mb-1 group-hover:scale-110 transition-transform" />
                        <span className="text-xs font-bold text-slate-100">
                          Upload Chapter Video File (.mp4, .webm, .mov)
                        </span>
                        <span className="text-[10px] text-slate-400 mt-0.5">
                          1-Click local upload — auto calculates lecture duration
                        </span>
                        <input
                          type="file"
                          accept="video/*"
                          onChange={handleModuleVideoUpload}
                          className="hidden"
                        />
                      </label>
                      <button
                        type="button"
                        onClick={() => {
                          const fallbackUrl =
                            'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4';
                          setModulesList((prev) =>
                            prev.map((m, idx) =>
                              idx === selectedModIdx ? { ...m, videoUrl: fallbackUrl } : m
                            )
                          );
                          triggerToast('Attached high-definition classroom stream fallback!');
                        }}
                        className="px-3.5 py-3 text-xs font-semibold text-slate-300 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl text-center cursor-pointer transition-colors shrink-0"
                      >
                        Use Default HD Stream
                      </button>
                    </div>
                  )}
                </div>

                {/* PDF Resource & Security Access Policy (Downloadable vs View-Only) */}
                <div className="p-4 bg-emerald-50/50 border border-emerald-200 rounded-2xl space-y-3.5">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <div className="p-1.5 bg-rose-100 text-rose-700 rounded-lg">
                        <FileText className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-slate-900">
                          Module PDF Resource (Notes, Formula Sheet, DPPS)
                        </h4>
                        <p className="text-[11px] text-slate-600">
                          1-Click upload PDF resource alongside this video module and toggle student download permissions.
                        </p>
                      </div>
                    </div>

                    {activeMod.pdfUrl && (
                      <button
                        type="button"
                        onClick={() => {
                          setModulesList((prev) =>
                            prev.map((m, i) =>
                              i === selectedModIdx
                                ? { ...m, pdfUrl: undefined, pdfFileName: undefined }
                                : m
                            )
                          );
                          triggerToast(`PDF detached from Module ${selectedModIdx + 1}`);
                        }}
                        className="inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-lg cursor-pointer transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Remove PDF</span>
                      </button>
                    )}
                  </div>

                  {/* Direct 1-Click PDF Upload */}
                  <div>
                    <label className="flex flex-col items-center justify-center p-4 border-2 border-dashed border-emerald-300 hover:border-emerald-500 rounded-xl bg-white cursor-pointer transition-colors text-center group">
                      <Upload className="w-5 h-5 text-emerald-600 mb-1 group-hover:scale-110 transition-transform" />
                      <span className="text-xs font-bold text-slate-800">
                        {activeMod.pdfUrl ? 'Replace PDF File (.pdf)' : 'Choose PDF File to Upload (.pdf)'}
                      </span>
                      <span className="text-[10px] text-slate-500 mt-0.5">
                        PDF Notes, Question Banks, or Solutions (no external URL needed)
                      </span>
                      <input
                        type="file"
                        accept="application/pdf"
                        onChange={handleModulePdfUpload}
                        className="hidden"
                      />
                    </label>
                  </div>

                  {/* Attached PDF Preview Bar */}
                  {activeMod.pdfUrl && (
                    <div className="flex flex-wrap items-center justify-between gap-2 p-2.5 bg-white border border-slate-200 rounded-xl text-xs">
                      <div className="flex items-center gap-2 min-w-0">
                        <FileText className="w-4 h-4 text-rose-600 shrink-0" />
                        <span className="font-semibold text-slate-900 truncate">
                          {activeMod.pdfFileName || 'module-notes.pdf'}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <a
                          href={activeMod.pdfUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-semibold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-colors cursor-pointer"
                        >
                          <ExternalLink className="w-3 h-3" />
                          <span>Preview PDF</span>
                        </a>
                      </div>
                    </div>
                  )}

                  {/* PDF Access Policy Toggle: View Only vs Downloadable */}
                  <div className="pt-2 border-t border-emerald-200/60 space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-bold text-slate-800">
                        PDF Access Permission for Students:
                      </label>
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          activeMod.pdfPolicy === 'downloadable'
                            ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                            : 'bg-amber-100 text-amber-900 border border-amber-300'
                        }`}
                      >
                        {activeMod.pdfPolicy === 'downloadable'
                          ? '✓ Downloadable Mode'
                          : '🛡️ View Only Mode'}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {/* View Only Option */}
                      <button
                        type="button"
                        onClick={() => {
                          setModulesList((prev) =>
                            prev.map((m, i) =>
                              i === selectedModIdx ? { ...m, pdfPolicy: 'view_only' } : m
                            )
                          );
                          triggerToast('Set to View Only Mode (Anti-Piracy)');
                        }}
                        className={`p-3 rounded-xl border text-left flex items-start gap-2.5 transition-all cursor-pointer ${
                          (activeMod.pdfPolicy || 'view_only') === 'view_only'
                            ? 'bg-amber-50/90 border-amber-500 ring-2 ring-amber-500/20 text-slate-900'
                            : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
                        }`}
                      >
                        <div
                          className={`p-1.5 rounded-lg shrink-0 ${
                            (activeMod.pdfPolicy || 'view_only') === 'view_only'
                              ? 'bg-amber-500 text-white'
                              : 'bg-slate-100 text-slate-500'
                          }`}
                        >
                          <Lock className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="text-xs font-bold">View Only (Anti-Piracy)</p>
                          <p className="text-[10px] text-slate-500 mt-0.5 leading-snug">
                            Students can only read in the LMS reader. Downloading and printing are disabled.
                          </p>
                        </div>
                      </button>

                      {/* Downloadable Option */}
                      <button
                        type="button"
                        onClick={() => {
                          setModulesList((prev) =>
                            prev.map((m, i) =>
                              i === selectedModIdx ? { ...m, pdfPolicy: 'downloadable' } : m
                            )
                          );
                          triggerToast('Set to Downloadable Mode (Offline Study)');
                        }}
                        className={`p-3 rounded-xl border text-left flex items-start gap-2.5 transition-all cursor-pointer ${
                          activeMod.pdfPolicy === 'downloadable'
                            ? 'bg-emerald-50/90 border-emerald-600 ring-2 ring-emerald-600/20 text-slate-900'
                            : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
                        }`}
                      >
                        <div
                          className={`p-1.5 rounded-lg shrink-0 ${
                            activeMod.pdfPolicy === 'downloadable'
                              ? 'bg-emerald-600 text-white'
                              : 'bg-slate-100 text-slate-500'
                          }`}
                        >
                          <Download className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="text-xs font-bold">Downloadable (Offline Study)</p>
                          <p className="text-[10px] text-slate-500 mt-0.5 leading-snug">
                            Students get a 1-click Download button to save the PDF to their device.
                          </p>
                        </div>
                      </button>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Write Protected Study Notes (View-Only in LMS)
                  </label>
                  <textarea
                    rows={3}
                    value={activeMod.notesText || activeMod.keyTopics.join('\n')}
                    onChange={(e) =>
                      setModulesList((prev) =>
                        prev.map((m, i) =>
                          i === selectedModIdx ? { ...m, notesText: e.target.value } : m
                        )
                      )
                    }
                    className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-lg"
                  />
                </div>
              </div>
            )}

            {/* Bulk / Auto-Sequence Video Uploader (1, 2, 3... Symmetry) */}
            <div className="p-4 bg-emerald-50/60 border border-emerald-200 rounded-xl space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <h4 className="text-xs font-bold text-emerald-950">
                    Auto-Sequence Bulk Video Uploader (1, 2, 3... Symmetry)
                  </h4>
                  <p className="text-[11px] text-emerald-800">
                    Multiple videos upload karein ya paste karein — API khud se Chapter 1, 2, 3...30 ke sequence mein arrange kar degi.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    const sorted = sortAndNumberModulesSymmetrically(
                      modulesList,
                      { normalizeTitles: true }
                    );
                    setModulesList(sorted);
                    triggerToast(
                      `Sorted ${sorted.length} chapters in 1, 2, 3... symmetry! Click Save Course Changes.`
                    );
                  }}
                  className="px-3 py-1.5 text-[11px] font-bold text-emerald-900 bg-white hover:bg-emerald-100 border border-emerald-300 rounded-lg cursor-pointer"
                >
                  Auto-Number Existing ({modulesList.length})
                </button>
              </div>

              <div className="p-4 bg-white border-2 border-dashed border-emerald-400 rounded-xl text-center space-y-2">
                <label className="flex flex-col items-center justify-center cursor-pointer py-2 group">
                  <Video className="w-8 h-8 text-emerald-600 mb-1 group-hover:scale-110 transition-transform" />
                  <span className="text-xs font-bold text-emerald-950">
                    Select All Chapter Video Files (.mp4, .mov, .webm)
                  </span>
                  <span className="text-[11px] text-slate-500 mt-0.5">
                    Select multiple video files together — 1, 2, 3...30 sequence automatically arranged with titles and durations! No URL paste required.
                  </span>
                  <input
                    type="file"
                    accept="video/*"
                    multiple
                    className="hidden"
                    onChange={async (e) => {
                      const files = Array.from(e.target.files || []);
                      if (files.length === 0) return;
                      const videos = files.map((file, idx) => ({
                        title: file.name.replace(/\.[^/.]+$/, ''),
                        videoUrl: URL.createObjectURL(file),
                        chapterNumber: modulesList.length + idx + 1,
                      }));
                      if (onAutoSequenceCourseVideos && selectedCourseId) {
                        setIsAutoSequencing(true);
                        await onAutoSequenceCourseVideos(selectedCourseId, {
                          videos,
                          normalizeTitles: true,
                        });
                        setIsAutoSequencing(false);
                        triggerToast(
                          `Uploaded & Auto-Sequenced ${files.length} videos in 1, 2, 3... symmetry!`
                        );
                      } else {
                        const newMods: CourseModule[] = files.map((f, idx) => {
                          const chNum = modulesList.length + idx + 1;
                          return {
                            id: `mod-${Date.now()}-${chNum}`,
                            chapterNumber: chNum,
                            title: `${String(chNum).padStart(2, '0')}. Chapter ${chNum}: ${f.name.replace(/\.[^/.]+$/, '')}`,
                            durationMins: 45,
                            mcqCount: 20,
                            priceInr: 99,
                            isFreePreview: idx === 0,
                            keyTopics: ['Core Theory', 'Formulas', 'Solved Problems'],
                            videoUrl: URL.createObjectURL(f),
                            pdfPolicy: 'downloadable',
                          };
                        });
                        setModulesList([...modulesList, ...newMods]);
                        triggerToast(`Added ${newMods.length} chapters in sequence!`);
                      }
                      e.target.value = '';
                    }}
                  />
                </label>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                type="submit"
                disabled={isSavingCourse}
                className="inline-flex items-center gap-2 px-6 py-3 text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-700 disabled:opacity-60 rounded-xl transition-colors cursor-pointer"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>
                  {isSavingCourse
                    ? 'Saving & Publishing Live...'
                    : 'Save Course & Uploaded Media'}
                </span>
              </button>

              {courseSaveStatus && (
                <span
                  className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold border ${
                    courseSaveStatus.type === 'success'
                      ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                      : 'bg-rose-50 text-rose-800 border-rose-200'
                  }`}
                >
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>{courseSaveStatus.text}</span>
                </span>
              )}
            </div>
          </form>
        </div>
      )}

      {/* TAB 3: Add New Hindi + English MCQ Segment */}
      {activeTab === 'mcq' && (
        <form
          onSubmit={handleCreateMcq}
          className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 space-y-5 max-w-3xl"
        >
          <h2 className="text-lg font-bold text-slate-900">
            Publish New Automatic Hindi / English MCQ Segment
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Subject / Track Name
              </label>
              <input
                type="text"
                value={mcqTrackTitle}
                onChange={(e) => setMcqTrackTitle(e.target.value)}
                required
                className="w-full px-3.5 py-2 text-sm border border-slate-200 rounded-xl"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Concept Title
              </label>
              <input
                type="text"
                value={mcqConceptTitle}
                onChange={(e) => setMcqConceptTitle(e.target.value)}
                placeholder="e.g. Newton's Second Law"
                className="w-full px-3.5 py-2 text-sm border border-slate-200 rounded-xl"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              MCQ Question (Hindi / Hinglish / English)
            </label>
            <textarea
              rows={2}
              value={mcqQuestionHi}
              onChange={(e) => setMcqQuestionHi(e.target.value)}
              placeholder="Write the MCQ question here..."
              required
              className="w-full px-3.5 py-2 text-sm border border-slate-200 rounded-xl"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              { label: 'Option A', val: mcqOptHi0, set: setMcqOptHi0 },
              { label: 'Option B', val: mcqOptHi1, set: setMcqOptHi1 },
              { label: 'Option C', val: mcqOptHi2, set: setMcqOptHi2 },
              { label: 'Option D', val: mcqOptHi3, set: setMcqOptHi3 },
            ].map((o, idx) => (
              <div key={o.label}>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {o.label}
                </label>
                <input
                  type="text"
                  value={o.val}
                  onChange={(e) => o.set(e.target.value)}
                  required
                  className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl"
                />
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Correct Answer
              </label>
              <select
                value={mcqCorrectIdx}
                onChange={(e) => setMcqCorrectIdx(Number(e.target.value))}
                className="w-full px-3.5 py-2 text-sm border border-slate-200 rounded-xl bg-white"
              >
                <option value={0}>Option A</option>
                <option value={1}>Option B</option>
                <option value={2}>Option C</option>
                <option value={3}>Option D</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Key Formula / Rule
              </label>
              <input
                type="text"
                value={mcqFormula}
                onChange={(e) => setMcqFormula(e.target.value)}
                placeholder="e.g. F = m × a"
                className="w-full px-3.5 py-2 text-sm border border-slate-200 rounded-xl font-mono-tabular"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Answer Explanation
            </label>
            <textarea
              rows={2}
              value={mcqExplanationHi}
              onChange={(e) => setMcqExplanationHi(e.target.value)}
              placeholder="Explain why the answer is correct..."
              required
              className="w-full px-3.5 py-2 text-sm border border-slate-200 rounded-xl"
            />
          </div>

          <button
            type="submit"
            className="px-6 py-3 text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl transition-colors cursor-pointer"
          >
            Publish MCQ to Live Sprint
          </button>
        </form>
      )}

      {/* TAB 4: Contact Info Editor & Student Contact Messages */}
      {activeTab === 'contact' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          <form
            onSubmit={handleSaveBranding}
            className="lg:col-span-5 bg-white border border-slate-200 rounded-2xl p-6 space-y-4"
          >
            <h2 className="text-base font-bold text-slate-900">
              Edit Contact &amp; Support Details
            </h2>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Support Email
              </label>
              <input
                type="email"
                value={configForm.contactEmail}
                onChange={(e) =>
                  setConfigForm({ ...configForm, contactEmail: e.target.value })
                }
                className="w-full px-3.5 py-2 text-sm border border-slate-200 rounded-xl font-mono-tabular"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Phone / WhatsApp Number
              </label>
              <input
                type="text"
                value={configForm.contactPhone}
                onChange={(e) =>
                  setConfigForm({ ...configForm, contactPhone: e.target.value })
                }
                className="w-full px-3.5 py-2 text-sm border border-slate-200 rounded-xl font-mono-tabular"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Office / Center Address
              </label>
              <textarea
                rows={2}
                value={configForm.contactAddress}
                onChange={(e) =>
                  setConfigForm({ ...configForm, contactAddress: e.target.value })
                }
                className="w-full px-3.5 py-2 text-sm border border-slate-200 rounded-xl"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl transition-colors cursor-pointer"
            >
              Save Contact Details
            </button>
          </form>

          <div className="lg:col-span-7 bg-white border border-slate-200 rounded-2xl p-6 space-y-4">
            <h2 className="text-base font-bold text-slate-900">
              Student Contact &amp; Writing Inbox ({contactMessages.length})
            </h2>

            {contactMessages.length === 0 ? (
              <p className="text-sm text-slate-500 py-6 text-center">
                No student messages yet.
              </p>
            ) : (
              <div className="space-y-3">
                {contactMessages.map((msg) => (
                  <div
                    key={msg.id}
                    className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-1.5"
                  >
                    <div className="flex items-center justify-between text-xs text-slate-500">
                      <span className="font-bold text-slate-900">
                        {msg.senderName} ({msg.senderContact})
                      </span>
                      <span className="font-mono-tabular">{msg.timestamp}</span>
                    </div>
                    <p className="text-xs font-bold text-emerald-700">{msg.subject}</p>
                    <p className="text-sm text-slate-700 leading-relaxed">{msg.message}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 5: Online Tests Builder & Student Submissions */}
      {activeTab === 'tests' && (
        <OnlineTestsAdminPanel
          onlineTests={onlineTests}
          testSubmissions={testSubmissions}
          onSaveOnlineTest={onSaveOnlineTest}
          onDeleteOnlineTest={onDeleteOnlineTest}
          onToast={triggerToast}
        />
      )}

      {/* TAB 6: Admin Bank Account & Payment Settlement Ledger */}
      {activeTab === 'bank' && (
        <BankPaymentsAdminPanel
          bankAccount={bankAccount}
          receipts={receipts}
          onSaveBankAccount={onSaveBankAccount}
          onToast={triggerToast}
        />
      )}

      {/* TAB 7: Student Course Access Manager */}
      {activeTab === 'access' && (
        <StudentAccessAdminPanel
          courses={courses}
          unlockedModuleIds={unlockedModuleIds}
          studentAccessGrants={studentAccessGrants}
          onGrantCourseAccess={onGrantCourseAccess}
          onRevokeCourseAccess={onRevokeCourseAccess}
          onToast={triggerToast}
        />
      )}

      {/* TAB 8: Users, Doubts, Community & Broadcasts Control */}
      {activeTab === 'users' && (
        <div className="space-y-6">
          {/* 1. Send Broadcast Notification to All Students */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                if (!broadcastTitle.trim() || !broadcastMsg.trim() || !onSendBroadcast)
                  return;
                await onSendBroadcast({
                  title: broadcastTitle.trim(),
                  message: broadcastMsg.trim(),
                });
                setBroadcastTitle('');
                setBroadcastMsg('');
                triggerToast('Broadcast Notification Sent to All Students!');
              }}
              className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4"
            >
              <div className="flex items-center gap-2">
                <Bell className="w-5 h-5 text-emerald-600" />
                <h3 className="text-base font-bold text-slate-900">
                  Send Student Broadcast Alert
                </h3>
              </div>
              <input
                type="text"
                required
                value={broadcastTitle}
                onChange={(e) => setBroadcastTitle(e.target.value)}
                placeholder="Alert Title (e.g. Live Class at 6 PM Today)"
                className="w-full px-3.5 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-600"
              />
              <textarea
                rows={3}
                required
                value={broadcastMsg}
                onChange={(e) => setBroadcastMsg(e.target.value)}
                placeholder="Write announcement message for all students..."
                className="w-full px-3.5 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-600"
              />
              <button
                type="submit"
                className="px-5 py-2.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl inline-flex items-center gap-1.5 cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Send Notification to All Students</span>
              </button>
            </form>

            {/* 2. Student Streak, Kids XP & Stars Control */}
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                if (!onUpdateStudentRewards) return;
                await onUpdateStudentRewards({
                  streakDays: Number(rewardStreak) || 0,
                  kidsXp: Number(rewardXp) || 0,
                  kidsStars: Number(rewardStars) || 0,
                });
                triggerToast('Student Streak & Kids XP Updated!');
              }}
              className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4"
            >
              <div className="flex items-center gap-2">
                <Award className="w-5 h-5 text-amber-500" />
                <h3 className="text-base font-bold text-slate-900">
                  Student Streak &amp; Kids Arena Rewards Control
                </h3>
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Study Streak (Days)
                  </label>
                  <input
                    type="number"
                    min={0}
                    value={rewardStreak}
                    onChange={(e) => setRewardStreak(Number(e.target.value))}
                    className="w-full px-3 py-2 text-sm font-mono-tabular border border-slate-200 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Kids Arena XP
                  </label>
                  <input
                    type="number"
                    min={0}
                    value={rewardXp}
                    onChange={(e) => setRewardXp(Number(e.target.value))}
                    className="w-full px-3 py-2 text-sm font-mono-tabular border border-slate-200 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Kids Stars
                  </label>
                  <input
                    type="number"
                    min={0}
                    value={rewardStars}
                    onChange={(e) => setRewardStars(Number(e.target.value))}
                    className="w-full px-3 py-2 text-sm font-mono-tabular border border-slate-200 rounded-xl"
                  />
                </div>
              </div>
              <button
                type="submit"
                className="px-5 py-2.5 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-xl cursor-pointer"
              >
                Save Student Rewards
              </button>
            </form>
          </div>

          {/* 3. Live Student Doubts Answer & Moderation */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MessageCircle className="w-5 h-5 text-emerald-600" />
                <h3 className="text-base font-bold text-slate-900">
                  Live Student Doubts ({doubts.length})
                </h3>
              </div>
            </div>

            {doubts.length === 0 ? (
              <p className="text-xs text-slate-500">No student doubts posted yet.</p>
            ) : (
              <div className="space-y-3">
                {doubts.map((d) => (
                  <div
                    key={d.id}
                    className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-bold text-slate-900">
                            {d.studentName}
                          </span>
                          <span className="px-2 py-0.5 text-[10px] font-bold bg-indigo-100 text-indigo-800 rounded">
                            {d.topicTag}
                          </span>
                          <span
                            className={`px-2 py-0.5 text-[10px] font-bold rounded ${
                              d.status === 'Answered'
                                ? 'bg-emerald-100 text-emerald-800'
                                : 'bg-amber-100 text-amber-900'
                            }`}
                          >
                            {d.status}
                          </span>
                        </div>
                        <p className="text-xs text-slate-800 mt-1">{d.questionText}</p>
                        {d.mentorReply && (
                          <p className="text-xs text-emerald-800 bg-emerald-50 border border-emerald-200 rounded-lg px-3 py-2 mt-2">
                            <strong>Mentor Reply:</strong> {d.mentorReply}
                          </p>
                        )}
                      </div>

                      {onDeleteDoubt && (
                        <button
                          type="button"
                          onClick={async () => {
                            await onDeleteDoubt(d.id);
                            triggerToast('Doubt deleted');
                          }}
                          className="p-2 text-rose-600 hover:bg-rose-50 rounded-lg cursor-pointer"
                          title="Delete Doubt"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>

                    {onReplyDoubt && (
                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          value={doubtReplies[d.id] || ''}
                          onChange={(e) =>
                            setDoubtReplies((prev) => ({
                              ...prev,
                              [d.id]: e.target.value,
                            }))
                          }
                          placeholder="Write official Mentor Reply to this doubt..."
                          className="flex-1 px-3 py-2 text-xs bg-white border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-600"
                        />
                        <button
                          type="button"
                          onClick={async () => {
                            const txt = (doubtReplies[d.id] || '').trim();
                            if (!txt) return;
                            await onReplyDoubt(d.id, txt);
                            setDoubtReplies((prev) => ({ ...prev, [d.id]: '' }));
                            triggerToast('Mentor Reply Saved!');
                          }}
                          className="px-4 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl cursor-pointer"
                        >
                          Reply
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* 4. Startup Ideas 💡, Goal Conversations 💬 & Student Photos 📸 Moderation */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Startup Ideas */}
            <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-3">
              <div className="flex items-center gap-2">
                <Lightbulb className="w-4 h-4 text-amber-500" />
                <h4 className="text-sm font-bold text-slate-900">
                  Startup Ideas ({startupIdeas.length})
                </h4>
              </div>
              <div className="space-y-2.5 max-h-80 overflow-y-auto">
                {startupIdeas.map((idea) => (
                  <div
                    key={idea.id}
                    className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-start justify-between gap-2"
                  >
                    <div>
                      <p className="text-xs font-bold text-slate-900">{idea.title}</p>
                      <p className="text-[11px] text-slate-600">
                        by {idea.studentName} • {idea.upvotes} upvotes
                      </p>
                    </div>
                    {onDeleteStartupIdea && (
                      <button
                        type="button"
                        onClick={async () => {
                          await onDeleteStartupIdea(idea.id);
                          triggerToast('Startup Idea removed');
                        }}
                        className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Goal Conversations */}
            <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-3">
              <div className="flex items-center gap-2">
                <Target className="w-4 h-4 text-emerald-600" />
                <h4 className="text-sm font-bold text-slate-900">
                  Goal Conversations ({goalConversations.length})
                </h4>
              </div>
              <div className="space-y-2.5 max-h-80 overflow-y-auto">
                {goalConversations.map((g) => (
                  <div
                    key={g.id}
                    className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-2"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="text-xs font-bold text-slate-900">
                          {g.studentName}{' '}
                          <span className="text-indigo-700 font-normal">
                            ({g.goalTag})
                          </span>
                        </p>
                        <p className="text-[11px] text-slate-700 mt-0.5">{g.message}</p>
                      </div>
                      {onDeleteGoalConversation && (
                        <button
                          type="button"
                          onClick={async () => {
                            await onDeleteGoalConversation(g.id);
                            triggerToast('Goal thread removed');
                          }}
                          className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                    {onReplyGoalConversation && (
                      <div className="flex items-center gap-1.5">
                        <input
                          type="text"
                          value={goalAdminReplies[g.id] || ''}
                          onChange={(e) =>
                            setGoalAdminReplies((prev) => ({
                              ...prev,
                              [g.id]: e.target.value,
                            }))
                          }
                          placeholder="Reply as Admin Mentor..."
                          className="flex-1 px-2.5 py-1.5 text-[11px] bg-white border border-slate-200 rounded-lg"
                        />
                        <button
                          type="button"
                          onClick={async () => {
                            const txt = (goalAdminReplies[g.id] || '').trim();
                            if (!txt) return;
                            await onReplyGoalConversation(g.id, txt);
                            setGoalAdminReplies((prev) => ({ ...prev, [g.id]: '' }));
                            triggerToast('Replied to Goal Thread!');
                          }}
                          className="px-2.5 py-1.5 text-[11px] font-bold text-white bg-emerald-600 rounded-lg cursor-pointer"
                        >
                          Send
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Student Photos */}
            <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-3">
              <div className="flex items-center gap-2">
                <Camera className="w-4 h-4 text-indigo-600" />
                <h4 className="text-sm font-bold text-slate-900">
                  Student Photos ({studentGallery.length})
                </h4>
              </div>
              <div className="space-y-2.5 max-h-80 overflow-y-auto">
                {studentGallery.map((photo) => (
                  <div
                    key={photo.id}
                    className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between gap-2"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <img
                        src={photo.imageUrl}
                        alt={photo.caption}
                        className="w-10 h-10 rounded-lg object-cover shrink-0"
                      />
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-slate-900 truncate">
                          {photo.studentName}
                        </p>
                        <p className="text-[11px] text-slate-600 truncate">
                          {photo.caption}
                        </p>
                      </div>
                    </div>
                    {onDeleteGalleryPhoto && (
                      <button
                        type="button"
                        onClick={async () => {
                          await onDeleteGalleryPhoto(photo.id);
                          triggerToast('Photo removed');
                        }}
                        className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg shrink-0 cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

interface StudentAccessAdminPanelProps {
  courses: Course[];
  unlockedModuleIds: string[];
  studentAccessGrants: StudentAccessGrant[];
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
  onToast: (msg: string) => void;
}

const StudentAccessAdminPanel: React.FC<StudentAccessAdminPanelProps> = ({
  courses,
  unlockedModuleIds,
  studentAccessGrants,
  onGrantCourseAccess,
  onRevokeCourseAccess,
  onToast,
}) => {
  const [studentName, setStudentName] = useState('');
  const [studentIdentifier, setStudentIdentifier] = useState('');
  const [selectedCourseId, setSelectedCourseId] = useState(courses[0]?.id || '');
  const [accessType, setAccessType] = useState<'Full Course' | 'Single Chapter'>(
    'Full Course'
  );
  const [selectedModuleId, setSelectedModuleId] = useState(
    courses[0]?.modules[0]?.id || ''
  );
  const [note, setNote] = useState('Approved by Admin');

  const selectedCourse =
    courses.find((c) => c.id === selectedCourseId) || courses[0];

  const handleGrant = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCourse) return;
    const targetModules =
      accessType === 'Full Course'
        ? selectedCourse.modules
        : selectedCourse.modules.filter((m) => m.id === selectedModuleId);

    if (targetModules.length === 0) return;

    await onGrantCourseAccess({
      studentName: studentName.trim() || 'Student Learner',
      studentIdentifier: studentIdentifier.trim() || 'Direct Student',
      courseId: selectedCourse.id,
      courseTitle: selectedCourse.title,
      accessType,
      moduleIds: targetModules.map((m) => m.id),
      moduleTitles: targetModules.map((m) => m.title),
      note: note.trim(),
    });

    setStudentName('');
    setStudentIdentifier('');
    onToast(
      `Unlocked ${targetModules.length} chapter(s) of "${selectedCourse.title}"!`
    );
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      {/* Left 5 Cols: Grant Course / Chapter Access Form */}
      <form
        onSubmit={handleGrant}
        className="lg:col-span-5 bg-white border border-slate-200 rounded-2xl p-6 space-y-4 h-fit"
      >
        <div className="flex items-center gap-2">
          <Unlock className="w-4 h-4 text-emerald-600" />
          <h2 className="text-base font-bold text-slate-900">
            Student ko Course Access Dein
          </h2>
        </div>
        <p className="text-xs text-slate-600">
          Kisi bhi student ko Full Course ya Single Chapter ka 12 Months LMS Video &amp;
          PDF access turant unlock karein.
        </p>

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">
            Student Name *
          </label>
          <input
            type="text"
            required
            value={studentName}
            onChange={(e) => setStudentName(e.target.value)}
            placeholder="e.g. Rahul Kumar"
            className="w-full px-3.5 py-2 text-sm border border-slate-200 rounded-xl"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">
            Student Gmail ID or Mobile Number *
          </label>
          <input
            type="text"
            required
            value={studentIdentifier}
            onChange={(e) => setStudentIdentifier(e.target.value)}
            placeholder="e.g. rahul@gmail.com or +91 9876543210"
            className="w-full px-3.5 py-2 text-sm border border-slate-200 rounded-xl font-mono-tabular"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">
            Select Course
          </label>
          <select
            value={selectedCourseId}
            onChange={(e) => {
              const nextId = e.target.value;
              setSelectedCourseId(nextId);
              const nextC = courses.find((c) => c.id === nextId);
              if (nextC?.modules[0]) {
                setSelectedModuleId(nextC.modules[0].id);
              }
            }}
            className="w-full px-3 py-2 text-xs font-semibold border border-slate-200 rounded-xl bg-white"
          >
            {courses.map((c) => (
              <option key={c.id} value={c.id}>
                {c.title} ({c.modules.length} Chapters)
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">
            Access Type
          </label>
          <div className="grid grid-cols-2 gap-2">
            {(['Full Course', 'Single Chapter'] as const).map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setAccessType(t)}
                className={`py-2 px-3 rounded-xl text-xs font-bold border cursor-pointer ${
                  accessType === t
                    ? 'bg-emerald-600 text-white border-emerald-600'
                    : 'bg-slate-50 text-slate-700 border-slate-200'
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        {accessType === 'Single Chapter' && selectedCourse && (
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Select Chapter / Module
            </label>
            <select
              value={selectedModuleId}
              onChange={(e) => setSelectedModuleId(e.target.value)}
              className="w-full px-3 py-2 text-xs font-semibold border border-slate-200 rounded-xl bg-white"
            >
              {selectedCourse.modules.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.title} (₹{m.priceInr})
                </option>
              ))}
            </select>
          </div>
        )}

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">
            Admin Note (e.g. Cash / Scholarship / Demo)
          </label>
          <input
            type="text"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            className="w-full px-3.5 py-2 text-sm border border-slate-200 rounded-xl"
          />
        </div>

        <button
          type="submit"
          className="w-full py-2.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl inline-flex items-center justify-center gap-1.5 cursor-pointer"
        >
          <Unlock className="w-4 h-4" />
          <span>Unlock &amp; Grant Course Access</span>
        </button>
      </form>

      {/* Right 7 Cols: Granted Access Log & Quick Course Lock/Unlock */}
      <div className="lg:col-span-7 space-y-5">
        <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4">
          <h2 className="text-base font-bold text-slate-900">
            Course-Wise Access Control ({unlockedModuleIds.length} Chapters Unlocked)
          </h2>
          <div className="space-y-2.5 max-h-[260px] overflow-y-auto">
            {courses.map((c) => {
              const unlockedInCourse = c.modules.filter((m) =>
                unlockedModuleIds.includes(m.id)
              ).length;
              const allUnlocked = unlockedInCourse === c.modules.length;
              return (
                <div
                  key={c.id}
                  className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between gap-3"
                >
                  <div>
                    <p className="text-xs font-bold text-slate-900">{c.title}</p>
                    <p className="text-[11px] text-slate-500 font-mono-tabular">
                      {unlockedInCourse} / {c.modules.length} Chapters Unlocked
                    </p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    {!allUnlocked && (
                      <button
                        type="button"
                        onClick={async () => {
                          await onGrantCourseAccess({
                            studentName: 'All Active Students',
                            studentIdentifier: 'Batch Unlock',
                            courseId: c.id,
                            courseTitle: c.title,
                            accessType: 'Full Course',
                            moduleIds: c.modules.map((m) => m.id),
                            moduleTitles: c.modules.map((m) => m.title),
                            note: 'Full Course Unlocked by Admin',
                          });
                          onToast(`Unlocked all chapters of ${c.title}!`);
                        }}
                        className="px-3 py-1.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg inline-flex items-center gap-1 cursor-pointer"
                      >
                        <Unlock className="w-3.5 h-3.5" />
                        <span>Unlock Full</span>
                      </button>
                    )}
                    {unlockedInCourse > 0 && (
                      <button
                        type="button"
                        onClick={async () => {
                          await onRevokeCourseAccess(c.modules.map((m) => m.id));
                          onToast(`Locked all chapters of ${c.title}`);
                        }}
                        className="px-3 py-1.5 text-xs font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 rounded-lg inline-flex items-center gap-1 cursor-pointer"
                      >
                        <Lock className="w-3.5 h-3.5" />
                        <span>Lock</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-3">
          <h3 className="text-sm font-bold text-slate-900">
            Recent Student Access Grants ({studentAccessGrants.length})
          </h3>
          {studentAccessGrants.length === 0 ? (
            <p className="text-xs text-slate-500 py-4">
              No manual course access grants yet. Use the form on the left to unlock a
              course for any student.
            </p>
          ) : (
            <div className="space-y-2.5">
              {studentAccessGrants.map((g) => (
                <div
                  key={g.id}
                  className="p-3.5 bg-emerald-50/50 border border-emerald-200 rounded-xl flex items-start justify-between gap-3"
                >
                  <div>
                    <p className="text-xs font-bold text-slate-900">
                      {g.studentName}{' '}
                      <span className="font-normal text-slate-600">
                        ({g.studentIdentifier})
                      </span>
                    </p>
                    <p className="text-xs font-semibold text-emerald-800 mt-0.5">
                      {g.courseTitle} — {g.accessType} ({g.moduleIds.length} Chapters)
                    </p>
                    {g.note && (
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        Note: {g.note} • {g.grantedAt}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

interface BankPaymentsAdminPanelProps {
  bankAccount: BankAccountConfig;
  receipts: PurchaseReceipt[];
  onSaveBankAccount: (updates: Partial<BankAccountConfig>) => Promise<void>;
  onToast: (msg: string) => void;
}

const BankPaymentsAdminPanel: React.FC<BankPaymentsAdminPanelProps> = ({
  bankAccount,
  receipts,
  onSaveBankAccount,
  onToast,
}) => {
  const [form, setForm] = useState<BankAccountConfig>(bankAccount);

  React.useEffect(() => {
    setForm(bankAccount);
  }, [bankAccount]);

  const totalReceivedInr = receipts.reduce(
    (sum, r) => sum + (Number(r.amountPaidInr) || 0),
    0
  );

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSaveBankAccount(form);
    onToast('Admin Bank Account, UPI & Razorpay Settings Updated!');
  };

  return (
    <div className="space-y-6">
      {/* Live Bank Settlement Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-slate-900 text-white rounded-2xl p-5">
          <p className="text-xs text-slate-400">Total Payment Received</p>
          <p className="text-2xl font-bold text-emerald-400 font-mono-tabular mt-1">
            ₹{totalReceivedInr.toLocaleString('en-IN')}
          </p>
          <p className="text-[11px] text-slate-300 mt-1">
            Settled to {form.bankName}
          </p>
        </div>
        <div className="bg-white border border-slate-200 rounded-2xl p-5">
          <p className="text-xs text-slate-500">Total Student Transactions</p>
          <p className="text-2xl font-bold text-slate-900 font-mono-tabular mt-1">
            {receipts.length}
          </p>
          <p className="text-[11px] text-emerald-700 mt-1">
            Razorpay • UPI • NetBanking • Card
          </p>
        </div>
        <div className="bg-white border border-slate-200 rounded-2xl p-5">
          <p className="text-xs text-slate-500">Active Settlement Account</p>
          <p className="text-sm font-bold text-slate-900 mt-1">
            {form.accountHolderName}
          </p>
          <p className="text-xs font-mono-tabular text-slate-600 mt-0.5">
            A/C: ••••{form.accountNumber.slice(-4)} | IFSC: {form.ifscCode}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Edit Bank Account, UPI & Razorpay Form */}
        <form
          onSubmit={handleSave}
          className="lg:col-span-5 bg-white border border-slate-200 rounded-2xl p-6 space-y-4 h-fit"
        >
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h2 className="text-base font-bold text-slate-900">
              Add / Edit Admin Bank Account &amp; UPI
            </h2>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() =>
                  setForm({
                    accountHolderName: '',
                    bankName: '',
                    accountNumber: '',
                    ifscCode: '',
                    upiId: '',
                    razorpayKeyId: form.razorpayKeyId,
                    razorpayMerchantName: form.razorpayMerchantName,
                  })
                }
                className="px-2.5 py-1.5 text-[11px] font-bold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-lg cursor-pointer"
              >
                + Add New Bank Account
              </button>
              <button
                type="button"
                onClick={() => setForm(bankAccount)}
                className="px-2.5 py-1.5 text-[11px] font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg cursor-pointer"
              >
                Reset
              </button>
            </div>
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Account Holder / Business Name
            </label>
            <input
              type="text"
              required
              value={form.accountHolderName}
              onChange={(e) =>
                setForm({ ...form, accountHolderName: e.target.value })
              }
              className="w-full px-3.5 py-2 text-sm border border-slate-200 rounded-xl"
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Bank Name
              </label>
              <input
                type="text"
                required
                value={form.bankName}
                onChange={(e) => setForm({ ...form, bankName: e.target.value })}
                className="w-full px-3.5 py-2 text-sm border border-slate-200 rounded-xl"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                IFSC Code
              </label>
              <input
                type="text"
                required
                value={form.ifscCode}
                onChange={(e) =>
                  setForm({ ...form, ifscCode: e.target.value.toUpperCase() })
                }
                className="w-full px-3.5 py-2 text-sm border border-slate-200 rounded-xl font-mono-tabular"
              />
            </div>
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Bank Account Number
            </label>
            <input
              type="text"
              required
              value={form.accountNumber}
              onChange={(e) => setForm({ ...form, accountNumber: e.target.value })}
              className="w-full px-3.5 py-2 text-sm border border-slate-200 rounded-xl font-mono-tabular"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Merchant UPI ID (GPay / PhonePe / Paytm)
            </label>
            <input
              type="text"
              required
              value={form.upiId}
              onChange={(e) => setForm({ ...form, upiId: e.target.value })}
              className="w-full px-3.5 py-2 text-sm border border-slate-200 rounded-xl font-mono-tabular"
            />
          </div>
          {form.upiQrCodeUrl && (
            <div className="p-3 bg-emerald-50/70 border border-emerald-200 rounded-xl flex items-center gap-3">
              <img
                src={form.upiQrCodeUrl}
                alt="UPI QR Code"
                className="w-16 h-16 object-contain rounded-lg bg-white border border-slate-200 p-1 shrink-0"
              />
              <div className="min-w-0 flex-1 text-xs">
                <p className="font-bold text-emerald-900">Active UPI Payment QR</p>
                <p className="text-[11px] text-emerald-700 truncate font-mono-tabular">
                  {form.upiId}
                </p>
              </div>
            </div>
          )}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Razorpay Merchant Name
              </label>
              <input
                type="text"
                value={form.razorpayMerchantName}
                onChange={(e) =>
                  setForm({ ...form, razorpayMerchantName: e.target.value })
                }
                className="w-full px-3.5 py-2 text-sm border border-slate-200 rounded-xl"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Razorpay Key ID
              </label>
              <input
                type="text"
                value={form.razorpayKeyId}
                onChange={(e) =>
                  setForm({ ...form, razorpayKeyId: e.target.value })
                }
                className="w-full px-3.5 py-2 text-sm border border-slate-200 rounded-xl font-mono-tabular"
              />
            </div>
          </div>
          <button
            type="submit"
            className="w-full py-2.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl cursor-pointer"
          >
            Save Bank &amp; Gateway Details
          </button>
        </form>

        {/* Student Payment & Bank Settlement Ledger */}
        <div className="lg:col-span-7 bg-white border border-slate-200 rounded-2xl p-6 space-y-4">
          <h2 className="text-base font-bold text-slate-900">
            Student Payment &amp; Bank Settlement Ledger ({receipts.length})
          </h2>
          {receipts.length === 0 ? (
            <p className="text-xs text-slate-500 py-6 text-center">
              No student payments received yet.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-500">
                    <th className="py-2 pr-3 font-semibold">Student / Txn</th>
                    <th className="py-2 px-3 font-semibold">Course</th>
                    <th className="py-2 px-3 font-semibold">Gateway</th>
                    <th className="py-2 pl-3 font-semibold text-right">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {receipts.map((r) => (
                    <tr key={r.id}>
                      <td className="py-2.5 pr-3">
                        <p className="font-bold text-slate-900">
                          {r.studentName || 'Student'}
                        </p>
                        <p className="text-[11px] font-mono-tabular text-slate-500">
                          {r.transactionId} • {r.date}
                        </p>
                      </td>
                      <td className="py-2.5 px-3 text-slate-800 max-w-[180px] truncate">
                        {r.courseTitle}
                      </td>
                      <td className="py-2.5 px-3">
                        <span className="px-2 py-0.5 bg-slate-100 text-slate-800 rounded font-medium">
                          {r.paymentMethod}
                        </span>
                      </td>
                      <td className="py-2.5 pl-3 text-right font-mono-tabular font-bold text-emerald-700">
                        +₹{r.amountPaidInr}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

interface OnlineTestsAdminPanelProps {
  onlineTests: OnlineTest[];
  testSubmissions: OnlineTestSubmission[];
  onSaveOnlineTest: (test: OnlineTest) => Promise<void>;
  onDeleteOnlineTest: (testId: string) => Promise<void>;
  onToast: (msg: string) => void;
}

const OnlineTestsAdminPanel: React.FC<OnlineTestsAdminPanelProps> = ({
  onlineTests,
  testSubmissions,
  onSaveOnlineTest,
  onDeleteOnlineTest,
  onToast,
}) => {
  const [titleEn, setTitleEn] = useState('');
  const [titleHi, setTitleHi] = useState('');
  const [category, setCategory] = useState('UPSC / SSC / Banking');
  const [durationMins, setDurationMins] = useState(15);
  const [marksPerQ, setMarksPerQ] = useState(2);
  const [negMarks, setNegMarks] = useState(0.5);

  const [selectedTestId, setSelectedTestId] = useState<string>(
    onlineTests[0]?.id || ''
  );
  const activeTest =
    onlineTests.find((t) => t.id === selectedTestId) || onlineTests[0];

  const [qEn, setQEn] = useState('');
  const [qHi, setQHi] = useState('');
  const [optA, setOptA] = useState('');
  const [optB, setOptB] = useState('');
  const [optC, setOptC] = useState('');
  const [optD, setOptD] = useState('');
  const [correctIdx, setCorrectIdx] = useState(0);
  const [expText, setExpText] = useState('');

  const handleCreateTest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!titleEn.trim()) return;
    const newTest: OnlineTest = {
      id: `test-${Date.now()}`,
      titleEn: titleEn.trim(),
      titleHi: titleHi.trim() || titleEn.trim(),
      category,
      durationMins: Number(durationMins) || 10,
      marksPerQuestion: Number(marksPerQ) || 1,
      negativeMarking: Number(negMarks) || 0,
      isPublished: true,
      createdAt: new Date().toISOString().slice(0, 10),
      questions: [],
    };
    await onSaveOnlineTest(newTest);
    setSelectedTestId(newTest.id);
    setTitleEn('');
    setTitleHi('');
    onToast('New Online Test Created! Now add questions below.');
  };

  const handleAddQuestion = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeTest || !qEn.trim() || !optA.trim() || !optB.trim()) return;
    const opts = [
      optA.trim(),
      optB.trim(),
      optC.trim() || 'None of the above',
      optD.trim() || 'All of the above',
    ];
    const newQ: OnlineTestQuestion = {
      id: `otq-${Date.now()}`,
      questionEn: qEn.trim(),
      questionHi: qHi.trim() || qEn.trim(),
      optionsEn: opts,
      optionsHi: opts,
      correctIndex: correctIdx,
      explanationEn: expText.trim(),
      explanationHi: expText.trim(),
    };
    await onSaveOnlineTest({
      ...activeTest,
      questions: [...activeTest.questions, newQ],
    });
    setQEn('');
    setQHi('');
    setOptA('');
    setOptB('');
    setOptC('');
    setOptD('');
    setExpText('');
    onToast(`Question added to "${activeTest.titleEn}"!`);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Create New Online Test */}
        <form
          onSubmit={handleCreateTest}
          className="lg:col-span-5 bg-white border border-slate-200 rounded-2xl p-6 space-y-4 h-fit"
        >
          <h2 className="text-base font-bold text-slate-900">
            Create New Online Test
          </h2>
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Test Title (English)
            </label>
            <input
              type="text"
              required
              value={titleEn}
              onChange={(e) => setTitleEn(e.target.value)}
              placeholder="e.g. SSC CGL Tier-1 Full Mock Test"
              className="w-full px-3.5 py-2 text-sm border border-slate-200 rounded-xl"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Test Title (Hindi / Hinglish)
            </label>
            <input
              type="text"
              value={titleHi}
              onChange={(e) => setTitleHi(e.target.value)}
              placeholder="e.g. SSC CGL Tier-1 Online Mock Test"
              className="w-full px-3.5 py-2 text-sm border border-slate-200 rounded-xl"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-2 text-xs font-semibold border border-slate-200 rounded-xl bg-white"
              >
                <option value="UPSC / SSC / Banking">UPSC / SSC / Banking</option>
                <option value="Class 9–12">Class 9–12</option>
                <option value="AI & Python Skills">AI &amp; Python Skills</option>
                <option value="Future Kids">Future Kids</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Duration (Minutes)
              </label>
              <input
                type="number"
                min={1}
                value={durationMins}
                onChange={(e) => setDurationMins(Number(e.target.value))}
                className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl font-mono-tabular"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Marks / Question
              </label>
              <input
                type="number"
                step="0.5"
                value={marksPerQ}
                onChange={(e) => setMarksPerQ(Number(e.target.value))}
                className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl font-mono-tabular"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Negative Marking
              </label>
              <input
                type="number"
                step="0.25"
                min={0}
                value={negMarks}
                onChange={(e) => setNegMarks(Number(e.target.value))}
                className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl font-mono-tabular"
              />
            </div>
          </div>
          <button
            type="submit"
            className="w-full py-2.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl inline-flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Create Online Test</span>
          </button>
        </form>

        {/* Add Questions & Manage Existing Tests */}
        <div className="lg:col-span-7 bg-white border border-slate-200 rounded-2xl p-6 space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h2 className="text-base font-bold text-slate-900">
              Manage Tests &amp; Add Questions
            </h2>
            {onlineTests.length > 0 && (
              <select
                value={activeTest?.id || ''}
                onChange={(e) => setSelectedTestId(e.target.value)}
                className="px-3 py-1.5 text-xs font-bold border border-slate-200 rounded-xl bg-slate-50"
              >
                {onlineTests.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.titleEn} ({t.questions.length} Qs)
                  </option>
                ))}
              </select>
            )}
          </div>

          {activeTest && (
            <>
              <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl flex flex-wrap items-center justify-between gap-2">
                <div>
                  <p className="text-xs font-bold text-slate-900">
                    {activeTest.titleEn}
                  </p>
                  <p className="text-[11px] text-slate-500">
                    {activeTest.questions.length} Questions • {activeTest.durationMins}{' '}
                    Mins • {activeTest.isPublished ? 'Published (Live)' : 'Hidden'}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={async () => {
                      await onSaveOnlineTest({
                        ...activeTest,
                        isPublished: !activeTest.isPublished,
                      });
                      onToast(
                        activeTest.isPublished ? 'Test Unpublished' : 'Test Published Live!'
                      );
                    }}
                    className="px-3 py-1.5 text-xs font-semibold bg-white border border-slate-200 hover:bg-slate-100 rounded-lg inline-flex items-center gap-1 cursor-pointer"
                  >
                    {activeTest.isPublished ? (
                      <>
                        <EyeOff className="w-3.5 h-3.5" /> Hide
                      </>
                    ) : (
                      <>
                        <Eye className="w-3.5 h-3.5" /> Publish
                      </>
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={async () => {
                      await onDeleteOnlineTest(activeTest.id);
                      onToast('Online Test Deleted');
                    }}
                    className="px-2.5 py-1.5 text-xs font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 rounded-lg inline-flex items-center gap-1 cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" /> Delete
                  </button>
                </div>
              </div>

              <form onSubmit={handleAddQuestion} className="space-y-3">
                <p className="text-xs font-bold text-slate-800">
                  Add Question to &ldquo;{activeTest.titleEn}&rdquo;
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <input
                    type="text"
                    required
                    value={qEn}
                    onChange={(e) => setQEn(e.target.value)}
                    placeholder="Question in English *"
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl"
                  />
                  <input
                    type="text"
                    value={qHi}
                    onChange={(e) => setQHi(e.target.value)}
                    placeholder="Question in Hindi / Hinglish (Optional)"
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2.5">
                  <input
                    type="text"
                    required
                    value={optA}
                    onChange={(e) => setOptA(e.target.value)}
                    placeholder="Option A *"
                    className="px-3 py-2 text-xs border border-slate-200 rounded-xl"
                  />
                  <input
                    type="text"
                    required
                    value={optB}
                    onChange={(e) => setOptB(e.target.value)}
                    placeholder="Option B *"
                    className="px-3 py-2 text-xs border border-slate-200 rounded-xl"
                  />
                  <input
                    type="text"
                    value={optC}
                    onChange={(e) => setOptC(e.target.value)}
                    placeholder="Option C"
                    className="px-3 py-2 text-xs border border-slate-200 rounded-xl"
                  />
                  <input
                    type="text"
                    value={optD}
                    onChange={(e) => setOptD(e.target.value)}
                    placeholder="Option D"
                    className="px-3 py-2 text-xs border border-slate-200 rounded-xl"
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <select
                    value={correctIdx}
                    onChange={(e) => setCorrectIdx(Number(e.target.value))}
                    className="px-3 py-2 text-xs font-bold border border-slate-200 rounded-xl bg-white"
                  >
                    <option value={0}>Correct Answer: Option A</option>
                    <option value={1}>Correct Answer: Option B</option>
                    <option value={2}>Correct Answer: Option C</option>
                    <option value={3}>Correct Answer: Option D</option>
                  </select>
                  <input
                    type="text"
                    value={expText}
                    onChange={(e) => setExpText(e.target.value)}
                    placeholder="Solution / Explanation (Optional)"
                    className="px-3 py-2 text-xs border border-slate-200 rounded-xl"
                  />
                </div>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-xl cursor-pointer"
                >
                  + Add Question to Test
                </button>
              </form>
            </>
          )}
        </div>
      </div>

      {/* Student Test Submissions Table */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4">
        <h2 className="text-base font-bold text-slate-900">
          Student Online Test Submissions ({testSubmissions.length})
        </h2>
        {testSubmissions.length === 0 ? (
          <p className="text-xs text-slate-500 py-4">
            No student test submissions yet.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 text-slate-500">
                  <th className="py-2 pr-3 font-semibold">Student</th>
                  <th className="py-2 px-3 font-semibold">Test</th>
                  <th className="py-2 px-3 font-semibold">Score</th>
                  <th className="py-2 px-3 font-semibold">Accuracy</th>
                  <th className="py-2 pl-3 font-semibold">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {testSubmissions.map((s) => (
                  <tr key={s.id}>
                    <td className="py-2.5 pr-3 font-bold text-slate-900">
                      {s.studentName}{' '}
                      <span className="font-normal text-slate-500">
                        ({s.studentIdentifier})
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-slate-800">{s.testTitle}</td>
                    <td className="py-2.5 px-3 font-mono-tabular font-bold text-emerald-700">
                      {s.score} / {s.maxScore}
                    </td>
                    <td className="py-2.5 px-3 font-mono-tabular">{s.accuracyPct}%</td>
                    <td className="py-2.5 pl-3 text-slate-500">{s.submittedAt}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
