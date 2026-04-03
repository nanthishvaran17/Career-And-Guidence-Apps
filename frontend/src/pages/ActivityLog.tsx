import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Layout } from '../components/Layout';
import { Card } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { API_BASE_URL } from '../config';
import {
  LogIn,
  LogOut,
  Shield,
  Clock,
  Monitor,
  Globe,
  ArrowLeft,
  RefreshCw,
  Activity,
  Loader2,
  Calendar,
  Timer,
  TrendingUp,
  AlertCircle,
} from 'lucide-react';
import { Button } from '../components/ui/button';

interface ActivityEntry {
  id: number;
  action: 'login' | 'logout';
  email: string;
  ip_address: string;
  user_agent: string;
  status: string;
  details: string;
  session_duration_mins: number | null;
  logged_in_at: string | null;
  timestamp: string;
}

interface Summary {
  total_sessions: number;
  total_logins: number;
  total_logouts: number;
  avg_session_mins: number | null;
  last_activity: string | null;
  first_activity: string | null;
}

// ── Helpers ──────────────────────────────────────────────────────────────────
function formatTime(isoStr: string) {
  if (!isoStr) return '—';
  const d = new Date(isoStr);
  return d.toLocaleString('en-IN', {
    day: '2-digit', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit', hour12: true,
  });
}

function getBrowser(ua: string = '') {
  if (ua.includes('Chrome') && !ua.includes('Edg')) return 'Chrome';
  if (ua.includes('Firefox')) return 'Firefox';
  if (ua.includes('Safari') && !ua.includes('Chrome')) return 'Safari';
  if (ua.includes('Edg')) return 'Edge';
  if (ua.includes('OPR') || ua.includes('Opera')) return 'Opera';
  return 'Unknown Browser';
}

function getOS(ua: string = '') {
  if (ua.includes('Windows NT')) return 'Windows';
  if (ua.includes('Mac OS')) return 'macOS';
  if (ua.includes('Android')) return 'Android';
  if (ua.includes('iPhone') || ua.includes('iPad')) return 'iOS';
  if (ua.includes('Linux')) return 'Linux';
  return 'Unknown OS';
}

