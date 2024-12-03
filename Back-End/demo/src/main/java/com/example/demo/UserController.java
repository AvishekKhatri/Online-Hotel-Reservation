package com.example.demo;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class UserController {

    @Autowired
    private UserService userService;

    @PostMapping("/login")
public ResponseEntity<?> login(@RequestBody Map<String, String> loginData) {
    String username = loginData.get("username");
    String password = loginData.get("password");

    try {
        User user = userService.login(username, password); // Assuming `login` returns a `User` object
        return ResponseEntity.ok(Map.of(
            "message", "Login successful!",
            "userId", user.getId(), // Include the userId in the response
            "username", user.getUsername() // Optional: Add username for reference
        ));
    } catch (Exception e) {
        return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
    }
}


    @PostMapping("/signup")
    public ResponseEntity<?> signup(@RequestBody Map<String, String> signupData) {
        String username = signupData.get("username");
        String password = signupData.get("password");
        String retypePassword = signupData.get("retypePassword");
        String phone = signupData.get("phone");

        try {
            userService.signup(username, password, retypePassword, phone);
            return ResponseEntity.ok(Map.of("message", "Signup successful!"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }
}
