import React, { useState } from 'react';
import Layout from './components/Layout';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import Transactions from './components/Transactions';
import Wallet from './components/Wallet';
import Settings from './components/Settings';
import Auth from './components/Auth';
import Sidebar from './components/Sidebar';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentView, setCurrentView] = useState('dashboard');

  if (!isAuthenticated) {
    return <Auth onLogin={() => setIsAuthenticated(true)} />;
  }

  return (
    <>
      <Sidebar
        currentView={currentView}
        onNavigate={setCurrentView}
        onLogout={() => setIsAuthenticated(false)}
      />
      <main className="flex-1 flex flex-col h-full overflow-hidden relative">
        <Header
          title={
            currentView === 'dashboard' ? 'Dashboard'
              : currentView === 'transactions' ? 'Transactions'
                : currentView === 'wallet' ? 'My Wallet'
                  : 'Settings'
          }
          subtitle={
            currentView === 'dashboard' ? "Welcome back, here's your financial overview."
              : currentView === 'transactions' ? "View and manage your recent financial activity."
                : currentView === 'wallet' ? "Manage your cards, balances, and budgets."
                  : "Manage your account preferences, categories, and data security."
          }
        />
        {currentView === 'dashboard' && <Dashboard />}
        {currentView === 'transactions' && <Transactions />}
        {currentView === 'wallet' && <Wallet />}
        {currentView === 'settings' && <Settings />}
      </main>
    </>
  );
}

export default App;
