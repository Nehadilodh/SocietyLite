import React, { useState, useEffect } from 'react';
import api from "../../utils/axios";
import { useAuth } from "../../context/AuthContext";
import { MdCampaign } from 'react-icons/md';

const Notice = () => {
    const [notices, setNotices] = useState([]);
    const { darkMode } = useAuth();

    useEffect(() => {
        const fetchNotices = async () => {
            try {
                const res = await api.get('/public/notices');
                setNotices(res.data);
            } catch (err) {
                console.error(err);
            }
        };
        fetchNotices();
    }, []);

    return (
        <div className="space-y-6 max-w-4xl mx-auto">
            <h1 className="text-2xl font-bold flex items-center gap-2"><MdCampaign className="text-indigo-600 dark:text-indigo-400" /> Notice Board</h1>
            
            <div className="space-y-4">
                {notices.map((n) => (
                    <div key={n._id} className={`p-6 rounded-2xl border ${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'} shadow-sm relative overflow-hidden`}>
                        <div className={`absolute top-0 left-0 w-2 h-full ${
                            n.priority === 'Urgent' ? 'bg-red-500' : 
                            n.priority === 'High' ? 'bg-amber-500' : 'bg-indigo-500'
                        }`}></div>
                        <div className="flex justify-between items-start mb-4">
                            <h2 className="text-xl font-bold">{n.title}</h2>
                            <span className="text-xs text-slate-500 dark:text-slate-400">{new Date(n.createdAt).toLocaleDateString()}</span>
                        </div>
                        <div className="flex gap-2 mb-4">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${darkMode ? 'bg-slate-700 text-slate-300' : 'bg-slate-100 text-slate-700'}`}>{n.type}</span>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                n.priority === 'Urgent' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' : 
                                n.priority === 'High' ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400' : 
                                'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400'
                            }`}>{n.priority}</span>
                        </div>
                        <p className={darkMode ? 'text-slate-300' : 'text-slate-600'}>{n.description}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Notice;
