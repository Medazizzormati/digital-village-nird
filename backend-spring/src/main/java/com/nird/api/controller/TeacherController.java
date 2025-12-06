package com.nird.api.controller;

import com.nird.api.dto.ApiResponse;
import com.nird.api.model.ClassEntity;
import com.nird.api.model.User;
import com.nird.api.repository.ClassRepository;
import com.nird.api.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/teacher")
@CrossOrigin(origins = "*")
@PreAuthorize("hasAnyRole('TEACHER', 'DIRECTOR', 'ADMIN', 'SUPER_ADMIN')")
public class TeacherController {
    @Autowired
    private ClassRepository classRepository;

    @Autowired
    private UserRepository userRepository;

    @PostMapping("/classes")
    public ResponseEntity<ApiResponse<ClassEntity>> createClass(
            @RequestBody Map<String, String> request, Authentication authentication) {
        User teacher = (User) authentication.getPrincipal();
        teacher = userRepository.findById(teacher.getId()).orElseThrow();

        ClassEntity newClass = new ClassEntity();
        newClass.setName(request.get("name"));
        newClass.setDescription(request.get("description"));
        newClass.setGrade(request.get("grade"));
        newClass.setSubject(request.get("subject"));
        newClass.setEstablishment(request.getOrDefault("establishment", ""));
        newClass.setAcademicYear(request.getOrDefault("academicYear", getCurrentAcademicYear()));
        newClass.setTeacher(teacher);
        newClass.setCreatedAt(LocalDateTime.now());
        newClass.setUpdatedAt(LocalDateTime.now());

        newClass = classRepository.save(newClass);
        return ResponseEntity.ok(ApiResponse.success("Classe créée avec succès", newClass));
    }

    @GetMapping("/classes")
    public ResponseEntity<ApiResponse<List<ClassEntity>>> getMyClasses(Authentication authentication) {
        User teacher = (User) authentication.getPrincipal();
        teacher = userRepository.findById(teacher.getId()).orElseThrow();

        List<ClassEntity> classes = classRepository.findByTeacher(teacher);
        return ResponseEntity.ok(ApiResponse.success(classes));
    }

    @GetMapping("/classes/{id}")
    public ResponseEntity<ApiResponse<ClassEntity>> getClassById(
            @PathVariable java.util.UUID id, Authentication authentication) {
        User teacher = (User) authentication.getPrincipal();
        teacher = userRepository.findById(teacher.getId()).orElseThrow();

        ClassEntity classEntity = classRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Classe non trouvée"));

        if (!classEntity.getTeacher().getId().equals(teacher.getId())) {
            return ResponseEntity.status(403)
                .body(ApiResponse.error("Vous n'avez pas accès à cette classe"));
        }

        return ResponseEntity.ok(ApiResponse.success(classEntity));
    }

    private String getCurrentAcademicYear() {
        int year = LocalDateTime.now().getYear();
        int month = LocalDateTime.now().getMonthValue();
        if (month >= 9) {
            return year + "-" + (year + 1);
        }
        return (year - 1) + "-" + year;
    }
}

