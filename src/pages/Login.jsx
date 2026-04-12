import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/authContext'; 
import bgImage from '../assets/login/bg-login.png';
import { CiUser, CiLock } from 'react-icons/ci';
import Button from '../components/Button';
import { FaRegEye, FaRegEyeSlash } from 'react-icons/fa';

export default function Login() {
    const [showPassword, setShowPassword] = useState(false);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const { login } = useAuth(); // Ambil fungsi login dari context
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!username || !password) {
            setError('Username dan password wajib diisi.');
            return;
        }

        setLoading(true);
        const result = await login(username, password);
        setLoading(false);

        if (result.success) {
            // Jika sukses, context otomatis update state user dan token
            navigate('/dashboard');
        } else {
            setError(result.message);
        }
    };

    return (
        <div
            className="flex items-center justify-center min-h-screen px-3 font-sans"
            style={{
                backgroundImage: `url(${bgImage})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundColor: 'rgba(10, 15, 28, 0.8)',
                backgroundBlendMode: 'overlay',
            }}
        >
            <div className="w-full max-w-md">
                <div className="flex items-center justify-center gap-2 mb-8">
                    <svg className="w-6 h-6 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                    <h1 className="text-lg font-semibold text-white tracking-wide uppercase">
                        Login System
                    </h1>
                </div>

                <div className="backdrop-blur-md border-white/60 border-2 rounded-4xl p-6 shadow-xl">
                    <form onSubmit={handleSubmit} className="space-y-4 m-5">
                        <div>
                            <label className="flex items-center gap-2 text-sm text-white mb-3 font-medium">
                                <CiUser className="text-xl text-cyan-300" />
                                Username
                            </label>
                            <input
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                className="w-full px-3 py-2 text-sm bg-[#1e293b]/60 border border-cyan-900/40 rounded-md text-white placeholder-gray-400 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500/30 mb-1"
                                placeholder="Masukkan username"
                                autoComplete="username"
                            />
                        </div>

                        <div>
                            <label className="flex items-center gap-2 text-sm text-white mb-3 font-medium">
                                <CiLock className="text-xl text-cyan-300" />
                                Password
                            </label>

                            <div className="relative">
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full px-3 py-2 pr-9 text-sm bg-[#1e293b]/60 border border-cyan-900/40 rounded-md text-white placeholder-gray-400 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500/30 mb-1"
                                    placeholder="Masukkan password"
                                    autoComplete="current-password"
                                />

                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-cyan-400 hover:text-cyan-300 transition-colors"
                                >
                                    {showPassword ? <FaRegEye size={16} /> : <FaRegEyeSlash size={16} />}
                                </button>
                            </div>
                        </div>

                        {error && <p className="text-red-400 text-xs font-medium text-center">{error}</p>}

                        <Button
                            type="submit"
                            className="w-full py-2 text-sm bg-[#111E2E]! border! border-white! rounded-md backdrop-blur-md! text-white"
                            size="sm"
                            disabled={loading}
                        >
                            {loading ? 'AUTHENTICATING...' : 'LOGIN'}
                        </Button>
                    </form>
                </div>
            </div>
        </div>
    );
}