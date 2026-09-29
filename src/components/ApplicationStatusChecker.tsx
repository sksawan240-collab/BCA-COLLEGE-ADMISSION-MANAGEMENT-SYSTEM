import React, { useState } from 'react';
import axios from 'axios';
import { motion } from 'motion/react';
import { Link } from 'react-router';
import { Search, Loader2, FileText, Mail, Phone, BookOpen, IndianRupee, Calendar, ExternalLink, X, User } from 'lucide-react';
import toast from 'react-hot-toast';

export default function ApplicationStatusChecker() {
  const [applicationNumber, setApplicationNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = applicationNumber.trim();
    if (!trimmed) {
      toast.error('Please enter an application number');
      return;
    }
    setLoading(true);
    setResult(null);
    try {
      const res = await axios.get(`/api/admin/applications/number/${encodeURIComponent(trimmed)}`);
      setResult(res.data);
      toast.success('Application found');
    } catch (err: any) {
      if (err.response?.status === 404) {
        toast.error('No application found with that number');
      } else {
        toast.error(err.response?.data?.message || 'Failed to look up application');
      }
      setResult(null);
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setResult(null);
    setApplicationNumber('');
  };

  const statusColor = (status: string) => {
    const colors: Record<string, string> = {
      Approved: 'bg-green-100 text-green-800 border-green-200',
      Rejected: 'bg-red-100 text-red-800 border-red-200',
      'Under Review': 'bg-amber-100 text-amber-800 border-amber-200',
      'Correction Required': 'bg-orange-100 text-orange-800 border-orange-200',
      Submitted: 'bg-blue-100 text-blue-800 border-blue-200',
      Draft: 'bg-slate-100 text-slate-700 border-slate-200',
      'Documents Rejected': 'bg-rose-100 text-rose-800 border-rose-200',
      'Documents Pending': 'bg-yellow-100 text-yellow-800 border-yellow-200',
      'Email Verification Pending': 'bg-purple-100 text-purple-800 border-purple-200',
    };
    return colors[status] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const paymentColor = (status: string) => {
    if (status === 'Completed') return 'bg-green-100 text-green-800 border-green-200';
    if (status === 'Failed') return 'bg-red-100 text-red-800 border-red-200';
    return 'bg-amber-100 text-amber-800 border-amber-200';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5, type: 'spring', stiffness: 200, damping: 15 }}
      className="relative overflow-hidden bg-white/90 backdrop-blur-xl rounded-2xl shadow-lg border border-indigo-100/70 p-6 mb-8"
    >
      <div className="absolute -right-10 -top-10 w-40 h-40 rounded-full bg-gradient-to-br from-indigo-300 to-purple-400 opacity-20 blur-2xl animate-pulse-glow pointer-events-none" />
      <div className="absolute -left-10 -bottom-10 w-40 h-40 rounded-full bg-gradient-to-br from-cyan-200 to-teal-300 opacity-20 blur-2xl animate-float-slow pointer-events-none" />

      <h3 className="relative text-lg font-bold flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-5">
        <Search className="w-5 h-5 text-indigo-500" />
        Application Status Lookup
      </h3>

      {/* Search Form */}
      <form onSubmit={handleSearch} className="relative flex flex-col sm:flex-row gap-3">
        <div className="flex-1 relative">
          <input
            type="text"
            value={applicationNumber}
            onChange={(e) => setApplicationNumber(e.target.value)}
            placeholder="Enter Application Number (e.g. SU-BCA-2026-000001)"
            className="w-full pl-4 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 text-sm transition-colors"
            disabled={loading}
          />
        </div>
        <motion.button
          type="submit"
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          transition={{ type: 'spring', stiffness: 400, damping: 10 }}
          disabled={loading || !applicationNumber.trim()}
          className="px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg font-medium shadow-md hover:shadow-lg disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition-all duration-200"
        >
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
                    {loading ? 'Searching...' : 'Check Status'}
        </motion.button>
      </form>

      {/* Results */}
      {result && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: 'spring', stiffness: 200, damping: 15 }}
          className="mt-5"
        >
          <div className="flex justify-between items-start mb-4 flex-wrap gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg">
                <FileText className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="text-xs text-gray-500">Application Number</p>
                <p className="text-lg font-extrabold text-gray-900">{result.app?.applicationNumber || 'N/A'}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${statusColor(result.app?.status || '')}`}>
                {result.app?.status}
              </span>
              <Link
                to={`/admin/applications/${result.app?._id}`}
                className="text-indigo-600 hover:text-indigo-800 font-medium text-sm flex items-center gap-1"
                title="Open full application review"
              >
                Full Review <ExternalLink className="h-3 w-3" />
              </Link>
                            <button
                onClick={reset}
                className="text-gray-400 hover:text-gray-600 p-1 rounded"
                title="New search"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>

          {result.app && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              {/* Applicant */}
              <div className="bg-gray-50/80 rounded-xl p-4 border border-gray-100">
                <p className="text-xs text-gray-500 mb-1 flex items-center gap-1"><User className="h-3 w-3" /> Applicant</p>
                <p className="font-semibold text-gray-900">{result.app.studentId?.name || 'N/A'}</p>
                <p className="text-xs text-gray-500 mt-0.5">ID: {result.app.studentId?._id?.substring(0, 8) || 'N/A'}</p>
              </div>
              {/* Contact */}
              <div className="bg-gray-50/80 rounded-xl p-4 border border-gray-100">
                <p className="text-xs text-gray-500 mb-1 flex items-center gap-1"><Mail className="h-3 w-3" /> Contact</p>
                <div className="flex flex-col text-gray-700">
                  <span className="flex items-center gap-1"><Mail className="h-3 w-3 text-gray-400" /> {result.app.studentId?.email || 'N/A'}</span>
                  <span className="flex items-center gap-1 mt-0.5"><Phone className="h-3 w-3 text-gray-400" /> {result.app.studentId?.mobile || 'N/A'}</span>
                </div>
              </div>
              {/* Course */}
              <div className="bg-gray-50/80 rounded-xl p-4 border border-gray-100">
                <p className="text-xs text-gray-500 mb-1 flex items-center gap-1"><BookOpen className="h-3 w-3" /> Course</p>
                <p className="font-medium text-gray-900">{result.app.course || 'N/A'}</p>
                <p className="text-xs text-gray-500 mt-0.5">Academic Year: {result.app.academicYear || 'N/A'}</p>
              </div>
              {/* Payment */}
              <div className="bg-gray-50/80 rounded-xl p-4 border border-gray-100">
                <p className="text-xs text-gray-500 mb-1 flex items-center gap-1"><IndianRupee className="h-3 w-3" /> Payment</p>
                <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${paymentColor(result.app.paymentStatus || '')}`}>
                  {result.app.paymentStatus || 'N/A'}
                </span>
                {result.app.admissionFeeStatus && result.app.admissionFeeStatus !== 'Pending' && (
                  <p className="text-xs text-gray-500 mt-1">Admission Fee: {result.app.admissionFeeStatus}</p>
                )}
              </div>
              {/* Documents */}
              <div className="bg-gray-50/80 rounded-xl p-4 border border-gray-100 md:col-span-2">
                <p className="text-xs text-gray-500 mb-1 flex items-center gap-1"><FileText className="h-3 w-3" /> Documents</p>
                {result.docs && result.docs.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {result.docs.map((doc: any) => (
                      <span
                        key={doc._id}
                        className={`px-2.5 py-1 rounded-lg text-xs font-medium capitalize border ${
                          doc.status === 'Verified'
                            ? 'bg-green-100 text-green-800 border-green-200'
                            : doc.status === 'Rejected'
                            ? 'bg-red-100 text-red-800 border-red-200'
                            : 'bg-amber-100 text-amber-800 border-amber-200'
                        }`}
                      >
                        {doc.documentType}: {doc.status}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-gray-400">No documents found</p>
                )}
              </div>
              {/* Submitted */}
              <div className="bg-gray-50/80 rounded-xl p-4 border border-gray-100">
                <p className="text-xs text-gray-500 mb-1 flex items-center gap-1"><Calendar className="h-3 w-3" /> Submitted</p>
                <p className="font-medium text-gray-900">
                  {result.app.submittedAt
                    ? new Date(result.app.submittedAt).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })
                    : 'Not submitted'}
                </p>
              </div>
            </div>
          )}
        </motion.div>
      )}

      {/* Not found hint after a search with input */}
      {!loading && !result && applicationNumber.trim() && (
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-4 text-sm text-gray-500">
          No application found. Double-check the application number or try a different one.
        </motion.p>
      )}
    </motion.div>
  );
}

