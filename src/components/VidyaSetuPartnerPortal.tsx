import React, { useState } from 'react';
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
  Trash2,
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  UserCheck,
  Sparkles,
  Layers,
  ArrowLeft,
  XCircle,
  Eye,
} from 'lucide-react';
import {
  Course,
  CourseCategory,
  CourseModule,
  LearnerState,
  TeacherPartnerCourse,
  TeacherPartnerProfile,
} from '../types/education';

interface VidyaSetuPartnerPortalProps {
  learnerState: LearnerState;
  isOpen?: boolean;
  onClose?: () => void;
  onBackToStudentApp?: () => void;
  onCourseApprovedLocally?: (course: Course) => void;
  onCourseSubmitted?: () => void;
}

export const VidyaSetuPartnerPortal: React.FC<VidyaSetuPartnerPortalProps> = ({
  learnerState,
  isOpen = true,
  onClose,
  onBackToStudentApp,
  onCourseApprovedLocally,
  onCourseSubmitted,
}) => {
  const handleExit = () => {
    if (onClose) onClose();
    else if (onBackToStudentApp) onBackToStudentApp();
  };
  const [activeTab, setActiveTab] = useState<'profile' | 'create_course' | 'status' | 'earnings'>('create_course');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // 1. Teacher Profile State
  const defaultTeacher = learnerState.teacherPartners?.[0] || {
    id: 'teacher-current',
    name: 'Prof. Arvind Mehta',
    email: 'arvind.mehta@vidyasetu.in',
    phone: '+91 98112 34567',
    avatarUrl: '/src/assets/images/hero_learning_studio_1793856674745.jpg',
    qualification: 'Ph.D. in Political Science, Ex-Civil Services Faculty',
    subjectExpertise: 'UPSC Indian Polity & Constitution',
    experienceYears: 14,
    bio: 'Dedicated educator mentoring students with high-yield concepts, 30-chapter symmetry, and bilingual notes.',
    upiId: 'arvindmehta@sbi',
    isApproved: true,
    registeredAt: '2026-10-15',
    coursesCount: 3,
    totalStudents: 480,
    totalEarningsInr: 96400,
  };

  const [teacherProfile, setTeacherProfile] = useState<TeacherPartnerProfile>(defaultTeacher);

  // 2. Course Creation Studio State
  const [courseTitle, setCourseTitle] = useState('Class 9 Mathematics: 30-Chapter Complete Foundation');
  const [courseHindiTitle, setCourseHindiTitle] = useState('कक्षा 9 गणित: 30 अध्याय सम्पूर्ण फाउंडेशन');
  const [courseSubtitle, setCourseSubtitle] = useState('Complete NCERT & State Board Mathematics with video solutions, formula sheets, and chapter-wise tests.');
  const [courseCategory, setCourseCategory] = useState<CourseCategory>('k12');
  const [courseCategoryLabel, setCourseCategoryLabel] = useState('Class 9 • School & Boards');
  const [k12Class, setK12Class] = useState('9');
  const [k12Stream, setK12Stream] = useState('general');
  const [fullPriceInr, setFullPriceInr] = useState(499);
  const [originalPriceInr, setOriginalPriceInr] = useState(1499);
  const [courseImage, setCourseImage] = useState<string>('/src/assets/images/hero_learning_studio_1793856674745.jpg');

  // Initial Symmetrical Chapters
  const [modules, setModules] = useState<CourseModule[]>([
    {
      id: `tmod-${Date.now()}-1`,
      chapterNumber: 1,
      title: '01. Chapter 1: Number Systems & Real Numbers',
      durationMins: 45,
      mcqCount: 20,
      priceInr: 49,
      isFreePreview: true,
      keyTopics: ['Rational & Irrational Numbers', 'Real Numbers on Number Line', 'Laws of Exponents'],
      pdfFileName: 'Class9_Maths_Ch1_RealNumbers.pdf',
      pdfPolicy: 'downloadable',
    },
    {
      id: `tmod-${Date.now()}-2`,
      chapterNumber: 2,
      title: '02. Chapter 2: Polynomials & Factor Theorem',
      durationMins: 50,
      mcqCount: 25,
      priceInr: 49,
      isFreePreview: false,
      keyTopics: ['Zeros of a Polynomial', 'Remainder Theorem', 'Algebraic Identities'],
      pdfFileName: 'Class9_Maths_Ch2_Polynomials.pdf',
      pdfPolicy: 'downloadable',
    },
    {
      id: `tmod-${Date.now()}-3`,
      chapterNumber: 3,
      title: '03. Chapter 3: Coordinate Geometry & Cartesian Plane',
      durationMins: 40,
      mcqCount: 15,
      priceInr: 49,
      isFreePreview: false,
      keyTopics: ['Cartesian System', 'Plotting Points', 'Quadrants & Coordinates'],
      pdfFileName: 'Class9_Maths_Ch3_Coordinates.pdf',
      pdfPolicy: 'downloadable',
    },
  ]);

  const [selectedModIdx, setSelectedModIdx] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Submissions List
  const [partnerSubmissions, setPartnerSubmissions] = useState<TeacherPartnerCourse[]>(
    learnerState.teacherPendingCourses || []
  );

  // Handle Thumbnail File Upload
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setCourseImage(reader.result);
        showToast('Thumbnail image loaded successfully!');
      }
    };
    reader.readAsDataURL(file);
  };

  // Handle Video File Upload for current Chapter
  const handleVideoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const objectUrl = URL.createObjectURL(file);
    setModules((prev) =>
      prev.map((m, idx) =>
        idx === selectedModIdx
          ? {
              ...m,
              videoUrl: objectUrl,
              notesText: `Video Attached: ${file.name} (${(file.size / (1024 * 1024)).toFixed(1)} MB)`,
            }
          : m
      )
    );
    showToast(`Video lesson attached to Chapter ${selectedModIdx + 1}!`);
  };

  // Handle PDF Notes File Upload for current Chapter
  const handlePdfUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const objectUrl = URL.createObjectURL(file);
    setModules((prev) =>
      prev.map((m, idx) =>
        idx === selectedModIdx
          ? {
              ...m,
              pdfUrl: objectUrl,
              pdfFileName: file.name,
              pdfPolicy: m.pdfPolicy || 'downloadable',
            }
          : m
      )
    );
    showToast(`PDF Notes "${file.name}" attached to Chapter ${selectedModIdx + 1}!`);
  };

  // Add Next Chapter
  const handleAddChapter = () => {
    const nextNum = modules.length + 1;
    const newMod: CourseModule = {
      id: `tmod-${Date.now()}-${nextNum}`,
      chapterNumber: nextNum,
      title: `${String(nextNum).padStart(2, '0')}. Chapter ${nextNum}: New Syllabus Topic`,
      durationMins: 45,
      mcqCount: 20,
      priceInr: 49,
      isFreePreview: false,
      keyTopics: ['Core Concepts', 'Formula Derivations', 'Exercise Problems'],
      pdfPolicy: 'downloadable',
    };
    setModules([...modules, newMod]);
    setSelectedModIdx(modules.length);
    showToast(`Chapter ${nextNum} added to curriculum!`);
  };

  // Auto-generate 30 chapters symmetry
  const handleGenerate30Chapters = () => {
    const chapters30: CourseModule[] = [];
    const sampleTopics = [
      'Number Systems', 'Polynomials', 'Coordinate Geometry', 'Linear Equations', 'Euclid Geometry',
      'Lines and Angles', 'Triangles', 'Quadrilaterals', 'Circles', 'Heron Formula',
      'Surface Areas and Volumes', 'Statistics & Frequency', 'Probability', 'Arithmetic Progressions', 'Real Numbers',
      'Trigonometric Ratios', 'Trigonometric Identities', 'Heights and Distances', 'Areas Related to Circles', 'Quadratic Equations',
      'Similar Triangles', 'Tangent to a Circle', 'Constructions', 'Cumulative Frequency Graphs', 'Vectors & 3D Intro',
      'Matrices & Determinants', 'Limits & Derivatives', 'Mathematical Reasoning', 'Sets and Relations', 'Comprehensive Board Revision'
    ];
    for (let i = 1; i <= 30; i++) {
      const topic = sampleTopics[i - 1] || `Curriculum Unit ${i}`;
      chapters30.push({
        id: `tmod-sym-${Date.now()}-${i}`,
        chapterNumber: i,
        title: `${String(i).padStart(2, '0')}. Chapter ${i}: ${topic}`,
        durationMins: 45,
        mcqCount: 20,
        priceInr: 49,
        isFreePreview: i === 1,
        keyTopics: [`${topic} Core Theory`, 'Important Formulas', 'Board Exam Questions'],
        pdfFileName: `Class9_Maths_Ch${i}_${topic.replace(/\s+/g, '_')}.pdf`,
        pdfPolicy: 'downloadable',
      });
    }
    setModules(chapters30);
    setSelectedModIdx(0);
    showToast('Generated 30 symmetrical chapters ready for video & PDF uploads!');
  };

  // Submit Course for Admin Approval
  const handleSubmitCourseForApproval = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    const submissionId = `tpc-${Date.now()}`;
    const newSubmission: TeacherPartnerCourse = {
      id: submissionId,
      teacherId: teacherProfile.id,
      teacherName: teacherProfile.name,
      teacherAvatar: teacherProfile.avatarUrl,
      title: courseTitle,
      hindiTitle: courseHindiTitle,
      subtitle: courseSubtitle,
      category: courseCategory,
      categoryLabel: courseCategoryLabel,
      k12Class: courseCategory === 'k12' ? k12Class : undefined,
      k12Stream: courseCategory === 'k12' ? k12Stream : undefined,
      fullPriceInr,
      originalPriceInr,
      imageUrl: courseImage,
      modules,
      status: 'pending_approval',
      submittedAt: 'Just now',
    };

    try {
      await fetch('/api/partner/courses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newSubmission),
      });
    } catch {}

    setPartnerSubmissions([newSubmission, ...partnerSubmissions]);
    setIsSubmitting(false);
    setActiveTab('status');
    if (onCourseSubmitted) onCourseSubmitted();
    showToast('Course successfully submitted! Admin will review and approve it for the Student App.');
  };

  const activeModule = modules[selectedModIdx] || modules[0];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* Top Header */}
      <header className="sticky top-0 z-30 bg-slate-900/95 backdrop-blur-md border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleExit}
              className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-colors cursor-pointer"
              title="Return to Student App"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white font-bold flex items-center justify-center text-xs">
              VP
            </div>
            <div>
              <span className="text-sm sm:text-base font-bold text-white block leading-tight">
                Vidya Setu Partner (शिक्षक साथी पोर्टल)
              </span>
              <span className="text-[10px] text-emerald-400 font-semibold block">
                Educator Course Upload &amp; Faculty Studio
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            {toastMessage && (
              <span className="hidden sm:inline-block px-3 py-1 bg-emerald-600 text-white text-xs font-bold rounded-lg animate-pulse">
                {toastMessage}
              </span>
            )}
            <button
              type="button"
              onClick={handleExit}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl transition-colors cursor-pointer shadow-sm"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Student App</span>
              <span className="sm:hidden">App</span>
            </button>
          </div>
        </div>
      </header>

      {/* Navigation Sub-Header */}
      <div className="bg-slate-900 border-b border-slate-800 sticky top-16 z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2.5 flex items-center gap-2 overflow-x-auto">
          {[
            { id: 'create_course', label: '🎬 Upload Course & Videos', icon: Upload },
            { id: 'status', label: `📋 Submissions & Approvals (${partnerSubmissions.length})`, icon: Clock },
            { id: 'profile', label: '👨‍🏫 Teacher Profile & UPI', icon: GraduationCap },
            { id: 'earnings', label: '💰 Earnings & Revenue Share', icon: IndianRupee },
          ].map((tab) => {
            const Icon = tab.icon;
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id as any)}
                className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap shrink-0 transition-colors cursor-pointer ${
                  active
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Studio Body */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6">
        {/* 1. COURSE CREATION STUDIO */}
        {activeTab === 'create_course' && (
          <form onSubmit={handleSubmitCourseForApproval} className="space-y-6">
            {/* Top Overview Banner */}
            <div className="bg-gradient-to-r from-slate-900 via-slate-850 to-emerald-950 border border-emerald-900/50 rounded-2xl p-5 sm:p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  YouTube Studio Style Creator Flow
                </span>
                <h1 className="text-lg sm:text-xl font-bold text-white mt-1.5">
                  Create &amp; Upload New Course for Students
                </h1>
                <p className="text-xs text-slate-400 mt-1 max-w-2xl">
                  Upload your video lessons, attach PDF notes, configure 30-chapter symmetry, and submit for 1-click Admin approval to publish directly on the Vidya Setu Student App.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={handleGenerate30Chapters}
                  className="px-3.5 py-2 text-xs font-bold text-emerald-300 bg-emerald-950/80 hover:bg-emerald-900/80 border border-emerald-600/50 rounded-xl transition-colors cursor-pointer"
                  title="Generate 30 Symmetrical Chapters"
                >
                  ⚡ Auto 30-Chapter Symmetry
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 rounded-xl transition-colors cursor-pointer shadow-md"
                >
                  {isSubmitting ? 'Submitting...' : 'Submit Course for Approval'}
                </button>
              </div>
            </div>

            {/* Grid: Course Info (Left) + Chapter Studio (Right) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* Left 5 Cols: Course Basics & Thumbnail */}
              <div className="lg:col-span-5 space-y-6">
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
                  <h3 className="text-sm font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-3">
                    <BookOpen className="w-4 h-4 text-emerald-400" />
                    <span>1. Course Details &amp; Category</span>
                  </h3>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Course Title (English)
                    </label>
                    <input
                      type="text"
                      required
                      value={courseTitle}
                      onChange={(e) => setCourseTitle(e.target.value)}
                      placeholder="e.g. Class 9 Mathematics: 30-Chapter Mastery"
                      className="w-full px-3.5 py-2 text-xs bg-slate-950 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Course Title (Hindi)
                    </label>
                    <input
                      type="text"
                      value={courseHindiTitle}
                      onChange={(e) => setCourseHindiTitle(e.target.value)}
                      placeholder="e.g. कक्षा 9 गणित: सम्पूर्ण 30 अध्याय"
                      className="w-full px-3.5 py-2 text-xs bg-slate-950 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Short Description / Syllabus Overview
                    </label>
                    <textarea
                      rows={2}
                      value={courseSubtitle}
                      onChange={(e) => setCourseSubtitle(e.target.value)}
                      placeholder="What will students learn from this course?"
                      className="w-full px-3.5 py-2 text-xs bg-slate-950 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">
                        Track / Category
                      </label>
                      <select
                        value={courseCategory}
                        onChange={(e) => {
                          const cat = e.target.value as CourseCategory;
                          setCourseCategory(cat);
                          if (cat === 'k12') setCourseCategoryLabel(`Class ${k12Class} • School & Boards`);
                          else if (cat === 'competitive') setCourseCategoryLabel('UPSC, SSC & Govt Exams');
                          else if (cat === 'skills') setCourseCategoryLabel('High-Salary Tech Skills');
                          else if (cat === 'kids') setCourseCategoryLabel('Future Kids');
                        }}
                        className="w-full px-3 py-2 text-xs bg-slate-950 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-emerald-500"
                      >
                        <option value="k12">Class 9–12 School (K-12)</option>
                        <option value="competitive">Competitive Exams (UPSC/SSC)</option>
                        <option value="skills">High-Salary Skills (AI/Coding)</option>
                        <option value="kids">Future Kids Arena</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">
                        Category Tag / Badge
                      </label>
                      <input
                        type="text"
                        value={courseCategoryLabel}
                        onChange={(e) => setCourseCategoryLabel(e.target.value)}
                        className="w-full px-3 py-2 text-xs bg-slate-950 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-emerald-500"
                      />
                    </div>
                  </div>

                  {courseCategory === 'k12' && (
                    <div className="grid grid-cols-2 gap-3 p-3 bg-slate-950 border border-emerald-900/40 rounded-xl">
                      <div>
                        <label className="block text-[11px] font-bold text-emerald-400 mb-1">
                          Class Level
                        </label>
                        <select
                          value={k12Class}
                          onChange={(e) => {
                            setK12Class(e.target.value);
                            setCourseCategoryLabel(`Class ${e.target.value} • School & Boards`);
                          }}
                          className="w-full px-2.5 py-1.5 text-xs bg-slate-900 border border-slate-700 rounded-lg text-white font-bold"
                        >
                          <option value="9">Class 9 (Navi)</option>
                          <option value="10">Class 10 (Board)</option>
                          <option value="11">Class 11 (Intermediate)</option>
                          <option value="12">Class 12 (Board)</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-emerald-400 mb-1">
                          Stream
                        </label>
                        <select
                          value={k12Stream}
                          onChange={(e) => setK12Stream(e.target.value)}
                          className="w-full px-2.5 py-1.5 text-xs bg-slate-900 border border-slate-700 rounded-lg text-white font-bold"
                        >
                          <option value="general">General (Class 9 &amp; 10)</option>
                          <option value="pcm">PCM (Physics, Chem, Math)</option>
                          <option value="pcb">PCB (Physics, Chem, Bio)</option>
                          <option value="commerce">Commerce</option>
                          <option value="arts">Arts / Humanities</option>
                        </select>
                      </div>
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">
                        Full Course Price (₹)
                      </label>
                      <input
                        type="number"
                        min={0}
                        required
                        value={fullPriceInr}
                        onChange={(e) => setFullPriceInr(Number(e.target.value))}
                        className="w-full px-3 py-2 text-xs bg-slate-950 border border-slate-700 rounded-xl text-emerald-400 font-mono font-bold"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">
                        Original MRP Price (₹)
                      </label>
                      <input
                        type="number"
                        min={0}
                        value={originalPriceInr}
                        onChange={(e) => setOriginalPriceInr(Number(e.target.value))}
                        className="w-full px-3 py-2 text-xs bg-slate-950 border border-slate-700 rounded-xl text-slate-400 font-mono"
                      />
                    </div>
                  </div>
                </div>

                {/* Thumbnail Upload Card */}
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3">
                  <h3 className="text-sm font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-3">
                    <ImageIcon className="w-4 h-4 text-emerald-400" />
                    <span>2. Course Poster / Thumbnail (16:9)</span>
                  </h3>

                  <div className="relative aspect-video w-full rounded-xl overflow-hidden bg-slate-950 border border-slate-800 flex items-center justify-center">
                    {courseImage ? (
                      <img src={courseImage} alt="Thumbnail preview" className="w-full h-full object-cover" />
                    ) : (
                      <div className="text-center p-4">
                        <ImageIcon className="w-8 h-8 text-slate-600 mx-auto mb-1" />
                        <span className="text-xs text-slate-400">No thumbnail selected</span>
                      </div>
                    )}
                  </div>

                  <label className="flex items-center justify-center gap-2 p-3 bg-slate-800 hover:bg-slate-750 border border-slate-700 rounded-xl text-xs font-bold text-slate-200 cursor-pointer transition-colors">
                    <Upload className="w-4 h-4 text-emerald-400" />
                    <span>Choose Image File (.jpg, .png, .webp)</span>
                    <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                  </label>
                </div>
              </div>

              {/* Right 7 Cols: Chapters / Video & PDF Curriculum Builder */}
              <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-2xl p-5 sm:p-6 space-y-5">
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-4">
                  <div>
                    <h3 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
                      <Layers className="w-4 h-4 text-emerald-400" />
                      <span>3. Curriculum &amp; Symmetrical Chapters ({modules.length})</span>
                    </h3>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      Upload video lessons and PDF notes for each chapter sequentially.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={handleAddChapter}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-emerald-300 bg-emerald-950 hover:bg-emerald-900 border border-emerald-600/40 rounded-xl transition-colors cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>+ Add Chapter</span>
                  </button>
                </div>

                {/* Chapter Selector Strip */}
                <div className="flex items-center gap-2 overflow-x-auto pb-2">
                  {modules.map((m, idx) => {
                    const active = idx === selectedModIdx;
                    return (
                      <button
                        key={m.id}
                        type="button"
                        onClick={() => setSelectedModIdx(idx)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap shrink-0 transition-colors cursor-pointer flex items-center gap-1.5 ${
                          active
                            ? 'bg-emerald-600 text-white'
                            : 'bg-slate-950 text-slate-400 hover:bg-slate-800 hover:text-slate-200 border border-slate-800'
                        }`}
                      >
                        <span>Ch {idx + 1}</span>
                        {m.videoUrl && <span className="w-1.5 h-1.5 rounded-full bg-emerald-300"></span>}
                        {m.pdfUrl && <span className="w-1.5 h-1.5 rounded-full bg-blue-300"></span>}
                      </button>
                    );
                  })}
                </div>

                {/* Active Chapter Details */}
                {activeModule && (
                  <div className="p-4 sm:p-5 bg-slate-950 border border-slate-800 rounded-xl space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
                        Editing Chapter #{selectedModIdx + 1} of {modules.length}
                      </span>
                      {modules.length > 1 && (
                        <button
                          type="button"
                          onClick={() => {
                            if (window.confirm(`Delete Chapter ${selectedModIdx + 1}?`)) {
                              const remaining = modules.filter((_, i) => i !== selectedModIdx);
                              setModules(remaining);
                              setSelectedModIdx(Math.max(0, selectedModIdx - 1));
                              showToast('Chapter removed');
                            }
                          }}
                          className="p-1 text-slate-500 hover:text-rose-400 transition-colors"
                          title="Delete Chapter"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">
                        Chapter Title (अध्याय का नाम)
                      </label>
                      <input
                        type="text"
                        value={activeModule.title}
                        onChange={(e) =>
                          setModules((prev) =>
                            prev.map((m, i) => (i === selectedModIdx ? { ...m, title: e.target.value } : m))
                          )
                        }
                        className="w-full px-3.5 py-2 text-xs bg-slate-900 border border-slate-700 rounded-xl text-white font-medium focus:outline-none focus:border-emerald-500"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-semibold text-slate-300 mb-1">
                          Duration (Minutes)
                        </label>
                        <input
                          type="number"
                          min={5}
                          max={300}
                          value={activeModule.durationMins || 45}
                          onChange={(e) =>
                            setModules((prev) =>
                              prev.map((m, i) =>
                                i === selectedModIdx ? { ...m, durationMins: Number(e.target.value) } : m
                              )
                            )
                          }
                          className="w-full px-3 py-2 text-xs bg-slate-900 border border-slate-700 rounded-xl text-white font-mono"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-300 mb-1">
                          Single Chapter Price (₹)
                        </label>
                        <input
                          type="number"
                          min={0}
                          value={activeModule.priceInr || 49}
                          onChange={(e) =>
                            setModules((prev) =>
                              prev.map((m, i) =>
                                i === selectedModIdx ? { ...m, priceInr: Number(e.target.value) } : m
                              )
                            )
                          }
                          className="w-full px-3 py-2 text-xs bg-slate-900 border border-slate-700 rounded-xl text-white font-mono"
                        />
                      </div>
                    </div>

                    {/* Video Upload Section */}
                    <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl space-y-2.5">
                      <div className="flex items-center justify-between">
                        <label className="text-xs font-bold text-slate-200 flex items-center gap-2">
                          <Video className="w-4 h-4 text-emerald-400" />
                          <span>Video Lesson (.mp4 / video file)</span>
                        </label>
                        {activeModule.videoUrl ? (
                          <span className="text-[10px] font-bold px-2 py-0.5 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded-full">
                            ✓ Video Attached
                          </span>
                        ) : (
                          <span className="text-[10px] text-slate-400">Ready to upload</span>
                        )}
                      </div>

                      {activeModule.videoUrl && (
                        <div className="rounded-lg overflow-hidden border border-slate-800 bg-black aspect-video max-h-40">
                          <video src={activeModule.videoUrl} controls className="w-full h-full object-contain" />
                        </div>
                      )}

                      <label className="flex items-center justify-center gap-2 p-2.5 bg-slate-800 hover:bg-slate-750 border border-slate-700 rounded-xl text-xs font-bold text-slate-200 cursor-pointer transition-colors">
                        <Upload className="w-3.5 h-3.5 text-emerald-400" />
                        <span>
                          {activeModule.videoUrl ? 'Replace Video File (.mp4)' : 'Choose Video File (.mp4 / video)'}
                        </span>
                        <input type="file" accept="video/*" onChange={handleVideoUpload} className="hidden" />
                      </label>
                    </div>

                    {/* PDF Notes Upload Section */}
                    <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl space-y-2.5">
                      <div className="flex items-center justify-between">
                        <label className="text-xs font-bold text-slate-200 flex items-center gap-2">
                          <FileText className="w-4 h-4 text-rose-400" />
                          <span>Chapter PDF Notes &amp; Formula Sheet</span>
                        </label>
                        {activeModule.pdfUrl ? (
                          <span className="text-[10px] font-bold px-2 py-0.5 bg-rose-500/20 text-rose-300 border border-rose-500/30 rounded-full truncate max-w-[150px]">
                            ✓ {activeModule.pdfFileName || 'PDF Attached'}
                          </span>
                        ) : (
                          <span className="text-[10px] text-slate-400">Optional</span>
                        )}
                      </div>

                      <div className="flex items-center gap-2">
                        <label className="flex-1 flex items-center justify-center gap-2 p-2.5 bg-slate-800 hover:bg-slate-750 border border-slate-700 rounded-xl text-xs font-bold text-slate-200 cursor-pointer transition-colors">
                          <Upload className="w-3.5 h-3.5 text-rose-400" />
                          <span>
                            {activeModule.pdfUrl ? 'Replace PDF File (.pdf)' : 'Choose PDF File (.pdf)'}
                          </span>
                          <input type="file" accept="application/pdf" onChange={handlePdfUpload} className="hidden" />
                        </label>

                        {activeModule.pdfUrl && (
                          <a
                            href={activeModule.pdfUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-3 py-2.5 bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-200 rounded-xl flex items-center gap-1"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            <span>Preview</span>
                          </a>
                        )}
                      </div>

                      <div className="flex items-center justify-between pt-1 text-[11px] text-slate-400">
                        <span>Permission:</span>
                        <button
                          type="button"
                          onClick={() =>
                            setModules((prev) =>
                              prev.map((m, i) =>
                                i === selectedModIdx
                                  ? {
                                      ...m,
                                      pdfPolicy: m.pdfPolicy === 'downloadable' ? 'view_only' : 'downloadable',
                                    }
                                  : m
                              )
                            )
                          }
                          className="text-emerald-400 underline font-semibold cursor-pointer"
                        >
                          {activeModule.pdfPolicy === 'downloadable'
                            ? '✓ Downloadable (Students can save)'
                            : '🛡️ View-Only (Protected)'}
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </form>
        )}

        {/* 2. SUBMISSIONS & APPROVAL STATUS */}
        {activeTab === 'status' && (
          <div className="space-y-6">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 sm:p-6 flex items-center justify-between">
              <div>
                <h2 className="text-base sm:text-lg font-bold text-white">
                  Teacher Course Submissions &amp; Live Status
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Track course approval progress. Once approved by the Admin, courses go live instantly on the Student App.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setActiveTab('create_course')}
                className="px-3.5 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 rounded-xl transition-colors cursor-pointer"
              >
                + Create New Course
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {partnerSubmissions.map((sub) => {
                const isPending = sub.status === 'pending_approval';
                const isApproved = sub.status === 'approved';
                return (
                  <div key={sub.id} className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden flex flex-col">
                    <div className="aspect-video w-full bg-slate-950 relative overflow-hidden">
                      <img src={sub.imageUrl} alt={sub.title} className="w-full h-full object-cover" />
                      <div className="absolute top-2.5 right-2.5">
                        {isPending && (
                          <span className="px-2.5 py-1 text-[10px] font-bold bg-amber-500 text-slate-950 rounded-full flex items-center gap-1 shadow-sm">
                            <Clock className="w-3 h-3" />
                            <span>Pending Admin Review</span>
                          </span>
                        )}
                        {isApproved && (
                          <span className="px-2.5 py-1 text-[10px] font-bold bg-emerald-500 text-slate-950 rounded-full flex items-center gap-1 shadow-sm">
                            <CheckCircle2 className="w-3 h-3" />
                            <span>Live on Student App</span>
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="p-4 space-y-2 flex-1 flex flex-col justify-between">
                      <div>
                        <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider block">
                          {sub.categoryLabel}
                        </span>
                        <h4 className="text-sm font-bold text-white mt-1 leading-snug">
                          {sub.title}
                        </h4>
                        <p className="text-xs text-slate-400 mt-1 line-clamp-2">
                          {sub.subtitle}
                        </p>
                      </div>

                      <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs">
                        <span className="font-mono text-emerald-400 font-bold">
                          ₹{sub.fullPriceInr}
                        </span>
                        <span className="text-slate-400">
                          {sub.modules.length} Chapters
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* 3. TEACHER PROFILE & UPI */}
        {activeTab === 'profile' && (
          <div className="max-w-3xl mx-auto bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6">
            <div className="flex items-center gap-4 border-b border-slate-800 pb-5">
              <div className="w-16 h-16 rounded-2xl overflow-hidden bg-slate-950 border border-slate-700 shrink-0">
                <img src={teacherProfile.avatarUrl} alt={teacherProfile.name} className="w-full h-full object-cover" />
              </div>
              <div>
                <h2 className="text-base sm:text-lg font-bold text-white">{teacherProfile.name}</h2>
                <p className="text-xs text-emerald-400 font-semibold">{teacherProfile.qualification}</p>
                <p className="text-[11px] text-slate-400 mt-0.5">Verified Vidya Setu Faculty • {teacherProfile.experienceYears} Years Experience</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Full Name</label>
                <input
                  type="text"
                  value={teacherProfile.name}
                  onChange={(e) => setTeacherProfile({ ...teacherProfile, name: e.target.value })}
                  className="w-full px-3.5 py-2 text-xs bg-slate-950 border border-slate-700 rounded-xl text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Email ID</label>
                <input
                  type="email"
                  value={teacherProfile.email}
                  onChange={(e) => setTeacherProfile({ ...teacherProfile, email: e.target.value })}
                  className="w-full px-3.5 py-2 text-xs bg-slate-950 border border-slate-700 rounded-xl text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Mobile Number</label>
                <input
                  type="tel"
                  value={teacherProfile.phone}
                  onChange={(e) => setTeacherProfile({ ...teacherProfile, phone: e.target.value })}
                  className="w-full px-3.5 py-2 text-xs bg-slate-950 border border-slate-700 rounded-xl text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Direct Settlement UPI ID (for course fee payouts)
                </label>
                <input
                  type="text"
                  value={teacherProfile.upiId}
                  onChange={(e) => setTeacherProfile({ ...teacherProfile, upiId: e.target.value })}
                  placeholder="yourname@upi"
                  className="w-full px-3.5 py-2 text-xs bg-slate-950 border border-slate-700 rounded-xl text-emerald-400 font-mono font-bold"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-300 mb-1">Subject Expertise</label>
                <input
                  type="text"
                  value={teacherProfile.subjectExpertise}
                  onChange={(e) => setTeacherProfile({ ...teacherProfile, subjectExpertise: e.target.value })}
                  className="w-full px-3.5 py-2 text-xs bg-slate-950 border border-slate-700 rounded-xl text-white"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-300 mb-1">About Educator / Bio</label>
                <textarea
                  rows={3}
                  value={teacherProfile.bio}
                  onChange={(e) => setTeacherProfile({ ...teacherProfile, bio: e.target.value })}
                  className="w-full px-3.5 py-2 text-xs bg-slate-950 border border-slate-700 rounded-xl text-white"
                />
              </div>
            </div>

            <button
              type="button"
              onClick={() => showToast('Teacher profile and UPI payout preferences updated!')}
              className="w-full py-2.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 rounded-xl transition-colors cursor-pointer"
            >
              Save Profile Changes
            </button>
          </div>
        )}

        {/* 4. EARNINGS & REVENUE SHARE */}
        {activeTab === 'earnings' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
                <span className="text-xs font-semibold text-slate-400">Total Enrolled Students</span>
                <p className="text-2xl font-bold text-white font-mono mt-1">{teacherProfile.totalStudents || 480}</p>
                <p className="text-[11px] text-emerald-400 mt-1">Across all published courses</p>
              </div>

              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
                <span className="text-xs font-semibold text-slate-400">Total Revenue Earned</span>
                <p className="text-2xl font-bold text-emerald-400 font-mono mt-1">₹{(teacherProfile.totalEarningsInr || 96400).toLocaleString()}</p>
                <p className="text-[11px] text-slate-400 mt-1">80% Teacher Share Policy</p>
              </div>

              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
                <span className="text-xs font-semibold text-slate-400">Settlement Account</span>
                <p className="text-sm font-bold text-white font-mono mt-1.5">{teacherProfile.upiId || 'arvindmehta@sbi'}</p>
                <span className="inline-block px-2 py-0.5 text-[10px] font-bold bg-emerald-500/20 text-emerald-300 rounded mt-1">
                  ✓ Active for Direct UPI
                </span>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};
