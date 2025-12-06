package com.nird.api.model;

public enum Role {
    STUDENT("student"),
    TEACHER("teacher"),
    DIRECTOR("director"),
    PUBLIC("public"),
    ADMIN("admin"),
    SUPER_ADMIN("super_admin");

    private final String value;

    Role(String value) {
        this.value = value;
    }

    public String getValue() {
        return value;
    }

    public static Role fromString(String value) {
        for (Role role : Role.values()) {
            if (role.value.equalsIgnoreCase(value)) {
                return role;
            }
        }
        return PUBLIC;
    }
}

