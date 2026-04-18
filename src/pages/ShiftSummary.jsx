import { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getShiftSummary, getDailySummary } from '../api/shiftSummaryApi';
import { SummaryRow } from '../components/SummaryRow';
import cnyImg from '../assets/shiftSum/CNY.png';
import cprImg from '../assets/shiftSum/CPR.png';
import flrImg from '../assets/shiftSum/FLR.png';
import lbLImg from '../assets/shiftSum/LBL.png';
import plzImg from '../assets/shiftSum/PLZ.png';
import wrpImg from '../assets/shiftSum/WRP.png';  
import blwImg from '../assets/shiftSum/BLW.jpeg';  
import Button from '../components/Button';
import ImgLoader from '../components/ImgLoader';

// 1. MAPPING METADATA
const MACHINE_METADATA = {
  'AQ-PLT-01': { name: 'PALLETIZER', shortName: 'PLT', img: plzImg },
  'AQ-WRP-01': { name: 'WRAPPING 1', shortName: 'WRP1', img: wrpImg },
  'AQ-WRP-02': { name: 'WRAPPING 2', shortName: 'WRP2', img: wrpImg },
  'AQ-CAP-01': { name: 'CAPPING', shortName: 'CAP', img: cprImg },
  'AQ-BLW-01': { name: 'BLOWER', shortName: 'BLW', img: flrImg },
  'AQ-FIL-01': { name: 'FILLER', shortName: 'FIL', img: flrImg },
  'AQ-LBL-01': { name: 'LABELLER', shortName: 'LBL', img: lbLImg },
  'AQ-CON-01': { name: 'CONVEYOR', shortName: 'CON', img: cnyImg },
};

