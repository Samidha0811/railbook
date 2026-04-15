package com.railway.reservation.repository;

import com.railway.reservation.model.Train;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface TrainRepository extends JpaRepository<Train, Long> {
    List<Train> findBySourceContainingAndDestinationContaining(String source, String destination);
}
