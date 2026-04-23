import React, { useState, useEffect } from 'react';
import { paymentService } from '../services/api';
import Swal from 'sweetalert2';
import { CreditCard, Calendar, Hash, DollarSign, User as UserIcon } from 'lucide-react';

const ManageTransactions = () => {
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchTransactions();
    }, []);

    const fetchTransactions = async () => {
        setLoading(true);
        try {
            const res = await paymentService.getAll();
            setTransactions(res.data);
        } catch (err) {
            console.error(err);
            Swal.fire('Error', 'Failed to fetch transactions', 'error');
        } finally {
            setLoading(false);
        }
    };

    if (loading) return (
        <div className="flex justify-center items-center h-64">
            <div className="w-8 h-8 border-3 border-railway-primary border-t-transparent rounded-full animate-spin"></div>
        </div>
    );

    return (
        <div className="space-y-4">
            <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 flex justify-between items-center">
                <div>
                    <h1 className="text-base font-black text-railway-dark tracking-tight uppercase">Financial Ledger</h1>
                    <p className="text-railway-silver text-xs font-medium">{transactions.length} processed transactions</p>
                </div>
                <div className="p-2 bg-railway-primary/10 rounded-lg">
                    <DollarSign size={20} className="text-railway-primary" />
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
                <table className="min-w-full divide-y divide-slate-100">
                    <thead className="bg-slate-50">
                        <tr>
                            <th className="px-4 py-3 text-left text-[10px] font-bold text-railway-silver uppercase tracking-wider">Transaction ID</th>
                            <th className="px-4 py-3 text-left text-[10px] font-bold text-railway-silver uppercase tracking-wider">Booking Ref</th>
                            <th className="px-4 py-3 text-left text-[10px] font-bold text-railway-silver uppercase tracking-wider">Method</th>
                            <th className="px-4 py-3 text-left text-[10px] font-bold text-railway-silver uppercase tracking-wider">Amount</th>
                            <th className="px-4 py-3 text-left text-[10px] font-bold text-railway-silver uppercase tracking-wider">Timestamp</th>
                            <th className="px-4 py-3 text-left text-[10px] font-bold text-railway-silver uppercase tracking-wider">Status</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                        {transactions.map((tx) => (
                            <tr key={tx.id} className="hover:bg-slate-50/50 transition-colors">
                                <td className="px-4 py-3 whitespace-nowrap">
                                    <div className="text-sm font-bold text-railway-dark">{tx.transactionId}</div>
                                </td>
                                <td className="px-4 py-3 whitespace-nowrap">
                                    <div className="text-sm font-semibold text-slate-600">BK-{tx.bookingId.toString().padStart(4, '0')}</div>
                                </td>
                                <td className="px-4 py-3 whitespace-nowrap">
                                    <div className="flex items-center space-x-1.5 text-xs text-slate-600 font-medium">
                                        <CreditCard size={12} className="text-slate-400" />
                                        <span>{tx.paymentMethod}</span>
                                    </div>
                                </td>
                                <td className="px-4 py-3 whitespace-nowrap">
                                    <div className="text-sm font-black text-railway-dark">₹{tx.amount}</div>
                                </td>
                                <td className="px-4 py-3 whitespace-nowrap">
                                    <div className="flex items-center space-x-1.5 text-[10px] text-slate-400">
                                        <Calendar size={10} className="text-slate-300" />
                                        <span>{new Date(tx.timestamp).toLocaleString()}</span>
                                    </div>
                                </td>
                                <td className="px-4 py-3 whitespace-nowrap">
                                    <span className={`inline-block px-2 py-0.5 rounded-full text-[9px] font-bold uppercase ${tx.status === 'SUCCESS' ? 'bg-green-50 text-green-600 border border-green-100' : 'bg-red-50 text-red-500 border border-red-100'}`}>
                                        {tx.status}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {transactions.length === 0 && (
                    <div className="p-12 text-center text-railway-silver text-sm font-medium uppercase tracking-widest opacity-50">
                        No transactions recorded yet
                    </div>
                )}
            </div>
        </div>
    );
};

export default ManageTransactions;
