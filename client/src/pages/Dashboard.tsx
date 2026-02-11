import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { UploadCloud, CheckCircle, AlertTriangle, FileText, Clock, Settings, Fingerprint, Activity, Loader2, Video, Music, LogOut } from 'lucide-react';
import api from '../services/api'; // Use configured API instance
import { useNavigate } from 'react-router-dom';
import { BarChart, Bar, XAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

interface ScanResult {
    _id: string;
    title: string;
    fileName: string;
    result: 'Real' | 'Fake';
    confidenceScore: number;
    scanDate: string;
    details?: string;
    analysis?: {
        perplexity: number;
        burstiness: number;
        similarityScore: number;
        aiProbability: number;
    };
    comparative_analysis?: Array<{
        metric: string;
        observed: string;
        benchmark: string;
        status: string;
    }>;
}

const Dashboard: React.FC = () => {
    const [activeTab, setActiveTab] = useState<'upload' | 'video' | 'audio' | 'text' | 'id_verify'>('upload');
    const [file, setFile] = useState<File | null>(null);
    const [textInput, setTextInput] = useState('');
    const [metadata, setMetadata] = useState({ title: '', author: '', language: 'English' });

    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<ScanResult | null>(null);
    const [history, setHistory] = useState<ScanResult[]>([]);

    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const navigate = useNavigate();

    useEffect(() => {
        if (!user._id) {
            navigate('/auth');
        } else {
            fetchHistory();
        }
    }, [user._id]);

    const fetchHistory = async () => {
        try {
            const { data } = await api.get(`/scan/history/${user._id}`);
            setHistory(data);
        } catch (error) {
            console.error("Failed to fetch history");
        }
    };

    const handleScan = async () => {
        setLoading(true);
        setResult(null);
        try {
            const formData = new FormData();
            formData.append('userId', user._id);
            formData.append('fileType', activeTab);
            formData.append('title', metadata.title);
            formData.append('author', metadata.author);
            formData.append('language', metadata.language);

            if (activeTab === 'text') {
                formData.append('text', textInput);
            } else if (file) {
                formData.append('file', file);
            }

            // Note: Content-Type is set automatically with FormData
            const { data } = await api.post('/scan/detect', formData);
            setResult(data);
            fetchHistory();
        } catch (error) {
            console.error("Scan failed", error);
        } finally {
            setLoading(false);
        }
    };

    const downloadReport = () => {
        if (!result) return;
        const doc = new jsPDF();

        // Header
        doc.setFillColor(15, 23, 42);
        doc.rect(0, 0, 210, 40, 'F');
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(22);
        doc.text("DeepDetect Forensic Report", 14, 25);
        doc.setFontSize(10);
        doc.text(`CONFIDENTIAL // ID: ${result._id}`, 14, 35);

        // Summary
        doc.setTextColor(0, 0, 0);
        doc.setFontSize(14);
        doc.text("Executive Summary", 14, 50);
        doc.setFontSize(11);
        doc.text(`Result: ${result.result}`, 14, 60);
        doc.text(`Confidence: ${result.confidenceScore}%`, 14, 66);
        doc.text(`Date: ${new Date().toLocaleString()}`, 14, 72);

        // Analysis
        doc.setFontSize(14);
        doc.text("Forensic Analysis Details", 14, 85);
        doc.setFontSize(10);
        const splitText = doc.splitTextToSize(result.details || "No details provided.", 180);
        doc.text(splitText, 14, 95);

        // Table
        if (result.comparative_analysis && result.comparative_analysis.length > 0) {
            autoTable(doc, {
                startY: 110,
                head: [['Metric', 'Observed Value', 'Human Benchmark', 'Status']],
                body: result.comparative_analysis.map(row => [row.metric, row.observed, row.benchmark, row.status]),
                theme: 'grid',
                headStyles: { fillColor: [15, 23, 42] }
            });
        }

        doc.save(`Forensic_Report_${result._id}.pdf`);
    };

    const PIE_DATA = result ? [
        { name: 'Real', value: result.result === 'Real' ? result.confidenceScore : 100 - result.confidenceScore },
        { name: 'Synthetic', value: result.result === 'Fake' ? result.confidenceScore : 100 - result.confidenceScore },
    ] : [];

    const COLORS = ['#10b981', '#ef4444'];

    return (
        <div className="pt-24 px-4 md:px-8 max-w-[1600px] mx-auto min-h-screen">
            <div className="grid grid-cols-12 gap-8">

                {/* Left Sidebar - Options & History */}
                <div className="col-span-12 lg:col-span-3 space-y-6">

                    {/* User Profile Card */}
                    <div className="bg-slate-900/50 backdrop-blur-md border border-slate-800 rounded-2xl p-6 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/10 rounded-bl-full -mr-8 -mt-8 transition group-hover:bg-cyan-500/20" />
                        <div className="relative z-10">
                            <div className="w-16 h-16 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-full flex items-center justify-center text-xl font-bold text-white mb-4 shadow-lg shadow-cyan-500/20">
                                {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                            </div>
                            <h3 className="text-lg font-bold text-white truncate">{user.name || 'User'}</h3>
                            <p className="text-sm text-gray-400 truncate mb-6">{user.email || 'user@example.com'}</p>

                            <button
                                onClick={() => {
                                    localStorage.removeItem('user');
                                    // Force a hard reload/redirect to ensure all states are cleared
                                    window.location.href = '/auth';
                                }}
                                className="w-full bg-slate-800 hover:bg-red-500/10 hover:text-red-500 text-gray-300 px-4 py-2 rounded-lg text-sm font-semibold transition border border-transparent hover:border-red-500/20 flex items-center justify-center gap-2"
                            >
                                <LogOut className="w-4 h-4" /> Sign Out
                            </button>
                        </div>
                    </div>

                    <div className="bg-slate-900/50 backdrop-blur-md border border-slate-800 rounded-2xl p-6">
                        <h3 className="text-lg font-bold mb-4 flex items-center gap-2 text-cyan-400">
                            <Settings className="w-5 h-5" /> Config
                        </h3>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-xs uppercase text-gray-500 font-bold mb-1">Language</label>
                                <select
                                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-sm text-gray-300 focus:border-cyan-500 outline-none"
                                    value={metadata.language}
                                    onChange={(e) => setMetadata({ ...metadata, language: e.target.value })}
                                >
                                    <option>English</option>
                                    <option>French</option>
                                    <option>Spanish</option>
                                    <option>German</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    <div className="bg-slate-900/50 backdrop-blur-md border border-slate-800 rounded-2xl p-6 h-[500px] flex flex-col">
                        <h3 className="text-lg font-bold mb-4 flex items-center gap-2 text-gray-300">
                            <Clock className="w-5 h-5" /> Recent Scans
                        </h3>
                        <div className="flex-1 overflow-y-auto custom-scrollbar space-y-3 pr-2">
                            {history.map(scan => (
                                <div key={scan._id} className="p-3 bg-slate-800/50 rounded-lg border border-transparent hover:border-slate-700 transition cursor-pointer" onClick={() => setResult(scan)}>
                                    <h4 className="font-semibold text-sm text-white truncate">{scan.title || scan.fileName}</h4>
                                    <div className="flex justify-between mt-2 text-xs">
                                        <span className={scan.result === 'Fake' ? "text-red-400" : "text-green-400"}>{scan.result}</span>
                                        <span className="text-gray-500">{new Date(scan.scanDate).toLocaleDateString()}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Main Content */}
                <div className="col-span-12 lg:col-span-9 space-y-6">

                    {/* Input Area */}
                    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8">
                        <div className="grid grid-cols-2 gap-4 mb-6">
                            <input
                                type="text"
                                placeholder="Project Title"
                                className="bg-slate-950 border border-slate-800 rounded-xl p-3 text-white focus:border-cyan-500 outline-none transition"
                                value={metadata.title}
                                onChange={(e) => setMetadata({ ...metadata, title: e.target.value })}
                            />
                            <input
                                type="text"
                                placeholder="Author Name"
                                className="bg-slate-950 border border-slate-800 rounded-xl p-3 text-white focus:border-cyan-500 outline-none transition"
                                value={metadata.author}
                                onChange={(e) => setMetadata({ ...metadata, author: e.target.value })}
                            />
                        </div>

                        <div className="flex gap-4 mb-6 border-b border-slate-800 pb-4 overflow-x-auto">
                            {['upload', 'video', 'audio', 'text', 'id_verify'].map((tab) => (
                                <button
                                    key={tab}
                                    onClick={() => setActiveTab(tab as any)}
                                    className={`px-4 py-2 rounded-lg text-sm font-semibold capitalize whitespace-nowrap transition ${activeTab === tab ? 'bg-cyan-500 text-black' : 'text-gray-400 hover:text-white hover:bg-slate-800'}`}
                                >
                                    {tab.replace('_', ' ')}
                                </button>
                            ))}
                        </div>

                        <div className="min-h-[200px] border-2 border-dashed border-slate-800 rounded-xl flex flex-col items-center justify-center bg-slate-950/30 relative">
                            {['upload', 'video', 'audio', 'id_verify'].includes(activeTab) && (
                                <div className="text-center p-8 w-full">
                                    <input type="file" id="file" className="hidden" onChange={(e) => e.target.files && setFile(e.target.files[0])} />
                                    <label htmlFor="file" className="cursor-pointer flex flex-col items-center group">
                                        <div className="w-16 h-16 bg-slate-900 rounded-full flex items-center justify-center mb-4 group-hover:bg-cyan-500/10 transition">
                                            {activeTab === 'id_verify' ? <Fingerprint className="text-cyan-400 w-8 h-8" /> :
                                                activeTab === 'video' ? <Video className="text-purple-400 w-8 h-8" /> :
                                                    activeTab === 'audio' ? <Music className="text-green-400 w-8 h-8" /> :
                                                        <UploadCloud className="text-blue-400 w-8 h-8" />}
                                        </div>
                                        <span className="text-gray-300 font-medium text-lg">{file ? file.name : `Upload ${activeTab.replace('_', ' ').toUpperCase()}`}</span>
                                        <span className="text-gray-600 text-sm mt-2">Supports all major formats</span>
                                    </label>
                                </div>
                            )}
                            {activeTab === 'text' && (
                                <textarea
                                    className="w-full h-full min-h-[200px] bg-transparent p-4 text-gray-300 outline-none resize-none"
                                    placeholder="Paste text to analyze..."
                                    value={textInput}
                                    onChange={(e) => setTextInput(e.target.value)}
                                />
                            )}
                        </div>

                        <div className="flex justify-end mt-6">
                            <button
                                onClick={handleScan}
                                disabled={loading || (!file && !textInput)}
                                className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white px-8 py-3 rounded-xl font-bold shadow-lg shadow-cyan-500/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                            >
                                {loading ? <Loader2 className="animate-spin" /> : <Activity className="w-5 h-5" />}
                                Analyze Content
                            </button>
                        </div>
                    </div>

                    {/* Results Area */}
                    <AnimatePresence>
                        {result && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
                            >
                                {/* Results Card */}
                                <div className="col-span-1 lg:col-span-2 bg-slate-900 border border-slate-800 p-6 rounded-2xl flex flex-col justify-between relative overflow-hidden">
                                    <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${result.result === 'Fake' ? 'from-red-600/20' : 'from-green-600/20'} to-transparent rounded-bl-full`} />
                                    <div>
                                        <h3 className="text-gray-400 text-sm uppercase font-bold tracking-wider mb-2">Analysis Result</h3>
                                        <div className="flex items-center gap-4">
                                            {result.result === 'Fake' ? <AlertTriangle className="w-12 h-12 text-red-500" /> : <CheckCircle className="w-12 h-12 text-green-500" />}
                                            <span className={`text-4xl font-bold ${result.result === 'Fake' ? 'text-white' : 'text-white'}`}>{result.result === 'Fake' ? 'Synthetic Media' : 'Authentic Media'}</span>
                                        </div>
                                    </div>
                                    <div className="mt-8">
                                        <div className="flex justify-between items-end mb-2">
                                            <span className="text-gray-400">Confidence Score</span>
                                            <span className="text-2xl font-bold text-white">{result.confidenceScore}%</span>
                                        </div>
                                        <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                                            <motion.div
                                                initial={{ width: 0 }}
                                                animate={{ width: `${result.confidenceScore}%` }}
                                                className={`h-full ${result.result === 'Fake' ? 'bg-red-500' : 'bg-green-500'}`}
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Authenticity Pie Chart */}
                                <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl flex flex-col items-center justify-center relative">
                                    <h4 className="absolute top-4 left-4 text-xs font-bold text-gray-500 uppercase">Authenticity Split</h4>
                                    <div className="w-full h-[160px] mt-4">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <PieChart>
                                                <Pie
                                                    data={PIE_DATA}
                                                    innerRadius={40}
                                                    outerRadius={60}
                                                    paddingAngle={5}
                                                    dataKey="value"
                                                >
                                                    {PIE_DATA.map((_, index) => (
                                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                                    ))}
                                                </Pie>
                                                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderRadius: '8px', border: 'none' }} />
                                            </PieChart>
                                        </ResponsiveContainer>
                                    </div>
                                    <div className="flex gap-4 text-xs text-gray-400 mt-[-10px]">
                                        <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-green-500" /> Real</span>
                                        <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-red-500" /> Synthetic</span>
                                    </div>
                                </div>

                                {/* Metrics Bar Chart */}
                                <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl">
                                    <h4 className="text-xs font-bold text-gray-500 uppercase mb-4">Signal Metrics</h4>
                                    <div className="w-full h-[140px]">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <BarChart data={[
                                                { name: 'PPL', value: result.analysis?.perplexity || 0 },
                                                { name: 'BST', value: result.analysis?.burstiness || 0 },
                                                { name: 'SIM', value: result.analysis?.similarityScore || 0 },
                                            ]}>
                                                <XAxis dataKey="name" tick={{ fill: '#64748b', fontSize: 10 }} axisLine={false} tickLine={false} />
                                                <Bar dataKey="value" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                                                <Tooltip cursor={{ fill: 'transparent' }} contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b' }} />
                                            </BarChart>
                                        </ResponsiveContainer>
                                    </div>
                                </div>

                                {/* Deep Comparative Analysis Table */}
                                <div className="col-span-1 lg:col-span-4 bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
                                    <div className="p-4 border-b border-slate-800 flex justify-between items-center bg-slate-950/30">
                                        <h3 className="font-bold text-white flex items-center gap-2"><Activity className="w-4 h-4 text-cyan-400" /> Comparative Forensics</h3>
                                    </div>
                                    <div className="p-4">
                                        <table className="w-full text-sm text-left text-gray-400">
                                            <thead className="text-xs text-gray-500 uppercase bg-slate-800/50">
                                                <tr>
                                                    <th className="px-4 py-3 rounded-tl-lg">Detection Metric</th>
                                                    <th className="px-4 py-3">Observed Value</th>
                                                    <th className="px-4 py-3">Benchmark (Real)</th>
                                                    <th className="px-4 py-3 rounded-tr-lg">Status</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {result.comparative_analysis?.map((item, index) => (
                                                    <tr key={index} className="border-b border-slate-800 hover:bg-slate-800/20">
                                                        <td className="px-4 py-3 font-medium text-white">{item.metric}</td>
                                                        <td className="px-4 py-3 text-cyan-400">{item.observed}</td>
                                                        <td className="px-4 py-3">{item.benchmark}</td>
                                                        <td className="px-4 py-3">
                                                            <span className={`px-2 py-1 rounded text-xs font-bold ${item.status === 'Anomaly' ? 'bg-red-500/10 text-red-500' : 'bg-green-500/10 text-green-500'}`}>
                                                                {item.status}
                                                            </span>
                                                        </td>
                                                    </tr>
                                                ))}
                                                {(!result.comparative_analysis || result.comparative_analysis.length === 0) && (
                                                    <tr>
                                                        <td colSpan={4} className="px-4 py-8 text-center text-gray-600 italic">No comparative data available for this scan type.</td>
                                                    </tr>
                                                )}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>

                                {/* Forensic Detailed Report */}
                                <div className="col-span-1 md:col-span-2 lg:col-span-4 bg-slate-900 border border-slate-800 p-8 rounded-2xl relative">
                                    <div className="absolute top-4 right-4 text-xs font-bold text-gray-600 border border-gray-600 px-2 py-1 rounded uppercase tracking-widest opacity-30 select-none">
                                        CONFIDENTIAL // GOV-RESTRICTED
                                    </div>
                                    <div className="flex items-center gap-2 mb-6">
                                        <Fingerprint className="text-gray-400" />
                                        <h3 className="text-xl font-bold text-white">Forensic Conclusion</h3>
                                    </div>
                                    <div className="p-6 bg-black/20 rounded-xl border border-white/5 font-mono text-sm text-gray-300 leading-relaxed">
                                        <p>{result.details}</p>
                                    </div>
                                    <div className="mt-6 flex justify-end">
                                        <button
                                            onClick={downloadReport}
                                            className="bg-cyan-600 hover:bg-cyan-500 text-white px-6 py-2 rounded-lg text-sm font-bold shadow-lg shadow-cyan-500/20 flex items-center gap-2 transition"
                                        >
                                            <FileText className="w-4 h-4" /> Download Full Forensic Report (PDF)
                                        </button>
                                    </div>
                                </div>

                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div >
    );
};

export default Dashboard;
