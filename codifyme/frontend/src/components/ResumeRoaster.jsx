import { useState, useRef } from 'react';
import { Upload, FileText, AlertTriangle, CheckCircle, XCircle, Loader, Scan } from 'lucide-react';
import api from '../services/api';

const ResumeRoaster = () => {
    const [file, setFile] = useState(null);
    const [isDragging, setIsDragging] = useState(false);
    const [isScanning, setIsScanning] = useState(false);
    const [result, setResult] = useState(null);
    const [error, setError] = useState('');
    const fileInputRef = useRef(null);

    const handleDragOver = (e) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = () => {
        setIsDragging(false);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setIsDragging(false);
        const droppedFile = e.dataTransfer.files[0];
        validateAndSetFile(droppedFile);
    };

    const handleFileSelect = (e) => {
        const selectedFile = e.target.files[0];
        validateAndSetFile(selectedFile);
    };

    const validateAndSetFile = (file) => {
        if (file && (file.type === 'application/pdf' || file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document')) {
            setFile(file);
            setError('');
            setResult(null);
        } else {
            setError('Please upload a PDF or DOCX file.');
        }
    };

    const handleRoast = async () => {
        if (!file) return;

        setIsScanning(true);
        setError('');

        const formData = new FormData();
        formData.append('file', file);

        try {
            // Simulate scanning delay for effect
            await new Promise(resolve => setTimeout(resolve, 2000));

            const response = await api.post('/resume/analyze', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            setResult(response.data);
        } catch (err) {
            setError('Failed to analyze resume. Please try again.');
            console.error(err);
        } finally {
            setIsScanning(false);
        }
    };

    const reset = () => {
        setFile(null);
        setResult(null);
        setError('');
    };

    return (
        <div className="bg-white border-4 border-black p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] relative overflow-hidden">
            <h2 className="text-3xl font-black mb-6 uppercase flex items-center gap-3">
                <Scan className="w-8 h-8" />
                AI Resume Roaster
            </h2>

            {/* Scanner Line Animation */}
            {isScanning && (
                <div className="absolute inset-0 pointer-events-none z-20">
                    <div className="w-full h-1 bg-red-500 shadow-[0_0_15px_rgba(239,68,68,0.8)] animate-[scan_2s_ease-in-out_infinite]"></div>
                </div>
            )}

            {!result ? (
                <div className="space-y-6">
                    <div
                        className={`border-4 border-dashed p-8 text-center transition-all cursor-pointer relative ${isDragging ? 'border-neo-main bg-green-50 scale-[1.02]' : 'border-gray-300 hover:border-black'
                            } ${file ? 'bg-gray-50 border-black' : ''}`}
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onDrop={handleDrop}
                        onClick={() => fileInputRef.current.click()}
                    >
                        <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleFileSelect}
                            className="hidden"
                            accept=".pdf,.docx"
                        />

                        {file ? (
                            <div className="flex flex-col items-center">
                                <FileText className="w-16 h-16 mb-4 text-neo-black" />
                                <p className="font-bold text-xl">{file.name}</p>
                                <p className="text-gray-500">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                                <button
                                    onClick={(e) => { e.stopPropagation(); reset(); }}
                                    className="mt-4 text-red-600 font-bold hover:underline"
                                >
                                    Remove
                                </button>
                            </div>
                        ) : (
                            <div className="flex flex-col items-center">
                                <Upload className={`w-16 h-16 mb-4 ${isDragging ? 'text-neo-main animate-bounce' : 'text-gray-400'}`} />
                                <p className="font-bold text-xl mb-2">Drop your resume here</p>
                                <p className="text-gray-500">or click to browse (PDF/DOCX)</p>
                            </div>
                        )}
                    </div>

                    {error && (
                        <div className="bg-red-100 border-2 border-red-500 text-red-700 p-3 font-bold flex items-center gap-2">
                            <AlertTriangle className="w-5 h-5" />
                            {error}
                        </div>
                    )}

                    <button
                        onClick={handleRoast}
                        disabled={!file || isScanning}
                        className={`w-full py-4 font-black text-xl uppercase border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all ${!file || isScanning
                                ? 'bg-gray-200 text-gray-400 cursor-not-allowed shadow-none translate-x-[2px] translate-y-[2px]'
                                : 'bg-neo-main hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px]'
                            }`}
                    >
                        {isScanning ? (
                            <span className="flex items-center justify-center gap-2">
                                <Loader className="w-6 h-6 animate-spin" />
                                Roasting...
                            </span>
                        ) : 'Roast My Resume 🔥'}
                    </button>
                </div>
            ) : (
                <div className="animate-fade-in-up">
                    {/* Result Header with Stamp */}
                    <div className="flex justify-between items-start mb-8 relative">
                        <div>
                            <p className="text-gray-500 font-bold uppercase tracking-widest mb-1">ATS Compatibility Score</p>
                            <div className="flex items-end gap-2">
                                <span className={`text-6xl font-black ${result.atsScore >= 75 ? 'text-green-600' :
                                        result.atsScore >= 50 ? 'text-yellow-600' : 'text-red-600'
                                    }`}>
                                    {result.atsScore}
                                </span>
                                <span className="text-2xl font-bold text-gray-400 mb-2">/100</span>
                            </div>
                        </div>

                        {/* Stamp Animation */}
                        <div className={`absolute top-0 right-0 border-4 border-double p-2 transform rotate-[-15deg] opacity-0 animate-[stamp_0.5s_ease-out_forwards_0.5s] ${result.status === 'SHORTLISTED' ? 'border-green-600 text-green-600' : 'border-red-600 text-red-600'
                            }`}>
                            <span className="text-2xl font-black uppercase tracking-widest px-2">
                                {result.status}
                            </span>
                        </div>
                    </div>

                    {/* Feedback Section */}
                    <div className="space-y-6">
                        <div className="bg-gray-50 border-2 border-black p-4">
                            <h3 className="font-black uppercase mb-3 flex items-center gap-2">
                                <AlertTriangle className="w-5 h-5" />
                                Critical Feedback
                            </h3>
                            <ul className="space-y-3">
                                {result.feedback.map((item, index) => (
                                    <li key={index} className="flex items-start gap-3">
                                        <XCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                                        <span className="font-bold">{item}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div className="bg-neo-main/20 border-2 border-black p-4">
                            <h3 className="font-black uppercase mb-2">AI Summary</h3>
                            <p className="font-medium italic">"{result.summary}"</p>
                        </div>

                        <button
                            onClick={reset}
                            className="w-full bg-white border-2 border-black py-3 font-black uppercase hover:bg-gray-50 transition-colors"
                        >
                            Upload Another Resume
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ResumeRoaster;
