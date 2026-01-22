import React, { useState, useEffect } from 'react';
import { getCurrentUser, logout, fetchTransactions } from '../lib/api';
import { parseApiError } from '../lib/api';

const Settings = () => {
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [categories, setCategories] = useState([
        'Food & Dining',
        'Transport',
        'Income',
        'Entertainment',
        'Shopping',
        'Health & Fitness',
        'Bills',
        'Salary',
        'Other'
    ]);
    const [newCategoryName, setNewCategoryName] = useState('');
    const [exportLoading, setExportLoading] = useState(false);

    // Fetch user data on mount
    useEffect(() => {
        loadUserData();
    }, []);

    const loadUserData = async () => {
        try {
            setLoading(true);
            const data = await getCurrentUser();
            setUserData(data);
        } catch (error) {
            console.error('Failed to fetch user data:', parseApiError(error));
        } finally {
            setLoading(false);
        }
    };

    // Handle logout
    const handleLogout = () => {
        logout(); // Clear token
        window.location.href = '/'; // Redirect to login/home
    };

    // Handle CSV export
    const handleExportCSV = async () => {
        try {
            setExportLoading(true);

            // Fetch all transactions
            const transactions = await fetchTransactions();

            if (transactions.length === 0) {
                alert('No transactions to export');
                return;
            }

            // Create CSV content
            const headers = ['Date', 'Type', 'Category', 'Amount', 'Note'];
            const rows = transactions.map(tx => [
                new Date(tx.date).toLocaleDateString('en-US'),
                tx.type,
                tx.category,
                tx.amount,
                tx.note || ''
            ]);

            // Convert to CSV string
            const csvContent = [
                headers.join(','),
                ...rows.map(row => row.map(cell => {
                    // Escape cells that contain commas or quotes
                    const cellStr = String(cell);
                    if (cellStr.includes(',') || cellStr.includes('"') || cellStr.includes('\n')) {
                        return `"${cellStr.replace(/"/g, '""')}"`;
                    }
                    return cellStr;
                }).join(','))
            ].join('\n');

            // Create blob and download
            const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
            const link = document.createElement('a');
            const url = URL.createObjectURL(blob);

            link.setAttribute('href', url);
            link.setAttribute('download', 'finance_data.csv');
            link.style.visibility = 'hidden';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

            console.log('CSV export successful');
        } catch (error) {
            console.error('Failed to export CSV:', parseApiError(error));
            alert('Failed to export data. Please try again.');
        } finally {
            setExportLoading(false);
        }
    };

    // Handle add category
    const handleAddCategory = () => {
        const trimmedName = newCategoryName.trim();

        // Validate
        if (!trimmedName) {
            alert('Category name cannot be empty');
            return;
        }

        if (categories.includes(trimmedName)) {
            alert('Category already exists');
            return;
        }

        // Add to list
        setCategories([...categories, trimmedName]);
        setNewCategoryName(''); // Clear input
    };

    // Handle remove category
    const handleRemoveCategory = (categoryToRemove) => {
        setCategories(categories.filter(cat => cat !== categoryToRemove));
    };

    // Get category style (income categories get green color)
    const getCategoryStyle = (category) => {
        const incomeCategories = ['Income', 'Salary'];
        if (incomeCategories.includes(category)) {
            return 'bg-green-500/20 border-green-500/30 text-green-600 dark:text-green-400';
        }
        return 'bg-primary/20 border-primary/30 text-slate-900 dark:text-white';
    };

    return (
        <div className="flex-1 overflow-y-auto p-6 lg:p-8">
            <div className="max-w-[1000px] mx-auto">
                {/* Page Heading */}
                <div className="mb-10">
                    <h1 className="text-slate-900 dark:text-white text-3xl font-black leading-tight tracking-[-0.033em]">Settings</h1>
                    <p className="text-slate-500 dark:text-[#a290cb] text-base font-normal mt-2">Manage your account preferences, categories, and data security.</p>
                </div>

                {/* Profile Section */}
                <section className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-white/5 mb-8 overflow-hidden shadow-sm">
                    <h2 className="text-slate-900 dark:text-white text-[20px] font-bold px-6 py-5 border-b border-slate-200 dark:border-white/5">Profile Settings</h2>
                    <div className="p-6">
                        {loading ? (
                            <div className="flex items-center justify-center py-12">
                                <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                            </div>
                        ) : (
                            <>
                                <div className="flex flex-col sm:flex-row items-center gap-8 mb-8">
                                    <div className="relative group shrink-0">
                                        <div className="h-28 w-28 rounded-full bg-gradient-to-tr from-primary to-purple-400 border-4 border-white dark:border-slate-800 flex items-center justify-center overflow-hidden shadow-lg">
                                            <div className="bg-center bg-no-repeat aspect-square bg-cover w-full h-full" style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuDw2-SUP-3BDy0NexVEFRQR36qbP1peRSNC9_S4J0lXjrfm1WyPZ_zweduc1J_rfSHhc3rg2aeyBGd2mrdQIP1jTZbAAY9qvRHbqLXIm_ffirpIi-SmlUouJCF6VyGB4TfAB6cOraCyDHv04gRwXRn54OOPiCYPbYx1Y2h4K5ffNEgfvCmPJiuFbHYqhKa48A1dAfkYq9NEyKp9fnwrwkDTfe1jCzjybnN1ajOxG6jBkfGnaHxKxYIoI4R2TVrxsYDKEyyfVXbwk-0-")' }}></div>
                                        </div>
                                        <button className="absolute bottom-0 right-0 h-8 w-8 bg-primary rounded-full flex items-center justify-center border-2 border-white dark:border-slate-800 hover:scale-110 transition-transform cursor-pointer shadow-md">
                                            <span className="material-symbols-outlined text-[16px] text-white">edit</span>
                                        </button>
                                    </div>
                                    <div className="text-center sm:text-left">
                                        <h3 className="text-slate-900 dark:text-white text-lg font-bold">Your Photo</h3>
                                        <p className="text-slate-500 dark:text-[#a290cb] text-sm mt-1">This will be displayed on your profile.</p>
                                        <div className="flex justify-center sm:justify-start gap-3 mt-4">
                                            <button className="px-4 py-2 bg-primary rounded-lg text-sm font-bold text-white hover:bg-primary/80 transition-colors shadow-lg shadow-primary/25 cursor-pointer">Upload New</button>
                                            <button className="px-4 py-2 bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-lg text-sm font-bold text-slate-700 dark:text-white hover:bg-slate-200 dark:hover:bg-white/10 transition-colors cursor-pointer">Remove</button>
                                        </div>
                                    </div>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                    {/* Display Name */}
                                    <div className="flex flex-col gap-2">
                                        <label className="text-slate-900 dark:text-white text-sm font-medium">Display Name</label>
                                        <input
                                            className="w-full rounded-xl text-slate-900 dark:text-white border border-slate-200 dark:border-none bg-white dark:bg-slate-900/50 focus:ring-2 focus:ring-primary focus:border-transparent h-12 px-4 text-base font-normal placeholder:text-slate-400 dark:placeholder:text-[#a290cb] outline-none transition-all"
                                            placeholder="Enter name"
                                            type="text"
                                            value={userData?.full_name || ''}
                                            readOnly
                                        />
                                    </div>
                                    {/* Email */}
                                    <div className="flex flex-col gap-2">
                                        <label className="text-slate-900 dark:text-white text-sm font-medium">Email Address</label>
                                        <input
                                            className="w-full rounded-xl text-slate-900 dark:text-white border border-slate-200 dark:border-none bg-white dark:bg-slate-900/50 focus:ring-2 focus:ring-primary focus:border-transparent h-12 px-4 text-base font-normal placeholder:text-slate-400 dark:placeholder:text-[#a290cb] outline-none transition-all"
                                            placeholder="Enter email"
                                            type="email"
                                            value={userData?.email || ''}
                                            readOnly
                                        />
                                    </div>
                                </div>
                                {/* Logout Button */}
                                <div className="pt-4 border-t border-slate-200 dark:border-white/5">
                                    <button
                                        onClick={handleLogout}
                                        className="flex items-center gap-2 px-6 py-3 bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-500 rounded-xl text-sm font-bold hover:bg-red-500/20 transition-all cursor-pointer"
                                    >
                                        <span className="material-symbols-outlined">logout</span>
                                        Logout
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                </section>

                {/* Preferences Section */}
                <section className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-white/5 mb-8 shadow-sm">
                    <h2 className="text-slate-900 dark:text-white text-[20px] font-bold px-6 py-5 border-b border-slate-200 dark:border-white/5">App Preferences</h2>
                    <div className="p-6 space-y-8">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                            <div className="flex flex-col">
                                <span className="text-slate-900 dark:text-white font-medium">Default Currency</span>
                                <span className="text-slate-500 dark:text-[#a290cb] text-sm">Used for all your financial overviews</span>
                            </div>
                            <div className="relative w-full sm:w-48">
                                <select className="w-full appearance-none rounded-xl text-slate-900 dark:text-white border border-slate-200 dark:border-none bg-white dark:bg-slate-900/50 focus:ring-2 focus:ring-primary focus:border-transparent h-12 px-4 text-base font-normal outline-none cursor-pointer" defaultValue="IDR">
                                    <option value="USD">USD ($)</option>
                                    <option value="IDR">IDR (Rp)</option>
                                    <option value="EUR">EUR (€)</option>
                                    <option value="GBP">GBP (£)</option>
                                </select>
                                <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 dark:text-[#a290cb] pointer-events-none">expand_more</span>
                            </div>
                        </div>
                        <div className="flex items-center justify-between">
                            <div className="flex flex-col">
                                <span className="text-slate-900 dark:text-white font-medium">Theme Mode</span>
                                <span className="text-slate-500 dark:text-[#a290cb] text-sm">Toggle between light and dark display</span>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input defaultChecked className="sr-only peer" type="checkbox" />
                                <div className="w-14 h-7 bg-slate-200 dark:bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[4px] after:left-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                            </label>
                        </div>
                    </div>
                </section>

                {/* Category Management Section */}
                <section className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-white/5 mb-8 shadow-sm">
                    <div className="px-6 py-5 border-b border-slate-200 dark:border-white/5">
                        <h2 className="text-slate-900 dark:text-white text-[20px] font-bold leading-none">Category Management</h2>
                        <p className="text-slate-500 dark:text-[#a290cb] text-sm mt-2">Manage your spending and income categories</p>
                    </div>
                    <div className="p-6">
                        <div className="flex flex-wrap gap-3 mb-6">
                            {/* Category Tags */}
                            {categories.map((category, index) => (
                                <div
                                    key={index}
                                    className={`flex items-center gap-2 px-3 py-1.5 ${getCategoryStyle(category)} rounded-lg text-sm font-medium`}
                                >
                                    {category}
                                    <button
                                        onClick={() => handleRemoveCategory(category)}
                                        className="hover:text-red-500 transition-colors flex items-center cursor-pointer"
                                    >
                                        <span className="material-symbols-outlined text-[14px]">close</span>
                                    </button>
                                </div>
                            ))}
                        </div>
                        <div className="flex gap-3 max-w-md">
                            <input
                                className="flex-1 rounded-xl text-slate-900 dark:text-white border border-slate-200 dark:border-none bg-white dark:bg-slate-900/50 focus:ring-2 focus:ring-primary focus:border-transparent h-10 px-4 text-sm font-normal placeholder:text-slate-400 dark:placeholder:text-[#a290cb] outline-none transition-all"
                                placeholder="New category name..."
                                type="text"
                                value={newCategoryName}
                                onChange={(e) => setNewCategoryName(e.target.value)}
                                onKeyPress={(e) => {
                                    if (e.key === 'Enter') {
                                        handleAddCategory();
                                    }
                                }}
                            />
                            <button
                                onClick={handleAddCategory}
                                className="flex items-center gap-2 px-4 py-2 bg-primary rounded-lg text-sm font-bold text-white hover:bg-primary/80 transition-colors cursor-pointer"
                            >
                                <span className="material-symbols-outlined text-[18px]">add</span>
                                Add
                            </button>
                        </div>
                    </div>
                </section>

                {/* Data Management Section */}
                <section className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-white/5 mb-12 shadow-sm">
                    <h2 className="text-slate-900 dark:text-white text-[20px] font-bold px-6 py-5 border-b border-slate-200 dark:border-white/5">Data Management</h2>
                    <div className="p-6">
                        <p className="text-slate-500 dark:text-[#a290cb] text-sm mb-6">Manage your account data and privacy. Export your data for offline use or clear your account history.</p>
                        <div className="flex flex-wrap gap-4">
                            <button
                                onClick={handleExportCSV}
                                disabled={exportLoading}
                                className="flex items-center gap-2 px-6 py-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-500 rounded-xl text-sm font-bold hover:bg-emerald-500/20 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <span className="material-symbols-outlined">
                                    {exportLoading ? 'progress_activity' : 'download'}
                                </span>
                                {exportLoading ? 'Exporting...' : 'Export Data (.CSV)'}
                            </button>
                            <button className="flex items-center gap-2 px-6 py-3 bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-500 rounded-xl text-sm font-bold hover:bg-rose-500/20 transition-all cursor-pointer">
                                <span className="material-symbols-outlined">delete_forever</span>
                                Clear All Data
                            </button>
                        </div>
                    </div>
                </section>

                <div className="flex justify-end pt-4 pb-8">
                    <button className="px-8 py-4 bg-primary rounded-xl text-white font-bold text-lg hover:shadow-[0_0_20px_rgba(134,85,246,0.4)] hover:bg-primary/90 transition-all cursor-pointer">
                        Save All Changes
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Settings;
