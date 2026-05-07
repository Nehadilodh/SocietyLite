import React, { useState } from 'react';
import api from '../../utils/axios';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-hot-toast';

const VisitorEntry = () => {
    const [formData, setFormData] = useState({ visitorName: '', phone: '', flatNo: '', purpose: 'Delivery' });
    const { darkMode } = useAuth();
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await api.post('/visitor/guard/entry', formData);
            toast.success('Entry added successfully!');
            setFormData({ name: '', phone: '', flatNo: '', purpose: 'Delivery' });
            if (window.refreshVisitorHistory) window.refreshVisitorHistory();
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to add entry');
        }
        setLoading(false);
    };

    return (
        <div className="max-w-xl mx-auto space-y-6">
            <h1 className="text-2xl font-bold">New Visitor Entry</h1>

            <div className={`p-8 rounded-3xl border shadow-sm ${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}`}>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>Visitor Name</label>
                        <input
                            type="text" required
                            className={`w-full p-3 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 border ${darkMode ? 'bg-slate-700 border-slate-600 text-white' : 'bg-white border-slate-300'}`}
                            value={formData.visitorName} onChange={e => setFormData({ ...formData, visitorName: e.target.value })}
                        />
                    </div>
                    <div>
                        <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>Phone Number</label>
                        <input
                            type="text" required
                            className={`w-full p-3 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 border ${darkMode ? 'bg-slate-700 border-slate-600 text-white' : 'bg-white border-slate-300'}`}
                            value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })}
                        />
                    </div>
                    <div>
                        <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>Flat Number</label>
                        <input
                            type="text" required
                            className={`w-full p-3 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 border ${darkMode ? 'bg-slate-700 border-slate-600 text-white' : 'bg-white border-slate-300'}`}
                            value={formData.flatNo} onChange={e => setFormData({ ...formData, flatNo: e.target.value })}
                        />
                    </div>
                    <div>
                        <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>Purpose</label>
                        <select
                            className={`w-full p-3 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 border ${darkMode ? 'bg-slate-700 border-slate-600 text-white' : 'bg-white border-slate-300'}`}
                            value={formData.purpose} onChange={e => setFormData({ ...formData, purpose: e.target.value })}
                        >
                            <option value="Delivery">Delivery</option>
                            <option value="Guest">Guest</option>
                            <option value="Maintenance">Maintenance</option>
                            <option value="Cab">Cab</option>
                            <option value="Maid">Maid</option>
                            <option value="Other">Other</option>
                        </select>
                    </div>
                    <button
                        type="submit" disabled={loading}
                        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white p-4 rounded-xl font-bold transition-colors disabled:opacity-50 mt-4"
                    >
                        {loading ? 'Adding...' : 'Add Entry'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default VisitorEntry;