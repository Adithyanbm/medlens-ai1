import { useState, useEffect } from 'react';
import { authService } from '../services/auth';
import DashboardLayout from '../components/layout/DashboardLayout';
import {
    User,
    Mail,
    Bell,
    Shield,
    Lock,
    Moon,
    Globe,
    LogOut,
    ChevronRight,
    Camera,
    Save,
    CheckCircle2,
    AlertCircle,
    Loader2,
    X
} from 'lucide-react';

const SettingsPage = () => {
    const [activeTab, setActiveTab] = useState('profile');
    const currentUser = authService.getCurrentUser() || {};

    const [profileData, setProfileData] = useState({
        name: currentUser.name || '',
        email: currentUser.email || '',
        phone: currentUser.phone || '',
        bio: currentUser.bio || '',
        allergies: (currentUser.allergies as string[]) || []
    });

    const [allergyInput, setAllergyInput] = useState('');

    const [notifications, setNotifications] = useState(currentUser.notifications || {
        email: true,
        push: true,
        medicineReminders: true,
        interactionAlerts: true,
        news: false
    });

    const [passwordData, setPasswordData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });

    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

    useEffect(() => {
        const fetchUserData = async () => {
            const user = await authService.refreshUser();
            if (user) {
                setProfileData({
                    name: user.name || '',
                    email: user.email || '',
                    phone: user.phone || '',
                    bio: user.bio || '',
                    allergies: user.allergies || []
                });
                if (user.notifications) {
                    setNotifications(user.notifications);
                }
            }
        };
        fetchUserData();
    }, []);

    const showMessage = (type: 'success' | 'error', text: string) => {
        setMessage({ type, text });
        setTimeout(() => setMessage(null), 3000);
    };

    const tabs = [
        { id: 'profile', label: 'Profile Settings', icon: User },
        { id: 'notifications', label: 'Notifications', icon: Bell },
        { id: 'security', label: 'Security & Privacy', icon: Shield },
        { id: 'preferences', label: 'App Preferences', icon: Globe },
    ];

    const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setProfileData({ ...profileData, [e.target.name]: e.target.value });
    };

    const toggleNotification = (key: keyof typeof notifications) => {
        setNotifications((prev: any) => ({ ...prev, [key]: !prev[key] }));
    };

    const handleAddAllergy = () => {
        if (allergyInput.trim()) {
            setProfileData(prev => ({
                ...prev,
                allergies: [...prev.allergies, allergyInput.trim()]
            }));
            setAllergyInput('');
        }
    };

    const handleRemoveAllergy = (index: number) => {
        setProfileData(prev => ({
            ...prev,
            allergies: prev.allergies.filter((_, i) => i !== index)
        }));
    };

    const handleSaveProfile = async () => {
        setIsLoading(true);
        try {
            await authService.updateProfile({
                name: profileData.name,
                phone: profileData.phone,
                bio: profileData.bio,
                allergies: profileData.allergies
            });
            showMessage('success', 'Profile updated successfully');
        } catch (error: any) {
            showMessage('error', error.message || 'Failed to update profile');
        } finally {
            setIsLoading(false);
        }
    };

    const handleSaveNotifications = async () => {
        setIsLoading(true);
        try {
            await authService.updateProfile({ notifications });
            showMessage('success', 'Notification preferences saved');
        } catch (error: any) {
            showMessage('error', error.message || 'Failed to save preferences');
        } finally {
            setIsLoading(false);
        }
    };

    const handleUpdatePassword = async () => {
        if (passwordData.newPassword !== passwordData.confirmPassword) {
            showMessage('error', 'New passwords do not match');
            return;
        }
        if (passwordData.newPassword.length < 6) {
            showMessage('error', 'Password must be at least 6 characters');
            return;
        }

        setIsLoading(true);
        try {
            await authService.updatePassword({
                currentPassword: passwordData.currentPassword,
                newPassword: passwordData.newPassword
            });
            showMessage('success', 'Password updated successfully');
            setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
        } catch (error: any) {
            showMessage('error', error.message || 'Failed to update password');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <DashboardLayout userRole="patient">
            <div className="max-w-6xl mx-auto">
                <div className="mb-6">
                    <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">Settings</h1>
                    <p className="text-gray-600 mt-1">Manage your account and preferences</p>
                </div>

                {message && (
                    <div className={`mb-6 p-4 rounded-xl flex items-center gap-3 ${message.type === 'success'
                        ? 'bg-secondary-50 text-secondary-700 border border-secondary-200'
                        : 'bg-danger-50 text-danger-700 border border-danger-200'
                        }`}>
                        {message.type === 'success' ? (
                            <CheckCircle2 className="w-5 h-5" />
                        ) : (
                            <AlertCircle className="w-5 h-5" />
                        )}
                        <p className="font-medium">{message.text}</p>
                    </div>
                )}

                <div className="flex flex-col lg:flex-row gap-6">
                    {/* Sidebar */}
                    <div className="lg:w-64 flex-shrink-0">
                        <div className="bg-white rounded-2xl shadow-card border border-gray-100 overflow-hidden">
                            <div className="p-2 space-y-1">
                                {tabs.map(tab => (
                                    <button
                                        key={tab.id}
                                        onClick={() => setActiveTab(tab.id)}
                                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${activeTab === tab.id
                                            ? 'bg-primary-50 text-primary-600'
                                            : 'text-gray-600 hover:bg-gray-50'
                                            }`}
                                    >
                                        <tab.icon className="w-5 h-5" />
                                        {tab.label}
                                        {activeTab === tab.id && (
                                            <ChevronRight className="w-4 h-4 ml-auto" />
                                        )}
                                    </button>
                                ))}
                            </div>
                            <div className="border-t border-gray-100 p-2 mt-2">
                                <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-danger-600 hover:bg-danger-50 transition-colors">
                                    <LogOut className="w-5 h-5" />
                                    Sign Out
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Content Area */}
                    <div className="flex-1">
                        <div className="bg-white rounded-2xl shadow-card border border-gray-100 p-6 lg:p-8">
                            {/* Profile Settings */}
                            {activeTab === 'profile' && (
                                <div className="space-y-6">
                                    <div className="flex items-center gap-4 mb-6">
                                        <div className="relative">
                                            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary-400 to-secondary-500 p-1">
                                                <div className="w-full h-full rounded-full bg-white flex items-center justify-center overflow-hidden">
                                                    <User className="w-12 h-12 text-gray-300" />
                                                </div>
                                            </div>
                                            <button className="absolute bottom-0 right-0 p-2 bg-white rounded-full shadow-lg border border-gray-100 hover:bg-gray-50 transition-colors">
                                                <Camera className="w-4 h-4 text-gray-600" />
                                            </button>
                                        </div>
                                        <div>
                                            <h2 className="text-xl font-bold text-gray-900">{profileData.name}</h2>
                                            <p className="text-gray-500">{profileData.email}</p>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                                            <input
                                                type="text"
                                                name="name"
                                                value={profileData.name}
                                                onChange={handleProfileChange}
                                                className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                                            <div className="relative">
                                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                                <input
                                                    type="email"
                                                    name="email"
                                                    value={profileData.email}
                                                    onChange={handleProfileChange}
                                                    className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                                                />
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                                            <input
                                                type="tel"
                                                name="phone"
                                                value={profileData.phone}
                                                onChange={handleProfileChange}
                                                className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                                            />
                                        </div>
                                        <div className="md:col-span-2">
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Bio</label>
                                            <textarea
                                                name="bio"
                                                value={profileData.bio}
                                                onChange={handleProfileChange}
                                                rows={3}
                                                className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none resize-none"
                                            />
                                        </div>
                                        <div className="md:col-span-2">
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Allergies & Conditions</label>
                                            <div className="flex flex-wrap gap-2 mb-3">
                                                {profileData.allergies.map((allergy: string, index: number) => (
                                                    <span key={index} className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-50 text-red-700">
                                                        {allergy}
                                                        <button
                                                            type="button"
                                                            onClick={() => handleRemoveAllergy(index)}
                                                            className="ml-2 hover:text-red-900"
                                                        >
                                                            <X className="w-3 h-3" />
                                                        </button>
                                                    </span>
                                                ))}
                                            </div>
                                            <div className="flex gap-2">
                                                <input
                                                    type="text"
                                                    value={allergyInput}
                                                    onChange={(e) => setAllergyInput(e.target.value)}
                                                    onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddAllergy())}
                                                    placeholder="Add an allergy (e.g. Penicillin)"
                                                    className="flex-1 px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={handleAddAllergy}
                                                    className="px-4 py-2 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 font-medium"
                                                >
                                                    Add
                                                </button>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="pt-4 flex justify-end">
                                        <button
                                            onClick={handleSaveProfile}
                                            disabled={isLoading}
                                            className="btn-primary disabled:opacity-50 flex items-center"
                                        >
                                            {isLoading ? (
                                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                            ) : (
                                                <Save className="w-4 h-4 mr-2" />
                                            )}
                                            Save Changes
                                        </button>
                                    </div>
                                </div>
                            )}

                            {/* Notifications Settings */}
                            {activeTab === 'notifications' && (
                                <div className="space-y-6">
                                    <h2 className="text-xl font-bold text-gray-900 mb-6">Notification Preferences</h2>

                                    <div className="space-y-4">
                                        {[
                                            { key: 'email', label: 'Email Notifications', desc: 'Receive updates via email' },
                                            { key: 'push', label: 'Push Notifications', desc: 'Receive push notifications on your device' },
                                            { key: 'medicineReminders', label: 'Medicine Reminders', desc: 'Get reminded when it is time to take your meds' },
                                            { key: 'interactionAlerts', label: 'Interaction Alerts', desc: 'Get notified about potential drug interactions' },
                                            { key: 'news', label: 'Health News & Tips', desc: 'Receive weekly health tips and news' },
                                        ].map((item) => (
                                            <div key={item.key} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                                                <div>
                                                    <h3 className="font-medium text-gray-900">{item.label}</h3>
                                                    <p className="text-sm text-gray-500">{item.desc}</p>
                                                </div>
                                                <label className="relative inline-flex items-center cursor-pointer">
                                                    <input
                                                        type="checkbox"
                                                        checked={notifications[item.key as keyof typeof notifications]}
                                                        onChange={() => toggleNotification(item.key as keyof typeof notifications)}
                                                        className="sr-only peer"
                                                    />
                                                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                                                </label>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="pt-4 flex justify-end">
                                        <button
                                            onClick={handleSaveNotifications}
                                            disabled={isLoading}
                                            className="btn-primary disabled:opacity-50 flex items-center"
                                        >
                                            {isLoading ? (
                                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                            ) : (
                                                <Save className="w-4 h-4 mr-2" />
                                            )}
                                            Save Preferences
                                        </button>
                                    </div>
                                </div>
                            )}

                            {/* Security Settings */}
                            {activeTab === 'security' && (
                                <div className="space-y-6">
                                    <h2 className="text-xl font-bold text-gray-900 mb-6">Security & Privacy</h2>

                                    <div className="space-y-6">
                                        <div className="p-4 bg-gray-50 rounded-xl space-y-4">
                                            <h3 className="font-medium text-gray-900 flex items-center gap-2">
                                                <Lock className="w-4 h-4" />
                                                Change Password
                                            </h3>
                                            <div className="grid gap-4">
                                                <input
                                                    type="password"
                                                    placeholder="Current Password"
                                                    value={passwordData.currentPassword}
                                                    onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                                                    className="w-full px-4 py-2 border border-gray-200 rounded-xl bg-white"
                                                />
                                                <input
                                                    type="password"
                                                    placeholder="New Password"
                                                    value={passwordData.newPassword}
                                                    onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                                                    className="w-full px-4 py-2 border border-gray-200 rounded-xl bg-white"
                                                />
                                                <input
                                                    type="password"
                                                    placeholder="Confirm New Password"
                                                    value={passwordData.confirmPassword}
                                                    onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                                                    className="w-full px-4 py-2 border border-gray-200 rounded-xl bg-white"
                                                />
                                            </div>
                                            <div className="flex justify-end">
                                                <button
                                                    onClick={handleUpdatePassword}
                                                    disabled={isLoading || !passwordData.currentPassword || !passwordData.newPassword}
                                                    className="px-4 py-2 bg-gray-900 text-white rounded-xl hover:bg-gray-800 transition-colors text-sm font-medium disabled:opacity-50 flex items-center"
                                                >
                                                    {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                                                    Update Password
                                                </button>
                                            </div>
                                        </div>

                                        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                                            <div>
                                                <h3 className="font-medium text-gray-900">Two-Factor Authentication</h3>
                                                <p className="text-sm text-gray-500">Add an extra layer of security to your account</p>
                                            </div>
                                            <button className="btn-secondary text-sm">Enable 2FA</button>
                                        </div>

                                        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                                            <div>
                                                <h3 className="font-medium text-gray-900">Active Sessions</h3>
                                                <p className="text-sm text-gray-500">Manage devices logged into your account</p>
                                            </div>
                                            <button className="text-primary-600 font-medium text-sm hover:underline">View All</button>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* App Preferences */}
                            {activeTab === 'preferences' && (
                                <div className="space-y-6">
                                    <h2 className="text-xl font-bold text-gray-900 mb-6">App Preferences</h2>

                                    <div className="grid gap-4">
                                        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                                            <div className="flex items-center gap-3">
                                                <Globe className="w-5 h-5 text-gray-600" />
                                                <div>
                                                    <h3 className="font-medium text-gray-900">Language</h3>
                                                    <p className="text-sm text-gray-500">Select your preferred language</p>
                                                </div>
                                            </div>
                                            <select className="bg-white border border-gray-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500">
                                                <option>English</option>
                                                <option>Spanish</option>
                                                <option>French</option>
                                                <option>German</option>
                                            </select>
                                        </div>

                                        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                                            <div className="flex items-center gap-3">
                                                <Moon className="w-5 h-5 text-gray-600" />
                                                <div>
                                                    <h3 className="font-medium text-gray-900">Theme</h3>
                                                    <p className="text-sm text-gray-500">Choose your preferred appearance</p>
                                                </div>
                                            </div>
                                            <select className="bg-white border border-gray-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500">
                                                <option>Light</option>
                                                <option>Dark</option>
                                                <option>System</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default SettingsPage;
