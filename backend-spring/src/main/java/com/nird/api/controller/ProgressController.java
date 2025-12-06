package com.nird.api.controller;

import com.nird.api.dto.ApiResponse;
import com.nird.api.model.Badge;
import com.nird.api.model.QuizScore;
import com.nird.api.model.User;
import com.nird.api.repository.UserRepository;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/progress")
@CrossOrigin(origins = "*")
public class ProgressController {
    @Autowired
    private UserRepository userRepository;

    @GetMapping
    public ResponseEntity<ApiResponse<Map<String, Object>>> getProgress(Authentication authentication) {
        User user = (User) authentication.getPrincipal();
        user = userRepository.findById(user.getId()).orElseThrow();

        Map<String, Object> data = new HashMap<>();
        data.put("completedSteps", user.getCompletedSteps());
        data.put("xp", user.getXp());
        data.put("level", user.getLevel());
        data.put("badges", user.getBadges());
        data.put("quizScores", user.getQuizScores());
        data.put("streak", user.getStreak());

        return ResponseEntity.ok(ApiResponse.success(data));
    }

    @PostMapping("/step/{stepId}")
    public ResponseEntity<ApiResponse<Map<String, Object>>> completeStep(
            @PathVariable Integer stepId, Authentication authentication) {
        User user = (User) authentication.getPrincipal();
        user = userRepository.findById(user.getId()).orElseThrow();

        if (stepId < 1 || stepId > 5) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("Étape invalide"));
        }

        if (user.getCompletedSteps().contains(stepId)) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("Cette étape est déjà complétée"));
        }

        user.getCompletedSteps().add(stepId);
        int xpGained = 200;
        user.addXP(xpGained);

        // Vérifier les badges
        List<String> newBadges = checkBadges(user, stepId);

        updateStreak(user);
        user.setUpdatedAt(LocalDateTime.now());
        user = userRepository.save(user);

        Map<String, Object> data = new HashMap<>();
        data.put("completedSteps", user.getCompletedSteps());
        data.put("xp", user.getXp());
        data.put("level", user.getLevel());
        data.put("xpGained", xpGained);
        data.put("newBadges", newBadges);
        data.put("badges", user.getBadges());
        data.put("streak", user.getStreak());

        return ResponseEntity.ok(ApiResponse.success("Étape " + stepId + " complétée! +" + xpGained + " XP", data));
    }

    @PostMapping("/quiz")
    public ResponseEntity<ApiResponse<Map<String, Object>>> saveQuizScore(
            @Valid @RequestBody Map<String, Integer> request, Authentication authentication) {
        User user = (User) authentication.getPrincipal();
        user = userRepository.findById(user.getId()).orElseThrow();

        Integer stage = request.get("stage");
        Integer score = request.get("score");
        Integer totalQuestions = request.get("totalQuestions");

        QuizScore quizScore = new QuizScore();
        quizScore.setStage(stage);
        quizScore.setScore(score);
        quizScore.setTotalQuestions(totalQuestions);
        quizScore.setUser(user);
        quizScore.setCompletedAt(LocalDateTime.now());
        user.getQuizScores().add(quizScore);

        // Calculer XP
        double percentage = (score.doubleValue() / totalQuestions) * 100;
        int xpGained = stage * 10 * score;
        if (percentage == 100) {
            xpGained += 100;
        } else if (percentage >= 80) {
            xpGained += 50;
        }

        user.addXP(xpGained);
        user.getStats().setTotalQuizzesTaken(user.getStats().getTotalQuizzesTaken() + 1);
        user.getStats().setTotalCorrectAnswers(user.getStats().getTotalCorrectAnswers() + score);

        updateStreak(user);
        user.setUpdatedAt(LocalDateTime.now());
        user = userRepository.save(user);

        Map<String, Object> data = new HashMap<>();
        data.put("quizScores", user.getQuizScores());
        data.put("xp", user.getXp());
        data.put("level", user.getLevel());
        data.put("xpGained", xpGained);
        data.put("streak", user.getStreak());

        return ResponseEntity.ok(ApiResponse.success("Quiz stage " + stage + " sauvegardé! +" + xpGained + " XP", data));
    }

    @GetMapping("/leaderboard")
    public ResponseEntity<ApiResponse<List<Map<String, Object>>>> getLeaderboard(
            @RequestParam(defaultValue = "10") Integer limit) {
        List<User> users = userRepository.findTopByOrderByXpDesc(PageRequest.of(0, limit));

        List<Map<String, Object>> leaderboard = users.stream().map((user, index) -> {
            Map<String, Object> entry = new HashMap<>();
            entry.put("rank", index + 1);
            entry.put("name", user.getName());
            entry.put("role", user.getRole().getValue());
            entry.put("xp", user.getXp());
            entry.put("level", user.getLevel());
            entry.put("badgeCount", user.getBadges().size());
            entry.put("completedSteps", user.getCompletedSteps().size());
            return entry;
        }).collect(Collectors.toList());

        return ResponseEntity.ok(ApiResponse.success(leaderboard));
    }

    @GetMapping("/stats")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getGlobalStats() {
        List<User> allUsers = userRepository.findAll();
        
        long totalUsers = allUsers.size();
        long totalXP = allUsers.stream().mapToLong(User::getXp).sum();
        double avgCompletion = allUsers.stream()
                .mapToDouble(u -> (u.getCompletedSteps().size() / 5.0) * 100)
                .average()
                .orElse(0.0);

        Map<String, Object> data = new HashMap<>();
        data.put("totalUsers", totalUsers);
        data.put("totalXP", totalXP);
        data.put("avgCompletion", Math.round(avgCompletion));
        data.put("totalSteps", 5);

        return ResponseEntity.ok(ApiResponse.success(data));
    }

    private List<String> checkBadges(User user, Integer stepId) {
        List<String> newBadges = new java.util.ArrayList<>();
        
        if (user.getCompletedSteps().size() == 1 && !hasBadge(user, "pioneer")) {
            addBadge(user, "pioneer", "Pionnier", "Première étape complétée!", Badge.BadgeRarity.COMMON);
            newBadges.add("pioneer");
        }
        
        if (user.getCompletedSteps().size() >= 3 && !hasBadge(user, "explorer")) {
            addBadge(user, "explorer", "Explorateur", "3 étapes complétées!", Badge.BadgeRarity.RARE);
            newBadges.add("explorer");
        }
        
        if (user.getCompletedSteps().size() == 5 && !hasBadge(user, "master")) {
            addBadge(user, "master", "Maître", "Toutes les étapes complétées!", Badge.BadgeRarity.EPIC);
            newBadges.add("master");
        }
        
        if (stepId == 4 && !hasBadge(user, "secure")) {
            addBadge(user, "secure", "Sécurisé", "Étape sécurité complétée!", Badge.BadgeRarity.RARE);
            newBadges.add("secure");
        }
        
        if (stepId == 5 && !hasBadge(user, "eco-warrior")) {
            addBadge(user, "eco-warrior", "Éco-Guerrier", "Étape durabilité complétée!", Badge.BadgeRarity.EPIC);
            newBadges.add("eco-warrior");
        }
        
        return newBadges;
    }

    private boolean hasBadge(User user, String badgeId) {
        return user.getBadges().stream().anyMatch(b -> b.getBadgeId().equals(badgeId));
    }

    private void addBadge(User user, String badgeId, String name, String description, Badge.BadgeRarity rarity) {
        Badge badge = new Badge();
        badge.setBadgeId(badgeId);
        badge.setName(name);
        badge.setDescription(description);
        badge.setRarity(rarity);
        badge.setUser(user);
        user.getBadges().add(badge);
    }

    private void updateStreak(User user) {
        LocalDateTime now = LocalDateTime.now();
        LocalDateTime lastActivity = user.getStreak().getLastActivity();
        long diffDays = java.time.Duration.between(lastActivity, now).toDays();

        if (diffDays == 0) {
            return;
        } else if (diffDays == 1) {
            user.getStreak().setCurrent(user.getStreak().getCurrent() + 1);
            if (user.getStreak().getCurrent() > user.getStreak().getBest()) {
                user.getStreak().setBest(user.getStreak().getCurrent());
            }
        } else {
            user.getStreak().setCurrent(1);
        }

        user.getStreak().setLastActivity(now);
    }
}

