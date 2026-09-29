import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { BookOpen, Code, Database, Globe, Lightbulb, Users, Monitor, Award, ChevronRight } from 'lucide-react';

const syllabusData = [
  {
    semester: 1,
    title: "Semester I",
    core: ['Programming in C', 'Computer Fundamentals & Office Automation', 'Digital Electronics', 'Mathematics - I'],
    labs: ['C Programming Lab', 'IT Foundation Lab'],
    electives: ['Communication Skills', 'Indian Constitution']
  },
  {
    semester: 2,
    title: "Semester II",
    core: ['Data Structures using C', 'Object Oriented Programming with C++', 'Discrete Mathematical Structures', 'Mathematics - II'],
    labs: ['Data Structures Lab', 'C++ Programming Lab'],
    electives: ['Environmental Studies']
  },
  {
    semester: 3,
    title: "Semester III",
    core: ['Database Management Systems', 'Operating Systems', 'Software Engineering', 'Computer Architecture'],
    labs: ['DBMS Lab', 'UNIX / Linux Lab'],
    electives: ['Quantitative Aptitude', 'Open Elective - I']
  },
  {
    semester: 4,
    title: "Semester IV",
    core: ['Java Programming', 'Computer Networks', 'Design and Analysis of Algorithms', 'Microprocessors'],
    labs: ['Java Programming Lab', 'Algorithms Lab'],
    electives: ['Open Elective - II']
  },
  {
    semester: 5,
    title: "Semester V",
    core: ['Web Technology', 'Python Programming', 'Cloud Computing'],
    labs: ['Web Technology Lab', 'Python Programming Lab'],
    electives: ['Artificial Intelligence', 'Data Mining', 'Cryptography']
  },
  {
    semester: 6,
    title: "Semester VI",
    core: ['Mobile Application Development', 'Cyber Security & Cyber Laws'],
    labs: ['Mobile App Development Lab', 'Major Project Work'],
    electives: ['Internet of Things', 'Machine Learning', 'Big Data Analytics']
  }
];

