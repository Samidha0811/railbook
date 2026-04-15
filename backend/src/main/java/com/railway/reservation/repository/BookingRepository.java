package com.railway.reservation.repository;

import com.railway.reservation.model.Booking;
import com.railway.reservation.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface BookingRepository extends JpaRepository<Booking, Long> {
    List<Booking> findByUser(User user);
}
