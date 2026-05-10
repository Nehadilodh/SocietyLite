import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from "../../utils/axios";
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-hot-toast';

const Complaints = () => {
    const [complaints, setComplaints] = useState([]);
    const { darkMode } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        fetchComplaints();
    }, []);

    const fetchComplaints = async () => {
        try {
            const res = await api.get('/complaint/all');
            setComplaints(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    const handleGenerateSummary = async (e, id) => {
        e.stopPropagation();
        try {
            await api.post(`/complaint/${id}/generate-summary`);
            toast.success('Summary generated successfully');
            fetchComplaints();
        } catch (err) {
            toast.error('Failed to generate summary');
        }
    };

    const updateStatus = async (e, id, status) => {
        e.stopPropagation();
        try {
            await api.put(`/complaint/${id}/status`, { status });
            toast.success('Status updated - Notification sent to resident');
            fetchComplaints();
        } catch (err) {
            toast.error('Failed to update status');
        }
    };

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold">Manage Complaints</h1>

            <div className={`overflow-x-auto rounded-xl border ${darkMode ? 'border-slate-700 bg-slate-800' : 'border-slate-200 bg-white'}`}>
                <table className="w-full text-left">
                    <thead className={`border-b ${darkMode ? 'border-slate-700 bg-slate-800/50' : 'border-slate-200 bg-slate-50'}`}>
                        <tr>
                            <th className="p-4 font-medium">Resident</th>
                            <th className="p-4 font-medium">Title & Category</th>
                            <th className="p-4 font-medium w-1/3">AI Summary</th>
                            <th className="p-4 font-medium">Status</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                        {complaints.map((c) => (
                            <tr key={c._id} className={`${darkMode ? 'hover:bg-slate-700/50' : 'hover:bg-slate-50'} cursor-pointer`} onClick={() => navigate(`/admin/complaints/${c._id}`)}>
                                <td className="p-4">
                                    <div className="font-medium">{c.raisedBy?.name}</div>
                                    <div className={`text-xs ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>Flat {c.raisedBy?.flatNo}</div>
                                </td>
                                <td className="p-4">
                                    <div className="font-medium">{c.title}</div>
                                    <span className="text-xs text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/30 px-2 py-0.5 rounded-full">{c.category}</span>
                                </td>
                                <td className="p-4">
                                    <p className={`text-sm mb-2 ${darkMode ? 'text-slate-300' : 'text-slate-600'}`}>{c.aiSummary}</p>
                                    {c.aiSummary === 'Pending AI Summary' && (
                                        <button
                                            onClick={(e) => handleGenerateSummary(e, c._id)}
                                            className="text-xs bg-indigo-100 hover:bg-indigo-200 text-indigo-700 dark:bg-indigo-900/50 dark:text-indigo-300 dark:hover:bg-indigo-800 px-3 py-1 rounded-lg font-medium transition-colors"
                                        >
                                            Generate Summary
                                        </button>
                                    )}
                                </td>
                                <td className="p-4">
                                    <select
                                        onClick={e => e.stopPropagation()}
                                        onChange={e => updateStatus(e, c._id, e.target.value)}
                                        value={c.status}
                                        className={`text-sm p-2 rounded-lg border outline-none ${darkMode ? 'bg-slate-800 border-slate-600' : 'bg-white border-slate-300'}`}
                                    >
                                        <option value="Open">Open</option>
                                        <option value="In Progress">In Progress</option>
                                        <option value="Resolved">Resolved</option>
                                    </select>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Complaints;