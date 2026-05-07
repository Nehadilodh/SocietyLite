import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { MdDashboard, MdPeople, MdSecurity, MdReceipt, MdChat, MdCampaign, MdHelp, MdHistory, MdPersonAdd } from 'react-icons/md';

const Sidebar = () => {
    const { user, darkMode } = useAuth();
    const role = user?.role || 'resident';

    const getLinks = () => {
        if (role === 'admin') {
            return [
                { path: '/admin/dashboard', name: 'Dashboard', icon: <MdDashboard /> },
                { path: '/admin/residents', name: 'Residents', icon: <MdPeople /> },
                { path: '/admin/visitors', name: 'Visitors', icon: <MdSecurity /> },
                { path: '/admin/bills', name: 'Bills', icon: <MdReceipt /> },
                { path: '/admin/complaints', name: 'Complaints', icon: <MdChat /> },
                { path: '/admin/notice', name: 'Post Notice', icon: <MdCampaign /> },
                { path: '/admin/inquiries', name: 'Inquiries', icon: <MdHelp /> },
            ];
        } else if (role === 'guard') {
            return [
                { path: '/guard', name: 'Dashboard', icon: <MdDashboard /> },
                { path: '/guard/entry', name: 'New Entry', icon: <MdPersonAdd /> },
                { path: '/guard/log', name: 'Today\'s Log', icon: <MdHistory /> },
                { path: '/guard/history', name: 'History', icon: <MdSecurity /> },
            ];
        } else {
            return [
                { path: '/resident/dashboard', name: 'Dashboard', icon: <MdDashboard /> },
                { path: '/resident/profile', name: 'My Profile', icon: <MdPeople /> },
                { path: '/resident/bills', name: 'My Bills', icon: <MdReceipt /> },
                { path: '/resident/complaints', name: 'Complaints', icon: <MdChat /> },
                { path: '/resident/notice', name: 'Notice Board', icon: <MdCampaign /> },
            ];
        }
    };

    return (
        <aside className={`w-64 flex-shrink-0 hidden md:block border-r ${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}`}>
            <div className="p-6">
                <div className="font-heading font-black text-2xl text-indigo-600 dark:text-indigo-400 mb-8 tracking-tight">SocietyLite</div>
                <nav className="space-y-2">
                    {getLinks().map(link => (
                        <NavLink
                            key={link.path}
                            to={link.path}
                            end
                            className={({ isActive }) => `flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all ${isActive
                                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-200 dark:shadow-none'
                                    : `hover:bg-slate-100 dark:hover:bg-slate-700 ${darkMode ? 'text-slate-300' : 'text-slate-600'}`
                                }`}
                        >
                            <span className="text-xl">{link.icon}</span>
                            {link.name}
                        </NavLink>
                    ))}
                </nav>
            </div>
        </aside>
    );
};

export default Sidebar;
