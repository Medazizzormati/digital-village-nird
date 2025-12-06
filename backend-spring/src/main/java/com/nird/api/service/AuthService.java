package com.nird.api.service;

import com.nird.api.config.JwtUtil;
import com.nird.api.dto.AuthRequest;
import com.nird.api.dto.RegisterRequest;
import com.nird.api.model.Badge;
import com.nird.api.model.Role;
import com.nird.api.model.User;
import com.nird.api.repository.UserRepository;
import com.nird.api.util.PermissionUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@Service
public class AuthService {
    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private JwtUtil jwtUtil;

    @Transactional
    public Map<String, Object> register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Cet email est déjà utilisé");
        }

        // Empêcher la création d'admin via inscription publique
        Role userRole = request.getRole();
        if (userRole == Role.ADMIN || userRole == Role.SUPER_ADMIN) {
            userRole = Role.PUBLIC;
        }

        User user = new User();
        user.setName(request.getName());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRole(userRole);
        user.setRoleData(request.getRoleData());
        user.setXp(100); // Bonus d'inscription
        user.setPermissions(PermissionUtil.getPermissionsForRole(userRole));
        user.setCreatedAt(LocalDateTime.now());
        user.setUpdatedAt(LocalDateTime.now());

        // Badge de bienvenue
        Badge welcomeBadge = new Badge();
        welcomeBadge.setBadgeId("newcomer");
        welcomeBadge.setName("Nouveau Membre");
        welcomeBadge.setDescription("Bienvenue dans la communauté NIRD!");
        welcomeBadge.setRarity(Badge.BadgeRarity.COMMON);
        welcomeBadge.setUser(user);
        user.getBadges().add(welcomeBadge);

        // Enregistrer la connexion
        user.getStats().setLoginCount(1);
        user.getStats().setLastLogin(LocalDateTime.now());
        user.getStreak().setCurrent(1);
        user.getStreak().setLastActivity(LocalDateTime.now());

        user = userRepository.save(user);

        String token = jwtUtil.generateToken(user, user.getId(), user.getRole().getValue());

        Map<String, Object> response = new HashMap<>();
        response.put("token", token);
        response.put("user", formatUserResponse(user));
        return response;
    }

    public Map<String, Object> login(AuthRequest request) {
        Authentication authentication = authenticationManager.authenticate(
            new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
        );

        User user = (User) authentication.getPrincipal();

        if (!user.getIsActive()) {
            throw new RuntimeException("Votre compte a été désactivé");
        }

        // Enregistrer la connexion
        user.getStats().setLoginCount(user.getStats().getLoginCount() + 1);
        user.getStats().setLastLogin(LocalDateTime.now());
        updateStreak(user);
        userRepository.save(user);

        String token = jwtUtil.generateToken(user, user.getId(), user.getRole().getValue());

        Map<String, Object> response = new HashMap<>();
        response.put("token", token);
        response.put("user", formatUserResponse(user));
        return response;
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

