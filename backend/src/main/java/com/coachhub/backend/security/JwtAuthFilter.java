package com.coachhub.backend.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
@RequiredArgsConstructor
public class JwtAuthFilter extends OncePerRequestFilter {

    private final JwtService jwtService;
    private final UserDetailsService userDetailsService;

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain)
            throws ServletException, IOException {
    
        final String authHeader = request.getHeader("Authorization");
    
        // Log temporal para diagnosticar el 403
        System.out.println(">>> REQUEST: " + request.getMethod() + " " + request.getRequestURI());
        System.out.println(">>> AUTH HEADER: " + authHeader);
    
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            System.out.println(">>> NO TOKEN - pasando sin autenticar");
            filterChain.doFilter(request, response);
            return;
        }
    
        final String token = authHeader.substring(7);
        System.out.println(">>> TOKEN VALIDO: " + jwtService.isTokenValid(token));
    
        if (!jwtService.isTokenValid(token)) {
            filterChain.doFilter(request, response);
            return;
        }
    
        final String email = jwtService.extractEmail(token);
        System.out.println(">>> EMAIL EXTRAIDO: " + email);
    
        if (email != null && SecurityContextHolder.getContext().getAuthentication() == null) {
            var userDetails = userDetailsService.loadUserByUsername(email);
            var authToken = new UsernamePasswordAuthenticationToken(
                    userDetails, null, userDetails.getAuthorities());
            authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
            SecurityContextHolder.getContext().setAuthentication(authToken);
            System.out.println(">>> AUTENTICACION ESTABLECIDA para: " + email);
        }
    
        filterChain.doFilter(request, response);
    }
}