package com.codifyme.controller;

import com.codifyme.model.Roadmap;
import com.codifyme.model.User;
import com.codifyme.repository.RoadmapRepository;
import com.codifyme.repository.UserRepository;
import com.codifyme.security.services.UserDetailsImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/roadmap")
public class RoadmapController {

    @Autowired
    RoadmapRepository roadmapRepository;

    @Autowired
    UserRepository userRepository;

    @GetMapping("/my-roadmaps")
    public ResponseEntity<List<Roadmap>> getUserRoadmaps() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();

        List<Roadmap> roadmaps = roadmapRepository.findByUserId(userDetails.getId());
        return ResponseEntity.ok(roadmaps);
    }

    @PostMapping("/create")
    public ResponseEntity<?> createRoadmap(@RequestBody Roadmap roadmapRequest) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();

        User user = userRepository.findById(userDetails.getId())
                .orElseThrow(() -> new RuntimeException("Error: User not found."));

        Roadmap roadmap = new Roadmap();
        roadmap.setUser(user);
        roadmap.setJobTitle(roadmapRequest.getJobTitle());
        roadmap.setTargetDate(roadmapRequest.getTargetDate());
        roadmap.setStatus(Roadmap.RoadmapStatus.Active);

        roadmapRepository.save(roadmap);

        return ResponseEntity.ok("Roadmap created successfully!");
    }

    @Autowired
    com.codifyme.service.AIService aiService;

    @PostMapping("/generate")
    public ResponseEntity<?> generateRoadmap(
            @RequestBody com.codifyme.payload.request.RoadmapGenerationRequest request) {
        String planJson = aiService.generateRoadmapPlan(request);
        // In a real app, we would parse this JSON and save it as DailyTasks
        return ResponseEntity.ok(planJson);
    }
}
