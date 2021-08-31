package com.github.ricksliu.animelist_duel.controllers;

import com.github.ricksliu.animelist_duel.models.Enums;
import com.github.ricksliu.animelist_duel.models.GetUserRequest;
import com.github.ricksliu.animelist_duel.models.ScoreComparison;
import com.github.ricksliu.animelist_duel.models.User;
import com.github.ricksliu.animelist_duel.utility.MyAnimeListUtility;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
public class IndexApiController {
    @PostMapping("/getuser")
    public Map<String, Object> getuser(@RequestBody GetUserRequest body) {
        switch (body.getAnimeWebsite()) {
            case MAL:
                User user = MyAnimeListUtility.GetUser(body.getUsername());
                List<ScoreComparison> scoreComparisons = MyAnimeListUtility.GetScoreComparisons(body.getUsername(), body.getUsernames() != null ? body.getUsernames() : new ArrayList<>() );

                HashMap<String, Object> result = new HashMap<>();
                result.put("user", user);
                result.put("scoreComparisons", scoreComparisons);
                return result;

            default:
                return null;
        }
    }
}