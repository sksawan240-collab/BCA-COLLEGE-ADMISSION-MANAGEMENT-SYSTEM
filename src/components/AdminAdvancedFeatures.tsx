import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import axios from 'axios';
import { Link } from 'react-router';
import { Trophy, Download, History, Wallet, ShieldCheck, Percent, AlertCircle, CheckCircle, Clock, UserCheck, Sparkles } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { ActivityLog } from '../types';
import toast from 'react-hot-toast';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const fmtINR = (n: number) => `₹${(n || 0).toLocaleString('en-IN')}`;
const fmtDate = (iso?: string) => {
  if (!iso) return '';
  const d = new Date(iso);
  return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }) + ' · ' + d.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
};

export default function AdminAdvancedFeatures({ stats }: { stats: any }) {
  const [activity, setActivity] = useState<ActivityLog[]>([]);
  const [merit, setMerit] = useState<any[]>([]);
  const [exporting, setExporting] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const [actRes, meritRes] = await Promise.all([
          axios.get('/api/admin/activity'),
          axios.get('/api/admin/merit-list'),
        ]);
        setActivity(actRes.data || []);
        setMerit((meritRes.data || []).slice(0, 5));
      } catch (err) {
        console.error('Failed to load advanced admin data', err);
      }
    })();
  }, []);

  const docChartData = [
    { name: 'Verified', value: stats.verifiedDocuments || 0 },
    { name: 'Pending', value: stats.pendingDocuments || 0 },
    { name: 'Rejected', value: stats.rejectedDocuments || 0 },
  ].filter(d => d.value > 0);
  const DOC_COLORS = ['#10B981', '#F59E0B', '#EF4444'];

  const exportReport = () => {
    try {
      setExporting(true);
      const doc = new jsPDF();
      doc.setFontSize(18); doc.setTextColor(79, 70, 229);
      doc.text('Admissions Dashboard Report', 14, 20);
      doc.setFontSize(10); doc.setTextColor(100, 116, 139);
      doc.text(`Generated on ${new Date().toLocaleString('en-IN')}`, 14, 28);
      autoTable(doc, {
        startY: 34,
        head: [['Metric', 'Value']],
        body: [
          ['Total Students', String(stats.totalStudents)],
          ['Total Applications', String(stats.totalApplications)],
          ['Submitted', String(stats.submitted)],
          ['Under Review', String(stats.underReview)],
          ['Approved', String(stats.approved)],
          ['Rejected', String(stats.rejected)],
          ['Application Fees Collected', fmtINR(stats.feesCollected)],
          ['Verified Documents', String(stats.verifiedDocuments)],
          ['Pending Documents', String(stats.pendingDocuments)],
          ['Approval Rate', `${stats.approvalRate}%`],
          ['Document Verification Rate', `${stats.docVerificationRate}%`],
        ],
        styles: { fontSize: 10 },
        headStyles: { fillColor: [99, 102, 241] },
      });
      if (merit.length > 0) {
        const y = (doc as any).lastAutoTable.finalY + 10;
        doc.setFontSize(13); doc.setTextColor(245, 158, 11);
        doc.text('Top Merit Achievers', 14, y);
        autoTable(doc, {
          startY: y + 4,
          head: [['#', 'Student', 'PUC %', 'Category']],
          body: merit.map((m: any, i: number) => [String(i + 1), m.studentName, `${m.pucPercentage}%`, m.category || 'General']),
          styles: { fontSize: 9 },
          headStyles: { fillColor: [245, 158, 11] },
        });
      }
      doc.save('admissions-dashboard-report.pdf');
      toast.success('Report exported successfully');
    } catch (err) {
      console.error(err);
      toast.error('Failed to export report');
    } finally {
      setExporting(false);
    }
  };

  const activityIcon = (role: string, action: string) => {
    const a = action.toLowerCase();
    if (a.includes('approv')) return <CheckCircle className="h-4 w-4 text-emerald-600" />;
    if (a.includes('reject')) return <AlertCircle className="h-4 w-4 text-red-600" />;
    if (a.includes('document')) return <UserCheck className="h-4 w-4 text-purple-600" />;
    if (a.includes('status')) return <History className="h-4 w-4 text-indigo-600" />;
    return <Clock className="h-4 w-4 text-slate-500" />;
  };

  return (
    <motion.section initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="mb-8">
      <div className="flex items-center justify-between flex-wrap gap-4 mb-6">
        <h2 className="text-xl font-extrabold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 bg-clip-text text-transparent flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-purple-500 animate-spin-slow" /> Advanced Insights
        </h2>
        <motion.button whileHover={{ scale: 1.05, y: -2 }} whileTap={{ scale: 0.95 }} onClick={exportReport} disabled={exporting} className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold shadow-lg shadow-indigo-500/30 hover:shadow-xl disabled:opacity-60">
          <Download className={exporting ? 'animate-bounce' : 'h-5 w-5'} /> {exporting ? 'Exporting…' : 'Export Report (PDF)'}
        </motion.button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[
          { title: 'Application Fees', value: fmtINR(stats.feesCollected), sub: `${stats.admissionFeesCollected ?? 0} admission fees paid`, icon: Wallet, color: 'from-emerald-500 to-teal-600', shadow: 'shadow-emerald-500/30' },
          { title: 'Approval Rate', value: `${stats.approvalRate}%`, sub: 'of all applications', icon: Percent, color: 'from-blue-500 to-indigo-600', shadow: 'shadow-blue-500/30' },
          { title: 'Doc Verification', value: `${stats.docVerificationRate}%`, sub: `${stats.verifiedDocuments} verified docs`, icon: ShieldCheck, color: 'from-purple-500 to-fuchsia-600', shadow: 'shadow-purple-500/30' },
          { title: 'Pending Payments', value: String(stats.pendingPayments ?? 0), sub: 'awaiting payment', icon: Clock, color: 'from-amber-500 to-orange-600', shadow: 'shadow-amber-500/30' },
        ].map((m, i) => (
          <motion.div key={m.title} initial={{ opacity: 0, y: 20, scale: 0.92 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ delay: 0.2 + i * 0.08 }} whileHover={{ y: -8, scale: 1.03, boxShadow: `0 25px 35px -12px rgba(99,102,241,0.25)` }} className="relative overflow-hidden bg-white/90 backdrop-blur-xl rounded-2xl shadow-lg border border-indigo-100/70 p-6">
            <div className={`absolute -right-6 -top-6 w-24 h-24 rounded-full bg-gradient-to-br ${m.color} opacity-20 blur-xl animate-pulse-glow pointer-events-none`} />
            <div className="relative flex items-center gap-3 mb-3">
              <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${m.color} flex items-center justify-center shadow-lg ${m.shadow}`}>
                <m.icon className="h-5 w-5 text-white" />
              </div>
              <p className="text-sm font-bold text-gray-500">{m.title}</p>
            </div>
            <p className="relative text-2xl font-extrabold text-gray-900 dark:text-white">{m.value}</p>
            <p className="relative text-xs text-gray-400 mt-1">{m.sub}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        {/* Document Verification Pipeline */}
        <motion.div whileHover={{ y: -6, boxShadow: '0 25px 35px -14px rgba(16,185,129,0.3)' }} className="relative overflow-hidden bg-white/90 backdrop-blur-xl rounded-2xl shadow-lg border border-emerald-100/70 p-6">
          <div className="absolute -right-10 -top-10 w-36 h-36 rounded-full bg-gradient-to-br from-emerald-300 to-teal-400 opacity-20 blur-2xl animate-float-slow pointer-events-none" />
          <h3 className="relative text-lg font-bold flex items-center gap-2 bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent mb-4">
            <ShieldCheck className="w-5 h-5 text-emerald-500 animate-bounce-soft" /> Document Pipeline
          </h3>
          <div className="relative flex items-center gap-4">
            <div className="w-36 h-36 shrink-0">
              {docChartData.length === 0 ? (
                <div className="w-full h-full flex items-center justify-center text-center text-sm text-gray-400 px-2">No documents yet.</div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={docChartData} cx="50%" cy="50%" innerRadius={44} outerRadius={64} paddingAngle={4} dataKey="value" stroke="none">
                      {docChartData.map((entry, index) => <Cell key={`cell-${index}`} fill={DOC_COLORS[index % DOC_COLORS.length]} />)}
                    </Pie>
                    <Tooltip contentStyle={{ borderRadius: '0.5rem', border: 'none', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }} />
                  </PieChart>
                </ResponsiveContainer>
              )}
            </div>
            <div className="flex-1 space-y-2.5">
              {[
                { label: 'Verified', value: stats.verifiedDocuments || 0, color: 'bg-emerald-500' },
                { label: 'Pending', value: stats.pendingDocuments || 0, color: 'bg-amber-500' },
                { label: 'Rejected', value: stats.rejectedDocuments || 0, color: 'bg-rose-500' },
              ].map(item => (
                <div key={item.label} className="flex items-center justify-between">
                  <span className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300"><span className={`w-3 h-3 rounded-full ${item.color}`} /> {item.label}</span>
                  <span className="text-sm font-extrabold text-gray-900 dark:text-white">{item.value}</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
{/* Top Merit Achievers */}
        <motion.div whileHover={{ y: -6, boxShadow: '0 25px 35px -14px rgba(245,158,11,0.3)' }} className="relative overflow-hidden bg-gradient-to-br from-amber-500 to-orange-600 rounded-2xl shadow-xl shadow-amber-500/20 border border-amber-300/40 p-6">
          <div className="absolute -right-10 -top-10 w-36 h-36 rounded-full bg-white/20 blur-2xl animate-pulse-glow pointer-events-none" />
          <div className="relative flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-white flex items-center gap-2"><Trophy className="w-5 h-5 animate-bounce-soft" /> Top Merit Achievers</h3>
            <Link to="/admin/merit-list" className="text-white/80 hover:text-white text-xs font-bold underline underline-offset-4">View all</Link>
          </div>
          {merit.length === 0 ? (
            <p className="relative text-white/80 text-sm">No merit list ranked yet.</p>
          ) : (
            <div className="relative space-y-3">
              {merit.map((m: any, i: number) => (
                <motion.div key={m.applicationId || i} initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 + i * 0.08 }} whileHover={{ scale: 1.02, backgroundColor: 'rgba(255,255,255,0.2)' }} className={`flex items-center gap-3 rounded-xl px-3 py-2.5 ${i === 0 ? 'bg-white/25' : 'bg-white/10 backdrop-blur'}`}>
                  <div className="w-8 h-8 rounded-full flex items-center justify-center bg-white/25 text-white font-extrabold text-sm shadow">
                    {m.rank}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-white font-bold text-sm truncate">{m.studentName}</p>
                    <p className="text-white/70 text-xs">{m.category || 'General'}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-white font-extrabold text-sm">{m.pucPercentage}%</p>
                    <p className="text-white/70 text-[10px] uppercase">PUC</p>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>

        {/* Recent Activity */}
        <motion.div whileHover={{ y: -6, boxShadow: '0 25px 35px -14px rgba(147,51,234,0.3)' }} className="relative overflow-hidden bg-white/90 backdrop-blur-xl rounded-2xl shadow-lg border border-purple-100/70 p-6">
          <div className="absolute -right-10 -bottom-10 w-36 h-36 rounded-full bg-gradient-to-br from-purple-300 to-pink-400 opacity-20 blur-2xl animate-float-slow pointer-events-none" />
          <h3 className="relative text-lg font-bold flex items-center gap-2 bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent mb-6">
            <History className="w-5 h-5 text-purple-500 animate-spin-slow" /> Recent Activity
          </h3>
          {activity.length === 0 ? (
            <p className="relative text-sm text-gray-400">No activity recorded yet.</p>
          ) : (
            <div className="relative space-y-0">
              <div className="absolute left-[15px] top-2 bottom-2 w-px bg-gradient-to-b from-purple-400 via-pink-400 to-transparent" />
              {activity.slice(0, 6).map((a: any, i: number) => (
                <motion.div key={a._id} initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.15 + i * 0.06 }} className="relative pl-12 pb-4 last:pb-0">
                  <div className="absolute left-0 top-0 w-8 h-8 rounded-full bg-white dark:bg-slate-800 border-2 border-purple-300 dark:border-purple-700 flex items-center justify-center shadow">
                    {activityIcon(a.actorRole, a.action)}
                  </div>
                  <p className="text-sm font-bold text-gray-900 dark:text-white">{a.action}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                    {typeof a.applicationId === 'object' && a.applicationId?.applicationNumber ? a.applicationId.applicationNumber : 'Application'}
                    {a.newStatus && <span className="ml-2 inline-block px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300">{a.newStatus}</span>}
                  </p>
                  <p className="text-[11px] text-gray-400 mt-0.5">{fmtDate(a.createdAt)}</p>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </motion.section>
  );
}