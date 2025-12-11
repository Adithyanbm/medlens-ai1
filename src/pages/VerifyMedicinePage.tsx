import { useState, useCallback } from 'react';
import DashboardLayout from '../components/layout/DashboardLayout';
import { verifyMedicine, VerificationResult } from '../services/ollamaApi';
import {
    FileText,
    X,
    CheckCircle2,
    AlertTriangle,
    ShieldCheck,
    AlertOctagon,
    Camera,
    RefreshCw
} from 'lucide-react';

const VerifyMedicinePage = () => {
    const [file, setFile] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>(null);
    const [isDragging, setIsDragging] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [result, setResult] = useState<VerificationResult | null>(null);
    const [error, setError] = useState('');

    const handleDragOver = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    }, []);

    const handleDragLeave = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
    }, []);

    const handleDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        const droppedFile = e.dataTransfer.files[0];
        if (droppedFile && droppedFile.type.startsWith('image/')) {
            handleFileSelect(droppedFile);
        }
    }, []);

    const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            handleFileSelect(e.target.files[0]);
        }
    };

    const handleFileSelect = (selectedFile: File) => {
        setFile(selectedFile);
        setPreview(URL.createObjectURL(selectedFile));
        setResult(null);
        setError('');
    };

    const clearFile = () => {
        setFile(null);
        setPreview(null);
        setResult(null);
        setError('');
    };

    const fileToBase64 = (file: File): Promise<string> => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => {
                const base64 = (reader.result as string).split(',')[1];
                resolve(base64);
            };
            reader.onerror = reject;
        });
    };

    const handleVerify = async () => {
        if (!file) return;

        setIsLoading(true);
        setError('');

        try {
            const imageBase64 = await fileToBase64(file);
            const data = await verifyMedicine(imageBase64);
            setResult(data);
        } catch (err: any) {
            setError(err.message || 'Verification failed. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <DashboardLayout userRole="patient">
            <div className="max-w-4xl mx-auto space-y-8">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                        <ShieldCheck className="w-8 h-8 text-primary-600" />
                        Verify Medicine Authenticity
                    </h1>
                    <p className="text-gray-600 mt-2">
                        Upload a photo of medicine packaging to check for signs of counterfeiting using AI.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Left Column: Upload */}
                    <div className="space-y-6">
                        {!preview ? (
                            <div
                                onDragOver={handleDragOver}
                                onDragLeave={handleDragLeave}
                                onDrop={handleDrop}
                                className={`relative border-2 border-dashed rounded-2xl p-8 text-center transition-all h-80 flex flex-col items-center justify-center ${isDragging
                                    ? 'border-primary-500 bg-primary-50'
                                    : 'border-gray-300 bg-white hover:border-primary-400 hover:bg-gray-50'
                                    }`}
                            >
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleFileInput}
                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                />
                                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-4 transition-colors ${isDragging ? 'bg-primary-100' : 'bg-gray-100'
                                    }`}>
                                    <Camera className={`w-8 h-8 ${isDragging ? 'text-primary-600' : 'text-gray-400'}`} />
                                </div>
                                <h3 className="font-semibold text-gray-900 mb-2">Upload Packaging Photo</h3>
                                <p className="text-sm text-gray-500">
                                    Drag and drop or click to browse
                                </p>
                            </div>
                        ) : (
                            <div className="relative rounded-2xl overflow-hidden bg-gray-100 border border-gray-200">
                                <img src={preview} alt="Upload preview" className="w-full h-80 object-cover" />
                                <button
                                    onClick={clearFile}
                                    className="absolute top-4 right-4 p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-sm hover:bg-white transition-colors"
                                >
                                    <X className="w-5 h-5 text-gray-600" />
                                </button>

                                {!result && !isLoading && (
                                    <div className="absolute bottom-0 inset-x-0 p-4 bg-white/90 backdrop-blur-md border-t border-gray-200 flex justify-between items-center">
                                        <span className="text-sm font-medium text-gray-700 truncate max-w-[200px]">
                                            {file?.name}
                                        </span>
                                        <button
                                            onClick={handleVerify}
                                            disabled={isLoading}
                                            className="bg-primary-600 text-white px-6 py-2 rounded-xl font-semibold hover:bg-primary-700 transition-colors shadow-lg shadow-primary-500/30 flex items-center gap-2"
                                        >
                                            <ShieldCheck className="w-4 h-4" />
                                            Verify Now
                                        </button>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Guidelines */}
                        <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
                            <h4 className="text-sm font-bold text-blue-800 mb-2 flex items-center gap-2">
                                <AlertTriangle className="w-4 h-4" />
                                What to capture?
                            </h4>
                            <ul className="text-sm text-blue-700 space-y-1 list-disc list-inside">
                                <li>Front of the box/strip with brand name</li>
                                <li>Manufacturing & Expiry dates</li>
                                <li>Batch number & holograms (if any)</li>
                                <li>Logo and fine print</li>
                            </ul>
                        </div>
                    </div>

                    {/* Right Column: Loading or Result */}
                    <div className="space-y-6">
                        {isLoading && (
                            <div className="h-full min-h-[300px] flex flex-col items-center justify-center bg-white rounded-2xl border border-gray-100 shadow-sm p-8 text-center">
                                <div className="relative w-20 h-20 mb-6">
                                    <div className="absolute inset-0 border-4 border-gray-100 rounded-full" />
                                    <div className="absolute inset-0 border-4 border-primary-500 rounded-full border-t-transparent animate-spin" />
                                    <ShieldCheck className="absolute inset-0 m-auto w-8 h-8 text-primary-500 animate-pulse" />
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-2">Analyzing Authenticity</h3>
                                <p className="text-gray-500 max-w-xs">
                                    Our AI is checking for print quality, spelling errors, and packaging inconsistencies...
                                </p>
                            </div>
                        )}

                        {error && (
                            <div className="bg-red-50 p-6 rounded-2xl border border-red-100 text-center">
                                <AlertOctagon className="w-12 h-12 text-red-500 mx-auto mb-4" />
                                <h3 className="text-lg font-bold text-red-800 mb-2">Analysis Failed</h3>
                                <p className="text-red-600 mb-6">{error}</p>
                                <button onClick={handleVerify} className="text-red-700 font-semibold hover:underline flex items-center justify-center gap-2 mx-auto">
                                    <RefreshCw className="w-4 h-4" /> Try Again
                                </button>
                            </div>
                        )}

                        {result && !isLoading && (
                            <div className="space-y-6 animate-fadeIn">
                                {/* Main Status Card */}
                                <div className={`p-8 rounded-2xl border-2 text-center shadow-lg ${result.isLikelyAuthentic
                                    ? 'bg-green-50 border-green-200 shadow-green-100'
                                    : 'bg-red-50 border-red-200 shadow-red-100'
                                    }`}>
                                    <div className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 ${result.isLikelyAuthentic ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
                                        }`}>
                                        {result.isLikelyAuthentic ? (
                                            <CheckCircle2 className="w-10 h-10" />
                                        ) : (
                                            <AlertOctagon className="w-10 h-10" />
                                        )}
                                    </div>

                                    <h2 className={`text-2xl font-bold mb-2 ${result.isLikelyAuthentic ? 'text-green-800' : 'text-red-800'
                                        }`}>
                                        {result.isLikelyAuthentic ? 'Likely Authentic' : 'Suspicious Packaging'}
                                    </h2>

                                    <div className="flex justify-center gap-4 mt-4 text-sm font-medium">
                                        <span className={`px-3 py-1 rounded-full border ${result.isLikelyAuthentic
                                            ? 'bg-green-100 border-green-200 text-green-700'
                                            : 'bg-red-100 border-red-200 text-red-700'
                                            }`}>
                                            Confidence: {result.confidence}%
                                        </span>
                                        <span className={`px-3 py-1 rounded-full border ${result.riskLevel === 'low'
                                            ? 'bg-green-100 border-green-200 text-green-700'
                                            : result.riskLevel === 'medium'
                                                ? 'bg-yellow-100 border-yellow-200 text-yellow-700'
                                                : 'bg-red-100 border-red-200 text-red-700'
                                            }`}>
                                            Risk: {result.riskLevel.toUpperCase()}
                                        </span>
                                    </div>

                                    <p className={`mt-6 text-sm leading-relaxed ${result.isLikelyAuthentic ? 'text-green-700' : 'text-red-700'
                                        }`}>
                                        {result.analysis}
                                    </p>
                                </div>

                                {/* Issues List */}
                                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                                    <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                                        <FileText className="w-5 h-5 text-gray-400" />
                                        Detailed Findings
                                    </h3>
                                    {result.issues.length === 0 ? (
                                        <p className="text-gray-500 italic flex items-center gap-2">
                                            <CheckCircle2 className="w-4 h-4 text-green-500" />
                                            No explicit issues detected.
                                        </p>
                                    ) : (
                                        <ul className="space-y-3">
                                            {result.issues.map((issue, idx) => (
                                                <li key={idx} className="flex items-start gap-3 text-sm text-gray-700 bg-gray-50 p-3 rounded-lg">
                                                    <AlertTriangle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
                                                    {issue}
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                </div>

                                {/* Disclaimer */}
                                <div className="bg-gray-50 p-4 rounded-xl text-xs text-gray-500 text-center">
                                    <p>
                                        <strong>Disclaimer:</strong> This AI analysis is heuristic-based and not a definitive lab test.
                                        Counterfeiters are becoming sophisticated. Only purchase medicines from licensed pharmacies.
                                        If in doubt, consult the manufacturer or a pharmacist.
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default VerifyMedicinePage;
