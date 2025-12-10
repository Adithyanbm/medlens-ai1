import { useState } from 'react';
import {
    Search,
    User,
    Calendar,
    FileText,
    Plus,
    AlertCircle,
    CheckCircle2,
    Loader2
} from 'lucide-react';
import DashboardLayout from '../components/layout/DashboardLayout';
import { portalService } from '../services/portal';

const DoctorDashboard = () => {
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
                    <h1 className="text-2xl font-bold text-gray-900">Patient Management</h1>
                    <p className="text-gray-500">Search for a patient to view records and add notes.</p>
                </div>

                {/* Search Bar */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                    <form onSubmit={handleSearch} className="flex gap-4">
                        <div className="flex-1 relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <input
                                type="email"
                                placeholder="Enter patient email address..."
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
                            Search Patient
                        </button>
                    </form>
                    {error && (
                        <div className="mt-4 p-4 bg-red-50 text-red-600 rounded-xl flex items-center gap-2">
                            <AlertCircle className="w-5 h-5" />
                            {error}
                        </div>
                    )}
                </div>

                {patient && (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Patient Profile */}
                        <div className="lg:col-span-1">
                            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                                <div className="flex flex-col items-center text-center pb-6 border-b border-gray-100">
                                    <div className="w-20 h-20 bg-primary-100 rounded-full flex items-center justify-center text-primary-600 mb-4">
                                        <User className="w-10 h-10" />
                                    </div>
                                    <h2 className="text-xl font-bold text-gray-900">{patient.name}</h2>
                                    <p className="text-gray-500">{patient.email}</p>
                                </div>
                                <div className="pt-6 space-y-4">
                                    <div>
                                        <h3 className="text-sm font-semibold text-gray-900 mb-2">Allergies</h3>
                                        <div className="flex flex-wrap gap-2">
                                            {patient.allergies?.length > 0 ? (
                                                patient.allergies.map((a: string, i: number) => (
                                                    <span key={i} className="px-2 py-1 bg-red-50 text-red-600 rounded text-xs font-medium">
                                                        {a}
                                                    </span>
                                                ))
                                            ) : (
                                                <span className="text-gray-400 text-sm">No known allergies</span>
                                            )}
                                        </div>
                                    </div>
                                    <div>
                                        <h3 className="text-sm font-semibold text-gray-900 mb-2">Bio</h3>
                                        <p className="text-sm text-gray-600">{patient.bio || 'No bio provided.'}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Prescriptions List */}
                        <div className="lg:col-span-2 space-y-4">
                            <h2 className="text-lg font-semibold text-gray-900">Prescription History</h2>
                            {prescriptions.length === 0 ? (
                                <div className="bg-white p-8 rounded-2xl text-center text-gray-500">
                                    No prescriptions found for this patient.
                                </div>
                            ) : (
                                prescriptions.map((prescription) => (
                                    <div key={prescription.id} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                                        <div className="flex justify-between items-start mb-4">
                                            <div className="flex gap-4">
                                                <div className="p-3 bg-blue-50 text-blue-600 rounded-xl h-fit">
                                                    <FileText className="w-6 h-6" />
                                                </div>
                                                <div>
                                                    <h3 className="font-semibold text-gray-900">
                                                        {prescription.doctorName || 'Checkup'}
                                                    </h3>
                                                    <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
                                                        <Calendar className="w-4 h-4" />
                                                        {new Date(prescription.created_at).toLocaleDateString()}
                                                    </div>
                                                </div>
                                            </div>
                                            <div className={`px-3 py-1 rounded-full text-xs font-medium ${prescription.status === 'dispensed' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                                                }`}>
                                                {prescription.status.toUpperCase()}
                                            </div>
                                        </div>

                                        <div className="mb-4">
                                            <h4 className="text-sm font-medium text-gray-700 mb-2">Medicines:</h4>
                                            <div className="flex flex-wrap gap-2">
                                                {prescription.medicines.map((med: string, i: number) => (
                                                    <span key={i} className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-sm">
                                                        {med}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Doctor Notes Section */}
                                        <div className="mt-4 pt-4 border-t border-gray-50">
                                            {prescription.doctorNotes ? (
                                                <div className="bg-yellow-50 p-4 rounded-xl border border-yellow-100">
                                                    <div className="flex gap-2 items-start">
                                                        <FileText className="w-4 h-4 text-yellow-600 mt-0.5" />
                                                        <div>
                                                            <p className="text-xs font-bold text-yellow-700 uppercase mb-1">Doctor's Note</p>
                                                            <p className="text-sm text-yellow-800">{prescription.doctorNotes}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            ) : (
                                                activeNoteId === prescription.id ? (
                                                    <div className="mt-2">
                                                        <textarea
                                                            placeholder="Add clinical notes..."
                                                            className="w-full p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary-500 outline-none text-sm"
                                                            rows={3}
                                                            value={noteText}
                                                            onChange={(e) => setNoteText(e.target.value)}
                                                            autoFocus
                                                        />
                                                        <div className="flex gap-2 mt-2 justify-end">
                                                            <button
                                                                onClick={() => setActiveNoteId(null)}
                                                                className="px-3 py-1.5 text-sm text-gray-500 hover:text-gray-700"
                                                            >
                                                                Cancel
                                                            </button>
                                                            <button
                                                                onClick={() => handleAddNote(prescription.id)}
                                                                className="px-3 py-1.5 bg-primary-600 text-white rounded-lg text-sm font-medium hover:bg-primary-700"
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
                                                        className="text-primary-600 text-sm font-medium hover:text-primary-700 flex items-center gap-1"
                                                    >
                                                        <Plus className="w-4 h-4" />
                                                        Add Clinical Note
                                                    </button>
                                                )
                                            )}
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
};

export default DoctorDashboard;
