import React, { useEffect, useState, useMemo } from 'react';
import axios from 'axios';
import { motion } from 'motion/react';
import {
  Search,
  Loader2,
  Download,
  Users as UsersIcon,
  ShieldCheck,
  UserX,
  Trash2,
  UserCheck,
  User as StudentIcon,
  ShieldOff,
  RefreshCw,
} from 'lucide-react';
import toast from 'react-hot-toast';

interface UserRow {
  _id: string;
  name: string;
  email: string;
  mobile?: string;
  role: 'student' | 'admin';
  emailVerified: boolean;
  accountStatus: 'active' | 'suspended';
  profilePicture?: string;
  address?: string;
  createdAt?: string;
  updatedAt?: string;
}

interface Stats {
  totalStudents: number;
  totalAdmins: number;
  totalSuspended: number;
}

export default function Users() {
  const [users, setUsers] = useState<UserRow[]>([]);
  const [stats, setStats] = useState<Stats>({ totalStudents: 0, totalAdmins: 0, totalSuspended: 0 });
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [busyId, setBusyId] = useState<string | null>(null);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await axios.get('/api/admin/users', { params: { limit: 1000 } });
      setUsers(res.data.users || []);
      setStats(res.data.stats || { totalStudents: 0, totalAdmins: 0, totalSuspended: 0 });
    } catch (err: any) {
      console.error(err);
      toast.error(err.response?.data?.message || 'Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const filteredUsers = useMemo(() => {
    return users.filter((u) => {
      const q = search.trim().toLowerCase();
      const matchesSearch =
        !q ||
        u.name?.toLowerCase().includes(q) ||
        u.email?.toLowerCase().includes(q) ||
        (u.mobile || '').toLowerCase().includes(q);
      const matchesRole = roleFilter ? u.role === roleFilter : true;
      const matchesStatus = statusFilter ? u.accountStatus === statusFilter : true;
      return matchesSearch && matchesRole && matchesStatus;
    });
  }, [users, search, roleFilter, statusFilter]);

  const handleToggleStatus = async (u: UserRow) => {
    const next = u.accountStatus === 'active' ? 'suspended' : 'active';
    setBusyId(u._id);
    try {
      const res = await axios.put(`/api/admin/users/${u._id}`, { accountStatus: next });
      toast.success(next === 'active' ? 'Account activated' : 'Account suspended');
      setUsers((prev) =>
        prev.map((x) => (x._id === u._id ? { ...x, accountStatus: res.data.user.accountStatus } : x))
      );
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to update status');
    } finally {
      setBusyId(null);
    }
  };

  const handleToggleRole = async (u: UserRow) => {
    const next = u.role === 'admin' ? 'student' : 'admin';
    setBusyId(u._id);
    try {
      const res = await axios.put(`/api/admin/users/${u._id}`, { role: next });
      toast.success(next === 'admin' ? 'Promoted to Admin' : 'Demoted to Student');
      setUsers((prev) => prev.map((x) => (x._id === u._id ? { ...x, role: res.data.user.role } : x)));
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to update role');
    } finally {
      setBusyId(null);
    }
  };

  const handleDelete = async (u: UserRow) => {
    if (!window.confirm(`Are you sure you want to delete ${u.name} (${u.email})? This action cannot be undone.`)) {
      return;
    }
    setBusyId(u._id);
    try {
      await axios.delete(`/api/admin/users/${u._id}`);
      toast.success('User deleted');
      setUsers((prev) => prev.filter((x) => x._id !== u._id));
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to delete user');
    } finally {
      setBusyId(null);
    }
  };

  const exportToCSV = () => {
    const headers = ['Name', 'Email', 'Mobile', 'Role', 'Account Status', 'Email Verified', 'Joined'];
    const rows = filteredUsers.map((u) => [
      u.name || '',
      u.email || '',
      u.mobile || '',
      u.role || '',
      u.accountStatus || '',
      u.emailVerified ? 'Yes' : 'No',
      u.createdAt ? new Date(u.createdAt).toLocaleDateString() : '',
    ]);
    const csvContent = [
      headers.join(','),
      ...rows.map((row) => row.map((item) => `"${String(item).replace(/"/g, '""')}"`).join(',')),
    ].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `users_export_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const statCards = [
    { label: 'Total Users', value: users.length, icon: UsersIcon, color: 'bg-blue-100 text-blue-600' },
    { label: 'Students', value: stats.totalStudents, icon: StudentIcon, color: 'bg-purple-100 text-purple-600' },
    { label: 'Admins', value: stats.totalAdmins, icon: ShieldCheck, color: 'bg-emerald-100 text-emerald-600' },
    { label: 'Suspended', value: stats.totalSuspended, icon: UserX, color: 'bg-red-100 text-red-600' },
  ];

  if (loading && users.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="animate-spin h-10 w-10 text-blue-600" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
          <p className="text-gray-600">View and manage all registered students and administrators.</p>
        </div>
        <button
          onClick={fetchUsers}
          className="flex items-center gap-2 bg-white border border-gray-300 text-gray-700 px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors font-medium shadow-sm self-start sm:self-auto"
        >
          <RefreshCw className={`h-5 w-5 text-gray-500 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {statCards.map((card, i) => (
          <motion.div
            key={card.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 flex items-center gap-4"
          >
            <div className={`p-3 rounded-lg ${card.color}`}>
              <card.icon className="h-6 w-6" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900">{card.value}</div>
              <div className="text-sm text-gray-500">{card.label}</div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-4 border-b border-gray-200 flex flex-col sm:flex-row gap-4 justify-between bg-gray-50/50">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name, email or mobile..."
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div className="flex flex-col sm:flex-row gap-4">
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">All Roles</option>
              <option value="student">Students</option>
              <option value="admin">Admins</option>
            </select>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">All Statuses</option>
              <option value="active">Active</option>
              <option value="suspended">Suspended</option>
            </select>
            <button
              onClick={exportToCSV}
              className="flex items-center gap-2 bg-white border border-gray-300 text-gray-700 px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors font-medium shadow-sm"
              title="Export to CSV"
            >
              <Download className="h-5 w-5 text-gray-500" />
              <span className="hidden sm:inline">Export</span>
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 text-gray-600 text-sm border-b border-gray-200">
                <th className="px-6 py-4 font-medium">User</th>
                <th className="px-6 py-4 font-medium">Contact</th>
                <th className="px-6 py-4 font-medium">Role</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium">Verified</th>
                <th className="px-6 py-4 font-medium">Joined</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredUsers.map((u) => (
                <tr key={u._id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      {u.profilePicture ? (
                        <img src={u.profilePicture} alt={u.name} className="h-9 w-9 rounded-full object-cover" />
                      ) : (
                        <div className="h-9 w-9 rounded-full bg-gradient-to-br from-purple-600 to-pink-500 flex items-center justify-center text-white font-bold text-sm">
                          {(u.name || '?').charAt(0).toUpperCase()}
                        </div>
                      )}
                      <div>
                        <div className="text-gray-900 font-medium">{u.name}</div>
                        <div className="text-sm text-gray-500">{u.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">{u.mobile || '—'}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold ${
                        u.role === 'admin' ? 'bg-emerald-100 text-emerald-700' : 'bg-purple-100 text-purple-700'
                      }`}
                    >
                      {u.role === 'admin' ? (
                        <ShieldCheck className="h-3.5 w-3.5" />
                      ) : (
                        <StudentIcon className="h-3.5 w-3.5" />
                      )}
                      {u.role === 'admin' ? 'Admin' : 'Student'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        u.accountStatus === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {u.accountStatus === 'active' ? 'Active' : 'Suspended'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    {u.emailVerified ? (
                      <span className="text-green-600 text-sm font-medium">Verified</span>
                    ) : (
                      <span className="text-gray-400 text-sm">Pending</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {u.createdAt ? new Date(u.createdAt).toLocaleDateString() : '—'}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2">
                      {busyId === u._id ? (
                        <Loader2 className="h-5 w-5 animate-spin text-blue-600" />
                      ) : (
                        <>
                          <button
                            onClick={() => handleToggleRole(u)}
                            title={u.role === 'admin' ? 'Demote to Student' : 'Promote to Admin'}
                            className="p-2 rounded-lg text-gray-500 hover:bg-purple-50 hover:text-purple-600 transition-colors"
                          >
                            {u.role === 'admin' ? (
                              <ShieldOff className="h-4 w-4" />
                            ) : (
                              <ShieldCheck className="h-4 w-4" />
                            )}
                          </button>
                          <button
                            onClick={() => handleToggleStatus(u)}
                            title={u.accountStatus === 'active' ? 'Suspend account' : 'Activate account'}
                            className="p-2 rounded-lg text-gray-500 hover:bg-yellow-50 hover:text-yellow-600 transition-colors"
                          >
                            {u.accountStatus === 'active' ? <UserX className="h-4 w-4" /> : <UserCheck className="h-4 w-4" />}
                          </button>
                          <button
                            onClick={() => handleDelete(u)}
                            title="Delete user"
                            className="p-2 rounded-lg text-gray-500 hover:bg-red-50 hover:text-red-600 transition-colors"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
              {filteredUsers.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-gray-500">
                    No users found matching your criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}