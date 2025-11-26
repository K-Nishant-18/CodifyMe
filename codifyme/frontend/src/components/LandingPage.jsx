import React, { useState, useEffect } from 'react';
import { Compass, Mic, Search, Terminal, ArrowRight, Check, X, Star, Github, Linkedin, Twitter, Zap, Target, TrendingUp, Users, MapPin, Clock, Award, Smartphone } from 'lucide-react';

const LandingPage = ({ onGetStarted }) => {
    // Counter animation for metrics
    const [counters, setCounters] = useState({
        students: 0,
        success: 0,
        companies: 0,
        crackscore: 0
    });

    useEffect(() => {
        const targets = {
            students: 15000,
            success: 94,
            companies: 500,
            crackscore: 845
        };

        const duration = 2000; // 2 seconds
        const steps = 60;
        const interval = duration / steps;

        let currentStep = 0;
        const timer = setInterval(() => {
            currentStep++;
            const progress = currentStep / steps;

            setCounters({
                students: Math.floor(targets.students * progress),
                success: Math.floor(targets.success * progress),
                companies: Math.floor(targets.companies * progress),
                crackscore: Math.floor(targets.crackscore * progress)
            });

            if (currentStep >= steps) {
                setCounters(targets);
                clearInterval(timer);
            }
        }, interval);

        return () => clearInterval(timer);
    }, []);

    return (
        <div className="min-h-screen bg-neo-white text-neo-black font-sans selection:bg-neo-green selection:text-neo-black overflow-x-hidden">

            {/* Navbar */}
            <nav className="sticky top-0 z-50 bg-neo-white border-b-4 border-neo-black px-6 py-4 flex justify-between items-center">
                <div className="text-2xl font-mono font-bold tracking-tighter">
                    CODIFYME [&gt;_]
                </div>

                <div className="hidden md:flex gap-8 font-bold text-sm tracking-widest">
                    <a href="#features" className="hover:underline decoration-4 underline-offset-4 decoration-neo-green">FEATURES</a>
                    <a href="#pricing" className="hover:underline decoration-4 underline-offset-4 decoration-neo-green">PRICING</a>
                    <a href="#team" className="hover:underline decoration-4 underline-offset-4 decoration-neo-green">TEAM</a>
                </div>

                <div className="flex gap-4">
                    <button className="hidden md:block px-6 py-2 font-bold border-2 border-neo-black hover:translate-y-1 hover:shadow-none shadow-neo-sm transition-all bg-white">
                        LOGIN
                    </button>
                    <button
                        onClick={onGetStarted}
                        className="px-6 py-2 font-bold border-2 border-neo-black bg-neo-green hover:translate-y-1 hover:shadow-none shadow-neo-sm transition-all"
                    >
                        GET STARTED_
                    </button>
                </div>
            </nav>

            {/* Hero Section */}
            <header className="grid grid-cols-1 lg:grid-cols-2 border-b-4 border-neo-black">
                <div className="p-8 md:p-16 flex flex-col justify-center border-b-4 lg:border-b-0 lg:border-r-4 border-neo-black">
                    <h1 className="font-display text-6xl md:text-8xl leading-none mb-6 uppercase">
                        Engineer <br />
                        Your Future. <br />
                        <span className="bg-neo-green px-2">Brutally Fast.</span>
                    </h1>
                    <p className="font-mono text-lg md:text-xl mb-10 max-w-xl">
                        STOP GUESSING. START CODING. AI-POWERED PREP.
                    </p>
                    <div>
                        <button
                            onClick={onGetStarted}
                            className="w-full md:w-auto px-8 py-4 bg-neo-green border-4 border-neo-black font-black text-xl shadow-neo hover:shadow-none hover:translate-x-2 hover:translate-y-2 transition-all flex items-center justify-center gap-2"
                        >
                            [ GENERATE MY ROADMAP <ArrowRight className="w-6 h-6" /> ]
                        </button>
                    </div>
                </div>

                <div className="bg-neo-black p-8 md:p-16 flex items-center justify-center relative overflow-hidden">
                    {/* Decorative grid background */}
                    <div className="absolute inset-0 opacity-20"
                        style={{ backgroundImage: 'linear-gradient(#39FF14 1px, transparent 1px), linear-gradient(90deg, #39FF14 1px, transparent 1px)', backgroundSize: '40px 40px' }}>
                    </div>

                    <div className="relative w-full max-w-md bg-neo-black border-4 border-neo-green p-4 shadow-[8px_8px_0px_0px_#39FF14]">
                        <div className="flex justify-between items-center mb-4 border-b-2 border-neo-green pb-2">
                            <span className="text-neo-green font-mono text-sm">terminal_v1.0</span>
                            <div className="flex gap-2">
                                <div className="w-3 h-3 bg-neo-green rounded-none"></div>
                                <div className="w-3 h-3 bg-neo-green rounded-none"></div>
                            </div>
                        </div>
                        <div className="font-mono text-neo-green text-sm space-y-2">
                            <p>&gt; initializing_brain...</p>
                            <p>&gt; scanning_job_market...</p>
                            <p>&gt; target: GOOGLE_L4</p>
                            <p>&gt; generating_roadmap... [100%]</p>
                            <p className="animate-pulse">&gt; READY_TO_DEPLOY_</p>
                            <div className="mt-4 p-2 border border-neo-green bg-neo-green/10">
                                <p className="font-bold">STATUS: PASS</p>
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            {/* Marquee Strip */}
            <div className="bg-neo-black py-4 border-b-4 border-neo-black overflow-hidden whitespace-nowrap">
                <div className="inline-block animate-marquee">
                    <span className="font-mono text-neo-green text-xl font-bold mx-4">
                        +++ RECENT PLACEMENTS: GOOGLE [L4] +++ AMAZON [SDE-II] +++ MICROSOFT +++ CRACKSCORE AVG: 850 +++ RECENT PLACEMENTS: GOOGLE [L4] +++ AMAZON [SDE-II] +++ MICROSOFT +++ CRACKSCORE AVG: 850 +++
                    </span>
                </div>
            </div>

            {/* Features Section */}
            <section id="features" className="py-20 px-4 bg-neo-white border-b-4 border-neo-black overflow-hidden">
                <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8">

                    {/* Card 1 */}
                    <div className="bg-white border-4 border-neo-black p-6 shadow-neo transform -rotate-2 hover:rotate-0 transition-transform duration-300">
                        <div className="bg-neo-green w-12 h-12 flex items-center justify-center border-2 border-neo-black mb-4">
                            <Compass className="w-8 h-8" />
                        </div>
                        <h3 className="font-display text-2xl mb-2 uppercase">AI Roadmap</h3>
                        <p className="font-mono text-sm leading-relaxed">
                            Navigate your career with precision. Custom paths generated instantly.
                        </p>
                    </div>

                    {/* Card 2 */}
                    <div className="bg-white border-4 border-neo-black p-6 shadow-neo transform rotate-1 hover:rotate-0 transition-transform duration-300 z-10">
                        <div className="bg-neo-green w-12 h-12 flex items-center justify-center border-2 border-neo-black mb-4">
                            <Mic className="w-8 h-8" />
                        </div>
                        <h3 className="font-display text-2xl mb-2 uppercase">Interview Simulator</h3>
                        <p className="font-mono text-sm leading-relaxed">
                            Speak to the AI. Get roasted. Get better. Real-time feedback loop.
                        </p>
                    </div>

                    {/* Card 3 */}
                    <div className="bg-white border-4 border-neo-black p-6 shadow-neo transform -rotate-1 hover:rotate-0 transition-transform duration-300">
                        <div className="bg-neo-green w-12 h-12 flex items-center justify-center border-2 border-neo-black mb-4">
                            <Search className="w-8 h-8" />
                        </div>
                        <h3 className="font-display text-2xl mb-2 uppercase">Company Intel</h3>
                        <p className="font-mono text-sm leading-relaxed">
                            Deep dive into company patterns. Know the enemy before you fight.
                        </p>
                    </div>

                </div>
            </section>

            {/* How It Works Section - NEW */}
            <section className="py-20 px-4 bg-neo-white border-b-4 border-neo-black">
                <div className="max-w-7xl mx-auto">
                    <h2 className="font-display text-4xl md:text-6xl mb-16 uppercase text-center">
                        HOW IT <span className="bg-neo-green px-2">WORKS</span>
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {/* Step 1 */}
                        <div className="relative">
                            <div className="bg-white border-4 border-neo-black p-8 shadow-neo hover:shadow-neo-lg hover:-rotate-2 transition-all">
                                <div className="font-display text-7xl text-neo-green mb-4">01</div>
                                <div className="bg-yellow-300 w-16 h-16 flex items-center justify-center border-4 border-neo-black mb-4">
                                    <MapPin className="w-10 h-10" />
                                </div>
                                <h3 className="font-bold text-xl mb-2 uppercase">Paste Job Description</h3>
                                <p className="font-mono text-sm">Copy any job posting and let our AI analyze it</p>
                            </div>
                            <div className="hidden lg:block absolute -right-4 top-1/2 transform -translate-y-1/2 z-10">
                                <ArrowRight className="w-8 h-8 text-neo-green" />
                            </div>
                        </div>

                        {/* Step 2 */}
                        <div className="relative">
                            <div className="bg-white border-4 border-neo-black p-8 shadow-neo hover:shadow-neo-lg hover:rotate-2 transition-all">
                                <div className="font-display text-7xl text-neo-green mb-4">02</div>
                                <div className="bg-cyan-300 w-16 h-16 flex items-center justify-center border-4 border-neo-black mb-4">
                                    <Compass className="w-10 h-10" />
                                </div>
                                <h3 className="font-bold text-xl mb-2 uppercase">Get AI Roadmap</h3>
                                <p className="font-mono text-sm">Personalized learning path generated in seconds with AI</p>
                            </div>
                            <div className="hidden lg:block absolute -right-4 top-1/2 transform -translate-y-1/2 z-10">
                                <ArrowRight className="w-8 h-8 text-neo-green" />
                            </div>
                        </div>

                        {/* Step 3 */}
                        <div className="relative">
                            <div className="bg-white border-4 border-neo-black p-8 shadow-neo hover:shadow-neo-lg hover:-rotate-2 transition-all">
                                <div className="font-display text-7xl text-neo-green mb-4">03</div>
                                <div className="bg-pink-300 w-16 h-16 flex items-center justify-center border-4 border-neo-black mb-4">
                                    <Mic className="w-10 h-10" />
                                </div>
                                <h3 className="font-bold text-xl mb-2 uppercase">Practice Interviews</h3>
                                <p className="font-mono text-sm">AI mock interviews with real-time feedback</p>
                            </div>
                            <div className="hidden lg:block absolute -right-4 top-1/2 transform -translate-y-1/2 z-10">
                                <ArrowRight className="w-8 h-8 text-neo-green" />
                            </div>
                        </div>

                        {/* Step 4 */}
                        <div className="bg-white border-4 border-neo-black p-8 shadow-neo hover:shadow-neo-lg hover:rotate-2 transition-all">
                            <div className="font-display text-7xl text-neo-green mb-4">04</div>
                            <div className="bg-neo-green w-16 h-16 flex items-center justify-center border-4 border-neo-black mb-4">
                                <Award className="w-10 h-10" />
                            </div>
                            <h3 className="font-bold text-xl mb-2 uppercase">Land Dream Job</h3>
                            <p className="font-mono text-sm">Track CrackScore & crush interviews</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Key Metrics Section - NEW */}
            <section className="py-20 px-4 bg-white border-b-4 border-neo-black">
                <div className="max-w-7xl mx-auto">
                    <h2 className="font-display text-4xl md:text-6xl mb-12 uppercase text-center">
                        PROVEN <span className="bg-neo-green px-2">RESULTS</span>
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {/* Metric 1 */}
                        <div className="bg-yellow-300 border-4 border-neo-black p-6 shadow-neo transform hover:-translate-y-2 transition-all">
                            <div className="flex items-center gap-2 mb-2">
                                <Users className="w-6 h-6" />
                                <span className="font-mono text-sm uppercase">Students</span>
                            </div>
                            <div className="font-display text-5xl mb-2">{counters.students.toLocaleString()}+</div>
                            <p className="font-mono text-sm">Successfully Placed</p>
                        </div>

                        {/* Metric 2 */}
                        <div className="bg-cyan-300 border-4 border-neo-black p-6 shadow-neo transform hover:-translate-y-2 transition-all">
                            <div className="flex items-center gap-2 mb-2">
                                <TrendingUp className="w-6 h-6" />
                                <span className="font-mono text-sm uppercase">Success Rate</span>
                            </div>
                            <div className="font-display text-5xl mb-2">{counters.success}%</div>
                            <p className="font-mono text-sm">Interview Success</p>
                        </div>

                        {/* Metric 3 */}
                        <div className="bg-pink-300 border-4 border-neo-black p-6 shadow-neo transform hover:-translate-y-2 transition-all">
                            <div className="flex items-center gap-2 mb-2">
                                <Target className="w-6 h-6" />
                                <span className="font-mono text-sm uppercase">Companies</span>
                            </div>
                            <div className="font-display text-5xl mb-2">{counters.companies}+</div>
                            <p className="font-mono text-sm">Intel Database</p>
                        </div>

                        {/* Metric 4 */}
                        <div className="bg-neo-green border-4 border-neo-black p-6 shadow-neo transform hover:-translate-y-2 transition-all">
                            <div className="flex items-center gap-2 mb-2">
                                <Zap className="w-6 h-6" />
                                <span className="font-mono text-sm uppercase">Avg Score</span>
                            </div>
                            <div className="font-display text-5xl mb-2">{counters.crackscore}</div>
                            <p className="font-mono text-sm">CrackScore Average</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Feature Comparison Table - NEW */}
            <section className="py-20 px-4 bg-white border-b-4 border-neo-black">
                <div className="max-w-5xl mx-auto">
                    <h2 className="font-display text-4xl md:text-6xl mb-12 uppercase text-center">
                        WHY <span className="bg-neo-green px-2">CODIFYME?</span>
                    </h2>

                    <div className="overflow-x-auto">
                        <table className="w-full border-4 border-neo-black">
                            <thead>
                                <tr className="bg-neo-black text-neo-white">
                                    <th className="p-4 text-left font-mono border-r-4 border-neo-green">FEATURE</th>
                                    <th className="p-4 text-center font-mono border-r-4 border-neo-green">TRADITIONAL PREP</th>
                                    <th className="p-4 text-center font-mono bg-neo-green text-neo-black">CODIFYME</th>
                                </tr>
                            </thead>
                            <tbody className="font-mono text-sm">
                                <tr className="border-b-4 border-neo-black bg-white">
                                    <td className="p-4 font-bold border-r-4 border-neo-black">Personalized Roadmap</td>
                                    <td className="p-4 text-center border-r-4 border-neo-black">
                                        <X className="w-6 h-6 mx-auto text-red-500" />
                                    </td>
                                    <td className="p-4 text-center bg-neo-green/20">
                                        <Check className="w-6 h-6 mx-auto text-green-600 font-bold" />
                                    </td>
                                </tr>
                                <tr className="border-b-4 border-neo-black bg-gray-50">
                                    <td className="p-4 font-bold border-r-4 border-neo-black">AI Mock Interviews</td>
                                    <td className="p-4 text-center border-r-4 border-neo-black">
                                        <span className="text-gray-500">Limited</span>
                                    </td>
                                    <td className="p-4 text-center bg-neo-green/20">
                                        <Check className="w-6 h-6 mx-auto text-green-600 font-bold" />
                                    </td>
                                </tr>
                                <tr className="border-b-4 border-neo-black bg-white">
                                    <td className="p-4 font-bold border-r-4 border-neo-black">Company Intelligence</td>
                                    <td className="p-4 text-center border-r-4 border-neo-black">
                                        <span className="text-gray-500">Hours of Research</span>
                                    </td>
                                    <td className="p-4 text-center bg-neo-green/20">
                                        <Check className="w-6 h-6 mx-auto text-green-600 font-bold" />
                                    </td>
                                </tr>
                                <tr className="border-b-4 border-neo-black bg-gray-50">
                                    <td className="p-4 font-bold border-r-4 border-neo-black">Real-time Feedback</td>
                                    <td className="p-4 text-center border-r-4 border-neo-black">
                                        <X className="w-6 h-6 mx-auto text-red-500" />
                                    </td>
                                    <td className="p-4 text-center bg-neo-green/20">
                                        <Check className="w-6 h-6 mx-auto text-green-600 font-bold" />
                                    </td>
                                </tr>
                                <tr className="bg-white">
                                    <td className="p-4 font-bold border-r-4 border-neo-black">CrackScore Tracking</td>
                                    <td className="p-4 text-center border-r-4 border-neo-black">
                                        <X className="w-6 h-6 mx-auto text-red-500" />
                                    </td>
                                    <td className="p-4 text-center bg-neo-green/20">
                                        <Check className="w-6 h-6 mx-auto text-green-600 font-bold" />
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </section>

            {/* Testimonials Section - NEW */}
            <section className="py-20 px-4 bg-neo-white border-b-4 border-neo-black overflow-hidden">
                <div className="max-w-7xl mx-auto">
                    <h2 className="font-display text-4xl md:text-6xl mb-16 uppercase text-center">
                        SUCCESS <span className="bg-neo-green px-2">STORIES</span>
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {/* Testimonial 1 */}
                        <div className="bg-yellow-300 border-4 border-neo-black p-6 shadow-neo transform -rotate-2 hover:rotate-0 hover:-translate-y-2 transition-all">
                            <div className="flex gap-1 mb-4">
                                {[1, 2, 3, 4, 5].map(i => <Star key={i} className="w-5 h-5 fill-neo-black" />)}
                            </div>
                            <p className="font-mono text-sm mb-6 leading-relaxed">
                                "Got placed at Google L4 in just 60 days! The AI roadmap was brutally accurate. CrackScore went from 300 to 890!"
                            </p>
                            <div className="flex items-center gap-4 pt-4 border-t-2 border-neo-black">
                                <div className="w-12 h-12 bg-neo-black rounded-full border-2 border-neo-black"></div>
                                <div>
                                    <p className="font-bold">Raj Sharma</p>
                                    <p className="text-sm font-mono">SDE @ Google</p>
                                </div>
                            </div>
                        </div>

                        {/* Testimonial 2 */}
                        <div className="bg-cyan-300 border-4 border-neo-black p-6 shadow-neo transform rotate-0 hover:-translate-y-2 transition-all">
                            <div className="flex gap-1 mb-4">
                                {[1, 2, 3, 4, 5].map(i => <Star key={i} className="w-5 h-5 fill-neo-black" />)}
                            </div>
                            <p className="font-mono text-sm mb-6 leading-relaxed">
                                "The interview simulator is a game-changer. Practiced 50+ mocks and cracked Amazon SDE-II on first attempt!"
                            </p>
                            <div className="flex items-center gap-4 pt-4 border-t-2 border-neo-black">
                                <div className="w-12 h-12 bg-neo-black rounded-full border-2 border-neo-black"></div>
                                <div>
                                    <p className="font-bold">Priya Patel</p>
                                    <p className="text-sm font-mono">SDE-II @ Amazon</p>
                                </div>
                            </div>
                        </div>

                        {/* Testimonial 3 */}
                        <div className="bg-pink-300 border-4 border-neo-black p-6 shadow-neo transform rotate-2 hover:rotate-0 hover:-translate-y-2 transition-all">
                            <div className="flex gap-1 mb-4">
                                {[1, 2, 3, 4, 5].map(i => <Star key={i} className="w-5 h-5 fill-neo-black" />)}
                            </div>
                            <p className="font-mono text-sm mb-6 leading-relaxed">
                                "Company intel feature saved me hours of research. Knew exactly what to expect in Microsoft interviews!"
                            </p>
                            <div className="flex items-center gap-4 pt-4 border-t-2 border-neo-black">
                                <div className="w-12 h-12 bg-neo-black rounded-full border-2 border-neo-black"></div>
                                <div>
                                    <p className="font-bold">Arjun Mehta</p>
                                    <p className="text-sm font-mono">SDE @ Microsoft</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Our Team Section - NEW */}
            <section id="team" className="py-20 px-4 bg-white border-b-4 border-neo-black">
                <div className="max-w-7xl mx-auto">
                    <h2 className="font-display text-4xl md:text-6xl mb-16 uppercase text-center">
                        MEET THE <span className="bg-neo-green px-2">TEAM</span>
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {/* Team Member 1 */}
                        <div className="bg-white border-4 border-neo-black p-6 shadow-neo hover:rotate-3 hover:-translate-y-2 transition-all">
                            <div className="w-full h-64 bg-neo-black border-4 border-neo-black mb-4 overflow-hidden">
                                <img src="/api/placeholder/300/400" alt="Team member" className="w-full h-full object-cover grayscale" />
                            </div>
                            <h3 className="font-bold text-xl mb-1">Aarav Kumar</h3>
                            <p className="font-mono text-sm mb-3 uppercase text-gray-700">Founder & CEO</p>
                            <p className="font-mono text-xs mb-4">Ex-Google SWE • IIT Delhi</p>
                            <div className="flex gap-3">
                                <a href="#" className="hover:scale-110 transition-transform">
                                    <Linkedin className="w-5 h-5" />
                                </a>
                                <a href="#" className="hover:scale-110 transition-transform">
                                    <Github className="w-5 h-5" />
                                </a>
                                <a href="#" className="hover:scale-110 transition-transform">
                                    <Twitter className="w-5 h-5" />
                                </a>
                            </div>
                        </div>

                        {/* Team Member 2 */}
                        <div className="bg-white border-4 border-neo-black p-6 shadow-neo hover:-rotate-3 hover:-translate-y-2 transition-all">
                            <div className="w-full h-64 bg-neo-black border-4 border-neo-black mb-4 overflow-hidden">
                                <img src="/api/placeholder/300/400" alt="Team member" className="w-full h-full object-cover grayscale" />
                            </div>
                            <h3 className="font-bold text-xl mb-1">Ishita Singh</h3>
                            <p className="font-mono text-sm mb-3 uppercase text-gray-700">CTO & Co-Founder</p>
                            <p className="font-mono text-xs mb-4">Ex-Microsoft • ML Expert</p>
                            <div className="flex gap-3">
                                <a href="#" className="hover:scale-110 transition-transform">
                                    <Linkedin className="w-5 h-5" />
                                </a>
                                <a href="#" className="hover:scale-110 transition-transform">
                                    <Github className="w-5 h-5" />
                                </a>
                                <a href="#" className="hover:scale-110 transition-transform">
                                    <Twitter className="w-5 h-5" />
                                </a>
                            </div>
                        </div>

                        {/* Team Member 3 */}
                        <div className="bg-white border-4 border-neo-black p-6 shadow-neo hover:rotate-3 hover:-translate-y-2 transition-all">
                            <div className="w-full h-64 bg-neo-black border-4 border-neo-black mb-4 overflow-hidden">
                                <img src="/api/placeholder/300/400" alt="Team member" className="w-full h-full object-cover grayscale" />
                            </div>
                            <h3 className="font-bold text-xl mb-1">Rohan Verma</h3>
                            <p className="font-mono text-sm mb-3 uppercase text-gray-700">Head of Product</p>
                            <p className="font-mono text-xs mb-4">Ex-Amazon • IIT Bombay</p>
                            <div className="flex gap-3">
                                <a href="#" className="hover:scale-110 transition-transform">
                                    <Linkedin className="w-5 h-5" />
                                </a>
                                <a href="#" className="hover:scale-110 transition-transform">
                                    <Github className="w-5 h-5" />
                                </a>
                                <a href="#" className="hover:scale-110 transition-transform">
                                    <Twitter className="w-5 h-5" />
                                </a>
                            </div>
                        </div>

                        {/* Team Member 4 */}
                        <div className="bg-white border-4 border-neo-black p-6 shadow-neo hover:-rotate-3 hover:-translate-y-2 transition-all">
                            <div className="w-full h-64 bg-neo-black border-4 border-neo-black mb-4 overflow-hidden">
                                <img src="/api/placeholder/300/400" alt="Team member" className="w-full h-full object-cover grayscale" />
                            </div>
                            <h3 className="font-bold text-xl mb-1">Kavya Reddy</h3>
                            <p className="font-mono text-sm mb-3 uppercase text-gray-700">Lead Designer</p>
                            <p className="font-mono text-xs mb-4">Ex-Meta • Design Systems</p>
                            <div className="flex gap-3">
                                <a href="#" className="hover:scale-110 transition-transform">
                                    <Linkedin className="w-5 h-5" />
                                </a>
                                <a href="#" className="hover:scale-110 transition-transform">
                                    <Github className="w-5 h-5" />
                                </a>
                                <a href="#" className="hover:scale-110 transition-transform">
                                    <Twitter className="w-5 h-5" />
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* CrackScore Section */}
            <section className="bg-neo-black text-neo-white py-20 px-4 border-b-4 border-neo-black">
                <div className="max-w-4xl mx-auto text-center">
                    <h2 className="font-display text-4xl md:text-6xl mb-12 uppercase">
                        Measure Your <span className="text-neo-green">Lethality</span>
                    </h2>

                    <div className="relative inline-block">
                        <div className="text-6xl md:text-7xl font-mono font-black text-neo-green tracking-widest mb-4">
                            [845/1000]
                        </div>
                        <div className="h-8 w-full border-4 border-neo-white p-1">
                            <div className="h-full bg-neo-green w-[85%] relative overflow-hidden">
                                <div className="absolute inset-0" style={{ backgroundImage: 'linear-gradient(45deg, rgba(0,0,0,0.1) 25%, transparent 25%, transparent 50%, rgba(0,0,0,0.1) 50%, rgba(0,0,0,0.1) 75%, transparent 75%, transparent)', backgroundSize: '20px 20px' }}></div>
                            </div>
                        </div>
                        <p className="font-mono mt-4 text-sm md:text-base">
                            &gt; YOUR CRACKSCORE IS IN THE TOP 5%
                        </p>
                    </div>
                </div>
            </section>

            {/* Pricing Section - NEW */}
            <section id="pricing" className="py-20 px-4 bg-white border-b-4 border-neo-black">
                <div className="max-w-7xl mx-auto">
                    <h2 className="font-display text-4xl md:text-6xl mb-16 uppercase text-center">
                        BRUTAL <span className="bg-neo-green px-2">PRICING</span>
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
                        {/* Free Tier */}
                        <div className="bg-white border-4 border-neo-black p-8 shadow-neo hover:-translate-y-2 transition-all">
                            <div className="text-center mb-6">
                                <h3 className="font-display text-3xl mb-2">FREE</h3>
                                <div className="font-mono text-5xl font-bold mb-2">$0</div>
                                <p className="font-mono text-sm text-gray-600">forever</p>
                            </div>
                            <ul className="space-y-4 mb-8 font-mono text-sm">
                                <li className="flex items-start gap-2">
                                    <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                                    <span>1 AI Roadmap/month</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                                    <span>5 Interview Simulations</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                                    <span>Basic Company Intel</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                                    <span>CrackScore Tracking</span>
                                </li>
                            </ul>
                            <button
                                onClick={onGetStarted}
                                className="w-full py-3 bg-white border-4 border-neo-black font-bold hover:bg-gray-100 transition-colors"
                            >
                                [ START FREE ]
                            </button>
                        </div>

                        {/* Pro Tier - Featured */}
                        <div className="bg-neo-green border-4 border-neo-black p-8 shadow-neo-lg transform md:scale-110 hover:-translate-y-2 transition-all relative">
                            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-yellow-300 border-2 border-neo-black px-4 py-1 font-bold text-sm rotate-3">
                                MOST POPULAR
                            </div>
                            <div className="text-center mb-6">
                                <h3 className="font-display text-3xl mb-2">PRO</h3>
                                <div className="font-mono text-5xl font-bold mb-2">$29</div>
                                <p className="font-mono text-sm text-gray-700">/month</p>
                            </div>
                            <ul className="space-y-4 mb-8 font-mono text-sm">
                                <li className="flex items-start gap-2">
                                    <Check className="w-5 h-5 text-neo-black flex-shrink-0 mt-0.5 font-bold" />
                                    <span><strong>Unlimited</strong> AI Roadmaps</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <Check className="w-5 h-5 text-neo-black flex-shrink-0 mt-0.5 font-bold" />
                                    <span><strong>Unlimited</strong> Interviews</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <Check className="w-5 h-5 text-neo-black flex-shrink-0 mt-0.5 font-bold" />
                                    <span>Advanced Company Intel</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <Check className="w-5 h-5 text-neo-black flex-shrink-0 mt-0.5 font-bold" />
                                    <span>Personalized Mentorship</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <Check className="w-5 h-5 text-neo-black flex-shrink-0 mt-0.5 font-bold" />
                                    <span>Priority Support</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <Check className="w-5 h-5 text-neo-black flex-shrink-0 mt-0.5 font-bold" />
                                    <span>Resume Review</span>
                                </li>
                            </ul>
                            <button
                                onClick={onGetStarted}
                                className="w-full py-3 bg-neo-black text-neo-white border-4 border-neo-black font-bold hover:bg-gray-900 transition-colors"
                            >
                                [ GO PRO ]
                            </button>
                        </div>

                        {/* Enterprise Tier */}
                        <div className="bg-white border-4 border-neo-black p-8 shadow-neo hover:-translate-y-2 transition-all">
                            <div className="text-center mb-6">
                                <h3 className="font-display text-3xl mb-2">ENTERPRISE</h3>
                                <div className="font-mono text-3xl font-bold mb-2">CUSTOM</div>
                                <p className="font-mono text-sm text-gray-600">for colleges</p>
                            </div>
                            <ul className="space-y-4 mb-8 font-mono text-sm">
                                <li className="flex items-start gap-2">
                                    <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                                    <span>Bulk Student Licenses</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                                    <span>Custom Branding</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                                    <span>Analytics Dashboard</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                                    <span>Dedicated Support</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                                    <span>API Access</span>
                                </li>
                            </ul>
                            <button className="w-full py-3 bg-white border-4 border-neo-black font-bold hover:bg-gray-100 transition-colors">
                                [ CONTACT US ]
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            {/* Mobile App Teaser - NEW */}
            <section className="py-20 px-4 bg-neo-black text-neo-white border-b-4 border-neo-black">
                <div className="max-w-7xl mx-auto">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                        {/* Left - Content */}
                        <div>
                            <div className="inline-block bg-neo-green text-neo-black px-4 py-2 font-bold text-sm border-2 border-neo-green mb-6 rotate-3">
                                COMING SOON
                            </div>
                            <h2 className="font-display text-4xl md:text-6xl mb-6 uppercase">
                                PRACTICE <span className="text-neo-green">ON THE GO</span>
                            </h2>
                            <p className="font-mono text-lg mb-8 text-gray-300">
                                Take your prep everywhere. Mobile apps launching soon for iOS and Android.
                            </p>

                            <ul className="space-y-4 mb-8 font-mono">
                                <li className="flex items-start gap-3">
                                    <Smartphone className="w-6 h-6 text-neo-green flex-shrink-0 mt-1" />
                                    <span>Practice interviews while commuting</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <Zap className="w-6 h-6 text-neo-green flex-shrink-0 mt-1" />
                                    <span>Quick daily challenges & streaks</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <Clock className="w-6 h-6 text-neo-green flex-shrink-0 mt-1" />
                                    <span>Push notifications for task reminders</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <Target className="w-6 h-6 text-neo-green flex-shrink-0 mt-1" />
                                    <span>Offline mode for uninterrupted prep</span>
                                </li>
                            </ul>

                            <div className="flex flex-col sm:flex-row gap-4">
                                <div className="bg-gray-700 border-4 border-gray-600 px-6 py-3 font-bold text-center opacity-50 cursor-not-allowed">
                                    <div className="flex items-center justify-center gap-2">
                                        <div className="w-6 h-6 bg-white rounded"></div>
                                        <span>App Store</span>
                                    </div>
                                </div>
                                <div className="bg-gray-700 border-4 border-gray-600 px-6 py-3 font-bold text-center opacity-50 cursor-not-allowed">
                                    <div className="flex items-center justify-center gap-2">
                                        <div className="w-6 h-6 bg-white rounded"></div>
                                        <span>Play Store</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Right - Phone Mockup */}
                        <div className="relative">
                            <div className="relative mx-auto w-64 h-[500px] bg-neo-black border-8 border-neo-green rounded-3xl p-4 shadow-[12px_12px_0px_0px_#39FF14] transform rotate-6 hover:rotate-0 transition-all">
                                <div className="w-full h-full bg-neo-green/20 border-2 border-neo-green rounded-2xl flex items-center justify-center">
                                    <div className="text-center">
                                        <Terminal className="w-16 h-16 text-neo-green mx-auto mb-4" />
                                        <p className="font-mono text-neo-green">MOBILE APP</p>
                                        <p className="font-mono text-xs text-neo-green mt-2">PREVIEW</p>
                                    </div>
                                </div>
                            </div>
                            {/* Floating elements */}
                            <div className="absolute -top-4 -right-4 bg-yellow-300 border-4 border-neo-black px-4 py-2 font-bold text-sm rotate-12 shadow-neo animate-bounce">
                                iOS
                            </div>
                            <div className="absolute -bottom-4 -left-4 bg-cyan-300 border-4 border-neo-black px-4 py-2 font-bold text-sm -rotate-12 shadow-neo animate-bounce" style={{ animationDelay: '0.5s' }}>
                                Android
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-neo-white py-12 px-6">
                <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
                    <div className="col-span-1 md:col-span-2">
                        <div className="text-3xl font-mono font-bold mb-4">CODIFYME [&gt;_]</div>
                        <p className="font-mono text-sm max-w-xs">
                            Brutally effective placement prep for the modern engineer.
                        </p>
                    </div>

                    <div>
                        <h4 className="font-bold mb-4 uppercase border-b-2 border-neo-black inline-block">Links</h4>
                        <ul className="space-y-2 font-mono text-sm">
                            <li><a href="#" className="hover:bg-neo-green">About</a></li>
                            <li><a href="#" className="hover:bg-neo-green">Careers</a></li>
                            <li><a href="#" className="hover:bg-neo-green">Privacy</a></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-bold mb-4 uppercase border-b-2 border-neo-black inline-block">Newsletter</h4>
                        <div className="flex flex-col gap-2">
                            <input
                                type="email"
                                placeholder="EMAIL ADDR"
                                className="border-4 border-neo-black p-2 font-mono focus:outline-none focus:ring-4 ring-neo-green/50"
                            />
                            <button className="bg-neo-black text-neo-white font-bold py-2 border-4 border-neo-black hover:bg-neo-green hover:text-neo-black transition-colors">
                                [ SUBMIT ]
                            </button>
                        </div>
                    </div>
                </div>
                <div className="mt-12 pt-8 border-t-4 border-neo-black text-center font-mono text-xs">
                    © 2025 CODIFYME. ALL RIGHTS RESERVED.
                </div>
            </footer>

            <style>{`
                @keyframes marquee {
                    0% { transform: translateX(0); }
                    100% { transform: translateX(-50%); }
                }
                .animate-marquee {
                    animation: marquee 20s linear infinite;
                }
            `}</style>
        </div>
    );
};

export default LandingPage;
