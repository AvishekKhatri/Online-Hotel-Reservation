package com.example.demo;

import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/bookings")
@CrossOrigin(origins = "http://localhost:4200") // Allow Angular access
public class BookingController {

    private final BookingRepository bookingRepository;

    public BookingController(BookingRepository bookingRepository) {
        this.bookingRepository = bookingRepository;
    }

    // Retrieve all bookings (optional for debugging purposes)
    @GetMapping
    public List<Booking> getAllBookings() {
        return bookingRepository.findAll();
    }

    // Retrieve bookings for a specific user
    @GetMapping("/user/{userId}")
    public List<Booking> getBookingsByUserId(@PathVariable Long userId) {
        return bookingRepository.findByUserId(userId);
    }

    // Add a new booking
    @PostMapping
    public Booking addBooking(@RequestBody Booking booking) {
        // Validate required fields
        if (booking.getUserId() == null) {
            throw new IllegalArgumentException("User ID is required for booking.");
        }
        if (booking.getHotelId() == null || booking.getCheckInDate() == null || booking.getCheckOutDate() == null) {
            throw new IllegalArgumentException("Hotel details and dates are required for booking.");
        }if (booking.getNumberOfPersons() <= 0 || booking.getNumberOfRooms() <= 0) {
            throw new IllegalArgumentException("Number of persons and rooms must be greater than 0.");
        }
        return bookingRepository.save(booking);
    }

    // Update an existing booking
    @PutMapping("/{id}")
    public Booking updateBooking(@PathVariable Long id, @RequestBody Booking updatedBooking) {
        Optional<Booking> existingBookingOpt = bookingRepository.findById(id);
        if (existingBookingOpt.isEmpty()) {
            throw new IllegalArgumentException("Booking not found for ID: " + id);
        }

        Booking existingBooking = existingBookingOpt.get();
        existingBooking.setCheckInDate(updatedBooking.getCheckInDate());
        existingBooking.setCheckOutDate(updatedBooking.getCheckOutDate());
        existingBooking.setTotalPayable(updatedBooking.getTotalPayable());
        existingBooking.setPaymentMethod(updatedBooking.getPaymentMethod());
        existingBooking.setHotelName(updatedBooking.getHotelName());
        return bookingRepository.save(existingBooking);
    }

    // Delete a booking
    @DeleteMapping("/{id}")
    public void deleteBooking(@PathVariable Long id) {
        bookingRepository.deleteById(id);
    }
}
