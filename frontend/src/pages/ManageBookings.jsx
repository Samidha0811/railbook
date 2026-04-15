import React, { useState, useEffect } from 'react';
import { bookingService, trainService } from '../services/api';
import Swal from 'sweetalert2';
import { Filter, Calendar, Train as TrainIcon, Ban } from 'lucide-react';

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
            text: "This will restore seats and issue a 90% refund.",
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

    if (loading) return (
        <div className="flex justify-center items-center h-64">
            <div className="w-8 h-8 border-3 border-railway-primary border-t-transparent rounded-full animate-spin"></div>
        </div>
    );

    return (
        <div className="space-y-4">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center bg-white p-4 rounded-xl shadow-sm border border-gray-100 gap-3">
                <div>
                    <h1 className="text-base font-black text-railway-dark tracking-tight uppercase">Booking Ledger</h1>
                    <p className="text-railway-silver text-xs font-medium">{bookings.length} total reservations</p>
                </div>
                <div className="flex flex-wrap gap-2 w-full lg:w-auto">
                    <div className="relative flex-grow lg:flex-none">
                        <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300" size={12} />
                        <select 
                            className="pl-8 pr-3 py-2 border border-gray-200 rounded-lg focus:ring-1 focus:ring-railway-primary outline-none bg-white font-medium text-gray-600 text-sm min-w-[130px]"
                            value={filterStatus}
                            onChange={(e) => setFilterStatus(e.target.value)}
                        >
                            <option value="ALL">All Status</option>
                            <option value="BOOKED">Booked</option>
                            <option value="CANCELLED">Cancelled</option>
                        </select>
                    </div>
                    <div className="relative flex-grow lg:flex-none">
                        <TrainIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300" size={12} />
                        <select 
                            className="pl-8 pr-3 py-2 border border-gray-200 rounded-lg focus:ring-1 focus:ring-railway-primary outline-none bg-white font-medium text-gray-600 text-sm min-w-[160px]"
                            value={filterTrain}
                            onChange={(e) => setFilterTrain(e.target.value)}
                        >
                            <option value="ALL">All Trains</option>
                            {trains.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                        </select>
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <table className="min-w-full divide-y divide-gray-100">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-4 py-3 text-left text-[10px] font-bold text-railway-silver uppercase tracking-wider">Ref</th>
                            <th className="px-4 py-3 text-left text-[10px] font-bold text-railway-silver uppercase tracking-wider">Passenger</th>
                            <th className="px-4 py-3 text-left text-[10px] font-bold text-railway-silver uppercase tracking-wider">Journey</th>
                            <th className="px-4 py-3 text-left text-[10px] font-bold text-railway-silver uppercase tracking-wider">Amount</th>
                            <th className="px-4 py-3 text-right text-[10px] font-bold text-railway-silver uppercase tracking-wider">Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                        {filteredBookings.map((book) => (
                            <tr key={book.id} className="hover:bg-gray-50/50 transition-colors">
                                <td className="px-4 py-3 whitespace-nowrap">
                                    <div className="font-bold text-railway-dark text-sm">BK-{book.id.toString().padStart(4, '0')}</div>
                                </td>
                                <td className="px-4 py-3 whitespace-nowrap">
                                    <div className="flex items-center space-x-2">
                                        <div className="w-7 h-7 rounded-full bg-railway-primary/10 flex items-center justify-center">
                                            <span className="text-[10px] font-bold text-railway-primary">{book.user.fullname.charAt(0)}</span>
                                        </div>
                                        <div>
                                            <div className="text-sm font-semibold text-railway-dark">{book.user.fullname}</div>
                                            <div className="text-[10px] text-gray-400">{book.user.email}</div>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-4 py-3 whitespace-nowrap">
                                    <div className="flex items-center space-x-1.5 text-sm font-semibold text-gray-700">
                                        <TrainIcon size={12} className="text-gray-300" />
                                        <span>{book.train.name}</span>
                                    </div>
                                    <div className="flex items-center space-x-1.5 text-[10px] text-gray-400 mt-0.5">
                                        <Calendar size={10} className="text-gray-300" />
                                        <span className="font-medium">{book.travelDate || 'N/A'}</span>
                                    </div>
                                </td>
                                <td className="px-4 py-3 whitespace-nowrap">
                                    <div className="text-sm font-bold text-railway-primary">₹{book.totalPrice}</div>
                                    <span className={`inline-block mt-0.5 px-2 py-0.5 rounded-full text-[9px] font-bold uppercase ${book.status === 'BOOKED' ? 'bg-green-50 text-green-600 border border-green-100' : 'bg-red-50 text-red-500 border border-red-100'}`}>
                                        {book.status}
                                    </span>
                                    {book.status === 'CANCELLED' && book.refundAmount && (
                                        <div className="text-[10px] font-medium text-amber-500 mt-0.5">Refund: ₹{book.refundAmount}</div>
                                    )}
                                </td>
                                <td className="px-4 py-3 whitespace-nowrap text-right">
                                    {book.status === 'BOOKED' && (
                                        <button 
                                            onClick={() => handleCancel(book.id)}
                                            className="text-red-500 hover:text-white hover:bg-red-500 p-1.5 rounded-lg transition-all border border-red-100 hover:border-red-500"
                                            title="Cancel"
                                        >
                                            <Ban size={14} />
                                        </button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {filteredBookings.length === 0 && (
                    <div className="p-12 text-center text-railway-silver text-sm font-medium">No records found</div>
                )}
            </div>
        </div>
    );
};

export default ManageBookings;
