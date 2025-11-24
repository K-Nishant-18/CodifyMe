package com.codifyme.payload.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class InterviewRequest {

    @NotNull(message = "Interview type is required")
    private String type; // "Chat" or "Video"

    @NotBlank(message = "Transcript is required")
    private String transcript;

    @NotBlank(message = "Job role is required")
    private String jobRole;
}
