import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar: React.FC = () => {
 const [isOpen, setIsOpen] = useState(false);

 return (
 <nav className="fixed w-full z-50 bg-neutral-950 border-b border-neutral-800">
 <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
 <div className="flex items-center justify-between h-16">
 <div className="flex items-center">
 <Link to="/" className="flex items-center space-x-2">
 <ShieldCheck className="w-8 h-8 text-yellow-400" />
 <span className="text-xl font-bold bg-gradient-to-r from-yellow-400 to-amber-500 bg-clip-text text-transparent">
 DeepDetect AI
 </span>
 </Link>
 </div>

 <div className="hidden md:block">
 <div className="ml-10 flex items-baseline space-x-4">
 <Link to="/" className="text-gray-300 hover:text-white px-3 py-2 rounded-md font-medium transition-colors">Home</Link>
 <Link to="/dashboard" className="text-gray-300 hover:text-white px-3 py-2 rounded-md font-medium transition-colors">Dashboard</Link>
 <Link to="/about" className="text-gray-300 hover:text-white px-3 py-2 rounded-md font-medium transition-colors">About</Link>
 <Link to="/login" className="bg-yellow-600 hover:bg-yellow-500 text-white px-4 py-2 rounded-full font-medium transition-all shadow-lg shadow-yellow-500/20">
 Get Started
 </Link>
 </div>
 </div>

 <div className="md:hidden">
 <button
 onClick={() => setIsOpen(!isOpen)}
 className="text-gray-300 hover:text-white p-2"
 >
 {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
 </button>
 </div>
 </div>
 </div>

 <AnimatePresence>
 {isOpen && (
 <motion.div
 initial={{ opacity: 0, height: 0 }}
 animate={{ opacity: 1, height: 'auto' }}
 exit={{ opacity: 0, height: 0 }}
 className="md:hidden bg-neutral-900 border-b border-neutral-800"
 >
 <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
 <Link to="/" className="text-gray-300 hover:text-white block px-3 py-2 rounded-md text-base font-medium">Home</Link>
 <Link to="/dashboard" className="text-gray-300 hover:text-white block px-3 py-2 rounded-md text-base font-medium">Dashboard</Link>
 <Link to="/login" className="text-yellow-400 hover:text-yellow-300 block px-3 py-2 rounded-md text-base font-medium">Login</Link>
 </div>
 </motion.div>
 )}
 </AnimatePresence>
 </nav>
 );
};

export default Navbar;
