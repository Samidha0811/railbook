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
                        <label class="block text-sm font-bold text-slate-700">Train Number</label>
                        <input id="swal-input1" class="swal2-input !w-full !m-0" value="${train?.trainNumber || ''}" placeholder="e.g. 12101">
                    </div>
                    <div>
                        <label class="block text-sm font-bold text-slate-700">Train Name</label>
                        <input id="swal-input2" class="swal2-input !w-full !m-0" value="${train?.name || ''}" placeholder="e.g. Jnaneswari Express">
                    </div>
                    <div class="grid grid-cols-2 gap-4">
                        <div>
                            <label class="block text-sm font-bold text-slate-700">Source</label>
                            <input id="swal-input3" class="swal2-input !w-full !m-0" value="${train?.source || ''}" placeholder="Mumbai">
                        </div>
                        <div>
                            <label class="block text-sm font-bold text-slate-700">Destination</label>
                            <input id="swal-input4" class="swal2-input !w-full !m-0" value="${train?.destination || ''}" placeholder="Delhi">
                        </div>
                    </div>
                    <div class="grid grid-cols-2 gap-4">
                        <div>
                            <label class="block text-sm font-bold text-slate-700">Departure Time</label>
                            <input id="swal-input5" class="swal2-input !w-full !m-0" value="${train?.departureTime || ''}" placeholder="10:30 PM">
                        </div>
                        <div>
                            <label class="block text-sm font-bold text-slate-700">Arrival Time</label>
                            <input id="swal-input6" class="swal2-input !w-full !m-0" value="${train?.arrivalTime || ''}" placeholder="06:45 AM">
                        </div>
                    </div>
                    <div class="grid grid-cols-2 gap-4">
                        <div>
                            <label class="block text-sm font-bold text-slate-700">Total Seats</label>
                            <input id="swal-input7" type="number" class="swal2-input !w-full !m-0" value="${train?.totalSeats || ''}">
                        </div>
                        <div>
                            <label class="block text-sm font-bold text-slate-700">Price (₹)</label>
                            <input id="swal-input8" type="number" class="swal2-input !w-full !m-0" value="${train?.price || ''}">
                        </div>
                    </div>
                </div>
            `,
            focusConfirm: false,
            showCancelButton: true,
            confirmButtonText: 'Save Train',
            confirmButtonColor: '#059669',
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
        <div className="space-y-4">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center bg-white p-4 rounded-xl shadow-sm border border-slate-100 gap-3">
                <div>
                    <h1 className="text-base font-black text-railway-dark tracking-tight uppercase">Train Management</h1>
                    <p className="text-railway-silver text-xs font-medium">{trains.length} trains in fleet</p>
                </div>
                <div className="flex w-full md:w-auto space-x-2">
                    <div className="relative flex-grow">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300" size={14} />
                        <input 
                            type="text" 
                            placeholder="Search trains..." 
                            className="pl-9 pr-3 py-2 border border-slate-200 rounded-lg focus:ring-1 focus:ring-railway-primary outline-none w-full md:w-64 text-sm font-medium"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <button 
                        onClick={() => handleAddEdit()}
                        className="bg-railway-primary text-white px-4 py-2 rounded-lg font-bold flex items-center space-x-1.5 hover:bg-railway-primary-light transition-all shadow-sm text-sm whitespace-nowrap"
                    >
                        <Plus size={16} />
                        <span className="hidden md:inline">Add</span>
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                {filteredTrains.map((train) => (
                    <div key={train.id} className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 hover:shadow-md transition-all group">
                        <div className="flex justify-between items-start mb-3">
                            <div>
                                <span className="bg-railway-primary/10 text-railway-primary px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase">#{train.trainNumber}</span>
                                <h3 className="text-base font-black text-railway-dark mt-1">{train.name}</h3>
                            </div>
                            <div className="flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button onClick={() => handleAddEdit(train)} className="p-1.5 text-railway-primary hover:bg-railway-primary/5 rounded-lg"><Edit size={14} /></button>
                                <button onClick={() => handleDelete(train.id)} className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg"><Trash2 size={14} /></button>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3 mb-3 text-xs">
                            <div className="flex items-center space-x-2 text-slate-600">
                                <MapPin size={12} className="text-slate-300 flex-shrink-0" />
                                <div>
                                    <p className="text-[10px] font-bold text-slate-300 uppercase">Route</p>
                                    <p className="font-semibold">{train.source} → {train.destination}</p>
                                </div>
                            </div>
                            <div className="flex items-center space-x-2 text-slate-600">
                                <Clock size={12} className="text-slate-300 flex-shrink-0" />
                                <div>
                                    <p className="text-[10px] font-bold text-slate-300 uppercase">Time</p>
                                    <p className="font-semibold">{train.departureTime}</p>
                                </div>
                            </div>
                            <div className="flex items-center space-x-2 text-slate-600">
                                <Armchair size={12} className="text-slate-300 flex-shrink-0" />
                                <div>
                                    <p className="text-[10px] font-bold text-slate-300 uppercase">Seats</p>
                                    <p className="font-semibold">{train.availableSeats}/{train.totalSeats}</p>
                                </div>
                            </div>
                            <div className="flex items-center space-x-2 text-slate-600">
                                <span className="text-slate-300 font-bold text-xs flex-shrink-0">₹</span>
                                <div>
                                    <p className="text-[10px] font-bold text-slate-300 uppercase">Price</p>
                                    <p className="font-bold text-railway-primary">₹{train.price}</p>
                                </div>
                            </div>
                        </div>
                        
                        <div className="w-full bg-slate-100 h-1 rounded-full overflow-hidden">
                            <div 
                                className={`h-full transition-all duration-500 ${train.availableSeats / train.totalSeats < 0.2 ? 'bg-red-500' : 'bg-green-500'}`}
                                style={{ width: `${(train.availableSeats / train.totalSeats) * 100}%` }}
                            />
                        </div>
                    </div>
                ))}
            </div>
            
            {!loading && filteredTrains.length === 0 && (
                <div className="flex flex-col items-center justify-center py-16 bg-white rounded-xl border-2 border-dashed border-slate-200">
                    <Search size={32} className="text-slate-200 mb-2" />
                    <p className="text-slate-400 font-bold text-sm">No trains found</p>
                </div>
            )}
        </div>
    );
};

export default ManageTrains;
