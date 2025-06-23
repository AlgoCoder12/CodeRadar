package com.AlgoAlert.CodeRadar.controllers;

import com.AlgoAlert.CodeRadar.dto.ExternalProblemDTO;
import com.AlgoAlert.CodeRadar.enums.Platform;
import com.AlgoAlert.CodeRadar.services.PotdService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/potd")
public class PotdController {

    @Autowired
    private PotdService potdService;

    @GetMapping("/{platform}")
    public ResponseEntity<ExternalProblemDTO> getProblemByPlatform(@PathVariable String platform) {
        try {
            ExternalProblemDTO problem = potdService.getProblemByPlatform(platform);
            return problem != null ? ResponseEntity.ok(problem) : ResponseEntity.notFound().build();
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/range/{topic}/{minRating}/{maxRating}")
    public ResponseEntity<ExternalProblemDTO> getProblemByRangeOnCF(@PathVariable String topic, @PathVariable Integer minRating, @PathVariable Integer maxRating) {
        try {
            ExternalProblemDTO problem = potdService.getProblemByRangeOnCF(topic, minRating, maxRating);
            System.out.println(problem);
            return problem != null ? ResponseEntity.ok(problem) : ResponseEntity.notFound().build();
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping
    public ResponseEntity<List<ExternalProblemDTO>> getAllProblems() {
        List<ExternalProblemDTO> problems = potdService.getAllProblems();
        return ResponseEntity.ok(problems);
    }
}