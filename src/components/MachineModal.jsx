import React from 'react';

const MachineModal = ({ machine, onClose, onAction }) => {
  if (!machine) return null;

  const menuOptions = [
    { id: 'delivery', label: 'SCREEN DELIVERY' },
    { id: 'detail', label: 'MACHINE DETAIL 2' },
    { id: 'summary', label: 'SHIFT SUMMARY PAGE' },
  ];

  return (
    <div className="fixed inset-0 bg-[#0a0f1c]/90 backdrop-blur-md flex items-center justify-center z-100 p-4">
      <div className="w-full max-w-sm bg-[#111827] border border-slate-700 p-8 shadow-2xl relative overflow-hidden">
        {/* Glow Effect */}
        <div className="absolute -top-10 -right-10 w-32 h-32 bg-cyan-500/10 blur-3xl rounded-full" />
        
        <div className="text-center mb-8">
          <p className="text-[10px] font-black text-cyan-500 tracking-[0.4em] uppercase mb-2">Selected Unit</p>
          <h2 className="text-3xl font-black text-white italic uppercase tracking-tighter border-b-2 border-cyan-500 inline-block pb-1">
            {machine.name}
          </h2>
        </div>

        <div className="grid gap-4">
          {menuOptions.map((opt) => (
            <button
              key={opt.id}
              onClick={() => onAction(opt.id)}
              className="w-full py-4 bg-slate-900 border border-slate-700 hover:border-cyan-500 hover:bg-cyan-500/10 text-white font-bold transition-all uppercase italic text-lg group flex justify-between px-6 items-center"
            >
              <span>{opt.label}</span>
              <span className="text-cyan-500 group-hover:translate-x-2 transition-transform">→</span>
            </button>
          ))}
        </div>

        <button 
          onClick={onClose}
          className="mt-8 w-full text-slate-500 font-bold hover:text-white transition-colors text-xs uppercase tracking-widest"
        >
          [ Cancel / Close ]
        </button>
      </div>
    </div>
  );
};

export default MachineModal;