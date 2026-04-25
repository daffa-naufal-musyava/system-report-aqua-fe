import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useMachineSummary } from '../contexts/machineSummaryProvider';
import { useAuth } from '../contexts/authContext';
import mesintopologi from '../assets/login/mesintopologi.png';
import Button from '../components/Button';
import CardTable from '../components/CardTable'; // Import komponen baru

export default function ScreenDelivery() {
  const { lineId } = useParams();
  const navigate = useNavigate();
  const { machines, loading, lineStatus } = useMachineSummary();
  const { user } = useAuth();

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

      <Button 
        variant="primary" 
        className="absolute bg-red-500! top-6 right-6 z-50 rounded-lg scale-90" 
        onClick={() => navigate(-1)}
      >
        Back
      </Button>

      {/* Topology Map */}
      <div className="relative w-full h-[85vh] max-w-7xl mx-auto mt-4">
        <img 
            src={mesintopologi} 
            alt="Layout" 
            className="w-full h-full object-contain opacity-50"
        />

        {machines.map((m) => {
          const config = machinePositions[m.machineId];
          if (!config || !config.use) return null;

          return (
            <div 
              key={m.machineId}
              className="absolute z-40 transition-all duration-500"
              style={{ 
                  top: `calc(${config.top} + ${config.tableOffset.top})`, 
                  left: `calc(${config.left} + ${config.tableOffset.left})` 
              }}
            >
              <CardTable machine={m} user={user} />
            </div>
          );
        })}

        {/* Labels Statis */}
        <div className="absolute top-[34%] left-[24%] text-[10px] font-black text-slate-500 border-b border-cyan-900 tracking-widest uppercase">DDS BOARD</div>
        <div className="absolute top-[52%] left-[30%] text-[10px] font-black text-slate-500 border-b border-cyan-900 tracking-widest uppercase">CIL BOARD</div>
        <div className="absolute top-[54%] left-[20%] text-[10px] font-black text-slate-500 border-b border-cyan-900 tracking-widest uppercase">PDCA BOARD</div>
      </div>
    </div>
  );
}