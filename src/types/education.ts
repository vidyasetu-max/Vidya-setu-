export type StudyMedium = 'hi' | 'en';

export type CourseCategory = 'k12' | 'competitive' | 'skills' | 'kids';

export interface CourseModule {
  id: string;
  chapterNumber?: number;
  title: string;
  durationMins: number;
  mcqCount: number;
  priceInr: number;
  isFreePreview?: boolean;
  keyTopics: string[];
  videoUrl?: string;
  pdfUrl?: string;
  pdfFileName?: string;
  pdfPolicy?: 'downloadable' | 'view_only';
  notesText?: string;
}

export interface Course {
  id: string;
  title: string;
  hindiTitle?: string;
  subtitle: string;
  hindiSubtitle?: string;
  category: CourseCategory;
  categoryLabel: string;
  instructor: string;
  instructorRole: string;
  fullPriceInr: number;
  originalPriceInr: number;
  totalHours: number;
  totalMcqs: number;
  rating: string;
  enrolledCount: string;
  imageUrl: string;
  salaryRange?: string;
  accentColor?: 'emerald' | 'indigo' | 'amber' | 'cyan';
  k12Class?: '9' | '10' | '11' | '12' | string;
  k12Stream?: 'pcm' | 'pcb' | 'arts' | 'commerce' | string;
  subjectName?: string;
  subjectHindi?: string;
  accessValidity?: string;
  isTeacherPartner?: boolean;
  teacherId?: string;
  teacherAvatar?: string;
  modules: CourseModule[];
}

export interface McqLocalizedContent {
  trackTitle: string;
  conceptTitle: string;
  conceptSummary: string;
  keyFormulaOrRule: string;
  question: string;
  options: string[];
  explanation: string;
}

export interface McqSegment {
  id: string;
  trackId: string;
  trackTitle: string;
  segmentNumber: number;
  conceptTitle: string;
  conceptSummary: string;
  keyFormulaOrRule: string;
  conceptDurationSec: number;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  questionDurationSec: number;
  hindi: McqLocalizedContent;
}

export interface DoubtSession {
  id: string;
  title: string;
  subject: string;
  mentor: string;
  mentorRole: string;
  isLiveNow: boolean;
  scheduleTime: string;
  activeStudents: number;
  currentSlideTitle: string;
  currentSlideFormula: string;
  currentSlideNotes: string;
}

export interface DoubtQuestion {
  id: string;
  sessionId: string;
  studentName: string;
  topicTag: string;
  questionText: string;
  timestamp: string;
  upvotes: number;
  upvoted?: boolean;
  mentorReply?: string;
  status: 'Answered' | 'In Queue';
}

export interface PurchaseReceipt {
  id: string;
  transactionId: string;
  date: string;
  courseId: string;
  courseTitle: string;
  purchaseType: 'Full Course' | 'Partial Modules';
  moduleIds: string[];
  moduleTitles: string[];
  amountPaidInr: number;
  paymentMethod: string;
  promoApplied?: string;
  studentName?: string;
  studentIdentifier?: string;
  settledToBank?: string;
}

export interface McqAttemptRecord {
  id: string;
  trackTitle: string;
  date: string;
  score: number;
  total: number;
  accuracyPct: number;
  avgTimeSec: number;
}

export interface KidsChallenge {
  id: string;
  type: 'math' | 'pattern' | 'fraction';
  prompt: string;
  visualHint: string;
  options: string[];
  correctIndex: number;
  xpReward: number;
  explanation: string;
}

export interface UserAccount {
  name: string;
  method: 'gmail' | 'mobile';
  identifier: string; // Gmail ID or +91 Mobile Number
  loggedInAt: string;
  isAdmin?: boolean;
  targetExam?: string;
  preferredMedium?: StudyMedium;
  city?: string;
  bio?: string;
  avatarUrl?: string;
}

export interface BankAccountConfig {
  accountHolderName: string;
  bankName: string;
  accountNumber: string;
  ifscCode: string;
  upiId: string;
  upiQrCodeUrl?: string;
  razorpayKeyId: string;
  razorpayMerchantName: string;
}

