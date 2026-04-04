import { useNavigate } from 'react-router-dom';
import Button from '../components/Button';

export default function MachineDetail1() {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-[#0a0f1c] text-white p-6">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold text-white">Production Efficiency</h1>
                <Button variant='primary' size='md' className="absolute top-4 right-4 z-10 bg-red-600! rounded-2xl!" onClick={() => navigate(-1)}>
                    Back
                </Button>
                </div>

                {/* Table */}
                <div className="bg-[#1a2338] rounded-xl overflow-hidden border border-slate-700 shadow-xl">
                    <table className="w-full border-collapse">
                        <thead>
                            <tr className="bg-[#0f172a]">
                                <th className="py-4 px-6 text-left text-sm font-semibold text-slate-300 border-b border-slate-700">Operational Instance</th>
                                <th className="py-4 px-6 text-left text-sm font-semibold text-slate-300 border-b border-slate-700 w-24">Plan</th>
                                <th className="py-4 px-6 text-left text-sm font-semibold text-slate-300 border-b border-slate-700 w-20">Unit</th>
                                <th className="py-4 px-4 text-center text-sm font-semibold text-slate-300 border-b border-slate-700 w-20">14:00</th>
                                <th className="py-4 px-4 text-center text-sm font-semibold text-slate-300 border-b border-slate-700 w-20">15:00</th>
                                <th className="py-4 px-4 text-center text-sm font-semibold text-slate-300 border-b border-slate-700 w-20">16:00</th>
                                <th className="py-4 px-4 text-center text-sm font-semibold text-slate-300 border-b border-slate-700 w-20">17:00</th>
                                <th className="py-4 px-4 text-center text-sm font-semibold text-slate-300 border-b border-slate-700 w-20">18:00</th>
                                <th className="py-4 px-4 text-center text-sm font-semibold text-slate-300 border-b border-slate-700 w-20">19:00</th>
                                <th className="py-4 px-4 text-center text-sm font-semibold text-slate-300 border-b border-slate-700 w-20">20:00</th>
                                <th className="py-4 px-4 text-center text-sm font-semibold text-slate-300 border-b border-slate-700 w-20">21:00</th>
                            </tr>
                        </thead>
                        <tbody className="text-sm">
                            {/* Row 1 */}
                            <tr className="border-b border-slate-700 bg-[#1e2a44]">
                                <td className="py-4 px-6 font-medium">Hasil Produksi - 600ML AQUA LOCAL</td>
                                <td className="py-4 px-6 text-right font-semibold">343,152</td>
                                <td className="py-4 px-6 text-slate-400">PC</td>
                                <td className="py-4 px-4 text-center"></td>
                                <td className="py-4 px-4 text-center"></td>
                                <td className="py-4 px-4 text-center"></td>
                                <td className="py-4 px-4 text-center"></td>
                                <td className="py-4 px-4 text-center"></td>
                                <td className="py-4 px-4 text-center"></td>
                                <td className="py-4 px-4 text-center"></td>
                                <td className="py-4 px-4 text-center"></td>
                            </tr>

                            {/* Designed Speed */}
                            <tr className="border-b border-slate-700">
                                <td className="py-4 px-6 pl-10 text-emerald-400">Designed Speed - 600ML AQUA LOCAL 1X24</td>
                                <td className="py-4 px-6 text-right text-emerald-400">54,000</td>
                                <td className="py-4 px-6 text-slate-400">qty/jam</td>
                                <td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td>
                            </tr>

                            {/* Reject */}
                            <tr className="border-b border-slate-700 bg-[#4c1d24]">
                                <td className="py-4 px-6 pl-10 text-white">Reject - 600ML AQUA LOCAL 1X24</td>
                                <td className="py-4 px-6"></td>
                                <td className="py-4 px-6 text-slate-400">Botol</td>
                                <td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td>
                            </tr>

                            {/* Sample */}
                            <tr className="border-b border-slate-700 bg-[#4c1d24]">
                                <td className="py-4 px-6 pl-10 text-white">Sample - 600ML AQUA LOCAL 1X24</td>
                                <td className="py-4 px-6"></td>
                                <td className="py-4 px-6 text-slate-400">Botol</td>
                                <td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td>
                            </tr>

                            {/* Failures */}
                            {[
                                "Palletizer",
                                "Blower",
                                "Coding",
                                "Conveyor Produk",
                                "Environment - Quality - Safety",
                                "Filler",
                                "Material Supply",
                                "Personil",
                                "PLN",
                                "Utility",
                                "Visual Control",
                                "Warehouse",
                                "Water Treatment",
                                "Wrap Around",
                                "Capper",
                                "Wrap Checker",
                                "Labeller",
                                "Loading",
                                "Passed Applicator"
                            ].map((failure, index) => (
                                <tr key={index} className="border-b border-slate-700 hover:bg-slate-800/50">
                                    <td className="py-3.5 px-6 pl-10 text-slate-300">Failure: {failure}</td>
                                    <td className="py-3.5 px-6"></td>
                                    <td className="py-3.5 px-6 text-slate-400">Menit</td>
                                    <td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td>
                                </tr>
                            ))}

                            {/* RUTN & STOP Rows */}
                            <tr className="border-b border-slate-700 bg-gradient-to-r from-amber-900/30 to-transparent">
                                <td className="py-4 px-6 pl-10 text-amber-400 font-medium">RUTN - Change Over - Bottle Format</td>
                                <td className="py-4 px-6"></td>
                                <td className="py-4 px-6 text-slate-400"></td>
                                <td className="py-4 px-4 text-center text-amber-400">30 menit</td>
                                <td className="py-4 px-4 text-center text-amber-400">30 menit</td>
                                <td></td><td></td><td></td><td></td><td></td><td></td>
                            </tr>

                            <tr className="border-b border-slate-700 bg-gradient-to-r from-amber-900/30 to-transparent">
                                <td className="py-4 px-6 pl-10 text-amber-400 font-medium">RUTN - Pit Stop Maintenance</td>
                                <td className="py-4 px-6"></td>
                                <td className="py-4 px-6 text-slate-400"></td>
                                <td className="py-4 px-4 text-center text-amber-400">30 menit</td>
                                <td className="py-4 px-4 text-center text-amber-400">30 menit</td>
                                <td></td><td></td><td></td><td></td><td></td><td></td>
                            </tr>

                            <tr className="bg-gradient-to-r from-rose-900/40 to-transparent">
                                <td className="py-4 px-6 pl-10 text-rose-400 font-medium">STOP - Weekly Cleaning/Sanitation</td>
                                <td className="py-4 px-6"></td>
                                <td className="py-4 px-6 text-slate-400"></td>
                                <td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}