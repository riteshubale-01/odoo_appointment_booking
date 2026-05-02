'use client';

import { useAuthStore } from '@/store/useAuthStore';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { 
  LayoutDashboard, 
  CalendarDays, 
  User, 
  LogOut, 
  Bell, 
  Search,
  Menu,
  X
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

export default function CustomerLayout({ children }: { children: React.ReactNode }) {
  const { user, logout, isAuthenticated } = useAuthStore();
  const router = useRouter();
  const pathname = usePathname();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  useEffect(() => {
    // In a real app, check for token validity
    if (!isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, router]);

  if (!isAuthenticated) return null;

  const navItems = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'My Bookings', href: '/profile', icon: CalendarDays },
    { name: 'Profile', href: '/profile/settings', icon: User },
  ];

  return (
    <div className="min-h-screen bg-[#020617] flex text-slate-200 font-sans antialiased">
      {/* Sidebar */}
      <AnimatePresence mode="wait">
        {isSidebarOpen && (
          <motion.aside
            initial={{ x: -280 }}
            animate={{ x: 0 }}
            exit={{ x: -280 }}
            className="fixed inset-y-0 left-0 w-72 glass-dark border-r border-white/5 z-50 lg:relative"
          >
            <div className="p-8">
              <div className="flex items-center gap-3 mb-10">
                <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary/20">
                  <CalendarDays className="text-white" size={24} />
                </div>
                <span className="text-xl font-bold text-white tracking-tight">BookIt.</span>
              </div>

              <nav className="space-y-2">
                {navItems.map((item) => (
                  <button
                    key={item.name}
                    onClick={() => router.push(item.href)}
                    className={cn(
                      "w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl transition-all duration-200 group",
                      pathname === item.href 
                        ? "bg-primary/10 text-primary border border-primary/20 shadow-[0_0_20px_rgba(99,102,241,0.1)]" 
                        : "text-slate-400 hover:text-white hover:bg-white/5"
                    )}
                  >
                    <item.icon size={20} className={cn(
                      pathname === item.href ? "text-primary" : "text-slate-500 group-hover:text-slate-300"
                    )} />
                    <span className="font-medium">{item.name}</span>
                  </button>
                ))}
              </nav>

              <div className="absolute bottom-8 left-8 right-8">
                <button 
                  onClick={() => { logout(); router.push('/login'); }}
                  className="w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-all border border-transparent hover:border-rose-500/20"
                >
                  <LogOut size={20} />
                  <span className="font-medium">Logout</span>
                </button>
              </div>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Header */}
        <header className="h-20 border-b border-white/5 flex items-center justify-between px-8 bg-slate-900/20 backdrop-blur-sm sticky top-0 z-40">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2 hover:bg-white/5 rounded-xl text-slate-400 transition-colors"
            >
              <Menu size={20} />
            </button>
            <div className="relative hidden md:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
              <input 
                placeholder="Search services..." 
                className="bg-slate-800/40 border border-slate-800 rounded-xl pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 w-64 transition-all"
              />
            </div>
          </div>

          <div className="flex items-center gap-6">
            <button className="relative p-2 text-slate-400 hover:text-white transition-colors">
              <Bell size={20} />
              <span className="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full" />
            </button>
            <div className="flex items-center gap-3 pl-4 border-l border-white/10">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-bold text-white">{user?.name}</p>
                <p className="text-xs text-slate-500 capitalize">{user?.role}</p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-indigo-600 flex items-center justify-center text-white font-bold border border-white/10 shadow-lg">
                {user?.name?.charAt(0)}
              </div>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 overflow-y-auto p-8 custom-scrollbar">
          {children}
        </main>
      </div>
    </div>
  );
}
