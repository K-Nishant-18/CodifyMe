import { useState, useEffect } from 'react';
import { User, Briefcase, Calendar, FileText, Award, Edit2, Save, X } from 'lucide-react';
import api from '../services/api';

const Profile = () => {
    const [profile, setProfile] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [formData, setFormData] = useState({
        targetCompany: '',
        targetRole: '',
        deadline: '',
        jobDescription: '',
        experienceLevel: 'BEGINNER'
    });

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            const response = await api.get('/profile');
            setProfile(response.data);
            setFormData({
                targetCompany: response.data.targetCompany || '',
                targetRole: response.data.targetRole || '',
                deadline: response.data.deadline || '',
                jobDescription: response.data.jobDescription || '',
                experienceLevel: response.data.experienceLevel || 'BEGINNER'
            });
            setLoading(false);
        } catch (err) {
            setError('Failed to load profile');
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSave = async () => {
        try {
            await api.put('/profile', formData);
            await fetchProfile();
            setIsEditing(false);
            setError('');
        } catch (err) {
            setError('Failed to update profile');
        }
    };

    const handleCancel = () => {
        setIsEditing(false);
        // Reset form to original profile data
        setFormData({
            targetCompany: profile.targetCompany || '',
            targetRole: profile.targetRole || '',
            deadline: profile.deadline || '',
            jobDescription: profile.jobDescription || '',
            experienceLevel: profile.experienceLevel || 'BEGINNER'
        });
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-neo-bg flex items-center justify-center">
                <div className="text-2xl font-black">LOADING PROFILE...</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-neo-bg p-8">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="bg-white border-4 border-neo-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-8 mb-6">
                    <div className="flex justify-between items-start">
                        <div>
                            <h1 className="text-4xl font-black uppercase mb-2">Your Profile</h1>
                            <p className="text-gray-600 font-bold">Manage your account and career information</p>
                        </div>
                        {!isEditing ? (
                            <button
                                onClick={() => setIsEditing(true)}
                                className="bg-neo-green border-2 border-neo-black px-6 py-3 font-black uppercase shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] transition-all flex items-center gap-2"
                            >
                                <Edit2 className="w-5 h-5" />
                                Edit Profile
                            </button>
                        ) : (
                            <div className="flex gap-3">
                                <button
                                    onClick={handleSave}
                                    className="bg-neo-green border-2 border-neo-black px-6 py-3 font-black uppercase shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] transition-all flex items-center gap-2"
                                >
                                    <Save className="w-5 h-5" />
                                    Save
                                </button>
                                <button
                                    onClick={handleCancel}
                                    className="bg-white border-2 border-neo-black px-6 py-3 font-black uppercase shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] transition-all flex items-center gap-2"
                                >
                                    <X className="w-5 h-5" />
                                    Cancel
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                {error && (
                    <div className="bg-red-100 border-2 border-red-500 text-red-700 p-4 mb-6 font-bold">
                        {error}
                    </div>
                )}

                {/* Basic Info */}
                <div className="bg-white border-4 border-neo-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-8 mb-6">
                    <h2 className="text-2xl font-black uppercase mb-6 pb-3 border-b-2 border-neo-black">Basic Information</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-black uppercase mb-2 text-gray-600">Full Name</label>
                            <div className="flex items-center gap-3 p-3 border-2 border-neo-black bg-gray-50">
                                <User className="w-5 h-5 text-gray-400" />
                                <span className="font-bold">{profile?.fullName || 'Not set'}</span>
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-black uppercase mb-2 text-gray-600">Email</label>
                            <div className="flex items-center gap-3 p-3 border-2 border-neo-black bg-gray-50">
                                <span className="font-bold">{profile?.email || 'Not set'}</span>
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-black uppercase mb-2 text-gray-600">CrackScore</label>
                            <div className="flex items-center gap-3 p-3 border-2 border-neo-black bg-neo-green">
                                <Award className="w-5 h-5" />
                                <span className="font-black text-xl">{profile?.crackScore || 0}</span>
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-black uppercase mb-2 text-gray-600">Member Since</label>
                            <div className="flex items-center gap-3 p-3 border-2 border-neo-black bg-gray-50">
                                <Calendar className="w-5 h-5 text-gray-400" />
                                <span className="font-bold">{profile?.createdAt ? new Date(profile.createdAt).toLocaleDateString() : 'Unknown'}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Career Goals */}
                <div className="bg-white border-4 border-neo-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-8">
                    <h2 className="text-2xl font-black uppercase mb-6 pb-3 border-b-2 border-neo-black">Career Goals</h2>
                    <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-black uppercase mb-2 text-gray-600">Target Company</label>
                                {!isEditing ? (
                                    <div className="flex items-center gap-3 p-3 border-2 border-neo-black bg-gray-50">
                                        <Briefcase className="w-5 h-5 text-gray-400" />
                                        <span className="font-bold">{profile?.targetCompany || 'Not set'}</span>
                                    </div>
                                ) : (
                                    <input
                                        type="text"
                                        name="targetCompany"
                                        value={formData.targetCompany}
                                        onChange={handleChange}
                                        className="w-full p-3 border-2 border-neo-black font-bold focus:outline-none focus:ring-2 focus:ring-neo-green"
                                        placeholder="e.g. Google, Amazon"
                                    />
                                )}
                            </div>
                            <div>
                                <label className="block text-sm font-black uppercase mb-2 text-gray-600">Target Role</label>
                                {!isEditing ? (
                                    <div className="flex items-center gap-3 p-3 border-2 border-neo-black bg-gray-50">
                                        <span className="font-bold">{profile?.targetRole || 'Not set'}</span>
                                    </div>
                                ) : (
                                    <input
                                        type="text"
                                        name="targetRole"
                                        value={formData.targetRole}
                                        onChange={handleChange}
                                        className="w-full p-3 border-2 border-neo-black font-bold focus:outline-none focus:ring-2 focus:ring-neo-green"
                                        placeholder="e.g. SDE I, Frontend Engineer"
                                    />
                                )}
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-black uppercase mb-2 text-gray-600">Deadline</label>
                                {!isEditing ? (
                                    <div className="flex items-center gap-3 p-3 border-2 border-neo-black bg-gray-50">
                                        <Calendar className="w-5 h-5 text-gray-400" />
                                        <span className="font-bold">{profile?.deadline || 'Not set'}</span>
                                    </div>
                                ) : (
                                    <input
                                        type="date"
                                        name="deadline"
                                        value={formData.deadline}
                                        onChange={handleChange}
                                        className="w-full p-3 border-2 border-neo-black font-bold focus:outline-none focus:ring-2 focus:ring-neo-green"
                                    />
                                )}
                            </div>
                            <div>
                                <label className="block text-sm font-black uppercase mb-2 text-gray-600">Experience Level</label>
                                {!isEditing ? (
                                    <div className="flex items-center gap-3 p-3 border-2 border-neo-black bg-gray-50">
                                        <span className="font-bold">{profile?.experienceLevel || 'Not set'}</span>
                                    </div>
                                ) : (
                                    <select
                                        name="experienceLevel"
                                        value={formData.experienceLevel}
                                        onChange={handleChange}
                                        className="w-full p-3 border-2 border-neo-black font-bold focus:outline-none focus:ring-2 focus:ring-neo-green"
                                    >
                                        <option value="BEGINNER">Beginner</option>
                                        <option value="INTERMEDIATE">Intermediate</option>
                                        <option value="PRO">Pro</option>
                                    </select>
                                )}
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-black uppercase mb-2 text-gray-600">Job Description</label>
                            {!isEditing ? (
                                <div className="p-3 border-2 border-neo-black bg-gray-50">
                                    <FileText className="w-5 h-5 text-gray-400 mb-2" />
                                    <p className="font-mono text-sm whitespace-pre-wrap">{profile?.jobDescription || 'Not set'}</p>
                                </div>
                            ) : (
                                <textarea
                                    name="jobDescription"
                                    value={formData.jobDescription}
                                    onChange={handleChange}
                                    className="w-full p-3 border-2 border-neo-black font-mono text-sm h-32 resize-none focus:outline-none focus:ring-2 focus:ring-neo-green"
                                    placeholder="Paste the job description you're targeting..."
                                />
                            )}
                        </div>

                        {profile?.resumePath && (
                            <div>
                                <label className="block text-sm font-black uppercase mb-2 text-gray-600">Resume</label>
                                <div className="p-3 border-2 border-neo-black bg-gray-50 flex items-center justify-between">
                                    <span className="font-bold">{profile.resumePath.split('/').pop()}</span>
                                    <a
                                        href={`/uploads/${profile.resumePath}`}
                                        download
                                        className="bg-neo-black text-neo-white px-4 py-2 font-bold uppercase text-sm border-2 border-neo-black hover:bg-gray-800 transition-colors"
                                    >
                                        Download
                                    </a>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;
