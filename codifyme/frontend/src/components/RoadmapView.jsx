import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import roadmapService from '../services/roadmapService';
import { Filter, Plus, ChevronRight, Calendar, Target, Zap, CheckCircle2, Circle } from 'lucide-react';

const RoadmapView = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    // Roadmap list state
    const [allRoadmaps, setAllRoadmaps] = useState([]);
    const [filteredRoadmaps, setFilteredRoadmaps] = useState([]);
    const [statusFilter, setStatusFilter] = useState('All');

    // Selected/Create state
    const [selectedRoadmap, setSelectedRoadmap] = useState(null);
    const [tasks, setTasks] = useState([]);
    const [mode, setMode] = useState('create'); // 'create' or 'view'

    // Form state
    const [loading, setLoading] = useState(true);
    const [generatingRoadmap, setGeneratingRoadmap] = useState(false);
    const [newRoadmap, setNewRoadmap] = useState({
        title: '',
        jobDescription: '',
        targetDate: '',
        skills: ''
    });

    useEffect(() => {
        fetchAllRoadmaps();
    }, []);

    useEffect(() => {
        if (id && allRoadmaps.length > 0) {
            const roadmap = allRoadmaps.find(rm => rm.id === parseInt(id));
            if (roadmap) {
                setSelectedRoadmap(roadmap);
                setMode('view');
                fetchRoadmapTasks(parseInt(id));
            }
        }
    }, [id, allRoadmaps]);

    useEffect(() => {
        applyFilters();
    }, [statusFilter, allRoadmaps]);

    const fetchAllRoadmaps = async () => {
        try {
            const roadmapsData = await roadmapService.getUserRoadmaps();
            setAllRoadmaps(roadmapsData);
            setFilteredRoadmaps(roadmapsData);
        } catch (error) {
            console.error('Error fetching roadmaps:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchRoadmapTasks = async (roadmapId) => {
        try {
            const tasksData = await roadmapService.getRoadmapTasks(roadmapId);
            setTasks(tasksData);
        } catch (error) {
            console.error('Error fetching tasks:', error);
        }
    };

    const applyFilters = () => {
        let filtered = [...allRoadmaps];
        if (statusFilter !== 'All') {
            filtered = filtered.filter(rm => rm.status === statusFilter);
        }
        setFilteredRoadmaps(filtered);
    };

    const handleSelectRoadmap = (roadmap) => {
        setSelectedRoadmap(roadmap);
        setMode('view');
        fetchRoadmapTasks(roadmap.id);
        navigate(`/roadmap/${roadmap.id}`);
    };

    const handleCreateNew = () => {
        setMode('create');
        setSelectedRoadmap(null);
        setTasks([]);
        setNewRoadmap({ title: '', jobDescription: '', targetDate: '', skills: '' });
        navigate('/roadmap');
    };

    const handleCreateRoadmap = async (e) => {
        e.preventDefault();
        if (!newRoadmap.title || !newRoadmap.jobDescription) {
            alert('Please fill in all required fields');
            return;
        }

        try {
            setGeneratingRoadmap(true);
            const response = await roadmapService.generateRoadmap({
                title: newRoadmap.title,
                jobDescription: newRoadmap.jobDescription,
                targetDate: newRoadmap.targetDate || null,
                skills: newRoadmap.skills ? newRoadmap.skills.split(',').map(s => s.trim()) : []
            });

            await fetchAllRoadmaps();
            navigate(`/roadmap/${response.id}`);
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
            setTasks(tasks.map(task =>
                task.id === taskId ? { ...task, completed: !currentStatus } : task
            ));
            await fetchAllRoadmaps(); // Refresh to update progress
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

    if (loading) {
        return (
            <div className="min-h-screen p-8 bg-neo-bg flex items-center justify-center">
                <div className="text-2xl font-black uppercase tracking-tighter animate-pulse">
                    Loading Roadmaps...
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen p-4 md:p-8 bg-neo-bg font-mono">
            {/* Header */}
            <header className="mb-6">
                <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tighter leading-none">
                    Roadmap<span className="text-neo-main">.Hub</span>
                </h1>
                <p className="text-lg font-bold text-gray-600 mt-2">
                    Plan your path to success
                </p>
            </header>

            {/* Split Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

                {/* LEFT PANEL: Roadmap History */}
                <div className="lg:col-span-4 bg-white border-4 border-black p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] h-fit lg:sticky lg:top-24">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-2xl font-black uppercase">My Roadmaps</h2>
                        <button
                            onClick={handleCreateNew}
                            className="bg-neo-main border-2 border-black p-2 font-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] transition-all"
                        >
                            <Plus className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Filter */}
                    <div className="mb-4 flex items-center gap-2">
                        <Filter className="w-4 h-4" />
                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="flex-1 px-3 py-2 border-2 border-black font-bold text-sm focus:outline-none focus:ring-2 focus:ring-neo-main"
                        >
                            <option>All</option>
                            <option>Active</option>
                            <option>Completed</option>
                        </select>
                    </div>

                    {/* Roadmap List */}
                    <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2">
                        {filteredRoadmaps.length > 0 ? (
                            filteredRoadmaps.map((roadmap) => (
                                <div
                                    key={roadmap.id}
                                    onClick={() => handleSelectRoadmap(roadmap)}
                                    className={`border-2 border-black p-4 cursor-pointer transition-all hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[-2px] hover:translate-y-[-2px] ${selectedRoadmap?.id === roadmap.id
                                        ? 'bg-neo-main shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]'
                                        : 'bg-gray-50'
                                        }`}
                                >
                                    <div className="flex justify-between items-start mb-2">
                                        <h3 className="font-black text-sm leading-tight flex-1 mr-2">{roadmap.title}</h3>
                                        <span className={`text-[10px] font-black border border-black px-1.5 py-0.5 ${roadmap.status === 'Active' ? 'bg-green-400' : 'bg-gray-300'
                                            }`}>
                                            {roadmap.status}
                                        </span>
                                    </div>
                                    <div className="w-full bg-gray-200 h-1.5 border border-black mb-1">
                                        <div
                                            className="bg-black h-full transition-all duration-300"
                                            style={{ width: `${roadmap.completionPercentage || 0}%` }}
                                        ></div>
                                    </div>
                                    <p className="text-xs font-bold text-right">{Math.round(roadmap.completionPercentage || 0)}%</p>
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-8 border-2 border-dashed border-gray-300">
                                <p className="font-bold text-gray-400 mb-2">NO ROADMAPS YET</p>
                                <button
                                    onClick={handleCreateNew}
                                    className="text-sm font-black underline hover:text-neo-main"
                                >
                                    CREATE YOUR FIRST +
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                {/* RIGHT PANEL: Create or View */}
                <div className="lg:col-span-8">
                    {mode === 'create' ? (
                        /* CREATE MODE */
                        <div className="bg-white border-4 border-black p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
                            <div className="flex items-center gap-3 mb-6">
                                <Zap className="w-8 h-8 text-neo-main fill-neo-main" />
                                <h2 className="text-3xl font-black uppercase">Generate AI Roadmap</h2>
                            </div>

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

                                <button
                                    type="submit"
                                    disabled={generatingRoadmap}
                                    className="w-full bg-neo-main border-2 border-black px-6 py-4 font-black text-xl uppercase shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {generatingRoadmap ? '🤖 AI Generating Roadmap...' : '✨ Generate AI Roadmap'}
                                </button>
                            </form>
                        </div>
                    ) : (
                        /* VIEW MODE */
                        selectedRoadmap && (
                            <div className="space-y-6">
                                {/* Roadmap Header */}
                                <div className="bg-white border-4 border-black p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
                                    <h2 className="text-3xl font-black mb-4">{selectedRoadmap.title}</h2>
                                    <div className="flex items-center gap-6 text-sm font-bold text-gray-600">
                                        {selectedRoadmap.targetDate && (
                                            <div className="flex items-center gap-2">
                                                <Calendar className="w-4 h-4" />
                                                <span>Target: {new Date(selectedRoadmap.targetDate).toLocaleDateString()}</span>
                                            </div>
                                        )}
                                        <div className="flex items-center gap-2">
                                            <Target className="w-4 h-4" />
                                            <span>{tasks.length} Tasks</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Progress Card */}
                                <div className="bg-white border-4 border-black p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
                                    <div className="flex justify-between items-center mb-4">
                                        <h3 className="text-2xl font-black uppercase">Progress</h3>
                                        <span className="text-4xl font-black">{calculateProgress()}%</span>
                                    </div>
                                    <div className="w-full bg-gray-200 border-2 border-black h-8">
                                        <div
                                            className={`h-full transition-all duration-500 ${calculateProgress() >= 80 ? 'bg-green-400' :
                                                calculateProgress() >= 50 ? 'bg-yellow-400' : 'bg-neo-main'
                                                }`}
                                            style={{ width: `${calculateProgress()}%` }}
                                        ></div>
                                    </div>
                                </div>

                                {/* AI Generated Plan */}
                                {selectedRoadmap.aiGeneratedPlan && (
                                    <div className="bg-gradient-to-br from-yellow-100 to-yellow-200 border-4 border-black p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] relative overflow-hidden">
                                        <div className="absolute top-0 right-0 bg-black text-white text-xs font-black px-3 py-1">AI GENERATED</div>
                                        <div className="flex items-center gap-3 mb-4">
                                            <Zap className="w-7 h-7 text-black fill-yellow-400" />
                                            <h3 className="text-2xl font-black uppercase">Your Personalized Roadmap</h3>
                                        </div>
                                        <div className="bg-white border-2 border-black p-4 max-h-96 overflow-y-auto">
                                            <pre className="font-mono text-sm whitespace-pre-wrap leading-relaxed">{selectedRoadmap.aiGeneratedPlan}</pre>
                                        </div>
                                    </div>
                                )}

                                {/* Tasks List */}
                                <div className="bg-white border-4 border-black p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
                                    <h3 className="text-2xl font-black uppercase mb-4">Daily Tasks</h3>
                                    <div className="space-y-4">
                                        {tasks.length > 0 ? (
                                            tasks.map((task) => (
                                                <div
                                                    key={task.id}
                                                    className={`border-2 border-black p-4 transition-all ${task.completed ? 'bg-gray-100 opacity-70' : 'bg-white'
                                                        }`}
                                                >
                                                    <div className="flex items-start gap-3">
                                                        <button
                                                            onClick={() => handleToggleTask(task.id, task.completed)}
                                                            className="mt-1"
                                                        >
                                                            {task.completed ? (
                                                                <CheckCircle2 className="w-6 h-6 text-green-600 fill-green-600" />
                                                            ) : (
                                                                <Circle className="w-6 h-6" />
                                                            )}
                                                        </button>
                                                        <div className="flex-1">
                                                            <h4 className="text-lg font-black mb-1">
                                                                Day {task.dayNumber}: {task.title}
                                                            </h4>
                                                            <p className="text-sm font-medium text-gray-700">{task.description}</p>
                                                            {task.resources && (
                                                                <div className="mt-2 bg-blue-50 border border-black p-2">
                                                                    <p className="font-bold text-xs mb-1">📚 Resources:</p>
                                                                    <p className="text-xs">{task.resources}</p>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            ))
                                        ) : (
                                            <p className="text-center text-gray-400 font-bold py-8">No tasks available</p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )
                    )}
                </div>
            </div>
        </div>
    );
};

export default RoadmapView;
