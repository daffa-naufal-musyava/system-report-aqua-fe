export default function DashboardCard({ 
  title, 
  value, 
  change = "", 
  icon, 
  colorClass, 
  isNegative = false 
}) {
  const hasChange = change.length > 0;
  
  const isUp = change.includes('+');
const isDown = change.includes('-');

const trendColor = isUp 
  ? (isNegative ? 'text-rose-400' : 'text-emerald-400') 
  : isDown 
    ? (isNegative ? 'text-emerald-400' : 'text-rose-400') 
    : 'text-slate-400'; 

  return (
    <div className="bg-[#111827]/80 backdrop-blur-sm border border-slate-700/50 rounded-xl p-5 shadow-lg flex flex-col justify-between hover:border-slate-600 transition-colors">
      <div className="flex items-center gap-2 mb-3">
        <span className={colorClass}>{icon}</span>
        <span className="text-[10px] font-bold text-slate-400 tracking-widest uppercase">
          {title}
        </span>
      </div>
      <div>
        <div className="text-3xl font-bold tracking-tight">{value}</div>
        
        {hasChange && (
          <div className={`text-xs mt-1 font-medium flex items-center gap-1 ${trendColor}`}>
            <span className="text-[10px]">
              {isUp ? '▲' : isDown ? '▼' : '●'}
            </span>
            {change}
          </div>
        )}
      </div>
    </div>
  );
}