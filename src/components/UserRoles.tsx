import { Link } from 'react-router-dom';
import {
    User,
    Stethoscope,
    Building2,
    ShieldCheck,
    ArrowRight,
    CheckCircle2
} from 'lucide-react';

interface RoleCardProps {
    icon: React.ReactNode;
    title: string;
    description: string;
    features: string[];
    gradient: string;
    cta: string;
}

const RoleCard = ({ icon, title, description, features, gradient, cta }: RoleCardProps) => {
    return (
        <div className="group relative bg-white rounded-2xl p-6 lg:p-8 shadow-card hover:shadow-card-hover transition-all duration-300 border border-gray-100 overflow-hidden">
            {/* Background Gradient on Hover */}
            <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-0 group-hover:opacity-5 transition-opacity`} />

            <div className="relative">
                {/* Icon */}
                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${gradient} flex items-center justify-center text-white mb-6 group-hover:scale-110 transition-transform shadow-lg`}>
                    {icon}
                </div>

                {/* Content */}
                <h3 className="heading-3 mb-3">{title}</h3>
                <p className="text-gray-600 mb-6">{description}</p>

                {/* Features List */}
                <ul className="space-y-3 mb-6">
                    {features.map((feature, index) => (
                        <li key={index} className="flex items-start gap-2">
                            <CheckCircle2 className="w-5 h-5 text-secondary-500 flex-shrink-0 mt-0.5" />
                            <span className="text-gray-700 text-sm">{feature}</span>
                        </li>
                    ))}
                </ul>

                {/* CTA Button */}
                <Link
                    to="/register"
                    className="inline-flex items-center text-primary-600 font-semibold group/link"
                >
                    {cta}
                    <ArrowRight className="w-4 h-4 ml-1 group-hover/link:translate-x-1 transition-transform" />
                </Link>
            </div>
        </div>
    );
};

const UserRoles = () => {
    const roles = [
        {
            icon: <User className="w-8 h-8" />,
            title: 'For Patients',
            description: 'Take control of your medication safety with personalized alerts and reminders.',
            features: [
                'Upload and analyze prescriptions',
                'Get personalized safety scores',
                'Receive allergy-based alerts',
                'Track medicine schedules',
            ],
            gradient: 'from-primary-500 to-primary-600',
            cta: 'Sign Up as Patient',
        },
        {
            icon: <Stethoscope className="w-8 h-8" />,
            title: 'For Doctors',
            description: 'Enhance your prescribing decisions with AI-powered safety verification.',
            features: [
                'Verify prescription safety',
                'Access drug interaction database',
                'Review patient medication history',
                'Generate safety reports',
            ],
            gradient: 'from-secondary-500 to-secondary-600',
            cta: 'Join as Doctor',
        },
        {
            icon: <Building2 className="w-8 h-8" />,
            title: 'For Pharmacists',
            description: 'Streamline your workflow with intelligent dispensing recommendations.',
            features: [
                'Verify prescription authenticity',
                'Check for interactions at POS',
                'Suggest alternatives when needed',
                'Generate patient counseling notes',
            ],
            gradient: 'from-accent-500 to-accent-600',
            cta: 'Register as Pharmacist',
        },
        {
            icon: <ShieldCheck className="w-8 h-8" />,
            title: 'For Institutions',
            description: 'Deploy enterprise-grade medicine safety across your organization.',
            features: [
                'Organization-wide dashboards',
                'Custom integration APIs',
                'Compliance reporting',
                'Dedicated support',
            ],
            gradient: 'from-gray-700 to-gray-800',
            cta: 'Contact Sales',
        },
    ];

    return (
        <section id="roles" className="section bg-gray-50">
            <div className="container-custom">
                {/* Header */}
                <div className="text-center mb-12 lg:mb-16">
                    <span className="badge badge-accent mb-4">Who It's For</span>
                    <h2 className="heading-2 mb-4">
                        Designed for the{' '}
                        <span className="text-gradient">Healthcare Ecosystem</span>
                    </h2>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                        Whether you're a patient, healthcare provider, or institution,
                        MedLens AI has the right tools for you.
                    </p>
                </div>

                {/* Roles Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
                    {roles.map((role, index) => (
                        <RoleCard key={index} {...role} />
                    ))}
                </div>
            </div>
        </section>
    );
};

export default UserRoles;
