import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Mail, Lock, ArrowRight, Terminal, Zap, Home } from 'lucide-react';

function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { login } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            await login(email, password);
            navigate('/dashboard');
        } catch (err) {
            setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-neo-black flex flex-col items-center justify-center p-8 font-mono text-neo-green">
                <Terminal className="w-16 h-16 mb-6 animate-bounce" />
                <h2 className="text-4xl font-black mb-4 uppercase animate-pulse">AUTHENTICATING...</h2>
                <div className="w-64 h-3 bg-neo-black border-2 border-neo-green relative overflow-hidden">
                    <div className="h-full bg-neo-green animate-pulse"></div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex font-mono overflow-hidden relative">
            {/* Home Button */}
            <Link to="/" className="absolute top-6 right-7 z-50 bg-red-500 border-2 border-neo-black p-2 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] transition-all group">
                <Home className="w-6 h-6 text-neo-black group-hover:text-neo-green transition-colors" />
            </Link>
            {/* LEFT SIDE - BRANDING */}
            <div className="hidden md:flex md:w-5/12 bg-neo-black text-neo-white p-12 flex-col justify-between relative overflow-hidden">
                {/* Animated grid background */}
                <div className="absolute inset-0 opacity-20" style={{
                    backgroundImage: 'radial-gradient(circle, #22c55e 1px, transparent 1px)',
                    backgroundSize: '30px 30px'
                }}></div>

                <div className="z-10">
                    <div className="flex items-center gap-2 mb-8">
                        <div className="w-8 h-8 bg-neo-green border-2 border-neo-white"></div>
                        <span className="font-black text-2xl tracking-tighter">CODIFYME</span>
                    </div>
                    <h1 className="text-6xl md:text-7xl font-black leading-none mb-6">
                        WELCOME<br />
                        <span className="text-neo-green">BACK</span><br />
                        DEVELOPER
                    </h1>
                    <p className="text-xl font-bold text-gray-400 max-w-md">
                        Continue your journey to becoming an elite software engineer.
                    </p>
                </div>

                {/* Stats/Features */}
                <div className="z-10 grid grid-cols-3 gap-4">
                    <div className="bg-neo-white/10 backdrop-blur-sm border-2 border-neo-white/20 p-4">
                        <div className="text-3xl font-black text-neo-green">10K+</div>
                        <div className="text-xs font-bold text-gray-400">USERS</div>
                    </div>
                    <div className="bg-neo-white/10 backdrop-blur-sm border-2 border-neo-white/20 p-4">
                        <div className="text-3xl font-black text-neo-green">500+</div>
                        <div className="text-xs font-bold text-gray-400">COMPANIES</div>
                    </div>
                    <div className="bg-neo-white/10 backdrop-blur-sm border-2 border-neo-white/20 p-4">
                        <div className="text-3xl font-black text-neo-green">95%</div>
                        <div className="text-xs font-bold text-gray-400">SUCCESS</div>
                    </div>
                </div>
            </div>

            {/* RIGHT SIDE - LOGIN FORM */}
            <div className="w-full md:w-7/12 bg-neo-bg p-8 flex items-center justify-center relative">
                {/* Grid pattern overlay */}
                <div className="absolute inset-0 opacity-30 pointer-events-none" style={{
                    backgroundImage: 'linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)',
                    backgroundSize: '50px 50px'
                }}></div>

                <div className="w-full max-w-md z-10">
                    {/* Mobile Logo */}
                    <div className="md:hidden flex items-center justify-center gap-2 mb-8">
                        <div className="w-8 h-8 bg-neo-green border-2 border-neo-black"></div>
                        <span className="font-black text-2xl tracking-tighter">CODIFYME</span>
                    </div>

                    <div className="bg-white border-4 border-neo-black shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] p-8 md:p-10 relative">
                        {/* Decorative corner */}
                        <div className="absolute -top-3 -right-3 w-8 h-8 bg-neo-green border-2 border-neo-black z-20"></div>

                        <div className="mb-8">
                            <h2 className="text-3xl md:text-4xl font-black uppercase mb-2">Login</h2>
                            <p className="text-gray-600 font-bold">Access your dashboard</p>
                        </div>

                        {error && (
                            <div className="mb-6 p-4 bg-red-100 border-l-4 border-red-500 text-red-700 font-bold flex items-center gap-2 animate-shake">
                                <Terminal className="w-5 h-5" />
                                {error}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div className="group">
                                <label className="block text-sm font-black uppercase mb-2 group-focus-within:text-neo-green transition-colors">
                                    Email Address
                                </label>
                                <div className="relative">
                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-neo-black transition-colors" />
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="w-full pl-12 pr-4 py-4 border-2 border-neo-black font-bold focus:outline-none focus:ring-4 focus:ring-neo-green/20 focus:border-neo-green transition-all bg-gray-50 focus:bg-white"
                                        placeholder="dev@codifyme.com"
                                        required
                                        autoFocus
                                    />
                                </div>
                            </div>

                            <div className="group">
                                <label className="block text-sm font-black uppercase mb-2 group-focus-within:text-neo-green transition-colors">
                                    Password
                                </label>
                                <div className="relative">
                                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-neo-black transition-colors" />
                                    <input
                                        type="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="w-full pl-12 pr-4 py-4 border-2 border-neo-black font-bold focus:outline-none focus:ring-4 focus:ring-neo-green/20 focus:border-neo-green transition-all bg-gray-50 focus:bg-white"
                                        placeholder="••••••••"
                                        required
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                className="w-full bg-neo-black text-neo-white border-2 border-neo-black py-4 font-black text-xl uppercase shadow-[6px_6px_0px_0px_#22c55e] hover:shadow-[3px_3px_0px_0px_#22c55e] hover:translate-x-[3px] hover:translate-y-[3px] transition-all flex items-center justify-center gap-2 group"
                            >
                                Login
                                <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
                            </button>
                        </form>

                        <div className="mt-8 text-center">
                            <p className="font-bold text-gray-600">
                                Don't have an account?{' '}
                                <Link to="/onboarding" className="text-neo-black underline decoration-2 decoration-neo-green hover:bg-neo-green transition-colors">
                                    Sign Up
                                </Link>
                            </p>
                        </div>

                        {/* Quick Demo Access */}
                        <div className="mt-6 pt-6 border-t-2 border-gray-200">
                            <div className="bg-neo-green/10 border-2 border-neo-green p-4">
                                <div className="flex items-center gap-2 mb-2">
                                    <Zap className="w-5 h-5 text-neo-green" />
                                    <span className="font-black text-sm uppercase">Quick Demo</span>
                                </div>
                                <p className="text-xs font-bold text-gray-600">
                                    Use any email/password to test the app
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Login;
