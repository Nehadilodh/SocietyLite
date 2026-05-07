import React, { useState } from 'react';
import api from '../utils/axios';
import { toast } from 'react-hot-toast';

const SOSButton = () => {
    const [loading, setLoading] = useState(false);

    const handleSOS = async () => {
        if (!window.confirm("EMERGENCY: Are you sure you want to trigger SOS? This will alert all guards and admins immediately.")) return;
        
        setLoading(true);
        try {
            await api.post('/sos/trigger');
            toast.success('SOS Alert Broadcasted successfully!');
        } catch (err) {
            toast.error('Failed to send SOS');
        }
        setLoading(false);
    };

    return (
        <button 
            onClick={handleSOS} 
            disabled={loading}
            className="fixed bottom-8 right-8 w-16 h-16 bg-red-600 hover:bg-red-700 text-white rounded-full shadow-2xl flex items-center justify-center font-bold text-xl transition-transform hover:scale-110 active:scale-95 animate-pulse z-50 border-4 border-red-200"
        >
            SOS
        </button>
    );
};

export default SOSButton;
