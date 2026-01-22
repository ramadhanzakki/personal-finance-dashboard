import React from 'react';

// Color palette for categories
const CATEGORY_COLORS = [
    '#895af6', // primary purple
    '#22d3ee', // cyan
    '#fa6c38', // orange
    '#22c55e', // green
    '#f59e0b', // amber
    '#ec4899', // pink
    '#6366f1', // indigo
    '#94a3b8', // slate
];

// Helper to format currency
const formatCurrency = (amount) => {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(amount);
};

const CategoryBreakdown = ({ categoryData = [] }) => {
    // Generate conic gradient from category data
    const generateGradient = () => {
        if (categoryData.length === 0) {
            return 'conic-gradient(#94a3b8 0% 100%)';
        }

        let currentPercent = 0;
        const gradientParts = categoryData.map((cat, index) => {
            const color = CATEGORY_COLORS[index % CATEGORY_COLORS.length];
            const start = currentPercent;
            const end = currentPercent + cat.percentage;
            currentPercent = end;
            return `${color} ${start}% ${end}%`;
        });

        return `conic-gradient(${gradientParts.join(', ')})`;
    };

    // Get top spending category
    const topCategory = categoryData.length > 0 ? categoryData[0] : null;

    // Get top 4 categories for display
    const displayCategories = categoryData.slice(0, 4);

    return (
        <div className="bg-white dark:bg-card-dark rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm p-6 flex flex-col">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-6">Category Breakdown</h3>

            {categoryData.length === 0 ? (
                <div className="flex-1 flex flex-col items-center justify-center py-8 text-center">
                    <span className="material-symbols-outlined text-5xl text-slate-300 dark:text-slate-600 mb-3">pie_chart</span>
                    <p className="text-slate-500 dark:text-slate-400 text-sm">No expense data yet</p>
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center flex-1 gap-8">
                    {/* CSS Donut Chart */}
                    <div
                        className="relative size-48 rounded-full"
                        style={{ background: generateGradient() }}
                    >
                        <div className="absolute inset-4 bg-white dark:bg-card-dark rounded-full flex flex-col items-center justify-center">
                            <span className="text-sm text-slate-500 dark:text-slate-400">Top Spending</span>
                            <span className="text-xl font-bold text-slate-900 dark:text-white">
                                {topCategory?.category || 'N/A'}
                            </span>
                        </div>
                    </div>

                    <div className="w-full grid grid-cols-2 gap-4">
                        {displayCategories.map((cat, index) => (
                            <div key={cat.category} className="flex items-center gap-2">
                                <div
                                    className="size-3 rounded-full"
                                    style={{ backgroundColor: CATEGORY_COLORS[index % CATEGORY_COLORS.length] }}
                                />
                                <div className="flex flex-col">
                                    <span className="text-xs text-slate-500 dark:text-slate-400 truncate max-w-[80px]">
                                        {cat.category}
                                    </span>
                                    <span className="text-sm font-semibold text-slate-900 dark:text-white">
                                        {cat.percentage}%
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default CategoryBreakdown;
