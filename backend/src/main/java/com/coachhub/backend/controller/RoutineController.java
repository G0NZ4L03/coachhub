package com.coachhub.backend.controller;

import com.coachhub.backend.dto.RoutineExerciseRequest;
import com.coachhub.backend.dto.RoutineRequest;
import com.coachhub.backend.entity.Exercise;
import com.coachhub.backend.entity.Routine;
import com.coachhub.backend.entity.RoutineExercise;
import com.coachhub.backend.service.RoutineService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class RoutineController {

    private final RoutineService routineService;

    // Lista todos los ejercicios del catalogo para que el coach los seleccione
    @GetMapping("/exercises")
    public ResponseEntity<List<Exercise>> getAllExercises() {
        return ResponseEntity.ok(routineService.getAllExercises());
    }

    // El coach crea una rutina nueva asignada a un atleta
    @PostMapping("/routines")
    public ResponseEntity<Routine> createRoutine(@RequestBody RoutineRequest request) {
        return ResponseEntity.ok(routineService.createRoutine(request));
    }

    // Añade un ejercicio a una rutina con fecha, series, repeticiones y RIR
    @PostMapping("/routines/{id}/exercises")
    public ResponseEntity<RoutineExercise> addExercise(
            @PathVariable Long id,
            @RequestBody RoutineExerciseRequest request) {
        return ResponseEntity.ok(routineService.addExerciseToRoutine(id, request));
    }

    // Devuelve las rutinas de un atleta concreto
    @GetMapping("/routines/athlete/{athleteId}")
    public ResponseEntity<List<Routine>> getRoutinesByAthlete(@PathVariable Long athleteId) {
        return ResponseEntity.ok(routineService.getRoutinesByAthlete(athleteId));
    }

    // Devuelve los ejercicios de una rutina concreta con todos sus parametros
    @GetMapping("/routines/{id}/exercises")
    public ResponseEntity<List<RoutineExercise>> getExercisesByRoutine(@PathVariable Long id) {
        return ResponseEntity.ok(routineService.getExercisesByRoutine(id));
    }
}