import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { UploadCloud, CheckCircle, AlertTriangle, FileText, Clock, Settings, Fingerprint, Activity, Loader2, Video, Music, LogOut, Globe } from 'lucide-react';
import api from '../services/api'; // Use configured API instance
import { useNavigate } from 'react-router-dom';
import { BarChart, Bar, XAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import type * as FaceApiType from '@vladmandic/face-api';

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
    web_detection?: {
        best_guess_labels: string[];
        exact_matches: string[];
        partial_matches: string[];
        visually_similar: string[];
        pages_with_matching_images: string[];
    };
}

const Dashboard: React.FC = () => {
 const [activeTab, setActiveTab] = useState<'upload' | 'video' | 'audio' | 'id_verify' | 'live_camera'>('upload');
 const [file, setFile] = useState<File | null>(null);
 const [metadata, setMetadata] = useState({ title: '', author: '', language: 'English' });

 const videoRef = React.useRef<HTMLVideoElement>(null);
 const canvasRef = React.useRef<HTMLCanvasElement>(null);
 const animationFrameRef = useRef<number | null>(null);
 const faceApiRef = useRef<typeof FaceApiType | null>(null);
 const [modelsLoaded, setModelsLoaded] = useState(false);
 const [cameraActive, setCameraActive] = useState(false);
 const [cameraZoom, setCameraZoom] = useState(1);
 interface HudData {
     gender: string;
     age: number;
     expressions: Record<string, number>;
     detection: { score: number; box: { x: number; y: number } };
 }
 const [hudData, setHudData] = useState<HudData | null>(null);

 const [loading, setLoading] = useState(false);
 const [result, setResult] = useState<ScanResult | null>(null);
 const [history, setHistory] = useState<ScanResult[]>([]);

 const user = JSON.parse(localStorage.getItem('user') || '{}');
 const navigate = useNavigate();

 const fetchHistory = useCallback(async () => {
 try {
 const { data } = await api.get(`/scan/history/${user._id}`);
 setHistory(data);
 } catch (error) {
 console.error("Failed to fetch history", error);
 }
 }, [user._id]);

 useEffect(() => {
 if (!user._id) {
 navigate('/login');
 } else {
 fetchHistory();
 }
 }, [user._id, fetchHistory, navigate]);

 useEffect(() => {
    const loadModels = async () => {
        try {
            if (!faceApiRef.current) {
                faceApiRef.current = await import('@vladmandic/face-api');
            }
            const faceapi = faceApiRef.current;
            await faceapi.nets.tinyFaceDetector.loadFromUri('/models');
            await faceapi.nets.faceLandmark68Net.loadFromUri('/models');
            await faceapi.nets.ageGenderNet.loadFromUri('/models');
            await faceapi.nets.faceExpressionNet.loadFromUri('/models');
            setModelsLoaded(true);
        } catch (e) {
            console.error('Failed to load face models', e);
        }
    };
    loadModels();
 }, []);

 useEffect(() => {
    let stream: MediaStream | null = null;

    const startVideo = async () => {
        try {
            stream = await navigator.mediaDevices.getUserMedia({ video: true });
            if (videoRef.current) {
                videoRef.current.srcObject = stream;
                setCameraActive(true);
            }
        } catch (err) {
            console.error("Error accessing webcam", err);
        }
    };

    const stopVideo = () => {
        if (stream) {
            stream.getTracks().forEach(track => track.stop());
            setCameraActive(false);
        }
        if (animationFrameRef.current) {
            cancelAnimationFrame(animationFrameRef.current);
            animationFrameRef.current = null;
        }
    };

    if (activeTab === 'live_camera') {
        startVideo();
    } else {
        stopVideo();
    }

    return () => stopVideo();
 }, [activeTab]);

 const handleVideoPlay = () => {
    const detectFace = async () => {
        const faceapi = faceApiRef.current;
        if (videoRef.current && canvasRef.current && modelsLoaded && cameraActive && faceapi) {
            const detections = await faceapi.detectAllFaces(videoRef.current, new faceapi.TinyFaceDetectorOptions())
                .withFaceLandmarks()
                .withFaceExpressions()
                .withAgeAndGender();
            
            const displaySize = { 
                width: videoRef.current.videoWidth || videoRef.current.clientWidth, 
                height: videoRef.current.videoHeight || videoRef.current.clientHeight 
            };
            
            if (displaySize.width > 0) {
                faceapi.matchDimensions(canvasRef.current, displaySize);
                const resizedDetections = faceapi.resizeResults(detections, displaySize);
                
                if (resizedDetections.length > 0) {
                    const topDetection = resizedDetections[0];
                    setHudData({
                        gender: topDetection.gender,
                        age: topDetection.age,
                        expressions: Object.fromEntries(
                            Object.entries(topDetection.expressions).map(([key, value]) => [key, Number(value)])
                        ),
                        detection: {
                            score: topDetection.detection.score,
                            box: {
                                x: topDetection.detection.box.x,
                                y: topDetection.detection.box.y
                            }
                        }
                    });
                } else {
                    setHudData(null);
                }

                canvasRef.current.getContext('2d')?.clearRect(0, 0, displaySize.width, displaySize.height);
                faceapi.draw.drawDetections(canvasRef.current, resizedDetections);
                faceapi.draw.drawFaceLandmarks(canvasRef.current, resizedDetections);
            }
        }
        if (activeTab === 'live_camera') {
            animationFrameRef.current = requestAnimationFrame(detectFace);
        }
    };
    detectFace();
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

 if (activeTab === 'live_camera' && videoRef.current) {
    // Capture absolute frame from video
    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    canvas.getContext('2d')?.drawImage(videoRef.current, 0, 0);
    
    // Convert to Blob
    const blob = await new Promise<Blob | null>(resolve => canvas.toBlob(resolve, 'image/jpeg', 0.9));
    if (blob) {
        if (hudData) {
            formData.append('hudData', JSON.stringify({
                age: hudData.age,
                gender: hudData.gender,
                expressions: hudData.expressions,
                score: hudData.detection.score,
                box: hudData.detection.box
            }));
        }
        formData.append('file', blob, 'live_capture.jpg');
        formData.append('isLive', 'true');
    } else {
        throw new Error("Failed to capture frame");
    }
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

 try {
 const jsPDFModule = import('jspdf');
 const autoTableModule = import('jspdf-autotable');

 Promise.all([jsPDFModule, autoTableModule]).then(([jspdf, autotable]) => {
 const doc = new jspdf.default();

 // Helper to sanitize text for default font (removes emojis/unsupported chars)
 const safeText = (text: string) => text.replace(/[^\x20-\x7E\n\r]/g, '');

 // Header
 doc.setFillColor(15, 23, 42);
 doc.rect(0, 0, 210, 40, 'F');
 doc.setTextColor(255, 255, 255);
 doc.setFontSize(22);
 doc.text("DeepDetect Forensic Report", 14, 25);
 doc.setFontSize(10);
 doc.text(`CONFIDENTIAL // ID: ${safeText(result._id)}`, 14, 35);

 // Summary
 doc.setTextColor(0, 0, 0);
 doc.setFontSize(14);
 doc.text("Executive Summary", 14, 50);
 doc.setFontSize(11);
 doc.text(`Result: ${safeText(result.result)}`, 14, 60);
 doc.text(`Confidence: ${result.confidenceScore}%`, 14, 66);
 doc.text(`Date: ${new Date().toLocaleString()}`, 14, 72);

 // Analysis
 doc.setFontSize(14);
 doc.text("Forensic Analysis Details", 14, 85);
 doc.setFontSize(10);
 const detailText = result.details ||"No details provided.";
 const splitText = doc.splitTextToSize(safeText(detailText), 180);
 doc.text(splitText, 14, 95);

 // Table
 if (result.comparative_analysis && result.comparative_analysis.length > 0) {
 autotable.default(doc, {
 startY: 110,
 head: [['Metric', 'Observed Value', 'Human Benchmark', 'Status']],
 body: result.comparative_analysis.map(row => [
 safeText(row.metric),
 safeText(row.observed),
 safeText(row.benchmark),
 safeText(row.status)
 ]),
 theme: 'grid',
 headStyles: { fillColor: [15, 23, 42] }
 });
 }

 doc.save(`Forensic_Report_${safeText(result._id)}.pdf`);
 }).catch((err) => {
 console.error("PDF Generation Error:", err);
 alert("Failed to generate PDF report. Please try again.");
 });
 } catch (err) {
 console.error("PDF Generation Error:", err);
 alert("Failed to generate PDF report. Please try again.");
 }
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
 <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 relative overflow-hidden group">
 <div className="absolute top-0 right-0 w-32 h-32 bg-neutral-900 border border-yellow-500/20 rounded-bl-full -mr-8 -mt-8 transition group-hover:bg-yellow-500/20" />
 <div className="relative z-10">
 <div className="w-16 h-16 bg-gradient-to-br from-yellow-500 to-amber-600 rounded-full flex items-center justify-center text-xl font-bold text-white mb-4 shadow-lg shadow-yellow-500/20">
 {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
 </div>
 <h3 className="text-lg font-bold text-white truncate">{user.name || 'User'}</h3>
 <p className="text-sm text-gray-400 truncate mb-6">{user.email || 'user@example.com'}</p>

 <button
 onClick={() => {
 localStorage.removeItem('user');
 // Force a hard reload/redirect to ensure all states are cleared
 window.location.href = '/login';
 }}
 className="w-full bg-neutral-800 hover:bg-red-500/10 hover:text-red-500 text-gray-300 px-4 py-2 rounded-lg text-sm font-semibold transition border border-transparent hover:border-red-500/20 flex items-center justify-center gap-2"
 >
 <LogOut className="w-4 h-4" /> Sign Out
 </button>
 </div>
 </div>

 <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6">
 <h3 className="text-lg font-bold mb-4 flex items-center gap-2 text-yellow-400">
 <Settings className="w-5 h-5" /> Config
 </h3>
 <div className="space-y-4">
 <div>
 <label className="block text-xs uppercase text-gray-500 font-bold mb-1">Language</label>
 <select
 className="w-full bg-black border border-neutral-800 rounded-lg p-2 text-sm text-gray-300 focus:border-yellow-500 outline-none"
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

 <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 h-[500px] flex flex-col">
 <h3 className="text-lg font-bold mb-4 flex items-center gap-2 text-gray-300">
 <Clock className="w-5 h-5" /> Recent Scans
 </h3>
 <div className="flex-1 overflow-y-auto custom-scrollbar space-y-3 pr-2">
 {history.map(scan => (
 <div key={scan._id} className="p-3 bg-neutral-800 rounded-lg border border-transparent hover:border-neutral-700 transition cursor-pointer" onClick={() => setResult(scan)}>
 <h4 className="font-semibold text-sm text-white truncate">{scan.title || scan.fileName}</h4>
 <div className="flex justify-between mt-2 text-xs">
 <span className={scan.result === 'Fake' ?"text-red-400" :"text-green-400"}>{scan.result}</span>
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
 <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-8">
 <div className="grid grid-cols-2 gap-4 mb-6">
 <input
 type="text"
 placeholder="Project Title"
 className="bg-black border border-neutral-800 rounded-xl p-3 text-white focus:border-yellow-500 outline-none transition"
 value={metadata.title}
 onChange={(e) => setMetadata({ ...metadata, title: e.target.value })}
 />
 <input
 type="text"
 placeholder="Author Name"
 className="bg-black border border-neutral-800 rounded-xl p-3 text-white focus:border-yellow-500 outline-none transition"
 value={metadata.author}
 onChange={(e) => setMetadata({ ...metadata, author: e.target.value })}
 />
 </div>

 <div className="flex gap-4 mb-6 border-b border-neutral-800 pb-4 overflow-x-auto">
 {['upload', 'live_camera', 'video', 'audio', 'id_verify'].map((tab) => (
 <button
 key={tab}
 onClick={() => setActiveTab(tab as 'upload' | 'video' | 'audio' | 'id_verify' | 'live_camera')}
 className={`px-4 py-2 rounded-lg text-sm font-semibold capitalize whitespace-nowrap transition ${activeTab === tab ? 'bg-yellow-500 text-black' : 'text-gray-400 hover:text-white hover:bg-neutral-800'}`}
 >
 {tab.replace('_', ' ')}
 </button>
 ))}
 </div>

 <div className="min-h-[200px] border-2 border-dashed border-neutral-800 rounded-xl flex flex-col items-center justify-center bg-neutral-950 relative">
 {['upload', 'video', 'audio', 'id_verify'].includes(activeTab) && (
 <div className="text-center p-8 w-full">
 <input type="file" id="file" className="hidden" onChange={(e) => e.target.files && setFile(e.target.files[0])} />
 <label htmlFor="file" className="cursor-pointer flex flex-col items-center group">
 <div className="w-16 h-16 bg-neutral-900 rounded-full flex items-center justify-center mb-4 group-hover:bg-neutral-900 border border-yellow-500/20 transition">
 {activeTab === 'id_verify' ? <Fingerprint className="text-yellow-400 w-8 h-8" /> :
 activeTab === 'video' ? <Video className="text-amber-400 w-8 h-8" /> :
 activeTab === 'audio' ? <Music className="text-green-400 w-8 h-8" /> :
 <UploadCloud className="text-amber-400 w-8 h-8" />}
 </div>
 <span className="text-gray-300 font-medium text-lg">{file ? file.name : `Upload ${activeTab.replace('_', ' ').toUpperCase()}`}</span>
 <span className="text-gray-600 text-sm mt-2">Supports all major formats</span>
 </label>
 </div>
 )}
 {activeTab === 'live_camera' && (
     <div className="w-full h-full min-h-[400px] flex flex-col items-center justify-center relative overflow-hidden rounded-lg bg-black group">
         {!modelsLoaded && <div className="absolute inset-0 flex items-center justify-center z-20 text-cyan-500 bg-black/80 font-mono tracking-widest"><Loader2 className="animate-spin w-8 h-8 mr-2" /> INITIALIZING NEURAL ENGINE...</div>}
         
         {/* Sci-Fi Overlay Tint */}
         <div className="absolute inset-0 bg-cyan-900/20 mix-blend-overlay pointer-events-none z-10"></div>
         
         {/* Cinematic Target Brackets */}
         <div className="absolute top-8 left-8 w-16 h-16 border-t-4 border-l-4 border-yellow-400 z-20 pointer-events-none opacity-80 shadow-[0_0_15px_rgba(250,204,21,0.5)]"></div>
         <div className="absolute top-8 right-8 w-16 h-16 border-t-4 border-r-4 border-yellow-400 z-20 pointer-events-none opacity-80 shadow-[0_0_15px_rgba(250,204,21,0.5)]"></div>
         <div className="absolute bottom-8 left-8 w-16 h-16 border-b-4 border-l-4 border-yellow-400 z-20 pointer-events-none opacity-80 shadow-[0_0_15px_rgba(250,204,21,0.5)]"></div>
         <div className="absolute bottom-8 right-8 w-16 h-16 border-b-4 border-r-4 border-yellow-400 z-20 pointer-events-none opacity-80 shadow-[0_0_15px_rgba(250,204,21,0.5)]"></div>

         {/* Sci-Fi Neural Data HUD */}
         {modelsLoaded && hudData && (
             <div className="absolute inset-y-0 right-12 md:right-24 flex items-center justify-center z-30 pointer-events-none">
                 <div className="flex flex-col gap-2 font-mono text-cyan-400 text-xs md:text-sm tracking-widest bg-black/40 p-4 md:p-6 rounded-lg backdrop-blur-md border border-cyan-500/30 w-64 uppercase shadow-[0_0_30px_rgba(6,182,212,0.2)]">
                     <div className="flex justify-between items-center mb-2 border-b border-cyan-500/50 pb-2">
                         <span className="text-white font-bold">[] DATA</span>
                         <Activity className="w-4 h-4 text-yellow-400 animate-pulse" />
                     </div>
                     <p>NO: ONE PERSON</p>
                     <p>GENDER: {hudData.gender}</p>
                     <p>AGE GROUP: {Math.round(hudData.age)} YEARS</p>
                     <p>EXPRESSION: {Object.keys(hudData.expressions).reduce((a, b) => hudData.expressions[a] > hudData.expressions[b] ? a : b)}</p>
                     <p>ETHNICITY: CLASSIFYING</p>
                     <p>DETECTION: {Math.round(hudData.detection.score * 100000)} POINTS</p>
                     <p className="mt-2 text-yellow-400/80">POS (X/Y): {Math.round(hudData.detection.box.x)} / {Math.round(hudData.detection.box.y)}</p>
                     
                     <div className="mt-4 pt-2 border-t border-cyan-500/50 flex flex-col gap-1">
                         <div className="h-1 bg-cyan-900 w-full rounded"><div className="h-full bg-cyan-400 rounded" style={{ width: `${Math.random() * 40 + 60}%` }}></div></div>
                         <div className="h-1 bg-cyan-900 w-full rounded"><div className="h-full bg-cyan-400 rounded" style={{ width: `${Math.random() * 40 + 20}%` }}></div></div>
                         <div className="h-1 bg-cyan-900 w-full rounded"><div className="h-full bg-cyan-400 rounded" style={{ width: `${Math.random() * 30 + 70}%` }}></div></div>
                     </div>
                 </div>
             </div>
         )}

         {/* Zoom Controls Overlay */}
         {modelsLoaded && (
             <div className="absolute top-4 right-4 z-30 bg-black/60 backdrop-blur border border-white/10 p-3 rounded-xl flex flex-col items-center opacity-0 group-hover:opacity-100 transition-opacity">
                 <span className="text-white text-xs font-bold mb-2">ZOOM: {cameraZoom.toFixed(1)}x</span>
                 <input 
                     type="range" 
                     min="1" 
                     max="3" 
                     step="0.1" 
                     value={cameraZoom}
                     onChange={(e) => setCameraZoom(parseFloat(e.target.value))}
                     className="writing-mode-vertical h-24 accent-yellow-500"
                     style={{ WebkitAppearance: 'slider-vertical' } as React.CSSProperties}
                 />
             </div>
         )}

         <video 
            ref={videoRef} 
            autoPlay 
            muted 
            playsInline
            onPlay={handleVideoPlay}
            className="w-full h-full object-cover relative z-0"
            style={{ 
                transform: `scale(${cameraZoom})`, 
                transformOrigin: 'center center',
                transition: 'transform 0.1s ease-out'
            }}
         />
         <canvas 
            ref={canvasRef} 
            className="absolute inset-0 z-10 pointer-events-none" 
            style={{ 
                transform: `scale(${cameraZoom})`, 
                transformOrigin: 'center center',
                transition: 'transform 0.1s ease-out'
            }}
         />
     </div>
 )}
 </div>

 <div className="flex justify-end mt-6">
 <button
 onClick={handleScan}
 disabled={loading || (!file && activeTab !== 'live_camera')}
 className="bg-gradient-to-r from-yellow-500 to-amber-600 hover:from-yellow-400 hover:to-amber-500 text-white px-8 py-3 rounded-xl font-bold shadow-lg shadow-yellow-500/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
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
 <div className="col-span-1 lg:col-span-2 bg-neutral-900 border border-neutral-800 p-6 rounded-2xl flex flex-col justify-between relative overflow-hidden">
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
 <div className="w-full bg-neutral-800 h-2 rounded-full overflow-hidden">
 <motion.div
 initial={{ width: 0 }}
 animate={{ width: `${result.confidenceScore}%` }}
 className={`h-full ${result.result === 'Fake' ? 'bg-red-500' : 'bg-green-500'}`}
 />
 </div>
 </div>
 </div>

 {/* Authenticity Pie Chart */}
 <div className="bg-neutral-900 border border-neutral-800 p-4 rounded-2xl flex flex-col items-center justify-center relative">
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

    <div className="bg-neutral-900 border border-neutral-800 p-4 rounded-2xl">
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
 <div className="col-span-1 lg:col-span-4 bg-neutral-900 border border-neutral-800 rounded-2xl overflow-hidden">
 <div className="p-4 border-b border-neutral-800 flex justify-between items-center bg-neutral-950">
 <h3 className="font-bold text-white flex items-center gap-2"><Activity className="w-4 h-4 text-yellow-400" /> Comparative Forensics</h3>
 </div>
 <div className="p-4">
 <table className="w-full text-sm text-left text-gray-400">
 <thead className="text-xs text-gray-500 uppercase bg-neutral-800">
 <tr>
 <th className="px-4 py-3 rounded-tl-lg">Detection Metric</th>
 <th className="px-4 py-3">Observed Value</th>
 <th className="px-4 py-3">Benchmark (Real)</th>
 <th className="px-4 py-3 rounded-tr-lg">Status</th>
 </tr>
 </thead>
 <tbody>
 {result.comparative_analysis?.map((item, index) => (
 <tr key={index} className="border-b border-neutral-800 hover:bg-neutral-800">
 <td className="px-4 py-3 font-medium text-white">{item.metric}</td>
 <td className="px-4 py-3 text-yellow-400">{item.observed}</td>
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

    {/* Source Tracking (Web Forensics) */}
    {result.web_detection && (
        <div className="col-span-1 lg:col-span-4 bg-neutral-900 border border-neutral-800 rounded-2xl overflow-hidden mt-4 p-6">
            <h3 className="font-bold text-white flex items-center gap-2 mb-6">
                <Globe className="w-5 h-5 text-blue-500" /> Source Tracking (Web Forensics)
            </h3>
            
            {result.web_detection.best_guess_labels?.length > 0 && (
                <div className="mb-6">
                    <h4 className="text-xs font-bold text-gray-500 uppercase mb-2">AI Contextual Understanding</h4>
                    <div className="flex flex-wrap gap-2">
                        {result.web_detection.best_guess_labels.map((label, i) => (
                            <span key={i} className="bg-neutral-800 border border-blue-500/20 text-blue-400 px-3 py-1 rounded-full text-xs font-semibold">{label}</span>
                        ))}
                    </div>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <h4 className="text-xs font-bold text-gray-500 uppercase mb-2 flex items-center justify-between">
                        Exact Matches
                        <span className="bg-red-500/10 text-red-500 px-2 rounded-full">{result.web_detection.exact_matches?.length || 0}</span>
                    </h4>
                    {result.web_detection.exact_matches?.length > 0 ? (
                        <div className="space-y-2 max-h-40 overflow-y-auto custom-scrollbar pr-2">
                            {result.web_detection.exact_matches.map((url, i) => (
                                <a key={i} href={url} target="_blank" rel="noopener noreferrer" className="block text-xs text-gray-300 hover:text-white truncate bg-neutral-950 p-2 rounded border border-neutral-800 hover:border-red-500/50 transition">
                                    {url}
                                </a>
                            ))}
                        </div>
                    ) : (
                        <p className="text-xs text-gray-600 italic">No exact copies found online.</p>
                    )}
                </div>

                <div>
                    <h4 className="text-xs font-bold text-gray-500 uppercase mb-2 flex items-center justify-between">
                        Partial Matches (Edited)
                        <span className="bg-amber-500/10 text-amber-500 px-2 rounded-full">{result.web_detection.partial_matches?.length || 0}</span>
                    </h4>
                    {result.web_detection.partial_matches?.length > 0 ? (
                        <div className="space-y-2 max-h-40 overflow-y-auto custom-scrollbar pr-2">
                            {result.web_detection.partial_matches.map((url, i) => (
                                <a key={i} href={url} target="_blank" rel="noopener noreferrer" className="block text-xs text-gray-300 hover:text-white truncate bg-neutral-950 p-2 rounded border border-neutral-800 hover:border-amber-500/50 transition">
                                    {url}
                                </a>
                            ))}
                        </div>
                    ) : (
                        <p className="text-xs text-gray-600 italic">No partial edits found online.</p>
                    )}
                </div>
            </div>
        </div>
    )}

 {/* Forensic Detailed Report */}
 <div className="col-span-1 md:col-span-2 lg:col-span-4 bg-neutral-900 border border-neutral-800 p-8 rounded-2xl relative">
 <div className="absolute top-4 right-4 text-xs font-bold text-gray-600 border border-gray-600 px-2 py-1 rounded uppercase tracking-widest opacity-30 select-none">
 CONFIDENTIAL // GOV-RESTRICTED
 </div>
 <div className="flex items-center gap-2 mb-6">
 <Fingerprint className="text-gray-400" />
 <h3 className="text-xl font-bold text-white">Forensic Conclusion</h3>
 </div>
 <div className="p-6 bg-neutral-950 rounded-xl border border-yellow-600/30 font-mono text-sm text-gray-300 leading-relaxed">
 <p>{result.details}</p>
 </div>
 <div className="mt-6 flex justify-end">
 <button
 onClick={downloadReport}
 className="bg-yellow-600 hover:bg-yellow-500 text-white px-6 py-2 rounded-lg text-sm font-bold shadow-lg shadow-yellow-500/20 flex items-center gap-2 transition"
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
