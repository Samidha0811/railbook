import React from 'react';
import { useLocation } from 'react-router-dom';

const Footer = () => {
    const location = useLocation();
    
    if (location.pathname.startsWith('/admin')) return null;

    return (
        <footer className="bg-railway-dark text-railway-silver text-center py-4 text-xs font-medium border-t border-white/5">
            <p>&copy; 2024 RailBook — Railway Ticket Reservation System. All rights reserved.</p>
        </footer>
    );
};

export default Footer;
