import React, { useState, useEffect } from 'react';
import { authService, trainService, bookingService } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

const Home = () => {
    const [trains, setTrains] = useState([]);
    const [source, setSource] = useState('');
    const [destination, setDestination] = useState('');
    const [loading, setLoading] = useState(false);
    const [bookingLoading, setBookingLoading] = useState(null);
    const [message, setMessage] = useState({ text: '', type: '' });

    const { user } = useAuth();
    const navigate = useNavigate();

    const fetchTrains = async () => {
        setLoading(true);
        try {
            const res = await trainService.getAll(source, destination);
            setTrains(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTrains();
    }, []);

    const handleSearch = (e) => {
        e.preventDefault();
        fetchTrains();
    };

    const handleBook = async (trainId) => {
        if (!user) {
            navigate('/login');
            return;
        }

        const { value: formValues } = await Swal.fire({
            title: 'Confirm Booking',
            html: `
                <div class="space-y-4">
                    <div class="text-left">
                        <label class="block text-sm font-bold text-gray-700 mb-1">Travel Date</label>
                        <input type="date" id="travel-date" class="swal2-input !w-full !m-0" min="${new Date().toISOString().split('T')[0]}">
                    </div>
                    <div class="text-left mt-4">
                        <label class="block text-sm font-bold text-gray-700 mb-1">Seats Count</label>
                        <input type="number" id="seats-count" class="swal2-input !w-full !m-0" value="1" min="1" max="10">
                    </div>
                </div>
            `,
            focusConfirm: false,
            showCancelButton: true,
            confirmButtonText: 'Book Tickets',
            preConfirm: () => {
                const travelDate = document.getElementById('travel-date').value;
                const seats = document.getElementById('seats-count').value;
                if (!travelDate || !seats) {
                    Swal.showValidationMessage('Please select a date and seat count');
                    return false;
                }
                return { travelDate, seats: parseInt(seats) };
            }
        });

        if (formValues) {
            setBookingLoading(trainId);
            try {
                await bookingService.book(trainId, formValues.seats, formValues.travelDate);
                Swal.fire({
                    title: 'Journey Confirmed!',
                    text: 'Your ticket has been booked successfully.',
                    icon: 'success',
                    timer: 2000,
                    showConfirmButton: false
                });
                fetchTrains();
            } catch (err) {
                Swal.fire({
                    title: 'Booking Failed',
                    text: err.response?.data?.message || 'Operation failed',
                    icon: 'error'
                });
            } finally {
                setBookingLoading(null);
            }
        }
    };

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="bg-railway-blue rounded-xl p-8 mb-8 text-white shadow-xl">
                <h1 className="text-4xl font-bold mb-4">Search & Book Your Journey</h1>
                <p className="text-railway-silver mb-6">Enter your source and destination to find available trains.</p>
                
                <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <input
                        type="text"
                        placeholder="From: Departure Station"
                        className="p-3 rounded-lg text-gray-900 focus:ring-2 focus:ring-railway-silver outline-none"
                        value={source}
                        onChange={(e) => setSource(e.target.value)}
                    />
                    <input
                        type="text"
                        placeholder="To: Arrival Station"
                        className="p-3 rounded-lg text-gray-900 focus:ring-2 focus:ring-railway-silver outline-none"
                        value={destination}
                        onChange={(e) => setDestination(e.target.value)}
                    />
                    <button
                        type="submit"
                        className="bg-railway-silver text-railway-blue font-bold px-6 py-3 rounded-lg hover:bg-white transition-colors uppercase tracking-wider"
                    >
                        Search Trains
                    </button>
                </form>
            </div>

            {message.text && (
                <div className={`mb-6 p-4 rounded-lg text-center font-medium ${message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    {message.text}
                </div>
            )}

            <div className="grid grid-cols-1 gap-6">
                {loading ? (
                    <p className="text-center text-gray-600">Loading trains...</p>
                ) : trains.length > 0 ? (
                    trains.map((train) => (
                        <div key={train.id} className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow border border-gray-200 overflow-hidden flex flex-col md:flex-row">
                            <div className="bg-gray-50 p-6 flex flex-col justify-center items-center border-b md:border-b-0 md:border-r border-gray-200 md:w-48">
                                <span className="text-2xl font-bold text-railway-blue">{train.trainNumber}</span>
                                <span className="text-xs uppercase tracking-widest text-gray-500 font-bold mt-1">Express</span>
                            </div>
                            <div className="p-6 flex-grow grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
                                <div className="md:col-span-2">
                                    <h3 className="text-xl font-bold text-gray-900 mb-1">{train.name}</h3>
                                    <div className="flex items-center text-sm text-gray-600 font-medium">
                                        <span className="text-railway-blue">{train.source}</span>
                                        <svg className="w-4 h-4 mx-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                                        <span className="text-railway-blue">{train.destination}</span>
                                    </div>
                                    <div className="mt-2 text-xs text-gray-400">Departure: {train.departureTime}</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-sm font-bold text-gray-500 uppercase mb-1">Available</div>
                                    <div className={`text-2xl font-black ${train.availableSeats > 0 ? 'text-green-600' : 'text-red-600'}`}>
                                        {train.availableSeats} <span className="text-xs">/ {train.totalSeats}</span>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className="text-sm font-bold text-gray-500 uppercase mb-1">Fare</div>
                                    <div className="text-2xl font-black text-railway-blue mb-3">₹{train.price}</div>
                                    <button
                                        onClick={() => handleBook(train.id)}
                                        disabled={train.availableSeats === 0 || bookingLoading === train.id}
                                        className={`w-full px-4 py-2 rounded-md font-bold transition-all ${train.availableSeats > 0 ? 'bg-railway-blue text-white hover:bg-railway-dark' : 'bg-gray-300 text-gray-500 cursor-not-allowed'}`}
                                    >
                                        {bookingLoading === train.id ? 'Booking...' : train.availableSeats > 0 ? 'BOOK NOW' : 'SOLD OUT'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="text-center py-20 bg-gray-50 rounded-xl border-2 border-dashed border-gray-300">
                        <p className="text-xl text-gray-500">No trains found for this route.</p>
                        <button onClick={() => { setSource(''); setDestination(''); fetchTrains(); }} className="mt-4 text-railway-blue font-bold hover:underline">View All Trains</button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Home;
