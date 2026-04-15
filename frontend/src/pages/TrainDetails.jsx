import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { trainService, bookingService } from '../services/api';
import { useAuth } from '../context/AuthContext';
import Swal from 'sweetalert2';
import { ArrowLeft, MapPin } from 'lucide-react';

const TrainDetails = () => {
    const { id } = useParams();
    const [train, setTrain] = useState(null);
    const [loading, setLoading] = useState(true);
    const { user } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchTrain = async () => {
            try {
                const res = await trainService.getById(id);
                setTrain(res.data);
            } catch (err) {
                console.error(err);
                Swal.fire('Error', 'Could not fetch train details', 'error');
            } finally {
                setLoading(false);
            }
        };
        fetchTrain();
    }, [id]);

    const handleBook = async () => {
        if (!user) {
            navigate('/login');
            return;
        }

        const { value: formValues } = await Swal.fire({
            title: 'Confirm Booking',
            html: `
                <div class="space-y-4">
                    <div class="text-left">
                        <label class="block text-sm font-bold text-gray-700 mb-1">Passenger Name</label>
                        <input type="text" id="passenger-name" class="swal2-input !w-full !m-0" value="${user.fullname}">
                    </div>
                    <div class="text-left">
                        <label class="block text-sm font-bold text-gray-700 mb-1">Contact Number</label>
                        <input type="text" id="passenger-contact" class="swal2-input !w-full !m-0" placeholder="10 digit number">
                    </div>
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
            confirmButtonText: 'Confirm & Book',
            confirmButtonColor: '#059669',
            preConfirm: () => {
                const passengerName = document.getElementById('passenger-name').value;
                const passengerContact = document.getElementById('passenger-contact').value;
                const travelDate = document.getElementById('travel-date').value;
                const seats = document.getElementById('seats-count').value;
                
                if (!passengerName || !travelDate || !seats) {
                    Swal.showValidationMessage('Please fill all required fields');
                    return false;
                }
                return { passengerName, passengerContact, travelDate, seats: parseInt(seats) };
            }
        });

        if (formValues) {
            try {
                await bookingService.book(id, formValues.seats, formValues.travelDate, formValues.passengerName, formValues.passengerContact);
                Swal.fire({
                    title: 'Success!',
                    text: 'Ticket booked successfully. Check your dashboard.',
                    icon: 'success',
                    timer: 2500,
                    showConfirmButton: false
                });
                const res = await trainService.getById(id);
                setTrain(res.data);
            } catch (err) {
                Swal.fire('Booking Failed', err.response?.data?.message || 'Operation failed', 'error');
            }
        }
    };

    if (loading) return (
        <div className="flex justify-center items-center py-16">
            <div className="w-10 h-10 border-3 border-railway-primary border-t-transparent rounded-full animate-spin"></div>
        </div>
    );

    if (!train) return <div className="text-center py-16 text-gray-500">Train not found.</div>;

    const sortedStations = [...train.routeStations].sort((a, b) => a.stopOrder - b.stopOrder);

    return (
        <div className="max-w-6xl mx-auto px-4 py-6">
            <Link to="/home" className="text-railway-primary font-bold flex items-center hover:underline text-sm mb-4">
                <ArrowLeft size={14} className="mr-1" />
                Back to Search
            </Link>

            <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
                {/* Header */}
                <div className="bg-gradient-to-r from-railway-dark to-railway-muted p-5 text-white flex flex-col md:flex-row justify-between items-center">
                    <div>
                        <div className="flex items-center space-x-2 mb-1">
                            <span className="bg-railway-primary text-white px-2 py-0.5 rounded text-xs font-black uppercase">#{train.trainNumber}</span>
                            <h1 className="text-xl font-black uppercase tracking-tight">{train.name}</h1>
                        </div>
                        <p className="text-railway-silver font-medium text-sm uppercase tracking-wider">
                            {train.source} <span className="mx-1.5">→</span> {train.destination}
                        </p>
                    </div>
                    <div className="mt-3 md:mt-0 text-center md:text-right">
                        <div className="text-[10px] font-bold opacity-60 uppercase mb-0.5">Fare</div>
                        <div className="text-2xl font-black text-railway-primary-light">₹{train.price}</div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-0">
                    {/* Left: Details */}
                    <div className="lg:col-span-2 p-5 border-r border-gray-100">
                        <div className="grid grid-cols-2 gap-4 mb-6">
                            <div className="bg-railway-primary/5 border border-railway-primary/10 p-4 rounded-lg">
                                <p className="text-[10px] font-bold text-railway-silver uppercase mb-1">Departure</p>
                                <p className="text-lg font-black text-railway-dark">{train.departureTime}</p>
                                <p className="text-xs font-semibold text-railway-primary">{train.source}</p>
                            </div>
                            <div className="bg-gray-50 border border-gray-100 p-4 rounded-lg">
                                <p className="text-[10px] font-bold text-railway-silver uppercase mb-1">Arrival</p>
                                <p className="text-lg font-black text-railway-dark">{train.arrivalTime}</p>
                                <p className="text-xs font-semibold text-railway-primary">{train.destination}</p>
                            </div>
                        </div>

                        <h2 className="text-sm font-black text-railway-dark mb-4 uppercase tracking-wider flex items-center space-x-2">
                            <MapPin size={14} className="text-railway-primary" />
                            <span>Route & Stations</span>
                        </h2>
                        
                        <div className="relative pl-6">
                            <div className="absolute left-[5px] top-3 bottom-3 w-0.5 bg-gray-200 rounded-full"></div>
                            
                            <div className="space-y-4">
                                {/* First Station */}
                                <div className="relative">
                                    <div className="absolute -left-[10px] top-2 w-3 h-3 rounded-full bg-railway-primary border-2 border-white shadow-sm ring-2 ring-railway-primary"></div>
                                    <div className="bg-white p-3 ml-4 rounded-lg border border-gray-100 shadow-sm flex items-center justify-between">
                                        <div>
                                            <p className="font-bold text-railway-dark text-sm uppercase">{train.source}</p>
                                            <p className="text-[10px] font-semibold text-gray-400">Source</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-bold text-railway-primary text-sm">{train.departureTime}</p>
                                            <p className="text-[10px] font-semibold text-gray-400">Departure</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Intermediate */}
                                {sortedStations.map((station, index) => (
                                    <div key={index} className="relative">
                                        <div className="absolute -left-[8px] top-2 w-2 h-2 rounded-full bg-railway-silver border-2 border-white shadow-sm"></div>
                                        <div className="bg-white p-3 ml-4 rounded-lg border border-gray-100 shadow-sm flex items-center justify-between hover:border-railway-primary/20 transition-colors">
                                            <p className="font-semibold text-gray-700 text-sm uppercase">{station.stationName}</p>
                                            <div className="flex space-x-4 text-right">
                                                <div>
                                                    <p className="font-semibold text-gray-600 text-xs">{station.arrivalTime}</p>
                                                    <p className="text-[9px] uppercase font-bold text-gray-300">Arr</p>
                                                </div>
                                                <div>
                                                    <p className="font-semibold text-gray-600 text-xs">{station.departureTime}</p>
                                                    <p className="text-[9px] uppercase font-bold text-gray-300">Dep</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}

                                {/* Last Station */}
                                <div className="relative">
                                    <div className="absolute -left-[10px] top-2 w-3 h-3 rounded-full bg-green-500 border-2 border-white shadow-sm ring-2 ring-green-500"></div>
                                    <div className="bg-white p-3 ml-4 rounded-lg border border-gray-100 shadow-sm flex items-center justify-between">
                                        <div>
                                            <p className="font-bold text-railway-dark text-sm uppercase">{train.destination}</p>
                                            <p className="text-[10px] font-semibold text-gray-400">Destination</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-bold text-green-600 text-sm">{train.arrivalTime}</p>
                                            <p className="text-[10px] font-semibold text-gray-400">Arrival</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right: Booking Panel */}
                    <div className="bg-gray-50 p-5 flex flex-col">
                        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 mb-4">
                            <h3 className="text-sm font-black text-railway-dark mb-3 uppercase">Seat Availability</h3>
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-xs font-semibold text-gray-500">Status</span>
                                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${train.availableSeats > 0 ? 'bg-green-50 text-green-600 border border-green-100' : 'bg-red-50 text-red-500 border border-red-100'}`}>
                                    {train.availableSeats > 0 ? 'AVAILABLE' : 'SOLD OUT'}
                                </span>
                            </div>
                            <div className="flex items-baseline space-x-2">
                                <span className="text-3xl font-black text-railway-primary">{train.availableSeats}</span>
                                <span className="text-gray-400 font-bold uppercase text-[10px]">remaining</span>
                            </div>
                            <div className="mt-3 w-full bg-gray-100 rounded-full h-1.5">
                                <div 
                                    className={`h-1.5 rounded-full transition-all ${train.availableSeats > 20 ? 'bg-green-500' : 'bg-amber-500'}`} 
                                    style={{ width: `${Math.min(100, (train.availableSeats / train.totalSeats) * 100)}%` }}
                                ></div>
                            </div>
                            <p className="text-[10px] text-gray-400 mt-1.5 font-medium text-center">of {train.totalSeats} total seats</p>
                        </div>

                        <div className="mt-auto">
                            <button
                                onClick={handleBook}
                                disabled={train.availableSeats === 0}
                                className={`w-full py-3.5 rounded-xl font-black text-sm transition-all shadow-lg active:scale-95 ${
                                    train.availableSeats > 0 
                                    ? 'bg-railway-primary text-white hover:bg-railway-primary-light shadow-railway-primary/20' 
                                    : 'bg-gray-200 text-gray-400 cursor-not-allowed shadow-none'
                                }`}
                            >
                                {train.availableSeats > 0 ? 'BOOK NOW' : 'NOT AVAILABLE'}
                            </button>
                            <p className="text-[10px] text-center text-gray-400 mt-2 font-medium">
                                * Instant confirmation. Free cancellation policy.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TrainDetails;
