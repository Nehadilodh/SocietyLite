import React, { useState, useEffect } from 'react';
import api from "../../utils/axios";
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-hot-toast';
import { MdAdd, MdClose, MdEdit, MdDelete } from 'react-icons/md';

const Notices = () => {
    const [notices, setNotices] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editId, setEditId] = useState(null);
    const [formData, setFormData] = useState({ title: '', description: '', type: 'general', priority: 'Normal' });
    const { darkMode } = useAuth();
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchNotices();
    }, []);

    const fetchNotices = async () => {
        try {
            const res = await api.get('/notice/all');
            setNotices(res.data);
        } catch (e) {
            console.error(e);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            if (isEditing) {
                await api.put(`/notice/${editId}`, formData);
                toast.success('Notice updated successfully');
            } else {
                await api.post('/notice/add', formData);
                toast.success('Notice added successfully');
            }
            closeModal();
            fetchNotices();
        } catch (err) {
            toast.error(err.response?.data?.msg || 'Failed to save notice');
        }
        setLoading(false);
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this notice?')) {
            try {
                await api.delete(`/notice/${id}`);
                toast.success('Notice deleted successfully');
                fetchNotices();
            } catch (err) {
                toast.error(err.response?.data?.msg || 'Failed to delete notice');
            }
        }
    };

    const openEditModal = (notice) => {
        setFormData({ title: notice.title, description: notice.description, type: notice.type || 'general', priority: notice.priority || 'Normal' });
        setEditId(notice._id);
        setIsEditing(true);
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setIsEditing(false);
        setEditId(null);
        setFormData({ title: '', description: '', type: 'general', priority: 'Normal' });
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold">Notice Board Management</h1>
                <button
                    onClick={() => setShowModal(true)}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
                >
                    <MdAdd /> Add Notice
                </button>
            </div>

            <div className={`overflow-x-auto rounded-xl border ${darkMode ? 'border-slate-700 bg-slate-800' : 'border-slate-200 bg-white'}`}>
                <table className="w-full text-left">
                    <thead className={`border-b ${darkMode ? 'border-slate-700 bg-slate-800/50' : 'border-slate-200 bg-slate-50'}`}>
                        <tr>
                            <th className="p-4 font-medium">Title</th>
                            <th className="p-4 font-medium">Type</th>
                            <th className="p-4 font-medium">Priority</th>
                            <th className="p-4 font-medium">Date</th>
                            <th className="p-4 font-medium">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                        {notices.map((n) => (
                            <tr key={n._id} className={darkMode ? 'hover:bg-slate-700/50' : 'hover:bg-slate-50'}>
                                <td className="p-4">
                                    <div className="font-medium text-sm">{n.title}</div>
                                    <div className="text-xs text-slate-500 truncate max-w-xs">{n.description}</div>
                                </td>
                                <td className="p-4 capitalize">{n.type}</td>
                                <td className="p-4">
                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${n.priority === 'Urgent' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' : 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'}`}>
                                        {n.priority}
                                    </span>
                                </td>
                                <td className="p-4 text-slate-500 text-sm">{new Date(n.date).toLocaleDateString()}</td>
                                <td className="p-4 flex gap-2">
                                    <button onClick={() => openEditModal(n)} className="p-2 text-blue-500 hover:bg-blue-100 dark:hover:bg-blue-900/30 rounded-lg transition-colors"><MdEdit size={20} /></button>
                                    <button onClick={() => handleDelete(n._id)} className="p-2 text-red-500 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-lg transition-colors"><MdDelete size={20} /></button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className={`w-full max-w-md rounded-2xl p-6 ${darkMode ? 'bg-slate-800' : 'bg-white'}`}>
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-bold">{isEditing ? 'Edit Notice' : 'Add New Notice'}</h2>
                            <button onClick={closeModal} className="text-slate-400"><MdClose size={24} /></button>
                        </div>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>Title</label>
                                <input type="text" placeholder="Notice Title" required
                                    className={`w-full p-3 rounded-lg border ${darkMode ? 'bg-slate-700 border-slate-600 text-white' : 'bg-white border-slate-300'}`}
                                    value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} />
                            </div>
                            
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>Type</label>
                                    <select 
                                        className={`w-full p-3 rounded-lg border ${darkMode ? 'bg-slate-700 border-slate-600 text-white' : 'bg-white border-slate-300'}`}
                                        value={formData.type} onChange={e => setFormData({ ...formData, type: e.target.value })} required>
                                        <option value="general">General</option>
                                        <option value="meeting">Meeting</option>
                                        <option value="rule">Rule</option>
                                        <option value="event">Event</option>
                                    </select>
                                </div>
                                <div>
                                    <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>Priority</label>
                                    <select 
                                        className={`w-full p-3 rounded-lg border ${darkMode ? 'bg-slate-700 border-slate-600 text-white' : 'bg-white border-slate-300'}`}
                                        value={formData.priority} onChange={e => setFormData({ ...formData, priority: e.target.value })} required>
                                        <option value="Normal">Normal</option>
                                        <option value="Urgent">Urgent</option>
                                    </select>
                                </div>
                            </div>
                            
                            <div>
                                <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>Description</label>
                                <textarea rows="4" placeholder="Description..." required
                                    className={`w-full p-3 rounded-lg border ${darkMode ? 'bg-slate-700 border-slate-600 text-white' : 'bg-white border-slate-300'}`}
                                    value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })}></textarea>
                            </div>
                            
                            <button type="submit" disabled={loading} className="w-full bg-indigo-600 text-white p-3 rounded-lg font-medium mt-2 hover:bg-indigo-700 disabled:opacity-50">
                                {isEditing ? 'Update Notice' : 'Publish Notice'}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Notices;
