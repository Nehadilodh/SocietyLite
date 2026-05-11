import React, { useState, useEffect } from 'react';
import api from "../../utils/axios";
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-hot-toast';
import { MdAdd, MdClose, MdEdit, MdDelete } from 'react-icons/md';

const Guards = () => {
    const [guards, setGuards] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editId, setEditId] = useState(null);
    const [formData, setFormData] = useState({ name: '', phone: '', shift: 'Morning', dutyArea: '', joiningDate: '' });
    const { darkMode } = useAuth();

    useEffect(() => {
        fetchGuards();
    }, []);

    const fetchGuards = async () => {
        try {
            const res = await api.get('/guard/all');
            setGuards(res.data);
        } catch (e) {
            console.error(e);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (isEditing) {
                await api.put(`/guard/${editId}`, formData);
                toast.success('Guard updated successfully');
            } else {
                await api.post('/guard/add', formData);
                toast.success('Guard added successfully');
            }
            closeModal();
            fetchGuards();
        } catch (err) {
            toast.error(err.response?.data?.msg || 'Failed to save guard');
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this guard?')) {
            try {
                await api.delete(`/guard/${id}`);
                toast.success('Guard deleted successfully');
                fetchGuards();
            } catch (err) {
                toast.error(err.response?.data?.msg || 'Failed to delete guard');
            }
        }
    };

    const openEditModal = (guard) => {
        const dateStr = new Date(guard.joiningDate).toISOString().split('T')[0];
        setFormData({ name: guard.name, phone: guard.phone, shift: guard.shift, dutyArea: guard.dutyArea, joiningDate: dateStr });
        setEditId(guard._id);
        setIsEditing(true);
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setIsEditing(false);
        setEditId(null);
        setFormData({ name: '', phone: '', shift: 'Morning', dutyArea: '', joiningDate: '' });
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold">Guards Directory</h1>
                <button
                    onClick={() => setShowModal(true)}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
                >
                    <MdAdd /> Add Guard
                </button>
            </div>

            <div className={`overflow-x-auto rounded-xl border ${darkMode ? 'border-slate-700 bg-slate-800' : 'border-slate-200 bg-white'}`}>
                <table className="w-full text-left">
                    <thead className={`border-b ${darkMode ? 'border-slate-700 bg-slate-800/50' : 'border-slate-200 bg-slate-50'}`}>
                        <tr>
                            <th className="p-4 font-medium">Name</th>
                            <th className="p-4 font-medium">Phone</th>
                            <th className="p-4 font-medium">Shift</th>
                            <th className="p-4 font-medium">Duty Area</th>
                            <th className="p-4 font-medium">Joining Date</th>
                            <th className="p-4 font-medium">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                        {guards.map((g) => (
                            <tr key={g._id} className={darkMode ? 'hover:bg-slate-700/50' : 'hover:bg-slate-50'}>
                                <td className="p-4 font-medium">{g.name}</td>
                                <td className="p-4 text-slate-500 dark:text-slate-400">{g.phone}</td>
                                <td className="p-4">
                                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${g.shift === 'Morning' ? 'bg-amber-100 text-amber-800' : g.shift === 'Evening' ? 'bg-indigo-100 text-indigo-800' : 'bg-slate-800 text-slate-200'}`}>
                                        {g.shift}
                                    </span>
                                </td>
                                <td className="p-4">{g.dutyArea}</td>
                                <td className="p-4">{new Date(g.joiningDate).toLocaleDateString()}</td>
                                <td className="p-4 flex gap-2">
                                    <button onClick={() => openEditModal(g)} className="p-2 text-blue-500 hover:bg-blue-100 dark:hover:bg-blue-900/30 rounded-lg transition-colors"><MdEdit size={20} /></button>
                                    <button onClick={() => handleDelete(g._id)} className="p-2 text-red-500 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-lg transition-colors"><MdDelete size={20} /></button>
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
                            <h2 className="text-xl font-bold">{isEditing ? 'Edit Guard' : 'Add New Guard'}</h2>
                            <button onClick={closeModal} className="text-slate-400"><MdClose size={24} /></button>
                        </div>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <input type="text" placeholder="Full Name" required
                                className={`w-full p-3 rounded-lg border ${darkMode ? 'bg-slate-700 border-slate-600' : 'bg-white border-slate-300'}`}
                                value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} />
                            <div>
                                <div className="relative">
                                    <div className={`absolute left-0 top-0 bottom-0 flex items-center px-3 rounded-l-lg border-r ${darkMode ? 'bg-slate-600 border-slate-500 text-slate-200' : 'bg-slate-100 border-slate-300 text-slate-600'}`}>
                                        +91
                                    </div>
                                    <input type="text" placeholder="Phone Number" required maxLength={10}
                                        className={`w-full p-3 pl-14 rounded-lg border ${darkMode ? 'bg-slate-700 border-slate-600' : 'bg-white border-slate-300'}`}
                                        value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value.replace(/\D/g, '') })} />
                                </div>
                                {formData.phone && formData.phone.length > 0 && formData.phone.length !== 10 && <p className="text-red-500 text-xs mt-1">Phone must be 10 digits</p>}
                            </div>
                            <select 
                                className={`w-full p-3 rounded-lg border ${darkMode ? 'bg-slate-700 border-slate-600' : 'bg-white border-slate-300'}`}
                                value={formData.shift} onChange={e => setFormData({ ...formData, shift: e.target.value })} required>
                                <option value="Morning">Morning</option>
                                <option value="Evening">Evening</option>
                                <option value="Night">Night</option>
                            </select>
                            <input type="text" placeholder="Duty Area" required
                                className={`w-full p-3 rounded-lg border ${darkMode ? 'bg-slate-700 border-slate-600' : 'bg-white border-slate-300'}`}
                                value={formData.dutyArea} onChange={e => setFormData({ ...formData, dutyArea: e.target.value })} />
                            <input type="date" required
                                className={`w-full p-3 rounded-lg border ${darkMode ? 'bg-slate-700 border-slate-600' : 'bg-white border-slate-300'}`}
                                value={formData.joiningDate} onChange={e => setFormData({ ...formData, joiningDate: e.target.value })} />
                            <button type="submit" className="w-full bg-indigo-600 text-white p-3 rounded-lg font-medium mt-2 hover:bg-indigo-700">
                                {isEditing ? 'Update Guard' : 'Create Guard'}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Guards;
