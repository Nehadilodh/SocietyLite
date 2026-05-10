import React, { useState, useEffect } from 'react';
import api from "../../utils/axios";
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-hot-toast';
import { MdDelete } from 'react-icons/md';

const Inquiries = () => {
    const [inquiries, setInquiries] = useState([]);
    const { darkMode } = useAuth();

    useEffect(() => {
        fetchInquiries();
    }, []);

    const fetchInquiries = async () => {
        try {
            const res = await api.get('/inquiry/all');
            // Support legacy endpoints just in case
            setInquiries(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    const handleStatusChange = async (id, status) => {
        try {
            await api.put(`/inquiry/${id}/status`, { status });
            toast.success('Status updated successfully');
            fetchInquiries();
        } catch (err) {
            toast.error('Failed to update status');
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this inquiry?')) {
            try {
                await api.delete(`/inquiry/${id}`);
                toast.success('Inquiry deleted successfully');
                fetchInquiries();
            } catch (err) {
                toast.error('Failed to delete inquiry');
            }
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
                                    <select
                                        value={i.status === 'read' ? 'Contacted' : i.status === 'new' ? 'New' : i.status}
                                        onChange={(e) => handleStatusChange(i._id, e.target.value)}
                                        className={`p-1.5 text-sm rounded-lg border outline-none font-medium ${
                                            darkMode ? 'bg-slate-700 border-slate-600 text-white' : 'bg-white border-slate-300'
                                        }`}
                                    >
                                        <option value="New">New</option>
                                        <option value="Contacted">Contacted</option>
                                        <option value="Closed">Closed</option>
                                    </select>
                                </td>
                                <td className="p-4">
                                    <button onClick={() => handleDelete(i._id)} className="p-2 text-red-500 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-lg transition-colors">
                                        <MdDelete size={20} />
                                    </button>
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
