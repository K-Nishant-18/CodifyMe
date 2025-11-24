import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import interviewService from '../services/interviewService';

const InterviewSimulator = () => {
    const [isRecording, setIsRecording] = useState(false);
    const [messages, setMessages] = useState([]);
    const [currentInput, setCurrentInput] = useState('');
    const [interviewMode, setInterviewMode] = useState('setup'); // setup, active, completed
    const [jobRole, setJobRole] = useState('');
    const [interviewType, setInterviewType] = useState('Chat');
    const [loading, setLoading] = useState(false);
    const [feedback, setFeedback] = useState(null);
    const videoRef = useRef(null);
    const navigate = useNavigate();

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

    const startInterview = () => {
        if (!jobRole.trim()) {
            alert('Please enter a job role');
            return;
        }

        setInterviewMode('active');
        setMessages([
            {
                type: 'ai',
                text: `Hello! I'm your AI Interviewer for the ${jobRole} position. Let's start with a simple question: Tell me about yourself and your relevant experience for this role.`
            }
        ]);
    };

    const handleSendMessage = () => {
        if (!currentInput.trim()) return;

        // Add user message
        const userMessage = { type: 'user', text: currentInput };
        setMessages(prev => [...prev, userMessage]);

        // Simulate AI thinking
        setLoading(true);
        const allMessages = [...messages, userMessage];

        // Generate next question based on conversation
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

        // Build transcript from messages
        const transcript = messages
            .map(msg => `${msg.type === 'user' ? 'Candidate' : 'Interviewer'}: ${msg.text}`)
            .join('\n\n');

        try {
            // Submit interview to backend for AI feedback
            const response = await interviewService.submitInterview({
                type: interviewType,
                transcript: transcript,
                jobRole: jobRole
            });

            setFeedback(response);
            setInterviewMode('completed');
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

    // Setup Screen
    if (interviewMode === 'setup') {
        return (
            <div className="min-h-screen p-8 bg-neo-bg flex items-center justify-center">
                <div className="w-full max-w-2xl bg-white border-4 border-black shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] p-8">
                    <h1 className="text-4xl font-black uppercase mb-8 text-center">AI Interview Simulator</h1>

                    <div className="space-y-6">
                        <div>
                            <label className="block text-xl font-bold mb-2">Job Role / Position</label>
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
                                    className={`flex-1 px-6 py-3 font-black border-2 border-black ${interviewType === 'Chat'
                                            ? 'bg-neo-main shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]'
                                            : 'bg-white hover:bg-gray-100'
                                        }`}
                                >
                                    Chat Interview
                                </button>
                                <button
                                    onClick={() => setInterviewType('Video')}
                                    className={`flex-1 px-6 py-3 font-black border-2 border-black ${interviewType === 'Video'
                                            ? 'bg-neo-main shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]'
                                            : 'bg-white hover:bg-gray-100'
                                        }`}
                                >
                                    Video Interview
                                </button>
                            </div>
                        </div>

                        <button
                            onClick={startInterview}
                            className="w-full bg-neo-main border-2 border-black px-6 py-4 font-black text-xl uppercase shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] transition-all"
                        >
                            Start Interview
                        </button>

                        <button
                            onClick={() => navigate('/dashboard')}
                            className="w-full bg-gray-200 border-2 border-black px-6 py-3 font-bold hover:bg-gray-300 transition-all"
                        >
                            Back to Dashboard
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    // Completed Screen with Feedback
    if (interviewMode === 'completed' && feedback) {
        const parsedFeedback = typeof feedback.feedback === 'string'
            ? JSON.parse(feedback.feedback)
            : feedback.feedback;

        return (
            <div className="min-h-screen p-8 bg-neo-bg">
                <div className="max-w-4xl mx-auto">
                    <h1 className="text-4xl font-black uppercase mb-8 text-center">Interview Complete!</h1>

                    <div className="space-y-6">
                        {/* Score */}
                        <div className="bg-white border-4 border-black p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] text-center">
                            <h2 className="text-2xl font-black mb-4">Your Score</h2>
                            <div className={`inline-block px-12 py-6 border-4 border-black text-6xl font-black ${feedback.score >= 80 ? 'bg-green-400' :
                                    feedback.score >= 60 ? 'bg-yellow-400' : 'bg-red-400'
                                }`}>
                                {feedback.score}/100
                            </div>
                        </div>

                        {/* Strengths */}
                        {parsedFeedback.strengths && (
                            <div className="bg-white border-4 border-black p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
                                <h3 className="text-2xl font-black mb-4 text-green-600">✓ Strengths</h3>
                                <ul className="space-y-2">
                                    {parsedFeedback.strengths.map((strength, index) => (
                                        <li key={index} className="flex items-start">
                                            <span className="mr-2 font-bold">•</span>
                                            <span>{strength}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        {/* Weaknesses */}
                        {parsedFeedback.weaknesses && (
                            <div className="bg-white border-4 border-black p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
                                <h3 className="text-2xl font-black mb-4 text-red-600">⚠ Areas for Improvement</h3>
                                <ul className="space-y-2">
                                    {parsedFeedback.weaknesses.map((weakness, index) => (
                                        <li key={index} className="flex items-start">
                                            <span className="mr-2 font-bold">•</span>
                                            <span>{weakness}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        {/* Recommendations */}
                        {parsedFeedback.recommendations && (
                            <div className="bg-white border-4 border-black p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
                                <h3 className="text-2xl font-black mb-4 text-blue-600">💡 Recommendations</h3>
                                <ul className="space-y-2">
                                    {parsedFeedback.recommendations.map((rec, index) => (
                                        <li key={index} className="flex items-start">
                                            <span className="mr-2 font-bold">•</span>
                                            <span>{rec}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        {/* Overall Feedback */}
                        {parsedFeedback.overallFeedback && (
                            <div className="bg-white border-4 border-black p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
                                <h3 className="text-2xl font-black mb-4">Overall Feedback</h3>
                                <p className="text-lg">{parsedFeedback.overallFeedback}</p>
                            </div>
                        )}

                        <div className="flex gap-4">
                            <button
                                onClick={() => {
                                    setInterviewMode('setup');
                                    setMessages([]);
                                    setFeedback(null);
                                    setJobRole('');
                                }}
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
                </div>
            </div>
        );
    }

    // Active Interview Screen
    return (
        <div className="min-h-screen p-8 bg-neo-bg flex flex-col">
            <header className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-4xl font-black uppercase tracking-tighter">AI Interview</h1>
                    <p className="text-lg font-bold">Position: {jobRole}</p>
                </div>
                <button
                    onClick={endInterview}
                    disabled={loading || messages.length < 4}
                    className="bg-red-400 border-2 border-black px-6 py-3 font-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {loading ? 'Submitting...' : 'End Interview'}
                </button>
            </header>

            <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Video Feed (if Video mode) */}
                {interviewType === 'Video' && (
                    <div className="flex flex-col gap-4">
                        <div className="bg-white border-4 border-black p-0 overflow-hidden relative bg-black h-[400px] flex items-center justify-center shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
                            <video ref={videoRef} autoPlay muted className="w-full h-full object-cover"></video>
                            <div className="absolute bottom-4 left-4 bg-red-600 text-white px-3 py-1 font-bold">
                                LIVE
                            </div>
                        </div>
                    </div>
                )}

                {/* Chat / Transcript */}
                <div className={`bg-white border-4 border-black p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] flex flex-col h-[600px] ${interviewType === 'Chat' ? 'lg:col-span-2' : ''}`}>
                    <h2 className="text-2xl font-black mb-4 border-b-2 border-black pb-2 uppercase">Conversation</h2>

                    {/* Messages */}
                    <div className="flex-1 overflow-y-auto space-y-4 p-2 mb-4">
                        {messages.map((msg, index) => (
                            <div key={index} className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                                <div className={`max-w-[80%] p-4 border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] ${msg.type === 'user' ? 'bg-blue-200' : 'bg-white'}`}>
                                    <span className="font-bold text-xs block mb-1 uppercase">{msg.type === 'user' ? 'You' : 'AI Interviewer'}</span>
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

                    {/* Input */}
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
        </div>
    );
};

export default InterviewSimulator;
