'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/useAuthStore';
import { authService } from '@/services/api/auth';
import { Loader2, LogIn, Mail, Lock } from 'lucide-react';
import { motion } from 'framer-motion';

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();
  const setAuth = useAuthStore((state) => state.setAuth);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormValues) => {
    setLoading(true);
    setError(null);
    try {
      const response = await authService.login(data.email, data.password);
      if (response.success && response.data) {
        setAuth(response.data.token, response.data.user);
        router.push('/dashboard');
      } else {
        setError(response.message || 'Login failed');
      }
    } catch (err) {
      setError('An error occurred during login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#020617] p-4 relative overflow-hidden">
      {/* Dynamic Background Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/20 rounded-full blur-[120px]" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-500/10 rounded-full blur-[120px]" />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="glass-dark p-8 rounded-3xl shadow-2xl relative z-10 border border-white/5">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-white mb-2 tracking-tight">Welcome Back</h1>
            <p className="text-slate-400">Enter your credentials to access your account</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-300 ml-1">Email Address</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-500 group-focus-within:text-primary transition-colors">
                  <Mail size={18} />
                </div>
                <input
                  {...register('email')}
                  type="email"
                  placeholder="name@example.com"
                  className="w-full bg-slate-900/50 border border-slate-800 text-white pl-11 pr-4 py-3.5 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all placeholder:text-slate-600"
                />
              </div>
              {errors.email && (
                <p className="text-xs text-rose-500 ml-1 mt-1 font-medium">{errors.email.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between ml-1">
                <label className="text-sm font-medium text-slate-300">Password</label>
                <button type="button" onClick={() => router.push('/forgot-password')} className="text-xs text-primary hover:text-primary/80 font-medium transition-colors">
                  Forgot password?
                </button>
              </div>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-500 group-focus-within:text-primary transition-colors">
                  <Lock size={18} />
                </div>
                <input
                  {...register('password')}
                  type="password"
                  placeholder="••••••••"
                  className="w-full bg-slate-900/50 border border-slate-800 text-white pl-11 pr-4 py-3.5 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all placeholder:text-slate-600"
                />
              </div>
              {errors.password && (
                <p className="text-xs text-rose-500 ml-1 mt-1 font-medium">{errors.password.message}</p>
              )}
            </div>

            {error && (
              <div className="bg-rose-500/10 border border-rose-500/20 text-rose-500 p-3.5 rounded-2xl text-sm font-medium">
                {error}
              </div>
            )}

            <button
              disabled={loading}
              type="submit"
              className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-4 rounded-2xl transition-all active:scale-[0.98] flex items-center justify-center gap-2 shadow-[0_8px_30px_rgb(99,102,241,0.3)] disabled:opacity-70 disabled:active:scale-100 mt-2"
            >
              {loading ? <Loader2 className="animate-spin" size={20} /> : <LogIn size={20} />}
              {loading ? 'Authenticating...' : 'Sign In'}
            </button>
          </form>

          <div className="mt-10 text-center">
            <p className="text-slate-400 text-sm">
              Don&apos;t have an account?{' '}
              <button onClick={() => router.push('/signup')} className="text-primary hover:text-primary/80 font-bold transition-colors">
                Create Account
              </button>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
