package com.coachhub.backend.repository;

import com.coachhub.backend.entity.Exercise;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ExerciseRepository extends JpaRepository<Exercise, Long> {
    // Buscamos por grupo muscular para filtrar en el frontend si hace falta
    List<Exercise> findByMuscleGroup(String muscleGroup);
}