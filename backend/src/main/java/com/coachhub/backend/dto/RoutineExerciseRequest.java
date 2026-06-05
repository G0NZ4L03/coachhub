package com.coachhub.backend.dto;

import lombok.Data;
import java.time.LocalDate;

@Data
public class RoutineExerciseRequest {
    private Long exerciseId;
    private LocalDate assignedDate;
    private Integer sets;
    private Integer reps;
    private Integer rir;
    private Integer restSeconds;
}