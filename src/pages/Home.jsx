import { Link, useParams } from 'react-router-dom';
import ImgLoc from '../assets/home/maps-location.png'

export default function Home() {
    const { lineId } = useParams();
    return (
        <div className="w-full h-screen overflow-auto bg-[#0a0f1c] flex items-center justify-center">
            <div className="relative min-w-[900px] aspect-[16/9] max-h-screen">

                {/* IMAGE */}
                <img
                    src={ImgLoc}
                    alt="Location"
                    className="absolute inset-0 w-full h-full object-contain pointer-events-none select-none"
                />

                {/* CLICK AREA */}
                <Link
                    to={`/screen-delivery/${lineId || '1'}`}
                    className="absolute z-20 w-[6%] h-[4%] bg-blue-500/50 hover:bg-blue-500/80 rounded transition-all"
                    style={{
                        top: '43%', 
                        left: '37%',
                        transform: 'translate(-50%, -50%) rotate(40deg)'
                    }}
                >
                    <span className="text-[8px] md:text-xs font-bold text-white flex items-center justify-center w-full h-full">
                        Line
                    </span>
                </Link>

            </div>
        </div>
    );
}