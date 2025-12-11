import React from 'react';
import { TrendingUp } from 'lucide-react';

interface SafetyTrendChartProps {
    data: { date: string; score: number }[];
}

const SafetyTrendChart: React.FC<SafetyTrendChartProps> = ({ data }) => {
    if (!data || data.length < 2) {
        return (
            <div className="flex flex-col items-center justify-center h-64 bg-white rounded-2xl shadow-card border border-gray-100 p-6 text-center">
                <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center mb-3">
                    <TrendingUp className="w-6 h-6 text-gray-400" />
                </div>
                <h3 className="font-semibold text-gray-900">Not Enough Data</h3>
                <p className="text-gray-500 text-sm mt-1">Upload at least two prescriptions to see your safety trend.</p>
            </div>
        );
    }

    // Sort data by date
    const sortedData = [...data].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    // Dimensions
    const width = 600;
    const height = 200;
    const padding = 20;

    // Scales
    const maxScore = 100;

    // Points calculation
    const points = sortedData.map((d, i) => {
        const x = padding + (i / (sortedData.length - 1)) * (width - 2 * padding);
        const y = height - padding - (d.score / maxScore) * (height - 2 * padding);
        return `${x},${y}`;
    }).join(' ');

    // Area path (closed at bottom)
    const firstX = padding;
    const lastX = width - padding;
    const bottomY = height - padding;
    const areaPath = `${points} L ${lastX},${bottomY} L ${firstX},${bottomY} Z`;

    return (
        <div className="bg-white rounded-2xl shadow-card border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h3 className="text-lg font-semibold text-gray-900">Safety Score Trend</h3>
                    <p className="text-sm text-gray-500">Track your medication safety over time</p>
                </div>
                <div className="flex items-center gap-2 text-sm text-secondary-600 bg-secondary-50 px-3 py-1 rounded-full font-medium">
                    <TrendingUp className="w-4 h-4" />
                    <span>Average: {Math.round(data.reduce((a, b) => a + b.score, 0) / data.length)}%</span>
                </div>
            </div>

            <div className="relative w-full aspect-[3/1] min-h-[200px]">
                <svg
                    viewBox={`0 0 ${width} ${height}`}
                    className="w-full h-full overflow-visible"
                    preserveAspectRatio="none"
                >
                    <defs>
                        <linearGradient id="scoreGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#10B981" stopOpacity="0.2" />
                            <stop offset="100%" stopColor="#10B981" stopOpacity="0" />
                        </linearGradient>
                    </defs>

                    {/* Grid Lines */}
                    {[0, 25, 50, 75, 100].map((tick) => {
                        const y = height - padding - (tick / maxScore) * (height - 2 * padding);
                        return (
                            <g key={tick}>
                                <line
                                    x1={padding}
                                    y1={y}
                                    x2={width - padding}
                                    y2={y}
                                    stroke="#F3F4F6"
                                    strokeWidth="1"
                                    strokeDasharray="4 4"
                                />
                            </g>
                        );
                    })}

                    {/* Area Fill */}
                    <path
                        d={areaPath}
                        fill="url(#scoreGradient)"
                        stroke="none"
                    />

                    {/* Line */}
                    <polyline
                        points={points}
                        fill="none"
                        stroke="#10B981"
                        strokeWidth="3"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />

                    {/* Points */}
                    {sortedData.map((d, i) => {
                        const x = padding + (i / (sortedData.length - 1)) * (width - 2 * padding);
                        const y = height - padding - (d.score / maxScore) * (height - 2 * padding);
                        return (
                            <g key={i} className="group cursor-pointer">
                                <circle
                                    cx={x}
                                    cy={y}
                                    r="4"
                                    fill="#fff"
                                    stroke="#10B981"
                                    strokeWidth="2"
                                    className="transition-all duration-200 group-hover:r-6"
                                />
                                {/* Tooltip */}
                                <g className="opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                    <rect x={x - 40} y={y - 45} width="80" height="35" rx="6" fill="#1F2937" />
                                    <text x={x} y={y - 23} textAnchor="middle" fill="white" fontSize="12" fontWeight="bold">
                                        {d.score}%
                                    </text>
                                    <path d={`M ${x - 6} ${y - 12} L ${x} ${y - 6} L ${x + 6} ${y - 12}`} fill="#1F2937" />
                                </g>
                            </g>
                        );
                    })}
                </svg>
            </div>

            <div className="flex justify-between mt-2 px-1">
                {sortedData.map((d, i) => (
                    <span key={i} className="text-xs text-gray-400">
                        {new Date(d.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                    </span>
                ))}
            </div>
        </div>
    );
};

export default SafetyTrendChart;
