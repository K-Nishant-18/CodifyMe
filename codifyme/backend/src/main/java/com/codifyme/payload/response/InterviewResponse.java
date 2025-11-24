package com.codifyme.payload.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class InterviewResponse {

    private Long id;
    private String type;
    private Integer score;
    private String feedback;
    private LocalDateTime createdAt;
}
