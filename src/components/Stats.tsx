import { useEffect, useState, useRef } from 'react';
import {
    Shield,
    Users,
    FileCheck,
    AlertTriangle
} from 'lucide-react';

interface StatItemProps {
    icon: React.ReactNode;
    value: number;
    suffix: string;
    label: string;
    delay: number;
}

const StatItem = ({ icon, value, suffix, label, delay }: StatItemProps) => {
    const [count, setCount] = useState(0);
    const [isVisible, setIsVisible] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                }
            },
            { threshold: 0.1 }
        );

        if (ref.current) {
            observer.observe(ref.current);
        }

        return () => observer.disconnect();
    }, []);

    useEffect(() => {
        if (!isVisible) return;

        const timeout = setTimeout(() => {
            const duration = 2000;
            const steps = 60;
            const increment = value / steps;
            let current = 0;

            const timer = setInterval(() => {
                current += increment;
                if (current >= value) {
                    setCount(value);
                    clearInterval(timer);
                } else {
                    setCount(Math.floor(current));
                }
            }, duration / steps);

            return () => clearInterval(timer);
        }, delay);

        return () => clearTimeout(timeout);
    }, [isVisible, value, delay]);

    return (
        <div
            ref={ref}
            className="relative group"
        >
            <div className="text-center p-6 lg:p-8 rounded-2xl bg-white shadow-card hover:shadow-card-hover transition-all duration-300 border border-gray-100 group-hover:-translate-y-1">
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-gradient-to-br from-primary-500 to-secondary-500 text-white mb-4 group-hover:scale-110 transition-transform">
                    {icon}
                </div>
                <div className="text-4xl lg:text-5xl font-bold text-gray-900 mb-2">
                    {count.toLocaleString()}{suffix}
                </div>
                <p className="text-gray-600 font-medium">{label}</p>
            </div>
        </div>
    );
};

const Stats = () => {
    const stats = [
        {
            icon: <FileCheck className="w-7 h-7" />,
            value: 50000,
            suffix: '+',
            label: 'Prescriptions Analyzed',
            delay: 0,
        },
        {
            icon: <AlertTriangle className="w-7 h-7" />,
            value: 12500,
            suffix: '+',
            label: 'Interactions Detected',
            delay: 100,
        },
        {
            icon: <Users className="w-7 h-7" />,
            value: 25000,
            suffix: '+',
            label: 'Protected Patients',
            delay: 200,
        },
        {
            icon: <Shield className="w-7 h-7" />,
            value: 99,
            suffix: '%',
            label: 'Safety Accuracy',
            delay: 300,
        },
    ];

    return (
        <section className="section bg-gradient-to-b from-white to-gray-50">
            <div className="container-custom">
                {/* Header */}
                <div className="text-center mb-12 lg:mb-16">
                    <span className="badge badge-primary mb-4">Our Impact</span>
                    <h2 className="heading-2 mb-4">
                        Trusted by Thousands of{' '}
                        <span className="text-gradient">Healthcare Providers</span>
                    </h2>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                        Real-time statistics showcasing our commitment to medicine safety
                    </p>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
                    {stats.map((stat, index) => (
                        <StatItem key={index} {...stat} />
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Stats;
