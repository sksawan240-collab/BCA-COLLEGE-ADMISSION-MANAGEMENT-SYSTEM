import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router';
import { GraduationCap, BookOpen, CheckCircle, Clock, FileText, UserPlus, Upload, CalendarDays, FileCheck, PenTool, Flag, Code, Database, Globe, Briefcase, Award, ChevronDown } from 'lucide-react';
import axios from 'axios';

export default function LandingPage() {
  const [marks, setMarks] = useState('');
  const [category, setCategory] = useState('');
  const [eligibilityResult, setEligibilityResult] = useState<{ status: 'success' | 'error' | null, message: string }>({ status: null, message: '' });
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  
  const [config, setConfig] = useState<any>({
    academicYear: '2024-2025',
    admissionOpen: true,
    eligibilityCriteria: 'Passed PUC/12th Standard or equivalent examination.'
  });

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const res = await axios.get('/api/config');
        if (res.data) setConfig(res.data);
      } catch (err) {
        console.error('Error fetching config:', err);
      }
    };
    fetchConfig();
  }, []);

  const faqs = [
    {
      question: "What is the fee structure for the BCA program?",
      answer: "The total tuition fee for the BCA program is ₹45,000 per year. Additional university fees and examination fees apply as per university norms. You can pay online via our admission portal once your application is verified."
    },
    {
      question: "Are there any scholarship programs available?",
      answer: "Yes, Sharnbasva University offers merit-based scholarships for students securing above 85% in their qualifying exams. We also fully support government scholarship schemes for SC/ST/OBC categories."
    },
    {
      question: "Does the university provide transport facilities?",
      answer: "Yes, we have a comprehensive fleet of buses covering all major routes within Kalaburagi and nearby towns. Transport passes can be availed at the time of final admission."
    },
    {
      question: "Are hostel facilities available for students?",
      answer: "Yes, separate hostel facilities for boys and girls are available on campus with modern amenities, Wi-Fi, and 24/7 security."
    }
  ];

  const checkEligibility = (e: React.FormEvent) => {
    e.preventDefault();
    const marksNum = parseFloat(marks);
    if (isNaN(marksNum)) {
      setEligibilityResult({ status: 'error', message: 'Please enter a valid marks percentage.' });
      return;
    }
    if (!category) {
      setEligibilityResult({ status: 'error', message: 'Please select a category.' });
      return;
    }

    const requiredMarks = category === 'General' ? 45 : 40;
    if (marksNum >= requiredMarks) {
      setEligibilityResult({ status: 'success', message: `Congratulations! With ${marksNum}%, you meet the minimum eligibility criteria for BCA admission.` });
    } else {
      setEligibilityResult({ status: 'error', message: `Sorry, you need at least ${requiredMarks}% in your category to be eligible.` });
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-indigo-900 via-fuchsia-900 to-blue-900 text-white py-20 lg:py-40 overflow-hidden">
        {/* Animated Orbs */}
        <motion.div 
          animate={{ y: [0, -50, 0], x: [0, 30, 0], scale: [1, 1.1, 1] }} 
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }} 
          className="absolute -top-20 -right-20 w-[40rem] h-[40rem] bg-pink-500/30 rounded-full blur-[100px] mix-blend-screen"
        />
        <motion.div 
          animate={{ y: [0, 40, 0], x: [0, -40, 0], scale: [1, 1.2, 1] }} 
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut", delay: 2 }} 
          className="absolute -bottom-20 -left-20 w-[40rem] h-[40rem] bg-blue-500/30 rounded-full blur-[100px] mix-blend-screen"
        />
        <motion.div 
          animate={{ y: [0, 20, 0], x: [0, 50, 0], scale: [1, 1.3, 1] }} 
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }} 
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[30rem] h-[30rem] bg-purple-500/20 rounded-full blur-[100px] mix-blend-screen"
        />
        
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&q=80&w=2000')] bg-cover bg-center opacity-10 mix-blend-overlay"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-3xl">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/30 border border-blue-400/30 text-blue-100 text-sm font-medium mb-6">
                <GraduationCap className="h-4 w-4" />
                {config.admissionOpen ? `Admissions Open ${config.academicYear}` : `Admissions Closed for ${config.academicYear}`}
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight mb-6 leading-tight">
                Sharnbasva University
              </h1>
              <h2 className="text-2xl md:text-3xl font-semibold text-blue-200 mb-6">
                BCA Co-Education Admission Portal
              </h2>
              <p className="text-lg text-blue-100 mb-10 max-w-2xl leading-relaxed">
                Shape your future with our Bachelor of Computer Applications program. Apply online through our streamlined, secure, and fully digital admission process.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                {config.admissionOpen ? (
                  <Link to="/register">
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="px-8 py-4 bg-gradient-to-r from-pink-500 to-rose-500 text-white font-bold rounded-full hover:shadow-[0_0_20px_rgba(236,72,153,0.5)] transition-all text-center">
                      Apply Now
                    </motion.div>
                  </Link>
                ) : (
                  <div className="px-8 py-4 bg-gray-500/50 text-white font-bold rounded-full text-center cursor-not-allowed border border-gray-400/30">
                    Registration Closed
                  </div>
                )}
                <Link to="/login">
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="px-8 py-4 bg-white/10 backdrop-blur-md border-2 border-white/30 text-white font-bold rounded-full hover:bg-white/20 transition-all text-center">
                    Student Login
                  </motion.div>
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* BCA Program Overview Section */}
      <section className="py-24 bg-gradient-to-b from-gray-50 to-white border-b border-gray-100 relative overflow-hidden">
        {/* Background decorative circles */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-100/50 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-100/50 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 30 }} 
            whileInView={{ opacity: 1, y: 0 }} 
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <span className="text-pink-600 font-bold tracking-wider uppercase text-sm mb-2 block">Why Choose Us</span>
            <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-6 bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-pink-500">Program Overview</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">The BCA Co-Education program is designed to bridge the gap between academic theory and industry demands, preparing you for a successful career in tech.</p>
          </motion.div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {/* Core Subjects */}
            <motion.div 
              whileHover={{ y: -10 }}
              initial={{ opacity: 0, y: 30 }} 
              whileInView={{ opacity: 1, y: 0 }} 
              viewport={{ once: true }} 
              transition={{ delay: 0.1, type: "spring", stiffness: 100 }} 
              className="bg-white p-8 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-50 relative overflow-hidden group"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-500/10 to-indigo-500/10 rounded-bl-[100px] -z-10 transition-transform group-hover:scale-110"></div>
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 text-white rounded-2xl flex items-center justify-center mb-8 shadow-lg shadow-blue-500/30 transform group-hover:rotate-6 transition-transform">
                <Code className="h-8 w-8" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Core Curriculum</h3>
              <ul className="space-y-3">
                <li className="flex items-center text-gray-600"><CheckCircle className="h-4 w-4 text-blue-500 mr-2" /> Data Structures & Algorithms</li>
                <li className="flex items-center text-gray-600"><CheckCircle className="h-4 w-4 text-blue-500 mr-2" /> Database Management Systems</li>
                <li className="flex items-center text-gray-600"><CheckCircle className="h-4 w-4 text-blue-500 mr-2" /> Full-Stack Web Development</li>
                <li className="flex items-center text-gray-600"><CheckCircle className="h-4 w-4 text-blue-500 mr-2" /> Artificial Intelligence Basics</li>
                <li className="flex items-center text-gray-600"><CheckCircle className="h-4 w-4 text-blue-500 mr-2" /> Software Engineering</li>
              </ul>
            </motion.div>

            {/* Faculty & Infrastructure */}
            <motion.div 
              whileHover={{ y: -10 }}
              initial={{ opacity: 0, y: 30 }} 
              whileInView={{ opacity: 1, y: 0 }} 
              viewport={{ once: true }} 
              transition={{ delay: 0.2, type: "spring", stiffness: 100 }} 
              className="bg-white p-8 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-50 relative overflow-hidden group"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-pink-500/10 to-rose-500/10 rounded-bl-[100px] -z-10 transition-transform group-hover:scale-110"></div>
              <div className="w-16 h-16 bg-gradient-to-br from-pink-500 to-rose-600 text-white rounded-2xl flex items-center justify-center mb-8 shadow-lg shadow-pink-500/30 transform group-hover:rotate-6 transition-transform">
                <Award className="h-8 w-8" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Academic Excellence</h3>
              <ul className="space-y-3">
                <li className="flex items-center text-gray-600"><CheckCircle className="h-4 w-4 text-blue-500 mr-2" /> PhD Holding Senior Faculty</li>
                <li className="flex items-center text-gray-600"><CheckCircle className="h-4 w-4 text-blue-500 mr-2" /> Modern Computer Labs</li>
                <li className="flex items-center text-gray-600"><CheckCircle className="h-4 w-4 text-blue-500 mr-2" /> Industry Expert Guest Lectures</li>
                <li className="flex items-center text-gray-600"><CheckCircle className="h-4 w-4 text-blue-500 mr-2" /> Regular Hackathons & Events</li>
                <li className="flex items-center text-gray-600"><CheckCircle className="h-4 w-4 text-blue-500 mr-2" /> Comprehensive Digital Library</li>
              </ul>
            </motion.div>

            {/* Career Opportunities */}
            <motion.div 
              whileHover={{ y: -10 }}
              initial={{ opacity: 0, y: 30 }} 
              whileInView={{ opacity: 1, y: 0 }} 
              viewport={{ once: true }} 
              transition={{ delay: 0.3, type: "spring", stiffness: 100 }} 
              className="bg-white p-8 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-50 relative overflow-hidden group"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-amber-500/10 to-orange-500/10 rounded-bl-[100px] -z-10 transition-transform group-hover:scale-110"></div>
              <div className="w-16 h-16 bg-gradient-to-br from-amber-500 to-orange-600 text-white rounded-2xl flex items-center justify-center mb-8 shadow-lg shadow-amber-500/30 transform group-hover:rotate-6 transition-transform">
                <Briefcase className="h-8 w-8" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Career Prospects</h3>
              <ul className="space-y-3">
                <li className="flex items-center text-gray-600"><CheckCircle className="h-4 w-4 text-blue-500 mr-2" /> Software Developer / Engineer</li>
                <li className="flex items-center text-gray-600"><CheckCircle className="h-4 w-4 text-blue-500 mr-2" /> System Analyst</li>
                <li className="flex items-center text-gray-600"><CheckCircle className="h-4 w-4 text-blue-500 mr-2" /> Database Administrator</li>
                <li className="flex items-center text-gray-600"><CheckCircle className="h-4 w-4 text-blue-500 mr-2" /> Network Engineer</li>
                <li className="flex items-center text-gray-600"><CheckCircle className="h-4 w-4 text-blue-500 mr-2" /> Dedicated Campus Placement Cell</li>
              </ul>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-24 bg-indigo-900 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=2000')] bg-cover bg-center opacity-5 mix-blend-overlay"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 30 }} 
            whileInView={{ opacity: 1, y: 0 }} 
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <span className="text-indigo-400 font-bold tracking-wider uppercase text-sm mb-2 block">Simple Steps</span>
            <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-6">Admission Process</h2>
            <p className="text-xl text-indigo-200 max-w-2xl mx-auto">Follow these simple steps to complete your application for the BCA Co-Education program.</p>
          </motion.div>
          
          <div className="grid md:grid-cols-4 gap-8">
            {[
              { icon: UserPlus, title: 'Register', desc: 'Create an account and verify your email via OTP.', color: 'from-pink-500 to-rose-500' },
              { icon: FileText, title: 'Fill Form', desc: 'Provide personal and academic details. Save drafts.', color: 'from-purple-500 to-indigo-500' },
              { icon: Upload, title: 'Upload Docs', desc: 'Upload required marksheets and identity proofs.', color: 'from-blue-500 to-cyan-500' },
              { icon: CheckCircle, title: 'Submit', desc: 'Verify via OTP and submit for admin review.', color: 'from-emerald-500 to-teal-500' }
            ].map((step, idx) => (
              <motion.div 
                key={idx} 
                initial={{ opacity: 0, y: 30 }} 
                whileInView={{ opacity: 1, y: 0 }} 
                viewport={{ once: true }} 
                transition={{ delay: idx * 0.15, type: "spring" }} 
                whileHover={{ y: -10 }}
                className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 text-center border border-white/20 shadow-xl hover:bg-white/20 transition-all group"
              >
                <div className={`w-20 h-20 mx-auto bg-gradient-to-br ${step.color} text-white rounded-full flex items-center justify-center mb-6 shadow-lg transform group-hover:scale-110 transition-transform`}>
                  <step.icon className="h-10 w-10" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-3">{step.title}</h3>
                <p className="text-indigo-200">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Admission Timeline Section */}
      <section className="py-24 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 border-t border-purple-100 relative overflow-hidden">
        {/* Animated Background */}
        <motion.div 
          animate={{ scale: [1, 1.2, 1], rotate: [0, 90, 0] }} 
          transition={{ repeat: Infinity, duration: 15, ease: "linear" }} 
          className="absolute top-0 right-0 w-96 h-96 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 translate-x-1/3 -translate-y-1/3" 
        />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16">
            <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-3xl md:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 mb-4">Admission Timeline 2026</motion.h2>
            <motion.p initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }} className="text-gray-600 max-w-2xl mx-auto text-lg font-medium">Stay on track with these important dates for the upcoming academic session.</motion.p>
          </div>
          
          <div className="max-w-4xl mx-auto">
            <div className="relative border-l-4 border-purple-200 ml-6 md:ml-0 md:border-l-0">
              {/* Vertical line for desktop */}
              <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-1 bg-gradient-to-b from-purple-200 via-pink-200 to-blue-200 -translate-x-1/2"></div>
              
              {[
                { date: 'May 15, 2026', title: 'Application Portal Opens', desc: 'Online registration and application submission begins.', icon: CalendarDays, color: 'text-purple-600', bg: 'bg-purple-100' },
                { date: 'June 30, 2026', title: 'Application Deadline', desc: 'Last date to submit the online application without late fees.', icon: Clock, color: 'text-pink-600', bg: 'bg-pink-100' },
                { date: 'July 10, 2026', title: 'Document Verification', desc: 'Offline/Online verification of uploaded marks cards and certificates.', icon: FileCheck, color: 'text-blue-600', bg: 'bg-blue-100' },
                { date: 'July 25, 2026', title: 'Entrance / Merit List', desc: 'Publication of the first merit list based on qualifying exam scores.', icon: PenTool, color: 'text-emerald-600', bg: 'bg-emerald-100' },
                { date: 'August 10, 2026', title: 'Classes Commence', desc: 'Orientation program and start of the first semester classes.', icon: Flag, color: 'text-amber-600', bg: 'bg-amber-100' }
              ].map((item, idx) => (
                <div key={idx} className={`relative flex items-center justify-between md:justify-normal mb-12 last:mb-0 ${idx % 2 === 0 ? 'md:flex-row-reverse' : ''}`}>
                  {/* Timeline dot */}
                  <div className={`absolute left-[-34px] md:left-1/2 w-12 h-12 rounded-full bg-white border-4 ${item.bg.replace('bg-', 'border-')} ${item.color} flex items-center justify-center md:-translate-x-1/2 shadow-lg z-10`}>
                    <item.icon className="h-5 w-5" />
                  </div>
                  
                  {/* Content Box */}
                  <motion.div 
                    initial={{ opacity: 0, x: idx % 2 === 0 ? 30 : -30 }} 
                    whileInView={{ opacity: 1, x: 0 }} 
                    viewport={{ once: true }}
                    whileHover={{ y: -5, scale: 1.02 }}
                    className={`ml-10 md:ml-0 w-full md:w-[45%] bg-white p-6 rounded-2xl border border-gray-100 shadow-xl shadow-purple-900/5`}
                  >
                    <span className={`inline-block px-4 py-1.5 ${item.bg} ${item.color} text-sm font-bold rounded-full mb-3`}>
                      {item.date}
                    </span>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{item.title}</h3>
                    <p className="text-gray-600 font-medium">{item.desc}</p>
                  </motion.div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Requirements Section */}
      <section className="py-24 bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 relative overflow-hidden">
        {/* Animated Background */}
        <motion.div 
          animate={{ scale: [1, 1.5, 1], y: [0, 50, 0] }} 
          transition={{ repeat: Infinity, duration: 12, ease: "easeInOut" }} 
          className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-500 rounded-full mix-blend-multiply filter blur-[120px] opacity-20 -translate-x-1/3 translate-y-1/3" 
        />
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-2 gap-16">
            <div>
              <motion.h2 initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="text-3xl md:text-4xl font-extrabold text-white mb-8">Eligibility Criteria</motion.h2>
              <ul className="space-y-6 mb-12">
                {[
                  config.eligibilityCriteria || 'Passed PUC/12th Standard or equivalent examination.',
                  'Minimum aggregate of 45% (40% for SC/ST/OBC) in the qualifying exam.',
                  'Mathematics or Computer Science as one of the subjects preferred.',
                  'Admission strictly based on merit and university regulations.'
                ].map((item, i) => (
                  <motion.li initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} key={i} className="flex items-start gap-4">
                    <div className="bg-gradient-to-br from-green-400 to-emerald-500 rounded-full p-1 shrink-0 mt-1 shadow-lg shadow-green-500/30">
                      <CheckCircle className="h-5 w-5 text-white" />
                    </div>
                    <span className="text-white/90 font-medium text-lg leading-relaxed">{item}</span>
                  </motion.li>
                ))}
              </ul>

              {/* Eligibility Checker */}
              <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-6 sm:p-8 relative overflow-hidden">
                <div className="absolute top-0 right-0 -mr-10 -mt-10 w-32 h-32 rounded-full bg-pink-500/20 blur-2xl"></div>
                <h3 className="text-2xl font-extrabold text-white mb-2 tracking-tight">Quick Eligibility Checker</h3>
                <p className="text-white/70 mb-6 font-medium">Enter your details below to instantly check if you meet the minimum academic requirements.</p>
                
                <form onSubmit={checkEligibility} className="space-y-5 relative z-10">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm font-bold text-white/90 mb-2">Previous Degree Marks (%)</label>
                      <input 
                        type="number" 
                        step="0.01"
                        value={marks}
                        onChange={(e) => setMarks(e.target.value)}
                        placeholder="e.g. 65.5" 
                        className="w-full px-4 py-3 bg-white/10 border border-white/20 text-white placeholder-white/40 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition-all outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-white/90 mb-2">Category</label>
                      <select 
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        className="w-full px-4 py-3 bg-white/10 border border-white/20 text-white rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition-all outline-none [&>option]:text-gray-900"
                      >
                        <option value="">Select Category</option>
                        <option value="General">General</option>
                        <option value="SC/ST/OBC">SC/ST/OBC</option>
                      </select>
                    </div>
                  </div>
                  <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} type="submit" className="w-full bg-gradient-to-r from-pink-500 to-rose-500 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-pink-500/25 transition-all">
                    Check Eligibility
                  </motion.button>
                </form>

                {eligibilityResult.status && (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.9 }} 
                    animate={{ opacity: 1, scale: 1 }} 
                    className={`mt-6 p-4 rounded-xl text-sm font-bold shadow-lg ${eligibilityResult.status === 'success' ? 'bg-green-500/20 text-green-100 border border-green-400/30' : 'bg-red-500/20 text-red-100 border border-red-400/30'}`}
                  >
                    {eligibilityResult.message}
                  </motion.div>
                )}
              </motion.div>
            </div>
            
            <div>
              <motion.h2 initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="text-3xl md:text-4xl font-extrabold text-white mb-8">Required Documents</motion.h2>
              <div className="grid gap-4">
                {[
                  'Passport size photograph',
                  'SSLC / 10th Marks Card',
                  'PUC / 12th Marks Card',
                  'Transfer Certificate',
                  'Aadhaar Card'
                ].map((item, i) => (
                  <motion.div 
                    key={i} 
                    initial={{ opacity: 0, x: 20 }} 
                    whileInView={{ opacity: 1, x: 0 }} 
                    viewport={{ once: true }} 
                    transition={{ delay: i * 0.1 }}
                    whileHover={{ scale: 1.02, x: 10 }}
                    className="flex items-center gap-4 bg-white/10 backdrop-blur-sm p-5 rounded-2xl border border-white/10 shadow-xl"
                  >
                    <div className="bg-gradient-to-br from-blue-400 to-indigo-500 p-2.5 rounded-xl shadow-lg shadow-blue-500/30">
                      <FileText className="h-6 w-6 text-white shrink-0" />
                    </div>
                    <span className="text-white font-bold text-lg">{item}</span>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-24 bg-white relative overflow-hidden">
        {/* Animated Background */}
        <motion.div 
          animate={{ scale: [1, 1.3, 1], rotate: [0, -90, 0] }} 
          transition={{ repeat: Infinity, duration: 18, ease: "linear" }} 
          className="absolute top-1/2 -left-40 w-96 h-96 bg-pink-100 rounded-full mix-blend-multiply filter blur-[80px] opacity-60 -translate-y-1/2" 
        />
        <motion.div 
          animate={{ scale: [1, 1.4, 1], rotate: [0, 90, 0] }} 
          transition={{ repeat: Infinity, duration: 22, ease: "linear" }} 
          className="absolute top-1/2 -right-40 w-96 h-96 bg-blue-100 rounded-full mix-blend-multiply filter blur-[80px] opacity-60 -translate-y-1/2" 
        />

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16">
            <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-3xl md:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-pink-600 to-purple-600 mb-4 tracking-tight">Frequently Asked Questions</motion.h2>
            <motion.p initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }} className="text-gray-600 text-lg font-medium">Find answers to common queries regarding admissions, fees, and campus facilities.</motion.p>
          </div>
          
          <div className="space-y-4">
            {faqs.map((faq, idx) => (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                key={idx} 
                className="border border-purple-100 rounded-2xl bg-white/80 backdrop-blur-sm overflow-hidden shadow-lg shadow-purple-900/5 hover:shadow-xl transition-shadow"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                  className="w-full px-6 py-5 text-left flex justify-between items-center focus:outline-none hover:bg-purple-50 transition-colors"
                >
                  <span className="font-bold text-gray-900 pr-4 text-lg">{faq.question}</span>
                  <div className={`p-2 rounded-full transition-colors ${openFaq === idx ? 'bg-purple-600 text-white' : 'bg-purple-100 text-purple-600'}`}>
                    <ChevronDown className={`h-5 w-5 shrink-0 transition-transform duration-300 ${openFaq === idx ? 'rotate-180' : ''}`} />
                  </div>
                </button>
                <motion.div
                  initial={false}
                  animate={{ height: openFaq === idx ? 'auto' : 0, opacity: openFaq === idx ? 1 : 0 }}
                  className="overflow-hidden"
                >
                  <div className="px-6 pb-6 pt-2 text-gray-600 font-medium leading-relaxed">
                    {faq.answer}
                  </div>
                </motion.div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
