import React, { useState } from 'react';
import { addTransaction } from '../lib/api';

const CATEGORIES = [
    'Food',
    'Transport',
    'Entertainment',
    'Shopping',
    'Utilities',
    'Healthcare',
    'Salary',
    'Freelance',
    'Investment',
    'Other'
];

const AddTransactionForm = ({ onClose, onSuccess }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [formData, setFormData] = useState({
        amount: '',
        category: 'Food',
        type: 'expense',
        date: new Date().toISOString().split('T')[0],
        note: ''
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.amount || parseFloat(formData.amount) <= 0) {
            setError('Please enter a valid amount');
            return;
        }

        setIsLoading(true);
        setError('');

        try {
            await addTransaction({
                amount: parseFloat(formData.amount),
                category: formData.category,
                type: formData.type,
                date: new Date(formData.date).toISOString(),
                note: formData.note || null
            });

            onSuccess();
            onClose();
        } catch (err) {
            const errorMessage = err.response?.data?.detail || 'Failed to add transaction';
            setError(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-card-dark rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-slate-200 dark:border-slate-700">
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white">Add Transaction</h2>
                    <button
                        onClick={onClose}
                        className="p-2 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                    >
                        <span className="material-symbols-outlined">close</span>
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6 space-y-5">
                    {error && (
                        <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-500 text-sm flex items-center gap-2">
                            <span className="material-symbols-outlined text-lg">error</span>
                            {error}
                        </div>
                    )}

                    {/* Type Toggle */}
                    <div className="flex gap-2 p-1 bg-slate-100 dark:bg-slate-700 rounded-xl">
                        <button
                            type="button"
                            onClick={() => setFormData(prev => ({ ...prev, type: 'expense' }))}
                            className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition-all ${formData.type === 'expense'
                                    ? 'bg-white dark:bg-slate-600 text-red-500 shadow-sm'
                                    : 'text-slate-500 dark:text-slate-400'
                                }`}
                        >
                            <span className="material-symbols-outlined text-lg align-middle mr-1">remove_circle</span>
                            Expense
                        </button>
                        <button
                            type="button"
                            onClick={() => setFormData(prev => ({ ...prev, type: 'income' }))}
                            className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition-all ${formData.type === 'income'
                                    ? 'bg-white dark:bg-slate-600 text-green-500 shadow-sm'
                                    : 'text-slate-500 dark:text-slate-400'
                                }`}
                        >
                            <span className="material-symbols-outlined text-lg align-middle mr-1">add_circle</span>
                            Income
                        </button>
                    </div>

                    {/* Amount */}
                    <div className="space-y-1.5">
                        <label className="text-slate-700 dark:text-slate-300 text-sm font-medium">Amount</label>
                        <div className="relative">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm">Rp</span>
                            <input
                                className="w-full h-12 pl-12 pr-4 rounded-xl bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-600 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none placeholder:text-slate-400 text-lg font-semibold"
                                placeholder="0"
                                type="number"
                                name="amount"
                                value={formData.amount}
                                onChange={handleInputChange}
                                min="0"
                                step="1000"
                                required
                            />
                        </div>
                    </div>

                    {/* Category */}
                    <div className="space-y-1.5">
                        <label className="text-slate-700 dark:text-slate-300 text-sm font-medium">Category</label>
                        <select
                            className="w-full h-12 px-4 rounded-xl bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-600 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none"
                            name="category"
                            value={formData.category}
                            onChange={handleInputChange}
                        >
                            {CATEGORIES.map(cat => (
                                <option key={cat} value={cat}>{cat}</option>
                            ))}
                        </select>
                    </div>

                    {/* Date */}
                    <div className="space-y-1.5">
                        <label className="text-slate-700 dark:text-slate-300 text-sm font-medium">Date</label>
                        <input
                            className="w-full h-12 px-4 rounded-xl bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-600 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none"
                            type="date"
                            name="date"
                            value={formData.date}
                            onChange={handleInputChange}
                            required
                        />
                    </div>

                    {/* Note */}
                    <div className="space-y-1.5">
                        <label className="text-slate-700 dark:text-slate-300 text-sm font-medium">Note (optional)</label>
                        <input
                            className="w-full h-12 px-4 rounded-xl bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-600 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none placeholder:text-slate-400"
                            placeholder="e.g., Lunch with team"
                            type="text"
                            name="note"
                            value={formData.note}
                            onChange={handleInputChange}
                        />
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-3.5 rounded-xl transition-all shadow-lg shadow-primary/25 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98]"
                    >
                        {isLoading ? (
                            <>
                                <span className="material-symbols-outlined text-xl animate-spin">progress_activity</span>
                                Adding...
                            </>
                        ) : (
                            <>
                                <span className="material-symbols-outlined text-xl">add</span>
                                Add Transaction
                            </>
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AddTransactionForm;
