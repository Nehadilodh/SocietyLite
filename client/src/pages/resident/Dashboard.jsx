import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useSocket } from '../../context/SocketContext';
import api from "../../utils/axios";
import VisitorAlertCard from '../../components/VisitorAlertCard';
import SOSButton from '../../components/SOSButton';

const Dashboard = () => {
    const { user, darkMode } = useAuth();
    const socket = useSocket();
    const [visitorAlert, setVisitorAlert] = useState(null);
    const [notifications, setNotifications] = useState([]);
    const [stats, setStats] = useState({ openComplaints: 0, pendingBills: 0 });

    useEffect(() => {
        fetchNotifications();
        fetchStats();

        if (socket) {
            socket.on('visitor_request', (visitor) => {
                setVisitorAlert(visitor);
            });
            socket.on('new_notification', () => {
                fetchNotifications();
            });
            socket.on('new_sos_alert', () => {
                fetchNotifications();
            });
            return () => {
                socket.off('visitor_request');
                socket.off('new_notification');
                socket.off('new_sos_alert');
            };
        }
    }, [socket]);

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

    const handleVisitorUpdate = (id, status) => {
        setVisitorAlert(null);
    };

    const handleMarkRead = async (id) => {
        try {
            await api.put(`/notification/${id}/read`);
            fetchNotifications();
        } catch (err) {
            console.error(err);
        }
    }

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold">Welcome back, {user?.name}</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className={`p-6 rounded-2xl border ${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}`}>
                    <p className={`text-sm mb-1 ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>Open Complaints</p>
                    <p className="text-3xl font-bold">{stats.openComplaints}</p>
                </div>
                <div className={`p-6 rounded-2xl border ${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}`}>
                    <p className={`text-sm mb-1 ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>Pending Bills</p>
                    <p className="text-3xl font-bold">{stats.pendingBills}</p>
                </div>
            </div>

            {visitorAlert && (
                <VisitorAlertCard visitor={visitorAlert} onUpdate={handleVisitorUpdate} />
            )}

            <div>
                <h2 className="text-xl font-bold mb-4">Recent Notifications</h2>
                <div className="space-y-4">
                    {notifications.slice(0, 5).map(n => (
                        <div key={n._id} onClick={() => handleMarkRead(n._id)} className={`p-4 rounded-xl border cursor-pointer ${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'} ${!n.read ? 'border-l-4 border-l-indigo-500' : ''}`}>
                            <div className="flex justify-between items-center">
                                <div>
                                    <span className={`text-xs uppercase font-bold mr-2 ${n.type === 'sos' ? 'text-red-500' : 'text-indigo-500'}`}>{n.type}</span>
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

            <SOSButton />
        </div>
    );
};

export default Dashboard;
