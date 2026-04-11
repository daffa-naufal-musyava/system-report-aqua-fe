import { useNavigate } from 'react-router-dom';

const shifts = [
  {
    name: 'SHIFT 1',
    color: 'border-yellow-600',
    headerBg: 'bg-[#a38a00]',
    timeRange: ['14.00-15.00', '15.00-16.00', '16.00-17.00', '17.00-18.00', '18.00-19.00', '19.00-20.00', '20.00-21.00', '21.00-22.00'],
    duration: 480,
    prValues: ['98.33%', '97.92%', '98.96%', '97.92%', '97.92%', '96.88%', '98.96%', '97.92%'],
    resultShiftly: '84.79%',
    pdtMin: ['', '', '', '45', '', '', '', ''],
    pdtResult: '0',
    pdtPercent: '0.00%',
    updtMin: ['8', '10', '5', '10', '10', '15', '5', '10'],
    updtResult: '73',
    updtPercent: '15.21%',
  },
  {
    name: 'SHIFT 2',
    color: 'border-yellow-500',
    headerBg: 'bg-[#b59410]',
    timeRange: ['06.00-07.00', '07.00-08.00', '08.00-09.00', '09.00-10.00', '10.00-11.00', '11.00-12.00', '12.00-13.00', '13.00-14.00'],
    duration: 480,
    prValues: ['98.33%', '97.92%', '98.96%', '88.54%', '97.92%', '96.88%', '98.96%', '97.92%'],
    resultShiftly: '75.42%',
    pdtMin: ['', '', '', '45', '', '', '', ''],
    pdtResult: '45',
    pdtPercent: '9.38%',
    updtMin: ['8', '10', '5', '10', '10', '15', '5', '10'],
    updtResult: '73',
    updtPercent: '15.21%',
  },
  {
    name: 'SHIFT 3',
    color: 'border-green-600',
    headerBg: 'bg-[#1b7a21]',
    timeRange: ['22.00-23.00', '23.00-00.00', '00.00-01.00', '01.00-02.00', '02.00-03.00', '03.00-04.00', '04.00-05.00', '05.00-06.00'],
    duration: 480,
    prValues: ['98.33%', '97.92%', '98.96%', '97.92%', '97.92%', '96.88%', '98.96%', '97.92%'],
    resultShiftly: '84.79%',
    pdtMin: ['', '', '', '', '', '', '', ''],
    pdtResult: '0',
    pdtPercent: '0.00%',
    updtMin: ['8', '10', '5', '10', '10', '15', '5', '10'],
    updtResult: '73',
    updtPercent: '15.21%',
  }
];

// Reusable Table Row Component
const TableRow = ({ label, values, result, percent, isGray = false }) => (
  <tr className="border-b border-slate-700 h-10">
    <td className="border-r border-slate-700 px-2 font-bold text-slate-200 text-center uppercase">{label}</td>
    {values.map((v, i) => (
      <td key={i} className={`border-r border-slate-700 text-center ${v === '45' ? 'bg-slate-800' : ''}`}>{v}</td>
    ))}
    <td className={`border-r border-slate-700 text-center font-bold ${isGray ? 'bg-slate-300 text-black' : ''}`}>{result}</td>
    <td className="text-center font-bold">{percent}</td>
  </tr>
);

