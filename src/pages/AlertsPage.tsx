import { useState, useEffect } from 'react';
import DashboardLayout from '../components/layout/DashboardLayout';
import { notificationService, Notification } from '../services/notifications';
import {
    Bell,
    AlertTriangle,
    AlertCircle,
    Info,
    CheckCircle2,
    Trash2,
    Check,
    Clock,
    Loader2
} from 'lucide-react';

const AlertsPage = () => {
    const [selectedFilter, setSelectedFilter] = useState<'all' | 'critical' | 'warning' | 'info'>('all');
    const [alerts, setAlerts] = useState<Notification[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchNotifications = async () => {
        try {
            const data = await notificationService.getAll();
            setAlerts(data);
        } catch (error) {
            console.error('Failed to load alerts', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchNotifications();
    }, []);

    const getAlertStyles = (type: string) => {
        switch (type) {
            case 'critical':
                return {
                    bg: 'bg-danger-50',
                    border: 'border-danger-200',
                    icon: <AlertCircle className="w-6 h-6 text-danger-600" />,
                    badge: 'bg-danger-100 text-danger-700',
                };
            case 'warning':
                return {
                    bg: 'bg-accent-50',
                    border: 'border-accent-200',
                    icon: <AlertTriangle className="w-6 h-6 text-accent-600" />,
                    badge: 'bg-accent-100 text-accent-700',
                };
            default:
                return {
                    bg: 'bg-primary-50',
                    border: 'border-primary-200',
                    icon: <Info className="w-6 h-6 text-primary-600" />,
                    badge: 'bg-primary-100 text-primary-700',
                };
        }
    };

    const markAsRead = async (id: string) => {
        try {
            await notificationService.markAsRead(id);
            setAlerts(prev => prev.map(a => a.id === id ? { ...a, is_read: true } : a));
        } catch (error) {
            console.error('Failed to mark as read', error);
        }
    };

    const dismissAlert = async (id: string) => {
        try {
            await notificationService.delete(id);
            setAlerts(prev => prev.filter(a => a.id !== id));
        } catch (error) {
            console.error('Failed to dismiss alert', error);
        }
    };

    const markAllAsRead = async () => {
        try {
            await notificationService.markAllAsRead();
            setAlerts(prev => prev.map(a => ({ ...a, is_read: true })));
        } catch (error) {
            console.error('Failed to mark all as read', error);
        }
    };

    const filteredAlerts = alerts.filter(a =>
        selectedFilter === 'all' || a.type === selectedFilter
    );

    const unreadCount = alerts.filter(a => !a.is_read).length;

    return (
        <DashboardLayout userRole="patient">
            <div className="max-w-4xl mx-auto space-y-6">
                {/* Header */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                        <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 flex items-center gap-3">
                            <Bell className="w-8 h-8 text-primary-600" />
                            Alerts & Notifications
                        </h1>
                        <p className="text-gray-600 mt-1">
                            {unreadCount > 0 ? `You have ${unreadCount} unread alert${unreadCount > 1 ? 's' : ''}` : 'All caught up!'}
                        </p>
                    </div>
                    {unreadCount > 0 && (
                        <button
                            onClick={markAllAsRead}
                            className="btn-secondary"
                        >
                            <Check className="w-5 h-5 mr-2" />
                            Mark All as Read
                        </button>
                    )}
                </div>

                {isLoading ? (
                    <div className="flex flex-col items-center justify-center py-20">
                        <Loader2 className="w-10 h-10 text-primary-600 animate-spin mb-4" />
                        <p className="text-gray-500">Loading notifications...</p>
                    </div>
                ) : (
                    <>
                        {/* Filters */}
                        <div className="flex flex-wrap gap-2">
                            {(['all', 'critical', 'warning', 'info'] as const).map((filter) => (
                                <button
                                    key={filter}
                                    onClick={() => setSelectedFilter(filter)}
                                    className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${selectedFilter === filter
                                        ? 'bg-primary-100 text-primary-700'
                                        : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
                                        }`}
                                >
                                    {filter.charAt(0).toUpperCase() + filter.slice(1)}
                                    {filter !== 'all' && (
                                        <span className="ml-2 text-xs">
                                            ({alerts.filter(a => a.type === filter).length})
                                        </span>
                                    )}
                                </button>
                            ))}
                        </div>

                        {/* Alerts List */}
                        <div className="space-y-4">
                            {filteredAlerts.length === 0 ? (
                                <div className="bg-white rounded-2xl shadow-card border border-gray-100 p-12 text-center">
                                    <CheckCircle2 className="w-16 h-16 text-secondary-500 mx-auto mb-4" />
                                    <h3 className="text-xl font-semibold text-gray-900 mb-2">No Alerts</h3>
                                    <p className="text-gray-600">
                                        {selectedFilter === 'all'
                                            ? "You're all caught up! No notifications at this time."
                                            : `No ${selectedFilter} alerts found.`}
                                    </p>
                                </div>
                            ) : (
                                filteredAlerts.map((alert) => {
                                    const styles = getAlertStyles(alert.type);
                                    return (
                                        <div
                                            key={alert.id}
                                            className={`bg-white rounded-2xl shadow-card border overflow-hidden transition-all duration-200 ${!alert.is_read ? `border-l-4 ${styles.border}` : 'border-gray-100'
                                                }`}
                                        >
                                            <div className={`p-4 lg:p-6 ${!alert.is_read ? styles.bg : ''}`}>
                                                <div className="flex items-start gap-4">
                                                    {/* Icon */}
                                                    <div className={`p-2 rounded-xl ${styles.badge} flex-shrink-0`}>
                                                        {styles.icon}
                                                    </div>

                                                    {/* Content */}
                                                    <div className="flex-1 min-w-0">
                                                        <div className="flex items-start justify-between gap-4">
                                                            <div>
                                                                <h3 className={`font-semibold ${!alert.is_read ? 'text-gray-900' : 'text-gray-600'}`}>
                                                                    {alert.title}
                                                                </h3>
                                                                <p className="text-gray-600 text-sm mt-1">{alert.description}</p>
                                                                <div className="flex items-center gap-2 mt-3 text-sm text-gray-400">
                                                                    <Clock className="w-4 h-4" />
                                                                    <span>{new Date(alert.created_at).toLocaleString()}</span>
                                                                    {!alert.is_read && (
                                                                        <span className="px-2 py-0.5 bg-primary-100 text-primary-700 text-xs rounded-full font-medium">
                                                                            New
                                                                        </span>
                                                                    )}
                                                                </div>
                                                            </div>

                                                            {/* Actions */}
                                                            <div className="flex items-center gap-2 flex-shrink-0">
                                                                {!alert.is_read && (
                                                                    <button
                                                                        onClick={() => markAsRead(alert.id)}
                                                                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                                                                        title="Mark as read"
                                                                    >
                                                                        <Check className="w-5 h-5 text-gray-400" />
                                                                    </button>
                                                                )}
                                                                <button
                                                                    onClick={() => dismissAlert(alert.id)}
                                                                    className="p-2 hover:bg-danger-50 rounded-lg transition-colors"
                                                                    title="Dismiss"
                                                                >
                                                                    <Trash2 className="w-5 h-5 text-gray-400 hover:text-danger-500" />
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })
                            )}
                        </div>
                    </>
                )}

                {/* Notification Settings Link */}
                <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 flex items-center justify-between">
                    <div>
                        <p className="font-medium text-gray-900">Notification Preferences</p>
                        <p className="text-sm text-gray-500">Customize how and when you receive alerts</p>
                    </div>
                    <button className="px-4 py-2 text-primary-600 font-medium hover:bg-primary-50 rounded-lg transition-colors">
                        Manage Settings
                    </button>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default AlertsPage;
