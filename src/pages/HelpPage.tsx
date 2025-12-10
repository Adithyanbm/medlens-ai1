import { useState } from 'react';
import DashboardLayout from '../components/layout/DashboardLayout';
import {
    Search,
    HelpCircle,
    MessageCircle,
    FileText,
    ChevronDown,
    ChevronUp,
    ExternalLink,
    Mail,
    Phone
} from 'lucide-react';

const HelpPage = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

    const faqs = [
        {
            question: "How do I upload a prescription?",
            answer: "Go to the 'Upload' page from the dashboard. You can drag and drop your prescription image or click to select a file. Our AI will automatically analyze it and extract the medicines."
        },
        {
            question: "Is my medical data safe?",
            answer: "Yes, we take privacy seriously. All your medical data is encrypted and stored securely. We comply with standard healthcare privacy regulations."
        },
        {
            question: "How accurate is the AI analysis?",
            answer: "Our AI uses advanced vision models to read prescriptions with high accuracy. However, you should always verify the extracted details before proceeding. It is a support tool, not a replacement for professional medical advice."
        },
        {
            question: "Can I check interactions between over-the-counter medicines?",
            answer: "Absolutely! You can use the 'Check Interactions' page to manually enter any medicine, including over-the-counter drugs, to check for potential interactions."
        },
        {
            question: "What should I do if I find an error in the analysis?",
            answer: "If the AI misreads a prescription, you can manually edit the medicine names and dosages on the upload result screen before saving or checking for interactions."
        }
    ];

    const filteredFaqs = faqs.filter(faq =>
        faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
        faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const toggleFaq = (index: number) => {
        setOpenFaqIndex(openFaqIndex === index ? null : index);
    };

    return (
        <DashboardLayout userRole="patient">
            <div className="max-w-4xl mx-auto space-y-8">
                {/* Header & Search */}
                <div className="text-center space-y-4 py-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary-100 text-primary-600 mb-2">
                        <HelpCircle className="w-8 h-8" />
                    </div>
                    <h1 className="text-3xl font-bold text-gray-900">How can we help you?</h1>
                    <p className="text-gray-600 max-w-xl mx-auto">
                        Search our knowledge base or browse frequently asked questions
                    </p>

                    <div className="max-w-xl mx-auto relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search for help..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white"
                        />
                    </div>
                </div>

                {/* Quick Support Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow text-center">
                        <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                            <FileText className="w-6 h-6" />
                        </div>
                        <h3 className="font-semibold text-gray-900 mb-2">User Guide</h3>
                        <p className="text-sm text-gray-500 mb-4">Detailed guides on how to use all features</p>
                        <button className="text-blue-600 text-sm font-medium hover:underline flex items-center justify-center gap-1 mx-auto">
                            Read Docs <ExternalLink className="w-3 h-3" />
                        </button>
                    </div>

                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow text-center">
                        <div className="w-12 h-12 bg-green-50 text-green-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                            <MessageCircle className="w-6 h-6" />
                        </div>
                        <h3 className="font-semibold text-gray-900 mb-2">Live Chat</h3>
                        <p className="text-sm text-gray-500 mb-4">Chat with our support team in real-time</p>
                        <button className="text-green-600 text-sm font-medium hover:underline flex items-center justify-center gap-1 mx-auto">
                            Start Chat <ExternalLink className="w-3 h-3" />
                        </button>
                    </div>

                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow text-center">
                        <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                            <Mail className="w-6 h-6" />
                        </div>
                        <h3 className="font-semibold text-gray-900 mb-2">Email Support</h3>
                        <p className="text-sm text-gray-500 mb-4">Get help via email within 24 hours</p>
                        <button className="text-purple-600 text-sm font-medium hover:underline flex items-center justify-center gap-1 mx-auto">
                            Send Email <ExternalLink className="w-3 h-3" />
                        </button>
                    </div>
                </div>

                {/* FAQ Section */}
                <div className="bg-white rounded-2xl shadow-card border border-gray-100 overflow-hidden">
                    <div className="p-6 border-b border-gray-100">
                        <h2 className="text-xl font-bold text-gray-900">Frequently Asked Questions</h2>
                    </div>
                    <div className="divide-y divide-gray-100">
                        {filteredFaqs.length > 0 ? (
                            filteredFaqs.map((faq, index) => (
                                <div key={index} className="p-6">
                                    <button
                                        onClick={() => toggleFaq(index)}
                                        className="w-full flex items-center justify-between text-left group"
                                    >
                                        <span className={`font-medium text-lg transition-colors ${openFaqIndex === index ? 'text-primary-600' : 'text-gray-900 group-hover:text-primary-600'
                                            }`}>
                                            {faq.question}
                                        </span>
                                        {openFaqIndex === index ? (
                                            <ChevronUp className="w-5 h-5 text-primary-600 flex-shrink-0" />
                                        ) : (
                                            <ChevronDown className="w-5 h-5 text-gray-400 group-hover:text-primary-600 flex-shrink-0" />
                                        )}
                                    </button>
                                    {openFaqIndex === index && (
                                        <div className="mt-3 text-gray-600 leading-relaxed animate-in fade-in slide-in-from-top-2 duration-200">
                                            {faq.answer}
                                        </div>
                                    )}
                                </div>
                            ))
                        ) : (
                            <div className="p-8 text-center text-gray-500">
                                No matching results found for "{searchQuery}"
                            </div>
                        )}
                    </div>
                </div>

                {/* Contact Footer */}
                <div className="bg-gray-50 rounded-2xl p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6">
                    <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-1">Still need help?</h3>
                        <p className="text-gray-600 text-sm">Our support team is available Mon-Fri, 9am-5pm EST.</p>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-3">
                        <button className="flex items-center gap-2 px-5 py-2.5 bg-white border border-gray-200 rounded-xl text-gray-700 font-medium hover:bg-gray-50 transition-colors shadow-sm">
                            <Phone className="w-4 h-4" />
                            +1 (555) 000-0000
                        </button>
                        <button className="flex items-center gap-2 px-5 py-2.5 bg-primary-600 text-white rounded-xl font-medium hover:bg-primary-700 transition-colors shadow-sm shadow-primary-500/25">
                            <MessageCircle className="w-4 h-4" />
                            Contact Support
                        </button>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default HelpPage;
