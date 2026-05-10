import React, { useState, useEffect } from 'react';
import api from "../../utils/axios";
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-hot-toast';
import { MdAdd, MdFilterList } from 'react-icons/md';

const Bills = () => {
    const [bills, setBills] = useState([]);
    const [users, setUsers] = useState([]);
    const [filterDefaulters, setFilterDefaulters] = useState(false);
    const [showForm, setShowForm] = useState(false);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        userId: '',
        month: '',
        amount: '',
        dueDate: ''
    });
    const { darkMode } = useAuth();

    useEffect(() => {
        fetchBills();
        fetchUsers();
    }, []);

    const fetchBills = async () => {
        try {
            const res = await api.get('/bill/all');
            setBills(res.data);
        } catch (err) {
            console.error(err);
            toast.error('Failed to fetch bills');
        }
    };

    const fetchUsers = async () => {
        try {
            // FIX: Sahi route call kiya /api/user/all
            const res = await api.get('/user/all');
            setUsers(res.data);
            if (res.data.length === 0) toast.error('No residents found. Add residents first');
        } catch (err) {
            console.error(err);
            toast.error('Failed to fetch residents');
        }
    };

    const handleGenerateBill = async (e) => {
        e.preventDefault();
        if (!formData.userId) return toast.error('Please select a resident');
        setLoading(true);
        try {
            await api.post('/bill/generate', formData);
            toast.success('Bill generated successfully');
            setShowForm(false);
            setFormData({ userId: '', month: '', amount: '', dueDate: '' });
            fetchBills();
        } catch (err) {
            toast.error(err.response?.data?.msg || 'Failed to generate bill');
        }
        setLoading(false);
    };

    const filteredBills = filterDefaulters ? bills.filter(b => b.status === 'Unpaid') : bills;

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <h1 className="text-2xl font-bold">Billing Management</h1>
                <div className="flex gap-4">
                    <button
                        onClick={() => setFilterDefaulters(!filterDefaulters)}
                        className={`px-4 py-2 rounded-lg border font-medium transition-colors flex items-center gap-2 ${filterDefaulters ? 'bg-red-50 text-red-600 border-red-200 dark:bg-red-900/30 dark:border-red-800 dark:text-red-400' : (darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200')}`}
                    >
                        <MdFilterList /> {filterDefaulters ? 'Showing Defaulters' : 'Show Defaulters'}
                    </button>
                    <button
                        onClick={() => setShowForm(!showForm)}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2"
                    >
                        <MdAdd /> Generate Bill
                    </button>
                </div>
            </div>

            {showForm && (
                <div className={`p-6 rounded-xl border ${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}`}>
                    <h2 className="text-lg font-bold mb-4">Generate New Bill</h2>
                    <form onSubmit={handleGenerateBill} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <select
                            required
                            value={formData.userId}
                            onChange={e => setFormData({ ...formData, userId: e.target.value })}
                            className={`px-4 py-2 rounded-lg border outline-none ${darkMode ? 'bg-slate-700 border-slate-600' : 'bg-white border-slate-300'}`}
                        >
                            <option value="">Select Resident</option>
                            {users.map(u => (
                                <option key={u._id} value={u._id}>{u.name} - Flat {u.flatNo || 'Not Assigned'}</option>
                            ))}
                        </select>
                        <input
                            type="month"
                            required
                            value={formData.month}
                            onChange={e => setFormData({ ...formData, month: e.target.value })}
                            className={`px-4 py-2 rounded-lg border outline-none ${darkMode ? 'bg-slate-700 border-slate-600' : 'bg-white border-slate-300'}`}
                        />
                        <input
                            type="number"
                            required
                            placeholder="Amount (₹)"
                            value={formData.amount}
                            onChange={e => setFormData({ ...formData, amount: e.target.value })}
                            className={`px-4 py-2 rounded-lg border outline-none ${darkMode ? 'bg-slate-700 border-slate-600' : 'bg-white border-slate-300'}`}
                        />
                        <input
                            type="date"
                            required
                            value={formData.dueDate}
                            onChange={e => setFormData({ ...formData, dueDate: e.target.value })}
                            className={`px-4 py-2 rounded-lg border outline-none ${darkMode ? 'bg-slate-700 border-slate-600' : 'bg-white border-slate-300'}`}
                        />
                        <div className="md:col-span-2 flex gap-2">
                            <button type="submit" disabled={loading} className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-medium disabled:opacity-50">
                                {loading ? 'Creating...' : 'Create Bill'}
                            </button>
                            <button type="button" onClick={() => setShowForm(false)} className={`px-6 py-2 rounded-lg font-medium ${darkMode ? 'bg-slate-700' : 'bg-slate-200'}`}>
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            )}

            <div className={`overflow-x-auto rounded-xl border ${darkMode ? 'border-slate-700 bg-slate-800' : 'border-slate-200 bg-white'}`}>
                <table className="w-full text-left">
                    <thead className={`border-b ${darkMode ? 'border-slate-700 bg-slate-800/50' : 'border-slate-200 bg-slate-50'}`}>
                        <tr>
                            <th className="p-4 font-medium">Resident</th>
                            <th className="p-4 font-medium">Flat No</th>
                            <th className="p-4 font-medium">Month</th>
                            <th className="p-4 font-medium">Amount</th>
                            <th className="p-4 font-medium">Due Date</th>
                            <th className="p-4 font-medium">Status</th>
                            <th className="p-4 font-medium">Paid At</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                        {filteredBills.map((b) => (
                            <tr key={b._id} className={darkMode ? 'hover:bg-slate-700/50' : 'hover:bg-slate-50'}>
                                <td className="p-4 font-medium">{b.userId?.name}</td>
                                <td className="p-4">{b.userId?.flatNo}</td>
                                <td className="p-4">{b.month}</td>
                                <td className="p-4 font-medium">₹{b.amount}</td>
                                <td className="p-4 text-slate-500">{new Date(b.dueDate).toLocaleDateString()}</td>
                                <td className="p-4">
                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${b.status === 'Paid' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'}`}>
                                        {b.status}
                                    </span>
                                </td>
                                <td className="p-4 text-slate-500 text-sm">
                                    {b.paidAt ? new Date(b.paidAt).toLocaleDateString() : '-'}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Bills;