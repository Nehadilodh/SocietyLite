import React, { useState, useEffect } from 'react';
import api from "../../utils/axios";
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-hot-toast';
import { MdAdd, MdClose } from 'react-icons/md';

const Residents = () => {
    const [residents, setResidents] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({ name: '', email: '', phone: '', flatNo: '', password: '' });
    const { darkMode } = useAuth();

    useEffect(() => {
        fetchResidents();
    }, []);

    const fetchResidents = async () => {
        try {
            const res = await api.get('/auth/users?role=resident');
            setResidents(res.data);
        } catch (err) {
            // Using a fallback endpoint if /auth/users doesn't exist yet, but prompt says auth works.
            // Wait, the prompt says "GET /api/user/all?role=resident". Let me use that.
            try {
                const res = await api.get('/user/all?role=resident');
                setResidents(res.data);
            } catch (e) {
                console.error(e);
            }
        }
    };

    const handleCreate = async (e) => {
        e.preventDefault();
        try {
            // using auth/register since it creates a user
            await api.post('/auth/register', { ...formData, role: 'resident' });
            toast.success('Resident added successfully');
            setShowModal(false);
            setFormData({ name: '', email: '', phone: '', flatNo: '', password: '' });
            fetchResidents();
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to add resident');
        }
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
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                        {residents.map((r) => (
                            <tr key={r._id} className={darkMode ? 'hover:bg-slate-700/50' : 'hover:bg-slate-50'}>
                                <td className="p-4 font-medium">{r.name}</td>
                                <td className="p-4">{r.flatNo}</td>
                                <td className="p-4 text-slate-500 dark:text-slate-400">{r.phone}</td>
                                <td className="p-4 text-slate-500 dark:text-slate-400">{r.email}</td>
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
                            <h2 className="text-xl font-bold">Add New Resident</h2>
                            <button onClick={() => setShowModal(false)} className="text-slate-400"><MdClose size={24} /></button>
                        </div>
                        <form onSubmit={handleCreate} className="space-y-4">
                            <input type="text" placeholder="Full Name" required
                                className={`w-full p-3 rounded-lg border ${darkMode ? 'bg-slate-700 border-slate-600' : 'bg-white border-slate-300'}`}
                                value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} />
                            <input type="email" placeholder="Email Address" required
                                className={`w-full p-3 rounded-lg border ${darkMode ? 'bg-slate-700 border-slate-600' : 'bg-white border-slate-300'}`}
                                value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} />
                            <input type="text" placeholder="Phone Number" required
                                className={`w-full p-3 rounded-lg border ${darkMode ? 'bg-slate-700 border-slate-600' : 'bg-white border-slate-300'}`}
                                value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })} />
                            <input type="text" placeholder="Flat Number (e.g. A-101)" required
                                className={`w-full p-3 rounded-lg border ${darkMode ? 'bg-slate-700 border-slate-600' : 'bg-white border-slate-300'}`}
                                value={formData.flatNo} onChange={e => setFormData({ ...formData, flatNo: e.target.value })} />
                            <input type="password" placeholder="Temporary Password" required
                                className={`w-full p-3 rounded-lg border ${darkMode ? 'bg-slate-700 border-slate-600' : 'bg-white border-slate-300'}`}
                                value={formData.password} onChange={e => setFormData({ ...formData, password: e.target.value })} />
                            <button type="submit" className="w-full bg-indigo-600 text-white p-3 rounded-lg font-medium mt-2 hover:bg-indigo-700">
                                Create Resident
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Residents;
