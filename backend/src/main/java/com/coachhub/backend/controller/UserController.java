package com.coachhub.backend.controller;

import com.coachhub.backend.dto.UpdateProfileRequest;
import com.coachhub.backend.entity.User;
import com.coachhub.backend.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @GetMapping("/me")
    public ResponseEntity<User> getMe(@AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(userService.getByEmail(userDetails.getUsername()));
    }

    @PutMapping("/profile")
    public ResponseEntity<User> updateProfile(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestBody UpdateProfileRequest request) {
        return ResponseEntity.ok(userService.updateProfile(userDetails.getUsername(), request));
    }

    @GetMapping("/my-athletes")
    public ResponseEntity<List<User>> getMyAthletes(
            @AuthenticationPrincipal UserDetails userDetails) {
        User coach = userService.getByEmail(userDetails.getUsername());
        return ResponseEntity.ok(userService.getAthletesByCoach(coach.getId()));
    }

    @PostMapping("/link-athlete")
    public ResponseEntity<User> linkAthlete(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestParam String athleteEmail) {
        return ResponseEntity.ok(userService.linkAthlete(userDetails.getUsername(), athleteEmail));
    }

    // Devuelve los datos completos de un atleta concreto para que el coach vea su ficha
    @GetMapping("/athletes/{id}")
    public ResponseEntity<User> getAthleteById(
        @AuthenticationPrincipal UserDetails userDetails,
        @PathVariable Long id) {
    return ResponseEntity.ok(userService.getAthleteById(userDetails.getUsername(), id));
    }
}