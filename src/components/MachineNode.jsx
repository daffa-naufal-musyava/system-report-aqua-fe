import React from 'react';
import { RunIcon, StopIcon } from './StatusLegend';

// Komponen Warning Icon kecil untuk ditaruh di dalam lingkaran jika perlu
const WarningSymbol = () => <span className="text-white font-bold text-xl">!</span>;

const MachineNode = ({ machine, position, onClick }) => {
  const isRunning = machine.status === 'RUNNING';
  // Logic Status: Kita asumsikan jika latestAlarmCode > 0 maka statusnya WARNING
  const isWarning = machine.latestAlarmCode > 0;

  // Menentukan warna dan animasi berdasarkan 3 status
  const getStatusStyles = () => {
    if (isWarning) {
      return 'bg-yellow-500/90 border-yellow-300 shadow-yellow-500/40 animate-pulse';
    }
    if (isRunning) {
      return 'bg-green-600/90 border-green-400 shadow-green-500/20';
    }
    return 'bg-red-600/90 border-red-400 shadow-red-500/20';
  };

  return (
    <div
      className="absolute cursor-pointer group flex items-center justify-center"
      style={position}
      onClick={() => onClick(machine)}
    >
      <div className={`relative w-11 h-11 rounded-full flex items-center justify-center border-2 transition-all duration-300 shadow-xl backdrop-blur-sm group-hover:scale-110
        ${getStatusStyles()}`}
      >
        {/* Icon berdasarkan status */}
        {isWarning ? (
          <WarningSymbol />
        ) : isRunning ? (
          <RunIcon />
        ) : (
          <StopIcon />
        )}

        {/* Tooltip on Hover */}
        <div className="absolute -top-20 left-1/2 -translate-x-1/2 bg-black/90 border border-slate-700 p-2 opacity-0 group-hover:opacity-100 transition-all z-50 min-w-[140px] pointer-events-none rounded shadow-2xl backdrop-blur-md">
          <div className="flex flex-col gap-1">
            <p className="text-[10px] text-cyan-400 font-black uppercase border-b border-slate-800 pb-1">
              {machine.machineName}
            </p>
            <div className="flex justify-between items-center text-[9px]">
              <span className="text-slate-400">Status:</span>
              <span className={`font-bold ${isWarning ? 'text-yellow-400' : isRunning ? 'text-green-400' : 'text-red-400'}`}>
                {isWarning ? 'WARNING' : machine.status}
              </span>
            </div>
            <div className="flex justify-between items-center text-[9px]">
              <span className="text-slate-400">Count:</span>
              <span className="text-white font-mono">{machine.lastBottleCount?.toLocaleString() || 0}</span>
            </div>
            <div className="flex justify-between items-center text-[9px]">
              <span className="text-slate-400">Perf:</span>
              <span className="text-white">{machine.performanceRate || 0}%</span>
            </div>
            {isWarning && (
              <div className="mt-1 pt-1 border-t border-slate-800 text-[8px] text-yellow-500 font-bold italic">
                Alarm: {machine.latestAlarmCode}
              </div>
            )}
          </div>
          {/* Arrow Tooltip */}
          <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-black rotate-45 border-r border-b border-slate-700"></div>
        </div>
      </div>
    </div>
  );
};

export default MachineNode;