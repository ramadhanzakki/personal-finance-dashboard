import React from 'react';

// Helper to format currency for tooltips
const formatCurrency = (amount) => {
    if (amount >= 1000000) {
        return `Rp ${(amount / 1000000).toFixed(0)}jt`;
    } else if (amount >= 1000) {
        return `Rp ${(amount / 1000).toFixed(0)}rb`;
    }
    return `Rp ${amount}`;
};

const IncomeExpenseChart = ({ chartData = [] }) => {
    // Find max value for scaling bars
    const maxValue = chartData.reduce((max, item) => {
        return Math.max(max, item.income || 0, item.expense || 0);
    }, 0);

    // Calculate bar heights as percentages
    const getBarHeight = (value) => {
        if (maxValue === 0) return '0%';
        const percentage = (value / maxValue) * 100;
        return `${Math.max(percentage, 5)}%`; // Minimum 5% for visibility
    };

    return (
        <div className="bg-white dark:bg-card-dark rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm p-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
                <div>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white">Income vs Expense</h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400">Overview of your cash flow over time</p>
                </div>
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                        <div className="size-3 rounded-full bg-primary"></div>
                        <span className="text-xs text-slate-500">Income</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="size-3 rounded-full bg-slate-300 dark:bg-slate-600"></div>
                        <span className="text-xs text-slate-500">Expense</span>
                    </div>
                </div>
            </div>

            {chartData.length === 0 ? (
                <div className="w-full h-64 flex items-center justify-center">
                    <div className="text-center">
                        <span className="material-symbols-outlined text-5xl text-slate-300 dark:text-slate-600 mb-3">bar_chart</span>
                        <p className="text-slate-500 dark:text-slate-400 text-sm">No data to display yet</p>
                    </div>
                </div>
            ) : (
                <div className="w-full h-64 flex items-end justify-between gap-2 sm:gap-4 pl-0 sm:pl-4">
                    {chartData.map((item, idx) => (
                        <div key={idx} className="flex flex-col items-center gap-2 flex-1 h-full justify-end group cursor-pointer">
                            <div className="w-full flex justify-center gap-1 h-full items-end relative">
                                <div
                                    className="w-1.5 sm:w-3 bg-primary rounded-t-sm group-hover:bg-primary/80 transition-colors"
                                    style={{ height: getBarHeight(item.income || 0) }}
                                ></div>
                                <div
                                    className="w-1.5 sm:w-3 bg-slate-300 dark:bg-slate-600 rounded-t-sm group-hover:bg-slate-400 dark:group-hover:bg-slate-500 transition-colors"
                                    style={{ height: getBarHeight(item.expense || 0) }}
                                ></div>
                                {/* Tooltip */}
                                <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10 pointer-events-none">
                                    In: {formatCurrency(item.income || 0)} | Ex: {formatCurrency(item.expense || 0)}
                                </div>
                            </div>
                            <span className="text-[10px] sm:text-xs font-medium text-slate-400">{item.month}</span>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default IncomeExpenseChart;
