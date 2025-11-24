package com.codifyme.repository;

import com.codifyme.model.DailyTask;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DailyTaskRepository extends JpaRepository<DailyTask, Long> {

    List<DailyTask> findByRoadmapId(Long roadmapId);

    List<DailyTask> findByRoadmapIdOrderByDayNumberAsc(Long roadmapId);

    Long countByRoadmapIdAndIsCompletedTrue(Long roadmapId);
}
