package com.codifyme.service;

import com.codifyme.model.Interview;
import com.codifyme.payload.request.InterviewRequest;
import com.codifyme.payload.response.InterviewResponse;

public interface InterviewService {

    InterviewResponse submitInterview(InterviewRequest request, Long userId);

    Interview getInterviewById(Long id);
}
