import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import api from '../utils/axios';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { MdEmail, MdLock } from 'react-icons/md';

const Login = () => {
  const [role, setRole] = useState('resident');
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.post('/auth/login', { ...formData, role });
      login(res.data.user, res.data.token);
      
      const alreadyShown = sessionStorage.getItem('loginToast');
      if (!alreadyShown) {
        toast.success('Login successful!');
        sessionStorage.setItem('loginToast', 'true');
      }
      
      navigate(`/${res.data.user.role}`);
    } catch (err) {
      toast.error(err.response?.data?.msg || err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Illustration */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-indigo-600 to-indigo-900 p-12 flex-col justify-between text-white relative overflow-hidden">
        <div className="relative z-10">
          <h1 className="text-4xl font-heading font-black tracking-tight mb-4 drop-shadow-sm">SocietyLite</h1>
          <p className="text-indigo-200 text-lg font-medium tracking-wide">Smart Living, Simplified.</p>
        </div>
        <div className="relative z-10 mb-12">
          <h2 className="text-5xl font-bold mb-6 leading-tight drop-shadow-md">Welcome back to<br/>your community.</h2>
          <p className="text-indigo-200 text-lg max-w-md leading-relaxed">Sign in to access your dashboard, connect with neighbors, and manage your daily activities seamlessly.</p>
        </div>
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-white opacity-10 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/3"></div>
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-indigo-400 opacity-30 rounded-full blur-[100px] translate-y-1/3 -translate-x-1/3"></div>
      </div>

      {/* Right Form */}
      <div className="w-full lg:w-1/2 flex flex-col items-center justify-center p-6 bg-slate-50 dark:bg-gray-900 transition-colors duration-300 relative">
        <Link to="/" className="absolute top-8 left-8 flex items-center gap-2 text-slate-500 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 font-medium transition-colors group">
          <span className="transition-transform group-hover:-translate-x-1">&larr;</span> Back to Home
        </Link>
        
        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="w-full max-w-md bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl p-10 rounded-[2rem] shadow-2xl shadow-indigo-500/10 dark:shadow-black/40 border border-white/50 dark:border-gray-700/50">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-heading font-extrabold text-slate-900 dark:text-white mb-3 tracking-tight">Sign In</h2>
            <p className="text-slate-500 dark:text-gray-400 font-medium">Select your role to continue</p>
          </div>

          <div className="flex bg-slate-100 dark:bg-gray-900/50 p-1.5 rounded-2xl mb-8 border border-slate-200 dark:border-gray-700 shadow-inner">
            {['resident', 'guard', 'admin'].map(r => (
              <button
                key={r}
                type="button"
                onClick={() => setRole(r)}
                className={`flex-1 py-2.5 text-sm font-bold rounded-xl capitalize transition-all duration-300 ${role === r ? 'bg-white dark:bg-gray-700 text-indigo-600 dark:text-indigo-400 shadow-sm ring-1 ring-slate-200 dark:ring-gray-600' : 'text-slate-500 dark:text-gray-400 hover:text-slate-700 dark:hover:text-gray-200'}`}
              >
                {r}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-gray-300 mb-2">Email Address</label>
              <div className="relative group">
                <MdEmail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-gray-500 text-xl transition-colors group-focus-within:text-indigo-500" />
                <input required type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full pl-12 pr-4 py-3.5 bg-slate-50 dark:bg-gray-900/50 border border-slate-200 dark:border-gray-700 text-slate-900 dark:text-white rounded-xl focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 dark:focus:border-indigo-500 outline-none transition-all font-medium" placeholder="Enter your email" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-gray-300 mb-2">Password</label>
              <div className="relative group">
                <MdLock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-gray-500 text-xl transition-colors group-focus-within:text-indigo-500" />
                <input required type="password" value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} className="w-full pl-12 pr-4 py-3.5 bg-slate-50 dark:bg-gray-900/50 border border-slate-200 dark:border-gray-700 text-slate-900 dark:text-white rounded-xl focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 dark:focus:border-indigo-500 outline-none transition-all font-medium" placeholder="••••••••" />
              </div>
            </div>
            
            <button disabled={loading} type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3.5 rounded-xl transition-all duration-300 shadow-lg shadow-indigo-500/30 dark:shadow-indigo-500/20 hover:-translate-y-0.5 disabled:opacity-70 disabled:hover:translate-y-0 mt-6">
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;
