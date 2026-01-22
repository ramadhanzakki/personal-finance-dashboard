import React from 'react';
import Sidebar from './Sidebar';

const Layout = ({ children }) => {
    return (
        <>
            <Sidebar />
            <main className="flex-1 flex flex-col h-full overflow-hidden relative">
                {children}
            </main>
        </>
    );
};

export default Layout;
