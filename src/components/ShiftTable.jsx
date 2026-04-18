import { SummaryRow } from "./SummaryRow";

export default function ShiftTable({ config, data }) {
  const s = data || {};
  const hours = s.hours || [];
  const totals = s.shiftTotals || {};

  return (
    <div className="border border-slate-700 bg-black/40 overflow-hidden shadow-xl rounded-lg">
      <table className="w-full text-[11px] border-collapse">
        <thead>
          <tr className="h-12">
            <th className={`${config.headerBg} w-24 text-lg font-black italic`}>
              {config.name}
            </th>
            {hours.map((h, i) => (
              <th key={i} className="border-r border-slate-700 bg-slate-800/50 text-[9px] px-1">
                JAM KE-{h.jamKe}
              </th>
            ))}
            <th className="bg-slate-800/80 w-24 text-[9px]">RESULT SHIFTLY (MIN)</th>
            <th className="bg-slate-800/80 w-24 text-[9px]">RESULT SHIFTLY (%)</th>
          </tr>
        </thead>

        <tbody>
          <tr className="h-8">
            <td className="text-center text-slate-500 italic">
              {s.totalShiftMinutes || 480}
            </td>
            {hours.map((h, i) => (
              <td key={i} className="text-center text-[9px] whitespace-pre-line">
                {h.timeRange?.replace("-", "\n")}
              </td>
            ))}
            <td />
            <td />
          </tr>

          <SummaryRow label="PR" values={hours.map(h => `${h.pr || 0}%`)} percent={totals.pr} />
          <SummaryRow label="PDT ( MIN )" values={hours.map(h => h.pdtMin)} result={totals.totalPdtMin} percent={totals.pdtPercent} />
          <SummaryRow label="UPDT ( MIN )" values={hours.map(h => h.updtMin)} result={totals.totalUpdtMin} percent={totals.updtPercent} />
          <SummaryRow label="UPST ( FREQ )" values={hours.map(h => h.upstFreq)} result={totals.totalUpstFreq} />
        </tbody>
      </table>
    </div>
  );
}