package com.railway.reservation.controller;

import com.railway.reservation.model.User;
import com.railway.reservation.repository.BookingRepository;
import com.railway.reservation.repository.TrainRepository;
import com.railway.reservation.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

    @Autowired
    UserRepository userRepository;

    @Autowired
    TrainRepository trainRepository;

    @Autowired
    BookingRepository bookingRepository;

    @GetMapping("/stats")
    public ResponseEntity<?> getStats() {
        Map<String, Object> stats = new HashMap<>();
        stats.put("totalUsers", userRepository.count());
        stats.put("totalTrains", trainRepository.count());
        stats.put("totalBookings", bookingRepository.count());
        
        // Additional business metrics
        long activeBookings = bookingRepository.findAll().stream()
                .filter(b -> "BOOKED".equals(b.getStatus()))
                .count();
        stats.put("activeBookings", activeBookings);

        return ResponseEntity.ok(stats);
    }

    @GetMapping("/users")
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    @PutMapping("/users/{id}/toggle-block")
    public ResponseEntity<?> toggleUserBlock(@PathVariable Long id) {
        return userRepository.findById(id).map(user -> {
            user.setEnabled(!user.isEnabled());
            userRepository.save(user);
            return ResponseEntity.ok("User status updated successfully");
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/users/{id}")
    public ResponseEntity<?> deleteUser(@PathVariable Long id) {
        return userRepository.findById(id).map(user -> {
            userRepository.delete(user);
            return ResponseEntity.ok("User deleted successfully");
        }).orElse(ResponseEntity.notFound().build());
    }
}
