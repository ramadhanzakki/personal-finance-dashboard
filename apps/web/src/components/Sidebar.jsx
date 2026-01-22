import React from 'react';

const Sidebar = ({ currentView, onNavigate, onLogout }) => {
    return (
        <aside className="w-64 h-full flex flex-col justify-between border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-background-dark flex-shrink-0 z-20 hidden lg:flex">
            <div>
                {/* Logo */}
                <div className="h-20 flex items-center px-8">
                    <div className="flex items-center gap-3">
                        <div className="size-8 rounded-lg bg-primary flex items-center justify-center text-white">
                            <span className="material-symbols-outlined text-xl">incomplete_circle</span>
                        </div>
                        <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">FinTrack</h1>
                    </div>
                </div>

                {/* Navigation */}
                <nav className="flex flex-col gap-2 px-4 mt-4">
                    <button
                        onClick={() => onNavigate('dashboard')}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${currentView === 'dashboard' ? 'bg-primary/10 text-primary' : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'}`}
                    >
                        <span className={`material-symbols-outlined ${currentView === 'dashboard' ? 'fill-1' : ''}`}>dashboard</span>
                        <span className="font-medium text-sm">Dashboard</span>
                    </button>
                    <button
                        onClick={() => onNavigate('transactions')}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${currentView === 'transactions' ? 'bg-primary/10 text-primary' : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'}`}
                    >
                        <span className={`material-symbols-outlined ${currentView === 'transactions' ? 'fill-1' : ''}`}>receipt_long</span>
                        <span className="font-medium text-sm">Transactions</span>
                    </button>
                    <button
                        onClick={() => onNavigate('wallet')}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${currentView === 'wallet' ? 'bg-primary/10 text-primary' : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'}`}
                    >
                        <span className={`material-symbols-outlined ${currentView === 'wallet' ? 'fill-1' : ''}`}>account_balance_wallet</span>
                        <span className="font-medium text-sm">Wallet</span>
                    </button>
                    <button
                        onClick={() => onNavigate('settings')}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${currentView === 'settings' ? 'bg-primary/10 text-primary' : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'}`}
                    >
                        <span className={`material-symbols-outlined ${currentView === 'settings' ? 'fill-1' : ''}`} style={currentView === 'settings' ? { fontVariationSettings: "'FILL' 1" } : {}}>settings</span>
                        <span className="font-medium text-sm">Settings</span>
                    </button>
                </nav>
            </div>

            {/* Footer / Logout */}
            <div className="p-4 border-t border-slate-200 dark:border-slate-800">
                <button
                    onClick={onLogout}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-left"
                >
                    <span className="material-symbols-outlined">logout</span>
                    <span className="font-medium text-sm">Logout</span>
                </button>
                <div className="mt-4 flex items-center gap-3 px-2">
                    <div className="size-10 rounded-full bg-cover bg-center bg-[url('https://lh3.googleusercontent.com/aida-public/AB6AXuDs8MFvxjC5urTqjPJGn7ki7uHuw7ft5WGsusZb2H5-t5YKNboDlQR6sEp2kVCrSNZhTur42I5MLkUynk8WhX2my22UYe5fCpb2eK6qHbNaJmoTu9IEbu60P9DTVSidi1hCugkiIEH4aL9-DRCr1loAUYQsbsTDqKmuVXqeph3UtID8bBrR1qYF_CTxr3EIdntRFV9vY1GFckKtMdrlIr16rPHEvt9jhmuDSSaB5XEW8Xhi2Z-WiN1eqT9u-ixsqQtUd7BE9D_xk09l')]"></div>
                    <div className="flex flex-col overflow-hidden">
                        <p className="text-sm font-semibold truncate text-slate-900 dark:text-white">Jane Doe</p>
                        <p className="text-xs text-slate-500 truncate">jane@fintrack.com</p>
                    </div>
                </div>
            </div>
        </aside>
    );
};

export default Sidebar;
