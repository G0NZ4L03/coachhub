package com.coachhub.backend.controller;

import com.coachhub.backend.dto.DailyMetricRequest;
import com.coachhub.backend.entity.DailyMetric;
import com.coachhub.backend.service.DailyMetricService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/metrics")
@RequiredArgsConstructor
public class DailyMetricController {

    private final DailyMetricService dailyMetricService;

    // El atleta registra una nueva entrada de peso
    @PostMapping
    public ResponseEntity<DailyMetric> addMetric(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestBody DailyMetricRequest request) {
        return ResponseEntity.ok(dailyMetricService.addMetric(userDetails.getUsername(), request));
    }

    // Devuelve el historico de peso del atleta autenticado para la grafica
    @GetMapping
    public ResponseEntity<List<DailyMetric>> getMyMetrics(
            @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(dailyMetricService.getMyMetrics(userDetails.getUsername()));
    }
    
    // El coach consulta las metricas de un atleta concreto
    @GetMapping("/athlete/{athleteId}")
    public ResponseEntity<List<DailyMetric>> getAthleteMetrics(@PathVariable Long athleteId) {
        return ResponseEntity.ok(dailyMetricService.getMetricsByAthleteId(athleteId));
    }

}