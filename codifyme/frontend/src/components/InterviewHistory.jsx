import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import interviewService from '../services/interviewService';
import { Calendar, TrendingUp, Award, ChevronRight, Filter } from 'lucide-react';

const InterviewHistory = () => {
    const [interviews, setInterviews] = useState([]);
    const [filteredInterviews, setFilteredInterviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filterType, setFilterType] = useState('All');
    const [filterScore, setFilterScore] = useState('All');
    const navigate = useNavigate();

    useEffect(() => {
        fetchInterviews();
    }, []);

    useEffect(() => {
        applyFilters();
    }, [filterType, filterScore, interviews]);

    const fetchInterviews = async () => {
        try {
            const data = await interviewService.getInterviewHistory();
            setInterviews(data);
            setFilteredInterviews(data);
        } catch (error) {
            console.error('Error fetching interviews:', error);
        } finally {
            setLoading(false);
        }
    };

    const applyFilters = () => {
        let filtered = [...interviews];

        if (filterType !== 'All') {
            filtered = filtered.filter(interview => interview.type === filterType);
        }

        if (filterScore !== 'All') {
            if (filterScore === 'High') {
                filtered = filtered.filter(interview => interview.score >= 80);
            } else if (filterScore === 'Medium') {
                filtered = filtered.filter(interview => interview.score >= 60 && interview.score < 80);
            } else if (filterScore === 'Low') {
                filtered = filtered.filter(interview => interview.score < 60);
            }
        }

        setFilteredInterviews(filtered);
    };

    const getScoreColor = (score) => {
        if (score >= 80) return 'bg-green-400';
        if (score >= 60) return 'bg-yellow-400';
        return 'bg-red-400';
    };

    const getScoreLabel = (score) => {
        if (score >= 80) return 'EXCELLENT';
        if (score >= 60) return 'GOOD';
        return 'NEEDS WORK';
    };

    if (loading) {
        return (
            <div className="min-h-screen p-8 bg-neo-bg flex items-center justify-center">
                <div className="text-2xl font-black uppercase tracking-tighter animate-pulse">
                    Loading Battle History...
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen p-4 md:p-8 bg-neo-bg font-mono">
            {/* Header */}
            <header className="mb-8">
                <div className="flex items-center gap-3 mb-2">
                    <Award className="w-8 h-8" />
                    <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tighter leading-none">
                        Battle History<span className="text-neo-main">.log</span>
                    </h1>
                </div>
                <p className="text-lg font-bold text-gray-600">
                    {filteredInterviews.length} interview{filteredInterviews.length !== 1 ? 's' : ''} found
                </p>
            </header>

            {/* Filters */}
            <div className="bg-white border-4 border-black p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] mb-8">
                <div className="flex items-center gap-2 mb-4">
                    <Filter className="w-5 h-5" />
                    <h2 className="text-xl font-black uppercase">Filters</h2>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                    <div>
                        <label className="block font-bold mb-2 text-sm">Interview Type</label>
                        <select
                            value={filterType}
                            onChange={(e) => setFilterType(e.target.value)}
                            className="w-full px-4 py-2 border-2 border-black font-bold focus:outline-none focus:ring-2 focus:ring-neo-main"
                        >
                            <option>All</option>
                            <option>Chat</option>
                            <option>Video</option>
                        </select>
                    </div>
                    <div>
                        <label className="block font-bold mb-2 text-sm">Score Range</label>
                        <select
                            value={filterScore}
                            onChange={(e) => setFilterScore(e.target.value)}
                            className="w-full px-4 py-2 border-2 border-black font-bold focus:outline-none focus:ring-2 focus:ring-neo-main"
                        >
                            <option>All</option>
                            <option>High (80+)</option>
                            <option>Medium (60-79)</option>
                            <option>Low (&lt;60)</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Interview Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredInterviews.length > 0 ? (
                    filteredInterviews.map((interview) => (
                        <div
                            key={interview.id}
                            className="bg-white border-4 border-black p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[4px] hover:translate-y-[4px] transition-all"
                        >
                            {/* Score Badge */}
                            <div className="flex justify-between items-start mb-4">
                                <div className={`${getScoreColor(interview.score)} border-2 border-black px-4 py-2`}>
                                    <div className="text-3xl font-black">{interview.score}</div>
                                    <div className="text-xs font-black">/100</div>
                                </div>
                                <span className={`${getScoreColor(interview.score)} border-2 border-black px-3 py-1 text-xs font-black`}>
                                    {getScoreLabel(interview.score)}
                                </span>
                            </div>

                            {/* Interview Details */}
                            <div className="mb-4">
                                <h3 className="text-xl font-black mb-2">{interview.type} Interview</h3>
                                <div className="flex items-center gap-2 text-sm font-bold text-gray-600">
                                    <Calendar className="w-4 h-4" />
                                    <span>{new Date(interview.createdAt).toLocaleDateString('en-US', {
                                        year: 'numeric',
                                        month: 'short',
                                        day: 'numeric'
                                    })}</span>
                                </div>
                            </div>

                            {/* View Button */}
                            <button
                                onClick={() => navigate('/interview')}
                                className="w-full flex items-center justify-between bg-black text-white border-2 border-black p-3 font-black hover:bg-neo-main hover:text-black transition-colors"
                            >
                                <span>VIEW DETAILS</span>
                                <ChevronRight className="w-5 h-5" />
                            </button>
                        </div>
                    ))
                ) : (
                    <div className="col-span-full text-center py-12">
                        <p className="text-xl font-black text-gray-400 mb-4">NO BATTLE DATA FOUND</p>
                        <button
                            onClick={() => navigate('/interview')}
                            className="bg-neo-main border-2 border-black px-6 py-3 font-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] transition-all"
                        >
                            START YOUR FIRST INTERVIEW
                        </button>
                    </div>
                )}
            </div>

            {/* Stats Summary */}
            {filteredInterviews.length > 0 && (
                <div className="mt-8 grid md:grid-cols-3 gap-6">
                    <div className="bg-white border-4 border-black p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
                        <div className="flex items-center gap-3 mb-2">
                            <TrendingUp className="w-6 h-6 text-green-600" />
                            <h3 className="text-lg font-black uppercase">Average Score</h3>
                        </div>
                        <p className="text-4xl font-black">
                            {Math.round(filteredInterviews.reduce((sum, i) => sum + i.score, 0) / filteredInterviews.length)}
                        </p>
                    </div>
                    <div className="bg-white border-4 border-black p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
                        <div className="flex items-center gap-3 mb-2">
                            <Award className="w-6 h-6 text-yellow-600" />
                            <h3 className="text-lg font-black uppercase">Best Score</h3>
                        </div>
                        <p className="text-4xl font-black">
                            {Math.max(...filteredInterviews.map(i => i.score))}
                        </p>
                    </div>
                    <div className="bg-white border-4 border-black p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
                        <div className="flex items-center gap-3 mb-2">
                            <Calendar className="w-6 h-6 text-blue-600" />
                            <h3 className="text-lg font-black uppercase">Total Interviews</h3>
                        </div>
                        <p className="text-4xl font-black">{filteredInterviews.length}</p>
                    </div>
                </div>
            )}

            {/* Back Button */}
            <div className="mt-8">
                <button
                    onClick={() => navigate('/dashboard')}
                    className="bg-gray-200 border-2 border-black px-6 py-3 font-bold shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] transition-all"
                >
                    ← Back to Dashboard
                </button>
            </div>
        </div>
    );
};

export default InterviewHistory;
