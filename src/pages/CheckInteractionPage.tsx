import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getInteractionHistory } from '../services/ollamaApi';
import DashboardLayout from '../components/layout/DashboardLayout';
import {
    Pill,
    Plus,
    X,
    Search,
    AlertTriangle,
    ArrowRight,
    Sparkles,
    Info,
    Loader2
} from 'lucide-react';

const CheckInteractionPage = () => {
    const navigate = useNavigate();
    const [medicines, setMedicines] = useState<string[]>([]);
    const [inputValue, setInputValue] = useState('');
    const [isAnalyzing, setIsAnalyzing] = useState(false);

    // Common medicines for suggestions
    const commonMedicines = [
        'Aspirin 100mg',
        'Ibuprofen 400mg',
        'Paracetamol 500mg',
        'Amoxicillin 500mg',
        'Metformin 500mg',
        'Lisinopril 10mg',
        'Atorvastatin 20mg',
        'Omeprazole 20mg',
        'Warfarin 5mg',
        'Amlodipine 5mg',
        'Metoprolol 50mg',
        'Losartan 50mg'
    ];

    const [filteredSuggestions, setFilteredSuggestions] = useState<string[]>([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [recentChecks, setRecentChecks] = useState<any[]>([]);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const loadHistory = async () => {
            const data = await getInteractionHistory();
            if (data && data.length > 0) {
                const formatted = data.map((item: any) => ({
                    medicines: item.medicines,
                    score: item.safetyScore,
                    date: new Date(item.created_at).toLocaleDateString(undefined, {
                        month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
                    })
                }));
                // Remove duplicates?
                setRecentChecks(formatted);
            }
        };
        loadHistory();
    }, []);

    const handleInputChange = (value: string) => {
        setInputValue(value);
        if (value.length > 0) {
            const filtered = commonMedicines.filter(med =>
                med.toLowerCase().includes(value.toLowerCase()) &&
                !medicines.includes(med)
            );
            setFilteredSuggestions(filtered);
            setShowSuggestions(true);
        } else {
            setShowSuggestions(false);
        }
    };

    const addMedicine = (medicine: string) => {
        const trimmed = medicine.trim();
        if (trimmed && !medicines.includes(trimmed)) {
            setMedicines([...medicines, trimmed]);
            setInputValue('');
            setShowSuggestions(false);
        }
    };

    const removeMedicine = (index: number) => {
        setMedicines(medicines.filter((_, i) => i !== index));
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && inputValue.trim()) {
            e.preventDefault();
            addMedicine(inputValue);
        }
    };

    const handleAnalyze = async () => {
        if (medicines.length < 2) {
            setError('Please add at least 2 medicines to check interactions');
            return;
        }
        setError(null);

        setIsAnalyzing(true);

        // Navigate to results page with medicines
        setTimeout(() => {
            navigate('/results', {
                state: { medicines }
            });
        }, 500);
    };

    const addQuickMedicine = (medicine: string) => {
        if (!medicines.includes(medicine)) {
            setMedicines([...medicines, medicine]);
        }
    };

    return (
        <DashboardLayout userRole="patient">
            <div className="max-w-3xl mx-auto space-y-6">
                {/* Header */}
                <div className="text-center">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-500 to-secondary-500 mb-4">
                        <Search className="w-8 h-8 text-white" />
                    </div>
                    <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">
                        Check Drug Interactions
                    </h1>
                    <p className="text-gray-600 mt-2 max-w-lg mx-auto">
                        Enter the medicines you're taking to check for potential interactions
                    </p>
                </div>

                {error && (
                    <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl flex items-center gap-3">
                        <AlertTriangle className="w-5 h-5 flex-shrink-0" />
                        <p>{error}</p>
                    </div>
                )}

                {/* Medicine Input Card */}
                <div className="bg-white rounded-2xl shadow-card border border-gray-100 p-6">
                    <div className="space-y-4">
                        {/* Input Field */}
                        <div className="relative">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Add Medicines
                            </label>
                            <div className="relative">
                                <Pill className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                    type="text"
                                    value={inputValue}
                                    onChange={(e) => handleInputChange(e.target.value)}
                                    onKeyDown={handleKeyDown}
                                    onFocus={() => inputValue && setShowSuggestions(true)}
                                    placeholder="Type medicine name and press Enter..."
                                    className="w-full pl-10 pr-12 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                />
                                <button
                                    onClick={() => addMedicine(inputValue)}
                                    disabled={!inputValue.trim()}
                                    className="absolute right-2 top-1/2 transform -translate-y-1/2 p-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                >
                                    <Plus className="w-4 h-4" />
                                </button>
                            </div>

                            {/* Suggestions Dropdown */}
                            {showSuggestions && filteredSuggestions.length > 0 && (
                                <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-xl shadow-lg max-h-48 overflow-y-auto">
                                    {filteredSuggestions.map((suggestion, idx) => (
                                        <button
                                            key={idx}
                                            onClick={() => addMedicine(suggestion)}
                                            className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center gap-2 text-sm"
                                        >
                                            <Pill className="w-4 h-4 text-gray-400" />
                                            {suggestion}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Selected Medicines */}
                        {medicines.length > 0 && (
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Selected Medicines ({medicines.length})
                                </label>
                                <div className="flex flex-wrap gap-2">
                                    {medicines.map((medicine, idx) => (
                                        <div
                                            key={idx}
                                            className="inline-flex items-center gap-2 px-3 py-2 bg-primary-50 border border-primary-200 rounded-xl text-primary-700"
                                        >
                                            <Pill className="w-4 h-4" />
                                            <span className="font-medium">{medicine}</span>
                                            <button
                                                onClick={() => removeMedicine(idx)}
                                                className="p-0.5 hover:bg-primary-100 rounded-full transition-colors"
                                            >
                                                <X className="w-4 h-4" />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Quick Add Suggestions */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Quick Add Common Medicines
                            </label>
                            <div className="flex flex-wrap gap-2">
                                {commonMedicines.slice(0, 6).map((medicine, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => addQuickMedicine(medicine)}
                                        disabled={medicines.includes(medicine)}
                                        className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${medicines.includes(medicine)
                                            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                            }`}
                                    >
                                        + {medicine}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Info Box */}
                <div className="bg-accent-50 border border-accent-200 rounded-xl p-4">
                    <div className="flex gap-3">
                        <Info className="w-5 h-5 text-accent-600 flex-shrink-0 mt-0.5" />
                        <div>
                            <h4 className="font-medium text-accent-800">How it works</h4>
                            <p className="text-sm text-accent-700 mt-1">
                                Our AI analyzes your medications for potential drug-drug interactions,
                                provides a safety score, and suggests alternatives if needed.
                                Add at least 2 medicines to check for interactions.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Warning for dangerous combinations */}
                {medicines.some(m => m.toLowerCase().includes('warfarin')) &&
                    medicines.some(m => m.toLowerCase().includes('aspirin')) && (
                        <div className="bg-danger-50 border border-danger-200 rounded-xl p-4">
                            <div className="flex gap-3">
                                <AlertTriangle className="w-5 h-5 text-danger-600 flex-shrink-0 mt-0.5" />
                                <div>
                                    <h4 className="font-medium text-danger-800">Potential Interaction Detected</h4>
                                    <p className="text-sm text-danger-700 mt-1">
                                        Warfarin and Aspirin together may significantly increase bleeding risk.
                                        Click "Check Interactions" for detailed analysis.
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}

                {/* Analyze Button */}
                <div className="flex justify-center">
                    <button
                        onClick={handleAnalyze}
                        disabled={medicines.length < 2 || isAnalyzing}
                        className={`flex items-center gap-3 px-8 py-4 rounded-xl font-semibold text-lg transition-all ${medicines.length >= 2
                            ? 'bg-gradient-to-r from-primary-600 to-secondary-600 text-white hover:shadow-lg hover:shadow-primary-500/25 hover:-translate-y-0.5'
                            : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                            }`}
                    >
                        {isAnalyzing ? (
                            <>
                                <Loader2 className="w-6 h-6 animate-spin" />
                                Analyzing...
                            </>
                        ) : (
                            <>
                                <Sparkles className="w-6 h-6" />
                                Check Interactions
                                <ArrowRight className="w-5 h-5" />
                            </>
                        )}
                    </button>
                </div>

                {medicines.length < 2 && medicines.length > 0 && (
                    <p className="text-center text-sm text-gray-500">
                        Add at least {2 - medicines.length} more medicine{2 - medicines.length > 1 ? 's' : ''} to check interactions
                    </p>
                )}

                {/* Recent Checks */}
                <div className="bg-white rounded-2xl shadow-card border border-gray-100 p-6">
                    <h3 className="font-semibold text-gray-900 mb-4">Recent Checks</h3>
                    <div className="space-y-3">
                        {recentChecks.length > 0 ? (
                            recentChecks.map((check, idx) => (
                                <div
                                    key={idx}
                                    className="flex items-center justify-between p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors cursor-pointer"
                                    onClick={() => setMedicines(check.medicines)}
                                >
                                    <div className="flex items-center gap-3">
                                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${check.score >= 80 ? 'bg-secondary-100' : 'bg-accent-100'
                                            }`}>
                                            <Pill className={`w-5 h-5 ${check.score >= 80 ? 'text-secondary-600' : 'text-accent-600'
                                                }`} />
                                        </div>
                                        <div>
                                            <p className="font-medium text-gray-900 text-sm">
                                                {check.medicines.join(' + ')}
                                            </p>
                                            <p className="text-xs text-gray-500">{check.date}</p>
                                        </div>
                                    </div>
                                    <div className={`text-sm font-semibold ${check.score >= 80 ? 'text-secondary-600' : 'text-accent-600'
                                        }`}>
                                        {check.score}/100
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-8 text-gray-500 text-sm">
                                No recent interaction checks found.
                            </div>
                        )}

                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default CheckInteractionPage;
