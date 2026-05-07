import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from "../../utils/axios";
import { useAuth } from '../../context/AuthContext';
import ChatBox from '../../components/ChatBox';
import { MdArrowBack } from 'react-icons/md';

const ResidentComplaintDetail = () => {
    const { id } = useParams();
    const [complaint, setComplaint] = useState(null);
    const { darkMode } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchComplaint = async () => {
            try {
                const res = await api.get('/complaint/my');
                const found = res.data.find(c => c._id === id);
                setComplaint(found);
            } catch (err) {
                console.error(err);
            }
        };
        fetchComplaint();
    }, [id]);

    if (!complaint) return <div className="p-8 text-center">Loading...</div>;

    return (
        <div className="space-y-6 max-w-4xl mx-auto">
            <button onClick={() => navigate(-1)} className={`flex items-center gap-2 font-medium hover:underline ${darkMode ? 'text-slate-300' : 'text-slate-600'}`}>
                <MdArrowBack /> Back to Complaints
            </button>

            <div className={`p-6 rounded-3xl shadow-sm border ${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}`}>
                <div className="flex justify-between items-start mb-6">
                    <div>
                        <h1 className="text-2xl font-bold mb-2">{complaint.title}</h1>
                        <p className={`text-sm ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                            Filed on {new Date(complaint.createdAt).toLocaleDateString()}
                        </p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-sm font-bold ${complaint.status === 'Resolved' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' :
                        complaint.status === 'In Progress' ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400' :
                            'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                        }`}>
                        {complaint.status}
                    </span>
                </div>

                <div className={`p-4 rounded-xl mb-8 ${darkMode ? 'bg-slate-700/50' : 'bg-slate-50'}`}>
                    <h3 className="font-semibold mb-2">Description</h3>
                    <p className={darkMode ? 'text-slate-300' : 'text-slate-700'}>{complaint.description}</p>
                </div>

                <div className="border-t pt-6 dark:border-slate-700">
                    <h2 className="text-xl font-bold mb-4">Chat History</h2>
                    <div className="rounded-2xl overflow-hidden border dark:border-slate-700">
                        <ChatBox complaintId={id} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ResidentComplaintDetail;
