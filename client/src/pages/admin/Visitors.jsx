import React, { useState, useEffect } from 'react';
import api from "../../utils/axios";
import { useAuth } from '../../context/AuthContext';
import { MdDownload } from 'react-icons/md';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

const Visitors = () => {
    const [visitors, setVisitors] = useState([]);
    const [filter, setFilter] = useState('Today'); // 'Today' or 'All'
    const { darkMode } = useAuth();

    useEffect(() => {
        const fetchVisitors = async () => {
            try {
                const res = await api.get('/visitor/all');
                setVisitors(res.data.data);
            } catch (err) {
                console.error(err);
            }
        };
        fetchVisitors();
    }, []);

    const filteredVisitors = visitors.filter(v => {
        if (!v.createdAt && !v.entryTime) return false;
        if (filter === 'All') return true;
        
        const today = new Date().toISOString().split('T')[0];
        const vDate = new Date(v.createdAt || v.entryTime).toISOString().split('T')[0];
        return vDate === today;
    });

    const exportPDF = () => {
        const doc = new jsPDF();
        doc.text("Visitor Logs", 14, 15);
        
        const tableColumn = ["Name", "Flat", "Purpose", "Date", "In Time", "Out Time", "Status"];
        const tableRows = [];

        filteredVisitors.forEach(v => {
            const visitorData = [
                v.visitorName,
                v.flatNo,
                v.purpose,
                new Date(v.createdAt || v.entryTime).toLocaleDateString(),
                v.entryTime ? new Date(v.entryTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '-',
                v.exitTime ? new Date(v.exitTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '-',
                v.status
            ];
            tableRows.push(visitorData);
        });

        doc.autoTable({
            head: [tableColumn],
            body: tableRows,
            startY: 20,
        });

        doc.save(`visitor_logs_${filter.toLowerCase()}.pdf`);
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <h1 className="text-2xl font-bold">Visitor Logs</h1>
                <div className="flex items-center gap-4">
                    <select
                        value={filter}
                        onChange={(e) => setFilter(e.target.value)}
                        className={`p-2.5 rounded-lg border focus:ring-2 focus:ring-indigo-500 font-medium ${darkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white border-slate-300'}`}
                    >
                        <option value="Today">Today's Visitors</option>
                        <option value="All">Complete History</option>
                    </select>
                    <button
                        onClick={exportPDF}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2.5 rounded-lg flex items-center gap-2 transition-colors font-medium shadow-sm"
                    >
                        <MdDownload /> Download PDF
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
                            <th className="p-4 font-medium">Date</th>
                            <th className="p-4 font-medium">In Time</th>
                            <th className="p-4 font-medium">Out Time</th>
                            <th className="p-4 font-medium">Status</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                        {filteredVisitors.map((v) => (
                            <tr key={v._id} className={darkMode ? 'hover:bg-slate-700/50' : 'hover:bg-slate-50'}>
                                <td className="p-4">
                                    <div className="font-medium">{v.visitorName}</div>
                                    <div className={`text-xs ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>{v.phone}</div>
                                </td>
                                <td className="p-4">{v.flatNo}</td>
                                <td className="p-4">{v.purpose}</td>
                                <td className="p-4 text-slate-500">{new Date(v.createdAt || v.entryTime).toLocaleDateString()}</td>
                                <td className="p-4 text-slate-500">{v.entryTime ? new Date(v.entryTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '-'}</td>
                                <td className="p-4 text-slate-500">{v.exitTime ? new Date(v.exitTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '-'}</td>
                                <td className="p-4">
                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${v.status === 'Approved' || v.status === 'Exited' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' :
                                        v.status === 'Denied' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' :
                                            v.status === 'Not Home' ? 'bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-300' :
                                                'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
                                        }`}>
                                        {v.status}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Visitors;
