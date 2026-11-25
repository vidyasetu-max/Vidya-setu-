import React, { useState } from 'react';
import {
  Lightbulb,
  Target,
  Camera,
  ThumbsUp,
  Send,
  Image as ImageIcon,
  MessageCircle,
  Sparkles,
  User,
} from 'lucide-react';
import {
  GoalConversation,
  StartupIdea,
  StudentGalleryItem,
  StudyMedium,
  UserAccount,
} from '../types/education';

interface StudentHubViewProps {
  user: UserAccount | null;
  medium: StudyMedium;
  startupIdeas: StartupIdea[];
  goalConversations: GoalConversation[];
  studentGallery: StudentGalleryItem[];
  onOpenProfileModal: () => void;
  onAddStartupIdea: (idea: {
    title: string;
    domain: string;
    pitch: string;
    imageUrl?: string;
  }) => Promise<void>;
  onUpvoteIdea: (id: string) => Promise<void>;
  onAddGoalConversation: (post: {
    goalTag: string;
    message: string;
    imageUrl?: string;
  }) => Promise<void>;
  onReplyGoalConversation: (id: string, message: string) => Promise<void>;
  onAddGalleryPhoto: (item: {
    caption: string;
    imageUrl: string;
  }) => Promise<void>;
}

type HubTab = 'startup' | 'goals' | 'photos';

