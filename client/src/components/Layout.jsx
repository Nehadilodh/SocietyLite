import React from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Sidebar from './Sidebar';
import { MdLightMode, MdDarkMode, MdLogout } from 'react-icons/md';

const Layout = () => {
    const { darkMode, toggleDark, logout, user } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <div className={`min-h-screen flex ${darkMode ? 'dark bg-slate-900 text-white' : 'bg-slate-50 text-slate-800'}`}>
            <Sidebar />
            <div className="flex-1 flex flex-col min-w-0">
                <header className={`h-16 flex items-center justify-between px-6 border-b ${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'} sticky top-0 z-30`}>
                    <div className="font-bold text-xl text-indigo-600 dark:text-indigo-400 hidden md:block">SocietyLite</div>
                    <div className="flex items-center gap-4 ml-auto">
                        <span className="font-medium hidden sm:block">{user?.name}</span>
                        <button onClick={toggleDark} className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
                            {darkMode ? <MdLightMode size={24} className="text-yellow-400" /> : <MdDarkMode size={24} className="text-slate-600" />}
                        </button>
                        <button onClick={handleLogout} className="flex items-center gap-2 p-2 rounded-lg hover:bg-red-50 text-red-600 dark:hover:bg-red-900/30 transition-colors">
                            <MdLogout size={24} />
                            <span className="hidden sm:inline font-medium">Logout</span>
                        </button>
                    </div>
                </header>
                <main className="flex-1 p-4 md:p-8 overflow-auto">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default Layout;
