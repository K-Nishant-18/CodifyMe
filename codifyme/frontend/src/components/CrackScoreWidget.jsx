import { useState, useEffect } from 'react';
import userService from '../services/userService';

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
            <div className="bg-white border-4 border-black p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
                <div className="animate-pulse">
                    <div className="h-8 bg-gray-200 rounded mb-4"></div>
                    <div className="h-24 bg-gray-200 rounded"></div>
                </div>
            </div>
        );
    }

    if (!scoreData) {
        return null;
    }

    const getScoreColor = (score) => {
        if (score >= 80) return 'bg-green-400';
        if (score >= 60) return 'bg-yellow-400';
        if (score >= 40) return 'bg-orange-400';
        return 'bg-red-400';
    };

    const getScoreLabel = (score) => {
        if (score >= 80) return 'Excellent!';
        if (score >= 60) return 'Good Progress';
        if (score >= 40) return 'Keep Going';
        return 'Just Started';
    };

    return (
        <div className="bg-white border-4 border-black p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
            <h3 className="text-2xl font-black uppercase mb-4">CrackScore</h3>

            {/* Score Display */}
            <div className="flex items-center justify-center mb-6">
                <div className={`${getScoreColor(scoreData.score)} border-4 border-black w-32 h-32 flex items-center justify-center shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]`}>
                    <div className="text-center">
                        <div className="text-5xl font-black">{scoreData.score}</div>
                        <div className="text-sm font-bold">/ 100</div>
                    </div>
                </div>
            </div>

            <div className="text-center mb-4">
                <span className="inline-block bg-neo-main border-2 border-black px-4 py-1 font-black text-sm">
                    {getScoreLabel(scoreData.score)}
                </span>
            </div>

            {/* Breakdown */}
            {scoreData.breakdown && (
                <div className="space-y-2 mb-4">
                    <div className="flex justify-between items-center">
                        <span className="font-bold">Roadmap Progress:</span>
                        <span className="bg-gray-200 border-2 border-black px-3 py-1 font-black">
                            {scoreData.breakdown.roadmapScore || 0}
                        </span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="font-bold">Interview Performance:</span>
                        <span className="bg-gray-200 border-2 border-black px-3 py-1 font-black">
                            {scoreData.breakdown.interviewScore || 0}
                        </span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="font-bold">Consistency:</span>
                        <span className="bg-gray-200 border-2 border-black px-3 py-1 font-black">
                            {scoreData.breakdown.consistencyScore || 0}
                        </span>
                    </div>
                </div>
            )}

            {/* Recommendations */}
            {scoreData.recommendations && scoreData.recommendations.length > 0 && (
                <div className="mt-4 pt-4 border-t-2 border-black">
                    <h4 className="font-black text-sm uppercase mb-2">Recommendations:</h4>
                    <ul className="space-y-1">
                        {scoreData.recommendations.map((rec, index) => (
                            <li key={index} className="text-sm flex items-start">
                                <span className="mr-2">•</span>
                                <span>{rec}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
}

export default CrackScoreWidget;
