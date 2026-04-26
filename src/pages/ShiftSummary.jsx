import { useState, useEffect, useCallback, useContext } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { authContext } from '../contexts/AuthContext'; // Pastikan path benar
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

// Assets
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
  const { user } = useContext(authContext); // Mengambil user & role dari context
  
  const currentMachine = MACHINE_METADATA[machineId] || { dbId: 1, name: machineId, shortName: 'MC', img: null };
  const isPPIC = user?.role === 'PPIC';

  const [shiftData, setShiftData] = useState([]);
  const [dailyData, setDailyData] = useState(null);
  const [pdtRecords, setPdtRecords] = useState([]);
  const [loading, setLoading] = useState(true);

  // State for Report Modal
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [autoReportMode, setAutoReportMode] = useState(false);
  const [reportFreq, setReportFreq] = useState('weekly');
  const [isDownloading, setIsDownloading] = useState(false);

  // State PDT Manual (3 Shift x 8 Jam)
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
      // Filter PDT berdasarkan machineId integer dari metadata
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

  // HANDLE UNLOCK ACTION (Khusus PPIC)
  const handleUnlockTrigger = async () => {
    const lockedRec = pdtRecords.find(r => r.isLocked === true);
    if (!lockedRec) return alert("Data sudah terbuka atau tidak ada data locked.");

    const password = prompt("Masukkan Password Unlock (AQUA123):");
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

  // HANDLE INPUT PDT (Hanya bisa diklik jika sudah Unlocked)
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

  // PENGELOLAAN EXPORT REPORT
  const handleDownloadReport = async () => {
    setIsDownloading(true);
    try {
      let url = '';
      let activeFormat = '';

      if (autoReportMode) {
         // Endpoint untuk Mode Auto Download / Berkala (Download berformat Excel)
         activeFormat = 'excel';
         url = `https://66c10dvz-3006.asse.devtunnels.ms/api/reports/download?format=${activeFormat}&machineId=${currentMachine.dbId}&period=${reportFreq}`;
      } else {
         // Endpoint untuk Download Manual Sekarang (Download berformat PDF)
         activeFormat = 'pdf';
         url = `https://66c10dvz-3006.asse.devtunnels.ms/api/reports/manual-save?format=${activeFormat}&machineId=${currentMachine.dbId}`;
      }
      
      const response = await fetch(url);
      
      if (!response.ok) {
        const errData = await response.text();
        throw new Error(`Gagal memuat dari API: ${response.statusText} - ${errData}`);
      }
      
      const blob = await response.blob();
      const urlBlob = window.URL.createObjectURL(new Blob([blob]));
      const linkTag = document.createElement('a');
      linkTag.href = urlBlob;
      
      // Beri nama file berbeda sesuai mode
      const fileNameMode = autoReportMode ? `Auto_Mingguan` : `Manual`;
      linkTag.setAttribute('download', `Laporan_Shift_${fileNameMode}_${currentMachine.name}_${new Date().getTime()}.${activeFormat === 'excel' ? 'xlsx' : 'pdf'}`);
      
      document.body.appendChild(linkTag);
      linkTag.click();
      linkTag.parentNode.removeChild(linkTag);
      
    } catch(err) {
      console.error(err);
      alert('Terjadi kesalahan saat memproses laporan: ' + err.message);
    } finally {
      setIsDownloading(false);
    }
  };

  if (loading && shiftData.length === 0) {
    return <div className="min-h-screen bg-[#05070a] flex items-center justify-center text-cyan-400 italic font-black text-xl animate-pulse">Loading {currentMachine.name}...</div>;
  }

  return (
    <div className="min-h-screen bg-[#05070a] text-white p-4 font-sans flex flex-col lg:flex-row gap-6 overflow-x-hidden relative">
      <div className="absolute top-4 right-4 z-50 flex gap-3">
        <Button variant='primary' className="!bg-[#0e7490] hover:!bg-[#164e63] font-bold shadow-[2px_2px_0_#fff] rounded-xl !text-white transition-all uppercase text-xs" onClick={() => setIsReportModalOpen(true)}>
          Export / Laporan
        </Button>
        <Button variant='primary' className="!bg-red-600 shadow-lg shadow-red-900/50 hover:!bg-red-500 rounded-xl" onClick={() => navigate(-1)}>
          Back
        </Button>
      </div>

      {isReportModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-md transition-all">
          <div className="bg-[#0a0f1c] border border-cyan-800/50 p-6 rounded-2xl shadow-2xl shadow-cyan-900/20 w-full max-w-md text-white relative">
            <div className="flex justify-between items-center mb-6 border-b border-slate-800 pb-4">
              <h2 className="text-2xl font-black italic text-cyan-400 capitalize drop-shadow-[0_2px_10px_rgba(34,211,238,0.2)]">Export Laporan Shift</h2>
              <button onClick={() => setIsReportModalOpen(false)} className="text-gray-400 hover:text-white text-2xl leading-none">&times;</button>
            </div>
            
            <div className="space-y-6">
              {/* Report Frequency Setting (Works for Export too) */}
              <div className="p-4 bg-slate-900/80 rounded-xl border border-slate-800 flex flex-col gap-3 transition-opacity">
                 <h3 className="text-sm font-bold text-slate-300">Frekuensi Penarikan Laporan</h3>
                 <div className="flex flex-wrap gap-5 mt-1">
                   {['daily', 'weekly', 'monthly'].map(freq => (
                     <label key={freq} className={`flex items-center gap-2 ${freq !== 'weekly' ? 'cursor-not-allowed opacity-40' : 'cursor-pointer group'}`}>
                       <input 
                         type="radio" 
                         value={freq} 
                         checked={reportFreq === freq} 
                         onChange={(e) => setReportFreq(e.target.value)} 
                         disabled={freq !== 'weekly'}
                         className="accent-cyan-500 w-4 h-4 cursor-pointer" 
                       />
                       <span className={`text-sm text-gray-300 capitalize font-medium ${freq === 'weekly' ? 'group-hover:text-white transition-colors' : ''}`}>
                         {freq === 'daily' ? 'Per Hari' : freq === 'weekly' ? 'Per Minggu' : 'Per Bulan'}
                       </span>
                     </label>
                   ))}
                 </div>
                 <p className="text-[10px] text-gray-500 italic mt-1">*Saat ini endpoint hanya support penarikan laporan Per Minggu</p>
              </div>

              {/* Auto Mode */}
              <div className="flex items-center justify-between p-4 bg-slate-900/80 rounded-xl border border-slate-800 shadow-inner">
                <div>
                  <h3 className="font-bold text-gray-200">Mode Otomatis</h3>
                  <p className="text-xs text-gray-500 pr-5 mt-1">Jadwalkan laporan terkirim/tergenerate ke sistem/email otomatis.</p>
                </div>
                <label className="relative inline-flex flex-shrink-0 items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" checked={autoReportMode} onChange={(e) => setAutoReportMode(e.target.checked)} />
                  <div className="w-12 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[3px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-cyan-500"></div>
                </label>
              </div>



              {/* Info Text */}
              <div className="p-4 bg-cyan-950/30 rounded-xl border border-cyan-900/50 flex gap-3 items-start">
                <svg className="w-5 h-5 text-cyan-400 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd"></path></svg>
                <p className="text-xs text-cyan-200 leading-relaxed">
                  <b>Download Berbeda Format:</b><br />
                  Mode Manual akan mengunduh format <b>PDF</b>.<br />
                  Mode Otomatis (Per Minggu) akan mengunduh format <b>Excel (.xlsx)</b>.
                </p>
              </div>
              
              {/* Button Container */}
              <div className="pt-4 mt-2 flex justify-end gap-4 border-t border-slate-800">
                <Button variant="ghost" className="px-5 text-gray-400 hover:text-white hover:!bg-slate-800 rounded-lg" onClick={() => setIsReportModalOpen(false)}>
                  Batal
                </Button>
                <Button variant="primary" className="!bg-[#0e7490] hover:!bg-cyan-500 px-6 py-2 rounded-lg font-bold shadow-[2px_2px_0_#fff] !text-white uppercase text-xs disabled:opacity-50" onClick={handleDownloadReport} disabled={isDownloading}>
                  {isDownloading ? 'Mengunduh...' : 'Download Sekarang'}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

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
                  {getPdtShiftTotal(0) + getPdtShiftTotal(1) + getPdtShiftTotal(2)}
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