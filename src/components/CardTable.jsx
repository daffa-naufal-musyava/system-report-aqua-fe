import { Link } from 'react-router-dom';

const CardTable = ({ machine, user }) => {
  // Hitung durasi UPDT dalam menit
  const updtMinutes = (machine.currentUpdtDurationMs / 60000).toFixed(1);

  const stats = [
    { label: "PR", val: `${machine.performanceRate || 0}%` },
    { label: "PDT", val: machine.pdtCount || 0 },
    { label: "UPST", val: machine.upstCount || 0 }, 
    { label: "UPDT", val: `${updtMinutes}m` },     
  ];

  const cardContent = (
    <>
      {/* Header Nama Mesin */}
      <div className="bg-slate-800 py-1 px-1 text-center font-bold border-b border-slate-700 text-cyan-400 uppercase tracking-tighter">
        {machine.machineName}
      </div>
      
      {/* List Stats */}
      {stats.map((stat) => (
        <div key={stat.label} className="flex border-b border-slate-700 last:border-0">
          <div className="w-1/2 bg-slate-900/50 px-1.5 py-0.5 border-r border-slate-700 font-bold text-slate-400">
            {stat.label}
          </div>
          <div className="w-1/2 px-1.5 py-0.5 text-right font-mono text-white">
            {stat.val}
          </div>
        </div>
      ))}
    </>
  );

  // Jika user tidak login, tampilkan card mati (disabled)
  if (!user) {
    return (
      <div className="flex flex-col cursor-not-allowed bg-black/60 backdrop-blur-md border border-slate-700 rounded-md overflow-hidden text-[9px] w-24 shadow-2xl opacity-70">
        {cardContent}
      </div>
    );
  }

  // Jika user login, bungkus dengan Link
  return (
    <Link 
      to={`/shift-summary/${machine.machineId}`} 
      className="flex flex-col cursor-pointer bg-black/80 backdrop-blur-md border border-slate-700 rounded-md overflow-hidden text-[9px] w-24 shadow-2xl hover:border-cyan-500 transition-colors"
    >
      {cardContent}
    </Link>
  );
};

export default CardTable;