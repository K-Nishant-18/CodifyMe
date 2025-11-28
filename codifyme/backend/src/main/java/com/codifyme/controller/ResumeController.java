package com.codifyme.controller;

import com.codifyme.service.AIService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.Map;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/resume")
public class ResumeController {

    @Autowired
    private AIService aiService;

    @PostMapping("/analyze")
    public ResponseEntity<?> analyzeResume(@RequestParam("file") MultipartFile file) {
        try {
            // In a real implementation, we would extract text from the PDF/DOCX file here.
            // For now, we'll just pass a placeholder since the service simulates the
            // analysis.
            String resumeContent = "Simulated content for " + file.getOriginalFilename();

            String analysisResult = aiService.analyzeResume(resumeContent);

            // The result is already a JSON string, so we can return it directly
            // But to be safe and return a proper JSON object, we'll wrap it or let Spring
            // handle it if it's a Map.
            // Since it's a String, we'll return it as a raw string with JSON content type,
            // or parse it into a Map if we want Spring to serialize it.
            // Let's return it as a raw string which the frontend can parse.

            return ResponseEntity.ok()
                    .header("Content-Type", "application/json")
                    .body(analysisResult);

        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", "Error analyzing resume: " + e.getMessage()));
        }
    }
}
