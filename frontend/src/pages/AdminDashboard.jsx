import React, { useState, useEffect } from 'react';
import { adminService } from '../services/api';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Users, Train, Ticket, Activity } from 'lucide-react';

const AdminDashboard = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await adminService.getStats();
                setStats(res.data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    if (loading) return (
        <div className="flex justify-center items-center h-64">
            <div className="w-8 h-8 border-3 border-railway-primary border-t-transparent rounded-full animate-spin"></div>
        </div>
    );

    if (!stats) return (
        <div className="p-5 text-center bg-red-50 text-red-600 rounded-xl border border-red-100">
            <h2 className="text-base font-bold">Failed to load metrics</h2>
            <p className="mt-1 text-xs font-medium">Check backend connection.</p>
        </div>
    );

    const cards = [
        { title: 'Users', value: stats.totalUsers, icon: Users, color: 'text-railway-primary', bg: 'bg-railway-primary/10', border: 'border-railway-primary/10' },
        { title: 'Trains', value: stats.totalTrains, icon: Train, color: 'text-purple-600', bg: 'bg-purple-50', border: 'border-purple-100' },
        { title: 'Bookings', value: stats.totalBookings, icon: Ticket, color: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-100' },
        { title: 'Active', value: stats.activeBookings, icon: Activity, color: 'text-green-600', bg: 'bg-green-50', border: 'border-green-100' },
    ];

    const chartData = [
        { name: 'Mon', bookings: 12 },
        { name: 'Tue', bookings: 19 },
        { name: 'Wed', bookings: 15 },
        { name: 'Thu', bookings: 22 },
        { name: 'Fri', bookings: 30 },
        { name: 'Sat', bookings: 25 },
        { name: 'Sun', bookings: 18 },
    ];

    return (
        <div className="space-y-5">
            <h1 className="text-lg font-black text-railway-dark tracking-tight uppercase flex items-center space-x-2">
                <div className="w-1 h-5 bg-railway-primary rounded-full"></div>
                <span>System Overview</span>
            </h1>

            {/* Metric Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                {cards.map((card) => (
                    <div key={card.title} className={`bg-white p-4 rounded-xl shadow-sm border ${card.border} hover:shadow-md transition-shadow`}>
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-[10px] font-bold text-railway-silver uppercase tracking-wider">{card.title}</p>
                                <p className="text-2xl font-black text-railway-dark mt-0.5">{card.value}</p>
                            </div>
                            <div className={`${card.bg} p-2.5 rounded-lg`}>
                                <card.icon className={card.color} size={18} />
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-100">
                    <h2 className="text-sm font-bold text-railway-dark mb-4">Weekly Bookings</h2>
                    <div className="h-56">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={chartData}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                                <YAxis tick={{ fontSize: 11 }} />
                                <Tooltip 
                                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', fontSize: '12px' }}
                                />
                                <Bar dataKey="bookings" fill="#059669" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-100">
                    <h2 className="text-sm font-bold text-railway-dark mb-4">Recent Activity</h2>
                    <div className="space-y-2">
                        {[1, 2, 3, 4, 5].map((i) => (
                            <div key={i} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors">
                                <div className="flex items-center space-x-3">
                                    <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-sm border border-slate-100">
                                        <Ticket size={14} className="text-railway-primary" />
                                    </div>
                                    <div>
                                        <p className="font-semibold text-railway-dark text-sm">Booking #00{i}</p>
                                        <p className="text-[10px] text-railway-silver">{i} min ago</p>
                                    </div>
                                </div>
                                <span className="text-[10px] font-bold text-green-600 bg-green-50 border border-green-100 px-2 py-0.5 rounded-full uppercase">Confirmed</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
