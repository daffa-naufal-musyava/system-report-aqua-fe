const formatDisplay = (val, isPdtRow) => {
  if (isPdtRow) return '';
  if (val === undefined || val === null) return '';
  return val;
};

export const SummaryRow = ({ label, values = [], result, percent, isGray, isPdt = false }) => (
  <tr className="border-b border-slate-700 h-10">
    <td className="border-r border-slate-700 px-2 font-bold text-slate-200 uppercase whitespace-nowrap">
      {label}
    </td>
    {[...Array(8)].map((_, i) => (
      <td
        key={i}
        className={`border-r border-slate-700 text-center font-mono ${
          values[i] == 45 ? 'bg-slate-800' : ''
        }`}
      >
        {formatDisplay(values[i], isPdt)}
      </td>
    ))}
    <td
      className={`border-r border-slate-700 text-center font-bold ${
        isGray ? 'bg-slate-300 text-slate-300' : 'text-cyan-400'
      }`}
    >
      {formatDisplay(result, isPdt)}
    </td>
    <td className="text-center font-bold text-green-400">
      {isPdt
        ? ''
        : percent !== undefined && percent !== null
        ? `${percent}%`
        : ''}
    </td>
  </tr>
);