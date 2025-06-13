package com.AlgoAlert.CodeRadar.controllers;


import com.AlgoAlert.CodeRadar.dto.ContestDto;
import com.AlgoAlert.CodeRadar.services.ContestService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/contests")
@CrossOrigin(origins = "*")
public class ContestController {

    @Autowired
    private ContestService contestService;

    @GetMapping("/upcoming")
    public List<ContestDto> getUpcomingContests(@RequestParam(required = false) String site) {
        return contestService.getContests(site);
    }
}
