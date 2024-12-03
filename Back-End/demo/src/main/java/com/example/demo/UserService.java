package com.example.demo;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    public User login(String username, String password) {
        System.out.println("Login attempt for username: " + username);

        // Fetch user by username
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new IllegalArgumentException("User not found."));

        System.out.println("User found: " + user.getUsername());

        // Compare provided password with the stored password
        if (!user.getPassword().equals(password)) {
            System.out.println("Password mismatch for username: " + username);
            throw new IllegalArgumentException("Invalid password.");
        }

        System.out.println("Login successful for username: " + username);
        return user;
    }

    public User signup(String username, String password, String retypePassword, String phone) {
        System.out.println("Signup attempt for username: " + username);

        // Check if passwords match
        if (!password.equals(retypePassword)) {
            throw new IllegalArgumentException("Passwords do not match.");
        }

        // Check if username is already taken
        Optional<User> existingUser = userRepository.findByUsername(username);
        if (existingUser.isPresent()) {
            throw new IllegalArgumentException("Username already exists.");
        }

        // Check if phone number is already taken
        Optional<User> existingPhone = userRepository.findByPhone(phone);
        if (existingPhone.isPresent()) {
            throw new IllegalArgumentException("Phone number already exists.");
        }

        // Save the new user to the database
        User newUser = new User();
        newUser.setUsername(username);
        newUser.setPassword(password); // In production, encrypt this password
        newUser.setPhone(phone);

        User savedUser = userRepository.save(newUser);
        System.out.println("Signup successful for username: " + username);
        return savedUser;
    }
}
