import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';
import { Link } from 'react-router';
import { ApplicationData, DocumentData } from '../../types';
import { FileText, CheckCircle, Clock, AlertCircle, ChevronRight, Upload, CreditCard, User, Megaphone, X, Sparkles, GraduationCap } from 'lucide-react';
import toast from 'react-hot-toast';
import AnimatedCounter from '../../components/AnimatedCounter';
import ScholarshipCalculator from '../../components/ScholarshipCalculator';
import FeePayment from '../../components/FeePayment';
import RequiredDocumentChecklist from '../../components/RequiredDocumentChecklist';
import Chatbot from '../../components/Chatbot';
import StudentAdvancedFeatures from '../../components/StudentAdvancedFeatures';

const containerVariants = {
  hidden: { opacity: 0 },
  show: { 
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants: any = {
  hidden: { opacity: 0, y: 50, scale: 0.9 },
  show: { 
    opacity: 1, 
    y: 0, 
    scale: 1,
    transition: { type: 'spring', stiffness: 120, damping: 10, mass: 0.8 } 
  }
};

export default function StudentDashboard() {
  const { user } = useAuth();
  const [application, setApplication] = useState<ApplicationData | null>(null);
  const [documents, setDocuments] = useState<DocumentData[]>([]);
  const [loading, setLoading] = useState(true);
  const [previewDoc, setPreviewDoc] = useState<DocumentData | null>(null);

  useEffect(() => {
    if (user) {
      fetchDashboardData();
    }
  }, [user]);

  const fetchDashboardData = async () => {
    try {
      const [appRes, docsRes] = await Promise.all([
        axios.get('/api/student/application'),
        axios.get('/api/student/documents')
      ]);
      setApplication(Object.keys(appRes.data).length === 0 ? null : appRes.data);
      setDocuments(docsRes.data);
    } catch (err) {
      console.error(err);
      toast.error('Failed to fetch dashboard data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div></div>;
  }

  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'Draft': return 'bg-gray-100 text-gray-700';
      case 'Submitted': return 'bg-blue-100 text-blue-700';
      case 'Under Review': return 'bg-yellow-100 text-yellow-700';
      case 'Correction Required': return 'bg-red-100 text-red-700';
      case 'Approved': return 'bg-green-100 text-green-700';
      case 'Rejected': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusIcon = (status?: string) => {
    switch (status) {
      case 'Approved': return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'Rejected': return <AlertCircle className="h-5 w-5 text-red-600" />;
      case 'Correction Required': return <AlertCircle className="h-5 w-5 text-orange-600" />;
      default: return <Clock className="h-5 w-5 text-blue-600" />;
    }
  };

  const getPipelineProgress = () => {
    if (!application || application.status === 'Draft') return -1;
    if (application.status === 'Approved') return 3;
    
    let progress = 0; // Application Submitted
    
    if (application.status === 'Under Review' || application.status === 'Submitted') {
      progress = 1; // Documents Under Review
    }
    
    const allDocsVerified = documents.length > 0 && documents.every(d => d.status === 'Verified');
    if (allDocsVerified) {
      progress = 2; // Documents Verified
    }
    
    return progress;
  };

  const progressSteps = ['Application Submitted', 'Documents Under Review', 'Documents Verified', 'Admission Granted'];
  const currentProgress = getPipelineProgress();

  const isSubmitted = !!application && application.status !== 'Draft' && application.status !== 'Correction Required';
  const requiredDocs = ['Passport Photo', '10th Marks Card', '12th Marks Card', 'Aadhaar Card'];
  const hasProfile = application !== null;
  const hasAllDocs = requiredDocs.every(type => documents.some(d => d.documentType === type));
  const hasPayment = application?.paymentStatus === 'Completed';

  const submissionSteps = [
    { label: 'Profile Details', completed: hasProfile },
    { label: 'Upload Documents', completed: hasAllDocs },
    { label: 'Fee Payment', completed: hasPayment },
    { label: 'Submit App', completed: isSubmitted }
  ];

  let subProgress = -1;
  if (hasProfile) subProgress = 0;
  if (hasProfile && hasAllDocs) subProgress = 1;
  if (hasProfile && hasAllDocs && hasPayment) subProgress = 2;
  if (isSubmitted) subProgress = 3;

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="show" className="relative min-h-screen bg-gradient-to-br from-blue-50/80 via-white/40 to-purple-100/60 dark:from-gray-900/70 dark:to-blue-950/40 text-gray-900 dark:text-white px-4 sm:px-6 lg:px-8 py-8">
      <motion.div
        variants={itemVariants}
        initial="hidden"
        animate="show"
        transition={{ delay: 0.1 }}
        className="mb-8"
      >
        <motion.div className="flex items-center gap-3">
          <motion.div
            whileHover={{ rotate: 180, scale: 1.1 }}
            transition={{ type: 'spring', stiffness: 200, damping: 12 }}
            className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center shadow-lg shadow-purple-500/30 animate-pulse-glow"
          >
            <GraduationCap className="h-6 w-6 text-white" />
          </motion.div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 animate-gradient-x">
            Welcome, {user?.name}
          </h1>
          <Sparkles className="w-6 h-6 text-yellow-500 animate-bounce-soft" />
        </motion.div>
        <p className="text-gray-600 dark:text-gray-400 mt-2 flex items-center gap-2">
          <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          Track your BCA admission application progress.
        </p>
      </motion.div>

      {/* Progress Tracker */}
      <motion.div
        variants={itemVariants}
        initial="hidden"
        animate="show"
        transition={{ delay: 0.2 }}
        whileHover={{ y: -4, boxShadow: '0 20px 30px -10px rgba(99, 102, 241, 0.25)' }}
        className="relative overflow-hidden bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm rounded-2xl shadow-lg border border-indigo-100 dark:border-indigo-900/40 p-6 sm:p-8 mb-8"
      >
        {/* subtle gradient wash */}
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-50/80 via-transparent to-pink-50/60 dark:from-indigo-900/10 dark:via-transparent dark:to-pink-900/10 pointer-events-none" />
        <div className="relative">
          <h3 className="text-lg font-bold flex items-center gap-2 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 bg-clip-text text-transparent mb-6">
            <Sparkles className="w-5 h-5 text-purple-500 animate-spin-slow" />
            {isSubmitted ? 'Admission Progress' : 'Application Setup'}
          </h3>
        </div>
        <div className="relative">
          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${Math.max(0, ((isSubmitted ? currentProgress : subProgress) / ((isSubmitted ? progressSteps.length : submissionSteps.length) - 1)) * 100)}%` }}
            transition={{ duration: 1.2, ease: 'easeOut' }}
            className="absolute left-0 top-1/2 -translate-y-1/2 h-1.5 rounded-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 shadow-md shadow-purple-500/40 overflow-hidden"
          >
            <div className="absolute inset-0 animate-shimmer bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.7),transparent)]" />
          </motion.div>
          <div className="relative flex justify-between">
            {(isSubmitted ? progressSteps : submissionSteps.map(s => s.label)).map((step, index) => {
              let isCompleted = false;
              let isActuallyActive = false;
              
              if (isSubmitted) {
                isCompleted = index <= currentProgress;
                const isActive = index === currentProgress + 1; // Highlight the *next* step to be done, or current if completed
                isActuallyActive = isActive || (index === currentProgress && currentProgress === progressSteps.length - 1);
              } else {
                isCompleted = submissionSteps[index].completed;
                const firstUncompletedIndex = submissionSteps.findIndex(s => !s.completed);
                isActuallyActive = index === firstUncompletedIndex;
              }
              
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.15 * index, type: 'spring', stiffness: 200, damping: 14 }}
                  className={`relative flex flex-col items-center ${isActuallyActive && !isCompleted ? 'animate-bounce-soft' : ''}`}
                >
                  <motion.div
                    whileHover={{ rotate: 360, scale: 1.15 }}
                    transition={{ type: 'spring', stiffness: 200, damping: 12 }}
                    className={`relative w-9 h-9 rounded-full flex items-center justify-center font-medium text-sm transition-all duration-300 ease-in-out z-10 
                    ${isCompleted ? 'bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 text-white shadow-lg shadow-purple-500/40' : 'bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-300'} 
                    ${isActuallyActive && !isCompleted ? 'ring-4 ring-purple-200 dark:ring-purple-900/50 bg-white dark:bg-gray-800 text-purple-600 dark:text-purple-300 scale-110' : ''}`}
                  >
                    {isCompleted ? <CheckCircle className="h-5 w-5" /> : index + 1}
                    {isActuallyActive && !isCompleted && (
                      <span className="absolute inset-0 rounded-full ring-4 ring-purple-300/60 animate-ring-ping" />
                    )}
                  </motion.div>
                  <span className={`mt-3 text-xs sm:text-sm font-medium text-center hidden sm:block max-w-[90px] leading-tight
                    ${isCompleted || isActuallyActive ? 'text-purple-600 dark:text-purple-300' : 'text-gray-500 dark:text-gray-500'}`}>
                    {step}
                  </span>
                </motion.div>
              );
            })}
          </div>
        </div>
      </motion.div>

      <motion.div
        variants={itemVariants}
        initial="hidden"
        animate="show"
        transition={{ delay: 0.3 }}
        className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8"
      >
        <motion.div
          whileHover={{ y: -8, scale: 1.03, boxShadow: "0 25px 35px -12px rgba(59, 130, 246, 0.4)" }}
          transition={{ type: "spring", stiffness: 300, damping: 10 }}
          className="relative overflow-hidden bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-600 rounded-2xl shadow-xl shadow-blue-500/20 border border-white/20 p-6 transition-all duration-300"
        >
          <div className="absolute -right-8 -top-8 w-32 h-32 rounded-full bg-white/20 blur-2xl animate-pulse-glow pointer-events-none" />
          <div className="relative flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-white drop-shadow">Application Status</h3>
            <motion.div
              animate={{ y: [0, -5, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              className="w-11 h-11 rounded-full bg-white/20 backdrop-blur flex items-center justify-center"
            >
              {getStatusIcon(application?.status || 'Not Started')}
            </motion.div>
          </div>
          {application ? (
            <>
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200, damping: 12, delay: 0.4 }}
                className={`inline-flex items-center px-4 py-1.5 rounded-full text-sm font-bold shadow-lg ${getStatusColor(application.status)}`}
              >
                {application.status}
              </motion.span>
              {application.applicationNumber && (
                <p className="mt-3 text-sm text-white/80 font-mono">App No: {application.applicationNumber}</p>
              )}
            </>
          ) : (
            <span className="inline-flex items-center px-4 py-1.5 rounded-full text-sm font-bold bg-white/20 text-white backdrop-blur">
              Not Started
            </span>
          )}
        </motion.div>

        <motion.div
          whileHover={{ y: -8, scale: 1.03, boxShadow: "0 25px 35px -12px rgba(16, 185, 129, 0.4)" }}
          transition={{ type: "spring", stiffness: 300, damping: 10 }}
          className="relative overflow-hidden bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-600 rounded-2xl shadow-xl shadow-emerald-500/20 border border-white/20 p-6 transition-all duration-300"
        >
          <div className="absolute -left-8 -bottom-8 w-32 h-32 rounded-full bg-white/20 blur-2xl animate-pulse-glow pointer-events-none" />
          <div className="relative flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-white drop-shadow">Next Step</h3>
            <motion.div
              animate={{ x: [0, 6, 0] }}
              transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
              className="w-9 h-9 rounded-full bg-white/20 backdrop-blur flex items-center justify-center"
            >
              <ChevronRight className="h-5 w-5 text-white" />
            </motion.div>
          </div>
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
          {!application ? (
            <Link to="/student/application" className="inline-block bg-white text-emerald-700 px-4 py-2 rounded-lg text-sm font-bold shadow hover:bg-emerald-50 transition-colors">Start Application</Link>
          ) : application.status === 'Draft' || application.status === 'Correction Required' ? (
            <Link to="/student/application" className="inline-block bg-white text-emerald-700 px-4 py-2 rounded-lg text-sm font-bold shadow hover:bg-emerald-50 transition-colors">Continue Application</Link>
          ) : (
            <p className="text-sm text-white/90">Your application is submitted and under review.</p>
          )}
          </motion.div>
        </motion.div>
      </motion.div>

      <motion.div
        variants={itemVariants}
        initial="hidden"
        animate="show"
        transition={{ delay: 0.4 }}
        className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8"
      >
        {/* Document Checklist */}
        <RequiredDocumentChecklist
          documents={documents}
          onPreview={setPreviewDoc}
        />

        {/* Quick Links */}
        <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm rounded-2xl shadow-lg border border-indigo-100 dark:border-indigo-900/40 overflow-hidden">
          <div className="px-6 py-5 border-b border-indigo-100 dark:border-indigo-900/40 bg-gradient-to-r from-indigo-50/80 via-purple-50/60 to-pink-50/60 dark:from-gray-900 dark:to-gray-900">
            <h3 className="text-lg font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 bg-clip-text text-transparent flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-purple-500 animate-spin-slow" />
              Quick Links
            </h3>
          </div>
          <div className="divide-y divide-gray-200 dark:divide-gray-800">
            <motion.div whileHover={{ x: 5, backgroundColor: 'rgba(243, 244, 246, 1)', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }} transition={{ type: "spring", stiffness: 400, damping: 20 }}>
              <Link to="/student/profile" className="flex items-center px-6 py-4 transition-all duration-200 group">
                <div className="mr-4 w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-md shadow-blue-500/30 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
                  <User className="h-5 w-5 text-white" />
                </div>
                <div className="flex-1">
                  <h4 className="text-sm font-bold text-gray-900 dark:text-white">Profile Management</h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Update contact details, address, and profile picture</p>
                </div>
                <ChevronRight className="h-5 w-5 text-gray-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all duration-300" />
              </Link>
            </motion.div>
            <motion.div whileHover={{ x: 5, backgroundColor: 'rgba(243, 244, 246, 0.7)', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }} transition={{ type: "spring", stiffness: 400, damping: 20 }}>
              <Link to="/student/application" className="flex items-center px-6 py-4 transition-all duration-200 group">
                <div className="mr-4 w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center shadow-md shadow-purple-500/30 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
                  <FileText className="h-5 w-5 text-white" />
                </div>
                <div className="flex-1">
                  <h4 className="text-sm font-bold text-gray-900 dark:text-white">Application Form</h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400">View or edit your personal and academic details</p>
                </div>
                <ChevronRight className="h-5 w-5 text-gray-400 group-hover:text-purple-600 group-hover:translate-x-1 transition-all duration-300" />
              </Link>
            </motion.div>
            <motion.div whileHover={{ x: 5, backgroundColor: 'rgba(243, 244, 246, 0.7)', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }} transition={{ type: "spring", stiffness: 400, damping: 20 }}>
              <Link to="/student/documents" className="flex items-center px-6 py-4 transition-all duration-200 group">
                <div className="mr-4 w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-cyan-600 flex items-center justify-center shadow-md shadow-emerald-500/30 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
                  <Upload className="h-5 w-5 text-white" />
                </div>
                <div className="flex-1">
                  <h4 className="text-sm font-bold text-gray-900 dark:text-white">Document Upload</h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Upload your required marksheets and identity proofs</p>
                </div>
                <ChevronRight className="h-5 w-5 text-gray-400 group-hover:text-emerald-600 group-hover:translate-x-1 transition-all duration-300" />
              </Link>
            </motion.div>
          </div>
        </div>
      </motion.div>
<StudentAdvancedFeatures documents={documents} application={application} />


      <motion.div
        variants={itemVariants}
        initial="hidden"
        animate="show"
        transition={{ delay: 0.5 }}
        className="mb-8"
      >
        <ScholarshipCalculator />
      </motion.div>

      {/* Document Preview Modal */}
      <AnimatePresence>
        {previewDoc && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center px-4 pt-4 pb-20 text-center sm:p-0">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-gray-900/75 backdrop-blur-sm transition-opacity"
              onClick={() => setPreviewDoc(null)}
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative inline-block align-bottom bg-white dark:bg-gray-900 rounded-2xl text-left overflow-hidden shadow-2xl transform transition-all sm:my-8 sm:align-middle w-full max-w-4xl max-h-[90vh] flex flex-col"
            >
              <div className="bg-white dark:bg-gray-900 px-6 py-4 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between shrink-0">
                <div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white">{previewDoc.documentType}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{previewDoc.originalName}</p>
                </div>
                <button
                  onClick={() => setPreviewDoc(null)}
                  className="bg-gray-100 dark:bg-gray-800 p-2 rounded-full text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="p-6 bg-gray-50 dark:bg-gray-950 flex-1 overflow-auto flex items-center justify-center min-h-[50vh]">
                {previewDoc.filePath.toLowerCase().endsWith('.pdf') ? (
                  <iframe
                    src={`/${previewDoc.filePath}`}
                    className="w-full h-[60vh] rounded-lg border border-gray-300 dark:border-gray-700 shadow-sm"
                    title={previewDoc.documentType}
                  />
                ) : (
                  <img
                    src={`/${previewDoc.filePath}`}
                    alt={previewDoc.documentType}
                    className="max-w-full max-h-[70vh] rounded-lg shadow-md object-contain border border-gray-200 dark:border-gray-800"
                  />
                )}
              </div>

              <div className="bg-white dark:bg-gray-900 px-6 py-4 border-t border-gray-200 dark:border-gray-800 flex justify-end shrink-0">
                <a
                  href={`/${previewDoc.filePath}`}
                  target="_blank"
                  rel="noreferrer"
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors shadow-sm"
                >
                  Open in New Tab
                </a>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      <Chatbot />
      {/* Animated colorful background */}
      <motion.div
        className="fixed top-0 left-0 w-full h-full -z-10"
        style={{
          background: 'linear-gradient(45deg, #f0f9ff, #e0f2fe, #d0e7fd, #dbeafe, #ede9fe, #fce7f3, #cffafe, #d1fae5)',
          backgroundSize: '400% 400%',
        }}
        animate={{
          backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
        }}
        transition={{
          duration: 22,
          ease: 'linear',
          repeat: Infinity,
        }}
      />
      {/* Floating colorful orbs */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-[-6rem] left-[-4rem] w-72 h-72 rounded-full bg-gradient-to-br from-blue-400 to-indigo-500 opacity-30 blur-3xl animate-float-slow" />
        <div className="absolute top-1/3 right-[-5rem] w-80 h-80 rounded-full bg-gradient-to-br from-fuchsia-400 to-pink-500 opacity-25 blur-3xl animate-float-medium" />
        <div className="absolute bottom-[-6rem] left-1/4 w-72 h-72 rounded-full bg-gradient-to-br from-emerald-300 to-cyan-400 opacity-30 blur-3xl animate-float-fast" />
        <div className="absolute top-2/3 left-[-5rem] w-64 h-64 rounded-full bg-gradient-to-br from-amber-300 to-orange-400 opacity-25 blur-3xl animate-float-slow" />
        <div className="absolute bottom-1/4 right-1/4 w-56 h-56 rounded-full bg-gradient-to-br from-violet-400 to-purple-500 opacity-25 blur-3xl animate-float-medium" />
      </div>
    </motion.div>
  );
}