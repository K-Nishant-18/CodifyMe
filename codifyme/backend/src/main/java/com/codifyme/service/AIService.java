package com.codifyme.service;

import com.codifyme.model.Roadmap;
import com.codifyme.payload.request.RoadmapGenerationRequest;

public interface AIService {
    String generateRoadmapPlan(RoadmapGenerationRequest request);

    String generateInterviewFeedback(String transcript, String jobRole);
}
