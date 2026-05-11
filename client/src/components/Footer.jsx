import React from 'react';
import { Link } from 'react-router-dom';
import { MdFacebook } from 'react-icons/md';
import { FaTwitter, FaInstagram, FaLinkedin } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="bg-slate-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 pt-16 pb-8 mt-auto mb-0 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
          {/* Column 1: Company */}
          <div className="space-y-4">
            <h3 className="font-heading text-2xl font-black text-indigo-600 dark:text-indigo-400 tracking-tight">SocietyLite</h3>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed max-w-sm">
              Building a community of trust, harmony, and modern living. Experience the pinnacle of smart society management.
            </p>
            <div className="flex gap-4 pt-2">
              <a href="#" className="w-10 h-10 rounded-full bg-indigo-50 dark:bg-gray-800 text-indigo-600 dark:text-indigo-400 flex items-center justify-center hover:bg-indigo-600 hover:text-white dark:hover:bg-indigo-500 dark:hover:text-white transition-all duration-300 hover:-translate-y-1">
                <MdFacebook size={20} />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-indigo-50 dark:bg-gray-800 text-indigo-600 dark:text-indigo-400 flex items-center justify-center hover:bg-indigo-600 hover:text-white dark:hover:bg-indigo-500 dark:hover:text-white transition-all duration-300 hover:-translate-y-1">
                <FaTwitter size={18} />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-indigo-50 dark:bg-gray-800 text-indigo-600 dark:text-indigo-400 flex items-center justify-center hover:bg-indigo-600 hover:text-white dark:hover:bg-indigo-500 dark:hover:text-white transition-all duration-300 hover:-translate-y-1">
                <FaInstagram size={18} />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-indigo-50 dark:bg-gray-800 text-indigo-600 dark:text-indigo-400 flex items-center justify-center hover:bg-indigo-600 hover:text-white dark:hover:bg-indigo-500 dark:hover:text-white transition-all duration-300 hover:-translate-y-1">
                <FaLinkedin size={18} />
              </a>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h3 className="font-heading text-lg font-bold text-gray-900 dark:text-white mb-6 uppercase tracking-wider text-sm">Quick Links</h3>
            <ul className="space-y-3">
              <li><Link to="/about" className="text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors flex items-center gap-2"><span className="text-indigo-500 text-xs">▸</span> About Us</Link></li>
              <li><Link to="/notice" className="text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors flex items-center gap-2"><span className="text-indigo-500 text-xs">▸</span> Notice Board</Link></li>
              <li><Link to="/login" className="text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors flex items-center gap-2"><span className="text-indigo-500 text-xs">▸</span> Complaints</Link></li>
              <li><Link to="/contact" className="text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors flex items-center gap-2"><span className="text-indigo-500 text-xs">▸</span> Contact Support</Link></li>
            </ul>
          </div>

          {/* Column 3: Legal */}
          <div>
            <h3 className="font-heading text-lg font-bold text-gray-900 dark:text-white mb-6 uppercase tracking-wider text-sm">Legal</h3>
            <ul className="space-y-3">
              <li><Link to="#" className="text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors flex items-center gap-2"><span className="text-indigo-500 text-xs">▸</span> Privacy Policy</Link></li>
              <li><Link to="#" className="text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors flex items-center gap-2"><span className="text-indigo-500 text-xs">▸</span> Terms of Service</Link></li>
              <li><Link to="#" className="text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors flex items-center gap-2"><span className="text-indigo-500 text-xs">▸</span> Cookie Policy</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-200 dark:border-gray-800 pt-8 mt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            © {new Date().getFullYear()} SocietyLite. All rights reserved.
          </p>
          <p className="text-gray-500 dark:text-gray-400 text-sm flex items-center gap-1">
            Made with <span className="text-red-500">♥</span> for Smart Communities
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
