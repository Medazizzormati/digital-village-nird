package com.nird.api.controller;

import com.nird.api.dto.ApiResponse;
import com.nird.api.model.Role;
import com.nird.api.model.User;
import com.nird.api.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = "*")
@PreAuthorize("hasAnyRole('ADMIN', 'SUPER_ADMIN')")
public class AdminController {
    @Autowired
    private UserRepository userRepository;

    @GetMapping("/users")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getAllUsers(
            @RequestParam(required = false) String role,
            @RequestParam(required = false) String search,
            @RequestParam(defaultValue = "1") Integer page,
            @RequestParam(defaultValue = "20") Integer limit,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "desc") String order) {
        
        Pageable pageable = PageRequest.of(page - 1, limit, 
            Sort.by(order.equals("asc") ? Sort.Direction.ASC : Sort.Direction.DESC, sortBy));
        
        Page<User> usersPage;
        if (role != null && !role.isEmpty()) {
            try {
                Role roleEnum = Role.fromString(role);
                if (search != null && !search.isEmpty()) {
                    usersPage = userRepository.findByRoleAndSearch(roleEnum, search, pageable);
                } else {
                    usersPage = userRepository.findByRole(roleEnum, pageable);
                }
            } catch (IllegalArgumentException e) {
                usersPage = Page.empty(pageable);
            }
        } else if (search != null && !search.isEmpty()) {
            usersPage = userRepository.findBySearch(search, pageable);
        } else {
            usersPage = userRepository.findAll(pageable);
        }

        Map<String, Object> response = new HashMap<>();
        response.put("data", usersPage.getContent().stream()
            .map(this::formatUserResponse)
            .collect(Collectors.toList()));
        response.put("pagination", Map.of(
            "page", page,
            "limit", limit,
            "total", usersPage.getTotalElements(),
            "pages", usersPage.getTotalPages()
        ));

        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @GetMapping("/users/{id}")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getUserById(@PathVariable Long id) {
        User user = userRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé"));
        return ResponseEntity.ok(ApiResponse.success(formatUserResponse(user)));
    }

    @GetMapping("/stats")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getGlobalStats() {
        List<User> allUsers = userRepository.findAll();
        
        Map<String, Object> stats = new HashMap<>();
        stats.put("users", Map.of(
            "total", allUsers.size(),
            "active", allUsers.stream().mapToLong(u -> u.getIsActive() ? 1 : 0).sum()
        ));
        
        stats.put("gamification", Map.of(
            "totalXP", allUsers.stream().mapToLong(User::getXp).sum(),
            "avgXP", allUsers.isEmpty() ? 0 : 
                (int) allUsers.stream().mapToLong(User::getXp).average().orElse(0),
            "maxXP", allUsers.stream().mapToInt(User::getXp).max().orElse(0),
            "avgLevel", allUsers.isEmpty() ? 1 : 
                (int) allUsers.stream().mapToInt(User::getLevel).average().orElse(1)
        ));

        return ResponseEntity.ok(ApiResponse.success(stats));
    }

    private Map<String, Object> formatUserResponse(User user) {
        Map<String, Object> response = new HashMap<>();
        response.put("id", user.getId());
        response.put("name", user.getName());
        response.put("email", user.getEmail());
        response.put("role", user.getRole().getValue());
        response.put("permissions", user.getPermissions());
        response.put("xp", user.getXp());
        response.put("level", user.getLevel());
        response.put("isActive", user.getIsActive());
        response.put("createdAt", user.getCreatedAt());
        return response;
    }
}

