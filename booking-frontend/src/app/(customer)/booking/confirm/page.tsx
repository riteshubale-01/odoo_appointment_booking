'use client';

import { useState } from 'react';
import { useBookingStore } from '@/store/useBookingStore';
import { bookingsService } from '@/services/api/bookings';
import { useRouter } from 'next/navigation';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  CheckCircle2, 
  CreditCard, 
  Loader2, 
  ArrowLeft,
  ShieldCheck,
  Smartphone
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

export default function BookingConfirmationPage() {
  const router = useRouter();
  const { selectedService, selectedSlot, resetBooking } = useBookingStore();
  const [loading, setLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [showPayment, setShowPayment] = useState(false);
  const [bookingData, setBookingData] = useState<any>(null);

  if (!selectedService || !selectedSlot) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center">
        <h2 className="text-2xl font-bold text-white mb-4">Session Expired</h2>
        <p className="text-slate-400 mb-8">Please select a service and slot again.</p>
        <button onClick={() => router.push('/dashboard')} className="bg-primary text-white px-8 py-3 rounded-2xl font-bold">
          Go to Dashboard
        </button>
      </div>
    );
  }

  const handleConfirm = async () => {
    setLoading(true);
    try {
      const payload = {
        service_id: selectedService.id,
        slot_id: selectedSlot.slot_id,
        date: selectedSlot.date,
        capacity: 1,
      };
      
      const response = await bookingsService.createBooking(payload);
      if (response.success) {
        setBookingData(response.data);
        if (response.data.payment_required) {
          setShowPayment(true);
        } else {
          setIsSuccess(true);
        }
      }
    } finally {
      setLoading(false);
    }
  };

  const handlePaymentSuccess = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setShowPayment(false);
      setIsSuccess(true);
    }, 2000);
  };

  if (isSuccess) {
    return (
      <div className="max-w-2xl mx-auto py-12">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass-dark rounded-[40px] p-12 border border-emerald-500/20 text-center"
        >
          <div className="w-24 h-24 bg-emerald-500/20 rounded-full flex items-center justify-center text-emerald-500 mx-auto mb-8 shadow-[0_0_50px_rgba(16,185,129,0.2)]">
            <CheckCircle2 size={48} />
          </div>
          <h1 className="text-4xl font-black text-white mb-4">Booking Confirmed!</h1>
          <p className="text-slate-400 mb-12 text-lg">Your appointment has been successfully scheduled. We&apos;ve sent a confirmation email to your inbox.</p>
          
          <div className="bg-slate-900/40 rounded-3xl p-8 border border-white/5 mb-12 text-left space-y-4">
            <div className="flex justify-between items-center pb-4 border-b border-white/5">
              <span className="text-slate-500 font-bold text-xs uppercase tracking-widest">Service</span>
              <span className="text-white font-bold">{selectedService.name}</span>
            </div>
            <div className="flex justify-between items-center pb-4 border-b border-white/5">
              <span className="text-slate-500 font-bold text-xs uppercase tracking-widest">Date</span>
              <span className="text-white font-bold">{selectedSlot.date}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-500 font-bold text-xs uppercase tracking-widest">Time</span>
              <span className="text-white font-bold">{selectedSlot.start_time} - {selectedSlot.end_time}</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <button 
              onClick={() => { resetBooking(); router.push('/dashboard'); }}
              className="flex-1 bg-white/5 hover:bg-white/10 text-white font-bold py-4 rounded-2xl transition-all border border-white/10"
            >
              Back to Home
            </button>
            <button 
              onClick={() => { resetBooking(); router.push('/profile'); }}
              className="flex-1 bg-primary text-white font-bold py-4 rounded-2xl transition-all shadow-lg shadow-primary/20"
            >
              View My Bookings
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center gap-4 mb-10">
        <button onClick={() => router.back()} className="p-2 hover:bg-white/5 rounded-xl text-slate-500">
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-3xl font-bold text-white">Review & Confirm</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-6">
          <div className="glass-dark rounded-[32px] p-8 border border-white/5 space-y-8">
            <div className="flex flex-col sm:flex-row gap-6">
              <div className="w-full sm:w-40 h-40 bg-slate-800 rounded-3xl overflow-hidden shrink-0">
                <div className="w-full h-full bg-gradient-to-br from-primary/40 to-indigo-600/40" />
              </div>
              <div className="space-y-4">
                <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-[10px] font-black uppercase tracking-widest border border-primary/20">Selected Service</span>
                <h2 className="text-2xl font-bold text-white">{selectedService.name}</h2>
                <div className="flex flex-wrap gap-4">
                  <div className="flex items-center gap-2 text-slate-400 text-sm">
                    <Clock size={16} />
                    <span>{selectedService.duration_minutes} mins</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-400 text-sm">
                    <MapPin size={16} />
                    <span>Online / Video Call</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-8 border-t border-white/5">
              <div className="bg-slate-900/40 rounded-2xl p-5 border border-white/5">
                <div className="flex items-center gap-3 mb-2">
                  <Calendar className="text-primary" size={18} />
                  <span className="text-xs text-slate-500 font-bold uppercase tracking-wider">Date</span>
                </div>
                <p className="text-white font-bold">{selectedSlot.date}</p>
              </div>
              <div className="bg-slate-900/40 rounded-2xl p-5 border border-white/5">
                <div className="flex items-center gap-3 mb-2">
                  <Clock className="text-primary" size={18} />
                  <span className="text-xs text-slate-500 font-bold uppercase tracking-wider">Time</span>
                </div>
                <p className="text-white font-bold">{selectedSlot.start_time} - {selectedSlot.end_time}</p>
              </div>
            </div>
          </div>

          <div className="glass-dark rounded-[32px] p-8 border border-white/5">
            <h3 className="text-lg font-bold text-white mb-6">Patient Information</h3>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="text-slate-500">Name</div>
                <div className="text-white font-medium text-right">John Doe</div>
                <div className="text-slate-500">Email</div>
                <div className="text-white font-medium text-right">john@example.com</div>
              </div>
            </div>
          </div>
        </div>

        <div className="md:col-span-1">
          <div className="glass-dark rounded-[32px] p-8 border border-white/5 sticky top-24">
            <h3 className="text-lg font-bold text-white mb-6">Price Details</h3>
            <div className="space-y-4 mb-8">
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Service Fee</span>
                <span className="text-white font-medium">₹{selectedService.price}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Tax (GST 18%)</span>
                <span className="text-white font-medium">₹{(selectedService.price * 0.18).toFixed(0)}</span>
              </div>
              <div className="pt-4 border-t border-white/5 flex justify-between">
                <span className="text-white font-bold">Total Payable</span>
                <span className="text-primary text-xl font-black">₹{(selectedService.price * 1.18).toFixed(0)}</span>
              </div>
            </div>

            <button
              disabled={loading}
              onClick={handleConfirm}
              className="w-full bg-primary hover:bg-primary/90 text-white font-black py-4 rounded-2xl transition-all active:scale-[0.98] flex items-center justify-center gap-2 shadow-[0_10px_30px_rgba(99,102,241,0.2)] disabled:opacity-50"
            >
              {loading ? <Loader2 className="animate-spin" size={20} /> : <CheckCircle2 size={20} />}
              {loading ? 'Processing...' : 'Confirm Booking'}
            </button>

            <p className="mt-4 text-[10px] text-slate-500 text-center leading-relaxed">
              By clicking confirm, you agree to our Terms of Service and Privacy Policy.
            </p>
          </div>
        </div>
      </div>

      {/* Mock Payment Modal */}
      <AnimatePresence>
        {showPayment && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
              onClick={() => !loading && setShowPayment(false)}
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-md bg-white rounded-[32px] overflow-hidden shadow-2xl"
            >
              <div className="bg-[#232639] p-6 text-white flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="bg-primary p-2 rounded-lg">
                    <ShieldCheck size={20} />
                  </div>
                  <span className="font-bold tracking-tight">Razorpay Secure</span>
                </div>
                <div className="text-xs opacity-60">Order ID: {bookingData?.payment_order_id}</div>
              </div>

              <div className="p-8 text-[#232639]">
                <div className="flex justify-between items-center mb-8 pb-8 border-b border-slate-100">
                  <div>
                    <h4 className="text-sm font-medium text-slate-500">Payable Amount</h4>
                    <p className="text-3xl font-black">₹{(selectedService.price * 1.18).toFixed(0)}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-bold text-slate-400 mb-1">BookIt Platform</p>
                    <p className="text-xs text-slate-400">Appointment Fee</p>
                  </div>
                </div>

                <div className="space-y-4 mb-10">
                  <p className="text-xs font-bold uppercase tracking-widest text-slate-400">Select Payment Method</p>
                  <button className="w-full flex items-center justify-between p-4 rounded-2xl border-2 border-primary bg-primary/5 group">
                    <div className="flex items-center gap-4">
                      <CreditCard className="text-primary" />
                      <span className="font-bold">Cards (Visa, Master, etc)</span>
                    </div>
                    <div className="w-4 h-4 rounded-full border-4 border-primary" />
                  </button>
                  <button className="w-full flex items-center justify-between p-4 rounded-2xl border border-slate-200 hover:border-slate-300 transition-colors">
                    <div className="flex items-center gap-4">
                      <Smartphone className="text-slate-400" />
                      <span className="font-bold text-slate-600">UPI (GPay, PhonePe)</span>
                    </div>
                    <div className="w-4 h-4 rounded-full border border-slate-300" />
                  </button>
                </div>

                <button
                  onClick={handlePaymentSuccess}
                  disabled={loading}
                  className="w-full bg-[#3395ff] hover:bg-[#2088f5] text-white font-black py-4 rounded-xl transition-all shadow-lg shadow-blue-500/20 flex items-center justify-center gap-2"
                >
                  {loading ? <Loader2 className="animate-spin" /> : null}
                  Pay ₹{(selectedService.price * 1.18).toFixed(0)} Now
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
