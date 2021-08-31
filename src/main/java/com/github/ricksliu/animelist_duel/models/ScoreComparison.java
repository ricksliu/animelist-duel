package com.github.ricksliu.animelist_duel.models;

import java.util.List;

public class ScoreComparison {
    private Enums.AnimeWebsite animeWebsite;
    private String id;
    private String name;
    private String image;
    private List<ScoreComparisonScore> scores;

    public Enums.AnimeWebsite getAnimeWebsite() {
        return animeWebsite;
    }

    public void setAnimeWebsite(Enums.AnimeWebsite animeWebsite) {
        this.animeWebsite = animeWebsite;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getImage() {
        return image;
    }

    public void setImage(String image) {
        this.image = image;
    }

    public List<ScoreComparisonScore> getScores() {
        return scores;
    }

    public void setScores(List<ScoreComparisonScore> scores) {
        this.scores = scores;
    }
}
