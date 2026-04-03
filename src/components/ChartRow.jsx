import { ResponsiveContainer, AreaChart, Area } from 'recharts';

const generateSparkData = (baseValue, length = 20) =>
  Array.from({ length }, (_, i) => ({
    x: i,
    y: baseValue + Math.sin(i * 0.5) * (baseValue * 0.1),
  }));

export default function ChartRow({ base, statusColor, idx, i }) {
  const data = generateSparkData(base);
  const getColor = (status) => {
    if (status === 'red') return { stroke: '#ef4444', fill: 'rgba(239, 68, 68, 0.3)' };
    if (status === 'green') return { stroke: '#22c55e', fill: 'rgba(34, 197, 94, 0.3)' };
    return { stroke: '#eab308', fill: 'rgba(234, 179, 8, 0.3)' };
  };

  const { stroke, fill } = getColor(statusColor);

  return (
    <div className="h-8 md:h-10 bg-slate-800/40 overflow-hidden border border-slate-600/50 shadow-inner">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 2, right: 2, bottom: 2, left: 2 }}>
          <defs>
            <linearGradient id={`grad-${idx}-${i}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={stroke} stopOpacity={0.6} />
              <stop offset="95%" stopColor={stroke} stopOpacity={0} />
            </linearGradient>
          </defs>
          <Area
            type="monotone"
            dataKey="y"
            stroke={stroke}
            fill={`url(#grad-${idx}-${i})`}
            strokeWidth={2}
            dot={false}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}