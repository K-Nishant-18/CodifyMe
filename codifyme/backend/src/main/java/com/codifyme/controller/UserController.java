package com.codifyme.controller;

import com.codifyme.model.User;
import com.codifyme.payload.response.CrackScoreResponse;
import com.codifyme.payload.response.UserResponse;
import com.codifyme.repository.UserRepository;
import com.codifyme.security.services.UserDetailsImpl;
import com.codifyme.service.CrackScoreService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/user")
public class UserController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private CrackScoreService crackScoreService;

    @GetMapping("/profile")
    public ResponseEntity<UserResponse> getUserProfile() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();

        User user = userRepository.findById(userDetails.getId())
                .orElseThrow(() -> new RuntimeException("User not found"));

        UserResponse response = new UserResponse(
                user.getId(),
                user.getEmail(),
                user.getFullName(),
                user.getCrackScore(),
                user.getCreatedAt());

        return ResponseEntity.ok(response);
    }

    @PutMapping("/profile")
    public ResponseEntity<?> updateUserProfile(@RequestBody User userUpdate) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();

        User user = userRepository.findById(userDetails.getId())
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (userUpdate.getFullName() != null) {
            user.setFullName(userUpdate.getFullName());
        }

        userRepository.save(user);

        return ResponseEntity.ok("Profile updated successfully");
    }

    @GetMapping("/crackscore")
    public ResponseEntity<CrackScoreResponse> getCrackScore() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();

        CrackScoreResponse response = crackScoreService.calculateCrackScore(userDetails.getId());
        return ResponseEntity.ok(response);
    }
}
