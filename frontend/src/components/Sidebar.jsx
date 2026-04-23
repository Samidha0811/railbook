import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Train, Users, Ticket, LogOut, ArrowLeft, CreditCard } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Swal from 'sweetalert2';

const Sidebar = () => {
    const { logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        Swal.fire({
            title: 'Admin Sign Out?',
            text: 'You are about to exit the administrator panel.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#059669',
            cancelButtonColor: '#ef4444',
            confirmButtonText: 'Yes, Sign Out',
            cancelButtonText: 'Stay',
            background: '#ffffff',
            customClass: {
                title: 'text-xl font-black text-railway-dark uppercase tracking-tight',
                htmlContainer: 'text-sm font-medium text-slate-600',
                confirmButton: 'px-6 py-2.5 rounded-lg font-bold text-xs uppercase transition-all',
                cancelButton: 'px-6 py-2.5 rounded-lg font-bold text-xs uppercase transition-all'
            }
        }).then((result) => {
            if (result.isConfirmed) {
                logout();
                navigate('/login');
                
                const Toast = Swal.mixin({
                    toast: true,
                    position: 'top-end',
                    showConfirmButton: false,
                    timer: 3000,
                    timerProgressBar: true
                });

                Toast.fire({
                    icon: 'success',
                    title: 'Admin signed out successfully'
                });
            }
        });
    };

    const navItems = [
        { name: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
        { name: 'Trains', path: '/admin/trains', icon: Train },
        { name: 'Users', path: '/admin/users', icon: Users },
        { name: 'Bookings', path: '/admin/bookings', icon: Ticket },
        { name: 'Transactions', path: '/admin/transactions', icon: CreditCard },
    ];

    return (
        <div className="w-56 bg-railway-dark h-full text-white flex flex-col border-r border-white/5">
            <div className="p-4 border-b border-white/5">
                <div className="flex items-center space-x-2">
                    <div className="w-7 h-7 bg-railway-primary rounded-lg flex items-center justify-center">
                        <Train size={14} className="text-white" />
                    </div>
                    <div>
                        <h1 className="text-sm font-black text-white tracking-tight">RailBook</h1>
                        <p className="text-[9px] text-railway-silver font-semibold uppercase tracking-wider">Admin Panel</p>
                    </div>
                </div>
            </div>
            
            <nav className="flex-grow p-3 space-y-1 mt-2">
                {navItems.map((item) => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        className={({ isActive }) =>
                            `flex items-center space-x-2.5 px-3 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${
                                isActive 
                                ? 'bg-railway-primary text-white shadow-md shadow-railway-primary/20' 
                                : 'text-railway-silver hover:bg-white/5 hover:text-white'
                            }`
                        }
                    >
                        <item.icon size={16} />
                        <span>{item.name}</span>
                    </NavLink>
                ))}
            </nav>

            <div className="p-3 border-t border-white/5 space-y-1">
                <button 
                    onClick={() => navigate('/home')}
                    className="flex items-center space-x-2.5 px-3 py-2 w-full text-railway-silver hover:bg-white/5 hover:text-white rounded-lg text-sm font-semibold transition-all"
                >
                    <ArrowLeft size={16} />
                    <span>Back to Site</span>
                </button>
                <button 
                    onClick={handleLogout}
                    className="flex items-center space-x-2.5 px-3 py-2 w-full text-red-400 hover:bg-red-500/10 rounded-lg text-sm font-semibold transition-all"
                >
                    <LogOut size={16} />
                    <span>Logout</span>
                </button>
            </div>
        </div>
    );
};

export default Sidebar;
