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

        return mapToResponse(profile);
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
        return response;
    }
}
