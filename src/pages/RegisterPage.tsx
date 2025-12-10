import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authService } from '../services/auth';
import {
    Pill,
    Shield,
    Mail,
    Lock,
    Eye,
    EyeOff,
    ArrowRight,
    User,
    Stethoscope,
    Building2,
    CheckCircle2
} from 'lucide-react';

type UserRole = 'patient' | 'doctor' | 'pharmacist';

const RegisterPage = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        password: '',
        role: 'patient' as UserRole,
        agreeToTerms: false,
    });

    const roles = [
        {
            id: 'patient' as UserRole,
            label: 'Patient',
            icon: <User className="w-5 h-5" />,
            description: 'Personal medication safety'
        },
        {
            id: 'doctor' as UserRole,
            label: 'Doctor',
            icon: <Stethoscope className="w-5 h-5" />,
            description: 'Prescribing verification'
        },
        {
            id: 'pharmacist' as UserRole,
            label: 'Pharmacist',
            icon: <Building2 className="w-5 h-5" />,
            description: 'Dispensing safety checks'
        },
    ];

    const features = [
        'Instant drug interaction alerts',
        'AI-powered prescription analysis',
        'Personalized safety scores',
        'Allergy-based filtering',
        'Medicine authenticity verification',
    ];

    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            const response = await authService.register(formData);

            // Store token and user data
            localStorage.setItem('token', response.token);
            localStorage.setItem('user', JSON.stringify(response.user));

            // Redirect to dashboard
            navigate('/dashboard');
        } catch (err: any) {
            setError(err.message || 'Registration failed. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleChange = (field: string, value: string | boolean) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50 flex">
            {/* Left Side - Visual */}
            <div className="hidden lg:flex flex-1 bg-gradient-to-br from-primary-600 via-primary-700 to-secondary-700 items-center justify-center p-12 relative overflow-hidden">
                {/* Decorative Elements */}
                <div className="absolute inset-0 overflow-hidden">
                    <div className="absolute top-20 right-20 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
                    <div className="absolute bottom-20 left-20 w-80 h-80 bg-secondary-400/20 rounded-full blur-3xl" />
                </div>

                {/* Content */}
                <div className="relative z-10 max-w-lg">
                    <div className="w-20 h-20 rounded-2xl bg-white/10 backdrop-blur-sm flex items-center justify-center mb-8 border border-white/20">
                        <Pill className="w-10 h-10 text-white" />
                    </div>

                    <h2 className="text-3xl font-bold text-white mb-4">
                        Start Protecting Your Health Today
                    </h2>
                    <p className="text-lg text-white/80 mb-8">
                        Join MedLens AI and get instant access to powerful medicine safety tools
                        designed to keep you and your loved ones safe.
                    </p>

                    {/* Features List */}
                    <ul className="space-y-4">
                        {features.map((feature, index) => (
                            <li key={index} className="flex items-center gap-3">
                                <div className="w-6 h-6 rounded-full bg-secondary-400/30 flex items-center justify-center">
                                    <CheckCircle2 className="w-4 h-4 text-secondary-300" />
                                </div>
                                <span className="text-white/90">{feature}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>

            {/* Right Side - Form */}
            <div className="flex-1 flex items-center justify-center p-8 overflow-y-auto">
                <div className="w-full max-w-md py-8">
                    {/* Logo */}
                    <Link to="/" className="inline-flex items-center gap-2 mb-8">
                        <div className="relative">
                            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-600 to-secondary-500 flex items-center justify-center shadow-lg">
                                <Pill className="w-6 h-6 text-white" />
                            </div>
                            <Shield className="w-5 h-5 text-primary-600 absolute -bottom-1 -right-1 bg-white rounded-full p-0.5" />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-2xl font-bold text-gray-900">MedLens</span>
                            <span className="text-xs font-medium text-primary-600 -mt-1">AI</span>
                        </div>
                    </Link>

                    {/* Heading */}
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">Create your account</h1>
                        <p className="text-gray-600">
                            Get started with AI-powered medicine safety in just a few steps.
                        </p>
                    </div>

                    {/* Registration Form */}
                    <form onSubmit={handleSubmit} className="space-y-5">
                        {/* Role Selection */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-3">
                                I am a...
                            </label>
                            <div className="grid grid-cols-3 gap-3">
                                {roles.map((role) => (
                                    <button
                                        key={role.id}
                                        type="button"
                                        onClick={() => handleChange('role', role.id)}
                                        className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all ${formData.role === role.id
                                            ? 'border-primary-500 bg-primary-50 text-primary-700'
                                            : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300'
                                            }`}
                                    >
                                        <div className={`p-2 rounded-lg ${formData.role === role.id ? 'bg-primary-100' : 'bg-gray-100'
                                            }`}>
                                            {role.icon}
                                        </div>
                                        <span className="font-medium text-sm">{role.label}</span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Full Name Field */}
                        <div>
                            <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-2">
                                Full Name
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <User className="w-5 h-5 text-gray-400" />
                                </div>
                                <input
                                    type="text"
                                    id="fullName"
                                    value={formData.fullName}
                                    onChange={(e) => handleChange('fullName', e.target.value)}
                                    placeholder="John Doe"
                                    className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all outline-none"
                                    required
                                />
                            </div>
                        </div>

                        {/* Email Field */}
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                                Email Address
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <Mail className="w-5 h-5 text-gray-400" />
                                </div>
                                <input
                                    type="email"
                                    id="email"
                                    value={formData.email}
                                    onChange={(e) => handleChange('email', e.target.value)}
                                    placeholder="name@example.com"
                                    className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all outline-none"
                                    required
                                />
                            </div>
                        </div>

                        {/* Password Field */}
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                                Password
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <Lock className="w-5 h-5 text-gray-400" />
                                </div>
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    id="password"
                                    value={formData.password}
                                    onChange={(e) => handleChange('password', e.target.value)}
                                    placeholder="Create a strong password"
                                    className="w-full pl-12 pr-12 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all outline-none"
                                    required
                                    minLength={8}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600"
                                >
                                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </button>
                            </div>
                            <p className="mt-2 text-xs text-gray-500">
                                Must be at least 8 characters
                            </p>
                        </div>

                        {/* Terms Checkbox */}
                        <div>
                            <label className="flex items-start gap-3 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={formData.agreeToTerms}
                                    onChange={(e) => handleChange('agreeToTerms', e.target.checked)}
                                    className="w-5 h-5 text-primary-600 border-gray-300 rounded focus:ring-primary-500 mt-0.5"
                                    required
                                />
                                <span className="text-sm text-gray-600">
                                    I agree to the{' '}
                                    <a href="#" className="text-primary-600 hover:underline">Terms of Service</a>
                                    {' '}and{' '}
                                    <a href="#" className="text-primary-600 hover:underline">Privacy Policy</a>
                                </span>
                            </label>
                        </div>


                        {/* Error Message */}
                        {error && (
                            <div className="p-3 rounded-lg bg-danger-50 text-danger-600 text-sm border border-danger-100 flex items-center gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-danger-500" />
                                {error}
                            </div>
                        )}

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full btn-primary py-4 disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                            {isLoading ? 'Creating Account...' : (
                                <>
                                    Create Account
                                    <ArrowRight className="w-5 h-5 ml-2" />
                                </>
                            )}
                        </button>
                    </form>

                    {/* Sign In Link */}
                    <p className="mt-8 text-center text-gray-600">
                        Already have an account?{' '}
                        <Link to="/login" className="text-primary-600 font-semibold hover:text-primary-700">
                            Sign in
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default RegisterPage;
