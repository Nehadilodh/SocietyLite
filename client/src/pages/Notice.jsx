import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import api from '../utils/axios';
import { MdEvent, MdWarning, MdInfo, MdGroups } from 'react-icons/md';

const Notice = () => {
  const [notices, setNotices] = useState([]);
  const [filter, setFilter] = useState('All');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNotices = async () => {
      try {
        const res = await api.get('/public/notices');
        setNotices(res.data);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setLoading(false);
      }
    };
    fetchNotices();
  }, []);

  const filteredNotices = filter === 'All' ? notices : notices.filter(n => n.type === filter);

  const getIcon = (type) => {
    switch (type) {
      case 'Meeting': return <MdGroups className="text-blue-500" />;
      case 'Rule': return <MdWarning className="text-amber-500" />;
      case 'Event': return <MdEvent className="text-green-500" />;
      default: return <MdInfo className="text-indigo-500" />;
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="min-h-screen bg-slate-50 pt-0 pb-20 flex flex-col">
      <Navbar />
      <div className="max-w-5xl mx-auto px-6 py-10">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-heading font-bold text-slate-900 mb-4">Notice Board</h1>
          <p className="text-slate-600">Stay updated with the latest announcements and events.</p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap justify-center gap-2 mb-12">
          {['All', 'Meeting', 'Rule', 'Event', 'General'].map(tab => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`px-6 py-2 rounded-full font-medium transition-all ${filter === tab
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Notice List */}
        {loading ? (
          <div className="text-center text-slate-500">Loading notices...</div>
        ) : filteredNotices.length === 0 ? (
          <div className="text-center py-12 glass rounded-2xl">
            <p className="text-slate-500">No notices found for this category.</p>
          </div>
        ) : (
          <div className="grid gap-6">
            {filteredNotices.map((notice, idx) => (
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: idx * 0.1 }}
                key={notice._id}
                className={`glass p-6 rounded-2xl relative overflow-hidden ${notice.priority === 'Urgent' ? 'border-l-4 border-l-red-500' : ''}`}
              >
                {notice.priority === 'Urgent' && (
                  <div className="absolute top-4 right-4 bg-red-100 text-red-600 text-xs font-bold px-2 py-1 rounded">
                    URGENT
                  </div>
                )}
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center text-2xl shrink-0">
                    {getIcon(notice.type)}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2 pr-16">{notice.title}</h3>
                    <p className="text-slate-600 whitespace-pre-wrap mb-4">{notice.content}</p>
                    <div className="flex items-center gap-4 text-sm text-slate-500">
                      <span className="bg-slate-100 px-3 py-1 rounded-full">{notice.type}</span>
                      <span>{new Date(notice.createdAt).toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
      <Footer />
    </motion.div>
  );
};

export default Notice;
