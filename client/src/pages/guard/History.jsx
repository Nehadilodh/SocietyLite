import React, { useState, useEffect } from 'react';
import api from "../../utils/axios";
import { useAuth } from '../../context/AuthContext';

const GuardHistory = () => {
    const [visitors, setVisitors] = useState([]);
    const [month, setMonth] = useState(new Date().toISOString().slice(0, 7)); // YYYY-MM
    const [loading, setLoading] = useState(true);
    const { darkMode } = useAuth();

    useEffect(() => {
        const fetchVisitors = async () => {
            try {
                // FIX 1: Guard wala endpoint use kar
                const res = await api.get('/visitor/guard/history');
                setVisitors(res.data.data || res.data || []);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchVisitors();
    }, []);

    // FIX 2: entryTime null ho to createdAt use kar
    const filteredVisitors = visitors.filter(v => {
        const dateToCheck = v.entryTime || v.createdAt; // Pending ke liye createdAt
        if (!dateToCheck) return false;
        const vMonth = new Date(dateToCheck).toISOString().slice(0, 7);
        return vMonth === month;
    });

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <h1 className="text-2xl font-bold">Visitor History</h1>
                <input
                    type="month"
                    value={month}
                    onChange={(e) => setMonth(e.target.value)}
                    className={`p-2 rounded-lg border outline-none ${darkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white border-slate-300'}`}
                />
            </div>

            <div className={`overflow-x-auto rounded-xl border ${darkMode ? 'border-slate-700 bg-slate-800' : 'border-slate-200 bg-white'}`}>
                <table className="w-full text-left">
                    <thead className={`border-b ${darkMode ? 'border-slate-700 bg-slate-800/50' : 'border-slate-200 bg-slate-50'}`}>
                        <tr>
                            <th className="p-4 font-medium">Name</th>
                            <th className="p-4 font-medium">Flat</th>
                            <th className="p-4 font-medium">Purpose</th>
                            <th className="p-4 font-medium">Date</th>
                            <th className="p-4 font-medium">In Time</th>
                            <th className="p-4 font-medium">Out Time</th>
                            <th className="p-4 font-medium">Status</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                        {loading ? (
                            <tr>
                                <td colSpan="7" className="p-8 text-center text-slate-500">Loading...</td>
                            </tr>
                        ) : filteredVisitors.map((v) => (
                            <tr key={v._id} className={darkMode ? 'hover:bg-slate-700/50' : 'hover:bg-slate-50'}>
                                <td className="p-4">
                                    <div className="font-medium">{v.visitorName}</div>
                                    <div className={`text-xs ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>{v.phone}</div>
                                </td>
                                <td className="p-4">{v.flatNo}</td>
                                <td className="p-4">{v.purpose}</td>
                                {/* FIX 3: Date ke liye bhi createdAt fallback */}
                                <td className="p-4 text-slate-500">
                                    {new Date(v.entryTime || v.createdAt).toLocaleDateString()}
                                </td>
                                <td className="p-4 text-slate-500">
                                    {v.entryTime ? new Date(v.entryTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '-'}
                                </td>
                                <td className="p-4 text-slate-500">
                                    {v.exitTime ? new Date(v.exitTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '-'}
                                </td>
                                <td className="p-4">
                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${v.status === 'Approved' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' :
                                        v.status === 'Denied' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' :
                                            v.status === 'NotHome' ? 'bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-300' :
                                                'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
                                        }`}>
                                        {v.status}
                                    </span>
                                </td>
                            </tr>
                        ))}
                        {!loading && filteredVisitors.length === 0 && (
                            <tr>
                                <td colSpan="7" className="p-8 text-center text-slate-500">No logs found for this month</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default GuardHistory;