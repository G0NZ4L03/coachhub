package com.coachhub.backend.repository;

import com.coachhub.backend.entity.DailyMetric;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface DailyMetricRepository extends JpaRepository<DailyMetric, Long> {
    List<DailyMetric> findByUser_IdOrderByDateAsc(Long userId);
    Optional<DailyMetric> findByUser_IdAndDate(Long userId, LocalDate date);
}