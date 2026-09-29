import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import axios from 'axios';
import { Link } from 'react-router';
import { useAuth } from '../context/AuthContext';
import { Megaphone, Bell, BellRing, CheckCircle, Trophy, History, ShieldCheck, TrendingUp, Sparkles, AlertCircle, Clock, Upload } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { ApplicationData, DocumentData, NotificationData, TimelineLog, MeritPosition } from '../types';

interface Props { documents: DocumentData[]; application: ApplicationData | null; }

const DOC_COLORS = ['#10B981', '#F59E0B', '#EF4444'];

const statusPill = (status?: string) => {
  const colors: Record<string, string> = {
    Draft: 'bg-gray-100 text-gray-600', Submitted: 'bg-blue-100 text-blue-700',
    'Under Review': 'bg-yellow-100 text-yellow-700', 'Correction Required': 'bg-red-100 text-red-700',
    Approved: 'bg-emerald-100 text-emerald-700', Rejected: 'bg-red-100 text-red-700',
  };
  return colors[status || ''] || 'bg-gray-100 text-gray-600';
};

const timelineIcon = (action: string) => {
  const a = action.toLowerCase();
  if (a.includes('submitted')) return <CheckCircle className="h-4 w-4 text-blue-600" />;
  if (a.includes('approv')) return <ShieldCheck className="h-4 w-4 text-emerald-600" />;
  if (a.includes('reject') || a.includes('correction')) return <AlertCircle className="h-4 w-4 text-red-600" />;
  if (a.includes('document')) return <Upload className="h-4 w-4 text-purple-600" />;
  return <Clock className="h-4 w-4 text-indigo-500" />;
};
const formatDate = (iso?: string) => {
  if (!iso) return '';
  const d = new Date(iso);
  return `${d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })} · ${d.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}`;
};

