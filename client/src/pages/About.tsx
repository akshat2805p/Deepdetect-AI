import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Lock } from 'lucide-react';

const About: React.FC = () => {
    return (
        <div className="pt-24 px-4 md:px-8 max-w-5xl mx-auto">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center mb-16"
            >
                <h1 className="text-4xl md:text-5xl font-bold mb-6">Securing Reality</h1>
                <p className="text-xl text-gray-400 max-w-2xl mx-auto">
                    DeepDetect AI uses advanced machine learning to distinguish between authentic and synthetic media, protecting truth in the digital era.
                </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-20">
                <div className="space-y-8">
                    <div className="flex gap-4">
                        <div className="bg-cyan-900/30 p-3 rounded-lg h-fit">
                            <Shield className="w-6 h-6 text-cyan-400" />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold mb-2">Advanced Forensics</h3>
                            <p className="text-gray-400">Our algorithms analyze pixel-level artifacts, frequency domain anomalies, and compression inconsistencies that are invisible to the human eye.</p>
                        </div>
                    </div>
                    <div className="flex gap-4">
                        <div className="bg-blue-900/30 p-3 rounded-lg h-fit">
                            <Lock className="w-6 h-6 text-blue-400" />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold mb-2">Privacy First</h3>
                            <p className="text-gray-400">Your data is processed securely. We calculate hashes locally where possible and ensure your uploaded content is never used for training without consent.</p>
                        </div>
                    </div>
                </div>

                <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 blur-3xl rounded-full" />
                    <div className="relative bg-slate-900 border border-slate-800 p-8 rounded-2xl">
                        <h3 className="text-lg font-mono text-cyan-400 mb-4">&gt; System Architecture</h3>
                        <div className="space-y-4 font-mono text-sm text-gray-400">
                            <div className="flex justify-between border-b border-slate-800 pb-2">
                                <span>Core Model</span>
                                <span className="text-white">EfficientNet-B7</span>
                            </div>
                            <div className="flex justify-between border-b border-slate-800 pb-2">
                                <span>Ensemble Method</span>
                                <span className="text-white">Voting Classifier</span>
                            </div>
                            <div className="flex justify-between border-b border-slate-800 pb-2">
                                <span>Latency</span>
                                <span className="text-white">&lt; 120ms</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Accuracy</span>
                                <span className="text-green-400">99.82%</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default About;
