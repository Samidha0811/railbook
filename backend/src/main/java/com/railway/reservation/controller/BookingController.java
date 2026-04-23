package com.railway.reservation.controller;

import com.railway.reservation.dto.MessageResponse;
import com.railway.reservation.model.Booking;
import com.railway.reservation.model.User;
import com.railway.reservation.repository.UserRepository;
import com.railway.reservation.security.UserDetailsImpl;
import com.railway.reservation.service.BookingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/bookings")
public class BookingController {

    @Autowired
    BookingService bookingService;

    @Autowired
    UserRepository userRepository;

    @PostMapping
    public ResponseEntity<?> bookTicket(@RequestBody Map<String, Object> payload, Authentication authentication) {
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        User user = userRepository.findById(userDetails.getId()).get();

        Long trainId = Long.valueOf(payload.get("trainId").toString());
        Integer seats = Integer.valueOf(payload.get("seats").toString());
        String travelDate = payload.get("travelDate").toString();
        String passengerName = payload.getOrDefault("passengerName", user.getFullname()).toString();
        String passengerContact = payload.getOrDefault("passengerContact", "").toString();

        try {
            Booking booking = bookingService.bookTicket(user, trainId, seats, travelDate, passengerName,
                    passengerContact);
            return ResponseEntity.ok(booking);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new MessageResponse(e.getMessage()));
        }
    }

    @GetMapping("/my")
    public List<Booking> getMyBookings(Authentication authentication) {
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        User user = userRepository.findById(userDetails.getId()).get();
        return bookingService.getBookingsByUser(user);
    }

    @GetMapping("/all")
    @PreAuthorize("hasRole('ADMIN')")
    public List<Booking> getAllBookings() {
        return bookingService.getAllBookings();
    }

    @PostMapping("/{id}/cancel")
    public ResponseEntity<?> cancelBooking(@PathVariable Long id) {
        try {
            bookingService.cancelBooking(id);
            return ResponseEntity.ok(new MessageResponse("Booking cancelled successfully"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new MessageResponse(e.getMessage()));
        }
    }
}
