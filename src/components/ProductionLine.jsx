import { Link } from 'react-router-dom';
import { AreaChart, Area, ResponsiveContainer } from 'recharts';

export default function ProductionLine({ line }) {
    return (
        <div className="bg-[#111827]/80 backdrop-blur-sm border border-slate-700/50 rounded-xl p-4 flex flex-col md:flex-row items-center gap-6 hover:border-slate-500/70 transition-all group">

            {/* 1. Nama Line */}
            <div className="flex items-center gap-4 w-full md:w-44 shrink-0">
                <div 
                    className="w-1.5 h-10 rounded-full shadow-lg" 
                    style={{ 
                        backgroundColor: line.hexColor,
                        boxShadow: `0 0 12px ${line.hexColor}80` 
                    }} 
                />
                <div>
                    <h3 
                        className="text-lg font-black uppercase tracking-tighter italic"
                        style={{ color: line.hexColor }}
                    >
                        {line.name}
                    </h3>
                    <p className="text-[10px] text-slate-500 font-mono">STATION_{line.id}00</p>
                </div>
            </div>

            {/* 2. Chart */}
            <div className="flex-1 w-full h-20 min-w-[150px]">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={line.data}>
                        <defs>
                            <linearGradient id={`poly-${line.id}`} x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor={line.hexColor} stopOpacity={0.3} />
                                <stop offset="95%" stopColor={line.hexColor} stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <Area
                            type="stepAfter"
                            dataKey="value"
                            stroke={line.hexColor}
                            fill={`url(#poly-${line.id})`}
                            strokeWidth={2}
                            isAnimationActive={false}
                            dot={{ r: 3, fill: line.hexColor, strokeWidth: 1, stroke: '#0a0f1c' }}
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>

            {/* 3. Status & Link */}
            <div className="flex items-center justify-between md:justify-end gap-6 w-full md:w-64 shrink-0 border-t md:border-t-0 border-slate-800/50 pt-3 md:pt-0">
                <div className="flex flex-col items-end">
                    <span className="px-3 py-1 bg-blue-700 shadow-blue-400 shadow-md text-white text-[16px] font-black rounded-md tracking-widest uppercase">
                        {line.status}
                    </span>
                </div>
                <span className='h-10 bg-slate-700 w-0.5'></span>
                <Link to="/line/1" className="px-4 py-2 bg-blue-700 text-white shadow-blue-400 shadow-md text-[12px] font-black uppercase rounded-md hover:bg-blue-600 transition-colors">
                    SELENGKAPNYA
                </Link>
            </div>
        </div>
    );
}