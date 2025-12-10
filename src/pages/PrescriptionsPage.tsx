import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import DashboardLayout from '../components/layout/DashboardLayout';
import { prescriptionService, Prescription } from '../services/prescription';
import {
    FileText,
    Calendar,
    Pill,
    Eye,
    Download,
    Trash2,
    Search,
    Filter,
    Plus,
    CheckCircle2,
    Clock,
    AlertTriangle,
    ChevronRight,
    MoreVertical
} from 'lucide-react';

const PrescriptionsPage = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [filterStatus, setFilterStatus] = useState<string>('all');
    const [selectedPrescription, setSelectedPrescription] = useState<string | null>(null);
    const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadData = async () => {
            try {
                const data = await prescriptionService.getAll();
                setPrescriptions(data);
            } catch (error) {
                console.error('Failed to load prescriptions', error);
            } finally {
                setLoading(false);
            }
        };
        loadData();
    }, []);

    const getStatusBadge = (status: string, safetyScore: number) => {
        switch (status) {
            case 'analyzed':
                if (safetyScore >= 80) {
                    return (
                        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-secondary-100 text-secondary-700">
                            <CheckCircle2 className="w-3 h-3" />
                            Safe
                        </span>
                    );
                }
                return (
                    <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-accent-100 text-accent-700">
                        <AlertTriangle className="w-3 h-3" />
                        Caution
                    </span>
                );
            case 'warning':
                return (
                    <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-danger-100 text-danger-700">
                        <AlertTriangle className="w-3 h-3" />
                        Interaction Alert
                    </span>
                );
            case 'pending':
                return (
                    <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
                        <Clock className="w-3 h-3" />
                        Pending
                    </span>
                );
            default:
                return null;
        }
    };

    const filteredPrescriptions = prescriptions.filter(p => {
        const doctor = p.doctorName || '';
        const hospital = p.hospitalName || '';

        const matchesSearch =
            doctor.toLowerCase().includes(searchQuery.toLowerCase()) ||
            hospital.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.medicines.some(m => m.toLowerCase().includes(searchQuery.toLowerCase()));

        const matchesFilter = filterStatus === 'all' || p.status === filterStatus;

        return matchesSearch && matchesFilter;
    });

    const formatDate = (dateStr: string) => {
        const date = new Date(dateStr);
        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    };

    return (
        <DashboardLayout userRole="patient">
            <div className="max-w-6xl mx-auto space-y-6">
                {/* Header */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                        <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">
                            My Prescriptions
                        </h1>
                        <p className="text-gray-600 mt-1">
                            View and manage your prescription history
                        </p>
                    </div>
                    <Link to="/upload" className="btn-primary">
                        <Plus className="w-5 h-5 mr-2" />
                        Upload New
                    </Link>
                </div>

                {loading ? (
                    <div className="flex justify-center py-12">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
                    </div>
                ) : (
                    <>
                        {/* Stats Cards */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-primary-100 rounded-lg">
                                        <FileText className="w-5 h-5 text-primary-600" />
                                    </div>
                                    <div>
                                        <p className="text-2xl font-bold text-gray-900">{prescriptions.length}</p>
                                        <p className="text-sm text-gray-500">Total Prescriptions</p>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-secondary-100 rounded-lg">
                                        <CheckCircle2 className="w-5 h-5 text-secondary-600" />
                                    </div>
                                    <div>
                                        <p className="text-2xl font-bold text-gray-900">
                                            {prescriptions.filter(p => p.status === 'analyzed' && p.safetyScore >= 80).length}
                                        </p>
                                        <p className="text-sm text-gray-500">Safe Prescriptions</p>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-danger-100 rounded-lg">
                                        <AlertTriangle className="w-5 h-5 text-danger-600" />
                                    </div>
                                    <div>
                                        <p className="text-2xl font-bold text-gray-900">
                                            {prescriptions.filter(p => p.status === 'warning' || p.safetyScore < 60).length}
                                        </p>
                                        <p className="text-sm text-gray-500">Needs Attention</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Search and Filter */}
                        <div className="flex flex-col sm:flex-row gap-4">
                            <div className="relative flex-1">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Search by doctor, hospital, or medicine..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                />
                            </div>
                            <div className="flex items-center gap-2">
                                <Filter className="w-5 h-5 text-gray-400" />
                                <select
                                    value={filterStatus}
                                    onChange={(e) => setFilterStatus(e.target.value)}
                                    className="px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white"
                                >
                                    <option value="all">All Status</option>
                                    <option value="analyzed">Analyzed</option>
                                    <option value="warning">Warnings</option>
                                    <option value="pending">Pending</option>
                                </select>
                            </div>
                        </div>

                        {/* Prescriptions List */}
                        <div className="bg-white rounded-2xl shadow-card border border-gray-100 overflow-hidden">
                            <div className="divide-y divide-gray-100">
                                {filteredPrescriptions.length === 0 ? (
                                    <div className="p-12 text-center">
                                        <FileText className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                                        <h3 className="text-lg font-medium text-gray-900 mb-1">No prescriptions found</h3>
                                        <p className="text-gray-500">
                                            {searchQuery ? 'Try a different search term' : 'Upload your first prescription to get started'}
                                        </p>
                                    </div>
                                ) : (
                                    filteredPrescriptions.map((prescription) => (
                                        <div
                                            key={prescription.id}
                                            className={`p-4 lg:p-6 hover:bg-gray-50 transition-colors cursor-pointer ${selectedPrescription === prescription.id ? 'bg-primary-50' : ''
                                                }`}
                                            onClick={() => setSelectedPrescription(
                                                selectedPrescription === prescription.id ? null : prescription.id
                                            )}
                                        >
                                            <div className="flex items-start gap-4">
                                                {/* Icon */}
                                                <div className={`p-3 rounded-xl flex-shrink-0 ${prescription.status === 'warning'
                                                    ? 'bg-danger-100'
                                                    : prescription.status === 'pending'
                                                        ? 'bg-gray-100'
                                                        : 'bg-primary-100'
                                                    }`}>
                                                    <FileText className={`w-6 h-6 ${prescription.status === 'warning'
                                                        ? 'text-danger-600'
                                                        : prescription.status === 'pending'
                                                            ? 'text-gray-600'
                                                            : 'text-primary-600'
                                                        }`} />
                                                </div>

                                                {/* Content */}
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-start justify-between gap-4">
                                                        <div>
                                                            <h3 className="font-semibold text-gray-900">{prescription.doctorName || 'Unknown Doctor'}</h3>
                                                            <p className="text-sm text-gray-500">{prescription.hospitalName || 'Health Record'}</p>
                                                        </div>
                                                        <div className="flex items-center gap-2">
                                                            {getStatusBadge(prescription.status, prescription.safetyScore)}
                                                            <button className="p-1 hover:bg-gray-100 rounded-lg">
                                                                <MoreVertical className="w-4 h-4 text-gray-400" />
                                                            </button>
                                                        </div>
                                                    </div>

                                                    {/* Medicines */}
                                                    <div className="mt-3 flex flex-wrap gap-2">
                                                        {prescription.medicines.slice(0, 3).map((medicine, idx) => (
                                                            <span
                                                                key={idx}
                                                                className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 rounded-lg text-xs text-gray-700"
                                                            >
                                                                <Pill className="w-3 h-3" />
                                                                {medicine}
                                                            </span>
                                                        ))}
                                                        {prescription.medicines.length > 3 && (
                                                            <span className="px-2 py-1 text-xs text-gray-500">
                                                                +{prescription.medicines.length - 3} more
                                                            </span>
                                                        )}
                                                    </div>

                                                    {/* Footer */}
                                                    <div className="mt-3 flex items-center justify-between">
                                                        <div className="flex items-center gap-2 text-sm text-gray-500">
                                                            <Calendar className="w-4 h-4" />
                                                            {formatDate(prescription.uploadDate)}
                                                        </div>
                                                        <div className="flex items-center gap-2">
                                                            <Link
                                                                to={`/results`}
                                                                state={{ medicines: prescription.medicines }}
                                                                className="inline-flex items-center gap-1 text-sm text-primary-600 hover:text-primary-700"
                                                                onClick={(e) => e.stopPropagation()}
                                                            >
                                                                <Eye className="w-4 h-4" />
                                                                View Details
                                                            </Link>
                                                            <ChevronRight className="w-4 h-4 text-gray-400" />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Expanded Details */}
                                            {selectedPrescription === prescription.id && (
                                                <div className="mt-4 pt-4 border-t border-gray-100">
                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                        <div>
                                                            <h4 className="text-sm font-medium text-gray-900 mb-2">All Medicines</h4>
                                                            <div className="space-y-2">
                                                                {prescription.medicines.map((medicine, idx) => (
                                                                    <div
                                                                        key={idx}
                                                                        className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg"
                                                                    >
                                                                        <Pill className="w-4 h-4 text-primary-600" />
                                                                        <span className="text-sm text-gray-700">{medicine}</span>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        </div>
                                                        <div>
                                                            <h4 className="text-sm font-medium text-gray-900 mb-2">Actions</h4>
                                                            <div className="flex flex-wrap gap-2">
                                                                <Link
                                                                    to={`/results`}
                                                                    state={{ medicines: prescription.medicines }}
                                                                    className="btn-secondary text-sm"
                                                                    onClick={(e) => e.stopPropagation()}
                                                                >
                                                                    <Eye className="w-4 h-4 mr-1" />
                                                                    View Analysis
                                                                </Link>
                                                                <button className="btn-secondary text-sm">
                                                                    <Download className="w-4 h-4 mr-1" />
                                                                    Download
                                                                </button>
                                                                <button className="btn-secondary text-sm text-danger-600 hover:bg-danger-50">
                                                                    <Trash2 className="w-4 h-4 mr-1" />
                                                                    Delete
                                                                </button>
                                                            </div>
                                                            {prescription.status !== 'pending' && (
                                                                <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                                                                    <div className="flex items-center justify-between">
                                                                        <span className="text-sm text-gray-600">Safety Score</span>
                                                                        <span className={`text-lg font-bold ${prescription.safetyScore >= 80
                                                                            ? 'text-secondary-600'
                                                                            : prescription.safetyScore >= 60
                                                                                ? 'text-accent-600'
                                                                                : 'text-danger-600'
                                                                            }`}>
                                                                            {prescription.safetyScore}/100
                                                                        </span>
                                                                    </div>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    </>
                )}
            </div>
        </DashboardLayout>
    );
};

export default PrescriptionsPage;
