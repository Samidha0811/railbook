import React, { useState, useEffect } from 'react';
import { authService, trainService, bookingService } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { Search, MapPin, Calendar, ArrowRight } from 'lucide-react';

const Home = () => {
    const [trains, setTrains] = useState([]);
    const [source, setSource] = useState('');
    const [destination, setDestination] = useState('');
    const [travelDate, setTravelDate] = useState('');
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
                        <label class="block text-sm font-bold text-slate-700 mb-1">Passenger Name</label>
                        <input type="text" id="passenger-name" class="swal2-input !w-full !m-0" value="${user.fullname}">
                    </div>
                    <div class="text-left">
                        <label class="block text-sm font-bold text-slate-700 mb-1">Contact Number</label>
                        <input type="text" id="passenger-contact" class="swal2-input !w-full !m-0" placeholder="10 digit number">
                    </div>
                    <div class="text-left">
                        <label class="block text-sm font-bold text-slate-700 mb-1">Travel Date</label>
                        <input type="date" id="travel-date" class="swal2-input !w-full !m-0" value="${travelDate}" min="${new Date().toISOString().split('T')[0]}">
                    </div>
                    <div class="text-left mt-4">
                        <label class="block text-sm font-bold text-slate-700 mb-1">Seats Count</label>
                        <input type="number" id="seats-count" class="swal2-input !w-full !m-0" value="1" min="1" max="10">
                    </div>
                </div>
            `,
            focusConfirm: false,
            showCancelButton: true,
            confirmButtonText: 'Book Tickets',
            confirmButtonColor: '#059669',
            preConfirm: () => {
                const pName = document.getElementById('passenger-name').value;
                const pContact = document.getElementById('passenger-contact').value;
                const tDate = document.getElementById('travel-date').value;
                const seats = document.getElementById('seats-count').value;
                if (!pName || !tDate || !seats) {
                    Swal.showValidationMessage('Please fill all required fields');
                    return false;
                }
                return { 
                    passengerName: pName, 
                    passengerContact: pContact, 
                    travelDate: tDate, 
                    seats: parseInt(seats) 
                };
            }
        });

        if (formValues) {
            setBookingLoading(trainId);
            try {
                const res = await bookingService.book(
                    trainId, 
                    formValues.seats, 
                    formValues.travelDate, 
                    formValues.passengerName, 
                    formValues.passengerContact
                );
                const bookingId = res.data.id;

                Swal.fire({
                    title: 'Redirecting to Payment',
                    text: 'Redirecting you to our secure payment gateway...',
                    icon: 'info',
                    timer: 1500,
                    showConfirmButton: false,
                    allowOutsideClick: false,
                    didOpen: () => {
                        Swal.showLoading();
                    }
                }).then(() => {
                    navigate(`/payment/${bookingId}`, { state: { amount: res.data.totalPrice } });
                });
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
        <div className="max-w-6xl mx-auto px-4 py-6">
            {/* Search Section */}
            <div className="dark-panel bg-gradient-to-r from-railway-dark to-railway-muted rounded-xl p-6 mb-6 text-white shadow-xl border border-white/5">
                <div className="flex items-center space-x-2 mb-1">
                    <Search size={18} className="text-railway-primary-light" />
                    <h1 className="text-xl font-black uppercase tracking-tight">Find Your Train</h1>
                </div>
                <p className="text-railway-silver text-xs mb-4 font-medium">Search routes and book your journey in seconds.</p>
                
                <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-4 gap-3">
                    <div className="relative">
                        <MapPin size={14} className="absolute left-3 top-3 text-white/30" />
                        <input
                            type="text"
                            placeholder="From Station"
                            className="w-full p-2.5 pl-9 rounded-lg border border-white/20 text-sm font-medium outline-none transition-all"
                            value={source}
                            onChange={(e) => setSource(e.target.value)}
                        />
                    </div>
                    <div className="relative">
                        <MapPin size={14} className="absolute left-3 top-3 text-white/30" />
                        <input
                            type="text"
                            placeholder="To Station"
                            className="w-full p-2.5 pl-9 rounded-lg border border-white/20 text-sm font-medium outline-none transition-all"
                            value={destination}
                            onChange={(e) => setDestination(e.target.value)}
                        />
                    </div>
                    <div className="relative">
                        <Calendar size={14} className="absolute left-3 top-3 text-white/30" />
                        <input
                            type="date"
                            className="w-full p-2.5 pl-9 rounded-lg border border-white/20 text-sm font-medium outline-none transition-all"
                            value={travelDate}
                            onChange={(e) => setTravelDate(e.target.value)}
                            min={new Date().toISOString().split('T')[0]}
                        />
                    </div>
                    <button
                        type="submit"
                        className="bg-railway-primary text-white font-bold px-5 py-2.5 rounded-lg hover:bg-railway-primary-light transition-all text-sm uppercase tracking-wider shadow-lg shadow-railway-primary/20 active:scale-95"
                    >
                        Search
                    </button>
                </form>
            </div>

            {message.text && (
                <div className={`mb-4 p-3 rounded-lg text-center text-sm font-medium ${message.type === 'success' ? 'bg-green-50 text-green-700 border border-green-100' : 'bg-red-50 text-red-700 border border-red-100'}`}>
                    {message.text}
                </div>
            )}

            {/* Train Results */}
            <div className="space-y-3">
                {loading ? (
                    <div className="flex justify-center py-16">
                        <div className="w-10 h-10 border-3 border-railway-primary border-t-transparent rounded-full animate-spin"></div>
                    </div>
                ) : trains.length > 0 ? (
                    trains.map((train) => (
                        <div key={train.id} className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all border border-slate-100 overflow-hidden flex flex-col md:flex-row group">
                            <div className="bg-railway-dark/5 p-4 flex flex-col justify-center items-center border-b md:border-b-0 md:border-r border-slate-100 md:w-36">
                                <span className="text-xl font-black text-railway-primary tracking-tight">#{train.trainNumber}</span>
                                <span className="text-[9px] uppercase tracking-widest text-railway-silver font-bold mt-0.5">Express</span>
                            </div>
                            <div className="p-4 flex-grow grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
                                <div className="md:col-span-2">
                                    <h3 className="text-base font-black text-railway-dark uppercase tracking-tight mb-1">{train.name}</h3>
                                    <div className="flex items-center text-xs font-bold">
                                        <span className="text-railway-primary uppercase">{train.source}</span>
                                        <div className="mx-3 flex items-center">
                                            <div className="h-px w-8 bg-slate-200"></div>
                                            <ArrowRight size={10} className="text-slate-300 -ml-1" />
                                        </div>
                                        <span className="text-railway-primary uppercase">{train.destination}</span>
                                    </div>
                                    <div className="mt-1.5 flex items-center space-x-3 text-[10px] font-bold text-railway-silver uppercase tracking-widest">
                                        <span>Dep: <span className="text-railway-dark">{train.departureTime}</span></span>
                                        <span>Arr: <span className="text-railway-dark">{train.arrivalTime}</span></span>
                                    </div>
                                </div>
                                <div className="text-center">
                                    <div className="text-[10px] font-bold text-railway-silver uppercase tracking-widest mb-0.5">Seats</div>
                                    <div className={`text-2xl font-black ${train.availableSeats > 0 ? 'text-green-600' : 'text-red-500'}`}>
                                        {train.availableSeats}
                                    </div>
                                </div>
                                <div className="flex flex-col space-y-1.5">
                                    <button
                                        onClick={() => handleBook(train.id)}
                                        disabled={train.availableSeats === 0 || bookingLoading === train.id}
                                        className={`w-full px-3 py-2 rounded-lg font-bold text-xs uppercase transition-all ${train.availableSeats > 0 ? 'bg-railway-primary text-white hover:bg-railway-primary-light shadow-sm' : 'bg-slate-100 text-slate-400 cursor-not-allowed'}`}
                                    >
                                        {bookingLoading === train.id ? 'Booking...' : train.availableSeats > 0 ? 'Book Now' : 'Sold Out'}
                                    </button>
                                    <button
                                        onClick={() => navigate(`/train/${train.id}`)}
                                        className="w-full px-3 py-2 rounded-lg font-bold text-xs uppercase border border-railway-primary/30 text-railway-primary hover:bg-railway-primary/5 transition-all"
                                    >
                                        Details
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="text-center py-16 bg-white rounded-xl border-2 border-dashed border-slate-200">
                        <Search size={32} className="mx-auto text-slate-200 mb-3" />
                        <p className="text-sm font-bold text-slate-400">No trains found for this route.</p>
                        <button onClick={() => { setSource(''); setDestination(''); fetchTrains(); }} className="text-railway-primary font-bold text-xs uppercase hover:underline mt-1">Clear Filters</button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Home;
