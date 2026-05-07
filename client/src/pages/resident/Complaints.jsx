import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from "../../utils/axios";
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-hot-toast';
import { MdClose } from 'react-icons/md';

const Complaints = () => {
    const [complaints, setComplaints] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [editComplaint, setEditComplaint] = useState(null);
    const [formData, setFormData] = useState({ title: '', description: '', category: 'Plumbing' });
    const { darkMode } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        fetchComplaints();
    }, []);

    const fetchComplaints = async () => {
        try {
            const res = await api.get('/complaint/my');
            setComplaints(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    const handleCreate = async (e) => {
        e.preventDefault();
        try {
            await api.post('/complaint', formData);
            toast.success('Complaint raised successfully');
            setShowModal(false);
            setFormData({ title: '', description: '', category: 'Plumbing' });
            fetchComplaints();
        } catch (err) {
            toast.error('Failed to raise complaint');
        }
    };

    const handleEdit = async (e) => {
        e.preventDefault();
        try {
            await api.put(`/complaint/${editComplaint._id}`, formData);
            toast.success('Complaint updated');
            setEditComplaint(null);
            fetchComplaints();
        } catch (err) {
            toast.error('Failed to update complaint');
        }
    };

    const handleDelete = async (e, id) => {
        e.stopPropagation();
        if (!window.confirm('Are you sure you want to delete this complaint?')) return;
        try {
            await api.delete(`/complaint/${id}`);
            toast.success('Complaint deleted');
            fetchComplaints();
        } catch (err) {
            toast.error('Failed to delete');
        }
    };

    const openEditModal = (e, c) => {
        e.stopPropagation();
        setEditComplaint(c);
        setFormData({ title: c.title, description: c.description, category: c.category });
    };

    return (
        <div className="space-y-6 max-w-5xl mx-auto">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold">My Complaints</h1>
                <button
                    onClick={() => { setEditComplaint(null); setFormData({ title: '', description: '', category: 'Plumbing' }); setShowModal(true); }}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg transition-colors"
                >
                    Raise Complaint
                </button>
            </div>

            <div className={`overflow-x-auto rounded-xl border ${darkMode ? 'border-slate-700 bg-slate-800' : 'border-slate-200 bg-white'}`}>
                <table className="w-full text-left">
                    <thead className={`border-b ${darkMode ? 'border-slate-700 bg-slate-800/50' : 'border-slate-200 bg-slate-50'}`}>
                        <tr>
                            <th className="p-4 font-medium">Title</th>
                            <th className="p-4 font-medium">Category</th>
                            <th className="p-4 font-medium">Status</th>
                            <th className="p-4 font-medium">Date</th>
                            <th className="p-4 font-medium text-center">Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                        {complaints.map((c) => (
                            <tr key={c._id} className={`${darkMode ? 'hover:bg-slate-700/50' : 'hover:bg-slate-50'} cursor-pointer`} onClick={() => navigate(`/resident/complaints/${c._id}`)}>
                                <td className="p-4 font-medium">{c.title}</td>
                                <td className="p-4 text-slate-500 dark:text-slate-400">{c.category}</td>
                                <td className="p-4">
                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${c.status === 'Resolved' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' :
                                        c.status === 'In Progress' ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400' :
                                            'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                                        }`}>
                                        {c.status}
                                    </span>
                                </td>
                                <td className="p-4 text-slate-500 dark:text-slate-400">{new Date(c.createdAt).toLocaleDateString()}</td>
                                <td className="p-4">
                                    <div className="flex gap-3 justify-center">
                                        {c.status === 'Open' ? (
                                            <>
                                                <button onClick={(e) => openEditModal(e, c)} className="text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300 text-sm font-medium">Edit</button>
                                                <button onClick={(e) => handleDelete(e, c._id)} className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 text-sm font-medium">Delete</button>
                                            </>
                                        ) : (
                                            <span className="text-xs text-slate-400">Locked</span>
                                        )}
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Modal for Create/Edit */}
            {(showModal || editComplaint) && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => { setShowModal(false); setEditComplaint(null); }}>
                    <div className={`w-full max-w-md rounded-2xl p-6 ${darkMode ? 'bg-slate-800' : 'bg-white'}`} onClick={e => e.stopPropagation()}>
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-bold">{editComplaint ? 'Edit Complaint' : 'Raise Complaint'}</h2>
                            <button onClick={() => { setShowModal(false); setEditComplaint(null); }} className="text-slate-400"><MdClose size={24} /></button>
                        </div>
                        <form onSubmit={editComplaint ? handleEdit : handleCreate} className="space-y-4">
                            <input type="text" placeholder="Title" required
                                className={`w-full p-3 rounded-lg border outline-none focus:ring-2 focus:ring-indigo-500 ${darkMode ? 'bg-slate-700 border-slate-600 text-white' : 'bg-white border-slate-300'}`}
                                value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} />
                            <select
                                className={`w-full p-3 rounded-lg border outline-none focus:ring-2 focus:ring-indigo-500 ${darkMode ? 'bg-slate-700 border-slate-600 text-white' : 'bg-white border-slate-300'}`}
                                value={formData.category} onChange={e => setFormData({ ...formData, category: e.target.value })}
                            >
                                <option>Plumbing</option>
                                <option>Electrical</option>
                                <option>Cleaning</option>
                                <option>Security</option>
                                <option>Other</option>
                            </select>
                            <textarea placeholder="Description" required rows="4"
                                className={`w-full p-3 rounded-lg border outline-none focus:ring-2 focus:ring-indigo-500 ${darkMode ? 'bg-slate-700 border-slate-600 text-white' : 'bg-white border-slate-300'}`}
                                value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} />
                            <button type="submit" className="w-full bg-indigo-600 text-white p-3 rounded-lg font-medium hover:bg-indigo-700 transition-colors">
                                {editComplaint ? 'Save Changes' : 'Submit'}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Complaints;
