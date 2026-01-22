import React, { useState, useEffect } from 'react';
import { fetchTransactions } from '../lib/api';
import { parseApiError } from '../lib/api';

const Wallet = () => {
    const [budgets, setBudgets] = useState({});
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editMode, setEditMode] = useState(false);
    const [editableBudgets, setEditableBudgets] = useState({});

    // Default categories
    const defaultCategories = [
        'Food & Dining',
        'Transport',
        'Entertainment',
        'Shopping',
        'Health & Fitness',
        'Bills',
        'Utilities',
        'Other'
    ];

    // Load budgets from localStorage and fetch transactions on mount
    useEffect(() => {
        loadBudgets();
        loadTransactions();
    }, []);

    const loadBudgets = () => {
        const saved = localStorage.getItem('budget_settings');
        if (saved) {
            try {
                const parsed = JSON.parse(saved);
                setBudgets(parsed);
                setEditableBudgets(parsed);
            } catch (error) {
                console.error('Failed to parse budget settings:', error);
            }
        }
    };

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

    // Save budgets to localStorage
    const saveBudgets = () => {
        localStorage.setItem('budget_settings', JSON.stringify(editableBudgets));
        setBudgets(editableBudgets);
        setEditMode(false);
    };

    // Cancel editing
    const cancelEdit = () => {
        setEditableBudgets(budgets);
        setEditMode(false);
    };

    // Calculate spending for current month by category
    const calculateMonthlySpending = () => {
        const now = new Date();
        const currentMonth = now.getMonth();
        const currentYear = now.getFullYear();

        const spending = {};

        transactions
            .filter(tx => {
                const txDate = new Date(tx.date);
                return (
                    tx.type === 'expense' &&
                    txDate.getMonth() === currentMonth &&
                    txDate.getFullYear() === currentYear
                );
            })
            .forEach(tx => {
                if (!spending[tx.category]) {
                    spending[tx.category] = 0;
                }
                spending[tx.category] += tx.amount;
            });

        return spending;
    };

    // Get progress bar color based on percentage
    const getProgressColor = (percentage) => {
        if (percentage >= 100) return 'bg-red-500';
        if (percentage >= 75) return 'bg-yellow-500';
        return 'bg-green-500';
    };

    // Get progress bar shadow based on percentage
    const getProgressShadow = (percentage) => {
        if (percentage >= 100) return 'shadow-[0_0_8px_rgba(239,68,68,0.5)]';
        if (percentage >= 75) return 'shadow-[0_0_8px_rgba(234,179,8,0.5)]';
        return 'shadow-[0_0_8px_rgba(34,197,94,0.5)]';
    };

    // Format currency
    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(amount);
    };

    const monthlySpending = calculateMonthlySpending();

    // Get all categories (from budgets + spending)
    const allCategories = new Set([
        ...Object.keys(budgets),
        ...Object.keys(monthlySpending),
        ...defaultCategories
    ]);

    // Calculate totals
    const totalBudget = Object.values(budgets).reduce((sum, val) => sum + (parseFloat(val) || 0), 0);
    const totalSpent = Object.values(monthlySpending).reduce((sum, val) => sum + val, 0);
    const overallPercentage = totalBudget > 0 ? (totalSpent / totalBudget * 100) : 0;

    return (
        <div className="flex-1 overflow-y-auto p-6 lg:p-8">
            <div className="max-w-6xl mx-auto flex flex-col gap-8">
                {/* Header */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                        <h1 className="text-3xl font-black text-slate-900 dark:text-white">Budget Planner</h1>
                        <p className="text-slate-500 dark:text-slate-400 mt-1">Track your monthly spending against budget targets</p>
                    </div>
                    {!editMode ? (
                        <button
                            onClick={() => {
                                setEditableBudgets(budgets);
                                setEditMode(true);
                            }}
                            className="flex items-center gap-2 px-6 py-3 bg-primary rounded-xl text-white text-sm font-bold hover:bg-primary/90 transition-colors shadow-lg shadow-primary/25 cursor-pointer"
                        >
                            <span className="material-symbols-outlined text-[20px]">edit</span>
                            Edit Budget
                        </button>
                    ) : (
                        <div className="flex gap-3">
                            <button
                                onClick={cancelEdit}
                                className="px-6 py-3 bg-slate-100 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl text-slate-700 dark:text-white text-sm font-bold hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors cursor-pointer"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={saveBudgets}
                                className="flex items-center gap-2 px-6 py-3 bg-primary rounded-xl text-white text-sm font-bold hover:bg-primary/90 transition-colors shadow-lg shadow-primary/25 cursor-pointer"
                            >
                                <span className="material-symbols-outlined text-[20px]">save</span>
                                Save Budget
                            </button>
                        </div>
                    )}
                </div>

                {/* Summary Card */}
                <div className="bg-gradient-to-br from-primary to-purple-600 rounded-2xl p-8 text-white shadow-lg">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div>
                            <p className="text-white/70 text-sm font-medium mb-1">Total Budget</p>
                            <p className="text-3xl font-bold">{formatCurrency(totalBudget)}</p>
                        </div>
                        <div>
                            <p className="text-white/70 text-sm font-medium mb-1">Total Spent</p>
                            <p className="text-3xl font-bold">{formatCurrency(totalSpent)}</p>
                        </div>
                        <div>
                            <p className="text-white/70 text-sm font-medium mb-1">Remaining</p>
                            <p className={`text-3xl font-bold ${totalBudget - totalSpent < 0 ? 'text-red-200' : 'text-green-200'}`}>
                                {formatCurrency(totalBudget - totalSpent)}
                            </p>
                        </div>
                    </div>
                    {totalBudget > 0 && (
                        <div className="mt-6">
                            <div className="flex justify-between mb-2">
                                <span className="text-white/80 text-sm">Overall Progress</span>
                                <span className="text-white font-semibold">{overallPercentage.toFixed(1)}%</span>
                            </div>
                            <div className="h-3 w-full bg-white/20 rounded-full overflow-hidden">
                                <div
                                    className={`h-full ${overallPercentage >= 100 ? 'bg-red-300' : overallPercentage >= 75 ? 'bg-yellow-300' : 'bg-green-300'} rounded-full transition-all duration-1000`}
                                    style={{ width: `${Math.min(overallPercentage, 100)}%` }}
                                ></div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Loading State */}
                {loading && (
                    <div className="bg-white dark:bg-card-dark rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm p-12 flex items-center justify-center">
                        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                    </div>
                )}

                {/* Budget Items */}
                {!loading && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {Array.from(allCategories).map((category) => {
                            const budget = parseFloat(budgets[category]) || 0;
                            const spent = monthlySpending[category] || 0;
                            const percentage = budget > 0 ? (spent / budget * 100) : 0;

                            // Skip if no budget and no spending and not in edit mode
                            if (!budget && !spent && !editMode) return null;

                            return (
                                <div
                                    key={category}
                                    className="bg-white dark:bg-card-dark rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm p-6 hover:shadow-md transition-all"
                                >
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="flex items-center gap-3">
                                            <div className={`size-3 rounded-full ${getProgressColor(percentage)} ${getProgressShadow(percentage)}`}></div>
                                            <h3 className="font-bold text-slate-900 dark:text-white">{category}</h3>
                                        </div>
                                        {percentage > 100 && !editMode && (
                                            <span className="px-2 py-1 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 text-xs font-semibold rounded-full">
                                                Over Budget!
                                            </span>
                                        )}
                                    </div>

                                    {editMode ? (
                                        <div className="space-y-2">
                                            <label className="text-sm text-slate-600 dark:text-slate-400">Monthly Budget Target</label>
                                            <input
                                                type="number"
                                                value={editableBudgets[category] || ''}
                                                onChange={(e) => {
                                                    setEditableBudgets({
                                                        ...editableBudgets,
                                                        [category]: e.target.value
                                                    });
                                                }}
                                                placeholder="Enter amount..."
                                                className="w-full rounded-xl text-slate-900 dark:text-white border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-900/50 focus:ring-2 focus:ring-primary focus:border-transparent h-12 px-4 text-base font-normal placeholder:text-slate-400 dark:placeholder:text-slate-500 outline-none transition-all"
                                            />
                                        </div>
                                    ) : (
                                        <>
                                            <div className="flex justify-between mb-2">
                                                <span className="text-sm text-slate-600 dark:text-slate-400">
                                                    <span className="text-slate-900 dark:text-white font-bold text-base">{formatCurrency(spent)}</span>
                                                    {budget > 0 && ` / ${formatCurrency(budget)}`}
                                                </span>
                                                {budget > 0 && (
                                                    <span className={`text-sm font-semibold ${percentage >= 100 ? 'text-red-600 dark:text-red-400' : percentage >= 75 ? 'text-yellow-600 dark:text-yellow-400' : 'text-green-600 dark:text-green-400'}`}>
                                                        {percentage.toFixed(1)}%
                                                    </span>
                                                )}
                                            </div>
                                            {budget > 0 && (
                                                <div className="h-2.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                                                    <div
                                                        className={`h-full ${getProgressColor(percentage)} rounded-full transition-all duration-1000 ease-out`}
                                                        style={{ width: `${Math.min(percentage, 100)}%` }}
                                                    ></div>
                                                </div>
                                            )}
                                            {!budget && spent > 0 && (
                                                <p className="text-sm text-slate-500 dark:text-slate-400 italic">No budget set</p>
                                            )}
                                        </>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                )}

                {/* Empty State */}
                {!loading && Object.keys(budgets).length === 0 && Object.keys(monthlySpending).length === 0 && !editMode && (
                    <div className="bg-white dark:bg-card-dark rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm p-12 flex flex-col items-center justify-center gap-4">
                        <span className="material-symbols-outlined text-[64px] text-slate-300 dark:text-slate-600">savings</span>
                        <div className="text-center">
                            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-1">No budgets set</h3>
                            <p className="text-sm text-slate-500 dark:text-slate-400">
                                Click "Edit Budget" to set spending limits for your categories
                            </p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Wallet;
