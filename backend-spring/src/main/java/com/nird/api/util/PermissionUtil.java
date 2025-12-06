package com.nird.api.util;

import com.nird.api.model.Role;

import java.util.*;

public class PermissionUtil {
    private static final Map<Role, List<String>> PERMISSIONS = new HashMap<>();

    static {
        PERMISSIONS.put(Role.STUDENT, Arrays.asList(
            "view_content", "take_quiz", "track_progress", "view_leaderboard",
            "earn_badges", "view_resources"
        ));
        PERMISSIONS.put(Role.TEACHER, Arrays.asList(
            "view_content", "take_quiz", "track_progress", "view_leaderboard",
            "earn_badges", "view_resources", "create_class", "manage_students",
            "view_student_progress", "create_custom_quiz", "export_reports"
        ));
        PERMISSIONS.put(Role.DIRECTOR, Arrays.asList(
            "view_content", "take_quiz", "track_progress", "view_leaderboard",
            "earn_badges", "view_resources", "view_all_progress", "view_statistics",
            "manage_teachers", "manage_establishment", "export_reports", "view_analytics"
        ));
        PERMISSIONS.put(Role.PUBLIC, Arrays.asList(
            "view_content", "take_quiz", "track_progress", "view_leaderboard",
            "earn_badges", "view_resources"
        ));
        PERMISSIONS.put(Role.ADMIN, Arrays.asList(
            "view_content", "take_quiz", "track_progress", "view_leaderboard",
            "earn_badges", "view_resources", "manage_users", "manage_content",
            "view_all_statistics", "manage_quizzes", "manage_badges", "moderate_content"
        ));
        PERMISSIONS.put(Role.SUPER_ADMIN, Arrays.asList("*"));
    }

    public static List<String> getPermissionsForRole(Role role) {
        return PERMISSIONS.getOrDefault(role, PERMISSIONS.get(Role.PUBLIC));
    }
}

