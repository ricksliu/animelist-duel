package com.github.ricksliu.animelist_duel.models;

import java.util.List;

public class GetUserRequest {
    private Enums.AnimeWebsite animeWebsite;
    private String username;
    private List<String> usernames;
    private boolean update;

    public Enums.AnimeWebsite getAnimeWebsite() {
        return animeWebsite;
    }

    public void setAnimeWebsite(Enums.AnimeWebsite animeWebsite) {
        this.animeWebsite = animeWebsite;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public List<String> getUsernames() {
        return usernames;
    }

    public void setUsernames(List<String> usernames) {
        this.usernames = usernames;
    }

    public boolean isUpdate() {
        return update;
    }

    public void setUpdate(boolean update) {
        this.update = update;
    }
}
