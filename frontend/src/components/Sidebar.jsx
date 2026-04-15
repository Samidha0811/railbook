import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Train, Users, Ticket, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Sidebar = () => {
    const { logout } = useAuth();

    const navItems = [
        { name: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
        { name: 'Manage Trains', path: '/admin/trains', icon: Train },
        { name: 'Manage Users', path: '/admin/users', icon: Users },
        { name: 'Manage Bookings', path: '/admin/bookings', icon: Ticket },
    ];

    return (
        <div className="w-64 bg-gray-900 min-h-screen text-white flex flex-col shadow-2xl">
            <div className="p-6 border-b border-gray-800">
                <h1 className="text-2xl font-black text-railway-blue tracking-tighter italic">ADMIN PANEL</h1>
            </div>
            
            <nav className="flex-grow p-4 space-y-2 mt-4">
                {navItems.map((item) => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        className={({ isActive }) =>
                            `flex items-center space-x-3 p-3 rounded-lg font-bold transition-all duration-200 ${
                                isActive 
                                ? 'bg-railway-blue text-white shadow-lg' 
                                : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                            }`
                        }
                    >
                        <item.icon size={20} />
                        <span>{item.name}</span>
                    </NavLink>
                ))}
            </nav>

            <div className="p-4 border-t border-gray-800">
                <button 
                    onClick={logout}
                    className="flex items-center space-x-3 p-3 w-full text-red-500 hover:bg-red-500/10 rounded-lg font-bold transition-all"
                >
                    <LogOut size={20} />
                    <span>Logout</span>
                </button>
            </div>
        </div>
    );
};

export default Sidebar;
