import {
    Upload,
    Cpu,
    FileCheck,
    ArrowRight
} from 'lucide-react';

const HowItWorks = () => {
    const steps = [
        {
            number: '01',
            icon: <Upload className="w-8 h-8" />,
            title: 'Upload Prescription',
            description: 'Take a photo or upload an image of your prescription. Our AI-powered OCR instantly extracts all medicine details.',
            color: 'from-primary-500 to-primary-600',
        },
        {
            number: '02',
            icon: <Cpu className="w-8 h-8" />,
            title: 'AI Analysis',
            description: 'Our intelligent engine analyzes drug interactions, checks for allergies, verifies dosages, and identifies potential risks.',
            color: 'from-secondary-500 to-secondary-600',
        },
        {
            number: '03',
            icon: <FileCheck className="w-8 h-8" />,
            title: 'Get Safety Report',
            description: 'Receive a comprehensive safety report with actionable recommendations, alternative medicines, and safety scores.',
            color: 'from-accent-500 to-accent-600',
        },
    ];

    return (
        <section id="how-it-works" className="section bg-white">
            <div className="container-custom">
                {/* Header */}
                <div className="text-center mb-12 lg:mb-16">
                    <span className="badge badge-secondary mb-4">Simple Process</span>
                    <h2 className="heading-2 mb-4">
                        How{' '}
                        <span className="text-gradient">MedLens AI</span>{' '}
                        Works
                    </h2>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                        Get started in just three simple steps. No medical expertise required.
                    </p>
                </div>

                {/* Steps */}
                <div className="relative">
                    {/* Connection Line (Desktop) */}
                    <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-primary-200 via-secondary-200 to-accent-200 -translate-y-1/2" />

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
                        {steps.map((step, index) => (
                            <div key={index} className="relative">
                                {/* Step Card */}
                                <div className="bg-white rounded-2xl p-8 shadow-card hover:shadow-card-hover transition-all duration-300 border border-gray-100 relative z-10">
                                    {/* Step Number */}
                                    <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br ${step.color} text-white mb-6 shadow-lg`}>
                                        {step.icon}
                                    </div>

                                    {/* Number Badge */}
                                    <div className="absolute top-4 right-4 text-5xl font-bold text-gray-100">
                                        {step.number}
                                    </div>

                                    {/* Content */}
                                    <h3 className="heading-3 mb-3">{step.title}</h3>
                                    <p className="text-gray-600 leading-relaxed">{step.description}</p>
                                </div>

                                {/* Arrow (Mobile/Tablet) */}
                                {index < steps.length - 1 && (
                                    <div className="flex justify-center my-4 lg:hidden">
                                        <ArrowRight className="w-6 h-6 text-gray-300 rotate-90" />
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                {/* CTA */}
                <div className="text-center mt-12">
                    <a href="#" className="btn-primary">
                        Try It Now — It's Free
                        <ArrowRight className="w-5 h-5 ml-2" />
                    </a>
                </div>
            </div>
        </section>
    );
};

export default HowItWorks;
