import React from 'react';
import { motion } from 'framer-motion';
import { Activity, Loader2 } from 'lucide-react';

interface HudData {
    gender: string;
    age: number;
    expressions: Record<string, number>;
    detection: { score: number; box: { x: number; y: number } };
}

interface LiveHudProps {
    modelsLoaded: boolean;
    hudData: HudData | null;
    cameraZoom: number;
    setCameraZoom: (zoom: number) => void;
    videoRef: React.RefObject<HTMLVideoElement | null>;
    canvasRef: React.RefObject<HTMLCanvasElement | null>;
    handleVideoPlay: () => void;
}

const LiveHud: React.FC<LiveHudProps> = ({ 
    modelsLoaded, 
    hudData, 
    cameraZoom, 
    setCameraZoom, 
    videoRef, 
    canvasRef, 
    handleVideoPlay 
}) => {
    return (
        <div className="w-full h-full min-h-[500px] flex flex-col items-center justify-center relative overflow-hidden rounded-3xl bg-black group border border-neutral-800 shadow-2xl">
            {!modelsLoaded && (
                <div className="absolute inset-0 flex flex-col items-center justify-center z-20 text-yellow-500 bg-black/90 font-mono tracking-widest">
                    <Loader2 className="animate-spin w-12 h-12 mb-4" />
                    <span className="animate-pulse">INITIALIZING NEURAL ENGINE...</span>
                </div>
            )}
            
            {/* Sci-Fi Overlay Tint */}
            <div className="absolute inset-0 bg-yellow-500/5 mix-blend-overlay pointer-events-none z-10"></div>
            
            {/* Cinematic Target Brackets */}
            <div className="absolute top-8 left-8 w-16 h-16 border-t-2 border-l-2 border-yellow-500/40 z-20 pointer-events-none opacity-80 group-hover:border-yellow-500 transition-colors duration-500"></div>
            <div className="absolute top-8 right-8 w-16 h-16 border-t-2 border-r-2 border-yellow-500/40 z-20 pointer-events-none opacity-80 group-hover:border-yellow-500 transition-colors duration-500"></div>
            <div className="absolute bottom-8 left-8 w-16 h-16 border-b-2 border-l-2 border-yellow-500/40 z-20 pointer-events-none opacity-80 group-hover:border-yellow-500 transition-colors duration-500"></div>
            <div className="absolute bottom-8 right-8 w-16 h-16 border-b-2 border-r-2 border-yellow-500/40 z-20 pointer-events-none opacity-80 group-hover:border-yellow-500 transition-colors duration-500"></div>

            {/* Sci-Fi Neural Data HUD */}
            {modelsLoaded && hudData && (
                <motion.div 
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="absolute inset-y-0 right-10 flex items-center justify-center z-30 pointer-events-none"
                >
                    <div className="flex flex-col gap-3 font-mono text-yellow-500 text-xs tracking-widest bg-black/60 p-6 rounded-2xl backdrop-blur-xl border border-yellow-500/20 w-72 uppercase shadow-[0_0_50px_rgba(250,204,21,0.15)]">
                        <div className="flex justify-between items-center mb-2 border-b border-yellow-500/30 pb-3">
                            <span className="text-white font-bold tracking-[0.2em]">[] BIO_METRICS</span>
                            <Activity className="w-4 h-4 text-yellow-400 animate-pulse" />
                        </div>
                        <div className="space-y-2 opacity-90">
                            <p className="flex justify-between"><span>STATUS:</span> <span className="text-green-400">ACTIVE</span></p>
                            <p className="flex justify-between"><span>GENDER:</span> <span>{hudData.gender}</span></p>
                            <p className="flex justify-between"><span>AGE ETA:</span> <span>{Math.round(hudData.age)}Y</span></p>
                            <p className="flex justify-between"><span>EMOTION:</span> <span>{Object.keys(hudData.expressions).reduce((a, b) => hudData.expressions[a] > hudData.expressions[b] ? a : b)}</span></p>
                            <p className="flex justify-between"><span>SCORE:</span> <span>{Math.round(hudData.detection.score * 100000)} pts</span></p>
                        </div>
                        
                        <div className="mt-4 pt-4 border-t border-yellow-500/20 flex flex-col gap-2">
                            <div className="h-1.5 bg-neutral-900 w-full rounded-full overflow-hidden">
                                <motion.div animate={{ width: ['20%', '90%', '40%', '80%'] }} transition={{ duration: 5, repeat: Infinity }} className="h-full bg-yellow-500/60 rounded-full" />
                            </div>
                            <div className="h-1.5 bg-neutral-900 w-full rounded-full overflow-hidden">
                                <motion.div animate={{ width: ['70%', '30%', '85%', '20%'] }} transition={{ duration: 4, repeat: Infinity }} className="h-full bg-cyan-500/60 rounded-full" />
                            </div>
                        </div>
                    </div>
                </motion.div>
            )}

            {/* Zoom Controls Overlay */}
            {modelsLoaded && (
                <div className="absolute top-4 right-4 z-30 bg-black/60 backdrop-blur-md border border-white/5 p-4 rounded-2xl flex flex-col items-center opacity-0 group-hover:opacity-100 transition-all duration-300">
                    <span className="text-yellow-500 text-[10px] font-bold mb-3 tracking-widest uppercase">Z-LVL: {cameraZoom.toFixed(1)}x</span>
                    <input 
                        type="range" 
                        min="1" 
                        max="3" 
                        step="0.1" 
                        value={cameraZoom}
                        onChange={(e) => setCameraZoom(parseFloat(e.target.value))}
                        className="writing-mode-vertical h-32 accent-yellow-500 cursor-pointer"
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
                    transition: 'transform 0.2s cubic-bezier(0.4, 0, 0.2, 1)'
                }}
            />
            <canvas 
                ref={canvasRef} 
                className="absolute inset-0 z-10 pointer-events-none" 
                style={{ 
                    transform: `scale(${cameraZoom})`, 
                    transformOrigin: 'center center',
                    transition: 'transform 0.2s cubic-bezier(0.4, 0, 0.2, 1)'
                }}
            />
        </div>
    );
};

export default LiveHud;
