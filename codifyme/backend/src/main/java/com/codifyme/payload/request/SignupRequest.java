package com.codifyme.payload.request;

import com.codifyme.model.UserProfile.ExperienceLevel;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

import java.time.LocalDate;

@Data
public class SignupRequest {
    @NotBlank
    @Size(max = 50)
    @Email
    private String email;

    @NotBlank
    @Size(min = 6, max = 40)
    private String password;

    private String fullName;

    // Profile fields
    private String targetCompany;
    private String targetRole;
    private LocalDate deadline;
    private String jobDescription;
    private ExperienceLevel experienceLevel;
}
