import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
    const { user, logout, isAdmin } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <nav className="bg-railway-blue text-white shadow-lg">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    <div className="flex items-center">
                        <Link to="/" className="flex-shrink-0 flex items-center space-x-2">
                            <span className="text-2xl font-bold tracking-wider">RAILWAY</span>
                            <span className="text-railway-silver font-light">RES</span>
                        </Link>
                        <div className="hidden md:block">
                            <div className="ml-10 flex items-baseline space-x-4">
                                <Link to="/" className="hover:bg-railway-dark px-3 py-2 rounded-md text-sm font-medium">Home</Link>
                                {user && (
                                    <>
                                        <Link to="/dashboard" className="hover:bg-railway-dark px-3 py-2 rounded-md text-sm font-medium">My Bookings</Link>
                                        {isAdmin && (
                                            <Link to="/admin" className="hover:bg-railway-dark px-3 py-2 rounded-md text-sm font-medium text-yellow-400">Admin Panel</Link>
                                        )}
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center space-x-4">
                        {user ? (
                            <div className="flex items-center space-x-4">
                                <span className="text-sm">Welcome, <span className="font-semibold text-railway-silver">{user.fullname}</span></span>
                                <button
                                    onClick={handleLogout}
                                    className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-md text-sm font-medium transition-colors"
                                >
                                    Logout
                                </button>
                            </div>
                        ) : (
                            <div className="space-x-4">
                                <Link to="/login" className="hover:text-railway-silver text-sm font-medium">Login</Link>
                                <Link to="/register" className="bg-white text-railway-blue hover:bg-railway-silver px-4 py-2 rounded-md text-sm font-medium transition-colors">Register</Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
