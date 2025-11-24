import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

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

    return (
        <div className="min-h-screen bg-neo-bg flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                {/* Logo/Title */}
                <div className="text-center mb-8">
                    <h1 className="text-5xl font-black uppercase tracking-tighter mb-2">CodifyMe</h1>
                    <p className="text-lg font-bold">Welcome Back!</p>
                </div>

                {/* Login Form */}
                <div className="bg-white border-4 border-black p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
                    <h2 className="text-2xl font-black mb-6 uppercase">Login</h2>

                    {error && (
                        <div className="mb-4 p-3 bg-red-100 border-2 border-red-500 text-red-700 font-bold">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit}>
                        <div className="mb-4">
                            <label className="block font-bold mb-2" htmlFor="email">
                                Email
                            </label>
                            <input
                                id="email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full px-4 py-3 border-2 border-black font-mono focus:outline-none focus:ring-2 focus:ring-neo-main"
                                placeholder="your@email.com"
                                required
                            />
                        </div>

                        <div className="mb-6">
                            <label className="block font-bold mb-2" htmlFor="password">
                                Password
                            </label>
                            <input
                                id="password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full px-4 py-3 border-2 border-black font-mono focus:outline-none focus:ring-2 focus:ring-neo-main"
                                placeholder="••••••••"
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-neo-main border-2 border-black px-6 py-3 font-black uppercase shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? 'Logging in...' : 'Login'}
                        </button>
                    </form>

                    <div className="mt-6 text-center">
                        <p className="font-bold">
                            Don't have an account?{' '}
                            <Link to="/onboarding" className="text-neo-main underline hover:no-underline">
                                Sign Up
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Login;
