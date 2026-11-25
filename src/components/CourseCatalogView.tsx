import React, { useState, useEffect } from 'react';
import {
  BookOpen,
  CheckCircle2,
  Lock,
  Search,
  ArrowRight,
  Clock,
  GraduationCap,
  Landmark,
  TrendingUp,
  Sparkles,
  MessageSquare,
  ChevronRight,
  Star,
  ClipboardCheck,
  Lightbulb,
  Eye,
  X,
  Image as ImageIcon,
  ChevronLeft,
} from 'lucide-react';
import {
  Course,
  CourseCategory,
  CourseModule,
  FeatureImageItem,
  McqSegment,
  SiteConfig,
} from '../types/education';
import { K12SubjectExplorer } from './K12SubjectExplorer';
import { K12ClassLevel } from '../data/k12SubjectsData';

interface CourseCatalogViewProps {
  courses: Course[];
  mcqSegments: McqSegment[];
  unlockedModuleIds: string[];
  siteConfig: SiteConfig;
  medium: 'hi' | 'en';
  onSelectCourse: (course: Course) => void;
  onStartMcqSprint: (trackId?: string) => void;
  onWatchLmsVideo: (course: Course, moduleId?: string) => void;
  onProceedToCheckout: (params: {
    course: Course;
    purchaseType: 'Full Course' | 'Partial Modules';
    selectedModules: CourseModule[];
    finalAmountInr: number;
  }) => void;
  onNavigateView: (
    view: 'catalog' | 'skills' | 'mcq' | 'tests' | 'hub' | 'doubts' | 'kids' | 'dashboard'
  ) => void;
  onSendContactMessage: (payload: {
    senderName: string;
    senderContact: string;
    subject: string;
    message: string;
  }) => Promise<void>;
}

const CATEGORY_TABS: { id: 'all' | CourseCategory; label: string; hiLabel: string }[] = [
  { id: 'all', label: 'All Tracks', hiLabel: 'सभी कोर्स' },
  { id: 'k12', label: 'Class 9–12', hiLabel: 'कक्षा 9–12' },
  { id: 'competitive', label: 'UPSC, SSC & Bank', hiLabel: 'UPSC, SSC और बैंक' },
  { id: 'skills', label: 'High-Salary Skills', hiLabel: 'हाई-सैलरी स्किल्स' },
  { id: 'kids', label: 'Future Kids', hiLabel: 'फ्यूचर किड्स' },
];

const DEFAULT_FEATURE_IMAGES: FeatureImageItem[] = [
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
];

