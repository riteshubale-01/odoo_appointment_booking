'use client';

import { useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { authService } from '@/services/api/auth';
import { Loader2, ShieldCheck, ArrowLeft, RefreshCw } from 'lucide-react';
import { motion } from 'framer-motion';

function VerifyOtpContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const email = searchParams.get('email') || '';
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (index: number, value: string) => {
    if (value.length > 1) value = value[value.length - 1];
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`);
      prevInput?.focus();
    }
  };

  const onSubmit = async () => {
    const otpValue = otp.join('');
    if (otpValue.length < 6) return;

    setLoading(true);
    setError(null);
    try {
      const response = await authService.verifyOtp(email, otpValue);
      if (response.success) {
        router.push('/login?verified=true');
      } else {
        setError(response.message || 'Verification failed');
      }
    } catch (err) {
      setError('An error occurred during verification');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#020617] p-4 relative overflow-hidden">
      <div className="absolute top-[20%] left-[20%] w-[30%] h-[30%] bg-emerald-500/10 rounded-full blur-[100px]" />
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <button onClick={() => router.back()} className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors mb-6 group">
          <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
          <span>Back to Signup</span>
        </button>

        <div className="glass-dark p-8 rounded-3xl shadow-2xl relative z-10 border border-white/5">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-emerald-500/10 text-emerald-500 mb-6 border border-emerald-500/20">
              <ShieldCheck size={32} />
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">Verify Email</h1>
            <p className="text-slate-400 text-sm">We&apos;ve sent a 6-digit code to <br/><span className="text-slate-200 font-medium">{email}</span></p>
          </div>

          <div className="space-y-8">
            <div className="flex justify-between gap-2">
              {otp.map((digit, idx) => (
                <input
                  key={idx}
                  id={`otp-${idx}`}
                  type="text"
                  inputMode="numeric"
                  value={digit}
                  onChange={(e) => handleChange(idx, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(idx, e)}
                  className="w-12 h-14 bg-slate-900/50 border border-slate-800 text-white text-center text-xl font-bold rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-500 transition-all"
                />
              ))}
            </div>

            {error && (
              <div className="bg-rose-500/10 border border-rose-500/20 text-rose-500 p-3 rounded-2xl text-sm font-medium text-center">
                {error}
              </div>
            )}

            <div className="space-y-4">
              <button
                onClick={onSubmit}
                disabled={loading || otp.join('').length < 6}
                className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-4 rounded-2xl transition-all active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {loading ? <Loader2 className="animate-spin" size={20} /> : null}
                {loading ? 'Verifying...' : 'Verify Code'}
              </button>

              <button className="w-full flex items-center justify-center gap-2 text-slate-400 hover:text-white transition-colors text-sm py-2">
                <RefreshCw size={14} />
                <span>Didn&apos;t receive code? Resend</span>
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default function VerifyOtpPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#020617] flex items-center justify-center text-white">Loading...</div>}>
      <VerifyOtpContent />
    </Suspense>
  );
}
