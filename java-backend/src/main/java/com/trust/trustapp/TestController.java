package com.trust.trustapp;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import java.util.HashMap;
import java.util.Map;

@RestController
public class TestController {

    @GetMapping("/api/trust-decay/status")
    public Map<String, String> checkStatus() {
        Map<String, String> status = new HashMap<>();
        status.put("message", "Trust-Decay Prototype Backend is running successfully!");
        status.put("status", "ok");
        return status;
    }
}
