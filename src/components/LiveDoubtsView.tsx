import React, { useState } from 'react';
import { Users, Send, ThumbsUp, CheckCircle2, Clock, Presentation } from 'lucide-react';
import { DoubtSession, DoubtQuestion } from '../types/education';

interface LiveDoubtsViewProps {
  sessions: DoubtSession[];
  doubts: DoubtQuestion[];
  onSubmitDoubt: (payload: {
    sessionId: string;
    studentName: string;
    topicTag: string;
    questionText: string;
  }) => Promise<void>;
  onUpvoteDoubt: (doubtId: string) => void;
}

export const LiveDoubtsView: React.FC<LiveDoubtsViewProps> = ({
  sessions,
  doubts,
  onSubmitDoubt,
  onUpvoteDoubt,
}) => {
  const [activeSessionId, setActiveSessionId] = useState(sessions[0].id);
  const [studentName, setStudentName] = useState('');
  const [topicTag, setTopicTag] = useState('');
  const [questionText, setQuestionText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const activeSession =
    sessions.find((s) => s.id === activeSessionId) || sessions[0];
  const sessionDoubts = doubts.filter((d) => d.sessionId === activeSession.id);

  const handleAskDoubt = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!questionText.trim()) return;
    setIsSubmitting(true);
    await onSubmitDoubt({
      sessionId: activeSession.id,
      studentName: studentName.trim() || 'Student',
      topicTag: topicTag.trim() || activeSession.subject,
      questionText: questionText.trim(),
    });
    setQuestionText('');
    setTopicTag('');
    setIsSubmitting(false);
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
          Live Doubt Solving Sessions
        </h1>
        <p className="text-sm text-slate-600 mt-1">
          Join active faculty doubt clinics, inspect live concept boards, and post your questions
          to the mentor queue.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Session Rooms */}
        <div className="lg:col-span-4 space-y-3">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Active &amp; Upcoming Clinics
          </h2>
          {sessions.map((sess) => {
            const isSelected = sess.id === activeSession.id;
            return (
              <button
                key={sess.id}
                type="button"
                onClick={() => setActiveSessionId(sess.id)}
                className={`w-full p-4 rounded-xl border text-left transition-colors space-y-2 ${
                  isSelected
                    ? 'bg-white border-indigo-700 ring-1 ring-indigo-700'
                    : 'bg-white border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-indigo-700">{sess.subject}</span>
                  <span
                    className={`font-semibold ${
                      sess.isLiveNow ? 'text-emerald-700' : 'text-slate-500'
                    }`}
                  >
                    {sess.isLiveNow ? 'Live Now' : 'Scheduled'}
                  </span>
                </div>

                <p className="text-sm font-bold text-slate-900 leading-snug">
                  {sess.title}
                </p>

                <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
                  <span>{sess.mentor}</span>
                  <span className="inline-flex items-center gap-1 font-mono-tabular">
                    <Users className="w-3.5 h-3.5" />
                    {sess.activeStudents}
                  </span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Right Column: Live Whiteboard + Q&A Queue */}
        <div className="lg:col-span-8 space-y-6">
          {/* Live Concept Board */}
          <div className="bg-slate-900 text-white rounded-xl p-6 sm:p-8 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-slate-300">
              <span className="inline-flex items-center gap-1.5 font-semibold text-emerald-400">
                <Presentation className="w-4 h-4" />
                Live Mentor Whiteboard · {activeSession.mentor}
              </span>
              <span className="font-mono-tabular">{activeSession.scheduleTime}</span>
            </div>

            <h2 className="text-xl font-bold text-white">
              {activeSession.currentSlideTitle}
            </h2>

            <div className="p-4 bg-slate-800 border border-slate-700 rounded-lg font-mono-tabular text-sm text-indigo-200">
              {activeSession.currentSlideFormula}
            </div>

            <p className="text-sm text-slate-300 leading-relaxed">
              {activeSession.currentSlideNotes}
            </p>
          </div>

          {/* Ask a Doubt Form */}
          <form
            onSubmit={handleAskDoubt}
            className="bg-white border border-slate-200 rounded-xl p-6 space-y-4"
          >
            <h3 className="text-base font-bold text-slate-900">
              Post a Doubt to {activeSession.mentor}
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <input
                type="text"
                value={studentName}
                onChange={(e) => setStudentName(e.target.value)}
                placeholder="Your Name (optional)"
                aria-label="Your Name"
                className="px-3.5 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:border-indigo-600"
              />
              <input
                type="text"
                value={topicTag}
                onChange={(e) => setTopicTag(e.target.value)}
                placeholder="Topic (e.g. Article 368, Gauss Law)"
                aria-label="Topic"
                className="px-3.5 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:border-indigo-600"
              />
            </div>

            <textarea
              rows={2}
              value={questionText}
              onChange={(e) => setQuestionText(e.target.value)}
              placeholder="Type your question clearly..."
              aria-label="Your doubt question"
              required
              className="w-full px-3.5 py-2.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:border-indigo-600"
            />

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={isSubmitting || !questionText.trim()}
                className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-semibold text-white bg-indigo-700 hover:bg-indigo-800 disabled:bg-slate-300 rounded-lg transition-colors"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{isSubmitting ? 'Posting...' : 'Submit Doubt'}</span>
              </button>
            </div>
          </form>

          {/* Live Q&A Queue */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-slate-900">
              Live Doubt Queue ({sessionDoubts.length})
            </h3>

            {sessionDoubts.length === 0 ? (
              <div className="bg-white border border-slate-200 rounded-xl p-8 text-center text-sm text-slate-500">
                No doubts posted in this session yet. Be the first to ask!
              </div>
            ) : (
              sessionDoubts.map((q) => (
                <div
                  key={q.id}
                  className="bg-white border border-slate-200 rounded-xl p-5 space-y-3"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-xs text-slate-500">
                        <span className="font-semibold text-slate-800">{q.studentName}</span>
                        <span aria-hidden="true">·</span>
                        <span className="text-indigo-700 font-medium">{q.topicTag}</span>
                        <span aria-hidden="true">·</span>
                        <span>{q.timestamp}</span>
                      </div>
                      <p className="text-sm font-semibold text-slate-900 leading-relaxed">
                        {q.questionText}
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => onUpvoteDoubt(q.id)}
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-bold font-mono-tabular transition-colors shrink-0 ${
                        q.upvoted
                          ? 'bg-indigo-50 border-indigo-300 text-indigo-700'
                          : 'bg-slate-50 border-slate-200 text-slate-700 hover:border-slate-300'
                      }`}
                    >
                      <ThumbsUp className="w-3.5 h-3.5" />
                      <span>{q.upvotes}</span>
                    </button>
                  </div>

                  {q.mentorReply ? (
                    <div className="p-3.5 bg-emerald-50/60 border border-emerald-200 rounded-lg text-xs text-slate-800 space-y-1">
                      <div className="flex items-center gap-1.5 font-bold text-emerald-800">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Mentor Answer ({activeSession.mentor})</span>
                      </div>
                      <p className="leading-relaxed">{q.mentorReply}</p>
                    </div>
                  ) : (
                    <div className="inline-flex items-center gap-1.5 text-xs font-medium text-amber-700">
                      <Clock className="w-3.5 h-3.5" />
                      <span>In Mentor Queue</span>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
