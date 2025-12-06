package com.nird.api.model;

import jakarta.persistence.Embeddable;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Embeddable
@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserStats {
    private Integer totalQuizzesTaken = 0;
    private Integer totalCorrectAnswers = 0;
    private Integer totalTimeSpent = 0; // en minutes
    private Integer loginCount = 0;
    private LocalDateTime lastLogin;
}

