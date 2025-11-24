import React from 'react';

const LandingPage = ({ onGetStarted }) => {
    return (
        <div className="min-h-screen bg-neo-bg flex flex-col font-mono">
            {/* Navbar */}
            <nav className="border-b-4 border-black p-6 flex justify-between items-center bg-white sticky top-0 z-50">
                <div className="text-3xl font-black uppercase tracking-tighter">CodifyMe</div>
                <button
                    onClick={onGetStarted}
                    className="neo-btn bg-neo-main text-lg px-8 py-2 hover:bg-neo-accent hover:text-white transition-colors"
                >
                    Get Started
                </button>
            </nav>

            {/* Hero Section */}
            <header className="flex-1 flex flex-col items-center justify-center text-center p-8 relative overflow-hidden">
                <div className="absolute top-10 left-10 w-32 h-32 bg-yellow-300 rounded-full border-4 border-black -z-10 animate-bounce"></div>
                <div className="absolute bottom-20 right-20 w-48 h-48 bg-blue-300 border-4 border-black -z-10 rotate-12"></div>

                <h1 className="text-6xl md:text-8xl font-black uppercase tracking-tighter mb-6 leading-none">
                    Crack Your <br />
                    <span className="text-neo-accent bg-black px-4 transform -skew-x-6 inline-block">Dream Job</span>
                </h1>
                <p className="text-xl md:text-2xl font-bold max-w-2xl mb-12 border-2 border-black bg-white p-4 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
                    Your AI-Powered Personal Mentor. Turn generic Job Descriptions into a deadline-driven, personalized battle plan.
                </p>
                <button
                    onClick={onGetStarted}
                    className="neo-btn bg-green-400 text-2xl px-12 py-6 hover:scale-105 transform transition-transform"
                >
                    Start Your Prep Now 🚀
                </button>
            </header>

            {/* Features Section */}
            <section className="grid grid-cols-1 md:grid-cols-3 gap-0 border-t-4 border-black">
                <div className="border-b-4 md:border-b-0 md:border-r-4 border-black p-12 bg-white hover:bg-yellow-100 transition-colors">
                    <h3 className="text-3xl font-black mb-4">🎯 Tailored Roadmaps</h3>
                    <p className="text-lg font-medium">Upload a JD and get a day-by-day plan customized to your deadline and skill level.</p>
                </div>
                <div className="border-b-4 md:border-b-0 md:border-r-4 border-black p-12 bg-white hover:bg-pink-100 transition-colors">
                    <h3 className="text-3xl font-black mb-4">🤖 AI Mock Interviews</h3>
                    <p className="text-lg font-medium">Practice with our AI interviewer that sees, hears, and gives real-time feedback.</p>
                </div>
                <div className="p-12 bg-white hover:bg-blue-100 transition-colors">
                    <h3 className="text-3xl font-black mb-4">📈 CrackScore™</h3>
                    <p className="text-lg font-medium">Know exactly when you are ready. Track your progress with our proprietary scoring engine.</p>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-black text-white p-8 text-center border-t-4 border-black">
                <p className="font-bold">© 2025 CodifyMe. Built for the ambitious.</p>
            </footer>
        </div>
    );
};

export default LandingPage;
