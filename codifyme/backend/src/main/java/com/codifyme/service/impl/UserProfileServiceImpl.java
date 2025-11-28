package com.codifyme.service.impl;

import com.codifyme.model.User;
import com.codifyme.model.UserProfile;
import com.codifyme.payload.request.UserProfileRequest;
import com.codifyme.payload.response.UserProfileResponse;
import com.codifyme.repository.UserProfileRepository;
import com.codifyme.service.UserProfileService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class UserProfileServiceImpl implements UserProfileService {

    private final UserProfileRepository userProfileRepository;

    @Override
    @Transactional
    public UserProfile createProfile(User user, UserProfileRequest request) {
        UserProfile profile = new UserProfile();
        profile.setUser(user);
        profile.setTargetCompany(request.getTargetCompany());
        profile.setTargetRole(request.getTargetRole());
        profile.setDeadline(request.getDeadline());
        profile.setJobDescription(request.getJobDescription());
        profile.setExperienceLevel(request.getExperienceLevel());

        return userProfileRepository.save(profile);
    }

    @Override
    @Transactional
    public UserProfile updateProfile(Long userId, UserProfileRequest request) {
        UserProfile profile = userProfileRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("Profile not found for user: " + userId));

        profile.setTargetCompany(request.getTargetCompany());
        profile.setTargetRole(request.getTargetRole());
        profile.setDeadline(request.getDeadline());
        profile.setJobDescription(request.getJobDescription());
        profile.setExperienceLevel(request.getExperienceLevel());

        return userProfileRepository.save(profile);
    }

    @Override
    public UserProfileResponse getProfile(Long userId) {
        UserProfile profile = userProfileRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("Profile not found for user: " + userId));

        // Update streak on profile access (simple gamification)
        updateStreak(profile);

        return mapToResponse(profile);
    }

    private void updateStreak(UserProfile profile) {
        java.time.LocalDate today = java.time.LocalDate.now();
        java.time.LocalDate lastActivity = profile.getLastActivityDate();

        if (lastActivity == null) {
            profile.setCurrentStreak(1);
            profile.setLastActivityDate(today);
        } else if (lastActivity.equals(today.minusDays(1))) {
            profile.setCurrentStreak(profile.getCurrentStreak() + 1);
            profile.setLastActivityDate(today);
        } else if (lastActivity.isBefore(today.minusDays(1))) {
            profile.setCurrentStreak(1);
            profile.setLastActivityDate(today);
        } else if (lastActivity.equals(today)) {
            // Already active today, do nothing
        }

        userProfileRepository.save(profile);
    }

    private UserProfileResponse mapToResponse(UserProfile profile) {
        UserProfileResponse response = new UserProfileResponse();
        response.setId(profile.getId());
        response.setTargetCompany(profile.getTargetCompany());
        response.setTargetRole(profile.getTargetRole());
        response.setDeadline(profile.getDeadline());
        response.setResumePath(profile.getResumePath());
        response.setJobDescription(profile.getJobDescription());
        response.setExperienceLevel(profile.getExperienceLevel());
        response.setCurrentStreak(profile.getCurrentStreak());
        return response;
    }
}
