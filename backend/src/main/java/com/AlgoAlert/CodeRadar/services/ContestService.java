package com.AlgoAlert.CodeRadar.services;


import com.AlgoAlert.CodeRadar.dto.ContestDto;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ContestService {

    private final String KOTESTS_API = "https://kontests.net/api/v1/all";

    public List<ContestDto> getContests(String platform){
        RestTemplate restTemplate = new RestTemplate();
        ObjectMapper mapper = new ObjectMapper();

        try {
            ContestDto[] contests = mapper.readValue(restTemplate.getForObject(KOTESTS_API,String.class),ContestDto[].class);

            if (platform == null || platform.isEmpty()){
                return Arrays.asList(contests);
            }

            return Arrays.stream(contests).filter(c -> c.getSite().equalsIgnoreCase(platform)).collect(Collectors.toList());
        } catch (Exception e) {
            throw new RuntimeException("Failed to fetch contests : " + e.getMessage());
        }
    }
}
