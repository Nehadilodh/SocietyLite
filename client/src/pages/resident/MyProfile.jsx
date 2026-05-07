import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { MdPerson } from 'react-icons/md';

const MyProfile = () => {
    const { user, darkMode } = useAuth();

    if (!user) return null;

    return (
        <div className="max-w-2xl mx-auto">
            <h1 className="text-2xl font-bold mb-6">My Profile</h1>

            <div className={`p-8 rounded-3xl border flex flex-col items-center text-center ${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'} shadow-sm`}>
                <div className="w-24 h-24 rounded-full bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 flex items-center justify-center text-4xl mb-6 shadow-inner">
                    <MdPerson />
                </div>

                <h2 className="text-3xl font-bold mb-2">{user.name}</h2>
                <p className={`text-lg mb-8 ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>Resident, Flat {user.flatNo}</p>

                <div className="w-full space-y-4 text-left">
                    <div className={`p-4 rounded-xl flex justify-between items-center ${darkMode ? 'bg-slate-700/50' : 'bg-slate-50'}`}>
                        <span className={`text-sm font-medium ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>Email Address</span>
                        <span className="font-semibold">{user.email}</span>
                    </div>
                    <div className={`p-4 rounded-xl flex justify-between items-center ${darkMode ? 'bg-slate-700/50' : 'bg-slate-50'}`}>
                        <span className={`text-sm font-medium ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>Phone Number</span>
                        <span className="font-semibold">{user.phone}</span>
                    </div>
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
