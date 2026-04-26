import React, { useState } from 'react';

export const SummaryRow = ({ 
  label, values = [], result, percent, isPdt, canEdit, isLocked, onUnlockClick, onValueChange, onBlurAction 
}) => {
  const [editingIdx, setEditingIdx] = useState(null);

  return (
    <tr className={`border-b border-slate-700 h-10 ${isPdt ? 'bg-cyan-950/20' : ''}`}>
      <td className="border-r border-slate-700 px-2 flex items-center justify-between h-10">
        <span className={`font-bold text-[10px] ${isPdt ? 'text-cyan-400' : 'text-slate-400'}`}>{label}</span>
        
        {/* BUTTON UNLOCK KHUSUS BARIS PDT */}
        {isPdt && canEdit && (
          <button 
            onClick={onUnlockClick}
            className={`ml-2 p-1 rounded transition-colors ${isLocked ? 'bg-red-500/20 hover:bg-red-500/40 text-red-500' : 'bg-green-500/20 text-green-500'}`}
            title={isLocked ? "Click to Unlock" : "Data Unlocked"}
          >
            {isLocked ? '🔒' : '🔓'}
          </button>
        )}
      </td>

      {[...Array(8)].map((_, i) => {
        // Input hanya aktif jika User adalah PPIC DAN status sudah Unlocked
        const inputActive = isPdt && canEdit && !isLocked;

        return (
          <td
            key={i}
            className={`border-r border-slate-700 text-center relative ${inputActive ? 'cursor-pointer hover:bg-cyan-400/10' : 'bg-black/20'}`}
            onClick={() => inputActive && setEditingIdx(i)}
          >
            {editingIdx === i ? (
              <input
                autoFocus
                type="number"
                className="absolute inset-0 w-full h-full bg-cyan-600 text-white font-bold text-center outline-none z-30"
                value={values[i]}
                onChange={(e) => onValueChange(i, e.target.value)}
                onBlur={() => { setEditingIdx(null); onBlurAction(i, values[i]); }}
                onKeyDown={(e) => e.key === 'Enter' && e.target.blur()}
              />
            ) : (
              <span className={`${isPdt ? (isLocked ? 'text-slate-500 font-light' : 'text-cyan-300 font-bold') : 'text-slate-300'}`}>
                {values[i] || 0}
              </span>
            )}
          </td>
        );
      })}

      <td className="border-r border-slate-700 text-center font-bold text-cyan-400">{result || 0}</td>
      <td className="text-center font-bold text-white">{percent ? `${percent}%` : '-'}</td>
    </tr>
  );
};