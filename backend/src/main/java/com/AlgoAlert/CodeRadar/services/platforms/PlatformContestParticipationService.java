package com.AlgoAlert.CodeRadar.services.platforms;

import java.util.Map;

public interface PlatformContestParticipationService {
    /**
     * Checks if a user participated in a contest on the platform.
     * @param handle The user's handle on the platform
     * @param contestId The contest's unique ID
     * @return Map with keys: participated (boolean), rank (Integer), score (Double), message (String), etc.
     */
    Map<String, Object> checkParticipation(String handle, String contestId);
} 