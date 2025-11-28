import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ArrowRight, Check, Terminal, Briefcase, User, Lock, ChevronRight, Star, Home } from 'lucide-react';

const Onboarding = ({ onComplete }) => {
    const [step, setStep] = useState(1);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [error, setError] = useState('');
    const { signup } = useAuth();

    // Animation state
    const [mounted, setMounted] = useState(false);
    useEffect(() => setMounted(true), []);

    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        password: '',
        confirmPassword: '',
        companyName: '',
        targetRole: '',
        deadline: '',
        experienceLevel: 'beginner', // beginner, intermediate, pro
        resume: null,
        jobDescription: ''
    });

    const handleChange = (e) => {
        const { name, value, files } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: files ? files[0] : value
        }));
    };

    const nextStep = (e) => {
        e.preventDefault(); // Prevent form submission
        if (step === 1) {
            if (!formData.fullName || !formData.email || !formData.password) {
                setError('Please fill in all required fields');
                return;
            }
            if (formData.password !== formData.confirmPassword) {
                setError('Passwords do not match');
                return;
            }
        }
        setError('');
        setStep(prev => prev + 1);
    };

    const prevStep = (e) => {
        e.preventDefault(); // Prevent form submission
        setStep(prev => prev - 1);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Prevent submission if not on the final step
        if (step !== 2) {
            nextStep(e);
            return;
        }

        setError('');
        setIsAnalyzing(true);

        try {
            // Prepare profile data
            const profileData = {
                targetCompany: formData.companyName,
                targetRole: formData.targetRole,
                deadline: formData.deadline,
                jobDescription: formData.jobDescription,
                experienceLevel: formData.experienceLevel
                // Note: Resume file handling will be added later
            };

            await signup(formData.email, formData.password, formData.fullName, profileData);
            // Simulate AI Analysis with a longer, cooler delay
            setTimeout(() => {
                setIsAnalyzing(false);
                onComplete();
            }, 3000);
        } catch (err) {
            setError(err.response?.data?.message || 'Registration failed. Please try again.');
            setIsAnalyzing(false);
        }
    };

    // Loading Screen (Hacker Style)
    if (isAnalyzing) {
        return (
            <div className="min-h-screen bg-neo-black flex flex-col items-center justify-center p-8 font-mono text-neo-green relative overflow-hidden">
                {/* Background Glitch Effect */}
                <div className="absolute inset-0 opacity-10 pointer-events-none">
                    {[...Array(20)].map((_, i) => (
                        <div key={i} className="whitespace-nowrap animate-marquee" style={{ animationDuration: `${Math.random() * 5 + 2}s` }}>
                            {Array(50).fill('101001 CODIFYME AI ').join('')}
                        </div>
                    ))}
                </div>

                <div className="z-10 text-center max-w-2xl w-full">
                    <Terminal className="w-16 h-16 mx-auto mb-6 animate-bounce" />
                    <h2 className="text-4xl md:text-6xl font-black mb-8 uppercase glitch-text">
                        INITIALIZING SYSTEM
                    </h2>

                    <div className="w-full bg-neo-black border-4 border-neo-green h-16 relative mb-8 shadow-[8px_8px_0px_0px_#22c55e]">
                        <div className="h-full bg-neo-green animate-[width_3s_ease-in-out_infinite]" style={{ width: '100%' }}></div>
                        <div className="absolute inset-0 flex items-center justify-center font-bold text-neo-black text-xl">
                            PROCESSING DATA...
                        </div>
                    </div>

                    <div className="space-y-2 text-xl font-bold text-left pl-4 border-l-4 border-neo-green">
                        <p className="animate-fade-in-up delay-100 text-neo-white">&gt; Creating user profile...</p>
                        <p className="animate-fade-in-up delay-300 text-neo-white">&gt; Encrypting passwords...</p>
                        <p className="animate-fade-in-up delay-500 text-neo-white">&gt; Generating CrackScore baseline...</p>
                        <p className="animate-fade-in-up delay-700 text-neo-green">&gt; ACCESS GRANTED_</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex flex-col md:flex-row font-mono overflow-hidden relative">
            {/* Home Button */}
            <Link to="/" className="absolute top-6 right-7 z-50 bg-red-500 border-2 border-neo-black p-2 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] transition-all group">
                <Home className="w-6 h-6 text-neo-black group-hover:text-neo-green transition-colors" />
            </Link>
            {/* LEFT SIDE - BRANDING */}
            <div className="w-full md:w-5/12 bg-neo-black text-neo-white p-8 md:p-12 flex flex-col justify-between relative overflow-hidden">
                <div className="absolute inset-0 opacity-20" style={{
                    backgroundImage: 'radial-gradient(circle, #22c55e 1px, transparent 1px)',
                    backgroundSize: '30px 30px'
                }}></div>

                <div className="z-10">
                    <div className="flex items-center gap-2 mb-8">
                        <div className="w-8 h-8 bg-neo-green border-2 border-neo-white"></div>
                        <span className="font-black text-2xl tracking-tighter">CODIFYME</span>
                    </div>
                    <h1 className="text-5xl md:text-7xl font-black leading-none mb-6">
                        LEVEL UP<br />
                        <span className="text-neo-green">YOUR</span><br />
                        CAREER
                    </h1>
                    <p className="text-xl md:text-2xl font-bold text-gray-400 max-w-md">
                        Join the elite community of developers mastering their craft.
                    </p>
                </div>

                {/* Testimonial / Social Proof */}
                {/* Minimal Terminal Badge */}
                <div className="z-10 mt-12 inline-flex items-center gap-2 px-4 py-2 bg-neo-black border-2 border-neo-green shadow-[4px_4px_0px_0px_rgba(34,197,94,0.5)]">
                    <Terminal className="w-4 h-4 text-neo-green" />
                    <span className="font-mono text-sm font-bold text-neo-white">
                        <span className="text-neo-green mr-2">✨</span>
                        JOB READY IN 90 DAYS<span className="animate-pulse">_</span>
                    </span>
                </div>
            </div>

            {/* RIGHT SIDE - FORM */}
            <div className="w-full md:w-7/12 bg-neo-bg p-8 md:p-12 flex flex-col justify-center relative">
                {/* Grid pattern overlay */}
                <div className="absolute inset-0 opacity-30 pointer-events-none" style={{
                    backgroundImage: 'linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)',
                    backgroundSize: '50px 50px'
                }}></div>

                <div className="max-w-xl mx-auto w-full z-10">
                    {/* Progress Bar */}
                    {/* <div className="mb-12">
                        <div className="flex justify-between mb-2 text-sm font-bold uppercase tracking-wider">
                            <span className={step >= 1 ? "text-neo-black" : "text-gray-400"}>01. Identity</span>
                            <span className={step >= 2 ? "text-neo-black" : "text-gray-400"}>02. Goals</span>
                        </div>
                        <div className="h-4 bg-white border-2 border-neo-black w-full p-0.5">
                            <div
                                className="h-full bg-neo-green transition-all duration-500 ease-out border-r-2 border-neo-black"
                                style={{ width: step === 1 ? '50%' : '100%' }}
                            ></div>
                        </div>
                    </div> */}

                    <div className="bg-white border-4 border-neo-black shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] p-8 md:p-10 relative">
                        {/* Decorative corner */}
                        <div className="absolute -top-3 -right-3 w-8 h-8 bg-neo-green border-2 border-neo-black z-20"></div>

                        <h2 className="text-3xl font-black uppercase mb-2">
                            {step === 1 ? 'Create Account' : 'Set Your Goals'}
                        </h2>
                        <p className="text-gray-600 font-bold mb-8">
                            {step === 1 ? 'Start your journey to tech excellence.' : 'Tell us where you want to go.'}
                        </p>

                        {error && (
                            <div className="mb-6 p-4 bg-red-100 border-l-4 border-red-500 text-red-700 font-bold flex items-center gap-2 animate-shake">
                                <Terminal className="w-5 h-5" />
                                {error}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-6">
                            {step === 1 ? (
                                <div className="space-y-5 animate-fade-in-right">
                                    <div className="group">
                                        <label className="block text-sm font-black uppercase mb-2 group-focus-within:text-neo-green transition-colors">Full Name</label>
                                        <div className="relative">
                                            <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-neo-black" />
                                            <input
                                                type="text"
                                                name="fullName"
                                                value={formData.fullName}
                                                onChange={handleChange}
                                                className="w-full pl-12 pr-4 py-4 border-2 border-neo-black font-bold focus:outline-none focus:ring-4 focus:ring-neo-green/20 focus:border-neo-green transition-all bg-gray-50 focus:bg-white"
                                                placeholder="John Doe"
                                                autoFocus
                                            />
                                        </div>
                                    </div>

                                    <div className="group">
                                        <label className="block text-sm font-black uppercase mb-2 group-focus-within:text-neo-green transition-colors">Email Address</label>
                                        <div className="relative">
                                            <Terminal className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-neo-black" />
                                            <input
                                                type="email"
                                                name="email"
                                                value={formData.email}
                                                onChange={handleChange}
                                                className="w-full pl-12 pr-4 py-4 border-2 border-neo-black font-bold focus:outline-none focus:ring-4 focus:ring-neo-green/20 focus:border-neo-green transition-all bg-gray-50 focus:bg-white"
                                                placeholder="dev@example.com"
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                        <div className="group">
                                            <label className="block text-sm font-black uppercase mb-2 group-focus-within:text-neo-green transition-colors">Password</label>
                                            <div className="relative">
                                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-neo-black" />
                                                <input
                                                    type="password"
                                                    name="password"
                                                    value={formData.password}
                                                    onChange={handleChange}
                                                    className="w-full pl-12 pr-4 py-4 border-2 border-neo-black font-bold focus:outline-none focus:ring-4 focus:ring-neo-green/20 focus:border-neo-green transition-all bg-gray-50 focus:bg-white"
                                                    placeholder="••••••••"
                                                />
                                            </div>
                                        </div>
                                        <div className="group">
                                            <label className="block text-sm font-black uppercase mb-2 group-focus-within:text-neo-green transition-colors">Confirm</label>
                                            <div className="relative">
                                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-neo-black" />
                                                <input
                                                    type="password"
                                                    name="confirmPassword"
                                                    value={formData.confirmPassword}
                                                    onChange={handleChange}
                                                    className="w-full pl-12 pr-4 py-4 border-2 border-neo-black font-bold focus:outline-none focus:ring-4 focus:ring-neo-green/20 focus:border-neo-green transition-all bg-gray-50 focus:bg-white"
                                                    placeholder="••••••••"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="space-y-5 animate-fade-in-right">
                                    <div className="group">
                                        <label className="block text-sm font-black uppercase mb-2 group-focus-within:text-neo-green transition-colors">Target Company</label>
                                        <div className="relative">
                                            <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-neo-black" />
                                            <input
                                                type="text"
                                                name="companyName"
                                                value={formData.companyName}
                                                onChange={handleChange}
                                                className="w-full pl-12 pr-4 py-4 border-2 border-neo-black font-bold focus:outline-none focus:ring-4 focus:ring-neo-green/20 focus:border-neo-green transition-all bg-gray-50 focus:bg-white"
                                                placeholder="e.g. Google, Amazon, Netflix"
                                                autoFocus
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                        <div className="group">
                                            <label className="block text-sm font-black uppercase mb-2 group-focus-within:text-neo-green transition-colors">Target Role</label>
                                            <input
                                                type="text"
                                                name="targetRole"
                                                value={formData.targetRole}
                                                onChange={handleChange}
                                                className="w-full px-4 py-4 border-2 border-neo-black font-bold focus:outline-none focus:ring-4 focus:ring-neo-green/20 focus:border-neo-green transition-all bg-gray-50 focus:bg-white"
                                                placeholder="SDE I, Frontend..."
                                            />
                                        </div>
                                        <div className="group">
                                            <label className="block text-sm font-black uppercase mb-2 group-focus-within:text-neo-green transition-colors">Deadline</label>
                                            <input
                                                type="date"
                                                name="deadline"
                                                value={formData.deadline}
                                                onChange={handleChange}
                                                className="w-full px-4 py-4 border-2 border-neo-black font-bold focus:outline-none focus:ring-4 focus:ring-neo-green/20 focus:border-neo-green transition-all bg-gray-50 focus:bg-white"
                                            />
                                        </div>
                                    </div>

                                    <div className="group">
                                        <label className="block text-sm font-black uppercase mb-2 group-focus-within:text-neo-green transition-colors">Resume (PDF/DOCX)</label>
                                        <div className="relative border-2 border-dashed border-neo-black p-4 bg-gray-50 hover:bg-white transition-colors text-center cursor-pointer group-focus-within:border-neo-green">
                                            <input
                                                type="file"
                                                name="resume"
                                                onChange={handleChange}
                                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                                accept=".pdf,.doc,.docx"
                                            />
                                            <div className="flex flex-col items-center justify-center gap-2">
                                                <Briefcase className="w-8 h-8 text-gray-400 group-hover:text-neo-black transition-colors" />
                                                <span className="font-bold text-sm text-gray-500 group-hover:text-neo-black">
                                                    {formData.resume ? formData.resume.name : "Drop your resume or click to upload"}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="group">
                                        <label className="block text-sm font-black uppercase mb-2 group-focus-within:text-neo-green transition-colors">Job Description</label>
                                        <textarea
                                            name="jobDescription"
                                            value={formData.jobDescription}
                                            onChange={handleChange}
                                            className="w-full px-4 py-4 border-2 border-neo-black font-bold focus:outline-none focus:ring-4 focus:ring-neo-green/20 focus:border-neo-green transition-all bg-gray-50 focus:bg-white resize-none h-24"
                                            placeholder="Paste the job description here..."
                                        />
                                    </div>

                                    <div className="group">
                                        <label className="block text-sm font-black uppercase mb-2">Experience Level</label>
                                        <div className="grid grid-cols-3 gap-3">
                                            {['Beginner', 'Intermediate', 'Pro'].map((level) => (
                                                <button
                                                    key={level}
                                                    type="button"
                                                    onClick={() => setFormData(prev => ({ ...prev, experienceLevel: level.toLowerCase() }))}
                                                    className={`py-3 border-2 border-neo-black font-bold uppercase text-sm transition-all ${formData.experienceLevel === level.toLowerCase()
                                                        ? 'bg-neo-green text-neo-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] translate-x-[-2px] translate-y-[-2px]'
                                                        : 'bg-white hover:bg-gray-50 text-gray-500'
                                                        }`}
                                                >
                                                    {level}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            )}

                            <div className="pt-4 flex gap-4">
                                {step > 1 && (
                                    <button
                                        type="button"
                                        onClick={prevStep}
                                        className="w-1/3 bg-white border-2 border-neo-black py-4 font-black uppercase hover:bg-gray-50 transition-colors"
                                    >
                                        Back
                                    </button>
                                )}
                                <button
                                    type={step === 2 ? "submit" : "button"}
                                    onClick={step === 1 ? nextStep : undefined}
                                    className={`flex-1 bg-neo-black text-neo-white border-2 border-neo-black py-4 font-black text-xl uppercase shadow-[6px_6px_0px_0px_#22c55e] hover:shadow-[3px_3px_0px_0px_#22c55e] hover:translate-x-[3px] hover:translate-y-[3px] transition-all flex items-center justify-center gap-2 group ${step === 1 ? 'w-full' : ''}`}
                                >
                                    {step === 1 ? 'Next Step' : 'Launch Career'}
                                    <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
                                </button>
                            </div>
                        </form>
                    </div>

                    <div className="text-center mt-8">
                        <p className="font-bold text-gray-600">
                            Already have an account?{' '}
                            <a href="/login" className="text-neo-black underline decoration-2 decoration-neo-green hover:bg-neo-green transition-colors">
                                Login here
                            </a>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Onboarding;