export const CourseCatalogView: React.FC<CourseCatalogViewProps> = ({
  courses,
  mcqSegments,
  unlockedModuleIds,
  siteConfig,
  medium,
  onSelectCourse,
  onStartMcqSprint,
  onWatchLmsVideo,
  onProceedToCheckout,
  onNavigateView,
  onSendContactMessage,
}) => {
  const [contactName, setContactName] = useState('');
  const [contactPhoneOrEmail, setContactPhoneOrEmail] = useState('');
  const [contactSubject, setContactSubject] = useState('');
  const [contactBody, setContactBody] = useState('');
  const [contactSent, setContactSent] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<'all' | CourseCategory>('all');
  const [k12InitialClass, setK12InitialClass] = useState<K12ClassLevel>('11');
  const [searchQuery, setSearchQuery] = useState('');
  const [previewFeatureIdx, setPreviewFeatureIdx] = useState<number | null>(null);
  const [heroImgFailed, setHeroImgFailed] = useState(false);
  const [failedFeatureImgIds, setFailedFeatureImgIds] = useState<Record<string, boolean>>({});

  // Automatic Hindi MCQ Mini-Preview on Home
  const [autoMcqIdx, setAutoMcqIdx] = useState(0);
  const [autoPicked, setAutoPicked] = useState<number | null>(null);

  const featureImages: FeatureImageItem[] =
    siteConfig.featureImages && siteConfig.featureImages.length > 0
      ? siteConfig.featureImages
      : DEFAULT_FEATURE_IMAGES;

  const heroBannerSrc =
    siteConfig.heroImageUrl || '/src/assets/images/hero_learning_studio_1793856674745.jpg';

  useEffect(() => {
    const timer = setInterval(() => {
      setAutoMcqIdx((prev) => (prev + 1) % mcqSegments.length);
      setAutoPicked(null);
    }, 12000);
    return () => clearInterval(timer);
  }, [mcqSegments.length]);

  const currentAutoMcq = mcqSegments[autoMcqIdx];

  const filteredCourses = courses.filter((course) => {
    const q = searchQuery.trim().toLowerCase();
    const matchesCat = selectedCategory === 'all' || course.category === selectedCategory;
    const matchesSearch =
      !q ||
      course.title.toLowerCase().includes(q) ||
      (course.hindiTitle && course.hindiTitle.toLowerCase().includes(q)) ||
      course.subtitle.toLowerCase().includes(q) ||
      course.categoryLabel.toLowerCase().includes(q) ||
      course.instructor.toLowerCase().includes(q);
    return matchesCat && matchesSearch;
  });

  const quickTrackTiles = [
    {
      label: medium === 'hi' ? 'कक्षा 9–12' : 'Class 9–12',
      icon: BookOpen,
      bg: 'bg-slate-50',
      action: () => {
        setSelectedCategory('k12');
        document.getElementById('course-catalog-grid')?.scrollIntoView({ behavior: 'smooth' });
      },
    },
    {
      label: medium === 'hi' ? 'UPSC और IAS' : 'UPSC & IAS',
      icon: Landmark,
      bg: 'bg-slate-50',
      action: () => {
        setSelectedCategory('competitive');
        document.getElementById('course-catalog-grid')?.scrollIntoView({ behavior: 'smooth' });
      },
    },
    {
      label: medium === 'hi' ? 'SSC और बैंक' : 'SSC & Bank',
      icon: GraduationCap,
      bg: 'bg-blue-50/80',
      action: () => {
        setSelectedCategory('competitive');
        document.getElementById('course-catalog-grid')?.scrollIntoView({ behavior: 'smooth' });
      },
    },
    {
      label: medium === 'hi' ? 'AI व Python स्किल्स' : 'AI & Python',
      icon: TrendingUp,
      bg: 'bg-indigo-50/80',
      action: () => onNavigateView('skills'),
    },
    {
      label: medium === 'hi' ? 'किड्स एरिना' : 'Kids Arena',
      icon: Sparkles,
      bg: 'bg-emerald-50/80',
      action: () => onNavigateView('kids'),
    },
    {
      label: medium === 'hi' ? 'लाइव डाउट्स' : 'Live Doubts',
      icon: MessageSquare,
      bg: 'bg-slate-50',
      action: () => onNavigateView('doubts'),
    },
    {
      label: medium === 'hi' ? 'ऑनलाइन टेस्ट' : 'Online Tests',
      icon: ClipboardCheck,
      bg: 'bg-amber-50/80',
      action: () => onNavigateView('tests'),
    },
    {
      label: medium === 'hi' ? 'आइडिया व गोल 💡' : 'Ideas & Goals 💡',
      icon: Lightbulb,
      bg: 'bg-emerald-50/80',
      action: () => onNavigateView('hub'),
    },
  ];

  return (
    <div className="space-y-10">
      {/* Mint-Emerald 2-Column Hero Showcase */}
      <section className="bg-gradient-to-b from-[#ECFDF5] via-[#F4FBF8] to-white border border-emerald-100 rounded-2xl p-6 sm:p-10 lg:p-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-7 space-y-5">
            <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-700">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span>Trusted by 10,000+ students across India</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-slate-900 leading-[1.15] text-balance">
              {siteConfig.heroHeadline}
            </h1>

            <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl">
              {medium === 'hi' ? siteConfig.heroSubtitleHi : siteConfig.heroSubtitleEn}
            </p>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
              <a
                href="#course-catalog-grid"
                style={{ backgroundColor: siteConfig.primaryColor }}
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 text-sm font-semibold text-white hover:opacity-95 rounded-xl transition-opacity whitespace-nowrap"
              >
                <span>{medium === 'hi' ? 'Courses Dekhein' : 'Explore Courses'}</span>
                <ArrowRight className="w-4 h-4" />
              </a>
              <button
                type="button"
                onClick={() => onNavigateView('skills')}
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 text-sm font-semibold text-slate-900 bg-white border border-slate-200 hover:border-slate-300 rounded-xl transition-colors whitespace-nowrap cursor-pointer"
              >
                <span>High-Salary Skills (AI/Python)</span>
              </button>
            </div>

            {/* 3-Column Stats Row */}
            <div className="grid grid-cols-3 gap-4 pt-6 mt-4 border-t border-emerald-100/80 max-w-xl">
              <div>
                <p
                  style={{ color: siteConfig.primaryColor }}
                  className="text-2xl sm:text-3xl font-bold font-mono-tabular"
                >
                  {siteConfig.statMentors}
                </p>
                <p className="text-xs sm:text-sm text-slate-600 mt-0.5">Expert Mentors</p>
              </div>
              <div>
                <p
                  style={{ color: siteConfig.primaryColor }}
                  className="text-2xl sm:text-3xl font-bold font-mono-tabular"
                >
                  {siteConfig.statStudents}
                </p>
                <p className="text-xs sm:text-sm text-slate-600 mt-0.5">Happy Students</p>
              </div>
              <div>
                <p
                  style={{ color: siteConfig.primaryColor }}
                  className="text-2xl sm:text-3xl font-bold font-mono-tabular flex items-center gap-1"
                >
                  <span>{siteConfig.statRating}</span>
                  <Star className="w-4 h-4 fill-amber-400 text-amber-400 inline" />
                </p>
                <p className="text-xs sm:text-sm text-slate-600 mt-0.5">Student Rating</p>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5">
            <div className="relative aspect-[4/3] w-full rounded-2xl overflow-hidden border border-emerald-200/80 bg-slate-900 shadow-sm">
              {!heroImgFailed ? (
                <img
                  src={heroBannerSrc}
                  alt={siteConfig.heroHeadline}
                  referrerPolicy="no-referrer"
                  onError={() => setHeroImgFailed(true)}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center bg-slate-800 text-slate-300 p-6 text-center gap-2">
                  <ImageIcon className="w-8 h-8 text-emerald-400" />
                  <p className="text-sm font-semibold">{siteConfig.appName}</p>
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/20 to-transparent flex flex-col justify-end p-5">
                <p className="text-[11px] font-bold uppercase tracking-wider text-emerald-300">
                  {medium === 'hi' ? 'फीचर्ड लर्निंग स्टूडियो' : 'Featured Learning Studio'}
                </p>
                <p className="text-sm sm:text-base font-bold text-white mt-0.5 leading-snug">
                  {medium === 'hi'
                    ? 'HD वीडियो चैप्टर, हिंदी MCQ और ऑफलाइन PDF नोट्स'
                    : 'HD Video Chapters, Bilingual MCQs & Offline PDF Notes'}
                </p>
                <a
                  href="#feature-images-area"
                  className="mt-2.5 inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-300 hover:text-white transition-colors w-fit"
                >
                  <span>{medium === 'hi' ? 'फीचर गैलरी देखें' : 'View Feature Gallery'}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Images Area (Admin-Configurable Visual Highlights) */}
      <section id="feature-images-area" className="space-y-4">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-wider text-emerald-700">
              {medium === 'hi' ? 'विज़ुअल लर्निंग हाइलाइट्स' : 'Visual Highlights'}
            </p>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 mt-0.5">
              {medium === 'hi' ? 'फीचर इमेज गैलरी और प्रमुख ट्रैक' : 'Feature Images Showcase'}
            </h2>
            <p className="text-sm text-slate-500 mt-0.5">
              {medium === 'hi'
                ? 'कक्षा 9–12, UPSC/SSC, AI स्किल्स और किड्स एरिना की झलक देखें।'
                : 'Explore studio highlights across Boards, Competitive Exams, AI Skills & Kids Arena.'}
            </p>
          </div>
          <button
            type="button"
            onClick={() => setPreviewFeatureIdx(0)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-200 hover:border-emerald-300 hover:text-emerald-700 rounded-xl transition-colors whitespace-nowrap cursor-pointer"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>{medium === 'hi' ? 'फुल गैलरी प्रीव्यू' : 'Inspect Gallery'}</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {featureImages.map((item, idx) => {
            const titleText =
              medium === 'hi' && item.hindiTitle ? item.hindiTitle : item.title;
            const captionText =
              medium === 'hi' && item.hindiCaption ? item.hindiCaption : item.caption;
            const hasFailed = failedFeatureImgIds[item.id];

            return (
              <article
                key={item.id}
                className="group bg-white border border-slate-200 hover:border-emerald-300 rounded-2xl overflow-hidden flex flex-col justify-between transition-colors"
              >
                <div>
                  <div className="relative aspect-[16/10] w-full bg-slate-900 overflow-hidden">
                    {!hasFailed ? (
                      <img
                        src={item.imageUrl}
                        alt={titleText}
                        referrerPolicy="no-referrer"
                        onError={() =>
                          setFailedFeatureImgIds((prev) => ({ ...prev, [item.id]: true }))
                        }
                        className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center bg-slate-800 text-slate-300 p-4 text-center gap-1.5">
                        <ImageIcon className="w-6 h-6 text-emerald-400" />
                        <span className="text-xs font-semibold">{titleText}</span>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/75 via-slate-950/15 to-transparent pointer-events-none" />
                    <button
                      type="button"
                      onClick={() => setPreviewFeatureIdx(idx)}
                      aria-label={`Preview ${titleText}`}
                      className="absolute top-2.5 right-2.5 p-2 rounded-lg bg-slate-950/75 hover:bg-slate-950 text-white border border-white/15 transition-colors cursor-pointer"
                    >
                      <Eye className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="p-4 space-y-1.5">
                    <h3 className="text-sm font-bold text-slate-900 leading-snug line-clamp-2">
                      {titleText}
                    </h3>
                    <p className="text-xs text-slate-600 leading-relaxed line-clamp-2">
                      {captionText}
                    </p>
                  </div>
                </div>

                <div className="px-4 pb-4 pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      const target = item.targetView || 'catalog';
                      if (target === 'catalog') {
                        document
                          .getElementById('course-catalog-grid')
                          ?.scrollIntoView({ behavior: 'smooth' });
                      } else {
                        onNavigateView(target);
                      }
                    }}
                    className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 hover:text-emerald-800 whitespace-nowrap cursor-pointer"
                  >
                    <span>{item.ctaLabel || (medium === 'hi' ? 'देखें' : 'Explore')}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setPreviewFeatureIdx(idx)}
                    className="text-[11px] font-semibold text-slate-500 hover:text-slate-900 whitespace-nowrap cursor-pointer"
                  >
                    {medium === 'hi' ? 'बड़ा देखें' : 'Preview'}
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      {/* Our Tracks Icon Grid (Matching Screenshot 3) */}
      <section className="space-y-4">
        <div className="flex items-end justify-between gap-4">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
              Our Tracks
            </h2>
            <p className="text-sm text-slate-500 mt-0.5">
              What are you preparing for today?
            </p>
          </div>
          <button
            type="button"
            onClick={() => {
              setSelectedCategory('all');
              document
                .getElementById('course-catalog-grid')
                ?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="inline-flex items-center gap-1 text-xs font-semibold text-slate-700 hover:text-emerald-700 whitespace-nowrap"
          >
            <span>View All</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
          {quickTrackTiles.map((tile) => {
            const Icon = tile.icon;
            return (
              <button
                key={tile.label}
                type="button"
                onClick={tile.action}
                className={`${tile.bg} border border-slate-100 hover:border-emerald-200 rounded-2xl p-4 flex flex-col items-center justify-center text-center gap-2.5 transition-colors cursor-pointer`}
              >
                <div className="w-11 h-11 rounded-xl bg-white border border-slate-100 flex items-center justify-center text-emerald-600">
                  <Icon className="w-5 h-5" />
                </div>
                <span className="text-xs sm:text-sm font-semibold text-slate-800 leading-tight">
                  {tile.label}
                </span>
              </button>
            );
          })}
        </div>
      </section>

      {/* Automatic Hindi MCQ Live Card (Auto-rotating for Students) */}
      <section className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <p className="text-xs font-bold text-emerald-700">
              दैनिक हिंदी MCQ अभ्यास (Automatic Hindi MCQ) · {currentAutoMcq.hindi.trackTitle}
            </p>
            <h3 className="text-base sm:text-lg font-bold text-slate-900 mt-1">
              {currentAutoMcq.hindi.question}
            </h3>
          </div>
          <button
            type="button"
            onClick={() => onStartMcqSprint()}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 rounded-lg transition-colors whitespace-nowrap shrink-0"
          >
            <span>Full Auto Sprint</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {currentAutoMcq.hindi.options.map((opt, idx) => {
            const isPicked = autoPicked === idx;
            const isCorrect = idx === currentAutoMcq.correctIndex;
            const show = autoPicked !== null;
            let cls = 'bg-slate-50 border-slate-200 hover:border-emerald-500 text-slate-800';
            if (show) {
              if (isCorrect) cls = 'bg-emerald-50 border-emerald-500 text-slate-900 font-semibold';
              else if (isPicked) cls = 'bg-red-50 border-red-400 text-slate-900';
            }
            return (
              <button
                key={idx}
                type="button"
                onClick={() => setAutoPicked(idx)}
                className={`p-3 rounded-xl border text-left text-xs sm:text-sm transition-colors ${cls}`}
              >
                <span className="font-mono-tabular font-bold mr-2 text-slate-500">
                  {String.fromCharCode(65 + idx)}.
                </span>
                {opt}
              </button>
            );
          })}
        </div>

        {autoPicked !== null && (
          <p className="text-xs text-slate-700 bg-emerald-50/60 border border-emerald-200 rounded-xl p-3">
            <span className="font-bold text-emerald-800">व्याख्या: </span>
            {currentAutoMcq.hindi.explanation}
          </p>
        )}
      </section>

      {/* Course Catalog & Partial Module Cards (Matching Screenshot 2) */}
      <section id="course-catalog-grid" className="space-y-5">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
              Popular Courses &amp; Partial Chapters
            </h2>
            <p className="text-sm text-slate-500 mt-0.5">
              Buy individual chapters starting at ₹149 or unlock the full course.
            </p>
          </div>

          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search UPSC, Physics, SEO, Kids..."
              aria-label="Search courses"
              className="w-full pl-10 pr-4 py-2 text-sm bg-white border border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-emerald-600"
            />
          </div>
        </div>

        {/* Category Filter Segmented Control */}
        <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-xl overflow-x-auto">
          {CATEGORY_TABS.map((tab) => {
            const active = selectedCategory === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setSelectedCategory(tab.id)}
                className={`px-3.5 py-2 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap shrink-0 ${
                  active
                    ? 'bg-white text-slate-900 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {medium === 'hi' ? tab.hiLabel : tab.label}
              </button>
            );
          })}
        </div>

        {/* Class 9-12 Quick Selector Banner when on All Tracks */}
        {selectedCategory === 'all' && !searchQuery.trim() && (
          <div className="bg-emerald-50/70 border border-emerald-200 rounded-2xl p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-700">
                {medium === 'hi'
                  ? 'कक्षा 9–12 • स्ट्रीम व विषय चुनें'
                  : 'Class 9–12 • Stream & Subject Selector'}
              </span>
              <h3 className="text-base sm:text-lg font-bold text-slate-900 mt-0.5">
                {medium === 'hi'
                  ? 'अपनी कक्षा चुनें (9, 10, 11, 12) → PCM / PCB / Arts / Commerce → Subject-by-Subject 12 Months Access'
                  : 'Pick Class (9, 10, 11, 12) → Stream (PCM / PCB / Arts / Commerce) → Subject-by-Subject 12 Months Access'}
              </h3>
            </div>
            <div className="flex flex-wrap items-center gap-2 shrink-0">
              {(['9', '10', '11', '12'] as K12ClassLevel[]).map((cls) => (
                <button
                  key={cls}
                  type="button"
                  onClick={() => {
                    setK12InitialClass(cls);
                    setSelectedCategory('k12');
                  }}
                  className="px-3.5 py-2 rounded-xl bg-white border border-emerald-200 hover:border-emerald-600 hover:bg-emerald-600 hover:text-white text-xs font-bold text-slate-900 transition-colors cursor-pointer"
                >
                  {medium === 'hi' ? `कक्षा ${cls}` : `Class ${cls}`}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Interactive Class 9-12 -> Stream -> Subject-by-Subject Explorer */}
        {/* Interactive Class 9-12 -> Stream -> Subject-by-Subject Explorer */}
        {selectedCategory === 'k12' && !searchQuery.trim() && (
          <K12SubjectExplorer
            key={k12InitialClass}
            courses={courses}
            unlockedModuleIds={unlockedModuleIds}
            medium={medium}
            initialClass={k12InitialClass}
            onWatchDemoVideo={(course, moduleId) => onWatchLmsVideo(course, moduleId)}
            onUnlockSubjectLifetime={(params) => onProceedToCheckout(params)}
            onViewChapters={(course) => onSelectCourse(course)}
          />
        )}

        {filteredCourses.length === 0 ? (
          <div className="bg-white border border-slate-200 rounded-2xl p-10 text-center">
            <p className="text-base font-semibold text-slate-900">No matching courses found</p>
            <button
              type="button"
              onClick={() => {
                setSelectedCategory('all');
                setSearchQuery('');
              }}
              className="mt-3 px-4 py-2 text-xs font-semibold text-white bg-emerald-600 rounded-lg hover:bg-emerald-700 cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {selectedCategory === 'k12' && !searchQuery.trim() && (
              <div className="flex items-center justify-between pt-4 border-t border-slate-200">
                <h3 className="text-sm font-bold text-slate-800">
                  {medium === 'hi' ? 'सभी कक्षा 9–12 कोर्स व विषय' : 'All Available Class 9–12 Courses & Subjects'} ({filteredCourses.length})
                </h3>
              </div>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredCourses.map((course) => {
              const unlockedCount = course.modules.filter((m) =>
                unlockedModuleIds.includes(m.id)
              ).length;
              const minModulePrice = course.modules.length > 0
                ? Math.min(...course.modules.map((m) => m.priceInr || 99))
                : 99;

              return (
                <article
                  key={course.id}
                  className="bg-white border border-slate-200 rounded-2xl overflow-hidden flex flex-col justify-between hover:border-emerald-300 transition-colors"
                >
                  <div>
                    {/* Large Course / Subject Thumbnail Banner */}
                    <div className="relative h-48 w-full bg-slate-100 overflow-hidden">
                      <img
                        src={course.imageUrl}
                        alt={course.title}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.currentTarget as HTMLImageElement).src =
                            '/src/assets/images/hero_learning_studio_1793856674745.jpg';
                        }}
                      />
                      <div className="absolute top-3 left-3 px-2.5 py-1 bg-slate-900/80 backdrop-blur-sm text-white text-[11px] font-bold rounded-lg">
                        {course.categoryLabel}
                      </div>
                      <div className="absolute top-3 right-3 px-2.5 py-1 bg-white/95 text-slate-900 text-[11px] font-bold rounded-lg shadow-sm">
                        ★ {course.rating}
                      </div>
                    </div>

                    <div className="p-5 sm:p-6 space-y-2.5">
                      <div className="flex items-center justify-between text-xs text-slate-500">
                        <span className="font-semibold text-slate-600 flex items-center gap-1.5 flex-wrap">
                          <span>{course.instructor}</span>
                          {course.isTeacherPartner && (
                            <span className="px-1.5 py-0.5 text-[9px] font-bold bg-indigo-50 text-indigo-700 rounded-md border border-indigo-200">
                              ✓ Verified Faculty
                            </span>
                          )}
                        </span>
                        <span className="font-mono-tabular">
                          {unlockedCount > 0 ? (
                            <span className="text-emerald-700 font-semibold inline-flex items-center gap-1">
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              {unlockedCount}/{course.modules.length}
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1">
                              <Lock className="w-3 h-3" />
                              {course.modules.length} ch
                            </span>
                          )}
                        </span>
                      </div>

                      <h3 className="text-lg font-bold text-slate-900 leading-snug">
                        {course.title}
                      </h3>

                    <p className="text-sm text-slate-500 line-clamp-2 leading-relaxed">
                      {medium === 'hi' && course.hindiSubtitle
                        ? course.hindiSubtitle
                        : course.subtitle}
                    </p>
                    {course.salaryRange && (
                      <p className="text-xs font-bold text-indigo-700 font-mono-tabular">
                        {medium === 'hi' ? 'औसत सैलरी: ' : 'Avg Salary: '}
                        {course.salaryRange}
                      </p>
                    )}
                    </div>
                  </div>

                  <div className="px-5 sm:px-6 pb-5 sm:pb-6 pt-3 border-t border-slate-100 flex items-end justify-between gap-4">
                    <div>
                      <div className="flex items-baseline gap-1">
                        <span className="text-xl font-bold text-emerald-600 font-mono-tabular">
                          ₹{minModulePrice}
                        </span>
                        <span className="text-xs text-slate-500">/chapter</span>
                      </div>
                      <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5 font-mono-tabular">
                        <Clock className="w-3.5 h-3.5" />
                        <span>
                          Full ₹{course.fullPriceInr} · {course.totalMcqs} MCQs
                        </span>
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      {unlockedCount > 0 && (
                        <button
                          type="button"
                          onClick={() => onWatchLmsVideo(course)}
                          className="px-3 py-2.5 text-xs font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 rounded-xl transition-colors whitespace-nowrap cursor-pointer"
                        >
                          LMS Video
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => onSelectCourse(course)}
                        className="inline-flex items-center gap-1.5 px-4 py-2.5 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                      >
                        <span>{unlockedCount === course.modules.length ? 'Open' : 'Select'}</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </article>
              );
            })}
            </div>
          </div>
        )}
      </section>

      {/* Bottom Emerald CTA Banner */}
      <section
        style={{ backgroundColor: siteConfig.primaryColor }}
        className="text-white rounded-2xl p-8 sm:p-10 flex flex-col md:flex-row md:items-center justify-between gap-6"
      >
        <div className="space-y-2 max-w-xl">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
            Ready to get started?
          </h2>
          <p className="text-sm sm:text-base text-white/90 leading-relaxed">
            {siteConfig.announcementText}
          </p>
        </div>

        <button
          type="button"
          onClick={() => onStartMcqSprint()}
          className="inline-flex items-center justify-center gap-2 px-6 py-3.5 text-sm font-bold text-slate-900 bg-white hover:bg-emerald-50 rounded-xl transition-colors whitespace-nowrap shrink-0 cursor-pointer"
        >
          <span>Start Hindi MCQ</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </section>

      {/* Contact & Writing Section */}
      <section className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-5 space-y-3">
          <h2 className="text-xl font-bold text-slate-900">
            Contact &amp; Write to {siteConfig.appName}
          </h2>
          <p className="text-sm text-slate-600 leading-relaxed">
            Have a question about courses, partial chapters, or bulk school access? Write to us
            directly.
          </p>
          <div className="pt-2 space-y-2 text-xs text-slate-700 font-mono-tabular">
            <p>
              <strong>Email:</strong> {siteConfig.contactEmail}
            </p>
            <p>
              <strong>Phone:</strong> {siteConfig.contactPhone}
            </p>
            <p className="font-sans">
              <strong>Address:</strong> {siteConfig.contactAddress}
            </p>
          </div>
        </div>

        <form
          onSubmit={async (e) => {
            e.preventDefault();
            if (!contactBody.trim()) return;
            await onSendContactMessage({
              senderName: contactName,
              senderContact: contactPhoneOrEmail,
              subject: contactSubject,
              message: contactBody,
            });
            setContactName('');
            setContactPhoneOrEmail('');
            setContactSubject('');
            setContactBody('');
            setContactSent(true);
            setTimeout(() => setContactSent(false), 3500);
          }}
          className="lg:col-span-7 space-y-3"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <input
              type="text"
              value={contactName}
              onChange={(e) => setContactName(e.target.value)}
              placeholder="Your Name"
              required
              className="px-3.5 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-600"
            />
            <input
              type="text"
              value={contactPhoneOrEmail}
              onChange={(e) => setContactPhoneOrEmail(e.target.value)}
              placeholder="Gmail ID or Mobile Number"
              required
              className="px-3.5 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-600"
            />
          </div>
          <input
            type="text"
            value={contactSubject}
            onChange={(e) => setContactSubject(e.target.value)}
            placeholder="Subject (e.g. Course Inquiry)"
            className="w-full px-3.5 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-600"
          />
          <textarea
            rows={2}
            value={contactBody}
            onChange={(e) => setContactBody(e.target.value)}
            placeholder="Write your message here..."
            required
            className="w-full px-3.5 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-600"
          />
          <div className="flex items-center justify-between gap-3">
            {contactSent ? (
              <span className="text-xs font-semibold text-emerald-700">
                Message sent to Admin Inbox!
              </span>
            ) : (
              <span />
            )}
            <button
              type="submit"
              style={{ backgroundColor: siteConfig.primaryColor }}
              className="px-5 py-2.5 text-xs font-semibold text-white hover:opacity-95 rounded-xl transition-opacity cursor-pointer"
            >
              Send Message
            </button>
          </div>
        </form>
      </section>

      {/* Feature Image Lightbox Preview Modal */}
      {previewFeatureIdx !== null && featureImages[previewFeatureIdx] && (
        <div
          className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setPreviewFeatureIdx(null)}
        >
          <div
            className="bg-white border border-slate-200 rounded-2xl max-w-2xl w-full overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-200">
              <div className="min-w-0">
                <p className="text-[11px] font-bold uppercase tracking-wider text-emerald-700 font-mono-tabular">
                  Feature {previewFeatureIdx + 1} / {featureImages.length}
                </p>
                <h3 className="text-base font-bold text-slate-900 truncate">
                  {medium === 'hi' && featureImages[previewFeatureIdx].hindiTitle
                    ? featureImages[previewFeatureIdx].hindiTitle
                    : featureImages[previewFeatureIdx].title}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setPreviewFeatureIdx(null)}
                aria-label="Close feature image preview"
                className="p-2 rounded-lg text-slate-500 hover:bg-slate-100 hover:text-slate-900 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="relative aspect-[16/10] w-full bg-slate-900">
              <img
                src={featureImages[previewFeatureIdx].imageUrl}
                alt={featureImages[previewFeatureIdx].title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
            </div>

            <div className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-50">
              <p className="text-sm text-slate-700 leading-relaxed">
                {medium === 'hi' && featureImages[previewFeatureIdx].hindiCaption
                  ? featureImages[previewFeatureIdx].hindiCaption
                  : featureImages[previewFeatureIdx].caption}
              </p>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() =>
                    setPreviewFeatureIdx((prev) =>
                      prev === null
                        ? 0
                        : (prev - 1 + featureImages.length) % featureImages.length
                    )
                  }
                  className="p-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-100 text-slate-700 cursor-pointer"
                  aria-label="Previous feature image"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() =>
                    setPreviewFeatureIdx((prev) =>
                      prev === null ? 0 : (prev + 1) % featureImages.length
                    )
                  }
                  className="p-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-100 text-slate-700 cursor-pointer"
                  aria-label="Next feature image"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const current = featureImages[previewFeatureIdx];
                    setPreviewFeatureIdx(null);
                    const target = current.targetView || 'catalog';
                    if (target === 'catalog') {
                      document
                        .getElementById('course-catalog-grid')
                        ?.scrollIntoView({ behavior: 'smooth' });
                    } else {
                      onNavigateView(target);
                    }
                  }}
                  style={{ backgroundColor: siteConfig.primaryColor }}
                  className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white rounded-xl hover:opacity-95 whitespace-nowrap cursor-pointer"
                >
                  <span>{featureImages[previewFeatureIdx].ctaLabel || 'Open Track'}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