export default function ShiftSummary() {
  const navigate = useNavigate();
  const { machineId } = useParams();
  const currentMachine = MACHINE_METADATA[machineId] || { name: machineId, shortName: 'MC', img: null };

  const [shiftData, setShiftData] = useState([]);
  const [dailyData, setDailyData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const shiftConfigs = [
    { name: 'SHIFT 1', headerBg: 'bg-[#a38a00]' },
    { name: 'SHIFT 2', headerBg: 'bg-[#b59410]' },
    { name: 'SHIFT 3', headerBg: 'bg-[#1b7a21]' },
  ];

  // 2. FETCH LOGIC (Silent mode = true biar gak kedap-kedip pas refresh)
  const fetchAllData = useCallback(async (isSilent = false) => {
    try {
      if (!isSilent) setLoading(true);

      const [s1, s2, s3, daily] = await Promise.all([
        getShiftSummary(1, machineId),
        getShiftSummary(2, machineId),
        getShiftSummary(3, machineId),
        getDailySummary(machineId),
      ]);

      setShiftData([s1.data, s2.data, s3.data]);
      setDailyData(daily.data);
      setError(null);
    } catch (err) {
      console.error("Fetch Error:", err);
      if (!isSilent) setError("Gagal memuat data dari server.");
    } finally {
      setLoading(false);
    }
  }, [machineId]);

  // 3. REAL-TIME POLLING (1-3 Detik)
  useEffect(() => {
    // Jalankan pertama kali saat component mount
    fetchAllData();

    // Set interval 2 detik (2000ms)
    const pollInterval = setInterval(() => {
      console.log('🔄 Auto-fetching data (Polling)...');
      fetchAllData(true); // true = silent refresh (tanpa loading spinner)
    }, 2000); 

    // Cleanup interval saat pindah page
    return () => clearInterval(pollInterval);
  }, [fetchAllData]);

  if (loading && shiftData.length === 0) {
    return (
      <div className="min-h-screen bg-[#05070a] flex items-center justify-center text-cyan-400 italic font-black text-xl">
        Loading Shift Summary for {currentMachine.name}...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#05070a] text-white p-4 font-sans flex flex-col lg:flex-row gap-6 overflow-x-hidden">
      {/* Back Button */}
      <Button
        variant='primary'
        className="absolute bg-red-500! top-4 right-4 z-50 rounded-xl"
        onClick={() => navigate(-1)}
      >
        Back
      </Button>

      {error && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 bg-red-600/90 text-white px-6 py-3 rounded shadow-lg z-[110]">
          {error}
        </div>
      )}

      {/* LEFT: 3 Shift Tables */}
      <div className="flex-1 space-y-8 max-w-[1000px]">
        {shiftConfigs.map((config, idx) => {
          const s = shiftData[idx] || {};
          const hours = s.hours || [];
          const totals = s.shiftTotals || {};

          return (
            <div key={idx} className="border border-slate-700 bg-black/40 overflow-hidden shadow-xl rounded-lg">
              <table className="w-full text-[11px] border-collapse">
                <thead>
                  <tr className="h-12">
                    <th className={`${config.headerBg} w-24 text-lg font-black italic`}>{config.name}</th>
                    {hours.map((h, i) => (
                      <th key={i} className="border-r border-slate-700 bg-slate-800/50 font-normal text-[9px] px-1 whitespace-pre-line leading-tight">
                        JAM KE-{h.jamKe}
                      </th>
                    ))}
                    <th className="bg-slate-800/80 px-1 border-r border-slate-700 w-24 text-[9px]">RESULT SHIFTLY (MIN)</th>
                    <th className="bg-slate-800/80 px-1 w-24 text-[9px]">RESULT SHIFTLY (%)</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-slate-700 h-8">
                    <td className="border-r border-slate-700 text-center font-bold text-slate-500 italic">
                      {s.totalShiftMinutes || 480}
                    </td>
                    {hours.map((h, i) => (
                      <td key={i} className="border-r text-center border-slate-700 text-[9px] whitespace-pre-line">
                        {h.timeRange?.replace('-', '\n') || ''}
                      </td>
                    ))}
                    <td className="border-r border-slate-700" ></td>
                    <td className="border-r border-slate-700 bg-slate-900/50" />
                    <td className="bg-slate-900/50" />
                  </tr>
                  <SummaryRow label="PR" isGray={true} values={hours.map(h => `${h.pr || 0}%`)} percent={totals.pr} />
                  <SummaryRow label="PDT ( MIN )" values={hours.map(h => h.pdtMin)} result={totals.totalPdtMin} percent={totals.pdtPercent} isPdt={true} />
                  <SummaryRow label="UPDT ( MIN )" values={hours.map(h => h.updtMin)} result={totals.totalUpdtMin} percent={totals.updtPercent} />
                  <SummaryRow label="UPST ( FREQ )" values={hours.map(h => h.upstFreq)} result={totals.totalUpstFreq} percent="-" isGray={true} />
                </tbody>
              </table>
            </div>
          );
        })}
      </div>

      {/* RIGHT: Daily Summary */}
      <div className="w-full lg:w-[450px] flex flex-col items-end">
        <div className="text-right mb-12 mt-10">
          <h1 className="bg-cyan-200 text-black text-4xl font-black italic px-4 py-1 inline-block uppercase shadow-[4px_4px_0_#0e7490]">PERFORMA MC</h1>
          <br />
          <h1 className="bg-cyan-200 text-black text-4xl font-black italic px-4 py-1 inline-block mt-2 uppercase shadow-[4px_4px_0_#0e7490]">{currentMachine.name}</h1>
          <div className="flex justify-end">
            <ImgLoader src={currentMachine.img} alt={currentMachine.shortName} />
          </div>
          <h2 className="text-cyan-200 text-4xl mt-4 uppercase opacity-80 italic tracking-tighter">Shift Summary</h2>
        </div>

        <div className="w-full border border-slate-700 bg-black/40 shadow-2xl rounded-lg overflow-hidden">
          <table className="w-full text-[12px] border-collapse font-bold">
            <thead>
              <tr className="h-14 border-b border-slate-700 bg-slate-900/80 text-[10px]">
                <th className="border-r border-slate-700 px-4 text-cyan-400 uppercase italic text-left">Daily Summary</th>
                <th className="border-r border-slate-700 px-2 font-light">SHIFT 1</th>
                <th className="border-r border-slate-700 px-2 font-light">SHIFT 2</th>
                <th className="border-r border-slate-700 px-2 font-light">SHIFT 3</th>
                <th className="border-r border-slate-700 px-2 text-cyan-400">RESULT (%)</th>
                <th className="px-2 text-slate-400 text-[9px]">RESULT (MIN)</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-slate-700 h-12">
                <td className="border-r border-slate-700 px-2 text-slate-400 italic">PR</td>
                {dailyData?.shifts?.map((s, i) => (
                  <td key={i} className="border-r border-slate-700 text-center font-mono">{s.pr}%</td>
                ))}
                <td className="border-r border-slate-700 text-center text-green-400">{dailyData?.daily?.pr}%</td>
                <td className="text-center">-</td>
              </tr>
              <tr className="border-b border-slate-700 h-12">
                <td className="border-r border-slate-700 px-2 text-slate-400 italic">PDT</td>
                <td className="border-r border-slate-700"></td><td className="border-r border-slate-700"></td><td className="border-r border-slate-700"></td><td className="border-r border-slate-700"></td><td></td>
              </tr>
              <tr className="border-b border-slate-700 h-12">
                <td className="border-r border-slate-700 px-2 text-slate-400 italic">UPDT ( MIN )</td>
                {dailyData?.shifts?.map((s, i) => (
                  <td key={i} className="border-r border-slate-700 text-center font-mono">{s.updtMin}</td>
                ))}
                <td className="border-r border-slate-700 text-center text-red-400">{dailyData?.daily?.updtPercent}%</td>
                <td className="text-center text-red-400 font-mono">{Math.round(dailyData?.daily?.updtMin * 100) / 100}</td>
              </tr>
              <tr className="h-12">
                <td className="border-r border-slate-700 px-2 text-slate-400 italic">UPST ( FREQ )</td>
                <td className="border-r text-center border-slate-700">{dailyData?.shifts?.[0]?.upstFreq}</td>
                <td className="border-r text-center border-slate-700">{dailyData?.shifts?.[1]?.upstFreq}</td>
                <td className="border-r text-center border-slate-700">{dailyData?.shifts?.[2]?.upstFreq}</td>
                <td className="border-r border-slate-700"></td>
                <td className="text-center font-mono">{dailyData?.daily?.upstFreq}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}