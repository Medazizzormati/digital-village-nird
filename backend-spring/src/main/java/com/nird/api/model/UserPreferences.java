package com.nird.api.model;

import jakarta.persistence.Embeddable;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Embeddable
@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserPreferences {
    private String language = "fr";
    private String theme = "dark";
    private Boolean emailNotifications = true;
    private Boolean pushNotifications = true;
}

