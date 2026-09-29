import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { GraduationCap, Menu, X, LogOut, User as UserIcon, Bell, Search, Sun, Moon } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function Navbar() {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) setScrolled(true);
      else setScrolled(false);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const navLinks = [
    { name: 'Academics', path: '/academics' },
    { name: 'Admissions', path: '/admissions' },
    { name: 'Campus Life', path: '/campus-life' },
  ];

  return (
    <motion.nav 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 100, damping: 20 }}
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${scrolled ? 'bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl shadow-lg border-b border-purple-100/50 dark:border-gray-800 py-2' : 'bg-transparent py-4'}`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-14">
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-3 group">
              <motion.div 
                whileHover={{ rotate: 180, scale: 1.1 }} 
                transition={{ type: "spring", stiffness: 200, damping: 10 }}
                className="bg-gradient-to-br from-purple-600 to-pink-500 p-2 rounded-xl shadow-lg shadow-purple-500/30"
              >
                <GraduationCap className="h-6 w-6 text-white" />
              </motion.div>
              <div>
                <span className={`font-extrabold text-xl bg-clip-text text-transparent bg-gradient-to-r from-purple-700 to-pink-600 block leading-none transition-colors ${!scrolled && window.location.pathname === '/' ? 'text-white drop-shadow-md' : 'dark:text-white'}`}>Sharnbasva</span>
                <span className={`text-[10px] font-bold tracking-widest uppercase transition-colors ${!scrolled && window.location.pathname === '/' ? 'text-pink-300' : 'text-purple-500'}`}>University</span>
              </div>
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex md:items-center md:space-x-1">
            {!user ? (
              <>
                {navLinks.map((link) => (
                  <motion.div key={link.name} whileHover={{ y: -2 }}>
                    <Link to={link.path} className={`px-4 py-2 rounded-full font-bold transition-all text-sm ${!scrolled && window.location.pathname === '/' ? 'text-white/90 hover:text-white hover:bg-white/10' : 'text-gray-600 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 hover:bg-purple-50 dark:hover:bg-gray-800'}`}>
                      {link.name}
                    </Link>
                  </motion.div>
                ))}

                <div className={`w-px h-6 mx-2 ${!scrolled && window.location.pathname === '/' ? 'bg-white/20' : 'bg-gray-200 dark:bg-gray-700'}`}></div>

                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="mr-2">
                  <button className={`p-2 rounded-full transition-colors ${!scrolled && window.location.pathname === '/' ? 'text-white hover:bg-white/20' : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-purple-600 dark:hover:text-purple-400'}`}>
                    <Search className="h-5 w-5" />
                  </button>
                </motion.div>

                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="mr-4">
                  <button onClick={toggleTheme} className={`p-2 rounded-full transition-colors ${!scrolled && window.location.pathname === '/' ? 'text-white hover:bg-white/20' : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-purple-600 dark:hover:text-purple-400'}`}>
                    {theme === 'light' ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
                  </button>
                </motion.div>

                <Link to="/login" className={`font-bold transition-colors mr-6 ${!scrolled && window.location.pathname === '/' ? 'text-white hover:text-pink-300' : 'text-gray-600 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400'}`}>
                  Login
                </Link>
                
                <motion.div whileHover={{ scale: 1.05, boxShadow: "0 10px 25px -5px rgba(217, 70, 239, 0.4)" }} whileTap={{ scale: 0.95 }}>
                  <Link to="/register" className="relative group overflow-hidden bg-gradient-to-r from-purple-600 to-pink-500 text-white px-6 py-2.5 rounded-full font-bold shadow-lg shadow-purple-500/30 transition-all flex items-center gap-2">
                    <span className="relative z-10">Apply Now</span>
                    <div className="absolute inset-0 h-full w-full bg-gradient-to-r from-pink-500 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-0"></div>
                  </Link>
                </motion.div>
              </>
            ) : (
              <>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="mr-2 relative">
                  <button onClick={toggleTheme} className="p-2 rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-purple-600 transition-colors">
                    {theme === 'light' ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
                  </button>
                </motion.div>

                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="mr-2 relative">
                  <button className="p-2 rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-purple-600 transition-colors">
                    <Bell className="h-5 w-5" />
                    <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-pink-500 rounded-full border-2 border-white"></span>
                  </button>
                </motion.div>

                <motion.div whileHover={{ y: -2 }}>
                  <Link to={`/${user.role}/dashboard`} className="px-4 py-2 rounded-full text-gray-700 dark:text-gray-200 hover:text-purple-700 dark:hover:text-purple-400 hover:bg-purple-50 dark:hover:bg-gray-800 font-bold flex items-center gap-2 transition-all">
                    <div className="bg-purple-100 dark:bg-purple-900/30 p-1.5 rounded-full">
                      <UserIcon className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                    </div>
                    Dashboard
                  </Link>
                </motion.div>

                <div className="w-px h-6 mx-2 bg-gray-200 dark:bg-gray-700"></div>

                <motion.div whileHover={{ y: -2 }}>
                  <button onClick={handleLogout} className="px-4 py-2 rounded-full text-red-500 dark:text-red-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 font-bold flex items-center gap-2 transition-all">
                    <LogOut className="h-4 w-4" />
                    Logout
                  </button>
                </motion.div>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center gap-4 md:hidden">
            {user && (
              <button className="relative p-2 text-gray-600 dark:text-gray-300 hover:text-purple-600">
                <Bell className="h-5 w-5" />
                <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-pink-500 rounded-full border-2 border-white"></span>
              </button>
            )}
            <motion.button 
              whileTap={{ scale: 0.9 }}
              onClick={() => setIsOpen(!isOpen)} 
              className={`p-2 rounded-xl focus:outline-none transition-colors ${(!scrolled && window.location.pathname === '/') && !isOpen ? 'text-white hover:bg-white/20' : 'text-gray-600 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 hover:bg-purple-50 dark:hover:bg-gray-800'}`}
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </motion.button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, height: 0, y: -20 }}
            animate={{ opacity: 1, height: 'auto', y: 0 }}
            exit={{ opacity: 0, height: 0, y: -20 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="md:hidden absolute top-full left-0 w-full bg-white/95 dark:bg-gray-900/95 backdrop-blur-2xl border-b border-purple-100 dark:border-gray-800 shadow-2xl overflow-hidden"
          >
            <div className="px-6 py-6 space-y-4">
              {!user ? (
                <>
                  <div className="grid grid-cols-2 gap-4 pb-4 border-b border-gray-100 dark:border-gray-800">
                    {navLinks.map((link) => (
                      <Link key={link.name} onClick={() => setIsOpen(false)} to={link.path} className="flex items-center text-sm font-bold text-gray-700 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 transition-colors">
                        {link.name}
                      </Link>
                    ))}
                  </div>
                  <div className="flex items-center gap-4 py-2">
                    <button onClick={toggleTheme} className="p-2 bg-gray-50 dark:bg-gray-800 rounded-lg text-gray-600 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400">
                      {theme === 'light' ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
                    </button>
                    <button className="p-2 bg-gray-50 dark:bg-gray-800 rounded-lg text-gray-600 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400">
                      <Search className="h-5 w-5" />
                    </button>
                  </div>
                  <div className="pt-2 flex flex-col gap-3">
                    <Link onClick={() => setIsOpen(false)} to="/login" className="w-full py-3 text-center rounded-xl text-base font-bold text-gray-700 dark:text-gray-200 bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-purple-600 dark:hover:text-purple-400 transition-all">Login</Link>
                    <Link onClick={() => setIsOpen(false)} to="/register" className="w-full py-3 text-center rounded-xl text-base font-bold text-white bg-gradient-to-r from-purple-600 to-pink-500 shadow-lg shadow-purple-500/20 active:scale-95 transition-transform">Apply Now</Link>
                  </div>
                </>
              ) : (
                <>
                  <div className="flex items-center justify-between pb-4 border-b border-gray-100 dark:border-gray-800">
                    <button onClick={toggleTheme} className="p-2 bg-gray-50 dark:bg-gray-800 rounded-lg text-gray-600 dark:text-gray-300 hover:text-purple-600">
                      {theme === 'light' ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
                    </button>
                  </div>
                  <Link onClick={() => setIsOpen(false)} to={`/${user.role}/dashboard`} className="flex items-center gap-3 p-4 rounded-xl text-base font-bold text-purple-700 dark:text-purple-400 bg-purple-50 dark:bg-purple-900/20 hover:bg-purple-100 dark:hover:bg-purple-900/40 transition-colors">
                    <UserIcon className="h-5 w-5" />
                    Dashboard
                  </Link>
                  <button onClick={() => { handleLogout(); setIsOpen(false); }} className="w-full flex items-center gap-3 p-4 rounded-xl text-base font-bold text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/40 transition-colors">
                    <LogOut className="h-5 w-5" />
                    Logout
                  </button>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
