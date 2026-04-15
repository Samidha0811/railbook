package com.railway.reservation;

import com.railway.reservation.model.Train;
import com.railway.reservation.model.User;
import com.railway.reservation.repository.TrainRepository;
import com.railway.reservation.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;

@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired
    TrainRepository trainRepository;

    @Autowired
    UserRepository userRepository;

    @Autowired
    PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        if (userRepository.findByEmail("admin@railway.com").isPresent()) {
            return;
        }

        // Create Admin
        User admin = new User();
        admin.setFullname("System Admin");
        admin.setEmail("admin@railway.com");
        admin.setPassword(passwordEncoder.encode("admin123"));
        admin.setRole("ROLE_ADMIN");
        admin.setEnabled(true);
        userRepository.save(admin);

        // Create Sample Trains
        trainRepository.save(new Train(null, "12101", "Jnaneswari Express", "Mumbai", "Kolkata", "10:30 PM", "06:00 AM", 500, 500, new BigDecimal("850.00")));
        trainRepository.save(new Train(null, "12267", "Duronto Express", "Mumbai", "Ahmedabad", "11:25 PM", "08:30 AM", 300, 300, new BigDecimal("650.00")));
        trainRepository.save(new Train(null, "12951", "Rajdhani Express", "Mumbai", "Delhi", "04:40 PM", "09:10 AM", 800, 800, new BigDecimal("2100.00")));
        trainRepository.save(new Train(null, "11019", "Konark Express", "Mumbai", "Bhubaneswar", "03:10 PM", "01:20 PM", 400, 400, new BigDecimal("1200.00")));

        System.out.println("Data Initialization Complete!");
    }
}
