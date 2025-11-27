package com.codifyme.controller;

import com.codifyme.model.User;
import com.codifyme.payload.request.LoginRequest;
import com.codifyme.payload.request.SignupRequest;
import com.codifyme.payload.request.UserProfileRequest;
import com.codifyme.payload.response.JwtResponse;
import com.codifyme.payload.response.MessageResponse;
import com.codifyme.repository.UserRepository;
import com.codifyme.security.jwt.JwtUtils;
import com.codifyme.security.services.UserDetailsImpl;
import com.codifyme.service.UserProfileService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/auth")
public class AuthController {
  @Autowired
  AuthenticationManager authenticationManager;

  @Autowired
  UserRepository userRepository;

  @Autowired
  PasswordEncoder encoder;

  @Autowired
  JwtUtils jwtUtils;

  @Autowired
  UserProfileService userProfileService;

  @PostMapping("/signin")
  public ResponseEntity<?> authenticateUser(@Valid @RequestBody LoginRequest loginRequest) {

    Authentication authentication = authenticationManager.authenticate(
        new UsernamePasswordAuthenticationToken(loginRequest.getEmail(), loginRequest.getPassword()));

    SecurityContextHolder.getContext().setAuthentication(authentication);
    String jwt = jwtUtils.generateJwtToken(authentication);

    UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
    List<String> roles = userDetails.getAuthorities().stream()
        .map(item -> item.getAuthority())
        .collect(Collectors.toList());

    return ResponseEntity.ok(new JwtResponse(jwt,
        userDetails.getId(),
        userDetails.getEmail(),
        roles));
  }

  @PostMapping("/signup")
  public ResponseEntity<?> registerUser(@Valid @RequestBody SignupRequest signUpRequest) {
    if (userRepository.existsByEmail(signUpRequest.getEmail())) {
      return ResponseEntity
          .badRequest()
          .body(new MessageResponse("Error: Email is already in use!"));
    }

    // Create new user's account
    User user = new User();
    user.setEmail(signUpRequest.getEmail());
    user.setPasswordHash(encoder.encode(signUpRequest.getPassword()));
    user.setFullName(signUpRequest.getFullName());

    User savedUser = userRepository.save(user);

    // Create user profile if profile data is provided
    if (signUpRequest.getTargetCompany() != null ||
        signUpRequest.getTargetRole() != null ||
        signUpRequest.getExperienceLevel() != null) {

      UserProfileRequest profileRequest = new UserProfileRequest();
      profileRequest.setTargetCompany(signUpRequest.getTargetCompany());
      profileRequest.setTargetRole(signUpRequest.getTargetRole());
      profileRequest.setDeadline(signUpRequest.getDeadline());
      profileRequest.setJobDescription(signUpRequest.getJobDescription());
      profileRequest.setExperienceLevel(signUpRequest.getExperienceLevel());

      userProfileService.createProfile(savedUser, profileRequest);
    }

    return ResponseEntity.ok(new MessageResponse("User registered successfully!"));
  }
}
