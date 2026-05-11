import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import api from '../utils/axios';
import { MdEvent, MdWarning, MdInfo, MdGroups } from 'react-icons/md';

const Notice = () => {
  const [notices, setNotices] = useState([]);
  const [filter, setFilter] = useState('all'); // FIX 1: small case
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNotices = async () => {
      try {
        const res = await api.get('/public/notices');
        setNotices(res.data.data || res.data); // FIX 2: handle both formats
        setLoading(false);
      } catch (err) {
        console.error(err);
        setLoading(false);
      }
    };
    fetchNotices();
  }, []);

  // FIX 3: Filter logic sahi kiya
  const filteredNotices = filter === 'all'
    ? notices
    : notices.filter(n => n.type === filter);

  const getIcon = (type) => {
    switch (type) {
      case 'meeting': return <MdGroups className="text-blue-500" />;
      case 'rule': return <MdWarning className="text-amber-500" />;
      case 'event': return <MdEvent className="text-green-500" />;
      default: return <MdInfo className="text-indigo-500" />;
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="min-h-screen bg-slate-50 dark:bg-gray-900 pt-0 flex flex-col transition-colors duration-300">
      <Navbar />
      <div className="max-w-5xl w-full mx-auto px-6 py-10 flex-grow mb-16">
        <div className="text-center mb-12 mt-8">
          <h1 className="text-4xl md:text-5xl font-heading font-extrabold text-slate-900 dark:text-white mb-4 tracking-tight">Notice Board</h1>
          <p className="text-slate-600 dark:text-gray-400 text-lg">Stay updated with the latest announcements and events.</p>
        </div>

        {/* Filters - FIX 4: small case values */}
        <div className="flex flex-wrap justify-center gap-3 mb-14">
          {[
            { label: 'All', value: 'all' },
            { label: 'Meeting', value: 'meeting' },
            { label: 'Rule', value: 'rule' },
            { label: 'Event', value: 'event' },
            { label: 'General', value: 'general' }
          ].map(tab => (
            <button
              key={tab.value}
              onClick={() => setFilter(tab.value)}
              className={`px-6 py-2.5 rounded-full font-semibold transition-all duration-300 ${filter === tab.value
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/30 dark:shadow-indigo-500/20 scale-105'
                : 'bg-white dark:bg-gray-800 text-slate-600 dark:text-gray-300 hover:bg-slate-100 dark:hover:bg-gray-700 border border-slate-200 dark:border-gray-700 hover:-translate-y-0.5'
                }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Notice List */}
        {loading ? (
          <div className="text-center text-slate-500 dark:text-gray-400 font-medium text-lg animate-pulse">Loading notices...</div>
        ) : filteredNotices.length === 0 ? (
          <div className="text-center py-16 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-3xl border border-slate-200 dark:border-gray-700">
            <p className="text-slate-500 dark:text-gray-400 text-lg">No notices found for this category.</p>
          </div>
        ) : (
          <div className="max-h-[60vh] overflow-y-auto border border-gray-200 dark:border-gray-700 shadow-inner rounded-xl p-4 sm:p-6 bg-white/50 dark:bg-gray-800/30">
            <div className="flex flex-col gap-4">
              {filteredNotices.map((notice, idx) => (
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: idx * 0.1 }}
                  key={notice._id}
                  className={`bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm p-4 sm:p-5 rounded-2xl relative overflow-hidden border border-slate-200 dark:border-gray-700 shadow-lg shadow-indigo-500/5 dark:shadow-black/20 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl dark:hover:shadow-indigo-500/10 ${notice.priority === 'Urgent' ? 'border-l-4 border-l-red-500 dark:border-l-red-500' : ''}`}
                >
                  {notice.priority === 'Urgent' && (
                    <div className="absolute top-4 right-4 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 text-xs font-bold px-3 py-1 rounded-full shadow-sm">
                      URGENT
                    </div>
                  )}
                  <div className="flex flex-col sm:flex-row items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-slate-50 dark:bg-gray-700/50 flex items-center justify-center text-2xl shrink-0 shadow-inner border border-slate-100 dark:border-gray-600">
                      {getIcon(notice.type)}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2 pr-16 leading-tight">{notice.title}</h3>
                      {/* FIX 5: description use kiya content ki jagah */}
                      <p className="text-sm text-slate-600 dark:text-gray-300 whitespace-pre-wrap mb-4 leading-relaxed">{notice.description}</p>
                      <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 dark:text-gray-400 font-medium">
                        <span className="bg-slate-100 dark:bg-gray-700 px-3 py-1 rounded-full capitalize text-slate-700 dark:text-gray-300">{notice.type}</span>
                        {/* FIX 6: date use kiya createdAt ki jagah */}
                        <span className="flex items-center gap-1">
                          <MdEvent className="text-base opacity-70" />
                          {new Date(notice.date).toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })}
                        </span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </div>
      <Footer />
    </motion.div>
  );
};

export default Notice;