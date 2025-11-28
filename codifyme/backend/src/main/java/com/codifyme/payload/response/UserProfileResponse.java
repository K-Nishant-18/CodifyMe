package com.codifyme.payload.response;

import com.codifyme.model.UserProfile.ExperienceLevel;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class UserProfileResponse {

    private Long id;
    private String targetCompany;
    private String targetRole;
    private LocalDate deadline;
    private String resumePath;
    private String jobDescription;
    private ExperienceLevel experienceLevel;
    private int currentStreak;
}
