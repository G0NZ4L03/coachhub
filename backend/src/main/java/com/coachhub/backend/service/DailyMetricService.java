package com.coachhub.backend.service;

import com.coachhub.backend.dto.DailyMetricRequest;
import com.coachhub.backend.entity.DailyMetric;
import com.coachhub.backend.entity.User;
import com.coachhub.backend.repository.DailyMetricRepository;
import com.coachhub.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class DailyMetricService {

    private final DailyMetricRepository dailyMetricRepository;
    private final UserRepository userRepository;

    // Registra una nueva entrada de peso para el atleta autenticado
    public DailyMetric addMetric(String email, DailyMetricRequest request) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("Usuario no encontrado"));

        DailyMetric metric = new DailyMetric();
        metric.setUser(user);
        metric.setDate(request.getDate());
        metric.setWeight(request.getWeight());
        metric.setSteps(request.getSteps());
        metric.setSleepHours(request.getSleepHours());

        return dailyMetricRepository.save(metric);
    }

    // Devuelve el historico de peso del atleta autenticado ordenado por fecha
    public List<DailyMetric> getMyMetrics(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("Usuario no encontrado"));

        return dailyMetricRepository.findByUser_IdOrderByDateAsc(user.getId());
    }
}