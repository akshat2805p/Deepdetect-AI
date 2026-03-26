import React from 'react';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, BarChart, Bar, XAxis } from 'recharts';
import { Activity } from 'lucide-react';

interface ForensicMetricsProps {
    result: any;
}

const ForensicMetrics: React.FC<ForensicMetricsProps> = ({ result }) => {
    if (!result) return null;

    const PIE_DATA = [
        { name: 'Real', value: result.result === 'Real' ? result.confidenceScore : 100 - result.confidenceScore },
        { name: 'Synthetic', value: result.result === 'Fake' ? result.confidenceScore : 100 - result.confidenceScore },
    ];

    const COLORS = ['#10b981', '#ef4444'];

    const BAR_DATA = [
        { name: 'PPL', value: result.analysis?.perplexity || 0 },
        { name: 'BST', value: result.analysis?.burstiness || 0 },
        { name: 'SIM', value: result.analysis?.similarityScore || 0 },
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
            {/* Authenticity Pie Chart */}
            <div className="bg-neutral-900 border border-neutral-800 p-6 rounded-3xl flex flex-col items-center justify-center relative group hover:border-neutral-700 transition-all">
                <h4 className="absolute top-4 left-6 text-[10px] font-bold text-gray-500 uppercase tracking-widest">Neural Split</h4>
                <div className="w-full h-[180px] mt-4">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={PIE_DATA}
                                innerRadius={50}
                                outerRadius={70}
                                paddingAngle={8}
                                dataKey="value"
                                stroke="none"
                            >
                                {PIE_DATA.map((_, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} className="drop-shadow-lg" />
                                ))}
                            </Pie>
                            <Tooltip 
                                contentStyle={{ backgroundColor: '#050505', borderRadius: '12px', border: '1px solid #222', fontSize: '12px' }} 
                                itemStyle={{ color: '#fff' }}
                            />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
                <div className="flex gap-6 text-[10px] font-bold tracking-widest text-gray-500 mt-2 uppercase">
                    <span className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" /> Real</span>
                    <span className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]" /> Synthetic</span>
                </div>
            </div>

            {/* Metrics Bar Chart */}
            <div className="bg-neutral-900 border border-neutral-800 p-6 rounded-3xl group hover:border-neutral-700 transition-all min-h-[220px]">
                <h4 className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-6 flex items-center gap-2">
                    <Activity className="w-3 h-3 text-yellow-500" /> Forensic Signals
                </h4>
                <div className="w-full h-[160px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={BAR_DATA}>
                            <XAxis 
                                dataKey="name" 
                                tick={{ fill: '#444', fontSize: 10, fontWeight: 700 }} 
                                axisLine={false} 
                                tickLine={false} 
                                dy={10}
                            />
                            <Bar 
                                dataKey="value" 
                                fill="url(#barGradient)" 
                                radius={[6, 6, 0, 0]} 
                                barSize={40}
                            />
                            <defs>
                                <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="0%" stopColor="#D4AF37" stopOpacity={0.8}/>
                                    <stop offset="100%" stopColor="#D4AF37" stopOpacity={0.2}/>
                                </linearGradient>
                            </defs>
                            <Tooltip 
                                cursor={{ fill: 'rgba(255,255,255,0.03)' }} 
                                contentStyle={{ backgroundColor: '#050505', border: '1px solid #222', borderRadius: '12px', fontSize: '12px' }} 
                            />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
};

export default ForensicMetrics;
