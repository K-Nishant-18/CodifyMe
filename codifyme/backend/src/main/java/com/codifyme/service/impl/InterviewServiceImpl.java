package com.codifyme.service.impl;

import com.codifyme.model.Interview;
import com.codifyme.model.User;
import com.codifyme.payload.request.InterviewRequest;
import com.codifyme.payload.response.InterviewResponse;
import com.codifyme.repository.InterviewRepository;
import com.codifyme.repository.UserRepository;
import com.codifyme.service.AIService;
import com.codifyme.service.CrackScoreService;
import com.codifyme.service.InterviewService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.fasterxml.jackson.databind.ObjectMapper;
import java.util.HashMap;
import java.util.Map;

@Service
public class InterviewServiceImpl implements InterviewService {

    @Autowired
    private InterviewRepository interviewRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private AIService aiService;

    @Autowired
    private CrackScoreService crackScoreService;

    private final ObjectMapper objectMapper = new ObjectMapper();

    @Override
    public InterviewResponse submitInterview(InterviewRequest request, Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Get AI feedback
        String feedbackJson = aiService.generateInterviewFeedback(request.getTranscript(), request.getJobRole());

        // Parse feedback to extract score
        int score = extractScoreFromFeedback(feedbackJson);

        // Create interview entity
        Interview interview = new Interview();
        interview.setUser(user);
        interview.setType(Interview.InterviewType.valueOf(request.getType()));
        interview.setTranscript(request.getTranscript());
        interview.setAiFeedbackJson(feedbackJson);
        interview.setScore(score);

        // Save interview
        interview = interviewRepository.save(interview);

        // Update user's CrackScore
        crackScoreService.updateCrackScore(userId);

        // Return response
        return new InterviewResponse(
                interview.getId(),
                interview.getType().name(),
                interview.getScore(),
                feedbackJson,
                interview.getCreatedAt());
    }

    @Override
    public Interview getInterviewById(Long id) {
        return interviewRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Interview not found"));
    }

    private int extractScoreFromFeedback(String feedbackJson) {
        try {
            Map<String, Object> feedback = objectMapper.readValue(feedbackJson, Map.class);
            Object scoreObj = feedback.get("score");
            if (scoreObj instanceof Integer) {
                return (Integer) scoreObj;
            } else if (scoreObj instanceof Double) {
                return ((Double) scoreObj).intValue();
            }
            return 50; // Default score
        } catch (Exception e) {
            return 50; // Default score on error
        }
    }
}
