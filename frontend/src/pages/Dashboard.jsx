import React, { useState, useEffect } from 'react';
import { bookingService } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import Swal from 'sweetalert2';
import { Ticket, Search, ArrowRight } from 'lucide-react';

const Dashboard = () => {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [sortBy, setSortBy] = useState('date_desc');
    const { user } = useAuth();
    const navigate = useNavigate();

    const fetchBookings = async () => {
        setLoading(true);
        try {
            const res = await bookingService.getMyBookings();
            setBookings(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBookings();
    }, []);

    const handleCancel = async (bookingId) => {
        const result = await Swal.fire({
            title: 'Cancel Booking?',
            text: "A partial refund will be processed to your source account.",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            confirmButtonText: 'Yes, cancel it!',
            cancelButtonText: 'No, keep it'
        });

        if (result.isConfirmed) {
            try {
                await bookingService.cancel(bookingId);
                Swal.fire('Cancelled!', 'Your booking has been cancelled.', 'success');
                fetchBookings();
            } catch (err) {
                Swal.fire('Error', 'Cancellation failed', 'error');
            }
        }
    };

    const sortedBookings = [...bookings].sort((a, b) => {
        if (sortBy === 'date_desc') return new Date(b.travelDate) - new Date(a.travelDate);
        if (sortBy === 'date_asc') return new Date(a.travelDate) - new Date(b.travelDate);
        if (sortBy === 'price_desc') return b.totalPrice - a.totalPrice;
        return 0;
    });

    return (
        <div className="max-w-6xl mx-auto px-4 py-6">
            {/* Welcome Section */}
            <div className="bg-white rounded-xl p-5 mb-5 shadow-sm border border-slate-100 flex flex-col md:flex-row justify-between items-center gap-4">
                <div className="flex items-center space-x-4">
                    <div className="h-12 w-12 rounded-xl bg-railway-primary/10 border border-railway-primary/20 flex items-center justify-center text-railway-primary-light text-lg font-black">
                        {user?.fullname?.charAt(0)}
                    </div>
                    <div>
                        <h2 className="text-lg font-black text-railway-dark tracking-tight">Welcome, {user?.fullname}!</h2>
                        <p className="text-railway-silver text-xs font-medium">Manage your reservations below.</p>
                    </div>
                </div>
                <div className="flex space-x-3">
                    <div className="text-center px-4 py-2 bg-railway-primary/5 border border-railway-primary/10 rounded-lg">
                        <p className="text-[10px] font-bold text-railway-silver uppercase tracking-widest">Trips</p>
                        <p className="text-xl font-black text-railway-primary">{bookings.length}</p>
                    </div>
                    <div className="text-center px-4 py-2 bg-green-50 border border-green-100 rounded-lg">
                        <p className="text-[10px] font-bold text-railway-silver uppercase tracking-widest">Active</p>
                        <p className="text-xl font-black text-green-600">
                            {bookings.filter(b => b.status === 'BOOKED').length}
                        </p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
                {/* Bookings List */}
                <div className="lg:col-span-2">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-sm font-black text-railway-dark uppercase tracking-wider flex items-center space-x-2">
                            <Ticket size={16} className="text-railway-primary" />
                            <span>Journey History</span>
                        </h3>
                        <select
                            className="bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-xs font-bold text-slate-600 outline-none focus:ring-1 focus:ring-railway-primary"
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                        >
                            <option value="date_desc">Newest</option>
                            <option value="date_asc">Oldest</option>
                            <option value="price_desc">Highest Fare</option>
                        </select>
                    </div>

                    <div className="space-y-3">
                        {loading ? (
                            <div className="text-center py-16 bg-white rounded-xl border border-slate-100 text-railway-silver text-sm font-medium">Loading bookings...</div>
                        ) : sortedBookings.length > 0 ? (
                            sortedBookings.map((booking) => (
                                <div key={booking.id} className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden hover:shadow-md transition-shadow">
                                    <div className="p-4">
                                        <div className="flex justify-between items-start mb-3">
                                            <div className="flex items-center space-x-3">
                                                <div className="bg-railway-primary/10 p-2 rounded-lg">
                                                    <Ticket size={16} className="text-railway-primary" />
                                                </div>
                                                <div>
                                                    <h4 className="text-sm font-black text-railway-dark uppercase">{booking.train.name}</h4>
                                                    <p className="text-[10px] font-bold text-railway-silver uppercase tracking-wider">#{booking.train.trainNumber}</p>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${booking.status === 'BOOKED' ? 'bg-green-50 text-green-600 border border-green-100' : 'bg-red-50 text-red-500 border border-red-100'}`}>
                                                    {booking.status}
                                                </span>
                                                <p className="mt-1 text-lg font-black text-railway-dark">₹{booking.totalPrice}</p>
                                            </div>
                                        </div>

                                        <div className="flex flex-wrap gap-4 py-2.5 border-t border-slate-50 mb-3 text-xs">
                                            <div>
                                                <p className="text-[10px] font-bold text-slate-300 uppercase mb-0.5">Route</p>
                                                <p className="font-bold text-railway-dark">{booking.train.source} → {booking.train.destination}</p>
                                            </div>
                                            <div>
                                                <p className="text-[10px] font-bold text-slate-300 uppercase mb-0.5">Date</p>
                                                <p className="font-bold text-railway-primary">{booking.travelDate}</p>
                                            </div>
                                            <div>
                                                <p className="text-[10px] font-bold text-slate-300 uppercase mb-0.5">Passenger</p>
                                                <p className="font-bold text-railway-dark">{booking.passengerName || user.fullname}</p>
                                            </div>
                                            <div>
                                                <p className="text-[10px] font-bold text-slate-300 uppercase mb-0.5">Seats</p>
                                                <p className="font-bold text-railway-dark">{booking.seatsBooked}</p>
                                            </div>
                                        </div>

                                        <div className="flex justify-between items-center">
                                            <span className="text-[10px] font-medium text-slate-300">
                                                Booked: {new Date(booking.bookingDate).toLocaleDateString()}
                                            </span>
                                            <div className="flex space-x-2">
                                                <button
                                                    onClick={() => navigate(`/train/${booking.train.id}`)}
                                                    className="px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase text-railway-primary hover:bg-railway-primary/5 transition-colors"
                                                >
                                                    View Train
                                                </button>
                                                {booking.status === 'BOOKED' && (
                                                    <button
                                                        onClick={() => handleCancel(booking.id)}
                                                        className="px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase bg-red-50 text-red-500 hover:bg-red-100 transition-colors"
                                                    >
                                                        Cancel
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                    {booking.status === 'CANCELLED' && booking.refundAmount && (
                                        <div className="bg-amber-50 px-4 py-1.5 border-t border-amber-100 text-[10px] font-bold text-amber-600 uppercase tracking-wider text-center">
                                            Refund of ₹{booking.refundAmount} credited
                                        </div>
                                    )}
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-16 bg-white rounded-xl border-2 border-dashed border-slate-200">
                                <Ticket size={28} className="mx-auto text-slate-200 mb-2" />
                                <p className="text-sm font-bold text-slate-400">No bookings yet.</p>
                                <Link to="/home" className="text-railway-primary font-bold uppercase text-xs hover:underline mt-1 inline-block">Book Your First Trip</Link>
                            </div>
                        )}
                    </div>
                </div>

                {/* Quick Search Widget */}
                <div>
                    <div className="dark-panel bg-gradient-to-b from-railway-dark to-railway-muted rounded-xl p-5 text-white shadow-lg sticky top-20 border border-white/5">
                        <div className="flex items-center space-x-2 mb-3">
                            <Search size={16} className="text-railway-primary-light" />
                            <h3 className="text-sm font-black uppercase tracking-wider">Quick Search</h3>
                        </div>
                        <p className="text-railway-silver text-xs mb-4">Find trains for your next journey.</p>

                        <form onSubmit={(e) => { e.preventDefault(); navigate('/home'); }} className="space-y-3">
                            <div>
                                <label className="block text-[10px] font-bold uppercase text-railway-silver mb-1">From</label>
                                <input
                                    type="text"
                                    placeholder="Source Station"
                                    className="w-full border border-white/20 rounded-lg px-3 py-2 text-sm font-medium outline-none transition-all"
                                />
                            </div>
                            <div>
                                <label className="block text-[10px] font-bold uppercase text-railway-silver mb-1">To</label>
                                <input
                                    type="text"
                                    placeholder="Destination Station"
                                    className="w-full border border-white/20 rounded-lg px-3 py-2 text-sm font-medium outline-none transition-all"
                                />
                            </div>
                            <button
                                type="submit"
                                className="w-full bg-railway-primary text-white font-bold py-2.5 rounded-lg uppercase tracking-wider text-xs shadow-md hover:bg-railway-primary-light transition-all active:scale-95 mt-1 flex items-center justify-center space-x-2"
                            >
                                <span>Search Now</span>
                                <ArrowRight size={14} />
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
