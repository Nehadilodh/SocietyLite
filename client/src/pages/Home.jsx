import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { motion } from 'framer-motion';
import { MdSecurity, MdPool, MdFitnessCenter, MdLocalParking, MdEco, MdWifi } from 'react-icons/md';

const Home = () => {
  const stats = [
    { label: "Happy Families", value: "500+" },
    { label: "Years of Trust", value: "10+" },
    { label: "Amenities", value: "24/7" },
    { label: "Green Area", value: "40%" },
  ];

  const amenities = [
    { icon: <MdSecurity />, title: "24/7 Security", desc: "Round the clock AI-assisted security" },
    { icon: <MdPool />, title: "Swimming Pool", desc: "Temperature controlled olympic size pool" },
    { icon: <MdFitnessCenter />, title: "Gymnasium", desc: "Fully equipped modern fitness center" },
    { icon: <MdLocalParking />, title: "Smart Parking", desc: "Dedicated and guest parking spaces" },
    { icon: <MdEco />, title: "Lush Gardens", desc: "Beautifully landscaped green areas" },
    { icon: <MdWifi />, title: "High-Speed WiFi", desc: "Seamless connectivity in common areas" },
  ];

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      exit={{ opacity: 0 }}
      className="min-h-screen flex flex-col"
    >
      <Navbar />
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 to-white dark:from-slate-900 dark:to-slate-800 -z-10" />
        <div className="absolute top-0 right-0 -translate-y-12 translate-x-1/3 w-[800px] h-[800px] bg-indigo-100/50 dark:bg-indigo-900/20 rounded-full blur-3xl -z-10" />
        
        <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-12 items-center">
          <motion.div 
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-5xl lg:text-7xl font-heading font-bold text-slate-900 dark:text-white leading-tight mb-6">
              Welcome to <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-amber-500">Green Valley</span> Residency
            </h1>
            <p className="text-lg text-slate-600 dark:text-slate-300 mb-8 max-w-lg leading-relaxed">
              Experience the pinnacle of modern living with our smart, secure, and community-driven society management system.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to="/login" className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 rounded-full font-medium shadow-lg shadow-indigo-200 dark:shadow-none transition-all hover:-translate-y-1">
                Resident Portal
              </Link>
              <Link to="/contact" className="bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800 px-8 py-3 rounded-full font-medium transition-all hover:-translate-y-1">
                Contact Us
              </Link>
            </div>
          </motion.div>
          
          <motion.div 
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative"
          >
            <img 
              src="https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80" 
              alt="Society Building" 
              className="rounded-3xl shadow-2xl w-full object-cover h-[500px]"
            />
            <div className="absolute -bottom-8 -left-8 glass dark:glass-dark p-6 rounded-2xl hidden md:block">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center text-amber-600 text-2xl">
                  ★
                </div>
                <div>
                  <p className="font-bold text-slate-900 dark:text-white">Premium Living</p>
                  <p className="text-sm text-slate-500 dark:text-slate-400">Award winning design</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-white dark:bg-slate-900 border-y border-slate-100 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, idx) => (
            <div key={idx} className="text-center p-6 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
              <h3 className="text-4xl font-bold text-indigo-600 mb-2">{stat.value}</h3>
              <p className="text-slate-600 dark:text-slate-400 font-medium">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Amenities Section */}
      <section className="py-24 bg-slate-50 dark:bg-slate-800">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-4xl font-heading font-bold text-slate-900 dark:text-white mb-4">World Class Amenities</h2>
            <p className="text-slate-600 dark:text-slate-400">Everything you need for a comfortable and luxurious lifestyle, right at your doorstep.</p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {amenities.map((item, idx) => (
              <motion.div 
                key={idx}
                whileHover={{ y: -5 }}
                className="glass dark:glass-dark p-8 rounded-2xl"
              >
                <div className="w-14 h-14 bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400 rounded-xl flex items-center justify-center text-3xl mb-6">
                  {item.icon}
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">{item.title}</h3>
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery Section */}
      <section className="py-24 bg-white dark:bg-slate-900">
         <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-4xl font-heading font-bold text-slate-900 dark:text-white mb-12 text-center">Life at Green Valley</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {[
              "https://images.unsplash.com/photo-1576013551627-14875ea8ac56?auto=format&fit=crop&w=600&q=80",
              "https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?auto=format&fit=crop&w=600&q=80",
              "https://images.unsplash.com/photo-1519999482648-25049ddd37b1?auto=format&fit=crop&w=600&q=80",
              "https://images.unsplash.com/photo-1540541338287-41700207dee6?auto=format&fit=crop&w=600&q=80",
              "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=600&q=80",
              "https://images.unsplash.com/photo-1511884642898-4c92249e20b6?auto=format&fit=crop&w=600&q=80"
            ].map((img, i) => (
              <div key={i} className="overflow-hidden rounded-xl aspect-square">
                <img src={img} alt="Gallery" className="w-full h-full object-cover hover:scale-110 transition-transform duration-500" />
              </div>
            ))}
          </div>
         </div>
      </section>
      <Footer />
    </motion.div>
  );
};

export default Home;
