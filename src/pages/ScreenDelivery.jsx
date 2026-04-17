import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useMachineSummary } from '../contexts/machineSummaryProvider';
import mesintopologi from '../assets/login/mesintopologi.png';
import Button from '../components/Button';
import MachineNode from '../components/MachineNode'; // Re-use komponen lingkaran

// Komponen Tabel Kecil (Stats)
const MachineStatsTable = ({ machine }) => {
  // Format durasi UPDT dari ms ke menit/detik agar lebih manusiawi
  const updtMinutes = (machine.currentUpdtDurationMs / 60000).toFixed(1);

  const stats = [
    { label: "PR", val: `${machine.performanceRate || 0}%` },
    { label: "UPST", val: machine.upstCount || 0 }, // Ambil data upstCount
    { label: "UPDT", val: `${updtMinutes}m` },     // Ambil data currentUpdtDurationMs
    { label: "CNT", val: machine.lastBottleCount?.toLocaleString() || 0 },
  ];

  return (
    <Link 
      to={`/shift-summary/${machine.machineId}`} 
      className="flex flex-col cursor-pointer bg-black/80 backdrop-blur-md border border-slate-700 rounded-md overflow-hidden text-[9px] w-24 shadow-2xl hover:border-cyan-500 transition-colors"
    >
      <div className="bg-slate-800 py-1 px-1 text-center font-bold border-b border-slate-700 text-cyan-400 uppercase tracking-tighter">
        {machine.machineName}
      </div>    
      {stats.map((stat) => (
        <div key={stat.label} className="flex border-b border-slate-700 last:border-0">
          <div className="w-1/2 bg-slate-900/50 px-1.5 py-0.5 border-r border-slate-700 font-bold text-slate-400">{stat.label}</div>
          <div className="w-1/2 px-1.5 py-0.5 text-right font-mono text-white">{stat.val}</div>
        </div>
      ))}
    </Link>
  );
};

export default function ScreenDelivery() {
  const { lineId } = useParams();
  const navigate = useNavigate();
  const { machines, loading, lineStatus } = useMachineSummary();
  const [selectedMachine, setSelectedMachine] = useState(null);

  // Mapping koordinat yang SAMA dengan LineDetail
  const machinePositions = {
    'AQ-PLT-01': { use: true, top: '18%', left: '10%', tableOffset: { top: '-70px', left: '-20px' } },
    'AQ-WRP-01': { use: true, top: '18%', left: '47%', tableOffset: { top: '-75px', left: '0px' } },
    'AQ-WRP-02': { use: true, top: '20%', left: '35%', tableOffset: { top: '-75px', left: '0px' } },
    'AQ-CAP-01': { use: true, top: '50%', left: '80%', tableOffset: { top: '50px', left: '10px' } },
    'AQ-BLW-01': { use: true, top: '50%', left: '75%', tableOffset: { top: '-80px', left: '20px' } },
    'AQ-FIL-01': { use: true, top: '70%', left: '77%', tableOffset: { top: '50px', left: '-30px' } },
    'AQ-LBL-01': { use: true, top: '60%', left: '36%', tableOffset: { top: '55px', left: '-20px' } },
    'AQ-CON-01': { use: true, top: '40%', left: '57.5%', tableOffset: { top: '50px', left: '0px' } },
  };

  if (loading && machines.length === 0) {
    return <div className="min-h-screen bg-[#0a0f1c] flex items-center justify-center text-white italic">Loading Delivery Screen...</div>;
  }

  return (
    <div className="min-h-screen bg-[#0a0f1c] text-white relative font-sans p-4 overflow-hidden">
      {/* Background Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/60 pointer-events-none" />

      {/* Header Info */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20">
        <div className="flex bg-black/90 border-2 border-slate-800 px-8 py-3 items-center gap-6 shadow-[0_0_30px_rgba(0,0,0,0.5)] rounded-lg">
          <span className="text-[#70EC4B] text-3xl font-black italic tracking-tighter">LINE {lineId || "1"}</span>
          <div className="w-[2px] h-8 bg-slate-700"></div>
          <span className="text-[#70EC4B] text-3xl font-black italic tracking-tighter uppercase">600 ML</span>
          <div className="w-[2px] h-8 bg-slate-700"></div>
          <span className={`text-xl font-bold uppercase ${lineStatus.stopped === 0 ? 'text-green-500' : 'text-red-500'}`}>
            {lineStatus.stopped === 0 ? '● Running' : '● Issues'}
          </span>
        </div>
      </div>

      {/* Back Button */}
      <Button 
        variant="primary" 
        className="absolute top-6 right-6 z-50 rounded-lg scale-90" 
        onClick={() => navigate(-1)}
      >
        BACK TO DASHBOARD
      </Button>

      {/* Topology Map Canvas */}
      <div className="relative w-full h-[85vh] max-w-7xl mx-auto mt-4">
        <img 
            src={mesintopologi} 
            alt="Layout" 
            className="w-full h-full object-contain opacity-50 transition-opacity duration-1000"
        />

        {machines.map((m) => {
          const config = machinePositions[m.machineId];
          if (!config || !config.use) return null;

          return (
            <div key={m.machineId}>
              {/* Stats Table Floating */}
              <div 
                className="absolute z-40 transition-all duration-500"
                style={{ 
                    top: `calc(${config.top} + ${config.tableOffset.top})`, 
                    left: `calc(${config.left} + ${config.tableOffset.left})` 
                }}
              >
                <MachineStatsTable machine={m} />
              </div>
            </div>
          );
        })}

        {/* Static Labels */}
        <div className="absolute top-[34%] left-[24%] text-[10px] font-black text-slate-500 border-b border-cyan-900 tracking-widest uppercase">DDS BOARD</div>
        <div className="absolute top-[52%] left-[30%] text-[10px] font-black text-slate-500 border-b border-cyan-900 tracking-widest uppercase">CIL BOARD</div>
        <div className="absolute top-[54%] left-[20%] text-[10px] font-black text-slate-500 border-b border-cyan-900 tracking-widest uppercase">PDCA BOARD</div>
      </div>

      {/* Modal Re-use logic if needed */}
      {selectedMachine && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-[100] flex items-center justify-center p-4">
           <div className="bg-[#111827] border border-slate-700 p-8 rounded-2xl w-full max-w-sm shadow-2xl">
              <h3 className="text-2xl font-black text-center mb-6 text-cyan-400 italic uppercase">{selectedMachine.machineName}</h3>
              <div className="flex flex-col gap-3">
                <button onClick={() => navigate(`/machine-detail/${selectedMachine.machineId}`)} className="w-full py-4 bg-slate-800 hover:bg-cyan-600 transition-all rounded-xl font-bold uppercase text-sm">View Analytics</button>
                <button onClick={() => setSelectedMachine(null)} className="w-full py-2 mt-4 text-slate-500 font-bold uppercase text-xs tracking-widest">Close</button>
              </div>
           </div>
        </div>
      )}
    </div>
  );
}