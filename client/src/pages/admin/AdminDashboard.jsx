import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

const AdminDashboard = () => {
  const { darkMode } = useAuth();
  const [stats, setStats] = useState({ residents: 0, guards: 0, complaints: 0, inquiries: 0 });

  // Mock data for charts
  const complaintData = [
    { name: 'Jan', Maintenance: 4, Security: 2, Other: 1 },
    { name: 'Feb', Maintenance: 3, Security: 1, Other: 2 },
    { name: 'Mar', Maintenance: 5, Security: 3, Other: 1 },
  ];

  const billData = [
    { name: 'Paid', value: 85 },
    { name: 'Unpaid', value: 15 },
  ];
  const COLORS = ['#10B981', '#F59E0B'];

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    setStats({ residents: 120, guards: 8, complaints: 15, inquiries: 4 });
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
      <h1 className="text-2xl font-bold">Admin Dashboard</h1>
      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className={`p-6 rounded-3xl border-t-4 border-indigo-500 shadow-sm ${darkMode ? 'bg-slate-800' : 'bg-white'}`}>
          <div className="text-slate-500 text-sm font-bold mb-2 uppercase tracking-wider">Residents</div>
          <div className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-slate-900'}`}>{stats.residents}</div>
        </div>
        <div className={`p-6 rounded-3xl border-t-4 border-blue-500 shadow-sm ${darkMode ? 'bg-slate-800' : 'bg-white'}`}>
          <div className="text-slate-500 text-sm font-bold mb-2 uppercase tracking-wider">Guards</div>
          <div className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-slate-900'}`}>{stats.guards}</div>
        </div>
        <div className={`p-6 rounded-3xl border-t-4 border-amber-500 shadow-sm ${darkMode ? 'bg-slate-800' : 'bg-white'}`}>
          <div className="text-slate-500 text-sm font-bold mb-2 uppercase tracking-wider">Complaints</div>
          <div className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-slate-900'}`}>{stats.complaints}</div>
        </div>
        <div className={`p-6 rounded-3xl border-t-4 border-green-500 shadow-sm ${darkMode ? 'bg-slate-800' : 'bg-white'}`}>
          <div className="text-slate-500 text-sm font-bold mb-2 uppercase tracking-wider">Inquiries</div>
          <div className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-slate-900'}`}>{stats.inquiries}</div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid lg:grid-cols-2 gap-8">
        <div className={`p-6 rounded-3xl h-[400px] flex flex-col shadow-sm ${darkMode ? 'bg-slate-800' : 'bg-white'}`}>
          <h3 className={`font-bold mb-6 ${darkMode ? 'text-white' : 'text-slate-800'}`}>Monthly Complaints</h3>
          <div className="flex-1 min-h-0">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={complaintData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={darkMode ? "#334155" : "#E2E8F0"} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} stroke={darkMode ? "#94a3b8" : "#64748b"} />
                <YAxis axisLine={false} tickLine={false} stroke={darkMode ? "#94a3b8" : "#64748b"} />
                <Tooltip cursor={{ fill: darkMode ? '#1e293b' : '#F1F5F9' }} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', background: darkMode ? '#1e293b' : '#fff', color: darkMode ? '#fff' : '#000' }} />
                <Legend iconType="circle" wrapperStyle={{ color: darkMode ? '#fff' : '#000' }} />
                <Bar dataKey="Maintenance" stackId="a" fill="#4F46E5" radius={[0, 0, 4, 4]} />
                <Bar dataKey="Security" stackId="a" fill="#F59E0B" />
                <Bar dataKey="Other" stackId="a" fill="#10B981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className={`p-6 rounded-3xl h-[400px] flex flex-col shadow-sm ${darkMode ? 'bg-slate-800' : 'bg-white'}`}>
          <h3 className={`font-bold mb-6 ${darkMode ? 'text-white' : 'text-slate-800'}`}>Bill Payment Status</h3>
          <div className="flex-1 min-h-0">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={billData} cx="50%" cy="50%" innerRadius={80} outerRadius={120} paddingAngle={5} dataKey="value">
                  {billData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', background: darkMode ? '#1e293b' : '#fff', color: darkMode ? '#fff' : '#000' }} />
                <Legend iconType="circle" wrapperStyle={{ color: darkMode ? '#fff' : '#000' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default AdminDashboard;
