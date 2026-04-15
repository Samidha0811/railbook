import React, { useState, useEffect } from 'react';
import { trainService, bookingService } from '../services/api';

const AdminDashboard = () => {
    const [trains, setTrains] = useState([]);
    const [bookings, setBookings] = useState([]);
    const [newTrain, setNewTrain] = useState({
        trainNumber: '', name: '', source: '', destination: '',
        departureTime: '', totalSeats: '', availableSeats: '', price: ''
    });
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('trains'); // trains, bookings

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [trainsRes, bookingsRes] = await Promise.all([
                trainService.getAll(),
                bookingService.getAllBookings()
            ]);
            setTrains(trainsRes.data);
            setBookings(bookingsRes.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleAddTrain = async (e) => {
        e.preventDefault();
        try {
            await trainService.create({
                ...newTrain,
                totalSeats: parseInt(newTrain.totalSeats),
                availableSeats: parseInt(newTrain.totalSeats), // Default matches total
                price: parseFloat(newTrain.price)
            });
            setNewTrain({
                trainNumber: '', name: '', source: '', destination: '',
                departureTime: '', totalSeats: '', availableSeats: '', price: ''
            });
            fetchData();
        } catch (err) {
            alert('Failed to add train');
        }
    };

    const handleDeleteTrain = async (id) => {
        if (!window.confirm('Are you sure?')) return;
        try {
            await trainService.delete(id);
            fetchData();
        } catch (err) {
            alert('Delete failed');
        }
    };

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <h1 className="text-3xl font-black text-railway-blue mb-8 uppercase tracking-tighter">System Administration</h1>

            <div className="flex space-x-4 mb-8">
                <button
                    onClick={() => setActiveTab('trains')}
                    className={`px-6 py-2 rounded-full font-bold transition-all ${activeTab === 'trains' ? 'bg-railway-blue text-white shadow-lg' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
                >
                    TRAIN MANAGEMENT
                </button>
                <button
                    onClick={() => setActiveTab('bookings')}
                    className={`px-6 py-2 rounded-full font-bold transition-all ${activeTab === 'bookings' ? 'bg-railway-blue text-white shadow-lg' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
                >
                    ALL BOOKINGS
                </button>
            </div>

            {activeTab === 'trains' ? (
                <div className="space-y-12">
                    {/* Add Train Form */}
                    <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-200">
                        <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
                            <svg className="w-6 h-6 mr-2 text-railway-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                            Dispatch New Train
                        </h2>
                        <form onSubmit={handleAddTrain} className="grid grid-cols-1 md:grid-cols-4 gap-4">
                            <input
                                placeholder="Number (e.g. 12101)"
                                className="border p-2 rounded focus:ring-2 focus:ring-railway-blue outline-none"
                                value={newTrain.trainNumber}
                                onChange={(e) => setNewTrain({...newTrain, trainNumber: e.target.value})}
                                required
                            />
                            <input
                                placeholder="Train Name"
                                className="border p-2 rounded focus:ring-2 focus:ring-railway-blue outline-none"
                                value={newTrain.name}
                                onChange={(e) => setNewTrain({...newTrain, name: e.target.value})}
                                required
                            />
                            <input
                                placeholder="Source"
                                className="border p-2 rounded focus:ring-2 focus:ring-railway-blue outline-none"
                                value={newTrain.source}
                                onChange={(e) => setNewTrain({...newTrain, source: e.target.value})}
                                required
                            />
                            <input
                                placeholder="Destination"
                                className="border p-2 rounded focus:ring-2 focus:ring-railway-blue outline-none"
                                value={newTrain.destination}
                                onChange={(e) => setNewTrain({...newTrain, destination: e.target.value})}
                                required
                            />
                            <input
                                placeholder="Departure (e.g. 10:30 AM)"
                                className="border p-2 rounded focus:ring-2 focus:ring-railway-blue outline-none"
                                value={newTrain.departureTime}
                                onChange={(e) => setNewTrain({...newTrain, departureTime: e.target.value})}
                                required
                            />
                            <input
                                type="number"
                                placeholder="Seats"
                                className="border p-2 rounded focus:ring-2 focus:ring-railway-blue outline-none"
                                value={newTrain.totalSeats}
                                onChange={(e) => setNewTrain({...newTrain, totalSeats: e.target.value})}
                                required
                            />
                            <input
                                type="number"
                                placeholder="Price"
                                className="border p-2 rounded focus:ring-2 focus:ring-railway-blue outline-none"
                                value={newTrain.price}
                                onChange={(e) => setNewTrain({...newTrain, price: e.target.value})}
                                required
                            />
                            <button className="bg-railway-blue text-white font-bold py-2 rounded hover:bg-railway-dark transition-colors shadow-md">
                                ADD TRAIN
                            </button>
                        </form>
                    </div>

                    {/* Train List */}
                    <div className="bg-white shadow rounded-xl overflow-hidden border border-gray-200">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-widest">Train</th>
                                    <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-widest">Route</th>
                                    <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-widest">Stats</th>
                                    <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-widest">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {trains.map(train => (
                                    <tr key={train.id}>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm font-bold text-gray-900">{train.name}</div>
                                            <div className="text-xs text-railway-blue">#{train.trainNumber}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-500 font-medium">{train.source} → {train.destination}</div>
                                            <div className="text-xs text-gray-400">{train.departureTime}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-900 font-bold">{train.availableSeats} / {train.totalSeats} Seats</div>
                                            <div className="text-sm text-railway-blue font-black">₹{train.price}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <button onClick={() => handleDeleteTrain(train.id)} className="text-red-600 hover:text-red-900 font-bold">Delete</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            ) : (
                <div className="bg-white shadow rounded-xl overflow-hidden border border-gray-200">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-railway-blue text-white">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-bold uppercase tracking-widest">Booking ID</th>
                                <th className="px-6 py-3 text-left text-xs font-bold uppercase tracking-widest">Passenger</th>
                                <th className="px-6 py-3 text-left text-xs font-bold uppercase tracking-widest">Train</th>
                                <th className="px-6 py-3 text-left text-xs font-bold uppercase tracking-widest">Total</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {bookings.map(book => (
                                <tr key={book.id}>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">#{book.id}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm font-bold text-gray-900">{book.user.fullname}</div>
                                        <div className="text-xs text-gray-500">{book.user.email}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-gray-900">{book.train.name}</div>
                                        <div className="text-xs text-gray-400">Seats: {book.seatsBooked}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm font-black text-railway-blue">₹{book.totalPrice}</div>
                                        <span className={`px-2 py-1 text-xs font-bold rounded-full ${book.status === 'BOOKED' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                            {book.status}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default AdminDashboard;
