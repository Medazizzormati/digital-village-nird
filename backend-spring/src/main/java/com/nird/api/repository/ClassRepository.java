package com.nird.api.repository;

import com.nird.api.model.ClassEntity;
import com.nird.api.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface ClassRepository extends JpaRepository<ClassEntity, UUID> {
    List<ClassEntity> findByTeacher(User teacher);
    Optional<ClassEntity> findByCode(String code);
    List<ClassEntity> findByTeacherAndIsActive(User teacher, Boolean isActive);
}

