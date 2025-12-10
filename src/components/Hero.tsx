import { Link } from 'react-router-dom';
import {
    ArrowRight,
    Upload,
    Shield,
    Sparkles,
    CheckCircle2
} from 'lucide-react';

const Hero = () => {
    const highlights = [
        'Instant Drug Interaction Alerts',
        'AI-Powered Safety Analysis',
        'Trusted by Healthcare Professionals',
    ];

    return (
        <section className="relative min-h-screen flex items-center overflow-hidden bg-gradient-to-b from-primary-50/50 via-white to-secondary-50/30">
            {/* Decorative Background Elements */}
            <div className="absolute inset-0 overflow-hidden">
                {/* Gradient Orbs */}
                <div className="blob w-96 h-96 bg-primary-200 -top-48 -left-48" />
                <div className="blob w-80 h-80 bg-secondary-200 top-1/4 -right-40" style={{ animationDelay: '-5s' }} />
                <div className="blob w-64 h-64 bg-accent-200 bottom-1/4 left-1/4" style={{ animationDelay: '-10s' }} />

                {/* Grid Pattern */}
                <div
                    className="absolute inset-0 opacity-[0.03]"
                    style={{
                        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%230f766e' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                    }}
                />
            </div>

            <div className="container-custom relative z-10 pt-24 lg:pt-32 pb-16 lg:pb-24">
                <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
                    {/* Content Side */}
                    <div className="animate-fade-in">
                        {/* Badge */}
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-100 border border-primary-200 mb-6">
                            <Sparkles className="w-4 h-4 text-primary-600" />
                            <span className="text-sm font-semibold text-primary-700">
                                AI-Powered Medicine Safety
                            </span>
                        </div>

                        {/* Main Heading */}
                        <h1 className="heading-1 mb-6">
                            Your{' '}
                            <span className="text-gradient">Intelligent</span>{' '}
                            Medicine Safety Guardian
                        </h1>

                        {/* Subtitle */}
                        <p className="text-lg lg:text-xl text-gray-600 mb-8 max-w-xl leading-relaxed">
                            Detect dangerous drug interactions, wrong prescriptions, and allergic
                            combinations instantly with our AI-powered platform. Protect yourself
                            and your loved ones.
                        </p>

                        {/* Highlights */}
                        <div className="flex flex-col gap-3 mb-8">
                            {highlights.map((highlight, index) => (
                                <div key={index} className="flex items-center gap-3">
                                    <div className="w-5 h-5 rounded-full bg-secondary-100 flex items-center justify-center">
                                        <CheckCircle2 className="w-4 h-4 text-secondary-600" />
                                    </div>
                                    <span className="text-gray-700 font-medium">{highlight}</span>
                                </div>
                            ))}
                        </div>

                        {/* CTA Buttons */}
                        <div className="flex flex-col sm:flex-row gap-4">
                            <Link to="/register" className="btn-primary group">
                                <Upload className="w-5 h-5 mr-2" />
                                Upload Prescription
                                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                            </Link>
                            <a href="#features" className="btn-secondary">
                                <Shield className="w-5 h-5 mr-2" />
                                Explore Features
                            </a>
                        </div>

                        {/* Trust Indicators */}
                        <div className="mt-10 pt-8 border-t border-gray-200">
                            <p className="text-sm text-gray-500 mb-4">Trusted by leading healthcare institutions</p>
                            <div className="flex items-center gap-8 opacity-60">
                                <div className="text-2xl font-bold text-gray-400">Hospital+</div>
                                <div className="text-2xl font-bold text-gray-400">MedCare</div>
                                <div className="text-2xl font-bold text-gray-400">PharmaSafe</div>
                            </div>
                        </div>
                    </div>

                    {/* Visual Side */}
                    <div className="relative animate-slide-up lg:animate-float">
                        {/* Main Card */}
                        <div className="relative bg-white rounded-3xl shadow-2xl p-6 lg:p-8 border border-gray-100">
                            {/* Header */}
                            <div className="flex items-center justify-between mb-6">
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center">
                                        <Shield className="w-6 h-6 text-white" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-gray-900">Safety Analysis</h3>
                                        <p className="text-sm text-gray-500">Real-time results</p>
                                    </div>
                                </div>
                                <span className="badge badge-secondary">Active</span>
                            </div>

                            {/* Mock Medicine Items */}
                            <div className="space-y-3 mb-6">
                                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-lg bg-primary-100 flex items-center justify-center">
                                            <span className="text-primary-600 font-bold text-sm">Rx</span>
                                        </div>
                                        <div>
                                            <p className="font-medium text-gray-900">Aspirin 100mg</p>
                                            <p className="text-sm text-gray-500">Once daily</p>
                                        </div>
                                    </div>
                                    <CheckCircle2 className="w-5 h-5 text-secondary-500" />
                                </div>

                                <div className="flex items-center justify-between p-4 bg-danger-50 rounded-xl border border-danger-200">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-lg bg-danger-100 flex items-center justify-center">
                                            <span className="text-danger-600 font-bold text-sm">Rx</span>
                                        </div>
                                        <div>
                                            <p className="font-medium text-gray-900">Warfarin 5mg</p>
                                            <p className="text-sm text-danger-600 font-medium">⚠️ Interaction detected</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-lg bg-secondary-100 flex items-center justify-center">
                                            <span className="text-secondary-600 font-bold text-sm">Rx</span>
                                        </div>
                                        <div>
                                            <p className="font-medium text-gray-900">Metformin 500mg</p>
                                            <p className="text-sm text-gray-500">Twice daily</p>
                                        </div>
                                    </div>
                                    <CheckCircle2 className="w-5 h-5 text-secondary-500" />
                                </div>
                            </div>

                            {/* Safety Score */}
                            <div className="bg-gradient-to-r from-primary-500 to-secondary-500 rounded-xl p-4 text-white">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-white/80 text-sm">Medicine Safety Score</p>
                                        <p className="text-2xl font-bold">72 / 100</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-white/80 text-sm">Status</p>
                                        <p className="font-semibold">Review Needed</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Floating notification cards */}
                        <div className="absolute -top-4 -right-4 bg-white rounded-xl shadow-lg p-3 border border-gray-100 animate-pulse-slow">
                            <div className="flex items-center gap-2">
                                <div className="w-8 h-8 rounded-full bg-danger-100 flex items-center justify-center">
                                    <span className="text-danger-600 text-lg">⚠️</span>
                                </div>
                                <div>
                                    <p className="text-xs font-semibold text-gray-900">Alert</p>
                                    <p className="text-xs text-gray-500">1 interaction found</p>
                                </div>
                            </div>
                        </div>

                        <div className="absolute -bottom-4 -left-4 bg-white rounded-xl shadow-lg p-3 border border-gray-100">
                            <div className="flex items-center gap-2">
                                <div className="w-8 h-8 rounded-full bg-secondary-100 flex items-center justify-center">
                                    <CheckCircle2 className="w-4 h-4 text-secondary-600" />
                                </div>
                                <div>
                                    <p className="text-xs font-semibold text-gray-900">Verified</p>
                                    <p className="text-xs text-gray-500">2 safe medicines</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Hero;
