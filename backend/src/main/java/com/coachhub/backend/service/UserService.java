package com.coachhub.backend.service;

import com.coachhub.backend.dto.UpdateProfileRequest;
import com.coachhub.backend.entity.User;
import com.coachhub.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;

    public User getByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("Usuario no encontrado"));
    }

    public User updateProfile(String email, UpdateProfileRequest request) {
        User user = getByEmail(email);
        user.setBirthDate(request.getBirthDate());
        user.setGender(request.getGender());
        user.setHeight(request.getHeight());
        user.setStartingWeight(request.getStartingWeight());
        user.setObjective(request.getObjective());
        return userRepository.save(user);
    }

    public List<User> getAthletesByCoach(Long coachId) {
        return userRepository.findByCoach_Id(coachId);
    }

    public User linkAthlete(String coachEmail, String athleteEmail) {
        User coach = getByEmail(coachEmail);
        User athlete = userRepository.findByEmail(athleteEmail)
                .orElseThrow(() -> new RuntimeException("Atleta no encontrado con ese email"));

        if (athlete.getRole() != User.Role.ATHLETE) {
            throw new RuntimeException("El usuario no es un atleta");
        }

        athlete.setCoach(coach);
        return userRepository.save(athlete);
    }

    // Busca el atleta por id y verifica que pertenece al coach que hace la peticion
    // Si el atleta no es del coach, lanzamos excepcion para evitar accesos cruzados
    public User getAthleteById(String coachEmail, Long athleteId) {
        User coach = getByEmail(coachEmail);
        User athlete = userRepository.findById(athleteId)
                .orElseThrow(() -> new RuntimeException("Atleta no encontrado"));

        if (athlete.getCoach() == null || !athlete.getCoach().getId().equals(coach.getId())) {
            throw new RuntimeException("Este atleta no pertenece a tu cuenta");
        }

        return athlete;
    }
}