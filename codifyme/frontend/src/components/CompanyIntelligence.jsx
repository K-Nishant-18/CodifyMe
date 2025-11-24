import { useState, useEffect } from 'react';
import companyService from '../services/companyService';

function CompanyIntelligence() {
    const [companies, setCompanies] = useState([]);
    const [filteredCompanies, setFilteredCompanies] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedDifficulty, setSelectedDifficulty] = useState('All');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchCompanies();
    }, []);

    useEffect(() => {
        filterCompanies();
    }, [searchTerm, selectedDifficulty, companies]);

    const fetchCompanies = async () => {
        try {
            const data = await companyService.getAllCompanies();
            setCompanies(data);
            setFilteredCompanies(data);
        } catch (error) {
            console.error('Error fetching companies:', error);
        } finally {
            setLoading(false);
        }
    };

    const filterCompanies = () => {
        let filtered = companies;

        if (searchTerm) {
            filtered = filtered.filter((company) =>
                company.name.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        if (selectedDifficulty !== 'All') {
            filtered = filtered.filter((company) => company.difficultyLevel === selectedDifficulty);
        }

        setFilteredCompanies(filtered);
    };

    const getDifficultyColor = (level) => {
        switch (level) {
            case 'Easy':
                return 'bg-green-400';
            case 'Medium':
                return 'bg-yellow-400';
            case 'Hard':
                return 'bg-red-400';
            default:
                return 'bg-gray-400';
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-neo-bg p-8">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center text-2xl font-black">Loading companies...</div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-neo-bg p-8">
            <div className="max-w-6xl mx-auto">
                <h1 className="text-4xl font-black uppercase mb-8">Company Intelligence</h1>

                {/* Filters */}
                <div className="bg-white border-4 border-black p-6 mb-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
                    <div className="grid md:grid-cols-2 gap-4">
                        {/* Search */}
                        <div>
                            <label className="block font-bold mb-2">Search Companies</label>
                            <input
                                type="text"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full px-4 py-2 border-2 border-black font-mono focus:outline-none focus:ring-2 focus:ring-neo-main"
                                placeholder="Google, Microsoft..."
                            />
                        </div>

                        {/* Difficulty Filter */}
                        <div>
                            <label className="block font-bold mb-2">Difficulty Level</label>
                            <select
                                value={selectedDifficulty}
                                onChange={(e) => setSelectedDifficulty(e.target.value)}
                                className="w-full px-4 py-2 border-2 border-black font-bold focus:outline-none focus:ring-2 focus:ring-neo-main"
                            >
                                <option>All</option>
                                <option>Easy</option>
                                <option>Medium</option>
                                <option>Hard</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Results Count */}
                <div className="mb-4">
                    <span className="font-bold text-lg">
                        Showing {filteredCompanies.length} companies
                    </span>
                </div>

                {/* Company Grid */}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredCompanies.map((company) => (
                        <div
                            key={company.id}
                            className="bg-white border-4 border-black p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[4px] hover:translate-y-[4px] transition-all"
                        >
                            {/* Company Logo */}
                            <div className="flex items-center justify-center mb-4 h-16">
                                {company.logoUrl ? (
                                    <img
                                        src={company.logoUrl}
                                        alt={company.name}
                                        className="max-h-full max-w-full object-contain"
                                        onError={(e) => {
                                            e.target.style.display = 'none';
                                            e.target.nextSibling.style.display = 'block';
                                        }}
                                    />
                                ) : null}
                                <div
                                    className="text-3xl font-black hidden"
                                    style={{ display: company.logoUrl ? 'none' : 'block' }}
                                >
                                    {company.name.charAt(0)}
                                </div>
                            </div>

                            {/* Company Name */}
                            <h3 className="text-xl font-black text-center mb-2">{company.name}</h3>

                            {/* Difficulty Badge */}
                            <div className="flex justify-center mb-3">
                                <span
                                    className={`${getDifficultyColor(company.difficultyLevel)} border-2 border-black px-3 py-1 font-black text-sm`}
                                >
                                    {company.difficultyLevel}
                                </span>
                            </div>

                            {/* Description */}
                            <p className="text-sm text-center line-clamp-3">{company.description}</p>
                        </div>
                    ))}
                </div>

                {filteredCompanies.length === 0 && (
                    <div className="text-center py-12">
                        <p className="text-xl font-bold">No companies found matching your criteria.</p>
                    </div>
                )}
            </div>
        </div>
    );
}

export default CompanyIntelligence;