export interface AppNotification {
  id: string;
  title: string;
  hindiTitle: string;
  message: string;
  hindiMessage: string;
  timestamp: string;
  category: 'course' | 'mcq' | 'doubt' | 'security' | 'broadcast';
  read: boolean;
}

export interface FeatureImageItem {
  id: string;
  title: string;
  hindiTitle?: string;
  caption: string;
  hindiCaption?: string;
  imageUrl: string;
  ctaLabel?: string;
  targetView?: 'catalog' | 'skills' | 'mcq' | 'tests' | 'hub' | 'doubts' | 'kids';
}

export interface SiteConfig {
  appName: string;
  brandInitials: string;
  primaryColor: string;
  fontFamily?: string;
  heroImageUrl?: string;
  featureImages?: FeatureImageItem[];
  heroHeadline: string;
  heroSubtitleEn: string;
  heroSubtitleHi: string;
  statMentors: string;
  statStudents: string;
  statRating: string;
  contactEmail: string;
  contactPhone: string;
  contactAddress: string;
  announcementText: string;
  privacyPolicyText?: string;
  termsAndConditionsText?: string;
  legalLastUpdated?: string;
  defaultPartnerRoyaltyPct?: number;
}

export interface ContactMessage {
  id: string;
  senderName: string;
  senderContact: string;
  subject: string;
  message: string;
  timestamp: string;
}

export interface OnlineTestQuestion {
  id: string;
  questionEn: string;
  questionHi: string;
  optionsEn: string[];
  optionsHi: string[];
  correctIndex: number;
  explanationEn?: string;
  explanationHi?: string;
}

export interface LongAnswerQuestion {
  id: string;
  questionEn: string;
  questionHi: string;
  maxMarks: number;
  wordLimit?: number;
}

export interface OnlineTest {
  id: string;
  titleEn: string;
  titleHi: string;
  category: string;
  durationMins: number;
  marksPerQuestion: number;
  negativeMarking: number;
  isPublished: boolean;
  createdAt: string;
  questions: OnlineTestQuestion[];
  longQuestions?: LongAnswerQuestion[];
}

export interface OnlineTestSubmission {
  id: string;
  testId: string;
  testTitle: string;
  studentName: string;
  studentIdentifier: string;
  score: number;
  maxScore: number;
  correctCount: number;
  wrongCount: number;
  unansweredCount: number;
  accuracyPct: number;
  timeTakenSec: number;
  longAnswers?: Record<string, string>;
  submittedAt: string;
}

export interface StudentAccessGrant {
  id: string;
  studentName: string;
  studentIdentifier: string;
  courseId: string;
  courseTitle: string;
  accessType: 'Full Course' | 'Single Chapter';
  moduleIds: string[];
  moduleTitles: string[];
  note?: string;
  grantedAt: string;
}

export interface PendingAccessRequest {
  id: string;
  studentName: string;
  studentIdentifier: string;
  courseId: string;
  courseTitle: string;
  accessType: 'Full Course' | 'Partial Modules';
  moduleIds: string[];
  moduleTitles: string[];
  amountInr: number;
  paymentReference: string;
  status: 'Pending' | 'Scheduled' | 'Approved' | 'Rejected';
  activationDate?: string;
  requestedAt: string;
}

export interface ApiConnectionsConfig {
  razorpayKeyId: string;
  razorpayKeySecret: string;
  razorpayMode: 'test' | 'live';
  smsOtpProvider: string;
  emailSmtpHost: string;
  otpDeliveryMode?: 'built_in_gateway' | 'fast2sms' | 'msg91' | 'twilio' | 'smtp_email';
  smsOtpApiKey?: string;
  smsSenderId?: string;
  webhookUrl: string;
  autoUnlockOnPayment: boolean;
  enableOnlineTests: boolean;
  enableLiveDoubts: boolean;
  enableKidsArena: boolean;
  maintenanceMode: boolean;
}

export interface StartupIdea {
  id: string;
  studentName: string;
  studentAvatar?: string;
  title: string;
  domain: string;
  pitch: string;
  imageUrl?: string;
  upvotes: number;
  upvoted?: boolean;
  createdAt: string;
}

