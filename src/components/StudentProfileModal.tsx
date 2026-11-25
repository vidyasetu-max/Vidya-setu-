import React, { useState } from 'react';
import {
  X,
  User,
  CheckCircle2,
  Camera,
  MapPin,
  GraduationCap,
  BookOpen,
  LogOut,
  Receipt,
  Check,
  Layers,
  ShieldCheck,
} from 'lucide-react';
import {
  Course,
  PurchaseReceipt,
  StudyMedium,
  UserAccount,
} from '../types/education';

interface StudentProfileModalProps {
  user: UserAccount | null;
  medium: StudyMedium;
  unlockedCount: number;
  testsTakenCount: number;
  receipts?: PurchaseReceipt[];
  courses?: Course[];
  unlockedModuleIds?: string[];
  onClose: () => void;
  onSaveProfile: (profile: {
    name: string;
    method: 'gmail' | 'mobile';
    identifier: string;
    targetExam: string;
    preferredMedium: StudyMedium;
    city: string;
    bio: string;
    avatarUrl?: string;
  }) => Promise<void>;
  onLogout: () => Promise<void>;
}

const TARGET_EXAMS = [
  'Class 9–12 Boards (CBSE / State)',
  'UPSC CSE (Prelims & Mains)',
  'SSC CGL / CHSL / GD',
  'Banking (IBPS / SBI PO & Clerk)',
  'High-Salary AI, Python & Digital Marketing',
  'Future Kids (Ages 6–14)',
];

