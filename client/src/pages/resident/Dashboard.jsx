import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useSocket } from '../../context/SocketContext';
import api from "../../utils/axios";
import VisitorAlertCard from '../../components/VisitorAlertCard';
import { MdCrisisAlert, MdCheck, MdClose, MdHistory, MdPendingActions, MdHome } from 'react-icons/md';
import toast, { Toaster } from 'react-hot-toast';

const Dashboard = () => {
    const { user, darkMode } = useAuth();
    const socket = useSocket();
    const [visitorAlert, setVisitorAlert] = useState(null);
    const [pending, setPending] = useState([]);
    const [history, setHistory] = useState([]);
    const [activeTab, setActiveTab] = useState('pending');
    const [notifications, setNotifications] = useState([]);
    const [stats, setStats] = useState({ openComplaints: 0, pendingBills: 0 });
    const [notices, setNotices] = useState([]);

    useEffect(() => {
        fetchPending();
        fetchNotifications();
        fetchStats();
        fetchNotices();

        if (socket && user?.flatNo) {
            socket.emit('join_flat', user.flatNo);
            socket.emit('join_user', user.id);

            socket.on('visitor_request', (visitor) => {
                toast.success(`🔔 New Visitor: ${visitor.visitorName} at Gate`, { position: 'top-center' });
                setVisitorAlert(visitor);
                setPending(prev => {
                    const exists = prev.find(p => p._id === visitor._id);
                    if (exists) return prev;
                    return [visitor, ...prev];
                });
            });

            socket.on('new_notification', (notif) => {
                toast(notif.message, {
                    icon: notif.type === 'complaint' ? '📋' : notif.type === 'visitor' ? '🚪' : '📢',
                    position: 'top-center'
                });
                fetchNotifications();
            });

            socket.on('complaint_status_update', (data) => {
                toast.success(`Complaint "${data.title}" status: ${data.status}`, { position: 'top-center' });
                fetchNotifications();
            });

            return () => {
                socket.off('visitor_request');
                socket.off('new_notification');
                socket.off('complaint_status_update');
            };
        }
    }, [socket, user?.flatNo, user?.id]);

    useEffect(() => {
        if (activeTab === 'history') fetchHistory();
    }, [activeTab]);

    const fetchPending = async () => {
        try {
            const res = await api.get('/visitor/resident/pending');
            setPending(res.data.data || []);
        } catch (err) {
            console.error(err);
        }
    };

    const fetchHistory = async () => {
        try {
            const res = await api.get('/visitor/resident/history');
            setHistory(res.data.data || []);
        } catch (err) {
            console.error(err);
        }
    };

    const fetchNotifications = async () => {
        try {
            const res = await api.get('/notification/my');
            setNotifications(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    const fetchStats = async () => {
        try {
            const compRes = await api.get('/complaint/my');
            const billRes = await api.get('/bill/my');
            setStats({
                openComplaints: compRes.data.filter(c => c.status !== 'Resolved').length,
                pendingBills: billRes.data.filter(b => b.status === 'Unpaid').length
            });
        } catch (err) {
            console.error(err);
        }
    };

    const fetchNotices = async () => {
        try {
            const res = await api.get('/notice/all');
            setNotices(res.data.slice(0, 3));
        } catch (err) {
            console.error(err);
        }
    };

    const handleResponse = async (id, status) => {
        try {
            await api.put(`/visitor/resident/respond/${id}`, { status });
            toast.success(`Visitor ${status}`, { position: 'top-center' });
            setPending(prev => prev.filter(v => v._id !== id));
            fetchHistory();
        } catch (err) {
            toast.error('Failed to update visitor status');
            console.log(err);
        }
    };

    const handleSOS = async () => {
        if (!window.confirm('Send EMERGENCY SOS to all Guards?')) return;
        try {
            await api.post('/visitor/resident/sos');
            // RESIDENT KE LIYE 5 SEC
            toast.error('🚨 SOS Alert Sent!', { duration: 5000, position: 'top-center' });
        } catch (err) {
            toast.error('SOS Failed');
        }
    };

    const handleMarkRead = async (id) => {
        try {
            await api.put(`/notification/${id}/read`);
            fetchNotifications();
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className="space-y-6">
            <Toaster position="top-center" />

            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold">Welcome back, {user?.name}</h1>
                    <p className={`text-sm ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>Flat No: {user?.flatNo}</p>
                </div>
                <button
                    onClick={handleSOS}
                    className="bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-6 rounded-xl shadow-lg flex items-center gap-2 animate-pulse"
                >
                    <MdCrisisAlert size={24} /> SOS ALERT
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className={`p-6 rounded-2xl border ${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}`}>
                    <p className={`text-sm mb-1 ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>Open Complaints</p>
                    <p className="text-3xl font-bold">{stats.openComplaints}</p>
                </div>
                <div className={`p-6 rounded-2xl border ${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}`}>
                    <p className={`text-sm mb-1 ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>Pending Bills</p>
                    <p className="text-3xl font-bold">{stats.pendingBills}</p>
                </div>
            </div>

            <div className="flex gap-2 border-b border-slate-300 dark:border-slate-700">
                <button
                    onClick={() => setActiveTab('pending')}
                    className={`py-3 px-5 flex items-center gap-2 font-semibold ${activeTab === 'pending' ? 'border-b-2 border-indigo-600 text-indigo-600' : 'text-slate-500'}`}
                >
                    <MdPendingActions /> Pending ({pending.length})
                </button>
                <button
                    onClick={() => setActiveTab('history')}
                    className={`py-3 px-5 flex items-center gap-2 font-semibold ${activeTab === 'history' ? 'border-b-2 border-indigo-600 text-indigo-600' : 'text-slate-500'}`}
                >
                    <MdHistory /> My History
                </button>
            </div>

            {visitorAlert && (
                <VisitorAlertCard visitor={visitorAlert} onUpdate={() => setVisitorAlert(null)} />
            )}

            {activeTab === 'pending' && (
                <div className="space-y-4">
                    {pending.length === 0 ? (
                        <div className={`text-center py-10 rounded-lg ${darkMode ? 'bg-slate-800' : 'bg-white'}`}>
                            <p className="text-slate-500">No pending visitors right now ✨</p>
                        </div>
                    ) : (
                        pending.map(v => (
                            <div key={v._id} className={`p-4 rounded-lg shadow-md ${darkMode ? 'bg-slate-800' : 'bg-white'}`}>
                                <div className="flex justify-between items-start mb-3">
                                    <div>
                                        <p className="font-bold text-lg">{v.visitorName}</p>
                                        <p className="text-sm text-slate-500">Purpose: {v.purpose} | Phone: {v.phone}</p>
                                        <p className="text-xs text-slate-400">Time: {new Date(v.createdAt).toLocaleTimeString()}</p>
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => handleResponse(v._id, 'Approved')}
                                        className="flex-1 bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-lg flex items-center justify-center gap-2"
                                    >
                                        <MdCheck size={18} /> Approve
                                    </button>
                                    <button
                                        onClick={() => handleResponse(v._id, 'Denied')}
                                        className="flex-1 bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-lg flex items-center justify-center gap-2"
                                    >
                                        <MdClose size={18} /> Denied
                                    </button>
                                    <button
                                        onClick={() => handleResponse(v._id, 'Not Home')}
                                        className="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg flex items-center justify-center gap-2"
                                    >
                                        <MdHome size={18} /> Not Home
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            )}

            {activeTab === 'history' && (
                <div className="space-y-2">
                    {history.map(v => (
                        <div key={v._id} className={`p-3 rounded-lg flex justify-between items-center ${darkMode ? 'bg-slate-800' : 'bg-white'}`}>
                            <div>
                                <span className="font-semibold">{v.visitorName}</span>
                                <span className="text-sm text-slate-500 ml-2">- {v.purpose}</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <span className="text-xs text-slate-400">{new Date(v.createdAt).toLocaleDateString()}</span>
                                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${v.status === 'Approved' ? 'bg-green-100 text-green-700' :
                                        v.status === 'Denied' ? 'bg-red-100 text-red-700' :
                                            v.status === 'Not Home' ? 'bg-blue-100 text-blue-700' :
                                                'bg-yellow-100 text-yellow-700'
                                    }`}>
                                    {v.status}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
                <div>
                    <h2 className="text-xl font-bold mb-4">Notice Board</h2>
                    <div className="space-y-4">
                        {notices.map(n => (
                            <div key={n._id} className={`p-4 rounded-xl border ${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}`}>
                                <div className="flex justify-between items-start mb-2">
                                    <h3 className="font-bold">{n.title}</h3>
                                    <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase ${n.priority === 'Urgent' ? 'bg-red-100 text-red-600' : 'bg-blue-100 text-blue-600'}`}>
                                        {n.priority}
                                    </span>
                                </div>
                                <p className={`text-sm mb-3 line-clamp-2 ${darkMode ? 'text-slate-300' : 'text-slate-600'}`}>{n.description}</p>
                                <div className="flex justify-between items-center text-xs text-slate-400">
                                    <span className="capitalize">{n.type}</span>
                                    <span>{new Date(n.date).toLocaleDateString()}</span>
                                </div>
                            </div>
                        ))}
                        {notices.length === 0 && (
                            <p className={darkMode ? 'text-slate-500' : 'text-slate-400'}>No recent notices</p>
                        )}
                    </div>
                </div>

                <div>
                    <h2 className="text-xl font-bold mb-4">Recent Notifications</h2>
                <div className="space-y-4">
                    {notifications.slice(0, 5).map(n => (
                        <div key={n._id} onClick={() => handleMarkRead(n._id)} className={`p-4 rounded-xl border cursor-pointer ${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'} ${!n.read ? 'border-l-4 border-l-indigo-500' : ''}`}>
                            <div className="flex justify-between items-center">
                                <div>
                                    <span className={`text-xs uppercase font-bold mr-2 ${n.type === 'sos' ? 'text-red-500' :
                                            n.type === 'complaint' ? 'text-amber-500' :
                                                n.type === 'visitor' ? 'text-green-500' : 'text-indigo-500'
                                        }`}>{n.type}</span>
                                    <span className={darkMode ? 'text-slate-300' : 'text-slate-700'}>{n.message}</span>
                                </div>
                                <span className={`text-xs ${darkMode ? 'text-slate-500' : 'text-slate-400'}`}>{new Date(n.createdAt).toLocaleDateString()}</span>
                            </div>
                        </div>
                    ))}
                    {notifications.length === 0 && (
                        <p className={darkMode ? 'text-slate-500' : 'text-slate-400'}>No new notifications</p>
                    )}
                </div>
            </div>
            </div>
        </div>
    );
};

export default Dashboard;