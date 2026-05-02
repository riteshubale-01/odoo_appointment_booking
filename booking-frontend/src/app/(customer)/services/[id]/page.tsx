'use client';

import { useState, use, useEffect } from 'react';
import { MOCK_SERVICES } from '@/services/api/mockData';
import { slotsService } from '@/services/api/slots';
import { useBookingStore } from '@/store/useBookingStore';
import { useRouter } from 'next/navigation';
import { 
  Calendar as CalendarIcon, 
  Clock, 
  ChevronLeft, 
  ChevronRight, 
  Users, 
  CheckCircle2, 
  AlertCircle,
  Loader2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { format, addDays, isSameDay } from 'date-fns';

export default function ServiceDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const { setSelectedService, setSelectedSlot } = useBookingStore();
  
  const service = MOCK_SERVICES.find(s => s.id === id);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [slots, setSlots] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeSlotId, setActiveSlotId] = useState<string | null>(null);

  const dates = Array.from({ length: 7 }, (_, i) => addDays(new Date(), i));

  useEffect(() => {
    if (service) {
      fetchSlots(format(selectedDate, 'yyyy-MM-dd'));
    }
  }, [selectedDate, service]);

  const fetchSlots = async (dateStr: string) => {
    setLoading(true);
    try {
      const response = await slotsService.getSlots(id, dateStr);
      if (response.success) {
        setSlots(response.data.slots);
      }
    } finally {
      setLoading(false);
    }
  };

  if (!service) return <div>Service not found</div>;

  const handleSlotClick = (slot: any) => {
    if (slot.status !== 'available') return;
    setActiveSlotId(slot.slot_id);
    setSelectedSlot(slot);
    setSelectedService(service);
  };

  const handleContinue = () => {
    if (activeSlotId) {
      router.push('/booking/confirm');
    }
  };

  return (
    <div className="max-w-5xl mx-auto pb-20">
      <button onClick={() => router.back()} className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors mb-8 group">
        <ChevronLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
        <span>Back to Dashboard</span>
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Left Column: Info */}
        <div className="lg:col-span-1 space-y-8">
          <div className="glass-dark rounded-3xl p-8 border border-white/5">
            <h1 className="text-3xl font-bold text-white mb-4">{service.name}</h1>
            <p className="text-slate-400 text-sm leading-relaxed mb-8">{service.description}</p>
            
            <div className="space-y-4 pt-6 border-t border-white/10">
              <div className="flex items-center gap-3 text-slate-300">
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                  <Clock size={16} />
                </div>
                <span className="text-sm font-medium">{service.duration_minutes} Minutes</span>
              </div>
              <div className="flex items-center gap-3 text-slate-300">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                  <CheckCircle2 size={16} />
                </div>
                <span className="text-sm font-medium">Instant Confirmation</span>
              </div>
            </div>
          </div>

          <div className="bg-primary/5 rounded-3xl p-6 border border-primary/10">
            <h4 className="font-bold text-white mb-2 flex items-center gap-2">
              <AlertCircle size={18} className="text-primary" />
              Cancellation Policy
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Cancel for free up to 24 hours before your appointment. After that, a 50% fee applies.
            </p>
          </div>
        </div>

        {/* Right Column: Slot Picker */}
        <div className="lg:col-span-2 space-y-6">
          <div className="glass-dark rounded-3xl p-8 border border-white/5">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-xl font-bold text-white">Select a Slot</h2>
              <div className="flex gap-2">
                <button className="p-2 hover:bg-white/5 rounded-xl text-slate-500 hover:text-white transition-colors">
                  <ChevronLeft size={20} />
                </button>
                <button className="p-2 hover:bg-white/5 rounded-xl text-slate-500 hover:text-white transition-colors">
                  <ChevronRight size={20} />
                </button>
              </div>
            </div>

            {/* Date Swiper */}
            <div className="flex gap-3 mb-10 overflow-x-auto pb-4 custom-scrollbar no-scrollbar">
              {dates.map((date, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedDate(date)}
                  className={cn(
                    "flex flex-col items-center min-w-[70px] py-4 rounded-2xl border transition-all shrink-0",
                    isSameDay(date, selectedDate)
                      ? "bg-primary text-white border-primary shadow-lg shadow-primary/20"
                      : "bg-slate-900/40 border-slate-800 text-slate-400 hover:border-slate-600"
                  )}
                >
                  <span className="text-[10px] uppercase font-black tracking-widest mb-1">{format(date, 'EEE')}</span>
                  <span className="text-lg font-bold">{format(date, 'd')}</span>
                </button>
              ))}
            </div>

            {/* Slots Grid */}
            <div className="relative min-h-[300px]">
              <AnimatePresence mode="wait">
                {loading ? (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 flex items-center justify-center"
                  >
                    <Loader2 className="text-primary animate-spin" size={32} />
                  </motion.div>
                ) : (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="grid grid-cols-2 sm:grid-cols-3 gap-3"
                  >
                    {slots.length > 0 ? (
                      slots.map((slot) => (
                        <button
                          key={slot.slot_id}
                          disabled={slot.status !== 'available'}
                          onClick={() => handleSlotClick(slot)}
                          className={cn(
                            "group flex flex-col p-4 rounded-2xl border transition-all text-left relative overflow-hidden",
                            activeSlotId === slot.slot_id
                              ? "bg-primary/20 border-primary text-white"
                              : slot.status === 'available'
                                ? "bg-slate-800/30 border-slate-800 text-slate-300 hover:border-primary/50"
                                : "bg-slate-900/20 border-slate-900 text-slate-600 cursor-not-allowed grayscale"
                          )}
                        >
                          <div className="flex items-center gap-2 mb-2">
                            <Clock size={14} className={activeSlotId === slot.slot_id ? "text-primary" : "text-slate-500"} />
                            <span className="text-sm font-bold">{slot.start_time}</span>
                          </div>
                          <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider opacity-60">
                            <Users size={12} />
                            <span>{slot.available_capacity} left</span>
                          </div>
                          
                          {activeSlotId === slot.slot_id && (
                            <motion.div layoutId="active" className="absolute top-2 right-2 text-primary">
                              <CheckCircle2 size={16} />
                            </motion.div>
                          )}
                        </button>
                      ))
                    ) : (
                      <div className="col-span-full py-12 text-center text-slate-500">
                        No available slots for this date.
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Summary & Button */}
            <div className="mt-12 pt-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-6">
              <div className={cn("transition-opacity", activeSlotId ? "opacity-100" : "opacity-0")}>
                <p className="text-xs text-slate-500 uppercase font-black tracking-widest mb-1">Selected Time</p>
                <p className="text-white font-bold">{format(selectedDate, 'MMMM d, yyyy')} at {slots.find(s => s.slot_id === activeSlotId)?.start_time}</p>
              </div>
              <button
                disabled={!activeSlotId}
                onClick={handleContinue}
                className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-white font-bold px-10 py-4 rounded-2xl transition-all active:scale-[0.98] disabled:opacity-50 disabled:grayscale"
              >
                Continue to Booking
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
