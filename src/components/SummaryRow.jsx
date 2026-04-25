import React, { useState } from 'react';

export const SummaryRow = ({ 
  label, 
  values = [], 
  result, 
  percent, 
  isGray, 
  isPdt = false, 
  onValueChange 
}) => {
  const [editingIdx, setEditingIdx] = useState(null);

  const formatDisplay = (val) => {
    if (val === undefined || val === null || val === '') return '0';
    return val;
  };

  return (
    <tr className={`border-b border-slate-700 h-10 transition-colors ${
      isPdt ? 'bg-cyan-950/30' : 'hover:bg-white/5'
    }`}>
      {/* Label */}
      <td className={`border-r border-slate-700 px-2 font-bold uppercase whitespace-nowrap text-[10px] ${
        isPdt ? 'text-cyan-400' : 'text-slate-200'
      }`}>
        {label}
      </td>

      {/* 8 Hours Cells */}
      {[...Array(8)].map((_, i) => (
        <td
          key={i}
          className={`border-r border-slate-700 text-center font-mono text-[11px] relative ${
            isPdt ? 'cursor-pointer group' : ''
          }`}
          onClick={() => isPdt && setEditingIdx(i)}
        >
          {isPdt && editingIdx === i ? (
            <input
              autoFocus
              type="number"
              className="absolute inset-0 w-full h-full bg-cyan-500 text-black font-black text-center outline-none border-2 border-white z-10"
              value={values[i]}
              onChange={(e) => onValueChange(i, e.target.value)}
              onBlur={() => setEditingIdx(null)}
              onKeyDown={(e) => e.key === 'Enter' && setEditingIdx(null)}
            />
          ) : (
            <div className={`w-full h-full flex items-center justify-center ${
              isPdt ? 'border border-dashed border-cyan-700/50 group-hover:border-cyan-400 group-hover:bg-cyan-400/10' : ''
            }`}>
              <span className={isPdt ? 'text-cyan-300 font-bold' : 'text-slate-400'}>
                {formatDisplay(values[i])}
              </span>
            </div>
          )}
        </td>
      ))}

      {/* Result Column */}
      <td className={`border-r border-slate-700 text-center font-bold text-[11px] ${
        isPdt ? 'bg-cyan-900/40 text-cyan-300' : isGray ? 'text-slate-500 bg-slate-900/30' : 'text-cyan-400'
      }`}>
        {formatDisplay(result)}
      </td>

      {/* Percent Column */}
      <td className={`text-center font-bold text-[11px] ${
        isPdt ? 'bg-cyan-900/20 text-cyan-500' : 'text-white bg-slate-900/20'
      }`}>
        {percent && percent !== '-' ? `${percent}%` : '-'}
      </td>
    </tr>
  );
};