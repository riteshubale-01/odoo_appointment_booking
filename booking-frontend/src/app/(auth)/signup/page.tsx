'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useRouter } from 'next/navigation';
import { authService } from '@/services/api/auth';
import { Loader2, UserPlus, Mail, Lock, User, ShieldCheck } from 'lucide-react';
import { motion } from 'framer-motion';

const signupSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  role: z.enum(['customer', 'organizer']),
});

type SignupFormValues = z.infer<typeof signupSchema>;

export default function SignupPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: { role: 'customer' }
  });

  const onSubmit = async (data: SignupFormValues) => {
    setLoading(true);
    setError(null);
    try {
      const response = await authService.signup(data);
      if (response.success) {
        // Redirect to OTP verification with email as query param
        router.push(`/verify-otp?email=${encodeURIComponent(data.email)}`);
      } else {
        setError(response.message || 'Signup failed');
      }
    } catch (err) {
      setError('An error occurred during signup');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#020617] p-4 relative overflow-hidden">
      <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-500/20 rounded-full blur-[120px]" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-500/10 rounded-full blur-[120px]" />

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-lg"
      >
        <div className="glass-dark p-8 rounded-3xl shadow-2xl relative z-10 border border-white/5">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-white mb-2 tracking-tight">Create Account</h1>
            <p className="text-slate-400">Join our platform to start booking appointments</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-300 ml-1">Full Name</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-500 group-focus-within:text-primary transition-colors">
                    <User size={18} />
                  </div>
                  <input
                    {...register('name')}
                    placeholder="John Doe"
                    className="w-full bg-slate-900/50 border border-slate-800 text-white pl-11 pr-4 py-3 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all placeholder:text-slate-600"
                  />
                </div>
                {errors.name && <p className="text-xs text-rose-500 ml-1 font-medium">{errors.name.message}</p>}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-300 ml-1">Role</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-500 group-focus-within:text-primary transition-colors">
                    <ShieldCheck size={18} />
                  </div>
                  <select
                    {...register('role')}
                    className="w-full bg-slate-900/50 border border-slate-800 text-white pl-11 pr-4 py-3 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all appearance-none"
                  >
                    <option value="customer">Customer</option>
                    <option value="organizer">Organizer</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-300 ml-1">Email Address</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-500 group-focus-within:text-primary transition-colors">
                  <Mail size={18} />
                </div>
                <input
                  {...register('email')}
                  type="email"
                  placeholder="john@example.com"
                  className="w-full bg-slate-900/50 border border-slate-800 text-white pl-11 pr-4 py-3 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all placeholder:text-slate-600"
                />
              </div>
              {errors.email && <p className="text-xs text-rose-500 ml-1 font-medium">{errors.email.message}</p>}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-300 ml-1">Password</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-500 group-focus-within:text-primary transition-colors">
                  <Lock size={18} />
                </div>
                <input
                  {...register('password')}
                  type="password"
                  placeholder="••••••••"
                  className="w-full bg-slate-900/50 border border-slate-800 text-white pl-11 pr-4 py-3 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all placeholder:text-slate-600"
                />
              </div>
              {errors.password && <p className="text-xs text-rose-500 ml-1 font-medium">{errors.password.message}</p>}
            </div>

            {error && (
              <div className="bg-rose-500/10 border border-rose-500/20 text-rose-500 p-3 rounded-2xl text-sm font-medium">
                {error}
              </div>
            )}

            <button
              disabled={loading}
              type="submit"
              className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-4 rounded-2xl transition-all active:scale-[0.98] flex items-center justify-center gap-2 shadow-[0_8px_30px_rgb(99,102,241,0.3)] disabled:opacity-70 mt-4"
            >
              {loading ? <Loader2 className="animate-spin" size={20} /> : <UserPlus size={20} />}
              {loading ? 'Creating Account...' : 'Get Started'}
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-slate-400 text-sm">
              Already have an account?{' '}
              <button onClick={() => router.push('/login')} className="text-primary hover:text-primary/80 font-bold transition-colors">
                Sign In
              </button>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
