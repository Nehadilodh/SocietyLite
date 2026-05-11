import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import api from '../utils/axios';
import toast from 'react-hot-toast';
import { MdLocationOn, MdPhone, MdEmail } from 'react-icons/md';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '', email: '', phone: '', subject: '', message: ''
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/public/contact', formData);
      toast.success('Message sent successfully!');
      setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
    } catch (err) {
      toast.error('Failed to send message');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="min-h-screen bg-slate-50 dark:bg-gray-900 transition-colors duration-300 flex flex-col">
      <Navbar />
      <div className="max-w-7xl mx-auto px-6 pb-10 flex-grow mt-8">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-heading font-extrabold text-slate-900 dark:text-white mb-4 tracking-tight pt-8">Contact Us</h1>
          <p className="text-slate-600 dark:text-gray-400 text-lg">Have a question? We'd love to hear from you.</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Form */}
          <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-md border border-slate-200 dark:border-gray-700 shadow-xl shadow-indigo-500/5 dark:shadow-black/20 p-8 sm:p-10 rounded-[2.5rem]">
            <h2 className="text-3xl font-extrabold mb-8 text-slate-900 dark:text-white tracking-tight">Send us a Message</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-gray-300 mb-2">Full Name</label>
                  <input required type="text" className="w-full px-5 py-3.5 bg-slate-50 dark:bg-gray-900/50 border border-slate-200 dark:border-gray-700 text-slate-900 dark:text-white rounded-2xl focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 dark:focus:border-indigo-500 outline-none transition-all font-medium" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} placeholder="John Doe" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-gray-300 mb-2">Phone Number</label>
                  <input required type="text" className="w-full px-5 py-3.5 bg-slate-50 dark:bg-gray-900/50 border border-slate-200 dark:border-gray-700 text-slate-900 dark:text-white rounded-2xl focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 dark:focus:border-indigo-500 outline-none transition-all font-medium" value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })} placeholder="+91 98765 43210" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-gray-300 mb-2">Email Address</label>
                <input required type="email" className="w-full px-5 py-3.5 bg-slate-50 dark:bg-gray-900/50 border border-slate-200 dark:border-gray-700 text-slate-900 dark:text-white rounded-2xl focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 dark:focus:border-indigo-500 outline-none transition-all font-medium" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} placeholder="john@example.com" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-gray-300 mb-2">Subject</label>
                <input required type="text" className="w-full px-5 py-3.5 bg-slate-50 dark:bg-gray-900/50 border border-slate-200 dark:border-gray-700 text-slate-900 dark:text-white rounded-2xl focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 dark:focus:border-indigo-500 outline-none transition-all font-medium" value={formData.subject} onChange={e => setFormData({ ...formData, subject: e.target.value })} placeholder="How can we help?" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-gray-300 mb-2">Message</label>
                <textarea required rows="5" className="w-full px-5 py-4 bg-slate-50 dark:bg-gray-900/50 border border-slate-200 dark:border-gray-700 text-slate-900 dark:text-white rounded-2xl focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 dark:focus:border-indigo-500 outline-none resize-none transition-all font-medium" value={formData.message} onChange={e => setFormData({ ...formData, message: e.target.value })} placeholder="Write your message here..."></textarea>
              </div>
              <button disabled={loading} type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-lg py-4 rounded-2xl shadow-lg shadow-indigo-500/30 dark:shadow-indigo-500/20 transition-all duration-300 hover:-translate-y-0.5 disabled:opacity-70 disabled:hover:translate-y-0 mt-4">
                {loading ? 'Sending Message...' : 'Send Message'}
              </button>
            </form>
          </div>

          {/* Info */}
          <div className="space-y-8">
            <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-md border border-slate-200 dark:border-gray-700 shadow-xl shadow-indigo-500/5 dark:shadow-black/20 p-8 sm:p-10 rounded-[2.5rem]">
              <h2 className="text-3xl font-extrabold mb-8 text-slate-900 dark:text-white tracking-tight">Contact Information</h2>
              <div className="space-y-8">
                <div className="flex items-start gap-6 group">
                  <div className="w-14 h-14 bg-indigo-50 dark:bg-gray-700/50 text-indigo-600 dark:text-indigo-400 rounded-2xl flex items-center justify-center shrink-0 text-2xl shadow-inner border border-indigo-100 dark:border-gray-600 transition-transform group-hover:scale-110 duration-300">
                    <MdLocationOn />
                  </div>
                  <div>
                    <h4 className="font-bold text-lg text-slate-900 dark:text-white mb-1">Office Address</h4>
                    <p className="text-slate-600 dark:text-gray-400 leading-relaxed font-medium">Green Valley Residency, Plot 42,<br/>Cyber Hub, City - 400001</p>
                  </div>
                </div>
                <div className="flex items-start gap-6 group">
                  <div className="w-14 h-14 bg-indigo-50 dark:bg-gray-700/50 text-indigo-600 dark:text-indigo-400 rounded-2xl flex items-center justify-center shrink-0 text-2xl shadow-inner border border-indigo-100 dark:border-gray-600 transition-transform group-hover:scale-110 duration-300">
                    <MdPhone />
                  </div>
                  <div>
                    <h4 className="font-bold text-lg text-slate-900 dark:text-white mb-1">Phone Number</h4>
                    <p className="text-slate-600 dark:text-gray-400 font-medium">+91 98765 43210 <br />+91 98765 43211</p>
                  </div>
                </div>
                <div className="flex items-start gap-6 group">
                  <div className="w-14 h-14 bg-indigo-50 dark:bg-gray-700/50 text-indigo-600 dark:text-indigo-400 rounded-2xl flex items-center justify-center shrink-0 text-2xl shadow-inner border border-indigo-100 dark:border-gray-600 transition-transform group-hover:scale-110 duration-300">
                    <MdEmail />
                  </div>
                  <div>
                    <h4 className="font-bold text-lg text-slate-900 dark:text-white mb-1">Email Address</h4>
                    <p className="text-indigo-600 dark:text-indigo-400 font-medium">support@societylite.com</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Map Placeholder */}
            <div className="h-[280px] rounded-[2.5rem] overflow-hidden bg-white/90 dark:bg-gray-800/90 backdrop-blur-md p-3 border border-slate-200 dark:border-gray-700 shadow-xl shadow-indigo-500/5 dark:shadow-black/20">
              <div className="w-full h-full bg-slate-100 dark:bg-gray-900/50 rounded-3xl flex items-center justify-center border border-slate-200 dark:border-gray-800">
                <span className="text-slate-400 dark:text-gray-500 font-bold tracking-wide">Interactive Map Area</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </motion.div>
  );
};

export default Contact;
