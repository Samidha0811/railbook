package com.railway.reservation.controller;

import com.railway.reservation.model.Train;
import com.railway.reservation.repository.TrainRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/trains")
public class TrainController {

    @Autowired
    TrainRepository trainRepository;

    @GetMapping
    public List<Train> getAllTrains(@RequestParam(required = false) String source,
                                    @RequestParam(required = false) String destination) {
        if (source != null && destination != null) {
            return trainRepository.findBySourceContainingAndDestinationContaining(source, destination);
        }
        return trainRepository.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Train> getTrainById(@PathVariable Long id) {
        return trainRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public Train createTrain(@RequestBody Train train) {
        return trainRepository.save(train);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Train> updateTrain(@PathVariable Long id, @RequestBody Train trainDetails) {
        return trainRepository.findById(id).map(train -> {
            train.setName(trainDetails.getName());
            train.setSource(trainDetails.getSource());
            train.setDestination(trainDetails.getDestination());
            train.setDepartureTime(trainDetails.getDepartureTime());
            train.setTotalSeats(trainDetails.getTotalSeats());
            train.setAvailableSeats(trainDetails.getAvailableSeats());
            train.setPrice(trainDetails.getPrice());
            return ResponseEntity.ok(trainRepository.save(train));
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> deleteTrain(@PathVariable Long id) {
        return trainRepository.findById(id).map(train -> {
            trainRepository.delete(train);
            return ResponseEntity.ok().build();
        }).orElse(ResponseEntity.notFound().build());
    }
}
