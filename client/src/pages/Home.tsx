import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ScanFace, ShieldAlert, Cpu, ArrowRight } from 'lucide-react';

const Home: React.FC = () => {
    return (
        <div className="pt-16">
            {/* Hero Section */}
            <section className="relative overflow-hidden px-4 md:px-8 py-24 lg:py-32">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-slate-950 to-black z-[-1]" />
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-cyan-500/10 blur-[120px] rounded-full pointer-events-none" />

                <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6">
                            Detect <span className="bg-gradient-to-r from-cyan-400 to-blue-600 bg-clip-text text-transparent">AI Fakes</span> in Seconds.
                        </h1>
                        <p className="text-lg md:text-xl text-gray-400 mb-8 max-w-lg">
                            Ensure authenticity in the digital age. Our advanced neural networks analyze media to detect deepfakes, AI-generated text, and manipulated content with 99.8% accuracy.
                        </p>
                        <div className="flex flex-wrap gap-4">
                            <Link to="/login" className="px-8 py-4 bg-cyan-600 hover:bg-cyan-500 text-white rounded-full font-semibold text-lg transition-all shadow-lg shadow-cyan-500/25 flex items-center gap-2">
                                Start Detecting <ArrowRight className="w-5 h-5" />
                            </Link>
                            <Link to="/about" className="px-8 py-4 bg-slate-800 hover:bg-slate-700 text-white rounded-full font-semibold text-lg transition-all border border-slate-700">
                                How it Works
                            </Link>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="relative"
                    >
                        <div className="relative rounded-2xl overflow-hidden shadow-2xl shadow-cyan-500/10 border border-slate-800 bg-slate-900/50 backdrop-blur-sm p-6 aspect-video flex items-center justify-center">
                            <div className="absolute inset-0 bg-grid-slate-800/50 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))]"></div>
                            <div className="relative z-10 text-center">
                                <ScanFace className="w-24 h-24 text-cyan-400 mx-auto mb-4 animate-pulse" />
                                <div className="text-2xl font-mono text-cyan-200">System Active</div>
                                <div className="text-sm text-cyan-500/60 mt-2 font-mono">Scanning neural patterns...</div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-24 bg-slate-950/50 px-4 md:px-8">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">Why DeepDetect?</h2>
                        <p className="text-gray-400 max-w-2xl mx-auto">Leading the industry in synthetic media detection with state-of-the-art implementation.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            { icon: ShieldAlert, title: "99.8% Accuracy", desc: "Military-grade detection algorithms trained on millions of samples." },
                            { icon: Cpu, title: "Real-time Processing", desc: "Get results in milliseconds with our optimized edge computing network." },
                            { icon: ScanFace, title: "Multi-modal Analysis", desc: "Detects manipulation in Images, Audio, Video, and Text concurrently." }
                        ].map((feature, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: idx * 0.1 }}
                                className="p-8 rounded-2xl bg-slate-900 border border-slate-800 hover:border-cyan-500/30 transition-colors group"
                            >
                                <div className="w-14 h-14 rounded-full bg-slate-800 flex items-center justify-center mb-6 group-hover:bg-cyan-500/10 transition-colors">
                                    <feature.icon className="w-7 h-7 text-cyan-400" />
                                </div>
                                <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                                <p className="text-gray-400 leading-relaxed">{feature.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Home;
