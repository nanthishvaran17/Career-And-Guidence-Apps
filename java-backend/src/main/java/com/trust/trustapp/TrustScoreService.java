package com.trust.trustapp;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.time.temporal.ChronoUnit;
import java.util.Map;
import java.util.HashMap;

@Service
public class TrustScoreService {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    public Map<String, Object> calculateTrustScore(int userId) {
        String query = "SELECT name, email, phone, dob, education_level, stream, marks, interests, location, state, skills, created_at FROM users WHERE id = ?";
        
        Map<String, Object> response = new HashMap<>();

        try {
            Map<String, Object> userRow = jdbcTemplate.queryForMap(query, userId);
            
            int score = 0;
            int maxScore = 100;
            
            // 1. Profile Completeness (Max 80 points)
            String[] fieldsToCheck = {"name", "email", "phone", "dob", "education_level", "stream", "marks", "interests", "location", "state", "skills"};
            int pointsPerField = 80 / fieldsToCheck.length;
            
            for (String field : fieldsToCheck) {
                Object value = userRow.get(field);
                if (value != null && !String.valueOf(value).trim().isEmpty() && !String.valueOf(value).equals("[]")) {
                    score += pointsPerField;
                }
            }
            
            // 2. Trust Decay (Max 20 points)
            // Starts at 20. Decays by 1 point every week since created_at (or last updated if we had that field).
            int decayPoints = 20;
            Object createdAtObj = userRow.get("created_at");
            
            if (createdAtObj != null) {
                try {
                    // SQLite typical format: 2026-04-02 10:15:30
                    String createdStr = String.valueOf(createdAtObj);
                    DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");
                    if (createdStr.length() > 19) createdStr = createdStr.substring(0, 19);
                    LocalDateTime createdAt = LocalDateTime.parse(createdStr, formatter);
                    
                    long weeksPassed = ChronoUnit.WEEKS.between(createdAt, LocalDateTime.now());
                    
                    // Decays 1 point per week, capping decay at 20 points
                    decayPoints = Math.max(0, 20 - (int)weeksPassed);
                    
                } catch (Exception e) {
                    System.err.println("Error parsing date: " + e.getMessage());
                }
            }
            
            score += decayPoints;
            
            // Generate contextual advice
            String message = "Your profile is fairly new and fresh.";
            if (decayPoints < 10) {
                message = "Your profile information is getting old. Consider updating your skills to prevent trust decay!";
            } else if (score < 50) {
                message = "Your profile is very incomplete. Fill out missing fields like phone, dob, and skills to boost your Trust Score.";
            }

            response.put("userId", userId);
            response.put("trustScore", score);
            response.put("decayPointsLeft", decayPoints);
            response.put("status", "success");
            response.put("message", message);
            
        } catch (Exception e) {
            response.put("status", "error");
            response.put("message", "User not found or database error: " + e.getMessage());
        }

        return response;
    }
}
