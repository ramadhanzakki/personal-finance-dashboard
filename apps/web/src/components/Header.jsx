import React from 'react';

const Header = ({ title = "Dashboard", subtitle = "Welcome back, here's your financial overview." }) => {
    return (
        <header className="h-20 flex-shrink-0 flex items-center justify-between px-6 lg:px-8 bg-white dark:bg-background-dark border-b border-slate-200 dark:border-slate-800">
            <div className="flex items-center gap-4 lg:hidden">
                <button className="p-2 -ml-2 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200">
                    <span className="material-symbols-outlined">menu</span>
                </button>
                <h1 className="font-bold text-lg text-slate-900 dark:text-white">FinTrack</h1>
            </div>
            <div className="hidden lg:flex flex-col">
                <h2 className="text-xl font-bold dark:text-white text-slate-900">{title}</h2>
                <p className="text-sm text-slate-500 dark:text-slate-400">{subtitle}</p>
            </div>
            <div className="flex items-center gap-4">
                <div className="hidden md:flex items-center gap-2 px-3 py-2 bg-slate-100 dark:bg-card-dark rounded-lg border border-slate-200 dark:border-slate-700">
                    <span className="material-symbols-outlined text-slate-400 text-[20px]">calendar_today</span>
                    <span className="text-sm font-medium text-slate-600 dark:text-slate-300">Oct 24, 2023</span>
                    <span className="material-symbols-outlined text-slate-400 text-[16px]">expand_more</span>
                </div>
                <button className="relative p-2 text-slate-400 hover:text-primary transition-colors">
                    <span className="material-symbols-outlined">notifications</span>
                    <span className="absolute top-2 right-2 size-2 bg-red-500 rounded-full border-2 border-white dark:border-background-dark"></span>
                </button>
            </div>
        </header>
    );
};

export default Header;
