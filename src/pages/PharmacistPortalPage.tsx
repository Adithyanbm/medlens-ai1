import { useState } from 'react';
import DashboardLayout from '../components/layout/DashboardLayout';
import {
    Search,
    Barcode,
    CheckCircle2,
    AlertTriangle,
    Package,
    User,
    Clock,
    RefreshCw,
    Printer,
    MessageSquare,
    Shield
} from 'lucide-react';

const PharmacistPortalPage = () => {
    const [scanResult, setScanResult] = useState<null | { verified: boolean; medicine: string }>(null);

    const dispensingQueue = [
        {
            id: 1,
            patientName: 'Sarah Johnson',
            prescribedBy: 'Dr. Smith',
            medicines: ['Aspirin 100mg', 'Metformin 500mg'],
            status: 'ready',
            time: '10 min ago',
            verified: true,
        },
        {
            id: 2,
            patientName: 'Michael Chen',
            prescribedBy: 'Dr. Patel',
            medicines: ['Lisinopril 10mg', 'Warfarin 5mg', 'Atorvastatin 20mg'],
            status: 'checking',
            time: '25 min ago',
            verified: false,
            hasInteraction: true,
        },
        {
            id: 3,
            patientName: 'Emily Davis',
            prescribedBy: 'Dr. Wilson',
            medicines: ['Omeprazole 20mg'],
            status: 'ready',
            time: '1 hour ago',
            verified: true,
        },
    ];

    const stats = [
        { label: 'In Queue', value: 8, icon: <Package className="w-5 h-5" />, color: 'text-primary-600', bg: 'bg-primary-100' },
        { label: 'Dispensed Today', value: 45, icon: <CheckCircle2 className="w-5 h-5" />, color: 'text-secondary-600', bg: 'bg-secondary-100' },
        { label: 'Alerts', value: 2, icon: <AlertTriangle className="w-5 h-5" />, color: 'text-danger-600', bg: 'bg-danger-100' },
    ];

    const simulateScan = () => {
        setScanResult({
            verified: true,
            medicine: 'Aspirin 100mg (Bayer)',
        });
        setTimeout(() => setScanResult(null), 5000);
    };

    return (
        <DashboardLayout userRole="pharmacist">
            <div className="space-y-6">
                {/* Header */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                        <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">
                            Pharmacist Portal
                        </h1>
                        <p className="text-gray-600 mt-1">
                            Manage dispensing queue and verify medications
                        </p>
                    </div>
                    <button className="btn-secondary flex items-center gap-2">
                        <RefreshCw className="w-5 h-5" />
                        Refresh Queue
                    </button>
                </div>

                {/* Stats Row */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {stats.map((stat, index) => (
                        <div key={index} className="bg-white rounded-xl p-4 shadow-card border border-gray-100 flex items-center gap-4">
                            <div className={`p-3 rounded-xl ${stat.bg}`}>
                                <div className={stat.color}>{stat.icon}</div>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">{stat.label}</p>
                                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Dispensing Queue */}
                    <div className="lg:col-span-2 bg-white rounded-2xl shadow-card border border-gray-100">
                        <div className="p-4 lg:p-6 border-b border-gray-100">
                            <div className="flex items-center justify-between">
                                <h2 className="text-lg font-semibold text-gray-900">Dispensing Queue</h2>
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                    <input
                                        type="text"
                                        placeholder="Search..."
                                        className="pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="divide-y divide-gray-100">
                            {dispensingQueue.map((item) => (
                                <div key={item.id} className={`p-4 hover:bg-gray-50 ${item.hasInteraction ? 'bg-danger-50/50' : ''}`}>
                                    <div className="flex items-start justify-between">
                                        <div className="flex items-start gap-3">
                                            <div className={`p-2 rounded-full ${item.verified ? 'bg-secondary-100' : 'bg-accent-100'}`}>
                                                <User className={`w-5 h-5 ${item.verified ? 'text-secondary-600' : 'text-accent-600'}`} />
                                            </div>
                                            <div>
                                                <p className="font-medium text-gray-900">{item.patientName}</p>
                                                <p className="text-sm text-gray-500">Prescribed by {item.prescribedBy}</p>
                                                <div className="flex flex-wrap gap-2 mt-2">
                                                    {item.medicines.map((med, idx) => (
                                                        <span key={idx} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-lg">
                                                            {med}
                                                        </span>
                                                    ))}
                                                </div>
                                                {item.hasInteraction && (
                                                    <div className="flex items-center gap-1 mt-2 text-danger-600 text-sm">
                                                        <AlertTriangle className="w-4 h-4" />
                                                        <span>Drug interaction detected</span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <div className="flex items-center gap-1 text-gray-400 text-sm mb-2">
                                                <Clock className="w-4 h-4" />
                                                {item.time}
                                            </div>
                                            <div className="flex gap-2">
                                                <button className="p-2 hover:bg-gray-200 rounded-lg transition-colors">
                                                    <MessageSquare className="w-4 h-4 text-gray-500" />
                                                </button>
                                                <button className="p-2 hover:bg-gray-200 rounded-lg transition-colors">
                                                    <Printer className="w-4 h-4 text-gray-500" />
                                                </button>
                                                <button className="px-3 py-1 bg-primary-100 text-primary-700 rounded-lg text-sm font-medium hover:bg-primary-200 transition-colors">
                                                    Dispense
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Quick Tools */}
                    <div className="space-y-6">
                        {/* Barcode Scanner */}
                        <div className="bg-white rounded-2xl shadow-card border border-gray-100 p-6">
                            <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                <Barcode className="w-5 h-5 text-primary-600" />
                                Medicine Verification
                            </h3>
                            <button
                                onClick={simulateScan}
                                className="w-full py-8 border-2 border-dashed border-gray-300 rounded-xl hover:border-primary-400 hover:bg-primary-50 transition-colors flex flex-col items-center gap-3"
                            >
                                <div className="p-4 bg-gray-100 rounded-2xl">
                                    <Barcode className="w-8 h-8 text-gray-500" />
                                </div>
                                <span className="text-gray-600 font-medium">Click to Scan Barcode</span>
                                <span className="text-sm text-gray-400">Or connect a scanner device</span>
                            </button>

                            {scanResult && (
                                <div className={`mt-4 p-4 rounded-xl flex items-center gap-3 ${scanResult.verified ? 'bg-secondary-50 border border-secondary-200' : 'bg-danger-50 border border-danger-200'
                                    }`}>
                                    {scanResult.verified ? (
                                        <Shield className="w-6 h-6 text-secondary-600" />
                                    ) : (
                                        <AlertTriangle className="w-6 h-6 text-danger-600" />
                                    )}
                                    <div>
                                        <p className={`font-medium ${scanResult.verified ? 'text-secondary-700' : 'text-danger-700'}`}>
                                            {scanResult.verified ? 'Verified Authentic' : 'Verification Failed'}
                                        </p>
                                        <p className="text-sm text-gray-600">{scanResult.medicine}</p>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Quick Actions */}
                        <div className="bg-gradient-to-br from-primary-600 to-secondary-600 rounded-2xl p-6 text-white">
                            <h3 className="font-semibold mb-4">Quick Actions</h3>
                            <div className="space-y-3">
                                <button className="w-full py-3 bg-white/10 hover:bg-white/20 rounded-xl text-left px-4 transition-colors">
                                    Check Drug Interaction
                                </button>
                                <button className="w-full py-3 bg-white/10 hover:bg-white/20 rounded-xl text-left px-4 transition-colors">
                                    View Patient History
                                </button>
                                <button className="w-full py-3 bg-white/10 hover:bg-white/20 rounded-xl text-left px-4 transition-colors">
                                    Print Labels
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default PharmacistPortalPage;
