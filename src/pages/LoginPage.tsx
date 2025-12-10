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
    Chrome,
    Apple
} from 'lucide-react';

const LoginPage = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [rememberMe, setRememberMe] = useState(false);

    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            const response = await authService.login({ email, password });

            // Store token and user data
            localStorage.setItem('token', response.token);
            localStorage.setItem('user', JSON.stringify(response.user));

            // Redirect to dashboard
            navigate('/dashboard');
        } catch (err: any) {
            setError(err.message || 'Login failed. Please check your credentials.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50 flex">
            {/* Left Side - Form */}
            <div className="flex-1 flex items-center justify-center p-8">
                <div className="w-full max-w-md">
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
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome back</h1>
                        <p className="text-gray-600">
                            Sign in to continue protecting your health with AI-powered medicine safety.
                        </p>
                    </div>

                    {/* Social Login Buttons */}
                    <div className="space-y-3 mb-6">
                        <button className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-white border border-gray-200 rounded-xl text-gray-700 font-medium hover:bg-gray-50 hover:border-gray-300 transition-all">
                            <Chrome className="w-5 h-5" />
                            Continue with Google
                        </button>
                        <button className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-gray-900 border border-gray-900 rounded-xl text-white font-medium hover:bg-gray-800 transition-all">
                            <Apple className="w-5 h-5" />
                            Continue with Apple
                        </button>
                    </div>

                    {/* Divider */}
                    <div className="relative my-6">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-200" />
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="px-4 bg-gradient-to-br from-primary-50 via-white to-secondary-50 text-gray-500">
                                or sign in with email
                            </span>
                        </div>
                    </div>

                    {/* Login Form */}
                    <form onSubmit={handleSubmit} className="space-y-5">
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
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
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
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="Enter your password"
                                    className="w-full pl-12 pr-12 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all outline-none"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600"
                                >
                                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </button>
                            </div>
                        </div>

                        {/* Remember Me & Forgot Password */}
                        <div className="flex items-center justify-between">
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={rememberMe}
                                    onChange={(e) => setRememberMe(e.target.checked)}
                                    className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                                />
                                <span className="text-sm text-gray-600">Remember me</span>
                            </label>
                            <a href="#" className="text-sm text-primary-600 font-medium hover:text-primary-700">
                                Forgot password?
                            </a>
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
                            {isLoading ? 'Signing In...' : (
                                <>
                                    Sign In
                                    <ArrowRight className="w-5 h-5 ml-2" />
                                </>
                            )}
                        </button>
                    </form>

                    {/* Sign Up Link */}
                    <p className="mt-8 text-center text-gray-600">
                        Don't have an account?{' '}
                        <Link to="/register" className="text-primary-600 font-semibold hover:text-primary-700">
                            Sign up free
                        </Link>
                    </p>
                </div>
            </div>

            {/* Right Side - Visual */}
            <div className="hidden lg:flex flex-1 bg-gradient-to-br from-primary-600 via-primary-700 to-secondary-700 items-center justify-center p-12 relative overflow-hidden">
                {/* Decorative Elements */}
                <div className="absolute inset-0 overflow-hidden">
                    <div className="absolute top-20 left-20 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
                    <div className="absolute bottom-20 right-20 w-80 h-80 bg-secondary-400/20 rounded-full blur-3xl" />
                </div>

                {/* Content */}
                <div className="relative z-10 max-w-lg text-center">
                    <div className="w-20 h-20 rounded-2xl bg-white/10 backdrop-blur-sm flex items-center justify-center mx-auto mb-8 border border-white/20">
                        <Shield className="w-10 h-10 text-white" />
                    </div>
                    <h2 className="text-3xl font-bold text-white mb-4">
                        Your Health, Protected
                    </h2>
                    <p className="text-lg text-white/80">
                        Join thousands of patients and healthcare providers who trust MedLens AI
                        to keep their medications safe.
                    </p>

                    {/* Stats */}
                    <div className="flex justify-center gap-8 mt-12">
                        <div className="text-center">
                            <div className="text-3xl font-bold text-white">99%</div>
                            <div className="text-white/60 text-sm">Accuracy</div>
                        </div>
                        <div className="text-center">
                            <div className="text-3xl font-bold text-white">50K+</div>
                            <div className="text-white/60 text-sm">Users</div>
                        </div>
                        <div className="text-center">
                            <div className="text-3xl font-bold text-white">12K+</div>
                            <div className="text-white/60 text-sm">Alerts</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
