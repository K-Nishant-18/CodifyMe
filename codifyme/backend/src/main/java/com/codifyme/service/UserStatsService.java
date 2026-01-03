package com.codifyme.service;

import com.codifyme.model.User;
import com.codifyme.model.UserActivity;
import com.codifyme.repository.UserActivityRepository;
import com.codifyme.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class UserStatsService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private UserActivityRepository userActivityRepository;

    @Transactional
    public void logActivity(User user) {
        LocalDate today = LocalDate.now();

        // Update Activity Log
        UserActivity activity = userActivityRepository.findByUserIdAndActivityDate(user.getId(), today)
                .orElse(new UserActivity(null, user, today, 0));

        activity.incrementCount();
        userActivityRepository.save(activity);

        // Update Streak
        updateStreak(user, today);
    }

    private void updateStreak(User user, LocalDate today) {
        // Simple streak logic: if last activity was yesterday, increment streak.
        // If last activity was today, do nothing.
        // If last activity was before yesterday, reset to 1.

        // We need to store "lastActivityDate" in User to do this efficiently,
        // or query the activity log. Let's query the log for yesterday.

        // Optimization: Add lastActivityDate to User entity in future.
        // For now, let's just assume if we are logging activity, we check if we need to
        // increment.

        // Actually, let's just rely on the dayStreak field in User.
        // But we need to know WHEN it was last updated.
        // Let's use the updatedAt timestamp of the User entity as a proxy, or better,
        // check the activity log.

        // Alternative: Check if activity exists for yesterday.
        boolean activeYesterday = userActivityRepository.findByUserIdAndActivityDate(user.getId(), today.minusDays(1))
                .isPresent();
        boolean activeTodayAlready = userActivityRepository.findByUserIdAndActivityDate(user.getId(), today)
                .map(a -> a.getCount() > 1).orElse(false);

        if (!activeTodayAlready) {
            if (activeYesterday) {
                user.setDayStreak(user.getDayStreak() + 1);
            } else {
                // If not active yesterday, and this is the first activity of today, reset to 1
                // But wait, if we just logged activity, count is at least 1.
                // If count was 0 before this call (meaning this is first activity), and no
                // activity yesterday, reset.
                // Since we just saved activity with count incremented, we can check if count ==
                // 1.
                // But we don't have the previous state easily.

                // Let's simplify:
                // If user has activity yesterday, streak = streak + 1 (only if we haven't
                // already incremented for today)
                // We need a way to know if we already incremented for today.
                // Maybe we can just recalculate streak based on consecutive days in activity
                // log? Expensive.

                // Let's just stick to: If no activity yesterday, streak = 1.
                // If activity yesterday, streak++.
                // BUT only once per day.

                // We can check if 'updatedAt' was today.
                boolean updatedToday = user.getUpdatedAt().toLocalDate().equals(today);

                if (!updatedToday) {
                    if (activeYesterday) {
                        user.setDayStreak(user.getDayStreak() + 1);
                    } else {
                        user.setDayStreak(1);
                    }
                }
            }
            userRepository.save(user);
        }
    }

    @Transactional
    public void incrementTasksCompleted(Long userId) {
        User user = userRepository.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));
        user.setTasksCompleted(user.getTasksCompleted() + 1);
        user.setCrackScore(user.getCrackScore() + 10); // +10 points for task
        userRepository.save(user);
        logActivity(user);
    }

    @Transactional
    public void incrementInterviewsCompleted(Long userId) {
        User user = userRepository.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));
        user.setInterviewsCompleted(user.getInterviewsCompleted() + 1);
        user.setCrackScore(user.getCrackScore() + 50); // +50 points for interview
        userRepository.save(user);
        logActivity(user);
    }

    public Map<String, Integer> getActivityLog(Long userId) {
        LocalDate thirtyDaysAgo = LocalDate.now().minusDays(30);
        List<UserActivity> activities = userActivityRepository.findByUserIdAndActivityDateAfter(userId, thirtyDaysAgo);

        return activities.stream()
                .collect(Collectors.toMap(
                        a -> a.getActivityDate().toString(),
                        UserActivity::getCount));
    }
}
