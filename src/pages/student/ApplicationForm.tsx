import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import { useNavigate } from 'react-router';
import { useAuth } from '../../context/AuthContext';
import { ApplicationData } from '../../types';
import { Check, ChevronLeft, ChevronRight, Save, Loader2, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';

export default function ApplicationForm() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [application, setApplication] = useState<ApplicationData | null>(null);
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState('');
  const [otpError, setOtpError] = useState('');
  const [resendTimer, setResendTimer] = useState(0);
  const [resending, setResending] = useState(false);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (resendTimer > 0) {
      timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [resendTimer]);

  const { register, handleSubmit, reset, watch, formState: { errors } } = useForm<ApplicationData>();
  const { user } = useAuth();

  useEffect(() => {
    const fetchApp = async () => {
      try {
        const res = await axios.get('/api/student/application');
        if (Object.keys(res.data).length > 0) {
          setApplication(res.data);
          reset(res.data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    if (user) {
      fetchApp();
    }
  }, [reset, user]);

  const onSaveDraft = async (data: ApplicationData) => {
    setSaving(true);
    try {
      const res = await axios.post('/api/student/application', data);
      setApplication(res.data);
      toast.success('Draft saved successfully');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Error saving draft');
    } finally {
      setSaving(false);
    }
  };

  const nextStep = async () => {
    handleSubmit(async (data) => {
      await onSaveDraft(data);
      setStep((prev) => Math.min(prev + 1, 5));
    })();
  };

  const prevStep = () => {
    setStep((prev) => Math.max(prev - 1, 1));
  };

  const requestFinalSubmission = async () => {
    setSubmitting(true);
    setResending(true);
    try {
      await axios.post('/api/student/application/submit-request');
      setOtpSent(true);
      setResendTimer(60);
      toast.success('OTP sent to your email');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Error requesting submission');
    } finally {
      setSubmitting(false);
      setResending(false);
    }
  };

  const verifyAndSubmit = async () => {
    if (otp.length !== 6) {
      setOtpError('Please enter a 6-digit OTP');
      return;
    }
    setSubmitting(true);
    setOtpError('');
    try {
      await axios.post('/api/student/application/verify-submission', { otp });
      toast.success('Application submitted successfully!');
      navigate('/student/dashboard');
    } catch (err: any) {
      setOtpError(err.response?.data?.message || 'Invalid OTP');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center"><Loader2 className="animate-spin h-10 w-10 text-blue-600" /></div>;
  }

  const isLocked = application && application.status !== 'Draft' && application.status !== 'Correction Required';

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Application Form</h1>
        <p className="text-gray-600">BCA Co-Education Admission</p>
      </div>

      {isLocked && (
        <div className="mb-6 bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-r-md">
          <div className="flex">
            <div className="flex-shrink-0">
              <AlertCircle className="h-5 w-5 text-yellow-400" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-yellow-700">
                Your application is currently <strong>{application.status}</strong>. You cannot edit the details at this time.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Progress Steps */}
      <div className="mb-8 hidden sm:block">
        <div className="flex items-center justify-between relative">
          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-gray-200 -z-10"></div>
          <div className={`absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-blue-600 -z-10 transition-all duration-300`} style={{ width: `${((step - 1) / 4) * 100}%` }}></div>
          {['Personal', 'Address', 'Academic', 'Parent', 'Review'].map((s, i) => (
            <div key={i} className="flex flex-col items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center font-medium text-sm transition-colors ${step > i + 1 ? 'bg-blue-600 text-white' : step === i + 1 ? 'bg-blue-600 text-white ring-4 ring-blue-100' : 'bg-gray-200 text-gray-600'}`}>
                {step > i + 1 ? <Check className="h-4 w-4" /> : i + 1}
              </div>
              <span className={`mt-2 text-xs font-medium ${step >= i + 1 ? 'text-blue-600' : 'text-gray-500'}`}>{s}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sm:p-8">
        <form>
          
          {/* Step 1: Personal Details */}
          {step === 1 && (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
              <h2 className="text-xl font-bold text-gray-900 mb-6">Personal Details</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                  <input type="text" disabled={isLocked ?? undefined} {...register('personalDetails.firstName')} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Middle Name</label>
                  <input type="text" disabled={isLocked ?? undefined} {...register('personalDetails.middleName')} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                  <input type="text" disabled={isLocked ?? undefined} {...register('personalDetails.lastName')} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100" />
                </div>
                <div className="sm:col-span-2 lg:col-span-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Father's Name</label>
                  <input type="text" disabled={isLocked ?? undefined} {...register('personalDetails.fatherName')} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100" />
                </div>
                <div className="sm:col-span-2 lg:col-span-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Mother's Name</label>
                  <input type="text" disabled={isLocked ?? undefined} {...register('personalDetails.motherName')} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100" />
                </div>
                <div className="sm:col-span-2 lg:col-span-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth</label>
                  <input type="date" disabled={isLocked ?? undefined} {...register('personalDetails.dateOfBirth')} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100" />
                </div>
                <div className="sm:col-span-2 lg:col-span-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
                  <select disabled={isLocked ?? undefined} {...register('personalDetails.gender')} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100">
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div className="sm:col-span-2 lg:col-span-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                  <select disabled={isLocked ?? undefined} {...register('personalDetails.category')} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100">
                    <option value="">Select Category</option>
                    <option value="General">General</option>
                    <option value="OBC">OBC</option>
                    <option value="SC">SC</option>
                    <option value="ST">ST</option>
                  </select>
                </div>
                <div className="sm:col-span-2 lg:col-span-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Aadhaar Number</label>
                  <input type="text" disabled={isLocked ?? undefined} {...register('personalDetails.aadhaarNumber')} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100" />
                </div>
              </div>
            </motion.div>
          )}

          {/* Step 2: Address Details */}
          {step === 2 && (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
              <h2 className="text-xl font-bold text-gray-900 mb-6">Address Details</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                  <textarea disabled={isLocked ?? undefined} {...register('addressDetails.address')} rows={3} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"></textarea>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Village/Town</label>
                  <input type="text" disabled={isLocked ?? undefined} {...register('addressDetails.villageTown')} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Taluk</label>
                  <input type="text" disabled={isLocked ?? undefined} {...register('addressDetails.taluk')} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">District</label>
                  <input type="text" disabled={isLocked ?? undefined} {...register('addressDetails.district')} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
                  <input type="text" disabled={isLocked ?? undefined} {...register('addressDetails.state')} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">PIN Code</label>
                  <input type="text" disabled={isLocked ?? undefined} {...register('addressDetails.pinCode')} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100" />
                </div>
              </div>
            </motion.div>
          )}

          {/* Step 3: Academic Details */}
          {step === 3 && (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
              <h2 className="text-xl font-bold text-gray-900 mb-6">Academic Details</h2>
              
              <h3 className="font-semibold text-gray-800 border-b pb-2 mb-4">SSLC / 10th Standard</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Board</label>
                  <input type="text" disabled={isLocked ?? undefined} {...register('academicDetails.sslc.board')} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Passing Year</label>
                  <input type="text" disabled={isLocked ?? undefined} {...register('academicDetails.sslc.passingYear')} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Percentage (%)</label>
                  <input type="number" step="0.01" disabled={isLocked ?? undefined} {...register('academicDetails.sslc.percentage')} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100" />
                </div>
              </div>

              <h3 className="font-semibold text-gray-800 border-b pb-2 mb-4">PUC / 12th Standard</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Board/University</label>
                  <input type="text" disabled={isLocked ?? undefined} {...register('academicDetails.puc.board')} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Passing Year</label>
                  <input type="text" disabled={isLocked ?? undefined} {...register('academicDetails.puc.passingYear')} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Percentage (%)</label>
                  <input type="number" step="0.01" disabled={isLocked ?? undefined} {...register('academicDetails.puc.percentage')} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100" />
                </div>
              </div>
            </motion.div>
          )}

          {/* Step 4: Parent Details */}
          {step === 4 && (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
              <h2 className="text-xl font-bold text-gray-900 mb-6">Parent / Guardian Details</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                  <input type="text" disabled={isLocked ?? undefined} {...register('guardianDetails.name')} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Relationship</label>
                  <input type="text" disabled={isLocked ?? undefined} {...register('guardianDetails.relationship')} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Mobile</label>
                  <input type="text" disabled={isLocked ?? undefined} {...register('guardianDetails.mobile')} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Occupation</label>
                  <input type="text" disabled={isLocked ?? undefined} {...register('guardianDetails.occupation')} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100" />
                </div>
              </div>
            </motion.div>
          )}

          {/* Step 5: Review & Submit */}
          {step === 5 && (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
              <h2 className="text-xl font-bold text-gray-900 mb-6">Review & Final Submission</h2>
              
              <div className="bg-gray-50 p-4 rounded-lg mb-6 border border-gray-200">
                <p className="text-sm text-gray-600 mb-4">Please review all information before submitting. Once submitted, you cannot edit the application without admin permission.</p>
                
                {!isLocked && (
                  <div className="flex items-start gap-2 mb-6">
                    <input type="checkbox" id="confirm" className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded" />
                    <label htmlFor="confirm" className="text-sm text-gray-700">
                      I confirm that I have reviewed all information and the details provided by me are correct.
                    </label>
                  </div>
                )}

                {otpSent ? (
                  <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 text-center">
                    <h3 className="text-lg font-semibold mb-2">Enter Verification OTP</h3>
                    <p className="text-sm text-gray-500 mb-4">An OTP has been sent to your registered email to verify this submission.</p>
                    
                    {otpError && <p className="text-red-500 text-sm mb-2">{otpError}</p>}
                    
                    <input 
                      type="text" 
                      value={otp} 
                      onChange={e => setOtp(e.target.value)}
                      placeholder="Enter 6-digit OTP"
                      maxLength={6}
                      className="w-48 text-center text-xl tracking-widest px-4 py-2 border border-gray-300 rounded-lg mb-4 focus:ring-blue-500 focus:border-blue-500" 
                    />
                    <br />
                    <button 
                      type="button" 
                      onClick={verifyAndSubmit}
                      disabled={submitting}
                      className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-70 transition-colors"
                    >
                      {submitting ? 'Verifying...' : 'Verify & Submit Application'}
                    </button>
                    
                    <div className="mt-4">
                      <button
                        type="button"
                        onClick={requestFinalSubmission}
                        disabled={resendTimer > 0 || resending}
                        className="text-sm font-medium text-blue-600 hover:text-blue-500 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        {resending ? 'Sending...' : (resendTimer > 0 ? `Resend OTP in ${resendTimer}s` : 'Resend OTP')}
                      </button>
                    </div>
                  </div>
                ) : (
                  !isLocked && (
                    <button 
                      type="button" 
                      onClick={requestFinalSubmission}
                      disabled={submitting}
                      className="w-full bg-green-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-green-700 transition-colors disabled:opacity-70"
                    >
                      {submitting ? 'Processing...' : 'Request Final Submission'}
                    </button>
                  )
                )}
              </div>
            </motion.div>
          )}

        </form>
      </div>

      {/* Navigation Buttons */}
      <div className="mt-6 flex items-center justify-between">
        <button 
          onClick={prevStep} 
          disabled={step === 1 || otpSent}
          className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50 transition-colors"
        >
          <ChevronLeft className="h-5 w-5" /> Previous
        </button>
        
        <div className="flex gap-3">
          {!isLocked && !otpSent && (
            <button 
              type="button"
              onClick={handleSubmit(onSaveDraft)}
              disabled={saving}
              className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 disabled:opacity-70 transition-colors font-medium"
            >
              {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
              Save Draft
            </button>
          )}
          
          {step < 5 && (
            <button 
              onClick={nextStep}
              className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              Next <ChevronRight className="h-5 w-5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
