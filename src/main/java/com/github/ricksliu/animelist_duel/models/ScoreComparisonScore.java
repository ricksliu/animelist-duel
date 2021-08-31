package com.github.ricksliu.animelist_duel.models;

public class ScoreComparisonScore {
    private String username;
    private double score;

    public ScoreComparisonScore(String username, double score) {
        this.username = username;
        this.score = score;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String userId) {
        this.username = userId;
    }

    public double getScore() {
        return score;
    }

    public void setScore(Double score) {
        this.score = score;
    }
}
