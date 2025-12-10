import { Link } from 'react-router-dom';
import {
    Pill,
    Shield,
    Twitter,
    Linkedin,
    Github,
    Mail,
    Phone,
    MapPin
} from 'lucide-react';

const Footer = () => {
    const footerLinks = {
        product: [
            { name: 'Features', href: '#features' },
            { name: 'How It Works', href: '#how-it-works' },
            { name: 'Pricing', href: '#pricing' },
            { name: 'API Access', href: '#api' },
        ],
        company: [
            { name: 'About Us', href: '#about' },
            { name: 'Careers', href: '#careers' },
            { name: 'Blog', href: '#blog' },
            { name: 'Press Kit', href: '#press' },
        ],
        resources: [
            { name: 'Documentation', href: '#docs' },
            { name: 'Help Center', href: '#help' },
            { name: 'Community', href: '#community' },
            { name: 'Status', href: '#status' },
        ],
        legal: [
            { name: 'Privacy Policy', href: '#privacy' },
            { name: 'Terms of Service', href: '#terms' },
            { name: 'HIPAA Compliance', href: '#hipaa' },
            { name: 'Cookie Policy', href: '#cookies' },
        ],
    };

    const socialLinks = [
        { name: 'Twitter', icon: <Twitter className="w-5 h-5" />, href: '#' },
        { name: 'LinkedIn', icon: <Linkedin className="w-5 h-5" />, href: '#' },
        { name: 'GitHub', icon: <Github className="w-5 h-5" />, href: '#' },
    ];

    return (
        <footer className="bg-gray-900 text-white">
            {/* Main Footer */}
            <div className="container-custom py-16 lg:py-20">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8 lg:gap-12">
                    {/* Brand Column */}
                    <div className="lg:col-span-2">
                        {/* Logo */}
                        <Link to="/" className="flex items-center gap-2 mb-6">
                            <div className="relative">
                                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center">
                                    <Pill className="w-5 h-5 text-white" />
                                </div>
                                <Shield className="w-4 h-4 text-primary-400 absolute -bottom-1 -right-1 bg-gray-900 rounded-full p-0.5" />
                            </div>
                            <div className="flex flex-col">
                                <span className="text-xl font-bold text-white">MedLens</span>
                                <span className="text-xs font-medium text-primary-400 -mt-1">AI</span>
                            </div>
                        </Link>

                        <p className="text-gray-400 mb-6 max-w-sm">
                            AI-powered medicine safety platform protecting patients from
                            dangerous drug interactions, wrong prescriptions, and allergic combinations.
                        </p>

                        {/* Contact Info */}
                        <div className="space-y-3">
                            <div className="flex items-center gap-3 text-gray-400">
                                <Mail className="w-5 h-5 text-primary-400" />
                                <span>support@medlens.ai</span>
                            </div>
                            <div className="flex items-center gap-3 text-gray-400">
                                <Phone className="w-5 h-5 text-primary-400" />
                                <span>+1 (555) 123-4567</span>
                            </div>
                            <div className="flex items-center gap-3 text-gray-400">
                                <MapPin className="w-5 h-5 text-primary-400" />
                                <span>San Francisco, CA</span>
                            </div>
                        </div>
                    </div>

                    {/* Product Links */}
                    <div>
                        <h4 className="font-semibold text-white mb-4">Product</h4>
                        <ul className="space-y-3">
                            {footerLinks.product.map((link) => (
                                <li key={link.name}>
                                    <a
                                        href={link.href}
                                        className="text-gray-400 hover:text-primary-400 transition-colors"
                                    >
                                        {link.name}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Company Links */}
                    <div>
                        <h4 className="font-semibold text-white mb-4">Company</h4>
                        <ul className="space-y-3">
                            {footerLinks.company.map((link) => (
                                <li key={link.name}>
                                    <a
                                        href={link.href}
                                        className="text-gray-400 hover:text-primary-400 transition-colors"
                                    >
                                        {link.name}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Resources Links */}
                    <div>
                        <h4 className="font-semibold text-white mb-4">Resources</h4>
                        <ul className="space-y-3">
                            {footerLinks.resources.map((link) => (
                                <li key={link.name}>
                                    <a
                                        href={link.href}
                                        className="text-gray-400 hover:text-primary-400 transition-colors"
                                    >
                                        {link.name}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Legal Links */}
                    <div>
                        <h4 className="font-semibold text-white mb-4">Legal</h4>
                        <ul className="space-y-3">
                            {footerLinks.legal.map((link) => (
                                <li key={link.name}>
                                    <a
                                        href={link.href}
                                        className="text-gray-400 hover:text-primary-400 transition-colors"
                                    >
                                        {link.name}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>

            {/* Bottom Bar */}
            <div className="border-t border-gray-800">
                <div className="container-custom py-6">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                        {/* Copyright */}
                        <p className="text-gray-500 text-sm">
                            © {new Date().getFullYear()} MedLens AI. All rights reserved.
                        </p>

                        {/* Social Links */}
                        <div className="flex items-center gap-4">
                            {socialLinks.map((social) => (
                                <a
                                    key={social.name}
                                    href={social.href}
                                    className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center text-gray-400 hover:bg-primary-600 hover:text-white transition-all"
                                    aria-label={social.name}
                                >
                                    {social.icon}
                                </a>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
