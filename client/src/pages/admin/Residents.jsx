import React, { useState, useEffect } from 'react';
import api from "../../utils/axios";
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-hot-toast';
import { MdAdd, MdClose, MdEdit, MdDelete } from 'react-icons/md';

const Residents = () => {
    const [residents, setResidents] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editId, setEditId] = useState(null);
    const [formData, setFormData] = useState({ name: '', email: '', phone: '', flatNo: '', password: '' });
    const { darkMode } = useAuth();

    useEffect(() => {
        fetchResidents();
    }, []);

    const fetchResidents = async () => {
        try {
            const res = await api.get('/user/all');
            setResidents(res.data);
        } catch (e) {
            console.error(e);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (isEditing) {
                await api.put(`/user/${editId}`, formData);
                toast.success('Resident updated successfully');
            } else {
                await api.post('/user/add', formData);
                toast.success('Resident added successfully');
            }
            closeModal();
            fetchResidents();
        } catch (err) {
            toast.error(err.response?.data?.msg || 'Failed to save resident');
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this resident?')) {
            try {
                await api.delete(`/user/${id}`);
                toast.success('Resident deleted successfully');
                fetchResidents();
            } catch (err) {
                toast.error(err.response?.data?.msg || 'Failed to delete resident');
            }
        }
    };

    const openEditModal = (resident) => {
        setFormData({ name: resident.name, email: resident.email, phone: resident.phone || '', flatNo: resident.flatNo || '', password: '' });
        setEditId(resident._id);
        setIsEditing(true);
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setIsEditing(false);
        setEditId(null);
        setFormData({ name: '', email: '', phone: '', flatNo: '', password: '' });
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold">Residents Directory</h1>
                <button
                    onClick={() => setShowModal(true)}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
                >
                    <MdAdd /> Add Resident
                </button>
            </div>

            <div className={`overflow-x-auto rounded-xl border ${darkMode ? 'border-slate-700 bg-slate-800' : 'border-slate-200 bg-white'}`}>
                <table className="w-full text-left">
                    <thead className={`border-b ${darkMode ? 'border-slate-700 bg-slate-800/50' : 'border-slate-200 bg-slate-50'}`}>
                        <tr>
                            <th className="p-4 font-medium">Name</th>
                            <th className="p-4 font-medium">Flat No</th>
                            <th className="p-4 font-medium">Phone</th>
                            <th className="p-4 font-medium">Email</th>
                            <th className="p-4 font-medium">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                        {residents.map((r) => (
                            <tr key={r._id} className={darkMode ? 'hover:bg-slate-700/50' : 'hover:bg-slate-50'}>
                                <td className="p-4 font-medium">{r.name}</td>
                                <td className="p-4">{r.flatNo}</td>
                                <td className="p-4 text-slate-500 dark:text-slate-400">{r.phone}</td>
                                <td className="p-4 text-slate-500 dark:text-slate-400">{r.email}</td>
                                <td className="p-4 flex gap-2">
                                    <button onClick={() => openEditModal(r)} className="p-2 text-blue-500 hover:bg-blue-100 dark:hover:bg-blue-900/30 rounded-lg transition-colors"><MdEdit size={20} /></button>
                                    <button onClick={() => handleDelete(r._id)} className="p-2 text-red-500 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-lg transition-colors"><MdDelete size={20} /></button>
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
                            <h2 className="text-xl font-bold">{isEditing ? 'Edit Resident' : 'Add New Resident'}</h2>
                            <button onClick={closeModal} className="text-slate-400"><MdClose size={24} /></button>
                        </div>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <input type="text" placeholder="Full Name" required
                                className={`w-full p-3 rounded-lg border ${darkMode ? 'bg-slate-700 border-slate-600' : 'bg-white border-slate-300'}`}
                                value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} />
                            <div>
                                <input type="email" placeholder="Email Address" required
                                    className={`w-full p-3 rounded-lg border ${darkMode ? 'bg-slate-700 border-slate-600' : 'bg-white border-slate-300'}`}
                                    value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} />
                                {formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email) && <p className="text-red-500 text-xs mt-1">Invalid email format</p>}
                            </div>
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
                            <input type="text" placeholder="Flat Number (e.g. A-101)" required
                                className={`w-full p-3 rounded-lg border ${darkMode ? 'bg-slate-700 border-slate-600' : 'bg-white border-slate-300'}`}
                                value={formData.flatNo} onChange={e => setFormData({ ...formData, flatNo: e.target.value })} />
                            <input type="password" placeholder={isEditing ? "New Password (leave blank to keep current)" : "Temporary Password"} required={!isEditing}
                                className={`w-full p-3 rounded-lg border ${darkMode ? 'bg-slate-700 border-slate-600' : 'bg-white border-slate-300'}`}
                                value={formData.password} onChange={e => setFormData({ ...formData, password: e.target.value })} />
                            <button type="submit" className="w-full bg-indigo-600 text-white p-3 rounded-lg font-medium mt-2 hover:bg-indigo-700">
                                {isEditing ? 'Update Resident' : 'Create Resident'}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Residents;
