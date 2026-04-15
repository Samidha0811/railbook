import React, { useState, useEffect } from 'react';
import { adminService } from '../services/api';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
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

    if (loading) return <div className="flex justify-center items-center h-screen">Loading Stats...</div>;

    if (!stats) return (
        <div className="p-8 text-center bg-red-50 text-red-600 rounded-2xl border border-red-100">
            <h2 className="text-xl font-bold">Failed to load system metrics</h2>
            <p className="mt-2 text-sm font-medium">Please verify the backend connection and CORS settings.</p>
        </div>
    );

    const cards = [
        { title: 'Total Users', value: stats.totalUsers, icon: Users, color: 'text-blue-600', bg: 'bg-blue-50' },
        { title: 'Total Trains', value: stats.totalTrains, icon: Train, color: 'text-purple-600', bg: 'bg-purple-50' },
        { title: 'Total Bookings', value: stats.totalBookings, icon: Ticket, color: 'text-green-600', bg: 'bg-green-50' },
        { title: 'Active Bookings', value: stats.activeBookings, icon: Activity, color: 'text-orange-600', bg: 'bg-orange-50' },
    ];

    // Mock data for charts
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
        <div className="space-y-8">
            <h1 className="text-3xl font-black text-gray-900 tracking-tight uppercase border-l-8 border-railway-blue pl-4">
                System Overview
            </h1>

            {/* Metric Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {cards.map((card) => (
                    <div key={card.title} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-bold text-gray-500 uppercase tracking-wider">{card.title}</p>
                                <p className="text-3xl font-black text-gray-900 mt-1">{card.value}</p>
                            </div>
                            <div className={`${card.bg} p-4 rounded-xl`}>
                                <card.icon className={card.color} size={24} />
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                    <h2 className="text-xl font-bold text-gray-800 mb-6">Weekly Booking Trend</h2>
                    <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={chartData}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                <XAxis dataKey="name" />
                                <YAxis />
                                <Tooltip 
                                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                                />
                                <Bar dataKey="bookings" fill="#2563eb" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                    <h2 className="text-xl font-bold text-gray-800 mb-6">Recent Activity</h2>
                    <div className="space-y-4">
                        {[1, 2, 3, 4, 5].map((i) => (
                            <div key={i} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                                <div className="flex items-center space-x-4">
                                    <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm">
                                        <Ticket size={18} className="text-railway-blue" />
                                    </div>
                                    <div>
                                        <p className="font-bold text-gray-900">New Booking #00{i}</p>
                                        <p className="text-sm text-gray-500">2 minutes ago</p>
                                    </div>
                                </div>
                                <span className="text-xs font-black text-green-600 bg-green-100 px-3 py-1 rounded-full uppercase">Success</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