export default function AcademicsPage() {
  const [activeTab, setActiveTab] = useState(1);

  return (
    <div className="flex flex-col min-h-screen dark:bg-gray-950">
      {/* Header */}
      <section className="bg-gradient-to-br from-indigo-900 to-purple-900 text-white pt-32 pb-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&q=80&w=2000')] bg-cover bg-center opacity-10"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} 
            className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-6 tracking-tight"
          >
            Academics at Sharnbasva
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="text-xl text-purple-200 max-w-3xl mx-auto leading-relaxed"
          >
            Our BCA Co-Education program offers a rigorous, industry-aligned curriculum designed to transform students into innovative technology professionals.
          </motion.p>
        </div>
      </section>

      {/* Curriculum Overview */}
      <section className="py-24 bg-white dark:bg-gray-950 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-purple-600 dark:text-purple-400 font-bold tracking-wider uppercase text-sm mb-2 block">The Program</span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">BCA Curriculum Outline</h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { title: 'Programming Fundamentals', desc: 'Deep dive into C, C++, and Java to build a strong logic foundation.', icon: Code, color: 'text-blue-600', bg: 'bg-blue-50 dark:bg-blue-900/20' },
              { title: 'Data Structures', desc: 'Learn to organize and manage data efficiently using advanced algorithms.', icon: Database, color: 'text-emerald-600', bg: 'bg-emerald-50 dark:bg-emerald-900/20' },
              { title: 'Web Development', desc: 'Master Full-Stack web technologies including React, Node.js, and databases.', icon: Globe, color: 'text-pink-600', bg: 'bg-pink-50 dark:bg-pink-900/20' },
              { title: 'Software Engineering', desc: 'Understand the software development lifecycle and agile methodologies.', icon: Lightbulb, color: 'text-amber-600', bg: 'bg-amber-50 dark:bg-amber-900/20' },
              { title: 'Computer Networks', desc: 'Explore the architecture of the internet and network security protocols.', icon: Monitor, color: 'text-indigo-600', bg: 'bg-indigo-50 dark:bg-indigo-900/20' },
              { title: 'AI & Machine Learning', desc: 'Introduction to neural networks, data modeling, and predictive analytics.', icon: BookOpen, color: 'text-purple-600', bg: 'bg-purple-50 dark:bg-purple-900/20' }
            ].map((module, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 p-8 rounded-3xl shadow-lg hover:shadow-xl transition-shadow"
              >
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 ${module.bg}`}>
                  <module.icon className={`h-7 w-7 ${module.color}`} />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">{module.title}</h3>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">{module.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Detailed Syllabus - Tabbed View */}
      <section className="py-24 bg-gray-50 dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">Detailed BCA Syllabus</h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">Explore the comprehensive semester-by-semester breakdown of core subjects, practical labs, and elective choices.</p>
          </div>

          <div className="bg-white dark:bg-gray-950 rounded-3xl shadow-xl overflow-hidden border border-gray-200 dark:border-gray-800 flex flex-col md:flex-row min-h-[500px]">
            {/* Sidebar Tabs */}
            <div className="w-full md:w-64 bg-gray-50 dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 flex flex-row md:flex-col overflow-x-auto md:overflow-x-visible">
              {syllabusData.map((tab) => (
                <button
                  key={tab.semester}
                  onClick={() => setActiveTab(tab.semester)}
                  className={`flex-shrink-0 flex items-center justify-between px-6 py-5 text-left font-bold transition-colors whitespace-nowrap md:whitespace-normal border-b md:border-b-0 border-r md:border-r-0 border-gray-200 dark:border-gray-800 ${
                    activeTab === tab.semester
                      ? 'bg-white dark:bg-gray-950 text-purple-700 dark:text-purple-400 border-l-4 md:border-l-purple-600 md:border-b-purple-600 border-b-4 md:border-b-0'
                      : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 border-l-4 border-transparent'
                  }`}
                >
                  <span>{tab.title}</span>
                  <ChevronRight className={`hidden md:block h-5 w-5 ${activeTab === tab.semester ? 'opacity-100' : 'opacity-0'}`} />
                </button>
              ))}
            </div>

            {/* Tab Content */}
            <div className="flex-1 p-8 md:p-12 relative overflow-y-auto">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.2 }}
                >
                  {syllabusData.map((data) => data.semester === activeTab && (
                    <div key={data.semester}>
                      <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-8 border-b border-gray-100 dark:border-gray-800 pb-4">{data.title} Curriculum</h3>
                      
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                        {/* Core Subjects */}
                        <div>
                          <div className="flex items-center gap-3 mb-4">
                            <div className="bg-indigo-100 dark:bg-indigo-900/30 p-2 rounded-lg text-indigo-600 dark:text-indigo-400">
                              <BookOpen className="h-5 w-5" />
                            </div>
                            <h4 className="text-xl font-bold text-gray-900 dark:text-white">Core Subjects</h4>
                          </div>
                          <ul className="space-y-3 pl-12">
                            {data.core.map((subject, idx) => (
                              <li key={idx} className="text-gray-700 dark:text-gray-300 relative before:content-[''] before:absolute before:-left-6 before:top-2.5 before:w-2 before:h-2 before:bg-indigo-400 before:rounded-full">
                                {subject}
                              </li>
                            ))}
                          </ul>
                        </div>

                        <div className="space-y-10">
                          {/* Practical Labs */}
                          <div>
                            <div className="flex items-center gap-3 mb-4">
                              <div className="bg-emerald-100 dark:bg-emerald-900/30 p-2 rounded-lg text-emerald-600 dark:text-emerald-400">
                                <Monitor className="h-5 w-5" />
                              </div>
                              <h4 className="text-xl font-bold text-gray-900 dark:text-white">Practical Labs</h4>
                            </div>
                            <ul className="space-y-3 pl-12">
                              {data.labs.map((lab, idx) => (
                                <li key={idx} className="text-gray-700 dark:text-gray-300 relative before:content-[''] before:absolute before:-left-6 before:top-2.5 before:w-2 before:h-2 before:bg-emerald-400 before:rounded-full">
                                  {lab}
                                </li>
                              ))}
                            </ul>
                          </div>

                          {/* Electives */}
                          <div>
                            <div className="flex items-center gap-3 mb-4">
                              <div className="bg-amber-100 dark:bg-amber-900/30 p-2 rounded-lg text-amber-600 dark:text-amber-400">
                                <Lightbulb className="h-5 w-5" />
                              </div>
                              <h4 className="text-xl font-bold text-gray-900 dark:text-white">Electives & Open Choices</h4>
                            </div>
                            <ul className="space-y-3 pl-12">
                              {data.electives.map((elective, idx) => (
                                <li key={idx} className="text-gray-700 dark:text-gray-300 relative before:content-[''] before:absolute before:-left-6 before:top-2.5 before:w-2 before:h-2 before:bg-amber-400 before:rounded-full">
                                  {elective}
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </section>

      {/* Facilities & Faculty */}
      <section className="py-24 bg-white dark:bg-gray-950 border-t border-gray-100 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-6">World-Class Infrastructure</h2>
              <p className="text-gray-600 dark:text-gray-400 text-lg mb-8 leading-relaxed">
                We believe that a conducive environment is crucial for effective learning. Our campus is equipped with state-of-the-art facilities that empower our students to excel.
              </p>
              <ul className="space-y-6">
                {[
                  { title: 'Advanced Computer Labs', desc: 'High-performance workstations with the latest software and high-speed internet.' },
                  { title: 'Digital Library', desc: 'Access to thousands of e-books, journals, and research papers from IEEE and ACM.' },
                  { title: 'Smart Classrooms', desc: 'Interactive digital boards and multimedia projection systems for immersive learning.' }
                ].map((item, idx) => (
                  <li key={idx} className="flex gap-4">
                    <div className="bg-purple-100 dark:bg-purple-900/30 p-2 rounded-full h-fit mt-1">
                      <Award className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900 dark:text-white">{item.title}</h4>
                      <p className="text-gray-600 dark:text-gray-400">{item.desc}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="absolute inset-0 bg-gradient-to-tr from-purple-500 to-pink-500 rounded-3xl translate-x-4 translate-y-4 -z-10 opacity-30 blur-lg"></div>
              <img 
                src="https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&q=80&w=1200" 
                alt="Computer Lab" 
                className="rounded-3xl shadow-2xl border-4 border-white dark:border-gray-800 object-cover aspect-[4/3]"
              />
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}
