import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
    
    // Ye check add kar
    const alreadyShown = sessionStorage.getItem('loginToast');
    if (!alreadyShown) {
      toast.success('Login successful!');
      sessionStorage.setItem('loginToast', 'true');
    }
    
    navigate(`/${res.data.user.role}`);
  } catch (err) {
    toast.error(err.response?.data?.message || 'Login failed');
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="min-h-screen flex">
      {/* Left Illustration */}
      <div className="hidden lg:flex lg:w-1/2 bg-indigo-600 p-12 flex-col justify-between text-white relative overflow-hidden">
        <div className="relative z-10">
          <h1 className="text-4xl font-heading font-bold mb-4">SocietyLite</h1>
          <p className="text-indigo-200 text-lg">Smart Living, Simplified.</p>
        </div>
        <div className="relative z-10 mb-12">
          <h2 className="text-5xl font-bold mb-6 leading-tight">Welcome back to<br/>your community.</h2>
          <p className="text-indigo-200">Sign in to access your dashboard, connect with neighbors, and manage your daily activities.</p>
        </div>
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-white opacity-5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-indigo-400 opacity-20 rounded-full blur-3xl translate-y-1/3 -translate-x-1/3"></div>
      </div>

      {/* Right Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 bg-slate-50">
        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="w-full max-w-md glass p-8 rounded-3xl">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-heading font-bold text-slate-900 mb-2">Sign In</h2>
            <p className="text-slate-500">Select your role to continue</p>
          </div>

          <div className="flex bg-slate-100 p-1 rounded-xl mb-8">
            {['resident', 'guard', 'admin'].map(r => (
              <button
                key={r}
                onClick={() => setRole(r)}
                className={`flex-1 py-2 text-sm font-medium rounded-lg capitalize transition-all ${role === r ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
              >
                {r}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
              <div className="relative">
                <MdEmail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-xl" />
                <input required type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all" placeholder="Enter your email" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
              <div className="relative">
                <MdLock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-xl" />
                <input required type="password" value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all" placeholder="••••••••" />
              </div>
            </div>
            
            <button disabled={loading} type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-3 rounded-xl transition-all shadow-lg shadow-indigo-200 hover:-translate-y-0.5 disabled:opacity-70 disabled:hover:translate-y-0 mt-4">
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;
