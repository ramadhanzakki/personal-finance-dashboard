import React, { useState, useEffect } from 'react';
import { fetchTransactions, deleteTransaction } from '../lib/api';
import { parseApiError } from '../lib/api';

const Transactions = () => {
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [typeFilter, setTypeFilter] = useState('all'); // 'all', 'income', 'expense'
    const [showTypeDropdown, setShowTypeDropdown] = useState(false);

    // Fetch transactions on mount
    useEffect(() => {
        loadTransactions();
    }, []);

    const loadTransactions = async () => {
        try {
            setLoading(true);
            const data = await fetchTransactions();
            setTransactions(data);
        } catch (error) {
            console.error('Failed to fetch transactions:', parseApiError(error));
        } finally {
            setLoading(false);
        }
    };

    // Handle delete with optimistic UI update
    const handleDelete = async (id) => {
        // Optimistic update
        const previousTransactions = [...transactions];
        setTransactions(transactions.filter(t => t.id !== id));

        try {
            await deleteTransaction(id);
        } catch (error) {
            // Restore on error
            console.error('Failed to delete transaction:', parseApiError(error));
            setTransactions(previousTransactions);
        }
    };

    // Helper: Get category icon
    const getCategoryIcon = (category) => {
        const iconMap = {
            'Food & Dining': '🍔',
            'Food': '🍔',
            'Transport': '🚗',
            'Transportation': '🚗',
            'Income': '💰',
            'Salary': '💰',
            'Entertainment': '🎬',
            'Electronics': '💻',
            'Health & Fitness': '💪',
            'Shopping': '🛍️',
            'Bills': '📄',
            'Other': '📌'
        };
        return iconMap[category] || '📌';
    };

    // Helper: Get category colors
    const getCategoryColors = (category) => {
        const colorMap = {
            'Food & Dining': { bg: 'bg-orange-100 dark:bg-orange-900/30' },
            'Food': { bg: 'bg-orange-100 dark:bg-orange-900/30' },
            'Transport': { bg: 'bg-blue-100 dark:bg-blue-900/30' },
            'Transportation': { bg: 'bg-blue-100 dark:bg-blue-900/30' },
            'Income': { bg: 'bg-green-100 dark:bg-green-900/30' },
            'Salary': { bg: 'bg-green-100 dark:bg-green-900/30' },
            'Entertainment': { bg: 'bg-red-100 dark:bg-red-900/30' },
            'Electronics': { bg: 'bg-slate-100 dark:bg-slate-800' },
            'Health & Fitness': { bg: 'bg-purple-100 dark:bg-purple-900/30' },
            'Shopping': { bg: 'bg-pink-100 dark:bg-pink-900/30' },
        };
        return colorMap[category] || { bg: 'bg-slate-100 dark:bg-slate-800' };
    };

    // Helper: Format date for grouping
    const formatDateGroup = (dateString) => {
        const date = new Date(dateString);
        const today = new Date();
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);

        // Reset time to compare only dates
        const dateOnly = new Date(date.getFullYear(), date.getMonth(), date.getDate());
        const todayOnly = new Date(today.getFullYear(), today.getMonth(), today.getDate());
        const yesterdayOnly = new Date(yesterday.getFullYear(), yesterday.getMonth(), yesterday.getDate());

        if (dateOnly.getTime() === todayOnly.getTime()) {
            return 'Today';
        } else if (dateOnly.getTime() === yesterdayOnly.getTime()) {
            return 'Yesterday';
        } else {
            return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
        }
    };

    // Helper: Format amount
    const formatAmount = (amount, type) => {
        const formattedAmount = new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(amount);

        return type === 'income' ? `+${formattedAmount}` : `-${formattedAmount}`;
    };

    // Filter transactions
    const filteredTransactions = transactions.filter(tx => {
        // Type filter
        if (typeFilter !== 'all' && tx.type !== typeFilter) {
            return false;
        }

        // Search filter (by note or category)
        if (searchTerm) {
            const search = searchTerm.toLowerCase();
            const note = (tx.note || '').toLowerCase();
            const category = (tx.category || '').toLowerCase();
            return note.includes(search) || category.includes(search);
        }

        return true;
    });

    // Group transactions by date
    const groupedTransactions = filteredTransactions.reduce((groups, tx) => {
        const dateGroup = formatDateGroup(tx.date);
        if (!groups[dateGroup]) {
            groups[dateGroup] = [];
        }
        groups[dateGroup].push(tx);
        return groups;
    }, {});

    // Get sorted date groups
    const sortedDateGroups = Object.keys(groupedTransactions).sort((a, b) => {
        // Always put "Today" first, "Yesterday" second
        if (a === 'Today') return -1;
        if (b === 'Today') return 1;
        if (a === 'Yesterday') return -1;
        if (b === 'Yesterday') return 1;

        // For other dates, sort by actual date (newest first)
        const dateA = new Date(groupedTransactions[a][0].date);
        const dateB = new Date(groupedTransactions[b][0].date);
        return dateB - dateA;
    });

    return (
        <div className="flex-1 overflow-y-auto p-6 lg:p-8">
            <div className="max-w-7xl mx-auto flex flex-col gap-6">
                {/* Filters and Search */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div className="relative w-full sm:w-96">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 material-symbols-outlined text-[20px]">search</span>
                        <input
                            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white dark:bg-card-dark border border-slate-200 dark:border-slate-700 text-sm focus:ring-2 focus:ring-primary focus:border-transparent text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 transition-shadow outline-none"
                            placeholder="Search transactions..."
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <div className="flex items-center gap-3 w-full sm:w-auto">
                        {/* Type Filter Dropdown */}
                        <div className="relative flex-1 sm:flex-none">
                            <button
                                onClick={() => setShowTypeDropdown(!showTypeDropdown)}
                                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-white dark:bg-card-dark border border-slate-200 dark:border-slate-700 text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors text-slate-700 dark:text-slate-300 cursor-pointer"
                            >
                                <span className="material-symbols-outlined text-[20px]">filter_list</span>
                                {typeFilter === 'all' ? 'All' : typeFilter === 'income' ? 'Income' : 'Expense'}
                                <span className="material-symbols-outlined text-[16px]">expand_more</span>
                            </button>
                            {showTypeDropdown && (
                                <div className="absolute top-full mt-2 w-full bg-white dark:bg-card-dark border border-slate-200 dark:border-slate-700 rounded-xl shadow-lg z-10 overflow-hidden">
                                    <button
                                        onClick={() => { setTypeFilter('all'); setShowTypeDropdown(false); }}
                                        className={`w-full px-4 py-2.5 text-left text-sm hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors ${typeFilter === 'all' ? 'text-primary font-medium' : 'text-slate-700 dark:text-slate-300'}`}
                                    >
                                        All Transactions
                                    </button>
                                    <button
                                        onClick={() => { setTypeFilter('income'); setShowTypeDropdown(false); }}
                                        className={`w-full px-4 py-2.5 text-left text-sm hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors ${typeFilter === 'income' ? 'text-primary font-medium' : 'text-slate-700 dark:text-slate-300'}`}
                                    >
                                        Income Only
                                    </button>
                                    <button
                                        onClick={() => { setTypeFilter('expense'); setShowTypeDropdown(false); }}
                                        className={`w-full px-4 py-2.5 text-left text-sm hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors ${typeFilter === 'expense' ? 'text-primary font-medium' : 'text-slate-700 dark:text-slate-300'}`}
                                    >
                                        Expense Only
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Loading State */}
                {loading && (
                    <div className="bg-white dark:bg-card-dark rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm p-8 flex flex-col items-center justify-center gap-4">
                        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                        <p className="text-slate-500 dark:text-slate-400">Loading transactions...</p>
                    </div>
                )}

                {/* Empty State */}
                {!loading && filteredTransactions.length === 0 && (
                    <div className="bg-white dark:bg-card-dark rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm p-12 flex flex-col items-center justify-center gap-4">
                        <span className="material-symbols-outlined text-[64px] text-slate-300 dark:text-slate-600">receipt_long</span>
                        <div className="text-center">
                            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-1">No transactions found</h3>
                            <p className="text-sm text-slate-500 dark:text-slate-400">
                                {searchTerm || typeFilter !== 'all'
                                    ? 'Try adjusting your filters'
                                    : 'Start by adding your first transaction'}
                            </p>
                        </div>
                    </div>
                )}

                {/* Grouped Transactions */}
                {!loading && sortedDateGroups.map(dateGroup => (
                    <div key={dateGroup} className="bg-white dark:bg-card-dark rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
                        {/* Date Group Header */}
                        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/30">
                            <h3 className="text-sm font-semibold text-slate-900 dark:text-white">{dateGroup}</h3>
                        </div>

                        {/* Transactions List */}
                        <div className="divide-y divide-slate-200 dark:divide-slate-700">
                            {groupedTransactions[dateGroup].map(tx => (
                                <div
                                    key={tx.id}
                                    className="group px-6 py-4 hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors flex items-center justify-between gap-4"
                                >
                                    <div className="flex items-center gap-4 flex-1 min-w-0">
                                        {/* Icon */}
                                        <div className={`size-12 rounded-full ${getCategoryColors(tx.category).bg} flex items-center justify-center text-2xl shrink-0`}>
                                            {getCategoryIcon(tx.category)}
                                        </div>

                                        {/* Details */}
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2 mb-1">
                                                <span className="font-medium text-slate-900 dark:text-white truncate">
                                                    {tx.note || tx.category}
                                                </span>
                                                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-300 shrink-0">
                                                    {tx.category}
                                                </span>
                                            </div>
                                            <p className="text-xs text-slate-500 dark:text-slate-400">
                                                {new Date(tx.date).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Amount and Actions */}
                                    <div className="flex items-center gap-3 shrink-0">
                                        <span className={`text-base font-semibold ${tx.type === 'income' ? 'text-accent-green' : 'text-slate-900 dark:text-white'}`}>
                                            {formatAmount(tx.amount, tx.type)}
                                        </span>

                                        {/* Delete Button */}
                                        <button
                                            onClick={() => handleDelete(tx.id)}
                                            className="opacity-0 group-hover:opacity-100 p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-slate-400 hover:text-red-600 dark:hover:text-red-400 transition-all"
                                            title="Delete transaction"
                                        >
                                            <span className="material-symbols-outlined text-[20px]">delete</span>
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Transactions;
