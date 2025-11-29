import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import userService from '../services/userService';
import roadmapService from '../services/roadmapService';
import interviewService from '../services/interviewService';
import CrackScoreWidget from './CrackScoreWidget';
import ResumeRoaster from './ResumeRoaster';
import { Flame, Target, ToggleRight, Activity, Terminal, Map, Briefcase, ChevronRight, Play, FileText } from 'lucide-react';

const Dashboard = () => {
    const [profile, setProfile] = useState(null);
    const [roadmaps, setRoadmaps] = useState([]);
    const [interviews, setInterviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            const [profileData, roadmapsData, interviewsData] = await Promise.all([
                userService.getProfile(),
                roadmapService.getUserRoadmaps(),
                interviewService.getInterviewHistory()
            ]);

            setProfile(profileData);
            setRoadmaps(roadmapsData);
            setInterviews(interviewsData.slice(0, 3)); // Last 3 interviews
        } catch (error) {
            console.error('Error fetching dashboard data:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen p-8 flex items-center justify-center bg-neo-bg font-mono">
                <div className="text-2xl font-black uppercase tracking-tighter animate-pulse">
                    Initializing Command Center...
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen p-4 md:p-8 bg-neo-bg font-mono overflow-x-hidden">
            {/* Header Section */}
            <header className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
                <div>
                    <div className="flex items-center gap-2 mb-2">
                        <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                        <span className="text-xs font-bold uppercase tracking-widest text-gray-500">System Online</span>
                    </div>
                    <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter leading-none">
                        Dashboard<span className="text-neo-main">.exe</span>
                    </h1>
                    <p className="text-xl font-bold mt-2">
                        Welcome back, <span className="bg-black text-white px-2">{profile?.fullName || 'Developer'}</span>
                    </p>
                </div>

                {/* Quick Stats Ticker */}
                <div className="bg-white border-2 border-black p-2 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex gap-4 text-sm font-bold">
                    <div className="flex items-center gap-1">
                        <Flame className="w-4 h-4 text-orange-500 fill-orange-500" />
                        <span>Streak: {profile?.currentStreak || 0} Days</span>
                    </div>
                    <div className="w-[2px] bg-black"></div>
                    <div className="flex items-center gap-1">
                        <Target className="w-4 h-4 text-red-500" />
                        <span>Target: {profile?.targetCompany || 'Not Set'}</span>
                    </div>
                </div>
            </header>

            {/* Bento Grid Layout */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6">

                {/* 1. CrackScore Widget (Large Square) */}
                <div className="md:col-span-4 h-full">
                    <CrackScoreWidget />
                </div>

                {/* 2. Resume Roaster (Wide Rectangle) */}
                <div className="md:col-span-8 h-full">
                    <ResumeRoaster />
                </div>

                {/* 3. Control Panel (Small Square) */}
                <div className="md:col-span-4 bg-white border-4 border-black p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] flex flex-col justify-between">
                    <h2 className="text-2xl font-black uppercase mb-4 flex items-center gap-2">
                        <Activity className="w-6 h-6" /> Control Panel
                    </h2>
                    <div className="space-y-3">
                        <button
                            onClick={() => navigate('/interview')}
                            className="w-full flex items-center justify-between bg-gray-100 border-2 border-black p-3 hover:bg-neo-main hover:translate-x-[2px] hover:translate-y-[2px] transition-all group"
                        >
                            <span className="font-bold flex items-center gap-2"><Terminal className="w-4 h-4" /> New Interview</span>
                            <Play className="w-4 h-4 fill-black group-hover:scale-110 transition-transform" />
                        </button>
                        <button
                            onClick={() => navigate('/roadmap')}
                            className="w-full flex items-center justify-between bg-gray-100 border-2 border-black p-3 hover:bg-yellow-300 hover:translate-x-[2px] hover:translate-y-[2px] transition-all group"
                        >
                            <span className="font-bold flex items-center gap-2"><Map className="w-4 h-4" /> View Roadmap</span>
                            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </button>
                        <button
                            onClick={() => navigate('/companies')}
                            className="w-full flex items-center justify-between bg-gray-100 border-2 border-black p-3 hover:bg-blue-300 hover:translate-x-[2px] hover:translate-y-[2px] transition-all group"
                        >
                            <span className="font-bold flex items-center gap-2"><Briefcase className="w-4 h-4" /> Company Intel</span>
                            <ToggleRight className="w-4 h-4" />
                        </button>
                    </div>
                </div>

                {/* 4. Active Roadmaps (Medium Rectangle) */}
                <div className="md:col-span-4 bg-white border-4 border-black p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] relative overflow-hidden">
                    <div className="absolute top-0 right-0 bg-black text-white text-xs font-bold px-2 py-1">MISSION LOG</div>
                    <h2 className="text-2xl font-black uppercase mb-4">Active Missions</h2>

                    <div className="space-y-3 max-h-[250px] overflow-y-auto pr-2 custom-scrollbar">
                        {roadmaps.length > 0 ? (
                            roadmaps.map((roadmap) => (
                                <div
                                    key={roadmap.id}
                                    onClick={() => navigate(`/roadmap/${roadmap.id}`)}
                                    className="border-2 border-black p-3 bg-yellow-50 hover:bg-yellow-200 cursor-pointer transition-colors relative group"
                                >
                                    <div className="flex justify-between items-start mb-2">
                                        <h3 className="font-bold leading-tight">{roadmap.jobTitle}</h3>
                                        <span className={`text-[10px] font-black border border-black px-1 ${roadmap.status === 'Active' ? 'bg-green-400' : 'bg-gray-300'
                                            }`}>
                                            {roadmap.status.toUpperCase()}
                                        </span>
                                    </div>
                                    <div className="w-full bg-gray-200 h-2 border border-black">
                                        <div
                                            className="bg-black h-full group-hover:opacity-80 transition-all duration-500"
                                            style={{ width: `${roadmap.completionPercentage || 0}%` }}
                                        ></div>
                                    </div>
                                    <p className="text-xs font-bold mt-1 text-right">{Math.round(roadmap.completionPercentage || 0)}% COMPLETE</p>
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-8 border-2 border-dashed border-gray-300">
                                <p className="font-bold text-gray-400 mb-2">NO ACTIVE MISSIONS</p>
                                <button onClick={() => navigate('/roadmap')} className="text-sm font-black underline hover:text-neo-main">INITIATE +</button>
                            </div>
                        )}
                    </div>
                </div>

                {/* 5. Recent Interviews (Medium Rectangle) */}
                <div className="md:col-span-4 bg-white border-4 border-black p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
                    <h2 className="text-2xl font-black uppercase mb-4">Battle Logs</h2>

                    <div className="space-y-3">
                        {interviews.length > 0 ? (
                            interviews.map((interview) => (
                                <div key={interview.id} className="flex items-center justify-between border-b-2 border-black pb-2 last:border-0">
                                    <div className="flex items-center gap-3">
                                        <div className={`w-8 h-8 flex items-center justify-center border-2 border-black font-black ${interview.score >= 80 ? 'bg-green-400' :
                                            interview.score >= 60 ? 'bg-yellow-400' : 'bg-red-400'
                                            }`}>
                                            {interview.score}
                                        </div>
                                        <div>
                                            <p className="font-bold text-sm">{interview.type}</p>
                                            <p className="text-xs text-gray-500">{new Date(interview.createdAt).toLocaleDateString()}</p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => navigate('/interview')}
                                        className="text-xs font-black border border-black px-2 py-1 hover:bg-black hover:text-white transition-colors"
                                    >
                                        VIEW
                                    </button>
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-8">
                                <p className="font-bold text-gray-400">NO BATTLE DATA</p>
                            </div>
                        )}
                    </div>
                </div>

            </div>
        </div>
    );
};

export default Dashboard;
