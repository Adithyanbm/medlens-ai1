import { useState, useEffect } from 'react';
import {
    Clock,
    CheckCircle2,
    AlertTriangle,
    PackageCheck,
    Pill,
    User,
    Loader2
} from 'lucide-react';
import DashboardLayout from '../components/layout/DashboardLayout';
import { portalService } from '../services/portal';

const PharmacistDashboard = () => {
    const [prescriptions, setPrescriptions] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const loadQueue = async () => {
        setIsLoading(true);
        try {
            const list = await portalService.getAllPrescriptions();
            setPrescriptions(list);
        } catch (error) {
            console.error('Failed to load queue', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        loadQueue();
    }, []);

    const handleDispense = async (id: string) => {
        if (!confirm('Confirm dispensing? This action cannot be undone.')) return;
        try {
            await portalService.dispensePrescription(id);
            // Refresh
            loadQueue();
        } catch (error) {
            alert('Dispense failed');
        }
    };

    return (
        <DashboardLayout userRole="pharmacist">
            <div className="space-y-6">
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Pharmacy Queue</h1>
                        <p className="text-gray-500">Review and dispense recent prescriptions.</p>
                    </div>
                    <button
                        onClick={loadQueue}
                        className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"
                    >
                        Refresh Queue
                    </button>
                </div>

                {isLoading ? (
                    <div className="flex justify-center py-12">
                        <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-4">
                        {prescriptions.map((p) => {
                            const isDispensed = p.status === 'dispensed';
                            const hasWarning = p.warnings && p.warnings.length > 0;
                            const isCritical = p.safetyScore < 60; // Assuming safetyScore is available

                            return (
                                <div key={p.id} className={`bg-white p-6 rounded-2xl shadow-sm border ${isDispensed ? 'border-green-100 bg-green-50/30' :
                                        isCritical ? 'border-red-100 bg-red-50/30' : 'border-gray-100'
                                    }`}>
                                    <div className="flex flex-col lg:flex-row justify-between gap-6">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-3 mb-2">
                                                <span className={`px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wide ${isDispensed ? 'bg-green-100 text-green-700' :
                                                        'bg-blue-100 text-blue-700'
                                                    }`}>
                                                    {p.status}
                                                </span>
                                                <span className="text-sm text-gray-500 flex items-center gap-1">
                                                    <Clock className="w-3 h-3" />
                                                    {new Date(p.created_at).toLocaleString()}
                                                </span>
                                                <span className="text-sm text-gray-500 flex items-center gap-1">
                                                    <User className="w-3 h-3" />
                                                    User ID: ...{p.user_id.slice(-6)}
                                                </span>
                                            </div>

                                            <h3 className="text-lg font-bold text-gray-900 mb-1">
                                                {p.medicines.length} Medicines Prescribed
                                            </h3>

                                            <div className="flex flex-wrap gap-2 mt-3">
                                                {p.medicines.map((m: string, i: number) => (
                                                    <span key={i} className="px-3 py-1.5 bg-gray-100 rounded-lg text-sm text-gray-700 flex items-center gap-2">
                                                        <Pill className="w-3 h-3 text-gray-400" />
                                                        {m}
                                                    </span>
                                                ))}
                                            </div>

                                            {hasWarning && (
                                                <div className="mt-4 p-3 bg-yellow-50 text-yellow-800 rounded-lg text-sm flex items-start gap-2 border border-yellow-100">
                                                    <AlertTriangle className="w-4 h-4 mt-0.5 shrink-0" />
                                                    <div>
                                                        <p className="font-semibold">AI Warnings:</p>
                                                        <ul className="list-disc list-inside">
                                                            {p.warnings.map((w: string, i: number) => <li key={i}>{w}</li>)}
                                                        </ul>
                                                    </div>
                                                </div>
                                            )}
                                        </div>

                                        <div className="flex flex-col items-end justify-center min-w-[200px] border-t lg:border-t-0 lg:border-l border-gray-100 pt-4 lg:pt-0 lg:pl-6">
                                            {isDispensed ? (
                                                <div className="text-center">
                                                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center text-green-600 mx-auto mb-2">
                                                        <CheckCircle2 className="w-6 h-6" />
                                                    </div>
                                                    <p className="font-bold text-green-800">Dispensed</p>
                                                    <p className="text-xs text-green-600">
                                                        {new Date(p.dispensedAt).toLocaleDateString()}
                                                    </p>
                                                </div>
                                            ) : (
                                                <button
                                                    onClick={() => handleDispense(p.id)}
                                                    className="w-full py-3 bg-primary-600 text-white rounded-xl font-bold hover:bg-primary-700 transition-colors shadow-lg shadow-primary-600/20 flex items-center justify-center gap-2"
                                                >
                                                    <PackageCheck className="w-5 h-5" />
                                                    Mark Dispensed
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
};

export default PharmacistDashboard;
