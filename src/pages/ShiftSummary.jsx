import { useNavigate } from 'react-router-dom';
import ShiftTable from '../components/ShiftTable';

const shifts = [
  {
    name: 'SHIFT 1',
    timeRange: '06:00 - 14:00',
    duration: 480,
    prValues: ['98.33%', '97.92%', '98.96%', '88.54%', '97.92%', '96.98%', '98.96%', '97.92%'],
    prPercent: '75.42%',
    pdtMin: ['', '', '', '', '', '45', '', '45'],
    pdtPercent: '9.38%',
    updtMin: ['8', '10', '5', '10', '10', '15', '5', '10'],
    updtTotal: '73',
    updtPercent: '15.21%',
    updtFreq: 'JAM',
  },
  {
    name: 'SHIFT 2',
    timeRange: '14:00 - 22:00',
    duration: 480,
    prValues: ['98.33%', '97.92%', '98.96%', '97.92%', '97.92%', '96.86%', '98.96%', '97.92%'],
    prPercent: '84.79%',
    pdtMin: ['', '', '', '', '', '', '0', '0'],
    pdtPercent: '0.00%',
    updtMin: ['8', '10', '5', '10', '10', '15', '5', '10'],
    updtTotal: '73',
    updtPercent: '15.21%',
    updtFreq: 'JAM',
  },
  {
    name: 'SHIFT 3',
    timeRange: '22:00 - 06:00',
    duration: 480,
    prValues: ['98.33%', '97.92%', '98.96%', '97.92%', '97.92%', '96.86%', '98.96%', '97.92%'],
    prPercent: '84.79%',
    pdtMin: ['', '', '', '', '', '', '0', '0'],
    pdtPercent: '0.00%',
    updtMin: ['8', '10', '5', '10', '10', '15', '5', '10'],
    updtTotal: '73',
    updtPercent: '15.21%',
    updtFreq: 'JAM',
  }
];

const dailySummary = {
  pr: ['75.42%', '84.79%', '84.79%', '81.67%'],
  pdtMin: ['9.38%', '0.00%', '0.00%', '3.13%', '45'],
  updtMin: ['15.21%', '15.21%', '15.21%', '15.21%', '219'],
};

export default function ShiftSummary() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#0a0f1c] text-white pt-20 pb-10 font-sans relative">
      <button
        onClick={() => navigate(-1)}
        className="absolute top-6 right-6 px-6 py-2 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg shadow-lg shadow-red-900/40 transition-all z-50"
      >
        Back
      </button>

      <div className="mx-4 md:mx-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* LEFT COLUMN: SHIFT TABLES */}
          <div className="lg:col-span-2 space-y-6">
            {shifts.map((shift, idx) => (
              <ShiftTable key={idx} shift={shift} />
            ))}
          </div>

          {/* RIGHT COLUMN: INFO & DAILY SUMMARY */}
          <div className="space-y-6">
            <div className="bg-[#111827]/70 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6 shadow-lg">
              <h1 className='text-3xl font-black text-cyan-400 mb-6 uppercase tracking-tighter'>Shift Summary</h1>

              <div className="text-end mb-6">
                <span className='bg-cyan-400 text-black px-2 py-1 text-2xl font-black italic'>PERFORMA MC</span>
                <br />
                <span className='bg-cyan-400 text-black px-2 py-1 text-2xl font-black italic inline-block mt-1'>HOPPER PREFORM</span>
              </div>

              {/* Image Hopper */}
              <div className="relative group">
                <div className="absolute -inset-1 bg-cyan-500/20 rounded-lg blur opacity-25 group-hover:opacity-50 transition duration-1000"></div>
                <img
                  src="https://enegroupltd.com/filestore/images/products/lg/bulk-hopper-4.png"
                  alt="Hopper Preform"
                  className="relative w-full h-auto rounded-lg border border-slate-700 shadow-2xl"
                />
                <p className="text-center text-[10px] font-black text-slate-500 mt-3 tracking-[0.5em] uppercase">DanIMS System</p>
              </div>
            </div>

            {/* DAILY SUMMARY TABLE (FIXED WIDTH) */}
            <div className="bg-[#111827]/70 backdrop-blur-sm border border-slate-700/50 rounded-xl p-5 shadow-lg ">
              <h3 className="text-lg font-black text-cyan-300 mb-4 text-center uppercase tracking-widest border-b border-slate-800 pb-2">
                Daily Summary
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full text-[11px] border-collapse">
                  <thead>
                    <tr className="bg-slate-800/60 text-slate-400">
                      <th className="p-2 text-left">PARA</th>
                      <th className="p-2 text-center">S1</th>
                      <th className="p-2 text-center">S2</th>
                      <th className="p-2 text-center">S3</th>
                      <th className="p-2 text-center bg-cyan-900/20 text-cyan-300 font-bold">AVG (%)</th>
                      <th className="p-2 text-center bg-slate-900">TOT (MIN)</th>
                    </tr>
                  </thead>
                  <tbody className="font-bold">
                    <tr className="border-t border-slate-700/50">
                      <td className="p-3 text-slate-400 uppercase">PR</td>
                      <td className="p-3 text-center">{dailySummary.pr[0]}</td>
                      <td className="p-3 text-center">{dailySummary.pr[1]}</td>
                      <td className="p-3 text-center">{dailySummary.pr[2]}</td>
                      <td className="p-3 text-center text-green-400 bg-cyan-900/10">{dailySummary.pr[3]}</td>
                      <td className="p-3 text-center bg-slate-900">-</td>
                    </tr>
                    <tr className="border-t border-slate-700/50">
                      <td className="p-3 text-slate-400 uppercase">PDT</td>
                      <td className="p-3 text-center">{dailySummary.pdtMin[0]}</td>
                      <td className="p-3 text-center">{dailySummary.pdtMin[1]}</td>
                      <td className="p-3 text-center">{dailySummary.pdtMin[2]}</td>
                      <td className="p-3 text-center text-green-400 bg-cyan-900/10">{dailySummary.pdtMin[3]}</td>
                      <td className="p-3 text-center bg-slate-900 font-black">{dailySummary.pdtMin[4]}</td>
                    </tr>
                    <tr className="border-t border-slate-700/50">
                      <td className="p-3 text-slate-400 uppercase">UPDT</td>
                      <td className="p-3 text-center">{dailySummary.updtMin[0]}</td>
                      <td className="p-3 text-center">{dailySummary.updtMin[1]}</td>
                      <td className="p-3 text-center">{dailySummary.updtMin[2]}</td>
                      <td className="p-3 text-center text-cyan-400 bg-cyan-900/10">{dailySummary.updtMin[3]}</td>
                      <td className="p-3 text-center bg-slate-900 font-black">{dailySummary.updtMin[4]}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}