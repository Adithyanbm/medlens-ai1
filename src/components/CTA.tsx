import { Link } from 'react-router-dom';
import {
    ArrowRight,
    Shield,
    CheckCircle2,
    Sparkles
} from 'lucide-react';

const CTA = () => {
    const benefits = [
        'No credit card required',
        'Free forever for basic use',
        '24/7 AI-powered support',
    ];

    return (
        <section className="section relative overflow-hidden">
            {/* Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary-600 via-primary-700 to-secondary-700" />

            {/* Decorative Elements */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute top-0 left-1/4 w-96 h-96 bg-white/5 rounded-full blur-3xl" />
                <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-secondary-400/10 rounded-full blur-3xl" />

                {/* Grid Pattern */}
                <div
                    className="absolute inset-0 opacity-10"
                    style={{
                        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                    }}
                />
            </div>

            <div className="container-custom relative z-10">
                <div className="max-w-4xl mx-auto text-center">
                    {/* Badge */}
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 mb-6 backdrop-blur-sm">
                        <Sparkles className="w-4 h-4 text-accent-300" />
                        <span className="text-sm font-semibold text-white">
                            Start Protecting Your Health Today
                        </span>
                    </div>

                    {/* Headline */}
                    <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6">
                        Ready to Make Your Medications{' '}
                        <span className="text-secondary-300">Safer?</span>
                    </h2>

                    {/* Description */}
                    <p className="text-lg lg:text-xl text-white/80 mb-8 max-w-2xl mx-auto">
                        Join thousands of patients and healthcare providers who trust MedLens AI
                        to prevent dangerous drug interactions and ensure medication safety.
                    </p>

                    {/* Benefits */}
                    <div className="flex flex-col sm:flex-row justify-center gap-4 sm:gap-8 mb-10">
                        {benefits.map((benefit, index) => (
                            <div key={index} className="flex items-center justify-center gap-2">
                                <CheckCircle2 className="w-5 h-5 text-secondary-300" />
                                <span className="text-white/90 font-medium">{benefit}</span>
                            </div>
                        ))}
                    </div>

                    {/* CTA Buttons */}
                    <div className="flex flex-col sm:flex-row justify-center gap-4">
                        <Link
                            to="/register"
                            className="inline-flex items-center justify-center px-8 py-4 bg-white text-primary-700 font-semibold rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300"
                        >
                            <Shield className="w-5 h-5 mr-2" />
                            Get Started Free
                            <ArrowRight className="w-5 h-5 ml-2" />
                        </Link>
                        <a
                            href="#features"
                            className="inline-flex items-center justify-center px-8 py-4 bg-white/10 text-white font-semibold rounded-xl border border-white/20 backdrop-blur-sm hover:bg-white/20 transition-all duration-300"
                        >
                            Watch Demo
                        </a>
                    </div>

                    {/* Trust Badge */}
                    <div className="mt-12 pt-8 border-t border-white/10">
                        <p className="text-white/60 text-sm mb-4">Trusted by healthcare leaders worldwide</p>
                        <div className="flex flex-wrap justify-center items-center gap-8 opacity-60">
                            <div className="text-2xl font-bold text-white/80">Hospital+</div>
                            <div className="text-2xl font-bold text-white/80">MedCare</div>
                            <div className="text-2xl font-bold text-white/80">PharmaSafe</div>
                            <div className="text-2xl font-bold text-white/80">HealthNet</div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default CTA;