export default function ShiftSummary() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#05070a] text-white p-4 font-sans flex flex-col lg:flex-row gap-6 overflow-x-hidden">
      {/* Tombol Back floating seperti di gambar */}
      <button
        onClick={() => navigate(-1)}
        className="fixed top-6 right-6 px-5 py-2 bg-red-600 hover:bg-red-700 text-white font-bold rounded flex items-center gap-2 z-[100] transition-transform active:scale-95"
      >
        Back <span className="rotate-45">↑</span>
      </button>

      {/* LEFT AREA: SHIFT TABLES */}
      <div className="flex-1 space-y-8 max-w-[1000px]">
        {shifts.map((shift, idx) => (
          <div key={idx} className={`border border-slate-700 bg-black/40 overflow-hidden`}>
            <table className="w-full text-[11px] border-collapse">
              <thead>
                <tr className="h-12">
                  <th className={`${shift.headerBg} w-24 text-lg font-black italic`}>{shift.name}</th>
                  {shift.timeRange.map((time, i) => (
                    <th key={i} className="border-r border-slate-700 bg-slate-800/50 font-normal text-[9px] px-1">
                      JAM KE-{i + 1}<br />{time.split('-')[0]}<br />{time.split('-')[1]}
                    </th>
                  ))}
                  <th className="bg-slate-800/80 px-1 border-r border-slate-700">RESULT SHIFTLY (MENIT)</th>
                  <th className="bg-slate-800/80 px-1">RESULT SHIFTLY (%)</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-slate-700 h-8">
                    <td className="border-r border-slate-700 text-center font-bold">{shift.duration}</td>
                    <td colSpan={8} className="border-r border-slate-700"></td>
                    <td className="border-r border-slate-700 bg-slate-900/50"></td>
                    <td className="bg-slate-900/50"></td>
                </tr>
                <TableRow label="PR" values={shift.prValues} percent={shift.resultShiftly} />
                <TableRow label="PDT ( MIN )" values={shift.pdtMin} result={shift.pdtResult} percent={shift.pdtPercent} />
                <TableRow label="UPDT ( MIN )" values={shift.updtMin} result={shift.updtResult} percent={shift.updtPercent} />
                <TableRow label="UPDT ( FREQ )" values={['','','','','','','','']} isGray={true} />
              </tbody>
            </table>
          </div>
        ))}
      </div>

      {/* RIGHT AREA: TITLE & DAILY SUMMARY */}
      <div className="w-full lg:w-[450px] flex flex-col items-end">
        {/* Title Block */}
        <div className="text-right mb-20 mt-10">
          <h1 className="bg-cyan-200 text-black text-4xl font-black italic px-4 py-1 inline-block leading-tight uppercase">
            Performa MC
          </h1>
          <br />
          <h1 className="bg-cyan-200 text-black text-4xl font-black italic px-4 py-1 inline-block mt-1 leading-tight uppercase">
            Hoper Preform
          </h1>
          <h2 className="text-cyan-200 text-4xl font-light tracking-[0.2em] mt-4 uppercase">
            Shift Summary
          </h2>
        </div>

        {/* Daily Summary Table */}
        <div className="w-full border border-slate-700 bg-black/40">
          <table className="w-full text-[12px] border-collapse">
            <thead>
              <tr className="h-14 border-b border-slate-700 bg-slate-900/80">
                <th className="border-r border-slate-700 px-4">DAILY</th>
                <th className="border-r border-slate-700 px-2">SHIFT 1</th>
                <th className="border-r border-slate-700 px-2">SHIFT 2</th>
                <th className="border-r border-slate-700 px-2">SHIFT 3</th>
                <th className="border-r border-slate-700 px-2">RESULT DAILY (%)</th>
                <th className="px-2">RESULT DAILY ( MENIT )</th>
              </tr>
            </thead>
            <tbody className="font-bold">
              <tr className="border-b border-slate-700 h-12">
                <td className="border-r border-slate-700 px-2 text-slate-400">PR</td>
                <td className="border-r border-slate-700 text-center">75.42%</td>
                <td className="border-r border-slate-700 text-center">84.79%</td>
                <td className="border-r border-slate-700 text-center">84.79%</td>
                <td className="border-r border-slate-700 text-center">81.67%</td>
                <td className="text-center"></td>
              </tr>
              <tr className="border-b border-slate-700 h-12">
                <td className="border-r border-slate-700 px-2 text-slate-400">PDT ( MIN )</td>
                <td className="border-r border-slate-700 text-center">9.38%</td>
                <td className="border-r border-slate-700 text-center">0.00%</td>
                <td className="border-r border-slate-700 text-center">0.00%</td>
                <td className="border-r border-slate-700 text-center">3.13%</td>
                <td className="text-center">45</td>
              </tr>
              <tr className="border-b border-slate-700 h-12">
                <td className="border-r border-slate-700 px-2 text-slate-400">UPDT ( MIN )</td>
                <td className="border-r border-slate-700 text-center">15.21%</td>
                <td className="border-r border-slate-700 text-center">15.21%</td>
                <td className="border-r border-slate-700 text-center">15.21%</td>
                <td className="border-r border-slate-700 text-center">15.21%</td>
                <td className="text-center">219</td>
              </tr>
              <tr className="h-12">
                <td className="border-r border-slate-700 px-2 text-slate-400">UPST ( FREQ )</td>
                <td className="border-r border-slate-700 text-center"></td>
                <td className="border-r border-slate-700 text-center"></td>
                <td className="border-r border-slate-700 text-center"></td>
                <td className="border-r border-slate-700 text-center"></td>
                <td className="text-center"></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}