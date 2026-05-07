import React, { useState, useEffect } from 'react';
import api from "../../utils/axios";
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-hot-toast';
import { MdSearch, MdRefresh } from 'react-icons/md';

const TodaysLog = () => {
    const [visitors, setVisitors] = useState([]);
    const [filteredVisitors, setFilteredVisitors] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);
    const { darkMode } = useAuth();

    useEffect(() => {
        fetchVisitors();
    }, []);

    useEffect(() => {
        // Search filter logic - optional chaining se crash-proof
        const filtered = visitors.filter(v =>
            v.visitorName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            v.phone?.includes(searchTerm) ||
            v.flatNo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            v.purpose?.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredVisitors(filtered);
    }, [searchTerm, visitors]);

    const fetchVisitors = async () => {
        setLoading(true);
        try {
            // OPTIMIZED: Direct /today route call karo
            // Backend MongoDB me hi filter kar dega
            const res = await api.get('/visitor/today');

            setVisitors(res.data.data);
            setFilteredVisitors(res.data.data);
        } catch (err) {
            console.error(err);
            toast.error('Failed to load today\'s log');
        } finally {
            setLoading(false);
        }
    };

    const handleMarkOut = async (id) => {
        try {
            await api.put(`/visitor/${id}/out`);
            toast.success('Visitor marked as out');
            fetchVisitors();
        } catch (err) {
            toast.error('Failed to update');
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <h1 className="text-2xl font-bold">Today's Visitors</h1>
                <div className="flex gap-3 w-full md:w-auto">
                    <div className="relative flex-1 md:w-64">
                        <MdSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                        <input
                            type="text"
                            placeholder="Search name, phone, flat..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className={`w-full pl-10 pr-4 py-2 rounded-lg border ${darkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white border-slate-300'} focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                        />
                    </div>
                    <button onClick={fetchVisitors} className={`px-4 py-2 rounded-lg border flex items-center gap-2 ${darkMode ? 'border-slate-700 hover:bg-slate-800 text-slate-300' : 'border-slate-300 hover:bg-slate-100 text-slate-700'}`}>
                        <MdRefresh size={18} /> Refresh
                    </button>
                </div>
            </div>

            <div className={`overflow-x-auto rounded-xl border ${darkMode ? 'border-slate-700 bg-slate-800' : 'border-slate-200 bg-white'}`}>
                <table className="w-full text-left">
                    <thead className={`border-b ${darkMode ? 'border-slate-700 bg-slate-800/50' : 'border-slate-200 bg-slate-50'}`}>
                        <tr>
                            <th className="p-4 font-medium">Name</th>
                            <th className="p-4 font-medium">Flat</th>
                            <th className="p-4 font-medium">Purpose</th>
                            <th className="p-4 font-medium">In Time</th>
                            <th className="p-4 font-medium">Out Time</th>
                            <th className="p-4 font-medium">Status</th>
                            <th className="p-4 font-medium">Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                        {loading ? (
                            <tr><td colSpan="7" className="p-8 text-center text-slate-500">Loading...</td></tr>
                        ) : filteredVisitors.length === 0 ? (
                            <tr><td colSpan="7" className="p-8 text-center text-slate-500">
                                {searchTerm ? 'No results found' : 'No visitors today'}
                            </td></tr>
                        ) : (
                            filteredVisitors.map((v) => (
                                <tr key={v._id} className={darkMode ? 'hover:bg-slate-700/50' : 'hover:bg-slate-50'}>
                                    <td className="p-4">
                                        <div className="font-medium">{v.visitorName}</div>
                                        <div className={`text-xs ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>{v.phone}</div>
                                    </td>
                                    <td className="p-4">{v.flatNo}</td>
                                    <td className="p-4">{v.purpose}</td>
                                    <td className="p-4 text-slate-500">{new Date(v.entryTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</td>
                                    <td className="p-4 text-slate-500">{v.exitTime ? new Date(v.exitTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '-'}</td>
                                    <td className="p-4">
                                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${v.status === 'Approved' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' :
                                                v.status === 'Denied' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' :
                                                    v.status === 'NotHome' ? 'bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-300' :
                                                        v.status === 'Exited' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' :
                                                            'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
                                            }`}>
                                            {v.exitTime ? 'Exited' : v.status}
                                        </span>
                                    </td>
                                    <td className="p-4">
                                        {v.status === 'Approved' && !v.exitTime && (
                                            <button
                                                onClick={() => handleMarkOut(v._id)}
                                                className="bg-slate-800 hover:bg-slate-900 text-white dark:bg-slate-700 dark:hover:bg-slate-600 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors"
                                            >
                                                Mark Out
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default TodaysLog;