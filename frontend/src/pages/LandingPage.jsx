import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Train, Shield, Clock, CreditCard, ArrowRight, Star, MapPin, Zap } from 'lucide-react';

const LandingPage = () => {
    const { user } = useAuth();

    const features = [
        { icon: Zap, title: 'Instant Booking', desc: 'Book tickets in under 30 seconds with our streamlined process.' },
        { icon: Shield, title: 'Secure Payments', desc: 'Bank-grade encryption protects every transaction you make.' },
        { icon: Clock, title: 'Real-Time Updates', desc: 'Live seat availability and instant booking confirmations.' },
        { icon: CreditCard, title: 'Easy Refunds', desc: '90% refund on cancellations processed within 24 hours.' },
    ];

    const stats = [
        { value: '10K+', label: 'Happy Passengers' },
        { value: '500+', label: 'Daily Trains' },
        { value: '200+', label: 'Stations' },
        { value: '99.9%', label: 'Uptime' },
    ];

    return (
        <div className="font-outfit">
            {/* Hero Section */}
            <section className="relative bg-railway-dark overflow-hidden">
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-0 left-1/4 w-96 h-96 bg-railway-primary rounded-full blur-3xl"></div>
                    <div className="absolute bottom-0 right-1/4 w-72 h-72 bg-railway-accent rounded-full blur-3xl"></div>
                </div>
                <div className="relative max-w-6xl mx-auto px-4 py-16 lg:py-24">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
                        <div className="animate-fade-in">
                            <div className="inline-flex items-center space-x-2 bg-railway-primary/20 border border-railway-primary/40 rounded-full px-4 py-1.5 mb-4">
                                <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></div>
                                <span className="text-green-300 text-xs font-bold uppercase tracking-wider">Live Booking Available</span>
                            </div>
                            <h1 className="text-4xl lg:text-5xl font-black text-white leading-tight mb-4">
                                Your Journey,<br />
                                <span className="text-gradient">Simplified.</span>
                            </h1>
                            <p className="text-slate-300 text-base lg:text-lg mb-6 max-w-lg leading-relaxed">
                                Book railway tickets instantly. Track routes, manage reservations, and travel worry-free with RailBook.
                            </p>
                            <div className="flex flex-wrap gap-3">
                                <Link
                                    to={user ? "/home" : "/register"}
                                    className="group inline-flex items-center space-x-2 bg-railway-primary hover:bg-railway-primary-light text-white font-extrabold px-7 py-3.5 rounded-xl transition-all shadow-lg shadow-railway-primary/30 hover:shadow-xl hover:shadow-railway-primary/40 active:scale-95 text-base"
                                >
                                    <span>{user ? 'Browse Trains' : 'Get Started Free'}</span>
                                    <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                                </Link>
                                <Link
                                    to="/home"
                                    className="inline-flex items-center space-x-2 border-2 border-white/30 text-white font-bold px-7 py-3.5 rounded-xl hover:bg-white/10 hover:border-white/50 transition-all text-base"
                                >
                                    <span>Explore Routes</span>
                                </Link>
                            </div>
                        </div>
                        <div className="hidden lg:flex justify-center animate-slide-up">
                            <div className="relative">
                                <div className="w-72 h-72 bg-gradient-to-br from-railway-primary/20 to-railway-accent/10 rounded-3xl border border-white/10 backdrop-blur-sm p-6 flex flex-col justify-between">
                                    <div>
                                        <div className="flex items-center space-x-2 mb-4">
                                            <Train size={20} className="text-railway-primary-light" />
                                            <span className="text-green-300 text-xs font-bold uppercase tracking-wider">Live Dashboard</span>
                                        </div>
                                        <div className="space-y-3">
                                            <div className="bg-white/5 rounded-lg p-3">
                                                <div className="flex justify-between items-center">
                                                    <div>
                                                        <p className="text-white font-bold text-sm">Rajdhani Exp</p>
                                                        <p className="text-white/40 text-[10px]">DEL → MUM</p>
                                                    </div>
                                                    <span className="text-[10px] font-bold bg-green-500/20 text-green-400 px-2 py-0.5 rounded-full">ON TIME</span>
                                                </div>
                                            </div>
                                            <div className="bg-white/5 rounded-lg p-3">
                                                <div className="flex justify-between items-center">
                                                    <div>
                                                        <p className="text-white font-bold text-sm">Shatabdi Exp</p>
                                                        <p className="text-white/40 text-[10px]">BLR → CHE</p>
                                                    </div>
                                                    <span className="text-[10px] font-bold bg-railway-accent/20 text-railway-accent px-2 py-0.5 rounded-full">BOARDING</span>
                                                </div>
                                            </div>
                                            <div className="bg-white/5 rounded-lg p-3">
                                                <div className="flex justify-between items-center">
                                                    <div>
                                                        <p className="text-white font-bold text-sm">Duronto Exp</p>
                                                        <p className="text-white/40 text-[10px]">KOL → DEL</p>
                                                    </div>
                                                    <span className="text-[10px] font-bold bg-green-500/20 text-green-400 px-2 py-0.5 rounded-full">42 SEATS</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="absolute -bottom-4 -right-4 w-40 h-24 bg-gradient-to-br from-railway-muted to-railway-dark rounded-2xl border border-white/10 p-4 shadow-xl">
                                    <p className="text-[10px] text-slate-300 font-bold uppercase mb-1">Today's Bookings</p>
                                    <p className="text-2xl font-black text-railway-primary-light">1,247</p>
                                    <p className="text-[10px] text-green-400 font-bold">↑ 12% from yesterday</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Stats Bar */}
            <section className="bg-railway-muted border-y border-white/5">
                <div className="max-w-6xl mx-auto px-4 py-6">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {stats.map((stat, i) => (
                            <div key={i} className="text-center">
                                <p className="text-2xl lg:text-3xl font-black text-railway-primary-light">{stat.value}</p>
                                <p className="text-xs text-slate-300 font-semibold uppercase tracking-wider mt-0.5">{stat.label}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Features */}
            <section className="bg-railway-surface py-14">
                <div className="max-w-6xl mx-auto px-4">
                    <div className="text-center mb-10">
                        <h2 className="text-2xl lg:text-3xl font-black text-railway-dark mb-2">Why Choose RailBook?</h2>
                        <p className="text-slate-500 text-sm max-w-md mx-auto">Everything you need for a seamless railway booking experience.</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        {features.map((feature, i) => (
                            <div key={i} className="group bg-white rounded-xl p-5 border border-slate-100 hover:border-railway-primary/30 hover:shadow-lg hover:shadow-railway-primary/5 transition-all duration-300">
                                <div className="w-10 h-10 bg-railway-primary/10 rounded-lg flex items-center justify-center mb-3 group-hover:bg-railway-primary/20 transition-colors">
                                    <feature.icon size={20} className="text-railway-primary" />
                                </div>
                                <h3 className="font-bold text-railway-dark text-sm mb-1">{feature.title}</h3>
                                <p className="text-slate-500 text-xs leading-relaxed">{feature.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* How It Works */}
            <section className="bg-white py-14 border-t border-slate-100">
                <div className="max-w-6xl mx-auto px-4">
                    <div className="text-center mb-10">
                        <h2 className="text-2xl lg:text-3xl font-black text-railway-dark mb-2">How It Works</h2>
                        <p className="text-slate-500 text-sm">Three simple steps to your next journey.</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {[
                            { step: '01', title: 'Search Trains', desc: 'Enter your source, destination, and travel date to find available trains.', icon: MapPin },
                            { step: '02', title: 'Select & Book', desc: 'Choose your preferred train and confirm your booking with passenger details.', icon: Train },
                            { step: '03', title: 'Travel Happy', desc: 'Get instant confirmation and manage your bookings from your dashboard.', icon: Star },
                        ].map((item, i) => (
                            <div key={i} className="relative text-center p-6">
                                <div className="text-5xl font-black text-railway-primary/10 mb-2">{item.step}</div>
                                <div className="w-12 h-12 bg-railway-primary/10 rounded-xl flex items-center justify-center mx-auto mb-3">
                                    <item.icon size={22} className="text-railway-primary" />
                                </div>
                                <h3 className="font-bold text-railway-dark mb-1">{item.title}</h3>
                                <p className="text-slate-500 text-xs leading-relaxed">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="bg-gradient-to-r from-railway-dark to-railway-muted py-14">
                <div className="max-w-4xl mx-auto px-4 text-center">
                    <h2 className="text-2xl lg:text-3xl font-black text-white mb-3">Ready to Book Your Next Journey?</h2>
                    <p className="text-slate-300 text-sm mb-6 max-w-md mx-auto">Join thousands of happy travelers who trust RailBook for their railway reservations.</p>
                    <div className="flex justify-center gap-3">
                        <Link
                            to={user ? "/home" : "/register"}
                            className="group inline-flex items-center space-x-2 bg-railway-primary hover:bg-railway-primary-light text-white font-extrabold px-7 py-3.5 rounded-xl transition-all shadow-lg shadow-railway-primary/30 active:scale-95 text-base"
                        >
                            <span>{user ? 'Browse Trains' : 'Create Free Account'}</span>
                            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                        </Link>
                        <Link
                            to="/home"
                            className="inline-flex items-center space-x-2 border-2 border-white/30 text-white font-bold px-7 py-3.5 rounded-xl hover:bg-white/10 hover:border-white/50 transition-all text-base"
                        >
                            <span>View All Trains</span>
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default LandingPage;
