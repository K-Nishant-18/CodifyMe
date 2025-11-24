package com.codifyme.service;

import com.codifyme.payload.response.CrackScoreResponse;

public interface CrackScoreService {

    CrackScoreResponse calculateCrackScore(Long userId);

    void updateCrackScore(Long userId);
}
