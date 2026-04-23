import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Menu, X, Train } from 'lucide-react';
import Swal from 'sweetalert2';

const Navbar = () => {
    const { user, logout, isAdmin } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [mobileOpen, setMobileOpen] = useState(false);

    const handleLogout = () => {
        Swal.fire({
            title: 'Sign Out?',
            text: 'Are you sure you want to log out of your account?',
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#059669',
            cancelButtonColor: '#ef4444',
            confirmButtonText: 'Yes, Logout',
            cancelButtonText: 'Cancel',
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
                    timerProgressBar: true,
                    didOpen: (toast) => {
                        toast.addEventListener('mouseenter', Swal.stopTimer)
                        toast.addEventListener('mouseleave', Swal.resumeTimer)
                    }
                });

                Toast.fire({
                    icon: 'success',
                    title: 'Signed out successfully'
                });
            }
        });
    };

    if (location.pathname.startsWith('/admin')) return null;

    const isActive = (path) => location.pathname === path;

    return (
        <nav className="bg-railway-dark/95 backdrop-blur-md text-white shadow-lg border-b border-white/5 sticky top-0 z-50">
            <div className="max-w-6xl mx-auto px-4">
                <div className="flex items-center justify-between h-14">
                    <div className="flex items-center space-x-8">
                        <Link to={user ? "/home" : "/"} className="flex items-center space-x-2 group">
                            <div className="w-8 h-8 bg-railway-primary rounded-lg flex items-center justify-center group-hover:bg-railway-primary-light transition-colors">
                                <Train size={16} className="text-white" />
                            </div>
                            <div className="flex items-baseline">
                                <span className="text-lg font-black tracking-tight">Rail</span>
                                <span className="text-lg font-black tracking-tight text-railway-primary-light">Book</span>
                            </div>
                        </Link>
                        <div className="hidden md:flex items-center space-x-1">
                            {!user && (
                                <Link to="/" className={`px-3 py-1.5 rounded-lg text-sm font-semibold transition-all ${isActive('/') ? 'bg-white/10 text-white' : 'text-white/60 hover:text-white hover:bg-white/5'}`}>Home</Link>
                            )}
                            <Link to="/home" className={`px-3 py-1.5 rounded-lg text-sm font-semibold transition-all ${isActive('/home') ? 'bg-white/10 text-white' : 'text-white/60 hover:text-white hover:bg-white/5'}`}>Trains</Link>
                            {user && (
                                <>
                                    <Link to="/dashboard" className={`px-3 py-1.5 rounded-lg text-sm font-semibold transition-all ${isActive('/dashboard') ? 'bg-white/10 text-white' : 'text-white/60 hover:text-white hover:bg-white/5'}`}>My Bookings</Link>
                                    {isAdmin && (
                                        <Link to="/admin" className="px-3 py-1.5 rounded-lg text-sm font-semibold text-railway-accent hover:bg-railway-accent/10 transition-all">Admin</Link>
                                    )}
                                </>
                            )}
                        </div>
                    </div>
                    <div className="hidden md:flex items-center space-x-3">
                        {user ? (
                            <div className="flex items-center space-x-3">
                                <div className="flex items-center space-x-2">
                                    <div className="w-7 h-7 rounded-full bg-railway-primary/20 border border-railway-primary/30 flex items-center justify-center">
                                        <span className="text-xs font-bold text-railway-primary-light">{user.fullname?.charAt(0)}</span>
                                    </div>
                                    <span className="text-sm font-medium text-slate-300">{user.fullname}</span>
                                </div>
                                <button
                                    onClick={handleLogout}
                                    className="bg-red-500/10 text-red-400 hover:bg-red-500/20 px-3 py-1.5 rounded-lg text-xs font-bold transition-all"
                                >
                                    Logout
                                </button>
                            </div>
                        ) : (
                            <div className="flex items-center space-x-2">
                                <Link to="/login" className="text-slate-300 hover:text-white text-sm font-semibold px-3 py-1.5 rounded-lg hover:bg-white/10 transition-all">Login</Link>
                                <Link to="/register" className="bg-railway-primary hover:bg-railway-primary-light text-white px-5 py-2 rounded-lg text-sm font-bold transition-all shadow-md shadow-railway-primary/20">Register</Link>
                            </div>
                        )}
                    </div>
                    {/* Mobile menu button */}
                    <button onClick={() => setMobileOpen(!mobileOpen)} className="md:hidden p-2 text-white/70 hover:text-white">
                        {mobileOpen ? <X size={20} /> : <Menu size={20} />}
                    </button>
                </div>
            </div>
            {/* Mobile menu */}
            {mobileOpen && (
                <div className="md:hidden bg-railway-darker border-t border-white/5 px-4 py-3 space-y-1 animate-fade-in">
                    {!user && (
                        <Link to="/" onClick={() => setMobileOpen(false)} className="block px-3 py-2 rounded-lg text-sm font-semibold text-white/70 hover:bg-white/5">Home</Link>
                    )}
                    <Link to="/home" onClick={() => setMobileOpen(false)} className="block px-3 py-2 rounded-lg text-sm font-semibold text-white/70 hover:bg-white/5">Trains</Link>
                    {user ? (
                        <>
                            <Link to="/dashboard" onClick={() => setMobileOpen(false)} className="block px-3 py-2 rounded-lg text-sm font-semibold text-white/70 hover:bg-white/5">My Bookings</Link>
                            {isAdmin && <Link to="/admin" onClick={() => setMobileOpen(false)} className="block px-3 py-2 rounded-lg text-sm font-semibold text-railway-accent">Admin Panel</Link>}
                            <button onClick={() => { handleLogout(); setMobileOpen(false); }} className="w-full text-left px-3 py-2 rounded-lg text-sm font-semibold text-red-400 hover:bg-red-500/10">Logout</button>
                        </>
                    ) : (
                        <>
                            <Link to="/login" onClick={() => setMobileOpen(false)} className="block px-3 py-2 rounded-lg text-sm font-semibold text-white/70 hover:bg-white/5">Login</Link>
                            <Link to="/register" onClick={() => setMobileOpen(false)} className="block px-3 py-2 rounded-lg text-sm font-semibold bg-railway-primary text-white text-center mt-2">Register</Link>
                        </>
                    )}
                </div>
            )}
        </nav>
    );
};

export default Navbar;
