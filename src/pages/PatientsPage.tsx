import { useState } from 'react';
import {
    Search,
    User,
    Calendar,
    FileText,
    Plus,
    AlertCircle,
    CheckCircle2,
    Loader2,
    ArrowRight
} from 'lucide-react';
import DashboardLayout from '../components/layout/DashboardLayout';
import { portalService } from '../services/portal';

const PatientsPage = () => {
    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [patient, setPatient] = useState<any>(null);
    const [prescriptions, setPrescriptions] = useState<any[]>([]);
    const [error, setError] = useState('');
    const [activeNoteId, setActiveNoteId] = useState<string | null>(null);
    const [noteText, setNoteText] = useState('');

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');
        setPatient(null);
        setPrescriptions([]);

        try {
            const data = await portalService.searchPatient(email);
            setPatient(data.user);

            // Fetch prescriptions
            const rxList = await portalService.getPatientPrescriptions(data.user.id);
            setPrescriptions(rxList);
        } catch (err: any) {
            setError(err.message || 'Error searching for patient');
        } finally {
            setIsLoading(false);
        }
    };

    const handleAddNote = async (id: string) => {
        if (!noteText.trim()) return;
        try {
            await portalService.addNote(id, noteText);
            // Refresh list
            const updated = prescriptions.map(p =>
                p.id === id ? { ...p, doctorNotes: noteText } : p
            );
            setPrescriptions(updated);
            setActiveNoteId(null);
            setNoteText('');
        } catch (err) {
            alert('Failed to save note');
        }
    };

    return (
        <DashboardLayout userRole="doctor">
            <div className="space-y-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Patient Directory</h1>
                    <p className="text-gray-500">Search and manage patient health records.</p>
                </div>

                {/* Search Header */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                    <form onSubmit={handleSearch} className="flex gap-4">
                        <div className="flex-1 relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <input
                                type="email"
                                placeholder="Search by patient email address..."
                                className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="bg-primary-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-primary-700 transition-colors disabled:opacity-50 flex items-center gap-2"
                        >
                            {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Search className="w-5 h-5" />}
                            Find Patient
                        </button>
                    </form>
                    {error && (
                        <div className="mt-4 p-4 bg-red-50 text-red-600 rounded-xl flex items-center gap-2">
                            <AlertCircle className="w-5 h-5" />
                            {error}
                        </div>
                    )}
                </div>

                {!patient && !isLoading && !error && (
                    <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-gray-200">
                        <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                            <User className="w-8 h-8 text-gray-400" />
                        </div>
                        <h3 className="text-lg font-medium text-gray-900">No patient selected</h3>
                        <p className="text-gray-500 mt-1 max-w-sm mx-auto">
                            Enter a patient's email address above to view their medical history and manage prescriptions.
                        </p>
                    </div>
                )}

                {patient && (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Patient Profile Card */}
                        <div className="lg:col-span-1">
                            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 sticky top-24">
                                <div className="flex flex-col items-center text-center pb-6 border-b border-gray-100">
                                    <div className="w-24 h-24 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full flex items-center justify-center text-blue-600 mb-4 shadow-inner">
                                        <User className="w-10 h-10" />
                                    </div>
                                    <h2 className="text-xl font-bold text-gray-900">{patient.name}</h2>
                                    <p className="text-gray-500 font-mono text-sm mt-1">{patient.email}</p>
                                    <div className="mt-3 px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold uppercase tracking-wide">
                                        Active Patient
                                    </div>
                                </div>
                                <div className="pt-6 space-y-6">
                                    <div>
                                        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Medical Alerts</h3>
                                        <div className="flex flex-wrap gap-2">
                                            {patient.allergies?.length > 0 ? (
                                                patient.allergies.map((a: string, i: number) => (
                                                    <span key={i} className="px-3 py-1.5 bg-red-50 text-red-600 rounded-lg text-sm font-medium border border-red-100 flex items-center gap-1.5">
                                                        <AlertCircle className="w-3 h-3" />
                                                        {a}
                                                    </span>
                                                ))
                                            ) : (
                                                <span className="text-gray-400 text-sm flex items-center gap-2">
                                                    <CheckCircle2 className="w-4 h-4 text-green-500" />
                                                    No known allergies
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    <div>
                                        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">About</h3>
                                        <div className="bg-gray-50 p-4 rounded-xl text-sm text-gray-600 leading-relaxed">
                                            {patient.bio || 'No medical biography provided.'}
                                        </div>
                                    </div>

                                    <div className="pt-4 border-t border-gray-100">
                                        <button className="w-full py-2.5 bg-gray-900 text-white rounded-xl text-sm font-semibold hover:bg-gray-800 transition-colors flex items-center justify-center gap-2">
                                            Edit Patient Details
                                            <ArrowRight className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Prescriptions Timeline */}
                        <div className="lg:col-span-2 space-y-6">
                            <div className="flex items-center justify-between">
                                <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                                    <FileText className="w-5 h-5 text-primary-600" />
                                    Prescription History
                                </h2>
                                <span className="text-sm text-gray-500">{prescriptions.length} Records found</span>
                            </div>

                            {prescriptions.length === 0 ? (
                                <div className="bg-white p-12 rounded-2xl text-center border border-dashed border-gray-200">
                                    <FileText className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                                    <p className="text-gray-500">No prescriptions found for this patient.</p>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {prescriptions.map((prescription) => (
                                        <div key={prescription.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden transition-all hover:shadow-md">
                                            {/* Header */}
                                            <div className="p-6 border-b border-gray-50 flex flex-col sm:flex-row justify-between gap-4">
                                                <div className="flex items-start gap-4">
                                                    <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center flex-shrink-0">
                                                        <FileText className="w-6 h-6" />
                                                    </div>
                                                    <div>
                                                        <h3 className="font-bold text-gray-900 text-lg">
                                                            {prescription.doctorName || 'Prescription'}
                                                        </h3>
                                                        <div className="flex items-center gap-3 text-sm text-gray-500 mt-1">
                                                            <span className="flex items-center gap-1">
                                                                <Calendar className="w-4 h-4" />
                                                                {new Date(prescription.created_at).toLocaleDateString()}
                                                            </span>
                                                            <span className="w-1 h-1 bg-gray-300 rounded-full" />
                                                            <span>ID: {prescription.id.slice(-6).toUpperCase()}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="flex items-start justify-end">
                                                    <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide ${prescription.status === 'dispensed'
                                                            ? 'bg-green-100 text-green-700'
                                                            : 'bg-amber-100 text-amber-700'
                                                        }`}>
                                                        {prescription.status}
                                                    </span>
                                                </div>
                                            </div>

                                            {/* Body */}
                                            <div className="p-6">
                                                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Medicines Prescribed</h4>
                                                <div className="flex flex-wrap gap-2 mb-6">
                                                    {prescription.medicines.map((med: string, i: number) => (
                                                        <span key={i} className="px-3 py-1.5 bg-gray-50 text-gray-700 rounded-lg text-sm font-medium border border-gray-200">
                                                            {med}
                                                        </span>
                                                    ))}
                                                </div>

                                                {/* Doctor Notes Area */}
                                                <div className="bg-yellow-50/50 rounded-xl border border-yellow-100 p-4">
                                                    {prescription.doctorNotes ? (
                                                        <div className="flex gap-3">
                                                            <div className="w-8 h-8 rounded-full bg-yellow-100 text-yellow-600 flex items-center justify-center shrink-0">
                                                                <FileText className="w-4 h-4" />
                                                            </div>
                                                            <div>
                                                                <p className="text-xs font-bold text-yellow-800 uppercase mb-1">Clinical Note</p>
                                                                <p className="text-sm text-gray-800 leading-relaxed">{prescription.doctorNotes}</p>
                                                            </div>
                                                        </div>
                                                    ) : (
                                                        activeNoteId === prescription.id ? (
                                                            <div className="bg-white p-3 rounded-lg border border-yellow-200 shadow-sm">
                                                                <textarea
                                                                    placeholder="Write clinical notes here..."
                                                                    className="w-full p-2 text-sm text-gray-700 outline-none resize-none"
                                                                    rows={3}
                                                                    value={noteText}
                                                                    onChange={(e) => setNoteText(e.target.value)}
                                                                    autoFocus
                                                                />
                                                                <div className="flex gap-2 mt-2 justify-end border-t border-gray-100 pt-2">
                                                                    <button
                                                                        onClick={() => setActiveNoteId(null)}
                                                                        className="px-3 py-1.5 text-xs font-medium text-gray-500 hover:text-gray-700"
                                                                    >
                                                                        Cancel
                                                                    </button>
                                                                    <button
                                                                        onClick={() => handleAddNote(prescription.id)}
                                                                        className="px-3 py-1.5 bg-yellow-400/20 text-yellow-800 rounded-lg text-xs font-bold hover:bg-yellow-400/30"
                                                                    >
                                                                        Save Note
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        ) : (
                                                            <button
                                                                onClick={() => {
                                                                    setActiveNoteId(prescription.id);
                                                                    setNoteText('');
                                                                }}
                                                                className="flex items-center gap-2 text-sm text-yellow-700 font-medium hover:text-yellow-800 transition-colors"
                                                            >
                                                                <Plus className="w-4 h-4" />
                                                                Add Clinical Note
                                                            </button>
                                                        )
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
};

export default PatientsPage;
