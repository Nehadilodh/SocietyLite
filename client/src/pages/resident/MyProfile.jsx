import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { MdPerson } from 'react-icons/md';
import { FiEdit2, FiCheck, FiX } from 'react-icons/fi';
import api from '../../utils/axios';
import toast from 'react-hot-toast';

const MyProfile = () => {
    const { user, darkMode, login, token } = useAuth();
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        name: user?.name || '',
        phone: user?.phone || '',
        password: ''
    });

    if (!user) return null;

    const handleSave = async () => {
        try {
            const res = await api.put('/user/profile', formData, {
                headers: { Authorization: `Bearer ${token}` }
            });
            login(res.data.user, token);
            toast.success('Profile updated successfully');
            setIsEditing(false);
        } catch (err) {
            toast.error(err.response?.data?.msg || err.response?.data?.message || 'Failed to update profile');
        }
    };

    return (
        <div className="max-w-2xl mx-auto relative">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold tracking-tight">My Profile</h1>
                {!isEditing ? (
                    <button onClick={() => setIsEditing(true)} className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl font-medium shadow-md shadow-indigo-200 dark:shadow-none transition-all hover:scale-105 active:scale-95">
                        <FiEdit2 /> Edit Profile
                    </button>
                ) : (
                    <div className="flex gap-3">
                        <button onClick={() => setIsEditing(false)} className="flex items-center gap-2 bg-slate-500 hover:bg-slate-600 text-white px-5 py-2.5 rounded-xl font-medium transition-all hover:scale-105 active:scale-95">
                            <FiX /> Cancel
                        </button>
                        <button onClick={handleSave} className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-5 py-2.5 rounded-xl font-medium shadow-md shadow-green-200 dark:shadow-none transition-all hover:scale-105 active:scale-95">
                            <FiCheck /> Save
                        </button>
                    </div>
                )}
            </div>

            <div className={`p-8 rounded-3xl border flex flex-col items-center text-center ${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'} shadow-xl`}>
                <div className="w-28 h-28 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 text-white flex items-center justify-center text-5xl mb-6 shadow-lg shadow-indigo-200 dark:shadow-none ring-4 ring-indigo-50 dark:ring-slate-700 transition-all hover:scale-105">
                    <MdPerson />
                </div>

                {!isEditing ? (
                    <>
                        <h2 className="text-3xl font-extrabold tracking-tight mb-2">{user.name}</h2>
                        <p className={`text-lg mb-8 font-medium ${darkMode ? 'text-indigo-400' : 'text-indigo-600'}`}>Resident, Flat {user.flatNo}</p>
                    </>
                ) : (
                    <div className="w-full max-w-sm mb-8 relative group">
                        <input type="text" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })}
                            className={`w-full text-center text-2xl font-bold p-3 mb-2 rounded-xl border-2 focus:ring-4 focus:outline-none transition-all duration-300 ${darkMode ? 'bg-slate-900/50 border-slate-600 focus:border-indigo-500 focus:ring-indigo-500/20 text-white' : 'bg-slate-50 border-slate-200 focus:border-indigo-500 focus:ring-indigo-500/20 text-slate-900'}`} placeholder="Full Name" />
                        <p className={`text-lg font-medium ${darkMode ? 'text-indigo-400' : 'text-indigo-600'}`}>Resident, Flat {user.flatNo}</p>
                    </div>
                )}

                <div className="w-full space-y-4 text-left">
                    <div className={`p-5 rounded-2xl flex justify-between items-center transition-all duration-300 hover:shadow-md ${darkMode ? 'bg-slate-700/30 hover:bg-slate-700/50' : 'bg-slate-50 hover:bg-white border border-transparent hover:border-slate-100'}`}>
                        <span className={`text-sm font-semibold uppercase tracking-wider ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>Email Address</span>
                        <span className="font-semibold text-lg">{user.email}</span>
                    </div>
                    <div className={`p-5 rounded-2xl flex justify-between items-center transition-all duration-300 hover:shadow-md ${darkMode ? 'bg-slate-700/30 hover:bg-slate-700/50' : 'bg-slate-50 hover:bg-white border border-transparent hover:border-slate-100'}`}>
                        <span className={`text-sm font-semibold uppercase tracking-wider ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>Phone Number</span>
                        {!isEditing ? (
                            <span className="font-semibold text-lg">{user.phone}</span>
                        ) : (
                            <input type="text" value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value.replace(/\D/g, '') })} maxLength={10}
                                className={`text-right font-semibold text-lg p-2 px-4 rounded-xl border-2 focus:ring-4 focus:outline-none transition-all duration-300 ${darkMode ? 'bg-slate-900/50 border-slate-600 focus:border-indigo-500 focus:ring-indigo-500/20 text-white' : 'bg-white border-slate-200 focus:border-indigo-500 focus:ring-indigo-500/20 text-slate-900'}`} placeholder="Phone Number" />
                        )}
                    </div>
                    {isEditing && (
                        <div className={`p-5 rounded-2xl flex justify-between items-center transition-all duration-300 hover:shadow-md ${darkMode ? 'bg-slate-700/30 hover:bg-slate-700/50' : 'bg-slate-50 hover:bg-white border border-transparent hover:border-slate-100'}`}>
                            <span className={`text-sm font-semibold uppercase tracking-wider ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>New Password</span>
                            <input type="password" value={formData.password} onChange={e => setFormData({ ...formData, password: e.target.value })}
                                className={`text-right text-lg p-2 px-4 rounded-xl border-2 focus:ring-4 focus:outline-none transition-all duration-300 ${darkMode ? 'bg-slate-900/50 border-slate-600 focus:border-indigo-500 focus:ring-indigo-500/20 text-white' : 'bg-white border-slate-200 focus:border-indigo-500 focus:ring-indigo-500/20 text-slate-900'}`} placeholder="Leave blank to keep" />
                        </div>
                    )}
                    <div className={`p-4 rounded-xl flex justify-between items-center ${darkMode ? 'bg-slate-700/50' : 'bg-slate-50'}`}>
                        <span className={`text-sm font-medium ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>Role</span>
                        <span className="font-semibold capitalize">{user.role}</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MyProfile;
