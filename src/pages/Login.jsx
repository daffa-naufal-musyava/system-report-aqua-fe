import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/authContext';
import bgImage from '../assets/login/bg-login.png';
import { CiUser, CiLock } from 'react-icons/ci';
import { FaRegEye, FaRegEyeSlash } from 'react-icons/fa';
import Button from '../components/Button';

export default function Login() {
    const [showPassword, setShowPassword] = useState(false);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        if (!username || !password) return setError('Username dan password wajib diisi.');

        setLoading(true);
        const result = await login(username, password);
        setLoading(false);

        if (result.success) {
            navigate('/dashboard')
        } else { 
            setError(result.message) 
        };
    };

    return (
        <div className="flex items-center justify-center min-h-screen px-3"
            style={{
                backgroundImage: `url(${bgImage})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundBlendMode: 'overlay',
                backgroundColor: 'rgba(10, 15, 28, 0.8)'
            }}>
            <div className="w-full max-w-md">
                <div className="backdrop-blur-md border-white/60 border-2 rounded-4xl p-6 shadow-xl">
                    <form onSubmit={handleSubmit} className="space-y-4 m-5">
                        <h1 className="text-center text-white font-semibold tracking-widest mb-6">LOGIN SYSTEM</h1>
                        <div>
                            <label className="flex items-center gap-2 text-white text-sm mb-2"><CiUser className="text-cyan-300" /> Username</label>
                            <input type="text" value={username} onChange={(e) => setUsername(e.target.value)}
                                className="w-full p-2 bg-slate-900/60 border border-cyan-900/40 rounded text-white focus:outline-none focus:border-cyan-500" placeholder="Username" />
                        </div>
                        <div>
                            <label className="flex items-center gap-2 text-white text-sm mb-2"><CiLock className="text-cyan-300" /> Password</label>
                            <div className="relative">
                                <input type={showPassword ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)}
                                    className="w-full p-2 bg-slate-900/60 border border-cyan-900/40 rounded text-white focus:outline-none focus:border-cyan-500" placeholder="Password" />
                                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-3 text-cyan-400">
                                    {showPassword ? <FaRegEye size={16} /> : <FaRegEyeSlash size={16} />}
                                </button>
                            </div>
                        </div>
                        {error && <p className="text-red-400 text-xs text-center">{error}</p>}
                        <Button type="submit" disabled={loading} className="w-full py-2 bg-[#111E2E]! border border-white rounded text-white uppercase text-sm font-bold">
                            {loading ? 'Authenticating...' : 'Login'}
                        </Button>
                    </form>
                </div>
            </div>
        </div>
    );
}