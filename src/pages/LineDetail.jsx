import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import lineMachine from '../assets/group-52.png';

// --- ICONS COMPONENTS ---
const RunIcon = () => (
    <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
        <path d="M13.49 5.48c0 1.1-.89 2-2 2s-2-.9-2-2 .9-2 2-2 2 .9 2 2zm-3.6 13.9l1-4.4 2.1 2v6h2v-7.5l-2.1-2 .6-3c1.3 1.5 3.3 2.5 5.5 2.5v-2c-1.9 0-3.5-1-4.3-2.4l-1-1.6c-.4-.6-1-1-1.7-1-.3 0-.5.1-.8.1l-5.2 2.2v4.7h2v-3.4l1.8-.7-1.6 8.1-4.9-1-.4 2 5.3 1.2z" />
    </svg>
);

const StopIcon = () => (
    <div className="w-3.5 h-3.5 bg-white rounded-sm shadow-[0_0_8px_rgba(255,255,255,0.5)]" />
);

// --- MAIN COMPONENT ---
export default function LineDetail() {
    const { lineId } = useParams();
    const navigate = useNavigate();
    const [selectedMachine, setSelectedMachine] = useState(null);

    const lineInfo = {
        number: lineId || '1',
        volume: '600 mL',
        overallStatus: 'WARNING',
    };

    const machines = [
        { id: 'paletizer', name: 'PALETIZER', status: 'RUN', color: 'green', position: { top: '15%', left: '5%', width: '12%', height: '18%' } },
        { id: 'dds-board', name: 'DDS BOARD', status: 'WARNING', color: 'yellow', position: { top: '25%', left: '18%', width: '10%', height: '8%' } },
        { id: 'weight-checker', name: 'WEIGHT CHECKER', status: 'RUN', color: 'green', position: { top: '22%', left: '32%', width: '9%', height: '6%' } },
        { id: 'wraparound-smi', name: 'WRAPAROUND SMI', status: 'STOP', color: 'red', position: { top: '20%', left: '45%', width: '12%', height: '7%' } },
        { id: 'robot-feeder', name: 'ROBOT FEEDER', status: 'STOP', color: 'red', position: { top: '35%', left: '55%', width: '10%', height: '10%' } },
        { id: 'cil-board', name: 'CIL BOARD', status: 'RUN', color: 'green', position: { top: '45%', left: '20%', width: '8%', height: '6%' } },
        { id: 'tools', name: 'TOOLS', status: 'WARNING', color: 'yellow', position: { top: '48%', left: '30%', width: '7%', height: '5%' } },
        { id: 'pdca-board', name: 'PDCA BOARD', status: 'RUN', color: 'green', position: { top: '55%', left: '15%', width: '9%', height: '6%' } },
        { id: 'spectrum', name: 'SPECTRUM', status: 'STOP', color: 'red', position: { top: '52%', left: '40%', width: '8%', height: '5%' } },
        { id: 'capper', name: 'CAPPER', status: 'STOP', color: 'red', position: { top: '65%', left: '70%', width: '10%', height: '12%' } },
        { id: 'sbo', name: 'SBO', status: 'STOP', color: 'red', position: { top: '40%', right: '5%', width: '15%', height: '25%' } },
    ];

    const handleOptionClick = (option) => {
        const routes = {
            'Shift Summary Page': '/shift-summary/' + selectedMachine.id,
            'Screen Delivery': '/screen-delivery/' + selectedMachine.id,
            'default': '/machine-detail/' + selectedMachine.id
        };
        navigate(routes[option] || routes['default']);
        setSelectedMachine(null);
    };

    return (
        <div className="min-h-screen bg-[#0a0f1c] text-white relative overflow-hidden font-sans">

            {/* Background Overlay */}
            <div className="absolute inset-0 bg-black/40 z-0" />

            {/* BACK BUTTON (Sesuai Desain Awal) */}
            <button
                onClick={() => navigate(-1)}
                className="absolute top-6 right-6 z-50 px-6 py-2 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg shadow-lg shadow-red-900/40 transition-all duration-200 cursor-pointer"
            >
                Back
            </button>

            <div className="relative z-10 p-6 max-w-7xl mx-auto">

                {/* TOPOLOGY MAP SECTION */}
                <div
                    style={{ backgroundImage: `url(${lineMachine})` }}
                    className="relative h-[80vh] md:h-[85vh] w-full bg-contain bg-no-repeat bg-center"
                >
                    {machines.map((machine) => (
                        <div
                            key={machine.id}
                            className="absolute cursor-pointer group flex items-center justify-center"
                            style={{
                                top: machine.position.top,
                                left: machine.position.left,
                                width: machine.position.width,
                                height: machine.position.height,
                                right: machine.position.right
                            }}
                            onClick={() => setSelectedMachine(machine)}
                        >
                            <div className="relative flex items-center justify-center">
                                {/* Node Circle */}
                                <div className={`relative w-11 h-11 rounded-full flex items-center justify-center border-2 transition-all duration-300 group-hover:scale-125 shadow-xl shadow-black/50 backdrop-blur-sm
                  ${machine.status === 'RUN' ? 'bg-green-600/90 border-green-400 shadow-[0_0_15px_rgba(34,197,94,0.4)]' :
                                        machine.status === 'WARNING' ? 'bg-yellow-600/90 border-yellow-400 animate-pulse shadow-[0_0_20px_rgba(234,179,8,0.6)]' :
                                            'bg-red-600/90 border-red-400 shadow-[0_0_15px_rgba(239,68,68,0.4)]'}`}
                                >
                                    {/* Status Content */}
                                    {machine.status === 'RUN' && <RunIcon />}
                                    {machine.status === 'WARNING' && <span className="font-black text-2xl text-white italic drop-shadow-md">!</span>}
                                    {machine.status === 'STOP' && <StopIcon />}

                                    {/* Tooltip - Solid Black (No Blur) */}
                                    <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-black border border-slate-700 text-white text-[10px] font-black px-3 py-1.5 opacity-0 group-hover:opacity-100 transition-all pointer-events-none whitespace-nowrap z-50 uppercase tracking-widest shadow-2xl">
                                        <span className="text-cyan-500 mr-1 opacity-70">UNIT:</span>
                                        {machine.name}
                                    </div>
                                </div>

                                {/* Extra Kedap-Kedip Ping for Warning Only */}
                                {machine.status === 'WARNING' && (
                                    <div className="absolute inset-0 rounded-full bg-yellow-400 animate-ping opacity-20" />
                                )}
                            </div>
                        </div>
                    ))}
                </div>

                {/* BOTTOM INFO BAR (Sesuai Desain Awal) */}
                <div className="mb-8 flex mt-10 flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div className='flex gap-5'>
                        <h1 className="text-3xl font-bold p-5 bg-black text-[#70EC4B] border border-slate-800 shadow-xl italic uppercase tracking-tighter">
                            LINE {lineInfo.number} {lineInfo.volume}
                        </h1>
                        <p className="text-lg mt-1 p-5 font-medium">
                            STATUS : <span className={`font-black uppercase italic ${lineInfo.overallStatus === 'RUN' ? 'text-green-400' : lineInfo.overallStatus === 'WARNING' ? 'text-yellow-400' : 'text-red-500'}`}>
                                {lineInfo.overallStatus}
                            </span>
                        </p>
                    </div>

                    <Link to="/screen-delivery/:machineId"
                        className="w-50 px-6 py-1.5 hover:bg-cyan-700/50 border border-cyan-600/50 rounded-lg text-white font-bold text-center transition-all uppercase tracking-widest text-xs"
                    >
                        Screen Delivery
                    </Link>

                    <div className="flex gap-6 text-xs font-black uppercase tracking-wider">
                        <div className="flex items-center gap-2 text-yellow-400 animate-pulse">
                            <div className="bg-yellow-400 px-3 rounded-full">
                                <span className="text-2xl text-white">!</span>
                            </div>
                            <div className="w-2.5 h-2.5 bg-yellow-400 rounded-full" />
                            WARNING
                        </div>
                        <div className="flex items-center gap-2 text-red-500">
                            <div className="bg-red-500 p-2 rounded-full">
                                <StopIcon />
                            </div>
                            <div className="w-2.5 h-2.5 bg-red-500 rounded-full" />
                            STOP
                        </div>
                        <div className="flex items-center gap-2 text-green-400">
                            <div className="bg-green-400 p-1 rounded-full">
                                <RunIcon />
                            </div>
                            <div className="w-2.5 h-2.5 bg-green-400 rounded-full" />
                            RUN
                        </div>
                    </div>

                </div>
            </div>

            {/* MODAL POPUP */}
            {/* {selectedMachine && (
                <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4 transition-all">
                    <div className="bg-[#111827] border border-slate-700 rounded-xl p-8 max-w-lg w-full shadow-2xl shadow-cyan-900/30">
                        <div className="space-y-4">
                            <h2 className="text-2xl font-bold text-center text-cyan-400 border-b border-slate-800 pb-4">
                                {selectedMachine.name}
                            </h2>
                            {['Screen Delivery', 'Machine Detail', 'Shift Summary Page'].map((option) => (
                                <button
                                    key={option}
                                    onClick={() => handleOptionClick(option)}
                                    className="w-full py-4 px-6 text-2xl font-bold hover:bg-cyan-700/50 border border-cyan-600/50 rounded-lg text-white text-center transition-all shadow-md hover:shadow-cyan-500/20"
                                >
                                    {option}
                                </button>
                            ))}
                        </div>

                        <button
                            onClick={() => setSelectedMachine(null)}
                            className="mt-6 w-full py-3 bg-slate-800 hover:bg-slate-700 rounded-lg text-slate-400 font-bold uppercase transition tracking-widest text-xs"
                        >
                            Close
                        </button>
                    </div>
                </div>
            )} */}
        </div>
    );
}