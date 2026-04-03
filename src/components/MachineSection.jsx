import ChartRow from './ChartRow';

export default function MachineSection({ section, idx }) {
  return (
    <div className="bg-[#111827]/70 backdrop-blur-sm border border-slate-700/50 rounded-xl p-5 shadow-lg">
      <div className="flex items-center gap-2 mb-4 text-lg font-semibold text-slate-300">
        <span className="text-cyan-400">+</span>
        {section.title}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-[auto_1fr] gap-6 items-start">
        <div className="mb-3 flex flex-col gap-4 min-w-[300px]">
          {section.values.map((val, i) => (
            <div
              key={i}
              className={`px-5 py-4 text-center text-2xl md:text-3xl font-bold rounded-lg shadow-inner 
                ${section.statusColors[i] === 'red' ? 'bg-red-600/90' : 'bg-green-600/90'}`}
            >
              {val}
            </div>
          ))}
        </div>

        <div className="space-y-5 md:space-y-6 flex-1">
          {section.chartBases.map((base, i) => (
            <ChartRow 
              key={i} 
              base={base} 
              statusColor={section.statusColors[i]} 
              idx={idx} 
              i={i} 
            />
          ))}
        </div>
      </div>
    </div>
  );
}