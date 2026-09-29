import React from 'react';
import { motion } from 'motion/react';
import { MapPin, Users, Coffee, Activity, Home, Wifi } from 'lucide-react';

export default function CampusLifePage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <section className="bg-gradient-to-br from-teal-900 to-emerald-900 text-white pt-32 pb-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&q=80&w=2000')] bg-cover bg-center opacity-20 mix-blend-overlay"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} 
            className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-6 tracking-tight"
          >
            Campus Life
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="text-xl text-teal-100 max-w-3xl mx-auto leading-relaxed"
          >
            Beyond academics, Sharnbasva University offers a vibrant, safe, and enriching environment that fosters personal growth and lifelong friendships.
          </motion.p>
        </div>
      </section>

      {/* Facilities Grid */}
      <section className="py-24 bg-white relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-teal-600 font-bold tracking-wider uppercase text-sm mb-2 block">Amenities</span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Experience the Campus</h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { title: 'Modern Hostels', desc: 'Secure, Wi-Fi enabled separate hostels for boys and girls with recreational areas.', icon: Home, image: 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&q=80&w=800' },
              { title: 'Sports Complex', desc: 'Indoor and outdoor sports facilities including basketball, cricket, and a fully equipped gym.', icon: Activity, image: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&q=80&w=800' },
              { title: 'Cafeteria', desc: 'Hygienic multi-cuisine food courts providing nutritious meals in a relaxed setting.', icon: Coffee, image: 'https://images.unsplash.com/photo-1559925393-8be0ec4767c8?auto=format&fit=crop&q=80&w=800' }
            ].map((facility, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="group rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all border border-gray-100"
              >
                <div className="relative h-64 overflow-hidden">
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors z-10"></div>
                  <img src={facility.image} alt={facility.title} className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700" />
                  <div className="absolute top-4 left-4 z-20 bg-white/90 backdrop-blur-sm p-3 rounded-2xl shadow-lg">
                    <facility.icon className="h-6 w-6 text-teal-600" />
                  </div>
                </div>
                <div className="p-8 bg-white">
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">{facility.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{facility.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Culture & Clubs */}
      <section className="py-24 bg-gray-50 border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">Student Clubs & Societies</h2>
              <p className="text-gray-600 text-lg mb-8 leading-relaxed">
                We encourage students to pursue their passions through various technical and cultural clubs. These platforms help build leadership skills, foster creativity, and create a strong network.
              </p>
              <div className="grid grid-cols-2 gap-6">
                {[
                  { name: 'Coding Club', icon: Wifi },
                  { name: 'Cultural Committee', icon: Users },
                  { name: 'Sports Board', icon: Activity },
                  { name: 'Tech Symposiums', icon: MapPin }
                ].map((club, idx) => (
                  <div key={idx} className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
                    <div className="bg-teal-50 p-2 rounded-lg">
                      <club.icon className="h-5 w-5 text-teal-600" />
                    </div>
                    <span className="font-bold text-gray-800">{club.name}</span>
                  </div>
                ))}
              </div>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="grid grid-cols-2 gap-4"
            >
              <img src="https://images.unsplash.com/photo-1523580494112-071d16940d14?auto=format&fit=crop&q=80&w=600" alt="Students" className="rounded-3xl w-full h-64 object-cover shadow-lg" />
              <img src="https://images.unsplash.com/photo-1529070538774-1843cb3265df?auto=format&fit=crop&q=80&w=600" alt="Event" className="rounded-3xl w-full h-64 object-cover shadow-lg mt-8" />
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}
