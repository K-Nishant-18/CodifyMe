package com.codifyme.payload.request;

import com.codifyme.model.UserProfile.ExperienceLevel;
import lombok.Data;

import java.time.LocalDate;

@Data
public class UserProfileRequest {
    private String targetCompany;
    private String targetRole;
    private LocalDate deadline;
    private String jobDescription;
    private ExperienceLevel experienceLevel;
}
