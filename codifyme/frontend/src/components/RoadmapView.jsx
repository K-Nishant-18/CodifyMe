import React, { useState } from 'react';

const RoadmapView = () => {
    const [roadmap, setRoadmap] = useState([
        {
            day: 1,
            topic: "Introduction & Setup",
            tasks: ["Install IDE", "Setup Environment", "Hello World"],
            completed: true
        },
        {
            day: 2,
            topic: "Core Concepts",
            tasks: ["Variables", "Loops", "Functions"],
            completed: false
        },
        {
            day: 3,
            topic: "Object Oriented Programming",
            tasks: ["Classes", "Objects", "Inheritance"],
            completed: false
        }
    ]);

    return (
        <div className="min-h-screen p-8 bg-neo-bg">
            <header className="flex justify-between items-center mb-12">
                <h1 className="text-4xl font-black uppercase tracking-tighter">My Roadmap</h1>
                <button className="neo-btn bg-neo-main">Back to Dashboard</button>
            </header>

            <div className="max-w-4xl mx-auto">
                <div className="neo-card mb-8 bg-yellow-200">
                    <h2 className="text-3xl font-black mb-2">Java Backend Developer</h2>
                    <p className="font-bold">Target Date: Dec 30, 2025</p>
                    <div className="w-full bg-white border-2 border-black h-6 mt-4">
                        <div className="bg-neo-accent h-full" style={{ width: '33%' }}></div>
                    </div>
                </div>

                <div className="space-y-6">
                    {roadmap.map((day, index) => (
                        <div key={index} className={`neo-card ${day.completed ? 'opacity-50' : ''}`}>
                            <div className="flex justify-between items-start">
                                <div>
                                    <h3 className="text-2xl font-bold mb-2">Day {day.day}: {day.topic}</h3>
                                    <ul className="space-y-2 ml-4">
                                        {day.tasks.map((task, tIndex) => (
                                            <li key={tIndex} className="flex items-center gap-3">
                                                <input
                                                    type="checkbox"
                                                    checked={day.completed}
                                                    readOnly
                                                    className="w-5 h-5 border-2 border-black accent-neo-main"
                                                />
                                                <span className="text-lg font-medium">{task}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                                {day.completed && (
                                    <span className="bg-green-400 border-2 border-black px-3 py-1 font-bold transform rotate-3">
                                        DONE
                                    </span>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default RoadmapView;