export const StudentProfileModal: React.FC<StudentProfileModalProps> = ({
  user,
  medium,
  unlockedCount,
  testsTakenCount,
  receipts = [],
  courses = [],
  unlockedModuleIds = [],
  onClose,
  onSaveProfile,
  onLogout,
}) => {
  const [activeTab, setActiveTab] = useState<'profile' | 'receipts'>('profile');
  const [name, setName] = useState(user?.name || '');
  const [method, setMethod] = useState<'gmail' | 'mobile'>(user?.method || 'gmail');
  const [identifier, setIdentifier] = useState(user?.identifier || '');
  const [targetExam, setTargetExam] = useState(
    user?.targetExam || TARGET_EXAMS[0]
  );
  const [preferredMedium, setPreferredMedium] = useState<StudyMedium>(
    user?.preferredMedium || medium
  );
  const [city, setCity] = useState(user?.city || '');
  const [bio, setBio] = useState(user?.bio || '');
  const [avatarUrl, setAvatarUrl] = useState<string | undefined>(user?.avatarUrl);
  const [isSaving, setIsSaving] = useState(false);
  const [savedToast, setSavedToast] = useState(false);

  const unlockedCourses = courses.filter((course) =>
    course.modules.some((m) => unlockedModuleIds.includes(m.id))
  );

  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setAvatarUrl(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !identifier.trim()) return;
    setIsSaving(true);
    await onSaveProfile({
      name: name.trim(),
      method,
      identifier: identifier.trim(),
      targetExam,
      preferredMedium,
      city: city.trim(),
      bio: bio.trim(),
      avatarUrl,
    });
    setIsSaving(false);
    setSavedToast(true);
    setTimeout(() => {
      setSavedToast(false);
      onClose();
    }, 900);
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-slate-900/60 flex items-center justify-center p-4 overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-labelledby="student-profile-title"
    >
      <div className="bg-white border border-slate-200 rounded-2xl max-w-lg w-full overflow-hidden my-8">
        {/* Header */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <User className="w-5 h-5 text-emerald-400" />
            <div>
              <h2 id="student-profile-title" className="text-base font-bold">
                {user
                  ? medium === 'hi'
                    ? 'Aapki Student Profile'
                    : 'Your Student Profile'
                  : medium === 'hi'
                  ? 'Nayi Student Profile Banayein'
                  : 'Create Your Student Profile'}
              </h2>
              <p className="text-[11px] text-slate-300">
                {medium === 'hi'
                  ? 'Apna naam, target exam, medium aur photo save karein'
                  : 'Save your name, target exam, study medium & photo'}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close profile modal"
            className="p-1.5 text-slate-300 hover:text-white rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 2-Tab Switcher: Profile Details | Receipts & Unlocked Courses */}
        <div className="grid grid-cols-2 border-b border-slate-200 bg-slate-50 text-xs font-bold">
          <button
            type="button"
            onClick={() => setActiveTab('profile')}
            className={`py-3 px-4 flex items-center justify-center gap-1.5 border-b-2 transition-colors cursor-pointer ${
              activeTab === 'profile'
                ? 'border-emerald-600 text-emerald-700 bg-white'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <User className="w-3.5 h-3.5" />
            <span>{medium === 'hi' ? 'Profile Details' : 'Profile Details'}</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('receipts')}
            className={`py-3 px-4 flex items-center justify-center gap-1.5 border-b-2 transition-colors cursor-pointer ${
              activeTab === 'receipts'
                ? 'border-emerald-600 text-emerald-700 bg-white'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <Receipt className="w-3.5 h-3.5" />
            <span>
              {medium === 'hi'
                ? `Receipts & Courses (${receipts.length})`
                : `Receipts & Courses (${receipts.length})`}
            </span>
          </button>
        </div>

        {activeTab === 'receipts' ? (
          <div className="p-6 space-y-5 max-h-[68vh] overflow-y-auto">
            {/* Unlocked Courses & Chapters Summary */}
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Unlocked Courses & Chapters ({unlockedCount})</span>
                </h3>
              </div>
              {unlockedCourses.length === 0 ? (
                <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-500 text-center">
                  {medium === 'hi'
                    ? 'Abhi koi paid chapter unlock nahi hua hai. Free preview chapters available hain!'
                    : 'No paid chapters unlocked yet. Explore courses to unlock chapters!'}
                </div>
              ) : (
                <div className="space-y-2">
                  {unlockedCourses.map((course) => {
                    const unlockedMods = course.modules.filter((m) =>
                      unlockedModuleIds.includes(m.id)
                    );
                    return (
                      <div
                        key={course.id}
                        className="p-3 bg-emerald-50/60 border border-emerald-200 rounded-xl space-y-1.5"
                      >
                        <div className="flex items-center justify-between gap-2">
                          <p className="text-xs font-bold text-slate-900">
                            {course.title}
                          </p>
                          <span className="text-[11px] font-bold text-emerald-700 bg-white px-2 py-0.5 rounded-md border border-emerald-200">
                            {unlockedMods.length}/{course.modules.length} Chapters
                          </span>
                        </div>
                        <div className="flex flex-wrap gap-1.5">
                          {unlockedMods.map((mod) => (
                            <span
                              key={mod.id}
                              className="inline-flex items-center gap-1 text-[11px] text-slate-700 bg-white px-2 py-0.5 rounded border border-slate-200"
                            >
                              <Check className="w-3 h-3 text-emerald-600" />
                              {mod.title}
                            </span>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Payment Receipts History */}
            <div className="space-y-2.5">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                <Receipt className="w-3.5 h-3.5 text-emerald-600" />
                <span>Payment Receipts History ({receipts.length})</span>
              </h3>
              {receipts.length === 0 ? (
                <div className="p-5 bg-slate-50 border border-slate-200 rounded-xl text-center space-y-1">
                  <p className="text-xs font-semibold text-slate-700">
                    {medium === 'hi'
                      ? 'Koi payment receipt nahi mili'
                      : 'No payment receipts yet'}
                  </p>
                  <p className="text-[11px] text-slate-500">
                    {medium === 'hi'
                      ? 'Jab aap koi course ya chapter unlock karenge, aapki receipt yahan save hogi.'
                      : 'When you unlock a course or chapter, your transaction receipt will appear here.'}
                  </p>
                </div>
              ) : (
                <div className="space-y-2.5">
                  {receipts.map((rec) => (
                    <div
                      key={rec.id}
                      className="p-3.5 bg-white border border-slate-200 rounded-xl space-y-2"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <p className="text-xs font-bold text-slate-900">
                            {rec.courseTitle}
                          </p>
                          <p className="text-[11px] text-slate-500 font-mono-tabular">
                            TXN: {rec.transactionId} • {rec.date}
                          </p>
                        </div>
                        <span className="text-sm font-bold text-emerald-700 font-mono-tabular">
                          ₹{rec.amountPaidInr}
                        </span>
                      </div>
                      <div className="flex flex-wrap items-center justify-between gap-2 pt-1.5 border-t border-slate-100 text-[11px] text-slate-600">
                        <span>
                          {rec.purchaseType} ({rec.moduleTitles.length} chapters)
                        </span>
                        <span className="font-semibold text-slate-800">
                          {rec.paymentMethod}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        ) : (
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Avatar & Quick Stats */}
          <div className="flex items-center justify-between gap-4 p-3.5 bg-slate-50 border border-slate-200 rounded-xl">
            <div className="flex items-center gap-3.5">
              <div className="relative w-14 h-14 rounded-2xl bg-emerald-600 text-white flex items-center justify-center font-bold text-lg overflow-hidden shrink-0">
                {avatarUrl ? (
                  <img
                    src={avatarUrl}
                    alt={name || 'Student'}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span>{(name || 'S').slice(0, 2).toUpperCase()}</span>
                )}
              </div>
              <div>
                <label className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 rounded-lg cursor-pointer">
                  <Camera className="w-3.5 h-3.5" />
                  <span>{avatarUrl ? 'Change Photo' : 'Upload Photo'}</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarUpload}
                    className="hidden"
                  />
                </label>
                <p className="text-[11px] text-slate-500 mt-1">
                  {user?.isAdmin ? 'Owner / Admin Account' : 'Student Learner'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 text-center">
              <div className="px-2.5 py-1 bg-white border border-slate-200 rounded-lg">
                <p className="text-xs font-bold text-slate-900 font-mono-tabular">
                  {unlockedCount}
                </p>
                <p className="text-[10px] text-slate-500">Chapters</p>
              </div>
              <div className="px-2.5 py-1 bg-white border border-slate-200 rounded-lg">
                <p className="text-xs font-bold text-emerald-700 font-mono-tabular">
                  {testsTakenCount}
                </p>
                <p className="text-[10px] text-slate-500">Tests</p>
              </div>
            </div>
          </div>

          {/* Full Name */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Full Name *
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Priya Sharma"
              className="w-full px-3.5 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-600"
            />
          </div>

          {/* Contact Method + Identifier */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Login Type
              </label>
              <select
                value={method}
                onChange={(e) => setMethod(e.target.value as 'gmail' | 'mobile')}
                className="w-full px-3 py-2 text-xs font-semibold border border-slate-200 rounded-xl bg-white"
              >
                <option value="gmail">Gmail ID</option>
                <option value="mobile">Mobile (+91)</option>
              </select>
            </div>
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {method === 'gmail' ? 'Gmail ID *' : 'Mobile Number *'}
              </label>
              <input
                type={method === 'gmail' ? 'email' : 'tel'}
                required
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                placeholder={
                  method === 'gmail' ? 'student@gmail.com' : '+91 9876543210'
                }
                className="w-full px-3.5 py-2 text-sm border border-slate-200 rounded-xl font-mono-tabular focus:outline-none focus:border-emerald-600"
              />
            </div>
          </div>

          {/* Target Exam / Class & Preferred Medium */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                <span className="inline-flex items-center gap-1">
                  <GraduationCap className="w-3.5 h-3.5 text-emerald-600" />
                  Class / Target Exam
                </span>
              </label>
              <select
                value={targetExam}
                onChange={(e) => setTargetExam(e.target.value)}
                className="w-full px-3 py-2 text-xs font-semibold border border-slate-200 rounded-xl bg-white"
              >
                {TARGET_EXAMS.map((ex) => (
                  <option key={ex} value={ex}>
                    {ex}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                <span className="inline-flex items-center gap-1">
                  <BookOpen className="w-3.5 h-3.5 text-emerald-600" />
                  Study Medium
                </span>
              </label>
              <select
                value={preferredMedium}
                onChange={(e) => setPreferredMedium(e.target.value as StudyMedium)}
                className="w-full px-3 py-2 text-xs font-semibold border border-slate-200 rounded-xl bg-white"
              >
                <option value="hi">Hindi / Hinglish Medium</option>
                <option value="en">English Medium</option>
              </select>
            </div>
          </div>

          {/* City & Bio */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                <span className="inline-flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                  City / State
                </span>
              </label>
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="e.g. Patna, Bihar"
                className="w-full px-3.5 py-2 text-sm border border-slate-200 rounded-xl"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Your Learning Goal
              </label>
              <input
                type="text"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="e.g. Crack UPSC 2027 / 95% in 12th"
                className="w-full px-3.5 py-2 text-sm border border-slate-200 rounded-xl"
              />
            </div>
          </div>

          {savedToast && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs font-bold text-emerald-800 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Student Profile Saved Successfully!</span>
            </div>
          )}

          <div className="flex items-center gap-2 pt-2">
            {user && (
              <button
                type="button"
                onClick={async () => {
                  await onLogout();
                  onClose();
                }}
                className="px-4 py-2.5 text-xs font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 rounded-xl inline-flex items-center gap-1.5 cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
                <span>Sign Out</span>
              </button>
            )}
            <button
              type="submit"
              disabled={isSaving}
              className="flex-1 py-2.5 px-4 text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-400 rounded-xl transition-colors cursor-pointer"
            >
              {isSaving
                ? 'Saving Profile...'
                : user
                ? 'Save Profile Changes'
                : 'Create & Save Profile'}
            </button>
          </div>

          {user?.isAdmin && (
            <div className="pt-2 border-t border-slate-200">
              <button
                type="button"
                onClick={() => {
                  window.location.href = '/admin';
                }}
                className="w-full py-2.5 px-4 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-xl inline-flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Open Standalone Admin Web App</span>
              </button>
            </div>
          )}
        </form>
        )}
      </div>
    </div>
  );
};
