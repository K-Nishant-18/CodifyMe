import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import interviewService from '../services/interviewService';
import { Play, Video, MessageSquare, Award, Calendar, Filter, Plus, Trophy, TrendingUp, Zap, AlertTriangle, Mic, MicOff, VideoOff, PhoneOff, Monitor, Maximize2, Minimize2, Share, Smile, Settings, Grid, Layout, Wifi, Captions } from 'lucide-react';

const InterviewSimulator = () => {
    const navigate = useNavigate();
    const videoRef = useRef(null);
    const containerRef = useRef(null);

    // Interview history state
    const [allInterviews, setAllInterviews] = useState([]);
    const [filteredInterviews, setFilteredInterviews] = useState([]);
    const [typeFilter, setTypeFilter] = useState('All');
    const [selectedInterview, setSelectedInterview] = useState(null);

    // Active interview state
    const [mode, setMode] = useState('setup'); // 'setup', 'active', 'completed', 'view'
    const [messages, setMessages] = useState([]);
    const [currentInput, setCurrentInput] = useState('');
    const [jobRole, setJobRole] = useState('');
    const [interviewType, setInterviewType] = useState('Chat');
    const [loading, setLoading] = useState(false);
    const [feedback, setFeedback] = useState(null);
    const [isFullscreen, setIsFullscreen] = useState(false);

    // Video controls state
    const [isMicOn, setIsMicOn] = useState(true);
    const [isVideoOn, setIsVideoOn] = useState(true);
    const [showChat, setShowChat] = useState(true);
    const [layoutMode, setLayoutMode] = useState('speaker'); // 'speaker', 'grid'
    const [showCaptions, setShowCaptions] = useState(true);
    const [showSettings, setShowSettings] = useState(false);
    const [networkQuality, setNetworkQuality] = useState(3); // 0-3 bars
    const [elapsedTime, setElapsedTime] = useState(0);
    const [isListening, setIsListening] = useState(false);
    const recognitionRef = useRef(null);

    // Simulated Audio Visualizer Data
    const [audioLevels, setAudioLevels] = useState(new Array(5).fill(10));

    useEffect(() => {
        if (loading) {
            const interval = setInterval(() => {
                setAudioLevels(prev => prev.map(() => Math.random() * 100));
            }, 100);
            return () => clearInterval(interval);
        } else {
            setAudioLevels(new Array(5).fill(10));
        }
    }, [loading]);

    useEffect(() => {
        // Initialize Speech Recognition
        if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
            const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
            recognitionRef.current = new SpeechRecognition();
            recognitionRef.current.continuous = true;
            recognitionRef.current.interimResults = true;

            recognitionRef.current.onresult = (event) => {
                let interimTranscript = '';
                for (let i = event.resultIndex; i < event.results.length; ++i) {
                    if (event.results[i].isFinal) {
                        setCurrentInput(prev => prev + event.results[i][0].transcript + ' ');
                    } else {
                        interimTranscript += event.results[i][0].transcript;
                    }
                }
            };

            recognitionRef.current.onerror = (event) => {
                console.error('Speech recognition error', event.error);
                setIsListening(false);
            };

            recognitionRef.current.onend = () => {
                setIsListening(false);
            };
        }
    }, []);

    const toggleListening = () => {
        if (isListening) {
            recognitionRef.current.stop();
            setIsListening(false);
        } else {
            recognitionRef.current.start();
            setIsListening(true);
        }
    };

    const speakText = (text) => {
        if ('speechSynthesis' in window) {
            window.speechSynthesis.cancel(); // Stop any previous speech
            const utterance = new SpeechSynthesisUtterance(text);
            utterance.rate = 1;
            utterance.pitch = 1;
            utterance.volume = 1;

            // Try to select a female voice if available
            const voices = window.speechSynthesis.getVoices();
            const femaleVoice = voices.find(voice => voice.name.includes('Female') || voice.name.includes('Google US English'));
            if (femaleVoice) utterance.voice = femaleVoice;

            utterance.onstart = () => setLoading(true);
            utterance.onend = () => setLoading(false);

            window.speechSynthesis.speak(utterance);
        }
    };

    useEffect(() => {
        // Speak the last AI message
        if (messages.length > 0) {
            const lastMsg = messages[messages.length - 1];
            if (lastMsg.type === 'ai') {
                speakText(lastMsg.text);
            }
        }
    }, [messages]);

    useEffect(() => {
        // Simulate network quality fluctuation
        const interval = setInterval(() => {
            setNetworkQuality(Math.floor(Math.random() * 2) + 2); // 2 or 3 bars
        }, 5000);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        let timer;
        if (mode === 'active') {
            timer = setInterval(() => {
                setElapsedTime(prev => prev + 1);
            }, 1000);
        } else {
            setElapsedTime(0);
        }
        return () => clearInterval(timer);
    }, [mode]);

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    useEffect(() => {
        fetchInterviewHistory();
    }, []);

    useEffect(() => {
        applyFilters();
    }, [typeFilter, allInterviews]);

    useEffect(() => {
        // Request camera access for video mode
        if (interviewType === 'Video' && navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
            navigator.mediaDevices.getUserMedia({ video: true })
                .then(stream => {
                    if (videoRef.current) {
                        videoRef.current.srcObject = stream;
                    }
                })
                .catch(err => console.error("Error accessing webcam:", err));
        }
    }, [interviewType]);

    useEffect(() => {
        // Handle fullscreen change events
        const handleFullscreenChange = () => {
            setIsFullscreen(!!document.fullscreenElement);
        };

        document.addEventListener('fullscreenchange', handleFullscreenChange);
        return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
    }, []);

    const fetchInterviewHistory = async () => {
        try {
            const data = await interviewService.getInterviewHistory();
            setAllInterviews(data);
            setFilteredInterviews(data);
        } catch (error) {
            console.error('Error fetching interview history:', error);
        }
    };

    const applyFilters = () => {
        let filtered = [...allInterviews];
        if (typeFilter !== 'All') {
            filtered = filtered.filter(interview => interview.type === typeFilter);
        }
        setFilteredInterviews(filtered);
    };

    const handleStartNew = () => {
        setMode('setup');
        setMessages([]);
        setFeedback(null);
        setJobRole('');
        setSelectedInterview(null);
    };

    const handleSelectInterview = (interview) => {
        setSelectedInterview(interview);
        setMode('view');
    };

    const startInterview = async () => {
        if (!jobRole.trim()) {
            alert('Please enter a job role');
            return;
        }

        // Request fullscreen
        try {
            if (containerRef.current) {
                await containerRef.current.requestFullscreen();
            }
        } catch (err) {
            console.error('Error entering fullscreen:', err);
        }

        setMode('active');
        setMessages([{
            type: 'ai',
            text: `Hello! I'm your AI Interviewer for the ${jobRole} position. Let's start with a simple question: Tell me about yourself and your relevant experience for this role.`
        }]);
    };

    const handleSendMessage = () => {
        if (!currentInput.trim()) return;

        const userMessage = { type: 'user', text: currentInput };
        setMessages(prev => [...prev, userMessage]);

        setLoading(true);
        const allMessages = [...messages, userMessage];

        setTimeout(() => {
            const aiResponse = generateNextQuestion(allMessages.length);
            setMessages(prev => [...prev, { type: 'ai', text: aiResponse }]);
            setLoading(false);
        }, 1500);

        setCurrentInput('');
    };

    const generateNextQuestion = (questionNumber) => {
        const questions = [
            "That's interesting. Can you describe a challenging project you've worked on and how you overcame the obstacles?",
            "Great! Now, let's talk about technical skills. What programming languages and frameworks are you most comfortable with?",
            "Excellent. Can you explain a time when you had to debug a complex issue? What was your approach?",
            "Tell me about your experience working in a team. How do you handle disagreements with team members?",
            "What interests you most about this role, and where do you see yourself in the next 3-5 years?"
        ];

        const index = Math.floor(questionNumber / 2);
        return questions[index] || "Thank you for your responses. Do you have any questions for me?";
    };

    const endInterview = async () => {
        setLoading(true);

        const transcript = messages
            .map(msg => `${msg.type === 'user' ? 'Candidate' : 'Interviewer'}: ${msg.text}`)
            .join('\n\n');

        try {
            const response = await interviewService.submitInterview({
                type: interviewType,
                transcript: transcript,
                jobRole: jobRole
            });

            setFeedback(response);
            setMode('completed');
            await fetchInterviewHistory();

            // Exit fullscreen
            if (document.fullscreenElement) {
                await document.exitFullscreen();
            }
        } catch (error) {
            console.error('Error submitting interview:', error);
            alert('Failed to submit interview. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    const getScoreColor = (score) => {
        if (score >= 80) return 'bg-green-400';
        if (score >= 60) return 'bg-yellow-400';
        return 'bg-red-400';
    };

    return (
        <div ref={containerRef} className={`${mode === 'active' ? 'fixed inset-0 z-50 bg-neo-bg' : 'min-h-screen p-4 md:p-8 bg-neo-bg'
            } font-mono`}>
            {/* Header - Hidden in active mode */}
            {mode !== 'active' && (
                <header className="mb-6">
                    <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tighter leading-none">
                        Interview<span className="text-neo-main">.Sim</span>
                    </h1>
                    <p className="text-lg font-bold text-gray-600 mt-2">
                        Practice with AI-powered interviews
                    </p>
                </header>
            )}

            {/* Fullscreen Warning */}
            {mode === 'active' && !isFullscreen && (
                <div className="fixed top-4 left-1/2 transform -translate-x-1/2 bg-red-500 border-4 border-black px-6 py-3 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] z-50 animate-pulse">
                    <div className="flex items-center gap-3 text-white font-black">
                        <AlertTriangle className="w-6 h-6" />
                        <span>Please stay in fullscreen mode during the interview!</span>
                    </div>
                </div>
            )}

            {/* Split Layout - Hidden in active mode */}
            <div className={mode === 'active' ? 'hidden' : 'grid grid-cols-1 lg:grid-cols-12 gap-6'}>

                {/* LEFT PANEL: Interview History */}
                <div className="lg:col-span-4 bg-white border-4 border-black p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] h-fit lg:sticky lg:top-24">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-2xl font-black uppercase">Battle Logs</h2>
                        <button
                            onClick={handleStartNew}
                            className="bg-neo-main border-2 border-black p-2 font-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] transition-all"
                        >
                            <Plus className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Filter */}
                    <div className="mb-4 flex items-center gap-2">
                        <Filter className="w-4 h-4" />
                        <select
                            value={typeFilter}
                            onChange={(e) => setTypeFilter(e.target.value)}
                            className="flex-1 px-3 py-2 border-2 border-black font-bold text-sm focus:outline-none focus:ring-2 focus:ring-neo-main"
                        >
                            <option>All</option>
                            <option>Chat</option>
                            <option>Video</option>
                        </select>
                    </div>

                    {/* Interview List */}
                    <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2">
                        {filteredInterviews.length > 0 ? (
                            filteredInterviews.map((interview) => (
                                <div
                                    key={interview.id}
                                    onClick={() => handleSelectInterview(interview)}
                                    className={`border-2 border-black p-3 cursor-pointer transition-all hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[-2px] hover:translate-y-[-2px] ${selectedInterview?.id === interview.id
                                        ? 'bg-neo-main shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]'
                                        : 'bg-gray-50'
                                        }`}
                                >
                                    <div className="flex items-center justify-between mb-2">
                                        <div className="flex items-center gap-2">
                                            {interview.type === 'Video' ? (
                                                <Video className="w-4 h-4" />
                                            ) : (
                                                <MessageSquare className="w-4 h-4" />
                                            )}
                                            <span className="font-black text-sm">{interview.type}</span>
                                        </div>
                                        <div className={`${getScoreColor(interview.score)} border border-black px-2 py-0.5 font-black text-xs`}>
                                            {interview.score}
                                        </div>
                                    </div>
                                    <p className="text-xs font-bold text-gray-600">
                                        {new Date(interview.createdAt).toLocaleDateString()}
                                    </p>
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-8 border-2 border-dashed border-gray-300">
                                <p className="font-bold text-gray-400 mb-2">NO BATTLE DATA</p>
                                <button
                                    onClick={handleStartNew}
                                    className="text-sm font-black underline hover:text-neo-main"
                                >
                                    START YOUR FIRST +
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Stats */}
                    {filteredInterviews.length > 0 && (
                        <div className="mt-6 pt-6 border-t-2 border-black space-y-3">
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-bold">Avg Score:</span>
                                <span className="text-xl font-black">
                                    {Math.round(filteredInterviews.reduce((sum, i) => sum + i.score, 0) / filteredInterviews.length)}
                                </span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-bold">Best:</span>
                                <span className="text-xl font-black text-green-600">
                                    {Math.max(...filteredInterviews.map(i => i.score))}
                                </span>
                            </div>
                        </div>
                    )}
                </div>

                {/* RIGHT PANEL: Setup, Active, or Results */}
                <div className="lg:col-span-8">
                    {mode === 'setup' && (
                        /* SETUP MODE */
                        <div className="bg-white border-4 border-black p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
                            <div className="flex items-center gap-3 mb-6">
                                <Play className="w-8 h-8 text-neo-main fill-neo-main" />
                                <h2 className="text-3xl font-black uppercase">Start Interview</h2>
                            </div>

                            <div className="space-y-6">
                                <div>
                                    <label className="block text-xl font-bold mb-2">Job Role / Position *</label>
                                    <input
                                        type="text"
                                        value={jobRole}
                                        onChange={(e) => setJobRole(e.target.value)}
                                        placeholder="e.g., Software Engineer, Data Scientist"
                                        className="w-full px-4 py-3 border-2 border-black font-mono focus:outline-none focus:ring-2 focus:ring-neo-main"
                                    />
                                </div>

                                <div>
                                    <label className="block text-xl font-bold mb-2">Interview Type</label>
                                    <div className="flex gap-4">
                                        <button
                                            onClick={() => setInterviewType('Chat')}
                                            className={`flex-1 px-6 py-4 font-black border-2 border-black flex items-center justify-center gap-2 ${interviewType === 'Chat'
                                                ? 'bg-neo-main shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]'
                                                : 'bg-white hover:bg-gray-100'
                                                }`}
                                        >
                                            <MessageSquare className="w-5 h-5" />
                                            Chat Interview
                                        </button>
                                        <button
                                            onClick={() => setInterviewType('Video')}
                                            className={`flex-1 px-6 py-4 font-black border-2 border-black flex items-center justify-center gap-2 ${interviewType === 'Video'
                                                ? 'bg-neo-main shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]'
                                                : 'bg-white hover:bg-gray-100'
                                                }`}
                                        >
                                            <Video className="w-5 h-5" />
                                            Video Interview
                                        </button>
                                    </div>
                                </div>

                                <button
                                    onClick={startInterview}
                                    className="w-full bg-neo-main border-2 border-black px-6 py-4 font-black text-xl uppercase shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] transition-all"
                                >
                                    <Play className="inline w-6 h-6 mr-2" />
                                    Start Interview
                                </button>
                            </div>
                        </div>
                    )}

                    {mode === 'active' && (
                        /* ACTIVE INTERVIEW */
                        <div className="space-y-6">
                            <div className="bg-white border-4 border-black p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
                                <div className="flex justify-between items-center">
                                    <div>
                                        <h2 className="text-2xl font-black">INTERVIEW IN PROGRESS</h2>
                                        <p className="text-lg font-bold text-gray-600">Position: {jobRole}</p>
                                    </div>
                                    <button
                                        onClick={endInterview}
                                        disabled={loading || messages.length < 4}
                                        className="bg-red-400 border-2 border-black px-4 py-2 font-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {loading ? 'Submitting...' : 'End Interview'}
                                    </button>
                                </div>
                            </div>

                            {interviewType === 'Video' && (
                                <div className="bg-white border-4 border-black p-0 overflow-hidden relative bg-black h-[300px] flex items-center justify-center shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
                                    <video ref={videoRef} autoPlay muted className="w-full h-full object-cover"></video>
                                    <div className="absolute bottom-4 left-4 bg-red-600 text-white px-3 py-1 font-bold animate-pulse">
                                        LIVE
                                    </div>
                                </div>
                            )}

                            {/* Chat */}
                            <div className="bg-white border-4 border-black p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] flex flex-col h-[500px]">
                                <h3 className="text-xl font-black mb-4 border-b-2 border-black pb-2">CONVERSATION</h3>

                                <div className="flex-1 overflow-y-auto space-y-3 p-2 mb-4">
                                    {messages.map((msg, index) => (
                                        <div key={index} className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                                            <div className={`max-w-[80%] p-4 border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] ${msg.type === 'user' ? 'bg-blue-200' : 'bg-white'
                                                }`}>
                                                <span className="font-bold text-xs block mb-1 uppercase">
                                                    {msg.type === 'user' ? 'You' : 'AI Interviewer'}
                                                </span>
                                                <p className="font-medium">{msg.text}</p>
                                            </div>
                                        </div>
                                    ))}
                                    {loading && (
                                        <div className="flex justify-start">
                                            <div className="max-w-[80%] p-4 border-2 border-black bg-gray-100">
                                                <p className="italic animate-pulse">AI is thinking...</p>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                <div className="flex gap-2">
                                    <textarea
                                        value={currentInput}
                                        onChange={(e) => setCurrentInput(e.target.value)}
                                        onKeyPress={handleKeyPress}
                                        placeholder="Type your response here..."
                                        className="flex-1 px-4 py-3 border-2 border-black font-mono resize-none focus:outline-none focus:ring-2 focus:ring-neo-main"
                                        rows="3"
                                        disabled={loading}
                                    />
                                    <button
                                        onClick={handleSendMessage}
                                        disabled={loading || !currentInput.trim()}
                                        className="bg-neo-main border-2 border-black px-6 py-3 font-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        Send
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {mode === 'completed' && feedback && (
                        /* RESULTS */
                        <div className="space-y-6">
                            <div className="bg-white border-4 border-black p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] text-center">
                                <Trophy className="w-16 h-16 mx-auto mb-4 text-yellow-500 fill-yellow-500" />
                                <h2 className="text-3xl font-black mb-4 uppercase">Interview Complete!</h2>
                                <div className={`inline-block px-12 py-6 border-4 border-black text-6xl font-black ${getScoreColor(feedback.score)}`}>
                                    {feedback.score}/100
                                </div>
                            </div>

                            {(() => {
                                const parsedFeedback = typeof feedback.feedback === 'string'
                                    ? JSON.parse(feedback.feedback)
                                    : feedback.feedback;

                                return (
                                    <>
                                        {parsedFeedback.strengths && (
                                            <div className="bg-white border-4 border-black p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
                                                <h3 className="text-2xl font-black mb-4 text-green-600 flex items-center gap-2">
                                                    <TrendingUp className="w-6 h-6" /> Strengths
                                                </h3>
                                                <ul className="space-y-2">
                                                    {parsedFeedback.strengths.map((strength, index) => (
                                                        <li key={index} className="flex items-start">
                                                            <span className="mr-2 font-bold">•</span>
                                                            <span className="font-medium">{strength}</span>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        )}

                                        {parsedFeedback.weaknesses && (
                                            <div className="bg-white border-4 border-black p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
                                                <h3 className="text-2xl font-black mb-4 text-red-600">⚠ Areas for Improvement</h3>
                                                <ul className="space-y-2">
                                                    {parsedFeedback.weaknesses.map((weakness, index) => (
                                                        <li key={index} className="flex items-start">
                                                            <span className="mr-2 font-bold">•</span>
                                                            <span className="font-medium">{weakness}</span>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        )}

                                        {parsedFeedback.recommendations && (
                                            <div className="bg-white border-4 border-black p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
                                                <h3 className="text-2xl font-black mb-4 text-blue-600 flex items-center gap-2">
                                                    <Zap className="w-6 h-6" /> Recommendations
                                                </h3>
                                                <ul className="space-y-2">
                                                    {parsedFeedback.recommendations.map((rec, index) => (
                                                        <li key={index} className="flex items-start">
                                                            <span className="mr-2 font-bold">•</span>
                                                            <span className="font-medium">{rec}</span>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        )}
                                    </>
                                );
                            })()}

                            <div className="flex gap-4">
                                <button
                                    onClick={handleStartNew}
                                    className="flex-1 bg-neo-main border-2 border-black px-6 py-3 font-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] transition-all"
                                >
                                    Start New Interview
                                </button>
                                <button
                                    onClick={() => navigate('/dashboard')}
                                    className="flex-1 bg-gray-200 border-2 border-black px-6 py-3 font-bold hover:bg-gray-300 transition-all"
                                >
                                    Back to Dashboard
                                </button>
                            </div>
                        </div>
                    )}

                    {mode === 'view' && selectedInterview && (
                        /* VIEW SELECTED INTERVIEW */
                        <div className="space-y-6">
                            <div className="bg-white border-4 border-black p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] text-center">
                                <Trophy className="w-16 h-16 mx-auto mb-4 text-yellow-500 fill-yellow-500" />
                                <h2 className="text-3xl font-black mb-4 uppercase">Interview Results</h2>
                                <p className="text-lg font-bold text-gray-600 mb-4">
                                    {selectedInterview.type} Interview - {new Date(selectedInterview.createdAt).toLocaleDateString()}
                                </p>
                                <div className={`inline-block px-12 py-6 border-4 border-black text-6xl font-black ${getScoreColor(selectedInterview.score)}`}>
                                    {selectedInterview.score}/100
                                </div>
                            </div>

                            {(() => {
                                const parsedFeedback = typeof selectedInterview.feedback === 'string'
                                    ? JSON.parse(selectedInterview.feedback)
                                    : selectedInterview.feedback;

                                return (
                                    <>
                                        {parsedFeedback.strengths && (
                                            <div className="bg-white border-4 border-black p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
                                                <h3 className="text-2xl font-black mb-4 text-green-600 flex items-center gap-2">
                                                    <TrendingUp className="w-6 h-6" /> Strengths
                                                </h3>
                                                <ul className="space-y-2">
                                                    {parsedFeedback.strengths.map((strength, index) => (
                                                        <li key={index} className="flex items-start">
                                                            <span className="mr-2 font-bold">•</span>
                                                            <span className="font-medium">{strength}</span>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        )}

                                        {parsedFeedback.weaknesses && (
                                            <div className="bg-white border-4 border-black p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
                                                <h3 className="text-2xl font-black mb-4 text-red-600">⚠ Areas for Improvement</h3>
                                                <ul className="space-y-2">
                                                    {parsedFeedback.weaknesses.map((weakness, index) => (
                                                        <li key={index} className="flex items-start">
                                                            <span className="mr-2 font-bold">•</span>
                                                            <span className="font-medium">{weakness}</span>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        )}

                                        {parsedFeedback.recommendations && (
                                            <div className="bg-white border-4 border-black p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
                                                <h3 className="text-2xl font-black mb-4 text-blue-600 flex items-center gap-2">
                                                    <Zap className="w-6 h-6" /> Recommendations
                                                </h3>
                                                <ul className="space-y-2">
                                                    {parsedFeedback.recommendations.map((rec, index) => (
                                                        <li key={index} className="flex items-start">
                                                            <span className="mr-2 font-bold">•</span>
                                                            <span className="font-medium">{rec}</span>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        )}
                                    </>
                                );
                            })()}

                            <button
                                onClick={handleStartNew}
                                className="w-full bg-neo-main border-2 border-black px-6 py-3 font-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] transition-all"
                            >
                                Start New Interview
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* ACTIVE INTERVIEW - Fullscreen Mode */}
            {mode === 'active' && (
                <div className="fixed inset-0 bg-gray-900 text-white flex flex-col">
                    {/* Top Bar */}
                    <div className="h-16 bg-gray-800 border-b border-gray-700 flex items-center justify-between px-6 z-10">
                        <div className="flex items-center gap-3">
                            <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                            <h2 className="font-bold text-lg tracking-wider">LIVE INTERVIEW: {jobRole}</h2>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-1" title="Network Quality">
                                {[...Array(3)].map((_, i) => (
                                    <div key={i} className={`w-1 bg-white rounded-full ${i < networkQuality ? 'opacity-100' : 'opacity-30'}`} style={{ height: `${(i + 1) * 4}px` }}></div>
                                ))}
                            </div>
                            <div className="bg-red-600 text-white px-3 py-1 rounded font-mono font-bold animate-pulse">
                                {formatTime(elapsedTime)}
                            </div>
                            <div className="bg-gray-700 px-3 py-1 rounded text-sm font-mono border border-gray-600">
                                {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </div>
                            <button onClick={() => setShowSettings(true)} className="p-2 hover:bg-gray-700 rounded-full transition-colors">
                                <Settings className="w-5 h-5 text-gray-400" />
                            </button>
                        </div>
                    </div>

                    {/* Main Content Area */}
                    <div className="flex-1 flex overflow-hidden relative">

                        {/* Main Stage (AI Interviewer) */}
                        <div className={`flex-1 bg-black relative flex items-center justify-center transition-all duration-300 ${showChat ? 'mr-[45vw]' : 'mr-0'} ${layoutMode === 'grid' ? 'p-4 gap-4' : ''}`}>

                            {/* AI View */}
                            <div className={`relative flex flex-col items-center justify-center transition-all duration-300 ${layoutMode === 'grid' ? 'w-1/2 h-full bg-gray-900 border-2 border-gray-700 rounded-lg' : 'w-full h-full'}`}>
                                {/* Audio Visualizer */}
                                <div className="flex items-center justify-center gap-2 mb-8 h-20">
                                    {audioLevels.map((level, i) => (
                                        <div
                                            key={i}
                                            className="w-4 bg-neo-main rounded-full transition-all duration-100"
                                            style={{ height: `${level}%` }}
                                        ></div>
                                    ))}
                                </div>

                                <div className={`w-32 h-32 rounded-full border-4 border-neo-main flex items-center justify-center mb-6 transition-all duration-300 ${loading ? 'scale-110 shadow-[0_0_30px_rgba(255,255,0,0.5)]' : 'scale-100'}`}>
                                    <Zap className={`w-16 h-16 text-neo-main ${loading ? 'animate-pulse' : ''}`} />
                                </div>
                                <h3 className="text-2xl font-black tracking-widest text-gray-400">AI INTERVIEWER</h3>
                                {loading && <p className="text-neo-main font-mono mt-2 animate-pulse">Speaking...</p>}

                                {/* Captions Overlay */}
                                {showCaptions && loading && (
                                    <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 bg-black/70 px-6 py-3 rounded-lg text-white text-lg font-medium max-w-2xl text-center backdrop-blur-sm border border-white/20">
                                        {messages[messages.length - 1]?.text}
                                    </div>
                                )}
                            </div>

                            {/* User Video (PiP or Grid) */}
                            {interviewType === 'Video' && (
                                <div className={`${layoutMode === 'grid'
                                    ? 'w-1/2 h-full bg-gray-800 border-2 border-white rounded-lg relative overflow-hidden'
                                    : 'absolute bottom-6 right-6 w-64 h-48 bg-gray-800 border-2 border-white shadow-lg overflow-hidden rounded-lg z-20 transition-all hover:scale-105'
                                    }`}>
                                    {isVideoOn ? (
                                        <video ref={videoRef} autoPlay muted className="w-full h-full object-cover transform scale-x-[-1]"></video>
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center bg-gray-700">
                                            <VideoOff className="w-12 h-12 text-gray-500" />
                                        </div>
                                    )}
                                    <div className="absolute bottom-2 left-2 text-xs font-bold bg-black/50 px-2 py-1 rounded backdrop-blur-md">YOU</div>
                                    {!isMicOn && (
                                        <div className="absolute top-2 right-2 bg-red-500 p-1 rounded-full">
                                            <MicOff className="w-3 h-3 text-white" />
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Chat Side Panel - Dark Theme */}
                        <div className={`absolute top-0 right-0 bottom-0 w-[45vw] bg-gray-900 border-l-4 border-gray-700 transform transition-transform duration-300 z-30 flex flex-col ${showChat ? 'translate-x-0' : 'translate-x-full'}`}>
                            <div className="p-4 border-b border-gray-700 bg-gray-800 flex justify-between items-center">
                                <h3 className="font-black text-white text-xl uppercase tracking-wider">Interview Transcript</h3>
                                <button onClick={() => setShowChat(false)} className="lg:hidden">
                                    <Minimize2 className="w-5 h-5 text-white" />
                                </button>
                            </div>

                            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-900 text-white scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-900">
                                {messages.map((msg, index) => (
                                    <div key={index} className={`flex flex-col ${msg.type === 'user' ? 'items-end' : 'items-start'}`}>
                                        <div className={`max-w-[90%] p-4 rounded-lg border border-gray-700 shadow-lg ${msg.type === 'user' ? 'bg-blue-900/30 border-blue-800' : 'bg-gray-800 border-gray-700'
                                            }`}>
                                            <span className={`text-[10px] font-black uppercase mb-1 block ${msg.type === 'user' ? 'text-blue-400' : 'text-neo-main'}`}>
                                                {msg.type === 'user' ? 'You' : 'AI Interviewer'}
                                            </span>
                                            <p className="text-sm font-medium leading-relaxed text-gray-200">{msg.text}</p>
                                        </div>
                                    </div>
                                ))}
                                {loading && (
                                    <div className="flex justify-start">
                                        <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
                                            <div className="flex gap-1">
                                                <div className="w-2 h-2 bg-neo-main rounded-full animate-bounce"></div>
                                                <div className="w-2 h-2 bg-neo-main rounded-full animate-bounce delay-100"></div>
                                                <div className="w-2 h-2 bg-neo-main rounded-full animate-bounce delay-200"></div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className="p-4 border-t border-gray-700 bg-gray-800">
                                <div className="flex gap-2 items-end">
                                    <button
                                        onClick={toggleListening}
                                        className={`p-3 rounded-full border transition-all ${isListening ? 'bg-red-500 border-red-600 animate-pulse text-white' : 'bg-gray-700 border-gray-600 text-gray-300 hover:bg-gray-600'}`}
                                        title="Voice Input"
                                    >
                                        {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                                    </button>
                                    <textarea
                                        value={currentInput}
                                        onChange={(e) => setCurrentInput(e.target.value)}
                                        onKeyPress={handleKeyPress}
                                        placeholder={isListening ? "Listening..." : "Type response..."}
                                        className="flex-1 px-4 py-3 bg-gray-900 border border-gray-600 rounded font-mono text-sm resize-none focus:outline-none focus:ring-2 focus:ring-neo-main text-white placeholder-gray-500"
                                        rows="2"
                                        disabled={loading}
                                    />
                                    <button
                                        onClick={handleSendMessage}
                                        disabled={loading || !currentInput.trim()}
                                        className="bg-neo-main text-black font-black px-4 py-3 rounded hover:bg-yellow-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        Send
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Bottom Control Bar */}
                    <div className="h-20 bg-gray-800 border-t border-gray-700 flex items-center justify-center gap-4 z-40 relative px-4">
                        <div className="flex items-center gap-2 mr-auto">
                            <button
                                onClick={() => setLayoutMode(layoutMode === 'speaker' ? 'grid' : 'speaker')}
                                className="p-3 rounded-full hover:bg-gray-700 text-gray-300 transition-colors"
                                title="Toggle Layout"
                            >
                                {layoutMode === 'speaker' ? <Grid className="w-5 h-5" /> : <Layout className="w-5 h-5" />}
                            </button>
                            <button
                                onClick={() => setShowCaptions(!showCaptions)}
                                className={`p-3 rounded-full hover:bg-gray-700 transition-colors ${showCaptions ? 'text-neo-main' : 'text-gray-300'}`}
                                title="Toggle Captions"
                            >
                                <Captions className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="flex items-center gap-4">
                            <button
                                onClick={() => setIsMicOn(!isMicOn)}
                                className={`p-4 rounded-full border-2 transition-all ${isMicOn ? 'bg-gray-700 border-gray-600 hover:bg-gray-600' : 'bg-red-500 border-red-600 hover:bg-red-600'}`}
                            >
                                {isMicOn ? <Mic className="w-6 h-6" /> : <MicOff className="w-6 h-6" />}
                            </button>

                            {interviewType === 'Video' && (
                                <button
                                    onClick={() => setIsVideoOn(!isVideoOn)}
                                >
                                    {isVideoOn ? <Video className="w-6 h-6" /> : <VideoOff className="w-6 h-6" />}
                                </button>
                            )}

                            <button
                                onClick={endInterview}
                                className="px-8 py-3 bg-red-600 hover:bg-red-700 text-white font-black rounded-full border-2 border-red-800 flex items-center gap-2 transition-all mx-4 shadow-lg hover:shadow-red-900/50"
                            >
                                <PhoneOff className="w-5 h-5" />
                                END
                            </button>
                        </div>

                        <div className="ml-auto">
                            <button
                                onClick={() => setShowChat(!showChat)}
                                className={`p-3 rounded-full border-2 transition-all ${showChat ? 'bg-neo-main border-yellow-600 text-black' : 'bg-gray-700 border-gray-600 text-white hover:bg-gray-600'}`}
                            >
                                <MessageSquare className="w-5 h-5" />
                            </button>
                        </div>
                    </div>

                    {/* Settings Modal (Simulated) */}
                    {showSettings && (
                        <div className="absolute inset-0 bg-black/80 z-50 flex items-center justify-center font-sans">
                            <div className="bg-gray-800 border-2 border-gray-600 rounded-lg w-[500px] shadow-2xl">
                                <div className="p-4 border-b border-gray-700 flex justify-between items-center">
                                    <h3 className="font-bold text-lg">Settings</h3>
                                    <button onClick={() => setShowSettings(false)} className="text-gray-400 hover:text-white">✕</button>
                                </div>
                                <div className="p-6 space-y-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-400 mb-2">Microphone</label>
                                        <select className="w-full bg-gray-900 border border-gray-700 rounded p-2 text-white">
                                            <option>Default - Internal Microphone</option>
                                            <option>External Microphone (USB)</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-400 mb-2">Camera</label>
                                        <select className="w-full bg-gray-900 border border-gray-700 rounded p-2 text-white">
                                            <option>Default - FaceTime HD Camera</option>
                                            <option>External Webcam</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-400 mb-2">Speaker</label>
                                        <select className="w-full bg-gray-900 border border-gray-700 rounded p-2 text-white">
                                            <option>Default - Internal Speakers</option>
                                            <option>Headphones</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="p-4 border-t border-gray-700 flex justify-end">
                                    <button
                                        onClick={() => setShowSettings(false)}
                                        className="bg-neo-main text-black font-bold px-4 py-2 rounded hover:bg-yellow-400"
                                    >
                                        Done
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default InterviewSimulator;
