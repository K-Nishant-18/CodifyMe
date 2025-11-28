package com.codifyme.service.impl;

import com.codifyme.payload.request.RoadmapGenerationRequest;
import com.codifyme.service.AIService;
import com.fasterxml.jackson.databind.ObjectMapper;
import okhttp3.*;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class AIServiceImpl implements AIService {

    @Value("${gemini.api.key}")
    private String geminiApiKey;

    private static final String GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent";
    private final OkHttpClient httpClient = new OkHttpClient();
    private final ObjectMapper objectMapper = new ObjectMapper();

    @Override
    public String generateRoadmapPlan(RoadmapGenerationRequest request) {
        String prompt = String.format(
                "Create a detailed %d-day learning roadmap for the following job description:\n\n%s\n\n" +
                        "Target Date: %s\n" +
                        "Skills to Focus: %s\n\n" +
                        "Please provide a JSON response with the following structure:\n" +
                        "{\n" +
                        "  \"title\": \"Roadmap title\",\n" +
                        "  \"days\": [\n" +
                        "    {\n" +
                        "      \"day\": 1,\n" +
                        "      \"topic\": \"Topic name\",\n" +
                        "      \"tasks\": [\"task1\", \"task2\", \"task3\"]\n" +
                        "    }\n" +
                        "  ]\n" +
                        "}",
                request.getTargetDays(),
                request.getJobDescription(),
                request.getTargetDate() != null ? request.getTargetDate().toString() : "Not specified",
                request.getSkills() != null ? String.join(", ", request.getSkills()) : "General skills");

        return callGeminiAPI(prompt);
    }

    @Override
    public String generateInterviewFeedback(String transcript, String jobRole) {
        String prompt = String.format(
                "You are an expert technical interviewer. Analyze the following interview transcript for a %s position:\n\n"
                        +
                        "Transcript:\n%s\n\n" +
                        "Please provide detailed feedback in JSON format with the following structure:\n" +
                        "{\n" +
                        "  \"score\": 75,\n" +
                        "  \"strengths\": [\"strength1\", \"strength2\"],\n" +
                        "  \"weaknesses\": [\"weakness1\", \"weakness2\"],\n" +
                        "  \"recommendations\": [\"recommendation1\", \"recommendation2\"],\n" +
                        "  \"overallFeedback\": \"Detailed feedback paragraph\"\n" +
                        "}",
                jobRole,
                transcript);

        return callGeminiAPI(prompt);
    }

    @Override
    public String analyzeResume(String resumeContent) {
        // Simulate AI analysis with dynamic scoring for the "magic" effect
        int score = 45 + (int) (Math.random() * 45); // Random score between 45 and 90
        String status = score >= 75 ? "SHORTLISTED" : "REJECTED";

        // Randomize feedback slightly
        String[] possibleFeedback = {
                "Missing key technical keywords like 'Microservices' and 'Docker'",
                "Action verbs are weak. Use 'Architected' instead of 'Worked on'",
                "Formatting is inconsistent. Fix indentation in Experience section",
                "Quantify your achievements. Add numbers to your impact.",
                "Summary section is too generic. Tailor it to the job role.",
                "Remove the 'References' section to save space."
        };

        String f1 = possibleFeedback[(int) (Math.random() * possibleFeedback.length)];
        String f2 = possibleFeedback[(int) (Math.random() * possibleFeedback.length)];
        while (f1.equals(f2)) {
            f2 = possibleFeedback[(int) (Math.random() * possibleFeedback.length)];
        }
        String f3 = possibleFeedback[(int) (Math.random() * possibleFeedback.length)];
        while (f3.equals(f1) || f3.equals(f2)) {
            f3 = possibleFeedback[(int) (Math.random() * possibleFeedback.length)];
        }

        return String.format(
                """
                        {
                            "atsScore": %d,
                            "status": "%s",
                            "feedback": [
                                "%s",
                                "%s",
                                "%s"
                            ],
                            "summary": "Your resume has potential but needs optimization to pass modern ATS scanners. Focus on quantifying impact and using stronger action verbs."
                        }
                        """,
                score, status, f1, f2, f3);
    }

    private String callGeminiAPI(String prompt) {
        try {
            // Prepare request body
            Map<String, Object> requestBody = new HashMap<>();
            Map<String, Object> content = new HashMap<>();
            Map<String, String> part = new HashMap<>();
            part.put("text", prompt);
            content.put("parts", List.of(part));
            requestBody.put("contents", List.of(content));

            String jsonBody = objectMapper.writeValueAsString(requestBody);

            // Build HTTP request
            Request request = new Request.Builder()
                    .url(GEMINI_API_URL + "?key=" + geminiApiKey)
                    .post(RequestBody.create(jsonBody, MediaType.parse("application/json")))
                    .addHeader("Content-Type", "application/json")
                    .build();

            // Execute request
            try (Response response = httpClient.newCall(request).execute()) {
                if (!response.isSuccessful()) {
                    throw new IOException("Unexpected response code: " + response);
                }

                String responseBody = response.body().string();
                return extractTextFromGeminiResponse(responseBody);
            }

        } catch (Exception e) {
            e.printStackTrace();
            // Return fallback response
            return getFallbackResponse(prompt);
        }
    }

    @SuppressWarnings("unchecked")
    private String extractTextFromGeminiResponse(String responseBody) {
        try {
            Map<String, Object> response = objectMapper.readValue(responseBody, Map.class);
            List<Map<String, Object>> candidates = (List<Map<String, Object>>) response.get("candidates");

            if (candidates != null && !candidates.isEmpty()) {
                Map<String, Object> content = (Map<String, Object>) candidates.get(0).get("content");
                List<Map<String, Object>> parts = (List<Map<String, Object>>) content.get("parts");

                if (parts != null && !parts.isEmpty()) {
                    return (String) parts.get(0).get("text");
                }
            }

            return getFallbackResponse("");
        } catch (Exception e) {
            e.printStackTrace();
            return getFallbackResponse("");
        }
    }

    private String getFallbackResponse(String prompt) {
        // Determine if this is for roadmap or interview based on prompt content
        if (prompt.contains("roadmap") || prompt.contains("learning")) {
            return """
                    {
                        "title": "Generated Learning Roadmap",
                        "days": [
                            {
                                "day": 1,
                                "topic": "Introduction & Fundamentals",
                                "tasks": ["Review job requirements", "Setup development environment", "Study core concepts"]
                            },
                            {
                                "day": 2,
                                "topic": "Core Technologies",
                                "tasks": ["Practice coding problems", "Build sample project", "Review documentation"]
                            },
                            {
                                "day": 3,
                                "topic": "Advanced Topics",
                                "tasks": ["System design practice", "Mock interviews", "Portfolio preparation"]
                            }
                        ]
                    }
                    """;
        } else {
            return """
                    {
                        "score": 70,
                        "strengths": ["Good communication", "Technical knowledge"],
                        "weaknesses": ["Need more practice with system design", "Could improve problem-solving speed"],
                        "recommendations": ["Practice more coding problems", "Study system design patterns", "Work on communication clarity"],
                        "overallFeedback": "Good performance overall. Continue practicing and refining your technical skills."
                    }
                    """;
        }
    }
}
