import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Link, useNavigate } from 'react-router';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import axios from 'axios';
import { Eye, EyeOff, Loader2, AlertCircle } from 'lucide-react';

const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  mobile: z.string().length(10, 'Mobile number must be 10 digits'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type RegisterForm = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [serverError, setServerError] = useState('');
  const [config, setConfig] = useState<any>(null);

  React.useEffect(() => {
    axios.get('/api/config').then(res => setConfig(res.data)).catch(console.error);
  }, []);

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema)
  });

  const onSubmit = async (data: RegisterForm) => {
    if (config && !config.admissionOpen) return;
    try {
      setServerError('');
      const res = await axios.post('/api/auth/register', {
        name: data.name,
        email: data.email,
        mobile: data.mobile,
        password: data.password
      });
      if (res.data.devOtp) {
        console.log("DEV OTP:", res.data.devOtp);
        // We could also pre-fill it or show it in an alert for testing purposes
        alert(`[DEV ONLY] Your OTP is: ${res.data.devOtp}`);
      }
      // Store email temporarily for OTP page
      sessionStorage.setItem('verifyEmail', res.data.email);
      navigate('/verify-email');
    } catch (err: any) {
      setServerError(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden bg-gradient-to-br from-pink-500 via-rose-500 to-orange-500">
      {/* Animated Background Elements */}
      <motion.div 
        animate={{ y: [0, -40, 0], x: [0, -30, 0], scale: [1, 1.1, 1] }} 
        transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }} 
        className="absolute top-20 right-10 w-80 h-80 bg-yellow-300/30 rounded-full blur-3xl mix-blend-overlay"
      />
      <motion.div 
        animate={{ y: [0, 30, 0], x: [0, 40, 0], scale: [1, 1.2, 1] }} 
        transition={{ duration: 11, repeat: Infinity, ease: "easeInOut" }} 
        className="absolute bottom-20 left-10 w-[28rem] h-[28rem] bg-purple-300/30 rounded-full blur-3xl mix-blend-overlay"
      />

      <motion.div 
        initial={{ opacity: 0, y: 30, scale: 0.95 }} 
        animate={{ opacity: 1, y: 0, scale: 1 }} 
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="max-w-md w-full bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-white/40 relative z-10"
      >
        <div className="text-center mb-8">
          <h2 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-pink-600 to-orange-600 tracking-tight">Create Account</h2>
          <p className="mt-2 text-sm text-gray-600 font-medium">Join the BCA Co-Education program today</p>
        </div>

        {config && !config.admissionOpen && (
          <div className="mb-6 bg-red-50 text-red-600 p-4 rounded-xl text-sm border border-red-100 flex items-start gap-3">
            <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
            <p className="font-medium">Admissions for the current academic year are closed. You cannot register at this time.</p>
          </div>
        )}

        {serverError && (
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="mb-6 bg-red-50 text-red-600 p-4 rounded-xl text-sm text-center border border-red-100 font-medium">
            {serverError}
          </motion.div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}>
            <label className="block text-sm font-bold text-gray-700 mb-1">Full Name</label>
            <input type="text" {...register('name')} className="w-full px-4 py-3 bg-gray-50/50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition-all outline-none hover:border-pink-300 focus:bg-white shadow-sm" placeholder="John Doe" />
            {errors.name && <p className="mt-1 text-sm text-red-500 font-medium">{errors.name.message}</p>}
          </motion.div>

          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.15 }}>
            <label className="block text-sm font-bold text-gray-700 mb-1">Email Address</label>
            <input type="email" {...register('email')} className="w-full px-4 py-3 bg-gray-50/50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition-all outline-none hover:border-pink-300 focus:bg-white shadow-sm" placeholder="john@example.com" />
            {errors.email && <p className="mt-1 text-sm text-red-500 font-medium">{errors.email.message}</p>}
          </motion.div>

          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
            <label className="block text-sm font-bold text-gray-700 mb-1">Mobile Number</label>
            <input type="text" {...register('mobile')} className="w-full px-4 py-3 bg-gray-50/50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition-all outline-none hover:border-pink-300 focus:bg-white shadow-sm" placeholder="9876543210" />
            {errors.mobile && <p className="mt-1 text-sm text-red-500 font-medium">{errors.mobile.message}</p>}
          </motion.div>

          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.25 }}>
            <label className="block text-sm font-bold text-gray-700 mb-1">Password</label>
            <div className="relative group">
              <input type={showPassword ? 'text' : 'password'} {...register('password')} className="w-full px-4 py-3 bg-gray-50/50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition-all outline-none hover:border-pink-300 focus:bg-white shadow-sm pr-12" placeholder="Create a strong password" />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-pink-500 transition-colors">
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
            {errors.password && <p className="mt-1 text-sm text-red-500 font-medium">{errors.password.message}</p>}
          </motion.div>

          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}>
            <label className="block text-sm font-bold text-gray-700 mb-1">Confirm Password</label>
            <input type={showPassword ? 'text' : 'password'} {...register('confirmPassword')} className="w-full px-4 py-3 bg-gray-50/50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition-all outline-none hover:border-pink-300 focus:bg-white shadow-sm" placeholder="Confirm your password" />
            {errors.confirmPassword && <p className="mt-1 text-sm text-red-500 font-medium">{errors.confirmPassword.message}</p>}
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
            <motion.button 
              whileHover={{ scale: 1.02 }} 
              whileTap={{ scale: 0.98 }}
              type="submit" 
              disabled={isSubmitting} 
              className="w-full flex justify-center py-3.5 px-4 rounded-xl shadow-lg shadow-pink-500/30 text-sm font-bold text-white bg-gradient-to-r from-pink-500 via-rose-500 to-orange-500 hover:from-pink-600 hover:via-rose-600 hover:to-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500 disabled:opacity-70 disabled:cursor-not-allowed transition-all"
            >
              {isSubmitting ? <Loader2 className="animate-spin h-5 w-5" /> : 'Register Securely'}
            </motion.button>
          </motion.div>
        </form>

        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} className="mt-6 text-center text-sm text-gray-600 font-medium">
          Already have an account?{' '}
          <Link to="/login" className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-600 to-orange-600 hover:opacity-80 transition-opacity">
            Log in here
          </Link>
        </motion.p>
      </motion.div>
    </div>
  );
}