export interface GoalConversationReply {
  id: string;
  authorName: string;
  authorRole: string;
  message: string;
  timestamp: string;
}

export interface GoalConversation {
  id: string;
  studentName: string;
  studentAvatar?: string;
  goalTag: string;
  message: string;
  imageUrl?: string;
  timestamp: string;
  replies: GoalConversationReply[];
}

export interface StudentGalleryItem {
  id: string;
  studentName: string;
  caption: string;
  imageUrl: string;
  uploadedAt: string;
}

export interface TeacherBankAccountDetails {
  accountHolderName: string;
  bankName: string;
  accountNumber: string;
  ifscCode: string;
  branchName?: string;
  accountType?: 'Savings' | 'Current';
  upiId?: string;
  qrCodeUrl?: string;
  isVerified?: boolean;
  updatedAt?: string;
}

export interface TeacherPartnerCourse {
  id: string;
  teacherId: string;
  teacherName: string;
  teacherAvatar?: string;
  teacherProfile?: TeacherPartnerProfile;
  teacherBankAccount?: TeacherBankAccountDetails;
  title: string;
  hindiTitle?: string;
  subtitle: string;
  category: CourseCategory;
  categoryLabel: string;
  k12Class?: string;
  k12Stream?: string;
  fullPriceInr: number;
  originalPriceInr: number;
  priceInr?: number;
  imageUrl: string;
  modules: CourseModule[];
  status: 'pending_approval' | 'approved' | 'rejected';
  rejectionReason?: string;
  submittedAt: string;
  approvedAt?: string;
}

export interface TeacherPartnerProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatarUrl: string;
  photoUrl?: string;
  qualification: string;
  subjectExpertise: string;
  subject?: string;
  experienceYears: number;
  experience?: string | number;
  bio: string;
  upiId: string;
  bankAccount?: TeacherBankAccountDetails;
  isApproved: boolean;
  registeredAt: string;
  coursesCount?: number;
  totalStudents?: number;
  totalEarningsInr?: number;
  royaltyPercent?: number;
}

export interface PartnerPayoutRecord {
  id: string;
  teacherId: string;
  teacherName: string;
  courseId?: string;
  courseTitle: string;
  studentName?: string;
  grossAmountInr: number;
  platformFeeInr: number;
  partnerShareInr: number;
  royaltyPct?: number;
  payoutMethod: 'Bank Transfer (NEFT/IMPS)' | 'Direct UPI' | 'UPI QR Scan';
  referenceId: string;
  status: 'Paid' | 'Processing' | 'Pending Settlement';
  periodLabel: string;
  paidAt: string;
  settledTo?: string;
  remarks?: string;
}

export interface PartnerNotification {
  id: string;
  teacherId: string | 'all';
  title: string;
  message: string;
  category:
    | 'payout'
    | 'course_approval'
    | 'course_rejection'
    | 'profile'
    | 'announcement';
  timestamp: string;
  readByTeacherIds: string[];
}

export interface LearnerState {
  user: UserAccount | null;
  siteConfig: SiteConfig;
  bankAccount: BankAccountConfig;
  apiConfig: ApiConnectionsConfig;
  courses: Course[];
  mcqSegments: McqSegment[];
  onlineTests: OnlineTest[];
  testSubmissions: OnlineTestSubmission[];
  studentAccessGrants: StudentAccessGrant[];
  pendingAccessRequests: PendingAccessRequest[];
  startupIdeas: StartupIdea[];
  goalConversations: GoalConversation[];
  studentGallery: StudentGalleryItem[];
  contactMessages: ContactMessage[];
  notifications: AppNotification[];
  unlockedModuleIds: string[];
  receipts: PurchaseReceipt[];
  mcqAttempts: McqAttemptRecord[];
  kidsXp: number;
  kidsStars: number;
  kidsStreak: number;
  unlockedBadges: string[];
  doubts: DoubtQuestion[];
  streakDays: number;
  teacherPartners?: TeacherPartnerProfile[];
  teacherPendingCourses?: TeacherPartnerCourse[];
  partnerPayouts?: PartnerPayoutRecord[];
  partnerNotifications?: PartnerNotification[];
}
