import React from 'react';
import { Compass, Mic, Search, Terminal, ArrowRight } from 'lucide-react';

const LandingPage = ({ onGetStarted }) => {
    return (
        <div className="min-h-screen bg-neo-white text-neo-black font-sans selection:bg-neo-green selection:text-neo-black overflow-x-hidden">

            {/* Navbar */}
            <nav className="sticky top-0 z-50 bg-neo-white border-b-4 border-neo-black px-6 py-4 flex justify-between items-center">
                <div className="text-2xl font-mono font-bold tracking-tighter">
                    CODIFYME [&gt;_]
                </div>

                <div className="hidden md:flex gap-8 font-bold text-sm tracking-widest">
                    <a href="#" className="hover:underline decoration-4 underline-offset-4 decoration-neo-green">FEATURES</a>
                    <a href="#" className="hover:underline decoration-4 underline-offset-4 decoration-neo-green">COMPANY INTEL</a>
                    <a href="#" className="hover:underline decoration-4 underline-offset-4 decoration-neo-green">PRICING</a>
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
            <section className="py-20 px-4 bg-neo-white border-b-4 border-neo-black overflow-hidden">
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
