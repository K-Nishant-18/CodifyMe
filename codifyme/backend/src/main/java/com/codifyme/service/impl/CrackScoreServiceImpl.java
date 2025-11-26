package com.codifyme.service.impl;

import com.codifyme.model.User;
import com.codifyme.payload.response.CrackScoreResponse;
import com.codifyme.repository.DailyTaskRepository;
import com.codifyme.repository.InterviewRepository;
import com.codifyme.repository.RoadmapRepository;
import com.codifyme.repository.UserRepository;
import com.codifyme.service.CrackScoreService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

@Service
public class CrackScoreServiceImpl implements CrackScoreService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RoadmapRepository roadmapRepository;

    @Autowired
    private DailyTaskRepository dailyTaskRepository;

    @Autowired
    private InterviewRepository interviewRepository;

    @Override
    public CrackScoreResponse calculateCrackScore(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Get user statistics
        Long totalRoadmaps = roadmapRepository.countByUserId(userId);
        Long totalInterviews = interviewRepository.countByUserId(userId);

        // Calculate component scores
        int roadmapScore = calculateRoadmapScore(userId);
        int interviewScore = calculateInterviewScore(userId);
        int consistencyScore = calculateConsistencyScore(userId);

        // Weighted average: 40% roadmap, 40% interview, 20% consistency
        int totalScore = (int) Math.round(
                roadmapScore * 0.4 +
                        interviewScore * 0.4 +
                        consistencyScore * 0.2);

        // Create breakdown
        Map<String, Object> breakdown = new HashMap<>();
        breakdown.put("roadmapScore", roadmapScore);
        breakdown.put("interviewScore", interviewScore);
        breakdown.put("consistencyScore", consistencyScore);
        breakdown.put("totalRoadmaps", totalRoadmaps);
        breakdown.put("totalInterviews", totalInterviews);

        // Generate recommendations
        String[] recommendations = generateRecommendations(roadmapScore, interviewScore, consistencyScore);

        return new CrackScoreResponse(totalScore, breakdown, recommendations);
    }

    @Override
    public void updateCrackScore(Long userId) {
        CrackScoreResponse scoreResponse = calculateCrackScore(userId);
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        user.setCrackScore(scoreResponse.getScore());
        userRepository.save(user);
    }

    private int calculateRoadmapScore(Long userId) {
        Long totalRoadmaps = roadmapRepository.countByUserId(userId);
        if (totalRoadmaps == 0)
            return 0;

        // Calculate completion rate across all roadmaps
        var roadmaps = roadmapRepository.findByUserId(userId);
        int totalTasks = 0;
        int completedTasks = 0;

        for (var roadmap : roadmaps) {
            var tasks = dailyTaskRepository.findByRoadmapId(roadmap.getId());
            totalTasks += tasks.size();
            completedTasks += (int) tasks.stream().filter(t -> t.getCompleted()).count();
        }

        if (totalTasks == 0)
            return 30; // Base score for creating roadmap

        double completionRate = (double) completedTasks / totalTasks;
        return (int) Math.round(30 + (completionRate * 70)); // 30-100 range
    }

    private int calculateInterviewScore(Long userId) {
        var interviews = interviewRepository.findByUserId(userId);
        if (interviews.isEmpty())
            return 0;

        // Average of all interview scores
        double avgScore = interviews.stream()
                .filter(i -> i.getScore() != null)
                .mapToInt(i -> i.getScore())
                .average()
                .orElse(0.0);

        return (int) Math.round(avgScore);
    }

    private int calculateConsistencyScore(Long userId) {
        Long totalInterviews = interviewRepository.countByUserId(userId);
        Long totalRoadmaps = roadmapRepository.countByUserId(userId);

        // Reward consistent activity
        int activityScore = Math.min(100, (int) ((totalInterviews + totalRoadmaps) * 10));

        return activityScore;
    }

    private String[] generateRecommendations(int roadmapScore, int interviewScore, int consistencyScore) {
        var recommendations = new java.util.ArrayList<String>();

        if (roadmapScore < 50) {
            recommendations.add("Complete more tasks in your roadmap to improve your preparation score");
        }

        if (interviewScore < 50) {
            recommendations.add("Practice more interviews to improve your performance score");
        }

        if (consistencyScore < 50) {
            recommendations.add("Maintain consistent daily activity to build momentum");
        }

        if (roadmapScore >= 80 && interviewScore >= 80) {
            recommendations.add("Excellent progress! You're ready to apply for positions");
        }

        if (recommendations.isEmpty()) {
            recommendations.add("Keep up the good work! Continue practicing regularly");
        }

        return recommendations.toArray(new String[0]);
    }
}
