import React, { useState, useEffect } from 'react';
import api from '../../utils/axios';
import { useAuth } from '../../context/AuthContext';
import { useSocket } from '../../context/SocketContext'; // YE LINE THEEK KI
import { MdPeople, MdAccessTime, MdHourglassEmpty } from 'react-icons/md';
import toast, { Toaster } from 'react-hot-toast';

export default function GuardDashboard() {
  const { darkMode, user } = useAuth();
  const socket = useSocket();
  const [stats, setStats] = useState({ todayVisitors: 0, currentlyInside: 0, pending: 0 });
  const [loading, setLoading] = useState(true);

  const fetchStats = async () => {
    try {
      const res = await api.get('/visitor/guard/history');
      const today = new Date().toDateString();
      const visitors = res.data.data || res.data || [];

      const todayVis = visitors.filter(v => new Date(v.entryTime).toDateString() === today);
      const inside = todayVis.filter(v => !v.exitTime && v.status === 'Approved');
      const pendingVis = todayVis.filter(v => v.status === 'Pending');

      setStats({
        todayVisitors: todayVis.length,
        currentlyInside: inside.length,
        pending: pendingVis.length
      });
    } catch (err) {
      console.error('Failed to load stats', err);
      toast.error('Failed to load stats');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();

    if (socket) {
      socket.on('new_sos_alert', (data) => {
        toast.error(
          `🚨 SOS ALERT: Flat ${data.flatNo} - ${data.name} needs help!`,
          {
            duration: 10000,
            style: {
              background: '#DC2626',
              color: 'white',
              fontSize: '16px',
              fontWeight: 'bold'
            }
          }
        );
        const audio = new Audio('https://assets.mixkit.co/sfx/preview/mixkit-alarm-digital-clock-beep-989.mp3');
        audio.play().catch(e => console.log('Audio play failed'));
      });

      socket.on('visitor_status_update', (data) => {
        toast.success(`Visitor ${data.visitorName} was ${data.status} by ${data.flatNo}`);
        fetchStats();
      });

      socket.on('new_visitor_entry', () => {
        fetchStats();
      });

      return () => {
        socket.off('new_sos_alert');
        socket.off('visitor_status_update');
        socket.off('new_visitor_entry');
      };
    }
  }, [socket]);

  return (
    <div className="space-y-6">
      <Toaster position="top-right" />
      <div>
        <h1 className="text-3xl font-bold text-slate-800 dark:text-white">Guard Dashboard</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1">Welcome back, {user?.name || 'Guard'}. Here is today's overview.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
        <div className={`p-6 rounded-xl shadow-sm border flex items-center gap-5 ${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}`}>
          <div className="p-4 bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400 rounded-xl">
            <MdPeople size={36} />
          </div>
          <div>
            <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">Total Visitors Today</p>
            <p className="text-3xl font-bold text-slate-800 dark:text-white">
              {loading ? '...' : stats.todayVisitors}
            </p>
          </div>
        </div>

        <div className={`p-6 rounded-xl shadow-sm border flex items-center gap-5 ${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}`}>
          <div className="p-4 bg-amber-100 dark:bg-amber-900/50 text-amber-600 dark:text-amber-400 rounded-xl">
            <MdAccessTime size={36} />
          </div>
          <div>
            <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">Currently Inside</p>
            <p className="text-3xl font-bold text-slate-800 dark:text-white">
              {loading ? '...' : stats.currentlyInside}
            </p>
          </div>
        </div>

        <div className={`p-6 rounded-xl shadow-sm border flex items-center gap-5 ${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}`}>
          <div className="p-4 bg-orange-100 dark:bg-orange-900/50 text-orange-600 dark:text-orange-400 rounded-xl">
            <MdHourglassEmpty size={36} />
          </div>
          <div>
            <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">Pending Approvals</p>
            <p className="text-3xl font-bold text-slate-800 dark:text-white">
              {loading ? '...' : stats.pending}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}