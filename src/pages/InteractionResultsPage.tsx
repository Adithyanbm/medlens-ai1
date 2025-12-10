import { Link, useLocation } from 'react-router-dom';
import DashboardLayout from '../components/layout/DashboardLayout';
import {
    AlertTriangle,
    CheckCircle2,
    Info,
    Download,
    Share2,
    ArrowLeft,
    Pill,
    AlertCircle,
    ChevronDown,
    ChevronUp,
    Lightbulb,
    Shield,
    Loader2,
    RefreshCw
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { checkDrugInteractions } from '../services/ollamaApi';

interface Interaction {
    id: number;
    drugA: string;
    drugB: string;
    severity: 'minor' | 'moderate' | 'severe';
    description: string;
    management: string;
    expanded: boolean;
}

interface Medicine {
    name: string;
    status: 'safe' | 'warning';
    dosage: string;
}

interface Alternative {
    current: string;
    alternative: string;
    reason: string;
}

const InteractionResultsPage = () => {
    const location = useLocation();

    // Get medicines from navigation state or use default for demo
    const [inputMedicines, setInputMedicines] = useState<string[]>(
        location.state?.medicines || ['Aspirin 100mg', 'Warfarin 5mg', 'Metformin 500mg', 'Lisinopril 10mg']
    );

    const [safetyScore, setSafetyScore] = useState<number>(0);
    const [interactions, setInteractions] = useState<Interaction[]>([]);
    const [medicines, setMedicines] = useState<Medicine[]>([]);
    const [alternatives, setAlternatives] = useState<Alternative[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [analysisDate, setAnalysisDate] = useState<string>('');

    // Custom medicines input
    const [customInput, setCustomInput] = useState('');
    const [showCustomInput, setShowCustomInput] = useState(false);

    const analyzeInteractions = async (meds: string[]) => {
        setIsLoading(true);
        setError(null);

        try {
            const result = await checkDrugInteractions(meds);

            // Set safety score
            setSafetyScore(result.safetyScore);

            // Convert interactions to our format
            const formattedInteractions: Interaction[] = result.interactions.map((i, idx) => ({
                id: idx + 1,
                drugA: i.drugA,
                drugB: i.drugB,
                severity: i.severity,
                description: i.description,
                management: i.management,
                expanded: idx === 0, // Expand first one
            }));
            setInteractions(formattedInteractions);

            // Create medicines list with status based on interactions
            const interactingDrugs = new Set(
                result.interactions.flatMap(i => [i.drugA.toLowerCase(), i.drugB.toLowerCase()])
            );

            const formattedMedicines: Medicine[] = meds.map(med => ({
                name: med,
                status: interactingDrugs.has(med.toLowerCase().split(' ')[0]) ? 'warning' : 'safe',
                dosage: 'As prescribed'
            }));
            setMedicines(formattedMedicines);

            // Generate alternatives for severe interactions
            const alts: Alternative[] = result.interactions
                .filter(i => i.severity === 'severe')
                .map(i => ({
                    current: i.drugA,
                    alternative: 'Consult your doctor for alternatives',
                    reason: `Severe interaction with ${i.drugB}`
                }));
            setAlternatives(alts);

            // Set analysis date
            setAnalysisDate(new Date().toLocaleString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
                hour: 'numeric',
                minute: '2-digit',
                hour12: true
            }));

        } catch (err) {
            console.error('Analysis error:', err);
            setError('Failed to analyze interactions. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        analyzeInteractions(inputMedicines);
    }, []);

    const handleCustomAnalysis = () => {
        const meds = customInput.split(',').map(m => m.trim()).filter(m => m);
        if (meds.length > 0) {
            setInputMedicines(meds);
            analyzeInteractions(meds);
            setShowCustomInput(false);
        }
    };

    const toggleInteraction = (id: number) => {
        setInteractions(prev =>
            prev.map(i => i.id === id ? { ...i, expanded: !i.expanded } : i)
        );
    };

    const getSeverityStyles = (severity: string) => {
        switch (severity) {
            case 'severe':
                return {
                    bg: 'bg-danger-50',
                    border: 'border-danger-200',
                    badge: 'bg-danger-100 text-danger-700',
                    icon: 'text-danger-600',
                };
            case 'moderate':
                return {
                    bg: 'bg-accent-50',
                    border: 'border-accent-200',
                    badge: 'bg-accent-100 text-accent-700',
                    icon: 'text-accent-600',
                };
            default:
                return {
                    bg: 'bg-blue-50',
                    border: 'border-blue-200',
                    badge: 'bg-blue-100 text-blue-700',
                    icon: 'text-blue-600',
                };
        }
    };

    const getScoreColor = () => {
        if (safetyScore >= 80) return 'text-secondary-600';
        if (safetyScore >= 60) return 'text-accent-600';
        return 'text-danger-600';
    };

    const severeCount = interactions.filter(i => i.severity === 'severe').length;
    const moderateCount = interactions.filter(i => i.severity === 'moderate').length;
    const minorCount = interactions.filter(i => i.severity === 'minor').length;

    if (isLoading) {
        return (
            <DashboardLayout userRole="patient">
                <div className="max-w-5xl mx-auto flex flex-col items-center justify-center min-h-[400px]">
                    <div className="bg-white rounded-2xl shadow-card border border-gray-100 p-12 text-center">
                        <Loader2 className="w-12 h-12 text-primary-600 animate-spin mx-auto mb-4" />
                        <h2 className="text-xl font-semibold text-gray-900 mb-2">Analyzing Drug Interactions</h2>
                        <p className="text-gray-600">AI is checking for potential interactions between your medications...</p>
                        <div className="mt-6 flex flex-wrap justify-center gap-2">
                            {inputMedicines.map((med, idx) => (
                                <span key={idx} className="px-3 py-1 bg-primary-50 text-primary-700 rounded-full text-sm">
                                    {med}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>
            </DashboardLayout>
        );
    }

    if (error) {
        return (
            <DashboardLayout userRole="patient">
                <div className="max-w-5xl mx-auto flex flex-col items-center justify-center min-h-[400px]">
                    <div className="bg-white rounded-2xl shadow-card border border-gray-100 p-12 text-center">
                        <AlertCircle className="w-12 h-12 text-danger-600 mx-auto mb-4" />
                        <h2 className="text-xl font-semibold text-gray-900 mb-2">Analysis Failed</h2>
                        <p className="text-gray-600 mb-6">{error}</p>
                        <button
                            onClick={() => analyzeInteractions(inputMedicines)}
                            className="btn-primary"
                        >
                            <RefreshCw className="w-5 h-5 mr-2" />
                            Try Again
                        </button>
                    </div>
                </div>
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout userRole="patient">
            <div className="max-w-5xl mx-auto space-y-6">
                {/* Header */}
                <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                    <div>
                        <Link
                            to="/upload"
                            className="inline-flex items-center gap-1 text-gray-500 hover:text-gray-700 text-sm mb-2"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            Back to Upload
                        </Link>
                        <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">
                            Interaction Analysis Results
                        </h1>
                        <p className="text-gray-600 mt-1">
                            Analysis completed on {analysisDate}
                        </p>
                    </div>
                    <div className="flex gap-3">
                        <button
                            onClick={() => setShowCustomInput(!showCustomInput)}
                            className="btn-secondary"
                        >
                            <RefreshCw className="w-5 h-5 mr-2" />
                            New Analysis
                        </button>
                        <button className="btn-primary">
                            <Download className="w-5 h-5 mr-2" />
                            Download Report
                        </button>
                    </div>
                </div>

                {/* Custom Input */}
                {showCustomInput && (
                    <div className="bg-white rounded-2xl shadow-card border border-gray-100 p-6">
                        <h3 className="font-semibold text-gray-900 mb-3">Enter Medicines to Analyze</h3>
                        <div className="flex gap-3">
                            <input
                                type="text"
                                value={customInput}
                                onChange={(e) => setCustomInput(e.target.value)}
                                placeholder="e.g., Aspirin, Ibuprofen, Warfarin"
                                className="flex-1 px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
                            />
                            <button onClick={handleCustomAnalysis} className="btn-primary">
                                Analyze
                            </button>
                        </div>
                        <p className="text-sm text-gray-500 mt-2">Separate medicine names with commas</p>
                    </div>
                )}

                {/* Safety Score Card */}
                <div className="bg-white rounded-2xl shadow-card border border-gray-100 p-6 lg:p-8">
                    <div className="flex flex-col lg:flex-row items-center gap-8">
                        {/* Gauge */}
                        <div className="relative w-48 h-48">
                            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                                <circle
                                    cx="50"
                                    cy="50"
                                    r="40"
                                    stroke="#e5e7eb"
                                    strokeWidth="12"
                                    fill="none"
                                />
                                <circle
                                    cx="50"
                                    cy="50"
                                    r="40"
                                    stroke="url(#scoreGradient)"
                                    strokeWidth="12"
                                    fill="none"
                                    strokeLinecap="round"
                                    strokeDasharray={`${safetyScore * 2.51} 251`}
                                    className="transition-all duration-1000"
                                />
                                <defs>
                                    <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                                        <stop offset="0%" stopColor={safetyScore >= 80 ? '#10b981' : safetyScore >= 60 ? '#f59e0b' : '#ef4444'} />
                                        <stop offset="100%" stopColor={safetyScore >= 80 ? '#059669' : safetyScore >= 60 ? '#d97706' : '#dc2626'} />
                                    </linearGradient>
                                </defs>
                            </svg>
                            <div className="absolute inset-0 flex flex-col items-center justify-center">
                                <span className={`text-4xl font-bold ${getScoreColor()}`}>{safetyScore}</span>
                                <span className="text-gray-500 text-sm">/ 100</span>
                            </div>
                        </div>

                        {/* Score Details */}
                        <div className="flex-1 text-center lg:text-left">
                            <div className="flex items-center justify-center lg:justify-start gap-2 mb-2">
                                <Shield className={`w-6 h-6 ${getScoreColor()}`} />
                                <h2 className="text-2xl font-bold text-gray-900">Medicine Safety Score</h2>
                            </div>
                            <p className="text-gray-600 mb-4 max-w-md">
                                {safetyScore >= 80
                                    ? 'Your medications appear to be safe to use together.'
                                    : safetyScore >= 60
                                        ? 'Some potential interactions found. Review the details below.'
                                        : 'Significant interactions detected. Please consult your healthcare provider.'}
                            </p>
                            <div className="flex flex-wrap justify-center lg:justify-start gap-4">
                                <div className="flex items-center gap-2">
                                    <span className="w-3 h-3 rounded-full bg-danger-500" />
                                    <span className="text-sm text-gray-600">{severeCount} Severe</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="w-3 h-3 rounded-full bg-accent-500" />
                                    <span className="text-sm text-gray-600">{moderateCount} Moderate</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="w-3 h-3 rounded-full bg-blue-500" />
                                    <span className="text-sm text-gray-600">{minorCount} Minor</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Interactions */}
                {interactions.length > 0 ? (
                    <div className="bg-white rounded-2xl shadow-card border border-gray-100">
                        <div className="p-6 border-b border-gray-100">
                            <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                                <AlertTriangle className="w-5 h-5 text-danger-600" />
                                Drug Interactions Found ({interactions.length})
                            </h2>
                        </div>
                        <div className="divide-y divide-gray-100">
                            {interactions.map((interaction) => {
                                const styles = getSeverityStyles(interaction.severity);
                                return (
                                    <div key={interaction.id} className={`${styles.bg} ${styles.border} border-l-4`}>
                                        <button
                                            onClick={() => toggleInteraction(interaction.id)}
                                            className="w-full p-4 flex items-center justify-between text-left"
                                        >
                                            <div className="flex items-center gap-4">
                                                <div className={`p-2 rounded-lg ${styles.badge}`}>
                                                    {interaction.severity === 'severe' ? (
                                                        <AlertCircle className="w-5 h-5" />
                                                    ) : (
                                                        <Info className="w-5 h-5" />
                                                    )}
                                                </div>
                                                <div>
                                                    <div className="flex items-center gap-2 flex-wrap">
                                                        <span className="font-semibold text-gray-900">{interaction.drugA}</span>
                                                        <span className="text-gray-400">+</span>
                                                        <span className="font-semibold text-gray-900">{interaction.drugB}</span>
                                                    </div>
                                                    <span className={`text-sm font-medium ${styles.icon} capitalize`}>
                                                        {interaction.severity} interaction
                                                    </span>
                                                </div>
                                            </div>
                                            {interaction.expanded ? (
                                                <ChevronUp className="w-5 h-5 text-gray-400" />
                                            ) : (
                                                <ChevronDown className="w-5 h-5 text-gray-400" />
                                            )}
                                        </button>

                                        {interaction.expanded && (
                                            <div className="px-4 pb-4">
                                                <div className="bg-white rounded-xl p-4 space-y-4">
                                                    <div>
                                                        <h4 className="font-medium text-gray-900 mb-1">Description</h4>
                                                        <p className="text-gray-600 text-sm">{interaction.description}</p>
                                                    </div>
                                                    <div>
                                                        <h4 className="font-medium text-gray-900 mb-1">Management</h4>
                                                        <p className="text-gray-600 text-sm">{interaction.management}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                ) : (
                    <div className="bg-secondary-50 border border-secondary-200 rounded-2xl p-8 text-center">
                        <CheckCircle2 className="w-12 h-12 text-secondary-600 mx-auto mb-4" />
                        <h3 className="text-xl font-semibold text-secondary-800 mb-2">No Interactions Found</h3>
                        <p className="text-secondary-600">Great news! No significant drug interactions were detected between your medications.</p>
                    </div>
                )}

                {/* Medicines List */}
                <div className="bg-white rounded-2xl shadow-card border border-gray-100">
                    <div className="p-6 border-b border-gray-100">
                        <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                            <Pill className="w-5 h-5 text-primary-600" />
                            Analyzed Medicines ({medicines.length})
                        </h2>
                    </div>
                    <div className="divide-y divide-gray-100">
                        {medicines.map((medicine, index) => (
                            <div key={index} className="p-4 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className={`p-2 rounded-lg ${medicine.status === 'safe' ? 'bg-secondary-100' : 'bg-accent-100'}`}>
                                        <Pill className={`w-5 h-5 ${medicine.status === 'safe' ? 'text-secondary-600' : 'text-accent-600'}`} />
                                    </div>
                                    <div>
                                        <p className="font-medium text-gray-900">{medicine.name}</p>
                                        <p className="text-sm text-gray-500">{medicine.dosage}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    {medicine.status === 'safe' ? (
                                        <CheckCircle2 className="w-5 h-5 text-secondary-500" />
                                    ) : (
                                        <AlertTriangle className="w-5 h-5 text-accent-500" />
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Alternatives Suggestions */}
                {alternatives.length > 0 && (
                    <div className="bg-secondary-50 border border-secondary-200 rounded-2xl p-6">
                        <div className="flex items-start gap-3 mb-4">
                            <Lightbulb className="w-6 h-6 text-secondary-600 flex-shrink-0" />
                            <div>
                                <h3 className="font-semibold text-secondary-800">Suggested Actions</h3>
                                <p className="text-sm text-secondary-600 mt-1">
                                    Consider discussing these with your healthcare provider
                                </p>
                            </div>
                        </div>
                        <div className="space-y-3">
                            {alternatives.map((alt, index) => (
                                <div key={index} className="bg-white rounded-xl p-4 flex items-center justify-between">
                                    <div>
                                        <p className="text-sm text-gray-500">For</p>
                                        <p className="font-medium text-gray-900">{alt.current}</p>
                                    </div>
                                    <div className="text-center px-4">
                                        <span className="text-gray-400">→</span>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-medium text-secondary-700">{alt.alternative}</p>
                                        <p className="text-xs text-gray-500">{alt.reason}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Disclaimer */}
                <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 text-sm text-gray-600">
                    <strong className="text-gray-900">Disclaimer:</strong> This AI-powered analysis is for informational purposes only
                    and should not replace professional medical advice. Always consult your healthcare provider before
                    making any changes to your medication regimen.
                </div>
            </div>
        </DashboardLayout>
    );
};

export default InteractionResultsPage;
