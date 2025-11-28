import { useState, useEffect } from 'react';
import userService from '../services/userService';
import { Zap, TrendingUp, Activity, Award } from 'lucide-react';

function CrackScoreWidget() {
    const [scoreData, setScoreData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchCrackScore();
    }, []);

    const fetchCrackScore = async () => {
        try {
            const data = await userService.getCrackScore();
            setScoreData(data);
        } catch (error) {
            console.error('Error fetching CrackScore:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="bg-white border-4 border-black p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] h-full flex items-center justify-center">
                <div className="flex flex-col items-center gap-2">
                    <div className="w-12 h-12 border-4 border-black border-t-transparent rounded-full animate-spin"></div>
                    <p className="font-black uppercase">Calibrating...</p>
                </div>
            </div>
        );
    }

    if (!scoreData) return null;

    const score = scoreData.score;
    const getScoreColor = (s) => {
        if (s >= 80) return 'text-green-600';
        if (s >= 60) return 'text-yellow-600';
        if (s >= 40) return 'text-orange-600';
        return 'text-red-600';
    };

    const getScoreLabel = (s) => {
        if (s >= 80) return 'ELITE STATUS';
        if (s >= 60) return 'RISING STAR';
        if (s >= 40) return 'IN TRAINING';
        return 'ROOKIE';
    };

    // Calculate gauge rotation (0 to 180 degrees)
    const rotation = (score / 100) * 180;

    return (
        <div className="bg-white border-4 border-black p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] h-full relative overflow-hidden group hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all">
            {/* Decorative Screws */}
            <div className="absolute top-2 left-2 w-3 h-3 border-2 border-black rounded-full bg-gray-300 flex items-center justify-center"><div className="w-full h-[1px] bg-black rotate-45"></div></div>
            <div className="absolute top-2 right-2 w-3 h-3 border-2 border-black rounded-full bg-gray-300 flex items-center justify-center"><div className="w-full h-[1px] bg-black rotate-45"></div></div>
            <div className="absolute bottom-2 left-2 w-3 h-3 border-2 border-black rounded-full bg-gray-300 flex items-center justify-center"><div className="w-full h-[1px] bg-black rotate-45"></div></div>
            <div className="absolute bottom-2 right-2 w-3 h-3 border-2 border-black rounded-full bg-gray-300 flex items-center justify-center"><div className="w-full h-[1px] bg-black rotate-45"></div></div>

            <div className="flex items-center gap-2 mb-6">
                <Zap className="w-6 h-6 fill-yellow-400 text-black" />
                <h3 className="text-2xl font-black uppercase tracking-tighter">CrackScore</h3>
            </div>

            {/* Gauge Visual */}
            <div className="relative w-48 h-24 mx-auto mb-4 overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-full bg-gray-200 rounded-t-full border-4 border-black border-b-0"></div>
                <div
                    className="absolute top-full left-1/2 w-full h-full bg-neo-main origin-top-left rounded-t-full border-4 border-black border-b-0 transition-all duration-1000 ease-out"
                    style={{ transform: `rotate(${rotation - 180}deg) translateX(-50%)` }}
                ></div>
                {/* Needle */}
                <div
                    className="absolute bottom-0 left-1/2 w-1 h-20 bg-black origin-bottom transition-all duration-1000 ease-out z-10"
                    style={{ transform: `translateX(-50%) rotate(${rotation - 90}deg)` }}
                >
                    <div className="absolute -top-1 -left-1.5 w-4 h-4 bg-black rounded-full"></div>
                </div>
            </div>

            <div className="text-center mb-6 relative z-10">
                <div className={`text-6xl font-black ${getScoreColor(score)} drop-shadow-[2px_2px_0px_rgba(0,0,0,1)]`}>
                    {score}
                </div>
                <div className="inline-block bg-black text-white px-3 py-1 font-mono font-bold text-sm transform -rotate-2 mt-2">
                    {getScoreLabel(score)}
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-3 gap-2 border-t-4 border-black pt-4">
                <div className="text-center">
                    <div className="flex justify-center mb-1"><TrendingUp className="w-5 h-5" /></div>
                    <div className="text-xs font-bold uppercase text-gray-500">Roadmap</div>
                    <div className="font-black text-lg">{scoreData.breakdown?.roadmapScore || 0}</div>
                </div>
                <div className="text-center border-l-2 border-r-2 border-black">
                    <div className="flex justify-center mb-1"><Activity className="w-5 h-5" /></div>
                    <div className="text-xs font-bold uppercase text-gray-500">Interview</div>
                    <div className="font-black text-lg">{scoreData.breakdown?.interviewScore || 0}</div>
                </div>
                <div className="text-center">
                    <div className="flex justify-center mb-1"><Award className="w-5 h-5" /></div>
                    <div className="text-xs font-bold uppercase text-gray-500">Streak</div>
                    <div className="font-black text-lg">{scoreData.breakdown?.consistencyScore || 0}</div>
                </div>
            </div>
        </div>
    );
}

export default CrackScoreWidget;
