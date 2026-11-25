import React, { useState, useEffect, useCallback } from 'react';
import {
  ApiConnectionsConfig,
  BankAccountConfig,
  Course,
  LearnerState,
  McqSegment,
  OnlineTest,
  SiteConfig,
} from './types/education';
import { AdminStandaloneApp } from './components/AdminStandaloneApp';

const ADMIN_CACHE_KEY = 'vidyasetu_admin_state_v1';
const ADMIN_TOKEN_KEY = 'vidyasetu_admin_token';

function readStoredAdminToken(): string {
  try {
    return sessionStorage.getItem(ADMIN_TOKEN_KEY) || '';
  } catch {
    return '';
  }
}

function readCachedAdminState(): LearnerState | null {
  try {
    const raw = sessionStorage.getItem(ADMIN_CACHE_KEY);
    return raw ? (JSON.parse(raw) as LearnerState) : null;
  } catch {
    return null;
  }
}

function writeCachedAdminState(state: LearnerState) {
  try {
    sessionStorage.setItem(ADMIN_CACHE_KEY, JSON.stringify(state));
  } catch {
    // Ignore storage quota errors
  }
}

interface AdminRootAppProps {
  onBackToStudentApp?: () => void;
}

export const AdminRootApp: React.FC<AdminRootAppProps> = ({
  onBackToStudentApp,
}) => {
  const [learnerState, setLearnerState] = useState<LearnerState | null>(() =>
    readCachedAdminState()
  );
  const [loading, setLoading] = useState(() => !readCachedAdminState());
  const [adminToken, setAdminToken] = useState<string>(() =>
    readStoredAdminToken()
  );
  const [localOwnerAuthed, setLocalOwnerAuthed] = useState(() => {
    try {
      return (
        sessionStorage.getItem('vidyasetu_admin_logged_in') === 'true' &&
        Boolean(sessionStorage.getItem(ADMIN_TOKEN_KEY))
      );
    } catch {
      return false;
    }
  });

  const clearAdminSession = useCallback(() => {
    setLocalOwnerAuthed(false);
    setAdminToken('');
    try {
      sessionStorage.removeItem('vidyasetu_admin_logged_in');
      sessionStorage.removeItem(ADMIN_TOKEN_KEY);
    } catch {}
  }, []);

  const fetchState = useCallback(async () => {
    const token = readStoredAdminToken();
    try {
      if (token) {
        const sessionRes = await fetch('/api/portal-auth/admin-session', {
          headers: { 'x-admin-token': token },
          cache: 'no-store',
        });
        if (sessionRes.ok) {
          const sessionData = await sessionRes.json();
          if (!sessionData.authenticated) {
            clearAdminSession();
          }
        }
      } else {
        clearAdminSession();
      }

      const res = await fetch('/api/state', {
        headers: token ? { 'x-admin-token': token } : undefined,
        cache: 'no-store',
      });
      if (res.ok) {
        const data = await res.json();
        const nextState: LearnerState | null =
          data?.state || (Array.isArray(data?.unlockedModuleIds) ? data : null);
        if (nextState) {
          setLearnerState(nextState);
          writeCachedAdminState(nextState);
        }
      }
    } finally {
      setLoading(false);
    }
  }, [clearAdminSession]);

  useEffect(() => {
    fetchState();
  }, [fetchState]);

  const postAndSync = async (url: string, body?: unknown) => {
    const token = adminToken || readStoredAdminToken();
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { 'x-admin-token': token } : {}),
      },
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });
    if (!res.ok) {
      if (res.status === 403 && url.startsWith('/api/admin')) {
        clearAdminSession();
      }
      let errMsg = `Request failed (${res.status})`;
      try {
        const errData = await res.json();
        if (errData?.error) errMsg = errData.error;
      } catch {}
      throw new Error(errMsg);
    }
    const data = await res.json();
    if (data?.state) {
      setLearnerState(data.state);
      writeCachedAdminState(data.state);
    }
    return data;
  };

  const deleteAndSync = async (url: string) => {
    const token = adminToken || readStoredAdminToken();
    const res = await fetch(url, {
      method: 'DELETE',
      headers: token ? { 'x-admin-token': token } : undefined,
    });
    if (!res.ok) {
      if (res.status === 403 && url.startsWith('/api/admin')) {
        clearAdminSession();
      }
      let errMsg = `Delete failed (${res.status})`;
      try {
        const errData = await res.json();
        if (errData?.error) errMsg = errData.error;
      } catch {}
      throw new Error(errMsg);
    }
    const data = await res.json();
    if (data?.state) {
      setLearnerState(data.state);
      writeCachedAdminState(data.state);
    }
    return data;
  };

  if (loading || !learnerState) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white font-bold text-sm flex items-center justify-center animate-pulse">
          VS
        </div>
        <p className="text-xs font-semibold text-slate-300">
          Loading Admin Control Center...
        </p>
      </div>
    );
  }

  let partnerSessionActive = false;
  try {
    partnerSessionActive =
      sessionStorage.getItem('vidyasetu_partner_logged_in') === 'true';
  } catch {}

  const isAdmin = Boolean(localOwnerAuthed && adminToken && !partnerSessionActive);

  return (
    <AdminStandaloneApp
      learnerState={learnerState}
      isAdmin={isAdmin}
      onLoginOwner={async (payload) => {
        await postAndSync('/api/login', payload);
      }}
      onAuthSuccessState={(nextState, nextToken) => {
        const resolvedToken = nextToken || readStoredAdminToken();
        if (resolvedToken) {
          setAdminToken(resolvedToken);
          setLocalOwnerAuthed(true);
          try {
            sessionStorage.setItem('vidyasetu_admin_logged_in', 'true');
            sessionStorage.setItem(ADMIN_TOKEN_KEY, resolvedToken);
          } catch {}
        }
        if (nextState) {
          setLearnerState(nextState);
          writeCachedAdminState(nextState);
        } else {
          fetchState();
        }
      }}
      onLogout={async () => {
        const token = adminToken || readStoredAdminToken();
        clearAdminSession();
        try {
          await fetch('/api/portal-auth/admin-logout', {
            method: 'POST',
            headers: token ? { 'x-admin-token': token } : undefined,
          });
        } catch {}
      }}
      onSwitchToStudentApp={() => {
        if (onBackToStudentApp) {
          onBackToStudentApp();
        } else {
          window.location.href = '/';
        }
      }}
      onSaveSiteConfig={async (updates: Partial<SiteConfig>) => {
        await postAndSync('/api/admin/site-config', updates);
      }}
      onSaveBankAccount={async (updates: Partial<BankAccountConfig>) => {
        await postAndSync('/api/admin/bank-account', updates);
      }}
      onSaveApiConfig={async (updates: Partial<ApiConnectionsConfig>) => {
        await postAndSync('/api/admin/api-config', updates);
      }}
      onSaveCourse={async (course: Course) => {
        await postAndSync('/api/admin/courses', course);
      }}
      onRestoreBackup={async (backupState: LearnerState) => {
        await postAndSync('/api/admin/restore', backupState);
      }}
      onAutoSequenceCourseVideos={async (courseId, payload) => {
        await postAndSync(
          `/api/admin/courses/${courseId}/videos/auto-sequence`,
          payload
        );
      }}
      onAddMcqSegment={async (seg: McqSegment) => {
        await postAndSync('/api/admin/mcq', seg);
      }}
      onSaveOnlineTest={async (test: OnlineTest) => {
        await postAndSync('/api/admin/tests', test);
      }}
      onDeleteOnlineTest={async (testId: string) => {
        await deleteAndSync(`/api/admin/tests/${testId}`);
      }}
      onGrantCourseAccess={async (payload) => {
        await postAndSync('/api/admin/grant-access', payload);
      }}
      onRevokeCourseAccess={async (moduleIds: string[]) => {
        await postAndSync('/api/admin/revoke-access', { moduleIds });
      }}
      onHandlePendingAccess={async (id, action) => {
        await postAndSync(`/api/admin/pending-access/${id}`, { action });
      }}
      onBulkPendingAccess={async (records, autoApprove) => {
        await postAndSync('/api/admin/bulk-pending-access', {
          records,
          autoApprove,
        });
      }}
      onReplyDoubt={async (id, mentorReply) => {
        await postAndSync(`/api/admin/doubts/${id}/reply`, { mentorReply });
      }}
      onDeleteDoubt={async (id) => {
        await deleteAndSync(`/api/admin/doubts/${id}`);
      }}
      onDeleteStartupIdea={async (id) => {
        await deleteAndSync(`/api/admin/startup-ideas/${id}`);
      }}
      onReplyGoalConversation={async (id, message) => {
        await postAndSync(`/api/admin/goal-conversations/${id}/reply`, {
          message,
        });
      }}
      onDeleteGoalConversation={async (id) => {
        await deleteAndSync(`/api/admin/goal-conversations/${id}`);
      }}
      onDeleteGalleryPhoto={async (id) => {
        await deleteAndSync(`/api/admin/student-gallery/${id}`);
      }}
      onSendBroadcast={async (payload) => {
        await postAndSync('/api/notifications', payload);
      }}
      onUpdateStudentRewards={async (payload) => {
        await postAndSync('/api/admin/student-rewards', payload);
      }}
      onRefreshState={fetchState}
    />
  );
};
