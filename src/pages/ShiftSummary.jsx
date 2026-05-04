import { useState, useEffect, useCallback, useContext } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { authContext } from '../contexts/AuthContext';
import { 
  getShiftSummary, 
  getDailySummary, 
  getPdtList, 
  createPdt, 
  unlockPdt 
} from '../api/shiftSummaryApi';
import { SummaryRow } from '../components/SummaryRow';
import Button from '../components/Button';
import ImgLoader from '../components/ImgLoader';

import cnyImg from '../assets/shiftSum/CNY.png';
import cprImg from '../assets/shiftSum/CPR.png';
import flrImg from '../assets/shiftSum/FLR.png';
import lbLImg from '../assets/shiftSum/LBL.png';
import plzImg from '../assets/shiftSum/PLZ.png';
import wrpImg from '../assets/shiftSum/WRP.png';

const MACHINE_METADATA = {
  'AQ-PLT-01': { dbId: 1, name: 'PALLETIZER', shortName: 'PLT', img: plzImg },
  'AQ-WRP-01': { dbId: 2, name: 'WRAPPING 1', shortName: 'WRP1', img: wrpImg },
  'AQ-WRP-02': { dbId: 3, name: 'WRAPPING 2', shortName: 'WRP2', img: wrpImg },
  'AQ-CAP-01': { dbId: 4, name: 'CAPPING', shortName: 'CAP', img: cprImg },
  'AQ-BLW-01': { dbId: 5, name: 'BLOWER', shortName: 'BLW', img: flrImg },
  'AQ-FIL-01': { dbId: 6, name: 'FILLER', shortName: 'FIL', img: flrImg },
  'AQ-LBL-01': { dbId: 7, name: 'LABELLER', shortName: 'LBL', img: lbLImg },
  'AQ-CON-01': { dbId: 8, name: 'CONVEYOR', shortName: 'CON', img: cnyImg },
};

