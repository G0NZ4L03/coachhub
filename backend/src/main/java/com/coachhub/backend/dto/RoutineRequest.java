package com.coachhub.backend.dto;

import lombok.Data;
import java.time.LocalDate;

@Data
public class RoutineRequest {
    private Long athleteId;
    private String name;
    private String notes;
    private LocalDate startDate;
    private LocalDate endDate;
}