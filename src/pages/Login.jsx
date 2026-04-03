// src/pages/Login.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Login() {
    const [showPassword, setShowPassword] = useState(false);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        if (!username || !password) {
            setError('Username dan password wajib diisi.');
            return;
        }

        if (username === 'admin' && password === '12345') {
            setSuccess('Login berhasil! Selamat datang 👋');
            localStorage.setItem('isLoggedIn', 'true');
            navigate('/dashboard');
        } else {
            setError('Username atau password salah.');
        }
    };

    return (
        <div className="min-h-screen bg-[#0a0f1c] flex items-center justify-center px-4 font-sans">
            <div className="w-full max-w-105 space-y-8">
                <div className="text-center flex gap-10 items-center">
                    <div className="inline-block ms-4 p-4 mt-4 mb-4">
                        <svg
                            className="w-8 h-8 text-cyan-400"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                            />
                        </svg>
                    </div>
                    <h1 className="text-3xl font-bold text-[#8FE2F2] tracking-wider">
                        SYSTEM LOGIN
                    </h1>
                </div>
                <div className="h-0.5 w-auto bg-linear-to-r from-cyan-500 to-blue-500 mx-auto mt-3 rounded-full"></div>

                <div className="bg-[#111827]/70 backdrop-blur-md border border-[#8FE2F2] rounded-xl p-8 shadow-2xl shadow-black/60">
                    <form className="space-y-7" onSubmit={handleSubmit}>
                        {/* Username */}
                        <div className="relative">
                            <label className="block text-sm font-medium text-cyan-300 mb-2 flex items-center gap-2.5">
                                Username
                            </label>
                            <input
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                className="w-full pl-4 pr-4 py-3.5 bg-[#1e293b]/60 border border-cyan-900/50 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500/30 transition-all duration-200"
                                placeholder="Masukkan username"
                                autoComplete="username"
                            />
                        </div>

                        {/* Password */}
                        <div className="relative">
                            <label className="block text-sm font-medium text-cyan-300 mb-2 flex items-center gap-2.5">
                                Password
                            </label>
                            <div className="relative">
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full pl-4 pr-11 py-3.5 bg-[#1e293b]/60 border border-cyan-900/50 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500/30 transition-all duration-200"
                                    placeholder="Masukkan password"
                                    autoComplete="current-password"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-cyan-400 hover:text-cyan-300 focus:outline-none transition-colors"
                                >
                                    {showPassword ? (
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                        </svg>
                                    ) : (
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3l18 18M9.75 9.75a2.999 2.999 0 004.5 4.5m5.137-5.137a8.002 8.002 0 01-3.137 5.137m-8 0a8.002 8.002 0 01-3.137-5.137" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 5c4.478 0 8.268 2.943 9.542 7a9.97 9.97 0 01-3.137 5.137" />
                                        </svg>
                                    )}
                                </button>
                            </div>
                        </div>

                        {/* Remember & Forgot */}
                        <div className="flex items-center justify-between text-sm">
                            <label className="flex items-center text-gray-300 cursor-pointer">
                                <input
                                    type="checkbox"
                                    className="w-4 h-4 rounded border border-[#8FE2F2] text-cyan-500 focus:ring-cyan-500/30"
                                />
                                <span className="ml-2.5">Remember me</span>
                            </label>
                        </div>

                        {/* Error / Success Message */}
                        {error && <p className="text-red-400 text-sm">{error}</p>}
                        {success && <p className="text-green-400 text-sm">{success}</p>}

                        {/* Login Button */}
                        <button
                            type="submit"
                            className="w-full py-3.5 px-6 bg-linear-to-r from-blue-700 to-cyan-600 hover:from-blue-600 hover:to-cyan-500 text-white font-semibold rounded-lg shadow-lg shadow-cyan-900/40 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 transition-all duration-200 transform hover:scale-[1.02] active:scale-95"
                        >
                            LOGIN
                        </button>
                        <div className="flex justify-center">
                            <a
                                href="#"
                                className="text-cyan-400 hover:text-cyan-300 transition-colors"
                            >
                                Forgot password?
                            </a>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}