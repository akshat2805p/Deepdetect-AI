import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import axios, { AxiosError } from 'axios';
import { Lock, Mail, User, ArrowRight, Loader2, ShieldCheck } from 'lucide-react';
import api, { getApiHostLabel } from '../services/api';

const Auth: React.FC = () => {
 const [isLogin, setIsLogin] = useState(true);
 const [formData, setFormData] = useState({ name: '', email: '', password: '' });
 const navigate = useNavigate();
 const [error, setError] = useState('');
 const [loading, setLoading] = useState(false);

 const resolveAuthError = (err: unknown): string => {
 if (axios.isAxiosError(err)) {
 const typedError = err as AxiosError<{ message?: string }>;
 const serverMessage = typedError.response?.data?.message;
 if (serverMessage) return serverMessage;

 const apiHost = getApiHostLabel();

 return typedError.response?.status
 ? `Authentication failed (${typedError.response.status})`
 : `Cannot reach API server at ${apiHost}. If running locally, start server on port 5002.`;
 }

 return 'Authentication failed';
 };

 const postAuthWithFallback = async (endpoint: string, payload: { name: string; email: string; password: string }) => {
 try {
 return await api.post(endpoint, payload);
 } catch (err) {
 if (axios.isAxiosError(err) && !err.response) {
 // Retry once against same-origin /api in case env URL is incorrect.
 return axios.post(`/api${endpoint}`, payload);
 }
 throw err;
 }
 };

 const handleSubmit = async (e: React.FormEvent) => {
 e.preventDefault();
 setError('');
 setLoading(true);
 try {
 const endpoint = isLogin ? '/auth/login' : '/auth/register';
 const payload = {
 name: formData.name.trim(),
 email: formData.email.trim(),
 password: formData.password,
 };
 const { data } = await postAuthWithFallback(endpoint, payload);

 if (isLogin) {
 localStorage.setItem('user', JSON.stringify(data));
 setTimeout(() => navigate('/dashboard'), 500);
 } else {
 setIsLogin(true); // Switch to login view after signup
 setError('Account created! Please log in.');
 }
 } catch (err: unknown) {
  setError(resolveAuthError(err));
 } finally {
  setLoading(false);
 }
 };

 return (
 <div className="min-h-screen flex items-center justify-center p-4 bg-black relative overflow-hidden pt-24">
 {/* Background Ambience */}
 <div className="absolute inset-0 z-0">
 <div className="absolute top-[-20%] left-[-10%] w-[70%] h-[70%] bg-neutral-900 border border-amber-500/20 blur-[150px] rounded-full animate-pulse" />
 <div className="absolute bottom-[-20%] right-[-10%] w-[70%] h-[70%] bg-neutral-900 border border-yellow-500/20 blur-[150px] rounded-full animate-pulse delay-700" />
 </div>

 <motion.div
 initial={{ opacity: 1, scale: 1 }}
 animate={{ opacity: 1, scale: 1 }}
 className="w-full max-w-5xl bg-neutral-900 border border-yellow-600/30 rounded-3xl shadow-2xl overflow-hidden z-20 grid grid-cols-1 lg:grid-cols-2 min-h-[600px]"
 >
 {/* Left Column: Form */}
 <div className="p-8 md:p-12 flex flex-col justify-center relative">
 <div className="mb-8">
 <h2 className="text-4xl font-bold mb-3 bg-gradient-to-r from-yellow-400 to-amber-500 bg-clip-text text-transparent">
 {isLogin ? 'Welcome Back' : 'Create Account'}
 </h2>
 <p className="text-neutral-400">
 {isLogin ? 'Enter your credentials to access the secure dashboard.' : 'Join the elite force in synthetic media detection.'}
 </p>
 </div>

 {error && (
 <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-3 rounded-xl mb-6 text-sm flex items-center gap-2">
 <span className="w-1.5 h-1.5 rounded-full bg-red-400" />
 {error}
 </div>
 )}

 <form onSubmit={handleSubmit} className="space-y-5">
 {!isLogin && (
 <div className="relative group">
 <User className="absolute left-3 top-3.5 w-5 h-5 text-neutral-500 group-focus-within:text-yellow-400 transition-colors" />
 <input
 type="text"
 className="w-full bg-neutral-950 border border-neutral-700/50 rounded-xl py-3 pl-10 pr-4 text-white placeholder-neutral-500 focus:outline-none focus:border-yellow-500/50 focus:ring-1 focus:ring-yellow-500/50 transition-all"
 placeholder="Full Name"
 value={formData.name}
 onChange={(e) => setFormData({ ...formData, name: e.target.value })}
 />
 </div>
 )}
 <div className="relative group">
 <Mail className="absolute left-3 top-3.5 w-5 h-5 text-neutral-500 group-focus-within:text-yellow-400 transition-colors" />
 <input
 type="email"
 className="w-full bg-neutral-950 border border-neutral-700/50 rounded-xl py-3 pl-10 pr-4 text-white placeholder-neutral-500 focus:outline-none focus:border-yellow-500/50 focus:ring-1 focus:ring-yellow-500/50 transition-all cancel-autofill"
 placeholder="Email Address"
 value={formData.email}
 onChange={(e) => setFormData({ ...formData, email: e.target.value })}
 />
 </div>
 <div className="relative group">
 <Lock className="absolute left-3 top-3.5 w-5 h-5 text-neutral-500 group-focus-within:text-yellow-400 transition-colors" />
 <input
 type="password"
 className="w-full bg-neutral-950 border border-neutral-700/50 rounded-xl py-3 pl-10 pr-4 text-white placeholder-neutral-500 focus:outline-none focus:border-yellow-500/50 focus:ring-1 focus:ring-yellow-500/50 transition-all"
 placeholder="Password"
 value={formData.password}
 onChange={(e) => setFormData({ ...formData, password: e.target.value })}
 />
 </div>

 <button
 type="submit"
 disabled={loading}
 className="w-full bg-gradient-to-r from-yellow-600 to-amber-600 hover:from-yellow-500 hover:to-amber-500 text-white py-3.5 rounded-xl font-bold transition-all shadow-lg shadow-yellow-500/20 active:scale-[0.98] disabled:opacity-70 flex items-center justify-center gap-2 group mt-2"
 >
 {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : (isLogin ? 'Sign In' : 'Create Account')}
 {!loading && <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />}
 </button>
 </form>

 <div className="mt-8 text-center">
 <p className="text-neutral-400 text-sm">
 {isLogin ?"No account?" :"Has account?"}
 <button onClick={() => setIsLogin(!isLogin)} className="text-yellow-400 font-bold hover:underline ml-1">
 {isLogin ? 'Sign Up' : 'Log In'}
 </button>
 </p>
 </div>
 </div>

 {/* Right Column: Visual Showcase */}
 <div className="hidden lg:flex flex-col relative bg-neutral-900 items-center justify-center overflow-hidden border-l border-yellow-600/30">
 {/* Rich Gradient Background */}
 <div className="absolute inset-0 bg-gradient-to-br from-neutral-900 via-neutral-800 to-black z-0" />
 <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-yellow-500/10 via-transparent to-transparent z-0" />

 {/* Grid Pattern */}
 <div className="absolute inset-0 bg-grid-white/[0.05] [mask-image:linear-gradient(0deg,transparent,black,transparent)] z-0" />

 {/* Animated HUD / Globe Visual */}
 <div className="relative w-80 h-80 mb-10 z-10 flex items-center justify-center">
 {/* Core Glow */}
 <div className="absolute inset-0 bg-yellow-500/20 blur-[60px] rounded-full animate-pulse" />

 {/* Outer Rings - CSS Animations */}
 <div className="absolute inset-0 border border-yellow-500/30 rounded-full animate-[spin_8s_linear_infinite]" />
 <div className="absolute inset-8 border border-amber-500/30 rounded-full animate-[spin_12s_linear_infinite_reverse]" />
 <div className="absolute inset-16 border-2 border-dashed border-yellow-400/20 rounded-full animate-[spin_20s_linear_infinite]" />

 {/* Center Shield */}
 <div className="relative bg-neutral-950 p-6 rounded-full border border-yellow-600/30 shadow-2xl shadow-yellow-500/20">
 <ShieldCheck className="w-20 h-20 text-yellow-400 drop-shadow-[0_0_10px_rgba(250,204,21,0.8)]" />
 </div>

 {/* Floating Particles/Decorations */}
 <div className="absolute top-0 right-0 w-3 h-3 bg-yellow-400 rounded-full blur-[2px] animate-ping" />
 <div className="absolute bottom-10 left-10 w-2 h-2 bg-amber-400 rounded-full blur-[1px] animate-ping delay-700" />
 </div>

 <div className="relative z-10 text-center max-w-sm px-6">
 <h3 className="text-3xl font-bold text-white mb-3 tracking-tight">
 Military-Grade <span className="text-yellow-400">Security</span>
 </h3>
 <p className="text-slate-300 text-base leading-relaxed font-medium">
 Real-time deepfake detection powered by advanced neural networks.
 </p>

 <div className="mt-8 flex items-center justify-center gap-4 text-xs font-mono text-yellow-500/60">
 <span className="flex items-center gap-1"><div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" /> SYSTEM ONLINE</span>
 <span>|</span>
 <span>ENCRYPTED</span>
 </div>
 </div>
 </div>
 </motion.div>
 </div>
 );
};

export default Auth;
