import React from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router';
import { CheckCircle, Clock, FileText, Upload, Calculator, ArrowRight } from 'lucide-react';
import ScholarshipCalculator from '../components/ScholarshipCalculator';

export default function AdmissionsPage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <section className="bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 text-white pt-32 pb-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&q=80&w=2000')] bg-cover bg-center opacity-10"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} 
            className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-6 tracking-tight"
          >
            Admissions & Fees
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="text-xl text-purple-200 max-w-3xl mx-auto leading-relaxed mb-8"
          >
            Join a vibrant community of tech enthusiasts. Everything you need to know about the BCA Co-Education admission process.
          </motion.p>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <Link to="/register" className="inline-block px-8 py-4 bg-white text-purple-900 font-bold rounded-full hover:bg-gray-100 transition-colors shadow-xl">
              Start Application Now
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-24 bg-white relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-pink-600 font-bold tracking-wider uppercase text-sm mb-2 block">The Journey</span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">How to Apply</h2>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            {[
              { icon: FileText, title: '1. Register Online', desc: 'Create your account using a valid email and mobile number.', color: 'from-blue-500 to-cyan-500' },
              { icon: Clock, title: '2. Fill Details', desc: 'Complete the comprehensive application form with your academic history.', color: 'from-purple-500 to-indigo-500' },
              { icon: Upload, title: '3. Upload Docs', desc: 'Securely upload your marksheets and identity proofs.', color: 'from-pink-500 to-rose-500' },
              { icon: CheckCircle, title: '4. Pay & Submit', desc: 'Pay the application fee securely via Razorpay and submit.', color: 'from-emerald-500 to-teal-500' }
            ].map((step, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="bg-gray-50 border border-gray-100 rounded-3xl p-8 text-center hover:shadow-xl transition-shadow group"
              >
                <div className={`w-16 h-16 mx-auto bg-gradient-to-br ${step.color} text-white rounded-2xl flex items-center justify-center mb-6 transform group-hover:scale-110 transition-transform shadow-lg`}>
                  <step.icon className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{step.title}</h3>
                <p className="text-gray-600">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Calculator Section */}
      <section className="py-24 bg-gray-900 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <span className="text-pink-500 font-bold tracking-wider uppercase text-sm mb-2 block">Financial Aid</span>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Scholarships & Fee Waivers</h2>
              <p className="text-gray-400 text-lg mb-8 leading-relaxed">
                We are committed to making quality education accessible. We offer substantial merit-based scholarships for outstanding students, alongside government-mandated waivers for SC/ST and OBC categories.
              </p>
              <ul className="space-y-4 mb-8">
                <li className="flex items-center text-gray-300">
                  <CheckCircle className="h-5 w-5 text-emerald-500 mr-3" /> SC/ST candidates are eligible for up to 50% tuition waiver.
                </li>
                <li className="flex items-center text-gray-300">
                  <CheckCircle className="h-5 w-5 text-emerald-500 mr-3" /> OBC candidates receive a 25% tuition waiver.
                </li>
                <li className="flex items-center text-gray-300">
                  <CheckCircle className="h-5 w-5 text-pink-500 mr-3" /> Merit scholarships up to ₹20,000 for top scorers (&gt;95%).
                </li>
              </ul>
            </div>
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
            >
              <ScholarshipCalculator />
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}
