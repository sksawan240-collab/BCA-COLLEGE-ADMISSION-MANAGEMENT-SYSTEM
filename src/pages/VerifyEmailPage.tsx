import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { useNavigate } from 'react-router';
import axios from 'axios';
import { CheckCircle, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

export default function VerifyEmailPage() {
  const navigate = useNavigate();
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [timeLeft, setTimeLeft] = useState(60);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    const savedEmail = sessionStorage.getItem('verifyEmail');
    if (!savedEmail) {
      navigate('/login');
    } else {
      setEmail(savedEmail);
    }
  }, [navigate]);

  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [timeLeft]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const value = e.target.value;
    if (isNaN(Number(value))) return;

    const newOtp = [...otp];
    // Take the last character entered in case they type fast
    newOtp[index] = value.substring(value.length - 1);
    setOtp(newOtp);

    // Move to next input if value exists
    if (value && index < 5 && inputRefs.current[index + 1]) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0 && inputRefs.current[index - 1]) {
      // Move to previous input on backspace if current is empty
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleResend = async () => {
    if (timeLeft > 0) return;
    setResending(true);
    setError('');
    
    try {
      const res = await axios.post('/api/auth/resend-otp', { email });
      toast.success(res.data.message || 'OTP resent successfully');
      setTimeLeft(60);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to resend OTP');
    } finally {
      setResending(false);
    }
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    const otpValue = otp.join('');
    if (otpValue.length !== 6) {
      setError('Please enter a valid 6-digit OTP');
      return;
    }

    setLoading(true);
    setError('');
    
    try {
      await axios.post('/api/auth/verify-email', { email, otp: otpValue });
      setSuccess(true);
      setTimeout(() => {
        sessionStorage.removeItem('verifyEmail');
        navigate('/login');
      }, 2000);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Verification failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden bg-gradient-to-br from-emerald-400 via-teal-500 to-cyan-500">
      {/* Animated Background Elements */}
      <motion.div 
        animate={{ y: [0, -30, 0], x: [0, 30, 0], rotate: [0, 45, 0] }} 
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }} 
        className="absolute top-10 left-20 w-72 h-72 bg-white/20 rounded-full blur-3xl mix-blend-overlay"
      />
      <motion.div 
        animate={{ y: [0, 40, 0], x: [0, -30, 0], rotate: [0, -45, 0] }} 
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }} 
        className="absolute bottom-10 right-20 w-96 h-96 bg-blue-300/30 rounded-full blur-3xl mix-blend-overlay"
      />

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }} 
        animate={{ opacity: 1, scale: 1 }} 
        transition={{ duration: 0.5 }}
        className="max-w-md w-full bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl p-8 text-center border border-white/40 relative z-10"
      >
        
        {success ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center">
            <CheckCircle className="h-16 w-16 text-green-500 mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Email Verified!</h2>
            <p className="text-gray-600">Redirecting to login...</p>
          </motion.div>
        ) : (
          <>
            <h2 className="text-3xl font-extrabold text-gray-900 mb-4">Verify Your Email</h2>
            <p className="text-sm text-gray-600 mb-8">
              We've sent a 6-digit OTP to <span className="font-semibold text-gray-800">{email}</span>
            </p>

            {error && (
              <div className="mb-6 bg-red-50 text-red-600 p-3 rounded-lg text-sm border border-red-100">
                {error}
              </div>
            )}

            <form onSubmit={handleVerify}>
              <div className="flex justify-center gap-2 mb-8">
                {otp.map((data, index) => {
                  return (
                    <input
                      ref={el => { inputRefs.current[index] = el; }}
                      className="w-12 h-14 text-center text-xl font-bold border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:ring-blue-500 transition-colors bg-gray-50"
                      type="text"
                      name="otp"
                      maxLength={1}
                      key={index}
                      value={data}
                      onChange={e => handleChange(e, index)}
                      onKeyDown={e => handleKeyDown(e, index)}
                      onFocus={e => e.target.select()}
                    />
                  );
                })}
              </div>

              <button type="submit" disabled={loading} className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-70 transition-colors">
                {loading ? <Loader2 className="animate-spin h-5 w-5" /> : 'Verify Email'}
              </button>
            </form>

            <div className="mt-6 text-sm text-gray-600">
              <p>
                Didn't receive the code?{' '}
                <button
                  type="button"
                  onClick={handleResend}
                  disabled={timeLeft > 0 || resending}
                  className="font-medium text-blue-600 hover:text-blue-500 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {resending ? 'Sending...' : (timeLeft > 0 ? `Resend in ${timeLeft}s` : 'Resend OTP')}
                </button>
              </p>
            </div>
          </>
        )}
      </motion.div>
    </div>
  );
}
