package com.codifyme.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "roadmaps")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Roadmap {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(nullable = false)
    private String jobTitle;

    private LocalDate targetDate;

    @Enumerated(EnumType.STRING)
    private RoadmapStatus status = RoadmapStatus.Active;

    @CreationTimestamp
    private LocalDateTime createdAt;

    public enum RoadmapStatus {
        Active, Completed, Abandoned
    }
}
