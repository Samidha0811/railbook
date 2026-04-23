package com.railway.reservation.controller;

import com.railway.reservation.model.Transaction;
import com.railway.reservation.repository.TransactionRepository;
import com.railway.reservation.service.BookingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/payments")
public class PaymentController {

    @Autowired
    BookingService bookingService;

    @Autowired
    TransactionRepository transactionRepository;

    @PostMapping("/process")
    public ResponseEntity<?> processPayment(@RequestBody Map<String, Object> payload) {
        Long bookingId = Long.valueOf(payload.get("bookingId").toString());
        BigDecimal amount = new BigDecimal(payload.get("amount").toString());
        String method = payload.getOrDefault("method", "CARD").toString();

        // Fake payment processing success
        String transactionId = "TXN-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();
        
        try {
            bookingService.confirmPayment(bookingId);
            
            Transaction transaction = new Transaction(
                bookingId,
                transactionId,
                amount,
                "SUCCESS",
                method
            );
            
            transactionRepository.save(transaction);
            
            return ResponseEntity.ok(transaction);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/all")
    @PreAuthorize("hasRole('ADMIN')")
    public List<Transaction> getAllTransactions() {
        return transactionRepository.findAll();
    }
}
