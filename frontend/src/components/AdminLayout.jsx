import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';

const AdminLayout = () => {
    return (
        <div className="flex bg-railway-surface min-h-screen">
            <Sidebar />
            <main className="flex-grow p-5 overflow-y-auto">
                <Outlet />
            </main>
        </div>
    );
};

export default AdminLayout;
