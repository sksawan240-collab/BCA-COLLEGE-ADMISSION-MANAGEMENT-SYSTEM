import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router';
import { LayoutDashboard, ClipboardList, Users as UsersIcon, Award, Settings as SettingsIcon, ShieldCheck } from 'lucide-react';

const AdminSidebar = () => {
  const { pathname } = useLocation();

  const navItems = [
    { label: 'Dashboard', to: '/admin/dashboard', icon: LayoutDashboard, active: 'from-indigo-500 to-blue-500' },
    { label: 'Applications', to: '/admin/applications', icon: ClipboardList, active: 'from-purple-500 to-fuchsia-500' },
    { label: 'Users', to: '/admin/users', icon: UsersIcon, active: 'from-pink-500 to-rose-500' },
    { label: 'Merit List', to: '/admin/merit-list', icon: Award, active: 'from-amber-500 to-orange-500' },
    { label: 'Settings', to: '/admin/settings', icon: SettingsIcon, active: 'from-emerald-500 to-green-500' },
  ];

  return (
    <motion.aside
      initial={{ x: -80, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 120, damping: 16 }}
      className="relative overflow-hidden bg-gradient-to-b from-indigo-600 via-purple-600 to-fuchsia-600 text-white w-64 min-h-screen p-5 shadow-2xl"
    >
      {/* decorative orbs */}
      <div className="absolute -top-10 -left-10 w-40 h-40 rounded-full bg-white/20 blur-2xl animate-float-slow pointer-events-none" />
      <div className="absolute bottom-10 -right-10 w-40 h-40 rounded-full bg-yellow-300/20 blur-2xl animate-float-medium pointer-events-none" />

      <motion.h2
        whileHover={{ scale: 1.03 }}
        className="relative text-2xl font-extrabold mb-8 flex items-center gap-2"
      >
        <motion.span
          animate={{ rotate: [0, 15, 0] }}
          transition={{ duration: 3, repeat: Infinity }}
          className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur flex items-center justify-center shadow-lg"
        >
          <ShieldCheck className="h-6 w-6" />
        </motion.span>
        <span className="bg-gradient-to-r from-white to-yellow-100 bg-clip-text text-transparent">Admin Panel</span>
      </motion.h2>

      <nav className="relative">
        <ul className="space-y-2">
          {navItems.map((item) => {
            const isActive = pathname === item.to;
            return (
              <li key={item.to}>
                <Link
                  to={item.to}
                  className={`group flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all duration-300 ${
                    isActive
                      ? `bg-gradient-to-r ${item.active} shadow-lg text-white`
                      : 'text-white/80 hover:bg-white/15 hover:text-white hover:translate-x-1'
                  }`}
                >
                  <span className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-300 ${isActive ? 'bg-white/25' : 'bg-white/10 group-hover:bg-white/20 group-hover:scale-110'}`}>
                    <item.icon className="h-5 w-5" />
                  </span>
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </motion.aside>
  );
};
import axios from 'axios';
import { motion } from 'motion/react';
import { useAuth } from '../../context/AuthContext';
import { Users, FileText, CheckCircle, Clock, AlertCircle, Settings, IndianRupee, Sparkles, TrendingUp, Wallet } from 'lucide-react';
import { Link } from 'react-router';
import AnimatedCounter from '../../components/AnimatedCounter';
import { 
  BarChart, Bar, LineChart, Line, AreaChart, Area, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer 
} from 'recharts';
import AdminAdvancedFeatures from '../../components/AdminAdvancedFeatures';
import ApplicationStatusChecker from '../../components/ApplicationStatusChecker';

export default function AdminDashboard() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await axios.get('/api/admin/dashboard');
        setStats(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    if (user) {
      fetchStats();
    }
  }, [user]);

  if (loading || !stats) {
    return <div className="min-h-screen flex items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div></div>;
  }

  const statCards = [
    { title: 'Total Students', value: stats.totalStudents, icon: Users, gradient: 'from-blue-500 to-indigo-600', shadow: 'shadow-blue-500/30' },
    { title: 'Total Applications', value: stats.totalApplications, icon: FileText, gradient: 'from-violet-500 to-purple-600', shadow: 'shadow-purple-500/30' },
    { title: 'Draft', value: stats.draft, icon: FileText, gradient: 'from-slate-500 to-gray-600', shadow: 'shadow-gray-500/30' },
    { title: 'Submitted', value: stats.submitted, icon: Clock, gradient: 'from-amber-400 to-orange-500', shadow: 'shadow-amber-500/30' },
    { title: 'Under Review', value: stats.underReview, icon: Clock, gradient: 'from-orange-400 to-red-500', shadow: 'shadow-orange-500/30' },
    { title: 'Approved', value: stats.approved, icon: CheckCircle, gradient: 'from-emerald-400 to-green-600', shadow: 'shadow-emerald-500/30' },
  ];

  return (
    <div className="relative flex min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-gray-900 dark:to-indigo-950/40">
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(135deg, #eef2ff, #faf5ff, #fce7f3, #ecfeff, #f0fdf4)',
            backgroundSize: '400% 400%',
          }}
          animate={{ backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'] }}
          transition={{ duration: 24, ease: 'linear', repeat: Infinity }}
        />
        <div className="absolute top-[-8rem] left-1/3 w-80 h-80 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 opacity-20 blur-3xl animate-float-slow" />
        <div className="absolute top-1/4 right-[-6rem] w-80 h-80 rounded-full bg-gradient-to-br from-pink-400 to-fuchsia-500 opacity-20 blur-3xl animate-float-medium" />
        <div className="absolute bottom-[-6rem] left-[-5rem] w-80 h-80 rounded-full bg-gradient-to-br from-cyan-300 to-teal-400 opacity-20 blur-3xl animate-float-fast" />
        <div className="absolute bottom-1/3 right-1/4 w-64 h-64 rounded-full bg-gradient-to-br from-amber-300 to-orange-400 opacity-20 blur-3xl animate-float-slow" />
      </div>
      <AdminSidebar />
      <div className="flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex justify-between items-center mb-8 flex-wrap gap-4">
            <div>
              <motion.h1 initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="text-3xl sm:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 animate-gradient-x flex items-center gap-3">
                <motion.span
                  animate={{ rotate: [0, 15, -10, 0] }}
                  transition={{ duration: 4, repeat: Infinity }}
                  className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center shadow-lg shadow-purple-500/30"
                >
                  <Sparkles className="h-6 w-6 text-white" />
                </motion.span>
                Admin Dashboard
              </motion.h1>
              <motion.p initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }} className="text-gray-600 dark:text-gray-400 mt-2 flex items-center gap-2">
                <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                Overview of admission applications
              </motion.p>
            </div>
            <div className="flex gap-3">
              <motion.div whileHover={{ scale: 1.05, y: -3, boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)" }} whileTap={{ scale: 0.95 }} transition={{ type: "spring", stiffness: 400, damping: 10 }}>
                <Link to="/admin/settings" className="bg-white border-2 border-gray-200 text-gray-700 px-4 py-2 rounded-lg font-bold shadow-sm hover:border-purple-400 hover:text-purple-800 transition-all duration-200 flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  Settings
                </Link>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05, y: -3, boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)" }} whileTap={{ scale: 0.95 }} transition={{ type: "spring", stiffness: 400, damping: 10 }}>
                <Link to="/admin/merit-list" className="bg-white border-2 border-indigo-600 text-indigo-700 px-4 py-2 rounded-lg font-bold shadow-sm hover:bg-indigo-50 transition-all duration-200 flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Merit List
                </Link>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05, y: -3, boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)" }} whileTap={{ scale: 0.95 }} transition={{ type: "spring", stiffness: 400, damping: 10 }}>
                <Link to="/admin/applications" className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-4 py-2 rounded-lg font-bold shadow-md hover:shadow-lg transition-all duration-200 flex items-center gap-2 border-none">
                  <Users className="h-5 w-5" />
                  All Applications
                </Link>
              </motion.div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {statCards.map((stat, i) => (
              <motion.div 
                key={i} 
                initial={{ opacity: 0, y: 30, scale: 0.9 }} 
                animate={{ opacity: 1, y: 0, scale: 1 }} 
                whileHover={{ 
                  scale: 1.05, 
                  y: -10, 
                  boxShadow: "0 25px 35px -12px rgba(0, 0, 0, 0.25)",
                }} 
                transition={{ 
                  delay: i * 0.06, 
                  type: "spring", 
                  stiffness: 200, 
                  damping: 15 
                }} 
                className="relative overflow-hidden bg-white/90 backdrop-blur-xl rounded-2xl shadow-lg border border-white/60 p-6 flex items-center gap-4 cursor-pointer transition-all duration-300"
              >
                <div className={`absolute -right-6 -top-6 w-24 h-24 rounded-full bg-gradient-to-br ${stat.gradient} opacity-20 blur-xl animate-pulse-glow pointer-events-none`} />
                <motion.div
                  animate={{ y: [0, -5, 0] }}
                  transition={{ duration: 2.2 + i * 0.3, repeat: Infinity, ease: "easeInOut" }}
                  className={`relative w-14 h-14 rounded-2xl bg-gradient-to-br ${stat.gradient} flex items-center justify-center shadow-lg ${stat.shadow}`}
                >
                  <stat.icon className="h-7 w-7 text-white" />
                </motion.div>
                <div className="relative">
                  <p className="text-sm font-bold text-gray-500">{stat.title}</p>
                  <p className="text-3xl font-extrabold bg-gradient-to-r from-gray-900 via-gray-700 to-gray-900 bg-clip-text text-transparent">
                    <AnimatedCounter value={stat.value} />
                  </p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Visualizations Section */}
          {stats.weeklyData && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
              <motion.div 
                initial={{ opacity: 0, y: 20 }} 
                animate={{ opacity: 1, y: 0 }} 
                transition={{ delay: 0.3 }}
                whileHover={{ y: -8, boxShadow: "0 25px 35px -14px rgba(99,102,241,0.35)" }} className="relative overflow-hidden bg-white/90 backdrop-blur-xl rounded-2xl shadow-lg border border-indigo-100/70 p-6 hover:shadow-xl hover:shadow-indigo-100/40 transition-all duration-300"
              >
                <div className="absolute -right-10 -top-10 w-40 h-40 rounded-full bg-gradient-to-br from-indigo-300 to-purple-400 opacity-20 blur-2xl animate-pulse-glow pointer-events-none" />
                <div className="absolute -left-10 -bottom-10 w-40 h-40 rounded-full bg-gradient-to-br from-cyan-200 to-teal-300 opacity-20 blur-2xl animate-float-slow pointer-events-none" />
                <h3 className="relative text-lg font-bold flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-6">
                  <TrendingUp className="w-5 h-5 text-indigo-500 animate-bounce-soft" />
                  Application Trends
                </h3>
                <div className="relative h-80 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={stats.weeklyData}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                      <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#6B7280' }} dy={10} />
                      <YAxis axisLine={false} tickLine={false} tick={{ fill: '#6B7280' }} />
                      <Tooltip 
                        cursor={{ fill: '#F3F4F6' }}
                        contentStyle={{ borderRadius: '0.5rem', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                      />
                      <Legend iconType="circle" wrapperStyle={{ paddingTop: '20px' }} />
                      <Bar dataKey="applications" name="Total Applications" fill="#6366F1" radius={[4, 4, 0, 0]} maxBarSize={40} />
                      <Bar dataKey="pendingVerifications" name="Pending Verifications" fill="#FBBF24" radius={[4, 4, 0, 0]} maxBarSize={40} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </motion.div>

              <motion.div 
                initial={{ opacity: 0, y: 20 }} 
                animate={{ opacity: 1, y: 0 }} 
                transition={{ delay: 0.4 }}
                whileHover={{ y: -8, boxShadow: "0 25px 35px -14px rgba(16,185,129,0.35)" }} className="relative overflow-hidden bg-white/90 backdrop-blur-xl rounded-2xl shadow-lg border border-emerald-100/70 p-6 hover:shadow-xl hover:shadow-emerald-100/40 transition-all duration-300"
              >
                <div className="absolute -right-10 -top-10 w-40 h-40 rounded-full bg-gradient-to-br from-emerald-300 to-teal-400 opacity-20 blur-2xl animate-pulse-glow pointer-events-none" />
                <div className="relative flex items-center justify-between mb-6">
                  <h3 className="text-lg font-bold flex items-center gap-2 bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                    <Wallet className="w-5 h-5 text-emerald-500 animate-bounce-soft" />
                    Revenue Generation
                  </h3>
                  <motion.div
                    animate={{ scale: [1, 1.06, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="bg-gradient-to-r from-emerald-500 to-teal-500 p-2.5 rounded-xl flex items-center gap-2 shadow-lg shadow-emerald-500/30"
                  >
                    <IndianRupee className="h-5 w-5 text-white" />
                    <span className="font-bold text-white text-sm">
                      Total: ₹{stats.weeklyData.reduce((acc: number, curr: any) => acc + curr.revenue, 0).toLocaleString()}
                    </span>
                  </motion.div>
                </div>
                <div className="relative h-80 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={stats.weeklyData}>
                      <defs>
                        <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#34D399" stopOpacity={0.8}/>
                          <stop offset="95%" stopColor="#34D399" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                      <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#6B7280' }} dy={10} />
                      <YAxis 
                        axisLine={false} 
                        tickLine={false} 
                        tick={{ fill: '#6B7280' }} 
                        tickFormatter={(value) => `₹${value}`}
                      />
                      <Tooltip 
                        contentStyle={{ borderRadius: '0.5rem', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                        formatter={(value: any) => [`₹${value != null ? Number(value).toLocaleString() : 'N/A'}`, 'Revenue']}
                      />
                      <Area type="monotone" dataKey="revenue" stroke="#059669" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </motion.div>
            </div>
          )}

          {/* Demographics & Status Section */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
            <motion.div 
              initial={{ opacity: 0, y: 20 }} 
              animate={{ opacity: 1, y: 0 }} 
              transition={{ delay: 0.5 }}
              whileHover={{ y: -4, boxShadow: "0 25px 35px -14px rgba(245,158,11,0.3)" }} className="relative overflow-hidden bg-white/90 backdrop-blur-xl rounded-2xl shadow-lg border border-amber-100/70 p-6 hover:shadow-xl hover:shadow-amber-100/40 transition-all duration-300"
            >
              <div className="absolute -left-10 -top-10 w-40 h-40 rounded-full bg-gradient-to-br from-amber-300 to-orange-400 opacity-20 blur-2xl animate-float-slow pointer-events-none" />
              <h3 className="relative text-lg font-bold flex items-center gap-2 bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent mb-6">
                <Sparkles className="w-5 h-5 text-amber-500 animate-spin-slow" />
                Status Distribution
              </h3>
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={[
                        { name: 'Draft', value: stats.draft },
                        { name: 'Submitted', value: stats.submitted },
                        { name: 'Under Review', value: stats.underReview },
                        { name: 'Correction Req.', value: stats.correctionRequired || 0 },
                        { name: 'Approved', value: stats.approved },
                        { name: 'Rejected', value: stats.rejected || 0 },
                      ].filter(item => item.value > 0)}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {[
                        { name: 'Draft', value: stats.draft },
                        { name: 'Submitted', value: stats.submitted },
                        { name: 'Under Review', value: stats.underReview },
                        { name: 'Correction Req.', value: stats.correctionRequired || 0 },
                        { name: 'Approved', value: stats.approved },
                        { name: 'Rejected', value: stats.rejected || 0 },
                      ].filter(item => item.value > 0).map((entry, index) => {
                        const colors: any = {
                          'Draft': '#94A3B8',
                          'Submitted': '#3B82F6',
                          'Under Review': '#F59E0B',
                          'Correction Req.': '#EF4444',
                          'Approved': '#22C55E',
                          'Rejected': '#DC2626'
                        };
                        return <Cell key={`cell-${index}`} fill={colors[entry.name]} />;
                      })}
                    </Pie>
                    <Tooltip contentStyle={{ borderRadius: '0.5rem', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }} />
                    <Legend iconType="circle" />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }} 
              animate={{ opacity: 1, y: 0 }} 
              transition={{ delay: 0.6 }}
              whileHover={{ y: -4, boxShadow: "0 25px 35px -14px rgba(147,51,234,0.3)" }} className="relative overflow-hidden bg-white/90 backdrop-blur-xl rounded-2xl shadow-lg border border-purple-100/70 p-6 lg:col-span-2 hover:shadow-xl hover:shadow-purple-100/40 transition-all duration-300"
            >
              <div className="absolute -right-10 -bottom-10 w-40 h-40 rounded-full bg-gradient-to-br from-purple-300 to-pink-400 opacity-20 blur-2xl animate-float-medium pointer-events-none" />
              <h3 className="relative text-lg font-bold flex items-center gap-2 bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent mb-6">
                <Users className="w-5 h-5 text-purple-500 animate-bounce-soft" />
                Demographics (Category & Gender)
              </h3>
              <div className="relative grid grid-cols-1 md:grid-cols-2 gap-4 h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={stats.demographics || []} layout="vertical" margin={{ top: 0, right: 30, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#E5E7EB" />
                    <XAxis type="number" axisLine={false} tickLine={false} tick={{ fill: '#6B7280' }} />
                    <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fill: '#4B5563', fontWeight: 500 }} width={80} />
                    <Tooltip cursor={{ fill: '#F3F4F6' }} contentStyle={{ borderRadius: '0.5rem', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }} />
                    <Bar dataKey="value" name="Applicants" fill="#7C3AED" radius={[0, 4, 4, 0]} barSize={24} />
                  </BarChart>
                </ResponsiveContainer>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={stats.genderDistribution || []}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      dataKey="value"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${((percent ?? 0) * 100).toFixed(0)}%`}
                    >
                      {(stats.genderDistribution || []).map((entry: any, index: number) => {
                        const colors = ['#60A5FA', '#F472B6', '#34D399', '#FBBF24'];
                        return <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />;
                      })}
                    </Pie>
                    <Tooltip contentStyle={{ borderRadius: '0.5rem', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </motion.div>
          </div>

                    <ApplicationStatusChecker />

          <AdminAdvancedFeatures stats={stats} />
        </div>
      </div>
    </div>
  );
}