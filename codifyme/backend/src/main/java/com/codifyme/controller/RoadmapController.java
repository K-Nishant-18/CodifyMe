package com.codifyme.controller;

import com.codifyme.model.DailyTask;
import com.codifyme.model.Roadmap;
import com.codifyme.model.User;
import com.codifyme.payload.request.RoadmapGenerationRequest;
import com.codifyme.payload.response.RoadmapResponse;
import com.codifyme.repository.DailyTaskRepository;
import com.codifyme.repository.RoadmapRepository;
import com.codifyme.repository.UserRepository;
import com.codifyme.security.services.UserDetailsImpl;
import com.codifyme.service.AIService;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/roadmap")
public class RoadmapController {

    @Autowired
    RoadmapRepository roadmapRepository;

    @Autowired
    UserRepository userRepository;

    @Autowired
    DailyTaskRepository dailyTaskRepository;

    @Autowired
    AIService aiService;

    @GetMapping("/my-roadmaps")
    public ResponseEntity<List<RoadmapResponse>> getUserRoadmaps() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();

        List<Roadmap> roadmaps = roadmapRepository.findByUserId(userDetails.getId());

        // Convert to DTOs to avoid lazy loading serialization issues
        List<RoadmapResponse> responses = roadmaps.stream()
                .map(roadmap -> {
                    RoadmapResponse response = new RoadmapResponse();
                    response.setId(roadmap.getId());
                    response.setTitle(roadmap.getTitle());
                    response.setJobDescription(roadmap.getJobDescription());
                    response.setTargetDate(roadmap.getTargetDate());
                    response.setAiGeneratedPlan(roadmap.getAiGeneratedPlan());
                    response.setStatus(roadmap.getStatus().toString());
                    return response;
                })
                .collect(java.util.stream.Collectors.toList());

        return ResponseEntity.ok(responses);
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getRoadmapById(@PathVariable Long id) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();

        Roadmap roadmap = roadmapRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Roadmap not found"));

        // Verify ownership
        if (!roadmap.getUser().getId().equals(userDetails.getId())) {
            return ResponseEntity.status(403).body("Access denied");
        }

        // Return DTO to avoid lazy loading serialization issues
        RoadmapResponse response = new RoadmapResponse();
        response.setId(roadmap.getId());
        response.setTitle(roadmap.getTitle());
        response.setJobDescription(roadmap.getJobDescription());
        response.setTargetDate(roadmap.getTargetDate());
        response.setAiGeneratedPlan(roadmap.getAiGeneratedPlan());
        response.setStatus(roadmap.getStatus().toString());

        return ResponseEntity.ok(response);
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

        return ResponseEntity.ok(roadmap);
    }

    @PostMapping("/generate")
    public ResponseEntity<?> generateRoadmap(@RequestBody RoadmapGenerationRequest request) {
        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();

            User user = userRepository.findById(userDetails.getId())
                    .orElseThrow(() -> new RuntimeException("Error: User not found."));

            // Generate AI plan
            String planJson = aiService.generateRoadmapPlan(request);

            // Create roadmap
            Roadmap roadmap = new Roadmap();
            roadmap.setUser(user);
            roadmap.setTitle(request.getTitle());
            roadmap.setJobTitle(request.getTitle());
            roadmap.setJobDescription(request.getJobDescription());
            roadmap.setTargetDate(request.getTargetDate());
            roadmap.setAiGeneratedPlan(planJson);
            roadmap.setStatus(Roadmap.RoadmapStatus.Active);

            roadmapRepository.save(roadmap);

            // Parse AI plan and create daily tasks
            try {
                ObjectMapper mapper = new ObjectMapper();
                JsonNode root = mapper.readTree(planJson);

                if (root.has("dailyPlan") && root.get("dailyPlan").isArray()) {
                    int dayNumber = 1;
                    for (JsonNode taskNode : root.get("dailyPlan")) {
                        DailyTask task = new DailyTask();
                        task.setRoadmap(roadmap);
                        task.setDayNumber(dayNumber++);
                        task.setTitle(taskNode.has("title") ? taskNode.get("title").asText() : "Day " + dayNumber);
                        task.setDescription(taskNode.has("description") ? taskNode.get("description").asText() : "");
                        task.setResources(taskNode.has("resources") ? taskNode.get("resources").asText() : "");
                        task.setCompleted(false);

                        dailyTaskRepository.save(task);
                    }
                }
            } catch (Exception e) {
                System.err.println("Error parsing AI plan: " + e.getMessage());
                // Continue even if parsing fails - at least we have the roadmap
            }

            // Return roadmap response
            RoadmapResponse response = new RoadmapResponse();
            response.setId(roadmap.getId());
            response.setTitle(roadmap.getTitle());
            response.setJobDescription(roadmap.getJobDescription());
            response.setTargetDate(roadmap.getTargetDate());
            response.setAiGeneratedPlan(roadmap.getAiGeneratedPlan());
            response.setStatus(roadmap.getStatus().toString());

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error generating roadmap: " + e.getMessage());
        }
    }
}