// ─────────────────────────────────────────────────────────────────────────────
export function ActivityLog() {
  const navigate = useNavigate();
  const [logs, setLogs] = useState<ActivityEntry[]>([]);
  const [summary, setSummary] = useState<Summary | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const userId = localStorage.getItem('userId');

  const fetchData = async (showRefresh = false) => {
    if (!userId) { setLoading(false); return; }
    if (showRefresh) setRefreshing(true);
    else setLoading(true);

    try {
      const [logsRes, summaryRes] = await Promise.all([
        fetch(`${API_BASE_URL}/api/security/activity-log?id=${userId}&limit=100`),
        fetch(`${API_BASE_URL}/api/security/activity-summary?id=${userId}`),
      ]);
      if (logsRes.ok) setLogs(await logsRes.json());
      if (summaryRes.ok) setSummary(await summaryRes.json());
    } catch (err) {
      console.error('Failed to fetch activity log', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  if (!userId) {
    return (
      <Layout>
        <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
          <AlertCircle className="w-16 h-16 text-red-400" />
          <h2 className="text-xl font-bold text-gray-700">Not Logged In</h2>
          <p className="text-gray-500">Please log in to view your activity log.</p>
          <Button onClick={() => navigate('/login')} className="bg-indigo-600 text-white">Go to Login</Button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-4xl mx-auto py-6 px-4 space-y-6">

        {/* Header */}
        <div className="flex items-start gap-4">
          <button onClick={() => navigate(-1)} className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors mt-1">
            <ArrowLeft className="w-5 h-5 text-gray-500" />
          </button>
          <div className="flex-1">
            <h1 className="text-2xl font-black text-gray-900 dark:text-white flex items-center gap-2">
              <Activity className="w-7 h-7 text-indigo-600" /> Login Activity Log
            </h1>
            <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
              Full history of all your login and logout sessions stored securely.
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => fetchData(true)}
            disabled={refreshing}
            className="flex items-center gap-2"
          >
            <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>

        {/* Summary Stats */}
        {summary && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <Card className="p-4 bg-gradient-to-br from-indigo-500 to-indigo-600 text-white border-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                  <TrendingUp className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-2xl font-black">{summary.total_logins || 0}</p>
                  <p className="text-xs text-indigo-100">Total Logins</p>
                </div>
              </div>
            </Card>
            <Card className="p-4 bg-gradient-to-br from-rose-500 to-rose-600 text-white border-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                  <LogOut className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-2xl font-black">{summary.total_logouts || 0}</p>
                  <p className="text-xs text-rose-100">Total Logouts</p>
                </div>
              </div>
            </Card>
            <Card className="p-4 bg-gradient-to-br from-amber-500 to-amber-600 text-white border-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                  <Timer className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-2xl font-black">
                    {summary.avg_session_mins ? `${Math.round(summary.avg_session_mins)}m` : '—'}
                  </p>
                  <p className="text-xs text-amber-100">Avg Session</p>
                </div>
              </div>
            </Card>
            <Card className="p-4 bg-gradient-to-br from-emerald-500 to-emerald-600 text-white border-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                  <Calendar className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-sm font-black leading-tight">
                    {summary.last_activity ? new Date(summary.last_activity).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' }) : '—'}
                  </p>
                  <p className="text-xs text-emerald-100">Last Active</p>
                </div>
              </div>
            </Card>
          </div>
        )}

        {/* Activity Timeline */}
        <Card className="p-6 shadow-sm dark:bg-gray-800 dark:border-gray-700">
          <h3 className="font-bold text-gray-800 dark:text-white mb-5 flex items-center gap-2">
            <Shield className="w-5 h-5 text-indigo-500" />
            Session History
            <Badge variant="secondary" className="ml-auto">{logs.length} records</Badge>
          </h3>

          {loading ? (
            <div className="flex items-center justify-center py-16">
              <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
            </div>
          ) : logs.length === 0 ? (
            <div className="text-center py-12 text-gray-400">
              <Activity className="w-12 h-12 mx-auto mb-3 opacity-30" />
              <p className="font-medium">No activity logs yet.</p>
              <p className="text-sm">Your login and logout events will appear here.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {logs.map((entry, idx) => {
                const isLogin = entry.action === 'login';
                const browser = getBrowser(entry.user_agent);
                const os = getOS(entry.user_agent);

                return (
                  <div
                    key={entry.id}
                    className={`relative flex items-start gap-4 p-4 rounded-xl border transition-all
                      ${isLogin
                        ? 'bg-green-50 border-green-100 dark:bg-green-900/20 dark:border-green-800'
                        : 'bg-rose-50 border-rose-100 dark:bg-rose-900/20 dark:border-rose-800'
                      }`}
                  >
                    {/* Timeline connector */}
                    {idx < logs.length - 1 && (
                      <div className="absolute left-8 top-14 w-0.5 h-4 bg-gray-200 dark:bg-gray-700" />
                    )}

                    {/* Icon */}
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0
                      ${isLogin ? 'bg-green-500' : 'bg-rose-500'}`}
                    >
                      {isLogin
                        ? <LogIn className="w-5 h-5 text-white" />
                        : <LogOut className="w-5 h-5 text-white" />
                      }
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <span className={`text-sm font-bold ${isLogin ? 'text-green-700 dark:text-green-400' : 'text-rose-700 dark:text-rose-400'}`}>
                          {isLogin ? '🔐 Logged In' : '🚪 Logged Out'}
                        </span>
                        <Badge variant={isLogin ? 'default' : 'destructive'} className="text-xs">
                          {entry.status}
                        </Badge>
                        {entry.session_duration_mins !== null && entry.session_duration_mins !== undefined && (
                          <Badge variant="outline" className="text-xs text-gray-600 dark:text-gray-400">
                            <Timer className="w-3 h-3 mr-1" />
                            {entry.session_duration_mins} min session
                          </Badge>
                        )}
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs text-gray-500 dark:text-gray-400 mt-2">
                        <span className="flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5 shrink-0" />
                          {formatTime(entry.timestamp)}
                        </span>
                        <span className="flex items-center gap-1.5">
                          <Monitor className="w-3.5 h-3.5 shrink-0" />
                          {browser} on {os}
                        </span>
                        <span className="flex items-center gap-1.5">
                          <Globe className="w-3.5 h-3.5 shrink-0" />
                          IP: {entry.ip_address || '—'}
                        </span>
                      </div>

                      {entry.details && (
                        <p className="text-xs text-gray-400 dark:text-gray-500 mt-1.5 italic">{entry.details}</p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </Card>

        <p className="text-center text-xs text-gray-400 dark:text-gray-500 pb-4">
          🔒 All login and logout activity is securely logged in the database with IP address and device information.
        </p>
      </div>
    </Layout>
  );
}
