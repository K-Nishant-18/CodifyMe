import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import roadmapService from '../services/roadmapService';

const RoadmapView = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [roadmap, setRoadmap] = useState(null);
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [generatingRoadmap, setGeneratingRoadmap] = useState(false);
    const [newRoadmap, setNewRoadmap] = useState({
        title: '',
        jobDescription: '',
        targetDate: '',
        skills: ''
    });

    useEffect(() => {
        if (id) {
            fetchRoadmapDetails();
        } else {
            setLoading(false);
            setShowCreateModal(true);
        }
    }, [id]);

    const fetchRoadmapDetails = async () => {
        try {
            setLoading(true);
            const roadmapData = await roadmapService.getRoadmapById(id);
            setRoadmap(roadmapData);

            const tasksData = await roadmapService.getRoadmapTasks(id);
            setTasks(tasksData);
        } catch (error) {
            console.error('Error fetching roadmap:', error);
            alert('Failed to load roadmap');
        } finally {
            setLoading(false);
        }
    };

    const handleCreateRoadmap = async (e) => {
        e.preventDefault();

        if (!newRoadmap.title || !newRoadmap.jobDescription) {
            alert('Please fill in all required fields');
            return;
        }

        try {
            setGeneratingRoadmap(true);

            // Generate AI-powered roadmap
            const response = await roadmapService.generateRoadmap({
                title: newRoadmap.title,
                jobDescription: newRoadmap.jobDescription,
                targetDate: newRoadmap.targetDate || null,
                skills: newRoadmap.skills ? newRoadmap.skills.split(',').map(s => s.trim()) : []
            });

            // Navigate to the new roadmap
            navigate(`/roadmap/${response.id}`);
            setShowCreateModal(false);
        } catch (error) {
            console.error('Error creating roadmap:', error);
            alert('Failed to generate roadmap. Please try again.');
        } finally {
            setGeneratingRoadmap(false);
        }
    };

    const handleToggleTask = async (taskId, currentStatus) => {
        try {
            await roadmapService.updateTaskCompletion(taskId, !currentStatus);

            // Update local state
            setTasks(tasks.map(task =>
                task.id === taskId
                    ? { ...task, completed: !currentStatus }
                    : task
            ));
        } catch (error) {
            console.error('Error updating task:', error);
            alert('Failed to update task');
        }
    };

    const calculateProgress = () => {
        if (tasks.length === 0) return 0;
        const completedTasks = tasks.filter(task => task.completed).length;
        return Math.round((completedTasks / tasks.length) * 100);
    };

    // Create Roadmap Modal
    if (showCreateModal) {
        return (
            <div className="min-h-screen p-8 bg-neo-bg flex items-center justify-center">
                <div className="w-full max-w-3xl bg-white border-4 border-black shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] p-8">
                    <h1 className="text-4xl font-black uppercase mb-8 text-center">Create AI Roadmap</h1>

                    <form onSubmit={handleCreateRoadmap} className="space-y-6">
                        <div>
                            <label className="block text-xl font-bold mb-2">Roadmap Title *</label>
                            <input
                                type="text"
                                value={newRoadmap.title}
                                onChange={(e) => setNewRoadmap({ ...newRoadmap, title: e.target.value })}
                                placeholder="e.g., Software Engineer at Google"
                                className="w-full px-4 py-3 border-2 border-black font-mono focus:outline-none focus:ring-2 focus:ring-neo-main"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-xl font-bold mb-2">Job Description *</label>
                            <textarea
                                value={newRoadmap.jobDescription}
                                onChange={(e) => setNewRoadmap({ ...newRoadmap, jobDescription: e.target.value })}
                                placeholder="Paste the complete job description here..."
                                className="w-full px-4 py-3 border-2 border-black font-mono resize-none focus:outline-none focus:ring-2 focus:ring-neo-main"
                                rows="8"
                                required
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xl font-bold mb-2">Target Date</label>
                                <input
                                    type="date"
                                    value={newRoadmap.targetDate}
                                    onChange={(e) => setNewRoadmap({ ...newRoadmap, targetDate: e.target.value })}
                                    className="w-full px-4 py-3 border-2 border-black font-mono focus:outline-none focus:ring-2 focus:ring-neo-main"
                                />
                            </div>

                            <div>
                                <label className="block text-xl font-bold mb-2">Skills (comma-separated)</label>
                                <input
                                    type="text"
                                    value={newRoadmap.skills}
                                    onChange={(e) => setNewRoadmap({ ...newRoadmap, skills: e.target.value })}
                                    placeholder="Java, Spring Boot, MySQL"
                                    className="w-full px-4 py-3 border-2 border-black font-mono focus:outline-none focus:ring-2 focus:ring-neo-main"
                                />
                            </div>
                        </div>

                        <div className="bg-yellow-100 border-2 border-black p-4">
                            <p className="font-bold text-sm">
                                💡 <strong>Tip:</strong> The AI will analyze the job description and create a personalized learning roadmap with daily tasks tailored to your target role!
                            </p>
                        </div>

                        <div className="flex gap-4">
                            <button
                                type="submit"
                                disabled={generatingRoadmap}
                                className="flex-1 bg-neo-main border-2 border-black px-6 py-4 font-black text-xl uppercase shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {generatingRoadmap ? '🤖 AI Generating Roadmap...' : '✨ Generate AI Roadmap'}
                            </button>
                            <button
                                type="button"
                                onClick={() => navigate('/dashboard')}
                                disabled={generatingRoadmap}
                                className="bg-gray-200 border-2 border-black px-6 py-3 font-bold hover:bg-gray-300 transition-all disabled:opacity-50"
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        );
    }

    // Loading State
    if (loading) {
        return (
            <div className="min-h-screen p-8 bg-neo-bg flex items-center justify-center">
                <div className="text-center">
                    <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-black border-t-neo-main mb-4"></div>
                    <p className="text-2xl font-black">Loading Roadmap...</p>
                </div>
            </div>
        );
    }

    // Roadmap View
    const progress = calculateProgress();

    return (
        <div className="min-h-screen p-8 bg-neo-bg">
            <header className="flex justify-between items-center mb-12">
                <div>
                    <h1 className="text-4xl font-black uppercase tracking-tighter">{roadmap?.title || 'My Roadmap'}</h1>
                    <p className="text-lg font-bold text-gray-600 mt-2">
                        {tasks.length} tasks • {tasks.filter(t => t.completed).length} completed
                    </p>
                </div>
                <button
                    onClick={() => navigate('/dashboard')}
                    className="bg-gray-200 border-2 border-black px-6 py-3 font-bold shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] transition-all"
                >
                    Back to Dashboard
                </button>
            </header>

            <div className="max-w-4xl mx-auto">
                {/* Progress Card */}
                <div className="bg-white border-4 border-black p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] mb-8">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-3xl font-black">Progress</h2>
                        <span className="text-4xl font-black">{progress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 border-2 border-black h-8">
                        <div
                            className={`h-full transition-all duration-500 ${progress >= 80 ? 'bg-green-400' :
                                    progress >= 50 ? 'bg-yellow-400' : 'bg-neo-main'
                                }`}
                            style={{ width: `${progress}%` }}
                        ></div>
                    </div>
                    {roadmap?.targetDate && (
                        <p className="mt-4 font-bold text-lg">
                            🎯 Target Date: {new Date(roadmap.targetDate).toLocaleDateString()}
                        </p>
                    )}
                </div>

                {/* Job Description */}
                {roadmap?.jobDescription && (
                    <div className="bg-white border-4 border-black p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] mb-8">
                        <h3 className="text-2xl font-black mb-4 uppercase">Job Description</h3>
                        <div className="bg-gray-50 border-2 border-black p-4 max-h-40 overflow-y-auto">
                            <p className="font-mono text-sm whitespace-pre-wrap">{roadmap.jobDescription}</p>
                        </div>
                    </div>
                )}

                {/* AI Generated Plan */}
                {roadmap?.aiGeneratedPlan && (
                    <div className="bg-yellow-100 border-4 border-black p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] mb-8">
                        <h3 className="text-2xl font-black mb-4 uppercase flex items-center gap-2">
                            <span>🤖</span> AI Learning Plan
                        </h3>
                        <div className="bg-white border-2 border-black p-4 max-h-60 overflow-y-auto">
                            <p className="font-medium whitespace-pre-wrap">{roadmap.aiGeneratedPlan}</p>
                        </div>
                    </div>
                )}

                {/* Daily Tasks */}
                <div className="space-y-6">
                    <h3 className="text-3xl font-black uppercase">Daily Tasks</h3>

                    {tasks.length === 0 ? (
                        <div className="bg-white border-4 border-black p-8 text-center shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
                            <p className="text-xl font-bold text-gray-500">No tasks yet. Generate a roadmap to get started!</p>
                        </div>
                    ) : (
                        tasks.map((task, index) => (
                            <div
                                key={task.id}
                                className={`bg-white border-4 border-black p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transition-all ${task.completed ? 'opacity-60' : ''
                                    }`}
                            >
                                <div className="flex justify-between items-start">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-4 mb-3">
                                            <input
                                                type="checkbox"
                                                checked={task.completed}
                                                onChange={() => handleToggleTask(task.id, task.completed)}
                                                className="w-6 h-6 border-2 border-black accent-neo-main cursor-pointer"
                                            />
                                            <h4 className="text-2xl font-bold">
                                                Day {task.dayNumber}: {task.title}
                                            </h4>
                                        </div>
                                        <p className="text-lg font-medium ml-10 text-gray-700">
                                            {task.description}
                                        </p>
                                        {task.resources && (
                                            <div className="ml-10 mt-3 bg-blue-50 border-2 border-black p-3">
                                                <p className="font-bold text-sm mb-1">📚 Resources:</p>
                                                <p className="text-sm">{task.resources}</p>
                                            </div>
                                        )}
                                    </div>
                                    {task.completed && (
                                        <span className="bg-green-400 border-2 border-black px-4 py-2 font-black transform rotate-3 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
                                            ✓ DONE
                                        </span>
                                    )}
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {/* Action Buttons */}
                <div className="mt-8 flex gap-4">
                    <button
                        onClick={() => {
                            setShowCreateModal(true);
                            setNewRoadmap({
                                title: '',
                                jobDescription: '',
                                targetDate: '',
                                skills: ''
                            });
                        }}
                        className="flex-1 bg-neo-main border-2 border-black px-6 py-4 font-black text-lg shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] transition-all"
                    >
                        + Create New Roadmap
                    </button>
                </div>
            </div>
        </div>
    );
};

export default RoadmapView;