export const StudentHubView: React.FC<StudentHubViewProps> = ({
  user,
  medium,
  startupIdeas,
  goalConversations,
  studentGallery,
  onOpenProfileModal,
  onAddStartupIdea,
  onUpvoteIdea,
  onAddGoalConversation,
  onReplyGoalConversation,
  onAddGalleryPhoto,
}) => {
  const [activeTab, setActiveTab] = useState<HubTab>('startup');

  // Startup Idea Form
  const [ideaTitle, setIdeaTitle] = useState('');
  const [ideaDomain, setIdeaDomain] = useState('AI & EdTech');
  const [ideaPitch, setIdeaPitch] = useState('');
  const [ideaImage, setIdeaImage] = useState<string | undefined>(undefined);
  const [isSubmittingIdea, setIsSubmittingIdea] = useState(false);

  // Goal Conversation Form
  const [goalTag, setGoalTag] = useState(
    user?.targetExam || 'UPSC / SSC / Banking'
  );
  const [goalMessage, setGoalMessage] = useState('');
  const [goalImage, setGoalImage] = useState<string | undefined>(undefined);
  const [replyInputs, setReplyInputs] = useState<Record<string, string>>({});

  // Student Photo Gallery Form
  const [photoCaption, setPhotoCaption] = useState('');
  const [photoDataUrl, setPhotoDataUrl] = useState<string>('');

  const handleFileToDataUrl = (
    file: File | undefined,
    cb: (url: string) => void
  ) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        cb(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Top Banner */}
      <div className="bg-slate-900 text-white rounded-2xl p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-emerald-400">
            <Sparkles className="w-4 h-4" />
            <span>Student Innovation &amp; Career Community</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold mt-1">
            {medium === 'hi'
              ? 'Startup Ideas 💡, Goal Conversations & Student Photos'
              : 'Startup Ideas 💡, Goal Conversations & Student Photos'}
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-1">
            {medium === 'hi'
              ? 'Apna Startup Idea 💡 share karein, Goal conversation mein judein, aur apni Student Photo / Project images upload karein.'
              : 'Pitch your Startup Idea 💡, discuss your career goals with mentors & peers, and upload your student photos.'}
          </p>
        </div>

        <button
          type="button"
          onClick={onOpenProfileModal}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shrink-0 cursor-pointer"
        >
          <User className="w-4 h-4" />
          <span>{user ? 'Edit My Photo & Goal' : 'Upload My Photo & Goal'}</span>
        </button>
      </div>

      {/* 3 Sub-Tabs */}
      <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl overflow-x-auto">
        {[
          {
            id: 'startup',
            label: `Startup Ideas 💡 (${startupIdeas.length})`,
            icon: Lightbulb,
          },
          {
            id: 'goals',
            label: `Goal Conversations (${goalConversations.length})`,
            icon: Target,
          },
          {
            id: 'photos',
            label: `Student Photos & Images (${studentGallery.length})`,
            icon: Camera,
          },
        ].map((t) => {
          const Icon = t.icon;
          const active = activeTab === t.id;
          return (
            <button
              key={t.id}
              type="button"
              onClick={() => setActiveTab(t.id as HubTab)}
              className={`inline-flex items-center gap-2 px-4 py-2.5 text-xs font-bold rounded-lg whitespace-nowrap shrink-0 transition-colors cursor-pointer ${
                active
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Icon className="w-4 h-4 text-emerald-600" />
              <span>{t.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: STARTUP IDEAS 💡 */}
      {activeTab === 'startup' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Submit Startup Idea Form */}
          <form
            onSubmit={async (e) => {
              e.preventDefault();
              if (!ideaTitle.trim() || !ideaPitch.trim()) return;
              setIsSubmittingIdea(true);
              await onAddStartupIdea({
                title: ideaTitle.trim(),
                domain: ideaDomain,
                pitch: ideaPitch.trim(),
                imageUrl: ideaImage,
              });
              setIdeaTitle('');
              setIdeaPitch('');
              setIdeaImage(undefined);
              setIsSubmittingIdea(false);
            }}
            className="lg:col-span-5 bg-white border border-slate-200 rounded-2xl p-6 space-y-4 h-fit"
          >
            <div className="flex items-center gap-2">
              <Lightbulb className="w-5 h-5 text-amber-500" />
              <h2 className="text-base font-bold text-slate-900">
                Pitch Your Startup Idea 💡
              </h2>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Startup Idea Title *
              </label>
              <input
                type="text"
                required
                value={ideaTitle}
                onChange={(e) => setIdeaTitle(e.target.value)}
                placeholder="e.g. AI Krishi Mitra — Smart Crop Doctor"
                className="w-full px-3.5 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-600"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Startup Category / Domain
              </label>
              <select
                value={ideaDomain}
                onChange={(e) => setIdeaDomain(e.target.value)}
                className="w-full px-3 py-2 text-xs font-semibold border border-slate-200 rounded-xl bg-white"
              >
                <option value="AI & EdTech">AI &amp; EdTech</option>
                <option value="AgriTech & Rural">AgriTech &amp; Rural</option>
                <option value="FinTech & Payments">FinTech &amp; Payments</option>
                <option value="HealthTech">HealthTech</option>
                <option value="E-Commerce & D2C">E-Commerce &amp; D2C</option>
                <option value="Social Impact">Social Impact</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Problem &amp; Solution Pitch *
              </label>
              <textarea
                rows={4}
                required
                value={ideaPitch}
                onChange={(e) => setIdeaPitch(e.target.value)}
                placeholder="Aapka startup kis problem ko solve karta hai aur kaise kaam karega?"
                className="w-full px-3.5 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-600"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Upload Startup Idea / Prototype Image (Optional)
              </label>
              <label className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 rounded-xl cursor-pointer w-full justify-center">
                <ImageIcon className="w-4 h-4" />
                <span>{ideaImage ? 'Change Idea Image' : 'Upload Idea Image'}</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) =>
                    handleFileToDataUrl(e.target.files?.[0], setIdeaImage)
                  }
                  className="hidden"
                />
              </label>
              {ideaImage && (
                <img
                  src={ideaImage}
                  alt="Startup Idea Preview"
                  className="mt-2 h-28 w-full object-cover rounded-xl border border-slate-200"
                />
              )}
            </div>

            <button
              type="submit"
              disabled={isSubmittingIdea}
              className="w-full py-2.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl cursor-pointer"
            >
              {isSubmittingIdea ? 'Publishing...' : 'Publish Startup Idea 💡'}
            </button>
          </form>

          {/* Startup Ideas Feed */}
          <div className="lg:col-span-7 space-y-4">
            {startupIdeas.map((idea) => (
              <article
                key={idea.id}
                className="bg-white border border-slate-200 rounded-2xl p-5 space-y-3"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-full bg-emerald-600 text-white text-xs font-bold flex items-center justify-center overflow-hidden shrink-0">
                      {idea.studentAvatar ? (
                        <img
                          src={idea.studentAvatar}
                          alt={idea.studentName}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span>{idea.studentName.slice(0, 2).toUpperCase()}</span>
                      )}
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-900">
                        {idea.studentName}
                      </p>
                      <p className="text-[11px] text-slate-500">{idea.createdAt}</p>
                    </div>
                  </div>

                  <span className="px-2.5 py-1 text-[11px] font-bold bg-amber-50 text-amber-800 border border-amber-200 rounded-lg">
                    💡 {idea.domain}
                  </span>
                </div>

                <h3 className="text-base font-bold text-slate-900">{idea.title}</h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  {idea.pitch}
                </p>

                {idea.imageUrl && (
                  <img
                    src={idea.imageUrl}
                    alt={idea.title}
                    className="w-full max-h-60 object-cover rounded-xl border border-slate-200"
                  />
                )}

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => onUpvoteIdea(idea.id)}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border transition-colors cursor-pointer ${
                      idea.upvoted
                        ? 'bg-emerald-600 text-white border-emerald-600'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    <ThumbsUp className="w-3.5 h-3.5" />
                    <span>Support Idea ({idea.upvotes})</span>
                  </button>
                </div>
              </article>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: GOAL CONVERSATIONS 💬 */}
      {activeTab === 'goals' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Post Goal Conversation */}
          <form
            onSubmit={async (e) => {
              e.preventDefault();
              if (!goalMessage.trim()) return;
              await onAddGoalConversation({
                goalTag,
                message: goalMessage.trim(),
                imageUrl: goalImage,
              });
              setGoalMessage('');
              setGoalImage(undefined);
            }}
            className="lg:col-span-5 bg-white border border-slate-200 rounded-2xl p-6 space-y-4 h-fit"
          >
            <div className="flex items-center gap-2">
              <Target className="w-5 h-5 text-emerald-600" />
              <h2 className="text-base font-bold text-slate-900">
                Start a Goal Conversation 💬
              </h2>
            </div>

            {user?.bio && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-900">
                <strong>My Saved Goal:</strong> {user.bio}
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Goal / Target Track
              </label>
              <select
                value={goalTag}
                onChange={(e) => setGoalTag(e.target.value)}
                className="w-full px-3 py-2 text-xs font-semibold border border-slate-200 rounded-xl bg-white"
              >
                <option value="UPSC / SSC / Banking">UPSC / SSC / Banking</option>
                <option value="Class 9–12 Boards">Class 9–12 Boards</option>
                <option value="AI, Python & High-Salary Job">
                  AI, Python &amp; High-Salary Job
                </option>
                <option value="Startup Founder 💡">Startup Founder 💡</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Share Your Goal, Strategy or Question *
              </label>
              <textarea
                rows={4}
                required
                value={goalMessage}
                onChange={(e) => setGoalMessage(e.target.value)}
                placeholder="Apna study goal, daily target ya career sawaal likhein..."
                className="w-full px-3.5 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-600"
              />
            </div>

            <div>
              <label className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 rounded-xl cursor-pointer w-full justify-center">
                <ImageIcon className="w-4 h-4" />
                <span>
                  {goalImage ? 'Change Attached Image' : 'Attach Study / Goal Image'}
                </span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) =>
                    handleFileToDataUrl(e.target.files?.[0], setGoalImage)
                  }
                  className="hidden"
                />
              </label>
              {goalImage && (
                <img
                  src={goalImage}
                  alt="Goal Attachment"
                  className="mt-2 h-24 w-full object-cover rounded-xl border border-slate-200"
                />
              )}
            </div>

            <button
              type="submit"
              className="w-full py-2.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl cursor-pointer"
            >
              Post to Goal Conversation
            </button>
          </form>

          {/* Goal Conversation Threads */}
          <div className="lg:col-span-7 space-y-4">
            {goalConversations.map((conv) => (
              <div
                key={conv.id}
                className="bg-white border border-slate-200 rounded-2xl p-5 space-y-3"
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-slate-900 text-white text-xs font-bold flex items-center justify-center overflow-hidden">
                      {conv.studentAvatar ? (
                        <img
                          src={conv.studentAvatar}
                          alt={conv.studentName}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span>{conv.studentName.slice(0, 2).toUpperCase()}</span>
                      )}
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-900">
                        {conv.studentName}
                      </p>
                      <p className="text-[11px] text-slate-500">{conv.timestamp}</p>
                    </div>
                  </div>
                  <span className="px-2.5 py-0.5 text-[11px] font-bold bg-emerald-50 text-emerald-700 rounded-lg">
                    🎯 {conv.goalTag}
                  </span>
                </div>

                <p className="text-sm text-slate-800 leading-relaxed">
                  {conv.message}
                </p>

                {conv.imageUrl && (
                  <img
                    src={conv.imageUrl}
                    alt="Goal post"
                    className="w-full max-h-56 object-cover rounded-xl border border-slate-200"
                  />
                )}

                {/* Replies */}
                {conv.replies.length > 0 && (
                  <div className="pl-3 border-l-2 border-emerald-200 space-y-2 pt-1">
                    {conv.replies.map((rep) => (
                      <div
                        key={rep.id}
                        className="p-2.5 bg-slate-50 rounded-xl text-xs space-y-0.5"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-slate-900">
                            {rep.authorName}{' '}
                            <span className="text-[10px] font-semibold text-emerald-700">
                              ({rep.authorRole})
                            </span>
                          </span>
                          <span className="text-[10px] text-slate-400">
                            {rep.timestamp}
                          </span>
                        </div>
                        <p className="text-slate-700">{rep.message}</p>
                      </div>
                    ))}
                  </div>
                )}

                {/* Reply Input */}
                <form
                  onSubmit={async (e) => {
                    e.preventDefault();
                    const text = replyInputs[conv.id]?.trim();
                    if (!text) return;
                    await onReplyGoalConversation(conv.id, text);
                    setReplyInputs((prev) => ({ ...prev, [conv.id]: '' }));
                  }}
                  className="flex items-center gap-2 pt-1"
                >
                  <MessageCircle className="w-4 h-4 text-slate-400 shrink-0" />
                  <input
                    type="text"
                    value={replyInputs[conv.id] || ''}
                    onChange={(e) =>
                      setReplyInputs((prev) => ({
                        ...prev,
                        [conv.id]: e.target.value,
                      }))
                    }
                    placeholder="Reply to this goal conversation..."
                    className="flex-1 px-3 py-1.5 text-xs border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-600"
                  />
                  <button
                    type="submit"
                    className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl inline-flex items-center gap-1 cursor-pointer"
                  >
                    <Send className="w-3 h-3" />
                    <span>Reply</span>
                  </button>
                </form>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: STUDENT PHOTOS & IMAGES GALLERY 📸 */}
      {activeTab === 'photos' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <form
            onSubmit={async (e) => {
              e.preventDefault();
              if (!photoDataUrl) return;
              await onAddGalleryPhoto({
                caption: photoCaption.trim() || 'Student Study & Project Photo',
                imageUrl: photoDataUrl,
              });
              setPhotoCaption('');
              setPhotoDataUrl('');
            }}
            className="lg:col-span-4 bg-white border border-slate-200 rounded-2xl p-6 space-y-4 h-fit"
          >
            <div className="flex items-center gap-2">
              <Camera className="w-5 h-5 text-emerald-600" />
              <h2 className="text-base font-bold text-slate-900">
                Upload Student Photo / Image
              </h2>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Select Photo / Study Image *
              </label>
              <label className="inline-flex items-center gap-2 px-3.5 py-2.5 text-xs font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 rounded-xl cursor-pointer w-full justify-center">
                <ImageIcon className="w-4 h-4" />
                <span>{photoDataUrl ? 'Change Photo' : 'Choose Photo (.jpg / .png)'}</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) =>
                    handleFileToDataUrl(e.target.files?.[0], setPhotoDataUrl)
                  }
                  className="hidden"
                />
              </label>
              {photoDataUrl && (
                <img
                  src={photoDataUrl}
                  alt="Preview"
                  className="mt-2 h-36 w-full object-cover rounded-xl border border-slate-200"
                />
              )}
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Caption / Description
              </label>
              <input
                type="text"
                value={photoCaption}
                onChange={(e) => setPhotoCaption(e.target.value)}
                placeholder="e.g. My Class 12 Physics Notes / Startup Team"
                className="w-full px-3.5 py-2 text-sm border border-slate-200 rounded-xl"
              />
            </div>

            <button
              type="submit"
              disabled={!photoDataUrl}
              className="w-full py-2.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-300 rounded-xl cursor-pointer"
            >
              Upload Photo to Gallery
            </button>
          </form>

          <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {studentGallery.map((item) => (
              <div
                key={item.id}
                className="bg-white border border-slate-200 rounded-2xl overflow-hidden"
              >
                <img
                  src={item.imageUrl}
                  alt={item.caption}
                  className="w-full h-48 object-cover"
                />
                <div className="p-4">
                  <p className="text-sm font-bold text-slate-900">{item.caption}</p>
                  <p className="text-xs text-slate-500 mt-0.5">
                    By {item.studentName} • {item.uploadedAt}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
