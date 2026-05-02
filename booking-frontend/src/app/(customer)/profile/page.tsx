'use client';

import { useState, useEffect } from 'react';
import { bookingsService } from '@/services/api/bookings';
import { 
  Calendar, 
  Clock, 
  MoreVertical, 
  XCircle, 
  RefreshCcw, 
  Search,
  ChevronRight,
  Loader2,
  CheckCircle2,
  Clock4
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

export default function ProfilePage() {
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all, upcoming, completed, cancelled

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const response = await bookingsService.getMyBookings();
      if (response.success) {
        setBookings(response.data);
      }
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20';
      case 'cancelled': return 'text-rose-500 bg-rose-500/10 border-rose-500/20';
      case 'pending': return 'text-amber-500 bg-amber-500/10 border-amber-500/20';
      default: return 'text-slate-400 bg-slate-400/10 border-slate-400/20';
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">My Appointments</h1>
          <p className="text-slate-400">View and manage your upcoming and past bookings</p>
        </div>
        
        <div className="flex bg-slate-900/40 p-1.5 rounded-2xl border border-white/5">
          {['all', 'upcoming', 'completed'].map((tab) => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={cn(
                "px-6 py-2.5 rounded-xl text-sm font-bold capitalize transition-all",
                filter === tab ? "bg-primary text-white shadow-lg" : "text-slate-500 hover:text-white"
              )}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-6">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="text-primary animate-spin mb-4" size={40} />
            <p className="text-slate-500 font-medium">Fetching your bookings...</p>
          </div>
        ) : bookings.length > 0 ? (
          bookings.map((booking, idx) => (
            <motion.div
              key={booking.booking_id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="glass-dark rounded-[32px] p-6 sm:p-8 border border-white/5 hover:border-white/10 transition-all group"
            >
              <div className="flex flex-col lg:flex-row lg:items-center gap-8">
                <div className="flex items-center gap-6 flex-1">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 flex items-center justify-center text-primary border border-white/5 shadow-inner">
                    <Calendar size={28} />
                  </div>
                  <div>
                    <div className="flex items-center gap-3 mb-1">
                      <h3 className="text-xl font-bold text-white">{booking.service_name}</h3>
                      <span className={cn(
                        "px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border",
                        getStatusColor(booking.status)
                      )}>
                        {booking.status}
                      </span>
                    </div>
                    <div className="flex flex-wrap items-center gap-4 text-sm text-slate-400 font-medium">
                      <div className="flex items-center gap-2">
                        <Clock size={16} />
                        <span>{booking.date}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock4 size={16} />
                        <span>{booking.time}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  <button className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-white/5 hover:bg-rose-500/10 text-slate-300 hover:text-rose-400 border border-white/10 hover:border-rose-500/20 transition-all font-bold text-sm">
                    <XCircle size={18} />
                    <span>Cancel</span>
                  </button>
                  <button className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-white/5 hover:bg-primary/10 text-slate-300 hover:text-primary border border-white/10 hover:border-primary/20 transition-all font-bold text-sm">
                    <RefreshCcw size={18} />
                    <span>Reschedule</span>
                  </button>
                  <button className="p-3.5 rounded-2xl bg-white/5 border border-white/10 text-slate-500 hover:text-white transition-colors">
                    <ChevronRight size={20} />
                  </button>
                </div>
              </div>
            </motion.div>
          ))
        ) : (
          <div className="text-center py-20 glass-dark rounded-[40px] border border-dashed border-white/10">
            <div className="w-20 h-20 bg-slate-800 rounded-full flex items-center justify-center text-slate-600 mx-auto mb-6">
              <Calendar size={32} />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">No Appointments Found</h3>
            <p className="text-slate-500 mb-8 max-w-sm mx-auto">You haven&apos;t booked any professional services yet. Start discovering experts!</p>
            <button onClick={() => router.push('/dashboard')} className="bg-primary text-white px-8 py-3 rounded-2xl font-black">
              Book Now
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
