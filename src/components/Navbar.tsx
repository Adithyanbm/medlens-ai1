import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
    Menu,
    X,
    Pill,
    Shield,
    ChevronDown
} from 'lucide-react';

const Navbar = () => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const navLinks = [
        { name: 'Features', href: '#features' },
        { name: 'How It Works', href: '#how-it-works' },
        { name: 'User Roles', href: '#roles' },
        { name: 'About', href: '#about' },
    ];

    return (
        <header
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled
                    ? 'bg-white/90 backdrop-blur-lg shadow-lg'
                    : 'bg-transparent'
                }`}
        >
            <nav className="container-custom">
                <div className="flex items-center justify-between h-16 lg:h-20">
                    {/* Logo */}
                    <Link to="/" className="flex items-center gap-2 group">
                        <div className="relative">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-600 to-secondary-500 flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow">
                                <Pill className="w-5 h-5 text-white" />
                            </div>
                            <Shield className="w-4 h-4 text-primary-600 absolute -bottom-1 -right-1 bg-white rounded-full p-0.5" />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-xl font-bold text-gray-900">MedLens</span>
                            <span className="text-xs font-medium text-primary-600 -mt-1">AI</span>
                        </div>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden lg:flex items-center gap-8">
                        {navLinks.map((link) => (
                            <a
                                key={link.name}
                                href={link.href}
                                className="text-gray-600 font-medium hover:text-primary-600 transition-colors relative group"
                            >
                                {link.name}
                                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary-600 transition-all group-hover:w-full" />
                            </a>
                        ))}
                        <div className="relative group">
                            <button className="flex items-center gap-1 text-gray-600 font-medium hover:text-primary-600 transition-colors">
                                Resources
                                <ChevronDown className="w-4 h-4" />
                            </button>
                        </div>
                    </div>

                    {/* Desktop CTA Buttons */}
                    <div className="hidden lg:flex items-center gap-4">
                        <Link
                            to="/login"
                            className="text-gray-700 font-semibold hover:text-primary-600 transition-colors"
                        >
                            Sign In
                        </Link>
                        <Link
                            to="/register"
                            className="btn-primary"
                        >
                            Get Started Free
                        </Link>
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
                        aria-label="Toggle menu"
                    >
                        {isMobileMenuOpen ? (
                            <X className="w-6 h-6 text-gray-700" />
                        ) : (
                            <Menu className="w-6 h-6 text-gray-700" />
                        )}
                    </button>
                </div>

                {/* Mobile Menu */}
                <div
                    className={`lg:hidden overflow-hidden transition-all duration-300 ${isMobileMenuOpen ? 'max-h-96 pb-6' : 'max-h-0'
                        }`}
                >
                    <div className="flex flex-col gap-4 pt-4 border-t border-gray-100">
                        {navLinks.map((link) => (
                            <a
                                key={link.name}
                                href={link.href}
                                className="text-gray-600 font-medium hover:text-primary-600 transition-colors py-2"
                                onClick={() => setIsMobileMenuOpen(false)}
                            >
                                {link.name}
                            </a>
                        ))}
                        <div className="flex flex-col gap-3 pt-4 border-t border-gray-100">
                            <Link
                                to="/login"
                                className="text-center py-3 text-gray-700 font-semibold hover:text-primary-600 transition-colors"
                            >
                                Sign In
                            </Link>
                            <Link
                                to="/register"
                                className="btn-primary text-center"
                            >
                                Get Started Free
                            </Link>
                        </div>
                    </div>
                </div>
            </nav>
        </header>
    );
};

export default Navbar;
