import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authService } from '../services/api';
import { UserPlus, Mail, Lock, User, Train } from 'lucide-react';

const Register = () => {
    const [fullname, setFullname] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            await authService.register(fullname, email, password, 'ROLE_USER');
            navigate('/login');
        } catch (err) {
            setError(err.response?.data || 'Registration failed. Try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-[calc(100vh-56px)] flex items-center justify-center bg-gradient-to-br from-railway-surface to-slate-200 py-8 px-4">
            <div className="w-full max-w-sm">
                <div className="bg-white rounded-xl shadow-xl border border-slate-100 overflow-hidden">
                    {/* Header */}
                    <div className="bg-railway-dark p-5 text-center">
                        <div className="w-10 h-10 bg-railway-primary rounded-xl flex items-center justify-center mx-auto mb-2">
                            <Train size={20} className="text-white" />
                        </div>
                        <h2 className="text-lg font-black text-white">Create Account</h2>
                        <p className="text-railway-silver text-xs mt-0.5">Join RailBook and start booking</p>
                    </div>

                    {/* Form */}
                    <div className="p-5">
                        <form onSubmit={handleSubmit} className="space-y-3">
                            {error && (
                                <div className="bg-red-50 border border-red-100 text-red-600 px-3 py-2 rounded-lg text-xs font-medium">{error}</div>
                            )}
                            <div>
                                <label className="block text-xs font-bold text-black uppercase tracking-wider mb-1">Full Name</label>
                                <div className="relative">
                                    <User size={14} className="absolute left-3 top-2.5 text-slate-300" />
                                    <input
                                        type="text"
                                        required
                                        className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-lg text-sm font-medium text-railway-dark placeholder:text-slate-300 focus:border-railway-primary focus:ring-1 focus:ring-railway-primary outline-none transition-all"
                                        placeholder="John Doe"
                                        value={fullname}
                                        onChange={(e) => setFullname(e.target.value)}
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-black uppercase tracking-wider mb-1">Email</label>
                                <div className="relative">
                                    <Mail size={14} className="absolute left-3 top-2.5 text-slate-300" />
                                    <input
                                        type="email"
                                        required
                                        className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-lg text-sm font-medium text-railway-dark placeholder:text-slate-300 focus:border-railway-primary focus:ring-1 focus:ring-railway-primary outline-none transition-all"
                                        placeholder="you@example.com"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-black uppercase tracking-wider mb-1">Password</label>
                                <div className="relative">
                                    <Lock size={14} className="absolute left-3 top-2.5 text-slate-300" />
                                    <input
                                        type="password"
                                        required
                                        className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-lg text-sm font-medium text-railway-dark placeholder:text-slate-300 focus:border-railway-primary focus:ring-1 focus:ring-railway-primary outline-none transition-all"
                                        placeholder="••••••••"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                    />
                                </div>
                            </div>
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full flex items-center justify-center space-x-2 bg-railway-primary hover:bg-railway-primary-light text-white font-extrabold py-3 rounded-lg transition-all shadow-lg shadow-railway-primary/30 active:scale-[0.98] disabled:opacity-50 text-base"
                            >
                                <UserPlus size={18} />
                                <span>{loading ? 'Creating account...' : 'Create Account'}</span>
                            </button>
                        </form>
                        <p className="text-center text-xs text-black/60 mt-4">
                            Already have an account?{' '}
                            <Link to="/login" className="font-bold text-railway-primary hover:text-railway-primary-light transition-colors">Sign in</Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Register;
