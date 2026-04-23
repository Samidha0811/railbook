package com.railway.reservation.service;

import com.railway.reservation.model.Booking;
import com.railway.reservation.model.Train;
import com.railway.reservation.model.User;
import com.railway.reservation.repository.BookingRepository;
import com.railway.reservation.repository.TrainRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;

@Service
public class BookingService {

    @Autowired
    BookingRepository bookingRepository;

    @Autowired
    TrainRepository trainRepository;

    @Transactional
    public Booking bookTicket(User user, Long trainId, Integer seats, String travelDate, String passengerName,
            String passengerContact) {
        Train train = trainRepository.findById(trainId)
                .orElseThrow(() -> new RuntimeException("Train not found"));

        if (train.getAvailableSeats() < seats) {
            throw new RuntimeException("Not enough seats available");
        }

        // Deduct seats
        train.setAvailableSeats(train.getAvailableSeats() - seats);
        trainRepository.save(train);

        // Create booking
        Booking booking = new Booking();
        booking.setUser(user);
        booking.setTrain(train);
        booking.setSeatsBooked(seats);
        booking.setTotalPrice(train.getPrice().multiply(new BigDecimal(seats)));
        booking.setStatus("PAYMENT_PENDING");
        booking.setTravelDate(travelDate);
        booking.setPassengerName(passengerName);
        booking.setPassengerContact(passengerContact);

        return bookingRepository.save(booking);
    }

    @Transactional
    public Booking confirmPayment(Long bookingId) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new RuntimeException("Booking not found"));

        if (!"PAYMENT_PENDING".equals(booking.getStatus())) {
            throw new RuntimeException("Booking is not in payment pending status");
        }

        booking.setStatus("BOOKED");
        return bookingRepository.save(booking);
    }

    @Transactional
    public void cancelBooking(Long bookingId) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new RuntimeException("Booking not found"));

        if ("CANCELLED".equals(booking.getStatus())) {
            throw new RuntimeException("Booking already cancelled");
        }

        // Refund seats
        Train train = booking.getTrain();
        train.setAvailableSeats(train.getAvailableSeats() + booking.getSeatsBooked());
        trainRepository.save(train);

        // Dummy Refund Logic (90% refund)
        java.math.BigDecimal refund = booking.getTotalPrice().multiply(new java.math.BigDecimal("0.9"));
        booking.setRefundAmount(refund);

        booking.setStatus("CANCELLED");
        bookingRepository.save(booking);
    }

    public List<Booking> getBookingsByUser(User user) {
        return bookingRepository.findByUser(user);
    }

    public List<Booking> getAllBookings() {
        return bookingRepository.findAll();
    }
}
