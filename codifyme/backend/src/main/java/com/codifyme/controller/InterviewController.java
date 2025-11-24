package com.codifyme.controller;

import com.codifyme.model.Interview;
import com.codifyme.payload.request.InterviewRequest;
import com.codifyme.payload.response.InterviewResponse;
import com.codifyme.repository.InterviewRepository;
import com.codifyme.security.services.UserDetailsImpl;
import com.codifyme.service.InterviewService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/interviews")
public class InterviewController {

    @Autowired
    private InterviewService interviewService;

    @Autowired
    private InterviewRepository interviewRepository;

    @PostMapping("/submit")
    public ResponseEntity<InterviewResponse> submitInterview(@Valid @RequestBody InterviewRequest request) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();

        InterviewResponse response = interviewService.submitInterview(request, userDetails.getId());
        return ResponseEntity.ok(response);
    }

    @GetMapping("/history")
    public ResponseEntity<List<InterviewResponse>> getInterviewHistory() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();

        List<Interview> interviews = interviewRepository.findByUserIdOrderByCreatedAtDesc(userDetails.getId());
        List<InterviewResponse> response = interviews.stream()
                .map(interview -> new InterviewResponse(
                        interview.getId(),
                        interview.getType().name(),
                        interview.getScore(),
                        interview.getAiFeedbackJson(),
                        interview.getCreatedAt()))
                .collect(Collectors.toList());

        return ResponseEntity.ok(response);
    }

    @GetMapping("/{id}")
    public ResponseEntity<InterviewResponse> getInterviewById(@PathVariable Long id) {
        Interview interview = interviewService.getInterviewById(id);

        InterviewResponse response = new InterviewResponse(
                interview.getId(),
                interview.getType().name(),
                interview.getScore(),
                interview.getAiFeedbackJson(),
                interview.getCreatedAt());

        return ResponseEntity.ok(response);
    }
}
