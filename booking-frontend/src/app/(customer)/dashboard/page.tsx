'use client';

import { MOCK_SERVICES } from '@/services/api/mockData';
import { useRouter } from 'next/navigation';
import { Clock, IndianRupee, ArrowRight, Star } from 'lucide-react';
import { motion } from 'framer-motion';

export default function CustomerDashboard() {
  const router = useRouter();

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Discovery Services</h1>
          <p className="text-slate-400">Book professional services with top-rated experts</p>
        </div>
        <div className="flex gap-2">
          {['All', 'Counseling', 'Business', 'Wellness'].map((cat) => (
            <button key={cat} className="px-4 py-2 rounded-xl bg-slate-800/40 border border-slate-800 text-sm hover:border-primary/50 transition-colors">
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {MOCK_SERVICES.map((service, idx) => (
          <motion.div
            key={service.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="group glass-dark rounded-3xl overflow-hidden border border-white/5 hover:border-primary/30 transition-all duration-300 flex flex-col"
          >
            <div className="h-48 bg-slate-800 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900 to-transparent z-10" />
              <div className="absolute top-4 right-4 z-20 bg-black/40 backdrop-blur-md px-3 py-1 rounded-full flex items-center gap-1.5 text-xs font-bold text-amber-400 border border-white/10">
                <Star size={14} fill="currentColor" />
                <span>4.9</span>
              </div>
              <div className="absolute bottom-4 left-6 z-20">
                <h3 className="text-xl font-bold text-white mb-1 group-hover:text-primary transition-colors">{service.name}</h3>
                <div className="flex items-center gap-4 text-slate-300 text-xs">
                  <div className="flex items-center gap-1.5">
                    <Clock size={14} />
                    <span>{service.duration_minutes} mins</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="p-6 flex-1 flex flex-col">
              <p className="text-slate-400 text-sm mb-6 line-clamp-2 leading-relaxed">
                {service.description}
              </p>
              
              <div className="mt-auto flex items-center justify-between">
                <div className="flex flex-col">
                  <span className="text-xs text-slate-500 uppercase tracking-wider font-bold">Price</span>
                  <div className="flex items-center text-xl font-black text-white">
                    <IndianRupee size={18} />
                    <span>{service.price}</span>
                  </div>
                </div>
                
                <button
                  onClick={() => router.push(`/services/${service.id}`)}
                  className="bg-primary hover:bg-primary/90 text-white p-3.5 rounded-2xl transition-all group-hover:scale-105 shadow-lg shadow-primary/20"
                >
                  <ArrowRight size={20} />
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
