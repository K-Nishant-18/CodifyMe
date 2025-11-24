package com.codifyme.payload.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

import java.time.LocalDate;
import java.util.List;

@Data
public class RoadmapGenerationRequest {

    @NotBlank(message = "Job description is required")
    private String jobDescription;

    private String currentSkillLevel; // e.g., Beginner, Intermediate, Advanced

    private int targetDays = 30; // Default 30 days

    private LocalDate targetDate;

    private List<String> skills;
}
