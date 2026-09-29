import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Link, useNavigate } from 'react-router';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { Eye, EyeOff, Loader2 } from 'lucide-react';

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

type LoginForm = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [serverError, setServerError] = useState('');

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema)
  });

  const onSubmit = async (data: LoginForm) => {
    try {
      setServerError('');
      const res = await axios.post('/api/auth/login', data);
      login(res.data);
      if (res.data.role === 'admin') {
        navigate('/admin/dashboard');
      } else {
        navigate('/student/dashboard');
      }
    } catch (err: any) {
      setServerError(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500">
      {/* Animated Background Elements */}
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
          <h2 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-pink-600">Welcome Back</h2>
          <p className="mt-2 text-sm text-gray-600">Please sign in to your account</p>
        </div>

        {serverError && (
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="mb-4 bg-red-50 text-red-600 p-3 rounded-lg text-sm text-center border border-red-100 font-medium">
            {serverError}
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

          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
            <label className="block text-sm font-bold text-gray-700 mb-1">Password</label>
            <div className="relative group">
              <input 
                type={showPassword ? 'text' : 'password'} 
                {...register('password')} 
                className="w-full px-4 py-3 bg-gray-50/50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all outline-none hover:border-purple-300 focus:bg-white shadow-sm pr-12" 
                placeholder="Enter your password"
              />
              <button 
                type="button" 
                onClick={() => setShowPassword(!showPassword)} 
                className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-purple-600 transition-colors"
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
            {errors.password && <p className="mt-1 text-sm text-red-500 font-medium">{errors.password.message}</p>}
            <div className="text-right mt-2">
              <Link to="/forgot-password" className="text-sm font-medium text-purple-600 hover:text-purple-500">
                Forgot password?
              </Link>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
            <motion.button 
              whileHover={{ scale: 1.02 }} 
              whileTap={{ scale: 0.98 }}
              type="submit" 
              disabled={isSubmitting} 
              className="w-full flex justify-center items-center py-3.5 px-4 rounded-xl shadow-lg shadow-purple-500/30 text-sm font-bold text-white bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 hover:from-indigo-600 hover:via-purple-600 hover:to-pink-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-70 transition-all"
            >
              {isSubmitting ? <Loader2 className="animate-spin h-5 w-5" /> : 'Log In Securely'}
            </motion.button>
          </motion.div>
        </form>

        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }} className="mt-6 text-center text-sm text-gray-600 font-medium">
          Don't have an account?{' '}
          <Link to="/register" className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-pink-600 hover:opacity-80 transition-opacity">
            Register here
          </Link>
        </motion.p>
      </motion.div>
    </div>
  );
}