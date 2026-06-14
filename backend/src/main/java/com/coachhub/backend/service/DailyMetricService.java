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
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class DailyMetricService {

    private final DailyMetricRepository dailyMetricRepository;
    private final UserRepository userRepository;

    // Registra o actualiza la entrada de peso del dia para el atleta autenticado
    // Si ya existe un registro para esa fecha, lo sobreescribe en lugar de duplicar
    public DailyMetric addMetric(String email, DailyMetricRequest request) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("Usuario no encontrado"));

        Optional<DailyMetric> existing = dailyMetricRepository
                .findByUser_IdAndDate(user.getId(), request.getDate());

        DailyMetric metric = existing.orElse(new DailyMetric());
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

    // Devuelve el historico de peso de un atleta concreto, para que el coach lo consulte
    public List<DailyMetric> getMetricsByAthleteId(Long athleteId) {
        return dailyMetricRepository.findByUser_IdOrderByDateAsc(athleteId);
    }
}