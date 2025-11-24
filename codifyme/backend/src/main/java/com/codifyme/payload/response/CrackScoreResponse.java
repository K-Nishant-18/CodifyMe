package com.codifyme.payload.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Map;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class CrackScoreResponse {

    private Integer score;
    private Map<String, Object> breakdown;
    private String[] recommendations;
}
