package com.coachhub.backend.repository;

import com.coachhub.backend.entity.DailyMetric;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DailyMetricRepository extends JpaRepository<DailyMetric, Long> {
    List<DailyMetric> findByUser_IdOrderByDateAsc(Long userId);
}