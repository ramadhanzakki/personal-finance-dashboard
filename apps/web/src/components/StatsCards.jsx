import React from 'react';

// Helper to format currency
const formatCurrency = (amount) => {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(amount);
};

const StatsCards = ({ summary = {} }) => {
    const { totalBalance = 0, totalIncome = 0, totalExpense = 0 } = summary;

    const stats = [
        {
            label: "Total Balance",
            value: formatCurrency(totalBalance),
            change: totalBalance >= 0 ? "Healthy" : "Deficit",
            trend: totalBalance >= 0 ? "up" : "down",
            icon: "account_balance",
            bgClass: "bg-primary/10",
            textClass: "text-primary"
        },
        {
            label: "Total Income",
            value: formatCurrency(totalIncome),
            change: totalIncome > 0 ? "Active" : "No income",
            trend: "up",
            icon: "payments",
            bgClass: "bg-accent-cyan/10",
            textClass: "text-accent-cyan"
        },
        {
            label: "Total Expenses",
            value: formatCurrency(totalExpense),
            change: totalExpense > 0 ? "Active" : "No expenses",
            trend: "down",
            icon: "credit_card",
            bgClass: "bg-accent-orange/10",
            textClass: "text-accent-orange"
        }
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-6">
            {stats.map((stat, index) => (
                <div key={index} className="bg-white dark:bg-card-dark p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col gap-4">
                    <div className="flex justify-between items-start">
                        <div className={`p-2 rounded-lg ${stat.bgClass} ${stat.textClass}`}>
                            <span className="material-symbols-outlined">{stat.icon}</span>
                        </div>
                        <span className={`flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full ${stat.trend === 'up'
                            ? 'text-accent-green bg-accent-green/10'
                            : 'text-accent-orange bg-accent-orange/10'
                            }`}>
                            <span className="material-symbols-outlined text-[14px]">
                                {stat.trend === 'up' ? 'trending_up' : 'trending_down'}
                            </span>
                            {stat.change}
                        </span>
                    </div>
                    <div>
                        <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">{stat.label}</p>
                        <h3 className="text-2xl lg:text-3xl font-bold mt-1 text-slate-900 dark:text-white">{stat.value}</h3>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default StatsCards;
