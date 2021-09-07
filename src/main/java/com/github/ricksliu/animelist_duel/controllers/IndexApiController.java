package com.github.ricksliu.animelist_duel.controllers;

import com.github.ricksliu.animelist_duel.models.GetUserRequest;
import com.github.ricksliu.animelist_duel.models.ScoreComparison;
import com.github.ricksliu.animelist_duel.models.User;
import com.github.ricksliu.animelist_duel.utility.MyAnimeListUtility;
import org.springframework.web.bind.annotation.*;

import java.util.*;

import static com.github.ricksliu.animelist_duel.models.Constants.maxUsers;

@RestController
public class IndexApiController {
    @PostMapping("/getuser")
    public Map<String, Object> getuser(@RequestBody GetUserRequest body) throws Exception {
        if ((body.getUsernames() != null ? body.getUsernames().size() : 0) + 1 > maxUsers) {
            throw new Exception(String.format("Exceeded maximum of %d users.", maxUsers));
        }

        switch (body.getAnimeWebsite()) {
            case MAL:
                User user = MyAnimeListUtility.getUser(body.getUsername(), body.isUpdate());
                List<ScoreComparison> scoreComparisons = MyAnimeListUtility.getScoreComparisons(body.getUsername(), body.getUsernames() != null ? body.getUsernames() : new ArrayList<>() );

                HashMap<String, Object> result = new HashMap<>();
                result.put("user", user);
                result.put("scoreComparisons", scoreComparisons);
                return result;

            default:
                return null;
        }
    }
}