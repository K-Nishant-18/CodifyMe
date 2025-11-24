import { useState } from 'react';
import { useAuth } from '../context/AuthContext';

const Onboarding = ({ onComplete }) => {
    const [step, setStep] = useState(1);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [error, setError] = useState('');
    const { signup } = useAuth();

    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        password: '',
        confirmPassword: '',
        resume: null,
        jobDescription: '',
        companyName: '',
        deadline: ''
    });

    const handleChange = (e) => {
        const { name, value, files } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: files ? files[0] : value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        // Validate passwords match
        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        setIsAnalyzing(true);

        try {
            // Register user
            await signup(formData.email, formData.password, formData.fullName);

            // Simulate AI Analysis
            setTimeout(() => {
                setIsAnalyzing(false);
                onComplete();
            }, 2000);
        } catch (err) {
            setError(err.response?.data?.message || 'Registration failed. Please try again.');
            setIsAnalyzing(false);
        }
    };

    if (isAnalyzing) {
        return (
            <div className="min-h-screen bg-neo-bg flex flex-col items-center justify-center p-8">
                <div className="text-4xl font-black mb-8 animate-pulse">CREATING YOUR ACCOUNT...</div>
                <div className="w-full max-w-md bg-white border-4 border-black h-12 relative overflow-hidden">
                    <div className="h-full bg-neo-main animate-[width_2s_ease-in-out_infinite]" style={{ width: '100%' }}></div>
                </div>
                <div className="mt-8 space-y-2 text-xl font-bold text-center">
                    <p className="animate-fade-in-up delay-100">Setting up your profile...</p>
                    <p className="animate-fade-in-up delay-300">Preparing your dashboard...</p>
                    <p className="animate-fade-in-up delay-500">Almost ready!</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-neo-bg flex items-center justify-center p-4 font-mono">
            <div className="w-full max-w-2xl bg-white border-4 border-black shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] p-8">
                <h2 className="text-4xl font-black mb-8 text-center uppercase border-b-4 border-black pb-4">
                    Join CodifyMe
                </h2>

                {error && (
                    <div className="mb-4 p-3 bg-red-100 border-2 border-red-500 text-red-700 font-bold">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Account Information */}
                    <div className="space-y-4">
                        <h3 className="text-2xl font-black uppercase">Account Information</h3>

                        <div className="space-y-2">
                            <label className="block text-lg font-bold">Full Name</label>
                            <input
                                type="text"
                                name="fullName"
                                value={formData.fullName}
                                onChange={handleChange}
                                placeholder="John Doe"
                                className="w-full px-4 py-3 border-2 border-black font-mono focus:outline-none focus:ring-2 focus:ring-neo-main"
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="block text-lg font-bold">Email</label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="your@email.com"
                                className="w-full px-4 py-3 border-2 border-black font-mono focus:outline-none focus:ring-2 focus:ring-neo-main"
                                required
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="block text-lg font-bold">Password</label>
                                <input
                                    type="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    placeholder="••••••••"
                                    className="w-full px-4 py-3 border-2 border-black font-mono focus:outline-none focus:ring-2 focus:ring-neo-main"
                                    required
                                    minLength={6}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="block text-lg font-bold">Confirm Password</label>
                                <input
                                    type="password"
                                    name="confirmPassword"
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    placeholder="••••••••"
                                    className="w-full px-4 py-3 border-2 border-black font-mono focus:outline-none focus:ring-2 focus:ring-neo-main"
                                    required
                                    minLength={6}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Optional: Career Goals */}
                    <div className="space-y-4 pt-4 border-t-2 border-black">
                        <h3 className="text-2xl font-black uppercase">Career Goals (Optional)</h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="block text-lg font-bold">Target Company</label>
                                <input
                                    type="text"
                                    name="companyName"
                                    value={formData.companyName}
                                    onChange={handleChange}
                                    placeholder="e.g. Google, Amazon"
                                    className="w-full px-4 py-3 border-2 border-black font-mono focus:outline-none focus:ring-2 focus:ring-neo-main"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="block text-lg font-bold">Target Date</label>
                                <input
                                    type="date"
                                    name="deadline"
                                    value={formData.deadline}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 border-2 border-black font-mono focus:outline-none focus:ring-2 focus:ring-neo-main"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="block text-lg font-bold">Job Description (Optional)</label>
                            <textarea
                                name="jobDescription"
                                value={formData.jobDescription}
                                onChange={handleChange}
                                placeholder="Paste the job description you're targeting..."
                                className="w-full px-4 py-3 border-2 border-black font-mono h-32 resize-none focus:outline-none focus:ring-2 focus:ring-neo-main"
                            ></textarea>
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-neo-main border-2 border-black px-6 py-4 font-black text-xl uppercase shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] transition-all"
                    >
                        Create Account ⚡
                    </button>

                    <div className="text-center pt-4">
                        <p className="font-bold">
                            Already have an account?{' '}
                            <a href="/login" className="text-neo-main underline hover:no-underline">
                                Login
                            </a>
                        </p>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Onboarding;
