package com.codifyme.repository;

import com.codifyme.model.Roadmap;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RoadmapRepository extends JpaRepository<Roadmap, Long> {

    List<Roadmap> findByUserId(Long userId);

    Long countByUserId(Long userId);
}
