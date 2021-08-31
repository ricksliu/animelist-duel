package com.github.ricksliu.animelist_duel.models;

import java.util.List;

public class ScoreComparison {
    private String name;
    private String image;
    private List<ScoreComparisonScore> scores;

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
