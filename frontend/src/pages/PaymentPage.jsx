import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { paymentService } from '../services/api';
import Swal from 'sweetalert2';
import { CreditCard, ShieldCheck, Lock, ArrowRight, ChevronRight, CheckCircle2 } from 'lucide-react';

const PaymentPage = () => {
    const { bookingId } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const [amount, setAmount] = useState(location.state?.amount || 0);
    const [processing, setProcessing] = useState(false);
    const [cardDetails, setCardDetails] = useState({
        number: '**** **** **** 4242',
        expiry: '12/28',
        cvv: '***'
    });

    const handlePayment = async (e) => {
        e.preventDefault();
        setProcessing(true);

        Swal.fire({
            title: 'Processing Payment',
            html: `
                <div class="flex flex-col items-center">
                    <div class="w-12 h-12 border-4 border-railway-primary border-t-transparent rounded-full animate-spin mb-4"></div>
                    <p class="text-sm font-medium text-slate-600">Verifying with your bank...</p>
                </div>
            `,
            showConfirmButton: false,
            allowOutsideClick: false,
            timer: 3000,
            timerProgressBar: true,
            didOpen: () => {
                Swal.showLoading();
            }
        }).then(async () => {
            try {
                await paymentService.process({
                    bookingId,
                    amount,
                    method: 'CARD'
                });

                Swal.fire({
                    title: 'Payment Successful!',
                    text: 'Your ticket has been confirmed. Redirecting to dashboard...',
                    icon: 'success',
                    timer: 2000,
                    showConfirmButton: false
                }).then(() => {
                    navigate('/dashboard');
                });
            } catch (err) {
                Swal.fire('Payment Failed', err.response?.data || 'Transaction declined', 'error');
                setProcessing(false);
            }
        });
    };

    return (
        <div className="max-w-4xl mx-auto px-4 py-12">
            <div className="bg-railway-dark rounded-3xl shadow-2xl overflow-hidden border border-white/5 flex flex-col md:flex-row">
                {/* Order Summary */}
                <div className="md:w-1/3 bg-gradient-to-br from-railway-dark to-[#1e293b] p-8 text-white">
                    <h2 className="text-xl font-black mb-8 uppercase tracking-tight flex items-center">
                        <ShieldCheck className="mr-2 text-railway-primary" size={24} />
                        Checkout
                    </h2>
                    
                    <div className="space-y-6">
                        <div>
                            <p className="text-[10px] font-bold text-railway-silver uppercase mb-1 opacity-50">Booking Reference</p>
                            <p className="text-lg font-mono font-bold text-railway-primary-light">#{String(bookingId).padStart(6, '0')}</p>
                        </div>
                        
                        <div className="h-px bg-white/10 w-full"></div>
                        
                        <div>
                            <p className="text-[10px] font-bold text-railway-silver uppercase mb-1 opacity-50">Total Amount</p>
                            <p className="text-4xl font-black text-white">₹{amount}</p>
                            <p className="text-xs text-railway-silver mt-1">Include all taxes & fees</p>
                        </div>

                        <div className="bg-white/5 rounded-2xl p-4 border border-white/5 mt-8">
                            <div className="flex items-center space-x-3 text-xs font-semibold text-railway-silver">
                                <Lock size={14} className="text-green-400" />
                                <span>256-bit SSL Secure Payment</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Card Details form */}
                <div className="md:w-2/3 bg-white p-8">
                    <div className="flex items-center justify-between mb-8">
                        <h3 className="text-lg font-black text-railway-dark uppercase">Payment Method</h3>
                        <div className="flex space-x-2">
                            <div className="w-8 h-5 bg-slate-100 rounded border border-slate-200 flex items-center justify-center grayscale opacity-50"><img src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Visa_Inc._logo.svg/2560px-Visa_Inc._logo.svg.png" alt="Visa" className="h-2" /></div>
                            <div className="w-8 h-5 bg-slate-100 rounded border border-slate-200 flex items-center justify-center grayscale opacity-50"><img src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Mastercard-logo.svg/1280px-Mastercard-logo.svg.png" alt="Mastercard" className="h-3" /></div>
                        </div>
                    </div>

                    <form onSubmit={handlePayment} className="space-y-6">
                        <div className="space-y-4">
                            <div className="relative">
                                <label className="block text-[10px] font-bold text-railway-silver uppercase mb-1.5 ml-1">Card Number</label>
                                <div className="relative">
                                    <input 
                                        type="text" 
                                        readOnly 
                                        value={cardDetails.number}
                                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3.5 text-sm font-bold text-railway-dark focus:ring-2 focus:ring-railway-primary/20 focus:border-railway-primary transition-all outline-none pl-12"
                                    />
                                    <CreditCard className="absolute left-4 top-1/2 -translate-y-1/2 text-railway-silver" size={20} />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-[10px] font-bold text-railway-silver uppercase mb-1.5 ml-1">Expiry Date</label>
                                    <input 
                                        type="text" 
                                        readOnly 
                                        value={cardDetails.expiry}
                                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3.5 text-sm font-bold text-railway-dark outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="block text-[10px] font-bold text-railway-silver uppercase mb-1.5 ml-1">CVV</label>
                                    <input 
                                        type="password" 
                                        readOnly 
                                        value={cardDetails.cvv}
                                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3.5 text-sm font-bold text-railway-dark outline-none"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-[10px] font-bold text-railway-silver uppercase mb-1.5 ml-1">Card Holder Name</label>
                                <input 
                                    type="text" 
                                    placeholder="AS SEEN ON CARD"
                                    className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3.5 text-sm font-bold text-railway-dark focus:ring-2 focus:ring-railway-primary/20 focus:border-railway-primary transition-all outline-none"
                                    required
                                />
                            </div>
                        </div>

                        <div className="pt-4">
                            <button 
                                type="submit"
                                disabled={processing}
                                className="w-full bg-railway-primary hover:bg-railway-primary-light text-white rounded-2xl py-4 font-black shadow-xl shadow-railway-primary/20 transition-all flex items-center justify-center space-x-2 group active:scale-[0.98] disabled:opacity-70 disabled:grayscale disabled:cursor-not-allowed"
                            >
                                <span>COMPLETE PAYMENT</span>
                                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                            </button>
                        </div>
                    </form>

                    <div className="mt-8 flex items-center justify-center space-x-6 grayscale opacity-30 invert-[0.1]">
                        <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/c/cc/PCI-DSS-logo.svg/1200px-PCI-DSS-logo.svg.png" alt="PCI DSS" className="h-6" />
                        <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/3/39/PayPal_logo.svg/1200px-PayPal_logo.svg.png" alt="Paypal" className="h-4" />
                    </div>
                </div>
            </div>
            
            <p className="text-center text-[10px] text-railway-silver font-medium mt-6 uppercase tracking-widest">
                Safe & Secure Gateway • 24/7 Support • Travel with confidence
            </p>
        </div>
    );
};

export default PaymentPage;
