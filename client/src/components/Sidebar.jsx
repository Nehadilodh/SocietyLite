import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { MdDashboard, MdPeople, MdSecurity, MdReceipt, MdChat, MdCampaign, MdHelp, MdHistory, MdPersonAdd } from 'react-icons/md';
import { FiMenu, FiChevronLeft } from 'react-icons/fi';

const Sidebar = () => {
    const { user, darkMode } = useAuth();
    const role = user?.role || 'resident';
    const [isExpanded, setIsExpanded] = useState(true);

    const getLinks = () => {
        if (role === 'admin') {
            return [
                { path: '/admin/dashboard', name: 'Dashboard', icon: <MdDashboard /> },
                { path: '/admin/residents', name: 'Residents', icon: <MdPeople /> },
                { path: '/admin/guards', name: 'Guards', icon: <MdSecurity /> },
                { path: '/admin/visitors', name: 'Visitors', icon: <MdHistory /> },
                { path: '/admin/bills', name: 'Bills', icon: <MdReceipt /> },
                { path: '/admin/complaints', name: 'Complaints', icon: <MdChat /> },
                { path: '/admin/notices', name: 'Notices', icon: <MdCampaign /> },
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
        <aside className={`${isExpanded ? 'w-64' : 'w-20'} transition-all duration-300 flex-shrink-0 hidden md:flex flex-col border-r ${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}`}>
            <div className="p-4 flex items-center justify-between">
                {isExpanded && <div className="font-heading font-black text-2xl text-indigo-600 dark:text-indigo-400 tracking-tight whitespace-nowrap">SocietyLite</div>}
                <button onClick={() => setIsExpanded(!isExpanded)} className={`p-2 rounded-lg ${!isExpanded ? 'mx-auto' : ''} ${darkMode ? 'hover:bg-slate-700 text-slate-300' : 'hover:bg-slate-100 text-slate-600'}`}>
                    {isExpanded ? <FiChevronLeft size={24} /> : <FiMenu size={24} />}
                </button>
            </div>
            <div className="flex-1 overflow-y-auto overflow-x-hidden p-4">
                <nav className="space-y-2">
                    {getLinks().map(link => (
                        <NavLink
                            key={link.path}
                            to={link.path}
                            end
                            title={!isExpanded ? link.name : ""}
                            className={({ isActive }) => `flex items-center gap-3 px-3 py-3 rounded-xl font-medium transition-all ${isActive
                                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-200 dark:shadow-none'
                                    : `hover:bg-slate-100 dark:hover:bg-slate-700 ${darkMode ? 'text-slate-300' : 'text-slate-600'}`
                                } ${!isExpanded ? 'justify-center' : ''}`}
                        >
                            <span className="text-xl flex-shrink-0">{link.icon}</span>
                            {isExpanded && <span className="whitespace-nowrap">{link.name}</span>}
                        </NavLink>
                    ))}
                </nav>
            </div>
        </aside>
    );
};

export default Sidebar;
