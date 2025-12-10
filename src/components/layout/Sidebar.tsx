import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
    Pill,
    Shield,
    LayoutDashboard,
    Upload,
    FileSearch,
    Bell,
    Settings,
    HelpCircle,
    LogOut,
    ChevronLeft,
    Stethoscope,
    Building2,
    Users,
    BarChart3,
    Menu
} from 'lucide-react';

interface SidebarProps {
    isCollapsed: boolean;
    onToggle: () => void;
    userRole?: 'patient' | 'doctor' | 'pharmacist' | 'admin';
}

interface NavItem {
    name: string;
    href: string;
    icon: React.ReactNode;
    badge?: number;
    roles?: string[];
}

const Sidebar = ({ isCollapsed, onToggle, userRole = 'patient' }: SidebarProps) => {
    const location = useLocation();

    const mainNavItems: NavItem[] = [
        { name: 'Dashboard', href: '/dashboard', icon: <LayoutDashboard className="w-5 h-5" /> },
        { name: 'Upload Prescription', href: '/upload', icon: <Upload className="w-5 h-5" /> },
        { name: 'Verify Medicine', href: '/verify', icon: <Shield className="w-5 h-5" /> },
        { name: 'My Prescriptions', href: '/prescriptions', icon: <FileSearch className="w-5 h-5" /> },
        { name: 'Interaction Checker', href: '/check-interaction', icon: <Pill className="w-5 h-5" /> },
        { name: 'Alerts', href: '/alerts', icon: <Bell className="w-5 h-5" />, badge: 3 },
    ];

    const professionalNavItems: NavItem[] = [
        { name: 'Doctor Portal', href: '/doctor', icon: <Stethoscope className="w-5 h-5" />, roles: ['doctor', 'admin'] },
        { name: 'Pharmacist Portal', href: '/pharmacist', icon: <Building2 className="w-5 h-5" />, roles: ['pharmacist', 'admin'] },
        { name: 'Patient Management', href: '/patients', icon: <Users className="w-5 h-5" />, roles: ['doctor', 'pharmacist', 'admin'] },
        { name: 'Analytics', href: '/analytics', icon: <BarChart3 className="w-5 h-5" />, roles: ['admin'] },
    ];

    const bottomNavItems: NavItem[] = [
        { name: 'Settings', href: '/settings', icon: <Settings className="w-5 h-5" /> },
        { name: 'Help & Support', href: '/help', icon: <HelpCircle className="w-5 h-5" /> },
    ];

    const filteredProfessionalItems = professionalNavItems.filter(
        item => !item.roles || item.roles.includes(userRole)
    );

    const isActive = (href: string) => location.pathname === href;

    const NavLink = ({ item }: { item: NavItem }) => (
        <Link
            to={item.href}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group relative ${isActive(item.href)
                ? 'bg-primary-100 text-primary-700 font-medium'
                : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                }`}
        >
            <div className={`flex-shrink-0 ${isActive(item.href) ? 'text-primary-600' : 'text-gray-500 group-hover:text-gray-700'}`}>
                {item.icon}
            </div>
            {!isCollapsed && (
                <>
                    <span className="flex-1 truncate">{item.name}</span>
                    {item.badge && (
                        <span className="bg-danger-500 text-white text-xs font-medium px-2 py-0.5 rounded-full">
                            {item.badge}
                        </span>
                    )}
                </>
            )}
            {isCollapsed && item.badge && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-danger-500 text-white text-xs font-medium rounded-full flex items-center justify-center">
                    {item.badge}
                </span>
            )}
        </Link>
    );

    return (
        <aside
            className={`fixed left-0 top-0 h-full bg-white border-r border-gray-200 transition-all duration-300 z-40 flex flex-col ${isCollapsed ? 'w-20' : 'w-64'
                }`}
        >
            {/* Header */}
            <div className={`flex items-center h-16 border-b border-gray-100 ${isCollapsed ? 'justify-center px-2' : 'justify-between px-4'}`}>
                <Link to="/dashboard" className="flex items-center gap-2">
                    <div className="relative flex-shrink-0">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-600 to-secondary-500 flex items-center justify-center shadow-lg">
                            <Pill className="w-5 h-5 text-white" />
                        </div>
                        <Shield className="w-4 h-4 text-primary-600 absolute -bottom-1 -right-1 bg-white rounded-full p-0.5" />
                    </div>
                    {!isCollapsed && (
                        <div className="flex flex-col">
                            <span className="text-lg font-bold text-gray-900">MedLens</span>
                            <span className="text-xs font-medium text-primary-600 -mt-1">AI</span>
                        </div>
                    )}
                </Link>
                {!isCollapsed && (
                    <button
                        onClick={onToggle}
                        className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                        aria-label="Collapse sidebar"
                    >
                        <ChevronLeft className="w-5 h-5 text-gray-500" />
                    </button>
                )}
            </div>

            {/* Collapsed Toggle */}
            {isCollapsed && (
                <button
                    onClick={onToggle}
                    className="mx-auto mt-4 p-2 rounded-lg hover:bg-gray-100 transition-colors"
                    aria-label="Expand sidebar"
                >
                    <Menu className="w-5 h-5 text-gray-500" />
                </button>
            )}

            {/* Main Navigation */}
            <nav className="flex-1 overflow-y-auto px-3 py-4">
                <div className="space-y-1">
                    {mainNavItems.map((item) => (
                        <NavLink key={item.href} item={item} />
                    ))}
                </div>

                {/* Professional Section */}
                {filteredProfessionalItems.length > 0 && (
                    <div className="mt-6">
                        {!isCollapsed && (
                            <p className="px-3 mb-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                                Professional
                            </p>
                        )}
                        <div className="space-y-1">
                            {filteredProfessionalItems.map((item) => (
                                <NavLink key={item.href} item={item} />
                            ))}
                        </div>
                    </div>
                )}
            </nav>

            {/* Bottom Navigation */}
            <div className="border-t border-gray-100 px-3 py-4">
                <div className="space-y-1">
                    {bottomNavItems.map((item) => (
                        <NavLink key={item.href} item={item} />
                    ))}
                    <button
                        className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-gray-600 hover:bg-danger-50 hover:text-danger-600 transition-all duration-200"
                    >
                        <LogOut className="w-5 h-5" />
                        {!isCollapsed && <span>Sign Out</span>}
                    </button>
                </div>
            </div>
        </aside>
    );
};

export default Sidebar;
