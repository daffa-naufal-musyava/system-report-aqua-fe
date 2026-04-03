export default function ShiftTable({ shift }) {
  return (
    <div className="bg-[#111827]/70 backdrop-blur-sm border border-slate-700/50 rounded-xl p-5 shadow-lg mb-6 overflow-x-auto">
      <div className="flex items-center justify-between mb-4 min-w-[800px]">
        <h2 className="text-xl font-bold text-yellow-400">{shift.name}</h2>
        <span className="text-sm text-slate-300 italic">{shift.timeRange} ({shift.duration} MENIT)</span>
      </div>

      <table className="w-full text-sm text-left border-collapse min-w-[800px]">
        <thead>
          <tr className="bg-gradient-to-r from-yellow-900/50 to-amber-900/50 text-[10px] tracking-widest">
            <th className="p-3">PERFORMA MC</th>
            {Array.from({ length: 8 }, (_, i) => (
              <th key={i} className="p-3 text-center">KE-{i + 1}</th>
            ))}
            <th className="p-3 text-center uppercase">Result<br />Shiftly<br />(Min)</th>
            <th className="p-3 text-center uppercase">Result<br />Shiftly<br />(%)</th>
          </tr>
        </thead>
        <tbody className="font-medium">
          {/* PR Row */}
          <tr className="border-t border-slate-700/50 hover:bg-slate-800/30">
            <td className="p-3 text-cyan-400">PR</td>
            {shift.prValues.map((val, i) => (
              <td key={i} className="p-3 text-center">{val}</td>
            ))}
            <td className="p-3 text-center bg-slate-800/20">-</td>
            <td className="p-3 text-center font-bold text-green-400">{shift.prPercent}</td>
          </tr>

          {/* PDT Row */}
          <tr className="border-t border-slate-700/50 hover:bg-slate-800/30">
            <td className="p-3 text-cyan-400">PDT (MIN)</td>
            {shift.pdtMin.map((val, i) => (
              <td key={i} className="p-3 text-center">{val || '-'}</td>
            ))}
            <td className="p-3 text-center bg-slate-800/20">-</td>
            <td className="p-3 text-center font-bold text-green-400">{shift.pdtPercent}</td>
          </tr>

          {/* UPDT Row */}
          <tr className="border-t border-slate-700/50 hover:bg-slate-800/30">
            <td className="p-3 text-cyan-400">UPDT (MIN)</td>
            {shift.updtMin.map((val, i) => (
              <td key={i} className="p-3 text-center">{val}</td>
            ))}
            <td className="p-3 text-center font-bold text-cyan-400">{shift.updtTotal}</td>
            <td className="p-3 text-center font-bold text-cyan-400">{shift.updtPercent}</td>
          </tr>

          {/* FREQ Row */}
          <tr className="border-t border-slate-700/50">
            <td className="p-3 text-cyan-400">UPDT (FREQ)</td>
            <td colSpan={8} className="p-3 text-center italic text-slate-400 tracking-widest">{shift.updtFreq}</td>
            <td colSpan={2} className="p-3"></td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}