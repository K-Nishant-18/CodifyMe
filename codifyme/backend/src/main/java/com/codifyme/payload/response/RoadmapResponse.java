package com.codifyme.payload.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class RoadmapResponse {
    private Long id;
    private String title;
    private String jobDescription;
    private LocalDate targetDate;
    private String aiGeneratedPlan;
    private String status;
}
