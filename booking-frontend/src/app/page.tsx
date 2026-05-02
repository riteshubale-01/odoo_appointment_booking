'use client';

import { useRouter } from 'next/navigation';
import { 
  Calendar, 
  ShieldCheck, 
  Clock, 
  ArrowRight, 
  Star, 
  Play,
  CheckCircle2,
  Users,
  TrendingUp
} from 'lucide-react';
import { motion } from 'framer-motion';

export default function LandingPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-[#020617] text-white selection:bg-primary/30 overflow-hidden">
      {/* Hero Section */}
      <nav className="h-24 flex items-center justify-between px-8 md:px-20 relative z-50">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary/20">
            <Calendar className="text-white" size={24} />
          </div>
          <span className="text-2xl font-black tracking-tighter">BookIt.</span>
        </div>
        <div className="hidden md:flex items-center gap-10">
          {['Features', 'Solutions', 'Pricing', 'Company'].map(item => (
            <a key={item} href="#" className="text-sm font-bold text-slate-400 hover:text-white transition-colors">{item}</a>
          ))}
        </div>
        <div className="flex items-center gap-4">
          <button onClick={() => router.push('/login')} className="text-sm font-bold text-slate-300 hover:text-white transition-colors">Sign In</button>
          <button onClick={() => router.push('/signup')} className="bg-primary hover:bg-primary/90 px-6 py-3 rounded-2xl text-sm font-black transition-all shadow-lg shadow-primary/20">Get Started</button>
        </div>
      </nav>

      <section className="relative pt-20 pb-32 px-8">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-primary/20 rounded-full blur-[120px]" />
        <div className="absolute bottom-[0%] right-[-10%] w-[50%] h-[50%] bg-purple-500/10 rounded-full blur-[120px]" />

        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-primary text-xs font-black uppercase tracking-widest mb-8">
              <span className="w-2 h-2 bg-primary rounded-full animate-pulse" />
              Next-Gen Appointment Platform
            </div>
            <h1 className="text-6xl md:text-8xl font-black leading-[0.9] tracking-tighter mb-8">
              Booking Made <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-indigo-400 to-purple-500">Effortless.</span>
            </h1>
            <p className="text-xl text-slate-400 mb-12 leading-relaxed max-w-xl">
              Connect with professionals, manage your availability, and book appointments in seconds with our beautiful, high-performance platform.
            </p>
            <div className="flex flex-col sm:flex-row gap-6">
              <button 
                onClick={() => router.push('/signup')}
                className="group bg-primary hover:bg-primary/90 text-white px-10 py-5 rounded-[24px] text-lg font-black transition-all flex items-center justify-center gap-3 shadow-2xl shadow-primary/30"
              >
                Start Booking Now
                <ArrowRight className="group-hover:translate-x-2 transition-transform" />
              </button>
              <button className="flex items-center justify-center gap-4 text-white font-bold px-10 py-5 rounded-[24px] bg-white/5 border border-white/10 hover:bg-white/10 transition-all">
                <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                  <Play size={16} fill="currentColor" />
                </div>
                Watch Demo
              </button>
            </div>

            <div className="mt-16 flex items-center gap-8 border-t border-white/5 pt-10">
              <div>
                <p className="text-3xl font-black text-white">10k+</p>
                <p className="text-xs text-slate-500 font-bold uppercase tracking-widest mt-1">Users</p>
              </div>
              <div className="w-px h-10 bg-white/10" />
              <div>
                <p className="text-3xl font-black text-white">4.9/5</p>
                <div className="flex items-center gap-1 text-amber-500 mt-1">
                  {[1,2,3,4,5].map(i => <Star key={i} size={12} fill="currentColor" />)}
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, ease: 'easeOut' }}
            className="relative"
          >
            <div className="relative z-10 glass-dark rounded-[40px] border border-white/10 shadow-2xl p-4 overflow-hidden">
              <div className="aspect-[4/3] bg-slate-900 rounded-[32px] overflow-hidden relative">
                {/* Visual representation of the dashboard */}
                <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-900/40" />
                <div className="absolute top-10 left-10 right-10 bottom-0 bg-slate-900/80 rounded-t-3xl border-t border-x border-white/5 p-8">
                   <div className="flex justify-between mb-8">
                     <div className="w-32 h-4 bg-white/5 rounded-full" />
                     <div className="flex gap-2">
                       <div className="w-8 h-8 rounded-lg bg-white/5" />
                       <div className="w-8 h-8 rounded-lg bg-white/5" />
                     </div>
                   </div>
                   <div className="grid grid-cols-3 gap-4 mb-8">
                     {[1,2,3].map(i => <div key={i} className="h-24 bg-white/5 rounded-2xl" />)}
                   </div>
                   <div className="space-y-4">
                     {[1,2,3,4].map(i => <div key={i} className="h-12 bg-white/5 rounded-2xl" />)}
                   </div>
                </div>
              </div>
            </div>
            
            {/* Floating elements */}
            <motion.div 
              animate={{ y: [0, -20, 0] }}
              transition={{ duration: 4, repeat: Infinity }}
              className="absolute -top-10 -right-10 z-20 glass p-6 rounded-3xl shadow-xl border border-primary/20"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-emerald-500/20 rounded-2xl flex items-center justify-center text-emerald-500">
                  <CheckCircle2 size={24} />
                </div>
                <div>
                  <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Confirmed</p>
                  <p className="font-bold text-white">New Appointment</p>
                </div>
              </div>
            </motion.div>

            <motion.div 
              animate={{ y: [0, 20, 0] }}
              transition={{ duration: 5, repeat: Infinity }}
              className="absolute -bottom-10 -left-10 z-20 glass p-6 rounded-3xl shadow-xl border border-indigo-500/20"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-indigo-500/20 rounded-2xl flex items-center justify-center text-indigo-500">
                  <Users size={24} />
                </div>
                <div>
                  <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Expertise</p>
                  <p className="font-bold text-white">450+ Professionals</p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-32 px-8 bg-white/[0.02]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-4xl font-bold text-white mb-4">Everything you need to grow</h2>
            <p className="text-slate-400 max-w-2xl mx-auto">Powerful features to manage your schedule, automate bookings, and scale your business with ease.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { title: 'Secure Payments', desc: 'Integrated with Razorpay for seamless, secure transactions.', icon: ShieldCheck },
              { title: 'Smart Scheduling', desc: 'Real-time availability with advanced conflict prevention.', icon: Clock },
              { title: 'Rich Analytics', desc: 'Detailed insights into your bookings and revenue growth.', icon: TrendingUp },
            ].map((f, i) => (
              <div key={i} className="glass-dark p-10 rounded-[32px] border border-white/5 hover:border-primary/20 transition-all group">
                <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center text-primary mb-8 group-hover:scale-110 transition-transform">
                  <f.icon size={28} />
                </div>
                <h3 className="text-xl font-bold text-white mb-4">{f.title}</h3>
                <p className="text-slate-400 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
