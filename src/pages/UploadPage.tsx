import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../components/layout/DashboardLayout';
import { analyzePrescriptionImage } from '../services/ollamaApi';
import {
    Upload,
    Image,
    FileText,
    X,
    Loader2,
    CheckCircle2,
    AlertCircle,
    ArrowRight,
    Camera,
    Sparkles,
    Pill,
    RefreshCw
} from 'lucide-react';

interface ExtractedMedicine {
    name: string;
    dosage: string;
}

interface UploadedFile {
    file: File;
    preview: string;
    status: 'pending' | 'processing' | 'complete' | 'error';
    progress: number;
    result?: {
        medicines: ExtractedMedicine[];
        confidence: number;
        warnings?: string[];
    };
    errorMessage?: string;
}

const UploadPage = () => {
    const navigate = useNavigate();
    const [files, setFiles] = useState<UploadedFile[]>([]);
    const [isDragging, setIsDragging] = useState(false);

    const handleDragOver = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    }, []);

    const handleDragLeave = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
    }, []);

    // Convert file to base64 for vision model
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

    const processFile = async (file: File, fileIndex: number): Promise<void> => {
        // Update to processing with progress animation
        const updateProgress = (progress: number) => {
            setFiles(prev => prev.map((f, idx) =>
                idx === fileIndex ? { ...f, progress } : f
            ));
        };

        try {
            // Start processing
            setFiles(prev => prev.map((f, idx) =>
                idx === fileIndex ? { ...f, status: 'processing' as const, progress: 10 } : f
            ));

            // Convert image to base64
            updateProgress(30);
            const imageBase64 = await fileToBase64(file);

            // Call AI API for analysis
            updateProgress(50);
            const result = await analyzePrescriptionImage(imageBase64);

            // Parse medicines - handle both string array and object array
            const medicines: ExtractedMedicine[] = result.medicines.map((med: string, idx: number) => ({
                name: med,
                dosage: result.dosages?.[idx] || 'As prescribed'
            }));

            updateProgress(100);

            // Update with results
            setFiles(prev => prev.map((f, idx) =>
                idx === fileIndex ? {
                    ...f,
                    status: 'complete' as const,
                    progress: 100,
                    result: {
                        medicines,
                        confidence: result.confidence || 90,
                        warnings: result.warnings
                    }
                } : f
            ));
        } catch (error) {
            console.error('Failed to process prescription:', error);
            setFiles(prev => prev.map((f, idx) =>
                idx === fileIndex ? {
                    ...f,
                    status: 'error' as const,
                    progress: 0,
                    errorMessage: error instanceof Error ? error.message : 'Processing failed'
                } : f
            ));
        }
    };

    const handleFiles = async (newFiles: FileList | File[]) => {
        const validFiles = Array.from(newFiles).filter(file =>
            file.type.startsWith('image/')
        );

        if (validFiles.length === 0) return;

        const startIndex = files.length;
        const uploadedFiles: UploadedFile[] = validFiles.map(file => ({
            file,
            preview: URL.createObjectURL(file),
            status: 'pending' as const,
            progress: 0,
        }));

        setFiles(prev => [...prev, ...uploadedFiles]);

        // Process each file sequentially
        for (let i = 0; i < uploadedFiles.length; i++) {
            await processFile(uploadedFiles[i].file, startIndex + i);
        }
    };

    const handleDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        handleFiles(e.dataTransfer.files);
    }, [files.length]);

    const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            handleFiles(e.target.files);
        }
    };

    const removeFile = (index: number) => {
        setFiles(prev => prev.filter((_, i) => i !== index));
    };

    const retryFile = async (index: number) => {
        const file = files[index];
        if (file) {
            await processFile(file.file, index);
        }
    };

    const completedFiles = files.filter(f => f.status === 'complete');
    const hasResults = completedFiles.length > 0;
    const allMedicines = completedFiles.flatMap(f => f.result?.medicines || []);

    const handleAnalyzeInteractions = () => {
        // Navigate to results page with extracted medicines
        navigate('/results', {
            state: {
                medicines: allMedicines.map(m => m.name)
            }
        });
    };

    return (
        <DashboardLayout userRole="patient">
            <div className="max-w-4xl mx-auto space-y-6">
                {/* Header */}
                <div>
                    <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">
                        Upload Prescription
                    </h1>
                    <p className="text-gray-600 mt-1">
                        Upload a photo of your prescription for AI-powered medicine extraction
                    </p>
                </div>

                {/* Upload Zone */}
                <div
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    className={`relative border-2 border-dashed rounded-2xl p-8 lg:p-12 text-center transition-all duration-300 ${isDragging
                        ? 'border-primary-500 bg-primary-50'
                        : 'border-gray-300 bg-white hover:border-primary-400 hover:bg-gray-50'
                        }`}
                >
                    <input
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={handleFileInput}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />

                    <div className="flex flex-col items-center">
                        <div className={`w-20 h-20 rounded-2xl flex items-center justify-center mb-6 transition-colors ${isDragging ? 'bg-primary-100' : 'bg-gray-100'
                            }`}>
                            <Upload className={`w-10 h-10 ${isDragging ? 'text-primary-600' : 'text-gray-400'}`} />
                        </div>

                        <h3 className="text-xl font-semibold text-gray-900 mb-2">
                            {isDragging ? 'Drop your files here' : 'Drag & drop your prescription'}
                        </h3>
                        <p className="text-gray-500 mb-6">
                            or click to browse from your device
                        </p>

                        <div className="flex flex-wrap justify-center gap-3 text-sm text-gray-400">
                            <div className="flex items-center gap-1">
                                <Image className="w-4 h-4" />
                                <span>JPG, PNG, HEIC</span>
                            </div>
                            <span>•</span>
                            <div className="flex items-center gap-1">
                                <FileText className="w-4 h-4" />
                                <span>Max 10MB per file</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Camera Quick Action */}
                <div className="flex justify-center">
                    <button className="flex items-center gap-2 px-6 py-3 bg-gray-100 hover:bg-gray-200 rounded-xl text-gray-700 font-medium transition-colors">
                        <Camera className="w-5 h-5" />
                        Take a Photo
                    </button>
                </div>

                {/* Uploaded Files */}
                {files.length > 0 && (
                    <div className="bg-white rounded-2xl shadow-card border border-gray-100">
                        <div className="p-6 border-b border-gray-100">
                            <h2 className="text-lg font-semibold text-gray-900">Uploaded Files</h2>
                        </div>
                        <div className="divide-y divide-gray-100">
                            {files.map((uploadedFile, index) => (
                                <div key={index} className="p-4">
                                    <div className="flex items-start gap-4">
                                        {/* Thumbnail */}
                                        <div className="w-20 h-20 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0">
                                            <img
                                                src={uploadedFile.preview}
                                                alt="Preview"
                                                className="w-full h-full object-cover"
                                            />
                                        </div>

                                        {/* Info */}
                                        <div className="flex-1 min-w-0">
                                            <p className="font-medium text-gray-900 truncate">
                                                {uploadedFile.file.name}
                                            </p>
                                            <p className="text-sm text-gray-500">
                                                {(uploadedFile.file.size / 1024 / 1024).toFixed(2)} MB
                                            </p>

                                            {/* Status */}
                                            {uploadedFile.status === 'processing' && (
                                                <div className="mt-3">
                                                    <div className="flex items-center gap-2 text-primary-600 text-sm mb-2">
                                                        <Loader2 className="w-4 h-4 animate-spin" />
                                                        <span>AI is extracting medicines...</span>
                                                    </div>
                                                    <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                                                        <div
                                                            className="h-full bg-gradient-to-r from-primary-500 to-secondary-500 transition-all duration-500"
                                                            style={{ width: `${uploadedFile.progress}%` }}
                                                        />
                                                    </div>
                                                </div>
                                            )}

                                            {uploadedFile.status === 'complete' && uploadedFile.result && (
                                                <div className="mt-2">
                                                    <div className="flex items-center gap-2 text-secondary-600 text-sm">
                                                        <CheckCircle2 className="w-4 h-4" />
                                                        <span>
                                                            Found {uploadedFile.result.medicines.length} medicines •
                                                            {uploadedFile.result.confidence}% confidence
                                                        </span>
                                                    </div>
                                                </div>
                                            )}

                                            {uploadedFile.status === 'error' && (
                                                <div className="mt-2">
                                                    <div className="flex items-center gap-2 text-danger-600 text-sm">
                                                        <AlertCircle className="w-4 h-4" />
                                                        <span>{uploadedFile.errorMessage || 'Processing failed'}</span>
                                                    </div>
                                                    <button
                                                        onClick={() => retryFile(index)}
                                                        className="mt-2 flex items-center gap-1 text-sm text-primary-600 hover:text-primary-700"
                                                    >
                                                        <RefreshCw className="w-4 h-4" />
                                                        Retry
                                                    </button>
                                                </div>
                                            )}
                                        </div>

                                        {/* Remove Button */}
                                        <button
                                            onClick={() => removeFile(index)}
                                            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                                        >
                                            <X className="w-5 h-5 text-gray-400" />
                                        </button>
                                    </div>

                                    {/* Extracted Medicines for this file */}
                                    {uploadedFile.status === 'complete' && uploadedFile.result && uploadedFile.result.medicines.length > 0 && (
                                        <div className="mt-4 ml-24 p-4 bg-gray-50 rounded-xl">
                                            <h4 className="text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
                                                <Pill className="w-4 h-4" />
                                                Extracted Medicines
                                            </h4>
                                            <div className="grid gap-2">
                                                {uploadedFile.result.medicines.map((medicine, medIndex) => (
                                                    <div
                                                        key={medIndex}
                                                        className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-200"
                                                    >
                                                        <div>
                                                            <p className="font-medium text-gray-900">{medicine.name}</p>
                                                            <p className="text-sm text-gray-500">{medicine.dosage}</p>
                                                        </div>
                                                        <CheckCircle2 className="w-5 h-5 text-secondary-500" />
                                                    </div>
                                                ))}
                                            </div>
                                            {uploadedFile.result.warnings && uploadedFile.result.warnings.length > 0 && (
                                                <div className="mt-3 p-3 bg-accent-50 rounded-lg text-sm text-accent-700">
                                                    <strong>Note:</strong> {uploadedFile.result.warnings.join(', ')}
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* All Extracted Medicines Summary */}
                {hasResults && allMedicines.length > 0 && (
                    <div className="bg-white rounded-2xl shadow-card border border-gray-100">
                        <div className="p-6 border-b border-gray-100">
                            <div className="flex items-center gap-2">
                                <Sparkles className="w-5 h-5 text-primary-600" />
                                <h2 className="text-lg font-semibold text-gray-900">
                                    All Extracted Medicines ({allMedicines.length})
                                </h2>
                            </div>
                        </div>
                        <div className="p-6">
                            <div className="flex flex-wrap gap-3">
                                {allMedicines.map((medicine, index) => (
                                    <div
                                        key={index}
                                        className="px-4 py-2 bg-gradient-to-r from-primary-50 to-secondary-50 border border-primary-200 rounded-xl text-primary-700 font-medium flex items-center gap-2"
                                    >
                                        <Pill className="w-4 h-4" />
                                        {medicine.name}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* Action Buttons */}
                {hasResults && (
                    <div className="flex flex-col sm:flex-row justify-end gap-4">
                        <button
                            onClick={() => setFiles([])}
                            className="btn-secondary"
                        >
                            Clear All
                        </button>
                        <button
                            onClick={handleAnalyzeInteractions}
                            className="btn-primary"
                        >
                            Analyze Interactions
                            <ArrowRight className="w-5 h-5 ml-2" />
                        </button>
                    </div>
                )}

                {/* Tips */}
                <div className="bg-accent-50 border border-accent-200 rounded-2xl p-6">
                    <h3 className="font-semibold text-accent-800 mb-3">Tips for best results</h3>
                    <ul className="space-y-2 text-sm text-accent-700">
                        <li className="flex items-start gap-2">
                            <CheckCircle2 className="w-4 h-4 mt-0.5 flex-shrink-0" />
                            <span>Ensure the prescription is well-lit and in focus</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <CheckCircle2 className="w-4 h-4 mt-0.5 flex-shrink-0" />
                            <span>Include the entire prescription in the frame</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <CheckCircle2 className="w-4 h-4 mt-0.5 flex-shrink-0" />
                            <span>Avoid shadows and reflections on the paper</span>
                        </li>
                    </ul>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default UploadPage;
