package com.codifyme.controller;

import com.codifyme.model.User;
import com.codifyme.model.UserProfile;
import com.codifyme.payload.request.UserProfileRequest;
import com.codifyme.payload.response.UserProfileResponse;
import com.codifyme.payload.response.UserResponse;
import com.codifyme.repository.UserProfileRepository;
import com.codifyme.repository.UserRepository;
import com.codifyme.security.services.UserDetailsImpl;
import com.codifyme.service.UserProfileService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/profile")
public class UserProfileController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private UserProfileRepository userProfileRepository;

    @Autowired
    private UserProfileService userProfileService;

    // Get combined user + profile data
    @GetMapping
    public ResponseEntity<?> getCompleteProfile() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();

        User user = userRepository.findById(userDetails.getId())
                .orElseThrow(() -> new RuntimeException("User not found"));

        UserProfile profile = userProfileRepository.findByUserId(user.getId()).orElse(null);

        // Create a combined response
        java.util.Map<String, Object> response = new java.util.HashMap<>();

        // User data
        response.put("id", user.getId());
        response.put("email", user.getEmail());
        response.put("fullName", user.getFullName());
        response.put("crackScore", user.getCrackScore());
        response.put("createdAt", user.getCreatedAt());

        // Profile data (if exists)
        if (profile != null) {
            response.put("targetCompany", profile.getTargetCompany());
            response.put("targetRole", profile.getTargetRole());
            response.put("deadline", profile.getDeadline());
            response.put("resumePath", profile.getResumePath());
            response.put("jobDescription", profile.getJobDescription());
            response.put("experienceLevel", profile.getExperienceLevel());
        }

        return ResponseEntity.ok(response);
    }

    // Update profile data
    @PutMapping
    public ResponseEntity<?> updateProfile(@RequestBody UserProfileRequest profileRequest) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();

        User user = userRepository.findById(userDetails.getId())
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Check if profile exists, create or update
        UserProfile existingProfile = userProfileRepository.findByUserId(user.getId()).orElse(null);

        if (existingProfile == null) {
            // Create new profile
            userProfileService.createProfile(user, profileRequest);
        } else {
            // Update existing profile
            userProfileService.updateProfile(user.getId(), profileRequest);
        }

        return ResponseEntity.ok(new com.codifyme.payload.response.MessageResponse("Profile updated successfully!"));
    }
}