export default function ShiftSummary() {
  const navigate = useNavigate();
  const { machineId } = useParams();
  const { user } = useContext(authContext); 
  
  const currentMachine = MACHINE_METADATA[machineId] || { dbId: 1, name: machineId, shortName: 'MC', img: null };
  const isPPIC = user?.role === 'PPIC';

  const [shiftData, setShiftData] = useState([]);
  const [dailyData, setDailyData] = useState(null);
  const [pdtRecords, setPdtRecords] = useState([]);
  const [loading, setLoading] = useState(true);

  const [manualPdt, setManualPdt] = useState([
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
  ]);

  const shiftConfigs = [
    { name: 'SHIFT 1', headerBg: 'bg-[#a38a00]' },
    { name: 'SHIFT 2', headerBg: 'bg-[#b59410]' },
    { name: 'SHIFT 3', headerBg: 'bg-[#1b7a21]' },
  ];

  const fetchAllData = useCallback(async (isSilent = false) => {
    try {
      if (!isSilent) setLoading(true);
      const [s1, s2, s3, daily, pdtList] = await Promise.all([
        getShiftSummary(1, machineId),
        getShiftSummary(2, machineId),
        getShiftSummary(3, machineId),
        getDailySummary(machineId),
        getPdtList()
      ]);
      
      setShiftData([s1.data, s2.data, s3.data]);
      setDailyData(daily.data);
      setPdtRecords(pdtList.data.filter(r => r.machineId === currentMachine.dbId));
      
    } catch (err) {
      console.error("Fetch Error:", err);
    } finally {
      setLoading(false);
    }
  }, [machineId, currentMachine.dbId]);

  useEffect(() => {
    fetchAllData();
    const pollInterval = setInterval(() => fetchAllData(true), 10000);
    return () => clearInterval(pollInterval);
  }, [fetchAllData]);

  const handleUnlockTrigger = async () => {
    const lockedRec = pdtRecords.find(r => r.isLocked === true);
    if (!lockedRec) return alert("Data sudah terbuka atau tidak ada data locked.");

    const password = prompt("Masukkan Password Unlock");
    if (!password) return;

    try {
      await unlockPdt(lockedRec.id, {
        machineId: currentMachine.dbId,
        planDate: lockedRec.planDate,
        duration: lockedRec.duration,
        reason: "Manual Unlock by PPIC",
        password: password
      });
      alert("Unlock Berhasil!");
      fetchAllData();
    } catch (err) {
      alert("Gagal Unlock: " + (err.response?.data?.message || "Password Salah"));
    }
  };
  const handlePdtSubmit = async (shiftIdx, hourIdx, value) => {
    try {
      await createPdt({
        machineId: currentMachine.dbId,
        planDate: new Date().toISOString(),
        duration: parseInt(value) || 0,
        reason: `Update Shift ${shiftIdx + 1}`
      });
      fetchAllData();
    } catch (err) {
      console.error("Gagal Simpan PDT");
    }
  };

  const handlePdtChange = (shiftIdx, hourIdx, value) => {
    const updated = [...manualPdt];
    updated[shiftIdx][hourIdx] = value;
    setManualPdt(updated);
  };

  const getPdtShiftTotal = (shiftIdx) => manualPdt[shiftIdx].reduce((a, b) => a + (parseInt(b) || 0), 0);

  if (loading && shiftData.length === 0) {
    return <div className="min-h-screen bg-[#05070a] flex items-center justify-center text-cyan-400 italic font-black text-xl animate-pulse">Loading {currentMachine.name}...</div>;
  }

  return (
    <div className="min-h-screen bg-[#05070a] text-white p-4 font-sans flex flex-col lg:flex-row gap-6 overflow-x-hidden relative">
      <Button variant='primary' className="absolute bg-red-600! top-4 right-4 z-50 rounded-xl" onClick={() => navigate(-1)}>Back</Button>

      {/* LEFT: Hourly Tables */}
      <div className="flex-1 space-y-8 max-w-[1000px]">
        {shiftConfigs.map((config, idx) => {
          const s = shiftData[idx] || {};
          const hours = s.hours || [];
          const totals = s.shiftTotals || {};
          const isLocked = pdtRecords.some(r => r.isLocked);

          return (
            <div key={idx} className="border border-slate-700 bg-black/40 overflow-hidden shadow-xl rounded-lg">
              <table className="w-full text-[11px] border-collapse">
                <thead>
                  <tr className="h-12">
                    <th className={`${config.headerBg} w-24 text-lg font-black italic`}>{config.name}</th>
                    {[...Array(8)].map((_, i) => (
                      <th key={i} className="border-r border-slate-700 bg-slate-800/50 font-normal text-[9px] px-1">
                        JAM KE-{hours[i]?.jamKe || (i + 1)}
                      </th>
                    ))}
                    <th className="bg-slate-800/80 px-1 border-r border-slate-700 w-24 text-[9px]">RESULT SHIFTLY (MIN)</th>
                    <th className="bg-slate-800/80 px-1 w-24 text-[9px]">RESULT SHIFTLY (%)</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-slate-700 h-8">
                    <td className="border-r border-slate-700 text-center font-bold text-white italic">480</td>
                    {hours.map((h, i) => (
                      <td key={i} className="border-r text-center border-slate-700 text-[9px] text-white">
                        {h.timeRange || ''}
                      </td>
                    ))}
                    <td className="border-r border-slate-700" /><td className="bg-slate-900/50" />
                  </tr>
                  
                  <SummaryRow label="PR" values={hours.map(h => `${h.pr || 0}%`)} percent={totals.pr} isGray />
                  
                  <SummaryRow 
                    label="PDT ( MIN )" 
                    values={manualPdt[idx]} 
                    result={getPdtShiftTotal(idx)} 
                    isPdt={true}
                    canEdit={isPPIC}
                    isLocked={isLocked}
                    onUnlockClick={handleUnlockTrigger}
                    onValueChange={(hIdx, val) => handlePdtChange(idx, hIdx, val)}
                    onBlurAction={(hIdx, val) => handlePdtSubmit(idx, hIdx, val)}
                  />

                  <SummaryRow label="UPDT ( MIN )" values={hours.map(h => h.updtMin)} result={totals.totalUpdtMin} percent={totals.updtPercent} />
                  <SummaryRow label="UPST ( FREQ )" values={hours.map(h => h.upstFreq)} result={totals.totalUpstFreq} isGray />
                </tbody>
              </table>
            </div>
          );
        })}
      </div>

      {/* RIGHT: Daily Summary */}
      <div className="w-full lg:w-[450px] flex flex-col items-end">
        <div className="text-right mb-10 mt-10">
          <h1 className="bg-cyan-200 text-black text-4xl font-black italic px-4 py-1 inline-block uppercase shadow-[4px_4px_0_#0e7490]">PERFORMA MC</h1><br />
          <h1 className="bg-cyan-200 text-black text-4xl font-black italic px-4 py-1 inline-block mt-2 uppercase shadow-[4px_4px_0_#0e7490]">{currentMachine.name}</h1>
          <div className="flex justify-end mt-4">
            <ImgLoader src={currentMachine.img} alt={currentMachine.shortName} className="h-28 object-contain" />
          </div>
        </div>

        <div className="w-full border mt-60 border-slate-700 bg-black/40 shadow-2xl rounded-lg overflow-hidden">
          <table className="w-full text-[12px] border-collapse font-bold">
            <thead>
              <tr className="h-14 border-b border-slate-700 bg-slate-900/80 text-[10px]">
                <th className="border-r border-slate-700 px-4 text-white uppercase italic text-left">Daily Summary</th>
                <th className="px-2 font-light border-r border-slate-700">SH 1</th>
                <th className="px-2 font-light border-r border-slate-700">SH 2</th>
                <th className="px-2 font-light border-r border-slate-700">SH 3</th>
                <th className="px-2 text-white border-r border-slate-700">RESULT Daily%</th>
                <th className="px-2 text-slate-400 text-[9px]">TOTAL</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-slate-700 h-12">
                <td className="border-r border-slate-700 px-2 text-slate-400 italic text-[10px]">PR</td>
                {dailyData?.shifts?.map((s, i) => <td key={i} className="border-r border-slate-700 text-center font-mono">{s.pr}%</td>)}
                <td className="border-r border-slate-700 text-center text-white">{dailyData?.daily?.pr}%</td>
                <td className="text-center">-</td>
              </tr>
              
              <tr className="border-b border-slate-700 h-12 bg-cyan-950/40">
                <td className="border-r border-slate-700 px-2 text-cyan-500 italic text-[10px]">PDT (MIN)</td>
                <td className="border-r border-slate-700 text-center font-mono text-cyan-400">{getPdtShiftTotal(0)}</td>
                <td className="border-r border-slate-700 text-center font-mono text-cyan-400">{getPdtShiftTotal(1)}</td>
                <td className="border-r border-slate-700 text-center font-mono text-cyan-400">{getPdtShiftTotal(2)}</td>
                <td className="border-r border-slate-700 text-center">-</td>
                <td className="text-center font-mono text-cyan-400">
                  {}
                </td>
              </tr>

              <tr className="border-b border-slate-700 h-12">
                <td className="border-r border-slate-700 px-2 text-slate-400 italic text-[10px]">UPDT (MIN)</td>
                {dailyData?.shifts?.map((s, i) => <td key={i} className="border-r border-slate-700 text-center font-mono">{s.updtMin}</td>)}
                <td className="border-r border-slate-700 text-center text-white">{dailyData?.daily?.updtPercent}%</td>
                <td className="text-center text-white font-mono">{Math.round(dailyData?.daily?.updtMin || 0)}</td>
              </tr>
              <tr className="border-b border-slate-700 h-12">
                <td className="border-r border-slate-700 px-2 text-slate-400 italic text-[10px]">UPST (FREQ)</td>
                {dailyData?.shifts?.map((s, i) => <td key={i} className="border-r border-slate-700 text-center font-mono">{s.upstFreq}</td>)}
                <td className="border-r border-slate-700 text-center text-white">{dailyData?.daily?.upstPercent}%</td>
                <td className="text-center text-white font-mono">{Math.round(dailyData?.daily?.upstFreq || 0)}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}