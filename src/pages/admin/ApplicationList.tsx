import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router';
import { Search, Filter, Loader2, Download } from 'lucide-react';

export default function ApplicationList() {
  const [applications, setApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  useEffect(() => {
    const fetchApps = async () => {
      try {
        const res = await axios.get('/api/admin/applications');
        setApplications(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchApps();
  }, []);

  const filteredApps = applications.filter(app => {
    const matchesSearch = app.applicationNumber?.toLowerCase().includes(search.toLowerCase()) || 
                          app.studentId?.name.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter ? app.status === statusFilter : true;
    return matchesSearch && matchesStatus && app.status !== 'Draft'; // Usually admins don't care about Drafts
  });

  const exportToCSV = () => {
    const headers = [
      'Application No.',
      'Applicant Name',
      'Email',
      'Mobile',
      'Course',
      'Status',
      'Payment Status',
      'Date Submitted'
    ];

    const rows = filteredApps.map(app => [
      app.applicationNumber || 'N/A',
      app.studentId?.name || 'N/A',
      app.studentId?.email || 'N/A',
      app.studentId?.mobile || 'N/A',
      app.coursePref || 'BCA',
      app.status || 'N/A',
      app.paymentStatus || 'N/A',
      app.createdAt ? new Date(app.createdAt).toLocaleDateString() : 'N/A'
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(item => `"${String(item).replace(/"/g, '""')}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `applications_export_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Submitted': return 'bg-blue-100 text-blue-800';
      case 'Under Review': return 'bg-yellow-100 text-yellow-800';
      case 'Correction Required': return 'bg-orange-100 text-orange-800';
      case 'Approved': return 'bg-green-100 text-green-800';
      case 'Rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center"><Loader2 className="animate-spin h-10 w-10 text-blue-600" /></div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Applications</h1>
        <p className="text-gray-600">Manage student admissions</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-4 border-b border-gray-200 flex flex-col sm:flex-row gap-4 justify-between bg-gray-50">
          <div className="relative max-w-sm w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search by ID or Name..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500" 
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="h-5 w-5 text-gray-400" />
            <select 
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">All Statuses</option>
              <option value="Submitted">Submitted</option>
              <option value="Under Review">Under Review</option>
              <option value="Correction Required">Correction Required</option>
              <option value="Approved">Approved</option>
              <option value="Rejected">Rejected</option>
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
                <th className="px-6 py-4 font-medium">Application No.</th>
                <th className="px-6 py-4 font-medium">Applicant Name</th>
                <th className="px-6 py-4 font-medium">Course</th>
                <th className="px-6 py-4 font-medium">Date</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredApps.map(app => (
                <tr key={app._id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 font-medium text-gray-900">{app.applicationNumber || 'N/A'}</td>
                  <td className="px-6 py-4">
                    <div className="text-gray-900 font-medium">{app.studentId?.name}</div>
                    <div className="text-sm text-gray-500">{app.studentId?.email}</div>
                  </td>
                  <td className="px-6 py-4 text-gray-600">{app.course}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {app.submittedAt ? new Date(app.submittedAt).toLocaleDateString() : 'N/A'}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(app.status)}`}>
                      {app.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <Link to={`/admin/applications/${app._id}`} className="text-blue-600 hover:text-blue-800 font-medium text-sm">
                      Review
                    </Link>
                  </td>
                </tr>
              ))}
              {filteredApps.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                    No applications found matching your criteria.
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
