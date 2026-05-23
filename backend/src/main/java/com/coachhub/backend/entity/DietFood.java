package com.coachhub.backend.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.math.BigDecimal;

@Entity
@Table(name = "diet_foods")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class DietFood {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "diet_id", nullable = false)
    private Diet diet;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "food_id", nullable = false)
    private Food food;

    @Column(name = "meal_time")
    private String mealTime;

    @Column(precision = 6, scale = 2)
    private BigDecimal grams;
}