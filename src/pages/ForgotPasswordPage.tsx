import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Link, useNavigate } from 'react-router';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import axios from 'axios';
import { Loader2 } from 'lucide-react';

const forgotPasswordSchema = z.object({
  email: z.string().email('Invalid email address'),
});

type ForgotPasswordForm = z.infer<typeof forgotPasswordSchema>;

export default function ForgotPasswordPage() {
  const navigate = useNavigate();
  const [serverError, setServerError] = useState('');
  const [serverSuccess, setServerSuccess] = useState('');

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<ForgotPasswordForm>({
    resolver: zodResolver(forgotPasswordSchema)
  });

  const onSubmit = async (data: ForgotPasswordForm) => {
    try {
      setServerError('');
      setServerSuccess('');
      const res = await axios.post('/api/auth/forgot-password', data);
      setServerSuccess(res.data.message);
      setTimeout(() => navigate('/reset-password'), 2000);
    } catch (err: any) {
      setServerError(err.response?.data?.message || 'Failed to send reset email');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500">
      <motion.div 
        animate={{ y: [0, -30, 0], x: [0, 20, 0], rotate: [0, 45, 0] }} 
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }} 
        className="absolute top-10 left-10 w-72 h-72 bg-white/20 rounded-full blur-3xl mix-blend-overlay"
      />
      <motion.div 
        animate={{ y: [0, 40, 0], x: [0, -30, 0], rotate: [0, -45, 0] }} 
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }} 
        className="absolute bottom-10 right-10 w-96 h-96 bg-blue-300/30 rounded-full blur-3xl mix-blend-overlay"
      />
      
      <motion.div 
        initial={{ opacity: 0, y: 30, scale: 0.95 }} 
        animate={{ opacity: 1, y: 0, scale: 1 }} 
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="max-w-md w-full bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-white/40 relative z-10"
      >
        <div className="text-center mb-8">
          <h2 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-pink-600">Forgot Password</h2>
          <p className="mt-2 text-sm text-gray-600">Enter your email to reset your password</p>
        </div>

        {serverError && (
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="mb-4 bg-red-50 text-red-600 p-3 rounded-lg text-sm text-center border border-red-100 font-medium">
            {serverError}
          </motion.div>
        )}
        {serverSuccess && (
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="mb-4 bg-green-50 text-green-600 p-3 rounded-lg text-sm text-center border border-green-100 font-medium">
            {serverSuccess}
          </motion.div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}>
            <label className="block text-sm font-bold text-gray-700 mb-1">Email Address</label>
            <input 
              type="email" 
              {...register('email')} 
              className="w-full px-4 py-3 bg-gray-50/50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all outline-none hover:border-purple-300 focus:bg-white shadow-sm" 
              placeholder="Enter your email"
            />
            {errors.email && <p className="mt-1 text-sm text-red-500 font-medium">{errors.email.message}</p>}
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
            <motion.button 
              whileHover={{ scale: 1.02 }} 
              whileTap={{ scale: 0.98 }}
              type="submit" 
              disabled={isSubmitting} 
              className="w-full flex justify-center items-center py-3.5 px-4 rounded-xl shadow-lg shadow-purple-500/30 text-sm font-bold text-white bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 hover:from-indigo-600 hover:via-purple-600 hover:to-pink-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-70 transition-all"
            >
              {isSubmitting ? <Loader2 className="animate-spin h-5 w-5" /> : 'Send Reset Link'}
            </motion.button>
          </motion.div>
        </form>

        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }} className="mt-6 text-center text-sm text-gray-600 font-medium">
          Remember your password?{' '}
          <Link to="/login" className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-pink-600 hover:opacity-80 transition-opacity">
            Log in
          </Link>
        </motion.p>
      </motion.div>
    </div>
  );
}