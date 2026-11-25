import React, { useState } from 'react';
import { X, Bell, CheckCheck, Send } from 'lucide-react';
import { AppNotification, StudyMedium } from '../types/education';

interface NotificationModalProps {
  notifications: AppNotification[];
  medium: StudyMedium;
  onClose: () => void;
  onMarkAllRead: () => Promise<void>;
  onSendBroadcast: (payload: { title: string; message: string }) => Promise<void>;
}

export const NotificationModal: React.FC<NotificationModalProps> = ({
  notifications,
  medium,
  onClose,
  onMarkAllRead,
  onSendBroadcast,
}) => {
  const [broadcastTitle, setBroadcastTitle] = useState('');
  const [broadcastMsg, setBroadcastMsg] = useState('');
  const [isSending, setIsSending] = useState(false);

  const handleBroadcast = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!broadcastTitle.trim() || !broadcastMsg.trim()) return;
    setIsSending(true);
    await onSendBroadcast({
      title: broadcastTitle.trim(),
      message: broadcastMsg.trim(),
    });
    setBroadcastTitle('');
    setBroadcastMsg('');
    setIsSending(false);
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-slate-900/60 flex items-center justify-center p-4 overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-labelledby="notifications-modal-title"
    >
      <div className="bg-white border border-slate-200 rounded-2xl max-w-lg w-full overflow-hidden my-8">
        {/* Header */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bell className="w-5 h-5 text-emerald-400" />
            <h2 id="notifications-modal-title" className="text-base font-bold">
              {medium === 'hi'
                ? 'Student Notifications & Live Alerts'
                : 'Student Notifications & Live Alerts'}
            </h2>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onMarkAllRead}
              className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-emerald-300 hover:text-white bg-slate-800 rounded-lg transition-colors cursor-pointer"
            >
              <CheckCheck className="w-3.5 h-3.5" />
              <span>Mark Read</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close notifications"
              className="p-1.5 text-slate-300 hover:text-white rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Notifications List */}
        <div className="p-6 space-y-4 max-h-[55vh] overflow-y-auto">
          {notifications.length === 0 ? (
            <p className="text-sm text-slate-500 text-center py-6">
              No notifications yet.
            </p>
          ) : (
            notifications.map((n) => (
              <div
                key={n.id}
                className={`p-4 rounded-xl border transition-colors space-y-1 ${
                  n.read
                    ? 'bg-white border-slate-200'
                    : 'bg-emerald-50/50 border-emerald-200'
                }`}
              >
                <div className="flex items-center justify-between text-[11px] text-slate-500">
                  <span className="font-semibold text-emerald-700 uppercase">
                    {n.category}
                  </span>
                  <span className="font-mono-tabular">{n.timestamp}</span>
                </div>
                <p className="text-sm font-bold text-slate-900">
                  {medium === 'hi' ? n.hindiTitle : n.title}
                </p>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {medium === 'hi' ? n.hindiMessage : n.message}
                </p>
              </div>
            ))
          )}
        </div>

        {/* Broadcast Notification to Every User */}
        <form
          onSubmit={handleBroadcast}
          className="px-6 py-4 bg-slate-50 border-t border-slate-200 space-y-3"
        >
          <p className="text-xs font-bold text-slate-800">
            {medium === 'hi'
              ? 'Send Notification to Every User (Broadcast)'
              : 'Send Notification to Every User (Broadcast)'}
          </p>
          <input
            type="text"
            value={broadcastTitle}
            onChange={(e) => setBroadcastTitle(e.target.value)}
            placeholder="Notification Title (e.g. New Physics Class Live)"
            required
            className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-emerald-600"
          />
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={broadcastMsg}
              onChange={(e) => setBroadcastMsg(e.target.value)}
              placeholder="Message for all students..."
              required
              className="flex-1 px-3 py-2 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-emerald-600"
            />
            <button
              type="submit"
              disabled={isSending}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition-colors whitespace-nowrap cursor-pointer"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{isSending ? 'Sending...' : 'Send All'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
