package com.codifyme.repository;

import com.codifyme.model.UserActivity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface UserActivityRepository extends JpaRepository<UserActivity, Long> {
    Optional<UserActivity> findByUserIdAndActivityDate(Long userId, LocalDate activityDate);

    List<UserActivity> findByUserIdAndActivityDateAfter(Long userId, LocalDate date);
}
