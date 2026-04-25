import { Link, useParams } from 'react-router-dom';
import ImgLoc from '../assets/home/maps-location.png'

export default function Home() {
    const { lineId } = useParams();

    return (
        <div className="h-screen relative bg-[#0a0f1c] flex items-center justify-center text-white">
            <img src={ImgLoc} alt="Location" className="max-h-screen" />
            <Link to={`/screen-delivery/${lineId || '1'}`} className="absolute top-60 left-120 w-13 h-10 bg-blue-500/50 rotate-40 text-white font-bold py-2 px-4 rounded">
                Line
            </Link>
        </div>
    );
}