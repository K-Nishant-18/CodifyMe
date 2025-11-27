package com.codifyme.service;

import com.codifyme.model.User;
import com.codifyme.model.UserProfile;
import com.codifyme.payload.request.UserProfileRequest;
import com.codifyme.payload.response.UserProfileResponse;

public interface UserProfileService {
    UserProfile createProfile(User user, UserProfileRequest request);

    UserProfile updateProfile(Long userId, UserProfileRequest request);

    UserProfileResponse getProfile(Long userId);
}
