import { Link } from 'react-router-dom';
import { Settings, AlertOctagon } from 'lucide-react';
import { authService } from '../../services/auth';

const AllergySummary = () => {
    const user = authService.getCurrentUser();
    const allergies = (user?.allergies || []) as string[];

    return (
        <div className="bg-white rounded-2xl shadow-card border border-gray-100 p-6 flex flex-col h-full">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">My Allergies</h3>
                <Link to="/settings" className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-400 hover:text-primary-600" title="Manage Allergies">
                    <Settings className="w-5 h-5" />
                </Link>
            </div>

            <div className="flex-1">
                {allergies.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-center py-6">
                        <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center mb-3">
                            <AlertOctagon className="w-6 h-6 text-gray-300" />
                        </div>
                        <p className="text-gray-500 text-sm">No allergies recorded.</p>
                        <Link to="/settings" className="text-primary-600 text-sm font-medium hover:underline mt-2">
                            Add Allergies
                        </Link>
                    </div>
                ) : (
                    <div className="flex flex-wrap gap-2">
                        {allergies.map((allergy, index) => (
                            <span
                                key={index}
                                className="px-3 py-1.5 bg-red-50 text-red-700 rounded-lg text-sm font-medium border border-red-100 flex items-center gap-1.5"
                            >
                                <AlertOctagon className="w-3.5 h-3.5" />
                                {allergy}
                            </span>
                        ))}
                    </div>
                )}
            </div>

            {allergies.length > 0 && (
                <div className="mt-4 pt-4 border-t border-gray-50 text-xs text-gray-400">
                    These are checked against every new prescription.
                </div>
            )}
        </div>
    );
};

export default AllergySummary;
