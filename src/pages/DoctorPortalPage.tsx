import { useState } from 'react';
import DashboardLayout from '../components/layout/DashboardLayout';
import {
    Search,
    Filter,
    CheckCircle2,
    AlertTriangle,
    Eye,
    Clock,
    User,
    FileText,
    MoreVertical,
    ChevronLeft,
    ChevronRight
} from 'lucide-react';

const DoctorPortalPage = () => {
    const [selectedTab, setSelectedTab] = useState<'pending' | 'reviewed' | 'all'>('pending');

    const prescriptions = [
        {
            id: 1,
            patientName: 'Sarah Johnson',
            patientAge: 45,
            date: 'Dec 8, 2024',
            time: '10:30 AM',
            medicines: 4,
            status: 'pending',
            safetyScore: 68,
            alerts: 2,
        },
        {
            id: 2,
            patientName: 'Michael Chen',
            patientAge: 62,
            date: 'Dec 8, 2024',
            time: '9:15 AM',
            medicines: 6,
            status: 'pending',
            safetyScore: 45,
            alerts: 3,
        },
        {
            id: 3,
            patientName: 'Emily Davis',
            patientAge: 34,
            date: 'Dec 7, 2024',
            time: '4:45 PM',
            medicines: 2,
            status: 'reviewed',
            safetyScore: 95,
            alerts: 0,
        },
        {
            id: 4,
            patientName: 'Robert Wilson',
            patientAge: 58,
            date: 'Dec 7, 2024',
            time: '2:30 PM',
            medicines: 5,
            status: 'reviewed',
            safetyScore: 82,
            alerts: 1,
        },
    ];

    const stats = [
        { label: 'Pending Review', value: 12, color: 'text-accent-600', bg: 'bg-accent-100' },
        { label: 'Reviewed Today', value: 8, color: 'text-secondary-600', bg: 'bg-secondary-100' },
        { label: 'Critical Alerts', value: 3, color: 'text-danger-600', bg: 'bg-danger-100' },
        { label: 'Total Patients', value: 156, color: 'text-primary-600', bg: 'bg-primary-100' },
    ];

    const filteredPrescriptions = prescriptions.filter(p =>
        selectedTab === 'all' || p.status === selectedTab
    );

    const getScoreColor = (score: number) => {
        if (score >= 80) return 'text-secondary-600 bg-secondary-100';
        if (score >= 60) return 'text-accent-600 bg-accent-100';
        return 'text-danger-600 bg-danger-100';
    };

    return (
        <DashboardLayout userRole="doctor">
            <div className="space-y-6">
                {/* Header */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                        <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">
                            Doctor Portal
                        </h1>
                        <p className="text-gray-600 mt-1">
                            Review patient prescriptions and manage safety alerts
                        </p>
                    </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    {stats.map((stat, index) => (
                        <div key={index} className="bg-white rounded-xl p-4 shadow-card border border-gray-100">
                            <p className="text-sm text-gray-500">{stat.label}</p>
                            <p className={`text-2xl font-bold mt-1 ${stat.color}`}>{stat.value}</p>
                        </div>
                    ))}
                </div>

                {/* Prescriptions Table */}
                <div className="bg-white rounded-2xl shadow-card border border-gray-100">
                    {/* Table Header */}
                    <div className="p-4 lg:p-6 border-b border-gray-100">
                        <div className="flex flex-col lg:flex-row justify-between gap-4">
                            <div className="flex gap-2">
                                {(['pending', 'reviewed', 'all'] as const).map((tab) => (
                                    <button
                                        key={tab}
                                        onClick={() => setSelectedTab(tab)}
                                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${selectedTab === tab
                                                ? 'bg-primary-100 text-primary-700'
                                                : 'text-gray-600 hover:bg-gray-100'
                                            }`}
                                    >
                                        {tab.charAt(0).toUpperCase() + tab.slice(1)}
                                    </button>
                                ))}
                            </div>
                            <div className="flex gap-3">
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                    <input
                                        type="text"
                                        placeholder="Search patients..."
                                        className="pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                                    />
                                </div>
                                <button className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors flex items-center gap-2">
                                    <Filter className="w-4 h-4" />
                                    Filter
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Table */}
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                        Patient
                                    </th>
                                    <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                        Date & Time
                                    </th>
                                    <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                        Medicines
                                    </th>
                                    <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                        Safety Score
                                    </th>
                                    <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                        Alerts
                                    </th>
                                    <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                        Status
                                    </th>
                                    <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {filteredPrescriptions.map((prescription) => (
                                    <tr key={prescription.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center">
                                                    <User className="w-5 h-5 text-primary-600" />
                                                </div>
                                                <div>
                                                    <p className="font-medium text-gray-900">{prescription.patientName}</p>
                                                    <p className="text-sm text-gray-500">{prescription.patientAge} years old</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <p className="text-gray-900">{prescription.date}</p>
                                            <p className="text-sm text-gray-500">{prescription.time}</p>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                <FileText className="w-4 h-4 text-gray-400" />
                                                <span className="text-gray-900">{prescription.medicines}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-3 py-1 rounded-full text-sm font-medium ${getScoreColor(prescription.safetyScore)}`}>
                                                {prescription.safetyScore}%
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            {prescription.alerts > 0 ? (
                                                <div className="flex items-center gap-1 text-danger-600">
                                                    <AlertTriangle className="w-4 h-4" />
                                                    <span className="font-medium">{prescription.alerts}</span>
                                                </div>
                                            ) : (
                                                <CheckCircle2 className="w-5 h-5 text-secondary-500" />
                                            )}
                                        </td>
                                        <td className="px-6 py-4">
                                            {prescription.status === 'pending' ? (
                                                <span className="flex items-center gap-1 text-accent-600 text-sm font-medium">
                                                    <Clock className="w-4 h-4" />
                                                    Pending
                                                </span>
                                            ) : (
                                                <span className="flex items-center gap-1 text-secondary-600 text-sm font-medium">
                                                    <CheckCircle2 className="w-4 h-4" />
                                                    Reviewed
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                                                    <Eye className="w-5 h-5 text-gray-400" />
                                                </button>
                                                <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                                                    <MoreVertical className="w-5 h-5 text-gray-400" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    <div className="p-4 border-t border-gray-100 flex items-center justify-between">
                        <p className="text-sm text-gray-500">
                            Showing {filteredPrescriptions.length} of {prescriptions.length} prescriptions
                        </p>
                        <div className="flex items-center gap-2">
                            <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50" disabled>
                                <ChevronLeft className="w-5 h-5 text-gray-600" />
                            </button>
                            <button className="px-3 py-1 bg-primary-100 text-primary-700 rounded-lg font-medium">1</button>
                            <button className="px-3 py-1 hover:bg-gray-100 rounded-lg text-gray-600">2</button>
                            <button className="px-3 py-1 hover:bg-gray-100 rounded-lg text-gray-600">3</button>
                            <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                                <ChevronRight className="w-5 h-5 text-gray-600" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default DoctorPortalPage;
