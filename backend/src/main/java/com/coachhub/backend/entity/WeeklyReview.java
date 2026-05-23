package com.coachhub.backend.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Table(name = "weekly_reviews")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class WeeklyReview {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(nullable = false)
    private LocalDate date;

    @Column(name = "photo_path")
    private String photoPath;

    @Column(columnDefinition = "TEXT")
    private String notes;

    @Column(precision = 5, scale = 2)
    private BigDecimal waist;

    @Column(precision = 5, scale = 2)
    private BigDecimal chest;

    @Column(precision = 5, scale = 2)
    private BigDecimal shoulders;

    @Column(precision = 5, scale = 2)
    private BigDecimal arms;

    @Column(precision = 5, scale = 2)
    private BigDecimal thighs;

    @Column(precision = 5, scale = 2)
    private BigDecimal hips;
}