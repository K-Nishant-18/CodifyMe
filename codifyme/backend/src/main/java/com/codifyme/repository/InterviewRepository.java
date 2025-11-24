package com.codifyme.repository;

import com.codifyme.model.Interview;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface InterviewRepository extends JpaRepository<Interview, Long> {

    List<Interview> findByUserId(Long userId);

    List<Interview> findByUserIdOrderByCreatedAtDesc(Long userId);

    Long countByUserId(Long userId);
}
