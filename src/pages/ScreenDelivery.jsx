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
    'AQ-PLT-01': {
      name: 'Palletizer Robot',
      use: true,
      top: '30%',
      left: '12%',
      tableOffset: { top: '-70px', left: '-20px' }
    },
    'AQ-WRP-01': {
      name: 'Wrapper 1',
      use: true,
      top: '35%',
      left: '53%',
      tableOffset: { top: '-75px', left: '0px' }
    },
    'AQ-CAP-01': {
      name: 'Capper Rotary',
      use: true,
      top: '60%',
      left: '87%',
      tableOffset: { top: '50px', left: '10px' }
    },
    'AQ-BLW-01': {
      name: 'Blower Alpha',
      use: true,
      top: '55%',
      left: '82%',
      tableOffset: { top: '-80px', left: '20px' }
    },
    'AQ-FIL-01': {
      name: 'Filler High-Speed',
      use: true,
      top: '73%',
      left: '81%',
      tableOffset: { top: '50px', left: '-30px' }
    },
    'AQ-LBL-01': {
      name: 'Labeler Front',
      use: true,
      top: '70%',
      left: '40%',
      tableOffset: { top: '55px', left: '-20px' }
    },
    'AQ-CON-01': {
      name: 'Panel Conveyor',
      use: true,
      top: '35%',
      left: '65%',
      tableOffset: { top: '50px', left: '0px' }
    },

    // Non-active machines
    'AQ-CAP-02': { use: false },
    'AQ-BLW-02': { use: false },
    'AQ-FIL-02': { use: false },
    'AQ-LBL-02': { use: false },
    'AQ-INK-01': { use: false },
    'AQ-INK-02': { use: false },
    'AQ-PCK-01': { use: false },
    'AQ-PCK-02': { use: false },
  };

  if (loading && machines.length === 0) {
    return <div className="min-h-screen bg-[#0a0f1c] flex items-center justify-center text-white italic">Loading Delivery Screen...</div>;
  }

  return (
    <div className="min-h-screen bg-[#0a0f1c] text-white relative font-sans p-4 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/60 pointer-events-none" />

      {/* Header Info */}
      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 z-20">
        <div className="flex bg-black/90 border-2 border-slate-800 px-8 py-3 items-center gap-6 shadow-[0_0_30px_rgba(0,0,0,0.5)] rounded-lg">
          <span className="text-[#70EC4B] text-xl font-black italic tracking-tighter">LINE {lineId || "1"}</span>
          <div className="w-[2px] h-8 bg-slate-700"></div>
          <span className="text-[#70EC4B] text-xl font-black italic tracking-tighter uppercase">600 ML</span>
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
      <div className="w-full overflow-auto">
        <div className="relative min-w-[1100px] aspect-[16/9] max-h-[85vh] max-w-7xl mx-auto mt-4">

          {/* IMAGE */}
          <img
            src={mesintopologi}
            alt="Layout"
            className="absolute inset-0 w-full h-full object-contain opacity-50 pointer-events-none select-none"
          />

          {/* MACHINE TABLE */}
          {machines.map((m) => {
            const config = machinePositions[m.machineId];
            if (!config || !config.use) return null;

            return (
              <div
                key={m.machineId}
                className="absolute z-40 transition-all duration-500"
                style={{
                  top: `calc(${config.top} + ${config.tableOffset?.top || '0px'})`,
                  left: `calc(${config.left} + ${config.tableOffset?.left || '0px'})`,
                  transform: 'translate(-50%, -50%)'
                }}
              >
                <CardTable machine={m} user={user} />
              </div>
            );
          })}

          {/* LABELS */}
          <div className="absolute top-[34%] left-[24%] -translate-x-1/2 -translate-y-1/2 text-[10px] font-black text-slate-500 border-b border-cyan-900 tracking-widest uppercase">
            DDS BOARD
          </div>

          <div className="absolute top-[52%] left-[30%] -translate-x-1/2 -translate-y-1/2 text-[10px] font-black text-slate-500 border-b border-cyan-900 tracking-widest uppercase">
            CIL BOARD
          </div>

          <div className="absolute top-[54%] left-[20%] -translate-x-1/2 -translate-y-1/2 text-[10px] font-black text-slate-500 border-b border-cyan-900 tracking-widest uppercase">
            PDCA BOARD
          </div>

        </div>
      </div>
    </div>
  );
}