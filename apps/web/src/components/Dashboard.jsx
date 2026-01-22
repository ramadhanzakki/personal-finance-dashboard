import React, { useState, useEffect, useCallback } from 'react';
import StatsCards from './StatsCards';
import IncomeExpenseChart from './IncomeExpenseChart';
import CategoryBreakdown from './CategoryBreakdown';
import RecentTransactions from './RecentTransactions';
import AddTransactionForm from './AddTransactionForm';
import { fetchTransactions, deleteTransaction } from '../lib/api';

const Dashboard = () => {
    const [transactions, setTransactions] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const [showAddForm, setShowAddForm] = useState(false);

    // Calculate summary statistics from transactions
    const summary = React.useMemo(() => {
        const totalIncome = transactions
            .filter(t => t.type === 'income')
            .reduce((sum, t) => sum + t.amount, 0);

        const totalExpense = transactions
            .filter(t => t.type === 'expense')
            .reduce((sum, t) => sum + t.amount, 0);

        const totalBalance = totalIncome - totalExpense;

        return { totalBalance, totalIncome, totalExpense };
    }, [transactions]);

    // Calculate category breakdown for expenses
    const categoryData = React.useMemo(() => {
        const expenses = transactions.filter(t => t.type === 'expense');
        const totalExpense = expenses.reduce((sum, t) => sum + t.amount, 0);

        const categoryTotals = expenses.reduce((acc, t) => {
            acc[t.category] = (acc[t.category] || 0) + t.amount;
            return acc;
        }, {});

        // Convert to array with percentages
        return Object.entries(categoryTotals)
            .map(([category, amount]) => ({
                category,
                amount,
                percentage: totalExpense > 0 ? Math.round((amount / totalExpense) * 100) : 0
            }))
            .sort((a, b) => b.amount - a.amount);
    }, [transactions]);

    // Format data for the income/expense chart (grouped by month)
    const chartData = React.useMemo(() => {
        const monthlyData = {};

        transactions.forEach(t => {
            const date = new Date(t.date);
            const monthKey = date.toLocaleDateString('en-US', { month: 'short', year: '2-digit' });

            if (!monthlyData[monthKey]) {
                monthlyData[monthKey] = { month: monthKey, income: 0, expense: 0 };
            }

            if (t.type === 'income') {
                monthlyData[monthKey].income += t.amount;
            } else {
                monthlyData[monthKey].expense += t.amount;
            }
        });

        // Convert to array and sort by date
        return Object.values(monthlyData);
    }, [transactions]);

    // Load transactions
    const loadTransactions = useCallback(async () => {
        try {
            setIsLoading(true);
            setError('');
            const data = await fetchTransactions();
            setTransactions(data);
        } catch (err) {
            setError('Failed to load transactions');
            console.error('Error loading transactions:', err);
        } finally {
            setIsLoading(false);
        }
    }, []);

    // Delete a transaction
    const handleDelete = async (id) => {
        try {
            await deleteTransaction(id);
            // Remove from local state
            setTransactions(prev => prev.filter(t => t.id !== id));
        } catch (err) {
            console.error('Error deleting transaction:', err);
            alert('Failed to delete transaction');
        }
    };

    // Load transactions on mount
    useEffect(() => {
        loadTransactions();
    }, [loadTransactions]);

    // Loading state
    if (isLoading) {
        return (
            <div className="flex-1 flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <span className="material-symbols-outlined text-5xl text-primary animate-spin">progress_activity</span>
                    <p className="text-slate-500 dark:text-slate-400">Loading dashboard...</p>
                </div>
            </div>
        );
    }

    // Error state
    if (error) {
        return (
            <div className="flex-1 flex items-center justify-center">
                <div className="flex flex-col items-center gap-4 text-center">
                    <span className="material-symbols-outlined text-5xl text-red-500">error</span>
                    <p className="text-red-500">{error}</p>
                    <button
                        onClick={loadTransactions}
                        className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90"
                    >
                        Retry
                    </button>
                </div>
            </div>
        );
    }

    return (
        <>
            <div className="flex-1 overflow-y-auto p-6 lg:p-8">
                <div className="max-w-7xl mx-auto flex flex-col gap-6">
                    {/* Add Transaction Button */}
                    <div className="flex justify-end">
                        <button
                            onClick={() => setShowAddForm(true)}
                            className="flex items-center gap-2 px-4 py-2.5 bg-primary hover:bg-primary/90 text-white font-medium rounded-xl transition-all shadow-lg shadow-primary/25 active:scale-[0.98]"
                        >
                            <span className="material-symbols-outlined text-xl">add</span>
                            Add Transaction
                        </button>
                    </div>

                    <StatsCards summary={summary} />

                    {/* Main Chart Section */}
                    <IncomeExpenseChart chartData={chartData} />

                    {/* Bottom Row */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                        <CategoryBreakdown categoryData={categoryData} />
                        <RecentTransactions
                            transactions={transactions}
                            onDelete={handleDelete}
                            onRefresh={loadTransactions}
                        />
                    </div>
                </div>
            </div>

            {/* Add Transaction Modal */}
            {showAddForm && (
                <AddTransactionForm
                    onClose={() => setShowAddForm(false)}
                    onSuccess={loadTransactions}
                />
            )}
        </>
    );
};

export default Dashboard;
