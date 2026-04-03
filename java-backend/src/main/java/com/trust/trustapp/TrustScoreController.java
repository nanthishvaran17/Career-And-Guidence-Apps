package com.trust.trustapp;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/trust-decay")
@CrossOrigin(origins = "*") // Allows React frontend to hit this API
public class TrustScoreController {

    @Autowired
    private TrustScoreService trustScoreService;

    @GetMapping("/score/{userId}")
    public Map<String, Object> getTrustScore(@PathVariable int userId) {
        return trustScoreService.calculateTrustScore(userId);
    }
}
