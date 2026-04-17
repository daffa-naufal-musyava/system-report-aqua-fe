import { useState } from "react";
import { useParams, useNavigate,Link } from "react-router-dom";
import mesintopologi from "../assets/login/mesintopologi.png"; // Pastikan path benar
import { useMachineSummary } from "../contexts/machineSummaryProvider";

// Komponen Tabel Kecil untuk setiap mesin
const MachineStats = ({ title }) => (
  <Link to="/shift-summary/:machineId" className="flex flex-col cursor-pointer bg-[#1e293b]/80 border border-slate-600 rounded-sm overflow-hidden text-[8px] w-20 shadow-lg">
    <div className="bg-slate-700 py-0.5 px-1 text-center font-bold border-b border-slate-600 text-[7px]">
      {title} Shiftly
    </div>    
    {[
      { label: "PR", val: "0%" },
      { label: "PDT", val: "0%" },
      { label: "UPDT", val: "0%" },
      { label: "UPST", val: "0%" },
    ].map((stat) => (
      <div key={stat.label} className="flex border-b border-slate-600 last:border-0">
        <div className="w-1/2 bg-slate-800/50 px-1 border-right border-slate-600 font-bold">{stat.label}</div>
        <div className="w-1/2 px-1 text-right">{stat.val}</div>
      </div>
    ))}
  </Link>
);

export default function ScreenDelivery() {
  const { lineId } = useParams();
  const navigate = useNavigate();
  const [selectedMachine, setSelectedMachine] = useState(null);
  const { machines, loading, lineStatus } = useMachineSummary();

  const lineInfo = {
    number: lineId || "1",
    volume: "600 mL",
  };

  const machines = [
    {
      id: "paletizer",
      name: "PALETIZER",
      status: "RUN",
      dotColor: "#70EC4B",
      pos: { top: "33%", left: "15%" },
      tablePos: { top: "10%", left: "7%" },
      labelPos: "top",
    },
    {
      id: "weight-checker",
      name: "WEIGHT CHECKER",
      status: "RUN",
      dotColor: "#70EC4B",
      pos: { top: "30.5%", left: "37.5%" },
      tablePos: { top: "10%", left: "33%" },
      labelPos: "top",
    },
    {
      id: "wraparound-smi",
      name: "WRAPAROUND SMI",
      status: "RUN",
      dotColor: "#70EC4B",
      pos: { top: "29%", left: "51%" },
      tablePos: { top: "8%", left: "50%" },
      labelPos: "top",
    },
    {
      id: "robot-feeder",
      name: "ROBOT FEEDER",
      status: "RUN",
      dotColor: "#70EC4B",
      pos: { top: "45%", left: "58.5%" },
      tablePos: { top: "35%", left: "41%" },
      labelPos: "left",
    },
    {
      id: "labeller",
      name: "LABELLER",
      status: "RUN",
      dotColor: "#70EC4B",
      pos: { top: "70%", left: "34%" },
      tablePos: { top: "82%", left: "28%" },
      labelPos: "top",
    },
    {
        id: "blower",
        name: "BLOWER",
        status: "RUN",
        dotColor: "#70EC4B",
        pos: { top: "54%", left: "81%" },
        tablePos: { top: "23%", left: "84%" },
        labelPos: "bottom",
    },
    {
        id: "filler",
        name: "FILLER",
        status: "RUN",
        dotColor: "#70EC4B",
        pos: { top: "76%", left: "81.5%" },
        tablePos: { top: "78%", left: "77%" },
        labelPos: "top",
    },
    {
        id: "capper",
        name: "CAPPER",
        status: "RUN",
        dotColor: "#70EC4B",
        pos: { top: "76%", left: "89.5%" },
        tablePos: { top: "78%", left: "89%" },
        labelPos: "top",
    }
  ];

  return (
    <div className="min-h-screen bg-[#0a0f1c] text-white relative font-sans p-4 overflow-hidden">
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20">
        <div className="flex bg-black border border-slate-800 px-6 py-2 items-center gap-4 shadow-2xl">
          <span className="text-[#70EC4B] text-2xl font-bold italic tracking-tighter">LINE {lineInfo.number}</span>
          <div className="w-[2px] h-6 bg-slate-700"></div>
          <span className="text-[#70EC4B] text-2xl font-bold italic tracking-tighter">{lineInfo.volume}</span>
        </div>
      </div>

      <button
        onClick={() => navigate(-1)}
        className="absolute top-6 right-6 z-50 px-4 py-1 bg-red-600/20 border border-red-600 text-red-500 hover:bg-red-600 hover:text-white text-xs font-bold rounded transition-all cursor-pointer"
      >
        BACK
      </button>

      <div className="relative w-full h-[90vh] max-w-6xl mx-auto">
        <img 
            src={mesintopologi} 
            alt="Layout" 
            className="w-full h-full object-contain opacity-80"
        />

        {machines.map((m) => (
          <div key={m.id}>
            <div
              className="absolute w-3 h-3 rounded-full shadow-[0_0_10px_rgba(112,236,75,0.8)] cursor-pointer hover:scale-150 transition-transform z-30"
              style={{
                top: m.pos.top,
                left: m.pos.left,
                backgroundColor: m.dotColor,
              }}
              onClick={() => setSelectedMachine(m)}
            />

            <div 
                className="absolute text-[9px] font-bold tracking-widest text-slate-300 pointer-events-none whitespace-nowrap"
                style={{
                    top: `calc(${m.pos.top} ${m.labelPos === 'top' ? '- 20px' : '+ 15px'})`,
                    left: m.pos.left,
                    transform: 'translateX(-50%)'
                }}
            >
                {m.name}
            </div>

            <div 
                className="absolute z-20"
                style={{ top: m.tablePos.top, left: m.tablePos.left }}
            >
                <MachineStats title={m.name} />
            </div>
          </div>
        ))}

        {/* Additional Static Labels (Non-clickable parts) */}
        <div className="absolute top-[34%] left-[24%] text-[9px] font-bold text-slate-400 border-b border-cyan-500">DDS BOARD</div>
        <div className="absolute top-[52%] left-[30%] text-[9px] font-bold text-slate-400 border-b border-cyan-500">CIL BOARD</div>
        <div className="absolute top-[54%] left-[20%] text-[9px] font-bold text-slate-400 border-b border-cyan-500">PDCA BOARD</div>
      </div>

      {/* Simple Navigation Overlay if Machine Selected */}
      {selectedMachine && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center">
              <div className="bg-[#111827] border border-slate-700 p-6 rounded-lg w-80">
                  <h3 className="text-xl font-bold text-center mb-4 text-cyan-400">{selectedMachine.name}</h3>
                  <div className="flex flex-col gap-2">
                    <button className="w-full py-2 bg-slate-800 hover:bg-cyan-600 transition-colors rounded">Machine Detail</button>
                    <button className="w-full py-2 bg-slate-800 hover:bg-cyan-600 transition-colors rounded">Production Log</button>
                    <button 
                        onClick={() => setSelectedMachine(null)}
                        className="w-full py-2 mt-2 text-slate-500 hover:text-white"
                    >
                        Close
                    </button>
                  </div>
              </div>
          </div>
      )}
    </div>
  );
}