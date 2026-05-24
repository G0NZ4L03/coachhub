package com.coachhub.backend.repository;

import com.coachhub.backend.entity.Routine;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RoutineRepository extends JpaRepository<Routine, Long> {
    List<Routine> findByAthlete_Id(Long athleteId);
}