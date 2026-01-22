import React from 'react';

// Category icon and color mapping
const categoryStyles = {
    'Food': { icon: 'restaurant', bg: 'bg-orange-100 dark:bg-orange-900/30', color: 'text-orange-600 dark:text-orange-400' },
    'Transport': { icon: 'directions_car', bg: 'bg-blue-100 dark:bg-blue-900/30', color: 'text-blue-600 dark:text-blue-400' },
    'Entertainment': { icon: 'movie', bg: 'bg-purple-100 dark:bg-purple-900/30', color: 'text-purple-600 dark:text-purple-400' },
    'Shopping': { icon: 'shopping_bag', bg: 'bg-pink-100 dark:bg-pink-900/30', color: 'text-pink-600 dark:text-pink-400' },
    'Utilities': { icon: 'bolt', bg: 'bg-yellow-100 dark:bg-yellow-900/30', color: 'text-yellow-600 dark:text-yellow-400' },
    'Healthcare': { icon: 'local_hospital', bg: 'bg-red-100 dark:bg-red-900/30', color: 'text-red-600 dark:text-red-400' },
    'Salary': { icon: 'payments', bg: 'bg-green-100 dark:bg-green-900/30', color: 'text-green-600 dark:text-green-400' },
    'Freelance': { icon: 'work', bg: 'bg-primary/10', color: 'text-primary' },
    'Investment': { icon: 'trending_up', bg: 'bg-cyan-100 dark:bg-cyan-900/30', color: 'text-cyan-600 dark:text-cyan-400' },
    'default': { icon: 'receipt', bg: 'bg-slate-100 dark:bg-slate-700', color: 'text-slate-600 dark:text-slate-400' }
};

// Helper to format currency
const formatCurrency = (amount) => {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(amount);
};

// Helper to format date
const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
    });
};

const RecentTransactions = ({ transactions = [], onDelete, onRefresh }) => {
    // Get the 5 most recent transactions
    const recentTransactions = transactions.slice(0, 5);

    const getCategoryStyle = (category) => {
        return categoryStyles[category] || categoryStyles['default'];
    };

    return (
        <div className="lg:col-span-2 bg-white dark:bg-card-dark rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm p-6 flex flex-col">
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">Recent Transactions</h3>
                <button
                    onClick={onRefresh}
                    className="text-sm text-primary font-medium hover:text-primary/80 flex items-center gap-1"
                >
                    <span className="material-symbols-outlined text-lg">refresh</span>
                    Refresh
                </button>
            </div>

            {recentTransactions.length === 0 ? (
                <div className="flex-1 flex flex-col items-center justify-center py-12 text-center">
                    <span className="material-symbols-outlined text-6xl text-slate-300 dark:text-slate-600 mb-4">receipt_long</span>
                    <p className="text-slate-500 dark:text-slate-400 text-lg font-medium">No transactions yet</p>
                    <p className="text-slate-400 dark:text-slate-500 text-sm mt-1">Add your first transaction to get started</p>
                </div>
            ) : (
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-slate-200 dark:border-slate-700">
                                <th className="pb-3 text-xs font-medium text-slate-500 uppercase tracking-wider pl-2">Transaction</th>
                                <th className="pb-3 text-xs font-medium text-slate-500 uppercase tracking-wider hidden sm:table-cell">Category</th>
                                <th className="pb-3 text-xs font-medium text-slate-500 uppercase tracking-wider">Date</th>
                                <th className="pb-3 text-xs font-medium text-slate-500 uppercase tracking-wider text-right">Amount</th>
                                <th className="pb-3 text-xs font-medium text-slate-500 uppercase tracking-wider text-right pr-2">Action</th>
                            </tr>
                        </thead>
                        <tbody className="text-sm">
                            {recentTransactions.map((tx) => {
                                const style = getCategoryStyle(tx.category);
                                const isIncome = tx.type === 'income';

                                return (
                                    <tr key={tx.id} className="group hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors">
                                        <td className="py-4 pl-2 flex items-center gap-3">
                                            <div className={`size-10 rounded-full ${style.bg} flex items-center justify-center ${style.color}`}>
                                                <span className="material-symbols-outlined text-[20px]">{style.icon}</span>
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="font-medium text-slate-900 dark:text-white">
                                                    {tx.note || tx.category}
                                                </span>
                                                <span className="text-xs text-slate-500 dark:text-slate-400 sm:hidden">{tx.category}</span>
                                            </div>
                                        </td>
                                        <td className="py-4 text-slate-600 dark:text-slate-300 hidden sm:table-cell">{tx.category}</td>
                                        <td className="py-4 text-slate-500 dark:text-slate-400">{formatDate(tx.date)}</td>
                                        <td className={`py-4 font-medium text-right ${isIncome ? 'text-green-500' : 'text-slate-900 dark:text-white'}`}>
                                            {isIncome ? '+' : '-'}{formatCurrency(tx.amount)}
                                        </td>
                                        <td className="py-4 text-right pr-2">
                                            <button
                                                onClick={() => onDelete(tx.id)}
                                                className="p-2 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors opacity-0 group-hover:opacity-100"
                                                title="Delete transaction"
                                            >
                                                <span className="material-symbols-outlined text-lg">delete</span>
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default RecentTransactions;
