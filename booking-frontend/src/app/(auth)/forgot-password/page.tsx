'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Mail, ArrowLeft, Loader2, Send } from 'lucide-react';
import { motion } from 'framer-motion';

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Mock API call
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 1500);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#020617] p-4 relative overflow-hidden">
      <div className="absolute bottom-[10%] right-[20%] w-[35%] h-[35%] bg-amber-500/10 rounded-full blur-[110px]" />

      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <button onClick={() => router.push('/login')} className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors mb-6 group">
          <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
          <span>Back to Login</span>
        </button>

        <div className="glass-dark p-8 rounded-3xl shadow-2xl relative z-10 border border-white/5">
          {!submitted ? (
            <>
              <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-amber-500/10 text-amber-500 mb-6 border border-amber-500/20">
                  <Mail size={32} />
                </div>
                <h1 className="text-3xl font-bold text-white mb-2">Forgot Password?</h1>
                <p className="text-slate-400 text-sm">No worries, we&apos;ll send you instructions to reset it.</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-300 ml-1">Email Address</label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-500 group-focus-within:text-amber-500 transition-colors">
                      <Mail size={18} />
                    </div>
                    <input
                      required
                      type="email"
                      placeholder="john@example.com"
                      className="w-full bg-slate-900/50 border border-slate-800 text-white pl-11 pr-4 py-3.5 rounded-2xl focus:outline-none focus:ring-2 focus:ring-amber-500/40 focus:border-amber-500 transition-all placeholder:text-slate-600"
                    />
                  </div>
                </div>

                <button
                  disabled={loading}
                  type="submit"
                  className="w-full bg-amber-600 hover:bg-amber-500 text-white font-bold py-4 rounded-2xl transition-all active:scale-[0.98] flex items-center justify-center gap-2"
                >
                  {loading ? <Loader2 className="animate-spin" size={20} /> : <Send size={18} />}
                  {loading ? 'Sending Link...' : 'Send Reset Link'}
                </button>
              </form>
            </>
          ) : (
            <div className="text-center py-4">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-emerald-500/20 text-emerald-500 mb-6">
                <Send size={40} />
              </div>
              <h2 className="text-2xl font-bold text-white mb-4">Check Your Inbox</h2>
              <p className="text-slate-400 mb-8 leading-relaxed">
                We&apos;ve sent a password reset link to your email address. 
                Please check your inbox and follow the instructions.
              </p>
              <button
                onClick={() => router.push('/login')}
                className="text-primary font-bold hover:underline"
              >
                Back to Sign In
              </button>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
