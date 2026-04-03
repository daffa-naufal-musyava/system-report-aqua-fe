
import { useNavigate } from 'react-router-dom';
import { BarChart, Bar, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine } from 'recharts';

const hourlyData = [
    { jam: '06-07', output: 50880, target: 50220, reject: 0, catatan: '' },
    { jam: '07-08', output: 51840, target: 50220, reject: 0, catatan: '' },
    { jam: '08-09', output: 52800, target: 50220, reject: 0, catatan: '' },
    { jam: '09-10', output: 30720, target: 50220, reject: 261, catatan: 'REJECT 261' },
    { jam: '10-11', output: 0, target: 50220, reject: 261, catatan: 'REJECT 261' },
    { jam: '11-12', output: 0, target: 50220, reject: 261, catatan: 'REJECT 261' },
    { jam: '12-13', output: 0, target: 50220, reject: 0, catatan: '' },
    { jam: '13-14', output: 0, target: 50220, reject: 0, catatan: '' },
];

const summaryData = {
    shift1: { re: '86.22%', pr: '86.22%', pdt: '0.00%', updt: '0.00%', upst: '0' },
    // Bisa tambah shift lain kalau perlu
};

export default function MachineDetail2() {
    const navigate = useNavigate();

    return (
        <div className="bg-[#0a0f1c] text-white p-4 md:p-4 relative">
            {/* Back Button */}

            <div className=" mx-auto space-y-6 pt-5">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <h1 className="text-2xl md:text-3xl font-bold text-[#6FBEC3] tracking-wide">
                        Standard Center Line
                    </h1>
                    <div className="flex items-center gap-4 flex-wrap">
                        <span className="text-lg">2025-11-18</span>
                        <select className="bg-[#111827] border border-slate-600 rounded px-4 py-2 text-white">
                            <option>SHIFT 1</option>
                            <option>SHIFT 2</option>
                            <option>SHIFT 3</option>
                        </select>
                        <select className="bg-[#111827] border border-slate-600 rounded px-4 py-2 text-white">
                            <option>CJR 5 - Krones (6x24)</option>
                        </select>
                        <button className="px-6 py-2 bg-[#111827] border border-slate-600 rounded font-medium shadow-lg">
                            SUBMIT
                        </button>
                        <button className="px-4 py-2">
                            Auto Detect Tanggal & Shift
                        </button>
                        <input type="checkbox" />
                    </div>
                    <button
                        onClick={() => navigate(-1)}
                        className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg shadow-lg shadow-red-900/40 transition-all duration-200"
                    >
                        Back
                    </button>
                </div>

                <div className='flex gap-3'>
                    <div className="w-100 mt-2">
                        <div className="backdrop-blur-sm border mb-3 border-slate-700/50 rounded-xl p-3 shadow-lg bg-linear-to-b from-red-800 to-red-500">
                            <h3 className="text-lg text-center text-white">
                                AVG OUTPUT/JAM | SHIFT-1
                            </h3>
                            <div className="relative text-center px-4 py-2 rounded-lg text-2xl 
                                before:content-[''] before:absolute before:left-0 before:top-0 
                                before:h-full before:w-2 
                                before:bg-[#FEF987]">
                                52943 | 98.04% RE
                            </div>
                        </div>

                        <div className="bg-[#111827]/70 mb-3 backdrop-blur-sm border border-slate-700/50 rounded-xl p-3 shadow-lg">
                            <h3 className="text-2xl text-center">Target Output</h3>
                            <hr className="bg-linear-to-r from-[#9CF87F] to-[#35C924] mt-3 h-0.5 border-0" />
                            <div className="relative text-center px-4 py-2 rounded-lg text-2xl 
                                before:content-[''] before:absolute before:left-0 before:top-0 
                                before:h-full before:w-1 before:bg-linear-to-b 
                                before:from-[#9CF87F] before:to-[#35C924]">
                                50220 | 93% RE
                            </div>
                        </div>

                        <div className="bg-[#111827]/70 backdrop-blur-sm border border-slate-700/50 rounded-xl p-3 shadow-lg">
                            <h3 className="text-2xl text-center">AVG OUTPUT/JAM | SHIFT 3</h3>
                            <hr className="bg-linear-to-r from-[#9CF87F] to-[#35C924] mt-3 h-0.5 border-0" />
                            <div className="relative text-center px-4 py-2  text-2xl 
                                before:content-[''] before:absolute before:left-0 before:top-0 
                                before:h-full before:w-1 before:bg-linear-to-b 
                                before:from-[#9CF87F] before:to-[#35C924] text-[#9CF87F] bg-linear-to-r from-green-900/50 to-[#111827]/70">
                                52943 | 98.04% RE
                            </div>
                        </div>
                    </div>

                    <div className="bg-[#111827]/70 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6 w-300 shadow-lg">
                        <h2 className="text-xl font-bold text-cyan-400 mb-4">AVG OUTPUT/JAM | SHIFT-1</h2>
                        <div className="h-80">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={hourlyData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                                    <XAxis dataKey="jam" stroke="#94a3b8" />
                                    <YAxis stroke="#94a3b8" />
                                    <Tooltip
                                        contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #475569' }}
                                        labelStyle={{ color: '#e2e8f0' }}
                                    />
                                    <Legend />
                                    <Bar dataKey="output" fill="#22c55e" name="Actual Output" />
                                    <Bar dataKey="target" fill="#ef4444" name="Target" opacity={0.3} />
                                    <Line type="monotone" dataKey="target" stroke="#ef4444" strokeWidth={2} dot={false} name="Target Line" />
                                    <ReferenceLine x="09-10" stroke="#ef4444" strokeDasharray="3 3" />
                                    <ReferenceLine x="10-11" stroke="#ef4444" strokeDasharray="3 3" />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>

                    </div>
                    <div>
                        <table className="w-full border-collapse overflow-hidden">
                            <thead>
                                <tr className="bg-[#141D2B] text-white">
                                    <th className="p-2 w-30 text-left border border-slate-700">Waktu</th>
                                    <th className="p-2 w-40 text-left border border-slate-700">Catatan</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr className="">
                                    <td className="p-2 border border-slate-700">13:00:00</td>
                                    <td className="p-2 border border-slate-700">REJECT 261</td>
                                </tr>
                                <tr className="">
                                    <td className="p-2 border border-slate-700">13:00:00</td>
                                    <td className="p-2 border border-slate-700">REJECT 261</td>
                                </tr>
                                <tr className="">
                                    <td className="p-2 border border-slate-700">13:00:00</td>
                                    <td className="p-2 border border-slate-700">REJECT 261</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>


                <div className="flex mt-10">
                    <h3 className="text-lg font-bold mb-4">Product, FG 208575 | </h3>
                    <p className="text-lg ms-3 text-red-500">
                        ""Total Downtime di halaman ini tidak memperhitungkan loss timedi produksi reject dan sample
                    </p>
                </div>
                <div className="bg-[#111827]/70 backdrop-blur-sm border border-slate-700/50 shadow-lg overflow-x-auto">
                    <table className="w-full text-sm border-collapse">
                        <thead>
                            <tr className="bg-slate-800/60">
                                <th className="p-3 text-left text-xl font-bold text-cyan-400 border border-slate-700">
                                    PR Losses (Menit)
                                </th>
                                {hourlyData.map((h) => (
                                    <th key={h.jam} className="p-3 text-center border border-slate-700">
                                        {h.jam}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            <tr className="border-t border-slate-600">
                                <td className="p-3 font-medium border border-slate-700">
                                    Total Planned Downtime - PDT (Menit)
                                </td>
                                <td className="p-3 text-center border border-slate-700">
                                    0
                                </td>
                                <td className="p-3 text-center border border-slate-700">
                                    0
                                </td>
                                <td className="p-3 text-center border border-slate-700">
                                    0
                                </td>
                                <td className="p-3 text-center border border-slate-700">
                                    0
                                </td>
                                <td className="p-3 text-center border border-slate-700">
                                    0
                                </td>
                                <td className="p-3 text-center border border-slate-700">
                                    0
                                </td>
                                <td className="p-3 text-center border border-slate-700">
                                    0
                                </td>
                                <td className="p-3 text-center border border-slate-700">
                                    0
                                </td>
                            </tr>
                            <tr className="border-t border-slate-600">
                                <td className="p-3 font-medium border border-slate-700">
                                    Unplanned Downtime (PDT / Menit)
                                </td>
                                <td className="p-3 text-center border border-slate-700">
                                    0
                                </td>
                                <td className="p-3 text-center border border-slate-700">
                                    0
                                </td>
                                <td className="p-3 text-center border border-slate-700">
                                    0
                                </td>
                                <td className="p-3 text-center border border-slate-700">
                                    0
                                </td>
                                <td className="p-3 text-center border border-slate-700">
                                    0
                                </td>
                                <td className="p-3 text-center border border-slate-700">
                                    0
                                </td>
                                <td className="p-3 text-center border border-slate-700">
                                    0
                                </td>
                                <td className="p-3 text-center border border-slate-700">
                                    0
                                </td>
                            </tr>
                            <tr className="border-t border-slate-600 bg-yellow-900/30">
                                <td className="p-3 font-medium border border-slate-700">
                                    Unplanned Stoppages (PDT / Menit)
                                </td>
                                {hourlyData.map((h, i) => (
                                    <td key={i} className="p-3 text-center border border-slate-700">
                                        {i === 3 ? "6" : "0"}
                                    </td>
                                ))}
                            </tr>
                            <tr className="border-t border-slate-600">
                                <td className="p-3 font-medium border border-slate-700">
                                    REJECT MATERIAL (Pcs)
                                </td>
                                <td className="p-3 text-center border border-slate-700">
                                    6
                                </td>
                                <td className="p-3 text-center border border-slate-700">
                                    6
                                </td>
                                <td className="p-3 text-center border border-slate-700">
                                    6
                                </td>
                                <td className="p-3 text-center border border-slate-700">
                                    6
                                </td>
                                <td className="p-3 text-center border border-slate-700">
                                    6
                                </td>
                                <td className="p-3 text-center border border-slate-700">
                                    6
                                </td>
                                <td className="p-3 text-center border border-slate-700">
                                    6
                                </td>
                                <td className="p-3 text-center border border-slate-700">
                                    6
                                </td>
                            </tr>
                            <tr className="border-t border-slate-600 bg-yellow-900/30">
                                <td className="p-3 font-medium border border-slate-700">
                                    REJECT PROCESS (Pcs)
                                </td>
                                <td className="p-3 text-center border border-slate-700">85</td>
                                <td colSpan={3} className="p-3 text-center border border-slate-700">
                                    VISUAL ISI: 85
                                </td>
                                <td colSpan={4} className="p-3 text-center border border-slate-700">
                                    VISUAL KOSONG: 0
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
                    {/* SUMMARY */}
                    <div className="bg-[#111827]/70 backdrop-blur-sm border border-slate-700/50 rounded-xl p-3 shadow-lg">
                        <h3 className="text-xl text-[#74BEC4] font-bold text-center">SUMMARY</h3>
                        <hr className="bg-linear-to-r from-[#9CF87F] to-[#35C924] mt-2 h-0.5 border-0" />
                        <div className="relative text-center px-4 py-2 text-xl 
        before:content-[''] before:absolute before:left-0 before:top-0 
        before:h-full before:w-1 before:bg-linear-to-b 
        before:from-[#9CF87F] before:to-[#35C924] text-[#9CF87F] 
        bg-linear-to-r from-green-900/50 to-[#111827]/70">
                            SHIFT 1:
                        </div>
                    </div>

                    {/* RE */}
                    <div className="bg-[#111827]/70 backdrop-blur-sm border border-slate-700/50 rounded-xl p-3 shadow-lg">
                        <h3 className="text-xl text-[#74BEC4] font-bold text-center">RE</h3>
                        <hr className="bg-linear-to-r from-[#9CF87F] to-[#35C924] mt-2 h-0.5 border-0" />
                        <div className="relative text-center px-4 py-2 text-2xl 
        before:content-[''] before:absolute before:left-0 before:top-0 
        before:h-full before:w-1 before:bg-linear-to-b 
        before:from-[#9CF87F] before:to-[#35C924] text-[#9CF87F] 
        bg-linear-to-r from-green-900/50 to-[#111827]/70">
                            {summaryData.shift1.re}
                        </div>
                    </div>

                    {/* PR */}
                    <div className="bg-[#111827]/70 backdrop-blur-sm border border-slate-700/50 rounded-xl p-3 shadow-lg">
                        <h3 className="text-xl text-[#74BEC4] font-bold text-center">PR</h3>
                        <hr className="bg-linear-to-r from-[#9CF87F] to-[#35C924] mt-2 h-0.5 border-0" />
                        <div className="relative text-center px-4 py-2 text-2xl 
        before:content-[''] before:absolute before:left-0 before:top-0 
        before:h-full before:w-1 before:bg-linear-to-b 
        before:from-[#9CF87F] before:to-[#35C924] text-[#9CF87F] 
        bg-linear-to-r from-green-900/50 to-[#111827]/70">
                            {summaryData.shift1.pr}
                        </div>
                    </div>

                    {/* PDT */}
                    <div className="bg-[#111827]/70 backdrop-blur-sm border border-slate-700/50 rounded-xl p-3 shadow-lg">
                        <h3 className="text-xl text-[#74BEC4] font-bold text-center">PDT</h3>
                        <hr className="bg-linear-to-r from-[#9CF87F] to-[#35C924] mt-2 h-0.5 border-0" />
                        <div className="relative text-center px-4 py-2 text-2xl 
        before:content-[''] before:absolute before:left-0 before:top-0 
        before:h-full before:w-1 before:bg-linear-to-b 
        before:from-[#9CF87F] before:to-[#35C924] text-[#9CF87F] 
        bg-linear-to-r from-green-900/50 to-[#111827]/70">
                            {summaryData.shift1.pdt}
                        </div>
                    </div>

                    {/* UPDT */}
                    <div className="bg-[#111827]/70 backdrop-blur-sm border border-slate-700/50 rounded-xl p-3 shadow-lg">
                        <h3 className="text-xl text-[#74BEC4] font-bold text-center">UPDT</h3>
                        <hr className="bg-linear-to-r from-[#9CF87F] to-[#35C924] mt-2 h-0.5 border-0" />
                        <div className="relative text-center px-4 py-2 text-2xl 
        before:content-[''] before:absolute before:left-0 before:top-0 
        before:h-full before:w-1 before:bg-linear-to-b 
        before:from-[#9CF87F] before:to-[#35C924] text-[#9CF87F] 
        bg-linear-to-r from-green-900/50 to-[#111827]/70">
                            {summaryData.shift1.updt}
                        </div>
                    </div>

                    {/* UPST */}
                    <div className="bg-[#111827]/70 backdrop-blur-sm border border-slate-700/50 rounded-xl p-3 shadow-lg">
                        <h3 className="text-xl text-[#74BEC4] font-bold text-center">UPST</h3>
                        <hr className="bg-linear-to-r from-[#9CF87F] to-[#35C924] mt-2 h-0.5 border-0" />
                        <div className="relative text-center px-4 py-2 text-2xl 
        before:content-[''] before:absolute before:left-0 before:top-0 
        before:h-full before:w-1 before:bg-linear-to-b 
        before:from-[#9CF87F] before:to-[#35C924] text-[#9CF87F] 
        bg-linear-to-r from-green-900/50 to-[#111827]/70">
                            {summaryData.shift1.upst}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}