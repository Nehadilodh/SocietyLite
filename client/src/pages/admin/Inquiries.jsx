import React, { useState, useEffect } from 'react';
import api from "../../utils/axios";
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-hot-toast';

const Inquiries = () => {
    const [inquiries, setInquiries] = useState([]);
    const { darkMode } = useAuth();

    useEffect(() => {
        fetchInquiries();
    }, []);

    const fetchInquiries = async () => {
        try {
            const res = await api.get('/public/inquiries'); // Assume admin route if available
            setInquiries(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    const handleMarkRead = async (id) => {
        try {
            await api.put(`/public/inquiries/${id}/read`);
            toast.success('Inquiry marked as read');
            fetchInquiries();
        } catch (err) {
            toast.error('Failed to mark read');
        }
    };

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold">Contact Inquiries</h1>

            <div className={`overflow-x-auto rounded-xl border ${darkMode ? 'border-slate-700 bg-slate-800' : 'border-slate-200 bg-white'}`}>
                <table className="w-full text-left">
                    <thead className={`border-b ${darkMode ? 'border-slate-700 bg-slate-800/50' : 'border-slate-200 bg-slate-50'}`}>
                        <tr>
                            <th className="p-4 font-medium">Name</th>
                            <th className="p-4 font-medium">Email / Phone</th>
                            <th className="p-4 font-medium">Message</th>
                            <th className="p-4 font-medium">Status</th>
                            <th className="p-4 font-medium">Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                        {inquiries.map((i) => (
                            <tr key={i._id} className={darkMode ? 'hover:bg-slate-700/50' : 'hover:bg-slate-50'}>
                                <td className="p-4 font-medium">{i.name}</td>
                                <td className="p-4 text-sm text-slate-500">{i.email} <br /> {i.phone}</td>
                                <td className="p-4 text-sm max-w-xs truncate">{i.message}</td>
                                <td className="p-4">
                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${i.read ? 'bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-300' : 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                                        }`}>
                                        {i.read ? 'Read' : 'New'}
                                    </span>
                                </td>
                                <td className="p-4">
                                    {!i.read && (
                                        <button
                                            onClick={() => handleMarkRead(i._id)}
                                            className="text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300 font-medium text-sm"
                                        >
                                            Mark Read
                                        </button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Inquiries;
