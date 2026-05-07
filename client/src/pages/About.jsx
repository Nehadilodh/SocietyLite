import React from 'react';
import { motion } from 'framer-motion';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const About = () => {
  const committee = [
    { name: "Rajesh Sharma", role: "President", img: "https://i.pravatar.cc/150?u=rajesh" },
    { name: "Anita Desai", role: "Secretary", img: "https://i.pravatar.cc/150?u=anita" },
    { name: "Vikram Singh", role: "Treasurer", img: "https://i.pravatar.cc/150?u=vikram" },
  ];

  return (
    <motion.div 
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="pt-0 pb-20 flex flex-col min-h-screen"
    >
      <Navbar />
      {/* Hero */}
      <div className="bg-indigo-600 text-white py-20 text-center px-6">
        <h1 className="text-5xl font-heading font-bold mb-4">About Us</h1>
        <p className="text-indigo-100 max-w-2xl mx-auto text-lg">Building a community of trust, harmony, and modern living since 2015.</p>
      </div>

      {/* Story */}
      <div className="max-w-7xl mx-auto px-6 py-20 grid md:grid-cols-2 gap-12 items-center">
        <div>
          <h2 className="text-3xl font-heading font-bold text-slate-900 mb-6">Our Story</h2>
          <p className="text-slate-600 leading-relaxed mb-4">
            Green Valley Residency started as a vision to create a sustainable, tech-enabled living space for modern families. Over the years, we have grown into a vibrant community of over 500 families.
          </p>
          <p className="text-slate-600 leading-relaxed">
            Our commitment to security, cleanliness, and community engagement makes us one of the most sought-after residential complexes in the city. With the introduction of SocietyLite, we are taking a step further into smart living.
          </p>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <img src="https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=400&q=80" alt="Building" className="rounded-2xl h-64 object-cover w-full mt-8" />
          <img src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=400&q=80" alt="Interior" className="rounded-2xl h-64 object-cover w-full" />
        </div>
      </div>

      {/* Timeline */}
      <div className="bg-slate-50 py-20">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-3xl font-heading font-bold text-slate-900 mb-12 text-center">Our Journey</h2>
          <div className="space-y-8 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-300 before:to-transparent">
            {[
              { year: "2015", title: "Foundation Stone Laid", desc: "The vision of Green Valley was born." },
              { year: "2018", title: "First Phase Completed", desc: "Welcomed our first 100 families." },
              { year: "2021", title: "Clubhouse Inauguration", desc: "Opened our world-class amenities." },
              { year: "2026", title: "Smart Society Init", desc: "Launched SocietyLite AI platform." }
            ].map((item, idx) => (
              <div key={idx} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-white bg-indigo-500 text-white shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2">
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                </div>
                <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] glass p-6 rounded-2xl">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="font-bold text-slate-900 text-lg">{item.title}</h3>
                    <span className="font-bold text-indigo-600">{item.year}</span>
                  </div>
                  <p className="text-slate-600">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Committee */}
      <div className="max-w-7xl mx-auto px-6 py-20">
        <h2 className="text-3xl font-heading font-bold text-slate-900 mb-12 text-center">Managing Committee</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {committee.map((member, idx) => (
            <div key={idx} className="glass p-8 rounded-2xl text-center hover:-translate-y-2 transition-transform">
              <img src={member.img} alt={member.name} className="w-32 h-32 rounded-full mx-auto mb-4 border-4 border-white shadow-lg" />
              <h3 className="text-xl font-bold text-slate-900">{member.name}</h3>
              <p className="text-indigo-600 font-medium">{member.role}</p>
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </motion.div>
  );
};

export default About;
