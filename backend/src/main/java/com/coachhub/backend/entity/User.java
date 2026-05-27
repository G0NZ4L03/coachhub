package com.coachhub.backend.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;

import com.fasterxml.jackson.annotation.JsonProperty;

@Entity
@Table(name = "users")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false, unique = true)
    private String email;

    // WRITE_ONLY: el password se recibe en el registro pero 
    // nunca se devuelve en las respuestas JSON por seguridad
    @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
    @Column(nullable = false)
    private String password;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Role role;

    @Column(name = "is_active", nullable = false)
    private Boolean isActive = true;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "coach_id")
    private User coach;

    // Campos físicos del atleta (nullable)
    @Column(name = "birth_date")
    private LocalDate birthDate;

    @Enumerated(EnumType.STRING)
    private Gender gender;

    @Column(precision = 5, scale = 2)
    private BigDecimal height;

    @Column(name = "starting_weight", precision = 5, scale = 2)
    private BigDecimal startingWeight;

    @Column(columnDefinition = "TEXT")
    private String objective;

    public enum Role {
        COACH, ATHLETE
    }

    public enum Gender {
        MALE, FEMALE, OTHER
    }
}