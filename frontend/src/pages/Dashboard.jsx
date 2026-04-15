import React, { useState, useEffect } from 'react';
import { bookingService } from '../services/api';

const Dashboard = () => {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState({ text: '', type: '' });

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
        if (!window.confirm('Are you sure you want to cancel this booking?')) return;

        try {
            await bookingService.cancel(bookingId);
            setMessage({ text: 'Booking cancelled successfully.', type: 'success' });
            fetchBookings();
        } catch (err) {
            setMessage({ text: 'Cancellation failed.', type: 'error' });
        } finally {
            setTimeout(() => setMessage({ text: '', type: '' }), 5000);
        }
    };

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <h1 className="text-3xl font-extrabold text-gray-900 mb-8 border-b-4 border-railway-blue pb-2 inline-block">My Journey History</h1>

            {message.text && (
                <div className={`mb-6 p-4 rounded-lg text-center font-medium ${message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    {message.text}
                </div>
            )}

            <div className="bg-white shadow overflow-hidden sm:rounded-md border border-gray-200">
                {loading ? (
                    <div className="p-10 text-center text-gray-500">Retrieving your bookings...</div>
                ) : bookings.length > 0 ? (
                    <ul className="divide-y divide-gray-200">
                        {bookings.map((booking) => (
                            <li key={booking.id}>
                                <div className="px-6 py-5 flex items-center justify-between">
                                    <div className="flex-grow">
                                        <div className="flex items-center justify-between mb-2">
                                            <p className="text-lg font-bold text-railway-blue uppercase">
                                                {booking.train.name} <span className="text-gray-400 font-medium ml-2">#{booking.train.trainNumber}</span>
                                            </p>
                                            <div className="ml-2 flex-shrink-0 flex">
                                                <p className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${booking.status === 'BOOKED' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                                    {booking.status}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="sm:flex sm:justify-between text-sm text-gray-500">
                                            <div className="flex items-center space-x-4">
                                                <span className="flex items-center">
                                                    <svg className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                                                    {booking.train.source} → {booking.train.destination}
                                                </span>
                                                <span className="flex items-center">
                                                    <svg className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                                                    Booked on {new Date(booking.bookingDate).toLocaleDateString()}
                                                </span>
                                            </div>
                                            <div className="mt-2 sm:mt-0 font-bold text-gray-900">
                                                {booking.seatsBooked} Ticket(s) - ₹{booking.totalPrice}
                                            </div>
                                        </div>
                                    </div>
                                    {booking.status === 'BOOKED' && (
                                        <div className="ml-6 flex-shrink-0">
                                            <button
                                                onClick={() => handleCancel(booking.id)}
                                                className="bg-white border border-red-500 text-red-600 hover:bg-red-50 px-4 py-2 rounded-md text-sm font-bold transition-all"
                                            >
                                                CANCEL
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <div className="text-center py-16">
                        <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>
                        <p className="mt-4 text-gray-500 font-medium">No bookings found. Time to plan a trip!</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Dashboard;
