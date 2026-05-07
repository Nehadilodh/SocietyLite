import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <div className="bg-gray-900 dark:bg-black text-white p-8 mt-auto">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
        <div>
          <h3 className="font-heading text-xl mb-4 text-white">SocietyLite</h3>
          <p>123 Main St, Delhi, India</p>
        </div>
        <div>
          <h3 className="font-heading text-xl mb-4 text-white">Quick Links</h3>
          <ul className="space-y-2">
            <li><Link to="/" className="hover:text-indigo-400">Home</Link></li>
            <li><Link to="/about" className="hover:text-indigo-400">About</Link></li>
            <li><Link to="/contact" className="hover:text-indigo-400">Contact</Link></li>
          </ul>
        </div>
        <div>
          <h3 className="font-heading text-xl mb-4 text-white">Contact</h3>
          <p>Email: admin@societylite.com</p>
          <p>Phone: +91 98765 43210</p>
        </div>
      </div>
      <div className="border-t border-gray-700 mt-6 pt-6 text-center text-gray-400 text-sm">
        © 2026 SocietyLite. All rights reserved.
      </div>
    </div>
  );
};

export default Footer;
