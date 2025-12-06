package com.nird.api.controller;

import com.nird.api.dto.ApiResponse;
import com.nird.api.dto.AuthRequest;
import com.nird.api.dto.RegisterRequest;
import com.nird.api.model.User;
import com.nird.api.repository.UserRepository;
import com.nird.api.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {
    @Autowired
    private AuthService authService;

    @Autowired
    private UserRepository userRepository;

    @PostMapping("/register")
    public ResponseEntity<ApiResponse<Map<String, Object>>> register(@Valid @RequestBody RegisterRequest request) {
        try {
            Map<String, Object> result = authService.register(request);
            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(ApiResponse.success("Inscription réussie! Bienvenue dans NIRD!", result));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ApiResponse.error(e.getMessage()));
        }
    }

    @PostMapping("/login")
    public ResponseEntity<ApiResponse<Map<String, Object>>> login(@Valid @RequestBody AuthRequest request) {
        try {
            Map<String, Object> result = authService.login(request);
            return ResponseEntity.ok(ApiResponse.success("Connexion réussie!", result));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(ApiResponse.error(e.getMessage()));
        }
    }

    @GetMapping("/me")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getMe(Authentication authentication) {
        User user = (User) authentication.getPrincipal();
        user = userRepository.findById(user.getId()).orElseThrow();
        return ResponseEntity.ok(ApiResponse.success(formatUserResponse(user)));
    }

    @PostMapping("/logout")
    public ResponseEntity<ApiResponse<Map<String, Object>>> logout() {
        return ResponseEntity.ok(ApiResponse.success("Déconnexion réussie", new HashMap<>()));
    }

    private Map<String, Object> formatUserResponse(User user) {
        Map<String, Object> response = new HashMap<>();
        response.put("id", user.getId());
        response.put("name", user.getName());
        response.put("email", user.getEmail());
        response.put("role", user.getRole().getValue());
        response.put("permissions", user.getPermissions());
        response.put("avatar", user.getAvatar());
        response.put("bio", user.getBio());
        response.put("roleData", user.getRoleData());
        response.put("xp", user.getXp());
        response.put("level", user.getLevel());
        response.put("badges", user.getBadges());
        response.put("completedSteps", user.getCompletedSteps());
        response.put("quizScores", user.getQuizScores());
        response.put("stats", user.getStats());
        response.put("streak", user.getStreak());
        response.put("preferences", user.getPreferences());
        response.put("isVerified", user.getIsVerified());
        response.put("createdAt", user.getCreatedAt());
        return response;
    }
}

