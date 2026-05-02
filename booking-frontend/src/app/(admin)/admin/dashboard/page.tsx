'use client';

import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { 
  Users, 
  Calendar, 
  IndianRupee, 
  TrendingUp, 
  ArrowUpRight, 
  ArrowDownRight,
  ShieldCheck,
  UserCheck,
  MoreHorizontal
} from 'lucide-react';
import { motion } from 'framer-motion';

const REVENUE_DATA = [
  { name: 'Jan', value: 4000 },
  { name: 'Feb', value: 3000 },
  { name: 'Mar', value: 5000 },
  { name: 'Apr', value: 4500 },
  { name: 'May', value: 6000 },
  { name: 'Jun', value: 5500 },
];

const USER_DISTRIBUTION = [
  { name: 'Customers', value: 400 },
  { name: 'Organizers', value: 80 },
  { name: 'Admins', value: 5 },
];

const COLORS = ['#6366f1', '#10b981', '#f59e0b'];

export default function AdminDashboardPage() {
  const stats = [
    { title: 'Total Users', value: '485', change: '+12%', icon: Users, color: 'text-blue-500', bg: 'bg-blue-500/10' },
    { title: 'Appointments', value: '1,240', change: '+5.4%', icon: Calendar, color: 'text-indigo-500', bg: 'bg-indigo-500/10' },
    { title: 'Total Revenue', value: '₹45,200', change: '+18%', icon: IndianRupee, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
    { title: 'Completion Rate', value: '94.2%', change: '-2%', icon: TrendingUp, color: 'text-amber-500', bg: 'bg-amber-500/10' },
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-10 pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-white tracking-tight mb-2">Platform Overview</h1>
          <p className="text-slate-400">Real-time analytics and user management dashboard</p>
        </div>
        <div className="flex gap-3">
          <button className="px-5 py-3 rounded-2xl bg-white/5 border border-white/10 text-slate-300 font-bold text-sm">Download Report</button>
          <button className="px-5 py-3 rounded-2xl bg-primary text-white font-bold text-sm shadow-lg shadow-primary/20">Manage Access</button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, idx) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="glass-dark p-6 rounded-[32px] border border-white/5"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={stat.bg + " p-3 rounded-2xl " + stat.color}>
                <stat.icon size={24} />
              </div>
              <div className={stat.change.startsWith('+') ? "text-emerald-500" : "text-rose-500" + " flex items-center gap-1 text-xs font-black"}>
                {stat.change}
                {stat.change.startsWith('+') ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
              </div>
            </div>
            <p className="text-slate-500 text-xs font-black uppercase tracking-widest mb-1">{stat.title}</p>
            <h3 className="text-3xl font-black text-white">{stat.value}</h3>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Revenue Chart */}
        <div className="lg:col-span-2 glass-dark rounded-[40px] p-8 border border-white/5">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-xl font-bold text-white">Revenue Growth</h3>
            <select className="bg-slate-900/50 border border-slate-800 text-xs text-slate-400 rounded-xl px-4 py-2 outline-none">
              <option>Last 6 Months</option>
              <option>Last Year</option>
            </select>
          </div>
          <div className="h-[350px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={REVENUE_DATA}>
                <defs>
                  <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                <XAxis dataKey="name" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} dy={10} />
                <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} dx={-10} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px' }}
                  itemStyle={{ color: '#fff', fontWeight: 'bold' }}
                />
                <Area type="monotone" dataKey="value" stroke="#6366f1" strokeWidth={4} fillOpacity={1} fill="url(#colorValue)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* User Distribution */}
        <div className="glass-dark rounded-[40px] p-8 border border-white/5">
          <h3 className="text-xl font-bold text-white mb-8">User Roles</h3>
          <div className="h-[250px] w-full relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={USER_DISTRIBUTION}
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={8}
                  dataKey="value"
                >
                  {USER_DISTRIBUTION.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px' }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-2xl font-black text-white">485</span>
              <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Total</span>
            </div>
          </div>
          <div className="mt-8 space-y-4">
            {USER_DISTRIBUTION.map((item, idx) => (
              <div key={item.name} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[idx] }} />
                  <span className="text-sm font-medium text-slate-400">{item.name}</span>
                </div>
                <span className="text-sm font-bold text-white">{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Activity Table */}
      <div className="glass-dark rounded-[40px] overflow-hidden border border-white/5">
        <div className="p-8 border-b border-white/5 flex items-center justify-between">
          <h3 className="text-xl font-bold text-white">Recent Transactions</h3>
          <button className="text-primary text-sm font-bold hover:underline">View All</button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-white/5">
                <th className="px-8 py-4 text-xs font-black uppercase tracking-widest text-slate-500">User</th>
                <th className="px-8 py-4 text-xs font-black uppercase tracking-widest text-slate-500">Service</th>
                <th className="px-8 py-4 text-xs font-black uppercase tracking-widest text-slate-500">Amount</th>
                <th className="px-8 py-4 text-xs font-black uppercase tracking-widest text-slate-500">Status</th>
                <th className="px-8 py-4 text-xs font-black uppercase tracking-widest text-slate-500"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {[1, 2, 3].map((i) => (
                <tr key={i} className="hover:bg-white/5 transition-colors">
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-xs font-bold text-slate-400">JD</div>
                      <div>
                        <p className="text-sm font-bold text-white">John Doe</p>
                        <p className="text-[10px] text-slate-500">john@example.com</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <p className="text-sm font-medium text-slate-300">Professional Consultation</p>
                  </td>
                  <td className="px-8 py-5">
                    <p className="text-sm font-black text-white">₹500.00</p>
                  </td>
                  <td className="px-8 py-5">
                    <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-500 text-[10px] font-black uppercase tracking-widest border border-emerald-500/20">Success</span>
                  </td>
                  <td className="px-8 py-5 text-right">
                    <button className="p-2 text-slate-500 hover:text-white"><MoreHorizontal size={18} /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
