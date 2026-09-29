/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Routes, Route, Navigate } from 'react-router';
import { Toaster } from 'react-hot-toast';
import { useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import VerifyEmailPage from './pages/VerifyEmailPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import AcademicsPage from './pages/AcademicsPage';
import AdmissionsPage from './pages/AdmissionsPage';
import CampusLifePage from './pages/CampusLifePage';
import StudentDashboard from './pages/student/StudentDashboard';
import ApplicationForm from './pages/student/ApplicationForm';
import DocumentUpload from './pages/student/DocumentUpload';
import AdminDashboard from './pages/admin/AdminDashboard';
import ApplicationList from './pages/admin/ApplicationList';
import ApplicationReview from './pages/admin/ApplicationReview';
import MeritList from './pages/admin/MeritList';
import Settings from './pages/admin/Settings';
import Users from './pages/admin/Users';
import StudentProfile from './pages/student/StudentProfile';

const ProtectedRoute = ({ children, role }: { children: React.ReactNode, role: 'student' | 'admin' }) => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  if (user.role !== role) return <Navigate to="/" replace />;
  return <>{children}</>;
};

export default function App() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex flex-col font-sans selection:bg-purple-200 selection:text-purple-900 dark:selection:bg-purple-900 dark:selection:text-purple-200">
      <Toaster position="top-right" />
      <Navbar />
      <main className="flex-grow flex flex-col relative overflow-hidden">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/academics" element={<AcademicsPage />} />
          <Route path="/admissions" element={<AdmissionsPage />} />
          <Route path="/campus-life" element={<CampusLifePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/verify-email" element={<VerifyEmailPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />
          
          {/* Student Routes */}
          <Route path="/student/dashboard" element={<ProtectedRoute role="student"><StudentDashboard /></ProtectedRoute>} />
          <Route path="/student/profile" element={<ProtectedRoute role="student"><StudentProfile /></ProtectedRoute>} />
          <Route path="/student/application" element={<ProtectedRoute role="student"><ApplicationForm /></ProtectedRoute>} />
          <Route path="/student/documents" element={<ProtectedRoute role="student"><DocumentUpload /></ProtectedRoute>} />

          {/* Admin Routes */}
          <Route path="/admin/dashboard" element={<ProtectedRoute role="admin"><AdminDashboard /></ProtectedRoute>} />
          <Route path="/admin/applications" element={<ProtectedRoute role="admin"><ApplicationList /></ProtectedRoute>} />
          <Route path="/admin/merit-list" element={<ProtectedRoute role="admin"><MeritList /></ProtectedRoute>} />
          <Route path="/admin/settings" element={<ProtectedRoute role="admin"><Settings /></ProtectedRoute>} />
          <Route path="/admin/users" element={<ProtectedRoute role="admin"><Users /></ProtectedRoute>} />
          <Route path="/admin/applications/:id" element={<ProtectedRoute role="admin"><ApplicationReview /></ProtectedRoute>} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}