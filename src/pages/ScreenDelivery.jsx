import { useNavigate, useLocation } from 'react-router-dom';
import MachineSection from '../components/MachineSection';

const DATA_MAPPING = {
  // Ini data lengkap awalmu saya jadikan default
  'full_monitoring': [
    {
      title: 'UPES DROP PRESSURE COMPOSER',
      values: ['24.3 bar', '6.50 bar', '6.94 bar'],
      statusColors: ['green', 'red', 'red'], 
      chartBases: [24.3, 6.5, 6.94], 
    },
    {
      title: 'UPES SHAKE CELLAR',
      values: ['72.1 %H', '21.4 °C', '2.69 Pa'],
      statusColors: ['red', 'green', 'green'],
      chartBases: [72.1, 21.4, 2.69],
    },
    {
      title: 'MODULE 2 Differential Pressure',
      values: ['65.6 %H', '17.3 °C', '5.51 Pa'],
      statusColors: ['green', 'green', 'green'],
      chartBases: [65.6, 17.3, 5.51],
    },
    {
      title: 'MODULE 2 Differential Pressure',
      values: ['58.3 %H', '20.4 °C', '4.77 bar'],
      statusColors: ['green', 'green', 'green'],
      chartBases: [58.3, 20.4, 4.77],
    },
    {
      title: 'MODULE 3 Differential Pressure',
      values: ['77.5 %H', '21.0 °C', '21.0 Pa'],
      statusColors: ['red', 'green', 'green'],
      chartBases: [77.5, 21.0, 21.0],
    },
    {
      title: 'MODULE 3 Differential Pressure',
      values: ['77.5 %H', '21.0 °C', '21.0 Pa'],
      statusColors: ['green', 'green', 'green'],
      chartBases: [77.5, 21.0, 21.0],
    },
  ]
};

export default function ScreenDelivery() {
  const navigate = useNavigate();
  const location = useLocation();

  // Ambil ID mesin. Kalau ID-nya 'paletizer' mau data beda, tinggal tambah di DATA_MAPPING
  const machine = location.state?.machine || { id: 'full_monitoring', name: 'UPES DROP PRESSURE COMPOSER' };
  
  // Ambil data berdasarkan ID mesin, kalau ga ada tampilkan semua (full_monitoring)
  const sections = DATA_MAPPING[machine.id] || DATA_MAPPING['full_monitoring'];

  return (
    <div className="min-h-screen bg-[#0a0f1c] text-white p-4 md:p-6 font-sans relative">
      <button
        onClick={() => navigate(-1)}
        className="absolute top-6 right-6 px-6 py-2 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg shadow-lg shadow-red-900/40 transition-all duration-200 z-50"
      >
        Back
      </button>

      <div className="max-w-7xl mx-auto space-y-6 pt-16">
        <h1 className="text-2xl md:text-3xl font-bold text-cyan-300 tracking-wide uppercase italic">
          *{machine.name}*
        </h1>

        {sections.map((section, idx) => (
          <MachineSection key={idx} section={section} idx={idx} />
        ))}
      </div>
    </div>
  );
}