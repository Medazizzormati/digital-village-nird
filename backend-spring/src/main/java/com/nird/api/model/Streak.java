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
public class Streak {
    private Integer current = 0;
    private Integer best = 0;
    private LocalDateTime lastActivity = LocalDateTime.now();
}

