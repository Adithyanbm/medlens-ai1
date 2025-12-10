import { useState } from 'react';
import { Link } from 'react-router-dom';
import Sidebar from './Sidebar';
import AIChatbot from '../chat/AIChatbot';
import {
    Bell,
    Search,
    User,
    ChevronDown,
    Menu,
    X
} from 'lucide-react';

interface DashboardLayoutProps {
    children: React.ReactNode;
    userRole?: 'patient' | 'doctor' | 'pharmacist' | 'admin';
}

import { useNavigate } from 'react-router-dom';
import { authService } from '../../services/auth';
// ... imports

const DashboardLayout = ({ children, userRole: propUserRole = 'patient' }: DashboardLayoutProps) => {
    const navigate = useNavigate();
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [profileMenuOpen, setProfileMenuOpen] = useState(false);

    // Get user from auth service or fallback to default
    const currentUser = authService.getCurrentUser();

    const user = {
        name: currentUser?.name || 'Guest User',
        email: currentUser?.email || 'guest@medlens.ai',
        role: currentUser?.role || propUserRole,
        avatar: null,
    };

    const handleLogout = () => {
        authService.logout();
        navigate('/login');
    };

    const notifications = [
        { id: 1, title: 'New interaction alert', time: '5 min ago', unread: true },
        { id: 2, title: 'Prescription analyzed', time: '1 hour ago', unread: true },
        { id: 3, title: 'Refill reminder', time: '2 hours ago', unread: false },
    ];

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Desktop Sidebar */}
            <div className="hidden lg:block">
                <Sidebar
                    isCollapsed={sidebarCollapsed}
                    onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
                    userRole={user.role as any}
                />
            </div>

            {/* Mobile Sidebar Overlay */}
            {mobileMenuOpen && (
                <div className="lg:hidden fixed inset-0 z-50">
                    <div
                        className="absolute inset-0 bg-black/50"
                        onClick={() => setMobileMenuOpen(false)}
                    />
                    <div className="absolute left-0 top-0 h-full">
                        <Sidebar
                            isCollapsed={false}
                            onToggle={() => setMobileMenuOpen(false)}
                            userRole={user.role as any}
                        />
                    </div>
                </div>
            )}

            {/* Main Content */}
            <div className={`transition-all duration-300 ${sidebarCollapsed ? 'lg:ml-20' : 'lg:ml-64'}`}>
                {/* Top Header */}
                <header className="sticky top-0 z-30 bg-white border-b border-gray-200">
                    <div className="flex items-center justify-between h-16 px-4 lg:px-6">
                        {/* Left: Mobile Menu + Search */}
                        <div className="flex items-center gap-4">
                            <button
                                onClick={() => setMobileMenuOpen(true)}
                                className="lg:hidden p-2 rounded-lg hover:bg-gray-100"
                                aria-label="Open menu"
                            >
                                <Menu className="w-6 h-6 text-gray-600" />
                            </button>

                            {/* Search Bar */}
                            <div className="hidden sm:flex items-center">
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                    <input
                                        type="text"
                                        placeholder="Search medicines, prescriptions..."
                                        className="w-64 lg:w-80 pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Right: Notifications + Profile */}
                        <div className="flex items-center gap-3">
                            {/* Notifications */}
                            <div className="relative group">
                                <button className="relative p-2 rounded-xl hover:bg-gray-100 transition-colors">
                                    <Bell className="w-6 h-6 text-gray-600" />
                                    <span className="absolute top-1 right-1 w-4 h-4 bg-danger-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                                        2
                                    </span>
                                </button>

                                {/* Notification Dropdown */}
                                <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-lg border border-gray-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                                    <div className="p-4 border-b border-gray-100">
                                        <h3 className="font-semibold text-gray-900">Notifications</h3>
                                    </div>
                                    <div className="max-h-80 overflow-y-auto">
                                        {notifications.map((notif) => (
                                            <div
                                                key={notif.id}
                                                className={`p-4 border-b border-gray-50 hover:bg-gray-50 cursor-pointer ${notif.unread ? 'bg-primary-50/50' : ''
                                                    }`}
                                            >
                                                <div className="flex items-start gap-3">
                                                    {notif.unread && (
                                                        <span className="w-2 h-2 bg-primary-500 rounded-full mt-2 flex-shrink-0" />
                                                    )}
                                                    <div className="flex-1">
                                                        <p className={`text-sm ${notif.unread ? 'font-medium text-gray-900' : 'text-gray-600'}`}>
                                                            {notif.title}
                                                        </p>
                                                        <p className="text-xs text-gray-400 mt-1">{notif.time}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    <Link
                                        to="/alerts"
                                        className="block p-4 text-center text-sm text-primary-600 font-medium hover:bg-gray-50"
                                    >
                                        View all notifications
                                    </Link>
                                </div>
                            </div>

                            {/* Profile */}
                            <div className="relative">
                                <button
                                    onClick={() => setProfileMenuOpen(!profileMenuOpen)}
                                    className="flex items-center gap-3 p-2 rounded-xl hover:bg-gray-100 transition-colors"
                                >
                                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center text-white font-semibold">
                                        {user.name.charAt(0)}
                                    </div>
                                    <div className="hidden md:block text-left">
                                        <p className="text-sm font-medium text-gray-900">{user.name}</p>
                                        <p className="text-xs text-gray-500 capitalize">{user.role}</p>
                                    </div>
                                    <ChevronDown className="hidden md:block w-4 h-4 text-gray-400" />
                                </button>

                                {/* Profile Dropdown */}
                                {profileMenuOpen && (
                                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-100">
                                        <div className="p-4 border-b border-gray-100">
                                            <p className="font-medium text-gray-900">{user.name}</p>
                                            <p className="text-sm text-gray-500">{user.email}</p>
                                        </div>
                                        <div className="py-2">
                                            <Link
                                                to="/profile"
                                                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                                                onClick={() => setProfileMenuOpen(false)}
                                            >
                                                Your Profile
                                            </Link>
                                            <Link
                                                to="/settings"
                                                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                                                onClick={() => setProfileMenuOpen(false)}
                                            >
                                                Settings
                                            </Link>
                                            <hr className="my-2 border-gray-100" />
                                            <button
                                                onClick={handleLogout}
                                                className="block w-full text-left px-4 py-2 text-sm text-danger-600 hover:bg-danger-50"
                                            >
                                                Sign out
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </header>

                {/* Page Content */}
                <main className="p-4 lg:p-6">
                    {children}
                </main>
            </div>

            {/* AI Chatbot */}
            <AIChatbot />
        </div>
    );
};

export default DashboardLayout;
