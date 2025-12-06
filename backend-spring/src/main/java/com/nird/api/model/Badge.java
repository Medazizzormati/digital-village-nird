package com.nird.api.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "badges")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Badge {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String badgeId;

    private String name;
    private String description;

    @Enumerated(EnumType.STRING)
    private BadgeRarity rarity;

    @Column(nullable = false)
    private LocalDateTime unlockedAt = LocalDateTime.now();

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;

    public enum BadgeRarity {
        COMMON, RARE, EPIC, LEGENDARY
    }
}