export default function StudentAdvancedFeatures({ documents, application }: Props) {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<NotificationData[]>([]);
  const [timeline, setTimeline] = useState<TimelineLog[]>([]);
  const [merit, setMerit] = useState<MeritPosition | null>(null);
  const [loading, setLoading] = useState(true);
  const [showNotifPanel, setShowNotifPanel] = useState(false);

  useEffect(() => {
    if (!user) return;
    (async () => {
      try {
        const [n, t, m] = await Promise.all([
          axios.get('/api/student/notifications'), axios.get('/api/student/timeline'), axios.get('/api/student/merit-position'),
        ]);
        setNotifications(n.data || []); setTimeline(t.data || []); setMerit(m.data || null);
      } catch (err) { console.error(err); } finally { setLoading(false); }
    })();
  }, [user]);

  const markRead = async (id: string) => {
    try { await axios.put(`/api/student/notifications/${id}/read`); setNotifications(p => p.map(x => x._id === id ? { ...x, read: true } : x)); } catch (err) { console.error(err); }
  };
  const markAllRead = async () => {
    try { await axios.put('/api/student/notifications/read-all'); setNotifications(p => p.map(x => ({ ...x, read: true }))); } catch (err) { console.error(err); }
  };

  const unreadCount = notifications.filter(n => !n.read).length;
  const verifiedCount = documents.filter(d => d.status === 'Verified').length;
  const pendingCount = documents.filter(d => d.status === 'Pending').length;
  const rejectedCount = documents.filter(d => d.status === 'Rejected').length;
  const docChartData = [
    { name: 'Verified', value: verifiedCount }, { name: 'Pending', value: pendingCount }, { name: 'Rejected', value: rejectedCount },
  ].filter(d => d.value > 0);

  if (loading) return null;

  return (
    <motion.div initial="hidden" animate="show" className="mb-8">
      <div className="relative flex justify-end mb-6">
        <button onClick={() => setShowNotifPanel(p => !p)} className="relative flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/80 dark:bg-gray-900/80 backdrop-blur shadow-lg border border-indigo-100 dark:border-indigo-900/50 hover:shadow-xl transition-all duration-200 group">
          {unreadCount > 0 ? <BellRing className="h-5 w-5 text-amber-500 animate-bounce-soft" /> : <Bell className="h-5 w-5 text-indigo-500 group-hover:rotate-12 transition-transform" />}
          <span className="hidden sm:inline text-sm font-bold text-gray-700 dark:text-gray-200">Notifications</span>
          {unreadCount > 0 && <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-gradient-to-br from-rose-500 to-red-600 text-white text-xs font-extrabold flex items-center justify-center shadow-lg shadow-rose-500/40">{unreadCount}</motion.span>}
        </button>
        <AnimatePresence>
          {showNotifPanel && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setShowNotifPanel(false)} />
              <motion.div initial={{ opacity: 0, y: 10, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 10, scale: 0.95 }} className="absolute right-0 mt-3 w-80 sm:w-96 z-50 rounded-2xl bg-white dark:bg-gray-900 shadow-2xl border border-indigo-100 dark:border-indigo-900/40 overflow-hidden">
                <div className="px-5 py-4 border-b border-indigo-100 dark:border-indigo-900/40 bg-gradient-to-r from-indigo-50/80 via-purple-50/60 to-pink-50/60 dark:from-gray-900 dark:to-gray-900 flex items-center justify-between">
                  <h3 className="font-bold text-gray-900 dark:text-white flex items-center gap-2"><Megaphone className="h-4 w-4 text-purple-500" /> Notifications</h3>
                  {unreadCount > 0 && <button onClick={markAllRead} className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 flex items-center gap-1"><CheckCircle className="h-3.5 w-3.5" /> Mark all read</button>}
                </div>
                <div className="max-h-80 overflow-y-auto divide-y divide-gray-100 dark:divide-gray-800">
                  {notifications.length === 0 ? <div className="px-5 py-8 text-center text-gray-400 text-sm">No notifications yet.</div> : notifications.map(n => (
                    <button key={n._id} onClick={() => markRead(n._id)} className={`w-full text-left px-5 py-3.5 transition-colors hover:bg-indigo-50/60 dark:hover:bg-indigo-950/30 ${n.read ? 'opacity-70' : ''}`}>
                      <div className="flex items-start gap-3">
                        <span className={`mt-1 w-2.5 h-2.5 rounded-full shrink-0 ${n.read ? 'bg-gray-300 dark:bg-gray-700' : 'bg-gradient-to-br from-rose-500 to-red-600 animate-pulse'}`} />
                        <div className="min-w-0">
                          <p className="text-sm font-bold text-gray-900 dark:text-white">{n.title}</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 line-clamp-2">{n.message}</p>
                          <p className="text-[10px] text-gray-400 mt-1">{formatDate(n.createdAt)}</p>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Merit Standing */}
        <motion.div whileHover={{ y: -6, boxShadow: '0 22px 35px -14px rgba(245,158,11,0.35)' }} transition={{ type: 'spring', stiffness: 260, damping: 16 }} className="relative overflow-hidden bg-gradient-to-br from-amber-500 via-orange-500 to-rose-500 rounded-2xl shadow-xl shadow-amber-500/20 border border-white/20 p-6 transition-all duration-300">
          <div className="absolute -right-8 -top-8 w-32 h-32 rounded-full bg-white/20 blur-2xl animate-pulse-glow pointer-events-none" />
          <h3 className="relative text-lg font-bold text-white flex items-center gap-2 mb-4"><Trophy className="w-5 h-5 animate-bounce-soft" /> Merit Standing</h3>
          {merit && merit.isMeritListed ? (
            <div className="relative">
              <div className="flex items-end gap-3">
                <motion.span initial={{ scale: 1.4, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-6xl font-extrabold text-white drop-shadow-lg">#{merit.rank}</motion.span>
                <span className="text-white/80 mb-3">of {merit.totalApplicants} applicants</span>
              </div>
              <div className="mt-5 grid grid-cols-2 gap-3">
                <div className="bg-white/15 backdrop-blur rounded-xl p-3">
                  <p className="text-[11px] uppercase tracking-wider text-white/75">PUC Score</p>
                  <p className="text-xl font-extrabold text-white">{merit.pucPercentage}%</p>
                </div>
                <div className="bg-white/15 backdrop-blur rounded-xl p-3">
                  <p className="text-[11px] uppercase tracking-wider text-white/75">Beats</p>
                  <p className="text-xl font-extrabold text-white">{merit.beatsPercent ?? 0}%</p>
                </div>
              </div>
              <div className="mt-4 h-2 rounded-full bg-white/25 overflow-hidden">
                <motion.div initial={{ width: 0 }} animate={{ width: `${Math.min(100, merit.beatsPercent ?? 0)}%` }} transition={{ duration: 1.2, ease: 'easeOut', delay: 0.2 }} className="h-full rounded-full bg-gradient-to-r from-yellow-300 to-white" />
              </div>
              <span className="mt-4 inline-block text-xs font-bold text-white/90 underline underline-offset-4">In the top {100 - (merit.beatsPercent ?? 0)}% of applicants</span>
            </div>
          ) : (
            <div className="relative text-white/90">
              <p className="text-sm leading-relaxed">
                {application && application.status === 'Draft'
                  ? 'Submit your application to be ranked on the merit list.'
                  : 'You are not currently ranked. The merit list is computed for submitted, under-review and approved applications.'}
              </p>
              <div className="mt-3 inline-flex items-center gap-2 bg-white/15 rounded-full px-3 py-1 text-xs font-bold">
                <TrendingUp className="w-4 h-4" /> {merit ? `${merit.totalApplicants} applicants on merit list` : 'No merit list yet'}
              </div>
            </div>
          )}
        </motion.div>
{/* Document Verification Overview */}
        <motion.div whileHover={{ y: -6, boxShadow: '0 22px 35px -14px rgba(16,185,129,0.3)' }} transition={{ type: 'spring', stiffness: 260, damping: 16 }} className="relative overflow-hidden bg-white/85 dark:bg-gray-900/80 backdrop-blur-sm rounded-2xl shadow-lg border border-emerald-100/70 dark:border-emerald-900/40 p-6">
          <div className="absolute -right-10 -top-10 w-36 h-36 rounded-full bg-gradient-to-br from-emerald-300 to-cyan-400 opacity-20 blur-2xl animate-float-slow pointer-events-none" />
          <h3 className="relative text-lg font-bold flex items-center gap-2 bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent mb-4"><ShieldCheck className="w-5 h-5 text-emerald-500 animate-bounce-soft" /> Document Verification</h3>
          <div className="relative flex items-center gap-5">
            <div className="w-40 h-40 shrink-0">
              {docChartData.length === 0 ? (
                <div className="w-full h-full flex items-center justify-center text-center text-sm text-gray-400 px-3">No documents uploaded yet.</div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={docChartData} cx="50%" cy="50%" innerRadius={48} outerRadius={70} paddingAngle={4} dataKey="value" stroke="none">
                      {docChartData.map((entry, index) => <Cell key={`cell-${index}`} fill={DOC_COLORS[index % DOC_COLORS.length]} />)}
                    </Pie>
                    <Tooltip contentStyle={{ borderRadius: '0.5rem', border: 'none', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }} />
                  </PieChart>
                </ResponsiveContainer>
              )}
            </div>
            <div className="flex-1 space-y-3">
              {[
                { label: 'Verified', value: verifiedCount, color: 'bg-emerald-500' },
                { label: 'Pending', value: pendingCount, color: 'bg-amber-500' },
                { label: 'Rejected', value: rejectedCount, color: 'bg-rose-500' },
              ].map(item => (
                <div key={item.label} className="flex items-center justify-between">
                  <span className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300"><span className={`w-3 h-3 rounded-full ${item.color}`} /> {item.label}</span>
                  <span className="text-sm font-extrabold text-gray-900 dark:text-white">{item.value}</span>
                </div>
              ))}
              <Link to="/student/documents" className="inline-block text-xs font-bold text-emerald-600 hover:text-emerald-700 mt-1">Manage documents →</Link>
            </div>
          </div>
        </motion.div>
{/* Application Summary */}
        <motion.div whileHover={{ y: -6, boxShadow: '0 22px 35px -14px rgba(99,102,241,0.3)' }} transition={{ type: 'spring', stiffness: 260, damping: 16 }} className="relative overflow-hidden bg-white/90 dark:bg-slate-900/85 backdrop-blur-2xl rounded-2xl shadow-lg border border-indigo-100/70 dark:border-indigo-900/40 p-6">
          <div className="absolute -left-10 -top-10 w-36 h-36 rounded-full bg-gradient-to-br from-indigo-300 to-purple-400 opacity-20 blur-2xl animate-float-slow pointer-events-none" />
          <h3 className="relative text-lg font-bold flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-4"><Sparkles className="w-5 h-5 text-indigo-500 animate-spin-slow" /> Application Summary</h3>
          <div className="relative space-y-3">
            <div className="flex items-center justify-between bg-indigo-50/70 dark:bg-indigo-950/30 rounded-xl px-4 py-3">
              <span className="text-sm text-gray-600 dark:text-gray-300">Status</span>
              <span className={`px-3 py-1 rounded-full text-xs font-bold ${statusPill(application?.status || 'Not Started')}`}>{application?.status || 'Not Started'}</span>
            </div>
            <div className="flex items-center justify-between bg-indigo-50/70 dark:bg-indigo-950/30 rounded-xl px-4 py-3">
              <span className="text-xs text-gray-600 dark:text-gray-300">Category</span>
              <span className="text-sm font-bold text-gray-900 dark:text-white">{application?.personalDetails?.category || '—'}</span>
            </div>
            <div className="flex items-center justify-between bg-indigo-50/70 dark:bg-indigo-950/30 rounded-xl px-4 py-3">
              <span className="text-xs text-gray-600 dark:text-gray-300">Guardian Income</span>
              <span className="text-sm font-bold text-gray-900 dark:text-white">{application?.guardianDetails?.annualIncome || '—'}</span>
            </div>
            <div className="flex items-center justify-between bg-indigo-50/70 dark:bg-indigo-950/30 rounded-xl px-4 py-3">
              <span className="text-xs text-gray-600 dark:text-gray-300">Application Fee</span>
              <span className={`text-sm font-bold ${application?.paymentStatus === 'Completed' ? 'text-emerald-600' : 'text-amber-600'}`}>{application?.paymentStatus === 'Completed' ? 'Paid ✓' : application?.paymentStatus || 'Pending'}</span>
            </div>
          </div>
        </motion.div>
      </div>
{/* Application Timeline */}
      <motion.div whileHover={{ y: -4 }} className="relative overflow-hidden bg-white/90 dark:bg-slate-900/90 backdrop-blur-2xl rounded-2xl shadow-lg border border-purple-100/70 dark:border-purple-900/40 p-6">
        <div className="absolute -right-10 -bottom-10 w-40 h-40 rounded-full bg-gradient-to-br from-purple-300 to-pink-400 opacity-20 blur-2xl animate-float-slow pointer-events-none" />
        <h3 className="relative text-lg font-bold flex items-center gap-2 bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent mb-6"><History className="w-5 h-5 text-purple-500 animate-spin-slow" /> Application Activity</h3>
        {timeline.length === 0 ? (
          <p className="relative text-sm text-gray-400">No activity recorded yet.</p>
        ) : (
          <div className="relative space-y-0">
            <div className="absolute left-[15px] top-2 bottom-2 w-px bg-gradient-to-b from-purple-400 via-pink-400 to-transparent" />
            {timeline.map((log, i) => (
              <motion.div key={log._id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.05 * i }} className="relative pl-12 pb-5 last:pb-0">
                <motion.div whileHover={{ scale: 1.2 }} className="absolute left-0 top-0 w-8 h-8 rounded-full bg-white dark:bg-slate-800 border-2 border-purple-300 dark:border-purple-700 flex items-center justify-center shadow">{timelineIcon(log.action)}</motion.div>
                <p className="text-sm font-bold text-gray-900 dark:text-white">{log.action}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                  {log.actorRole === 'admin' ? 'Admissions office' : 'You'}
                  {log.newStatus && <span className="ml-2 inline-block px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300">{log.newStatus}</span>}
                </p>
                {log.remark && <p className="text-xs text-amber-600 dark:text-amber-400 mt-1 italic">“{log.remark}”</p>}
                <p className="text-[11px] text-gray-400 mt-1">{formatDate(log.createdAt)}</p>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}
