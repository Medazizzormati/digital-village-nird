package com.nird.api.dto;

import com.nird.api.model.Role;
import com.nird.api.validation.ValidPassword;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class RegisterRequest {
    @NotBlank(message = "Le nom est requis")
    @Size(max = 50, message = "Le nom ne peut pas dépasser 50 caractères")
    private String name;

    @NotBlank(message = "L'email est requis")
    @Email(message = "Email invalide")
    private String email;

    @NotBlank(message = "Le mot de passe est requis")
    @ValidPassword
    private String password;

    private Role role = Role.PUBLIC;
    private String roleData; // JSON string
}

