import { useState, useMemo, use } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
// import { useMachineSummary } from '../contexts/machineSummaryContext';
import { useMachineSummary } from '../contexts/machineSummaryProvider'
import mesintopologi from '../assets/login/mesintopologi.png';
import Button from '../components/Button';
import MachineNode from '../components/MachineNode';
import { StatusLegend } from '../components/StatusLegend';
import { useAuth } from '../contexts/authContext';

// Icons tetap sama
const RunIcon = () => (
    <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
        <path d="M13.49 5.48c0 1.1-.89 2-2 2s-2-.9-2-2 .9-2 2-2 2 .9 2 2zm-3.6 13.9l1-4.4 2.1 2v6h2v-7.5l-2.1-2 .6-3c1.3 1.5 3.3 2.5 5.5 2.5v-2c-1.9 0-3.5-1-4.3-2.4l-1-1.6c-.4-.6-1-1-1.7-1-.3 0-.5.1-.8.1l-5.2 2.2v4.7h2v-3.4l1.8-.7-1.6 8.1-4.9-1-.4 2 5.3 1.2z" />
    </svg>
);
const StopIcon = () => <div className="w-3.5 h-3.5 bg-white rounded-sm shadow-[0_0_8px_white]" />;

export default function LineDetail() {
    const { lineId } = useParams();
    const navigate = useNavigate();
    const { machines, loading, lineStatus } = useMachineSummary();
    const [selectedMachine, setSelectedMachine] = useState(null);

    // Map machineId dari API ke posisi UI kamu
    const machinePositions = {
        'AQ-PLT-01': { top: '18%', left: '3%', width: '12%', height: '18%', name: 'Palletizer Robot', use: true },
        'AQ-WRP-01': { top: '18%', left: '47%', width: '12%', height: '7%', name: 'Wrapper 1', use: true },
        'AQ-WRP-02': { top: '20%', left: '35%', width: '12%', height: '7%', name: 'Wrapper 2', use: true },
        'AQ-CAP-01': { top: '80%', left: '88%', width: '10%', height: '12%', name: 'Capper Rotary', use: true },
        'AQ-BLW-01': { top: '43%', left: '80%', width: '12%', height: '0%', name: 'Blower Alpha', use: true },
        'AQ-FIL-01': { top: '90%', left: '78%', width: '12%', height: '0%', name: 'Filler High-Speed', use: true },
        'AQ-LBL-01': { top: '78%', left: '33.5%', width: '12%', height: '12%', name: 'Labeler Front', use: true },
        'AQ-CON-01': { top: '60%', left: '54%', width: '12%', height: '0%', name: 'Panel Conveyor', use: true },
        'AQ-CAP-02': { top: '0%', left: '0%', width: '0%', height: '0%', name: 'Capper Linear', use: false },
        'AQ-BLW-02': { top: '0%', left: '0%', width: '0%', height: '0%', name: 'Blower Beta', use: false },
        'AQ-FIL-02': { top: '0%', left: '0%', width: '0%', height: '0%', name: 'Filler Medium', use: false },
        'AQ-LBL-02': { top: '0%', left: '0%', width: '0%', height: '0%', name: 'Labeler Back', use: false },
        'AQ-INK-01': { top: '0%', left: '0%', width: '0%', height: '0%', name: 'Inkjet Coder 1', use: false },
        'AQ-INK-02': { top: '0%', left: '0%', width: '0%', height: '0%', name: 'Inkjet Coder 2', use: false },
        'AQ-PCK-01': { top: '0%', left: '0%', width: '0%', height: '0%', name: 'Case Packer A', use: false },
        'AQ-PCK-02': { top: '0%', left: '0%', width: '0%', height: '0%', name: 'Case Packer B', use: false },
    };


    // const handleOptionClick = (option) => {
    //     const routes = {
    //         'Shift Summary Page': `/shift-summary/${selectedMachine.machineId}`,
    //         'Screen Delivery': `/screen-delivery/${selectedMachine.machineId}`,
    //         'default': `/machine-detail/${selectedMachine.machineId}`
    //     };
    //     navigate(routes[option] || routes['default']);
    //     setSelectedMachine(null);
    // };

    if (loading && machines.length === 0) {
        return (
            <div className="min-h-screen bg-[#0a0f1c] flex items-center justify-center text-white">
                Syncing Real-time Topology...
            </div>
        )
    };

    return (
        <div className="min-h-screen bg-[#0a0f1c] text-white relative overflow-hidden font-sans">
            <div className="absolute inset-0 bg-black/40 z-0" />

            <div className="relative z-10 p-6 max-w-7xl mx-auto">
                <Button
                    variant='primary'
                    className="absolute bg-red-500! top-4 right-4 z-50 rounded-xl"
                    onClick={() => navigate(-1)}
                >
                    Back
                </Button>

                {/* TOPOLOGY MAP SECTION */}
                <div className="w-full overflow-x-auto overflow-y-auto">
                    <div className="relative min-w-[900px] aspect-[16/9] max-h-[80vh] mx-auto">

                        {/* IMAGE */}
                        <img
                            src={mesintopologi}
                            alt="Machine Topology"
                            className="absolute inset-0 w-full h-full object-contain pointer-events-none select-none"
                        />

                        {/* MACHINE NODES */}
                        {machines.map((m) => {
                            const config = machinePositions[m.machineId];
                            if (!config || !config.use) return null;

                            return (
                                <MachineNode
                                    key={m.machineId}
                                    machine={m}
                                    position={config}
                                    onClick={setSelectedMachine}
                                />
                            );
                        })}

                    </div>
                </div>

                {/* INFO BAR SECTION */}
                <div className="mb-8 flex mt-10 flex-col md:flex-row justify-between items-start md:items-center gap-6 border-t border-slate-800 pt-8">
                    <div className='flex items-center gap-5'>
                        <h1 className="text-3xl font-black p-5 bg-black text-[#70EC4B] border border-slate-800 shadow-2xl italic uppercase tracking-tighter">
                            LINE {lineId || '1'} | 600ml
                        </h1>
                        <div className="text-lg font-medium">
                            STATUS : <span className={`font-black uppercase italic ${lineStatus.stopped === 0 ? 'text-green-400' : 'text-red-500'}`}>
                                {lineStatus.stopped === 0 ? 'Normal' : 'Issues'}
                            </span>
                        </div>
                    </div>

                    <Link to={`/screen-delivery/${lineId || '1'}`}
                        className="px-8 py-3 bg-cyan-900/20 hover:bg-cyan-700/50 border border-cyan-600/50 rounded-lg text-white font-bold text-center transition-all uppercase tracking-widest text-xs shadow-lg shadow-cyan-500/10"
                    >
                        Screen Delivery
                    </Link>

                    <StatusLegend />
                </div>
            </div>
        </div>
    );
}