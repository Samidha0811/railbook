import React, { useState, useEffect } from 'react';
import { bookingService, trainService } from '../services/api';
import Swal from 'sweetalert2';
import { Search, Filter, Calendar, User, Train as TrainIcon, Ban } from 'lucide-react';

const ManageBookings = () => {
    const [bookings, setBookings] = useState([]);
    const [trains, setTrains] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filterStatus, setFilterStatus] = useState('ALL');
    const [filterTrain, setFilterTrain] = useState('ALL');

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [bookingsRes, trainsRes] = await Promise.all([
                bookingService.getAllBookings(),
                trainService.getAll()
            ]);
            setBookings(bookingsRes.data);
            setTrains(trainsRes.data);
        } catch (err) {
            Swal.fire('Error', 'Failed to fetch data', 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = async (id) => {
        const result = await Swal.fire({
            title: 'Cancel Booking?',
            text: "This will restore the seats and issue a 90% refund.",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            confirmButtonText: 'Yes, cancel it!'
        });

        if (result.isConfirmed) {
            try {
                await bookingService.cancel(id);
                Swal.fire('Cancelled!', 'Booking has been revoked.', 'success');
                fetchData();
            } catch (err) {
                Swal.fire('Error', 'Action failed', 'error');
            }
        }
    };

    const filteredBookings = bookings.filter(b => {
        const matchesStatus = filterStatus === 'ALL' || b.status === filterStatus;
        const matchesTrain = filterTrain === 'ALL' || b.train.id.toString() === filterTrain;
        return matchesStatus && matchesTrain;
    });

    if (loading) return <div className="flex justify-center items-center h-full text-2xl font-bold">Auditing Bookings...</div>;

    return (
        <div className="space-y-6">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center bg-white p-6 rounded-2xl shadow-sm border border-gray-100 gap-4">
                <div>
                    <h1 className="text-2xl font-black text-gray-900 tracking-tight uppercase">Booking Ledger</h1>
                    <p className="text-gray-500 font-bold text-sm">Managing all reservations across the system</p>
                </div>
                <div className="flex flex-wrap gap-3 w-full lg:w-auto">
                    <div className="relative flex-grow lg:flex-none">
                        <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                        <select 
                            className="pl-10 pr-4 py-2 border rounded-xl focus:ring-2 focus:ring-railway-blue outline-none bg-white font-bold text-gray-700 min-w-[150px] appearance-none"
                            value={filterStatus}
                            onChange={(e) => setFilterStatus(e.target.value)}
                        >
                            <option value="ALL">Status: All</option>
                            <option value="BOOKED">Booked</option>
                            <option value="CANCELLED">Cancelled</option>
                        </select>
                    </div>
                    <div className="relative flex-grow lg:flex-none">
                        <TrainIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                        <select 
                            className="pl-10 pr-4 py-2 border rounded-xl focus:ring-2 focus:ring-railway-blue outline-none bg-white font-bold text-gray-700 min-w-[200px] appearance-none"
                            value={filterTrain}
                            onChange={(e) => setFilterTrain(e.target.value)}
                        >
                            <option value="ALL">All Trains</option>
                            {trains.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                        </select>
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-4 text-left text-xs font-black text-gray-500 uppercase tracking-widest">Reference</th>
                            <th className="px-6 py-4 text-left text-xs font-black text-gray-500 uppercase tracking-widest">Passenger</th>
                            <th className="px-6 py-4 text-left text-xs font-black text-gray-500 uppercase tracking-widest">Voyage Details</th>
                            <th className="px-6 py-4 text-left text-xs font-black text-gray-500 uppercase tracking-widest">Financials</th>
                            <th className="px-6 py-4 text-right text-xs font-black text-gray-500 uppercase tracking-widest">Control</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {filteredBookings.map((book) => (
                            <tr key={book.id} className="hover:bg-gray-50/50 transition-colors">
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="font-black text-gray-900 tracking-tighter">BK-{book.id.toString().padStart(4, '0')}</div>
                                    <div className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">ID: #{book.id}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex items-center space-x-3">
                                        <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-railway-blue font-black text-xs uppercase">
                                            {book.user.fullname.charAt(0)}
                                        </div>
                                        <div>
                                            <div className="text-sm font-bold text-gray-900">{book.user.fullname}</div>
                                            <div className="text-[10px] text-gray-400 font-bold">{book.user.email}</div>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex items-center space-x-2 text-sm font-black text-gray-700">
                                        <TrainIcon size={14} className="text-gray-400" />
                                        <span>{book.train.name}</span>
                                    </div>
                                    <div className="flex items-center space-x-2 text-xs text-gray-500 mt-1">
                                        <Calendar size={12} className="text-gray-400" />
                                        <span className="font-bold tracking-tight">{book.travelDate || 'Date N/A'}</span>
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm font-black text-railway-blue uppercase tracking-tighter">₹{book.totalPrice}</div>
                                    <div className={`mt-1 inline-block px-3 py-0.5 rounded-full text-[10px] font-black tracking-widest uppercase ${book.status === 'BOOKED' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                        {book.status}
                                    </div>
                                    {book.status === 'CANCELLED' && book.refundAmount && (
                                        <div className="text-[10px] font-bold text-orange-500 mt-1">Refunded: ₹{book.refundAmount}</div>
                                    )}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right">
                                    {book.status === 'BOOKED' && (
                                        <button 
                                            onClick={() => handleCancel(book.id)}
                                            className="text-red-500 hover:text-white hover:bg-red-500 p-2 rounded-lg transition-all border border-red-100 hover:border-red-500 group"
                                            title="Cancel Booking"
                                        >
                                            <Ban size={18} />
                                        </button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {filteredBookings.length === 0 && (
                    <div className="p-16 text-center text-gray-300 font-black italic text-2xl uppercase tracking-[0.2em] bg-gray-50/20">
                        No Records Found
                    </div>
                )}
            </div>
        </div>
    );
};

export default ManageBookings;
