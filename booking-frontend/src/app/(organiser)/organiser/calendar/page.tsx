'use client';

import { useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import { motion } from 'framer-motion';
import { 
  Plus, 
  Settings, 
  ChevronLeft, 
  ChevronRight,
  Filter,
  Download
} from 'lucide-react';

export default function OrganiserCalendarPage() {
  const [events] = useState([
    { title: 'Therapy Session - John', start: '2026-05-02T10:00:00', end: '2026-05-02T11:00:00', color: '#6366f1' },
    { title: 'Consultation - Jane', start: '2026-05-02T14:30:00', end: '2026-05-02T15:30:00', color: '#10b981' },
    { title: 'Group Workshop', start: '2026-05-03T09:00:00', end: '2026-05-03T12:00:00', color: '#f59e0b' },
  ]);

  return (
    <div className="max-w-[1600px] mx-auto h-[calc(100vh-160px)] flex flex-col">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Schedule Overview</h1>
          <p className="text-slate-400">Manage your availability and view upcoming appointments</p>
        </div>
        
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-white/5 border border-white/10 text-slate-300 hover:text-white transition-all font-bold text-sm">
            <Download size={18} />
            <span>Export</span>
          </button>
          <button className="flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-primary text-white font-bold text-sm shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all">
            <Plus size={20} />
            <span>Create Event</span>
          </button>
        </div>
      </div>

      <div className="flex-1 glass-dark rounded-[32px] p-8 border border-white/5 flex flex-col overflow-hidden">
        <div className="calendar-container flex-1 overflow-y-auto custom-scrollbar pr-2">
          <FullCalendar
            plugins={[dayGridPlugin, timeGridPlugin]}
            initialView="timeGridWeek"
            headerToolbar={{
              left: 'prev,next today',
              center: 'title',
              right: 'dayGridMonth,timeGridWeek,timeGridDay'
            }}
            events={events}
            height="100%"
            slotMinTime="08:00:00"
            slotMaxTime="20:00:00"
            allDaySlot={false}
            nowIndicator={true}
            editable={true}
            selectable={true}
            eventClassNames="rounded-lg border-none px-2 py-1 font-bold text-xs"
            dayHeaderClassNames="bg-transparent py-4 text-slate-500 font-black uppercase tracking-widest text-[10px]"
          />
        </div>
      </div>

      <style jsx global>{`
        .fc {
          --fc-border-color: rgba(255, 255, 255, 0.05);
          --fc-page-bg-color: transparent;
          --fc-neutral-bg-color: transparent;
          --fc-list-event-hover-bg-color: rgba(255, 255, 255, 0.05);
          --fc-today-bg-color: rgba(99, 102, 241, 0.05);
          --fc-event-bg-color: #6366f1;
          --fc-event-border-color: #6366f1;
          font-family: inherit;
        }
        .fc .fc-toolbar-title {
          font-size: 1.25rem;
          font-weight: 800;
          color: white;
        }
        .fc .fc-button {
          background-color: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          color: #94a3b8;
          font-weight: 700;
          text-transform: capitalize;
          border-radius: 12px;
          padding: 8px 16px;
          transition: all 0.2s;
        }
        .fc .fc-button:hover {
          background-color: rgba(255, 255, 255, 0.1);
          color: white;
        }
        .fc .fc-button-primary:not(:disabled).fc-button-active, 
        .fc .fc-button-primary:not(:disabled):active {
          background-color: #6366f1;
          border-color: #6366f1;
          color: white;
          box-shadow: 0 0 20px rgba(99, 102, 241, 0.3);
        }
        .fc th {
          border: none !important;
        }
        .fc-theme-standard td, .fc-theme-standard th {
          border-color: rgba(255, 255, 255, 0.05);
        }
        .fc .fc-timegrid-slot {
          height: 3rem;
        }
        .fc .fc-scrollgrid {
          border-radius: 24px;
          border: none;
        }
      `}</style>
    </div>
  );
}
