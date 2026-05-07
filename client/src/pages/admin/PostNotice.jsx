import React, { useState } from 'react';
import api from "../../utils/axios";
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-hot-toast';

const PostNotice = () => {
    const [formData, setFormData] = useState({ title: '', description: '', type: 'General', priority: 'Normal' });
    const { darkMode } = useAuth();
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await api.post('/public/notices', formData);
            toast.success('Notice posted successfully');
            setFormData({ title: '', description: '', type: 'General', priority: 'Normal' });
        } catch (err) {
            toast.error('Failed to post notice');
        }
        setLoading(false);
    };

    return (
        <div className="max-w-3xl mx-auto space-y-6">
            <h1 className="text-2xl font-bold">Post New Notice</h1>

            <div className={`p-8 rounded-3xl border shadow-sm ${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}`}>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>Notice Title</label>
                        <input
                            type="text" required
                            className={`w-full p-3 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 border ${darkMode ? 'bg-slate-700 border-slate-600 text-white' : 'bg-white border-slate-300'}`}
                            value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })}
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-6">
                        <div>
                            <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>Type</label>
                            <select
                                className={`w-full p-3 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 border ${darkMode ? 'bg-slate-700 border-slate-600 text-white' : 'bg-white border-slate-300'}`}
                                value={formData.type} onChange={e => setFormData({ ...formData, type: e.target.value })}
                            >
                                <option value="General">General</option>
                                <option value="Maintenance">Maintenance</option>
                                <option value="Event">Event</option>
                            </select>
                        </div>
                        <div>
                            <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>Priority</label>
                            <select
                                className={`w-full p-3 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 border ${darkMode ? 'bg-slate-700 border-slate-600 text-white' : 'bg-white border-slate-300'}`}
                                value={formData.priority} onChange={e => setFormData({ ...formData, priority: e.target.value })}
                            >
                                <option value="Normal">Normal</option>
                                <option value="High">High</option>
                                <option value="Urgent">Urgent</option>
                            </select>
                        </div>
                    </div>
                    <div>
                        <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>Description</label>
                        <textarea
                            rows="6" required
                            className={`w-full p-3 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 border ${darkMode ? 'bg-slate-700 border-slate-600 text-white' : 'bg-white border-slate-300'}`}
                            value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })}
                        ></textarea>
                    </div>
                    <button
                        type="submit" disabled={loading}
                        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white p-4 rounded-xl font-bold transition-colors disabled:opacity-50"
                    >
                        Publish Notice
                    </button>
                </form>
            </div>
        </div>
    );
};

export default PostNotice;
