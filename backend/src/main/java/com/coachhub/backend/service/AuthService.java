package com.coachhub.backend.service;

import com.coachhub.backend.dto.AuthResponse;
import com.coachhub.backend.dto.LoginRequest;
import com.coachhub.backend.dto.RegisterRequest;
import com.coachhub.backend.entity.User;
import com.coachhub.backend.repository.UserRepository;
import com.coachhub.backend.security.JwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {

    private static final String COACH_SECRET = "COACH2026";

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;

    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("El email ya está registrado");
        }

        if (request.getRole() == User.Role.COACH) {
            if (request.getSecretCode() == null || !request.getSecretCode().equals(COACH_SECRET)) {
                throw new RuntimeException("Código secreto de coach incorrecto");
            }
        }

        User user = new User();
        user.setName(request.getName());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRole(request.getRole());
        user.setIsActive(true);

        userRepository.save(user);

        String token = jwtService.generateToken(user.getEmail());
        boolean onboardingComplete = isOnboardingComplete(user);

        return new AuthResponse(token, user.getRole().name(), user.getName(), user.getId(), onboardingComplete, user.getStartingWeight());
    }

    public AuthResponse login(LoginRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
        );

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        String token = jwtService.generateToken(user.getEmail());
        boolean onboardingComplete = isOnboardingComplete(user);

        return new AuthResponse(token, user.getRole().name(), user.getName(), user.getId(), onboardingComplete, user.getStartingWeight());
    }

    private boolean isOnboardingComplete(User user) {
        if (user.getRole() == User.Role.COACH) return true;
        return user.getHeight() != null && user.getStartingWeight() != null;
    }
}