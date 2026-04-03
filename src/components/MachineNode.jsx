const RunIcon = () => (
  <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
    <path d="M13.49 5.48c0 1.1-.89 2-2 2s-2-.9-2-2 .9-2 2-2 2 .9 2 2zm-3.6 13.9l1-4.4 2.1 2v6h2v-7.5l-2.1-2 .6-3c1.3 1.5 3.3 2.5 5.5 2.5v-2c-1.9 0-3.5-1-4.3-2.4l-1-1.6c-.4-.6-1-1-1.7-1-.3 0-.5.1-.8.1l-5.2 2.2v4.7h2v-3.4l1.8-.7-1.6 8.1-4.9-1-.4 2 5.3 1.2z" />
  </svg>
);

export default function MachineNode({ machine, onClick }) {
  // Styles logic
  const statusStyles = {
    RUN: 'bg-green-500 shadow-[0_0_15px_rgba(34,197,94,0.6)]',
    // Warning dikasih animate-pulse biar kedap-kedip
    WARNING: 'bg-yellow-500 shadow-[0_0_20px_rgba(234,179,8,0.8)] animate-pulse border-2 border-white/50',
    // Stop statis & solid
    STOP: 'bg-red-600 shadow-[0_0_15px_rgba(239,68,68,0.6)] border-2 border-red-400'
  };

  return (
    <div 
      className="absolute cursor-pointer group flex items-center justify-center"
      style={{ 
        top: machine.position.top, 
        left: machine.position.left, 
        width: machine.position.width, 
        height: machine.position.height,
        right: machine.position.right // Jaga-jaga kalau ada data pakai 'right'
      }}
      onClick={() => onClick(machine)}
    >
      <div className={`relative w-11 h-11 rounded-full flex items-center justify-center transition-all duration-300 group-hover:scale-125 z-10 ${statusStyles[machine.status]}`}>
        
        {/* Icon Logic */}
        {machine.status === 'RUN' && <RunIcon />}
        
        {machine.status === 'WARNING' && (
          <span className="font-black text-2xl text-white italic drop-shadow-md">!</span>
        )}
        
        {machine.status === 'STOP' && (
          <div className="w-3.5 h-3.5 bg-white rounded-sm" />
        )}
        
        {/* Tooltip - Solid Black, No Blur */}
        <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-black border border-slate-700 text-white text-[10px] font-black px-3 py-1.5 opacity-0 group-hover:opacity-100 transition-all pointer-events-none whitespace-nowrap z-[60] uppercase tracking-widest shadow-2xl">
          <span className="text-cyan-500 mr-1 opacity-70">UNIT:</span>
          {machine.name}
        </div>

        {/* Glow Effect Khusus Warning (Kedap-kedip tambahan) */}
        {machine.status === 'WARNING' && (
          <div className="absolute inset-0 rounded-full bg-yellow-400 animate-ping opacity-20" />
        )}
      </div>
    </div>
  );
};