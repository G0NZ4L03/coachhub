package com.coachhub.backend.service;

import com.coachhub.backend.dto.RoutineExerciseRequest;
import com.coachhub.backend.dto.RoutineRequest;
import com.coachhub.backend.entity.Exercise;
import com.coachhub.backend.entity.Routine;
import com.coachhub.backend.entity.RoutineExercise;
import com.coachhub.backend.entity.User;
import com.coachhub.backend.repository.ExerciseRepository;
import com.coachhub.backend.repository.RoutineExerciseRepository;
import com.coachhub.backend.repository.RoutineRepository;
import com.coachhub.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;


@Service
@RequiredArgsConstructor
public class RoutineService {

    private final RoutineRepository routineRepository;
    private final RoutineExerciseRepository routineExerciseRepository;
    private final ExerciseRepository exerciseRepository;
    private final UserRepository userRepository;

    // Crea una rutina nueva y la asigna al atleta indicado
    public Routine createRoutine(RoutineRequest request) {
        User athlete = userRepository.findById(request.getAthleteId())
                .orElseThrow(() -> new RuntimeException("Atleta no encontrado"));
    
        // Desactivamos la rutina actual antes de crear la nueva
        List<Routine> existing = routineRepository.findByAthlete_Id(athlete.getId());
        existing.forEach(r -> r.setIsActive(false));
        routineRepository.saveAll(existing);
    
        Routine routine = new Routine();
        routine.setAthlete(athlete);
        routine.setName(request.getName());
        routine.setNotes(request.getNotes());
        routine.setStartDate(request.getStartDate());
        routine.setEndDate(request.getEndDate());
        routine.setIsActive(true);
    
        return routineRepository.save(routine);
    }

    // Añade un ejercicio concreto a una rutina existente con su fecha asignada
    public RoutineExercise addExerciseToRoutine(Long routineId, RoutineExerciseRequest request) {
        Routine routine = routineRepository.findById(routineId)
                .orElseThrow(() -> new RuntimeException("Rutina no encontrada"));

        Exercise exercise = exerciseRepository.findById(request.getExerciseId())
                .orElseThrow(() -> new RuntimeException("Ejercicio no encontrado"));

        RoutineExercise re = new RoutineExercise();
        re.setRoutine(routine);
        re.setExercise(exercise);
        re.setAssignedDate(request.getAssignedDate());
        re.setSets(request.getSets());
        re.setReps(request.getReps());
        re.setRir(request.getRir());
        re.setRestSeconds(request.getRestSeconds());

        return routineExerciseRepository.save(re);
    }

    // Devuelve todas las rutinas de un atleta concreto
    public List<Routine> getRoutinesByAthlete(Long athleteId) {
        return routineRepository.findByAthlete_Id(athleteId);
    }

    // Devuelve todos los ejercicios de una rutina con su fecha asignada
    public List<RoutineExercise> getExercisesByRoutine(Long routineId) {
        return routineExerciseRepository.findByRoutine_Id(routineId);
    }

    // Lista todos los ejercicios disponibles del catalogo
    public List<Exercise> getAllExercises() {
        return exerciseRepository.findAll();
    }

    // Devuelve la rutina activa del atleta, si tiene alguna
    public Optional<Routine> getActiveRoutine(Long athleteId) {
        return routineRepository.findByAthlete_IdAndIsActiveTrue(athleteId);
    }
}