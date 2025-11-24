import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import userService from '../services/userService';
import roadmapService from '../services/roadmapService';
import interviewService from '../services/interviewService';
import CrackScoreWidget from './CrackScoreWidget';

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
            <div className="min-h-screen p-8 flex items-center justify-center">
                <div className="text-2xl font-black">Loading Dashboard...</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen p-8">
            <header className="mb-12">
                <h1 className="text-4xl font-black uppercase tracking-tighter mb-2">Dashboard</h1>
                <p className="text-xl font-bold">Welcome back, {profile?.fullName || 'User'}!</p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* CrackScore Card */}
                <div className="col-span-1">
                    <CrackScoreWidget />
                </div>

                {/* Active Roadmaps */}
                <div className="bg-white border-4 border-black p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] col-span-1 md:col-span-2">
                    <h2 className="text-2xl font-black mb-4 border-b-2 border-black pb-2 uppercase">Active Roadmaps</h2>
                    <div className="space-y-4">
                        {roadmaps.length > 0 ? (
                            roadmaps.map((roadmap) => (
                                <div
                                    key={roadmap.id}
                                    className="border-2 border-black p-4 bg-yellow-200 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] cursor-pointer hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[1px] hover:translate-y-[1px] transition-all"
                                    onClick={() => navigate('/roadmap')}
                                >
                                    <div className="flex justify-between items-center">
                                        <h3 className="font-bold text-xl">{roadmap.jobTitle}</h3>
                                        <span className={`px-2 py-1 text-xs font-black border-2 border-black ${roadmap.status === 'Active' ? 'bg-green-400' :
                                                roadmap.status === 'Completed' ? 'bg-blue-400' : 'bg-gray-400'
                                            }`}>
                                            {roadmap.status}
                                        </span>
                                    </div>
                                    {roadmap.targetDate && (
                                        <p className="text-sm mt-2 font-bold">
                                            Target: {new Date(roadmap.targetDate).toLocaleDateString()}
                                        </p>
                                    )}
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-8">
                                <p className="font-bold mb-4">No active roadmaps yet!</p>
                                <button
                                    onClick={() => navigate('/roadmap')}
                                    className="bg-neo-main border-2 border-black px-6 py-2 font-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] transition-all"
                                >
                                    Create Your First Roadmap
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                {/* Recent Interviews */}
                <div className="bg-white border-4 border-black p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] col-span-1 md:col-span-2">
                    <h2 className="text-2xl font-black mb-4 border-b-2 border-black pb-2 uppercase">Recent Interviews</h2>
                    {interviews.length > 0 ? (
                        <div className="space-y-3">
                            {interviews.map((interview) => (
                                <div
                                    key={interview.id}
                                    className="flex items-center justify-between border-2 border-black p-3 bg-gray-50"
                                >
                                    <div>
                                        <span className="font-bold">{interview.type} Interview</span>
                                        <p className="text-sm text-gray-600">
                                            {new Date(interview.createdAt).toLocaleDateString()}
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <span className={`inline-block px-3 py-1 font-black border-2 border-black ${interview.score >= 80 ? 'bg-green-400' :
                                                interview.score >= 60 ? 'bg-yellow-400' : 'bg-red-400'
                                            }`}>
                                            {interview.score}/100
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-8">
                            <p className="font-bold mb-4">No interviews yet!</p>
                            <button
                                onClick={() => navigate('/interview')}
                                className="bg-neo-main border-2 border-black px-6 py-2 font-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] transition-all"
                            >
                                Start Your First Interview
                            </button>
                        </div>
                    )}
                </div>

                {/* Quick Actions */}
                <div className="bg-white border-4 border-black p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
                    <h2 className="text-2xl font-black mb-4 border-b-2 border-black pb-2 uppercase">Quick Actions</h2>
                    <div className="grid grid-cols-1 gap-4">
                        <button
                            onClick={() => navigate('/interview')}
                            className="bg-blue-300 border-2 border-black px-4 py-3 font-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] transition-all"
                        >
                            Start Interview
                        </button>
                        <button
                            onClick={() => navigate('/roadmap')}
                            className="bg-green-300 border-2 border-black px-4 py-3 font-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] transition-all"
                        >
                            View Roadmap
                        </button>
                        <button
                            onClick={() => navigate('/companies')}
                            className="bg-orange-300 border-2 border-black px-4 py-3 font-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] transition-all"
                        >
                            Company Insights
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
