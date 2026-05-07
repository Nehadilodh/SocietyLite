// import { useState, useEffect } from 'react'
// import axios from 'axios'
// import { toast } from 'react-hot-toast'

// export default function GuardDashboard() {
//   const [visitors, setVisitors] = useState([])
//   const [loading, setLoading] = useState(true)

//   const fetchHistory = async () => {
//     console.log('1. fetchHistory chala')
//     try {
//       const token = localStorage.getItem('token')
//       console.log('2. Token:', token)

//       const res = await axios.get('/api/visitor/guard/history', {
//         headers: { 'x-auth-token': token }
//       })
//       console.log('3. API Response:', res.data)
//       setVisitors(res.data.data || [])
//     } catch (err) {
//       console.log('4. Error:', err)
//       toast.error('History load nahi hui')
//       setVisitors([])
//     } finally {
//       setLoading(false)
//     }
//   }

//   useEffect(() => {
//     console.log('0. Dashboard mount hua') // <-- Add kar
//     fetchHistory()
//   }, [])


//   return (
//     <div className="p-6">
//       <h1 className="text-2xl font-bold mb-6 text-gray-900 dark:text-gray-100">
//         Guard Dashboard
//       </h1>

//       <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700">
//         <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100">
//           Visitor History
//         </h2>

//         <div className="overflow-x-auto">
//           <table className="w-full">
//             <thead>
//               <tr className="border-b border-gray-200 dark:border-gray-600">
//                 <th className="text-left p-3 text-gray-700 dark:text-gray-200 font-semibold">Name</th>
//                 <th className="text-left p-3 text-gray-700 dark:text-gray-200 font-semibold">Phone</th>
//                 <th className="text-left p-3 text-gray-700 dark:text-gray-200 font-semibold">Flat</th>
//                 <th className="text-left p-3 text-gray-700 dark:text-gray-200 font-semibold">Purpose</th>
//                 <th className="text-left p-3 text-gray-700 dark:text-gray-200 font-semibold">Time</th>
//               </tr>
//             </thead>
//             <tbody>
//               {loading ? (
//                 <tr>
//                   <td colSpan="5" className="text-center p-8 text-gray-500 dark:text-gray-400">
//                     Loading...
//                   </td>
//                 </tr>
//               ) : visitors.length === 0 ? (
//                 <tr>
//                   <td colSpan="5" className="text-center p-8 text-gray-500 dark:text-gray-400">
//                     No visitors yet. Add from sidebar.
//                   </td>
//                 </tr>
//               ) : (
//                 visitors.map((v) => (
//                   <tr key={v._id} className="border-b border-gray-100 dark:border-gray-700">
//                     <td className="p-3 text-gray-900 dark:text-gray-100">{v.visitorName}</td>
//                     <td className="p-3 text-gray-900 dark:text-gray-100">{v.phone}</td>
//                     <td className="p-3 text-gray-900 dark:text-gray-100">{v.flatNo}</td>
//                     <td className="p-3 text-gray-900 dark:text-gray-100">{v.purpose}</td>
//                     <td className="p-3 text-gray-900 dark:text-gray-100">
//                       {new Date(v.entryTime).toLocaleTimeString()}
//                     </td>
//                   </tr>
//                 ))
//               )}
//             </tbody>
//           </table>
//         </div>
//       </div>
//     </div>
//   )
// }
import React, { useState, useEffect } from 'react';
import api from '../../utils/axios';
import { useAuth } from '../../context/AuthContext';
import { MdPeople, MdAccessTime, MdHourglassEmpty } from 'react-icons/md';

export default function GuardDashboard() {
  const { darkMode, user } = useAuth();
  const [stats, setStats] = useState({ todayVisitors: 0, currentlyInside: 0, pending: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get('/visitor/guard/history');
        const today = new Date().toDateString();
        const visitors = res.data.data || res.data || [];

        // Aaj ke visitors filter karo
        const todayVis = visitors.filter(v => new Date(v.entryTime).toDateString() === today);

        // Jo andar hain (Approved hain aur exitTime nahi hai)
        const inside = todayVis.filter(v => !v.exitTime && v.status === 'Approved');

        // Jo Pending hain (Resident ka wait kar rahe hain)
        const pendingVis = todayVis.filter(v => v.status === 'Pending');

        setStats({
          todayVisitors: todayVis.length,
          currentlyInside: inside.length,
          pending: pendingVis.length
        });
      } catch (err) {
        console.error('Failed to load stats', err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-800 dark:text-white">Guard Dashboard</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1">Welcome back, {user?.name || 'Guard'}. Here is today's overview.</p>
      </div>

      {/* Grid ko 3 columns me change kiya */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">

        {/* Stats Card 1: Total Visitors */}
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

        {/* Stats Card 2: Currently Inside */}
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

        {/* Stats Card 3: Pending Approvals */}
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