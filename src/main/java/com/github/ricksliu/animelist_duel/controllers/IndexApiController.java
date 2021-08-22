package com.github.ricksliu.animelist_duel.controllers;

import com.github.ricksliu.animelist_duel.models.Enums;
import com.github.ricksliu.animelist_duel.models.User;
import com.github.ricksliu.animelist_duel.utility.MyAnimeListUtility;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class IndexApiController {
    @GetMapping("/getuser")
    public User getuser(@RequestParam(name="animeWebsite", required=true) Enums.AnimeWebsite animeWebsite, @RequestParam(name="username", required=true) String username) {
        switch (animeWebsite) {
            case MAL:
                String html = MyAnimeListUtility.GetProfileHTML(username);
                User user = MyAnimeListUtility.GetUserFromHTML(username, html);
                return user;
            default:
                return new User();
        }
    }
}