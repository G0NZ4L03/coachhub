package com.coachhub.backend.dto;

import com.coachhub.backend.entity.User;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
public class UpdateProfileRequest {
    private LocalDate birthDate;
    private User.Gender gender;
    private BigDecimal height;
    private BigDecimal startingWeight;
    private String objective;
}