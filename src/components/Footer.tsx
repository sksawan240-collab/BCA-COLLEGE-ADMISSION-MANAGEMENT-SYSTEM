import React from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router';
import { GraduationCap, Facebook, Twitter, Instagram, Linkedin, MapPin, Phone, Mail, ArrowRight } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white pt-20 pb-10 mt-auto relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-t from-purple-900/40 via-gray-900 to-gray-900"></div>
      <motion.div 
        animate={{ y: [0, -20, 0], opacity: [0.1, 0.3, 0.1] }} 
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }} 
        className="absolute bottom-0 left-1/4 w-96 h-96 bg-purple-600 rounded-full blur-[120px] pointer-events-none"
      />
      <motion.div 
        animate={{ y: [0, 20, 0], opacity: [0.1, 0.2, 0.1] }} 
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 1 }} 
        className="absolute top-10 right-1/4 w-80 h-80 bg-pink-600 rounded-full blur-[100px] pointer-events-none"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          
          {/* Brand Info */}
          <div className="space-y-6">
            <Link to="/" className="flex items-center gap-3 group inline-flex">
              <motion.div whileHover={{ rotate: 180, scale: 1.1 }} transition={{ duration: 0.5 }} className="bg-gradient-to-br from-purple-500 to-pink-500 p-2.5 rounded-xl shadow-lg shadow-purple-500/20">
                <GraduationCap className="h-8 w-8 text-white" />
              </motion.div>
              <div>
                <span className="font-extrabold text-2xl bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-400 block leading-tight tracking-tight">Sharnbasva</span>
                <span className="text-sm text-purple-300 font-bold tracking-widest uppercase">University</span>
              </div>
            </Link>
            <p className="text-gray-400 leading-relaxed text-sm">
              Empowering the next generation of tech leaders through the comprehensive BCA Co-Education program. Experience world-class education and modern infrastructure.
            </p>
            <div className="flex gap-4">
              {[
                { icon: Facebook, href: "#" },
                { icon: Twitter, href: "#" },
                { icon: Instagram, href: "#" },
                { icon: Linkedin, href: "#" }
              ].map((social, idx) => (
                <motion.a 
                  key={idx}
                  whileHover={{ y: -3, scale: 1.1 }}
                  href={social.href} 
                  className="bg-white/5 p-2.5 rounded-lg text-gray-400 hover:text-white hover:bg-gradient-to-br hover:from-purple-500 hover:to-pink-500 transition-all shadow-lg"
                >
                  <social.icon className="h-5 w-5" />
                </motion.a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-bold text-white mb-6 border-b border-white/10 pb-2 inline-block">Quick Links</h4>
            <ul className="space-y-3">
              {[
                { name: 'Admissions 2026', path: '/register' },
                { name: 'Student Portal', path: '/login' },
                { name: 'Fee Structure', path: '/#fee-structure' },
                { name: 'Curriculum & Syllabus', path: '/#curriculum' },
                { name: 'Scholarships', path: '/#scholarships' }
              ].map((link, idx) => (
                <li key={idx}>
                  <Link to={link.path} className="text-gray-400 hover:text-pink-400 font-medium transition-colors flex items-center gap-2 group">
                    <ArrowRight className="h-4 w-4 opacity-0 -ml-6 group-hover:opacity-100 group-hover:ml-0 transition-all text-pink-500" />
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-bold text-white mb-6 border-b border-white/10 pb-2 inline-block">Contact Us</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3 text-gray-400">
                <MapPin className="h-5 w-5 text-purple-400 shrink-0 mt-0.5" />
                <span className="text-sm leading-relaxed">Main Campus, Sharanabasaveshwar Shrine Complex, Kalaburagi, Karnataka - 585103</span>
              </li>
              <li className="flex items-center gap-3 text-gray-400">
                <Phone className="h-5 w-5 text-purple-400 shrink-0" />
                <span className="text-sm">+91 8472 277701</span>
              </li>
              <li className="flex items-center gap-3 text-gray-400">
                <Mail className="h-5 w-5 text-purple-400 shrink-0" />
                <span className="text-sm">admissions@sharnbasva.edu.in</span>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="text-lg font-bold text-white mb-6 border-b border-white/10 pb-2 inline-block">Newsletter</h4>
            <p className="text-gray-400 text-sm mb-4 leading-relaxed">Subscribe to get the latest updates on admissions, events, and announcements.</p>
            <form className="relative group" onSubmit={(e) => e.preventDefault()}>
              <input 
                type="email" 
                placeholder="Enter your email" 
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all pr-12"
              />
              <button 
                type="submit"
                className="absolute right-1 top-1 bottom-1 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg px-3 flex items-center justify-center text-white hover:opacity-90 transition-opacity"
              >
                <ArrowRight className="h-4 w-4" />
              </button>
            </form>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-gray-500 font-medium text-center md:text-left">
            &copy; {new Date().getFullYear()} Sharnbasva University. All rights reserved.
          </p>
          <div className="flex items-center gap-6 text-sm text-gray-500 font-medium">
            <Link to="#" className="hover:text-purple-400 transition-colors">Privacy Policy</Link>
            <Link to="#" className="hover:text-purple-400 transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
