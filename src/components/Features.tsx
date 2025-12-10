import {
    Camera,
    Zap,
    Shield,
    Bell,
    Barcode,
    MessageSquare,
    ArrowRight
} from 'lucide-react';

interface FeatureCardProps {
    icon: React.ReactNode;
    title: string;
    description: string;
    badge?: string;
    badgeColor?: string;
}

const FeatureCard = ({ icon, title, description, badge, badgeColor = 'primary' }: FeatureCardProps) => {
    const badgeColors: Record<string, string> = {
        primary: 'badge-primary',
        secondary: 'badge-secondary',
        accent: 'badge-accent',
        danger: 'badge-danger',
    };

    return (
        <div className="group card card-hover relative overflow-hidden">
            {/* Gradient overlay on hover */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary-500/5 to-secondary-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />

            <div className="relative">
                {/* Badge */}
                {badge && (
                    <span className={`badge ${badgeColors[badgeColor]} mb-4`}>
                        {badge}
                    </span>
                )}

                {/* Icon */}
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary-100 to-secondary-100 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                    <div className="text-primary-600">
                        {icon}
                    </div>
                </div>

                {/* Content */}
                <h3 className="heading-3 mb-3 group-hover:text-primary-600 transition-colors">
                    {title}
                </h3>
                <p className="text-gray-600 leading-relaxed mb-4">
                    {description}
                </p>

                {/* Learn more link */}
                <a
                    href="#"
                    className="inline-flex items-center text-primary-600 font-medium group/link"
                >
                    Learn more
                    <ArrowRight className="w-4 h-4 ml-1 group-hover/link:translate-x-1 transition-transform" />
                </a>
            </div>
        </div>
    );
};

const Features = () => {
    const features = [
        {
            icon: <Camera className="w-7 h-7" />,
            title: 'Smart OCR Scanning',
            description: 'Upload prescription images and our AI instantly extracts medicine names, dosages, and frequencies with 99% accuracy.',
            badge: 'AI-Powered',
            badgeColor: 'primary',
        },
        {
            icon: <Zap className="w-7 h-7" />,
            title: 'Drug Interaction Checker',
            description: 'Our intelligent engine analyzes combinations against a database of 50,000+ known drug interactions in real-time.',
            badge: 'Real-time',
            badgeColor: 'secondary',
        },
        {
            icon: <Shield className="w-7 h-7" />,
            title: 'Personal Safety Score',
            description: 'Get a comprehensive safety score for your medication regimen, with actionable insights to minimize risks.',
            badge: 'Personalized',
            badgeColor: 'accent',
        },
        {
            icon: <Bell className="w-7 h-7" />,
            title: 'Allergy Alerts',
            description: 'Smart filtering based on your allergy profile. Never worry about accidentally taking a medicine you\'re allergic to.',
            badge: 'Protective',
            badgeColor: 'danger',
        },
        {
            icon: <Barcode className="w-7 h-7" />,
            title: 'Fake Medicine Detection',
            description: 'Verify medicine authenticity by scanning barcodes. Our system cross-checks with verified manufacturer databases.',
            badge: 'Verified',
            badgeColor: 'primary',
        },
        {
            icon: <MessageSquare className="w-7 h-7" />,
            title: 'AI Health Assistant',
            description: 'Chat with our AI assistant for medicine usage guidance, side effects information, and dosage reminders.',
            badge: 'Interactive',
            badgeColor: 'secondary',
        },
    ];

    return (
        <section id="features" className="section bg-gray-50">
            <div className="container-custom">
                {/* Header */}
                <div className="text-center mb-12 lg:mb-16">
                    <span className="badge badge-primary mb-4">Core Features</span>
                    <h2 className="heading-2 mb-4">
                        Everything You Need for{' '}
                        <span className="text-gradient">Medicine Safety</span>
                    </h2>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                        Comprehensive tools designed to protect patients, assist doctors,
                        and empower pharmacists with AI-powered safety checks.
                    </p>
                </div>

                {/* Features Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
                    {features.map((feature, index) => (
                        <FeatureCard key={index} {...feature} />
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Features;
