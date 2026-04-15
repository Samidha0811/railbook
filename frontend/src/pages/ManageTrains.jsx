import React, { useState, useEffect } from 'react';
import { trainService } from '../services/api';
import Swal from 'sweetalert2';
import { Edit, Trash2, Plus, Search, MapPin, Clock, Armchair } from 'lucide-react';

const ManageTrains = () => {
    const [trains, setTrains] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchTrains();
    }, []);

    const fetchTrains = async () => {
        setLoading(true);
        try {
            const res = await trainService.getAll();
            setTrains(res.data);
        } catch (err) {
            Swal.fire('Error', 'Failed to fetch trains', 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleAddEdit = async (train = null) => {
        const { value: formValues } = await Swal.fire({
            title: train ? 'Edit Train' : 'Add New Train',
            html: `
                <div class="space-y-4 text-left">
                    <div>
                        <label class="block text-sm font-bold text-gray-700">Train Number</label>
                        <input id="swal-input1" class="swal2-input !w-full !m-0" value="${train?.trainNumber || ''}" placeholder="e.g. 12101">
                    </div>
                    <div>
                        <label class="block text-sm font-bold text-gray-700">Train Name</label>
                        <input id="swal-input2" class="swal2-input !w-full !m-0" value="${train?.name || ''}" placeholder="e.g. Jnaneswari Express">
                    </div>
                    <div class="grid grid-cols-2 gap-4">
                        <div>
                            <label class="block text-sm font-bold text-gray-700">Source</label>
                            <input id="swal-input3" class="swal2-input !w-full !m-0" value="${train?.source || ''}" placeholder="Mumbai">
                        </div>
                        <div>
                            <label class="block text-sm font-bold text-gray-700">Destination</label>
                            <input id="swal-input4" class="swal2-input !w-full !m-0" value="${train?.destination || ''}" placeholder="Delhi">
                        </div>
                    </div>
                    <div class="grid grid-cols-2 gap-4">
                        <div>
                            <label class="block text-sm font-bold text-gray-700">Departure Time</label>
                            <input id="swal-input5" class="swal2-input !w-full !m-0" value="${train?.departureTime || ''}" placeholder="10:30 PM">
                        </div>
                        <div>
                            <label class="block text-sm font-bold text-gray-700">Arrival Time</label>
                            <input id="swal-input6" class="swal2-input !w-full !m-0" value="${train?.arrivalTime || ''}" placeholder="06:45 AM">
                        </div>
                    </div>
                    <div class="grid grid-cols-2 gap-4">
                        <div>
                            <label class="block text-sm font-bold text-gray-700">Total Seats</label>
                            <input id="swal-input7" type="number" class="swal2-input !w-full !m-0" value="${train?.totalSeats || ''}">
                        </div>
                        <div>
                            <label class="block text-sm font-bold text-gray-700">Price (₹)</label>
                            <input id="swal-input8" type="number" class="swal2-input !w-full !m-0" value="${train?.price || ''}">
                        </div>
                    </div>
                </div>
            `,
            focusConfirm: false,
            showCancelButton: true,
            confirmButtonText: 'Save Train',
            width: '600px',
            preConfirm: () => {
                const trainNumber = document.getElementById('swal-input1').value;
                const name = document.getElementById('swal-input2').value;
                const source = document.getElementById('swal-input3').value;
                const destination = document.getElementById('swal-input4').value;
                const departureTime = document.getElementById('swal-input5').value;
                const arrivalTime = document.getElementById('swal-input6').value;
                const totalSeats = document.getElementById('swal-input7').value;
                const price = document.getElementById('swal-input8').value;

                if (!trainNumber || !name || !source || !destination || !totalSeats || !price) {
                    Swal.showValidationMessage('Please fill all required fields');
                    return false;
                }

                return { 
                    trainNumber, name, source, destination, departureTime, arrivalTime,
                    totalSeats: parseInt(totalSeats), 
                    availableSeats: train ? train.availableSeats : parseInt(totalSeats),
                    price: parseFloat(price) 
                };
            }
        });

        if (formValues) {
            try {
                if (train) {
                    await trainService.update(train.id, formValues);
                    Swal.fire('Updated!', 'Train details updated.', 'success');
                } else {
                    await trainService.create(formValues);
                    Swal.fire('Added!', 'New train added to fleet.', 'success');
                }
                fetchTrains();
            } catch (err) {
                Swal.fire('Error', 'Operation failed', 'error');
            }
        }
    };

    const handleDelete = async (id) => {
        const result = await Swal.fire({
            title: 'Delete Train?',
            text: "This will affect existing bookings!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!'
        });

        if (result.isConfirmed) {
            try {
                await trainService.delete(id);
                Swal.fire('Deleted!', 'Train has been removed.', 'success');
                fetchTrains();
            } catch (err) {
                Swal.fire('Error', 'Deletion failed', 'error');
            }
        }
    };

    const filteredTrains = trains.filter(t => 
        t.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.trainNumber.includes(searchTerm) ||
        t.source.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.destination.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center bg-white p-6 rounded-2xl shadow-sm border border-gray-100 gap-4">
                <div>
                    <h1 className="text-2xl font-black text-gray-900 tracking-tight uppercase">Train Management</h1>
                    <p className="text-gray-500 font-bold text-sm">Managing {trains.length} active trains</p>
                </div>
                <div className="flex w-full md:w-auto space-x-3">
                    <div className="relative flex-grow">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <input 
                            type="text" 
                            placeholder="Search by name, number, route..." 
                            className="pl-10 pr-4 py-2 border rounded-xl focus:ring-2 focus:ring-railway-blue outline-none w-full md:w-80 font-medium"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <button 
                        onClick={() => handleAddEdit()}
                        className="bg-railway-blue text-white px-6 py-2 rounded-xl font-black flex items-center space-x-2 hover:bg-railway-dark transition-all shadow-lg hover:shadow-railway-blue/20"
                    >
                        <Plus size={20} />
                        <span className="hidden md:inline">ADD TRAIN</span>
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pb-20">
                {filteredTrains.map((train) => (
                    <div key={train.id} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-all group">
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <span className="bg-railway-blue/10 text-railway-blue px-3 py-1 rounded-full text-xs font-black tracking-widest uppercase">#{train.trainNumber}</span>
                                <h3 className="text-xl font-black text-gray-900 mt-2">{train.name}</h3>
                            </div>
                            <div className="flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button onClick={() => handleAddEdit(train)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"><Edit size={18} /></button>
                                <button onClick={() => handleDelete(train.id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg"><Trash2 size={18} /></button>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-6 mb-6">
                            <div className="space-y-3">
                                <div className="flex items-center space-x-3 text-gray-600">
                                    <MapPin size={18} className="text-gray-400" />
                                    <div>
                                        <p className="text-xs font-bold text-gray-400 uppercase tracking-tighter leading-none mb-1">Route</p>
                                        <p className="font-bold text-sm">{train.source} → {train.destination}</p>
                                    </div>
                                </div>
                                <div className="flex items-center space-x-3 text-gray-600">
                                    <Clock size={18} className="text-gray-400" />
                                    <div>
                                        <p className="text-xs font-bold text-gray-400 uppercase tracking-tighter leading-none mb-1">Departure</p>
                                        <p className="font-bold text-sm tracking-tight">{train.departureTime}</p>
                                    </div>
                                </div>
                            </div>
                            <div className="space-y-3">
                                <div className="flex items-center space-x-3 text-gray-600">
                                    <Armchair size={18} className="text-gray-400" />
                                    <div>
                                        <p className="text-xs font-bold text-gray-400 uppercase tracking-tighter leading-none mb-1">Capacity</p>
                                        <p className="font-bold text-sm">{train.availableSeats} / {train.totalSeats} Seats</p>
                                    </div>
                                </div>
                                <div className="flex items-center space-x-3 text-gray-600">
                                    <div className="w-[18px] text-center font-black text-gray-400 text-sm">₹</div>
                                    <div>
                                        <p className="text-xs font-bold text-gray-400 uppercase tracking-tighter leading-none mb-1">Base Price</p>
                                        <p className="font-black text-sm text-railway-blue tracking-tight">₹{train.price}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        <div className="w-full bg-gray-100 h-1.5 rounded-full overflow-hidden">
                            <div 
                                className={`h-full transition-all duration-500 ${train.availableSeats / train.totalSeats < 0.2 ? 'bg-red-500' : 'bg-green-500'}`}
                                style={{ width: `${(train.availableSeats / train.totalSeats) * 100}%` }}
                            />
                        </div>
                    </div>
                ))}
            </div>
            
            {!loading && filteredTrains.length === 0 && (
                <div className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl border-2 border-dashed border-gray-200">
                    <Train size={64} className="text-gray-200 mb-4" />
                    <p className="text-gray-400 font-bold text-xl uppercase tracking-widest">Initial Fleet Not Found</p>
                </div>
            )}
        </div>
    );
};

export default ManageTrains;
