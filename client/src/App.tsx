import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';

const Home = lazy(() => import('./pages/Home'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Auth = lazy(() => import('./pages/Auth'));
const About = lazy(() => import('./pages/About'));

const App: React.FC = () => {
 return (
 <Router>
 <div className="min-h-screen bg-black text-white font-sans selection:bg-yellow-500 selection:text-white">
 <Navbar />
 <Suspense fallback={<div className="pt-28 text-center text-gray-400">Loading...</div>}>
 <Routes>
 <Route path="/" element={<Home />} />
 <Route path="/dashboard" element={<Dashboard />} />
 <Route path="/login" element={<Auth />} />
 <Route path="/about" element={<About />} />
 </Routes>
 </Suspense>
 </div>
 </Router>
 );
};

export default App;
