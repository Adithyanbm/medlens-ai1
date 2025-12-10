import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import DashboardLayout from '../components/layout/DashboardLayout';
import {
    Upload,
    FileSearch,
    AlertTriangle,
    CheckCircle2,
    TrendingUp,
    ArrowRight,
    Clock,
    Shield,
    Pill,
    Eye,
    MoreVertical,
    Loader2
} from 'lucide-react';
import { authService } from '../services/auth';
import { prescriptionService, Prescription } from '../services/prescription';
import { notificationService } from '../services/notifications';
import { getInteractionHistory } from '../services/ollamaApi';
import SafetyTrendChart from '../components/dashboard/SafetyTrendChart';
import AllergySummary from '../components/dashboard/AllergySummary';

const DashboardPage = () => {
    const currentUser = authService.getCurrentUser();
    const [isLoading, setIsLoading] = useState(true);
    const [stats, setStats] = useState({
        totalPrescriptions: 0,
        activeAlerts: 0,
        avgSafetyScore: 0,
        medicinesTracked: 0
    });
    const [recentPrescriptions, setRecentPrescriptions] = useState<Prescription[]>([]);
    const [recentActivity, setRecentActivity] = useState<any[]>([]);

    useEffect(() => {
        const loadData = async () => {
            try {
                const [prescriptions, alerts, interactions] = await Promise.all([
                    prescriptionService.getAll(),
                    notificationService.getAll(),
                    getInteractionHistory()
                ]);

                // Calculate Stats
                const unreadAlerts = alerts.filter(a => !a.is_read).length;
                const scores = prescriptions.map(p => p.safetyScore).filter(s => s > 0);
                const avgScore = scores.length > 0
                    ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length)
                    : 100;

                const uniqueMedicines = new Set<string>();
                prescriptions.forEach(p => p.medicines.forEach(m => uniqueMedicines.add(m)));
                interactions.forEach((i: any) => i.medicines.forEach((m: string) => uniqueMedicines.add(m)));

                setStats({
                    totalPrescriptions: prescriptions.length,
                    activeAlerts: unreadAlerts,
                    avgSafetyScore: avgScore,
                    medicinesTracked: uniqueMedicines.size
                });

                // Recent Prescriptions
                setRecentPrescriptions(prescriptions.slice(0, 4));

                // Recent Activity (Merge and Sort)
                const activities = [
                    ...prescriptions.map(p => ({
                        id: `p-${p.id}`,
                        action: 'Uploaded prescription',
                        time: new Date(p.uploadDate),
                        icon: <Upload className="w-4 h-4" />,
                        type: 'upload'
                    })),
                    ...interactions.map((i: any) => ({
                        id: `i-${i.created_at}`, // Use date as ID part since ID might be missing or generic
                        action: 'Checked interactions',
                        time: new Date(i.created_at),
                        icon: <CheckCircle2 className="w-4 h-4" />,
                        type: 'check'
                    })),
                    // Add alerts creation as activity? Optional. 
                ].sort((a, b) => b.time.getTime() - a.time.getTime()).slice(0, 5);

                setRecentActivity(activities);

            } catch (error) {
                console.error('Failed to load dashboard data', error);
            } finally {
                setIsLoading(false);
            }
        };

        loadData();
    }, []);

    const getStatusBadge = (score: number) => {
        if (score >= 80) return 'bg-secondary-100 text-secondary-700';
        if (score >= 60) return 'bg-accent-100 text-accent-700';
        return 'bg-danger-100 text-danger-700';
    };

    const getStatusLabel = (score: number) => {
        if (score >= 80) return 'Safe';
        if (score >= 60) return 'Warning';
        return 'Critical';
    };

    const getScoreColor = (score: number) => {
        if (score >= 80) return 'text-secondary-600';
        if (score >= 60) return 'text-accent-600';
        return 'text-danger-600';
    };

    const statCards = [
        {
            title: 'Total Prescriptions',
            value: stats.totalPrescriptions,
            change: 'All time',
            trend: 'up',
            icon: <FileSearch className="w-6 h-6" />,
            color: 'primary',
        },
        {
            title: 'Active Alerts',
            value: stats.activeAlerts,
            change: stats.activeAlerts > 0 ? 'Requires attention' : 'All clear',
            trend: stats.activeAlerts > 0 ? 'warning' : 'success',
            icon: <AlertTriangle className="w-6 h-6" />,
            color: 'danger',
        },
        {
            title: 'Safety Score',
            value: `${stats.avgSafetyScore}%`,
            change: 'Average score',
            trend: stats.avgSafetyScore >= 80 ? 'up' : 'warning',
            icon: <Shield className="w-6 h-6" />,
            color: 'secondary',
        },
        {
            title: 'Medicines Tracked',
            value: stats.medicinesTracked,
            change: 'Unique medicines',
            trend: 'success',
            icon: <Pill className="w-6 h-6" />,
            color: 'accent',
        },
    ];

    const colorStyles = {
        primary: {
            bg: 'bg-primary-100',
            icon: 'text-primary-600',
            gradient: 'from-primary-500 to-primary-600',
        },
        secondary: {
            bg: 'bg-secondary-100',
            icon: 'text-secondary-600',
            gradient: 'from-secondary-500 to-secondary-600',
        },
        accent: {
            bg: 'bg-accent-100',
            icon: 'text-accent-600',
            gradient: 'from-accent-500 to-accent-600',
        },
        danger: {
            bg: 'bg-danger-100',
            icon: 'text-danger-600',
            gradient: 'from-danger-500 to-danger-600',
        },
    };

    if (isLoading) {
        return (
            <DashboardLayout userRole="patient">
                <div className="flex flex-col items-center justify-center min-h-[60vh] text-gray-500">
                    <Loader2 className="w-10 h-10 animate-spin mb-4 text-primary-600" />
                    <p>Loading dashboard...</p>
                </div>
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout userRole="patient">
            <div className="space-y-6">
                {/* Welcome Header */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                        <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">
                            Welcome back, {currentUser?.name || 'User'}! 👋
                        </h1>
                        <p className="text-gray-600 mt-1">
                            Here's an overview of your medication safety status
                        </p>
                    </div>
                    <div className="flex gap-3">
                        <Link to="/upload" className="btn-primary">
                            <Upload className="w-5 h-5 mr-2" />
                            Upload Prescription
                        </Link>
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
                    {statCards.map((stat, index) => (
                        <div
                            key={index}
                            className="bg-white rounded-2xl p-6 shadow-card hover:shadow-card-hover transition-all duration-300 border border-gray-100"
                        >
                            <div className="flex items-start justify-between">
                                <div className={`p-3 rounded-xl ${colorStyles[stat.color as keyof typeof colorStyles].bg}`}>
                                    <div className={colorStyles[stat.color as keyof typeof colorStyles].icon}>
                                        {stat.icon}
                                    </div>
                                </div>
                                <button className="p-1 hover:bg-gray-100 rounded-lg transition-colors">
                                    <MoreVertical className="w-5 h-5 text-gray-400" />
                                </button>
                            </div>
                            <div className="mt-4">
                                <p className="text-sm text-gray-500">{stat.title}</p>
                                <p className="text-3xl font-bold text-gray-900 mt-1">{stat.value}</p>
                                <p className={`text-sm mt-2 flex items-center gap-1 ${stat.trend === 'up' || stat.trend === 'success' ? 'text-secondary-600' :
                                    stat.trend === 'warning' ? 'text-danger-600' : 'text-gray-500'
                                    }`}>
                                    {stat.trend === 'up' && <TrendingUp className="w-3 h-3" />}
                                    {stat.change}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Visual Insights */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2">
                        <SafetyTrendChart data={recentPrescriptions.map(p => ({ date: p.uploadDate, score: p.safetyScore }))} />
                    </div>
                    <div>
                        <AllergySummary />
                    </div>
                </div>

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Recent Prescriptions */}
                    <div className="lg:col-span-2 bg-white rounded-2xl shadow-card border border-gray-100">
                        <div className="p-6 border-b border-gray-100">
                            <div className="flex items-center justify-between">
                                <h2 className="text-lg font-semibold text-gray-900">Recent Prescriptions</h2>
                                <Link to="/prescriptions" className="text-sm text-primary-600 font-medium hover:text-primary-700 flex items-center gap-1">
                                    View all
                                    <ArrowRight className="w-4 h-4" />
                                </Link>
                            </div>
                        </div>
                        <div className="divide-y divide-gray-100">
                            {recentPrescriptions.length === 0 ? (
                                <div className="p-8 text-center text-gray-500">
                                    No prescriptions uploaded yet.
                                </div>
                            ) : (
                                recentPrescriptions.map((prescription) => (
                                    <div
                                        key={prescription.id}
                                        className="p-4 hover:bg-gray-50 transition-colors"
                                    >
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-4">
                                                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${colorStyles[prescription.safetyScore >= 80 ? 'secondary' : prescription.safetyScore >= 60 ? 'accent' : 'danger'].gradient} flex items-center justify-center text-white`}>
                                                    <FileSearch className="w-6 h-6" />
                                                </div>
                                                <div>
                                                    <p className="font-medium text-gray-900">{prescription.doctorName}</p>
                                                    <div className="flex items-center gap-3 mt-1">
                                                        <span className="text-sm text-gray-500">{new Date(prescription.uploadDate).toLocaleDateString()}</span>
                                                        <span className="text-sm text-gray-400">•</span>
                                                        <span className="text-sm text-gray-500">{prescription.medicines.length} medicines</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-4">
                                                <div className="text-right hidden sm:block">
                                                    <p className={`text-lg font-bold ${getScoreColor(prescription.safetyScore)}`}>
                                                        {prescription.safetyScore}%
                                                    </p>
                                                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${getStatusBadge(prescription.safetyScore)}`}>
                                                        {getStatusLabel(prescription.safetyScore)}
                                                    </span>
                                                </div>
                                                <Link
                                                    to={`/prescriptions/${prescription.id}`}
                                                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                                                >
                                                    <Eye className="w-5 h-5 text-gray-400" />
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>

                    {/* Activity Timeline */}
                    <div className="bg-white rounded-2xl shadow-card border border-gray-100">
                        <div className="p-6 border-b border-gray-100">
                            <h2 className="text-lg font-semibold text-gray-900">Recent Activity</h2>
                        </div>
                        <div className="p-6">
                            <div className="space-y-6">
                                {recentActivity.length === 0 ? (
                                    <div className="text-center text-gray-500">No recent activity.</div>
                                ) : (
                                    recentActivity.map((activity, index) => (
                                        <div key={activity.id} className="flex gap-4">
                                            <div className="relative">
                                                <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center text-primary-600">
                                                    {activity.icon}
                                                </div>
                                                {index < recentActivity.length - 1 && (
                                                    <div className="absolute top-10 left-1/2 -translate-x-1/2 w-0.5 h-6 bg-gray-200" />
                                                )}
                                            </div>
                                            <div className="flex-1 pt-1">
                                                <p className="text-sm font-medium text-gray-900">{activity.action}</p>
                                                <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                                                    <Clock className="w-3 h-3" />
                                                    {activity.time.toLocaleDateString()} {activity.time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                </p>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="bg-gradient-to-r from-primary-600 to-secondary-600 rounded-2xl p-6 lg:p-8 text-white">
                    <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
                        <div>
                            <h3 className="text-xl font-bold mb-2">Need to check a drug interaction?</h3>
                            <p className="text-white/80">
                                Quickly verify if your medicines are safe to take together
                            </p>
                        </div>
                        <Link
                            to="/check-interaction"
                            className="inline-flex items-center px-6 py-3 bg-white text-primary-700 font-semibold rounded-xl hover:bg-white/90 transition-colors shadow-lg"
                        >
                            Check Interaction
                            <ArrowRight className="w-5 h-5 ml-2" />
                        </Link>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default DashboardPage;
