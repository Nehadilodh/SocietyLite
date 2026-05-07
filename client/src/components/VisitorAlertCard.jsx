import React from 'react';
import api from '../utils/axios';
import { toast } from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';

const VisitorAlertCard = ({ visitor, onUpdate }) => {
    const { darkMode } = useAuth();
    
    if (!visitor) return null;

    const handleAction = async (status) => {
        try {
            await api.put(`/visitor/${visitor._id}/status`, { status });
            toast.success(`Visitor ${status}`);
            if (onUpdate) onUpdate(visitor._id, status);
        } catch (err) {
            toast.error('Failed to update visitor status');
        }
    };

    return (
        <div className={`p-6 rounded-2xl border-2 border-indigo-500 shadow-xl mb-6 flex flex-col md:flex-row justify-between items-center gap-4 ${darkMode ? 'bg-slate-800' : 'bg-white'}`}>
            <div>
                <h3 className="text-xl font-bold text-indigo-600 dark:text-indigo-400 mb-1">Visitor at the Gate!</h3>
                <p className={`text-lg font-medium ${darkMode ? 'text-white' : 'text-slate-800'}`}>Name: {visitor.visitorName}</p>
                <p className={`text-sm ${darkMode ? 'text-slate-300' : 'text-slate-600'}`}>Phone: {visitor.phone} | Purpose: {visitor.purpose}</p>
            </div>
            <div className="flex gap-3 w-full md:w-auto">
                <button onClick={() => handleAction('Approved')} className="flex-1 md:flex-none bg-green-600 hover:bg-green-700 text-white px-6 py-2.5 rounded-xl font-medium transition-colors">Approve</button>
                <button onClick={() => handleAction('Denied')} className="flex-1 md:flex-none bg-red-600 hover:bg-red-700 text-white px-6 py-2.5 rounded-xl font-medium transition-colors">Deny</button>
                <button onClick={() => handleAction('NotHome')} className="flex-1 md:flex-none bg-slate-600 hover:bg-slate-700 text-white px-6 py-2.5 rounded-xl font-medium transition-colors whitespace-nowrap">Not Home</button>
            </div>
        </div>
    );
};

export default VisitorAlertCard;
